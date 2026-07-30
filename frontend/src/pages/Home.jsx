import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Map, Compass, Shield, CloudSun, CreditCard, Sparkles, 
  MapPin, Calendar, Heart, Wallet, Coffee, Hotel, Utensils, Award, Waypoints,
  Clock, Car, Bike, Train, Plane, PersonStanding, Bus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { generateTrip, saveTrip } from '../services/api';

/* ─── Time options (4 AM → 1 AM next day, 30-min steps) ─── */
const buildTimeOptions = () => {
  const opts = [];
  for (let h = 4; h < 24; h++) {
    ['00', '30'].forEach(m => {
      const hh = String(h).padStart(2, '0');
      const period = h < 12 ? 'AM' : 'PM';
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      opts.push({ value: `${hh}:${m}`, label: `${h12}:${m} ${period}` });
    });
  }
  // Add midnight / 1 AM
  opts.push({ value: '00:00', label: '12:00 AM (Midnight)' });
  opts.push({ value: '01:00', label: '1:00 AM' });
  return opts;
};

const ALL_TIMES = buildTimeOptions();

/* ─── Travel mode colors ─── */
const modeColors = {
  walking: { hex: '#FF9F43', selected: 'bg-[#FF9F43] text-white border-transparent shadow-[#FF9F43]/30', hover: 'hover:border-[#FF9F43]/50' },
  car: { hex: '#54A0FF', selected: 'bg-[#54A0FF] text-white border-transparent shadow-[#54A0FF]/30', hover: 'hover:border-[#54A0FF]/50' },
  public_transport: { hex: '#1DD1A1', selected: 'bg-[#1DD1A1] text-white border-transparent shadow-[#1DD1A1]/30', hover: 'hover:border-[#1DD1A1]/50' },
  bicycle: { hex: '#ff6b6b', selected: 'bg-[#ff6b6b] text-white border-transparent shadow-[#ff6b6b]/30', hover: 'hover:border-[#ff6b6b]/50' },
  train: { hex: '#9b5de5', selected: 'bg-[#9b5de5] text-white border-transparent shadow-[#9b5de5]/30', hover: 'hover:border-[#9b5de5]/50' },
  flight: { hex: '#48DBFB', selected: 'bg-[#48DBFB] text-slate-900 border-transparent shadow-[#48DBFB]/30', hover: 'hover:border-[#48DBFB]/50' },
  mixed: { hex: '#f15bb5', selected: 'bg-[#f15bb5] text-white border-transparent shadow-[#f15bb5]/30', hover: 'hover:border-[#f15bb5]/50' },
};

/* ─── Travel preference colors ─── */
const prefColors = {
  Adventure: { hex: '#FF7F50', selected: 'bg-[#FF7F50] text-white border-transparent shadow-[#FF7F50]/30', hover: 'hover:border-[#FF7F50]/50' },
  Family:    { hex: '#FD79A8', selected: 'bg-[#FD79A8] text-white border-transparent shadow-[#FD79A8]/30', hover: 'hover:border-[#FD79A8]/50' },
  Nature:    { hex: '#26DE81', selected: 'bg-[#26DE81] text-slate-900 border-transparent shadow-[#26DE81]/30', hover: 'hover:border-[#26DE81]/50' },
  Food:      { hex: '#FF6B6B', selected: 'bg-[#FF6B6B] text-white border-transparent shadow-[#FF6B6B]/30', hover: 'hover:border-[#FF6B6B]/50' },
  Culture:   { hex: '#00D2D3', selected: 'bg-[#00D2D3] text-slate-900 border-transparent shadow-[#00D2D3]/30', hover: 'hover:border-[#00D2D3]/50' },
};

/* ─── Travel mode options ─── */
const TRAVEL_MODES = [
  { id: 'walking',          label: 'Walking',          icon: PersonStanding },
  { id: 'car',              label: 'Car / Cab',        icon: Car },
  { id: 'public_transport', label: 'Public Transit',   icon: Bus },
  { id: 'bicycle',          label: 'Bicycle',          icon: Bike },
  { id: 'train',            label: 'Train',            icon: Train },
  { id: 'flight',           label: 'Flight',           icon: Plane },
  { id: 'mixed',            label: 'Mixed (Auto)',     icon: Sparkles },
];

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: 'kochi',
    startDate: new Date().toISOString().split('T')[0],
    duration: 3,
    budget: 1500,
    currency: 'USD',
    interest: 'Culture',
    // Timing preferences
    startTime:     '08:00',
    endTime:       '20:00',
    breakfastTime: '07:30',
    lunchTime:     '13:00',
    dinnerTime:    '19:30',
    // Travel mode
    travelMode: 'mixed',
  });

  const popularCities = [
    { key: 'kochi',   name: 'Kochi',   state: 'Kerala',     image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80', desc: 'Historic spice port featuring colonial mansions and scenic backwaters.' },
    { key: 'munnar',  name: 'Munnar',  state: 'Kerala',     image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80', desc: 'Breathtaking tea fields, misty hills, and rich wildlife sanctuaries.' },
    { key: 'alleppey',name: 'Alleppey',state: 'Kerala',     image: 'https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=600&q=80', desc: 'A serene lagoon network offering traditional houseboat excursions.' },
    { key: 'wayanad', name: 'Wayanad', state: 'Kerala',     image: 'https://images.unsplash.com/photo-1627393100177-b4297e79a5be?auto=format&fit=crop&w=600&q=80', desc: 'Western Ghats forest paradise with ancient caves and waterfalls.' },
    { key: 'goa',     name: 'Goa',     state: 'Goa',        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', desc: 'Sunny tropical sands, historic baroque cathedrals, and coastal cuisine.' },
    { key: 'jaipur',  name: 'Jaipur',  state: 'Rajasthan',  image: 'https://images.unsplash.com/photo-1477584322813-ac8f6453664d?auto=format&fit=crop&w=600&q=80', desc: 'Majestic palaces, astronomical observatories, and royal heritage.' }
  ];

  const features = [
    { icon: Sparkles,  title: "Smart Itinerary Generation",    desc: "Builds a highly personalized day-by-day itinerary tailored to budget and interests.",                  color: "text-rose-400 bg-rose-500/10" },
    { icon: Map,       title: "Local Attractions Discovery",    desc: "Uncover heritage hotspots, ancient museums, and breathtaking viewpoint lookouts.",                     color: "text-red-400 bg-red-500/10" },
    { icon: Utensils,  title: "Restaurant Recommendations",     desc: "Curates authentic regional food places, street cafes, and harbor-side seafood spots.",                  color: "text-orange-400 bg-orange-500/10" },
    { icon: Hotel,     title: "Hotel Suggestions",              desc: "Matches travelers with top hostels, mid-range family resorts, or luxury palaces.",                       color: "text-amber-400 bg-amber-500/10" },
    { icon: Award,     title: "Event Recommendations",          desc: "Finds boat races, art exhibitions, and beach carnivals happening locally.",                             color: "text-pink-400 bg-pink-500/10" },
    { icon: Waypoints, title: "Route Optimization",             desc: "Coordinates timings and transit to ensure smooth, personalised schedules.",                             color: "text-red-300 bg-red-400/10" }
  ];

  const travelPreferences = [
    { id: 'Adventure', label: 'Adventure', icon: Compass },
    { id: 'Family',    label: 'Family',    icon: Heart },
    { id: 'Nature',    label: 'Nature',    icon: CloudSun },
    { id: 'Food',      label: 'Food',      icon: Coffee },
    { id: 'Culture',   label: 'Culture',   icon: Shield },
  ];

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        destination:    formData.destination,
        days:           Number(formData.duration),
        budget:         Number(formData.budget),
        currency:       formData.currency,
        travelers:      1,
        interests:      [formData.interest],
        start_date:     formData.startDate,
        start_time:     formData.startTime,
        end_time:       formData.endTime,
        breakfast_time: formData.breakfastTime,
        lunch_time:     formData.lunchTime,
        dinner_time:    formData.dinnerTime,
        travel_mode:    formData.travelMode,
      };

      console.log("Sending payload:", payload);

      const generateResponse = await generateTrip(payload);
      const tripData = generateResponse.data;

      sessionStorage.setItem('current_trip', JSON.stringify(tripData));

      try {
        const saveResponse = await saveTrip(tripData);
        const mongoId = saveResponse.data.id;
        console.log("Trip saved with MongoDB ID:", mongoId);
        navigate(`/itinerary?id=${mongoId}`);
      } catch (saveError) {
        console.warn("MongoDB save failed (DB may not be running). Using session data.", saveError);
        navigate(`/itinerary?from=session`);
      }

    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      if (error.response) {
        console.error("Backend Response:", error.response.data);
      }
      alert("Error generating itinerary. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleExploreDestinations = () => {
    navigate(`/results?destination=${formData.destination}&days=${formData.duration}&budget=${formData.budget}&date=${formData.startDate}`);
  };

  /* ── helpers ── */
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  /* Shared select class */
  const selectCls = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-xs font-semibold input-premium text-slate-800 dark:text-slate-200 cursor-pointer";

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-tr from-[#E63946]/08 via-[#800020]/08 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[25%] right-[-10%] w-[55%] aspect-square rounded-full bg-gradient-to-br from-[#800020]/08 via-[#E63946]/05 to-transparent blur-[160px] pointer-events-none -z-10" />
      
      {/* Hero Section with form panel */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column hero typography */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge-gold"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI-Powered Local Discovery</span>
          </motion.div>
          
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
            style={{ color: '#F8FAFC' }}
          >
            Plan smarter trips with{' '}
            <span className="text-gradient">AI Local Insights</span>.
          </h1>
          
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
            Experience the next generation of travel planning. Our intelligent engine drafts optimized schedules, selects quality hotels, and checks local events.
          </p>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              ].map((src, i) => {
                const borderClass = ["border-[#FF9F43]", "border-[#9b5de5]", "border-[#00F2FE]"][i];
                return (
                  <img 
                    key={i} 
                    className={`w-10 h-10 rounded-full border-2 ${borderClass} object-cover shadow-sm`} 
                    src={src} 
                    alt="Traveler avatar" 
                  />
                );
              })}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Joined by <span className="text-slate-800 dark:text-white font-bold">12,000+</span> globetrotters this month
            </p>
          </div>
        </div>

        {/* Right column planner form */}
        <div className="lg:col-span-6 w-full">
          <div className="bg-white text-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
              <Compass size={22} className="text-sky-500" /> Start Planning
            </h3>
            
            <form onSubmit={handleGenerateItinerary} className="space-y-6">

              {/* ── Destination ── */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider">WHERE TO?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paris, Tokyo, Kochi"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    value={formData.destination}
                    onChange={(e) => set('destination', e.target.value)}
                  />
                </div>
              </div>

              {/* ── Date / Days / Budget / Currency ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider">START DATE</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                    <input
                      type="date"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                      value={formData.startDate}
                      onChange={(e) => set('startDate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Days Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider">DAYS</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    value={formData.duration}
                    onChange={(e) => set('duration', parseInt(e.target.value))}
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider">BUDGET</label>
                  <div className="relative">
                    <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                    <input
                      type="number"
                      min="1"
                      placeholder="Budget"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                      value={formData.budget}
                      onChange={(e) => set('budget', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider">CURRENCY</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer"
                    value={formData.currency}
                    onChange={(e) => set('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="SGD">SGD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              {/* ── Day Timing Row ── */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} /> DAY SCHEDULE (START → END)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5">Day Starts At</p>
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer" value={formData.startTime} onChange={(e) => set('startTime', e.target.value)}>
                      {ALL_TIMES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5">Day Ends At</p>
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer" value={formData.endTime} onChange={(e) => set('endTime', e.target.value)}>
                      {ALL_TIMES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Food Timings Row ── */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils size={12} /> PREFERRED MEAL TIMES
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      ☀️ Breakfast
                    </p>
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer" value={formData.breakfastTime} onChange={(e) => set('breakfastTime', e.target.value)}>
                      {ALL_TIMES.filter(t => {
                        const h = parseInt(t.value.split(':')[0]);
                        return h >= 5 && h <= 11;
                      }).map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      🌤 Lunch
                    </p>
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer" value={formData.lunchTime} onChange={(e) => set('lunchTime', e.target.value)}>
                      {ALL_TIMES.filter(t => {
                        const h = parseInt(t.value.split(':')[0]);
                        return h >= 11 && h <= 15;
                      }).map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      🌙 Dinner
                    </p>
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer" value={formData.dinnerTime} onChange={(e) => set('dinnerTime', e.target.value)}>
                      {ALL_TIMES.filter(t => {
                        const h = parseInt(t.value.split(':')[0]);
                        return h >= 17 && h <= 23;
                      }).map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Travel Mode ── */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Car size={12} /> TRAVEL MODE
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_MODES.map((mode) => {
                    const isSelected = formData.travelMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => set('travelMode', mode.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-500/30 border-transparent'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <mode.icon size={13} className={isSelected ? 'text-white' : 'text-slate-500'} />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Travel Preferences ── */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">TRAVEL PREFERENCE</label>
                <div className="flex flex-wrap gap-2">
                  {travelPreferences.map((pref) => {
                    const isSelected = formData.interest === pref.id;
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => set('interest', pref.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-900 font-bold shadow-md border-transparent'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <pref.icon size={13} className={isSelected ? 'text-slate-900' : 'text-slate-500'} />
                        <span>{pref.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── CTAs Row ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#C9184A] to-[#800020] hover:from-[#A01A3E] hover:to-[#590016] text-white font-bold rounded-2xl text-xs flex justify-center items-center gap-1.5 shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-transform"
                >
                  {loading ? 'Analyzing Destination...' : 'Generate Itinerary'}
                </button>
                
                <button
                  type="button"
                  onClick={handleExploreDestinations}
                  className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-2xl text-xs flex justify-center items-center border border-red-100 transition-colors"
                >
                  Explore Destinations
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section
        style={{ backgroundColor: '#0F172A', borderTop: '1px solid rgba(230,57,70,0.12)', borderBottom: '1px solid rgba(230,57,70,0.12)' }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2
              className="text-3xl font-black tracking-tight"
              style={{ color: '#F8FAFC' }}
            >
              Intelligence at Every Step
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              Our travel advisor suite employs multiple helper agents that collaborate to source top attractions, calculate costs, and draft schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl flex gap-4 transition-all group"
                style={{
                  background: 'rgba(30, 13, 20, 0.6)',
                  border: '1px solid rgba(230, 57, 70, 0.12)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(230,57,70,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(230,57,70,0.12)'; }}
              >
                <div className={`p-3 rounded-2xl h-fit flex-shrink-0 ${feat.color}`}>
                  <feat.icon size={22} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-2">
                  <h3
                    className="font-bold leading-tight"
                    style={{ color: '#F1F5F9' }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: '#94A3B8' }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Slider Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Popular Destinations</h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Explore some of the most sought-after travel locales in India</p>
          </div>
          <Link 
            to="/results?destination=kochi" 
            className="flex items-center gap-1 text-xs font-bold text-sky-500 hover:text-emerald-500 transition-colors"
          >
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCities.map((city) => (
            <div 
              key={city.key}
              className="glass rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 group hover:shadow-xl hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                  <img 
                    src={city.image} 
                    alt={city.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-white">
                    {city.state}
                  </span>
                </div>

                {/* Info and action */}
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight group-hover:text-sky-500 transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {city.desc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => navigate(`/results?destination=${city.key}&days=${formData.duration}&budget=${formData.budget}&date=${formData.startDate}`)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-sky-500 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:bg-sky-500 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
