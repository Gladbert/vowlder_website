import { useEffect, useRef, useState } from 'react';
import type { Palette } from '../../data/themes';
import { wedding } from '../../data/wedding';
import type { Tokens } from './tokens';
import { useCountdown } from './hooks';
import { downloadIcs, googleCalendarUrl } from '../../lib/calendar';

type Look = { p: Palette; t: Tokens };

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

export function SectionLabel({ index, children, p, t }: Look & { index: number; children: string }) {
  return (
    <h2 className={t.label} style={{ color: p.accent }}>
      {t.numbered ? `${String(index).padStart(2, '0')} — ` : ''}
      {children}
    </h2>
  );
}

export function Ornament({ p }: { p: Palette }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1" aria-hidden="true">
      <span className="h-px w-10" style={{ background: p.line }} />
      <span className="h-1 w-1 rotate-45" style={{ background: p.accent }} />
      <span className="h-px w-10" style={{ background: p.line }} />
    </div>
  );
}

export function Countdown({ iso, p, t }: Look & { iso: string }) {
  const countdown = useCountdown(iso);
  const units = ['hari', 'jam', 'menit', 'detik'] as const;

  return (
    <div className="mx-auto mt-5 grid max-w-[19rem] grid-cols-4 gap-1.5">
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
    </div>
  );
}

export function Couple({ p, t }: Look) {
  const people = [
    { person: wedding.couple.groom, role: 'Mempelai Pria' },
    { person: wedding.couple.bride, role: 'Mempelai Wanita' },
  ];

  return (
    <section id="mempelai" className={t.sectionPad}>
      <SectionLabel index={1} p={p} t={t}>
        Mempelai
      </SectionLabel>
      <p className={`mt-2 max-w-[22rem] ${t.body} ${t.align === 'text-center' ? 'mx-auto' : ''}`} style={{ color: p.soft }}>
        {wedding.greeting}
      </p>

      {t.couple === 'monogram' ? (
        <div className="mt-5">
          <p className={`${t.title}`} style={{ color: p.accent }}>
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
                  {person.parents}
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
        </div>
      ) : (
        <div className={t.couple === 'columns' ? 'mt-6 grid grid-cols-2 gap-4' : 'mt-6 space-y-7'}>
          {people.map(({ person, role }) => (
            <div key={person.fullName} className={t.align}>
              <div
                className={`mx-auto w-full overflow-hidden ${t.radius} ${t.photoRatio}`}
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
              <h3 className={`mt-1 ${t.couple === 'columns' ? 'font-display text-lg leading-tight' : t.sectionTitle}`}>
                {person.fullName}
              </h3>
              <p className={`mt-1.5 ${t.couple === 'columns' ? 'text-[11px] leading-relaxed' : t.body}`} style={{ color: p.soft }}>
                {person.parents}
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function Story({ p, t }: Look) {
  return (
    <section id="cerita" className={t.sectionPad} style={{ background: p.paper }}>
      <SectionLabel index={2} p={p} t={t}>
        Cerita
      </SectionLabel>

      {t.story === 'timeline' ? (
        <ol className="mt-5 space-y-6">
          {wedding.story.map((item) => (
            <li key={item.year} className="border-l pl-4" style={{ borderColor: p.line }}>
              <span className={`${t.small} tabular-nums`} style={{ color: p.accent }}>
                {item.year}
              </span>
              <h3 className={`mt-1 ${t.sectionTitle}`}>{item.title}</h3>
              <p className={t.small} style={{ color: p.soft }}>
                {item.subtitle}
              </p>
              <p className={`mt-1.5 ${t.body}`}>{item.narrative}</p>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="mt-6 space-y-7">
          {wedding.story.map((item) => (
            <li
              key={item.year}
              className={`${t.align} ${t.ornament ? '' : 'border-t pt-5'}`}
              style={{ borderColor: p.line }}
            >
              <span className={`${t.label} tabular-nums`} style={{ color: p.accent }}>
                {item.year}
              </span>
              <h3 className={`mt-1.5 ${t.sectionTitle}`}>{item.title}</h3>
              <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
                {item.subtitle}
              </p>
              <p className={`mx-auto mt-2 max-w-[18rem] ${t.body}`}>{item.narrative}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function Event({ p, t }: Look) {
  const event = wedding.event;
  const rows = [
    { label: 'Tanggal', value: event.dateLabel },
    { label: 'Waktu', value: event.timeLabel },
    { label: 'Tempat', value: `${event.venue}\n${event.address}, ${event.city}` },
    { label: 'Dress code', value: event.dressCode },
  ];

  return (
    <section id="acara" className={t.sectionPad}>
      <SectionLabel index={3} p={p} t={t}>
        Acara
      </SectionLabel>

      <div className={`mt-4 ${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
        <p className={t.label} style={{ color: p.accent }}>
          {event.label}
        </p>
        <h3 className={`mt-1 ${t.sectionTitle}`}>{event.title}</h3>
        <p className={t.small} style={{ color: p.soft }}>
          {event.subtitle}
        </p>

        <dl className={`mt-4 space-y-2.5 ${t.align}`}>
          {rows.map((row) => (
            <div key={row.label}>
              <dt className={t.small} style={{ color: p.soft }}>
                {row.label}
              </dt>
              <dd className={`mt-0.5 whitespace-pre-line ${t.body}`}>{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener"
            className={`flex-1 ${t.button} text-center`}
            style={{ background: p.accent, color: p.on }}
          >
            Peta
          </a>
          <a
            href={event.wazeUrl}
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
            Simpan tanggal
          </a>
          <button
            type="button"
            onClick={downloadIcs}
            className={`flex-1 ${t.buttonGhost} text-center`}
            style={{ borderColor: p.line, color: p.accent }}
          >
            File kalender
          </button>
        </div>

        <div
          className={`mt-4 space-y-1.5 border-t pt-3 ${t.body}`}
          style={{ borderColor: p.line, color: p.soft }}
        >
          <p>{event.transit}</p>
          <p>{event.parking}</p>
        </div>
      </div>
    </section>
  );
}

export function Gallery({ p, t, onOpen }: Look & { onOpen: (index: number) => void }) {
  return (
    <section id="galeri" className={t.sectionPad} style={{ background: p.paper }}>
      <SectionLabel index={4} p={p} t={t}>
        Galeri
      </SectionLabel>

      <div className={`mt-4 ${t.gallery}`}>
        {wedding.gallery.map((photo, index) => (
          <figure
            key={photo.title}
            className={`overflow-hidden ${t.radius}`}
            style={{ background: p.line }}
          >
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`Perbesar foto: ${photo.title}`}
              className="block w-full text-left"
            >
              <img
                src={photo.photo}
                alt={photo.title}
                loading="lazy"
                className={`${t.galleryRatio} w-full object-cover`}
              />
              {t.galleryCaptions && (
                <figcaption className="px-2.5 py-2" style={{ background: p.paper }}>
                  <p className="text-[11px] font-medium leading-tight">{photo.title}</p>
                  <p className={`mt-0.5 ${t.small}`} style={{ color: p.soft }}>
                    {photo.location}
                  </p>
                </figcaption>
              )}
            </button>
          </figure>
        ))}
      </div>

      <a
        href={wedding.video.url}
        target="_blank"
        rel="noopener"
        className={`mt-5 flex items-center justify-between gap-3 ${t.card} ${t.radius}`}
        style={{ borderColor: p.line, background: p.bg }}
      >
        <span>
          <span className={`block ${t.small}`} style={{ color: p.soft }}>
            Video prewedding
          </span>
          <span className={`mt-0.5 block ${t.body}`}>{wedding.video.title}</span>
        </span>
        <span className={t.small} style={{ color: p.accent }}>
          Tonton
        </span>
      </a>
    </section>
  );
}

function Rsvp({ p, t, guest }: Look & { guest: string }) {
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | ''>('');
  const [pax, setPax] = useState(2);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className={`mt-4 ${t.card} ${t.radius}`} style={{ borderColor: p.line, background: p.paper }}>
        <p className={t.small} style={{ color: p.accent }}>
          Konfirmasi kehadiran
        </p>
        <p className={`mt-1.5 ${t.body}`}>
          {attendance === 'hadir'
            ? `Terima kasih, ${guest}. Kami catat ${pax} orang. Sampai ketemu di ${wedding.event.cityShort}.`
            : `Baik, kami catat kalau ${guest} belum bisa hadir. Terima kasih sudah kabar.`}
        </p>
        <p className={`mt-1.5 ${t.small}`} style={{ color: p.soft }}>
          Ini pratinjau tema, jadi konfirmasinya belum benar-benar terkirim.
        </p>
        <button
          type="button"
          onClick={() => setSaved(false)}
          className={`mt-3 ${t.buttonGhost}`}
          style={{ borderColor: p.line, color: p.accent }}
        >
          Ubah konfirmasi
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
        Konfirmasi kehadiran
      </p>
      <p className={`mt-1 ${t.body}`} style={{ color: p.soft }}>
        Mohon kabari kami sebelum {wedding.dateLabel}.
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
            {option === 'hadir' ? 'Hadir' : 'Tidak hadir'}
          </button>
        ))}
      </div>

      {attendance === 'hadir' && (
        <div className="mt-3">
          <label className={`block ${t.small}`} style={{ color: p.soft }} htmlFor="rsvp-pax">
            Jumlah orang
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
                {count} orang
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
        Kirim konfirmasi
      </button>
    </form>
  );
}

export function Wishes({ p, t, guest }: Look & { guest: string }) {
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
      <SectionLabel index={5} p={p} t={t}>
        Ucapan
      </SectionLabel>

      <Rsvp p={p} t={t} guest={guest} />

      <form
        onSubmit={submit}
        className={`mt-3 ${t.card} ${t.radius}`}
        style={{ borderColor: p.line, background: p.paper }}
      >
        <label className={`block ${t.small}`} style={{ color: p.soft }} htmlFor="wish-name">
          Nama
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
          Ucapan
        </label>
        <textarea
          id="wish-body"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={280}
          placeholder="Tulis ucapan buat mempelai…"
          className={`mt-1 w-full resize-none border px-2.5 py-2 text-[13px] ${t.radius}`}
          style={{ borderColor: p.line, background: p.bg, color: p.ink }}
        />

        <button
          type="submit"
          className={`mt-3 w-full ${t.button}`}
          style={{ background: p.accent, color: p.on }}
        >
          Kirim ucapan
        </button>
      </form>

      <ul className="mt-5 space-y-3">
        {wishes.map((wish) => (
          <li
            key={wish.id}
            className={`border p-3 ${t.radius}`}
            style={{ borderColor: p.line, background: p.paper }}
          >
            <p className="text-[11px] font-semibold">{wish.name}</p>
            <p className={`mt-1 ${t.body}`}>{wish.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer({ p, t }: Look) {
  return (
    <footer
      className={`${t.sectionPad} pb-20 ${t.align}`}
      style={{ background: p.paper, borderTop: `1px solid ${p.line}` }}
    >
      <p className={t.label} style={{ color: p.accent }}>
        Terima kasih
      </p>
      <h3 className={`mt-2 ${t.title}`}>
        {wedding.couple.groom.nickname} &amp; {wedding.couple.bride.nickname}
      </h3>
      <p className={`mx-auto mt-2 max-w-[17rem] ${t.body}`} style={{ color: p.soft }}>
        Merupakan kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan hadir.
      </p>
      <p className={`mt-4 ${t.small}`} style={{ color: p.soft }}>
        {wedding.hashtag}
      </p>
      <p className={`mt-1 ${t.small}`} style={{ color: p.soft }}>
        Dibuat dengan Vowlder
      </p>
    </footer>
  );
}
