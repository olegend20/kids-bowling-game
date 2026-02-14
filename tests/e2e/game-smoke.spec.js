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

  test('complete game flow with game-over validation', async ({ page }) => {
    // Given: User starts a new game
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // When: User completes all 10 frames (20 rolls, no strikes/spares)
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => {
        const fc = window.gameScene?.frameController;
        if (fc && !fc.isGameOver()) {
          fc.recordRoll(4);
        }
      });
    }

    // Then: Game should be over
    const gameOver = await page.evaluate(() => {
      return window.gameScene?.frameController?.isGameOver();
    });
    expect(gameOver).toBe(true);
  });
});
