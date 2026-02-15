# Test Specification: PinManager — count fallen pins and reset

**Bead:** Documents-10p
**Tracer:** Proves pin state is queryable and resettable
**Deliverable:** PinManager correctly counts and resets pins

## Context

- PinManager tracks which of 10 pins are knocked down
- A pin is knocked when it leaves the lane or tips past a threshold angle
- reset(keepKnocked=false) → all 10 pins back at original positions
- reset(keepKnocked=true) → only knocked pins removed; standing pins stay

## Test Cases

| Scenario | Input | Expected Output | Notes |
|----------|-------|-----------------|-------|
| Initial state | new PinManager(lane) | countStanding()=10, countKnocked()=0 | |
| Mark pin knocked | markKnocked(pinIndex) | countKnocked()=1, countStanding()=9 | |
| Mark 3 pins knocked | markKnocked(0,1,2) | countKnocked()=3, countStanding()=7 | |
| Full reset | reset(false) | countStanding()=10, countKnocked()=0 | All 10 back |
| Partial reset (2nd ball) | 3 knocked, reset(true) | 7 pins standing, 3 still knocked | Standing pins unchanged |
| Strike detection | countKnocked()===10 | isStrike()=true | |
| Spare detection | ball1=7, ball2=countKnocked()===10 | isSpare()=true | After 2nd ball |

## Edge Cases

- [ ] markKnocked() with index out of range (< 0 or > 9) → throw error
- [ ] reset(true) when no pins are knocked → all 10 pins stay unchanged
- [ ] markKnocked() on already-knocked pin → no change, no error

## Implementation Notes

"Knocked" detection in physics: pin body rotation > 45° OR position moved > 1 pin-radius from spawn.
PinManager should not depend on Phaser or Matter.js — take position/rotation as plain data for testability.
These specs will be translated to JavaScript tests during /cook.
