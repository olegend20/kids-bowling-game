// NameEntryScene — collect player names before game starts

'use strict';

class NameEntryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NameEntryScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Title
    this.add.text(width / 2, 50, 'Bowling Game', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Player 1 input
    this.add.text(width / 2, 150, 'Player 1 Name:', {
      fontSize: '24px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player1Input = this.createInput(width / 2 - 100, 190, 'Phoenix');
    
    // Player 2 input
    this.add.text(width / 2, 270, 'Player 2 Name:', {
      fontSize: '24px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player2Input = this.createInput(width / 2 - 100, 310, 'Cruz');
    
    // Start button
    const startBtn = this.add.text(width / 2, 400, 'Start Game', {
      fontSize: '32px',
      color: '#fff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    startBtn.on('pointerdown', () => {
      const player1 = this.player1Input.value.trim() || 'Player 1';
      const player2 = this.player2Input.value.trim() || 'Player 2';
      this.scene.start('GameScene', { player1, player2 });
    });
    
    startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#45a049' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#4CAF50' }));
  }
  
  createInput(x, y, placeholder) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.value = placeholder;
    input.style.position = 'absolute';
    input.style.left = x + 'px';
    input.style.top = y + 'px';
    input.style.width = '200px';
    input.style.height = '40px';
    input.style.fontSize = '20px';
    input.style.padding = '5px';
    document.body.appendChild(input);
    
    // Clean up on scene shutdown
    this.events.on('shutdown', () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    });
    
    return input;
  }
}
