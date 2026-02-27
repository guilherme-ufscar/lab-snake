import { motion } from 'framer-motion';
import { Lock, Check, ChevronLeft, Star } from 'lucide-react';
import { levels } from '../data/levels';

/**
 * LevelSelect — 5-column × 6-row grid of 30 levels.
 * Locked levels show a lock icon; completed levels show a checkmark.
 */
export default function LevelSelect({ progress, onSelect, onBack }) {
  const isUnlocked = (id) => progress.unlocked.includes(id);
  const isCompleted = (id) => progress.completed.includes(id);

  /** Colour tier by level range */
  function tierColor(id) {
    if (id <= 5) return { ring: 'ring-green-500/40', bg: 'from-green-500/20 to-emerald-500/10', text: 'text-green-400' };
    if (id <= 10) return { ring: 'ring-blue-500/40', bg: 'from-blue-500/20 to-cyan-500/10', text: 'text-blue-400' };
    if (id <= 15) return { ring: 'ring-violet-500/40', bg: 'from-violet-500/20 to-purple-500/10', text: 'text-violet-400' };
    if (id <= 20) return { ring: 'ring-orange-500/40', bg: 'from-orange-500/20 to-amber-500/10', text: 'text-orange-400' };
    if (id <= 25) return { ring: 'ring-rose-500/40', bg: 'from-rose-500/20 to-pink-500/10', text: 'text-rose-400' };
    return { ring: 'ring-yellow-500/40', bg: 'from-yellow-500/20 to-amber-500/10', text: 'text-yellow-400' };
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center px-4 py-8 relative overflow-y-auto no-select"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[20%] w-[22rem] h-[22rem] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[15%] w-[18rem] h-[18rem] bg-purple-600/5 rounded-full blur-[90px]" />
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl flex items-center gap-4 mb-8 relative z-10">
        <motion.button
          onClick={onBack}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Select Level
        </h2>
      </div>

      {/* Grid: 5 columns × 6 rows = 30 levels */}
      <div className="grid grid-cols-5 gap-3 sm:gap-4 max-w-2xl w-full relative z-10">
        {levels.map((level, i) => {
          const id = level.id;
          const unlocked = isUnlocked(id);
          const completed = isCompleted(id);
          const tier = tierColor(id);

          return (
            <motion.button
              key={id}
              onClick={() => unlocked && onSelect(id)}
              disabled={!unlocked}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1
                transition-all duration-200 outline-none
                ${
                  !unlocked
                    ? 'bg-white/[0.03] border border-white/5 cursor-not-allowed opacity-50'
                    : completed
                    ? `bg-gradient-to-br ${tier.bg} ring-1 ${tier.ring} backdrop-blur-sm cursor-pointer hover:scale-105`
                    : 'glass cursor-pointer hover:bg-white/10 hover:scale-105'
                }
              `}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.018, type: 'spring', stiffness: 300, damping: 25 }}
              whileTap={unlocked ? { scale: 0.92 } : {}}
            >
              {!unlocked ? (
                <Lock size={18} className="text-gray-600" />
              ) : completed ? (
                <>
                  <Check size={18} className={tier.text} />
                  <span className={`text-xs font-medium ${tier.text}`}>{id}</span>
                </>
              ) : (
                <>
                  <span className="text-white font-bold text-lg">{id}</span>
                  <span className="text-[0.6rem] text-gray-400 truncate max-w-[90%]">
                    {level.name}
                  </span>
                </>
              )}

              {/* Stars for completed */}
              {completed && (
                <div className="absolute -top-1 -right-1">
                  <Star size={12} className={`fill-current ${tier.text}`} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex gap-6 text-xs text-gray-500 relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white/10 border border-white/20" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/40" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <Lock size={10} /> Locked
        </span>
      </div>
    </motion.div>
  );
}
