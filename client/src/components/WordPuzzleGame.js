import React, { useState, useEffect,useRef , useCallback} from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/style8.css';
import WebcamCapture from './WebcamCapture';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';

// Array of puzzle objects, each containing a word, letter grid, image, and audio file
let puzzles = [
  {
    word: 'CAT',
    grid: ['C', 'A', 'T', 'L', 'B', 'A', 'U', 'Y', 'X'],
    image: '/assets/images/cat.gif',
    audio: '/assets/audio/catsound.mp3',
  },
  {
    word: 'DOG',
    grid: ['Q', 'M', 'D', 'H', 'O', 'P', 'G', 'X', 'W'],
    image: '/assets/images/dog1.gif',
    audio: '/assets/audio/dogsound.mp3',
  },
  {
    word: 'SUN',
    grid: ['S', 'B', 'P', 'U', 'C', 'E', 'N', 'F', 'Q'],
    image: '/assets/images/giphy.gif',
    audio: '/assets/audio/sunsound.mp3',
  },
  {
    word: 'CAR',
    grid: ['C', 'Y', 'O', 'A', 'P', 'I', 'R', 'K', 'S'],
    image: '/assets/images/car.gif',
    audio: '/assets/audio/carsound.mp3',
  },
];

const affirmationMessages = [
  'Great job! You found the word!',
  'Excellent work!',
  'Well done!',
  'Awesome! Keep going!',
  "You're amazing!",
];

function WordPuzzleGame({ loggedInUsername }) {

 

  
  // useEffect for setting up the puzzle when the current puzzle index changes
 /* useEffect(() => {
    if (currentPuzzle !== null && currentPuzzle < puzzles.length) {
      let puzzle = puzzles[currentPuzzle];
      setMessage(''); 
      setSelectedLetters([]); 
      setFoundWords(new Set()); 
      setIsWrongWord(false); 
      audio.src = puzzle.audio; 
      audio.play().catch((err) => {
        console.warn('Autoplay blocked: ', err); */
  const location = useLocation();
  const gameSessionId = location.state?.gameSessionId;
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [isWrongWord, setIsWrongWord] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWordFound, setIsWordFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let [audio] = useState(new Audio());  // State for the error message
  let gameContainerRef = useRef(null);
  
  const handleNextPuzzle = useCallback(() => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setSelectedLetters([]);
      setIsWrongWord(false);
      setMessage('');
      setErrorMessage(''); // Reset error message when moving to the next puzzle
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
  };

  const speakText = (text) => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = resolve;
      utterance.onerror = reject;
      speechSynthesis.speak(utterance);
    });
  };

  const playAffirmationMessage = useCallback(async () => {
    const randomMessage = affirmationMessages[Math.floor(Math.random() * affirmationMessages.length)];
    setMessage(randomMessage);
    setErrorMessage(''); // Reset error message before displaying affirmation
    try {
      await speakText(randomMessage);
      handleNextPuzzle();
    } catch (error) {
      console.error('Error speaking affirmation message:', error);
    }
  }, [handleNextPuzzle]);

  const playErrorMessage = useCallback(async () => {
    const errorMsg = "Oops! That's not the correct word.";
    setErrorMessage(errorMsg); // Set error message state
    try {
      await speakText(errorMsg);
    } catch (error) {
      console.error('Error speaking error message:', error);
    }
  }, []);

  /*const handleCellClick = (index) => {
    if (selectedLetters.length < 3 && !selectedLetters.includes(index)) {
      setSelectedLetters([...selectedLetters, index]);
    }
  };*/

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

 /* // Function to convert text to speech
  let speakText = (text) => {
    let utterance = new SpeechSynthesisUtterance(text); 
    speechSynthesis.speak(utterance);
  };*/

  // Function to play a random affirmation message when a word is found
 /* let playAffirmationMessage = () => {
    let randomMessage = affirmationMessages[Math.floor(Math.random() * affirmationMessages.length)]; 
    setMessage(randomMessage); 
    speakText(randomMessage); 
  };*/

  // Function to play an error message if an incorrect word is selected
/*  let playErrorMessage = () => {
    let errorMessage = "Oops! That's not the correct word.";
    setMessage(errorMessage); 
    speakText(errorMessage); 
  };
*/
  // Handle click events on the puzzle cells
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


  // Start the game and activate the camera

  const handlePlayNow = () => {
    setCurrentPuzzle(0);
    setIsCameraActive(true);
    setShowConfetti(false);
  };

  let takeGameScreenshot = () => {
    if (gameContainerRef.current) {
      html2canvas(gameContainerRef.current,{crossOrigin:"anonymous"} ,{allowTaint: true},{ useCORS: true }/*,{ scale: 2 }*/).then((canvas) => {
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
  
 /* useEffect(() => {
    // Start capturing screenshots every 3 seconds
    const interval = setInterval(takeGameScreenshot, 3000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);*/
  

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




  return (
    <div className="app">
      {showConfetti && <Confetti />} {/* Display confetti if game is finished */}

      <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive} gameSessionId={gameSessionId} takeGameScreenshot={takeGameScreenshot} />
      {currentPuzzle === null ? (
        <div id="splashScreen">
          <h1>Welcome to the Word Puzzle Game</h1>
          <button onClick={handlePlayNow}>Play Now</button>
        </div>
      ) : !gameFinished ? (
        <>
          <div ref={gameContainerRef} id="gameContainer">
            <img
              id="puzzleImage"
              src={puzzles[currentPuzzle].image}
              alt="Puzzle"
            /> {/* Puzzle image */}
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
  );
}


export default WordPuzzleGame;
