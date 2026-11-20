import { useCallback, useEffect, useRef, useState } from 'react';

/** Reads ?to= and keeps it in sync when the visitor edits the test name. */
export function useGuestName(fallback = 'Tamu Undangan') {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('to');
    if (fromUrl) setName(fromUrl);

    // The tester input lives outside the island (page chrome), so it drives the
    // name through an event instead of a second copy of this state.
    const onGuest = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === 'string') setName(detail);
    };
    window.addEventListener('vowlder:guest', onGuest);
    return () => window.removeEventListener('vowlder:guest', onGuest);
  }, []);

  const update = useCallback((value: string) => {
    setName(value);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set('to', value.trim());
    else url.searchParams.delete('to');
    window.history.replaceState({}, '', url);
  }, []);

  return [name, update] as const;
}

/**
 * iOS and Android both block programmatic playback. The first play() has to happen
 * inside the "Buka Undangan" tap, so the cover button calls unlock().
 */
export function useInvitationAudio(src?: string) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  const play = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;
    audio.muted = false;
    void audio.play().then(
      () => setMuted(false),
      () => setMuted(true)
    );
  }, []);

  const unlock = useCallback(() => {
    if (src) play();
  }, [play, src]);

  const toggle = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) play();
    else {
      audio.pause();
      setMuted(true);
    }
  }, [play]);

  return { ref, src, muted, unlock, toggle };
}

/**
 * A countdown to a past date is four zeros. Pick the next ceremony that has not
 * happened yet, and show nothing once the whole weekend is over.
 */
export function useNextEventIso(dates: string[]) {
  const [iso, setIso] = useState<string | null>(null);
  useEffect(() => {
    const now = Date.now();
    setIso(dates.find((date) => new Date(date).getTime() > now) ?? null);
  }, [dates.join('|')]);
  return iso;
}

export function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return null;
  const diff = Math.max(0, target - now);
  return {
    hari: Math.floor(diff / 86_400_000),
    jam: Math.floor(diff / 3_600_000) % 24,
    menit: Math.floor(diff / 60_000) % 60,
    detik: Math.floor(diff / 1000) % 60,
  };
}
