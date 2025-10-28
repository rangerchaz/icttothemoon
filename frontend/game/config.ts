import Phaser from 'phaser';

export const getGameConfig = () => ({
  width: 1200,
  height: 800,
  backgroundColor: '#000000',
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade' as const,
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
});

// Game constants
export const PLAYER_SPEED = 200;
export const INTERACT_DISTANCE = 150; // Increased for easier landmark interaction

// Resource constants
export const INITIAL_RESOURCES = {
  oxygen: 100,
  power: 100,
  food: 100,
  morale: 100
};

export const RESOURCE_DECAY = {
  oxygen: 0.5, // per second
  power: 0.3,
  food: 0.2,
  morale: 0.1
};

export const MOON_DAY_DURATION = 60000; // 60 seconds in milliseconds

// Module costs
export const MODULE_COSTS = {
  habitat: { resources: 30, time: 5000 },
  lab: { resources: 25, time: 4000 },
  communications: { resources: 20, time: 3000 },
  storage: { resources: 15, time: 2000 }
};

// Win/lose conditions
export const WIN_CONDITIONS = {
  minModules: 4,
  minDays: 5,
  minMorale: 50
};

export const LOSE_CONDITIONS = {
  oxygenMin: 0,
  powerMin: 0,
  moraleMin: 0
};
