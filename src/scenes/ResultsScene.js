// ResultsScene — game over screen with final score and restart option.
//
// Displays:
// - Final score
// - "Play Again" button
//
// Usage:
//   this.scene.start('ResultsScene', { finalScore: 150 });

'use strict';

class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  init(data) {
    this.finalScore = data.finalScore || 0;
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // "Game Over" title
    this.add.text(centerX, centerY - 100, 'Game Over', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Final score
    this.add.text(centerX, centerY, `Final Score: ${this.finalScore}`, {
      fontSize: '32px',
      color: '#ffd700'
    }).setOrigin(0.5);

    // "Play Again" button
    const playAgainBtn = this.add.text(centerX, centerY + 100, 'Play Again', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#4a90e2',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    playAgainBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    playAgainBtn.on('pointerover', () => {
      playAgainBtn.setStyle({ backgroundColor: '#357abd' });
    });

    playAgainBtn.on('pointerout', () => {
      playAgainBtn.setStyle({ backgroundColor: '#4a90e2' });
    });
  }
}
