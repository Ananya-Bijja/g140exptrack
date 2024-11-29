/*import React, { useState, useEffect, useRef } from 'react';

let WebcamCapture = ({ loggedInUsername,isCameraActive }) => {
  let videoRef = useRef(null);
  let [isCameraReady, setIsCameraReady] = useState(false);

  let uploadImage = async (imageBlob) => {
    let formData = new FormData();
    formData.append('file', imageBlob, 'webcam_image.jpg'); // Ensure this matches the upload.single('image') in your server code
    formData.append('username', loggedInUsername); // Include the logged-in username

    try {
      let uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await uploadResponse.json();
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  let captureImage = () => {
    if (videoRef.current) {
      let canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      let context = canvas.getContext('2d');
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
    let setupCamera = async () => {
      if (isCameraActive) {
        try {
          let stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      } else if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };

    setupCamera();

    let intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
      // Clean up the camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
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

let WebcamCapture = ({ loggedInUsername, gameSessionId, isCameraActive }) => {
  let videoRef = useRef(null);
  let [isCameraReady, setIsCameraReady] = useState(false);

  let uploadImage = async (imageBlob) => {
    let formData = new FormData();
    formData.append('file', imageBlob, 'webcam_image.jpg');
    formData.append('username', loggedInUsername); 
    formData.append('gameSessionId', gameSessionId); // Include the game session ID

    try {
      let uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image: ' + (await uploadResponse.text()));
      }

      let data = await uploadResponse.json();
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  let captureImage = () => {
    if (videoRef.current) {
      let canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      let context = canvas.getContext('2d');
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
    let setupCamera = async () => {
      if (isCameraActive) {
        try {
          let stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      } else if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };

    setupCamera();

    let intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
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

let WebcamCapture = ({ loggedInUsername, gameSessionId, isCameraActive, takeGameScreenshot }) => {
  let videoRef = useRef(null);
  let [isCameraReady, setIsCameraReady] = useState(false);

  let uploadImage = async (imageBlob, imageName) => {
    let formData = new FormData();
    formData.append('file', imageBlob, imageName);
    formData.append('username', loggedInUsername);
    formData.append('gameSessionId', gameSessionId);
    formData.append('type', 'image');

    try {
      let uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image: ' + (await uploadResponse.text()));
      }

      let data = await uploadResponse.json();
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  let captureImage = () => {
    if (videoRef.current) {
      let canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      let context = canvas.getContext('2d');
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
    let setupCamera = async () => {
      if (isCameraActive) {
        try {
          let stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        } catch (error) {
          console.error('Error accessing the camera:', error);
        }
      } else if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };

    setupCamera();

    let intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
        takeGameScreenshot(); // Capture game screenshot simultaneously
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
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
