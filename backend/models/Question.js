// backend/models/Question.js
const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  id: Number,
  instruction: String,
  answer: String,
  explanation: String
});

const QuestionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  steps: [StepSchema]
});

module.exports = mongoose.model('Question', QuestionSchema);
