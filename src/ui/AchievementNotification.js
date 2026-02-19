/**
 * AchievementNotification - Popup notification for unlocked achievements
 * 
 * Displays achievement name and description with slide-in animation.
 */
class AchievementNotification {
  /**
   * @param {Phaser.Scene} scene - The scene this notification belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} achievementData - Achievement data (name, description, icon)
   */
  constructor(scene, x, y, achievementData) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.achievementData = achievementData;
    
    this.container = scene.add.container(x, y);
    this.container.setDepth(1000);
    this.container.setAlpha(0);
    
    const bg = scene.add.graphics();
    bg.fillStyle(0x2a5a2a, 0.95);
    bg.fillRoundedRect(-150, -40, 300, 80, 8);
    
    const nameText = scene.add.text(0, -15, achievementData.name, {
      fontSize: '20px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const descText = scene.add.text(0, 10, achievementData.description, {
      fontSize: '14px',
      color: '#ccc'
    }).setOrigin(0.5);
    
    this.container.add([bg, nameText, descText]);
  }

  /**
   * Show the notification with animation
   */
  show() {
    this.container.setPosition(this.x, this.y - 50);
    
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: this.y,
      duration: 300,
      ease: 'Back.easeOut'
    });
    
    this.scene.time.delayedCall(3000, () => {
      this.hide();
    });
  }

  /**
   * Hide the notification with animation
   */
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      y: this.y - 50,
      duration: 300,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.destroy();
      }
    });
  }

  /**
   * Destroy the notification
   */
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}

if (typeof module !== 'undefined') module.exports = AchievementNotification;
