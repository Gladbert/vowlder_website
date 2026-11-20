/** 16px stroke icons for the bottom tabs. No icon library: six paths, one file. */
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function CoupleIcon() {
  return (
    <svg {...base}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3.5 19c0-2.8 2.4-5 6-5s6 2.2 6 5" />
      <path d="M16 14.2c2.4.2 4.2 2 4.2 4.3" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg {...base}>
      <rect x="3.75" y="5" width="16.5" height="15" rx="2.5" />
      <path d="M8 3.5v3M16 3.5v3M3.75 10h16.5" />
    </svg>
  );
}

export function StoryIcon() {
  return (
    <svg {...base}>
      <path d="M4 5.5h7a2 2 0 0 1 2 2V20a2.5 2.5 0 0 0-2.5-2.5H4z" />
      <path d="M20 5.5h-5a2 2 0 0 0-2 2V20a2.5 2.5 0 0 1 2.5-2.5H20z" />
    </svg>
  );
}

export function GalleryIcon() {
  return (
    <svg {...base}>
      <rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4.5 17l4.2-4.2a1.6 1.6 0 0 1 2.3 0l3.4 3.4" />
      <path d="M14 14.6l1.7-1.7a1.6 1.6 0 0 1 2.3 0l1.5 1.5" />
    </svg>
  );
}

export function GiftIcon() {
  return (
    <svg {...base}>
      <rect x="3.75" y="9" width="16.5" height="11" rx="2" />
      <path d="M12 9v11M3.75 13.5h16.5" />
      <path d="M12 9C10.3 5.6 8.6 5 7.4 5.6c-1.2.7-1 2.4 1.1 3.4" />
      <path d="M12 9c1.7-3.4 3.4-4 4.6-3.4 1.2.7 1 2.4-1.1 3.4" />
    </svg>
  );
}

export function MessageIcon() {
  return (
    <svg {...base}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V16H6.5A2.5 2.5 0 0 1 4 13.5z" />
      <path d="M8.5 9h7M8.5 12h4.5" />
    </svg>
  );
}

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg {...base} width={14} height={14} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg {...base} width={20} height={20}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.5 9.2l4.5 2.8-4.5 2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MusicIcon({ muted }: { muted: boolean }) {
  return (
    <svg {...base} width={14} height={14}>
      <path d="M9 17V6.5l8-1.5V15" />
      <circle cx="6.75" cy="17.25" r="2.25" />
      <circle cx="14.75" cy="15.25" r="2.25" />
      {muted && <path d="M3 20L21 4" strokeWidth={1.8} />}
    </svg>
  );
}
