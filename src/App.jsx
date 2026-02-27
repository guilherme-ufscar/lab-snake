import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import Game from './components/Game';
import { getProgress, saveProgress } from './utils/storage';
import useNativeBack from './hooks/useNativeBack';

/**
 * App — Root component managing navigation between screens
 * and persisting player progress via localStorage.
 */
export default function App() {
  const [screen, setScreen] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(null);
  const [progress, setProgress] = useState(() => getProgress());

  /* ---- Navigation ---- */
  const goToMenu = useCallback(() => setScreen('menu'), []);
  const goToLevels = useCallback(() => setScreen('levels'), []);

  const goToGame = useCallback((levelId) => {
    setCurrentLevel(levelId);
    setScreen('game');
  }, []);

  /* ---- Progress ---- */
  const handleLevelComplete = useCallback(
    (levelId) => {
      const newCompleted = [...new Set([...progress.completed, levelId])];
      const newUnlocked = [...new Set([...progress.unlocked, levelId + 1])];
      const updated = { completed: newCompleted, unlocked: newUnlocked };
      setProgress(updated);
      saveProgress(updated);
    },
    [progress]
  );

  const handleNextLevel = useCallback(() => {
    if (currentLevel < 30) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setScreen('levels');
    }
  }, [currentLevel]);

  /* ---- Android hardware back button ---- */
  const handleNativeBack = useCallback(() => {
    if (screen === 'game') {
      setScreen('levels');
    } else if (screen === 'levels') {
      setScreen('menu');
    }
    // On menu screen — do nothing (don't exit app)
  }, [screen]);

  useNativeBack(handleNativeBack);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0c0a1d] to-gray-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <MainMenu key="menu" onStart={goToLevels} />
        )}

        {screen === 'levels' && (
          <LevelSelect
            key="levels"
            progress={progress}
            onSelect={goToGame}
            onBack={goToMenu}
          />
        )}

        {screen === 'game' && currentLevel && (
          <Game
            key={`game-${currentLevel}`}
            levelId={currentLevel}
            onBack={goToLevels}
            onComplete={handleLevelComplete}
            onNextLevel={handleNextLevel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
