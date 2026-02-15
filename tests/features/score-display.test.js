// BDD tests for Feature 2.3: Bowling score display
// Tests validate user-observable outcomes from the user's perspective

'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ScoreEngine } = require('../../src/entities/ScoreEngine.js');
const { FrameController } = require('../../src/entities/FrameController.js');

test('Feature: Bowling score display', async (t) => {
  await t.test('Acceptance_Criterion_1_ScoreEngine_calculates_total_score_correctly', () => {
    // Given: A player has completed a game with known rolls
    const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]; // Perfect game
    
    // When: The score is calculated
    const totalScore = ScoreEngine.calculateScore(rolls);
    
    // Then: The total score should be 300
    assert.equal(totalScore, 300, 'Perfect game should score 300');
  });

  await t.test('Acceptance_Criterion_2_ScoreEngine_handles_strikes_correctly', () => {
    // Given: A player rolls a strike followed by two normal rolls
    const rolls = [10, 3, 4, ...Array(16).fill(0)];
    
    // When: The score is calculated
    const totalScore = ScoreEngine.calculateScore(rolls);
    
    // Then: The strike frame should include the next two rolls as bonus
    // Strike frame: 10+3+4=17, Frame 2: 3+4=7, Total: 24
    assert.equal(totalScore, 24, 'Strike should score 10 + next 2 rolls');
  });

  await t.test('Acceptance_Criterion_2_ScoreEngine_handles_spares_correctly', () => {
    // Given: A player rolls a spare followed by a normal roll
    const rolls = [5, 5, 3, 0, ...Array(16).fill(0)];
    
    // When: The score is calculated
    const totalScore = ScoreEngine.calculateScore(rolls);
    
    // Then: The spare frame should include the next roll as bonus
    assert.equal(totalScore, 16, 'Spare should score 10 + next roll (5+5+3=13, plus 3+0=3)');
  });

  await t.test('Acceptance_Criterion_3_ScoreEngine_handles_frame_10_bonus_balls_for_strike', () => {
    // Given: A player rolls a strike in frame 10
    const rolls = [...Array(18).fill(0), 10, 10, 10];
    
    // When: The score is calculated
    const totalScore = ScoreEngine.calculateScore(rolls);
    
    // Then: Frame 10 should allow 2 bonus balls after the strike
    assert.equal(totalScore, 30, 'Frame 10 strike should get 2 bonus balls (10+10+10=30)');
  });

  await t.test('Acceptance_Criterion_3_ScoreEngine_handles_frame_10_bonus_balls_for_spare', () => {
    // Given: A player rolls a spare in frame 10
    const rolls = [...Array(18).fill(0), 5, 5, 3];
    
    // When: The score is calculated
    const totalScore = ScoreEngine.calculateScore(rolls);
    
    // Then: Frame 10 should allow 1 bonus ball after the spare
    assert.equal(totalScore, 13, 'Frame 10 spare should get 1 bonus ball (5+5+3=13)');
  });

  await t.test('Acceptance_Criterion_4_Frame_by_frame_scores_are_available', () => {
    // Given: A player has rolled several frames
    const rolls = [10, 3, 4, 5, 5, 3, ...Array(13).fill(0)];
    
    // When: Frame-by-frame scores are requested
    const frameScores = ScoreEngine.getFrameScores(rolls);
    
    // Then: Each frame's score should be available (not cumulative)
    assert.equal(frameScores.length, 10, 'Should return 10 frame scores');
    assert.equal(frameScores[0], 17, 'Frame 1: strike + next 2 rolls (10+3+4)');
    assert.equal(frameScores[1], 7, 'Frame 2: 3+4');
    assert.equal(frameScores[2], 13, 'Frame 3: spare + next roll (5+5+3)');
  });

  await t.test('Error_Scenario_Invalid_roll_value_exceeds_10', () => {
    // Given: A player attempts to record an invalid roll > 10
    const frameController = new FrameController();
    
    // When: An invalid roll is recorded
    // Then: The system should throw an error
    assert.throws(
      () => frameController.recordRoll(11),
      /Invalid roll/,
      'Should reject roll values > 10'
    );
  });

  await t.test('Error_Scenario_Invalid_roll_value_negative', () => {
    // Given: A player attempts to record a negative roll
    const frameController = new FrameController();
    
    // When: A negative roll is recorded
    // Then: The system should throw an error
    assert.throws(
      () => frameController.recordRoll(-1),
      /Invalid roll/,
      'Should reject negative roll values'
    );
  });

  await t.test('Error_Scenario_Frame_total_exceeds_10_pins', () => {
    // Given: A player has knocked down 6 pins on the first ball
    const frameController = new FrameController();
    frameController.recordRoll(6);
    
    // When: The player attempts to knock down 9 pins on the second ball
    // Then: The system should throw an error
    assert.throws(
      () => frameController.recordRoll(9),
      /exceeds 10/,
      'Should reject when frame total exceeds 10 pins'
    );
  });

  await t.test('Error_Scenario_Recording_roll_after_game_over', () => {
    // Given: A game has ended (10 frames completed, no bonus)
    const frameController = new FrameController();
    const rolls = Array(20).fill(0);
    rolls.forEach(pins => frameController.recordRoll(pins));
    
    // When: The player attempts to record another roll
    // Then: The system should throw an error
    assert.throws(
      () => frameController.recordRoll(5),
      /Game over/,
      'Should reject rolls after game is over'
    );
  });

  await t.test('Edge_Case_Incomplete_game_returns_partial_scores', () => {
    // Given: A player has only completed 3 frames
    const rolls = [10, 3, 4, 5, 5];
    
    // When: Frame scores are requested
    const frameScores = ScoreEngine.getFrameScores(rolls);
    
    // Then: Completed frames should have scores, incomplete frames should be null
    assert.equal(frameScores[0], 17, 'Frame 1 complete: 10+3+4');
    assert.equal(frameScores[1], 7, 'Frame 2 complete: 3+4');
    assert.equal(frameScores[2], null, 'Frame 3 incomplete (spare needs bonus)');
  });
});
