# Test Specification: Spawn 10 pins as Matter.js circle bodies

**Bead:** Documents-4w4
**Tracer:** Physics layer — proves pins exist as physical bodies
**Deliverable:** 10 pins visible on lane, wobble if nudged

## Context

- PinManager class manages pin lifecycle
- Each pin = Matter.js circle body + Phaser circle graphic
- Pin positions derived from lane dimensions (not hardcoded pixels)
- Physics tuned for satisfying scatter (mass, friction, restitution)

## Test Cases

| Scenario | Input | Expected Output | Notes |
|----------|-------|-----------------|-------|
| Correct pin count | PinManager.spawn(lane) | 10 bodies created | Count via Matter.World.bodies |
| Triangle formation | PinManager.getPositions() | Returns 10 [x,y] in triangle | Row 1=1 pin, Row2=2, Row3=3, Row4=4 |
| Position scaling | Lane width=200 vs 400 | Pin positions scale proportionally | No hardcoded pixels |
| Pin body type | Each body | isDynamic = true | Pins must be moveable |
| Pin radius | Each body | radius = expected value for lane size | Proportional to lane |

## Edge Cases

- [ ] Lane dimensions of zero or negative → throw error
- [ ] Calling spawn() twice → second call replaces first (no duplicate bodies)
- [ ] Pin positions don't overlap each other

## Implementation Notes

Standard pin triangle layout (pin numbers):
```
      [7][8][9][10]   <- row 4 (back)
       [4][5][6]      <- row 3
        [2][3]        <- row 2
         [1]          <- row 1 (head pin, front)
```

Spacing between pins = ~1.5× pin diameter.
These specs will be translated to JavaScript tests (Jest or Vitest) during /cook.
