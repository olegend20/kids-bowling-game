Feature: Frame loop and pin reset
  As a player
  I want the game to track my frames and reset the pins correctly between shots
  So that I can play a full 10-frame game

  Background:
    Given a new game has started
    And frame 1 ball 1 is ready

  Scenario: First ball of frame starts with all 10 pins standing
    When frame 1 begins
    Then all 10 pins should be standing
    And it should be ball 1 of frame 1

  Scenario: Strike clears all pins and advances to next frame
    Given all 10 pins are knocked down on ball 1
    When the ball-settled event fires
    Then the frame should be recorded as a strike
    And all 10 pins should reset
    And the game should advance to frame 2 ball 1

  Scenario: Non-strike allows second ball with remaining pins
    Given 7 pins are knocked down on ball 1
    When the ball-settled event fires
    Then 3 pins should remain standing
    And it should now be ball 2 of frame 1

  Scenario: Spare after second ball advances to next frame with full reset
    Given 7 pins were knocked on ball 1
    And the remaining 3 pins are knocked on ball 2
    When the ball-settled event fires
    Then the frame should be recorded as a spare
    And all 10 pins should reset
    And the game should advance to frame 2 ball 1

  Scenario: Second ball that doesn't spare advances to next frame
    Given 7 pins were knocked on ball 1
    And 1 more pin is knocked on ball 2
    When the ball-settled event fires
    Then the frame total is 8 pins knocked
    And the game should advance to frame 2 ball 1 with full pin reset

  Scenario: Game tracks through 10 frames
    Given 10 frames have been played
    When the last ball settles in frame 10
    Then a game-over event should be emitted
