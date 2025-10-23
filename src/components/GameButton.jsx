import React from 'react';

/**
 * Reusable button component with consistent styling
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type (button, submit, reset)
 */
const GameButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button' 
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg
      ${disabled
        ? 'bg-gray-700 cursor-not-allowed opacity-50'
        : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-[1.02] active:scale-[0.98] shadow-indigo-500/50'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

export default GameButton;