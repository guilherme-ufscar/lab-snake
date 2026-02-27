/**
 * native.js
 * --------------------------------------------------------------------------
 * Initialises Capacitor-specific plugins when running as a native app.
 * Safely no-ops in the browser.
 * --------------------------------------------------------------------------
 */

export async function initNative() {
  try {
    // StatusBar — immersive dark style, matching our bg colour
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#030712' });
  } catch {
    // Not running in Capacitor — ignore
  }

  try {
    // Disable default back-button exit behavior (we handle it ourselves)
    const { App } = await import('@capacitor/app');
    // We handle backButton in useNativeBack hook per-screen
  } catch {
    // ignore
  }
}
