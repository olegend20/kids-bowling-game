# Test Specification: Gutter detection and ball out-of-play

**Bead:** Documents-007
**Tracer:** Proves ball lifecycle: in-play → gutter → end-of-roll
**Deliverable:** Gutter balls detected and handled; ball-settled event fires

## Context

- Ball enters gutter when x < laneLeft or x > laneRight
- Gutter ball: disable pin collision, roll to back wall
- ball-settled fires when velocity near zero (threshold ~5 px/s)
- ball-settled triggers game state transition

## Test Cases

| Scenario | Input | Expected Output | Notes |
|----------|-------|-----------------|-------|
| In-play ball | ball.x within lane bounds | isGutter = false | |
| Gutter left | ball.x < laneLeft | isGutter = true | |
| Gutter right | ball.x > laneRight | isGutter = true | |
| Gutter disables pins | isGutter = true + pin collision | collision ignored | Pin bodies set as sensors |
| Ball settled - stopped | velocity.magnitude < 5 | 'ball-settled' emitted | |
| Ball settled - off screen | ball.y < 0 (past back wall) | 'ball-settled' emitted | |
| Ball still moving | velocity.magnitude = 100 | no event emitted | |
| Event fires once | ball slows to 0 | exactly 1 'ball-settled' event | No duplicate events |

## Edge Cases

- [ ] Ball oscillates around threshold (velocity bounces near 5) → debounce, don't emit repeatedly
- [ ] Ball in gutter but still moving fast → no settled event yet
- [ ] Ball goes off-screen without stopping → settled fires on y < 0

## Implementation Notes

Check gutter status once when ball enters (transition, not every frame).
Settled check should poll on update() with a small debounce (~3 consecutive frames below threshold).
These specs will be translated to JavaScript tests during /cook.
