import React, { useState, useEffect, useCallback } from 'react';
import GameButton from '../components/GameButton';
import RoboHashAvatar from '../components/RoboHashAvatar';
import FunFactBanner from '../components/FunFactBanner';
import { fetchWithRetry } from '../utils/api';
import { supabase } from "../supabaseClient"; 

/**
 * Leaderboard screen component
 * Displays global rankings with virtual identities
 */
const LeaderboardScreen = ({ setScreen, authData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
    
      //  Fetch leaderboard data from Supabase
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false }) // highest first


       if (error) throw error;

       //Map leaderboard entries + assign rank + robohash avatar
     const formatted = data.map((row, index) => ({
        rank: index + 1,
        username: row.username,
        score: row.score,
        time: row.time ?? "—",
        robohashUrl: `https://robohash.org/${row.user_id}.png?set=set2`,
        isCurrentUser: row.user_id === authData.userId
      }));

      setLeaderboard(formatted);
    } catch (error) {
      console.error('Leaderboard Fetch Error:', error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [authData.userId, authData.robohashUrl]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 mb-8">
        <GameButton 
          onClick={() => setScreen('game')} 
          className="bg-gray-700 hover:bg-gray-600"
        >
          <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
          Back to Game
        </GameButton>
        
        <h1 className="text-4xl font-extrabold text-indigo-400">
          Global Leaderboard
        </h1>
        
        <RoboHashAvatar 
          userId={authData.userId} 
          robohashUrl={authData.robohashUrl} 
          size='h-12 w-12' 
        />
      </header>

      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-indigo-700/50">
        {loading ? (
          <div className="p-8 text-center text-indigo-400">
            Loading Leaderboard...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboard.map((player) => (
                <tr 
                  key={player.rank} 
                  className={`transition-all duration-200 ${
                    player.isCurrentUser 
                      ? 'bg-indigo-900/40 font-bold text-indigo-300' 
                      : 'hover:bg-gray-700 text-gray-100'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {player.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-3">
                    <RoboHashAvatar 
                      userId={player.userId} 
                      robohashUrl={player.robohashUrl} 
                      size='h-8 w-8' 
                    />
                    <span>
                      {player.username} {player.isCurrentUser && '(You)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {player.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                    {player.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <FunFactBanner />
      </div>
    </div>
  );
};

export default LeaderboardScreen;