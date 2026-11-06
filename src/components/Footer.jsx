import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>The student hackathon arena. You build the idea, we run the competition.</p>
        </div>
        <div>
          <p className="label">Product</p>
          <a href="#/">Events</a>
          <a href="#/">How it works</a>
          <a href="#/">Platform</a>
        </div>
        <div>
          <p className="label">Builders</p>
          <a href="#/register">Students</a>
          <a href="#/register">Organisers</a>
          <a href="#/login">Login</a>
        </div>
        <div>
          <p className="label">Guides</p>
          <a href="#/">Hackathon rules</a>
          <a href="#/">FAQ</a>
          <a href="mailto:support@campuscode.co.in">Support</a>
        </div>
      </div>
      <div className="wrap footer__base label">
        <span>© 2026 CampusCode</span>
        <span>Learn · Build · Compete · Ship</span>
        <span>Chennai · India</span>
      </div>
    </footer>
  );
}
