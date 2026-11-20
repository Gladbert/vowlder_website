import type { Variant } from '../../data/themes';

/**
 * Variant tokens: layout and type only. Every colour comes from the palette at
 * render time, so one component covers all templates.
 */
export type Tokens = {
  align: string;
  label: string;
  title: string;
  sectionTitle: string;
  body: string;
  small: string;
  radius: string;
  card: string;
  cover: 'photo' | 'plain';
  coverJustify: string;
  heroRatio: string;
  couple: 'stack' | 'columns';
  story: 'timeline' | 'centered';
  button: string;
  buttonGhost: string;
  gallery: string;
  navActive: string;
  numbered: boolean;
  ornament: boolean;
};

export const variants: Record<Variant, Tokens> = {
  faithful: {
    align: 'text-center',
    label: 'text-[10px] font-semibold tracking-[0.28em] uppercase',
    title: 'font-display text-[2.5rem] leading-none',
    sectionTitle: 'font-display text-2xl leading-snug',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[10px] tracking-[0.14em] uppercase',
    radius: 'rounded-[1.1rem]',
    card: 'border p-4',
    cover: 'photo',
    coverJustify: 'justify-end',
    heroRatio: 'aspect-4/5',
    couple: 'stack',
    story: 'timeline',
    button: 'rounded-xl px-4 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase',
    buttonGhost: 'rounded-xl border px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase',
    gallery: 'grid grid-cols-2 gap-2.5',
    navActive: 'font-semibold',
    numbered: false,
    ornament: false,
  },
  classic: {
    align: 'text-center',
    label: 'text-[9px] tracking-[0.34em] uppercase',
    title: 'font-display text-[2.6rem] leading-none',
    sectionTitle: 'font-display text-[1.7rem] leading-tight',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[9px] tracking-[0.2em] uppercase',
    radius: 'rounded-none',
    card: 'border p-5',
    cover: 'plain',
    coverJustify: 'justify-center',
    heroRatio: 'aspect-[3/2]',
    couple: 'stack',
    story: 'centered',
    button: 'border px-5 py-3 text-[10px] tracking-[0.24em] uppercase',
    buttonGhost: 'border px-4 py-2.5 text-[10px] tracking-[0.18em] uppercase',
    gallery: 'grid grid-cols-2 gap-1.5',
    navActive: 'font-semibold',
    numbered: false,
    ornament: true,
  },
  editorial: {
    align: 'text-left',
    label: 'text-[10px] tracking-[0.22em] uppercase tabular-nums',
    title: 'font-display text-[2.7rem] leading-[0.95] tracking-tight',
    sectionTitle: 'font-display text-[2rem] leading-none tracking-tight',
    body: 'text-[12.5px] leading-relaxed',
    small: 'text-[10px] tracking-[0.16em] uppercase',
    radius: 'rounded-none',
    card: 'border-l-2 pl-4',
    cover: 'photo',
    coverJustify: 'justify-end',
    heroRatio: 'aspect-[3/2]',
    couple: 'columns',
    story: 'timeline',
    button: 'rounded-full px-5 py-3 text-[10px] tracking-[0.2em] uppercase',
    buttonGhost: 'rounded-full border px-4 py-2.5 text-[10px] tracking-[0.16em] uppercase',
    gallery: 'grid grid-cols-2 gap-3',
    navActive: 'font-semibold',
    numbered: true,
    ornament: false,
  },
  split: {
    align: 'text-center',
    label: 'text-[10px] font-medium tracking-[0.24em] uppercase',
    title: 'font-display text-[2.3rem] leading-none',
    sectionTitle: 'font-display text-[1.9rem] leading-tight',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[10px] tracking-[0.14em] uppercase',
    radius: 'rounded-2xl',
    card: 'border p-4',
    cover: 'photo',
    coverJustify: 'justify-end',
    heroRatio: 'aspect-[4/5]',
    couple: 'columns',
    story: 'centered',
    button: 'rounded-full px-5 py-3 text-[11px] tracking-[0.16em] uppercase',
    buttonGhost: 'rounded-full border px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase',
    gallery: 'grid grid-cols-2 gap-2',
    navActive: 'font-semibold',
    numbered: false,
    ornament: true,
  },
};
