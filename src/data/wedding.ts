// One wedding, every template. Design lives in themes.ts; this file is the content.
// Source: the real Gladbert & Monica invitation (Wedding-inv repo), photos in /public/photos.
// Events, quote, invited families, and the gift block are demo copy.

const matrimony = {
  label: 'Pemberkatan',
  title: 'Holy Matrimony',
  subtitle: 'Pemberkatan pernikahan',
  dateLabel: 'Jumat, 18 Desember 2026',
  dayLabel: 'Jumat',
  dayNumber: '18',
  monthYear: 'Desember 2026',
  timeLabel: '16.00 – 17.30 WIB',
  iso: '2026-12-18T16:00:00+07:00',
  venue: 'HARRIS Hotel & Conventions Gubeng',
  room: 'Ruang Bromo, lantai 3',
  address: 'Jl. Bangka No. 8-18, Gubeng',
  city: 'Surabaya, Jawa Timur 60281',
  cityShort: 'Surabaya',
  mapsUrl: 'https://maps.app.goo.gl/uSyZmd2mfscrhwoMA',
  wazeUrl: 'https://waze.com/ul?q=HARRIS+Hotel+%26+Conventions+Gubeng+Surabaya',
  transit: 'Dari Stasiun Surabaya Gubeng (Pintu Timur), 6 menit berkendara.',
  parking: 'Parkir tamu tersedia di basement hotel.',
  dressCode: 'Sopan dan rapi. Keluarga inti memakai warna yang sudah ditentukan.',
  note: 'Mohon hadir 20 menit sebelum pemberkatan dimulai.',
};

const reception = {
  label: 'Resepsi',
  title: 'The Wedding Reception',
  subtitle: 'Reception & Dinner',
  dateLabel: 'Sabtu, 19 Desember 2026',
  dayLabel: 'Sabtu',
  dayNumber: '19',
  monthYear: 'Desember 2026',
  timeLabel: '18.00 WIB (GMT+7)',
  iso: '2026-12-19T18:00:00+07:00',
  venue: 'HARRIS Hotel & Conventions Gubeng',
  room: 'Grand Ballroom',
  address: 'Jl. Bangka No. 8-18, Gubeng',
  city: 'Surabaya, Jawa Timur 60281',
  cityShort: 'Surabaya',
  mapsUrl: 'https://maps.app.goo.gl/uSyZmd2mfscrhwoMA',
  wazeUrl: 'https://waze.com/ul?q=HARRIS+Hotel+%26+Conventions+Gubeng+Surabaya',
  transit: 'Dari Stasiun Surabaya Gubeng (Pintu Timur). Drop-off tamu di grand lobby hotel.',
  parking: 'Parkir tamu tersedia di basement hotel.',
  dressCode: 'Pria: jas dan dasi (tanpa batik). Wanita: gaun malam.',
  note: 'Mohon hadir 15 menit sebelum acara dimulai.',
};

export const wedding = {
  couple: {
    groom: {
      nickname: 'Gladbert',
      fullName: 'Gladbert Sogo Fanrensen',
      shortParents: 'Putra dari (✝︎) Mr. Go Fandy Fransisco & Mrs. Lie Lilik Ratnawati',
      parents: '(✝︎) Mr. Go Fandy Fransisco & Mrs. Lie Lilik Ratnawati',
      birthOrder: 'Putra pertama',
      instagram: 'https://www.instagram.com/gladbert',
      photo: '/photos/groom.webp',
    },
    bride: {
      nickname: 'Monica',
      fullName: 'Monica Adelia',
      shortParents: 'Putri dari Mr. Lukas Setiawan & Mrs. Tresiana Siauw Mee',
      parents: 'Mr. Lukas Setiawan & Mrs. Tresiana Siauw Mee',
      birthOrder: 'Putri kedua',
      instagram: 'https://www.instagram.com/monicaadelia27',
      photo: '/photos/bride.webp',
    },
  },
  initials: 'G & M',
  hashtag: '#GladbertMonica',
  dateLabel: 'Sabtu, 19 Desember 2026',
  shortDate: '19 . 12 . 2026',

  salam: 'Salam sejahtera untuk kita semua.',
  greeting:
    'Dengan memohon penyertaan Tuhan, kami bermaksud menyelenggarakan pernikahan putra-putri kami.',
  quote: {
    text: 'Kami menikah bukan karena sudah selesai, tapi karena mau belajar bersama.',
    by: 'Dari kami berdua',
  },

  events: [matrimony, reception],
  /** Main event: drives the cover, the hero date, and the RSVP deadline. */
  event: reception,

  invited: ['Keluarga Go', 'Keluarga Setiawan', 'Keluarga Siauw'],

  gift: {
    note: 'Tanpa mengurangi rasa hormat, bagi yang ingin memberi tanda kasih, nomor rekening dan e-wallet bisa diminta langsung ke mempelai.',
    channels: ['BCA', 'Mandiri', 'GoPay', 'OVO', 'QRIS', 'Kado fisik'],
  },

  heroSlides: [
    { src: '/photos/hero1.webp', location: 'Kawagoe, Japan' },
    { src: '/photos/couple.webp', location: 'Kawaguchiko, Japan' },
    { src: '/photos/kyoto.webp', location: 'Gion, Kyoto' },
    { src: '/photos/fuji.webp', location: 'Shimoyoshida, Japan' },
  ],

  story: [
    {
      year: '2016',
      title: 'Our First Page',
      subtitle: 'Where Our Paths Met',
      narrative:
        'Ketemu pertama kali di Surabaya. Waktu itu cuma teman satu lingkaran, belum kepikiran ke mana-mana.',
      photo: '/photos/couple.webp',
    },
    {
      year: '2019',
      title: 'Our Journey',
      subtitle: 'Our Kind of Love',
      narrative:
        'Dari makan bareng, telpon tiap malam, sampai akhirnya tidak ada hari yang lewat tanpa cerita.',
      photo: '/photos/kyoto.webp',
    },
    {
      year: '2025',
      title: 'Sangjit',
      subtitle: 'Our Stories, Intertwined',
      narrative: 'Dua keluarga akhirnya duduk satu meja. Restu didapat, tanggal mulai dipilih.',
      photo: '/photos/candid.webp',
    },
    {
      year: '2026',
      title: 'Holy Matrimony',
      subtitle: 'A Vow for Always',
      narrative: 'Janji di depan keluarga. Bukan garis akhir, cuma halaman baru.',
      photo: '/photos/fuji.webp',
    },
  ],

  gallery: [
    {
      title: 'Together, Slowly',
      caption: 'Somewhere along the way, we found a pace that feels like ours.',
      location: 'Lake Kawaguchi, Japan',
      photo: '/photos/lake.webp',
    },
    {
      title: 'Same Place, Different World',
      caption: 'The city was loud. Somehow, it felt quiet with you.',
      location: 'Shibuya, Japan',
      photo: '/photos/shibuya.webp',
    },
    {
      title: 'While the World Goes By',
      caption: 'Everything was passing through, but for a moment, we stayed.',
      location: 'Kawagoe, Japan',
      photo: '/photos/bamboo.webp',
    },
    {
      title: 'The Road We Choose',
      caption: 'There may be many ways forward. I would still choose this one with you.',
      location: 'Kawaguchiko, Japan',
      photo: '/photos/fuji.webp',
    },
    {
      title: 'Under the Blossoms',
      caption: 'Some seasons pass, some moments stay with us.',
      location: 'Gion, Kyoto',
      photo: '/photos/kyoto.webp',
    },
    {
      title: 'A Place of Our Own',
      caption: "Perhaps home isn't where we are, but who we're with.",
      location: 'Shibuya, Japan',
      photo: '/photos/shrine.webp',
    },
    {
      title: 'A Passing Frame',
      caption: 'A moment that lasted only seconds, but somehow stayed.',
      location: 'Heritage District, Kyoto',
      photo: '/photos/cover.webp',
    },
    {
      title: 'Us, Along the Way',
      caption: 'Not every memory needs a reason to be worth keeping.',
      location: 'Shimoyoshida, Japan',
      photo: '/photos/couple.webp',
    },
  ],

  video: {
    title: 'Gladbert & Monica: An Eternal Promise',
    subtitle: 'Prewedding film, Kyoto & Mount Fuji',
    url: 'https://www.youtube.com/shorts/3QU6E5Mc33c',
  },

  wishes: [
    {
      name: 'Rina',
      message: 'Selamat menempuh hidup baru. Semoga langgeng terus, rukun sampai kapan pun.',
    },
    {
      name: 'Toni',
      message: 'Glad! Selamat ya. Jangan lupa sisa catering-nya dikirim ke kantor.',
    },
    {
      name: 'Dwi',
      message: 'Turut berbahagia. Semoga semua dipermudah sampai hari H.',
    },
    {
      name: 'Keluarga Siauw',
      message: 'Doa terbaik dari kami semua. Sampai ketemu di Surabaya, ya.',
    },
    {
      name: 'Nadia',
      message: 'Akhirnya! Semoga langgeng sampai kakek-nenek. Sampai jumpa bulan depan.',
    },
    {
      name: 'Maria & Yusuf',
      message: 'Tuhan memberkati kalian berdua. Selamat ya, Monica!',
    },
  ],
};

export type Wedding = typeof wedding;
