import React from 'react';

/**
 * Matching Pair Card Component
 */
const Card = ({ value, flipped, matched, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            w-full h-full aspect-[1/1] rounded-xl shadow-2xl transition-transform duration-500 transform perspective-1000
            ${!matched ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-default opacity-0'}
            ${matched ? 'scale-0' : 'scale-100'}
        `}
        // CRITICAL: Apply rotation to show the front (value) when flipped
        style={{ 
            transformStyle: 'preserve-3d', 
            transitionProperty: 'transform, opacity, background-color',
            transform: `rotateY(${flipped ? 180 : 0}deg)`
        }}
    >
        {/* FRONT FACE (Value/Emoji): Rotated 180deg permanently */}
        <div className="absolute inset-0 backface-hidden flex items-center justify-center text-5xl text-white font-bold bg-indigo-500 rounded-xl"
             style={{ transform: 'rotateY(180deg)' }}>
            {value}
        </div>
        {/* BACK FACE (Heart Icon): Rotated 0deg permanently */}
        <div className="absolute inset-0 backface-hidden flex items-center justify-center text-4xl text-indigo-400 font-bold bg-gray-700 rounded-xl"
             style={{ transform: 'rotateY(0deg)' }}>
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        </div>
    </div>
);

/**
 * Card Matching Game Container Component
 */
const MatchingGame = ({ 
    cards, 
    onCardClick, 
    isLocked, 
    isSolved, 
}) => {
    return (
        <div className="w-full h-full aspect-[1/1] flex items-center justify-center">
            {isSolved ? (
                <div className="text-center p-8 bg-green-900/40 rounded-xl">
                    <h3 className="text-4xl font-extrabold text-green-400">CHALLENGE COMPLETE!</h3>
                    <p className="text-xl text-gray-300 mt-2">All pairs found.</p>
                </div>
            ) : (
                // 4x4 Grid for 16 cards
                <div className="grid grid-cols-4 grid-rows-4 gap-3 md:gap-4 w-full h-full max-w-xl mx-auto">
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            value={card.value}
                            // Card is flipped if the user flipped it, or if it has been automatically matched (by the key)
                            flipped={card.flipped || card.matched} 
                            matched={card.matched}
                            onClick={() => !isLocked && onCardClick(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchingGame;
