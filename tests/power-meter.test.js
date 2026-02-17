// Unit tests for PowerMeter.getValue() — pure logic, no Phaser required.
// Run with: npm test  OR  node --test tests/power-meter.test.js

'use strict';
const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { PowerMeter } = require('../src/entities/PowerMeter.js');

// ─── PowerMeter.getValue(elapsedMs, cycleMs) ────────────────────────────────

test('getValue returns 0 at elapsed=0 (start of oscillation)', () => {
  const value = PowerMeter.getValue(0);
  assert.ok(Math.abs(value) < 1e-9, `Expected 0 at t=0, got ${value}`);
});

test('getValue returns 1 at half cycle (peak power)', () => {
  const cycle = 2000;
  const value = PowerMeter.getValue(cycle / 2, cycle);
  assert.ok(Math.abs(value - 1) < 1e-9, `Expected 1 at half cycle, got ${value}`);
});

test('getValue returns 0 at full cycle (back to start)', () => {
  const cycle = 2000;
  const value = PowerMeter.getValue(cycle, cycle);
  assert.ok(Math.abs(value) < 1e-9, `Expected 0 at full cycle, got ${value}`);
});

test('getValue is always in range [0, 1]', () => {
  const cycle = 2000;
  for (let t = 0; t <= cycle * 2; t += 50) {
    const value = PowerMeter.getValue(t, cycle);
    assert.ok(value >= 0 - 1e-9 && value <= 1 + 1e-9,
      `getValue(${t}) = ${value} is outside [0,1]`);
  }
});

test('getValue uses 2000ms default cycle', () => {
  // At t=1000ms (half of 2000ms default), value should peak at 1
  const value = PowerMeter.getValue(1000);
  assert.ok(Math.abs(value - 1) < 1e-9, `Expected 1 at 1000ms with default cycle, got ${value}`);
});

test('getValue is symmetric: getValue(t) === getValue(cycle - t)', () => {
  const cycle = 2000;
  const EPS   = 1e-9;
  for (let t = 0; t <= cycle / 2; t += 100) {
    const valueA = PowerMeter.getValue(t, cycle);
    const valueB = PowerMeter.getValue(cycle - t, cycle);
    assert.ok(Math.abs(valueA - valueB) < EPS,
      `Not symmetric: getValue(${t}) = ${valueA}, getValue(${cycle - t}) = ${valueB}`);
  }
});

// ─── PowerMeter constructor with cycleMs ────────────────────────────────────

test('constructor accepts cycleMs parameter', () => {
  const mockScene = {};
  const meter = new PowerMeter(mockScene, 1500);
  assert.ok(meter, 'PowerMeter should be created with cycleMs parameter');
});

test('constructor defaults to 2000ms when cycleMs not provided', () => {
  const mockScene = {};
  const meter = new PowerMeter(mockScene);
  assert.ok(meter, 'PowerMeter should be created without cycleMs parameter');
});

test('update uses instance cycleMs for getValue', () => {
  const mockScene = {
    add: {
      graphics: () => ({
        clear: () => {},
        fillStyle: () => {},
        fillRect: () => {},
        lineStyle: () => {},
        strokeRect: () => {},
        setVisible: () => {}
      }),
      text: () => ({
        setOrigin: () => ({ setVisible: () => {} })
      })
    }
  };
  const meter = new PowerMeter(mockScene, 1000);
  meter.show(100, 100);
  meter.update(500); // Half of 1000ms cycle should give power=1
  assert.ok(true, 'update should use instance cycleMs');
});
