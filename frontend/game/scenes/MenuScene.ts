import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x0a0a1a).setOrigin(0);

    // Stars background
    this.createStarfield();

    // Title
    this.add.text(width / 2, height / 3, 'WICHITA TO THE MOON', {
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 3 + 80, 'An AI-Powered Space Adventure', {
      fontSize: '24px',
      color: '#888888',
      align: 'center'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.text(width / 2, height / 2 + 50, 'START MISSION', {
      fontSize: '32px',
      color: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#005500' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#003300' });
    });

    startButton.on('pointerdown', () => {
      this.scene.start('WichitaScene');
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

  private createStarfield(): void {
    const { width, height } = this.cameras.main;
    const graphics = this.add.graphics();

    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const alpha = Math.random();
      graphics.fillStyle(0xffffff, alpha);
      graphics.fillCircle(x, y, 1);
    }
  }
}
