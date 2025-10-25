# Setup Guide - Wichita to the Moon

## Quick Setup

### 1. Install Dependencies

Both frontend and backend dependencies are already installed!

### 2. Configure API Key

**IMPORTANT:** You need an Anthropic API key for the AI crew to work.

Edit `backend/.env` and add your API key:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

Get a free API key at: https://console.anthropic.com/

### 3. Start the Servers

**Option A: Using Scripts (Recommended)**

In two separate terminals:

Terminal 1 (Backend):
```bash
./start-backend.sh
# or
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
./start-frontend.sh
# or
cd frontend && npm run dev
```

**Option B: Windows**

Terminal 1 (Backend):
```cmd
cd backend
npm run dev
```

Terminal 2 (Frontend):
```cmd
cd frontend
npm run dev
```

### 4. Play the Game!

Open your browser and navigate to:
```
http://localhost:3000
```

## Troubleshooting

### Backend won't start
- Check that `ANTHROPIC_API_KEY` is set in `backend/.env`
- Make sure port 3001 is not in use
- Check `backend/node_modules` exists (run `npm install` in backend folder)

### Frontend won't start
- Check that `NEXT_PUBLIC_API_URL` is set in `frontend/.env.local`
- Make sure port 3000 is not in use
- Check `frontend/node_modules` exists (run `npm install` in frontend folder)

### Game won't load
- Make sure BOTH backend and frontend servers are running
- Check browser console for errors (F12)
- Verify backend is running at http://localhost:3001/health

### AI crew not responding
- Verify your Anthropic API key is correct in `backend/.env`
- Check backend terminal for error messages
- Make sure you have API credits remaining

## Next Steps

1. Read the **How to Play** guide at http://localhost:3000/instructions
2. Check out the **Technical Documentation** at http://localhost:3000/technical
3. Start your mission at http://localhost:3000/game

## Project Structure

```
wichita-moon-game/
├── frontend/          # Next.js + Phaser game
│   ├── app/          # Pages (home, game, instructions, technical)
│   ├── components/   # React components (HUD, DialogueBox)
│   └── game/         # Phaser game logic
│       ├── scenes/   # Game scenes
│       └── entities/ # Game objects
├── backend/          # Express + Claude API
│   └── src/
│       ├── routes/   # API endpoints
│       ├── services/ # AI integration
│       └── data/     # NPC configurations
└── README.md         # Full documentation
```

## Development

- Frontend runs on port 3000
- Backend runs on port 3001
- Hot reload enabled for both
- Changes to code will automatically refresh

## Deployment

See README.md for deployment instructions to Vercel (frontend) and Railway/Render (backend).

Enjoy your mission to the moon! 🚀🌙
