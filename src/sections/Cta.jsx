import Threads from '../components/rb/Threads.jsx';
import Magnet from '../components/rb/Magnet.jsx';
import { LITE, MaskHeading, Reveal } from '../lib/motion.jsx';

export default function Cta() {
  return (
    <section id="join" className="cta">
      <div className="cta__grid-lines" aria-hidden="true" />
      <div className="cta__threads" aria-hidden="true">
        {!LITE && <Threads color={[1, 0.36, 0.12]} accentColor={[0.55, 0.49, 1]} amplitude={1.4} distance={0.2} lineCount={40} thickness={0.7} speed={0.35} brightness={1} enableMouseInteraction />}
      </div>
      <div className="cta__inner container">
        <Reveal className="cta__ready mono">
          <i className="live-dot" /> READY?
        </Reveal>
        <MaskHeading className="display display--cta" lines={['YOUR NEXT', 'PROJECT', <em className="serif accent">starts here.</em>]} />
        <Reveal delay={0.25} as="p" className="lead lead--center">
          Join the arena where students learn, build, compete and ship — together.
        </Reveal>
        <Reveal delay={0.35} className="cta__actions">
          <Magnet padding={90} magnetStrength={3}>
            <a href="#top" className="btn btn--accent btn--lg" data-cursor-label="JOIN">
              Join CampusCode <span className="btn__arrow">↗</span>
            </a>
          </Magnet>
          <a href="#hackathons" className="link-btn">
            Browse hackathons <span>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
