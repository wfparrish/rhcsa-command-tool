// backend/models/UserAttempt.js
const mongoose = require('mongoose');

const UserAttemptSchema = new mongoose.Schema({
  questionId: Number,
  stepId: Number,
  userAnswer: String,
  isCorrect: Boolean,
  correctAnswer: String,
  explanation: String,
  dismissed: { type: Boolean, default: false }, // New field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAttempt', UserAttemptSchema);
