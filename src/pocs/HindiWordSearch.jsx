import React, { useState, useEffect, useCallback, useRef } from 'react';
// Make sure the path is correct relative to this file's location.
import puzzlesData from '../assets/HindiWordSearch.json';

// --- Child Component 1: Scoreboard (No changes needed) ---
const Scoreboard = ({
  score,
  onHint,
  onNextPuzzle,
  onReset,
  isWordListVisible,
  onToggleWordList
}) => {
  return (
    <div className="w-full max-w-xl my-4 p-2 sm:p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      <div className="text-center sm:text-left">
        <span className="text-base sm:text-lg font-semibold">स्कोर: </span>
        <span className="text-lg sm:text-xl font-bold text-blue-500">{score}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={onToggleWordList}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-teal-500 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-600 transition-colors"
        >
          {isWordListVisible ? 'शब्द छिपाएँ' : 'शब्द दिखाएँ'}
        </button>
        <button
          onClick={onHint}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-amber-500 text-white font-semibold rounded-lg shadow-sm transition-colors ${score <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-600'}`}
          disabled={score <= 0}
        >
          संकेत (-5)
        </button>
        <button
          onClick={onReset}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition-colors"
        >
          रीसेट
        </button>
        <button
          onClick={onNextPuzzle}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
        >
          अगला
        </button>
      </div>
    </div>
  );
};


// --- Child Component 2: Grid (With Mobile Drag Fixes) ---
const Grid = ({
  grid,
  onCellDragStart, // Renamed for clarity
  onCellDragOver,  // Renamed for clarity
  onCellDragEnd,   // Renamed for clarity
  selection,
  foundWordsCoords,
  hintedCell
}) => {
  const isSelected = (r, c) => selection.some(cell => cell.r === r && cell.c === c);
  const isFound = (r, c) => foundWordsCoords.some(cell => cell.r === r && cell.c === c);
  const isHinted = (r, c) => hintedCell && hintedCell.r === r && hintedCell.c === c;

  // This is the core logic for touch move events
  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset.r && element.dataset.c) {
      const r = parseInt(element.dataset.r, 10);
      const c = parseInt(element.dataset.c, 10);
      onCellDragOver(r, c); // Call the parent's drag handler
    }
  };

  return (
    <div
      className="grid grid-cols-12 gap-1 bg-slate-300 p-1 sm:p-2 rounded-lg shadow-lg"
      // --- MOBILE FIX 1: Prevent page scrolling during drag ---
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      onMouseUp={onCellDragEnd}
      onMouseLeave={onCellDragEnd} // End selection if mouse leaves grid
      onTouchEnd={onCellDragEnd}
      onTouchCancel={onCellDragEnd} // End selection if touch is interrupted
      onTouchMove={handleTouchMove}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`flex items-center justify-center 
              w-7 h-7 text-sm 
              sm:w-9 sm:h-9 sm:text-lg 
              md:w-11 md:h-11 md:text-xl
              font-bold cursor-pointer rounded-md transition-colors duration-150 
              ${isFound(r, c) ? 'bg-emerald-500 text-white' : isSelected(r, c) ? 'bg-blue-500 text-white' : isHinted(r, c) ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-50 text-slate-800'}`}
            // Unified events for mouse and touch
            onMouseDown={() => onCellDragStart(r, c)}
            onMouseEnter={() => onCellDragOver(r, c)}
            onTouchStart={() => onCellDragStart(r, c)}
            data-r={r}
            data-c={c}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
};

// --- Child Component 3: WordList (No changes needed) ---
const WordList = ({ words, foundWords }) => {
  return (
    <div className="w-full max-w-xl mt-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-center text-slate-800 mb-3">शब्द सूची</h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-center">
        {words.map((word, index) => (
          <li
            key={index}
            className={`text-base sm:text-lg transition-all duration-300 ${foundWords.includes(word) ? 'line-through text-slate-400' : 'text-slate-800'}`}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main Game Component (With Improved Event Handlers) ---
const HindiWordSearch = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzle, setPuzzle] = useState(puzzlesData[0]);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selection, setSelection] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // --- MOBILE FIX 2: Store the starting cell of the drag ---
  const startCellRef = useRef(null);
  
  const [hintedCell, setHintedCell] = useState(null);
  const hintTimeoutRef = useRef(null);
  const [isWordListVisible, setIsWordListVisible] = useState(true);

  // Unchanged functions
  const toggleWordList = () => setIsWordListVisible(prev => !prev);
  const loadPuzzle = useCallback((index) => {
    const validIndex = index % puzzlesData.length;
    setPuzzle(puzzlesData[validIndex]);
    setFoundWords([]);
    setSelection([]);
    setIsSelecting(false);
    startCellRef.current = null;
    setHintedCell(null);
    setIsWordListVisible(true);
  }, []);
  useEffect(() => { loadPuzzle(currentPuzzleIndex); }, [currentPuzzleIndex, loadPuzzle]);
  useEffect(() => { return () => { if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current); }; }, []);
  const handleNextPuzzle = () => setCurrentPuzzleIndex((prevIndex) => (prevIndex + 1) % puzzlesData.length);
  const handleReset = () => loadPuzzle(currentPuzzleIndex);

  // --- UNIFIED DRAG LOGIC START ---
  const handleDragStart = (r, c) => {
    setIsSelecting(true);
    startCellRef.current = { r, c };
    setSelection([{ r, c }]);
  };

  // --- MOBILE FIX 3: Robust line calculation logic ---
  const handleDragOver = (r, c) => {
    if (!isSelecting || !startCellRef.current) return;
    
    const start = startCellRef.current;
    const end = { r, c };

    const newSelection = [];
    const dr = end.r - start.r;
    const dc = end.c - start.c;

    let dirR = 0;
    let dirC = 0;

    // Determine direction: horizontal, vertical, or diagonal
    if (dr === 0 && dc !== 0) dirC = Math.sign(dc); // Horizontal
    else if (dc === 0 && dr !== 0) dirR = Math.sign(dr); // Vertical
    else if (Math.abs(dr) === Math.abs(dc)) { // Diagonal
      dirR = Math.sign(dr);
      dirC = Math.sign(dc);
    } else {
      return; // Not a straight line, do nothing
    }

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    for (let i = 0; i <= steps; i++) {
      newSelection.push({
        r: start.r + i * dirR,
        c: start.c + i * dirC,
      });
    }
    setSelection(newSelection);
  };
  
  const handleDragEnd = () => {
    if (isSelecting) {
      checkSelection();
      setIsSelecting(false);
      startCellRef.current = null;
      // Keep selection highlighted for a moment before clearing, feels better
      setTimeout(() => setSelection([]), 200);
    }
  };

  const checkSelection = () => {
    if (selection.length < 2) return;
    const selectedLetters = selection.map(({ r, c }) => puzzle.grid[r][c]);
    const selectedWord = selectedLetters.join('');
    const reversedSelectedWord = [...selectedLetters].reverse().join('');
    const wordToFind = puzzle.words.find(w => w === selectedWord || w === reversedSelectedWord);
    if (wordToFind && !foundWords.includes(wordToFind)) {
      setFoundWords(prev => [...prev, wordToFind]);
      setScore(prev => prev + 10);
      setHintedCell(null);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    }
  };
  // --- UNIFIED DRAG LOGIC END ---

  const handleHint = () => {
    if (score <= 0) return;
    const unfoundWords = puzzle.words.filter(word => !foundWords.includes(word));
    if (unfoundWords.length === 0) return;

    if (isWordListVisible) {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      setHintedCell(null);
      const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
      const wordCoords = puzzle.wordLocations[randomWord];
      if (!wordCoords || wordCoords.length === 0) return;
      const hintCoord = wordCoords[0];
      setHintedCell(hintCoord);
      hintTimeoutRef.current = setTimeout(() => { setHintedCell(null); }, 2000);
    } else {
      const randomWordToUnlock = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
      setFoundWords(prev => [...prev, randomWordToUnlock]);
      alert(`शब्द "${randomWordToUnlock}" अनलॉक हो गया है!`);
    }
    setScore(prev => prev - 5);
  };
  
  // Remaining JSX is unchanged but now uses the new handlers
  const foundWordsCoords = foundWords.flatMap(word => puzzle.wordLocations[word] || []);
  const allWordsFound = puzzle.words.length > 0 && foundWords.length === puzzle.words.length;

  if (!puzzlesData || puzzlesData.length === 0) {
    return <div className="text-red-500 font-bold text-center p-8">Error: Puzzle data not found or is empty.</div>;
  }

  return (
    <div className="bg-slate-50 text-slate-800 flex flex-col items-center w-full min-h-screen p-2 sm:p-4">
      <header className="text-center my-4 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-500">हिन्दी शब्द खोज</h1>
        <h2 className="text-lg sm:text-2xl mt-1 text-slate-600">{puzzle.theme}</h2>
      </header>
      <main className="flex flex-col items-center w-full">
        <Scoreboard score={score} onHint={handleHint} onNextPuzzle={handleNextPuzzle} onReset={handleReset} isWordListVisible={isWordListVisible} onToggleWordList={toggleWordList} />
        {allWordsFound && (
          <div className="my-4 p-4 w-full max-w-xl bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            <h3 className="font-bold text-lg sm:text-xl">बधाई हो! आपने सभी शब्द ढूंढ लिए!</h3>
            <button onClick={handleNextPuzzle} className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg">अगली पहेली खेलें</button>
          </div>
        )}
        <Grid 
          grid={puzzle.grid} 
          selection={selection} 
          foundWordsCoords={foundWordsCoords} 
          hintedCell={hintedCell} 
          onCellDragStart={handleDragStart}
          onCellDragOver={handleDragOver}
          onCellDragEnd={handleDragEnd}
        />
        {isWordListVisible && <WordList words={puzzle.words} foundWords={foundWords} />}
      </main>
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>A Hindi Word Search Game</p>
      </footer>
    </div>
  );
};

export default HindiWordSearch;