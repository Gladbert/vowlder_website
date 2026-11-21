// Calendar integration. Values come from the live config so an admin edit to the
// couple's names, date, time or venue reaches "Add to Google Calendar" and the
// .ics download too — they used to be literals here, duplicating
// wedding-config.json and going stale the moment anything changed.
import { getWeddingConfig } from '../store/config';
import { escapeIcsText } from './escape';

/** The event the calendar buttons describe, derived from the config. */
function eventInfo() {
  const cfg = getWeddingConfig();
  const couple = cfg.couple;
  const coupleInfo = cfg.coupleInfo;

  const groom = couple?.groom?.nickname || coupleInfo?.groom?.nickname || 'Gladbert';
  const bride = couple?.bride?.nickname || coupleInfo?.bride?.nickname || 'Monica';

  const startMs = new Date(couple?.eventDate || coupleInfo?.eventDate || '').getTime();
  const valid = Number.isFinite(startMs);
  // The reception runs four hours from the ceremony start; fall back to the
  // documented 18:00–22:00 WIB when the config carries no date.
  const start = valid ? new Date(startMs) : new Date('2026-12-19T18:00:00+07:00');
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const venue = coupleInfo?.venueSummary || couple?.venueSummary || 'HARRIS Hotel & Conventions Gubeng - Surabaya';
  const mapsUrl = coupleInfo?.mapsUrl || couple?.mapsUrl || '';
  const formattedDate = coupleInfo?.formattedDate || couple?.formattedDate || '';
  const time = coupleInfo?.time || couple?.time || '';

  return { groom, bride, start, end, venue, mapsUrl, formattedDate, time };
}

/** `YYYYMMDDTHHMMSSZ` — the only format both Google Calendar and iCal accept. */
function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function getGoogleCalendarUrl(): string {
  const { groom, bride, start, end, venue, mapsUrl, formattedDate, time } = eventInfo();
  const title = encodeURIComponent(`The Wedding of ${groom} & ${bride}`);
  const details = encodeURIComponent(
    [
      `The Wedding Reception of ${groom} & ${bride}`,
      '',
      [formattedDate, time].filter(Boolean).join(' · '),
      venue,
      mapsUrl,
      '',
      `We look forward to celebrating with you!`,
      `${groom} & ${bride}`,
    ]
      .filter((l) => l !== undefined)
      .join('\n')
  );
  const location = encodeURIComponent(venue);
  const dates = `${icsStamp(start)}/${icsStamp(end)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadIcsFile(): void {
  const { groom, bride, start, end, venue, mapsUrl, formattedDate, time } = eventInfo();
  const uid = `wedding-${icsStamp(start)}@wedding.app`;
  const description = [
    `The Wedding Reception of ${groom} & ${bride}`,
    [formattedDate, time].filter(Boolean).join(' at '),
    venue,
    mapsUrl,
  ]
    .filter(Boolean)
    .join('\\n');

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${escapeIcsText(groom)} and ${escapeIcsText(bride)}//Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${icsStamp(new Date())}
DTSTART:${icsStamp(start)}
DTEND:${icsStamp(end)}
SUMMARY:${escapeIcsText(`The Wedding of ${groom} & ${bride}`)}
DESCRIPTION:${escapeIcsText(description)}
LOCATION:${escapeIcsText(venue)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${[groom, bride].map((n) => n.replace(/[^\w]+/g, '_')).join('_')}_${icsStamp(start).slice(0, 8)}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
