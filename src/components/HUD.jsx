import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RotateCcw, Footprints } from 'lucide-react';

/**
 * HUD — Heads-up display floating above the game canvas.
 * Shows level info, move counter with animated transitions, and controls.
 */
export default function HUD({
  levelName,
  levelId,
  movesLeft,
  maxMoves,
  onBack,
  onReset,
}) {
  const ratio = maxMoves > 0 ? movesLeft / maxMoves : 0;

  // Colour interpolation: green → yellow → red
  let barColor = 'from-green-400 to-emerald-500';
  let textColor = 'text-green-400';
  if (ratio < 0.25) {
    barColor = 'from-red-400 to-rose-500';
    textColor = 'text-red-400';
  } else if (ratio < 0.5) {
    barColor = 'from-amber-400 to-orange-500';
    textColor = 'text-amber-400';
  }

  return (
    <div className="w-full max-w-[560px] mx-auto mb-4 px-2">
      {/* Top row: back · level name · reset */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          onClick={onBack}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Back to levels"
        >
          <ChevronLeft size={18} />
        </motion.button>

        <div className="text-center">
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            Level {levelId}
          </span>
          <h3 className="text-sm font-semibold text-white leading-tight">
            {levelName}
          </h3>
        </div>

        <motion.button
          onClick={onReset}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.08, rotate: -90 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Reset level"
        >
          <RotateCcw size={16} />
        </motion.button>
      </div>

      {/* Move counter card */}
      <div className="glass-card px-4 py-3 flex items-center gap-3">
        <Footprints size={18} className={textColor} />

        <div className="flex-1">
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
              initial={false}
              animate={{ width: `${ratio * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-baseline gap-1 min-w-[4rem] justify-end">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={movesLeft}
              className={`text-xl font-bold tabular-nums ${textColor}`}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {movesLeft}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-gray-500">/ {maxMoves}</span>
        </div>
      </div>
    </div>
  );
}
