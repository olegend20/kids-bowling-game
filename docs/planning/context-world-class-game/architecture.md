# Architecture — World-Class Kids Bowling Game

## System Overview

Transform existing bowling game into engagement-driven experience with progression, unlockables, achievements, and rewards.

## Core Systems

### 1. Progression System
**Responsibility:** Track player XP, levels, and level-up rewards

**Key Components:**
- XP calculation (based on score, strikes, spares, achievements)
- Level requirements (exponential curve: level N requires N * 100 XP)
- Level-up rewards (unlock balls, themes, XP bonuses)
- Progress persistence (localStorage)

**Data Schema:**
```json
{
  "currentXP": 0,
  "currentLevel": 1,
  "totalXP": 0,
  "xpToNextLevel": 100
}
```

### 2. Achievement System
**Responsibility:** Track achievement progress and unlock achievements

**Key Components:**
- Achievement definitions (20 achievements in Phase 1)
- Progress tracking (counters for strikes, spares, games played, etc.)
- Unlock detection (check conditions after each game)
- Achievement notifications (popup during gameplay)

**Data Schema:**
```json
{
  "achievements": {
    "first_strike": { "unlocked": true, "unlockedAt": "2026-02-16T10:30:00Z" },
    "perfect_game": { "unlocked": false, "progress": 0 }
  },
  "stats": {
    "totalStrikes": 45,
    "totalSpares": 78,
    "gamesPlayed": 23,
    "pinsKnocked": 1234,
    "perfectGames": 0
  }
}
```

### 3. Unlock Manager
**Responsibility:** Manage unlocked balls and themes

**Key Components:**
- Ball definitions (stats: power, control, spin; visuals: sprite, trail effect)
- Theme definitions (background, lane colors, pin colors)
- Unlock conditions (level requirements)
- Selection state (current ball, current theme)

**Data Schema:**
```json
{
  "unlockedBalls": ["starter", "power_ball", "control_ball"],
  "unlockedThemes": ["classic", "space"],
  "selectedBall": "power_ball",
  "selectedTheme": "space"
}
```

### 4. Reward System
**Responsibility:** Daily login rewards and streak tracking

**Key Components:**
- Daily login detection (compare last login timestamp)
- Streak calculation (consecutive days)
- Reward distribution (XP, unlocks)
- Streak reset logic (missed day)

**Data Schema:**
```json
{
  "lastLoginDate": "2026-02-16",
  "currentStreak": 5,
  "longestStreak": 12,
  "dailyRewardClaimed": true
}
```

### 5. Sound Manager
**Responsibility:** Play sound effects and manage audio settings

**Key Components:**
- Sound effect library (ball roll, pin hit, strike, spare, gutter, level up, achievement)
- Volume control
- Mute toggle
- Sound pooling (for performance)

### 6. Music Manager
**Responsibility:** Background music playback

**Key Components:**
- Music track loading
- Loop control
- Volume control
- Mute toggle
- Fade in/out

## Scene Architecture

### New Scenes

**MainMenuScene:**
- Play button (start game)
- Ball collection button
- Achievement button
- Settings button
- Daily reward notification (if unclaimed)
- Player level and XP bar display

**TutorialScene:**
- 3-step interactive tutorial
- Skip button (after first completion)
- Reward on completion (50 XP)

**BallSelectionScene:**
- Grid of unlocked balls
- Ball stats display (power, control, spin)
- Preview animation
- Select button
- Back to menu button

**AchievementScene:**
- Grid of achievements (unlocked + locked)
- Progress bars for in-progress achievements
- Achievement details on hover/tap
- Back to menu button

**PostGameScene (Enhanced):**
- Final score
- XP earned breakdown (base score, strikes, spares, achievements)
- Level progress bar animation
- Level-up celebration (if leveled up)
- Achievements earned this game
- Play Again / Main Menu buttons

### Modified Scenes

**GameScene:**
- Integrate ProgressionSystem (track XP-earning actions)
- Integrate AchievementSystem (trigger achievement checks)
- Integrate SoundManager (play sound effects)
- Integrate MusicManager (background music)
- Add particle effects (strike explosions, ball trails)
- Add screen shake on big hits

**ResultsScene:**
- Replace with PostGameScene (enhanced version)

## Data Flow

```
Game Start
  ↓
MainMenuScene loads save data from localStorage
  ↓
Player selects ball (BallSelectionScene)
  ↓
GameScene starts with selected ball and theme
  ↓
During gameplay:
  - Track XP-earning actions (strikes, spares, score)
  - Track achievement progress (counters)
  - Play sound effects
  - Show particle effects
  ↓
Game ends
  ↓
PostGameScene:
  - Calculate XP earned
  - Update ProgressionSystem (add XP, check level-up)
  - Update AchievementSystem (check unlocks)
  - Update stats (games played, pins knocked, etc.)
  - Save data to localStorage
  - Show XP earned, level progress, achievements
  ↓
Player returns to MainMenuScene or plays again
```

## Data Persistence

**Cloud-Ready Architecture (StorageAdapter Pattern):**

```javascript
// Abstract storage interface
class StorageAdapter {
  async savePlayerData(playerId, data) { throw new Error('Not implemented'); }
  async loadPlayerData(playerId) { throw new Error('Not implemented'); }
  async saveSettings(playerId, settings) { throw new Error('Not implemented'); }
  async loadSettings(playerId) { throw new Error('Not implemented'); }
}

// Phase 1: localStorage implementation
class LocalStorageAdapter extends StorageAdapter {
  async savePlayerData(playerId, data) {
    localStorage.setItem(`bowling_save_${playerId}`, JSON.stringify(data));
  }
  async loadPlayerData(playerId) {
    const data = localStorage.getItem(`bowling_save_${playerId}`);
    return data ? JSON.parse(data) : null;
  }
  // ... settings methods
}

// Phase 2+: API implementation (swap without changing game logic)
class APIStorageAdapter extends StorageAdapter {
  constructor(apiUrl) {
    super();
    this.apiUrl = apiUrl;
  }
  async savePlayerData(playerId, data) {
    await fetch(`${this.apiUrl}/players/${playerId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  async loadPlayerData(playerId) {
    const response = await fetch(`${this.apiUrl}/players/${playerId}/save`);
    return response.json();
  }
  // ... settings methods
}

// Game uses adapter (swappable via config)
const storage = CONFIG.USE_API 
  ? new APIStorageAdapter(CONFIG.API_URL)
  : new LocalStorageAdapter();
```

**Environment Configuration:**

```javascript
// src/config/environment.js
const ENV = {
  development: {
    USE_API: false,
    API_URL: 'http://localhost:3000/api',
    STORAGE_ADAPTER: 'localStorage'
  },
  production: {
    USE_API: true,
    API_URL: 'https://api.bowlinggame.com/api',
    STORAGE_ADAPTER: 'api'
  }
};

export const CONFIG = ENV[process.env.NODE_ENV || 'development'];
```

**Save data structure:**
```json
{
  "version": "1.0.0",
  "progression": { "currentXP": 0, "currentLevel": 1, "totalXP": 0 },
  "unlocks": { "balls": ["starter"], "themes": ["classic"] },
  "selected": { "ball": "starter", "theme": "classic" },
  "achievements": { "first_strike": { "unlocked": false } },
  "stats": { "totalStrikes": 0, "totalSpares": 0, "gamesPlayed": 0 },
  "rewards": { "lastLoginDate": "2026-02-16", "currentStreak": 0 },
  "settings": { "soundVolume": 1.0, "musicVolume": 0.7, "soundMuted": false, "musicMuted": false }
}
```

**Save/load strategy:**
- Load on MainMenuScene create
- Save after every game (PostGameScene)
- Save on settings change
- Export/import feature for backup (future)

## Asset Organization

```
assets/
  balls/
    starter.png
    power_ball.png
    control_ball.png
    spin_ball.png
    fire_ball.png
    ice_ball.png
    rainbow_ball.png
    bomb_ball.png
    golden_ball.png
    cosmic_ball.png
  themes/
    classic_bg.png
    space_bg.png
    candy_bg.png
    neon_bg.png
    jungle_bg.png
  sounds/
    ball_roll.mp3
    pin_hit.mp3
    strike.mp3
    spare.mp3
    gutter.mp3
    level_up.mp3
    achievement.mp3
    ui_click.mp3
    ui_hover.mp3
  music/
    background_loop.mp3
  particles/
    spark.png
    confetti.png
    trail.png
  ui/
    achievement_icons/
      first_strike.png
      perfect_game.png
      ...
```

## Deployment Architecture

### Phase 1: Local Development
```
┌─────────────────────────────────────┐
│  Browser (Client)                   │
│  ┌───────────────────────────────┐  │
│  │ Phaser Game                   │  │
│  │ └─ StorageAdapter             │  │
│  │    └─ LocalStorageAdapter     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Phase 2+: Cloud Deployment
```
┌─────────────────────────────────────┐
│  Browser (Client)                   │
│  ┌───────────────────────────────┐  │
│  │ Phaser Game                   │  │
│  │ └─ StorageAdapter             │  │
│  │    └─ APIStorageAdapter       │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ HTTPS
               ↓
┌─────────────────────────────────────┐
│  Cloud (AWS/GCP/Azure)              │
│  ┌───────────────────────────────┐  │
│  │ Load Balancer                 │  │
│  └───────────┬───────────────────┘  │
│              ↓                       │
│  ┌───────────────────────────────┐  │
│  │ API Server (Node.js/Express)  │  │
│  │ - Player data endpoints       │  │
│  │ - Leaderboard endpoints       │  │
│  │ - Multiplayer matchmaking     │  │
│  └───────────┬───────────────────┘  │
│              ↓                       │
│  ┌───────────────────────────────┐  │
│  │ Database (PostgreSQL/MongoDB) │  │
│  │ - Player profiles             │  │
│  │ - Save data                   │  │
│  │ - Leaderboards                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Containerization (Docker)

**Frontend Container (Nginx + Static Assets):**
```dockerfile
# Dockerfile.client
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Container (Node.js API):**
```dockerfile
# Dockerfile.server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server/ ./
EXPOSE 3000
CMD ["node", "index.js"]
```

**Docker Compose (Local Development):**
```yaml
# docker-compose.yml
version: '3.8'
services:
  client:
    build:
      context: .
      dockerfile: Dockerfile.client
    ports:
      - "8080:80"
    depends_on:
      - api
  
  api:
    build:
      context: .
      dockerfile: Dockerfile.server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/bowling
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=bowling
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

### Cloud Deployment Options

**Option 1: AWS**
- **Frontend:** S3 + CloudFront (static hosting + CDN)
- **Backend:** ECS (Fargate) or Lambda (serverless)
- **Database:** RDS (PostgreSQL) or DynamoDB
- **Multiplayer:** API Gateway + WebSockets (Lambda)

**Option 2: Google Cloud Platform**
- **Frontend:** Cloud Storage + Cloud CDN
- **Backend:** Cloud Run (containerized)
- **Database:** Cloud SQL (PostgreSQL) or Firestore
- **Multiplayer:** Cloud Functions + Firestore real-time

**Option 3: Azure**
- **Frontend:** Azure Storage + Azure CDN
- **Backend:** Azure Container Instances or App Service
- **Database:** Azure Database for PostgreSQL or Cosmos DB
- **Multiplayer:** Azure Functions + SignalR

**Recommendation:** Start with Docker Compose locally, deploy to AWS ECS (Fargate) + RDS for simplicity and scalability.

## Technical Constraints

- **Performance:** Target 60fps on tablets, minimize particle count if needed
- **File size:** Keep total asset size <10MB for fast loading
- **Browser compatibility:** Test on Chrome, Safari, Firefox, Edge
- **Mobile support:** Touch-friendly UI, responsive layout
- **Accessibility:** Colorblind-friendly themes, adjustable text size (future)

## Testing Strategy

- **Unit tests:** ProgressionSystem, AchievementSystem, UnlockManager, RewardSystem
- **Integration tests:** Scene transitions, save/load, XP calculation, achievement unlocking
- **E2E tests:** Full game flow (tutorial → game → post-game → menu)
- **Playtesting:** Kids aged 7-12 for engagement and difficulty balance

## Migration Strategy

**Current game → World-class game:**
1. Create feature branch `feature/world-class-game`
2. Preserve all existing code (no deletions)
3. Add new systems as separate modules
4. Add new scenes alongside existing scenes
5. Modify GameScene to integrate new systems (non-breaking changes)
6. Test thoroughly before merging
7. Keep `main` branch as fallback

**Rollback plan:**
- If Phase 1 doesn't improve metrics, revert to `main` branch
- If bugs are critical, hotfix on `main`, backport to feature branch
