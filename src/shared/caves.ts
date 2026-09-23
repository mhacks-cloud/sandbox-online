// @ts-nocheck

/*
 * ============================================================
 * SANDBOX ONLINE — ETAPA 15
 * SISTEMA DE CAVERNAS
 * ============================================================
 *
 * Cavernas ficam em coordenadas isoladas do mapa principal.
 *
 * Isso permite:
 *
 * - multiplayer dentro da mesma caverna
 * - recursos normais do Schema
 * - inimigos normais do Schema
 * - drops normais
 * - combate normal
 *
 * Sem criar uma nova Room e sem modificar o Schema.
 */


export const CAVE_ORDER = [

  "copper_depths",

  "silver_grotto",

];


export const CAVES = {

  copper_depths: {

    id:
      "copper_depths",

    label:
      "Mina Profunda de Cobre",

    subtitle:
      "Galerias abandonadas abaixo das Colinas de Cobre.",

    recommendedLevel:
      5,

    minLevel:
      1,

    region:
      "copper_highlands",

    entrance: {

      x:
        46,

      z:
        18,

      radius:
        3,
    },

    returnPoint: {

      x:
        42.8,

      z:
        18,
    },

    interior: {

      centerX:
        118,

      centerZ:
        118,

      bounds: {

        minX:
          104,

        maxX:
          132,

        minZ:
          104,

        maxZ:
          132,
      },

      spawn: {

        x:
          111,

        z:
          128,
      },

      exit: {

        x:
          111,

        z:
          130,

        radius:
          2.3,
      },
    },

    chest: {

      x:
        126,

      z:
        109,

      radius:
        2,

      cooldownMs:
        5 *
        60 *
        1000,

      xp:
        28,

      gold: {

        min:
          30,

        max:
          55,
      },

      loot: [

        {
          id:
            "copper_ore",

          min:
            2,

          max:
            5,
        },

        {
          id:
            "iron_ore",

          min:
            2,

          max:
            4,
        },

        {
          id:
            "bandage",

          min:
            1,

          max:
            2,
        },

      ],
    },
  },


  silver_grotto: {

    id:
      "silver_grotto",

    label:
      "Gruta Prateada",

    subtitle:
      "Uma fenda gelada tomada por minério e energia espectral.",

    recommendedLevel:
      9,

    minLevel:
      6,

    region:
      "silver_frontier",

    entrance: {

      x:
        47,

      z:
        -42,

      radius:
        3,
    },

    returnPoint: {

      x:
        43.5,

      z:
        -41,
    },

    interior: {

      centerX:
        178,

      centerZ:
        118,

      bounds: {

        minX:
          164,

        maxX:
          192,

        minZ:
          104,

        maxZ:
          132,
      },

      spawn: {

        x:
          171,

        z:
          128,
      },

      exit: {

        x:
          171,

        z:
          130,

        radius:
          2.3,
      },
    },

    chest: {

      x:
        187,

      z:
        109,

      radius:
        2,

      cooldownMs:
        5 *
        60 *
        1000,

      xp:
        55,

      gold: {

        min:
          70,

        max:
          115,
      },

      loot: [

        {
          id:
            "silver_ore",

          min:
            2,

          max:
            5,
        },

        {
          id:
            "copper_ingot",

          min:
            1,

          max:
            3,
        },

        {
          id:
            "healing_tonic",

          min:
            1,

          max:
            2,
        },

      ],
    },
  },

};



/*
 * ============================================================
 * RECURSOS SUBTERRÂNEOS
 * ============================================================
 *
 * Reutilizamos recursos já existentes.
 * Portanto não alteramos RESOURCE_TYPES.
 */

export const CAVE_RESOURCE_LAYOUT = [

  /*
   * MINA DE COBRE
   */

  [
    "cave_copper_rock_01",
    "rock",
    108,
    119,
  ],

  [
    "cave_copper_iron_01",
    "ore",
    114,
    113,
  ],

  [
    "cave_copper_ore_01",
    "copper_ore",
    121,
    115,
  ],

  [
    "cave_copper_ore_02",
    "copper_ore",
    126,
    121,
  ],

  [
    "cave_copper_ore_03",
    "copper_ore",
    117,
    108,
  ],

  [
    "cave_copper_rock_02",
    "rock",
    129,
    115,
  ],


  /*
   * GRUTA PRATEADA
   */

  [
    "cave_silver_rock_01",
    "rock",
    168,
    119,
  ],

  [
    "cave_silver_copper_01",
    "copper_ore",
    174,
    112,
  ],

  [
    "cave_silver_ore_01",
    "silver_ore",
    181,
    115,
  ],

  [
    "cave_silver_ore_02",
    "silver_ore",
    187,
    121,
  ],

  [
    "cave_silver_ore_03",
    "silver_ore",
    177,
    108,
  ],

  [
    "cave_silver_rock_02",
    "rock",
    190,
    116,
  ],

];



/*
 * ============================================================
 * INIMIGOS SUBTERRÂNEOS
 * ============================================================
 *
 * Também reutilizam inimigos já existentes.
 */

export const CAVE_ENEMY_LAYOUT = [

  /*
   * MINA DE COBRE
   */

  [
    "cave_copper_goblin_01",
    "goblin",
    113,
    119,
  ],

  [
    "cave_copper_goblin_02",
    "goblin",
    123,
    124,
  ],

  [
    "cave_copper_bandit_01",
    "bandit",
    124,
    111,
  ],


  /*
   * GRUTA PRATEADA
   */

  [
    "cave_silver_wraith_01",
    "wraith",
    172,
    118,
  ],

  [
    "cave_silver_wraith_02",
    "wraith",
    184,
    124,
  ],

  [
    "cave_silver_wraith_03",
    "wraith",
    186,
    112,
  ],

];



export function nearestCaveEntrance(
  x,
  z,
  radius =
    3,
) {

  let result =
    null;


  for (
    const id
    of CAVE_ORDER
  ) {

    const cave =
      CAVES[
        id
      ];


    const distance =
      Math.hypot(
        cave.entrance.x -
        x,

        cave.entrance.z -
        z,
      );


    if (
      distance <=
      Math.max(
        radius,
        cave.entrance.radius
        ||
        0,
      )
      &&
      (
        !result
        ||
        distance <
        result.distance
      )
    ) {

      result = {

        id,

        cave,

        distance,
      };
    }
  }


  return result;
}
