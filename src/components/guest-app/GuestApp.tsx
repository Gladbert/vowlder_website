import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { OpeningCover } from '../../vendor/wedding-inv/ui/OpeningCover';
import { HeroSection } from '../../vendor/wedding-inv/ui/HeroSection';
import { CoupleSection } from '../../vendor/wedding-inv/ui/CoupleSection';
import { StoryTimelineSection } from '../../vendor/wedding-inv/ui/StoryTimelineSection';
import { EventsSection } from '../../vendor/wedding-inv/ui/EventsSection';
import { GallerySection } from '../../vendor/wedding-inv/ui/GallerySection';
import { GuestbookSection } from '../../vendor/wedding-inv/ui/GuestbookSection';
import { FooterSection } from '../../vendor/wedding-inv/ui/FooterSection';
import { FloatingControls } from '../../vendor/wedding-inv/ui/FloatingControls';
import { BottomNav } from '../../vendor/wedding-inv/ui/BottomNav';
import { DynamicIslandToast } from '../../vendor/wedding-inv/ui/DynamicIslandToast';
import {
  COUPLE_INFO,
  DEFAULT_CINEMATIC_VIDEO,
  DEFAULT_STORY_MILESTONES,
  GALLERY_PHOTOS,
  INITIAL_WISHES,
  WEDDING_EVENTS,
} from '../../vendor/wedding-inv/data/weddingData';
import type { GalleryPhoto, RSVPRecord, Wish } from '../../vendor/wedding-inv/types';

import type { ToastState } from '../../vendor/wedding-inv/ui/DynamicIslandToast';
import { weddingMusic } from '../../vendor/wedding-inv/utils/audioSynth';
import '../../vendor/wedding-inv/styles/base.css';

const SECTIONS = ['hero-section', 'couple-section', 'story-section', 'events-section', 'gallery-section', 'guestbook-section'];
const AVATAR_COLORS = ['#966A38', '#7D6B8F', '#4C7A65', '#A85B4B', '#5B6F8A'];

/**
 * The guest app from the Wedding-inv project, running standalone: same components,
 * same copy, same interactions. Only the backend is gone — wishes and RSVP are local
 * state, and nothing is sent anywhere.
 */
export default function GuestApp() {
  const [opened, setOpened] = useState(false);
  const [guestName, setGuestName] = useState('Honoured Guest');
  const [paxCount, setPaxCount] = useState(2);
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [rsvp, setRsvp] = useState<RSVPRecord | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>('mobile');
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: 'success' | 'copy' | 'love' = 'copy') => {
    setToast({ id: `toast-${Date.now()}`, message, type });
  }, []);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('to');
    if (fromUrl) setGuestName(fromUrl);

    const onGuest = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === 'string' && detail.trim()) setGuestName(detail.trim());
    };
    window.addEventListener('vowlder:guest', onGuest);

    const media = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);

    return () => {
      window.removeEventListener('vowlder:guest', onGuest);
      media.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const host = scroller.current;
    if (!host || !opened) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = host.scrollHeight - host.clientHeight;
        setScrollProgress(max > 0 ? (host.scrollTop / max) * 100 : 0);

        const marker = host.scrollTop + 220;
        for (const id of SECTIONS) {
          const el = host.querySelector<HTMLElement>(`#${id}`);
          if (!el) continue;
          if (marker >= el.offsetTop && marker < el.offsetTop + el.offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
        ticking = false;
      });
    };

    host.addEventListener('scroll', onScroll, { passive: true });
    return () => host.removeEventListener('scroll', onScroll);
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    weddingMusic.play();
    setIsPlayingMusic(true);
  };

  const handleToggleMusic = () => {
    if (isPlayingMusic) weddingMusic.pause();
    else weddingMusic.play();
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleTogglePhotoLike = (photoId: string) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.id === photoId);
      if (!target) return prev;
      const liked = !target.isLikedByMe;
      showToast(liked ? `Loved "${target.title}"` : `Removed your love for "${target.title}"`, liked ? 'love' : 'copy');
      return prev.map((photo) =>
        photo.id === photoId
          ? { ...photo, isLikedByMe: liked, likes: Math.max(0, photo.likes + (liked ? 1 : -1)) }
          : photo
      );
    });
  };

  const handleAddWish = (wish: Omit<Wish, 'id' | 'createdAt' | 'likes' | 'avatarColor'>) => {
    const created: Wish = {
      ...wish,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatarColor: AVATAR_COLORS[wishes.length % AVATAR_COLORS.length],
    };

    setWishes((prev) => [created, ...prev]);
    setRsvp({
      id: `rsvp-${Date.now()}`,
      guestName: wish.name,
      attendance: wish.attendance,
      paxCount: wish.guestCount ?? paxCount,
      submittedAt: new Date().toISOString(),
      source: 'invitation',
    });
    if (wish.guestCount) setPaxCount(wish.guestCount);
    showToast('Your reply is saved on this device only', 'success');
  };

  const handleNavigate = (sectionId: string) => {
    const target = scroller.current?.querySelector<HTMLElement>(`#${sectionId}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const badgeCount = useMemo(
    () =>
      rsvp && (rsvp.attendance === 'attending' || rsvp.attendance === 'attending_partner')
        ? rsvp.paxCount
        : 0,
    [rsvp]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div ref={scroller} className="relative h-full overflow-y-auto bg-[#F3EFEA] text-[#1C1714]">
        {opened && (
          <div className="pointer-events-none sticky top-0 z-50 -mb-1 h-1 bg-black/[0.04]">
            <motion.div
              className="h-full w-full origin-left bg-[#966A38]"
              style={{ scaleX: scrollProgress / 100 }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
        )}

        <DynamicIslandToast toast={toast} onDismiss={() => setToast(null)} />

        {!opened && (
          <OpeningCover
            guestName={guestName}
            paxCount={paxCount}
            isRsvpDone={!!rsvp?.attendance}
            onOpen={handleOpen}
            onStartAudio={() => weddingMusic.play()}
            coupleInfo={COUPLE_INFO}
          />
        )}

        <div className={opened ? '' : 'hidden'}>
          <FloatingControls
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={handleToggleMusic}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode((mode) => (mode === 'mobile' ? 'fluid' : 'mobile'))}
            showScreenToggle={isDesktop}
          />

          <main
            className={`relative mx-auto w-full overflow-x-hidden pb-28 transition-all duration-500 ease-out ${
              viewMode === 'mobile' && isDesktop
                ? 'my-6 max-w-[430px] rounded-[36px] border border-[#DDD0C0] bg-[#FAF8F5] shadow-[0_25px_70px_rgba(28,22,17,0.14)]'
                : 'max-w-xl bg-[#FAF8F5] shadow-xs'
            }`}
          >
            <HeroSection guestName={guestName} paxCount={paxCount} onNotify={showToast} coupleInfo={COUPLE_INFO} />
            <CoupleSection coupleInfo={COUPLE_INFO} />
            <StoryTimelineSection milestones={DEFAULT_STORY_MILESTONES} onNotify={showToast} />
            <EventsSection
              onNotify={showToast}
              events={WEDDING_EVENTS}
              showHolyMatrimony
              relationship=""
            />
            <GallerySection
              photos={photos}
              onTogglePhotoLike={handleTogglePhotoLike}
              canLike
              cinematicVideo={DEFAULT_CINEMATIC_VIDEO}
              galleryAutoArrange
            />
            <GuestbookSection
              wishes={wishes}
              wishesTotal={wishes.length}
              onAddWish={handleAddWish}
              defaultGuestName={guestName}
              paxCount={paxCount}
              existingRSVP={rsvp}
              onNotify={showToast}
            />
            <FooterSection coupleInfo={COUPLE_INFO} />
          </main>

          <BottomNav activeSection={activeSection} onNavigate={handleNavigate} badgeCount={badgeCount} />
        </div>
      </div>
    </MotionConfig>
  );
}
