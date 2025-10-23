import React from 'react';
import { generateRoboHashUrl } from '../utils/formatters';

/**
 * RoboHash avatar component for virtual identity display
 * @param {object} props - Component props
 * @param {string} props.robohashUrl - Custom RoboHash URL
 * @param {string} props.userId - User ID for fallback generation
 * @param {string} props.size - Tailwind size class (default: 'h-16 w-16')
 */
const RoboHashAvatar = ({ robohashUrl, userId, size = 'h-16 w-16' }) => {
  const src = robohashUrl || generateRoboHashUrl(userId);
  
  return (
    <img
      src={src}
      alt="RoboHash Avatar"
      className={`rounded-full border-4 border-indigo-400 object-cover ${size}`}
    />
  );
};

export default RoboHashAvatar;