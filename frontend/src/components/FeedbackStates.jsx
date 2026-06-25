import React from 'react';
import { Loader2, Inbox, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Skeleton loader for search grids or timelines
export const LoadingSkeleton = ({ variant = 'grid', count = 3 }) => {
  if (variant === 'detail') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-pulse">
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
          </div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          <div className="flex gap-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Generic empty state
export const EmptyState = ({ title = "No items found", message = "We couldn't find anything matching your filters.", buttonText, buttonLink }) => {
  return (
    <div className="glass text-center py-16 px-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4">
      <div className="p-4 bg-sky-500/10 text-sky-500 rounded-2xl">
        <Inbox size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md leading-relaxed">{message}</p>
      {buttonText && buttonLink && (
        <Link 
          to={buttonLink} 
          className="px-6 py-2.5 bg-gradient-accent text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/20 hover:scale-105 transition-all"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

// Generic error state
export const ErrorState = ({ title = "Something went wrong", message = "An error occurred while loading this page. Please try again.", showHomeBtn = true }) => {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6">
      <div className="inline-flex p-4 bg-red-500/10 text-red-500 rounded-2xl">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-white">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
      {showHomeBtn && (
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold rounded-2xl text-sm hover:scale-105 transition-all"
        >
          <ArrowLeft size={16} /> Back to Safety
        </Link>
      )}
    </div>
  );
};
