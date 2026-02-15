// Unit tests for DifficultyConfig — pure logic, no Phaser required.
// Run with: npm test  OR  node --test tests/difficulty-config.test.js

'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DifficultyConfig } = require('../src/config/DifficultyConfig.js');

// ─── DifficultyConfig.getTier(age) ──────────────────────────────────────────

test('getTier returns "easy" for age < 6', () => {
  assert.equal(DifficultyConfig.getTier(3), 'easy');
  assert.equal(DifficultyConfig.getTier(5), 'easy');
});

test('getTier returns "medium" for age 6-12', () => {
  assert.equal(DifficultyConfig.getTier(6), 'medium');
  assert.equal(DifficultyConfig.getTier(10), 'medium');
  assert.equal(DifficultyConfig.getTier(12), 'medium');
});

test('getTier returns "hard" for age 13+', () => {
  assert.equal(DifficultyConfig.getTier(13), 'hard');
  assert.equal(DifficultyConfig.getTier(20), 'hard');
});

test('getTier handles edge case: age 0', () => {
  assert.equal(DifficultyConfig.getTier(0), 'easy');
});

test('getTier handles edge case: age 999', () => {
  assert.equal(DifficultyConfig.getTier(999), 'hard');
});

test('getTier handles non-integer age', () => {
  assert.equal(DifficultyConfig.getTier(10.5), 'medium');
});

test('getTier throws error for negative age', () => {
  assert.throws(() => DifficultyConfig.getTier(-5), /age must be non-negative/i);
});

test('getTier throws error for null/undefined age', () => {
  assert.throws(() => DifficultyConfig.getTier(null), /age must be a number/i);
  assert.throws(() => DifficultyConfig.getTier(undefined), /age must be a number/i);
});

// ─── DifficultyConfig.getConfig(tier) ───────────────────────────────────────

test('getConfig returns easy config', () => {
  const config = DifficultyConfig.getConfig('easy');
  assert.equal(config.pinDensity, 0.0008);
  assert.equal(config.ballSpeedMultiplier, 0.9);
  assert.equal(config.powerMeterCycle, 2500);
  assert.deepEqual(config.powerOptimalRange, [0.3, 1.0]);
  assert.equal(config.gutterWidth, 25);
});

test('getConfig returns medium config', () => {
  const config = DifficultyConfig.getConfig('medium');
  assert.equal(config.pinDensity, 0.0015);
  assert.equal(config.ballSpeedMultiplier, 1.0);
  assert.equal(config.powerMeterCycle, 1500);
  assert.deepEqual(config.powerOptimalRange, [0.5, 0.85]);
  assert.equal(config.gutterWidth, 30);
});

test('getConfig returns hard config', () => {
  const config = DifficultyConfig.getConfig('hard');
  assert.equal(config.pinDensity, 0.002);
  assert.equal(config.ballSpeedMultiplier, 1.1);
  assert.equal(config.powerMeterCycle, 1000);
  assert.deepEqual(config.powerOptimalRange, [0.6, 0.75]);
  assert.equal(config.gutterWidth, 35);
});

test('getConfig throws error for invalid tier', () => {
  assert.throws(() => DifficultyConfig.getConfig('invalid'), /invalid tier/i);
  assert.throws(() => DifficultyConfig.getConfig(null), /tier must be a string/i);
});

// ─── DifficultyConfig.getConfigForAge(age) ──────────────────────────────────

test('getConfigForAge combines getTier and getConfig', () => {
  const config = DifficultyConfig.getConfigForAge(10);
  assert.equal(config.pinDensity, 0.0015); // medium
  assert.equal(config.ballSpeedMultiplier, 1.0);
});

test('getConfigForAge works for easy tier', () => {
  const config = DifficultyConfig.getConfigForAge(3);
  assert.equal(config.pinDensity, 0.0008); // easy
});

test('getConfigForAge works for hard tier', () => {
  const config = DifficultyConfig.getConfigForAge(15);
  assert.equal(config.pinDensity, 0.002); // hard
});
