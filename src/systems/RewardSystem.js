/**
 * RewardSystem - Manages daily login rewards and streak tracking
 * 
 * Tracks player login patterns and distributes daily rewards based on streak.
 */
class RewardSystem {
  /**
   * Check if current login is a new day
   * @param {string|null} lastLoginDate - ISO date string of last login
   * @returns {boolean} True if new day, false if same day
   */
  checkDailyLogin(lastLoginDate) {
    if (!lastLoginDate) return true;

    const last = new Date(lastLoginDate);
    const now = new Date();

    return last.toDateString() !== now.toDateString();
  }

  /**
   * Calculate new streak based on last login
   * @param {string|null} lastLoginDate - ISO date string of last login
   * @param {number} currentStreak - Current streak count
   * @returns {number} New streak count
   */
  calculateStreak(lastLoginDate, currentStreak) {
    if (!lastLoginDate) return 1;

    const last = new Date(lastLoginDate);
    const now = new Date();

    // Same day - maintain streak
    if (last.toDateString() === now.toDateString()) {
      return currentStreak;
    }

    // Calculate day difference
    const dayDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));

    // Consecutive day - increment
    if (dayDiff === 1) {
      return currentStreak + 1;
    }

    // Missed a day - reset
    return 1;
  }

  /**
   * Get reward for a specific day
   * @param {number} day - Day number (1-7, cycles after 7)
   * @returns {Object} Reward object with day, coins, and bonus flag
   */
  claimDailyReward(day) {
    const cycleDay = ((day - 1) % 7) + 1;
    const baseReward = 50;
    const coins = baseReward * cycleDay;

    return {
      day: cycleDay,
      coins,
      bonus: cycleDay === 7
    };
  }
}

module.exports = RewardSystem;
