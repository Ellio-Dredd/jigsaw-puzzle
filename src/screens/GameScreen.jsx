import React, { useState, useEffect, useCallback } from 'react';
import GameButton from '../components/GameButton';
import RoboHashAvatar from '../components/RoboHashAvatar';
import FunFactBanner from '../components/FunFactBanner';
import JigsawPuzzle from '../components/JigsawPuzzle';
import VerificationChallenge from '../components/VerificationChallenge';
import { fetchWithRetry, authenticatedFetch } from '../utils/api';
import { formatTime } from '../utils/formatters';
import { BACKEND_URL } from '../config';

/**
 * Main game screen component
 * Handles jigsaw puzzle and counting challenge gameplay
 */
const GameScreen = ({ setScreen, authData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [heartCount, setHeartCount] = useState('');
  const [carrotCount, setCarrotCount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [roundTime, setRoundTime] = useState(0);
  const [gameMetadata, setGameMetadata] = useState(null);

  // Timer logic
  useEffect(() => {
    let interval;
    if (imageLoaded && !isPuzzleSolved && !isVerifying) {
      interval = setInterval(() => {
        setRoundTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [imageLoaded, isPuzzleSolved, isVerifying]);

  // Fetch new round data
  const fetchImage = useCallback(async () => {
    setIsLoading(true);
    setImageLoaded(false);
    setRoundTime(0);
    setHeartCount('');
    setCarrotCount('');
    setIsPuzzleSolved(false);
    setFeedback(null);
    setGameMetadata(null);

    try {
      const data = await fetchWithRetry(`${BACKEND_URL}/api/game/new-round`);
      
      setGameMetadata({
        gameId: data.gameId,
        expectedHearts: data.expectedHearts,
        expectedCarrots: data.expectedCarrots,
      });

      setImageSrc(data.imageSrc);
      setIsLoading(false);
      setImageLoaded(true);
      
      console.log(`Fetched image ID: ${data.gameId}. Expected: ${data.expectedHearts} Hearts, ${data.expectedCarrots} Carrots.`);

    } catch (error) {
      console.error('New Round Fetch Error:', error.message);
      setFeedback({ 
        type: 'error', 
        message: `Failed to start round: ${error.message}` 
      });
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  // Submit answer and verify
  const handleSubmitAnswer = async () => {
    setIsVerifying(true);
    setFeedback(null);
    
    const payload = {
      gameId: gameMetadata.gameId,
      submittedHearts: parseInt(heartCount),
      submittedCarrots: parseInt(carrotCount),
      roundTime,
    };

    try {
      const data = await authenticatedFetch(
        `${BACKEND_URL}/api/game/submit-score`,
        authData.token,
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      setFeedback({ 
        type: 'success', 
        message: `${data.message} You earned ${data.score} points!` 
      });

    } catch (error) {
      console.error('Submission Error:', error.message);
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl flex justify-between items-center py-4 mb-6">
        <h1 className="text-4xl font-extrabold text-indigo-400">Heart Jigsaw Puzzle</h1>
        <div className="flex items-center space-x-4">
          <GameButton 
            onClick={() => setScreen('leaderboard')} 
            className="bg-gray-700 hover:bg-gray-600"
          >
            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            Leaderboard
          </GameButton>
          <RoboHashAvatar 
            userId={authData.userId} 
            robohashUrl={authData.robohashUrl} 
            size='h-12 w-12' 
          />
        </div>
      </header>

      <div className="w-full max-w-6xl space-y-8">
        <FunFactBanner />

        <div className="bg-gray-800 p-4 rounded-xl shadow-xl flex justify-between items-center border border-indigo-700/50">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-gray-400">Player:</span>
            <span className="text-xl font-bold text-indigo-300">{authData.userId}</span>
          </div>
          <div className="text-3xl font-mono bg-gray-900 px-4 py-1 rounded-lg text-red-400 shadow-inner">
            {formatTime(roundTime)}
          </div>
          <GameButton 
            onClick={fetchImage} 
            className="bg-gray-600 hover:bg-gray-500" 
            disabled={isLoading || isVerifying}
          >
            {isLoading ? 'Loading...' : 'New Round'}
          </GameButton>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">Jigsaw Puzzle</h2>
            <JigsawPuzzle
              isLoading={isLoading}
              imageLoaded={imageLoaded}
              imageSrc={imageSrc}
              isPuzzleSolved={isPuzzleSolved}
              onSolved={() => setIsPuzzleSolved(true)}
            />
          </div>

          <div className="col-span-1">
            <VerificationChallenge
              isPuzzleSolved={isPuzzleSolved}
              heartCount={heartCount}
              setHeartCount={setHeartCount}
              carrotCount={carrotCount}
              setCarrotCount={setCarrotCount}
              isVerifying={isVerifying}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              onNextRound={fetchImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;