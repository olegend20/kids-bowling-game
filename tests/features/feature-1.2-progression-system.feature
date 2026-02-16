Feature: Progression system (XP and levels)
  As a player
  I want to earn XP and level up
  So that I feel progress and unlock rewards

  Scenario: Earn XP from game score
    Given I am at level 1 with 0 XP
    When I complete a game with score 150
    Then I should earn 150 XP
    And my total XP should be 150

  Scenario: Level up when reaching XP threshold
    Given I am at level 1 with 90 XP
    When I earn 20 XP
    Then I should level up to level 2
    And my current level XP should be 10
    And I should see a level-up celebration

  Scenario: Exponential XP curve for levels
    Given I am at level 1
    Then the XP required for level 2 should be 200
    And the XP required for level 3 should be 300
    And the XP required for level 10 should be 1000

  Scenario: Earn bonus XP for strikes
    Given I am playing a game
    When I bowl a strike
    Then I should earn 50 bonus XP

  Scenario: Earn bonus XP for spares
    Given I am playing a game
    When I bowl a spare
    Then I should earn 25 bonus XP

  Scenario: Progress bar shows XP to next level
    Given I am at level 5 with 300 XP
    And level 6 requires 600 total XP
    Then the progress bar should show 50% filled
    And it should display "300 / 600 XP"

  Scenario: Level-up unlocks rewards
    Given I am at level 4 with 790 XP
    When I earn 10 XP and level up to level 5
    Then I should unlock the "space" theme
    And I should see a notification "New theme unlocked: Space!"
