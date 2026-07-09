// Stratum seamless pattern generator
// ------------------------------------------------------------------
// The seed glyph is a convex pentagon that tessellates the plane as a
// p2 wallpaper tiling (translations + 180° rotations).
//
//   • A "pair" = the seed + a copy rotated 180° about the midpoint of
//     its right slant. That pair is a centrally-symmetric hexagon
//     (a parallelogon), which tiles the plane by pure translation.
//   • Stamp the pair at every lattice point  i·u + j·v.
//
// Run:  node generate-pattern.mjs > stratum-pattern.svg
// Tweak COLS/ROWS to grow the field, or STROKE/INK/BG for colourways.
// ------------------------------------------------------------------
import { writeFileSync } from 'node:fs';

// --- Seed (centreline path from stratum-pattern-seed.svg) ---
const SEED =
  'M236.609 12L239.927 18.6338L394.927 328.634L403.609 346H58.166L54.8486 339.366' +
  'L16.0986 261.866L13.416 256.5L16.0986 251.134L132.349 18.6338L135.666 12H236.609Z' +
  'M132.359 244.5H239.915L186.137 136.943L132.359 244.5Z';

// 180° rotation about the right-slant midpoint (320.109, 179):
// p -> 2*centre - p  ==  matrix(-1 0 0 -1  640.218 358)
const ROT180 = 'matrix(-1 0 0 -1 640.218 358)';

// Translation lattice (derived from the parallelogon pair)
const U = [491.136, 89.5];   // band step
const V = [77.5, -334];      // row step

// --- Knobs ---
const COLS = 8;
const ROWS = 8;
const STROKE = 24;           // matches the seed's stroke-width
const INK = '#7d34ff';       // amethyst brand accent
const BG = '#0f0f0f';        // near-black surface

// Field extent — the lattice is oblique, so overscan generously on every
// side to guarantee the rectangular crop below is fully covered.
const minI = -ROWS - 2, maxI = COLS + 2;
const minJ = -2, maxJ = ROWS + 2;

let uses = '';
for (let j = minJ; j <= maxJ; j++) {
  for (let i = minI; i <= maxI; i++) {
    const tx = (i * U[0] + j * V[0]).toFixed(3);
    const ty = (i * U[1] + j * V[1]).toFixed(3);
    uses += `  <use href="#pair" transform="translate(${tx} ${ty})"/>\n`;
  }
}

// Viewport: crop a clean rectangle out of the interior of the field
const W = COLS * U[0];
const H = -ROWS * V[1];               // V has negative y
const x0 = V[0] * ROWS * 0.5;         // nudge so the crop sits inside the field
const y0 = V[1] * ROWS;

const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(W)}" height="${Math.round(H)}" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}">
  <rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" fill="${BG}"/>
  <defs>
    <g id="pair" fill="none" stroke="${INK}" stroke-width="${STROKE}" stroke-linejoin="miter" stroke-miterlimit="10">
      <path d="${SEED}"/>
      <path d="${SEED}" transform="${ROT180}"/>
    </g>
  </defs>
${uses}</svg>`;

writeFileSync(new URL('./stratum-pattern.svg', import.meta.url), svg);
console.error('wrote stratum-pattern.svg');
