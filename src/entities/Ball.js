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

  // Returns true when the ball centre x is outside the play area — i.e. in
  // the left or right gutter. Only reads lane.playLeft and lane.playRight.
  // Boundary pixels (x === playLeft or x === playRight) are considered in-play.
  static isInGutter(x, lane) {
    return x < lane.playLeft || x > lane.playRight;
  }

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

  constructor(scene, stats = null) {
    this._scene    = scene;
    this._body     = null;
    this._graphic  = null;
    this._launched = false;
    this._stats    = stats || { speed: 1.0, control: 1.0, spin: 1.0 };
    this._trailEffect = null;
  }

  // Spawns the ball at the bottom-centre of the play area as a static body.
  // Remains static until launch() is called.
  spawn(lane, color = 0x2255ff, trailEffect = 'none') {
    this.destroy();

    this._trailEffect = trailEffect;

    const radius = lane.playWidth * 0.05; // slightly larger than pins
    const x      = lane.centerX;
    const y      = lane.height - 60;

    this._body = this._scene.matter.add.circle(x, y, radius, {
      isStatic:    true,   // held in place until player fires
      label:       'ball',
      friction:    0.1 * this._stats.control,
      frictionAir: 0.01,
      restitution: 0.3 * this._stats.spin,
      density:     0.01 * this._stats.speed,
    });

    this._graphic = this._scene.add.circle(x, y, radius, color);
    const strokeColor = ((color >> 16) & 0xff) * 0.5 << 16 | 
                        ((color >> 8) & 0xff) * 0.5 << 8 | 
                        (color & 0xff) * 0.5;
    this._graphic.setStrokeStyle(2, strokeColor);
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
    this._trailEffect = null;
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
