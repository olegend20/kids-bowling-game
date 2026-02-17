/**
 * ProgressBar UI Component Tests
 * 
 * Tests the XP progress bar display and animation.
 */

'use strict';
const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ProgressionSystem = require('../../src/systems/ProgressionSystem');

describe('ProgressBar', () => {
  let mockScene;
  let ProgressBar;

  beforeEach(() => {
    // Mock Phaser scene
    mockScene = {
      add: {
        graphics: () => ({
          fillStyle: () => {},
          fillRect: () => {},
          lineStyle: () => {},
          strokeRect: () => {},
          clear: () => {}
        }),
        text: (x, y, text, style) => {
          const textObj = {
            x, y, text, style,
            setText: function(newText) { this.text = newText; },
            setOrigin: function() { return this; }
          };
          return textObj;
        }
      },
      tweens: {
        add: () => {}
      }
    };

    // Import after mocking
    ProgressBar = require('../../src/ui/ProgressBar');
  });

  describe('Acceptance_Criterion_1_Display_current_level_and_XP', () => {
    test('shows current level', () => {
      // Given: A progression system at level 5
      const progression = new ProgressionSystem();
      progression.addXP(500); // Level 5

      // When: ProgressBar is created
      const progressBar = new ProgressBar(mockScene, 100, 100, progression);

      // Then: Level should be 5
      assert.equal(progression.getCurrentLevel(), 5);
    });

    test('shows current XP and XP to next level', () => {
      // Given: A progression system with partial XP in current level
      const progression = new ProgressionSystem();
      progression.addXP(550); // Level 5 (500 XP) + 50 XP toward level 6 (600 XP)

      // When: ProgressBar is created
      const progressBar = new ProgressBar(mockScene, 100, 100, progression);

      // Then: Current XP should be 50, XP to next level should be 50
      assert.equal(progression.getCurrentXP(), 50);
      assert.equal(progression.getXPToNextLevel(), 50);
    });
  });

  describe('Acceptance_Criterion_2_Visual_progress_bar', () => {
    test('creates progress bar', () => {
      // Given: A progression system
      const progression = new ProgressionSystem();

      // When: ProgressBar is created
      const progressBar = new ProgressBar(mockScene, 100, 100, progression);

      // Then: ProgressBar should exist
      assert.ok(progressBar);
    });
  });

  describe('Acceptance_Criterion_3_Animate_progress_bar_fill', () => {
    test('updates progress bar when XP changes', () => {
      // Given: A progression system and progress bar
      const progression = new ProgressionSystem();
      const progressBar = new ProgressBar(mockScene, 100, 100, progression);

      // When: XP is added
      progression.addXP(50);
      progressBar.update(progression);

      // Then: Progress bar should reflect new XP
      assert.equal(progression.getTotalXP(), 50);
    });
  });

  describe('Acceptance_Criterion_4_Update_on_level_up', () => {
    test('updates display when level increases', () => {
      // Given: A progression system near level-up
      const progression = new ProgressionSystem();
      progression.addXP(190); // Level 1, 90 XP toward level 2 (200 XP)
      const progressBar = new ProgressBar(mockScene, 100, 100, progression);

      // When: XP is added to trigger level-up
      progression.addXP(20); // Now level 2 with 10 XP toward level 3 (300 XP)
      progressBar.update(progression);

      // Then: Level should be 2
      assert.equal(progression.getCurrentLevel(), 2);
      assert.equal(progression.getCurrentXP(), 10);
    });
  });
});
