import React, { useEffect, useState } from 'react';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailedAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/detailed-analysis');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedAnalysis();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!detailedData || detailedData.length === 0) {
    return <p>No image data available.</p>;
  }

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      <div id="detailed-analysis">
        {detailedData.map((entry, index) => (
          <div key={index}>
            <h2>Image: {entry.filename}</h2>
            <img src={`http://localhost:5000/uploads/${entry.imagePath}`} alt={entry.filename} width="300" />
            <table>
              <thead>
                <tr>
                  <th>Emotion</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(entry.analysisResult) && entry.analysisResult.length > 0 ? (
                  entry.analysisResult.map((result, idx) => (
                    <tr key={idx}>
                      <td>{result.label}</td>
                      <td>{result.score !== undefined && !isNaN(result.score) ? result.score.toFixed(2) : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No analysis available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedImages;