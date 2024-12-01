// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const questions = require('./questions.json'); // Load questions from JSON file

// Middleware
app.use(cors());
app.use(express.json());

// Root route for '/'
app.get('/', (req, res) => {
  res.send('Backend is running. Use /api/questions or /api/validate for API endpoints.');
});

// Route: Get all questions (without answers and explanations)
app.get('/api/questions', (req, res) => {
  const questionsWithoutAnswers = questions.map((q) => ({
    id: q.id,
    title: q.title,
    steps: q.steps.map((s) => ({
      id: s.id,
      instruction: s.instruction
    }))
  }));
  res.json(questionsWithoutAnswers);
});

// Route: Validate user answer
app.post('/api/validate', (req, res) => {
  const { questionId, stepId, userAnswer } = req.body;

  console.log('Request Body:', req.body); // Log the incoming request body

  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    console.error('Question not found for ID:', questionId);
    return res.status(404).json({ error: 'Question not found' });
  }

  const step = question.steps.find((s) => s.id === stepId);
  if (!step) {
    console.error('Step not found for ID:', stepId);
    return res.status(404).json({ error: 'Step not found' });
  }

  console.log('Step Found:', step); // Log the step object to verify its content

  const isCorrect = userAnswer.trim().toLowerCase() === step.answer.trim().toLowerCase();
  res.json({
    isCorrect,
    ...(isCorrect ? { explanation: step.explanation } : { correctAnswer: step.answer }),
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
