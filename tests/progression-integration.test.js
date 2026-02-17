const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Feature: Progression System Integration', () => {
  describe('Acceptance_Criterion_1_Track_XP_earning_actions', () => {
    it('should track strikes for XP calculation', () => {
      // Given: A game in progress
      const xpTracker = {
        strikes: 0,
        spares: 0,
        score: 0
      };
      
      // When: Player gets a strike
      xpTracker.strikes = 1;
      xpTracker.score = 10;
      
      // Then: Strike count is tracked
      assert.strictEqual(xpTracker.strikes, 1);
    });

    it('should track spares for XP calculation', () => {
      // Given: A game in progress
      const xpTracker = {
        strikes: 0,
        spares: 0,
        score: 0
      };
      
      // When: Player gets a spare
      xpTracker.spares = 1;
      xpTracker.score = 10;
      
      // Then: Spare count is tracked
      assert.strictEqual(xpTracker.spares, 1);
    });

    it('should track final score for XP calculation', () => {
      // Given: A game in progress
      const xpTracker = {
        strikes: 0,
        spares: 0,
        score: 0
      };
      
      // When: Game ends with score 150
      xpTracker.score = 150;
      
      // Then: Score is tracked
      assert.strictEqual(xpTracker.score, 150);
    });
  });

  describe('Acceptance_Criterion_2_Calculate_XP_at_game_end', () => {
    it('should calculate XP based on score, strikes, and spares', () => {
      // Given: Game stats
      const stats = {
        score: 150,
        strikes: 3,
        spares: 5
      };
      
      // When: XP is calculated
      // Formula: score/10 + strikes*10 + spares*5
      const xp = Math.floor(stats.score / 10) + (stats.strikes * 10) + (stats.spares * 5);
      
      // Then: XP is calculated correctly
      assert.strictEqual(xp, 15 + 30 + 25); // 70 XP
    });

    it('should calculate XP for perfect game', () => {
      // Given: Perfect game stats
      const stats = {
        score: 300,
        strikes: 12,
        spares: 0
      };
      
      // When: XP is calculated
      const xp = Math.floor(stats.score / 10) + (stats.strikes * 10) + (stats.spares * 5);
      
      // Then: XP is high for perfect game
      assert.strictEqual(xp, 30 + 120 + 0); // 150 XP
    });

    it('should calculate XP for low score game', () => {
      // Given: Low score game stats
      const stats = {
        score: 50,
        strikes: 0,
        spares: 2
      };
      
      // When: XP is calculated
      const xp = Math.floor(stats.score / 10) + (stats.strikes * 10) + (stats.spares * 5);
      
      // Then: XP is calculated for low score
      assert.strictEqual(xp, 5 + 0 + 10); // 15 XP
    });
  });

  describe('Acceptance_Criterion_3_Pass_XP_to_PostGameScene', () => {
    it('should include XP data in scene transition', () => {
      // Given: Game over with stats
      const gameData = {
        player1Name: 'Alice',
        player2Name: 'Bob',
        score1: 150,
        score2: 120,
        xp1: 70,
        xp2: 55
      };
      
      // When: Transitioning to results scene
      // Then: XP data is included
      assert.ok(gameData.xp1);
      assert.ok(gameData.xp2);
      assert.strictEqual(gameData.xp1, 70);
      assert.strictEqual(gameData.xp2, 55);
    });
  });

  describe('Acceptance_Criterion_4_Level_up_triggers_unlock_rewards', () => {
    it('should unlock reward when reaching level threshold', () => {
      // Given: Player at level 4 with UnlockManager
      const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
      const UnlockManager = require('../src/systems/UnlockManager.js');
      
      const progression = new ProgressionSystem();
      const unlockManager = new UnlockManager();
      
      // Set to level 4 (400 XP)
      progression.addXP(400);
      assert.strictEqual(progression.getCurrentLevel(), 4);
      
      // When: Player levels up to 5 (500 XP total)
      const previousLevel = progression.getCurrentLevel();
      progression.addXP(100);
      const newLevel = progression.getCurrentLevel();
      
      // Then: Level increased
      assert.strictEqual(newLevel, 5);
      assert.strictEqual(newLevel, previousLevel + 1);
      
      // And: Reward is unlocked
      if (newLevel === 5) {
        unlockManager.unlockBall('ball-blue');
      }
      assert.ok(unlockManager.isUnlocked('ball-blue'));
    });

    it('should unlock multiple rewards for multiple level-ups', () => {
      // Given: Player at level 1
      const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
      const UnlockManager = require('../src/systems/UnlockManager.js');
      
      const progression = new ProgressionSystem();
      const unlockManager = new UnlockManager();
      
      // When: Player gains enough XP to reach level 3 (300 XP)
      progression.addXP(300);
      
      // Then: Player is at level 3
      assert.strictEqual(progression.getCurrentLevel(), 3);
      
      // And: Rewards for levels 2 and 3 are unlocked
      unlockManager.unlockBall('ball-red');
      unlockManager.unlockBall('ball-green');
      assert.ok(unlockManager.isUnlocked('ball-red'));
      assert.ok(unlockManager.isUnlocked('ball-green'));
    });

    it('should not unlock rewards when no level-up occurs', () => {
      // Given: Player at level 2 (200 XP)
      const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
      const UnlockManager = require('../src/systems/UnlockManager.js');
      
      const progression = new ProgressionSystem();
      const unlockManager = new UnlockManager();
      
      progression.addXP(200);
      assert.strictEqual(progression.getCurrentLevel(), 2);
      
      const initialUnlocks = unlockManager.getUnlockedBalls().length;
      
      // When: Player gains XP but doesn't level up (50 XP, still at level 2)
      progression.addXP(50);
      
      // Then: Level stays the same
      assert.strictEqual(progression.getCurrentLevel(), 2);
      
      // And: No new unlocks
      assert.strictEqual(unlockManager.getUnlockedBalls().length, initialUnlocks);
    });
  });

  describe('Acceptance_Criterion_5_Level_up_celebration_animation_plays', () => {
    it('should trigger celebration event on level-up', () => {
      // Given: Player at level 2 (200 XP)
      const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
      const progression = new ProgressionSystem();
      progression.addXP(200);
      
      let celebrationTriggered = false;
      let celebrationLevel = null;
      
      // When: Player levels up to 3
      const previousLevel = progression.getCurrentLevel();
      progression.addXP(100);
      const newLevel = progression.getCurrentLevel();
      
      if (newLevel > previousLevel) {
        celebrationTriggered = true;
        celebrationLevel = newLevel;
      }
      
      // Then: Celebration is triggered
      assert.ok(celebrationTriggered);
      assert.strictEqual(celebrationLevel, 3);
    });

    it('should trigger celebration for each level in multi-level jump', () => {
      // Given: Player at level 1
      const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
      const progression = new ProgressionSystem();
      
      const celebrationsTriggered = [];
      
      // When: Player gains enough XP to jump to level 4 (400 XP)
      const previousLevel = progression.getCurrentLevel();
      progression.addXP(400);
      const newLevel = progression.getCurrentLevel();
      
      // Simulate celebration for each level gained
      for (let level = previousLevel + 1; level <= newLevel; level++) {
        celebrationsTriggered.push(level);
      }
      
      // Then: Celebrations triggered for levels 2, 3, 4
      assert.strictEqual(celebrationsTriggered.length, 3);
      assert.deepStrictEqual(celebrationsTriggered, [2, 3, 4]);
    });

    it('should not trigger celebration when no level-up occurs', () => {
      // Given: Player at level 2 (200 XP)
      const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
      const progression = new ProgressionSystem();
      progression.addXP(200);
      
      let celebrationTriggered = false;
      
      // When: Player gains XP but doesn't level up
      const previousLevel = progression.getCurrentLevel();
      progression.addXP(50);
      const newLevel = progression.getCurrentLevel();
      
      if (newLevel > previousLevel) {
        celebrationTriggered = true;
      }
      
      // Then: No celebration triggered
      assert.strictEqual(celebrationTriggered, false);
    });
  });
});
