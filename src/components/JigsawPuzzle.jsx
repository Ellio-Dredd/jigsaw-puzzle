// JigsawPuzzle.jsx (Updated)

import React from 'react';
import GameButton from './GameButton';

const PUZZLE_IFRAME_SRC = "https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?pkey=5b91b5c8-2b36-4191-881e-182390a3c75d"; // Example external puzzle

/**
 * Jigsaw puzzle component with external iframe for interactive play.
 * @param {object} props - Component props
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.imageSrc - Source URL for Heart API image (used for hint)
 * @param {boolean} props.isHintActive - NEW: Flag to show the Heart API image for counting
 * @param {boolean} props.isHeartCountCorrect - Flag indicating correct heart count was submitted
 * @param {boolean} props.isPuzzleSolved - Puzzle completion state
 * @param {function} props.onSolved - Callback when puzzle is solved (used to manually mark it solved)
 */
const JigsawPuzzle = ({ 
  isLoading, 
  imageSrc, 
  isHintActive, // New Prop
  isHeartCountCorrect, 
  isPuzzleSolved, 
  onSolved 
}) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500">Fetching new puzzle...</div>
    );
  }

  // Determine what to display in the main puzzle area
  let content;
  
  if (isHintActive) {
    // A. Show the Heart API image for counting (Hint Mode)
    content = (
      <div className="w-full h-full p-2">
        <h3 className="text-xl font-bold text-red-400 mb-2">
          Hint Mode: Count the Hearts (❤️) in this image!
        </h3>
        <img 
          src={imageSrc} 
          alt="Heart Count Hint" 
          className="w-full h-auto object-contain max-h-[70%] border-2 border-red-500 rounded-lg shadow-2xl mx-auto"
        />
        <p className="text-sm text-gray-400 mt-2">Enter your count in the right panel.</p>
      </div>
    );
  } else if (isPuzzleSolved) {
    // B. Show Solved State
    content = (
      <div className="flex items-center justify-center h-full flex-col">
        <h3 className="text-3xl font-bold text-green-400 mb-4">
          Puzzle Solved!
        </h3>
        <p className="text-gray-300">You may now submit your final count.</p>
      </div>
    );
  } else {
    // C. Show the Interactive External Jigsaw Puzzle
    content = (
      <>
        <iframe 
          src={PUZZLE_IFRAME_SRC} 
          title="External Jigsaw Puzzle"
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
        <div className={`absolute top-0 left-0 m-4 p-2 bg-gray-900/80 rounded-lg text-sm font-semibold transition-all duration-500 ${isHeartCountCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
            Tile Status: {isHeartCountCorrect ? '1/4 Tiles Solved (Hint Used)' : '0/4 Tiles Solved'}
        </div>
        {/* Placeholder for the "solved" tile animation */}
        {isHeartCountCorrect && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-1/4 h-1/4 bg-green-500/50 animate-pulse rounded-md border-4 border-green-300"></div>
             </div>
         )}
         {/* Button to simulate full solve once the hint is active */}
         {isHeartCountCorrect && (
             <GameButton onClick={onSolved} className="mt-4 absolute bottom-4 right-4 z-20">
                 Simulate Full Puzzle Solved
             </GameButton>
         )}
      </>
    );
  }


  return (
    <div className="w-full aspect-[3/2] bg-gray-700 flex items-center justify-center rounded-xl border-4 border-indigo-500/50 relative p-4 overflow-hidden">
        {content}
    </div>
  );
};

export default JigsawPuzzle;