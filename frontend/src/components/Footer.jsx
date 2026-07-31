import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Globe, Send, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-slate-900 dark:text-white">
              <Compass className="text-sky-500" size={28} />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Navora<span className="text-emerald-500"> Trip Planner</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Plan smarter, custom trips with collaborative AI-powered recommendations. Discover tourist spots, hotels, restaurants, and events customized for you.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-sky-500 hover:text-white rounded-full transition-colors" title="Share">
                <Send size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-full transition-colors" title="Web">
                <Globe size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-sky-700 hover:text-white rounded-full transition-colors" title="Network">
                <Users size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-sky-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/results?destination=kochi" className="hover:text-sky-500 transition-colors">Explore</Link>
              </li>
              <li>
                <Link to="/saved-trips" className="hover:text-sky-500 transition-colors">Saved Trips</Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-sky-500 transition-colors">AI Assistant</Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">Destinations</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to="/results?destination=kochi" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Kochi</Link>
              </li>
              <li>
                <Link to="/results?destination=munnar" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Munnar</Link>
              </li>
              <li>
                <Link to="/results?destination=alleppey" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Alleppey</Link>
              </li>
              <li>
                <Link to="/results?destination=goa" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Goa</Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <MapPin size={16} className="text-emerald-500" />
                <span>Kerala, India</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <Phone size={16} className="text-emerald-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <Mail size={16} className="text-emerald-500" />
                <span>support@travelmind.ai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Navora Trip Planner. Your Intelligent Travel Companion.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
