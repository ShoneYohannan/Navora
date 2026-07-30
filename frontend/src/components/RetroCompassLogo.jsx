import React from 'react';

const RetroCompassLogo = ({ size = 64, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(224,122,95,0.4)]"
      >
        <defs>
          <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E07A5F" />
            <stop offset="50%" stopColor="#C06C54" />
            <stop offset="100%" stopColor="#8C3F2B" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9E79F" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7B1C" />
          </linearGradient>
          <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1A2A40" />
            <stop offset="70%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#050814" />
          </radialGradient>
        </defs>

        {/* Outer Copper Ring */}
        <circle cx="50" cy="50" r="46" fill="url(#compassBg)" stroke="url(#copperGrad)" strokeWidth="3" />
        
        {/* Decorative Gear Teeth */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="6"
            x2="50"
            y2="10"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}

        {/* Inner Gold Pinstripe Ring */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="2, 2" />

        {/* Cardinal Directions */}
        <text x="50" y="18" textAnchor="middle" fill="#E07A5F" fontSize="6" fontWeight="bold" fontFamily="Cinzel, serif">N</text>
        <text x="84" y="52" textAnchor="middle" fill="#D4AF37" fontSize="6" fontWeight="bold" fontFamily="Cinzel, serif">E</text>
        <text x="50" y="86" textAnchor="middle" fill="#D4AF37" fontSize="6" fontWeight="bold" fontFamily="Cinzel, serif">S</text>
        <text x="16" y="52" textAnchor="middle" fill="#D4AF37" fontSize="6" fontWeight="bold" fontFamily="Cinzel, serif">W</text>

        {/* Compass Star / Needle Points */}
        <polygon points="50,22 53,47 50,50 47,47" fill="url(#copperGrad)" />
        <polygon points="50,78 53,53 50,50 47,53" fill="url(#goldGrad)" opacity="0.8" />
        <polygon points="78,50 53,53 50,50 53,47" fill="url(#copperGrad)" opacity="0.9" />
        <polygon points="22,50 47,53 50,50 47,47" fill="url(#goldGrad)" opacity="0.8" />

        {/* Center Emblem Shield with 'P' */}
        <circle cx="50" cy="50" r="14" fill="#0B132B" stroke="url(#copperGrad)" strokeWidth="2" />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fill="url(#goldGrad)"
          fontSize="14"
          fontWeight="900"
          fontFamily="Cinzel, serif"
          className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        >
          P
        </text>
      </svg>
    </div>
  );
};

export default RetroCompassLogo;
