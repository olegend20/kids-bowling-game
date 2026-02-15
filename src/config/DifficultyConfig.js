// DifficultyConfig — age-based difficulty tier mapping and physics parameters.
//
// Pure logic (testable in Node):
//   DifficultyConfig.getTier(age) → 'easy' | 'medium' | 'hard'
//   DifficultyConfig.getConfig(tier) → { pinDensity, ballSpeedMultiplier, ... }
//   DifficultyConfig.getConfigForAge(age) → config object (convenience)

'use strict';

const DifficultyConfig = {
  // Maps age to difficulty tier
  getTier(age) {
    if (typeof age !== 'number' || isNaN(age)) {
      throw new Error('age must be a number');
    }
    if (age < 0) {
      throw new Error('age must be non-negative');
    }

    if (age < 6) return 'easy';
    if (age <= 12) return 'medium';
    return 'hard';
  },

  // Returns physics configuration for a given tier
  getConfig(tier) {
    if (typeof tier !== 'string') {
      throw new Error('tier must be a string');
    }

    const configs = {
      easy: {
        pinDensity: 0.0008,
        ballSpeedMultiplier: 0.9,
        powerMeterCycle: 2500,
        powerOptimalRange: [0.3, 1.0],
        gutterWidth: 25
      },
      medium: {
        pinDensity: 0.0015,
        ballSpeedMultiplier: 1.0,
        powerMeterCycle: 1500,
        powerOptimalRange: [0.5, 0.85],
        gutterWidth: 30
      },
      hard: {
        pinDensity: 0.002,
        ballSpeedMultiplier: 1.1,
        powerMeterCycle: 1000,
        powerOptimalRange: [0.6, 0.75],
        gutterWidth: 35
      }
    };

    const config = configs[tier];
    if (!config) {
      throw new Error(`invalid tier: ${tier}`);
    }

    return config;
  },

  // Convenience function: combines getTier and getConfig
  getConfigForAge(age) {
    const tier = this.getTier(age);
    return this.getConfig(tier);
  }
};

// CJS export for Node.js test runner; browser loads this as a classic global script.
if (typeof module !== 'undefined') module.exports = { DifficultyConfig };
