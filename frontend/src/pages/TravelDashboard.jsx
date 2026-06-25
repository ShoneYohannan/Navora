import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { travelApi } from '../services/api';
import { 
  CloudSun, Shield, Star, Wallet, CheckSquare, 
  Map as MapIcon, Download, Film, Utensils, Store, Loader2, ArrowLeft, Calendar, Info, Heart
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { motion } from 'framer-motion';

const TravelDashboard = () => {
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
      link.setAttribute('download', `Navora_Itinerary_${trip?.destination}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Failed to download PDF");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-sky-500 mb-4" size={48} />
      <p className="text-slate-400">Loading Navora Dashboard...</p>
    </div>
  );

  if (!trip) return (
    <div className="text-center py-20">
      <p className="text-red-400 mb-4">Trip intelligence report not found.</p>
      <Link to="/saved-trips" className="text-sky-400 font-bold hover:underline">Back to Saved Trips</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back button & Brand badge */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/saved-trips" className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Saved Trips
        </Link>
        <span className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-bold text-sky-400 tracking-wider uppercase">
          Navora AI Verified
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-3 text-gradient">{trip.destination}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
            <span className="flex items-center gap-1"><Calendar size={16} /> {trip.days} Days Plan</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Wallet size={16} /> Budget Cap: ${trip.budget}</span>
            {trip.interests && trip.interests.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Heart size={14} className="text-rose-500" />
                  {trip.interests.map((int, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-300 font-medium capitalize">{int}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl transition-all shadow-lg shadow-sky-500/25 hover:scale-105 font-bold"
        >
          <Download size={20} /> Export PDF Itinerary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan, Map and Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Weather, Quality, Safety Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weather Card */}
            <div className="glass p-6 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4 text-sky-400">
                <CloudSun size={24} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Weather Summary</h3>
              </div>
              <div>
                <span className="text-4xl font-extrabold block text-white">{trip.weather_info?.temp ?? 25}°C</span>
                <span className="text-slate-400 text-sm capitalize">{trip.weather_info?.description ?? "Sunny"}</span>
              </div>
            </div>

            {/* Travel Quality Score */}
            <div className="glass p-6 rounded-3xl flex flex-col justify-between border-sky-500/10">
              <div className="flex items-center gap-3 mb-4 text-sky-400">
                <Star size={24} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Quality Score</h3>
              </div>
              <div>
                <span className="text-4xl font-extrabold block text-white">{trip.travel_quality_score}%</span>
                <span className="text-slate-400 text-sm">Collaborative AI Rating</span>
              </div>
            </div>

            {/* Safety Score */}
            <div className="glass p-6 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Shield size={24} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Safety Score</h3>
              </div>
              <div>
                <span className="text-4xl font-extrabold block text-white">{trip.safety_score}%</span>
                <span className="text-slate-400 text-sm">Verified Feasibility</span>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <MapIcon className="text-sky-400" size={24} />
              <h2 className="text-2xl font-extrabold">Dynamic Map Discovery</h2>
            </div>
            <MapComponent places={[
              ...(trip.nearby_attractions || []),
              ...(trip.restaurants || []),
              ...(trip.malls || []),
              ...(trip.movie_theatres || [])
            ]} />
          </div>

          {/* Day-Wise Itinerary */}
          <div>
            <h2 className="text-2xl font-extrabold mb-8">Generated Itinerary</h2>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/5">
              {trip.itinerary?.days?.map((day, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  key={i} 
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-sm font-bold z-10 text-slate-950 shadow-lg shadow-sky-500/20">
                    {day.day}
                  </div>
                  <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold mb-4 text-slate-200">{day.theme}</h3>
                    <ul className="space-y-3">
                      {day.activities?.map((act, idx) => (
                        <li key={idx} className="text-slate-400 flex items-start gap-3 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations, Budgets, Checklists */}
        <div className="space-y-8">
          
          {/* Budget Breakdown */}
          <div className="glass p-8 rounded-3xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-3 mb-6 text-yellow-400">
              <Wallet size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Budget Allocation</h3>
            </div>
            <div className="space-y-5">
              {trip.budget_breakdown && Object.entries(trip.budget_breakdown)
                .filter(([key]) => key !== 'total_estimated')
                .map(([key, val]) => {
                  const total = trip.budget_breakdown.total_estimated || 1;
                  const pct = Math.min(((val / total) * 100).toFixed(0), 100);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5 capitalize text-slate-400">
                        <span>{key.replace('_', ' ')}</span>
                        <span className="font-semibold text-slate-300">${val} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              }
              <div className="pt-5 border-t border-white/10 mt-5 flex justify-between items-center font-bold">
                <span className="text-sm">Total Estimated</span>
                <span className="text-xl text-yellow-400">${trip.budget_breakdown?.total_estimated}</span>
              </div>
            </div>
          </div>

          {/* Alternate Weather Plans */}
          {trip.alternate_activities && trip.alternate_activities.length > 0 && (
            <div className="glass p-8 rounded-3xl border border-sky-500/10">
              <div className="flex items-center gap-3 mb-4 text-sky-400">
                <Info size={22} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Weather-Aware Alternatives</h3>
              </div>
              <ul className="space-y-3">
                {trip.alternate_activities.map((act, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2.5">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Packing Checklist */}
          <div className="glass p-8 rounded-3xl border border-white/5">
             <div className="flex items-center gap-3 mb-6 text-sky-400">
              <CheckSquare size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Packing Checklist</h3>
            </div>
            <ul className="space-y-3">
              {trip.packing_checklist?.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Movie Recommendations */}
          {trip.movie_recommendations && trip.movie_recommendations.length > 0 && (
            <div className="glass p-8 rounded-3xl border border-white/5">
               <div className="flex items-center gap-3 mb-6 text-rose-400">
                <Film size={24} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Movie suggestions</h3>
              </div>
              <div className="space-y-6">
                {trip.movie_recommendations.slice(0, 3).map((movie, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-16 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                      {movie.poster_path ? (
                        <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 text-xs">No Poster</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm leading-tight mb-1 group-hover:text-sky-400 transition-colors">{movie.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                         <Star size={12} fill="currentColor" /> {movie.rating?.toFixed(1) || "7.5"}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{movie.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evaluator Notes */}
          <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-md">
            <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">Evaluator Notes</h3>
            <p className="text-sm text-slate-300 italic leading-relaxed">"{trip.evaluator_feedback}"</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TravelDashboard;
