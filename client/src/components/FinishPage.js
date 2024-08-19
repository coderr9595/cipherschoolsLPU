import React from 'react';
import { useNavigate } from 'react-router-dom';
import './stylefiles/FinishPageStyle.css'; 

const FinishPage = () => {
  const history = useNavigate();

  const goHome = () => {
    history('/'); 
  };

  return (
    <div className="finish-container">
      <div className="finish-message">
        <h1>Test Submission Complete!</h1>
        <p>Your test has been successfully submitted.</p>
        <p>We've sent your score to your Gmail account. Please check your inbox for details.</p>
        <button onClick={goHome}>Go to Home</button>
      </div>
    </div>
  );
};

export default FinishPage;
