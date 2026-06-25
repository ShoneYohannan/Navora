import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { travelApi } from '../services/api';
import MapComponent from '../components/MapComponent';
import { LoadingSkeleton, ErrorState } from '../components/FeedbackStates';
import { Star, Clock, Info, ShieldAlert, ArrowLeft, Heart, Compass, Check, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await travelApi.getPlaceDetails(id);
      if (response.data) {
        setPlace(response.data);
        
        // Load destination details to filter nearby
        const destKey = response.data.id.split('_')[0]; // Extract destination name from id prefix
        const destRes = await travelApi.getDestinationDetails(destKey);
        
        const allItems = [
          ...destRes.data.attractions,
          ...destRes.data.restaurants,
          ...destRes.data.hotels,
          ...destRes.data.events
        ];
        
        // Filter out current place
        setNearby(allItems.filter(item => item.id !== id).slice(0, 3));

        // Check if added
        const saved = localStorage.getItem('active_added_places');
        if (saved) {
          const ids = JSON.parse(saved);
          setIsAdded(ids.includes(id));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItinerary = () => {
    const savedStr = localStorage.getItem('active_added_places') || '[]';
    let saved = JSON.parse(savedStr);
    
    let updated;
    if (saved.includes(id)) {
      updated = saved.filter(savedId => savedId !== id);
      setIsAdded(false);
    } else {
      updated = [...saved, id];
      setIsAdded(true);
    }
    
    localStorage.setItem('active_added_places', JSON.stringify(updated));

    // Save actual item metadata to dynamic session planning store
    const sessionItemsStr = localStorage.getItem('active_added_items');
    let sessionItems = sessionItemsStr ? JSON.parse(sessionItemsStr) : [];
    
    if (updated.includes(id)) {
      if (!sessionItems.some(i => i.id === id)) {
        sessionItems.push(place);
      }
    } else {
      sessionItems = sessionItems.filter(i => i.id !== id);
    }
    localStorage.setItem('active_added_items', JSON.stringify(sessionItems));
  };

  if (loading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (!place) {
    return (
      <ErrorState 
        title="Place not found"
        message="The tourist hotspot or dining venue you are looking for could not be found or has been moved."
      />
    );
  }

  // Generate a mock gallery of beautiful destination images
  const galleryImages = [
    place.image,
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Banner Section */}
      <div className="relative h-[450px] w-full bg-slate-900 overflow-hidden">
        <img 
          src={place.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"} 
          alt={place.name} 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        {/* Floating buttons on banner */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center max-w-7xl mx-auto z-20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 backdrop-blur-md text-white rounded-2xl hover:bg-slate-900 transition-colors border border-white/10 text-xs font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button 
            onClick={handleToggleItinerary}
            className={`flex items-center gap-2 px-5 py-2.5 backdrop-blur-md rounded-2xl transition-all text-xs font-bold text-white shadow-lg border border-white/10 ${
              isAdded 
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'
            }`}
          >
            {isAdded ? <Check size={16} /> : <Heart size={16} />}
            <span>{isAdded ? 'Added to Itinerary' : 'Save to Itinerary'}</span>
          </button>
        </div>

        {/* Details Caption */}
        <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto z-10 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-sky-500 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-full border border-sky-400/30">
              {place.category}
            </span>
            {place.subCategory && (
              <span className="bg-white/10 text-slate-200 font-semibold text-[10px] uppercase px-3 py-1.5 rounded-full border border-white/10">
                {place.subCategory}
              </span>
            )}
            <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-white/10">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span>{place.rating}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">{place.name}</h1>
          <p className="text-slate-300 text-sm md:text-base flex items-center gap-1">
            <Compass size={16} className="text-emerald-400" /> Locality in {place.destinationName}
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left column: Place details info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-sky-500" /> About this Place
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {place.description}
            </p>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Opening Hours</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {place.openingHours || "Daytime (9:00 AM - 6:00 PM)"}
              </p>
            </div>
            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Estimated Visit</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {place.estimatedVisitDuration || "1.5 hours"}
              </p>
            </div>
            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Entry Fee</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight text-emerald-600 dark:text-emerald-400">
                {place.entryFee || "Free Entry"}
              </p>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Media Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="h-28 md:h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group">
                  <img 
                    src={img} 
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Map and Recommendations */}
        <div className="space-y-8">
          
          {/* Map Location */}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Location Map</h3>
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapComponent places={[place]} />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldAlert size={14} className="text-sky-500" />
              <span>Coordinates: {place.lat?.toFixed(4)}, {place.lon?.toFixed(4)}</span>
            </div>
          </div>

          {/* Nearby Suggestions Carousel/List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Nearby Recommendations</h3>
            <div className="space-y-4">
              {nearby.map(item => (
                <Link 
                  key={item.id} 
                  to={`/place/${item.id}`}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate group-hover:text-sky-500 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{item.category} • {item.subCategory}</p>
                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 mt-1">
                      <Star size={10} fill="currentColor" /> {item.rating}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
