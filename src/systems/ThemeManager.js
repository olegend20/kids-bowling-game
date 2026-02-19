// Theme data
const themes = [
  {
    "id": "classic",
    "name": "Classic Lanes",
    "unlockLevel": 1,
    "background": "#2c1810",
    "laneColors": {
      "primary": "#8b4513",
      "secondary": "#a0522d",
      "gutter": "#1a0f08"
    },
    "pinColors": {
      "body": "#ffffff",
      "stripe": "#ff0000"
    }
  },
  {
    "id": "space",
    "name": "Space Station",
    "unlockLevel": 5,
    "background": "#0a0a1a",
    "laneColors": {
      "primary": "#1a1a3a",
      "secondary": "#2a2a5a",
      "gutter": "#050510"
    },
    "pinColors": {
      "body": "#c0c0ff",
      "stripe": "#00ffff"
    }
  },
  {
    "id": "candy",
    "name": "Candy Land",
    "unlockLevel": 10,
    "background": "#ffb3d9",
    "laneColors": {
      "primary": "#ff69b4",
      "secondary": "#ff1493",
      "gutter": "#ff85c1"
    },
    "pinColors": {
      "body": "#ffffff",
      "stripe": "#ff00ff"
    }
  },
  {
    "id": "neon",
    "name": "Neon Nights",
    "unlockLevel": 15,
    "background": "#0d0d0d",
    "laneColors": {
      "primary": "#1a1a1a",
      "secondary": "#2d2d2d",
      "gutter": "#000000"
    },
    "pinColors": {
      "body": "#00ff00",
      "stripe": "#ff00ff"
    }
  },
  {
    "id": "jungle",
    "name": "Jungle Adventure",
    "unlockLevel": 20,
    "background": "#1a3a1a",
    "laneColors": {
      "primary": "#2d5a2d",
      "secondary": "#3d7a3d",
      "gutter": "#0f1f0f"
    },
    "pinColors": {
      "body": "#8b4513",
      "stripe": "#ffff00"
    }
  }
];

/**
 * ThemeManager - Manages lane themes
 * 
 * Handles theme selection and application for visual customization.
 * Persists theme selection to localStorage.
 */
class ThemeManager {
  constructor(storageAdapter = null) {
    this.themes = themes;
    this.currentTheme = this.themes.find(t => t.id === 'classic');
    this.storageAdapter = storageAdapter;
  }

  /**
   * Initialize theme manager and load saved theme
   * @returns {Promise<void>}
   */
  async init() {
    if (this.storageAdapter) {
      const savedThemeId = await this.storageAdapter.loadTheme();
      if (savedThemeId) {
        this.applyTheme(savedThemeId);
      }
    }
  }

  /**
   * Apply a theme by ID
   * @param {string} themeId - Theme identifier
   * @param {boolean} persist - Whether to save to storage (default: true)
   * @returns {boolean} True if theme was applied successfully
   */
  async applyTheme(themeId, persist = true) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) {
      return false;
    }
    this.currentTheme = theme;
    
    // Persist to storage
    if (persist && this.storageAdapter) {
      try {
        await this.storageAdapter.saveTheme(themeId);
      } catch (error) {
        console.error('Failed to persist theme:', error);
      }
    }
    
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

// CJS export for Node.js test runner
if (typeof module !== 'undefined') module.exports = ThemeManager;
