import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  const navigate = useNavigate();

  // Fetch users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        // Filter users with role 'child' only
        const childUsers = response.data.filter(user => user.role === 'child');
        setUsers(childUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch sessions for a particular user
  const fetchSessions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
      const validSessions = response.data.sessions.filter(session => {
        // Check if session date is valid
        const sessionDate = new Date(session.images[0]?.capturedAt);
        return !isNaN(sessionDate); // Only valid dates will pass
      });
      setSessions(prev => ({ ...prev, [userId]: validSessions }));
      setSelectedUser(userId); // Show sessions for this user
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async (username, sessionId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      if (response.status === 200) {
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${username}/${sessionId}`);
    }else if (response.status === 400) {
        alert(`Error: ${response.data.message}`); // Show the error message returned by the backend
      }
    }
    catch (error) {
      console.error('Error analyzing session:', error);
      alert('An error occurred while analyzing the session. Please try again later.');

    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    setSelectedUser(null); // Hide sessions when "Back" is clicked
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className='heading-box'>
        <h1>ADMIN DASHBOARD</h1></div>
        <div className='spacer'></div>
        <h2>LIST OF USERS</h2>
        {/* Search Users */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
          
        </div>

        
        <div className="user-container">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  {/* Show "View Sessions" button only if no user is selected or the selected user is the current user */}
                  {selectedUser === null || selectedUser === user._id ? (
                    <button onClick={() => fetchSessions(user._id)}>
                      View Sessions
                    </button>
                  ) : null}
                </div>

                {/* Display Sessions only if a user is selected */}
                {selectedUser === user._id && sessions[user._id] && (
                  <div className="sessions-container">
                    <h3>Sessions for User: {user.username}</h3>
                    {sessions[user._id].length > 0 ? (
                      <ul>
                        {sessions[user._id].map((session) => (
                          <li key={session.gameSessionId} className="session-details">
                            <div className="session-date">
                              <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()}
                            </div>
                            <button onClick={() => handleViewAnalysis(user.username, session.gameSessionId)}>
                              View Analysis
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No sessions available for this user.</p>
                    )}
                    <button onClick={handleBack} className="back-button">Back</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No users found matching your search.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;