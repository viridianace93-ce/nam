import { SnackCardData, Ingredient, FormulaRoleItem, CardTheme, IngredientCategory, HydrationSeasonalTip } from '../types';

/**
 * Returns the friendly nutritional group role for an ingredient.
 */
function getRoleLabel(item: Ingredient): string {
  switch (item.category) {
    case 'proteins':
      return 'Proteína';
    case 'fruits':
      return 'Fruta';
    case 'vegetables':
      return 'Verdura';
    case 'fats':
      return 'Grasa';
    case 'cereals':
      return 'Cereal';
    default:
      return item.microTag?.replace(/\[|\]/g, '') || 'Alimento';
  }
}

export type TextureType = 'crujiente' | 'suave' | 'fresco';

/**
 * Infers or retrieves the primary sensory texture of an ingredient (Crujiente, Suave/Cremoso, Fresco/Jugoso).
 */
export function getIngredientTexture(item: Ingredient): TextureType {
  if (item.textureTag && item.textureTag !== 'neutro') {
    return item.textureTag;
  }

  const name = item.name.toLowerCase();

  // 1. Crujiente (Frutos secos, semillas, tostadas, vegetales firmes, granola, etc.)
  if (
    name.includes('nuez') ||
    name.includes('nueces') ||
    name.includes('almendra') ||
    name.includes('pistache') ||
    name.includes('avellana') ||
    name.includes('semilla') ||
    name.includes('pepita') ||
    name.includes('linaza') ||
    name.includes('chía') ||
    name.includes('chia') ||
    name.includes('girasol') ||
    name.includes('ajonjolí') ||
    name.includes('tostada') ||
    name.includes('totopo') ||
    name.includes('galleta') ||
    name.includes('granola') ||
    name.includes('pretzel') ||
    name.includes('palomita') ||
    name.includes('zanahoria') ||
    name.includes('apio') ||
    name.includes('jícama') ||
    name.includes('jicama') ||
    name.includes('rabanito') ||
    name.includes('pepinillo') ||
    name.includes('pimiento') ||
    name.includes('manzana') ||
    name.includes('cacao') ||
    name.includes('chocolate') ||
    name.includes('pan tostado') ||
    name.includes('pan de masa madre')
  ) {
    return 'crujiente';
  }

  // 2. Fresco / Jugoso (Frutas con alto contenido de agua, vegetales de hoja o jugosos)
  if (
    name.includes('pepino') ||
    name.includes('fresa') ||
    name.includes('arándano') ||
    name.includes('arandano') ||
    name.includes('uva') ||
    name.includes('naranja') ||
    name.includes('mandarina') ||
    name.includes('sandía') ||
    name.includes('sandia') ||
    name.includes('melón') ||
    name.includes('melon') ||
    name.includes('jitomate') ||
    name.includes('tomate') ||
    name.includes('espinaca') ||
    name.includes('lechuga') ||
    name.includes('acelga') ||
    name.includes('piña') ||
    name.includes('pina') ||
    name.includes('kiwi') ||
    name.includes('frambuesa') ||
    name.includes('zarzamora') ||
    name.includes('pera') ||
    name.includes('durazno') ||
    name.includes('mango')
  ) {
    return 'fresco';
  }

  // 3. Suave / Cremoso (Yogur, cremas de frutos secos, quesos, aguacate, huevo cocido, plátano, avena)
  if (
    name.includes('yogur') ||
    name.includes('crema de') ||
    name.includes('queso') ||
    name.includes('cottage') ||
    name.includes('ricotta') ||
    name.includes('hummus') ||
    name.includes('aguacate') ||
    name.includes('guacamole') ||
    name.includes('huevo') ||
    name.includes('plátano') ||
    name.includes('platano') ||
    name.includes('atún') ||
    name.includes('atun') ||
    name.includes('edamame') ||
    name.includes('tofu') ||
    name.includes('aceituna') ||
    name.includes('avena') ||
    name.includes('tortilla')
  ) {
    return 'suave';
  }

  // Fallbacks por categoría estándar
  if (item.category === 'fruits' || item.category === 'vegetables') {
    return 'fresco';
  }
  if (item.category === 'fats' || item.category === 'proteins') {
    return 'suave';
  }
  return 'crujiente';
}

const THEME_CYCLE: CardTheme[] = ['mint', 'blush', 'teal'];

export type ArchetypeFlavor = 'dulce' | 'salado' | 'fresco' | 'granos' | 'completo';

/**
 * Determines flavor archetype for a combination of ingredients to promote contrast in results.
 */
function getComboArchetype(items: Ingredient[]): ArchetypeFlavor {
  const cats = new Set(items.map((i) => i.category));
  if (cats.size >= 4 || items.length >= 5) return 'completo';
  if (cats.has('vegetables')) return 'salado';
  if (cats.has('fruits')) return 'dulce';
  if (cats.has('cereals') && (cats.has('fats') || cats.has('proteins'))) return 'granos';
  return 'fresco';
}

/**
 * Senior UX Writing: Explicaciones directas, ultra concisas (1-2 líneas),
 * escaneables y centradas en el beneficio tangible para el usuario.
 */
function getNutritionalJustification(
  categories: Set<IngredientCategory>,
  textures: Set<TextureType>,
  count: number
): { tag: string; why: string } {
  const hasProtein = categories.has('proteins');
  const hasFruit = categories.has('fruits');
  const hasVegetable = categories.has('vegetables');
  const hasFat = categories.has('fats');
  const hasCereal = categories.has('cereals');
  const catCount = categories.size;

  // 5 Ingredientes / 5 Grupos
  if (count >= 5 || catCount >= 5) {
    return {
      tag: 'GRAN TAZÓN INTEGRAL',
      why: 'Reúne los 5 grupos: saciedad profunda, energía estable por horas y cero pesadez.',
    };
  }

  // 4 Ingredientes
  if (count === 4 || catCount >= 4) {
    if (hasProtein && hasFruit && hasFat && hasCereal) {
      return {
        tag: 'ENERGÍA CONSTANTE & SACIEDAD',
        why: 'Proteína y grasa buena amortiguan el azúcar de la fruta: energía continua sin bajones.',
      };
    }

    if (hasProtein && hasVegetable && hasFat && hasCereal) {
      return {
        tag: 'CRUJIENTE, SALADO & SACIANTE',
        why: 'Volumen fresco y fibra que calman el hambre rápido de forma ligera.',
      };
    }

    if (hasProtein && hasFruit && hasVegetable && (hasFat || hasCereal)) {
      return {
        tag: 'FRESCO & BALANCEADO',
        why: 'Agua biológica y micronutrientes vivos con el respaldo saciante de la proteína.',
      };
    }

    if (hasFat && hasFruit && hasVegetable && hasCereal) {
      return {
        tag: 'FIBRA CRUJIENTE & ENERGÍA',
        why: 'Grasas vegetales que prolongan la energía de los granos y la fruta. Fácil digestión.',
      };
    }

    return {
      tag: 'EQUILIBRIO 4 GRUPOS',
      why: 'Texturas variadas y nutrientes reales que te mantienen satisfecho por más tiempo.',
    };
  }

  // 3 Ingredientes (Tríos)
  if (hasProtein && hasFruit && hasFat) {
    return {
      tag: 'BALANCE DULCE & SACIANTE',
      why: 'La proteína y la grasa buena ralentizan la absorción de la fruta, evitando picos de hambre.',
    };
  }

  if (hasProtein && hasVegetable && hasFat) {
    return {
      tag: 'CRUJIENTE FRESCO & SACIEDAD',
      why: 'Crocante, fresco y con grasa saludable para saciar sin inflamación.',
    };
  }

  if (hasProtein && hasFruit && hasCereal) {
    return {
      tag: 'ENFOQUE & ENERGÍA ACTIVA',
      why: 'Carbohidratos complejos para tu mente y proteína para sostener tu ritmo.',
    };
  }

  if (hasFat && hasFruit && hasCereal) {
    return {
      tag: 'ENERGÍA SOSTENIDA & CRUNCH',
      why: 'Granos enteros con grasas buenas: saciedad prolongada y textura crujiente.',
    };
  }

  if (hasProtein && hasVegetable && hasCereal) {
    return {
      tag: 'SNACK SALADO & CROCANTE',
      why: 'Fibra vegetal y proteína en un bocado salado muy satisfactorio.',
    };
  }

  if (hasProtein && hasFat && hasCereal) {
    return {
      tag: 'DENSO & NUTRITIVO',
      why: 'Alta densidad nutricional para días de mucha actividad física o mental.',
    };
  }

  if (hasProtein && hasVegetable && hasFruit) {
    return {
      tag: 'HIDRATANTE & REFRESCANTE',
      why: 'Antioxidantes naturales y proteína para renovar tu energía al instante.',
    };
  }

  if (hasFat && hasVegetable && hasCereal) {
    return {
      tag: 'CRUJIENTE & DIGESTIVO',
      why: 'Fibra crocante con grasas nobles: reconfortante y ligero para tu estómago.',
    };
  }

  if (hasProtein && hasFat) {
    return {
      tag: 'SACIEDAD PROLONGADA',
      why: 'La dupla clave para calmar el hambre profunda entre comidas sin azúcares.',
    };
  }

  if (hasProtein && (hasFruit || hasVegetable)) {
    return {
      tag: 'FRESCO & BALANCEADO',
      why: 'Hidratación y proteína para sentirte ligero y con energía renovada.',
    };
  }

  if (hasFat && (hasFruit || hasCereal)) {
    return {
      tag: 'ENERGÍA GRADUAL',
      why: 'Grasas vegetales que estabilizan la glucosa y aportan saciedad suave.',
    };
  }

  return {
    tag: 'BOCADO EQUILIBRADO',
    why: 'Ingredientes reales que se complementan para darte saciedad y ligereza inmediata.',
  };
}

interface CandidateCombo {
  key: string;
  items: Ingredient[];
  title: string;
  tag: string;
  why: string;
  baseScore: number;
  distinctCatCount: number;
  distinctTextureCount: number;
  archetype: ArchetypeFlavor;
}

/**
 * Real-time combinatorial generation engine for Ñam:
 * Evaluates selected ingredients and generates MAXIMALLY DIVERSE, non-repetitive snack combinations
 * of 3, 4, and 5 ingredients using a greedy diversity-maximization algorithm.
 */
export function generateSnackCombinations(selected: Ingredient[]): SnackCardData[] {
  // REQUIREMENT: Minimum 3 ingredients to unlock snacks
  if (selected.length < 3) {
    return [];
  }

  const seenComboKeys = new Set<string>();
  const candidates: CandidateCombo[] = [];

  const addCandidate = (items: Ingredient[], priorityBase: number) => {
    const sortedIds = items.map((i) => i.id).sort();
    const key = sortedIds.join('__');
    if (seenComboKeys.has(key)) return;
    seenComboKeys.add(key);

    const cats = new Set(items.map((i) => i.category));
    const textures = new Set(items.map((i) => getIngredientTexture(i)));
    const { tag, why } = getNutritionalJustification(cats, textures, items.length);

    const distinctCatCount = cats.size;
    const distinctTextureCount = textures.size;
    const archetype = getComboArchetype(items);

    let textureBonus = 0;
    if (distinctTextureCount >= 3) {
      textureBonus = 20;
    } else if (distinctTextureCount === 2) {
      textureBonus = 10;
    } else {
      textureBonus = -10;
    }

    const categoryBonus = distinctCatCount * 18;
    const isPureMultiGroup = distinctCatCount === items.length;

    const baseScore =
      priorityBase +
      categoryBonus +
      textureBonus +
      (isPureMultiGroup ? 15 : 0) +
      items.length * 2;

    candidates.push({
      key,
      items,
      title: items.map((i) => i.name).join(' + '),
      tag,
      why,
      baseScore,
      distinctCatCount,
      distinctTextureCount,
      archetype,
    });
  };

  const proteins = selected.filter((i) => i.category === 'proteins');
  const fruits = selected.filter((i) => i.category === 'fruits');
  const vegetables = selected.filter((i) => i.category === 'vegetables');
  const fats = selected.filter((i) => i.category === 'fats');
  const cereals = selected.filter((i) => i.category === 'cereals');

  // =========================================================================
  // 1. COMBINACIONES DE 5 INGREDIENTES
  // =========================================================================
  if (selected.length >= 5) {
    // Si están los 5 grupos representados
    if (proteins.length && fruits.length && vegetables.length && fats.length && cereals.length) {
      for (const p of proteins) {
        for (const fr of fruits) {
          for (const v of vegetables) {
            for (const f of fats) {
              for (const c of cereals) {
                addCandidate([p, fr, v, f, c], 130);
              }
            }
          }
        }
      }
    }

    // Combinaciones de 5 elementos cualesquiera con alta diversidad (mínimo 3 categorías)
    const lim5 = Math.min(selected.length, 12);
    for (let i = 0; i < lim5; i++) {
      for (let j = i + 1; j < lim5; j++) {
        for (let k = j + 1; k < lim5; k++) {
          for (let l = k + 1; l < lim5; l++) {
            for (let m = l + 1; m < selected.length; m++) {
              const comboItems = [selected[i], selected[j], selected[k], selected[l], selected[m]];
              const cats = new Set(comboItems.map((it) => it.category));
              if (cats.size >= 3) {
                addCandidate(comboItems, 100 + cats.size * 5);
              }
            }
          }
        }
      }
    }
  }

  // =========================================================================
  // 2. COMBINACIONES DE 4 INGREDIENTES
  // =========================================================================
  if (selected.length >= 4) {
    // 4A: Proteína + Fruta + Grasa + Cereal (Dulce completo)
    if (proteins.length && fruits.length && fats.length && cereals.length) {
      for (const p of proteins) {
        for (const fr of fruits) {
          for (const f of fats) {
            for (const c of cereals) {
              addCandidate([p, fr, f, c], 120);
            }
          }
        }
      }
    }

    // 4B: Proteína + Verdura + Grasa + Cereal (Salado completo)
    if (proteins.length && vegetables.length && fats.length && cereals.length) {
      for (const p of proteins) {
        for (const v of vegetables) {
          for (const f of fats) {
            for (const c of cereals) {
              addCandidate([p, v, f, c], 118);
            }
          }
        }
      }
    }

    // 4C: Proteína + Fruta + Verdura + (Grasa o Cereal)
    if (proteins.length && fruits.length && vegetables.length && (fats.length || cereals.length)) {
      const extra = [...fats, ...cereals];
      for (const p of proteins) {
        for (const fr of fruits) {
          for (const v of vegetables) {
            for (const ex of extra) {
              addCandidate([p, fr, v, ex], 112);
            }
          }
        }
      }
    }

    // 4D: Grasa + Fruta + Verdura + Cereal
    if (fats.length && fruits.length && vegetables.length && cereals.length) {
      for (const f of fats) {
        for (const fr of fruits) {
          for (const v of vegetables) {
            for (const c of cereals) {
              addCandidate([f, fr, v, c], 110);
            }
          }
        }
      }
    }

    // 4 elementos generales (mínimo 2 categorías)
    const lim4 = Math.min(selected.length, 12);
    for (let i = 0; i < lim4; i++) {
      for (let j = i + 1; j < lim4; j++) {
        for (let k = j + 1; k < lim4; k++) {
          for (let l = k + 1; l < selected.length; l++) {
            const comboItems = [selected[i], selected[j], selected[k], selected[l]];
            const cats = new Set(comboItems.map((it) => it.category));
            if (cats.size >= 2) {
              addCandidate(comboItems, 88 + cats.size * 4);
            }
          }
        }
      }
    }
  }

  // =========================================================================
  // 3. COMBINACIONES DE 3 INGREDIENTES (Tríos esenciales)
  // =========================================================================
  // 3A: Proteína + Fruta + Grasa
  if (proteins.length && fruits.length && fats.length) {
    for (const p of proteins) {
      for (const fr of fruits) {
        for (const f of fats) {
          addCandidate([p, fr, f], 110);
        }
      }
    }
  }

  // 3B: Proteína + Verdura + Grasa (Salado crujiente)
  if (proteins.length && vegetables.length && fats.length) {
    for (const p of proteins) {
      for (const v of vegetables) {
        for (const f of fats) {
          addCandidate([p, v, f], 108);
        }
      }
    }
  }

  // 3C: Proteína + Fruta + Cereal
  if (proteins.length && fruits.length && cereals.length) {
    for (const p of proteins) {
      for (const fr of fruits) {
        for (const c of cereals) {
          addCandidate([p, fr, c], 105);
        }
      }
    }
  }

  // 3D: Grasa + Fruta + Cereal
  if (fats.length && fruits.length && cereals.length) {
    for (const f of fats) {
      for (const fr of fruits) {
        for (const c of cereals) {
          addCandidate([fr, f, c], 102);
        }
      }
    }
  }

  // 3E: Proteína + Grasa + Cereal
  if (proteins.length && fats.length && cereals.length) {
    for (const p of proteins) {
      for (const f of fats) {
        for (const c of cereals) {
          addCandidate([p, f, c], 98);
        }
      }
    }
  }

  // 3F: Proteína + Verdura + Cereal
  if (proteins.length && vegetables.length && cereals.length) {
    for (const p of proteins) {
      for (const v of vegetables) {
        for (const c of cereals) {
          addCandidate([p, v, c], 96);
        }
      }
    }
  }

  // 3G: Grasa + Verdura + Cereal
  if (fats.length && vegetables.length && cereals.length) {
    for (const f of fats) {
      for (const v of vegetables) {
        for (const c of cereals) {
          addCandidate([v, f, c], 94);
        }
      }
    }
  }

  // 3H: Proteína + Verdura + Fruta
  if (proteins.length && vegetables.length && fruits.length) {
    for (const p of proteins) {
      for (const v of vegetables) {
        for (const fr of fruits) {
          addCandidate([p, v, fr], 92);
        }
      }
    }
  }

  // Tríos generales si faltan
  if (candidates.length < 20) {
    const lim3 = Math.min(selected.length, 14);
    for (let i = 0; i < lim3; i++) {
      for (let j = i + 1; j < lim3; j++) {
        for (let k = j + 1; k < selected.length; k++) {
          addCandidate([selected[i], selected[j], selected[k]], 50);
        }
      }
    }
  }

  if (candidates.length === 0) {
    return [];
  }

  // =========================================================================
  // 4. MAXIMAL DIVERSITY SELECTION ENGINE (Elimina snacks repetitivos)
  // =========================================================================
  const TARGET_TOTAL = Math.min(candidates.length, 16);
  const selectedCombos: CandidateCombo[] = [];
  const ingredientUsageCount = new Map<string, number>();
  const archetypeUsageCount = new Map<ArchetypeFlavor, number>();
  const sizeUsageCount = new Map<number, number>();

  // Helper to compute overlap between candidate and already selected list
  const getOverlapPenalty = (cand: CandidateCombo) => {
    let maxOverlapCount = 0;
    const candIdSet = new Set(cand.items.map((i) => i.id));

    for (const sel of selectedCombos) {
      let shared = 0;
      for (const item of sel.items) {
        if (candIdSet.has(item.id)) shared++;
      }
      if (shared > maxOverlapCount) {
        maxOverlapCount = shared;
      }
    }

    // Heavy penalty for sharing 2 or 3 ingredients with any existing card
    if (maxOverlapCount >= 3) return 80;
    if (maxOverlapCount === 2) return 40;
    if (maxOverlapCount === 1) return 8;
    return 0;
  };

  const getFrequencyPenalty = (cand: CandidateCombo) => {
    let totalFreq = 0;
    for (const item of cand.items) {
      const count = ingredientUsageCount.get(item.id) || 0;
      totalFreq += count * 22; // Penaliza fuertemente ingredientes ya repetidos
    }
    return totalFreq;
  };

  const getArchetypeBonus = (cand: CandidateCombo) => {
    const count = archetypeUsageCount.get(cand.archetype) || 0;
    if (count === 0) return 25; // Gran bonus por introducir nuevo perfil de sabor (salado vs dulce vs bowl)
    if (count === 1) return 8;
    return -15; // Penaliza tener demasiados del mismo perfil
  };

  const getSizeBonus = (cand: CandidateCombo) => {
    const count = sizeUsageCount.get(cand.items.length) || 0;
    if (count === 0) return 15; // Promueve variedad en tamaño (3, 4 y 5 ingredientes)
    return 0;
  };

  const availablePool = [...candidates];

  while (selectedCombos.length < TARGET_TOTAL && availablePool.length > 0) {
    let bestIndex = 0;
    let bestDynamicScore = -Infinity;

    for (let idx = 0; idx < availablePool.length; idx++) {
      const cand = availablePool[idx];
      const overlapPen = getOverlapPenalty(cand);
      const freqPen = getFrequencyPenalty(cand);
      const archBonus = getArchetypeBonus(cand);
      const sizeBonus = getSizeBonus(cand);

      const dynamicScore = cand.baseScore - overlapPen - freqPen + archBonus + sizeBonus;

      if (dynamicScore > bestDynamicScore) {
        bestDynamicScore = dynamicScore;
        bestIndex = idx;
      }
    }

    const chosen = availablePool.splice(bestIndex, 1)[0];
    selectedCombos.push(chosen);

    // Update usage tracking
    for (const it of chosen.items) {
      ingredientUsageCount.set(it.id, (ingredientUsageCount.get(it.id) || 0) + 1);
    }
    archetypeUsageCount.set(chosen.archetype, (archetypeUsageCount.get(chosen.archetype) || 0) + 1);
    sizeUsageCount.set(chosen.items.length, (sizeUsageCount.get(chosen.items.length) || 0) + 1);
  }

  // Map to SnackCardData
  return selectedCombos.map((combo, idx) => {
    const cardTheme = THEME_CYCLE[idx % THEME_CYCLE.length];
    const formula: FormulaRoleItem[] = combo.items.map((item) => ({
      name: item.name,
      role: getRoleLabel(item),
      category: item.category,
      isMissing: false,
    }));

    return {
      id: `snack-combo-${combo.items.map((i) => i.id).join('-')}-${idx}`,
      title: combo.title,
      formula,
      prepTime: '1 MIN',
      benefitTag: combo.tag,
      cardTheme,
      whyItWorks: combo.why,
      prepStep: 'Sirve en un plato o tazón pequeño y disfruta a tu ritmo.',
      snackBadge: `[${combo.tag}]`,
      isUnlockable: false,
    };
  });
}

/**
 * Generates an empathetic, human-centered hydration and seasonal wellbeing tip
 * based on the ingredients currently selected in the user's pantry.
 */
export function getHydrationSeasonalTips(selectedIngredients: Ingredient[]): HydrationSeasonalTip[] {
  const currentMonth = new Date().getMonth(); // 0 = Jan, 11 = Dec
  const isWarmSeason = currentMonth >= 4 && currentMonth <= 8; // May - Sept
  const seasonName = isWarmSeason ? 'Temporada Cálida' : 'Temporada Fresca';

  const hasFiberOrGrains = selectedIngredients.some(
    (i) => i.category === 'cereals' || i.category === 'fats'
  );
  const hasFreshWaterFoods = selectedIngredients.some(
    (i) =>
      i.name.toLowerCase().includes('pepino') ||
      i.name.toLowerCase().includes('manzana') ||
      i.name.toLowerCase().includes('jitomate') ||
      i.name.toLowerCase().includes('tomate') ||
      i.name.toLowerCase().includes('fresa') ||
      i.name.toLowerCase().includes('arándano') ||
      i.category === 'fruits' ||
      i.category === 'vegetables'
  );
  const hasProteins = selectedIngredients.some((i) => i.category === 'proteins');

  const tips: HydrationSeasonalTip[] = [];

  // Tip 1: Fibra & Agua
  if (hasFiberOrGrains) {
    tips.push({
      id: 'tip-fiber-water',
      badge: '💧 EL AGUA POTENCIA LA FIBRA',
      title: 'Acompaña tu snack con un vaso de agua fresca',
      advice: 'El agua expande suavemente la fibra de la avena y semillas, prolongando tu saciedad.',
      suggestion: 'Bebe un vaso de agua antes del primer bocado.',
      seasonContext: seasonName,
      iconType: 'water',
    });
  }

  // Tip 2: Hidratación celular viva
  if (hasFreshWaterFoods) {
    tips.push({
      id: 'tip-fresh-hydration',
      badge: '🌿 HIDRATACIÓN CELULAR NATURAL',
      title: 'Aprovecha el agua viva de tus frutas y vegetales',
      advice: 'Aportan agua biológica rica en electrolitos naturales para hidratarte entre comidas.',
      suggestion: 'Mastica despacio para saborear sus jugos frescos.',
      seasonContext: seasonName,
      iconType: 'leaf',
    });
  }

  // Tip 3: Proteína & Claridad mental
  if (hasProteins) {
    tips.push({
      id: 'tip-protein-clarity',
      badge: '☀️ PAUSA CONSCIENTE & ENERGÍA',
      title: 'Pausa de 2 minutos para recargar energía',
      advice: 'Combinar proteína e hidratación constante mantiene tu mente despejada toda la tarde.',
      suggestion: 'Ten a la mano agua fresca mientras comes.',
      seasonContext: seasonName,
      iconType: 'sun',
    });
  }

  // Tip 4: Recomendación Estacional Específica
  if (isWarmSeason) {
    tips.push({
      id: 'tip-seasonal-warm',
      badge: '☀️ RECOMENDACIÓN DE TEMPORADA CÁLIDA',
      title: 'Hidratación refrescante con infusión fría',
      advice: 'En días cálidos perdemos sales con facilidad. Un agua fresca con menta o cítricos va genial.',
      suggestion: 'Prepara una jarra fresca por la mañana.',
      seasonContext: 'Primavera / Verano',
      iconType: 'sparkles',
    });
  } else {
    tips.push({
      id: 'tip-seasonal-cool',
      badge: '🍂 RECOMENDACIÓN DE TEMPORADA FRESCA',
      title: 'Infusión tibia para calmar y confortar',
      advice: 'Una infusión tibia de manzanilla o canela reconforta el estómago y favorece la digestión.',
      suggestion: 'Tómala tibia (no hirviendo) con tu snack.',
      seasonContext: 'Otoño / Invierno',
      iconType: 'heart',
    });
  }

  // Tip 5: Regla universal de bienestar y escucha corporal
  tips.push({
    id: 'tip-mindful-hydration',
    badge: '💙 BIENESTAR COTIDIANO',
    title: 'Escucha las señales de tu cuerpo',
    advice: 'Sorbos pequeños y frecuentes a lo largo del día reconfortan más que beber de golpe.',
    suggestion: 'Ten tu vaso o botella en un lugar visible.',
    seasonContext: 'Hábito Diario',
    iconType: 'water',
  });

  return tips;
}
