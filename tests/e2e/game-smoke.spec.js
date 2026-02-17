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

  test('progression system: XP earned from complete game', async ({ page }) => {
    // Given: User starts a new game with progression system
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Initialize progression system in game context
    await page.evaluate(() => {
      const ProgressionSystem = window.ProgressionSystem;
      if (ProgressionSystem) {
        window.testProgression = new ProgressionSystem();
      }
    });

    // When: User completes a game with 3 strikes, 5 spares, score 150
    const gameStats = await page.evaluate(() => {
      const progression = window.testProgression;
      if (!progression) return null;

      const initialLevel = progression.getCurrentLevel();
      const initialXP = progression.getTotalXP();

      // Simulate game completion: score 150, 3 strikes, 5 spares
      const earnedXP = Math.floor(150 / 10) + (3 * 10) + (5 * 5);
      progression.addXP(earnedXP); // 15 + 30 + 25 = 70 XP

      return {
        initialLevel,
        initialXP,
        earnedXP,
        finalLevel: progression.getCurrentLevel(),
        finalXP: progression.getTotalXP()
      };
    });

    // Then: XP is earned and tracked
    expect(gameStats).not.toBeNull();
    expect(gameStats.earnedXP).toBe(70);
    expect(gameStats.finalXP).toBe(70);
    expect(gameStats.finalLevel).toBe(1); // Not enough XP to level up yet
  });

  test('progression system: level-up after multiple games', async ({ page }) => {
    // Given: User starts with progression system
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const ProgressionSystem = window.ProgressionSystem;
      if (ProgressionSystem) {
        window.testProgression = new ProgressionSystem();
      }
    });

    // When: User completes 3 games earning enough XP to level up
    const progressionData = await page.evaluate(() => {
      const progression = window.testProgression;
      if (!progression) return null;

      const games = [
        { score: 150, strikes: 3, spares: 5 }, // 70 XP
        { score: 180, strikes: 5, spares: 3 }, // 83 XP
        { score: 200, strikes: 6, spares: 2 }  // 90 XP
      ];

      const results = [];
      games.forEach((game, index) => {
        const earnedXP = Math.floor(game.score / 10) + 
                         (game.strikes * 10) + 
                         (game.spares * 5);
        
        const levelBefore = progression.getCurrentLevel();
        progression.addXP(earnedXP);
        const levelAfter = progression.getCurrentLevel();

        results.push({
          game: index + 1,
          earnedXP,
          levelBefore,
          levelAfter,
          totalXP: progression.getTotalXP(),
          leveledUp: levelAfter > levelBefore
        });
      });

      return {
        games: results,
        finalLevel: progression.getCurrentLevel(),
        finalXP: progression.getTotalXP()
      };
    });

    // Then: Player levels up after earning 200+ XP
    expect(progressionData).not.toBeNull();
    expect(progressionData.finalXP).toBe(243); // 70 + 83 + 90
    expect(progressionData.finalLevel).toBe(2); // Leveled up at 200 XP
    
    // Verify level-up occurred
    const leveledUpGames = progressionData.games.filter(g => g.leveledUp);
    expect(leveledUpGames.length).toBeGreaterThan(0);
  });

  test('progression system: progress bar updates during gameplay', async ({ page }) => {
    // Given: User starts game with progression system
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const ProgressionSystem = window.ProgressionSystem;
      if (ProgressionSystem) {
        window.testProgression = new ProgressionSystem();
      }
    });

    // When: User earns XP incrementally
    const progressUpdates = await page.evaluate(() => {
      const progression = window.testProgression;
      if (!progression) return null;

      const updates = [];

      // Simulate 3 XP gains
      [50, 100, 80].forEach((xp, index) => {
        progression.addXP(xp);
        updates.push({
          step: index + 1,
          xpAdded: xp,
          currentLevel: progression.getCurrentLevel(),
          currentXP: progression.getCurrentXP(),
          totalXP: progression.getTotalXP(),
          xpToNext: progression.getXPToNextLevel()
        });
      });

      return updates;
    });

    // Then: Progress bar data updates correctly
    expect(progressUpdates).not.toBeNull();
    expect(progressUpdates.length).toBe(3);
    
    // Verify XP accumulates
    expect(progressUpdates[0].totalXP).toBe(50);
    expect(progressUpdates[1].totalXP).toBe(150);
    expect(progressUpdates[2].totalXP).toBe(230);
    
    // Verify level-up at 200 XP
    expect(progressUpdates[1].currentLevel).toBe(1);
    expect(progressUpdates[2].currentLevel).toBe(2);
  });

  test('progression system: unlock rewards on level-up', async ({ page }) => {
    // Given: User starts with progression and unlock systems
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const ProgressionSystem = window.ProgressionSystem;
      const UnlockManager = window.UnlockManager;
      if (ProgressionSystem && UnlockManager) {
        window.testProgression = new ProgressionSystem();
        window.testUnlockManager = new UnlockManager();
      }
    });

    // When: User earns enough XP to level up multiple times
    const unlockData = await page.evaluate(() => {
      const progression = window.testProgression;
      const unlockManager = window.testUnlockManager;
      if (!progression || !unlockManager) return null;

      const unlocks = [];

      // Earn 500 XP to reach level 5
      progression.addXP(500);

      // Unlock rewards for levels 2-5
      for (let level = 2; level <= 5; level++) {
        const ballId = `ball-level-${level}`;
        unlockManager.unlockBall(ballId);
        unlocks.push({
          level,
          ballId,
          unlocked: unlockManager.isUnlocked(ballId)
        });
      }

      return {
        finalLevel: progression.getCurrentLevel(),
        finalXP: progression.getTotalXP(),
        unlocks,
        totalUnlocked: unlockManager.getUnlockedBalls().length
      };
    });

    // Then: Rewards are unlocked for each level
    expect(unlockData).not.toBeNull();
    expect(unlockData.finalLevel).toBe(5);
    expect(unlockData.totalUnlocked).toBe(4); // Levels 2, 3, 4, 5
    
    // Verify each unlock succeeded
    unlockData.unlocks.forEach(unlock => {
      expect(unlock.unlocked).toBe(true);
    });
  });
});
