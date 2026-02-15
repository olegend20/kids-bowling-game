# Test Specification: Update PowerMeter for difficulty

**Bead:** Documents-7ai.1.6

## Tracer
Timing layer - proves power meter cycle speed affects timing window

## Test Cases

### constructor(scene, cycleMs) Function

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| `new PowerMeter(scene)` | Cycle time = 2000ms | Backward compatible - no cycleMs param |
| `new PowerMeter(scene, 2000)` | Cycle time = 2000ms | Explicit default |
| `new PowerMeter(scene, 2500)` | Cycle time = 2500ms | Easy mode (slower) |
| `new PowerMeter(scene, 1500)` | Cycle time = 1500ms | Medium mode |
| `new PowerMeter(scene, 1000)` | Cycle time = 1000ms | Hard mode (faster) |

### getValue(elapsedMs) Behavior

- [ ] getValue() uses instance cycleMs, not hardcoded METER_CYCLE
- [ ] Oscillation completes one full cycle in cycleMs milliseconds
- [ ] Value range remains 0-1 regardless of cycle speed
- [ ] Sine wave shape unchanged (raised cosine)

### Timing Verification

| Cycle Time | Time to Peak (50%) | Time to Full Cycle |
|------------|-------------------|-------------------|
| 2500ms | 1250ms | 2500ms |
| 2000ms | 1000ms | 2000ms |
| 1500ms | 750ms | 1500ms |
| 1000ms | 500ms | 1000ms |

## Edge Cases
- [ ] cycleMs = 0 (should throw error or use default)
- [ ] cycleMs = 100 (very fast - may be unusable)
- [ ] cycleMs = 10000 (very slow - may feel sluggish)
- [ ] Negative cycleMs (should throw error or use default)
- [ ] Null/undefined cycleMs (should use default 2000)

## Integration Tests
- [ ] Create PowerMeter with 2500ms cycle, verify slower oscillation
- [ ] Create PowerMeter with 1000ms cycle, verify faster oscillation
- [ ] Multiple PowerMeter instances with different cycles don't interfere
- [ ] Update GameScene to pass `config.powerMeterCycle` to constructor

## Implementation Notes
- Add optional `cycleMs` parameter to `constructor(scene, cycleMs = 2000)`
- Store cycleMs as instance variable: `this._cycleMs = cycleMs`
- Update `getValue()` to use `this._cycleMs` instead of static `METER_CYCLE`
- Keep static `getValue(elapsedMs, cycleMs)` for backward compatibility
- Instance method calls static: `PowerMeter.getValue(elapsedMs, this._cycleMs)`
- Backward compatible: existing code without cycleMs param continues to work

## Success Criteria
- All test cases pass
- Backward compatibility maintained (no breaking changes)
- Power meter cycle speed can be varied independently
- Faster cycle is observably harder to time in gameplay
- Static getValue() still works for unit tests
