import React from 'react';
import { User, HelpCircle, Heart } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenAuthModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenFavorites?: () => void;
  favoritesCount?: number;
  userProfile?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuthModal,
  onOpenOnboarding,
  onOpenFavorites,
  favoritesCount = 0,
  userProfile,
}) => {
  const isLoggedIn = userProfile?.isLoggedIn;

  return (
    <header
      id="nam-header"
      className="w-full sticky top-0 z-40 bg-[#fcfaf5]/95 backdrop-blur-xs border-b-2 border-[#1a3300] box-border"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 14px)',
        paddingBottom: '14px',
        paddingLeft: 'max(env(safe-area-inset-left), 20px)',
        paddingRight: 'max(env(safe-area-inset-right), 20px)',
        boxSizing: 'border-box',
      }}
    >
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-3 box-border">
        {/* 1) Logotipo con Mascota Entrañable de Ñam (Sin 'Alacena Sencilla') */}
        <div className="flex items-center gap-2.5 select-none">
          {/* Mascota Isotipo: Contenedor con borde Forest Ink, fondo Cream Paper y sombra neobrutalista */}
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] bg-[#fcfaf5] border-2 border-[#1a3300] flex items-center justify-center shadow-[3px_3px_0px_#1a3300] shrink-0 relative overflow-hidden group hover:rotate-2 transition-transform"
            title="Ñam"
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Hoja / Sprout en la cabecita */}
              <path
                d="M19 8C19 5 22 4 24 5.5C26 7 24 9.5 20.5 9.5"
                stroke="#1a3300"
                strokeWidth="2"
                strokeLinecap="round"
                fill="#d5f5c2"
              />
              <path
                d="M19 8.5C17.5 6 15 6 14.5 7.5C14 9 16.5 10 18.5 9.5"
                stroke="#1a3300"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="#d5f5c2"
              />

              {/* Cuerpo redondito y tierno */}
              <rect
                x="6"
                y="9.5"
                width="26"
                height="22.5"
                rx="11.25"
                fill="#ffe95c"
                stroke="#1a3300"
                strokeWidth="2"
              />

              {/* Ojos expresivos y felices */}
              {/* Ojo izquierdo alegre / guiño */}
              <path
                d="M12.5 18.5C13.5 17 15.5 17 16.5 18.5"
                stroke="#1a3300"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Ojo derecho con brillo */}
              <circle cx="23" cy="18" r="2.2" fill="#1a3300" />
              <circle cx="22.3" cy="17.2" r="0.7" fill="#ffffff" />

              {/* Mejillas sonrosadas */}
              <circle cx="11.5" cy="22" r="1.6" fill="#f6d0ff" stroke="#1a3300" strokeWidth="0.8" />
              <circle cx="26.5" cy="22" r="1.6" fill="#f6d0ff" stroke="#1a3300" strokeWidth="0.8" />

              {/* Sonrisa 'ñam' con lengüita sabrosa */}
              <path
                d="M17 21.5C17.5 24 20.5 24 21 21.5"
                stroke="#1a3300"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="#ffffff"
              />
              <path
                d="M18 23C18.5 24.5 19.5 24.5 20 23"
                fill="#f6d0ff"
              />
            </svg>
          </div>

          {/* Nombre de Marca Único (Cero subtítulos) */}
          <span className="font-display text-2xl sm:text-[26px] text-[#1a3300] tracking-tight leading-none font-extrabold">
            Ñam
          </span>
        </div>

        {/* 2) Botones a la derecha: Favoritos ❤️, Guía (?), y Perfil */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botón de Favoritos */}
          {onOpenFavorites && (
            <button
              id="btn-header-favorites"
              type="button"
              onClick={onOpenFavorites}
              className="p-2 sm:p-2.5 rounded-xl bg-[#ffffff] hover:bg-[#ffe95c]/30 border-2 border-[#1a3300] text-[#1a3300] transition-all cursor-pointer shadow-[3px_3px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a3300] flex items-center justify-center relative"
              title="Ver favoritos guardados"
              aria-label="Ver favoritos guardados"
            >
              <Heart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                  favoritesCount > 0 ? 'text-[#ff4d4d] fill-[#ff4d4d]' : 'text-[#1a3300]'
                }`}
                strokeWidth={2.2}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#1a3300] text-[#fcfaf5] text-[9px] font-mono font-bold flex items-center justify-center border border-[#fcfaf5]">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* Botón de Ayuda / Onboarding Guía */}
          {onOpenOnboarding && (
            <button
              id="btn-header-help"
              type="button"
              onClick={onOpenOnboarding}
              className="p-2 sm:p-2.5 rounded-xl bg-[#ffffff] hover:bg-[#ffe95c]/30 border-2 border-[#1a3300] text-[#1a3300] transition-all cursor-pointer shadow-[3px_3px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a3300] flex items-center justify-center"
              title="Ver guía de la app"
              aria-label="Ver guía de la app"
            >
              <HelpCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1a3300]" strokeWidth={2.2} />
            </button>
          )}

          {/* Botón de Perfil */}
          {onOpenAuthModal && (
            <button
              id="btn-header-profile"
              type="button"
              onClick={onOpenAuthModal}
              className="p-2 sm:p-2.5 rounded-xl bg-[#ffffff] hover:bg-[#ffe95c]/30 border-2 border-[#1a3300] text-[#1a3300] transition-all cursor-pointer shadow-[3px_3px_0px_#1a3300] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a3300] flex items-center justify-center relative"
              title="Perfil y ajustes"
              aria-label="Perfil y ajustes"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1a3300]" strokeWidth={2.2} />
              <span
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-[#1a3300] ${
                  isLoggedIn ? 'bg-[#d5f5c2]' : 'bg-[#ffe95c]'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
