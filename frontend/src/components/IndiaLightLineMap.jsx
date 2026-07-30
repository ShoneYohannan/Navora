import React, { useState } from 'react';
import { ShieldCheck, Database, Radio, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const mapLocations = [
  { id: 'kochi', name: 'Kochi', cx: 135, cy: 220, type: 'Port & Culture', status: 'SYNCHRONIZED' },
  { id: 'munnar', name: 'Munnar', cx: 155, cy: 210, type: 'Tea Highlands', status: 'ACTIVE GRID' },
  { id: 'alleppey', name: 'Alleppey', cx: 132, cy: 232, type: 'Backwaters', status: 'ACTIVE ROUTE' },
  { id: 'goa', name: 'Goa', cx: 98, cy: 168, type: 'Coastal Heritage', status: 'OPTIMIZED' },
  { id: 'jaipur', name: 'Jaipur', cx: 120, cy: 78, type: 'Royal Forts', status: 'HISTORIC SITE' },
  { id: 'wayanad', name: 'Wayanad', cx: 142, cy: 195, type: 'Spice Trails', status: 'ONLINE' },
];

const IndiaLightLineMap = ({ selectedChannel, onSelectLocation }) => {
  const [hoveredLoc, setHoveredLoc] = useState(null);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[rgba(224,122,95,0.3)] bg-gradient-to-b from-[#0b132b]/80 to-[#070d1e]/90 p-3 shadow-2xl backdrop-blur-md">
      {/* Map Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(212,175,55,0.2)]">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
          <span className="text-[11px] font-retro-tech font-bold uppercase tracking-widest text-[#E07A5F]">
            Status & Integrity Grid
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(224,122,95,0.15)] text-[#FF9F80] border border-[rgba(224,122,95,0.3)]">
          LIVE MAP v4.2
        </span>
      </div>

      {/* SVG Light-Line Map Canvas */}
      <div className="relative h-44 w-full bg-[#060a17] rounded-lg overflow-hidden border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[radial-gradient(#E07A5F_1px,transparent_1px)] [background-size:14px_14px] opacity-15" />

        <svg viewBox="0 0 300 280" className="w-full h-full">
          <defs>
            <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* India & Regional Coastline Outline (Light-line vector style) */}
          <path
            d="M 120 30 L 140 25 L 165 40 L 180 50 L 195 70 L 210 95 L 205 115 L 190 120 L 175 140 L 165 170 L 155 210 L 145 240 L 138 255 L 130 250 L 125 220 L 105 190 L 95 160 L 90 135 L 100 110 L 105 85 L 115 50 Z"
            fill="none"
            stroke="rgba(212, 175, 55, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Additional regional land lines (Asia/Bay of Bengal/Arabian Sea context) */}
          <path
            d="M 60 140 Q 80 180 130 260 M 140 255 Q 180 200 230 130"
            fill="none"
            stroke="rgba(224, 122, 95, 0.15)"
            strokeWidth="1"
          />

          {/* Latitude & Longitude Radial Curves */}
          <circle cx="140" cy="150" r="100" fill="none" stroke="rgba(212,175,55,0.08)" strokeDasharray="2 4" />
          <circle cx="140" cy="150" r="60" fill="none" stroke="rgba(224,122,95,0.08)" strokeDasharray="3 3" />

          {/* Active Travel Network Connecting Lines */}
          <path
            d="M 120 78 L 98 168 L 142 195 L 155 210 L 135 220 L 132 232"
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <path
            d="M 120 78 L 135 220"
            fill="none"
            stroke="rgba(224,122,95,0.25)"
            strokeWidth="1"
          />

          {/* Interactive Pulsing Map Nodes */}
          {mapLocations.map((loc) => {
            const isHovered = hoveredLoc === loc.id;
            const isSelected = selectedChannel?.toLowerCase().includes(loc.id);

            return (
              <g
                key={loc.id}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredLoc(loc.id)}
                onMouseLeave={() => setHoveredLoc(null)}
                onClick={() => onSelectLocation && onSelectLocation(loc)}
              >
                {/* Outer Pulsing Aura */}
                <circle
                  cx={loc.cx}
                  cy={loc.cy}
                  r={isSelected ? 10 : isHovered ? 8 : 6}
                  fill="none"
                  stroke="#E07A5F"
                  strokeWidth="1"
                  opacity={isSelected || isHovered ? "0.9" : "0.4"}
                  className="animate-ping"
                />

                {/* Core Node Circle */}
                <circle
                  cx={loc.cx}
                  cy={loc.cy}
                  r={isSelected ? 5 : 4}
                  fill={isSelected ? '#FF9F80' : isHovered ? '#E07A5F' : '#D4AF37'}
                  filter="url(#glow)"
                />

                {/* Node Label Text */}
                <text
                  x={loc.cx + 7}
                  y={loc.cy + 3}
                  fill={isSelected ? '#FF9F80' : '#EADCC9'}
                  fontSize="8"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="Space Grotesk, sans-serif"
                >
                  {loc.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered / Active Location Tooltip overlay */}
        {hoveredLoc && (
          <div className="absolute top-2 right-2 bg-[#0B132B]/90 border border-[#E07A5F] px-2 py-1 rounded text-[10px] text-[#F4EFE6] font-mono shadow-lg backdrop-blur-sm">
            {mapLocations.find((l) => l.id === hoveredLoc)?.name} • {mapLocations.find((l) => l.id === hoveredLoc)?.type}
          </div>
        )}
      </div>

      {/* Status Bar Indicators */}
      <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.08)] grid grid-cols-3 gap-1 text-[10px] font-retro-tech">
        {/* Indicator 1: ACTIVE */}
        <div className="flex items-center gap-1.5 bg-[rgba(224,122,95,0.08)] px-2 py-1 rounded border border-[rgba(224,122,95,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A5F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07A5F]"></span>
          </span>
          <span className="font-bold text-[#E07A5F] tracking-wide">ACTIVE</span>
        </div>

        {/* Indicator 2: Guides Database */}
        <div className="flex items-center gap-1 bg-[rgba(212,175,55,0.08)] px-2 py-1 rounded border border-[rgba(212,175,55,0.2)] text-[#D4AF37] truncate">
          <Database className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">Guides Active</span>
        </div>

        {/* Indicator 3: AI Integrity 100% */}
        <div className="flex items-center gap-1 bg-[rgba(46,204,113,0.08)] px-2 py-1 rounded border border-[rgba(46,204,113,0.2)] text-[#2ECC71]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2ECC71] flex-shrink-0" />
          <span className="font-bold">AI: 100%</span>
        </div>
      </div>
    </div>
  );
};

export default IndiaLightLineMap;
