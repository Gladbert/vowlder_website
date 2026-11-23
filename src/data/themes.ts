import type { CoverExit, HeroMotion, NavMotion, RevealKind } from '../components/previews/motion';

/** Section components this template uses. Falls back to the variant's own set. */
export type ThemeLayout = {
  scheduleStyle?: 'cards' | 'timeline' | 'list';
  galleryStyle?: 'grid' | 'rail' | 'full';
  couple?: 'stack' | 'columns' | 'monogram';
  story?: 'timeline' | 'centered' | 'cards';
  photoShape?: 'square' | 'circle';
};
// Design only. Content comes from wedding.ts; every template shows the same wedding.
export type Category = 'Traditional' | 'Minimalist' | 'Floral' | 'Oriental' | 'Classic';

export type Tier = 'Basic' | 'Premium' | 'Signature';

/** Layout shell. Colours always come from the palette. */
export type Variant =
  | 'faithful'
  | 'classic'
  | 'editorial'
  | 'split'
  | 'poster'
  | 'spotlight'
  | 'compact'
  | 'medallion'
  | 'seal'
  | 'rail'
  | 'ledger';

/** Catalogue tag, the way template galleries label a mood. */
export type Mood = 'Elegant' | 'Romantic' | 'Natural' | 'Luxe' | 'Warm' | 'Bold' | 'Calm';


/** Per-template motion signature. Two templates may share a layout, never this. */
export type ThemeMotion = {
  reveal: RevealKind;
  hero: HeroMotion;
  nav: NavMotion;
  coverExit: CoverExit;
  /** Seconds the opening takes. Unique per template together with coverExit. */
  coverDuration?: number;
};

export type Palette = {
  bg: string;
  paper: string;
  ink: string;
  soft: string;
  accent: string;
  line: string;
  /** Text colour on top of `accent`. */
  on: string;
};

export type Theme = {
  slug: string;
  name: string;
  category: Category;
  tier: Tier;
  price: number;
  blurb: string;
  palette: Palette;
  type: { heading: string; weight: number; tracking: string; caps: boolean };
  variant: Variant;
  mood: Mood;
  /** Section label override, e.g. "Angpao" for Chinese-Indonesian themes. */
  giftLabel?: string;
  /** Cultural mark rendered on the cover and footer, e.g. 囍. */
  glyph?: string;
  /** Motion signature; falls back to the variant defaults in tokens.ts. */
  motion?: ThemeMotion;
  /** Component choices; two templates may share a variant, never a full set. */
  layout?: ThemeLayout;
  /** 'guest-app' renders the vendored Wedding-inv guest app verbatim, not our renderer. */
  renderer?: 'guest-app';
  /** Card thumbnail photo. Omit for a purely typographic card. */
  photo?: string;
  /** Path to a loopable track. Leave undefined and the music control stays hidden. */
  music?: string;
};

export const categories: Category[] = [
  'Traditional',
  'Minimalist',
  'Floral',
  'Oriental',
  'Classic',
];

export const WA_NUMBER = '6285330168811';

const serif = "'Cormorant Garamond Variable', Georgia, serif";

/** Identical in every template: the design differs, the invitation does not. */
export const includedFeatures = [
  'Four photographs on a loop at the top',
  'A countdown to the day',
  'Both ceremonies and the venue',
  'Map, Waze, and save the date',
  'Couple profiles and Instagram',
  'The story in four parts',
  'Eight photographs, tap to enlarge',
  'RSVP, gifts, and a guest book',
];

export const themes: Theme[] = [
  {
    slug: 'gladbert-monica',
    name: 'Gladbert & Monica',
    category: 'Minimalist',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'The template we used at the real wedding: cream, gold, and burgundy, with an order of sections that has already survived a room full of guests.',
    palette: {
      bg: '#F3EFEA',
      paper: '#FAF8F5',
      ink: '#1C1714',
      soft: '#6B5A4D',
      accent: '#8A5C2E',
      line: '#E1D5C2',
      on: '#FCF9F5',
    },
    type: { heading: serif, weight: 500, tracking: '-0.01em', caps: false },
    variant: 'faithful',
    layout: { scheduleStyle: 'cards', galleryStyle: 'grid', couple: 'stack', story: 'timeline', photoShape: 'square' },
    mood: 'Warm',
    motion: { reveal: 'rise', hero: 'drift', nav: 'underline', coverExit: 'flip', coverDuration: 0.7 },
    renderer: 'guest-app',
    photo: '/photos/cover.webp',
  },
  {
    slug: 'sepia',
    name: 'Sepia',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Left-aligned editorial. Numbered sections, big type, photographs in a strip. For couples who would rather not have ornaments.',
    palette: {
      bg: '#F5F0E8',
      paper: '#FBF7F1',
      ink: '#241F1A',
      soft: '#6E6154',
      accent: '#7A5232',
      line: '#E2D8C9',
      on: '#FCF8F2',
    },
    type: { heading: serif, weight: 500, tracking: '-0.02em', caps: false },
    variant: 'editorial',
    layout: { scheduleStyle: 'list', galleryStyle: 'grid', couple: 'columns', story: 'timeline', photoShape: 'square' },
    mood: 'Calm',
    motion: { reveal: 'slide', hero: 'pan', nav: 'dot', coverExit: 'rise', coverDuration: 0.55 },
    photo: '/photos/kyoto.webp',
  },
  {
    slug: 'kenanga',
    name: 'Kenanga',
    category: 'Floral',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Sage and white, rounded cards, the two of you side by side. For a garden ceremony or a villa weekend.',
    palette: {
      bg: '#F2F5EE',
      paper: '#FBFCF9',
      ink: '#263322',
      soft: '#57684F',
      accent: '#4F6A48',
      line: '#D3DCCB',
      on: '#F7FAF4',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'split',
    layout: { scheduleStyle: 'cards', galleryStyle: 'rail', couple: 'columns', story: 'centered', photoShape: 'square' },
    mood: 'Natural',
    motion: { reveal: 'soft', hero: 'lift', nav: 'dot', coverExit: 'iris', coverDuration: 0.55 },
    photo: '/photos/bamboo.webp',
  },
  {
    slug: 'merah',
    name: 'Merah',
    category: 'Oriental',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Deep red and gold, double frame, wide capitals. For teapai, sangjit, and an evening reception.',
    palette: {
      bg: '#2A0E0E',
      paper: '#3A1414',
      ink: '#FBEEE0',
      soft: '#DDBEAB',
      accent: '#DDA94F',
      line: '#5C2222',
      on: '#2A0E0E',
    },
    type: { heading: serif, weight: 600, tracking: '0.06em', caps: false },
    variant: 'classic',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'grid', couple: 'stack', story: 'centered', photoShape: 'square' },
    mood: 'Luxe',
    motion: { reveal: 'fade', hero: 'pan', nav: 'underline', coverExit: 'curtain', coverDuration: 0.65 },
    photo: '/photos/pool8.webp',
  },
  {
    slug: 'art-deco',
    name: 'Art Deco',
    category: 'Classic',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Black and old gold, thin rules, oversized section numbers. Suits a ballroom with the lights turned down.',
    palette: {
      bg: '#111110',
      paper: '#1A1A18',
      ink: '#F4EFE4',
      soft: '#BEB6A5',
      accent: '#C9A961',
      line: '#3A3A34',
      on: '#111110',
    },
    type: { heading: serif, weight: 500, tracking: '0.08em', caps: true },
    variant: 'editorial',
    layout: { scheduleStyle: 'list', galleryStyle: 'grid', couple: 'columns', story: 'cards', photoShape: 'square' },
    mood: 'Bold',
    motion: { reveal: 'drop', hero: 'pan', nav: 'pill', coverExit: 'blind', coverDuration: 0.6 },
    photo: '/photos/hero1.webp',
  },
  {
    slug: 'kapas',
    name: 'Kapas',
    category: 'Floral',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Pale blush and terracotta, rounded cards, plenty of empty space. For a morning ceremony and a small reception.',
    palette: {
      bg: '#FBF1EE',
      paper: '#FFF9F6',
      ink: '#33231F',
      soft: '#6E5651',
      accent: '#96483F',
      line: '#EFD9D2',
      on: '#FFF7F4',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'split',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'rail', couple: 'columns', story: 'centered', photoShape: 'square' },
    mood: 'Romantic',
    motion: { reveal: 'right', hero: 'lift', nav: 'underline', coverExit: 'iris', coverDuration: 0.6 },
    photo: '/photos/lake.webp',
  },
  {
    slug: 'legam',
    name: 'Legam',
    category: 'Classic',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Charcoal and silver, editorial type, almost no ornament. For couples who want an invitation with no colour at all.',
    palette: {
      bg: '#101418',
      paper: '#181D22',
      ink: '#EAE7E1',
      soft: '#AEB6BE',
      accent: '#9FB6C6',
      line: '#2C343C',
      on: '#101418',
    },
    type: { heading: serif, weight: 400, tracking: '-0.01em', caps: false },
    variant: 'editorial',
    layout: { scheduleStyle: 'list', galleryStyle: 'full', couple: 'columns', story: 'timeline', photoShape: 'square' },
    mood: 'Elegant',
    motion: { reveal: 'fade', hero: 'still', nav: 'dot', coverExit: 'fade', coverDuration: 0.75 },
    photo: '/photos/shibuya.webp',
  },
  {
    slug: 'linen',
    name: 'Linen',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Poster layout: a full photograph, a solid colour band, big left-aligned type, one-column gallery. The most room for pictures.',
    palette: {
      bg: '#F7F5F2',
      paper: '#FFFFFF',
      ink: '#1A1917',
      soft: '#5F5A54',
      accent: '#8C2F28',
      line: '#DED9D2',
      on: '#FFF8F6',
    },
    type: { heading: serif, weight: 500, tracking: '-0.02em', caps: false },
    variant: 'poster',
    layout: { scheduleStyle: 'list', galleryStyle: 'full', couple: 'stack', story: 'timeline', photoShape: 'square' },
    mood: 'Bold',
    motion: { reveal: 'unfold', hero: 'pan', nav: 'pill', coverExit: 'left', coverDuration: 0.5 },
    photo: '/photos/groom.webp',
  },
  {
    slug: 'ambar',
    name: 'Ambar',
    category: 'Classic',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Your names sit on the photograph inside a thin frame, with wide capitals. For an evening reception under low light.',
    palette: {
      bg: '#23180F',
      paper: '#2E2116',
      ink: '#F6E9D8',
      soft: '#CDB79D',
      accent: '#E0A94F',
      line: '#4A3625',
      on: '#23180F',
    },
    type: { heading: serif, weight: 500, tracking: '0.05em', caps: false },
    variant: 'spotlight',
    layout: { scheduleStyle: 'cards', galleryStyle: 'grid', couple: 'stack', story: 'centered', photoShape: 'square' },
    mood: 'Elegant',
    motion: { reveal: 'fade', hero: 'drift', nav: 'dot', coverExit: 'zoom', coverDuration: 0.7 },
    photo: '/photos/bride.webp',
  },
  {
    slug: 'kapur',
    name: 'Kapur',
    category: 'Minimalist',
    tier: 'Basic',
    price: 350_000,
    blurb:
      'The shortest version: a monogram instead of portraits, a three-column gallery, no ornament.',
    palette: {
      bg: '#F4F4F1',
      paper: '#FBFBF9',
      ink: '#22241F',
      soft: '#5C6156',
      accent: '#4A5A45',
      line: '#DCDED7',
      on: '#F7F8F4',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'compact',
    layout: { scheduleStyle: 'list', galleryStyle: 'grid', couple: 'monogram', story: 'cards', photoShape: 'square' },
    mood: 'Calm',
    motion: { reveal: 'right', hero: 'still', nav: 'underline', coverExit: 'fade', coverDuration: 0.4 },
  },
  {
    slug: 'rasa',
    name: 'Rasa',
    category: 'Floral',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Round portraits, italic headings, soft cards. Fits a morning ceremony or a reception at home.',
    palette: {
      bg: '#FBF3F4',
      paper: '#FFF9FA',
      ink: '#33262A',
      soft: '#6F585E',
      accent: '#A34A5E',
      line: '#F0DCE0',
      on: '#FFF7F9',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'medallion',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'grid', couple: 'columns', story: 'centered', photoShape: 'circle' },
    mood: 'Romantic',
    motion: { reveal: 'unfold', hero: 'lift', nav: 'dot', coverExit: 'unveil', coverDuration: 0.55 },
    photo: '/photos/bride.webp',
  },
  {
    slug: 'pusaka',
    name: 'Pusaka',
    category: 'Traditional',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Deep green and old gold, round portraits, italic headings. For a traditional ceremony that still feels quiet.',
    palette: {
      bg: '#12211C',
      paper: '#172B24',
      ink: '#F0EAD8',
      soft: '#C4CDBE',
      accent: '#CFAE63',
      line: '#2C443A',
      on: '#12211C',
    },
    type: { heading: serif, weight: 500, tracking: '0.03em', caps: false },
    variant: 'medallion',
    layout: { scheduleStyle: 'cards', galleryStyle: 'grid', couple: 'columns', story: 'timeline', photoShape: 'circle' },
    mood: 'Luxe',
    motion: { reveal: 'fade', hero: 'drift', nav: 'underline', coverExit: 'curtain', coverDuration: 0.8 },
    photo: '/photos/shrine.webp',
  },
  {
    slug: 'gadang',
    name: 'Gadang',
    category: 'Traditional',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Maroon and old brass, double frame, wide capitals. For a baralek with a long run of events.',
    palette: {
      bg: '#2B120F',
      paper: '#3A1A15',
      ink: '#F7E7D6',
      soft: '#DCBCA9',
      accent: '#D9A45B',
      line: '#5A2A22',
      on: '#2B120F',
    },
    type: { heading: serif, weight: 600, tracking: '0.05em', caps: false },
    variant: 'classic',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'grid', couple: 'stack', story: 'cards', photoShape: 'square' },
    mood: 'Luxe',
    motion: { reveal: 'fade', hero: 'drift', nav: 'pill', coverExit: 'flip', coverDuration: 0.55 },
    photo: '/photos/couple.webp',
  },
  {
    slug: 'sore',
    name: 'Sore',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Sea green and sand, full-bleed photographs, a one-column gallery. For a ceremony by the water.',
    palette: {
      bg: '#F6F1E7',
      paper: '#FFFCF5',
      ink: '#23302F',
      soft: '#5A6A67',
      accent: '#2F6B6A',
      line: '#DFD9CC',
      on: '#F7FAF8',
    },
    type: { heading: serif, weight: 500, tracking: '-0.01em', caps: false },
    variant: 'poster',
    layout: { scheduleStyle: 'cards', galleryStyle: 'full', couple: 'stack', story: 'timeline', photoShape: 'square' },
    mood: 'Natural',
    motion: { reveal: 'rise', hero: 'pan', nav: 'dot', coverExit: 'right', coverDuration: 0.5 },
    photo: '/photos/fuji.webp',
  },
  {
    slug: 'angpao',
    name: 'Angpao',
    category: 'Oriental',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Deep red, gold, and a seal. The gift block becomes angpao, with wide capitals for teapai and sangjit.',
    palette: {
      bg: '#2A0A10',
      paper: '#3A1219',
      ink: '#FBEEDC',
      soft: '#E0C3B4',
      accent: '#D9A548',
      line: '#5E2530',
      on: '#2A0A10',
    },
    type: { heading: serif, weight: 600, tracking: '0.04em', caps: false },
    variant: 'seal',
    layout: { scheduleStyle: 'cards', galleryStyle: 'full', couple: 'stack', story: 'centered', photoShape: 'square' },
    mood: 'Luxe',
    motion: { reveal: 'soft', hero: 'drift', nav: 'pill', coverExit: 'iris', coverDuration: 0.75 },
    giftLabel: 'Angpao',
    glyph: '囍',
    photo: '/photos/candid.webp',
  },
  {
    slug: 'imlek',
    name: 'Imlek',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Clean cream with a vermilion accent and a single character. Chinese-Indonesian without a wall of red.',
    palette: {
      bg: '#FAF6EF',
      paper: '#FFFDF8',
      ink: '#2A2320',
      soft: '#6A5B4F',
      accent: '#A6321F',
      line: '#E8DCCB',
      on: '#FFF8F0',
    },
    type: { heading: serif, weight: 500, tracking: '-0.01em', caps: false },
    variant: 'editorial',
    layout: { scheduleStyle: 'cards', galleryStyle: 'grid', couple: 'columns', story: 'timeline', photoShape: 'square' },
    mood: 'Calm',
    motion: { reveal: 'slide', hero: 'lift', nav: 'pill', coverExit: 'rise', coverDuration: 0.7 },
    giftLabel: 'Angpao',
    glyph: '福',
    photo: '/photos/hero1.webp',
  },
  {
    slug: 'teapai',
    name: 'Teapai',
    category: 'Oriental',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Dark brown and gold, round portraits, italic headings. For teapai and sangjit at home.',
    palette: {
      bg: '#1C1410',
      paper: '#261B15',
      ink: '#F6E8D5',
      soft: '#CDB49B',
      accent: '#D6A756',
      line: '#463227',
      on: '#1C1410',
    },
    type: { heading: serif, weight: 500, tracking: '0.03em', caps: false },
    variant: 'medallion',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'rail', couple: 'columns', story: 'centered', photoShape: 'circle' },
    mood: 'Elegant',
    motion: { reveal: 'unfold', hero: 'pan', nav: 'underline', coverExit: 'unveil', coverDuration: 0.65 },
    giftLabel: 'Angpao',
    glyph: '囍',
    photo: '/photos/groom.webp',
  },
  {
    slug: 'sinar',
    name: 'Sinar',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'A rail down the page: round portraits, a swipeable gallery, cards that stay out of the way. For a small ceremony that still wants photographs.',
    palette: {
      bg: '#FAF7F1',
      paper: '#FFFFFF',
      ink: '#201E1A',
      soft: '#5C574E',
      accent: '#7A6A3F',
      line: '#E4DDD0',
      on: '#FFFDF7',
    },
    type: { heading: serif, weight: 500, tracking: '-0.01em', caps: false },
    variant: 'rail',
    layout: { scheduleStyle: 'cards', galleryStyle: 'rail', couple: 'columns', story: 'timeline', photoShape: 'circle' },
    mood: 'Warm',
    motion: { reveal: 'right', hero: 'pan', nav: 'underline', coverExit: 'left', coverDuration: 0.6 },
    photo: '/photos/shibuya.webp',
  },
  {
    slug: 'lontar',
    name: 'Lontar',
    category: 'Traditional',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Indigo and copper, a ledger of rows instead of cards, full-bleed photographs. Reads like a printed programme, not a page.',
    palette: {
      bg: '#171A21',
      paper: '#1F242D',
      ink: '#EFE9DC',
      soft: '#BDB5A4',
      accent: '#C98A4B',
      line: '#3A4150',
      on: '#171A21',
    },
    type: { heading: serif, weight: 500, tracking: '0.02em', caps: false },
    variant: 'ledger',
    layout: { scheduleStyle: 'list', galleryStyle: 'full', couple: 'monogram', story: 'timeline', photoShape: 'square' },
    mood: 'Luxe',
    motion: { reveal: 'fade', hero: 'lift', nav: 'dot', coverExit: 'blind', coverDuration: 0.75 },
    photo: '/photos/kyoto.webp',
  },
  {
    slug: 'teluk',
    name: 'Teluk',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'White walls, an azure accent, photographs half a step brighter. For a ceremony near water or a long lunch that turns into a reception.',
    palette: {
      bg: '#F6F8F8',
      paper: '#FFFFFF',
      ink: '#1B2733',
      soft: '#4F6470',
      accent: '#1F6072',
      line: '#DEE7E8',
      on: '#F7FBFB',
    },
    type: { heading: serif, weight: 500, tracking: '0em', caps: false },
    variant: 'split',
    layout: { scheduleStyle: 'cards', galleryStyle: 'full', couple: 'columns', story: 'centered', photoShape: 'square' },
    mood: 'Natural',
    motion: { reveal: 'soft', hero: 'pan', nav: 'dot', coverExit: 'drift', coverDuration: 0.65 },
    photo: '/photos/lake.webp',
  },
  {
    slug: 'kertas',
    name: 'Kertas',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'A studio sheet: near-white paper, tight type, one signal red. No ornament, nothing to distract from the names.',
    palette: {
      bg: '#FAFAF8',
      paper: '#FFFFFF',
      ink: '#17170F',
      soft: '#5A5A50',
      accent: '#B23A2E',
      line: '#E4E4DC',
      on: '#FFF8F6',
    },
    type: { heading: serif, weight: 500, tracking: '-0.02em', caps: false },
    variant: 'compact',
    layout: { scheduleStyle: 'cards', galleryStyle: 'grid', couple: 'monogram', story: 'cards', photoShape: 'square' },
    mood: 'Elegant',
    motion: { reveal: 'rise', hero: 'still', nav: 'underline', coverExit: 'shrink', coverDuration: 0.45 },
    photo: '/photos/fuji.webp',
  },
  {
    slug: 'terakota',
    name: 'Terakota',
    category: 'Traditional',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Clay, sand, and late afternoon light. Built for a ceremony in a courtyard where the photographs are already warm.',
    palette: {
      bg: '#FBF2EA',
      paper: '#FFF9F4',
      ink: '#2A1F19',
      soft: '#6A554A',
      accent: '#99512F',
      line: '#EEDCCD',
      on: '#FFF9F4',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'faithful',
    layout: { scheduleStyle: 'cards', galleryStyle: 'grid', couple: 'stack', story: 'cards', photoShape: 'square' },
    mood: 'Warm',
    motion: { reveal: 'rise', hero: 'lift', nav: 'underline', coverExit: 'drift', coverDuration: 0.55 },
    photo: '/photos/candid.webp',
  },
  {
    slug: 'kelabu',
    name: 'Kelabu',
    category: 'Classic',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Newspaper rules, black on off-white, section numbers doing the ornament. For couples who want the photographs to carry everything.',
    palette: {
      bg: '#F4F3F0',
      paper: '#FFFFFF',
      ink: '#101010',
      soft: '#55534E',
      accent: '#2B2B2B',
      line: '#E2E0DA',
      on: '#F7F6F3',
    },
    type: { heading: serif, weight: 600, tracking: '-0.02em', caps: false },
    variant: 'editorial',
    layout: { scheduleStyle: 'list', galleryStyle: 'grid', couple: 'monogram', story: 'timeline', photoShape: 'square' },
    mood: 'Bold',
    motion: { reveal: 'slide', hero: 'pan', nav: 'pill', coverExit: 'zoom', coverDuration: 0.5 },
    photo: '/photos/pool7.webp',
  },
  {
    slug: 'seladon',
    name: 'Seladon',
    category: 'Floral',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Glazed green and bone white, quieter than a flower theme. Rounded cards, a swipeable gallery, photographs that stay pale.',
    palette: {
      bg: '#F4F6F1',
      paper: '#FBFCF9',
      ink: '#1E2620',
      soft: '#55625A',
      accent: '#4F6B57',
      line: '#DCE4DA',
      on: '#F7FAF7',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'split',
    layout: { scheduleStyle: 'cards', galleryStyle: 'rail', couple: 'monogram', story: 'centered', photoShape: 'square' },
    mood: 'Natural',
    motion: { reveal: 'right', hero: 'lift', nav: 'pill', coverExit: 'unveil', coverDuration: 0.48 },
    photo: '/photos/pool1.webp',
  },
  {
    slug: 'malam',
    name: 'Malam',
    category: 'Classic',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Plum and lilac at night, names set over the photograph. Slow by design: almost nothing moves until you do.',
    palette: {
      bg: '#1A1420',
      paper: '#241B2C',
      ink: '#F2EAF5',
      soft: '#C7B9CF',
      accent: '#C9A2D6',
      line: '#3B2F47',
      on: '#1A1420',
    },
    type: { heading: serif, weight: 400, tracking: '0.04em', caps: false },
    variant: 'spotlight',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'full', couple: 'stack', story: 'centered', photoShape: 'square' },
    mood: 'Elegant',
    motion: { reveal: 'fade', hero: 'still', nav: 'underline', coverExit: 'fade', coverDuration: 0.9 },
    photo: '/photos/pool2.webp',
  },
  {
    slug: 'garam',
    name: 'Garam',
    category: 'Minimalist',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Sand, salt, and a horizon. A poster layout with one column of photographs, for a ceremony held outdoors with the light behind you.',
    palette: {
      bg: '#F6F1E8',
      paper: '#FFFCF6',
      ink: '#2A2620',
      soft: '#635B4E',
      accent: '#6E5730',
      line: '#E6DCCA',
      on: '#FFFCF6',
    },
    type: { heading: serif, weight: 500, tracking: '-0.02em', caps: false },
    variant: 'poster',
    layout: { scheduleStyle: 'list', galleryStyle: 'full', couple: 'columns', story: 'cards', photoShape: 'square' },
    mood: 'Natural',
    motion: { reveal: 'drop', hero: 'pan', nav: 'dot', coverExit: 'blind', coverDuration: 0.42 },
    photo: '/photos/pool3.webp',
  },
  {
    slug: 'kintsugi',
    name: 'Kintsugi',
    category: 'Classic',
    tier: 'Signature',
    price: 1_500_000,
    blurb:
      'Ink brown and gold, ruled like a ledger, with the story set in tight rows. Built for couples who want no ornament at all.',
    palette: {
      bg: '#14100D',
      paper: '#1D1713',
      ink: '#F3E9DA',
      soft: '#C6B49B',
      accent: '#C08A3E',
      line: '#3A2F26',
      on: '#14100D',
    },
    type: { heading: serif, weight: 500, tracking: '0.03em', caps: false },
    variant: 'ledger',
    layout: { scheduleStyle: 'list', galleryStyle: 'full', couple: 'monogram', story: 'cards', photoShape: 'square' },
    mood: 'Luxe',
    motion: { reveal: 'unfold', hero: 'lift', nav: 'underline', coverExit: 'shrink', coverDuration: 0.72 },
    photo: '/photos/pool4.webp',
  },
  {
    slug: 'kenikir',
    name: 'Kenikir',
    category: 'Floral',
    tier: 'Premium',
    price: 750_000,
    blurb:
      'Warm cream and saffron, round portraits, italic headings. The most cheerful of the soft designs without being loud about it.',
    palette: {
      bg: '#FDF6EC',
      paper: '#FFFBF4',
      ink: '#2B2117',
      soft: '#6B573F',
      accent: '#8A5716',
      line: '#EBDFC8',
      on: '#FFFBF4',
    },
    type: { heading: serif, weight: 500, tracking: '0.01em', caps: false },
    variant: 'medallion',
    layout: { scheduleStyle: 'cards', galleryStyle: 'rail', couple: 'columns', story: 'cards', photoShape: 'circle' },
    mood: 'Warm',
    motion: { reveal: 'rise', hero: 'drift', nav: 'dot', coverExit: 'iris', coverDuration: 0.5 },
    photo: '/photos/pool5.webp',
  },
  {
    slug: 'batu',
    name: 'Batu',
    category: 'Minimalist',
    tier: 'Basic',
    price: 350_000,
    blurb:
      'Stone grey and bone, square corners, a monogram instead of portraits. The plainest, fastest design in the catalogue.',
    palette: {
      bg: '#F2F2F0',
      paper: '#FAFAF8',
      ink: '#1C1C1A',
      soft: '#565650',
      accent: '#4E4F53',
      line: '#DEDED8',
      on: '#FAFAF8',
    },
    type: { heading: serif, weight: 500, tracking: '-0.01em', caps: false },
    variant: 'compact',
    layout: { scheduleStyle: 'timeline', galleryStyle: 'grid', couple: 'monogram', story: 'timeline', photoShape: 'square' },
    mood: 'Elegant',
    motion: { reveal: 'slide', hero: 'pan', nav: 'underline', coverExit: 'flip', coverDuration: 0.62 },
    photo: '/photos/pool6.webp',
  },
];

export function waLink(theme: Theme, previewUrl?: string) {
  const lines = [
    `Hi Vowlder, I’d like to order the *${theme.name}* theme (${theme.tier}, Rp ${theme.price.toLocaleString('en-US')}).`,
  ];
  if (previewUrl) lines.push(`Preview I was looking at: ${previewUrl}`);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** Prefilled brief for the custom-design thread: enough for us to quote, not a form. */
export function customWaLink() {
  const lines = [
    'Hi Vowlder, I would like a custom invitation, not one from the catalogue.',
    'Wedding date: ',
    'Venue / city: ',
    'What I have in mind (colours, type, reference): ',
  ];
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** Cards load the 480px variant; the invitation itself uses the full file. */
export const thumbOf = (photo: string) => photo.replace('/photos/', '/photos/thumbs/');

export const rupiah = (n: number) => `Rp ${n.toLocaleString('en-US')}`;
