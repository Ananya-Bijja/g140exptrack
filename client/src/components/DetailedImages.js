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


/*
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

  if (loading) return <div className="text-center"><p>Loading...</p></div>;
  if (!detailedData.length) return <div className="text-center"><p>No images available for this session.</p></div>;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="text-center text-primary mb-4">Detailed Emotion Analysis for Session {sessionId}</h1>
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-lg">
            <thead className="thead-dark">
              <tr>
                <th>User Image</th>
                <th>Captured At</th>
                <th>Screenshot</th>
                <th>Emotions</th>
              </tr>
            </thead>
            <tbody>
              {detailedData.map((user, userIndex) =>
                user.imagesWithEmotions.map((image, index) => (
                  <tr key={`${userIndex}-${index}`}>
                 
                    <td>
                      <img
                        className="image img-fluid rounded"
                        src={`http://localhost:5000/uploads/${image.imagePath}`}
                        alt="Webcam Capture"
                      />
                    </td>

                  
                    <td>{new Date(image.capturedAt).toLocaleString()}</td>

                    
                    <td>
                      {image.screenshotPath ? (
                        <img
                          className="screenshot img-fluid rounded"
                          src={`http://localhost:5000/uploads/${image.screenshotPath}`}
                          alt="Screenshot"
                        />
                      ) : (
                        "No Screenshot"
                      )}
                    </td>

                  
                    <td>
                      <ul className="list-unstyled">
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

/*
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

  if (loading) return <div className="text-center"><p>Loading...</p></div>;
  if (!detailedData.length) return <div className="text-center"><p>No images available for this session.</p></div>;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="text-center text-primary mb-4">Detailed Emotion Analysis for Session {sessionId}</h1>
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-lg">
            <thead className="thead-custom">
              <tr>
                <th>User Image</th>
                <th>Screenshot</th>
                <th>Emotions</th>
              </tr>
            </thead>
            <tbody>
              {detailedData.map((user, userIndex) =>
                user.imagesWithEmotions.map((image, index) => (
                  <tr key={`${userIndex}-${index}`}>
                   
                    <td>
                      <img
                        className="image img-fluid rounded"
                        src={`http://localhost:5000/uploads/${image.imagePath}`}
                        alt="Webcam Capture"
                      />
                    </td>

                    
                    <td>
                      {image.screenshotPath ? (
                        <img
                          className="screenshot img-fluid rounded"
                          src={`http://localhost:5000/uploads/${image.screenshotPath}`}
                          alt="Screenshot"
                        />
                      ) : (
                        "No Screenshot"
                      )}
                    </td>

                    
                    <td>
                      <ul className="list-unstyled">
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
*/