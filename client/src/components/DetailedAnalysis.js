// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
// import { useNavigate, useParams } from 'react-router-dom';  // Import useParams

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#FF8042'];

// const DetailedAnalysis = () => {
//   const { username,sessionId } = useParams();  // Extract sessionId from URL
//   const [chartData, setChartData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSummary = async (username,sessionId) => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/analysis-summary/${sessionId}`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username }),  // Send username in the request body
//         });
       
//         const summary = await response.json();
       
//         // Transform the summary data into the format required by the BarChart
//         const data = Object.keys(summary).map((emotion) => ({
//           name: emotion,  // The name of the emotion
//           value: summary[emotion],  // The score of that emotion
//         }));

//         // Set the chart data to be used by the BarChart
//         setChartData(data);
//       } catch (error) {
//         console.error('Error fetching summary:', error);
//       }
//     };

//     if (sessionId && username) {
//       fetchSummary(username,sessionId);  // Fetch summary for the specific sessionId
//     }
//   }, [sessionId,username]);  // Dependency array to refetch when sessionId changes

//   return (
//     <div>
//       <h1>Emotion Analysis Summary</h1>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8">
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//       <button onClick={() => navigate(`/detailed-images/${username}/${sessionId}`)}>View Detailed Image Analysis</button>
//     </div>
//   );
// };

// export default DetailedAnalysis;
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import '../styles/DetailedAnalysis.css';// Import the CSS file

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#FF8042'];

const DetailedAnalysis = () => {
  const { username, sessionId } = useParams(); // Extract sessionId from URL
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async (username, sessionId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/analysis-summary/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }), // Send username in the request body
        });

        const summary = await response.json();

        // Transform the summary data into the format required by the BarChart
        const data = Object.keys(summary).map((emotion) => ({
          name: emotion, // The name of the emotion
          value: summary[emotion], // The score of that emotion
        }));

        // Set the chart data to be used by the BarChart
        setChartData(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    if (sessionId && username) {
      fetchSummary(username, sessionId); // Fetch summary for the specific sessionId
    }
  }, [sessionId, username]); // Dependency array to refetch when sessionId changes

  return (
    <div className="analysis-container">
      <div className="chart-container">
        <h1 style={{ color: 'white', textAlign: 'center' }}>Emotion Analysis Summary</h1>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button
        className="center-button"
        onClick={() => navigate(`/detailed-images/${username}/${sessionId}`)}
      >
        View Detailed Image Analysis
      </button>
    </div>
  );
};

export default DetailedAnalysis;
