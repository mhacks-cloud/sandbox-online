// @ts-nocheck

/*
 * ============================================================
 * SANDBOX ONLINE — ETAPA 14
 * VIDA REGIONAL
 * ============================================================
 *
 * - relógio acelerado
 * - manhã / dia / tarde / noite
 * - rotinas dos NPCs
 * - horário dos mercados
 * - caravana itinerante
 * - localização visual dos eventos
 *
 * Tudo é calculado deterministicamente usando Date.now().
 * Não adicionamos nada ao Schema Colyseus.
 */


import {
  getRegionAt,
} from "./gameData";


import {
  REGIONAL_NPCS,
  OUTPOST_MARKET_SOURCE,
  regionalNpcPositionAt,
} from "./regionalWorld";


import {
  regionalEventAt,
} from "./regionalProgression";



/*
 * 1 dia do jogo = 24 minutos reais.
 *
 * 1 segundo real = 1 minuto no mundo.
 */

export const WORLD_DAY_MS =
  24 *
  60 *
  1000;


export function worldClockAt(
  nowMs =
    Date.now(),
) {

  const raw =
    (
      nowMs %
      WORLD_DAY_MS
      +
      WORLD_DAY_MS
    )
    %
    WORLD_DAY_MS;


  const minuteOfDay =
    Math.floor(
      raw /
      1000,
    );


  const hour =
    Math.floor(
      minuteOfDay /
      60,
    );


  const minute =
    minuteOfDay %
    60;


  let phase =
    "night";


  let phaseLabel =
    "Noite";


  let icon =
    "🌙";


  if (
    hour >=
    5
    &&
    hour <
    8
  ) {

    phase =
      "dawn";

    phaseLabel =
      "Amanhecer";

    icon =
      "🌅";
  }


  else if (
    hour >=
    8
    &&
    hour <
    18
  ) {

    phase =
      "day";

    phaseLabel =
      "Dia";

    icon =
      "☀️";
  }


  else if (
    hour >=
    18
    &&
    hour <
    21
  ) {

    phase =
      "evening";

    phaseLabel =
      "Entardecer";

    icon =
      "🌇";
  }


  else if (
    hour >=
    21
    &&
    hour <
    23
  ) {

    phase =
      "late";

    phaseLabel =
      "Noite";

    icon =
      "🌙";
  }


  return {

    hour,

    minute,

    minuteOfDay,

    phase,

    phaseLabel,

    icon,

    label:
      `${
        String(
          hour,
        ).padStart(
          2,
          "0",
        )
      }:${
        String(
          minute,
        ).padStart(
          2,
          "0",
        )
      }`,
  };
}



export const REGIONAL_NPC_SCHEDULES = {

  teo: {

    open:
      6,

    close:
      22,

    nightX:
      .8,

    nightZ:
      .5,
  },


  runa: {

    open:
      7,

    close:
      21,

    nightX:
      -.7,

    nightZ:
      .5,
  },


  sena: {

    open:
      5,

    close:
      23,

    nightX:
      .6,

    nightZ:
      -.5,
  },


  dario: {

    open:
      6,

    close:
      22,

    nightX:
      -.6,

    nightZ:
      -.5,
  },


  eira: {

    open:
      8,

    close:
      23,

    nightX:
      .6,

    nightZ:
      .45,
  },

};


export function regionalMarketOpenAt(
  source,
  nowMs =
    Date.now(),
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


  const schedule =
    REGIONAL_NPC_SCHEDULES[
      id
    ];


  if (
    !schedule
  ) {

    return true;
  }


  const clock =
    worldClockAt(
      nowMs,
    );


  return (
    clock.hour >=
    schedule.open
    &&
    clock.hour <
    schedule.close
  );
}


export function outpostServiceOpenAt(
  id,
  nowMs =
    Date.now(),
) {

  const marketNpc =
    OUTPOST_MARKET_SOURCE[
      id
    ];


  if (
    !marketNpc
  ) {

    return true;
  }


  return regionalMarketOpenAt(
    marketNpc,
    nowMs,
  );
}



export function regionalNpcLifeAt(
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


  const clock =
    worldClockAt(
      nowMs,
    );


  const schedule =
    REGIONAL_NPC_SCHEDULES[
      id
    ];


  const base =
    regionalNpcPositionAt(
      id,
      nowMs,
    )
    ||
    {
      x:
        npc.x,

      z:
        npc.z,

      moving:
        false,
    };


  const marketOpen =
    regionalMarketOpenAt(
      id,
      nowMs,
    );


  /*
   * Madrugada:
   * NPC permanece perto do posto,
   * mas em um ponto de descanso.
   */

  if (
    clock.hour <
    5
    ||
    clock.hour >=
    23
  ) {

    return {

      x:
        npc.x
        +
        (
          schedule?.nightX
          ||
          0
        ),

      z:
        npc.z
        +
        (
          schedule?.nightZ
          ||
          0
        ),

      moving:
        false,

      status:
        "descansando",

      marketOpen,

      clock,
    };
  }


  let status =
    "trabalhando";


  if (
    clock.hour <
    (
      schedule?.open
      ||
      6
    )
  ) {

    status =
      "preparando o posto";
  }


  else if (
    !marketOpen
  ) {

    status =
      "encerrando o expediente";
  }


  else if (
    clock.phase ===
    "evening"
  ) {

    status =
      "finalizando o dia";
  }


  else if (
    base.moving
  ) {

    status =
      "em atividade";
  }


  return {

    ...base,

    status,

    marketOpen,

    clock,
  };
}



/*
 * ============================================================
 * CARAVANA DO MIRO
 * ============================================================
 */

export const CARAVAN = {

  id:
    "miro_caravan",

  name:
    "Miro",

  role:
    "Mercador Itinerante",

  visualKind:
    "merchant",

  market: {

    eyebrow:
      "CARAVANA ITINERANTE",

    label:
      "Mercado do Miro",

    buy: {

      apple:
        6,

      bandage:
        11,

      rope:
        9,

      healing_tonic:
        30,

      wheat_seed:
        3,

      carrot_seed:
        4,
    },

    sell: {

      berry:
        2,

      river_fish:
        7,

      herb:
        8,

      copper_ore:
        9,

      silver_ore:
        16,
    },
  },
};


const CARAVAN_ROUTE = [

  {
    x:
      5,

    z:
      5,
  },

  {
    x:
      4,

    z:
      -7,
  },

  {
    x:
      4,

    z:
      -18,
  },

  {
    x:
      6,

    z:
      -29,
  },

  {
    x:
      4,

    z:
      -18,
  },

  {
    x:
      4,

    z:
      -7,
  },

  {
    x:
      5,

    z:
      5,
  },

];


export function caravanPositionAt(
  nowMs =
    Date.now(),
) {

  const clock =
    worldClockAt(
      nowMs,
    );


  /*
   * À noite a caravana estaciona na Vila.
   */

  if (
    clock.hour <
    6
    ||
    clock.hour >=
    22
  ) {

    return {

      x:
        CARAVAN_ROUTE[
          0
        ].x,

      z:
        CARAVAN_ROUTE[
          0
        ].z,

      moving:
        false,

      marketOpen:
        false,

      status:
        "acampada na Vila",

      region:
        "village",

      clock,
    };
  }


  const startMinute =
    6 *
    60;


  const endMinute =
    22 *
    60;


  const daytime =
    clock.minuteOfDay
    -
    startMinute;


  const duration =
    endMinute
    -
    startMinute;


  const normalized =
    Math.max(
      0,

      Math.min(
        .999999,

        daytime /
        duration,
      ),
    );


  const segmentFloat =
    normalized *
    (
      CARAVAN_ROUTE.length
      -
      1
    );


  const segment =
    Math.min(
      CARAVAN_ROUTE.length
      -
      2,

      Math.floor(
        segmentFloat,
      ),
    );


  const local =
    segmentFloat
    -
    segment;


  const a =
    CARAVAN_ROUTE[
      segment
    ];


  const b =
    CARAVAN_ROUTE[
      segment +
      1
    ];


  const x =
    a.x
    +
    (
      b.x -
      a.x
    )
    *
    local;


  const z =
    a.z
    +
    (
      b.z -
      a.z
    )
    *
    local;


  return {

    x,

    z,

    moving:
      true,

    marketOpen:
      true,

    status:
      segment <
      3
        ? "seguindo para o Prado"
        : "retornando para a Vila",

    region:
      getRegionAt(
        x,
        z,
      ),

    clock,
  };
}


export function caravanMarketForSource(
  source,
) {

  if (
    String(
      source
      ||
      "",
    )
    !==
    CARAVAN.id
  ) {

    return null;
  }


  return {

    id:
      CARAVAN.id,

    ...CARAVAN.market,
  };
}



/*
 * ============================================================
 * MARCADORES VISUAIS DOS EVENTOS
 * ============================================================
 */

export const EVENT_WORLD_ANCHORS = {

  sunmeadow: {

    x:
      -6,

    z:
      -37,
  },


  ancient_forest: {

    x:
      -38,

    z:
      -27,
  },


  mist_marsh: {

    x:
      -31,

    z:
      38,
  },


  copper_highlands: {

    x:
      38,

    z:
      35,
  },


  silver_frontier: {

    x:
      40,

    z:
      -39,
  },

};


export function eventWorldStateAt(
  nowMs =
    Date.now(),
) {

  const event =
    regionalEventAt(
      nowMs,
    );


  const anchor =
    EVENT_WORLD_ANCHORS[
      event.region
    ];


  if (
    !anchor
  ) {

    return null;
  }


  return {

    ...event,

    x:
      anchor.x,

    z:
      anchor.z,
  };
}
