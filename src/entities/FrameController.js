// FrameController — pure JS frame and ball state machine.
//
// Tracks currentFrame (1–10), currentBall (1–3 in frame 10), and rolls[].
//
// Events:
//   'frame-advance' — Emitted when a frame ends (frames 1–9) and when frame 10
//                     earns a bonus ball (pin reset needed before the bonus ball).
//                     Listener should call PinManager.reset() and respawn the ball.
//   'game-over'     — Emitted after the last roll of frame 10.
//
// Usage:
//   const fc = new FrameController();
//   fc.on('frame-advance', () => { /* reset pins */ });
//   fc.on('game-over', () => { /* show results */ });
//   fc.recordRoll(pinsKnocked);

'use strict';

class FrameController {
  constructor() {
    this.currentFrame = 1;
    this.currentBall  = 1;
    this.rolls        = [];
    this._done        = false;
    this._listeners   = {};

    // Track per-ball pins knocked for frame 10 validation.
    this._ball1Knocked = 0;
    this._ball2Knocked = 0;
    // Track frame 10 ball count separately (allows 3 balls on strike/spare).
    this._frame10Balls = 0;
  }

  // Register an event listener. Supported events: 'frame-advance', 'game-over'.
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }

  _emit(event) {
    (this._listeners[event] || []).forEach(fn => fn());
  }

  // Record a roll result (pinsKnocked: 0–10).
  // Throws on invalid input or if game is already over.
  recordRoll(pins) {
    if (this._done) throw new Error('Game over: no more rolls allowed');
    if (pins < 0 || pins > 10) throw new Error(`Invalid roll: ${pins} (must be 0–10)`);

    if (this.currentFrame === 10) {
      this._recordFrame10(pins);
    } else {
      this._recordNormalFrame(pins);
    }
  }

  _recordNormalFrame(pins) {
    if (this.currentBall === 1) {
      this._ball1Knocked = pins;
    } else {
      // ball 2: combined total must not exceed 10
      if (this._ball1Knocked + pins > 10) {
        throw new Error(`Invalid roll: ball 1 (${this._ball1Knocked}) + ball 2 (${pins}) exceeds 10`);
      }
    }

    this.rolls.push(pins);

    const isStrike = this.currentBall === 1 && pins === 10;
    const isLastBall = this.currentBall === 2 || isStrike;

    if (isLastBall) {
      this.currentFrame++;
      this.currentBall = 1;
      this._ball1Knocked = 0;
      this._emit('frame-advance');
    } else {
      this.currentBall++;
    }
  }

  _recordFrame10(pins) {
    // Validate based on how many balls have been thrown so far.
    if (this._frame10Balls === 1 && this._ball1Knocked !== 10) {
      // Ball 1 was not a strike: ball 1 + ball 2 cannot exceed 10.
      if (this._ball1Knocked + pins > 10) {
        throw new Error(`Invalid roll: ball 1 (${this._ball1Knocked}) + ball 2 (${pins}) exceeds 10`);
      }
    }
    if (this._frame10Balls === 2 && this._ball2Knocked !== 10) {
      // Ball 2 was not a strike: ball 2 + ball 3 cannot exceed 10.
      if (this._ball2Knocked + pins > 10) {
        throw new Error(`Invalid roll: frame-10 ball 2 (${this._ball2Knocked}) + ball 3 (${pins}) exceeds 10`);
      }
    }

    this.rolls.push(pins);
    this._frame10Balls++;

    if (this._frame10Balls === 1) {
      this._ball1Knocked = pins;
      this.currentBall = 2;
      return;
    }

    const ball1WasStrike = this._ball1Knocked === 10;
    const ball2Spare     = !ball1WasStrike && (this._ball1Knocked + pins === 10);

    if (this._frame10Balls === 2) {
      this._ball2Knocked = pins;
      if (ball1WasStrike || ball2Spare) {
        // Bonus ball earned — emit frame-advance so scene resets pins.
        this.currentBall = 3;
        this._emit('frame-advance');
        return;
      }
      // No bonus ball — game over
      this._done = true;
      this._emit('game-over');
      return;
    }

    // frame10Balls === 3: always game over
    this._done = true;
    this._emit('game-over');
  }
}

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { FrameController };
