const themes = require('../data/themes.json');

/**
 * ThemeManager - Manages lane themes
 * 
 * Handles theme selection and application for visual customization.
 */
class ThemeManager {
  constructor() {
    this.themes = themes;
    this.currentTheme = this.themes.find(t => t.id === 'classic');
  }

  /**
   * Apply a theme by ID
   * @param {string} themeId - Theme identifier
   * @returns {boolean} True if theme was applied successfully
   */
  applyTheme(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) {
      return false;
    }
    this.currentTheme = theme;
    return true;
  }

  /**
   * Get the currently active theme
   * @returns {Object} Current theme data
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get all available themes
   * @returns {Object[]} Array of all theme definitions
   */
  getAllThemes() {
    return [...this.themes];
  }

  /**
   * Get a specific theme by ID
   * @param {string} themeId - Theme identifier
   * @returns {Object|null} Theme data or null if not found
   */
  getThemeById(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    return theme || null;
  }
}

module.exports = ThemeManager;
