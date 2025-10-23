import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithRetry } from '../utils/api';
import { JOKE_API_URL } from '../config';

/**
 * Fun fact banner component that fetches jokes from external API
 * Demonstrates interoperability and event-driven architecture
 */
const FunFactBanner = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJoke = useCallback(async () => {
    setLoading(true);
    setJoke(null);
    
    try {
      const data = await fetchWithRetry(JOKE_API_URL);
      const jokeText = data.setup && data.punchline 
        ? `${data.setup} - ${data.punchline}` 
        : data.joke;
      setJoke(jokeText);
    } catch (err) {
      console.error("Failed to fetch joke:", err);
      setJoke("Failed to fetch a fun fact. Guess the joke's on us! (Interoperability Demo)");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoke();
  }, [fetchJoke]);

  return (
    <div className="bg-gray-800 p-3 rounded-xl shadow-inner text-sm text-gray-300 transition-all duration-500 min-h-[4rem]">
      <h4 className="font-bold text-indigo-400 mb-1">FUN STATUS :</h4>
      {loading ? (
        <div className="flex items-center space-x-2">
          <svg 
            className="animate-spin h-4 w-4 text-indigo-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Fetching a laugh...</span>
        </div>
      ) : (
        <p>{joke}</p>
      )}
    </div>
  );
};

export default FunFactBanner;