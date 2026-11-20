import { wedding } from '../data/wedding';

const START = new Date(wedding.event.iso);
const END = new Date(START.getTime() + 4 * 60 * 60 * 1000);

const stamp = (date: Date) => `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

const summary = `${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname} — ${wedding.event.title}`;
const location = `${wedding.event.venue}, ${wedding.event.address}, ${wedding.event.city}`;
const details = `${wedding.event.subtitle}. ${wedding.event.dressCode}`;

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates: `${stamp(START)}/${stamp(END)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vowlder//Invitation//ID',
    'BEGIN:VEVENT',
    `UID:${START.getTime()}@vowlder`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(START)}`,
    `DTEND:${stamp(END)}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${details}`,
    'END:VEVENT',
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
