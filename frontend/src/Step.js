// Step.js
import React, { useState, useEffect } from 'react';

const Step = ({ step, questionId, resetTrigger }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [explanation, setExplanation] = useState(''); // New state for explanation

  useEffect(() => {
    // Clear feedback, userAnswer, and explanation whenever resetTrigger changes
    setUserAnswer('');
    setFeedback(null);
    setExplanation('');
  }, [resetTrigger]);

  const checkAnswer = async () => {
    if (!userAnswer || userAnswer.trim() === '') {
      setFeedback('Please enter an answer.');
      setExplanation('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          stepId: step.id,
          userAnswer,
        }),
      });

      const result = await response.json();
      console.log('Validation Result:', result); // Debugging line

      if (result.isCorrect) {
        setFeedback('Correct!');
        if (result.explanation) {
          setExplanation(result.explanation);
          console.log('Showing Explanation'); // Debugging line
        }
      } else {
        setFeedback(`Incorrect. The correct answer is: ${result.correctAnswer}`);
        setExplanation(''); // Clear explanation if previously set
      }

      setUserAnswer('');
    } catch (error) {
      console.error('Error during validation:', error); // Debugging line
      setFeedback('An error occurred while validating your answer.');
      setExplanation('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      checkAnswer();
    }
  };

  const handleFeedbackClick = () => {
    setFeedback(null);
    setExplanation('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4>Step {step.id}</h4>
      <p>{step.instruction}</p>
      <textarea
        rows="2"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your command..."
      ></textarea>
      <button onClick={checkAnswer}>Check Answer</button>
      {feedback && (
        <div
          className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'
            }`}
          onClick={handleFeedbackClick}
          style={{ cursor: 'pointer' }}
        >
          {feedback}
        </div>
      )}
      {/* Render explanation inline if available */}
      {feedback === 'Correct!' && explanation && (
        <div className="explanation">
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Step;
