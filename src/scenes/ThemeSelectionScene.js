/**
 * ThemeSelectionScene - UI for selecting lane themes
 * 
 * Displays available themes with locked/unlocked state
 * and allows theme switching.
 */

// Check if Phaser is available (not in test environment)
const BaseScene = typeof Phaser !== 'undefined' ? Phaser.Scene : class MockScene {
  constructor(config) {
    this.key = config.key;
  }
};

class ThemeSelectionScene extends BaseScene {
  constructor() {
    super({ key: 'ThemeSelectionScene' });
    this.themeManager = null;
    this.unlockManager = null;
    this.currentLevel = 1;
  }

  /**
   * Initialize scene with theme manager and unlock manager
   * @param {Object} data - Scene data
   * @param {ThemeManager} data.themeManager - Theme manager instance
   * @param {UnlockManager} data.unlockManager - Unlock manager instance
   * @param {number} data.currentLevel - Player's current level
   */
  create(data) {
    this.themeManager = data.themeManager;
    this.unlockManager = data.unlockManager;
    this.currentLevel = data.currentLevel || 1;
    
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
    this.add.text(width / 2, 40, 'Select Theme', {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Render theme grid
    this.renderThemeGrid();

    // Back button
    const backButton = this.add.text(width / 2, height - 40, 'Back', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene', {
        themeManager: this.themeManager,
        unlockManager: this.unlockManager
      });
    });
  }

  /**
   * Render grid of themes
   */
  renderThemeGrid() {
    const { width } = this.cameras.main;
    const themes = this.themeManager.getAllThemes();
    const startY = 120;
    const spacing = 80;

    themes.forEach((theme, index) => {
      const y = startY + (index * spacing);
      const isUnlocked = this.unlockManager.isUnlocked(theme.id);
      const isCurrent = this.themeManager.getCurrentTheme().id === theme.id;

      // Theme container
      const container = this.add.rectangle(width / 2, y, 600, 60, 
        isCurrent ? 0x4444ff : 0x333333
      ).setInteractive();

      // Theme name
      const nameText = this.add.text(width / 2 - 250, y, theme.name, {
        fontSize: '24px',
        color: isUnlocked ? '#ffffff' : '#666666'
      }).setOrigin(0, 0.5);

      // Lock/unlock indicator
      const statusText = this.add.text(width / 2 + 250, y, 
        isUnlocked ? (isCurrent ? '✓ Active' : 'Select') : `🔒 Level ${theme.unlockLevel}`,
        {
          fontSize: '20px',
          color: isUnlocked ? '#00ff00' : '#ff6666'
        }
      ).setOrigin(1, 0.5);

      // Click handler
      if (isUnlocked) {
        container.on('pointerdown', () => {
          this.selectTheme(theme.id);
          this.scene.restart({
            themeManager: this.themeManager,
            unlockManager: this.unlockManager,
            currentLevel: this.currentLevel
          });
        });
      }
    });
  }

  /**
   * Select a theme
   * @param {string} themeId - Theme identifier
   * @returns {boolean} True if theme was selected successfully
   */
  selectTheme(themeId) {
    // Check if theme is unlocked
    if (!this.unlockManager.isUnlocked(themeId)) {
      return false;
    }

    // Apply theme
    return this.themeManager.applyTheme(themeId);
  }

  /**
   * Get unlocked themes
   * @returns {Object[]} Array of unlocked themes
   */
  getUnlockedThemes() {
    return this.themeManager.getAllThemes().filter(theme =>
      this.unlockManager.isUnlocked(theme.id)
    );
  }

  /**
   * Get locked themes
   * @returns {Object[]} Array of locked themes
   */
  getLockedThemes() {
    return this.themeManager.getAllThemes().filter(theme =>
      !this.unlockManager.isUnlocked(theme.id)
    );
  }
}

// CJS export for Node.js test runner
if (typeof module !== 'undefined') module.exports = ThemeSelectionScene;
