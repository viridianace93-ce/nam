import React, { useRef, useState, useEffect } from 'react';
import { Ingredient, IngredientCategory } from '../types';
import { CATEGORY_COLORS } from '../utils/categoryColors';
import { motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { FoodIcon } from './FoodIcons';

export interface CategoryCardMeta {
  id: IngredientCategory;
  title: string;
  shortLabel: string;
}

export const CATEGORIES_LIST: CategoryCardMeta[] = [
  { id: 'proteins', title: 'Proteínas', shortLabel: 'Proteínas' },
  { id: 'fruits', title: 'Frutas', shortLabel: 'Frutas' },
  { id: 'vegetables', title: 'Verduras', shortLabel: 'Verduras' },
  { id: 'fats', title: 'Grasas', shortLabel: 'Grasas' },
  { id: 'cereals', title: 'Cereales', shortLabel: 'Cereales' },
];

interface CategoryCarouselProps {
  ingredients: Ingredient[];
  selectedIds: Set<string>;
  onToggleIngredient: (ingredient: Ingredient) => void;
  onUncheckAll?: () => void;
  activeTargetCategory?: IngredientCategory;
  onOpenPreferences?: () => void;
  activeIntolerancesCount?: number;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  ingredients,
  selectedIds,
  onToggleIngredient,
  onUncheckAll,
  activeTargetCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll navigation states
  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    const cardWidth = el.clientWidth * 0.82;
    const newIdx = Math.round(el.scrollLeft / (cardWidth + 10));
    if (newIdx >= 0 && newIdx < CATEGORIES_LIST.length) {
      setActiveCardIndex(newIdx);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  // Programmatic scroll
  useEffect(() => {
    if (!activeTargetCategory) return;
    const targetIdx = CATEGORIES_LIST.findIndex((c) => c.id === activeTargetCategory);
    if (targetIdx !== -1) {
      scrollToIndex(targetIdx);
    }
  }, [activeTargetCategory]);

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.category-compact-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveCardIndex(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeCardIndex - 1);
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(CATEGORIES_LIST.length - 1, activeCardIndex + 1);
    scrollToIndex(nextIdx);
  };

  const totalSelected = selectedIds.size;

  return (
    <div id="category-carousel-container" className="w-full space-y-2.5 box-border">
      {/* Mini Group Selector & Arrows */}
      <div className="flex items-center justify-between gap-1.5 px-0.5">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES_LIST.map((cat, idx) => {
            const isCurrent = activeCardIndex === idx;
            const meta = CATEGORY_COLORS[cat.id];
            const groupSelectedCount = ingredients
              .filter((i) => i.category === cat.id)
              .filter((i) => selectedIds.has(i.id)).length;

            return (
              <button
                key={`tab-${cat.id}`}
                onClick={() => scrollToIndex(idx)}
                type="button"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-[6px] text-[11px] font-ui transition-all cursor-pointer select-none shrink-0 ${
                  isCurrent
                    ? 'bg-[#1a3300] text-[#fcfaf5] font-bold shadow-[1px_1px_0px_#1a3300]'
                    : 'bg-[#ffffff] text-[#1a3300]/80 border border-[#1a3300]/25 hover:border-[#1a3300]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 border border-[#1a3300]/20"
                  style={{ backgroundColor: meta.hex }}
                />
                <span>{cat.shortLabel}</span>
                {groupSelectedCount > 0 && (
                  <span
                    className={`font-mono text-[10px] w-4 h-4 rounded-full font-black leading-none flex items-center justify-center border border-[#1a3300]/20 ${
                      isCurrent ? 'bg-[#ffe95c] text-[#1a3300]' : 'bg-[#1a3300] text-[#ffe95c]'
                    }`}
                  >
                    {groupSelectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className="p-1 rounded-[5px] border border-[#1a3300] bg-[#ffffff] text-[#1a3300] hover:bg-[#f1f1f1] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-[1px_1px_0px_#1a3300]"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollRight}
            className="p-1 rounded-[5px] border border-[#1a3300] bg-[#ffffff] text-[#1a3300] hover:bg-[#f1f1f1] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-[1px_1px_0px_#1a3300]"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Horizontal Scrollable Carousel of Compact Cards */}
      <div
        ref={scrollContainerRef}
        className="w-full flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 px-0.5 box-border"
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          boxSizing: 'border-box',
        }}
      >
        {CATEGORIES_LIST.map((cat, idx) => {
          const meta = CATEGORY_COLORS[cat.id];
          const groupIngredients = ingredients.filter((i) => i.category === cat.id);
          const groupSelected = groupIngredients.filter((i) => selectedIds.has(i.id));
          const selectedCount = groupSelected.length;

          return (
            <div
              key={cat.id}
              id={`carousel-card-${cat.id}`}
              className="category-compact-card snap-center shrink-0 w-[84%] sm:w-[320px] rounded-[12px] border-2 border-[#1a3300] flex flex-col justify-between overflow-hidden shadow-[2.5px_2.5px_0px_#1a3300]"
              style={{
                backgroundColor: meta.cardBg,
                boxSizing: 'border-box',
              }}
            >
              {/* Card Compact Header */}
              <div
                className="px-3 py-2 border-b border-[#1a3300] flex items-center justify-between gap-2"
                style={{
                  backgroundColor: meta.headerBg,
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 border border-[#1a3300]"
                    style={{ backgroundColor: meta.hex }}
                  />
                  <h3 className="font-display text-sm font-black text-[#1a3300] tracking-tight truncate">
                    {cat.title}
                  </h3>
                </div>

                {/* Selected Counter Badge */}
                <div className="shrink-0 flex items-center gap-1">
                  <span
                    className={`font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center border border-[#1a3300] font-black transition-all ${
                      selectedCount > 0
                        ? 'bg-[#1a3300] text-[#ffe95c] shadow-[1.5px_1.5px_0px_#1a3300]'
                        : 'bg-[#ffffff] text-[#1a3300]/60'
                    }`}
                    title={`${selectedCount} seleccionados`}
                  >
                    {selectedCount}
                  </span>
                </div>
              </div>

              {/* Card Body: Compact Ingredient Chips or "Vacío" */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2.5">
                {groupIngredients.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="font-mono text-xs text-[#1a3300]/40">Vacío</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {groupIngredients.map((item) => {
                      const isSelected = selectedIds.has(item.id);

                      return (
                        <button
                          key={`chip-${item.id}`}
                          id={`chip-${item.id}`}
                          type="button"
                          onClick={() => onToggleIngredient(item)}
                          aria-pressed={isSelected}
                          className={`group relative transition-all duration-100 select-none cursor-pointer font-ui box-border flex items-center gap-1.5 active:scale-95 ${
                            isSelected
                              ? 'border-2 border-[#1a3300] text-[#1a3300] font-bold shadow-[1.5px_1.5px_0px_#1a3300]'
                              : 'bg-[#ffffff] border border-[#1a3300]/30 text-[#1a3300] hover:border-[#1a3300] font-medium shadow-[1px_1px_0px_rgba(26,51,0,0.06)]'
                          }`}
                          style={{
                            backgroundColor: isSelected ? meta.chipActiveBg : '#ffffff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: isSelected ? '5px 9px 5px 7px' : '5px 9px',
                            fontSize: '12px',
                            lineHeight: '1.2',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                          }}
                        >
                          {isSelected ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.1 }}
                              className="flex items-center justify-center shrink-0"
                            >
                              <Check className="w-3 h-3 text-[#1a3300]" strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <FoodIcon
                              category={item.category}
                              name={item.name}
                              size={13}
                              className="text-[#1a3300]/70 shrink-0"
                            />
                          )}
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear all helper link if selections exist */}
      {totalSelected > 0 && onUncheckAll && (
        <div className="flex items-center justify-between px-1 pt-0.5">
          <span className="font-mono text-[11px] text-[#1a3300]/70">
            Total seleccionado: <strong>{totalSelected}</strong>
          </span>
          <button
            id="btn-uncheck-all-carousel"
            type="button"
            onClick={onUncheckAll}
            className="text-[11px] font-mono font-bold text-[#1a3300]/70 hover:text-[#1a3300] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-[#1a3300]/70" strokeWidth={1.5} />
            <span>Desmarcar todo</span>
          </button>
        </div>
      )}
    </div>
  );
};
