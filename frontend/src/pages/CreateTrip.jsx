import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, DollarSign, Heart, Loader2,
  Clock, Utensils, Car
} from 'lucide-react';
import { generateTrip, saveTrip } from '../services/api';

// Generate time options every 30 minutes from 4:00 AM to 11:30 PM
const generateTimeOptions = () => {
  const options = [];
  for (let h = 4; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const minuteStr = m === 0 ? '00' : '30';
      const label = `${hour12}:${minuteStr} ${ampm}`;
      const value = `${String(h).padStart(2, '0')}:${minuteStr}`;
      options.push({ label, value });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

const FOOD_TIME_OPTIONS = [
  { label: 'Early (6:00–7:00 AM)', value: '06:00' },
  { label: 'Standard (7:00–8:00 AM)', value: '07:00' },
  { label: 'Late Morning (9:00–10:00 AM)', value: '09:00' },
];

const LUNCH_OPTIONS = [
  { label: 'Early Lunch (11:30 AM)', value: '11:30' },
  { label: 'Standard (12:00–1:00 PM)', value: '12:00' },
  { label: 'Late Lunch (2:00–3:00 PM)', value: '14:00' },
];

const DINNER_OPTIONS = [
  { label: 'Early Dinner (5:30–6:30 PM)', value: '17:30' },
  { label: 'Standard (7:00–8:00 PM)', value: '19:00' },
  { label: 'Late Dinner (9:00–10:00 PM)', value: '21:00' },
];

const TRAVEL_MODES = [
  { id: 'walking',          label: 'Walking',         icon: '🚶', desc: 'Explore on foot'       },
  { id: 'car',              label: 'Car / Cab',        icon: '🚗', desc: 'Drive or take a taxi'  },
  { id: 'public_transport', label: 'Public Transit',   icon: '🚌', desc: 'Bus, metro & trains'   },
  { id: 'bicycle',          label: 'Bicycle',          icon: '🚲', desc: 'Eco-friendly rides'    },
  { id: 'train',            label: 'Train / Rail',     icon: '🚆', desc: 'Intercity rail travel' },
  { id: 'flight',           label: 'Flight',           icon: '✈️', desc: 'Air travel included'  },
  { id: 'motorcycle',       label: 'Motorcycle',       icon: '🏍️', desc: 'Scooter or motorbike' },
  { id: 'mixed',            label: 'Mixed Modes',      icon: '🔀', desc: 'Best of all options'   },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3,
    travelers: 1,
    budget: 1000,
    interests: [],
    start_time: '08:00',
    end_time: '20:00',
    breakfast_time: '07:00',
    lunch_time: '12:00',
    dinner_time: '19:00',
    travel_mode: 'mixed',
  });

  const availableInterests = ['Sightseeing', 'Food & Dining', 'Shopping', 'Adventure', 'Culture', 'Relaxation', 'Nightlife', 'Museums'];

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        destination: formData.destination,
        days: Number(formData.duration),
        budget: Number(formData.budget),
        currency: "USD",
        travelers: Number(formData.travelers || 1),
        interests: formData.interests,
        start_time: formData.start_time,
        end_time: formData.end_time,
        breakfast_time: formData.breakfast_time,
        lunch_time: formData.lunch_time,
        dinner_time: formData.dinner_time,
        travel_mode: formData.travel_mode,
      };
      const response = await generateTrip(payload);
      const tripData = response.data;

      // Always store in sessionStorage as a fallback
      sessionStorage.setItem('current_trip', JSON.stringify(tripData));

      try {
        const saveResponse = await saveTrip(tripData);
        navigate(`/itinerary?id=${saveResponse.data.id}`);
      } catch (saveError) {
        console.warn("MongoDB save failed. Using session data.", saveError);
        navigate(`/itinerary?from=session`);
      }
    } catch (error) {
      console.error("Failed to generate trip:", error);
      alert("Error generating trip. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const sectionHeading = (icon, label, colorClass) => (
    <div className="flex items-center gap-2 mb-4">
      <span className={colorClass}>{icon}</span>
      <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{label}</h2>
    </div>
  );

  const labelClass = 'block text-sm font-medium mb-2 text-slate-300';
  const selectClass =
    'w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100 text-sm cursor-pointer';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
        <p className="text-slate-400">Tell us where you want to go and how you love to travel.</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* ── Destination ── */}
          <div>
            <label className={labelClass}>Where to?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                required
                type="text"
                placeholder="e.g. Paris, Tokyo, New York"
                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>

          {/* ── Duration / Travelers / Budget ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Days</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Travelers</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  min="1"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Budget ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  step="100"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* ── Daily Schedule Window ── */}
          <div className="glass p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-4">
            {sectionHeading(<Clock size={18} />, 'Daily Schedule Window', 'text-sky-400')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>🌅 Day Starts At</label>
                <select
                  className={selectClass}
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                >
                  {TIME_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>🌙 Day Ends At</label>
                <select
                  className={selectClass}
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                >
                  {TIME_OPTIONS.filter(o => o.value > formData.start_time).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Food Timings ── */}
          <div className="glass p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 space-y-4">
            {sectionHeading(<Utensils size={18} />, 'Preferred Food Timings', 'text-orange-400')}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>🥞 Breakfast</label>
                <select
                  className={selectClass}
                  value={formData.breakfast_time}
                  onChange={(e) => setFormData({ ...formData, breakfast_time: e.target.value })}
                >
                  {FOOD_TIME_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>🍱 Lunch</label>
                <select
                  className={selectClass}
                  value={formData.lunch_time}
                  onChange={(e) => setFormData({ ...formData, lunch_time: e.target.value })}
                >
                  {LUNCH_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>🍽️ Dinner</label>
                <select
                  className={selectClass}
                  value={formData.dinner_time}
                  onChange={(e) => setFormData({ ...formData, dinner_time: e.target.value })}
                >
                  {DINNER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Travel Mode ── */}
          <div className="glass p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
            {sectionHeading(<Car size={18} />, 'Preferred Travel Mode', 'text-emerald-400')}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRAVEL_MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, travel_mode: mode.id })}
                  className={`flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl border transition-all text-center ${
                    formData.travel_mode === mode.id
                      ? 'bg-sky-500/20 border-sky-500 text-white shadow-lg shadow-sky-500/10 scale-105'
                      : 'bg-transparent border-white/10 text-slate-400 hover:border-sky-500/40 hover:text-slate-200'
                  }`}
                >
                  <span className="text-2xl">{mode.icon}</span>
                  <span className="text-xs font-bold leading-tight">{mode.label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Interests ── */}
          <div>
            <label className="block text-sm font-medium mb-4 text-slate-300 flex items-center gap-2">
              <Heart size={18} className="text-pink-400" /> Interests
            </label>
            <div className="flex flex-wrap gap-3">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-6 py-2 rounded-full border transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-sky-500 border-sky-500 text-white'
                      : 'bg-transparent border-white/10 text-slate-400 hover:border-sky-500/50'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white rounded-2xl font-bold flex justify-center items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing & Planning...
              </>
            ) : (
              'Generate Intelligence Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
