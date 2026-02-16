const StorageAdapter = require('./StorageAdapter');

/**
 * LocalStorageAdapter - Browser localStorage implementation
 * 
 * Stores player data and settings in browser localStorage using JSON serialization.
 * Provides error handling for quota exceeded and parse errors.
 */
class LocalStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.PLAYER_DATA_KEY = 'chelsea_player_data';
    this.SETTINGS_KEY = 'chelsea_settings';
  }

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  _isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Save player data to localStorage
   * @param {Object} playerData - Player data to save
   * @returns {Promise<void>}
   * @throws {Error} If localStorage unavailable or quota exceeded
   */
  async savePlayerData(playerData) {
    if (!this._isLocalStorageAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      const json = JSON.stringify(playerData);
      localStorage.setItem(this.PLAYER_DATA_KEY, json);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('localStorage quota exceeded');
      }
      throw new Error(`Failed to save player data: ${error.message}`);
    }
  }

  /**
   * Load player data from localStorage
   * @returns {Promise<Object|null>} Player data or null if not found/invalid
   */
  async loadPlayerData() {
    if (!this._isLocalStorageAvailable()) {
      return null;
    }

    try {
      const json = localStorage.getItem(this.PLAYER_DATA_KEY);
      if (!json) {
        return null;
      }
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed to load player data:', error);
      return null;
    }
  }

  /**
   * Save settings to localStorage
   * @param {Object} settings - Settings to save
   * @returns {Promise<void>}
   * @throws {Error} If localStorage unavailable or quota exceeded
   */
  async saveSettings(settings) {
    if (!this._isLocalStorageAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      const json = JSON.stringify(settings);
      localStorage.setItem(this.SETTINGS_KEY, json);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('localStorage quota exceeded');
      }
      throw new Error(`Failed to save settings: ${error.message}`);
    }
  }

  /**
   * Load settings from localStorage
   * @returns {Promise<Object|null>} Settings or null if not found/invalid
   */
  async loadSettings() {
    if (!this._isLocalStorageAvailable()) {
      return null;
    }

    try {
      const json = localStorage.getItem(this.SETTINGS_KEY);
      if (!json) {
        return null;
      }
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }
}

module.exports = LocalStorageAdapter;
