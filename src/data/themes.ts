// Design only. Content comes from wedding.ts — every template shows the same wedding.
export type Category = 'Adat' | 'Minimalis' | 'Floral' | 'Syari' | 'Oriental' | 'Klasik';

export type Tier = 'Basic' | 'Premium' | 'Signature';

/** Layout shell. Colours always come from the palette. */
export type Variant = 'faithful' | 'classic' | 'editorial' | 'split';

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
  /** Card thumbnail photo. Omit for a purely typographic card. */
  photo?: string;
  /** Path to a loopable track. Leave undefined and the music control stays hidden. */
  music?: string;
};

export const categories: Category[] = [
  'Adat',
  'Minimalis',
  'Floral',
  'Syari',
  'Oriental',
  'Klasik',
];

export const WA_NUMBER = '6281234567890';

const serif = "'Cormorant Garamond Variable', Georgia, serif";

/** Identical in every template — the design differs, the invitation does not. */
export const includedFeatures = [
  'Slideshow empat foto',
  'Hitung mundur hari H',
  'Profil mempelai & Instagram',
  'Cerita dalam empat babak',
  'Detail acara, peta & Waze',
  'Galeri delapan foto',
  'Buku ucapan tamu',
  'Nama tamu dari tautan',
];

export const themes: Theme[] = [
  {
    slug: 'gladbert-monica',
    name: 'Gladbert & Monica',
    category: 'Minimalis',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Tema yang dipakai di acara aslinya: krem, emas, dan burgundy, dengan alur yang sudah diuji di lapangan.',
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
    photo: '/photos/cover.webp',
  },
  {
    slug: 'kyoto-sepia',
    name: 'Kyoto Sepia',
    category: 'Minimalis',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Editorial kiri-rata: nomor bagian, huruf besar, foto sebagai pita. Untuk pasangan yang tidak suka ornamen.',
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
    photo: '/photos/kyoto.webp',
  },
  {
    slug: 'javanese-royal',
    name: 'Javanese Royal',
    category: 'Adat',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Cokelat tua dan emas, bingkai ganda, huruf kapital berspasi lebar. Untuk prosesi adat dan panggih.',
    palette: {
      bg: '#1E1712',
      paper: '#2A211A',
      ink: '#F3E7D3',
      soft: '#CDBBA0',
      accent: '#D9B34A',
      line: '#4A3A28',
      on: '#1E1712',
    },
    type: { heading: serif, weight: 600, tracking: '0.04em', caps: false },
    variant: 'classic',
    photo: '/photos/couple.webp',
  },
  {
    slug: 'floral-garden',
    name: 'Floral Garden',
    category: 'Floral',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Sage dan putih, kartu membulat, foto mempelai berdampingan. Untuk akad di taman atau villa.',
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
    photo: '/photos/bamboo.webp',
  },
  {
    slug: 'islamic-syari',
    name: 'Islamic Syari',
    category: 'Syari',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Hijau tua dan emas pucat, tanpa musik sebagai bawaan, dengan catatan adab tamu di bagian acara.',
    palette: {
      bg: '#0F2A24',
      paper: '#153A31',
      ink: '#F1EAD9',
      soft: '#C6D0C0',
      accent: '#D5BC86',
      line: '#2B5648',
      on: '#0F2A24',
    },
    type: { heading: serif, weight: 500, tracking: '0.02em', caps: false },
    variant: 'split',
    photo: '/photos/shrine.webp',
  },
  {
    slug: 'oriental-red-gold',
    name: 'Oriental Red Gold',
    category: 'Oriental',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Merah tua dan emas, bingkai ganda, kapital berjarak lebar. Untuk teapai, sangjit, dan resepsi malam.',
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
    photo: '/photos/candid.webp',
  },
  {
    slug: 'art-deco',
    name: 'Art Deco',
    category: 'Klasik',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Hitam dan kuning tua, garis tipis, nomor bagian besar. Untuk resepsi hotel dengan tata lampu rendah.',
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
    photo: '/photos/hero1.webp',
  },
  {
    slug: 'cotton-blush',
    name: 'Cotton Blush',
    category: 'Floral',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Merah muda pucat dan terracotta, kartu membulat, banyak ruang kosong. Untuk akad pagi dan resepsi intim.',
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
    photo: '/photos/lake.webp',
  },
  {
    slug: 'midnight-noir',
    name: 'Midnight Noir',
    category: 'Klasik',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Biru arang dan perak, tipografi editorial, tanpa hiasan. Untuk pasangan yang mau undangan nyaris tanpa warna.',
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
    photo: '/photos/shibuya.webp',
  },
  {
    slug: 'sunda-sekar',
    name: 'Sunda Sekar',
    category: 'Adat',
    tier: 'Basic',
    price: 175_000,
    blurb:
      'Krem dan kuning tua, rapi dan sederhana. Versi paling ringan dari susunan yang sama.',
    palette: {
      bg: '#F6F1E6',
      paper: '#FFFDF8',
      ink: '#2B2A22',
      soft: '#655D48',
      accent: '#7F6229',
      line: '#E0D6C2',
      on: '#FFFDF8',
    },
    type: { heading: serif, weight: 500, tracking: '0.02em', caps: true },
    variant: 'faithful',
    photo: '/photos/fuji.webp',
  },
];

export function waLink(theme: Theme, previewUrl?: string) {
  const lines = [
    `Halo Vowlder, saya mau pesan tema *${theme.name}* (${theme.tier} – Rp ${theme.price.toLocaleString('id-ID')}).`,
  ];
  if (previewUrl) lines.push(`Preview yang saya lihat: ${previewUrl}`);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
