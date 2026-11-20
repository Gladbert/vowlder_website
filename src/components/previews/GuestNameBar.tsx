import { useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Portfolio-only affordance, not part of the invitation: lets a prospective client
 * type their own name and see (and share) the personalised link.
 */
export default function GuestNameBar({ value, onChange, className = 'bottom-3' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center px-3 ${className}`}
    >
      <div className="pointer-events-auto w-full max-w-[20rem] overflow-hidden rounded-xl bg-[#1c1714]/90 text-[#f7f3ec] shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[10px] tracking-[0.16em] uppercase"
        >
          <span>Coba nama tamu</span>
          <span className="opacity-60">{open ? 'Tutup' : 'Isi'}</span>
        </button>

        {open && (
          <div className="border-t border-white/15 px-3 pt-2 pb-3">
            <label className="block text-[10px] tracking-[0.12em] uppercase opacity-70" htmlFor="guest-name-input">
              Nama tamu
            </label>
            <input
              id="guest-name-input"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              maxLength={40}
              placeholder="Tamu Undangan"
              className="mt-1.5 w-full rounded-lg border border-white/25 bg-white/10 px-2.5 py-2 text-[13px] text-[#f7f3ec] placeholder:text-white/40"
            />
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href).catch(() => {});
              }}
              className="mt-2 w-full rounded-lg bg-[#f7f3ec] px-3 py-2 text-[11px] font-medium text-[#1c1714]"
            >
              Salin link preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
