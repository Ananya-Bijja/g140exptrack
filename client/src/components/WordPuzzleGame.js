import React, { useState, useEffect,useRef , useCallback} from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/style8.css';
import WebcamCapture from './WebcamCapture';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { puzzles, affirmationMessages } from '../data/data';
// Array of puzzle objects, each containing a word, letter grid, image, and audio file
export const funFacts = [
  { fact: "Did you know? A group of flamingos is called a 'flamboyance'! 🦩", emoji: "🦩" },
  { fact: "Bananas are berries, but strawberries are not! 🍌🍓", emoji: "🍌🍓" },
  { fact: "Honey never spoils! Archaeologists have found pots of honey in ancient tombs. 🍯", emoji: "🍯" },
  { fact: "Elephants are the only animals that can't jump! 🐘", emoji: "🐘" },
  { fact: "Did you know? Octopuses have three hearts! 🐙", emoji: "🐙" },
  { fact: "Sloths can hold their breath longer than dolphins! 🦥", emoji: "🦥" },
  { fact: "Cows have best friends and get stressed when they're separated! 🐄❤️", emoji: "🐄❤️" },
  { fact: "A day on Venus is longer than a year on Venus! 🌍", emoji: "🌍" },
  { fact: "Sharks existed before trees! 🦈🌳", emoji: "🦈🌳" },
  { fact: "Wombat poop is cube-shaped! 🐾", emoji: "🐾" },
  { fact: "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion. 🗼", emoji: "🗼" },
  { fact: "Water makes different sounds depending on its temperature! 💧", emoji: "💧" },
  { fact: "The longest hiccuping spree lasted 68 years! 😲", emoji: "😲" }
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
  const [gameFinished, setGameFinished] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWordFound, setIsWordFound] = useState(false);
  const [funFact, setFunFact] = useState('');
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

  // const speakText = (text) => {
  //   return new Promise((resolve, reject) => {
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.onend = resolve;
  //     utterance.onerror = reject;
  //     speechSynthesis.speak(utterance);
  //   });
  // };
  const speakText = (text, accent = "en-IN") => {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
  
      // Fetch available voices
      const voices = speechSynthesis.getVoices();
  
      // Find and set the desired voice based on accent (language)
      const selectedVoice = voices.find(voice => voice.lang === accent);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        console.warn(`Accent "${accent}" not found. Using default voice.`);
      }
  
      // Event listeners for resolve and reject
      utterance.onend = resolve;
      utterance.onerror = reject;
  
      // Speak the text
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
  useEffect(() => {
    const randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFunFact(randomFunFact);
  
    // Create a SpeechSynthesisUtterance with just the fact text (not the entire object)
    const utterance = new SpeechSynthesisUtterance(randomFunFact.fact);
  
    // Optional: Set the voice/accent
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang === 'en-IN'); // Adjust as needed
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  
    // Speak the fact
    speechSynthesis.speak(utterance);
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
    // Set up the interval for capturing and uploading screenshots every 3 seconds
    const screenshotInterval = setInterval(() => {
      takeGameScreenshot();
    }, 3000);

    // Clean up the interval when the game is finished or the component is unmounted
    return () => {
      clearInterval(screenshotInterval);
    };
  }, [gameFinished]);


//   return (
//     <div className="app">
//       {showConfetti && <Confetti />} {/* Display confetti if game is finished */}
/*
      <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive} gameSessionId={gameSessionId}  />
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
            <div id="errorMessage">{errorMessage}</div> 
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
*/
return (
  <div className="app">
    {showConfetti && <Confetti />} {/* Display confetti if game is finished */}
    <WebcamCapture loggedInUsername={loggedInUsername} isCameraActive={isCameraActive} gameSessionId={gameSessionId} />
    {currentPuzzle === null ? (
      <div id="splashScreen">
        <h1>
  <span style={{ color: '#4caf50' }}></span>{' '}
  <i
    style={{
      animation: 'colorChange 2s infinite', /* Color animation */
    }}
  >
    Hey{' '}
    <span className="username" style={{ color: 'lavender' }}>{loggedInUsername}</span>{' '}
  </i>,{' '}
  <span style={{ color: '#3f51b5' }}>Welcome to the Word Puzzle Game</span> 🎉
</h1>

        <div id="welcomeContainer">
          {/* Play Now Button */}
          <button onClick={handlePlayNow}>Play Now</button>

          {/* Fun fact box below Play Now */}
          <div className="funFactBox">
        <div className="funFactHeading">FUN FACT:</div>
        <p>{funFact.fact}</p>
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
);
}


export default WordPuzzleGame;


