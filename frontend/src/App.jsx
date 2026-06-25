import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import LoadingScreen from './pages/LoadingScreen'
import TravelDashboard from './pages/TravelDashboard'
import SavedTrips from './pages/SavedTrips'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTrip />} />
            <Route path="/loading" element={<LoadingScreen />} />
            <Route path="/dashboard/:id" element={<TravelDashboard />} />
            <Route path="/saved-trips" element={<SavedTrips />} />
          </Routes>
        </main>
        <footer className="py-8 bg-slate-900 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© 2026 Navora AI. Your Multi-Agent Travel Intelligence System.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
