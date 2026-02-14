// Ball — owns the bowling ball: spawn, aim, launch, update.
//
// Pure logic (testable in Node):
//   Ball.getLaunchVelocity(fromX, fromY, toX, toY, speed) → {x, y}
//
// Scene-dependent (requires Phaser):
//   new Ball(scene)
//   .spawn(lane)       → creates static Matter.js body + Phaser graphic
//   .launch(toX, toY)  → fires ball toward aim point (once per throw)
//   .isLaunched()      → true after fired
//   .getPosition()     → {x, y} of physics body
//   .destroy()         → removes body and graphic

const BALL_SPEED = 10; // px/frame (Matter.js velocity units)

class Ball {
  // ─── Pure logic (static, no Phaser) ─────────────────────────────────────

  // Returns normalised velocity vector scaled to `speed` in the direction
  // from (fromX, fromY) toward (toX, toY).
  static getLaunchVelocity(fromX, fromY, toX, toY, speed) {
    const dx  = toX - fromX;
    const dy  = toY - fromY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) throw new Error('Ball: cannot aim at own position');
    return { x: (dx / len) * speed, y: (dy / len) * speed };
  }

  // ─── Scene-dependent ────────────────────────────────────────────────────

  constructor(scene) {
    this._scene    = scene;
    this._body     = null;
    this._graphic  = null;
    this._launched = false;
  }

  // Spawns the ball at the bottom-centre of the play area as a static body.
  // Remains static until launch() is called.
  spawn(lane) {
    this.destroy();

    const radius = lane.playWidth * 0.05; // slightly larger than pins
    const x      = lane.centerX;
    const y      = lane.height - 60;

    this._body = this._scene.matter.add.circle(x, y, radius, {
      isStatic:    true,   // held in place until player fires
      label:       'ball',
      friction:    0,
      frictionAir: 0.001,  // near-frictionless slide down the lane
      restitution: 0.2,
    });

    this._graphic = this._scene.add.circle(x, y, radius, 0x2255ff);
    this._graphic.setStrokeStyle(2, 0x001188);
  }

  // Fires the ball toward (toX, toY) at the given speed (defaults to BALL_SPEED).
  // No-op if already launched.
  launch(toX, toY, speed = BALL_SPEED) {
    if (this._launched || !this._body) return;

    const pos = this._body.position;
    const { x: vx, y: vy } = Ball.getLaunchVelocity(
      pos.x, pos.y, toX, toY, speed
    );

    this._scene.matter.body.setStatic(this._body, false);
    this._scene.matter.body.setMass(this._body, 2); // heavier than pins (0.5); must set after going dynamic
    this._scene.matter.body.setVelocity(this._body, { x: vx, y: vy });
    this._launched = true;
  }

  isLaunched() { return this._launched; }

  // Returns current physics body position, or null if not spawned.
  getPosition() {
    return this._body ? { ...this._body.position } : null;
  }

  // Removes physics body and graphic from the scene.
  destroy() {
    if (this._body) {
      this._scene.matter.world.remove(this._body);
      this._body = null;
    }
    if (this._graphic) {
      this._graphic.destroy();
      this._graphic = null;
    }
    this._launched = false;
  }

  // Called each frame: syncs graphic to physics body position.
  update() {
    if (this._body && this._graphic) {
      this._graphic.setPosition(this._body.position.x, this._body.position.y);
    }
  }
}

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { Ball };
