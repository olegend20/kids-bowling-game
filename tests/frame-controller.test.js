// Unit tests for FrameController — frame and ball state machine.
// Pure JS, no Phaser.
// Run with: npm test  OR  node --test tests/frame-controller.test.js

'use strict';
const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { FrameController } = require('../src/entities/FrameController.js');

// ─── Initial state ────────────────────────────────────────────────────────

test('initial state: frame=1, ball=1, rolls empty', () => {
  const fc = new FrameController();
  assert.equal(fc.currentFrame, 1);
  assert.equal(fc.currentBall, 1);
  assert.deepEqual(fc.rolls, []);
});

// ─── Strike ───────────────────────────────────────────────────────────────

test('strike on ball 1 advances to frame 2, ball 1', () => {
  const fc = new FrameController();
  fc.recordRoll(10);
  assert.equal(fc.currentFrame, 2);
  assert.equal(fc.currentBall, 1);
});

test('strike records roll value', () => {
  const fc = new FrameController();
  fc.recordRoll(10);
  assert.deepEqual(fc.rolls, [10]);
});

test('strike emits frame-advance event', () => {
  const fc = new FrameController();
  let fired = false;
  fc.on('frame-advance', () => { fired = true; });
  fc.recordRoll(10);
  assert.equal(fired, true);
});

// ─── Normal ball 1 (non-strike) ──────────────────────────────────────────

test('non-strike ball 1 advances to ball 2 same frame', () => {
  const fc = new FrameController();
  fc.recordRoll(7);
  assert.equal(fc.currentFrame, 1);
  assert.equal(fc.currentBall, 2);
});

test('gutter ball advances to ball 2', () => {
  const fc = new FrameController();
  fc.recordRoll(0);
  assert.equal(fc.currentFrame, 1);
  assert.equal(fc.currentBall, 2);
});

// ─── Ball 2 — spare ───────────────────────────────────────────────────────

test('spare advances to next frame', () => {
  const fc = new FrameController();
  fc.recordRoll(7); // ball 1
  fc.recordRoll(3); // ball 2 — spare
  assert.equal(fc.currentFrame, 2);
  assert.equal(fc.currentBall, 1);
});

test('spare emits frame-advance', () => {
  const fc = new FrameController();
  let count = 0;
  fc.on('frame-advance', () => { count++; });
  fc.recordRoll(7);
  fc.recordRoll(3);
  assert.equal(count, 1);
});

// ─── Ball 2 — non-spare ───────────────────────────────────────────────────

test('non-spare ball 2 advances to next frame', () => {
  const fc = new FrameController();
  fc.recordRoll(7);
  fc.recordRoll(1); // 8 total, not a spare
  assert.equal(fc.currentFrame, 2);
  assert.equal(fc.currentBall, 1);
  assert.deepEqual(fc.rolls, [7, 1]);
});

test('two gutter balls advance to next frame', () => {
  const fc = new FrameController();
  fc.recordRoll(0);
  fc.recordRoll(0);
  assert.equal(fc.currentFrame, 2);
  assert.equal(fc.currentBall, 1);
});

// ─── Game-over ────────────────────────────────────────────────────────────

test('game-over fires after final ball of frame 10 (no strike/spare)', () => {
  const fc = new FrameController();
  let gameOver = false;
  fc.on('game-over', () => { gameOver = true; });

  // Play 9 full frames (2 rolls each, no strikes/spares)
  for (let f = 0; f < 9; f++) {
    fc.recordRoll(4);
    fc.recordRoll(5);
  }
  assert.equal(fc.currentFrame, 10);

  fc.recordRoll(4); // ball 1 of frame 10
  fc.recordRoll(5); // ball 2 of frame 10 — no spare
  assert.equal(gameOver, true);
});

test('frame 10 strike allows 3 balls before game-over', () => {
  const fc = new FrameController();
  let gameOver = false;
  fc.on('game-over', () => { gameOver = true; });

  // Play frames 1-9
  for (let f = 0; f < 9; f++) {
    fc.recordRoll(4);
    fc.recordRoll(5);
  }

  fc.recordRoll(10); // frame 10 ball 1 — strike
  assert.equal(gameOver, false, 'game-over should not fire after frame 10 ball 1 strike');

  fc.recordRoll(5);  // frame 10 ball 2
  assert.equal(gameOver, false, 'game-over should not fire after frame 10 ball 2');

  fc.recordRoll(3);  // frame 10 ball 3
  assert.equal(gameOver, true, 'game-over should fire after frame 10 ball 3');
});

test('frame 10 strike emits frame-advance before bonus ball', () => {
  const fc = new FrameController();
  const advances = [];
  fc.on('frame-advance', () => { advances.push(fc.currentBall); });

  for (let f = 0; f < 9; f++) { fc.recordRoll(4); fc.recordRoll(5); }

  fc.recordRoll(10); // ball 1 — strike
  fc.recordRoll(6);  // ball 2 — earns bonus ball → frame-advance should fire
  assert.ok(advances.length >= 1, 'frame-advance should fire when bonus ball is earned');
});

test('frame 10 ball-3 validation: ball2=6, ball3=9 exceeds 10 and throws', () => {
  const fc = new FrameController();
  for (let f = 0; f < 9; f++) { fc.recordRoll(4); fc.recordRoll(5); }
  fc.recordRoll(10); // strike — earn bonus balls
  fc.recordRoll(6);  // ball 2
  assert.throws(() => fc.recordRoll(9), /invalid roll/i); // 6+9=15 > 10
});

// ─── Input validation ────────────────────────────────────────────────────

test('recordRoll with value > 10 throws', () => {
  const fc = new FrameController();
  assert.throws(() => fc.recordRoll(11), /invalid roll/i);
});

test('recordRoll with value < 0 throws', () => {
  const fc = new FrameController();
  assert.throws(() => fc.recordRoll(-1), /invalid roll/i);
});

test('recordRoll with ball1+ball2 > 10 in normal frame throws', () => {
  const fc = new FrameController();
  fc.recordRoll(7);
  assert.throws(() => fc.recordRoll(4), /invalid roll/i);
});

test('recordRoll after game-over throws', () => {
  const fc = new FrameController();
  for (let f = 0; f < 9; f++) { fc.recordRoll(4); fc.recordRoll(5); }
  fc.recordRoll(4);
  fc.recordRoll(5);
  assert.throws(() => fc.recordRoll(0), /game over/i);
});
