import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  pax: number;
};

/**
 * The attendance pass, generated on the device. No backend: the QR holds a local code
 * made from the name and party size, which is exactly what a door scanner would read.
 */
export default function GuestPass({ open, onClose, name, pax }: Props) {
  const [qr, setQr] = useState<string | null>(null);

  const code = `VOWLDER-${name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18)}-P${pax}`;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void import('qrcode').then(async ({ default: QRCode }) => {
      const dataUrl = await QRCode.toDataURL(code, {
        margin: 1,
        width: 320,
        color: { dark: '#1C1714', light: '#FCF9F5' },
      });
      if (!cancelled) setQr(dataUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [open, code]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-5"
      role="dialog"
      aria-modal="true"
      aria-label="Your attendance pass"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[320px] rounded-[26px] border border-[#E6DDD0] bg-[#FCF9F5] p-5 text-center shadow-2xl"
      >
        <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#966A38]">
          Attendance pass
        </p>
        <p className="mt-1 font-display text-2xl leading-tight text-[#1C1714]">{name}</p>
        <p className="text-[11px] text-[#6B5A4D]">
          {pax} {pax === 1 ? 'seat' : 'seats'} · Gladbert &amp; Monica
        </p>

        <div className="mx-auto mt-4 flex h-[190px] w-[190px] items-center justify-center rounded-2xl bg-white p-2">
          {qr ? (
            <img src={qr} alt={`Check-in code for ${name}`} width={174} height={174} />
          ) : (
            <span className="text-[11px] text-[#6B5A4D]">Generating…</span>
          )}
        </div>

        <p className="mt-3 break-all text-[9px] tracking-[0.08em] text-[#8A7761] uppercase">{code}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full min-h-[44px] rounded-xl bg-[#1C1714] text-[11px] font-semibold tracking-[0.16em] uppercase text-[#FCF9F5]"
        >
          Close
        </button>
        <p className="mt-2 text-[10px] leading-relaxed text-[#8A7761]">
          Demo pass. At the event this code opens the door, the table and the seat count.
        </p>
      </motion.div>
    </motion.div>
  );
}
