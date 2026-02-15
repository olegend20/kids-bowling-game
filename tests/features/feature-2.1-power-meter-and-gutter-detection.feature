Feature: Power meter and gutter detection
  As a player
  I want to control how hard I throw the ball
  So that skill matters and each shot feels different

  Background:
    Given the game is in AIMING state
    And the ball is at the bottom of the lane

  Scenario: Power meter fills while spacebar is held
    When the player holds the spacebar
    Then the power meter should start filling from 0%
    And the power meter should reach 100% after approximately 2 seconds
    And the power meter bar should be visible above the ball

  Scenario: Ball fires on spacebar release with proportional speed
    Given the power meter is charged to 50%
    When the player releases the spacebar
    Then the ball should fire at half the maximum speed
    And the input state should transition to FIRED

  Scenario: Full charge fires at maximum speed
    Given the power meter is charged to 100%
    When the player releases the spacebar
    Then the ball should fire at maximum speed

  Scenario: Aim indicator is visible before firing
    Given the input is in AIMING state
    Then an aim direction indicator should be visible
    And it should point in the current aim direction

  Scenario: Ball in gutter cannot knock pins
    Given the ball is fired into the gutter
    When the ball enters the gutter zone
    Then the ball should be marked as a gutter ball
    And the ball should not collide with any pins
    And the ball should roll to the back wall

  Scenario: Ball-settled event fires when ball stops
    Given the ball has been fired
    When the ball velocity drops near zero
    Then a ball-settled event should be emitted
    And the game should transition to the next state
