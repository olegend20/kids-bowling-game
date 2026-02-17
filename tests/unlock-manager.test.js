const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const UnlockManager = require('../src/systems/UnlockManager');

describe('UnlockManager', () => {
  let unlockManager;

  beforeEach(() => {
    unlockManager = new UnlockManager();
  });

  describe('isUnlocked', () => {
    it('should return false for locked ball', () => {
      // Given: A ball that hasn't been unlocked
      const ballId = 'ball_002';

      // When: Checking if the ball is unlocked
      const result = unlockManager.isUnlocked(ballId);

      // Then: It should return false
      assert.strictEqual(result, false);
    });

    it('should return true for unlocked ball', () => {
      // Given: A ball that has been unlocked
      const ballId = 'ball_001';
      unlockManager.unlockBall(ballId);

      // When: Checking if the ball is unlocked
      const result = unlockManager.isUnlocked(ballId);

      // Then: It should return true
      assert.strictEqual(result, true);
    });
  });

  describe('unlockBall', () => {
    it('should unlock a ball', () => {
      // Given: A locked ball
      const ballId = 'ball_003';

      // When: Unlocking the ball
      unlockManager.unlockBall(ballId);

      // Then: The ball should be unlocked
      assert.strictEqual(unlockManager.isUnlocked(ballId), true);
    });

    it('should not duplicate unlocked balls', () => {
      // Given: A ball that's already unlocked
      const ballId = 'ball_004';
      unlockManager.unlockBall(ballId);

      // When: Unlocking the same ball again
      unlockManager.unlockBall(ballId);

      // Then: It should only appear once in unlocked list
      const unlockedBalls = unlockManager.getUnlockedBalls();
      const count = unlockedBalls.filter(id => id === ballId).length;
      assert.strictEqual(count, 1);
    });
  });

  describe('getUnlockedBalls', () => {
    it('should return empty array when no balls unlocked', () => {
      // Given: No balls have been unlocked
      // When: Getting unlocked balls
      const result = unlockManager.getUnlockedBalls();

      // Then: Should return empty array
      assert.deepStrictEqual(result, []);
    });

    it('should return all unlocked ball IDs', () => {
      // Given: Multiple balls have been unlocked
      unlockManager.unlockBall('ball_001');
      unlockManager.unlockBall('ball_002');
      unlockManager.unlockBall('ball_003');

      // When: Getting unlocked balls
      const result = unlockManager.getUnlockedBalls();

      // Then: Should return all unlocked ball IDs
      assert.deepStrictEqual(result, ['ball_001', 'ball_002', 'ball_003']);
    });
  });
});
