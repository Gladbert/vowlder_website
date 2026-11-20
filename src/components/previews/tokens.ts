import type { Variant } from '../../data/themes';

/**
 * Variant tokens: layout and type only. Every colour comes from the palette at
 * render time, so one renderer covers all templates.
 */
export type Tokens = {
  /** Text alignment for section bodies. */
  align: string;
  label: string;
  title: string;
  sectionTitle: string;
  body: string;
  small: string;
  radius: string;
  card: string;
  sectionPad: string;
  /** Cover gate: photo behind the type, or type on the palette alone. */
  cover: 'photo' | 'plain';
  /** Poster cover: solid colour band under the photo instead of a soft gradient. */
  coverBand: boolean;
  coverJustify: string;
  heroRatio: string;
  /** Names and date sit on top of the hero photo. */
  heroOverlay: boolean;
  couple: 'stack' | 'columns' | 'monogram';
  photoRatio: string;
  story: 'timeline' | 'centered';
  button: string;
  buttonGhost: string;
  gallery: string;
  galleryRatio: string;
  galleryCaptions: boolean;
  navActive: string;
  numbered: boolean;
  ornament: boolean;
};

export const variants: Record<Variant, Tokens> = {
  /** The template used at the real wedding: cream, gold, burgundy, photo cover. */
  faithful: {
    align: 'text-center',
    label: 'text-[10px] font-semibold tracking-[0.28em] uppercase',
    title: 'font-display text-[2.5rem] leading-none',
    sectionTitle: 'font-display text-2xl leading-snug',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[10px] tracking-[0.14em] uppercase',
    radius: 'rounded-[1.1rem]',
    card: 'border p-4',
    sectionPad: 'px-5 py-10',
    cover: 'photo',
    coverBand: false,
    coverJustify: 'justify-end',
    heroRatio: 'aspect-4/5',
    heroOverlay: false,
    couple: 'stack',
    photoRatio: 'aspect-3/4',
    story: 'timeline',
    button: 'rounded-xl px-4 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase',
    buttonGhost: 'rounded-xl border px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase',
    gallery: 'grid grid-cols-2 gap-2.5',
    galleryRatio: 'aspect-3/4',
    galleryCaptions: true,
    navActive: 'font-semibold',
    numbered: false,
    ornament: false,
  },
  /** Ornate dark: plain cover, double frame, wide-spaced capitals, square cards. */
  classic: {
    align: 'text-center',
    label: 'text-[9px] tracking-[0.34em] uppercase',
    title: 'font-display text-[2.6rem] leading-none',
    sectionTitle: 'font-display text-[1.7rem] leading-tight',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[9px] tracking-[0.2em] uppercase',
    radius: 'rounded-none',
    card: 'border p-5',
    sectionPad: 'px-5 py-11',
    cover: 'plain',
    coverBand: false,
    coverJustify: 'justify-center',
    heroRatio: 'aspect-[3/2]',
    heroOverlay: false,
    couple: 'stack',
    photoRatio: 'aspect-3/4',
    story: 'centered',
    button: 'border px-5 py-3 text-[10px] tracking-[0.24em] uppercase',
    buttonGhost: 'border px-4 py-2.5 text-[10px] tracking-[0.18em] uppercase',
    gallery: 'grid grid-cols-2 gap-1.5',
    galleryRatio: 'aspect-3/4',
    galleryCaptions: true,
    navActive: 'font-semibold',
    numbered: false,
    ornament: true,
  },
  /** Left-aligned magazine: numbered sections, hairline cards, photo strip hero. */
  editorial: {
    align: 'text-left',
    label: 'text-[10px] tracking-[0.22em] uppercase tabular-nums',
    title: 'font-display text-[2.7rem] leading-[0.95] tracking-tight',
    sectionTitle: 'font-display text-[2rem] leading-none tracking-tight',
    body: 'text-[12.5px] leading-relaxed',
    small: 'text-[10px] tracking-[0.16em] uppercase',
    radius: 'rounded-none',
    card: 'border-l-2 pl-4',
    sectionPad: 'px-5 py-9',
    cover: 'photo',
    coverBand: false,
    coverJustify: 'justify-end',
    heroRatio: 'aspect-[3/2]',
    heroOverlay: false,
    couple: 'columns',
    photoRatio: 'aspect-3/4',
    story: 'timeline',
    button: 'rounded-full px-5 py-3 text-[10px] tracking-[0.2em] uppercase',
    buttonGhost: 'rounded-full border px-4 py-2.5 text-[10px] tracking-[0.16em] uppercase',
    gallery: 'grid grid-cols-2 gap-3',
    galleryRatio: 'aspect-3/4',
    galleryCaptions: true,
    navActive: 'font-semibold',
    numbered: true,
    ornament: false,
  },
  /** Symmetric and soft: rounded cards, couple side by side, ornament rules. */
  split: {
    align: 'text-center',
    label: 'text-[10px] font-medium tracking-[0.24em] uppercase',
    title: 'font-display text-[2.3rem] leading-none',
    sectionTitle: 'font-display text-[1.9rem] leading-tight',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[10px] tracking-[0.14em] uppercase',
    radius: 'rounded-2xl',
    card: 'border p-4',
    sectionPad: 'px-5 py-10',
    cover: 'photo',
    coverBand: false,
    coverJustify: 'justify-end',
    heroRatio: 'aspect-[4/5]',
    heroOverlay: false,
    couple: 'columns',
    photoRatio: 'aspect-3/4',
    story: 'centered',
    button: 'rounded-full px-5 py-3 text-[11px] tracking-[0.16em] uppercase',
    buttonGhost: 'rounded-full border px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase',
    gallery: 'grid grid-cols-2 gap-2',
    galleryRatio: 'aspect-3/4',
    galleryCaptions: true,
    navActive: 'font-semibold',
    numbered: false,
    ornament: true,
  },
  /** Full-bleed poster: hard colour band under the photo, huge type, one-column gallery. */
  poster: {
    align: 'text-left',
    label: 'text-[10px] font-semibold tracking-[0.3em] uppercase',
    title: 'font-display text-[3rem] leading-[0.9] tracking-tight',
    sectionTitle: 'font-display text-[1.9rem] leading-none tracking-tight',
    body: 'text-[12.5px] leading-relaxed',
    small: 'text-[10px] tracking-[0.18em] uppercase',
    radius: 'rounded-none',
    card: 'border-t pt-4',
    sectionPad: 'px-5 py-9',
    cover: 'photo',
    coverBand: true,
    coverJustify: 'justify-end',
    heroRatio: 'aspect-4/5',
    heroOverlay: false,
    couple: 'stack',
    photoRatio: 'aspect-square',
    story: 'timeline',
    button: 'px-6 py-3.5 text-[10px] font-semibold tracking-[0.24em] uppercase',
    buttonGhost: 'border px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase',
    gallery: 'grid grid-cols-1 gap-3',
    galleryRatio: 'aspect-[4/3]',
    galleryCaptions: true,
    navActive: 'font-semibold',
    numbered: true,
    ornament: false,
  },
  /** Names sit on the photo; thin square frame, letterspaced capitals. */
  spotlight: {
    align: 'text-center',
    label: 'text-[9px] tracking-[0.32em] uppercase',
    title: 'font-display text-[2.4rem] leading-[0.95] tracking-[0.04em] uppercase',
    sectionTitle: 'font-display text-[1.8rem] leading-tight tracking-[0.02em]',
    body: 'text-[12px] leading-relaxed',
    small: 'text-[9px] tracking-[0.22em] uppercase',
    radius: 'rounded-none',
    card: 'border p-4',
    sectionPad: 'px-5 py-11',
    cover: 'plain',
    coverBand: false,
    coverJustify: 'justify-center',
    heroRatio: 'aspect-4/5',
    heroOverlay: true,
    couple: 'stack',
    photoRatio: 'aspect-4/5',
    story: 'centered',
    button: 'border px-5 py-3 text-[10px] tracking-[0.26em] uppercase',
    buttonGhost: 'border px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase',
    gallery: 'grid grid-cols-2 gap-1.5',
    galleryRatio: 'aspect-square',
    galleryCaptions: true,
    navActive: 'font-semibold',
    numbered: false,
    ornament: true,
  },
  /** Dense and quiet: monogram instead of portraits, three-column thumbnails. */
  compact: {
    align: 'text-left',
    label: 'text-[10px] tracking-[0.2em] uppercase',
    title: 'font-display text-[2.2rem] leading-[0.98]',
    sectionTitle: 'font-display text-[1.5rem] leading-tight',
    body: 'text-[11.5px] leading-relaxed',
    small: 'text-[9px] tracking-[0.14em] uppercase',
    radius: 'rounded-lg',
    card: 'border p-3',
    sectionPad: 'px-4 py-7',
    cover: 'plain',
    coverBand: false,
    coverJustify: 'justify-center',
    heroRatio: 'aspect-[16/10]',
    heroOverlay: false,
    couple: 'monogram',
    photoRatio: 'aspect-3/4',
    story: 'timeline',
    button: 'rounded-lg px-4 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase',
    buttonGhost: 'rounded-lg border px-3.5 py-2 text-[10px] tracking-[0.14em] uppercase',
    gallery: 'grid grid-cols-3 gap-1.5',
    galleryRatio: 'aspect-square',
    galleryCaptions: false,
    navActive: 'font-semibold',
    numbered: false,
    ornament: false,
  },
};
