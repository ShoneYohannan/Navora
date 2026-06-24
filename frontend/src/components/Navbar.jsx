import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, LayoutDashboard, Rocket } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Rocket className="text-sky-400" size={32} />
          <span className="text-2xl font-bold tracking-tight">
            Travel<span className="text-sky-400">Mind</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/" className="hover:text-sky-400 transition-colors uppercase text-sm font-semibold tracking-wider">Home</Link>
          <Link to="/create" className="flex items-center space-x-1 hover:text-sky-400 transition-colors uppercase text-sm font-semibold tracking-wider">
            <Compass size={18} />
            <span>Create Trip</span>
          </Link>
          <Link to="/dashboard" className="flex items-center space-x-1 hover:text-sky-400 transition-colors uppercase text-sm font-semibold tracking-wider">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
