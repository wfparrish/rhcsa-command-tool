import React, { useState, useEffect } from 'react';
import Question from './Question';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/questions')
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
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
              Question {index + 1}
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
        />
      )}
      {questions.length === 0 && <p>Loading questions...</p>}
    </div>
  );
};

export default Test;
