/**
 * storage.js
 * --------------------------------------------------------------------------
 * Thin wrapper around localStorage for persisting player progress.
 * Stores which levels have been completed and which are unlocked.
 * --------------------------------------------------------------------------
 */

const STORAGE_KEY = 'lab-snake-progress';

/**
 * Returns the saved progress object, or a fresh default
 * where only level 1 is unlocked.
 */
export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Sanity check
      if (Array.isArray(data.completed) && Array.isArray(data.unlocked)) {
        // Ensure level 1 is always unlocked
        if (!data.unlocked.includes(1)) data.unlocked.push(1);
        return data;
      }
    }
  } catch {
    // corrupt data — fall through to default
  }
  return { completed: [], unlocked: [1] };
}

/**
 * Persists progress to localStorage.
 */
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or blocked — silently ignore
  }
}

/**
 * Resets all saved progress (used for debugging / settings).
 */
export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
