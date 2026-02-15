# Context: Kids Bowling Game

**Status:** finalized
**Created:** 2026-02-13

## Problem
Build a fun, arcade-style top-down bowling game for kids aged 7–12, playable in the web browser. Inspired by Super Bowling (SNES) — cartoony visuals, satisfying physics, and instant playability.

## Approach
Phaser 3 + Matter.js physics engine. Top-down 2D lane. Keyboard/mouse controls. Standard 10-pin scoring. MVP covers 1-player and 2-player hotseat modes.

## Scope

**Type:** Epic (3 phases, 7 features, 16 tasks)

| Phase | Title | Features |
|-------|-------|----------|
| 1 | Playable Lane | Rolling ball + pin physics |
| 2 | Real Gameplay Loop | Power meter, frame loop, scoring |
| 3 | Polish + 2-Player | Hotseat mode, game over, visual/audio polish |

## Key Decisions
- Web browser target (no install friction)
- Top-down perspective (simpler than 3D, classic arcade feel)
- Phaser 3 chosen over vanilla canvas (physics, input, scene management built-in)
- MVP uses geometric shapes; sprites can come later
