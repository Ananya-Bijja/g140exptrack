/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const handleViewAnalysis = (userId) => {
    // Navigate to DetailedAnalysis page and pass the user ID
    navigate(`/detailed-analysis/${userId}`);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Login Time:</strong> {user.loginTime} <br />
              <button onClick={() => handleViewAnalysis(user.id)}>View Analysis</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users have logged in yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;*/
/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); // Ensure this endpoint fetches users from MongoDB
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchSessions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`); // Ensure the full URL is correct
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions })); // Adjust according to your data structure
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  

  const handleViewAnalysis = (sessionId) => {
    navigate(`/detailed-analysis/${sessionId}`);
  };

  const handleAnalyzeSession = async (sessionId) => {
    try {
      const response = await axios.post(`/api/analyze/${sessionId}`); // Adjust endpoint as needed
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Email:</strong> {user.email} <br />
              {user.loginTime && (
                <>
                  <strong>Login Time:</strong> {new Date(user.loginTime).toLocaleString()} <br />
                </>
              )}
              <button onClick={() => fetchSessions(user._id)}>
                View Game Sessions
              </button>
              {sessions[user._id] && (
                <ul>
                  {sessions[user._id].map((session) => (
                    <li key={session.gameSessionId}>
                      <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
                      <button onClick={() => handleViewAnalysis(session.gameSessionId)}>View Analysis</button>
                      <button onClick={() => handleAnalyzeSession(session.gameSessionId)}>Run Analysis</button>
                    </li>
                  ))}
                </ul>
              )}
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
*/
/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); // Ensure this endpoint fetches users from MongoDB
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchSessions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`); // Ensure the full URL is correct
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions })); // Adjust according to your data structure
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  
  const handleViewAnalysis = async (sessionId) => {
    try {
      const response = await axios.post(`/api/analyze/${sessionId}`, { username: user.username }); // Send username with request
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
    }
};


  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Email:</strong> {user.email} <br />
              {user.loginTime && (
                <>
                  <strong>Login Time:</strong> {new Date(user.loginTime).toLocaleString()} <br />
                </>
              )}
              <button onClick={() => fetchSessions(user._id)}>
                View Game Sessions
              </button>
              {sessions[user._id] && (
                <ul>
                  {sessions[user._id].map((session) => (
                    <li key={session.gameSessionId}>
                      <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
                      <button onClick={() => handleViewAnalysis(session.gameSessionId)}>View Analysis</button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users have logged in yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;*/

/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); // Ensure this endpoint fetches users from MongoDB
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchSessions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`); // Ensure the full URL is correct
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions })); // Adjust according to your data structure
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async (sessionId, username) => {
    try {
      
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username }); // Send username with request
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Email:</strong> {user.email} <br />
              {user.loginTime && (
                <>
                  <strong>Login Time:</strong> {new Date(user.loginTime).toLocaleString()} <br />
                </>
              )}
              <button onClick={() => fetchSessions(user._id)}>
                View Game Sessions
              </button>
              {sessions[user._id] && (
                <ul>
                  {sessions[user._id].map((session) => (
                    <li key={session.gameSessionId}>
                      <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
                      <button onClick={() => handleViewAnalysis(session.gameSessionId, user.username)}>View Analysis</button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users have logged in yet.</p>
      )}
    </div>
  );
};

export default AdminDashboard;*/

/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchSessions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async (sessionId, username) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Email:</strong> {user.email} <br />
              {user.loginTime && (
                <>
                  <strong>Login Time:</strong> {new Date(user.loginTime).toLocaleString()} <br />
                </>
              )}
              <button onClick={() => fetchSessions(user._id)}>
                View Game Sessions
              </button>
              {sessions[user._id] && (
                <ul>
                  {sessions[user._id].map((session) => (
                    <li key={session.gameSessionId}>
                      <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
                      <button onClick={() => handleViewAnalysis(session.gameSessionId, user.username)}> 
                        View Analysis
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
*/


// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users data on component mount
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchSessions = async (userId) => {
    console.log('Fetching sessions for userId:', userId);
    try {
      const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
      setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewAnalysis = async(username,sessionId) => {

    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
      alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
      navigate(`/detailed-analysis/${username}/${sessionId}`);
    } catch (error) {
      console.error('Error analyzing session:', error);
    }

   
    
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Logged-in Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>Username:</strong> {user.username} <br />
              <strong>Email:</strong> {user.email} <br />
              {user.loginTime && (
                <>
                  <strong>Login Time:</strong> {new Date(user.loginTime).toLocaleString()} <br />
                </>
              )}
              <button onClick={() => fetchSessions(user._id)}>
                View Game Sessions
              </button>
              {sessions[user._id] && (
                <ul>
                  {sessions[user._id].map((session) => (
                    <li key={session.gameSessionId}>
                      <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
                      <button onClick={() => handleViewAnalysis(user.username,session.gameSessionId)}>
                        View Analysis
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
