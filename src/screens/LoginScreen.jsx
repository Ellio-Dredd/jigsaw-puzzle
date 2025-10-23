import React, { useState } from 'react';
import GameButton from '../components/GameButton';
import { BACKEND_URL } from '../config';

/**
 * Login and signup screen component
 * Handles user authentication and virtual identity creation
 */
const LoginScreen = ({ setScreen, setAuthData }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin 
      ? { email, password } 
      : { username, email, password };

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      setAuthData({
        token: data.token,
        userId: data.userId,
        robohashUrl: data.robohashUrl,
      });
      setScreen('game');

    } catch (error) {
      setError(error.message);
      console.error('Auth Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md border border-indigo-700/50">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-400">
          {isLogin ? "Login" : "Sign Up"} to Play
        </h2>
        
        {error && (
          <div className="bg-red-900/40 text-red-300 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          
          <GameButton type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? "Login" : "Sign Up")}
          </GameButton>
        </form>
        
        <button
          onClick={toggleMode}
          className="mt-4 text-sm text-center w-full text-indigo-300 hover:text-indigo-400 transition-colors"
        >
          {isLogin 
            ? "Need an account? Sign Up" 
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;