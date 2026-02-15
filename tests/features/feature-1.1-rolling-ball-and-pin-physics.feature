Feature: Rolling ball and pin physics
  As a player
  I want to launch a bowling ball down the lane and watch it knock over pins
  So that the game feels satisfying and real

  Background:
    Given the game is loaded in a browser
    And the GameScene is active

  Scenario: Lane renders with correct layout
    When the lane is displayed
    Then the lane should be visible top-down
    And gutters should be visible on both sides of the lane
    And 10 pin spot markers should be visible in a triangle formation

  Scenario: 10 pins arranged in standard triangle formation
    When the pins are spawned
    Then there should be exactly 10 pins
    And pin 1 should be at the front (row 1)
    And pins 2 and 3 should be in row 2
    And pins 4, 5, and 6 should be in row 3
    And pins 7, 8, 9, and 10 should be in row 4 (back)

  Scenario: Ball launches toward pins
    Given the ball is at the bottom of the lane
    When the player fires the ball
    Then the ball should travel from bottom toward the top of the lane
    And the ball should move in the aimed direction

  Scenario: Ball collides with pins using physics
    Given the ball is traveling toward the pins
    When the ball reaches the pin formation
    Then the ball should make contact with the nearest pin
    And the contacted pins should scatter based on collision angle and force

  Scenario: Pins scatter realistically on impact
    Given the ball strikes pin 1 (head pin)
    When the collision is resolved
    Then at least 2 pins should be knocked in different directions
    And pins should not pass through each other or the lane walls

  Scenario: Ball stays within lane boundaries
    Given the ball is fired with a slight angle toward the gutter
    When the ball reaches the gutter wall
    Then the ball should stop or deflect at the gutter boundary
    And the ball should not exit the lane area
