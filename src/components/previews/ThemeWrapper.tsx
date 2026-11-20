import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Theme } from '../../data/themes';
import { waLink } from '../../data/themes';
import GuestNameBar from './GuestNameBar';
import { useGuestName, useInvitationAudio } from './hooks';

/**
 * Typographic theme: no photos, everything driven by the palette in themes.ts so a
 * new skin is a data entry, not a new component.
 */
export default function ThemeWrapper({ theme }: { theme: Theme }) {
  const [guest, setGuest] = useGuestName();
  const [opened, setOpened] = useState(false);
  const audio = useInvitationAudio(theme.music);
  const { palette, type, couple, events } = theme;
  const heading = { fontFamily: type.heading, fontWeight: type.weight, letterSpacing: type.tracking };
  const caps = type.caps ? 'uppercase' : undefined;

  function open() {
    setOpened(true);
    audio.unlock();
  }

  return (
    <div
      className="relative h-[100svh] lg:h-full"
      style={{ background: palette.bg, color: palette.ink }}
    >
      {audio.src && <audio ref={audio.ref} src={audio.src} loop preload="none" />}

      <div className="h-full overflow-x-hidden overflow-y-auto overscroll-contain pb-16">
        {/* Cover */}
        <section className="flex min-h-[78svh] flex-col items-center justify-center px-6 py-14 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">The Wedding Of</p>
          <p className="mt-4 text-[3.5rem] leading-none" style={heading}>
            {couple.initials}
          </p>
          <span className="mt-5 h-px w-10" style={{ background: palette.accent }} />
          <p className="mt-5 text-[11px] tracking-[0.22em] uppercase opacity-80">
            {couple.groom} &amp; {couple.bride}
          </p>
          <p className="mt-2 text-[11px] tracking-[0.14em] opacity-55">{events[0].date}</p>
          <p className="mt-8 max-w-[16rem] text-[11px] leading-relaxed opacity-70">
            Kepada Bapak/Ibu/Saudara/i
            <br />
            <span className="text-[13px] font-medium opacity-100">{guest}</span>
          </p>
        </section>

        <Divider palette={palette} />

        {/* Couple */}
        <section className="px-6 py-12 text-center">
          <p className="text-[9px] tracking-[0.28em] uppercase" style={{ color: palette.accent }}>
            Mempelai
          </p>
          <p className="mx-auto mt-4 max-w-[16rem] text-[12px] leading-relaxed opacity-75">
            Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud
            menyelenggarakan pernikahan putra-putri kami.
          </p>
          <div className="mt-8 space-y-6">
            {[
              { role: 'Mempelai Pria', name: couple.groom },
              { role: 'Mempelai Wanita', name: couple.bride },
            ].map((person) => (
              <div key={person.role}>
                <p className="text-[9px] tracking-[0.22em] uppercase opacity-50">{person.role}</p>
                <p className="mt-1.5 text-[1.75rem] leading-tight" style={heading}>
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Divider palette={palette} />

        {/* Events */}
        <section className="px-6 py-12">
          <p className="text-center text-[9px] tracking-[0.28em] uppercase" style={{ color: palette.accent }}>
            Acara
          </p>
          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <div
                key={event.label}
                className="rounded-2xl p-4 text-left"
                style={{ background: palette.paper, border: `1px solid ${palette.line}` }}
              >
                <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: palette.accent }}>
                  {event.label}
                </p>
                <p className="mt-1.5 text-[13px] font-medium">{event.date}</p>
                <p className="text-[12px] opacity-70">{event.time}</p>
                <p className="mt-2 text-[12px]">{event.place}</p>
                <p className="text-[11px] opacity-60">{event.address}</p>
              </div>
            ))}
          </div>

          <ul className="mt-6 space-y-1.5">
            {theme.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-[11px] opacity-70">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: palette.accent }} />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <Divider palette={palette} />

        {/* Closing */}
        <section className="px-6 py-12 text-center">
          <p className="text-[9px] tracking-[0.28em] uppercase" style={{ color: palette.accent }}>
            Terima kasih
          </p>
          <p
            className={`mt-3 text-[2rem] leading-tight ${caps ?? ''}`}
            style={heading}
          >
            {couple.groom} &amp; {couple.bride}
          </p>
          <p className="mx-auto mt-3 max-w-[16rem] text-[11px] leading-relaxed opacity-70">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir.
          </p>
          <a
            href={waLink(theme)}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex rounded-full px-5 py-3 text-[10px] tracking-[0.18em] uppercase"
            style={{ background: palette.accent, color: palette.bg }}
          >
            Pesan tema ini
          </a>
        </section>
      </div>

      {audio.src && (
        <button
          type="button"
          onClick={audio.toggle}
          aria-label={audio.muted ? 'Nyalakan musik' : 'Matikan musik'}
          className="absolute top-3 right-3 z-20 rounded-full px-3 py-2 text-[10px] tracking-[0.14em] uppercase"
          style={{ border: `1px solid ${palette.line}`, color: palette.accent }}
        >
          {audio.muted ? 'Musik off' : 'Musik on'}
        </button>
      )}

      <GuestNameBar value={guest} onChange={setGuest} />

      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-40 flex flex-col justify-center px-6 text-center"
            style={{ background: palette.bg, color: palette.ink }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">{theme.category}</p>
            <p className="mt-4 text-[3.25rem] leading-none" style={heading}>
              {couple.initials}
            </p>
            <span className="mx-auto mt-5 h-px w-10" style={{ background: palette.accent }} />
            <p className="mt-5 text-[11px] tracking-[0.22em] uppercase opacity-80">
              {couple.groom} &amp; {couple.bride}
            </p>
            <p className="mt-2 text-[11px] tracking-[0.14em] opacity-55">{events[0].date}</p>

            <div
              className="mx-auto mt-7 w-full max-w-[17rem] rounded-xl px-4 py-3"
              style={{ background: palette.paper, border: `1px solid ${palette.line}` }}
            >
              <p className="text-[9px] tracking-[0.24em] uppercase" style={{ color: palette.accent }}>
                Kepada
              </p>
              <p className="mt-1 text-[14px] font-medium">{guest}</p>
            </div>

            <button
              type="button"
              onClick={open}
              className="mx-auto mt-4 w-full max-w-[17rem] rounded-xl px-6 py-3.5 text-[10px] tracking-[0.2em] uppercase"
              style={{ background: palette.accent, color: palette.bg }}
            >
              Buka Undangan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Divider({ palette }: { palette: Theme['palette'] }) {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <span className="h-px w-16" style={{ background: palette.line }} />
    </div>
  );
}
