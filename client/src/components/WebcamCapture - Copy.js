/*import React, { useState, useEffect, useRef } from 'react';

const WebcamCapture = ({ loggedInUsername,isCameraActive }) => {
  const videoRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const uploadImage = async (imageBlob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'webcam_image.jpg'); // Ensure this matches the upload.single('image') in your server code
    formData.append('username', loggedInUsername); // Include the logged-in username

    try {
      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await uploadResponse.json();
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            uploadImage(blob);
          } else {
            console.error('Failed to capture image');
          }
        },
        'image/jpeg',
        0.95
      );
    }
  };


  useEffect(() => {
    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      } else if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };

    setupCamera();

    const intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
      // Clean up the camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, isCameraReady]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default WebcamCapture;*/
/*
import React, { useState, useEffect, useRef } from 'react';

const WebcamCapture = ({ loggedInUsername, gameSessionId, isCameraActive }) => {
  const videoRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const uploadImage = async (imageBlob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'webcam_image.jpg');
    formData.append('username', loggedInUsername); 
    formData.append('gameSessionId', gameSessionId); // Include the game session ID

    try {
      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image: ' + (await uploadResponse.text()));
      }

      const data = await uploadResponse.json();
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            uploadImage(blob);
          } else {
            console.error('Failed to capture image');
          }
        },
        'image/jpeg',
        0.95
      );
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      } else if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };

    setupCamera();

    const intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, isCameraReady]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default WebcamCapture;
*/

import React, { useState, useEffect, useRef } from 'react';

const WebcamCapture = ({ loggedInUsername, gameSessionId, isCameraActive, takeGameScreenshot }) => {
  const videoRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const uploadImage = async (imageBlob, imageName) => {
    const formData = new FormData();
    formData.append('file', imageBlob, imageName);
    formData.append('username', loggedInUsername);
    formData.append('gameSessionId', gameSessionId);
    formData.append('type', 'image');

    try {
      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image: ' + (await uploadResponse.text()));
      }

      const data = await uploadResponse.json();
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            uploadImage(blob, 'webcam_image.jpg');
          } else {
            console.error('Failed to capture image');
          }
        },
        'image/jpeg',
        0.95
      );
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      } else if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };

    setupCamera();

    const intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
        takeGameScreenshot(); // Capture game screenshot simultaneously
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, isCameraReady, takeGameScreenshot]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default WebcamCapture;
