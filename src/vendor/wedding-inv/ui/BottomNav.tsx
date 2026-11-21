import React from 'react';
import { motion } from 'motion/react';
import { Home, Users, Heart, Calendar, Image, MessageSquare } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface BottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  /** RSVP party size, shown on the RSVP tab once the guest has confirmed. */
  badgeCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeSection,
  onNavigate,
  badgeCount,
}) => {
  const navItems = [
    { id: 'hero-section', label: 'Home', icon: Home },
    { id: 'couple-section', label: 'Couple', icon: Users },
    { id: 'story-section', label: 'Story', icon: Heart },
    { id: 'events-section', label: 'Event', icon: Calendar },
    { id: 'gallery-section', label: 'Gallery', icon: Image },
    { id: 'guestbook-section', label: 'RSVP', icon: MessageSquare, badge: badgeCount },
  ];

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none px-2 sm:px-3">
      <motion.nav
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="pointer-events-auto flex items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-full bg-[#1A1412]/92 backdrop-blur-2xl border border-white/[0.14] shadow-[0_12px_40px_rgba(0,0,0,0.4)] max-w-full"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                haptics.selection();
                onNavigate(item.id);
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative min-h-[44px] min-w-[44px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-full flex flex-col items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A480] ${
                isActive ? 'text-white' : 'text-muted-on-dark hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  className="absolute inset-0 bg-white/20 rounded-full border border-white/25"
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 25 }}
                className="relative"
              >
                <Icon className="w-4 h-4 relative z-10" />
                {item.badge !== undefined && item.badge > 0 && item.id === 'guestbook-section' && (
                  <span className="absolute -top-1 -right-2.5 w-3.5 h-3.5 bg-[#966A38] text-[8px] text-white font-bold rounded-full flex items-center justify-center z-20">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] font-medium tracking-tight mt-0.5 relative z-10 whitespace-nowrap">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
};
