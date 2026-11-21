/**
 * HTML escaping for the strings we interpolate into generated markup.
 *
 * The guest's own name reaches the pass from a `?g=` code, which anyone can
 * craft — so it is attacker-controlled text. Every interpolation into a printed
 * document, an SVG `font-family`, or any `innerHTML` path must go through one of
 * these; a name like `<img src=x onerror=...>` is otherwise live script inside a
 * same-origin frame.
 */

/** Escape text for an HTML text node or a double/single-quoted attribute value. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Only allow a value that is already a known-safe URL scheme through; anything
 * else becomes an empty string. Used for image sources we build ourselves.
 */
export function safeImageSrc(value: unknown): string {
  const s = String(value ?? '').trim();
  if (/^(data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+)$/i.test(s)) return s;
  if (/^https?:\/\//i.test(s)) return escapeHtml(s);
  // Relative asset path emitted by the bundler (hashed /assets/*).
  if (/^\/?[\w./-]+\.(png|jpe?g|webp|svg|gif)$/i.test(s)) return escapeHtml(s);
  return '';
}

/** Escape a value for a CSS font-family / style string. */
export function escapeCssValue(value: unknown): string {
  return String(value ?? '').replace(/[^\w\s,'"-]/g, '');
}

/**
 * Escape a value for an iCalendar text field: backslash, semicolon and comma are
 * delimiters there, and a newline must be the two-character sequence `\n`.
 */
export function escapeIcsText(value: unknown): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}
