/*import React, { useState, useEffect } from 'react';
import '../styles/style8.css';
import WebcamCapture from './WebcamCapture';

const puzzles = [
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

function WordPuzzleGame({loggedInUsername}) {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [isWrongWord, setIsWrongWord] = useState(false);
  const [score, setScore] = useState(0);
  const [audio] = useState(new Audio());
  const [gameFinished, setGameFinished] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false); // State to control camera


  useEffect(() => {
    if (currentPuzzle !== null && currentPuzzle < puzzles.length) {
      const puzzle = puzzles[currentPuzzle];
      setMessage('');
      setSelectedLetters([]);
      setFoundWords(new Set());
      setIsWrongWord(false);
      audio.src = puzzle.audio;
      audio.play().catch((err) => {
        console.warn('Autoplay blocked: ', err);
      });
    } else if (currentPuzzle !== null) {
      setGameFinished(true);
      setIsCameraActive(false); // Stop the camera when the game finishes

    }
  }, [currentPuzzle, audio]);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const playAffirmationMessage = () => {
    const randomMessage =
      affirmationMessages[Math.floor(Math.random() * affirmationMessages.length)];
    setMessage(randomMessage);
    speakText(randomMessage);
  };

  const playErrorMessage = () => {
    const errorMessage = "Oops! That's not the correct word.";
    setMessage(errorMessage);
    speakText(errorMessage);
  };

  const handleCellClick = (index) => {
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index));
    } else {
      setSelectedLetters([...selectedLetters, index]);
    }
  };

  const checkWordFound = () => {
    const puzzle = puzzles[currentPuzzle];
    const selectedWord = selectedLetters.map((i) => puzzle.grid[i]).join('');

    if (selectedWord === puzzle.word) {
      playAffirmationMessage();
      setFoundWords(new Set([...foundWords, puzzle.word]));
      setIsWrongWord(false);
      setScore(score + 1);
    } else if (selectedLetters.length === puzzle.word.length) {
      playErrorMessage();
      setIsWrongWord(true);

      setTimeout(() => {
        setSelectedLetters([]);
        setIsWrongWord(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (selectedLetters.length) {
      checkWordFound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLetters]);

  const handleNextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
    } else {
      setGameFinished(true);
      setIsCameraActive(false); // Stop the camera when finishing the last puzzle

    }
  };
  const handlePlayNow = () => {
    setCurrentPuzzle(0);
    setIsCameraActive(true); // Start the camera when the game starts
  };

  return (
    <div className="app">
      <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive}/>
      
      {currentPuzzle === null ? (
        <div id="splashScreen">
          <h1>Welcome to the Word Puzzle Game</h1>
          <button onClick={handlePlayNow}>Play Now</button>
        </div>
      ) : !gameFinished ? (
        <>
          <div id="gameContainer">
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
            <button id="nextPuzzleButton" onClick={handleNextPuzzle}>
              Next Puzzle
            </button>
          </div>
        </>
      ) : (
        <div id="congratsScreen">
          <h1>Congratulations! You've completed all puzzles!</h1>
          <p>
            Your score: {score} / {puzzles.length}
          </p>
          <p>Thank you for playing!</p>
        </div>
      )}
    </div>
  );
}

export default WordPuzzleGame;*/
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/style8.css';
import WebcamCapture from './WebcamCapture';

const puzzles = [
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
  const location = useLocation();
  const gameSessionId = location.state?.gameSessionId; // Access the game session ID
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [isWrongWord, setIsWrongWord] = useState(false);
  const [score, setScore] = useState(0);
  const [audio] = useState(new Audio());
  const [gameFinished, setGameFinished] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false); // State to control camera

  useEffect(() => {
    if (currentPuzzle !== null && currentPuzzle < puzzles.length) {
      const puzzle = puzzles[currentPuzzle];
      setMessage('');
      setSelectedLetters([]);
      setFoundWords(new Set());
      setIsWrongWord(false);
      audio.src = puzzle.audio;
      audio.play().catch((err) => {
        console.warn('Autoplay blocked: ', err);
      });
    } else if (currentPuzzle !== null) {
      setGameFinished(true);
      setIsCameraActive(false); // Stop the camera when the game finishes
    }
  }, [currentPuzzle, audio]);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const playAffirmationMessage = () => {
    const randomMessage =
      affirmationMessages[Math.floor(Math.random() * affirmationMessages.length)];
    setMessage(randomMessage);
    speakText(randomMessage);
  };

  const playErrorMessage = () => {
    const errorMessage = "Oops! That's not the correct word.";
    setMessage(errorMessage);
    speakText(errorMessage);
  };

  const handleCellClick = (index) => {
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index));
    } else {
      setSelectedLetters([...selectedLetters, index]);
    }
  };

  const checkWordFound = () => {
    const puzzle = puzzles[currentPuzzle];
    const selectedWord = selectedLetters.map((i) => puzzle.grid[i]).join('');

    if (selectedWord === puzzle.word) {
      playAffirmationMessage();
      setFoundWords(new Set([...foundWords, puzzle.word]));
      setIsWrongWord(false);
      setScore(score + 1);
    } else if (selectedLetters.length === puzzle.word.length) {
      playErrorMessage();
      setIsWrongWord(true);

      setTimeout(() => {
        setSelectedLetters([]);
        setIsWrongWord(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (selectedLetters.length) {
      checkWordFound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLetters]);

  const handleNextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
    } else {
      setGameFinished(true);
      setIsCameraActive(false); // Stop the camera when finishing the last puzzle
    }
  };

  const handlePlayNow = () => {
    setCurrentPuzzle(0);
    setIsCameraActive(true); // Start the camera when the game starts
  };

  return (
    <div className="app">
      <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive} gameSessionId={gameSessionId} />
      
      {currentPuzzle === null ? (
        <div id="splashScreen">
          <h1>Welcome to the Word Puzzle Game</h1>
          <button onClick={handlePlayNow}>Play Now</button>
        </div>
      ) : !gameFinished ? (
        <>
          <div id="gameContainer">
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
            <button id="nextPuzzleButton" onClick={handleNextPuzzle}>
              Next Puzzle
            </button>
          </div>
        </>
      ) : (
        <div id="congratsScreen">
          <h1>Congratulations! You've completed all puzzles!</h1>
          <p>
            Your score: {score} / {puzzles.length}
          </p>
          <p>Thank you for playing!</p>
        </div>
      )}
    </div>
  );
}

export default WordPuzzleGame;
