import React, { useState, useEffect, useCallback, useRef } from 'react';
// --- AUTOMATED DATA LOADING ---
// Make sure the path is correct relative to this file's location.
// If this file is in 'src/components/', and the JSON is in 'src/data/', this path is correct.
import puzzlesData from '../assets/HindiWordSearch.json';

// --- Child Component 1: Scoreboard ---
const Scoreboard = ({
  score,
  onHint,
  onNextPuzzle,
  onReset,
  isWordListVisible,
  onToggleWordList
}) => {
  return (
    <div className="w-full max-w-md my-4 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <span className="text-lg font-semibold">स्कोर: </span>
        <span className="text-xl font-bold text-blue-500">{score}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={onToggleWordList}
          className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-600 transition-colors"
        >
          {isWordListVisible ? 'शब्द छिपाएँ' : 'शब्द दिखाएँ'}
        </button>
        <button
          onClick={onHint}
          className={`px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-sm transition-colors ${score <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-600'}`}
          disabled={score <= 0}
        >
          संकेत (-5)
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition-colors"
        >
          रीसेट
        </button>
        <button
          onClick={onNextPuzzle}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
        >
          अगला
        </button>
      </div>
    </div>
  );
};

// --- Child Component 2: Grid ---
const Grid = ({
  grid,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  selection,
  foundWordsCoords,
  hintedCell
}) => {
  const isSelected = (r, c) => selection.some(cell => cell.r === r && cell.c === c);
  const isFound = (r, c) => foundWordsCoords.some(cell => cell.r === r && cell.c === c);
  const isHinted = (r, c) => hintedCell && hintedCell.r === r && hintedCell.c === c;

  return (
    <div
      className="grid grid-cols-12 gap-1 bg-slate-300 p-2 rounded-lg shadow-lg"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      onMouseUp={onCellMouseUp}
      onTouchEnd={onCellMouseUp}
      onMouseLeave={onCellMouseUp}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-lg sm:text-xl md:text-2xl font-bold cursor-pointer rounded-md transition-colors duration-150 ${isFound(r, c) ? 'bg-emerald-500 text-white' : isSelected(r, c) ? 'bg-blue-500 text-white' : isHinted(r, c) ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-50 text-slate-800'}`}
            onMouseDown={() => onCellMouseDown(r, c)}
            onMouseEnter={() => onCellMouseEnter(r, c)}
            onTouchStart={(e) => { e.preventDefault(); onCellMouseDown(r, c); }}
            onTouchMove={(e) => { e.preventDefault(); const touch = e.touches[0]; const element = document.elementFromPoint(touch.clientX, touch.clientY); if (element && element.dataset.r && element.dataset.c) { const newR = parseInt(element.dataset.r); const newC = parseInt(element.dataset.c); onCellMouseEnter(newR, newC); } }}
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

// --- Child Component 3: WordList ---
const WordList = ({ words, foundWords }) => {
  return (
    <div className="w-full max-w-md mt-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-center text-slate-800 mb-3">शब्द सूची</h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-center">
        {words.map((word, index) => (
          <li
            key={index}
            className={`text-lg transition-all duration-300 ${foundWords.includes(word) ? 'line-through text-slate-400' : 'text-slate-800'}`}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main Game Component ---
const HindiWordSearch = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzle, setPuzzle] = useState(puzzlesData[0]);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [selection, setSelection] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [hintedCell, setHintedCell] = useState(null);
  const hintTimeoutRef = useRef(null);
  const [isWordListVisible, setIsWordListVisible] = useState(true);

  const toggleWordList = () => setIsWordListVisible(prev => !prev);

  const loadPuzzle = useCallback((index) => {
    const validIndex = index % puzzlesData.length;
    setPuzzle(puzzlesData[validIndex]);
    setFoundWords([]);
    setSelection([]);
    setIsSelecting(false);
    setHintedCell(null);
    setIsWordListVisible(true);
  }, []);

  useEffect(() => { loadPuzzle(currentPuzzleIndex); }, [currentPuzzleIndex, loadPuzzle]);
  useEffect(() => { return () => { if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current); }; }, []);

  const handleNextPuzzle = () => setCurrentPuzzleIndex((prevIndex) => (prevIndex + 1) % puzzlesData.length);
  const handleReset = () => loadPuzzle(currentPuzzleIndex);

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

  const handleMouseDown = (r, c) => { setIsSelecting(true); setSelection([{ r, c }]); };
  const handleMouseUp = () => { if (isSelecting) { checkSelection(); setIsSelecting(false); setSelection([]); } };
  const handleMouseEnter = (r, c) => { if (!isSelecting || selection.some(cell => cell.r === r && cell.c === c)) return; const lastCell = selection[selection.length - 1]; const dr = r - lastCell.r; const dc = c - lastCell.c; if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return; if (selection.length === 1) { setSelection(prev => [...prev, { r, c }]); } else { const firstCell = selection[0]; const secondCell = selection[1]; const dirR = secondCell.r - firstCell.r; const dirC = secondCell.c - firstCell.c; if (dr === dirR && dc === dirC) { setSelection(prev => [...prev, { r, c }]); } } };

  const foundWordsCoords = foundWords.flatMap(word => puzzle.wordLocations[word] || []);
  const allWordsFound = puzzle.words.length > 0 && foundWords.length === puzzle.words.length;

  if (!puzzlesData || puzzlesData.length === 0) {
    return <div className="text-red-500 font-bold text-center p-8">Error: Puzzle data not found or is empty.</div>;
  }

  return (
    <div className="bg-slate-50 text-slate-800 flex flex-col items-center p-4">
      <header className="text-center my-4">
        <h1 className="text-4xl font-bold text-blue-500">हिन्दी शब्द खोज</h1>
        <h2 className="text-2xl mt-1 text-slate-600">{puzzle.theme}</h2>
      </header>
      <main className="flex flex-col items-center">
        <Scoreboard score={score} onHint={handleHint} onNextPuzzle={handleNextPuzzle} onReset={handleReset} isWordListVisible={isWordListVisible} onToggleWordList={toggleWordList} />
        {allWordsFound && (
          <div className="my-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            <h3 className="font-bold text-xl">बधाई हो! आपने सभी शब्द ढूंढ लिए!</h3>
            <button onClick={handleNextPuzzle} className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg">अगली पहेली खेलें</button>
          </div>
        )}
        <Grid grid={puzzle.grid} selection={selection} foundWordsCoords={foundWordsCoords} hintedCell={hintedCell} onCellMouseDown={handleMouseDown} onCellMouseEnter={handleMouseEnter} onCellMouseUp={handleMouseUp} />
        {isWordListVisible && <WordList words={puzzle.words} foundWords={foundWords} />}
      </main>
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>A Hindi Word Search Game</p>
      </footer>
    </div>
  );
};

export default HindiWordSearch;