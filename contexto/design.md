# Design (working summary)

Fuente completa: `DESIGN.md`. No duplicar la guía HTML aquí.

## Producto

Ñam = bocados simples desde la alacena. Estética **Tactile Editorial Sketchbook**: papel cream, sticky notes, highlighter, tinta forest, sombra plana `2px 2px 0 #1a3300`.

## Tokens

| Token | Hex | Uso |
|---|---|---|
| cream | `#fcfaf5` | Fondo |
| forest | `#1a3300` | Texto, bordes, sombra |
| highlighter | `#ffe95c` | Énfasis / pills activas |
| mint / blush / teal | `#d5f5c2` / `#f6d0ff` / `#a8e5e5` | Sticky cards (opciones 1–3) |
| terracotta | `#cb5521` | Grasas / alertas suaves |
| whisper | `#f1f1f1` | Chips inactivos |

Definidos en `src/index.css` (`:root`).

## Tipo

- Display: Bricolage Grotesque
- UI: Inter
- Mono: Roboto Mono (`// ¿POR QUÉ FUNCIONA?`)

## UI real (código)

- Views: `select` | `results` (`App.tsx`)
- Mínimo **3** ingredientes para armar snacks (no “2+” del draft en DESIGN §4A)
- Empty state: `PantrySketchIllustration` + copy de selección
- Overlays: Onboarding, ProfileAuth, FavoritesDrawer
- Persistencia: keys `nam_*` en localStorage

## Vision aún no build

Escaneo de ticket OCR y vínculo a apps de súper → documentado en `DESIGN.md`, ausente en `src/`.
