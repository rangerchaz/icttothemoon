import Phaser from 'phaser';
import { gameStore } from '../GameStore';

export class LaunchScene extends Phaser.Scene {
  private countdownText?: Phaser.GameObjects.Text;
  private messageText?: Phaser.GameObjects.Text;
  private rocket?: Phaser.GameObjects.Rectangle;
  private countdown: number = 10;

  constructor() {
    super({ key: 'LaunchScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background - Wichita ground
    const ground = this.add.rectangle(0, height, width, height / 2, 0x88aa88).setOrigin(0, 1);

    // Launch pad
    this.add.rectangle(width / 2, height - height / 4, 200, 50, 0x666666).setOrigin(0.5);

    // Rocket
    this.rocket = this.add.rectangle(width / 2, height - height / 4 - 100, 60, 150, 0xcccccc).setOrigin(0.5);
    const rocketTop = this.add.triangle(width / 2, height - height / 4 - 175, 0, 50, 30, 0, 60, 50, 0xff0000).setOrigin(0.5, 1);

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
    if (!this.rocket) return;

    const { width, height } = this.cameras.main;

    // Create particle effects
    const particles = this.add.particles(0, 0, 'player', {
      speed: { min: 100, max: 200 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      gravityY: -100
    });

    particles.startFollow(this.rocket, 0, 75);

    // Rocket animation
    this.tweens.add({
      targets: this.rocket,
      y: -200,
      duration: 3000,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        particles.stop();
        this.showSpaceTransition();
      }
    });

    // Shake effect
    this.cameras.main.shake(3000, 0.01);

    // Message
    this.messageText?.setText('Leaving Wichita...');
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
