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
    const { width, height} = this.cameras.main;

    // Space background - black
    this.add.rectangle(0, 0, width, height * 0.3, 0x000000).setOrigin(0);

    // Realistic starfield
    this.createRealisticStarfield();

    // Earth visible in distance
    this.createEarthInSky(200, 100);

    // Moon surface with gradient and texture
    this.createMoonSurface(width, height);

    // Detailed craters
    this.createMoonCraters();

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

  private createMoonSurface(width: number, height: number): void {
    // Main moon surface - gray gradient
    const surface = this.add.graphics();
    surface.fillGradientStyle(0x696969, 0x696969, 0x505050, 0x505050, 1);
    surface.fillRect(0, height * 0.3, width, height * 0.7);

    // Surface texture - random lighter/darker patches
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(height * 0.3, height);
      const size = Phaser.Math.Between(40, 100);
      const color = Phaser.Math.Between(0, 1) > 0.5 ? 0x787878 : 0x606060;
      surface.fillStyle(color, 0.3);
      surface.fillEllipse(x, y, size, size * 0.6);
    }

    // Dust particles
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(height * 0.3, height);
      this.add.circle(x, y, 0.5, 0x888888, 0.4);
    }
  }

  private createMoonCraters(): void {
    const { width, height } = this.cameras.main;

    // Large craters with realistic details
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(height * 0.35, height);
      const radius = Phaser.Math.Between(30, 80);

      // Crater depression - darker
      const crater = this.add.circle(x, y, radius, 0x4a4a4a, 0.6);

      // Crater rim - lighter
      const rim = this.add.circle(x - radius * 0.2, y - radius * 0.2, radius * 0.9, 0x808080, 0.3);

      // Central peak (some craters have these)
      if (Phaser.Math.Between(0, 1) > 0.5 && radius > 50) {
        this.add.circle(x, y, radius * 0.2, 0x787878, 0.5);
      }
    }

    // Small impact craters
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(height * 0.35, height);
      const radius = Phaser.Math.Between(10, 25);
      this.add.circle(x, y, radius, 0x3a3a3a, 0.4);
    }
  }

  private createRealisticStarfield(): void {
    const { width, height } = this.cameras.main;

    // Distant stars - no atmosphere on moon so stars are always visible
    for (let i = 0; i < 400; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height * 0.3);
      const star = this.add.circle(x, y, Math.random() * 1.2, 0xffffff, Math.random() * 0.8 + 0.2);
      star.setDepth(-1);
    }

    // Bright stars
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height * 0.3);
      const star = this.add.circle(x, y, 1.5, 0xffffff, 0.9);
      star.setDepth(-1);
    }
  }

  private createEarthInSky(x: number, y: number): void {
    // Earth visible from moon
    const earthSize = 60;

    // Earth base
    const earth = this.add.circle(x, y, earthSize, 0x1e90ff);
    earth.setDepth(-1);

    // Continents
    const continent1 = this.add.ellipse(x - 15, y - 10, 30, 25, 0x228b22, 0.8);
    continent1.setDepth(-1);
    const continent2 = this.add.ellipse(x + 20, y + 15, 25, 20, 0x2e8b57, 0.8);
    continent2.setDepth(-1);

    // Clouds
    for (let i = 0; i < 6; i++) {
      const cloudX = x + Phaser.Math.Between(-50, 50);
      const cloudY = y + Phaser.Math.Between(-50, 50);
      const cloud = this.add.ellipse(cloudX, cloudY, 12, 8, 0xffffff, 0.5);
      cloud.setDepth(-1);
    }

    // Atmosphere glow
    const atmosphere = this.add.circle(x, y, earthSize + 5, 0x87ceeb, 0.2);
    atmosphere.setDepth(-1);
  }

  private createLandingModule(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Landing legs (4 legs)
    const legPositions = [
      { x: -45, y: 30, angle: -30 },
      { x: 45, y: 30, angle: 30 },
      { x: -35, y: -35, angle: -20 },
      { x: 35, y: -35, angle: 20 }
    ];

    legPositions.forEach(leg => {
      const legGraphic = this.add.rectangle(leg.x, leg.y, 6, 40, 0x808080);
      legGraphic.setAngle(leg.angle);
      container.add(legGraphic);

      // Leg pad
      const pad = this.add.rectangle(leg.x, leg.y + 20, 12, 6, 0x606060);
      container.add(pad);
    });

    // Main body - cylindrical module
    const body = this.add.ellipse(0, 0, 85, 70, 0xc0c0c0);
    body.setStrokeStyle(3, 0x909090);
    container.add(body);

    // Top hatch
    const hatch = this.add.ellipse(0, -15, 25, 20, 0x505050);
    hatch.setStrokeStyle(2, 0x303030);
    container.add(hatch);

    // Windows/ports
    const portPositions = [-25, 0, 25];
    portPositions.forEach(px => {
      const port = this.add.circle(px, 5, 8, 0x4da6ff, 0.7);
      port.setStrokeStyle(2, 0x2e7d9a);
      container.add(port);
    });

    // USA flag decal
    const flag = this.add.rectangle(-25, -25, 20, 12, 0xff0000);
    container.add(flag);
    const flagBlue = this.add.rectangle(-30, -28, 8, 5, 0x0b3d91);
    container.add(flagBlue);

    // Antenna
    const antenna = this.add.rectangle(20, -35, 2, 15, 0x808080);
    container.add(antenna);
    const antennaDish = this.add.ellipse(20, -42, 10, 6, 0xc0c0c0);
    container.add(antennaDish);

    // Label
    this.add.text(x, y + 55, 'LANDING MODULE', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 3 }
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

    // Create realistic module based on type
    switch (type) {
      case 'habitat':
        this.createHabitatModule(x, y);
        break;
      case 'lab':
        this.createLabModule(x, y);
        break;
      case 'communications':
        this.createCommsModule(x, y);
        break;
      case 'storage':
        this.createStorageModule(x, y);
        break;
    }

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

  private createHabitatModule(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Cylindrical habitat - white/silver
    const body = this.add.ellipse(0, 0, 75, 65, 0xf0f0f0);
    body.setStrokeStyle(3, 0xc0c0c0);
    container.add(body);

    // Blue accent stripe
    const stripe = this.add.rectangle(0, 0, 75, 15, 0x4488ff);
    container.add(stripe);

    // Multiple windows in a row
    for (let i = 0; i < 4; i++) {
      const window = this.add.rectangle(-27 + i * 18, -15, 12, 18, 0xffff99, 0.8);
      window.setStrokeStyle(2, 0xcccc77);
      container.add(window);
    }

    // Airlock door
    const door = this.add.rectangle(0, 20, 18, 25, 0x808080);
    door.setStrokeStyle(2, 0x606060);
    container.add(door);

    // Solar panels on sides
    [-40, 40].forEach(sx => {
      const panel = this.add.rectangle(sx, 0, 15, 50, 0x1a237e);
      panel.setStrokeStyle(1, 0x0d47a1);
      container.add(panel);

      // Panel grid
      for (let i = 0; i < 3; i++) {
        container.add(this.add.rectangle(sx, -15 + i * 15, 14, 1, 0x0d47a1));
      }
    });

    // Label
    this.add.text(x, y + 50, 'HABITAT', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
  }

  private createLabModule(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Lab module - orange/white
    const body = this.add.rectangle(0, 0, 70, 70, 0xffffff);
    body.setStrokeStyle(3, 0xff8844);
    container.add(body);

    // Orange corner accents
    [[-30, -30], [30, -30], [-30, 30], [30, 30]].forEach(([cx, cy]) => {
      const corner = this.add.rectangle(cx, cy, 12, 12, 0xff8844);
      container.add(corner);
    });

    // Equipment/instrument panels
    const panel1 = this.add.rectangle(-15, 0, 20, 40, 0x666666);
    panel1.setStrokeStyle(1, 0x444444);
    container.add(panel1);

    const panel2 = this.add.rectangle(15, 0, 20, 40, 0x666666);
    panel2.setStrokeStyle(1, 0x444444);
    container.add(panel2);

    // Indicator lights
    const lights = [
      { x: -15, y: -15, color: 0x00ff00 },
      { x: -15, y: 0, color: 0xffff00 },
      { x: 15, y: -15, color: 0xff0000 },
      { x: 15, y: 0, color: 0x00ff00 }
    ];

    lights.forEach(light => {
      const indicator = this.add.circle(light.x, light.y, 3, light.color, 0.9);
      container.add(indicator);

      // Blinking effect
      this.tweens.add({
        targets: indicator,
        alpha: 0.3,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    });

    // Label
    this.add.text(x, y + 50, 'LABORATORY', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
  }

  private createCommsModule(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Base structure - green/white
    const body = this.add.ellipse(0, 5, 65, 55, 0xf5f5f5);
    body.setStrokeStyle(3, 0x44ff88);
    container.add(body);

    // Large satellite dish
    const dish = this.add.ellipse(0, -15, 50, 30, 0xc0c0c0);
    dish.setStrokeStyle(2, 0x909090);
    container.add(dish);

    // Dish details - concentric circles
    container.add(this.add.ellipse(0, -15, 40, 24, 0xd0d0d0, 0.5));
    container.add(this.add.ellipse(0, -15, 30, 18, 0xe0e0e0, 0.5));

    // Feed horn in center
    const feed = this.add.circle(0, -15, 5, 0x505050);
    container.add(feed);

    // Support arm
    const arm = this.add.rectangle(0, -5, 4, 15, 0x808080);
    container.add(arm);

    // Antennas
    [-20, 20].forEach(ax => {
      const antenna = this.add.rectangle(ax, -30, 2, 20, 0x606060);
      container.add(antenna);
      const tip = this.add.circle(ax, -40, 4, 0xff6600);
      container.add(tip);

      // Blinking transmission light
      this.tweens.add({
        targets: tip,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    });

    // Label
    this.add.text(x, y + 50, 'COMMUNICATIONS', {
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
  }

  private createStorageModule(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Cargo container style - yellow/black stripes
    const body = this.add.rectangle(0, 0, 75, 70, 0xffff44);
    body.setStrokeStyle(3, 0xcccc00);
    container.add(body);

    // Hazard stripes
    for (let i = 0; i < 3; i++) {
      const stripe = this.add.rectangle(0, -20 + i * 20, 75, 8, 0x000000);
      container.add(stripe);
    }

    // Cargo doors
    const leftDoor = this.add.rectangle(-15, 0, 20, 50, 0x888888);
    leftDoor.setStrokeStyle(2, 0x666666);
    container.add(leftDoor);

    const rightDoor = this.add.rectangle(15, 0, 20, 50, 0x888888);
    rightDoor.setStrokeStyle(2, 0x666666);
    container.add(rightDoor);

    // Door handles
    [-15, 15].forEach(dx => {
      const handle = this.add.rectangle(dx, 0, 4, 15, 0x404040);
      container.add(handle);
    });

    // Warning labels
    const warning = this.add.rectangle(0, -25, 30, 8, 0xff0000);
    container.add(warning);

    // Label
    this.add.text(x, y + 50, 'STORAGE', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
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
