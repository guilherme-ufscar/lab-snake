import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';

/**
 * MainMenu — Splash / landing screen with animated background orbs
 * and a prominent "Start Game" call-to-action.
 */
export default function MainMenu({ onStart }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden no-select"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ---- Ambient background orbs ---- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-[28rem] h-[28rem] bg-green-500/10 rounded-full blur-[120px] animate-float-slow" />
        <div
          className="absolute bottom-[20%] right-[15%] w-[24rem] h-[24rem] bg-purple-600/10 rounded-full blur-[100px] animate-float-medium"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-[50%] left-[55%] w-[20rem] h-[20rem] bg-emerald-500/5 rounded-full blur-[90px] animate-float-fast"
          style={{ animationDelay: '4s' }}
        />
        <div className="absolute bottom-[10%] left-[10%] w-[16rem] h-[16rem] bg-teal-400/5 rounded-full blur-[80px] animate-float-medium" />
      </div>

      {/* ---- Content ---- */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Snake icon (decorative SVG) */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12c0-3 2-6 6-6s6 3 6 6-2 6-6 6" />
              <path d="M16 12h4" />
              <circle cx="8" cy="10" r="1" fill="white" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-gradient leading-tight">
          Lab Snake
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-md leading-relaxed">
          Navigate the maze. Plan every move. One wrong turn and the path closes forever.
        </p>

        {/* CTA */}
        <motion.button
          onClick={onStart}
          className="mt-12 group relative flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-green-500/25 hover:shadow-green-500/40 transition-shadow duration-300"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Play size={22} className="fill-white" />
          Start Game
        </motion.button>

        {/* Hint */}
        <motion.div
          className="mt-16 flex items-center gap-2 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Info size={14} />
          <span>Use arrow keys or WASD to move</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
