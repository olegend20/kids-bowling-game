# Test Specification: ScoreEngine — pure bowling score calculator

**Bead:** Documents-acm
**Tracer:** Isolated, fully testable scoring logic
**Deliverable:** ScoreEngine with comprehensive unit tests covering edge cases

## Context

- ScoreEngine(rolls[]) → { frameScores[], runningTotals[], finalScore }
- Handles: normal frames, strikes, spares, 10th frame (3 rolls)
- Pure function — no Phaser or DOM dependency
- Standard bowling: max score 300 (12 consecutive strikes)

## Test Cases

| Scenario | rolls[] input | Expected frameScores[] | Expected finalScore |
|----------|---------------|------------------------|---------------------|
| All gutter balls | [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] | [0,0,0,0,0,0,0,0,0,0] | 0 |
| All fives (all spares) | [5,5,5,5,...×21] | [15,15,15,...] | 150 |
| Perfect game | [10×12] | [30,30,30,30,30,30,30,30,30,30] | 300 |
| Single spare | [5,5,3,...all zeros] | frame1=13, frame2=3, rest=0 | 16 |
| Single strike | [10,3,4,...all zeros] | frame1=17, frame2=7, rest=0 | 24 |
| Strike in frame 10 | [...,10,5,3] | frame10=18 | varies |
| Spare in frame 10 | [...,7,3,5] | frame10=15 | varies |
| Mixed game | [3,6,5,4,10,3,3,9,0,10,7,2,4,5,9,1,3,2,10,9,1] | standard expected | 118 |

## Edge Cases

- [ ] Empty rolls array → all zeros
- [ ] Fewer than 20 rolls (incomplete game) → partial scores for completed frames
- [ ] 10th frame strike followed by two more strikes → 3 bonus rolls counted once
- [ ] Score never exceeds 300

## Implementation Notes

Standard scoring rules:
- Strike (ball 1 = 10): 10 + next 2 balls
- Spare (ball 1 + ball 2 = 10): 10 + next 1 ball
- Normal: ball 1 + ball 2
- 10th frame: 2 or 3 balls depending on strike/spare; no carry-forward bonus beyond frame 10

These specs will be translated to JavaScript tests during /cook.
Reference: https://en.wikipedia.org/wiki/Ten-pin_bowling#Scoring
