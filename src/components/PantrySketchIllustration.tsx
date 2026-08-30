import React from 'react';

export const PantrySketchIllustration: React.FC = () => {
  return (
    <div
      id="empty-pantry-sketch"
      className="w-full bg-[#fcfaf5] border border-dashed border-[#1a3300]/40 rounded-[10px] p-5 text-center flex flex-col items-center justify-center gap-3 box-border my-2"
    >
      {/* Sketchbook linear drawing of open shelf / pantry / bowl */}
      <div className="relative w-28 h-20 flex items-center justify-center">
        {/* Background highlighter warm wash */}
        <div className="absolute w-20 h-10 bg-[#ffe95c]/60 rounded-[8px] transform -rotate-2 -z-0" />
        <div className="absolute w-12 h-6 bg-[#d5f5c2]/70 rounded-[6px] transform rotate-3 -z-0 translate-x-3 translate-y-2" />

        <svg
          viewBox="0 0 100 70"
          fill="none"
          stroke="#1a3300"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 w-24 h-16"
        >
          {/* Wooden Shelf line */}
          <path d="M10 52 L90 52" strokeWidth="2" />
          <path d="M14 56 L86 56" strokeWidth="1" strokeDasharray="2 2" />

          {/* Jar / Container 1 (Left) */}
          <rect x="20" y="24" width="16" height="26" rx="2" fill="#ffffff" />
          <rect x="22" y="20" width="12" height="4" rx="1" fill="#fcfaf5" />
          <path d="M24 34 L32 34" strokeDasharray="1.5 1.5" />
          <circle cx="28" cy="42" r="2" fill="#1a3300" />

          {/* Fruit / Snack Bowl (Center) */}
          <path d="M44 32 Q58 30 72 32 Q74 46 58 48 Q42 46 44 32 Z" fill="#ffffff" />
          {/* Apple & Berry inside bowl */}
          <circle cx="53" cy="30" r="5" fill="#fcfaf5" />
          <path d="M53 25 Q55 22 58 22" />
          <circle cx="63" cy="32" r="4" fill="#fcfaf5" />

          {/* Tiny spark lines */}
          <path d="M78 18 L82 14" strokeWidth="1.2" />
          <path d="M84 22 L88 22" strokeWidth="1.2" />
          <path d="M16 16 L13 13" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="max-w-sm">
        <p className="font-ui text-xs sm:text-sm font-semibold text-[#1a3300] leading-snug">
          Selecciona al menos 3 ingredientes en tu alacena para desbloquear combinaciones.
        </p>
      </div>
    </div>
  );
};
