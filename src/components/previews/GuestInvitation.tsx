import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Theme } from '../../data/themes';
import { guestInvitation as data } from '../../data/guest-invitation';
import GuestNameBar from './GuestNameBar';
import { useCountdown, useGuestName, useInvitationAudio } from './hooks';

const nav = [
  { id: 'mempelai', label: 'Mempelai' },
  { id: 'acara', label: 'Acara' },
  { id: 'galeri', label: 'Galeri' },
  { id: 'ucapan', label: 'Ucapan' },
];

const seedWishes = [
  { name: 'Rina', message: 'Selamat menempuh hidup baru, Gladbert & Monica. Bahagia selalu.' },
  { name: 'Dwi', message: 'Turut berbahagia. Semoga semua lancar sampai hari H.' },
];

export default function GuestInvitation({ theme }: { theme: Theme }) {
  const [guest, setGuest] = useGuestName();
  const [opened, setOpened] = useState(false);
  const audio = useInvitationAudio(theme.music);
  const countdown = useCountdown(data.event.iso);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [active, setActive] = useState(nav[0].id);
  const [wishes, setWishes] = useState(() => seedWishes.map((wish, i) => ({ ...wish, id: `seed-${i}` })));
  const nextWishId = useRef(0);
  const [draft, setDraft] = useState('');
  const [wishName, setWishName] = useState('');

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setSlide((prev) => (prev + 1) % data.heroSlides.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  function open() {
    setOpened(true);
    audio.unlock();
  }

  const offsetIn = (container: HTMLElement, el: HTMLElement) =>
    el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;

  function goTo(id: string) {
    const container = scrollRef.current;
    const target = container?.querySelector<HTMLElement>(`#${id}`);
    if (container && target) container.scrollTo({ top: offsetIn(container, target), behavior: 'smooth' });
  }

  function onScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const y = container.scrollTop + 160;
    let current = nav[0].id;
    for (const item of nav) {
      const el = container.querySelector<HTMLElement>(`#${item.id}`);
      if (el && offsetIn(container, el) <= y) current = item.id;
    }
    setActive(current);
  }

  function submitWish(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!draft.trim()) return;
    nextWishId.current += 1;
    setWishes([{ id: `wish-${nextWishId.current}`, name: wishName.trim() || guest, message: draft.trim() }, ...wishes]);
    setDraft('');
  }

  const { groom, bride } = data.couple;

  return (
    <div
      className="relative h-[100svh] bg-[#F3EFEA] text-[#1C1714] lg:h-full"
      style={{ '--accent': theme.palette.accent } as React.CSSProperties}
    >
      {audio.src && <audio ref={audio.ref} src={audio.src} loop preload="none" />}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="h-full overflow-x-hidden overflow-y-auto overscroll-contain pb-14"
      >
        {/* Hero */}
        <section className="relative">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-[#E6D3B5]">
            <AnimatePresence initial={false}>
              <motion.img
                key={slide}
                src={data.heroSlides[slide].src}
                alt={data.heroSlides[slide].location}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <p className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-white/90 backdrop-blur">
              {data.heroSlides[slide].location}
            </p>
          </div>

          <div className="px-5 pt-7 pb-8 text-center">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#6B5A4D]">
              Wedding Invitation
            </p>
            <h1 className="mt-2 font-display text-[2.5rem] leading-none font-normal tracking-tight">
              {groom.nickname}{' '}
              <span className="text-[1.75rem] text-[#521721] italic">&amp;</span> {bride.nickname}
            </h1>
            <p className="mt-3 text-[11px] tracking-[0.22em] uppercase text-[#6B5A4D]">
              19 Desember 2026
            </p>

            <div className="mx-auto mt-6 grid max-w-[19rem] grid-cols-4 gap-1.5">
              {(['hari', 'jam', 'menit', 'detik'] as const).map((unit) => (
                <div key={unit} className="rounded-lg border border-[#E1D5C2] bg-[#FAF8F5] py-2">
                  <p className="text-base font-medium tabular-nums">
                    {countdown ? String(countdown[unit]).padStart(2, '0') : '—'}
                  </p>
                  <p className="mt-0.5 text-[9px] tracking-[0.12em] uppercase text-[#6B5A4D]">{unit}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#6B5A4D]">
              Kepada Bapak/Ibu/Saudara/i
              <br />
              <span className="text-[13px] font-medium text-[#1C1714]">{guest}</span>
            </p>
          </div>
        </section>

        {/* Couple */}
        <section id="mempelai" className="border-t border-[#EAE1D5] bg-[#FAF8F5] px-5 py-10">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#6B5A4D]">Mempelai</p>
          <p className="mt-2 max-w-xs font-display text-2xl leading-snug">
            Dua keluarga, satu doa restu.
          </p>

          <div className="mt-6 space-y-7">
            {[groom, bride].map((person, index) => (
              <div key={person.fullName} className="text-center">
                <div className="mx-auto aspect-3/4 w-full max-w-[13rem] overflow-hidden rounded-[1.25rem] bg-[#E6D3B5]">
                  <img
                    src={person.photo}
                    alt={person.fullName}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-4 text-[11px] font-semibold tracking-[0.25em] uppercase text-[color:var(--accent)]">
                  {index === 0 ? 'The Groom' : 'The Bride'}
                </p>
                <h2 className="mt-1 font-display text-2xl leading-tight">{person.fullName}</h2>
                <p className="mt-2 text-[11px] leading-relaxed text-[#6B5A4D]">{person.parents}</p>
                <a
                  href={person.instagram}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block text-[11px] text-[#521721] underline underline-offset-4"
                >
                  Instagram
                </a>
              </div>
            ))}
          </div>

        </section>

        {/* Story */}
        <section className="border-t border-[#EAE1D5] px-5 py-10">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#6B5A4D]">Cerita</p>
          <ol className="mt-5 space-y-6">
            {data.story.map((item) => (
              <li key={item.year} className="border-l border-[#E1D5C2] pl-4">
                <span className="text-[10px] tracking-[0.16em] text-[color:var(--accent)] tabular-nums">{item.year}</span>
                <h3 className="mt-1 font-display text-xl leading-tight">{item.title}</h3>
                <p className="text-[11px] tracking-[0.06em] uppercase text-[#6B5A4D]">{item.subtitle}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#3D3025]">{item.narrative}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Event */}
        <section id="acara" className="border-t border-[#EAE1D5] bg-[#FAF8F5] px-5 py-10">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#6B5A4D]">Acara</p>
          <div className="mt-4 rounded-[1.1rem] border border-[#E1D5C2] bg-white/70 p-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--accent)]">
              {data.event.label}
            </p>
            <h3 className="mt-1 font-display text-2xl leading-tight">{data.event.title}</h3>
            <p className="text-[11px] text-[#6B5A4D]">{data.event.subtitle}</p>

            <dl className="mt-4 space-y-2 text-[12px]">
              <div>
                <dt className="text-[10px] tracking-[0.14em] uppercase text-[#6B5A4D]">Tanggal</dt>
                <dd className="mt-0.5">{data.event.dateLabel}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.14em] uppercase text-[#6B5A4D]">Waktu</dt>
                <dd className="mt-0.5">{data.event.timeLabel}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.14em] uppercase text-[#6B5A4D]">Tempat</dt>
                <dd className="mt-0.5">
                  {data.event.venue}
                  <br />
                  <span className="text-[#6B5A4D]">
                    {data.event.address}, {data.event.city}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.14em] uppercase text-[#6B5A4D]">Dress code</dt>
                <dd className="mt-0.5 text-[#3D3025]">{data.event.dressCode}</dd>
              </div>
            </dl>

            <a
              href={data.event.mapsUrl}
              target="_blank"
              rel="noopener"
              className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#E1D5C2] bg-[#F9F6F0] px-4 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#521721]"
            >
              Buka peta lokasi
            </a>
            <p className="mt-2 text-center text-[10px] text-[#7A6757]">{data.event.parking}</p>
          </div>
        </section>

        {/* Gallery */}
        <section id="galeri" className="border-t border-[#EAE1D5] px-5 py-10">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#6B5A4D]">Galeri</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {data.gallery.map((photo) => (
              <figure key={photo.title} className="overflow-hidden rounded-xl bg-[#E6D3B5]">
                <img
                  src={photo.photo}
                  alt={photo.title}
                  loading="lazy"
                  className="aspect-3/4 w-full object-cover"
                />
                <figcaption className="bg-[#FAF8F5] px-2.5 py-2">
                  <p className="text-[11px] font-medium leading-tight">{photo.title}</p>
                  <p className="mt-0.5 text-[9px] tracking-[0.1em] uppercase text-[#6B5A4D]">
                    {photo.location}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Wishes */}
        <section id="ucapan" className="border-t border-[#EAE1D5] bg-[#FAF8F5] px-5 py-10">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#6B5A4D]">Ucapan</p>
          <form onSubmit={submitWish} className="mt-4 rounded-[1.1rem] border border-[#E1D5C2] bg-white/70 p-3.5">
            <label className="block text-[10px] tracking-[0.14em] uppercase text-[#6B5A4D]" htmlFor="wish-name">
              Nama
            </label>
            <input
              id="wish-name"
              value={wishName}
              onChange={(event) => setWishName(event.target.value)}
              placeholder={guest}
              maxLength={40}
              className="mt-1 w-full rounded-lg border border-[#E1D5C2] bg-[#FDFBF7] px-2.5 py-2 text-[13px]"
            />
            <label className="mt-3 block text-[10px] tracking-[0.14em] uppercase text-[#6B5A4D]" htmlFor="wish-body">
              Ucapan
            </label>
            <textarea
              id="wish-body"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Tulis doa dan ucapan…"
              className="mt-1 w-full resize-none rounded-lg border border-[#E1D5C2] bg-[#FDFBF7] px-2.5 py-2 text-[13px]"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-[#521721] px-4 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#FCF9F5]"
            >
              Kirim ucapan
            </button>
          </form>

          <ul className="mt-5 space-y-3">
            {wishes.map((wish) => (
              <li key={wish.id} className="rounded-xl border border-[#EAE1D5] bg-white/60 p-3">
                <p className="text-[11px] font-semibold">{wish.name}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#3D3025]">{wish.message}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#EAE1D5] bg-[#F7F2EB] px-5 pt-9 pb-20 text-center">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#6B5A4D]">
            Terima kasih
          </p>
          <h3 className="mt-2 font-display text-3xl leading-tight">
            {groom.nickname} &amp; {bride.nickname}
          </h3>
          <p className="mx-auto mt-2 max-w-[17rem] text-[11px] leading-relaxed text-[#6B5A4D]">
            Merupakan kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan hadir.
          </p>
          <p className="mt-4 text-[10px] tracking-[0.18em] uppercase text-[#7A6757]">
            Dibuat dengan Vowlder
          </p>
        </footer>
      </div>

      {/* Music */}
      {audio.src && (
        <button
          type="button"
          onClick={audio.toggle}
          aria-label={audio.muted ? 'Nyalakan musik' : 'Matikan musik'}
          className="absolute top-3 right-3 z-20 rounded-full border border-white/40 bg-black/30 px-3 py-2 text-[10px] tracking-[0.14em] uppercase text-white backdrop-blur"
        >
          {audio.muted ? 'Musik off' : 'Musik on'}
        </button>
      )}

      {/* Bottom nav */}
      <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-[#EAE1D5] bg-[#FAF8F5]/95 backdrop-blur">
        <ul className="grid grid-cols-4">
          {nav.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => goTo(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`w-full py-3 text-[10px] tracking-[0.14em] uppercase ${
                  active === item.id ? 'font-semibold text-[#521721]' : 'text-[#6B5A4D]'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <GuestNameBar value={guest} onChange={setGuest} className="bottom-[3.75rem]" />

      {/* Cover gate: the only place that may start audio */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-40 flex flex-col justify-end bg-[#F3EFEA]"
          >
            <img
              src="/photos/cover.webp"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#F3EFEA] via-[#F3EFEA]/90 to-[#F3EFEA]/10" />

            <div className="relative px-5 pb-8 text-center">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#6B5A4D]">
                Wedding Invitation
              </p>
              <h2 className="mt-2 font-display text-[2.75rem] leading-none">
                {groom.nickname} <span className="text-[1.9rem] text-[#521721] italic">&amp;</span>{' '}
                {bride.nickname}
              </h2>
              <p className="mt-2.5 text-[11px] tracking-[0.2em] uppercase text-[#554333]">
                Sabtu, 19 Desember 2026
              </p>

              <div className="mx-auto mt-5 max-w-[19rem] rounded-xl border border-[#E1D5C2] bg-[#F9F6F0]/90 px-4 py-3">
                <p className="text-[9.5px] font-semibold tracking-[0.24em] uppercase text-[#521721]">
                  Kepada
                </p>
                <p className="mt-1 text-[15px] font-medium">{guest}</p>
              </div>

              <button
                type="button"
                onClick={open}
                className="mx-auto mt-4 flex w-full max-w-[19rem] items-center justify-center rounded-xl bg-[#521721] px-6 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#FCF9F5]"
              >
                Buka Undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
