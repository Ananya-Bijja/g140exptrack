import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/DetailedImages.css';
import Navbar from './Navbar';

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
    <>
      <Navbar />
      <div>
        {/* Heading with box */}
        <div className="heading-box">
          DETAILED EMOTION ANALYSIS
        </div>
        
        <div className="table-container">
          <table className="detailed-analysis-table">
            <thead>
              <tr>
                <th>USER IMAGE</th>
                <th>SCREENSHOT</th>
                <th>EMOTION SCORES</th>
              </tr>
            </thead>
            <tbody>
              {detailedData.map((user, userIndex) =>
                user.imagesWithEmotions.map((image, index) => (
                  <tr key={`${userIndex}-${index}`}>
                    <td>
                      <img
                        className="image"
                        src={`http://localhost:5000/uploads/${image.imagePath}`}
                        alt="Webcam Capture"
                      />
                    </td>
                    <td>
                      {image.screenshotPath ? (
                        <img
                          className="screenshot"
                          src={`http://localhost:5000/uploads/${image.screenshotPath}`}
                          alt="Screenshot"
                        />
                      ) : (
                        "No Screenshot"
                      )}
                    </td>
                    <td>
                      <ul>
                        {image.emotions.map((emotion, idx) => (
                          <li key={idx}>
                            <strong>{emotion.label}</strong>: {emotion.score.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};


export default DetailedImages;
