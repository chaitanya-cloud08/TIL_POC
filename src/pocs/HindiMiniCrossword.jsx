import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Hindi Character Composition Logic ---
const HINDI_VOWELS = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'];
const HINDI_CONSONANTS = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'];
const HINDI_MATRAS = ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', '्'];

const compositionMap = {'क':{'ा':'का','ि':'कि','ी':'की','ु':'कु','ू':'कू','ृ':'कृ','े':'के','ै':'कै','ो':'को','ौ':'कौ','ं':'कं','ः':'कः','्':'क्'},'ख':{'ा':'खा','ि':'खि','ी':'खी','ु':'खु','ू':'खू','ृ':'खृ','े':'खे','ै':'खै','ो':'खो','ौ':'खौ','ं':'खं','ः':'खः','्':'ख्'},'ग':{'ा':'गा','ि':'गि','ी':'गी','ु':'गु','ू':'गू','ृ':'गृ','े':'गे','ै':'गै','ो':'गो','ौ':'गौ','ं':'गं','ः':'गः','्':'ग्'},'घ':{'ा':'घा','ि':'घि','ी':'घी','ु':'घु','ू':'घू','ृ':'घृ','े':'घे','ै':'घै','ो':'घो','ौ':'घौ','ं':'घं','ः':'घः','्':'घ्'},'च':{'ा':'चा','ि':'चि','ी':'ची','ु':'चु','ू':'चू','ृ':'चृ','े':'चे','ै':'चै','ो':'चो','ौ':'चौ','ं':'चं','ः':'चः','्':'च्'},'छ':{'ा':'छा','ि':'छि','ी':'छी','ु':'छु','ू':'छू','ृ':'छृ','े':'छे','ै':'छै','ो':'छो','ौ':'छौ','ं':'छं','ः':'छः','्':'छ्'},'ज':{'ा':'जा','ि':'जि','ी':'जी','ु':'जु','ू':'जू','ृ':'जृ','े':'जे','ै':'जै','ो':'जो','ौ':'जौ','ं':'जं','ः':'जः','्':'ज्'},'झ':{'ा':'झा','ि':'झि','ी':'झी','ु':'झु','ू':'झू','ृ':'झृ','े':'झे','ै':'झै','ो':'झो','ौ':'झौ','ं':'झं','ः':'झः','्':'झ्'},'ट':{'ा':'टा','ि':'टि','ी':'टी','ु':'टु','ू':'टू','ृ':'टृ','े':'टे','ै':'टै','ो':'टो','ौ':'टौ','ं':'टं','ः':'टः','्':'ट्'},'ठ':{'ा':'ठा','ि':'ठि','ी':'ठी','ु':'ठु','ू':'ठू','ृ':'ठृ','े':'ठे','ै':'ठै','ो':'ठो','ौ':'ठौ','ं':'ठं','ः':'ठः','्':'ठ्'},'ड':{'ा':'डा','ि':'डि','ी':'डी','ु':'डु','ू':'डू','ृ':'डृ','े':'डे','ै':'डै','ो':'डो','ौ':'डौ','ं':'डं','ः':'डः','्':'ड्'},'ढ':{'ा':'ढा','ि':'ढि','ी':'ढी','ु':'ढु','ू':'ढू','ृ':'ढृ','े':'ढे','ै':'ढै','ो':'ढो','ौ':'ढौ','ं':'ढं','ः':'ढः','्':'ढ्'},'ण':{'ा':'णा','ि':'णि','ी':'णी','ु':'णु','ू':'णू','ृ':'णृ','े':'णे','ै':'णै','ो':'णो','ौ':'णौ','ं':'णं','ः':'णः','्':'ण्'},'त':{'ा':'ता','ि':'ति','ी':'ती','ु':'तु','ू':'तू','ृ':'तृ','े':'ते','ै':'तै','ो':'तो','ौ':'तौ','ं':'तं','ः':'तः','्':'त्'},'थ':{'ा':'था','ि':'थि','ी':'थी','ु':'थु','ू':'थू','ृ':'थृ','े':'थे','ै':'थै','ो':'थो','ौ':'थौ','ं':'थं','ः':'थः','्':'थ्'},'द':{'ा':'दा','ि':'दि','ी':'दी','ु':'दु','ू':'दू','ृ':'दृ','े':'दे','ै':'दै','ो':'दो','ौ':'दौ','ं':'दं','ः':'दः','्':'द्'},'ध':{'ा':'धा','ि':'धि','ी':'धी','ु':'धु','ू':'धू','ृ':'धृ','े':'धे','ै':'धै','ो':'धो','ौ':'धौ','ं':'धं','ः':'धः','्':'ध्'},'न':{'ा':'ना','ि':'नि','ी':'नी','ु':'नु','ू':'नू','ृ':'नृ','े':'ने','ै':'नै','ो':'नो','ौ':'नौ','ं':'नं','ः':'नः','्':'न्'},'प':{'ा':'पा','ि':'पि','ी':'पी','ु':'पु','ू':'पू','ृ':'पृ','े':'पे','ै':'पै','ो':'पो','ौ':'पौ','ं':'पं','ः':'पः','्':'प्'},'फ':{'ा':'फा','ि':'फि','ी':'फी','ु':'फु','ू':'फू','ृ':'फृ','े':'फे','ै':'फै','ो':'फो','ौ':'फौ','ं':'फं','ः':'फः','्':'फ्'},'ब':{'ा':'बा','ि':'बि','ी':'बी','ु':'बु','ू':'बू','ृ':'बृ','े':'बे','ै':'बै','ो':'बो','ौ':'बौ','ं':'बं','ः':'बः','्':'ब्'},'भ':{'ा':'भा','ि':'भि','ी':'भी','ु':'भु','ू':'भू','ृ':'भृ','े':'भे','ै':'भै','ो':'भो','ौ':'भौ','ं':'भं','ः':'भः','्':'भ्'},'म':{'ा':'मा','ि':'मि','ी':'मी','ु':'मु','ू':'मू','ृ':'मृ','े':'मे','ै':'मै','ो':'मो','ौ':'मौ','ं':'मं','ः':'मः','्':'म्'},'य':{'ा':'या','ि':'यि','ी':'यी','ु':'यु','ू':'यू','ृ':'यृ','े':'ये','ै':'यै','ो':'यो','ौ':'यौ','ं':'यं','ः':'यः','्':'य्'},'र':{'ा':'रा','ि':'रि','ी':'री','ु':'रु','ू':'रू','ृ':'रृ','े':'रे','ै':'रै','ो':'रो','ौ':'रौ','ं':'रं','ः':'रः','्':'र्'},'ल':{'ा':'ला','ि':'लि','ी':'ली','ु':'लु','ू':'लू','ृ':'लृ','े':'ले','ै':'लै','ो':'लो','ौ':'लौ','ं':'लं','ः':'लः','्':'ल्'},'व':{'ा':'वा','ि':'वि','ी':'वी','ु':'वु','ू':'वू','ृ':'वृ','े':'वे','ै':'वै','ो':'वो','ौ':'वौ','ं':'वं','ः':'वः','्':'व्'},'श':{'ा':'शा','ि':'शि','ी':'शी','ु':'शु','ू':'शू','ृ':'शृ','े':'शे','ै':'शै','ो':'शो','ौ':'शौ','ं':'शं','ः':'शः','्':'श्'},'ष':{'ा':'षा','ि':'षि','ी':'षी','ु':'षु','ू':'षू','ृ':'षृ','े':'षे','ै':'षै','ो':'षो','ौ':'षौ','ं':'षं','ः':'षः','्':'ष्'},'स':{'ा':'सा','ि':'सि','ी':'सी','ु':'सु','ू':'सू','ृ':'सृ','े':'से','ै':'सै','ो':'सो','ौ':'सौ','ं':'सं','ः':'सः','्':'स्'},'ह':{'ा':'हा','ि':'हि','ी':'ही','ु':'हु','ू':'हू','ृ':'हृ','े':'हे','ै':'है','ो':'हो','ौ':'हौ','ं':'हं','ः':'हः','्':'ह्'}};
const decompositionMap = Object.entries(compositionMap).reduce((acc, [base, matraMap]) => { Object.entries(matraMap).forEach(([matra, composed]) => { acc[composed] = base; }); return acc; }, {});

const GRID_SIZE = 5;

// --- Child Components ---
const CompletionModal = ({ onNext, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center shadow-2xl transform transition-all scale-95 hover:scale-100">
            <h2 className="text-3xl font-bold mb-4 text-green-600">बहुत बढ़िया!</h2>
            <p className="mb-6 text-lg text-gray-700">आपने पहेली पूरी कर ली।</p>
            <div className="flex gap-4">
                <button onClick={onNext} className="w-full py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 shadow-lg">अगली पहेली</button>
                <button onClick={onClose} className="w-full py-2 bg-gray-300 rounded-md hover:bg-gray-400">बंद करें</button>
            </div>
        </div>
    </div>
);

// --- Main Crossword Component ---
export default function HindiMiniCrossword() {
    const [puzzles, setPuzzles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [gridState, setGridState] = useState(Array(GRID_SIZE * GRID_SIZE).fill(''));
    const [activeCell, setActiveCell] = useState(null);
    const [direction, setDirection] = useState('across');
    const [isCompleted, setIsCompleted] = useState(false);
    const [hintedCells, setHintedCells] = useState(new Set());
    const inputRefs = useRef([]);
    const currentPuzzle = puzzles[currentPuzzleIndex];

    const initializePuzzle = useCallback((puzzle) => {
        if (!puzzle) return;
        setGridState(Array(GRID_SIZE * GRID_SIZE).fill(''));
        setIsCompleted(false);
        setHintedCells(new Set());
        const firstPlayableIndex = puzzle.grid.findIndex(cell => cell !== '') || 0;
        setActiveCell({ row: Math.floor(firstPlayableIndex / GRID_SIZE), col: firstPlayableIndex % GRID_SIZE });
        setDirection('across');
    }, []);

    useEffect(() => {
        fetch('/hindi_crosswords.json').then(res => res.json()).then(data => {
            if (data && data.length > 0) {
                setPuzzles(data);
                initializePuzzle(data[0]);
            }
            setIsLoading(false);
        }).catch(err => { console.error("Error loading puzzles:", err); setIsLoading(false); });
    }, [initializePuzzle]);

    useEffect(() => { initializePuzzle(puzzles[currentPuzzleIndex]); }, [currentPuzzleIndex, puzzles, initializePuzzle]);
    
    useEffect(() => {
        if (activeCell) {
            const index = activeCell.row * GRID_SIZE + activeCell.col;
            if (inputRefs.current[index]) inputRefs.current[index].focus();
        }
    }, [activeCell, direction]);

    const getNumberDataForCell = useCallback((row, col) => {
        if (!currentPuzzle) return null;
        let acrossNum, downNum;
        for (let c = col; c >= 0; c--) {
            const num = currentPuzzle.gridnums[row * GRID_SIZE + c];
            if (num > 0 && currentPuzzle.answers.across[String(num)]) {
                const word = currentPuzzle.answers.across[String(num)];
                if (col < c + word.length) { acrossNum = num; break; }
            }
        }
        for (let r = row; r >= 0; r--) {
            const num = currentPuzzle.gridnums[r * GRID_SIZE + col];
            if (num > 0 && currentPuzzle.answers.down[String(num)]) {
                const word = currentPuzzle.answers.down[String(num)];
                if (row < r + word.length) { downNum = num; break; }
            }
        }
        if (direction === 'across' && acrossNum) return { number: acrossNum, direction: 'across' };
        if (direction === 'down' && downNum) return { number: downNum, direction: 'down' };
        if (acrossNum) return { number: acrossNum, direction: 'across' };
        if (downNum) return { number: downNum, direction: 'down' };
        return null;
    }, [currentPuzzle, direction]);
    
    const getActiveWordIndices = useCallback(() => {
        if (!currentPuzzle || !activeCell) return [];
        const numData = getNumberDataForCell(activeCell.row, activeCell.col);
        if (!numData) return [];
        const { number, direction: wordDirection } = numData;
        const word = currentPuzzle.answers[wordDirection][String(number)];
        if (!word) return [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentPuzzle.gridnums[r * GRID_SIZE + c] === number) {
                    if ((wordDirection === 'across' && currentPuzzle.answers.across[String(number)] === word) ||
                        (wordDirection === 'down' && currentPuzzle.answers.down[String(number)] === word)) {
                        const indices = [];
                        for (let i = 0; i < word.length; i++) {
                            indices.push(wordDirection === 'across' ? r * GRID_SIZE + (c + i) : (r + i) * GRID_SIZE + c);
                        }
                        return indices;
                    }
                }
            }
        }
        return [];
    }, [activeCell, currentPuzzle, getNumberDataForCell]);

    const moveActiveCell = useCallback((backwards = false) => {
        const activeWordIndices = getActiveWordIndices();
        if (activeWordIndices.length === 0 || !activeCell) return;
        const currentIndexInGrid = activeCell.row * GRID_SIZE + activeCell.col;
        const currentIndexInWord = activeWordIndices.indexOf(currentIndexInGrid);
        const nextIndexInWord = backwards ? currentIndexInWord - 1 : currentIndexInWord + 1;
        if (nextIndexInWord >= 0 && nextIndexInWord < activeWordIndices.length) {
            const gridIndex = activeWordIndices[nextIndexInWord];
            setActiveCell({ row: Math.floor(gridIndex / GRID_SIZE), col: gridIndex % GRID_SIZE });
        }
    }, [activeCell, getActiveWordIndices]);

    const handleKeyboardInput = useCallback((key, type) => {
        if (isCompleted || !activeCell) return;
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        if (hintedCells.has(index)) return;
        const newGridState = [...gridState];
        const currentCellChar = newGridState[index];
        if (type === 'consonant' || type === 'vowel') {
            newGridState[index] = key;
            setGridState(newGridState);
            moveActiveCell();
        } else if (type === 'matra' && HINDI_CONSONANTS.includes(currentCellChar)) {
            newGridState[index] = compositionMap[currentCellChar]?.[key] || currentCellChar;
            setGridState(newGridState);
        } else if (type === 'backspace') {
            const decomposedChar = decompositionMap[currentCellChar];
            if (decomposedChar) {
                newGridState[index] = decomposedChar;
            } else {
                newGridState[index] = '';
                moveActiveCell(true);
            }
            setGridState(newGridState);
        }
    }, [activeCell, gridState, isCompleted, hintedCells, moveActiveCell]);
    
    const handleCellClick = (row, col) => {
        if (currentPuzzle.grid[row * GRID_SIZE + col] === '') return;
        if (activeCell && activeCell.row === row && activeCell.col === col) {
            setDirection(prev => prev === 'across' ? 'down' : 'across');
        } else {
            setActiveCell({ row, col });
            const numData = getNumberDataForCell(row, col);
            setDirection(numData?.direction || 'across');
        }
    };
    
    const handleKeyDown = (e) => { e.preventDefault(); if (e.key === 'Backspace') handleKeyboardInput(null, 'backspace'); };

    const handleHint = () => {
        if (!activeCell || isCompleted) return;
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        if (hintedCells.has(index)) return;
        const newGridState = [...gridState];
        newGridState[index] = currentPuzzle.grid[index];
        setGridState(newGridState);
        setHintedCells(new Set(hintedCells).add(index));
    };

    const checkCompletion = () => {
        if (!currentPuzzle) return;
        for (let i = 0; i < gridState.length; i++) {
            if (currentPuzzle.grid[i] !== '' && gridState[i] !== currentPuzzle.grid[i]) {
                alert('कुछ अक्षर गलत हैं, फिर से प्रयास करें!');
                return;
            }
        }
        setIsCompleted(true);
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-100 text-2xl">पहेलियाँ लोड हो रही हैं...</div>;
    if (!currentPuzzle) return <div className="flex items-center justify-center h-screen bg-gray-100 text-2xl text-red-500">पहेलियाँ लोड करने में विफल!</div>;

    const activeWordIndices = getActiveWordIndices();
    const activeWordData = activeCell ? getNumberDataForCell(activeCell.row, activeCell.col) : null;
    const activeClue = activeWordData ? (currentPuzzle[activeWordData.direction === 'across' ? 'across_clues' : 'down_clues']).find(c => c.number === activeWordData.number) : null;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-2 sm:p-4 font-sans">
            {isCompleted && <CompletionModal onNext={() => setCurrentPuzzleIndex(p => Math.min(puzzles.length - 1, p + 1))} onClose={() => setIsCompleted(false)} />}
            <header className="w-full max-w-lg mb-4 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">हिंदी मिनी क्रॉसवर्ड</h1>
            </header>
            <main className="w-full flex flex-col lg:flex-row justify-center items-start gap-6 lg:gap-10">
                <div className="w-full max-w-[350px] sm:max-w-sm mx-auto flex flex-col items-center">
                    <div className="grid grid-cols-5 gap-px p-1 bg-gray-800 border-4 border-gray-800 shadow-xl rounded-lg overflow-hidden">
                        {currentPuzzle.grid.map((cell, index) => {
                            const row = Math.floor(index / GRID_SIZE);
                            const col = index % GRID_SIZE;
                            const isBlackCell = cell === '';
                            const isActive = activeCell && activeCell.row === row && activeCell.col === col;
                            const isInActiveWord = activeWordIndices.includes(index);
                            const isHinted = hintedCells.has(index);

                            return (
                                <div key={index} onClick={() => handleCellClick(row, col)}
                                    className={`relative flex items-center justify-center w-full aspect-square transition-all duration-150 ease-in-out
                                        ${isBlackCell ? 'bg-gray-800' : 'bg-white cursor-pointer'}
                                        ${!isActive && isInActiveWord ? 'bg-blue-200' : ''}
                                        ${isActive ? 'bg-yellow-300 transform scale-105 z-10' : ''}`}>
                                    
                                    {currentPuzzle.gridnums[index] > 0 && 
                                        <span className="absolute top-0.5 left-1 text-[10px] font-light text-gray-500">{currentPuzzle.gridnums[index]}</span>}
                                    
                                    <span className={`text-2xl sm:text-3xl font-bold ${isHinted ? 'text-blue-600' : ''}`}>{gridState[index]}</span>
                                    
                                    <input ref={el => inputRefs.current[index] = el} onKeyDown={handleKeyDown} className="absolute opacity-0 w-0 h-0" tabIndex="-1" />
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full mt-3 p-2 bg-blue-100 rounded-md text-center h-12 flex items-center justify-center text-blue-900 shadow-inner">
                        <p className="font-bold">{activeClue ? `${activeClue.number}. ${activeClue.clue}` : 'एक सेल चुनें'}</p>
                    </div>
                    <div className="w-full mt-3 grid grid-cols-3 gap-2">
                        <button onClick={handleHint} className="py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 shadow">संकेत</button>
                        <button onClick={checkCompletion} className="py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 shadow">जाँचें</button>
                        <button onClick={() => initializePuzzle(currentPuzzle)} className="py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 shadow">साफ़ करें</button>
                    </div>
                </div>
                <div className="w-full lg:w-80 flex-shrink-0 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b-2">
                        <button onClick={() => setCurrentPuzzleIndex(p => Math.max(0, p - 1))} disabled={currentPuzzleIndex === 0} className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">पिछला</button>
                        <span className="text-lg font-bold">पहेली #{currentPuzzleIndex + 1}</span>
                        <button onClick={() => setCurrentPuzzleIndex(p => Math.min(puzzles.length - 1, p + 1))} disabled={currentPuzzleIndex === puzzles.length - 1} className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">अगला</button>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <h3 className="font-bold text-lg mb-2">आड़े (Across)</h3>
                            <ul className="text-sm space-y-2">{currentPuzzle.across_clues.map(({ number, clue }) => (<li key={`a-${number}`} className={`transition-colors ${activeWordData?.number === number && activeWordData.direction === 'across' ? 'font-bold text-blue-700' : ''}`}>{number}. {clue}</li>))}</ul>
                        </div>
                        <div className="w-1/2">
                            <h3 className="font-bold text-lg mb-2">खड़े (Down)</h3>
                            <ul className="text-sm space-y-2">{currentPuzzle.down_clues.map(({ number, clue }) => (<li key={`d-${number}`} className={`transition-colors ${activeWordData?.number === number && activeWordData.direction === 'down' ? 'font-bold text-blue-700' : ''}`}>{number}. {clue}</li>))}</ul>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full max-w-4xl mt-6 p-3 bg-gray-200 rounded-lg shadow-md">
                <div className="flex flex-col gap-2">
                    <div>
                        <h4 className="text-xs font-bold text-gray-600 mb-1 ml-2">स्वर (Vowels)</h4>
                        <div className="flex flex-wrap justify-center gap-1.5">{HINDI_VOWELS.map(char => (<button key={char} onClick={() => handleKeyboardInput(char, 'vowel')} className="keyboard-btn">{char}</button>))}</div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-600 mb-1 ml-2">व्यंजन (Consonants)</h4>
                        <div className="flex flex-wrap justify-center gap-1.5">{HINDI_CONSONANTS.map(char => (<button key={char} onClick={() => handleKeyboardInput(char, 'consonant')} className="keyboard-btn">{char}</button>))}</div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-600 mb-1 ml-2">मात्राएँ (Matras)</h4>
                        <div className="flex flex-wrap justify-center gap-1.5">
                            {HINDI_MATRAS.map(char => (<button key={char} onClick={() => handleKeyboardInput(char, 'matra')} className="keyboard-btn w-10">{char}</button>))}
                            <button onClick={() => handleKeyboardInput(null, 'backspace')} className="h-10 px-6 text-base bg-red-300 rounded-md shadow-sm hover:bg-red-400 font-bold">मिटाएँ</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}