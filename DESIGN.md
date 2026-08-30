# Design System & Product Specification: Ñam (Bocados Simples)

> **Ñam** es una herramienta de asistencia nutricional intuitiva diseñada para personas que experimentan fatiga ejecutiva, baja energía o falta de tiempo. Resuelve el dilema de alimentarse sin recetas elaboradas, sin estufa y con lo que ya está en la alacena.

---

## 1. Filosofía de Diseño: *Tactile Editorial Sketchbook*

El diseño de Ñam se aparta conscientemente de las interfaces clínicas, restrictivas o saturadas de conteo de calorías, adoptando una estética **cálida, humana y editorial**:
- **Cero culpa / Cero fricción**: El lenguaje visual transmite empatía, validación y simplicidad radical.
- **Metáfora física**: Papel libreta (*Cream Paper*), notas adhesivas pastel (*Sticky Notes*) y resaltados con marcador amarillo (*Highlighter Yellow*).
- **Contraste nítido**: Tinta orgánica profunda (*Forest Ink*) con bordes sólidos de 1px y sombras planas estilo risografía/cómic técnico (`shadow-[2px_2px_0px_#1a3300]`).

---

## 2. Paleta de Color (Design Tokens)

| Token | Hex | Muestra | Uso Principal |
| :--- | :--- | :--- | :--- |
| `--color-cream` | `#fcfaf5` | **Cream Paper** | Fondo general de la aplicación, lienzo de lectura |
| `--color-forest` | `#1a3300` | **Forest Ink** | Tinta primaria, tipografía, bordes (1px), sombras sólidas |
| `--color-highlighter`| `#ffe95c` | **Highlighter** | Marcador de énfasis editorial, pills activas clave |
| `--color-mint` | `#d5f5c2` | **Mint Note** | Tarjeta sticky de snack (Opción 1), categoría Proteínas |
| `--color-blush` | `#f6d0ff` | **Blush Note** | Tarjeta sticky de snack (Opción 2), categoría Frutas |
| `--color-teal` | `#a8e5e5` | **Teal Note** | Tarjeta sticky de snack (Opción 3), categoría Verduras |
| `--color-terracotta` | `#cb5521` | **Terracotta** | Categoría Grasas saludables, alertas suaves |
| `--color-whisper` | `#f1f1f1` | **Whisper Grey**| Fondos de chips inactivos, divisores neutros |

---

## 3. Tipografía & Jerarquía

### Tipografías Base
- **Display / Titulares**: `Bricolage Grotesque` (700 / 800) — Carácter editorial, desenfadado y contemporáneo.
- **Cuerpo & UI**: `Inter` (400 / 500 / 600) — Legibilidad óptima en móviles, jerarquía limpia y neutral.
- **Técnica / Metadatos**: `Roboto Mono` (400 / 700) — Comentarios técnicos (`// ¿POR QUÉ FUNCIONA?`), contadores numéricos y micro-tags.

### Escalas y Reglas de Aplicación
- **Titular Hero (`fluid-h1`)**: `clamp(20px, 6vw, 28px)` con interlineado `1.2`. Resaltado `[ en segundos ]` con background `#ffe95c`.
- **Títulos de Snack**: `clamp(14px, 4.5vw, 17px)` con `font-weight: 700`.
- **Caja Funcional (`// ¿POR QUÉ FUNCIONA?`)**:
  - Encabezado: `Roboto Mono 10px`, negrita, `#1a3300` al 80%.
  - Cuerpo: `Inter 12px`, interlineado `1.35`, limitado a 2 líneas (`line-clamp-2`).

---

## 4. Componentes Clave & Patrones de Interacción

### A. Alacena & Selector de Ingredientes
- **5 Grupos Nutricionales**:
  1. 🟣 **Proteínas** (Yogurt griego, Huevo duro, Hummus, Queso panela, Atún, Requesón, Tofu...)
  2. 🍎 **Frutas** (Manzana, Plátano, Fresas, Arándanos, Naranja...)
  3. 🥒 **Verduras** (Pepino, Zanahoria baby, Jitomate cherry, Apio...)
  4. 🥑 **Grasas Saludables** (Crema de cacahuate, Nueces, Almendras, Aguacate, Semillas de chía...)
  5. 🌾 **Cereales & Granos** (Avena, Tostadas de maíz, Galletas de arroz, Pan integral...)
- **Estado Inicial Cero Fricción**:
  - Arranca con `0` ingredientes seleccionados (`new Set()`).
  - Botón CTA principal en reposo atenuado: *"Elige 2+ ingredientes"*.
  - Empty state con ilustración de libreta: *"Toca 2 o 3 ingredientes arriba o sube tu ticket para armar tus colaciones"*.
- **Acceso Directo**: Botón `↺ Limpiar selección` para resetear al instante.

### B. Métodos Rápidos de Entrada
- **📸 Escaneo de Ticket**: Carga instantánea vía cámara o archivo OCR para transcribir alimentos del recibo a la despensa.
- **🔗 Vinculación con Apps de Súper**: Integración rápida con Walmart, Jüsto, Chedraui o Cornershop.
- **[+ Agregar otro]**: Chip punteado para añadir ingredientes personalizados al instante.

### C. Tarjetas de Resultado (*Sticky Notes*)
- **Estructura Vertical**:
  1. **Tag Superior**: `[OPCIÓN X · BENEFICIO]` (ej. `BALANCE COMPLETO`, `DIGESTIÓN LIGERA`, `RECUPERACIÓN DULCE`).
  2. **Fórmula de Cápsulas**: Ingredientes representados con iconos conectados con `+`.
  3. **Caja Funcional**: `// ¿POR QUÉ FUNCIONA?` en fondo blanco translúcido (`rgba(255, 255, 255, 0.6)`) y borde Forest al 15%.
  4. **Botonera de Acción**:
     - `[✓ Listo para comer]` (Feedback táctil + registro al historial diario).
     - `[⭐ Guardar]` / `[⭐ Guardado]` (Colección en el cajón de favoritos).
- **Animación de Entrada Escalonada**:
  - `motion.div` con `staggerChildren: 0.1s`.
  - Transición suave de entrada desde `opacity: 0, y: 20` hasta `opacity: 1, y: 0`.

---

## 5. Accesibilidad & Responsive Design
- **Contraste WCAG AA**: Ratio de contraste superior a `10:1` entre *Forest Ink* (`#1a3300`) y *Cream Paper* (`#fcfaf5`).
- **Touch Targets**: Mínimo `44px` de alto en botones y chips móviles.
- **Anti-Slop Guidelines**: Sin gradientes genéricos púrpura/azul, sin sombras flotantes difusas, bordes con cálculo matemático de radios y espaciado proporcional.
