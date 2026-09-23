// @ts-nocheck

import {
  WORLD_BOUNDS,
  LANDMARKS,
} from "./gameData";

import {
  CAVES,
} from "./caves";


export const PLAYER_COLLISION_RADIUS =
  .42;


/*
 * ============================================================
 * COLISORES ESTÁTICOS DO MUNDO
 * ============================================================
 */

export const WORLD_STATIC_COLLIDERS = [

  /*
   * CASAS DA VILA
   */

  /*
   * ETAPA 19 — FOOTPRINT 2D
   *
   * No sprite Tiny Swords o ponto X/Z representa
   * a base/frente da construção.
   *
   * Portanto o colisor fica somente na parte inferior
   * do prédio, não no telhado inteiro.
   */

  {
    id: "village_house_nw",
    shape: "aabb",
    x: -13,
    z: -12.82,
    halfX: 1.55,
    halfZ: .62,
  },

  {
    id: "village_house_ne",
    shape: "aabb",
    x: 13,
    z: -11.82,
    halfX: 1.55,
    halfZ: .62,
  },

  {
    id: "village_house_sw",
    shape: "aabb",
    x: -14,
    z: 12.18,
    halfX: 1.55,
    halfZ: .62,
  },

  {
    id: "village_house_se",
    shape: "aabb",
    x: 14,
    z: 8.18,
    halfX: 1.55,
    halfZ: .62,
  },


  /*
   * POÇO
   */

  {
    id: "village_well",
    shape: "circle",
    x: -4,
    z: 7,
    radius: 1.1,
  },


  /*
   * CERCA DA FAZENDA
   */

  {
    id: "farm_fence_left",
    shape: "aabb",
    x: -16.4,
    z: 7,
    halfX: .12,
    halfZ: 4.5,
  },

  {
    id: "farm_fence_bottom",
    shape: "aabb",
    x: -13.5,
    z: 2.5,
    halfX: 3,
    halfZ: .12,
  },


  /*
   * POSTES
   */

  ...[
    [-4,3],
    [4,3],
    [-2,-5],
    [2,-5],
    [-2,10],
    [2,10],
  ].map(
    (
      [
        x,
        z,
      ],
      index,
    ) => ({
      id:
        `village_lamp_${index}`,

      shape:
        "circle",

      x,

      z,

      radius:
        .18,
    }),
  ),


  /*
   * LAGOS
   *
   * Só o miolo profundo é sólido.
   * A borda continua acessível para pesca.
   */

  {
    id: "village_lake",
    shape: "ellipse",
    x: 14,
    z: 14,
    radiusX: 3,
    radiusZ: 1.9,
  },

  {
    id: "deep_lake",
    shape: "ellipse",
    x: -30,
    z: 34,
    radiusX: 2.35,
    radiusZ: 1.45,
  },

  {
    id: "silver_lake",
    shape: "ellipse",
    x: 34,
    z: -34,
    radiusX: 2.35,
    radiusZ: 1.45,
  },


  /*
   * PEDRAS DECORATIVAS DA ETAPA 16
   */

  {
    id: "decor_village_01",
    shape: "circle",
    x: -15,
    z: -15,
    radius: .85,
  },

  {
    id: "decor_village_02",
    shape: "circle",
    x: 15,
    z: -9,
    radius: .85,
  },

  {
    id: "decor_forest_01",
    shape: "circle",
    x: -35,
    z: -12,
    radius: .9,
  },

  {
    id: "decor_forest_02",
    shape: "circle",
    x: -44,
    z: -29,
    radius: .9,
  },

  {
    id: "decor_copper_01",
    shape: "circle",
    x: 35,
    z: 19,
    radius: .9,
  },

  {
    id: "decor_copper_02",
    shape: "circle",
    x: 44,
    z: 34,
    radius: .9,
  },

  {
    id: "decor_silver_01",
    shape: "circle",
    x: 34,
    z: -21,
    radius: .9,
  },

  {
    id: "decor_silver_02",
    shape: "circle",
    x: 44,
    z: -39,
    radius: .9,
  },

];


/*
 * ============================================================
 * LANDMARKS
 * ============================================================
 */

function landmarkCollider(
  id,
  landmark,
) {

  if (
    !landmark
    ||
    landmark.type ===
    "mine"
  ) {

    return null;
  }


  if (
    landmark.type ===
    "outpost"
  ) {

    return {
      id: `landmark_${id}`,
      shape: "aabb",
      x: landmark.x,
      z: landmark.z,
      halfX: 1,
      halfZ: 1,
    };
  }


  if (
    landmark.type ===
    "tower"
  ) {

    return {
      id: `landmark_${id}`,
      shape: "circle",
      x: landmark.x,
      z: landmark.z,
      radius: .55,
    };
  }


  if (
    landmark.type ===
    "shrine"
  ) {

    return {
      id: `landmark_${id}`,
      shape: "circle",
      x: landmark.x,
      z: landmark.z,
      radius: .58,
    };
  }


  if (
    landmark.type ===
    "ruins"
  ) {

    return {
      id: `landmark_${id}`,
      shape: "circle",
      x: landmark.x,
      z: landmark.z,
      radius: .65,
    };
  }


  if (
    landmark.type ===
    "waystone"
  ) {

    return {
      id: `landmark_${id}`,
      shape: "circle",
      x: landmark.x,
      z: landmark.z,
      radius: .28,
    };
  }


  return null;
}


export const LANDMARK_COLLIDERS =
  Object.entries(
    LANDMARKS,
  )
    .map(
      (
        [
          id,
          landmark,
        ],
      ) =>
        landmarkCollider(
          id,
          landmark,
        ),
    )
    .filter(
      Boolean,
    );


/*
 * ============================================================
 * CAVERNAS
 * ============================================================
 */

const CAVE_ROCK_OFFSETS = [

  [-9,-7,.9],
  [8,-5,.78],
  [-10,5,.82],
  [9,7,.95],
  [-5,-10,.6],
  [6,9,.55],

];


export function caveStaticColliders(
  caveId,
) {

  const cave =
    CAVES[
      caveId
    ];


  if (
    !cave
  ) {

    return [];
  }


  const result =
    CAVE_ROCK_OFFSETS.map(
      (
        [
          ox,
          oz,
          radius,
        ],
        index,
      ) => ({
        id:
          `${caveId}_rock_${index}`,

        shape:
          "circle",

        x:
          cave.interior.centerX
          +
          ox,

        z:
          cave.interior.centerZ
          +
          oz,

        radius,
      }),
    );


  result.push(
    {
      id:
        `${caveId}_chest`,

      shape:
        "aabb",

      x:
        cave.chest.x,

      z:
        cave.chest.z,

      halfX:
        .68,

      halfZ:
        .48,
    },
  );


  return result;
}


/*
 * ============================================================
 * GEOMETRIA
 * ============================================================
 */

export function colliderBlocksPoint(
  collider,
  x,
  z,
  playerRadius =
    PLAYER_COLLISION_RADIUS,
) {

  if (
    collider.shape ===
    "circle"
  ) {

    return (
      Math.hypot(
        x -
        collider.x,

        z -
        collider.z,
      )
      <
      (
        collider.radius
        +
        playerRadius
      )
    );
  }


  if (
    collider.shape ===
    "ellipse"
  ) {

    const rx =
      collider.radiusX
      +
      playerRadius;


    const rz =
      collider.radiusZ
      +
      playerRadius;


    const dx =
      (
        x -
        collider.x
      )
      /
      rx;


    const dz =
      (
        z -
        collider.z
      )
      /
      rz;


    return (
      dx *
      dx
      +
      dz *
      dz
    )
    <
    1;
  }


  if (
    collider.shape ===
    "aabb"
  ) {

    const dx =
      Math.max(
        Math.abs(
          x -
          collider.x,
        )
        -
        collider.halfX,

        0,
      );


    const dz =
      Math.max(
        Math.abs(
          z -
          collider.z,
        )
        -
        collider.halfZ,

        0,
      );


    return (
      dx *
      dx
      +
      dz *
      dz
    )
    <
    (
      playerRadius *
      playerRadius
    );
  }


  return false;
}


export function staticCollidersFor(
  caveId =
    "",
) {

  if (
    caveId
    &&
    CAVES[
      caveId
    ]
  ) {

    return caveStaticColliders(
      caveId,
    );
  }


  return [
    ...WORLD_STATIC_COLLIDERS,
    ...LANDMARK_COLLIDERS,
  ];
}


export function isStaticBlocked(
  x,
  z,
  caveId =
    "",
) {

  for (
    const collider
    of staticCollidersFor(
      caveId,
    )
  ) {

    if (
      colliderBlocksPoint(
        collider,
        x,
        z,
      )
    ) {

      return true;
    }
  }


  return false;
}


/*
 * ============================================================
 * LIMITES
 * ============================================================
 */

export function movementBoundsFor(
  caveId =
    "",
) {

  const cave =
    CAVES[
      caveId
    ];


  if (
    cave
  ) {

    return {
      minX:
        cave.interior.bounds.minX
        +
        PLAYER_COLLISION_RADIUS,

      maxX:
        cave.interior.bounds.maxX
        -
        PLAYER_COLLISION_RADIUS,

      minZ:
        cave.interior.bounds.minZ
        +
        PLAYER_COLLISION_RADIUS,

      maxZ:
        cave.interior.bounds.maxZ
        -
        PLAYER_COLLISION_RADIUS,
    };
  }


  return {
    minX:
      -WORLD_BOUNDS
      +
      PLAYER_COLLISION_RADIUS,

    maxX:
      WORLD_BOUNDS
      -
      PLAYER_COLLISION_RADIUS,

    minZ:
      -WORLD_BOUNDS
      +
      PLAYER_COLLISION_RADIUS,

    maxZ:
      WORLD_BOUNDS
      -
      PLAYER_COLLISION_RADIUS,
  };
}


function clamp(
  value,
  min,
  max,
) {

  return Math.max(
    min,

    Math.min(
      max,
      value,
    ),
  );
}


/*
 * ============================================================
 * RESOLUÇÃO DE MOVIMENTO
 * ============================================================
 */

export function resolvePlayerMovement(
  currentX,
  currentZ,
  deltaX,
  deltaZ,
  options =
    {},
) {

  const caveId =
    String(
      options?.caveId
      ||
      "",
    );


  const dynamicBlocked =
    typeof options?.dynamicBlocked ===
      "function"
      ? options.dynamicBlocked
      : () =>
          false;


  const bounds =
    movementBoundsFor(
      caveId,
    );


  let x =
    clamp(
      currentX,
      bounds.minX,
      bounds.maxX,
    );


  let z =
    clamp(
      currentZ,
      bounds.minZ,
      bounds.maxZ,
    );


  const blockedAt =
    (
      px,
      pz,
    ) =>
      isStaticBlocked(
        px,
        pz,
        caveId,
      )
      ||
      dynamicBlocked(
        px,
        pz,
      );


  let escaping =
    blockedAt(
      x,
      z,
    );


  /*
   * Primeiro X.
   */

  const nextX =
    clamp(
      x +
      deltaX,
      bounds.minX,
      bounds.maxX,
    );


  if (
    escaping
    ||
    !blockedAt(
      nextX,
      z,
    )
  ) {

    x =
      nextX;
  }


  escaping =
    blockedAt(
      x,
      z,
    );


  /*
   * Depois Z.
   */

  const nextZ =
    clamp(
      z +
      deltaZ,
      bounds.minZ,
      bounds.maxZ,
    );


  if (
    escaping
    ||
    !blockedAt(
      x,
      nextZ,
    )
  ) {

    z =
      nextZ;
  }


  return {
    x,
    z,

    moved:
      Math.hypot(
        x -
        currentX,

        z -
        currentZ,
      )
      >
      .00001,
  };
}


/*
 * ============================================================
 * RECURSOS
 * ============================================================
 */

export function resourceCollisionRadius(
  kind,
) {

  switch (
    kind
  ) {

    /*
     * ETAPA 19 — FOOTPRINTS 2D
     *
     * Colisão agora representa tronco/base,
     * e não toda a copa/sprite.
     */

    case "tree":
      return .40;

    case "hard_tree":
      return .46;

    case "rock":
      return .36;

    case "ore":
      return .40;

    case "copper_ore":
      return .42;

    case "silver_ore":
      return .42;

    default:
      return 0;
  }
}
