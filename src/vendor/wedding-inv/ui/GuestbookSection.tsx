import React, { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
} from 'lucide-react';
import { RSVPRecord, Wish } from '../types';
import { DEFAULT_GUEST_RELATIONSHIP } from '../data/weddingData';
import { haptics } from '../utils/haptics';
import { wishDate } from '../store/time';
import { isAttending, isDeclined } from '../data/attendance';
import logoAsset from '../assets/wedding_logo.png';
import { assetUrl } from '../assets/url';

interface GuestbookSectionProps {
  wishes: Wish[];
  onAddWish: (
    wish: Omit<Wish, 'id' | 'createdAt' | 'likes' | 'avatarColor'>
  ) => void;
  defaultGuestName: string;
  paxCount: number;
  relationship?: string;
  existingRSVP?: RSVPRecord | null;
  /** Present only when the guest opened a personal invitation link ("special link"). */
  guestCode?: string;
  onCancelRsvp?: () => void;
  /** False once the guest's allowance is used or the link is locked (common,
   *  within 14 days) — the RSVP is then vendor-handled. */
  rsvpEditable?: boolean;
  rsvpNotice?: string;
  /** Per-action allowance: false once that action has been used (or the link is locked). */
  rsvpCanCancel?: boolean;
  rsvpCanUpdate?: boolean;
  /** Declined guests may return once — the only action available while declined. */
  rsvpCanReactivate?: boolean;
  /** True when the guest is declined and still holds their reactivation. */
  rsvpIsReactivating?: boolean;
  /** Total wishes on the server; the local list may hold only the first page. */
  wishesTotal?: number;
  /** Fetch the next page when the local list is exhausted (lazy guestbook). */
  onLoadMoreWishes?: () => void | Promise<void>;
  /** Local hearts, supplied by the standalone build. */
  likedWishIds?: string[];
  onToggleWishLike?: (id: string) => void;
  onNotify?: (message: string, type?: 'success' | 'copy' | 'love') => void;
}

const isGenericDefaultGuest = (n?: string) => {
  if (!n) return true;
  const l = n.trim().toLowerCase();
  return l === 'honoured guest' || l === 'honored guest';
};

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  wishes,
  onAddWish,
  defaultGuestName,
  paxCount,
  relationship,
  existingRSVP,
  guestCode,
  onCancelRsvp,
  rsvpEditable = true,
  rsvpNotice,
  rsvpCanCancel = true,
  rsvpCanUpdate = true,
  rsvpCanReactivate = false,
  rsvpIsReactivating = false,
  wishesTotal,
  onLoadMoreWishes,
  likedWishIds = [],
  onToggleWishLike,
  onNotify,
}) => {
  // For default wedding invitation, leave name blank so placeholder "e.g., Alexander & Partner" is purely a textbox hint
  const [name, setName] = useState<string>(() => {
    if (existingRSVP?.guestName && !isGenericDefaultGuest(existingRSVP.guestName)) {
      return existingRSVP.guestName;
    }
    if (defaultGuestName && !isGenericDefaultGuest(defaultGuestName)) {
      return defaultGuestName;
    }
    return '';
  });
  const [attendance, setAttendance] = useState<'attending' | 'not_attending'>('attending');
  const [guestCount, setGuestCount] = useState<number>(() => Math.min(paxCount || 2, Math.max(1, paxCount || 2)));
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [visibleWishesCount, setVisibleWishesCount] = useState<number>(50);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState<boolean>(false);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);

  // Sync default guest name if personalized parameter is provided (e.g. ?to=... or ?g=...)
  useEffect(() => {
    if (defaultGuestName && !isGenericDefaultGuest(defaultGuestName)) {
      setName(defaultGuestName);
    }
  }, [defaultGuestName]);

  useEffect(() => {
    if (paxCount && paxCount > 0) {
      setGuestCount(paxCount);
    }
  }, [paxCount]);

  const maxAllowedPax = Math.max(1, paxCount || 2);
  const paxOptions = Array.from({ length: maxAllowedPax }, (_, i) => i + 1);

  useEffect(() => {
    if (existingRSVP) {
      if (!isGenericDefaultGuest(existingRSVP.guestName)) {
        setName(existingRSVP.guestName);
      }
      setAttendance(isDeclined(existingRSVP.attendance) ? 'not_attending' : 'attending');
      setGuestCount(Math.min(existingRSVP.paxCount || paxCount || 2, maxAllowedPax));
      if (existingRSVP.notes || existingRSVP.wishesMessage) {
        setMessage(existingRSVP.notes || existingRSVP.wishesMessage || '');
      }
    }
  }, [existingRSVP, paxCount, maxAllowedPax]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // rAF-throttle: at most one state check per frame, and only re-render on a
    // real change, so a fast scroll of the wishes list can't cause jank.
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 30;
      setIsScrolledToBottom((prev) => (prev === atBottom ? prev : atBottom));
    });
  };

  useEffect(
    () => () => {
      if (scrollRafRef.current !== null) window.cancelAnimationFrame(scrollRafRef.current);
    },
    []
  );

  const handleLoadMoreWishes = () => {
    haptics.selection();
    // The local list may hold only the first server page — pull the next one once
    // it is exhausted. A failed fetch keeps the last-good list (never blanks).
    if (onLoadMoreWishes && wishes.length <= visibleWishesCount) void onLoadMoreWishes();
    setVisibleWishesCount((prev) => prev + 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim()) return;

    haptics.medium();
    setIsSubmitting(true);

    // A reactivation submits as ATTENDING whatever the mirrored state says. That
    // mirror effect re-runs when the parent hands over a new existingRSVP object, so
    // flipping the local state on the Reactivate button was not enough — it was reset
    // to 'not_attending' before the submit and the guest was declined a second time.
    const targetAttendance = rsvpIsReactivating ? 'attending' : attendance;
    const chosenPax = targetAttendance === 'attending' ? Math.min(guestCount, maxAllowedPax) : 0;

    // Persist before any UI-only delay. A guest can close the page immediately
    // after submit; the local RSVP and sync queue must already exist.
    onAddWish({
      name: name.trim(),
      message: message.trim(),
      relationship: relationship || DEFAULT_GUEST_RELATIONSHIP,
      attendance: targetAttendance === 'attending'
        ? (chosenPax > 1 ? 'attending_partner' : 'attending')
        : 'declined',
      guestCount: chosenPax,
    });

    setTimeout(() => {
      haptics.success();
      setIsSubmitting(false);
      setIsEditingExisting(false);
      setShowSuccessToast(true);
      if (onNotify) {
        onNotify(
          attendance === 'attending'
            ? 'Thank you! Your attendance confirmation has been recorded.'
            : 'Thank you! Your wishes have been recorded.',
          'success'
        );
      }
      setTimeout(() => setShowSuccessToast(false), 4500);
    }, 400);
  };

  const hasExistingConfirmation = !!existingRSVP?.attendance && !isEditingExisting;
  // Wishes & RSVP are reserved for personal invitation links only.
  // Standalone build: there is no per-guest link, so anyone can leave a wish.
  const canWish = true;
  // The server total (may exceed the locally-held page); falls back to local.
  const totalWishes = Math.max(wishes.length, wishesTotal ?? 0);

  return (
    <section id="guestbook-section" className="py-12 px-4 sm:px-6 w-full max-w-full overflow-hidden">
      <div className="text-center mb-8">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.28em] text-muted-on-light font-semibold mb-1.5 block"
        >
          RSVP &amp; Blessings
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal tracking-tight"
        >
          RSVP &amp; Guestbook
        </motion.h2>
        <div className="w-8 h-px bg-[#D9CFC4] mx-auto mt-2.5" />
      </div>

      <div className="max-w-sm mx-auto space-y-6">
        {/* RSVP Form Apple Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="apple-glass rounded-[26px] p-5 sm:p-6 apple-specular"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="w-4 h-4 shrink-0 text-[#966A38]" />
              <h3 className="font-display text-lg sm:text-xl text-[#1C1714] font-normal">
                Attendance Confirmation
              </h3>
            </div>
            {hasExistingConfirmation ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>RSVP Done</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-on-light shrink-0">
                <Clock className="w-3.5 h-3.5 text-muted-on-light" />
                <span>Awaiting RSVP</span>
              </div>
            )}
          </div>

          {/* If already submitted: Display the locked confirmation state card */}
          {hasExistingConfirmation ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#FAF6F0] border border-[#E2D5C6] p-4 text-left relative overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider text-[#7A6451] font-semibold block">
                        Confirmed Guest
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#1C1611] tracking-tight mt-0.5">
                      {existingRSVP.guestName}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                        isAttending(existingRSVP.attendance)
                          ? 'text-emerald-800'
                          : 'text-stone-600'
                      }`}
                    >
                      {isAttending(existingRSVP.attendance) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Attending</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>Unable to Attend</span>
                        </>
                      )}
                    </div>
                    {isAttending(existingRSVP.attendance) && (
                      <span className="text-[11px] text-[#7A6451] block mt-0.5">
                        {existingRSVP.paxCount} {existingRSVP.paxCount > 1 ? 'Guests' : 'Guest'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#524135] pt-2 border-t border-[#EAE0D2]">
                  {isAttending(existingRSVP.attendance) && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#966A38]" />
                      <span>
                        Reserved Seating:{' '}
                        <strong className="text-[#1C1611] font-semibold">
                          {existingRSVP.paxCount} {existingRSVP.paxCount > 1 ? 'Guests' : 'Guest'}
                        </strong>
                      </span>
                    </div>
                  )}
                  {existingRSVP.submittedAt && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A6757]">
                      <Clock className="w-3 h-3 text-muted-on-light" />
                      <span>Recorded on: {existingRSVP.submittedAt}</span>
                    </div>
                  )}
                  {(existingRSVP.notes || existingRSVP.wishesMessage) && (
                    <p className="mt-2 text-xs italic font-serif text-[#43352B] bg-[#F2E8DC]/60 p-2.5 rounded-xl border border-[#DECDBB]">
                      &ldquo;{existingRSVP.notes || existingRSVP.wishesMessage}&rdquo;
                    </p>
                  )}
                  {isAttending(existingRSVP.attendance) && (
                    <p className="text-[11px] text-[#7A6757] leading-relaxed">
                      Your QR entry pass will be sent to your WhatsApp separately. Save or screenshot it for the door.
                    </p>
                  )}
                </div>
              </div>

              {/* Edit / Cancel RSVP Actions — vendor-handled once the allowance is
                  used or the link is locked (common, within 14 days). */}
              <div className="space-y-2 pt-1">
                {rsvpEditable === false ? (
                  <p className="text-[11px] text-muted-on-dark">
                    {rsvpNotice || 'To update or cancel your RSVP, please contact our team.'}
                  </p>
                ) : (
                  <>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-[11px] text-muted-on-dark">
                    {rsvpIsReactivating
                      ? 'Changed your mind? You can reactivate once.'
                      : rsvpCanUpdate
                        ? 'Need to change how many are coming?'
                        : 'Changed your mind?'}
                  </p>
                  <div className="flex items-center gap-2">
                    {rsvpCanCancel && (
                    <button
                      type="button"
                      onClick={() => {
                        haptics.selection();
                        setIsConfirmingCancel(true);
                      }}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E4C4C0] text-xs font-medium text-[#8C2D2D] shadow-2xs hover:bg-[#FCF3F1] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C16A60]"
                    >
                      <XCircle className="w-3.5 h-3.5 text-[#B05048]" />
                      <span>Cancel RSVP</span>
                    </button>
                    )}
                    {(rsvpCanUpdate || (rsvpIsReactivating && rsvpCanReactivate)) && (
                    <button
                      type="button"
                      onClick={() => {
                        haptics.selection();
                        setIsEditingExisting(true);
                        // Reactivate has to OPEN as attending. The effect above mirrors
                        // the saved record into the form, so a declined guest opened the
                        // editor still marked "not attending": no pax choices, and the
                        // submit sent 'declined' straight back — the button did nothing
                        // and the allowance was never spent.
                        if (rsvpIsReactivating) setAttendance('attending');
                      }}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5C2A5] text-xs font-medium text-[#1C1714] shadow-2xs hover:bg-[#FAF6F0] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#966A38]" />
                      <span>{rsvpIsReactivating ? 'Reactivate RSVP' : 'Update RSVP'}</span>
                    </button>
                    )}
                  </div>
                </div>

                {isConfirmingCancel && (
                  <div className="rounded-2xl border border-[#E4C9C4] bg-[#FBF1EE] p-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] text-[#5A3A34]">
                      Withdraw your RSVP? You can respond again later from your invitation.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          haptics.selection();
                          setIsConfirmingCancel(false);
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white border border-[#D5C2A5] text-xs font-medium text-[#1C1714] cursor-pointer hover:bg-[#FAF6F0]"
                      >
                        Keep it
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          haptics.selection();
                          setIsConfirmingCancel(false);
                          onCancelRsvp?.();
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#8C2D2D] text-white text-xs font-semibold cursor-pointer hover:bg-[#A33535]"
                      >
                        Yes, cancel RSVP
                      </button>
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>
            </div>
          ) : canWish && rsvpEditable !== false ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Standalone build: there is no per-guest link, so the guest types
                  their own name instead of it being locked at creation. */}
              <div>
                <label
                  htmlFor="wish-guest-name"
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#665548] block mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="wish-guest-name"
                  type="text"
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g., Alexander & Partner"
                  autoComplete="name"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E2D5C6] text-base sm:text-xs text-[#4A3B30] focus:outline-none focus:ring-2 focus:ring-[#966A38]/30"
                />
              </div>

              {/* Attendance toggle — first response only. An UPDATE is pax + message
                  only (the plan: “1 update = pax only; changing attendance is a
                  cancel”). Attendance changes go through Cancel / Reactivate. */}
              {!isEditingExisting && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#665548] block mb-1.5">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 h-11 p-0.5 rounded-xl bg-black/[0.04] border border-black/[0.04]">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.selection();
                      setAttendance('attending');
                    }}
                    className={`relative h-full px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
                      attendance === 'attending'
                        ? 'text-[#1C1714]'
                        : 'text-[#7A6757] hover:text-[#1C1714]'
                    }`}
                  >
                    {attendance === 'attending' && (
                      <motion.div
                        layoutId="rsvpTabPill"
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        className="absolute inset-0 bg-white rounded-lg shadow-xs"
                      />
                    )}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 relative z-10" />
                    <span className="relative z-10">Joyfully Attend</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      haptics.selection();
                      setAttendance('not_attending');
                    }}
                    className={`relative h-full px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
                      attendance === 'not_attending'
                        ? 'text-[#1C1714]'
                        : 'text-[#7A6757] hover:text-[#1C1714]'
                    }`}
                  >
                    {attendance === 'not_attending' && (
                      <motion.div
                        layoutId="rsvpTabPill"
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        className="absolute inset-0 bg-white rounded-lg shadow-xs"
                      />
                    )}
                    <XCircle className="w-3.5 h-3.5 text-stone-500 relative z-10" />
                    <span className="relative z-10">Unable to attend</span>
                  </button>
                </div>
              </div>
              )}

              {/* Pax Count Selector (dynamically matches reserved paxCount) */}
              <AnimatePresence>
                {(attendance === 'attending' || rsvpIsReactivating) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    className="overflow-hidden space-y-2.5"
                  >
                    <div className="flex items-center justify-between py-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#665548]">
                        Number of Guests Attending
                      </label>
                      <span className="text-[11px] font-medium text-[#966A38]">
                        Reserved for {paxCount || 2} Pax
                      </span>
                    </div>

                    {/* Quick Select: pills for ≤3, dropdown above that */}
                    {maxAllowedPax > 3 ? (
                      <div className="relative">
                        <select
                          value={guestCount}
                          onChange={(e) => {
                            haptics.selection();
                            setGuestCount(Number(e.target.value));
                          }}
                          aria-label="Number of guests attending"
                          className="w-full h-11 appearance-none rounded-xl bg-[#FAF6F0]/90 border border-[#E2D5C6] pl-3.5 pr-10 text-base sm:text-xs text-[#1C1714] shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] focus:border-[#966A38] transition-colors"
                        >
                          {paxOptions.map((count) => (
                            <option key={count} value={count}>
                              {count} {count > 1 ? 'Guests' : 'Guest'}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A45]"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      <div
                        className={`grid gap-2 ${
                          maxAllowedPax === 1
                            ? 'grid-cols-1'
                            : maxAllowedPax === 2
                            ? 'grid-cols-2'
                            : 'grid-cols-3'
                        }`}
                      >
                        {paxOptions.map((count) => (
                          <motion.button
                            key={count}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            onClick={() => {
                              haptics.selection();
                              setGuestCount(count);
                            }}
                            className={`h-11 px-2 rounded-xl border text-xs font-medium flex flex-col items-center justify-center transition-all cursor-pointer select-none whitespace-nowrap ${
                              guestCount === count
                                ? 'bg-[#1C1714] text-[#FAF8F5] border-[#1C1714] shadow-xs ring-1 ring-[#1C1714]'
                                : 'bg-[#FAF6F0] text-[#5C493B] border-[#E2D5C6] hover:bg-white'
                            }`}
                          >
                            <span className="font-semibold text-xs leading-none">{count}</span>
                            <span className="text-[9px] uppercase tracking-tight opacity-75 mt-0.5 leading-none">Pax</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message / Prayer Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#665548]">
                    Warm Wishes &amp; Blessings
                  </label>
                  <span className="text-[10px] font-medium text-muted-on-light">
                    (Optional)
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    attendance === 'attending'
                      ? 'Share a warm wish or blessing for Gladbert & Monica (optional)...'
                      : 'Please leave your warm wishes and blessings as you are unable to attend...'
                  }
                  className="w-full px-3.5 py-1.5 sm:py-2.5 rounded-xl bg-[#FAF6F0]/90 border border-[#E2D5C6] text-base sm:text-xs text-[#1C1714] focus:outline-none focus:ring-2 focus:ring-[#966A38]/35 focus:border-[#966A38] resize-none transition-all"
                />
              </div>

              {/* Submit / Update Button */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  type="submit"
                  data-testid="guestbook-rsvp-submit"
                  className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-[#1C1714] hover:bg-[#2A211B] text-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(28,23,20,0.18)] transition-all cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
                >
                  <Send className="w-4 h-4 text-[#E6D4C1]" />
                  <span>
                    {isSubmitting
                      ? 'Recording...'
                      : rsvpIsReactivating
                      ? 'Confirm Reactivation'
                      : existingRSVP
                      ? 'Update My RSVP & Wishes'
                      : 'Submit Attendance & Wishes'}
                  </span>
                </motion.button>

                {isEditingExisting && (
                  <button
                    type="button"
                    onClick={() => setIsEditingExisting(false)}
                    className="w-full text-center text-[11px] text-[#7A6451] hover:text-[#1C1714] cursor-pointer py-1"
                  >
                    Cancel Update
                  </button>
                )}
              </div>
            </form>
          ) : canWish ? (
            <div className="rounded-2xl border border-[#E2D5C6] bg-[#FAF6F0] p-4 text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#1C1714]">RSVP is closed</p>
              <p className="text-[11px] text-[#6B5A4D] leading-relaxed">
                {rsvpNotice || 'To update or cancel your RSVP, please contact our team.'}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E2D5C6] bg-[#FAF6F0] p-4 text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#1C1714]">Personal invitation required</p>
              <p className="text-[11px] text-[#6B5A4D] leading-relaxed">
                Wishes and RSVP are available through your personal invitation link. Please open the link we sent you.
              </p>
            </div>
          )}

          {/* Success Notification Banner */}
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your RSVP and wishes have been warmly recorded.</span>
            </motion.div>
          )}
        </motion.div>

        {/* Wishes Feed — only for guests who arrived through a personal link */}
        {canWish && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#665548]">
              Wishes &amp; Blessings ({totalWishes})
            </span>
            <button
              type="button"
              onClick={() => {
                haptics.selection();
                setIsExpanded((prev) => !prev);
              }}
              className="text-[11px] font-medium text-[#966A38] hover:text-[#7A5328] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{isExpanded ? 'Compact View' : 'View All'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Scrollable / Expandable Container with Edge Fade Mask */}
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                maskImage: !isExpanded && !isScrolledToBottom
                  ? 'linear-gradient(to bottom, black 0%, black calc(100% - 36px), transparent 100%)'
                  : undefined,
                WebkitMaskImage: !isExpanded && !isScrolledToBottom
                  ? 'linear-gradient(to bottom, black 0%, black calc(100% - 36px), transparent 100%)'
                  : undefined,
              }}
              className={`space-y-2.5 pr-1 transition-all duration-300 ${
                isExpanded ? 'max-h-none overflow-visible' : 'max-h-[420px] overflow-y-auto'
              }`}
            >
              {wishes.slice(0, visibleWishesCount).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[#E6DDD0] shadow-[0_2px_8px_rgba(28,23,20,0.03)]"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-xs text-[#1C1714]">{item.name}</h4>
                      <span className="text-[10px] text-muted-on-light">{wishDate(item.createdAt)}</span>
                    </div>
                    {onToggleWishLike && (
                      <button
                        type="button"
                        onClick={() => onToggleWishLike(item.id)}
                        aria-pressed={likedWishIds.includes(item.id)}
                        aria-label={
                          likedWishIds.includes(item.id)
                            ? `Remove your heart from ${item.name}`
                            : `Heart the wish from ${item.name}`
                        }
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-[#E6DDD0] text-[#966A38] transition-colors hover:bg-[#FAF6F0]"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${likedWishIds.includes(item.id) ? 'fill-current' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#4A3B2F] leading-relaxed">{item.message}</p>
                </motion.div>
              ))}

              {/* Load More Wishes Button (when more than visibleWishesCount exist) */}
              {totalWishes > visibleWishesCount && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMoreWishes}
                    className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-white border border-[#D5C2A5] text-xs font-semibold text-[#1C1714] shadow-2xs hover:bg-[#FAF6F0] cursor-pointer transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
                  >
                    <span>Load More Blessings ({totalWishes - visibleWishesCount} remaining)</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#966A38]" />
                  </button>
                </div>
              )}

              {/* Heartwarming Closing Card from the Couple at the End of Blessings */}
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#FAF5EC] via-[#F4EDE0] to-[#EAE0D0] border border-[#D5C2A5] text-center shadow-xs">
                <div className="w-12 h-12 mx-auto mb-2.5 flex items-center justify-center">
                  <img
                    src={assetUrl(logoAsset)}
                    alt="Gladbert & Monica Monogram"
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 object-contain drop-shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <h4 className="font-display text-base text-[#1C1714] font-normal tracking-tight mb-1">
                  With Heartfelt Gratitude
                </h4>
                <p className="text-[11px] text-[#5A4839] leading-relaxed mb-2.5 max-w-[280px] mx-auto">
                  Every prayer and warm wish is a treasured blessing as we begin our new life journey as husband and wife. Thank you for showering us with your love.
                </p>
                <div className="pt-2 border-t border-[#D5C2A7] flex flex-col items-center gap-0.5">
                  <span className="font-serif-italic text-xs text-[#8C2D2D]">Gladbert &amp; Monica</span>
                </div>
              </div>
            </div>

            {/* Scroll Hint Pill (shown when not expanded & not yet at bottom) */}
            {!isExpanded && !isScrolledToBottom && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    haptics.selection();
                    setIsExpanded(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E6DDD0] text-[10px] text-muted-on-light shadow-xs hover:bg-white transition-colors cursor-pointer"
                >
                  <span>Scroll or tap to view all blessings</span>
                  <ChevronDown className="w-3 h-3 text-[#966A38] animate-bounce" />
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Harmonious Section Outro & Transition to Digital Gifts */}
        <div className="pt-6 mt-6 border-t border-[#E6DDD0] flex flex-col items-center text-center">
          <div className="inline-flex items-center text-[10px] tracking-[0.24em] uppercase text-muted-on-light font-medium mb-1">
            <span>Love &amp; Celebration</span>
          </div>
          <p className="text-xs text-[#6B5749] italic font-serif max-w-[270px]">
            &ldquo;Your presence, prayers, and blessings are the greatest gifts we could ever ask for.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
