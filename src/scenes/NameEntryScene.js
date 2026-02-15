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
    this.add.text(width / 2, 130, 'Player 1 Name:', {
      fontSize: '24px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player1Input = this.createInput(width / 2 - 100, 170, 'Phoenix');
    
    // Player 1 color picker
    this.add.text(width / 2, 230, 'Ball Color:', {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player1Color = this.createColorPicker(width / 2, 270, 0xff0000);
    
    // Player 2 input
    this.add.text(width / 2, 340, 'Player 2 Name:', {
      fontSize: '24px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player2Input = this.createInput(width / 2 - 100, 380, 'Cruz');
    
    // Player 2 color picker
    this.add.text(width / 2, 440, 'Ball Color:', {
      fontSize: '20px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player2Color = this.createColorPicker(width / 2, 480, 0x0000ff);
    
    // Start button
    const startBtn = this.add.text(width / 2, 560, 'Start Game', {
      fontSize: '32px',
      color: '#fff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    startBtn.on('pointerdown', () => {
      const player1 = this.player1Input.value.trim() || 'Player 1';
      const player2 = this.player2Input.value.trim() || 'Player 2';
      this.scene.start('GameScene', { 
        player1, 
        player2,
        player1Color: this.player1Color.selectedColor,
        player2Color: this.player2Color.selectedColor
      });
    });
    
    startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#45a049' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#4CAF50' }));
  }
  
  createColorPicker(x, y, defaultColor) {
    const colors = [
      { hex: 0xff0000, name: 'Red' },
      { hex: 0x0000ff, name: 'Blue' },
      { hex: 0x00ff00, name: 'Green' },
      { hex: 0xffff00, name: 'Yellow' },
      { hex: 0xff00ff, name: 'Purple' },
      { hex: 0xff8800, name: 'Orange' }
    ];
    
    const picker = { selectedColor: defaultColor };
    const circleSize = 30;
    const spacing = 45;
    const startX = x - (colors.length * spacing) / 2 + spacing / 2;
    
    colors.forEach((color, i) => {
      const circle = this.add.circle(startX + i * spacing, y, circleSize / 2, color.hex)
        .setInteractive()
        .setStrokeStyle(3, 0xffffff);
      
      // Highlight default selection
      if (color.hex === defaultColor) {
        circle.setStrokeStyle(4, 0xffd700);
      }
      
      circle.on('pointerdown', () => {
        // Reset all circles
        colors.forEach((c, j) => {
          const otherCircle = this.children.list.find(child => 
            child.x === startX + j * spacing && child.y === y
          );
          if (otherCircle) {
            otherCircle.setStrokeStyle(3, 0xffffff);
          }
        });
        
        // Highlight selected
        circle.setStrokeStyle(4, 0xffd700);
        picker.selectedColor = color.hex;
      });
    });
    
    return picker;
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
