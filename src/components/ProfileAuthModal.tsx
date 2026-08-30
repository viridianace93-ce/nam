import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trash2, HelpCircle, Edit3, History, ArrowRight, Sparkles, PieChart, Apple, Layers, Flame, ShieldCheck } from 'lucide-react';
import { UserProfile, SnackCardData, Ingredient, IngredientCategory, DietaryIntolerance } from '../types';
import { CATEGORY_COLORS } from '../utils/categoryColors';
import { getCategoryDisplayName } from '../utils/autoCategorize';
import { FoodIcon } from './FoodIcons';

interface ProfileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  pantryIngredients?: Ingredient[];
  onResetPantry: () => void;
  onOpenOnboarding?: () => void;
  onUpdateProfile?: (profile: Partial<UserProfile> & { avatarLetter?: string }) => void;
  recentHistory?: SnackCardData[];
  onSelectRecentCombo?: (combo: SnackCardData) => void;
  onClearRecentHistory?: () => void;
}

const INTOLERANCE_OPTIONS: { id: DietaryIntolerance; label: string; icon: string }[] = [
  { id: 'lactose', label: 'Sin lactosa / lácteos', icon: '🥛' },
  { id: 'gluten', label: 'Sin gluten', icon: '🌾' },
  { id: 'nuts', label: 'Sin frutos secos', icon: '🥜' },
  { id: 'egg', label: 'Sin huevo', icon: '🥚' },
];

export const ProfileAuthModal: React.FC<ProfileAuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  pantryIngredients = [],
  onResetPantry,
  onOpenOnboarding,
  onUpdateProfile,
  recentHistory = [],
  onSelectRecentCombo,
  onClearRecentHistory,
}) => {
  const [rememberPantry, setRememberPantry] = useState(true);
  const [name, setName] = useState(userProfile.name || 'Mi Alacena');
  const [avatarLetter, setAvatarLetter] = useState(
    userProfile.avatarLetter || (userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'Ñ')
  );
  const [intolerances, setIntolerances] = useState<DietaryIntolerance[]>(userProfile.intolerances || []);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Synchronize with incoming userProfile props
  React.useEffect(() => {
    if (userProfile.name) setName(userProfile.name);
    if (userProfile.avatarLetter) setAvatarLetter(userProfile.avatarLetter);
    if (userProfile.intolerances) setIntolerances(userProfile.intolerances);
  }, [userProfile]);

  const toggleIntolerance = (id: DietaryIntolerance) => {
    setIntolerances((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Statistics on user pantry ingredients and food group frequency
  const pantryStats = useMemo(() => {
    const counts: Record<IngredientCategory, number> = {
      proteins: 0,
      fruits: 0,
      vegetables: 0,
      fats: 0,
      cereals: 0,
    };

    let customCount = 0;
    for (const item of pantryIngredients) {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
      if (item.isCustom) {
        customCount += 1;
      }
    }

    const totalUnique = pantryIngredients.length;

    // Categories sorted by frequency descending
    const sortedCategories = (Object.keys(counts) as IngredientCategory[])
      .map((cat) => ({
        category: cat,
        count: counts[cat],
        percentage: totalUnique > 0 ? Math.round((counts[cat] / totalUnique) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const topCategory = sortedCategories.length > 0 && sortedCategories[0].count > 0
      ? sortedCategories[0]
      : null;

    return {
      totalUnique,
      customCount,
      counts,
      sortedCategories,
      topCategory,
    };
  }, [pantryIngredients]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: name.trim() || 'Mi Alacena',
        avatarLetter: avatarLetter.trim().charAt(0).toUpperCase() || 'Ñ',
        intolerances: intolerances,
      });
    }
    setIsEditing(false);
  };

  const handleConfirmReset = () => {
    onResetPantry();
    setShowConfirmReset(false);
    onClose();
  };

  const handleOpenGuide = () => {
    onClose();
    if (onOpenOnboarding) {
      onOpenOnboarding();
    }
  };

  const handleSelectHistoryItem = (combo: SnackCardData) => {
    if (onSelectRecentCombo) {
      onSelectRecentCombo(combo);
    }
  };

  const AVATAR_PRESETS = ['Ñ', 'A', 'M', '⚡', '🥑', '🌱'];

  return (
    <AnimatePresence>
      <div
        id="profile-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3300]/40 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(26, 51, 0, 0.45)',
          zIndex: 999,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          id="profile-auth-modal-card"
          className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[14px] p-4 sm:p-5 shadow-[5px_5px_0px_#1a3300] space-y-4 box-border my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e0ded8] pb-3 sticky top-0 bg-[#fcfaf5] z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-[#fcfaf5] border-2 border-[#1a3300] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1a3300] overflow-hidden">
                <svg width="24" height="24" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 8C19 5 22 4 24 5.5C26 7 24 9.5 20.5 9.5" stroke="#1a3300" strokeWidth="2" fill="#d5f5c2" />
                  <rect x="6" y="9.5" width="26" height="22.5" rx="11.25" fill="#ffe95c" stroke="#1a3300" strokeWidth="2" />
                  <path d="M12.5 18.5C13.5 17 15.5 17 16.5 18.5" stroke="#1a3300" strokeWidth="2" />
                  <circle cx="23" cy="18" r="2.2" fill="#1a3300" />
                  <path d="M17 21.5C17.5 24 20.5 24 21 21.5" stroke="#1a3300" strokeWidth="1.8" fill="#ffffff" />
                </svg>
              </div>
              <h2 className="font-display text-base font-bold text-[#1a3300]">
                Perfil y Ajustes
              </h2>
            </div>
            <button
              id="btn-close-profile"
              onClick={onClose}
              className="p-1 rounded-[6px] text-[#1a3300]/70 hover:text-[#1a3300] hover:bg-[#f1f1f1] transition-colors cursor-pointer"
              aria-label="Cerrar perfil"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* 1. Editable Profile Information */}
          <div className="bg-[#ffffff] border border-[#1a3300] rounded-[10px] p-3.5 space-y-3 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
            <div className="flex items-center gap-3">
              {/* Avatar Icon / Letter */}
              <div className="w-12 h-12 rounded-[10px] bg-[#d5f5c2] border-2 border-[#1a3300] flex items-center justify-center text-[#1a3300] shrink-0 font-display font-extrabold text-lg shadow-[1.5px_1.5px_0px_#1a3300]">
                {avatarLetter}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-ui font-bold text-sm text-[#1a3300] truncate">
                  {name}
                </p>
                <p className="font-mono text-[11px] text-[#1a3300]/60 truncate">
                  Tu espacio en Ñam
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-2 py-1 rounded-[6px] border border-[#1a3300] bg-[#fcfaf5] hover:bg-[#ffe95c]/30 text-[#1a3300] text-[11px] font-mono font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
              </button>
            </div>

            {/* Intolerances preview badges when not editing */}
            {!isEditing && intolerances.length > 0 && (
              <div className="pt-2 border-t border-[#e0ded8] flex flex-wrap gap-1.5 items-center">
                <span className="font-mono text-[10px] text-[#1a3300]/60 mr-1">Preferencias:</span>
                {intolerances.map((id) => {
                  const opt = INTOLERANCE_OPTIONS.find((o) => o.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 font-mono text-[10px] bg-[#fcfaf5] text-[#1a3300] px-2 py-0.5 rounded-[4px] border border-[#1a3300]/30 font-semibold"
                    >
                      <span>{opt?.icon}</span>
                      <span>{opt?.label}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Editable Form */}
            {isEditing && (
              <form onSubmit={handleSave} className="pt-2 border-t border-[#e0ded8] space-y-2.5">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#1a3300]/70 mb-1">
                    TU NOMBRE O ALACENA
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre..."
                    className="w-full bg-[#fcfaf5] border border-[#1a3300] rounded-[6px] px-2.5 py-1.5 text-xs font-ui text-[#1a3300] focus:outline-none focus:ring-1 focus:ring-[#1a3300]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#1a3300]/70 mb-1">
                    SELECCIONA TU ÍCONO
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {AVATAR_PRESETS.map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        onClick={() => setAvatarLetter(symbol)}
                        className={`w-7 h-7 rounded-[6px] border text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                          avatarLetter === symbol
                            ? 'bg-[#1a3300] text-[#fcfaf5] border-[#1a3300]'
                            : 'bg-[#fcfaf5] text-[#1a3300] border-[#1a3300]/30 hover:border-[#1a3300]'
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#1a3300]/70 mb-1">
                    PREFERENCIAS E INTOLERANCIAS
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {INTOLERANCE_OPTIONS.map((opt) => {
                      const isChecked = intolerances.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleIntolerance(opt.id)}
                          className={`p-1.5 rounded-[6px] border text-left text-xs font-ui flex items-center gap-1.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#ffe95c]/40 border-[#1a3300] font-bold shadow-[1px_1px_0px_#1a3300]'
                              : 'bg-[#fcfaf5] border-[#1a3300]/30 text-[#1a3300]/80 hover:border-[#1a3300]'
                          }`}
                        >
                          <span className="text-xs">{opt.icon}</span>
                          <span className="text-[10px] truncate">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#1a3300] hover:bg-[#284f00] text-[#fcfaf5] rounded-[6px] text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-[1px_1px_0px_#1a3300]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar cambios</span>
                </button>
              </form>
            )}
          </div>

          {/* 2. Resumen de Alacena y Grupos de Alimentos Más Frecuentes */}
          <div className="bg-[#ffffff] border border-[#1a3300] rounded-[10px] p-3.5 space-y-3 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />
                <span className="font-ui text-xs font-bold text-[#1a3300]">
                  Tu alacena y grupos
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] bg-[#ffe95c] border border-[#1a3300] text-[#1a3300] font-bold shadow-[1px_1px_0px_#1a3300]">
                {pantryStats.totalUnique} {pantryStats.totalUnique === 1 ? 'ingrediente único' : 'ingredientes únicos'}
              </span>
            </div>

            {/* Destacado del grupo principal / más frecuente */}
            {pantryStats.topCategory && pantryStats.topCategory.count > 0 && (
              <div
                className="p-2.5 rounded-[8px] border border-[#1a3300] flex items-center justify-between gap-2 shadow-[1px_1px_0px_rgba(26,51,0,0.1)]"
                style={{ backgroundColor: CATEGORY_COLORS[pantryStats.topCategory.category].cardBg }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full border border-[#1a3300] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1a3300]"
                    style={{ backgroundColor: CATEGORY_COLORS[pantryStats.topCategory.category].headerBg }}
                  >
                    <FoodIcon category={pantryStats.topCategory.category} size={15} className="text-[#1a3300]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-ui text-xs font-bold text-[#1a3300] truncate">
                      Grupo más frecuente: {getCategoryDisplayName(pantryStats.topCategory.category)}
                    </p>
                    <p className="font-mono text-[10px] text-[#1a3300]/70">
                      {pantryStats.topCategory.count} alimentos ({pantryStats.topCategory.percentage}% del total)
                    </p>
                  </div>
                </div>

                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] border border-[#1a3300] font-black text-[#1a3300] shrink-0 shadow-[1px_1px_0px_#1a3300]"
                  style={{ backgroundColor: CATEGORY_COLORS[pantryStats.topCategory.category].headerBg }}
                >
                  #{1} Frecuente
                </span>
              </div>
            )}

            {/* Barra Visual Segmentada de Proporciones */}
            {pantryStats.totalUnique > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#1a3300]/70">
                  <span>Distribución de variedad</span>
                  <span>{pantryStats.customCount > 0 ? `${pantryStats.customCount} personalizados` : 'Alacena completa'}</span>
                </div>
                <div className="w-full h-2.5 rounded-full border border-[#1a3300] overflow-hidden flex bg-[#f5f3ec] shadow-inner">
                  {pantryStats.sortedCategories.map(({ category, percentage, count }) => {
                    if (count === 0) return null;
                    return (
                      <div
                        key={`bar-${category}`}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: CATEGORY_COLORS[category].headerBg,
                        }}
                        className="h-full border-r border-[#1a3300]/30 last:border-r-0"
                        title={`${getCategoryDisplayName(category)}: ${count} (${percentage}%)`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Desglose de todos los grupos ordenados por frecuencia */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              {pantryStats.sortedCategories.map(({ category, count, percentage }, index) => {
                const color = CATEGORY_COLORS[category];
                return (
                  <div
                    key={`group-stat-${category}`}
                    className="p-1.5 px-2 rounded-[6px] border border-[#1a3300]/40 flex items-center justify-between gap-1"
                    style={{ backgroundColor: color.cardBg }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-[#1a3300]/60"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-ui text-[11px] font-bold text-[#1a3300] truncate">
                        {getCategoryDisplayName(category)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] font-bold text-[#1a3300]">
                      <span>{count}</span>
                      <span className="text-[9px] text-[#1a3300]/55">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Historial Reciente de Snacks (Últimas 3 Combinaciones Generadas) */}
          <div className="bg-[#ffffff] border border-[#1a3300] rounded-[10px] p-3.5 space-y-2.5 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#1a3300]" strokeWidth={2.2} />
                <span className="font-ui text-xs font-bold text-[#1a3300]">
                  Historial reciente
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[4px] bg-[#d5f5c2] border border-[#1a3300]/40 text-[#1a3300] font-bold">
                  {recentHistory.length}/3
                </span>
              </div>

              {recentHistory.length > 0 && onClearRecentHistory && (
                <button
                  type="button"
                  onClick={onClearRecentHistory}
                  className="font-mono text-[10px] text-[#1a3300]/60 hover:text-[#1a3300] underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {recentHistory.length === 0 ? (
              <div className="bg-[#fcfaf5] border border-dashed border-[#1a3300]/30 rounded-[8px] p-3 text-center space-y-1">
                <p className="font-ui text-xs text-[#1a3300]/75">
                  Aún no has generado combinaciones.
                </p>
                <p className="font-mono text-[10px] text-[#1a3300]/60">
                  Selecciona 3 ingredientes en tu alacena y arma tus snacks para guardarlos aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentHistory.slice(0, 3).map((combo, index) => (
                  <div
                    key={`history-combo-${combo.id}-${index}`}
                    onClick={() => handleSelectHistoryItem(combo)}
                    className="p-2.5 rounded-[8px] bg-[#fcfaf5] hover:bg-[#ffe95c]/25 border border-[#1a3300] cursor-pointer transition-all shadow-[1px_1px_0px_rgba(26,51,0,0.15)] active:translate-x-[1px] active:translate-y-[1px] group flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#1a3300] shrink-0" />
                        <span className="font-ui text-xs font-bold text-[#1a3300] truncate">
                          {combo.title}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[4px] bg-[#ffffff] border border-[#1a3300]/50 text-[#1a3300] font-bold shrink-0">
                        {combo.benefitTag}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#1a3300]/70 pt-0.5 border-t border-[#1a3300]/10">
                      <span className="truncate">
                        {combo.formula.map((f) => f.name).join(' · ')}
                      </span>
                      <span className="font-bold text-[#1a3300] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0 ml-2">
                        Ver snack <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Simple Pantry Memory Indicator */}
          <div className="bg-[#ffffff] border border-[#1a3300] rounded-[8px] p-3 flex items-center justify-between shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
            <div className="space-y-0.5 pr-2">
              <p className="font-ui text-xs font-bold text-[#1a3300]">
                Recordar mi alacena
              </p>
              <p className="font-mono text-[10px] text-[#1a3300]/65">
                {rememberPantry ? 'Guardado automático en este dispositivo' : 'Solo durante esta visita'}
              </p>
            </div>

            <button
              id="toggle-remember-pantry"
              type="button"
              onClick={() => setRememberPantry(!rememberPantry)}
              className={`w-10 h-5.5 rounded-full border border-[#1a3300] p-0.5 transition-colors cursor-pointer relative flex items-center shrink-0 ${
                rememberPantry ? 'bg-[#d5f5c2]' : 'bg-[#e0ded8]'
              }`}
              aria-label="Alternar recordar alacena"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#1a3300] transition-transform ${
                  rememberPantry ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Link to re-open Onboarding Guide */}
          <button
            id="btn-reopen-guide"
            type="button"
            onClick={handleOpenGuide}
            className="w-full bg-[#ffffff] border border-[#1a3300] hover:bg-[#ffe95c]/25 rounded-[8px] p-2.5 flex items-center justify-between text-xs font-ui text-[#1a3300] transition-colors cursor-pointer shadow-[1px_1px_0px_rgba(26,51,0,0.1)]"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#1a3300]" />
              <span className="font-bold">Ver guía de la app</span>
            </div>
            <span className="font-mono text-[10px] text-[#1a3300]/60">4 pasos →</span>
          </button>

          {/* 5. Clear and start fresh */}
          <div className="pt-1">
            {showConfirmReset ? (
              <div className="bg-[#ffe95c]/20 border-2 border-[#1a3300] rounded-[8px] p-3 space-y-2">
                <p className="font-ui text-xs font-bold text-[#1a3300] text-center">
                  ¿Borrar todos los ingredientes y empezar de cero?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="flex-1 py-1.5 bg-[#1a3300] text-[#fcfaf5] rounded-[6px] text-xs font-mono font-bold cursor-pointer hover:bg-[#284f00]"
                  >
                    Sí, borrar todo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-[#ffffff] border border-[#1a3300] text-[#1a3300] rounded-[6px] text-xs font-mono font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="btn-profile-clear-all"
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 px-3 rounded-[8px] border-2 border-dashed border-[#1a3300] hover:border-solid hover:bg-[#ffe95c]/30 text-[#1a3300] font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#1a3300]" />
                <span>🗑️ Borrar ingredientes y empezar de cero</span>
              </button>
            )}
          </div>

          {/* Footer Cerrar */}
          <div className="pt-1 border-t border-[#e0ded8] flex justify-end">
            <button
              onClick={onClose}
              className="text-xs font-mono text-[#1a3300]/70 hover:text-[#1a3300] hover:underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
