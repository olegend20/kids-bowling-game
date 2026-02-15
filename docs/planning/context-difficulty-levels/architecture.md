# Architecture: Difficulty System

## Current Architecture

### Physics System
- **Ball.js** - Bowling ball entity with Matter.js physics
  - Constant speed: 10 px/frame
  - Density: 0.01 (heavy)
  - Launch velocity calculated from aim point
  
- **PinManager.js** - Manages 10 bowling pins
  - Current density: 0.001 (light, 10x lighter than ball)
  - Friction: 0.5, FrictionAir: 0.05
  - Standard triangle formation

- **PowerMeter.js** - Power selection UI
  - Cycle time: 2000ms (sine wave oscillation)
  - Returns value 0-1
  - Visual feedback with color zones

- **lane.js** - Lane layout constants
  - Play width: 220px (280px total - 60px gutters)
  - Gutter width: 30px each side
  - All positions derived from these constants

### Scene Flow
1. **NameEntryScene** - Collect player names and ball colors
2. **GameScene** - Main gameplay (physics, input, scoring)
3. **ResultsScene** - Final scores

## Proposed Changes

### New Component: DifficultyConfig.js

```javascript
// Pure configuration module
// Maps age to difficulty tier and returns physics parameters

export const DifficultyConfig = {
  getTier(age) {
    if (age < 6) return 'easy';
    if (age <= 12) return 'medium';
    return 'hard';
  },
  
  getConfig(tier) {
    return {
      easy: { pinDensity: 0.0008, ballSpeedMultiplier: 0.9, ... },
      medium: { pinDensity: 0.0015, ballSpeedMultiplier: 1.0, ... },
      hard: { pinDensity: 0.002, ballSpeedMultiplier: 1.1, ... }
    }[tier];
  }
};
```

### Modified Components

**NameEntryScene**
- Add age input field (HTML input element)
- Validate age (1-99, default 10)
- Pass difficulty config to GameScene via scene.start() data

**GameScene**
- Accept difficulty config in create()
- Pass config to PinManager.spawn(), Ball.launch(), PowerMeter constructor
- Display difficulty indicator on scoreboard

**PinManager**
- Accept optional density parameter in spawn()
- Default to current 0.001 if not provided (backward compatible)

**Ball**
- Accept optional speed multiplier in launch()
- Multiply BALL_SPEED by multiplier
- Default to 1.0 if not provided

**PowerMeter**
- Accept optional cycle time in constructor
- Accept optional optimal range [min, max]
- Update color zones to highlight optimal range

## Design Patterns

### Configuration Injection
Difficulty config flows from NameEntryScene → GameScene → entities
- Keeps entities pure (no global state)
- Testable (can inject different configs)
- Backward compatible (defaults preserve current behavior)

### Pure Functions
DifficultyConfig uses pure functions for age-to-tier mapping
- Testable in isolation
- No side effects
- Deterministic

### Optional Parameters
All difficulty parameters are optional with sensible defaults
- Existing code continues to work
- Gradual migration possible
- No breaking changes

## Technical Constraints

### Matter.js Physics
- Density affects mass (mass = area × density)
- Higher density = more momentum = harder to deflect
- Pin density range: 0.0005 - 0.003 (tested range)
- Ball density fixed at 0.01 (10-20x heavier than pins)

### Power Meter Timing
- Cycle time range: 800ms - 3000ms (usable range)
- Below 800ms: too fast to react
- Above 3000ms: feels sluggish
- Current 2000ms is comfortable baseline

### Lane Layout
- Gutter width range: 20px - 40px
- Below 20px: too narrow (ball clips)
- Above 40px: play area too small
- Current 30px is balanced

## Testing Strategy

### Unit Tests
- DifficultyConfig.getTier() - age boundary cases
- DifficultyConfig.getConfig() - returns valid configs
- Age input validation

### Integration Tests
- PinManager with different densities
- Ball launch with speed multipliers
- PowerMeter with different cycle times

### Playtest Validation
- Each difficulty tier feels appropriately challenging
- Easy mode: kids <6 can score
- Medium mode: kids 6-12 need skill
- Hard mode: 13+ need precision
