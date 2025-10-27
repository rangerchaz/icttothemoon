import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Deep space background - dark blue/black gradient
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x000814, 0x000814, 0x0a1929, 0x0a1929, 1);
    gradient.fillRect(0, 0, width, height);

    // Stars background with depth
    this.createRealisticStarfield();

    // Earth in lower left
    this.createEarth(150, height - 150);

    // Moon in upper right
    this.createMoon(width - 200, 180);

    // Shooting stars
    this.createShootingStars();

    // Title with glow effect
    const titleShadow = this.add.text(width / 2, height / 3 + 3, 'WICHITA TO THE MOON', {
      fontSize: '56px',
      color: '#001144',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    const title = this.add.text(width / 2, height / 3, 'WICHITA TO THE MOON', {
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      shadow: { offsetX: 0, offsetY: 0, color: '#4da6ff', blur: 10, fill: true }
    }).setOrigin(0.5);

    // Animated pulsing effect on title
    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1
    });

    // Subtitle with color
    this.add.text(width / 2, height / 3 + 80, 'An AI-Powered Space Adventure', {
      fontSize: '24px',
      color: '#00aaff',
      align: 'center',
      shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
    }).setOrigin(0.5);

    // Start button with modern design
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x003300, 1);
    buttonBg.fillRoundedRect(width / 2 - 150, height / 2 + 30, 300, 60, 10);
    buttonBg.lineStyle(3, 0x00ff00, 1);
    buttonBg.strokeRoundedRect(width / 2 - 150, height / 2 + 30, 300, 60, 10);

    const startButton = this.add.text(width / 2, height / 2 + 60, 'START MISSION', {
      fontSize: '32px',
      color: '#00ff00',
      fontStyle: 'bold',
      shadow: { offsetX: 2, offsetY: 2, color: '#003300', blur: 4, fill: true }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Button hover effects
    startButton.on('pointerover', () => {
      startButton.setColor('#00ff88');
      this.tweens.add({
        targets: startButton,
        scale: 1.1,
        duration: 200
      });
    });

    startButton.on('pointerout', () => {
      startButton.setColor('#00ff00');
      this.tweens.add({
        targets: startButton,
        scale: 1.0,
        duration: 200
      });
    });

    startButton.on('pointerdown', () => {
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('WichitaScene');
      });
    });

    // Instructions
    const instructions = [
      'CONTROLS:',
      'Arrow Keys or WASD - Move',
      'E or SPACE - Interact',
      'ESC - Pause'
    ];

    let yOffset = height - 200;
    instructions.forEach(text => {
      this.add.text(width / 2, yOffset, text, {
        fontSize: '16px',
        color: '#cccccc',
        align: 'center'
      }).setOrigin(0.5);
      yOffset += 25;
    });
  }

  private createRealisticStarfield(): void {
    const { width, height } = this.cameras.main;

    // Layer 1: Distant tiny stars
    for (let i = 0; i < 300; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, 0.5, 0xffffff, Math.random() * 0.5 + 0.3);

      // Twinkling effect
      this.tweens.add({
        targets: star,
        alpha: Math.random() * 0.3,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Layer 2: Medium stars with color variation
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const colors = [0xffffff, 0xffffee, 0xeeeeff, 0xffeeee];
      const color = Phaser.Utils.Array.GetRandom(colors);
      const star = this.add.circle(x, y, 1, color, Math.random() * 0.7 + 0.3);

      this.tweens.add({
        targets: star,
        alpha: Math.random() * 0.5,
        duration: Phaser.Math.Between(1500, 4000),
        yoyo: true,
        repeat: -1
      });
    }

    // Layer 3: Bright foreground stars
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, 1.5, 0xffffff, 0.9);

      this.tweens.add({
        targets: star,
        alpha: 0.4,
        duration: Phaser.Math.Between(2000, 5000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  private createEarth(x: number, y: number): void {
    // Earth shadow/base
    const earthShadow = this.add.circle(x + 2, y + 2, 70, 0x000000, 0.5);

    // Earth base - blue
    const earth = this.add.circle(x, y, 70, 0x1e90ff);

    // Continents - green/brown
    const continent1 = this.add.ellipse(x - 20, y - 10, 40, 35, 0x228b22, 0.8);
    const continent2 = this.add.ellipse(x + 15, y + 20, 35, 30, 0x2e8b57, 0.8);
    const continent3 = this.add.ellipse(x - 10, y + 25, 25, 20, 0x8b7355, 0.8);

    // Clouds - white with transparency
    for (let i = 0; i < 8; i++) {
      const cloudX = x + Phaser.Math.Between(-60, 60);
      const cloudY = y + Phaser.Math.Between(-60, 60);
      const cloud = this.add.ellipse(cloudX, cloudY,
        Phaser.Math.Between(15, 25),
        Phaser.Math.Between(10, 20),
        0xffffff, 0.4);
    }

    // Atmosphere glow
    const atmosphere = this.add.circle(x, y, 75, 0x87ceeb, 0.2);

    // Subtle rotation
    this.tweens.add({
      targets: [continent1, continent2, continent3],
      angle: 360,
      duration: 60000,
      repeat: -1
    });
  }

  private createMoon(x: number, y: number): void {
    // Moon shadow
    const moonShadow = this.add.circle(x + 1, y + 1, 40, 0x000000, 0.3);

    // Moon base - gray
    const moon = this.add.circle(x, y, 40, 0xc0c0c0);

    // Craters - darker gray
    const craters = [
      { x: -10, y: -8, r: 8 },
      { x: 12, y: -5, r: 6 },
      { x: -15, y: 10, r: 5 },
      { x: 8, y: 12, r: 7 },
      { x: 0, y: -15, r: 4 },
      { x: 18, y: 8, r: 5 }
    ];

    craters.forEach(crater => {
      this.add.circle(x + crater.x, y + crater.y, crater.r, 0x808080, 0.6);
      // Crater rim highlight
      this.add.circle(x + crater.x - 1, y + crater.y - 1, crater.r * 0.8, 0xd3d3d3, 0.3);
    });

    // Subtle glow
    const glow = this.add.circle(x, y, 43, 0xffffff, 0.1);
  }

  private createShootingStars(): void {
    const { width, height } = this.cameras.main;

    // Create shooting stars periodically
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        const startX = Phaser.Math.Between(0, width);
        const startY = Phaser.Math.Between(0, height / 2);

        const star = this.add.graphics();
        star.lineStyle(2, 0xffffff, 1);
        star.beginPath();
        star.moveTo(0, 0);
        star.lineTo(-20, -10);
        star.strokePath();

        star.setPosition(startX, startY);

        // Trail effect
        const trail = this.add.graphics();
        trail.lineStyle(1, 0xffffff, 0.3);
        trail.beginPath();
        trail.moveTo(0, 0);
        trail.lineTo(-40, -20);
        trail.strokePath();
        trail.setPosition(startX, startY);

        // Animate across screen
        this.tweens.add({
          targets: [star, trail],
          x: '+=300',
          y: '+=150',
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            star.destroy();
            trail.destroy();
          }
        });
      },
      loop: true
    });
  }
}

