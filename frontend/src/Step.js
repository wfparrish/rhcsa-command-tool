import React, { useState } from 'react';

const Step = ({ step, questionId }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

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

      setUserAnswer(''); // Clear the input after submission
    } catch (error) {
      setFeedback('An error occurred while validating your answer.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent a new line in the textarea
      checkAnswer(); // Trigger the Check Answer function
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
        onKeyDown={handleKeyDown} // Listen for the Enter key
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
