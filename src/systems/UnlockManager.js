/**
 * UnlockManager - Tracks unlocked balls
 * 
 * Manages which balls the player has unlocked through progression.
 */
class UnlockManager {
  constructor() {
    this.unlockedBalls = [];
  }

  /**
   * Check if a ball is unlocked
   * @param {string} ballId - Ball identifier
   * @returns {boolean} True if unlocked
   */
  isUnlocked(ballId) {
    return this.unlockedBalls.includes(ballId);
  }

  /**
   * Unlock a ball
   * @param {string} ballId - Ball identifier to unlock
   */
  unlockBall(ballId) {
    if (!this.isUnlocked(ballId)) {
      this.unlockedBalls.push(ballId);
    }
  }

  /**
   * Get all unlocked ball IDs
   * @returns {string[]} Array of unlocked ball IDs
   */
  getUnlockedBalls() {
    return [...this.unlockedBalls];
  }
}

module.exports = UnlockManager;
