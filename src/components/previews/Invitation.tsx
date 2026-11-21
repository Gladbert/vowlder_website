import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import type { Theme } from '../../data/themes';
import { wedding } from '../../data/wedding';
import { useGuestName, useInvitationAudio } from './hooks';
import { variants } from './tokens';
import { EASE, coverExits, heroMotions } from './motion';
import type { ThemeMotion } from '../../data/themes';
import RsvpSheet from './RsvpSheet';
import {
  CalendarIcon,
  CoupleIcon,
  GalleryIcon,
  GiftIcon,
  MessageIcon,
  MusicIcon,
  StoryIcon,
} from './icons';
import {
  Countdown,
  HeroSlideshow,
  Couple,
  Footer,
  Gallery,
  Gift,
  Opening,
  Ornament,
  Schedule,
  Story,
  Wishes,
  useSectionNav,
  type RsvpValue,
} from './sections';

const DEFAULT_TRACK = '/audio/ceremony.mp3';

const nav = [
  { id: 'profil', label: 'Couple', Icon: CoupleIcon },
  { id: 'acara', label: 'Schedule', Icon: CalendarIcon },
  { id: 'cerita', label: 'Story', Icon: StoryIcon },
  { id: 'galeri', label: 'Gallery', Icon: GalleryIcon },
  { id: 'hadiah', label: 'Gifts', Icon: GiftIcon },
  { id: 'ucapan', label: 'Wishes', Icon: MessageIcon },
];

/**
 * One renderer, every template: layout from `theme.variant`, colours from
 * `theme.palette`, motion from `theme.motion`, content from wedding.ts.
 */
export default function Invitation({ theme }: { theme: Theme }) {
  const t = variants[theme.variant];
  const p = theme.palette;

  const motionSet: ThemeMotion = theme.motion ?? {
    reveal: t.reveal,
    hero: 'drift',
    nav: 'underline',
    coverExit: t.coverExit,
  };
  const hero = heroMotions[motionSet.hero];
  const opening = coverExits[motionSet.coverExit];
  const openingDuration = motionSet.coverDuration ?? 0.55;


  const [guest] = useGuestName();
  const [opened, setOpened] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [pax, setPax] = useState(2);
  const [rsvp, setRsvp] = useState<RsvpValue | null>(null);
  const audio = useInvitationAudio(theme.music ?? DEFAULT_TRACK);
  const navState = useSectionNav(nav.map((item) => item.id));
  const progressRef = useRef<HTMLSpanElement>(null);

  const { groom, bride } = wedding.couple;

  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get('pax'));
    if (Number.isFinite(fromUrl) && fromUrl > 0 && fromUrl <= 6) setPax(Math.round(fromUrl));
  }, []);

  // Escape closes whichever overlay is on top, and the page behind stops scrolling.
  useEffect(() => {
    if (lightbox === null && !rsvpOpen && !filmOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setLightbox(null);
      setRsvpOpen(false);
      setFilmOpen(false);
    };
    const scroller = navState.ref.current;
    const previous = scroller?.style.overflowY;
    if (scroller) scroller.style.overflowY = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (scroller && previous !== undefined) scroller.style.overflowY = previous;
    };
  }, [lightbox, rsvpOpen, filmOpen, navState.ref]);

  function open() {
    setOpened(true);
    audio.unlock();
  }

  function onScroll() {
    navState.onScroll();
    const scroller = navState.ref.current;
    const bar = progressRef.current;
    if (!scroller || !bar) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    const ratio = max > 0 ? Math.min(1, scroller.scrollTop / max) : 0;
    bar.style.transform = `scaleX(${ratio})`;
  }

  const nameLine = (
    <>
      {groom.nickname}{' '}
      <span className="text-[0.72em] italic" style={{ color: p.accent }}>
        &amp;
      </span>{' '}
      {bride.nickname}
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-full" style={{ background: p.bg, color: p.ink }}>
        {audio.src && <audio ref={audio.ref} src={audio.src} loop preload="none" />}

        {opened && (
          <span
            ref={progressRef}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-30 h-[2px] origin-left"
            style={{ background: p.accent, transform: 'scaleX(0)' }}
          />
        )}

        <div
          ref={navState.ref}
          onScroll={onScroll}
          className="h-full overflow-x-hidden overflow-y-auto overscroll-auto pb-16 lg:overscroll-contain"
        >
          {/* Hero */}
          <section className="relative">
            {t.heroOverlay ? (
              <HeroSlideshow ratio={t.heroRatio} overlay p={p} hero={hero}>
                <div className={`absolute inset-x-0 bottom-0 px-5 pb-6 ${t.align}`}>
                  <p className={t.label} style={{ color: p.accent }}>
                    Wedding Invitation
                  </p>
                  <h1 className={`mt-2 ${t.title}`}>{nameLine}</h1>
                  <p className={`mt-2 ${t.small}`} style={{ color: p.soft }}>
                    {wedding.dateLabel}
                  </p>
                </div>
              </HeroSlideshow>
            ) : (
              <HeroSlideshow ratio={t.heroRatio} overlay={false} p={p} hero={hero} />
            )}

            <div className={`${t.sectionPad} ${t.align} ${t.heroOverlay ? 'pt-2' : ''}`}>
              {!t.heroOverlay && (
                <>
                  <motion.p
                    className={t.label}
                    style={{ color: p.accent }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    Wedding Invitation
                  </motion.p>
                  <motion.h1
                    className={`mt-2 ${t.title}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
                  >
                    {nameLine}
                  </motion.h1>
                  <motion.p
                    className={`mt-3 ${t.small}`}
                    style={{ color: p.soft }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.16 }}
                  >
                    {wedding.dateLabel}
                  </motion.p>
                </>
              )}

              <Countdown p={p} t={t} root={navState.ref} />

              <p className={`mt-4 ${t.body}`} style={{ color: p.soft }}>
                Dear
                <br />
                <span className="text-[13px] font-medium" style={{ color: p.ink }}>
                  {guest}
                </span>
              </p>
              <p className={`mt-1.5 ${t.small}`} style={{ color: p.soft }}>
                Reserved for {pax} {pax === 1 ? 'guest' : 'guests'}
              </p>
            </div>
          </section>

          <Opening p={p} t={t} root={navState.ref} reveal={motionSet.reveal} />
          <Couple p={p} t={t} root={navState.ref} reveal={motionSet.reveal} />
          <Schedule p={p} t={t} root={navState.ref} reveal={motionSet.reveal} />

          {t.ornament && (
            <div className="px-5">
              <Ornament p={p} root={navState.ref} />
            </div>
          )}

          <Story p={p} t={t} root={navState.ref} reveal={motionSet.reveal} />
          <Gallery p={p} t={t} root={navState.ref} reveal={motionSet.reveal} onOpen={setLightbox} onFilm={setFilmOpen} />
          <Gift p={p} t={t} root={navState.ref} reveal={motionSet.reveal} label={theme.giftLabel ?? 'Gifts'} />
          <Wishes
            p={p}
            t={t}
            root={navState.ref}
            reveal={motionSet.reveal}
            guest={guest}
            rsvp={rsvp}
            onOpenRsvp={() => setRsvpOpen(true)}
          />
          <Footer p={p} t={t} root={navState.ref} reveal={motionSet.reveal} glyph={theme.glyph} />
        </div>

        <a
          href="/"
          aria-label="Back to the theme catalogue"
          className="absolute top-3 left-3 z-20 hidden min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[10px] tracking-[0.14em] uppercase shadow-sm sm:flex"
          style={{ background: p.ink, color: p.bg }}
        >
          <span aria-hidden="true">←</span> Themes
        </a>

        {audio.src && (
          <button
            type="button"
            onClick={audio.toggle}
            aria-pressed={!audio.muted}
            aria-label={audio.muted ? 'Play music' : 'Pause music'}
            className="absolute right-3 top-14 z-20 flex h-11 w-11 items-center justify-center rounded-full shadow-sm sm:top-3"
            style={{ background: p.ink, color: p.bg }}
          >
            <MusicIcon muted={audio.muted} />
          </button>
        )}

        <nav
          aria-label="Invitation sections"
          className="absolute inset-x-0 bottom-0 z-30"
          style={{ background: p.paper, borderTop: `1px solid ${p.line}` }}
        >
          <ul className="grid grid-cols-6">
            {nav.map((item) => {
              const active = navState.active === item.id;
              const sliding = motionSet.nav !== 'pill';
              const indicator =
                motionSet.nav === 'dot'
                  ? 'absolute bottom-1.5 left-1/2 -ml-0.5 h-1 w-1 rounded-full'
                  : 'absolute inset-x-3 bottom-1 h-[2px] rounded-full';
              const { Icon } = item;

              return (
                <li key={item.id} className="relative">
                  {active && sliding && (
                    <motion.span
                      layoutId={`nav-${motionSet.nav}`}
                      aria-hidden="true"
                      className={indicator}
                      style={{ background: p.accent }}
                      transition={{ duration: 0.32, ease: EASE }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => navState.goTo(item.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`relative z-10 flex min-h-[52px] w-full flex-col items-center justify-center gap-1 pb-1 text-[9px] tracking-[0.06em] uppercase ${
                      active ? t.navActive : ''
                    } ${motionSet.nav === 'pill' ? 'm-1 rounded-full transition-colors duration-200' : ''}`}
                    style={{
                      background: motionSet.nav === 'pill' && active ? p.ink : 'transparent',
                      color: active ? (motionSet.nav === 'pill' ? p.bg : p.accent) : p.soft,
                    }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    {item.id === 'ucapan' && rsvp && (
                      <span
                        aria-label={`${rsvp.pax} guests confirmed`}
                        className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold tabular-nums"
                        style={{ background: p.accent, color: p.on }}
                      >
                        {rsvp.attendance === 'tidak' ? 0 : rsvp.pax}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Cover gate: the only place that may start audio */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              initial={{ opacity: 1, scale: 1, scaleX: 1 }}
              exit={{ ...opening.to, transition: { duration: openingDuration, ease: EASE } }}
              className={`absolute inset-0 z-40 flex flex-col ${
                t.cover === 'plain' ? 'justify-center' : t.coverJustify
              } ${t.align}`}
              style={{
                background: p.bg,
                color: p.ink,
                transformOrigin: opening.origin ?? 'center',
              }}
            >
              {t.cover === 'photo' && (
                <>
                  <motion.img
                    src="/photos/cover.webp"
                    alt=""
                    initial={{ scale: 1.08, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.6, ease: EASE }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={
                      t.coverBand
                        ? { background: `linear-gradient(to top, ${p.bg} 0%, ${p.bg} 46%, ${p.bg}00 47%)` }
                        : { background: `linear-gradient(to top, ${p.bg} 6%, ${p.bg}e6 42%, ${p.bg}22 100%)` }
                    }
                  />
                </>
              )}

              {t.cover === 'plain' && t.ornament && (
                <span
                  className="pointer-events-none absolute inset-3"
                  style={{ border: `1px solid ${p.line}` }}
                  aria-hidden="true"
                />
              )}

              <motion.div
                className="relative max-h-full overflow-y-auto px-5 pb-8"
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              >
                {theme.glyph && (
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      shown: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
                    }}
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border text-[1.4rem] leading-none"
                    style={{
                      borderColor: p.accent,
                      color: p.accent,
                      outline: `1px solid ${p.line}`,
                      outlineOffset: 4,
                      // 囍 / 福 are CJK: name the fallbacks so Android shows glyphs, not tofu.
                      fontFamily:
                        "'Songti SC', 'Noto Serif CJK SC', 'Noto Sans CJK SC', 'PingFang SC', serif",
                    }}
                    aria-hidden="true"
                  >
                    {theme.glyph}
                  </motion.span>
                )}

                <motion.p
                  className={t.label}
                  style={{ color: p.accent }}
                  variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
                >
                  The Wedding Of
                </motion.p>

                <motion.h2
                  className={`mt-2 ${t.title}`}
                  variants={{ hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                >
                  {nameLine}
                </motion.h2>

                <motion.p
                  className={`mt-2.5 ${t.small}`}
                  style={{ color: p.soft }}
                  variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.6 } } }}
                >
                  {wedding.dateLabel}
                </motion.p>

                {t.ornament && (
                  <div className="mt-3">
                    <Ornament p={p} />
                  </div>
                )}

                <motion.div
                  className={`mx-auto mt-5 max-w-[19rem] border px-4 py-3 ${t.radius}`}
                  style={{ borderColor: p.line, background: p.paper }}
                  variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
                >
                  <p className={`${t.small} ${t.align === 'text-left' ? '' : 'text-center'}`} style={{ color: p.accent }}>
                    To
                  </p>
                  <p className={`mt-1 text-[15px] font-medium ${t.align === 'text-left' ? '' : 'text-center'}`}>
                    {guest}
                  </p>
                  <p className={`mt-1 ${t.small} ${t.align === 'text-left' ? '' : 'text-center'}`} style={{ color: p.soft }}>
                    {pax} {pax === 1 ? 'seat' : 'seats'}
                  </p>
                </motion.div>

                <motion.p
                  className={`mx-auto mt-2 max-w-[19rem] text-[10px] leading-relaxed ${t.align === 'text-left' ? '' : 'text-center'}`}
                  style={{ color: p.soft }}
                  variants={{
                    hidden: { opacity: 0 },
                    shown: { opacity: 1, transition: { duration: 0.55, ease: EASE } },
                  }}
                >
                  {wedding.typoNote}
                </motion.p>

                <motion.button
                  type="button"
                  onClick={open}
                  whileTap={{ scale: 0.97 }}
                  className={`mx-auto mt-4 flex min-h-[48px] w-full max-w-[19rem] items-center justify-center ${t.button}`}
                  style={{ background: p.accent, color: p.on }}
                  variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
                >
                  Open Invitation
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-50 flex flex-col bg-black/92 px-4 py-6"
              role="dialog"
              aria-modal="true"
              aria-label={wedding.gallery[lightbox].title}
              onClick={() => setLightbox(null)}
            >
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="self-end rounded-full bg-white/15 px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase text-white"
              >
                Close
              </button>

              <motion.img
                key={lightbox}
                src={wedding.gallery[lightbox].photo}
                alt={wedding.gallery[lightbox].title}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={(event) => event.stopPropagation()}
                className="mx-auto my-auto max-h-[62%] w-auto max-w-full object-contain"
              />

              <motion.div
                className="text-center text-white"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: EASE }}
              >
                <p className="text-[13px] font-medium">{wedding.gallery[lightbox].title}</p>
                <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-white/60">
                  {wedding.gallery[lightbox].location}
                </p>
                <p className="mx-auto mt-2 max-w-[19rem] text-[11px] leading-relaxed text-white/80">
                  {wedding.gallery[lightbox].caption}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {filmOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-50 flex flex-col justify-center bg-black/92 px-4 py-6"
              role="dialog"
              aria-modal="true"
              aria-label="Prewedding film"
              onClick={() => setFilmOpen(false)}
            >
              <div className="mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-xl bg-black">
                <iframe
                  title={wedding.video.title}
                  src="https://www.youtube.com/embed/3QU6E5Mc33c"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="mx-auto mt-3 flex w-full max-w-[320px] items-center justify-between gap-3 text-white">
                <p className="text-[12px]">{wedding.video.title}</p>
                <button
                  type="button"
                  onClick={() => setFilmOpen(false)}
                  className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-white/15 px-3 text-[10px] tracking-[0.16em] uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {rsvpOpen && (
            <RsvpSheet
              key="rsvp"
              p={p}
              t={t}
              guest={guest}
              initial={rsvp}
              onClose={() => setRsvpOpen(false)}
              onSave={(value) => {
                setRsvp(value);
                setRsvpOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
