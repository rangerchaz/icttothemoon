"use client";

import dynamic from 'next/dynamic';
import HUD from '@/components/HUD';
import DialogueBox from '@/components/DialogueBox';

// Dynamically import GameCanvas to avoid SSR issues with Phaser
const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="text-4xl mb-4">Loading Game...</div>
        <div className="text-xl text-gray-400">Preparing for launch</div>
      </div>
    </div>
  )
});

export default function GamePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GameCanvas />
      <HUD />
      <DialogueBox />
    </div>
  );
}
