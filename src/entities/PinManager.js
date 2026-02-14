// PinManager — owns pin lifecycle: spawn, track, reset.
//
// Pure logic (testable in Node):
//   PinManager.getPositions(lane) → [{x, y}] × 10
//
// Scene-dependent (requires Phaser):
//   new PinManager(scene)
//   .spawn(lane)    → creates Matter.js bodies + Phaser graphics
//   .getPins()      → array of { body, graphic } objects
//   .destroy()      → removes all bodies and graphics

class PinManager {
  // ─── Pure logic (static, no Phaser) ────────────────────────────────────

  // Returns the 10 pin positions in standard triangle formation.
  // All x positions scale with lane.playWidth; y positions use the
  // pin geometry constants stored on the lane object (pinHeadY, pinRowStep).
  //
  // Pin numbering:
  //   [7][8][9][10]   ← row 4 (back, highest on screen)
  //    [4][5][6]      ← row 3
  //     [2][3]        ← row 2
  //      [1]          ← row 1 (head pin, closest to bowler)
  static getPositions(lane) {
    if (!lane || lane.playWidth <= 0) {
      throw new Error(`PinManager: invalid lane playWidth (${lane?.playWidth})`);
    }

    const cx      = lane.centerX;
    const spacing = lane.playWidth * 0.14; // ~30px on default 220px play area
    const y       = (row) => lane.pinHeadY + (row - 1) * lane.pinRowStep;

    return [
      // Row 1 — 1 pin (head pin)
      { x: cx,                y: y(1) },
      // Row 2 — 2 pins
      { x: cx - spacing / 2,  y: y(2) },
      { x: cx + spacing / 2,  y: y(2) },
      // Row 3 — 3 pins
      { x: cx - spacing,      y: y(3) },
      { x: cx,                y: y(3) },
      { x: cx + spacing,      y: y(3) },
      // Row 4 — 4 pins (back row)
      { x: cx - 1.5 * spacing, y: y(4) },
      { x: cx - 0.5 * spacing, y: y(4) },
      { x: cx + 0.5 * spacing, y: y(4) },
      { x: cx + 1.5 * spacing, y: y(4) },
    ];
  }

  // ─── Scene-dependent ────────────────────────────────────────────────────

  constructor(scene) {
    this._scene = scene;
    this._pins  = [];
  }

  // Spawns 10 pins at correct positions. Calling spawn() again replaces
  // all existing pins (no duplicates accumulate).
  spawn(lane) {
    this.destroy();

    const radius    = lane.playWidth * 0.045; // ~10px on default 220px play area
    const positions = PinManager.getPositions(lane);

    for (const { x, y } of positions) {
      // Matter.js circle body
      const body = this._scene.matter.add.circle(x, y, radius, {
        isStatic:    false,
        label:       'pin',
        mass:        0.5,
        friction:    0.3,
        restitution: 0.4, // bouncy enough to scatter, not fly off
        frictionAir: 0.02,
      });

      // Phaser circle graphic synced to body position each frame
      const graphic = this._scene.add.circle(x, y, radius, 0xffffff);
      graphic.setStrokeStyle(2, 0xcc3333);

      this._pins.push({ body, graphic });
    }
  }

  // Returns all live pin objects (body + graphic pairs).
  getPins() {
    return this._pins;
  }

  // Removes all pin bodies and graphics from the scene.
  destroy() {
    for (const { body, graphic } of this._pins) {
      this._scene.matter.world.remove(body);
      graphic.destroy();
    }
    this._pins = [];
  }

  // Called each frame: syncs graphic position to physics body.
  update() {
    for (const { body, graphic } of this._pins) {
      graphic.setPosition(body.position.x, body.position.y);
    }
  }
}

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { PinManager };
