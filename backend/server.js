// backend/server.js

require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Question = require('./models/Question');
const UserAttempt = require('./models/UserAttempt');

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL in production
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running. Use /api/questions or /api/validate for API endpoints.');
});

// GET all questions (no answers revealed)
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find({});
    const questionsWithoutAnswers = questions.map((q) => ({
      id: q.id,
      title: q.title,
      steps: q.steps.map((s) => ({
        id: s.id,
        instruction: s.instruction
      }))
    }));
    res.json(questionsWithoutAnswers);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate user answer and save attempt
app.post('/api/validate', async (req, res) => {
  const { questionId, stepId, userAnswer } = req.body;

  console.log('Received validate request:', req.body);

  if (questionId === undefined || stepId === undefined || !userAnswer) {
    console.error('Missing required fields:', { questionId, stepId, userAnswer });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const question = await Question.findOne({ id: questionId });
    if (!question) {
      console.error('Question not found:', questionId);
      return res.status(404).json({ error: 'Question not found' });
    }

    const step = question.steps.find(s => s.id === stepId);
    if (!step) {
      console.error('Step not found:', stepId);
      return res.status(404).json({ error: 'Step not found' });
    }

    console.log('Fetched Step:', step);

    if (!step.answer) { // Updated from correctAnswer to answer
      console.error('Step does not have an answer:', step);
      return res.status(500).json({ error: 'Server error: Missing answer for step.' });
    }

    if (typeof userAnswer !== 'string') {
      console.error('userAnswer is not a string:', userAnswer);
      return res.status(400).json({ error: 'Invalid userAnswer type.' });
    }

    const isCorrect = userAnswer.trim().toLowerCase() === step.answer.trim().toLowerCase(); // Updated

    // Save attempt
    const attempt = new UserAttempt({
      questionId,
      stepId,
      userAnswer,
      isCorrect,
      correctAnswer: step.answer, // Updated
      explanation: isCorrect ? step.explanation : '',
      dismissed: false
    });

    await attempt.save();

    res.json({
      isCorrect,
      ...(isCorrect ? { explanation: step.explanation } : { correctAnswer: step.answer })
    });
  } catch (error) {
    console.error('Error during validation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET latest non-dismissed attempts for a question
app.get('/api/attempts/:questionId', async (req, res) => {
  const { questionId } = req.params;
  try {
    const attempts = await UserAttempt.find({ questionId: Number(questionId) }).sort({ createdAt: -1 }).lean();

    // Create a map to store the latest non-dismissed attempt per step
    const latestAttempts = {};
    attempts.forEach(attempt => {
      if (!latestAttempts[attempt.stepId] && !attempt.dismissed) {
        latestAttempts[attempt.stepId] = attempt;
      }
    });

    // Convert the map to an array
    const response = Object.values(latestAttempts);
    res.json(response);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH to dismiss an attempt
app.patch('/api/attempts/:questionId/:stepId', async (req, res) => {
  const { questionId, stepId } = req.params;
  const { dismissed } = req.body;

  try {
    const attempt = await UserAttempt.findOneAndUpdate(
      { questionId: Number(questionId), stepId: Number(stepId), dismissed: false },
      { $set: { dismissed: !!dismissed } },
      { new: true }
    );

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found or already dismissed' });
    }

    res.json(attempt);
  } catch (error) {
    console.error('Error updating attempt dismissal:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
