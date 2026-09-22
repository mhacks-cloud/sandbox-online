// @ts-nocheck

/*
 * ============================================================
 * SANDBOX ONLINE — ETAPA 12
 * MUNDO REGIONAL
 * ============================================================
 *
 * Este arquivo centraliza:
 *
 * - NPCs regionais
 * - diálogos
 * - rotina visual
 * - posição determinística
 * - comércio regional
 *
 * Nenhum desses dados entra no Schema do Player.
 */


export const REGIONAL_NPCS = {

  teo: {

    name:
      "Téo",

    role:
      "Mensageiro do Prado",

    region:
      "sunmeadow",

    x:
      7,

    z:
      -30,

    visualKind:
      "farmer",

    text:
      "Levo recados entre a Vila do Vale e os viajantes do Prado. Os campos parecem tranquilos, mas quem sai muito da estrada encontra problemas.",

    tip:
      "O Posto do Prado é um bom ponto de apoio antes de explorar o sul.",
  },


  runa: {

    name:
      "Runa",

    role:
      "Lenhadora do Bosque",

    region:
      "ancient_forest",

    x:
      -31,

    z:
      -8,

    visualKind:
      "hunter",

    text:
      "O Bosque Antigo tem madeira muito melhor que a encontrada perto da vila, mas as árvores mais velhas exigem boas ferramentas.",

    tip:
      "Madeira Nobre vale mais aqui. Não avance sem ferramentas adequadas.",
  },


  sena: {

    name:
      "Sena",

    role:
      "Herbalista da Névoa",

    region:
      "mist_marsh",

    x:
      -21,

    z:
      30,

    visualKind:
      "lina",

    text:
      "A névoa muda rápido por aqui. Quem segue apenas os olhos acaba entrando fundo demais no pântano.",

    tip:
      "Ervas medicinais encontradas no pântano têm ótimo valor para mim.",
  },


  dario: {

    name:
      "Dario",

    role:
      "Mineiro das Colinas",

    region:
      "copper_highlands",

    x:
      31,

    z:
      23,

    visualKind:
      "blacksmith",

    text:
      "Ainda existem bons veios de cobre nestas colinas. O problema é que todo mundo que sabe disso quer uma parte.",

    tip:
      "Traga cobre e ferro. Posso pagar melhor por minérios daqui.",
  },


  eira: {

    name:
      "Eira",

    role:
      "Sentinela da Fronteira",

    region:
      "silver_frontier",

    x:
      31,

    z:
      -28,

    visualKind:
      "fisherman",

    text:
      "Daqui para frente as estradas ficam silenciosas. Os espectros não fazem barulho até já estarem perto demais.",

    tip:
      "Prata é valiosa na fronteira. Equipamentos melhores também podem ser encontrados comigo.",
  },

};


/*
 * ============================================================
 * ROTINAS
 * ============================================================
 *
 * Não usamos broadcast contínuo.
 *
 * Servidor e cliente calculam a posição usando o relógio.
 * Isso evita adicionar NPCs ao Schema e evita tráfego contínuo.
 *
 * Ciclo:
 *
 * 0–20%   parado na origem
 * 20–40%  caminhada
 * 40–65%  parado no segundo ponto
 * 65–85%  caminhada de volta
 * 85–100% parado na origem
 */

export const REGIONAL_NPC_ROUTINES = {

  teo: {

    offsetX:
      .7,

    offsetZ:
      .3,

    phaseMs:
      0,

    periodMs:
      12000,
  },


  runa: {

    offsetX:
      -.6,

    offsetZ:
      .35,

    phaseMs:
      2100,

    periodMs:
      13000,
  },


  sena: {

    offsetX:
      .45,

    offsetZ:
      -.6,

    phaseMs:
      4200,

    periodMs:
      12500,
  },


  dario: {

    offsetX:
      -.65,

    offsetZ:
      -.25,

    phaseMs:
      6100,

    periodMs:
      13500,
  },


  eira: {

    offsetX:
      .55,

    offsetZ:
      .4,

    phaseMs:
      7800,

    periodMs:
      11000,
  },

};


function smoothStep(
  value,
) {

  const t =
    Math.max(
      0,

      Math.min(
        1,
        value,
      ),
    );


  return (
    t *
    t *
    (
      3
      -
      2 *
      t
    )
  );
}


export function regionalNpcPositionAt(
  id,
  nowMs =
    Date.now(),
) {

  const npc =
    REGIONAL_NPCS[
      id
    ];


  if (
    !npc
  ) {

    return null;
  }


  const routine =
    REGIONAL_NPC_ROUTINES[
      id
    ];


  if (
    !routine
  ) {

    return {

      x:
        npc.x,

      z:
        npc.z,

      moving:
        false,
    };
  }


  const period =
    Math.max(
      1000,

      routine.periodMs,
    );


  const raw =
    (
      nowMs
      +
      routine.phaseMs
    )
    %
    period;


  const cycle =
    (
      raw <
      0
        ? raw
        +
        period
        : raw
    )
    /
    period;


  let progress =
    0;


  let moving =
    false;


  if (
    cycle <
    .20
  ) {

    progress =
      0;
  }

  else if (
    cycle <
    .40
  ) {

    progress =
      smoothStep(
        (
          cycle -
          .20
        )
        /
        .20,
      );


    moving =
      true;
  }

  else if (
    cycle <
    .65
  ) {

    progress =
      1;
  }

  else if (
    cycle <
    .85
  ) {

    progress =
      1
      -
      smoothStep(
        (
          cycle -
          .65
        )
        /
        .20,
      );


    moving =
      true;
  }

  else {

    progress =
      0;
  }


  return {

    x:
      npc.x
      +
      routine.offsetX *
      progress,

    z:
      npc.z
      +
      routine.offsetZ *
      progress,

    moving,
  };
}


/*
 * ============================================================
 * ECONOMIA REGIONAL
 * ============================================================
 *
 * buy:
 * preço pago pelo jogador.
 *
 * sell:
 * preço recebido pelo jogador.
 */


export const REGIONAL_MARKETS = {

  teo: {

    eyebrow:
      "PRADO DO SUL",

    label:
      "Banca do Téo",

    buy: {

      apple:
        5,

      bandage:
        10,

      wheat_seed:
        2,

      carrot_seed:
        3,

      tomato_seed:
        6,
    },

    sell: {

      wheat:
        5,

      carrot:
        6,

      tomato:
        12,

      pumpkin:
        20,

      river_fish:
        7,

      bass:
        14,
    },
  },


  runa: {

    eyebrow:
      "BOSQUE ANTIGO",

    label:
      "Trocas da Runa",

    buy: {

      bandage:
        12,

      rope:
        8,

      apple:
        6,
    },

    sell: {

      wood:
        3,

      hardwood:
        8,

      plank:
        5,

      hardwood_plank:
        12,

      fiber:
        3,
    },
  },


  sena: {

    eyebrow:
      "PÂNTANO DA NÉVOA",

    label:
      "Botica da Sena",

    buy: {

      bandage:
        9,

      healing_tonic:
        28,

      apple:
        6,
    },

    sell: {

      herb:
        9,

      fiber:
        3,

      berry:
        2,

      river_fish:
        7,
    },
  },


  dario: {

    eyebrow:
      "COLINAS DE COBRE",

    label:
      "Entreposto do Dario",

    buy: {

      bandage:
        12,

      copper_axe:
        90,

      copper_pickaxe:
        90,

      copper_sword:
        120,
    },

    sell: {

      iron_ore:
        5,

      iron_ingot:
        12,

      copper_ore:
        10,

      copper_ingot:
        22,

      stone:
        4,
    },
  },


  eira: {

    eyebrow:
      "FRONTEIRA PRATEADA",

    label:
      "Suprimentos da Eira",

    buy: {

      healing_tonic:
        24,

      silver_axe:
        160,

      silver_pickaxe:
        160,

      silver_rod:
        160,

      silver_sword:
        220,
    },

    sell: {

      silver_ore:
        18,

      silver_ingot:
        35,

      golden_carp:
        55,

      copper_ingot:
        20,
    },
  },

};


/*
 * O comércio físico do Posto do Prado usa
 * a mesma tabela econômica do Téo.
 */

export const OUTPOST_MARKET_SOURCE = {

  sunmeadow_outpost:
    "teo",

};


export function regionalMarketForSource(
  source,
) {

  const raw =
    String(
      source
      ||
      "",
    );


  const id =
    OUTPOST_MARKET_SOURCE[
      raw
    ]
    ||
    raw;


  const market =
    REGIONAL_MARKETS[
      id
    ];


  if (
    !market
  ) {

    return null;
  }


  return {

    id,

    ...market,
  };
}
