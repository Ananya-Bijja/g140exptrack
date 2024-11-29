/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailedImages = () => {
  const { sessionId } = useParams();  // Extract sessionId from URL
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch detailed analysis for the specific sessionId
        const response = await axios.get(`http://localhost:5000/api/detailed-analysis/${sessionId}`);
        if (response.status === 200) {
          setDetailedData(response.data);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available for this session.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis for Session {sessionId}</h1>

      {detailedData.map((user) => (
        user.sessions.map((session) => (
          session.gameSessionId === sessionId && (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>

              {session.imagesWithEmotions.map((image) => (
                <div key={image.imagePath}>
                  
                  <div>
                    <img
                      src={`http://localhost:5000/uploads/${image.imagePath}`}
                      alt={image.imagePath}
                      width="300"
                    />
                    <h4>Captured At: {new Date(image.capturedAt).toLocaleString()}</h4>
                  </div>

                  
                  <table border="1" style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Emotion</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {image.emotions.map((emotion, idx) => (
                        <tr key={idx}>
                          <td>{emotion.label}</td>
                          <td>{emotion.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )
        ))
      ))}
    </div>
  );
};

export default DetailedImages;*/


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailedImages = () => {
  const { sessionId } = useParams();
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/detailed-analysis/${sessionId}`);
        if (response.status === 200) {
          setDetailedData(response.data);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available for this session.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis for Session {sessionId}</h1>
      {detailedData.map((user) => (
        user.imagesWithEmotions.map((image, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '20px' }}>
            {/* Webcam Image */}
            <div style={{ marginRight: '20px' }}>
              <img
                src={`http://localhost:5000/uploads/${image.imagePath}`}
                alt="Webcam Capture"
                width="300"
              />
              <h4>Captured At: {new Date(image.capturedAt).toLocaleString()}</h4>
            </div>

            {/* Screenshot (if available) */}
            {image.screenshotPath && (
              <div>
                <img
                  src={`http://localhost:5000/uploads/${image.screenshotPath}`}
                  alt="Screenshot"
                  width="300"
                />
                <h4>Screenshot</h4>
              </div>
            )}

            {/* Emotion Table */}
            <div style={{ marginLeft: '20px' }}>
              <table border="1" style={{ marginTop: '10px' }}>
                <thead>
                  <tr>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {image.emotions.map((emotion, idx) => (
                    <tr key={idx}>
                      <td>{emotion.label}</td>
                      <td>{emotion.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ))}
    </div>
  );
};

export default DetailedImages;
