// Design only. Content comes from wedding.ts — every template shows the same wedding.
export type Category = 'Adat' | 'Minimalis' | 'Floral' | 'Syari' | 'Oriental' | 'Klasik';

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
  | 'medallion';

/** Catalogue tag, the way template galleries label a mood. */
export type Mood = 'Elegan' | 'Romantis' | 'Natural' | 'Mewah' | 'Hangat' | 'Bold' | 'Tenang';

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
  'Empat foto bergilir di pembuka',
  'Hitung mundur ke hari H',
  'Dua rangkaian acara dan lokasi',
  'Peta, Waze, dan simpan tanggal',
  'Profil mempelai dan Instagram',
  'Cerita dalam empat babak',
  'Galeri delapan foto, bisa diperbesar',
  'Konfirmasi kehadiran, hadiah, dan buku ucapan',
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
    mood: 'Hangat',
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
    mood: 'Tenang',
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
    mood: 'Mewah',
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
    mood: 'Natural',
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
    mood: 'Tenang',
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
    mood: 'Mewah',
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
    mood: 'Bold',
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
    mood: 'Romantis',
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
    mood: 'Elegan',
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
    mood: 'Natural',
    photo: '/photos/fuji.webp',
  },
  {
    slug: 'pressed-linen',
    name: 'Pressed Linen',
    category: 'Minimalis',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Poster: foto penuh, pita warna padat, huruf besar kiri-rata, galeri satu kolom. Paling banyak ruang untuk foto.',
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
    mood: 'Bold',
    photo: '/photos/groom.webp',
  },
  {
    slug: 'amber-dusk',
    name: 'Amber Dusk',
    category: 'Klasik',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Nama tamu menyatu di atas foto, bingkai tipis, kapital berjarak lebar. Untuk resepsi malam dengan lampu rendah.',
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
    mood: 'Elegan',
    photo: '/photos/bride.webp',
  },
  {
    slug: 'linen-minimal',
    name: 'Linen Minimal',
    category: 'Minimalis',
    tier: 'Basic',
    price: 175_000,
    blurb:
      'Versi paling ringkas: monogram menggantikan foto mempelai, galeri tiga kolom, tanpa ornamen.',
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
    mood: 'Tenang',
  },
  {
    slug: 'temu-rasa',
    name: 'Temu Rasa',
    category: 'Floral',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Foto mempelai bundar, huruf miring, dan kartu lembut. Paling pas untuk akad pagi atau resepsi di rumah.',
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
    mood: 'Romantis',
    photo: '/photos/bride.webp',
  },
  {
    slug: 'pusaka',
    name: 'Pusaka',
    category: 'Adat',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Hijau tua dan emas tua, foto bundar, huruf miring. Untuk acara adat yang tetap ingin terasa tenang.',
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
    mood: 'Mewah',
    photo: '/photos/shrine.webp',
  },
  {
    slug: 'minang-gadang',
    name: 'Minang Gadang',
    category: 'Adat',
    tier: 'Signature',
    price: 650_000,
    blurb:
      'Marun dan kuning tua, bingkai ganda, kapital lebar. Untuk baralek dengan susunan acara panjang.',
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
    mood: 'Mewah',
    photo: '/photos/couple.webp',
  },
  {
    slug: 'pantai-sore',
    name: 'Pantai Sore',
    category: 'Minimalis',
    tier: 'Premium',
    price: 425_000,
    blurb:
      'Hijau laut dan pasir, foto penuh, galeri satu kolom. Untuk akad di pantai atau villa dekat laut.',
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
    mood: 'Natural',
    photo: '/photos/lake.webp',
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
