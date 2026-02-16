const { describe, it } = require('node:test');
const assert = require('node:assert');
const { validateSaveData, createDefaultSaveData, SCHEMA_VERSION } = require('../../src/data/schema');

describe('Save Data Schema', () => {
  describe('createDefaultSaveData', () => {
    it('should create valid default save data structure', () => {
      const data = createDefaultSaveData();
      
      assert.strictEqual(data.version, SCHEMA_VERSION);
      assert.strictEqual(data.progression.level, 1);
      assert.strictEqual(data.progression.totalXP, 0);
      assert.strictEqual(data.unlocks.balls.length, 1);
      assert.strictEqual(data.unlocks.balls[0], 'default');
      assert.strictEqual(data.achievements.length, 0);
      assert.strictEqual(data.stats.gamesPlayed, 0);
      assert.strictEqual(data.rewards.coins, 0);
      assert.strictEqual(data.settings.soundEnabled, true);
    });
  });

  describe('validateSaveData', () => {
    it('should validate correct save data', () => {
      const data = createDefaultSaveData();
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should reject data without version', () => {
      const data = { progression: {}, unlocks: {}, achievements: [], stats: {}, rewards: {}, settings: {} };
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('version')));
    });

    it('should reject data with missing progression', () => {
      const data = { version: 1, unlocks: {}, achievements: [], stats: {}, rewards: {}, settings: {} };
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('progression')));
    });

    it('should reject data with invalid progression.level', () => {
      const data = createDefaultSaveData();
      data.progression.level = -1;
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('level')));
    });

    it('should reject data with invalid progression.totalXP', () => {
      const data = createDefaultSaveData();
      data.progression.totalXP = -100;
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('totalXP')));
    });

    it('should reject data with non-array unlocks.balls', () => {
      const data = createDefaultSaveData();
      data.unlocks.balls = 'not-an-array';
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('balls')));
    });

    it('should reject data with non-array achievements', () => {
      const data = createDefaultSaveData();
      data.achievements = 'not-an-array';
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('achievements')));
    });

    it('should reject data with invalid stats.gamesPlayed', () => {
      const data = createDefaultSaveData();
      data.stats.gamesPlayed = -5;
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('gamesPlayed')));
    });

    it('should reject data with invalid rewards.coins', () => {
      const data = createDefaultSaveData();
      data.rewards.coins = -10;
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('coins')));
    });

    it('should accept valid custom save data', () => {
      const data = createDefaultSaveData();
      data.progression.level = 5;
      data.progression.totalXP = 500;
      data.unlocks.balls = ['default', 'fire', 'ice'];
      data.achievements = ['first-strike', 'perfect-game'];
      data.stats.gamesPlayed = 10;
      data.stats.totalScore = 1500;
      data.rewards.coins = 250;
      
      const result = validateSaveData(data);
      
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });
  });
});
