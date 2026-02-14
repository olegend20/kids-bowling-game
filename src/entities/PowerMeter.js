// PowerMeter — owns the power meter: value oscillation and Phaser UI bar.
//
// Pure logic (testable in Node):
//   PowerMeter.getValue(elapsedMs, cycleMs) → 0–1 (sine oscillation)
//
// Scene-dependent (requires Phaser):
//   new PowerMeter(scene)
//   .show(x, y)         → make meter visible at position
//   .update(elapsedMs)  → redraw bar at current value
//   .hide()             → hide meter
//   .destroy()          → remove graphics

const METER_WIDTH   = 18;
const METER_HEIGHT  = 120;
const METER_CYCLE   = 2000; // ms for one full oscillation

class PowerMeter {
  // ─── Pure logic (static, no Phaser) ─────────────────────────────────────

  // Returns power in [0, 1], oscillating via raised-cosine so it starts at 0,
  // peaks at 1 at the half-cycle mark, and returns to 0 each full cycle.
  static getValue(elapsedMs, cycleMs = METER_CYCLE) {
    return 0.5 - 0.5 * Math.cos((elapsedMs / cycleMs) * 2 * Math.PI);
  }

  // ─── Scene-dependent ────────────────────────────────────────────────────

  constructor(scene) {
    this._scene    = scene;
    this._graphic  = null;
    this._label    = null;
    this._x        = 0;
    this._y        = 0;
    this._visible  = false;
  }

  // Positions the meter at (x, y) — center of the bar — and shows it.
  show(x, y) {
    this._x = x;
    this._y = y;
    this._visible = true;

    if (!this._graphic) {
      this._graphic = this._scene.add.graphics();
    }
    if (!this._label) {
      this._label = this._scene.add.text(x, y + METER_HEIGHT / 2 + 14, 'POWER', {
        fontSize: '11px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }).setOrigin(0.5, 0);
    }

    this._graphic.setVisible(true);
    this._label.setVisible(true);
    this.update(0); // draw at zero to avoid flash of empty
  }

  // Redraws the bar to match elapsedMs into the oscillation.
  update(elapsedMs) {
    if (!this._graphic || !this._visible) return;

    const power  = PowerMeter.getValue(elapsedMs);
    const filled = Math.round(METER_HEIGHT * power);
    const g      = this._graphic;
    const left   = this._x - METER_WIDTH / 2;
    const top    = this._y - METER_HEIGHT / 2;

    g.clear();

    // Background track
    g.fillStyle(0x222222, 0.8);
    g.fillRect(left, top, METER_WIDTH, METER_HEIGHT);

    // Fill — colour transitions green → yellow → red with power
    let fillColour;
    if      (power < 0.5) fillColour = 0x44cc44; // green
    else if (power < 0.8) fillColour = 0xddcc00; // yellow
    else                  fillColour = 0xff4422; // red
    g.fillStyle(fillColour, 1);
    g.fillRect(left, top + METER_HEIGHT - filled, METER_WIDTH, filled);

    // Border
    g.lineStyle(2, 0xffffff, 0.7);
    g.strokeRect(left, top, METER_WIDTH, METER_HEIGHT);
  }

  // Hides the meter without destroying it.
  hide() {
    this._visible = false;
    if (this._graphic) this._graphic.setVisible(false);
    if (this._label)   this._label.setVisible(false);
  }

  // Removes all Phaser objects.
  destroy() {
    if (this._graphic) { this._graphic.destroy(); this._graphic = null; }
    if (this._label)   { this._label.destroy();   this._label   = null; }
    this._visible = false;
  }
}

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { PowerMeter };
