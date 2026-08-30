import React, { useState, useEffect } from 'react';
import { SnackCardData } from '../types';
import { getCategoryColor } from '../utils/categoryColors';
import { Sparkles, X, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { FoodIcon } from './FoodIcons';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'motion/react';

interface StickySnackCardProps {
  card: SnackCardData;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (card: SnackCardData) => void;
  onDismiss?: (cardId: string) => void;
  enableSwipe?: boolean;
}

export const StickySnackCard: React.FC<StickySnackCardProps> = ({
  card,
  index,
  isFavorite = false,
  onToggleFavorite,
  onDismiss,
  enableSwipe = true,
}) => {
  // Motion values for swipe drag gesture
  const x = useMotionValue(0);

  // Background color and physical tilt based on card theme / index
  let bgClass = 'bg-[#d5f5c2]'; // Mint (Card 1)
  let initialRotation = index % 2 === 0 ? -0.6 : 0.5;
  let tapeColor = 'rgba(255, 255, 255, 0.75)';

  if (card.cardTheme === 'blush' || index % 3 === 1) {
    bgClass = 'bg-[#f6d0ff]'; // Blush (Card 2)
    initialRotation = 0.5;
    tapeColor = 'rgba(255, 255, 255, 0.7)';
  } else if (card.cardTheme === 'teal' || index % 3 === 2) {
    bgClass = 'bg-[#a8e5e5]'; // Teal (Card 3)
    initialRotation = -0.4;
    tapeColor = 'rgba(255, 255, 255, 0.75)';
  }

  // Tilt dynamics during drag (physical paper feel)
  const rotate = useTransform(
    x,
    [-200, 0, 200],
    [initialRotation - 8, initialRotation, initialRotation + 8]
  );

  // Drag cue opacities and scales (reveals underlay cues progressively)
  const favoriteCueOpacity = useTransform(x, [15, 65], [0, 1]);
  const favoriteCueScale = useTransform(x, [15, 65], [0.8, 1]);

  const dismissCueOpacity = useTransform(x, [-15, -65], [0, 1]);
  const dismissCueScale = useTransform(x, [-15, -65], [0.8, 1]);

  // Card opacity when dragged far away
  const cardOpacity = useTransform(x, [-200, -90, 0, 90, 200], [0.55, 0.9, 1, 0.9, 0.75]);

  // State to track if currently dragging to style cursor and render badges
  const [isDragging, setIsDragging] = useState(false);
  const [swipeActionTriggered, setSwipeActionTriggered] = useState<'favorite' | 'dismiss' | null>(null);
  const [heartbeatKey, setHeartbeatKey] = useState<number>(0);

  // Trigger heartbeat animation when isFavorite becomes true
  useEffect(() => {
    if (isFavorite) {
      setHeartbeatKey((prev) => prev + 1);
    }
  }, [isFavorite]);

  // Clean title without role brackets
  const cleanTitle = card.title.replace(/\[|\]/g, '');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(card);
    }
    setHeartbeatKey((prev) => prev + 1);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const distanceX = info.offset.x;
    const velocityX = info.velocity.x;
    const swipeThreshold = 60;
    const velocityThreshold = 350;

    if (distanceX > swipeThreshold || velocityX > velocityThreshold) {
      // Swiped RIGHT -> Toggle/Save Favorite
      setSwipeActionTriggered('favorite');
      if (onToggleFavorite) {
        onToggleFavorite(card);
      }
      setHeartbeatKey((prev) => prev + 1);
      setTimeout(() => setSwipeActionTriggered(null), 900);
    } else if (distanceX < -swipeThreshold || velocityX < -velocityThreshold) {
      // Swiped LEFT -> Dismiss
      setSwipeActionTriggered('dismiss');
      if (onDismiss) {
        onDismiss(card.id);
      }
    }
  };

  const ingredientCount = card.formula.length;

  return (
    <div className="relative w-full select-none touch-pan-y">
      {/* Background Underlay Cues for Swipe Gestures */}
      {enableSwipe && (
        <div className="absolute inset-0 rounded-[12px] flex items-center justify-between px-4 sm:px-5 pointer-events-none overflow-hidden border-2 border-dashed border-[#1a3300]/25 bg-[#f5f2ea]">
          {/* Left Underlay Indicator: Favorito (revealed on drag right) */}
          <motion.div
            style={{ opacity: favoriteCueOpacity, scale: favoriteCueScale }}
            className="flex items-center gap-2 bg-[#1a3300] text-[#ffffff] px-3.5 py-1.5 rounded-full border-2 border-[#1a3300] shadow-[2px_2px_0px_#1a3300]"
          >
            <Heart className="w-4 h-4 fill-[#ff4d4d] text-[#ff4d4d]" />
            <span className="font-mono text-xs font-black tracking-wide">
              {isFavorite ? 'EN FAVORITOS ❤️' : '¡GUARDAR FAVORITO! ❤️'}
            </span>
          </motion.div>

          {/* Right Underlay Indicator: Descartar (revealed on drag left) */}
          <motion.div
            style={{ opacity: dismissCueOpacity, scale: dismissCueScale }}
            className="flex items-center gap-2 bg-[#c93b2b] text-[#ffffff] px-3.5 py-1.5 rounded-full border-2 border-[#1a3300] shadow-[2px_2px_0px_#1a3300] ml-auto"
          >
            <span className="font-mono text-xs font-black tracking-wide">
              DESCARTAR SUGERENCIA
            </span>
            <X className="w-4 h-4 text-[#ffffff]" strokeWidth={2.5} />
          </motion.div>
        </div>
      )}

      {/* Main Draggable Sticky Card */}
      <motion.div
        id={`snack-card-${card.id}`}
        drag={enableSwipe ? 'x' : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.7, right: 0.5 }}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 28 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          x,
          rotate,
          opacity: cardOpacity,
          cursor: enableSwipe ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        whileTap={{ scale: enableSwipe ? 0.99 : 1 }}
        className={`relative w-full border-2 border-[#1a3300] ${bgClass} text-[#1a3300] flex flex-col justify-between box-border rounded-[12px] p-3.5 sm:p-4 shadow-[3px_3px_0px_#1a3300] transition-shadow duration-150 active:shadow-[1.5px_1.5px_0px_#1a3300]`}
      >
        {/* Physical Sketchbook Translucent Tape Strip */}
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-[2px] border-t border-b border-[#1a3300]/20 backdrop-blur-[1px] pointer-events-none z-10"
          style={{
            backgroundColor: tapeColor,
            transform: index % 2 === 0 ? 'translateX(-50%) rotate(-2deg)' : 'translateX(-50%) rotate(1.5deg)',
          }}
        />

        {/* Dynamic Floating Action Badges during drag */}
        <AnimatePresence>
          {enableSwipe && (
            <>
              <motion.div
                style={{ opacity: favoriteCueOpacity }}
                className="absolute top-2.5 right-12 z-20 pointer-events-none bg-[#1a3300] text-[#ff6b6b] text-[10px] font-mono font-black px-2 py-0.5 rounded-full border border-[#ff6b6b] flex items-center gap-1 shadow-sm"
              >
                <Heart className="w-3 h-3 fill-[#ff6b6b]" />
                <span className="text-[#ffffff]">Deslizar para guardar</span>
              </motion.div>

              <motion.div
                style={{ opacity: dismissCueOpacity }}
                className="absolute top-2.5 left-3 z-20 pointer-events-none bg-[#c93b2b] text-[#ffffff] text-[10px] font-mono font-black px-2 py-0.5 rounded-full border border-[#ffffff] flex items-center gap-1 shadow-sm"
              >
                <X className="w-3 h-3 text-[#ffffff]" />
                <span>Deslizar para descartar</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Top Header metadata */}
        <div className="w-full">
          <div className="flex items-center justify-between gap-2 mb-1.5 pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[9px] uppercase bg-[#1a3300] text-[#fcfaf5] px-1.5 py-0.5 rounded-[3px] font-bold tracking-tight">
                OPCIÓN {index + 1}
              </span>
              <span className="font-mono text-[9px] uppercase bg-[#ffffff] text-[#1a3300] border border-[#1a3300]/30 px-1.5 py-0.5 rounded-[3px] font-bold">
                {ingredientCount} INGREDIENTES
              </span>
              {card.benefitTag && (
                <span className="font-mono text-[9px] uppercase bg-[#ffe95c] text-[#1a3300] border border-[#1a3300]/40 px-1.5 py-0.5 rounded-[3px] font-bold">
                  {card.benefitTag}
                </span>
              )}
            </div>

            {/* Tactile Heartbeat Favorite Button on Card Header */}
            <motion.button
              id={`btn-fav-${card.id}`}
              type="button"
              onClick={handleFavoriteClick}
              whileTap={{ scale: 0.82 }}
              whileHover={{ scale: 1.08 }}
              className={`relative p-1.5 rounded-full border-2 border-[#1a3300] cursor-pointer transition-colors duration-200 flex items-center justify-center ${
                isFavorite
                  ? 'bg-[#1a3300] text-[#ff4d4d] shadow-[2px_2px_0px_#1a3300]'
                  : 'bg-[#ffffff] text-[#1a3300] hover:bg-[#ffe95c]/30 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.18)]'
              }`}
              title={isFavorite ? 'Guardado en favoritos ❤️' : 'Guardar en favoritos (o desliza a la derecha)'}
              aria-label="Guardar en favoritos"
            >
              {/* Gentle heartbeat / pulsing motion container */}
              <motion.div
                key={`heart-${card.id}-${heartbeatKey}-${isFavorite}`}
                initial={isFavorite ? { scale: 0.8 } : { scale: 1 }}
                animate={
                  isFavorite
                    ? {
                        scale: [1, 1.38, 0.92, 1.25, 1],
                      }
                    : { scale: 1 }
                }
                transition={{
                  duration: 0.5,
                  times: [0, 0.28, 0.5, 0.75, 1],
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex items-center justify-center"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite
                      ? 'fill-[#ff4d4d] text-[#ff4d4d]'
                      : 'text-[#1a3300] hover:text-[#ff4d4d]'
                  }`}
                  strokeWidth={isFavorite ? 2.5 : 2}
                />
              </motion.div>

              {/* Gentle ripple ring animation when favorited */}
              {isFavorite && (
                <motion.span
                  key={`ring-${heartbeatKey}`}
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-[#ff4d4d] pointer-events-none"
                />
              )}
            </motion.button>
          </div>

          {/* Snack Title */}
          <h3 className="font-display text-base sm:text-[17px] font-bold text-[#1a3300] leading-snug mb-2">
            {cleanTitle}
          </h3>

          {/* Visual Formula Capsules with Food Icons [A] + [B] + [C] + [D] + [E] */}
          <div className="w-full bg-[#ffffff] border-2 border-[#1a3300] rounded-[10px] p-2.5 sm:p-3 mb-2.5 space-y-1.5 box-border shadow-[2px_2px_0px_#1a3300]">
            <div className="flex flex-wrap items-center gap-1.5 leading-snug">
              {card.formula.map((item, idx) => {
                const itemCatColor = getCategoryColor(item.category || item.role);
                return (
                  <React.Fragment key={idx}>
                    <div
                      className="inline-flex items-center gap-1.5 bg-[#fcfaf5] px-2.5 py-1 rounded-[7px] border border-[#1a3300]/30 min-w-0 shadow-[1px_1px_0px_rgba(26,51,0,0.08)]"
                      style={{
                        borderLeftWidth: '3.5px',
                        borderLeftColor: itemCatColor.hex,
                      }}
                    >
                      <div className="w-5 h-5 rounded-full bg-[#ffffff] border border-[#1a3300]/20 flex items-center justify-center shrink-0">
                        <FoodIcon category={item.category} name={item.name} size={12} className="text-[#1a3300]" />
                      </div>
                      <span className="font-ui text-xs sm:text-[13px] font-bold text-[#1a3300] truncate">
                        {item.name}
                      </span>
                    </div>

                    {idx < card.formula.length - 1 && (
                      <span className="flex items-center justify-center shrink-0 text-[#1a3300] font-black text-sm px-0.5 select-none">
                        +
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Explicación Nutricional Humana y Cálida: // ¿POR QUÉ FUNCIONA? */}
          <div
            className="w-full rounded-[8px] box-border my-2 p-2.5 sm:p-3"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(26, 51, 0, 0.18)',
              borderRadius: '8px',
            }}
          >
            <div className="font-mono text-[9px] sm:text-[10px] font-bold text-[#1a3300]/80 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#1a3300]" />
              <span>// ¿POR QUÉ FUNCIONA?</span>
            </div>
            <p className="font-ui text-xs sm:text-[12px] font-normal text-[#1a3300] leading-relaxed">
              {card.whyItWorks}
            </p>
          </div>
        </div>

        {/* Minimalist Swipe Gesture Cue Footer (Only if swipe is enabled) */}
        {enableSwipe && (
          <div className="mt-1 pt-1.5 border-t border-[#1a3300]/15 w-full flex items-center justify-between text-[10px] font-mono text-[#1a3300]/60 select-none">
            <span className="inline-flex items-center gap-0.5">
              <ArrowLeft className="w-2.5 h-2.5" /> Descartar
            </span>
            <span className="text-[9px] text-[#1a3300]/40">· desliza la tarjeta ·</span>
            <span className="inline-flex items-center gap-0.5 text-[#ff4d4d] font-bold">
              Favorito <Heart className="w-2.5 h-2.5 fill-[#ff4d4d]" /> <ArrowRight className="w-2.5 h-2.5 text-[#1a3300]/60" />
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};


