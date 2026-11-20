import { wedding } from '../data/wedding';

const stamp = (date: Date) => `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

const place = (event: (typeof wedding.events)[number]) =>
  [event.venue, event.room, event.address, event.city].filter(Boolean).join(', ');

const details = (event: (typeof wedding.events)[number]) =>
  `${event.subtitle}. ${event.dressCode} ${event.note}`;

const summary = (event: (typeof wedding.events)[number]) =>
  `${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname} — ${event.title}`;

const span = (event: (typeof wedding.events)[number], hours: number) => {
  const start = new Date(event.iso);
  return { start, end: new Date(start.getTime() + hours * 3_600_000) };
};

/** Google Calendar handles one event per link, so the first ceremony wins. */
export function googleCalendarUrl() {
  const event = wedding.events[0];
  const { start, end } = span(event, 2);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary(event),
    dates: `${stamp(start)}/${stamp(end)}`,
    details: details(event),
    location: place(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs() {
  const events = wedding.events.flatMap((event, index) => {
    const { start, end } = span(event, index === 0 ? 2 : 4);
    return [
      'BEGIN:VEVENT',
      `UID:${start.getTime()}@vowlder`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${summary(event)}`,
      `LOCATION:${place(event)}`,
      `DESCRIPTION:${details(event)}`,
      'END:VEVENT',
    ];
  });

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vowlder//Invitation//ID',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'undangan-pernikahan.ics';
  document.body.append(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the download in some browsers.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
