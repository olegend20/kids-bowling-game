# Test Specification: Create DifficultyConfig module

**Bead:** Documents-7ai.1.1

## Tracer
Foundation - proves age-to-tier mapping and config lookup work

## Test Cases

### getTier(age) Function

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| `getTier(3)` | `'easy'` | Age < 6 maps to easy |
| `getTier(5)` | `'easy'` | Boundary: age 5 is easy |
| `getTier(6)` | `'medium'` | Boundary: age 6 is medium |
| `getTier(10)` | `'medium'` | Age 6-12 maps to medium |
| `getTier(12)` | `'medium'` | Boundary: age 12 is medium |
| `getTier(13)` | `'hard'` | Age 13+ maps to hard |
| `getTier(20)` | `'hard'` | Adult age maps to hard |

### getConfig(tier) Function

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| `getConfig('easy')` | Returns config object with easy parameters | pinDensity: 0.0008, ballSpeedMultiplier: 0.9, powerMeterCycle: 2500, etc. |
| `getConfig('medium')` | Returns config object with medium parameters | pinDensity: 0.0015, ballSpeedMultiplier: 1.0, powerMeterCycle: 1500, etc. |
| `getConfig('hard')` | Returns config object with hard parameters | pinDensity: 0.002, ballSpeedMultiplier: 1.1, powerMeterCycle: 1000, etc. |

### Config Object Structure

Each config object should contain:
- `pinDensity` (number)
- `ballSpeedMultiplier` (number)
- `powerMeterCycle` (number, milliseconds)
- `powerOptimalRange` (array [min, max])
- `gutterWidth` (number, pixels)

## Edge Cases
- [ ] Age 0 (should map to easy)
- [ ] Negative age (should map to easy or throw error)
- [ ] Age 999 (should map to hard)
- [ ] Non-integer age (e.g., 10.5 - should work)
- [ ] Invalid tier name to getConfig() (should throw error or return null)
- [ ] Null/undefined age to getTier() (should throw error or return default)

## Implementation Notes
- Pure functions, no Phaser dependencies
- Module should be testable in Node.js
- Use CJS export pattern: `if (typeof module !== 'undefined') module.exports = { DifficultyConfig }`
- Config values should match brainstorm recommendations
- Consider adding a `getConfigForAge(age)` convenience function that combines getTier + getConfig

## Success Criteria
- All test cases pass
- Edge cases handled gracefully
- Module can be imported in both Node.js tests and browser
- Config values are tunable (easy to adjust later)
