import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { RefObject } from 'react';
import type { Palette } from '../../data/themes';
import { wedding } from '../../data/wedding';
import type { Tokens } from './tokens';
import { useCountdown, useNextEventIso } from './hooks';
import { Reveal, Rule, type RevealKind } from './motion';
import { HeartIcon, PlayIcon } from './icons';
import { downloadIcs, googleCalendarUrl } from '../../lib/calendar';

type Look = {
  p: Palette;
  t: Tokens;
  root: RefObject<HTMLDivElement | null>;
  reveal: RevealKind;
};

export type RsvpValue = {
  name: string;
  phone: string;
  attendance: 'hadir' | 'tidak';
  pax: number;
};

export function useSectionNav(ids: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ids[0]);

  const offsetIn = (container: HTMLElement, el: HTMLElement) =>
    el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;

  const goTo = (id: string) => {
    const container = ref.current;
    const target = container?.querySelector<HTMLElement>(`#${id}`);
    if (container && target) container.scrollTo({ top: offsetIn(container, target), behavior: 'smooth' });
  };

  const frame = useRef(0);
  const onScroll = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const container = ref.current;
      if (!container) return;
      let current = ids[0];
      for (const id of ids) {
        const el = container.querySelector<HTMLElement>(`#${id}`);
        if (el && offsetIn(container, el) <= container.scrollTop + 160) current = id;
      }
      // Same section = same output. Setting it anyway re-rendered every section on
      // every scroll frame.
      setActive((prev) => (prev === current ? prev : current));
    });
  };

  return { ref, active, goTo, onScroll };
}

export function SectionLabel({ index, children, p, t }: Pick<Look, 'p' | 't'> & { index: number; children: string }) {
  return (
    <h2 className={t.label} style={{ color: p.accent }}>
      {t.numbered ? `${String(index).padStart(2, '0')} — ` : ''}
      {children}
    </h2>
  );
}

export function Ornament({ p, root, centered = true }: { p: Palette; root?: RefObject<HTMLDivElement | null>; centered?: boolean }) {
  return (
    <div className={`flex items-center gap-2 py-1 ${centered ? 'justify-center' : ''}`} aria-hidden="true">
      <Rule root={root} color={p.line} width="w-10" />
      <span className="h-1 w-1 rotate-45" style={{ background: p.accent }} />
      <Rule root={root} color={p.line} width="w-10" delay={0.12} />
    </div>
  );
}

export function HeroSlideshow({
  ratio,
  overlay,
  p,
  t,
  children,
}: {
  ratio: string;
  overlay: boolean;
  p: Palette;
  t: Tokens;
  children?: React.ReactNode;
}) {
  const [slide, setSlide] = useState(0);
  const length = wedding.heroSlides.length;

  useEffect(() => {
    if (length <= 1) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setSlide((prev) => (prev + 1) % length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [length]);

  const current = wedding.heroSlides[slide];

  return (
    <div className={`relative w-full overflow-hidden ${ratio}`} style={{ background: p.line }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={slide}
          src={current.src}
          alt={current.location}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: 8, ease: 'linear' } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40) setSlide((prev) => (prev + 1) % length);
            if (info.offset.x > 40) setSlide((prev) => (prev - 1 + length) % length);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {overlay ? (
        <>
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${p.bg} 4%, ${p.bg}b3 38%, ${p.bg}00 78%)` }}
          />
          {children}
        </>
      ) : (
        <p className="absolute bottom-3 left-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-white backdrop-blur">
          {current.location}
        </p>
      )}

      <div className="absolute bottom-3 right-3 flex gap-1.5" aria-hidden="true">
        {wedding.heroSlides.map((item, index) => (
          <span
            key={item.src}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: index === slide ? 16 : 6,
              background: index === slide ? p.ink : `${p.ink}59`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function Countdown({ p, t, root }: Omit<Look, 'reveal'>) {
  const iso = useNextEventIso(wedding.events.map((event) => event.iso));
  const countdown = useCountdown(iso ?? '');
  const units = ['days', 'hours', 'mins', 'secs'] as const;

  if (iso === null) return null;

  return (
    <Reveal kind="soft" root={root} delay={0.15} className="mx-auto mt-5 grid max-w-[19rem] grid-cols-4 gap-1.5">
      {units.map((unit) => (
        <div key={unit} className={`border py-2 ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
          <p className="text-base font-medium tabular-nums">
            {countdown ? String(countdown[unit]).padStart(2, '0') : '—'}
          </p>
          <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
            {unit}
          </p>
        </div>
      ))}
    </Reveal>
  );
}

export function Opening({ p, t, root, reveal }: Look) {
  return (
    <section className={`${t.sectionPad} ${t.align}`}>
      <Reveal kind={reveal} root={root}>
        <p className={t.small} style={{ color: p.accent }}>
          {wedding.salam}
        </p>
        <p className={`mt-2 max-w-[21rem] ${t.body} ${t.align === 'text-center' ? 'mx-auto' : ''}`} style={{ color: p.soft }}>
          {wedding.greeting}
        </p>
        <figure
          className={`mt-5 border-t pt-4 ${t.align === 'text-center' ? 'mx-auto max-w-[19rem]' : ''}`}
          style={{ borderColor: p.line }}
        >
          <blockquote className="font-display text-[1.05rem] leading-snug italic">{wedding.quote.text}</blockquote>
          <figcaption className={`mt-1.5 ${t.small}`} style={{ color: p.soft }}>
            {wedding.quote.by}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

export function Couple({ p, t, root, reveal }: Look) {
  const people = [
    { person: wedding.couple.groom, role: 'The Groom' },
    { person: wedding.couple.bride, role: 'The Bride' },
  ];

  return (
    <section id="profil" className={t.sectionPad}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={1} p={p} t={t}>
          The Couple
        </SectionLabel>
      </Reveal>

      {t.couple === 'monogram' ? (
        <Reveal kind={reveal} root={root} delay={0.08} className="mt-5">
          <p className={t.title} style={{ color: p.accent }}>
            {wedding.initials}
          </p>
          <div className="mt-4 space-y-4">
            {people.map(({ person, role }) => (
              <div key={person.fullName}>
                <p className={t.small} style={{ color: p.soft }}>
                  {role}
                </p>
                <h3 className={`mt-0.5 ${t.sectionTitle}`}>{person.fullName}</h3>
                <p className={`mt-1 ${t.body}`} style={{ color: p.soft }}>
                  {person.birthOrder} of {person.parents}
                </p>
                <a href={person.instagram} target="_blank" rel="noopener" className={`mt-1 inline-flex min-h-[44px] items-center ${t.small}`} style={{ color: p.accent }}>
                  Instagram
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      ) : (
        <div className={t.couple === 'columns' ? 'mt-6 grid grid-cols-2 gap-4' : 'mt-6 space-y-7'}>
          {people.map(({ person, role }, index) => (
            <Reveal key={person.fullName} kind={reveal} root={root} delay={0.08 + index * 0.09} className={t.align}>
              <div
                className={`mx-auto w-full overflow-hidden ${t.photoShape === 'circle' ? 'rounded-full' : t.radius} ${t.photoRatio}`}
                style={{ background: p.line }}
              >
                <img src={person.photo} alt={person.fullName} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className={`mt-3 ${t.label}`} style={{ color: p.accent }}>
                {role}
              </p>
              <h3 className={`mt-1 ${t.couple === 'columns' ? 'font-display text-lg leading-tight' : t.sectionTitle}`}>
                {person.fullName}
              </h3>
              <p
                className={`mt-1.5 ${t.couple === 'columns' ? 'text-[11px] leading-relaxed' : t.body}`}
                style={{ color: p.soft }}
              >
                {person.birthOrder} of {person.parents}
              </p>
              <a href={person.instagram} target="_blank" rel="noopener" className={`mt-2 inline-flex min-h-[44px] items-center ${t.small}`} style={{ color: p.accent }}>
                Instagram
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function EventDetails({ event, p, t }: { event: (typeof wedding.events)[number]; p: Palette; t: Tokens }) {
  return (
    <>
      <div className={`mt-3 flex items-end gap-3 ${t.align === 'text-center' ? 'justify-center' : ''}`}>
        <p className="font-display text-[2.6rem] leading-none tabular-nums" style={{ color: p.accent }}>
          {event.dayNumber}
        </p>
        <div>
          <p className={t.small}>{event.monthYear}</p>
          <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
            {event.dayLabel} · {event.timeLabel}
          </p>
        </div>
      </div>
      <p className={`mt-3 ${t.body}`}>
        {event.room}
        <br />
        <span style={{ color: p.soft }}>
          {event.venue}, {event.city}
        </span>
      </p>
      <p className={`mt-1.5 ${t.small}`} style={{ color: p.soft }}>
        {event.dressCode}
      </p>
    </>
  );
}

export function Schedule({ p, t, root, reveal }: Look) {
  const [primary] = wedding.events;
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section id="acara" className={t.sectionPad}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={2} p={p} t={t}>
          Schedule
        </SectionLabel>
      </Reveal>

      {t.scheduleStyle === 'cards' && (
        <div className="mt-4 space-y-3">
          {wedding.events.map((event, index) => (
            <Reveal key={event.title} kind={reveal} root={root} delay={0.06 + index * 0.08}>
              <div className={`${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
                <p className={t.label} style={{ color: p.accent }}>
                  {event.label}
                </p>
                <h3 className={`mt-1 ${t.sectionTitle}`}>{event.title}</h3>
                <p className={t.small} style={{ color: p.soft }}>
                  {event.subtitle}
                </p>
                <EventDetails event={event} p={p} t={t} />
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {t.scheduleStyle === 'timeline' && (
        <ol className="mt-5 space-y-6">
          {wedding.events.map((event, index) => (
            <Reveal key={event.title} kind={reveal} root={root} delay={0.06 + index * 0.08}>
              <li className="relative border-l pl-5" style={{ borderColor: p.line }}>
                <span
                  aria-hidden="true"
                  className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: p.accent }}
                />
                <p className={t.label} style={{ color: p.accent }}>
                  {event.label}
                </p>
                <h3 className={`mt-1 ${t.sectionTitle}`}>{event.title}</h3>
                <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
                  {event.dateLabel} · {event.timeLabel}
                </p>
                <p className={`mt-2 ${t.body}`}>
                  {event.room}
                  <br />
                  <span style={{ color: p.soft }}>
                    {event.venue}, {event.city}
                  </span>
                </p>
                <p className={`mt-1 ${t.small}`} style={{ color: p.soft }}>
                  {event.dressCode}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      )}

      {t.scheduleStyle === 'list' && (
        <div className="mt-4 divide-y" style={{ borderColor: p.line }}>
          {wedding.events.map((event, index) => (
            <Reveal key={event.title} kind={reveal} root={root} delay={0.06 + index * 0.06}>
              <div className="grid gap-1 py-4 sm:grid-cols-[3.2rem_1fr] sm:gap-4" style={{ borderColor: p.line }}>
                <p className="font-display text-2xl leading-none tabular-nums" style={{ color: p.accent }}>
                  {event.dayNumber}
                </p>
                <div>
                  <p className={t.small} style={{ color: p.soft }}>
                    {event.label} · {event.dayLabel}, {event.monthYear}
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium">{event.title}</p>
                  <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
                    {event.timeLabel}
                  </p>
                  <p className={`mt-1 ${t.body}`}>
                    {event.room}, {event.venue}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal kind={reveal} root={root} delay={0.1} className="mt-4">
        <div className={`${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
          <p className={t.label} style={{ color: p.accent }}>
            Venue
          </p>
          <p className={`mt-2 ${t.body}`}>
            {primary.venue}
            <br />
            <span style={{ color: p.soft }}>
              {primary.address}, {primary.city}
            </span>
          </p>

          {mapOpen ? (
            <iframe
              title={`Map to ${primary.venue}`}
              src={primary.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`mt-3 h-44 w-full border ${t.radius}`}
              style={{ borderColor: p.line }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className={`mt-3 w-full ${t.buttonGhost}`}
              style={{ borderColor: p.line, color: p.accent }}
            >
              Show the map
            </button>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={primary.mapsUrl}
              target="_blank"
              rel="noopener"
              className={`flex-1 ${t.button} text-center`}
              style={{ background: p.accent, color: p.on }}
            >
              Directions
            </a>
            <a
              href={primary.wazeUrl}
              target="_blank"
              rel="noopener"
              className={`flex-1 ${t.buttonGhost} text-center`}
              style={{ borderColor: p.line, color: p.accent }}
            >
              Waze
            </a>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener"
              className={`flex-1 ${t.buttonGhost} text-center`}
              style={{ borderColor: p.line, color: p.accent }}
            >
              Save the date
            </a>
            <button
              type="button"
              onClick={downloadIcs}
              className={`flex-1 ${t.buttonGhost} text-center`}
              style={{ borderColor: p.line, color: p.accent }}
            >
              Calendar file
            </button>
          </div>

          <div className={`mt-3 space-y-1.5 border-t pt-3 ${t.body}`} style={{ borderColor: p.line, color: p.soft }}>
            <p>{primary.transit}</p>
            <p>{primary.parking}</p>
            {wedding.events.map((event) => (
              <p key={event.title}>{event.note}</p>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal kind={reveal} root={root} delay={0.12} className="mt-4">
        <p className={t.small} style={{ color: p.soft }}>
          Also invited
        </p>
        <p className={`mt-1 ${t.body}`}>{wedding.invited.join(' · ')}</p>
      </Reveal>
    </section>
  );
}

export function Story({ p, t, root, reveal }: Look) {
  return (
    <section id="cerita" className={t.sectionPad} style={{ background: p.paper }}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={3} p={p} t={t}>
          Our Story
        </SectionLabel>
      </Reveal>

      {t.story === 'timeline' ? (
        <ol className="mt-5 space-y-7">
          {wedding.story.map((item, index) => (
            <li key={item.year} className="border-l pl-4" style={{ borderColor: p.line }}>
              <Reveal kind={reveal} root={root} delay={index * 0.07}>
                <div className="flex items-start gap-3">
                  <img
                    src={item.photo}
                    alt=""
                    loading="lazy"
                    className={`h-16 w-16 shrink-0 object-cover ${t.radius === 'rounded-full' ? 'rounded-full' : t.radius}`}
                    style={{ background: p.line }}
                  />
                  <div className="min-w-0">
                    <span className={`${t.small} tabular-nums`} style={{ color: p.accent }}>
                      {item.year}
                    </span>
                    <h3 className={`mt-1 ${t.sectionTitle}`}>{item.title}</h3>
                    <p className={t.small} style={{ color: p.soft }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <p className={`mt-2 ${t.body}`}>{item.narrative}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="mt-6 space-y-7">
          {wedding.story.map((item, index) => (
            <li key={item.year} className={`${t.align} ${t.ornament ? '' : 'border-t pt-5'}`} style={{ borderColor: p.line }}>
              <Reveal kind={reveal} root={root} delay={index * 0.07}>
                <span className={`${t.label} tabular-nums`} style={{ color: p.accent }}>
                  {item.year}
                </span>
                <h3 className={`mt-1.5 ${t.sectionTitle}`}>{item.title}</h3>
                <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
                  {item.subtitle}
                </p>
                <p className={`mx-auto mt-2 max-w-[18rem] ${t.body}`}>{item.narrative}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function Gallery({
  p,
  t,
  root,
  reveal,
  onOpen,
  onFilm,
}: Look & { onOpen: (index: number) => void; onFilm: (open: boolean) => void }) {
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const heart = (index: number) => {
    setLiked((prev) => ({ ...prev, [index]: !prev[index] }));
    setLikes((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + (liked[index] ? -1 : 1) }));
  };

  const caption = (index: number) => (
    <span className="block px-2.5 py-2" style={{ background: p.paper }}>
      <span className="block text-[11px] font-medium leading-tight">{wedding.gallery[index].title}</span>
      <span className={`mt-0.5 block ${t.small}`} style={{ color: p.soft }}>
        {wedding.gallery[index].location}
      </span>
    </span>
  );

  const heartButton = (index: number, overlay: boolean) => (
    <button
      type="button"
      onClick={() => heart(index)}
      aria-pressed={!!liked[index]}
      aria-label={liked[index] ? `Remove your heart from ${wedding.gallery[index].title}` : `Heart ${wedding.gallery[index].title}`}
      className={`flex items-center gap-1 text-[10px] tabular-nums ${
        overlay
          ? 'absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur'
          : 'ml-2 inline-flex'
      }`}
      style={overlay ? undefined : { color: liked[index] ? p.accent : p.soft }}
    >
      <HeartIcon filled={!!liked[index]} />
      {(likes[index] ?? 0) > 0 && <span>{likes[index]}</span>}
    </button>
  );

  return (
    <section id="galeri" className={t.sectionPad} style={{ background: p.paper }}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={4} p={p} t={t}>
          Gallery
        </SectionLabel>
      </Reveal>

      {t.galleryStyle === 'grid' && (
        <div className={`mt-4 ${t.gallery}`}>
          {wedding.gallery.map((photo, index) => (
            <Reveal
              key={photo.title}
              kind={reveal}
              root={root}
              delay={Math.min(index, 3) * 0.06}
              className={`overflow-hidden ${t.radius}`}
              style={{ background: p.line }}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onOpen(index)}
                  aria-label={`View photo: ${photo.title}`}
                  className="block w-full text-left"
                >
                  <img
                    src={photo.photo}
                    alt={photo.title}
                    loading="lazy"
                    className={`${t.galleryRatio} w-full object-cover`}
                  />
                </button>
                {heartButton(index, true)}
              </div>
              {t.galleryCaptions && caption(index)}
            </Reveal>
          ))}
        </div>
      )}

      {t.galleryStyle === 'rail' && (
        <Reveal kind={reveal} root={root} delay={0.06} className="mt-4">
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
            {wedding.gallery.map((photo, index) => (
              <figure key={photo.title} className={`w-[64%] shrink-0 snap-center overflow-hidden ${t.radius}`} style={{ background: p.line }}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onOpen(index)}
                    aria-label={`View photo: ${photo.title}`}
                    className="block w-full"
                  >
                    <img
                      src={photo.photo}
                      alt={photo.title}
                      loading="lazy"
                      className={`${t.galleryRatio} w-full object-cover`}
                    />
                  </button>
                  {heartButton(index, true)}
                </div>
                <figcaption className="px-2.5 py-2" style={{ background: p.paper }}>
                  <p className="text-[11px] font-medium leading-tight">{photo.title}</p>
                  <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
                    {photo.location}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className={`mt-1 ${t.small}`} style={{ color: p.soft }}>
            Swipe for more
          </p>
        </Reveal>
      )}

      {t.galleryStyle === 'full' && (
        <div className="mt-4 space-y-2">
          {wedding.gallery.map((photo, index) => (
            <Reveal key={photo.title} kind={reveal} root={root} delay={Math.min(index, 2) * 0.05}>
              <figure className="relative overflow-hidden" style={{ background: p.line }}>
                <button
                  type="button"
                  onClick={() => onOpen(index)}
                  aria-label={`View photo: ${photo.title}`}
                  className="block w-full"
                >
                  <img src={photo.photo} alt={photo.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </button>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2.5 text-[11px] text-white">
                  {photo.title}
                </span>
                {heartButton(index, true)}
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      <p className={`mt-2 ${t.small}`} style={{ color: p.soft }}>
        Hearts stay on this device in the preview.
      </p>

      <Reveal kind={reveal} root={root} delay={0.1} className="mt-5">
        <button
          type="button"
          onClick={() => onFilm(true)}
          className={`relative block w-full overflow-hidden text-left ${t.radius}`}
          style={{ background: p.bg }}
          aria-label="Play the prewedding film"
        >
          <img
            src="/photos/cover.webp"
            alt=""
            loading="lazy"
            className="aspect-[16/10] w-full object-cover opacity-85"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 text-white">
            <PlayIcon />
            <span className="text-[10px] tracking-[0.16em] uppercase">Prewedding film</span>
          </span>
        </button>
        <a
          href={wedding.video.url}
          target="_blank"
          rel="noopener"
          className={`mt-1 inline-flex min-h-[40px] items-center ${t.small}`}
          style={{ color: p.soft }}
        >
          Open on YouTube
        </a>
      </Reveal>
    </section>
  );
}

export function Gift({ p, t, root, reveal, label }: Look & { label: string }) {
  return (
    <section id="hadiah" className={t.sectionPad}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={5} p={p} t={t}>
          {label}
        </SectionLabel>

        <div className={`mt-4 ${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
          <p className={t.body} style={{ color: p.soft }}>
            {wedding.gift.note}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {wedding.gift.channels.map((channel) => (
              <li
                key={channel}
                className={`border px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase ${t.radius}`}
                style={{ borderColor: p.line, color: p.accent }}
              >
                {channel}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export function Wishes({
  p,
  t,
  root,
  reveal,
  guest,
  rsvp,
  onOpenRsvp,
}: Look & { guest: string; rsvp: RsvpValue | null; onOpenRsvp: () => void }) {
  const [wishes, setWishes] = useState(() =>
    wedding.wishes.map((wish, index) => ({
      ...wish,
      id: `seed-${index}`,
      likes: 0,
      liked: false,
      relationship: 'Friend',
      initials: wish.name.slice(0, 1).toUpperCase(),
    }))
  );
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [relationship, setRelationship] = useState(wedding.relationships[1]);
  const nextId = useRef(0);

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!message.trim()) return;
    nextId.current += 1;
    setWishes([
      {
        id: `wish-${nextId.current}`,
        name: name.trim() || guest,
        message: message.trim(),
        relationship,
        likes: 0,
        liked: false,
        initials: (name.trim() || guest).slice(0, 1).toUpperCase(),
      },
      ...wishes,
    ]);
    setMessage('');
  }

  function like(id: string) {
    setWishes((prev) =>
      prev.map((wish) =>
        wish.id === id
          ? { ...wish, liked: !wish.liked, likes: wish.likes + (wish.liked ? -1 : 1) }
          : wish
      )
    );
  }

  return (
    <section id="ucapan" className={t.sectionPad}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={6} p={p} t={t}>
          Wishes
        </SectionLabel>
      </Reveal>

      <Reveal kind={reveal} root={root} delay={0.06}>
        <div className={`mt-4 ${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
          <p className={t.small} style={{ color: p.accent }}>
            RSVP
          </p>
          {rsvp ? (
            <>
              <p className={`mt-1.5 ${t.body}`}>
                {rsvp.attendance === 'hadir'
                  ? `Thank you, ${rsvp.name}. We have put down ${rsvp.pax} ${rsvp.pax === 1 ? 'guest' : 'guests'}. See you in ${wedding.event.cityShort}.`
                  : `Noted, we will miss you ${rsvp.name}. Thanks for letting us know.`}
              </p>
              <p className={`mt-1.5 ${t.small}`} style={{ color: p.soft }}>
                This is a theme preview, so nothing was actually sent.
              </p>
              <button
                type="button"
                onClick={onOpenRsvp}
                className={`mt-3 ${t.buttonGhost}`}
                style={{ borderColor: p.line, color: p.accent }}
              >
                Edit RSVP
              </button>
            </>
          ) : (
            <>
              <p className={`mt-1 ${t.body}`} style={{ color: p.soft }}>
                Please let us know before {wedding.dateLabel}.
              </p>
              <button
                type="button"
                onClick={onOpenRsvp}
                className={`mt-3 w-full ${t.button}`}
                style={{ background: p.accent, color: p.on }}
              >
                Confirm attendance
              </button>
            </>
          )}
        </div>
      </Reveal>

      <Reveal kind={reveal} root={root} delay={0.1}>
        <form
          onSubmit={submit}
          className={`mt-3 ${t.card} ${t.radius}`}
          style={{ borderColor: p.line, background: p.paper }}
        >
          <label className={`block ${t.small}`} style={{ color: p.soft }} htmlFor="wish-name">
            Name
          </label>
          <input
            id="wish-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={guest}
            maxLength={40}
            className={`mt-1 min-h-[40px] w-full border px-2.5 py-2 text-[13px] ${t.radius}`}
            style={{ borderColor: p.line, background: p.bg, color: p.ink }}
          />

          <label className={`mt-3 block ${t.small}`} style={{ color: p.soft }} htmlFor="wish-relationship">
            You are here as
          </label>
          <select
            id="wish-relationship"
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
            className={`mt-1 min-h-[40px] w-full border px-2.5 py-2 text-[13px] ${t.radius}`}
            style={{ borderColor: p.line, background: p.bg, color: p.ink }}
          >
            {wedding.relationships.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label className={`mt-3 block ${t.small}`} style={{ color: p.soft }} htmlFor="wish-body">
            Message
          </label>
          <textarea
            id="wish-body"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            maxLength={280}
            placeholder="Write something for the couple…"
            className={`mt-1 w-full resize-none border px-2.5 py-2 text-[13px] ${t.radius}`}
            style={{ borderColor: p.line, background: p.bg, color: p.ink }}
          />

          <button type="submit" className={`mt-3 w-full ${t.button}`} style={{ background: p.accent, color: p.on }}>
            Send wishes
          </button>
        </form>
      </Reveal>

      <ul className="mt-5 space-y-3">
        {wishes.map((wish, index) => (
          <li key={wish.id} className={`border p-3 ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
            <Reveal kind="fade" root={root} delay={Math.min(index, 2) * 0.05}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{ background: p.accent, color: p.on }}
                  >
                    {wish.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold">{wish.name}</p>
                    <p className={`${t.small}`} style={{ color: p.soft }}>
                      {wish.relationship}
                    </p>
                    <p className={`mt-1 ${t.body}`}>{wish.message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => like(wish.id)}
                  aria-pressed={wish.liked}
                  aria-label={wish.liked ? `Remove your heart from ${wish.name}` : `Heart the wish from ${wish.name}`}
                  className="mt-0.5 flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center gap-1 text-[10px] tabular-nums"
                  style={{ color: wish.liked ? p.accent : p.soft }}
                >
                  <HeartIcon filled={wish.liked} />
                  {wish.likes > 0 && <span>{wish.likes}</span>}
                </button>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer({ p, t, root, reveal, glyph }: Look & { glyph?: string }) {
  return (
    <footer className={`${t.sectionPad} pb-20 ${t.align}`} style={{ background: p.paper, borderTop: `1px solid ${p.line}` }}>
      <Reveal kind={reveal} root={root}>
        <p className={t.label} style={{ color: p.accent }}>
          Thank you
        </p>
        <h3 className={`mt-2 ${t.title}`}>
          {wedding.couple.groom.nickname} &amp; {wedding.couple.bride.nickname}
        </h3>
        <p className={`mx-auto mt-2 max-w-[17rem] ${t.body}`} style={{ color: p.soft }}>
          It would mean a lot to have you there.
        </p>
        <p className={`mt-4 ${t.small}`} style={{ color: p.soft }}>
          {wedding.hashtag}
        </p>
        {glyph && (
          <p
            className="mt-3 text-[1.1rem] leading-none"
            style={{
              color: p.accent,
              fontFamily: "'Songti SC', 'Noto Serif CJK SC', 'Noto Sans CJK SC', 'PingFang SC', serif",
            }}
            aria-hidden="true"
          >
            {glyph}
          </p>
        )}
        <p className={`mt-1 ${t.small}`} style={{ color: p.soft }}>
          Made with Vowlder
        </p>
      </Reveal>
    </footer>
  );
}
