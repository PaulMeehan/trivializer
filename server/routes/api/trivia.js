const router = require('express').Router()
const triviaController = require('../../controllers/triviaController')

router.get('/question',triviaController.getAllGameQuestions)
router.post('/question', triviaController.addQuestion)
router.delete('/question', triviaController.deleteQuestion)
router.post('/next', triviaController.nextQuestion)
router.post('/end', triviaController.endQuestion)
router.post('/:gameId/:qNum/:choice', triviaController.submitAnswer)
router.get('/:gameId', triviaController.getQuestion)
router.post('/endGame', triviaController.endGame)
router.get('/scoreBoard', triviaController.scoreBoard)

module.exports = router
