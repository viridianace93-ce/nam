import { Ingredient, PantryPreset, IngredientCategory, IntoleranceOption } from '../types';

export const INTOLERANCE_OPTIONS: IntoleranceOption[] = [
  {
    id: 'lactose',
    label: 'Sin Lactosa',
    shortLabel: 'Lactosa',
    emoji: '',
    description: 'Excluye yogur, quesitos y derivados lácteos',
  },
  {
    id: 'gluten',
    label: 'Sin Gluten',
    shortLabel: 'Gluten',
    emoji: '',
    description: 'Excluye trigo, galletas habaneras y avena tradicional',
  },
  {
    id: 'nuts',
    label: 'Sin Frutos Secos / Cacahuate',
    shortLabel: 'Frutos Secos',
    emoji: '',
    description: 'Excluye crema de cacahuate, nueces y almendras',
  },
  {
    id: 'egg',
    label: 'Sin Huevo',
    shortLabel: 'Huevo',
    emoji: '',
    description: 'Excluye huevo duro y preparados con huevo',
  },
];

export const CATEGORY_LABELS: Record<IngredientCategory, { name: string; shortName: string; icon: string; subtitle: string; tag: string }> = {
  proteins: {
    name: 'PROTEÍNAS',
    shortName: 'Proteínas',
    icon: '',
    subtitle: 'Reparadoras, saciedad y digestión fácil',
    tag: '[SACIEDAD Y MÚSCULO]',
  },
  fruits: {
    name: 'FRUTAS',
    shortName: 'Frutas',
    icon: '',
    subtitle: 'Frescura, hidratación y fibra dulce',
    tag: '[FIBRA Y VITAMINAS]',
  },
  vegetables: {
    name: 'VERDURAS',
    shortName: 'Verduras',
    icon: '',
    subtitle: 'Crujientes, agua y micronutrientes',
    tag: '[HIDRATACIÓN Y MINERALES]',
  },
  fats: {
    name: 'GRASAS',
    shortName: 'Grasas',
    icon: '',
    subtitle: 'Energía sostenida en poco volumen',
    tag: '[ENERGÍA SOSTENIDA]',
  },
  cereals: {
    name: 'CEREALES',
    shortName: 'Cereales',
    icon: '',
    subtitle: 'Bases nobles amables con el estómago',
    tag: '[ENERGÍA RÁPIDA]',
  },
};

export const DEFAULT_INGREDIENTS: Ingredient[] = [
  // 1. PROTEÍNAS
  { id: 'yogur', name: 'Yogurt natural', category: 'proteins', emoji: '', microTag: 'Proteína', textureTag: 'suave', intolerances: ['lactose'] },
  { id: 'quesitos', name: 'Quesitos', category: 'proteins', emoji: '', microTag: 'Proteína', textureTag: 'suave', intolerances: ['lactose'] },
  { id: 'hummus', name: 'Hummus', category: 'proteins', emoji: '', microTag: 'Proteína', textureTag: 'suave', intolerances: [] },
  { id: 'huevo_duro', name: 'Huevo duro', category: 'proteins', emoji: '', microTag: 'Proteína', textureTag: 'suave', intolerances: ['egg'] },

  // 2. FRUTAS
  { id: 'manzana', name: 'Manzana', category: 'fruits', emoji: '', microTag: 'Fruta', textureTag: 'crujiente', intolerances: [] },
  { id: 'platano', name: 'Plátano', category: 'fruits', emoji: '', microTag: 'Fruta', textureTag: 'suave', intolerances: [] },
  { id: 'fresas', name: 'Fresas', category: 'fruits', emoji: '', microTag: 'Fruta', textureTag: 'fresco', intolerances: [] },
  { id: 'blueberries', name: 'Blueberries', category: 'fruits', emoji: '', microTag: 'Fruta', textureTag: 'fresco', intolerances: [] },

  // 3. VERDURAS
  { id: 'zanahoria_baby', name: 'Zanahoria baby', category: 'vegetables', emoji: '', microTag: 'Verdura', textureTag: 'crujiente', intolerances: [] },
  { id: 'pepino', name: 'Pepino', category: 'vegetables', emoji: '', microTag: 'Verdura', textureTag: 'fresco', intolerances: [] },
  { id: 'jitomate_cherry', name: 'Jitomate cherry', category: 'vegetables', emoji: '', microTag: 'Verdura', textureTag: 'fresco', intolerances: [] },

  // 4. GRASAS
  { id: 'crema_cacahuate', name: 'Crema de cacahuate', category: 'fats', emoji: '', microTag: 'Grasa', textureTag: 'suave', intolerances: ['nuts'] },
  { id: 'nueces', name: 'Nueces', category: 'fats', emoji: '', microTag: 'Grasa', textureTag: 'crujiente', intolerances: ['nuts'] },
  { id: 'almendras', name: 'Almendras', category: 'fats', emoji: '', microTag: 'Grasa', textureTag: 'crujiente', intolerances: ['nuts'] },
  { id: 'aguacate', name: 'Aguacate', category: 'fats', emoji: '', microTag: 'Grasa', textureTag: 'suave', intolerances: [] },

  // 5. CEREALES
  { id: 'galletas_habaneras', name: 'Galletas habaneras', category: 'cereals', emoji: '', microTag: 'Cereal', textureTag: 'crujiente', intolerances: ['gluten'] },
  { id: 'avena', name: 'Avena', category: 'cereals', emoji: '', microTag: 'Cereal', textureTag: 'suave', intolerances: ['gluten'] },
  { id: 'tostadas_horneadas', name: 'Tostadas horneadas', category: 'cereals', emoji: '', microTag: 'Cereal', textureTag: 'crujiente', intolerances: [] },
];

export const PANTRY_PRESETS: PantryPreset[] = [
  {
    id: 'baja_energia',
    title: 'Baja energía / Cansancio',
    description: '3 alimentos nobles de textura suave y cero masticación pesada.',
    emoji: '',
    ingredientIds: ['platano', 'yogur', 'crema_cacahuate'],
  },
  {
    id: 'apetito_fragil',
    title: 'Apetito frágil / Náusea leve',
    description: 'Bocados secos y frescos, salados y amables con el estómago.',
    emoji: '',
    ingredientIds: ['galletas_habaneras', 'quesitos', 'pepino'],
  },
];
