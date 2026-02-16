const { describe, it } = require('node:test');
const assert = require('node:assert');
const { getConfig } = require('../../src/config/environment');
const LocalStorageAdapter = require('../../src/storage/LocalStorageAdapter');

describe('Environment Configuration', () => {
  describe('getConfig', () => {
    it('should return dev config with LocalStorageAdapter when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getConfig();
      
      assert.strictEqual(config.USE_API, false);
      assert.strictEqual(config.API_URL, '');
      assert.ok(config.STORAGE_ADAPTER instanceof LocalStorageAdapter);
    });

    it('should return prod config with API settings when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      
      const config = getConfig();
      
      assert.strictEqual(config.USE_API, true);
      assert.strictEqual(config.API_URL, 'https://api.example.com');
      assert.ok(config.STORAGE_ADAPTER);
    });

    it('should default to dev config when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      
      const config = getConfig();
      
      assert.strictEqual(config.USE_API, false);
      assert.ok(config.STORAGE_ADAPTER instanceof LocalStorageAdapter);
    });
  });
});
