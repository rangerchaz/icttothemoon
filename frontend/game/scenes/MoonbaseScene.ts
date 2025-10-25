import Phaser from 'phaser';
import { gameStore } from '../GameStore';
import { Module } from '../types';
import { MODULE_COSTS, RESOURCE_DECAY, MOON_DAY_DURATION, WIN_CONDITIONS, LOSE_CONDITIONS } from '../config';

export class MoonbaseScene extends Phaser.Scene {
  private modules: Module[] = [];
  private dayTimer?: Phaser.Time.TimerEvent;
  private resourceTimer?: Phaser.Time.TimerEvent;
  private selectedModuleType: 'habitat' | 'lab' | 'communications' | 'storage' | null = null;
  private buildSlots: Phaser.GameObjects.Rectangle[] = [];
  private uiContainer?: Phaser.GameObjects.Container;

  // Resource tracking
  private resources: number = 100; // Generic build resources
  private currentDay: number = 1;

  // Event handlers
  private onStateChange?: () => void;

  constructor() {
    super({ key: 'MoonbaseScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Moon surface background
    this.add.rectangle(0, 0, width, height, 0x333333).setOrigin(0);
    this.createMoonCraters();
    this.createStarfield();

    // Landing module (starting point)
    this.createLandingModule(width / 2, height / 2);

    // Build slots
    this.createBuildSlots();

    // UI Setup
    this.createUI();

    // Start resource decay
    this.startResourceDecay();

    // Start day/night cycle
    this.startDayCycle();

    // Subscribe to state changes
    this.onStateChange = () => this.updateUI();
    gameStore.subscribe(this.onStateChange);

    // Initial UI update
    this.updateUI();

    // Welcome message
    this.showMessage('Welcome to the Moon! Build modules to survive.\nClick build slots to place modules.\nTalk to your AI crew for advice!');
  }

  private createMoonCraters(): void {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.Between(20, 60);
      this.add.circle(x, y, radius, 0x222222, 0.5);
    }
  }

  private createStarfield(): void {
    const { width } = this.cameras.main;

    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, 200);
      const size = Math.random() * 2;
      this.add.circle(x, y, size, 0xffffff, Math.random());
    }
  }

  private createLandingModule(x: number, y: number): void {
    const module = this.add.rectangle(x, y, 80, 80, 0xaaaaaa);
    this.add.text(x, y, 'LANDING\nMODULE', {
      fontSize: '12px',
      color: '#000000',
      align: 'center'
    }).setOrigin(0.5);
  }

  private createBuildSlots(): void {
    const { width, height } = this.cameras.main;
    const positions = [
      { x: width / 2 - 150, y: height / 2 },
      { x: width / 2 + 150, y: height / 2 },
      { x: width / 2, y: height / 2 - 150 },
      { x: width / 2, y: height / 2 + 150 },
      { x: width / 2 - 150, y: height / 2 - 150 },
      { x: width / 2 + 150, y: height / 2 + 150 }
    ];

    positions.forEach((pos, index) => {
      const slot = this.add.rectangle(pos.x, pos.y, 80, 80, 0x444444, 0.5);
      slot.setStrokeStyle(2, 0x888888, 0.8);
      slot.setInteractive({ useHandCursor: true });

      slot.on('pointerover', () => {
        slot.setFillStyle(0x666666, 0.7);
      });

      slot.on('pointerout', () => {
        slot.setFillStyle(0x444444, 0.5);
      });

      slot.on('pointerdown', () => {
        this.showBuildMenu(pos.x, pos.y, index);
      });

      this.buildSlots.push(slot);
    });
  }

  private showBuildMenu(x: number, y: number, slotIndex: number): void {
    // Check if slot already has a module
    if (this.modules.some(m => Math.abs(m.x - x) < 50 && Math.abs(m.y - y) < 50)) {
      this.showMessage('This slot already has a module!');
      return;
    }

    // Create build menu
    const menuBg = this.add.rectangle(x, y - 150, 180, 220, 0x000000, 0.9).setDepth(100);
    const menuTitle = this.add.text(x, y - 230, 'SELECT MODULE', {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(100);

    const moduleTypes: Array<'habitat' | 'lab' | 'communications' | 'storage'> = ['habitat', 'lab', 'communications', 'storage'];
    const buttons: Phaser.GameObjects.Container[] = [];

    moduleTypes.forEach((type, index) => {
      const btnY = y - 200 + index * 50;
      const cost = MODULE_COSTS[type].resources;
      const owned = gameStore.getState().modulesBuilt.includes(type);

      const btnBg = this.add.rectangle(x, btnY, 160, 40, owned ? 0x004400 : 0x444444);
      const btnText = this.add.text(x, btnY, `${type.toUpperCase()}\n(${cost} resources)`, {
        fontSize: '12px',
        color: this.resources >= cost ? '#00ff00' : '#ff0000',
        align: 'center'
      }).setOrigin(0.5);

      const button = this.add.container(x, btnY, [btnBg, btnText]).setDepth(100);
      button.setSize(160, 40);
      button.setInteractive({ useHandCursor: true });

      button.on('pointerover', () => {
        btnBg.setFillStyle(0x666666);
      });

      button.on('pointerout', () => {
        btnBg.setFillStyle(owned ? 0x004400 : 0x444444);
      });

      button.on('pointerdown', () => {
        this.buildModule(type, x, y, slotIndex);
        buttons.forEach(b => b.destroy());
        menuBg.destroy();
        menuTitle.destroy();
      });

      buttons.push(button);
    });

    // Close button
    const closeBtn = this.add.text(x, y - 30, 'CANCEL', {
      fontSize: '14px',
      color: '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      buttons.forEach(b => b.destroy());
      menuBg.destroy();
      menuTitle.destroy();
      closeBtn.destroy();
    });
  }

  private buildModule(type: 'habitat' | 'lab' | 'communications' | 'storage', x: number, y: number, slotIndex: number): void {
    const cost = MODULE_COSTS[type].resources;

    if (this.resources < cost) {
      this.showMessage('Not enough resources!');
      return;
    }

    this.resources -= cost;

    // Create module
    const colors = {
      habitat: 0x4488ff,
      lab: 0xff8844,
      communications: 0x44ff88,
      storage: 0xffff44
    };

    const moduleRect = this.add.rectangle(x, y, 80, 80, colors[type]);
    this.add.text(x, y, type.toUpperCase(), {
      fontSize: '12px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: 70 }
    }).setOrigin(0.5);

    // Add to game store
    gameStore.addModule(type);
    gameStore.completeObjective(`build-${type === 'communications' ? 'comms' : type}`);
    gameStore.addEvent(`Built ${type} module`);

    // Apply module effects
    this.applyModuleEffects(type);

    // Remove build slot
    this.buildSlots[slotIndex].destroy();

    this.showMessage(`${type.toUpperCase()} module built!`);
  }

  private applyModuleEffects(type: string): void {
    switch (type) {
      case 'habitat':
        // Habitat produces oxygen
        this.time.addEvent({
          delay: 1000,
          callback: () => {
            gameStore.updateResource('oxygen', 1);
          },
          loop: true
        });
        break;

      case 'lab':
        // Lab boosts morale
        gameStore.updateResource('morale', 10);
        break;

      case 'communications':
        // Comms boosts morale
        gameStore.updateResource('morale', 15);
        break;

      case 'storage':
        // Storage gives resources
        this.resources += 20;
        break;
    }
  }

  private createUI(): void {
    const { width, height } = this.cameras.main;

    this.uiContainer = this.add.container(0, 0).setDepth(90);

    // Top bar - resources
    const topBar = this.add.rectangle(0, 0, width, 60, 0x000000, 0.8).setOrigin(0);

    // Title
    const title = this.add.text(width / 2, 15, 'MOON BASE ALPHA', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    // Crew button
    const crewBtn = this.add.text(width - 150, 15, '👥 TALK TO CREW', {
      fontSize: '16px',
      color: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 10, y: 5 }
    }).setOrigin(0, 0).setInteractive({ useHandCursor: true });

    crewBtn.on('pointerover', () => {
      crewBtn.setStyle({ backgroundColor: '#005500' });
    });

    crewBtn.on('pointerout', () => {
      crewBtn.setStyle({ backgroundColor: '#003300' });
    });

    crewBtn.on('pointerdown', () => {
      this.openCrewDialogue();
    });

    this.uiContainer.add([topBar, title, crewBtn]);
  }

  private openCrewDialogue(): void {
    // This will trigger the React DialogueBox component
    const event = new CustomEvent('openDialogue', {
      detail: { scene: 'moonbase' }
    });
    window.dispatchEvent(event);
  }

  private updateUI(): void {
    // Update UI elements based on game state
    // This will be called when state changes
  }

  private startResourceDecay(): void {
    this.resourceTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        const state = gameStore.getState();

        // Decay resources
        gameStore.updateResource('oxygen', -RESOURCE_DECAY.oxygen);
        gameStore.updateResource('power', -RESOURCE_DECAY.power);
        gameStore.updateResource('food', -RESOURCE_DECAY.food);
        gameStore.updateResource('morale', -RESOURCE_DECAY.morale);

        // Check lose conditions
        if (state.oxygen <= LOSE_CONDITIONS.oxygenMin) {
          this.gameLost('Oxygen depleted!');
        } else if (state.power <= LOSE_CONDITIONS.powerMin) {
          this.gameLost('Power failure!');
        } else if (state.morale <= LOSE_CONDITIONS.moraleMin) {
          this.gameLost('Crew morale collapsed!');
        }
      },
      loop: true
    });
  }

  private startDayCycle(): void {
    this.dayTimer = this.time.addEvent({
      delay: MOON_DAY_DURATION,
      callback: () => {
        this.currentDay++;
        gameStore.setState({ day: this.currentDay });
        gameStore.addEvent(`Day ${this.currentDay} on the Moon`);

        this.showMessage(`Day ${this.currentDay}`);

        // Check win condition
        if (this.currentDay >= WIN_CONDITIONS.minDays) {
          this.checkWinCondition();
        }
      },
      loop: true
    });
  }

  private checkWinCondition(): void {
    const state = gameStore.getState();

    if (
      state.modulesBuilt.length >= WIN_CONDITIONS.minModules &&
      state.day >= WIN_CONDITIONS.minDays &&
      state.morale >= WIN_CONDITIONS.minMorale
    ) {
      this.gameWon();
    }
  }

  private gameWon(): void {
    // Stop timers
    this.dayTimer?.remove();
    this.resourceTimer?.remove();

    const { width, height } = this.cameras.main;

    // Victory screen
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.9).setOrigin(0).setDepth(200);

    this.add.text(width / 2, height / 2 - 100, 'MISSION SUCCESS!', {
      fontSize: '64px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(201);

    this.add.text(width / 2, height / 2, 'You established the first Wichita moonbase!', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(201);

    const restartBtn = this.add.text(width / 2, height / 2 + 100, 'PLAY AGAIN', {
      fontSize: '32px',
      color: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      gameStore.reset();
      this.scene.start('MenuScene');
    });
  }

  private gameLost(reason: string): void {
    // Stop timers
    this.dayTimer?.remove();
    this.resourceTimer?.remove();

    const { width, height } = this.cameras.main;

    // Game over screen
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.9).setOrigin(0).setDepth(200);

    this.add.text(width / 2, height / 2 - 100, 'MISSION FAILED', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(201);

    this.add.text(width / 2, height / 2, reason, {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(201);

    const restartBtn = this.add.text(width / 2, height / 2 + 100, 'TRY AGAIN', {
      fontSize: '32px',
      color: '#ff0000',
      backgroundColor: '#330000',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      gameStore.reset();
      this.scene.start('MenuScene');
    });
  }

  private showMessage(text: string): void {
    const { width } = this.cameras.main;

    const message = this.add.text(width / 2, 100, text, {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 },
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5).setDepth(150);

    this.time.delayedCall(3000, () => {
      message.destroy();
    });
  }

  shutdown(): void {
    if (this.onStateChange) {
      gameStore.subscribe(this.onStateChange)(); // Unsubscribe
    }
  }
}
