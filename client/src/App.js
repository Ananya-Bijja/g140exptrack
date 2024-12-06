
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import SignUpPage from './components/SignUpPage';
import AdminDashboard from './components/AdminDashboard';
import WordPuzzleGame from './components/WordPuzzleGame';
import DetailedAnalysis from './components/DetailedAnalysis';
import DetailedImages from './components/DetailedImages';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('loggedInUsername');

    if (storedIsLoggedIn && storedUsername) {
      setIsLoggedIn(true);
      setLoggedInUsername(storedUsername);
    }
  }, []);

  // Handle login event and store the username
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setLoggedInUsername(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUsername', username);
  };

  // Handle logout event
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUsername');
  };

  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Login Page */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Sign-Up Page */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn ? (
              <AdminDashboard username={loggedInUsername} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Word Puzzle Game */}
        <Route
          path="/word-puzzle"
          element={
            isLoggedIn ? (
              <WordPuzzleGame loggedInUsername={loggedInUsername} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Detailed Analysis */}
        <Route
          path="/detailed-analysis/:username/:sessionId"
          element={
            isLoggedIn ? (
              <DetailedAnalysis username={loggedInUsername} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Detailed Images */}
        <Route
          path="/detailed-images/:username/:sessionId"
          element={
            isLoggedIn ? (
              <DetailedImages username={loggedInUsername} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Analysis Summary */}
        <Route
          path="/analysis-summary"
          element={
            isLoggedIn ? (
              <DetailedAnalysis username={loggedInUsername} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
