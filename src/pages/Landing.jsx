import { useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Ticket from '../components/Ticket.jsx';
import Barcode from '../components/Barcode.jsx';
import FlapText from '../components/FlapText.jsx';
import Reveal from '../components/Reveal.jsx';
import ScrollVelocity from '../components/rb/ScrollVelocity.jsx';
import Magnet from '../components/rb/Magnet.jsx';
import DotGrid from '../components/rb/DotGrid.jsx';
import RotatingText from '../components/rb/RotatingText.jsx';
import CircularText from '../components/rb/CircularText.jsx';
import BlurText from '../components/rb/BlurText.jsx';
import ShinyText from '../components/rb/ShinyText.jsx';
import GlareHover from '../components/rb/GlareHover.jsx';
import Stack from '../components/rb/Stack.jsx';
import Counter from '../components/rb/Counter.jsx';
import GradientText from '../components/rb/GradientText.jsx';
import MagnetLines from '../components/rb/MagnetLines.jsx';
import { useInView } from 'motion/react';
import { events, fmtDate } from '../data/events.js';
import { go } from '../App.jsx';

const EASE = [0.16, 1, 0.3, 1];

export default function Landing({ user }) {
  return (
    <div className="page page--grid">
      <Nav user={user} />
      <Hero />
      <Marquee />
      <Departures />
      <Route />
      <Tracks />
      <Stamps />
      <Numbers />
      <TearCta />
      <Footer />
    </div>
  );
}

/* ---------------- 01 · HERO: a giant boarding pass ---------------- */
function Hero() {
  // gentle 3D tilt that follows the cursor
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 18 });

  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <section className="hero wrap">
      <div className="hero__dots" aria-hidden="true">
        <DotGrid dotSize={3} gap={24} baseColor="#d6d6cf" activeColor="#7665ff" proximity={140} shockRadius={260} shockStrength={4} glow={0.2} />
      </div>
      <div className="hero__meta label">
        <span><i className="dot dot--live" /> <ShinyText text="Boarding now · ReBuild '26" color="#111111" shineColor="#7665ff" speed={2.4} /></span>
        <span>The digital home for student innovation</span>
        <span>Chennai · India</span>
      </div>

      <motion.div
        className="hero__stage"
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY }}
        initial={{ clipPath: 'inset(0 0 100% 0)', y: 40 }}
        animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
      >
        <Ticket
          className="hero__ticket"
          stub={
            <div className="hero__stub">
              <div className="hero__stub-row">
                <p className="label">Class</p>
                <p className="hero__class">STUDENT</p>
              </div>
              <div className="hero__stub-row">
                <p className="label">Date</p>
                <p className="hero__class">06–07 NOV</p>
              </div>
              <div className="hero__stub-row">
                <p className="label">Seat</p>
                <p className="hero__class purple">CC-26</p>
              </div>
              <div className="hero__seal" aria-hidden="true">
                <CircularText text="BOARDING NOW ✦ REBUILD '26 ✦ " size={136} fontSize={12} fontWeight={700} spinDuration={16} color="#111111" onHover="speedUp">
                  <span className="hero__seal-core">✦</span>
                </CircularText>
              </div>
              <Barcode value="ADMIT-ONE-BUILDER" height={56} />
              <Magnet padding={50} magnetStrength={5}>
                <a className="btn btn--lime btn--block" href="#/register">Board now ↗</a>
              </Magnet>
            </div>
          }
        >
          <div className="hero__top label">
            <span>CampusCode / Pass 001</span>
            <span>Admit one</span>
          </div>

          <h1 className="hero__title">
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}>
              ADMIT ONE
            </motion.span>
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}>
              <em>BUILDER.</em>
            </motion.span>
          </h1>

          <p className="hero__copy">
            A digital arena for students who don't just have ideas. They build them. Find a hackathon, team up and ship
            something real.
          </p>

          <p className="hero__for">
            <span className="label">Built for</span>
            <RotatingText
              texts={['DESIGNERS', 'CODERS', 'FIRST-TIMERS', 'DREAMERS', 'TEAMS']}
              mainClassName="hero__rot"
              staggerFrom="last"
              staggerDuration={0.025}
              rotationInterval={2200}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />
          </p>

          {/* boarding-pass route: IDEA → SHIPPED */}
          <div className="route-line">
            <div>
              <p className="label">From</p>
              <p className="route-line__code">IDEA</p>
            </div>
            <div className="route-line__path" aria-hidden="true">
              <span className="route-line__plane">✦</span>
            </div>
            <div className="route-line__to">
              <p className="label">To</p>
              <p className="route-line__code">SHIPPED</p>
            </div>
          </div>

          <dl className="hero__fields">
            <div><dt className="label">Passenger</dt><dd>You</dd></div>
            <div><dt className="label">Gate</dt><dd>BUILD</dd></div>
            <div><dt className="label">Boarding</dt><dd>COMPETE</dd></div>
            <div><dt className="label">Arrival</dt><dd>SHIP</dd></div>
          </dl>
        </Ticket>
      </motion.div>

      <div className="hero__foot label">
        <span>Scroll for departures ↓</span>
        <span>Build · Compete · Ship</span>
      </div>
    </section>
  );
}

/* ---------------- Crossing marquee bands (React Bits ScrollVelocity) ---------------- */
const WORDS = ['IDEAS', 'PEOPLE', 'PRODUCTS', 'INNOVATION', 'COMMUNITY'];
const Row = () => (
  <span className="marquee__row">
    {WORDS.map(w => (
      <span key={w} className="marquee__word">
        {w}
        <span className="marquee__star">✦</span>
      </span>
    ))}
  </span>
);

function Marquee() {
  return (
    <div className="marquee" aria-label="Ideas, people, products, innovation, community">
      <div className="marquee__band marquee__band--b" aria-hidden="true">
        <ScrollVelocity texts={[<Row key="b" />]} velocity={-30} numCopies={4} parallaxClassName="marquee__parallax" scrollerClassName="marquee__scroller" />
      </div>
      <div className="marquee__band marquee__band--a">
        <ScrollVelocity texts={[<Row key="a" />]} velocity={36} numCopies={4} skewWithVelocity={5} parallaxClassName="marquee__parallax" scrollerClassName="marquee__scroller" />
      </div>
    </div>
  );
}

/* ---------------- 02 · DEPARTURES BOARD: live events ---------------- */
const STATUS = {
  live: { text: 'BOARDING', cls: 'live' },
  open: { text: 'OPEN', cls: 'open' },
  upcoming: { text: 'SCHEDULED', cls: 'soon' },
  completed: { text: 'LANDED', cls: 'done' }
};

function Departures() {
  const rows = events.slice(0, 7);
  return (
    <section className="section wrap" id="departures">
      <SectionHead n="01" label="Live departures" title="PICK YOUR NEXT FLIGHT." />
      <Reveal className="board">
        <div className="board__head label">
          <span>Date</span>
          <span>Event</span>
          <span>Track</span>
          <span>Team</span>
          <span>Status</span>
        </div>
        {rows.map((e, i) => {
          const s = STATUS[e.phase];
          return (
            <button key={e.id} className="board__row" onClick={() => go('/register')}>
              <span className="mono"><FlapText text={fmtDate(e.starts)} delay={i * 90} /></span>
              <span className="board__event"><FlapText text={e.title.toUpperCase()} delay={i * 90} /></span>
              <span className="mono muted">{e.track.toUpperCase()}</span>
              <span className="mono muted">{e.team.toUpperCase()}</span>
              <span className={`status status--${s.cls}`}>{s.text}</span>
            </button>
          );
        })}
      </Reveal>
    </section>
  );
}

/* ---------------- 03 · ROUTE: how it works ---------------- */
const STOPS = [
  { n: '01', t: 'DISCOVER', d: 'Find a challenge that makes you want to build.' },
  { n: '02', t: 'TEAM UP', d: 'Use HackMate to find people who share your ambition.' },
  { n: '03', t: 'BUILD', d: 'Turn your idea into something people can use.' },
  { n: '04', t: 'SHIP', d: 'Submit your work and take it to the arena.' }
];

function Route() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="section wrap" id="route" ref={ref}>
      <SectionHead n="02" label="How it works" title="FROM IDEA TO IMPACT." />
      <div className="stops">
        <div className="stops__track" aria-hidden="true">
          <motion.div className="stops__fill" style={{ width }} />
        </div>
        {STOPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} className="stop">
            <span className="stop__dot" />
            <p className="label">Stop {s.n}</p>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- TRACKS: a draggable deck of track passes ---------------- */
const TRACK_CARDS = [
  { t: 'AI', d: 'Models, agents and tools that think.', code: 'TRK-AI', tone: 'purple' },
  { t: 'WEB', d: 'Sites and apps people actually use.', code: 'TRK-WEB', tone: 'ink' },
  { t: 'DESIGN', d: 'Interfaces, systems and brands.', code: 'TRK-DSN', tone: 'lime' },
  { t: 'SMART TECH', d: 'Hardware, IoT and the physical world.', code: 'TRK-IOT', tone: 'paper' },
  { t: 'QUIZ', d: 'Fast rounds for sharp minds.', code: 'TRK-QZ', tone: 'purple' }
];

function Tracks() {
  return (
    <section className="section wrap" id="tracks">
      <div className="tracks">
        <div className="tracks__copy">
          <SectionHead n="03" label="Choose a track" title="SHUFFLE THE DECK." />
          <p className="tracks__lead">
            Five tracks, one pass. Drag the top card away to see the next one. Every track has its own rounds, mentors and
            prizes.
          </p>
          <ul className="tracks__list">
            {TRACK_CARDS.map(c => (
              <li key={c.t}><span className="mono purple">{c.code}</span> {c.t}</li>
            ))}
          </ul>
        </div>
        <Reveal className="tracks__stack">
          <Stack
            layout="fan"
            visible={4}
            radius={18}
            sendToBackOnClick
            autoplay
            autoplayDelay={3400}
            pauseOnHover
            cards={TRACK_CARDS.map(c => (
              <div key={c.t} className={`trackcard trackcard--${c.tone}`}>
                <div className="trackcard__top label"><span>Track pass</span><span>{c.code}</span></div>
                <p className="trackcard__title">{c.t}</p>
                <p className="trackcard__desc">{c.d}</p>
                <div className="trackcard__foot"><Barcode value={c.code} height={34} /></div>
              </div>
            ))}
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 04 · STAMPS: the platform ---------------- */
const FEATURES = [
  { k: 'IdeaCheck', s: 'SCREENED', d: 'AI screening tells you how original your idea is before you build.', tone: 'purple', r: -6 },
  { k: 'HackMate', s: 'MATCHED', d: 'Find teammates by skill or search by CampusCode ID.', tone: 'ink', r: 4 },
  { k: 'RuleBot', s: 'CLEARED', d: 'Ask the rules anything. Get answers instantly, not after the deadline.', tone: 'lime', r: -3 },
  { k: 'Live rounds', s: 'TRACKED', d: 'Every round, result and shortlist in one place.', tone: 'ink', r: 5 },
  { k: 'Certificates', s: 'VERIFIED', d: 'Verifiable certificates, issued the day results land.', tone: 'purple', r: -5 },
  { k: 'Digital ID', s: 'ISSUED', d: 'Your builder ID card with a QR code, ready at every event.', tone: 'lime', r: 3 }
];

function Stamps() {
  return (
    <section className="section wrap" id="stamps">
      <SectionHead n="04" label="The platform" title="ONE PASS. EVERY STAMP." />
      <div className="stamps">
        {FEATURES.map((f, i) => (
          <Reveal key={f.k} delay={(i % 3) * 0.08} className="stamp-cell">
            <GlareHover className="stamp-card" background="#ffffff" borderColor="#deded8" borderRadius="0px" glareColor="#7665ff" glareOpacity={0.18} glareSize={260} transitionDuration={800}>
            <motion.div
              className={`stamp stamp--${f.tone}`}
              initial={{ scale: 1.6, opacity: 0, rotate: f.r - 12 }}
              whileInView={{ scale: 1, opacity: 1, rotate: f.r }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 + (i % 3) * 0.1 }}
            >
              <span>{f.s}</span>
              <small>CAMPUSCODE · 26</small>
            </motion.div>
            <h3>{f.k}</h3>
            <p>{f.d}</p>
            </GlareHover>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 05 · NUMBERS ---------------- */
function Numbers() {
  const stats = [
    { to: 12400, s: '+', l: 'Students building' },
    { to: 180, s: '+', l: 'Colleges on board' },
    { to: 64, s: '', l: 'Hackathons hosted' },
    { to: 3200, s: '+', l: 'Projects shipped' }
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="section wrap">
      <div className="numbers" ref={ref}>
        {stats.map(x => (
          <div key={x.l} className="numbers__item">
            <p className="numbers__value">
              <Counter value={inView ? x.to : 0} fontSize="1em" fontWeight={800} duration={1.4} stagger={0.06} intro={false} suffix={x.s} />
            </p>
            <p className="label">{x.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 06 · CTA: tear the stub to join ---------------- */
function TearCta() {
  const [torn, setTorn] = useState(false);
  const tear = () => {
    if (torn) return;
    setTorn(true);
    setTimeout(() => go('/register'), 750);
  };

  return (
    <section className="section wrap">
      <Reveal>
        <div className={`cta ${torn ? 'is-torn' : ''}`}>
          <div className="cta__main">
            <div className="cta__lines" aria-hidden="true">
              <MagnetLines rows={7} columns={16} lineColor="rgba(255,255,255,0.14)" accentColor="#a8e62e" lineHeight={22} lineWidth={2} radius={220} />
            </div>
            <p className="label">Ready?</p>
            <h2>
              <GradientText colors={['#ffffff', '#a8e62e', '#7665ff', '#ffffff']} animationSpeed={6} className="cta__grad">
                YOUR NEXT PROJECT STARTS HERE.
              </GradientText>
            </h2>
            <p>Create your CampusCode pass in under a minute. Tear the stub to begin.</p>
          </div>
          <motion.button
            className="cta__stub"
            onClick={tear}
            animate={torn ? { rotate: 14, y: 260, x: 40, opacity: 0 } : { rotate: 0, y: 0, x: 0, opacity: 1 }}
            whileHover={torn ? {} : { rotate: 3, x: 8 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="label">Admit one</span>
            <strong>TEAR TO JOIN ↗</strong>
            <Barcode value="JOIN" height={40} />
          </motion.button>
        </div>
      </Reveal>
    </section>
  );
}

export function SectionHead({ n, label, title }) {
  return (
    <Reveal className="section-head">
      <p className="section-head__label label">
        <span className="purple">{n}</span> {label}
      </p>
      <h2>
        <BlurText text={title} animateBy="words" direction="top" delay={90} className="section-head__blur" />
      </h2>
    </Reveal>
  );
}
