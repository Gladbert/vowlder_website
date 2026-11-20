import { guestInvitation } from './guest-invitation';

export type Category = 'Adat' | 'Minimalis' | 'Floral' | 'Syari' | 'Oriental';

export type Tier = 'Basic' | 'Premium' | 'Signature';

export type ThemeEvent = {
  label: string;
  date: string;
  time: string;
  place: string;
  address: string;
};

export type Theme = {
  slug: string;
  name: string;
  category: Category;
  tier: Tier;
  price: number;
  blurb: string;
  /** Palette drives the card thumbnail and the live preview. Single source of truth. */
  palette: { bg: string; paper: string; ink: string; accent: string; line: string };
  type: { heading: string; weight: number; tracking: string; caps: boolean };
  couple: { groom: string; bride: string; initials: string };
  events: ThemeEvent[];
  features: string[];
  /** Card thumbnail photo. Omit for a purely typographic card. */
  photo?: string;
  /** 'guest' renders the full ported invitation; default is the typographic shell. */
  renderer?: 'guest';
  /** Path to a loopable track. Leave undefined and the music control stays hidden. */
  music?: string;
};

export const categories: Category[] = ['Adat', 'Minimalis', 'Floral', 'Syari', 'Oriental'];

export const WA_NUMBER = '6281234567890';

const cormorant = "'Cormorant Garamond Variable', Georgia, serif";

export const themes: Theme[] = [
  {
    slug: guestInvitation.slug,
    name: 'Gladbert & Monica',
    category: 'Minimalis',
    tier: 'Signature',
    price: 550_000,
    blurb:
      'Undangan lengkap yang sudah dipakai: slideshow, hitung mundur, peta, galeri, dan buku ucapan.',
    palette: { bg: '#F3EFEA', paper: '#FAF8F5', ink: '#1C1714', accent: '#8A5C2E', line: '#E1D5C2' },
    type: { heading: cormorant, weight: 500, tracking: '-0.01em', caps: false },
    couple: {
      groom: guestInvitation.couple.groom.nickname,
      bride: guestInvitation.couple.bride.nickname,
      initials: 'G & M',
    },
    events: [
      {
        label: 'Resepsi',
        date: guestInvitation.event.dateLabel,
        time: guestInvitation.event.timeLabel,
        place: guestInvitation.event.venue,
        address: guestInvitation.event.city,
      },
    ],
    features: ['Slideshow foto', 'Hitung mundur', 'Galeri + buku ucapan', 'Peta lokasi'],
    photo: '/photos/cover.webp',
    renderer: 'guest',
  },
  {
    slug: 'javanese-royal',
    name: 'Javanese Royal',
    category: 'Adat',
    tier: 'Signature',
    price: 550_000,
    blurb: 'Motif batik parang, aksara Jawa, dan urutan prosesi siraman sampai panggih.',
    palette: { bg: '#1E1712', paper: '#2A211A', ink: '#F3E7D3', accent: '#C9A227', line: '#4A3A28' },
    type: { heading: cormorant, weight: 600, tracking: '0.04em', caps: false },
    couple: { groom: 'Bagas', bride: 'Sekar', initials: 'B & S' },
    events: [
      {
        label: 'Akad Nikah',
        date: 'Sabtu, 14 Maret 2026',
        time: '08.00 – 10.00 WIB',
        place: 'Pendopo Agung Dalem Ngabean',
        address: 'Jl. Kadipaten No. 12, Yogyakarta',
      },
      {
        label: 'Resepsi',
        date: 'Sabtu, 14 Maret 2026',
        time: '11.00 – 15.00 WIB',
        place: 'Pendopo Agung Dalem Ngabean',
        address: 'Jl. Kadipaten No. 12, Yogyakarta',
      },
    ],
    features: ['Prosesi panggih & siraman', 'Peta lokasi', 'Amplop digital', 'RSVP WhatsApp'],
  },
  {
    slug: 'floral-garden',
    name: 'Floral Garden',
    category: 'Floral',
    tier: 'Premium',
    price: 325_000,
    blurb: 'Ilustrasi bunga air-brush, palet sage, cocok untuk acara taman atau villa.',
    palette: { bg: '#F2F5EE', paper: '#FBFCF9', ink: '#2C3A2E', accent: '#566E4F', line: '#D3DCCB' },
    type: { heading: cormorant, weight: 500, tracking: '0.01em', caps: false },
    couple: { groom: 'Fajar', bride: 'Nadia', initials: 'F & N' },
    events: [
      {
        label: 'Akad Nikah',
        date: 'Sabtu, 22 Agustus 2026',
        time: '08.30 – 10.30 WIB',
        place: 'Villa Garden Cisarua',
        address: 'Jl. Raya Puncak Km. 84, Bogor',
      },
      {
        label: 'Garden Party',
        date: 'Sabtu, 22 Agustus 2026',
        time: '11.00 – 15.00 WIB',
        place: 'Villa Garden Cisarua',
        address: 'Jl. Raya Puncak Km. 84, Bogor',
      },
    ],
    features: ['Galeri foto', 'Dress code', 'Peta lokasi', 'RSVP WhatsApp'],
  },
  {
    slug: 'islamic-syari',
    name: 'Islamic Syari',
    category: 'Syari',
    tier: 'Premium',
    price: 325_000,
    blurb: 'Nuansa geometris tanpa musik default, lengkap dengan catatan adab dan pemisahan tamu.',
    palette: { bg: '#0F2A24', paper: '#153A31', ink: '#F1EAD9', accent: '#BFA36A', line: '#2B5648' },
    type: { heading: cormorant, weight: 500, tracking: '0.02em', caps: false },
    couple: { groom: 'Ilham', bride: 'Aisyah', initials: 'I & A' },
    events: [
      {
        label: 'Akad Nikah',
        date: 'Sabtu, 3 Oktober 2026',
        time: '07.30 – 09.30 WIB',
        place: 'Masjid Al-Azhar BSD',
        address: 'Jl. Puspitaloka Raya, BSD, Tangerang Selatan',
      },
      {
        label: 'Walimah',
        date: 'Sabtu, 3 Oktober 2026',
        time: '10.00 – 14.00 WIB',
        place: 'Gedung Serbaguna Al-Azhar',
        address: 'Jl. Puspitaloka Raya, BSD, Tangerang Selatan',
      },
    ],
    features: ['Tanpa musik (default)', 'Catatan adab tamu', 'Pintu tamu terpisah', 'RSVP WhatsApp'],
  },
  {
    slug: 'oriental-red-gold',
    name: 'Oriental Red Gold',
    category: 'Oriental',
    tier: 'Signature',
    price: 550_000,
    blurb: 'Merah tua dan emas, dengan rangkaian teapai, sangjit, dan susunan meja tamu.',
    palette: { bg: '#2A0E0E', paper: '#3A1414', ink: '#FBEEE0', accent: '#D9A54A', line: '#5C2222' },
    type: { heading: cormorant, weight: 600, tracking: '0.06em', caps: false },
    couple: { groom: 'Kevin', bride: 'Melissa', initials: 'K & M' },
    events: [
      {
        label: 'Teapai',
        date: 'Jumat, 28 November 2026',
        time: '09.00 – 11.00 WIB',
        place: 'Rumah keluarga mempelai wanita',
        address: 'Jl. Pantai Indah Utara Blok A3, Jakarta Utara',
      },
      {
        label: 'Reception',
        date: 'Sabtu, 29 November 2026',
        time: '17.00 – 21.00 WIB',
        place: 'Grand Ballroom Studio 88',
        address: 'Jl. Pangeran Tubagus Angke No. 88, Jakarta Barat',
      },
    ],
    features: ['Rundown teapai & sangjit', 'Peta lokasi', 'Amplop digital', 'RSVP WhatsApp'],
  },
  {
    slug: 'sunda-sekar',
    name: 'Sunda Sekar',
    category: 'Adat',
    tier: 'Basic',
    price: 175_000,
    blurb: 'Satu halaman, tiga bagian. Untuk akad kecil di rumah dengan prosesi sawer yang singkat.',
    palette: { bg: '#F6F1E6', paper: '#FFFDF8', ink: '#2B2A22', accent: '#7F6229', line: '#E0D6C2' },
    type: { heading: cormorant, weight: 500, tracking: '0.02em', caps: true },
    couple: { groom: 'Adit', bride: 'Rani', initials: 'A & R' },
    events: [
      {
        label: 'Akad & Sawer',
        date: 'Minggu, 12 April 2026',
        time: '09.00 – 12.00 WIB',
        place: 'Kediaman keluarga',
        address: 'Jl. Cigadung Raya Tengah No. 4, Bandung',
      },
    ],
    features: ['Satu halaman', 'Peta lokasi', 'RSVP WhatsApp'],
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
