# 2026-08-30 — Motor local + AI opcional

**Decisión:** Generación principal en `src/utils/comboEngine.ts`. `POST /api/ai-combos` (Gemini 2.5 Flash) es opcional.

**Por qué:** Sin `GEMINI_API_KEY` la app debe seguir sugiriendo. El endpoint ya responde `combos: []` + warning si falta key.

**Descartado:** Depender solo de Gemini para la vista de resultados.
