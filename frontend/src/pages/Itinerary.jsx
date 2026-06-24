import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { travelApi } from '../services/api';
import { 
  CloudSun, Shield, Star, Wallet, CheckSquare, 
  Map as MapIcon, Download, Film, Utensils, Store, Loader2 
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { motion } from 'framer-motion';

const Itinerary = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await travelApi.getTrip(id);
        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await travelApi.exportPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'itinerary.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Failed to download PDF");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-sky-500 mb-4" size={48} />
      <p className="text-slate-400">Loading your intelligence report...</p>
    </div>
  );

  if (!trip) return <div className="text-center py-20">Trip not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black mb-2">{trip.destination}</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Star className="text-yellow-500" size={18} fill="currentColor" />
            Travel Intelligence Score: {trip.travel_quality_score}%
          </p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10"
        >
          <Download size={20} /> Export PDF Itinerary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan and Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Weather & Safety Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-sky-400">
                <CloudSun size={24} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Weather Forecast</h3>
              </div>
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold">{trip.weather_info?.temp}°C</span>
                <span className="text-slate-400 pb-1 capitalize">{trip.weather_info?.description}</span>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Shield size={24} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Safety Score</h3>
              </div>
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold">{trip.safety_score}%</span>
                <span className="text-slate-400 pb-1">Verified Safe</span>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MapIcon className="text-sky-400" size={24} />
              <h2 className="text-2xl font-bold">Local Discovery Map</h2>
            </div>
            <MapComponent places={[...trip.nearby_attractions, ...trip.restaurants, ...trip.malls]} />
          </div>

          {/* Itinerary */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Daily Itinerary</h2>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/5">
              {trip.itinerary.days.map((day, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-sm font-bold z-10">
                    {day.day}
                  </div>
                  <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold mb-4">{day.theme}</h3>
                    <ul className="space-y-3">
                      {day.activities.map((act, idx) => (
                        <li key={idx} className="text-slate-400 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Stats */}
        <div className="space-y-8">
          
          {/* Budget Breakdown */}
          <div className="glass p-8 rounded-3xl bg-slate-900/50">
            <div className="flex items-center gap-3 mb-6 text-yellow-400">
              <Wallet size={24} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Budget Breakdown</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(trip.budget_breakdown).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1 capitalize text-slate-400">
                    <span>{key}</span>
                    <span>${val}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-500 h-full rounded-full" 
                      style={{ width: `${(val / trip.budget_breakdown.total_estimated) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/10 mt-4 flex justify-between font-bold">
                <span>Total Estimated</span>
                <span className="text-yellow-400">${trip.budget_breakdown?.total_estimated}</span>
              </div>
            </div>
          </div>

          {/* Packing Checklist */}
          <div className="glass p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-6 text-sky-400">
              <CheckSquare size={24} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Packing Checklist</h3>
            </div>
            <ul className="space-y-3">
              {trip.packing_checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Movie Recommendations */}
          <div className="glass p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-6 text-red-400">
              <Film size={24} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Movie recommendations</h3>
            </div>
            <div className="space-y-6">
              {trip.movie_recommendations.map((movie, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-16 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    {movie.poster_path && <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm leading-tight mb-1 group-hover:text-sky-400 transition-colors">{movie.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                       <Star size={12} fill="currentColor" /> {movie.rating}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{movie.overview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="p-6 rounded-3xl bg-sky-500/10 border border-sky-500/20">
            <h3 className="text-sky-400 font-bold text-sm uppercase mb-3">Evaluator Notes</h3>
            <p className="text-sm text-slate-300 italic">"{trip.evaluator_feedback}"</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Itinerary;
