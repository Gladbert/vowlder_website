export type GuideSection = { heading: string; body: string[] };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  readingMinutes: number;
  updated: string;
  lede: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: 'what-it-costs',
    title: 'What a digital invitation actually costs',
    description:
      'A breakdown of what you pay for in an Indonesian digital wedding invitation, what drives the price up, and where the money is usually wasted.',
    readingMinutes: 5,
    updated: 'December 2026',
    lede: 'Prices in this market run from Rp 50,000 to Rp 2,000,000 for what looks like the same product. Here is what separates them.',
    sections: [
      {
        heading: 'The floor: template and link',
        body: [
          'At the bottom you are buying a page with your names on it, a countdown, a map, and a form that opens WhatsApp. That is genuinely cheap to produce, which is why Rp 50,000 invitations exist and are not a scam.',
          'What you give up is everything conditional: no guest names in the link, no reply tracking, no one to fix a typo on the day before.',
        ],
      },
      {
        heading: 'The middle: guest links and replies',
        body: [
          'The moment each guest gets their own link, someone has to generate, store, and deduplicate a few hundred of them, and replies have to land somewhere a human can read. That is the jump from Rp 150,000 to Rp 400,000, and it is the only jump most couples actually need.',
          'Ask how replies arrive. If the answer is "in your WhatsApp", you are doing the spreadsheet work yourself at 11pm.',
        ],
      },
      {
        heading: 'The top: design decisions',
        body: [
          'Above that you are paying for a palette and typeface chosen for you, a section order that fits your ceremonies, and someone on the other end of the line when your venue changes. That is craft time, not server time, and it is where the price gap between two invitations with identical features comes from.',
        ],
      },
      {
        heading: 'Where money gets wasted',
        body: [
          'Paid extras that nobody opens: guest photo uploads, live streaming nobody shares, a custom domain you will use for four months. Photographers will often supply the same photos twice; check before paying for an "album" add-on.',
        ],
      },
    ],
  },
  {
    slug: 'sending-300-links',
    title: 'Sending 300 invitations without losing your mind',
    description:
      'A practical order of work for sending guest links, tracking replies, and surviving the last week before an Indonesian wedding reception.',
    readingMinutes: 6,
    updated: 'December 2026',
    lede: 'The invitation is not the hard part. The hard part is 300 conversations happening in one WhatsApp thread.',
    sections: [
      {
        heading: 'Split the list before you send anything',
        body: [
          'Group the guest list in the invitation tool, not in your phone: family, friends, colleagues, plus-ones. Every reply you collect should carry that group, otherwise you cannot answer the only question your caterer will ask — how many people are actually coming.',
          'Do this before the first link goes out. Re-labelling 200 replies afterwards is a night you will not get back.',
        ],
      },
      {
        heading: 'Send in waves, not in one blast',
        body: [
          'Send to family first, then friends two days later, then colleagues. Each wave teaches you something: a typo in the venue, a missing name, a link that opens the wrong ceremony. Fixing that after 30 people have seen it is cheap; after 300 it is a public correction.',
        ],
      },
      {
        heading: 'Answer the same question once',
        body: [
          'Dress code, parking, and whether children are invited will be asked fifty times. Put them in the invitation, then reply with a screenshot instead of typing them out. If three people ask the same thing in a day, the invitation is missing it.',
        ],
      },
      {
        heading: 'Last week',
        body: [
          'The morning of the reception, export the reply list and print two copies: one for the door, one for the caterer. Do not rely on a phone with 8% battery at the entrance.',
          'Keep the invitation live for a month after. People photograph the map, the schedule, and the gallery long after they have replied.',
        ],
      },
    ],
  },
];
