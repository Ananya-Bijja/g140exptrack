
 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const handleViewAnalysis = (username) => {
    navigate(`/detailed-analysis/${username}`);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Login Time:</strong> {user.loginTime} <br />
              <button onClick={() => handleViewAnalysis(user.username)}>
                View Emotion Analysis
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users have logged in yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;


