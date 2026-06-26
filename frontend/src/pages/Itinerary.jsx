import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API, { generateTrip, saveTrip } from '../services/api';
import {
  CloudSun, Shield, Wallet, CheckSquare,
  Map as MapIcon, Download, Film, Share2, Edit3,
  ChevronDown, ChevronUp, MapPin, Clock, Info, Check,
  Home, Star, Umbrella, Sun, ArrowRight
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { LoadingSkeleton, ErrorState } from '../components/FeedbackStates';
import { motion, AnimatePresence } from 'framer-motion';

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tripId = searchParams.get('id');
  const fromSession = searchParams.get('from') === 'session';
  const destinationQuery = searchParams.get('destination');
  const daysQuery = parseInt(searchParams.get('days')) || 3;
  const budgetQuery = searchParams.get('budget') || 'mid-range';

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [expandedDays, setExpandedDays] = useState({ 0: true });
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [editForm, setEditForm] = useState({
    destination: 'kochi',
    days: 3,
    budget: 1500,
    currency: 'USD'
  });

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

  const budgetMap = {
    budget: 5000,
    'mid-range': 10000,
    luxury: 25000
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId, fromSession, destinationQuery, daysQuery, budgetQuery]);

  const fetchTripDetails = async () => {
    setLoading(true);
    setError(false);

    try {
      // 1. Load from MongoDB by ID
      if (tripId) {
        const response = await API.get(`/trip/${tripId}`);
        setTrip(response.data);
        setEditForm({
          destination: response.data.destination || 'kochi',
          days: response.data.days || 3,
          budget: response.data.budget || 1500,
          currency: response.data.currency || 'USD'
        });
        sessionStorage.setItem('current_trip', JSON.stringify(response.data));

      // 2. Load from sessionStorage (when MongoDB save failed)
      } else if (fromSession) {
        const stored = sessionStorage.getItem('current_trip');
        if (stored) {
          const data = JSON.parse(stored);
          setTrip(data);
          setEditForm({
            destination: data.destination || 'kochi',
            days: data.days || 3,
            budget: data.budget || 1500,
            currency: data.currency || 'USD'
          });
        } else {
          setError(true);
        }

      // 3. Generate a new trip on-the-fly (legacy results page flow)
      } else {
        const parsedBudget = parseFloat(budgetQuery);
        let numericBudget = 10000;
        if (!isNaN(parsedBudget)) {
          numericBudget = parsedBudget;
        } else {
          numericBudget = budgetMap[budgetQuery] || 10000;
        }

        const payload = {
          destination: destinationQuery || 'kochi',
          days: daysQuery,
          budget: numericBudget,
          currency: 'USD',
          travelers: 1,
          interests: ['Culture']
        };

        const generateResponse = await generateTrip(payload);
        const tripData = generateResponse.data;
        sessionStorage.setItem('current_trip', JSON.stringify(tripData));

        try {
          const saveResponse = await saveTrip(tripData);
          navigate(`/itinerary?id=${saveResponse.data.id}`, { replace: true });
        } catch {
          setTrip(tripData);
        }
      }
    } catch (e) {
      console.error('Failed to load itinerary:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!trip) return;

    try {
      const id = trip._id || trip.id || tripId;

      const response = await API.post(
        `/trip/${id}/export-pdf`,
        {},
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `${trip.destination}_itinerary.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert('Failed to download PDF summary');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDay = (idx) => {
    setExpandedDays((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setShowEditModal(false);
    setLoading(true);

    try {
      const payload = {
        destination: editForm.destination,
        days: Number(editForm.days),
        budget: Number(editForm.budget),
        currency: editForm.currency || 'USD',
        travelers: 1,
        interests: ['Culture']
      };

      const generateResponse = await generateTrip(payload);
      const tripData = generateResponse.data;
      sessionStorage.setItem('current_trip', JSON.stringify(tripData));

      try {
        const saveResponse = await saveTrip(tripData);
        navigate(`/itinerary?id=${saveResponse.data.id}`, { replace: true });
      } catch {
        console.warn('MongoDB save failed for edit. Using session data.');
        navigate(`/itinerary?from=session`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update plan. Please ensure the backend is running.');
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
        message="We encountered a problem loading the itinerary. Please generate a new trip."
      />
    );
  }

  const pins = [
    ...(trip.nearby_attractions || []),
    ...(trip.restaurants || []),
    ...(trip.malls || []),
    ...(trip.movie_theatres || [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-500 dark:text-sky-400">
            Intelligence Report Generated
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-1">
            Trip to {trip.destination}
          </h1>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-4">
            <span>
              Duration:{' '}
              <strong className="text-slate-700 dark:text-slate-300">
                {trip.days} Days
              </strong>
            </span>

            <span>
              Quality Rating:{' '}
              <strong className="text-sky-500">
                {trip.travel_quality_score}%
              </strong>
            </span>

            <span>
              Safety Status:{' '}
              <strong className="text-emerald-500">
                Verified Safe ({trip.safety_score}%)
              </strong>
            </span>
          </p>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Local Weather
                </p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                  {trip.weather_info?.temp ?? 'N/A'}°C
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">
                  {trip.weather_info?.description || 'Weather unavailable'}
                </p>
              </div>

              <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
                <CloudSun size={28} />
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Safety Index
                </p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                  {trip.safety_score}%
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Verified safe transit
                </p>
              </div>

              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Shield size={28} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-sky-500" /> Visually Compiled Timeline
            </h2>

            <div className="space-y-4">
              {(!trip.itinerary?.days || trip.itinerary.days.length === 0) && (
                <div className="glass p-6 rounded-3xl border border-amber-400/30 bg-amber-500/5 text-center space-y-2">
                  <p className="text-sm font-bold text-amber-500">⚠️ Itinerary Unavailable</p>
                  <p className="text-xs text-slate-400">The AI planner couldn't generate a day-by-day plan — this is usually caused by an API rate limit. Please wait a few minutes and try generating the trip again.</p>
                </div>
              )}
              {trip.itinerary?.days?.map((day, dayIdx) => {
                const isExpanded = expandedDays[dayIdx];

                return (
                  <div
                    key={dayIdx}
                    className="glass rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggleDay(dayIdx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-accent rounded-2xl flex items-center justify-center font-bold text-white text-sm">
                          D{dayIdx + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-slate-800 dark:text-white leading-tight">
                              Day {day.day}
                            </h3>
                            {day.weather_forecast && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold rounded-full border border-sky-400/20">
                                <CloudSun size={10} />
                                {day.weather_forecast}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {day.theme}
                          </p>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp size={18} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-400" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80"
                        >
                          <div className="p-6 space-y-6 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                            {(day.safety_risk_assessment || day.dynamic_adjustments) && (
                              <div className="ml-14 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-2 relative z-10">
                                {day.safety_risk_assessment && (
                                  <div className="flex items-start gap-2">
                                    <Shield size={14} className={day.safety_risk_assessment.toLowerCase().includes("low risk") ? "text-emerald-500 mt-0.5" : "text-amber-500 mt-0.5"} />
                                    <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">
                                      <span className="font-extrabold text-slate-700 dark:text-slate-350">Safety Risk: </span>
                                      {day.safety_risk_assessment}
                                    </p>
                                  </div>
                                )}
                                {day.dynamic_adjustments && (
                                  <div className="flex items-start gap-2">
                                    <Info size={14} className="text-rose-500 mt-0.5" />
                                    <p className="text-xs font-bold text-rose-600 dark:text-rose-450">
                                      <span className="font-extrabold">Dynamic Adjustment: </span>
                                      {day.dynamic_adjustments}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                            {day.activities?.map((act, actIdx) => {
                              const actName = typeof act === 'string' ? act : act?.name || '';
                              const actCost = typeof act === 'object' && act !== null ? act.estimated_cost : null;
                              const currSymbol = getCurrencySymbol(trip?.currency || editForm?.currency || 'USD');
                              const showTransit = actIdx < day.activities.length - 1;

                              return (
                                <div key={actIdx} className="space-y-4">
                                  <div className="flex gap-4 relative z-10 items-start">
                                    <div className="w-4 h-4 bg-white dark:bg-slate-950 border-4 border-sky-500 rounded-full flex-shrink-0 mt-1.5 ml-[18px]" />

                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed flex-1">
                                          {actName}
                                        </p>
                                        {actCost !== null && actCost !== undefined && (
                                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                                            actCost === 0
                                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40'
                                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300/40'
                                          }`}>
                                            <Wallet size={9} />
                                            {actCost === 0 ? 'Free' : `${currSymbol}${actCost.toLocaleString()}`}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {showTransit && (
                                    <div className="flex items-center gap-2 pl-14 py-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">
                                      <MapPin size={10} className="text-emerald-500" />
                                      <span>Estimated transit: 20 mins</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Alternate Options Panel */}
                            {day.alternate_options && day.alternate_options.options && day.alternate_options.options.length > 0 && (
                              <div className={`ml-14 mt-2 rounded-2xl border overflow-hidden relative z-10 ${
                                day.alternate_options.has_risk
                                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300/40 dark:border-amber-700/30'
                                  : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/40 dark:border-emerald-700/30'
                              }`}>
                                {/* Header */}
                                <div className={`flex items-center gap-2 px-4 py-2.5 ${
                                  day.alternate_options.has_risk
                                    ? 'bg-amber-100/70 dark:bg-amber-900/30'
                                    : 'bg-emerald-100/70 dark:bg-emerald-900/30'
                                }`}>
                                  {day.alternate_options.has_risk
                                    ? <Umbrella size={13} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                    : <Sun size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  }
                                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                    day.alternate_options.has_risk
                                      ? 'text-amber-700 dark:text-amber-400'
                                      : 'text-emerald-700 dark:text-emerald-400'
                                  }`}>
                                    {day.alternate_options.has_risk ? 'Rain Alert — Indoor Alternatives' : 'Best Picks for Today'}
                                  </span>
                                  <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    day.alternate_options.has_risk
                                      ? 'bg-amber-200 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300'
                                      : 'bg-emerald-200 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300'
                                  }`}>
                                    {day.alternate_options.reason}
                                  </span>
                                </div>

                                {/* Options List */}
                                <div className="divide-y divide-slate-200/60 dark:divide-slate-700/40">
                                  {day.alternate_options.options.map((opt, optIdx) => (
                                    <div
                                      key={optIdx}
                                      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                                        opt.is_best_pick
                                          ? day.alternate_options.has_risk
                                            ? 'bg-amber-100/50 dark:bg-amber-900/20'
                                            : 'bg-emerald-100/50 dark:bg-emerald-900/20'
                                          : 'hover:bg-white/40 dark:hover:bg-slate-800/20'
                                      }`}
                                    >
                                      {/* Icon */}
                                      <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                                        opt.is_best_pick
                                          ? day.alternate_options.has_risk
                                            ? 'bg-amber-200 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300'
                                            : 'bg-emerald-200 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                      }`}>
                                        {opt.type === 'indoor'
                                          ? <Home size={10} />
                                          : <MapPin size={10} />
                                        }
                                      </div>

                                      {/* Text */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                                            {opt.name}
                                          </span>
                                          {opt.is_best_pick && (
                                            <span className={`inline-flex items-center gap-0.5 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                                              day.alternate_options.has_risk
                                                ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300'
                                                : 'bg-emerald-400/20 text-emerald-700 dark:text-emerald-300'
                                            }`}>
                                              <Star size={7} className="fill-current" /> Best Pick
                                            </span>
                                          )}
                                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                                            opt.type === 'indoor'
                                              ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'
                                              : 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
                                          }`}>
                                            {opt.type === 'indoor' ? '🏠 Indoor' : '🌿 Outdoor'}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                          {opt.description}
                                        </p>
                                      </div>

                                      <ArrowRight size={12} className="text-slate-300 dark:text-slate-600 flex-shrink-0 mt-1" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapIcon size={20} className="text-sky-500" /> Map Pin Route Optimization
            </h3>

            <div className="h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapComponent places={pins} />
            </div>
          </div>
        </div>

        <div className="space-y-8">

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
                      <span className="text-slate-800 dark:text-slate-300">
                        {getCurrencySymbol(trip.currency)} {val} ({percentage}%)
                      </span>
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
              <span className="text-xs text-slate-500">
                Total Estimate ({trip.days} days)
              </span>

              <span className="text-lg text-emerald-600 dark:text-emerald-400">
                {getCurrencySymbol(trip.currency)} {trip.budget_breakdown?.total_estimated}
              </span>
            </div>
          </div>

          {trip.risk_summary_table && trip.risk_summary_table.length > 0 && (
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CloudSun size={18} className="text-sky-500" /> Weather Risk & Backup Plans
              </h3>

              <div className="space-y-3">
                {trip.risk_summary_table.map((row, idx) => {
                  let badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400/20";
                  if (row.level === "Moderate") {
                    badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/20";
                  } else if (["High", "Health", "Extreme"].includes(row.level)) {
                    badgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-450/20";
                  }

                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-350">
                          Day {row.day} ({row.date})
                        </span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {row.level} Risk
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                        <p>
                          <span className="font-semibold text-slate-650 dark:text-slate-450">Primary Risk: </span>
                          {row.primary_risk}
                        </p>
                        {row.backup_plan && row.backup_plan !== "None" && (
                          <p>
                            <span className="font-semibold text-slate-650 dark:text-slate-450">Backup Plan: </span>
                            {row.backup_plan}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CheckSquare size={18} className="text-sky-500" /> Packing Checklist
            </h3>

            <div className="space-y-2">
              {(trip.packing_checklist || []).map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-sky-500 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-sky-400 focus:ring-offset-0 mt-0.5"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Film size={18} className="text-sky-500" /> Movie Recommendations
            </h3>

            <div className="space-y-4">
              {(trip.movie_recommendations || []).map((movie, idx) => (
                <div key={idx} className="flex gap-3 items-center group">
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                    <img
                      src={
                        movie.poster_path ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=100&q=80'
                      }
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

          <div className="p-5 rounded-3xl bg-sky-500/5 border border-sky-500/10 text-slate-600 dark:text-slate-400 text-xs italic leading-relaxed">
            <h4 className="font-bold text-sky-500 text-[10px] uppercase tracking-wider mb-2 not-italic flex items-center gap-1">
              <Info size={12} /> Travel Agent Notes
            </h4>
            "{trip.evaluator_feedback}"
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-lg text-slate-800 dark:text-white">
                Modify Travel Plan
              </h3>

              <button
                onClick={() => setShowEditModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">
                  Destination
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Paris, Tokyo, Kochi"
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.destination}
                  onChange={(e) =>
                    setEditForm({ ...editForm, destination: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">
                  Days
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.days}
                  onChange={(e) =>
                    setEditForm({ ...editForm, days: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">
                  Budget
                </label>

                <input
                  type="number"
                  min="1"
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.budget}
                  onChange={(e) =>
                    setEditForm({ ...editForm, budget: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase">
                  Currency
                </label>

                <select
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200"
                  value={editForm.currency}
                  onChange={(e) =>
                    setEditForm({ ...editForm, currency: e.target.value })
                  }
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="AUD">AUD ($)</option>
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