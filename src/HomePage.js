import React, { useState } from 'react';

const HomePage = ({ onSelectLevel }) => {
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Initially, only level 1 is unlocked

  const handleLevelClick = (level) => {
    if (unlockedLevels.includes(level)) {
      onSelectLevel(level);
    }
  };

  return (
    <div>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-6 text-white">Select a Level</h1>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((level) => (
            <div
              key={level}
              onClick={() => handleLevelClick(level)}
              className={`cursor-pointer p-4 rounded-lg shadow-lg transition-transform transform ${
                unlockedLevels.includes(level) ? 'bg-white text-indigo-600' : 'bg-gray-400 text-gray-600'
              } ${unlockedLevels.includes(level) ? 'hover:scale-105' : 'opacity-50'}`}
            >
              <span className="text-2xl font-semibold">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
