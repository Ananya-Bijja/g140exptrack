
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#FF8042'];

const DetailedAnalysis = () => {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analysis-summary');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const summary = await response.json();

        if (summary && typeof summary === 'object') {
          const data = Object.keys(summary).map((emotion) => ({
            name: emotion,
            value: summary[emotion],
          }));
          setChartData(data);
        } else {
          console.error('Invalid summary format:', summary);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };
    fetchSummary();
  }, []);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div>
      <h1>Emotion Summary</h1>
      {chartData ? (
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}} fill={COLORS[index % COLORS.length]`} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>Loading chart...</p>
      )}

      <button onClick={() => navigate('/detailed-images')}>View Detailed Image Analysis</button>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default DetailedAnalysis; 


