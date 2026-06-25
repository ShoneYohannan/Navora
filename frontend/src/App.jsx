import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import PlaceDetails from './pages/PlaceDetails';
import Itinerary from './pages/Itinerary';
import SavedTrips from './pages/SavedTrips';
import Assistant from './pages/Assistant';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex flex-col transition-colors duration-300">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/place/:id" element={<PlaceDetails />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/saved-trips" element={<SavedTrips />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
