const router = require("express").Router()
const triviaRoutes = require('./trivia')

// Book routes
router.use("/", triviaRoutes)

module.exports = router
