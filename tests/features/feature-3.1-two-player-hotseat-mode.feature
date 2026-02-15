Feature: 2-Player hotseat mode
  As two kids playing together
  We want to take turns bowling on the same computer
  So that we can compete against each other

  Background:
    Given the start screen is displayed

  Scenario: Start screen offers 1-player and 2-player options
    When the start screen loads
    Then a "1 Player" button should be visible
    And a "2 Players" button should be visible

  Scenario: Selecting 2-player starts a 2-player game
    When the player clicks "2 Players"
    Then the game should start in 2-player mode
    And Player 1's name or label should be shown
    And Player 1 should go first

  Scenario: Player 1 completes their turn before Player 2
    Given a 2-player game is in progress
    And it is Player 1's turn
    When Player 1 completes frame 1
    Then a "Player 2's turn" prompt should appear
    And Player 2's input should be enabled

  Scenario: Each player has an independent scoreboard
    Given a 2-player game is in progress
    When Player 1 bowls a strike in frame 1
    Then Player 1's scoreboard should show the strike
    And Player 2's scoreboard should be unchanged

  Scenario: Winner is announced at game end
    Given both players have completed all 10 frames
    When the game ends
    Then the player with the higher score should be announced as winner
    And both final scores should be displayed
