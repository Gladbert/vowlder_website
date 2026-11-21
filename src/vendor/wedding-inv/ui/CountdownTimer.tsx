import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTimeUntilWedding, TimeRemaining } from '../utils/countdown';

interface CountdownTimerProps {
  targetDate?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = '2026-12-19T18:00:00+07:00',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    getTimeUntilWedding(targetDate)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeUntilWedding(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div id="countdown-timer" className="w-full">
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 text-center">
        {units.map((unit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="flex flex-col items-center justify-center py-2.5 px-1.5 sm:px-2 rounded-2xl bg-[#F7F3EC]/90 backdrop-blur-md border border-[#E8DFC8]/80 shadow-[0_2px_8px_rgba(28,23,20,0.03)]"
          >
            <div className="h-8 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={unit.value}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  className="font-display text-2xl sm:text-3xl font-normal text-[#1C1714] tabular-nums tracking-tight leading-none inline-block"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[9px] tracking-[0.2em] uppercase text-muted-on-light font-semibold mt-1">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
