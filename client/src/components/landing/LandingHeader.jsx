import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';

const NAV = [
  { path: '/',         label: 'Home' },
  { path: '/about',    label: 'About' },
  { path: '/features', label: 'Features' },
  { path: '/contact',  label: 'Contact' },
];

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setOpen(false);
  }, [location.pathname]);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-header-inner">
        <Link to="/" className="landing-brand" onClick={handleNavClick}>
          <img src="/logo-gurukul.png" alt="Gurukul" />
          <div>
            <strong>Gurukul</strong>
            <span>English Medium School</span>
          </div>
        </Link>

        <nav className={`landing-nav ${open ? 'open' : ''}`}>
          {NAV.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              onClick={handleNavClick}
              className={location.pathname === n.path ? 'active' : ''}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="landing-actions">
          <Link to="/login" className="btn-login-header" onClick={handleNavClick}>
            <LogIn size={15} /> <span>Login</span>
          </Link>
        </div>

        <button className="landing-menu-btn" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}