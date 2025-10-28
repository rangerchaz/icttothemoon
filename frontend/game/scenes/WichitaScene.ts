import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Zombie } from '../entities/Zombie';
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
  sprite?: Phaser.GameObjects.Container;
}

export class WichitaScene extends Phaser.Scene {
  private player?: Player;
  private landmarks: Map<string, Phaser.GameObjects.Container> = new Map();
  private collectibles: Collectible[] = [];
  private zombies: Zombie[] = [];
  private interactKey?: Phaser.Input.Keyboard.Key;
  private uiText?: Phaser.GameObjects.Text;
  private objectiveText?: Phaser.GameObjects.Text;
  private healthText?: Phaser.GameObjects.Text;
  private playerHealth: number = 100;
  private lastZombieHitTime: number = 0;
  private interactionIndicators: Map<string, Phaser.GameObjects.Arc> = new Map();

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

    // Health display
    this.healthText = this.add.text(width - 20, 80, 'Health: 100', {
      fontSize: '16px',
      color: '#ff0000',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 10 }
    }).setOrigin(1, 0).setDepth(100);

    // Spawn zombies around landmarks
    this.spawnZombies();

    // Subscribe to store changes
    gameStore.subscribe(() => {
      this.updateObjectivesDisplay();
    });
  }

  update(): void {
    if (!this.player) return;

    this.player.update();

    // Update zombies
    this.zombies.forEach(zombie => {
      zombie.update(this.player?.sprite);
    });

    // Check zombie collisions
    this.checkZombieCollisions();

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

    // Check if player is dead
    if (this.playerHealth <= 0) {
      this.gameOver();
    }
  }

  private createLandmarks(): void {
    // Keeper of the Plains - 44ft steel statue on stone platform
    this.createKeeperOfThePlains(600, 200);

    // Century II - Round building with blue dome
    this.createCenturyII(300, 300);

    // Old Town - Historic brick warehouses
    this.createOldTown(800, 400);

    // Exploration Place - Modern curved science museum
    this.createExplorationPlace(400, 600);

    // Eisenhower Airport - Wing-shaped terminal
    this.createEisenhowerAirport(900, 650);
  }

  private createKeeperOfThePlains(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Stone platform (30ft rock promontory) - beige/tan
    const platform = this.add.ellipse(0, 20, 70, 35, 0xc9b18a);
    platform.setStrokeStyle(2, 0x9d8866);
    container.add(platform);

    // Statue base - darker stone
    const base = this.add.rectangle(0, 10, 30, 25, 0x8b7355);
    container.add(base);

    // Statue body - Cor-Ten steel (rust brown)
    const body = this.add.rectangle(0, -10, 20, 35, 0xa0522d);
    container.add(body);

    // Statue head
    const head = this.add.circle(0, -30, 8, 0xa0522d);
    container.add(head);

    // Raised arms (hands to the sky)
    const leftArm = this.add.rectangle(-12, -18, 5, 25, 0xa0522d);
    leftArm.setAngle(-30);
    container.add(leftArm);

    const rightArm = this.add.rectangle(12, -18, 5, 25, 0xa0522d);
    rightArm.setAngle(30);
    container.add(rightArm);

    // Ring of Fire - small fire pots around platform
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const fireX = Math.cos(angle) * 40;
      const fireY = Math.sin(angle) * 20 + 20;
      const fire = this.add.circle(fireX, fireY, 3, 0xff6600);
      fire.setAlpha(0.8);
      container.add(fire);
    }

    // Label
    const label = this.add.text(0, -60, 'Keeper of the Plains', {
      fontSize: '14px',
      color: '#000000',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);
    container.add(label);

    this.landmarks.set('Keeper of the Plains', container);
    (container as any).landmarkData = {
      name: 'Keeper of the Plains',
      x, y,
      description: 'The iconic 44ft statue overlooking the Arkansas River'
    };
  }

  private createCenturyII(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Frank Lloyd Wright style base - buff/sand colored (wheat fields)
    const base = this.add.ellipse(0, 0, 95, 85, 0xd4af7a);
    base.setStrokeStyle(3, 0xb8935a);
    container.add(base);

    // Inner ring
    const innerRing = this.add.ellipse(0, 0, 75, 65, 0xe0c59c);
    container.add(innerRing);

    // Blue dome (Kansas sky) - pale blue
    const dome = this.add.ellipse(0, -10, 80, 40, 0x87ceeb);
    dome.setStrokeStyle(2, 0x6baed6);
    container.add(dome);

    // Highlight on dome for dimension
    const domeHighlight = this.add.ellipse(-10, -15, 30, 15, 0xadd8e6, 0.6);
    container.add(domeHighlight);

    // Windows/pillars suggestion
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const pillarX = Math.cos(angle) * 35;
      const pillarY = Math.sin(angle) * 30;
      const pillar = this.add.rectangle(pillarX, pillarY, 4, 12, 0xc9b18a);
      container.add(pillar);
    }

    // Label
    const label = this.add.text(0, -60, 'Century II', {
      fontSize: '14px',
      color: '#000000',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);
    container.add(label);

    this.landmarks.set('Century II', container);
    (container as any).landmarkData = {
      name: 'Century II',
      x, y,
      description: 'Convention center - Meet Commander Sarah'
    };
  }

  private createOldTown(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Multiple brick warehouse buildings
    const buildings = [
      { x: -35, y: 0, w: 35, h: 50 },
      { x: 0, y: -5, w: 40, h: 60 },
      { x: 35, y: 5, w: 30, h: 45 }
    ];

    buildings.forEach(bldg => {
      // Main brick building - red brick color
      const building = this.add.rectangle(bldg.x, bldg.y, bldg.w, bldg.h, 0x8b4513);
      building.setStrokeStyle(2, 0x654321);
      container.add(building);

      // Brick texture lines
      for (let i = 0; i < 5; i++) {
        const line = this.add.rectangle(
          bldg.x,
          bldg.y - bldg.h/2 + (i * bldg.h/5),
          bldg.w - 2,
          1,
          0x654321
        );
        container.add(line);
      }

      // Limestone accents at top
      const limestone = this.add.rectangle(bldg.x, bldg.y - bldg.h/2, bldg.w, 6, 0xddc8a0);
      container.add(limestone);

      // Windows
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          const windowX = bldg.x - 10 + col * 20;
          const windowY = bldg.y - 15 + row * 15;
          const window = this.add.rectangle(windowX, windowY, 8, 10, 0x4a4a4a);
          container.add(window);
        }
      }
    });

    // Historic lamppost
    const lampBase = this.add.rectangle(-50, 30, 4, 25, 0x2f2f2f);
    container.add(lampBase);
    const lampTop = this.add.circle(-50, 15, 6, 0xffcc00, 0.7);
    container.add(lampTop);

    // Label
    const label = this.add.text(0, -70, 'Old Town', {
      fontSize: '14px',
      color: '#000000',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);
    container.add(label);

    this.landmarks.set('Old Town', container);
    (container as any).landmarkData = {
      name: 'Old Town',
      x, y,
      description: 'Historic shopping district - Collect supplies here'
    };
  }

  private createExplorationPlace(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Water/pond around building - light blue
    const water = this.add.ellipse(0, 15, 120, 60, 0x5f9ea0, 0.6);
    container.add(water);

    // Modern curved "landside" pavilion - glass and steel
    const landside = this.add.ellipse(-25, 0, 50, 55, 0xc0c0c0);
    landside.setStrokeStyle(3, 0x696969);
    container.add(landside);

    // Glass panels effect
    for (let i = 0; i < 4; i++) {
      const glassPanel = this.add.rectangle(-25, -20 + i * 12, 45, 10, 0xe6f3ff, 0.7);
      container.add(glassPanel);
    }

    // "Island" pavilion - curved toroid shape
    const island = this.add.ellipse(30, 5, 60, 50, 0xa9a9a9);
    island.setStrokeStyle(3, 0x696969);
    container.add(island);

    // Curved roof form (convex/concave geometry)
    const roofCurve1 = this.add.arc(-25, -30, 30, 0, 180, false, 0x4682b4);
    roofCurve1.setStrokeStyle(2, 0x36648b);
    container.add(roofCurve1);

    const roofCurve2 = this.add.arc(30, -25, 35, 0, 180, false, 0x5f9ea0);
    roofCurve2.setStrokeStyle(2, 0x4a7c7e);
    container.add(roofCurve2);

    // More glass windows on island
    for (let i = 0; i < 4; i++) {
      const glassPanel = this.add.rectangle(30, -15 + i * 10, 50, 8, 0xe6f3ff, 0.7);
      container.add(glassPanel);
    }

    // Bridging walkway
    const bridge = this.add.rectangle(2, 0, 40, 8, 0x808080);
    container.add(bridge);

    // Label
    const label = this.add.text(0, -65, 'Exploration Place', {
      fontSize: '14px',
      color: '#000000',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);
    container.add(label);

    this.landmarks.set('Exploration Place', container);
    (container as any).landmarkData = {
      name: 'Exploration Place',
      x, y,
      description: 'Science museum - Meet your crew'
    };
  }

  private createEisenhowerAirport(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Main terminal building - modern glass and steel
    const terminal = this.add.rectangle(0, 10, 100, 45, 0xd3d3d3);
    terminal.setStrokeStyle(2, 0x989898);
    container.add(terminal);

    // Swooping wing-shaped roof
    const roofPoints = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const px = (t - 0.5) * 100;
      // Parabolic curve to create wing sweep
      const py = -30 - Math.pow(t - 0.5, 2) * 40;
      roofPoints.push(px, py);
    }
    // Complete the shape
    roofPoints.push(50, 10);
    roofPoints.push(-50, 10);

    const wingRoof = this.add.polygon(0, 0, roofPoints, 0x4169e1);
    wingRoof.setStrokeStyle(3, 0x1e3a8a);
    container.add(wingRoof);

    // Glass boarding bridges
    for (let i = 0; i < 3; i++) {
      const bridgeX = -30 + i * 30;
      const bridge = this.add.rectangle(bridgeX, 35, 15, 30, 0x87ceeb, 0.7);
      bridge.setStrokeStyle(1, 0x4682b4);
      container.add(bridge);
    }

    // Glass windows on terminal
    for (let i = 0; i < 8; i++) {
      const windowX = -40 + i * 11;
      const window = this.add.rectangle(windowX, 10, 9, 20, 0xe6f3ff, 0.8);
      container.add(window);
    }

    // Control tower
    const towerBase = this.add.rectangle(45, 0, 12, 30, 0xc0c0c0);
    container.add(towerBase);
    const towerTop = this.add.rectangle(45, -20, 20, 15, 0x696969);
    towerTop.setStrokeStyle(1, 0x505050);
    container.add(towerTop);

    // Runway markings suggestion
    const runway = this.add.rectangle(0, 55, 80, 8, 0x505050);
    container.add(runway);
    for (let i = 0; i < 5; i++) {
      const marking = this.add.rectangle(-30 + i * 15, 55, 10, 3, 0xffffff);
      container.add(marking);
    }

    // Label
    const label = this.add.text(0, -70, 'Eisenhower Airport', {
      fontSize: '14px',
      color: '#000000',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);
    container.add(label);

    this.landmarks.set('Wichita Dwight D. Eisenhower National Airport', container);
    (container as any).landmarkData = {
      name: 'Wichita Dwight D. Eisenhower National Airport',
      x, y,
      description: 'Launch site - Return here when ready'
    };
  }

  private createCollectibles(): void {
    // Blueprints - scrolled papers
    const blueprintsSprite = this.createBlueprintSprite(750, 380);
    this.collectibles.push({ id: 'blueprints', name: 'Moonbase Blueprints', x: 750, y: 380, sprite: blueprintsSprite });

    // Food Rations - crate/box
    const foodSprite = this.createFoodCrateSprite(820, 420);
    this.collectibles.push({ id: 'food', name: 'Food Rations', x: 820, y: 420, sprite: foodSprite });

    // Communication Equipment - radio/device
    const commsSprite = this.createCommsEquipmentSprite(850, 380);
    this.collectibles.push({ id: 'comms', name: 'Communication Equipment', x: 850, y: 380, sprite: commsSprite });
  }

  private createBlueprintSprite(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Rolled paper - light blue tint
    const paper = this.add.rectangle(0, 0, 20, 28, 0x87ceeb);
    paper.setStrokeStyle(2, 0x4682b4);
    container.add(paper);

    // Grid lines to suggest blueprints
    for (let i = 0; i < 3; i++) {
      const line = this.add.rectangle(0, -8 + i * 8, 15, 1, 0x4682b4);
      container.add(line);
    }

    // Highlight/shine
    const shine = this.add.rectangle(-5, -10, 8, 8, 0xffffff, 0.4);
    container.add(shine);

    container.setDepth(5);
    return container;
  }

  private createFoodCrateSprite(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Wooden crate - brown
    const crate = this.add.rectangle(0, 0, 24, 24, 0x8b4513);
    crate.setStrokeStyle(2, 0x654321);
    container.add(crate);

    // Wood planks texture
    for (let i = 0; i < 3; i++) {
      const plank = this.add.rectangle(0, -8 + i * 8, 22, 2, 0x654321);
      container.add(plank);
    }

    // Metal bands
    const band1 = this.add.rectangle(0, -10, 24, 2, 0x808080);
    container.add(band1);
    const band2 = this.add.rectangle(0, 10, 24, 2, 0x808080);
    container.add(band2);

    container.setDepth(5);
    return container;
  }

  private createCommsEquipmentSprite(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Device body - dark gray
    const body = this.add.rectangle(0, 0, 22, 26, 0x505050);
    body.setStrokeStyle(2, 0x303030);
    container.add(body);

    // Screen - light blue/green
    const screen = this.add.rectangle(0, -5, 16, 10, 0x00ff00, 0.6);
    container.add(screen);

    // Antenna
    const antenna = this.add.rectangle(0, -18, 2, 10, 0xc0c0c0);
    container.add(antenna);
    const antennaTop = this.add.circle(0, -23, 3, 0xff6600);
    container.add(antennaTop);

    // Buttons/dials
    const button1 = this.add.circle(-5, 8, 2, 0xff0000);
    container.add(button1);
    const button2 = this.add.circle(0, 8, 2, 0x00ff00);
    container.add(button2);
    const button3 = this.add.circle(5, 8, 2, 0x0000ff);
    container.add(button3);

    container.setDepth(5);
    return container;
  }

  private checkInteractions(): void {
    if (!this.player || !this.uiText) return;

    const playerPos = this.player.getPosition();
    let nearestInteraction: string | null = null;
    let minDistance: number = INTERACT_DISTANCE;

    // Hide all interaction indicators first
    this.interactionIndicators.forEach(indicator => {
      indicator.setVisible(false);
    });

    // Check landmarks
    this.landmarks.forEach((container, name) => {
      const distance = Phaser.Math.Distance.Between(
        playerPos.x, playerPos.y,
        container.x, container.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestInteraction = `landmark:${name}`;

        // Show interaction indicator
        if (!this.interactionIndicators.has(name)) {
          const indicator = this.add.arc(container.x, container.y, 70, 0, 360, false, 0x00ff00, 0);
          indicator.setStrokeStyle(4, 0x00ff00, 0.8);
          indicator.setDepth(50);
          this.interactionIndicators.set(name, indicator);

          // Pulsing animation
          this.tweens.add({
            targets: indicator,
            alpha: 0.4,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
          });
        }
        this.interactionIndicators.get(name)?.setVisible(true);
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

        // Show interaction indicator for collectible
        const indicatorKey = `collect_${item.id}`;
        if (!this.interactionIndicators.has(indicatorKey)) {
          const indicator = this.add.arc(item.x, item.y, 30, 0, 360, false, 0xffff00, 0);
          indicator.setStrokeStyle(3, 0xffff00, 0.8);
          indicator.setDepth(50);
          this.interactionIndicators.set(indicatorKey, indicator);

          // Pulsing animation
          this.tweens.add({
            targets: indicator,
            alpha: 0.4,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1
          });
        }
        this.interactionIndicators.get(indicatorKey)?.setVisible(true);
      }
    });

    // Update UI
    if (nearestInteraction !== null) {
      const interaction: string = nearestInteraction;
      if (interaction.startsWith('landmark:')) {
        const landmarkName = interaction.replace('landmark:', '');
        this.uiText.setText(`Press E to interact with ${landmarkName}`).setVisible(true);

        if (this.interactKey?.isDown) {
          this.handleLandmarkInteraction(landmarkName);
        }
      } else if (interaction.startsWith('collect:')) {
        const itemId = interaction.replace('collect:', '');
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

      case 'Wichita Dwight D. Eisenhower National Airport':
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

      // Remove interaction indicator
      const indicatorKey = `collect_${itemId}`;
      const indicator = this.interactionIndicators.get(indicatorKey);
      if (indicator) {
        indicator.destroy();
        this.interactionIndicators.delete(indicatorKey);
      }

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

  private spawnZombies(): void {
    // Spawn zombies around each landmark to protect them
    const zombieSpawns = [
      // Around Keeper of the Plains
      { x: 560, y: 180, patrol: [{ x: 560, y: 180 }, { x: 640, y: 180 }, { x: 640, y: 220 }, { x: 560, y: 220 }] },
      { x: 620, y: 240, patrol: [{ x: 620, y: 240 }, { x: 580, y: 160 }] },

      // Around Century II
      { x: 260, y: 280, patrol: [{ x: 260, y: 280 }, { x: 340, y: 280 }, { x: 340, y: 320 }, { x: 260, y: 320 }] },
      { x: 320, y: 340, patrol: [{ x: 320, y: 340 }, { x: 280, y: 260 }] },

      // Around Old Town (where collectibles are)
      { x: 720, y: 360, patrol: [{ x: 720, y: 360 }, { x: 880, y: 360 }, { x: 880, y: 440 }, { x: 720, y: 440 }] },
      { x: 790, y: 400, patrol: [{ x: 790, y: 350 }, { x: 850, y: 400 }, { x: 790, y: 450 }] },
      { x: 840, y: 360, patrol: [{ x: 840, y: 340 }, { x: 870, y: 380 }] },

      // Around Exploration Place
      { x: 360, y: 580, patrol: [{ x: 360, y: 580 }, { x: 440, y: 580 }, { x: 440, y: 620 }, { x: 360, y: 620 }] },
      { x: 420, y: 640, patrol: [{ x: 420, y: 640 }, { x: 380, y: 560 }] },

      // Around Airport
      { x: 860, y: 630, patrol: [{ x: 860, y: 630 }, { x: 940, y: 630 }, { x: 940, y: 670 }, { x: 860, y: 670 }] },
      { x: 920, y: 690, patrol: [{ x: 920, y: 690 }, { x: 880, y: 610 }] }
    ];

    zombieSpawns.forEach(spawn => {
      const zombie = new Zombie(this, spawn.x, spawn.y, spawn.patrol);
      this.zombies.push(zombie);
    });
  }

  private checkZombieCollisions(): void {
    if (!this.player) return;

    const currentTime = this.time.now;

    this.zombies.forEach(zombie => {
      const distance = Phaser.Math.Distance.Between(
        this.player!.sprite.x,
        this.player!.sprite.y,
        zombie.sprite.x,
        zombie.sprite.y
      );

      // If zombie touches player, deal damage
      if (distance < 30 && currentTime - this.lastZombieHitTime > 1000) {
        this.playerHealth -= 10;
        this.lastZombieHitTime = currentTime;

        // Update health display
        if (this.healthText) {
          this.healthText.setText(`Health: ${this.playerHealth}`);

          // Flash red when damaged
          this.healthText.setColor(this.playerHealth > 50 ? '#ff0000' : '#ff0000');
          this.cameras.main.flash(100, 255, 0, 0, false);
        }

        // Knockback effect
        const angle = Phaser.Math.Angle.Between(
          zombie.sprite.x,
          zombie.sprite.y,
          this.player!.sprite.x,
          this.player!.sprite.y
        );
        const knockbackX = Math.cos(angle) * 200;
        const knockbackY = Math.sin(angle) * 200;
        this.player!.sprite.setVelocity(knockbackX, knockbackY);
      }
    });
  }

  private gameOver(): void {
    const { width, height } = this.cameras.main;

    // Stop player and zombies
    this.player?.sprite.setVelocity(0, 0);
    this.zombies.forEach(z => z.sprite.setVelocity(0, 0));

    // Game over overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0).setDepth(200);

    this.add.text(width / 2, height / 2 - 50, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(201);

    this.add.text(width / 2, height / 2 + 20, 'The zombies got you!', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(201);

    // Restart button
    const restartBtn = this.add.text(width / 2, height / 2 + 80, 'TRY AGAIN', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#ff0000',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      this.scene.restart();
    });
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
