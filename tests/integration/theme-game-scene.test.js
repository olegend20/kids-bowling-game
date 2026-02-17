const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const ThemeManager = require('../../src/systems/ThemeManager');

describe('GameScene Theme Integration', () => {
  let themeManager;

  beforeEach(() => {
    // Given: A ThemeManager instance (as would be used in GameScene)
    themeManager = new ThemeManager();
  });

  it('should provide theme colors for lane rendering', () => {
    // When: Getting current theme for rendering
    const theme = themeManager.getCurrentTheme();

    // Then: Theme should have all required color properties for lane
    assert.ok(theme.laneColors);
    assert.ok(theme.laneColors.primary);
    assert.ok(theme.laneColors.secondary);
    assert.ok(theme.laneColors.gutter);
    assert.ok(theme.background);
  });

  it('should provide theme colors for pin rendering', () => {
    // When: Getting current theme for rendering
    const theme = themeManager.getCurrentTheme();

    // Then: Theme should have all required color properties for pins
    assert.ok(theme.pinColors);
    assert.ok(theme.pinColors.body);
    assert.ok(theme.pinColors.stripe);
  });

  it('should allow switching themes for visual updates', () => {
    // Given: GameScene with default theme
    const initialTheme = themeManager.getCurrentTheme();
    assert.strictEqual(initialTheme.id, 'classic');

    // When: Switching to space theme
    themeManager.applyTheme('space');
    const newTheme = themeManager.getCurrentTheme();

    // Then: Theme colors should change
    assert.strictEqual(newTheme.id, 'space');
    assert.notStrictEqual(newTheme.background, initialTheme.background);
    assert.notStrictEqual(newTheme.laneColors.primary, initialTheme.laneColors.primary);
  });

  it('should convert hex colors to Phaser format', () => {
    // Given: Theme with hex color strings
    const theme = themeManager.getCurrentTheme();

    // When: Converting for Phaser (hex string to number)
    const phaserColor = parseInt(theme.background.replace('#', ''), 16);

    // Then: Should be a valid number
    assert.ok(typeof phaserColor === 'number');
    assert.ok(!isNaN(phaserColor));
  });
});
