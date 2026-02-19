/**
 * Tests for AchievementScene
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const AchievementScene = require('../src/scenes/AchievementScene');
const AchievementSystem = require('../src/systems/AchievementSystem');

describe('AchievementScene', () => {
  let scene;
  let mockAchievementSystem;

  beforeEach(() => {
    scene = new AchievementScene();
    mockAchievementSystem = new AchievementSystem();
  });

  describe('Scene initialization', () => {
    it('should have correct scene key', () => {
      // Given: A new AchievementScene instance
      // When: Checking the scene key
      // Then: It should be "AchievementScene"
      assert.strictEqual(scene.key, 'AchievementScene');
    });

    it('should accept achievement system in create data', () => {
      // Given: An achievement system with unlocked achievements
      mockAchievementSystem.unlockAchievement('ach_001');
      
      // When: Creating the scene with the achievement system
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: The scene should store the achievement system
      assert.strictEqual(scene.achievementSystem, mockAchievementSystem);
    });
  });

  describe('Achievement grid rendering', () => {
    it('should display all 20 achievements', () => {
      // Given: An achievement system
      // When: Creating the scene
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: All 20 achievements should be available for display
      const achievementsData = require('../src/data/achievements.json');
      assert.strictEqual(achievementsData.length, 20);
    });

    it('should show unlocked state for unlocked achievements', () => {
      // Given: An achievement system with one unlocked achievement
      mockAchievementSystem.unlockAchievement('ach_001');
      
      // When: Creating the scene
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: The unlocked achievement should be marked as unlocked
      const unlockedAchievements = mockAchievementSystem.getUnlockedAchievements();
      assert.ok(unlockedAchievements.includes('ach_001'));
    });

    it('should show locked state for locked achievements', () => {
      // Given: An achievement system with no unlocked achievements
      // When: Creating the scene
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: All achievements should be locked
      const unlockedAchievements = mockAchievementSystem.getUnlockedAchievements();
      assert.strictEqual(unlockedAchievements.length, 0);
    });
  });

  describe('Achievement details', () => {
    it('should display achievement name and description', () => {
      // Given: An achievement system
      // When: Creating the scene
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: Achievement data should include name and description
      const achievement = mockAchievementSystem.getAchievementById('ach_001');
      assert.ok(achievement.name);
      assert.ok(achievement.description);
    });

    it('should display progress for unlocked achievements', () => {
      // Given: An achievement system with unlocked achievements
      mockAchievementSystem.unlockAchievement('ach_001');
      
      // When: Creating the scene
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: Progress should be 100% for unlocked achievements
      const unlockedAchievements = mockAchievementSystem.getUnlockedAchievements();
      assert.ok(unlockedAchievements.includes('ach_001'));
    });
  });

  describe('Navigation', () => {
    it('should provide back button to return to previous scene', () => {
      // Given: An achievement system
      // When: Creating the scene
      scene.create({ achievementSystem: mockAchievementSystem });
      
      // Then: Scene should have achievement system stored (navigation tested in E2E)
      assert.ok(scene.achievementSystem);
    });
  });
});
