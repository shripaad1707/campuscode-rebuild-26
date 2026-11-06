import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { demoUser, events as seedEvents } from './data/events.js';

// --- tiny hash router: #/login, #/register, #/dashboard/events ...
const getPath = () => window.location.hash.replace(/^#/, '') || '/';
export const go = path => {
  window.location.hash = path;
};

// --- localStorage helpers (wrapped in try/catch so private mode never crashes)
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

export default function App() {
  const [path, setPath] = useState(getPath);
  const [user, setUser] = useState(() => load('cc-user', null));
  const [joined, setJoined] = useState(() =>
    load('cc-joined', seedEvents.filter(e => e.joined).map(e => e.id))
  );

  useEffect(() => {
    const onHash = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => save('cc-user', user), [user]);
  useEffect(() => save('cc-joined', joined), [joined]);

  const signIn = u => setUser({ ...demoUser, ...u });
  const signOut = () => {
    setUser(null);
    go('/');
  };
  const join = id => setJoined(list => (list.includes(id) ? list : [...list, id]));

  // pick the page from the first part of the path
  const [, section = '', tab = 'overview'] = path.split('/');
  let page;
  if (section === 'login') page = <Login onLogin={signIn} />;
  else if (section === 'register') page = <Register onRegister={signIn} />;
  else if (section === 'dashboard')
    page = (
      <Dashboard
        user={user || demoUser}
        tab={tab}
        joined={joined}
        onJoin={join}
        onLogout={signOut}
      />
    );
  else page = <Landing user={user} />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {page}
      </motion.div>
    </AnimatePresence>
  );
}
