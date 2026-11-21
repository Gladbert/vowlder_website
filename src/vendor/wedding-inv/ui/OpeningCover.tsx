import React, { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Mail, Calendar, MapPin, Users, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { CoupleInfo } from '../types';
import { COUPLE_INFO } from '../data/weddingData';
import logoAsset from '../assets/wedding_logo.png';
import envelopeBackArt from '../assets/envelope_back.webp';
import envelopeFrontArt from '../assets/envelope_front.webp';
import envelopeFlapArt from '../assets/envelope_top_flap.webp';
import waxSealArt from '../assets/wax_seal.webp';
import { assetUrl } from '../assets/url';

interface OpeningCoverProps {
  guestName: string;
  paxCount: number;
  relationship?: string;
  isRsvpDone?: boolean;
  onOpen: () => void;
  onStartAudio?: () => void;
  coupleInfo?: CoupleInfo;
}

export const OpeningCover: React.FC<OpeningCoverProps> = ({
  guestName,
  paxCount,
  relationship,
  isRsvpDone = false,
  onOpen,
  onStartAudio,
  coupleInfo = COUPLE_INFO,
}) => {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isPaperCleared, setIsPaperCleared] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [flapZIndex, setFlapZIndex] = useState<number>(45);
  const [logoLoaded, setLogoLoaded] = useState<boolean>(true);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  React.useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const activeLogoSrc = assetUrl(logoAsset);

  const isDefaultGuest =
    !guestName ||
    guestName.trim().toLowerCase() === 'honoured guest' ||
    guestName.trim().toLowerCase() === 'honored guest';

  // Fast, continuous, fluid opening choreography:
  // 1. Flap rotates open in 3D (0 - 0.38s) while paper stays inside.
  // 2. Only after flap clears top edge (0.38s), paper slides out smoothly from pocket.
  // 3. Mask container clips strictly at envelope bottom (0px), preventing paper clipping through bottom envelope.
  // 4. Card resides at z-index: -1 inside mask, physically underneath closed flap.
  // 5. At 0.8s, paper promotes to z: 50, unclips, and glides down into center of page (y: 0).
  const handleOpenEnvelope = () => {
    if (isOpened) {
      handleCompleteOpen();
      return;
    }
    if (isOpening) return;

    clearAllTimers();
    haptics.medium();
    if (onStartAudio) {
      onStartAudio();
    }

    setIsOpening(true);
    setIsPaperCleared(false);
    setFlapZIndex(45);

    // 1. At 380ms: As flap rotates past -90deg (during 0.8s rotation), drop flap behind the back plate (zIndex: 5)
    const t1 = setTimeout(() => {
      setFlapZIndex(5);
    }, 380);

    // 2. At 800ms: Paper has cleanly extracted from pocket with bottom hidden.
    // Unmask container and promote paper to zIndex 50 as it glides in front of envelope down into center (y: 0).
    const t2 = setTimeout(() => {
      setIsPaperCleared(true);
    }, 800);

    // 3. At 1200ms: Paper and envelope have smoothly settled into reading position
    const t3 = setTimeout(() => {
      setIsOpened(true);
    }, 1200);

    timersRef.current = [t1, t2, t3];
  };

  // Complete invitation and enter wedding celebration
  const handleCompleteOpen = () => {
    haptics.success();
    onOpen();
  };

  // Fast re-seal envelope to replay the animation
  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.light();
    clearAllTimers();
    setIsOpened(false);
    setIsOpening(false);
    setIsPaperCleared(false);

    // Restore flap zIndex as it rotates forward past -90deg (at ~220ms during 0.5s closing)
    const t1 = setTimeout(() => {
      setFlapZIndex(45);
    }, 220);

    timersRef.current = [t1];
  };

  return (
    // The envelope reveal is the one deliberate, user-initiated moment of the
    // invitation, so it always plays its full 3D choreography. The rest of the
    // app still honors the OS "reduce motion" preference via <App>'s MotionConfig.
    <MotionConfig reducedMotion="never">
    <motion.div
      id="opening-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(16px)',
        transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#E5D4BB] text-[#333333] overflow-hidden select-none px-4 py-4"
    >
      {/* Shared watercolor paper grain filter (paper, envelope, button) */}
      <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
        <filter id="wcGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Background: organic watercolor washes (#F6F2EB base, #FCF9F5 light) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#E5D4BB]" />
        <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_16%_10%,rgba(250,244,234,0.92)_0%,rgba(250,244,234,0)_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(105%_85%_at_86%_22%,rgba(168,178,150,0.35)_0%,rgba(168,178,150,0)_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(95%_80%_at_26%_92%,rgba(203,158,148,0.4)_0%,rgba(203,158,148,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_80%_86%,rgba(186,158,120,0.42)_0%,rgba(186,158,120,0)_64%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_60%_45%,rgba(255,252,246,0.3)_0%,rgba(255,252,246,0)_70%)]" />
      </div>

      {/* Re-fold button when opened */}
      {isOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          onClick={handleReplay}
          title="Fold envelope back"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 p-2.5 rounded-full bg-[#3B2A22]/10 hover:bg-[#3B2A22]/20 backdrop-blur-md border border-[#3B2A22]/20 text-[#3B2A22] transition-colors cursor-pointer shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </motion.button>
      )}

      {/* Main Optical Centering Stage - Grid Stack ensures paper is in the EXACT middle of the page */}
      <div
        className="relative z-10 w-full max-w-[360px] sm:max-w-[390px] flex flex-col items-center justify-center my-auto"
        style={{ perspective: 1200 }}
      >
        <div className="relative w-full grid grid-cols-1 grid-rows-1 items-center justify-items-center">
          {/* 1. ENVELOPE BACK PLATE (zIndex: 10 - Interior lining)     */}
          <motion.div
            id="envelope-back-plate"
            animate={{
              y: isOpening ? 150 : 0,
              scale: isOpening ? 0.94 : 1,
              opacity: isOpening ? 0.55 : 1,
            }}
            transition={{
              duration: 0.55,
              delay: isOpening ? 0.72 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`col-start-1 row-start-1 w-full h-[235px] sm:h-[250px] relative rounded-b-[22px] bg-[#E6D3B5] overflow-hidden shadow-[0_18px_45px_rgba(206,189,164,0.4)] ${
              !isOpening && !isOpened ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{ zIndex: 10 }}
            onClick={!isOpening && !isOpened ? handleOpenEnvelope : undefined}
          >
            <img loading="lazy"
              src={assetUrl(envelopeBackArt)}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

          {/* 2. CLIP-PATH MASKED CONTAINER (Holds Invitation Card)     */}
          {/* - Container has clip-path strictly following the envelope */}
          {/*   rounded bottom (round 0 0 22px 22px) and sides (0px),   */}
          {/*   preventing square edges from clipping through corners.  */}
          {/* - Card is set to 'absolute' with 'z-index: -1' inside this */}
          {/*   container, physically residing underneath closed flap   */}
          {/*   and pocket, revealing only its top edge as it slides up.*/}
          <div
            id="envelope-pocket-mask"
            className="col-start-1 row-start-1 w-full h-[235px] sm:h-[250px] relative pointer-events-none grid grid-cols-1 grid-rows-1 items-center justify-items-center"
            style={{
              zIndex: isPaperCleared ? 50 : 20,
              clipPath: isPaperCleared ? 'none' : 'inset(-2500px 0px 0px 0px round 0px 0px 22px 22px)',
            }}
          >
            <motion.div
              id="invitation-paper-card"
              initial={false}
              animate={{
                y: isOpening ? [150, 150, -115, 0] : 150,
                scale: isOpening ? [0.92, 0.92, 0.98, 1] : 0.92,
                clipPath: isOpening
                  ? [
                      'inset(0% 0% 50% 0% round 22px)',
                      'inset(0% 0% 50% 0% round 22px)',
                      'inset(-100% 0% 50% 0% round 22px)',
                      'none',
                    ]
                  : 'inset(0% 0% 50% 0% round 22px)',
              }}
              transition={{
                y: {
                  duration: isOpening ? 1.2 : 0.45,
                  times: isOpening ? [0, 0.32, 0.68, 1] : undefined,
                  ease: isOpening ? [0.22, 1, 0.36, 1] : [0.32, 0.72, 0, 1],
                },
                scale: {
                  duration: isOpening ? 1.2 : 0.45,
                  times: isOpening ? [0, 0.32, 0.68, 1] : undefined,
                  ease: isOpening ? [0.22, 1, 0.36, 1] : [0.32, 0.72, 0, 1],
                },
                clipPath: {
                  duration: isOpening ? 1.2 : 0.4,
                  times: isOpening ? [0, 0.32, 0.68, 1] : undefined,
                  ease: isOpening ? [0.22, 1, 0.36, 1] : [0.32, 0.72, 0, 1],
                },
              }}
              onClick={(e) => isOpened && e.stopPropagation()}
              className={`col-start-1 row-start-1 absolute w-[calc(100%-16px)] sm:w-[calc(100%-20px)] max-h-[82dvh] sm:max-h-[85dvh] rounded-[22px] bg-[#F9F6F0] text-[#3B2A22] p-5 sm:p-6 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(180,165,145,0.25)] border border-[rgba(230,223,211,0.6)] touch-pan-y ${
                isOpened ? 'overflow-y-auto cursor-auto pointer-events-auto' : 'overflow-hidden pointer-events-none'
              }`}
              style={{
                zIndex: isPaperCleared ? 50 : -1,
                pointerEvents: isOpened ? 'auto' : 'none',
                backgroundImage: [
                  'radial-gradient(115% 85% at 12% 8%, rgba(222,209,188,0.30) 0%, rgba(222,209,188,0) 58%)',
                  'radial-gradient(95% 75% at 88% 16%, rgba(232,223,208,0.34) 0%, rgba(232,223,208,0) 60%)',
                  'radial-gradient(85% 70% at 22% 92%, rgba(214,198,173,0.24) 0%, rgba(214,198,173,0) 62%)',
                  'radial-gradient(75% 60% at 78% 88%, rgba(240,234,224,0.40) 0%, rgba(240,234,224,0) 66%)',
                  'linear-gradient(180deg, #F9F6F0 0%, #F4EFE6 100%)',
                ].join(', '),
              }}
            >
              {/* Watercolor paper fiber grain */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] opacity-[0.12] mix-blend-multiply"
              >
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" filter="url(#wcGrain)" />
                </svg>
              </div>

              {/* Soft watercolor frame lines */}
              <div className="absolute inset-2 rounded-[18px] border border-[#521721]/20 pointer-events-none" />
              <div className="absolute inset-3 rounded-[14px] border border-[#E9DFCF] pointer-events-none" />

              {/* Letter Inner Content */}
              <div className="w-full flex flex-col items-center">
                {/* Auspicious Monogram Crest (Couple's Real PNG Logo with Monogram Fallback) */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-px w-6 bg-[#CEBDA4]/40" />
                  <div className="w-10 h-10 flex items-center justify-center">
                    {logoLoaded ? (
                      <img loading="lazy"
                        src={activeLogoSrc}
                        alt="Gladbert & Monica Crest"
                        decoding="async"
                        className="w-9 h-9 object-contain drop-shadow-xs"
                        onError={() => setLogoLoaded(false)}
                      />
                    ) : (
                      <span className="font-display text-base font-semibold text-[#521721] tracking-wider">
                        G &amp; M
                      </span>
                    )}
                  </div>
                  <div className="h-px w-6 bg-[#CEBDA4]/40" />
                </div>

                {/* English Wedding Ceremony Header */}
                <span className="text-[9.5px] tracking-[0.3em] uppercase text-[#857458] font-semibold mb-0.5">
                  The Wedding Celebration Of
                </span>

                {/* Couple's Names */}
                <h1 className="font-display text-2xl sm:text-3xl text-[#1E1712] font-normal tracking-tight leading-none mb-3">
                  {coupleInfo.groom.nickname} <span className="font-serif-italic text-xl sm:text-2xl text-[#521721]">&amp;</span> {coupleInfo.bride.nickname}
                </h1>

                {/* Personalized Guest Slip in English */}
                <div className="w-full rounded-xl bg-[#F4EFE6]/80 border border-[#E1D5C2] p-3 sm:p-3.5 mb-3 text-center shadow-xs">
                  <div className="text-[9.5px] tracking-[0.24em] text-[#521721] font-semibold uppercase mb-1">
                    {isDefaultGuest ? 'CORDIAL INVITATION' : (relationship?.trim() ? relationship.trim().toUpperCase() : 'HONOURED GUEST')}
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold text-[#1C1611] tracking-tight mb-1.5">
                    {isDefaultGuest ? 'Honoured Guest' : (guestName || 'Honoured Guest')}
                  </h2>

                  <p className="text-[11px] text-[#5A4839] leading-relaxed mb-2 font-serif italic">
                    &ldquo;Together with our families, we joyfully invite you to celebrate our marriage and share in the blessing of our wedding celebration.&rdquo;
                  </p>

                  <div className="pt-2 border-t border-[#E1D5C2] flex flex-col items-center justify-center gap-1.5 text-[11px] text-[#3D3025]">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <Users className="w-3 h-3 text-[#521721]" />
                      <span>Reserved Seating: <strong className="text-[#1C1611] font-semibold">{paxCount} {paxCount > 1 ? 'Guests' : 'Guest'}</strong></span>
                    </div>
                    {isRsvpDone ? (
                      <div className="inline-flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>RSVP Confirmed (Done)</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Date & Venue details in English */}
                <div className="flex flex-col items-center gap-1 text-[11px] text-[#554333] mb-3.5">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#521721]" />
                    <span>{coupleInfo.formattedDate} • {coupleInfo.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10.5px] text-[#705B48]">
                    <MapPin className="w-3 h-3 text-[#521721]" />
                    <span>{coupleInfo.venueSummary}</span>
                  </div>
                </div>

                {/* Action button on the letter */}
                <motion.button
                  id="enter-celebration-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCompleteOpen}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#521721] hover:bg-[#3F1119] text-[#FCF9F5] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(31,23,18,0.3)] cursor-pointer border border-[#E1D5C2]/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1D5C2]"
                >
                  <span>Enter Wedding Celebration</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E9DFCF]" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* 3. ENVELOPE FRONT POCKET (zIndex: 30)                    */}
          {/* Sits in front of the invitation paper (covers it inside); */}
          {/* the art's open mouth lets the paper peek through.         */}
          <motion.div
            id="envelope-front-pocket"
            animate={{
              y: isOpening ? 150 : 0,
              scale: isOpening ? 0.94 : 1,
              opacity: isOpening ? 0.55 : 1,
            }}
            transition={{
              duration: 0.55,
              delay: isOpening ? 0.72 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden="true"
            className="col-start-1 row-start-1 w-full h-[235px] sm:h-[250px] relative pointer-events-none rounded-b-[22px] overflow-hidden"
            style={{ zIndex: 30 }}
          >
            <img loading="lazy"
              src={assetUrl(envelopeFrontArt)}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable={false}
              style={{ height: 'calc(100% + 10px)' }}
              className="absolute inset-x-0 top-0 w-full object-cover"
            />
          </motion.div>

          {/* 4. TOP FLAP & WAX SEAL (zIndex: flapZIndex: 45 then 5)    */}
          {/* Folds up FIRST in 3D perspective along top axis.          */}
          {/* Perfectly proportioned: seals envelope above the text.    */}
          <motion.div
            id="envelope-flap-layer"
            animate={{
              y: isOpening ? 150 : 0,
              scale: isOpening ? 0.94 : 1,
              opacity: isOpening ? 0.55 : 1,
            }}
            transition={{
              duration: 0.55,
              delay: isOpening ? 0.72 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="col-start-1 row-start-1 w-full h-[235px] sm:h-[250px] relative pointer-events-none"
            style={{ zIndex: flapZIndex }}
          >
            {/* 3D Top Triangular Flap */}
            <motion.div
              id="envelope-flap"
              animate={{
                rotateX: isOpening ? -180 : 0,
              }}
              transition={{
                rotateX: {
                  duration: isOpening ? 0.8 : 0.5,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                transition: isOpening
                  ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="absolute top-0 inset-x-0 aspect-[1222/586] pointer-events-none"
            >
              {/* Front Face of Flap (Visible when sealed) */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Flap art at its original proportions: full width, tip at its
                    natural depth, with the seal on the flap's point. */}
                <img loading="lazy"
                  src={assetUrl(envelopeFlapArt)}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full filter drop-shadow-[0_10px_22px_rgba(206,189,164,0.5)]"
                />

                {/* Wax seal art — tall portrait graphic (seal face ~mid, wax drips
                    above/below). Sits centred on the flap tip at the middle. */}
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="absolute bottom-[46px] left-1/2 -translate-x-1/2 translate-y-1/2 filter drop-shadow-[0_10px_18px_rgba(79,10,16,0.35)] cursor-pointer pointer-events-auto select-none"
                  onClick={!isOpening && !isOpened ? handleOpenEnvelope : undefined}
                  title="Click to break seal and open invitation"
                >
                  <img loading="lazy"
                    src={assetUrl(waxSealArt)}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    draggable={false}
                    className="block h-[154px] sm:h-[162px] w-auto object-contain"
                  />
                </motion.div>
              </div>

              {/* Back Face of Flap (Revealed when open) — the flap PNG itself,
                  mirrored by the rotateY so it reads as the flap's reverse. */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <img loading="lazy"
                  src={assetUrl(envelopeFlapArt)}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full filter drop-shadow-[0_-6px_12px_rgba(206,189,164,0.45)]"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 4. PRIMARY ACTION BUTTON (Spaced comfortably below envelope)*/}
        <AnimatePresence>
          {!isOpening && !isOpened && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15, transition: { duration: 0.25 } }}
              className="w-full mt-8 sm:mt-10 flex flex-col items-center"
            >
              <motion.button
                id="open-invitation-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                onClick={handleOpenEnvelope}
                className="relative w-full min-h-[48px] py-3.5 px-6 rounded-xl overflow-hidden bg-[#F9F6F0] hover:bg-[#F1EBE0] text-[#521721] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(180,165,145,0.25)] cursor-pointer border border-[#E9DFCF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9DFCF]"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply">
                  <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" filter="url(#wcGrain)" />
                  </svg>
                </span>
                <Mail className="relative w-4 h-4 text-[#521721]" />
                <span className="relative">Open Wedding Invitation</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </MotionConfig>
  );
};
