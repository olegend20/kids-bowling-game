const { describe, it } = require('node:test');
const assert = require('node:assert');
const AchievementSystem = require('../src/systems/AchievementSystem');

describe('AchievementSystem', () => {
  describe('Constructor', () => {
    it('should initialize with empty unlocked achievements', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking unlocked achievements
      const unlocked = system.getUnlockedAchievements();

      // Then: Should be empty
      assert.strictEqual(unlocked.length, 0);
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock an achievement by ID', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Unlocking an achievement
      system.unlockAchievement('ach_001');

      // Then: Achievement should be unlocked
      const unlocked = system.getUnlockedAchievements();
      assert.strictEqual(unlocked.length, 1);
      assert.strictEqual(unlocked[0], 'ach_001');
    });

    it('should not duplicate unlocked achievements', () => {
      // Given: A system with an unlocked achievement
      const system = new AchievementSystem();
      system.unlockAchievement('ach_001');

      // When: Unlocking the same achievement again
      system.unlockAchievement('ach_001');

      // Then: Should only have one entry
      const unlocked = system.getUnlockedAchievements();
      assert.strictEqual(unlocked.length, 1);
    });

    it('should unlock multiple different achievements', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Unlocking multiple achievements
      system.unlockAchievement('ach_001');
      system.unlockAchievement('ach_002');
      system.unlockAchievement('ach_003');

      // Then: All should be unlocked
      const unlocked = system.getUnlockedAchievements();
      assert.strictEqual(unlocked.length, 3);
      assert.ok(unlocked.includes('ach_001'));
      assert.ok(unlocked.includes('ach_002'));
      assert.ok(unlocked.includes('ach_003'));
    });
  });

  describe('getUnlockedAchievements', () => {
    it('should return a copy of unlocked achievements array', () => {
      // Given: A system with unlocked achievements
      const system = new AchievementSystem();
      system.unlockAchievement('ach_001');

      // When: Getting unlocked achievements and modifying the result
      const unlocked = system.getUnlockedAchievements();
      unlocked.push('ach_002');

      // Then: Original should not be modified
      const original = system.getUnlockedAchievements();
      assert.strictEqual(original.length, 1);
    });
  });

  describe('checkAchievements', () => {
    it('should unlock "First Strike" achievement when strikes >= 1', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking achievements with 1 strike
      const newlyUnlocked = system.checkAchievements({ strikes: 1 });

      // Then: First Strike should be unlocked
      assert.strictEqual(newlyUnlocked.length, 1);
      assert.strictEqual(newlyUnlocked[0], 'ach_001');
      assert.ok(system.getUnlockedAchievements().includes('ach_001'));
    });

    it('should unlock multiple achievements when conditions met', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking with stats that meet multiple conditions
      const newlyUnlocked = system.checkAchievements({
        strikes: 10,
        spares: 1,
        gamesPlayed: 1
      });

      // Then: Multiple achievements should be unlocked
      assert.ok(newlyUnlocked.length >= 3);
      assert.ok(newlyUnlocked.includes('ach_001')); // First Strike
      assert.ok(newlyUnlocked.includes('ach_002')); // Strike Master
      assert.ok(newlyUnlocked.includes('ach_004')); // First Spare
      assert.ok(newlyUnlocked.includes('ach_006')); // Beginner
    });

    it('should not return already unlocked achievements', () => {
      // Given: A system with an already unlocked achievement
      const system = new AchievementSystem();
      system.unlockAchievement('ach_001');

      // When: Checking achievements with same stats
      const newlyUnlocked = system.checkAchievements({ strikes: 1 });

      // Then: Should not return already unlocked achievement
      assert.strictEqual(newlyUnlocked.length, 0);
    });

    it('should handle missing stats gracefully', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking with partial stats
      const newlyUnlocked = system.checkAchievements({ strikes: 1 });

      // Then: Should only unlock achievements with met conditions
      assert.ok(newlyUnlocked.includes('ach_001'));
      assert.ok(!newlyUnlocked.includes('ach_004')); // Spare achievement not met
    });

    it('should unlock level-based achievements', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking with level 10
      const newlyUnlocked = system.checkAchievements({ level: 10 });

      // Then: Level 10 achievement should be unlocked
      assert.ok(newlyUnlocked.includes('ach_015'));
    });

    it('should unlock high score achievements', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking with high score of 100
      const newlyUnlocked = system.checkAchievements({ highScore: 100 });

      // Then: Century Club achievement should be unlocked
      assert.ok(newlyUnlocked.includes('ach_009'));
    });

    it('should unlock consecutive strikes achievements', () => {
      // Given: A new achievement system
      const system = new AchievementSystem();

      // When: Checking with 3 consecutive strikes
      const newlyUnlocked = system.checkAchievements({ consecutiveStrikes: 3 });

      // Then: Turkey Time achievement should be unlocked
      assert.ok(newlyUnlocked.includes('ach_013'));
    });

    it('should return empty array when no new achievements unlocked', () => {
      // Given: A system with all relevant achievements unlocked
      const system = new AchievementSystem();
      system.checkAchievements({ strikes: 10 });

      // When: Checking with same stats again
      const newlyUnlocked = system.checkAchievements({ strikes: 10 });

      // Then: Should return empty array
      assert.strictEqual(newlyUnlocked.length, 0);
    });
  });
});
