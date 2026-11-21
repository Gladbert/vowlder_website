import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Car,
  Navigation,
  Shirt,
  Church,
} from 'lucide-react';
import { WEDDING_EVENTS } from '../data/weddingData';
import { relationshipGroup } from '../data/relationships';
import { WeddingEvent } from '../types';
import { haptics } from '../utils/haptics';
import venueHarrisWatercolor from '../assets/venue_harris_gubeng.webp';
import dresscodeFamily from '../assets/dresscode_family.webp';
import dresscodeFriends from '../assets/dresscode_friends.webp';

interface EventsSectionProps {
  onNotify?: (message: string, type?: 'success' | 'copy' | 'love') => void;
  events?: WeddingEvent[];
  showHolyMatrimony?: boolean;
  /** The guest's relationship picks which dress-code artwork is shown. */
  relationship?: string;
}

const MONTH_ABBREV: Record<string, string> = {
  January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr', May: 'May', June: 'Jun',
  July: 'Jul', August: 'Aug', September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec',
};

/** "Saturday, December 19, 2026" → { day: "Saturday,", date: "Dec 19, 2026" } */
function splitEventDate(dateStr: string): { day: string; date: string } {
  const parts = (dateStr || '').trim().split(/\s*,\s*/);
  if (parts.length >= 2) {
    const rest = parts.slice(1).join(', ').replace(/^([A-Za-z]+)/, (m) => MONTH_ABBREV[m] || m);
    return { day: `${parts[0]},`, date: rest };
  }
  return { day: '', date: dateStr || '' };
}

/** "06:00 PM WIB (GMT+7)" → { time: "06:00 PM WIB", zone: "(GMT+7)" } */
function splitEventTime(timeStr: string): { time: string; zone: string } {
  const m = /^(.*?)\s*(\(.*\))\s*$/.exec((timeStr || '').trim());
  return m ? { time: m[1].trim(), zone: m[2].trim() } : { time: (timeStr || '').trim(), zone: '' };
}

// Spring configs for motion/react animations
const cardSpringTransition = {
  type: 'spring' as const,
  stiffness: 240,
  damping: 26,
  mass: 0.85,
};

export const EventsSection: React.FC<EventsSectionProps> = ({
  onNotify,
  events = WEDDING_EVENTS,
  showHolyMatrimony = false,
  relationship,
}) => {
  const dresscodePalette = relationshipGroup(relationship) === 'family' ? dresscodeFamily : dresscodeFriends;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter events according to showHolyMatrimony toggle
  const displayedEvents = showHolyMatrimony
    ? events
    : events.filter((e) => e.type !== 'ceremony' && !e.title.toLowerCase().includes('matrimony'));

  const activeEvents = displayedEvents.length > 0 ? displayedEvents : WEDDING_EVENTS;

  // Filter for display if user selected a specific tab
  const eventsToRender =
    activeFilter === 'all'
      ? activeEvents
      : activeEvents.filter(
          (e) =>
            e.id === activeFilter ||
            (activeFilter === 'ceremony' && e.type === 'ceremony') ||
            (activeFilter === 'reception' && (e.type === 'reception' || !e.type))
        );

  const handleCopyAddress = (ev: WeddingEvent) => {
    haptics.success();
    const textToCopy = `${ev.venue}, ${ev.address}, ${ev.city}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(ev.id);
    if (onNotify) {
      onNotify(`${ev.venue} address copied to clipboard`, 'copy');
    }
    setTimeout(() => {
      setCopiedId((current) => (current === ev.id ? null : current));
    }, 2500);
  };

  return (
    <section id="events-section" className="py-12 px-4 sm:px-6 w-full max-w-full overflow-hidden">
      <div className="text-center mb-8">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.28em] text-muted-on-light font-semibold mb-1.5 block"
        >
          Celebration Details
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal tracking-tight"
        >
          {showHolyMatrimony ? 'Ceremony & Reception' : 'The Wedding Reception & Venue'}
        </motion.h2>
        <div className="w-8 h-px bg-[#D9CFC4] mx-auto mt-2.5" />

        {/* Tab switcher if both Holy Matrimony & Reception are active */}
        {showHolyMatrimony && activeEvents.length > 1 && (
          <div className="inline-flex items-center gap-1 p-1 bg-[#F0E8DC] rounded-xl mt-5 border border-[#E3D6C5]">
            <button
              type="button"
              onClick={() => {
                haptics.selection();
                setActiveFilter('all');
              }}
              className={`relative min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
                activeFilter === 'all'
                  ? 'text-[#1C1714]'
                  : 'text-[#6B5A4D] hover:text-[#1C1714]'
              }`}
            >
              {activeFilter === 'all' && (
                <motion.div
                  layoutId="activeEventSegment"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                />
              )}
              <span className="relative z-10">All Schedule</span>
            </button>

            {activeEvents.map((ev) => {
              const isSelected = activeFilter === ev.id;
              const isCeremony = ev.type === 'ceremony' || ev.title.toLowerCase().includes('matrimony');
              const label = isCeremony ? 'Holy Matrimony' : 'Reception';

              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => {
                    haptics.selection();
                    setActiveFilter(ev.id);
                  }}
                  className={`relative min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
                    isSelected
                      ? 'text-[#1C1714]'
                      : 'text-[#6B5A4D] hover:text-[#1C1714]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeEventSegment"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Individual Events Schedule Cards List with Subtle Apple-Design Entry Animations */}
      <div className="space-y-6 max-w-sm mx-auto">
        <AnimatePresence mode="popLayout">
          {eventsToRender.map((eventItem, index) => {
            const isCopied = copiedId === eventItem.id;
            const isCeremony = eventItem.type === 'ceremony' || eventItem.title.toLowerCase().includes('matrimony');

            return (
              <motion.div
                key={eventItem.id || index}
                layout
                initial={{ opacity: 0, y: 32, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  ...cardSpringTransition,
                  delay: index * 0.12,
                }}
                className="w-full apple-glass rounded-[28px] overflow-hidden apple-specular shadow-[0_14px_38px_rgba(28,23,20,0.08)]"
              >
                {/* Card Content Details */}
                <div className="p-5 sm:p-6">
                  {/* Event Type Header */}
                  <div className="flex items-center justify-between mb-3 text-xs text-muted-on-light">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#966A38] flex items-center gap-1.5">
                      {isCeremony ? (
                        <>
                          <Church className="w-3.5 h-3.5 text-[#966A38]" />
                          <span>Holy Matrimony</span>
                        </>
                      ) : (
                        <span>{eventItem.subtitle || 'Reception'}</span>
                      )}
                    </span>
                    <span className="font-medium text-muted-on-light">
                      {eventItem.city ? eventItem.city.split(',')[0] : 'Surabaya'}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl text-[#1C1714] font-normal mb-1">
                    {eventItem.venue}
                  </h3>

                  <p className="text-xs text-[#6B5A4D] mb-4 leading-relaxed">
                    {eventItem.address}, {eventItem.city}
                  </p>

                  {/* Venue watercolor illustration */}
                  <div className="relative w-full mb-5 rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(28,23,20,0.06)]">
                    <img
                      src={venueHarrisWatercolor}
                      alt={`${eventItem.venue} watercolor illustration`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-40 sm:h-44 object-cover object-center"
                    />
                  </div>

                  {/* Date & Time Schedule Details */}
                  {(() => {
                    const dateParts = splitEventDate(eventItem.date || 'Saturday, December 19, 2026');
                    const timeParts = splitEventTime(eventItem.time || '06:00 PM WIB');
                    return (
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="p-3.5 rounded-2xl bg-[#FAF6F0]/95 border border-[#EDE4D8] flex items-center gap-3 shadow-2xs">
                          <Calendar className="w-5 h-5 text-[#966A38] shrink-0" strokeWidth={2.25} />
                          <div className="w-px self-stretch bg-[#E6DCCD] shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <span className="text-[8.5px] uppercase tracking-[0.16em] text-[#966A38] block font-semibold">Date</span>
                            <div className="text-[10.5px] text-[#1C1714] leading-snug mt-0.5 whitespace-nowrap">
                              {dateParts.day && <span className="block">{dateParts.day}</span>}
                              <span className="block font-semibold">{dateParts.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#FAF6F0]/95 border border-[#EDE4D8] flex items-center gap-3 shadow-2xs">
                          <Clock className="w-5 h-5 text-[#966A38] shrink-0" strokeWidth={2.25} />
                          <div className="w-px self-stretch bg-[#E6DCCD] shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <span className="text-[8.5px] uppercase tracking-[0.16em] text-[#966A38] block font-semibold">Time</span>
                            <div className="text-[10.5px] text-[#1C1714] leading-snug mt-0.5 whitespace-nowrap">
                              <span className="block font-semibold tabular-nums">{timeParts.time}</span>
                              {timeParts.zone && <span className="block">{timeParts.zone}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Buttons: Google Maps & Copy Address */}
                  <div className="space-y-2 mb-5">
                    <motion.a
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => haptics.light()}
                      transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                      href={eventItem.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-[#1C1714] hover:bg-[#2C221D] text-[#FAF8F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(28,23,20,0.18)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A480] transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#E6D4C1]" />
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-[#A89684]" />
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCopyAddress(eventItem)}
                      transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                      className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-white/90 hover:bg-white text-[#2B211A] border border-[#E0D4C5] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isCopied ? (
                          <motion.div
                            key="copied"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-center gap-1.5 text-emerald-800"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="font-semibold">Address Copied</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#966A38]" />
                            <span>Copy Full Venue Address</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>

                  {/* Practical Info List */}
                  {(eventItem.dressCode || eventItem.parkingInfo) && (
                    <div className="pt-4 border-t border-[#EDE4D8] space-y-2.5 text-xs text-[#5C4B3E]">
                      {eventItem.dressCode && (
                        <div className="flex items-start gap-2.5">
                          <Shirt className="w-4 h-4 text-[#966A38] shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-[#1C1714] block">Dress Code</span>
                            <span className="text-[11px] text-[#6B5A4D] whitespace-pre-line">{eventItem.dressCode}</span>
                            <img
                              src={dresscodePalette}
                              alt="Dress code color palette reference"
                              loading="lazy"
                              decoding="async"
                              className="mt-2.5 w-full max-w-[140px] h-auto rounded-xl"
                            />
                          </div>
                        </div>
                      )}

                      {eventItem.parkingInfo && (
                        <div className="flex items-start gap-2.5">
                          <Car className="w-4 h-4 text-[#966A38] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-[#1C1714] block">Parking</span>
                            <span className="text-[11px] text-[#6B5A4D]">{eventItem.parkingInfo}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};
