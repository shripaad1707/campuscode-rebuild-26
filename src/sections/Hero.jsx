import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import LiquidEther from '../components/rb/LiquidEther.jsx';
import DecryptedText from '../components/rb/DecryptedText.jsx';
import VariableProximity from '../components/rb/VariableProximity.jsx';
import Magnet from '../components/rb/Magnet.jsx';
import Phone from './Phone.jsx';
import { EASE, LITE, MaskHeading, useClock } from '../lib/motion.jsx';

function Seq({ ready, delay, className, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export const scrollToId = id => e => {
  e.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(id, { offset: -72 });
  else document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero({ ready }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const clock = useClock();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '-18%']);
  const copyO = useTransform(scrollYProgress, [0.2, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const phoneY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);

  const vp = {
    containerRef: ref,
    fromFontVariationSettings: "'wght' 900",
    toFontVariationSettings: "'wght' 240",
    radius: 210,
    falloff: 'gaussian',
    smoothing: 0.18
  };

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__bg" style={reduce ? undefined : { y: bgY, scale: bgScale }} aria-hidden="true">
        <div className="hero__fluid">
          {!LITE && (
            <LiquidEther
              colors={['#ff5b1f', '#8b7cff', '#2a1a6e']}
              mouseForce={22}
              cursorSize={110}
              resolution={0.45}
              autoDemo
              autoSpeed={0.45}
              autoIntensity={2.1}
              intensity={0.9}
            />
          )}
        </div>
        <div className="hero__grid-lines" />
        <div className="hero__shade" />
      </motion.div>

      <Seq ready={ready} delay={0.3} className="hero__meta container mono">
        <span className="hero__meta-l">
          <i className="live-dot" />
          {ready ? (
            <DecryptedText text="THE DIGITAL HOME FOR STUDENT INNOVATION" animateOn="view" sequential speed={26} characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_" />
          ) : (
            'THE DIGITAL HOME FOR STUDENT INNOVATION'
          )}
        </span>
        <span className="hero__meta-r">
          CHENNAI · INDIA <span className="tabular hero__clock">{clock} IST</span>
        </span>
      </Seq>

      <div className="hero__layout container">
        <motion.div className="hero__copy" style={reduce ? undefined : { y: copyY, opacity: copyO }}>
          <Seq ready={ready} delay={0.35} className="eyebrow mono">
            <span className="eyebrow__n">CAMPUSCODE / 001</span>
            <span className="eyebrow__rule" />
            HACKATHON ARENA
          </Seq>
          <MaskHeading
            as="h1"
            className="hero__title"
            immediate={ready}
            hold={!ready}
            delay={0.45}
            amount={0}
            lines={[
              <VariableProximity label="BUILD" {...vp} toColor="#ff5b1f" />,
              <VariableProximity label="COMPETE" {...vp} fromColor="#ff5b1f" toColor="#ffb08a" className="hero__compete" />,
              <>
                <VariableProximity label="SHIP" {...vp} toColor="#ff5b1f" />
                <span className="hero__dot">.</span>
              </>
            ]}
          />
          <div className="hero__foot">
            <Seq ready={ready} delay={0.95} className="hero__lead">
              <p>
                A digital arena for students who don&apos;t just have ideas. <em className="serif">They build them.</em>
              </p>
            </Seq>
            <Seq ready={ready} delay={1.1} className="hero__ctas">
              <Magnet padding={60} magnetStrength={3}>
                <a href="#hackathons" className="btn btn--accent" data-cursor-label="ENTER" onClick={scrollToId('#hackathons')}>
                  Explore hackathons <span className="btn__arrow">↗</span>
                </a>
              </Magnet>
              <a href="#about" className="link-btn" onClick={scrollToId('#about')}>
                What is CampusCode <span>→</span>
              </a>
            </Seq>
          </div>
        </motion.div>

        <motion.div className="hero__phone" style={reduce ? undefined : { y: phoneY }}>
          <Phone ready={ready} />
        </motion.div>
      </div>

      <Seq ready={ready} delay={1.5} className="hero__bottom container mono">
        <span className="scroll-cue">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-cue__track">
            <span />
          </span>
        </span>
        <span className="hero__hint">MOVE YOUR CURSOR ✦ STIR THE ARENA</span>
        <span className="tabular">01 / 05</span>
      </Seq>
    </section>
  );
}
