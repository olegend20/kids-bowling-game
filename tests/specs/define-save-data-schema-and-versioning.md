# Test Specification: Define save data schema and versioning

## Tracer
Data structure - proves schema is complete and future-proof

## Test Cases

| Input | Expected Output | Notes |
|-------|-----------------|-------|
| validateSchema(validData) | Returns true | Valid data passes validation |
| validateSchema(missingProgression) | Returns false with error | Missing required field detected |
| validateSchema(invalidVersion) | Returns false with error | Invalid version format detected |
| migrateData(v1Data, v2Schema) | Returns migrated v2Data | Migration from v1 to v2 works |
| migrateData(v2Data, v2Schema) | Returns v2Data unchanged | No migration needed for same version |
| getDefaultSchema() | Returns complete schema object | Default schema includes all fields |

## Edge Cases
- [ ] Missing version field
- [ ] Future version (higher than current)
- [ ] Corrupted data structure
- [ ] Extra fields not in schema (should be preserved)
- [ ] Nested field validation
- [ ] Array field validation (achievements, unlocked balls)

## Schema Structure
```json
{
  "version": "1.0.0",
  "progression": {
    "currentXP": 0,
    "currentLevel": 1,
    "totalXP": 0
  },
  "unlocks": {
    "balls": ["starter"],
    "themes": ["classic"]
  },
  "selected": {
    "ball": "starter",
    "theme": "classic"
  },
  "achievements": {
    "first_strike": { "unlocked": false, "progress": 0 }
  },
  "stats": {
    "totalStrikes": 0,
    "totalSpares": 0,
    "gamesPlayed": 0,
    "pinsKnocked": 0
  },
  "rewards": {
    "lastLoginDate": "2026-02-16",
    "currentStreak": 0,
    "longestStreak": 0
  },
  "settings": {
    "soundVolume": 1.0,
    "musicVolume": 0.7,
    "soundMuted": false,
    "musicMuted": false
  }
}
```

## Implementation Notes
- Schema validation uses JSON Schema or custom validator
- Migration functions registered per version (v1->v2, v2->v3, etc.)
- Migrations are idempotent (safe to run multiple times)
- These specs will be translated to JavaScript tests during /cook
