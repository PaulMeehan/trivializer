const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameResponseSchema = new Schema({
  host:
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
  response:
  {
    type: String,
    default: 'No Answer'
  },
  points:
  {
    type: Number,
    default: 1
  }
});

const GameResponse = mongoose.model("GameResponse", gameResponseSchema);

module.exports = GameResponse;