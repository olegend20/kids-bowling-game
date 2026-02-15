# Test Specification: Update Ball for difficulty

**Bead:** Documents-7ai.1.5

## Tracer
Physics layer - proves ball speed multiplier affects control

## Test Cases

### launch(toX, toY, speedMultiplier) Function

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| `launch(100, 200)` | Ball velocity = BALL_SPEED (10 px/frame) | Backward compatible - no multiplier |
| `launch(100, 200, 1.0)` | Ball velocity = 10 px/frame | Explicit 1.0 multiplier |
| `launch(100, 200, 0.9)` | Ball velocity = 9 px/frame | Easy mode (slower) |
| `launch(100, 200, 1.1)` | Ball velocity = 11 px/frame | Hard mode (faster) |

### Velocity Calculation

- [ ] Velocity magnitude equals `BALL_SPEED * speedMultiplier`
- [ ] Velocity direction unchanged (still points toward aim point)
- [ ] Velocity vector is normalized before scaling
- [ ] Ball becomes dynamic (isStatic = false) after launch

## Edge Cases
- [ ] speedMultiplier = 0 (ball doesn't move)
- [ ] speedMultiplier = 2.0 (very fast ball)
- [ ] Negative speedMultiplier (ball moves backward - should clamp or error)
- [ ] Null/undefined speedMultiplier (should use default 1.0)

## Integration Tests
- [ ] Launch ball with 0.9 multiplier, verify slower than default
- [ ] Launch ball with 1.1 multiplier, verify faster than default
- [ ] Launch multiple times with different multipliers (no state leakage)
- [ ] Verify speed change affects gameplay (faster = less control)

## Implementation Notes
- Add optional `speedMultiplier` parameter to `launch(toX, toY, speedMultiplier = 1.0)`
- Modify velocity calculation: `const speed = BALL_SPEED * speedMultiplier`
- No changes to launch direction or other ball properties
- Backward compatible: existing calls without multiplier param continue to work
- Update GameScene to pass `config.ballSpeedMultiplier` when launching

## Success Criteria
- All test cases pass
- Backward compatibility maintained (no breaking changes)
- Ball speed can be varied without affecting direction
- Faster ball is observably harder to control in gameplay
