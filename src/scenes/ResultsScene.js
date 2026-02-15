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
    this.player1Name = data.player1Name;
    this.player2Name = data.player2Name;
    this.score1 = data.score1;
    this.score2 = data.score2;
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // "Game Over" title
    this.add.text(centerX, 80, 'Game Over', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Check if 2-player mode
    if (this.score2 !== undefined) {
      // Player 1 score
      this.add.text(centerX, 180, this.player1Name, {
        fontSize: '28px',
        color: '#fff'
      }).setOrigin(0.5);
      
      this.add.text(centerX, 220, `Score: ${this.score1}`, {
        fontSize: '36px',
        color: '#4CAF50',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Player 2 score
      this.add.text(centerX, 290, this.player2Name, {
        fontSize: '28px',
        color: '#fff'
      }).setOrigin(0.5);
      
      this.add.text(centerX, 330, `Score: ${this.score2}`, {
        fontSize: '36px',
        color: '#4CAF50',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Winner
      const winner = this.score1 > this.score2 ? this.player1Name : 
                     this.score2 > this.score1 ? this.player2Name : 'Tie';
      const winnerText = winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`;
      this.add.text(centerX, 410, winnerText, {
        fontSize: '40px',
        color: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    } else {
      // Single player
      this.add.text(centerX, centerY, `Final Score: ${this.finalScore}`, {
        fontSize: '32px',
        color: '#ffd700'
      }).setOrigin(0.5);
    }

    // "Play Again" button
    const playAgainBtn = this.add.text(centerX, 500, 'Play Again', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#4a90e2',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    playAgainBtn.on('pointerdown', () => {
      this.scene.start('NameEntryScene');
    });

    playAgainBtn.on('pointerover', () => {
      playAgainBtn.setStyle({ backgroundColor: '#357abd' });
    });

    playAgainBtn.on('pointerout', () => {
      playAgainBtn.setStyle({ backgroundColor: '#4a90e2' });
    });
  }
}
