import React, { useState, useEffect, useCallback } from 'react';

// --- Default Game Settings ---
const difficulties = {
  easy: {
    name: 'आसान',
    length: 3,
    repeats: false,
    maxGuesses: 8, // More guesses for beginners
  },
  medium: {
    name: 'मध्यम',
    length: 4,
    repeats: false,
    maxGuesses: 7,
  },
  hard: {
    name: 'कठिन',
    length: 5,
    repeats: true, // Repeats allowed
    maxGuesses: 6,
  },
};

// --- Helper Functions ---

/**
 * Generates a random code based on the selected difficulty.
 * @param {number} length - The length of the code.
 * @param {boolean} allowRepeats - Whether digits can be repeated.
 * @returns {Array<string>} The secret code.
 */
const generateSecretCode = (length, allowRepeats) => {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (!allowRepeats) {
    // Modern Fisher-Yates shuffle for non-repeating digits
    let count = digits.length;
    while (count > 0) {
      const index = Math.floor(Math.random() * count);
      count--;
      [digits[count], digits[index]] = [digits[index], digits[count]];
    }
    return digits.slice(0, length);
  } else {
    // Simple random selection for codes with repeating digits
    const code = [];
    for (let i = 0; i < length; i++) {
      code.push(digits[Math.floor(Math.random() * digits.length)]);
    }
    return code;
  }
};

/**
 * **DEFINITIVE GUESS EVALUATION LOGIC**
 */
const evaluateGuess = (guess, secret) => {
  const codeLength = secret.length;
  const guessArray = [...guess];
  const secretArray = [...secret];
  const feedback = new Array(codeLength).fill(null);

  // Pass 1: Check for correct digits in the correct position (✅)
  for (let i = 0; i < codeLength; i++) {
    if (guessArray[i] === secretArray[i]) {
      feedback[i] = '✅';
      secretArray[i] = null;
      guessArray[i] = null;
    }
  }
  // Pass 2: Check for correct digits in the wrong position (🔄)
  for (let i = 0; i < codeLength; i++) {
    if (guessArray[i] !== null) {
      const indexInSecret = secretArray.indexOf(guessArray[i]);
      if (indexInSecret !== -1) {
        feedback[i] = '🔄';
        secretArray[indexInSecret] = null;
      }
    }
  }
  // Pass 3: Fill any remaining slots with '❌'
  for (let i = 0; i < codeLength; i++) {
    if (feedback[i] === null) {
      feedback[i] = '❌';
    }
  }
  return feedback;
};


function CodeTodDo() {
  const [difficulty, setDifficulty] = useState(null);
  const [secretCode, setSecretCode] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [history, setHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('setup'); // 'setup', 'playing', 'won', 'lost'
  const [hintUsed, setHintUsed] = useState(false);
  const [hintMessage, setHintMessage] = useState('');

  const resetGame = useCallback((selectedDifficulty) => {
    const diff = selectedDifficulty || difficulty;
    if (!diff) return;
    setSecretCode(generateSecretCode(diff.length, diff.repeats));
    setCurrentGuess([]);
    setHistory([]);
    setHintUsed(false);
    setHintMessage('');
    setGameStatus('playing');
  }, [difficulty]);
  
  const startGame = (level) => {
    const selectedDifficulty = difficulties[level];
    setDifficulty(selectedDifficulty);
    resetGame(selectedDifficulty);
  };
  
  const returnToMenu = () => {
    setDifficulty(null);
    setGameStatus('setup');
  };

  const handleDigitClick = (digit) => {
    if (gameStatus !== 'playing' || currentGuess.length >= difficulty.length) return;
    // For hard mode, allow repeats in guess. For easy/medium, don't.
    if (!difficulty.repeats && currentGuess.includes(digit)) return;
    setCurrentGuess(prev => [...prev, digit]);
  };

  const handleBackspace = () => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (currentGuess.length !== difficulty.length || gameStatus !== 'playing') return;

    const feedback = evaluateGuess(currentGuess, secretCode);
    setHistory(prev => [...prev, { guess: currentGuess.join(''), feedback }]);

    if (currentGuess.join('') === secretCode.join('')) {
      setGameStatus('won');
    } else if (history.length + 1 >= difficulty.maxGuesses) {
      setGameStatus('lost');
    } else {
      setCurrentGuess([]);
    }
  };

  const handleHint = () => {
    if (hintUsed || gameStatus !== 'playing') return;

    // Find a digit in the secret code that the user hasn't placed correctly yet.
    const unguessedDigits = secretCode.filter((digit, index) => {
      // Check if this digit at this position has been guessed correctly in any previous attempts.
      return !history.some(h => h.guess[index] === digit && h.feedback[index] === '✅');
    });
    
    // If all digits are somehow guessed, pick any, otherwise pick from unguessed.
    const hintDigit = unguessedDigits.length > 0
      ? unguessedDigits[Math.floor(Math.random() * unguessedDigits.length)]
      : secretCode[Math.floor(Math.random() * secretCode.length)];

    setHintMessage(`सुझाव: कोड में अंक "${hintDigit}" मौजूद है।`);
    setHintUsed(true);
  };

  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const guessesLeft = difficulty ? difficulty.maxGuesses - history.length : 0;

  // --- RENDER LOGIC ---

  // Screen 1: Difficulty Selection
  if (gameStatus === 'setup') {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">कोड तोड़ दो</h1>
          <h2 className="text-2xl sm:text-3xl mt-8 mb-4 text-gray-300">कठिनाई का स्तर चुनें</h2>
          <div className="flex flex-col space-y-4 w-64">
            {Object.keys(difficulties).map(level => (
              <button
                key={level}
                onClick={() => startGame(level)}
                className="w-full py-4 text-xl font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:scale-95 transition-all"
              >
                {difficulties[level].name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Main Game Board
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 font-sans select-none scale-[0.6] -mt-40">
      <main className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center space-y-3 sm:space-y-4">
        
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">कोड तोड़ दो</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-400">स्तर: {difficulty.name} ({difficulty.length} अंक)</p>
        </header>

        <section className="w-full bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base sm:text-lg font-bold">पिछली कोशिशें</h2>
            <span className="text-xs sm:text-sm font-semibold bg-gray-700 px-2 py-1 rounded">
              बची हुई कोशिशें: {guessesLeft}
            </span>
          </div>
          <div className="space-y-2 h-36 sm:h-40 overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center pt-12 text-sm sm:text-base">अभी तक कोई कोशिश नहीं।</p>
            ) : (
              [...history].reverse().map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded animate-fade-in">
                  <span className="text-lg sm:text-xl tracking-widest font-mono">{item.guess}</span>
                  <div className={`flex space-x-1 sm:space-x-2`}>
                    {item.feedback.map((emoji, i) => <span key={i} className="text-lg sm:text-xl">{emoji}</span>)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="w-full h-24 sm:h-28 flex flex-col items-center justify-center">
          {gameStatus === 'playing' && (
            <div className="flex space-x-2">
              {[...Array(difficulty.length)].map((_, i) => (
                <div key={i} className={`w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-bold text-cyan-400 transition-all font-mono`}>
                  {currentGuess[i] || ''}
                </div>
              ))}
            </div>
          )}
          {(gameStatus === 'won' || gameStatus === 'lost') && (
            <div className="text-center animate-fade-in-up">
              <h2 className={`text-2xl sm:text-3xl font-bold ${gameStatus === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                {gameStatus === 'won' ? '🎉 आपने कोड तोड़ दिया!' : '😢 कोशिश खत्म!'}
              </h2>
              <p className="text-base sm:text-xl text-gray-300 mt-2">सही कोड था: <span className="font-bold tracking-widest font-mono">{secretCode.join('')}</span></p>
            </div>
          )}
          {hintMessage && <p className="mt-4 text-yellow-400 font-semibold animate-fade-in">{hintMessage}</p>}
        </section>

        <section className="w-full bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            {keypadDigits.map(digit => (
              <button key={digit} onClick={() => handleDigitClick(digit)} disabled={(currentGuess.includes(digit) && !difficulty.repeats) || gameStatus !== 'playing'} className="py-3 sm:py-4 text-xl sm:text-2xl font-bold bg-gray-700 rounded-lg hover:bg-gray-600 active:scale-95 transition-all disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed">
                {digit}
              </button>
            ))}
             <button onClick={handleBackspace} disabled={currentGuess.length === 0 || gameStatus !== 'playing'} className="py-3 sm:py-4 text-base sm:text-xl font-bold bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              पीछे जाओ
            </button>
            <button onClick={handleSubmit} disabled={currentGuess.length !== difficulty.length || gameStatus !== 'playing'} className="col-span-2 py-3 sm:py-4 text-base sm:text-xl font-bold bg-green-600 text-white rounded-lg hover:bg-green-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              सबमिट करो
            </button>
          </div>
          <div className="flex space-x-3 mt-2">
            <button onClick={handleHint} disabled={hintUsed || gameStatus !== 'playing'} className="w-full py-2 sm:py-3 text-base sm:text-lg font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              सुझाव दो
            </button>
            <button onClick={() => resetGame()} className="w-full py-2 sm:py-3 text-base sm:text-lg font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:scale-95 transition-transform">
              दोबारा शुरू करो
            </button>
          </div>
           <button onClick={returnToMenu} className="w-full py-2 sm:py-3 mt-3 text-base sm:text-lg font-bold bg-gray-600 text-white rounded-lg hover:bg-gray-500 active:scale-95 transition-transform">
              स्तर बदलो
            </button>
        </section>
      </main>
    </div>
  );
}

export default CodeTodDo;