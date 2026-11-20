import { useEffect, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Bar is the inverse of the template palette so it never disappears into a dark theme. */
  ink: string;
  paper: string;
}

/**
 * Portfolio-only affordance, not part of the invitation: lets a prospective client
 * type their own name and share the personalised link.
 */
export default function GuestNameBar({ value, onChange, className = 'bottom-3', ink, paper }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center px-3 ${className}`}
    >
      <div
        className="pointer-events-auto w-full max-w-[20rem] overflow-hidden rounded-xl shadow-lg"
        style={{ background: ink, color: paper }}
      >
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
          <div className="px-3 pt-2 pb-3" style={{ borderTop: `1px solid ${paper}33` }}>
            <label
              className="block text-[10px] tracking-[0.12em] uppercase opacity-70"
              htmlFor="guest-name-input"
            >
              Nama tamu
            </label>
            <input
              id="guest-name-input"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              maxLength={40}
              placeholder="Tamu Undangan"
              className="mt-1.5 w-full rounded-lg px-2.5 py-2 text-[13px]"
              style={{ border: `1px solid ${paper}44`, background: `${paper}1a`, color: paper }}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).then(
                  () => setCopied(true),
                  () => setCopied(false)
                );
              }}
              className="mt-2 w-full rounded-lg px-3 py-2 text-[11px] font-medium"
              style={{ background: paper, color: ink }}
            >
              {copied ? 'Link tersalin' : 'Salin link preview'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
