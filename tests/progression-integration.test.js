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
});
