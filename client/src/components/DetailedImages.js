/*import React, { useEffect, useState } from 'react';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/detailed-analysis');
        const data = await response.json();
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedAnalysis();
  }, []);

  const analyzeImage = async (id) => {
    try {
      await fetch(`http://localhost:5000/analyze/${id}`, { method: 'POST' });
      alert('Image analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((entry) => (
        <div key={entry._id}>
          <h2>Image: {entry.imagePath}</h2>
          <img src={`http://localhost:5000/uploads/${entry.imagePath}`} alt={entry.imagePath} width="300" />
          {entry.analysisResult ? (
            <table>
              <thead>
                <tr><th>Emotion</th><th>Score</th></tr>
              </thead>
              <tbody>
                {entry.analysisResult.map((result, idx) => (
                  <tr key={idx}>
                    <td>{result.label}</td>
                    <td>{result.score.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <button onClick={() => analyzeImage(entry._id)}>Analyze Image</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;*/
/*
import React, { useEffect, useState } from 'react';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/detailed-analysis');
        const data = await response.json();
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedAnalysis();
  }, []);

  const analyzeImage = async (imageId) => {
    try {
      await fetch(`http://localhost:5000/analyze/${imageId}`, { method: 'POST' });
      alert('Image analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.gameSessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              {session.images.map((image) => (
                <div key={image.capturedAt}>
                  <h4>Image Captured At: {new Date(image.capturedAt).toLocaleString()}</h4>
                  <img src={`http://localhost:5000${image.imageUrl}`} alt="Emotion Analysis" width="300" />
                  {image.analysisResult && image.analysisResult.length > 0 ? (
                    <table>
                      <thead>
                        <tr><th>Emotion</th><th>Score</th></tr>
                      </thead>
                      <tbody>
                        {image.analysisResult.map((result, idx) => (
                          <tr key={idx}>
                            <td>{result.label}</td>
                            <td>{result.score.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <button onClick={() => analyzeImage(image._id)}>Analyze Image</button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/
/*

import React, { useEffect, useState } from 'react';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyzeData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/detailed-analysis');
        const data = await response.json();

        // Iterate over all images and trigger analysis for each one
        for (const user of data) {
          for (const session of user.gameSessions) {
            for (const image of session.images) {
              if (!image.analysisResult || image.analysisResult.length === 0) {
                await fetch(`http://localhost:5000/analyze/${image._id}`, { method: 'POST' });
              }
            }
          }
        }

        // After all images are analyzed, fetch the data again to get updated results
        const updatedResponse = await fetch('http://localhost:5000/api/detailed-analysis');
        const updatedData = await updatedResponse.json();
        setDetailedData(updatedData);

      } catch (error) {
        console.error('Error fetching or analyzing detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyzeData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.gameSessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              {session.images.map((image) => (
                <div key={image.capturedAt}>
                  <h4>Image Captured At: {new Date(image.capturedAt).toLocaleString()}</h4>
                  <img src={`http://localhost:5000${image.imageUrl}`} alt="Emotion Analysis" width="300" />
                  {image.analysisResult && image.analysisResult.length > 0 ? (
                    <table>
                      <thead>
                        <tr><th>Emotion</th><th>Score</th></tr>
                      </thead>
                      <tbody>
                        {image.analysisResult.map((result, idx) => (
                          <tr key={idx}>
                            <td>{result.label}</td>
                            <td>{result.score.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Analyzing...</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/
/*
import React, { useEffect, useState } from 'react';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/detailed-analysis');
        const data = await response.json();
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.gameSessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              {session.images.map((image) => (
                <div key={image.capturedAt}>
                  <h4>Image Captured At: {new Date(image.capturedAt).toLocaleString()}</h4>
                  <img src={`http://localhost:5000${image.imageUrl}`} alt="Emotion Analysis" width="300" />
                  {image.analysisResult && image.analysisResult.length > 0 ? (
                    <table>
                      <thead>
                        <tr><th>Emotion</th><th>Score</th></tr>
                      </thead>
                      <tbody>
                        {image.analysisResult.map((result, idx) => (
                          <tr key={idx}>
                            <td>{result.label}</td>
                            <td>{result.score.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Analyzing...</p> // Should not be visible in detailed analysis since analysis is completed.
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON, but got: ${text}`);
      }
        const data = await response.json();
        console.log(data);
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      <td>
                        <img
                          src={`http://localhost:5000${image.imagePath}`}
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                      {Object.entries(image.emotions).map(([emotionLabel, score], idx) => (
                        <tr key={idx}>
                          <td></td> 
                          <td>{emotionLabel}</td>
                          <td>{score.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Directly set the response data since it's already in JSON format
        setDetailedData(response.data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src={`http://localhost:5000${image.imagePath}`}
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                      
                      {Object.entries(image.emotions).map(([emotionLabel, score], emotionIdx) => (
                        <tr key={emotionIdx}>
                          <td></td>
                          <td>{emotionLabel}</td>
                          <td>{score.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Check if the response is successful
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const data = response.data;
        console.log(data);
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      <td>
                        <img
                          src={`http://localhost:5000${image.imagePath}`}
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                     
                      {Object.entries(image.emotions).map(([emotionLabel, score], emotionIdx) => (
                        <tr key={emotionIdx}>
                          <td></td> 
                          <td>{emotionLabel}</td>
                          <td>{score}</td> 
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Check if the response is successful
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const data = response.data;
        console.log(data);
        setDetailedData(data);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      <td>
                        <img
                          src={`http://localhost:5000${image.imagePath}`}
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                      
                      {Object.entries(image.emotions).map(([emotionKey, emotionValue], idx) => (
                        <tr key={idx}>
                          <td></td>
                          <td>{emotionValue.label}</td>
                          <td>{emotionValue.score}</td> 
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;*/
/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Log the response to verify the structure
        console.log(response.data);
        
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      <td>
                        <img
                          src={`http://localhost:5000${image.imagePath}`}
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                          onError={(e) => e.target.src = '/path_to_placeholder_image.jpg'} // Placeholder on error
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                      {Object.entries(image.emotions).map(([emotionKey, emotionValue], idx) => (
                        <tr key={idx}>
                          <td></td>
                          <td>{emotionValue.label}</td> 
                          <td>{emotionValue.score}</td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Log the response to verify the structure
        console.log(response.data);
        
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      <td>
                        <img
                          src={`http://localhost:5000/uploads${image.imagePath}`} // Ensure imagePath is correct
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                          onError={(e) => e.target.src = '/path_to_placeholder_image.jpg'} // Placeholder on error
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                      {Object.entries(image.emotions).map(([emotionKey, emotionValue], idx) => (
                        <tr key={idx}>
                          <td></td> 
                          <td>{emotionValue.label}</td> 
                          <td>{emotionValue.score}</td> 
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Log the response to verify the structure
        console.log(response.data);
        
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      {Object.entries(image.emotions).map(([emotionKey, emotionValue], idx) => (
                        <tr key={idx}>
                          <td>{emotionValue.label}</td>
                          <td>{emotionValue.score}</td> 
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Log the response to verify the structure
        console.log(response.data);
        
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Captured At</th>
                    <th>Emotion</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {session.imagesWithEmotions.map((image) => (
                    <tr key={image.imagePath}>
                      <td>
                        
                        <img
                          src={`http://localhost:5000/uploads${image.imagePath}`}
                          alt="Emotion Analysis"
                          width="100"
                          height="100"
                          onError={(e) => e.target.src = '/path_to_placeholder_image.jpg'} // Placeholder on error
                        />
                      </td>
                      <td>{new Date(image.capturedAt).toLocaleString()}</td>
                      {Object.entries(image.emotions).map(([emotionKey, emotionValue], idx) => (
                        <tr key={idx}>
                          <td></td> 
                          <td>{emotionValue.label}</td>
                          <td>{emotionValue.score}</td> 
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailedImages = () => {
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detailed-analysis');
        
        // Log the response to verify the structure
       
        
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
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;

  return (
    <div>
      <h1>Detailed Emotion Analysis</h1>
      {detailedData.map((user) => (
        <div key={user.username}>
          <h2>User: {user.username}</h2>
          {user.sessions.map((session) => (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>
              
              {session.imagesWithEmotions.map((image) => (
                <div key={image.imagePath}>
                 
                  <div>
                    
                    <img
                      src={`http://localhost:5000/uploads/${image.imagePath}`}
                      alt={image.imageUrl} width="300"
                      
                       // Placeholder on error
                    />
                    
                  </div>
                  
                  <div>
                    <strong>Captured At: </strong>
                    {new Date(image.capturedAt).toLocaleString()}
                  </div>
                  

                  <table border="1" style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Emotion</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(image.emotions).map(([emotionKey, emotionValue], idx) => (
                        <tr key={idx}>
                          <td>{emotionValue.label}</td>
                          <td>{emotionValue.score}</td> 
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedImages;
*/
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailedImages = () => {
  const { sessionId, username } = useParams();
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [selectedSessionId, setSelectedSessionId] = useState(null); // Add state for selected session

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/detailed-analysis/$(sessionId}`);
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
    if(sessionId)
   { fetchData();}
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;
  if (!detailedData.length) return <p>No images available.</p>;
/*
  // Function to handle session selection
  const handleSessionSelection = (gameSessionId) => {
    setSelectedSessionId(gameSessionId);
  };
*/
  // Filter the detailedData based on the selected game session
 /* const filteredData = detailedData.map((user) => ({
    ...user,
    sessions: user.sessions.filter((session) => session.gameSessionId === selectedSessionId),
  }));
  return (
    <div>
      <h1>Detailed Emotion Analysis for Session {sessionId}</h1>
      {detailedData.map((user) =>
        user.sessions.map((session) =>
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
        )
      )}
    </div>
  );
};

export default DetailedImages;
*/

import React, { useEffect, useState } from 'react';
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

      {/* Render images and emotions for the selected session */}
      {detailedData.map((user) => (
        user.sessions.map((session) => (
          session.gameSessionId === sessionId && (
            <div key={session.gameSessionId}>
              <h3>Game Session ID: {session.gameSessionId}</h3>

              {session.imagesWithEmotions.map((image) => (
                <div key={image.imagePath}>
                  {/* Image and captured time displayed */}
                  <div>
                    <img
                      src={`http://localhost:5000/uploads/${image.imagePath}`}
                      alt={image.imagePath}
                      width="300"
                    />
                    <h4>Captured At: {new Date(image.capturedAt).toLocaleString()}</h4>
                  </div>

                  {/* Emotion table */}
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

export default DetailedImages;
