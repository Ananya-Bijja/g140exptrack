/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Keep a copy of all users
  const [sessions, setSessions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [searchTerm, setSearchTerm] = useState(''); // Track search input
  const navigate = useNavigate();

  // Fetch users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
         // Save all users for reference
        // Filter users with role 'child' only
        const childUsers = response.data.filter(user => user.role === 'child');
        setUsers(childUsers);
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setUsers(allUsers); // If the search term is empty, reset to all users
    } else {
      const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  // Fetch sessions for a particular user
  const fetchSessions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
      if (Array.isArray(response.data.sessions)) {
        setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
        setSelectedUser(userId); // Set selected user to display their sessions
      } else {
        console.error('Sessions data is not an array:', response.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleViewAnalysis = async (username, sessionId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${username}/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
    }
  };

  const handleBack = () => {
    setSelectedUser(null); // Hide sessions when "Back" is clicked
  };

  return (
    <>
    <Navbar />
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <h2>Logged-in Users:</h2>
      <div className="user-container">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <span className="username">{user.username}</span>
                {!selectedUser && (
                  <button onClick={() => fetchSessions(user._id)}>
                    View Sessions
                  </button>
                )}
              </div>

              {selectedUser === user._id && (
                <div className="sessions-container">
                  
                  <h3>Sessions for User: {user.username}</h3>
                  {sessions[user._id] && sessions[user._id].length > 0 ? (
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
                      ))}<button onClick={handleBack} className="back-button">Back</button>
                    </ul>
                  ) : (
                    <p>No sessions available for this user.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No users have logged in yet.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;

*/
/*
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
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async (username, sessionId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${username}/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
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
        <h1>Admin Dashboard</h1>

       
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </div>

        <h2>Logged-in Users:</h2>
        <div className="user-container">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  <button onClick={() => fetchSessions(user._id)}>
                    View Sessions
                  </button>
                </div>

                {sessions[user._id] && (
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
                        ))}<button onClick={handleBack} className="back-button">Back</button>
                      </ul>
                    ) : (
                      <p>No sessions available for this user.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No users have logged in yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
*/
/*
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
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async (username, sessionId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${username}/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
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
        <h1>Admin Dashboard</h1>

       
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </div>

        <h2>Logged-in Users:</h2>
        <div className="user-container">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  <button onClick={() => fetchSessions(user._id)}>
                    View Sessions
                  </button>
                </div>

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
            <p>No users have logged in yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
*/
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
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
      setSelectedUser(userId); // Show sessions for this user
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async (username, sessionId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${username}/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
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
