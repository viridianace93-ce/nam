# Skill: actualizar-contexto

## Cuándo correrla

Al **cerrar una sesión importante** (feature terminada, decisión tomada, bug no trivial, cambio de dirección).  
**No** en cada mensaje ni en typos/ajustes cosméticos.

Disparadores típicos:
- Viridiana dice “cierra sesión”, “actualiza contexto”, “guarda lo de hoy”
- Hubo cambio de producto/diseño/arquitectura
- Quedó un gotcha nuevo o un blocker

## Qué actualizar (en este orden)

1. **`state/current.md`** — mover hecho → hecho; refrescar pendiente y blockers. Borrar ítems obsoletos.
2. **`decisions/`** — solo si hubo decisión nueva. Un archivo corto: fecha, qué, por qué, alternativas descartadas.
3. **`contexto/decisiones.md`** — una línea en el índice apuntando al archivo nuevo.
4. **`gotchas/`** — si apareció un problema + solución reutilizable.
5. **`logs/YYYY-MM-DD-tema.md`** — 5–15 líneas: qué se hizo, qué quedó, pointers a archivos. Sin transcript.
6. **`reglas.md` / `contexto/reglas.md`** — solo si cambió una línea roja.
7. **`AGENTS.md`** — solo si cambió el mapa, invariantes o skills. Mantener ≤300 líneas.
8. **`contexto/design.md`** — solo si cambiaron tokens, tipografía o patrones UI.

## Cómo mantenerlo eficiente

- Comprimir: un log nuevo no repite logs viejos; resume o reemplaza.
- Borrar de `state/` lo que ya no aplica.
- No copiar historial de chat al prompt ni a estos archivos.
- Preferir “ver `decisions/2026-…md`” sobre pegar párrafos largos en `AGENTS.md`.
- Si `AGENTS.md` se acerca a 300 líneas: mover detalle fuera, no expandir.

## Resultado esperado

- Contexto **al día** y **más corto** que al empezar la sesión.
- Un agente nuevo puede retomar leyendo solo: `AGENTS.md` → `reglas.md` → `state/current.md`.
- Cero relleno. Cero duplicación innecesaria con `DESIGN.md` / `GUIA-VISUAL-NAM.html`.
