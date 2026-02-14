// Unit tests for ScoreEngine — pure bowling score calculator.
// Run with: npm test

'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ScoreEngine } = require('../src/entities/ScoreEngine.js');

// ─── Basic scoring ────────────────────────────────────────────────────────

test('all gutter balls scores 0', () => {
  const rolls = Array(20).fill(0);
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 0);
});

test('all 1-pin rolls scores 20', () => {
  const rolls = Array(20).fill(1);
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 20);
});

test('one spare scores 10 + next roll', () => {
  const rolls = [5, 5, 3, 0, ...Array(16).fill(0)];
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 16); // frame 1: 5+5+3=13, frame 2: 3+0=3
});

test('one strike scores 10 + next 2 rolls', () => {
  const rolls = [10, 3, 4, ...Array(16).fill(0)];
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 24); // frame 1: 10+3+4=17, frame 2: 3+4=7
});

// ─── Perfect game ─────────────────────────────────────────────────────────

test('perfect game (12 strikes) scores 300', () => {
  const rolls = Array(12).fill(10);
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 300);
});

// ─── Frame 10 scoring ─────────────────────────────────────────────────────

test('frame 10 spare gets bonus ball', () => {
  const rolls = [...Array(18).fill(0), 5, 5, 3];
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 13); // frame 10: 5+5+3=13
});

test('frame 10 strike gets 2 bonus balls', () => {
  const rolls = [...Array(18).fill(0), 10, 3, 4];
  const score = ScoreEngine.calculateScore(rolls);
  assert.equal(score, 17); // frame 10: 10+3+4=17
});

// ─── Frame-by-frame scores ────────────────────────────────────────────────

test('getFrameScores returns array of 10 frame scores', () => {
  const rolls = [10, 3, 4, ...Array(16).fill(0)];
  const frames = ScoreEngine.getFrameScores(rolls);
  assert.equal(frames.length, 10);
  assert.equal(frames[0], 17); // strike + 3 + 4
  assert.equal(frames[1], 7);  // 3 + 4
  assert.equal(frames[2], 0);  // gutter
});

test('getFrameScores handles incomplete game', () => {
  const rolls = [10, 3, 4]; // only 2 frames
  const frames = ScoreEngine.getFrameScores(rolls);
  assert.equal(frames.length, 10);
  assert.equal(frames[0], 17);
  assert.equal(frames[1], 7);
  assert.equal(frames[2], null); // incomplete
});

// ─── Edge cases ───────────────────────────────────────────────────────────

test('empty rolls array scores 0', () => {
  const score = ScoreEngine.calculateScore([]);
  assert.equal(score, 0);
});

test('incomplete frame returns null for that frame', () => {
  const rolls = [5]; // ball 1 only
  const frames = ScoreEngine.getFrameScores(rolls);
  assert.equal(frames[0], null); // can't score until ball 2
});

test('strike in frame 9 needs frame 10 to score', () => {
  const rolls = [...Array(16).fill(0), 10]; // strike in frame 9
  const frames = ScoreEngine.getFrameScores(rolls);
  assert.equal(frames[8], null); // can't score yet (needs next 2 rolls)
});
