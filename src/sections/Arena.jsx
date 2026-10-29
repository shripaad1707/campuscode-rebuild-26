import { useRef } from 'react';
import { useInView } from 'motion/react';
import FlowingMenu from '../components/rb/FlowingMenu.jsx';
import { MaskHeading, Reveal, useMediaQuery } from '../lib/motion.jsx';
import { Eyebrow } from './About.jsx';

const HACKS = [
  { cat: 'ARTIFICIAL INTELLIGENCE', t: 'AI INNOVATION', d: 'Build intelligent solutions for problems that matter.', s: 'LIVE', tone: 'lime' },
  { cat: 'WEB DEVELOPMENT', t: 'FUTURE WEB', d: 'Design and ship the next generation of digital experiences.', s: 'OPEN', tone: 'orange' },
  { cat: 'SMART TECHNOLOGY', t: 'CAMPUS TECH', d: 'Create technology that makes student life better.', s: 'UPCOMING', tone: 'muted' }
];

export default function Arena() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const wide = useMediaQuery('(min-width: 768px)');
  const rowH = wide ? 168 : 104;

  const items = HACKS.map(h => ({
    text: (
      <span className="arena__label">
        <small className="mono">
          {h.cat}
          {!wide && <b className={`arena__s arena__s--${h.tone}`}> · {h.s}</b>}
        </small>
        <span>{h.t}</span>
      </span>
    ),
    marquee: `${h.t} — ${h.d.toUpperCase()}`,
    meta: !wide ? null : (
      <span className="arena__meta">
        {wide && <span className="arena__desc">{h.d}</span>}
        <em className={`status status--${h.tone} mono`}>
          <i />
          {h.s}
        </em>
      </span>
    ),
    link: '#hackathons'
  }));

  return (
    <section id="hackathons" className="arena section">
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <Eyebrow n="04">ENTER THE ARENA</Eyebrow>
            <MaskHeading className="display" lines={['THE ARENA', <em className="serif accent">is open.</em>]} />
          </div>
          <Reveal delay={0.15}>
            <a href="#hackathons" className="link-btn">
              View all <span>↗</span>
            </a>
          </Reveal>
        </div>

        <div className="arena__menu" ref={ref} style={{ height: rowH * HACKS.length }}>
          {inView && (
            <FlowingMenu
              items={items}
              speed={70}
              textColor="#eeebe5"
              bgColor="transparent"
              marqueeBgColor="#ff5b1f"
              marqueeTextColor="#070708"
              borderColor="rgba(238,235,229,0.12)"
              showIndex
              showArrow
              align="left"
              stretch={0.5}
              followCursor={0.35}
              ariaLabel="Hackathons"
            />
          )}
        </div>
      </div>
    </section>
  );
}
