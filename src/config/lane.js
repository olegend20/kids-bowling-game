// Lane layout constants — all positions derived from these values,
// never hardcoded in individual files.

const LANE = {
  x: 100,          // left edge of lane (including gutter)
  width: 280,      // total lane width (gutters + play area)
  gutterWidth: 30, // width of each gutter zone
  height: 800,     // full canvas height

  // Pin row geometry — used by PinManager.getPositions()
  pinHeadY:   255, // y of head pin (row 1, closest to bowler)
  pinRowStep: -35, // y delta per row toward top of screen (negative = up)

  get playLeft()  { return this.x + this.gutterWidth; },              // 130
  get playRight() { return this.x + this.width - this.gutterWidth; }, // 350
  get playWidth() { return this.width - 2 * this.gutterWidth; },      // 220
  get centerX()   { return this.x + this.width / 2; },                // 240
  get rightEdge() { return this.x + this.width; },                    // 380
};

// CJS export for Node.js test runner.
if (typeof module !== 'undefined') module.exports = { LANE };
