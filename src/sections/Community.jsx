import { useState } from 'react';
import { motion } from 'motion/react';
import LogoLoop from '../components/rb/LogoLoop.jsx';
import { EASE, MaskHeading, Reveal } from '../lib/motion.jsx';
import { Eyebrow } from './About.jsx';

const ROLES = [
  { k: 'DEVELOPERS', a: -90 },
  { k: 'DESIGNERS', a: -30 },
  { k: 'ML / AI', a: 30 },
  { k: 'PRODUCT', a: 90 },
  { k: 'HARDWARE', a: 150 },
  { k: 'BUILDERS', a: 210 }
];

const SKILLS = ['React', 'Python', 'Figma', 'TensorFlow', 'Flutter', 'Node.js', 'Arduino', 'Next.js', 'Rust', 'Blender', 'Go', 'Solidity', 'Kotlin', 'Swift'];

function Network() {
  const [hot, setHot] = useState(null);
  const R = 40;
  return (
    <Reveal className="net" y={28} duration={1.3}>
      <svg className="net__lines" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={R} className="net__ring" />
        <circle cx="50" cy="50" r={R * 0.6} className="net__ring net__ring--in" />
        {ROLES.map((r, i) => {
          const x = 50 + Math.cos((r.a * Math.PI) / 180) * R;
          const y = 50 + Math.sin((r.a * Math.PI) / 180) * R;
          return (
            <motion.line
              key={r.k}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              className={`net__link ${hot === i ? 'is-hot' : ''}`}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.08 }}
            />
          );
        })}
      </svg>
      {ROLES.map((r, i) => (
        <button
          key={r.k}
          type="button"
          className={`net__node mono ${hot === i ? 'is-hot' : ''}`}
          style={{ left: `${50 + Math.cos((r.a * Math.PI) / 180) * R}%`, top: `${50 + Math.sin((r.a * Math.PI) / 180) * R}%` }}
          onPointerEnter={() => setHot(i)}
          onPointerLeave={() => setHot(null)}
          onFocus={() => setHot(i)}
          onBlur={() => setHot(null)}
        >
          <i />
          {r.k}
        </button>
      ))}
      <div className="net__core">
        <span className="net__pulse" />
        <span className="net__pulse net__pulse--b" />
        <span className="net__cc">CC</span>
      </div>
    </Reveal>
  );
}

export default function Community() {
  return (
    <section id="community" className="community section">
      <div className="container community__grid">
        <div className="community__copy">
          <Eyebrow>THE NETWORK</Eyebrow>
          <MaskHeading className="display display--xl" lines={['FIND', 'YOUR', <em className="serif accent">people.</em>]} />
          <Reveal as="ul" className="community__lines" delay={0.2}>
            <li>
              Build with <strong>developers.</strong>
            </li>
            <li>
              Think with <strong>designers.</strong>
            </li>
            <li>
              Compete with <strong>builders.</strong>
            </li>
          </Reveal>
        </div>
        <Network />
      </div>
      <div className="community__loop">
        <LogoLoop
          logos={SKILLS.map(s => ({ node: <span className="skill-pill">{s}</span>, title: s }))}
          speed={60}
          logoHeight={15}
          gap={14}
          fadeOut
          fadeOutColor="#fafaf7"
          pauseOnHover
          ariaLabel="Skills in the community"
        />
      </div>
    </section>
  );
}
