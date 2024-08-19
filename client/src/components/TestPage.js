import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './stylefiles/TestPageStyle.css';
import Loader from './Loader'; 

function TestPage() {
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleStartTest = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('/api/check-test-count', {
        withCredentials: true,
      });

      const { testCount } = response.data;

      if (testCount > 0) {
        navigate('/test-page');
      } else {
        alert('You have already taken the test.');
      }
    } catch (error) {
      console.error('Error checking test count:', error.response ? error.response.data : error.message);
      alert('There was an error checking your test status. Please try again later.');
    } finally {
      setLoading(false); 
    }
  };

  const handleLogout = async () => {
    setLoading(true); 
    try {
      await axios.post('/api/logout', {}, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="test-page-container">
      {loading && <Loader />} 
      <header className="test-page-header">
        <h1>Cipher School Test</h1>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </header>
      <main className="test-page-main">
        <button className="start-test-button" onClick={handleStartTest}>
          Start Test
        </button>
        <section className="info-section">
          <div className="info-box">
            <h2>Do’s</h2>
            <ul>
              <li>Read all instructions carefully.</li>
              <li>Manage your time effectively.</li>
              <li>Check your answers before submitting.</li>
            </ul>
          </div>
          <div className="info-box">
            <h2>Don’ts</h2>
            <ul>
              <li>Don’t rush through the questions.</li>
              <li>Don’t cheat or use unauthorized resources.</li>
              <li>Don’t leave any questions unanswered if you have time to review.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TestPage;
