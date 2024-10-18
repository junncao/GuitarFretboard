import React, { useState } from 'react';

const chords = {
  Major: ['C', 'E', 'G'],
  minor: ['C', 'Eb', 'G'],
  sus4: ['C', 'F', 'G'],
  dim: ['C', 'Eb', 'Gb'],
  aug: ['C', 'E', 'G#'],
  '7th': ['C', 'E', 'G', 'Bb'],
  maj7: ['C', 'E', 'G', 'B'],
  add9: ['C', 'E', 'G', 'D'],
};

const guitarStrings = ['E', 'A', 'D', 'G', 'B', 'E'];
const frets = Array.from({ length: 13 }, (_, i) => i); // 0 to 12
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNote(string, fret) {
  const stringIndex = notes.indexOf(string);
  return notes[(stringIndex + fret) % 12];
}

function Fretboard({ selectedChord }) {
  const [visibleNotes, setVisibleNotes] = useState({});

  const toggleNoteVisibility = (string, fret) => {
    const noteKey = `${string}-${fret}`;
    setVisibleNotes(prev => ({ ...prev, [noteKey]: !prev[noteKey] }));
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Guitar Fretboard:</h2>
      <div className="relative">
        {/* Fret bars */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex">
          {frets.map((fret) => (
            <div key={fret} className="flex-1 border-r border-gray-400" />
          ))}
        </div>
        
        {/* Fret markers */}
        <div className="absolute top-full left-0 right-0 flex text-xs text-gray-500 mt-1">
          {frets.map((fret) => (
            <div key={fret} className="flex-1 text-center">{fret}</div>
          ))}
        </div>
        
        {/* Strings and notes */}
        <div className="relative">
          {guitarStrings.map((string, stringIndex) => (
            <div key={string} className="flex items-center h-10 relative">
              {/* String */}
              <div className="absolute left-0 right-0 h-px bg-gray-400" />
              
              {frets.map((fret) => {
                const note = getNote(string, fret);
                const isChordNote = chords[selectedChord].includes(note);
                const noteKey = `${string}-${fret}`;
                const isVisible = visibleNotes[noteKey];

                return (
                  <div 
                    key={fret} 
                    className="flex-1 flex justify-center items-center"
                    onClick={() => toggleNoteVisibility(string, fret)}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer
                        ${isChordNote ? 'bg-blue-500' : 'border border-gray-300'}
                        ${isVisible ? 'opacity-100' : 'opacity-30'}`}
                    >
                      <span className={`text-xs ${isChordNote ? 'text-white font-bold' : 'text-gray-500'}`}>
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Chord Selector</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <select 
          value={selectedChord} 
          onChange={(e) => setSelectedChord(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        >
          {Object.keys(chords).map((chord) => (
            <option key={chord} value={chord}>{chord}</option>
          ))}
        </select>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Chord Notes:</h2>
          <p className="text-lg">{chords[selectedChord].join(', ')}</p>
        </div>
        <Fretboard selectedChord={selectedChord} />
      </div>
    </div>
  );
}

export default App;