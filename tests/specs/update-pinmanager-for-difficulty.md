# Test Specification: Update PinManager for difficulty

**Bead:** Documents-7ai.1.4

## Tracer
Physics layer - proves pin density affects knockdown difficulty

## Test Cases

### spawn(lane, density) Function

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| `spawn(lane)` | Pins created with default density 0.001 | Backward compatible - no density param |
| `spawn(lane, 0.0008)` | Pins created with density 0.0008 | Easy mode density |
| `spawn(lane, 0.0015)` | Pins created with density 0.0015 | Medium mode density |
| `spawn(lane, 0.002)` | Pins created with density 0.002 | Hard mode density |

### Pin Body Properties

After spawning with custom density:
- [ ] Pin Matter.js body has correct density value
- [ ] Pin mass is calculated correctly (mass = area × density)
- [ ] Pin friction, restitution, frictionAir unchanged
- [ ] Pin positions unchanged (standard triangle formation)
- [ ] Pin radius unchanged

## Edge Cases
- [ ] Density 0 (should work but pins won't move)
- [ ] Negative density (should throw error or clamp to 0)
- [ ] Very high density (e.g., 1.0 - pins become immovable)
- [ ] Null/undefined density (should use default 0.001)

## Integration Tests
- [ ] Spawn pins with easy density, verify lighter than default
- [ ] Spawn pins with hard density, verify heavier than default
- [ ] Spawn pins multiple times with different densities (no accumulation)
- [ ] Verify density change affects knockdown behavior (requires physics simulation)

## Implementation Notes
- Add optional `density` parameter to `spawn(lane, density = 0.001)`
- Pass density to Matter.js body creation: `density: density`
- No changes to pin positions, radius, or other properties
- Backward compatible: existing calls without density param continue to work
- Update GameScene to pass `config.pinDensity` when spawning

## Success Criteria
- All test cases pass
- Backward compatibility maintained (no breaking changes)
- Pin density can be varied without affecting other properties
- Heavier pins are observably harder to knock down in gameplay
