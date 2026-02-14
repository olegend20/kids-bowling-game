import { test, expect } from '@playwright/test';

test.describe('Bowling Game - Smoke Tests', () => {
  test('game loads and displays canvas', async ({ page }) => {
    // Given: User navigates to the game
    await page.goto('/');

    // When: Page loads
    await page.waitForLoadState('networkidle');

    // Then: Phaser canvas should be present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('game initializes Phaser', async ({ page }) => {
    // Given: User navigates to the game
    await page.goto('/');

    // When: Page loads
    await page.waitForLoadState('networkidle');

    // Then: Phaser global should exist
    const phaserExists = await page.evaluate(() => typeof window.Phaser !== 'undefined');
    expect(phaserExists).toBe(true);
  });
});
