import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { travelApi } from '../services/api';
import { Trash2, ExternalLink, Calendar, MapPin, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await travelApi.getTripHistory();
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip intelligence report?")) return;
    try {
      await travelApi.deleteTrip(id);
      setTrips(trips.filter(t => t._id !== id));
    } catch (error) {
      alert("Failed to delete trip");
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-sky-500 mb-4" size={48} />
      <p className="text-slate-400">Accessing archives...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Trip Intelligence History</h1>
        <Link to="/create" className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-bold transition-all">
          New Analysis
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 shadow-xl rounded-3xl border border-white/5">
          <p className="text-slate-400 mb-6">No saved travel reports found.</p>
          <Link to="/create" className="text-sky-400 font-bold hover:underline">Generate your first report now →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div key={trip._id} className="glass rounded-3xl overflow-hidden border border-white/5 group hover:border-sky-500/50 transition-all flex flex-col">
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-sky-500/10 rounded-2xl">
                    <MapPin className="text-sky-400" size={24} />
                  </div>
                  <button 
                    onClick={() => handleDelete(trip._id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-sky-400 transition-colors">{trip.destination}</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={16} />
                    <span>{trip.duration} Days • {trip.travelers} Persons</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="font-bold text-sky-400">{trip.travel_quality_score}%</span>
                    <span>Quality Score</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to={`/trip/${trip._id}`}
                className="w-full py-4 bg-white/5 hover:bg-sky-500 text-center font-bold flex items-center justify-center gap-2 transition-all border-t border-white/5"
              >
                View Intelligence Report <ExternalLink size={18} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
