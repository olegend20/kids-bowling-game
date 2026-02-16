# World-Class Kids Bowling Game — Planning Context

**Status:** finalized

**Epic Bead:** Documents-qrl

## Problem

Transform current kids bowling game into a chart-topping, world-class game for ages 7-12 with best-in-class engagement mechanics, retention features, and progression systems.

## Scope

**Phase 1 (MVP+ for Chart Success):**
- 11 features
- 35 tasks
- Estimated: 15-20 development sessions

**Features:**
1. Cloud-ready data architecture (StorageAdapter, environment config)
2. Progression system (XP, 30 levels)
3. Unlockable balls (10 balls with unique stats)
4. Lane themes (5 themes)
5. Achievement system (20 achievements)
6. Daily login rewards (7-day streak)
7. Tutorial and onboarding (3-step interactive)
8. Audio system (sound effects, music)
9. Visual polish (particles, screen shake, effects)
10. Enhanced UI/UX (main menu, post-game, settings)
11. Containerization and deployment setup (Docker)

## Approach

**Phased development with MVP+ first:**

**Phase 1 (MVP+ for Chart Success):**
- Progression system (XP, 30 levels)
- 10 unlockable balls with unique stats/visuals
- 5 lane themes
- 20 achievements
- Daily login rewards (7-day streak)
- Tutorial/onboarding
- Audio & visual polish (sound effects, music, particles)
- Enhanced UI/UX (main menu, ball selection, post-game screens)

**Phase 2 (Variety & Depth):**
- 3 additional game modes (Challenge, Time Attack, Target Practice)
- 10 more balls (total 20)
- 5 more themes (total 10)
- 20 more achievements (total 40)
- Weekly challenges
- **Age gate and parental controls** (age verification, playtime limits, content filters)

**Phase 3 (Social & Competition):**
- Leaderboards (global, weekly)
- Friend system
- Shareable achievements
- Replay system
- **Online multiplayer** (real-time matchmaking, 1v1 and tournament modes)

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Phased approach** | Ship Phase 1 quickly, iterate based on metrics |
| **New feature branch** | Preserve current game on `main`, all changes on `feature/world-class-game` |
| **Cloud-ready architecture** | StorageAdapter pattern (localStorage → API), containerized (Docker), environment config |
| **100% free, no IAP** | Focus on engagement first, evaluate monetization later |
| **Roblox-level engagement target** | Top web game portals, high retention, viral growth |
| **Online multiplayer in Phase 3** | After proving core engagement and retention |
| **Age gate + parental controls in Phase 2** | Simple age verification, playtime limits, content filters |
| **Placeholder assets initially** | Speed up development, polish with custom art/sound later |
| **Target metrics** | Day 1 retention >25%, Day 7 >10%, avg session >20min |

## Technical Stack

- **Framework:** Phaser 3 + Matter.js (existing)
- **Data persistence:** localStorage (JSON save data)
- **Assets:** Ball sprites, theme backgrounds, sound effects, music, particles
- **New modules:** ProgressionSystem, AchievementSystem, RewardSystem, UnlockManager, SoundManager, MusicManager

## Research Insights

**Successful kids games (7-12) use:**
- XP and level-up systems with visible progress bars
- Unlockable content at each level (characters, cosmetics, items)
- Daily login rewards with streak bonuses
- Achievement/badge systems
- Playtime rewards
- Multiple game modes for variety
- Cosmetic customization
- Satisfying feedback ("juice") — particles, sounds, animations, screen shake
- Short tutorials with rewards
- Free starter rewards to hook players

**Examples:**
- Roblox games: Free rewards everywhere, playtime rewards boost retention
- PBA Bowling Challenge: 100+ balls with unique stats, career mode, bonus challenges
- Mobile hits: Daily login streaks, battle pass-style progression, achievement systems

## Constraints

- **Preserve current game:** All changes on new branch, `main` stays as-is
- **Age-appropriate:** No dark patterns, transparent progression, parent-friendly
- **Performance:** Must run smoothly on tablets and lower-end devices
- **Maintainability:** Keep codebase clean, testable, and documented

## Success Criteria

**Phase 1 success:**
- All core engagement systems implemented
- Visible progress every session
- Improved retention metrics vs. current game
- Kids 7-12 find it fun and want to keep playing
- Parents approve (safe, age-appropriate)
- Codebase remains maintainable

**Long-term success (chart-topping / Roblox-level):**
- Day 1 retention >25%
- Day 7 retention >10%
- Day 30 retention >5%
- Average session length >20 minutes
- Organic sharing and word-of-mouth growth
- Positive reviews from kids and parents
- Featured on top web game portals
- Viral growth potential (social sharing, friend invites)
