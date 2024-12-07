// frontend/src/Test.js
import React, { useState, useEffect } from 'react';
import Question from './Question';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/questions')
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setResetTrigger((prev) => !prev);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setResetTrigger((prev) => !prev);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setResetTrigger((prev) => !prev);
    }
  };

  // Fetch attempts when currentQuestion changes
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      fetch(`http://localhost:5000/api/attempts/${currentQuestion.id}`)
        .then((res) => res.json())
        .then((attemptsData) => {
          setAttempts(attemptsData);
        })
        .catch((error) => console.error('Error fetching attempts:', error));
    }
  }, [currentQuestionIndex, questions]);

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
                margin: '0 5px'
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
          resetTrigger={resetTrigger}
          attempts={attempts}
        />
      )}
      {questions.length === 0 && <p>Loading questions...</p>}
    </div>
  );
};

export default Test;
