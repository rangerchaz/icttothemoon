"use client";

import { useRouter } from "next/navigation";

export default function Instructions() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>

        <h1 className="text-5xl font-bold mb-8">How to Play</h1>

        {/* Story */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-400">The Story</h2>
          <p className="text-lg leading-relaxed">
            You've been selected for an experimental moon colonization program
            from Wichita, Kansas! Explore your hometown collecting supplies and
            meeting your AI-powered crew members, then launch to the moon to
            build humanity's first lunar outpost.
          </p>
        </section>

        {/* Controls */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-green-400">Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Movement</h3>
              <ul className="space-y-2">
                <li><span className="font-mono bg-gray-800 px-2 py-1 rounded">↑ ↓ ← →</span> Arrow Keys</li>
                <li><span className="font-mono bg-gray-800 px-2 py-1 rounded">W A S D</span> WASD Keys</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Actions</h3>
              <ul className="space-y-2">
                <li><span className="font-mono bg-gray-800 px-2 py-1 rounded">E</span> Interact</li>
                <li><span className="font-mono bg-gray-800 px-2 py-1 rounded">SPACE</span> Interact (alternative)</li>
                <li><span className="font-mono bg-gray-800 px-2 py-1 rounded">CLICK</span> Select modules on moon</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phase 1: Wichita */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">Phase 1: Wichita Exploration</h2>
          <h3 className="text-xl font-semibold mb-3">Objectives:</h3>
          <ul className="space-y-3 ml-6">
            <li className="flex items-start">
              <span className="mr-3">1.</span>
              <div>
                <strong>Talk to Commander at Century II</strong>
                <p className="text-gray-400">Get your mission briefing from Commander Sarah Chen</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3">2.</span>
              <div>
                <strong>Collect 3 Supplies from Old Town</strong>
                <p className="text-gray-400">Gather moonbase blueprints, food rations, and communication equipment</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3">3.</span>
              <div>
                <strong>Visit Exploration Place</strong>
                <p className="text-gray-400">Meet your AI crew members before the mission</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3">4.</span>
              <div>
                <strong>Return to Wichita Dwight D. Eisenhower National Airport</strong>
                <p className="text-gray-400">When all objectives are complete, launch to the moon!</p>
              </div>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Wichita Landmarks:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-800 p-3 rounded">
              <strong>Keeper of the Plains</strong>
              <p className="text-sm text-gray-400">Iconic statue - starting location</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong>Century II</strong>
              <p className="text-sm text-gray-400">Convention center - mission briefing</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong>Old Town</strong>
              <p className="text-sm text-gray-400">Shopping district - collect supplies</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong>Exploration Place</strong>
              <p className="text-sm text-gray-400">Science museum - meet crew</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong>Wichita Dwight D. Eisenhower National Airport</strong>
              <p className="text-sm text-gray-400">Launch site - depart for moon</p>
            </div>
          </div>
        </section>

        {/* Phase 2: Launch */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-red-400">Phase 2: Launch Sequence</h2>
          <p className="text-lg">
            Watch the cinematic countdown and launch sequence as you leave
            Wichita and travel through space to the moon. Sit back and enjoy
            the journey!
          </p>
        </section>

        {/* Phase 3: Moonbase */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-purple-400">Phase 3: Moonbase Management</h2>

          <h3 className="text-xl font-semibold mb-3">Objectives:</h3>
          <ul className="space-y-2 ml-6 mb-6">
            <li>Build all 4 module types: Habitat, Lab, Communications, Storage</li>
            <li>Survive 5 Moon Days</li>
            <li>Keep crew morale above 50%</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Resources to Manage:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-800 p-3 rounded">
              <strong className="text-blue-400">Oxygen</strong>
              <p className="text-sm text-gray-400">Depletes over time. Habitat modules produce oxygen.</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong className="text-yellow-400">Power</strong>
              <p className="text-sm text-gray-400">Needed for all systems. Modules consume power.</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong className="text-green-400">Food</strong>
              <p className="text-sm text-gray-400">Crew needs food to survive. Limited supply.</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <strong className="text-pink-400">Morale</strong>
              <p className="text-sm text-gray-400">Affected by crew conversations and progress.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Building Modules:</h3>
          <ul className="space-y-2 ml-6 mb-6">
            <li><strong className="text-blue-400">Habitat</strong> - Provides oxygen, essential for survival</li>
            <li><strong className="text-orange-400">Laboratory</strong> - Boosts morale, enables research</li>
            <li><strong className="text-green-400">Communications</strong> - Improves morale, contacts Earth</li>
            <li><strong className="text-yellow-400">Storage</strong> - Provides extra resources</li>
          </ul>

          <div className="bg-red-900 bg-opacity-30 border border-red-500 p-4 rounded">
            <strong className="text-red-400">⚠️ Warning:</strong>
            <p className="mt-2">Resources deplete over time. If oxygen, power, or morale reach zero, the mission fails!</p>
          </div>
        </section>

        {/* AI Crew */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-cyan-400">AI Crew Members</h2>
          <p className="mb-4">
            Talk to your AI-powered crew for advice, guidance, and morale boosts!
            Each crew member has a unique personality and expertise.
          </p>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold">🧑‍✈️ Commander Sarah Chen</h3>
              <p className="text-sm text-gray-400">Mission Commander - Leadership & Strategy</p>
              <p className="mt-2">Experienced leader focused on mission success. Ask her about priorities and planning.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold">👷 Engineer Mike Rodriguez</h3>
              <p className="text-sm text-gray-400">Chief Engineer - Technical Solutions</p>
              <p className="mt-2">Practical problem-solver from Spirit AeroSystems. Great for building and repair advice.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold">👩‍🔬 Dr. Lisa Park</h3>
              <p className="text-sm text-gray-400">Chief Scientist - Research & Analysis</p>
              <p className="mt-2">Curious scientist passionate about discovery. Talk to her about science and research goals.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold">🧑‍✈️ Ace Jackson</h3>
              <p className="text-sm text-gray-400">Pilot - Navigation & Quick Decisions</p>
              <p className="mt-2">Bold Cessna test pilot. Great for navigation and risk assessment.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold">⚕️ Dr. Jamie Torres</h3>
              <p className="text-sm text-gray-400">Medical Officer - Health & Safety</p>
              <p className="mt-2">Caring medic focused on crew wellbeing. Talk to Jamie about health and morale.</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-green-400">Tips for Success</h2>
          <ul className="space-y-2 ml-6">
            <li>✓ Build the Habitat module first - you need oxygen!</li>
            <li>✓ Talk to your AI crew regularly for advice and morale boosts</li>
            <li>✓ Each crew member has different expertise - ask the right person</li>
            <li>✓ Watch your resources carefully - they deplete over time</li>
            <li>✓ Storage modules give you extra building resources</li>
            <li>✓ Communication and Lab modules improve crew morale</li>
            <li>✓ Plan your builds strategically - resources are limited</li>
          </ul>
        </section>

        {/* Win/Lose */}
        <section className="mb-10 bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Win & Lose Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 bg-opacity-30 border border-green-500 p-4 rounded">
              <h3 className="text-xl font-semibold text-green-400 mb-3">✓ Victory Conditions</h3>
              <ul className="space-y-2">
                <li>• Build all 4 module types</li>
                <li>• Survive 5 Moon Days</li>
                <li>• Keep morale above 50%</li>
              </ul>
            </div>
            <div className="bg-red-900 bg-opacity-30 border border-red-500 p-4 rounded">
              <h3 className="text-xl font-semibold text-red-400 mb-3">✗ Failure Conditions</h3>
              <ul className="space-y-2">
                <li>• Oxygen reaches 0%</li>
                <li>• Power reaches 0%</li>
                <li>• Morale reaches 0%</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => router.push('/game')}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-lg transition-colors"
          >
            Start Your Mission!
          </button>
        </div>
      </div>
    </div>
  );
}
