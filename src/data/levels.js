/**
 * levels.js
 * --------------------------------------------------------------------------
 * Generates 30 unique, deterministic maze levels using a seeded PRNG and
 * recursive-backtracking algorithm.  Each level stores its grid, start / end
 * coordinates, the BFS shortest-path length, and the allowed move budget.
 *
 * Difficulty progression:
 *   Levels  1-5  : 5×5 logical  (11×11 grid) — generous surplus
 *   Levels  6-10 : 6×6 logical  (13×13 grid) — moderate surplus
 *   Levels 11-15 : 7×7 logical  (15×15 grid) — tight surplus
 *   Levels 16-20 : 8×8 logical  (17×17 grid) — very tight
 *   Levels 21-25 : 9×9 logical  (19×19 grid) — near-perfect
 *   Levels 26-30 : 10×10 logical (21×21 grid) — perfect path only
 * --------------------------------------------------------------------------
 */

/* ===== Seeded PRNG (Mulberry32) ===== */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ===== Maze generator — iterative recursive-backtracking ===== */
function generateMaze(logicalW, logicalH, seed) {
  const rng = mulberry32(seed);
  const gridW = 2 * logicalW + 1;
  const gridH = 2 * logicalH + 1;

  // Initialise grid: every cell is a wall (1)
  const grid = [];
  for (let r = 0; r < gridH; r++) {
    grid[r] = new Array(gridW).fill(1);
  }

  // Visited tracker for logical cells
  const visited = [];
  for (let r = 0; r < logicalH; r++) {
    visited[r] = new Array(logicalW).fill(false);
  }

  // Directions: [dx, dy]
  const DIRS = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  // Start carving from (0, 0)
  const stack = [[0, 0]];
  visited[0][0] = true;
  grid[1][1] = 0;

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];

    // Collect unvisited neighbours
    const neighbours = [];
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (
        nx >= 0 &&
        nx < logicalW &&
        ny >= 0 &&
        ny < logicalH &&
        !visited[ny][nx]
      ) {
        neighbours.push([nx, ny, dx, dy]);
      }
    }

    if (neighbours.length > 0) {
      // Pick a random neighbour
      const idx = Math.floor(rng() * neighbours.length);
      const [nx, ny, dx, dy] = neighbours[idx];

      // Carve the wall between current cell and neighbour
      grid[2 * cy + 1 + dy][2 * cx + 1 + dx] = 0;
      // Carve the neighbour cell itself
      grid[2 * ny + 1][2 * nx + 1] = 0;

      visited[ny][nx] = true;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  return grid;
}

/* ===== BFS shortest path ===== */
function bfs(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [[start.row, start.col, 0]];
  const seen = new Set();
  seen.add(`${start.row},${start.col}`);

  const DIRS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();
    if (r === end.row && c === end.col) return dist;

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] === 0 &&
        !seen.has(key)
      ) {
        seen.add(key);
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return -1; // unreachable (should never happen for valid mazes)
}

/* ===== Level configuration table ===== */
const LEVEL_CONFIGS = [
  // --- Levels 1–5: Small (5×5) ---
  { w: 5, h: 5, seed: 42, extra: 0.60, name: 'First Steps' },
  { w: 5, h: 5, seed: 137, extra: 0.50, name: 'Easy Path' },
  { w: 5, h: 5, seed: 256, extra: 0.40, name: 'Gentle Curves' },
  { w: 5, h: 5, seed: 389, extra: 0.35, name: 'Warming Up' },
  { w: 5, h: 5, seed: 512, extra: 0.30, name: 'Open Field' },

  // --- Levels 6–10: Medium (6×6) ---
  { w: 6, h: 6, seed: 623, extra: 0.30, name: 'The Garden' },
  { w: 6, h: 6, seed: 741, extra: 0.25, name: 'Winding Way' },
  { w: 6, h: 6, seed: 867, extra: 0.20, name: 'Fork Road' },
  { w: 6, h: 6, seed: 933, extra: 0.15, name: 'Twisted Path' },
  { w: 6, h: 6, seed: 1042, extra: 0.12, name: 'Narrow Escape' },

  // --- Levels 11–15: Large (7×7) ---
  { w: 7, h: 7, seed: 1111, extra: 0.15, name: 'The Labyrinth' },
  { w: 7, h: 7, seed: 1234, extra: 0.12, name: 'Deep Tunnels' },
  { w: 7, h: 7, seed: 1389, extra: 0.10, name: 'Dark Corridors' },
  { w: 7, h: 7, seed: 1456, extra: 0.08, name: 'Lost Passage' },
  { w: 7, h: 7, seed: 1567, extra: 0.05, name: 'Ancient Ruins' },

  // --- Levels 16–20: Expert (8×8) ---
  { w: 8, h: 8, seed: 1678, extra: 0.10, name: 'The Dungeon' },
  { w: 8, h: 8, seed: 1789, extra: 0.07, name: 'Crystal Cave' },
  { w: 8, h: 8, seed: 1890, extra: 0.05, name: 'Iron Maze' },
  { w: 8, h: 8, seed: 1945, extra: 0.03, name: 'Shadow Keep' },
  { w: 8, h: 8, seed: 2020, extra: 0.01, name: 'Precision' },

  // --- Levels 21–25: Master (9×9) ---
  { w: 9, h: 9, seed: 2111, extra: 0.06, name: 'Expert Trial' },
  { w: 9, h: 9, seed: 2222, extra: 0.04, name: 'Mind Bender' },
  { w: 9, h: 9, seed: 2345, extra: 0.02, name: 'Razor Edge' },
  { w: 9, h: 9, seed: 2456, extra: 0.01, name: 'No Mercy' },
  { w: 9, h: 9, seed: 2567, extra: 0.00, name: 'Perfect Path' },

  // --- Levels 26–30: Grandmaster (10×10) ---
  { w: 10, h: 10, seed: 2678, extra: 0.03, name: 'Master Class' },
  { w: 10, h: 10, seed: 2789, extra: 0.02, name: 'Grand Maze' },
  { w: 10, h: 10, seed: 2890, extra: 0.01, name: 'Final Frontier' },
  { w: 10, h: 10, seed: 2945, extra: 0.00, name: 'Omega' },
  { w: 10, h: 10, seed: 3000, extra: 0.00, name: 'Serpent Master' },
];

/* ===== Build level data ===== */
export const levels = LEVEL_CONFIGS.map((cfg, i) => {
  const grid = generateMaze(cfg.w, cfg.h, cfg.seed);
  const start = { row: 1, col: 1 };
  const end = { row: grid.length - 2, col: grid[0].length - 2 };
  const shortestPath = bfs(grid, start, end);
  const extraMoves = Math.ceil(shortestPath * cfg.extra);
  const maxMoves = shortestPath + extraMoves;

  return {
    id: i + 1,
    name: cfg.name,
    grid,
    start,
    end,
    maxMoves,
    shortestPath,
    rows: grid.length,
    cols: grid[0].length,
  };
});
