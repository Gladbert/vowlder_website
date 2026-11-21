/**
 * Attendance predicates. `RSVPRecord.attendance` is OPTIONAL — `undefined` means
 * the reservation is still PENDING (the link exists, the guest has not replied),
 * which must never be confused with a decline.
 *
 * Every "is this guest coming?" check must go through these two helpers. Testing
 * `attendance !== 'declined'` is wrong (it counts pending guests as attending);
 * testing `=== 'attending'` is wrong (it drops 'attending_partner').
 */
import type { AttendanceStatus } from '../types';

/** Answered and coming: 'attending' | 'attending_partner'. */
export function isAttending(attendance?: AttendanceStatus | null): boolean {
  return attendance === 'attending' || attendance === 'attending_partner';
}

/** Answered and not coming: 'declined' | 'regret' (legacy alias). */
export function isDeclined(attendance?: AttendanceStatus | null): boolean {
  return attendance === 'declined' || attendance === 'regret';
}

/** Never replied — the reservation exists but carries no attendance value. */
export function isPending(attendance?: AttendanceStatus | null): boolean {
  return !attendance;
}

/**
 * Occupies a seat: answered **and** coming. Pending guests are excluded, which is
 * the same rule the server's `get_counts()` applies.
 */
export function countsTowardExpectedPax(attendance?: AttendanceStatus | null): boolean {
  return isAttending(attendance);
}
