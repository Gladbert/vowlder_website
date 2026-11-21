import React from 'react';
import { motion } from 'motion/react';
import { Music, Heart } from 'lucide-react';
import { CoupleInfo } from '../types';
import { COUPLE_INFO } from '../data/weddingData';
import { WEDDING_TRACK } from '../utils/audioSynth';
import vowlderName from '../assets/vowlder_name.png';
import { assetUrl } from '../assets/url';

interface FooterSectionProps {
  coupleInfo?: CoupleInfo;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  coupleInfo = COUPLE_INFO,
}) => {
  return (
    <footer id="footer-section" className="pt-10 pb-28 sm:pb-32 px-4 sm:px-6 text-center border-t border-[#EAE1D5] bg-[#F7F2EB] w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto"
      >
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted-on-light font-semibold mb-2">
          With Our Deepest Gratitude
        </p>

        <h3 className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal tracking-tight mb-2.5">
          {coupleInfo.groom.nickname} <span className="font-serif-italic text-2xl sm:text-3xl text-[#966A38]">&amp;</span> {coupleInfo.bride.nickname}
        </h3>

        <p className="text-xs text-[#6B5A4D] leading-relaxed mb-6 font-normal">
          Thank you for celebrating this day with us.
        </p>

        {/* Family Acknowledgement */}
        <div className="py-4 border-y border-[#E5DACD] text-xs text-[#523F32] mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-on-light font-semibold mb-2">
            With Love &amp; Joy from Our Families:
          </p>
          <div className="space-y-1.5">
            <p className="font-medium text-[#1C1714]">
              {coupleInfo.groom.parents}
            </p>
            <p className="text-[11px] text-[#7A6757] font-light">and</p>
            <p className="font-medium text-[#1C1714]">
              {coupleInfo.bride.parents}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-1.5 text-xs text-[#7A6757]">
          <Music className="w-3.5 h-3.5 text-[#966A38]" />
          <span>Soundtrack: {WEDDING_TRACK.title}</span>
        </div>

        <p className="text-[10px] tracking-[0.25em] text-muted-on-light font-medium">
          {coupleInfo.hashtag}
        </p>

        {/* Wedding Attribution & Credits */}
        <div className="mt-8 pt-4 border-t border-[#E5DACD]/70 flex items-center justify-center text-xs text-[#7A6757]">
          <p className="text-[11px] text-muted-on-light tracking-wide flex flex-wrap items-center justify-center gap-0.5 font-normal">
            <span>crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C45E5E] fill-[#C45E5E] inline-block" aria-hidden="true" />
            <span>by Gladbert</span>
            <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
              <span>@</span>
              <a
                href="https://www.instagram.com/vowlder.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vowlder on Instagram"
                className="inline-flex items-center p-[17px] -m-[17px] transition-opacity hover:opacity-75"
              >
                <img
                  src={assetUrl(vowlderName)}
                  alt="Vowlder"
                  width={256}
                  height={40}
                  className="h-[10.5px] w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

