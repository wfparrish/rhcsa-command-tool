import React, { useState, useEffect } from 'react';
import Question from './Question';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    // On initial load, check localStorage first
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    return savedIndex ? Number(savedIndex) : 0; // Default to 0 if none saved
  });
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

  // Whenever currentQuestionIndex changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

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

  const clearAttemptsForQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/attempts/${questionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAttempts([]); // Clear attempts locally
        setResetTrigger((prev) => !prev); // Trigger a reset of steps if needed
      } else {
        console.error('Failed to clear attempts');
      }
    } catch (error) {
      console.error('Error clearing attempts:', error);
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
              className="question-nav-button"
              style={{
                backgroundColor:
                  currentQuestionIndex === index ? '#c8e6c9' : '#ffffff',
                color: currentQuestionIndex === index ? '#1b5e20' : '#00796b'
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
          onClearAttempts={() => clearAttemptsForQuestion(questions[currentQuestionIndex].id)}
        />
      )}
      {questions.length === 0 && <p>Loading questions...</p>}
    </div>
  );
};

export default Test;
