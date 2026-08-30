import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, ShieldAlert, Sparkles, Heart, Brain, Utensils, User, ShieldCheck } from 'lucide-react';
import { UserProfile, DietaryIntolerance } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  userProfile?: UserProfile;
  onSaveProfile?: (profile: Partial<UserProfile>) => void;
  onComplete?: () => void;
  onClose?: () => void;
}

const INTOLERANCE_OPTIONS: { id: DietaryIntolerance; label: string; icon: string }[] = [
  { id: 'lactose', label: 'Sin lactosa / lácteos', icon: '🥛' },
  { id: 'gluten', label: 'Sin gluten', icon: '🌾' },
  { id: 'nuts', label: 'Sin frutos secos', icon: '🥜' },
  { id: 'egg', label: 'Sin huevo', icon: '🥚' },
];

const AVATAR_OPTIONS = ['Ñ', '🌱', '🥑', '⚡', '✨', '🍎'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  userProfile,
  onSaveProfile,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState(userProfile?.name && userProfile.name !== 'Mi Perfil' ? userProfile.name : '');
  const [avatarLetter, setAvatarLetter] = useState(userProfile?.avatarLetter || 'Ñ');
  const [selectedIntolerances, setSelectedIntolerances] = useState<DietaryIntolerance[]>(
    userProfile?.intolerances || []
  );

  if (!isOpen) return null;

  const toggleIntolerance = (id: DietaryIntolerance) => {
    setSelectedIntolerances((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    // Save profile state before completing
    if (onSaveProfile) {
      onSaveProfile({
        name: name.trim() || 'Mi Alacena',
        avatarLetter: avatarLetter || 'Ñ',
        intolerances: selectedIntolerances,
        isLoggedIn: true,
      });
    }

    if (onComplete) {
      onComplete();
    } else if (onClose) {
      onClose();
    }
  };

  const handleNext = () => {
    // If moving past step 1, silently save current profile data
    if (step === 1 && onSaveProfile) {
      onSaveProfile({
        name: name.trim() || 'Mi Alacena',
        avatarLetter: avatarLetter || 'Ñ',
        intolerances: selectedIntolerances,
        isLoggedIn: true,
      });
    }

    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div
      id="onboarding-modal-overlay"
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1a3300]/40 backdrop-blur-xs"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 51, 0, 0.45)',
        zIndex: 999,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        id="onboarding-modal-card"
        className="w-full bg-[#fcfaf5] border-2 border-[#1a3300] rounded-t-[16px] sm:rounded-[14px] relative box-border overflow-hidden shadow-[5px_5px_0px_#1a3300]"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#fcfaf5',
          padding: '24px 20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Step indicator header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#e0ded8] pb-3">
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
            <span className="font-mono text-[11px] bg-[#ffffff] text-[#1a3300] px-2 py-0.5 rounded-[4px] font-bold border border-[#1a3300]/30 inline-block shadow-[1px_1px_0px_rgba(26,51,0,0.1)]">
              // BIENVENIDA {step}/4
            </span>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5 items-center">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  step === i
                    ? 'w-6 bg-[#1a3300]'
                    : 'w-2 bg-[#1a3300]/25'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* PASO 1: Creación de Perfil Rápido y Preferencias */}
          {step === 1 && (
            <motion.div
              key="onboarding-step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[10px] bg-[#d5f5c2] border border-[#1a3300] flex items-center justify-center shadow-[2px_2px_0px_#1a3300] shrink-0">
                  <User className="w-5 h-5 text-[#1a3300]" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1a3300] leading-snug">
                    ¡Hola! Crea tu perfil
                  </h2>
                  <p className="font-ui text-xs text-[#1a3300]/80">
                    Personaliza tu espacio en segundos, sin contraseñas ni registros largos.
                  </p>
                </div>
              </div>

              {/* Nombre e Ícono */}
              <div className="bg-[#ffffff] border border-[#1a3300] rounded-[10px] p-3 space-y-3 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#1a3300]/80 mb-1">
                    ¿CÓMO TE LLAMAS O QUÉ NOMBRE LE PONEMOS A TU ALACENA?
                  </label>
                  <input
                    id="input-onboarding-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Sofía, Alex o Mi Alacena..."
                    className="w-full bg-[#fcfaf5] border border-[#1a3300] rounded-[6px] px-3 py-2 text-xs sm:text-sm font-ui text-[#1a3300] focus:outline-none focus:ring-1 focus:ring-[#1a3300]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#1a3300]/80 mb-1">
                    ELIGE TU ÍCONO
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {AVATAR_OPTIONS.map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setAvatarLetter(sym)}
                        className={`w-8 h-8 rounded-[6px] border text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                          avatarLetter === sym
                            ? 'bg-[#1a3300] text-[#fcfaf5] border-[#1a3300] shadow-[1px_1px_0px_#1a3300]'
                            : 'bg-[#fcfaf5] text-[#1a3300] border-[#1a3300]/30 hover:border-[#1a3300]'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferencias / Intolerancias */}
              <div className="bg-[#ffffff] border border-[#1a3300] rounded-[10px] p-3 space-y-2 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
                <label className="block font-mono text-[10px] font-bold text-[#1a3300]/80">
                  PREFERENCIAS O INTOLERANCIAS (OPCIONAL)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {INTOLERANCE_OPTIONS.map((opt) => {
                    const isChecked = selectedIntolerances.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleIntolerance(opt.id)}
                        className={`p-2 rounded-[8px] border text-left text-xs font-ui flex items-center gap-1.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#ffe95c]/40 border-[#1a3300] font-bold shadow-[1.5px_1.5px_0px_#1a3300]'
                            : 'bg-[#fcfaf5] border-[#1a3300]/30 text-[#1a3300]/80 hover:border-[#1a3300]'
                        }`}
                      >
                        <span className="text-sm">{opt.icon}</span>
                        <span className="text-[11px] truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#1a3300]/70 flex items-center gap-1.5 px-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1a3300]" />
                <span>Guardado de forma privada en tu dispositivo.</span>
              </div>
            </motion.div>
          )}

          {/* PASO 2: Calma diaria */}
          {step === 2 && (
            <motion.div
              key="onboarding-step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#ffe95c] border border-[#1a3300] flex items-center justify-center shadow-[2px_2px_0px_#1a3300]">
                <Brain className="w-5 h-5 text-[#1a3300]" strokeWidth={2.2} />
              </div>

              <div className="space-y-1.5">
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1a3300] leading-snug">
                  Calma diaria sin fatiga.
                </h2>
                <p className="font-ui text-xs sm:text-sm text-[#1a3300]/90 leading-relaxed">
                  Decide qué comer entre horas en menos de 10 segundos con lo que ya tienes en casa.
                </p>
              </div>

              <div className="bg-[#ffffff] border border-[#1a3300] rounded-[8px] p-2.5 text-xs font-mono text-[#1a3300] shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
                // Sin estufa, sin recetas complicadas ni compras forzadas.
              </div>
            </motion.div>
          )}

          {/* PASO 3: Alacena inteligente & balance */}
          {step === 3 && (
            <motion.div
              key="onboarding-step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#a8e5e5] border border-[#1a3300] flex items-center justify-center shadow-[2px_2px_0px_#1a3300]">
                <Utensils className="w-5 h-5 text-[#1a3300]" strokeWidth={2.2} />
              </div>

              <div className="space-y-1.5">
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1a3300] leading-snug">
                  Alacena inteligente.
                </h2>
                <p className="font-ui text-xs sm:text-sm text-[#1a3300]/90 leading-relaxed">
                  Selecciona al menos 3 alimentos de tu alacena y Ñam generará combinaciones equilibradas y ricas al instante.
                </p>
              </div>

              {/* Formula preview */}
              <div className="bg-[#ffffff] border border-[#1a3300] rounded-[8px] p-2.5 text-center shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
                <p className="font-mono text-xs font-bold text-[#1a3300]">
                  3 a 5 ingredientes · Saciedad duradera y energía estable
                </p>
              </div>
            </motion.div>
          )}

          {/* PASO 4: Aviso médico */}
          {step === 4 && (
            <motion.div
              key="onboarding-step-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#f6d0ff] border border-[#1a3300] flex items-center justify-center shadow-[2px_2px_0px_#1a3300]">
                <ShieldAlert className="w-5 h-5 text-[#1a3300]" strokeWidth={2.2} />
              </div>

              <div className="space-y-1.5">
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1a3300] leading-snug">
                  Aviso de bienestar.
                </h2>
                <p className="font-ui text-xs sm:text-sm text-[#1a3300]/90 leading-relaxed">
                  Ñam está pensado para facilitarte opciones cotidianas. No sustituye la consulta médica o el plan terapéutico de un profesional de la nutrición.
                </p>
              </div>

              <div className="bg-[#ffffff] border border-[#1a3300] rounded-[8px] p-2.5 text-[11px] font-mono text-[#1a3300]/80 shadow-[1.5px_1.5px_0px_rgba(26,51,0,0.1)]">
                // Todo listo {name ? `para ${name}` : ''}. ¡A comer rico y balanceado!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-[#e0ded8] flex items-center gap-2.5 mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-3.5 py-2.5 rounded-[8px] border border-[#1a3300] bg-[#ffffff] hover:bg-[#f1f1f1] text-[#1a3300] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-[1px_1px_0px_#1a3300]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : null}

          <button
            id={step === 4 ? 'btn-onboarding-finish' : 'btn-onboarding-next'}
            type="button"
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#1a3300] hover:bg-[#284f00] text-[#fcfaf5] text-xs sm:text-sm font-ui font-bold transition-all shadow-[2px_2px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            {step === 4 ? (
              <>
                <Check className="w-4 h-4 text-[#fcfaf5]" strokeWidth={2.5} />
                <span>Comenzar en mi alacena</span>
              </>
            ) : (
              <>
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4 text-[#fcfaf5]" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
