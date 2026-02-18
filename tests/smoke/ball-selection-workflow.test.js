const { describe, it } = require('node:test');
const assert = require('node:assert');

/**
 * Smoke Test: Ball Selection Workflow
 * 
 * Tests the complete user journey from viewing available balls
 * to selecting a ball and using it in gameplay.
 */

describe('Smoke Test: Ball Selection Workflow', () => {
  it('Complete_workflow_view_select_and_use_ball', () => {
    // Given: Player data with unlocked balls
    const { UnlockManager } = require('../../src/systems/UnlockManager');
    const unlockManager = new UnlockManager();
    unlockManager.unlockBall('ball_001');
    unlockManager.unlockBall('ball_002');

    // Given: Ball data is available
    const ballsData = require('../../src/data/balls.json');
    assert.ok(ballsData.length >= 10, 'Should have at least 10 balls defined');

    // When: Player views ball selection screen
    const unlockedBalls = ballsData.filter(ball => 
      unlockManager.isUnlocked(ball.id)
    );
    const lockedBalls = ballsData.filter(ball => 
      !unlockManager.isUnlocked(ball.id)
    );

    // Then: Should show unlocked and locked balls
    assert.strictEqual(unlockedBalls.length, 2, 'Should show 2 unlocked balls');
    assert.ok(lockedBalls.length > 0, 'Should show locked balls');

    // When: Player selects an unlocked ball
    const selectedBall = unlockedBalls[0];
    assert.ok(selectedBall, 'Should be able to select unlocked ball');
    assert.ok(selectedBall.stats, 'Selected ball should have stats');

    // When: Selected ball is used in gameplay
    const { Ball } = require('../../src/entities/Ball');
    
    // Mock minimal Phaser scene
    const mockScene = {
      matter: {
        add: { circle: () => ({ position: { x: 100, y: 100 } }) },
        body: { setStatic: () => {}, setVelocity: () => {} },
        world: { remove: () => {} }
      },
      add: {
        circle: () => ({ 
          setStrokeStyle: () => ({}), 
          setPosition: () => ({}), 
          destroy: () => ({}) 
        })
      }
    };

    const ball = new Ball(mockScene, selectedBall.stats);
    const lane = { playWidth: 200, centerX: 100, height: 400 };
    
    ball.spawn(lane, 0xff0000, selectedBall.trailEffect);

    // Then: Ball should be created with selected stats
    assert.ok(ball._stats, 'Ball should have stats');
    assert.strictEqual(ball._stats.speed, selectedBall.stats.speed, 
      'Ball should use selected speed stat');
    assert.strictEqual(ball._stats.control, selectedBall.stats.control,
      'Ball should use selected control stat');
    assert.strictEqual(ball._stats.spin, selectedBall.stats.spin,
      'Ball should use selected spin stat');
    assert.strictEqual(ball._trailEffect, selectedBall.trailEffect,
      'Ball should use selected trail effect');
  });

  it('Error_Scenario_Cannot_select_locked_ball', () => {
    // Given: Player with limited unlocks
    const { UnlockManager } = require('../../src/systems/UnlockManager');
    const unlockManager = new UnlockManager();
    unlockManager.unlockBall('ball_001');

    // Given: Ball data
    const ballsData = require('../../src/data/balls.json');
    const lockedBall = ballsData.find(ball => !unlockManager.isUnlocked(ball.id));

    // When: Player attempts to select locked ball
    const canSelect = unlockManager.isUnlocked(lockedBall.id);

    // Then: Selection should be prevented
    assert.strictEqual(canSelect, false, 'Should not be able to select locked ball');
  });

  it('Edge_Case_All_balls_have_required_properties', () => {
    // Given: All ball data
    const ballsData = require('../../src/data/balls.json');

    // When: Validating each ball
    ballsData.forEach((ball, index) => {
      // Then: Each ball should have required properties
      assert.ok(ball.id, `Ball ${index} should have id`);
      assert.ok(ball.name, `Ball ${index} should have name`);
      assert.ok(ball.stats, `Ball ${index} should have stats`);
      assert.ok(typeof ball.stats.speed === 'number', `Ball ${index} should have speed stat`);
      assert.ok(typeof ball.stats.control === 'number', `Ball ${index} should have control stat`);
      assert.ok(typeof ball.stats.spin === 'number', `Ball ${index} should have spin stat`);
      assert.ok(typeof ball.unlockLevel === 'number', `Ball ${index} should have unlockLevel`);
      assert.ok(ball.trailEffect, `Ball ${index} should have trailEffect`);
    });
  });
});
