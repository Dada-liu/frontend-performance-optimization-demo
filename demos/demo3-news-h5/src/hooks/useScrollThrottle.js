import { useState, useEffect, useRef } from 'react';

export default function useScrollThrottle(containerRef, delay = 150) {
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef(null);
  const stateRef = useRef(false);

  const setScrollingState = (val) => {
    stateRef.current = val;
    setIsScrolling(val);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastCall = 0;

    const handleScroll = () => {
      const now = Date.now();

      if (!stateRef.current) {
        setScrollingState(true);
      }

      if (now - lastCall < delay) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setScrollingState(false), delay);
        return;
      }

      lastCall = now;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setScrollingState(false), delay);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(timerRef.current);
    };
  }, [delay]);

  return isScrolling;
}
