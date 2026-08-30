export type IngredientCategory = 
  | 'proteins'
  | 'fruits'
  | 'vegetables'
  | 'fats'
  | 'cereals';

export type CardTheme = 'mint' | 'blush' | 'teal';

export type DietaryIntolerance = 'lactose' | 'gluten' | 'nuts' | 'egg';

export interface IntoleranceOption {
  id: DietaryIntolerance;
  label: string;
  shortLabel: string;
  emoji?: string;
  description: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  emoji?: string;
  microTag: string; // e.g., '[Fruta]', '[Lácteo]', '[Semilla]', '[Grano integral]'
  textureTag?: 'suave' | 'crujiente' | 'fresco' | 'neutro';
  isCustom?: boolean;
  intolerances?: DietaryIntolerance[];
}

export interface FormulaRoleItem {
  name: string;
  role: string; // e.g. 'Fruta', 'Proteína', 'Grasa', 'Cereal'
  category?: IngredientCategory;
  isMissing?: boolean;
}

export interface SnackCardData {
  id: string;
  title: string;
  formula: FormulaRoleItem[];
  prepTime: string; // e.g., '1 MIN'
  benefitTag: string; // e.g., 'BALANCE COMPLETO', 'FÁCIL DIGESTIÓN'
  cardTheme: CardTheme;
  whyItWorks: string;
  prepStep: string;
  snackBadge?: string;
  nutritionTip?: string;
  isUnlockable?: boolean;
  missingCategory?: IngredientCategory;
  missingCategoryNotice?: string;
}

export interface PantryPreset {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  ingredientIds: string[];
}

export type AuthProvider = 'guest' | 'google' | 'apple' | 'email';

export interface HydrationSeasonalTip {
  id: string;
  badge: string;
  title: string;
  advice: string;
  suggestion: string;
  seasonContext?: string;
  iconType?: 'water' | 'sparkles' | 'sun' | 'leaf' | 'heart';
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  provider: AuthProvider;
  avatarUrl?: string;
  role?: string;
  avatarLetter?: string;
  intolerances?: DietaryIntolerance[];
  createdAt?: string;
}
