import React, { useState, useEffect, useCallback } from 'react';
import GameButton from '../components/GameButton';
import RoboHashAvatar from '../components/RoboHashAvatar';
import FunFactBanner from '../components/FunFactBanner';
import MatchingGame from '../components/MatchingGame'; 
import { fetchWithRetry, authenticatedFetch } from '../utils/api';
import { formatTime } from '../utils/formatters';
import { supabase } from '../supabaseClient';
import { HEART_API_URL } from '../config';


const EMOJI_VALUES = ['🍔', '🍕', '🌮', '🍩', '🍦', '🍓', '🍇', '🍎'];
const TOTAL_PAIRS = EMOJI_VALUES.length;

// Utility to initialize and shuffle the cards 
const initializeCards = () => {
    let cards = EMOJI_VALUES.flatMap(value => [
        { value, flipped: false, matched: false },
        { value, flipped: false, matched: false }
    ]);

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards;
};


const GameScreen = ({ setScreen, authData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    
    // --- Matching Game States ---
    const [cards, setCards] = useState(initializeCards());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    const [solvedPairs, setSolvedPairs] = useState(0);

    // --- Heart Key States ---
    const [isHintActive, setIsHintActive] = useState(false); // CONTROLS MODAL VISIBILITY
    const [heartCountKeyUsed, setHeartCountKeyUsed] = useState(false);
    const [heartCount, setHeartCount] = useState('');
    const [feedback, setFeedback] = useState(null);
    
    // --- General Game States ---
    const [roundTime, setRoundTime] = useState(0);
    const [gameMetadata, setGameMetadata] = useState(null);
    const isGameSolved = solvedPairs === TOTAL_PAIRS;

    // Timer logic 
    useEffect(() => {
        let interval;
        if (imageLoaded && !isGameSolved && !isLocked) {
            interval = setInterval(() => {
                setRoundTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [imageLoaded, isGameSolved, isLocked]);

    // Match Check Logic
    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsLocked(true);
            const [index1, index2] = flippedIndices;
            
            if (cards[index1].value === cards[index2].value) {
                // MATCH FOUND!
                setTimeout(() => {
                    setCards(prevCards => prevCards.map((card, index) => {
                        if (index === index1 || index === index2) {
                            return { ...card, matched: true };
                        }
                        return card;
                    }));
                    setSolvedPairs(prev => prev + 1);
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 800);
            } else {
                // NO MATCH - flip back down
                setTimeout(() => {
                    setCards(prevCards => prevCards.map((card, index) => {
                        if (index === index1 || index === index2) {
                            return { ...card, flipped: false };
                        }
                        return card;
                    }));
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 1000);
            }
        }
    }, [flippedIndices, cards]);

    // Handle Card Click 
    const handleCardClick = useCallback((index) => {
        if (isLocked || cards[index].matched || cards[index].flipped) return;

        if (flippedIndices.length === 2) return; 

        setCards(prevCards => prevCards.map((card, i) => 
            i === index ? { ...card, flipped: true } : card
        ));

        setFlippedIndices(prev => [...prev, index]);
    }, [isLocked, cards, flippedIndices]);


    // Fetch new round data 
    const fetchImage = useCallback(async () => {
        setIsLoading(true);
        setCards(initializeCards());
        setSolvedPairs(0);
        setFlippedIndices([]);
        setIsLocked(false);
        setRoundTime(0);
        setHeartCount('');
        setHeartCountKeyUsed(false);
        setIsHintActive(false); // Ensure modal is closeed
        setFeedback(null);
        setGameMetadata(null);
        setImageLoaded(false);

        try {
            const data = await fetchWithRetry(HEART_API_URL);
            
            const newGameMetadata = {
                gameId: data.question, 
                expectedHearts: data.solution,
                expectedCarrots: data.carrots,
            };

            setGameMetadata(newGameMetadata);
            setImageSrc(data.question); 
            setIsLoading(false);
            setImageLoaded(true);
            
        } catch (error) {
            console.error('New Round Fetch Error:', error.message);
            setFeedback({ type: 'error', message: `Failed to start round: ${error.message}` });
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);
    
    // Find and automatically solve one random, unmatched pair
    const solveOnePair = useCallback(() => {
        const unmatchedCards = cards.map((card, index) => ({ ...card, index }))
            .filter(card => !card.matched);
        
        if (unmatchedCards.length === 0) return;

        const groups = unmatchedCards.reduce((acc, card) => {
            acc[card.value] = acc[card.value] || [];
            acc[card.value].push(card.index);
            return acc;
        }, {});

        const pairValue = Object.keys(groups).find(key => groups[key].length === 2);
        
        if (pairValue) {
            const [index1, index2] = groups[pairValue];
            
            setCards(prevCards => prevCards.map((card, index) => {
                // Unflip any cards currently face-up that are NOT the matched pair
                if (card.flipped && !card.matched && index !== index1 && index !== index2) {
                     return { ...card, flipped: false };
                }
                
                // Mark the automatically solved pair
                if (index === index1 || index === index2) {
                    return { ...card, flipped: true, matched: true };
                }

                return card;
            }));
            
            setFlippedIndices([]);
            setSolvedPairs(prev => prev + 1);
            setHeartCountKeyUsed(true); 
            setHeartCount('');
            // CLOSE MODAL ON SUCCESS
            setIsHintActive(false); 
        }
    }, [cards]);


    // Handle the submission for the Heart Count --------------Modal Action
    const handleHeartKeySubmit = () => {
        setFeedback(null);
        
        const submittedHearts = parseInt(heartCount);
        const expectedHearts = gameMetadata?.expectedHearts;

        if (submittedHearts === expectedHearts) {
            solveOnePair(); // If correct, solve one pair 
        } else {
            setFeedback({ type: 'error', message: '❌ Incorrect Heart Count. Please try again.' });
        }
    };
    
    // Final Score Submission 


        const handleFinalScoreSubmission = async () => {
        try {
            // Insert new score record
            const { data, error } = await supabase.from("leaderboard").insert([
            {
                user_id: authData.userId,
                username: authData.email,
                score: solvedPairs, // number of pairs solved
                time: formatTime(roundTime), 
            },
            ]);

            if (error) throw error;

            setFeedback({
            type: "success",
            message: `🎉 Game Complete! Time recorded: ${formatTime(roundTime)}`,
            });
        } catch (error) {
            console.error("Supabase Insert Error:", error.message);
            setFeedback({
            type: "error",
            message: "⚠️ Failed to save score. Try again.",
            });
        }
        };


    useEffect(() => {
        if (isGameSolved) {
            handleFinalScoreSubmission();
        }
    }, [isGameSolved, roundTime]); // Added roundTime dependency for submission log

    // Helper function to close modal and reset input
    const closeModal = () => {
        setIsHintActive(false);
        setHeartCount('');
        setFeedback(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
            {/* HEADER AND STATUS BAR (Unchanged) */}
            <header className="w-full max-w-6xl flex justify-between items-center py-4 mb-6">
                <h1 className="text-4xl font-extrabold text-indigo-400">Memory Match Key</h1>
                <div className="flex items-center space-x-4">
                    <GameButton onClick={() => setScreen('leaderboard')} className="bg-gray-700 hover:bg-gray-600">
                        Leaderboard
                    </GameButton>
                    <RoboHashAvatar userId={authData.userId} robohashUrl={authData.robohashUrl} size='h-12 w-12' />
                </div>
            </header>

            <div className="w-full max-w-6xl space-y-8">
                <FunFactBanner />
                
                <div className="bg-gray-800 p-4 rounded-xl shadow-xl flex justify-between items-center border border-indigo-700/50">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-400">Pairs Found:</span>
                        <span className="text-xl font-bold text-green-400">{solvedPairs} / {TOTAL_PAIRS}</span>
                    </div>
                    <div className="text-3xl font-mono bg-gray-900 px-4 py-1 rounded-lg text-red-400 shadow-inner">
                        {formatTime(roundTime)}
                    </div>
                    <GameButton onClick={fetchImage} className="bg-gray-600 hover:bg-gray-500" disabled={isLocked}>
                        New Game
                    </GameButton>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Matching Game */}
                    <div className="col-span-1 min-h-[500px]">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-300">Matching Challenge</h2>
                        <div className="p-4 bg-gray-800 rounded-xl shadow-2xl border border-indigo-700/50 aspect-square">
                            <MatchingGame 
                                cards={cards} 
                                onCardClick={handleCardClick}
                                isLocked={isLocked || isGameSolved}
                                isSolved={isGameSolved}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Game Info & Hint Trigger */}
                    <div className="col-span-1 p-4 bg-gray-800 rounded-xl shadow-2xl border border-indigo-700/50 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-300 mb-4">Game Information</h2>
                            
                            <p className="text-lg text-gray-300 mb-4">
                                Solve all {TOTAL_PAIRS} pairs as fast as possible!
                            </p>

                            <GameButton
                                onClick={() => setIsHintActive(true)}
                                className={`w-full mt-4 ${heartCountKeyUsed ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                                disabled={heartCountKeyUsed || isGameSolved}
                            >
                                {heartCountKeyUsed ? 'Heart Key Used' : 'Use Heart Count Hint'}
                            </GameButton>
                        </div>

                        {/* Display area for persistent feedback */}
                        {feedback && (
                            <div className={`mt-4 p-3 rounded-lg font-medium ${feedback.type === 'success' ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'}`}>
                                {feedback.message}
                            </div>
                        )}
                        
                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <h3 className="text-xl font-bold text-indigo-300 mb-2">Rules</h3>
                            <p className="text-sm text-gray-400">The **Heart Key** is a one-time use hint that requires counting the hearts in the image to instantly solve one pair on the board.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* HEART KEY MODAL (CONDITIONAL RENDERING) */}
            {isHintActive && !heartCountKeyUsed && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md border-2 border-red-500">
                        <h3 className="text-3xl font-bold text-red-400 mb-4">HEART COUNT KEY</h3>
                        <p className="text-gray-300 mb-4">
                            Count the hearts (❤️) in the image to automatically solve one pair.
                        </p>
                        
                        <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-center min-h-[12rem]">
                            <img 
                                src={imageSrc} 
                                alt="Heart Counting Challenge" 
                                className="max-h-48 w-auto object-contain rounded border border-gray-600"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/1f2937/f3f4f6?text=Image+Error"; }}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-400 mb-2">Number of Hearts</label>
                            <input
                                type="number"
                                min="0"
                                value={heartCount}
                                onChange={(e) => setHeartCount(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div className="flex justify-between space-x-4 mt-6">
                            <GameButton onClick={closeModal} className="bg-gray-600 hover:bg-gray-500 w-1/2">
                                Cancel
                            </GameButton>
                            <GameButton 
                                onClick={handleHeartKeySubmit} 
                                className="bg-red-600 hover:bg-red-700 w-1/2" 
                                disabled={heartCount === ''}
                            >
                                Submit Key
                            </GameButton>
                        </div>
                    </div>
                </div>
            )}
            {/* Game Solved Overlay (Unchanged) */}
            {isGameSolved && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40">
                    <div className="bg-green-900 p-10 rounded-xl text-center shadow-2xl border-4 border-green-500">
                        <h2 className="text-5xl font-extrabold text-green-300">VICTORY!</h2>
                        <p className="text-xl text-white mt-4">You solved the Memory Challenge in {formatTime(roundTime)}!</p>
                        <GameButton onClick={fetchImage} className="mt-6 bg-green-500 hover:bg-green-600">
                            Play Again
                        </GameButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameScreen;
