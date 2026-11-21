import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * The one modal shell for the app.
 *
 * The modals were plain divs: no `role="dialog"`, no `aria-modal`, no focus trap,
 * no Escape-to-close and no focus restore — so a keyboard or screen-reader user
 * could tab into the page behind an open dialog and never get back. This wrapper
 * carries all of that in one place instead of four inconsistent copies.
 *
 * Behaviour it guarantees:
 *  - Escape closes (when `onClose` is given);
 *  - focus moves inside on open and returns to the opener on close;
 *  - Tab / Shift+Tab cycle within the dialog;
 *  - the page behind is scroll-locked;
 *  - a click on the backdrop closes, a click inside never does.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Accessible name. Required — a dialog without one is announced as just "dialog". */
  label: string;
  /** Optional element id to use as `aria-describedby`. */
  describedBy?: string;
  children: React.ReactNode;
  /** Extra classes for the panel (width/padding/background). */
  className?: string;
  /** Set false for a blocking dialog that cannot be dismissed with Escape/backdrop. */
  dismissible?: boolean;
  /** `alertdialog` for destructive confirmations. */
  role?: 'dialog' | 'alertdialog';
  /** Initial focus target; defaults to the first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  label,
  describedBy,
  children,
  className = '',
  dismissible = true,
  role = 'dialog',
  initialFocusRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const focusables = useCallback((): HTMLElement[] => {
    const panel = panelRef.current;
    if (!panel) return [];
    const found = panel.querySelectorAll(FOCUSABLE);
    return (Array.from(found) as HTMLElement[]).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );
  }, []);

  // Remember what opened the dialog, move focus in, and put it back on close.
  useEffect(() => {
    if (!isOpen) return;
    openerRef.current = (document.activeElement as HTMLElement) ?? null;

    const target = initialFocusRef?.current ?? focusables()[0] ?? panelRef.current;
    // One frame so the panel exists and its children are laid out.
    const raf = window.requestAnimationFrame(() => target?.focus());

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      const opener = openerRef.current;
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [isOpen, focusables, initialFocusRef]);

  // Escape + Tab cycling.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, dismissible, onClose, focusables]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-xs"
          onMouseDown={(e) => {
            // Only a press that STARTS on the backdrop closes, so a drag that ends
            // outside the panel does not dismiss it.
            if (dismissible && e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role={role}
            aria-modal="true"
            aria-label={label}
            aria-describedby={describedBy}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={className}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * The lighter half of the same contract, for surfaces that cannot be wrapped in
 * `<Modal>` without rewriting their layout (the guest lightboxes, the two big admin
 * editors): `role`/`aria-modal`/label on the container plus Escape to close.
 * Use `<Modal>` when you are writing a new dialog.
 */
export function useEscapeToClose(isOpen: boolean, onClose: () => void): void {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);
}
