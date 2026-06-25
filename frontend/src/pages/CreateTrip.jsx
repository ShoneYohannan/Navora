import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Heart } from 'lucide-react';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 1000,
    interests: []
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to the loading page with state
    navigate('/loading', { state: { formData } });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 text-gradient">Start Your Journey</h1>
        <p className="text-slate-400">Design your perfect intelligent travel report with Navora AI.</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-300">Where to?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
              <input
                required
                type="text"
                placeholder="e.g. Kochi, Tokyo, Paris"
                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Duration in Days */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-300">Days</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-300">Budget ($ / ₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                <input
                  type="number"
                  step="1"
                  required
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold mb-4 text-slate-300 flex items-center gap-2">
              <Heart size={18} className="text-sky-400" /> Interests
            </label>
            <div className="flex flex-wrap gap-3">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-sky-500/50 hover:text-slate-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-bold flex justify-center items-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.01]"
          >
            Generate Intelligence Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
