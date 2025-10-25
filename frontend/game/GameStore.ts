import { GameState, InventoryItem, Objective, ConversationMessage } from './types';
import { INITIAL_RESOURCES } from './config';

class GameStore {
  private state: GameState;
  private conversationHistory: ConversationMessage[] = [];
  private listeners: Set<(state: GameState) => void> = new Set();

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    return {
      phase: 'wichita',
      ...INITIAL_RESOURCES,
      day: 1,
      inventory: [],
      modulesBuilt: ['landing'],
      objectives: [
        {
          id: 'talk-commander',
          description: 'Talk to Commander at Century II',
          completed: false,
          required: true
        },
        {
          id: 'collect-supplies',
          description: 'Collect 3 supply items from Old Town',
          completed: false,
          required: true
        },
        {
          id: 'visit-museum',
          description: 'Visit Exploration Place',
          completed: false,
          required: true
        },
        {
          id: 'launch',
          description: 'Return to airport for launch',
          completed: false,
          required: true
        }
      ],
      recentEvents: []
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  setState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // Inventory methods
  addItem(item: InventoryItem): void {
    this.setState({
      inventory: [...this.state.inventory, item]
    });
  }

  hasItem(itemId: string): boolean {
    return this.state.inventory.some(item => item.id === itemId);
  }

  removeItem(itemId: string): void {
    this.setState({
      inventory: this.state.inventory.filter(item => item.id !== itemId)
    });
  }

  // Objectives methods
  completeObjective(objectiveId: string): void {
    const objectives = this.state.objectives.map(obj =>
      obj.id === objectiveId ? { ...obj, completed: true } : obj
    );
    this.setState({ objectives });
  }

  areRequiredObjectivesComplete(): boolean {
    return this.state.objectives
      .filter(obj => obj.required)
      .every(obj => obj.completed);
  }

  // Resources methods
  updateResource(resource: keyof Pick<GameState, 'oxygen' | 'power' | 'food' | 'morale'>, delta: number): void {
    const newValue = Math.max(0, Math.min(100, this.state[resource] + delta));
    this.setState({ [resource]: newValue } as Partial<GameState>);
  }

  // Modules methods
  addModule(moduleType: string): void {
    if (!this.state.modulesBuilt.includes(moduleType)) {
      this.setState({
        modulesBuilt: [...this.state.modulesBuilt, moduleType]
      });
    }
  }

  // Events methods
  addEvent(event: string): void {
    const recentEvents = [...this.state.recentEvents, event].slice(-5); // Keep last 5
    this.setState({ recentEvents });
  }

  // Conversation methods
  addConversation(message: ConversationMessage): void {
    this.conversationHistory.push(message);
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  getConversationHistory(npcId?: string): ConversationMessage[] {
    if (npcId) {
      return this.conversationHistory.filter(msg =>
        msg.speaker === 'player' || msg.npcName === npcId
      );
    }
    return [...this.conversationHistory];
  }

  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  // Phase transitions
  startLaunch(): void {
    this.setState({ phase: 'launch' });
  }

  startMoonbase(): void {
    this.setState({
      phase: 'moonbase',
      objectives: [
        {
          id: 'build-habitat',
          description: 'Build Habitat Module',
          completed: false,
          required: true
        },
        {
          id: 'build-lab',
          description: 'Build Laboratory Module',
          completed: false,
          required: true
        },
        {
          id: 'build-comms',
          description: 'Build Communications Module',
          completed: false,
          required: true
        },
        {
          id: 'build-storage',
          description: 'Build Storage Module',
          completed: false,
          required: true
        },
        {
          id: 'survive',
          description: 'Survive 5 Moon Days',
          completed: false,
          required: true
        }
      ]
    });
  }

  // Reset game
  reset(): void {
    this.state = this.getInitialState();
    this.conversationHistory = [];
    this.notifyListeners();
  }
}

export const gameStore = new GameStore();
