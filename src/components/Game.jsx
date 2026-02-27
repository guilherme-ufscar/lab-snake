import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { levels } from '../data/levels';
import GameCanvas from './GameCanvas';
import HUD from './HUD';
import Modal from './Modal';

/* ===== Swipe detection constants ===== */
const SWIPE_THRESHOLD = 20; // min px to register a swipe
const SWIPE_MAX_TIME = 400; // max ms for gesture duration

/**
 * Game — Main gameplay screen.
 * Manages snake movement, collision detection, win/lose logic,
 * swipe / touch controls, and delegates rendering to <GameCanvas />.
 */
export default function Game({ levelId, onBack, onComplete, onNextLevel }) {
  const level = levels[levelId - 1];

  // ── State ──
  const [snakePath, setSnakePath] = useState([{ ...level.start }]);
  const [direction, setDirection] = useState('right');
  const [movesLeft, setMovesLeft] = useState(level.maxMoves);
  const [gameStatus, setGameStatus] = useState('playing'); // playing | won | lost

  // ── Refs for swipe tracking ──
  const touchStart = useRef(null);
  const gameAreaRef = useRef(null);

  // ── Reset helper ──
  const resetLevel = useCallback(() => {
    setSnakePath([{ ...level.start }]);
    setDirection('right');
    setMovesLeft(level.maxMoves);
    setGameStatus('playing');
  }, [level]);

  // ── Movement handler ──
  const handleMove = useCallback(
    (dir) => {
      if (gameStatus !== 'playing') return;

      const head = snakePath[snakePath.length - 1];
      const delta = {
        up: [-1, 0],
        down: [1, 0],
        left: [0, -1],
        right: [0, 1],
      };
      const [dr, dc] = delta[dir];
      const newRow = head.row + dr;
      const newCol = head.col + dc;

      // Boundary check
      if (
        newRow < 0 ||
        newRow >= level.rows ||
        newCol < 0 ||
        newCol >= level.cols
      ) {
        return;
      }

      // Wall collision
      if (level.grid[newRow][newCol] === 1) return;

      // Valid move
      setDirection(dir);
      const newHead = { row: newRow, col: newCol };
      const newPath = [...snakePath, newHead];
      setSnakePath(newPath);

      const remaining = movesLeft - 1;
      setMovesLeft(remaining);

      // Win check
      if (newRow === level.end.row && newCol === level.end.col) {
        setGameStatus('won');
        onComplete(levelId);
        return;
      }

      // Lose check
      if (remaining <= 0) {
        setGameStatus('lost');
      }
    },
    [snakePath, movesLeft, gameStatus, level, levelId, onComplete]
  );

  // ── Keyboard input ──
  useEffect(() => {
    const keyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      W: 'up',
      s: 'down',
      S: 'down',
      a: 'left',
      A: 'left',
      d: 'right',
      D: 'right',
    };

    function onKeyDown(e) {
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
      // R to reset
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetLevel();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleMove, resetLevel]);

  // ── Swipe / touch gesture detection on game area ──
  useEffect(() => {
    const el = gameAreaRef.current;
    if (!el) return;

    function onTouchStart(e) {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    }

    function onTouchEnd(e) {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.time;
      touchStart.current = null;

      if (dt > SWIPE_MAX_TIME) return;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) return;

      if (absDx > absDy) {
        handleMove(dx > 0 ? 'right' : 'left');
      } else {
        handleMove(dy > 0 ? 'down' : 'up');
      }
    }

    // Prevent page scroll while swiping on the game area
    function onTouchMove(e) {
      e.preventDefault();
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [handleMove]);

  // ── Derived ──
  const movesUsed = level.maxMoves - movesLeft;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center py-4 px-4 relative no-select"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-[18rem] h-[18rem] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[15%] right-[25%] w-[14rem] h-[14rem] bg-purple-600/5 rounded-full blur-[80px]" />
      </div>

      {/* HUD */}
      <div className="relative z-10 w-full">
        <HUD
          levelName={level.name}
          levelId={levelId}
          movesLeft={movesLeft}
          maxMoves={level.maxMoves}
          onBack={onBack}
          onReset={resetLevel}
        />
      </div>

      {/* Swipeable game area wrapping canvas + dpad */}
      <div ref={gameAreaRef} className="relative z-10 flex flex-col items-center touch-none">
        {/* Canvas */}
        <div className="flex-shrink-0">
          <GameCanvas
            grid={level.grid}
            snakePath={snakePath}
            direction={direction}
            start={level.start}
            end={level.end}
          />
        </div>

        {/* Swipe hint (mobile only) */}
        <p className="mt-2 text-[0.65rem] text-gray-600 sm:hidden text-center">
          Swipe on the maze or use the buttons below
        </p>

        {/* D-Pad (mobile / on-screen controls) */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 w-44 sm:w-36">
          <div />
          <DPadBtn icon={<ChevronUp size={22} />} onPress={() => handleMove('up')} label="Up" />
          <div />
          <DPadBtn icon={<ChevronLeft size={22} />} onPress={() => handleMove('left')} label="Left" />
          <DPadBtn
            icon={<RotateCcw size={16} />}
            onPress={resetLevel}
            variant="secondary"
            label="Reset"
          />
          <DPadBtn icon={<ChevronRight size={22} />} onPress={() => handleMove('right')} label="Right" />
          <div />
          <DPadBtn icon={<ChevronDown size={22} />} onPress={() => handleMove('down')} label="Down" />
          <div />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {gameStatus === 'won' && (
          <Modal
            key="victory"
            type="victory"
            movesUsed={movesUsed}
            maxMoves={level.maxMoves}
            onRetry={resetLevel}
            onNext={onNextLevel}
            onLevels={onBack}
          />
        )}
        {gameStatus === 'lost' && (
          <Modal
            key="defeat"
            type="defeat"
            movesUsed={movesUsed}
            maxMoves={level.maxMoves}
            onRetry={resetLevel}
            onLevels={onBack}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ===== D-Pad button helper ===== */
function DPadBtn({ icon, onPress, variant = 'primary', label = '' }) {
  return (
    <motion.button
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      className={`
        w-[3.25rem] h-[3.25rem] sm:w-11 sm:h-11 rounded-xl
        flex items-center justify-center transition-colors
        active:scale-90
        ${
          variant === 'secondary'
            ? 'glass text-gray-400 hover:text-white active:bg-white/15'
            : 'glass text-white/80 hover:bg-white/10 active:bg-white/20'
        }
      `}
      whileTap={{ scale: 0.82 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}
