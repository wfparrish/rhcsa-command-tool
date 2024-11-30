import React from 'react';
import Step from './Step';

const Question = ({ question, onNext, onPrevious, isFirst, isLast }) => {
  return (
    <div>
      <h2>{question.title}</h2>
      {question.steps.map((step) => (
        <Step key={step.id} step={step} questionId={question.id} /> // Pass questionId here
      ))}
      <div>
        {!isFirst && <button onClick={onPrevious}>Previous</button>}
        {!isLast && <button onClick={onNext}>Next</button>}
      </div>
    </div>
  );
};

export default Question;
