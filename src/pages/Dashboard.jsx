import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from '../components/Logo.jsx';
import Ticket from '../components/Ticket.jsx';
import Barcode from '../components/Barcode.jsx';
import QR from '../components/QR.jsx';
import useCountdown from '../components/useCountdown.js';
import Counter from '../components/rb/Counter.jsx';
import Dock from '../components/rb/Dock.jsx';
import TiltedCard from '../components/rb/TiltedCard.jsx';
import Folder from '../components/rb/Folder.jsx';
import AnimatedList from '../components/rb/AnimatedList.jsx';
import ShinyText from '../components/rb/ShinyText.jsx';
import CommandPalette from '../components/dash/CommandPalette.jsx';
import SubmitDesk from '../components/dash/SubmitDesk.jsx';
import ProfileDrawer from '../components/dash/ProfileDrawer.jsx';
import BlurText from '../components/rb/BlurText.jsx';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon, Ticket01Icon, Calendar03Icon, Notification03Icon, IdIcon, Globe02Icon, Logout01Icon, Certificate01Icon
} from '@hugeicons/core-free-icons';
import SpotlightCard from '../components/rb/SpotlightCard.jsx';
import { events, notifications, TRACKS, PHASE_LABEL, fmtDate, fmtTime } from '../data/events.js';
import { go } from '../App.jsx';

const EASE = [0.16, 1, 0.3, 1];
const ic = icon => <HugeiconsIcon icon={icon} size={22} strokeWidth={1.7} />;
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'my-events', label: 'My events' },
  { id: 'events', label: 'Events' }
];

const SAVED = 'cc-saved';
const loadSaved = () => { try { return JSON.parse(localStorage.getItem(SAVED)) || []; } catch { return []; } };

export default function Dashboard({ user, tab, joined, onJoin, onLogout, onUpdateUser }) {
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(null); // event shown in the details modal
  const [cmd, setCmd] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [saved, setSaved] = useState(loadSaved);

  useEffect(() => { try { localStorage.setItem(SAVED, JSON.stringify(saved)); } catch { /* storage off */ } }, [saved]);
  const toggleSave = e => {
    const on = saved.includes(e.id);
    setSaved(s => (on ? s.filter(x => x !== e.id) : [...s, e.id]));
    notify(on ? `Removed ${e.title} from saved` : `Saved ${e.title} for later`);
  };

  // keyboard: Ctrl/⌘K palette, 1/2/3 tabs
  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(c => !c); return; }
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); setCmd(true); }
      const to = { 1: 'overview', 2: 'my-events', 3: 'events' }[e.key];
      if (to) go(`/dashboard/${to}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

  const commands = [
    { id: 'p-ov', group: 'Go to', label: 'Overview', icon: '⌂', kbd: '1', run: () => go('/dashboard/overview') },
    { id: 'p-my', group: 'Go to', label: 'My events', icon: '◫', kbd: '2', hint: `${mine.length} passes`, run: () => go('/dashboard/my-events') },
    { id: 'p-ev', group: 'Go to', label: 'Events', icon: '✈', kbd: '3', run: () => go('/dashboard/events') },
    { id: 'p-sub', group: 'Go to', label: 'Submission desk', icon: '↥', hint: 'Round 2', run: () => { go('/dashboard/overview'); setTimeout(() => window.__lenis?.scrollTo('#submit', { offset: -100 }), 450); } },
    ...events.filter(e => e.phase !== 'completed').map(e => ({
      id: 'e-' + e.id, group: 'Events', label: e.title, icon: joined.includes(e.id) ? '✓' : '＋', hint: `${e.track} · ${fmtDate(e.starts)}`, run: () => setOpen(e)
    })),
    { id: 'a-prof', group: 'Actions', label: 'Edit profile', icon: '✎', run: () => setDrawer(true) },
    { id: 'a-id', group: 'Actions', label: 'Download Digital ID', icon: '↓', run: () => notify('Digital ID saved to downloads') },
    { id: 'a-web', group: 'Actions', label: 'Back to website', icon: '↗', run: () => go('/') },
    { id: 'a-out', group: 'Actions', label: 'Log out', icon: '⎋', run: onLogout }
  ];

  return (
    <div className="dash">
      <TopBar user={user} current={current} myCount={mine.length} onLogout={onLogout} onCmd={() => setCmd(true)} onProfile={() => setDrawer(true)} />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} commands={commands} />
      <ProfileDrawer open={drawer} onClose={() => setDrawer(false)} user={user} onSave={onUpdateUser} notify={notify} />

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
            {current === 'events' && <Events joined={joined} onOpen={setOpen} onRegister={register} saved={saved} onSave={toggleSave} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="dash__dock">
        <Dock
          theme="light"
          accentColor="#7665ff"
          badgeColor="#7665ff"
          baseItemSize={48}
          magnification={68}
          panelHeight={64}
          items={[
            { label: 'Overview', icon: ic(Home01Icon), active: current === 'overview', onClick: () => go('/dashboard/overview') },
            { label: 'My events', icon: ic(Ticket01Icon), active: current === 'my-events', badge: mine.length || undefined, onClick: () => go('/dashboard/my-events') },
            { label: 'Events', icon: ic(Calendar03Icon), active: current === 'events', onClick: () => go('/dashboard/events') },
            { label: 'Certificates', icon: ic(Certificate01Icon), onClick: () => notify('1 certificate ready · FirstCommit \'26 Quiz 2.0') },
            { label: 'Alerts', icon: ic(Notification03Icon), badge: notifications.length, onClick: () => notify(notifications[0].title + ' · ' + notifications[0].body) },
            { label: 'Profile', icon: ic(IdIcon), onClick: () => setDrawer(true) },
            { label: 'Website', icon: ic(Globe02Icon), onClick: () => go('/') },
            { label: 'Log out', icon: ic(Logout01Icon), onClick: onLogout }
          ]}
        />
      </div>

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
function TopBar({ user, current, myCount, onLogout, onCmd, onProfile }) {
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
          <button className="cmdk-btn" onClick={onCmd} aria-label="Open command palette">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span>Search</span>
            <kbd>Ctrl K</kbd>
          </button>
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
                  <button className="pop__link" onClick={() => { setMenu(null); onProfile(); }}>Edit profile</button>
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
            WELCOME BACK, <em><BlurText text={user.name.split(' ')[0].toUpperCase() + '.'} animateBy="letters" delay={60} className="phead__blur" /></em>
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

      {live && <SubmitDesk event={live} user={user} notify={notify} />}

      <div className="stats">
        {stats.map(s => (
          <SpotlightCard key={s.l} className="stat" theme="light" spotlightColor="#7665ff" intensity={0.35} spotlightSize={200}>
            <p className="label">{s.l}</p>
            <p className="stat__value">
              <Counter value={s.v} fontSize="1em" fontWeight={900} duration={0.9} minDigits={2} />
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
              { d: '08 NOV', t: '11:00 AM', title: "ReBuild '26 · Round 2 submission", tag: 'Extended deadline', hot: true },
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

      <div className="ov-grid ov-grid--even">
        <section className="panel panel--folder">
          <div className="panel__head">
            <p className="label">Certificates folder</p>
            <span className="label purple">Click to open</span>
          </div>
          <div className="certs-stage">
            <Folder
              theme="light"
              color="#7665ff"
              paperColor="#ffffff"
              label="2026"
              size={1.15}
              zoomOnClick={false}
              items={[
                { title: 'FirstCommit Quiz 2.0', description: 'Participation · Verified' },
                { title: "FirstCommit '26 Quiz", description: 'Prelims · Pending' },
                { title: "ReBuild '26", description: 'Round 1 · Shortlisted' }
              ]}
              onItemClick={() => notify('Certificate opened · verification ID CC-26-CERT-0417')}
            />
          </div>
          <p className="muted folder-note">Certificates land here the day results are announced. Each one carries a verifiable ID.</p>
        </section>

        <section className="panel">
          <div className="panel__head">
            <p className="label">Activity</p>
            <span className="label">Hover · arrow keys</span>
          </div>
          <AnimatedList
            theme="light"
            accentColor="#7665ff"
            width="100%"
            maxHeight={300}
            frame={false}
            items={ACTIVITY}
            onItemSelect={item => notify(item.title)}
          />
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
  const front = (
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
      <p className="label idcard__hint">Tilt · click to flip ↻</p>
    </div>
  );
  const back = (
    <div className="idcard__face idcard__back">
      <Logo href="#/dashboard" />
      <p className="label">Present this ID at check-in. Teammates can find you on HackMate with your CampusCode ID.</p>
      <Barcode value={user.id} height={44} />
      <p className="label">Valid · 2026–27</p>
    </div>
  );
  return (
    <div className="idcard-wrap">
      <TiltedCard
        className="idcard-tilt"
        containerWidth="100%"
        containerHeight="300px"
        imageWidth="100%"
        imageHeight="300px"
        radius={2}
        rotateAmplitude={10}
        scaleOnHover={1.03}
        showTooltip={false}
        glare={0.35}
        glareColor="#7665ff"
        shadow={0.25}
        backContent={back}
        flipOnClick
        altText="Digital ID"
      >
        {front}
      </TiltedCard>
      <button className="btn btn--block" onClick={() => notify('Digital ID saved to downloads')}>
        Download ID ↓
      </button>
    </div>
  );
}

const ACTIVITY = [
  { icon: '✦', title: 'Round 2 is live', description: "ReBuild '26 · extended to 11:00 AM, 8 Nov", meta: '2h' },
  { icon: '✓', title: 'Shortlisted for Round 2', description: "ReBuild '26 · Team Inevitable", meta: '1d' },
  { icon: '★', title: 'Certificate issued', description: "FirstCommit '26 Quiz 2.0", meta: '9d' },
  { icon: '↗', title: 'Registered for Quiz prelims', description: "FirstCommit '26 Quiz", meta: '12d' },
  { icon: '⌘', title: 'HackMate match', description: 'A designer from JNTU viewed your ID', meta: '2w' },
  { icon: '◎', title: 'IdeaCheck score: 82', description: 'Your idea looks original', meta: '2w' },
  { icon: '✦', title: 'Welcome to CampusCode', description: 'Your Digital ID was printed', meta: '3w' }
];

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
function Events({ joined, onOpen, onRegister, saved, onSave }) {
  const [q, setQ] = useState('');
  const [track, setTrack] = useState('All');
  const [sort, setSort] = useState('soonest');
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t); }, []);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = events
      .filter(e => e.phase !== 'completed')
      .filter(e => track === 'All' || (track === 'Saved' ? saved.includes(e.id) : e.track === track))
      .filter(e => !term || `${e.title} ${e.track} ${e.host}`.toLowerCase().includes(term));
    const by = {
      soonest: (a, b) => new Date(a.starts) - new Date(b.starts),
      popular: (a, b) => b.registered - a.registered,
      seats: (a, b) => b.seats - b.registered - (a.seats - a.registered)
    }[sort];
    return [...out].sort(by);
  }, [q, track, sort, saved]);

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
          {[...TRACKS, 'Saved'].map(t => (
            <button key={t} className={`chip ${track === t ? 'is-on' : ''} ${t === 'Saved' ? 'chip--saved' : ''}`} onClick={() => setTrack(t)}>
              {t === 'Saved' ? `★ Saved ${saved.length}` : t}
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

      {loading ? (
        <div className="event-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="skel">
              <span className="skel__line skel__line--sm" />
              <span className="skel__line skel__line--lg" />
              <span className="skel__line" />
              <span className="skel__line skel__line--md" />
              <span className="skel__block" />
            </div>
          ))}
        </div>
      ) : (
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
              <EventPass event={e} joined={joined.includes(e.id)} onOpen={onOpen} onRegister={onRegister} isSaved={saved.includes(e.id)} onSave={onSave} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      )}
      {!loading && !list.length && (
        <div className="empty">
          <p className="label">No matches</p>
          <p>Try another track or search term.</p>
          <button className="btn" onClick={() => { setQ(''); setTrack('All'); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}

function EventPass({ event: e, joined, onOpen, onRegister, isSaved, onSave }) {
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
        <span className="epass__right">
          <span className="label">{e.track}</span>
          <motion.button
            className={`save-btn ${isSaved ? 'is-on' : ''}`}
            onClick={() => onSave(e)}
            whileTap={{ scale: 0.8 }}
            aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
            aria-pressed={isSaved}
          >
            <motion.span key={String(isSaved)} initial={{ scale: 0.4, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              {isSaved ? '★' : '☆'}
            </motion.span>
          </motion.button>
        </span>
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
        <h1>{typeof title === 'string' ? <BlurText text={title} animateBy="letters" delay={45} className="phead__blur" /> : title}</h1>
        {right}
      </div>
    </div>
  );
}
