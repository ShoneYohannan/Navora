import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Map, Compass, Shield, CloudSun, CreditCard, Sparkles, 
  MapPin, Calendar, Heart, Wallet, Coffee, Hotel, Utensils, Award, Waypoints
} from 'lucide-react';
import { motion } from 'framer-motion';
import { travelApi } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: 'kochi',
    startDate: new Date().toISOString().split('T')[0],
    duration: 3,
    budget: 'mid-range',
    interest: 'Culture'
  });

  const popularCities = [
    { key: 'kochi', name: 'Kochi', state: 'Kerala', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80', desc: 'Historic spice port featuring colonial mansions and scenic backwaters.' },
    { key: 'munnar', name: 'Munnar', state: 'Kerala', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80', desc: 'Breathtaking tea fields, misty hills, and rich wildlife sanctuaries.' },
    { key: 'alleppey', name: 'Alleppey', state: 'Kerala', image: 'https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=600&q=80', desc: 'A serene lagoon network offering traditional houseboat excursions.' },
    { key: 'wayanad', name: 'Wayanad', state: 'Kerala', image: 'https://images.unsplash.com/photo-1627393100177-b4297e79a5be?auto=format&fit=crop&w=600&q=80', desc: 'Western Ghats forest paradise with ancient caves and waterfalls.' },
    { key: 'goa', name: 'Goa', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', desc: 'Sunny tropical sands, historic baroque cathedrals, and coastal cuisine.' },
    { key: 'jaipur', name: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477584322813-ac8f6453664d?auto=format&fit=crop&w=600&q=80', desc: 'Majestic palaces, astronomical observatories, and royal heritage.' }
  ];

  const features = [
    { icon: Sparkles, title: "Smart Itinerary Generation", desc: "Builds a highly personalized day-by-day itinerary tailored to budget and interests.", color: "text-sky-500 bg-sky-500/10" },
    { icon: Map, title: "Local Attractions Discovery", desc: "Uncover heritage hotspots, ancient museums, and breathtaking viewpoint lookouts.", color: "text-emerald-500 bg-emerald-500/10" },
    { icon: Utensils, title: "Restaurant Recommendations", desc: "Curates authentic regional food places, street cafes, and harbor-side seafood spots.", color: "text-amber-500 bg-amber-500/10" },
    { icon: Hotel, title: "Hotel Suggestions", desc: "Matches travelers with top hostels, mid-range family resorts, or luxury palaces.", color: "text-indigo-500 bg-indigo-500/10" },
    { icon: Award, title: "Event Recommendations", desc: "Finds boat races, art exhibitions, and beach carnivals happening locally.", color: "text-purple-500 bg-purple-500/10" },
    { icon: Waypoints, title: "Route Optimization", desc: "Coordinates coordinates and timings to ensure smooth transit schedules.", color: "text-rose-500 bg-rose-500/10" }
  ];

  const travelPreferences = [
    { id: 'Adventure', label: 'Adventure', icon: Compass },
    { id: 'Family', label: 'Family', icon: Heart },
    { id: 'Nature', label: 'Nature', icon: CloudSun },
    { id: 'Food', label: 'Food', icon: Coffee },
    { id: 'Culture', label: 'Culture', icon: Shield }
  ];

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await travelApi.generateTrip(formData);
      // Saved automatically in API mock layer. Redirect to itinerary page.
      const tripId = response.data.id || response.data._id;
      navigate(`/itinerary?id=${tripId}`);
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("Error generating plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExploreDestinations = () => {
    navigate(`/results?destination=${formData.destination}&days=${formData.duration}&budget=${formData.budget}&date=${formData.startDate}`);
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section with form panel */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column hero typography */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold rounded-full border border-sky-400/20"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI-Powered Local Discovery</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-800 dark:text-white">
            Plan smarter trips with <span className="text-gradient">AI Local Insights</span>.
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
              ].map((src, i) => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src={src} alt="Traveler avatar" />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Joined by <span className="text-slate-800 dark:text-white font-bold">12,000+</span> globetrotters this month
            </p>
          </div>
        </div>

        {/* Right column planner form */}
        <div className="lg:col-span-6 w-full">
          <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl relative">
            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <Compass size={20} className="text-sky-500" /> Start Planning
            </h3>
            
            <form onSubmit={handleGenerateItinerary} className="space-y-6">
              {/* Destination selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">Where to?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-200 appearance-none font-semibold cursor-pointer"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  >
                    <option value="kochi">Kochi, Kerala</option>
                    <option value="munnar">Munnar, Kerala</option>
                    <option value="alleppey">Alleppey, Kerala</option>
                    <option value="wayanad">Wayanad, Kerala</option>
                    <option value="goa">Goa</option>
                    <option value="jaipur">Jaipur, Rajasthan</option>
                  </select>
                </div>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="date"
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-200"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Days Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">Days</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-200"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">Budget</label>
                  <div className="relative">
                    <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-200 cursor-pointer appearance-none"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    >
                      <option value="budget">Budget ($)</option>
                      <option value="mid-range">Mid-range ($$)</option>
                      <option value="luxury">Luxury ($$$)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferences selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">Travel preference</label>
                <div className="flex flex-wrap gap-2">
                  {travelPreferences.map((pref) => {
                    const isSelected = formData.interest === pref.id;
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setFormData({...formData, interest: pref.id})}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                          isSelected
                            ? 'bg-gradient-accent text-white border-transparent shadow-md'
                            : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500/50'
                        }`}
                      >
                        <pref.icon size={13} />
                        <span>{pref.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTAs Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-accent hover:opacity-95 text-white font-bold rounded-2xl text-xs flex justify-center items-center gap-1.5 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                >
                  {loading ? 'Analyzing Destination...' : 'Generate Itinerary'}
                </button>
                
                <button
                  type="button"
                  onClick={handleExploreDestinations}
                  className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs flex justify-center items-center border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                >
                  Explore Destinations
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800/60 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Intelligence at Every Step</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Our travel advisor suite employs multiple helper agents that collaborate to source top attractions, calculate costs, and draft schedules.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 hover:border-sky-500/30 transition-all hover:shadow-lg group flex gap-4">
                <div className={`p-3 rounded-2xl h-fit flex-shrink-0 ${feat.color}`}>
                  <feat.icon size={22} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
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
