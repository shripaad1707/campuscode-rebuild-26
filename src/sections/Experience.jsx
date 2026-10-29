import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import Silk from '../components/rb/Silk.jsx';
import { EASE, LITE, MaskHeading, useMediaQuery } from '../lib/motion.jsx';
import { Eyebrow } from './About.jsx';

const SCENES = [
  { k: 'DISCOVER', d: 'Find a challenge worth building for.' },
  { k: 'TEAM UP', d: 'Match with people who share your ambition.' },
  { k: 'BUILD', d: 'Turn the idea into something people can use.' },
  { k: 'SHIP', d: 'Submit, present and take it to the arena.' }
];

const fade = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(6px)' },
  transition: { duration: 0.7, ease: EASE }
};

function Typed({ text }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN(v => (v < text.length ? v + 1 : v)), 55);
    return () => clearInterval(id);
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      <i className="caret" />
    </>
  );
}

function SceneDiscover() {
  const rows = [
    { t: 'AI Innovation', c: 'ARTIFICIAL INTELLIGENCE', s: 'LIVE', tone: 'lime' },
    { t: 'Future Web', c: 'WEB DEVELOPMENT', s: 'OPEN', tone: 'orange' },
    { t: 'Campus Tech', c: 'SMART TECHNOLOGY', s: 'SOON', tone: 'muted' }
  ];
  return (
    <div className="sc sc-discover">
      <div className="sc-search mono">
        <span>⌕</span> <Typed text="ai hackathon for students" />
      </div>
      <ul>
        {rows.map((r, i) => (
          <motion.li key={r.t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.12 }}>
            <span className="mono">{r.c}</span>
            <strong>{r.t}</strong>
            <em className={`status status--${r.tone} mono`}>
              <i />
              {r.s}
            </em>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function SceneTeam() {
  const nodes = [
    { x: 50, y: 14, l: 'A', c: '#b6f23a', r: 'DEV' },
    { x: 86, y: 50, l: 'R', c: '#ff5b1f', r: 'DESIGN' },
    { x: 50, y: 86, l: 'K', c: '#8b7cff', r: 'ML' },
    { x: 14, y: 50, l: 'M', c: '#f7f7f4', r: 'PM' }
  ];
  return (
    <div className="sc sc-team">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => (
            <motion.line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 + (i + j) * 0.12 }} />
          ))
        )}
      </svg>
      {nodes.map((n, i) => (
        <motion.span key={n.l} className="sc-team__node" style={{ left: `${n.x}%`, top: `${n.y}%` }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.1 }}>
          <i style={{ background: n.c }}>{n.l}</i>
          <small className="mono">{n.r}</small>
        </motion.span>
      ))}
      <div className="sc-team__label">
        <strong>Neural Ninjas</strong>
        <span className="mono">TEAM COMPLETE · 4 / 4</span>
      </div>
    </div>
  );
}

function SceneBuild() {
  const lines = [
    [['k', 'const '], ['v', 'arena'], ['p', ' = '], ['f', 'createProject'], ['p', '({']],
    [['p', '  name: '], ['s', "'Lost & Found AI'"], ['p', ',']],
    [['p', '  team: '], ['s', "'Neural Ninjas'"], ['p', ',']],
    [['p', '  stack: ['], ['s', "'react'"], ['p', ', '], ['s', "'python'"], ['p', ', '], ['s', "'onnx'"], ['p', '],']],
    [['p', '});']],
    [['c', '// checkpoint 2 — prototype ready']],
    [['k', 'await '], ['v', 'arena'], ['p', '.'], ['f', 'ship'], ['p', '();']]
  ];
  return (
    <div className="sc sc-build mono">
      <div className="sc-build__tabs">
        <span className="is-active">index.js</span>
        <span>model.py</span>
        <span>README.md</span>
      </div>
      <ol>
        {lines.map((l, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.14 }}>
            {l.map(([t, s], j) => (
              <span key={j} className={`tk-${t}`}>
                {s}
              </span>
            ))}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function SceneShip() {
  return (
    <div className="sc sc-ship">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <motion.circle cx="60" cy="60" r="50" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: EASE }} />
        <motion.path d="M38 62 L54 77 L84 45" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.7 }} />
      </svg>
      <motion.strong initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}>
        Submitted to the arena
      </motion.strong>
      <motion.span className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        RESULTS ANNOUNCED IN 48H
      </motion.span>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.i
          key={i}
          className="sc-ship__spark"
          style={{ background: ['#ff5b1f', '#8b7cff', '#eeebe5'][i % 3] }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ x: Math.cos((i / 14) * Math.PI * 2) * (120 + (i % 3) * 30), y: Math.sin((i / 14) * Math.PI * 2) * (90 + (i % 4) * 20), opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.9 }}
        />
      ))}
    </div>
  );
}

const SCENE_VIEWS = [SceneDiscover, SceneTeam, SceneBuild, SceneShip];

export default function Experience() {
  const ref = useRef(null);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduce = useReducedMotion();
  const pin = desktop && !reduce;
  const [scene, setScene] = useState(0);
  const [tc, setTc] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!pin) return;
    setScene(Math.min(3, Math.floor(v * 4)));
    setTc(Math.min(30, Math.round(v * 30)));
  });

  useEffect(() => {
    if (pin || reduce) return;
    const id = setInterval(() => setScene(s => (s + 1) % 4), 3600);
    return () => clearInterval(id);
  }, [pin, reduce]);

  const View = SCENE_VIEWS[scene];
  const local = pin ? tc : (scene + 1) * 7;

  return (
    <section className={`exp ${pin ? 'is-pinned' : ''}`} ref={ref} aria-label="The CampusCode experience">
      <div className="exp__sticky">
        <div className="exp__silk" aria-hidden="true">
          {!LITE && <Silk color="#241a52" sheenColor="#ff9a5c" speed={3} scale={1.1} noiseIntensity={1.2} sheen={0.35} glow={0.25} mouseInteraction={false} clickRipple={false} />}
        </div>
        <div className="exp__vignette" aria-hidden="true" />

        <div className="exp__top container mono">
          <span>02 — EXPERIENCE</span>
          <span className="tabular">
            00:{String(local).padStart(2, '0')} <em>/ 00:30</em>
          </span>
        </div>

        <div className="exp__grid container">
          <div className="exp__copy">
            <Eyebrow light>THE CAMPUSCODE EXPERIENCE</Eyebrow>
            <MaskHeading className="display display--light" lines={['BUILD', <em className="serif accent">together.</em>]} />
            <ol className="exp__list">
              {SCENES.map((s, i) => (
                <li key={s.k} className={i === scene ? 'is-active' : i < scene ? 'is-done' : ''}>
                  <button type="button" onClick={() => setScene(i)} aria-pressed={i === scene}>
                    <span className="mono">0{i + 1}</span>
                    <strong>{s.k}</strong>
                    <small>{s.d}</small>
                    <i className="exp__bar">
                      <i />
                    </i>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="exp__frame">
            <div className="exp__chrome">
              <span className="exp__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="exp__url mono">campuscode.app/arena/{SCENES[scene].k.toLowerCase().replace(' ', '-')}</span>
              <span className="exp__rec mono">
                <i /> REC
              </span>
            </div>
            <div className="exp__stage">
              <div className="exp__stage-grid" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.div key={scene} className="exp__scene" {...fade}>
                  <span className="exp__scene-k" aria-hidden="true">
                    {SCENES[scene].k}
                  </span>
                  <View />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="exp__foot mono">
              <span className="exp__play">▶</span>
              <span>WATCH THE STORY</span>
              <span className="exp__hint">{pin ? 'PLAYS AS YOU SCROLL ↗' : 'AUTO-PLAYING ↗'}</span>
            </div>
            <div className="exp__progress">
              <motion.i style={{ scaleX: pin ? scrollYProgress : (scene + 1) / 4 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
