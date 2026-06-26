import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API, { getTripHistory } from '../services/api';
import { EmptyState } from '../components/FeedbackStates';
import { Trash2, ExternalLink, Calendar, MapPin, DollarSign, Star, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SavedTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      AUD: '$'
    };
    return symbols[currency] || currency || '$';
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getTripHistory();
      setTrips(response.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this trip itinerary?")) return;
    try {
      await API.delete(`/trip/${id}`);
      setTrips(trips.filter(t => t.id !== id && t._id !== id));
    } catch (error) {
      alert("Failed to delete trip");
    }
  };

  const getDestinationImage = (destination) => {
    const key = destination.toLowerCase().trim();
    if (key.includes('kochi')) return 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=500&q=80';
    if (key.includes('munnar')) return 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80';
    if (key.includes('alleppey')) return 'https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=500&q=80';
    if (key.includes('wayanad')) return 'https://images.unsplash.com/photo-1627393100177-b4297e79a5be?auto=format&fit=crop&w=500&q=80';
    if (key.includes('goa')) return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=500&q=80';
    if (key.includes('jaipur')) return 'https://images.unsplash.com/photo-1477584322813-ac8f6453664d?auto=format&fit=crop&w=500&q=80';
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">Your Saved Trips</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Review and manage your generated AI travel itineraries</p>
        </div>
        <Link 
          to="/" 
          className="px-6 py-3 bg-gradient-accent text-white rounded-2xl text-xs font-bold shadow-lg shadow-sky-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <Compass size={16} /> Plan New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <EmptyState 
          title="No planned trips yet"
          message="You haven't generated or saved any trip plans yet. Start planning by entering a destination on our home page!"
          buttonText="Generate Itinerary"
          buttonLink="/"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {trips.map((trip) => {
              const tripId = trip.id || trip._id;
              return (
                <motion.div 
                  key={tripId} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass rounded-3xl overflow-hidden flex flex-col group border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 transition-all hover:shadow-lg"
                >
                  {/* Card Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img 
                      src={getDestinationImage(trip.destination)} 
                      alt={trip.destination} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    
                    {/* Delete Action button */}
                    <button 
                      onClick={(e) => handleDelete(tripId, e)}
                      className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-red-500 backdrop-blur-md rounded-xl text-white transition-colors border border-white/10"
                      title="Delete trip report"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">AI Plan Ready</p>
                      <h3 className="text-xl font-bold">{trip.destination}</h3>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Duration</p>
                          <p className="text-slate-800 dark:text-slate-300 flex items-center gap-1">
                            <Calendar size={13} className="text-sky-500" />
                             {trip.days} Days
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Quality Score</p>
                          <p className="text-slate-800 dark:text-slate-300 flex items-center gap-1">
                            <Star size={13} className="text-yellow-500 fill-current" />
                            {trip.travel_quality_score}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Budget Est.</p>
                          <p className="text-slate-800 dark:text-slate-300 flex items-center gap-0.5">
                            <DollarSign size={13} className="text-emerald-500" />
                            {getCurrencySymbol(trip.currency)} {trip.budget_breakdown?.total_estimated || 150}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Safety Status</p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Verified Safe
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/itinerary?id=${tripId}`}
                      className="w-full py-3 bg-slate-100 hover:bg-sky-500 dark:bg-slate-800 hover:text-white dark:hover:bg-sky-500 text-slate-700 dark:text-slate-300 text-center text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50 mt-6"
                    >
                      Open Trip <ExternalLink size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SavedTrips;
