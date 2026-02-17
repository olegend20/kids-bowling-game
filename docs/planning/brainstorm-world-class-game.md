# Brainstorm: World-Class Kids Bowling Game

**Date:** 2026-02-16
**Status:** brainstormed

---

## Problem Statement

Transform the current kids bowling game into a chart-topping, world-class game capable of competing with top mobile/web games for kids aged 7-12. The game needs best-in-class engagement mechanics, retention features, progression systems, and rewards that motivate continued play while maintaining the fun bowling core.

**Critical constraint:** All changes must be made to a new fork/branch. The current game stays as-is.

---

## User Perspective

**Who:** Kids aged 7-12 (primary) and their parents (secondary — approval/download decision)

**Context:** 
- Playing on browser (desktop/tablet) or potentially mobile
- Competing with Roblox games, mobile hits, and other free-to-play experiences
- Short attention spans — need immediate engagement
- Social creatures — want to share achievements, compete with friends

**What they want:**
- Instant gratification and visible progress
- Unlockables and collectibles (characters, balls, lanes, cosmetics)
- Rewards for coming back (daily login streaks)
- Achievements and badges to show off
- Variety in gameplay (not just standard bowling)
- Progression that feels meaningful
- Fun animations and feedback (juice)

**What success looks like:**
- Kids play multiple sessions per day
- High Day 1 retention (>20%)
- Average session length >15 minutes
- Kids tell friends about the game
- Parents approve (safe, age-appropriate, not predatory monetization)

---

## Technical Exploration

### Current Game Analysis

**Strengths:**
- Solid physics foundation (Phaser 3 + Matter.js)
- Working 2-player hotseat mode
- Age-based difficulty system
- Clean codebase with tests
- Proper bowling scoring

**Gaps for world-class status:**
- No progression system (no unlocks, no levels)
- No rewards or achievements
- No daily login incentives
- No variety in gameplay modes
- No cosmetic customization
- No social features (leaderboards, sharing)
- Limited visual polish and "juice"
- No tutorial or onboarding
- No sound effects or music

### Research: Successful Kids Games (7-12)

Based on research into top mobile games, Roblox hits, and successful kids titles:

**Core Engagement Mechanics:**

1. **Progression Systems**
   - XP and level-up systems with visible progress bars
   - Unlockable content at each level (characters, balls, lanes, cosmetics)
   - Multiple progression tracks (player level, ball collection, achievement completion)

2. **Reward Loops**
   - Daily login rewards (streak bonuses)
   - First-time completion bonuses
   - Achievement/badge systems
   - Playtime rewards (every X minutes)
   - Free starter rewards to hook players

3. **Variety & Replayability**
   - Multiple game modes (standard, challenge, time attack, target practice)
   - Special events or limited-time challenges
   - Difficulty tiers with better rewards
   - Boss battles or special opponents

4. **Cosmetic Customization**
   - Character/avatar customization
   - Ball skins and effects (trails, explosions)
   - Lane themes (space, candy, jungle, neon)
   - Unlockable animations and celebrations

5. **Social Features**
   - Leaderboards (global, friends, weekly)
   - Shareable achievements
   - Spectator mode or replays
   - Friend challenges

6. **Feedback & Polish ("Juice")**
   - Satisfying sound effects
   - Particle effects and animations
   - Screen shake and impact feedback
   - Celebration animations for strikes/spares
   - Progress bars that fill satisfyingly

**Examples from Research:**

- **Roblox games:** Free rewards everywhere, playtime rewards boost retention, short tutorials, visible progression
- **PBA Bowling Challenge:** 100+ bowling balls with unique stats, career mode, tournaments, bonus challenges (split balls, bomb balls)
- **Mobile hits:** Daily login streaks (Duolingo model), battle pass-style progression, cosmetic unlocks, achievement systems
- **Successful patterns:** Progress bars, flashing reward screens, quick loot fanfare, login streak rewards, small dopamine hits

---

## Approaches Considered

### Option A: Incremental Enhancement (Low Risk)
Add features to existing game gradually:
- Add basic progression (XP, levels)
- Add 3-5 unlockable balls
- Add simple achievements
- Add daily login bonus

**Pros:** Low risk, preserves current game
**Cons:** May not reach "world-class" status, piecemeal approach

### Option B: Major Overhaul (High Risk, High Reward)
Complete redesign with all engagement systems:
- Full progression system with 50+ levels
- 20+ unlockable balls with unique stats/effects
- 10+ lane themes
- Multiple game modes
- Achievement system (50+ achievements)
- Daily/weekly challenges
- Leaderboards
- Tutorial and onboarding
- Full audio/visual polish

**Pros:** True world-class experience, competitive with top games
**Cons:** Large scope, longer development time

### Option C: Hybrid Approach — MVP+ (Recommended)
Build core engagement systems first, iterate based on metrics:

**Phase 1: Core Engagement (MVP+)**
- Progression system (XP, levels 1-30)
- 10 unlockable balls (visual + stat variety)
- 5 lane themes
- Achievement system (20 core achievements)
- Daily login rewards (7-day streak)
- Tutorial/onboarding
- Sound effects and music
- Visual polish pass (particles, animations)

**Phase 2: Variety & Depth**
- 3 additional game modes (Challenge, Time Attack, Target Practice)
- 10 more balls (total 20)
- 5 more lane themes (total 10)
- 20 more achievements (total 40)
- Weekly challenges

**Phase 3: Social & Competition**
- Leaderboards (global, weekly)
- Friend system
- Shareable achievements
- Replay system

**Pros:** Balanced risk/reward, can ship Phase 1 quickly, iterate based on data
**Cons:** Requires discipline to not over-scope Phase 1

---

## Recommended Direction

**Build a world-class kids bowling game using a phased approach (Option C).**

### Phase 1 Scope (MVP+ for Chart Success)

**1. Progression System**
- XP earned per game (based on score, strikes, spares)
- 30 levels with rewards at each level
- Progress bar visible during gameplay
- Level-up celebration animation

**2. Unlockable Balls (10 total)**
- Starter ball (default)
- 9 unlockable balls with unique visuals and stats:
  - Power balls (heavier, more pin knockdown)
  - Control balls (easier to aim)
  - Spin balls (more curve)
  - Special effect balls (fire trail, ice effect, rainbow, etc.)
- Ball selection screen before game
- Stats displayed (power, control, spin)

**3. Lane Themes (5 total)**
- Classic (current)
- Space (stars, planets)
- Candy (colorful, sweet)
- Neon (cyberpunk glow)
- Jungle (tropical)
- Unlocked at levels 1, 5, 10, 15, 20

**4. Achievement System (20 achievements)**
- First Strike
- Perfect Game (300)
- Strike Master (10 strikes in one game)
- Spare Specialist (10 spares in one game)
- Level 10 Reached
- Level 20 Reached
- Level 30 Reached
- Ball Collector (unlock 5 balls)
- Ball Master (unlock all balls)
- Theme Explorer (unlock all themes)
- 7-Day Streak
- 30-Day Streak
- 100 Games Played
- 1000 Pins Knocked
- Gutter Avoider (no gutters in a game)
- Comeback Kid (win after being behind)
- Speed Demon (complete game in under 5 minutes)
- Precision Player (5 strikes in a row)
- Social Butterfly (play 10 games with 2 players)
- Champion (reach level 30)

**5. Daily Login Rewards**
- Day 1: 100 XP
- Day 2: 150 XP
- Day 3: 200 XP + common ball unlock
- Day 4: 250 XP
- Day 5: 300 XP + rare ball unlock
- Day 6: 400 XP
- Day 7: 500 XP + epic ball unlock + special lane theme
- Streak resets if missed a day
- Visual streak counter on main menu

**6. Tutorial/Onboarding**
- 3-step interactive tutorial on first launch:
  1. Aim the ball (arrow keys or drag)
  2. Set power (spacebar or tap)
  3. Watch the pins fall!
- Skippable after first time
- Rewards 50 XP for completion

**7. Audio & Visual Polish**
- Sound effects:
  - Ball rolling
  - Pin collision
  - Strike celebration
  - Spare celebration
  - Gutter sound
  - Level up fanfare
  - Achievement unlock sound
  - UI clicks and hovers
- Background music (upbeat, loopable, mutable)
- Particle effects:
  - Pin explosions on strike
  - Sparkles on spare
  - Level-up confetti
  - Ball trails (based on ball type)
- Screen shake on big hits
- Smooth transitions between scenes

**8. UI/UX Improvements**
- Main menu with:
  - Play button (prominent)
  - Ball collection screen
  - Achievement screen
  - Settings (sound, music, difficulty)
  - Daily reward notification
- In-game HUD:
  - XP bar at top
  - Current level display
  - Achievement popup when earned
- Post-game screen:
  - XP earned breakdown
  - Level progress
  - Achievements earned this game
  - Play Again / Main Menu buttons

### Technical Architecture

**New Branch Strategy:**
```bash
git checkout -b feature/world-class-game
```

**Module Structure:**
```
src/
  systems/
    ProgressionSystem.js      # XP, levels, unlocks
    AchievementSystem.js      # Achievement tracking
    RewardSystem.js           # Daily login, rewards
    UnlockManager.js          # Ball/theme unlock state
  entities/
    BallCollection.js         # Ball stats and visuals
    ThemeManager.js           # Lane theme rendering
  scenes/
    MainMenuScene.js          # New main menu
    TutorialScene.js          # Onboarding
    BallSelectionScene.js     # Choose ball before game
    AchievementScene.js       # View achievements
    PostGameScene.js          # Enhanced results with XP
  audio/
    SoundManager.js           # Sound effect management
    MusicManager.js           # Background music
  data/
    balls.json                # Ball definitions
    themes.json               # Theme definitions
    achievements.json         # Achievement definitions
    progression.json          # Level requirements and rewards
```

**Data Persistence:**
- **Phase 1 (Local Development):** localStorage for rapid iteration
- **Phase 2+ (Cloud Deployment):** Backend API with database
- **Architecture:** Build data layer with abstraction (StorageAdapter pattern) to swap localStorage → API calls without changing game logic
- **Cloud-ready from start:** Containerized deployment (Docker), environment-based config, API-first design

**Save data structure:**
  - Player XP and level
  - Unlocked balls and themes
  - Achievement progress
  - Daily login streak
  - Last login timestamp
- JSON structure for save data
- Import/export save data feature (for backup)

**Asset Requirements:**
- Ball sprites/textures (10 unique designs)
- Lane theme backgrounds (5 themes)
- Particle effect sprites
- Sound effects (10-15 sounds)
- Background music track (1-2 loops)
- UI icons (achievements, buttons)

---

## Risks and Unknowns

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scope creep (trying to add too much) | High | High | Strict Phase 1 scope, defer Phase 2/3 features |
| Asset creation time (art, sound) | Medium | Medium | Use placeholder assets initially, polish later; consider free asset libraries |
| localStorage limitations (data loss) | Low | Medium | Add export/import save feature, warn users about browser data clearing |
| Performance with particles/effects | Low | Medium | Test on lower-end devices, add graphics quality settings |
| Balancing progression (too fast/slow) | Medium | High | Playtest with target age group, adjust XP curves based on feedback |
| Retention not improving despite features | Medium | High | Implement analytics to track engagement metrics, iterate based on data |
| Parent concerns about "addictive" mechanics | Low | Medium | Avoid dark patterns, add playtime limits, transparent progression |

**Resolved Questions:**
1. ✓ 100% free (no IAP), evaluate monetization later
2. ✓ Build for cloud deployment from start (containerized, backend-ready architecture)
3. ✓ Target: Roblox-level engagement (chart-topping = top web game portals, high retention)
4. ✓ Online multiplayer in Phase 3
5. ✓ Simple age gate and parental controls in Phase 2

---

## Key Decisions

**Platform:** Web browser (current), potential mobile port later
**Scope:** Phased approach — MVP+ (Phase 1) first, iterate based on metrics
**Progression:** XP-based leveling with 30 levels, unlockable balls and themes
**Monetization:** Free-to-play, no IAP in Phase 1 (evaluate later)
**Data Storage:** localStorage (no backend required for Phase 1)
**Asset Strategy:** Placeholder assets initially, polish with custom art/sound
**Branching:** New feature branch (`feature/world-class-game`), preserve current game on `main`
**Target Metrics:** 
  - Day 1 retention >20%
  - Average session length >15 minutes
  - 50%+ of players reach level 5
  - 20%+ of players return for 7-day streak

---

## Next Steps

1. **Create planning context folder** (`docs/planning/context-world-class-game/`)
2. **Scope Phase 1 into epics and features** (progression, unlockables, achievements, audio/visual, UI/UX)
3. **Create feature branch** (`feature/world-class-game`)
4. **Design data schemas** (balls.json, themes.json, achievements.json, progression.json, save data structure)
5. **Gather/create placeholder assets** (ball sprites, theme backgrounds, sounds)
6. **Implement core systems** (ProgressionSystem, AchievementSystem, UnlockManager)
7. **Build new scenes** (MainMenuScene, TutorialScene, BallSelectionScene)
8. **Integrate systems into GameScene** (XP tracking, achievement triggers)
9. **Add audio and visual polish** (SoundManager, particle effects)
10. **Playtest with target age group** (kids 7-12)
11. **Iterate based on feedback** (adjust XP curves, unlock pacing, difficulty)
12. **Prepare for release** (hosting, marketing, app store submission if mobile)

---

## Success Criteria

**Phase 1 is successful if:**
- Game has all core engagement systems (progression, unlockables, achievements, daily rewards)
- Players can see visible progress every session
- Retention metrics improve significantly over current game
- Kids aged 7-12 find it fun and want to keep playing
- Parents approve of the game (safe, age-appropriate)
- Codebase remains maintainable and testable
- Current game on `main` branch is preserved and functional

**Long-term success (chart-topping):**
- Day 1 retention >25%
- Day 7 retention >10%
- Average session length >20 minutes
- Organic sharing and word-of-mouth growth
- Positive reviews from kids and parents
- Featured on game portals or app stores
- Potential for monetization (if desired) without compromising experience
