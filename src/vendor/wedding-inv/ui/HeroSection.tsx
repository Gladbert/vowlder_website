import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { COUPLE_INFO } from '../data/weddingData';
import { CoupleInfo } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { haptics } from '../utils/haptics';
import { scrollBehavior } from '../utils/motion';

interface HeroSectionProps {
  guestName: string;
  paxCount: number;
  onNotify?: (message: string, type?: 'success' | 'copy' | 'love') => void;
  coupleInfo?: CoupleInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  guestName,
  paxCount,
  onNotify,
  coupleInfo = COUPLE_INFO,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides = coupleInfo.heroSlides && coupleInfo.heroSlides.length > 0 ? coupleInfo.heroSlides : COUPLE_INFO.heroSlides;

  // Auto-advance on every screen size. The interval is stable (it is not reset
  // on each slide change) and only skips while the tab is hidden — nothing
  // pauses it on desktop.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNextSlide = () => {
    haptics.selection();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    haptics.selection();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Support mobile touch horizontal swipe with velocity threshold
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -35 || info.velocity.x < -200) {
      handleNextSlide();
    } else if (info.offset.x > 35 || info.velocity.x > 200) {
      handlePrevSlide();
    }
  };

  const handleDownloadIcs = () => {
    haptics.success();
    downloadIcsFile();
    if (onNotify) {
      onNotify('Calendar event downloaded (.ics)', 'success');
    }
  };

  return (
    <section id="hero-section" className="relative pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 flex flex-col items-center w-full max-w-full overflow-hidden">
      {/* Clean Editorial Kicker */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-[11px] tracking-[0.28em] uppercase font-semibold text-muted-on-light mb-3 text-center"
      >
        Wedding Invitation
      </motion.p>

      {/* Main Typography Header */}
      <div className="text-center mb-6 w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-[11px] uppercase tracking-[0.25em] text-muted-on-light font-medium mb-1.5"
        >
          The Wedding of
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl font-normal text-[#1C1714] tracking-tight leading-none [text-wrap:balance]"
        >
          {coupleInfo.groom.nickname} <span className="font-serif-italic text-3xl sm:text-4xl text-[#966A38] font-normal">&amp;</span> {coupleInfo.bride.nickname}
        </motion.h1>
      </div>

      {/* Photo carousel with touch swipe */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.25 }}
        className={`relative w-full max-w-sm rounded-[30px] overflow-hidden shadow-[0_18px_45px_rgba(28,23,20,0.12)] border border-[#E6DED2] bg-[#140F0D] mb-6 cursor-grab active:cursor-grabbing select-none transition-[aspect-ratio] duration-500 ${
          slides[activeSlide]?.orientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]'
        }`}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 pointer-events-none"
          >
            <img
              src={slides[activeSlide]?.src || slides[0].src}
              alt={`${coupleInfo.groom.nickname} & ${coupleInfo.bride.nickname}`}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-95"
              referrerPolicy="no-referrer"
            />
            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#100C09]/92 via-[#100C09]/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Slide Details */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-white pointer-events-none">
          <p className="font-display text-2xl font-normal text-[#FAF8F5] tracking-wide">
            {coupleInfo.groom.nickname} &amp; {coupleInfo.bride.nickname}
          </p>
          <p className="text-xs text-[#D5C2B0] font-light">
            {coupleInfo.venueSummary.split('-')[1]?.trim() || 'Surabaya'} <span aria-hidden="true">·</span> {coupleInfo.formattedDate.split(',')[1]?.trim() || coupleInfo.formattedDate}
          </p>
        </div>

        {/* Slide dot indicators */}
        <div className="absolute top-4 inset-x-0 flex justify-center items-center gap-1.5 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                haptics.selection();
                setActiveSlide(idx);
              }}
              aria-label={`Go to photo ${idx + 1}`}
              className="min-h-[44px] min-w-[28px] inline-flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
            >
              <motion.div
                animate={{
                  scaleX: activeSlide === idx ? 1 : 0.27,
                  backgroundColor: activeSlide === idx ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                className="w-[22px] h-1.5 rounded-full origin-center"
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Personalized Invitation Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ type: 'spring', stiffness: 240, damping: 25, mass: 0.85 }}
        className="w-full max-w-sm apple-glass rounded-[26px] p-5 sm:p-6 text-center mb-5 apple-specular"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-on-light font-semibold mb-1 block">
          Cordially Invited
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[#1C1714] font-normal mb-2.5">
          {guestName || 'Honoured Guest'}
        </h2>

        <div className="w-8 h-px bg-[#D9CFC4] mx-auto mb-3.5" />

        <p className="text-xs text-[#524135] leading-relaxed mb-3.5 font-normal">
          You are cordially invited to celebrate the wedding of<br />
          <strong className="text-[#1C1714] font-medium text-sm block mt-0.5">
            {coupleInfo.groom.nickname} &amp; {coupleInfo.bride.nickname}
          </strong>
        </p>

        {/* Valid Pax Count */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#524135] mb-5">
          <Users className="w-3.5 h-3.5 text-[#966A38]" />
          <span>Reserved for <strong className="font-semibold text-[#1C1714]">{paxCount} {paxCount > 1 ? 'Guests' : 'Guest'}</strong></span>
        </div>

        {/* Family Blessings */}
        <div className="pt-4 border-t border-[#EDE4D8] text-xs text-[#5C4B3E]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-on-light font-semibold mb-2">
            With the blessings of our beloved families:
          </p>
          <div className="space-y-1.5">
            <p className="font-medium text-[#1C1714]">
              {coupleInfo.groom.parents}
            </p>
            <p className="text-[11px] text-muted-on-light font-light">and</p>
            <p className="font-medium text-[#1C1714]">
              {coupleInfo.bride.parents}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Save The Date & Countdown Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ type: 'spring', stiffness: 240, damping: 25, mass: 0.85, delay: 0.08 }}
        className="w-full max-w-sm apple-glass rounded-[26px] p-5 sm:p-6 text-center mb-5 apple-specular"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-on-light font-semibold mb-1.5 block">
          Save The Date
        </span>
        <h3 className="font-display text-2xl text-[#1C1714] font-normal mb-1">
          {coupleInfo.formattedDate}
        </h3>
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-on-light font-medium mb-5">
          <Clock className="w-3.5 h-3.5 text-[#966A38]" />
          <span>Commencing at {coupleInfo.time}</span>
        </div>

        {/* Live Countdown Component */}
        <div className="pt-4 border-t border-[#EDE4D8] mb-5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-on-light font-semibold mb-2.5 block">
            Counting Down To Our Day
          </span>
          <CountdownTimer targetDate={coupleInfo.eventDate} />
        </div>

        {/* Calendar Sync Options */}
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-on-light font-semibold mb-2 block text-center">
            Add To Your Calendar
          </span>
          <div className="grid grid-cols-2 gap-2">
            <motion.a
              id="hero-google-cal-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 25 }}
              onClick={() => haptics.light()}
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 min-h-[44px] py-2.5 px-3 rounded-xl bg-white/90 hover:bg-white text-[#2B211A] border border-[#E0D4C5] text-xs font-semibold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#966A38]" />
              <span>Google Cal</span>
            </motion.a>
            <motion.button
              id="hero-ics-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 25 }}
              onClick={handleDownloadIcs}
              className="flex items-center justify-center gap-1.5 min-h-[44px] py-2.5 px-3 rounded-xl bg-white/90 hover:bg-white text-[#2B211A] border border-[#E0D4C5] text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
            >
              <span>Apple / .ics</span>
            </motion.button>
          </div>
        </div>

        {/* Subtle Venue Anchor Link to Celebration Details */}
        <div className="pt-3.5 border-t border-[#EDE4D8] flex items-center justify-between text-xs text-[#524135]">
          <div className="flex items-center gap-1.5 text-left truncate mr-2">
            <MapPin className="w-3.5 h-3.5 text-[#966A38] shrink-0" />
            <span className="font-medium text-[#1C1714] truncate">{coupleInfo.venueSummary}</span>
          </div>
          <button
            onClick={() => {
              haptics.selection();
              const el = document.getElementById('events-section');
              if (el) el.scrollIntoView({ behavior: scrollBehavior() });
            }}
            className="text-[11px] font-semibold text-[#966A38] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 min-h-[44px] px-2 -mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] rounded-lg"
          >
            <span>Venue Guide</span>
            <span>↓</span>
          </button>
        </div>
      </motion.div>

      {/* Scripture Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ type: 'spring', stiffness: 240, damping: 25, mass: 0.85, delay: 0.06 }}
        className="w-full max-w-sm px-4 sm:px-5 py-4 rounded-2xl bg-[#F7F2EA]/85 border border-[#E8DFC8] text-center"
      >
        <p className="font-serif-italic text-sm text-[#4F3E32] leading-relaxed">
          {coupleInfo.verse}
        </p>
      </motion.div>
    </section>
  );
};
