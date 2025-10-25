"use client";

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';
import { MenuScene } from '../game/scenes/MenuScene';
import { WichitaScene } from '../game/scenes/WichitaScene';
import { LaunchScene } from '../game/scenes/LaunchScene';
import { MoonbaseScene } from '../game/scenes/MoonbaseScene';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...GAME_CONFIG,
      parent: containerRef.current,
      scene: [MenuScene, WichitaScene, LaunchScene, MoonbaseScene]
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="game-container"
      className="w-full h-screen flex items-center justify-center bg-black"
    />
  );
}
