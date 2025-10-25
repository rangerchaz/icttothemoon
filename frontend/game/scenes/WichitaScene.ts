import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { gameStore } from '../GameStore';
import { INTERACT_DISTANCE } from '../config';

interface Landmark {
  name: string;
  x: number;
  y: number;
  color: number;
  size: number;
  description: string;
}

interface Collectible {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Rectangle;
}

export class WichitaScene extends Phaser.Scene {
  private player?: Player;
  private landmarks: Map<string, Phaser.GameObjects.Container> = new Map();
  private collectibles: Collectible[] = [];
  private interactKey?: Phaser.Input.Keyboard.Key;
  private uiText?: Phaser.GameObjects.Text;
  private objectiveText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'WichitaScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x88aa88).setOrigin(0);
    this.add.text(width / 2, 30, 'WICHITA, KANSAS', {
      fontSize: '32px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Create landmarks
    this.createLandmarks();

    // Create collectibles
    this.createCollectibles();

    // Create player
    this.player = new Player(this, width / 2, height / 2);

    // Setup interaction
    if (this.input.keyboard) {
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // UI Text for interactions
    this.uiText = this.add.text(width / 2, height - 100, '', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 15, y: 10 },
      align: 'center'
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    // Objectives display
    this.objectiveText = this.add.text(20, 80, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 10 }
    }).setDepth(100);

    this.updateObjectivesDisplay();

    // Subscribe to store changes
    gameStore.subscribe(() => {
      this.updateObjectivesDisplay();
    });
  }

  update(): void {
    if (!this.player) return;

    this.player.update();

    // Check for nearby interactions
    this.checkInteractions();

    // Check if objectives are complete
    const state = gameStore.getState();
    if (state.objectives.every(obj => obj.completed)) {
      this.uiText?.setText('Press E to launch to the moon!').setVisible(true);
      if (this.interactKey?.isDown) {
        gameStore.startLaunch();
        this.scene.start('LaunchScene');
      }
    }
  }

  private createLandmarks(): void {
    const landmarkData: Landmark[] = [
      {
        name: 'Keeper of the Plains',
        x: 600,
        y: 200,
        color: 0xaa6633,
        size: 60,
        description: 'The iconic statue overlooking the Arkansas River'
      },
      {
        name: 'Century II',
        x: 300,
        y: 300,
        color: 0x6666aa,
        size: 80,
        description: 'Convention center - Meet Commander Sarah'
      },
      {
        name: 'Old Town',
        x: 800,
        y: 400,
        color: 0xaa8844,
        size: 100,
        description: 'Historic shopping district - Collect supplies here'
      },
      {
        name: 'Exploration Place',
        x: 400,
        y: 600,
        color: 0x4488aa,
        size: 90,
        description: 'Science museum - Meet your crew'
      },
      {
        name: 'Wichita Airport',
        x: 900,
        y: 650,
        color: 0x888888,
        size: 100,
        description: 'Launch site - Return here when ready'
      }
    ];

    landmarkData.forEach(landmark => {
      const container = this.add.container(landmark.x, landmark.y);

      // Building shape
      const building = this.add.rectangle(0, 0, landmark.size, landmark.size, landmark.color);
      container.add(building);

      // Label
      const label = this.add.text(0, -landmark.size / 2 - 20, landmark.name, {
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffffcc',
        padding: { x: 5, y: 3 }
      }).setOrigin(0.5);
      container.add(label);

      this.landmarks.set(landmark.name, container);
      (container as any).landmarkData = landmark;
    });
  }

  private createCollectibles(): void {
    const items = [
      { id: 'blueprints', name: 'Moonbase Blueprints', x: 750, y: 380 },
      { id: 'food', name: 'Food Rations', x: 820, y: 420 },
      { id: 'comms', name: 'Communication Equipment', x: 850, y: 380 }
    ];

    items.forEach(item => {
      const sprite = this.add.rectangle(item.x, item.y, 20, 20, 0xffff00);
      sprite.setStrokeStyle(2, 0xff0000);
      this.collectibles.push({ ...item, sprite });
    });
  }

  private checkInteractions(): void {
    if (!this.player || !this.uiText) return;

    const playerPos = this.player.getPosition();
    let nearestInteraction: string | null = null;
    let minDistance: number = INTERACT_DISTANCE;

    // Check landmarks
    this.landmarks.forEach((container, name) => {
      const distance = Phaser.Math.Distance.Between(
        playerPos.x, playerPos.y,
        container.x, container.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestInteraction = `landmark:${name}`;
      }
    });

    // Check collectibles
    this.collectibles.forEach(item => {
      if (!item.sprite) return;
      const distance = Phaser.Math.Distance.Between(
        playerPos.x, playerPos.y,
        item.x, item.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestInteraction = `collect:${item.id}`;
      }
    });

    // Update UI
    if (nearestInteraction) {
      if (nearestInteraction.startsWith('landmark:')) {
        const landmarkName = nearestInteraction.replace('landmark:', '');
        this.uiText.setText(`Press E to interact with ${landmarkName}`).setVisible(true);

        if (this.interactKey?.isDown) {
          this.handleLandmarkInteraction(landmarkName);
        }
      } else if (nearestInteraction.startsWith('collect:')) {
        const itemId = nearestInteraction.replace('collect:', '');
        const item = this.collectibles.find(c => c.id === itemId);
        if (item) {
          this.uiText.setText(`Press E to collect ${item.name}`).setVisible(true);

          if (this.interactKey?.isDown) {
            this.collectItem(itemId);
          }
        }
      }
    } else {
      this.uiText.setVisible(false);
    }
  }

  private handleLandmarkInteraction(landmarkName: string): void {
    const state = gameStore.getState();

    switch (landmarkName) {
      case 'Century II':
        if (!state.objectives.find(o => o.id === 'talk-commander')?.completed) {
          gameStore.completeObjective('talk-commander');
          gameStore.addEvent('Met Commander Sarah at Century II');
          this.showMessage('Commander Sarah: "Welcome to the mission! Collect supplies and meet your crew."');
        }
        break;

      case 'Exploration Place':
        if (!state.objectives.find(o => o.id === 'visit-museum')?.completed) {
          gameStore.completeObjective('visit-museum');
          gameStore.addEvent('Met the crew at Exploration Place');
          this.showMessage('You meet your AI crew members: Mike, Lisa, Ace, and Jamie!');
        }
        break;

      case 'Wichita Airport':
        const suppliesCollected = state.inventory.length >= 3;
        const commanderTalked = state.objectives.find(o => o.id === 'talk-commander')?.completed;
        const museumVisited = state.objectives.find(o => o.id === 'visit-museum')?.completed;

        if (suppliesCollected && commanderTalked && museumVisited) {
          gameStore.completeObjective('launch');
          this.showMessage('All objectives complete! Ready for launch!');
        } else {
          this.showMessage('Complete all objectives before launching.');
        }
        break;
    }

    // Reset interact key
    if (this.interactKey) {
      this.interactKey.isDown = false;
    }
  }

  private collectItem(itemId: string): void {
    const item = this.collectibles.find(c => c.id === itemId);
    if (!item) return;

    if (!gameStore.hasItem(itemId)) {
      gameStore.addItem({
        id: itemId,
        name: item.name,
        description: `Collected at Old Town`
      });

      item.sprite?.destroy();
      item.sprite = undefined;

      this.showMessage(`Collected: ${item.name}`);

      const state = gameStore.getState();
      if (state.inventory.length >= 3) {
        gameStore.completeObjective('collect-supplies');
      }
    }

    // Reset interact key
    if (this.interactKey) {
      this.interactKey.isDown = false;
    }
  }

  private showMessage(text: string): void {
    const { width, height } = this.cameras.main;
    const message = this.add.text(width / 2, height / 2, text, {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 15 },
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5).setDepth(200);

    this.time.delayedCall(3000, () => {
      message.destroy();
    });
  }

  private updateObjectivesDisplay(): void {
    if (!this.objectiveText) return;

    const state = gameStore.getState();
    const lines = ['OBJECTIVES:'];

    state.objectives.forEach(obj => {
      const status = obj.completed ? '[✓]' : '[ ]';
      lines.push(`${status} ${obj.description}`);
    });

    lines.push('');
    lines.push(`SUPPLIES: ${state.inventory.length}/3`);

    this.objectiveText.setText(lines.join('\n'));
  }
}
