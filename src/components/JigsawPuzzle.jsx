import React from 'react';
import GameButton from './GameButton';

/**
 * Jigsaw puzzle placeholder component
 * In production, this would contain actual puzzle logic
 * @param {object} props - Component props
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.imageLoaded - Whether image is loaded
 * @param {string} props.imageSrc - Source URL for puzzle image
 * @param {boolean} props.isPuzzleSolved - Puzzle completion state
 * @param {function} props.onSolved - Callback when puzzle is solved
 */
const JigsawPuzzle = ({ 
  isLoading, 
  imageLoaded, 
  imageSrc, 
  isPuzzleSolved, 
  onSolved 
}) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500">
        Fetching new puzzle...
      </div>
    );
  }

  if (!imageLoaded) {
    return (
      <div className="text-center text-red-500">
        Failed to load image.
      </div>
    );
  }

  return (
    <div className="w-full aspect-[3/2] bg-gray-700 flex items-center justify-center rounded-xl border-4 border-indigo-500/50 relative p-4">
      <img 
        src={imageSrc} 
        alt="Jigsaw Source" 
        className="w-full h-full object-cover rounded-lg opacity-30" 
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = "https://placehold.co/600x400/1e293b/d1d5db?text=Image+Load+Failed";
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
        <h3 className="text-2xl font-bold text-indigo-400 mb-4">
          Jigsaw Puzzle Area
        </h3>
        <p className="text-gray-300">Drag and drop logic goes here.</p>
        {!isPuzzleSolved ? (
          <GameButton onClick={onSolved} className="mt-4">
            Simulate Puzzle Solved
          </GameButton>
        ) : (
          <p className="text-green-400 font-bold mt-4 text-xl">
            Puzzle Solved! Good Job.
          </p>
        )}
      </div>
    </div>
  );
};

export default JigsawPuzzle;