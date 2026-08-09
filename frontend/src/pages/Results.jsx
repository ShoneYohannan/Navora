import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import PlaceCard from '../components/PlaceCard';
import { LoadingSkeleton, EmptyState } from '../components/FeedbackStates';
import { Compass, Calendar, DollarSign, Users, ChevronLeft, MapPin, Search, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { destinationsData } from '../services/mockData';

const popularSearchChips = [
  'All Destinations',
  'Kochi',
  'Munnar',
  'Alleppey',
  'Wayanad',
  'Goa',
  'Jaipur',
  'Spas & Wellness',
  'Tea Estates',
  'Houseboats',
  'Heritage Forts'
];

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  tap: { scale: 0.95 },
  hover: { scale: 1.05 }
};

const panelVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Results = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const destParam = searchParams.get('destination') || 'kochi';
  const daysParam = parseInt(searchParams.get('days')) || 3;
  const budgetParam = searchParams.get('budget') || 'mid-range';
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(true);
  const [destinationData, setDestinationData] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  
  // Active Filter states
  const [selectedCategories, setSelectedCategories] = useState(['Attraction', 'Restaurant', 'Hotel', 'Event']);
  const [selectedPrice, setSelectedPrice] = useState(['$', '$$', '$$$']);
  const [selectedRating, setSelectedRating] = useState(null);

  // Search input query
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage added places trackers
  const [addedPlaceIds, setAddedPlaceIds] = useState([]);

  useEffect(() => {
    fetchDestination();
    // Load already added places from active itinerary if any
    const saved = localStorage.getItem('active_added_places');
    if (saved) {
      setAddedPlaceIds(JSON.parse(saved));
    }
  }, [destParam]);

  const fetchDestination = async () => {
    setLoading(true);
    try {
      const normalizedKey = (destParam || 'kochi').toLowerCase().trim();
      let data = destinationsData[normalizedKey];

      // Fallback matching if partial key
      if (!data) {
        for (const key of Object.keys(destinationsData)) {
          if (key.includes(normalizedKey) || normalizedKey.includes(key)) {
            data = destinationsData[key];
            break;
          }
        }
      }

      // Default fallback to kochi
      if (!data) {
        data = destinationsData['kochi'];
      }

      setDestinationData(data);
    } catch (e) {
      console.error(e);
      setDestinationData(destinationsData['kochi']);
    } finally {
      setLoading(false);
    }
  };

  // Run filters & global / destination text search
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    let allPlaces = [];

    // Check if query specifies a city name
    const cityKeys = Object.keys(destinationsData);
    const matchedCityKey = cityKeys.find(key => key === query || query.includes(key));

    if (matchedCityKey) {
      // If user typed a specific city name, load that city's places!
      const cityData = destinationsData[matchedCityKey];
      allPlaces = [
        ...(cityData.attractions || []),
        ...(cityData.restaurants || []),
        ...(cityData.hotels || []),
        ...(cityData.events || [])
      ];
    } else if (query.length > 0) {
      // Search globally across ALL destinations!
      Object.values(destinationsData).forEach(d => {
        allPlaces.push(
          ...(d.attractions || []),
          ...(d.restaurants || []),
          ...(d.hotels || []),
          ...(d.events || [])
        );
      });
    } else if (destinationData) {
      // Standard search inside current selected destination
      allPlaces = [
        ...(destinationData.attractions || []),
        ...(destinationData.restaurants || []),
        ...(destinationData.hotels || []),
        ...(destinationData.events || [])
      ];
    }

    const filtered = allPlaces.filter(place => {
      // Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) {
        return false;
      }
      
      // Price Filter (only applies to Hotels/Restaurants which have priceRange)
      if (place.priceRange) {
        if (selectedPrice.length > 0 && !selectedPrice.includes(place.priceRange)) {
          return false;
        }
      }

      // Rating Filter
      if (selectedRating !== null && place.rating < selectedRating) {
        return false;
      }

      // Text Search Filter
      if (query !== '' && !matchedCityKey) {
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesDesc = place.description.toLowerCase().includes(query);
        const matchesSub = place.subCategory && place.subCategory.toLowerCase().includes(query);
        const matchesCategory = place.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub && !matchesCategory) {
          return false;
        }
      }

      return true;
    });

    setFilteredPlaces(filtered);
  }, [destinationData, selectedCategories, selectedPrice, selectedRating, searchQuery, destParam]);

  const handleResetFilters = () => {
    setSelectedCategories(['Attraction', 'Restaurant', 'Hotel', 'Event']);
    setSelectedPrice(['$', '$$', '$$$']);
    setSelectedRating(null);
    setSearchQuery('');
  };

  const handleChipClick = (chip) => {
    if (chip === 'All Destinations') {
      setSearchQuery('');
      setSearchParams({ destination: 'kochi', days: daysParam, budget: budgetParam, date: dateParam });
    } else if (Object.keys(destinationsData).includes(chip.toLowerCase())) {
      setSearchQuery('');
      setSearchParams({ destination: chip.toLowerCase(), days: daysParam, budget: budgetParam, date: dateParam });
    } else {
      setSearchQuery(chip.replace('Spas & Wellness', 'spa').replace('Tea Estates', 'tea').replace('Heritage Forts', 'fort'));
    }
  };

  const handleAddToItinerary = (place) => {
    let updated;
    if (addedPlaceIds.includes(place.id)) {
      updated = addedPlaceIds.filter(id => id !== place.id);
    } else {
      updated = [...addedPlaceIds, place.id];
    }
    setAddedPlaceIds(updated);
    localStorage.setItem('active_added_places', JSON.stringify(updated));

    // Save actual item metadata to dynamic session planning store
    const sessionItemsStr = localStorage.getItem('active_added_items');
    let sessionItems = sessionItemsStr ? JSON.parse(sessionItemsStr) : [];
    
    if (updated.includes(place.id)) {
      if (!sessionItems.some(i => i.id === place.id)) {
        sessionItems.push(place);
      }
    } else {
      sessionItems = sessionItems.filter(i => i.id !== place.id);
    }
    localStorage.setItem('active_added_items', JSON.stringify(sessionItems));
  };

  const formatBudget = (b) => {
    if (typeof b === 'number') return `$${b}`;
    return b.charAt(0).toUpperCase() + b.slice(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="lg:col-span-3">
            <LoadingSkeleton variant="grid" count={6} />
          </div>
        </div>
      </div>
    );
  }

  const destinationName = destinationData ? destinationData.name : destParam.charAt(0).toUpperCase() + destParam.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-500 mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Home
      </button>

      {/* Search Summary Panel */}
      <motion.div 
        className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Active Location</p>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{destinationName}</h2>
            </div>
          </div>

          <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Duration & Date</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{daysParam} Days • {dateParam}</p>
            </div>
          </div>

          <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Budget Tier</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{formatBudget(budgetParam)}</p>
            </div>
          </div>
        </div>

        <motion.button 
          onClick={() => navigate(`/itinerary?destination=${destParam}&days=${daysParam}&budget=${budgetParam}&date=${dateParam}`)}
          className="px-6 py-3 bg-gradient-accent text-white font-bold rounded-2xl text-sm shadow-md shadow-sky-500/20 hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={16} /> View Generated Itinerary
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            onReset={handleResetFilters}
          />
        </div>

        {/* Main Content Recommendations */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Text Search Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search attractions, spas, hotels, food or cities (e.g. Goa, Munnar, Fort Kochi)..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm text-slate-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Search Suggestions Chips */}
            <motion.div 
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <span className="text-slate-400 font-medium whitespace-nowrap text-[11px]">Quick Search:</span>
              {popularSearchChips.map((chip, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-500 hover:text-white text-slate-600 dark:text-slate-300 text-xs transition-all whitespace-nowrap border border-slate-200/60 dark:border-slate-700/60"
                  variants={chipVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {chip}
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-800 dark:text-white font-bold">{filteredPlaces.length}</span> recommendations
              {searchQuery && <span> for "<span className="text-sky-500 font-bold">{searchQuery}</span>"</span>}
            </p>
          </div>

          {/* Cards Grid */}
          {filteredPlaces.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <EmptyState 
                title="No recommendations match search"
                message="Try searching for a city name (Goa, Munnar, Kochi) or broader terms like 'tea', 'beach', 'spa', 'fort'."
                buttonText="Reset Search & Filters"
                buttonLink=""
                onReset={handleResetFilters}
              />
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredPlaces.map((place) => (
                  <PlaceCard 
                    key={place.id} 
                    place={place} 
                    isAdded={addedPlaceIds.includes(place.id)}
                    onAddToItinerary={handleAddToItinerary}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
