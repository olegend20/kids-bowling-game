Feature: Bowling score display
  As a player
  I want to see my score updated in real time
  So that I know how well I'm doing and can celebrate strikes and spares

  Background:
    Given a game is in progress
    And the scoreboard is displayed

  Scenario: Scoreboard shows all 10 frames
    When the scoreboard is rendered
    Then 10 frame boxes should be visible
    And each frame should show two roll boxes and a running total box

  Scenario: Running total updates after each frame
    Given frame 1 results in 7 pins + 2 pins = 9
    When frame 1 is complete
    Then the scoreboard should show 9 in the running total for frame 1

  Scenario: Strike is displayed as X
    Given all 10 pins are knocked on ball 1 of a frame
    When the frame result is rendered
    Then the first roll box should display "X"
    And the second roll box should be empty

  Scenario: Spare is displayed as /
    Given 6 pins are knocked on ball 1 and 4 on ball 2
    When the frame result is rendered
    Then the first roll box should display "6"
    And the second roll box should display "/"

  Scenario: 10th frame handles 3-roll bonus
    Given the player is in frame 10
    And they bowl a strike on ball 1
    Then ball 2 and ball 3 should be allowed
    And all three rolls should be recorded and scored correctly

  Scenario: STRIKE feedback text appears
    Given the player bowls a strike
    When the frame result is processed
    Then "STRIKE!" text should appear on screen
    And the text should fade out after approximately 1.5 seconds

  Scenario: Final score shown at game end
    Given all 10 frames have been completed
    When the game-over event fires
    Then the final total score should be prominently displayed
