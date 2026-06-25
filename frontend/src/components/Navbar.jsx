import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Compass, Sparkles, FolderHeart, MessageSquare, Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/results?destination=kochi', label: 'Explore', icon: Sparkles },
    { to: '/saved-trips', label: 'Saved Trips', icon: FolderHeart },
    { to: '/assistant', label: 'AI Assistant', icon: MessageSquare }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-navbar transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-accent rounded-xl text-white shadow-md shadow-sky-500/25">
            <Compass size={24} className="animate-spin-slow" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            AI Travel<span className="text-emerald-500 dark:text-emerald-400"> Planner</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => 
                `flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all ${
                  isActive 
                    ? 'text-sky-500 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-400/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`
              }
            >
              <link.icon size={16} />
              <span>{link.label}</span>
            </NavLink>
          ))}
          
          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2" />

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500/10 dark:hover:bg-sky-400/10 text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle Row */}
        <div className="flex items-center md:hidden gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-500/15"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-slate-200 dark:border-slate-800 absolute top-full left-0 right-0 p-6 flex flex-col space-y-4 animate-fade-in bg-white dark:bg-slate-900 shadow-2xl">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-2xl text-base font-bold transition-all ${
                  isActive 
                    ? 'text-sky-500 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-400/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
