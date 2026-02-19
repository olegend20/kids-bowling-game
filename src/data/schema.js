/**
 * Save Data Schema - Defines player data structure and validation
 * 
 * Schema structure:
 * {
 *   version: number,           // Schema version for migrations
 *   progression: {
 *     level: number,           // Current player level (1-30)
 *     totalXP: number          // Total XP earned
 *   },
 *   unlocks: {
 *     balls: string[]          // Unlocked ball IDs
 *   },
 *   achievements: string[],    // Earned achievement IDs
 *   stats: {
 *     gamesPlayed: number,     // Total games played
 *     totalScore: number,      // Cumulative score
 *     highScore: number,       // Best single game score
 *     strikes: number,         // Total strikes
 *     spares: number           // Total spares
 *   },
 *   rewards: {
 *     coins: number            // Virtual currency balance
 *   },
 *   settings: {
 *     soundEnabled: boolean,   // Sound on/off
 *     musicEnabled: boolean    // Music on/off
 *   }
 * }
 */

const SCHEMA_VERSION = 1;

/**
 * Create default save data structure
 * @returns {Object} Default save data
 */
function createDefaultSaveData() {
  return {
    version: SCHEMA_VERSION,
    progression: {
      level: 1,
      totalXP: 0
    },
    unlocks: {
      balls: ['default']
    },
    achievements: [],
    stats: {
      gamesPlayed: 0,
      totalScore: 0,
      highScore: 0,
      strikes: 0,
      spares: 0
    },
    rewards: {
      coins: 0
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true
    }
  };
}

/**
 * Validate save data structure
 * @param {Object} data - Save data to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateSaveData(data) {
  const errors = [];

  // Check version
  if (typeof data.version !== 'number') {
    errors.push('Missing or invalid version field');
  }

  // Check progression
  if (!data.progression || typeof data.progression !== 'object') {
    errors.push('Missing or invalid progression object');
  } else {
    if (typeof data.progression.level !== 'number' || data.progression.level < 1) {
      errors.push('Invalid progression.level (must be number >= 1)');
    }
    if (typeof data.progression.totalXP !== 'number' || data.progression.totalXP < 0) {
      errors.push('Invalid progression.totalXP (must be number >= 0)');
    }
  }

  // Check unlocks
  if (!data.unlocks || typeof data.unlocks !== 'object') {
    errors.push('Missing or invalid unlocks object');
  } else {
    if (!Array.isArray(data.unlocks.balls)) {
      errors.push('Invalid unlocks.balls (must be array)');
    }
  }

  // Check achievements
  if (!Array.isArray(data.achievements)) {
    errors.push('Invalid achievements (must be array)');
  }

  // Check stats
  if (!data.stats || typeof data.stats !== 'object') {
    errors.push('Missing or invalid stats object');
  } else {
    if (typeof data.stats.gamesPlayed !== 'number' || data.stats.gamesPlayed < 0) {
      errors.push('Invalid stats.gamesPlayed (must be number >= 0)');
    }
  }

  // Check rewards
  if (!data.rewards || typeof data.rewards !== 'object') {
    errors.push('Missing or invalid rewards object');
  } else {
    if (typeof data.rewards.coins !== 'number' || data.rewards.coins < 0) {
      errors.push('Invalid rewards.coins (must be number >= 0)');
    }
  }

  // Check settings
  if (!data.settings || typeof data.settings !== 'object') {
    errors.push('Missing or invalid settings object');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

if (typeof module !== 'undefined') module.exports = {
  SCHEMA_VERSION,
  createDefaultSaveData,
  validateSaveData
};
