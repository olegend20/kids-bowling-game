const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('Integration: ThemeManager with persistence', () => {
  let ThemeManager;
  let LocalStorageAdapter;
  let themeManager;
  let adapter;

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      data: {},
      getItem(key) {
        return this.data[key] || null;
      },
      setItem(key, value) {
        this.data[key] = value;
      },
      removeItem(key) {
        delete this.data[key];
      },
      clear() {
        this.data = {};
      }
    };

    ThemeManager = require('../../src/systems/ThemeManager');
    LocalStorageAdapter = require('../../src/storage/LocalStorageAdapter');
    adapter = new LocalStorageAdapter();
    themeManager = new ThemeManager(adapter);
  });

  describe('Acceptance_Criterion_Theme_selection_persists', () => {
    it('Given theme selection, When applying theme, Then theme is saved', async () => {
      // Given: ThemeManager with storage
      // When: Applying a theme
      const result = await themeManager.applyTheme('space');

      // Then: Theme should be applied and saved
      assert.strictEqual(result, true, 'Theme should be applied');
      assert.strictEqual(themeManager.getCurrentTheme().id, 'space');
      
      const saved = await adapter.loadTheme();
      assert.strictEqual(saved, 'space', 'Theme should be persisted');
    });

    it('Given saved theme, When initializing, Then theme is restored', async () => {
      // Given: A saved theme
      await adapter.saveTheme('candy');

      // When: Initializing new ThemeManager
      const newManager = new ThemeManager(adapter);
      await newManager.init();

      // Then: Theme should be restored
      assert.strictEqual(newManager.getCurrentTheme().id, 'candy');
    });

    it('Given no saved theme, When initializing, Then uses default', async () => {
      // Given: No saved theme
      // When: Initializing ThemeManager
      await themeManager.init();

      // Then: Should use default (classic)
      assert.strictEqual(themeManager.getCurrentTheme().id, 'classic');
    });
  });

  describe('Error_Scenario_Storage_failure', () => {
    it('Given storage failure, When applying theme, Then theme still applies', async () => {
      // Given: Storage that fails
      const failingAdapter = {
        saveTheme: async () => { throw new Error('Storage error'); },
        loadTheme: async () => 'classic'
      };
      const manager = new ThemeManager(failingAdapter);

      // When: Applying theme
      const result = await manager.applyTheme('space');

      // Then: Theme should still be applied (graceful degradation)
      assert.strictEqual(result, true);
      assert.strictEqual(manager.getCurrentTheme().id, 'space');
    });
  });
});
