/**
 * ProgressionSystem - Manages player XP and leveling
 * 
 * Handles XP accumulation, level-up detection, and progression calculations.
 * Level formula: Level N requires N * 100 total XP
 * Max level: 30
 */
class ProgressionSystem {
  constructor() {
    this.currentLevel = 1;
    this.totalXP = 0;
    this.maxLevel = 30;
  }

  /**
   * Calculate total XP required to reach a specific level
   * @param {number} level - Target level
   * @returns {number} Total XP required
   */
  calculateXPForLevel(level) {
    if (level <= 1) return 0;
    // Formula: Level requires level * 100 total XP
    return level * 100;
  }

  /**
   * Add XP and handle level-ups
   * @param {number} amount - XP to add
   */
  addXP(amount) {
    // Ignore negative or zero XP
    if (amount <= 0) return;

    this.totalXP += amount;

    // Check for level-ups (handle multiple level-ups in one call)
    while (this.currentLevel < this.maxLevel) {
      const nextLevelXP = this.calculateXPForLevel(this.currentLevel + 1);
      if (this.totalXP >= nextLevelXP) {
        this.currentLevel++;
      } else {
        break;
      }
    }
  }

  /**
   * Get current level
   * @returns {number} Current level
   */
  getCurrentLevel() {
    return this.currentLevel;
  }

  /**
   * Get XP progress in current level
   * @returns {number} XP earned in current level
   */
  getCurrentXP() {
    const currentLevelStartXP = this.calculateXPForLevel(this.currentLevel);
    return this.totalXP - currentLevelStartXP;
  }

  /**
   * Get total cumulative XP
   * @returns {number} Total XP earned
   */
  getTotalXP() {
    return this.totalXP;
  }

  /**
   * Get XP needed to reach next level
   * @returns {number} XP remaining to next level
   */
  getXPToNextLevel() {
    if (this.currentLevel >= this.maxLevel) return 0;
    const nextLevelXP = this.calculateXPForLevel(this.currentLevel + 1);
    return nextLevelXP - this.totalXP;
  }
}

module.exports = ProgressionSystem;
