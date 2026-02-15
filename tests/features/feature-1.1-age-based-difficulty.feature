Feature: Age-based difficulty selection
  As a player
  I want the game difficulty to match my age and skill level
  So that the game is appropriately challenging and fun

  Scenario: Age input field appears on name entry screen
    Given I am on the name entry screen
    Then I should see an age input field
    And the age input field should accept numeric input

  Scenario: Age maps to Easy difficulty for young children
    Given I am on the name entry screen
    When I enter age "5"
    And I start the game
    Then the difficulty should be set to "Easy"
    And pins should be lighter (density 0.0008)
    And power meter cycle should be slower (2500ms)

  Scenario: Age maps to Medium difficulty for kids
    Given I am on the name entry screen
    When I enter age "10"
    And I start the game
    Then the difficulty should be set to "Medium"
    And pins should have standard weight (density 0.0015)
    And power meter cycle should be moderate (1500ms)

  Scenario: Age maps to Hard difficulty for teens
    Given I am on the name entry screen
    When I enter age "15"
    And I start the game
    Then the difficulty should be set to "Hard"
    And pins should be heavier (density 0.002)
    And power meter cycle should be fast (1000ms)

  Scenario: Invalid age input defaults to Medium with warning
    Given I am on the name entry screen
    When I enter age "abc"
    And I start the game
    Then the difficulty should default to "Medium"
    And I should see a validation warning
    And the age should be set to 10

  Scenario: Negative age defaults to Medium
    Given I am on the name entry screen
    When I enter age "-5"
    And I start the game
    Then the difficulty should default to "Medium"
    And the age should be set to 10

  Scenario: Extreme age defaults to Medium
    Given I am on the name entry screen
    When I enter age "999"
    And I start the game
    Then the difficulty should default to "Medium"
    And the age should be set to 10

  Scenario: Difficulty tier is passed to game scene
    Given I have entered age "8"
    When I start the game
    Then the GameScene should receive the difficulty config
    And the config should include pinDensity
    And the config should include ballSpeedMultiplier
    And the config should include powerMeterCycle

  Scenario: Difficulty indicator shows on scoreboard during gameplay
    Given I am playing the game with age "10"
    Then I should see a difficulty indicator on the scoreboard
    And the indicator should show "Medium"

  Scenario: Easy mode has forgiving physics
    Given I am playing with Easy difficulty
    Then pins should be lighter than Medium mode
    And power meter should cycle slower than Medium mode
    And play area should be wider than Medium mode

  Scenario: Medium mode has balanced physics
    Given I am playing with Medium difficulty
    Then pins should have balanced weight
    And power meter should have moderate timing
    And play area should have standard width

  Scenario: Hard mode requires precision
    Given I am playing with Hard difficulty
    Then pins should be heavier than Medium mode
    And power meter should cycle faster than Medium mode
    And optimal power range should be narrower (0.6-0.75)
