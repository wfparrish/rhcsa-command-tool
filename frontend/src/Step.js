import React, { useState, useEffect } from 'react';

const Step = ({ step, questionId, resetTrigger }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Clear feedback and userAnswer whenever resetTrigger changes
    setUserAnswer('');
    setFeedback(null);
  }, [resetTrigger]);

  const checkAnswer = async () => {
    if (!userAnswer || userAnswer.trim() === '') {
      setFeedback('Please enter an answer.');
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

      if (result.isCorrect) {
        setFeedback('Correct!');
      } else {
        setFeedback(`Incorrect. The correct answer is: ${result.correctAnswer}`);
      }

      setUserAnswer('');
    } catch (error) {
      setFeedback('An error occurred while validating your answer.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      checkAnswer();
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
          className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'
            }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default Step;
