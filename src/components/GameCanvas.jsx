import { useRef, useEffect } from 'react';

/**
 * GameCanvas — Renders the maze, start/end markers, and snake using Canvas 2D.
 *
 * Props:
 *   grid       – 2D array (1 = wall, 0 = path)
 *   snakePath  – Array of {row, col} from tail → head
 *   direction  – 'up' | 'down' | 'left' | 'right'
 *   start      – {row, col}
 *   end        – {row, col}
 */
export default function GameCanvas({ grid, snakePath, direction, start, end }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Responsive cell sizing
    const maxDimension = Math.min(
      window.innerWidth - 32,
      window.innerHeight - 260,
      560
    );
    const rows = grid.length;
    const cols = grid[0].length;
    const cellSize = Math.floor(maxDimension / Math.max(rows, cols));
    const width = cols * cellSize;
    const height = rows * cellSize;

    // Apply DPR for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // ───── Draw maze ─────
    drawMaze(ctx, grid, cellSize, rows, cols);

    // ───── Draw start marker ─────
    drawStartMarker(ctx, start, cellSize);

    // ───── Draw end marker ─────
    drawEndMarker(ctx, end, cellSize);

    // ───── Draw snake ─────
    drawSnake(ctx, snakePath, cellSize, direction);
  }, [grid, snakePath, direction, start, end]);

  return (
    <div ref={containerRef} className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-2xl shadow-2xl shadow-black/40 border border-white/5"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRAWING HELPERS
   ═══════════════════════════════════════════════════════════ */

/** Portable rounded-rect helper */
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ───── Maze ───── */
function drawMaze(ctx, grid, cs, rows, cols) {
  // 1. Fill background with wall colour (deep indigo)
  const wallGrad = ctx.createLinearGradient(0, 0, cols * cs, rows * cs);
  wallGrad.addColorStop(0, '#1a1040');
  wallGrad.addColorStop(0.5, '#231555');
  wallGrad.addColorStop(1, '#1a1040');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, cols * cs, rows * cs);

  // 2. Draw floor (path) cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        const x = c * cs;
        const y = r * cs;

        // Floor base
        ctx.fillStyle = '#0e1629';
        ctx.fillRect(x, y, cs, cs);

        // Subtle grid line
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
      }
    }
  }

  // 3. Wall highlights / 3-D effect
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        const x = c * cs;
        const y = r * cs;

        // Subtle top-edge highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(x, y, cs, Math.max(1, cs * 0.08));

        // Bottom shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(x, y + cs - Math.max(1, cs * 0.08), cs, Math.max(1, cs * 0.08));

        // Inner subtle rounded block
        const inset = cs * 0.06;
        const grad = ctx.createLinearGradient(x, y, x, y + cs);
        grad.addColorStop(0, 'rgba(99, 70, 200, 0.12)');
        grad.addColorStop(1, 'rgba(30, 20, 80, 0.12)');
        ctx.fillStyle = grad;
        roundRect(ctx, x + inset, y + inset, cs - inset * 2, cs - inset * 2, cs * 0.15);
        ctx.fill();
      }
    }
  }
}

/* ───── Start marker ───── */
function drawStartMarker(ctx, pos, cs) {
  const cx = pos.col * cs + cs / 2;
  const cy = pos.row * cs + cs / 2;

  // Glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cs * 0.7);
  glow.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
  glow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, cs * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Diamond
  const s = cs * 0.18;
  ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.lineTo(cx + s, cy);
  ctx.lineTo(cx, cy + s);
  ctx.lineTo(cx - s, cy);
  ctx.closePath();
  ctx.fill();
}

/* ───── End marker ───── */
function drawEndMarker(ctx, pos, cs) {
  const cx = pos.col * cs + cs / 2;
  const cy = pos.row * cs + cs / 2;

  // Golden glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cs * 0.8);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.30)');
  glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, cs * 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Star
  const outerR = cs * 0.28;
  const innerR = cs * 0.12;
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Star highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR * 0.6 : innerR * 0.6;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/* ───── Snake ───── */
function drawSnake(ctx, path, cs, direction) {
  if (!path || path.length === 0) return;

  const bodyRadius = cs * 0.34;

  // --- Body connectors (thick rounded lines between segments) ---
  for (let i = 0; i < path.length - 1; i++) {
    const curr = path[i];
    const next = path[i + 1];
    const cx = curr.col * cs + cs / 2;
    const cy = curr.row * cs + cs / 2;
    const nx = next.col * cs + cs / 2;
    const ny = next.row * cs + cs / 2;

    // Taper factor (thinner toward tail)
    const t = path.length > 1 ? i / (path.length - 1) : 1;
    const thickness = bodyRadius * 2 * (0.55 + 0.45 * t);

    const g = Math.floor(140 + 90 * t);
    ctx.strokeStyle = `rgb(22, ${g}, 60)`;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.stroke();
  }

  // --- Body circles at each position ---
  for (let i = 0; i < path.length; i++) {
    const pos = path[i];
    const x = pos.col * cs + cs / 2;
    const y = pos.row * cs + cs / 2;

    const t = path.length > 1 ? i / (path.length - 1) : 1;
    const radius = bodyRadius * (0.55 + 0.45 * t);
    const g = Math.floor(140 + 90 * t);

    // Outer body
    ctx.fillStyle = `rgb(22, ${g}, 60)`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Scale texture on body (subtle darker circle inside)
    if (i < path.length - 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // Belly highlight
    ctx.fillStyle = `rgba(74, 222, 128, ${0.06 + 0.06 * t})`;
    ctx.beginPath();
    ctx.arc(x, y - radius * 0.15, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Head ---
  const head = path[path.length - 1];
  const hx = head.col * cs + cs / 2;
  const hy = head.row * cs + cs / 2;
  const headR = bodyRadius * 1.08;

  // Head glow
  const hGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, headR * 2);
  hGlow.addColorStop(0, 'rgba(74, 222, 128, 0.18)');
  hGlow.addColorStop(1, 'rgba(74, 222, 128, 0)');
  ctx.fillStyle = hGlow;
  ctx.beginPath();
  ctx.arc(hx, hy, headR * 2, 0, Math.PI * 2);
  ctx.fill();

  // Head body
  const headGrad = ctx.createRadialGradient(
    hx - headR * 0.2,
    hy - headR * 0.2,
    0,
    hx,
    hy,
    headR
  );
  headGrad.addColorStop(0, '#4ade80');
  headGrad.addColorStop(1, '#16a34a');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(hx, hy, headR, 0, Math.PI * 2);
  ctx.fill();

  // --- Eyes ---
  const eyeDist = headR * 0.48;
  const eyeR = headR * 0.22;
  const pupilR = eyeR * 0.55;
  let e1x, e1y, e2x, e2y;
  let pox = 0,
    poy = 0;

  switch (direction) {
    case 'up':
      e1x = hx - eyeDist; e1y = hy - eyeDist * 0.4;
      e2x = hx + eyeDist; e2y = hy - eyeDist * 0.4;
      poy = -pupilR * 0.35;
      break;
    case 'down':
      e1x = hx - eyeDist; e1y = hy + eyeDist * 0.4;
      e2x = hx + eyeDist; e2y = hy + eyeDist * 0.4;
      poy = pupilR * 0.35;
      break;
    case 'left':
      e1x = hx - eyeDist * 0.4; e1y = hy - eyeDist;
      e2x = hx - eyeDist * 0.4; e2y = hy + eyeDist;
      pox = -pupilR * 0.35;
      break;
    case 'right':
    default:
      e1x = hx + eyeDist * 0.4; e1y = hy - eyeDist;
      e2x = hx + eyeDist * 0.4; e2y = hy + eyeDist;
      pox = pupilR * 0.35;
      break;
  }

  // Eye whites
  ctx.fillStyle = '#f0fdf4';
  ctx.beginPath(); ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2); ctx.fill();

  // Pupils
  ctx.fillStyle = '#052e16';
  ctx.beginPath(); ctx.arc(e1x + pox, e1y + poy, pupilR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(e2x + pox, e2y + poy, pupilR, 0, Math.PI * 2); ctx.fill();

  // Pupil shine
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  const shineR = pupilR * 0.35;
  ctx.beginPath(); ctx.arc(e1x + pox - shineR * 0.5, e1y + poy - shineR * 0.5, shineR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(e2x + pox - shineR * 0.5, e2y + poy - shineR * 0.5, shineR, 0, Math.PI * 2); ctx.fill();

  // --- Tongue (small forked tongue in direction of movement) ---
  const tongueLen = headR * 0.7;
  const forkLen = headR * 0.2;
  let tx, ty, tdx, tdy;
  switch (direction) {
    case 'up':    tx = hx; ty = hy - headR; tdx = 0; tdy = -1; break;
    case 'down':  tx = hx; ty = hy + headR; tdx = 0; tdy = 1;  break;
    case 'left':  tx = hx - headR; ty = hy; tdx = -1; tdy = 0; break;
    case 'right': default: tx = hx + headR; ty = hy; tdx = 1; tdy = 0; break;
  }

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = Math.max(1, cs * 0.04);
  ctx.lineCap = 'round';

  // Main tongue
  const tipX = tx + tdx * tongueLen;
  const tipY = ty + tdy * tongueLen;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // Fork
  const perpX = -tdy;
  const perpY = tdx;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX + (tdx + perpX * 0.5) * forkLen, tipY + (tdy + perpY * 0.5) * forkLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX + (tdx - perpX * 0.5) * forkLen, tipY + (tdy - perpY * 0.5) * forkLen);
  ctx.stroke();
}
