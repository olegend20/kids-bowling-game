const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const ThemeManager = require('../src/systems/ThemeManager');

describe('ThemeManager', () => {
  let themeManager;

  beforeEach(() => {
    themeManager = new ThemeManager();
  });

  it('should initialize with classic theme as default', () => {
    // Given: A new ThemeManager instance
    // When: Getting the current theme
    const currentTheme = themeManager.getCurrentTheme();

    // Then: The default theme should be classic
    assert.ok(currentTheme);
    assert.strictEqual(currentTheme.id, 'classic');
    assert.strictEqual(currentTheme.name, 'Classic Lanes');
  });

  it('should apply a valid theme', () => {
    // Given: A ThemeManager instance
    // When: Applying the space theme
    const result = themeManager.applyTheme('space');

    // Then: The theme should be applied successfully
    assert.strictEqual(result, true);
    const currentTheme = themeManager.getCurrentTheme();
    assert.strictEqual(currentTheme.id, 'space');
    assert.strictEqual(currentTheme.name, 'Space Station');
  });

  it('should not apply an invalid theme', () => {
    // Given: A ThemeManager instance
    // When: Attempting to apply a non-existent theme
    const result = themeManager.applyTheme('nonexistent');

    // Then: The theme should not be applied
    assert.strictEqual(result, false);
    const currentTheme = themeManager.getCurrentTheme();
    assert.strictEqual(currentTheme.id, 'classic'); // Should remain default
  });

  it('should return all available themes', () => {
    // Given: A ThemeManager instance
    // When: Getting all themes
    const themes = themeManager.getAllThemes();

    // Then: Should return 5 themes
    assert.strictEqual(themes.length, 5);
    assert.strictEqual(themes[0].id, 'classic');
    assert.strictEqual(themes[1].id, 'space');
    assert.strictEqual(themes[2].id, 'candy');
    assert.strictEqual(themes[3].id, 'neon');
    assert.strictEqual(themes[4].id, 'jungle');
  });

  it('should get theme by id', () => {
    // Given: A ThemeManager instance
    // When: Getting a theme by id
    const theme = themeManager.getThemeById('candy');

    // Then: Should return the correct theme
    assert.ok(theme);
    assert.strictEqual(theme.id, 'candy');
    assert.strictEqual(theme.name, 'Candy Land');
    assert.strictEqual(theme.unlockLevel, 10);
  });

  it('should return null for invalid theme id', () => {
    // Given: A ThemeManager instance
    // When: Getting a non-existent theme
    const theme = themeManager.getThemeById('invalid');

    // Then: Should return null
    assert.strictEqual(theme, null);
  });

  it('should have correct color properties for each theme', () => {
    // Given: A ThemeManager instance
    // When: Getting the classic theme
    const theme = themeManager.getThemeById('classic');

    // Then: Should have all required color properties
    assert.ok(theme.background);
    assert.ok(theme.laneColors);
    assert.ok(theme.laneColors.primary);
    assert.ok(theme.laneColors.secondary);
    assert.ok(theme.laneColors.gutter);
    assert.ok(theme.pinColors);
    assert.ok(theme.pinColors.body);
    assert.ok(theme.pinColors.stripe);
  });
});
