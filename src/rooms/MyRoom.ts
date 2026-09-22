// @ts-nocheck

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";

import {
  join,
} from "node:path";

import {
  Room,
} from "colyseus";

import {
  MyRoomState,
  Player,
  ResourceNode,
  WorldDrop,
  Enemy,
  FarmPlot,
} from "./schema/MyRoomState";

import {
  INVENTORY_SIZE,
  CHEST_SIZE,
  HOTBAR_SIZE,
  EQUIPMENT_SLOTS,
  PROFESSION_IDS,
  WORLD_BOUNDS,
  REGIONS,
  getRegionAt,
  LANDMARK_ORDER,
  LANDMARKS,
  LOCATIONS,
  RARITIES,
  TOOL_TIERS,
  RESOURCE_TYPES,
  FISHING_SPOTS,
  ITEM_CATALOG,
  WORKBENCH_RECIPES,
  FURNACE_RECIPES,
  MILL_RECIPES,
  KITCHEN_RECIPES,
  RESOURCE_LAYOUT,
  FARM_LAYOUT,
  CROPS,
  ENEMY_TYPES,
  ENEMY_LAYOUT,
  QUESTS,
} from "../shared/gameData";

import {
  REGIONAL_NPCS,
  OUTPOST_MARKET_SOURCE,
  regionalNpcPositionAt,
  regionalMarketForSource,
} from "../shared/regionalWorld";

import {
  REGION_BOARD_NPC,
  REGIONAL_CONTRACT_BY_ID,
  contractDayKey,
  contractsForRegion,
  normalizeRegionalProgress,
  regionalEventAt,
  regionalPrice,
} from "../shared/regionalProgression";

import {
  loadWorldSave,
  saveWorldSave,
  snapshotFarmPlots,
} from "./worldPersistence";


const DATA_DIR =
  join(
    process.cwd(),
    "data",
  );


const SAVE_FILE =
  join(
    DATA_DIR,
    "players.json",
  );


const EMPTY_INPUT = {
  moveX: 0,
  moveZ: 0,
  screenX: 0,
  screenY: 0,
};



/*
 * ETAPA 11.3D SERVICES
 */

const OUTPOST_SERVICES = {

  sunmeadow_outpost: {
    type: "shop",
    label: "Comércio do Prado",
  },

  forest_outpost: {
    type: "chest",
    label: "Baú do Refúgio",
  },

  marsh_outpost: {
    type: "chest",
    label: "Baú do Abrigo",
  },

  copper_outpost: {
    type: "workbench",
    label: "Bancada das Colinas",
  },

  silver_outpost: {
    type: "furnace",
    label: "Forno da Fronteira",
  },

};



function normalizeRarity(
  value,
) {

  const rarity =
    String(
      value
      ||
      "common",
    );


  return RARITIES[
    rarity
  ]
    ? rarity
    : "common";
}


function emptySlots(
  amount,
) {

  return Array.from(
    {
      length:
        amount,
    },

    () =>
      null,
  );
}


function emptyEquipment() {

  return {
    weapon: null,
    offhand: null,
    helmet: null,
    body: null,
    boots: null,
  };
}


function emptyProfessions() {

  const result = {};


  for (
    const id
    of PROFESSION_IDS
  ) {

    result[
      id
    ] = {
      level: 1,
      xp: 0,
    };
  }


  return result;
}


function parseArray(
  value,
) {

  try {

    const parsed =
      JSON.parse(
        String(
          value
          ||
          "[]",
        ),
      );


    return Array.isArray(
      parsed,
    )
      ? parsed
      : [];
  }
  catch {

    return [];
  }
}


function parseObject(
  value,
) {

  try {

    const parsed =
      JSON.parse(
        String(
          value
          ||
          "{}",
        ),
      );


    return (
      parsed
      &&
      typeof parsed ===
        "object"
      &&
      !Array.isArray(
        parsed,
      )
    )
      ? parsed
      : {};
  }
  catch {

    return {};
  }
}


function sanitizeStack(
  value,
) {

  if (
    !value
    ||
    typeof value !==
      "object"
  ) {

    return null;
  }


  const id =
    String(
      value.id
      ||
      "",
    );


  const definition =
    ITEM_CATALOG[
      id
    ];


  if (
    !definition
  ) {

    return null;
  }


  return {

    id,

    qty:
      Math.max(
        1,

        Math.min(
          definition.maxStack,

          Math.floor(
            Number(
              value.qty,
            )
            ||
            1,
          ),
        ),
      ),

    rarity:
      normalizeRarity(
        value.rarity,
      ),
  };
}


function sanitizeSlots(
  slots,
  size,
) {

  const result =
    emptySlots(
      size,
    );


  if (
    !Array.isArray(
      slots,
    )
  ) {

    return result;
  }


  for (
    let i = 0;
    i < size;
    i++
  ) {

    result[
      i
    ] =
      sanitizeStack(
        slots[
          i
        ],
      );
  }


  return result;
}


function sanitizeEquipment(
  equipment,
) {

  const result =
    emptyEquipment();


  if (
    !equipment
    ||
    typeof equipment !==
      "object"
  ) {

    return result;
  }


  for (
    const slot
    of EQUIPMENT_SLOTS
  ) {

    const raw =
      equipment[
        slot
      ];


    let id;
    let rarity =
      "common";


    if (
      typeof raw ===
      "string"
    ) {

      id =
        raw;
    }

    else if (
      raw
      &&
      typeof raw ===
        "object"
    ) {

      id =
        String(
          raw.id
          ||
          "",
        );


      rarity =
        normalizeRarity(
          raw.rarity,
        );
    }


    if (
      ITEM_CATALOG[
        id
      ]?.equipSlot ===
      slot
    ) {

      result[
        slot
      ] = {
        id,
        rarity,
      };
    }
  }


  return result;
}


function sanitizeProfessions(
  value,
) {

  const result =
    emptyProfessions();


  if (
    !value
    ||
    typeof value !==
      "object"
  ) {

    return result;
  }


  for (
    const id
    of PROFESSION_IDS
  ) {

    const source =
      value[
        id
      ];


    if (
      !source
    ) {

      continue;
    }


    result[
      id
    ] = {

      level:
        Math.max(
          1,

          Math.floor(
            Number(
              source.level,
            )
            ||
            1,
          ),
        ),

      xp:
        Math.max(
          0,

          Math.floor(
            Number(
              source.xp,
            )
            ||
            0,
          ),
        ),
    };
  }


  return result;
}


function cloneSlots(
  slots,
) {

  return slots.map(
    (
      stack,
    ) =>
      stack
        ? {
            id:
              stack.id,

            qty:
              stack.qty,

            rarity:
              normalizeRarity(
                stack.rarity,
              ),
          }
        : null,
  );
}


function countItem(
  slots,
  id,
) {

  let result =
    0;


  for (
    const stack
    of slots
  ) {

    if (
      stack?.id ===
      id
    ) {

      result +=
        stack.qty;
    }
  }


  return result;
}


function addItem(
  slots,
  id,
  amount,
  rarity =
    "common",
) {

  const definition =
    ITEM_CATALOG[
      id
    ];


  if (
    !definition
  ) {

    return amount;
  }


  rarity =
    normalizeRarity(
      rarity,
    );


  let remaining =
    Math.max(
      0,

      Math.floor(
        amount,
      ),
    );


  for (
    let i = 0;
    i < slots.length;
    i++
  ) {

    const stack =
      slots[
        i
      ];


    if (
      !stack
      ||
      stack.id !==
      id
      ||
      normalizeRarity(
        stack.rarity,
      )
      !==
      rarity
    ) {

      continue;
    }


    const free =
      definition.maxStack -
      stack.qty;


    if (
      free <=
      0
    ) {

      continue;
    }


    const moved =
      Math.min(
        free,
        remaining,
      );


    stack.qty +=
      moved;


    remaining -=
      moved;


    if (
      remaining <=
      0
    ) {

      return 0;
    }
  }


  for (
    let i = 0;
    i < slots.length;
    i++
  ) {

    if (
      slots[
        i
      ]
    ) {

      continue;
    }


    const moved =
      Math.min(
        definition.maxStack,
        remaining,
      );


    slots[
      i
    ] = {

      id,

      qty:
        moved,

      rarity,
    };


    remaining -=
      moved;


    if (
      remaining <=
      0
    ) {

      return 0;
    }
  }


  return remaining;
}


function removeItem(
  slots,
  id,
  amount,
) {

  if (
    countItem(
      slots,
      id,
    )
    <
    amount
  ) {

    return false;
  }


  let remaining =
    amount;


  for (
    let i = 0;
    i < slots.length;
    i++
  ) {

    const stack =
      slots[
        i
      ];


    if (
      !stack
      ||
      stack.id !==
      id
    ) {

      continue;
    }


    const removed =
      Math.min(
        stack.qty,
        remaining,
      );


    stack.qty -=
      removed;


    remaining -=
      removed;


    if (
      stack.qty <=
      0
    ) {

      slots[
        i
      ] =
        null;
    }


    if (
      remaining <=
      0
    ) {

      break;
    }
  }


  return true;
}


function moveWithin(
  slots,
  from,
  to,
) {

  if (
    from ===
    to
    ||
    from < 0
    ||
    to < 0
    ||
    from >=
    slots.length
    ||
    to >=
    slots.length
  ) {

    return;
  }


  const source =
    slots[
      from
    ];


  if (
    !source
  ) {

    return;
  }


  const target =
    slots[
      to
    ];


  if (
    target
    &&
    target.id ===
    source.id
    &&
    normalizeRarity(
      target.rarity,
    )
    ===
    normalizeRarity(
      source.rarity,
    )
  ) {

    const definition =
      ITEM_CATALOG[
        source.id
      ];


    const free =
      definition.maxStack -
      target.qty;


    const moved =
      Math.min(
        free,
        source.qty,
      );


    target.qty +=
      moved;


    source.qty -=
      moved;


    if (
      source.qty <=
      0
    ) {

      slots[
        from
      ] =
        null;
    }


    return;
  }


  slots[
    from
  ] =
    target;


  slots[
    to
  ] =
    source;
}


function transferBetween(
  sourceSlots,
  targetSlots,
  sourceIndex,
  targetIndex,
) {

  if (
    sourceIndex < 0
    ||
    sourceIndex >=
    sourceSlots.length
    ||
    targetIndex < 0
    ||
    targetIndex >=
    targetSlots.length
  ) {

    return;
  }


  const source =
    sourceSlots[
      sourceIndex
    ];


  if (
    !source
  ) {

    return;
  }


  const target =
    targetSlots[
      targetIndex
    ];


  if (
    target
    &&
    target.id ===
    source.id
    &&
    normalizeRarity(
      target.rarity,
    )
    ===
    normalizeRarity(
      source.rarity,
    )
  ) {

    const definition =
      ITEM_CATALOG[
        source.id
      ];


    const free =
      definition.maxStack -
      target.qty;


    const moved =
      Math.min(
        free,
        source.qty,
      );


    target.qty +=
      moved;


    source.qty -=
      moved;


    if (
      source.qty <=
      0
    ) {

      sourceSlots[
        sourceIndex
      ] =
        null;
    }


    return;
  }


  sourceSlots[
    sourceIndex
  ] =
    target;


  targetSlots[
    targetIndex
  ] =
    source;
}


function loadSaves() {

  try {

    mkdirSync(
      DATA_DIR,
      {
        recursive:
          true,
      },
    );


    if (
      !existsSync(
        SAVE_FILE,
      )
    ) {

      return {};
    }


    return JSON.parse(
      readFileSync(
        SAVE_FILE,
        "utf8",
      ),
    );
  }

  catch (
    error
  ) {

    console.error(
      "Erro ao carregar save:",
      error,
    );


    return {};
  }
}


export class MyRoom
  extends Room {

  state =
    new MyRoomState();


  maxClients =
    64;


  playerInputs =
    new Map();


  actionCooldown =
    new Map();


  fishingCooldown =
    new Map();


  playerAttackTimes =
    new Map();


  enemyAttackTimes =
    new Map();


  enemyTargets =
    new Map();


  enemySpawns =
    new Map();


  profiles =
    new Map();


  saves =
    loadSaves();


  worldSave =
    loadWorldSave();


  playerRegions =
    new Map();


  /*
   * Etapa 11 v2:
   *
   * Pontos de interesse ficam fora do Schema Colyseus.
   * Isso preserva completamente o fluxo de entrada do Player.
   */

  playerLandmarks =
    new Map();


  dropCounter =
    0;


  lastAutosave =
    0;


  messages = {

    input:
      (
        client,
        payload,
      ) =>
        this.receiveInput(
          client,
          payload,
        ),


    interact:
      (
        client,
        payload,
      ) =>
        this.interact(
          client,
          payload,
        ),


    attack:
      (
        client,
      ) =>
        this.playerAttack(
          client,
        ),


    craft:
      (
        client,
        payload,
      ) =>
        this.craft(
          client,
          payload,
        ),


    sell:
      (
        client,
        payload,
      ) =>
        this.sell(
          client,
          payload,
        ),


    buy:
      (
        client,
        payload,
      ) =>
        this.buy(
          client,
          payload,
        ),


    "inventory-move":
      (
        client,
        payload,
      ) =>
        this.inventoryMove(
          client,
          payload,
        ),


    "inventory-to-chest":
      (
        client,
        payload,
      ) =>
        this.inventoryToChest(
          client,
          payload,
        ),


    "chest-to-inventory":
      (
        client,
        payload,
      ) =>
        this.chestToInventory(
          client,
          payload,
        ),


    "chest-move":
      (
        client,
        payload,
      ) =>
        this.chestMove(
          client,
          payload,
        ),


    "hotbar-assign":
      (
        client,
        payload,
      ) =>
        this.hotbarAssign(
          client,
          payload,
        ),


    "use-hotbar":
      (
        client,
        payload,
      ) =>
        this.useHotbar(
          client,
          payload,
        ),


    "equip-item":
      (
        client,
        payload,
      ) =>
        this.equipItem(
          client,
          payload,
        ),


    "unequip-item":
      (
        client,
        payload,
      ) =>
        this.unequipItem(
          client,
          payload,
        ),


    "quest-action":
      (
        client,
        payload,
      ) =>
        this.questAction(
          client,
          payload,
        ),


    "regional-shop":
      (
        client,
        payload,
      ) =>
        this.openRegionalShop(
          client,
          payload,
        ),


    "request-regional-progress":
      (
        client,
      ) =>
        this.sendRegionalProgressState(
          client,
        ),


    "regional-board":
      (
        client,
        payload,
      ) =>
        this.sendRegionalBoard(
          client,
          payload,
        ),


    "regional-contract-action":
      (
        client,
        payload,
      ) =>
        this.regionalContractAction(
          client,
          payload,
        ),


    "regional-event-claim":
      (
        client,
        payload,
      ) =>
        this.regionalEventClaim(
          client,
          payload,
        ),


    "request-exploration-state":
      (
        client,
      ) =>
        this.sendExplorationState(
          client,
        ),


    /*
     * 11.3A:
     *
     * Apenas testa comunicação cliente → servidor → cliente.
     * NÃO teleporta o jogador.
     */

    "travel-probe":
      (
        client,
        payload,
      ) =>
        this.travelProbe(
          client,
          payload,
        ),


    "travel-jump":
      (
        client,
        payload,
      ) =>
        this.travelJump(
          client,
          payload,
        ),

  };


  onCreate() {

    console.log(
      "🌎 Sandbox Online Etapa 13:",
      this.roomId,
    );


    this.patchRate =
      50;


    this.createResources();

    this.createEnemies();

    this.createFarmPlots();

    this.restoreWorld();

    this.saveWorld(
      "startup",
    );


    this.setTimestep(
      (
        delta,
      ) =>
        this.updateWorld(
          delta,
        ),

      1000 /
      30,
    );
  }



  createResources() {

    for (
      const [
        id,
        kind,
        x,
        z,
      ]
      of RESOURCE_LAYOUT
    ) {

      const config =
        RESOURCE_TYPES[
          kind
        ];


      if (
        !config
      ) {

        console.warn(
          "Recurso desconhecido:",
          kind,
        );


        continue;
      }


      this.state.nodes.set(
        id,

        new ResourceNode(
          {
            kind,
            x,
            z,

            hp:
              config.hp,

            maxHp:
              config.hp,

            active:
              true,

            respawnAt:
              0,
          },
        ),
      );
    }
  }

  createEnemies() {

    for (
      const [
        id,
        kind,
        x,
        z,
      ]
      of ENEMY_LAYOUT
    ) {

      const config =
        ENEMY_TYPES[
          kind
        ];


      if (
        !config
      ) continue;


      this.enemySpawns.set(
        id,
        {
          x,
          z,
        },
      );


      this.state.enemies.set(
        id,

        new Enemy(
          {
            kind,
            x,
            z,

            hp:
              config.hp,

            maxHp:
              config.hp,

            level:
              config.level,

            alive:
              true,

            moving:
              false,

            respawnAt:
              0,
          },
        ),
      );
    }
  }


  createFarmPlots() {

    for (
      const [
        id,
        x,
        z,
      ]
      of FARM_LAYOUT
    ) {

      this.state.farmPlots.set(
        id,

        new FarmPlot(
          {
            x,
            z,
            crop: "",
            stage: 0,
            plantedAt: 0,
            readyAt: 0,
          },
        ),
      );
    }
  }


  restoreWorld() {

    const savedPlots =
      this.worldSave?.farmPlots
      ||
      {};


    const validCrops =
      new Set(
        Object.values(
          CROPS,
        )
          .map(
            (
              crop,
            ) =>
              crop.crop,
          ),
      );


    let restored =
      0;


    let ignored =
      0;


    this.state.farmPlots.forEach(
      (
        plot,
        id,
      ) => {

        const saved =
          savedPlots[
            id
          ];


        if (
          !saved
          ||
          !saved.crop
        ) {

          return;
        }


        const crop =
          String(
            saved.crop,
          );


        if (
          !validCrops.has(
            crop,
          )
        ) {

          ignored++;

          return;
        }


        const plantedAt =
          Math.max(
            0,

            Number(
              saved.plantedAt,
            )
            ||
            0,
          );


        const readyAt =
          Math.max(
            0,

            Number(
              saved.readyAt,
            )
            ||
            0,
          );


        if (
          plantedAt <=
          0
          ||
          readyAt <=
          0
          ||
          readyAt <
          plantedAt
        ) {

          ignored++;

          return;
        }


        plot.crop =
          crop;


        plot.plantedAt =
          plantedAt;


        plot.readyAt =
          readyAt;


        restored++;
      },
    );


    /*
     * Calculamos o estágio com Date.now().
     *
     * Isso significa que o crescimento continua
     * mesmo enquanto o servidor estiver desligado.
     */

    this.updateFarmPlots(
      Date.now(),
    );


    console.log(
      `🌱 Mundo restaurado · ${restored} plantações`
      +
      (
        ignored
          ? ` · ${ignored} entradas ignoradas`
          : ""
      ),
    );
  }


  saveWorld(
    reason =
      "manual",
  ) {

    try {

      this.worldSave = {

        version:
          1,

        savedAt:
          Date.now(),

        farmPlots:
          snapshotFarmPlots(
            this.state.farmPlots,
          ),
      };


      this.worldSave =
        saveWorldSave(
          this.worldSave,
        );


      if (
        reason !==
        "autosave"
      ) {

        const active =
          Object.values(
            this.worldSave.farmPlots,
          )
            .filter(
              (
                plot,
              ) =>
                Boolean(
                  plot.crop,
                ),
            )
            .length;


        console.log(
          `💾 Mundo salvo [${reason}] · ${active} plantações ativas`,
        );
      }
    }

    catch (
      error
    ) {

      console.error(
        "❌ Erro salvando o mundo:",
        error,
      );
    }
  }


  getInventory(
    player,
  ) {

    return sanitizeSlots(
      parseArray(
        player.inventoryJson,
      ),

      INVENTORY_SIZE,
    );
  }


  setInventory(
    player,
    inventory,
  ) {

    player.inventoryJson =
      JSON.stringify(
        sanitizeSlots(
          inventory,
          INVENTORY_SIZE,
        ),
      );


    this.cleanHotbar(
      player,
    );
  }


  getChest(
    player,
  ) {

    return sanitizeSlots(
      parseArray(
        player.chestJson,
      ),

      CHEST_SIZE,
    );
  }


  setChest(
    player,
    chest,
  ) {

    player.chestJson =
      JSON.stringify(
        sanitizeSlots(
          chest,
          CHEST_SIZE,
        ),
      );
  }


  getHotbar(
    player,
  ) {

    const source =
      parseArray(
        player.hotbarJson,
      );


    return Array.from(
      {
        length:
          HOTBAR_SIZE,
      },

      (
        _,
        index,
      ) => {

        const id =
          source[
            index
          ];


        return ITEM_CATALOG[
          id
        ]
          ? id
          : null;
      },
    );
  }


  setHotbar(
    player,
    hotbar,
  ) {

    player.hotbarJson =
      JSON.stringify(
        Array.from(
          {
            length:
              HOTBAR_SIZE,
          },

          (
            _,
            index,
          ) => {

            const id =
              hotbar[
                index
              ];


            return ITEM_CATALOG[
              id
            ]
              ? id
              : null;
          },
        ),
      );
  }


  cleanHotbar(
    player,
  ) {

    const inventory =
      this.getInventory(
        player,
      );


    const hotbar =
      this.getHotbar(
        player,
      );


    let changed =
      false;


    for (
      let i = 0;
      i < hotbar.length;
      i++
    ) {

      if (
        hotbar[
          i
        ]
        &&
        countItem(
          inventory,
          hotbar[
            i
          ],
        )
        <=
        0
      ) {

        hotbar[
          i
        ] =
          null;


        changed =
          true;
      }
    }


    if (
      changed
    ) {

      this.setHotbar(
        player,
        hotbar,
      );
    }
  }


  getEquipment(
    player,
  ) {

    return sanitizeEquipment(
      parseObject(
        player.equipmentJson,
      ),
    );
  }


  setEquipment(
    player,
    equipment,
  ) {

    player.equipmentJson =
      JSON.stringify(
        sanitizeEquipment(
          equipment,
        ),
      );


    this.recalculateStats(
      player,
    );
  }


  getQuests(
    player,
  ) {

    return parseObject(
      player.questsJson,
    );
  }


  setQuests(
    player,
    quests,
  ) {

    player.questsJson =
      JSON.stringify(
        quests,
      );
  }


  getProfessions(
    player,
  ) {

    return sanitizeProfessions(
      parseObject(
        player.professionsJson,
      ),
    );
  }


  setProfessions(
    player,
    professions,
  ) {

    player.professionsJson =
      JSON.stringify(
        sanitizeProfessions(
          professions,
        ),
      );
  }


  professionXpNeeded(
    level,
  ) {

    return (
      35
      +
      (
        level -
        1
      )
      *
      30
    );
  }


  addProfessionXp(
    player,
    profession,
    amount,
    client,
  ) {

    if (
      !PROFESSION_IDS.includes(
        profession,
      )
    ) {

      return;
    }


    const professions =
      this.getProfessions(
        player,
      );


    const state =
      professions[
        profession
      ];


    state.xp +=
      amount;


    let needed =
      this.professionXpNeeded(
        state.level,
      );


    let leveled =
      false;


    while (
      state.xp >=
      needed
    ) {

      state.xp -=
        needed;


      state.level++;


      leveled =
        true;


      needed =
        this.professionXpNeeded(
          state.level,
        );
    }


    this.setProfessions(
      player,
      professions,
    );


    if (
      leveled
    ) {

      client?.send(
        "toast",

        {
          text:
            `${
              profession
            } chegou ao nível ${
              state.level
            }!`,
        },
      );
    }
  }


  recalculateStats(
    player,
  ) {

    const equipment =
      this.getEquipment(
        player,
      );


    let attack =
      2
      +
      Math.floor(
        (
          player.level -
          1
        )
        /
        2,
      );


    let defense =
      0;


    let bonusHp =
      0;


    for (
      const slot
      of EQUIPMENT_SLOTS
    ) {

      const equipped =
        equipment[
          slot
        ];


      if (
        !equipped
      ) continue;


      const item =
        ITEM_CATALOG[
          equipped.id
        ];


      if (
        !item
      ) continue;


      const multiplier =
        RARITIES[
          normalizeRarity(
            equipped.rarity,
          )
        ]?.multiplier
        ||
        1;


      attack +=
        Math.round(
          (
            item.attack
            ||
            0
          )
          *
          multiplier,
        );


      defense +=
        Math.round(
          (
            item.defense
            ||
            0
          )
          *
          multiplier,
        );


      bonusHp +=
        Math.round(
          (
            item.maxHp
            ||
            0
          )
          *
          multiplier,
        );
    }


    const oldMax =
      player.maxHp;


    player.attack =
      attack;


    player.defense =
      defense;


    player.maxHp =
      100
      +
      (
        player.level -
        1
      )
      *
      5
      +
      bonusHp;


    if (
      player.hp >
      player.maxHp
    ) {

      player.hp =
        player.maxHp;
    }


    if (
      player.maxHp >
      oldMax
    ) {

      player.hp =
        Math.min(
          player.maxHp,

          player.hp
          +
          (
            player.maxHp -
            oldMax
          ),
        );
    }
  }


  receiveInput(
    client,
    payload,
  ) {

    let moveX =
      Number(
        payload?.moveX,
      )
      ||
      0;


    let moveZ =
      Number(
        payload?.moveZ,
      )
      ||
      0;


    const length =
      Math.hypot(
        moveX,
        moveZ,
      );


    if (
      length >
      1
    ) {

      moveX /=
        length;


      moveZ /=
        length;
    }


    this.playerInputs.set(
      client.sessionId,

      {
        moveX:
          Math.max(
            -1,
            Math.min(
              1,
              moveX,
            ),
          ),

        moveZ:
          Math.max(
            -1,
            Math.min(
              1,
              moveZ,
            ),
          ),

        screenX:
          Math.sign(
            Number(
              payload?.screenX,
            )
            ||
            0,
          ),

        screenY:
          Math.sign(
            Number(
              payload?.screenY,
            )
            ||
            0,
          ),
      },
    );
  }


  updateWorld(
    deltaMs,
  ) {

    const dt =
      Math.min(
        deltaMs /
        1000,
        .05,
      );


    const speed =
      5.1;


    const now =
      Date.now();


    this.state.players.forEach(
      (
        player,
        sessionId,
      ) => {

        const input =
          this.playerInputs.get(
            sessionId,
          )
          ||
          EMPTY_INPUT;


        const moving =
          Math.abs(
            input.moveX,
          )
          >
          .001
          ||
          Math.abs(
            input.moveZ,
          )
          >
          .001;


        player.moving =
          moving;


        if (
          moving
        ) {

          player.x =
            Math.max(
              -WORLD_BOUNDS,
              Math.min(
                WORLD_BOUNDS,

                player.x
                +
                input.moveX *
                speed *
                dt,
              ),
            );


          player.z =
            Math.max(
              -WORLD_BOUNDS,
              Math.min(
                WORLD_BOUNDS,

                player.z
                +
                input.moveZ *
                speed *
                dt,
              ),
            );


          player.direction =
            this.directionFromScreen(
              input.screenX,
              input.screenY,
            );
        }


        this.updatePlayerRegion(
          player,
          sessionId,
        );


        this.updatePlayerLandmarks(
          player,
          sessionId,
        );
      },
    );


    this.state.nodes.forEach(
      (
        node,
      ) => {

        if (
          !node.active
          &&
          node.respawnAt >
          0
          &&
          now >=
          node.respawnAt
        ) {

          node.hp =
            node.maxHp;


          node.active =
            true;


          node.respawnAt =
            0;
        }
      },
    );


    this.updateFarmPlots(
      now,
    );


    this.updateEnemies(
      dt,
      now,
    );


    if (
      now -
      this.lastAutosave
      >=
      5000
    ) {

      this.lastAutosave =
        now;


      this.saveAll();

      this.saveWorld(
        "autosave",
      );
    }
  }


  updateFarmPlots(
    now,
  ) {

    this.state.farmPlots.forEach(
      (
        plot,
      ) => {

        if (
          !plot.crop
        ) {

          plot.stage =
            0;


          return;
        }


        if (
          now >=
          plot.readyAt
        ) {

          plot.stage =
            3;


          return;
        }


        const duration =
          Math.max(
            1,

            plot.readyAt -
            plot.plantedAt,
          );


        const progress =
          (
            now -
            plot.plantedAt
          )
          /
          duration;


        plot.stage =
          progress <
          .45
            ? 1
            : 2;
      },
    );
  }


  directionFromScreen(
    sx,
    sy,
  ) {

    if (
      sx === 0
      &&
      sy > 0
    ) return 0;

    if (
      sx < 0
      &&
      sy > 0
    ) return 1;

    if (
      sx < 0
      &&
      sy === 0
    ) return 2;

    if (
      sx < 0
      &&
      sy < 0
    ) return 3;

    if (
      sx === 0
      &&
      sy < 0
    ) return 4;

    if (
      sx > 0
      &&
      sy < 0
    ) return 5;

    if (
      sx > 0
      &&
      sy === 0
    ) return 6;

    if (
      sx > 0
      &&
      sy > 0
    ) return 7;

    return 0;
  }


  allowAction(
    client,
  ) {

    const now =
      Date.now();


    const previous =
      this.actionCooldown.get(
        client.sessionId,
      )
      ||
      0;


    if (
      now -
      previous
      <
      240
    ) {

      return false;
    }


    this.actionCooldown.set(
      client.sessionId,
      now,
    );


    return true;
  }


  distance(
    player,
    target,
  ) {

    return Math.hypot(
      player.x -
      target.x,

      player.z -
      target.z,
    );
  }


  updateEnemies(
    dt,
    now,
  ) {

    this.state.enemies.forEach(
      (
        enemy,
        enemyId,
      ) => {

        const config =
          ENEMY_TYPES[
            enemy.kind
          ];


        if (
          !config
        ) return;


        if (
          !enemy.alive
        ) {

          if (
            enemy.respawnAt
            &&
            now >=
            enemy.respawnAt
          ) {

            const spawn =
              this.enemySpawns.get(
                enemyId,
              );


            if (
              spawn
            ) {

              enemy.x =
                spawn.x;


              enemy.z =
                spawn.z;
            }


            enemy.hp =
              enemy.maxHp;


            enemy.alive =
              true;


            enemy.moving =
              false;


            enemy.respawnAt =
              0;


            this.enemyTargets.delete(
              enemyId,
            );
          }


          return;
        }


        let targetId =
          this.enemyTargets.get(
            enemyId,
          );


        let target =
          targetId
            ? this.state.players.get(
                targetId,
              )
            : null;


        if (
          target
          &&
          Math.hypot(
            target.x -
            enemy.x,

            target.z -
            enemy.z,
          )
          >
          config.aggro *
          1.7
        ) {

          target =
            null;


          targetId =
            null;


          this.enemyTargets.delete(
            enemyId,
          );
        }


        if (
          !target
        ) {

          let nearestDistance =
            Infinity;


          this.state.players.forEach(
            (
              player,
              sessionId,
            ) => {

              const distance =
                Math.hypot(
                  player.x -
                  enemy.x,

                  player.z -
                  enemy.z,
                );


              if (
                distance <=
                config.aggro
                &&
                distance <
                nearestDistance
              ) {

                nearestDistance =
                  distance;

                target =
                  player;

                targetId =
                  sessionId;
              }
            },
          );


          if (
            target
            &&
            targetId
          ) {

            this.enemyTargets.set(
              enemyId,
              targetId,
            );
          }
        }


        if (
          !target
          ||
          !targetId
        ) {

          const spawn =
            this.enemySpawns.get(
              enemyId,
            );


          if (
            !spawn
          ) return;


          const dx =
            spawn.x -
            enemy.x;


          const dz =
            spawn.z -
            enemy.z;


          const distance =
            Math.hypot(
              dx,
              dz,
            );


          if (
            distance >
            .2
          ) {

            enemy.moving =
              true;


            const step =
              Math.min(
                distance,

                config.speed *
                .45 *
                dt,
              );


            enemy.x +=
              dx /
              distance *
              step;


            enemy.z +=
              dz /
              distance *
              step;
          }

          else {

            enemy.moving =
              false;
          }


          return;
        }


        const dx =
          target.x -
          enemy.x;


        const dz =
          target.z -
          enemy.z;


        const distance =
          Math.hypot(
            dx,
            dz,
          );


        if (
          distance >
          config.range
        ) {

          enemy.moving =
            true;


          const step =
            Math.min(
              distance -
              config.range,

              config.speed *
              dt,
            );


          if (
            distance >
            0
          ) {

            enemy.x +=
              dx /
              distance *
              step;


            enemy.z +=
              dz /
              distance *
              step;
          }


          return;
        }


        enemy.moving =
          false;


        const previous =
          this.enemyAttackTimes.get(
            enemyId,
          )
          ||
          0;


        if (
          now -
          previous
          <
          config.attackCooldown
        ) {

          return;
        }


        this.enemyAttackTimes.set(
          enemyId,
          now,
        );


        const damage =
          Math.max(
            1,

            config.attack -
            target.defense,
          );


        target.hp =
          Math.max(
            0,

            target.hp -
            damage,
          );


        const targetClient =
          this.clients.find(
            (
              current,
            ) =>
              current.sessionId ===
              targetId,
          );


        targetClient?.send(
          "player-hit",

          {
            damage,
            enemy: config.label,
          },
        );


        if (
          target.hp <=
          0
        ) {

          this.respawnPlayer(
            targetId,
            target,
          );
        }
      },
    );
  }


  playerAttack(
    client,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const now =
      Date.now();


    const previous =
      this.playerAttackTimes.get(
        client.sessionId,
      )
      ||
      0;


    if (
      now -
      previous
      <
      480
    ) {

      return;
    }


    this.playerAttackTimes.set(
      client.sessionId,
      now,
    );


    const result =
      this.findNearestEnemy(
        player.x,
        player.z,
        2.35,
      );


    if (
      !result
    ) {

      client.send(
        "toast",

        {
          text:
            "Nenhum inimigo ao alcance.",
        },
      );


      return;
    }


    result.enemy.hp =
      Math.max(
        0,

        result.enemy.hp -
        Math.max(
          1,
          player.attack,
        ),
      );


    this.broadcast(
      "enemy-hit",

      {
        id:
          result.id,
      },
    );


    if (
      result.enemy.hp <=
      0
    ) {

      this.killEnemy(
        client,
        player,
        result.id,
        result.enemy,
      );
    }
  }


  rollLootRarity(
    level,
  ) {

    const roll =
      Math.random();


    if (
      level >=
      3
    ) {

      if (
        roll <
        .02
      ) return "legendary";

      if (
        roll <
        .09
      ) return "epic";

      if (
        roll <
        .27
      ) return "rare";

      if (
        roll <
        .62
      ) return "uncommon";

      return "common";
    }


    if (
      level >=
      2
    ) {

      if (
        roll <
        .025
      ) return "epic";

      if (
        roll <
        .13
      ) return "rare";

      if (
        roll <
        .45
      ) return "uncommon";

      return "common";
    }


    if (
      roll <
      .06
    ) return "rare";

    if (
      roll <
      .27
    ) return "uncommon";

    return "common";
  }


  killEnemy(
    client,
    player,
    enemyId,
    enemy,
  ) {

    const config =
      ENEMY_TYPES[
        enemy.kind
      ];


    if (
      !config
    ) return;


    enemy.hp =
      0;


    enemy.alive =
      false;


    enemy.moving =
      false;


    enemy.respawnAt =
      Date.now()
      +
      config.respawn;


    this.enemyTargets.delete(
      enemyId,
    );


    player.gold +=
      config.gold;


    this.addXp(
      player,
      config.xp,
    );


    for (
      const [
        itemId,
        quantity,
        chance,
      ]
      of config.loot
    ) {

      if (
        Math.random() <=
        chance
      ) {

        this.spawnDrop(
          itemId,
          quantity,
          enemy.x,
          enemy.z,
        );
      }
    }


    for (
      const [
        itemId,
        chance,
      ]
      of config.equipment
      ||
      []
    ) {

      if (
        Math.random() <=
        chance
      ) {

        const rarity =
          this.rollLootRarity(
            enemy.level,
          );


        this.spawnDrop(
          itemId,
          1,

          enemy.x +
          .2,

          enemy.z +
          .15,

          rarity,
        );
      }
    }


    this.questEvent(
      player,
      "kill",
      enemy.kind,
      1,
      client,
    );


    this.persist(
      client.sessionId,
      true,
    );


    client.send(
      "toast",

      {
        text:
          `${
            config.label
          } derrotado! +${
            config.xp
          } XP · +${
            config.gold
          } ouro`,
      },
    );
  }


  respawnPlayer(
    sessionId,
    player,
  ) {

    const lostGold =
      Math.floor(
        player.gold *
        .10,
      );


    player.gold =
      Math.max(
        0,

        player.gold -
        lostGold,
      );


    player.hp =
      player.maxHp;


    player.x =
      0;


    player.z =
      1;


    this.enemyTargets.forEach(
      (
        target,
        enemyId,
      ) => {

        if (
          target ===
          sessionId
        ) {

          this.enemyTargets.delete(
            enemyId,
          );
        }
      },
    );


    this.clients
      .find(
        (
          client,
        ) =>
          client.sessionId ===
          sessionId,
      )
      ?.send(
        "player-death",

        {
          lostGold,
        },
      );
  }




  getDiscoveries(
    player,
  ) {

    const raw =
      parseArray(
        player.discoveriesJson,
      );


    const result = [];


    for (
      const value
      of raw
    ) {

      const id =
        String(
          value
          ||
          "",
        );


      if (
        REGIONS[
          id
        ]
        &&
        !result.includes(
          id,
        )
      ) {

        result.push(
          id,
        );
      }
    }


    return result;
  }


  setDiscoveries(
    player,
    discoveries,
  ) {

    const result = [];


    for (
      const value
      of discoveries
      ||
      []
    ) {

      const id =
        String(
          value
          ||
          "",
        );


      if (
        REGIONS[
          id
        ]
        &&
        !result.includes(
          id,
        )
      ) {

        result.push(
          id,
        );
      }
    }


    player.discoveriesJson =
      JSON.stringify(
        result,
      );
  }


  updatePlayerRegion(
    player,
    sessionId,
  ) {

    const regionId =
      getRegionAt(
        player.x,
        player.z,
      );


    const previous =
      this.playerRegions.get(
        sessionId,
      );


    if (
      previous ===
      regionId
    ) {

      return;
    }


    this.playerRegions.set(
      sessionId,
      regionId,
    );


    const region =
      REGIONS[
        regionId
      ];


    if (
      !region
    ) {

      return;
    }


    const discoveries =
      this.getDiscoveries(
        player,
      );


    if (
      discoveries.includes(
        regionId,
      )
    ) {

      return;
    }


    discoveries.push(
      regionId,
    );


    this.setDiscoveries(
      player,
      discoveries,
    );


    const xp =
      Math.max(
        0,

        Number(
          region.discoveryXp,
        )
        ||
        0,
      );


    const gold =
      Math.max(
        0,

        Number(
          region.discoveryGold,
        )
        ||
        0,
      );


    if (
      xp >
      0
    ) {

      this.addXp(
        player,
        xp,
      );
    }


    if (
      gold >
      0
    ) {

      player.gold +=
        gold;
    }


    const client =
      this.clients.find(
        (
          candidate,
        ) =>
          candidate.sessionId ===
          sessionId,
      );


    this.questEvent(
      player,
      "discover",
      regionId,
      1,
      client,
    );


    this.persist(
      sessionId,
      true,
    );


    client?.send(
      "region-discovered",

      {
        id:
          regionId,

        label:
          region.label,

        xp,

        gold,

        recommendedLevel:
          region.recommendedLevel,
      },
    );


    console.log(
      `🧭 ${
        player.name
      } descobriu ${
        region.label
      }`,
    );
  }



  sanitizeLandmarks(
    values,
  ) {

    const result = [];


    for (
      const raw
      of (
        Array.isArray(
          values,
        )
          ? values
          : []
      )
    ) {

      const id =
        String(
          raw
          ||
          "",
        );


      if (
        LANDMARKS[
          id
        ]
        &&
        !result.includes(
          id,
        )
      ) {

        result.push(
          id,
        );
      }
    }


    if (
      !result.includes(
        "village_waystone",
      )
    ) {

      result.unshift(
        "village_waystone",
      );
    }


    return result;
  }


  getPlayerLandmarks(
    sessionId,
  ) {

    const set =
      this.playerLandmarks.get(
        sessionId,
      );


    return this.sanitizeLandmarks(
      set
        ? Array.from(
            set,
          )
        : [],
    );
  }


  sendExplorationState(
    client,
  ) {

    client.send(
      "exploration-state",

      {
        landmarks:
          this.getPlayerLandmarks(
            client.sessionId,
          ),
      },
    );
  }


  updatePlayerLandmarks(
    player,
    sessionId,
  ) {

    const set =
      this.playerLandmarks.get(
        sessionId,
      );


    if (
      !set
    ) {

      return;
    }


    let changed =
      false;


    const client =
      this.clients.find(
        (
          candidate,
        ) =>
          candidate.sessionId ===
          sessionId,
      );


    for (
      const id
      of LANDMARK_ORDER
    ) {

      if (
        set.has(
          id,
        )
      ) {

        continue;
      }


      const landmark =
        LANDMARKS[
          id
        ];


      if (
        !landmark
      ) {

        continue;
      }


      const distance =
        Math.hypot(
          landmark.x -
          player.x,

          landmark.z -
          player.z,
        );


      if (
        distance >
        (
          landmark.radius
          ||
          3.2
        )
      ) {

        continue;
      }


      set.add(
        id,
      );


      changed =
        true;


      const xp =
        Math.max(
          0,

          Number(
            landmark.discoveryXp,
          )
          ||
          0,
        );


      const gold =
        Math.max(
          0,

          Number(
            landmark.discoveryGold,
          )
          ||
          0,
        );


      if (
        xp >
        0
      ) {

        this.addXp(
          player,
          xp,
        );
      }


      if (
        gold >
        0
      ) {

        player.gold +=
          gold;
      }


      this.questEvent(
        player,
        "landmark",
        id,
        1,
        client,
      );


      client?.send(
        "landmark-discovered",

        {
          id,

          label:
            landmark.label,

          region:
            landmark.region,

          xp,

          gold,

          landmarks:
            this.getPlayerLandmarks(
              sessionId,
            ),
        },
      );


      console.log(
        `📍 ${
          player.name
        } descobriu ${
          landmark.label
        }`,
      );
    }


    if (
      changed
    ) {

      this.persist(
        sessionId,
        true,
      );
    }
  }




  travelJump(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      client.send(
        "travel-jump-result",

        {
          ok:
            false,

          reason:
            "player-not-found",
        },
      );


      return;
    }


    const target =
      String(
        payload?.target
        ||
        "",
      );


    /*
     * Etapa 11.3B:
     *
     * apenas dois destinos.
     * Sem mapa, sem serviço e sem sistema genérico ainda.
     */

    const destinations = {

      village_waystone: {

        label:
          "Vila do Vale",

        x:
          0,

        z:
          1,
      },


      sunmeadow_outpost: {

        label:
          "Posto do Prado",

        x:
          3,

        z:
          -28,
      },

    };


    const destination =
      destinations[
        target
      ];


    if (
      !destination
    ) {

      client.send(
        "travel-jump-result",

        {
          ok:
            false,

          reason:
            "invalid-target",
        },
      );


      return;
    }


    /*
     * Vila sempre liberada.
     *
     * Posto do Prado precisa já ter sido descoberto.
     */

    if (
      target ===
      "sunmeadow_outpost"
      &&
      !this
        .getPlayerLandmarks(
          client.sessionId,
        )
        .includes(
          "sunmeadow_outpost",
        )
    ) {

      client.send(
        "travel-jump-result",

        {
          ok:
            false,

          reason:
            "locked",

          label:
            "Posto do Prado",
        },
      );


      return;
    }


    console.log(
      "[TRAVEL/JUMP] antes",
      {
        name:
          player.name,

        x:
          player.x,

        z:
          player.z,

        target,
      },
    );


    player.x =
      destination.x;


    player.z =
      destination.z;


    player.moving =
      false;


    this.playerInputs.set(
      client.sessionId,

      {
        ...EMPTY_INPUT,
      },
    );


    /*
     * Obriga atualização da região depois do salto.
     */

    this.playerRegions.delete(
      client.sessionId,
    );


    this.updatePlayerRegion(
      player,
      client.sessionId,
    );


    this.updatePlayerLandmarks(
      player,
      client.sessionId,
    );


    this.persist(
      client.sessionId,
      true,
    );


    console.log(
      "[TRAVEL/JUMP] depois",
      {
        name:
          player.name,

        x:
          player.x,

        z:
          player.z,

        target,
      },
    );


    client.send(
      "travel-jump-result",

      {
        ok:
          true,

        target,

        label:
          destination.label,

        x:
          destination.x,

        z:
          destination.z,
      },
    );
  }


  travelProbe(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      console.warn(
        "[TRAVEL/PROBE] jogador não encontrado",
        client.sessionId,
      );


      client.send(
        "travel-probe-ok",

        {
          ok:
            false,

          reason:
            "player-not-found",
        },
      );


      return;
    }


    const regionId =
      getRegionAt(
        player.x,
        player.z,
      );


    const landmarks =
      this.getPlayerLandmarks(
        client.sessionId,
      );


    console.log(
      "[TRAVEL/PROBE] OK",
      {
        sessionId:
          client.sessionId,

        name:
          player.name,

        region:
          regionId,

        x:
          player.x,

        z:
          player.z,

        landmarks:
          landmarks.length,

        source:
          payload?.source
          ||
          "unknown",
      },
    );


    client.send(
      "travel-probe-ok",

      {
        ok:
          true,

        name:
          player.name,

        region:
          regionId,

        x:
          Math.round(
            player.x *
            10,
          )
          /
          10,

        z:
          Math.round(
            player.z *
            10,
          )
          /
          10,

        landmarks:
          landmarks.length,
      },
    );
  }




  findNearestRegionalNpc(
    x,
    z,
    radius =
      2.6,
  ) {

    let result =
      null;


    const now =
      Date.now();


    for (
      const [
        id,
        npc,
      ]
      of Object.entries(
        REGIONAL_NPCS,
      )
    ) {

      const position =
        regionalNpcPositionAt(
          id,
          now,
        );


      if (
        !position
      ) {

        continue;
      }


      const distance =
        Math.hypot(
          position.x -
          x,

          position.z -
          z,
        );


      if (
        distance <=
        radius
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

          npc,

          x:
            position.x,

          z:
            position.z,

          distance,
        };
      }
    }


    return result;
  }


  findNearestOutpostService(
    x,
    z,
    radius =
      3.25,
  ) {

    let result =
      null;


    for (
      const [
        id,
        service,
      ]
      of Object.entries(
        OUTPOST_SERVICES,
      )
    ) {

      const landmark =
        LANDMARKS[
          id
        ];


      if (
        !landmark
      ) {

        continue;
      }


      const distance =
        Math.hypot(
          landmark.x -
          x,

          landmark.z -
          z,
        );


      if (
        distance <=
        radius
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
          service,
          landmark,
          distance,
        };
      }
    }


    return result;
  }


  professionLevel(
    player,
    profession,
  ) {

    const professions =
      this.getProfessions(
        player,
      );


    return Math.max(
      1,

      Number(
        professions?.[
          profession
        ]?.level,
      )
      ||
      1,
    );
  }


  toolTier(
    itemId,
    kind,
  ) {

    const tool =
      TOOL_TIERS[
        itemId
      ];


    if (
      !tool
      ||
      tool.kind !==
      kind
    ) {

      return 0;
    }


    return Math.max(
      0,

      Number(
        tool.tier,
      )
      ||
      0,
    );
  }


  findFishingSpot(
    x,
    z,
    radius =
      4.5,
  ) {

    let result =
      null;


    for (
      const [
        id,
        spot,
      ]
      of Object.entries(
        FISHING_SPOTS,
      )
    ) {

      const distance =
        Math.hypot(
          spot.x -
          x,

          spot.z -
          z,
        );


      if (
        distance <=
        radius
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
          spot,
          distance,
        };
      }
    }


    return result;
  }



  interact(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
      ||
      !this.allowAction(
        client,
      )
    ) {

      return;
    }


    const selected =
      String(
        payload?.tool
        ||
        "",
      );


    /*
     * DROPS
     */

    const drop =
      this.findNearestDrop(
        player.x,
        player.z,
        1.7,
      );


    if (
      drop
    ) {

      const inventory =
        this.getInventory(
          player,
        );


      const original =
        drop.item.amount;


      const remaining =
        addItem(
          inventory,
          drop.item.kind,
          original,
          drop.item.rarity,
        );


      const collected =
        original -
        remaining;


      if (
        collected <=
        0
      ) {

        client.send(
          "toast",
          {
            text:
              "Inventário cheio.",
          },
        );


        return;
      }


      this.setInventory(
        player,
        inventory,
      );


      this.questEvent(
        player,
        "collect",
        drop.item.kind,
        collected,
        client,
      );


      if (
        remaining <=
        0
      ) {

        this.state.drops.delete(
          drop.id,
        );
      }

      else {

        drop.item.amount =
          remaining;
      }


      this.persist(
        client.sessionId,
        true,
      );


      return;
    }


    /*
     * FAZENDA
     */

    const plot =
      this.findNearestFarmPlot(
        player.x,
        player.z,
        1.7,
      );


    if (
      plot
    ) {

      this.handleFarmPlot(
        client,
        player,
        plot,
        selected,
      );


      return;
    }


    /*
     * PESCA
     */

    const fishing =
      this.findFishingSpot(
        player.x,
        player.z,
      );


    if (
      fishing
    ) {

      this.fish(
        client,
        player,
        selected,
        fishing,
      );


      return;
    }


    /*
     * SERVIÇOS DOS POSTOS
     */

    const outpostService =
      this.findNearestOutpostService(
        player.x,
        player.z,
        3.25,
      );


    if (
      outpostService
    ) {

      console.log(
        "[OUTPOST/SERVICE]",
        player.name,
        outpostService.id,
        outpostService.service.type,
      );


      const type =
        outpostService
          .service
          .type;


      if (
        type ===
        "shop"
      ) {

        client.send(
          "open-shop",
          {
            source:
              outpostService.id,
          },
        );


        return;
      }


      if (
        type ===
        "chest"
      ) {

        client.send(
          "open-chest",
          {
            source:
              outpostService.id,
          },
        );


        return;
      }


      if (
        type ===
        "workbench"
        ||
        type ===
        "furnace"
      ) {

        client.send(
          "open-crafting",
          {
            station:
              type,

            source:
              outpostService.id,
          },
        );


        return;
      }
    }


    /*
     * NPCs REGIONAIS
     */

    const regionalNpc =
      this.findNearestRegionalNpc(
        player.x,
        player.z,
        2.4,
      );


    if (
      regionalNpc
    ) {

      client.send(
        "open-regional-dialog",

        {
          id:
            regionalNpc.id,

          name:
            regionalNpc.npc.name,

          role:
            regionalNpc.npc.role,

          region:
            regionalNpc.npc.region,

          text:
            regionalNpc.npc.text,

          tip:
            regionalNpc.npc.tip,
        },
      );


      console.log(
        "[REGIONAL/NPC]",
        player.name,
        "falou com",
        regionalNpc.npc.name,
      );


      return;
    }


    /*
     * NPCS
     */

    const questNpcs = [
      "lina",
      "hunter",
      "blacksmith",
      "fisherman",
      "farmer",
      "cook",
    ];


    for (
      const npc
      of questNpcs
    ) {

      if (
        this.distance(
          player,
          LOCATIONS[
            npc
          ],
        )
        <=
        2.5
      ) {

        client.send(
          "open-quests",
          {
            npc,
          },
        );


        return;
      }
    }


    /*
     * SERVIÇOS
     */

    if (
      this.distance(
        player,
        LOCATIONS.merchant,
      )
      <=
      2.6
    ) {

      client.send(
        "open-shop",
        {},
      );


      return;
    }


    if (
      this.distance(
        player,
        LOCATIONS.chest,
      )
      <=
      2.5
    ) {

      client.send(
        "open-chest",
        {},
      );


      return;
    }


    for (
      const station
      of [
        "workbench",
        "furnace",
        "mill",
        "kitchen",
      ]
    ) {

      if (
        this.distance(
          player,
          LOCATIONS[
            station
          ],
        )
        <=
        2.5
      ) {

        client.send(
          "open-crafting",
          {
            station,
          },
        );


        return;
      }
    }


    /*
     * RECURSOS
     */

    const resource =
      this.findNearestResource(
        player.x,
        player.z,
        2.4,
      );


    if (
      !resource
    ) {

      client.send(
        "toast",
        {
          text:
            "Nada para interagir por perto.",
        },
      );


      return;
    }


    const config =
      RESOURCE_TYPES[
        resource.node.kind
      ];


    if (
      !config
    ) {

      return;
    }


    const professionLevel =
      this.professionLevel(
        player,
        config.profession,
      );


    if (
      professionLevel <
      config.reqLevel
    ) {

      client.send(
        "toast",
        {
          text:
            `Requer ${
              config.profession
            } Nv.${
              config.reqLevel
            }.`,
        },
      );


      return;
    }


    let toolTier =
      1;


    if (
      config.tool
    ) {

      toolTier =
        this.toolTier(
          selected,
          config.tool,
        );


      if (
        toolTier <
        config.minTier
      ) {

        client.send(
          "toast",
          {
            text:
              `Ferramenta insuficiente para ${
                config.label
              }.`,
          },
        );


        return;
      }
    }


    resource.node.hp =
      Math.max(
        0,

        resource.node.hp -
        Math.max(
          1,
          toolTier,
        ),
      );


    this.broadcast(
      "resource-hit",
      {
        id:
          resource.id,
      },
    );


    if (
      resource.node.hp <=
      0
    ) {

      this.destroyResource(
        client,
        player,
        resource.node,
      );
    }
  }


  destroyResource(
    client,
    player,
    node,
  ) {

    const config =
      RESOURCE_TYPES[
        node.kind
      ];


    if (
      !config
    ) return;


    node.active =
      false;


    node.respawnAt =
      Date.now()
      +
      config.respawn;


    const professionLevel =
      this.professionLevel(
        player,
        config.profession,
      );


    config.drops.forEach(
      (
        drop,
        index,
      ) => {

        const [
          itemId,
          baseAmount,
        ] =
          drop;


        let amount =
          baseAmount;


        /*
         * Bônus de maestria Nv.10.
         */

        if (
          professionLevel >=
          10
          &&
          index ===
          0
        ) {

          amount +=
            1;
        }


        this.spawnDrop(
          itemId,
          amount,

          node.x +
          index *
          .25,

          node.z +
          index *
          .1,
        );
      },
    );


    this.addProfessionXp(
      player,
      config.profession,
      config.xp,
      client,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  handleFarmPlot(
    client,
    player,
    result,
    selected,
  ) {

    const plot =
      result.plot;


    /*
     * COLHEITA
     */

    if (
      plot.stage ===
      3
      &&
      plot.crop
    ) {

      const crop =
        plot.crop;


      const seedEntry =
        Object.entries(
          CROPS,
        )
          .find(
            (
              [
                _seed,
                data,
              ],
            ) =>
              data.crop ===
              crop,
          );


      if (
        !seedEntry
      ) return;


      const [
        _seed,
        data,
      ] =
        seedEntry;


      const inventory =
        this.getInventory(
          player,
        );


      let yieldAmount =
        data.yield;


      if (
        this.professionLevel(
          player,
          "farming",
        )
        >=
        10
      ) {

        yieldAmount +=
          1;
      }


      const remaining =
        addItem(
          inventory,
          crop,
          yieldAmount,
        );


      const collected =
        yieldAmount -
        remaining;


      if (
        collected <=
        0
      ) {

        client.send(
          "toast",
          {
            text:
              "Inventário cheio.",
          },
        );


        return;
      }


      this.setInventory(
        player,
        inventory,
      );


      if (
        remaining >
        0
      ) {

        this.spawnDrop(
          crop,
          remaining,
          plot.x,
          plot.z,
        );
      }


      plot.crop =
        "";


      plot.stage =
        0;


      plot.plantedAt =
        0;


      plot.readyAt =
        0;


      this.addProfessionXp(
        player,
        "farming",
        data.xp,
        client,
      );


      this.questEvent(
        player,
        "harvest",
        "any_crop",
        1,
        client,
      );


      this.questEvent(
        player,
        "harvest",
        crop,
        1,
        client,
      );


      /*
       * SAVE IMEDIATO CORRETO DA COLHEITA
       */

      this.saveWorld(
        "harvest",
      );


      this.persist(
        client.sessionId,
        true,
      );


      client.send(
        "toast",
        {
          text:
            `Colhido: ${
              collected
            } ${
              ITEM_CATALOG[
                crop
              ]?.label
              ||
              crop
            }`,
        },
      );


      return;
    }


    /*
     * PLANTIO
     */

    if (
      !plot.crop
    ) {

      const cropData =
        CROPS[
          selected
        ];


      if (
        !cropData
      ) {

        client.send(
          "toast",
          {
            text:
              "Selecione sementes na hotbar.",
          },
        );


        return;
      }


      const level =
        this.professionLevel(
          player,
          "farming",
        );


      if (
        level <
        cropData.reqLevel
      ) {

        client.send(
          "toast",
          {
            text:
              `Agricultor Nv.${
                cropData.reqLevel
              } necessário.`,
          },
        );


        return;
      }


      const inventory =
        this.getInventory(
          player,
        );


      if (
        !removeItem(
          inventory,
          selected,
          1,
        )
      ) {

        return;
      }


      const now =
        Date.now();


      plot.crop =
        cropData.crop;


      plot.stage =
        1;


      plot.plantedAt =
        now;


      plot.readyAt =
        now +
        cropData.growTime;


      this.setInventory(
        player,
        inventory,
      );


      this.addProfessionXp(
        player,
        "farming",
        3,
        client,
      );


      /*
       * SAVE IMEDIATO CORRETO DO PLANTIO
       */

      this.saveWorld(
        "plant",
      );


      this.persist(
        client.sessionId,
        true,
      );


      client.send(
        "toast",
        {
          text:
            `Plantado: ${
              ITEM_CATALOG[
                selected
              ]?.label
              ||
              selected
            }`,
        },
      );


      return;
    }


    client.send(
      "toast",
      {
        text:
          plot.stage ===
          3
            ? "Plantação pronta para colher."
            : "A plantação ainda está crescendo.",
      },
    );
  }


  fish(
    client,
    player,
    selected,
    fishing,
  ) {

    const spot =
      fishing?.spot;


    if (
      !spot
    ) return;


    const fishingLevel =
      this.professionLevel(
        player,
        "fishing",
      );


    if (
      fishingLevel <
      spot.reqLevel
    ) {

      client.send(
        "toast",
        {
          text:
            `Pescador Nv.${
              spot.reqLevel
            } necessário para ${
              spot.label
            }.`,
        },
      );


      return;
    }


    const rodTier =
      this.toolTier(
        selected,
        "rod",
      );


    if (
      rodTier <
      spot.minRodTier
    ) {

      client.send(
        "toast",
        {
          text:
            `Vara de pesca T${
              spot.minRodTier
            } necessária.`,
        },
      );


      return;
    }


    const inventory =
      this.getInventory(
        player,
      );


    if (
      countItem(
        inventory,
        selected,
      )
      <=
      0
    ) {

      return;
    }


    const now =
      Date.now();


    const previous =
      this.fishingCooldown.get(
        client.sessionId,
      )
      ||
      0;


    if (
      now -
      previous
      <
      2500
    ) {

      client.send(
        "toast",
        {
          text:
            "Espere um pouco antes de lançar novamente.",
        },
      );


      return;
    }


    this.fishingCooldown.set(
      client.sessionId,
      now,
    );


    const loot =
      spot.loot;


    const totalWeight =
      loot.reduce(
        (
          total,
          entry,
        ) =>
          total +
          entry[
            1
          ],
        0,
      );


    let roll =
      Math.random()
      *
      totalWeight;


    let selectedFish =
      loot[
        0
      ];


    for (
      const entry
      of loot
    ) {

      roll -=
        entry[
          1
        ];


      if (
        roll <=
        0
      ) {

        selectedFish =
          entry;

        break;
      }
    }


    const [
      fishId,
      _weight,
      fishXp,
    ] =
      selectedFish;


    let amount =
      1;


    if (
      fishingLevel >=
      10
      &&
      Math.random() <
      .25
    ) {

      amount =
        2;
    }


    const remaining =
      addItem(
        inventory,
        fishId,
        amount,
      );


    const collected =
      amount -
      remaining;


    if (
      collected >
      0
    ) {

      this.setInventory(
        player,
        inventory,
      );
    }


    if (
      remaining >
      0
    ) {

      this.spawnDrop(
        fishId,
        remaining,
        player.x,
        player.z,
      );
    }


    this.addProfessionXp(
      player,
      "fishing",
      fishXp,
      client,
    );


    this.questEvent(
      player,
      "fish",
      "any_fish",
      collected,
      client,
    );


    this.questEvent(
      player,
      "fish",
      fishId,
      collected,
      client,
    );


    this.persist(
      client.sessionId,
      true,
    );


    client.send(
      "toast",
      {
        text:
          `🎣 ${
            spot.label
          }: ${
            collected
          }x ${
            ITEM_CATALOG[
              fishId
            ]?.label
            ||
            fishId
          }`,
      },
    );
  }

  spawnDrop(
    kind,
    amount,
    x,
    z,
    rarity =
      "common",
  ) {

    const id =
      `drop_${
        ++this.dropCounter
      }`;


    this.state.drops.set(
      id,

      new WorldDrop(
        {
          kind,
          amount,

          rarity:
            normalizeRarity(
              rarity,
            ),

          x:
            x +
            (
              Math.random() -
              .5
            )
            *
            .5,

          z:
            z +
            (
              Math.random() -
              .5
            )
            *
            .5,
        },
      ),
    );
  }



  craft(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const station =
      String(
        payload?.station
        ||
        "",
      );


    const stationRecipes = {

      workbench:
        WORKBENCH_RECIPES,

      furnace:
        FURNACE_RECIPES,

      mill:
        MILL_RECIPES,

      kitchen:
        KITCHEN_RECIPES,

    };


    const recipes =
      stationRecipes[
        station
      ];


    if (
      !recipes
      ||
      !LOCATIONS[
        station
      ]
      ||
      this.distance(
        player,
        LOCATIONS[
          station
        ],
      )
      >
      3.5
    ) {

      return;
    }


    const recipe =
      recipes[
        String(
          payload?.recipe
          ||
          "",
        )
      ];


    if (
      !recipe
    ) return;


    const reqProfession =
      recipe.reqProfession
      ||
      (
        station ===
        "kitchen"
          ? "cooking"
          : "production"
      );


    const reqLevel =
      Math.max(
        1,

        Number(
          recipe.reqLevel,
        )
        ||
        1,
      );


    const professionLevel =
      this.professionLevel(
        player,
        reqProfession,
      );


    if (
      professionLevel <
      reqLevel
    ) {

      client.send(
        "toast",
        {
          text:
            `${
              reqProfession
            } Nv.${
              reqLevel
            } necessário.`,
        },
      );


      return;
    }


    const inventory =
      this.getInventory(
        player,
      );


    for (
      const [
        id,
        amount,
      ]
      of Object.entries(
        recipe.costs,
      )
    ) {

      if (
        countItem(
          inventory,
          id,
        )
        <
        amount
      ) {

        client.send(
          "toast",
          {
            text:
              "Materiais insuficientes.",
          },
        );


        return;
      }
    }


    const simulated =
      cloneSlots(
        inventory,
      );


    for (
      const [
        id,
        amount,
      ]
      of Object.entries(
        recipe.costs,
      )
    ) {

      removeItem(
        simulated,
        id,
        amount,
      );
    }


    const remaining =
      addItem(
        simulated,
        recipe.result.id,
        recipe.result.qty,
      );


    if (
      remaining >
      0
    ) {

      client.send(
        "toast",
        {
          text:
            "Inventário cheio.",
        },
      );


      return;
    }


    this.setInventory(
      player,
      simulated,
    );


    this.questEvent(
      player,
      "craft",
      recipe.result.id,
      recipe.result.qty,
      client,
    );


    if (
      station ===
      "kitchen"
    ) {

      this.addProfessionXp(
        player,
        "cooking",

        reqLevel >=
        10
          ? 28
          : reqLevel >=
            5
            ? 18
            : 12,

        client,
      );


      this.questEvent(
        player,
        "cook",
        "any_food",
        recipe.result.qty,
        client,
      );
    }

    else {

      this.addProfessionXp(
        player,
        "production",

        reqLevel >=
        10
          ? 24
          : reqLevel >=
            5
            ? 16
            : station ===
              "furnace"
              ? 10
              : 7,

        client,
      );
    }


    this.addXp(
      player,
      5,
    );


    this.persist(
      client.sessionId,
      true,
    );


    client.send(
      "toast",
      {
        text:
          `Fabricado: ${
            recipe.label
          }`,
      },
    );
  }

  equipItem(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const index =
      Math.floor(
        Number(
          payload?.index,
        ),
      );


    if (
      index < 0
      ||
      index >=
      INVENTORY_SIZE
    ) {

      return;
    }


    const inventory =
      this.getInventory(
        player,
      );


    const stack =
      inventory[
        index
      ];


    if (
      !stack
    ) return;


    const definition =
      ITEM_CATALOG[
        stack.id
      ];


    const slot =
      definition?.equipSlot;


    if (
      !slot
    ) return;


    const simulated =
      cloneSlots(
        inventory,
      );


    const equipment =
      this.getEquipment(
        player,
      );


    simulated[
      index
    ] =
      null;


    const previous =
      equipment[
        slot
      ];


    if (
      previous
    ) {

      const remaining =
        addItem(
          simulated,
          previous.id,
          1,
          previous.rarity,
        );


      if (
        remaining >
        0
      ) {

        client.send(
          "toast",

          {
            text:
              "Inventário cheio.",
          },
        );


        return;
      }
    }


    equipment[
      slot
    ] = {

      id:
        stack.id,

      rarity:
        stack.rarity,
    };


    this.setInventory(
      player,
      simulated,
    );


    this.setEquipment(
      player,
      equipment,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  unequipItem(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const slot =
      String(
        payload?.slot
        ||
        "",
      );


    const equipment =
      this.getEquipment(
        player,
      );


    const equipped =
      equipment[
        slot
      ];


    if (
      !equipped
    ) return;


    const inventory =
      this.getInventory(
        player,
      );


    if (
      addItem(
        inventory,
        equipped.id,
        1,
        equipped.rarity,
      )
      >
      0
    ) {

      return;
    }


    equipment[
      slot
    ] =
      null;


    this.setInventory(
      player,
      inventory,
    );


    this.setEquipment(
      player,
      equipment,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  openRegionalShop(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      return;
    }


    const requested =
      String(
        payload?.npc
        ||
        "",
      );


    const market =
      regionalMarketForSource(
        requested,
      );


    if (
      !market
    ) {

      return;
    }


    const nearest =
      this.findNearestRegionalNpc(
        player.x,
        player.z,
        3.2,
      );


    if (
      !nearest
      ||
      nearest.id !==
      requested
    ) {

      return;
    }


    client.send(
      "open-shop",

      {
        source:
          requested,
      },
    );
  }


  resolveShopContext(
    player,
    rawSource,
  ) {

    const source =
      String(
        rawSource
        ||
        "",
      );


    const regionalMarket =
      regionalMarketForSource(
        source,
      );


    if (
      regionalMarket
    ) {

      /*
       * Comércio físico do Posto do Prado.
       */

      if (
        OUTPOST_MARKET_SOURCE[
          source
        ]
      ) {

        const landmark =
          LANDMARKS[
            source
          ];


        if (
          !landmark
          ||
          Math.hypot(
            player.x -
            landmark.x,

            player.z -
            landmark.z,
          )
          >
          3.8
        ) {

          return null;
        }
      }

      /*
       * Comércio diretamente com o NPC.
       */

      else {

        const position =
          regionalNpcPositionAt(
            source,
            Date.now(),
          );


        if (
          !position
          ||
          Math.hypot(
            player.x -
            position.x,

            player.z -
            position.z,
          )
          >
          3.3
        ) {

          return null;
        }
      }


      return {

        regional:
          true,

        source,

        market:
          regionalMarket,
      };
    }


    /*
     * Mercado original da Vila.
     */

    if (
      this.distance(
        player,
        LOCATIONS.merchant,
      )
      >
      3.5
    ) {

      return null;
    }


    return {

      regional:
        false,

      source:
        "",

      market:
        null,
    };
  }


  regionalShopPrice(
    sessionId,
    context,
    itemId,
    mode,
  ) {

    if (
      !context?.regional
    ) {

      return Math.max(
        0,

        Number(
          ITEM_CATALOG[
            itemId
          ]?.[
            mode
          ],
        )
        ||
        0,
      );
    }


    const base =
      Math.max(
        0,

        Number(
          context
            .market?.[
              mode
            ]?.[
              itemId
            ],
        )
        ||
        0,
      );


    if (
      base <=
      0
    ) {

      return 0;
    }


    const region =
      REGIONAL_NPCS[
        context.market.id
      ]?.region;


    if (
      !region
    ) {

      return base;
    }


    const progress =
      this.getRegionalProgress(
        sessionId,
      );


    return regionalPrice(

      base,

      progress
        .reputation?.[
          region
        ]
      ||
      0,

      mode,
    );
  }


  sell(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      return;
    }


    const context =
      this.resolveShopContext(
        player,
        payload?.source,
      );


    if (
      !context
    ) {

      return;
    }


    const requested =
      String(
        payload?.kind
        ||
        "",
      );


    const inventory =
      this.getInventory(
        player,
      );


    let earned =
      0;


    const priceFor =
      (
        id,
      ) =>
        this.regionalShopPrice(
          client.sessionId,
          context,
          id,
          "sell",
        );


    const sellOneType =
      (
        id,
      ) => {

        const price =
          priceFor(
            id,
          );


        if (
          price <=
          0
        ) {

          return;
        }


        const amount =
          countItem(
            inventory,
            id,
          );


        if (
          amount <=
          0
        ) {

          return;
        }


        removeItem(
          inventory,
          id,
          amount,
        );


        earned +=
          amount *
          price;
      };


    if (
      requested ===
      "all"
    ) {

      if (
        context.regional
      ) {

        for (
          const id
          of Object.keys(
            context
              .market
              .sell
            ||
            {},
          )
        ) {

          sellOneType(
            id,
          );
        }
      }

      else {

        for (
          const [
            id,
            definition,
          ]
          of Object.entries(
            ITEM_CATALOG,
          )
        ) {

          if (
            definition.sell
          ) {

            sellOneType(
              id,
            );
          }
        }
      }
    }

    else {

      sellOneType(
        requested,
      );
    }


    if (
      earned <=
      0
    ) {

      client.send(
        "toast",

        {
          text:
            "Nada para vender aqui.",
        },
      );


      return;
    }


    player.gold +=
      earned;


    this.setInventory(
      player,
      inventory,
    );


    this.persist(
      client.sessionId,
      true,
    );


    client.send(
      "toast",

      {
        text:
          `Venda concluída · +${earned} ouro`,
      },
    );
  }



  buy(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      return;
    }


    const context =
      this.resolveShopContext(
        player,
        payload?.source,
      );


    if (
      !context
    ) {

      return;
    }


    const id =
      String(
        payload?.kind
        ||
        "",
      );


    const definition =
      ITEM_CATALOG[
        id
      ];


    if (
      !definition
    ) {

      return;
    }


    const price =
      this.regionalShopPrice(
        client.sessionId,
        context,
        id,
        "buy",
      );


    if (
      price <=
      0
    ) {

      return;
    }


    if (
      definition.buyReq
    ) {

      const currentLevel =
        this.professionLevel(
          player,
          definition
            .buyReq
            .profession,
        );


      if (
        currentLevel <
        definition
          .buyReq
          .level
      ) {

        client.send(
          "toast",

          {
            text:
              `Requer ${
                definition
                  .buyReq
                  .profession
              } Nv.${
                definition
                  .buyReq
                  .level
              }.`,
          },
        );


        return;
      }
    }


    if (
      player.gold <
      price
    ) {

      client.send(
        "toast",

        {
          text:
            "Ouro insuficiente.",
        },
      );


      return;
    }


    const inventory =
      this.getInventory(
        player,
      );


    if (
      addItem(
        inventory,
        id,
        1,
      )
      >
      0
    ) {

      client.send(
        "toast",

        {
          text:
            "Inventário cheio.",
        },
      );


      return;
    }


    player.gold -=
      price;


    this.setInventory(
      player,
      inventory,
    );


    this.persist(
      client.sessionId,
      true,
    );


    client.send(
      "toast",

      {
        text:
          `Comprado: ${
            definition.label
          } · ${price} ouro`,
      },
    );
  }



  inventoryMove(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const inventory =
      this.getInventory(
        player,
      );


    moveWithin(
      inventory,

      Number(
        payload?.from,
      ),

      Number(
        payload?.to,
      ),
    );


    this.setInventory(
      player,
      inventory,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  chestMove(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
      ||
      this.distance(
        player,
        LOCATIONS.chest,
      )
      >
      3.5
    ) return;


    const chest =
      this.getChest(
        player,
      );


    moveWithin(
      chest,
      Number(
        payload?.from,
      ),
      Number(
        payload?.to,
      ),
    );


    this.setChest(
      player,
      chest,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  inventoryToChest(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const inventory =
      this.getInventory(
        player,
      );


    const chest =
      this.getChest(
        player,
      );


    transferBetween(
      inventory,
      chest,
      Number(
        payload?.from,
      ),
      Number(
        payload?.to,
      ),
    );


    this.setInventory(
      player,
      inventory,
    );


    this.setChest(
      player,
      chest,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  chestToInventory(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const inventory =
      this.getInventory(
        player,
      );


    const chest =
      this.getChest(
        player,
      );


    transferBetween(
      chest,
      inventory,
      Number(
        payload?.from,
      ),
      Number(
        payload?.to,
      ),
    );


    this.setInventory(
      player,
      inventory,
    );


    this.setChest(
      player,
      chest,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  hotbarAssign(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const inventory =
      this.getInventory(
        player,
      );


    const inventoryIndex =
      Math.floor(
        Number(
          payload?.inventoryIndex,
        ),
      );


    const hotbarIndex =
      Math.floor(
        Number(
          payload?.hotbarIndex,
        ),
      );


    if (
      inventoryIndex < 0
      ||
      inventoryIndex >=
      INVENTORY_SIZE
      ||
      hotbarIndex < 0
      ||
      hotbarIndex >=
      HOTBAR_SIZE
    ) return;


    const stack =
      inventory[
        inventoryIndex
      ];


    if (
      !stack
    ) return;


    const hotbar =
      this.getHotbar(
        player,
      );


    hotbar[
      hotbarIndex
    ] =
      stack.id;


    this.setHotbar(
      player,
      hotbar,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  useHotbar(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const hotbar =
      this.getHotbar(
        player,
      );


    const id =
      hotbar[
        Number(
          payload?.slot,
        )
      ];


    const definition =
      ITEM_CATALOG[
        id
      ];


    if (
      !definition
    ) return;


    if (
      definition.type !==
      "consumable"
      ||
      !definition.heal
    ) {

      return;
    }


    if (
      player.hp >=
      player.maxHp
    ) {

      return;
    }


    const inventory =
      this.getInventory(
        player,
      );


    if (
      !removeItem(
        inventory,
        id,
        1,
      )
    ) return;


    player.hp =
      Math.min(
        player.maxHp,

        player.hp +
        definition.heal,
      );


    this.setInventory(
      player,
      inventory,
    );


    this.persist(
      client.sessionId,
      true,
    );
  }


  addXp(
    player,
    amount,
  ) {

    player.xp +=
      amount;


    let needed =
      40
      +
      (
        player.level -
        1
      )
      *
      25;


    let leveled =
      false;


    while (
      player.xp >=
      needed
    ) {

      player.xp -=
        needed;


      player.level++;


      leveled =
        true;


      needed =
        40
        +
        (
          player.level -
          1
        )
        *
        25;
    }


    if (
      leveled
    ) {

      this.recalculateStats(
        player,
      );


      player.hp =
        player.maxHp;
    }
  }


  questRequirementsMet(
    states,
    quest,
  ) {

    for (
      const requirement
      of quest.requires
      ||
      []
    ) {

      if (
        states[
          requirement
        ]?.status !==
        "done"
      ) {

        return false;
      }
    }


    return true;
  }


  questAction(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) return;


    const questId =
      String(
        payload?.questId
        ||
        "",
      );


    const quest =
      QUESTS[
        questId
      ];


    if (
      !quest
    ) return;


    const location =
      LOCATIONS[
        quest.npc
      ];


    if (
      !location
      ||
      this.distance(
        player,
        location,
      )
      >
      3.5
    ) return;


    const states =
      this.getQuests(
        player,
      );


    if (
      payload?.action ===
      "accept"
    ) {

      if (
        states[
          questId
        ]
        ||
        !this.questRequirementsMet(
          states,
          quest,
        )
      ) return;


      const inventory =
        this.getInventory(
          player,
        );


      const progress =
        quest.objectives.map(
          (
            objective,
          ) => {

            if (
              objective.type ===
              "collect"
            ) {

              return Math.min(
                objective.amount,

                countItem(
                  inventory,
                  objective.target,
                ),
              );
            }


            if (
              objective.type ===
              "discover"
            ) {

              return this
                .getDiscoveries(
                  player,
                )
                .includes(
                  objective.target,
                )
                  ? objective.amount
                  : 0;
            }


            if (
              objective.type ===
              "landmark"
            ) {

              return this
                .getPlayerLandmarks(
                  client.sessionId,
                )
                .includes(
                  objective.target,
                )
                  ? objective.amount
                  : 0;
            }


            return 0;
          },
        );


      const ready =
        quest.objectives.every(
          (
            objective,
            index,
          ) =>
            (
              progress[
                index
              ]
              ||
              0
            )
            >=
            objective.amount,
        );


      states[
        questId
      ] = {

        status:
          ready
            ? "ready"
            : "active",

        progress,
      };


      this.setQuests(
        player,
        states,
      );


      this.persist(
        client.sessionId,
        true,
      );


      client.send(
        "open-quests",
        {
          npc:
            quest.npc,
        },
      );


      return;
    }


    if (
      payload?.action ===
      "claim"
      &&
      states[
        questId
      ]?.status ===
      "ready"
    ) {

      this.giveQuestReward(
        player,
        quest,
      );


      states[
        questId
      ].status =
        "done";


      this.setQuests(
        player,
        states,
      );


      this.persist(
        client.sessionId,
        true,
      );


      client.send(
        "toast",

        {
          text:
            `Missão concluída: ${
              quest.title
            }`,
        },
      );


      client.send(
        "open-quests",
        {
          npc:
            quest.npc,
        },
      );
    }
  }


  giveQuestReward(
    player,
    quest,
  ) {

    player.gold +=
      quest.reward?.gold
      ||
      0;


    this.addXp(
      player,
      quest.reward?.xp
      ||
      0,
    );


    const inventory =
      this.getInventory(
        player,
      );


    for (
      const reward
      of quest.reward?.items
      ||
      []
    ) {

      const remaining =
        addItem(
          inventory,
          reward.id,
          reward.qty,
          reward.rarity,
        );


      if (
        remaining >
        0
      ) {

        this.spawnDrop(
          reward.id,
          remaining,
          player.x,
          player.z,
          reward.rarity,
        );
      }
    }


    this.setInventory(
      player,
      inventory,
    );
  }


  questEvent(
    player,
    type,
    target,
    amount,
    client,
  ) {

    const states =
      this.getQuests(
        player,
      );


    let changed =
      false;


    for (
      const [
        id,
        state,
      ]
      of Object.entries(
        states,
      )
    ) {

      if (
        state?.status !==
        "active"
      ) continue;


      const quest =
        QUESTS[
          id
        ];


      if (
        !quest
      ) continue;


      if (
        !Array.isArray(
          state.progress,
        )
      ) {

        state.progress =
          quest.objectives.map(
            () => 0,
          );
      }


      quest.objectives.forEach(
        (
          objective,
          index,
        ) => {

          if (
            objective.type ===
            type
            &&
            objective.target ===
            target
          ) {

            state.progress[
              index
            ] =
              Math.min(
                objective.amount,

                (
                  state.progress[
                    index
                  ]
                  ||
                  0
                )
                +
                amount,
              );


            changed =
              true;
          }
        },
      );


      if (
        quest.objectives.every(
          (
            objective,
            index,
          ) =>
            (
              state.progress[
                index
              ]
              ||
              0
            )
            >=
            objective.amount,
        )
      ) {

        state.status =
          "ready";


        changed =
          true;
      }
    }


    if (
      changed
    ) {

      this.setQuests(
        player,
        states,
      );
    }


    this.regionalContractEvent(
      player,
      type,
      target,
      amount,
      client,
    );
  }


  findNearestResource(
    x,
    z,
    radius,
  ) {

    let result =
      null;


    this.state.nodes.forEach(
      (
        node,
        id,
      ) => {

        if (
          !node.active
        ) return;


        const distance =
          Math.hypot(
            node.x -
            x,

            node.z -
            z,
          );


        if (
          distance <=
          radius
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
            node,
            distance,
          };
        }
      },
    );


    return result;
  }


  findNearestEnemy(
    x,
    z,
    radius,
  ) {

    let result =
      null;


    this.state.enemies.forEach(
      (
        enemy,
        id,
      ) => {

        if (
          !enemy.alive
        ) return;


        const distance =
          Math.hypot(
            enemy.x -
            x,

            enemy.z -
            z,
          );


        if (
          distance <=
          radius
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
            enemy,
            distance,
          };
        }
      },
    );


    return result;
  }


  findNearestDrop(
    x,
    z,
    radius,
  ) {

    let result =
      null;


    this.state.drops.forEach(
      (
        item,
        id,
      ) => {

        const distance =
          Math.hypot(
            item.x -
            x,

            item.z -
            z,
          );


        if (
          distance <=
          radius
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
            item,
            distance,
          };
        }
      },
    );


    return result;
  }


  findNearestFarmPlot(
    x,
    z,
    radius,
  ) {

    let result =
      null;


    this.state.farmPlots.forEach(
      (
        plot,
        id,
      ) => {

        const distance =
          Math.hypot(
            plot.x -
            x,

            plot.z -
            z,
          );


        if (
          distance <=
          radius
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
            plot,
            distance,
          };
        }
      },
    );


    return result;
  }


  cleanName(
    value,
  ) {

    const raw =
      typeof value ===
      "string"
        ? value.trim()
        : "";


    return (
      raw
        .replace(
          /[^\p{L}\p{N}_ -]/gu,
          "",
        )
        .slice(
          0,
          18,
        )
      ||
      "Aventureiro"
    );
  }


  cleanProfile(
    value,
  ) {

    const raw =
      typeof value ===
      "string"
        ? value
        : "";


    if (
      /^[A-Za-z0-9-]{8,80}$/
        .test(
          raw,
        )
    ) {

      return raw;
    }


    return (
      `guest-${
        Math.random()
          .toString(36)
          .slice(2)
      }-${
        Date.now()
      }`
    );
  }


  migrateInventory(
    save,
  ) {

    if (
      Array.isArray(
        save?.inventory,
      )
    ) {

      return sanitizeSlots(
        save.inventory,
        INVENTORY_SIZE,
      );
    }


    const inventory =
      emptySlots(
        INVENTORY_SIZE,
      );


    addItem(
      inventory,
      "axe",
      1,
    );


    addItem(
      inventory,
      "pickaxe",
      1,
    );


    return inventory;
  }


  onJoin(
    client,
    options,
  ) {

    console.log(
      "[JOIN] 1/5 - pedido recebido",
      client.sessionId,
    );


    const name =
      this.cleanName(
        options?.name,
      );


    const profileId =
      this.cleanProfile(
        options?.profileId,
      );


    const save =
      this.saves[
        profileId
      ]
      ||
      {};


    console.log(
      "[JOIN] 2/5 - perfil e save carregados",
      {
        sessionId:
          client.sessionId,

        profileId,

        name,
      },
    );


    const inventory =
      this.migrateInventory(
        save,
      );


    const chest =
      sanitizeSlots(
        save.chest,
        CHEST_SIZE,
      );


    const equipment =
      sanitizeEquipment(
        save.equipment,
      );


    const professions =
      sanitizeProfessions(
        save.professions,
      );


    const player =
      new Player(
        {
          name,

          x:
            Number.isFinite(
              save.x,
            )
              ? save.x
              : 0,

          z:
            Number.isFinite(
              save.z,
            )
              ? save.z
              : 1,

          hp:
            Number.isFinite(
              save.hp,
            )
              ? save.hp
              : 100,

          maxHp:
            100,

          attack:
            2,

          defense:
            0,

          level:
            Number.isFinite(
              save.level,
            )
              ? Math.max(
                  1,
                  save.level,
                )
              : 1,

          xp:
            Number.isFinite(
              save.xp,
            )
              ? save.xp
              : 0,

          gold:
            Number.isFinite(
              save.gold,
            )
              ? save.gold
              : 0,

          inventoryJson:
            JSON.stringify(
              inventory,
            ),

          chestJson:
            JSON.stringify(
              chest,
            ),

          hotbarJson:
            JSON.stringify(
              Array.isArray(
                save.hotbar,
              )
                ? save.hotbar
                : [
                    "axe",
                    "pickaxe",
                    null,
                    null,
                    null,
                  ],
            ),

          equipmentJson:
            JSON.stringify(
              equipment,
            ),

          questsJson:
            JSON.stringify(
              save.quests
              &&
              typeof save.quests ===
                "object"
                ? save.quests
                : {},
            ),

          professionsJson:
            JSON.stringify(
              professions,
            ),

          discoveriesJson:
            JSON.stringify(
              Array.isArray(
                save.discoveries,
              )
                ? save.discoveries
                : [],
            ),
        },
      );


    console.log(
      "[JOIN] 3/5 - Player criado",
      {
        sessionId:
          client.sessionId,

        name,
      },
    );


    this.state.players.set(
      client.sessionId,
      player,
    );


    console.log(
      "[JOIN] 4/5 - Player registrado no estado",
      client.sessionId,
    );


    this.playerInputs.set(
      client.sessionId,
      {
        ...EMPTY_INPUT,
      },
    );


    this.profiles.set(
      client.sessionId,
      profileId,
    );


    /*
     * A exploração é carregada DEPOIS que o Player normal
     * já foi criado e registrado.
     */

    this.playerLandmarks.set(

      client.sessionId,

      new Set(
        this.sanitizeLandmarks(
          save.landmarks,
        ),
      ),
    );


    this.recalculateStats(
      player,
    );


    player.hp =
      Math.min(
        player.hp,
        player.maxHp,
      );


    this.persist(
      client.sessionId,
      true,
    );


    console.log(
      "[JOIN] 5/5 - entrada concluída",
      {
        sessionId:
          client.sessionId,

        name,

        landmarks:
          this.getPlayerLandmarks(
            client.sessionId,
          ).length,
      },
    );


    console.log(
      `✅ ${name} entrou`,
    );
  }


  onLeave(
    client,
  ) {

    this.persist(
      client.sessionId,
      true,
    );


    this.playerInputs.delete(
      client.sessionId,
    );


    this.actionCooldown.delete(
      client.sessionId,
    );


    this.fishingCooldown.delete(
      client.sessionId,
    );


    this.playerAttackTimes.delete(
      client.sessionId,
    );


    this.profiles.delete(
      client.sessionId,
    );


    this.playerRegions.delete(
      client.sessionId,
    );


    this.playerLandmarks.delete(
      client.sessionId,
    );


    this.state.players.delete(
      client.sessionId,
    );
  }


  getRegionalProgress(
    sessionId,
  ) {

    const profile =
      this.profiles.get(
        sessionId,
      );


    if (
      !profile
    ) {

      return normalizeRegionalProgress(
        {},
      );
    }


    if (
      !this.saves[
        profile
      ]
    ) {

      this.saves[
        profile
      ] =
        {};
    }


    const progress =
      normalizeRegionalProgress(

        this.saves[
          profile
        ]?.regionalProgress,

        Date.now(),
      );


    this.saves[
      profile
    ].regionalProgress =
      progress;


    return progress;
  }


  setRegionalProgress(
    sessionId,
    progress,
  ) {

    const profile =
      this.profiles.get(
        sessionId,
      );


    if (
      !profile
    ) {

      return;
    }


    if (
      !this.saves[
        profile
      ]
    ) {

      this.saves[
        profile
      ] =
        {};
    }


    this.saves[
      profile
    ].regionalProgress =
      normalizeRegionalProgress(
        progress,
        Date.now(),
      );
  }


  sendRegionalProgressState(
    client,
  ) {

    client.send(
      "regional-progress-state",

      {

        progress:
          this.getRegionalProgress(
            client.sessionId,
          ),

        event:
          regionalEventAt(
            Date.now(),
          ),
      },
    );
  }


  regionalBoardNpcValid(
    player,
    region,
  ) {

    const requiredNpc =
      REGION_BOARD_NPC[
        region
      ];


    if (
      !requiredNpc
    ) {

      return false;
    }


    const nearest =
      this.findNearestRegionalNpc(
        player.x,
        player.z,
        3.2,
      );


    return (
      nearest?.id ===
      requiredNpc
    );
  }


  sendRegionalBoard(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      return;
    }


    const npcId =
      String(
        payload?.npc
        ||
        "",
      );


    const npc =
      REGIONAL_NPCS[
        npcId
      ];


    if (
      !npc
      ||
      REGION_BOARD_NPC[
        npc.region
      ] !==
      npcId
    ) {

      return;
    }


    const nearest =
      this.findNearestRegionalNpc(
        player.x,
        player.z,
        3.2,
      );


    if (
      nearest?.id !==
      npcId
    ) {

      client.send(
        "toast",

        {
          text:
            "Aproxime-se do representante regional.",
        },
      );


      return;
    }


    const now =
      Date.now();


    client.send(
      "regional-board-state",

      {

        npc:
          npcId,

        region:
          npc.region,

        dayKey:
          contractDayKey(
            now,
          ),

        contractIds:
          contractsForRegion(
            npc.region,
            now,
          )
            .map(
              contract =>
                contract.id,
            ),

        progress:
          this.getRegionalProgress(
            client.sessionId,
          ),

        event:
          regionalEventAt(
            now,
          ),
      },
    );
  }


  regionalContractAction(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      return;
    }


    const contractId =
      String(
        payload?.contractId
        ||
        "",
      );


    const action =
      String(
        payload?.action
        ||
        "",
      );


    const contract =
      REGIONAL_CONTRACT_BY_ID[
        contractId
      ];


    if (
      !contract
    ) {

      return;
    }


    if (
      !this.regionalBoardNpcValid(
        player,
        contract.region,
      )
    ) {

      client.send(
        "toast",

        {
          text:
            "Volte ao representante da região.",
        },
      );


      return;
    }


    const now =
      Date.now();


    const today =
      contractDayKey(
        now,
      );


    const board =
      contractsForRegion(
        contract.region,
        now,
      );


    const progress =
      this.getRegionalProgress(
        client.sessionId,
      );


    if (
      action ===
      "accept"
    ) {

      if (
        !board.some(
          item =>
            item.id ===
            contractId,
        )
      ) {

        return;
      }


      if (
        progress.completedDays[
          contractId
        ] ===
        today
      ) {

        client.send(
          "toast",

          {
            text:
              "Contrato já concluído hoje.",
          },
        );


        return;
      }


      if (
        progress.contracts[
          contractId
        ]
      ) {

        return;
      }


      progress.contracts[
        contractId
      ] = {

        dayKey:
          today,

        progress:
          0,

        status:
          "active",
      };


      this.setRegionalProgress(
        client.sessionId,
        progress,
      );


      this.persist(
        client.sessionId,
        true,
      );


      client.send(
        "toast",

        {
          text:
            `Contrato aceito: ${
              contract.title
            }`,
        },
      );
    }


    else if (
      action ===
      "claim"
    ) {

      const state =
        progress.contracts[
          contractId
        ];


      if (
        !state
        ||
        state.status !==
        "ready"
      ) {

        return;
      }


      player.gold +=
        contract.reward.gold;


      this.addXp(
        player,
        contract.reward.xp,
      );


      progress.reputation[
        contract.region
      ] =
        Math.max(
          0,

          Number(
            progress.reputation[
              contract.region
            ],
          )
          ||
          0,
        )
        +
        contract.reward.reputation;


      delete progress.contracts[
        contractId
      ];


      progress.completedDays[
        contractId
      ] =
        today;


      this.setRegionalProgress(
        client.sessionId,
        progress,
      );


      this.persist(
        client.sessionId,
        true,
      );


      client.send(
        "toast",

        {
          text:
            `Contrato concluído · +${
              contract.reward.gold
            } ouro · +${
              contract.reward.reputation
            } reputação`,
        },
      );
    }

    else {

      return;
    }


    this.sendRegionalProgressState(
      client,
    );


    this.sendRegionalBoard(
      client,

      {
        npc:
          REGION_BOARD_NPC[
            contract.region
          ],
      },
    );
  }


  regionalEventClaim(
    client,
    payload,
  ) {

    const player =
      this.state.players.get(
        client.sessionId,
      );


    if (
      !player
    ) {

      return;
    }


    const event =
      regionalEventAt(
        Date.now(),
      );


    const expectedNpc =
      REGION_BOARD_NPC[
        event.region
      ];


    if (
      String(
        payload?.npc
        ||
        "",
      )
      !==
      expectedNpc
      ||
      !this.regionalBoardNpcValid(
        player,
        event.region,
      )
    ) {

      return;
    }


    const progress =
      this.getRegionalProgress(
        client.sessionId,
      );


    if (
      progress.event.key !==
      event.key
      ||
      progress.event.claimed
      ||
      progress.event.progress <
      event.amount
    ) {

      return;
    }


    player.gold +=
      event.reward.gold;


    this.addXp(
      player,
      event.reward.xp,
    );


    progress.reputation[
      event.region
    ] =
      Math.max(
        0,

        Number(
          progress.reputation[
            event.region
          ],
        )
        ||
        0,
      )
      +
      event.reward.reputation;


    progress.event.claimed =
      true;


    this.setRegionalProgress(
      client.sessionId,
      progress,
    );


    this.persist(
      client.sessionId,
      true,
    );


    client.send(
      "toast",

      {
        text:
          `Evento concluído · +${
            event.reward.gold
          } ouro · +${
            event.reward.reputation
          } reputação`,
      },
    );


    this.sendRegionalProgressState(
      client,
    );


    this.sendRegionalBoard(
      client,

      {
        npc:
          expectedNpc,
      },
    );
  }


  regionalContractEvent(
    player,
    type,
    target,
    amount,
    client,
  ) {

    if (
      !client
      ||
      amount <=
      0
    ) {

      return;
    }


    const sessionId =
      client.sessionId;


    const now =
      Date.now();


    const today =
      contractDayKey(
        now,
      );


    const region =
      getRegionAt(
        player.x,
        player.z,
      );


    const progress =
      this.getRegionalProgress(
        sessionId,
      );


    let changed =
      false;


    for (
      const [
        id,
        state,
      ]
      of Object.entries(
        progress.contracts,
      )
    ) {

      const contract =
        REGIONAL_CONTRACT_BY_ID[
          id
        ];


      if (
        !contract
        ||
        state.dayKey !==
        today
        ||
        state.status !==
        "active"
        ||
        contract.region !==
        region
        ||
        contract.type !==
        type
        ||
        contract.target !==
        target
      ) {

        continue;
      }


      state.progress =
        Math.min(
          contract.amount,

          state.progress
          +
          amount,
        );


      if (
        state.progress >=
        contract.amount
      ) {

        state.status =
          "ready";


        client.send(
          "toast",

          {
            text:
              `Contrato pronto: ${
                contract.title
              }`,
          },
        );
      }


      changed =
        true;
    }


    const event =
      regionalEventAt(
        now,
      );


    if (
      progress.event.key !==
      event.key
    ) {

      progress.event = {

        key:
          event.key,

        progress:
          0,

        claimed:
          false,
      };


      changed =
        true;
    }


    if (
      type ===
      "kill"
      &&
      target ===
      event.target
      &&
      region ===
      event.region
      &&
      !progress.event.claimed
      &&
      progress.event.progress <
      event.amount
    ) {

      progress.event.progress =
        Math.min(
          event.amount,

          progress.event.progress
          +
          amount,
        );


      changed =
        true;


      if (
        progress.event.progress >=
        event.amount
      ) {

        client.send(
          "toast",

          {
            text:
              `Evento pronto: ${
                event.title
              }`,
          },
        );
      }
    }


    if (
      changed
    ) {

      this.setRegionalProgress(
        sessionId,
        progress,
      );


      this.sendRegionalProgressState(
        client,
      );
    }
  }


  persist(
    sessionId,
    flush =
      false,
  ) {

    const player =
      this.state.players.get(
        sessionId,
      );


    const profile =
      this.profiles.get(
        sessionId,
      );


    if (
      !player
      ||
      !profile
    ) return;


    this.saves[
      profile
    ] = {

      saveVersion:
        13,

      name:
        player.name,

      x:
        player.x,

      z:
        player.z,

      hp:
        player.hp,

      level:
        player.level,

      xp:
        player.xp,

      gold:
        player.gold,

      inventory:
        this.getInventory(
          player,
        ),

      chest:
        this.getChest(
          player,
        ),

      hotbar:
        this.getHotbar(
          player,
        ),

      equipment:
        this.getEquipment(
          player,
        ),

      quests:
        this.getQuests(
          player,
        ),

      professions:
        this.getProfessions(
          player,
        ),

      discoveries:
        this.getDiscoveries(
          player,
        ),

      landmarks:
        this.getPlayerLandmarks(
          sessionId,
        ),

      regionalProgress:
        this.getRegionalProgress(
          sessionId,
        ),
    };


    if (
      flush
    ) {

      this.flush();
    }
  }


  saveAll() {

    this.state.players.forEach(
      (
        _player,
        sessionId,
      ) =>
        this.persist(
          sessionId,
          false,
        ),
    );


    this.flush();
  }


  flush() {

    try {

      mkdirSync(
        DATA_DIR,
        {
          recursive:
            true,
        },
      );


      writeFileSync(
        SAVE_FILE,

        JSON.stringify(
          this.saves,
          null,
          2,
        ),

        "utf8",
      );
    }

    catch (
      error
    ) {

      console.error(
        "Erro ao salvar:",
        error,
      );
    }
  }


  onDispose() {

    this.saveAll();

    this.saveWorld(
      "dispose",
    );
  }
}
