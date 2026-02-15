# Test Specification: FrameController — frame and ball state machine

**Bead:** Documents-9dt
**Tracer:** Proves game loop transitions correctly across all frame scenarios
**Deliverable:** FrameController tested with all frame transition scenarios

## Context

- FrameController tracks: currentFrame (1–10), currentBall (1 or 2), rolls[]
- On ball-settled: record pins knocked, determine next state
- STRIKE → advance frame + full reset
- NORMAL second ball → record, advance frame + full reset
- SPARE → advance frame + full reset
- Emits: 'frame-advance', 'game-over'
- 10th frame special rules deferred to ScoreEngine

## Test Cases

| Scenario | Setup | Action | Expected State |
|----------|-------|--------|----------------|
| Initial state | new FrameController() | — | frame=1, ball=1, rolls=[] |
| Strike on ball 1 | frame=1, ball=1 | recordRoll(10) | frame=2, ball=1, rolls=[10] |
| Frame advance event fires | — | recordRoll(10) (strike) | 'frame-advance' emitted |
| Normal ball 1 | frame=1, ball=1 | recordRoll(7) | frame=1, ball=2, rolls=[7] |
| Normal ball 2 non-spare | frame=1, ball=2 | recordRoll(1) | frame=2, ball=1, rolls=[7,1] |
| Spare | frame=1, ball=2 | recordRoll(3) (after 7) | frame=2, ball=1, rolls=[7,3] |
| Spare emits frame-advance | — | recordRoll(3) spare | 'frame-advance' emitted |
| Gutter ball | frame=1, ball=1 | recordRoll(0) | frame=1, ball=2, rolls=[0] |
| Two gutter balls | frame=1 | recordRoll(0), recordRoll(0) | frame=2, ball=1 |
| Game reaches frame 10 | frame=10, ball=2 | recordRoll(last) | 'game-over' emitted |
| Frame 10 strike bonus | frame=10, ball=1 | recordRoll(10) | ball=2 (3 balls allowed) |

## Edge Cases

- [ ] recordRoll() after game-over → throw error or no-op
- [ ] Roll value > 10 → throw error
- [ ] Roll value < 0 → throw error
- [ ] Ball 1 + Ball 2 > 10 (non-strike frame) → throw error

## Implementation Notes

FrameController should be a pure JS class — no Phaser dependency.
10th frame: allow up to 3 rolls; game-over fires after 3rd roll (or 2nd if both miss).
Event emission: use simple callback/event emitter pattern.
These specs will be translated to JavaScript tests during /cook.
