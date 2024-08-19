import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './stylefiles/TestComponentStyle.css';
import Loader from './Loader'; 

const sampleQuestions = [
  {
    id: 1,
    question: 'What does MERN stand for in the MERN stack?',
    options: ['MongoDB, Express, React, Node.js', 'MongoDB, Express, Ruby, Node.js', 'MongoDB, Express, Redux, Node.js', 'MySQL, Express, React, Node.js'],
    answer: 'MongoDB, Express, React, Node.js'
  },
  {
    id: 2,
    question: 'Which part of the MERN stack is used to create the backend API?',
    options: ['React', 'Node.js', 'Express', 'MongoDB'],
    answer: 'Express'
  },
  {
    id: 3,
    question: 'Which JavaScript library is used for building user interfaces in the MERN stack?',
    options: ['Angular', 'React', 'Vue.js', 'jQuery'],
    answer: 'React'
  },
  {
    id: 4,
    question: 'What is MongoDB used for in the MERN stack?',
    options: ['Frontend framework', 'Database', 'Server-side framework', 'Routing'],
    answer: 'Database'
  },
  {
    id: 5,
    question: 'Which part of the MERN stack handles the logic and routing for HTTP requests?',
    options: ['MongoDB', 'React', 'Node.js', 'Express'],
    answer: 'Express'
  },
  {
    id: 6,
    question: 'Which of the following is a non-relational database?',
    options: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite'],
    answer: 'MongoDB'
  },
  {
    id: 7,
    question: 'In the MERN stack, where do you define the backend routes?',
    options: ['React components', 'MongoDB collections', 'Express routes', 'Node.js modules'],
    answer: 'Express routes'
  },
  {
    id: 8,
    question: 'Which of the following is a key feature of React?',
    options: ['Server-side rendering', 'Database storage', 'Component-based architecture', 'Routing'],
    answer: 'Component-based architecture'
  },
  {
    id: 9,
    question: 'Which part of the MERN stack allows for non-blocking, asynchronous operations?',
    options: ['MongoDB', 'React', 'Node.js', 'Express'],
    answer: 'Node.js'
  },
  {
    id: 10,
    question: 'What type of database is MongoDB?',
    options: ['SQL', 'NoSQL', 'Graph', 'Time-series'],
    answer: 'NoSQL'
  }
];
function TestComponent() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [hasPermissions, setHasPermissions] = useState(null); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const webcamRef = useRef(null);

  useEffect(() => {
    const checkPermissions = async () => {
      setLoading(true); 
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasPermissions(true);
      } catch (error) {
        setHasPermissions(false);
        setError('Camera and microphone access are required to take this test.');
      } finally {
        setLoading(false); 
      }
    };
    checkPermissions();
  }, []);

  const handleLogout = async () => {
    setLoading(true); 
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    sampleQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    setLoading(true); 
    const score = calculateScore();
    try {
      await axios.post('/api/submit-test', {
        score: score
      }, { withCredentials: true });

      navigate('/finish');
    } catch (error) {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  return (
    <div className="test-component-container">
      {loading && <Loader />}
      <header className="test-component-header">
        <h1>Cipher School Test</h1>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </header>
      <main className="test-component-main">
        {error && <p className="error-message">{error}</p>}
        {hasPermissions === null ? (
          <p>Checking camera and microphone access...</p>
        ) : hasPermissions === false ? (
          <p className="error-message"></p>
        ) : (
          <>
            <div className="camera-preview">
              <Webcam
                audio={false}
                ref={webcamRef}
                height={300}
                width={300}
                videoConstraints={{ facingMode: 'user' }}
                className="webcam"
              />
            </div>
            <div className="question-container">
              <h2>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</h2>
              <p>{currentQuestion.question}</p>
              <div className="options-container">
                {currentQuestion.options.map(option => (
                  <div key={option} className="option">
                    <input
                      type="radio"
                      id={option}
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={selectedAnswers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="navigation-buttons">
              <button
                className="nav-button"
                disabled={currentQuestionIndex === 0}
                onClick={handlePreviousQuestion}
              >
                Previous
              </button>
              <button
                className="nav-button"
                disabled={currentQuestionIndex === sampleQuestions.length - 1}
                onClick={handleNextQuestion}
              >
                Next
              </button>
              <button
                className="submit-button"
                onClick={handleSubmit}
              >
                Submit Test
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default TestComponent;
