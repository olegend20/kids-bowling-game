# Test Specification: Define achievement data and AchievementSystem

## Tracer
Achievement definitions and tracking - proves achievement system works

## Test Cases

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| new AchievementSystem() | Returns system with 20 achievements | Constructor loads achievement definitions |
| checkAchievements({totalStrikes: 1}) | Unlocks "First Strike" | First strike achievement detected |
| checkAchievements({totalStrikes: 0}) | No unlocks | Condition not met |
| checkAchievements({gamesPlayed: 100}) | Unlocks "100 Games Played" | Milestone achievement |
| unlockAchievement('first_strike') | Achievement marked as unlocked | Manual unlock works |
| getUnlockedAchievements() | Returns array of unlocked achievements | Getter works |
| getAchievementProgress('strike_master') | Returns {current: 7, required: 10} | Progress tracking works |
| checkAchievements with multiple unlocks | Returns array of newly unlocked IDs | Multiple achievements in one check |

## Edge Cases
- [ ] Invalid achievement ID
- [ ] Achievement already unlocked (should not unlock again)
- [ ] Missing stats data
- [ ] Negative stat values
- [ ] Achievement with complex conditions (e.g., "no gutters AND 10 strikes")

## Achievement Definitions (20 total)
```json
[
  {
    "id": "first_strike",
    "name": "First Strike",
    "description": "Bowl your first strike",
    "condition": { "totalStrikes": 1 },
    "xpReward": 50,
    "icon": "strike_icon.png"
  },
  {
    "id": "perfect_game",
    "name": "Perfect Game",
    "description": "Bowl a perfect game (300 score)",
    "condition": { "perfectGames": 1 },
    "xpReward": 500,
    "icon": "perfect_icon.png"
  },
  {
    "id": "strike_master",
    "name": "Strike Master",
    "description": "Bowl 10 strikes in one game",
    "condition": { "strikesInGame": 10 },
    "xpReward": 200,
    "icon": "master_icon.png"
  }
  // ... 17 more achievements
]
```

## Implementation Notes
- AchievementSystem class loads achievements from src/data/achievements.json
- checkAchievements() compares stats against all achievement conditions
- Returns array of newly unlocked achievement IDs
- Progress tracking for incremental achievements (e.g., 7/10 strikes)
- Emit achievement-unlocked event for UI notifications
- These specs will be translated to JavaScript tests during /cook
