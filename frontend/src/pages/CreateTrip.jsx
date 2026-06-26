import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Heart, Loader2 } from 'lucide-react';
import { generateTrip, saveTrip } from '../services/api';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3,
    travelers: 1,
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
        interests: formData.interests
      };
      const response = await generateTrip(payload);
      const saveResponse = await saveTrip(response.data);
      navigate(`/itinerary?id=${saveResponse.data.id}`);
    } catch (error) {
      console.error("Failed to generate trip:", error);
      alert("Error generating trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
        <p className="text-slate-400">Tell us where you want to go and what you love.</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium mb-3 text-slate-300">Where to?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                required
                type="text"
                placeholder="e.g. Paris, Tokyo, New York"
                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300">Days</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300">Travelers</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  min="1"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.travelers}
                  onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300">Budget ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  step="100"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium mb-4 text-slate-300 flex items-center gap-2">
              <Heart size={18} /> Interests
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
