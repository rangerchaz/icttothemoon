import Phaser from 'phaser';
import { gameStore } from '../GameStore';

export class LaunchScene extends Phaser.Scene {
  private countdownText?: Phaser.GameObjects.Text;
  private messageText?: Phaser.GameObjects.Text;
  private rocketContainer?: Phaser.GameObjects.Container;
  private countdown: number = 10;
  private exhaustParticles: Phaser.GameObjects.Ellipse[] = [];

  constructor() {
    super({ key: 'LaunchScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Sky gradient - blue to light blue
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x87ceeb, 0x87ceeb, 0xe0f6ff, 0xe0f6ff, 1);
    sky.fillRect(0, 0, width, height * 0.6);

    // Ground with detail
    const ground = this.add.graphics();
    ground.fillStyle(0x6b8e23, 1);
    ground.fillRect(0, height * 0.6, width, height * 0.4);

    // Ground texture - darker patches
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(height * 0.6, height);
      ground.fillStyle(0x556b2f, 0.3);
      ground.fillEllipse(x, y, Phaser.Math.Between(30, 60), Phaser.Math.Between(20, 40));
    }

    // Distant buildings (Wichita skyline)
    this.createSkyline(width, height);

    // Launch pad structure
    this.createLaunchPad(width / 2, height - height / 4);

    // Create detailed rocket
    this.rocketContainer = this.createRealisticRocket(width / 2, height - height / 4 - 100);

    // Message
    this.messageText = this.add.text(width / 2, 100, 'Preparing for Launch...', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Countdown display
    this.countdownText = this.add.text(width / 2, height / 2, '', {
      fontSize: '72px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Start countdown after delay
    this.time.delayedCall(2000, () => {
      this.startCountdown();
    });
  }

  private startCountdown(): void {
    this.messageText?.setText('LAUNCH COUNTDOWN');

    const countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.countdown > 0) {
          this.countdownText?.setText(this.countdown.toString());
          this.countdown--;

          // Sound effect simulation (visual flash)
          this.cameras.main.flash(100, 255, 255, 255, false);
        } else {
          this.countdownText?.setText('LIFTOFF!');
          countdownTimer.remove();
          this.launchRocket();
        }
      },
      loop: true
    });
  }

  private launchRocket(): void {
    if (!this.rocketContainer) return;

    const { width, height } = this.cameras.main;

    // Start exhaust particles
    this.time.addEvent({
      delay: 50,
      repeat: 60,
      callback: () => {
        this.createExhaustParticle();
      }
    });

    // Rocket animation
    this.tweens.add({
      targets: this.rocketContainer,
      y: -300,
      duration: 4000,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.showSpaceTransition();
      }
    });

    // Shake effect - stronger shake
    this.cameras.main.shake(4000, 0.015);

    // Screen flash for engine ignition
    this.cameras.main.flash(200, 255, 200, 150, false);

    // Message
    this.messageText?.setText('LIFTOFF! Leaving Wichita...');
  }

  private createExhaustParticle(): void {
    if (!this.rocketContainer) return;

    const x = this.rocketContainer.x;
    const y = this.rocketContainer.y + 75;

    // Create exhaust cloud
    const exhaust = this.add.ellipse(
      x + Phaser.Math.Between(-15, 15),
      y,
      Phaser.Math.Between(30, 50),
      Phaser.Math.Between(40, 60),
      Phaser.Math.Between(0, 1) > 0.5 ? 0xff6600 : 0xffaa00,
      0.8
    );

    this.exhaustParticles.push(exhaust);

    // Animate exhaust
    this.tweens.add({
      targets: exhaust,
      y: y + 100,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      onComplete: () => {
        exhaust.destroy();
      }
    });
  }

  private showSpaceTransition(): void {
    const { width, height } = this.cameras.main;

    // Fade to black
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      // Clear scene
      this.children.removeAll();

      // Space background
      this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
      this.createStarfield();

      this.add.text(width / 2, height / 2 - 100, 'Journey to the Moon...', {
        fontSize: '36px',
        color: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);

      // Earth shrinking
      const earth = this.add.circle(width / 2, height / 2, 100, 0x4488ff);
      this.tweens.add({
        targets: earth,
        radius: 20,
        duration: 3000,
        ease: 'Quad.easeOut'
      });

      // Moon growing
      const moon = this.add.circle(width / 2, height / 2 + 200, 20, 0xcccccc);
      this.tweens.add({
        targets: moon,
        radius: 150,
        y: height / 2,
        duration: 3000,
        delay: 2000,
        ease: 'Quad.easeIn',
        onComplete: () => {
          this.landOnMoon();
        }
      });

      this.cameras.main.fadeIn(1000, 0, 0, 0);
    });
  }

  private landOnMoon(): void {
    const { width, height } = this.cameras.main;

    this.time.delayedCall(1000, () => {
      this.add.text(width / 2, height - 100, 'Landing on the Moon...', {
        fontSize: '32px',
        color: '#00ff00',
        align: 'center'
      }).setOrigin(0.5);

      this.time.delayedCall(2000, () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0);

        this.time.delayedCall(1000, () => {
          gameStore.startMoonbase();
          this.scene.start('MoonbaseScene');
        });
      });
    });
  }

  private createRealisticRocket(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Main body - white/silver
    const body = this.add.rectangle(0, 0, 45, 130, 0xf0f0f0);
    body.setStrokeStyle(2, 0xc0c0c0);
    container.add(body);

    // NASA logo area - blue stripe
    const blueStripe = this.add.rectangle(0, -20, 45, 25, 0x0b3d91);
    container.add(blueStripe);

    // USA text
    const usaText = this.add.text(0, -20, 'USA', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    container.add(usaText);

    // Red stripe accent
    const redStripe = this.add.rectangle(0, 20, 45, 8, 0xff0000);
    container.add(redStripe);

    // Windows
    for (let i = 0; i < 3; i++) {
      const window = this.add.circle(0, -40 + i * 20, 4, 0x4da6ff, 0.8);
      container.add(window);
    }

    // Nose cone - red (centered triangle pointing up)
    const noseCone = this.add.triangle(0, -95, 0, -30, -22.5, 30, 22.5, 30, 0xff0000);
    noseCone.setOrigin(0.5, 0.5);
    container.add(noseCone);

    // Fins (4 fins)
    const finPositions = [
      { x: -27, angle: -15 },
      { x: 27, angle: 15 },
      { x: -23, angle: -10 },
      { x: 23, angle: 10 }
    ];

    finPositions.forEach((pos, i) => {
      const fin = this.add.triangle(pos.x, 55, 0, 0, -15, 35, 0, 35, 0x808080);
      fin.setOrigin(0, 0);
      fin.setAngle(pos.angle);
      container.add(fin);
    });

    // Engine nozzles (3 engines)
    const enginePositions = [-15, 0, 15];
    enginePositions.forEach(ex => {
      // Engine bell
      const engine = this.add.ellipse(ex, 68, 12, 18, 0x505050);
      engine.setStrokeStyle(2, 0x303030);
      container.add(engine);

      // Engine glow
      const glow = this.add.ellipse(ex, 70, 8, 10, 0xff6600, 0.7);
      container.add(glow);

      // Animate glow
      this.tweens.add({
        targets: glow,
        alpha: 0.4,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    });

    // Shadow effect
    const shadow = this.add.rectangle(3, 3, 45, 130, 0x000000, 0.2);
    container.add(shadow);
    container.sendToBack(shadow);

    container.setDepth(10);
    return container;
  }

  private createLaunchPad(x: number, y: number): void {
    // Main launch platform - steel gray
    const platform = this.add.rectangle(x, y, 220, 15, 0x708090);
    platform.setStrokeStyle(3, 0x505050);

    // Platform supports
    const supports = [
      { x: x - 80, y: y + 20 },
      { x: x - 40, y: y + 20 },
      { x: x + 40, y: y + 20 },
      { x: x + 80, y: y + 20 }
    ];

    supports.forEach(support => {
      const beam = this.add.rectangle(support.x, support.y, 12, 40, 0x505050);
      beam.setStrokeStyle(1, 0x303030);
    });

    // Flame trench
    const trench = this.add.rectangle(x, y + 45, 100, 25, 0x404040);
    trench.setStrokeStyle(2, 0x202020);

    // Launch tower structure
    const tower = this.add.rectangle(x + 130, y - 80, 25, 180, 0xb87333);
    tower.setStrokeStyle(2, 0x8b4513);

    // Tower details - crossbeams
    for (let i = 0; i < 5; i++) {
      const beam = this.add.rectangle(x + 130, y - 150 + i * 40, 20, 3, 0x654321);
      this.add.rectangle(x + 90, y - 150 + i * 40, 60, 2, 0x505050);
    }
  }

  private createSkyline(width: number, height: number): void {
    // Distant city buildings silhouette
    const buildings = [
      { x: 100, w: 40, h: 100 },
      { x: 150, w: 50, h: 80 },
      { x: 210, w: 35, h: 120 },
      { x: 900, w: 45, h: 90 },
      { x: 950, w: 55, h: 110 },
      { x: 1010, w: 40, h: 85 }
    ];

    buildings.forEach(bldg => {
      const building = this.add.rectangle(
        bldg.x,
        height * 0.6 - bldg.h / 2,
        bldg.w,
        bldg.h,
        0x4a5f7a,
        0.6
      );
      building.setStrokeStyle(1, 0x364861);

      // Windows
      for (let row = 0; row < Math.floor(bldg.h / 15); row++) {
        for (let col = 0; col < Math.floor(bldg.w / 12); col++) {
          const windowX = bldg.x - bldg.w / 2 + 6 + col * 12;
          const windowY = height * 0.6 - bldg.h + 8 + row * 15;
          this.add.rectangle(windowX, windowY, 6, 8, 0xffff99, 0.7);
        }
      }
    });
  }

  private createStarfield(): void {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 300; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Math.random() * 2;
      this.add.circle(x, y, size, 0xffffff, Math.random());
    }
  }
}
