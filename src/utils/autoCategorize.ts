import { IngredientCategory } from '../types';
import { FOOD_CATALOG, CatalogFoodItem } from '../data/foodCatalog';

/**
 * Normalizes text for robust matching: lowercases, removes diacritics / accents.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Capitalizes a food name cleanly (Sentence/Title case for the first letter and proper words).
 */
export function capitalizeFoodName(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Intelligent dictionary of food terms mapped to their respective nutritional categories.
 */
const CATEGORY_KEYWORDS: Record<IngredientCategory, string[]> = {
  proteins: [
    'yogur', 'yogurt', 'kefir', 'queso', 'quesitos', 'panela', 'oaxaca', 'requeson',
    'cottage', 'manchego', 'mozzarella', 'ricotta', 'huevo', 'huevos', 'clara', 'claras',
    'atun', 'salmon', 'sardina', 'sardinas', 'pescado', 'camaron', 'camarones',
    'pollo', 'pechuga', 'pavo', 'jamon', 'lomo', 'res', 'carne', 'tofu', 'edamame',
    'edamames', 'seitan', 'tempeh', 'hummus', 'garbanzo', 'garbanzos', 'lenteja', 'lentejas',
    'frijol', 'frijoles', 'soja', 'soya', 'whey', 'proteina', 'protein'
  ],
  fruits: [
    'manzana', 'pera', 'platano', 'banana', 'guineo', 'fresa', 'fresas',
    'arandano', 'arandanos', 'blueberry', 'blueberries', 'frambuesa', 'frambuesas',
    'mora', 'moras', 'zarzamora', 'uva', 'uvas', 'pasa', 'pasas', 'ciruela', 'ciruelas',
    'naranja', 'mandarina', 'toronja', 'limon', 'lima', 'pina', 'mango',
    'kiwi', 'durazno', 'melocoton', 'papaya', 'sandia', 'melon', 'higo', 'higos',
    'guayaba', 'guayabas', 'maracuya', 'granada', 'frambuesas', 'datil', 'datiles'
  ],
  vegetables: [
    'zanahoria', 'zanahorias', 'pepino', 'pepinos', 'pepinillo', 'pepinillos', 'apio', 'jicama', 'jitomate', 'tomate',
    'cherry', 'espinaca', 'espinacas', 'lechuga', 'kale', 'arugula', 'acelga', 'acelgas',
    'brocoli', 'coliflor', 'calabacita', 'calabacitas', 'calabaza', 'pimiento', 'morron',
    'chayote', 'nopal', 'nopales', 'champinon', 'champinones', 'setas', 'hongos',
    'betabel', 'remolacha', 'rabanito', 'rabanitos', 'rabano', 'verdura', 'vegetal'
  ],
  fats: [
    'aguacate', 'palta', 'avocado', 'guacamole', 'cacahuate', 'cacahuates', 'mani',
    'crema de cacahuate', 'mantequilla de mani', 'peanut butter', 'crema de almendra', 'crema de almendras',
    'nuez', 'nueces', 'almendra', 'almendras', 'pistache', 'pistaches', 'pistachos',
    'avellana', 'avellanas', 'macadamia', 'pecana', 'pecanas', 'chia', 'linaza',
    'semillas', 'semilla', 'girasol', 'pepitas', 'pepita', 'ajonjoli', 'sesamo', 'aceite',
    'oliva', 'coco', 'aceituna', 'aceitunas', 'olivas', 'chocolate amargo', 'cacao', 'nibs'
  ],
  cereals: [
    'avena', 'oatmeal', 'galleta', 'galletas', 'habaneras', 'salmas',
    'sanisimo', 'crackers', 'rice cake', 'galletas de arroz', 'tostada',
    'tostadas', 'tortilla', 'tortillas', 'totopos', 'pan', 'bagel',
    'pita', 'arroz', 'quinoa', 'granola', 'muesli', 'cereal', 'trigo',
    'salvado', 'palomitas', 'maiz', 'popcorn', 'pretzel', 'pretzels', 'sourdough'
  ]
};

/**
 * Searches the rich catalog for autocomplete suggestions matching query.
 */
export function searchCatalogSuggestions(query: string, maxResults: number = 6): CatalogFoodItem[] {
  const normQuery = normalizeText(query);
  if (!normQuery) return [];

  const results: CatalogFoodItem[] = [];
  const seenNames = new Set<string>();

  // 1. Exact starts-with matches on canonical name
  for (const item of FOOD_CATALOG) {
    const normName = normalizeText(item.name);
    if (normName.startsWith(normQuery) && !seenNames.has(normName)) {
      results.push(item);
      seenNames.add(normName);
      if (results.length >= maxResults) return results;
    }
  }

  // 2. Starts-with matches on words inside canonical name
  for (const item of FOOD_CATALOG) {
    const normName = normalizeText(item.name);
    if (seenNames.has(normName)) continue;
    const words = normName.split(' ');
    if (words.some((w) => w.startsWith(normQuery))) {
      results.push(item);
      seenNames.add(normName);
      if (results.length >= maxResults) return results;
    }
  }

  // 3. Synonym matches
  for (const item of FOOD_CATALOG) {
    const normName = normalizeText(item.name);
    if (seenNames.has(normName)) continue;
    if (item.synonyms?.some((syn) => normalizeText(syn).includes(normQuery))) {
      results.push(item);
      seenNames.add(normName);
      if (results.length >= maxResults) return results;
    }
  }

  // 4. Substring contains matches
  for (const item of FOOD_CATALOG) {
    const normName = normalizeText(item.name);
    if (seenNames.has(normName)) continue;
    if (normName.includes(normQuery)) {
      results.push(item);
      seenNames.add(normName);
      if (results.length >= maxResults) return results;
    }
  }

  return results;
}

/**
 * Infers the nutritional category of a given food name.
 */
export function inferCategory(name: string): IngredientCategory {
  const norm = normalizeText(name);
  if (!norm) return 'cereals';

  // 1. Direct match with Catalog Item
  for (const item of FOOD_CATALOG) {
    const normName = normalizeText(item.name);
    if (norm === normName || normName.startsWith(norm) || norm.startsWith(normName)) {
      return item.category;
    }
    if (item.synonyms?.some((s) => normalizeText(s) === norm || norm.includes(normalizeText(s)))) {
      return item.category;
    }
  }

  // 2. Direct keyword match
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [IngredientCategory, string[]][]) {
    for (const kw of keywords) {
      if (norm.includes(kw) || kw.includes(norm)) {
        return category;
      }
    }
  }

  // 3. Specific heuristic suffixes or patterns
  if (norm.endsWith('berry') || norm.endsWith('berries') || norm.includes('jugo') || norm.includes('fruit')) {
    return 'fruits';
  }
  if (norm.includes('crema') || norm.includes('mantequilla') || norm.includes('butter') || norm.includes('seed') || norm.includes('oil') || norm.includes('aceite')) {
    return 'fats';
  }
  if (norm.includes('crunch') || norm.includes('bread') || norm.includes('cake') || norm.includes('flake') || norm.includes('cracker') || norm.includes('toast')) {
    return 'cereals';
  }
  if (norm.includes('meat') || norm.includes('cheese') || norm.includes('bean') || norm.includes('egg') || norm.includes('protein')) {
    return 'proteins';
  }

  // Default fallback if unmatched: cereals
  return 'cereals';
}

/**
 * Returns a human-friendly category label in Spanish.
 */
export function getCategoryDisplayName(category: IngredientCategory): string {
  switch (category) {
    case 'proteins':
      return 'Proteínas';
    case 'fruits':
      return 'Frutas';
    case 'vegetables':
      return 'Verduras';
    case 'fats':
      return 'Grasas';
    case 'cereals':
      return 'Cereales';
    default:
      return 'Alimento';
  }
}
