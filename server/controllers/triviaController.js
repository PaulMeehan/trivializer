const db = require('../models')
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: '780018',
  key: 'e5795cf1dfac2a8aee31',
  secret: '70f1d215a0ab9da7dd76',
  cluster: 'us2',
  encrypted: true
});

module.exports = {
  getAllGameQuestions: (req, res) => {
    // get from host on 'create game' screen
    // need: host userId
    // get /api/question
    // response: {
    //  questions: [question list{}]
    //  qNum: integer
    //  isActive: t/f
    //  time: int
    // }
    console.log('\n****\ngetAllGameQuestions\n****\n')
    const _id = req.user._id
    db.User.findOne({ _id })
      .then(user => {
        console.log(user.game)
        res.json(user.game)
      })
  },
  addQuestion: (req, res) => {
    // post from host on 'create game' screen
    // need: host userId
    // post /api/question
    // response: {
    //  questions: [question list{}]
    // }
    console.log('\n****\naddQuestion\n****\n')
    const _id = req.user._id
    const questions = req.body
    // console.log(questions)
    db.User.update( { _id: _id }, {
      $set: {
        game: questions
      }
    }).then(confirm => {
      console.log(confirm)
      db.User.findOne({ _id })
        .then(record => {
          res.json(record.game)
        })
    })
  },
  nextQuestion: (req, res) => {
    // post from host on 'game management' screen
    // need: host userId
    // TODO: will require pusher to broadcast new question
    // post /api/next
    // respones: {
    //
    // }
    console.log('\n****\nnextQuestion\n****\n')
    pusher.trigger('game-question', 'new-question', {message: 'nextQuestion fired from trigger'})
    res.send(200)
  },
  endQuestion: (req, res) => {
    // post from host on 'game management' screen
    // need: host userId
    // post  /api/end
    // TODO: will require pusher to broadcast end question
    console.log('\n****\nendQuestion\n****\n')
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