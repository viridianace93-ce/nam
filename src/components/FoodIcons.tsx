import React from 'react';
import {
  Apple,
  Banana,
  Cherry,
  Citrus,
  Grape,
  Egg,
  Fish,
  Milk,
  Beef,
  Drumstick,
  Soup,
  Carrot,
  Salad,
  Nut,
  Wheat,
  Cookie,
  Sandwich,
  Droplet,
  Sparkles,
  Utensils,
  type LucideProps,
} from 'lucide-react';
import { IngredientCategory } from '../types';

interface FoodIconProps {
  category?: IngredientCategory;
  name?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Returns the best-matching Lucide React icon component based on ingredient name or category.
 */
export const FoodIcon: React.FC<FoodIconProps> = ({
  category,
  name = '',
  className = 'w-4 h-4',
  size = 16,
  strokeWidth = 2,
}) => {
  const lower = name.toLowerCase();

  // Helper renderer
  const renderLucide = (
    IconComponent: React.ComponentType<LucideProps>
  ) => {
    return (
      <IconComponent
        size={size}
        strokeWidth={strokeWidth}
        className={className}
      />
    );
  };

  // 1. Specific Food Matchers
  // Apples & Pears
  if (lower.includes('manzana') || lower.includes('pera')) {
    return renderLucide(Apple);
  }

  // Bananas
  if (
    lower.includes('plátano') ||
    lower.includes('platano') ||
    lower.includes('banana')
  ) {
    return renderLucide(Banana);
  }

  // Berries & small fruits & cherry tomatoes
  if (
    lower.includes('fresa') ||
    lower.includes('arándano') ||
    lower.includes('arandano') ||
    lower.includes('mora') ||
    lower.includes('frambuesa') ||
    lower.includes('cereza') ||
    lower.includes('cherry')
  ) {
    return renderLucide(Cherry);
  }

  // Citrus fruits
  if (
    lower.includes('naranja') ||
    lower.includes('limón') ||
    lower.includes('limon') ||
    lower.includes('mandarina') ||
    lower.includes('toronja')
  ) {
    return renderLucide(Citrus);
  }

  // Grapes & raisins
  if (lower.includes('uva') || lower.includes('pasa')) {
    return renderLucide(Grape);
  }

  // Eggs
  if (lower.includes('huevo') || lower.includes('clara')) {
    return renderLucide(Egg);
  }

  // Seafood & fish
  if (
    lower.includes('atún') ||
    lower.includes('atun') ||
    lower.includes('sardina') ||
    lower.includes('salmon') ||
    lower.includes('salmón') ||
    lower.includes('pescado')
  ) {
    return renderLucide(Fish);
  }

  // Dairy (yogurt, milk, kefir, cottage cheese, panela)
  if (
    lower.includes('yogurt') ||
    lower.includes('yogur') ||
    lower.includes('kéfir') ||
    lower.includes('kefir') ||
    lower.includes('leche') ||
    lower.includes('cottage') ||
    lower.includes('requesón') ||
    lower.includes('requeson') ||
    lower.includes('queso')
  ) {
    return renderLucide(Milk);
  }

  // Poultry & meats
  if (
    lower.includes('pollo') ||
    lower.includes('pavo') ||
    lower.includes('pechuga')
  ) {
    return renderLucide(Drumstick);
  }

  if (
    lower.includes('carne') ||
    lower.includes('jamón') ||
    lower.includes('jamon') ||
    lower.includes('res')
  ) {
    return renderLucide(Beef);
  }

  // Nuts, seeds & nut butters
  if (
    lower.includes('nuez') ||
    lower.includes('nueces') ||
    lower.includes('almendra') ||
    lower.includes('cacahuate') ||
    lower.includes('maní') ||
    lower.includes('mani') ||
    lower.includes('pistache') ||
    lower.includes('avellana') ||
    lower.includes('crema de cacahuate') ||
    lower.includes('crema de almendra') ||
    lower.includes('mantequilla')
  ) {
    return renderLucide(Nut);
  }

  // Hummus, dips, sauces & soups
  if (
    lower.includes('hummus') ||
    lower.includes('edamame') ||
    lower.includes('frijol') ||
    lower.includes('tahini') ||
    lower.includes('guacamole')
  ) {
    return renderLucide(Soup);
  }

  // Carrots & root vegetables
  if (
    lower.includes('zanahoria') ||
    lower.includes('pepino') ||
    lower.includes('apio') ||
    lower.includes('jitomate')
  ) {
    return renderLucide(Carrot);
  }

  // Greens & fresh vegetables
  if (
    lower.includes('espinaca') ||
    lower.includes('lechuga') ||
    lower.includes('verdura') ||
    lower.includes('vegetal') ||
    lower.includes('kale')
  ) {
    return renderLucide(Salad);
  }

  // Oats, cereals, grains, chia, granola
  if (
    lower.includes('avena') ||
    lower.includes('cereal') ||
    lower.includes('granola') ||
    lower.includes('quinoa') ||
    lower.includes('trigo') ||
    lower.includes('semilla') ||
    lower.includes('chía') ||
    lower.includes('chia')
  ) {
    return renderLucide(Wheat);
  }

  // Bread, toast, rice cakes, crackers
  if (
    lower.includes('pan') ||
    lower.includes('tostada') ||
    lower.includes('sandwich') ||
    lower.includes('sándwich') ||
    lower.includes('bagel')
  ) {
    return renderLucide(Sandwich);
  }

  if (
    lower.includes('galleta') ||
    lower.includes('cracker') ||
    lower.includes('arroz') ||
    lower.includes('habanera')
  ) {
    return renderLucide(Cookie);
  }

  // Oils & fats
  if (
    lower.includes('aceite') ||
    lower.includes('oliva') ||
    lower.includes('aguacate')
  ) {
    return renderLucide(Droplet);
  }

  // Superfoods / seeds
  if (lower.includes('linaza') || lower.includes('cacao')) {
    return renderLucide(Sparkles);
  }

  // 2. Category Fallback Matchers
  switch (category) {
    case 'fruits':
      return renderLucide(Apple);
    case 'vegetables':
      return renderLucide(Carrot);
    case 'proteins':
      return renderLucide(Egg);
    case 'fats':
      return renderLucide(Nut);
    case 'cereals':
      return renderLucide(Wheat);
    default:
      return renderLucide(Utensils);
  }
};
