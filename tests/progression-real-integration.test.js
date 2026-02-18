const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const ProgressionSystem = require('../src/systems/ProgressionSystem.js');
const { UnlockManager } = require('../src/systems/UnlockManager.js');

describe('Feature: Real Progression System Integration', () => {
  describe('Acceptance_Criterion_XP_from_gameplay_to_level_up', () => {
    it('should earn XP from game score and level up', () => {
      // Given: A new player with ProgressionSystem
      const progression = new ProgressionSystem();
      const unlockManager = new UnlockManager();
      
      assert.strictEqual(progression.getCurrentLevel(), 1);
      assert.strictEqual(progression.getTotalXP(), 0);
      
      // When: Player completes a game with score 150, 3 strikes, 5 spares
      const gameStats = {
        score: 150,
        strikes: 3,
        spares: 5
      };
      
      // Calculate XP: score/10 + strikes*10 + spares*5
      const earnedXP = Math.floor(gameStats.score / 10) + 
                       (gameStats.strikes * 10) + 
                       (gameStats.spares * 5);
      
      progression.addXP(earnedXP); // 15 + 30 + 25 = 70 XP
      
      // Then: Player has earned XP but not leveled up (need 200 XP for level 2)
      assert.strictEqual(progression.getTotalXP(), 70);
      assert.strictEqual(progression.getCurrentLevel(), 1);
      assert.strictEqual(progression.getXPToNextLevel(), 130);
    });

    it('should level up when earning enough XP from multiple games', () => {
      // Given: A player at level 1 with 150 XP
      const progression = new ProgressionSystem();
      progression.addXP(150);
      
      assert.strictEqual(progression.getCurrentLevel(), 1);
      assert.strictEqual(progression.getTotalXP(), 150);
      
      // When: Player completes another game earning 100 XP (total 250 XP)
      progression.addXP(100);
      
      // Then: Player levels up to 2 (requires 200 XP) and has 50 XP toward level 3
      assert.strictEqual(progression.getCurrentLevel(), 2);
      assert.strictEqual(progression.getTotalXP(), 250);
      assert.strictEqual(progression.getCurrentXP(), 50); // 250 - 200 = 50
      assert.strictEqual(progression.getXPToNextLevel(), 50); // 300 - 250 = 50
    });

    it('should handle level-up with reward unlock', () => {
      // Given: Player at level 4 (400 XP) with UnlockManager
      const progression = new ProgressionSystem();
      const unlockManager = new UnlockManager();
      
      progression.addXP(400);
      assert.strictEqual(progression.getCurrentLevel(), 4);
      
      // When: Player earns 100 XP and levels up to 5
      const previousLevel = progression.getCurrentLevel();
      progression.addXP(100);
      const newLevel = progression.getCurrentLevel();
      
      // Then: Level increased to 5
      assert.strictEqual(newLevel, 5);
      
      // And: Unlock reward for level 5
      if (newLevel > previousLevel) {
        unlockManager.unlockBall('ball-level-5');
      }
      
      assert.ok(unlockManager.isUnlocked('ball-level-5'));
    });
  });

  describe('Acceptance_Criterion_Progress_bar_updates_with_real_XP', () => {
    it('should update progress bar as XP increases', () => {
      // Given: ProgressionSystem at level 1
      const progression = new ProgressionSystem();
      
      // Simulate progress bar reading progression state
      let displayLevel = progression.getCurrentLevel();
      let displayCurrentXP = progression.getCurrentXP();
      let displayXPToNext = progression.getXPToNextLevel();
      
      assert.strictEqual(displayLevel, 1);
      assert.strictEqual(displayCurrentXP, 0);
      assert.strictEqual(displayXPToNext, 200);
      
      // When: Player earns 50 XP
      progression.addXP(50);
      
      // Then: Progress bar updates
      displayLevel = progression.getCurrentLevel();
      displayCurrentXP = progression.getCurrentXP();
      displayXPToNext = progression.getXPToNextLevel();
      
      assert.strictEqual(displayLevel, 1);
      assert.strictEqual(displayCurrentXP, 50);
      assert.strictEqual(displayXPToNext, 150);
    });

    it('should reset progress bar on level-up', () => {
      // Given: Player at level 1 with 180 XP (20 XP from level 2)
      const progression = new ProgressionSystem();
      progression.addXP(180);
      
      let displayLevel = progression.getCurrentLevel();
      let displayCurrentXP = progression.getCurrentXP();
      
      assert.strictEqual(displayLevel, 1);
      assert.strictEqual(displayCurrentXP, 180);
      
      // When: Player earns 50 XP (total 230, levels up to 2)
      progression.addXP(50);
      
      // Then: Progress bar shows level 2 with 30 XP toward level 3
      displayLevel = progression.getCurrentLevel();
      displayCurrentXP = progression.getCurrentXP();
      const displayXPToNext = progression.getXPToNextLevel();
      
      assert.strictEqual(displayLevel, 2);
      assert.strictEqual(displayCurrentXP, 30); // 230 - 200 = 30
      assert.strictEqual(displayXPToNext, 70); // 300 - 230 = 70
    });
  });

  describe('Acceptance_Criterion_XP_calculation_from_strikes_and_spares', () => {
    it('should calculate XP correctly for perfect game', () => {
      // Given: ProgressionSystem
      const progression = new ProgressionSystem();
      
      // When: Player bowls perfect game (300 score, 12 strikes, 0 spares)
      const gameStats = {
        score: 300,
        strikes: 12,
        spares: 0
      };
      
      const earnedXP = Math.floor(gameStats.score / 10) + 
                       (gameStats.strikes * 10) + 
                       (gameStats.spares * 5);
      
      progression.addXP(earnedXP); // 30 + 120 + 0 = 150 XP
      
      // Then: Player earns 150 XP and stays at level 1
      assert.strictEqual(progression.getTotalXP(), 150);
      assert.strictEqual(progression.getCurrentLevel(), 1);
    });

    it('should calculate XP correctly for spare-heavy game', () => {
      // Given: ProgressionSystem
      const progression = new ProgressionSystem();
      
      // When: Player bowls game with many spares (150 score, 0 strikes, 10 spares)
      const gameStats = {
        score: 150,
        strikes: 0,
        spares: 10
      };
      
      const earnedXP = Math.floor(gameStats.score / 10) + 
                       (gameStats.strikes * 10) + 
                       (gameStats.spares * 5);
      
      progression.addXP(earnedXP); // 15 + 0 + 50 = 65 XP
      
      // Then: Player earns 65 XP
      assert.strictEqual(progression.getTotalXP(), 65);
      assert.strictEqual(progression.getCurrentLevel(), 1);
    });

    it('should calculate XP correctly for low score game', () => {
      // Given: ProgressionSystem
      const progression = new ProgressionSystem();
      
      // When: Player bowls low score game (50 score, 0 strikes, 2 spares)
      const gameStats = {
        score: 50,
        strikes: 0,
        spares: 2
      };
      
      const earnedXP = Math.floor(gameStats.score / 10) + 
                       (gameStats.strikes * 10) + 
                       (gameStats.spares * 5);
      
      progression.addXP(earnedXP); // 5 + 0 + 10 = 15 XP
      
      // Then: Player earns 15 XP
      assert.strictEqual(progression.getTotalXP(), 15);
      assert.strictEqual(progression.getCurrentLevel(), 1);
    });
  });

  describe('Acceptance_Criterion_Multi_level_progression', () => {
    it('should handle progression through multiple levels', () => {
      // Given: New player
      const progression = new ProgressionSystem();
      const unlockManager = new UnlockManager();
      
      const levelUpEvents = [];
      
      // When: Player plays 5 games, earning XP each time
      const games = [
        { score: 150, strikes: 3, spares: 5 }, // 70 XP
        { score: 180, strikes: 5, spares: 3 }, // 83 XP
        { score: 200, strikes: 6, spares: 2 }, // 90 XP
        { score: 220, strikes: 7, spares: 1 }, // 97 XP
        { score: 250, strikes: 8, spares: 0 }  // 105 XP
      ];
      
      games.forEach((game, index) => {
        const previousLevel = progression.getCurrentLevel();
        
        const earnedXP = Math.floor(game.score / 10) + 
                         (game.strikes * 10) + 
                         (game.spares * 5);
        
        progression.addXP(earnedXP);
        
        const newLevel = progression.getCurrentLevel();
        
        // Track level-ups
        if (newLevel > previousLevel) {
          for (let level = previousLevel + 1; level <= newLevel; level++) {
            levelUpEvents.push({ game: index + 1, level });
            unlockManager.unlockBall(`ball-level-${level}`);
          }
        }
      });
      
      // Then: Player has progressed through multiple levels
      // Total XP: 70 + 83 + 90 + 97 + 105 = 445 XP
      assert.strictEqual(progression.getTotalXP(), 445);
      
      // Level 5 requires 500 XP, so player should be at level 4
      assert.strictEqual(progression.getCurrentLevel(), 4);
      
      // Level-ups occurred at games 2, 3, and 4
      assert.ok(levelUpEvents.length >= 3);
      
      // Rewards unlocked for levels 2, 3, 4
      assert.ok(unlockManager.isUnlocked('ball-level-2'));
      assert.ok(unlockManager.isUnlocked('ball-level-3'));
      assert.ok(unlockManager.isUnlocked('ball-level-4'));
    });
  });
});
