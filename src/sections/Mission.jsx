import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LITE, MaskHeading } from '../lib/motion.jsx';
import LightRays from '../components/rb/LightRays.jsx';
import { Eyebrow } from './About.jsx';

const STATEMENT = 'Your university is full of people with ideas. CampusCode gives those ideas somewhere to go.';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span className="scrub-word" style={{ opacity }} aria-hidden="true">
      {children}
    </motion.span>
  );
}

function ScrubStatement() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = STATEMENT.split(' ');
  return (
    <p ref={ref} className="statement" aria-label={STATEMENT}>
      {words.map((w, i) =>
        reduce ? (
          <span key={i} aria-hidden="true">
            {w}{' '}
          </span>
        ) : (
          <span key={i}>
            <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w === 'CampusCode' ? <em className="serif accent">{w}</em> : w}
            </Word>{' '}
          </span>
        )
      )}
    </p>
  );
}

export default function Mission() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-38%']);

  return (
    <section className="mission section" ref={ref}>
      <div className="mission__rays" aria-hidden="true">
        {!LITE && <LightRays raysOrigin="top-center" raysColor="#ff7a3d" raysSpeed={0.8} lightSpread={0.7} rayLength={2.2} glow={0.5} haze={0.3} followMouse mouseInfluence={0.12} clickPulse={false} opacity={0.75} />}
      </div>
      <motion.div className="mission__ghost" style={reduce ? undefined : { x }} aria-hidden="true">
        CAMPUSCODE
      </motion.div>
      <div className="container mission__inner">
        <Eyebrow n="05">THE MISSION</Eyebrow>
        <MaskHeading className="display display--xl" lines={['GREAT', 'IDEAS', <em className="serif accent">need builders.</em>]} />
        <ScrubStatement />
      </div>
    </section>
  );
}
