// @ts-nocheck

/*
 * ============================================================
 * SANDBOX ONLINE — ETAPA 13
 * PROGRESSÃO REGIONAL
 * ============================================================
 *
 * Sistemas:
 *
 * - reputação regional
 * - contratos diários
 * - eventos mundiais regionais
 * - benefícios econômicos por reputação
 *
 * Nenhum destes dados entra no Schema Colyseus.
 */


export const REPUTATION_REGIONS = [

  "sunmeadow",
  "ancient_forest",
  "mist_marsh",
  "copper_highlands",
  "silver_frontier",

];


export const REGION_BOARD_NPC = {

  sunmeadow:
    "teo",

  ancient_forest:
    "runa",

  mist_marsh:
    "sena",

  copper_highlands:
    "dario",

  silver_frontier:
    "eira",

};


export const REPUTATION_TIERS = [

  {
    id: "unknown",
    label: "Desconhecido",
    min: 0,
    buyDiscount: 0,
    sellBonus: 0,
  },

  {
    id: "known",
    label: "Conhecido",
    min: 25,
    buyDiscount: .03,
    sellBonus: .05,
  },

  {
    id: "ally",
    label: "Aliado",
    min: 75,
    buyDiscount: .07,
    sellBonus: .10,
  },

  {
    id: "honored",
    label: "Honrado",
    min: 150,
    buyDiscount: .12,
    sellBonus: .15,
  },

];


export function reputationTier(
  points,
) {

  const value =
    Math.max(
      0,
      Number(points) || 0,
    );


  let result =
    REPUTATION_TIERS[0];


  for (
    const tier
    of REPUTATION_TIERS
  ) {

    if (
      value >=
      tier.min
    ) {

      result =
        tier;
    }
  }


  return result;
}


export function regionalPrice(
  basePrice,
  reputation,
  mode =
    "buy",
) {

  const base =
    Math.max(
      0,
      Number(basePrice) || 0,
    );


  if (
    base <=
    0
  ) {

    return 0;
  }


  const tier =
    reputationTier(
      reputation,
    );


  const factor =
    mode ===
    "sell"
      ? 1 + tier.sellBonus
      : 1 - tier.buyDiscount;


  return Math.max(
    1,

    Math.round(
      base *
      factor,
    ),
  );
}


/*
 * ============================================================
 * CONTRATOS
 * ============================================================
 */

export const REGIONAL_CONTRACTS = {

  sunmeadow: [

    {
      id: "sun_slime_control",
      region: "sunmeadow",
      title: "Controle de Slimes",
      description: "Reduza a população de slimes no Prado do Sul.",
      type: "kill",
      target: "slime",
      amount: 5,

      reward: {
        gold: 40,
        xp: 30,
        reputation: 15,
      },
    },

    {
      id: "sun_harvest",
      region: "sunmeadow",
      title: "Colheita para o Posto",
      description: "Ajude no abastecimento do Prado colhendo plantações.",
      type: "harvest",
      target: "any_crop",
      amount: 5,

      reward: {
        gold: 42,
        xp: 28,
        reputation: 14,
      },
    },

    {
      id: "sun_fishing",
      region: "sunmeadow",
      title: "Peixe Fresco",
      description: "Pesque peixes para os viajantes do Prado.",
      type: "fish",
      target: "river_fish",
      amount: 3,

      reward: {
        gold: 38,
        xp: 26,
        reputation: 13,
      },
    },

    {
      id: "sun_fiber",
      region: "sunmeadow",
      title: "Fibras para Reparos",
      description: "Colete fibras para manutenção do posto.",
      type: "collect",
      target: "fiber",
      amount: 8,

      reward: {
        gold: 34,
        xp: 24,
        reputation: 12,
      },
    },

  ],


  ancient_forest: [

    {
      id: "forest_wolves",
      region: "ancient_forest",
      title: "Lobos na Trilha",
      description: "Afaste os lobos das rotas do Bosque Antigo.",
      type: "kill",
      target: "wolf",
      amount: 4,

      reward: {
        gold: 58,
        xp: 45,
        reputation: 16,
      },
    },

    {
      id: "forest_boars",
      region: "ancient_forest",
      title: "Investida dos Javalis",
      description: "Controle os javalis próximos às rotas de madeira.",
      type: "kill",
      target: "boar",
      amount: 3,

      reward: {
        gold: 66,
        xp: 50,
        reputation: 18,
      },
    },

    {
      id: "forest_hardwood",
      region: "ancient_forest",
      title: "Madeira Nobre",
      description: "Colete Madeira Nobre para o Refúgio.",
      type: "collect",
      target: "hardwood",
      amount: 6,

      reward: {
        gold: 70,
        xp: 48,
        reputation: 18,
      },
    },

    {
      id: "forest_wood",
      region: "ancient_forest",
      title: "Reforço das Estruturas",
      description: "Colete madeira para manutenção do posto.",
      type: "collect",
      target: "wood",
      amount: 12,

      reward: {
        gold: 52,
        xp: 38,
        reputation: 14,
      },
    },

  ],


  mist_marsh: [

    {
      id: "marsh_spiders",
      region: "mist_marsh",
      title: "Infestação na Névoa",
      description: "Elimine Aranhas do Pântano próximas ao abrigo.",
      type: "kill",
      target: "swamp_spider",
      amount: 4,

      reward: {
        gold: 78,
        xp: 58,
        reputation: 18,
      },
    },

    {
      id: "marsh_herbs",
      region: "mist_marsh",
      title: "Ervas Medicinais",
      description: "Colete ervas para a Botica da Sena.",
      type: "collect",
      target: "herb",
      amount: 6,

      reward: {
        gold: 72,
        xp: 52,
        reputation: 17,
      },
    },

    {
      id: "marsh_fiber",
      region: "mist_marsh",
      title: "Cordas para o Abrigo",
      description: "Colete fibras resistentes na região.",
      type: "collect",
      target: "fiber",
      amount: 10,

      reward: {
        gold: 60,
        xp: 45,
        reputation: 14,
      },
    },

    {
      id: "marsh_fish",
      region: "mist_marsh",
      title: "Pesca na Névoa",
      description: "Traga robalos encontrados durante suas pescarias.",
      type: "fish",
      target: "bass",
      amount: 3,

      reward: {
        gold: 75,
        xp: 52,
        reputation: 17,
      },
    },

  ],


  copper_highlands: [

    {
      id: "copper_goblins",
      region: "copper_highlands",
      title: "Goblins nas Minas",
      description: "Limpe os caminhos ocupados pelos goblins.",
      type: "kill",
      target: "goblin",
      amount: 5,

      reward: {
        gold: 95,
        xp: 72,
        reputation: 18,
      },
    },

    {
      id: "copper_bandits",
      region: "copper_highlands",
      title: "Saqueadores das Colinas",
      description: "Derrote saqueadores que atacam os mineradores.",
      type: "kill",
      target: "bandit",
      amount: 3,

      reward: {
        gold: 120,
        xp: 85,
        reputation: 22,
      },
    },

    {
      id: "copper_ore",
      region: "copper_highlands",
      title: "Carga de Cobre",
      description: "Colete minério de cobre nas colinas.",
      type: "collect",
      target: "copper_ore",
      amount: 8,

      reward: {
        gold: 105,
        xp: 68,
        reputation: 19,
      },
    },

    {
      id: "copper_iron",
      region: "copper_highlands",
      title: "Reservas de Ferro",
      description: "Reforce o estoque mineral do entreposto.",
      type: "collect",
      target: "iron_ore",
      amount: 10,

      reward: {
        gold: 88,
        xp: 62,
        reputation: 16,
      },
    },

  ],


  silver_frontier: [

    {
      id: "silver_wraiths",
      region: "silver_frontier",
      title: "Espectros na Fronteira",
      description: "Derrote espectros que rondam as rotas prateadas.",
      type: "kill",
      target: "wraith",
      amount: 4,

      reward: {
        gold: 165,
        xp: 120,
        reputation: 24,
      },
    },

    {
      id: "silver_ore",
      region: "silver_frontier",
      title: "Prata da Fronteira",
      description: "Colete minério de prata para os suprimentos locais.",
      type: "collect",
      target: "silver_ore",
      amount: 8,

      reward: {
        gold: 155,
        xp: 105,
        reputation: 22,
      },
    },

    {
      id: "silver_trout",
      region: "silver_frontier",
      title: "Trutas do Norte",
      description: "Traga trutas das águas da fronteira.",
      type: "fish",
      target: "trout",
      amount: 3,

      reward: {
        gold: 145,
        xp: 95,
        reputation: 20,
      },
    },

    {
      id: "silver_carp",
      region: "silver_frontier",
      title: "Carpa Dourada",
      description: "Encontre uma rara Carpa Dourada.",
      type: "fish",
      target: "golden_carp",
      amount: 1,

      reward: {
        gold: 210,
        xp: 130,
        reputation: 26,
      },
    },

  ],

};


export const REGIONAL_CONTRACT_BY_ID =
  Object.fromEntries(

    Object
      .values(
        REGIONAL_CONTRACTS,
      )
      .flat()
      .map(
        contract => [
          contract.id,
          contract,
        ],
      ),
  );


function hashString(
  value,
) {

  let result =
    0;


  for (
    let i = 0;
    i < value.length;
    i++
  ) {

    result =
      (
        result *
        31
        +
        value.charCodeAt(
          i,
        )
      )
      >>>
      0;
  }


  return result;
}


export function contractDayKey(
  nowMs =
    Date.now(),
) {

  return new Date(
    nowMs,
  )
    .toISOString()
    .slice(
      0,
      10,
    );
}


export function contractsForRegion(
  region,
  nowMs =
    Date.now(),
) {

  const list =
    REGIONAL_CONTRACTS[
      region
    ]
    ||
    [];


  if (
    list.length <=
    3
  ) {

    return [
      ...list,
    ];
  }


  const seed =
    hashString(
      `${contractDayKey(nowMs)}:${region}`,
    );


  const start =
    seed %
    list.length;


  return [

    list[start],

    list[
      (
        start +
        1
      )
      %
      list.length
    ],

    list[
      (
        start +
        2
      )
      %
      list.length
    ],

  ];
}


/*
 * ============================================================
 * EVENTOS REGIONAIS
 * ============================================================
 */

export const REGIONAL_EVENTS = [

  {
    region: "sunmeadow",
    title: "Surto de Slimes",
    description: "Uma concentração incomum de slimes ameaça o Prado.",
    target: "slime",
    amount: 8,

    reward: {
      gold: 95,
      xp: 70,
      reputation: 25,
    },
  },

  {
    region: "ancient_forest",
    title: "Investida dos Javalis",
    description: "Javalis estão bloqueando as trilhas do Bosque.",
    target: "boar",
    amount: 6,

    reward: {
      gold: 130,
      xp: 95,
      reputation: 28,
    },
  },

  {
    region: "mist_marsh",
    title: "Infestação do Pântano",
    description: "Aranhas estão avançando sobre o Abrigo da Névoa.",
    target: "swamp_spider",
    amount: 6,

    reward: {
      gold: 150,
      xp: 110,
      reputation: 30,
    },
  },

  {
    region: "copper_highlands",
    title: "Ataque dos Saqueadores",
    description: "Saqueadores estão atacando as rotas das Colinas.",
    target: "bandit",
    amount: 5,

    reward: {
      gold: 210,
      xp: 145,
      reputation: 34,
    },
  },

  {
    region: "silver_frontier",
    title: "Noite dos Espectros",
    description: "Uma onda de espectros tomou a Fronteira Prateada.",
    target: "wraith",
    amount: 5,

    reward: {
      gold: 300,
      xp: 210,
      reputation: 40,
    },
  },

];


export function regionalEventAt(
  nowMs =
    Date.now(),
) {

  const duration =
    15 *
    60 *
    1000;


  const slot =
    Math.floor(
      nowMs /
      duration,
    );


  const definition =
    REGIONAL_EVENTS[
      slot %
      REGIONAL_EVENTS.length
    ];


  const startedAt =
    slot *
    duration;


  return {

    ...definition,

    key:
      `regional-event-${slot}`,

    startedAt,

    endsAt:
      startedAt
      +
      duration,
  };
}


export function emptyRegionalProgress(
  nowMs =
    Date.now(),
) {

  const reputation =
    {};


  for (
    const region
    of REPUTATION_REGIONS
  ) {

    reputation[
      region
    ] =
      0;
  }


  const event =
    regionalEventAt(
      nowMs,
    );


  return {

    reputation,

    contracts:
      {},

    completedDays:
      {},

    event: {

      key:
        event.key,

      progress:
        0,

      claimed:
        false,
    },
  };
}


export function normalizeRegionalProgress(
  raw,
  nowMs =
    Date.now(),
) {

  const result =
    emptyRegionalProgress(
      nowMs,
    );


  const source =
    (
      raw
      &&
      typeof raw ===
        "object"
      &&
      !Array.isArray(
        raw,
      )
    )
      ? raw
      : {};


  for (
    const region
    of REPUTATION_REGIONS
  ) {

    result.reputation[
      region
    ] =
      Math.max(
        0,

        Math.floor(
          Number(
            source
              .reputation?.[
                region
              ],
          )
          ||
          0,
        ),
      );
  }


  const today =
    contractDayKey(
      nowMs,
    );


  for (
    const [
      id,
      value,
    ]
    of Object.entries(
      source.contracts
      ||
      {},
    )
  ) {

    const contract =
      REGIONAL_CONTRACT_BY_ID[
        id
      ];


    if (
      !contract
      ||
      value?.dayKey !==
      today
    ) {

      continue;
    }


    const progress =
      Math.max(
        0,

        Math.min(
          contract.amount,

          Math.floor(
            Number(
              value?.progress,
            )
            ||
            0,
          ),
        ),
      );


    result.contracts[
      id
    ] = {

      dayKey:
        today,

      progress,

      status:
        progress >=
        contract.amount
          ? "ready"
          : "active",
    };
  }


  for (
    const [
      id,
      value,
    ]
    of Object.entries(
      source.completedDays
      ||
      {},
    )
  ) {

    if (
      REGIONAL_CONTRACT_BY_ID[
        id
      ]
      &&
      value ===
      today
    ) {

      result.completedDays[
        id
      ] =
        today;
    }
  }


  const event =
    regionalEventAt(
      nowMs,
    );


  if (
    source.event?.key ===
    event.key
  ) {

    result.event = {

      key:
        event.key,

      progress:
        Math.max(
          0,

          Math.min(
            event.amount,

            Math.floor(
              Number(
                source.event.progress,
              )
              ||
              0,
            ),
          ),
        ),

      claimed:
        Boolean(
          source.event.claimed,
        ),
    };
  }


  return result;
}
