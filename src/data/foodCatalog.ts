import { IngredientCategory, DietaryIntolerance } from '../types';

export interface CatalogFoodItem {
  name: string;
  category: IngredientCategory;
  microTag: string;
  textureTag?: 'suave' | 'crujiente' | 'fresco' | 'neutro';
  intolerances?: DietaryIntolerance[];
  synonyms?: string[];
}

/**
 * Rich, comprehensive food catalog in Spanish for instant autocomplete and smart categorization.
 */
export const FOOD_CATALOG: CatalogFoodItem[] = [
  // --- PROTEÍNAS ---
  { name: 'Yogurt natural', category: 'proteins', microTag: 'Lácteo', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['yogur', 'yogurt'] },
  { name: 'Yogur griego', category: 'proteins', microTag: 'Proteína alta', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['yogurt griego', 'greek yogurt'] },
  { name: 'Quesitos', category: 'proteins', microTag: 'Lácteo', textureTag: 'suave', intolerances: ['lactose'] },
  { name: 'Queso panela', category: 'proteins', microTag: 'Lácteo fresco', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['panela'] },
  { name: 'Queso cottage', category: 'proteins', microTag: 'Lácteo proteico', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['cottage'] },
  { name: 'Queso mozzarella', category: 'proteins', microTag: 'Lácteo', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['mozzarella'] },
  { name: 'Requesón', category: 'proteins', microTag: 'Lácteo magro', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['requeson', 'ricotta'] },
  { name: 'Huevo duro', category: 'proteins', microTag: 'Proteína animal', textureTag: 'suave', intolerances: ['egg'], synonyms: ['huevo cocido', 'huevos'] },
  { name: 'Claras de huevo', category: 'proteins', microTag: 'Proteína magra', textureTag: 'suave', intolerances: ['egg'], synonyms: ['claras'] },
  { name: 'Hummus', category: 'proteins', microTag: 'Legumbre', textureTag: 'suave', synonyms: ['humus', 'crema de garbanzo'] },
  { name: 'Atún en agua', category: 'proteins', microTag: 'Pescado magro', textureTag: 'suave', synonyms: ['atun', 'atun en lata'] },
  { name: 'Salmón ahumado', category: 'proteins', microTag: 'Pescado omega-3', textureTag: 'suave', synonyms: ['salmon'] },
  { name: 'Pechuga de pavo', category: 'proteins', microTag: 'Embutido magro', textureTag: 'suave', synonyms: ['jamon de pavo', 'pavo'] },
  { name: 'Pollo deshebrado', category: 'proteins', microTag: 'Proteína animal', textureTag: 'suave', synonyms: ['pechuga de pollo', 'pollo'] },
  { name: 'Tofu firme', category: 'proteins', microTag: 'Proteína vegetal', textureTag: 'suave', synonyms: ['tofu'] },
  { name: 'Edamames', category: 'proteins', microTag: 'Legumbre verde', textureTag: 'fresco', synonyms: ['edamame', 'soja verde'] },
  { name: 'Garbanzos tostados', category: 'proteins', microTag: 'Legumbre crujiente', textureTag: 'crujiente', synonyms: ['garbanzos', 'garbanzo'] },
  { name: 'Frijoles negros refritos', category: 'proteins', microTag: 'Legumbre', textureTag: 'suave', synonyms: ['frijoles', 'frijol'] },
  { name: 'Proteína en polvo (Whey/Vegana)', category: 'proteins', microTag: 'Suplemento proteico', textureTag: 'suave', synonyms: ['proteina', 'whey'] },
  { name: 'Kéfir', category: 'proteins', microTag: 'Probiótico lácteo', textureTag: 'suave', intolerances: ['lactose'], synonyms: ['kefir'] },

  // --- FRUTAS ---
  { name: 'Manzana', category: 'fruits', microTag: 'Fruta crujiente', textureTag: 'crujiente', synonyms: ['manzana roja', 'apple'] },
  { name: 'Manzana verde', category: 'fruits', microTag: 'Fruta ácida', textureTag: 'crujiente', synonyms: ['manzana granny'] },
  { name: 'Plátano', category: 'fruits', microTag: 'Fruta dulce', textureTag: 'suave', synonyms: ['platano', 'banana', 'guineo'] },
  { name: 'Fresas', category: 'fruits', microTag: 'Frutos rojos', textureTag: 'fresco', synonyms: ['fresa', 'strawberries'] },
  { name: 'Blueberries', category: 'fruits', microTag: 'Antioxidantes', textureTag: 'fresco', synonyms: ['arandanos frescos', 'arandano', 'blueberry'] },
  { name: 'Arándanos deshidratados', category: 'fruits', microTag: 'Fruta seca', textureTag: 'suave', synonyms: ['arandanos secos', 'cranberries'] },
  { name: 'Frambuesas', category: 'fruits', microTag: 'Frutos rojos', textureTag: 'fresco', synonyms: ['frambuesa', 'raspberries'] },
  { name: 'Moras', category: 'fruits', microTag: 'Frutos del bosque', textureTag: 'fresco', synonyms: ['mora', 'blackberries', 'zarzamora'] },
  { name: 'Uvas verdes', category: 'fruits', microTag: 'Fruta fresca', textureTag: 'fresco', synonyms: ['uvas', 'uva'] },
  { name: 'Uvas rojas', category: 'fruits', microTag: 'Fruta fresca', textureTag: 'fresco', synonyms: ['uvas moradas'] },
  { name: 'Mango en cubos', category: 'fruits', microTag: 'Fruta tropical', textureTag: 'fresco', synonyms: ['mango'] },
  { name: 'Papaya', category: 'fruits', microTag: 'Fruta digestiva', textureTag: 'fresco', synonyms: ['papaya picada'] },
  { name: 'Sandía', category: 'fruits', microTag: 'Hidratación pura', textureTag: 'fresco', synonyms: ['sandia', 'watermelon'] },
  { name: 'Melón', category: 'fruits', microTag: 'Fruta hidratante', textureTag: 'fresco', synonyms: ['melon'] },
  { name: 'Kiwi en rodajas', category: 'fruits', microTag: 'Vitamina C', textureTag: 'fresco', synonyms: ['kiwi'] },
  { name: 'Durazno', category: 'fruits', microTag: 'Fruta de hueso', textureTag: 'fresco', synonyms: ['melocoton', 'duraznos'] },
  { name: 'Piña en trozos', category: 'fruits', microTag: 'Enzima digestiva', textureTag: 'fresco', synonyms: ['pina', 'anana'] },
  { name: 'Naranja en gajos', category: 'fruits', microTag: 'Cítrico', textureTag: 'fresco', synonyms: ['naranja', 'naranjas'] },
  { name: 'Mandarina', category: 'fruits', microTag: 'Cítrico dulce', textureTag: 'fresco', synonyms: ['mandarinas', 'clementina'] },
  { name: 'Higos frescos', category: 'fruits', microTag: 'Fruta dulce', textureTag: 'suave', synonyms: ['higo', 'higos'] },
  { name: 'Ciruelas pasas', category: 'fruits', microTag: 'Fibra natural', textureTag: 'suave', synonyms: ['pasas', 'ciruela pasa'] },
  { name: 'Guayaba', category: 'fruits', microTag: 'Fruta aromática', textureTag: 'fresco', synonyms: ['guayabas'] },
  { name: 'Granada', category: 'fruits', microTag: 'Semillas antioxidantes', textureTag: 'crujiente', synonyms: ['granadas'] },

  // --- VERDURAS ---
  { name: 'Zanahoria baby', category: 'vegetables', microTag: 'Verdura crujiente', textureTag: 'crujiente', synonyms: ['zanahoria', 'zanahorias'] },
  { name: 'Pepino en rodajas', category: 'vegetables', microTag: 'Hidratación baja caloría', textureTag: 'fresco', synonyms: ['pepino', 'pepinos'] },
  { name: 'Jitomate cherry', category: 'vegetables', microTag: 'Antioxidante licopeno', textureTag: 'fresco', synonyms: ['tomate cherry', 'jitomates cherry', 'cherry'] },
  { name: 'Apio en bastones', category: 'vegetables', microTag: 'Verdura fibrosa', textureTag: 'crujiente', synonyms: ['apio', 'bastones de apio'] },
  { name: 'Jícama con limón', category: 'vegetables', microTag: 'Verdura fresca', textureTag: 'crujiente', synonyms: ['jicama', 'jicamas'] },
  { name: 'Espinacas baby', category: 'vegetables', microTag: 'Hoja verde hierro', textureTag: 'fresco', synonyms: ['espinaca', 'espinacas'] },
  { name: 'Pimiento morrón', category: 'vegetables', microTag: 'Vitamina C crujiente', textureTag: 'crujiente', synonyms: ['pimiento', 'morron', 'pimientos'] },
  { name: 'Rabanitos en rodajas', category: 'vegetables', microTag: 'Raíz crujiente', textureTag: 'crujiente', synonyms: ['rabano', 'rabanos', 'rabanito'] },
  { name: 'Champiñones laminados', category: 'vegetables', microTag: 'Hongo fresco', textureTag: 'suave', synonyms: ['champinones', 'champinon', 'hongos'] },
  { name: 'Nopales asados', category: 'vegetables', microTag: 'Fibra soluble', textureTag: 'suave', synonyms: ['nopal', 'nopales'] },
  { name: 'Brócoli al vapor', category: 'vegetables', microTag: 'Crucífera', textureTag: 'crujiente', synonyms: ['brocoli'] },
  { name: 'Calabacita asada', category: 'vegetables', microTag: 'Verdura suave', textureTag: 'suave', synonyms: ['calabaza', 'calabacitas'] },
  { name: 'Pepinillos encurtidos', category: 'vegetables', microTag: 'Encurtido salado', textureTag: 'crujiente', synonyms: ['pepinillos', 'pickles'] },
  { name: 'Betabel rallado', category: 'vegetables', microTag: 'Raíz dulce', textureTag: 'crujiente', synonyms: ['remolacha', 'betabel'] },
  { name: 'Acelgas', category: 'vegetables', microTag: 'Hoja verde', textureTag: 'fresco', synonyms: ['acelga'] },

  // --- GRASAS ---
  { name: 'Crema de cacahuate', category: 'fats', microTag: 'Grasa monoinsaturada', textureTag: 'suave', intolerances: ['nuts'], synonyms: ['mantequilla de mani', 'peanut butter', 'cacahuate'] },
  { name: 'Crema de almendras', category: 'fats', microTag: 'Grasa saludable', textureTag: 'suave', intolerances: ['nuts'], synonyms: ['almond butter'] },
  { name: 'Nueces de castilla', category: 'fats', microTag: 'Omega-3 vegetal', textureTag: 'crujiente', intolerances: ['nuts'], synonyms: ['nueces', 'nuez', 'walnuts'] },
  { name: 'Nuez pecana', category: 'fats', microTag: 'Fruto seco', textureTag: 'crujiente', intolerances: ['nuts'], synonyms: ['pecana', 'nueces pecanas'] },
  { name: 'Almendras enteras', category: 'fats', microTag: 'Vitamina E', textureTag: 'crujiente', intolerances: ['nuts'], synonyms: ['almendras', 'almendra'] },
  { name: 'Pistaches sin sal', category: 'fats', microTag: 'Fruto seco', textureTag: 'crujiente', intolerances: ['nuts'], synonyms: ['pistache', 'pistachos', 'pistachios'] },
  { name: 'Avellanas', category: 'fats', microTag: 'Fruto seco', textureTag: 'crujiente', intolerances: ['nuts'], synonyms: ['avellana', 'hazelnuts'] },
  { name: 'Aguacate', category: 'fats', microTag: 'Grasa cardiosaludable', textureTag: 'suave', synonyms: ['palta', 'avocado'] },
  { name: 'Guacamole casero', category: 'fats', microTag: 'Grasa fresca', textureTag: 'suave', synonyms: ['guacamole'] },
  { name: 'Semillas de chía', category: 'fats', microTag: 'Fibra y omega-3', textureTag: 'crujiente', synonyms: ['chia', 'semillas de chia'] },
  { name: 'Semillas de linaza', category: 'fats', microTag: 'Omega-3 y lignanos', textureTag: 'crujiente', synonyms: ['linaza'] },
  { name: 'Pepitas de calabaza', category: 'fats', microTag: 'Zinc y magnesio', textureTag: 'crujiente', synonyms: ['pepitas', 'semillas de calabaza'] },
  { name: 'Semillas de girasol', category: 'fats', microTag: 'Semilla tostada', textureTag: 'crujiente', synonyms: ['girasol'] },
  { name: 'Ajonjolí tostado', category: 'fats', microTag: 'Calcio y grasa buena', textureTag: 'crujiente', synonyms: ['sesamo', 'ajonjoli'] },
  { name: 'Aceitunas negras', category: 'fats', microTag: 'Ácidos grasos oléicos', textureTag: 'suave', synonyms: ['aceitunas', 'aceituna'] },
  { name: 'Aceitunas verdes', category: 'fats', microTag: 'Grasa mediterránea', textureTag: 'suave', synonyms: ['olivas'] },
  { name: 'Chocolate amargo 70%+', category: 'fats', microTag: 'Polifenoles y cacao', textureTag: 'crujiente', synonyms: ['chocolate amargo', 'chocolate negro', 'cacao'] },
  { name: 'Nibs de cacao', category: 'fats', microTag: 'Cacao puro', textureTag: 'crujiente', synonyms: ['cacao nibs', 'nibs'] },
  { name: 'Coco rallado sin azúcar', category: 'fats', microTag: 'Grasa tropical', textureTag: 'crujiente', synonyms: ['coco', 'coco rallado'] },

  // --- CEREALES ---
  { name: 'Galletas habaneras', category: 'cereals', microTag: 'Cereal crocante', textureTag: 'crujiente', intolerances: ['gluten'], synonyms: ['habaneras', 'galletas saladas'] },
  { name: 'Galletas de arroz inflado', category: 'cereals', microTag: 'Cereal ligero', textureTag: 'crujiente', synonyms: ['rice cake', 'galletas de arroz', 'tortitas de arroz'] },
  { name: 'Tostadas horneadas', category: 'cereals', microTag: 'Maíz horneado', textureTag: 'crujiente', synonyms: ['tostadas', 'salmas', 'sanisimo'] },
  { name: 'Tortillas de maíz', category: 'cereals', microTag: 'Grano entero nixtamalizado', textureTag: 'suave', synonyms: ['tortilla', 'tortillas'] },
  { name: 'Totopos horneados', category: 'cereals', microTag: 'Maíz crujiente', textureTag: 'crujiente', synonyms: ['totopos', 'nachos'] },
  { name: 'Avena en hojuelas', category: 'cereals', microTag: 'Beta-glucanos y fibra', textureTag: 'suave', intolerances: ['gluten'], synonyms: ['avena', 'oatmeal'] },
  { name: 'Granola artesanal', category: 'cereals', microTag: 'Cereales horneados', textureTag: 'crujiente', intolerances: ['gluten', 'nuts'], synonyms: ['granola', 'muesli'] },
  { name: 'Pan integral tostado', category: 'cereals', microTag: 'Grano entero', textureTag: 'crujiente', intolerances: ['gluten'], synonyms: ['pan tostado', 'pan integral'] },
  { name: 'Pan de masa madre', category: 'cereals', microTag: 'Fermentación lenta', textureTag: 'crujiente', intolerances: ['gluten'], synonyms: ['sourdough', 'masa madre'] },
  { name: 'Quinoa inflada', category: 'cereals', microTag: 'Pseudocereal ligero', textureTag: 'crujiente', synonyms: ['quinoa'] },
  { name: 'Palomitas de maíz caseras', category: 'cereals', microTag: 'Grano entero con aire', textureTag: 'crujiente', synonyms: ['palomitas', 'popcorn'] },
  { name: 'Pretzels horneados', category: 'cereals', microTag: 'Bocado horneado', textureTag: 'crujiente', intolerances: ['gluten'], synonyms: ['pretzels', 'pretzel'] },
  { name: 'Salvado de avena', category: 'cereals', microTag: 'Fibra concentrada', textureTag: 'suave', intolerances: ['gluten'], synonyms: ['salvado'] }
];
