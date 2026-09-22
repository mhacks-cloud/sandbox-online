// @ts-nocheck

export const INVENTORY_SIZE = 24;
export const CHEST_SIZE = 18;
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

  woodcutting:
    "Lenhador",

  mining:
    "Minerador",

  gathering:
    "Coletor",

  fishing:
    "Pescador",

  farming:
    "Agricultor",

  cooking:
    "Cozinheiro",

  production:
    "Artesão",

};


export const LOCATIONS = {

  merchant: {
    x: 6,
    z: -5,
  },

  chest: {
    x: -7,
    z: -4,
  },

  workbench: {
    x: -3,
    z: -5,
  },

  furnace: {
    x: -1,
    z: -8,
  },

  mill: {
    x: -8,
    z: 7,
  },

  kitchen: {
    x: 5,
    z: 7,
  },

  lina: {
    x: 2,
    z: 5,
  },

  hunter: {
    x: 8,
    z: 7,
  },

  blacksmith: {
    x: -4,
    z: -10,
  },

  fisherman: {
    x: 10,
    z: 13,
  },

  farmer: {
    x: -12,
    z: 6,
  },

  cook: {
    x: 5,
    z: 9,
  },

  fishing: {
    x: 14,
    z: 14,
  },

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


export const ITEM_CATALOG = {

  axe: {
    label: "Machado",
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

  fishing_rod: {
    label: "Vara de Pesca",
    icon: "🎣",
    type: "tool",
    maxStack: 1,
  },


  wood: {
    label: "Madeira",
    icon: "🪵",
    type: "resource",
    maxStack: 99,
    sell: 2,
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

  iron_ore: {
    label: "Minério de Ferro",
    icon: "⛏",
    type: "resource",
    maxStack: 99,
    sell: 4,
  },

  berry: {
    label: "Fruta Silvestre",
    icon: "🫐",
    type: "consumable",
    maxStack: 30,
    heal: 8,
    sell: 1,
  },


  plank: {
    label: "Tábua",
    icon: "🟫",
    type: "material",
    maxStack: 99,
    sell: 4,
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

  flour: {
    label: "Farinha",
    icon: "🥣",
    type: "material",
    maxStack: 99,
    sell: 7,
  },


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

  ["rock_01", "rock", -9, 8],
  ["rock_02", "rock", -14, 2],
  ["rock_03", "rock", 7, 9],
  ["rock_04", "rock", 15, 5],
  ["rock_05", "rock", 11, -11],
  ["rock_06", "rock", -8, -11],
  ["rock_07", "rock", 19, -8],
  ["rock_08", "rock", -20, -14],

  ["bush_01", "bush", -6, 7],
  ["bush_02", "bush", -12, 5],
  ["bush_03", "bush", 5, 12],
  ["bush_04", "bush", 13, -4],
  ["bush_05", "bush", -15, -4],
  ["bush_06", "bush", 4, -15],

  ["ore_01", "ore", -22, 6],
  ["ore_02", "ore", -18, 18],
  ["ore_03", "ore", 21, 15],
  ["ore_04", "ore", 24, -12],
  ["ore_05", "ore", -14, -20],

];


export const FARM_LAYOUT = [

  ["farm_01", -15, 4],
  ["farm_02", -13, 4],
  ["farm_03", -11, 4],

  ["farm_04", -15, 7],
  ["farm_05", -13, 7],
  ["farm_06", -11, 7],

];


export const CROPS = {

  wheat_seed: {
    crop: "wheat",
    growTime: 18000,
    yield: 4,
    xp: 10,
  },

  carrot_seed: {
    crop: "carrot",
    growTime: 24000,
    yield: 3,
    xp: 14,
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

  lina:
    "Lina · Exploradora",

  hunter:
    "Kael · Caçador",

  blacksmith:
    "Borin · Ferreiro",

  fisherman:
    "Nilo · Pescador",

  farmer:
    "Mara · Agricultora",

  cook:
    "Cora · Cozinheira",

};


export const QUESTS = {

  slime_hunt: {

    npc: "lina",

    title:
      "Primeiros Passos",

    description:
      "Mostre a Lina que consegue se defender fora da vila.",

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

    rewardText:
      "20 XP · 6 ouro · 2 Maçãs",
  },


  gather_supplies: {

    npc: "lina",

    title:
      "Suprimentos da Vila",

    description:
      "Reúna materiais dos arbustos para ajudar os moradores.",

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

    rewardText:
      "25 XP · 10 ouro · 2 Bandagens",
  },


  wolf_hunt: {

    npc: "hunter",

    title:
      "Predadores do Bosque",

    description:
      "Kael quer reduzir os ataques de lobos perto da vila.",

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

    rewardText:
      "35 XP · 15 ouro · Capuz Incomum",
  },


  goblin_threat: {

    npc: "hunter",

    title:
      "A Ameaça Goblin",

    description:
      "Os goblins estão avançando em direção à vila.",

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

    rewardText:
      "45 XP · 25 ouro · Espada Rara",
  },


  iron_age: {

    npc: "blacksmith",

    title:
      "A Era do Ferro",

    description:
      "Borin precisa de minério e lingotes.",

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

    rewardText:
      "40 XP · 20 ouro · Colete Incomum",
  },


  master_forge: {

    npc: "blacksmith",

    title:
      "A Lâmina do Ferreiro",

    description:
      "Forje uma Espada de Ferro.",

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

    rewardText:
      "60 XP · 35 ouro · Espada Rara · Botas",
  },


  fisherman_intro: {

    npc:
      "fisherman",

    title:
      "Primeira Pescaria",

    description:
      "Nilo quer ver se você leva jeito para pescar.",

    requires:
      [],

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

    rewardText:
      "30 XP · 12 ouro · 2 Peixes Grelhados",
  },


  farmer_intro: {

    npc:
      "farmer",

    title:
      "Primeira Colheita",

    description:
      "Mara quer ensinar você a trabalhar com a terra.",

    requires:
      [],

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

    rewardText:
      "30 XP · 12 ouro · Sementes",
  },


  cook_intro: {

    npc:
      "cook",

    title:
      "Comida de Verdade",

    description:
      "Cora quer que você prepare sua primeira refeição.",

    requires:
      [],

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

    rewardText:
      "35 XP · 15 ouro · Ensopado de Peixe",
  },

};
