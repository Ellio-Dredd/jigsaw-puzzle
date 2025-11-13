
export const ROBOHASH_BASE_URL = "https://robohash.org/";
export const JOKE_API_URL = "https://official-joke-api.appspot.com/random_joke";

// Mock Auth Data (Necessary for the header and score logic)
export const MOCK_AUTH_DATA = { 
    userId: "test_solver_123", 
    token: "mock-jwt-token",
    robohashUrl: ROBOHASH_BASE_URL + "test_solver_123?set=set1"
};

// Mock Leaderboard Data (used in the LeaderboardScreen component)
export const MOCK_LEADERBOARD = [
    { id: 1, userId: "elite_solver", score: 9850, time: 25, robohashUrl: ROBOHASH_BASE_URL + "elite_solver?set=set3" },
    { id: 2, userId: "cipher_punk", score: 9210, time: 31, robohashUrl: ROBOHASH_BASE_URL + "cipher_punk?set=set2" },
    { id: 3, userId: "fast_hands", score: 8700, time: 45, robohashUrl: ROBOHASH_BASE_URL + "fast_hands?set=set4" },
];