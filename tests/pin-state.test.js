// Unit tests for PinManager state tracking — markKnocked, countKnocked, reset, isStrike, isSpare.
// No Phaser required.
// Run with: npm test  OR  node --test tests/pin-state.test.js

'use strict';
const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { PinManager } = require('../src/entities/PinManager.js');

// PinManager state tracking requires a fake "scene" but we only use the
// state-tracking API (no physics), so we pass null for the scene.
function makePM() {
  const pm = new PinManager(null);
  // Pre-populate _pins with 10 stub entries (no real bodies/graphics needed).
  pm._pins = Array.from({ length: 10 }, (_, i) => ({ index: i }));
  return pm;
}

// ─── Initial state ────────────────────────────────────────────────────────

test('new PinManager has 0 knocked and 10 standing', () => {
  const pm = makePM();
  assert.equal(pm.countKnocked(), 0);
  assert.equal(pm.countStanding(), 10);
});

// ─── markKnocked ─────────────────────────────────────────────────────────

test('markKnocked(0) sets pin 0 as knocked', () => {
  const pm = makePM();
  pm.markKnocked(0);
  assert.equal(pm.countKnocked(), 1);
  assert.equal(pm.countStanding(), 9);
});

test('markKnocked on 3 pins counts correctly', () => {
  const pm = makePM();
  pm.markKnocked(0);
  pm.markKnocked(1);
  pm.markKnocked(2);
  assert.equal(pm.countKnocked(), 3);
  assert.equal(pm.countStanding(), 7);
});

test('markKnocked on already-knocked pin is a no-op', () => {
  const pm = makePM();
  pm.markKnocked(0);
  pm.markKnocked(0);
  assert.equal(pm.countKnocked(), 1);
});

test('markKnocked with out-of-range index throws', () => {
  const pm = makePM();
  assert.throws(() => pm.markKnocked(-1), /index out of range/);
  assert.throws(() => pm.markKnocked(10), /index out of range/);
});

// ─── reset ────────────────────────────────────────────────────────────────

test('reset(false) clears all knocked pins', () => {
  const pm = makePM();
  pm.markKnocked(0);
  pm.markKnocked(1);
  pm.reset(false);
  assert.equal(pm.countKnocked(), 0);
  assert.equal(pm.countStanding(), 10);
});

test('reset(true) keeps 3 knocked pins knocked; 7 remain standing', () => {
  const pm = makePM();
  pm.markKnocked(0);
  pm.markKnocked(1);
  pm.markKnocked(2);
  pm.reset(true);
  assert.equal(pm.countKnocked(), 3);
  assert.equal(pm.countStanding(), 7);
});

test('reset(true) when no pins knocked leaves 10 standing', () => {
  const pm = makePM();
  pm.reset(true);
  assert.equal(pm.countStanding(), 10);
});

// ─── isStrike / isSpare ───────────────────────────────────────────────────

test('isStrike returns true when all 10 knocked', () => {
  const pm = makePM();
  for (let i = 0; i < 10; i++) pm.markKnocked(i);
  assert.equal(pm.isStrike(), true);
});

test('isStrike returns false when fewer than 10 knocked', () => {
  const pm = makePM();
  for (let i = 0; i < 9; i++) pm.markKnocked(i);
  assert.equal(pm.isStrike(), false);
});

test('isSpare returns true when 7+3 knocked across 2 balls', () => {
  const pm = makePM();
  for (let i = 0; i < 7; i++) pm.markKnocked(i);  // ball 1: 7
  for (let i = 7; i < 10; i++) pm.markKnocked(i); // ball 2: 3
  assert.equal(pm.isSpare(7), true);
});

test('isSpare returns false when pins remain after 2nd ball', () => {
  const pm = makePM();
  for (let i = 0; i < 8; i++) pm.markKnocked(i);
  assert.equal(pm.isSpare(8), false);
});

test('isSpare returns false on ball-1 strike (all 10 knocked, ball1=10)', () => {
  const pm = makePM();
  for (let i = 0; i < 10; i++) pm.markKnocked(i);
  // Strike scenario: all knocked on ball 1 — not a spare
  assert.equal(pm.isSpare(10), false);
});
