// One wedding, every template. Design lives in themes.ts; this file is the content.
// Source: the real Gladbert & Monica invitation (Wedding-inv repo), photos in /public/photos.
export const wedding = {
  couple: {
    groom: {
      nickname: 'Gladbert',
      fullName: 'Gladbert Sogo Fanrensen',
      parents: 'Putra dari (✝︎) Mr. Go Fandy Fransisco & Mrs. Lie Lilik Ratnawati',
      instagram: 'https://www.instagram.com/gladbert',
      photo: '/photos/groom.webp',
    },
    bride: {
      nickname: 'Monica',
      fullName: 'Monica Adelia',
      parents: 'Putri dari Mr. Lukas Setiawan & Mrs. Tresiana Siauw Mee',
      instagram: 'https://www.instagram.com/monicaadelia27',
      photo: '/photos/bride.webp',
    },
  },
  initials: 'G & M',
  dateLabel: 'Sabtu, 19 Desember 2026',
  shortDate: '19 . 12 . 2026',
  hashtag: '#GladbertMonica',
  heroSlides: [
    { src: '/photos/hero1.webp', location: 'Kawagoe, Japan' },
    { src: '/photos/couple.webp', location: 'Kawaguchiko, Japan' },
    { src: '/photos/kyoto.webp', location: 'Gion, Kyoto' },
    { src: '/photos/fuji.webp', location: 'Shimoyoshida, Japan' },
  ],
  event: {
    label: 'Resepsi',
    title: 'The Wedding Reception',
    subtitle: 'Reception & Dinner',
    dateLabel: 'Sabtu, 19 Desember 2026',
    timeLabel: '18.00 WIB (GMT+7)',
    iso: '2026-12-19T18:00:00+07:00',
    venue: 'HARRIS Hotel & Conventions Gubeng',
    address: 'Jl. Bangka No. 8-18, Gubeng',
    city: 'Surabaya, Jawa Timur 60281',
    mapsUrl: 'https://maps.app.goo.gl/uSyZmd2mfscrhwoMA',
    wazeUrl: 'https://waze.com/ul?q=HARRIS+Hotel+%26+Conventions+Gubeng+Surabaya',
    transit: 'Dari Stasiun Surabaya Gubeng (Pintu Timur). Drop-off tamu di grand lobby hotel.',
    parking: 'Parkir tamu tersedia di basement hotel.',
    dressCode: 'Pria: jas dan dasi (tanpa batik). Wanita: gaun malam.',
  },
  story: [
    {
      year: '2016',
      title: 'Our First Page',
      subtitle: 'Where Our Paths Met',
      narrative: 'Sebuah hari di Surabaya yang jadi halaman pertama cerita kami.',
      photo: '/photos/couple.webp',
    },
    {
      year: '2019',
      title: 'Our Journey',
      subtitle: 'Our Kind of Love',
      narrative: 'Enam tahun momen kecil yang ternyata berarti semua.',
      photo: '/photos/kyoto.webp',
    },
    {
      year: '2025',
      title: 'Sangjit',
      subtitle: 'Our Stories, Intertwined',
      narrative: 'Dua keluarga, satu doa restu.',
      photo: '/photos/candid.webp',
    },
    {
      year: '2026',
      title: 'Holy Matrimony',
      subtitle: 'A Vow for Always',
      narrative: 'Janji untuk saling menjaga di setiap musim kehidupan.',
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
    { name: 'Rina', message: 'Selamat menempuh hidup baru, Gladbert & Monica. Bahagia selalu.' },
    { name: 'Dwi', message: 'Turut berbahagia. Semoga semua lancar sampai hari H.' },
    { name: 'Keluarga Siauw', message: 'Doa terbaik untuk kalian berdua. Sampai jumpa di Surabaya.' },
  ],
};

export type Wedding = typeof wedding;
