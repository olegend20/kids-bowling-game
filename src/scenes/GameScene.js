class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this._drawLane();
    this._addWalls();
    this._spawnPins();
  }

  update() {
    if (this._pinManager) this._pinManager.update();
  }

  // ─── Rendering ───────────────────────────────────────────────────────────

  _drawLane() {
    const g = this.add.graphics();

    // Full lane background first (wood tone), then gutters overlay on top —
    // keeps draw order independent of edge-pixel rounding.
    g.fillStyle(0xd4a055, 1);
    g.fillRect(LANE.x, 0, LANE.width, LANE.height);

    // Gutter overlays (dark red-brown)
    g.fillStyle(0x4a2020, 1);
    g.fillRect(LANE.x, 0, LANE.gutterWidth, LANE.height);        // left gutter
    g.fillRect(LANE.playRight, 0, LANE.gutterWidth, LANE.height); // right gutter

    // Lane guide markers — four rectangular bars near ball launch zone
    g.fillStyle(0xb8863c, 1);
    const arrowY = 600;
    const arrowW = 6;
    const arrowH = 20;
    [-30, -10, 10, 30].forEach(offset => {
      g.fillRect(LANE.centerX + offset - arrowW / 2, arrowY, arrowW, arrowH);
    });

    // Pin spot markers — positions match PinManager.getPositions() exactly
    g.fillStyle(0xffffff, 0.6);
    for (const pos of PinManager.getPositions(LANE)) {
      g.fillCircle(pos.x, pos.y, 5);
    }
  }

  // ─── Pins ─────────────────────────────────────────────────────────────────

  _spawnPins() {
    this._pinManager = new PinManager(this);
    this._pinManager.spawn(LANE);
  }

  // ─── Physics walls ────────────────────────────────────────────────────────

  _addWalls() {
    const wallThickness = 10;
    const opts = { isStatic: true, label: 'wall' };

    // Left outer lane wall
    this.matter.add.rectangle(
      LANE.x - wallThickness / 2, LANE.height / 2,
      wallThickness, LANE.height,
      opts
    );
    // Right outer lane wall
    this.matter.add.rectangle(
      LANE.rightEdge + wallThickness / 2, LANE.height / 2,
      wallThickness, LANE.height,
      opts
    );
    // Back wall (top of lane)
    this.matter.add.rectangle(
      LANE.centerX, -wallThickness / 2,
      LANE.width + wallThickness * 2, wallThickness,
      opts
    );
    // Bottom boundary — prevents physics bodies from escaping off-screen
    this.matter.add.rectangle(
      LANE.centerX, LANE.height + wallThickness / 2,
      LANE.width + wallThickness * 2, wallThickness,
      opts
    );
  }
}
