import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Copy, Heart } from 'lucide-react';

export interface ToastState {
  id: string;
  message: string;
  type?: 'success' | 'copy' | 'love';
}

interface DynamicIslandToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export const DynamicIslandToast: React.FC<DynamicIslandToastProps> = ({
  toast,
  onDismiss,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[calc(env(safe-area-inset-top,0px)+12px)] sm:top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 28,
              mass: 0.8,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className="pointer-events-auto flex items-center gap-2.5 py-2 px-4 rounded-full bg-[#1A1412]/92 text-white backdrop-blur-2xl border border-white/[0.18] shadow-[0_12px_32px_rgba(0,0,0,0.38)] cursor-pointer"
          >
            {toast.type === 'love' ? (
              <Heart className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
            ) : toast.type === 'copy' ? (
              <Copy className="w-3.5 h-3.5 text-[#E6D4C1] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-medium tracking-tight whitespace-nowrap text-[#FAF8F5]">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
