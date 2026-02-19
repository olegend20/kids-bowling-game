/**
 * BallSelectionScene - UI for selecting balls
 * 
 * Displays available balls with locked/unlocked state,
 * shows stats on hover, and allows selection.
 */

// Check if Phaser is available (not in test environment)
const BaseScene = typeof Phaser !== 'undefined' ? Phaser.Scene : class MockScene {
  constructor(config) {
    this.key = config.key;
  }
};

class BallSelectionScene extends BaseScene {
  constructor() {
    super({ key: 'BallSelectionScene' });
    this.selectedBall = null;
    this.ballsData = null;
    this.unlockManager = null;
  }

  /**
   * Initialize scene with unlock manager and player level
   * @param {Object} data - Scene data
   * @param {UnlockManager} data.unlockManager - Unlock manager instance
   * @param {number} data.currentLevel - Player's current level
   */
  create(data) {
    this.unlockManager = data.unlockManager;
    this.currentLevel = data.currentLevel || 1;
    
    // Load ball data
    this.ballsData = this.cache?.json?.get('balls') || require('../data/balls.json');
    
    // Only render if we have Phaser (not in test environment)
    if (typeof Phaser !== 'undefined' && this.cameras) {
      this.renderUI();
    }
  }

  /**
   * Render the UI (only called when Phaser is available)
   */
  renderUI() {
    const { width, height } = this.cameras.main;
    
    // Title
    this.add.text(width / 2, 40, 'Select Your Ball', {
      fontSize: '36px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Render ball grid
    this.renderBallGrid();
    
    // Back button
    const backButton = this.add.text(40, height - 40, 'Back', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#666',
      padding: { x: 20, y: 10 }
    }).setOrigin(0, 1).setInteractive();
    
    backButton.on('pointerdown', () => {
      this.scene.start('NameEntryScene');
    });
  }

  /**
   * Render grid of balls
   */
  renderBallGrid() {
    const { width } = this.cameras.main;
    const startY = 100;
    const cols = 5;
    const cellWidth = 140;
    const cellHeight = 160;
    const startX = (width - (cols * cellWidth)) / 2;
    
    this.ballsData.forEach((ball, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * cellWidth + cellWidth / 2;
      const y = startY + row * cellHeight;
      
      this.renderBallCard(ball, x, y);
    });
  }

  /**
   * Render individual ball card
   * @param {Object} ball - Ball data
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  renderBallCard(ball, x, y) {
    const isUnlocked = this.unlockManager.isUnlocked(ball.id);
    const bgColor = isUnlocked ? 0x2a5a2a : 0x3a3a3a;
    
    // Background
    const bg = this.add.rectangle(x, y, 120, 140, bgColor).setOrigin(0.5);
    
    // Ball name
    this.add.text(x, y - 40, ball.name, {
      fontSize: '14px',
      color: '#fff',
      align: 'center',
      wordWrap: { width: 110 }
    }).setOrigin(0.5);
    
    // Lock/unlock indicator
    const statusText = isUnlocked ? '✓' : '🔒';
    this.add.text(x, y, statusText, {
      fontSize: '32px'
    }).setOrigin(0.5);
    
    // Unlock level
    this.add.text(x, y + 30, `Level ${ball.unlockLevel}`, {
      fontSize: '12px',
      color: isUnlocked ? '#8f8' : '#888'
    }).setOrigin(0.5);
    
    // Make interactive if unlocked
    if (isUnlocked) {
      bg.setInteractive();
      bg.on('pointerdown', () => {
        this.selectBall(ball.id);
      });
      bg.on('pointerover', () => {
        this.showBallStats(ball);
      });
      bg.on('pointerout', () => {
        this.hideBallStats();
      });
    }
  }

  /**
   * Select a ball
   * @param {string} ballId - Ball identifier
   */
  selectBall(ballId) {
    if (!this.unlockManager.isUnlocked(ballId)) {
      return;
    }
    this.selectedBall = ballId;
  }

  /**
   * Get selected ball data
   * @returns {Object|null} Ball data or null
   */
  getSelectedBallData() {
    if (!this.selectedBall) return null;
    return this.ballsData.find(b => b.id === this.selectedBall);
  }

  /**
   * Get unlocked balls
   * @returns {Object[]} Array of unlocked ball data
   */
  getUnlockedBalls() {
    return this.ballsData.filter(ball => this.unlockManager.isUnlocked(ball.id));
  }

  /**
   * Get locked balls
   * @returns {Object[]} Array of locked ball data
   */
  getLockedBalls() {
    return this.ballsData.filter(ball => !this.unlockManager.isUnlocked(ball.id));
  }

  /**
   * Show ball stats tooltip
   * @param {Object} ball - Ball data
   */
  showBallStats(ball) {
    // TODO: Implement stats tooltip
  }

  /**
   * Hide ball stats tooltip
   */
  hideBallStats() {
    // TODO: Implement stats tooltip hiding
  }
}

if (typeof module !== 'undefined') module.exports = BallSelectionScene;
