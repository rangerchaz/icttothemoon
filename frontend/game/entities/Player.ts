import Phaser from 'phaser';
import { PLAYER_SPEED } from '../config';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Create player sprite (person)
    if (!scene.textures.exists('player')) {
      this.createPlayerTexture(scene);
    }

    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);

    // Setup controls
    this.setupControls();
  }

  private createPlayerTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Head - skin tone
    graphics.fillStyle(0xfdbcb4, 1);
    graphics.fillCircle(16, 10, 6);

    // Body - blue shirt
    graphics.fillStyle(0x4169e1, 1);
    graphics.fillRect(11, 16, 10, 12);

    // Arms
    graphics.fillStyle(0xfdbcb4, 1);
    graphics.fillRect(7, 18, 4, 8);
    graphics.fillRect(21, 18, 4, 8);

    // Pants - dark gray
    graphics.fillStyle(0x505050, 1);
    graphics.fillRect(12, 28, 4, 10);
    graphics.fillRect(16, 28, 4, 10);

    // Shoes - black
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(11, 38, 5, 3);
    graphics.fillRect(16, 38, 5, 3);

    // Eyes
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(13, 9, 2, 2);
    graphics.fillRect(17, 9, 2, 2);

    // Hair - brown
    graphics.fillStyle(0x654321, 1);
    graphics.fillCircle(16, 7, 7);
    graphics.fillRect(10, 4, 12, 5);

    graphics.generateTexture('player', 32, 42);
    graphics.destroy();
  }

  private setupControls(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }
  }

  update(): void {
    if (!this.cursors || !this.wasd) return;

    let velocityX = 0;
    let velocityY = 0;

    // Check for input
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -PLAYER_SPEED;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = PLAYER_SPEED;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -PLAYER_SPEED;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = PLAYER_SPEED;
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    this.sprite.setVelocity(velocityX, velocityY);
  }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    };
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
