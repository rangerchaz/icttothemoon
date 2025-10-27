import Phaser from 'phaser';

export class Zombie {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private patrolPoints: { x: number; y: number }[];
  private currentPatrolIndex: number = 0;
  private speed: number = 50;
  private detectionRadius: number = 150;
  private target?: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, patrolPoints: { x: number; y: number }[]) {
    this.scene = scene;
    this.patrolPoints = patrolPoints;

    // Create zombie sprite if not already created
    if (!scene.textures.exists('zombie')) {
      this.createZombieTexture(scene);
    }

    this.sprite = scene.physics.add.sprite(x, y, 'zombie');
    this.sprite.setDepth(9);
    this.sprite.setCollideWorldBounds(true);
  }

  private createZombieTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Zombie body - grayish green
    graphics.fillStyle(0x6b8e23, 1);
    graphics.fillRect(10, 12, 12, 16);

    // Zombie head - pale green
    graphics.fillStyle(0x8fbc8f, 1);
    graphics.fillRect(11, 6, 10, 8);

    // Eyes - dark red
    graphics.fillStyle(0x8b0000, 1);
    graphics.fillRect(13, 8, 2, 2);
    graphics.fillRect(17, 8, 2, 2);

    // Arms - reaching out
    graphics.fillStyle(0x6b8e23, 1);
    graphics.fillRect(6, 14, 4, 10);
    graphics.fillRect(22, 14, 4, 10);

    // Legs
    graphics.fillRect(12, 28, 4, 8);
    graphics.fillRect(16, 28, 4, 8);

    // Tattered clothes effect - darker patches
    graphics.fillStyle(0x556b2f, 0.7);
    graphics.fillRect(11, 15, 3, 5);
    graphics.fillRect(18, 17, 3, 4);

    graphics.generateTexture('zombie', 32, 36);
    graphics.destroy();
  }

  update(playerSprite?: Phaser.Physics.Arcade.Sprite): void {
    if (!this.sprite.active) return;

    // Check if player is nearby
    if (playerSprite) {
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        playerSprite.x,
        playerSprite.y
      );

      // Chase player if nearby
      if (distance < this.detectionRadius) {
        this.chaseTarget(playerSprite);
        return;
      }
    }

    // Otherwise patrol
    this.patrol();
  }

  private chaseTarget(target: Phaser.Physics.Arcade.Sprite): void {
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      target.x,
      target.y
    );

    const velocityX = Math.cos(angle) * this.speed * 1.5; // Zombies move faster when chasing
    const velocityY = Math.sin(angle) * this.speed * 1.5;

    this.sprite.setVelocity(velocityX, velocityY);

    // Flip sprite based on direction
    if (velocityX < 0) {
      this.sprite.setFlipX(true);
    } else if (velocityX > 0) {
      this.sprite.setFlipX(false);
    }
  }

  private patrol(): void {
    if (this.patrolPoints.length === 0) return;

    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      targetPoint.x,
      targetPoint.y
    );

    // If close to patrol point, move to next
    if (distance < 20) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      return;
    }

    // Move toward patrol point
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      targetPoint.x,
      targetPoint.y
    );

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.sprite.setVelocity(velocityX, velocityY);

    // Flip sprite based on direction
    if (velocityX < 0) {
      this.sprite.setFlipX(true);
    } else if (velocityX > 0) {
      this.sprite.setFlipX(false);
    }
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
