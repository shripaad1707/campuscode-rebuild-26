import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from '../components/Logo.jsx';
import Ticket from '../components/Ticket.jsx';
import Barcode from '../components/Barcode.jsx';
import QR from '../components/QR.jsx';
import useCountdown from '../components/useCountdown.js';
import CountUp from '../components/rb/CountUp.jsx';
import SpotlightCard from '../components/rb/SpotlightCard.jsx';
import { events, notifications, TRACKS, PHASE_LABEL, fmtDate, fmtTime } from '../data/events.js';
import { go } from '../App.jsx';

const EASE = [0.16, 1, 0.3, 1];
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'my-events', label: 'My events' },
  { id: 'events', label: 'Events' }
];

export default function Dashboard({ user, tab, joined, onJoin, onLogout }) {
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(null); // event shown in the details modal

  const mine = events.filter(e => joined.includes(e.id));
  const current = TABS.some(t => t.id === tab) ? tab : 'overview';

  // show a toast for 3 seconds
  const notify = (text, action) => {
    setToast({ text, action, key: Date.now() });
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const register = e => {
    onJoin(e.id);
    setOpen(null);
    notify(`${e.title} added to My events`, { label: 'View', to: '/dashboard/my-events' });
  };

  return (
    <div className="dash">
      <TopBar user={user} current={current} myCount={mine.length} onLogout={onLogout} />

      <main className="wrap dash__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {current === 'overview' && <Overview user={user} mine={mine} joined={joined} onOpen={setOpen} notify={notify} />}
            {current === 'my-events' && <MyEvents mine={mine} notify={notify} />}
            {current === 'events' && <Events joined={joined} onOpen={setOpen} onRegister={register} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {open && <EventModal event={open} joined={joined.includes(open.id)} onClose={() => setOpen(null)} onRegister={register} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="dot dot--live" /> {toast.text}
            {toast.action && (
              <button onClick={() => go(toast.action.to)} className="toast__action">
                {toast.action.label} ↗
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Top bar with tabs, notifications, profile ---------------- */
function TopBar({ user, current, myCount, onLogout }) {
  const [menu, setMenu] = useState(null); // 'bell' | 'me' | null
  const ref = useRef(null);

  // close dropdowns when clicking outside
  useEffect(() => {
    const close = e => ref.current && !ref.current.contains(e.target) && setMenu(null);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <header className="topbar">
      <div className="wrap topbar__inner" ref={ref}>
        <Logo href="#/dashboard" />

        <nav className="tabs" aria-label="Dashboard">
          {TABS.map(t => (
            <a key={t.id} href={`#/dashboard/${t.id}`} className={`tabs__item ${current === t.id ? 'is-on' : ''}`}>
              {current === t.id && <motion.span layoutId="tab-pill" className="tabs__pill" transition={{ duration: 0.4, ease: EASE }} />}
              <span className="tabs__text">
                {t.label}
                {t.id === 'my-events' && <em>{myCount}</em>}
              </span>
            </a>
          ))}
        </nav>

        <div className="topbar__right">
          <div className="pop-wrap">
            <button className="icon-btn" aria-label="Notifications" onClick={() => setMenu(m => (m === 'bell' ? null : 'bell'))}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="icon-btn__badge">{notifications.length}</span>
            </button>
            <AnimatePresence>
              {menu === 'bell' && (
                <motion.div className="pop" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <p className="label pop__head">Notifications</p>
                  {notifications.map(n => (
                    <div key={n.id} className="pop__item">
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.body}</p>
                      </div>
                      <span className="label">{n.time}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pop-wrap">
            <button className="me" onClick={() => setMenu(m => (m === 'me' ? null : 'me'))}>
              <span className="me__avatar">{initials}</span>
              <span className="me__text">
                <strong>{user.name.split(' ')[0]}</strong>
                <small className="label">{user.id}</small>
              </span>
            </button>
            <AnimatePresence>
              {menu === 'me' && (
                <motion.div className="pop pop--sm" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <p className="label pop__head">{user.email}</p>
                  <a className="pop__link" href="#/dashboard/overview">Digital ID</a>
                  <a className="pop__link" href="#/">Back to website</a>
                  <button className="pop__link pop__link--danger" onClick={onLogout}>Log out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- OVERVIEW ---------------- */
function Overview({ user, mine, onOpen, notify, joined }) {
  const live = mine.find(e => e.phase === 'live');
  const stats = [
    { l: 'Registered', v: mine.length, n: 'Passes in your wallet' },
    { l: 'Live now', v: mine.filter(e => e.phase === 'live').length, n: 'Rounds running' },
    { l: 'Upcoming', v: mine.filter(e => e.phase === 'upcoming' || e.phase === 'open').length, n: 'Starting soon' },
    { l: 'Certificates', v: mine.filter(e => e.phase === 'completed').length, n: 'Ready to download' }
  ];
  const recommended = events.filter(e => !joined.includes(e.id) && e.phase === 'open').slice(0, 2);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <PageHead
        n="04"
        label={`Student dashboard · ${today}`}
        title={
          <>
            WELCOME BACK, <em>{user.name.split(' ')[0].toUpperCase()}.</em>
          </>
        }
        right={
          <div className="head-meta">
            <span className="chip chip--static">Team · {user.team}</span>
            <span className="chip chip--static">{user.role}</span>
          </div>
        }
      />

      <div className="ov-grid">
        {live ? <LivePass event={live} /> : <div className="empty">No live events right now.</div>}
        <IdCard user={user} notify={notify} />
      </div>

      <div className="stats">
        {stats.map(s => (
          <SpotlightCard key={s.l} className="stat" theme="light" spotlightColor="#7665ff" intensity={0.35} spotlightSize={200}>
            <p className="label">{s.l}</p>
            <p className="stat__value">
              <CountUp to={s.v} duration={1.2} />
            </p>
            <p className="stat__note">{s.n}</p>
          </SpotlightCard>
        ))}
      </div>

      <div className="ov-grid ov-grid--even">
        <section className="panel">
          <div className="panel__head">
            <p className="label">Up next</p>
            <a className="link" href="#/dashboard/my-events">All my events ↗</a>
          </div>
          <ol className="agenda">
            {[
              { d: '07 NOV', t: '8:00 PM', title: "ReBuild '26 · Round 2 submission", tag: 'Deadline', hot: true },
              { d: '09 NOV', t: 'All day', title: 'Round 3 interview shortlist', tag: 'Results' },
              { d: '10 NOV', t: '10:00 AM', title: 'Participation certificates issued', tag: 'Certificate' },
              { d: '14 NOV', t: '6:00 PM', title: "FirstCommit '26 Quiz · Prelims", tag: 'Event' }
            ].map(a => (
              <li key={a.title} className={a.hot ? 'is-hot' : ''}>
                <span className="agenda__date mono">{a.d}</span>
                <span className="agenda__line" />
                <div>
                  <strong>{a.title}</strong>
                  <p className="label">
                    {a.t} · {a.tag}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel">
          <div className="panel__head">
            <p className="label">Recommended for you</p>
            <a className="link" href="#/dashboard/events">Browse events ↗</a>
          </div>
          <div className="reco">
            {recommended.length ? (
              recommended.map(e => (
                <button key={e.id} className="reco__item" onClick={() => onOpen(e)}>
                  <div>
                    <p className="label">{e.track} · {fmtDate(e.starts)}</p>
                    <strong>{e.title}</strong>
                    <p className="muted">{e.perk}</p>
                  </div>
                  <span className="reco__go">↗</span>
                </button>
              ))
            ) : (
              <p className="muted">You've joined every open event. Nice.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

// The featured live event as a big boarding pass with a live countdown
function LivePass({ event }) {
  const t = useCountdown(event.ends);
  return (
    <Ticket
      className="livepass lift"
      stub={
        <div className="livepass__stub">
          <p className="label">Round closes in</p>
          <div className="clock">
            {[
              [t.d, 'D'],
              [t.h, 'H'],
              [t.m, 'M'],
              [t.s, 'S']
            ].map(([v, u]) => (
              <div key={u}>
                <strong>{v}</strong>
                <span className="label">{u}</span>
              </div>
            ))}
          </div>
          <p className="label">
            {fmtDate(event.ends)} · {fmtTime(event.ends)} IST
          </p>
          <a className="btn btn--lime btn--block" href="#/dashboard/my-events">Open event ↗</a>
        </div>
      }
    >
      <div className="livepass__top">
        <span className="status status--live">● {PHASE_LABEL.live}</span>
        <span className="label">{event.host}</span>
      </div>
      <h2 className="livepass__title">{event.title.toUpperCase()}</h2>
      <p className="muted">{event.tagline}</p>
      <Rounds rounds={event.rounds} />
      <dl className="meta">
        <div><dt className="label">Mode</dt><dd>{event.mode}</dd></div>
        <div><dt className="label">Team</dt><dd>{event.team}</dd></div>
        <div><dt className="label">Prize</dt><dd>{event.perk}</dd></div>
      </dl>
    </Ticket>
  );
}

function Rounds({ rounds }) {
  if (!rounds.length) return null;
  return (
    <ol className="rounds">
      {rounds.map(r => (
        <li key={r.name} className={`rounds__item rounds__item--${r.state}`}>
          <span className="rounds__dot">{r.state === 'done' ? '✓' : ''}</span>
          <span className="label">{r.state === 'live' ? 'Now' : r.state === 'done' ? 'Done' : 'Next'}</span>
          <strong>{r.name}</strong>
        </li>
      ))}
    </ol>
  );
}

// Digital ID card — click to flip and see the back
function IdCard({ user, notify }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="idcard-wrap">
      <motion.div
        className="idcard"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        aria-label="Flip Digital ID"
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}
      >
        <div className="idcard__face idcard__front">
          <div className="idcard__head">
            <span className="label">Digital ID</span>
            <span className="label purple">{user.role}</span>
          </div>
          <p className="idcard__name">{user.name}</p>
          <p className="label">{user.college} · {user.year}</p>
          <div className="idcard__row">
            <div>
              <p className="label">CampusCode ID</p>
              <p className="mono idcard__id">{user.id}</p>
            </div>
            <QR value={user.id + user.name} size={84} />
          </div>
          <p className="label idcard__hint">Tap to flip ↻</p>
        </div>
        <div className="idcard__face idcard__back">
          <Logo href="#/dashboard" />
          <p className="label">Present this ID at check-in. Teammates can find you on HackMate with your CampusCode ID.</p>
          <Barcode value={user.id} height={44} />
          <p className="label">Valid · 2026–27</p>
        </div>
      </motion.div>
      <button className="btn btn--block" onClick={() => notify('Digital ID saved to downloads')}>
        Download ID ↓
      </button>
    </div>
  );
}

/* ---------------- MY EVENTS ---------------- */
const MY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' }
];

function MyEvents({ mine, notify }) {
  const [filter, setFilter] = useState('all');
  const list = mine.filter(e =>
    filter === 'all' ? true : filter === 'upcoming' ? e.phase === 'upcoming' || e.phase === 'open' : e.phase === filter
  );

  return (
    <>
      <PageHead
        n="05"
        label="Your wallet"
        title="MY EVENTS."
        right={
          <div className="bigcount">
            <strong>{String(mine.length).padStart(2, '0')}</strong>
            <span className="label">Passes</span>
          </div>
        }
      />
      <div className="toolbar">
        <div className="chips">
          {MY_FILTERS.map(f => (
            <button key={f.id} className={`chip ${filter === f.id ? 'is-on' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <a className="btn btn--sm" href="#/dashboard/events">+ Find more events</a>
      </div>

      <motion.div layout className="wallet">
        <AnimatePresence mode="popLayout">
          {list.map((e, i) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
            >
              <WalletPass event={e} notify={notify} />
            </motion.div>
          ))}
        </AnimatePresence>
        {!list.length && (
          <div className="empty">
            <p className="label">Nothing here</p>
            <p>No {filter} events in your wallet yet.</p>
            <a className="btn btn--dark" href="#/dashboard/events">Browse events ↗</a>
          </div>
        )}
      </motion.div>
    </>
  );
}

function WalletPass({ event: e, notify }) {
  const cls = { live: 'live', open: 'open', upcoming: 'soon', completed: 'done' }[e.phase];
  const action = {
    live: ['Open event ↗', 'btn--lime', `Opening ${e.title}…`],
    open: ['Add to calendar', '', 'Added to your calendar'],
    upcoming: ['Add to calendar', '', 'Added to your calendar'],
    completed: ['View certificate', 'btn--dark', 'Certificate opened in a new tab']
  }[e.phase];

  return (
    <Ticket
      className={`wpass wpass--${e.phase}`}
      stub={
        <div className="wpass__stub">
          <p className="label">{e.phase === 'completed' ? 'Ended' : e.phase === 'live' ? 'Closes' : 'Starts'}</p>
          <p className="wpass__date">{fmtDate(e.phase === 'live' ? e.ends : e.starts)}</p>
          <p className="label">{fmtTime(e.phase === 'live' ? e.ends : e.starts)}</p>
          <button className={`btn btn--sm btn--block ${action[1]}`} onClick={() => notify(action[2])}>
            {action[0]}
          </button>
        </div>
      }
    >
      <div className="wpass__top">
        <span className={`status status--${cls}`}>{PHASE_LABEL[e.phase]}</span>
        <span className="label">{e.host} · {e.track}</span>
      </div>
      <h3 className="wpass__title">{e.title}</h3>
      <p className="muted">{e.tagline}</p>
      <div className="progress">
        <div className="progress__bar">
          <motion.span initial={{ width: 0 }} animate={{ width: `${e.progress}%` }} transition={{ duration: 1, ease: EASE, delay: 0.2 }} />
        </div>
        <span className="label">{e.progress}% complete</span>
      </div>
      <Rounds rounds={e.rounds} />
    </Ticket>
  );
}

/* ---------------- EVENTS ---------------- */
function Events({ joined, onOpen, onRegister }) {
  const [q, setQ] = useState('');
  const [track, setTrack] = useState('All');
  const [sort, setSort] = useState('soonest');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = events
      .filter(e => e.phase !== 'completed')
      .filter(e => track === 'All' || e.track === track)
      .filter(e => !term || `${e.title} ${e.track} ${e.host}`.toLowerCase().includes(term));
    const by = {
      soonest: (a, b) => new Date(a.starts) - new Date(b.starts),
      popular: (a, b) => b.registered - a.registered,
      seats: (a, b) => b.seats - b.registered - (a.seats - a.registered)
    }[sort];
    return [...out].sort(by);
  }, [q, track, sort]);

  return (
    <>
      <PageHead
        n="06"
        label="Departures"
        title="EVENTS."
        right={
          <label className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search events, tracks, hosts" aria-label="Search events" />
          </label>
        }
      />

      <div className="toolbar">
        <div className="chips">
          {TRACKS.map(t => (
            <button key={t} className={`chip ${track === t ? 'is-on' : ''}`} onClick={() => setTrack(t)}>
              {t}
            </button>
          ))}
        </div>
        <label className="sort label">
          Sort
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="soonest">Soonest</option>
            <option value="popular">Most popular</option>
            <option value="seats">Most seats left</option>
          </select>
        </label>
      </div>

      <motion.div layout className="event-grid">
        <AnimatePresence mode="popLayout">
          {list.map(e => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <EventPass event={e} joined={joined.includes(e.id)} onOpen={onOpen} onRegister={onRegister} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {!list.length && (
        <div className="empty">
          <p className="label">No matches</p>
          <p>Try another track or search term.</p>
          <button className="btn" onClick={() => { setQ(''); setTrack('All'); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}

function EventPass({ event: e, joined, onOpen, onRegister }) {
  const left = e.seats - e.registered;
  const fill = Math.round((e.registered / e.seats) * 100);
  const cls = { live: 'live', open: 'open', upcoming: 'soon' }[e.phase];
  return (
    <Ticket
      vertical
      className="epass"
      stub={
        <>
          <span className="label">{e.perk}</span>
          {joined ? (
            <span className="epass__joined">Registered ✓</span>
          ) : (
            <button className="btn btn--sm btn--purple" onClick={() => onRegister(e)}>Register</button>
          )}
        </>
      }
    >
      <div className="wpass__top">
        <span className={`status status--${cls}`}>{PHASE_LABEL[e.phase]}</span>
        <span className="label">{e.track}</span>
      </div>
      <button className="epass__title" onClick={() => onOpen(e)}>
        {e.title} <span>↗</span>
      </button>
      <p className="muted epass__tag">{e.tagline}</p>
      <dl className="meta meta--3">
        <div><dt className="label">Date</dt><dd>{fmtDate(e.starts)}</dd></div>
        <div><dt className="label">Mode</dt><dd>{e.mode.split(' · ')[0]}</dd></div>
        <div><dt className="label">Team</dt><dd>{e.team}</dd></div>
      </dl>
      <div className="seats">
        <div className="progress__bar"><span style={{ width: `${fill}%` }} /></div>
        <span className="label">{left > 0 ? `${left} seats left` : 'Full'}</span>
      </div>
    </Ticket>
  );
}

/* ---------------- Event details modal ---------------- */
function EventModal({ event: e, joined, onClose, onRegister }) {
  useEffect(() => {
    const onKey = ev => ev.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal__card lift"
        role="dialog"
        aria-modal="true"
        aria-label={e.title}
        initial={{ y: 40, opacity: 0, rotate: -1 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={ev => ev.stopPropagation()}
      >
        <Ticket
          stub={
            <div className="modal__stub">
              <p className="label">Starts</p>
              <p className="wpass__date">{fmtDate(e.starts)}</p>
              <p className="label">{fmtTime(e.starts)}</p>
              <Barcode value={e.id} height={40} />
              {joined ? (
                <span className="epass__joined">Registered ✓</span>
              ) : (
                <button className="btn btn--purple btn--block" onClick={() => onRegister(e)}>Register ↗</button>
              )}
            </div>
          }
        >
          <div className="wpass__top">
            <span className="label">{e.host}</span>
            <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <h2 className="modal__title">{e.title.toUpperCase()}</h2>
          <p className="muted">{e.tagline}</p>
          <dl className="meta meta--2">
            <div><dt className="label">Track</dt><dd>{e.track}</dd></div>
            <div><dt className="label">Mode</dt><dd>{e.mode}</dd></div>
            <div><dt className="label">Team size</dt><dd>{e.team}</dd></div>
            <div><dt className="label">Prize</dt><dd>{e.perk}</dd></div>
            <div><dt className="label">Ends</dt><dd>{fmtDate(e.ends)} · {fmtTime(e.ends)}</dd></div>
            <div><dt className="label">Seats</dt><dd>{e.registered} / {e.seats}</dd></div>
          </dl>
        </Ticket>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- shared page head ---------------- */
function PageHead({ n, label, title, right }) {
  return (
    <div className="phead">
      <p className="label phead__label">
        <span className="purple">{n}</span> &nbsp; {label}
      </p>
      <div className="phead__row">
        <h1>{title}</h1>
        {right}
      </div>
    </div>
  );
}
