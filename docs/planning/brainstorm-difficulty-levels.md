# Brainstorm: Age-Based Difficulty Levels

**Date:** 2026-02-15
**Status:** brainstormed

---

## Problem Statement

The bowling game is currently too easy for kids aged 7-12 who are experienced gamers. Specifically:
- Too easy to knock down all pins for a strike
- Power meter is too forgiving (timing window too large)
- No challenge differentiation for different age groups

Players want skill-based difficulty that affects aiming precision and power selection, with physics changes that make the game appropriately challenging based on player age.

---

## User Perspective

**Who:** Kids aged 6-12 (primary), with support for younger (<6) and older (13+) players
**Context:** Playing at home, experienced with video games, want a challenge
**What they want:**
- Appropriate difficulty for their age/skill level
- Skill-based challenge (aiming, power timing)
- Harder difficulty = more precision required
- Still fun, not frustrating

**What success looks like:**
- Younger kids (<6) can still succeed with forgiving physics
- Kids 6-12 face a moderate challenge requiring skill
- Older players (13+) need precise aim and timing to score well
- Strikes feel earned, not automatic
- Power meter timing matters

---

## Technical Exploration

### Current Physics Parameters

**Ball (Ball.js):**
- Speed: 10 px/frame (constant)
- Radius: 5% of play width (~11px)
- Density: 0.01 (heavy)
- Friction: 0.1
- FrictionAir: 0.01
- Restitution: 0.3

**Pins (PinManager.js):**
- Radius: 4.5% of play width (~10px)
- Density: 0.001 (light - 10x lighter than ball)
- Friction: 0.5
- FrictionAir: 0.05
- Restitution: 0.5

**Power Meter (PowerMeter.js):**
- Cycle time: 2000ms (2 seconds for full oscillation)
- Oscillation: sine wave (0 → 1 → 0)
- Visual feedback: color changes (green → yellow → red)

**Lane (lane.js):**
- Play width: 220px (280px total - 60px gutters)
- Gutter width: 30px each side

### Difficulty Levers Identified

**1. Pin Density (Primary lever for "too easy to knock down")**
- Current: 0.001 (very light)
- Increase density = pins harder to knock over
- Most direct solution to "too easy to strike" problem

**2. Ball Speed Multiplier**
- Current: constant 10 px/frame
- Could vary optimal speed by difficulty
- Faster = less control, slower = more precision needed

**3. Power Meter Cycle Speed**
- Current: 2000ms cycle
- Faster cycle = smaller timing window
- Directly addresses "power meter too forgiving"

**4. Power Meter Optimal Range**
- Current: full 0-1 range usable
- Could define "optimal" power range (e.g., 0.6-0.8)
- Outside range = reduced effectiveness

**5. Gutter Width (Aiming precision)**
- Current: 30px gutters, 220px play area
- Narrower play area = more precision required
- Affects aiming skill requirement

**6. Pin Spacing**
- Current: 14% of play width (~30px)
- Tighter spacing = easier chain reactions
- Wider spacing = need more precise hits

---

## Approaches Considered

### Option A: Age Input with Three Difficulty Tiers ✓ RECOMMENDED

**Age ranges:**
- **Easy** (<6 years old): Forgiving physics, slow power meter
- **Medium** (6-12 years old): Balanced challenge, moderate timing
- **Hard** (13+ years old): Precise physics, fast power meter, narrow optimal range

**Implementation:**
1. Add age input field to NameEntryScene
2. Map age to difficulty tier
3. Pass difficulty config to GameScene
4. Apply physics multipliers based on difficulty
5. Adjust power meter cycle speed
6. Show difficulty indicator in UI

**Pros:**
- Natural for kids ("How old are you?")
- Three clear tiers match user requirements exactly
- Single input, automatic difficulty selection
- Age-appropriate challenge

**Cons:**
- Kids might lie about age to get easier/harder mode
- One difficulty per game (both players same difficulty)

### Option B: Manual Difficulty Selector

Add dropdown/buttons for Easy/Medium/Hard selection.

**Pros:**
- Players can choose regardless of age
- More explicit control

**Cons:**
- Less intuitive for kids
- Requires understanding what "medium" means
- User specifically requested age-based approach

**Rejected:** User wants age-based selection.

### Option C: Per-Player Difficulty

Each player selects their own difficulty level.

**Pros:**
- Mixed skill levels can play together
- More flexible

**Cons:**
- Complex to implement (different physics per player)
- Confusing UX (pins change weight between turns?)
- Unfair scoring comparison

**Rejected:** Physics changes can't be per-player without major refactoring.

### Option D: Progressive Difficulty

Difficulty increases as game progresses (frame-by-frame or score-based).

**Pros:**
- Keeps game interesting over time
- Rewards improvement

**Cons:**
- User wants consistent challenge level
- Could frustrate players who start strong
- Doesn't address age-appropriateness

**Rejected:** User wants skill-based, not progressive difficulty.

---

## Recommended Difficulty Configuration

### Easy Mode (<6 years old)

**Goal:** Forgiving, fun, achievable

```javascript
{
  pinDensity: 0.0008,           // 20% lighter than current
  ballSpeedMultiplier: 0.9,     // Slightly slower
  powerMeterCycle: 2500,        // Slower (2.5s)
  powerOptimalRange: [0.3, 1.0], // Wide optimal range
  gutterWidth: 25,              // Wider play area (230px)
  pinSpacing: 0.15              // Slightly tighter (easier chains)
}
```

### Medium Mode (6-12 years old)

**Goal:** Balanced challenge, skill matters

```javascript
{
  pinDensity: 0.0015,           // 50% heavier than current
  ballSpeedMultiplier: 1.0,     // Current speed
  powerMeterCycle: 1500,        // Faster (1.5s)
  powerOptimalRange: [0.5, 0.85], // Narrower optimal range
  gutterWidth: 30,              // Current width (220px play)
  pinSpacing: 0.14              // Current spacing
}
```

### Hard Mode (13+ years old)

**Goal:** Precise, challenging, rewarding

```javascript
{
  pinDensity: 0.002,            // 100% heavier than current
  ballSpeedMultiplier: 1.1,     // Faster (less control)
  powerMeterCycle: 1000,        // Fast (1s)
  powerOptimalRange: [0.6, 0.75], // Narrow sweet spot
  gutterWidth: 35,              // Narrower play area (210px)
  pinSpacing: 0.13              // Slightly wider (harder chains)
}
```

---

## Risks and Unknowns

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Age input validation issues | Low | Medium | Validate input, default to medium if invalid |
| Hard mode too frustrating | Medium | High | Playtest and tune; allow manual override |
| Physics changes break scoring | Low | High | Test all scoring scenarios (strikes, spares, 10th frame) |
| Power meter too fast to see | Medium | Medium | Visual feedback improvements, color zones |
| Gutter width changes break layout | Low | Low | Lane constants already support dynamic gutters |

### UX Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Kids lie about age | Medium | Low | Accept it; they're choosing their challenge |
| Difficulty not obvious during play | Low | Medium | Show difficulty indicator on scoreboard |
| Players want to change mid-game | Low | Medium | Document as future feature; restart game to change |

### Scope Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Feature creep (power-ups, obstacles) | Medium | Medium | Stick to physics/timing changes only |
| Per-player difficulty requests | Low | High | Explain technical limitation, suggest house rules |
| Difficulty persistence between sessions | Low | Low | Out of scope for MVP; add if requested |

---

## Implementation Plan

### Phase 1: Age Input UI
1. Add age input field to NameEntryScene
2. Validate age input (1-99, default to 10 if invalid)
3. Map age to difficulty tier
4. Pass difficulty config to GameScene

### Phase 2: Difficulty Configuration
1. Create `DifficultyConfig.js` with three tier definitions
2. Export difficulty selector function
3. Add unit tests for age-to-difficulty mapping

### Phase 3: Physics Integration
1. Update PinManager.spawn() to accept density parameter
2. Update Ball.launch() to accept speed multiplier
3. Update PowerMeter to accept cycle time parameter
4. Update LANE config to accept gutter width parameter

### Phase 4: Visual Feedback
1. Add difficulty indicator to scoreboard UI
2. Update power meter color zones for narrower optimal ranges
3. Add visual cue for optimal power range

### Phase 5: Testing & Tuning
1. Playtest each difficulty level
2. Tune physics parameters based on feedback
3. Verify scoring logic unchanged
4. Test edge cases (age 0, 999, negative, text input)

---

## Open Questions

1. **Should difficulty be shown during gameplay?**
   - Recommendation: Yes, small indicator on scoreboard ("Easy Mode", "Medium", "Hard")

2. **What if players want to change difficulty mid-game?**
   - Recommendation: Require game restart (simplest implementation)

3. **Should we persist difficulty choice between sessions?**
   - Recommendation: No for MVP; always ask age at start

4. **What happens if age input is invalid (text, negative, extreme)?**
   - Recommendation: Default to medium (age 10) and show warning

5. **Should we allow manual difficulty override?**
   - Recommendation: No for MVP; age-based only as requested

---

## Key Decisions

- **Age-based difficulty selection** - Natural for target audience
- **Three tiers** - Easy (<6), Medium (6-12), Hard (13+)
- **Physics-based challenge** - Pin density, ball speed, power timing
- **Game-wide difficulty** - Not per-player (technical limitation)
- **No progressive difficulty** - Consistent challenge throughout game
- **MVP scope** - Age input + physics tuning only, no new mechanics

---

## Next Steps

1. **Review this brainstorm** - Confirm approach with user
2. **Scope phase** - Break down into tasks (UI, config, physics, testing)
3. **Finalize phase** - Create beads for implementation
4. **Implementation** - Follow TDD cycle for each component
