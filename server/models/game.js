const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  host: { type: String, required: true },
	game: { type:	Array, unique: false, required: false, default: [] },
	gameActive: { type: Boolean, default: false },
	questionActive: { type: Boolean, default: false },
	qNum: { type: Number, default: -1 },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;