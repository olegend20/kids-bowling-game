// Feature: Age-based difficulty selection
// BDD integration tests validating acceptance criteria

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { DifficultyConfig } = require('../../src/config/DifficultyConfig');

describe('Feature: Age-based difficulty selection', () => {
  describe('Acceptance_Criterion_1_Age_maps_to_correct_difficulty_tier', () => {
    it('Given age < 6, When getting tier, Then returns easy', () => {
      // Given: Player age is 5
      const age = 5;
      
      // When: Getting difficulty tier
      const tier = DifficultyConfig.getTier(age);
      
      // Then: Tier should be easy
      assert.strictEqual(tier, 'easy');
    });

    it('Given age 6-12, When getting tier, Then returns medium', () => {
      // Given: Player age is 10
      const age = 10;
      
      // When: Getting difficulty tier
      const tier = DifficultyConfig.getTier(age);
      
      // Then: Tier should be medium
      assert.strictEqual(tier, 'medium');
    });

    it('Given age 13+, When getting tier, Then returns hard', () => {
      // Given: Player age is 15
      const age = 15;
      
      // When: Getting difficulty tier
      const tier = DifficultyConfig.getTier(age);
      
      // Then: Tier should be hard
      assert.strictEqual(tier, 'hard');
    });
  });

  describe('Acceptance_Criterion_2_Invalid_age_validation', () => {
    it('Given negative age, When getting tier, Then throws error', () => {
      // Given: Invalid negative age
      const age = -5;
      
      // When/Then: Getting tier should throw
      assert.throws(() => {
        DifficultyConfig.getTier(age);
      }, /age must be non-negative/);
    });

    it('Given null age, When getting tier, Then throws error', () => {
      // Given: Null age
      const age = null;
      
      // When/Then: Getting tier should throw
      assert.throws(() => {
        DifficultyConfig.getTier(age);
      }, /age must be a number/);
    });

    it('Given undefined age, When getting tier, Then throws error', () => {
      // Given: Undefined age
      const age = undefined;
      
      // When/Then: Getting tier should throw
      assert.throws(() => {
        DifficultyConfig.getTier(age);
      }, /age must be a number/);
    });

    it('Given extreme age 999, When getting tier, Then returns hard', () => {
      // Given: Extreme age
      const age = 999;
      
      // When: Getting difficulty tier
      const tier = DifficultyConfig.getTier(age);
      
      // Then: Tier should be hard (13+)
      assert.strictEqual(tier, 'hard');
    });
  });

  describe('Acceptance_Criterion_3_Difficulty_tier_applied_to_physics', () => {
    it('Given easy tier, When getting config, Then pins lighter and power meter slower', () => {
      // Given: Easy difficulty tier
      const tier = 'easy';
      
      // When: Getting difficulty config
      const config = DifficultyConfig.getConfig(tier);
      
      // Then: Physics parameters match easy mode
      assert.strictEqual(config.pinDensity, 0.0008, 'Pins should be lighter (lower density)');
      assert.strictEqual(config.powerMeterCycle, 2500, 'Power meter should be slower (longer cycle)');
      assert.ok(config.gutterWidth < 30, 'Play area should be wider (narrower gutters)');
    });

    it('Given medium tier, When getting config, Then balanced physics', () => {
      // Given: Medium difficulty tier
      const tier = 'medium';
      
      // When: Getting difficulty config
      const config = DifficultyConfig.getConfig(tier);
      
      // Then: Physics parameters match medium mode
      assert.strictEqual(config.pinDensity, 0.0015, 'Pins should have balanced density');
      assert.strictEqual(config.powerMeterCycle, 1500, 'Power meter should have moderate timing');
      assert.strictEqual(config.gutterWidth, 30, 'Play area should be balanced');
    });

    it('Given hard tier, When getting config, Then pins heavier and power meter faster', () => {
      // Given: Hard difficulty tier
      const tier = 'hard';
      
      // When: Getting difficulty config
      const config = DifficultyConfig.getConfig(tier);
      
      // Then: Physics parameters match hard mode
      assert.strictEqual(config.pinDensity, 0.002, 'Pins should be heavier (higher density)');
      assert.strictEqual(config.powerMeterCycle, 1000, 'Power meter should be faster (shorter cycle)');
      assert.ok(config.gutterWidth > 30, 'Play area should be narrower (wider gutters)');
    });
  });

  describe('Acceptance_Criterion_4_Easy_mode_wider_play_area', () => {
    it('Given easy config, When checking gutter width, Then play area is wider', () => {
      // Given: Easy difficulty config
      const easyConfig = DifficultyConfig.getConfig('easy');
      const mediumConfig = DifficultyConfig.getConfig('medium');
      
      // When: Comparing gutter widths
      const easyGutter = easyConfig.gutterWidth;
      const mediumGutter = mediumConfig.gutterWidth;
      
      // Then: Easy mode has narrower gutters (wider play area)
      assert.ok(easyGutter < mediumGutter, 'Easy mode should have wider play area');
    });
  });

  describe('Acceptance_Criterion_5_Hard_mode_narrower_optimal_range', () => {
    it('Given hard config, When checking optimal range, Then range is narrower', () => {
      // Given: Hard difficulty config
      const hardConfig = DifficultyConfig.getConfig('hard');
      const mediumConfig = DifficultyConfig.getConfig('medium');
      
      // When: Comparing optimal ranges
      const hardRange = hardConfig.powerOptimalRange[1] - hardConfig.powerOptimalRange[0];
      const mediumRange = mediumConfig.powerOptimalRange[1] - mediumConfig.powerOptimalRange[0];
      
      // Then: Hard mode has narrower optimal range
      assert.ok(hardRange < mediumRange, 'Hard mode should have narrower optimal range');
    });
  });

  describe('Error_Scenario_Invalid_tier_name', () => {
    it('Given invalid tier name, When getting config, Then throws error', () => {
      // Given: Invalid tier name
      const tier = 'impossible';
      
      // When/Then: Getting config should throw
      assert.throws(() => {
        DifficultyConfig.getConfig(tier);
      }, /invalid tier/);
    });
  });

  describe('Smoke_Test_Complete_age_to_config_workflow', () => {
    it('Given player age, When getting config for age, Then returns valid config', () => {
      // Given: Player ages for each tier
      const ages = [5, 10, 15];
      
      ages.forEach(age => {
        // When: Getting config for age
        const config = DifficultyConfig.getConfigForAge(age);
        
        // Then: Config should have all required properties
        assert.ok(config.pinDensity, 'Config should have pinDensity');
        assert.ok(config.ballSpeedMultiplier, 'Config should have ballSpeedMultiplier');
        assert.ok(config.powerMeterCycle, 'Config should have powerMeterCycle');
        assert.ok(config.powerOptimalRange, 'Config should have powerOptimalRange');
        assert.ok(typeof config.gutterWidth === 'number', 'Config should have gutterWidth');
      });
    });
  });
});

// Note: UI acceptance criteria (age input field, difficulty indicator) are validated by E2E tests
// See tests/e2e/difficulty.spec.js for browser-based UI validation
