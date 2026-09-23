// @ts-nocheck

import * as THREE
from "three";

import {
  REGION_ORDER,
  REGIONS,
}
from "../shared/gameData";

import {
  setupTopDownSprite,
}
from "./topDown2D";


const ROOT =
  "/assets/vendor";


const loader =
  new THREE.TextureLoader();


const textureCache =
  new Map();


const imageCache =
  new Map();


const bindings =
  new Set();



const HEROES = [

  "soldier",

  "knight",

  "knight-templar",

  "swordsman",

  "lancer",

  "archer",

  "wizard",

  "priest",

  "armored-axeman",

];



const NPCS = {

  merchant:
    "wizard",

  lina:
    "priest",

  hunter:
    "archer",

  blacksmith:
    "armored-axeman",

  fisherman:
    "lancer",

  farmer:
    "soldier",

  cook:
    "swordsman",


  teo:
    "soldier",

  runa:
    "archer",

  sena:
    "priest",

  dario:
    "armored-axeman",

  eira:
    "knight-templar",

  miro:
    "wizard",

};



const ENEMIES = {

  slime:
    "slime",

  wolf:
    "werewolf",

  boar:
    "werebear",

  swamp_spider:
    "spider",

  goblin:
    "spear-goblin",

  bandit:
    "thief",

  wraith:
    "skull",

};



function hashString(
  value,
) {

  let hash =
    2166136261;


  for (
    const character
    of String(
      value
      ||
      ""
    )
  ) {

    hash ^=
      character.charCodeAt(
        0,
      );


    hash =
      Math.imul(
        hash,
        16777619,
      );
  }


  return Math.abs(
    hash,
  );
}



export function playerAppearance(
  value,
) {

  return HEROES[
    hashString(
      value,
    )
    %
    HEROES.length
  ];
}



export function npcAppearance(
  id,
) {

  return NPCS[
    String(
      id
      ||
      ""
    )
  ]
  ||
  "soldier";
}



export function enemyAppearance(
  kind,
) {

  return ENEMIES[
    String(
      kind
      ||
      ""
    )
  ]
  ||
  "orc";
}



function characterUrl(
  appearance,
  action,
) {

  return (
    `${ROOT}/characters/`
    +
    `${appearance}/`
    +
    `${action}.png`
  );
}



function loadTexture(
  url,
) {

  if (
    textureCache.has(
      url,
    )
  ) {

    return textureCache.get(
      url,
    );
  }


  const promise =
    new Promise(
      (
        resolve,
      ) => {

        loader.load(

          url,

          (
            texture,
          ) => {

            texture.magFilter =
              THREE.NearestFilter;


            texture.minFilter =
              THREE.NearestFilter;


            texture.generateMipmaps =
              false;


            texture.colorSpace =
              THREE.SRGBColorSpace;


            resolve(
              texture,
            );
          },

          undefined,

          () =>
            resolve(
              null,
            ),
        );
      },
    );


  textureCache.set(
    url,
    promise,
  );


  return promise;
}



function loadImage(
  url,
) {

  if (
    imageCache.has(
      url,
    )
  ) {

    return imageCache.get(
      url,
    );
  }


  const promise =
    new Promise(
      (
        resolve,
      ) => {

        const image =
          new Image();


        image.onload =
          () =>
            resolve(
              image,
            );


        image.onerror =
          () =>
            resolve(
              null,
            );


        image.src =
          url;
      },
    );


  imageCache.set(
    url,
    promise,
  );


  return promise;
}



function cloneStripTexture(
  base,
) {

  const texture =
    base.clone();


  texture.image =
    base.image;


  texture.magFilter =
    THREE.NearestFilter;


  texture.minFilter =
    THREE.NearestFilter;


  texture.generateMipmaps =
    false;


  texture.colorSpace =
    THREE.SRGBColorSpace;


  texture.needsUpdate =
    true;


  return texture;
}



async function loadCharacterAction(
  binding,
  action,
) {

  const base =
    await loadTexture(
      characterUrl(
        binding.appearance,
        action,
      ),
    );


  if (
    !base
    ||
    !base.image
  ) {

    return;
  }


  const width =
    base.image.naturalWidth
    ||
    base.image.width
    ||
    1;


  const height =
    base.image.naturalHeight
    ||
    base.image.height
    ||
    1;


  const frames =
    Math.max(
      1,

      Math.round(
        width /
        height,
      ),
    );


  const texture =
    cloneStripTexture(
      base,
    );


  texture.repeat.set(
    1 /
    frames,
    1,
  );


  texture.offset.set(
    0,
    0,
  );


  binding.actions.set(
    action,
    {
      texture,
      frames,
    },
  );


  if (
    !binding.loaded
    &&
    action ===
    "idle"
  ) {

    binding.loaded =
      true;


    binding.sprite.material.map =
      texture;


    binding.sprite.material.needsUpdate =
      true;
  }
}



export function bindRealCharacterSprite(
  sprite,
  appearance,
) {

  if (
    !sprite
    ||
    !appearance
    ||
    sprite.userData.real2DCharacter
  ) {

    return;
  }


  setupTopDownSprite(
    sprite,
  );


  const binding = {

    sprite,

    appearance,

    actions:
      new Map(),

    loaded:
      false,

    desiredAction:
      "idle",

    currentAction:
      "",

    forcedAction:
      "",

    forcedUntil:
      0,

    actionStarted:
      performance.now(),
  };


  sprite.userData.real2DCharacter =
    binding;


  bindings.add(
    binding,
  );


  for (
    const action
    of [
      "idle",
      "walk",
      "attack",
      "hurt",
      "death",
    ]
  ) {

    loadCharacterAction(
      binding,
      action,
    );
  }
}



export function setRealCharacterMoving(
  sprite,
  moving,
) {

  const binding =
    sprite
      ?.userData
      ?.real2DCharacter;


  if (
    !binding
  ) {

    return;
  }


  binding.desiredAction =
    moving
      ? "walk"
      : "idle";
}



export function playRealCharacterAction(
  sprite,
  action,
  duration =
    380,
) {

  const binding =
    sprite
      ?.userData
      ?.real2DCharacter;


  if (
    !binding
  ) {

    return;
  }


  binding.forcedAction =
    action;


  binding.actionStarted =
    performance.now();


  binding.forcedUntil =
    binding.actionStarted
    +
    duration;


  binding.currentAction =
    "";
}



function fpsFor(
  action,
) {

  switch (
    action
  ) {

    case "walk":

      return 10;


    case "attack":

      return 14;


    case "hurt":

      return 12;


    case "death":

      return 9;


    default:

      return 7;
  }
}



function updateBinding(
  binding,
  elapsed,
) {

  if (
    !binding.loaded
  ) {

    return;
  }


  const current =
    performance.now();


  let action =
    binding.desiredAction;


  let forced =
    false;


  if (
    binding.forcedAction
    &&
    current <
    binding.forcedUntil
  ) {

    action =
      binding.forcedAction;


    forced =
      true;
  }

  else {

    binding.forcedAction =
      "";
  }


  let data =
    binding.actions.get(
      action,
    );


  if (
    !data
  ) {

    action =
      binding.desiredAction;


    data =
      binding.actions.get(
        action,
      );
  }


  if (
    !data
  ) {

    action =
      "idle";


    data =
      binding.actions.get(
        "idle",
      );
  }


  if (
    !data
  ) {

    return;
  }


  if (
    binding.currentAction !==
    action
  ) {

    binding.currentAction =
      action;


    binding.actionStarted =
      current;


    binding.sprite.material.map =
      data.texture;


    binding.sprite.material.needsUpdate =
      true;
  }


  let frame =
    0;


  if (
    forced
  ) {

    const duration =
      Math.max(
        1,

        binding.forcedUntil
        -
        binding.actionStarted,
      );


    const progress =
      Math.min(
        .999,

        Math.max(
          0,

          (
            current
            -
            binding.actionStarted
          )
          /
          duration,
        ),
      );


    frame =
      Math.min(
        data.frames -
        1,

        Math.floor(
          progress
          *
          data.frames,
        ),
      );
  }

  else {

    frame =
      Math.floor(
        elapsed
        *
        fpsFor(
          action,
        )
      )
      %
      data.frames;
  }


  data.texture.offset.x =
    frame
    /
    data.frames;
}



export function updateRealAssets2D(
  elapsed,
) {

  for (
    const binding
    of bindings
  ) {

    updateBinding(
      binding,
      elapsed,
    );
  }
}



function textureFromCrop(
  image,
  sx,
  sy,
  sw,
  sh,
) {

  const canvas =
    document.createElement(
      "canvas",
    );


  canvas.width =
    sw;


  canvas.height =
    sh;


  const ctx =
    canvas.getContext(
      "2d",
    );


  ctx.imageSmoothingEnabled =
    false;


  ctx.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    sw,
    sh,
  );


  const texture =
    new THREE.CanvasTexture(
      canvas,
    );


  texture.magFilter =
    THREE.NearestFilter;


  texture.minFilter =
    THREE.NearestFilter;


  texture.generateMipmaps =
    false;


  texture.colorSpace =
    THREE.SRGBColorSpace;


  return texture;
}



async function cropTexture(
  url,
  sx,
  sy,
  sw,
  sh,
) {

  const image =
    await loadImage(
      url,
    );


  if (
    !image
  ) {

    return null;
  }


  return textureFromCrop(
    image,
    sx,
    sy,
    sw,
    sh,
  );
}



export function bindRealResourceSprite(
  sprite,
  kind,
) {

  if (
    !sprite
  ) {

    return;
  }


  let promise =
    null;


  if (
    kind ===
    "tree"
  ) {

    promise =
      cropTexture(
        `${ROOT}/world/tree_atlas.png`,
        0,
        0,
        192,
        192,
      );
  }


  else if (
    kind ===
    "hard_tree"
  ) {

    promise =
      cropTexture(
        `${ROOT}/world/tree_atlas.png`,
        192,
        0,
        192,
        192,
      );
  }


  else if (
    kind ===
    "rock"
  ) {

    promise =
      cropTexture(
        `${ROOT}/world/rocks_atlas.png`,
        0,
        0,
        128,
        128,
      );
  }


  if (
    !promise
  ) {

    return;
  }


  promise.then(
    (
      texture,
    ) => {

      if (
        !texture
      ) {

        return;
      }


      sprite.material.map =
        texture;


      sprite.material.needsUpdate =
        true;
    },
  );
}



function hideOldVillageBase(
  scene,
) {

  scene.traverse(
    (
      object,
    ) => {

      if (
        object
          ?.userData
          ?.stage16VillageBase
      ) {

        object.visible =
          false;
      }
    },
  );
}



function hideOldHouses(
  scene,
) {

  scene.traverse(
    (
      object,
    ) => {

      if (
        object
          ?.userData
          ?.stage16House
      ) {

        object.visible =
          false;
      }
    },
  );
}



export async function buildTopDownGround(
  scene,
) {

  const image =
    await loadImage(
      `${ROOT}/world/tilemap_flat.png`,
    );


  if (
    !image
  ) {

    console.warn(
      "Tilemap real não encontrado. Mantendo fallback.",
    );


    return;
  }


  /*
   * Tile verde central:
   * X64 Y64.
   *
   * Tile areia central:
   * X384 Y64.
   */

  const grassBase =
    textureFromCrop(
      image,
      64,
      64,
      64,
      64,
    );


  const sandBase =
    textureFromCrop(
      image,
      384,
      64,
      64,
      64,
    );


  const root =
    new THREE.Group();


  root.name =
    "etapa19-2d-ground";


  const colors = {

    village:
      0xffffff,

    sunmeadow:
      0xf3f1cb,

    ancient_forest:
      0xc0d5ae,

    mist_marsh:
      0xacc8b5,

    copper_highlands:
      0xe7d19b,

    silver_frontier:
      0xdce1d8,

  };


  for (
    const id
    of REGION_ORDER
  ) {

    const region =
      REGIONS[
        id
      ];


    if (
      !region
    ) {

      continue;
    }


    const width =
      region.bounds.maxX
      -
      region.bounds.minX;


    const depth =
      region.bounds.maxZ
      -
      region.bounds.minZ;


    const centerX =
      (
        region.bounds.minX
        +
        region.bounds.maxX
      )
      /
      2;


    const centerZ =
      (
        region.bounds.minZ
        +
        region.bounds.maxZ
      )
      /
      2;


    const base =
      (
        id ===
        "copper_highlands"
        ||
        id ===
        "silver_frontier"
      )
        ? sandBase
        : grassBase;


    const texture =
      base.clone();


    texture.image =
      base.image;


    texture.wrapS =
      THREE.RepeatWrapping;


    texture.wrapT =
      THREE.RepeatWrapping;


    texture.repeat.set(
      Math.max(
        1,
        width /
        4,
      ),

      Math.max(
        1,
        depth /
        4,
      ),
    );


    texture.magFilter =
      THREE.NearestFilter;


    texture.minFilter =
      THREE.NearestFilter;


    texture.generateMipmaps =
      false;


    texture.needsUpdate =
      true;


    const plane =
      new THREE.Mesh(

        new THREE.PlaneGeometry(
          width,
          depth,
        ),

        new THREE.MeshBasicMaterial(
          {
            map:
              texture,

            color:
              colors[
                id
              ]
              ||
              0xffffff,
          },
        ),
      );


    plane.rotation.x =
      -Math.PI /
      2;


    plane.position.set(
      centerX,
      -.035,
      centerZ,
    );


    root.add(
      plane,
    );
  }


  scene.add(
    root,
  );


  hideOldVillageBase(
    scene,
  );


  console.log(
    "🌿 Chão 2D Tiny Swords carregado",
  );
}



function addHouse(
  root,
  scene,
  filename,
  x,
  z,
) {

  loadTexture(
    `${ROOT}/world/${filename}`,
  )
    .then(
      (
        texture,
      ) => {

        if (
          !texture
        ) {

          return;
        }


        hideOldHouses(
          scene,
        );


        const sprite =
          new THREE.Sprite(

            new THREE.SpriteMaterial(
              {
                map:
                  texture,

                transparent:
                  true,

                alphaTest:
                  .05,

                depthTest:
                  false,

                depthWrite:
                  false,
              },
            ),
          );


        setupTopDownSprite(
          sprite,
        );


        /*
         * Asset original 128x192.
         */

        sprite.scale.set(
          4.2,
          6.3,
          1,
        );


        sprite.position.set(
          x,
          .12,
          z,
        );


        root.add(
          sprite,
        );
      },
    );
}



export function buildTinySwordsVillage2D(
  scene,
) {

  const root =
    new THREE.Group();


  root.name =
    "etapa19-2d-village";


  scene.add(
    root,
  );


  addHouse(
    root,
    scene,
    "house_blue.png",
    -13,
    -12,
  );


  addHouse(
    root,
    scene,
    "house_yellow.png",
    13,
    -11,
  );


  addHouse(
    root,
    scene,
    "house_red.png",
    -14,
    13,
  );


  addHouse(
    root,
    scene,
    "house_purple.png",
    14,
    9,
  );


  console.log(
    "🏡 Vila 2D Tiny Swords preparada",
  );
}
