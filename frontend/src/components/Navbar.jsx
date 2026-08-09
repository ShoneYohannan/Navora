import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sun, Moon, Menu, X, Home, Sparkles, FolderHeart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

/* ─── Animation Variants ─── */
const navItemVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    x: '100%',
    scale: 0.95,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: {
    opacity: 0,
    x: '100%',
    scale: 0.95,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const themeToggleVariants = {
  tap: { scale: 0.85, rotate: 15 },
  hover: { rotate: 360, scale: 1.1 }
};

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
      className="sticky top-0 z-50 transition-all duration-300"
      style={
        darkMode
          ? {
              background: 'rgba(9, 4, 6, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(230, 57, 70, 0.12)',
            }
          : {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            }
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">

        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            whileTap={{ scale: 0.9 }}
          >
            <Compass
              size={26}
              style={{ color: '#E63946' }}
            />
          </motion.div>
          <motion.span
            className="text-lg font-bold tracking-tight"
            style={{ color: darkMode ? '#F8FAFC' : '#0f172a' }}
            whileHover={{ scale: 1.08, letterSpacing: '0.05em' }}
            transition={{ duration: 0.3 }}
          >
            Navora
          </motion.span>
        </Link>

        {/* ── Desktop Nav Items (right-aligned) ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item, index) => {
            const isActive = getIsActive(item.to);
            const Icon = item.icon;
            return (
              <React.Fragment key={item.to}>
                {index > 0 && <Separator />}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 relative"
                    style={
                      isActive
                        ? {
                            color: '#E63946',
                            background: darkMode ? 'rgba(230, 57, 70, 0.12)' : 'rgba(230, 57, 70, 0.08)',
                          }
                        : {
                            color: darkMode ? '#7A6672' : '#475569',
                          }
                    }
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                    {!isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E63946] to-[#800020] origin-center rounded-full"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    )}
                  </Link>
                </motion.div>
              </React.Fragment>
            );
          })}

          {/* Divider */}
          <div
            className="w-px h-5 mx-3"
            style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
          />

          {/* Theme Toggle */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl transition-all duration-200"
            style={
              darkMode
                ? {
                    background: 'rgba(255,255,255,0.05)',
                    color: '#FF6B74',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }
                : {
                    background: 'rgba(0,0,0,0.05)',
                    color: '#E63946',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }
            }
            variants={themeToggleVariants}
            whileTap="tap"
            whileHover="hover"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={darkMode ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Mobile Controls ── */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl transition-colors"
            style={
              darkMode
                ? { background: 'rgba(255,255,255,0.05)', color: '#FF6B74', border: '1px solid rgba(255,255,255,0.07)' }
                : { background: 'rgba(0,0,0,0.05)', color: '#E63946', border: '1px solid rgba(0,0,0,0.08)' }
            }
            variants={themeToggleVariants}
            whileTap="tap"
            whileHover="hover"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={darkMode ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl transition-colors"
            style={
              darkMode
                ? { background: 'rgba(255,255,255,0.05)', color: 'var(--lux-text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }
                : { background: 'rgba(0,0,0,0.05)', color: '#475569', border: '1px solid rgba(0,0,0,0.08)' }
            }
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu */}
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 p-4 flex flex-col gap-1 z-40"
              style={{
                background: 'rgba(17, 24, 39, 0.98)',
                borderTop: '1px solid rgba(201, 168, 76, 0.1)',
                backdropFilter: 'blur(24px)',
              }}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {NAV_ITEMS.map((item, index) => {
                const isActive = getIsActive(item.to);
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
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
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
