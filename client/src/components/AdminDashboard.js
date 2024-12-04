// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [sessions, setSessions] = useState({});
//   const [selectedUser, setSelectedUser] = useState(null); // Track selected user
//   const navigate = useNavigate();

//   // Fetch users data on component mount
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/users');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Fetch sessions for a particular user
//   const fetchSessions = async (userId) => {
//     console.log('Fetching sessions for userId:', userId);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
//       console.log('Sessions response:', response.data); // Check the response structure

//       if (Array.isArray(response.data.sessions)) {
//         setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
//         setSelectedUser(userId); // Set selected user to display their sessions
//       } else {
//         console.error('Sessions data is not an array:', response.data.sessions);
//       }
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//     }
//   };

//   const handleViewAnalysis = async (username, sessionId) => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
//       alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
//       navigate(`/detailed-analysis/${username}/${sessionId}`);
//     } catch (error) {
//       console.error('Error analyzing session:', error);
//     }
//   };

//   const handleBack = () => {
//     setSelectedUser(null); // Hide sessions when "Back" is clicked
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       {/* Search Users */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search Users..."
//           onChange={(e) => {
//             const searchTerm = e.target.value.toLowerCase();
//             const filteredUsers = users.filter(user =>
//               user.username.toLowerCase().includes(searchTerm)
//             );
//             setUsers(filteredUsers);
//           }}
//         />
//       </div>

//       <h2>Logged-in Users:</h2>
//       <div className="user-container">
//         {users.length > 0 ? (
//           users.map((user) => (
//             <div key={user._id} className="user-card">
//               <strong>Username:</strong> {user.username} <br />
//               {user.loginTime && (
//                 <>
//                   <strong>Login Time:</strong> {new Date(user.loginTime).toLocaleString()} <br />
//                 </>
//               )}

//               {/* Display View Sessions Button only if user is not selected */}
//               {!selectedUser && (
//                 <button onClick={() => fetchSessions(user._id)}>
//                   View Sessions
//                 </button>
//               )}

//               {/* Display Sessions for the selected user */}
//               {selectedUser === user._id && (
//                 <div className="sessions-container">
//                   <button onClick={handleBack} className="back-button">Back</button>
//                   <h3>Sessions for User: {user.username}</h3>
//                   {sessions[user._id] && sessions[user._id].length > 0 ? (
//                     <ul>
//                       {sessions[user._id].map((session) => (
//                         <li key={session.gameSessionId}>
//                           <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
//                           <button onClick={() => handleViewAnalysis(user.username, session.gameSessionId)}>
//                             View Analysis
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No sessions available for this user.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No users have logged in yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


//everything looks fine till admin dashborad css..//
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/AdminDashboard.css';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [sessions, setSessions] = useState({});
//   const [selectedUser, setSelectedUser] = useState(null); // Track selected user
//   const navigate = useNavigate();

//   // Fetch users data on component mount
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/users');
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Fetch sessions for a particular user
//   const fetchSessions = async (userId) => {
//     console.log('Fetching sessions for userId:', userId);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
//       console.log('Sessions response:', response.data); // Check the response structure

//       if (Array.isArray(response.data.sessions)) {
//         setSessions((prev) => ({ ...prev, [userId]: response.data.sessions }));
//         setSelectedUser(userId); // Set selected user to display their sessions
//       } else {
//         console.error('Sessions data is not an array:', response.data.sessions);
//       }
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//     }
//   };

//   const handleViewAnalysis = async (username, sessionId) => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
//       alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
//       navigate(`/detailed-analysis/${username}/${sessionId}`);
//     } catch (error) {
//       console.error('Error analyzing session:', error);
//     }
//   };

//   const handleBack = () => {
//     setSelectedUser(null); // Hide sessions when "Back" is clicked
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       {/* Search Users */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search Users..."
//           onChange={(e) => {
//             const searchTerm = e.target.value.toLowerCase();
//             const filteredUsers = users.filter((user) =>
//               user.username.toLowerCase().includes(searchTerm)
//             );
//             setUsers(filteredUsers);
//           }}
//         />
//       </div>

//       <h2>Logged-in Users:</h2>
//       <div className="user-container">
//         {users.length > 0 ? (
//           users.map((user) => (
//             <div key={user._id} className="user-card">
//               <div className="user-info">
//                 <span className="username">{user.username}</span>
//                 {!selectedUser && (
//                   <button onClick={() => fetchSessions(user._id)}>View Sessions</button>
//                 )}
//               </div>

//               {/* Display Sessions for the selected user */}
//               {selectedUser === user._id && (
//                 <div className="sessions-container">
//                   <button onClick={handleBack} className="back-button">
//                     Back
//                   </button>
//                   <h3>Sessions for User: {user.username}</h3>
//                   {sessions[user._id] && sessions[user._id].length > 0 ? (
//                     <ul>
//                       {sessions[user._id].map((session) => (
//                         <li key={session.gameSessionId}>
//                           <strong>Session Date:</strong>{' '}
//                           {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
//                           <button
//                             onClick={() => handleViewAnalysis(user.username, session.gameSessionId)}
//                           >
//                             View Analysis
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No sessions available for this user.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No users have logged in yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// working fine everyhting with the seaqrch button also but the buttons are green
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/AdminDashboard.css'

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [allUsers, setAllUsers] = useState([]); // Keep a copy of all users
//   const [sessions, setSessions] = useState({});
//   const [selectedUser, setSelectedUser] = useState(null); // Track selected user
//   const [searchTerm, setSearchTerm] = useState(''); // Track search input
//   const navigate = useNavigate();

//   // Fetch users data on component mount
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/users');
//         setUsers(response.data);
//         setAllUsers(response.data); // Save all users for reference
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Handle search functionality
//   const handleSearch = () => {
//     if (searchTerm.trim() === '') {
//       setUsers(allUsers); // If the search term is empty, reset to all users
//     } else {
//       const filteredUsers = allUsers.filter(user =>
//         user.username.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setUsers(filteredUsers);
//     }
//   };

//   // Fetch sessions for a particular user
//   const fetchSessions = async (userId) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/game-sessions/${userId}`);
//       if (Array.isArray(response.data.sessions)) {
//         setSessions(prev => ({ ...prev, [userId]: response.data.sessions }));
//         setSelectedUser(userId); // Set selected user to display their sessions
//       } else {
//         console.error('Sessions data is not an array:', response.data.sessions);
//       }
//     } catch (error) {
//       console.error('Error fetching sessions:', error);
//     }
//   };

//   const handleViewAnalysis = async (username, sessionId) => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/analyze/${sessionId}`, { username });
//       alert(`Analysis complete: ${JSON.stringify(response.data.result)}`);
//       navigate(`/detailed-analysis/${username}/${sessionId}`);
//     } catch (error) {
//       console.error('Error analyzing session:', error);
//     }
//   };

//   const handleBack = () => {
//     setSelectedUser(null); // Hide sessions when "Back" is clicked
//   };

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       {/* Search Users */}
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search Users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)} // Update search term
//         />
//         <button onClick={handleSearch} className="search-button">Search</button>
//       </div>

//       <h2>Logged-in Users:</h2>
//       <div className="user-container">
//         {users.length > 0 ? (
//           users.map((user) => (
//             <div key={user._id} className="user-card">
//               <div className="user-info">
//                 <span className="username">{user.username}</span>
//                 {!selectedUser && (
//                   <button onClick={() => fetchSessions(user._id)}>
//                     View Sessions
//                   </button>
//                 )}
//               </div>

//               {selectedUser === user._id && (
//                 <div className="sessions-container">
//                   <button onClick={handleBack} className="back-button">Back</button>
//                   <h3>Sessions for User: {user.username}</h3>
//                   {sessions[user._id] && sessions[user._id].length > 0 ? (
//                     <ul>
//                       {sessions[user._id].map((session) => (
//                         <li key={session.gameSessionId}>
//                           <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
//                           <button onClick={() => handleViewAnalysis(user.username, session.gameSessionId)}>
//                             View Analysis
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No sessions available for this user.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No users have logged in yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';


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
        setUsers(response.data);
        setAllUsers(response.data); // Save all users for reference
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
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Search Users */}
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
                  <button onClick={handleBack} className="back-button">Back</button>
                  <h3>Sessions for User: {user.username}</h3>
                  {sessions[user._id] && sessions[user._id].length > 0 ? (
                    <ul>
                      {sessions[user._id].map((session) => (
                        <li key={session.gameSessionId}>
                          <strong>Session Date:</strong> {new Date(session.images[0]?.capturedAt).toLocaleString()} <br />
                          <button onClick={() => handleViewAnalysis(user.username, session.gameSessionId)}>
                            View Analysis
                          </button>
                        </li>
                      ))}
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
  );
};

export default AdminDashboard;

