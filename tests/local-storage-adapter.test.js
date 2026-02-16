const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const LocalStorageAdapter = require('../src/storage/LocalStorageAdapter');

// Mock localStorage for Node.js environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

describe('LocalStorageAdapter', () => {
  let adapter;
  let mockLocalStorage;

  beforeEach(() => {
    // Setup mock localStorage
    mockLocalStorage = new LocalStorageMock();
    global.localStorage = mockLocalStorage;
    adapter = new LocalStorageAdapter();
  });

  describe('savePlayerData', () => {
    it('should save player data to localStorage', async () => {
      const playerData = { level: 5, xp: 500, name: 'TestPlayer' };
      
      await adapter.savePlayerData(playerData);
      
      const saved = localStorage.getItem('chelsea_player_data');
      assert.strictEqual(saved, JSON.stringify(playerData));
    });

    it('should throw error if localStorage is unavailable', async () => {
      // Make localStorage unavailable
      global.localStorage = undefined;
      adapter = new LocalStorageAdapter();
      
      await assert.rejects(
        async () => await adapter.savePlayerData({ level: 1 }),
        { message: 'localStorage is not available' }
      );
      
      // Restore
      global.localStorage = mockLocalStorage;
    });
  });

  describe('loadPlayerData', () => {
    it('should load player data from localStorage', async () => {
      const playerData = { level: 5, xp: 500, name: 'TestPlayer' };
      localStorage.setItem('chelsea_player_data', JSON.stringify(playerData));
      
      const loaded = await adapter.loadPlayerData();
      
      assert.deepStrictEqual(loaded, playerData);
    });

    it('should return null if no player data exists', async () => {
      const loaded = await adapter.loadPlayerData();
      assert.strictEqual(loaded, null);
    });

    it('should return null if player data is invalid JSON', async () => {
      localStorage.setItem('chelsea_player_data', 'invalid json {');
      
      const loaded = await adapter.loadPlayerData();
      
      assert.strictEqual(loaded, null);
    });

    it('should return null if localStorage is unavailable', async () => {
      global.localStorage = undefined;
      adapter = new LocalStorageAdapter();
      
      const loaded = await adapter.loadPlayerData();
      
      assert.strictEqual(loaded, null);
      
      // Restore
      global.localStorage = mockLocalStorage;
    });
  });

  describe('saveSettings', () => {
    it('should save settings to localStorage', async () => {
      const settings = { volume: 0.8, difficulty: 'medium' };
      
      await adapter.saveSettings(settings);
      
      const saved = localStorage.getItem('chelsea_settings');
      assert.strictEqual(saved, JSON.stringify(settings));
    });

    it('should throw error if localStorage is unavailable', async () => {
      global.localStorage = undefined;
      adapter = new LocalStorageAdapter();
      
      await assert.rejects(
        async () => await adapter.saveSettings({ volume: 0.5 }),
        { message: 'localStorage is not available' }
      );
      
      // Restore
      global.localStorage = mockLocalStorage;
    });
  });

  describe('loadSettings', () => {
    it('should load settings from localStorage', async () => {
      const settings = { volume: 0.8, difficulty: 'medium' };
      localStorage.setItem('chelsea_settings', JSON.stringify(settings));
      
      const loaded = await adapter.loadSettings();
      
      assert.deepStrictEqual(loaded, settings);
    });

    it('should return null if no settings exist', async () => {
      const loaded = await adapter.loadSettings();
      assert.strictEqual(loaded, null);
    });

    it('should return null if settings are invalid JSON', async () => {
      localStorage.setItem('chelsea_settings', 'invalid json {');
      
      const loaded = await adapter.loadSettings();
      
      assert.strictEqual(loaded, null);
    });

    it('should return null if localStorage is unavailable', async () => {
      global.localStorage = undefined;
      adapter = new LocalStorageAdapter();
      
      const loaded = await adapter.loadSettings();
      
      assert.strictEqual(loaded, null);
      
      // Restore
      global.localStorage = mockLocalStorage;
    });
  });

  describe('Error handling', () => {
    it('should handle quota exceeded error on savePlayerData', async () => {
      // Mock quota exceeded - need to preserve getItem for availability check
      const originalSetItem = localStorage.setItem;
      let callCount = 0;
      localStorage.setItem = (key, value) => {
        callCount++;
        // First call is availability check - let it succeed
        if (callCount === 1) {
          mockLocalStorage.store[key] = value;
          return;
        }
        // Second call is actual save - throw quota error
        const error = new Error('Quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      };
      
      await assert.rejects(
        async () => await adapter.savePlayerData({ level: 1 }),
        { message: 'localStorage quota exceeded' }
      );
      
      // Restore
      localStorage.setItem = originalSetItem;
    });

    it('should handle quota exceeded error on saveSettings', async () => {
      // Mock quota exceeded - need to preserve getItem for availability check
      const originalSetItem = localStorage.setItem;
      let callCount = 0;
      localStorage.setItem = (key, value) => {
        callCount++;
        // First call is availability check - let it succeed
        if (callCount === 1) {
          mockLocalStorage.store[key] = value;
          return;
        }
        // Second call is actual save - throw quota error
        const error = new Error('Quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      };
      
      await assert.rejects(
        async () => await adapter.saveSettings({ volume: 0.5 }),
        { message: 'localStorage quota exceeded' }
      );
      
      // Restore
      localStorage.setItem = originalSetItem;
    });
  });
});
