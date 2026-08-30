import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Plus, Check, X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Ingredient, IngredientCategory, DietaryIntolerance } from '../types';
import {
  inferCategory,
  getCategoryDisplayName,
  normalizeText,
  capitalizeFoodName,
  searchCatalogSuggestions,
} from '../utils/autoCategorize';
import { CatalogFoodItem } from '../data/foodCatalog';
import { CATEGORY_COLORS } from '../utils/categoryColors';
import { FoodIcon } from './FoodIcons';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSmartSearchProps {
  allIngredients: Ingredient[];
  selectedIds: Set<string>;
  onToggleIngredient: (ingredient: Ingredient) => void;
  onSelectIngredient?: (ingredient: Ingredient) => void;
  onAddAndSelectCustomIngredient: (
    name: string,
    category: IngredientCategory,
    extraMeta?: {
      microTag?: string;
      textureTag?: 'suave' | 'crujiente' | 'fresco' | 'neutro';
      intolerances?: DietaryIntolerance[];
    }
  ) => void;
  onCategorySelected?: (category: IngredientCategory) => void;
}

export const GlobalSmartSearch: React.FC<GlobalSmartSearchProps> = ({
  allIngredients,
  selectedIds,
  onToggleIngredient,
  onSelectIngredient,
  onAddAndSelectCustomIngredient,
  onCategorySelected,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = normalizeText(query);
  const formattedQueryName = capitalizeFoodName(query);

  // 1. Matches in user's current pantry (default + custom already added)
  const matchedPantryIngredients = useMemo(() => {
    if (!normalizedQuery) return [];
    return allIngredients.filter((item) => {
      const normName = normalizeText(item.name);
      return normName.includes(normalizedQuery);
    });
  }, [allIngredients, normalizedQuery]);

  // 2. Suggestions from rich food catalog (excluding those already in pantry)
  const matchedCatalogSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    const suggestions = searchCatalogSuggestions(query, 8);
    const existingPantryNorms = new Set(allIngredients.map((i) => normalizeText(i.name)));

    return suggestions.filter((catItem) => {
      const norm = normalizeText(catItem.name);
      return !existingPantryNorms.has(norm);
    });
  }, [query, normalizedQuery, allIngredients]);

  // Check if an exact match exists in either pantry or catalog
  const exactMatchExists = useMemo(() => {
    if (!normalizedQuery) return false;
    const inPantry = allIngredients.some((i) => normalizeText(i.name) === normalizedQuery);
    if (inPantry) return true;
    return matchedCatalogSuggestions.some((c) => normalizeText(c.name) === normalizedQuery);
  }, [allIngredients, matchedCatalogSuggestions, normalizedQuery]);

  // Inferred category for purely custom user inputs
  const predictedCategory = useMemo(() => {
    if (!normalizedQuery) return 'cereals';
    return inferCategory(query);
  }, [query, normalizedQuery]);

  // Combined selectable items list for keyboard navigation
  type DropdownItem =
    | { type: 'pantry'; item: Ingredient }
    | { type: 'catalog'; item: CatalogFoodItem }
    | { type: 'custom'; name: string; category: IngredientCategory };

  const allDropdownItems: DropdownItem[] = useMemo(() => {
    if (!normalizedQuery) return [];
    const items: DropdownItem[] = [];

    // First pantry matches
    for (const p of matchedPantryIngredients) {
      items.push({ type: 'pantry', item: p });
    }

    // Then catalog autocomplete suggestions
    for (const c of matchedCatalogSuggestions) {
      items.push({ type: 'catalog', item: c });
    }

    // Finally custom add option if not exact match
    if (!exactMatchExists && formattedQueryName) {
      items.push({
        type: 'custom',
        name: formattedQueryName,
        category: predictedCategory,
      });
    }

    return items;
  }, [
    normalizedQuery,
    matchedPantryIngredients,
    matchedCatalogSuggestions,
    exactMatchExists,
    formattedQueryName,
    predictedCategory,
  ]);

  // Reset highlight index when query changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  // Compute inline autocomplete ghost suggestion
  const inlineGhostText = useMemo(() => {
    if (!query || allDropdownItems.length === 0) return '';
    const topItem = allDropdownItems[0];
    let topName = '';
    if (topItem.type === 'pantry') topName = topItem.item.name;
    else if (topItem.type === 'catalog') topName = topItem.item.name;

    if (!topName) return '';
    const normTop = normalizeText(topName);
    if (normTop.startsWith(normalizedQuery) && topName.length > query.length) {
      // Return remaining suffix matching original case
      return query + topName.slice(query.length);
    }
    return '';
  }, [query, normalizedQuery, allDropdownItems]);

  // Selection handlers
  const handleSelectPantryItem = (item: Ingredient) => {
    if (onSelectIngredient) {
      onSelectIngredient(item);
    } else {
      onToggleIngredient(item);
    }
    if (onCategorySelected) {
      onCategorySelected(item.category);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectCatalogItem = (catalogItem: CatalogFoodItem) => {
    onAddAndSelectCustomIngredient(catalogItem.name, catalogItem.category, {
      microTag: catalogItem.microTag,
      textureTag: catalogItem.textureTag,
      intolerances: catalogItem.intolerances,
    });
    if (onCategorySelected) {
      onCategorySelected(catalogItem.category);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleCreateCustom = (customName?: string) => {
    const finalName = customName || formattedQueryName;
    if (!finalName) return;
    const cat = predictedCategory;
    onAddAndSelectCustomIngredient(finalName, cat);
    if (onCategorySelected) {
      onCategorySelected(cat);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleExecuteSelectedItem = (item: DropdownItem) => {
    if (item.type === 'pantry') {
      handleSelectPantryItem(item.item);
    } else if (item.type === 'catalog') {
      handleSelectCatalogItem(item.item);
    } else if (item.type === 'custom') {
      handleCreateCustom(item.name);
    }
  };

  // Keyboard navigation for autocomplete & fast selection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (allDropdownItems.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % allDropdownItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (allDropdownItems.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + allDropdownItems.length) % allDropdownItems.length);
      }
    } else if (e.key === 'Tab') {
      // Autocomplete query with top/highlighted item
      if (allDropdownItems.length > 0) {
        e.preventDefault();
        const currentItem = allDropdownItems[highlightedIndex] || allDropdownItems[0];
        let nameToFill = '';
        if (currentItem.type === 'pantry') nameToFill = currentItem.item.name;
        else if (currentItem.type === 'catalog') nameToFill = currentItem.item.name;
        else if (currentItem.type === 'custom') nameToFill = currentItem.name;

        if (nameToFill) {
          setQuery(nameToFill);
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allDropdownItems.length > 0 && highlightedIndex < allDropdownItems.length) {
        handleExecuteSelectedItem(allDropdownItems[highlightedIndex]);
      } else if (query.trim()) {
        handleCreateCustom();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const predictedColor = CATEGORY_COLORS[predictedCategory];

  return (
    <div ref={containerRef} className="relative w-full z-30">
      {/* Search Input Container with Autocomplete Support */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
          <Search className="w-4 h-4 text-[#1a3300]/60" strokeWidth={2.2} />
        </div>

        {/* Ghost text for visual inline autocomplete */}
        {isOpen && inlineGhostText && (
          <div
            className="absolute inset-0 pl-10 pr-10 py-3 pointer-events-none flex items-center text-sm sm:text-base font-ui font-semibold text-[#1a3300]/30 select-none overflow-hidden"
            aria-hidden="true"
          >
            {inlineGhostText}
          </div>
        )}

        <input
          ref={inputRef}
          id="global-smart-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un alimento (ej. Manzana, Yogur griego, Chía)..."
          className="w-full pl-10 pr-10 py-3 rounded-[10px] bg-[#ffffff] border-2 border-[#1a3300] text-sm sm:text-base font-ui font-semibold text-[#1a3300] placeholder:text-[#1a3300]/45 focus:outline-none focus:ring-2 focus:ring-[#ffe95c] shadow-[3px_3px_0px_#1a3300] transition-all relative z-0"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#1a3300]/60 hover:text-[#1a3300] cursor-pointer z-10"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      <AnimatePresence>
        {isOpen && query.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] bg-[#ffffff] border-2 border-[#1a3300] rounded-[10px] shadow-[4px_4px_0px_#1a3300] overflow-hidden z-40 max-h-72 overflow-y-auto box-border divide-y divide-[#e0ded8]"
          >
            {/* Header helper */}
            <div className="px-3 py-1.5 bg-[#f5f3ec] flex items-center justify-between text-[10px] font-mono text-[#1a3300]/70 border-b border-[#1a3300]/15">
              <span>Sugerencias de alimentos</span>
              <span className="flex items-center gap-1 font-bold">
                <CornerDownLeft className="w-2.5 h-2.5" /> Seleccionar
              </span>
            </div>

            {/* List of items */}
            {allDropdownItems.map((dropdownItem, idx) => {
              const isHighlighted = highlightedIndex === idx;

              if (dropdownItem.type === 'pantry') {
                const item = dropdownItem.item;
                const isSelected = selectedIds.has(item.id);
                const color = CATEGORY_COLORS[item.category];

                return (
                  <div
                    key={`pantry-${item.id}`}
                    onClick={() => handleSelectPantryItem(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-[#ffe95c]/30' : 'hover:bg-[#fcfaf5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FoodIcon category={item.category} name={item.name} size={16} className="text-[#1a3300]" />
                      <div className="min-w-0">
                        <span className="font-ui text-sm font-bold text-[#1a3300] truncate block">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#1a3300]/60">
                          En tu alacena
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] border shrink-0 flex items-center gap-1 font-bold"
                        style={{
                          backgroundColor: color.cardBg,
                          borderColor: '#1a3300',
                          color: '#1a3300',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color.hex }} />
                        {getCategoryDisplayName(item.category)}
                      </span>

                      {isSelected ? (
                        <span className="font-mono text-[10px] font-bold text-[#1a3300] bg-[#d5f5c2] px-1.5 py-0.5 rounded-[4px] border border-[#1a3300] flex items-center gap-1 shadow-[1px_1px_0px_#1a3300]">
                          <Check className="w-3 h-3 text-[#1a3300]" />
                          <span>Seleccionado</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-bold text-[#1a3300] bg-[#ffffff] px-2 py-0.5 rounded-[4px] border border-[#1a3300] hover:bg-[#ffe95c] transition-colors shadow-[1px_1px_0px_#1a3300]">
                          + Seleccionar
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              if (dropdownItem.type === 'catalog') {
                const item = dropdownItem.item;
                const color = CATEGORY_COLORS[item.category];

                return (
                  <div
                    key={`catalog-${item.name}`}
                    onClick={() => handleSelectCatalogItem(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-[#ffe95c]/35' : 'hover:bg-[#fcfaf5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#1a3300] text-[#fcfaf5] flex items-center justify-center shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-ui text-sm font-bold text-[#1a3300] truncate block">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#1a3300]/60 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#1a3300]/80" />
                          <span>{item.microTag || 'Alimento verificado'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] border font-bold text-[#1a3300]"
                        style={{
                          backgroundColor: color.headerBg,
                          borderColor: '#1a3300',
                        }}
                      >
                        {getCategoryDisplayName(item.category)}
                      </span>
                    </div>
                  </div>
                );
              }

              if (dropdownItem.type === 'custom') {
                return (
                  <div
                    key={`custom-${dropdownItem.name}`}
                    onClick={() => handleCreateCustom(dropdownItem.name)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3.5 py-2.5 bg-[#fcfaf5] cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                      isHighlighted ? 'bg-[#ffe95c]/40' : 'hover:bg-[#ffffff]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#1a3300] text-[#ffe95c] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1a3300]">
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-ui text-xs font-bold text-[#1a3300] truncate">
                          Añadir a mi alacena: <strong>"{dropdownItem.name}"</strong>
                        </p>
                        <p className="font-mono text-[10px] text-[#1a3300]/60">
                          Se agregará a tu alacena y quedará seleccionado
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] border font-bold text-[#1a3300] shadow-[1px_1px_0px_#1a3300]"
                        style={{
                          backgroundColor: predictedColor.headerBg,
                          borderColor: '#1a3300',
                        }}
                      >
                        → {getCategoryDisplayName(dropdownItem.category)}
                      </span>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
