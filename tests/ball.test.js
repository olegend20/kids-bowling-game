// Unit tests for Ball.getLaunchVelocity() and Ball.isInGutter() — pure logic, no Phaser required.
// Run with: npm test  OR  node --test tests/ball.test.js

'use strict';
const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { Ball } = require('../src/entities/Ball.js');

const SPEED = 10;
const EPS   = 1e-9; // floating-point tolerance

// ─── Input validation ────────────────────────────────────────────────────────

test('getLaunchVelocity throws when aim point equals origin', () => {
  assert.throws(
    () => Ball.getLaunchVelocity(100, 100, 100, 100, SPEED),
    /cannot aim at own position/,
    'Expected error when from === to'
  );
});

// ─── Direction correctness ────────────────────────────────────────────────────

test('getLaunchVelocity straight up returns {x:0, y:-speed}', () => {
  const v = Ball.getLaunchVelocity(240, 740, 240, 100, SPEED);
  assert.ok(Math.abs(v.x) < EPS,           `x should be 0, got ${v.x}`);
  assert.ok(Math.abs(v.y + SPEED) < EPS,   `y should be -${SPEED}, got ${v.y}`);
});

test('getLaunchVelocity straight right returns {x:speed, y:0}', () => {
  const v = Ball.getLaunchVelocity(0, 0, 100, 0, SPEED);
  assert.ok(Math.abs(v.x - SPEED) < EPS,  `x should be ${SPEED}, got ${v.x}`);
  assert.ok(Math.abs(v.y) < EPS,           `y should be 0, got ${v.y}`);
});

test('getLaunchVelocity diagonal 3-4-5 triangle', () => {
  // Direction: (3, -4) normalized → (0.6, -0.8)
  const v = Ball.getLaunchVelocity(0, 0, 30, -40, SPEED);
  assert.ok(Math.abs(v.x - SPEED * 0.6) < EPS,  `x should be ${SPEED * 0.6}, got ${v.x}`);
  assert.ok(Math.abs(v.y - SPEED * -0.8) < EPS, `y should be ${SPEED * -0.8}, got ${v.y}`);
});

// ─── Gutter detection ────────────────────────────────────────────────────────
// Uses a minimal lane mock: only playLeft and playRight are required.
const MOCK_LANE = { playLeft: 130, playRight: 350 };

test('isInGutter returns false for ball in centre of play area', () => {
  assert.equal(Ball.isInGutter(240, MOCK_LANE), false,
    'Center ball should not be in gutter');
});

test('isInGutter returns false for ball exactly at playLeft boundary', () => {
  assert.equal(Ball.isInGutter(130, MOCK_LANE), false,
    'Ball at playLeft edge is still in play');
});

test('isInGutter returns false for ball exactly at playRight boundary', () => {
  assert.equal(Ball.isInGutter(350, MOCK_LANE), false,
    'Ball at playRight edge is still in play');
});

test('isInGutter returns true for ball one pixel left of play area', () => {
  assert.equal(Ball.isInGutter(129, MOCK_LANE), true,
    'Ball at 129 (< playLeft 130) should be in left gutter');
});

test('isInGutter returns true for ball one pixel right of play area', () => {
  assert.equal(Ball.isInGutter(351, MOCK_LANE), true,
    'Ball at 351 (> playRight 350) should be in right gutter');
});

test('isInGutter returns true for ball against the left wall', () => {
  // x=100 is the outer left edge of the lane — 30px into the gutter
  assert.equal(Ball.isInGutter(100, MOCK_LANE), true,
    'Ball at lane left edge (x=100) should be in gutter');
});

test('isInGutter returns true for ball against the right wall', () => {
  // x=380 is the outer right edge of the lane — 30px into the right gutter
  assert.equal(Ball.isInGutter(380, MOCK_LANE), true,
    'Ball at lane right edge (x=380) should be in gutter');
});

// ─── Speed magnitude ─────────────────────────────────────────────────────────

test('getLaunchVelocity result has correct magnitude', () => {
  const v = Ball.getLaunchVelocity(240, 740, 180, 200, SPEED);
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  assert.ok(Math.abs(mag - SPEED) < EPS, `Magnitude should be ${SPEED}, got ${mag}`);
});

test('getLaunchVelocity magnitude is independent of distance to aim point', () => {
  const near = Ball.getLaunchVelocity(0, 0, 0, -10,  SPEED);
  const far  = Ball.getLaunchVelocity(0, 0, 0, -1000, SPEED);
  assert.ok(
    Math.abs(near.y - far.y) < EPS,
    `Speed should not change with distance (near=${near.y}, far=${far.y})`
  );
});

// ─── Difficulty: speed multiplier ────────────────────────────────────────────

test('launch accepts optional speed multiplier', () => {
  // Given: A mock scene with Matter.js
  const mockScene = {
    matter: {
      add: {
        circle: (x, y, r, opts) => ({ position: { x, y }, ...opts })
      },
      body: {
        setStatic: () => {},
        setVelocity: (body, vel) => { body.velocity = vel; }
      },
      world: { remove: () => {} }
    },
    add: {
      circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} })
    }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const ball = new Ball(mockScene);
  ball.spawn(lane);

  // When: launch is called with speed multiplier 1.5
  ball.launch(240, 100, SPEED * 1.5);

  // Then: ball velocity should be 1.5x normal speed
  const expectedSpeed = SPEED * 1.5;
  const actualSpeed = Math.sqrt(
    ball._body.velocity.x ** 2 + ball._body.velocity.y ** 2
  );
  assert.ok(
    Math.abs(actualSpeed - expectedSpeed) < EPS,
    `Ball speed should be ${expectedSpeed}, got ${actualSpeed}`
  );
});

test('launch uses default speed when multiplier omitted', () => {
  // Given: A mock scene
  const mockScene = {
    matter: {
      add: {
        circle: (x, y, r, opts) => ({ position: { x, y }, ...opts })
      },
      body: {
        setStatic: () => {},
        setVelocity: (body, vel) => { body.velocity = vel; }
      },
      world: { remove: () => {} }
    },
    add: {
      circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} })
    }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const ball = new Ball(mockScene);
  ball.spawn(lane);

  // When: launch is called without speed parameter
  ball.launch(240, 100);

  // Then: ball velocity should be default BALL_SPEED
  const actualSpeed = Math.sqrt(
    ball._body.velocity.x ** 2 + ball._body.velocity.y ** 2
  );
  assert.ok(
    Math.abs(actualSpeed - SPEED) < EPS,
    `Ball speed should default to ${SPEED}, got ${actualSpeed}`
  );
});

// ─── Ball stats integration ──────────────────────────────────────────────────

test('Ball accepts stats object in constructor', () => {
  // Given: A mock scene and ball stats
  const mockScene = {
    matter: {
      add: { circle: () => ({ position: { x: 0, y: 0 } }) },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };
  const stats = { speed: 1.2, control: 0.9, spin: 1.1 };

  // When: Ball is created with stats
  const ball = new Ball(mockScene, stats);

  // Then: Ball should store stats
  assert.deepEqual(ball._stats, stats, 'Ball should store provided stats');
});

test('Ball uses default stats when none provided', () => {
  // Given: A mock scene
  const mockScene = {
    matter: {
      add: { circle: () => ({ position: { x: 0, y: 0 } }) },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };

  // When: Ball is created without stats
  const ball = new Ball(mockScene);

  // Then: Ball should use default stats (1.0 for all)
  assert.deepEqual(
    ball._stats,
    { speed: 1.0, control: 1.0, spin: 1.0 },
    'Ball should use default stats when none provided'
  );
});

test('spawn applies power stat to ball mass', () => {
  // Given: A mock scene that captures physics options
  let capturedOpts = null;
  const mockScene = {
    matter: {
      add: {
        circle: (x, y, r, opts) => {
          capturedOpts = opts;
          return { position: { x, y }, ...opts };
        }
      },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const stats = { speed: 1.5, control: 1.0, spin: 1.0 };
  const ball = new Ball(mockScene, stats);

  // When: Ball is spawned
  ball.spawn(lane);

  // Then: density should be affected by power stat (higher power = higher density)
  const expectedDensity = 0.01 * stats.speed;
  assert.ok(
    Math.abs(capturedOpts.density - expectedDensity) < EPS,
    `Density should be ${expectedDensity}, got ${capturedOpts.density}`
  );
});

test('spawn applies control stat to ball friction', () => {
  // Given: A mock scene that captures physics options
  let capturedOpts = null;
  const mockScene = {
    matter: {
      add: {
        circle: (x, y, r, opts) => {
          capturedOpts = opts;
          return { position: { x, y }, ...opts };
        }
      },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const stats = { speed: 1.0, control: 1.3, spin: 1.0 };
  const ball = new Ball(mockScene, stats);

  // When: Ball is spawned
  ball.spawn(lane);

  // Then: friction should be affected by control stat (higher control = higher friction)
  const expectedFriction = 0.1 * stats.control;
  assert.ok(
    Math.abs(capturedOpts.friction - expectedFriction) < EPS,
    `Friction should be ${expectedFriction}, got ${capturedOpts.friction}`
  );
});

test('spawn applies spin stat to ball restitution', () => {
  // Given: A mock scene that captures physics options
  let capturedOpts = null;
  const mockScene = {
    matter: {
      add: {
        circle: (x, y, r, opts) => {
          capturedOpts = opts;
          return { position: { x, y }, ...opts };
        }
      },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const stats = { speed: 1.0, control: 1.0, spin: 1.4 };
  const ball = new Ball(mockScene, stats);

  // When: Ball is spawned
  ball.spawn(lane);

  // Then: restitution should be affected by spin stat (higher spin = higher restitution)
  const expectedRestitution = 0.3 * stats.spin;
  assert.ok(
    Math.abs(capturedOpts.restitution - expectedRestitution) < EPS,
    `Restitution should be ${expectedRestitution}, got ${capturedOpts.restitution}`
  );
});

test('spawn accepts trailEffect parameter', () => {
  // Given: A mock scene
  const mockScene = {
    matter: {
      add: { circle: () => ({ position: { x: 0, y: 0 } }) },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const ball = new Ball(mockScene);

  // When: Ball is spawned with trail effect
  ball.spawn(lane, 0x2255ff, 'sparkle');

  // Then: Ball should store trail effect
  assert.equal(ball._trailEffect, 'sparkle', 'Ball should store trail effect');
});

test('spawn uses "none" trail effect when not provided', () => {
  // Given: A mock scene
  const mockScene = {
    matter: {
      add: { circle: () => ({ position: { x: 0, y: 0 } }) },
      body: { setStatic: () => {}, setVelocity: () => {} },
      world: { remove: () => {} }
    },
    add: { circle: () => ({ setStrokeStyle: () => {}, destroy: () => {} }) }
  };
  const lane = { playWidth: 220, centerX: 240, height: 800 };
  const ball = new Ball(mockScene);

  // When: Ball is spawned without trail effect
  ball.spawn(lane);

  // Then: Ball should use "none" trail effect
  assert.equal(ball._trailEffect, 'none', 'Ball should default to "none" trail effect');
});
