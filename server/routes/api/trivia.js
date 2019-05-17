const router = require('express').Router()
const triviaController = require('../../controllers/triviaController')

router.get('/question',triviaController.getAllGameQuestions)
router.post('/question', triviaController.addQuestion)
router.post('/next', triviaController.nextQuestion)
router.post('/end', triviaController.endQuestion)
router.post('/endGame', triviaController.endGame)
router.get('/scoreBoard', triviaController.scoreBoard)
router.post('/play/:host/:qNum/:choice', triviaController.submitAnswer)
router.get('/play/:host', triviaController.getQuestion)
router.post('/time/:time', triviaController.setGameTime)

module.exports = router
