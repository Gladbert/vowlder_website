// Local replacement for the Supabase-backed config store. Everything the calendar
// helper needs already lives in weddingData.ts.
import { COUPLE_INFO, WEDDING_EVENTS } from '../data/weddingData';

type EventLike = { date?: string; venue?: string; mapsUrl?: string; time?: string };

export function getWeddingConfig() {
  const events = WEDDING_EVENTS as unknown as EventLike[];
  const last = events[events.length - 1] ?? {};

  return {
    couple: {
      groom: { nickname: COUPLE_INFO.groom.nickname },
      bride: { nickname: COUPLE_INFO.bride.nickname },
      eventDate: last.date,
      venueSummary: last.venue,
      mapsUrl: last.mapsUrl,
      formattedDate: last.date,
      time: last.time,
    },
    coupleInfo: {
      ...COUPLE_INFO,
      eventDate: last.date,
      venueSummary: last.venue,
      mapsUrl: last.mapsUrl,
      formattedDate: last.date,
      time: last.time,
    },
    events,
  };
}
