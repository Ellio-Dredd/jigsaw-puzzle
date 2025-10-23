// API utility functions for making HTTP requests with retry logic

import { MAX_RETRIES, RETRY_DELAY_BASE } from '../config';

/**
 * Fetch with exponential backoff retry logic
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @returns {Promise} - Parsed JSON response
 */
export const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i < retries - 1) {
        const delay = (2 ** i) * RETRY_DELAY_BASE;
        console.warn(`Fetch failed for ${url}. Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error(`Fetch failed after ${retries} attempts: ${error.message}`);
      }
    }
  }
};

/**
 * Make authenticated API request
 * @param {string} url - The URL to fetch
 * @param {string} token - JWT token
 * @param {object} options - Additional fetch options
 * @returns {Promise} - Parsed JSON response
 */
export const authenticatedFetch = async (url, token, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  return fetchWithRetry(url, { ...options, headers });
};