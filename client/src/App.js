import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import WordPuzzleGame from './components/WordPuzzleGame';
import SignUpPage from './components/SignUpPage';  // Import the SignUpPage component
import DetailedAnalysis from './components/DetailedAnalysis';  // Import DetailedAnalysis
import DetailedImages from './components/DetailedImages';  // Import DetailedImages

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* Default Login Route */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Admin Dashboard Route */}
        <Route 
          path="/admin-dashboard" 
          element={isLoggedIn ? <AdminDashboard /> : <Login onLogin={handleLogin} />} 
        />

        {/* Word Puzzle Game Route */}
        <Route 
          path="/word-puzzle" 
          element={isLoggedIn ? <WordPuzzleGame /> : <Login onLogin={handleLogin} />} 
        />

        {/* Sign-Up Page Route */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Detailed Analysis Route */}
        <Route 
          path="/detailed-analysis/:username" 
          element={isLoggedIn ? <DetailedAnalysis /> : <Login onLogin={handleLogin} />} 
        />

        {/* Detailed Images Route */}
        <Route 
          path="/detailed-images" 
          element={isLoggedIn ? <DetailedImages /> : <Login onLogin={handleLogin} />} 
        />

        {/* Analysis Summary Route */}
        <Route 
          path="/analysis-summary" 
          element={isLoggedIn ? <DetailedAnalysis /> : <Login onLogin={handleLogin} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
