// Test.js
import React, { useState, useEffect } from 'react';
import Question from './Question';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(false); // Add a reset trigger

  useEffect(() => {
    // Fetch questions from the backend or local file
    fetch('http://localhost:5000/api/questions')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Questions:', data); // Debug: Log fetched questions
        setQuestions(data);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setResetTrigger((prev) => !prev); // Toggle reset trigger to notify Step components
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setResetTrigger((prev) => !prev); // Toggle reset trigger to notify Step components
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setResetTrigger((prev) => !prev); // Toggle reset trigger to notify Step components
    }
  };

  return (
    <div className="container">
      <h1>RHCSA Practice App</h1>
      {questions.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => navigateToQuestion(index)}
              style={{
                backgroundColor:
                  currentQuestionIndex === index ? '#c8e6c9' : '#ffffff',
                color: currentQuestionIndex === index ? '#1b5e20' : '#00796b',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      {questions.length > 0 && (
        <Question
          question={questions[currentQuestionIndex]}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={currentQuestionIndex === 0}
          isLast={currentQuestionIndex === questions.length - 1}
          resetTrigger={resetTrigger} // Pass the reset trigger to the Question component
        />
      )}
      {questions.length === 0 && <p>Loading questions...</p>}
    </div>
  );
};

export default Test;
