/**
 * Motion preference helpers for imperative (non-hook) code paths.
 * Component animations rely on <MotionConfig reducedMotion="user">; plain
 * scroll handlers can't, so they consult this before animating.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
