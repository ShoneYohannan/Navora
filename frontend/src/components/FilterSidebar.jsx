import React from 'react';
import { Star, DollarSign, Filter, RefreshCw } from 'lucide-react';

const FilterSidebar = ({ 
  selectedCategories, 
  setSelectedCategories,
  selectedPrice, 
  setSelectedPrice,
  selectedRating, 
  setSelectedRating,
  onReset 
}) => {
  
  const categories = [
    { id: 'Attraction', label: 'Attractions' },
    { id: 'Restaurant', label: 'Restaurants' },
    { id: 'Hotel', label: 'Hotels' },
    { id: 'Event', label: 'Events' }
  ];

  const prices = [
    { id: '$', label: 'Budget' },
    { id: '$$', label: 'Mid-range' },
    { id: '$$$', label: 'Luxury' }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const handleCategoryChange = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handlePriceChange = (priceId) => {
    if (selectedPrice.includes(priceId)) {
      setSelectedPrice(selectedPrice.filter(p => p !== priceId));
    } else {
      setSelectedPrice([...selectedPrice, priceId]);
    }
  };

  return (
    <div className="glass p-6 rounded-3xl sticky top-24 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter size={18} className="text-sky-500" /> Filters
        </h3>
        <button 
          onClick={onReset}
          className="text-xs text-sky-500 hover:text-emerald-500 flex items-center gap-1 transition-colors font-medium"
        >
          <RefreshCw size={12} /> Reset All
        </button>
      </div>

      {/* Category Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group text-sm font-medium">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => handleCategoryChange(cat.id)}
                className="w-4 h-4 rounded text-sky-500 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-sky-400 focus:ring-offset-0 focus:ring-2"
              />
              <span className="text-slate-600 dark:text-slate-300 group-hover:text-sky-500 transition-colors">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Price Filters</h4>
        <div className="flex flex-wrap gap-2">
          {prices.map((p) => {
            const isSelected = selectedPrice.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePriceChange(p.id)}
                className={`flex-grow px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-0.5 border transition-all ${
                  isSelected 
                    ? 'bg-sky-500 border-sky-500 text-white shadow-md' 
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500/50'
                }`}
              >
                {p.id === '$' && <DollarSign size={12} />}
                {p.id === '$$' && <><DollarSign size={12} /><DollarSign size={12} /></>}
                {p.id === '$$$' && <><DollarSign size={12} /><DollarSign size={12} /><DollarSign size={12} /></>}
                <span className="ml-1">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rating Filter</h4>
        <div className="space-y-2">
          {ratings.map((rating) => {
            const isSelected = selectedRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => setSelectedRating(isSelected ? null : rating)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-700'} 
                    />
                  ))}
                  <span className="ml-2">{rating} Star{rating > 1 && 's'} & Up</span>
                </div>
                {isSelected && <span className="text-[10px] uppercase font-bold tracking-wider">Active</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
