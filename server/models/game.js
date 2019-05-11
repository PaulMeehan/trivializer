const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  question: { type: String, required: true },
  qNum: { type: Number, required: true, default: -1},
  qActive:  { type: Boolean, required: true, default: false},
  qTimeRemain: { type: Number, required: true, default: 0 }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;