import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ChevronLeft, ChevronRight, MapPin, Play, Pause, Volume2, VolumeX, Film, LayoutGrid, Sliders } from 'lucide-react';
import { GalleryPhoto, CinematicVideoConfig } from '../types';
import { DEFAULT_CINEMATIC_VIDEO } from '../data/weddingData';
import { getYouTubeEmbedUrl } from '../store';
import { haptics } from '../utils/haptics';

interface GallerySectionProps {
  photos: GalleryPhoto[];
  onTogglePhotoLike: (id: string) => void;
  /** Only guests who arrived through a personalized link may react to photos. */
  canLike?: boolean;
  cinematicVideo?: CinematicVideoConfig;
  galleryAutoArrange?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  onTogglePhotoLike,
  canLike = true,
  cinematicVideo = DEFAULT_CINEMATIC_VIDEO,
  galleryAutoArrange = true,
}) => {
  const hasVideo = Boolean(
    cinematicVideo &&
    cinematicVideo.enabled !== false &&
    cinematicVideo.videoUrl &&
    cinematicVideo.videoUrl.trim() !== ''
  );

  const [viewMode, setViewMode] = useState<'grid' | 'carousel' | 'video'>('grid');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState<boolean>(false);
  const [isCaptionClamped, setIsCaptionClamped] = useState<boolean>(false);
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const [sliderIndex, setSliderIndex] = useState<number>(0);

  // If video removed or unavailable, fall back to grid view.
  useEffect(() => {
    if (!hasVideo && viewMode === 'video') {
      setViewMode('grid');
    }
  }, [hasVideo, viewMode]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  const handleOpenLightbox = (index: number) => {
    haptics.selection();
    setSelectedPhotoIndex(index);
    setIsCaptionExpanded(false);
  };

  const handleCloseLightbox = () => {
    haptics.selection();
    setSelectedPhotoIndex(null);
    setIsCaptionExpanded(false);
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    haptics.selection();
    setIsCaptionExpanded(false);
    setSelectedPhotoIndex((prev) => ((prev ?? 0) + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    haptics.selection();
    setIsCaptionExpanded(false);
    setSelectedPhotoIndex((prev) => ((prev ?? 0) - 1 + photos.length) % photos.length);
  };

  // Reveal the "Read more" toggle only when the caption is actually clipped.
  useEffect(() => {
    if (selectedPhotoIndex === null) return;
    const raf = requestAnimationFrame(() => {
      const el = captionRef.current;
      if (el) setIsCaptionClamped(!isCaptionExpanded && el.scrollHeight - el.clientHeight > 1);
    });
    return () => cancelAnimationFrame(raf);
  }, [selectedPhotoIndex, isCaptionExpanded]);

  const handleNextSlider = () => {
    haptics.selection();
    setSliderIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevSlider = () => {
    haptics.selection();
    setSliderIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Preload the neighbouring slides so a manual swipe never flashes a black frame.
  useEffect(() => {
    if (viewMode !== 'carousel' || photos.length === 0) return;
    [(sliderIndex + 1) % photos.length, (sliderIndex - 1 + photos.length) % photos.length].forEach(
      (i) => {
        const img = new Image();
        img.src = photos[i].src;
      }
    );
  }, [sliderIndex, viewMode, photos]);

  // Auto-advance the slider (desktop and mobile).
  useEffect(() => {
    if (viewMode !== 'carousel' || photos.length <= 1) return;
    const id = window.setInterval(
      () => setSliderIndex((prev) => (prev + 1) % photos.length),
      4000
    );
    return () => window.clearInterval(id);
  }, [viewMode, photos.length]);

  // A tap opens the lightbox. Liking is ONLY ever an explicit heart press, so a
  // stray/duplicate tap can never silently like a photo.
  const handlePhotoTap = (photo: GalleryPhoto) => {
    handleOpenLightbox(photos.findIndex((p) => p.id === photo.id));
  };

  const togglePlayVideo = () => {
    haptics.selection();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      const promise = videoRef.current.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsVideoPlaying(true))
          .catch((err) => {
            console.warn('Video playback notice:', err);
            setIsVideoPlaying(false);
          });
      } else {
        setIsVideoPlaying(true);
      }
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMuteVideo = () => {
    haptics.selection();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  return (
    <section id="gallery-section" className="py-14 px-4 sm:px-6 w-full max-w-full overflow-hidden bg-[#FAF8F5]">
      <div className="text-center mb-8">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.28em] text-muted-on-light font-semibold mb-1.5 block"
        >
          Cherished Moments
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl text-[#1C1714] font-normal tracking-tight"
        >
          Photo &amp; Video Gallery
        </motion.h2>
        <div className="w-8 h-px bg-[#D9CFC4] mx-auto mt-2.5" />

        {/* View Mode Interactive Filter Segmented Control with Apple Fluid Pill */}
        <div className="inline-flex items-center gap-1 p-1 bg-[#F0E8DC] rounded-xl mt-6 border border-[#E3D6C5]">
          <button
            type="button"
            onClick={() => {
              haptics.selection();
              setViewMode('grid');
            }}
            className={`relative flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
              viewMode === 'grid'
                ? 'text-[#1C1714]'
                : 'text-[#6B5A4D] hover:text-[#1C1714]'
            }`}
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="activeGalleryViewTab"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
              />
            )}
            <LayoutGrid className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Grid</span>
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.selection();
              setViewMode('carousel');
            }}
            className={`relative flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
              viewMode === 'carousel'
                ? 'text-[#1C1714]'
                : 'text-[#6B5A4D] hover:text-[#1C1714]'
            }`}
          >
            {viewMode === 'carousel' && (
              <motion.div
                layoutId="activeGalleryViewTab"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
              />
            )}
            <Sliders className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Slider Carousel</span>
          </button>

          {hasVideo && (
            <button
              type="button"
              onClick={() => {
                haptics.selection();
                setViewMode('video');
              }}
              className={`relative flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#966A38] ${
                viewMode === 'video'
                  ? 'text-[#1C1714]'
                  : 'text-[#6B5A4D] hover:text-[#1C1714]'
              }`}
            >
              {viewMode === 'video' && (
                <motion.div
                  layoutId="activeGalleryViewTab"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                />
              )}
              <Film className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Cinematic Film</span>
            </button>
          )}
        </div>
      </div>

      {!canLike && (
        <p className="max-w-md mx-auto mb-4 text-center text-[11px] text-[#6B5A4D] leading-relaxed">
          Photos can be loved once you RSVP.
        </p>
      )}

      {/* 1. MASONRY GRID VIEW */}
      {viewMode === 'grid' && (
        <div
          className={`grid grid-cols-2 gap-3 max-w-md mx-auto ${
            galleryAutoArrange ? 'grid-flow-row-dense' : ''
          }`}
        >
          {photos.map((photo, index) => {
            const isSpanRow = photo.orientation === 'landscape';
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 28, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 25, mass: 0.85, delay: Math.min(index, 8) * 0.07 }}
                whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                onClick={() => handlePhotoTap(photo)}
                className={`group relative rounded-2xl overflow-hidden bg-[#1E1712] cursor-pointer select-none shadow-[0_4px_16px_rgba(28,23,20,0.08)] ${
                  isSpanRow ? 'col-span-2 aspect-[16/10]' : 'col-span-1 aspect-[3/4]'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out brightness-95"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Card Footer Info */}
                <div className="absolute bottom-0 inset-x-0 p-3 flex items-end justify-between text-white z-10">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium truncate text-white drop-shadow-xs">
                      {photo.title}
                    </p>
                    <p className="text-[10px] text-white/75 truncate flex items-center gap-1 font-light">
                      <MapPin className="w-2.5 h-2.5 text-amber-200 shrink-0" />
                      <span>{photo.location}</span>
                    </p>
                  </div>

                  {canLike ? (
                    <motion.button
                      type="button"
                      aria-label={`${photo.isLikedByMe ? 'Remove your love for' : 'Love'} ${photo.title}`}
                      aria-pressed={!!photo.isLikedByMe}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        haptics.light();
                        onTogglePhotoLike(photo.id);
                      }}
                      className="flex items-center gap-1.5 text-xs min-h-[44px] px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/14 cursor-pointer hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform ${
                          photo.isLikedByMe ? 'text-red-500 fill-red-500' : 'text-white'
                        }`}
                      />
                      <span className="text-[11px] font-medium">{photo.likes}</span>
                    </motion.button>
                  ) : (
                    <span
                      aria-label={`${photo.likes} likes`}
                      title="RSVP to react to photos"
                      className="flex items-center gap-1.5 text-xs min-h-[44px] px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/60"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{photo.likes}</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 2. SLIDER / CAROUSEL VIEW */}
      {viewMode === 'carousel' && (
        <div className="max-w-md mx-auto relative select-none">
          <div
            className={`relative rounded-3xl overflow-hidden bg-[#1E1712] shadow-xl border border-[#E3D6C5] transition-[aspect-ratio] duration-300 ${
              photos[sliderIndex]?.orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-[4/5]'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={sliderIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                src={photos[sliderIndex].src}
                alt={photos[sliderIndex].title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Slider Top Metadata */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white/90 z-10 drop-shadow-sm">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#EADBCC]">
                {photos[sliderIndex].category}
              </span>
              <span className="text-xs font-mono tabular-nums text-white/80">
                {sliderIndex + 1} / {photos.length}
              </span>
            </div>

            {/* Slider Bottom Caption Overlay */}
            <div className="absolute bottom-4 inset-x-4 text-white z-10">
              <h3 className="font-display text-2xl drop-shadow-sm">{photos[sliderIndex].title}</h3>
              <p className="text-xs font-serif-italic text-[#E8C59A] mt-0.5 mb-2 leading-relaxed">
                "{photos[sliderIndex].caption}"
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <span className="text-[11px] text-white/80 flex items-center gap-1 font-light">
                  <MapPin className="w-3 h-3 text-amber-200" />
                  {photos[sliderIndex].location}
                </span>

                {canLike ? (
                  <button
                    type="button"
                    aria-label={`${photos[sliderIndex].isLikedByMe ? 'Remove your love for' : 'Love'} ${photos[sliderIndex].title}`}
                    aria-pressed={!!photos[sliderIndex].isLikedByMe}
                    onClick={() => {
                      haptics.selection();
                      onTogglePhotoLike(photos[sliderIndex].id);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs cursor-pointer transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        photos[sliderIndex].isLikedByMe ? 'text-red-500 fill-red-500' : 'text-white'
                      }`}
                    />
                    <span>{photos[sliderIndex].likes}</span>
                  </button>
                ) : (
                  <span
                    aria-label={`${photos[sliderIndex].likes} likes`}
                    title="RSVP to react to photos"
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs text-white/60"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{photos[sliderIndex].likes}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevSlider}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlider}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnails strip */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 px-1">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  haptics.selection();
                  setSliderIndex(idx);
                }}
                className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  sliderIndex === idx ? 'border-[#966A38] scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <img
                  src={p.src}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. VIDEO VIEW */}
      {viewMode === 'video' && hasVideo && cinematicVideo && (() => {
        const youtubeEmbed = getYouTubeEmbedUrl(cinematicVideo.videoUrl);

        return (
          <div className="max-w-md mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-[#43352B]">
              {youtubeEmbed ? (
                /* YouTube Video Player Embed */
                <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center">
                  <iframe
                    src={youtubeEmbed}
                    title={cinematicVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                /* HTML5 Video Fallback */
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#1A1412] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={cinematicVideo.videoUrl}
                    poster={cinematicVideo.coverImageUrl}
                    playsInline
                    loop
                    muted={isVideoMuted}
                    onError={() => setIsVideoPlaying(false)}
                    onTimeUpdate={(e) => {
                      const target = e.currentTarget;
                      if (target.duration) {
                        setVideoProgress((target.currentTime / target.duration) * 100);
                      }
                    }}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={togglePlayVideo}
                  />

                  {/* Center Play Button Overlay when Paused */}
                  {!isVideoPlaying && (
                    <div
                      onClick={togglePlayVideo}
                      className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-opacity"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full bg-white/90 text-[#1C1714] flex items-center justify-center shadow-2xl backdrop-blur-md"
                      >
                        <Play className="w-7 h-7 fill-[#1C1714] ml-1" />
                      </motion.div>
                      <p className="text-white text-xs font-medium tracking-wider uppercase mt-3 drop-shadow-md">
                        Play Pre-Wedding Film
                      </p>
                    </div>
                  )}

                  {/* Top Controls Overlay */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-white pointer-events-none z-10">
                    <span className="text-[10px] uppercase tracking-widest bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-medium">
                      Cinematic Teaser
                    </span>
                    <button
                      type="button"
                      onClick={toggleMuteVideo}
                      aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
                      aria-pressed={isVideoMuted}
                      className="pointer-events-auto p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-colors cursor-pointer"
                    >
                      {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bottom Progress Bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                    <div style={{ transform: `scaleX(${videoProgress / 100})` }} className="h-full w-full origin-left bg-[#C4A480] transition-transform" />
                  </div>
                </div>
              )}

              {/* Video Meta Info */}
              <div className="p-5 bg-[#2A211B] text-[#EDE6DC]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-[#FAF6F0]">{cinematicVideo.title}</h3>
                    <p className="text-xs text-[#B8A796] mt-0.5 font-light leading-relaxed">
                      {cinematicVideo.subtitle}
                    </p>
                  </div>

                  {!youtubeEmbed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={togglePlayVideo}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] text-[#2A211B] font-semibold text-xs flex items-center gap-1 shadow-xs hover:bg-white transition-colors cursor-pointer"
                      >
                        {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-[#2A211B]" />}
                        <span>{isVideoPlaying ? 'Pause' : 'Play'}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Fullscreen Apple Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-2xl flex flex-col items-center justify-between p-4 select-none touch-none"
            onClick={handleCloseLightbox}
          >
            {/* Top Bar */}
            <div className="w-full max-w-md flex items-center justify-between pt-2 pb-2 text-white z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-medium tracking-wider">
                  {selectedPhotoIndex + 1} / {photos.length}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {photos[selectedPhotoIndex].title}
                </span>
              </div>

              <button
                onClick={handleCloseLightbox}
                aria-label="Close photo preview"
                className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gesture-Driven Photo Container */}
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.4}
              className="relative max-w-md max-h-[72dvh] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedPhotoIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                src={photos[selectedPhotoIndex].src}
                alt={photos[selectedPhotoIndex].title}
                loading="lazy"
                decoding="async"
                className="max-h-[70dvh] max-w-full rounded-2xl object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Caption + Bottom Controls Bar */}
            <div
              className="w-full max-w-md pb-6 z-10 px-2 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {(photos[selectedPhotoIndex].caption || photos[selectedPhotoIndex].location) && (
                <div className="text-center">
                  {photos[selectedPhotoIndex].caption && (
                    <>
                      <p
                        ref={captionRef}
                        className={`text-xs font-serif-italic text-[#E8C59A] ${
                          isCaptionExpanded ? '' : 'max-h-9 overflow-hidden'
                        }`}
                      >
                        {photos[selectedPhotoIndex].caption}
                      </p>
                      {(isCaptionClamped || isCaptionExpanded) && (
                        <button
                          type="button"
                          onClick={() => setIsCaptionExpanded((v) => !v)}
                          className="mt-1 text-[11px] font-semibold text-[#E8C59A] underline underline-offset-2 cursor-pointer"
                        >
                          {isCaptionExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </>
                  )}
                  {photos[selectedPhotoIndex].location && (
                    <p className="text-[10px] text-stone-400 mt-1 flex items-center justify-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-amber-300" />
                      <span>{photos[selectedPhotoIndex].location}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-white">
                <button
                  onClick={handlePrevPhoto}
                  aria-label="Previous photo"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/12 hover:bg-white/25 flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <span className="text-xs text-stone-400 font-medium tracking-wider">
                  {selectedPhotoIndex + 1} / {photos.length}
                </span>

                <button
                  onClick={handleNextPhoto}
                  aria-label="Next photo"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/12 hover:bg-white/25 flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
