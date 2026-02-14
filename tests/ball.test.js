// Unit tests for Ball.getLaunchVelocity() — pure logic, no Phaser required.
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
