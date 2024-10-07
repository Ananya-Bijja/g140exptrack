import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import WordPuzzleGame from './components/WordPuzzleGame';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn ? (
              <AdminDashboard />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/word-puzzle"
          element={
            isLoggedIn ? (
              <WordPuzzleGame />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
