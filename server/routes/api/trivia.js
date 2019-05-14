const router = require('express').Router()
const triviaController = require('../../controllers/triviaController')

router.get('/question',triviaController.getAllGameQuestions)
router.post('/question', triviaController.addQuestion)
router.post('/next', triviaController.nextQuestion)
router.post('/end', triviaController.endQuestion)
router.post('/endGame', triviaController.endGame)
router.get('/scoreBoard', triviaController.scoreBoard)
router.post('/play/:gameId/:qNum/:choice', triviaController.submitAnswer)
router.get('/play/:gameId', triviaController.getQuestion)

module.exports = router
