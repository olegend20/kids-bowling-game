// How far below the ball's center a tap still counts as an aim gesture.
// Matches ball radius (LANE.playWidth * 0.05 = 11px today) plus a 9px margin.
const THROW_LINE_BUFFER = Math.ceil(LANE.playWidth * 0.05) + 9;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this._drawLane();
    this._addWalls();
    this._spawnPins();
    // Initialise UI and input state before spawning the ball, so that
    // _spawnBall() can safely call _resetInputState().
    this._aimGraphic = this.add.graphics();
    this._powerMeter = new PowerMeter(this);
    this._lockedAimX = 0;
    this._lockedAimY = 0;
    this._inputState = 'IDLE';
    this._powerStart = 0;
    this._spawnBall();
    this._setupInput();

    // Frame controller and event wiring
    this._frameController = new FrameController();
    this._rollRecorded = false; // prevent duplicate recording per throw
    this._setupFrameEvents();

    // Scoreboard UI
    this._scoreboard = new ScoreboardUI(this, 10, 10);
  }

  update() {
    if (this._pinManager) this._pinManager.update();
    if (this._ball)       this._ball.update();

    if (this._inputState === 'IDLE') {
      this._drawAimLine(); // follow pointer
    } else if (this._inputState === 'POWERING') {
      this._drawLockedAimLine();
      this._powerMeter.update(this.time.now - this._powerStart);
    } else if (this._inputState === 'LAUNCHED') {
      this._checkGutter();
      this._checkBallSettled();
    }

    // Update scoreboard display
    if (this._scoreboard) {
      this._scoreboard.update(this._frameController, ScoreEngine);
    }
  }

  // Detects when the launched ball enters the gutter zone (out of play).
  // Sets _gutterBall = true on first entry; subsequent frames are no-ops.
  // _gutterBall is read by the delivery scoring logic to classify the throw.
  _checkGutter() {
    if (this._gutterBall) return; // already flagged this delivery
    const pos = this._ball.getPosition();
    if (pos && Ball.isInGutter(pos.x, LANE)) {
      this._gutterBall = true;
    }
  }

  // Returns true if the current delivery entered the gutter.
  // Use this instead of reading _gutterBall directly.
  isGutterBall() {
    return this._gutterBall === true;
  }

  // ─── Frame coordination ──────────────────────────────────────────────────

  _setupFrameEvents() {
    this._frameController.on('frame-advance', () => {
      this._onFrameAdvance();
    });

    this._frameController.on('game-over', () => {
      this._onGameOver();
    });
  }

  // Checks if ball and pins have stopped moving (physics settled).
  // When settled, records the roll with FrameController once.
  _checkBallSettled() {
    if (this._rollRecorded) return; // already recorded this throw

    const SETTLE_THRESHOLD = 2.0; // velocity magnitude below this = settled
    
    // Only check ball and pin bodies (exclude static walls)
    const bodies = [
      this._ball?._body,
      ...this._pinManager.getPins().map(p => p.body)
    ].filter(Boolean);

    const speeds = bodies.map(body => {
      const vx = body.velocity.x;
      const vy = body.velocity.y;
      return Math.sqrt(vx * vx + vy * vy);
    });
    
    const maxSpeed = Math.max(...speeds);

    // Log every 60 frames (once per second at 60fps)
    if (this.time.now % 1000 < 16) {
      console.log('Checking settle - max speed:', maxSpeed.toFixed(2), 'threshold:', SETTLE_THRESHOLD);
    }

    const settled = maxSpeed < SETTLE_THRESHOLD;

    if (settled) {
      console.log('✓ Bodies settled! Recording roll...');
      this._recordRoll();
    }
  }

  // Records the current roll with FrameController.
  // Counts knocked pins and updates pin state tracking.
  _recordRoll() {
    // Count knocked pins by checking if they moved significantly from original position
    const pins = this._pinManager.getPins();
    const positions = PinManager.getPositions(LANE);
    
    let knockedCount = 0;
    pins.forEach((pin, index) => {
      const originalX = positions[index].x;
      const originalY = positions[index].y;
      const currentX = pin.body.position.x;
      const currentY = pin.body.position.y;
      
      // Check both X and Y movement (pins can be knocked sideways or forward)
      const distX = Math.abs(currentX - originalX);
      const distY = Math.abs(currentY - originalY);
      const totalDist = Math.sqrt(distX * distX + distY * distY);
      
      const knocked = totalDist > 5;
      if (knocked) {
        this._pinManager.markKnocked(index);
        knockedCount++;
        console.log(`Pin ${index}: moved ${totalDist.toFixed(1)}px - KNOCKED`);
      }
    });

    const pinsKnocked = this._pinManager.countKnocked();
    console.log(`✓ Roll recorded: ${pinsKnocked} pins knocked`);
    const wasStrike = pinsKnocked === 10;
    
    this._frameController.recordRoll(pinsKnocked);
    console.log(`Frame ${this._frameController.currentFrame}, Ball ${this._frameController.currentBall}, Game over: ${this._frameController.isGameOver()}`);
    this._rollRecorded = true;

    // If not a strike and this was ball 1, prepare for ball 2 (same frame)
    if (!wasStrike && this._frameController.currentBall === 2) {
      console.log('→ Spawning ball for second shot');
      // Ball 1 complete, ball 2 coming: keep knocked pins, respawn ball
      this._spawnBall();
      this._rollRecorded = false; // Reset for next roll
    }
    // Otherwise, frame-advance or game-over event will handle the transition
  }

  // Handles frame-advance event: reset pins and prepare for next ball.
  _onFrameAdvance() {
    // frame-advance fires when:
    // 1. Ball 1 was a strike → start next frame
    // 2. Ball 2 complete → start next frame
    // 3. Frame 10 bonus ball earned → reset for bonus ball
    // In all cases, we want a full pin reset.
    
    this._pinManager.reset(false); // full reset
    this._pinManager.spawn(LANE);
    this._spawnBall();
    this._rollRecorded = false;
  }

  // Handles game-over event: display game over state.
  _onGameOver() {
    const finalScore = ScoreEngine.calculateScore(this._frameController.rolls);
    this._inputState = 'GAME_OVER';
    this.scene.start('ResultsScene', { finalScore });
  }

  // ─── Rendering ───────────────────────────────────────────────────────────

  _drawLane() {
    const g = this.add.graphics();

    // Full lane background first (wood tone), then gutters overlay on top —
    // keeps draw order independent of edge-pixel rounding.
    g.fillStyle(0xd4a055, 1);
    g.fillRect(LANE.x, 0, LANE.width, LANE.height);

    // Gutter overlays (dark red-brown)
    g.fillStyle(0x4a2020, 1);
    g.fillRect(LANE.x, 0, LANE.gutterWidth, LANE.height);        // left gutter
    g.fillRect(LANE.playRight, 0, LANE.gutterWidth, LANE.height); // right gutter

    // Lane guide markers — four rectangular bars near ball launch zone
    g.fillStyle(0xb8863c, 1);
    const arrowY = 600;
    const arrowW = 6;
    const arrowH = 20;
    [-30, -10, 10, 30].forEach(offset => {
      g.fillRect(LANE.centerX + offset - arrowW / 2, arrowY, arrowW, arrowH);
    });

    // Pin spot markers — positions match PinManager.getPositions() exactly
    g.fillStyle(0xffffff, 0.6);
    for (const pos of PinManager.getPositions(LANE)) {
      g.fillCircle(pos.x, pos.y, 5);
    }
  }

  // ─── Ball ─────────────────────────────────────────────────────────────────

  // Spawns (or re-spawns) the ball and resets the input state machine.
  // Safe to call multiple times; the Ball instance is reused across throws
  // to avoid orphaning the underlying Matter.js physics body.
  _spawnBall() {
    if (!this._ball) this._ball = new Ball(this);
    this._ball.spawn(LANE);
    this._resetInputState();
  }

  // Resets input to IDLE so the player can aim and throw again.
  // Called by _spawnBall(); may also be called directly on game reset.
  _resetInputState() {
    this._inputState = 'IDLE';
    this._powerStart = 0;
    this._gutterBall = false;
    this._powerMeter.hide();
    this._aimGraphic.clear();
  }

  _setupInput() {
    this.input.on('pointerdown', (pointer) => {
      const pos = this._ball.getPosition();
      if (!pos) return;

      if (this._inputState === 'IDLE') {
        // Must aim toward the pins (above the ball).
        // THROW_LINE_BUFFER extends the tap target to the full ball sprite so
        // clicks on the lower half of the ball still register.
        if (pointer.y >= pos.y + THROW_LINE_BUFFER) return;
        // Lock direction and start power meter
        this._lockedAimX = pointer.x;
        this._lockedAimY = pointer.y;
        this._powerStart = this.time.now;
        this._powerMeter.show(LANE.rightEdge + 28, LANE.height / 2);
        this._inputState = 'POWERING';

      } else if (this._inputState === 'POWERING') {
        // Second click: launch at current power level
        const power = PowerMeter.getValue(this.time.now - this._powerStart);
        const speed = 4 + power * 14; // 4 (min playable) → 18 (full power)
        this._ball.launch(this._lockedAimX, this._lockedAimY, speed);
        this._powerMeter.hide();
        this._aimGraphic.clear();
        this._inputState = 'LAUNCHED';
      }
    });
  }

  // Draws a guide line from the ball to the live pointer (IDLE state).
  _drawAimLine() {
    const pos = this._ball.getPosition();
    const pointer = this.input.activePointer;
    this._aimGraphic.clear();
    if (!pos || pointer.y >= pos.y + THROW_LINE_BUFFER) return;

    this._aimGraphic.lineStyle(2, 0xffffff, 0.6);
    this._aimGraphic.beginPath();
    this._aimGraphic.moveTo(pos.x, pos.y);
    this._aimGraphic.lineTo(pointer.x, pointer.y);
    this._aimGraphic.strokePath();
  }

  // Draws a frozen guide line toward the locked aim point (POWERING state).
  _drawLockedAimLine() {
    const pos = this._ball.getPosition();
    this._aimGraphic.clear();
    if (!pos) return;

    this._aimGraphic.lineStyle(2, 0xffdd44, 0.8); // yellow = locked
    this._aimGraphic.beginPath();
    this._aimGraphic.moveTo(pos.x, pos.y);
    this._aimGraphic.lineTo(this._lockedAimX, this._lockedAimY);
    this._aimGraphic.strokePath();
  }

  // ─── Pins ─────────────────────────────────────────────────────────────────

  _spawnPins() {
    this._pinManager = new PinManager(this);
    this._pinManager.spawn(LANE);
  }

  // ─── Physics walls ────────────────────────────────────────────────────────

  _addWalls() {
    const wallThickness = 10;
    const opts = { isStatic: true, label: 'wall' };

    // Left outer lane wall
    this.matter.add.rectangle(
      LANE.x - wallThickness / 2, LANE.height / 2,
      wallThickness, LANE.height,
      opts
    );
    // Right outer lane wall
    this.matter.add.rectangle(
      LANE.rightEdge + wallThickness / 2, LANE.height / 2,
      wallThickness, LANE.height,
      opts
    );
    // Back wall (top of lane)
    this.matter.add.rectangle(
      LANE.centerX, -wallThickness / 2,
      LANE.width + wallThickness * 2, wallThickness,
      opts
    );
    // Bottom boundary — prevents physics bodies from escaping off-screen
    this.matter.add.rectangle(
      LANE.centerX, LANE.height + wallThickness / 2,
      LANE.width + wallThickness * 2, wallThickness,
      opts
    );
  }
}
