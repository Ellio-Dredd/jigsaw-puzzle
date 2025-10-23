import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import GameScreen from './screens/GameScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

/**
 * Main application component
 * Manages screen navigation and authentication state
 */
const App = () => {
  const [screen, setScreen] = useState('game'); // 'login', 'game', 'leaderboard'
  const [authData, setAuthData] = useState({
    token: null,
    userId: 'guestuser',
    robohashUrl: null,
  });

  // Navigate to game screen when authenticated
  useEffect(() => {
    if (authData.token && screen === 'login') {
      setScreen('game');
    } 
    // else if (!authData.token && screen !== 'login') {
    //   setScreen('login');
    // }

  }, [authData.token, screen]);

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return (
          <LoginScreen 
            setScreen={setScreen} 
            setAuthData={setAuthData} 
          />
        );
      case 'game':
        return (
          <GameScreen 
            setScreen={setScreen} 
            authData={authData} 
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen 
            setScreen={setScreen} 
            authData={authData} 
          />
        );
      default:
        return (
          <LoginScreen 
            setScreen={setScreen} 
            setAuthData={setAuthData} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {renderScreen()}
    </div>
  );
};

export default App;