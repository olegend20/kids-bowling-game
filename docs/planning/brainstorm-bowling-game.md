# Brainstorm: Kids Bowling Game

**Date:** 2026-02-13
**Status:** brainstormed

---

## Problem Statement

Build a fun, arcade-style bowling game for kids aged 7–12 that runs in the web browser. Inspired by Super Bowling (SNES) — cartoony visuals, top-down perspective, satisfying physics, and simple enough controls that kids can pick it up immediately.

---

## User Perspective

**Who:** Kids aged 7–12 (and their parent/family).
**Context:** Playing on a computer or tablet browser at home.
**What they want:**
- Instant fun — no tutorials, no friction
- Satisfying pin-knock physics and animations
- Playable with friends/siblings (multiplayer pass-the-keyboard or hotseat)
- Colorful, energetic visual style

**What success looks like:**
- Kids can start bowling within 10 seconds of loading the page
- Ball aims and rolls intuitively
- Pins fly satisfyingly when hit
- Score is tracked automatically
- Replayable — kids want to play again

---

## Technical Approaches Explored

### Option A: Vanilla HTML5 Canvas + custom physics (scratch)
- Full control, minimal dependencies
- Physics from scratch (ball movement, pin collision) — significant effort
- No framework overhead
- **Risk:** Pin collision detection is non-trivial; could get buggy

### Option B: Phaser.js (2D game framework) + Matter.js physics
- Phaser is the de-facto standard for browser 2D games
- Matter.js is a solid 2D rigid body physics engine, ships as Phaser plugin
- Top-down bowling is a well-trodden use case for 2D physics
- Large community, good docs, many examples
- **Recommended** ✓

### Option C: Three.js / Babylon.js (3D)
- Would enable behind-the-ball perspective
- Far more complex — camera, 3D assets, 3D physics
- Overkill for a kids top-down game
- **Rejected** — user chose top-down 2D

### Option D: Godot (exported to web)
- Excellent game engine, great for 2D
- Exports to WebAssembly/HTML5
- Larger build size, less familiar to web devs
- **Rejected** — web-native JS stack is simpler to build and deploy

---

## Core Gameplay Design

### Top-Down View
- Lane rendered from above: gutter lines, lane markers, pin dots
- Ball starts at bottom of screen, rolls toward pins at top
- Standard 10-pin triangle formation

### Controls (keyboard + mouse/touch)
- **Aim:** Left/right arrow keys or drag to angle the shot
- **Power:** Hold spacebar / click-and-hold to charge power meter
- **Spin:** Optional — left/right curve with Q/E or swipe

### Pin Physics
- 10 pins modeled as circular rigid bodies
- Ball is a larger circle with higher mass
- Matter.js handles collisions naturally
- Pins that leave the lane area are "knocked down"

### Scoring
- Standard bowling scoring: strikes, spares, 10th frame rules
- Visual scoreboard showing current frame and running total
- Animated feedback: "STRIKE!", "SPARE!", "GUTTER!"

### Game Modes (MVP)
1. **1-Player** — full 10-frame game, score tracking
2. **2-Player Hotseat** — pass keyboard between players, alternating turns

### Stretch Goals (post-MVP)
- Multiple characters with different stats
- Lane themes (space, jungle, candy)
- Golf Mode (knock down specific pins)
- Sound effects and music

---

## Risks & Unknowns

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Pin physics feeling "off" | Medium | Tune mass/friction/restitution in Matter.js; use established presets |
| 10th frame scoring logic complexity | Medium | Implement and test scoring in isolation before wiring to UI |
| Touch/mobile support | Low-Medium | Phaser has built-in touch input; test early |
| Performance on older tablets | Low | 2D canvas is lightweight; stay within 60fps budget |

---

## Recommended Direction

**Build a web browser bowling game using Phaser 3 + Matter.js physics.**

- Top-down lane view
- Keyboard + mouse controls
- 10-pin standard bowling with full scoring
- 1-player and 2-player hotseat
- Cartoony, colorful visual style using simple geometric shapes first (can upgrade to sprites later)
- MVP first: get the physics and scoring right, then layer in polish

**Tech stack:**
- Phaser 3 (game framework)
- Matter.js (physics, via Phaser plugin)
- Vanilla JS or TypeScript
- No build tool required for MVP (single HTML + script tags); can add Vite later

---

## Open Questions

1. Should the MVP use geometric shapes (circles/rectangles) or hand-drawn sprites? Shapes are faster to build; sprites look better.
2. Sound effects — browser Audio API or a library like Howler.js?
3. Does the parent want to host this somewhere (GitHub Pages, Netlify) or just run locally?

---

## Key Decisions

- **Platform:** Web browser
- **Perspective:** Top-down 2D
- **Framework:** Phaser 3 + Matter.js
- **Scope:** MVP = 1-player + 2-player hotseat, standard 10-pin scoring
- **Target age:** 7–12, standard arcade difficulty
