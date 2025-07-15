import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const GRID_SIZE = 5;

// All helper constants and functions (character maps, shuffle) are correct and unchanged.
// They are included here for a complete, runnable component.
const HINDI_VOWELS = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ'];
const HINDI_CONSONANTS = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'];
const compositionMap = {'क':{'ा':'का','ि':'कि','ी':'की','ु':'कु','ू':'कू','ृ':'कृ','े':'के','ै':'कै','ो':'को','ौ':'कौ','ं':'कं','ः':'कः','्':'क्'},'ख':{'ा':'खा','ि':'खि','ी':'खी','ु':'खु','ू':'खू','ृ':'खृ','े':'खे','ै':'खै','ो':'खो','ौ':'खौ','ं':'खं','ः':'खः','्':'ख्'},'ग':{'ा':'गा','ि':'गि','ी':'गी','ु':'गु','ू':'गू','ृ':'गृ','े':'गे','ै':'गै','ो':'गो','ौ':'गौ','ं':'गं','ः':'गः','्':'ग्'},'घ':{'ा':'घा','ि':'घि','ी':'घी','ु':'घु','ू':'घू','ृ':'घृ','े':'घे','ै':'घै','ो':'घो','ौ':'घौ','ं':'घं','ः':'घः','्':'घ्'},'च':{'ा':'चा','ि':'चि','ी':'ची','ु':'चु','ू':'चू','ृ':'चृ','े':'चे','ै':'चै','ो':'चो','ौ':'चौ','ं':'चं','ः':'चः','्':'च्'},'छ':{'ा':'छा','ि':'छि','ी':'छी','ु':'छु','ू':'छू','ृ':'छृ','े':'छे','ै':'छै','ो':'छो','ौ':'छौ','ं':'छं','ः':'छः','्':'छ्'},'ज':{'ा':'जा','ि':'जि','ी':'जी','ु':'जु','ू':'जू','ृ':'जृ','े':'जे','ै':'जै','ो':'जो','ौ':'जौ','ं':'जं','ः':'जः','्':'ज्'},'झ':{'ा':'झा','ि':'झि','ी':'झी','ु':'झु','ू':'झू','ृ':'झृ','े':'झे','ै':'झै','ो':'झो','ौ':'झौ','ं':'झं','ः':'झः','्':'झ्'},'ट':{'ा':'टा','ि':'टि','ी':'टी','ु':'टु','ू':'टू','ृ':'टृ','े':'टे','ै':'टै','ो':'टो','ौ':'टौ','ं':'टं','ः':'टः','्':'ट्'},'ठ':{'ा':'ठा','ि':'ठि','ी':'ठी','ु':'ठु','ू':'ठू','ृ':'ठृ','े':'ठे','ै':'ठै','ो':'ठो','ौ':'ठौ','ं':'ठं','ः':'ठः','्':'ठ्'},'ड':{'ा':'डा','ि':'डि','ी':'डी','ु':'डु','ू':'डू','ृ':'डृ','े':'डे','ै':'डै','ो':'डो','ौ':'डौ','ं':'डं','ः':'डः','्':'ड्'},'ढ':{'ा':'ढा','ि':'ढि','ी':'ढी','ु':'ढु','ू':'ढू','ृ':'ढृ','े':'ढे','ै':'ढै','ो':'ढो','ौ':'ढौ','ं':'ढं','ः':'ढः','्':'ढ्'},'ण':{'ा':'णा','ि':'णि','ी':'णी','ु':'णु','ू':'णू','ृ':'णृ','े':'णे','ै':'णै','ो':'णो','ौ':'णौ','ं':'णं','ः':'णः','्':'ण्'},'त':{'ा':'ता','ि':'ति','ी':'ती','ु':'तु','ू':'तू','ृ':'तृ','े':'ते','ै':'तै','ो':'तो','ौ':'तौ','ं':'तं','ः':'तः','्':'त्'},'थ':{'ा':'था','ि':'थि','ी':'थी','ु':'थु','ू':'थू','ृ':'थृ','े':'थे','ै':'थै','ो':'थो','ौ':'थौ','ं':'थं','ः':'थः','्':'थ्'},'द':{'ा':'दा','ि':'दि','ी':'दी','ु':'दु','ू':'दू','ृ':'दृ','े':'दे','ै':'दै','ो':'दो','ौ':'दौ','ं':'दं','ः':'दः','्':'द्'},'ध':{'ा':'धा','ि':'धि','ी':'धी','ु':'धु','ू':'धू','ृ':'धृ','े':'धे','ै':'धै','ो':'घो','ौ':'धौ','ं':'धं','ः':'धः','्':'ध्'},'न':{'ा':'ना','ि':'नि','ी':'नी','ु':'नु','ू':'नू','ृ':'नृ','े':'ने','ै':'नै','ो':'नो','ौ':'नौ','ं':'नं','ः':'नः','्':'न्'},'प':{'ा':'पा','ि':'पि','ी':'पी','ु':'पु','ू':'पू','ृ':'पृ','े':'पे','ै':'पै','ो':'पो','ौ':'पौ','ं':'पं','ः':'पः','्':'प्'},'फ':{'ा':'फा','ि':'फि','ी':'फी','ु':'फु','ू':'फू','ृ':'फृ','े':'फे','ै':'फै','ो':'फो','ौ':'फौ','ं':'फं','ः':'फः','्':'फ्'},'ब':{'ा':'बा','и':'बि','ी':'बी','ु':'बु','ू':'बू','ृ':'बृ','े':'बे','ै':'बै','ो':'बो','ौ':'बौ','ं':'बं','ः':'बः','्':'ब्'},'भ':{'ा':'भा','ि':'भि','ी':'भी','ु':'भु','ू':'भू','ृ':'भृ','े':'भे','ै':'भै','ो':'भो','ौ':'भौ','ं':'भं','ः':'भः','्':'भ्'},'म':{'ा':'मा','ि':'मि','ी':'मी','ु':'मु','ू':'मू','ृ':'मृ','े':'मे','ै':'मै','ो':'मो','ौ':'मौ','ं':'मं','ः':'मः','्':'म्'},'य':{'ा':'या','ि':'यि','ी':'यी','ु':'यु','ू':'यू','ृ':'यृ','े':'ये','ै':'यै','ो':'यो','ौ':'यौ','ं':'यं','ः':'यः','्':'य्'},'र':{'ा':'रा','ि':'रि','ी':'री','ु':'रु','ू':'रू','ृ':'रृ','े':'रे','ै':'रै','ो':'रो','ौ':'रौ','ं':'रं','ः':'रः','्':'र्'},'ल':{'ा':'ला','ि':'लि','ी':'ली','ु':'लु','ू':'लू','ृ':'लृ','े':'ले','ै':'लै','ो':'लो','ौ':'लौ','ं':'लं','ः':'लः','्':'ल्'},'व':{'ा':'वा','ि':'वि','ी':'वी','ु':'वु','ू':'वू','ृ':'वृ','े':'वे','ै':'वै','ो':'वो','ौ':'वौ','ं':'वं','ः':'वः','्':'व्'},'श':{'ा':'शा','ि':'शि','ी':'शी','ु':'शु','ू':'शू','ृ':'शृ','े':'शे','ै':'शै','ो':'शो','ौ':'शौ','ं':'शं','ः':'शः','्':'श्'},'ष':{'ा':'षा','ि':'षि','ी':'षी','ु':'षु','ू':'षू','ृ':'षृ','े':'षे','ै':'षै','ो':'षो','ौ':'षौ','ं':'षं','ः':'षः','्':'ष्'},'स':{'ा':'सा','ि':'सि','ी':'सी','ु':'सु','ू':'सू','ृ':'सृ','े':'से','ै':'सै','ो':'सो','ौ':'सौ','ं':'सं','ः':'सः','्':'स्'},'ह':{'ा':'हा','ि':'हि','ी':'ही','ु':'हु','ू':'हू','ृ':'हृ','े':'हे','ै':'है','ो':'हो','ौ':'हौ','ं':'हं','ः':'हः','्':'ह्'}};

const generateCharacterPool = () => { /* Unchanged */
    const pool = new Set(HINDI_VOWELS);
    HINDI_CONSONANTS.forEach(consonant => {
        pool.add(consonant);
        if (compositionMap[consonant]) {
            Object.values(compositionMap[consonant]).forEach(composed => pool.add(composed));
        }
    });
    return Array.from(pool);
};
const ALL_POSSIBLE_CHARS = generateCharacterPool();

const shuffleArray = (array) => { /* Unchanged */
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const CompletionModal = ({ onNext, onClose }) => ( /* Unchanged */
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-green-600">बहुत बढ़िया!</h2>
            <p className="mb-6 text-lg text-gray-700">आपने पहेली पूरी कर ली।</p>
            <div className="flex gap-4">
                <button onClick={onNext} className="w-full py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 shadow-lg">अगली पहेली</button>
                <button onClick={onClose} className="w-full py-2 bg-gray-300 rounded-md hover:bg-gray-400">बंद करें</button>
            </div>
        </div>
    </div>
);

export default function HindiMiniCrossword() {
    const [puzzles, setPuzzles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [gridState, setGridState] = useState(Array(GRID_SIZE * GRID_SIZE).fill(''));
    const [activeCell, setActiveCell] = useState(null);
    const [direction, setDirection] = useState('across');
    const [isCompleted, setIsCompleted] = useState(false);
    const [hintedCells, setHintedCells] = useState(new Set());
    const [keyboardOptions, setKeyboardOptions] = useState([]);
    const inputRefs = useRef([]);
    const currentPuzzle = puzzles[currentPuzzleIndex];

    const wordDataMap = useMemo(() => { /* Unchanged, logic is sound */
        if (!currentPuzzle) return new Map();
        const map = new Map();
        const numberToCoords = new Map();
        currentPuzzle.gridnums.forEach((num, index) => {
            if (num > 0) numberToCoords.set(num, { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE });
        });
        const addWordToMap = (clue, dir) => {
            const { number } = clue;
            const answer = currentPuzzle.answers[dir][String(number)];
            const start = numberToCoords.get(number);
            if (!answer || !start) return;
            const indices = Array.from({ length: answer.length }, (_, i) => 
                dir === 'across' 
                    ? start.row * GRID_SIZE + (start.col + i) 
                    : (start.row + i) * GRID_SIZE + start.col
            );
            map.set(`${dir}-${number}`, { ...clue, answer, direction: dir, indices, key: `${dir}-${number}` });
        };
        currentPuzzle.across_clues.forEach(clue => addWordToMap(clue, 'across'));
        currentPuzzle.down_clues.forEach(clue => addWordToMap(clue, 'down'));
        return map;
    }, [currentPuzzle]);

    const sortedClueKeys = useMemo(() => { /* Unchanged, logic is sound */
        if (!currentPuzzle) return [];
        return Array.from(wordDataMap.keys()).sort((a, b) => {
            const [aDir, aNum] = a.split('-');
            const [bDir, bNum] = b.split('-');
            if (parseInt(aNum) !== parseInt(bNum)) return parseInt(aNum) - parseInt(bNum);
            return aDir.localeCompare(bDir);
        });
    }, [wordDataMap]);

    const initializePuzzle = useCallback((puzzle) => { /* Unchanged */
        if (!puzzle) return;
        setGridState(Array(GRID_SIZE * GRID_SIZE).fill(''));
        setIsCompleted(false);
        setHintedCells(new Set());
        if (sortedClueKeys.length > 0) {
            const firstWord = wordDataMap.get(sortedClueKeys[0]);
            const firstIndex = firstWord.indices[0];
            setActiveCell({ row: Math.floor(firstIndex / GRID_SIZE), col: firstIndex % GRID_SIZE });
            setDirection(firstWord.direction);
        } else {
             setActiveCell(null);
        }
    }, [sortedClueKeys, wordDataMap]);
    
    useEffect(() => { /* Unchanged */
        fetch('/hindi_crosswords.json').then(res => res.json()).then(data => {
            if (data && data.length > 0) setPuzzles(data);
            setIsLoading(false);
        }).catch(err => { console.error("Error loading puzzles:", err); setIsLoading(false); });
    }, []);

    useEffect(() => { initializePuzzle(puzzles[currentPuzzleIndex]); }, [currentPuzzleIndex, puzzles, initializePuzzle]);
    
    useEffect(() => { /* Unchanged */
        if (activeCell) {
            const index = activeCell.row * GRID_SIZE + activeCell.col;
            if (inputRefs.current[index]) inputRefs.current[index].focus({ preventScroll: true });
        }
    }, [activeCell]);
    
    // --- KEYBOARD LOGIC: Simplified and Corrected ---
    useEffect(() => {
        if (!activeCell || !currentPuzzle) {
            setKeyboardOptions([]);
            return;
        }
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        if (hintedCells.has(index)) {
            setKeyboardOptions([]);
            return;
        }
        const correctAnswer = currentPuzzle.grid[index];
        const puzzleChars = [...new Set(currentPuzzle.grid.filter(Boolean))];
        const genericDecoys = shuffleArray([...ALL_POSSIBLE_CHARS].filter(c => !puzzleChars.includes(c))).slice(0, 5);
        const totalDecoyPool = [...new Set([...puzzleChars, ...genericDecoys])].filter(c => c !== correctAnswer);
        const finalOptions = shuffleArray([correctAnswer, ...shuffleArray(totalDecoyPool).slice(0, 11)]);
        setKeyboardOptions(finalOptions);
    }, [activeCell, currentPuzzle, hintedCells]);

    const getActiveWordInfo = useCallback(() => { /* Unchanged */
        if (!activeCell) return null;
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        let acrossWord, downWord;
        for (const word of wordDataMap.values()) {
            if (word.indices.includes(index)) {
                if (word.direction === 'across') acrossWord = word;
                if (word.direction === 'down') downWord = word;
            }
        }
        if (direction === 'across' && acrossWord) return acrossWord;
        if (direction === 'down' && downWord) return downWord;
        return acrossWord || downWord;
    }, [activeCell, direction, wordDataMap]);

    const activeWordInfo = getActiveWordInfo();

    // --- NAVIGATION LOGIC: The New, Robust Core Function ---
    const moveToNextAvailableCell = useCallback((forward = true) => {
        const currentWord = getActiveWordInfo();
        if (!currentWord) return;

        const currentGridIndex = activeCell.row * GRID_SIZE + activeCell.col;

        // Step 1: Try to find the next empty cell in the current word.
        const orderedIndices = forward ? currentWord.indices : [...currentWord.indices].reverse();
        const nextCellInWordIndex = orderedIndices.indexOf(currentGridIndex) + 1;
        
        for (let i = nextCellInWordIndex; i < orderedIndices.length; i++) {
            const nextGridIndex = orderedIndices[i];
            if (!gridState[nextGridIndex] && !hintedCells.has(nextGridIndex)) {
                setActiveCell({ row: Math.floor(nextGridIndex / GRID_SIZE), col: nextGridIndex % GRID_SIZE });
                return; // Found a spot in the current word.
            }
        }

        // Step 2: If not found, find the next word with an empty cell.
        const currentWordOrderIndex = sortedClueKeys.indexOf(currentWord.key);
        for (let i = 1; i < sortedClueKeys.length; i++) {
            const nextWordOrderIndex = (currentWordOrderIndex + (forward ? i : -i) + sortedClueKeys.length) % sortedClueKeys.length;
            const nextWord = wordDataMap.get(sortedClueKeys[nextWordOrderIndex]);
            const firstEmptyCellIndex = nextWord.indices.find(idx => !gridState[idx] && !hintedCells.has(idx));

            if (firstEmptyCellIndex !== undefined) {
                setActiveCell({ row: Math.floor(firstEmptyCellIndex / GRID_SIZE), col: firstEmptyCellIndex % GRID_SIZE });
                setDirection(nextWord.direction);
                return; // Found a spot in a new word.
            }
        }
    }, [activeCell, gridState, hintedCells, sortedClueKeys, wordDataMap, getActiveWordInfo]);

    const handleKeySelect = (char) => {
        if (!activeCell || isCompleted || hintedCells.has(activeCell.row * GRID_SIZE + activeCell.col)) return;
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        setGridState(prev => {
            const newGrid = [...prev];
            newGrid[index] = char;
            return newGrid;
        });
        moveToNextAvailableCell(true);
    };
    
    const handleBackspace = () => {
        if (!activeCell || isCompleted || hintedCells.has(activeCell.row * GRID_SIZE + activeCell.col)) return;
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        if (gridState[index]) {
            setGridState(prev => {
                const newGrid = [...prev];
                newGrid[index] = '';
                return newGrid;
            });
            // Stay in the current cell to allow for correction.
        } else {
            // If the cell is already empty, move backward.
            moveToNextAvailableCell(false);
        }
    };
    
    const handleKeyDown = (e) => { e.preventDefault(); if (e.key === 'Backspace') handleBackspace(); };

    const handleCellClick = (row, col) => {
        const index = row * GRID_SIZE + col;
        let hasAcross = false, hasDown = false;
        for (const word of wordDataMap.values()){
            if(word.indices.includes(index)) {
                if (word.direction === 'across') hasAcross = true;
                if (word.direction === 'down') hasDown = true;
            }
        }

        if (activeCell && activeCell.row === row && activeCell.col === col) {
            if (direction === 'across' && hasDown) setDirection('down');
            else if (direction === 'down' && hasAcross) setDirection('across');
        } else {
            setActiveCell({ row, col });
            if (hasAcross) setDirection('across');
            else if (hasDown) setDirection('down');
        }
    };
    
    const handleHint = () => {
        if (!activeCell || isCompleted) return;
        const index = activeCell.row * GRID_SIZE + activeCell.col;
        if (hintedCells.has(index)) return;
        setGridState(prev => {
            const newGrid = [...prev];
            newGrid[index] = currentPuzzle.grid[index];
            return newGrid;
        });
        setHintedCells(prev => new Set(prev).add(index));
        moveToNextAvailableCell(true);
    };

    const checkCompletion = () => { /* Unchanged */
        if (!currentPuzzle) return;
        if (gridState.join('') === currentPuzzle.grid.join('')) {
            setIsCompleted(true);
        } else {
            alert('कुछ अक्षर गलत हैं या खाली हैं, फिर से प्रयास करें!');
        }
    };

    // --- JSX RENDER (Unchanged) ---
    if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-100 text-2xl">पहेलियाँ लोड हो रही हैं...</div>;
    if (!currentPuzzle) return <div className="flex items-center justify-center h-screen bg-gray-100 text-2xl text-red-500">पहेलियाँ लोड करने में विफल!</div>;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-2 sm:p-4 font-sans">
            {isCompleted && <CompletionModal onNext={() => setCurrentPuzzleIndex(p => (p + 1) % puzzles.length)} onClose={() => setIsCompleted(false)} />}
            <header className="w-full max-w-lg mb-4 text-center"><h1 className="text-3xl sm:text-4xl font-bold">हिंदी मिनी क्रॉसवर्ड</h1></header>
            <main className="w-full flex flex-col lg:flex-row justify-center items-start gap-6 lg:gap-10">
                <div className="w-full max-w-[350px] sm:max-w-sm mx-auto flex flex-col items-center">
                    <div className="border-4 border-gray-800 shadow-xl rounded-lg overflow-hidden">
                        <div className="bg-gray-800">
                            <div className="grid grid-cols-5 gap-px">
                                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                                    const row = Math.floor(index / GRID_SIZE); const col = index % GRID_SIZE;
                                    const isBlackCell = currentPuzzle.grid[index] === '';
                                    const isActive = activeCell && activeCell.row === row && activeCell.col === col;
                                    const isInActiveWord = activeWordInfo?.indices.includes(index) ?? false;
                                    const isHinted = hintedCells.has(index);
                                    return (
                                        <div key={index} onClick={() => !isBlackCell && handleCellClick(row, col)}
                                            className={`relative flex items-center justify-center w-full aspect-square transition-all duration-150 ease-in-out ${isBlackCell ? 'bg-gray-800' : 'bg-white cursor-pointer'} ${!isActive && isInActiveWord ? 'bg-blue-200' : ''} ${isActive ? 'bg-yellow-300 transform scale-105 z-10' : ''}`}>
                                            {currentPuzzle.gridnums[index] > 0 && <span className="absolute top-0.5 left-1 text-[10px] font-light text-gray-500">{currentPuzzle.gridnums[index]}</span>}
                                            <span className={`text-2xl sm:text-3xl font-bold ${isHinted ? 'text-blue-600' : ''}`}>{gridState[index]}</span>
                                            <input ref={el => inputRefs.current[index] = el} onKeyDown={handleKeyDown} className="absolute opacity-0 w-0 h-0" tabIndex="-1" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-3 p-2 bg-blue-100 rounded-md text-center h-12 flex items-center justify-center text-blue-900 shadow-inner">
                        <p className="font-bold">{activeWordInfo ? `${activeWordInfo.number}. ${activeWordInfo.clue}` : 'एक सेल चुनें'}</p>
                    </div>
                    <div className="w-full mt-3 grid grid-cols-3 gap-2">
                        <button onClick={handleHint} className="py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 shadow">संकेत</button>
                        <button onClick={checkCompletion} className="py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 shadow">जाँचें</button>
                        <button onClick={() => initializePuzzle(currentPuzzle)} className="py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 shadow">साफ़ करें</button>
                    </div>
                </div>
                <div className="w-full lg:w-80 flex-shrink-0 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b-2">
                        <button onClick={() => setCurrentPuzzleIndex(p => (p - 1 + puzzles.length) % puzzles.length)} disabled={puzzles.length <= 1} className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">पिछला</button>
                        <span className="text-lg font-bold">पहेली #{currentPuzzleIndex + 1}</span>
                        <button onClick={() => setCurrentPuzzleIndex(p => (p + 1) % puzzles.length)} disabled={puzzles.length <= 1} className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">अगला</button>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <h3 className="font-bold text-lg mb-2">आड़े (Across)</h3>
                            <ul className="text-sm space-y-2">{currentPuzzle.across_clues.map(({ number, clue }) => (<li key={`a-${number}`} className={`transition-colors ${(activeWordInfo?.number === number && activeWordInfo.direction === 'across') ? 'font-bold text-blue-700' : ''}`}>{number}. {clue}</li>))}</ul>
                        </div>
                        <div className="w-1/2">
                            <h3 className="font-bold text-lg mb-2">खड़े (Down)</h3>
                            <ul className="text-sm space-y-2">{currentPuzzle.down_clues.map(({ number, clue }) => (<li key={`d-${number}`} className={`transition-colors ${(activeWordInfo?.number === number && activeWordInfo.direction === 'down') ? 'font-bold text-blue-700' : ''}`}>{number}. {clue}</li>))}</ul>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full max-w-2xl mt-6 p-4 bg-gray-200 rounded-lg shadow-md min-h-[140px] flex items-center justify-center">
                {keyboardOptions.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        {keyboardOptions.map(char => (<button key={char} onClick={() => handleKeySelect(char)} className="w-12 h-12 bg-white rounded-md shadow text-2xl font-bold flex items-center justify-center hover:bg-yellow-200 active:bg-yellow-300 transition-colors">{char}</button>))}
                        <button onClick={handleBackspace} className="w-20 h-12 bg-red-300 rounded-md shadow text-base font-bold flex items-center justify-center hover:bg-red-400">मिटाएँ</button>
                    </div>
                ) : ( <div className="text-gray-500">{!activeCell ? 'टाइप करने के लिए एक सेल चुनें।' : 'यह सेल संकेत द्वारा अक्षम है।'}</div>)}
            </footer>
        </div>
    );
}