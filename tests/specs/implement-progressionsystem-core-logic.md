# Test Specification: Implement ProgressionSystem core logic

## Tracer
XP calculation and leveling - proves progression math works

## Test Cases

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| new ProgressionSystem() | Returns system with level 1, 0 XP | Constructor initializes correctly |
| addXP(100) at level 1 | currentXP = 100, level = 1 | XP added without level-up |
| addXP(200) at level 1 with 0 XP | currentXP = 0, level = 2 | Level-up triggered at 200 XP |
| addXP(500) at level 1 with 0 XP | currentXP = 100, level = 3 | Multiple level-ups in one call |
| calculateXPForLevel(1) | Returns 0 | Level 1 requires 0 XP |
| calculateXPForLevel(2) | Returns 200 | Level 2 requires 200 XP (2 * 100) |
| calculateXPForLevel(10) | Returns 1000 | Level 10 requires 1000 XP (10 * 100) |
| getCurrentLevel() | Returns current level | Getter works |
| getXPToNextLevel() at level 5 with 300 XP | Returns 300 | 600 total - 300 current = 300 remaining |
| getTotalXP() | Returns cumulative XP earned | Total XP tracked |

## Edge Cases
- [ ] Negative XP (should throw error or ignore)
- [ ] Zero XP added
- [ ] Very large XP amounts (millions)
- [ ] Level cap (if any, e.g., level 30)
- [ ] XP overflow at max level

## Implementation Notes
- ProgressionSystem class with state: currentLevel, currentXP, totalXP
- addXP() method checks for level-ups in a loop (handle multiple level-ups)
- calculateXPForLevel(N) = N * 100 (exponential curve)
- Level-up detection: totalXP >= calculateXPForLevel(currentLevel + 1)
- Emit level-up event for UI to listen to
- These specs will be translated to JavaScript tests during /cook
