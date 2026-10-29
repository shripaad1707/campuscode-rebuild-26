import { useRef } from 'react';
import { Logo } from './Nav.jsx';
import { Reveal, Stagger, staggerItem } from '../lib/motion.jsx';
import { motion } from 'motion/react';

const COLS = [
  { h: 'PRODUCT', l: ['About', 'Hackathons', 'How it works', 'Community'] },
  { h: 'BUILDERS', l: ['Students', 'Teams', 'Organizers', 'Developers'] },
  { h: 'GUIDES', l: ['Hackathon Rules', 'FAQ', 'Support', 'Contact'] }
];

function Wordmark() {
  const ref = useRef(null);
  const move = e => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className="wordmark" ref={ref} onPointerMove={move} aria-hidden="true">
      <span className="wordmark__base">CampusCode</span>
      <span className="wordmark__fill">CampusCode</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <Reveal className="footer__brand">
          <Logo />
          <p>
            The student hackathon arena.
            <br />
            You build the idea,
            <br />
            we run the competition.
          </p>
          <div className="footer__status mono">
            <span>
              <i className="live-dot live-dot--green" /> ALL SYSTEMS OPERATIONAL
            </span>
            <a href="#top">TERMS</a>
            <a href="#top">PRIVACY</a>
            <a href="#top">CONTACT</a>
          </div>
        </Reveal>
        <Stagger className="footer__cols" stagger={0.06}>
          {COLS.map(c => (
            <motion.div key={c.h} variants={staggerItem()}>
              <h4 className="mono">{c.h}</h4>
              <ul>
                {c.l.map(x => (
                  <li key={x}>
                    <a href="#top" className="footer__link">
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </Stagger>
      </div>
      <Wordmark />
      <div className="container footer__bottom mono">
        <span>© 2026 CAMPUSCODE</span>
        <span>LEARN · BUILD · COMPETE · SHIP</span>
        <span>CHENNAI · INDIA</span>
      </div>
    </footer>
  );
}
