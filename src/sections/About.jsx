import { useMemo } from 'react';
import { motion } from 'motion/react';
import MagicBento from '../components/rb/MagicBento.jsx';
import CircularText from '../components/rb/CircularText.jsx';
import { EASE, LITE, MaskHeading, Reveal } from '../lib/motion.jsx';

export function Eyebrow({ n, children, light = false }) {
  return (
    <Reveal className={`eyebrow mono ${light ? 'eyebrow--light' : ''}`}>
      {n && <span className="eyebrow__n">{n}</span>}
      <span className="eyebrow__rule" />
      {children}
    </Reveal>
  );
}

function Head({ n, label }) {
  return (
    <div className="bx-head mono">
      <span className="bx-head__n">{n}</span>
      <span>{label}</span>
    </div>
  );
}

function Heatmap() {
  const cells = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 7 * 52 }, (_, i) => {
      const r = rnd();
      const boost = i < 7 * 10 ? 0.3 : 0;
      return Math.min(1, r * r * 1.1 + boost * r);
    });
  }, []);
  return (
    <div className="bx-heat" aria-hidden="true">
      {cells.map((v, i) => (
        <i key={i} style={{ opacity: 0.08 + v * 0.92, background: v > 0.62 ? 'var(--orange)' : v > 0.3 ? 'var(--orange-2)' : 'var(--ink)' }} />
      ))}
    </div>
  );
}

const Students = () => (
  <div className="bx bx--students">
    <Head n="01" label="STUDENTS" />
    <h3 className="bx-title">
      Build in public.
      <br />
      <em className="serif">Get noticed.</em>
    </h3>
    <p className="bx-desc">Every hackathon, team and shipped project becomes part of a living builder profile.</p>
    <div className="bx-profile">
      <div className="bx-profile__top">
        <span className="bx-avatar">A</span>
        <span>
          <strong>Aarav S.</strong>
          <small className="mono">CSE · 3RD YEAR · CHENNAI</small>
        </span>
        <span className="bx-badge mono">TOP 5%</span>
      </div>
      <Heatmap />
      <div className="bx-profile__stats">
        <span>
          <b className="tabular">06</b>
          <small className="mono">HACKATHONS</small>
        </span>
        <span>
          <b className="tabular">02</b>
          <small className="mono">PODIUMS</small>
        </span>
        <span>
          <b className="tabular">14</b>
          <small className="mono">PROJECTS</small>
        </span>
      </div>
    </div>
  </div>
);

const Teams = () => (
  <div className="bx bx--teams">
    <Head n="02" label="TEAMS" />
    <div className="bx-stack" aria-hidden="true">
      {['#ff5b1f', '#8b7cff', '#b6f23a', '#eeebe5'].map((c, i) => (
        <i key={c} style={{ background: c, zIndex: 4 - i }}>
          {'ARKM'[i]}
        </i>
      ))}
      <span className="bx-stack__plus">+</span>
    </div>
    <div>
      <h3 className="bx-title bx-title--sm">Find your squad</h3>
      <p className="bx-desc">Match on skills, not just friend lists.</p>
    </div>
  </div>
);

const Organizers = () => (
  <div className="bx bx--org">
    <Head n="03" label="ORGANIZERS" />
    <div className="bx-bars" aria-hidden="true">
      {[32, 48, 40, 66, 58, 82, 100].map((h, i) => (
        <motion.i key={i} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.06 }} style={{ height: `${h}%` }} />
      ))}
    </div>
    <div>
      <h3 className="bx-title bx-title--sm">Run it end-to-end</h3>
      <p className="bx-desc">Launch, review, judge, announce.</p>
    </div>
  </div>
);

const Hackathons = () => (
  <div className="bx bx--hacks">
    <div className="bx-row">
      <Head n="04" label="HACKATHONS" />
      <span className="mono bx-muted">3 ARENAS</span>
    </div>
    <ul className="bx-list">
      {[
        { t: 'AI Innovation', c: 'ARTIFICIAL INTELLIGENCE', s: 'LIVE', tone: 'lime' },
        { t: 'Future Web', c: 'WEB DEVELOPMENT', s: 'OPEN', tone: 'orange' },
        { t: 'Campus Tech', c: 'SMART TECHNOLOGY', s: 'UPCOMING', tone: 'muted' }
      ].map(h => (
        <li key={h.t}>
          <span>
            <small className="mono">{h.c}</small>
            <strong>{h.t}</strong>
          </span>
          <em className={`status status--${h.tone} mono`}>
            <i />
            {h.s}
          </em>
        </li>
      ))}
    </ul>
  </div>
);

const Idea = () => (
  <div className="bx bx--idea">
    <Head n="05" label="IDEACHECK" />
    <div className="bx-gauge" aria-hidden="true">
      <svg viewBox="0 0 120 70">
        <path d="M10 64 A50 50 0 0 1 110 64" className="bx-gauge__track" />
        <motion.path d="M10 64 A50 50 0 0 1 110 64" className="bx-gauge__fill" initial={{ pathLength: 0 }} whileInView={{ pathLength: 0.92 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE, delay: 0.3 }} />
      </svg>
      <b className="tabular">92%</b>
    </div>
    <p className="bx-desc">Originality check before you build.</p>
  </div>
);

const Cert = () => (
  <div className="bx bx--cert">
    <Head n="06" label="CERTIFICATES" />
    <div className="bx-cert">
      <span className="bx-cert__seal">✦</span>
      <span>
        <strong>Verified</strong>
        <small className="mono">CC-26-8F3K · VALID</small>
      </span>
    </div>
    <p className="bx-desc">Every result, verifiable by anyone.</p>
  </div>
);

const Eco = () => (
  <div className="bx bx--eco">
    <div className="bx-eco__ring">
      <CircularText text="STUDENTS ✦ TEAMS ✦ ORGANIZERS ✦ HACKATHONS ✦ " size={168} fontSize={10} fontWeight={500} letterSpacing={1.5} spinDuration={24} onHover="speedUp" className="mono" />
      <span className="bx-eco__cc">CC</span>
    </div>
    <div>
      <Head n="∞" label="ONE ECOSYSTEM" />
      <h3 className="bx-title">
        Everything connected.
        <br />
        <em className="serif">Nothing scattered.</em>
      </h3>
    </div>
  </div>
);

const ITEMS = [
  { colSpan: 2, rowSpan: 2, content: <Students /> },
  { content: <Teams /> },
  { content: <Organizers /> },
  { colSpan: 2, content: <Hackathons /> },
  { content: <Idea /> },
  { content: <Cert /> },
  { colSpan: 2, content: <Eco /> }
];

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow n="01">WHAT IS CAMPUSCODE?</Eyebrow>
            <MaskHeading className="display" lines={['WHERE STUDENTS', <em className="serif accent">build.</em>]} />
          </div>
          <Reveal as="p" className="lead section-head__aside" delay={0.15}>
            CampusCode brings students, teams, organizers and hackathons into one connected ecosystem.
          </Reveal>
        </div>
        <Reveal y={28} duration={1.3}>
          <MagicBento
            items={ITEMS}
            columns={4}
            rowHeight={236}
            gap={14}
            radius={22}
            theme="dark"
            glowColor="#ff5b1f"
            textAutoHide={false}
            enableStars={!LITE}
            particleCount={14}
            enableTilt
            enableMagnetism={false}
            spotlightRadius={320}
            className="bento"
          />
        </Reveal>
      </div>
    </section>
  );
}
