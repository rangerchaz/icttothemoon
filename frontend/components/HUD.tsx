"use client";

import { useEffect, useState } from 'react';
import { gameStore } from '../game/GameStore';
import { GameState } from '../game/types';

export default function HUD() {
  const [gameState, setGameState] = useState<GameState>(gameStore.getState());

  useEffect(() => {
    const unsubscribe = gameStore.subscribe((state) => {
      setGameState(state);
    });

    return () => unsubscribe();
  }, []);

  if (gameState.phase === 'wichita' || gameState.phase === 'launch') {
    return null; // HUD only shown on moonbase
  }

  const getResourceColor = (value: number): string => {
    if (value > 60) return 'text-green-400';
    if (value > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResourceBgColor = (value: number): string => {
    if (value > 60) return 'bg-green-600';
    if (value > 30) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="bg-black bg-opacity-80 text-white p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Day and Objectives */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xl font-bold">
              MOON DAY: {gameState.day}
            </div>
            <div className="text-sm text-gray-300">
              Modules: {gameState.modulesBuilt.length} |
              Objectives: {gameState.objectives.filter(o => o.completed).length}/{gameState.objectives.length}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-4 gap-4">
            {/* Oxygen */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">OXYGEN</span>
                <span className={`text-sm font-bold ${getResourceColor(gameState.oxygen)}`}>
                  {Math.round(gameState.oxygen)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getResourceBgColor(gameState.oxygen)}`}
                  style={{ width: `${Math.max(0, Math.min(100, gameState.oxygen))}%` }}
                />
              </div>
            </div>

            {/* Power */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">POWER</span>
                <span className={`text-sm font-bold ${getResourceColor(gameState.power)}`}>
                  {Math.round(gameState.power)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getResourceBgColor(gameState.power)}`}
                  style={{ width: `${Math.max(0, Math.min(100, gameState.power))}%` }}
                />
              </div>
            </div>

            {/* Food */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">FOOD</span>
                <span className={`text-sm font-bold ${getResourceColor(gameState.food)}`}>
                  {Math.round(gameState.food)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getResourceBgColor(gameState.food)}`}
                  style={{ width: `${Math.max(0, Math.min(100, gameState.food))}%` }}
                />
              </div>
            </div>

            {/* Morale */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">MORALE</span>
                <span className={`text-sm font-bold ${getResourceColor(gameState.morale)}`}>
                  {Math.round(gameState.morale)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getResourceBgColor(gameState.morale)}`}
                  style={{ width: `${Math.max(0, Math.min(100, gameState.morale))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Events */}
          {gameState.recentEvents.length > 0 && (
            <div className="mt-3 text-xs text-gray-400">
              Latest: {gameState.recentEvents[gameState.recentEvents.length - 1]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
