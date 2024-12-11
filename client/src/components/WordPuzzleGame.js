import React, { useState, useEffect,useRef , useCallback} from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/style8.css';
import WebcamCapture from './WebcamCapture';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { puzzles, affirmationMessages,funFacts } from '../data/data';


function WordPuzzleGame({ loggedInUsername }) {
  const location = useLocation();
  const gameSessionId = location.state?.gameSessionId;
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isWrongWord, setIsWrongWord] = useState(false);
  const [isWordFound, setIsWordFound] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [funFact, setFunFact] = useState('');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false); // New state
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
  let gameContainerRef = useRef(null);
  
  const wordPuzzleBackground = {
    backgroundImage:  `url('/assets/images/Screenshot (122).png')`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', 
    minHeight: '100vh',
  };

  const handleNextPuzzle = useCallback(() => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setSelectedLetters([]);
      setIsWrongWord(false);
      setMessage('');
      setErrorMessage(''); 
      setIsWordFound(false);
    } else {
      setGameFinished(true);
      setIsCameraActive(false);
      setShowConfetti(true);
    }
  }, [currentPuzzle]);


  const handleFinishGame = () => {
    setGameFinished(true);
    setIsCameraActive(false);
    setShowConfetti(true);
    setCameraPermissionGranted(false);  // Reset camera permission on game finish
  };

const requestCameraAccess = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    setCameraPermissionGranted(true);  // Set camera permission to granted
    setCameraErrorMessage('');  // Clear any error messages if permission is granted
  } catch (error) {
    console.error('Camera access denied:', error);
    setCameraErrorMessage('Please allow camera access to play the game.');
  }
};

  useEffect(() => {
    setCameraPermissionGranted(false);
    requestCameraAccess();
  }, []);

  const speakText = (text, accent = "en-IN") => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.lang === accent);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn(`Accent "${accent}" not found. Using default voice.`);
      }
      utterance.onend = resolve;
      utterance.onerror = reject;
      speechSynthesis.speak(utterance);
    });
  };
  

  const playAffirmationMessage = useCallback(async () => {
    const randomMessage = affirmationMessages[Math.floor(Math.random() * affirmationMessages.length)];
    setMessage(randomMessage);
    setErrorMessage(''); 
    try {
      await speakText(randomMessage);
      handleNextPuzzle();
    } catch (error) {
      console.error('Error speaking affirmation message:', error);
    }
  }, [handleNextPuzzle]);

  const playErrorMessage = useCallback(async () => {
    const errorMsg = "Oops! That's not the correct word.";
    setErrorMessage(errorMsg); 
    try {
      await speakText(errorMsg);
    } catch (error) {
      console.error('Error speaking error message:', error);
    }
  }, []);
  useEffect(() => {
    const randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFunFact(randomFunFact);
  }, []);


  const checkWordFound = useCallback(() => {
    if (gameFinished) return;
    const puzzle = puzzles[currentPuzzle];
    if (selectedLetters.length === 3) {
      const selectedWord = selectedLetters.map((i) => puzzle.grid[i]).join('');
      if (selectedWord === puzzle.word) {
        if (!isWordFound) {
          setIsWordFound(true);
          setFoundWords(new Set([...foundWords, puzzle.word]));
          setScore((prevScore) => prevScore + 1);
          playAffirmationMessage();
        }
      } else {
        playErrorMessage();
        setIsWrongWord(true);
        setTimeout(() => {
          setSelectedLetters([]);
          setIsWrongWord(false);
        }, 1000);
      }
    }
  }, [currentPuzzle, selectedLetters, foundWords, isWordFound, gameFinished, playAffirmationMessage, playErrorMessage]);

  useEffect(() => {
    if (currentPuzzle !== null && currentPuzzle < puzzles.length) {
      const puzzle = puzzles[currentPuzzle];
      const puzzleAudio = new Audio(puzzle.audio);
      puzzleAudio.play().catch((err) => {
        console.warn('Autoplay blocked: ', err);
      });
    }
  }, [currentPuzzle]);

  
  let handleCellClick = (index) => {
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index)); 
    } else {
      setSelectedLetters([...selectedLetters, index]); 
    }
  };

  // Trigger word check whenever selected letters change
  useEffect(() => {
    if (selectedLetters.length === 3) {
      checkWordFound();
    }
  }, [selectedLetters, checkWordFound]);


  const handlePlayNow = () => {
    setCameraPermissionGranted(false);
    setCurrentPuzzle(0);
    setIsCameraActive(true);
    setShowConfetti(false);
    requestCameraAccess(); 
  };
  
  let takeGameScreenshot = () => {
    if (gameContainerRef.current) {
      html2canvas(gameContainerRef.current,{crossOrigin:"anonymous"} ,{allowTaint: true},{ useCORS: true }).then((canvas) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              uploadScreenshot(blob, 'game_screenshot.jpg');
            } else {
              console.error('Failed to capture game screenshot');
            }
          },
          'image/jpeg',
          0.95
        );
      }).catch((err) => {
        console.error('Error capturing game screenshot:', err);
      });
    }
  };
  
  let uploadScreenshot = async (blob, filename) => {
    let formData = new FormData();
    formData.append('file', blob, filename);
    formData.append('username', loggedInUsername);
    formData.append('gameSessionId', gameSessionId);
    formData.append('type', 'screenshot');
    try {
      let response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload screenshot: ' + (await response.text()));
      }

      let data = await response.json();
      console.log('Screenshot uploaded:', data);
    } catch (error) {
      console.error('Error uploading screenshot:', error);
    }
  };



  useEffect(() => {
    const screenshotInterval = setInterval(() => {
      takeGameScreenshot();
    }, 3000);

   
    return () => {
      clearInterval(screenshotInterval);
    };
  }, [gameFinished]);


return (
  <div style={wordPuzzleBackground}>
  <div className="app">
    {showConfetti && <Confetti />} {/* Display confetti if game is finished */}
    <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive} gameSessionId={gameSessionId} />
    {currentPuzzle === null ? (
      <div id="splashScreen">
        <h1>
          <span style={{ color: '#4caf50' }}></span>{' '}
          <i>
           Hey{' '}
           <span className="username" style={{ color: '#000' }}>{loggedInUsername}</span>{' '}
           ,{' '}
           </i>
            Welcome to the Word Puzzle Game 🎉
        </h1>

        <div id="welcomeContainer">
          {/* Play Now Button */}
          <div id="instructions">
            <h2>How to Play</h2>
      <ul>
        <li>Select letters to form a word.</li>
        <li>Find the hidden word in the puzzle grid.</li>
        <li>Earn points for correct answers!</li>
      </ul>
    </div>
    {cameraPermissionGranted ? (
          <button onClick={handlePlayNow}>Play Now</button>
        ):(<p style={{ color: 'red' }}>{cameraErrorMessage}</p>
        )}
          {/* Fun fact box below Play Now */}
          <div className="funFactBox">
        
        <p>Fun Fact: {funFact.fact}</p>
      </div>
    </div>
  </div>

    ) : !gameFinished ? (
      <>
        <div ref={gameContainerRef} id="gameContainer">
          <img
            id="puzzleImage"
            src={puzzles[currentPuzzle].image}
            alt="Puzzle"
          />
          <div id="puzzle">
            {puzzles[currentPuzzle].grid.map((letter, index) => (
              <div
                key={index}
                className={`cell 
                  ${selectedLetters.includes(index) ? 'selected' : ''} 
                  ${
                    foundWords.has(puzzles[currentPuzzle].word) &&
                    selectedLetters.includes(index)
                      ? 'found'
                      : ''
                  }
                  ${isWrongWord && selectedLetters.includes(index) ? 'wrong' : ''}`}
                onClick={() => handleCellClick(index)}
              >
                {letter}
              </div>
            ))}
          </div>
          <div id="message">{message}</div>
          <div id="errorMessage">{errorMessage}</div> {/* Render the error message */}
          {currentPuzzle === puzzles.length - 1 ? (
            <button id="finishGameButton" onClick={handleFinishGame}>
              Finish Game
            </button>
          ) : (
            <button id="nextPuzzleButton" onClick={handleNextPuzzle}>
              Next Puzzle
            </button>
          )}
        </div>
      </>
    ) : (
      <div id="congratsScreen">
        <h1 className="congratsTitle">Congratulations! You have done a great job!</h1>
        <div className="scoreDisplay">
          <p>Your score: <span className="scoreNumber">{score}</span> / {puzzles.length}</p>
        </div>
        <p className="thankYouMessage">Thank you for playing!</p>
      </div>
    )}
  </div>
  </div>
);
}


export default WordPuzzleGame;