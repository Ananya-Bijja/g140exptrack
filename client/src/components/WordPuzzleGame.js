import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/style8.css';
import WebcamCapture from './WebcamCapture';
import Confetti from 'react-confetti';

// Array of puzzle objects, each containing a word, letter grid, image, and audio file
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

// Array of positive affirmation messages for correct answers
const affirmationMessages = [
  'Great job! You found the word!',
  'Excellent work!',
  'Well done!',
  'Awesome! Keep going!',
  "You're amazing!",
];

function WordPuzzleGame({ loggedInUsername }) {
  const location = useLocation(); 
  const gameSessionId = location.state?.gameSessionId; 
  const [currentPuzzle, setCurrentPuzzle] = useState(null); 
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedLetters, setSelectedLetters] = useState([]); 
  const [message, setMessage] = useState(''); 
  const [isWrongWord, setIsWrongWord] = useState(false); 
  const [score, setScore] = useState(0); 
  const [audio] = useState(new Audio()); 
  const [gameFinished, setGameFinished] = useState(false); 
  const [isCameraActive, setIsCameraActive] = useState(false); 
  const [showConfetti, setShowConfetti] = useState(false);

  // useEffect for setting up the puzzle when the current puzzle index changes
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
      setIsCameraActive(false); 
      setShowConfetti(true);
    }
  }, [currentPuzzle, audio]);

  // Function to convert text to speech
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text); 
    speechSynthesis.speak(utterance);
  };

  // Function to play a random affirmation message when a word is found
  const playAffirmationMessage = () => {
    const randomMessage = affirmationMessages[Math.floor(Math.random() * affirmationMessages.length)]; 
    setMessage(randomMessage); 
    speakText(randomMessage); 
  };

  // Function to play an error message if an incorrect word is selected
  const playErrorMessage = () => {
    const errorMessage = "Oops! That's not the correct word.";
    setMessage(errorMessage); 
    speakText(errorMessage); 
  };

  // Handle click events on the puzzle cells
  const handleCellClick = (index) => {
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index)); 
    } else {
      setSelectedLetters([...selectedLetters, index]); 
    }
  };

  // Check if the selected letters form the correct word
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

  // Trigger word check whenever selected letters change
  useEffect(() => {
    if (selectedLetters.length) {
      checkWordFound();
    }
  }, [selectedLetters]);

  // Move to the next puzzle or end the game if all puzzles are completed
  const handleNextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1); 
    } else {
      setGameFinished(true); 
      setIsCameraActive(false); 
      setShowConfetti(true); 
    }
  };

  // Start the game and activate the camera
  const handlePlayNow = () => {
    setCurrentPuzzle(0); 
    setIsCameraActive(true); 
    setShowConfetti(false); 
  };

  return (
    <div className="app">
      {showConfetti && <Confetti />} {/* Display confetti if game is finished */}

      <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive} gameSessionId={gameSessionId} />
      {/* WebcamCapture component with username, camera state, and game session ID */}

      {currentPuzzle === null ? (
        <div id="splashScreen">
          <h1>Welcome to the Word Puzzle Game</h1>
          <button onClick={handlePlayNow}>Play Now</button> {/* Start button */}
        </div>
      ) : !gameFinished ? (
        <>
          <div id="gameContainer">
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
                  {letter} {/* Display each letter in the grid */}
                </div>
              ))}
            </div>
            <div id="message">{message}</div> {/* Display messages */}
            <button id="nextPuzzleButton" onClick={handleNextPuzzle}>
              Next Puzzle
            </button> {/* Button for advancing to the next puzzle */}
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