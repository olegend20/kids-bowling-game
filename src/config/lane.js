// Lane layout constants — all positions derived from these values,
// never hardcoded in individual files.

const LANE = {
  x: 100,          // left edge of lane (including gutter)
  width: 280,      // total lane width (gutters + play area)
  gutterWidth: 30, // width of each gutter zone
  height: 800,     // full canvas height

  get playLeft()  { return this.x + this.gutterWidth; },              // 130
  get playRight() { return this.x + this.width - this.gutterWidth; }, // 350
  get playWidth() { return this.width - 2 * this.gutterWidth; },      // 220
  get centerX()   { return this.x + this.width / 2; },                // 240
  get rightEdge() { return this.x + this.width; },                    // 380
};

// Pin positions in the standard triangle formation.
// Row 1 (head pin) is closest to the bowler (bottom of screen),
// Row 4 (back row) is furthest away (top of screen).
const PIN_SPACING   = 30;  // horizontal gap between pin centres in a row
const PIN_HEAD_Y    = 255; // y-coordinate of the head pin (row 1)
const PIN_ROW_STEP  = -35; // y delta per row upward (negative = towards top)

function getPinPositions() {
  const cx = LANE.centerX;
  const s  = PIN_SPACING;
  const y  = (row) => PIN_HEAD_Y + (row - 1) * PIN_ROW_STEP;

  return [
    // Row 1 — head pin
    { x: cx,            y: y(1) },
    // Row 2
    { x: cx - s / 2,    y: y(2) },
    { x: cx + s / 2,    y: y(2) },
    // Row 3
    { x: cx - s,        y: y(3) },
    { x: cx,            y: y(3) },
    { x: cx + s,        y: y(3) },
    // Row 4 — back row
    { x: cx - 1.5 * s,  y: y(4) },
    { x: cx - 0.5 * s,  y: y(4) },
    { x: cx + 0.5 * s,  y: y(4) },
    { x: cx + 1.5 * s,  y: y(4) },
  ];
}
