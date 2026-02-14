// Unit tests for PowerMeter.getValue() — pure logic, no Phaser required.
// Run with: npm test  OR  node --test tests/power-meter.test.js

'use strict';
const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { PowerMeter } = require('../src/entities/PowerMeter.js');

// ─── PowerMeter.getValue(elapsedMs, cycleMs) ────────────────────────────────

test('getValue returns 0 at elapsed=0 (start of oscillation)', () => {
  const v = PowerMeter.getValue(0);
  assert.ok(Math.abs(v) < 1e-9, `Expected 0 at t=0, got ${v}`);
});

test('getValue returns 1 at half cycle (peak power)', () => {
  const cycle = 2000;
  const v = PowerMeter.getValue(cycle / 2, cycle);
  assert.ok(Math.abs(v - 1) < 1e-9, `Expected 1 at half cycle, got ${v}`);
});

test('getValue returns 0 at full cycle (back to start)', () => {
  const cycle = 2000;
  const v = PowerMeter.getValue(cycle, cycle);
  assert.ok(Math.abs(v) < 1e-9, `Expected 0 at full cycle, got ${v}`);
});

test('getValue is always in range [0, 1]', () => {
  const cycle = 2000;
  for (let t = 0; t <= cycle * 2; t += 50) {
    const v = PowerMeter.getValue(t, cycle);
    assert.ok(v >= 0 - 1e-9 && v <= 1 + 1e-9,
      `getValue(${t}) = ${v} is outside [0,1]`);
  }
});

test('getValue uses 2000ms default cycle', () => {
  // At t=1000ms (half of 2000ms default), value should peak at 1
  const v = PowerMeter.getValue(1000);
  assert.ok(Math.abs(v - 1) < 1e-9, `Expected 1 at 1000ms with default cycle, got ${v}`);
});

test('getValue is symmetric: getValue(t) === getValue(cycle - t)', () => {
  const cycle = 2000;
  const EPS   = 1e-9;
  for (let t = 0; t <= cycle / 2; t += 100) {
    const a = PowerMeter.getValue(t, cycle);
    const b = PowerMeter.getValue(cycle - t, cycle);
    assert.ok(Math.abs(a - b) < EPS,
      `Not symmetric: getValue(${t}) = ${a}, getValue(${cycle - t}) = ${b}`);
  }
});
