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
    
    // Player 1 Age input
    this.add.text(width / 2 - 120, 540, 'P1 Age:', {
      fontSize: '18px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player1AgeInput = this.createAgeInput(width / 2 - 120, 570);
    
    // Player 2 Age input
    this.add.text(width / 2 + 120, 540, 'P2 Age:', {
      fontSize: '18px',
      color: '#fff'
    }).setOrigin(0.5);
    
    this.player2AgeInput = this.createAgeInput(width / 2 + 120, 570);
    
    // Validation warning (hidden by default)
    this.validationWarning = this.add.text(width / 2, 610, '', {
      fontSize: '16px',
      color: '#ff4444',
      fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);
    
    // Start button
    const startBtn = this.add.text(width / 2, 650, 'Start Game', {
      fontSize: '32px',
      color: '#fff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    startBtn.on('pointerdown', () => {
      const player1 = this.player1Input.value.trim() || 'Player 1';
      const player2 = this.player2Input.value.trim() || 'Player 2';
      
      const player1Age = this.validateAge(this.player1AgeInput, 'Player 1');
      const player2Age = this.validateAge(this.player2AgeInput, 'Player 2');
      
      if (player1Age === null || player2Age === null) {
        return; // Validation failed, don't start game yet
      }
      
      this.scene.start('GameScene', { 
        player1, 
        player2,
        player1Color: this.player1Color.selectedColor,
        player2Color: this.player2Color.selectedColor,
        player1Age: player1Age,
        player2Age: player2Age
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
    
    const picker = { selectedColor: defaultColor, circles: [] };
    const circleSize = 30;
    const spacing = 45;
    const startX = x - (colors.length * spacing) / 2 + spacing / 2;
    
    colors.forEach((color, index) => {
      const circle = this.add.circle(startX + index * spacing, y, circleSize / 2, color.hex)
        .setInteractive()
        .setStrokeStyle(3, 0xffffff);
      
      picker.circles.push(circle);
      
      if (color.hex === defaultColor) {
        circle.setStrokeStyle(4, 0xffd700);
      }
      
      circle.on('pointerdown', () => {
        this.resetColorSelection(picker.circles);
        circle.setStrokeStyle(4, 0xffd700);
        picker.selectedColor = color.hex;
      });
    });
    
    return picker;
  }
  
  validateAge(ageInput, playerName) {
    const age = parseInt(ageInput.value, 10);
    
    if (isNaN(age) || age < 1 || age > 99) {
      this.showValidationWarning(`Invalid age for ${playerName}! Please enter 1-99`);
      return null;
    }
    
    return age;
  }
  
  showValidationWarning(message) {
    this.validationWarning.setText(message);
    this.validationWarning.setVisible(true);
    
    this.time.delayedCall(2000, () => {
      this.validationWarning.setVisible(false);
    });
  }
  
  resetColorSelection(circles) {
    circles.forEach(circle => {
      circle.setStrokeStyle(3, 0xffffff);
    });
  }
  
  createAgeInput(x, y) {
    const input = this.createDOMInput({
      type: 'number',
      placeholder: '10',
      value: '10',
      min: '1',
      max: '99',
      x,
      y,
      width: '100px',
      textAlign: 'center'
    });
    
    return input;
  }
  
  createInput(x, y, placeholder) {
    const input = this.createDOMInput({
      type: 'text',
      placeholder,
      value: placeholder,
      x,
      y,
      width: '200px'
    });
    
    return input;
  }
  
  createDOMInput(options) {
    const input = document.createElement('input');
    input.type = options.type;
    input.placeholder = options.placeholder;
    input.value = options.value;
    
    if (options.min) input.min = options.min;
    if (options.max) input.max = options.max;
    
    input.style.position = 'absolute';
    input.style.left = options.x + 'px';
    input.style.top = options.y + 'px';
    input.style.width = options.width;
    input.style.height = '40px';
    input.style.fontSize = '20px';
    input.style.padding = '5px';
    
    if (options.textAlign) {
      input.style.textAlign = options.textAlign;
    }
    
    document.body.appendChild(input);
    
    this.events.on('shutdown', () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    });
    
    return input;
  }
}
