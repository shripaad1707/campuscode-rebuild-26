import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Magnet from '../components/rb/Magnet.jsx';
import { EASE } from '../lib/motion.jsx';

export const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#how' },
  { label: 'Hackathons', href: '#hackathons' },
  { label: 'Community', href: '#community' }
];

export function Logo({ light = false }) {
  return (
    <a href="#top" className={`logo ${light ? 'logo--light' : ''}`} aria-label="CampusCode home">
      <span className="logo__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="logo__type">
        <strong>CAMPUSCODE</strong>
        <small>HACKATHON ARENA</small>
      </span>
    </a>
  );
}

export default function Nav({ ready }) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', v => setSolid(v > 60));

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = e => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className={`nav ${solid ? 'is-solid' : ''} ${open ? 'is-menu' : ''}`}
        initial={{ y: -12, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <div className="nav__inner container">
          <Logo />
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={e => go(e, l.href)} className="nav__link">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <a href="#top" className="nav__link nav__login">
              Login
            </a>
            <Magnet padding={40} magnetStrength={4}>
              <a href="#join" onClick={e => go(e, '#join')} className="btn btn--accent btn--sm" data-cursor-label="JOIN">
                Join CampusCode <span className="btn__arrow">↗</span>
              </a>
            </Magnet>
          </div>
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav className="mobile-menu__links" aria-label="Mobile">
              {[...LINKS, { label: 'Join CampusCode', href: '#join' }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={e => go(e, l.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.08 + i * 0.06 }}
                >
                  <span className="mono">0{i + 1}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <p className="mobile-menu__foot mono">CHENNAI · INDIA</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
