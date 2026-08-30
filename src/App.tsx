import React, { useState, useMemo, useEffect } from 'react';
import { Ingredient, IngredientCategory, SnackCardData, UserProfile, AuthProvider, DietaryIntolerance } from './types';
import { DEFAULT_INGREDIENTS, INTOLERANCE_OPTIONS } from './data/defaultPantry';
import { generateSnackCombinations } from './utils/comboEngine';
import { getCategoryDisplayName, capitalizeFoodName, normalizeText } from './utils/autoCategorize';
import { Header } from './components/Header';
import { GlobalSmartSearch } from './components/GlobalSmartSearch';
import { CategoryCarousel } from './components/CategoryCarousel';
import { StickySnackCard } from './components/StickySnackCard';
import { HydrationSeasonalCard } from './components/HydrationSeasonalCard';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileAuthModal } from './components/ProfileAuthModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { PantrySketchIllustration } from './components/PantrySketchIllustration';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, RotateCw, Sparkles, X, Star } from 'lucide-react';

const STORAGE_KEYS = {
  CUSTOM_INGREDIENTS: 'nam_custom_ingredients',
  FAVORITES: 'nam_favorites',
  FAVORITE_CARDS: 'nam_favorite_cards',
  USER_PROFILE: 'nam_user_profile',
  SELECTED_IDS: 'nam_selected_pantry_ids',
  RECENT_HISTORY: 'nam_recent_history',
};

export default function App() {
  // View state: 'select' (inventory input) or 'results' (suggested snacks)
  const [viewState, setViewState] = useState<'select' | 'results'>('select');

  // Always start on the create-profile screen. Closing it only hides it for this visit.
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Profile Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Favorites Modal / Drawer state
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isLoggedIn: false,
    name: '',
    email: '',
    provider: 'guest',
  });

  // Recent History (last 3 generated snack combos)
  const [recentHistory, setRecentHistory] = useState<SnackCardData[]>([]);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom ingredients loaded from localStorage
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);

  // Selected ingredient IDs (Persistente en recarga)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Favorites list (card titles or ids & saved card objects)
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [savedFavoriteCards, setSavedFavoriteCards] = useState<SnackCardData[]>([]);

  // Active Category Segmented Tab state
  const [activeCategoryTab, setActiveCategoryTab] = useState<IngredientCategory>('proteins');

  // Offset for multi-combination pagination / shuffle
  const [comboOffset, setComboOffset] = useState<number>(0);
  const [dismissedComboIds, setDismissedComboIds] = useState<Set<string>>(new Set());

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      // 1. Load Custom Ingredients
      const storedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_INGREDIENTS);
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed)) {
          setCustomIngredients(parsed);
        }
      }

      // 3. Load Selected Pantry IDs
      const storedSelected = localStorage.getItem(STORAGE_KEYS.SELECTED_IDS);
      if (storedSelected) {
        const parsedSelected = JSON.parse(storedSelected);
        if (Array.isArray(parsedSelected)) {
          setSelectedIds(new Set(parsedSelected));
        }
      }

      // 4. Load Favorites
      const storedFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavs) {
        const parsedFavs = JSON.parse(storedFavs);
        if (Array.isArray(parsedFavs)) {
          setFavorites(new Set(parsedFavs));
        }
      }

      const storedFavCards = localStorage.getItem(STORAGE_KEYS.FAVORITE_CARDS);
      if (storedFavCards) {
        const parsedFavCards = JSON.parse(storedFavCards);
        if (Array.isArray(parsedFavCards)) {
          setSavedFavoriteCards(parsedFavCards);
        }
      }

      // 5. Load Profile
      const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed) {
          setUserProfile(parsed);
        }
      }

      // 6. Load Recent History
      const storedHistory = localStorage.getItem(STORAGE_KEYS.RECENT_HISTORY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setRecentHistory(parsedHistory.slice(0, 3));
        }
      }
    } catch (e) {
      console.warn('LocalStorage access note:', e);
    }
  }, []);

  // Save selected IDs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_IDS, JSON.stringify(Array.from(selectedIds)));
    } catch (e) {
      console.warn(e);
    }
  }, [selectedIds]);

  // Complete Onboarding (profile stays saved; welcome can show again on next visit)
  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
  };

  // Trigger brief toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Combined ingredients (defaults + stored custom items)
  const allIngredients = useMemo(() => {
    return [...DEFAULT_INGREDIENTS, ...customIngredients];
  }, [customIngredients]);

  // Active dietary intolerances from profile
  const activeIntolerances = useMemo(() => {
    return userProfile.intolerances || [];
  }, [userProfile.intolerances]);

  // Filtered ingredients according to user's dietary preferences / intolerances
  const kitchenIngredients = useMemo(() => {
    if (activeIntolerances.length === 0) return allIngredients;
    return allIngredients.filter(
      (item) => !item.intolerances?.some((into) => activeIntolerances.includes(into))
    );
  }, [allIngredients, activeIntolerances]);

  // Selected Ingredient objects
  const selectedIngredients = useMemo(() => {
    return allIngredients.filter((i) => selectedIds.has(i.id));
  }, [allIngredients, selectedIds]);

  // Habilita el botón "Armar snacks" cuando hay al menos 3 ingredientes seleccionados en total
  const isSelectionValid = selectedIngredients.length >= 3;

  // Toggle ingredient selection
  const handleToggleIngredient = (item: Ingredient) => {
    setComboOffset(0);
    setDismissedComboIds(new Set());
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.SELECTED_IDS, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  // Explicitly select an ingredient (ensuring it's checked and active in pantry)
  const handleSelectIngredient = (item: Ingredient) => {
    setComboOffset(0);
    setDismissedComboIds(new Set());
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      try {
        localStorage.setItem(STORAGE_KEYS.SELECTED_IDS, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    showToast(`✓ "${item.name}" seleccionado`);
  };

  // Reset pantry selection
  const handleReset = () => {
    setComboOffset(0);
    setDismissedComboIds(new Set());
    setSelectedIds(new Set());
    try {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_IDS);
    } catch (e) {
      console.warn(e);
    }
    showToast('Selección desmarcada');
  };

  // Reset entire pantry and selections (clearing all saved state)
  const handleResetPantryToDefault = () => {
    setComboOffset(0);
    setDismissedComboIds(new Set());
    setSelectedIds(new Set());
    setCustomIngredients([]);
    setFavorites(new Set());
    setSavedFavoriteCards([]);
    setRecentHistory([]);
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    showToast('Alacena vaciada y lista para empezar');
  };

  // Add custom ingredient, store in localStorage, and automatically select it
  const handleAddIngredient = (newItem: Ingredient) => {
    const updated = [...customIngredients, newItem];
    setCustomIngredients(updated);
    setDismissedComboIds(new Set());
    setSelectedIds((prev) => {
      const next = new Set(prev).add(newItem.id);
      try {
        localStorage.setItem(STORAGE_KEYS.SELECTED_IDS, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INGREDIENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    showToast(`✓ "${newItem.name}" agregado a tu alacena`);
  };

  // Add custom ingredient with auto-categorization and select it
  const handleAddAndSelectCustomIngredient = (
    name: string,
    category: IngredientCategory,
    extraMeta?: {
      microTag?: string;
      textureTag?: 'suave' | 'crujiente' | 'fresco' | 'neutro';
      intolerances?: DietaryIntolerance[];
    }
  ) => {
    const formattedName = capitalizeFoodName(name);
    const norm = normalizeText(formattedName);

    // Check if ingredient already exists in kitchenIngredients (default or custom)
    const existing = kitchenIngredients.find((i) => normalizeText(i.name) === norm);
    if (existing) {
      handleSelectIngredient(existing);
      setActiveCategoryTab(existing.category);
      return;
    }

    const newItem: Ingredient = {
      id: `custom-${norm.replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`,
      name: formattedName,
      category: category,
      microTag: extraMeta?.microTag || getCategoryDisplayName(category),
      textureTag: extraMeta?.textureTag || 'fresco',
      intolerances: extraMeta?.intolerances,
      isCustom: true,
    };
    handleAddIngredient(newItem);
    setActiveCategoryTab(category);
  };

  // Generate proportional combinations (3, 4 and up to 5 ingredients)
  const snackCombos: SnackCardData[] = useMemo(() => {
    if (!isSelectionValid) return [];
    return generateSnackCombinations(selectedIngredients);
  }, [selectedIngredients, isSelectionValid]);

  // Active combos filtering out dismissed suggestions
  const activeSnackCombos: SnackCardData[] = useMemo(() => {
    return snackCombos.filter((c) => !dismissedComboIds.has(c.id));
  }, [snackCombos, dismissedComboIds]);

  // Display balanced snack options (up to 4 at a time with shuffle)
  const displayedCombos: SnackCardData[] = useMemo(() => {
    if (activeSnackCombos.length <= 4) {
      return activeSnackCombos;
    }
    const countToShow = 4;
    const items: SnackCardData[] = [];
    for (let i = 0; i < countToShow; i++) {
      const idx = (comboOffset + i) % activeSnackCombos.length;
      items.push(activeSnackCombos[idx]);
    }
    return items;
  }, [activeSnackCombos, comboOffset]);

  const remainingComboCount = Math.max(0, activeSnackCombos.length - 4);

  const handleShuffleCombos = () => {
    if (activeSnackCombos.length > 0) {
      setComboOffset((prev) => (prev + 4) % activeSnackCombos.length);
      showToast('↻ Combinaciones barajadas');
    }
  };

  const handleDismissCombo = (cardId: string) => {
    setDismissedComboIds((prev) => new Set(prev).add(cardId));
    showToast('✕ Sugerencia descartada');
  };

  const handleRestoreDismissedCombos = () => {
    setDismissedComboIds(new Set());
    showToast('↺ Sugerencias restauradas');
  };

  // Switch to Results
  const handleVerOpciones = () => {
    if (!isSelectionValid) return;
    setComboOffset(0);
    setViewState('results');

    // Save generated combos to recent history (up to 3 items)
    if (snackCombos.length > 0) {
      setRecentHistory((prev) => {
        const topGenerated = snackCombos.slice(0, 3);
        const merged: SnackCardData[] = [];
        const seenTitles = new Set<string>();

        // Prioritize newest generated options
        for (const item of topGenerated) {
          if (!seenTitles.has(item.title)) {
            merged.push(item);
            seenTitles.add(item.title);
          }
        }
        for (const item of prev) {
          if (!seenTitles.has(item.title) && merged.length < 3) {
            merged.push(item);
            seenTitles.add(item.title);
          }
        }
        const updatedHistory = merged.slice(0, 3);
        try {
          localStorage.setItem(STORAGE_KEYS.RECENT_HISTORY, JSON.stringify(updatedHistory));
        } catch (e) {
          console.warn(e);
        }
        return updatedHistory;
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select and reload snack combo from Recent History or Favorites
  const handleSelectLoadedCombo = (combo: SnackCardData) => {
    setShowProfileModal(false);
    setShowFavoritesModal(false);

    // Match ingredient IDs by name from allIngredients
    const matchingIds: string[] = [];
    combo.formula.forEach((formulaItem) => {
      const match = allIngredients.find(
        (i) => i.name.toLowerCase().trim() === formulaItem.name.toLowerCase().trim()
      );
      if (match) {
        matchingIds.push(match.id);
      }
    });

    if (matchingIds.length > 0) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        matchingIds.forEach((id) => next.add(id));
        return next;
      });
    }

    setViewState('results');
    showToast(`✓ Snack cargado: ${combo.title}`);
  };

  // Clear Recent History
  const handleClearRecentHistory = () => {
    setRecentHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_HISTORY);
    } catch (e) {
      console.warn(e);
    }
    showToast('Historial reciente limpiado');
  };

  // Back to Selection
  const handleBackToSelect = () => {
    setViewState('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite snack card
  const handleToggleFavorite = (card: SnackCardData) => {
    const cardId = card.id;
    setFavorites((prev) => {
      const next = new Set(prev);
      const isNowFav = !next.has(cardId);

      if (isNowFav) {
        next.add(cardId);
        setSavedFavoriteCards((prevCards) => {
          const updated = [card, ...prevCards.filter((c) => c.id !== cardId)];
          try {
            localStorage.setItem(STORAGE_KEYS.FAVORITE_CARDS, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        });
        showToast(`❤️ Guardado en tus Favoritos`);
      } else {
        next.delete(cardId);
        setSavedFavoriteCards((prevCards) => {
          const updated = prevCards.filter((c) => c.id !== cardId);
          try {
            localStorage.setItem(STORAGE_KEYS.FAVORITE_CARDS, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        });
        showToast(`Removido de Favoritos`);
      }

      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  return (
    <div
      id="app-root"
      className="min-h-screen bg-[#fcfaf5] text-[#1a3300] font-ui antialiased flex flex-col items-center selection:bg-[#d5f5c2] selection:text-[#1a3300]"
      style={{
        backgroundColor: '#fcfaf5',
        color: '#1a3300',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-3 z-[100] bg-[#1a3300] text-[#fcfaf5] px-4 py-2 rounded-[8px] border border-[#1a3300] shadow-[3px_3px_0px_rgba(26,51,0,0.3)] text-xs font-ui font-semibold flex items-center gap-2 pointer-events-none"
            style={{
              position: 'fixed',
              top: '16px',
              zIndex: 100,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffe95c]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sticky Header: Logo, Favorites (⭐), Onboarding Help (?), and Profile */}
      <Header
        onOpenAuthModal={() => setShowProfileModal(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenFavorites={() => setShowFavoritesModal(true)}
        favoritesCount={savedFavoriteCards.length}
        userProfile={userProfile}
      />

      {/* Main Responsive Content Container with Airy Spacing */}
      <main
        id="main-content"
        className="w-full max-w-[500px] sm:max-w-[540px] px-4 sm:px-6 py-6 md:py-8 flex-1 flex flex-col items-center gap-y-6 box-border"
        style={{
          width: '100%',
          maxWidth: '540px',
          boxSizing: 'border-box',
        }}
      >
        <AnimatePresence mode="wait">
          {viewState === 'select' ? (
            /* ========================================================================= */
            /* VISTA DE SELECCIÓN / ALACENA ACTIVA                                      */
            /* ========================================================================= */
            <motion.div
              key="view-select"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-y-6 w-full box-border"
            >
              {/* 1. Bloque de Instrucción y Buscador Principal (Texto -> Buscador con gap-y-4) */}
              <div className="w-full flex flex-col gap-y-3 sm:gap-y-4">
                <div className="px-1">
                  <p className="font-ui text-sm sm:text-base font-medium text-[#1a3300]/90 leading-snug">
                    {userProfile.name && userProfile.name !== 'Mi Perfil' && userProfile.name !== 'Mi Alacena'
                      ? `¡Hola, ${userProfile.name}! Busca o selecciona los alimentos que tienes en tu alacena o cocina para descubrir combinaciones equilibradas.`
                      : 'Busca o selecciona los alimentos que tienes en tu alacena o cocina para descubrir combinaciones equilibradas.'}
                  </p>
                </div>

                <GlobalSmartSearch
                  allIngredients={kitchenIngredients}
                  selectedIds={selectedIds}
                  onToggleIngredient={handleToggleIngredient}
                  onSelectIngredient={handleSelectIngredient}
                  onAddAndSelectCustomIngredient={handleAddAndSelectCustomIngredient}
                  onCategorySelected={(cat) => setActiveCategoryTab(cat)}
                />
              </div>

              {/* 2. Carrusel de Grupos de Alimentos (Categorías sin cocción) */}
              <section id="smart-pantry-section" className="w-full box-border">
                <CategoryCarousel
                  ingredients={kitchenIngredients}
                  selectedIds={selectedIds}
                  onToggleIngredient={handleToggleIngredient}
                  onUncheckAll={handleReset}
                  activeTargetCategory={activeCategoryTab}
                  onOpenPreferences={() => setShowProfileModal(true)}
                  activeIntolerancesCount={activeIntolerances.length}
                />
              </section>

              {/* 3. Bandeja de Selección / Estado & Botón de Acción Principal */}
              <div className="pt-2 flex flex-col gap-y-4 w-full box-border">
                {selectedIngredients.length < 3 && (
                  <PantrySketchIllustration />
                )}

                {selectedIngredients.length > 0 && (
                  <div className="bg-[#ffffff] border-2 border-[#1a3300] rounded-[10px] p-3.5 flex flex-col gap-y-2.5 shadow-[2px_2px_0px_#1a3300]">
                    <div className="flex items-center justify-between font-mono text-xs text-[#1a3300]">
                      <span className="font-bold">
                        Seleccionados ({selectedIds.size}) {selectedIds.size < 3 && `· Faltan ${3 - selectedIds.size}`}
                      </span>
                      {selectedIds.size > 0 && (
                        <button
                          id="btn-uncheck-all-tray"
                          onClick={handleReset}
                          className="text-[11px] text-[#1a3300]/70 hover:text-[#1a3300] hover:underline cursor-pointer inline-flex items-center gap-1 font-mono"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Limpiar</span>
                        </button>
                      )}
                    </div>

                    {/* Selected items quick pill preview */}
                    <div className="flex items-center gap-2 flex-wrap max-h-28 overflow-y-auto w-full no-scrollbar">
                      {selectedIngredients.map((item) => (
                        <span
                          key={`summary-${item.id}`}
                          onClick={() => handleToggleIngredient(item)}
                          className="inline-flex items-center gap-1 bg-[#d5f5c2] border border-[#1a3300] text-[#1a3300] px-2.5 py-1 rounded-[6px] text-xs font-ui font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                          title="Toca para remover"
                        >
                          <span>{item.name}</span>
                          <X className="w-3 h-3 text-[#1a3300]/70 shrink-0" />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary CTA Button with Neobrutalism Flat 3D Relief */}
                <div className="w-full pt-1 flex flex-col gap-y-2">
                  {selectedIngredients.length === 0 ? (
                    <button
                      id="primary-cta-ver-opciones"
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] text-sm font-ui font-semibold border border-dashed border-[#1a3300]/40 bg-[#ffffff] text-[#1a3300]/50 opacity-60 cursor-not-allowed select-none py-3.5 px-4 shadow-[1px_1px_0px_rgba(26,51,0,0.1)]"
                    >
                      <span>Selecciona al menos 3 ingredientes en tu alacena para desbloquear combinaciones</span>
                    </button>
                  ) : selectedIngredients.length < 3 ? (
                    <button
                      id="primary-cta-ver-opciones"
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] text-sm font-ui font-semibold border border-[#1a3300]/50 bg-[#ffffff] text-[#1a3300]/70 cursor-not-allowed select-none py-3.5 px-4 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.15)]"
                    >
                      <span>Selecciona {3 - selectedIngredients.length} {3 - selectedIngredients.length === 1 ? 'ingrediente más' : 'ingredientes más'} para desbloquear combinaciones</span>
                    </button>
                  ) : (
                    <button
                      id="primary-cta-ver-opciones"
                      onClick={handleVerOpciones}
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] text-sm sm:text-base font-ui font-bold border-2 border-[#1a3300] bg-[#1a3300] text-[#fcfaf5] hover:bg-[#284f00] cursor-pointer shadow-[3px_3px_0px_#1a3300] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_#1a3300] transition-all py-3.5 px-4"
                    >
                      <span>Armar snacks ({selectedIngredients.length} ingredientes · 3 a 5 por combinación)</span>
                    </button>
                  )}

                  {/* Subtle Favoritos Button shortcut */}
                  {savedFavoriteCards.length > 0 && (
                    <div className="flex justify-center pt-1">
                      <button
                        id="btn-open-favorites-selection"
                        type="button"
                        onClick={() => setShowFavoritesModal(true)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[#1a3300] bg-[#ffffff] hover:bg-[#ffe95c]/30 border border-[#1a3300] px-3 py-1.5 rounded-[6px] transition-colors shadow-[1px_1px_0px_#1a3300] cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-[#ffe95c] text-[#1a3300]" />
                        <span>Ver mis favoritos guardados ({savedFavoriteCards.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* VISTA DE RESULTADOS (3 A 5 INGREDIENTES POR SNACK)                        */
            /* ========================================================================= */
            <motion.div
              key="view-results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col gap-y-6 w-full box-border"
            >
              {/* Header with back navigation & restore action */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#e0ded8] w-full">
                <button
                  id="btn-back-to-pantry-top"
                  onClick={handleBackToSelect}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-ui font-bold text-[#1a3300] bg-[#ffffff] border border-[#1a3300] px-3 py-1.5 rounded-[8px] hover:bg-[#f1f1f1] active:translate-x-[1px] active:translate-y-[1px] transition-all shadow-[2px_2px_0px_#1a3300] active:shadow-[1px_1px_0px_#1a3300] cursor-pointer"
                >
                  <span>← Volver a mi alacena</span>
                </button>

                <div className="flex items-center gap-2">
                  {dismissedComboIds.size > 0 && (
                    <button
                      id="btn-restore-dismissed"
                      type="button"
                      onClick={handleRestoreDismissedCombos}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#1a3300] bg-[#f0ede6] border border-[#1a3300]/40 px-2 py-1.5 rounded-[8px] hover:bg-[#ffffff] transition-all cursor-pointer shadow-[1px_1px_0px_#1a3300]"
                      title="Restaurar sugerencias descartadas"
                    >
                      <RotateCcw className="w-3 h-3 text-[#1a3300]" />
                      <span>Restaurar ({dismissedComboIds.size})</span>
                    </button>
                  )}
                  <button
                    id="btn-open-favorites-results"
                    type="button"
                    onClick={() => setShowFavoritesModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1a3300] bg-[#ffffff] border border-[#1a3300] px-2.5 py-1.5 rounded-[8px] hover:bg-[#ffe95c]/30 active:translate-x-[1px] active:translate-y-[1px] transition-all shadow-[1.5px_1.5px_0px_#1a3300] cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-[#ffe95c] text-[#1a3300]" />
                    <span>Favoritos ({savedFavoriteCards.length})</span>
                  </button>
                  <span className="font-mono text-[11px] font-semibold text-[#1a3300]/70">
                    [{selectedIds.size} en alacena]
                  </span>
                </div>
              </div>

              {/* Intuitive Gesture Tip Pill */}
              <div className="w-full bg-[#ffffff] border border-[#1a3300]/25 rounded-[8px] px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#1a3300]/80 shadow-[1px_1px_0px_rgba(26,51,0,0.06)]">
                <span className="flex items-center gap-1.5 font-bold">
                  <span>💡 Gestos:</span>
                  <span className="text-[#1a3300] font-normal">
                    Desliza a la derecha (❤️) para guardar o a la izquierda (✕) para descartar.
                  </span>
                </span>
              </div>

              {/* Cards Grid: Clean vertical stack with Staggered Entry Animation */}
              {displayedCombos.length === 0 ? (
                <div className="w-full bg-[#ffffff] border-2 border-[#1a3300] rounded-[12px] p-6 text-center shadow-[3px_3px_0px_#1a3300] my-2">
                  <p className="font-ui text-sm font-bold text-[#1a3300] mb-3">
                    Has descartado todas las sugerencias actuales para esta selección
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleRestoreDismissedCombos}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1a3300] text-[#fcfaf5] rounded-[8px] font-mono text-xs font-bold shadow-[2px_2px_0px_#1a3300] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar sugerencias descartadas</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToSelect}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ffffff] text-[#1a3300] border border-[#1a3300] rounded-[8px] font-mono text-xs font-bold shadow-[1.5px_1.5px_0px_#1a3300] cursor-pointer"
                    >
                      <span>Elegir más ingredientes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.04,
                      },
                    },
                  }}
                  className="flex flex-col gap-y-6 w-full box-border pt-1"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedCombos.map((card, idx) => (
                      <motion.div
                        key={`${card.id}`}
                        layout
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          x: -260,
                          scale: 0.85,
                          transition: { duration: 0.22, ease: 'easeOut' },
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 24,
                          mass: 0.8,
                        }}
                      >
                        <StickySnackCard
                          card={card}
                          index={idx}
                          isFavorite={favorites.has(card.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onDismiss={handleDismissCombo}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Tarjeta Adicional de Bienestar: Tip de Hidratación & Recomendación Estacional */}
                  <motion.div
                    key={`hydration-tip-${comboOffset}`}
                    variants={{
                      hidden: { opacity: 0, y: 28, scale: 0.96 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 240,
                          damping: 22,
                          mass: 0.8,
                        },
                      },
                    }}
                  >
                    <HydrationSeasonalCard selectedIngredients={selectedIngredients} />
                  </motion.div>
                </motion.div>
              )}

              {/* Shuffle button if more than 4 combinations are possible */}
              {snackCombos.length > 4 && (
                <div className="pt-2 flex justify-center w-full">
                  <button
                    id="btn-shuffle-combos"
                    type="button"
                    onClick={handleShuffleCombos}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] border border-[#1a3300] bg-[#ffffff] hover:bg-[#f1f1f1] text-[#1a3300] font-mono text-[12px] font-bold transition-all cursor-pointer shadow-[2px_2px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a3300]"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#1a3300]" strokeWidth={2} />
                    <span>↻ Barajar otras combinaciones ({remainingComboCount} más disponibles)</span>
                  </button>
                </div>
              )}

              {/* Bottom Quick Return Action */}
              <div className="pt-3 pb-6 flex justify-center w-full border-t border-[#e0ded8]">
                <button
                  id="btn-back-to-pantry-bottom"
                  onClick={handleBackToSelect}
                  className="text-xs font-ui font-bold text-[#1a3300]/80 hover:text-[#1a3300] underline cursor-pointer"
                >
                  Modificar ingredientes de la alacena
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Onboarding Modal with Fast Profile creation */}
      <OnboardingModal
        isOpen={showOnboarding}
        userProfile={userProfile}
        onSaveProfile={(updated) => {
          const newProfile = { ...userProfile, ...updated };
          setUserProfile(newProfile);
          try {
            localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
          } catch (e) {
            console.warn(e);
          }
        }}
        onComplete={handleCompleteOnboarding}
        onClose={handleCompleteOnboarding}
      />

      {/* Favorites Drawer / Modal */}
      <FavoritesDrawer
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={savedFavoriteCards}
        onToggleFavorite={handleToggleFavorite}
        onSelectFavoriteCombo={handleSelectLoadedCombo}
      />

      {/* Profile Modal */}
      <ProfileAuthModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        pantryIngredients={kitchenIngredients}
        recentHistory={recentHistory}
        onSelectRecentCombo={handleSelectLoadedCombo}
        onClearRecentHistory={handleClearRecentHistory}
        onOpenOnboarding={() => {
          setShowProfileModal(false);
          setShowOnboarding(true);
        }}
        onResetPantry={handleResetPantryToDefault}
        onUpdateProfile={(updated) => {
          const newProfile = { ...userProfile, ...updated };
          setUserProfile(newProfile);
          try {
            localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
          } catch (e) {
            console.warn(e);
          }
          showToast('✓ Perfil actualizado');
        }}
      />
    </div>
  );
}
