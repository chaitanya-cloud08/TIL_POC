import React, { useState, useEffect, useCallback } from 'react';

// --- Game Constants ---
const CODE_LENGTH = 3;
const MAX_GUESSES = 5;

// --- Helper Functions ---

/**
 * Generates a random, non-repeating 3-digit code.
 */
const generateSecretCode = () => {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let count = digits.length;
  // Modern Fisher-Yates shuffle algorithm
  while (count > 0) {
    const index = Math.floor(Math.random() * count);
    count--;
    [digits[count], digits[index]] = [digits[index], digits[count]];
  }
  return digits.slice(0, CODE_LENGTH);
};

/**
 * **DEFINITIVE GUESS EVALUATION LOGIC**
 */
const evaluateGuess = (guess, secret) => {
  const guessArray = [...guess];
  const secretArray = [...secret];
  const feedback = new Array(CODE_LENGTH).fill(null);

  // Pass 1: Check for correct digits in the correct position (✅)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessArray[i] === secretArray[i]) {
      feedback[i] = '✅';
      secretArray[i] = null;
      guessArray[i] = null;
    }
  }
  // Pass 2: Check for correct digits in the wrong position (🔄)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessArray[i] !== null) {
      const indexInSecret = secretArray.indexOf(guessArray[i]);
      if (indexInSecret !== -1) {
        feedback[i] = '🔄';
        secretArray[indexInSecret] = null;
      }
    }
  }
  // Pass 3: Fill any remaining slots with '❌'
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (feedback[i] === null) {
      feedback[i] = '❌';
    }
  }
  return feedback;
};


function CodeTodDo() {
  const [secretCode, setSecretCode] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [history, setHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');

  const resetGame = useCallback(() => {
    setSecretCode(generateSecretCode());
    setCurrentGuess([]);
    setHistory([]);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleDigitClick = (digit) => {
    if (gameStatus !== 'playing' || currentGuess.length >= CODE_LENGTH || currentGuess.includes(digit)) return;
    setCurrentGuess(prev => [...prev, digit]);
  };

  const handleBackspace = () => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (currentGuess.length !== CODE_LENGTH || gameStatus !== 'playing') return;
    const feedback = evaluateGuess(currentGuess, secretCode);
    setHistory(prev => [...prev, { guess: currentGuess.join(''), feedback }]);
    if (currentGuess.join('') === secretCode.join('')) {
      setGameStatus('won');
    } else if (history.length + 1 >= MAX_GUESSES) {
      setGameStatus('lost');
    } else {
      setCurrentGuess([]);
    }
  };

  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const guessesLeft = MAX_GUESSES - history.length;

  return (
    // Responsive container: On small screens, content starts at the top. On larger screens, it's centered.
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 font-sans select-none ">
      {/* max-w-sm is kept to prevent the layout from becoming too wide on desktops. */}
      <main className="w-full max-w-sm mx-auto flex flex-col items-center space-y-3 sm:space-y-4 scale-[0.7] -mt-32">
        
        <header className="text-center">
         
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 p-2">कोड तोड़ दो</h1>
          
          <p className="mt-1 text-sm sm:text-base text-gray-400">आपको {CODE_LENGTH} अंकों का गुप्त कोड तोड़ना है</p>
        </header>

        <section className="w-full bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base sm:text-lg font-bold">पिछली कोशिशें</h2>
            <span className="text-xs sm:text-sm font-semibold bg-gray-700 px-2 py-1 rounded">
              बची हुई कोशिशें: {guessesLeft}
            </span>
          </div>
          {/* Responsive height for the history panel */}
          <div className="space-y-2 h-36 sm:h-40 overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center pt-12 text-sm sm:text-base">अभी तक कोई कोशिश नहीं।</p>
            ) : (
              [...history].reverse().map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded animate-fade-in">
                  <span className="text-lg sm:text-xl tracking-widest font-mono">{item.guess}</span>
                  <div className="flex space-x-2">
                    {item.feedback.map((emoji, i) => <span key={i} className="text-lg sm:text-xl">{emoji}</span>)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Responsive height for the main display area */}
        <section className="w-full h-20 sm:h-24 flex items-center justify-center">
          {gameStatus === 'playing' && (
            // Responsive spacing for guess boxes
            <div className="flex space-x-2 sm:space-x-3">
              {[...Array(CODE_LENGTH)].map((_, i) => (
                // Responsive size and font for guess boxes
                <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-bold text-cyan-400 transition-all font-mono">
                  {currentGuess[i] || ''}
                </div>
              ))}
            </div>
          )}
          {gameStatus === 'won' && (
            <div className="text-center animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-green-400">🎉 आपने कोड तोड़ दिया!</h2>
              <p className="text-base sm:text-xl text-gray-300 mt-2">सही कोड था: <span className="font-bold tracking-widest font-mono">{secretCode.join('')}</span></p>
            </div>
          )}
          {gameStatus === 'lost' && (
            <div className="text-center animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-red-400">😢 कोशिश खत्म!</h2>
              <p className="text-base sm:text-xl text-gray-300 mt-2">सही कोड था: <span className="font-bold tracking-widest font-mono">{secretCode.join('')}</span></p>
            </div>
          )}
        </section>

        <section className="w-full bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg">
          {/* Responsive gap for the keypad grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            {keypadDigits.map(digit => (
              // Responsive padding and font size for keypad buttons
              <button key={digit} onClick={() => handleDigitClick(digit)} disabled={currentGuess.includes(digit) || gameStatus !== 'playing'} className="py-3 sm:py-4 text-xl sm:text-2xl font-bold bg-gray-700 rounded-lg hover:bg-gray-600 active:scale-95 transition-all disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed">
                {digit}
              </button>
            ))}
             <button onClick={handleBackspace} disabled={currentGuess.length === 0 || gameStatus !== 'playing'} className="py-3 sm:py-4 text-base sm:text-xl font-bold bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              पीछे जाओ
            </button>
            <button onClick={handleSubmit} disabled={currentGuess.length !== CODE_LENGTH || gameStatus !== 'playing'} className="col-span-2 py-3 sm:py-4 text-base sm:text-xl font-bold bg-green-600 text-white rounded-lg hover:bg-green-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              सबमिट करो
            </button>
          </div>
          <button onClick={resetGame} className="w-full py-2 sm:py-3 mt-2 text-base sm:text-lg font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:scale-95 transition-transform">
            दोबारा शुरू करो
          </button>
        </section>
      </main>
    </div>
  );
}

export default CodeTodDo;