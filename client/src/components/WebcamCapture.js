
import React, { useState, useEffect, useRef } from 'react';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const uploadImage = async (imageBlob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'webcam_image.jpg'); // Ensure 'image' matches the server

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
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    setupCamera();

    const intervalId = setInterval(() => {
      if (isCameraReady) {
        captureImage();
      }
    }, 3000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraReady]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default WebcamCapture; 
