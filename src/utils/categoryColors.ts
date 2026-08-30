import { IngredientCategory } from '../types';

export interface CategoryColorMeta {
  hex: string;
  name: string;
  cardBg: string;
  headerBg: string;
  borderAccent: string;
  chipActiveBg: string;
  bgTint: string;
  subtitle: string;
  roleBadge: string;
}

export const CATEGORY_COLORS: Record<IngredientCategory, CategoryColorMeta> = {
  proteins: {
    hex: '#bde0fe', // Sky Blue pastel
    name: 'Azul Cielo',
    cardBg: '#f0f7ff',
    headerBg: '#bde0fe',
    borderAccent: '#1a3300',
    chipActiveBg: '#bde0fe',
    bgTint: 'rgba(189, 224, 254, 0.25)',
    subtitle: 'Saciedad prolongada y estructura muscular',
    roleBadge: 'BASE SACIANTE',
  },
  fruits: {
    hex: '#f6d0ff', // Blush Rosa
    name: 'Blush Rosa',
    cardBg: '#fcf2ff',
    headerBg: '#f6d0ff',
    borderAccent: '#1a3300',
    chipActiveBg: '#f6d0ff',
    bgTint: 'rgba(246, 208, 255, 0.25)',
    subtitle: 'Fructosa natural, fibra e hidratación',
    roleBadge: 'DULZOR & FIBRA',
  },
  vegetables: {
    hex: '#c8e6c9', // Leaf Green suave
    name: 'Leaf Green',
    cardBg: '#f0f9f1',
    headerBg: '#c8e6c9',
    borderAccent: '#1a3300',
    chipActiveBg: '#c8e6c9',
    bgTint: 'rgba(200, 230, 201, 0.25)',
    subtitle: 'Prebióticos, frescura y micronutrientes',
    roleBadge: 'FRESCURA & FIBRA',
  },
  fats: {
    hex: '#ffe95c', // Butter Yellow
    name: 'Butter Yellow',
    cardBg: '#fffde8',
    headerBg: '#ffe95c',
    borderAccent: '#1a3300',
    chipActiveBg: '#ffe95c',
    bgTint: 'rgba(255, 233, 92, 0.25)',
    subtitle: 'Grasas buenas para absorción lenta',
    roleBadge: 'DENSIDAD & CONTROL',
  },
  cereals: {
    hex: '#f3e5ab', // Kraft / Arena cálido
    name: 'Kraft Arena',
    cardBg: '#fcf8eb',
    headerBg: '#f3e5ab',
    borderAccent: '#1a3300',
    chipActiveBg: '#f3e5ab',
    bgTint: 'rgba(243, 229, 171, 0.25)',
    subtitle: 'Carbohidratos complejos y energía limpia',
    roleBadge: 'ENERGÍA SOSTENIDA',
  },
};

/**
 * Returns category color based on category string or role name fallback
 */
export function getCategoryColor(category?: IngredientCategory | string): CategoryColorMeta {
  if (!category) {
    return CATEGORY_COLORS.proteins;
  }
  const key = category.toLowerCase();
  if (key === 'proteins' || key.includes('prote')) return CATEGORY_COLORS.proteins;
  if (key === 'fruits' || key.includes('frut')) return CATEGORY_COLORS.fruits;
  if (key === 'vegetables' || key.includes('verd')) return CATEGORY_COLORS.vegetables;
  if (key === 'fats' || key.includes('gras')) return CATEGORY_COLORS.fats;
  if (key === 'cereals' || key.includes('cereal') || key.includes('grano')) return CATEGORY_COLORS.cereals;
  return CATEGORY_COLORS.proteins;
}
