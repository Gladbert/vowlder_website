import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Film } from 'lucide-react';
import { StoryMilestone, StoryMedia } from '../types';
import { DEFAULT_STORY_MILESTONES } from '../data/weddingData';
import { getYouTubeEmbedUrl } from '../store';
import { haptics } from '../utils/haptics';

interface StoryTimelineSectionProps {
  milestones?: StoryMilestone[];
  onNotify?: (message: string, type?: 'success' | 'copy' | 'love') => void;
}

/** Media[] is the source of truth; fall back to the legacy single photo/video
 *  fields for configs saved before the media list existed. */
function milestoneMedia(item: StoryMilestone): StoryMedia[] {
  const media: StoryMedia[] = item.media && item.media.length > 0 ? [...item.media] : [];
  if (media.length === 0) {
    if (item.videoUrl) media.push({ id: `${item.id}-video`, type: 'video', url: item.videoUrl, orientation: item.orientation });
    if (item.photoUrl) media.push({ id: `${item.id}-photo`, type: 'image', url: item.photoUrl, orientation: item.orientation });
  }
  // Entries switched off in the admin stay in the config but are never shown.
  return media.filter((m) => m.enabled !== false);
}

/** Swipeable media track for one milestone: a snap carousel once there is more
 *  than a single item, with dots tracking the slide in view. Each slide keeps
 *  its own portrait/landscape shape. */
const MilestoneMediaCarousel: React.FC<{
  media: StoryMedia[];
  title: string;
  narrative: string;
  onOpen: (photo: { src: string; title: string; narrative: string }) => void;
}> = ({ media, title, narrative, onOpen }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isCarousel = media.length > 1;
  const activeIsVideo = media[activeIndex]?.type === 'video';

  /** Index of the slide nearest the track's centre. Rect maths rather than
   *  offsetLeft, because the timeline cards animate with transforms. */
  const closestSlide = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    return closest;
  };

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    const child = track?.children[index] as HTMLElement | undefined;
    if (!track || !child) return;
    const delta = child.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({
      left: Math.max(0, track.scrollLeft + delta - (track.clientWidth - child.clientWidth) / 2),
      behavior: 'smooth',
    });
  };

  // Auto-advance like the hero carousel (2s per slide), except a video holds
  // longer so a clip is not scrolled away the moment it is reached. Paused while
  // a pointer rests on the track, so a read or a playing clip stays put.
  useEffect(() => {
    if (!isCarousel || isPaused) return;
    const timer = setTimeout(
      () => {
        if (document.visibilityState !== 'visible') return;
        scrollToSlide((closestSlide() + 1) % media.length);
      },
      activeIsVideo ? 8000 : 2000
    );
    return () => clearTimeout(timer);
  }, [isCarousel, isPaused, activeIsVideo, activeIndex, media.length]);

  // A milestone with no media (or everything switched off) renders nothing.
  if (media.length === 0) return null;

  return (
    <div
      className="mb-3"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={() => setActiveIndex(closestSlide())}
        className={`flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isCarousel ? '-mx-1 px-1' : ''
        }`}
      >
        {media.map((item) => {
          const shape = item.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/10]';
          const sizing = isCarousel ? 'w-[86%] shrink-0 snap-center' : 'w-full';

          if (item.type === 'video') {
            const embed = getYouTubeEmbedUrl(item.url);
            if (!embed) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${sizing} ${shape} flex items-center justify-center gap-2 rounded-xl bg-black/90 text-[#FAF8F5] text-xs font-medium border border-[#E0D4C5]`}
                >
                  <Film className="w-4 h-4 text-[#C4A480]" />
                  <span>Watch video</span>
                </a>
              );
            }
            return (
              <div
                key={item.id}
                className={`${sizing} ${shape} rounded-xl overflow-hidden bg-black/90 shadow-sm border border-[#E0D4C5]`}
              >
                <iframe
                  src={embed}
                  title={`${title} Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                haptics.selection();
                onOpen({ src: item.url, title, narrative });
              }}
              className={`${sizing} ${shape} relative rounded-xl overflow-hidden bg-[#1E1712] cursor-pointer group/img shadow-2xs`}
            >
              <img
                src={item.url}
                alt={title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-500 ease-out brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
              <span className="absolute bottom-2 right-2 text-[10px] text-white/90 font-medium tracking-wide drop-shadow-sm">
                Enlarge Photo
              </span>
            </div>
          );
        })}
      </div>

      {isCarousel && (
        <div className="flex items-center justify-center gap-1.5 mt-2" aria-hidden="true">
          {media.map((item, index) => (
            <span
              key={item.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-4 bg-[#966A38]' : 'w-1.5 bg-[#D9CFC4]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const StoryTimelineSection: React.FC<StoryTimelineSectionProps> = ({
  milestones = DEFAULT_STORY_MILESTONES,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; title: string; narrative: string } | null>(null);

  return (
    <section id="story-section" className="py-12 sm:py-16 px-4 sm:px-6 w-full max-w-full overflow-hidden bg-[#FAF8F5]">
      <div className="text-center mb-10 sm:mb-14">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.3em] text-muted-on-light font-semibold mb-1.5 block"
        >
          Our Journey
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal tracking-tight"
        >
          The Story of Us
        </motion.h2>
        <div className="w-8 h-px bg-[#D9CFC4] mx-auto mt-2.5" />
      </div>

      {/* Phone-First Vertical Chronological Timeline */}
      <div className="relative max-w-lg mx-auto">
        {/* Mobile Continuous Spine Line */}
        <div className="absolute left-5 sm:left-6 top-3 bottom-6 w-[2px] bg-gradient-to-b from-[#C4A480]/25 via-[#C4A480]/60 to-[#C4A480]/20 pointer-events-none" />

        <div className="space-y-8 sm:space-y-10 relative">
          {milestones.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 240, damping: 25, mass: 0.85, delay: Math.min(index, 8) * 0.08 }}
                className="relative flex items-start gap-4 sm:gap-5 pl-2 group"
              >
                {/* Timeline node indicator */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24, delay: Math.min(index, 8) * 0.08 + 0.08 }}
                  className="relative z-10 shrink-0 mt-1"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF8F5] border-2 border-[#C4A480] shadow-2xs flex items-center justify-center group-hover:border-[#966A38] transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#966A38] group-hover:bg-[#B38044] transition-colors" />
                  </div>
                </motion.div>

                {/* Content Card (Mobile-First responsive container) */}
                <div className="flex-1 min-w-0 bg-white/90 backdrop-blur-md border border-[#EADBCC] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(28,23,20,0.04)] hover:shadow-[0_8px_28px_rgba(28,23,20,0.08)] transition-all duration-300">
                  {/* Unboxed Metadata (Zero-Pill Rule) */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-on-light font-medium mb-1 flex-wrap">
                    <span className="font-semibold text-[#966A38]">{item.year}</span>
                    <span aria-hidden="true" className="text-[#C4A480]">·</span>
                    <span>{item.date}</span>
                    {item.category && (
                      <>
                        <span aria-hidden="true" className="text-[#C4A480]">·</span>
                        <span className="capitalize text-[#7A6757]">{item.category.replace(/_/g, ' ')}</span>
                      </>
                    )}
                  </div>

                  {/* Milestone Title */}
                  <h3 className="font-display text-xl sm:text-2xl text-[#1C1714] font-normal leading-snug">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  {item.subtitle && (
                    <p className="text-xs font-serif-italic text-[#966A38] mt-0.5 mb-2.5">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Swipeable media carousel: zero, one, or many items — image
                      or video, each with its own portrait/landscape shape. */}
                  <MilestoneMediaCarousel
                    media={milestoneMedia(item)}
                    title={item.title}
                    narrative={item.narrative}
                    onOpen={setSelectedPhoto}
                  />

                  {/* Narrative Prose */}
                  <p className="text-xs text-muted-on-light leading-relaxed font-sans mb-3 text-left">
                    {item.narrative}
                  </p>

                  {/* Footer Location Only (Love feature strictly removed per specification) */}
                  <div className="flex items-center gap-1 pt-2 border-t border-[#F0E6DB] text-[11px] text-muted-on-light">
                    <MapPin className="w-3 h-3 text-[#C4A480] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Memory Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#1C1510] text-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A480]"
                aria-label="Close memory photo"
              >
                <X className="w-5 h-5" />
              </button>

              <img loading="lazy"
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                decoding="async"
                className="w-full max-h-[60vh] object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="p-5">
                <h4 className="font-display text-2xl text-white mb-2">{selectedPhoto.title}</h4>
                <p className="text-xs text-[#D9CFC4] leading-relaxed font-sans">{selectedPhoto.narrative}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
