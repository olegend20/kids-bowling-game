/**
 * AchievementScene - Display all achievements with locked/unlocked state
 * 
 * Shows grid of achievements with progress bars and unlock status.
 */

const BaseScene = typeof Phaser !== 'undefined' ? Phaser.Scene : class MockScene {
  constructor(config) {
    this.key = config.key;
  }
};

class AchievementScene extends BaseScene {
  constructor() {
    super({ key: 'AchievementScene' });
    this.achievementSystem = null;
  }

  /**
   * Initialize scene with achievement system
   * @param {Object} data - Scene data
   * @param {AchievementSystem} data.achievementSystem - Achievement system instance
   */
  create(data) {
    this.achievementSystem = data.achievementSystem;
    
    if (typeof Phaser !== 'undefined' && this.cameras) {
      this.renderUI();
    }
  }

  /**
   * Render the UI (only called when Phaser is available)
   */
  renderUI() {
    const { width, height } = this.cameras.main;
    
    this.add.text(width / 2, 40, 'Achievements', {
      fontSize: '36px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.renderAchievementGrid();
    
    const backButton = this.add.text(40, height - 40, 'Back', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#666',
      padding: { x: 20, y: 10 }
    }).setOrigin(0, 1).setInteractive();
    
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }

  /**
   * Render grid of achievements
   */
  renderAchievementGrid() {
    const achievementsData = require('../data/achievements.json');
    const { width } = this.cameras.main;
    const startY = 100;
    const cols = 4;
    const cellWidth = 180;
    const cellHeight = 140;
    const startX = (width - (cols * cellWidth)) / 2;
    
    achievementsData.forEach((achievement, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * cellWidth + cellWidth / 2;
      const y = startY + row * cellHeight;
      
      this.renderAchievementCard(achievement, x, y);
    });
  }

  /**
   * Render individual achievement card
   * @param {Object} achievement - Achievement data
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  renderAchievementCard(achievement, x, y) {
    const isUnlocked = this.achievementSystem.getUnlockedAchievements().includes(achievement.id);
    const bgColor = isUnlocked ? 0x2a5a2a : 0x3a3a3a;
    
    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 1);
    bg.fillRoundedRect(x - 80, y - 50, 160, 120, 8);
    
    const nameText = this.add.text(x, y - 20, achievement.name, {
      fontSize: '16px',
      color: isUnlocked ? '#fff' : '#888',
      fontStyle: 'bold',
      wordWrap: { width: 150 }
    }).setOrigin(0.5);
    
    const descText = this.add.text(x, y + 10, achievement.description, {
      fontSize: '12px',
      color: isUnlocked ? '#ccc' : '#666',
      wordWrap: { width: 150 }
    }).setOrigin(0.5);
    
    if (isUnlocked) {
      this.add.text(x, y + 40, '✓ UNLOCKED', {
        fontSize: '12px',
        color: '#4CAF50',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    } else {
      this.add.text(x, y + 40, 'LOCKED', {
        fontSize: '12px',
        color: '#888'
      }).setOrigin(0.5);
    }
  }
}

module.exports = AchievementScene;
