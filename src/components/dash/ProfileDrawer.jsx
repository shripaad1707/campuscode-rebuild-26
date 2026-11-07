import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const PREFS = 'cc-prefs';
const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(PREFS)) || null; } catch { return null; } };

// Slide-in drawer: edit profile (updates the Digital ID live) and notification settings.
export default function ProfileDrawer({ open, onClose, user, onSave, notify }) {
  const [f, setF] = useState(user);
  const [prefs, setPrefs] = useState(() => loadPrefs() || { email: true, reminders: true, hackmate: false });

  useEffect(() => { if (open) setF(user); }, [open, user]);
  useEffect(() => { try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch { /* storage off */ } }, [prefs]);
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const valid = f.name.trim().length >= 3 && f.college.trim().length >= 2;

  const save = e => {
    e.preventDefault();
    if (!valid) return;
    onSave({ ...f, name: f.name.trim(), college: f.college.trim(), team: f.team.trim() || user.team });
    onClose();
    notify('Profile saved · Digital ID updated');
  };

  const toggles = [
    { k: 'email', t: 'Email updates', d: 'Results, shortlists and certificates' },
    { k: 'reminders', t: 'Deadline reminders', d: '24h and 1h before a round closes' },
    { k: 'hackmate', t: 'Visible on HackMate', d: 'Let other builders find you by skill' }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.aside
            className="drawer__panel"
            role="dialog"
            aria-label="Edit profile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="drawer__head">
              <div>
                <p className="label">Settings</p>
                <h2>YOUR PROFILE.</h2>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>

            <form onSubmit={save} className="drawer__form">
              <div className="drawer__preview">
                <span className="me__avatar me__avatar--lg">{f.name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'}</span>
                <div>
                  <strong>{f.name || 'Your name'}</strong>
                  <p className="label">{f.college || 'College'} · {f.year}</p>
                  <p className="label purple">{user.id}</p>
                </div>
              </div>

              <label className="dfield"><span className="label">Full name</span><input value={f.name} onChange={set('name')} /></label>
              <label className="dfield"><span className="label">College</span><input value={f.college} onChange={set('college')} /></label>
              <div className="drawer__row">
                <label className="dfield"><span className="label">Year</span>
                  <select value={f.year} onChange={set('year')}>
                    {['1st year', '2nd year', '3rd year', '4th year', 'Graduate'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </label>
                <label className="dfield"><span className="label">Team</span><input value={f.team} onChange={set('team')} /></label>
              </div>
              <label className="dfield"><span className="label">Email</span><input value={f.email} disabled /></label>

              <p className="label drawer__sub">Notifications</p>
              {toggles.map(t => (
                <button type="button" key={t.k} className="tgl" role="switch" aria-checked={prefs[t.k]} onClick={() => setPrefs(p => ({ ...p, [t.k]: !p[t.k] }))}>
                  <span><strong>{t.t}</strong><small>{t.d}</small></span>
                  <span className={`tgl__track ${prefs[t.k] ? 'is-on' : ''}`}><motion.span layout className="tgl__dot" transition={{ type: 'spring', stiffness: 500, damping: 30 }} /></span>
                </button>
              ))}

              <div className="drawer__actions">
                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                <button className="btn btn--dark" disabled={!valid}>Save changes</button>
              </div>
            </form>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
