import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const LIVE_URL = 'https://nam-ivory.vercel.app/';
const TOTAL = 6;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe95c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfaf5]';

const navBtn =
  `min-h-12 min-w-12 px-3 sm:px-4 rounded-[10px] border-2 border-[#1a3300] bg-[#ffffff] text-[#1a3300] font-mono text-xs sm:text-sm font-bold shadow-[3px_3px_0px_#1a3300] hover:bg-[#ffe95c]/40 active:scale-95 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a3300] motion-reduce:transition-none motion-reduce:active:scale-100 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100 disabled:active:translate-x-0 disabled:active:translate-y-0 ${focusRing}`;

export default function DemoDay() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback((next: number, dir: number) => {
    if (next < 0 || next >= TOTAL) return;
    setDirection(dir);
    setIndex(next);
  }, []);

  useEffect(() => {
    document.title = 'Ñam — Demo Day';
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1, 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1, -1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  const variants = reduceMotion
    ? {
        enter: { opacity: 1, x: 0 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
      }
    : {
        enter: { opacity: 0, x: direction * 48 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction * -48 },
      };

  return (
    <div className="bg-cream-paper paper-grid-subtle text-[#1a3300] min-h-dvh flex flex-col">
      <a
        href="#demo-day-slide"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#ffe95c] focus:border-2 focus:border-[#1a3300] focus:font-mono focus:font-bold focus:rounded-[8px] ${focusRing}`}
      >
        Saltar a la diapositiva
      </a>

      <header className="shrink-0 border-b-2 border-[#1a3300] px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        <p className="font-display text-lg sm:text-xl tracking-tight">Ñam · Demo Day</p>
        <p className="font-mono text-sm sm:text-base font-bold tabular-nums" aria-live="polite">
          {index + 1}/{TOTAL}
        </p>
      </header>

      <main
        id="demo-day-slide"
        className="flex-1 flex flex-col min-h-0 px-4 sm:px-8 lg:px-16 py-6 sm:py-10"
        aria-roledescription="presentación"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={index}
            role="region"
            aria-labelledby={`slide-heading-${index}`}
            aria-roledescription="diapositiva"
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
            className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full overflow-y-auto min-h-0"
          >
            {index === 0 && <SlidePortada headingId="slide-heading-0" />}
            {index === 1 && <SlideProblema headingId="slide-heading-1" />}
            {index === 2 && <SlideDemo headingId="slide-heading-2" />}
            {index === 3 && <SlideDecisiones headingId="slide-heading-3" />}
            {index === 4 && <SlideVerificacion headingId="slide-heading-4" />}
            {index === 5 && <SlideCierre headingId="slide-heading-5" />}
          </motion.section>
        </AnimatePresence>
      </main>

      <nav
        className="shrink-0 border-t-2 border-[#1a3300] px-4 sm:px-8 py-3 flex items-center justify-between gap-3 bg-[#fcfaf5]"
        aria-label="Navegación de diapositivas"
      >
        <button
          type="button"
          className={navBtn}
          onClick={() => goTo(index - 1, -1)}
          disabled={index === 0}
          aria-label="Diapositiva anterior"
        >
          <span className="inline-flex items-center gap-1">
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
          </span>
        </button>

        <ol className="flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: TOTAL }, (_, i) => (
            <li
              key={i}
              className={`h-2.5 rounded-full border-2 border-[#1a3300] ${
                i === index ? 'w-8 bg-[#ffe95c]' : 'w-2.5 bg-[#ffffff]'
              }`}
            />
          ))}
        </ol>

        <button
          type="button"
          className={navBtn}
          onClick={() => goTo(index + 1, 1)}
          disabled={index === TOTAL - 1}
          aria-label="Diapositiva siguiente"
        >
          <span className="inline-flex items-center gap-1">
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </button>
      </nav>
    </div>
  );
}

function TimeChip({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono font-bold uppercase text-[clamp(0.8rem,1.6vw,1.05rem)] bg-[#ffe95c] border-2 border-[#1a3300] px-2.5 py-1 rounded-[4px] shadow-[2px_2px_0px_#1a3300] mb-3 sm:mb-4 w-fit">
      {children}
    </p>
  );
}

function SlidePortada({ headingId }: { headingId: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-mono text-sm sm:text-base font-bold mb-4">Demo Day</p>
      <h1
        id={headingId}
        className="font-display text-[clamp(3.25rem,14vw,8rem)] leading-[0.95] tracking-tight mb-6"
      >
        Ñam
      </h1>
      <h2 className="font-ui font-semibold text-[clamp(1.35rem,3.6vw,2.5rem)] leading-snug max-w-3xl mb-8">
        Snacks rápidos para días de baja energía
      </h2>
      <a
        href={LIVE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 font-mono text-[clamp(1rem,2vw,1.35rem)] font-bold underline decoration-2 underline-offset-4 hover:bg-[#ffe95c] px-1 ${focusRing} rounded-[4px]`}
      >
        {LIVE_URL}
        <ExternalLink className="w-5 h-5 shrink-0" aria-hidden="true" />
      </a>
    </div>
  );
}

function SlideProblema({ headingId }: { headingId: string }) {
  return (
    <div>
      <TimeChip>0:00 – 0:30</TimeChip>
      <h2
        id={headingId}
        className="font-display text-[clamp(2rem,6vw,4.25rem)] leading-[1.05] tracking-tight mb-6 sm:mb-8"
      >
        Problema
      </h2>
      <ul className="space-y-4 sm:space-y-5 font-ui text-[clamp(1.15rem,2.4vw,1.75rem)] leading-snug font-medium list-none">
        <li className="border-l-4 border-[#1a3300] pl-4">
          Inapetencia y fatiga crónica dificultan alimentarse bien.
        </li>
        <li className="border-l-4 border-[#1a3300] pl-4">
          Medicamentos psiquiátricos generan pérdida de apetito.
        </li>
        <li className="border-l-4 border-[#1a3300] pl-4">
          Planear comidas es cognitivamente abrumador en esos momentos.
        </li>
        <li className="border-l-4 border-[#1a3300] pl-4">
          Culpa y desgaste mental rodean el acto de comer.
        </li>
      </ul>
    </div>
  );
}

function SlideDemo({ headingId }: { headingId: string }) {
  return (
    <div>
      <TimeChip>0:30 – 2:30</TimeChip>
      <h2
        id={headingId}
        className="font-display text-[clamp(2rem,6vw,4.25rem)] leading-[1.05] tracking-tight mb-5 sm:mb-6"
      >
        Demo en vivo
      </h2>
      <a
        href={LIVE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-3 w-full sm:w-auto min-h-16 px-6 sm:px-10 py-4 mb-8 rounded-[12px] border-2 border-[#1a3300] bg-[#ffe95c] text-[#1a3300] font-display text-[clamp(1.25rem,3vw,2rem)] shadow-[4px_4px_0px_#1a3300] hover:bg-[#ffe24a] active:scale-95 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1a3300] motion-reduce:active:scale-100 cursor-pointer ${focusRing}`}
      >
        Abrir Ñam en vivo
        <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" aria-hidden="true" />
      </a>
      <div className="space-y-5 sm:space-y-6 font-ui text-[clamp(1.05rem,2.1vw,1.5rem)] leading-snug">
        <div>
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">
            Pantalla 1: Alacena + Búsqueda
          </h3>
          <p>
            Usuario selecciona 3–5 ingredientes que tiene a la mano mediante carrusel visual
            accesible sin sentirse abrumado.
          </p>
        </div>
        <div>
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">
            Pantalla 2: Resultados (Sticky Notes)
          </h3>
          <p>
            Al tercer ingrediente, aparecen opciones de snacks con desglose visual [A] + [B] + [C].
            Usuario puede guardar en Favoritos.
          </p>
        </div>
        <div className="bg-[#d5f5c2] border-2 border-[#1a3300] rounded-[12px] p-4 sm:p-5 shadow-[3px_3px_0px_#1a3300]">
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">Fuera de cámara</h3>
          <p>
            Sin perfiles complejos, sin bases de datos externas, sin listas del súper. Todo es
            local e inmediato.
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideDecisiones({ headingId }: { headingId: string }) {
  return (
    <div>
      <TimeChip>2:30 – 4:30</TimeChip>
      <h2
        id={headingId}
        className="font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] tracking-tight mb-6"
      >
        Decisiones: qué delegué y qué retuve
      </h2>
      <div className="space-y-5 sm:space-y-6 font-ui text-[clamp(1.05rem,2.1vw,1.5rem)] leading-snug">
        <div>
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">Delegué</h3>
          <p>
            La construcción de los layouts interactivos, las reglas para combinar los alimentos
            de forma lógica, y el guardado local de los snacks favoritos en el celular del usuario.
          </p>
        </div>
        <div>
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">Retuve</h3>
          <p>
            El botón explícito de cálculo para darle control de pausa al usuario, el design
            system estricto, y el tono compasivo libre de jerga de dietas.
          </p>
        </div>
        <div className="bg-[#a8e5e5] border-2 border-[#1a3300] rounded-[12px] p-4 sm:p-5 shadow-[3px_3px_0px_#1a3300]">
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">Por qué</h3>
          <p>
            Porque en un producto enfocado en salud mental y baja energía, el usuario necesita
            poder seleccionar con calma todos sus ingredientes sin que la interfaz cambie de
            prisa o de forma automática. El botón de acción actúa como un espacio de pausa
            seguro antes de ver los resultados.
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideVerificacion({ headingId }: { headingId: string }) {
  return (
    <div>
      <TimeChip>2:30 – 4:30</TimeChip>
      <h2
        id={headingId}
        className="font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] tracking-tight mb-6"
      >
        Verificación y transparencia
      </h2>
      <div className="space-y-5 sm:space-y-6 font-ui text-[clamp(1.05rem,2.1vw,1.5rem)] leading-snug">
        <div>
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">Verifiqué</h3>
          <p>
            Flujo end-to-end en móvil, ausencia de lenguaje clínico o de dietas, persistencia de
            favoritos en localStorage, contraste accesible.
          </p>
        </div>
        <div>
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">La IA inventó</h3>
          <p>
            Textos sobre “dietas restrictivas” en empty state. Yo eliminé para mantener voz
            empática.
          </p>
        </div>
        <div className="bg-[#f6d0ff] border-2 border-[#1a3300] rounded-[12px] p-4 sm:p-5 shadow-[3px_3px_0px_#1a3300]">
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">Hallazgo</h3>
          <p>
            Acciones redundantes en la UI (múltiples formas de limpiar alacena). Centralicé en una
            sola acción y añadí transiciones táctiles (active:scale-95).
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideCierre({ headingId }: { headingId: string }) {
  return (
    <div>
      <TimeChip>4:30 – 5:00</TimeChip>
      <h2
        id={headingId}
        className="font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] tracking-tight mb-6"
      >
        Cierre: postmortem y aprendizaje #1
      </h2>
      <ul className="space-y-4 sm:space-y-5 font-ui text-[clamp(1.05rem,2.1vw,1.5rem)] leading-snug font-medium list-none">
        <li className="border-l-4 border-[#1a3300] pl-4">
          Pensé que lo difícil sería hacer combinaciones culinarias sensatas.
        </li>
        <li className="border-l-4 border-[#1a3300] pl-4">
          Realmente fue evitar que la IA forzara flujos tradicionales (botones extra, jerga de
          dietas).
        </li>
        <li className="border-l-4 border-[#1a3300] pl-4">
          Si reiniciara: pondría la regla de “todo en una sola pantalla, sin culpa” como regla de
          oro desde el inicio.
        </li>
        <li className="bg-[#ffe95c] border-2 border-[#1a3300] rounded-[12px] p-4 sm:p-5 shadow-[3px_3px_0px_#1a3300]">
          <h3 className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] mb-1.5">
            Aprendizaje #1
          </h3>
          <p>La fricción se esconde en los defaults de la IA. Delegar código no es delegar experiencia.</p>
        </li>
      </ul>
    </div>
  );
}
