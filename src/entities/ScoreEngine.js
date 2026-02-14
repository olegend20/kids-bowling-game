// ScoreEngine — pure JS bowling score calculator.
//
// Calculates bowling scores from a rolls array following standard 10-pin rules:
// - Strike: 10 + next 2 rolls
// - Spare: 10 + next 1 roll
// - Frame 10: bonus balls if strike/spare
//
// Usage:
//   const score = ScoreEngine.calculateScore(rolls);
//   const frames = ScoreEngine.getFrameScores(rolls);

'use strict';

class ScoreEngine {
  // Calculate total score from rolls array.
  // Returns total score (0-300).
  static calculateScore(rolls) {
    if (!rolls || rolls.length === 0) return 0;
    
    let score = 0;
    let rollIndex = 0;
    
    for (let frame = 0; frame < 10; frame++) {
      if (rollIndex >= rolls.length) break;
      
      if (this._isStrike(rolls, rollIndex)) {
        score += 10 + this._strikeBonus(rolls, rollIndex);
        rollIndex += 1;
      } else if (this._isSpare(rolls, rollIndex)) {
        score += 10 + this._spareBonus(rolls, rollIndex);
        rollIndex += 2;
      } else {
        score += this._frameSum(rolls, rollIndex);
        rollIndex += 2;
      }
    }
    
    return score;
  }
  
  // Get frame-by-frame scores.
  // Returns array of 10 frame scores (null if frame incomplete/can't be scored yet).
  static getFrameScores(rolls) {
    const frames = Array(10).fill(null);
    let rollIndex = 0;
    
    for (let frame = 0; frame < 10; frame++) {
      if (rollIndex >= rolls.length) break;
      
      if (this._isStrike(rolls, rollIndex)) {
        const bonus = this._strikeBonus(rolls, rollIndex);
        if (bonus !== null) {
          frames[frame] = 10 + bonus;
        }
        rollIndex += 1;
      } else if (rollIndex + 1 < rolls.length) {
        if (this._isSpare(rolls, rollIndex)) {
          const bonus = this._spareBonus(rolls, rollIndex);
          if (bonus !== null) {
            frames[frame] = 10 + bonus;
          }
        } else {
          frames[frame] = this._frameSum(rolls, rollIndex);
        }
        rollIndex += 2;
      } else {
        // Incomplete frame (only ball 1)
        break;
      }
    }
    
    return frames;
  }
  
  // Check if roll is a strike.
  static _isStrike(rolls, rollIndex) {
    return rolls[rollIndex] === 10;
  }
  
  // Check if frame is a spare.
  static _isSpare(rolls, rollIndex) {
    return rolls[rollIndex] + (rolls[rollIndex + 1] || 0) === 10;
  }
  
  // Get strike bonus (next 2 rolls).
  static _strikeBonus(rolls, rollIndex) {
    const next1 = rolls[rollIndex + 1];
    const next2 = rolls[rollIndex + 2];
    if (next1 === undefined || next2 === undefined) return null;
    return next1 + next2;
  }
  
  // Get spare bonus (next 1 roll).
  static _spareBonus(rolls, rollIndex) {
    const next = rolls[rollIndex + 2];
    if (next === undefined) return null;
    return next;
  }
  
  // Get frame sum (ball 1 + ball 2).
  static _frameSum(rolls, rollIndex) {
    return rolls[rollIndex] + (rolls[rollIndex + 1] || 0);
  }
}

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { ScoreEngine };
