export interface GameState {
  phase: 'wichita' | 'launch' | 'moonbase';
  oxygen: number;
  power: number;
  food: number;
  morale: number;
  day: number;
  inventory: InventoryItem[];
  modulesBuilt: string[];
  objectives: Objective[];
  recentEvents: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise: string[];
  systemPrompt: string;
  traits: {
    optimism: number;
    risk_tolerance: number;
    technical: number;
  };
  avatar: string;
  x?: number;
  y?: number;
  scene?: string;
}

export interface ConversationMessage {
  speaker: 'player' | 'npc';
  npcName?: string;
  message: string;
  timestamp: string;
}

export interface DialogueResponse {
  npcId: string;
  npcName: string;
  npcResponse: string;
  moodChange: number;
  suggestion?: {
    action: string;
    priority: string;
  };
  timestamp: string;
}

export interface Module {
  type: 'habitat' | 'lab' | 'communications' | 'storage';
  x: number;
  y: number;
  built: boolean;
  buildProgress: number;
}
