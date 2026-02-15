// ScoreboardUI — renders bowling scoreboard in Phaser.
//
// Displays 10 frames with:
// - Two roll boxes per frame (or 3 for frame 10)
// - Running total below each frame
// - Strike displayed as "X", spare as "/"
//
// Usage:
//   const scoreboard = new ScoreboardUI(scene, x, y);
//   scoreboard.update(frameController, scoreEngine);

'use strict';

class ScoreboardUI {
  constructor(scene, x, y, playerName = 'Player') {
    this.scene = scene;
    this.x = x;
    this.y = y;
    
    // Visual constants
    this.frameWidth = 60;
    this.frameHeight = 80;
    this.rollBoxHeight = 30;
    this.totalBoxHeight = 50;
    this.padding = 2;
    
    // Container for all scoreboard graphics
    this.container = scene.add.container(x, y);
    
    // Player name
    this.playerText = scene.add.text(0, -30, playerName, { 
      fontSize: '24px', 
      color: '#fff',
      fontStyle: 'bold'
    });
    this.container.add(this.playerText);
    
    // Create frame boxes
    this._createFrameBoxes();
  }
  
  _createFrameBoxes() {
    this.frames = [];
    
    for (let i = 0; i < 10; i++) {
      const frameX = i * this.frameWidth;
      const frame = {
        index: i,
        x: frameX,
        graphics: this.scene.add.graphics(),
        roll1Text: this.scene.add.text(0, 0, '', { fontSize: '16px', color: '#fff' }),
        roll2Text: this.scene.add.text(0, 0, '', { fontSize: '16px', color: '#fff' }),
        roll3Text: null, // only for frame 10
        totalText: this.scene.add.text(0, 0, '', { fontSize: '20px', color: '#fff', fontStyle: 'bold' })
      };
      
      // Frame 10 gets a third roll box
      if (i === 9) {
        frame.roll3Text = this.scene.add.text(0, 0, '', { fontSize: '16px', color: '#fff' });
      }
      
      // Draw frame box
      frame.graphics.lineStyle(2, 0xffffff, 1);
      frame.graphics.strokeRect(frameX, 0, this.frameWidth, this.frameHeight);
      
      // Divider between rolls and total
      frame.graphics.lineStyle(1, 0xffffff, 0.5);
      frame.graphics.lineBetween(
        frameX, this.rollBoxHeight,
        frameX + this.frameWidth, this.rollBoxHeight
      );
      
      // Position roll texts
      if (i === 9) {
        // Frame 10: three smaller boxes
        const boxWidth = this.frameWidth / 3;
        frame.roll1Text.setPosition(frameX + boxWidth * 0 + this.padding, this.padding);
        frame.roll2Text.setPosition(frameX + boxWidth * 1 + this.padding, this.padding);
        frame.roll3Text.setPosition(frameX + boxWidth * 2 + this.padding, this.padding);
        
        // Vertical dividers for frame 10
        frame.graphics.lineBetween(frameX + boxWidth, 0, frameX + boxWidth, this.rollBoxHeight);
        frame.graphics.lineBetween(frameX + boxWidth * 2, 0, frameX + boxWidth * 2, this.rollBoxHeight);
      } else {
        // Normal frame: two boxes
        const boxWidth = this.frameWidth / 2;
        frame.roll1Text.setPosition(frameX + this.padding, this.padding);
        frame.roll2Text.setPosition(frameX + boxWidth + this.padding, this.padding);
        
        // Vertical divider
        frame.graphics.lineBetween(frameX + boxWidth, 0, frameX + boxWidth, this.rollBoxHeight);
      }
      
      // Position total text (centered in bottom box)
      frame.totalText.setPosition(
        frameX + this.frameWidth / 2,
        this.rollBoxHeight + this.totalBoxHeight / 2
      );
      frame.totalText.setOrigin(0.5, 0.5);
      
      // Add to container
      this.container.add(frame.graphics);
      this.container.add(frame.roll1Text);
      this.container.add(frame.roll2Text);
      if (frame.roll3Text) this.container.add(frame.roll3Text);
      this.container.add(frame.totalText);
      
      this.frames.push(frame);
    }
  }
  
  // Update scoreboard display with current game state.
  update(frameController, scoreEngine) {
    const rolls = frameController.rolls;
    const frameScores = scoreEngine.getFrameScores(rolls);
    
    let rollIndex = 0;
    let cumulativeScore = 0;
    
    for (let frameNum = 0; frameNum < 10; frameNum++) {
      const frame = this.frames[frameNum];
      
      if (frameNum < 9) {
        // Frames 1-9: normal scoring
        this._updateNormalFrame(frame, rolls, rollIndex, frameScores[frameNum], cumulativeScore);
        
        // Advance roll index
        if (rollIndex < rolls.length) {
          if (rolls[rollIndex] === 10) {
            rollIndex += 1; // strike
          } else {
            rollIndex += 2; // two balls
          }
        }
      } else {
        // Frame 10: special handling (up to 3 balls)
        this._updateFrame10(frame, rolls, rollIndex, frameScores[frameNum], cumulativeScore);
      }
      
      // Update cumulative score
      if (frameScores[frameNum] !== null) {
        cumulativeScore += frameScores[frameNum];
        frame.totalText.setText(cumulativeScore.toString());
      }
    }
  }
  
  _updateNormalFrame(frame, rolls, rollIndex, frameScore, cumulativeScore) {
    const roll1 = rolls[rollIndex];
    const roll2 = rolls[rollIndex + 1];
    
    // Display roll 1
    if (roll1 !== undefined) {
      if (roll1 === 10) {
        frame.roll1Text.setText('');
        frame.roll2Text.setText('X');
      } else {
        frame.roll1Text.setText(roll1.toString());
        
        // Display roll 2
        if (roll2 !== undefined) {
          if (roll1 + roll2 === 10) {
            frame.roll2Text.setText('/');
          } else {
            frame.roll2Text.setText(roll2.toString());
          }
        }
      }
    }
  }
  
  _updateFrame10(frame, rolls, rollIndex, frameScore, cumulativeScore) {
    const roll1 = rolls[rollIndex];
    const roll2 = rolls[rollIndex + 1];
    const roll3 = rolls[rollIndex + 2];
    
    // Roll 1
    if (roll1 !== undefined) {
      frame.roll1Text.setText(roll1 === 10 ? 'X' : roll1.toString());
    }
    
    // Roll 2
    if (roll2 !== undefined) {
      if (roll1 === 10) {
        // After strike: show X or number
        frame.roll2Text.setText(roll2 === 10 ? 'X' : roll2.toString());
      } else {
        // After non-strike: show spare or number
        frame.roll2Text.setText(roll1 + roll2 === 10 ? '/' : roll2.toString());
      }
    }
    
    // Roll 3 (bonus ball)
    if (roll3 !== undefined && frame.roll3Text) {
      if (roll2 === 10 || (roll1 !== 10 && roll1 + roll2 === 10)) {
        // After strike on roll 2, or after spare: show X or number
        frame.roll3Text.setText(roll3 === 10 ? 'X' : roll3.toString());
      } else if (roll1 === 10 && roll2 !== 10) {
        // After strike on roll 1 and non-strike on roll 2: check if spare
        frame.roll3Text.setText(roll2 + roll3 === 10 ? '/' : roll3.toString());
      }
    }
  }
  
  // Show the scoreboard.
  show() {
    this.container.setVisible(true);
  }
  
  // Hide the scoreboard.
  hide() {
    this.container.setVisible(false);
  }
  
  // Destroy the scoreboard and clean up resources.
  destroy() {
    this.container.destroy();
  }
}

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { ScoreboardUI };
