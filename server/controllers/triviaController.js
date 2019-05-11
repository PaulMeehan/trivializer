const db = require('../db')
const Pusher = require('pusher');
const pusher = new Pusher({
  appId: '780018',
  key: 'e5795cf1dfac2a8aee31',
  secret: '70f1d215a0ab9da7dd76',
  cluster: 'us2',
  encrypted: true
});

/*
  Pusher strategy
  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  use channel 'game' for all pushed notifications
  make all notifications objects ala
  {
    game: gameId,
    data: { data }
  }
  then require the client to check if gameId === gameId
  when it receives a message. If so (gameid), then look
  at the data, else ignore it

  Pusher strategy
  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾


*/

module.exports = {
  getAllGameQuestions: (req, res) => {
    // get from host on 'create game' screen
    // need: host userId
    // get /api/question
  },
  addQuestion: (req, res) => {
    // post from host on 'create game' screen
    // need: host userId
    // post /api/question

  },
  nextQuestion: (req, res) => {
    // post from host on 'game management' screen
    // need: host userId
    // TODO: will require pusher to broadcast new question
    // post /api/next

  },
  deleteQuestion: (req, res) => {
    // delete from host on 'game management' screen
    // need: host userId, new question array
    // delete /api/question
  },
  endQuestion: (req, res) => {
    // post from host on 'game management' screen
    // need: host userId
    // post  /api/end
    // TODO: will require pusher to broadcast end question
  },
  submitAnswer: (req, res) => {
    // post from player on game-play screen
    // need: player userId, gameId or hostId, question number, answer
    // post /api/:GAMEID/:qNum/:choice
  },
  getQuestion: (req, res) => {
    // get from player on game-play screen
    // need: gameId or hostId
    // get /api/:GAMEID

  },
  endGame: (req, res) => {
    // post from host
    // need: host userId
    // post /api/endGame
    // TODO: will require pusher to broadcast end game
  },
  scoreBoard: (req, res) => {
    // get from host
    // need: host userId
    // get /api/scoreBoard
  }
}