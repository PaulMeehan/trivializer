/*
  Imports & Variables
*/

const db = require('../models')
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: '780018',
  key: 'e5795cf1dfac2a8aee31',
  secret: '70f1d215a0ab9da7dd76',
  cluster: 'us2',
  encrypted: true
});

/*
  Function Farm
*/
const prepQuestions = questions => {
  const q = {}
  q.name = questions.username
  q.game = questions.game
  q.qNum = questions.qNum
  q.isActive = questions.questionActive
  q.gameActive = questions.gameActive
  return q
}
const prepAnswers = (answers, qNum) => {
  const a = []
  for (let i in answers) {
    if (answers[i].qNum === qNum) {
      a.push([answers[i].playerName, answers[i].response])
    }
  }
  return a
}
const prepCurrentGameQuestion = (questions, answers) => {

  /*
    function  variables
  */
  answers = answers || []
  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const q = prepQuestions(questions)
  console.log("\n\nLOOK AT THIS: " + q.qNum)
  const a = prepAnswers(answers, q.qNum)

  /*
    current question prep
  */
  q.question = q.game[Math.max(0,q.qNum)]
  q.question.answerText = q.question.choices[alphabet.indexOf(q.question.answer)]
  q.qNum = q.qNum
  q.totalQ = q.game.length

  /*
    answer prep
  */

  // answers need to be [[teamName1,answer], [teamName2,answer], etc...]
  q.ansRcvd = a

  // barData.labels prep
  const labels = []
  for (let i in q.question.choices) labels.push(q.question.choices[i])
  q.barData = {}
  q.barData.labels = labels

  // barData.datasets.data & barData.datasets.backgroundColor prep
  q.barData.datasets = {}
  const data = []
  const colors = []
  for (let i = 0; i < q.question.choices.length; i++) {

    // background colors
    let color = '#ed4634'
    if (alphabet[i] === q.question.answer) color = '#34edaf'
    colors.push(color)

    // data - tally count of each answer
    for (let j in a)  {
      let count = 0
      if (a[j][1] === alphabet[i]) count++
      data.push(count)
    }
  }
  q.barData.datasets.data = data
  q.barData.datasets.backgroundColor = colors
  // finished - return q
  return q
}

/*
  Export / Meat & Potatoes
*/

module.exports = {
  getAllGameQuestions: (req, res) => {
    const _id = req.user._id
    db.User.findOne({ _id })
    .then(user => {
      res.json(prepQuestions(user))
    })
  },
  addQuestion: (req, res) => {
    const _id = req.user._id
    const questions = req.body
    db.User.update( { _id }, {
      $set: {
        game: questions
      }
    }).then(confirm => {
      db.User.findOne({ _id })
        .then(record => {
          res.json(prepQuestions(record))
        })
    })
  },
  nextQuestion: (req, res) => {
    const _id = req.user._id
    const host = req.user.username
    // get current qNum
    db.User.findOne( { _id } )
    .then(user => {
      const rec = prepQuestions(user)
      const totalQuestionNumber = rec.game.length - 1
      const nextQ = rec.qNum + 1

      /*
        start game logic
      */
      if (rec.qNum < 0) { // game is starting
        // set game, question to active, iterate qNum, push next question & finish
        db.User.update({ _id }, {
          $set: {
            qNum: nextQ,
            questionActive: true,
            gameActive: true
          }
        })
        .then(success => {  // pull game data, parse appropriately & push response
          db.User.findOne({ _id })
          .then(newRec => {
            const newGame = prepCurrentGameQuestion(newRec)
            // clear out prior answers to prevent contamination
            db.GameResponse.remove({hostName: host})
            .then(cleared => {
              pusher.trigger('game-question', host, newGame)
              res.json(prepQuestions(newRec))
            })
          })
        })
      }
      else if (rec.qNum === totalQuestionNumber || !user.gameActive) { // set game to inactive & push end game function
        db.User.update({ _id }, {
          $set: {
            qNum: -1,
            questionActive: false,
            gameActive: false
          }
        })
        .then(gameOver => { // pull answers & push answers
          db.User.findOne({ _id })
          .then(newRec => {
            db.GameResponse.find({ hostName: host })
            .then(answers => {
              // newRec.qNum = totalQuestionNumber - 1
              const gameSummary = prepCurrentGameQuestion(newRec, answers)
              pusher.trigger('game-question', host, gameSummary)
              res.json(prepQuestions(newRec))
            })
          })
        })
      }
      else {  // we are in the middle of the game, iterate qNum & push next question
        db.User.update({ _id }, { $set: {
          qNum: nextQ,
          questionActive: true
        }})
        .then(success => {
          db.User.findOne({ _id })
          .then(newRec => {
            db.GameResponse.find({ hostName: host })
            .then(answers => {
              const gameStatus = prepCurrentGameQuestion(newRec, answers)
              pusher.trigger('game-question', host, gameStatus)
              res.json(prepQuestions(newRec))
            })
          })
        })
      }
    })
  },
  endQuestion: (req, res) => {
    const _id = req.user._id
    const host = req.user.username
    db.User.update({ _id }, { $set: { questionActive: false }})
    .then(confirm => {
      db.User.findOne({ _id })
      .then(user => {
        db.GameResponse.find({ hostName: host })
        .then(answers => {
          const game = prepCurrentGameQuestion(user, answers)
          pusher.trigger('game-question', host, game)
          res.json(prepQuestions(user))
        })
      })
    })
  },
  submitAnswer: (req, res) => {
    const player = req.user.username
    const host = req.params.host
    const qNum = req.params.qNum
    const choice = req.params.choice
    // make sure they haven't already answered this question
    db.GameResponse.find({ hostName: host, playerName: player, qNum: qNum })
    .then(found => {
      if (found.length) {
        return res.send(200)
      }
      // make sure the question and game are both active
      db.User.find({ username: host })
      .then(game => {
        game = game[0]
        if (!game.gameActive || !game.questionActive || qNum != game.qNum) {
          return res.send(200)
        }
        // game & question are both active and user hasn't submitted an answer yet
        // now check if they are right
        if (game.game[qNum].answer === choice.toUpperCase()) {  // correct answer
          // were they the first correct answer?
          db.GameResponse.find({ hostName: host, qNum: qNum, points: 2 })
          .then(someoneElse => {
            let points = 1
            if (someoneElse.length) points = 2
            db.GameResponse.create({
              hostName: host,
              playerName: player,
              qNum: qNum,
              response: choice,
              points: points
            })
            .then(answerRecorded => {
              db.GameResponse.find({ hostName: host, qNum: qNum })
              .then(answers => {
                const gameStatus = prepCurrentGameQuestion(game, answers)
                pusher.trigger('game-question', host, gameStatus)
                res.json(gameStatus)
              })
            })
          })
        }
        else {  // incorrect answer
          db.GameResponse.create({
            hostName: host,
            playerName: player,
            qNum: qNum,
            response: choice,
            points: 0
          })
          .then(answerRecorded => {
            db.GameResponse.find({ hostName: host, qNum: qNum })
            .then(answers => {
              const gameStatus = prepCurrentGameQuestion(game, answers)
              pusher.trigger('game-question', host, gameStatus)
              res.json(gameStatus)
            })
          })
        }
      })
    })
  },
  getQuestion: (req, res) => {
    const host = req.params.host
    const player = req.user.username
    // see if the question is active
    db.User.findOne({ username: host })
    .then(game => {
      if (!game.gameActive || !game.questionActive || game.qNum === -1) {
        return res.json(prepCurrentGameQuestion(game))
      }
      // see if the player has answered already
      db.GameResponse.find({ hostName: host, qNum: game.qNum, playerName: player })
      .then(answered => {
        if (answered.length) return res.json({message:'You already answered this question'})
        db.GameResponse.find({ hostName: host })
        .then(answers => {
          res.json(prepCurrentGameQuestion(game, answers))
        })
      })
    })
  },
  endGame: (req, res) => {
    const _id = req.user._id
    const host = req.user.username
    db.User.update({ _id }, { $set: { gameActive: false, questionActive: false }})
    .then(updated => {
      db.User.findOne({ _id })
      .then(game => {
        db.GameResponse.find({ hostName: host })
        .then(answers => {
          const response = prepCurrentGameQuestion(game, answers)
          pusher.trigger('game-question', host, game)
          console.log(prepQuestions(game))
          res.json(prepQuestions(game))
        })
      })
    })
  },
  scoreBoard: (req, res) => {
    const hostName = req.user.username
    const _id = req.user._id
    db.GameResponse.find({ hostName })
    .then(responses => {
      const labels = [], data = [], backGroundColor = []
      let max = 0
      // make labels (teamNames)
      for (let i in responses) {
        if (labels.indexOf(responses[i].playerName) === -1) labels.push(responses[i].playerName)
      }
      // tally team scores
      for (let i in labels) {
        let teamScore = 0
        for (let j in responses) {
          if (responses[j].playerName === labels[i]) teamScore += parseInt(responses[j].points)
        }
        data.push(teamScore)
      }
      // get highScore value
      let highScore = 0
      for (let i in data) highScore = Math.max(highScore, data[i])
      //make backgroundColors
      for (let i in data) {
        let color = '#ed4634'
        if (data[i] === highScore) color = '#34edaf'
        backGroundColor.push(color)
      }
      // get game length
      db.User.findOne({ _id })
      .then(game => {
        game = prepCurrentGameQuestion(game)
        const response = {
          labels: labels,
          datasets: [
            { data: data },
            { backgroundColor: backGroundColor }
          ],
          options: {
            responsive: true,
            scales : {
              xAxes: [{
                ticks:  {
                  beginAtZero: true,
                  min: 0,
                  max: game.game.length
                }
              }]
            }
          }
        }
        res.json(response)
      })
    })
  }
}