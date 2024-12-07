import React from 'react';
import Step from './Step';

const Question = ({ question, onNext, onPrevious, isFirst, isLast, resetTrigger, attempts, onClearAttempts }) => {
  return (
    <div>
      <h2>{question.title}</h2>
      {question.steps.map((step) => {
        const stepAttempt = attempts.find(
          (attempt) => attempt.stepId === step.id && attempt.questionId === question.id
        );
        return (
          <Step
            key={step.id}
            step={step}
            questionId={question.id}
            resetTrigger={resetTrigger}
            previousAttempt={stepAttempt}
          />
        );
      })}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {!isFirst && <button onClick={onPrevious}>Previous</button>}
        {!isLast && <button onClick={onNext}>Next</button>}
        {/* New Clear Attempts Button */}
        <button onClick={onClearAttempts}>Clear Attempts</button>
      </div>
    </div>
  );
};

export default Question;
