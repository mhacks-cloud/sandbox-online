// @ts-nocheck

import * as THREE
from "three";


/*
 * ============================================================
 * SANDBOX ONLINE — ETAPA 18
 * VISUAL FX
 * ============================================================
 *
 * Sistema 100% client-side.
 *
 * - ataque
 * - impactos
 * - poeira
 * - dano flutuante
 * - câmera
 * - partículas
 */


let worldScene =
  null;


const effects = [];

const footstepTimes =
  new Map();


const particleGeometry =
  new THREE.BoxGeometry(
    .11,
    .11,
    .11,
  );


let shakeStrength =
  0;


let shakeUntil =
  0;


const lastCameraShake =
  new THREE.Vector3();



function now() {

  return performance.now();
}



function addEffect(
  effect,
) {

  if (
    !worldScene
  ) {

    return;
  }


  effects.push(
    effect,
  );


  worldScene.add(
    effect.object,
  );
}



function removeEffect(
  index,
) {

  const effect =
    effects[
      index
    ];


  if (
    effect?.object
    &&
    worldScene
  ) {

    worldScene.remove(
      effect.object,
    );
  }


  effects.splice(
    index,
    1,
  );
}



function impactColor(
  kind,
) {

  switch (
    kind
  ) {

    case "wood":

      return 0xa86c3d;


    case "leaf":

      return 0x5e9c53;


    case "stone":

      return 0x9a9d98;


    case "ore":

      return 0xd79554;


    case "silver":

      return 0xdde8ec;


    case "damage":

      return 0xef665e;


    default:

      return 0xf4cc72;
  }
}



export function initVisualEffects(
  scene,
) {

  worldScene =
    scene;


  console.log(
    "✨ Etapa 18 Visual FX carregada",
  );
}



export function triggerScreenShake(
  strength =
    .12,

  duration =
    120,
) {

  shakeStrength =
    Math.max(
      shakeStrength,
      strength,
    );


  shakeUntil =
    Math.max(
      shakeUntil,
      now()
      +
      duration,
    );
}



/*
 * ============================================================
 * IMPACTO PIXELADO
 * ============================================================
 */

export function spawnImpact(
  position,
  kind =
    "combat",
) {

  if (
    !worldScene
    ||
    !position
  ) {

    return;
  }


  const color =
    impactColor(
      kind,
    );


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const material =
      new THREE.MeshBasicMaterial(
        {
          color,

          transparent:
            true,

          opacity:
            1,

          depthWrite:
            false,
        },
      );


    const particle =
      new THREE.Mesh(
        particleGeometry,
        material,
      );


    const start =
      position.clone();


    start.y +=
      .7
      +
      Math.random()
      *
      .8;


    particle.position.copy(
      start,
    );


    const angle =
      Math.random()
      *
      Math.PI
      *
      2;


    const power =
      .6
      +
      Math.random()
      *
      1.2;


    const velocity =
      new THREE.Vector3(
        Math.cos(
          angle,
        )
        *
        power,

        .8
        +
        Math.random()
        *
        1.4,

        Math.sin(
          angle,
        )
        *
        power,
      );


    addEffect(
      {
        type:
          "particle",

        object:
          particle,

        material,

        start,

        velocity,

        born:
          now(),

        duration:
          420
          +
          Math.random()
          *
          180,
      },
    );
  }
}



/*
 * ============================================================
 * TEXTO FLUTUANTE
 * ============================================================
 */

function textTexture(
  text,
  color,
) {

  const canvas =
    document.createElement(
      "canvas",
    );


  canvas.width =
    192;


  canvas.height =
    72;


  const ctx =
    canvas.getContext(
      "2d",
    );


  ctx.imageSmoothingEnabled =
    false;


  ctx.font =
    "bold 34px monospace";


  ctx.textAlign =
    "center";


  ctx.textBaseline =
    "middle";


  ctx.lineWidth =
    7;


  ctx.strokeStyle =
    "rgba(20,20,20,.9)";


  ctx.strokeText(
    text,
    96,
    36,
  );


  ctx.fillStyle =
    color;


  ctx.fillText(
    text,
    96,
    36,
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



export function spawnFloatingText(
  position,
  text,
  color =
    "#ffffff",
) {

  if (
    !worldScene
    ||
    !position
  ) {

    return;
  }


  const texture =
    textTexture(
      String(
        text,
      ),
      color,
    );


  const material =
    new THREE.SpriteMaterial(
      {
        map:
          texture,

        transparent:
          true,

        depthWrite:
          false,
      },
    );


  const sprite =
    new THREE.Sprite(
      material,
    );


  sprite.position.copy(
    position,
  );


  sprite.position.y +=
    2.4;


  sprite.scale.set(
    2.4,
    .9,
    1,
  );


  addEffect(
    {
      type:
        "text",

      object:
        sprite,

      material,

      texture,

      start:
        sprite.position.clone(),

      born:
        now(),

      duration:
        720,
    },
  );
}



/*
 * ============================================================
 * ATAQUE
 * ============================================================
 */

export function playAttackEffect(
  position,
  direction =
    0,
) {

  if (
    !worldScene
    ||
    !position
  ) {

    return;
  }


  const material =
    new THREE.MeshBasicMaterial(
      {
        color:
          0xffdc82,

        transparent:
          true,

        opacity:
          .9,

        side:
          THREE.DoubleSide,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending,
      },
    );


  const geometry =
    new THREE.RingGeometry(
      .8,
      1.45,
      18,
      1,
      -.85,
      1.7,
    );


  const slash =
    new THREE.Mesh(
      geometry,
      material,
    );


  slash.rotation.x =
    -Math.PI /
    2;


  const group =
    new THREE.Group();


  group.add(
    slash,
  );


  const angle =
    direction
    *
    Math.PI
    /
    4;


  group.rotation.y =
    -angle;


  group.position.copy(
    position,
  );


  group.position.y =
    .28;


  addEffect(
    {
      type:
        "slash",

      object:
        group,

      material,

      born:
        now(),

      duration:
        190,
    },
  );


  triggerScreenShake(
    .035,
    80,
  );
}



/*
 * ============================================================
 * PLAYER RECEBE DANO
 * ============================================================
 */

export function playPlayerDamage(
  position,
  damage,
) {

  if (
    position
  ) {

    spawnImpact(
      position,
      "damage",
    );


    spawnFloatingText(
      position,
      `-${
        damage
      }`,

      "#ff7269",
    );
  }


  triggerScreenShake(
    .16,
    180,
  );
}



/*
 * ============================================================
 * PASSOS
 * ============================================================
 */

export function emitFootstep(
  id,
  position,
  moving,
  elapsed,
) {

  if (
    !worldScene
    ||
    !moving
    ||
    !position
  ) {

    return;
  }


  const previous =
    footstepTimes.get(
      id,
    )
    ||
    0;


  if (
    elapsed -
    previous
    <
    .23
  ) {

    return;
  }


  footstepTimes.set(
    id,
    elapsed,
  );


  const material =
    new THREE.MeshBasicMaterial(
      {
        color:
          0xb5a27e,

        transparent:
          true,

        opacity:
          .28,

        depthWrite:
          false,
      },
    );


  const dust =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        .22,
        8,
      ),

      material,
    );


  dust.rotation.x =
    -Math.PI /
    2;


  dust.position.copy(
    position,
  );


  dust.position.y =
    .035;


  dust.position.x +=
    (
      Math.random()
      -
      .5
    )
    *
    .3;


  dust.position.z +=
    (
      Math.random()
      -
      .5
    )
    *
    .3;


  addEffect(
    {
      type:
        "dust",

      object:
        dust,

      material,

      born:
        now(),

      duration:
        420,

      startScale:
        .8,
    },
  );
}



/*
 * ============================================================
 * LOOP DOS FX
 * ============================================================
 */

export function updateVisualEffects(
  {
    camera,
    elapsed,
  },
) {

  if (
    !worldScene
  ) {

    return;
  }


  const current =
    now();


  /*
   * Remove o shake aplicado no frame anterior.
   */

  if (
    camera
  ) {

    camera.position.sub(
      lastCameraShake,
    );


    lastCameraShake.set(
      0,
      0,
      0,
    );
  }


  for (
    let i =
      effects.length -
      1;

    i >=
    0;

    i--
  ) {

    const effect =
      effects[
        i
      ];


    const age =
      current -
      effect.born;


    const t =
      Math.min(
        1,

        age /
        effect.duration,
      );


    if (
      t >=
      1
    ) {

      if (
        effect.texture
      ) {

        effect.texture.dispose?.();
      }


      removeEffect(
        i,
      );


      continue;
    }


    if (
      effect.type ===
      "particle"
    ) {

      const seconds =
        age /
        1000;


      effect.object.position.set(

        effect.start.x
        +
        effect.velocity.x
        *
        seconds,

        effect.start.y
        +
        effect.velocity.y
        *
        seconds
        -
        2.8
        *
        seconds
        *
        seconds,

        effect.start.z
        +
        effect.velocity.z
        *
        seconds,
      );


      effect.material.opacity =
        1 -
        t;


      const scale =
        Math.max(
          .2,
          1 -
          t *
          .65,
        );


      effect.object.scale.setScalar(
        scale,
      );
    }


    else if (
      effect.type ===
      "text"
    ) {

      effect.object.position.y =
        effect.start.y
        +
        t *
        1.25;


      effect.material.opacity =
        1 -
        t;


      const scale =
        1
        +
        Math.sin(
          t *
          Math.PI,
        )
        *
        .12;


      effect.object.scale.set(
        2.4 *
        scale,

        .9 *
        scale,

        1,
      );
    }


    else if (
      effect.type ===
      "slash"
    ) {

      effect.material.opacity =
        1 -
        t;


      effect.object.scale.setScalar(
        .8
        +
        t *
        .7,
      );


      effect.object.rotation.y +=
        .035;
    }


    else if (
      effect.type ===
      "dust"
    ) {

      effect.material.opacity =
        .28
        *
        (
          1 -
          t
        );


      const scale =
        effect.startScale
        +
        t *
        1.5;


      effect.object.scale.setScalar(
        scale,
      );
    }
  }


  /*
   * Camera shake.
   */

  if (
    camera
    &&
    current <
    shakeUntil
  ) {

    const remaining =
      Math.max(
        0,

        (
          shakeUntil -
          current
        )
        /
        180,
      );


    const strength =
      shakeStrength
      *
      Math.min(
        1,
        remaining,
      );


    lastCameraShake.set(

      Math.sin(
        elapsed *
        73,
      )
      *
      strength,

      Math.cos(
        elapsed *
        91,
      )
      *
      strength
      *
      .55,

      Math.sin(
        elapsed *
        61,
      )
      *
      strength,
    );


    camera.position.add(
      lastCameraShake,
    );
  }

  else {

    shakeStrength =
      0;
  }
}
