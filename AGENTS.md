# AGENTS.md — Ñam (Bocados Simples)

## Identidad

**Ñam** ayuda a armar bocados rápidos y equilibrados con lo que ya hay en la alacena. Sin recetas, sin estufa, sin conteo de calorías. Público: fatiga ejecutiva / baja energía / poco tiempo.

Stack: React 19 + Vite + Tailwind 4 + Motion + Express (`server.ts`) + Gemini opcional (`/api/ai-combos`). Persistencia: `localStorage` (`nam_*`).

## Memoria del proyecto (cargar solo lo necesario)

| Carpeta / archivo | Qué es | Cuándo leer |
|---|---|---|
| `AGENTS.md` | Este índice | Siempre al inicio de sesión |
| `reglas.md` | Líneas rojas del agente | Siempre |
| `contexto/design.md` | Tokens y UI en corto | UI / visual |
| `contexto/decisiones.md` | Índice de decisiones | Antes de cambiar comportamiento |
| `contexto/reglas.md` | Líneas rojas de producto/diseño | UI / copy / combos |
| `decisions/` | Decisiones con fecha + por qué | Al tocar ese tema |
| `state/current.md` | Hecho / pendiente / blockers | Al planear o cerrar sesión |
| `gotchas/` | Bugs conocidos + fix | Al tocar ese área |
| `logs/` | Resumen comprimido de sesiones | Solo si falta contexto histórico |
| `skills/actualizar-contexto.md` | Cierre de sesión | Al final de sesión importante |
| `DESIGN.md` | Spec de diseño completa | Solo si `contexto/design.md` no alcanza |

**No cargar por defecto:** `GUIA-VISUAL-NAM.html` (~740 líneas), `node_modules/`, historial completo de chat, `comboEngine.ts` entero (leer por función), `App.tsx` entero (leer por sección).

## Orden de lectura preferido

1. `AGENTS.md` + `reglas.md`
2. `state/current.md`
3. Según tarea: `contexto/design.md` | `contexto/reglas.md` | archivo de `gotchas/` | decisión en `decisions/`
4. Solo entonces el código fuente del área tocada

## Reglas fijas de contexto

- El context window es caro y volátil. La memoria real vive en archivos.
- Nunca cargar todo el historial ni todos los archivos del proyecto.
- Cargar solo lo estrictamente necesario para la tarea actual.
- Al final de cada sesión importante: actualizar `state/`, registrar decisiones y comprimir lo valioso en `logs/`.
- Preferir referenciar archivos antes que copiar contenido largo al prompt.
- Convertir procedimientos repetitivos en skills reutilizables.
- Mantener `AGENTS.md` conciso (máx. 250–300 líneas) y de alta densidad.
- Al cerrar una sesión importante, correr `skills/actualizar-contexto.md`.

## Invariantes de producto

- Cero calorías en UI. Cero lenguaje de dieta restrictiva / culpa.
- Combos: mínimo **3** ingredientes seleccionados (código real; no “2+”).
- Combos locales vía `src/utils/comboEngine.ts`; AI es refuerzo opcional.
- Auth/perfil hoy es mock + `localStorage`, no OAuth real.
- Ticket OCR y apps de súper están en vision (`DESIGN.md`), **no implementados**.
- Idioma UI: español.

## Mapa rápido del código

| Área | Archivos |
|---|---|
| Orquestación / views | `src/App.tsx` |
| Tipos | `src/types.ts` |
| Catálogo / pantry default | `src/data/foodCatalog.ts`, `defaultPantry.ts` |
| Motor de combos | `src/utils/comboEngine.ts` |
| Categorización custom | `src/utils/autoCategorize.ts` |
| Tokens CSS | `src/index.css` |
| API Gemini | `server.ts` → `POST /api/ai-combos` |
| Componentes | `src/components/*` |

## Skills — cuándo usar

| Situación | Skill |
|---|---|
| Cerrar sesión con cambios relevantes | `skills/actualizar-contexto.md` |
| (Futuro) Procedimiento repetido ≥2 veces | Crear skill nueva en `skills/` |

## Definition of Done

- [ ] Cambio alineado con `reglas.md` + `contexto/reglas.md`
- [ ] Si cambió una decisión de producto/diseño → entrada en `decisions/` + índice en `contexto/decisiones.md`
- [ ] Si cambió el estado del proyecto → `state/current.md` actualizado
- [ ] Sin meter `GUIA-VISUAL-NAM.html` ni historial largo en el prompt
- [ ] En sesión importante: skill `actualizar-contexto` corrida

## Comportamiento del agente

1. Arrancar leyendo este archivo + `reglas.md` + `state/current.md`.
2. No re-descubrir decisiones ya documentadas: leer `decisions/` / `contexto/`.
3. Editar código con diffs mínimos; no reescribir archivos enteros sin necesidad.
4. Al terminar trabajo sustancial: proponer o ejecutar `skills/actualizar-contexto.md`.
5. Viridiana es diseñadora; prioriza claridad visual y copy empático sobre abstracciones de ingeniería.
