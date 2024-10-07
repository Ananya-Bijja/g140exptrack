import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (username.endsWith('@admin') && password === 'admin123') {
      setErrorMessage('');
      onLogin();
      navigate('/admin-dashboard');
    } else if (password === 'child123') {
      setErrorMessage('');
      onLogin();
      navigate('/word-puzzle');
    } else {
      setErrorMessage('Invalid credentials');
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

        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
