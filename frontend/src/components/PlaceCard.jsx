import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Plus, Check, Clock, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaceCard = ({ place, isAdded, onAddToItinerary }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Attraction': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      case 'Restaurant': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Hotel': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Event': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-3xl overflow-hidden flex flex-col group hover:shadow-xl hover:border-sky-500/30 transition-all border border-slate-200 dark:border-slate-800"
    >
      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img 
          src={place.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        
        {/* Category Badge */}
        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md ${getCategoryColor(place.category)}`}>
          {place.category}
        </span>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 text-white text-xs font-bold">
          <Star size={12} className="text-yellow-400 fill-current" />
          <span>{place.rating}</span>
        </div>

        {/* Subcategory */}
        {place.subCategory && (
          <span className="absolute bottom-4 left-4 text-white text-xs font-medium tracking-wide">
            {place.subCategory}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-sky-500 transition-colors text-slate-800 dark:text-white line-clamp-1">
            {place.name}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Specs List */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mb-4">
          {place.category === 'Attraction' && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Clock size={13} className="text-sky-500" /> Duration:</span>
              <span className="text-slate-700 dark:text-slate-300">{place.estimatedVisitDuration}</span>
            </div>
          )}
          {place.category === 'Event' && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Calendar size={13} className="text-purple-500" /> Date:</span>
              <span className="text-slate-700 dark:text-slate-300">{place.date}</span>
            </div>
          )}
          {(place.category === 'Restaurant' || place.category === 'Hotel') && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1"><DollarSign size={13} className="text-emerald-500" /> Tier:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {place.priceRange === '$$$' ? 'Luxury' : place.priceRange === '$$' ? 'Mid-range' : 'Budget'}
              </span>
            </div>
          )}
          {place.entryFee && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1"><DollarSign size={13} className="text-emerald-500" /> Entry:</span>
              <span className="text-slate-700 dark:text-slate-300">{place.entryFee}</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link 
            to={`/place/${place.id}`}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-center text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-1 border border-slate-200/50 dark:border-slate-700/50"
          >
            Details
          </Link>
          
          <button
            onClick={() => onAddToItinerary && onAddToItinerary(place)}
            className={`w-full py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1 ${
              isAdded
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/25'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <Plus size={14} /> Add to Trip
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceCard;
