// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import AdminDashboard from './components/AdminDashboard';
// import WordPuzzleGame from './components/WordPuzzleGame';
// import SignUpPage from './components/SignUpPage';  // Import the SignUpPage component
// import DetailedAnalysis from './components/DetailedAnalysis';  // Import DetailedAnalysis
// import DetailedImages from './components/DetailedImages';  // Import DetailedImages
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loggedInUsername, setLoggedInUsername] = useState('');

//   const handleLogin = (loggedInUsername) => {
//     setIsLoggedIn(true);
//     setLoggedInUsername(loggedInUsername); // Store the username
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Default Login Route */}
//         <Route path="/" element={<Login onLogin={handleLogin} />} />

        // {/* Admin Dashboard Route */}
        // <Route 
        //   path="/admin-dashboard" 
        //   element={isLoggedIn ? <AdminDashboard username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
        // />

        // {/* Word Puzzle Game Route */}
        // <Route 
        //   path="/word-puzzle" 
        //   element={isLoggedIn ? <WordPuzzleGame loggedInUsername={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
        // />

        // {/* Sign-Up Page Route */}
        // <Route path="/signup" element={<SignUpPage />} />

        // {/* Detailed Analysis Route */}
        // <Route 
        //   path="/detailed-analysis/:username/:sessionId" 
        //   element={isLoggedIn ? <DetailedAnalysis username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
        // />

        // {/* Detailed Images Route */}
        // <Route 
        //   path="/detailed-images/:username/:sessionId" 
        //   element={isLoggedIn ? <DetailedImages username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
        // />

        // {/* Analysis Summary Route */}
        // <Route 
        //   path="/analysis-summary" 
        //   element={isLoggedIn ? <DetailedAnalysis username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
        // />
//       </Routes>
//     </Router>
//   );
// };

// export default App;




// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './components/Home';
// import Login from './components/Login';
// import AdminDashboard from './components/AdminDashboard';
// import WordPuzzleGame from './components/WordPuzzleGame';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/About" element={<About />} />
//         {/* Admin Dashboard Route */}
//         <Route 
//           path="/admin-dashboard" 
//           element={isLoggedIn ? <AdminDashboard username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
//         />

//         {/* Word Puzzle Game Route */}
//         <Route 
//           path="/word-puzzle" 
//           element={isLoggedIn ? <WordPuzzleGame loggedInUsername={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
//         />

//         {/* Sign-Up Page Route */}
//         <Route path="/signup" element={<SignUpPage />} />

//         {/* Detailed Analysis Route */}
//         <Route 
//           path="/detailed-analysis/:username/:sessionId" 
//           element={isLoggedIn ? <DetailedAnalysis username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
//         />

//         {/* Detailed Images Route */}
//         <Route 
//           path="/detailed-images/:username/:sessionId" 
//           element={isLoggedIn ? <DetailedImages username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
//         />

//         {/* Analysis Summary Route */}
//         <Route 
//           path="/analysis-summary" 
//           element={isLoggedIn ? <DetailedAnalysis username={loggedInUsername} /> : <Login onLogin={handleLogin} />} 
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

  // Handle login event and store the username
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setLoggedInUsername(username);
  };

  // Handle logout event
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUsername('');
  };

  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />

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
              <Login onLogin={handleLogin} />
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
              <Login onLogin={handleLogin} />
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
              <Login onLogin={handleLogin} />
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
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Analysis Summary (Redirect to Detailed Analysis) */}
        <Route
          path="/analysis-summary"
          element={
            isLoggedIn ? (
              <DetailedAnalysis username={loggedInUsername} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
