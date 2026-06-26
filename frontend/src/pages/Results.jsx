import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import PlaceCard from '../components/PlaceCard';
import { LoadingSkeleton, EmptyState } from '../components/FeedbackStates';
import { Compass, Calendar, DollarSign, Users, ChevronLeft, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Results = () => {
  const [searchParams] = useSearchParams();
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

  // Search input
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
    const mockData = {
      name: destParam.charAt(0).toUpperCase() + destParam.slice(1),
      attractions: [],
      restaurants: [],
      hotels: [],
      events: []
    };

    setDestinationData(mockData);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  // Run filters
  useEffect(() => {
    if (!destinationData) return;

    // Combine all places
    const all = [
      ...destinationData.attractions,
      ...destinationData.restaurants,
      ...destinationData.hotels,
      ...destinationData.events
    ];

    const filtered = all.filter(place => {
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

      // Text Search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesDesc = place.description.toLowerCase().includes(query);
        const matchesSub = place.subCategory && place.subCategory.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub) {
          return false;
        }
      }

      return true;
    });

    setFilteredPlaces(filtered);
  }, [destinationData, selectedCategories, selectedPrice, selectedRating, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategories(['Attraction', 'Restaurant', 'Hotel', 'Event']);
    setSelectedPrice(['$', '$$', '$$$']);
    setSelectedRating(null);
    setSearchQuery('');
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
        <ChevronLeft size={16} /> Back to Search
      </button>

      {/* Search Summary Panel */}
      <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Destination</p>
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

        <button 
          onClick={() => navigate(`/itinerary?destination=${destParam}&days=${daysParam}&budget=${budgetParam}&date=${dateParam}`)}
          className="px-6 py-3 bg-gradient-accent text-white font-bold rounded-2xl text-sm shadow-md shadow-sky-500/20 hover:scale-105 transition-all text-center"
        >
          View Generated Itinerary
        </button>
      </div>

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
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search attractions, dishes, hotels or activities in Kochi..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-800 dark:text-white font-bold">{filteredPlaces.length}</span> recommendations
            </p>
          </div>

          {/* Cards Grid */}
          {filteredPlaces.length === 0 ? (
            <EmptyState 
              title="No recommendations match filters"
              message="Try broadening your categories, adjusting your price ranges, or resetting filters."
              buttonText="Reset All Filters"
              buttonLink=""
            />
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
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
