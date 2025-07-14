import { useState, useEffect, useCallback } from 'react';

const difficulties = {
  easy: { name: 'Easy', length: 3, repeats: false, maxGuesses: 6 },
  medium: { name: 'Medium', length: 4, repeats: false, maxGuesses: 5 },
  hard: { name: 'Hard', length: 5, repeats: true, maxGuesses: 6 },
};

const generateSecretCode = (length, allowRepeats) => {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (!allowRepeats) {
    const shuffled = [...digits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, length);
  } else {
    return Array.from({ length }, () => digits[Math.floor(Math.random() * 10)]);
  }
};

const Key = ({ value, status, onClick }) => {
  const statusStyles = {
    correct: 'bg-green-600 text-white',
    present: 'bg-yellow-500 text-white',
    absent: 'bg-red-700 text-white',
    default: 'bg-gray-400 text-black',
  };

  return (
    <button
      onClick={() => onClick(value)}
      className={`h-12 w-full font-bold uppercase rounded flex items-center justify-center text-base transition-colors ${statusStyles[status]}`}
    >
      {value === 'Backspace' ? '⌫' : value}
    </button>
  );
};

function CrackIt() {
  const [difficulty, setDifficulty] = useState(difficulties.easy);
  const [secretCode, setSecretCode] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [keyStatus, setKeyStatus] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false); 

  const resetGame = useCallback((newDifficulty) => {
    const selectedDifficulty = newDifficulty || difficulty;
    setDifficulty(selectedDifficulty);
    setSecretCode(generateSecretCode(selectedDifficulty.length, selectedDifficulty.repeats));
    setHistory([]);
    setCurrentGuess([]);
    setKeyStatus({});
    setGameStatus('playing');
    setShowModal(false);
    setShowHowToPlay(false);
  }, [difficulty]);

  useEffect(() => {
    resetGame();
  }, []);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleKeyClick = (value) => {
    if (gameStatus !== 'playing') return;

    if (value === 'Submit') {
      handleSubmit();
      return;
    }

    if (value === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (currentGuess.length < difficulty.length) {
      setCurrentGuess((prev) => [...prev, value]);
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length !== difficulty.length) {
      triggerToast('Not enough digits');
      return;
    }

    const guess = currentGuess;
    const secret = [...secretCode];
    const feedback = new Array(difficulty.length).fill('absent');
    const newKeyStatus = { ...keyStatus };

    for (let i = 0; i < difficulty.length; i++) {
      if (guess[i] === secret[i]) {
        feedback[i] = 'correct';
        secret[i] = null;
      }
    }

    for (let i = 0; i < difficulty.length; i++) {
      if (feedback[i] !== 'correct' && secret.includes(guess[i])) {
        feedback[i] = 'present';
        secret[secret.indexOf(guess[i])] = null;
      }
    }

    setHistory((prev) => [...prev, { guess, feedback }]);

    guess.forEach((digit, index) => {
      const currentStatus = feedback[index];
      const existingStatus = newKeyStatus[digit];
      if (currentStatus === 'correct' || (currentStatus === 'present' && existingStatus !== 'correct')) {
        newKeyStatus[digit] = currentStatus;
      } else if (!existingStatus) {
        newKeyStatus[digit] = 'absent';
      }
    });
    setKeyStatus(newKeyStatus);

    if (guess.join('') === secretCode.join('')) {
      setGameStatus('won');
      triggerToast('You won!');
      setShowModal(true);
    } else if (history.length + 1 >= difficulty.maxGuesses) {
      setGameStatus('lost');
      triggerToast(`Correct code was: ${secretCode.join('')}`);
      setShowModal(true);
    }

    setCurrentGuess([]);
  };

  return (
    <div className="-mt-2 lg:min-h-screen bg-gray-900 text-white flex flex-col">
     
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">CrackIt</h1>
          <button
            onClick={() => setShowHowToPlay(true)}
            title="How to Play"
            className="text-xl bg-gray-700 hover:bg-gray-600 p-1 rounded-full"
          >
            ❓
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {Object.keys(difficulties).map(level => (
            <button
              key={level}
              onClick={() => resetGame(difficulties[level])}
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${difficulty.name === difficulties[level].name ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {difficulties[level].name}
            </button>
          ))}
          <button onClick={() => resetGame()} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600">
            🔄
          </button>
        </div>
      </header>

      {showToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-2 px-4 rounded shadow-md animate-bounce z-10">
          {toastMessage}
        </div>
      )}

    
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 w-80 shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              {gameStatus === 'won' ? '🎉 You Won!' : '😢 You Lost!'}
            </h2>
            <p className="mb-4">
              {gameStatus === 'lost' && `Correct Code was: ${secretCode.join('')}`}
            </p>
            <button
              onClick={() => resetGame()}
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

     
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 w-96 max-w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <p className="mb-3">🎯 Your goal: Crack the secret code using logic!</p>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              <li>The code uses numbers 0–9.</li>
              <li>You get {difficulty.maxGuesses} tries.</li>
             <li>You are currently on the {difficulty.name} level.</li>
           <li>Note : Hard level can contain repeated digits.</li>
<li>After each guess:
                <ul className="ml-5 list-disc">
                  <li>🟢 = correct digit & position</li>
                  <li>🟡 = correct digit, wrong position</li>
                  <li>🔴 = wrong digit</li>
                </ul>
              </li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="mt-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

     
      <main className="flex flex-col lg:flex-row justify-center items-center gap-0 lg:gap-10 lg:items-start p-4 flex-grow">
        <div className="grid gap-2 lg:ml-14 p-4 -ml-6 lg:mt-20" style={{ gridTemplateRows: `repeat(${difficulty.maxGuesses}, 1fr)` }}>
          {Array.from({ length: difficulty.maxGuesses }).map((_, rowIndex) => {
            const guessData = history[rowIndex];
            const isCurrentRow = rowIndex === history.length;
            return (
              <div key={rowIndex} className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${difficulty.length}, 1fr)` }}>
                {Array.from({ length: difficulty.length }).map((_, colIndex) => {
                  const digit = guessData ? guessData.guess[colIndex] : isCurrentRow ? currentGuess[colIndex] : '';
                  const status = guessData ? guessData.feedback[colIndex] : 'empty';
                  const boxStyles = {
                    correct: 'bg-green-600 border-green-600',
                    present: 'bg-yellow-500 border-yellow-500',
                    absent: 'bg-red-700 border-red-700',
                    empty: 'bg-transparent border-gray-600',
                  };
                  return (
                    <div
                      key={colIndex}
                      className={`w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center text-xl font-bold uppercase transition-all ${boxStyles[status]}`}
                    >
                      {digit}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 w-full max-w-xs p-10 -ml-2 lg:-mr-96 lg:m-20">
          <div className="grid grid-cols-5 gap-2">
            {'12345'.split('').map(d => (
              <Key key={d} value={d} status={keyStatus[d] || 'default'} onClick={handleKeyClick} />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {'67890'.split('').map(d => (
              <Key key={d} value={d} status={keyStatus[d] || 'default'} onClick={handleKeyClick} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Key value="Submit" onClick={handleKeyClick} />
            <Key value="Backspace" onClick={handleKeyClick} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CrackIt;
