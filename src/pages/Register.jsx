import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from '../components/Logo.jsx';
import Ticket from '../components/Ticket.jsx';
import Field from '../components/Field.jsx';
import QR from '../components/QR.jsx';
import Barcode from '../components/Barcode.jsx';
import { useCaptcha } from '../components/Captcha.jsx';
import { TEAM_NAME } from '../data/events.js';
import { go } from '../App.jsx';
import DotGrid from '../components/rb/DotGrid.jsx';
import StarBorder from '../components/rb/StarBorder.jsx';
import ShinyText from '../components/rb/ShinyText.jsx';
import RotatingText from '../components/rb/RotatingText.jsx';

const EASE = [0.16, 1, 0.3, 1];
const STEPS = ['Details', 'Profile', 'Verify'];
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// 0–4 score: length, number, uppercase, symbol
const strength = pw =>
  [pw.length >= 8, /\d/.test(pw), /[A-Z]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;

// stable "CC-26-XXXX" id built from the name
const makeId = name => {
  const n = [...(name || 'builder')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 10000, 7);
  return `CC-26-${String(n).padStart(4, '0')}`;
};

export default function Register({ onRegister }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('form'); // form | printing | done
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    college: '',
    year: '2nd year',
    team: TEAM_NAME,
    captcha: '',
    adult: false,
    terms: false
  });
  const captcha = useCaptcha();
  const id = useMemo(() => makeId(form.name), [form.name]);

  const set = key => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [key]: value }));
    setErrors(er => ({ ...er, [key]: undefined }));
  };

  // validate only the fields of the current step
  const validate = () => {
    const er = {};
    if (step === 0) {
      if (form.name.trim().length < 3) er.name = 'Enter your full name.';
      if (!isEmail(form.email)) er.email = 'Enter a valid email address.';
      if (strength(form.password) < 2) er.password = 'Use 8+ characters with a number or capital.';
    }
    if (step === 1) {
      if (!form.college.trim()) er.college = 'Which college are you from?';
      if (!form.team.trim()) er.team = 'Add a team name for tracking.';
    }
    if (step === 2) {
      if (!captcha.check(form.captcha)) er.captcha = 'That answer is not right. Try again.';
      if (!form.adult) er.adult = 'You must be 18 or older to join.';
      if (!form.terms) er.terms = 'Please accept the terms to continue.';
    }
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const next = e => {
    e.preventDefault();
    if (!validate()) return;
    if (step < STEPS.length - 1) return setStep(s => s + 1);
    setStatus('printing');
    setTimeout(() => setStatus('done'), 1400);
  };

  const enter = () => {
    onRegister({ name: form.name, email: form.email, role: form.role, college: form.college, year: form.year, team: form.team, id });
    go('/dashboard');
  };

  const score = strength(form.password);

  return (
    <div className="auth page--grid">
      <div className="auth__dots" aria-hidden="true">
        <DotGrid dotSize={3} gap={26} baseColor="#d9d9d2" activeColor="#7665ff" proximity={150} shockRadius={260} shockStrength={4} glow={0.2} />
      </div>
      <header className="auth__bar wrap">
        <Logo />
        <a className="btn btn--ghost" href="#/login">Already have a pass? Login ↗</a>
      </header>

      <main className="auth__grid auth__grid--reg wrap">
        {/* LEFT: your pass, printed live as you type */}
        <section className="reg__preview">
          <p className="label">
            <span className="purple">03</span> &nbsp; Join the arena
          </p>
          <h1 className="auth__title auth__title--sm">
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              PRINT YOUR
            </motion.span>
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}>
              <em>PASS.</em>
            </motion.span>
          </h1>

          <motion.div
            className={`idpass lift ${status !== 'form' ? 'is-issued' : ''}`}
            animate={status === 'printing' ? { y: [0, -6, 0], transition: { repeat: Infinity, duration: 0.5 } } : { y: 0 }}
          >
            <div className="idpass__head">
              <Logo />
              <span className="label">Digital ID · {form.role}</span>
            </div>
            <div className="idpass__body">
              <div className="idpass__info">
                <p className="label">Builder</p>
                <p className="idpass__name">{form.name || 'Your Name'}</p>
                <div className="idpass__grid">
                  <div>
                    <p className="label">CampusCode ID</p>
                    <p className="mono">{id}</p>
                  </div>
                  <div>
                    <p className="label">Team</p>
                    <p className="mono">{form.team || '—'}</p>
                  </div>
                  <div>
                    <p className="label">College</p>
                    <p>{form.college || '—'}</p>
                  </div>
                  <div>
                    <p className="label">Year</p>
                    <p>{form.year}</p>
                  </div>
                </div>
              </div>
              <QR value={id + form.name} size={104} />
            </div>
            <div className="idpass__foot">
              <span className="label">{form.email || 'you@college.edu'}</span>
              <Barcode value={id} height={26} />
            </div>
            <AnimatePresence>
              {status === 'done' && (
                <motion.div
                  className="stamp stamp--purple idpass__stamp"
                  initial={{ scale: 2, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                >
                  <span>ISSUED</span>
                  <small>CAMPUSCODE · 26</small>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <p className="reg__note label">
            <ShinyText text="Your pass updates as you type →" color="#6b6b66" shineColor="#7665ff" speed={2.2} />
          </p>
          <div className="reg__perks">
            <span className="label">Your pass unlocks</span>
            <RotatingText
              texts={['HACKMATE', 'IDEACHECK', 'RULEBOT', 'LIVE ROUNDS', 'CERTIFICATES']}
              mainClassName="reg__rot"
              staggerFrom="first"
              staggerDuration={0.02}
              rotationInterval={2000}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />
          </div>
        </section>

        {/* RIGHT: 3-step form */}
        <motion.section
          className="lift"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <Ticket
            vertical
            className="auth__ticket"
            stub={
              <>
                <span className="label">Gate 03 · Register</span>
                <span className="label">
                  Step {Math.min(step + 1, 3)} / 3
                </span>
              </>
            }
          >
            {status === 'form' ? (
              <form onSubmit={next} noValidate>
                <div className="auth__ticket-head">
                  <div>
                    <p className="label">New builder</p>
                    <h2>REGISTER</h2>
                  </div>
                </div>

                <ol className="stepper">
                  {STEPS.map((s, i) => (
                    <li key={s} className={i < step ? 'is-done' : i === step ? 'is-active' : ''}>
                      <button type="button" onClick={() => i < step && setStep(i)}>
                        <span>{i < step ? '✓' : `0${i + 1}`}</span> {s}
                      </button>
                    </li>
                  ))}
                </ol>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {step === 0 && (
                      <>
                        <Field label="Full name" placeholder="Shripaad Koduri" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                        <Field label="Email address" type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                        <Field label="Password" type="password" placeholder="8+ characters" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
                        <div className="meter" aria-label={`Password strength ${score} of 4`}>
                          {[0, 1, 2, 3].map(i => (
                            <span key={i} className={i < score ? `on on--${score}` : ''} />
                          ))}
                          <em className="label">{['Too weak', 'Weak', 'Okay', 'Strong', 'Very strong'][score]}</em>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <p className="field__label label">I am joining as</p>
                        <div className="roles">
                          {[
                            ['Student', 'Join events, find teammates, ship projects.'],
                            ['Organiser', 'Host hackathons and run rounds.']
                          ].map(([r, d]) => (
                            <label key={r} className={`role ${form.role === r ? 'is-on' : ''}`}>
                              <input type="radio" name="role" value={r} checked={form.role === r} onChange={set('role')} />
                              <strong>{r.toUpperCase()}</strong>
                              <span>{d}</span>
                            </label>
                          ))}
                        </div>
                        <Field label="College" placeholder="JNTU Hyderabad" value={form.college} onChange={set('college')} error={errors.college} />
                        <div className="field-row">
                          <label className="field">
                            <span className="field__label label">Year</span>
                            <span className="field__box">
                              <select value={form.year} onChange={set('year')}>
                                {['1st year', '2nd year', '3rd year', '4th year', 'Graduate'].map(y => (
                                  <option key={y}>{y}</option>
                                ))}
                              </select>
                            </span>
                          </label>
                          <Field label="Team name" hint="for tracking" value={form.team} onChange={set('team')} error={errors.team} />
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <Field
                          label={`Quick check · what is ${captcha.question}?`}
                          inputMode="numeric"
                          placeholder="Answer"
                          value={form.captcha}
                          onChange={set('captcha')}
                          error={errors.captcha}
                          right={<button type="button" className="field__toggle label" onClick={captcha.refresh}>↻ New</button>}
                        />
                        <label className={`check ${errors.adult ? 'check--error' : ''}`}>
                          <input type="checkbox" checked={form.adult} onChange={set('adult')} />
                          <span>I confirm I am 18 years or older.</span>
                        </label>
                        <label className={`check ${errors.terms ? 'check--error' : ''}`}>
                          <input type="checkbox" checked={form.terms} onChange={set('terms')} />
                          <span>I agree to the CampusCode terms and hackathon rules.</span>
                        </label>
                        {(errors.adult || errors.terms) && <p className="field__error">{errors.adult || errors.terms}</p>}
                        <p className="reg__otp label">A one-time code is sent to your email after this step.</p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="reg__actions">
                  {step > 0 && (
                    <button type="button" className="btn" onClick={() => setStep(s => s - 1)}>
                      ← Back
                    </button>
                  )}
                  <StarBorder type="submit" className="reg__next reg__star" backgroundColor="#111111" textColor="#ffffff" color="#a8e62e" radius={10} duration={3} stars={step === 2 ? 3 : 1} glow={0.8}>
                    {step === 2 ? 'Print my pass ↗' : 'Continue →'}
                  </StarBorder>
                </div>
              </form>
            ) : (
              <div className="reg__done">
                <p className="label">{status === 'printing' ? 'Printing…' : 'Pass issued'}</p>
                <h2>{status === 'printing' ? 'PRINTING YOUR PASS' : `WELCOME, ${form.name.split(' ')[0].toUpperCase()}.`}</h2>
                <div className="printer">
                  <motion.span
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.3, ease: 'easeInOut' }}
                  />
                </div>
                {status === 'done' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="muted">
                      Your CampusCode ID is <strong className="mono">{id}</strong>. Use it to join events and let teammates find
                      you on HackMate.
                    </p>
                    <button className="btn btn--lime btn--block" onClick={enter}>
                      Enter my dashboard ↗
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </Ticket>
        </motion.section>
      </main>
    </div>
  );
}
