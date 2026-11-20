// One wedding, every template. Design lives in themes.ts; this file is the content.
// Source: the real Gladbert & Monica invitation (Wedding-inv repo), photos in /public/photos.
// Events, quote, invited families, and the gift block are demo copy.
export const wedding = {
  couple: {
    groom: {
      nickname: 'Gladbert',
      fullName: 'Gladbert Sogo Fanrensen',
      parents: '(✝︎) Mr. Go Fandy Fransisco & Mrs. Lie Lilik Ratnawati',
      birthOrder: 'First son',
      instagram: 'https://www.instagram.com/gladbert',
      photo: '/photos/groom.webp',
    },
    bride: {
      nickname: 'Monica',
      fullName: 'Monica Adelia',
      parents: 'Mr. Lukas Setiawan & Mrs. Tresiana Siauw Mee',
      birthOrder: 'Second daughter',
      instagram: 'https://www.instagram.com/monicaadelia27',
      photo: '/photos/bride.webp',
    },
  },
  initials: 'G & M',
  hashtag: '#GladbertMonica',
  dateLabel: 'Saturday, 19 December 2026',
  shortDate: '19 . 12 . 2026',

  salam: 'Peace be with you.',
  greeting:
    "By God's grace, we would like to invite you to the wedding of our son and daughter.",
  quote: {
    text: "We're not getting married because we have it all figured out. We're doing it because we want to figure it out together.",
    by: 'From the two of us',
  },

  events: [
    {
      label: 'Holy Matrimony',
      title: 'The Ceremony',
      subtitle: 'Vows and blessing',
      dateLabel: 'Friday, 18 December 2026',
      dayLabel: 'Friday',
      dayNumber: '18',
      monthYear: 'December 2026',
      timeLabel: '4.00 – 5.30 PM WIB',
      iso: '2026-12-18T16:00:00+07:00',
      venue: 'HARRIS Hotel & Conventions Gubeng',
      room: 'Bromo Room, 3rd floor',
      address: 'Jl. Bangka No. 8-18, Gubeng',
      city: 'Surabaya, East Java 60281',
      cityShort: 'Surabaya',
      mapsUrl: 'https://maps.app.goo.gl/uSyZmd2mfscrhwoMA',
      wazeUrl: 'https://waze.com/ul?q=HARRIS+Hotel+%26+Conventions+Gubeng+Surabaya',
      transit: 'From Surabaya Gubeng station (East exit), about six minutes by car.',
      parking: 'Guest parking is in the hotel basement.',
      dressCode: 'Smart and neat. Immediate family will wear the agreed colours.',
      note: 'Please arrive twenty minutes before the ceremony starts.',
    },
    {
      label: 'Reception',
      title: 'The Reception',
      subtitle: 'Dinner and dancing',
      dateLabel: 'Saturday, 19 December 2026',
      dayLabel: 'Saturday',
      dayNumber: '19',
      monthYear: 'December 2026',
      timeLabel: '6.00 PM WIB (GMT+7)',
      iso: '2026-12-19T18:00:00+07:00',
      venue: 'HARRIS Hotel & Conventions Gubeng',
      room: 'Grand Ballroom',
      address: 'Jl. Bangka No. 8-18, Gubeng',
      city: 'Surabaya, East Java 60281',
      cityShort: 'Surabaya',
      mapsUrl: 'https://maps.app.goo.gl/uSyZmd2mfscrhwoMA',
      wazeUrl: 'https://waze.com/ul?q=HARRIS+Hotel+%26+Conventions+Gubeng+Surabaya',
      transit: 'From Surabaya Gubeng station (East exit). Drop-off is at the hotel lobby.',
      parking: 'Guest parking is in the hotel basement.',
      dressCode: 'Men: suit and tie, no batik. Women: evening dress.',
      note: 'Please arrive fifteen minutes before the reception starts.',
    },
  ],
  /** Main event: drives the cover, the hero date, and the RSVP deadline. */
  event: {
    label: 'Reception',
    title: 'The Reception',
    subtitle: 'Dinner and dancing',
    dateLabel: 'Saturday, 19 December 2026',
    dayLabel: 'Saturday',
    dayNumber: '19',
    monthYear: 'December 2026',
    timeLabel: '6.00 PM WIB (GMT+7)',
    iso: '2026-12-19T18:00:00+07:00',
    venue: 'HARRIS Hotel & Conventions Gubeng',
    room: 'Grand Ballroom',
    address: 'Jl. Bangka No. 8-18, Gubeng',
    city: 'Surabaya, East Java 60281',
    cityShort: 'Surabaya',
    mapsUrl: 'https://maps.app.goo.gl/uSyZmd2mfscrhwoMA',
    wazeUrl: 'https://waze.com/ul?q=HARRIS+Hotel+%26+Conventions+Gubeng+Surabaya',
    transit: 'From Surabaya Gubeng station (East exit). Drop-off is at the hotel lobby.',
    parking: 'Guest parking is in the hotel basement.',
    dressCode: 'Men: suit and tie, no batik. Women: evening dress.',
    note: 'Please arrive fifteen minutes before the reception starts.',
  },

  invited: ['The Go family', 'The Setiawan family', 'The Siauw family'],

  gift: {
    note: "No gift is expected, and your presence is already plenty. If you'd still like to send something, ask either of us for the account details.",
    channels: ['BCA', 'Mandiri', 'GoPay', 'OVO', 'QRIS', 'Physical gift'],
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
        'We met in Surabaya. Back then we were just two people in the same circle, with no plan beyond the next lunch.',
      photo: '/photos/couple.webp',
    },
    {
      year: '2019',
      title: 'Our Journey',
      subtitle: 'Our Kind of Love',
      narrative:
        'Dinners turned into late phone calls, and eventually into days that felt wrong if we did not talk.',
      photo: '/photos/kyoto.webp',
    },
    {
      year: '2025',
      title: 'Sangjit',
      subtitle: 'Our Stories, Intertwined',
      narrative: 'Two families finally sat at one table. Blessings given, dates picked.',
      photo: '/photos/candid.webp',
    },
    {
      year: '2026',
      title: 'Holy Matrimony',
      subtitle: 'A Vow for Always',
      narrative: 'Promises made in front of family. Not the finish line, just the next page.',
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
    subtitle: 'Prewedding film, Kyoto and Mount Fuji',
    url: 'https://www.youtube.com/shorts/3QU6E5Mc33c',
  },

  wishes: [
    {
      name: 'Rina',
      message: 'Congratulations, you two. Wishing you a long life together and very few arguments.',
    },
    {
      name: 'Toni',
      message: 'Glad! Finally. Send the leftover catering to the office, yeah?',
    },
    {
      name: 'Dwi',
      message: 'So happy for you both. Hope everything goes smoothly until the big day.',
    },
    {
      name: 'The Siauw family',
      message: 'Our best wishes from all of us. See you in Surabaya.',
    },
    {
      name: 'Nadia',
      message: 'About time! Wishing you fifty years and counting. See you next month.',
    },
    {
      name: 'Maria & Yusuf',
      message: 'May God bless your marriage. Congratulations, Monica!',
    },
  ],
};

export type Wedding = typeof wedding;
