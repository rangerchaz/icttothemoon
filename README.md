# Wichita to the Moon 🚀🌙

An AI-powered browser-based game featuring Wichita landmarks and intelligent NPCs powered by Anthropic's Claude API.

## 🎮 Game Overview

Explore Wichita, Kansas, collect supplies, meet your AI crew, then launch to the moon to build humanity's first lunar colony! Features:

- **3 Game Phases:** Wichita exploration → Launch sequence → Moonbase building
- **5 AI Crew Members:** Each with unique personalities powered by Claude 3.5 Sonnet
- **Real Wichita Landmarks:** Keeper of the Plains, Old Town, Exploration Place, and more
- **Dynamic Gameplay:** AI conversations affect mission outcomes
- **Resource Management:** Balance oxygen, power, food, and crew morale
- **Win/Lose Conditions:** Build modules, survive, and keep morale high

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd icttothemoon
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_GAME_TITLE="Wichita to the Moon"
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Play

### Phase 1: Wichita Exploration
- **Move:** Arrow keys or WASD
- **Interact:** E or Space
- **Objectives:**
  1. Talk to Commander at Century II
  2. Collect 3 supplies from Old Town
  3. Visit Exploration Place
  4. Return to airport for launch

### Phase 2: Launch Sequence
- Watch the cinematic rocket launch!

### Phase 3: Moonbase Building
- **Click build slots** to place modules
- **Talk to AI crew** for advice (click "TALK TO CREW" button)
- **Manage resources:** Oxygen, Power, Food, Morale
- **Build modules:** Habitat, Lab, Communications, Storage
- **Win conditions:**
  - Build all 4 module types
  - Survive 5 Moon Days
  - Keep morale above 50%

## 🤖 AI Crew Members

Each crew member has a unique personality and expertise:

- **👨‍✈️ Commander Sarah Chen** - Mission leadership and strategy
- **👷 Engineer Mike Rodriguez** - Technical solutions and building
- **👩‍🔬 Dr. Lisa Park** - Research and scientific analysis
- **👨‍✈️ Ace Jackson** - Navigation and risk assessment
- **⚕️ Dr. Jamie Torres** - Medical care and crew wellbeing

Talk to them for advice, morale boosts, and mission guidance!

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Phaser 3** for game engine
- **Tailwind CSS** for styling

### Backend
- **Node.js + Express** REST API
- **Anthropic SDK** for Claude AI integration
- **ES Modules** modern JavaScript

## 📁 Project Structure

```
wichita-moon-game/
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components (HUD, DialogueBox)
│   └── game/            # Phaser game logic
│       ├── scenes/      # Game scenes
│       ├── entities/    # Game entities
│       └── GameStore.ts # State management
└── backend/
    └── src/
        ├── routes/      # API routes
        ├── services/    # Claude AI service
        └── data/        # NPC configurations
```

## 🔧 Development

### Backend API Endpoints

- `GET /api/npc` - Get all NPCs
- `GET /api/npc/:id` - Get specific NPC
- `POST /api/npc/chat` - Generate AI response

### Environment Variables

#### Backend
- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

#### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)
- `NEXT_PUBLIC_GAME_TITLE` - Game title

## 🚢 Deployment

### Option 1: DigitalOcean App Platform (Recommended) ⭐

**Easiest deployment - Production ready in 5 minutes!**

```bash
# 1. Push to GitHub (already done!)
# 2. Create app at https://cloud.digitalocean.com/apps
# 3. Connect your GitHub repo
# 4. Add environment variable: ANTHROPIC_API_KEY
# 5. Deploy!
```

**Cost:** $5/month • Auto-SSL • Auto-scaling • Zero-ops

See [DEPLOY_DO_SIMPLE.md](DEPLOY_DO_SIMPLE.md) for step-by-step guide.

### Option 2: Docker Droplet (More Control)

**Quick Deploy:**

```bash
# On your DigitalOcean droplet
git clone https://github.com/rangerchaz/icttothemoon.git
cd icttothemoon

# Create .env file
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Build and run
./build-and-run.sh

# Access at http://YOUR_DROPLET_IP:8080
```

**Cost:** $6-12/month for complete control

### Option 3: Local Docker

```bash
# Create .env
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Build and run
docker build -t wichita-moon-game .
docker run -d -p 8080:8080 --env-file .env wichita-moon-game

# Access at http://localhost:8080
```

## 🎨 Game Features

### Wichita Integration
- **Keeper of the Plains** - Starting location
- **Century II** - Mission briefing
- **Old Town** - Supply gathering
- **Exploration Place** - Crew meeting
- **Wichita Dwight D. Eisenhower National Airport** - Launch site
- References to Spirit AeroSystems, Cessna, Beechcraft

### AI Features
- Context-aware dialogue based on game state
- Dynamic personality traits (optimism, risk tolerance, technical expertise)
- Morale effects from conversations
- Actionable suggestions from NPCs
- Conversation history tracking

### Resource Management
- **Oxygen** - Depletes over time, produced by Habitat
- **Power** - Consumed by modules
- **Food** - Limited supply
- **Morale** - Affected by crew conversations and progress

## 🏆 Win/Lose Conditions

### Victory
✓ Build all 4 module types
✓ Survive 5 Moon Days
✓ Keep morale above 50%

### Failure
✗ Oxygen reaches 0%
✗ Power reaches 0%
✗ Morale reaches 0%

## 📝 License

This project was created for the ICT to the Moon Challenge.

## 🙏 Credits

- **Game Engine:** Phaser 3
- **AI:** Anthropic Claude 3.5 Sonnet
- **Framework:** Next.js by Vercel
- **Styling:** Tailwind CSS

---

**Built with ❤️ for Wichita's aerospace heritage**

*Challenge Submission: ICT to the Moon #2 - AI-Powered Video Game*
