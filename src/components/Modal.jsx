import { motion } from 'framer-motion';
import { Trophy, Skull, RotateCcw, ArrowRight, List } from 'lucide-react';

/**
 * Modal — Victory / Defeat overlay with glassmorphism and spring animations.
 *
 * Props:
 *   type        – 'victory' | 'defeat'
 *   onRetry     – restart level callback
 *   onNext      – go to next level (victory only)
 *   onLevels    – return to level select
 *   movesUsed   – how many moves the player used
 *   maxMoves    – total moves allowed
 */
export default function Modal({
  type,
  onRetry,
  onNext,
  onLevels,
  movesUsed,
  maxMoves,
}) {
  const isVictory = type === 'victory';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-strong rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Icon */}
        <motion.div
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
            isVictory
              ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/25'
              : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25'
          }`}
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}
        >
          {isVictory ? (
            <Trophy size={28} className="text-white" />
          ) : (
            <Skull size={28} className="text-white" />
          )}
        </motion.div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold mb-2 ${
            isVictory ? 'text-gradient-gold' : 'text-red-400'
          }`}
        >
          {isVictory ? 'Level Complete!' : 'Out of Moves'}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm mb-6">
          {isVictory
            ? `Solved in ${movesUsed} of ${maxMoves} moves.`
            : 'Plan your path more carefully and try again.'}
        </p>

        {/* Efficiency stars (victory only) */}
        {isVictory && (
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3].map((star) => {
              const efficiency = movesUsed / maxMoves;
              const filled =
                star === 1
                  ? true
                  : star === 2
                  ? efficiency <= 0.85
                  : efficiency <= 0.6;
              return (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + star * 0.12, type: 'spring', stiffness: 350 }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={filled ? '#fbbf24' : 'none'}
                    stroke={filled ? '#fbbf24' : '#4b5563'}
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {isVictory ? (
            <>
              <motion.button
                onClick={onNext}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowRight size={18} />
                Next Level
              </motion.button>
              <motion.button
                onClick={onLevels}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass hover:bg-white/10 text-gray-300 font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <List size={16} />
                Level Select
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={onRetry}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <RotateCcw size={18} />
                Try Again
              </motion.button>
              <motion.button
                onClick={onLevels}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl glass hover:bg-white/10 text-gray-300 font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <List size={16} />
                Level Select
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
