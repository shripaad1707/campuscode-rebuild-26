import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { EASE } from '../lib/motion.jsx';

const FEED = [
  { tone: 'lime', icon: '✓', title: 'Checkpoint 2 cleared', body: 'Your prototype passed the mid-review.', time: 'now' },
  { tone: 'purple', icon: '＋', title: 'Riya joined your team', body: 'Neural Ninjas is now 4 / 4.', time: '1m' },
  { tone: 'ink', icon: '◆', title: 'IdeaCheck: 92% original', body: '“Campus lost & found with on-device AI”', time: '4m' },
  { tone: 'blue', icon: '✦', title: 'New arena: Future Web', body: 'Registrations open · 48h build.', time: '9m' },
  { tone: 'lime', icon: '★', title: 'Mentor replied', body: '“Ship the demo first, polish later.”', time: '12m' },
  { tone: 'purple', icon: '⬢', title: 'Certificate issued', body: 'ReBuild ’26 · Participant', time: '20m' }
];

function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft(s => (s > 0 ? s - 1 : seconds)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const h = String(Math.floor(left / 3600)).padStart(2, '0');
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0');
  const s = String(left % 60).padStart(2, '0');
  return [h, m, s];
}

function Feed() {
  const [head, setHead] = useState(2);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setHead(h => (h + 1) % FEED.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);
  const items = [0, 1, 2].map(i => {
    const k = (head - i + FEED.length * 4) % FEED.length;
    return { ...FEED[k], key: k };
  });
  return (
    <ul className="app-feed" aria-label="Live activity">
      <AnimatePresence initial={false}>
        {items.map((it, i) => (
          <motion.li
            key={it.key}
            layout
            className="app-feed__item"
            initial={{ opacity: 0, y: -18, scale: 0.92 }}
            animate={{ opacity: i === 2 ? 0.55 : 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.35 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className={`app-feed__icon tone-${it.tone}`}>{it.icon}</span>
            <span className="app-feed__text">
              <strong>{it.title}</strong>
              <small>{it.body}</small>
            </span>
            <time>{it.time}</time>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function AppScreen() {
  const [h, m, s] = useCountdown(23 * 3600 + 41 * 60 + 7);
  return (
    <div className="app">
      <div className="app-status">
        <span>9:41</span>
        <span className="app-status__icons" aria-hidden="true">
          <i className="sig" />
          <i className="wifi" />
          <i className="bat" />
        </span>
      </div>

      <div className="app-head">
        <div>
          <small className="mono">GOOD EVENING</small>
          <strong>Hey, Aarav</strong>
        </div>
        <span className="app-avatar">A</span>
      </div>

      <div className="app-live">
        <div className="app-live__row">
          <span className="pill pill--live">
            <i /> LIVE
          </span>
          <span className="mono app-live__cat">AI INNOVATION</span>
        </div>
        <p className="app-live__label mono">SUBMISSION CLOSES IN</p>
        <div className="app-live__clock tabular">
          <span>{h}</span>:<span>{m}</span>:<span>{s}</span>
        </div>
        <div className="app-live__progress">
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 0.68 }} transition={{ duration: 2, ease: EASE, delay: 1.6 }} />
        </div>
        <div className="app-live__foot">
          <span className="app-team" aria-hidden="true">
            <i style={{ background: '#b6f23a' }}>A</i>
            <i style={{ background: '#ff5b1f' }}>R</i>
            <i style={{ background: '#8b7cff' }}>K</i>
            <i style={{ background: '#eeebe5', color: '#111' }}>M</i>
          </span>
          <span className="mono">NEURAL NINJAS · 3/4 STEPS</span>
        </div>
      </div>

      <div className="app-tabs" role="presentation">
        <span className="is-active">Activity</span>
        <span>Arenas</span>
        <span>Team</span>
      </div>

      <Feed />

      <div className="app-dock" aria-hidden="true">
        <span className="is-active">⌂</span>
        <span>◎</span>
        <span className="app-dock__plus">＋</span>
        <span>☰</span>
        <span>◐</span>
      </div>
    </div>
  );
}

export default function Phone({ ready = true }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [9, -9]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 18 });
  const glareX = useTransform(ry, [-14, 14], ['10%', '90%']);

  useEffect(() => {
    if (reduce) return;
    const on = e => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', on);
    return () => window.removeEventListener('pointermove', on);
  }, [reduce, mx, my]);

  const chip = (delay, cls, children, float = 8) => (
    <motion.div
      className={`float-chip ${cls}`}
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="float-chip__inner"
      >
        {children}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="phone-stage">
      <div className="phone-stage__halo" aria-hidden="true" />
      <motion.div
        className="phone-rise"
        initial={reduce ? false : { opacity: 0, y: 120, rotateX: 28, rotateZ: -4 }}
        animate={ready ? { opacity: 1, y: 0, rotateX: 0, rotateZ: 0 } : undefined}
        transition={{ duration: 1.8, ease: EASE, delay: 0.7 }}
      >
        <motion.div className="phone" style={reduce ? undefined : { rotateX: rx, rotateY: ry }}>
          <div className="phone__btn phone__btn--a" />
          <div className="phone__btn phone__btn--b" />
          <div className="phone__btn phone__btn--c" />
          <div className="phone__frame">
            <div className="phone__screen">
              <div className="phone__island" aria-hidden="true">
                <i />
              </div>
              <AppScreen />
              <motion.div className="phone__glare" style={{ left: glareX }} aria-hidden="true" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {chip(1.5, 'chip-a', (
        <>
          <span className="chip-icon tone-lime">✓</span>
          <span>
            <strong>Submitted</strong>
            <small className="mono">BUILD · 02:14 AM</small>
          </span>
        </>
      ))}
      {chip(1.7, 'chip-b', (
        <>
          <span className="chip-rank tabular">#3</span>
          <span>
            <strong>Leaderboard</strong>
            <small className="mono">↑ 4 SPOTS TODAY</small>
          </span>
        </>
      ), 10)}
      {chip(1.9, 'chip-c', (
        <>
          <span className="chip-bars" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </span>
          <span>
            <strong>IdeaCheck</strong>
            <small className="mono">92% ORIGINAL</small>
          </span>
        </>
      ), 6)}
    </div>
  );
}
