# Test Specification: PlayerManager — per-player score and turn tracking

**Bead:** Documents-xr3
**Tracer:** Proves turn alternation and independent score tracking
**Deliverable:** 2-player turn alternation works with independent scores

## Context

- PlayerManager holds N players (1 or 2), each with their own FrameController + ScoreEngine
- nextPlayer() advances turn to next player
- currentPlayer() returns the active player
- On player switch: emit 'player-change' event with new player info
- Each player's state is fully independent

## Test Cases

| Scenario | Input | Expected Output | Notes |
|----------|-------|-----------------|-------|
| 1-player init | new PlayerManager(1) | currentPlayer() = Player 1 | |
| 2-player init | new PlayerManager(2) | currentPlayer() = Player 1 | P1 goes first |
| Advance turn | nextPlayer() | currentPlayer() = Player 2 | |
| Wrap around | nextPlayer() (when on P2) | currentPlayer() = Player 1 | Circular |
| Player-change event | nextPlayer() | 'player-change' emitted with player=2 | |
| Independent scores | P1 records strike, P2 records 0 | P1.frameController !== P2.frameController | |
| P2 score unaffected | P1 rolls 10 | P2.rolls still empty | |
| All players done | both players complete frame 10 | isGameOver() = true | |
| Not over until all done | P1 done, P2 on frame 8 | isGameOver() = false | |

## Edge Cases

- [ ] PlayerManager(0) → throw error
- [ ] PlayerManager(3+) → works (future-proof, though MVP is 2)
- [ ] nextPlayer() after game is over → no-op or throw

## Implementation Notes

PlayerManager is pure JS — no Phaser dependency.
Each player object: `{ id, name, frameController, scoreEngine }`
These specs will be translated to JavaScript tests during /cook.
