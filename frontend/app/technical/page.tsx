"use client";

import { useRouter } from "next/navigation";

export default function Technical() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>

        <h1 className="text-5xl font-bold mb-8">Technical Documentation</h1>

        {/* Overview */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-400">Project Overview</h2>
          <p className="text-lg leading-relaxed mb-4">
            <strong>Wichita to the Moon</strong> is an AI-powered browser-based game that combines
            Wichita landmarks with lunar colonization gameplay. The game features fully interactive
            AI crew members powered by Anthropic's Claude API, providing dynamic, context-aware
            dialogue that affects gameplay outcomes.
          </p>
          <div className="bg-gray-800 p-4 rounded">
            <strong>Challenge Submission:</strong> ICT to the Moon Challenge #2 - AI-Powered Video Game
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-green-400">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Frontend</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Next.js 14</strong> - React framework with App Router</li>
                <li><strong>TypeScript</strong> - Type-safe development</li>
                <li><strong>Phaser 3</strong> - 2D game engine (v3.80.1)</li>
                <li><strong>Tailwind CSS</strong> - UI styling</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Backend</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Node.js + Express</strong> - REST API server</li>
                <li><strong>Anthropic SDK</strong> - Claude API integration</li>
                <li><strong>ES Modules</strong> - Modern JavaScript</li>
                <li><strong>CORS</strong> - Cross-origin resource sharing</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-purple-400">System Architecture</h2>

          <h3 className="text-xl font-semibold mb-3">Component Structure</h3>
          <div className="bg-gray-900 p-4 rounded font-mono text-sm overflow-x-auto mb-6">
            <pre>{`wichita-moon-game/
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── game/page.tsx      # Main game container
│   │   ├── instructions/      # How to play
│   │   └── technical/         # This page
│   ├── components/
│   │   ├── GameCanvas.tsx     # Phaser wrapper
│   │   ├── DialogueBox.tsx    # AI NPC conversations
│   │   └── HUD.tsx            # Resource display
│   └── game/
│       ├── scenes/
│       │   ├── MenuScene.ts
│       │   ├── WichitaScene.ts
│       │   ├── LaunchScene.ts
│       │   └── MoonbaseScene.ts
│       ├── entities/
│       │   └── Player.ts
│       ├── GameStore.ts       # State management
│       ├── config.ts          # Game constants
│       └── types.ts           # TypeScript definitions
└── backend/
    └── src/
        ├── routes/
        │   └── npc.js         # API endpoints
        ├── services/
        │   └── anthropic.js   # Claude integration
        ├── data/
        │   └── npcs.json      # NPC configurations
        └── server.js          # Express app`}</pre>
          </div>

          <h3 className="text-xl font-semibold mb-3">Data Flow</h3>
          <div className="bg-gray-800 p-4 rounded">
            <ol className="space-y-3">
              <li><strong>1. Game State Management:</strong> GameStore maintains centralized state with observer pattern</li>
              <li><strong>2. Player Interaction:</strong> Phaser scenes handle gameplay, React components handle UI</li>
              <li><strong>3. AI Dialogue:</strong> Frontend → Backend API → Claude API → Response with effects</li>
              <li><strong>4. State Updates:</strong> API responses trigger state changes that affect gameplay</li>
            </ol>
          </div>
        </section>

        {/* AI Integration */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">AI Integration Deep Dive</h2>

          <h3 className="text-xl font-semibold mb-3">How AI NPCs Work</h3>
          <p className="mb-4">
            Each crew member is powered by Claude 3.5 Sonnet with a unique personality system prompt
            and trait configuration. The AI receives context about the current game state and conversation
            history to provide relevant, in-character responses.
          </p>

          <h3 className="text-xl font-semibold mb-3">NPC Configuration Example</h3>
          <div className="bg-gray-900 p-4 rounded font-mono text-sm overflow-x-auto mb-6">
            <pre>{`{
  "id": "commander-sarah",
  "name": "Commander Sarah Chen",
  "role": "Mission Commander",
  "personality": "Authoritative but fair...",
  "systemPrompt": "You are Commander Sarah Chen...",
  "traits": {
    "optimism": 0.7,
    "risk_tolerance": 0.5,
    "technical": 0.6
  }
}`}</pre>
          </div>

          <h3 className="text-xl font-semibold mb-3">Context-Aware Prompting</h3>
          <p className="mb-4">
            Every API request includes:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li>• <strong>NPC Personality:</strong> System prompt with role and traits</li>
            <li>• <strong>Game State:</strong> Current phase, resources, day, events</li>
            <li>• <strong>Conversation History:</strong> Last 5-10 exchanges</li>
            <li>• <strong>Player Message:</strong> What the player just said</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Dynamic Effects</h3>
          <p className="mb-4">
            AI responses are analyzed for:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <strong>Morale Changes</strong>
              <p className="text-sm text-gray-400 mt-2">
                Positive/negative keywords affect crew morale, weighted by NPC optimism trait
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <strong>Action Suggestions</strong>
              <p className="text-sm text-gray-400 mt-2">
                NPCs can suggest building specific modules or checking resources
              </p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-cyan-400">API Endpoints</h2>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">GET</span>
                <code className="text-green-400">/api/npc</code>
              </div>
              <p className="text-sm">Returns all NPC configurations</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">GET</span>
                <code className="text-green-400">/api/npc/:id</code>
              </div>
              <p className="text-sm">Returns specific NPC by ID</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-600 px-2 py-1 rounded text-xs font-bold">POST</span>
                <code className="text-green-400">/api/npc/chat</code>
              </div>
              <p className="text-sm mb-3">Generate AI response from NPC</p>
              <div className="bg-gray-900 p-3 rounded font-mono text-xs overflow-x-auto">
                <pre>{`Request Body:
{
  "npcId": "commander-sarah",
  "playerMessage": "What should we build first?",
  "gameState": {
    "phase": "moonbase",
    "oxygen": 75,
    "power": 50,
    ...
  },
  "conversationHistory": [...]
}

Response:
{
  "npcId": "commander-sarah",
  "npcName": "Commander Sarah Chen",
  "npcResponse": "Good question...",
  "moodChange": 5,
  "suggestion": {
    "action": "build_habitat",
    "priority": "high"
  }
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Game Mechanics */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-red-400">Game Mechanics</h2>

          <h3 className="text-xl font-semibold mb-3">Resource System</h3>
          <div className="bg-gray-800 p-4 rounded mb-4">
            <ul className="space-y-2">
              <li>• Resources decay at different rates (oxygen 0.5%/s, power 0.3%/s, etc.)</li>
              <li>• Modules affect resource generation/consumption</li>
              <li>• Habitat modules produce oxygen to counter decay</li>
              <li>• Building costs resources and takes in-game time</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mb-3">Time System</h3>
          <div className="bg-gray-800 p-4 rounded mb-4">
            <ul className="space-y-2">
              <li>• One moon day = 60 seconds real time</li>
              <li>• Resources decay every second</li>
              <li>• Must survive 5 days to win</li>
              <li>• Events can occur each day</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mb-3">Module Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-900 bg-opacity-50 p-3 rounded">
              <strong>Habitat (30 resources)</strong>
              <p className="text-sm text-gray-300">Produces oxygen over time</p>
            </div>
            <div className="bg-orange-900 bg-opacity-50 p-3 rounded">
              <strong>Lab (25 resources)</strong>
              <p className="text-sm text-gray-300">+10% morale boost</p>
            </div>
            <div className="bg-green-900 bg-opacity-50 p-3 rounded">
              <strong>Communications (20 resources)</strong>
              <p className="text-sm text-gray-300">+15% morale boost</p>
            </div>
            <div className="bg-yellow-900 bg-opacity-50 p-3 rounded">
              <strong>Storage (15 resources)</strong>
              <p className="text-sm text-gray-300">+20 build resources</p>
            </div>
          </div>
        </section>

        {/* Wichita Integration */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-orange-400">Wichita Integration</h2>
          <p className="mb-4">
            The game prominently features real Wichita landmarks and aerospace heritage:
          </p>
          <ul className="space-y-2 ml-6">
            <li>• <strong>Keeper of the Plains</strong> - Iconic statue and starting location</li>
            <li>• <strong>Century II</strong> - Mission briefing location</li>
            <li>• <strong>Old Town</strong> - Supply gathering area</li>
            <li>• <strong>Exploration Place</strong> - Science museum, crew meeting point</li>
            <li>• <strong>Wichita Dwight D. Eisenhower Airport</strong> - Launch site</li>
            <li>• <strong>Spirit AeroSystems</strong> - Referenced in NPC backstory</li>
            <li>• <strong>Cessna/Beechcraft</strong> - Referenced in dialogue and lore</li>
          </ul>
        </section>

        {/* Deployment */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-pink-400">Deployment</h2>

          <h3 className="text-xl font-semibold mb-3">Environment Setup</h3>
          <div className="bg-gray-900 p-4 rounded font-mono text-sm overflow-x-auto mb-4">
            <pre>{`# Backend .env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app

# Frontend .env.local
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_GAME_TITLE="Wichita to the Moon"`}</pre>
          </div>

          <h3 className="text-xl font-semibold mb-3">Recommended Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded">
              <strong className="text-blue-400">Frontend: Vercel</strong>
              <p className="text-sm text-gray-400 mt-2">
                Next.js optimized hosting with automatic deployments
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <strong className="text-purple-400">Backend: Railway/Render</strong>
              <p className="text-sm text-gray-400 mt-2">
                Easy Node.js hosting with environment variable management
              </p>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-green-400">Performance Optimizations</h2>
          <ul className="space-y-2 ml-6">
            <li>• <strong>Dynamic Imports:</strong> Phaser loaded only on game page to reduce initial bundle</li>
            <li>• <strong>Observer Pattern:</strong> Efficient state updates without unnecessary re-renders</li>
            <li>• <strong>Conversation Caching:</strong> Store maintains history to avoid redundant API calls</li>
            <li>• <strong>Object Pooling:</strong> Phaser reuses game objects for better memory management</li>
            <li>• <strong>Fallback Responses:</strong> Graceful degradation when API is unavailable</li>
          </ul>
        </section>

        {/* Future Enhancements */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-purple-400">Future Enhancements</h2>
          <ul className="space-y-2 ml-6">
            <li>• Multiplayer support with real-time collaboration</li>
            <li>• More complex resource chains (water, minerals, etc.)</li>
            <li>• Random events driven by AI (solar storms, discoveries)</li>
            <li>• Achievement system with Wichita-themed unlockables</li>
            <li>• Save/load game progress to database</li>
            <li>• Voice synthesis for NPC dialogue</li>
            <li>• More Wichita landmarks and expanded city exploration</li>
            <li>• Procedurally generated moon terrain</li>
          </ul>
        </section>

        {/* Credits */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Credits & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Game Development</h3>
              <ul className="text-sm space-y-1 text-gray-400">
                <li>Phaser 3 Game Engine</li>
                <li>Next.js by Vercel</li>
                <li>React 18</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Technology</h3>
              <ul className="text-sm space-y-1 text-gray-400">
                <li>Claude 3.5 Sonnet by Anthropic</li>
                <li>Anthropic SDK</li>
                <li>Context-aware prompting</li>
                <li>Dynamic personality system</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p>Built for the ICT to the Moon Challenge</p>
            <p className="text-sm mt-2">Showcasing Wichita's aerospace heritage through interactive AI gameplay</p>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => router.push('/game')}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-lg transition-colors"
          >
            Try the Game!
          </button>
        </div>
      </div>
    </div>
  );
}
