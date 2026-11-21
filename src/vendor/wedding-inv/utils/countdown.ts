export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/** Used only when a caller passes nothing; callers normally pass the configured
 *  event date (HeroSection does). 18:00 WIB is the real ceremony time — the old
 *  default said 10:00, eight hours early, and duplicated a date that already lives
 *  in wedding-config.json. */
export const DEFAULT_EVENT_DATE = '2026-12-19T18:00:00+07:00';

export function getTimeUntilWedding(targetDateStr: string = DEFAULT_EVENT_DATE): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
}
