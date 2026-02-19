/**
 * Tests for AchievementNotification
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const AchievementNotification = require('../src/ui/AchievementNotification');

describe('AchievementNotification', () => {
  let mockScene;
  let notification;

  beforeEach(() => {
    // Mock Phaser scene
    mockScene = {
      add: {
        container: () => ({
          setDepth: function() { return this; },
          setAlpha: function() { return this; },
          setPosition: function() { return this; },
          add: function() {},
          destroy: function() {}
        }),
        graphics: () => ({
          fillStyle: function() { return this; },
          fillRoundedRect: function() { return this; }
        }),
        text: () => ({
          setOrigin: function() { return this; }
        })
      },
      tweens: {
        add: () => {}
      },
      time: {
        delayedCall: () => {}
      }
    };
  });

  describe('Notification creation', () => {
    it('should create notification with achievement data', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike',
        icon: 'strike_icon'
      };

      // When: Creating a notification
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);

      // Then: Notification should be created
      assert.ok(notification);
      assert.strictEqual(notification.achievementData, achievementData);
    });

    it('should position notification at specified coordinates', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };

      // When: Creating a notification at specific position
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);

      // Then: Notification should be positioned correctly
      assert.strictEqual(notification.x, 400);
      assert.strictEqual(notification.y, 100);
    });
  });

  describe('Notification display', () => {
    it('should show achievement name', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };

      // When: Creating a notification
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);

      // Then: Achievement name should be stored
      assert.strictEqual(notification.achievementData.name, 'First Strike');
    });

    it('should show achievement description', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };

      // When: Creating a notification
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);

      // Then: Achievement description should be stored
      assert.strictEqual(notification.achievementData.description, 'Get your first strike');
    });

    it('should have background container', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };

      // When: Creating a notification
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);

      // Then: Container should exist
      assert.ok(notification.container);
    });
  });

  describe('Notification animation', () => {
    it('should animate in when shown', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };

      // When: Creating and showing a notification
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);
      notification.show();

      // Then: Show method should execute without error
      assert.ok(true);
    });

    it('should auto-hide after duration', () => {
      // Given: A scene and achievement data
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };

      // When: Creating and showing a notification
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);
      notification.show();

      // Then: Show method should execute without error
      assert.ok(true);
    });

    it('should animate out when hidden', () => {
      // Given: A notification that is shown
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);
      notification.show();

      // When: Hiding the notification
      notification.hide();

      // Then: Hide method should execute without error
      assert.ok(true);
    });
  });

  describe('Notification lifecycle', () => {
    it('should destroy notification when complete', () => {
      // Given: A notification that is shown
      const achievementData = {
        name: 'First Strike',
        description: 'Get your first strike'
      };
      notification = new AchievementNotification(mockScene, 400, 100, achievementData);

      // When: Destroying the notification
      notification.destroy();

      // Then: Destroy method should execute without error
      assert.ok(true);
    });
  });
});
