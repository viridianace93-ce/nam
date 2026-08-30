# Gotcha: modales sin patrón dialog a11y

**Síntoma:** Onboarding / Profile / Favorites son overlays visuales sin `role="dialog"`, focus trap ni Escape.

**Fix (cuando se implemente):** dialog + aria-modal + focus in/out + Escape + `inert` en el fondo. Ver pendiente en `state/current.md`.
