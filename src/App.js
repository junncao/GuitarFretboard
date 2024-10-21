import React, { useState, useEffect } from 'react';
// 
// Standard tuning of a guitar
const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'].reverse();

// All notes in music
const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

// Chord intervals (semitones from root)
const chordMap = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  'Major 7': [0, 4, 7, 11],
  'Minor 7': [0, 3, 7, 10],
  'Dominant 7': [0, 4, 7, 10],
  Dim7: [0, 3, 6, 9],
  Minor7b5: [0, 3, 6, 10]
};

// Function to get the notes of a chord
function getChordNotes(root, chordType) {
  const rootIndex = allNotes.indexOf(root);
  return chordMap[chordType].map(interval => allNotes[(rootIndex + interval) % 12]);
}

// Function to get the note at a specific string and fret
function getNoteOnString(string, fret) {
  const stringIndex = allNotes.indexOf(string);
  return allNotes[(stringIndex + fret) % 12];
}

const frets = Array.from({ length: 13 }, (_, i) => i); // 0 to 12

// Note class to uniquely identify each note position
class Note {
  constructor(string, fret) {
    this.string = string;
    this.fret = fret;
  }

  toString() {
    return `${this.string}-${this.fret}`;
  }
}

function Fretboard({ selectedChord, rootNote, onCorrectSelection }) {
  const [visibleNotes, setVisibleNotes] = useState({});
  const [selectedNotes, setSelectedNotes] = useState([]);

  // 新增：重置函数
  const resetFretboard = () => {
    setVisibleNotes({});
    setSelectedNotes([]);
  };

  // 修改：useEffect 以响应 selectedChord 或 rootNote 的变化
  useEffect(() => {
    checkIfCorrect(selectedNotes);
  }, [selectedNotes, selectedChord, rootNote]);

  // 新增：useEffect 以在 chord 变化时重置 fretboard
  useEffect(() => {
    resetFretboard();
  }, [selectedChord, rootNote]);


  const toggleNoteVisibility = (string, fret) => {
    const note = new Note(string, fret).toString();
    const noteName = getNoteOnString(standardTuning[string], fret);
    setVisibleNotes(prev => ({ ...prev, [note]: !prev[note] }));
    setSelectedNotes(prev => {
      const noteIndex = prev.findIndex(n => n.position === note);
      if (noteIndex > -1) {
        // 如果这个位置的音符已经被选中，移除它
        return prev.filter((_, i) => i !== noteIndex);
      } else {
        // 否则，添加这个音符和它的位置
        return [...prev, { name: noteName, position: note }];
      }
    });
  };

  const chordNotes = getChordNotes(rootNote, selectedChord);

  const checkIfCorrect = (selectedNotes) => {
    const uniqueSelectedNoteNames = new Set(selectedNotes.map(n => n.name));
    if (chordNotes.every(note => uniqueSelectedNoteNames.has(note))) {
      onCorrectSelection();
    }
  };

  useEffect(() => {
    checkIfCorrect(selectedNotes);
  }, [selectedNotes, chordNotes, onCorrectSelection]);


  return (
    <div className="mt-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Guitar Fretboard:</h2>
      <div className="relative">
        {/* Fret bars */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex">
          {frets.map((fret) => (
            <div key={fret} className={`flex-1 border-r border-gray-400 ${fret === 0 ? 'border-r-4 border-gray-400' : ''}`} />
          ))}
        </div>

        {/* Strings and notes */}
        <div className="relative">
          {standardTuning.map((string, stringIndex) => (
            <div key={string} className="flex items-center h-10 relative">
              {/* String */}
              <div className="absolute left-0 right-0 h-px bg-gray-400" />
              
              {frets.map((fret) => {
                const note = getNoteOnString(string, fret);
                const noteKey = new Note(stringIndex, fret).toString();
                const isVisible = visibleNotes[noteKey];

                return (
                  <div 
                    key={fret} 
                    className="flex-1 flex justify-center items-center"
                    onClick={() => toggleNoteVisibility(stringIndex, fret)}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer
                        ${isVisible ? 'bg-blue-500' : 'border border-gray-300'}
                        ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <span className={`text-xs ${isVisible ? 'text-white font-bold' : 'text-gray-500'}`}>
                        {note}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Fret dots */}
        <div className="absolute bottom-full left-0 right-0 flex mb-1">
          {frets.map((fret) => (
            <div key={fret} className="flex-1 flex justify-center">
              {[3, 5, 7, 9].includes(fret) && <div className="w-2 h-2 rounded-full bg-gray-400" />}
              {fret === 12 && (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-400 mr-1" />
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedChord, setSelectedChord] = useState('Major');
  const [rootNote, setRootNote] = useState('C');
  const [isCorrect, setIsCorrect] = useState(false);

  // 新增：随机选择函数
  const randomizeChord = () => {
    const randomRoot = allNotes[Math.floor(Math.random() * allNotes.length)];
    const chordTypes = Object.keys(chordMap);
    const randomChord = chordTypes[Math.floor(Math.random() * chordTypes.length)];
    setRootNote(randomRoot);
    setSelectedChord(randomChord);
  };

  // 修改：handleCorrectSelection 函数
  const handleCorrectSelection = () => {
    setIsCorrect(true);
  };

  // 修改：handleNext 函数
  const handleNext = () => {
    setIsCorrect(false);
    randomizeChord();
  };

  // 新增：useEffect 用于初始随机选择
  useEffect(() => {
    randomizeChord();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Chord Selector</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <div className="mb-4">
          <label className="block mb-2 font-bold">Root Note:</label>
          <select 
            value={rootNote} 
            onChange={(e) => setRootNote(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {allNotes.map((note) => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Chord Type:</label>
          <select 
            value={selectedChord} 
            onChange={(e) => setSelectedChord(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {Object.keys(chordMap).map((chord) => (
              <option key={chord} value={chord}>{chord}</option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Chord Notes:</h2>
          <p className="text-lg">{getChordNotes(rootNote, selectedChord).join(', ')}</p>
        </div>
        <Fretboard selectedChord={selectedChord} rootNote={rootNote} onCorrectSelection={handleCorrectSelection} />
        {isCorrect && (
          <div className="mt-4">
            <p className="text-green-500 text-lg font-bold">选择正确</p>
            <button 
              onClick={handleNext} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;