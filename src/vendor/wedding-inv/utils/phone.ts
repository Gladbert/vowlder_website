/**
 * Digits only, with the local `0` / `62` country prefix dropped, so
 * "0812-3456 789" and "+62 812 3456 789" compare equal and a guest can be
 * found by typing just the last few digits.
 */
export function phoneTail(value?: string | null): string {
  return (value || '').replace(/\D/g, '').replace(/^(0|62)/, '');
}

/**
 * Digits to match against a phone, or '' when the query is not phone-like.
 * An alphanumeric guest code ("k7p2mx") or a table label contains digits that
 * would otherwise match unrelated phone numbers and drown the real result —
 * and a unique result is what lets Enter assign without guessing.
 */
export function phoneQuery(value?: string | null): string {
  const raw = (value || '').trim().toLowerCase();
  if (!raw || /[a-z]/.test(raw)) return '';
  const digits = phoneTail(raw);
  return digits.length >= 3 ? digits : '';
}
