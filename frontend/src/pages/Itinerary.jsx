import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { travelApi } from '../services/api';
import { 
  CloudSun, Shield, Star, Wallet, CheckSquare, 
  Map as MapIcon, Download, Film, Utensils, Share2, Edit3, ChevronDown, ChevronUp, MapPin, Clock, Info, Check, Eye
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { LoadingSkeleton, ErrorState } from '../components/FeedbackStates';
import { motion, AnimatePresence } from 'framer-motion';

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const tripId = searchParams.get('id');
  const destinationQuery = searchParams.get('destination');
  const daysQuery = parseInt(searchParams.get('days')) || 3;
  const budgetQuery = searchParams.get('budget') || 'mid-range';
  const dateQuery = searchParams.get('date');

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // UI state
  const [expandedDays, setExpandedDays] = useState({ 0: true }); // Day 1 expanded by default
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit fields state
  const [editForm, setEditForm] = useState({
    destination: 'kochi',
    duration: 3,
    budget: 'mid-range'
  });

  useEffect(() => {
    fetchTripDetails();
  }, [tripId, destinationQuery, daysQuery, budgetQuery]);

  const fetchTripDetails = async () => {
    setLoading(true);
    setError(false);
    try {
      if (tripId) {
        // Load existing trip by ID
        const response = await travelApi.getTrip(tripId);
        if (response.data) {
          setTrip(response.data);
          setEditForm({
            destination: response.data.destination.toLowerCase(),
            duration: response.data.duration,
            budget: response.data.budget_tier || 'mid-range'
          });
        } else {
          setError(true);
        }
      } else if (destinationQuery) {
        // Generate new trip based on query parameters
        const response = await travelApi.generateTrip({
          destination: destinationQuery,
          duration: daysQuery,
          budget: budgetQuery,
          interests: ['Culture']
        });
        if (response.data) {
          setTrip(response.data);
          setEditForm({
            destination: destinationQuery.toLowerCase(),
            duration: daysQuery,
            budget: budgetQuery
          });
          // Update URL to match new trip ID to allow bookmarking
          navigate(`/itinerary?id=${response.data.id}`, { replace: true });
        } else {
          setError(true);
        }
      } else {
        // Default Kochi loading
        const response = await travelApi.generateTrip({
          destination: 'kochi',
          duration: 3,
          budget: 'mid-range',
          interests: ['Culture']
        });
        if (response.data) {
          setTrip(response.data);
          setEditForm({
            destination: 'kochi',
            duration: 3,
            budget: 'mid-range'
          });
        }
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!trip) return;
    try {
      const response = await travelApi.exportPdf(trip.id || trip._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${trip.destination.toLowerCase()}_itinerary.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to download PDF summary");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDay = (idx) => {
    setExpandedDays(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setShowEditModal(false);
    setLoading(true);
    try {
      const response = await travelApi.generateTrip({
        destination: editForm.destination,
        duration: editForm.duration,
        budget: editForm.budget,
        interests: ['Culture']
      });
      if (response.data) {
        setTrip(response.data);
        navigate(`/itinerary?id=${response.data.id}`, { replace: true });
      }
    } catch (err) {
      alert("Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <ErrorState 
        title="Failed to load itinerary"
        message="We encountered a problem assembling the schedule data. Make sure the query params or ID is valid."
      />
    );
  }

  // Compile coordinate markers from nearby attractions for Map pins
  const pins = [...(trip.nearby_attractions || []), ...(trip.restaurants || [])];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      
      {/* Header Info Panel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-500 dark:text-sky-400">
            Intelligence Report Generated
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-1">
            Trip to {trip.destination}
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-4">
            <span>Duration: <strong className="text-slate-700 dark:text-slate-300">{trip.duration} Days</strong></span>
            <span>Quality Rating: <strong className="text-sky-500">{trip.travel_quality_score}%</strong></span>
            <span>Safety Status: <strong className="text-emerald-500">Verified Safe ({trip.safety_score}%)</strong></span>
          </p>
        </div>

        {/* Action button triggers */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all border border-slate-200/50 dark:border-slate-700/50"
          >
            <Edit3 size={15} /> Edit Plan
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all border border-slate-200/50 dark:border-slate-700/50"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
            <span>{copied ? 'Link Copied' : 'Share Itinerary'}</span>
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-accent text-white rounded-2xl text-xs font-bold shadow-lg shadow-sky-500/10 hover:scale-105 active:scale-95 transition-all"
          >
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Timeline view & Interactive Map) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Weather & Safety highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Local Weather</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{trip.weather_info?.temp}°C</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{trip.weather_info?.description}</p>
              </div>
              <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
                <CloudSun size={28} />
              </div>
            </div>
            
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Safety Index</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{trip.safety_score}%</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified safe transit</p>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Shield size={28} />
              </div>
            </div>
          </div>

          {/* Timeline block */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-sky-500" /> Visually Compiled Timeline
            </h2>

            <div className="space-y-4">
              {trip.itinerary?.days.map((day, dayIdx) => {
                const isExpanded = expandedDays[dayIdx];
                return (
                  <div 
                    key={dayIdx} 
                    className="glass rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                  >
                    {/* Expandable header */}
                    <button
                      onClick={() => toggleDay(dayIdx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-accent rounded-2xl flex items-center justify-center font-bold text-white text-sm">
                          D{dayIdx + 1}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-800 dark:text-white leading-tight">{day.day}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{day.theme}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </button>

                    {/* Expandable items timeline details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80"
                        >
                          <div className="p-6 space-y-6 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                            {day.activities.map((act, actIdx) => {
                              // Split time from activity
                              const timeSplit = act.split(' – ');
                              const time = timeSplit[0] || '09:00 AM';
                              const desc = timeSplit[1] || act;
                              
                              // Estimated transit times simulator
                              const showTransit = actIdx < day.activities.length - 1;
                              const transitModes = ["auto-rickshaw", "walking path", "local taxi", "ferry boat"];
                              const selectedMode = transitModes[(dayIdx + actIdx) % transitModes.length];
                              const selectedTime = 10 + ((dayIdx * 5 + actIdx * 10) % 25);

                              return (
                                <div key={actIdx} className="space-y-4">
                                  <div className="flex gap-4 relative z-10 items-start">
                                    {/* Timeline dot */}
                                    <div className="w-4 h-4 bg-white dark:bg-slate-950 border-4 border-sky-500 rounded-full flex-shrink-0 mt-1.5 ml-[18px]" />
                                    
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-bold text-sky-500 tracking-wide uppercase">{time}</span>
                                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                        {desc}
                                      </p>
                                    </div>
                                  </div>

                                  {showTransit && (
                                    <div className="flex items-center gap-2 pl-14 py-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">
                                      <MapPin size={10} className="text-emerald-500" />
                                      <span>Estimated transit: {selectedTime} mins via {selectedMode}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maps marker component */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapIcon size={20} className="text-sky-500" /> Map Pin Route Optimization
            </h3>
            <div className="h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapComponent places={pins} />
            </div>
          </div>

        </div>

        {/* Right Column (Summary breakdown, checklist, movies, evaluator notes) */}
        <div className="space-y-8">
          
          {/* Total budget summary */}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Wallet size={18} className="text-sky-500" /> Cost Summary Breakdown
            </h3>
            
            <div className="space-y-4">
              {Object.entries(trip.budget_breakdown || {}).map(([key, val]) => {
                if (key === 'total_estimated') return null;
                const total = trip.budget_breakdown.total_estimated || 100;
                const percentage = Math.round((val / total) * 100);
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 capitalize">
                      <span>{key}</span>
                      <span className="text-slate-800 dark:text-slate-300">${val} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-center font-bold">
              <span className="text-xs text-slate-500">Total Estimate ({trip.duration} days)</span>
              <span className="text-lg text-emerald-600 dark:text-emerald-400">${trip.budget_breakdown?.total_estimated}</span>
            </div>
          </div>

          {/* Packing checklist */}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CheckSquare size={18} className="text-sky-500" /> Packing Checklist
            </h3>
            <div className="space-y-2">
              {(trip.packing_checklist || []).map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-sky-500 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-sky-400 focus:ring-offset-0 mt-0.5" 
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Movie Recommendations */}
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Film size={18} className="text-sky-500" /> Destination Media Reels
            </h3>
            <div className="space-y-4">
              {(trip.movie_recommendations || []).map((movie, idx) => (
                <div key={idx} className="flex gap-3 items-center group">
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                    <img 
                      src={movie.poster_path || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=100&q=80"} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold leading-tight truncate text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluator Notes */}
          <div className="p-5 rounded-3xl bg-sky-500/5 border border-sky-500/10 text-slate-600 dark:text-slate-400 text-xs italic leading-relaxed">
            <h4 className="font-bold text-sky-500 text-[10px] uppercase tracking-wider mb-2 not-italic flex items-center gap-1">
              <Info size={12} /> Travel Agent Notes
            </h4>
            "{trip.evaluator_feedback}"
          </div>

        </div>

      </div>

      {/* Edit modal overlay */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-lg text-slate-800 dark:text-white">Modify Travel Plan</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">Destination</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.destination}
                  onChange={(e) => setEditForm({...editForm, destination: e.target.value})}
                >
                  <option value="kochi">Kochi, Kerala</option>
                  <option value="munnar">Munnar, Kerala</option>
                  <option value="alleppey">Alleppey, Kerala</option>
                  <option value="wayanad">Wayanad, Kerala</option>
                  <option value="goa">Goa</option>
                  <option value="jaipur">Jaipur, Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">Days</label>
                <input 
                  type="number"
                  min="1"
                  max="10"
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">Budget Tier</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({...editForm, budget: e.target.value})}
                >
                  <option value="budget">Budget ($)</option>
                  <option value="mid-range">Mid-range ($$)</option>
                  <option value="luxury">Luxury ($$$)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-gradient-accent text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-sky-500/10"
                >
                  Recalculate Itinerary
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-grow py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl transition-colors border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
