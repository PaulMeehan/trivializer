const router = require("express").Router()
const bookRoutes = require("./books")
const triviaRoutes = require('./trivia')

// Book routes
router.use("/books", bookRoutes)
router.use("/", triviaRoutes)

module.exports = router
