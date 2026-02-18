# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Cloud-ready data architecture (Documents-qrl.1)
  - StorageAdapter interface for pluggable storage backends
  - LocalStorageAdapter implementation for Phase 1
  - Environment configuration system for dev/prod switching
  - Save data schema with versioning support for future migrations
  - Comprehensive BDD tests with Given-When-Then structure
- Progression system with XP and levels (Documents-qrl.2)
  - XP earned from score, strikes, and spares
  - 30 levels with exponential XP curve (level N = N × 100 XP)
  - Level-up detection triggers unlock rewards
- Unlockable balls with stats (Documents-qrl.3)
  - 10 unique balls with distinct stats (speed, control, spin)
  - Balls unlock at specific levels (1, 3, 5, 8, 10, 12, 15, 18, 22, 30)
  - Ball selection screen shows unlocked/locked balls
  - Ball stats affect gameplay physics (density, friction, restitution)
  - Visual customization with colors and trail effects
  - Progress bar UI showing XP to next level
  - Level-up celebration event system
  - Integration with UnlockManager for reward unlocking
