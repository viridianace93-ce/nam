# 2026-08-30 — Persistencia localStorage

**Decisión:** Perfil, alacena, favoritos, historial reciente y onboarding viven en `localStorage` con keys `nam_*`.

**Por qué:** App AI Studio / cliente-first; no hay backend de cuentas.

**Implicación:** “Login” Google/Apple/email es UI mock. `localStorage.clear()` en reset borra todo el estado del usuario.
