import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { Palette } from '../../data/themes';
import { wedding } from '../../data/wedding';
import type { Tokens } from './tokens';
import type { RevealKind } from './motion';
import { useCountdown, useNextEventIso } from './hooks';
import { Reveal, Rule } from './motion';
import { downloadIcs, googleCalendarUrl } from '../../lib/calendar';

type Look = {
  p: Palette;
  t: Tokens;
  root: RefObject<HTMLDivElement | null>;
  reveal: RevealKind;
};

export function useSlideShow(count: number, interval = 4200) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((prev) => (prev + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, interval]);
  return index;
}

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

  const onScroll = () => {
    const container = ref.current;
    if (!container) return;
    let current = ids[0];
    for (const id of ids) {
      const el = container.querySelector<HTMLElement>(`#${id}`);
      if (el && offsetIn(container, el) <= container.scrollTop + 160) current = id;
    }
    setActive(current);
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
    <div
      className={`flex items-center gap-2 py-1 ${centered ? 'justify-center' : ''}`}
      aria-hidden="true"
    >
      <Rule root={root} color={p.line} width="w-10" />
      <span className="h-1 w-1 rotate-45" style={{ background: p.accent }} />
      <Rule root={root} color={p.line} width="w-10" delay={0.12} />
    </div>
  );
}

export function Countdown({ p, t, root }: Look) {
  const iso = useNextEventIso(wedding.events.map((event) => event.iso));
  const countdown = useCountdown(iso ?? '');
  const units = ['days', 'hours', 'mins', 'secs'] as const;

  if (iso === null) return null;

  return (
    <Reveal kind="soft" root={root} delay={0.15} className="mx-auto mt-5 grid max-w-[19rem] grid-cols-4 gap-1.5">
      {units.map((unit) => (
        <div
          key={unit}
          className={`border py-2 ${t.radius}`}
          style={{ borderColor: p.line, background: p.paper }}
        >
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
        <p
          className={`mt-2 max-w-[21rem] ${t.body} ${t.align === 'text-center' ? 'mx-auto' : ''}`}
          style={{ color: p.soft }}
        >
          {wedding.greeting}
        </p>
        <figure
          className={`mt-5 border-t pt-4 ${t.align === 'text-center' ? 'mx-auto max-w-[19rem]' : ''}`}
          style={{ borderColor: p.line }}
        >
          <blockquote className="font-display text-[1.05rem] leading-snug italic">
            {wedding.quote.text}
          </blockquote>
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
                <a
                  href={person.instagram}
                  target="_blank"
                  rel="noopener"
                  className={`mt-1 inline-block ${t.small}`}
                  style={{ color: p.accent }}
                >
                  Instagram
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      ) : (
        <div className={t.couple === 'columns' ? 'mt-6 grid grid-cols-2 gap-4' : 'mt-6 space-y-7'}>
          {people.map(({ person, role }, index) => (
            <Reveal
              key={person.fullName}
              kind={reveal}
              root={root}
              delay={0.08 + index * 0.09}
              className={t.align}
            >
              <div
                className={`mx-auto w-full overflow-hidden ${
                  t.photoShape === 'circle' ? 'rounded-full' : t.radius
                } ${t.photoRatio}`}
                style={{ background: p.line }}
              >
                <img
                  src={person.photo}
                  alt={person.fullName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className={`mt-3 ${t.label}`} style={{ color: p.accent }}>
                {role}
              </p>
              <h3
                className={`mt-1 ${
                  t.couple === 'columns' ? 'font-display text-lg leading-tight' : t.sectionTitle
                }`}
              >
                {person.fullName}
              </h3>
              <p
                className={`mt-1.5 ${t.couple === 'columns' ? 'text-[11px] leading-relaxed' : t.body}`}
                style={{ color: p.soft }}
              >
                {person.birthOrder} of {person.parents}
              </p>
              <a
                href={person.instagram}
                target="_blank"
                rel="noopener"
                className={`mt-2 inline-block ${t.small}`}
                style={{ color: p.accent }}
              >
                Instagram
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export function Schedule({ p, t, root, reveal }: Look) {
  const [primary] = wedding.events;

  return (
    <section id="acara" className={t.sectionPad}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={2} p={p} t={t}>
          Schedule
        </SectionLabel>
      </Reveal>

      <div className="mt-4 space-y-3">
        {wedding.events.map((event, index) => (
          <Reveal key={event.title} kind={reveal} root={root} delay={0.06 + index * 0.08}>
            <div
              className={`${t.card} ${t.radius}`}
              style={{ borderColor: p.line, background: p.paper }}
            >
              <p className={t.label} style={{ color: p.accent }}>
                {event.label}
              </p>
              <h3 className={`mt-1 ${t.sectionTitle}`}>{event.title}</h3>
              <p className={t.small} style={{ color: p.soft }}>
                {event.subtitle}
              </p>

              <div
                className={`mt-3 flex items-end gap-3 ${
                  t.align === 'text-center' ? 'justify-center' : ''
                }`}
              >
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
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal kind={reveal} root={root} delay={0.1} className="mt-3">
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

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={primary.mapsUrl}
              target="_blank"
              rel="noopener"
              className={`flex-1 ${t.button} text-center`}
              style={{ background: p.accent, color: p.on }}
            >
              Map
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

          <div
            className={`mt-3 space-y-1.5 border-t pt-3 ${t.body}`}
            style={{ borderColor: p.line, color: p.soft }}
          >
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
        <ol className="mt-5 space-y-6">
          {wedding.story.map((item, index) => (
            <li key={item.year} className="border-l pl-4" style={{ borderColor: p.line }}>
              <Reveal kind={reveal} root={root} delay={index * 0.07}>
                <span className={`${t.small} tabular-nums`} style={{ color: p.accent }}>
                  {item.year}
                </span>
                <h3 className={`mt-1 ${t.sectionTitle}`}>{item.title}</h3>
                <p className={t.small} style={{ color: p.soft }}>
                  {item.subtitle}
                </p>
                <p className={`mt-1.5 ${t.body}`}>{item.narrative}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="mt-6 space-y-7">
          {wedding.story.map((item, index) => (
            <li
              key={item.year}
              className={`${t.align} ${t.ornament ? '' : 'border-t pt-5'}`}
              style={{ borderColor: p.line }}
            >
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

export function Gallery({ p, t, root, reveal, onOpen }: Look & { onOpen: (index: number) => void }) {
  return (
    <section id="galeri" className={t.sectionPad} style={{ background: p.paper }}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={4} p={p} t={t}>
          Gallery
        </SectionLabel>
      </Reveal>

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
              {t.galleryCaptions && (
                <span className="block px-2.5 py-2" style={{ background: p.paper }}>
                  <span className="block text-[11px] font-medium leading-tight">{photo.title}</span>
                  <span className={`mt-0.5 block ${t.small}`} style={{ color: p.soft }}>
                    {photo.location}
                  </span>
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal kind={reveal} root={root} delay={0.1} className="mt-5">
        <a
          href={wedding.video.url}
          target="_blank"
          rel="noopener"
          className={`flex items-center justify-between gap-3 ${t.card} ${t.radius}`}
          style={{ borderColor: p.line, background: p.bg }}
        >
          <span>
            <span className={`block ${t.small}`} style={{ color: p.soft }}>
              Prewedding film
            </span>
            <span className={`mt-0.5 block ${t.body}`}>{wedding.video.title}</span>
          </span>
          <span className={t.small} style={{ color: p.accent }}>
            Watch
          </span>
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

function Rsvp({ p, t, guest }: Pick<Look, 'p' | 't'> & { guest: string }) {
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | ''>('');
  const [pax, setPax] = useState(2);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className={`mt-4 ${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
        <p className={t.small} style={{ color: p.accent }}>
          RSVP
        </p>
        <p className={`mt-1.5 ${t.body}`}>
          {attendance === 'hadir'
            ? `Thank you, ${guest}. We've put down ${pax} ${pax === 1 ? 'guest' : 'guests'}. See you in ${wedding.event.cityShort}.`
            : `Noted, we'll miss you ${guest}. Thanks for letting us know.`}
        </p>
        <p className={`mt-1.5 ${t.small}`} style={{ color: p.soft }}>
          This is a theme preview, so nothing is actually sent.
        </p>
        <button
          type="button"
          onClick={() => setSaved(false)}
          className={`mt-3 ${t.buttonGhost}`}
          style={{ borderColor: p.line, color: p.accent }}
        >
          Edit RSVP
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (attendance) setSaved(true);
      }}
      className={`mt-4 ${t.card} ${t.radius}`}
      style={{ borderColor: p.line, background: p.paper }}
    >
      <p className={t.small} style={{ color: p.accent }}>
        RSVP
      </p>
      <p className={`mt-1 ${t.body}`} style={{ color: p.soft }}>
        Please let us know before {wedding.dateLabel}.
      </p>

      <div className="mt-3 flex gap-2">
        {(['hadir', 'tidak'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setAttendance(option)}
            aria-pressed={attendance === option}
            className={`flex-1 ${t.buttonGhost}`}
            style={{
              borderColor: attendance === option ? p.accent : p.line,
              background: attendance === option ? p.accent : 'transparent',
              color: attendance === option ? p.on : p.accent,
            }}
          >
            {option === 'hadir' ? 'Attending' : "Can't make it"}
          </button>
        ))}
      </div>

      {attendance === 'hadir' && (
        <div className="mt-3">
          <label className={`block ${t.small}`} style={{ color: p.soft }} htmlFor="rsvp-pax">
            How many of you
          </label>
          <select
            id="rsvp-pax"
            value={pax}
            onChange={(event) => setPax(Number(event.target.value))}
            className={`mt-1 w-full border px-2.5 py-2 text-[13px] ${t.radius}`}
            style={{ borderColor: p.line, background: p.bg, color: p.ink }}
          >
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={!attendance}
        className={`mt-3 w-full ${t.button} disabled:opacity-50`}
        style={{ background: p.accent, color: p.on }}
      >
        Send RSVP
      </button>
    </form>
  );
}

export function Wishes({ p, t, root, reveal, guest }: Look & { guest: string }) {
  const [wishes, setWishes] = useState(() =>
    wedding.wishes.map((wish, index) => ({ ...wish, id: `seed-${index}` }))
  );
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const nextId = useRef(0);

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!message.trim()) return;
    nextId.current += 1;
    setWishes([
      { id: `wish-${nextId.current}`, name: name.trim() || guest, message: message.trim() },
      ...wishes,
    ]);
    setMessage('');
  }

  return (
    <section id="ucapan" className={t.sectionPad}>
      <Reveal kind={reveal} root={root}>
        <SectionLabel index={6} p={p} t={t}>
          Wishes
        </SectionLabel>
      </Reveal>

      <Reveal kind={reveal} root={root} delay={0.06}>
        <Rsvp p={p} t={t} guest={guest} />
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
            className={`mt-1 w-full border px-2.5 py-2 text-[13px] ${t.radius}`}
            style={{ borderColor: p.line, background: p.bg, color: p.ink }}
          />

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

          <button
            type="submit"
            className={`mt-3 w-full ${t.button}`}
            style={{ background: p.accent, color: p.on }}
          >
            Send wishes
          </button>
        </form>
      </Reveal>

      <ul className="mt-5 space-y-3">
        {wishes.map((wish, index) => (
          <li
            key={wish.id}
            className={`border p-3 ${t.radius}`}
            style={{ borderColor: p.line, background: p.paper }}
          >
            <Reveal kind="fade" root={root} delay={Math.min(index, 2) * 0.05}>
              <p className="text-[11px] font-semibold">{wish.name}</p>
              <p className={`mt-1 ${t.body}`}>{wish.message}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer({ p, t, root, reveal }: Look) {
  return (
    <footer
      className={`${t.sectionPad} pb-20 ${t.align}`}
      style={{ background: p.paper, borderTop: `1px solid ${p.line}` }}
    >
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
        <p className={`mt-1 ${t.small}`} style={{ color: p.soft }}>
          Made with Vowlder
        </p>
      </Reveal>
    </footer>
  );
}
