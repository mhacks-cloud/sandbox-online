// @ts-nocheck

import {
  schema,
  t,
  type SchemaType,
} from "@colyseus/schema";


export const Player = schema(
  {
    name:
      t.string(),

    x:
      t.number().default(0),

    z:
      t.number().default(0),

    hp:
      t.uint16().default(100),

    maxHp:
      t.uint16().default(100),

    attack:
      t.uint16().default(2),

    defense:
      t.uint16().default(0),

    level:
      t.uint16().default(1),

    xp:
      t.uint32().default(0),

    gold:
      t.uint32().default(0),

    direction:
      t.uint8().default(0),

    moving:
      t.boolean().default(false),

    inventoryJson:
      t.string().default("[]"),

    chestJson:
      t.string().default("[]"),

    hotbarJson:
      t.string().default("[]"),

    equipmentJson:
      t.string().default("{}"),

    questsJson:
      t.string().default("{}"),

    professionsJson:
      t.string().default("{}"),
  },

  "Player",
);


export const ResourceNode = schema(
  {
    kind:
      t.string(),

    x:
      t.number(),

    z:
      t.number(),

    hp:
      t.uint8(),

    maxHp:
      t.uint8(),

    active:
      t.boolean().default(true),

    respawnAt:
      t.number().default(0),
  },

  "ResourceNode",
);


export const WorldDrop = schema(
  {
    kind:
      t.string(),

    amount:
      t.uint16(),

    rarity:
      t.string().default("common"),

    x:
      t.number(),

    z:
      t.number(),
  },

  "WorldDrop",
);


export const Enemy = schema(
  {
    kind:
      t.string(),

    x:
      t.number(),

    z:
      t.number(),

    hp:
      t.uint16(),

    maxHp:
      t.uint16(),

    level:
      t.uint8().default(1),

    alive:
      t.boolean().default(true),

    moving:
      t.boolean().default(false),

    respawnAt:
      t.number().default(0),
  },

  "Enemy",
);


export const FarmPlot = schema(
  {
    x:
      t.number(),

    z:
      t.number(),

    crop:
      t.string().default(""),

    stage:
      t.uint8().default(0),

    plantedAt:
      t.number().default(0),

    readyAt:
      t.number().default(0),
  },

  "FarmPlot",
);


export const MyRoomState = schema(
  {
    players:
      t.map(Player),

    nodes:
      t.map(ResourceNode),

    drops:
      t.map(WorldDrop),

    enemies:
      t.map(Enemy),

    farmPlots:
      t.map(FarmPlot),
  },

  "MyRoomState",
);


export type MyRoomState =
  SchemaType<typeof MyRoomState>;
