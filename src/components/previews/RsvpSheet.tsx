import { useState } from 'react';
import { motion } from 'motion/react';
import type { Palette } from '../../data/themes';
import { wedding } from '../../data/wedding';
import type { Tokens } from './tokens';
import { EASE } from './motion';
import type { RsvpValue } from './sections';

type Props = {
  p: Palette;
  t: Tokens;
  guest: string;
  initial: RsvpValue | null;
  onSave: (value: RsvpValue) => void;
  onClose: () => void;
};

/** RSVP sheet. Local only: this is a preview, so nothing leaves the device. */
export default function RsvpSheet({ p, t, guest, initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [attendance, setAttendance] = useState<'hadir' | 'tidak'>('hadir');
  const [pax, setPax] = useState(initial?.pax ?? 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/45"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm attendance"
      onClick={onClose}
    >
      <motion.form
        initial={{ y: '8%' }}
        animate={{ y: 0 }}
        exit={{ y: '8%' }}
        transition={{ duration: 0.28, ease: EASE }}
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ name: name.trim() || guest, phone: phone.trim(), attendance, pax });
        }}
        className="max-h-[86%] overflow-y-auto px-5 pt-5 pb-6"
        style={{ background: p.bg, color: p.ink, borderTop: `1px solid ${p.line}` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={t.small} style={{ color: p.accent }}>
              RSVP
            </p>
            <h3 className={`mt-1 ${t.sectionTitle}`}>Confirm attendance</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close RSVP"
            className="rounded-full px-2 py-1 text-lg leading-none"
            style={{ color: p.soft }}
          >
            ×
          </button>
        </div>

        <p className={`mt-2 ${t.body}`} style={{ color: p.soft }}>
          Please reply before {wedding.dateLabel}.
        </p>

        <label className={`mt-4 block ${t.small}`} style={{ color: p.soft }} htmlFor="rsvp-name">
          Name
        </label>
        <input
          id="rsvp-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={guest}
          maxLength={40}
          autoComplete="name"
          className={`mt-1 w-full border px-2.5 py-2 text-[13px] ${t.radius}`}
          style={{ borderColor: p.line, background: p.paper, color: p.ink }}
        />

        <label className={`mt-3 block ${t.small}`} style={{ color: p.soft }} htmlFor="rsvp-phone">
          Phone <span className="normal-case">(optional)</span>
        </label>
        <input
          id="rsvp-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="08…"
          maxLength={20}
          className={`mt-1 w-full border px-2.5 py-2 text-[13px] ${t.radius}`}
          style={{ borderColor: p.line, background: p.paper, color: p.ink }}
        />

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
              {option === 'hadir' ? 'Attending' : "Can’t make it"}
            </button>
          ))}
        </div>

        {attendance === 'hadir' && (
          <div className="mt-3">
            <p className={t.small} style={{ color: p.soft }}>
              How many of you
            </p>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPax((value) => Math.max(1, value - 1))}
                aria-label="One guest fewer"
                className="flex h-10 w-10 items-center justify-center border text-base"
                style={{ borderColor: p.line, color: p.accent }}
              >
                −
              </button>
              <input
                aria-label="Number of guests"
                value={pax}
                readOnly
                className={`h-10 w-12 border text-center text-[13px] tabular-nums ${t.radius}`}
                style={{ borderColor: p.line, background: p.paper, color: p.ink }}
              />
              <button
                type="button"
                onClick={() => setPax((value) => Math.min(6, value + 1))}
                aria-label="One guest more"
                className="flex h-10 w-10 items-center justify-center border text-base"
                style={{ borderColor: p.line, color: p.accent }}
              >
                +
              </button>
              <span className={`ml-1 ${t.small}`} style={{ color: p.soft }}>
                {pax === 1 ? 'guest' : 'guests'}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`mt-4 w-full ${t.button}`}
          style={{ background: p.accent, color: p.on }}
        >
          Send RSVP
        </button>
        <p className={`mt-2 text-center ${t.small}`} style={{ color: p.soft }}>
          Preview only. Nothing is sent to the couple.
        </p>
      </motion.form>
    </motion.div>
  );
}
