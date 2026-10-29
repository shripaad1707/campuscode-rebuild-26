import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { EASE } from '../lib/motion.jsx';

/* ReBuild '26 — real event timeline (IST) */
const T = {
  r1Start: Date.parse('2026-11-06T10:00:00+05:30'),
  r1End: Date.parse('2026-11-06T17:01:00+05:30'),
  finalStart: Date.parse('2026-11-07T10:00:00+05:30'),
  finalEnd: Date.parse('2026-11-08T22:00:00+05:30')
};

function phaseAt(now) {
  if (now < T.r1Start) return { pill: 'OPENS SOON', tone: 'soon', title: 'Round 1 · Dashboard Recreation', label: 'ROUND 1 OPENS IN', target: T.r1Start };
  if (now < T.r1End) return { pill: 'LIVE', tone: 'live', title: 'Round 1 · Dashboard Recreation', label: 'SUBMISSIONS CLOSE IN', target: T.r1End };
  if (now < T.finalStart) return { pill: 'SHORTLIST', tone: 'soon', title: 'Final Round · Present your build', label: 'FINAL ROUND STARTS IN', target: T.finalStart };
  if (now < T.finalEnd) return { pill: 'LIVE', tone: 'live', title: 'Final Round · Present your build', label: 'FINAL ROUND ENDS IN', target: T.finalEnd };
  return { pill: 'DONE', tone: 'soon', title: 'ReBuild ’26 · Results', label: 'RESULTS ANNOUNCED IN', target: null };
}

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

const pad = n => String(Math.max(0, n)).padStart(2, '0');

function istParts(now) {
  const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date(now));
  const h = parseInt(f.slice(0, 2), 10);
  const greet = h < 12 ? 'GOOD MORNING' : h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  return { time: f, greet };
}

/* The story the inbox tells, in order — newest slides in on top */
const STORY = [
  { from: 'CampusCode', kind: 'brand', text: 'Round 1 is live. Recreate the dashboard your way — submit by 5:01 PM.', time: '10:00' },
  { from: 'Riya', kind: 'R', color: '#ff5b1f', text: 'Hero animation pushed 🔥 check the preview link', time: '13:42' },
  { from: 'CampusCode', kind: 'brand', text: 'Submission received ✓ Live link, screenshots & repo verified.', time: '16:58' },
  { from: 'Karthik · Mentor', kind: 'K', color: '#8b7cff', text: 'Love the motion work. Tighten the mobile nav before finals.', time: '18:20' },
  { from: 'CampusCode', kind: 'brand', text: 'You’re shortlisted 🎉 Final round — 7 Nov, 10:00 AM.', time: '21:05' },
  { from: 'CampusCode', kind: 'brand', text: 'Certificate issued · ReBuild ’26 Finalist. Share it.', time: 'now' }
];

export function MiniMark({ size = 22 }) {
  return (
    <span className="mini-mark" style={{ width: size, height: size }} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Avatar({ m }) {
  if (m.kind === 'brand') return <MiniMark size={30} />;
  return (
    <span className="msg__av" style={{ background: m.color }}>
      {m.kind}
    </span>
  );
}

function Inbox() {
  const reduce = useReducedMotion();
  const [head, setHead] = useState(2);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setHead(h => (h + 1) % STORY.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);
  const items = [0, 1, 2].map(i => {
    const k = (head - i + STORY.length * 4) % STORY.length;
    return { ...STORY[k], key: k };
  });
  return (
    <ul className="inbox" aria-label="CampusCode inbox">
      <AnimatePresence initial={false}>
        {items.map((m, i) => (
          <motion.li
            key={m.key}
            layout
            className={`msg ${m.kind === 'brand' ? 'msg--brand' : ''}`}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: i === 2 ? 0.5 : 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, transition: { duration: 0.35 } }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <Avatar m={m} />
            <span className="msg__body">
              <span className="msg__top">
                <strong>{m.from}</strong>
                <time className="mono">{m.time}</time>
              </span>
              <span className="msg__text">{m.text}</span>
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function LiveCard({ now }) {
  const p = phaseAt(now);
  const left = p.target ? Math.max(0, Math.floor((p.target - now) / 1000)) : 0;
  const d = Math.floor(left / 86400);
  const h = Math.floor((left % 86400) / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const checks = ['Live link', 'Screenshots', 'GitHub repo'];
  return (
    <div className="app-live">
      <div className="app-live__row">
        <span className={`pill pill--${p.tone}`}>
          <i /> {p.pill}
        </span>
        <span className="mono app-live__cat">REBUILD ’26</span>
      </div>
      <p className="app-live__title">{p.title}</p>
      <p className="app-live__label mono">{p.label}</p>
      {p.target ? (
        <div className="app-live__clock tabular">
          {[
            [d, 'D'],
            [h, 'H'],
            [m, 'M'],
            [s, 'S']
          ].map(([v, u], i) => (
            <span key={u} className={i === 3 ? 'is-sec' : ''}>
              {pad(v)}
              <small className="mono">{u}</small>
            </span>
          ))}
        </div>
      ) : (
        <div className="app-live__clock">Stay tuned</div>
      )}
      <ul className="app-checks mono" aria-label="Submission checklist">
        {checks.map((c, i) => (
          <motion.li key={c} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 2 + i * 0.25 }}>
            <i>✓</i>
            {c}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function AppScreen() {
  const now = useNow();
  const { time, greet } = istParts(now);
  return (
    <div className="app">
      <div className="app-status">
        <span className="tabular">{time}</span>
        <span className="app-status__icons" aria-hidden="true">
          <i className="sig" />
          <i className="wifi" />
          <i className="bat" />
        </span>
      </div>

      <div className="app-head">
        <div>
          <small className="mono">{greet}</small>
          <strong>Hey, Aarav</strong>
        </div>
        <span className="app-avatar">A</span>
      </div>

      <LiveCard now={now} />

      <div className="app-tabs" role="presentation">
        <span className="is-active">
          Inbox <b>3</b>
        </span>
        <span>Arenas</span>
        <span>Team</span>
      </div>

      <Inbox />

      <div className="app-dock" aria-hidden="true">
        <span className="is-active">⌂</span>
        <span>◎</span>
        <span className="app-dock__plus">＋</span>
        <span>✉</span>
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

  const note = (delay, cls, children, float = 8) => (
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

      {note(1.5, 'chip-a note', (
        <>
          <MiniMark size={34} />
          <span className="note__body">
            <span className="note__top mono">
              CAMPUSCODE <em>· now</em>
            </span>
            <strong>Submission received ✓</strong>
            <small>Live link, screenshots & GitHub repo verified.</small>
          </span>
        </>
      ))}
      {note(2.2, 'chip-b bubble', (
        <>
          <span className="msg__av" style={{ background: '#ff5b1f' }}>
            R
          </span>
          <span className="note__body">
            <span className="note__top mono">
              RIYA <em>· team</em>
            </span>
            <span className="bubble__text">deployed to vercel ✅ link’s in the group</span>
          </span>
        </>
      ), 10)}
      {note(2.9, 'chip-c note', (
        <>
          <span className="date-tile" aria-hidden="true">
            <small className="mono">NOV</small>
            <b>07</b>
          </span>
          <span className="note__body">
            <span className="note__top mono">FINAL ROUND · 10:00 AM</span>
            <strong>You’re shortlisted 🎉</strong>
            <small>Present your build to the judges.</small>
          </span>
        </>
      ), 6)}
    </div>
  );
}
