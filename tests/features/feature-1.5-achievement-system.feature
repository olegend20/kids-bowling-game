Feature: Achievement system
  As a player
  I want to earn achievements
  So that I have goals and feel accomplished

  Scenario: Unlock "First Strike" achievement
    Given I have never bowled a strike
    When I bowl my first strike
    Then the "First Strike" achievement should unlock
    And I should see an achievement notification popup
    And I should earn 50 bonus XP

  Scenario: Track progress toward "Strike Master" achievement
    Given the "Strike Master" achievement requires 10 strikes in one game
    And I have bowled 7 strikes in the current game
    When I bowl 2 more strikes
    Then the achievement progress should show 9/10
    And the achievement should not unlock yet

  Scenario: Unlock "Perfect Game" achievement
    Given I am playing a game
    When I bowl a perfect game (score 300)
    Then the "Perfect Game" achievement should unlock
    And I should see a special celebration animation
    And I should earn 500 bonus XP

  Scenario: View locked and unlocked achievements
    Given I have unlocked 5 achievements
    And there are 20 total achievements
    When I open the Achievement screen
    Then I should see 5 unlocked achievements with unlock dates
    And I should see 15 locked achievements with progress bars
    And locked achievements should show how to unlock them

  Scenario: Achievement notification during gameplay
    Given I am playing a game
    When I unlock the "Gutter Avoider" achievement
    Then a notification popup should appear at the top of the screen
    And it should show the achievement icon and name
    And it should auto-dismiss after 3 seconds
    And the achievement sound effect should play

  Scenario: Multiple achievements unlock in one game
    Given I am playing a game
    When I bowl 10 strikes and reach level 10
    Then the "Strike Master" achievement should unlock
    And the "Level 10 Reached" achievement should unlock
    And I should see both notifications sequentially
