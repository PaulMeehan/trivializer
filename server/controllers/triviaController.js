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
  return q
}
const prepAnswers = (answers, qNum) => {
  const a = []
  /* will be
    answers = [
      {
        hostname: 'dp',
        qNum: 1,
        playerName: 'elvis',
        response: 'A',
        points: 0
      },
      {
        hostname: 'dp',
        qNum: 2,
        playerName: 'elvis',
        response: 'B'
        points: 2
      },
      {
        hostname: 'dp',
        qNum: 1,
        playerName: 'mark',
        response: 'C',
        points: 1
      },
      etc...
    ]
    needs to be [[playerName, response], [playerName, response], etc...]
  */
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
  q.qNum = Math.max(0, q.qNum)
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
    console.log('\n****\ngetAllGameQuestions\n****\n')
    const _id = req.user._id
    db.User.findOne({ _id })
      .then(user => {
        res.json(prepQuestions(user))
      })
  },
  addQuestion: (req, res) => {
    console.log('\n****\naddQuestion\n****\n')
    const _id = req.user._id
    const questions = req.body
    db.User.update( { _id }, {
      $set: {
        game: questions
      }
    }).then(confirm => {
      console.log(confirm)
      db.User.findOne({ _id })
        .then(record => {
          res.json(prepQuestions(record))
        })
    })
  },
  nextQuestion: (req, res) => {
    console.log('\n****\nnextQuestion\n****\n')
    const _id = req.user._id
    const username = req.user.username
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
                  db.GameResponse.remove({hostName: username})
                  .then(cleared => {
                    pusher.trigger('game-question', username, newGame)
                    res.json(newGame)
                  })
                })
            })

        }
        else if (rec.qNum === totalQuestionNumber) { // set game to inactive & push end game function
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
                  db.GameResponse.find({ hostName: username })
                    .then(answers => {
                      newRec.qNum = totalQuestionNumber - 1
                      const gameSummary = prepCurrentGameQuestion(newRec, answers)
                      pusher.trigger('game-question', username, gameSummary)
                      res.json(gameSummary)
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
                  db.GameResponse.find({ hostName: username })
                    .then(answers => {
                      const gameStatus = prepCurrentGameQuestion(newRec, answers)
                      pusher.trigger('game-question', username, gameStatus)
                      res.json(gameStatus)
                    })
                })
            })
        }
      })
  },
  endQuestion: (req, res) => {
    // post from host on 'game management' screen
    // need: host userId
    // post  /api/end
    // TODO: will require pusher to broadcast end question
    console.log('\n****\nendQuestion\n****\n')
    pusher.trigger('game-question', 'new-question', { message: 'nextQuestion fired from trigger' })
    res.send(200)
  },
  submitAnswer: (req, res) => {
    // post from player on game-play screen
    // need: player userId, gameId or hostId, question number, answer
    // post /api/:GAMEID/:qNum/:choice
    console.log('\n****\nsubmitAnswer\n****\n')
    res.send(200)
  },
  getQuestion: (req, res) => {
    // get from player on game-play screen
    // need: gameId or hostId
    // get /api/:GAMEID
    console.log('\n****\ngetQuestion\n****\n')
    res.send(200)
  },
  endGame: (req, res) => {
    // post from host
    // need: host userId
    // post /api/endGame
    // TODO: will require pusher to broadcast end game
    console.log('\n****\nendGame\n****\n')
    res.send(200)
  },
  scoreBoard: (req, res) => {
    /*  get from host
        need: host userId
        get /api/scoreBoard
        Client needs:
          {
            labels: [team names],
            datasets: [
              { data: [team scores] },
              { backgroundColor: [colors of bars] }, // leader - #34edaf", everyone else #ed4634"
            ],
            options: {
              responsive: true,
              scales : {
                xAxes: [{
                  ticks:  {
                    beginAtZero: true,
                    min: 0,
                    max: {TOTAL NUMBER OF QUESTIONS IN GAME}
                  }
                }]
              }
            }
          }
    */
   console.log('\n****\nscoreBoard\n****\n')
   res.send(200)
  }
}