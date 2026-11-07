import Logo from './Logo.jsx';
import Magnet from './rb/Magnet.jsx';
import StarBorder from './rb/StarBorder.jsx';

export default function Nav({ user }) {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Logo />
        <nav className="nav__links" aria-label="Main">
          <a href="#/" onClick={e => scrollTo(e, 'departures')}>Events</a>
          <a href="#/" onClick={e => scrollTo(e, 'route')}>How it works</a>
          <a href="#/" onClick={e => scrollTo(e, 'tracks')}>Tracks</a>
          <a href="#/" onClick={e => scrollTo(e, 'stamps')}>Platform</a>
        </nav>
        <div className="nav__actions">
          {user ? (
            <a className="btn btn--dark" href="#/dashboard">My dashboard ↗</a>
          ) : (
            <>
              <a className="btn btn--ghost" href="#/login">Login</a>
              <Magnet padding={40} magnetStrength={4}>
                <StarBorder as="a" href="#/register" className="nav__star" backgroundColor="#111111" textColor="#ffffff" color="#a8e62e" radius={10} duration={3.2} glow={0.8} stars={2}>
                  Join CampusCode ↗
                </StarBorder>
              </Magnet>
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
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
