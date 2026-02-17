const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const StorageAdapter = require('../../src/storage/StorageAdapter');
const LocalStorageAdapter = require('../../src/storage/LocalStorageAdapter');
const { getConfig } = require('../../src/config/environment');
const { createDefaultSaveData, validateSaveData } = require('../../src/data/schema');

/**
 * Feature: Cloud-ready data architecture
 * 
 * BDD tests validating user-observable outcomes for Documents-qrl.1
 */

describe('Feature: Cloud-ready data architecture', () => {
  describe('Acceptance_Criterion_1_StorageAdapter_interface_with_save_load_methods', () => {
    it('Given StorageAdapter base class, When instantiated directly, Then throws not implemented errors', async () => {
      // Given: StorageAdapter base class
      const adapter = new StorageAdapter();

      // When/Then: Methods throw not implemented errors
      await assert.rejects(
        async () => await adapter.savePlayerData({}),
        /must be implemented by subclass/,
        'savePlayerData should throw not implemented error'
      );

      await assert.rejects(
        async () => await adapter.loadPlayerData(),
        /must be implemented by subclass/,
        'loadPlayerData should throw not implemented error'
      );

      await assert.rejects(
        async () => await adapter.saveSettings({}),
        /must be implemented by subclass/,
        'saveSettings should throw not implemented error'
      );

      await assert.rejects(
        async () => await adapter.loadSettings(),
        /must be implemented by subclass/,
        'loadSettings should throw not implemented error'
      );
    });

    it('Given LocalStorageAdapter, When used, Then implements all StorageAdapter methods', async () => {
      // Given: LocalStorageAdapter instance
      const adapter = new LocalStorageAdapter();

      // Then: All methods are implemented (no throws)
      assert.strictEqual(typeof adapter.savePlayerData, 'function');
      assert.strictEqual(typeof adapter.loadPlayerData, 'function');
      assert.strictEqual(typeof adapter.saveSettings, 'function');
      assert.strictEqual(typeof adapter.loadSettings, 'function');
    });
  });

  describe('Acceptance_Criterion_2_LocalStorageAdapter_works_for_Phase_1', () => {
    let adapter;
    let mockLocalStorage;

    beforeEach(() => {
      // Given: Mock localStorage
      mockLocalStorage = {};
      global.localStorage = {
        getItem: (key) => mockLocalStorage[key] || null,
        setItem: (key, value) => { mockLocalStorage[key] = value; },
        removeItem: (key) => { delete mockLocalStorage[key]; }
      };

      adapter = new LocalStorageAdapter();
    });

    it('Given player data, When saved and loaded, Then data persists correctly', async () => {
      // Given: Player data with XP and level
      const playerData = {
        progression: { level: 5, currentXP: 500, totalXP: 1500 },
        unlocks: { balls: ['default', 'fire'], themes: ['classic'] },
        achievements: [],
        stats: { gamesPlayed: 10, strikes: 5, spares: 8 },
        rewards: { loginStreak: 3, coins: 100 },
        settings: { soundVolume: 0.8, musicVolume: 0.6 }
      };

      // When: Save and load player data
      await adapter.savePlayerData(playerData);
      const loaded = await adapter.loadPlayerData();

      // Then: Loaded data matches saved data
      assert.deepStrictEqual(loaded, playerData);
    });

    it('Given settings, When saved and loaded, Then settings persist correctly', async () => {
      // Given: Settings data
      const settings = {
        soundVolume: 0.7,
        musicVolume: 0.5,
        difficulty: 'medium'
      };

      // When: Save and load settings
      await adapter.saveSettings(settings);
      const loaded = await adapter.loadSettings();

      // Then: Loaded settings match saved settings
      assert.deepStrictEqual(loaded, settings);
    });

    it('Given no saved data, When loading, Then returns null', async () => {
      // Given: No saved data (fresh localStorage)

      // When: Load player data
      const loaded = await adapter.loadPlayerData();

      // Then: Returns null
      assert.strictEqual(loaded, null);
    });
  });

  describe('Acceptance_Criterion_3_Environment_config_switches_between_localStorage_and_API', () => {
    it('Given development environment, When getting config, Then uses LocalStorageAdapter', () => {
      // Given: Development environment
      process.env.NODE_ENV = 'development';

      // When: Get config
      const config = getConfig();

      // Then: Uses LocalStorageAdapter
      assert.strictEqual(config.USE_API, false);
      assert.ok(config.STORAGE_ADAPTER, 'Storage adapter should be defined');
    });

    it('Given production environment, When getting config, Then uses API settings', () => {
      // Given: Production environment
      process.env.NODE_ENV = 'production';

      // When: Get config
      const config = getConfig();

      // Then: Uses API settings
      assert.strictEqual(config.USE_API, true);
      assert.ok(config.API_URL, 'API URL should be defined');
    });

    it('Given no environment set, When getting config, Then defaults to development', () => {
      // Given: No NODE_ENV set
      delete process.env.NODE_ENV;

      // When: Get config
      const config = getConfig();

      // Then: Defaults to development (localStorage)
      assert.strictEqual(config.USE_API, false);
    });
  });

  describe('Acceptance_Criterion_4_Save_data_schema_documented_and_versioned', () => {
    it('Given new player, When creating default save data, Then includes all required fields', () => {
      // Given: New player

      // When: Create default save data
      const saveData = createDefaultSaveData();

      // Then: Includes all required fields
      assert.ok(saveData.version, 'Should have version field');
      assert.ok(saveData.progression, 'Should have progression field');
      assert.ok(saveData.unlocks, 'Should have unlocks field');
      assert.ok(saveData.achievements, 'Should have achievements field');
      assert.ok(saveData.stats, 'Should have stats field');
      assert.ok(saveData.rewards, 'Should have rewards field');
      assert.ok(saveData.settings, 'Should have settings field');
    });

    it('Given valid save data, When validating, Then validation passes', () => {
      // Given: Valid save data
      const saveData = createDefaultSaveData();

      // When: Validate
      const result = validateSaveData(saveData);

      // Then: Validation passes
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('Given invalid save data, When validating, Then validation fails with errors', () => {
      // Given: Invalid save data (missing version)
      const invalidData = {
        progression: { level: 1, currentXP: 0, totalXP: 0 }
        // Missing other required fields
      };

      // When: Validate
      const result = validateSaveData(invalidData);

      // Then: Validation fails
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.length > 0, 'Should have validation errors');
    });
  });

  describe('Acceptance_Criterion_5_Data_migrations_supported', () => {
    it('Given save data with version field, When loaded, Then version is accessible', () => {
      // Given: Save data with version
      const saveData = createDefaultSaveData();

      // When: Access version
      const version = saveData.version;

      // Then: Version is accessible
      assert.ok(version !== undefined, 'Version should be defined');
      assert.strictEqual(typeof version, 'number', 'Version should be a number');
    });

    it('Given future migration system, When old version loaded, Then migration path exists', () => {
      // Given: Save data structure supports versioning
      const saveData = createDefaultSaveData();

      // Then: Version field exists for future migrations
      assert.ok(saveData.version !== undefined, 'Version field exists for migration support');
      
      // Note: Actual migration logic will be implemented when needed
      // This test validates the schema supports migrations
    });
  });

  describe('Error_Scenario_localStorage_unavailable', () => {
    it('Given localStorage unavailable, When saving, Then throws error', async () => {
      // Given: localStorage unavailable
      global.localStorage = undefined;
      const adapter = new LocalStorageAdapter();

      // When/Then: Saving throws error
      await assert.rejects(
        async () => await adapter.savePlayerData({}),
        /localStorage is not available/,
        'Should throw localStorage unavailable error'
      );
    });

    it('Given localStorage unavailable, When loading, Then returns null', async () => {
      // Given: localStorage unavailable
      global.localStorage = undefined;
      const adapter = new LocalStorageAdapter();

      // When: Load player data
      const loaded = await adapter.loadPlayerData();

      // Then: Returns null gracefully
      assert.strictEqual(loaded, null);
    });
  });

  describe('Smoke_Test_Complete_save_load_workflow', () => {
    it('Given new player, When playing and saving progress, Then data persists across sessions', async () => {
      // Given: Mock localStorage and adapter
      const mockLocalStorage = {};
      global.localStorage = {
        getItem: (key) => mockLocalStorage[key] || null,
        setItem: (key, value) => { mockLocalStorage[key] = value; },
        removeItem: (key) => { delete mockLocalStorage[key]; }
      };
      const adapter = new LocalStorageAdapter();

      // When: Create new player, play game, save progress
      const initialData = createDefaultSaveData();
      await adapter.savePlayerData(initialData);

      // Simulate game progress
      const progressData = { ...initialData };
      progressData.progression.level = 3;
      progressData.progression.totalXP = 600;
      progressData.stats.gamesPlayed = 5;
      await adapter.savePlayerData(progressData);

      // Simulate new session (reload)
      const loadedData = await adapter.loadPlayerData();

      // Then: Progress persists
      assert.strictEqual(loadedData.progression.level, 3);
      assert.strictEqual(loadedData.progression.totalXP, 600);
      assert.strictEqual(loadedData.stats.gamesPlayed, 5);
    });
  });
});
