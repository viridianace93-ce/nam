# Estado actual — Ñam

Última actualización: 2026-08-30

## Hecho

- App React funcional: alacena, búsqueda, categorías, combos sticky, favoritos, onboarding, perfil mock
- Motor local de combinaciones (3–5 ingredientes) + tip de hidratación
- Design tokens en CSS + `DESIGN.md`
- Empty state con `PantrySketchIllustration`
- Endpoint Gemini `/api/ai-combos` (opcional)
- Persistencia `nam_*` en localStorage
- Ruta aislada `/demo-day`: presentación de 6 diapositivas para Demo Day (flechas ←→; no toca el flujo del producto)

## Pendiente

- Alinear copy de `DESIGN.md` §4A (“2+”) con mínimo real de 3
- Accesibilidad de modales: `role="dialog"`, `aria-modal`, focus trap, Escape ([sesión a11y](3aed4276-e959-4a7d-937f-634a868ff4fa))
- `aria-live` en toast; `prefers-reduced-motion`
- OCR ticket / apps de súper (vision, no started)
- Auth real (hoy mock)
- Health check en `server.ts` aún dice `SnapMeal` (rename legacy)

## Blockers

- Ninguno técnico bloqueante para desarrollo local
- AI combos requieren `GEMINI_API_KEY` en `.env.local` (sin key → solo motor local)
