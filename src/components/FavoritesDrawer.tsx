import React from 'react';
import { SnackCardData } from '../types';
import { StickySnackCard } from './StickySnackCard';
import { X, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SnackCardData[];
  onToggleFavorite: (card: SnackCardData) => void;
  onSelectFavoriteCombo?: (card: SnackCardData) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onSelectFavoriteCombo,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="favorites-modal-overlay"
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
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          id="favorites-modal-card"
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fcfaf5] border-2 border-[#1a3300] rounded-[14px] p-4 sm:p-6 shadow-[5px_5px_0px_#1a3300] space-y-4 box-border my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e0ded8] pb-3 sticky top-0 bg-[#fcfaf5] z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-[#1a3300] border-2 border-[#1a3300] flex items-center justify-center text-[#ff4d4d] shadow-[1.5px_1.5px_0px_#1a3300]">
                <Heart className="w-4 h-4 fill-[#ff4d4d] text-[#ff4d4d]" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#1a3300] leading-tight">
                  Tus Favoritos ❤️
                </h2>
                <p className="font-mono text-[10px] sm:text-[11px] text-[#1a3300]/70">
                  {favorites.length} {favorites.length === 1 ? 'snack guardado' : 'snacks guardados'}
                </p>
              </div>
            </div>

            <button
              id="btn-close-favorites"
              onClick={onClose}
              className="p-1 rounded-[6px] text-[#1a3300]/70 hover:text-[#1a3300] hover:bg-[#f1f1f1] transition-colors cursor-pointer"
              aria-label="Cerrar favoritos"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Body */}
          {favorites.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#ffffff] border-2 border-dashed border-[#1a3300]/30 rounded-[10px] space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#ff4d4d]/15 border border-[#1a3300]/30 flex items-center justify-center mx-auto text-[#ff4d4d]">
                <Heart className="w-5 h-5 fill-[#ff4d4d]" />
              </div>
              <h3 className="font-ui text-sm font-bold text-[#1a3300]">
                Aún no has guardado favoritos
              </h3>
              <p className="font-ui text-xs text-[#1a3300]/70 max-w-sm mx-auto">
                Toca el botón <strong>❤️ Favorito</strong> en cualquier tarjeta de snack para tener tus combinaciones preferidas siempre a mano.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {favorites.map((card, idx) => (
                <div key={`fav-item-${card.id}-${idx}`} className="flex flex-col">
                  <StickySnackCard
                    card={card}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                    index={idx}
                    enableSwipe={false}
                  />
                  {onSelectFavoriteCombo && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectFavoriteCombo(card);
                        onClose();
                      }}
                      className="mt-1 w-full bg-[#1a3300] hover:bg-[#284f00] text-[#fcfaf5] text-xs font-mono font-bold py-1.5 px-3 rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#1a3300]"
                    >
                      <Sparkles className="w-3 h-3 text-[#ffe95c]" />
                      <span>Cargar en alacena</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 border-t border-[#e0ded8] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] bg-[#1a3300] hover:bg-[#284f00] text-[#fcfaf5] text-xs font-mono font-bold cursor-pointer transition-colors shadow-[2px_2px_0px_#1a3300]"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
