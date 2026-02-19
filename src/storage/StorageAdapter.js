/**
 * StorageAdapter - Abstract base class for data persistence
 * 
 * Defines the interface for saving and loading player data and settings.
 * Implementations must override all methods.
 */
class StorageAdapter {
  /**
   * Save player data
   * @param {Object} playerData - Player data to save
   * @returns {Promise<void>}
   * @throws {Error} If save fails
   */
  async savePlayerData(playerData) {
    throw new Error('savePlayerData() must be implemented by subclass');
  }

  /**
   * Load player data
   * @returns {Promise<Object|null>} Player data or null if not found
   */
  async loadPlayerData() {
    throw new Error('loadPlayerData() must be implemented by subclass');
  }

  /**
   * Save settings
   * @param {Object} settings - Settings to save
   * @returns {Promise<void>}
   * @throws {Error} If save fails
   */
  async saveSettings(settings) {
    throw new Error('saveSettings() must be implemented by subclass');
  }

  /**
   * Load settings
   * @returns {Promise<Object|null>} Settings or null if not found
   */
  async loadSettings() {
    throw new Error('loadSettings() must be implemented by subclass');
  }
}

if (typeof module !== 'undefined') module.exports = StorageAdapter;
