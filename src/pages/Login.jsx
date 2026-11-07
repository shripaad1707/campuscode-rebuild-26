import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from '../components/Logo.jsx';
import Ticket from '../components/Ticket.jsx';
import Barcode from '../components/Barcode.jsx';
import Field from '../components/Field.jsx';
import { useCaptcha } from '../components/Captcha.jsx';
import useCountdown from '../components/useCountdown.js';
import { demoUser, events } from '../data/events.js';
import { go } from '../App.jsx';
import DotGrid from '../components/rb/DotGrid.jsx';
import StarBorder from '../components/rb/StarBorder.jsx';
import DecryptedText from '../components/rb/DecryptedText.jsx';
import ShinyText from '../components/rb/ShinyText.jsx';

const EASE = [0.16, 1, 0.3, 1];
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', captcha: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const captcha = useCaptcha();

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: undefined }));
  };

  const fillDemo = () => {
    setForm({ email: demoUser.email, password: 'rebuild26', captcha: String(captcha.answer) });
    setErrors({});
  };

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (!isEmail(form.email)) er.email = 'Enter a valid email address.';
    if (form.password.length < 6) er.password = 'Password needs at least 6 characters.';
    if (!captcha.check(form.captcha)) er.captcha = 'That answer is not right. Try again.';
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    setTimeout(() => {
      onLogin({ email: form.email });
      go('/dashboard');
    }, 900);
  };

  return (
    <div className="auth page--grid">
      <div className="auth__dots" aria-hidden="true">
        <DotGrid dotSize={3} gap={26} baseColor="#d9d9d2" activeColor="#7665ff" proximity={150} shockRadius={260} shockStrength={4} glow={0.2} />
      </div>
      <header className="auth__bar wrap">
        <Logo />
        <a className="btn btn--ghost" href="#/register">New here? Create a pass ↗</a>
      </header>

      <main className="auth__grid wrap">
        <section className="auth__intro">
          <p className="label">
            <span className="purple">02</span> &nbsp; Pass check
          </p>
          <h1 className="auth__title">
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              CHECK
            </motion.span>
            <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}>
              IN<em>.</em>
            </motion.span>
          </h1>
          <p className="auth__copy">Your rounds, results and certificates are waiting on the other side of this gate.</p>
          <Waiting />
        </section>

        <motion.section
          className="lift"
          initial={{ opacity: 0, y: 30, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <Ticket
            vertical
            className="auth__ticket"
            stub={
              <>
                <span className="label">Gate 02 · Login</span>
                <Barcode value={form.email || 'CHECK-IN'} height={34} />
              </>
            }
          >
            <form onSubmit={submit} noValidate>
              <div className="auth__ticket-head">
                <div>
                  <p className="label">Boarding pass</p>
                  <h2><DecryptedText text="LOGIN" animateOn="view" sequential revealDirection="start" speed={60} characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#" /></h2>
                </div>
                <button type="button" className="chip" onClick={fillDemo}>Use demo account</button>
              </div>

              <Field label="Email address" type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              <Field label="Password" type="password" placeholder="Your password" value={form.password} onChange={set('password')} error={errors.password} autoComplete="current-password" hint={<a href="#/login" onClick={e => { e.preventDefault(); setForgot(true); }}>Forgot?</a>} />
              <Field
                label={`Quick check · what is ${captcha.question}?`}
                inputMode="numeric"
                placeholder="Answer"
                value={form.captcha}
                onChange={set('captcha')}
                error={errors.captcha}
                right={<button type="button" className="field__toggle label" onClick={captcha.refresh}>↻ New</button>}
              />

              <label className="check">
                <input type="checkbox" defaultChecked /> <span>Keep me signed in</span>
              </label>

              <StarBorder type="submit" className="auth__submit auth__star" disabled={loading} backgroundColor="#111111" textColor="#ffffff" color="#a8e62e" radius={10} duration={3} stars={2} glow={0.8}>
                {loading ? 'Checking you in…' : 'Check in ↗'}
              </StarBorder>

              <p className="auth__switch">
                No pass yet? <a href="#/register">Register as a builder</a>
              </p>
            </form>
          </Ticket>
        </motion.section>
      </main>
      <ForgotModal open={forgot} onClose={() => setForgot(false)} initial={form.email} />
    </div>
  );
}

// "What's waiting for you" — live countdown to the current round
function Waiting() {
  const live = events.find(e => e.phase === 'live');
  const t = useCountdown(live.ends);
  return (
    <div className="waiting">
      <div className="waiting__item">
        <span className="dot dot--live" />
        <div>
          <p className="waiting__title"><ShinyText text={`${live.title} · Round 2 closes in`} color="#111111" shineColor="#7665ff" speed={2.6} /></p>
          <p className="waiting__time mono">
            {t.d}D {t.h}:{t.m}:{t.s}
          </p>
        </div>
      </div>
      <div className="waiting__item">
        <span className="dot" />
        <div>
          <p className="waiting__title">1 certificate ready to download</p>
          <p className="label">FirstCommit '26 Quiz 2.0</p>
        </div>
      </div>
      <div className="waiting__item">
        <span className="dot" />
        <div>
          <p className="waiting__title">3 new events this month</p>
          <p className="label">AI · Web · Design</p>
        </div>
      </div>
    </div>
  );
}

function ForgotModal({ open, onClose, initial }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [err, setErr] = useState('');
  useEffect(() => { if (open) { setEmail(initial || ''); setState('idle'); setErr(''); } }, [open, initial]);
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  const send = e => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Enter the email you registered with');
    setState('sending');
    setTimeout(() => setState('sent'), 1000);
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmdk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div className="forgot" role="dialog" aria-label="Reset password" onMouseDown={e => e.stopPropagation()}
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="forgot__head">
              <p className="label">Lost boarding pass</p>
              <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <AnimatePresence mode="wait">
              {state !== 'sent' ? (
                <motion.form key="f" onSubmit={send} className="forgot__body" exit={{ opacity: 0, x: -10 }}>
                  <h2>RESET PASSWORD.</h2>
                  <p className="muted">We will email you a secure link to set a new password. It expires in 30 minutes.</p>
                  <label className="dfield">
                    <span className="label">Email</span>
                    <input autoFocus value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} placeholder="you@college.edu" className={err ? 'is-err' : ''} />
                    {err && <small>{err}</small>}
                  </label>
                  <button className="btn btn--dark btn--block" disabled={state === 'sending'}>{state === 'sending' ? 'Sending link…' : 'Send reset link ↗'}</button>
                </motion.form>
              ) : (
                <motion.div key="s" className="forgot__body" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <motion.div className="forgot__ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>✓</motion.div>
                  <h2>CHECK YOUR INBOX.</h2>
                  <p className="muted">If an account exists for <strong>{email}</strong>, a reset link is on its way.</p>
                  <button className="btn btn--block" onClick={onClose}>Back to check-in</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
