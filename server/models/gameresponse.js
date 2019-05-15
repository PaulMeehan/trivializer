const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameResponseSchema = new Schema({
  hostName:
  {
    type: String,
    required: true
  },
  qNum:
  {
    type: Number,
    required: true
  },
  playerName:
  {
    type: String,
    required: true
  },
  answerGiven:
  {
    type: String,
    default: 'Did Not Answer'
  },
  points:
  {
    type: Number,
    default: 1
  }
});

const GameResponse = mongoose.model("GameResponse", gameResponseSchema);

module.exports = GameResponse;