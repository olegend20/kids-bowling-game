const LocalStorageAdapter = require('../storage/LocalStorageAdapter');

/**
 * Environment configuration
 * Selects storage adapter and API settings based on NODE_ENV
 */

const configs = {
  development: {
    USE_API: false,
    API_URL: '',
    STORAGE_ADAPTER: new LocalStorageAdapter()
  },
  production: {
    USE_API: true,
    API_URL: 'https://api.example.com',
    STORAGE_ADAPTER: new LocalStorageAdapter() // TODO: Replace with API adapter when implemented
  }
};

function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
}

if (typeof module !== 'undefined') module.exports = { getConfig };
