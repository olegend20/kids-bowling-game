const { describe, it } = require('node:test');
const assert = require('node:assert');
const ProgressionSystem = require('../src/systems/ProgressionSystem');

describe('ProgressionSystem', () => {
  describe('Constructor', () => {
    it('should initialize with level 1 and 0 XP', () => {
      const system = new ProgressionSystem();
      assert.strictEqual(system.getCurrentLevel(), 1);
      assert.strictEqual(system.getCurrentXP(), 0);
      assert.strictEqual(system.getTotalXP(), 0);
    });
  });

  describe('calculateXPForLevel', () => {
    it('should return 0 for level 1', () => {
      const system = new ProgressionSystem();
      assert.strictEqual(system.calculateXPForLevel(1), 0);
    });

    it('should return 200 for level 2 (2 * 100)', () => {
      const system = new ProgressionSystem();
      assert.strictEqual(system.calculateXPForLevel(2), 200);
    });

    it('should return 1000 for level 10 (10 * 100)', () => {
      const system = new ProgressionSystem();
      assert.strictEqual(system.calculateXPForLevel(10), 1000);
    });
  });

  describe('addXP', () => {
    it('should add XP without level-up when below threshold', () => {
      const system = new ProgressionSystem();
      system.addXP(100);
      assert.strictEqual(system.getCurrentLevel(), 1);
      assert.strictEqual(system.getCurrentXP(), 100);
      assert.strictEqual(system.getTotalXP(), 100);
    });

    it('should trigger level-up when reaching threshold', () => {
      const system = new ProgressionSystem();
      system.addXP(200);
      assert.strictEqual(system.getCurrentLevel(), 2);
      assert.strictEqual(system.getCurrentXP(), 0);
      assert.strictEqual(system.getTotalXP(), 200);
    });

    it('should handle multiple level-ups in one call', () => {
      const system = new ProgressionSystem();
      system.addXP(500); // Level 1->2 at 200, 2->3 at 300, 3->4 at 400, 4->5 at 500
      assert.strictEqual(system.getCurrentLevel(), 5);
      assert.strictEqual(system.getCurrentXP(), 0);
      assert.strictEqual(system.getTotalXP(), 500);
    });

    it('should ignore negative XP', () => {
      const system = new ProgressionSystem();
      system.addXP(100);
      system.addXP(-50);
      assert.strictEqual(system.getCurrentXP(), 100);
      assert.strictEqual(system.getTotalXP(), 100);
    });

    it('should handle zero XP', () => {
      const system = new ProgressionSystem();
      system.addXP(0);
      assert.strictEqual(system.getCurrentXP(), 0);
      assert.strictEqual(system.getTotalXP(), 0);
    });
  });

  describe('getXPToNextLevel', () => {
    it('should return XP needed to reach next level', () => {
      const system = new ProgressionSystem();
      system.addXP(250); // Level 2 with 50 XP (level 3 requires 300 total)
      assert.strictEqual(system.getXPToNextLevel(), 50); // 300 - 250 = 50
    });

    it('should return full level requirement at start of level', () => {
      const system = new ProgressionSystem();
      system.addXP(200); // Level 2 with 0 XP (level 3 requires 300 total)
      assert.strictEqual(system.getXPToNextLevel(), 100); // 300 - 200 = 100
    });
  });

  describe('getCurrentLevel', () => {
    it('should return current level', () => {
      const system = new ProgressionSystem();
      assert.strictEqual(system.getCurrentLevel(), 1);
      system.addXP(200);
      assert.strictEqual(system.getCurrentLevel(), 2);
    });
  });

  describe('getCurrentXP', () => {
    it('should return XP progress in current level', () => {
      const system = new ProgressionSystem();
      system.addXP(250); // Level 2 with 50 XP
      assert.strictEqual(system.getCurrentXP(), 50);
    });
  });

  describe('getTotalXP', () => {
    it('should return cumulative XP earned', () => {
      const system = new ProgressionSystem();
      system.addXP(100);
      system.addXP(150);
      assert.strictEqual(system.getTotalXP(), 250);
    });
  });

  describe('Edge cases', () => {
    it('should handle very large XP amounts', () => {
      const system = new ProgressionSystem();
      system.addXP(1000000);
      assert.ok(system.getCurrentLevel() > 1);
      assert.strictEqual(system.getTotalXP(), 1000000);
    });

    it('should cap at level 30', () => {
      const system = new ProgressionSystem();
      system.addXP(100000); // Way more than needed for level 30
      assert.strictEqual(system.getCurrentLevel(), 30);
    });
  });
});
