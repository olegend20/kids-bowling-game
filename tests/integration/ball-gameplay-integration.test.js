const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Ball } = require('../../src/entities/Ball');

// Mock Phaser scene for Matter.js physics
class MockPhaser {
  constructor() {
    this.bodies = [];
    this.matter = {
      add: {
        circle: (x, y, radius, options) => {
          const body = {
            position: { x, y },
            radius,
            isStatic: options.isStatic,
            friction: options.friction,
            frictionAir: options.frictionAir,
            restitution: options.restitution,
            density: options.density,
            label: options.label
          };
          this.bodies.push(body);
          return body;
        }
      },
      body: {
        setStatic: (body, isStatic) => { body.isStatic = isStatic; },
        setVelocity: (body, velocity) => { body.velocity = velocity; }
      },
      world: {
        remove: (body) => {
          const idx = this.bodies.indexOf(body);
          if (idx > -1) this.bodies.splice(idx, 1);
        }
      }
    };
    this.add = {
      circle: () => ({ setStrokeStyle: () => ({}), setPosition: () => ({}), destroy: () => ({}) })
    };
  }
}

describe('Feature: Ball stats affect gameplay', () => {
  it('Acceptance_Criterion_4_Selected_ball_affects_gameplay_physics', () => {
    // Given: Two balls with different stats
    const scene = new MockPhaser();
    const lane = { playWidth: 200, centerX: 100, height: 400 };
    
    const fastBall = new Ball(scene, { speed: 1.5, control: 1.0, spin: 1.0 });
    const controlBall = new Ball(scene, { speed: 1.0, control: 1.5, spin: 1.0 });

    // When: Spawning both balls
    fastBall.spawn(lane, 0xff0000, 'none');
    controlBall.spawn(lane, 0x00ff00, 'none');

    // Then: Fast ball should have higher density (more mass/speed)
    const fastBody = scene.bodies[0];
    const controlBody = scene.bodies[1];
    
    assert.ok(fastBody.density > controlBody.density, 
      'Fast ball should have higher density for more speed');
    
    // Then: Control ball should have higher friction (more control)
    assert.ok(controlBody.friction > fastBody.friction,
      'Control ball should have higher friction for better control');
  });

  it('Acceptance_Criterion_4_Spin_stat_affects_ball_restitution', () => {
    // Given: Two balls with different spin stats
    const scene = new MockPhaser();
    const lane = { playWidth: 200, centerX: 100, height: 400 };
    
    const normalBall = new Ball(scene, { speed: 1.0, control: 1.0, spin: 1.0 });
    const spinBall = new Ball(scene, { speed: 1.0, control: 1.0, spin: 1.5 });

    // When: Spawning both balls
    normalBall.spawn(lane, 0xff0000, 'none');
    spinBall.spawn(lane, 0x00ff00, 'none');

    // Then: Spin ball should have higher restitution (more bounce)
    const normalBody = scene.bodies[0];
    const spinBody = scene.bodies[1];
    
    assert.ok(spinBody.restitution > normalBody.restitution,
      'Spin ball should have higher restitution for more bounce');
  });

  it('Acceptance_Criterion_4_Default_stats_when_none_provided', () => {
    // Given: Ball created without stats
    const scene = new MockPhaser();
    const lane = { playWidth: 200, centerX: 100, height: 400 };
    
    const defaultBall = new Ball(scene);

    // When: Spawning the ball
    defaultBall.spawn(lane, 0xff0000, 'none');

    // Then: Should use default stats (1.0 for all)
    const body = scene.bodies[0];
    
    assert.strictEqual(body.density, 0.01 * 1.0, 'Should use default speed stat');
    assert.strictEqual(body.friction, 0.1 * 1.0, 'Should use default control stat');
    assert.strictEqual(body.restitution, 0.3 * 1.0, 'Should use default spin stat');
  });

  it('Error_Scenario_Ball_stats_out_of_range', () => {
    // Given: Ball with extreme stats
    const scene = new MockPhaser();
    const lane = { playWidth: 200, centerX: 100, height: 400 };
    
    const extremeBall = new Ball(scene, { speed: 10.0, control: 0.1, spin: 5.0 });

    // When: Spawning the ball
    extremeBall.spawn(lane, 0xff0000, 'none');

    // Then: Physics should still work (no crash)
    const body = scene.bodies[0];
    assert.ok(body, 'Ball should spawn even with extreme stats');
    assert.ok(body.density > 0, 'Density should be positive');
  });
});
