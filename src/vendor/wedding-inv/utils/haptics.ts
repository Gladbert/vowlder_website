function vibrate(pattern: number | number[]): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch (e) {
    // no vibration API on this device
    // Unsupported or blocked by browser permissions; haptics are best-effort.
  }
}

export const haptics = {
  light: () => vibrate(8),
  medium: () => vibrate(16),
  selection: () => vibrate(6),
  success: () => vibrate([10, 40, 16]),
  impact: () => vibrate(20),
  notification: () => vibrate([30, 60, 30]),
};
