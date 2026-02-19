const { describe, it } = require('node:test');
const assert = require('node:assert');
const RewardSystem = require('../src/systems/RewardSystem');

describe('RewardSystem', () => {
  describe('checkDailyLogin', () => {
    it('should return true when lastLoginDate is null (first login)', () => {
      // Given: A new reward system and no previous login
      const system = new RewardSystem();
      const lastLoginDate = null;

      // When: Checking for daily login
      const isNewDay = system.checkDailyLogin(lastLoginDate);

      // Then: Should be a new day
      assert.strictEqual(isNewDay, true);
    });

    it('should return true when lastLoginDate is a different day', () => {
      // Given: A reward system and a login from yesterday
      const system = new RewardSystem();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastLoginDate = yesterday.toISOString();

      // When: Checking for daily login
      const isNewDay = system.checkDailyLogin(lastLoginDate);

      // Then: Should be a new day
      assert.strictEqual(isNewDay, true);
    });

    it('should return false when lastLoginDate is today', () => {
      // Given: A reward system and a login from earlier today
      const system = new RewardSystem();
      const today = new Date();
      const lastLoginDate = today.toISOString();

      // When: Checking for daily login
      const isNewDay = system.checkDailyLogin(lastLoginDate);

      // Then: Should not be a new day
      assert.strictEqual(isNewDay, false);
    });
  });

  describe('calculateStreak', () => {
    it('should return 1 for first login', () => {
      // Given: A reward system with no previous login
      const system = new RewardSystem();
      const lastLoginDate = null;
      const currentStreak = 0;

      // When: Calculating streak
      const newStreak = system.calculateStreak(lastLoginDate, currentStreak);

      // Then: Streak should be 1
      assert.strictEqual(newStreak, 1);
    });

    it('should increment streak when logging in consecutive days', () => {
      // Given: A reward system with a login from yesterday
      const system = new RewardSystem();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastLoginDate = yesterday.toISOString();
      const currentStreak = 3;

      // When: Calculating streak
      const newStreak = system.calculateStreak(lastLoginDate, currentStreak);

      // Then: Streak should increment
      assert.strictEqual(newStreak, 4);
    });

    it('should reset streak to 1 when missing a day', () => {
      // Given: A reward system with a login from 2 days ago
      const system = new RewardSystem();
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const lastLoginDate = twoDaysAgo.toISOString();
      const currentStreak = 5;

      // When: Calculating streak
      const newStreak = system.calculateStreak(lastLoginDate, currentStreak);

      // Then: Streak should reset
      assert.strictEqual(newStreak, 1);
    });

    it('should maintain streak when logging in same day', () => {
      // Given: A reward system with a login from earlier today
      const system = new RewardSystem();
      const today = new Date();
      const lastLoginDate = today.toISOString();
      const currentStreak = 7;

      // When: Calculating streak
      const newStreak = system.calculateStreak(lastLoginDate, currentStreak);

      // Then: Streak should remain the same
      assert.strictEqual(newStreak, 7);
    });
  });

  describe('claimDailyReward', () => {
    it('should return reward for day 1', () => {
      // Given: A reward system
      const system = new RewardSystem();
      const day = 1;

      // When: Claiming daily reward
      const reward = system.claimDailyReward(day);

      // Then: Should return day 1 reward
      assert.ok(reward);
      assert.strictEqual(reward.day, 1);
      assert.ok(reward.coins !== undefined);
    });

    it('should return increasing rewards for consecutive days', () => {
      // Given: A reward system
      const system = new RewardSystem();

      // When: Claiming rewards for days 1, 2, 3
      const reward1 = system.claimDailyReward(1);
      const reward2 = system.claimDailyReward(2);
      const reward3 = system.claimDailyReward(3);

      // Then: Rewards should increase
      assert.ok(reward2.coins >= reward1.coins);
      assert.ok(reward3.coins >= reward2.coins);
    });

    it('should return bonus reward for day 7', () => {
      // Given: A reward system
      const system = new RewardSystem();
      const day = 7;

      // When: Claiming day 7 reward
      const reward = system.claimDailyReward(day);

      // Then: Should return bonus reward
      assert.ok(reward);
      assert.strictEqual(reward.day, 7);
      assert.ok(reward.bonus === true);
    });

    it('should cycle rewards after day 7', () => {
      // Given: A reward system
      const system = new RewardSystem();

      // When: Claiming reward for day 8
      const reward8 = system.claimDailyReward(8);
      const reward1 = system.claimDailyReward(1);

      // Then: Day 8 should match day 1 pattern
      assert.strictEqual(reward8.coins, reward1.coins);
    });
  });
});
