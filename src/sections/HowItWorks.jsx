import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import SpotlightCard from '../components/rb/SpotlightCard.jsx';
import { MaskHeading, Reveal, useMediaQuery } from '../lib/motion.jsx';
import { Eyebrow } from './About.jsx';

const STEPS = [
  {
    n: '01',
    t: 'DISCOVER',
    d: 'Find a challenge that makes you want to build.',
    k: ['Browse live arenas', 'Filter by track', 'Save to your list'],
    icon: (
      <svg viewBox="0 0 48 48">
        <circle cx="21" cy="21" r="12" />
        <path d="M30 30l9 9" />
        <path d="M15 21a6 6 0 0 1 6-6" />
      </svg>
    )
  },
  {
    n: '02',
    t: 'TEAM UP',
    d: 'Find people who share your ambition.',
    k: ['Skill-based matching', 'Invite in one tap', 'Roles that fit'],
    icon: (
      <svg viewBox="0 0 48 48">
        <circle cx="17" cy="18" r="6" />
        <circle cx="33" cy="18" r="6" />
        <path d="M6 38c1-7 6-11 11-11s10 4 11 11" />
        <path d="M24 30c2-2 5-3 9-3 5 0 10 4 11 11" />
      </svg>
    )
  },
  {
    n: '03',
    t: 'BUILD',
    d: 'Turn your idea into something people can use.',
    k: ['Checkpoints & mentors', 'IdeaCheck originality', 'Ship a real demo'],
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M17 14L7 24l10 10" />
        <path d="M31 14l10 10-10 10" />
        <path d="M27 9l-6 30" />
      </svg>
    )
  },
  {
    n: '04',
    t: 'SHIP',
    d: 'Submit your work and take it to the arena.',
    k: ['Submit & present', 'Judged, ranked, announced', 'Verified certificate'],
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M24 6c7 5 10 13 9 22l-9 6-9-6c-1-9 2-17 9-22z" />
        <circle cx="24" cy="19" r="3.5" />
        <path d="M15 28l-6 6 7 2M33 28l6 6-7 2M21 38l3 5 3-5" />
      </svg>
    )
  }
];

function Card({ s, i }) {
  return (
    <SpotlightCard theme="dark" spotlightColor="#ff5b1f" intensity={0.2} spotlightSize={380} borderGlow={0.9} className="how__card">
      <span className="how__big" aria-hidden="true">
        {s.n}
      </span>
      <div className="how__top">
        <span className="mono how__n">
          STEP {s.n} / 04
        </span>
        <span className="how__icon">{s.icon}</span>
      </div>
      <div className="how__body">
        <h3 className="how__t">{s.t}</h3>
        <p className="how__d">{s.d}</p>
        <ul className="how__k mono">
          {s.k.map(x => (
            <li key={x}>
              <i />
              {x}
            </li>
          ))}
        </ul>
      </div>
      <div className="how__dots" aria-hidden="true">
        {STEPS.map((_, j) => (
          <i key={j} className={j <= i ? 'is-on' : ''} />
        ))}
      </div>
    </SpotlightCard>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const track = useRef(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const pin = desktop && !reduce;
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    if (!pin || !track.current) return;
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pin]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="how" className={`how ${pin ? 'is-pinned' : ''}`} ref={ref} style={pin ? { height: `calc(${dist}px + 100vh)` } : undefined}>
      <div className="how__sticky">
        <motion.div className="how__track" ref={track} style={pin ? { x } : undefined} data-lenis-prevent={pin ? undefined : ''}>
          <div className="how__intro">
            <Eyebrow n="03">HOW IT WORKS</Eyebrow>
            <MaskHeading className="display" lines={['FROM IDEA', <em className="serif accent">to impact.</em>]} />
            <Reveal as="p" className="lead" delay={0.15}>
              Four moves. One arena. From the first spark of an idea to a shipped, judged, certified project.
            </Reveal>
            <Reveal delay={0.3} className="how__swipe mono">
              {pin ? 'KEEP SCROLLING →' : 'SWIPE →'}
            </Reveal>
          </div>
          {STEPS.map((s, i) => (
            <div className="how__cell" key={s.n}>
              <Card s={s} i={i} />
            </div>
          ))}
          <div className="how__end">
            <p className="mono">YOUR TURN</p>
            <h3 className="display display--md">
              READY
              <br />
              <em className="serif accent">to play?</em>
            </h3>
            <a href="#join" className="btn btn--accent" data-cursor-label="GO">
              Join the arena <span className="btn__arrow">↗</span>
            </a>
          </div>
        </motion.div>
        {pin && (
          <div className="how__progress container" aria-hidden="true">
            <motion.i style={{ scaleX: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}
