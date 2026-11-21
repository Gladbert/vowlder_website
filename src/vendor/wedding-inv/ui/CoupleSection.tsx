import React from 'react';
import { motion } from 'motion/react';
const Instagram = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
import { COUPLE_INFO } from '../data/weddingData';
import { CoupleInfo } from '../types';

interface CoupleSectionProps {
  coupleInfo?: CoupleInfo;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  coupleInfo = COUPLE_INFO,
}) => {
  return (
    <section id="couple-section" className="py-12 px-4 sm:px-6 w-full max-w-full overflow-hidden">
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal tracking-tight"
        >
          The Bride &amp; Groom
        </motion.h2>
        <div className="w-8 h-px bg-[#D9CFC4] mx-auto mt-2.5" />
      </div>

      <div className="flex flex-col gap-5 max-w-sm mx-auto">
        {/* The Groom Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 0.85 }}
          whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
          className="apple-glass rounded-[26px] p-6 flex flex-col items-center text-center apple-specular group"
        >
          <div className="relative w-44 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-[0_8px_20px_rgba(28,23,20,0.08)] mb-5 bg-[#EDE6DC]">
            <img
              src={coupleInfo.groom.photoUrl || "/src/assets/images/japan_sepia_bamboo_1789399855253.webp"}
              alt={coupleInfo.groom.fullName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
          </div>

          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#966A38] mb-1.5">
            {coupleInfo.groom.role || 'The Groom'}
          </p>

          <h3 className="font-display text-2xl font-normal text-[#1C1714] mb-1">
            {coupleInfo.groom.fullName}
          </h3>

          <div className="text-xs text-[#5C4B3E] mb-4 leading-relaxed">
            <p className="text-[11px] text-muted-on-light mb-0.5 font-medium">Son of:</p>
            <p className="font-medium text-[#1C1714]">
              {coupleInfo.groom.parents}
            </p>
          </div>

          {coupleInfo.groom.instagram && (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 25 }}
              href={coupleInfo.groom.instagramUrl || `https://instagram.com/${coupleInfo.groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-white/90 border border-[#E0D4C5] text-xs text-[#6B5A4D] font-medium shadow-2xs hover:text-[#1C1714] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
            >
              <Instagram className="w-3.5 h-3.5 text-[#966A38]" />
              <span>{coupleInfo.groom.instagram}</span>
            </motion.a>
          )}
        </motion.div>

        {/* Minimalist Ampersand Connector */}
        <div className="flex items-center justify-center -my-2.5 z-10 pointer-events-none">
          <motion.div
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.14 }}
            className="w-8 h-8 rounded-full bg-white border border-[#E2D8CC] shadow-xs flex items-center justify-center text-[#966A38] font-serif-italic text-lg"
          >
            &amp;
          </motion.div>
        </div>

        {/* The Bride Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 0.85, delay: 0.1 }}
          whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
          className="apple-glass rounded-[26px] p-6 flex flex-col items-center text-center apple-specular group"
        >
          <div className="relative w-44 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-[0_8px_20px_rgba(28,23,20,0.08)] mb-5 bg-[#EDE6DC]">
            <img
              src={coupleInfo.bride.photoUrl || "/src/assets/images/japan_sepia_shrine_1789399867599.webp"}
              alt={coupleInfo.bride.fullName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
          </div>

          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#966A38] mb-1.5">
            {coupleInfo.bride.role || 'The Bride'}
          </p>

          <h3 className="font-display text-2xl font-normal text-[#1C1714] mb-1">
            {coupleInfo.bride.fullName}
          </h3>

          <div className="text-xs text-[#5C4B3E] mb-4 leading-relaxed">
            <p className="text-[11px] text-muted-on-light mb-0.5 font-medium">Daughter of:</p>
            <p className="font-medium text-[#1C1714]">
              {coupleInfo.bride.parents}
            </p>
          </div>

          {coupleInfo.bride.instagram && (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 25 }}
              href={coupleInfo.bride.instagramUrl || `https://instagram.com/${coupleInfo.bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-white/90 border border-[#E0D4C5] text-xs text-[#6B5A4D] font-medium shadow-2xs hover:text-[#1C1714] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38]"
            >
              <Instagram className="w-3.5 h-3.5 text-[#966A38]" />
              <span>{coupleInfo.bride.instagram}</span>
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

