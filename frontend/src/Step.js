// frontend/src/Step.js
import React, { useState, useEffect } from 'react';

const Step = ({ step, questionId, resetTrigger, previousAttempt }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    setUserAnswer('');
    setFeedback(null);
    setExplanation('');
  }, [resetTrigger]);

  useEffect(() => {
    // Load previous attempt if exists and not dismissed
    if (previousAttempt && !previousAttempt.dismissed) {
      if (previousAttempt.isCorrect) {
        setFeedback('Correct!');
        setExplanation(previousAttempt.explanation);
      } else {
        setFeedback(`Incorrect. The correct answer is: ${previousAttempt.correctAnswer}`);
        setExplanation('');
      }
    } else if (previousAttempt && previousAttempt.dismissed) {
      // If previously dismissed, do not show feedback
      setFeedback(null);
      setExplanation('');
    }
  }, [previousAttempt]);

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
        body: JSON.stringify({ questionId, stepId: step.id, userAnswer }),
      });

      const result = await response.json();
      if (result.isCorrect) {
        setFeedback('Correct!');
        if (result.explanation) {
          setExplanation(result.explanation);
        }
      } else {
        setFeedback(`Incorrect. The correct answer is: ${result.correctAnswer}`);
        setExplanation('');
      }

      setUserAnswer('');
    } catch (error) {
      console.error('Error during validation:', error);
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

  const handleFeedbackClick = async () => {
    // If we have a previousAttempt saved and currently showing feedback, dismiss it
    if (previousAttempt && feedback) {
      try {
        await fetch(`http://localhost:5000/api/attempts/${questionId}/${step.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dismissed: true })
        });
        // After successful update, clear local feedback
        setFeedback(null);
        setExplanation('');
      } catch (err) {
        console.error('Error updating dismissal:', err);
      }
    } else {
      // If no previousAttempt or not showing feedback from DB, just clear local state
      setFeedback(null);
      setExplanation('');
    }
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
          className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}
          onClick={handleFeedbackClick}
          style={{ cursor: 'pointer', marginTop: '10px', padding: '5px' }}
        >
          {feedback}
        </div>
      )}
      {feedback === 'Correct!' && explanation && (
        <div className="explanation" style={{ marginTop: '10px' }}>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Step;
