import type { CSSProperties, ReactNode, RefObject } from 'react';
import { motion, type TargetAndTransition } from 'motion/react';

/** One easing curve for the whole catalogue: fast out, no overshoot, no bounce. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** A reveal fires when a twelfth of the block is visible; a rule at 40%. */
const REVEAL_AMOUNT = 0.12;
const RULE_AMOUNT = 0.4;
const REVEAL_DURATION = 0.55;

export type RevealKind = 'rise' | 'fade' | 'soft' | 'slide' | 'right' | 'drop' | 'unfold';
export type HeroMotion = 'drift' | 'pan' | 'lift' | 'still';
export type NavMotion = 'underline' | 'dot' | 'pill';
export type CoverExit =
  | 'fade'
  | 'rise'
  | 'curtain'
  | 'zoom'
  | 'shrink'
  | 'left'
  | 'right'
  | 'flip'
  | 'unveil'
  | 'iris'
  | 'blind'
  | 'drift';

const presets: Record<RevealKind, { from: TargetAndTransition; to: TargetAndTransition }> = {
  rise: { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0 } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  soft: { from: { opacity: 0, scale: 0.98 }, to: { opacity: 1, scale: 1 } },
  slide: { from: { opacity: 0, x: -18 }, to: { opacity: 1, x: 0 } },
  right: { from: { opacity: 0, x: 18 }, to: { opacity: 1, x: 0 } },
  drop: { from: { opacity: 0, y: -14 }, to: { opacity: 1, y: 0 } },
  /** Unfolds from the top edge like a printed card. Origin is set in Reveal's style. */
  unfold: { from: { opacity: 0, scaleY: 0.94, y: 8 }, to: { opacity: 1, scaleY: 1, y: 0 } },
};

/** Hero image motion. Transform only, driven for the 7 s the slide is on screen. */
export const heroMotions: Record<HeroMotion, { to: TargetAndTransition; duration: number }> = {
  drift: { to: { scale: 1.06 }, duration: 7 },
  pan: { to: { scale: 1.05, x: '-2.4%' }, duration: 7 },
  lift: { to: { scale: 1.05, y: '-2%' }, duration: 7 },
  still: { to: { scale: 1 }, duration: 0 },
};

type RevealProps = {
  /** The scroll container. Sections live inside it, so `whileInView` needs this root. */
  root?: RefObject<HTMLDivElement | null>;
  kind?: RevealKind;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Scroll reveal that works inside the invitation's nested scroller. Transform and
 * opacity only — nothing that forces layout. Never nest two of these.
 */
export function Reveal({
  root,
  kind = 'rise',
  delay = 0,
  duration = REVEAL_DURATION,
  className,
  style,
  children,
}: RevealProps) {
  const preset = presets[kind];

  return (
    <motion.div
      data-reveal
      className={className}
      style={kind === 'unfold' ? { ...style, transformOrigin: 'top center' } : style}
      initial={preset.from}
      whileInView={preset.to}
      viewport={{ root: root as RefObject<Element> | undefined, once: true, amount: REVEAL_AMOUNT }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Hairline that draws itself — used instead of a static ornament rule. */
export function Rule({
  root,
  color,
  width = 'w-16',
  delay = 0,
}: {
  root?: RefObject<HTMLDivElement | null>;
  color: string;
  width?: string;
  delay?: number;
}) {
  return (
    <motion.span
      data-reveal
      aria-hidden="true"
      className={`block h-px ${width}`}
      style={{ background: color, transformOrigin: 'left center' }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ root: root as RefObject<Element> | undefined, once: true, amount: RULE_AMOUNT }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    />
  );
}

/**
 * Twelve opening mechanics. Every template picks one plus its own duration, so no
 * two themes open the same way. Transform and opacity only, except the two clip
 * masks (iris, blind), which are one full-screen layer for half a second.
 */
export const coverExits: Record<
  CoverExit,
  { to: TargetAndTransition; origin?: string }
> = {
  fade: { to: { opacity: 0 } },
  rise: { to: { opacity: 0, y: '-8%', scale: 0.99 } },
  curtain: { to: { opacity: 0, y: '-100%', scale: 0.985 }, origin: 'top center' },
  zoom: { to: { opacity: 0, scale: 1.06 } },
  shrink: { to: { opacity: 0, scale: 0.94 } },
  left: { to: { opacity: 0, x: '-100%', scale: 0.99 }, origin: 'left center' },
  right: { to: { opacity: 0, x: '100%', scale: 0.99 }, origin: 'right center' },
  flip: { to: { opacity: 0, rotateX: -92, transformPerspective: 1400 }, origin: 'top center' },
  unveil: { to: { opacity: 0, scaleY: 0 }, origin: 'top center' },
  // Both masked openings were clip-path animations, which the compositor cannot
  // accelerate. Same feel, transform-only: a tiny scale about the title, and a
  // horizontal compression.
  iris: { to: { opacity: 0, scale: 0.04 }, origin: 'center 42%' },
  blind: { to: { opacity: 0, scaleX: 0 }, origin: 'center' },
  drift: { to: { opacity: 0, y: '-4%', scale: 1.02 } },
};
