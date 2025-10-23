import React from 'react';
import GameButton from './GameButton';

/**
 * Verification challenge component for counting hearts and carrots
 * @param {object} props - Component props
 * @param {boolean} props.isPuzzleSolved - Whether puzzle is completed
 * @param {string} props.heartCount - Number of hearts input
 * @param {function} props.setHeartCount - Setter for heart count
 * @param {string} props.carrotCount - Number of carrots input
 * @param {function} props.setCarrotCount - Setter for carrot count
 * @param {boolean} props.isVerifying - Whether answer is being verified
 * @param {function} props.onSubmit - Submit handler
 * @param {object} props.feedback - Feedback object {type, message}
 * @param {function} props.onNextRound - Handler for next round
 */
const VerificationChallenge = ({ 
  isPuzzleSolved, 
  heartCount, 
  setHeartCount, 
  carrotCount, 
  setCarrotCount, 
  isVerifying, 
  onSubmit, 
  feedback,
  onNextRound
}) => {
  const isFormValid = heartCount !== '' && carrotCount !== '';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-300">
        Verification Challenge
      </h2>
      
      <div className={`p-6 rounded-xl shadow-xl transition-all duration-300 border ${
        isPuzzleSolved 
          ? 'bg-gray-800 border-green-500/50' 
          : 'bg-gray-700 border-gray-600 opacity-60'
      }`}>
        <h3 className="text-xl font-semibold mb-4 text-gray-200">
          How many Hearts & Carrots are in the image?
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Hearts (❤️)</label>
            <input
              type="number"
              min="0"
              value={heartCount}
              onChange={(e) => setHeartCount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!isPuzzleSolved || isVerifying}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Carrots (🥕)</label>
            <input
              type="number"
              min="0"
              value={carrotCount}
              onChange={(e) => setCarrotCount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!isPuzzleSolved || isVerifying}
              required
            />
          </div>
        </div>

        <GameButton
          onClick={onSubmit}
          className="w-full mt-6"
          disabled={!isPuzzleSolved || isVerifying || !isFormValid}
        >
          {isVerifying ? 'Verifying Answer & Submitting Score...' : 'Submit Answer'}
        </GameButton>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg font-medium ${
            feedback.type === 'success' 
              ? 'bg-green-600/30 text-green-400' 
              : 'bg-red-600/30 text-red-400'
          }`}>
            {feedback.message}
            {feedback.type === 'success' && (
              <GameButton 
                onClick={onNextRound} 
                className="mt-2 w-full bg-green-700 hover:bg-green-600"
              >
                Start Next Round
              </GameButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationChallenge;