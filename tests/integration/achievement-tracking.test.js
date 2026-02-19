const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('GameScene Achievement Tracking Integration', () => {
  let mockScene;
  let mockAchievementSystem;
  let mockStorage;

  beforeEach(() => {
    // Setup: Mock storage adapter
    mockStorage = {
      savePlayerData: async (data) => { mockStorage._savedData = data; },
      loadPlayerData: async () => mockStorage._savedData || null,
      _savedData: null
    };

    // Setup: Mock AchievementSystem
    mockAchievementSystem = {
      unlockedAchievements: [],
      checkAchievements: function(stats) {
        const newlyUnlocked = [];
        // Simplified achievement checking for test
        if (stats.strikes >= 1 && !this.unlockedAchievements.includes('ach_001')) {
          this.unlockedAchievements.push('ach_001');
          newlyUnlocked.push('ach_001');
        }
        if (stats.gamesPlayed >= 1 && !this.unlockedAchievements.includes('ach_006')) {
          this.unlockedAchievements.push('ach_006');
          newlyUnlocked.push('ach_006');
        }
        return newlyUnlocked;
      },
      getUnlockedAchievements: function() {
        return [...this.unlockedAchievements];
      }
    };

    // Setup: Mock GameScene with minimal structure
    mockScene = {
      _achievementSystem: mockAchievementSystem,
      _storageAdapter: mockStorage,
      _achievementStats: {
        strikes: 0,
        spares: 0,
        gamesPlayed: 0,
        totalPins: 0,
        highScore: 0,
        consecutiveStrikes: 0,
        level: 1,
        ballsUnlocked: 1,
        themesUsed: 1
      },
      _currentConsecutiveStrikes: 0,
      
      // Method to track strike
      _trackStrike: function() {
        this._achievementStats.strikes++;
        this._currentConsecutiveStrikes++;
        if (this._currentConsecutiveStrikes > this._achievementStats.consecutiveStrikes) {
          this._achievementStats.consecutiveStrikes = this._currentConsecutiveStrikes;
        }
      },
      
      // Method to track spare
      _trackSpare: function() {
        this._achievementStats.spares++;
        this._currentConsecutiveStrikes = 0;
      },
      
      // Method to track pins knocked
      _trackPinsKnocked: function(count) {
        this._achievementStats.totalPins += count;
      },
      
      // Method to check achievements at game end
      _checkAchievementsAtGameEnd: async function(finalScore) {
        this._achievementStats.gamesPlayed++;
        if (finalScore > this._achievementStats.highScore) {
          this._achievementStats.highScore = finalScore;
        }
        
        const newlyUnlocked = this._achievementSystem.checkAchievements(this._achievementStats);
        
        // Save achievement data
        await this._storageAdapter.savePlayerData({
          achievements: this._achievementSystem.getUnlockedAchievements(),
          stats: this._achievementStats
        });
        
        return newlyUnlocked;
      }
    };
  });

  describe('Strike tracking', () => {
    it('should track strikes and unlock First Strike achievement', async () => {
      // Given: A game scene with no strikes
      assert.strictEqual(mockScene._achievementStats.strikes, 0);

      // When: Player gets a strike
      mockScene._trackStrike();

      // Then: Strike count should increase
      assert.strictEqual(mockScene._achievementStats.strikes, 1);
      
      // When: Game ends and achievements are checked
      const newlyUnlocked = await mockScene._checkAchievementsAtGameEnd(100);
      
      // Then: First Strike achievement should be unlocked
      assert.ok(newlyUnlocked.includes('ach_001'));
      assert.ok(mockScene._achievementSystem.getUnlockedAchievements().includes('ach_001'));
    });

    it('should track consecutive strikes', () => {
      // Given: A game scene with no strikes
      assert.strictEqual(mockScene._currentConsecutiveStrikes, 0);

      // When: Player gets 3 strikes in a row
      mockScene._trackStrike();
      mockScene._trackStrike();
      mockScene._trackStrike();

      // Then: Consecutive strikes should be tracked
      assert.strictEqual(mockScene._currentConsecutiveStrikes, 3);
      assert.strictEqual(mockScene._achievementStats.consecutiveStrikes, 3);
    });

    it('should reset consecutive strikes on spare', () => {
      // Given: A game scene with 2 consecutive strikes
      mockScene._trackStrike();
      mockScene._trackStrike();
      assert.strictEqual(mockScene._currentConsecutiveStrikes, 2);

      // When: Player gets a spare
      mockScene._trackSpare();

      // Then: Consecutive strikes should reset
      assert.strictEqual(mockScene._currentConsecutiveStrikes, 0);
      // But max consecutive strikes should remain
      assert.strictEqual(mockScene._achievementStats.consecutiveStrikes, 2);
    });
  });

  describe('Spare tracking', () => {
    it('should track spares', () => {
      // Given: A game scene with no spares
      assert.strictEqual(mockScene._achievementStats.spares, 0);

      // When: Player gets a spare
      mockScene._trackSpare();

      // Then: Spare count should increase
      assert.strictEqual(mockScene._achievementStats.spares, 1);
    });
  });

  describe('Pin tracking', () => {
    it('should track total pins knocked', () => {
      // Given: A game scene with no pins knocked
      assert.strictEqual(mockScene._achievementStats.totalPins, 0);

      // When: Player knocks down pins
      mockScene._trackPinsKnocked(7);
      mockScene._trackPinsKnocked(3);

      // Then: Total pins should be tracked
      assert.strictEqual(mockScene._achievementStats.totalPins, 10);
    });
  });

  describe('Game completion tracking', () => {
    it('should track games played and high score', async () => {
      // Given: A game scene with no games played
      assert.strictEqual(mockScene._achievementStats.gamesPlayed, 0);
      assert.strictEqual(mockScene._achievementStats.highScore, 0);

      // When: Game ends with score of 150
      await mockScene._checkAchievementsAtGameEnd(150);

      // Then: Games played and high score should be updated
      assert.strictEqual(mockScene._achievementStats.gamesPlayed, 1);
      assert.strictEqual(mockScene._achievementStats.highScore, 150);
    });

    it('should unlock Beginner achievement on first game', async () => {
      // Given: A game scene with no games played
      assert.strictEqual(mockScene._achievementStats.gamesPlayed, 0);

      // When: Game ends
      const newlyUnlocked = await mockScene._checkAchievementsAtGameEnd(100);

      // Then: Beginner achievement should be unlocked
      assert.ok(newlyUnlocked.includes('ach_006'));
    });

    it('should persist achievement data to storage', async () => {
      // Given: A game scene with some stats
      mockScene._trackStrike();
      mockScene._trackSpare();

      // When: Game ends and achievements are checked
      await mockScene._checkAchievementsAtGameEnd(120);

      // Then: Data should be saved to storage
      const savedData = await mockStorage.loadPlayerData();
      assert.ok(savedData);
      assert.ok(savedData.achievements);
      assert.ok(savedData.stats);
      assert.strictEqual(savedData.stats.strikes, 1);
      assert.strictEqual(savedData.stats.spares, 1);
      assert.strictEqual(savedData.stats.gamesPlayed, 1);
    });
  });

  describe('Achievement notification', () => {
    it('should return newly unlocked achievements for notification', async () => {
      // Given: A game scene with strike
      mockScene._trackStrike();

      // When: Game ends
      const newlyUnlocked = await mockScene._checkAchievementsAtGameEnd(100);

      // Then: Should return array of newly unlocked achievement IDs
      assert.ok(Array.isArray(newlyUnlocked));
      assert.ok(newlyUnlocked.length > 0);
      assert.ok(newlyUnlocked.includes('ach_001')); // First Strike
      assert.ok(newlyUnlocked.includes('ach_006')); // Beginner
    });

    it('should not return already unlocked achievements', async () => {
      // Given: A game scene with achievements already unlocked
      mockScene._trackStrike();
      await mockScene._checkAchievementsAtGameEnd(100);
      
      // When: Another game ends with same stats
      const newlyUnlocked = await mockScene._checkAchievementsAtGameEnd(100);

      // Then: Should return empty array (no new achievements)
      assert.strictEqual(newlyUnlocked.length, 0);
    });
  });
});
