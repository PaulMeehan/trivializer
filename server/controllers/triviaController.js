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
  console.log("**\n**\n**\n a = " + a + "\n**\n**\n**")

  // barData.labels prep
  const labels = []
  for (let i in q.question.choices) labels.push(q.question.choices[i])
  q.barData = {}
  q.barData.labels = labels

  // barData.datasets.data & barData.datasets.backgroundColor prep
  q.barData.datasets = []
  const datasetsInnerObject = {
    data: [],
    backgroundColor: [],
  }
  // const data = []
  // const colors = []
  console.log("**\n**\n**\n q.question.choices.length = " + q.question.choices.length + "\n**\n**\n**")
  for (let i = 0; i < q.question.choices.length; i++) {
    console.log("\n\ndatasets FOR loop, trip " + i)
    // background colors
    let color = '#ed4634'
    if (alphabet[i] === q.question.answer) color = '#34edaf'
    datasetsInnerObject.backgroundColor.push(color)

    // data - tally count of each answer
    let count = 0
    for (let j in a)  {
      console.log("datasets score tally FOR loop, trip " + j)
      console.log("a length = " + a.length)
      if (a[j][1] === alphabet[i]) count++
    }
    datasetsInnerObject.data.push(count)
  }
  q.barData.datasets[0] = datasetsInnerObject;
  // q.barData.datasets.data = data
  // q.barData.datasets.backgroundColor = colors
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
    const hostName = req.user.username
    const questions = req.body
    // update game & reset to start
    db.User.update( { _id }, {
      $set: {
        game: questions,
        qNum: -1,
        questionActive: false,
        gameActive: false
      }
    })
    .then(confirm => {
      // delete all responses
      db.GameResponse.remove({ hostName })
      .then(confirm => {
        db.User.findOne({ _id })
        .then(record => {
          res.json(prepQuestions(record))
        })
        .catch(err => console.log('err'))
      })
    })
    .catch(err => console.log(err))
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
      // is game is starting?
      if (rec.qNum < 0) {
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
      // is game over?
      else if (rec.qNum === totalQuestionNumber || !user.gameActive) {
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
      // we're in the midddle of the game
      else {
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
      // if they have - ignore this request
      if (found.length) return res.send(200)
      // they haven't already answered - more checking is in order
      db.User.findOne({ username: host })
      .then(game => {
        // make sure the game & question are active & that the answer is for the live question
        if (!game.gameActive || !game.questionActive || qNum != game.qNum) {
          return res.send(200)
        }

        // was their answer right?
        if (game.game[qNum].answer === choice.toUpperCase()) {

          // check for other someone on this queston who got 2 points (first correct)
          db.GameResponse.find({ hostName: host, qNum: qNum, points: 2 })
          .then(someoneElse => {
            // default  score
            let points = 1
            // if no-one else answered though, they get 2 points
            if (someoneElse.length) points = 2
            // record their correct response
            db.GameResponse.create({
              hostName: host,
              playerName: player,
              qNum: qNum,
              response: choice,
              points: points
            })
            // blast updated info
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
        // Their answer was wrong
        else {
          db.GameResponse.create({
            hostName: host,
            playerName: player,
            qNum: qNum,
            response: choice,
            points: 0
          })
          // blast updated info
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
    // see if the question is active
    db.User.findOne({ username: host })
    .then(game => {
      // does this game exist? if not respond appropriately
      if (!game || game.length === 0) return res.json({message: 'dne'})
      // the game exists, give them what they want
      db.GameResponse.find({ hostName: host })
      .then(answers => {
        res.json(prepCurrentGameQuestion(game, answers))
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
          pusher.trigger('game-question', host, response)
          res.json(prepQuestions(game))
        })
      })
    })
  },
  scoreBoard: (req, res) => {
    const hostName = req.user.username
    const _id = req.user._id

    // get the responses
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
          barOptions: {
            legend: {
                display: false, // static value
            },
            responsive: true, // static value
            maintainAspectRatio: false, // static value
            scales: {
              xAxes: [{
                position: "top", // static value
                ticks: {
                  beginAtZero: true, // static value
                  min: 0, // static value
                  max: game.game.length, // THIS VALUE NEEDS TO BE SET TO THE TOTAL # OF QUESTIONS FOR THE GAME!!
                  fontColor: "#ffffff", // static value
                  fontSize: 30, // static value
                  stepSize: 1, // static value
                },
                gridLines: {
                  color: "#ffffff" // static value
                }
              }],
              yAxes: [{
                ticks: {
                  fontColor: "#ffffff", // static value
                  fontSize: 30, // static value
                  fontFamily: "'Bangers', sans-serif" // static value
                },
                gridLines: {
                  color: "#ffffff" // static value
                }
              }]
            }
          },
          answerData: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: backGroundColor
              }
            ]
          }
        }
        res.json(response)
      })
    })
  },
  setGameTime: (req, res) => {
    const _id = req.user._id
    const time = parseInt(req.params.time)
    db.User.findOne({ _id })
    .then(user => {
      if (user.qNum < 0) return res.send(200)
      user.game[user.qNum].time = time
      db.User.update({ _id }, { $set: {game: user.game}})
      .then(res.send(200))
    })
  }
}