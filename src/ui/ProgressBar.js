/**
 * ProgressBar - XP progress bar UI component
 * 
 * Displays current level, XP progress, and animates progress bar fill.
 */
class ProgressBar {
  /**
   * @param {Phaser.Scene} scene - The scene this progress bar belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {ProgressionSystem} progression - The progression system to display
   */
  constructor(scene, x, y, progression) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 20;
    
    this.bgGraphics = scene.add.graphics();
    this.fillGraphics = scene.add.graphics();
    
    this.levelText = scene.add.text(x, y - 25, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.xpText = scene.add.text(x, y + 30, '', {
      fontSize: '14px',
      color: '#cccccc'
    }).setOrigin(0.5);
    
    this.currentFillWidth = 0;
    this.update(progression);
  }
  
  /**
   * Update the progress bar display
   * @param {ProgressionSystem} progression - Updated progression system
   */
  update(progression) {
    const level = progression.getCurrentLevel();
    const currentXP = progression.getCurrentXP();
    const xpToNext = progression.getXPToNextLevel();
    const totalXPForLevel = currentXP + xpToNext;
    
    this.levelText.setText(`Level ${level}`);
    this.xpText.setText(`${currentXP} / ${totalXPForLevel} XP`);
    
    const fillPercent = totalXPForLevel > 0 ? currentXP / totalXPForLevel : 0;
    const targetFillWidth = this.width * fillPercent;
    
    if (this.scene.tweens) {
      this.scene.tweens.add({
        targets: this,
        currentFillWidth: targetFillWidth,
        duration: 300,
        ease: 'Cubic.easeOut',
        onUpdate: () => this._render()
      });
    } else {
      this.currentFillWidth = targetFillWidth;
      this._render();
    }
  }
  
  /**
   * Render the progress bar graphics
   * @private
   */
  _render() {
    this.bgGraphics.clear();
    this.fillGraphics.clear();
    
    const barX = this.x - this.width / 2;
    const barY = this.y - this.height / 2;
    
    // Background
    this.bgGraphics.fillStyle(0x333333, 1);
    this.bgGraphics.fillRect(barX, barY, this.width, this.height);
    
    // Border
    this.bgGraphics.lineStyle(2, 0x666666, 1);
    this.bgGraphics.strokeRect(barX, barY, this.width, this.height);
    
    // Fill
    if (this.currentFillWidth > 0) {
      this.fillGraphics.fillStyle(0x00ff00, 1);
      this.fillGraphics.fillRect(barX, barY, this.currentFillWidth, this.height);
    }
  }
}

if (typeof module !== 'undefined') module.exports = ProgressBar;
