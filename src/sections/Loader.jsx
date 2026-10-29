import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EASE } from '../lib/motion.jsx';

export default function Loader({ onReveal, onDone }) {
  const [n, setN] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const total = 1300;
    const loop = now => {
      const t = Math.min(1, (now - start) / total);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(loop);
      else setTimeout(() => {
        setExit(true);
        onReveal?.();
      }, 150);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="loader"
      initial={{ y: 0 }}
      animate={exit ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1.1, ease: EASE }}
      onAnimationComplete={() => exit && onDone()}
      aria-hidden="true"
    >
      <div className="loader__mark">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.12 }}
          />
        ))}
      </div>
      <div className="loader__word">
        <span className="mask-line">
          <motion.span className="mask-line__inner" initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}>
            CAMPUSCODE
          </motion.span>
        </span>
        <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
          HACKATHON ARENA
        </motion.small>
      </div>
      <div className="loader__count mono">
        <span>LOADING THE ARENA</span>
        <span className="tabular">{String(n).padStart(3, '0')}</span>
      </div>
      <motion.div className="loader__bar" style={{ scaleX: n / 100 }} />
    </motion.div>
  );
}
