const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('Feature: Theme Selection UI', () => {
  let ThemeSelectionScene;
  let scene;
  let mockThemeManager;
  let mockUnlockManager;

  beforeEach(() => {
    // Mock dependencies
    mockThemeManager = {
      themes: [
        { id: 'classic', name: 'Classic Lanes', unlockLevel: 1 },
        { id: 'space', name: 'Space Station', unlockLevel: 5 },
        { id: 'candy', name: 'Candy Land', unlockLevel: 10 }
      ],
      currentTheme: { id: 'classic', name: 'Classic Lanes', unlockLevel: 1 },
      applyTheme: function(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (theme) {
          this.currentTheme = theme;
          return true;
        }
        return false;
      },
      getAllThemes: function() { return this.themes; },
      getCurrentTheme: function() { return this.currentTheme; }
    };

    mockUnlockManager = {
      isUnlocked: function(themeId) {
        const theme = mockThemeManager.themes.find(t => t.id === themeId);
        return theme && theme.unlockLevel <= 5; // Level 5 player
      }
    };

    // Load the scene
    ThemeSelectionScene = require('../src/scenes/ThemeSelectionScene');
    scene = new ThemeSelectionScene();
  });

  describe('Acceptance_Criterion_Show_unlocked_themes', () => {
    it('Given player at level 5, When viewing themes, Then shows unlocked themes', () => {
      // Given: Player at level 5
      const currentLevel = 5;

      // When: Creating scene
      scene.create({
        themeManager: mockThemeManager,
        unlockManager: mockUnlockManager,
        currentLevel
      });

      // Then: Should identify unlocked themes
      const unlockedThemes = scene.getUnlockedThemes();
      assert.strictEqual(unlockedThemes.length, 2, 'Should have 2 unlocked themes');
      assert.strictEqual(unlockedThemes[0].id, 'classic');
      assert.strictEqual(unlockedThemes[1].id, 'space');
    });

    it('Given player at level 1, When viewing themes, Then shows only classic theme', () => {
      // Given: Player at level 1
      mockUnlockManager.isUnlocked = function(themeId) {
        const theme = mockThemeManager.themes.find(t => t.id === themeId);
        return theme && theme.unlockLevel <= 1;
      };

      // When: Creating scene
      scene.create({
        themeManager: mockThemeManager,
        unlockManager: mockUnlockManager,
        currentLevel: 1
      });

      // Then: Should show only classic theme
      const unlockedThemes = scene.getUnlockedThemes();
      assert.strictEqual(unlockedThemes.length, 1);
      assert.strictEqual(unlockedThemes[0].id, 'classic');
    });
  });

  describe('Acceptance_Criterion_Allow_theme_switching', () => {
    it('Given unlocked theme, When selecting theme, Then theme is applied', () => {
      // Given: Scene with unlocked themes
      scene.create({
        themeManager: mockThemeManager,
        unlockManager: mockUnlockManager,
        currentLevel: 5
      });

      // When: Selecting space theme
      const result = scene.selectTheme('space');

      // Then: Theme should be applied
      assert.strictEqual(result, true, 'Theme selection should succeed');
      assert.strictEqual(mockThemeManager.currentTheme.id, 'space');
    });

    it('Given locked theme, When attempting to select, Then selection is prevented', () => {
      // Given: Scene with limited unlocks
      scene.create({
        themeManager: mockThemeManager,
        unlockManager: mockUnlockManager,
        currentLevel: 5
      });

      // When: Attempting to select locked theme
      const result = scene.selectTheme('candy');

      // Then: Selection should fail
      assert.strictEqual(result, false, 'Locked theme selection should fail');
      assert.strictEqual(mockThemeManager.currentTheme.id, 'classic', 'Theme should not change');
    });
  });

  describe('Acceptance_Criterion_Show_locked_themes', () => {
    it('Given player at level 5, When viewing themes, Then shows locked themes', () => {
      // Given: Player at level 5
      scene.create({
        themeManager: mockThemeManager,
        unlockManager: mockUnlockManager,
        currentLevel: 5
      });

      // When: Getting locked themes
      const lockedThemes = scene.getLockedThemes();

      // Then: Should show candy theme as locked
      assert.strictEqual(lockedThemes.length, 1);
      assert.strictEqual(lockedThemes[0].id, 'candy');
      assert.strictEqual(lockedThemes[0].unlockLevel, 10);
    });
  });

  describe('Error_Scenario_Invalid_theme_id', () => {
    it('Given invalid theme ID, When selecting, Then returns false', () => {
      // Given: Scene initialized
      scene.create({
        themeManager: mockThemeManager,
        unlockManager: mockUnlockManager,
        currentLevel: 5
      });

      // When: Selecting invalid theme
      const result = scene.selectTheme('invalid_theme');

      // Then: Should return false
      assert.strictEqual(result, false);
    });
  });
});
