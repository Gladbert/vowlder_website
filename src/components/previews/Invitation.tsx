import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import type { Theme } from '../../data/themes';
import { wedding } from '../../data/wedding';
import { useGuestName, useInvitationAudio } from './hooks';
import { variants } from './tokens';
import {
  Countdown,
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
  useSlideShow,
} from './sections';

const nav = [
  { id: 'profil', label: 'Profil' },
  { id: 'acara', label: 'Acara' },
  { id: 'cerita', label: 'Cerita' },
  { id: 'galeri', label: 'Galeri' },
  { id: 'hadiah', label: 'Hadiah' },
  { id: 'ucapan', label: 'Ucapan' },
];

/**
 * One renderer, every template: layout comes from `theme.variant`, colours from
 * `theme.palette`, content from wedding.ts.
 */
export default function Invitation({ theme }: { theme: Theme }) {
  const t = variants[theme.variant];
  const p = theme.palette;

  const [guest] = useGuestName();
  const [opened, setOpened] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const audio = useInvitationAudio(theme.music);
  const navState = useSectionNav(nav.map((item) => item.id));
  const slide = useSlideShow(wedding.heroSlides.length);

  const { groom, bride } = wedding.couple;

  // Escape closes the lightbox, and the page behind it stops scrolling.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
    };
    const scroller = navState.ref.current;
    const previous = scroller?.style.overflowY;
    if (scroller) scroller.style.overflowY = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (scroller && previous !== undefined) scroller.style.overflowY = previous;
    };
  }, [lightbox, navState.ref]);

  function open() {
    setOpened(true);
    audio.unlock();
  }

  const nameLine = (
    <>
      {groom.nickname} <span className="text-[0.72em] italic" style={{ color: p.accent }}>&amp;</span>{' '}
      {bride.nickname}
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative h-full" style={{ background: p.bg, color: p.ink }}>
      {audio.src && <audio ref={audio.ref} src={audio.src} loop preload="none" />}

      <div
        ref={navState.ref}
        onScroll={navState.onScroll}
        className="h-full overflow-x-hidden overflow-y-auto overscroll-auto pb-14 lg:overscroll-contain"
      >
        {/* Hero */}
        <section className="relative">
          {t.heroOverlay ? (
            <div className={`relative w-full overflow-hidden ${t.heroRatio}`}>
              <AnimatePresence initial={false}>
                <motion.img
                  key={slide}
                  src={wedding.heroSlides[slide].src}
                  alt={wedding.heroSlides[slide].location}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${p.bg} 4%, ${p.bg}b3 38%, ${p.bg}00 78%)` }}
              />
              <div className={`absolute inset-x-0 bottom-0 px-5 pb-6 ${t.align}`}>
                <p className={t.label} style={{ color: p.accent }}>
                  Wedding Invitation
                </p>
                <h1 className={`mt-2 ${t.title}`}>{nameLine}</h1>
                <p className={`mt-2 ${t.small}`} style={{ color: p.soft }}>
                  {wedding.dateLabel}
                </p>
              </div>
            </div>
          ) : (
            <div className={`relative w-full overflow-hidden ${t.heroRatio}`} style={{ background: p.line }}>
              <AnimatePresence initial={false}>
                <motion.img
                  key={slide}
                  src={wedding.heroSlides[slide].src}
                  alt={wedding.heroSlides[slide].location}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <p className="absolute bottom-3 left-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-white backdrop-blur">
                {wedding.heroSlides[slide].location}
              </p>
            </div>
          )}

          <div className={`${t.sectionPad} ${t.align} ${t.heroOverlay ? 'pt-2' : ''}`}>
            {!t.heroOverlay && (
              <>
                <p className={t.label} style={{ color: p.accent }}>
                  Wedding Invitation
                </p>
                <h1 className={`mt-2 ${t.title}`}>{nameLine}</h1>
                <p className={`mt-3 ${t.small}`} style={{ color: p.soft }}>
                  {wedding.dateLabel}
                </p>
              </>
            )}

            <Countdown p={p} t={t} />

            <p className={`mt-4 ${t.body}`} style={{ color: p.soft }}>
              Kepada Bapak/Ibu/Saudara/i
              <br />
              <span className="text-[13px] font-medium" style={{ color: p.ink }}>
                {guest}
              </span>
            </p>
          </div>
        </section>

        <Opening p={p} t={t} />
        <Couple p={p} t={t} />
        <Schedule p={p} t={t} />

        {t.ornament && (
          <div className="px-5">
            <Ornament p={p} />
          </div>
        )}

        <Story p={p} t={t} />
        <Gallery p={p} t={t} onOpen={setLightbox} />
        <Gift p={p} t={t} />
        <Wishes p={p} t={t} guest={guest} />
        <Footer p={p} t={t} />
      </div>

      <a
        href="/"
        aria-label="Kembali ke katalog tema"
        className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] tracking-[0.14em] uppercase shadow-sm"
        style={{ background: p.ink, color: p.bg }}
      >
        <span aria-hidden="true">←</span> Katalog
      </a>

      {audio.src && (
        <button
          type="button"
          onClick={audio.toggle}
          aria-pressed={!audio.muted}
          aria-label={audio.muted ? 'Nyalakan musik' : 'Matikan musik'}
          className="absolute top-3 right-3 z-20 rounded-full px-3 py-2 text-[10px] tracking-[0.14em] uppercase shadow-sm"
          style={{ background: p.ink, color: p.bg }}
        >
          {audio.muted ? 'Musik off' : 'Musik on'}
        </button>
      )}

      <nav
        aria-label="Bagian undangan"
        className="absolute inset-x-0 bottom-0 z-30"
        style={{ background: p.paper, borderTop: `1px solid ${p.line}` }}
      >
        <ul className="grid grid-cols-6">
          {nav.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => navState.goTo(item.id)}
                aria-current={navState.active === item.id ? 'true' : undefined}
                className={`min-h-[44px] w-full py-3.5 text-[10px] tracking-[0.08em] uppercase ${
                  navState.active === item.id ? t.navActive : ''
                }`}
                style={{ color: navState.active === item.id ? p.accent : p.soft }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cover gate: the only place that may start audio */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className={`absolute inset-0 z-40 flex flex-col ${
              t.cover === 'plain' ? 'justify-center' : t.coverJustify
            } ${t.align}`}
            style={{ background: p.bg, color: p.ink }}
          >
            {t.cover === 'photo' && (
              <>
                <img
                  src="/photos/cover.webp"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={
                    t.coverBand
                      ? { background: `linear-gradient(to top, ${p.bg} 0%, ${p.bg} 46%, ${p.bg}00 47%)` }
                      : {
                          background: `linear-gradient(to top, ${p.bg} 6%, ${p.bg}e6 42%, ${p.bg}22 100%)`,
                        }
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

            <div className="relative max-h-full overflow-y-auto px-5 pb-8">
              <p className={t.label} style={{ color: p.accent }}>
                The Wedding Of
              </p>

              <h2 className={`mt-2 ${t.title}`}>{nameLine}</h2>

              <p className={`mt-2.5 ${t.small}`} style={{ color: p.soft }}>
                {wedding.dateLabel}
              </p>

              {t.ornament && (
                <div className="mt-3">
                  <Ornament p={p} />
                </div>
              )}

              <div
                className={`mx-auto mt-5 max-w-[19rem] border px-4 py-3 ${t.radius}`}
                style={{ borderColor: p.line, background: p.paper }}
              >
                <p className={`${t.small} ${t.align === 'text-left' ? '' : 'text-center'}`} style={{ color: p.accent }}>
                  Kepada
                </p>
                <p
                  className={`mt-1 text-[15px] font-medium ${t.align === 'text-left' ? '' : 'text-center'}`}
                >
                  {guest}
                </p>
              </div>

              <button
                type="button"
                onClick={open}
                className={`mx-auto mt-4 flex min-h-[48px] w-full max-w-[19rem] items-center justify-center ${t.button}`}
                style={{ background: p.accent, color: p.on }}
              >
                Buka Undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery lightbox */}
      {lightbox !== null && (
        <div
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
            Tutup
          </button>

          <img
            src={wedding.gallery[lightbox].photo}
            alt={wedding.gallery[lightbox].title}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto my-auto max-h-[62%] w-auto max-w-full object-contain"
          />

          <div className="text-center text-white">
            <p className="text-[13px] font-medium">{wedding.gallery[lightbox].title}</p>
            <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-white/60">
              {wedding.gallery[lightbox].location}
            </p>
            <p className="mx-auto mt-2 max-w-[19rem] text-[11px] leading-relaxed text-white/80">
              {wedding.gallery[lightbox].caption}
            </p>
          </div>
        </div>
      )}
      </div>
    </MotionConfig>
  );
}
