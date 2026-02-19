const achievementsData = require('../data/achievements.json');

/**
 * AchievementSystem - Manages achievement tracking and unlocking
 * 
 * Tracks player progress toward achievements and unlocks them when conditions are met.
 */
class AchievementSystem {
  constructor() {
    this.unlockedAchievements = [];
  }

  /**
   * Unlock an achievement by ID
   * @param {string} achievementId - Achievement identifier
   */
  unlockAchievement(achievementId) {
    if (!this.unlockedAchievements.includes(achievementId)) {
      this.unlockedAchievements.push(achievementId);
    }
  }

  /**
   * Get all unlocked achievement IDs
   * @returns {string[]} Array of unlocked achievement IDs
   */
  getUnlockedAchievements() {
    return [...this.unlockedAchievements];
  }

  /**
   * Check achievements against current stats and unlock any newly met
   * @param {Object} stats - Player stats object
   * @returns {string[]} Array of newly unlocked achievement IDs
   */
  checkAchievements(stats) {
    const newlyUnlocked = [];

    for (const achievement of achievementsData) {
      if (this.unlockedAchievements.includes(achievement.id)) {
        continue;
      }

      const { type, value } = achievement.condition;
      const currentValue = stats[type];

      if (currentValue !== undefined && currentValue >= value) {
        this.unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement.id);
      }
    }

    return newlyUnlocked;
  }
  
  /**
   * Get achievement data by ID
   * @param {string} achievementId - Achievement identifier
   * @returns {Object|null} Achievement data or null if not found
   */
  getAchievementById(achievementId) {
    return achievementsData.find(a => a.id === achievementId) || null;
  }
}

module.exports = AchievementSystem;
