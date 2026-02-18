const { describe, it } = require('node:test');
const assert = require('node:assert');

// Mock Phaser scene for visual testing
class MockPhaserScene {
  constructor() {
    this.createdObjects = [];
    this.add = {
      circle: (x, y, radius, color) => {
        const obj = { type: 'circle', x, y, radius, color, strokeStyle: null };
        obj.setStrokeStyle = (width, strokeColor) => {
          obj.strokeStyle = { width, strokeColor };
          return obj;
        };
        obj.setPosition = (newX, newY) => {
          obj.x = newX;
          obj.y = newY;
          return obj;
        };
        obj.destroy = () => {
          const idx = this.createdObjects.indexOf(obj);
          if (idx > -1) this.createdObjects.splice(idx, 1);
        };
        this.createdObjects.push(obj);
        return obj;
      }
    };
    this.matter = {
      add: {
        circle: () => ({ position: { x: 100, y: 100 } })
      },
      body: {
        setStatic: () => {},
        setVelocity: () => {}
      },
      world: {
        remove: () => {}
      }
    };
  }
}

describe('Feature: Ball visuals and trail effects', () => {
  it('Acceptance_Criterion_5_Ball_visuals_render_correctly', () => {
    // Given: A ball with specific color
    const { Ball } = require('../../src/entities/Ball');
    const scene = new MockPhaserScene();
    const lane = { playWidth: 200, centerX: 100, height: 400 };
    const ballColor = 0xff0000; // Red

    const ball = new Ball(scene);

    // When: Spawning the ball with color
    ball.spawn(lane, ballColor, 'none');

    // Then: Ball graphic should be created with correct color
    const graphics = scene.createdObjects.filter(obj => obj.type === 'circle');
    assert.strictEqual(graphics.length, 1, 'Should create one ball graphic');
    assert.strictEqual(graphics[0].color, ballColor, 'Ball should have correct color');
    assert.ok(graphics[0].strokeStyle, 'Ball should have stroke style');
  });

  it('Acceptance_Criterion_5_Trail_effect_parameter_stored', () => {
    // Given: A ball with trail effect
    const { Ball } = require('../../src/entities/Ball');
    const scene = new MockPhaserScene();
    const lane = { playWidth: 200, centerX: 100, height: 400 };

    const ball = new Ball(scene);

    // When: Spawning with trail effect
    ball.spawn(lane, 0xff0000, 'sparkle');

    // Then: Trail effect should be stored
    assert.strictEqual(ball._trailEffect, 'sparkle', 'Trail effect should be stored');
  });

  it('Acceptance_Criterion_5_Default_trail_effect_is_none', () => {
    // Given: A ball without trail effect specified
    const { Ball } = require('../../src/entities/Ball');
    const scene = new MockPhaserScene();
    const lane = { playWidth: 200, centerX: 100, height: 400 };

    const ball = new Ball(scene);

    // When: Spawning without trail effect
    ball.spawn(lane, 0xff0000);

    // Then: Should default to 'none'
    assert.strictEqual(ball._trailEffect, 'none', 'Trail effect should default to none when not provided');
  });

  it('Acceptance_Criterion_5_Multiple_balls_have_different_colors', () => {
    // Given: Multiple balls with different colors
    const { Ball } = require('../../src/entities/Ball');
    const scene = new MockPhaserScene();
    const lane = { playWidth: 200, centerX: 100, height: 400 };

    const redBall = new Ball(scene);
    const blueBall = new Ball(scene);
    const greenBall = new Ball(scene);

    // When: Spawning balls with different colors
    redBall.spawn(lane, 0xff0000, 'none');
    blueBall.spawn(lane, 0x0000ff, 'sparkle');
    greenBall.spawn(lane, 0x00ff00, 'glow');

    // Then: Each ball should have its own color
    const graphics = scene.createdObjects.filter(obj => obj.type === 'circle');
    assert.strictEqual(graphics.length, 3, 'Should create three ball graphics');
    assert.strictEqual(graphics[0].color, 0xff0000, 'First ball should be red');
    assert.strictEqual(graphics[1].color, 0x0000ff, 'Second ball should be blue');
    assert.strictEqual(graphics[2].color, 0x00ff00, 'Third ball should be green');
  });

  it('Error_Scenario_Ball_visual_cleanup_on_destroy', () => {
    // Given: A spawned ball
    const { Ball } = require('../../src/entities/Ball');
    const scene = new MockPhaserScene();
    const lane = { playWidth: 200, centerX: 100, height: 400 };

    const ball = new Ball(scene);
    ball.spawn(lane, 0xff0000, 'none');

    // When: Destroying the ball
    const initialCount = scene.createdObjects.length;
    ball.destroy();

    // Then: Graphics should be removed
    assert.strictEqual(scene.createdObjects.length, initialCount - 1, 
      'Ball graphic should be removed from scene');
  });
});
