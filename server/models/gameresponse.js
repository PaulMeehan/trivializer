const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameresponseSchema = new Schema({
  ownerId_fk: 
  { 
    type: Number, 
    required: true
  },
  questionNumber:
  {
    type: Number,
    required: true
  },
  teamName:
  {
    type: String,
    required: true
  },
  answerGiven:
  {
    type: String,
    required: true
  },
  responseOrder:
  {
    type: Number,
    required: true
  },
  points:
  {
    type: Number,
    required: true
  }
});

const Gameresponse = mongoose.model("Gameresponse", gameresponseSchema);

module.exports = Gameresponse;