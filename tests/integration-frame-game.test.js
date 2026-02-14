// Integration test: FrameController + GameScene using isGameOver()
// Tests that the game-over state is correctly reflected in GameScene.
// Run with: npm test

'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

// Mock Phaser scene for testing
class MockScene {
  constructor() {
    this.matter = {
      world: {
        getAllBodies: () => this._bodies || [],
        remove: () => {},
      },
      add: {
        circle: () => ({ position: { x: 0, y: 0 } }),
        rectangle: () => {},
      },
    };
    this.add = {
      circle: () => ({ setPosition: () => {}, destroy: () => {} }),
      graphics: () => ({ 
        clear: () => {}, 
        lineStyle: () => {}, 
        beginPath: () => {}, 
        moveTo: () => {}, 
        lineTo: () => {}, 
        strokePath: () => {},
        fillStyle: () => {},
        fillRect: () => {},
        fillCircle: () => {},
      }),
    };
    this.input = {
      on: () => {},
      activePointer: { x: 0, y: 0 },
    };
    this.time = { now: 0 };
    this._bodies = [];
  }

  setBodies(bodies) {
    this._bodies = bodies;
  }
}

const LANE = {
  x: 100,
  width: 250,
  height: 700,
  gutterWidth: 15,
  playWidth: 220,
  centerX: 225,
  playLeft: 115,
  playRight: 335,
  rightEdge: 350,
  pinHeadY: 100,
  pinRowStep: 30,
};

// Load dependencies
global.LANE = LANE;
const { FrameController } = require('../src/entities/FrameController.js');
const { PinManager } = require('../src/entities/PinManager.js');
const { Ball } = require('../src/entities/Ball.js');
const { PowerMeter } = require('../src/entities/PowerMeter.js');

// Minimal GameScene stub that includes the frame controller integration
class GameSceneStub {
  constructor() {
    this.scene = new MockScene();
    this._frameController = new FrameController();
    this._rollRecorded = false;
    this._inputState = 'IDLE';
    this._pinManager = new PinManager(this.scene);
    this._ball = new Ball(this.scene);
    
    // Setup frame events
    this._frameController.on('frame-advance', () => {
      this._onFrameAdvance();
    });
    
    this._frameController.on('game-over', () => {
      this._onGameOver();
    });
  }

  // Simulate recording a roll (simplified from GameScene)
  recordRoll(pinsKnocked) {
    this._frameController.recordRoll(pinsKnocked);
    this._rollRecorded = true;
  }

  // Reset for next ball
  resetForNextBall() {
    this._rollRecorded = false;
  }

  _onFrameAdvance() {
    // Frame advance: reset pins and prepare for next ball
    this.resetForNextBall();
  }

  _onGameOver() {
    // Game over: set input state to prevent further input
    this._inputState = 'GAME_OVER';
  }

  // Public accessor for game-over state
  isGameOver() {
    return this._frameController.isGameOver();
  }
}

describe('Integration: FrameController + GameScene using isGameOver()', () => {
  let gameScene;

  beforeEach(() => {
    gameScene = new GameSceneStub();
  });

  it('isGameOver() returns false at game start', () => {
    assert.equal(gameScene.isGameOver(), false);
  });

  it('isGameOver() returns false during normal play', () => {
    gameScene.recordRoll(7);
    gameScene.resetForNextBall();
    gameScene.recordRoll(2);
    assert.equal(gameScene.isGameOver(), false);
  });

  it('isGameOver() returns true after frame 10 completes (no bonus)', () => {
    // Play frames 1-9 (2 balls each, no strikes/spares)
    for (let f = 0; f < 9; f++) {
      gameScene.recordRoll(4);
      gameScene.resetForNextBall();
      gameScene.recordRoll(5);
      gameScene.resetForNextBall();
    }

    // Frame 10: no strike/spare
    gameScene.recordRoll(4);
    gameScene.resetForNextBall();
    gameScene.recordRoll(5);

    assert.equal(gameScene.isGameOver(), true);
  });

  it('isGameOver() returns false after frame 10 strike (bonus balls pending)', () => {
    // Play frames 1-9
    for (let f = 0; f < 9; f++) {
      gameScene.recordRoll(4);
      gameScene.resetForNextBall();
      gameScene.recordRoll(5);
      gameScene.resetForNextBall();
    }

    // Frame 10 ball 1: strike
    gameScene.recordRoll(10);
    assert.equal(gameScene.isGameOver(), false, 'Game should not be over after frame 10 strike');
  });

  it('isGameOver() returns true after frame 10 with 3 balls (strike bonus)', () => {
    // Play frames 1-9
    for (let f = 0; f < 9; f++) {
      gameScene.recordRoll(4);
      gameScene.resetForNextBall();
      gameScene.recordRoll(5);
      gameScene.resetForNextBall();
    }

    // Frame 10: strike + 2 bonus balls
    gameScene.recordRoll(10); // ball 1
    gameScene.resetForNextBall();
    gameScene.recordRoll(5);  // ball 2
    gameScene.resetForNextBall();
    gameScene.recordRoll(3);  // ball 3

    assert.equal(gameScene.isGameOver(), true);
  });

  it('input state changes to GAME_OVER when game ends', () => {
    // Play frames 1-9
    for (let f = 0; f < 9; f++) {
      gameScene.recordRoll(4);
      gameScene.resetForNextBall();
      gameScene.recordRoll(5);
      gameScene.resetForNextBall();
    }

    // Frame 10: no bonus
    gameScene.recordRoll(4);
    gameScene.resetForNextBall();
    gameScene.recordRoll(5);

    assert.equal(gameScene._inputState, 'GAME_OVER');
  });
});
