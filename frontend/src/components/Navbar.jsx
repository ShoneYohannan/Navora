import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sun, Moon, Menu, X, Home, Sparkles, FolderHeart, MessageSquare } from 'lucide-react';

/* ── All top-level nav destinations ── */
const NAV_ITEMS = [
  { to: '/',             label: 'Home',         icon: Home },
  { to: '/results?destination=kochi', label: 'Explore', icon: Sparkles },
  { to: '/saved-trips',  label: 'Saved Trips',  icon: FolderHeart },
  { to: '/assistant',    label: 'AI Assistant', icon: MessageSquare },
];

/* ── Luxury slash separator ── */
const Separator = () => (
  <li aria-hidden="true" className="select-none flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-3 h-3"
      style={{ color: 'var(--lux-text-muted)' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 20.247 6-16.5" />
    </svg>
  </li>
);

const Navbar = () => {
  /* Default to DARK (luxury theme) */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light'; // dark unless explicitly set to light
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  /* Apply dark class to <html> */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  /* Determine active nav item */
  const getIsActive = (to) => {
    const path = to.split('?')[0];
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-colors"
      style={{
        background: 'rgba(11, 15, 23, 0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">

        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div
            className="p-2 rounded-xl text-white shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]"
            style={{ background: 'linear-gradient(135deg, #E63946 0%, #800020 100%)' }}
          >
            <Compass size={22} className="animate-spin-slow" />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--lux-text-primary)' }}>
            Navora
            <span style={{ background: 'linear-gradient(90deg, #FF6B74, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}Trip Planner
            </span>
          </span>
        </Link>

        {/* ── Desktop Nav Items (right-aligned) ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item, index) => {
            const isActive = getIsActive(item.to);
            const Icon = item.icon;
            return (
              <React.Fragment key={item.to}>
                {index > 0 && <Separator />}
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={
                    isActive
                      ? {
                          color: 'var(--lux-gold-light)',
                          background: 'var(--lux-gold-dim)',
                        }
                      : {
                          color: 'var(--lux-text-secondary)',
                        }
                  }
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--lux-gold-light)';
                      e.currentTarget.style.background = 'var(--lux-gold-dim)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--lux-text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}

          {/* Divider */}
          <div
            className="w-px h-5 mx-3"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--lux-text-secondary)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--lux-gold-dim)';
              e.currentTarget.style.color = 'var(--lux-gold-light)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'var(--lux-text-secondary)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* ── Mobile Controls ── */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--lux-text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--lux-text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 p-4 flex flex-col gap-1 z-40"
          style={{
            background: 'rgba(17, 24, 39, 0.98)',
            borderTop: '1px solid rgba(201, 168, 76, 0.1)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = getIsActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={
                  isActive
                    ? { color: 'var(--lux-gold-light)', background: 'var(--lux-gold-dim)' }
                    : { color: 'var(--lux-text-secondary)' }
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
