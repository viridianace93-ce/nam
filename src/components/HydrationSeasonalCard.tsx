import React, { useState } from 'react';
import { Droplet, Sparkles, Sun, Leaf, Heart, RotateCw } from 'lucide-react';
import { HydrationSeasonalTip, Ingredient } from '../types';
import { getHydrationSeasonalTips } from '../utils/comboEngine';

interface HydrationSeasonalCardProps {
  selectedIngredients: Ingredient[];
}

export const HydrationSeasonalCard: React.FC<HydrationSeasonalCardProps> = ({
  selectedIngredients,
}) => {
  const tips = getHydrationSeasonalTips(selectedIngredients);
  const [tipIndex, setTipIndex] = useState(0);

  const currentTip: HydrationSeasonalTip = tips[tipIndex % tips.length] || {
    id: 'default-tip',
    badge: '💧 TIP DE HIDRATACIÓN & BIENESTAR',
    title: 'Acompaña tus snacks con un vaso de agua fresca',
    advice:
      'Mantener tu hidratación activa apoya una digestión pausada y ayuda a que los nutrientes y la fibra de tus alimentos se absorban de manera óptima.',
    suggestion: 'Ten siempre un vaso o termo de agua visible y a temperatura agradable.',
    seasonContext: 'Hábito Diario',
    iconType: 'water',
  };

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  const renderIcon = () => {
    switch (currentTip.iconType) {
      case 'leaf':
        return <Leaf className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />;
      case 'sun':
        return <Sun className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />;
      case 'heart':
        return <Heart className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />;
      case 'water':
      default:
        return <Droplet className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />;
    }
  };

  return (
    <div
      id="hydration-seasonal-wellbeing-card"
      className="relative w-full border-2 border-[#1a3300] bg-[#eef8fc] text-[#1a3300] flex flex-col justify-between box-border rounded-[12px] p-3.5 sm:p-4 mb-3.5 shadow-[3px_3px_0px_#1a3300] transition-all"
      style={{
        transform: 'rotate(0.3deg)',
      }}
    >
      {/* Translucent Tape Effect Top Center */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#ffffff]/70 border border-[#1a3300]/30 shadow-sm z-10 pointer-events-none"
        style={{ transform: 'translateX(-50%) rotate(-1deg)' }}
      />

      <div className="w-full">
        {/* Top Badges & Season Context */}
        <div className="flex items-center justify-between gap-2 mb-2 pt-1 border-b border-[#1a3300]/15 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#ffffff] border border-[#1a3300] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1a3300]">
              {renderIcon()}
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#1a3300] tracking-wider truncate">
              {currentTip.badge}
            </span>
          </div>

          {currentTip.seasonContext && (
            <span className="shrink-0 font-mono text-[10px] bg-[#ffffff] px-2 py-0.5 rounded-full border border-[#1a3300]/25 text-[#1a3300]/80">
              {currentTip.seasonContext}
            </span>
          )}
        </div>

        {/* Tip Title */}
        <h3 className="font-display text-base sm:text-[16px] font-bold text-[#1a3300] leading-snug mb-2">
          {currentTip.title}
        </h3>

        {/* Human-Centered Advice */}
        <div className="w-full bg-[#ffffff] border border-[#1a3300]/30 rounded-[8px] p-2.5 sm:p-3 mb-2.5 box-border shadow-[1px_1px_0px_rgba(26,51,0,0.06)]">
          <p className="font-ui text-xs sm:text-[13px] text-[#1a3300]/90 leading-relaxed font-medium">
            {currentTip.advice}
          </p>
        </div>

        {/* Practical Warm Suggestion */}
        <div className="flex items-start gap-2 bg-[#ffffff]/60 border border-[#1a3300]/20 rounded-[7px] px-2.5 py-2 mb-1">
          <span className="text-xs shrink-0 select-none">💡</span>
          <p className="font-ui text-[11px] sm:text-xs text-[#1a3300]/85 leading-snug">
            <strong className="text-[#1a3300]">Sugerencia:</strong> {currentTip.suggestion}
          </p>
        </div>
      </div>

      {/* Footer with Cycle Tip button */}
      {tips.length > 1 && (
        <div className="mt-2 pt-2 border-t border-[#1a3300]/15 w-full flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#1a3300]/60">
            Consejo {((tipIndex % tips.length) + 1)} de {tips.length}
          </span>
          <button
            type="button"
            onClick={handleNextTip}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#1a3300] bg-[#ffffff] hover:bg-[#f1f1f1] px-2.5 py-1 rounded-[6px] border border-[#1a3300] cursor-pointer shadow-[1px_1px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <RotateCw className="w-3 h-3 text-[#1a3300]" />
            <span>Ver otro tip</span>
          </button>
        </div>
      )}
    </div>
  );
};
