import  { useState, useEffect, useMemo, useCallback, useRef } from 'react';


const PlayIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.322 3.681C5.442 3.185 4.358 3.79 4.358 4.819v14.362c0 1.029.984 1.634 1.964 1.138l12.723-7.181c.98-.554.98-2.022 0-2.576L6.322 3.681z" />
  </svg>
);
const PauseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.75 3.5a.75.75 0 00-.75.75v15.5a.75.75 0 001.5 0V4.25a.75.75 0 00-.75-.75zM17.25 3.5a.75.75 0 00-.75.75v15.5a.75.75 0 001.5 0V4.25a.75.75 0 00-.75-.75z" />
  </svg>
);


const GRID_SIZE = 6;
const SHIFT_INTERVAL_SECONDS = 3;
const TOTAL_GAME_SHIFTS = 3;
const START_POS = [0, 0];
const END_POS = [GRID_SIZE - 1, GRID_SIZE - 1];


const isSamePos = (pos1, pos2) => pos1 && pos2 && pos1[0] === pos2[0] && pos1[1] === pos2[1];
const isAdjacent = (pos1, pos2) => {
  if (!pos1 || !pos2) return false;
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) === 1;
};


const generateGrid = (currentSeed, nextSeed) => {
  const generateSingleSolvableGrid = (seed) => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ({ type: 'wall' })));
    let currentPos = [...START_POS];
    let path = [];
    while (!isSamePos(currentPos, END_POS)) {
      path.push([...currentPos]);
      const moveHorizontally = currentPos[1] < END_POS[1] && (Math.random() < 0.6 || currentPos[0] === END_POS[0]);
      if (moveHorizontally) {
        currentPos[1]++;
      } else if (currentPos[0] < END_POS[0]) {
        currentPos[0]++;
      }
    }
    path.push([...END_POS]);
    path.forEach(([r, c]) => { grid[r][c].type = 'path'; });
    for (let i = 0; i < GRID_SIZE * 5; i++) {
        const [startR, startC] = path[Math.floor(Math.random() * path.length)];
        let walkPos = [startR, startC];
        for(let j=0; j < 5; j++) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]].filter(
                ([dr, dc]) => {
                    const newR = walkPos[0] + dr;
                    const newC = walkPos[1] + dc;
                    return newR >= 0 && newR < GRID_SIZE && newC >= 0 && newC < GRID_SIZE;
                }
            );
            if(directions.length === 0) break;
            const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
            walkPos = [walkPos[0] + dr, walkPos[1] + dc];
            grid[walkPos[0]][walkPos[1]].type = 'path';
        }
    }
    grid[START_POS[0]][START_POS[1]].type = 'path';
    grid[END_POS[0]][END_POS[1]].type = 'goal';
    return grid;
  };

  const currentGrid = generateSingleSolvableGrid(currentSeed);
  const nextGrid = generateSingleSolvableGrid(nextSeed);

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (isSamePos([r,c], END_POS)) continue;
      if (currentGrid[r][c].type !== 'wall' && nextGrid[r][c].type === 'wall') {
        currentGrid[r][c].isFlickering = true;
      }
    }
  }
  return currentGrid;
};


const MindMaze = () => {
  const [gameState, setGameState] = useState('menu');
  const [mazeSeed, setMazeSeed] = useState(0);
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [shiftCountdown, setShiftCountdown] = useState(SHIFT_INTERVAL_SECONDS);
  const [shiftsLeft, setShiftsLeft] = useState(TOTAL_GAME_SHIFTS);
  const [feedback, setFeedback] = useState('');
  const [isShifting, setIsShifting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
 
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef(null);
  const grid = useMemo(() => generateGrid(mazeSeed, mazeSeed + 1), [mazeSeed]);
  
  const startGame = useCallback(() => {
    setGameState('playing');
    setMazeSeed(Date.now());
    setPlayerPos(START_POS);
    setShiftCountdown(SHIFT_INTERVAL_SECONDS);
    setShiftsLeft(TOTAL_GAME_SHIFTS);
    setIsShifting(false);
    setShowHelp(false);
    setIsPaused(false); 
    setFeedback('Let\'s go!');
  }, []);

  
  useEffect(() => {
    
    if (gameState !== 'playing' || isShifting || showHelp || isPaused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setShiftCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState, isShifting, showHelp, isPaused]);

  
  useEffect(() => {
    if (shiftCountdown <= 0) {
      setIsShifting(true);
    }
  }, [shiftCountdown]);

 
  useEffect(() => {
    if (!isShifting) {
      return;
    }
    const shiftActionTimeout = setTimeout(() => {
      setShiftsLeft(currentShifts => {
        const newShiftsLeft = currentShifts - 1;
        if (newShiftsLeft < 0) {
          setGameState('lost');
          setFeedback('Ran out of Shifts! Better luck next time.');
          return 0;
        }
        if (newShiftsLeft === 0) {
            setGameState('lost');
            setFeedback('Ran out of Shifts! Better luck next time.');
        } else {
            const [pr, pc] = playerPos;
            if (grid[pr][pc].isFlickering) {
                setFeedback('A sneaky save! You held your ground.');
            } else {
                setFeedback('Maze shifted!');
            }
            setMazeSeed(s => s + 1);
        }
        return newShiftsLeft;
      });
      setShiftCountdown(SHIFT_INTERVAL_SECONDS);
      setIsShifting(false);
    }, 200);
    return () => clearTimeout(shiftActionTimeout);
  }, [isShifting, playerPos, grid]);

  const handleTap = (row, col) => {
   
    if (gameState !== 'playing' || isShifting || isPaused) return;
    const tappedPos = [row, col];
    const { type } = grid[row][col];
    
    if (!isAdjacent(playerPos, tappedPos) || type === 'wall') return;
    setPlayerPos(tappedPos);

    if (type === 'goal') {
      setGameState('won');
      setFeedback('Congrats! You did it!');
    }
  };
  
  const timerBarWidth = (shiftCountdown / SHIFT_INTERVAL_SECONDS) * 100;

  const renderTile = (row, col) => {
    const { type, isFlickering } = grid[row][col];
    const isPlayerOnTile = isSamePos(playerPos, [row, col]);
    let baseClasses = 'w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg transition-all duration-200 text-2xl border-2';
    let content = '';
    switch(type) {
      case 'wall': baseClasses += ' bg-slate-700 border-slate-600'; break;
      case 'path': baseClasses += ' bg-slate-500 hover:bg-slate-400 cursor-pointer'; break;
      case 'goal': baseClasses += ' bg-amber-500 hover:bg-amber-400 cursor-pointer'; content = '🏁'; break;
      default: break;
    }
    if (isFlickering) {
        baseClasses += ' !bg-orange-500/80 !border-orange-400';
        if (!isPlayerOnTile) content = '!';
    }
    if (isPlayerOnTile) {
      baseClasses += ' !bg-emerald-500 scale-110 shadow-lg ring-4 ring-emerald-300 z-10';
      content = '🚶';
    }
    return <div key={`${row}-${col}`} className={baseClasses} onClick={() => handleTap(row, col)}>{content}</div>;
  };
  
  const renderHelpModal = () => (
    <div
  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6"
  onClick={() => setShowHelp(false)}
>
  <div
    className="bg-slate-800 text-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg border-t-4 border-sky-500 overflow-y-auto max-h-[90vh]"
    onClick={(e) => e.stopPropagation()}
  >
    <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-4 text-center sm:text-left">
      How to Play MindMaze
    </h2>
    <ul className="space-y-4 text-left text-base sm:text-lg">
      <li className="flex items-start gap-3">
        <span className="mt-1">🎯</span>
        <div><strong>The Goal:</strong> Guide your character (🚶) from the top-left to the goal (🏁) at the bottom-right.</div>
      </li>
      <li className="flex items-start gap-3">
        <span className="mt-1">⏳</span>
        <div><strong>The Shifting Maze:</strong> The maze layout changes! When the timer bar runs out, the maze will <strong>shift</strong>, and the 'Shifts Left' counter will decrease.</div>
      </li>
      <li className="flex items-start gap-3">
        <span className="mt-1">⚠️</span>
        <div><strong>The Warning:</strong> Tiles marked with an orange <strong>"!"</strong> are unstable. They will become walls in the next shift.</div>
      </li>
      <li className="flex items-start gap-3">
        <span className="mt-1">🛡️</span>
        <div><strong>Holding Your Ground:</strong> Don't worry! If you are standing on a flickering tile <strong>when the maze shifts</strong>, you are safe and will not be pushed back.</div>
      </li>
      <li className="flex items-start gap-3">
        <span className="mt-1">❌</span>
        <div><strong>Losing:</strong> The game is over if you run out of 'Shifts Left'. Plan your moves carefully!</div>
      </li>
    </ul>
    <button
      onClick={() => setShowHelp(false)}
      className="mt-6 sm:mt-8 w-full py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-colors"
    >
      Got It!
    </button>
  </div>
</div>

  );

  const renderPauseOverlay = () => (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 cursor-pointer" onClick={() => setIsPaused(false)}>
        <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">PAUSED</h2>
        <div className="bg-white/20 rounded-full p-4">
          <PlayIcon />
        </div>
    </div>
  );

  if (gameState === 'menu') {
    return (
      <div className="bg-slate-800 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400 mb-4">MindMaze</h1>
        <p className="text-xl text-slate-300 mb-8 italic">Let's solve the shifting maze!</p>
        <button onClick={startGame} className="px-12 py-4 bg-emerald-600 text-white font-bold rounded-lg shadow-lg text-2xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform">Start Playing</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 text-white min-h-screen flex flex-col items-center justify-center p-2 md:p-4 font-sans">
      {showHelp && renderHelpModal()}
      
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className={`bg-slate-700 rounded-2xl shadow-2xl p-8 text-center border-t-8 ${gameState === 'won' ? 'border-emerald-500' : 'border-rose-500'}`}>
            <h2 className={`text-5xl font-bold mb-4 ${gameState === 'won' ? 'text-emerald-400' : 'text-rose-400'}`}>{gameState === 'won' ? 'You Won!' : 'Game Over'}</h2>
            <p className="text-lg mb-6 text-slate-300">{feedback}</p>
            <button onClick={startGame} className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">Play Again</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg md:max-w-xl mx-auto space-y-4">
        <header className="text-center">
          <div className="flex justify-center items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">MindMaze</h1>
            <button onClick={() => setShowHelp(true)} className="bg-sky-500/20 text-sky-300 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-sky-500/40" aria-label="How to play">?</button>
          </div>
        </header>

        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center text-lg shadow-lg">
          <div className="font-semibold">Shifts Left: <span className="text-2xl text-amber-400 font-bold">{shiftsLeft}</span></div>
         
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPaused(prev => !prev)} className="bg-slate-600/50 rounded-md p-1 hover:bg-slate-600" aria-label={isPaused ? "Play" : "Pause"}>
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button onClick={startGame} className="px-4 py-1 bg-slate-600 rounded-md hover:bg-slate-500 text-sm">Reset</button>
          </div>
        </div>

        <div className="w-full bg-slate-600 rounded-full h-4 overflow-hidden border-2 border-slate-500">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" style={{ width: `${timerBarWidth}%`, transition: 'width 0.2s linear' }}/>
        </div>
        
        <p className="text-center h-6 text-amber-300 italic transition-opacity duration-300">{feedback}</p>
        
        <main className="relative bg-black/30 p-2 md:p-4 rounded-xl shadow-2xl">
        
          {isPaused && renderPauseOverlay()}
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
            {grid.map((row, r) => row.map((_, c) => renderTile(r, c)))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MindMaze;