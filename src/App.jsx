import { useEffect, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ClickSpark from './components/rb/ClickSpark.jsx';
import GradualBlur from './components/rb/GradualBlur.jsx';
import { prefersReduced } from './lib/motion.jsx';

import Loader from './sections/Loader.jsx';
import Nav from './sections/Nav.jsx';
import Hero from './sections/Hero.jsx';
import Marquee from './sections/Marquee.jsx';
import About from './sections/About.jsx';
import Experience from './sections/Experience.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import Arena from './sections/Arena.jsx';
import Mission from './sections/Mission.jsx';
import Community from './sections/Community.jsx';
import Cta from './sections/Cta.jsx';
import Footer from './sections/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export default function App() {
  const [ready, setReady] = useState(() => prefersReduced());
  const [loaderGone, setLoaderGone] = useState(() => prefersReduced());

  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 3.2), anchors: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    if (ready) {
      window.__lenis?.start();
      const t = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(t);
    }
    window.__lenis?.stop();
  }, [ready]);

  return (
    <MotionConfig reducedMotion="user">
      <ClickSpark sparkColor={['#ff5b1f', '#8b7cff', '#eeebe5']} sparkSize={10} sparkRadius={22} sparkCount={9} duration={520} style={{ height: 'auto' }}>
        {!loaderGone && <Loader onReveal={() => setReady(true)} onDone={() => setLoaderGone(true)} />}
        <ScrollProgress />
        <div className="grain" aria-hidden="true" />
        <Nav ready={ready} />
        <main>
          <Hero ready={ready} />
          <Marquee />
          <About />
          <Experience />
          <HowItWorks />
          <Arena />
          <Mission />
          <Community />
          <Cta />
        </main>
        <Footer />
        <GradualBlur target="page" position="bottom" height="3.5rem" strength={1.1} layers={6} curve="bezier" exponential autoHide zIndex={40} />
      </ClickSpark>
    </MotionConfig>
  );
}
