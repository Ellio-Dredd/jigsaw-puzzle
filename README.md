# 🧩 Jigsaw Heart Game

A modular React application demonstrating low coupling, high cohesion, virtual identity, and interoperability principles through an interactive puzzle game.

## ✨ Features

- 🎯 **Jigsaw Puzzle Game** - Interactive puzzle-solving interface
- 🔢 **Counting Challenge** - Verify hearts and carrots in images
- 👤 **Virtual Identity** - RoboHash avatars for privacy
- 🏆 **Global Leaderboard** - Competitive rankings
- 🎭 **JWT Authentication** - Secure user sessions
- 🔗 **External API Integration** - Fun facts from joke API
- ⏱️ **Real-time Timer** - Track solving speed
- 📱 **Responsive Design** - Works on all devices

## 🏗️ Architecture

### Design Principles

- **Low Coupling**: Independent, reusable components
- **High Cohesion**: Single-responsibility modules
- **Virtual Identity**: Privacy-focused user representation
- **Interoperability**: Standardized API communication

### Tech Stack

- **Frontend**: React 18+
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **State Management**: React Hooks
- **API**: RESTful architecture

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm
- Backend API running (see backend setup)

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd jigsaw-heart-game

# Install dependencies
npm install

# Configure backend URL
# Edit src/config.js and set BACKEND_URL

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🗂️ Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── GameButton.jsx
│   ├── RoboHashAvatar.jsx
│   ├── FunFactBanner.jsx
│   ├── JigsawPuzzle.jsx
│   └── VerificationChallenge.jsx
├── screens/         # Screen components
│   ├── LoginScreen.jsx
│   ├── GameScreen.jsx
│   └── LeaderboardScreen.jsx
├── utils/           # Utility functions
│   ├── api.js
│   └── formatters.js
├── config.js        # Configuration
└── App.jsx          # Main app
```

## 🎮 How to Play

1. **Sign Up/Login** - Create an account or log in
2. **Solve Puzzle** - Complete the jigsaw puzzle
3. **Count Objects** - Enter the number of hearts and carrots
4. **Submit** - Get scored based on accuracy and time
5. **Compete** - Check the leaderboard for rankings

## 🔧 Configuration

Edit `src/config.js`:

```javascript
export const BACKEND_URL = "http://localhost:5000";
export const JOKE_API_URL = "https://official-joke-api.appspot.com/random_joke";
```

## 🧩 Component Usage

### GameButton

```javascript
import GameButton from './components/GameButton';

<GameButton 
  onClick={handleClick} 
  disabled={loading}
  className="custom-class"
>
  Button Text
</GameButton>
```

### RoboHashAvatar

```javascript
import RoboHashAvatar from './components/RoboHashAvatar';

<RoboHashAvatar 
  userId="user123" 
  robohashUrl={customUrl}
  size="h-12 w-12"
/>
```

### API Utilities

```javascript
import { fetchWithRetry, authenticatedFetch } from './utils/api';

// Basic fetch with retry
const data = await fetchWithRetry(url);

// Authenticated request
const result = await authenticatedFetch(url, token, {
  method: 'POST',
  body: JSON.stringify(payload)
});
```

## 🔐 Authentication Flow

1. User submits credentials to `/api/auth/login` or `/api/auth/register`
2. Backend validates and returns JWT token + user data
3. Token stored in React state (not localStorage)
4. Token sent in Authorization header for protected routes
5. Token expires after session ends

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to existing account

### Game
- `GET /api/game/new-round` - Fetch new puzzle
- `POST /api/game/submit-score` - Submit answer (requires auth)
- `GET /api/game/leaderboard` - Get rankings

## 🎨 Customization

### Styling
All components use Tailwind CSS. Modify classes directly in components or extend in your `tailwind.config.js`.

### Adding New Components
1. Create component in `src/components/`
2. Export default from component file
3. Import and use in screens

### Adding New Screens
1. Create screen in `src/screens/`
2. Add route in `App.jsx` `renderScreen()` function
3. Add navigation button in existing screens

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting

Upload `build/` directory to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Environment Variables

Create `.env` file:

```
REACT_APP_BACKEND_URL=https://your-backend.com
REACT_APP_JOKE_API_URL=https://official-joke-api.appspot.com/random_joke
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend allows requests from your frontend domain
- Check backend CORS configuration

### Image Loading Issues
- Verify Heart API is accessible
- Check network tab for failed requests
- Ensure proper HTTPS in production

### Authentication Failures
- Verify token is being sent correctly
- Check token hasn't expired
- Confirm backend JWT secret matches

### Component Not Rendering
- Check console for errors
- Verify all imports are correct
- Ensure props are passed correctly

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: yasaschamikara123@gmail.com

## 🎯 Roadmap

- [ ] Real jigsaw puzzle drag-and-drop functionality
- [ ] Multiplayer mode
- [ ] Achievement system
- [ ] Difficulty levels
- [ ] Custom puzzle upload
- [ ] Mobile app version

---

Made with ❤️  By Yasas Arandara 
