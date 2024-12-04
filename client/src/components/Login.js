import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage('');
        onLogin(username);

        // Check if the username ends with @admin before creating a game session
        if (username.endsWith('@admin')) {
          console.log('Redirecting to admin dashboard');  // Debugging statement
          navigate('/admin-dashboard');
        } else {
          // Create a game session if it's not an admin user
          const gameSessionResponse = await fetch('http://localhost:5000/api/create-game-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });

          const gameSessionData = await gameSessionResponse.json();

          if (gameSessionResponse.ok) {
            navigate('/word-puzzle', { state: { gameSessionId: gameSessionData.gameSessionId } });
          } else {
            setErrorMessage(gameSessionData.message || 'Error creating game session');
          }
        }
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login');
    }
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {/* Sign up link added after password */}
        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign up here</Link>
        </p>
        
        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
