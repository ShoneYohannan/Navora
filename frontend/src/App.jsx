import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import Itinerary from './pages/Itinerary'
import Dashboard from './pages/Dashboard'
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
            <Route path="/trip/:id" element={<Itinerary />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="py-8 bg-slate-900 border-t border-slate-800 text-center text-slate-400">
          <p>© 2026 TravelMind AI. Your Intelligent Travel Companion.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
