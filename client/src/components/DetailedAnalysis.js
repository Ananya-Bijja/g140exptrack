// Frontend: src/components/DetailedAnalysis.js
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#FF8042'];

const DetailedAnalysis = () => {
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analysis-summary');
        const summary = await response.json();
        const data = Object.keys(summary).map((emotion) => ({
          name: emotion,
          value: summary[emotion],
        }));
        setChartData(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div>
      <h1>Emotion Analysis Summary</h1>
      <PieChart width={400} height={400}>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <button onClick={() => navigate('/detailed-images')}>View Detailed Image Analysis</button>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default DetailedAnalysis;
