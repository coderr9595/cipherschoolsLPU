import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TestPage from './components/TestPage';
import FinishPage from './components/FinishPage';
import TestComponent from './components/TestComponent';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/test" element={<TestPage />} />
        <Route path="/test-page" element={<TestComponent/>}/>
        <Route path="/finish" element={<FinishPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
