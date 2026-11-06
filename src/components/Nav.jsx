import Logo from './Logo.jsx';

export default function Nav({ user }) {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Logo />
        <nav className="nav__links" aria-label="Main">
          <a href="#/" onClick={e => scrollTo(e, 'departures')}>Events</a>
          <a href="#/" onClick={e => scrollTo(e, 'route')}>How it works</a>
          <a href="#/" onClick={e => scrollTo(e, 'stamps')}>Platform</a>
        </nav>
        <div className="nav__actions">
          {user ? (
            <a className="btn btn--dark" href="#/dashboard">My dashboard ↗</a>
          ) : (
            <>
              <a className="btn btn--ghost" href="#/login">Login</a>
              <a className="btn btn--dark" href="#/register">Join CampusCode ↗</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// smooth-scroll to a landing section (and stay on the landing route)
function scrollTo(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
