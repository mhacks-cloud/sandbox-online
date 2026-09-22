// @ts-nocheck

export const INVENTORY_SIZE = 30;
export const CHEST_SIZE = 24;
export const HOTBAR_SIZE = 5;


export const EQUIPMENT_SLOTS = [
  "weapon",
  "offhand",
  "helmet",
  "body",
  "boots",
];


export const PROFESSION_IDS = [
  "woodcutting",
  "mining",
  "gathering",
  "fishing",
  "farming",
  "cooking",
  "production",
];


export const PROFESSION_NAMES = {
  woodcutting: "Lenhador",
  mining: "Minerador",
  gathering: "Coletor",
  fishing: "Pescador",
  farming: "Agricultor",
  cooking: "Cozinheiro",
  production: "Artesão",
};


export const PROFESSION_UNLOCKS = {

  woodcutting: [
    { level: 1, text: "Árvores comuns · Machado básico" },
    { level: 5, text: "Madeira Nobre · Machado de Cobre" },
    { level: 10, text: "Machado de Prata · bônus de rendimento" },
  ],

  mining: [
    { level: 1, text: "Pedra e Ferro" },
    { level: 5, text: "Minério de Cobre" },
    { level: 10, text: "Minério de Prata · bônus de rendimento" },
  ],

  gathering: [
    { level: 1, text: "Fibra e Frutas" },
    { level: 5, text: "Ervas medicinais" },
    { level: 10, text: "Bônus de coleta" },
  ],

  fishing: [
    { level: 1, text: "Lago da Vila" },
    { level: 5, text: "Lago Profundo · Truta" },
    { level: 10, text: "Lago Prateado · Carpa Dourada" },
  ],

  farming: [
    { level: 1, text: "Trigo e Cenoura" },
    { level: 5, text: "Tomate" },
    { level: 10, text: "Abóbora" },
  ],

  cooking: [
    { level: 1, text: "Pão e Peixe Grelhado" },
    { level: 5, text: "Ensopados avançados" },
    { level: 10, text: "Banquete do Aventureiro" },
  ],

  production: [
    { level: 1, text: "Ferramentas básicas" },
    { level: 5, text: "Equipamentos de Cobre" },
    { level: 10, text: "Equipamentos de Prata" },
  ],

};


export const LOCATIONS = {

  merchant: { x: 6, z: -5 },
  chest: { x: -7, z: -4 },
  workbench: { x: -3, z: -5 },
  furnace: { x: -1, z: -8 },
  mill: { x: -8, z: 7 },
  kitchen: { x: 5, z: 7 },

  lina: { x: 2, z: 5 },
  hunter: { x: 8, z: 7 },
  blacksmith: { x: -4, z: -10 },
  fisherman: { x: 10, z: 13 },
  farmer: { x: -12, z: 6 },
  cook: { x: 5, z: 9 },

  fishing: { x: 14, z: 14 },

};


export const RARITIES = {

  common: {
    label: "Comum",
    multiplier: 1,
  },

  uncommon: {
    label: "Incomum",
    multiplier: 1.15,
  },

  rare: {
    label: "Raro",
    multiplier: 1.35,
  },

  epic: {
    label: "Épico",
    multiplier: 1.65,
  },

  legendary: {
    label: "Lendário",
    multiplier: 2,
  },

};


/*
 * Ferramentas.
 *
 * kind = categoria utilizada pelo recurso.
 * tier = poder da ferramenta.
 */

export const TOOL_TIERS = {

  axe: {
    kind: "axe",
    tier: 1,
  },

  copper_axe: {
    kind: "axe",
    tier: 2,
  },

  silver_axe: {
    kind: "axe",
    tier: 3,
  },


  pickaxe: {
    kind: "pickaxe",
    tier: 1,
  },

  copper_pickaxe: {
    kind: "pickaxe",
    tier: 2,
  },

  silver_pickaxe: {
    kind: "pickaxe",
    tier: 3,
  },


  fishing_rod: {
    kind: "rod",
    tier: 1,
  },

  reinforced_rod: {
    kind: "rod",
    tier: 2,
  },

  silver_rod: {
    kind: "rod",
    tier: 3,
  },

};


/*
 * Tipos de recursos do mundo.
 */

export const RESOURCE_TYPES = {

  tree: {
    label: "Árvore",
    profession: "woodcutting",
    reqLevel: 1,
    tool: "axe",
    minTier: 1,
    hp: 3,
    respawn: 12000,
    xp: 8,
    drops: [
      ["wood", 3],
    ],
  },

  hard_tree: {
    label: "Árvore Nobre",
    profession: "woodcutting",
    reqLevel: 5,
    tool: "axe",
    minTier: 2,
    hp: 6,
    respawn: 20000,
    xp: 18,
    drops: [
      ["hardwood", 3],
    ],
  },


  rock: {
    label: "Rocha",
    profession: "mining",
    reqLevel: 1,
    tool: "pickaxe",
    minTier: 1,
    hp: 4,
    respawn: 15000,
    xp: 8,
    drops: [
      ["stone", 2],
    ],
  },

  ore: {
    label: "Veio de Ferro",
    profession: "mining",
    reqLevel: 1,
    tool: "pickaxe",
    minTier: 1,
    hp: 5,
    respawn: 20000,
    xp: 12,
    drops: [
      ["iron_ore", 2],
    ],
  },

  copper_ore: {
    label: "Veio de Cobre",
    profession: "mining",
    reqLevel: 5,
    tool: "pickaxe",
    minTier: 2,
    hp: 7,
    respawn: 24000,
    xp: 18,
    drops: [
      ["copper_ore", 2],
    ],
  },

  silver_ore: {
    label: "Veio de Prata",
    profession: "mining",
    reqLevel: 10,
    tool: "pickaxe",
    minTier: 3,
    hp: 9,
    respawn: 30000,
    xp: 28,
    drops: [
      ["silver_ore", 2],
    ],
  },


  bush: {
    label: "Arbusto",
    profession: "gathering",
    reqLevel: 1,
    tool: null,
    minTier: 0,
    hp: 1,
    respawn: 10000,
    xp: 8,
    drops: [
      ["fiber", 2],
      ["berry", 1],
    ],
  },

  herb_bush: {
    label: "Ervas Medicinais",
    profession: "gathering",
    reqLevel: 5,
    tool: null,
    minTier: 0,
    hp: 1,
    respawn: 16000,
    xp: 16,
    drops: [
      ["herb", 2],
      ["fiber", 1],
    ],
  },

};


/*
 * Pontos de pesca.
 */

export const FISHING_SPOTS = {

  village_lake: {
    label: "Lago da Vila",
    x: 14,
    z: 14,
    reqLevel: 1,
    minRodTier: 1,

    loot: [
      ["river_fish", 70, 8],
      ["bass", 30, 14],
    ],
  },

  deep_lake: {
    label: "Lago Profundo",
    x: -23,
    z: 23,
    reqLevel: 5,
    minRodTier: 2,

    loot: [
      ["bass", 55, 14],
      ["trout", 45, 20],
    ],
  },

  silver_lake: {
    label: "Lago Prateado",
    x: 24,
    z: -23,
    reqLevel: 10,
    minRodTier: 3,

    loot: [
      ["trout", 70, 20],
      ["golden_carp", 30, 34],
    ],
  },

};


export const ITEM_CATALOG = {

  /*
   * FERRAMENTAS
   */

  axe: {
    label: "Machado",
    icon: "🪓",
    type: "tool",
    maxStack: 1,
  },

  copper_axe: {
    label: "Machado de Cobre",
    icon: "🪓",
    type: "tool",
    maxStack: 1,
  },

  silver_axe: {
    label: "Machado de Prata",
    icon: "🪓",
    type: "tool",
    maxStack: 1,
  },


  pickaxe: {
    label: "Picareta",
    icon: "⛏️",
    type: "tool",
    maxStack: 1,
  },

  copper_pickaxe: {
    label: "Picareta de Cobre",
    icon: "⛏️",
    type: "tool",
    maxStack: 1,
  },

  silver_pickaxe: {
    label: "Picareta de Prata",
    icon: "⛏️",
    type: "tool",
    maxStack: 1,
  },


  fishing_rod: {
    label: "Vara de Pesca",
    icon: "🎣",
    type: "tool",
    maxStack: 1,
  },

  reinforced_rod: {
    label: "Vara Reforçada",
    icon: "🎣",
    type: "tool",
    maxStack: 1,
  },

  silver_rod: {
    label: "Vara de Prata",
    icon: "🎣",
    type: "tool",
    maxStack: 1,
  },


  /*
   * RECURSOS
   */

  wood: {
    label: "Madeira",
    icon: "🪵",
    type: "resource",
    maxStack: 99,
    sell: 2,
  },

  hardwood: {
    label: "Madeira Nobre",
    icon: "🪵",
    type: "resource",
    maxStack: 99,
    sell: 6,
  },

  stone: {
    label: "Pedra",
    icon: "🪨",
    type: "resource",
    maxStack: 99,
    sell: 3,
  },

  fiber: {
    label: "Fibra",
    icon: "🌿",
    type: "resource",
    maxStack: 99,
    sell: 2,
  },

  herb: {
    label: "Erva Medicinal",
    icon: "🌿",
    type: "resource",
    maxStack: 99,
    sell: 7,
  },

  iron_ore: {
    label: "Minério de Ferro",
    icon: "⛏",
    type: "resource",
    maxStack: 99,
    sell: 4,
  },

  copper_ore: {
    label: "Minério de Cobre",
    icon: "🟠",
    type: "resource",
    maxStack: 99,
    sell: 8,
  },

  silver_ore: {
    label: "Minério de Prata",
    icon: "⚪",
    type: "resource",
    maxStack: 99,
    sell: 15,
  },

  berry: {
    label: "Fruta Silvestre",
    icon: "🫐",
    type: "consumable",
    maxStack: 30,
    heal: 8,
    sell: 1,
  },


  /*
   * MATERIAIS
   */

  plank: {
    label: "Tábua",
    icon: "🟫",
    type: "material",
    maxStack: 99,
    sell: 4,
  },

  hardwood_plank: {
    label: "Tábua Nobre",
    icon: "🟫",
    type: "material",
    maxStack: 99,
    sell: 10,
  },

  rope: {
    label: "Corda",
    icon: "🪢",
    type: "material",
    maxStack: 99,
    sell: 5,
  },

  iron_ingot: {
    label: "Lingote de Ferro",
    icon: "▰",
    type: "material",
    maxStack: 99,
    sell: 10,
  },

  copper_ingot: {
    label: "Lingote de Cobre",
    icon: "🟧",
    type: "material",
    maxStack: 99,
    sell: 18,
  },

  silver_ingot: {
    label: "Lingote de Prata",
    icon: "⬜",
    type: "material",
    maxStack: 99,
    sell: 30,
  },


  /*
   * SEMENTES
   */

  wheat_seed: {
    label: "Semente de Trigo",
    icon: "🌱",
    type: "seed",
    maxStack: 50,
    buy: 2,
  },

  carrot_seed: {
    label: "Semente de Cenoura",
    icon: "🌱",
    type: "seed",
    maxStack: 50,
    buy: 3,
  },

  tomato_seed: {
    label: "Semente de Tomate",
    icon: "🌱",
    type: "seed",
    maxStack: 50,
    buy: 6,

    buyReq: {
      profession: "farming",
      level: 5,
    },
  },

  pumpkin_seed: {
    label: "Semente de Abóbora",
    icon: "🌱",
    type: "seed",
    maxStack: 50,
    buy: 10,

    buyReq: {
      profession: "farming",
      level: 10,
    },
  },


  /*
   * CULTIVOS
   */

  wheat: {
    label: "Trigo",
    icon: "🌾",
    type: "crop",
    maxStack: 99,
    sell: 4,
  },

  carrot: {
    label: "Cenoura",
    icon: "🥕",
    type: "crop",
    maxStack: 99,
    sell: 5,
  },

  tomato: {
    label: "Tomate",
    icon: "🍅",
    type: "crop",
    maxStack: 99,
    sell: 10,
  },

  pumpkin: {
    label: "Abóbora",
    icon: "🎃",
    type: "crop",
    maxStack: 99,
    sell: 18,
  },

  flour: {
    label: "Farinha",
    icon: "🥣",
    type: "material",
    maxStack: 99,
    sell: 7,
  },


  /*
   * PEIXES
   */

  river_fish: {
    label: "Peixe do Rio",
    icon: "🐟",
    type: "food",
    maxStack: 30,
    sell: 6,
  },

  bass: {
    label: "Robalo",
    icon: "🐠",
    type: "food",
    maxStack: 20,
    sell: 12,
  },

  trout: {
    label: "Truta",
    icon: "🐟",
    type: "food",
    maxStack: 20,
    sell: 22,
  },

  golden_carp: {
    label: "Carpa Dourada",
    icon: "🐟",
    type: "food",
    maxStack: 10,
    sell: 50,
  },


  /*
   * COMIDA
   */

  grilled_fish: {
    label: "Peixe Grelhado",
    icon: "🍽️",
    type: "consumable",
    maxStack: 20,
    heal: 35,
    sell: 12,
  },

  bread: {
    label: "Pão",
    icon: "🍞",
    type: "consumable",
    maxStack: 20,
    heal: 25,
    sell: 10,
  },

  vegetable_soup: {
    label: "Sopa de Legumes",
    icon: "🍲",
    type: "consumable",
    maxStack: 20,
    heal: 50,
    sell: 18,
  },

  fish_stew: {
    label: "Ensopado de Peixe",
    icon: "🥘",
    type: "consumable",
    maxStack: 20,
    heal: 70,
    sell: 28,
  },

  tomato_stew: {
    label: "Ensopado de Tomate",
    icon: "🥘",
    type: "consumable",
    maxStack: 20,
    heal: 80,
    sell: 36,
  },

  adventurer_feast: {
    label: "Banquete do Aventureiro",
    icon: "🍲",
    type: "consumable",
    maxStack: 10,
    heal: 120,
    sell: 75,
  },


  /*
   * CONSUMÍVEIS
   */

  apple: {
    label: "Maçã",
    icon: "🍎",
    type: "consumable",
    maxStack: 20,
    heal: 25,
    buy: 5,
  },

  bandage: {
    label: "Bandagem",
    icon: "🩹",
    type: "consumable",
    maxStack: 20,
    heal: 40,
    buy: 10,
  },

  healing_tonic: {
    label: "Tônico Medicinal",
    icon: "🧪",
    type: "consumable",
    maxStack: 20,
    heal: 75,
    sell: 20,
  },


  /*
   * EQUIPAMENTOS
   */

  stone_sword: {
    label: "Espada de Pedra",
    icon: "🗡️",
    type: "equipment",
    equipSlot: "weapon",
    maxStack: 1,
    attack: 6,
  },

  iron_sword: {
    label: "Espada de Ferro",
    icon: "⚔️",
    type: "equipment",
    equipSlot: "weapon",
    maxStack: 1,
    attack: 12,
  },

  copper_sword: {
    label: "Espada de Cobre",
    icon: "⚔️",
    type: "equipment",
    equipSlot: "weapon",
    maxStack: 1,
    attack: 17,
  },

  silver_sword: {
    label: "Espada de Prata",
    icon: "⚔️",
    type: "equipment",
    equipSlot: "weapon",
    maxStack: 1,
    attack: 24,
  },

  wooden_shield: {
    label: "Escudo de Madeira",
    icon: "🛡️",
    type: "equipment",
    equipSlot: "offhand",
    maxStack: 1,
    defense: 4,
  },

  explorer_hood: {
    label: "Capuz de Explorador",
    icon: "🧢",
    type: "equipment",
    equipSlot: "helmet",
    maxStack: 1,
    defense: 1,
    maxHp: 5,
  },

  explorer_vest: {
    label: "Colete de Explorador",
    icon: "🥋",
    type: "equipment",
    equipSlot: "body",
    maxStack: 1,
    defense: 3,
    maxHp: 10,
  },

  explorer_boots: {
    label: "Botas de Explorador",
    icon: "🥾",
    type: "equipment",
    equipSlot: "boots",
    maxStack: 1,
    defense: 1,
    maxHp: 5,
  },

};


export const WORKBENCH_RECIPES = {

  plank: {
    label: "4 Tábuas",
    costs: {
      wood: 2,
    },
    result: {
      id: "plank",
      qty: 4,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  hardwood_plank: {
    label: "3 Tábuas Nobres",
    costs: {
      hardwood: 2,
    },
    result: {
      id: "hardwood_plank",
      qty: 3,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  rope: {
    label: "2 Cordas",
    costs: {
      fiber: 3,
    },
    result: {
      id: "rope",
      qty: 2,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  fishing_rod: {
    label: "Vara de Pesca",
    costs: {
      plank: 2,
      rope: 2,
    },
    result: {
      id: "fishing_rod",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  reinforced_rod: {
    label: "Vara Reforçada",
    costs: {
      hardwood_plank: 2,
      copper_ingot: 2,
      rope: 2,
    },
    result: {
      id: "reinforced_rod",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  silver_rod: {
    label: "Vara de Prata",
    costs: {
      hardwood_plank: 3,
      silver_ingot: 2,
      rope: 3,
    },
    result: {
      id: "silver_rod",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 10,
  },


  copper_axe: {
    label: "Machado de Cobre",
    costs: {
      hardwood_plank: 2,
      copper_ingot: 2,
    },
    result: {
      id: "copper_axe",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  copper_pickaxe: {
    label: "Picareta de Cobre",
    costs: {
      hardwood_plank: 2,
      copper_ingot: 3,
    },
    result: {
      id: "copper_pickaxe",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  silver_axe: {
    label: "Machado de Prata",
    costs: {
      hardwood_plank: 3,
      silver_ingot: 3,
    },
    result: {
      id: "silver_axe",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 10,
  },

  silver_pickaxe: {
    label: "Picareta de Prata",
    costs: {
      hardwood_plank: 3,
      silver_ingot: 4,
    },
    result: {
      id: "silver_pickaxe",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 10,
  },


  stone_sword: {
    label: "Espada de Pedra",
    costs: {
      plank: 1,
      stone: 4,
    },
    result: {
      id: "stone_sword",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  wooden_shield: {
    label: "Escudo de Madeira",
    costs: {
      plank: 3,
      rope: 1,
    },
    result: {
      id: "wooden_shield",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  bandage: {
    label: "2 Bandagens",
    costs: {
      fiber: 2,
      berry: 1,
    },
    result: {
      id: "bandage",
      qty: 2,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  healing_tonic: {
    label: "Tônico Medicinal",
    costs: {
      herb: 2,
      berry: 1,
    },
    result: {
      id: "healing_tonic",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  explorer_hood: {
    label: "Capuz",
    costs: {
      fiber: 4,
      rope: 1,
    },
    result: {
      id: "explorer_hood",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  explorer_vest: {
    label: "Colete",
    costs: {
      fiber: 6,
      rope: 2,
    },
    result: {
      id: "explorer_vest",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  explorer_boots: {
    label: "Botas",
    costs: {
      fiber: 4,
      rope: 1,
    },
    result: {
      id: "explorer_boots",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

};


export const FURNACE_RECIPES = {

  iron_ingot: {
    label: "Lingote de Ferro",
    costs: {
      iron_ore: 2,
      wood: 1,
    },
    result: {
      id: "iron_ingot",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  copper_ingot: {
    label: "Lingote de Cobre",
    costs: {
      copper_ore: 2,
      wood: 1,
    },
    result: {
      id: "copper_ingot",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  silver_ingot: {
    label: "Lingote de Prata",
    costs: {
      silver_ore: 2,
      hardwood: 1,
    },
    result: {
      id: "silver_ingot",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 10,
  },


  iron_sword: {
    label: "Espada de Ferro",
    costs: {
      iron_ingot: 3,
      plank: 1,
    },
    result: {
      id: "iron_sword",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

  copper_sword: {
    label: "Espada de Cobre",
    costs: {
      copper_ingot: 4,
      hardwood_plank: 1,
    },
    result: {
      id: "copper_sword",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 5,
  },

  silver_sword: {
    label: "Espada de Prata",
    costs: {
      silver_ingot: 5,
      hardwood_plank: 2,
    },
    result: {
      id: "silver_sword",
      qty: 1,
    },
    reqProfession: "production",
    reqLevel: 10,
  },

};


export const MILL_RECIPES = {

  flour: {
    label: "2 Farinhas",
    costs: {
      wheat: 2,
    },
    result: {
      id: "flour",
      qty: 2,
    },
    reqProfession: "production",
    reqLevel: 1,
  },

};


export const KITCHEN_RECIPES = {

  grilled_fish: {
    label: "Peixe Grelhado",
    costs: {
      river_fish: 1,
    },
    result: {
      id: "grilled_fish",
      qty: 1,
    },
    reqProfession: "cooking",
    reqLevel: 1,
  },

  bread: {
    label: "Pão",
    costs: {
      flour: 2,
    },
    result: {
      id: "bread",
      qty: 2,
    },
    reqProfession: "cooking",
    reqLevel: 1,
  },

  vegetable_soup: {
    label: "Sopa de Legumes",
    costs: {
      carrot: 2,
      berry: 1,
    },
    result: {
      id: "vegetable_soup",
      qty: 1,
    },
    reqProfession: "cooking",
    reqLevel: 1,
  },

  fish_stew: {
    label: "Ensopado de Peixe",
    costs: {
      bass: 1,
      carrot: 1,
    },
    result: {
      id: "fish_stew",
      qty: 1,
    },
    reqProfession: "cooking",
    reqLevel: 5,
  },

  tomato_stew: {
    label: "Ensopado de Tomate",
    costs: {
      tomato: 2,
      herb: 1,
    },
    result: {
      id: "tomato_stew",
      qty: 1,
    },
    reqProfession: "cooking",
    reqLevel: 5,
  },

  adventurer_feast: {
    label: "Banquete do Aventureiro",
    costs: {
      pumpkin: 1,
      golden_carp: 1,
      tomato: 2,
      herb: 2,
    },
    result: {
      id: "adventurer_feast",
      qty: 1,
    },
    reqProfession: "cooking",
    reqLevel: 10,
  },

};


export const RESOURCE_LAYOUT = [

  ["tree_01", "tree", -16, -14],
  ["tree_02", "tree", -12, -17],
  ["tree_03", "tree", -19, -7],
  ["tree_04", "tree", -18, 9],
  ["tree_05", "tree", -12, 15],
  ["tree_06", "tree", -5, 18],
  ["tree_07", "tree", 5, 18],
  ["tree_08", "tree", 15, 15],
  ["tree_09", "tree", 20, 8],
  ["tree_10", "tree", 21, -4],
  ["tree_11", "tree", 17, -15],
  ["tree_12", "tree", -4, -19],

  ["hard_tree_01", "hard_tree", -27, -22],
  ["hard_tree_02", "hard_tree", -24, -26],
  ["hard_tree_03", "hard_tree", -29, -12],
  ["hard_tree_04", "hard_tree", -26, 20],


  ["rock_01", "rock", -9, 8],
  ["rock_02", "rock", -14, 2],
  ["rock_03", "rock", 7, 9],
  ["rock_04", "rock", 15, 5],
  ["rock_05", "rock", 11, -11],
  ["rock_06", "rock", -8, -11],
  ["rock_07", "rock", 19, -8],
  ["rock_08", "rock", -20, -14],


  ["ore_01", "ore", -22, 6],
  ["ore_02", "ore", -18, 18],
  ["ore_03", "ore", 21, 15],
  ["ore_04", "ore", 24, -12],
  ["ore_05", "ore", -14, -20],

  ["copper_01", "copper_ore", 27, 20],
  ["copper_02", "copper_ore", 28, 15],
  ["copper_03", "copper_ore", -27, -7],

  ["silver_01", "silver_ore", 27, -27],
  ["silver_02", "silver_ore", 22, -29],
  ["silver_03", "silver_ore", -28, 27],


  ["bush_01", "bush", -6, 7],
  ["bush_02", "bush", -12, 5],
  ["bush_03", "bush", 5, 12],
  ["bush_04", "bush", 13, -4],
  ["bush_05", "bush", -15, -4],
  ["bush_06", "bush", 4, -15],

  ["herb_01", "herb_bush", -26, 24],
  ["herb_02", "herb_bush", -23, 20],
  ["herb_03", "herb_bush", 26, -18],

];


export const FARM_LAYOUT = [

  ["farm_01", -15, 4],
  ["farm_02", -13, 4],
  ["farm_03", -11, 4],

  ["farm_04", -15, 7],
  ["farm_05", -13, 7],
  ["farm_06", -11, 7],

  ["farm_07", -15, 10],
  ["farm_08", -13, 10],
  ["farm_09", -11, 10],

];


export const CROPS = {

  wheat_seed: {
    crop: "wheat",
    growTime: 18000,
    yield: 4,
    xp: 10,
    reqLevel: 1,
  },

  carrot_seed: {
    crop: "carrot",
    growTime: 24000,
    yield: 3,
    xp: 14,
    reqLevel: 1,
  },

  tomato_seed: {
    crop: "tomato",
    growTime: 32000,
    yield: 4,
    xp: 22,
    reqLevel: 5,
  },

  pumpkin_seed: {
    crop: "pumpkin",
    growTime: 45000,
    yield: 3,
    xp: 34,
    reqLevel: 10,
  },

};


export const ENEMY_TYPES = {

  slime: {
    label: "Slime",
    level: 1,
    hp: 18,
    speed: 1.7,
    attack: 4,
    aggro: 6,
    range: 1.25,
    attackCooldown: 1400,
    xp: 8,
    gold: 1,
    respawn: 9000,

    loot: [
      ["berry", 1, .75],
      ["fiber", 1, .35],
    ],

    equipment: [
      ["explorer_hood", .07],
    ],
  },


  wolf: {
    label: "Lobo",
    level: 2,
    hp: 32,
    speed: 2.5,
    attack: 7,
    aggro: 8,
    range: 1.35,
    attackCooldown: 1200,
    xp: 15,
    gold: 2,
    respawn: 12000,

    loot: [
      ["fiber", 2, .85],
      ["berry", 1, .25],
    ],

    equipment: [
      ["wooden_shield", .07],
      ["explorer_boots", .05],
    ],
  },


  goblin: {
    label: "Goblin",
    level: 3,
    hp: 45,
    speed: 2,
    attack: 9,
    aggro: 9,
    range: 1.45,
    attackCooldown: 1100,
    xp: 24,
    gold: 4,
    respawn: 15000,

    loot: [
      ["iron_ore", 1, .75],
      ["stone", 2, .45],
    ],

    equipment: [
      ["stone_sword", .15],
      ["iron_sword", .04],
    ],
  },

};


export const ENEMY_LAYOUT = [

  ["slime_01", "slime", 15, -18],
  ["slime_02", "slime", 20, -15],
  ["slime_03", "slime", 23, -20],
  ["slime_04", "slime", 17, -23],

  ["wolf_01", "wolf", -22, 10],
  ["wolf_02", "wolf", -25, 16],
  ["wolf_03", "wolf", -19, 20],

  ["goblin_01", "goblin", 23, 5],
  ["goblin_02", "goblin", 26, 10],
  ["goblin_03", "goblin", 24, 16],

];


export const NPC_NAMES = {

  lina: "Lina · Exploradora",
  hunter: "Kael · Caçador",
  blacksmith: "Borin · Ferreiro",
  fisherman: "Nilo · Pescador",
  farmer: "Mara · Agricultora",
  cook: "Cora · Cozinheira",

};


export const QUESTS = {

  slime_hunt: {
    npc: "lina",
    title: "Primeiros Passos",
    description: "Mostre a Lina que consegue se defender fora da vila.",
    requires: [],

    objectives: [
      {
        type: "kill",
        target: "slime",
        amount: 3,
        label: "Derrote Slimes",
      },
    ],

    reward: {
      xp: 20,
      gold: 6,
      items: [
        {
          id: "apple",
          qty: 2,
          rarity: "common",
        },
      ],
    },

    rewardText: "20 XP · 6 ouro · 2 Maçãs",
  },


  gather_supplies: {
    npc: "lina",
    title: "Suprimentos da Vila",
    description: "Reúna materiais dos arbustos para ajudar os moradores.",
    requires: [
      "slime_hunt",
    ],

    objectives: [
      {
        type: "collect",
        target: "fiber",
        amount: 5,
        label: "Colete Fibra",
      },

      {
        type: "collect",
        target: "berry",
        amount: 3,
        label: "Colete Frutas",
      },
    ],

    reward: {
      xp: 25,
      gold: 10,
      items: [
        {
          id: "bandage",
          qty: 2,
          rarity: "common",
        },
      ],
    },

    rewardText: "25 XP · 10 ouro · 2 Bandagens",
  },


  wolf_hunt: {
    npc: "hunter",
    title: "Predadores do Bosque",
    description: "Kael quer reduzir os ataques de lobos perto da vila.",
    requires: [],

    objectives: [
      {
        type: "kill",
        target: "wolf",
        amount: 3,
        label: "Derrote Lobos",
      },
    ],

    reward: {
      xp: 35,
      gold: 15,
      items: [
        {
          id: "explorer_hood",
          qty: 1,
          rarity: "uncommon",
        },
      ],
    },

    rewardText: "35 XP · 15 ouro · Capuz Incomum",
  },


  goblin_threat: {
    npc: "hunter",
    title: "A Ameaça Goblin",
    description: "Os goblins estão avançando em direção à vila.",
    requires: [
      "wolf_hunt",
    ],

    objectives: [
      {
        type: "kill",
        target: "goblin",
        amount: 3,
        label: "Derrote Goblins",
      },
    ],

    reward: {
      xp: 45,
      gold: 25,
      items: [
        {
          id: "stone_sword",
          qty: 1,
          rarity: "rare",
        },
      ],
    },

    rewardText: "45 XP · 25 ouro · Espada Rara",
  },


  iron_age: {
    npc: "blacksmith",
    title: "A Era do Ferro",
    description: "Borin precisa de minério e lingotes.",
    requires: [
      "gather_supplies",
    ],

    objectives: [
      {
        type: "collect",
        target: "iron_ore",
        amount: 6,
        label: "Colete Minério de Ferro",
      },

      {
        type: "craft",
        target: "iron_ingot",
        amount: 2,
        label: "Produza Lingotes",
      },
    ],

    reward: {
      xp: 40,
      gold: 20,
      items: [
        {
          id: "explorer_vest",
          qty: 1,
          rarity: "uncommon",
        },
      ],
    },

    rewardText: "40 XP · 20 ouro · Colete Incomum",
  },


  master_forge: {
    npc: "blacksmith",
    title: "A Lâmina do Ferreiro",
    description: "Forje uma Espada de Ferro.",
    requires: [
      "iron_age",
    ],

    objectives: [
      {
        type: "craft",
        target: "iron_sword",
        amount: 1,
        label: "Forje uma Espada de Ferro",
      },
    ],

    reward: {
      xp: 60,
      gold: 35,
      items: [
        {
          id: "iron_sword",
          qty: 1,
          rarity: "rare",
        },

        {
          id: "explorer_boots",
          qty: 1,
          rarity: "uncommon",
        },
      ],
    },

    rewardText: "60 XP · 35 ouro · Espada Rara · Botas",
  },


  copper_age: {
    npc: "blacksmith",
    title: "A Era do Cobre",
    description: "Alcance o próximo nível da metalurgia.",
    requires: [
      "iron_age",
    ],

    objectives: [
      {
        type: "craft",
        target: "copper_ingot",
        amount: 2,
        label: "Produza Lingotes de Cobre",
      },

      {
        type: "craft",
        target: "copper_pickaxe",
        amount: 1,
        label: "Fabrique uma Picareta de Cobre",
      },
    ],

    reward: {
      xp: 80,
      gold: 45,
      items: [
        {
          id: "copper_sword",
          qty: 1,
          rarity: "uncommon",
        },
      ],
    },

    rewardText: "80 XP · 45 ouro · Espada de Cobre",
  },


  silver_age: {
    npc: "blacksmith",
    title: "A Era da Prata",
    description: "Domine os materiais mais avançados desta região.",
    requires: [
      "copper_age",
    ],

    objectives: [
      {
        type: "craft",
        target: "silver_ingot",
        amount: 2,
        label: "Produza Lingotes de Prata",
      },

      {
        type: "craft",
        target: "silver_pickaxe",
        amount: 1,
        label: "Fabrique uma Picareta de Prata",
      },
    ],

    reward: {
      xp: 140,
      gold: 90,
      items: [
        {
          id: "silver_sword",
          qty: 1,
          rarity: "rare",
        },
      ],
    },

    rewardText: "140 XP · 90 ouro · Espada de Prata",
  },


  fisherman_intro: {
    npc: "fisherman",
    title: "Primeira Pescaria",
    description: "Nilo quer ver se você leva jeito para pescar.",
    requires: [],

    objectives: [
      {
        type: "fish",
        target: "any_fish",
        amount: 3,
        label: "Pesque Peixes",
      },
    ],

    reward: {
      xp: 30,
      gold: 12,
      items: [
        {
          id: "grilled_fish",
          qty: 2,
          rarity: "common",
        },
      ],
    },

    rewardText: "30 XP · 12 ouro · 2 Peixes Grelhados",
  },


  deep_fishing: {
    npc: "fisherman",
    title: "Águas Profundas",
    description: "Explore o Lago Profundo e encontre Trutas.",
    requires: [
      "fisherman_intro",
    ],

    objectives: [
      {
        type: "fish",
        target: "trout",
        amount: 2,
        label: "Pesque Trutas",
      },
    ],

    reward: {
      xp: 80,
      gold: 40,
      items: [
        {
          id: "fish_stew",
          qty: 2,
          rarity: "common",
        },
      ],
    },

    rewardText: "80 XP · 40 ouro · 2 Ensopados",
  },


  farmer_intro: {
    npc: "farmer",
    title: "Primeira Colheita",
    description: "Mara quer ensinar você a trabalhar com a terra.",
    requires: [],

    objectives: [
      {
        type: "harvest",
        target: "any_crop",
        amount: 2,
        label: "Faça Colheitas",
      },
    ],

    reward: {
      xp: 30,
      gold: 12,
      items: [
        {
          id: "wheat_seed",
          qty: 6,
          rarity: "common",
        },

        {
          id: "carrot_seed",
          qty: 4,
          rarity: "common",
        },
      ],
    },

    rewardText: "30 XP · 12 ouro · Sementes",
  },


  tomato_farmer: {
    npc: "farmer",
    title: "Agricultura Avançada",
    description: "Mara quer testar sua habilidade com Tomates.",
    requires: [
      "farmer_intro",
    ],

    objectives: [
      {
        type: "harvest",
        target: "tomato",
        amount: 2,
        label: "Colha Tomates",
      },
    ],

    reward: {
      xp: 75,
      gold: 35,
      items: [
        {
          id: "pumpkin_seed",
          qty: 2,
          rarity: "common",
        },
      ],
    },

    rewardText: "75 XP · 35 ouro · 2 Sementes de Abóbora",
  },


  cook_intro: {
    npc: "cook",
    title: "Comida de Verdade",
    description: "Cora quer que você prepare sua primeira refeição.",
    requires: [],

    objectives: [
      {
        type: "cook",
        target: "any_food",
        amount: 2,
        label: "Prepare Refeições",
      },
    ],

    reward: {
      xp: 35,
      gold: 15,
      items: [
        {
          id: "fish_stew",
          qty: 1,
          rarity: "common",
        },
      ],
    },

    rewardText: "35 XP · 15 ouro · Ensopado de Peixe",
  },

};
