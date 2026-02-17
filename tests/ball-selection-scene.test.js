const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

// Mock Phaser scene for testing
class MockPhaserScene {
  constructor() {
    this.cameras = {
      main: { width: 800, height: 600 }
    };
    this.add = {
      text: () => ({ setOrigin: () => ({}), setInteractive: () => ({}) }),
      rectangle: () => ({ setOrigin: () => ({}), setInteractive: () => ({}) }),
      graphics: () => ({ fillStyle: () => ({}), fillRect: () => ({}) })
    };
    this.scene = {
      start: () => {}
    };
    this._selectedBall = null;
  }
}

describe('BallSelectionScene', () => {
  let BallSelectionScene;
  let scene;
  let mockUnlockManager;
  let mockBallsData;

  beforeEach(() => {
    // Mock dependencies
    mockBallsData = [
      { id: 'ball_001', name: 'Classic Red', unlockLevel: 1, stats: { speed: 1.0, control: 1.0, spin: 1.0 } },
      { id: 'ball_002', name: 'Blue Streak', unlockLevel: 3, stats: { speed: 1.2, control: 0.9, spin: 1.0 } },
      { id: 'ball_003', name: 'Green Machine', unlockLevel: 5, stats: { speed: 1.0, control: 1.2, spin: 0.9 } }
    ];

    mockUnlockManager = {
      unlockedBalls: ['ball_001'],
      isUnlocked: function(ballId) {
        return this.unlockedBalls.includes(ballId);
      }
    };

    // Load the actual BallSelectionScene
    BallSelectionScene = require('../src/scenes/BallSelectionScene');
    scene = new BallSelectionScene();
    
    // Mock Phaser properties
    Object.assign(scene, new MockPhaserScene());
  });

  describe('initialization', () => {
    it('should load ball data on create', () => {
      // Given: Scene is created with ball data
      scene.cache = {
        json: {
          get: (key) => key === 'balls' ? mockBallsData : null
        }
      };

      // When: create is called
      scene.create({ unlockManager: mockUnlockManager, currentLevel: 1 });

      // Then: Ball data should be loaded
      assert.ok(scene.ballsData);
      assert.strictEqual(scene.ballsData.length, 3);
    });

    it('should store unlock manager reference', () => {
      // Given: Scene is created with unlock manager
      scene.cache = {
        json: {
          get: (key) => key === 'balls' ? mockBallsData : null
        }
      };

      // When: create is called
      scene.create({ unlockManager: mockUnlockManager, currentLevel: 1 });

      // Then: Unlock manager should be stored
      assert.ok(scene.unlockManager);
    });
  });

  describe('ball selection', () => {
    beforeEach(() => {
      scene.cache = {
        json: {
          get: (key) => key === 'balls' ? mockBallsData : null
        }
      };
      scene.create({ unlockManager: mockUnlockManager, currentLevel: 1 });
    });

    it('should allow selecting unlocked ball', () => {
      // Given: An unlocked ball
      const ballId = 'ball_001';

      // When: Selecting the ball
      scene.selectBall(ballId);

      // Then: Ball should be selected
      assert.strictEqual(scene.selectedBall, ballId);
    });

    it('should not allow selecting locked ball', () => {
      // Given: A locked ball
      const ballId = 'ball_002';

      // When: Attempting to select the ball
      scene.selectBall(ballId);

      // Then: Ball should not be selected
      assert.strictEqual(scene.selectedBall, null);
    });

    it('should return selected ball data', () => {
      // Given: A ball is selected
      scene.selectBall('ball_001');

      // When: Getting selected ball data
      const ballData = scene.getSelectedBallData();

      // Then: Should return correct ball data
      assert.ok(ballData);
      assert.strictEqual(ballData.id, 'ball_001');
      assert.strictEqual(ballData.name, 'Classic Red');
    });
  });

  describe('ball filtering', () => {
    beforeEach(() => {
      scene.cache = {
        json: {
          get: (key) => key === 'balls' ? mockBallsData : null
        }
      };
      scene.create({ unlockManager: mockUnlockManager, currentLevel: 1 });
    });

    it('should identify unlocked balls', () => {
      // Given: Ball data and unlock manager
      // When: Getting unlocked balls
      const unlockedBalls = scene.getUnlockedBalls();

      // Then: Should return only unlocked balls
      assert.strictEqual(unlockedBalls.length, 1);
      assert.strictEqual(unlockedBalls[0].id, 'ball_001');
    });

    it('should identify locked balls', () => {
      // Given: Ball data and unlock manager
      // When: Getting locked balls
      const lockedBalls = scene.getLockedBalls();

      // Then: Should return only locked balls
      assert.strictEqual(lockedBalls.length, 2);
      assert.strictEqual(lockedBalls[0].id, 'ball_002');
      assert.strictEqual(lockedBalls[1].id, 'ball_003');
    });
  });
});
