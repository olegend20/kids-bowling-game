# Context: Age-Based Difficulty Levels

**Status:** finalized

**Epic Bead:** Documents-7ai

## Problem

The bowling game is too easy for experienced young gamers (ages 7-12):
- Strikes are too easy to achieve
- Power meter timing window is too forgiving
- No challenge differentiation for different age/skill levels

## Approach

Implement age-based difficulty selection with three tiers:
- **Easy** (<6 years): Forgiving physics, slow power meter
- **Medium** (6-12 years): Balanced challenge, moderate timing
- **Hard** (13+ years): Precise physics, fast power meter, narrow optimal range

Difficulty affects:
1. Pin density (heavier = harder to knock down)
2. Ball speed multiplier
3. Power meter cycle speed (faster = smaller timing window)
4. Power meter optimal range (narrower = more precision needed)
5. Gutter width (narrower play area = more aiming precision)

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Age-based selection | More intuitive for kids than "easy/medium/hard" labels |
| Three difficulty tiers | Matches user requirements: <6, 6-12, 13+ |
| Physics-based challenge | Directly addresses "too easy to knock down pins" problem |
| Game-wide difficulty | Per-player difficulty would require complex physics switching |
| No progressive difficulty | User wants consistent skill-based challenge, not escalating |

## Implementation Components

1. **Age input UI** - Add to NameEntryScene
2. **Difficulty config** - New DifficultyConfig.js with tier definitions
3. **Physics integration** - Update PinManager, Ball, PowerMeter to accept difficulty parameters
4. **Visual feedback** - Show difficulty level on scoreboard
5. **Testing** - Playtest and tune each difficulty tier

## Success Criteria

- Younger kids (<6) can still succeed and have fun
- Kids 6-12 face appropriate challenge requiring skill
- Older players (13+) need precise aim and timing
- Strikes feel earned, not automatic
- Power meter timing matters at higher difficulties

## Scope

**Type:** Feature (1-3 sessions)

**Breakdown:**
- 1 Phase: Age-Based Difficulty System
- 1 Feature: Age-based difficulty selection
- 9 Tasks: Config module, UI, integration, physics updates, visual feedback, tuning

**Features:**
1. Feature 1.1: Age-based difficulty selection (Documents-7ai.1)
   - Age input with validation
   - Three difficulty tiers (Easy/Medium/Hard)
   - Physics integration (pins, ball, power meter)
   - Visual feedback (difficulty indicator, optimal range)
   - Playtest and tuning

## Finalize Summary

**Beads Created:**
- 1 Epic: Documents-7ai
- 1 Feature: Documents-7ai.1
- 9 Tasks: Documents-7ai.1.1 through Documents-7ai.1.9

**Test Specs Created:**
- BDD: tests/features/feature-1.1-age-based-difficulty.feature
- TDD: 4 specs in tests/specs/ (DifficultyConfig, PinManager, Ball, PowerMeter)

**Dependencies:**
- Linear chain: Task 1 → Task 2 → Task 3
- Parallel physics updates: Tasks 4, 5, 6 depend on Task 3
- Playtest depends on physics updates (Tasks 4, 5, 6)
- Visual feedback tasks (7, 8) depend on integration/timing layers
