# reglas.md — Lo que el agente nunca debe hacer

Solo reglas violables y detectables.

1. **No inventar features de vision como si existieran.** Ticket OCR, Walmart/Jüsto/Chedraui/Cornershop no están en el código. No digas que “ya funcionan”.
2. **No mostrar calorías, macros ni lenguaje de dieta restrictiva** en UI, copy o prompts de Gemini (`server.ts`).
3. **No bajar el mínimo de combos a menos de 3 ingredientes** sin una decisión fechada en `decisions/`.
4. **No cargar `GUIA-VISUAL-NAM.html` ni `node_modules/`** en el contexto del agente.
5. **No volcar historial de chat ni `App.tsx`/`comboEngine.ts` completos** al prompt; leer por sección o función.
6. **No dejar `AGENTS.md` > 300 líneas.** Si crece, comprimir y mover detalle a `contexto/`, `decisions/` o `gotchas/`.
7. **No hardcodear secretos.** `GEMINI_API_KEY` solo vía env (`.env.local` / `.env.example`).
8. **No renombrar keys `nam_*` de localStorage** sin migración documentada en `decisions/` y update en `gotchas/`.
9. **No reemplazar el motor local** (`comboEngine`) por solo AI sin fallback cuando falta API key.
10. **No cambiar tokens de marca** (`--color-forest`, cream, highlighter, mint/blush/teal) sin actualizar `contexto/design.md` + `DESIGN.md`.
11. **No añadir gradientes púrpura/azul genéricos ni sombras difusas** (anti-slop del design system).
12. **No committear** a menos que Viridiana lo pida explícitamente.
13. **No borrar `state/`, `decisions/`, `gotchas/` o `logs/`** “para limpiar” sin confirmar.
14. **No afirmar que auth Google/Apple es real.** Hoy es UI mock + `localStorage`.
