import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { LoadingSkeleton, ErrorState } from '../components/FeedbackStates';
import {
  Star,
  Info,
  ShieldAlert,
  ArrowLeft,
  Heart,
  Compass,
  Check
} from 'lucide-react';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = () => {
    setLoading(true);

    try {
      const addedItems =
        JSON.parse(localStorage.getItem('active_added_items')) || [];

      const savedTrip =
        JSON.parse(localStorage.getItem('latest_trip')) || null;

      let allPlaces = [...addedItems];

      if (savedTrip) {
        allPlaces = [
          ...allPlaces,
          ...(savedTrip.nearby_attractions || []),
          ...(savedTrip.restaurants || []),
          ...(savedTrip.malls || []),
          ...(savedTrip.movie_theatres || [])
        ];
      }

      const foundPlace =
        allPlaces.find((item) => String(item.id) === String(id)) ||
        allPlaces.find((item) => item.name === id);

      if (foundPlace) {
        const normalizedPlace = {
          id: foundPlace.id || foundPlace.name,
          name: foundPlace.name || 'Unknown Place',
          category: foundPlace.category || 'Place',
          subCategory: foundPlace.subCategory || foundPlace.address || '',
          destinationName:
            foundPlace.destinationName || savedTrip?.destination || 'Destination',
          description:
            foundPlace.description ||
            foundPlace.snippet ||
            'This place was recommended by Navora AI based on your destination and travel preferences.',
          rating: foundPlace.rating || 'N/A',
          lat: foundPlace.lat,
          lon: foundPlace.lon,
          image:
            foundPlace.image ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
          openingHours: foundPlace.openingHours || 'Open hours may vary',
          estimatedVisitDuration:
            foundPlace.estimatedVisitDuration || '1-2 hours',
          entryFee: foundPlace.entryFee || 'Check locally'
        };

        setPlace(normalizedPlace);

        setNearby(
          allPlaces
            .filter((item) => item.name !== normalizedPlace.name)
            .slice(0, 3)
        );

        const savedIds =
          JSON.parse(localStorage.getItem('active_added_places')) || [];

        setIsAdded(savedIds.includes(normalizedPlace.id));
      }
    } catch (error) {
      console.error('Error loading place details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItinerary = () => {
    const savedIds =
      JSON.parse(localStorage.getItem('active_added_places')) || [];

    let updatedIds;

    if (savedIds.includes(place.id)) {
      updatedIds = savedIds.filter((savedId) => savedId !== place.id);
      setIsAdded(false);
    } else {
      updatedIds = [...savedIds, place.id];
      setIsAdded(true);
    }

    localStorage.setItem('active_added_places', JSON.stringify(updatedIds));

    const sessionItems =
      JSON.parse(localStorage.getItem('active_added_items')) || [];

    let updatedItems;

    if (updatedIds.includes(place.id)) {
      updatedItems = sessionItems.some((item) => item.id === place.id)
        ? sessionItems
        : [...sessionItems, place];
    } else {
      updatedItems = sessionItems.filter((item) => item.id !== place.id);
    }

    localStorage.setItem('active_added_items', JSON.stringify(updatedItems));
  };

  if (loading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (!place) {
    return (
      <ErrorState
        title="Place not found"
        message="This place is not available in the current trip data."
      />
    );
  }

  const galleryImages = [
    place.image,
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="relative h-[450px] w-full bg-slate-900 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center max-w-7xl mx-auto z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 backdrop-blur-md text-white rounded-2xl hover:bg-slate-900 transition-colors border border-white/10 text-xs font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={handleToggleItinerary}
            className={`flex items-center gap-2 px-5 py-2.5 backdrop-blur-md rounded-2xl transition-all text-xs font-bold text-white shadow-lg border border-white/10 ${
              isAdded
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'
            }`}
          >
            {isAdded ? <Check size={16} /> : <Heart size={16} />}
            <span>{isAdded ? 'Added to Itinerary' : 'Save to Itinerary'}</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto z-10 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-sky-500 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-full border border-sky-400/30">
              {place.category}
            </span>

            <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-white/10">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span>{place.rating}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">
            {place.name}
          </h1>

          <p className="text-slate-300 text-sm md:text-base flex items-center gap-1">
            <Compass size={16} className="text-emerald-400" />
            Locality in {place.destinationName}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-sky-500" /> About this Place
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {place.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Opening Hours
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {place.openingHours}
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Estimated Visit
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {place.estimatedVisitDuration}
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Entry Fee
              </p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                {place.entryFee}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Media Gallery
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="h-28 md:h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Location Map
            </h3>

            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapComponent places={[place]} />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldAlert size={14} className="text-sky-500" />
              <span>
                Coordinates:{' '}
                {place.lat ? place.lat.toFixed(4) : 'N/A'},{' '}
                {place.lon ? place.lon.toFixed(4) : 'N/A'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Nearby Recommendations
            </h3>

            <div className="space-y-4">
              {nearby.map((item, index) => (
                <Link
                  key={index}
                  to={`/place/${item.id || item.name}`}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 flex-shrink-0">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate group-hover:text-sky-500 transition-colors">
                      {item.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1">
                      {item.category || item.address || 'Recommended Place'}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 mt-1">
                      <Star size={10} fill="currentColor" />{' '}
                      {item.rating || 'N/A'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;