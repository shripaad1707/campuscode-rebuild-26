import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import useCountdown from '../useCountdown.js';

const KEY = 'cc-submission';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage off */ } };

const isGit = v => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/i.test(v.trim());
const isUrl = v => /^https:\/\/[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.trim());

// Round submission desk: checklist, validated links, note, submit + edit.
export default function SubmitDesk({ event, user, notify }) {
  const [sub, setSub] = useState(load);
  const [editing, setEditing] = useState(!load());
  const [f, setF] = useState(() => load() || { git: '', demo: '', note: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const cd = useCountdown(event.ends);
  const inviteCode = `INV-${user.id.slice(-4)}-R2`;

  useEffect(() => save(sub), [sub]);

  const checks = [
    { k: 'GitHub repository', ok: isGit(f.git) },
    { k: 'Live demo link', ok: isUrl(f.demo) },
    { k: 'Note for organizer', ok: f.note.trim().length >= 20 },
    { k: 'Team leader approval', ok: !!sub }
  ];
  const done = checks.filter(c => c.ok).length;

  const submit = e => {
    e.preventDefault();
    const x = {};
    if (!isGit(f.git)) x.git = 'Use a github.com/user/repo link';
    if (!isUrl(f.demo)) x.demo = 'Use a full https:// link';
    if (f.note.trim().length < 20) x.note = 'Write at least 20 characters';
    setErr(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    setTimeout(() => {
      const v = { ...f, at: new Date().toISOString() };
      setSub(v);
      setBusy(false);
      setEditing(false);
      notify(`${event.title} · Round 2 submitted`);
    }, 900);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(inviteCode); } catch { /* clipboard blocked */ }
    notify(`Invite code ${inviteCode} copied`);
  };

  const set = k => e => { setF(s => ({ ...s, [k]: e.target.value })); setErr(x => ({ ...x, [k]: undefined })); };

  return (
    <section className="panel desk" id="submit">
      <div className="panel__head">
        <p className="label">Submission desk · {event.title} · Round 2</p>
        <span className={`status ${sub ? 'status--open' : cd.done ? 'status--soon' : 'status--live'}`}>
          {sub ? 'Submitted' : cd.done ? 'Closed' : `Closes in ${cd.d ? cd.d + 'd ' : ''}${cd.h}h ${cd.m}m`}
        </span>
      </div>

      <div className="desk__grid">
        <aside className="desk__side">
          <p className="label">Checklist · {done}/{checks.length}</p>
          <div className="desk__bar"><motion.span animate={{ width: `${(done / checks.length) * 100}%` }} transition={{ duration: 0.5 }} /></div>
          <ul className="desk__checks">
            {checks.map(c => (
              <li key={c.k} className={c.ok ? 'is-ok' : ''}>
                <motion.span className="desk__tick" animate={{ scale: c.ok ? [1.3, 1] : 1 }}>{c.ok ? '✓' : ''}</motion.span>
                {c.k}
              </li>
            ))}
          </ul>

          <div className="desk__team">
            <p className="label">{user.team}</p>
            <div className="desk__member">
              <span className="me__avatar">{user.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
              <div><strong>{user.name}</strong><p className="label">Team leader</p></div>
            </div>
            <button className="desk__invite" onClick={copy}>
              <span className="label">Invite teammate</span>
              <span className="mono">{inviteCode}</span>
              <span className="purple">Copy</span>
            </button>
          </div>
        </aside>

        <AnimatePresence mode="wait">
          {editing ? (
            <motion.form key="form" className="desk__form" onSubmit={submit} noValidate initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <label className="dfield">
                <span className="label">GitHub repository URL *</span>
                <input value={f.git} onChange={set('git')} placeholder="https://github.com/username/project" className={err.git ? 'is-err' : ''} />
                {err.git && <small>{err.git}</small>}
              </label>
              <label className="dfield">
                <span className="label">Live demo URL *</span>
                <input value={f.demo} onChange={set('demo')} placeholder="https://your-project.vercel.app" className={err.demo ? 'is-err' : ''} />
                {err.demo && <small>{err.demo}</small>}
              </label>
              <label className="dfield">
                <span className="label">Note for organizer * <em>{f.note.length}/600</em></span>
                <textarea rows={3} maxLength={600} value={f.note} onChange={set('note')} placeholder="What did your team build?" className={err.note ? 'is-err' : ''} />
                {err.note && <small>{err.note}</small>}
              </label>
              <div className="desk__actions">
                {sub && <button type="button" className="btn" onClick={() => { setF(sub); setEditing(false); }}>Cancel</button>}
                <button className="btn btn--lime desk__submit" disabled={busy}>{busy ? 'Submitting…' : sub ? 'Update submission ↗' : 'Submit Round 2 ↗'}</button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="done" className="desk__done" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <motion.div className="desk__seal" initial={{ scale: 1.8, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                RECEIVED
              </motion.div>
              <p className="label">Submitted {new Date(sub.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
              <a className="desk__link" href={sub.git} target="_blank" rel="noreferrer"><span className="label">Repo</span>{sub.git.replace('https://', '')} ↗</a>
              <a className="desk__link" href={sub.demo} target="_blank" rel="noreferrer"><span className="label">Demo</span>{sub.demo.replace('https://', '')} ↗</a>
              <p className="muted desk__note">“{sub.note}”</p>
              <button className="btn" onClick={() => setEditing(true)} disabled={cd.done}>Edit submission</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
