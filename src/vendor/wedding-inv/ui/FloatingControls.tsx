import React from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Music, Smartphone, Monitor } from 'lucide-react';
import { WEDDING_TRACK } from '../utils/audioSynth';

interface FloatingControlsProps {
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  viewMode: 'mobile' | 'fluid';
  onToggleViewMode: () => void;
  showScreenToggle: boolean;
  onOpenShare?: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPlayingMusic,
  onToggleMusic,
  viewMode,
  onToggleViewMode,
  showScreenToggle,
}) => {
  return (
    <div className="fixed top-[calc(env(safe-area-inset-top,0px)+12px)] sm:top-4 right-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2">
      {/* Screen View Mode Toggle (on tablets/desktops) */}
      {showScreenToggle && (
        <motion.button
          id="screen-view-toggle-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          onClick={onToggleViewMode}
          title={viewMode === 'mobile' ? 'Switch to Expanded View' : 'Switch to Mobile Frame'}
          className="hidden md:flex items-center gap-1.5 min-h-[44px] h-11 px-3.5 py-1.5 rounded-full bg-[#1A1412]/85 hover:bg-[#1A1412] text-[#FAF8F5] text-xs font-medium backdrop-blur-xl border border-white/[0.14] shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A480]"
        >
          {viewMode === 'mobile' ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#E6D4C1]" />
              <span>Expanded</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#E6D4C1]" />
              <span>Mobile Frame</span>
            </>
          )}
        </motion.button>
      )}

      {/* Background Music Toggle with Live Equalizer Animation */}
      <motion.button
        id="floating-music-btn"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 380, damping: 25 }}
        onClick={onToggleMusic}
        title={isPlayingMusic ? 'Mute Music' : `Play Soundtrack (${WEDDING_TRACK.title} - ${WEDDING_TRACK.version})`}
        aria-label={isPlayingMusic ? 'Mute music' : 'Play music'}
        aria-pressed={isPlayingMusic}
        className={`min-h-[44px] h-11 px-3.5 rounded-full flex items-center gap-2 backdrop-blur-xl border shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A480] ${
          isPlayingMusic
            ? 'bg-white text-[#1C1714] border-white/80 shadow-[0_4px_16px_rgba(255,255,255,0.25)]'
            : 'bg-[#1A1412]/85 text-muted-on-dark border-white/[0.14] hover:text-white hover:bg-[#1A1412]'
        }`}
      >
        {isPlayingMusic ? (
          <>
            {/* 3 Animated Equalizer Bars — the tiny status indicator always
                animates, so it is exempt from the global reduce-motion config. */}
            <MotionConfig reducedMotion="never">
              <div className="flex items-end gap-0.5 h-3.5">
                <motion.span
                  animate={{ scaleY: [0.29, 1, 0.43, 0.86, 0.29] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  className="w-0.5 h-3.5 bg-[#966A38] rounded-full origin-bottom"
                />
                <motion.span
                  animate={{ scaleY: [0.86, 0.36, 1, 0.5, 0.86] }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
                  className="w-0.5 h-3.5 bg-[#966A38] rounded-full origin-bottom"
                />
                <motion.span
                  animate={{ scaleY: [0.43, 0.93, 0.29, 1, 0.43] }}
                  transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut', delay: 0.3 }}
                  className="w-0.5 h-3.5 bg-[#966A38] rounded-full origin-bottom"
                />
              </div>
            </MotionConfig>
            <span className="text-[11.5px] font-medium text-[#1C1714]">{WEDDING_TRACK.title}</span>
          </>
        ) : (
          <>
            <Music className="w-3.5 h-3.5 text-[#C4A480]" />
            <span className="text-[11.5px] font-medium">Play Music</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
