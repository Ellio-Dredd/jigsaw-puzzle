// Utility functions for formatting data

/**
 * Format seconds into MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generate RoboHash URL
 * @param {string} userId - User identifier
 * @param {string} set - RoboHash set (default: set2)
 * @returns {string} - RoboHash URL
 */
export const generateRoboHashUrl = (userId, set = 'set2') => {
  return `https://robohash.org/${userId || 'guestuser'}?set=${set}`;
};