Feature: Cloud-ready data architecture
  As a developer
  I want a cloud-ready data layer
  So that I can easily migrate from localStorage to API without changing game logic

  Scenario: Save and load player data with LocalStorageAdapter
    Given I have a LocalStorageAdapter instance
    When I save player data with XP 500 and level 5
    And I load player data for the same player
    Then the loaded data should have XP 500 and level 5

  Scenario: Switch between localStorage and API adapters via config
    Given the environment config is set to development
    When I initialize the storage system
    Then the LocalStorageAdapter should be used
    
    Given the environment config is set to production
    When I initialize the storage system
    Then the APIStorageAdapter should be used

  Scenario: Save data schema includes all required fields
    Given I have a new player save data
    Then it should include progression data (XP, level)
    And it should include unlocks data (balls, themes)
    And it should include achievements data
    And it should include stats data (strikes, spares, games played)
    And it should include rewards data (login streak)
    And it should include settings data (sound, music volume)
    And it should include a version field for migrations

  Scenario: Schema validation detects invalid data
    Given I have save data with missing required fields
    When I validate the schema
    Then validation should fail with specific error messages

  Scenario: Data migrations support version upgrades
    Given I have save data with version 1.0.0
    When I load it with version 1.1.0 schema
    Then the data should be migrated automatically
    And the version field should be updated to 1.1.0
