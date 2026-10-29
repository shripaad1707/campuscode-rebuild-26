import { createElement, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/* Motion tokens — premium-web-motion system */
export const EASE = [0.16, 1, 0.3, 1];
export const DUR = { quick: 0.6, base: 0.9, slow: 1.3, settle: 2.6 };

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Masked line reveal: each line rises out of an invisible slot */
export function MaskHeading({ lines, as = 'h2', className = '', immediate = false, delay = 0, amount = 0.25, hold = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  return createElement(
    as,
    { ref, className: `mask-heading ${className}` },
    lines.map((line, i) => (
      <span key={i} className="mask-line">
        <motion.span
          className="mask-line__inner"
          initial={reduce ? false : { y: '112%' }}
          animate={!hold && (immediate || seen) ? { y: '0%' } : undefined}
          transition={{ duration: DUR.slow, ease: EASE, delay: delay + i * 0.1 }}
        >
          {line}
        </motion.span>
      </span>
    ))
  );
}

/* Fade-up reveal */
export function Reveal({ as = 'div', delay = 0, y = 18, duration = DUR.base, amount = 0.25, immediate = false, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  const target = { opacity: 1, y: 0 };
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      {...(immediate ? { animate: target } : { whileInView: target, viewport: { once: true, amount } })}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* Stagger container: children rise in sequence */
export function Stagger({ as = 'div', stagger = 0.06, y = 14, className, children, amount = 0.2, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export const staggerItem = (y = 14) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } }
});

/* Live clock (IST) */
export function useClock(timeZone = 'Asia/Kolkata') {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function useMediaQuery(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ?lite skips WebGL backgrounds (used for headless QA only) */
export const LITE = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('lite');
