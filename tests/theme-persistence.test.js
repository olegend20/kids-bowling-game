const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('Feature: Theme persistence', () => {
  let LocalStorageAdapter;
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

    LocalStorageAdapter = require('../src/storage/LocalStorageAdapter');
    adapter = new LocalStorageAdapter();
  });

  describe('Acceptance_Criterion_Theme_persists_across_sessions', () => {
    it('Given selected theme, When saving, Then theme is persisted', async () => {
      // Given: A selected theme
      const themeId = 'space';

      // When: Saving theme
      await adapter.saveTheme(themeId);

      // Then: Theme should be in localStorage
      const saved = localStorage.getItem('chelsea_theme');
      assert.ok(saved, 'Theme should be saved');
      assert.strictEqual(saved, themeId, 'Saved theme should match');
    });

    it('Given saved theme, When loading, Then theme is restored', async () => {
      // Given: A saved theme
      localStorage.setItem('chelsea_theme', 'candy');

      // When: Loading theme
      const theme = await adapter.loadTheme();

      // Then: Theme should be restored
      assert.strictEqual(theme, 'candy', 'Theme should be restored');
    });

    it('Given no saved theme, When loading, Then returns default', async () => {
      // Given: No saved theme
      // When: Loading theme
      const theme = await adapter.loadTheme();

      // Then: Should return default (classic)
      assert.strictEqual(theme, 'classic', 'Should return default theme');
    });
  });

  describe('Error_Scenario_localStorage_unavailable', () => {
    it('Given localStorage unavailable, When saving theme, Then throws error', async () => {
      // Given: localStorage unavailable
      global.localStorage = null;
      adapter = new LocalStorageAdapter();

      // When/Then: Saving should throw
      await assert.rejects(
        async () => await adapter.saveTheme('space'),
        /localStorage is not available/
      );
    });

    it('Given localStorage unavailable, When loading theme, Then returns default', async () => {
      // Given: localStorage unavailable
      global.localStorage = null;
      adapter = new LocalStorageAdapter();

      // When: Loading theme
      const theme = await adapter.loadTheme();

      // Then: Should return default
      assert.strictEqual(theme, 'classic');
    });
  });
});
