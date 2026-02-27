/**
 * useNativeBack.js
 * --------------------------------------------------------------------------
 * Hook that listens for the Android hardware/gesture "back" button via
 * Capacitor's App plugin. Falls back gracefully in the browser (no-op).
 *
 * Usage:  useNativeBack(() => navigateBack());
 * --------------------------------------------------------------------------
 */
import { useEffect } from 'react';

let appPlugin = null;

// Dynamically import only when available (Capacitor env)
async function getAppPlugin() {
  if (appPlugin) return appPlugin;
  try {
    const mod = await import('@capacitor/app');
    appPlugin = mod.App;
    return appPlugin;
  } catch {
    return null;
  }
}

export default function useNativeBack(callback) {
  useEffect(() => {
    let listener = null;

    getAppPlugin().then((App) => {
      if (!App) return;
      listener = App.addListener('backButton', ({ canGoBack }) => {
        if (callback) {
          callback();
        }
      });
    });

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      } else if (listener && listener.then) {
        // Capacitor 5+ returns a promise
        listener.then((l) => l.remove());
      }
    };
  }, [callback]);
}
