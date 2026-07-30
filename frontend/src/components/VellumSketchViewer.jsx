import React, { useState } from 'react';
import { Compass, BookOpen, Volume2, Sparkles, MapPin, ExternalLink, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sketchLandmarks = [
  {
    id: 'temple',
    title: 'South Indian Temple Architecture',
    subtitle: 'Dravidian Architecture & Stone Carvings',
    location: 'Kerala & Tamil Realm',
    coordinates: '9.9686° N, 76.2415° E',
    details: 'Complex multi-tiered Dravidian Gopuram featuring intricate granite carvings of ancient deities, rhythmic pillars, and sanctum sanctuaries steeped in Vedic tradition.',
    audioSnippet: 'Soundscape: Temple bells, coastal morning chant, and sea breeze.',
    icon: '⛩️',
    prompt: 'Tell me about ancient South Indian temple architecture and spiritual routes.'
  },
  {
    id: 'houseboat',
    title: 'Kerala Traditional Kettuvallam',
    subtitle: 'Vembanad Lake & Backwater Houseboats',
    location: 'Alleppey & Kumarakom',
    coordinates: '9.4981° N, 76.3388° E',
    details: 'Handcrafted wooden vessels assembled without a single metal nail using Anjili wood and coir ropes, covered with bamboo and palm leaves for serene inland navigation.',
    audioSnippet: 'Soundscape: Gentle water lap against teak wood & tropical bird calls.',
    icon: '⛵',
    prompt: 'What is the best 2-day houseboat tour itinerary in Alleppey backwaters?'
  },
  {
    id: 'gateway',
    title: 'Historic Gateway & Coastal Ports',
    subtitle: 'Colonial & Maritime Heritage',
    location: 'Kochi & Western Coast',
    coordinates: '9.9678° N, 76.2403° E',
    details: 'Grand coastal gateway arches standing guard over ancient spice trading routes, where Portuguese, Dutch, and British merchant maritime history intermingles.',
    audioSnippet: 'Soundscape: Ships horn, harbor waves, and market chatter.',
    icon: '🏛️',
    prompt: 'What are the top historical sites and colonial landmarks in Fort Kochi?'
  },
  {
    id: 'fort',
    title: 'Jaipur Royal Forts & Palaces',
    subtitle: 'Rajput Splendor & Terracotta Walls',
    location: 'Jaipur, Rajasthan',
    coordinates: '26.9124° N, 75.7873° E',
    details: 'Majestic sandstone ramparts, lattice balconies, and ornate courtyards built atop craggy hills, echoing centuries of regal royal history.',
    audioSnippet: 'Soundscape: Rajasthani sitar notes & desert wind chimes.',
    icon: '🏰',
    prompt: 'Guide me through Jaipur fort tours and local handicraft bazaars.'
  }
];

const VellumSketchViewer = ({ onSelectPrompt }) => {
  const [activeSketch, setActiveSketch] = useState(sketchLandmarks[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  return (
    <div className="relative rounded-2xl retro-vellum p-5 md:p-6 border-gold-pinstripe overflow-hidden my-4">
      {/* Decorative Vintage Stamp / Header watermark */}
      <div className="flex items-center justify-between border-b-2 stroke-amber-900/20 pb-3 mb-4 border-[#D4AF37]/30">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#8C3F2B]" />
          <div>
            <h3 className="font-cinzel font-bold text-sm tracking-widest text-[#5C2C1E] uppercase">
              Curated Sketch Register • Pastano Collection
            </h3>
            <p className="text-[11px] font-serif-journal italic text-[#7C4A38]">
              Archival Graphite & Ink Studies of Indian Architectural Wonders
            </p>
          </div>
        </div>

        {/* Vintage Seal Stamp */}
        <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full border-2 border-dashed border-[#8C3F2B]/40 text-[#8C3F2B] font-cinzel font-bold text-[9px] text-center p-1 leading-tight transform rotate-[-8deg] bg-[#F4EFE6]">
          PASTANO SEAL 1924
        </div>
      </div>

      {/* Main Sketch Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: High-Quality Artwork Display */}
        <div className="lg:col-span-7 relative group rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-xl bg-[#FAF6EF]">
          <img
            src="/assets/vintage_landmarks_sketch.png"
            alt="Hand-drawn sketch of Indian landmarks"
            className="w-full h-56 sm:h-64 lg:h-72 object-cover mix-blend-multiply opacity-90 contrast-125 filter transition-transform duration-700 group-hover:scale-105"
          />

          {/* Vignette Overlay & Grain */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E]/60 via-transparent to-transparent pointer-events-none" />

          {/* Hotspot Pins over Image */}
          <div className="absolute inset-0 p-4 flex flex-wrap justify-around items-center">
            {sketchLandmarks.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveSketch(item)}
                className={`relative px-2.5 py-1 rounded-full text-[11px] font-serif-journal font-bold transition-all duration-300 flex items-center gap-1.5 shadow-md ${
                  activeSketch.id === item.id
                    ? 'bg-[#8C3F2B] text-[#FAF7F2] scale-110 ring-2 ring-[#D4AF37]'
                    : 'bg-[#FAF7F2]/90 text-[#3D251E] hover:bg-[#8C3F2B] hover:text-[#FAF7F2]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Location Badge bottom left */}
          <div className="absolute bottom-3 left-3 bg-[#FAF7F2]/95 border border-[#8C3F2B]/40 px-3 py-1.5 rounded-md shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs font-serif-journal font-bold text-[#3D251E]">
              <MapPin className="w-3.5 h-3.5 text-[#8C3F2B]" />
              <span>{activeSketch.title}</span>
            </div>
            <p className="text-[10px] font-mono text-[#7C4A38]">{activeSketch.coordinates}</p>
          </div>
        </div>

        {/* Right: Detailed Archival Text & Audio Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#F4EFE6] p-4 rounded-xl border border-[#D4AF37]/30 shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-cinzel font-bold tracking-widest text-[#8C3F2B] uppercase bg-[#EADCC9] px-2 py-0.5 rounded border border-[#8C3F2B]/20">
                {activeSketch.location}
              </span>
              <span className="text-xl">{activeSketch.icon}</span>
            </div>

            <h4 className="font-serif-journal font-bold text-lg text-[#2C221E] leading-tight mb-1">
              {activeSketch.title}
            </h4>
            <p className="text-xs font-serif-journal italic text-[#7C4A38] mb-3">
              {activeSketch.subtitle}
            </p>

            <p className="text-xs font-serif-journal text-[#3D2C24] leading-relaxed mb-4 border-l-2 border-[#8C3F2B] pl-3 py-0.5">
              "{activeSketch.details}"
            </p>
          </div>

          {/* Audio Snippet & Action Button */}
          <div className="pt-3 border-t border-[#D4AF37]/30 space-y-2.5">
            <button
              onClick={toggleAudio}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#EADCC9] hover:bg-[#E2D2BC] text-[#3D2C24] text-xs font-serif-journal transition-all border border-[#8C3F2B]/20"
            >
              <div className="flex items-center gap-2">
                <Volume2 className={`w-4 h-4 text-[#8C3F2B] ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span className="truncate">{isPlayingAudio ? 'Playing Archival Audio...' : activeSketch.audioSnippet}</span>
              </div>
              <span className="text-[10px] font-mono text-[#8C3F2B] uppercase font-bold">
                {isPlayingAudio ? 'PAUSE' : 'LISTEN'}
              </span>
            </button>

            <button
              onClick={() => onSelectPrompt && onSelectPrompt(activeSketch.prompt)}
              className="w-full py-2 px-3 rounded-lg bg-[#8C3F2B] hover:bg-[#723222] text-[#FAF7F2] text-xs font-serif-journal font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F9E79F] group-hover:rotate-12 transition-transform" />
              <span>Explore this with Pastano AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VellumSketchViewer;
