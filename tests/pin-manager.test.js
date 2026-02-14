// Unit tests for PinManager.getPositions() — pure logic, no Phaser required.
// Run with: npm test  OR  node --test tests/pin-manager.test.js

'use strict';
const { test } = require('node:test');
const assert   = require('node:assert/strict');
const { PinManager } = require('../src/entities/PinManager.js');

// Minimum centre-to-centre distance = 2 × pin radius (pins must not physically overlap).
// Pin radius = playWidth * 0.045; for default lane (playWidth=220) that's ~9.9px.
// We use 2× radius as the threshold so visually touching pins fail the test.
function minSeparation(lane) {
  return 2 * (lane.playWidth * 0.045);
}

// Returns the distinct y-values present in a positions array.
function distinctRows(positions) {
  return [...new Set(positions.map(p => p.y))];
}

// Factory for a lane config object matching the structure from src/config/lane.js
function makeLane(width = 280, gutterWidth = 30, x = 100) {
  return {
    x,
    width,
    gutterWidth,
    height: 800,
    pinHeadY:   255,
    pinRowStep: -35,
    get playLeft()  { return this.x + this.gutterWidth; },
    get playRight() { return this.x + this.width - this.gutterWidth; },
    get playWidth() { return this.width - 2 * this.gutterWidth; },
    get centerX()   { return this.x + this.width / 2; },
    get rightEdge() { return this.x + this.width; },
  };
}

// ─── Input validation ────────────────────────────────────────────────────

test('getPositions throws on zero-width lane', () => {
  assert.throws(
    () => PinManager.getPositions(makeLane(60, 30, 100)), // playWidth = 0
    /invalid lane playWidth/,
    'Expected error for zero playWidth'
  );
});

test('getPositions throws on null lane', () => {
  assert.throws(
    () => PinManager.getPositions(null),
    /invalid lane playWidth/,
    'Expected error for null lane'
  );
});

// ─── Correct pin count ────────────────────────────────────────────────────

test('getPositions returns exactly 10 pins', () => {
  const positions = PinManager.getPositions(makeLane());
  assert.equal(positions.length, 10, 'Expected 10 pin positions');
});

// ─── Triangle formation ───────────────────────────────────────────────────

test('getPositions returns 4 rows with 1, 2, 3, 4 pins', () => {
  const positions = PinManager.getPositions(makeLane());

  const ys = distinctRows(positions).sort((a, b) => b - a);
  assert.equal(ys.length, 4, 'Expected 4 distinct y-rows');

  const counts = ys.map(y => positions.filter(p => p.y === y).length);
  assert.deepEqual(counts, [1, 2, 3, 4], 'Row counts should be 1, 2, 3, 4 (front to back)');
});

test('all rows are horizontally centred on the lane', () => {
  const lane = makeLane();
  const positions = PinManager.getPositions(lane);
  const cx = lane.centerX;

  for (const y of distinctRows(positions)) {
    const row = positions.filter(p => p.y === y).map(p => p.x);
    const rowCx = (Math.min(...row) + Math.max(...row)) / 2;
    assert.ok(
      Math.abs(rowCx - cx) < 1,
      `Row at y=${y} is not centred on lane (rowCx=${rowCx}, cx=${cx})`
    );
  }
});

// ─── No hardcoded pixels: positions scale with lane ───────────────────────

test('pin spread scales with lane width', () => {
  const narrow = makeLane(200, 20, 140);
  const wide   = makeLane(400, 40, 40);

  const spread = (pos) => Math.max(...pos.map(p => p.x)) - Math.min(...pos.map(p => p.x));
  assert.ok(
    spread(PinManager.getPositions(wide)) > spread(PinManager.getPositions(narrow)),
    'Pins should spread wider in a wider lane'
  );
});

test('no pin is outside the play area', () => {
  const lane = makeLane();
  const positions = PinManager.getPositions(lane);

  for (const { x } of positions) {
    assert.ok(x >= lane.playLeft,  `Pin at x=${x} is left of play area (${lane.playLeft})`);
    assert.ok(x <= lane.playRight, `Pin at x=${x} is right of play area (${lane.playRight})`);
  }
});

// ─── No overlapping pins ──────────────────────────────────────────────────

test('no two pins physically overlap', () => {
  const lane = makeLane();
  const positions = PinManager.getPositions(lane);
  const minDist = minSeparation(lane);

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      assert.ok(
        dist >= minDist,
        `Pins ${i} and ${j} overlap (dist=${dist.toFixed(1)}, min=${minDist.toFixed(1)})`
      );
    }
  }
});
