// Kept as its own module so the vendored components import exactly what they did
// before, while the value stays local.

/** Short, human date for a wish: "20 Nov 2026". */
export function wishDate(timestamp: number | string | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
