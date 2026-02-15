# Test Specification: Power meter UI and input state machine

**Bead:** Documents-j3b
**Tracer:** Proves charge→fire input loop works
**Deliverable:** Power meter fills and fires ball at variable speed

## Context

- InputController manages states: IDLE → AIMING → CHARGING → FIRED
- Hold spacebar: meter fills 0–100% over ~2 seconds
- Release: ball fires at speed proportional to charge
- Power meter bar rendered above ball

## Test Cases

| Scenario | Input | Expected Output | Notes |
|----------|-------|-----------------|-------|
| Initial state | new InputController() | state = IDLE | |
| Start aiming | InputController.startAim() | state = AIMING | |
| Start charging | keydown(space) while AIMING | state = CHARGING, chargeStart recorded | |
| Charge at 0ms | getCharge(0ms elapsed) | 0.0 | |
| Charge at 1000ms | getCharge(1000ms elapsed) | ~0.5 (50%) | Charge time = 2000ms |
| Charge at 2000ms | getCharge(2000ms elapsed) | 1.0 (clamped) | |
| Charge > 2000ms | getCharge(3000ms elapsed) | 1.0 (clamped, not >1) | |
| Fire at 50% | keyup(space) at 50% charge | state = FIRED, velocity = lerp(min, max, 0.5) | |
| Fire at 100% | keyup(space) at 100% charge | state = FIRED, velocity = maxSpeed | |
| Fire at 0% | keyup(space) immediately | state = FIRED, velocity = minSpeed | |
| Reset | InputController.reset() | state = AIMING, charge = 0 | |

## Edge Cases

- [ ] Space released before CHARGING state → no fire
- [ ] Multiple keydown events (key repeat) → only first counts
- [ ] getCharge() called when not CHARGING → returns 0

## Implementation Notes

`lerp(min, max, t) = min + (max - min) * t`
Suggested: minSpeed = 200, maxSpeed = 800 (pixels/second, tune during play).
These specs will be translated to JavaScript tests during /cook.
