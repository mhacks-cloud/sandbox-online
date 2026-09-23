// @ts-nocheck

import * as THREE
from "three";


/*
 * ============================================================
 * SANDBOX ONLINE — ETAPA 19
 * REAL ASSETS
 * ============================================================
 *
 * Este módulo usa os packs reais quando eles existem.
 *
 * Caso os arquivos não estejam instalados:
 *
 *   → o jogo continua usando o visual procedural.
 *
 * Isso permite manter o código no GitHub público sem
 * publicar os arquivos pagos.
 */


const ROOT =
  "/assets/vendor";


const loader =
  new THREE.TextureLoader();


const baseTextureCache =
  new Map();


const imageCache =
  new Map();


const characterBindings =
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


const NPC_APPEARANCE = {

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


const ENEMY_APPEARANCE = {

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
  name,
) {

  const index =
    hashString(
      name,
    )
    %
    HEROES.length;


  return HEROES[
    index
  ];
}



export function npcAppearance(
  key,
) {

  return NPC_APPEARANCE[
    String(
      key
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

  return ENEMY_APPEARANCE[
    String(
      kind
      ||
      ""
    )
  ]
  ||
  "orc";
}



function textureUrl(
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



function loadBaseTexture(
  url,
) {

  if (
    baseTextureCache.has(
      url,
    )
  ) {

    return baseTextureCache.get(
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


  baseTextureCache.set(
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


  texture.wrapS =
    THREE.RepeatWrapping;


  texture.wrapT =
    THREE.ClampToEdgeWrapping;


  texture.needsUpdate =
    true;


  return texture;
}



async function loadAction(
  binding,
  action,
) {

  const url =
    textureUrl(
      binding.appearance,
      action,
    );


  const base =
    await loadBaseTexture(
      url,
    );


  if (
    !base
    ||
    !base.image
  ) {

    return;
  }


  const texture =
    cloneStripTexture(
      base,
    );


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


  /*
   * Os dois packs usados nesta etapa possuem frames
   * quadrados em strips horizontais.
   */

  const frames =
    Math.max(
      1,

      Math.round(
        width /
        height,
      ),
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
    !binding.realLoaded
    &&
    action ===
    "idle"
  ) {

    binding.realLoaded =
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
  ) {

    return;
  }


  if (
    sprite.userData.realCharacter
  ) {

    return;
  }


  const binding = {

    sprite,

    appearance,

    actions:
      new Map(),

    desiredAction:
      "idle",

    currentAction:
      "",

    forcedAction:
      "",

    forcedUntil:
      0,

    actionStartedAt:
      performance.now(),

    realLoaded:
      false,
  };


  sprite.userData.realCharacter =
    binding;


  characterBindings.add(
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

    loadAction(
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
      ?.realCharacter;


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
    360,
) {

  const binding =
    sprite
      ?.userData
      ?.realCharacter;


  if (
    !binding
  ) {

    return;
  }


  const current =
    performance.now();


  binding.forcedAction =
    action;


  binding.forcedUntil =
    current
    +
    duration;


  binding.actionStartedAt =
    current;


  binding.currentAction =
    "";
}



function actionFps(
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

      return 13;


    case "death":

      return 9;


    default:

      return 7;
  }
}



function updateCharacterBinding(
  binding,
  elapsed,
) {

  if (
    !binding.realLoaded
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


    binding.actionStartedAt =
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
        binding.actionStartedAt,
      );


    const progress =
      Math.min(
        .999,

        Math.max(
          0,

          (
            current
            -
            binding.actionStartedAt
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
        actionFps(
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



export function updateRealAssets(
  elapsed,
) {

  for (
    const binding
    of characterBindings
  ) {

    updateCharacterBinding(
      binding,
      elapsed,
    );
  }
}



/*
 * ============================================================
 * ATLAS DO MUNDO
 * ============================================================
 */


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



export function bindRealResourceSprite(
  sprite,
  kind,
) {

  if (
    !sprite
  ) {

    return;
  }


  const setTexture =
    (
      promise,
    ) => {

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
    };


  if (
    kind ===
    "tree"
  ) {

    setTexture(
      cropTexture(
        `${ROOT}/world/tree_atlas.png`,
        0,
        0,
        192,
        192,
      ),
    );


    return;
  }


  if (
    kind ===
    "hard_tree"
  ) {

    setTexture(
      cropTexture(
        `${ROOT}/world/tree_atlas.png`,
        192,
        0,
        192,
        192,
      ),
    );


    return;
  }


  if (
    kind ===
    "rock"
  ) {

    setTexture(
      cropTexture(
        `${ROOT}/world/rocks_atlas.png`,
        0,
        0,
        128,
        128,
      ),
    );


    return;
  }


  if (
    kind ===
    "bush"
  ) {

    loadBaseTexture(
      `${ROOT}/world/deco/08.png`,
    )
      .then(
        (
          texture,
        ) => {

          if (
            !texture
          ) return;


          sprite.material.map =
            texture;


          sprite.material.needsUpdate =
            true;
        },
      );


    return;
  }


  if (
    kind ===
    "herb_bush"
  ) {

    loadBaseTexture(
      `${ROOT}/world/deco/10.png`,
    )
      .then(
        (
          texture,
        ) => {

          if (
            !texture
          ) return;


          sprite.material.map =
            texture;


          sprite.material.needsUpdate =
            true;
        },
      );
  }
}



/*
 * ============================================================
 * TINY SWORDS — VILA DO VALE
 * ============================================================
 */


function hideProceduralHouses(
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



function addStaticSprite(
  group,
  url,
  x,
  z,
  width,
  height,
) {

  loadBaseTexture(
    url,
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
              },
            ),
          );


        sprite.scale.set(
          width,
          height,
          1,
        );


        sprite.position.set(
          x,
          height /
          2,
          z,
        );


        group.add(
          sprite,
        );
      },
    );
}



export function buildTinySwordsVillage(
  scene,
) {

  const root =
    new THREE.Group();


  root.name =
    "etapa19-real-world";


  scene.add(
    root,
  );


  const houses = [

    [
      "house_blue.png",
      -13,
      -12,
    ],

    [
      "house_yellow.png",
      13,
      -11,
    ],

    [
      "house_red.png",
      -14,
      13,
    ],

    [
      "house_purple.png",
      14,
      9,
    ],

  ];


  /*
   * Só escondemos as casas provisórias quando
   * confirmamos que pelo menos uma casa real carregou.
   */

  let realHouseLoaded =
    false;


  for (
    const [
      filename,
      x,
      z,
    ]
    of houses
  ) {

    const url =
      `${ROOT}/world/${filename}`;


    loadBaseTexture(
      url,
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


          if (
            !realHouseLoaded
          ) {

            realHouseLoaded =
              true;


            hideProceduralHouses(
              scene,
            );
          }


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
                },
              ),
            );


          sprite.scale.set(
            4,
            6,
            1,
          );


          sprite.position.set(
            x,
            3,
            z,
          );


          root.add(
            sprite,
          );
        },
      );
  }


  /*
   * Pequenas decorações sem collider.
   */

  const decor = [

    [
      "01.png",
      -7.5,
      13.5,
      1.2,
    ],

    [
      "02.png",
      9,
      -13.5,
      1.35,
    ],

    [
      "07.png",
      -7,
      -9,
      1.2,
    ],

    [
      "08.png",
      10.5,
      5.5,
      1.45,
    ],

    [
      "10.png",
      -5.5,
      11,
      1,
    ],

    [
      "11.png",
      7,
      -10.5,
      1.15,
    ],

    [
      "12.png",
      -9,
      -13,
      1.5,
    ],

  ];


  for (
    const [
      filename,
      x,
      z,
      size,
    ]
    of decor
  ) {

    addStaticSprite(
      root,

      `${ROOT}/world/deco/${filename}`,

      x,

      z,

      size,

      size,
    );
  }


  console.log(
    "🏰 Tiny Swords World Etapa 19 preparado",
  );
}
