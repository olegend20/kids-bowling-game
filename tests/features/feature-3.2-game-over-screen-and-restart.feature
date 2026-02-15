Feature: Game over screen and restart
  As a player
  I want to see my final score and be able to play again
  So that the game loop feels complete and replayable

  Background:
    Given all frames have been completed

  Scenario: Game over screen appears after frame 10
    When the last ball of frame 10 settles
    Then the game over screen should be displayed
    And the final score(s) should be shown

  Scenario: Winner highlighted in 2-player mode
    Given a 2-player game just ended
    And Player 1 scored 150 and Player 2 scored 130
    When the game over screen appears
    Then Player 1 should be highlighted as the winner

  Scenario: Play Again restarts cleanly
    Given the game over screen is displayed
    When the player clicks "Play Again"
    Then the game should return to the start screen
    And all scores should be reset to zero
    And all pins should be in starting positions

  Scenario: No state leaks between games
    Given the player plays and completes a full game
    When they start a new game via Play Again
    Then frame counter should be at 1
    And roll history should be empty
    And all physics bodies should be fresh
