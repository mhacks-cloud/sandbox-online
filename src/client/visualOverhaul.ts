// @ts-nocheck

import * as THREE
from "three";

import {
  worldClockAt,
} from "../shared/regionalLife";


let initialized =
  false;


let waterMaterial =
  null;


let fireflyMaterial =
  null;


const swayObjects = [];

const glowMaterials = [];

const windowMaterials = [];

const fogPatches = [];


const DAY =
  new THREE.Color(
    0x93bca3,
  );


const DAWN =
  new THREE.Color(
    0xb48a72,
  );


const NIGHT =
  new THREE.Color(
    0x18273b,
  );


const CAVE =
  new THREE.Color(
    0x10151c,
  );


function noise(
  value,
) {

  const result =
    Math.sin(
      value *
      12.9898
      +
      78.233,
    )
    *
    43758.5453;


  return result -
    Math.floor(
      result,
    );
}


function textureCanvas(
  draw,
  width =
    48,
  height =
    64,
) {

  const canvas =
    document.createElement(
      "canvas",
    );


  canvas.width =
    width;


  canvas.height =
    height;


  const ctx =
    canvas.getContext(
      "2d",
    );


  ctx.imageSmoothingEnabled =
    false;


  draw(
    ctx,
    width,
    height,
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


export function premiumTexture(
  kind,
) {

  return textureCanvas(
    (
      ctx,
    ) => {

      const r =
        (
          x,
          y,
          w,
          h,
          color,
        ) => {

          ctx.fillStyle =
            color;


          ctx.fillRect(
            x,
            y,
            w,
            h,
          );
        };


      /*
       * ÁRVORES
       */

      if (
        kind ===
        "tree"
        ||
        kind ===
        "hard_tree"
      ) {

        const dark =
          kind ===
          "hard_tree"
            ? "#18392a"
            : "#204a30";


        const mid =
          kind ===
          "hard_tree"
            ? "#24563a"
            : "#307044";


        const light =
          kind ===
          "hard_tree"
            ? "#34704a"
            : "#4a8d55";


        r(
          19,
          32,
          11,
          31,
          "#34251c",
        );


        r(
          22,
          31,
          6,
          31,
          "#65432b",
        );


        r(
          24,
          34,
          2,
          24,
          "#8b5b37",
        );


        r(
          7,
          23,
          35,
          25,
          dark,
        );


        r(
          11,
          14,
          29,
          28,
          mid,
        );


        r(
          16,
          8,
          19,
          22,
          mid,
        );


        r(
          11,
          20,
          12,
          13,
          light,
        );


        r(
          26,
          13,
          9,
          10,
          light,
        );


        r(
          30,
          29,
          8,
          7,
          light,
        );


        return;
      }


      /*
       * MINÉRIOS
       */

      if (
        kind ===
        "rock"
        ||
        kind ===
        "ore"
        ||
        kind ===
        "copper_ore"
        ||
        kind ===
        "silver_ore"
      ) {

        let vein =
          "#838b89";


        if (
          kind ===
          "ore"
        ) {

          vein =
            "#ad8055";
        }


        if (
          kind ===
          "copper_ore"
        ) {

          vein =
            "#d8773d";
        }


        if (
          kind ===
          "silver_ore"
        ) {

          vein =
            "#dce6eb";
        }


        r(
          8,
          38,
          34,
          15,
          "#353b3a",
        );


        r(
          12,
          29,
          27,
          21,
          "#4c5553",
        );


        r(
          18,
          24,
          16,
          14,
          "#626b68",
        );


        r(
          22,
          30,
          7,
          7,
          vein,
        );


        r(
          30,
          39,
          7,
          5,
          vein,
        );


        r(
          16,
          44,
          5,
          4,
          vein,
        );


        return;
      }


      /*
       * ARBUSTOS
       */

      if (
        kind ===
        "bush"
        ||
        kind ===
        "herb_bush"
      ) {

        r(
          6,
          38,
          37,
          15,
          "#244a32",
        );


        r(
          10,
          29,
          29,
          20,
          "#397249",
        );


        r(
          16,
          24,
          18,
          15,
          "#559057",
        );


        const detail =
          kind ===
          "herb_bush"
            ? "#e0d268"
            : "#86569e";


        r(
          17,
          35,
          4,
          4,
          detail,
        );


        r(
          29,
          39,
          4,
          4,
          detail,
        );


        return;
      }


      /*
       * SLIME
       */

      if (
        kind ===
        "slime"
      ) {

        r(
          9,
          31,
          31,
          14,
          "#173d2a",
        );


        r(
          13,
          24,
          24,
          18,
          "#2e744f",
        );


        r(
          17,
          20,
          16,
          15,
          "#4c996a",
        );


        r(
          19,
          27,
          3,
          4,
          "#15231b",
        );


        r(
          29,
          27,
          3,
          4,
          "#15231b",
        );


        return;
      }


      /*
       * LOBO
       */

      if (
        kind ===
        "wolf"
      ) {

        r(
          8,
          32,
          34,
          15,
          "#34312f",
        );


        r(
          15,
          23,
          24,
          18,
          "#55514e",
        );


        r(
          19,
          17,
          17,
          15,
          "#66605b",
        );


        r(
          18,
          13,
          6,
          8,
          "#46413e",
        );


        r(
          31,
          13,
          6,
          8,
          "#46413e",
        );


        r(
          22,
          24,
          3,
          3,
          "#171615",
        );


        r(
          31,
          24,
          3,
          3,
          "#171615",
        );


        return;
      }


      /*
       * JAVALI
       */

      if (
        kind ===
        "boar"
      ) {

        r(
          7,
          33,
          36,
          16,
          "#3d2d24",
        );


        r(
          13,
          27,
          29,
          18,
          "#674a36",
        );


        r(
          29,
          23,
          14,
          15,
          "#77533b",
        );


        r(
          39,
          35,
          6,
          3,
          "#e2cfaa",
        );


        return;
      }


      /*
       * ARANHA
       */

      if (
        kind ===
        "swamp_spider"
      ) {

        r(
          17,
          27,
          18,
          17,
          "#304f3b",
        );


        r(
          20,
          20,
          12,
          12,
          "#47674d",
        );


        r(
          5,
          27,
          13,
          3,
          "#253a2e",
        );


        r(
          4,
          37,
          14,
          3,
          "#253a2e",
        );


        r(
          34,
          27,
          12,
          3,
          "#253a2e",
        );


        r(
          34,
          37,
          12,
          3,
          "#253a2e",
        );


        r(
          21,
          28,
          3,
          3,
          "#e4d268",
        );


        r(
          29,
          28,
          3,
          3,
          "#e4d268",
        );


        return;
      }


      /*
       * ESPECTRO
       */

      if (
        kind ===
        "wraith"
      ) {

        r(
          17,
          13,
          18,
          16,
          "rgba(208,230,239,.9)",
        );


        r(
          13,
          28,
          26,
          22,
          "rgba(155,191,206,.78)",
        );


        r(
          9,
          45,
          10,
          10,
          "rgba(106,141,156,.7)",
        );


        r(
          21,
          47,
          10,
          10,
          "rgba(106,141,156,.7)",
        );


        r(
          34,
          44,
          8,
          11,
          "rgba(106,141,156,.7)",
        );


        r(
          21,
          20,
          3,
          4,
          "#21313b",
        );


        r(
          30,
          20,
          3,
          4,
          "#21313b",
        );


        return;
      }


      /*
       * GOBLIN
       */

      if (
        kind ===
        "goblin"
      ) {

        r(
          16,
          12,
          18,
          18,
          "#385f39",
        );


        r(
          18,
          14,
          14,
          15,
          "#668c51",
        );


        r(
          11,
          30,
          29,
          24,
          "#52394d",
        );


        r(
          16,
          54,
          8,
          8,
          "#28221f",
        );


        r(
          28,
          54,
          8,
          8,
          "#28221f",
        );


        return;
      }


      /*
       * NPC / BANDIDO
       */

      const colors = {

        merchant:
          "#71529c",

        lina:
          "#387d91",

        hunter:
          "#47683b",

        blacksmith:
          "#59636c",

        fisherman:
          "#407a94",

        farmer:
          "#798d4d",

        cook:
          "#a96a53",

        bandit:
          "#733939",
      };


      const clothes =
        colors[
          kind
        ]
        ||
        "#687485";


      const skin =
        kind ===
        "bandit"
          ? "#c78c68"
          : "#d9a27b";


      r(
        17,
        11,
        18,
        18,
        "#34271f",
      );


      r(
        19,
        13,
        14,
        15,
        skin,
      );


      r(
        18,
        7,
        16,
        8,
        "#4c3022",
      );


      r(
        12,
        28,
        28,
        28,
        "#302b29",
      );


      r(
        14,
        30,
        24,
        24,
        clothes,
      );


      r(
        9,
        32,
        6,
        19,
        clothes,
      );


      r(
        38,
        32,
        6,
        19,
        clothes,
      );


      r(
        14,
        44,
        24,
        4,
        "#4a3526",
      );


      r(
        24,
        44,
        4,
        4,
        "#d1a64e",
      );


      r(
        16,
        53,
        8,
        10,
        "#282626",
      );


      r(
        29,
        53,
        8,
        10,
        "#282626",
      );


      r(
        21,
        19,
        2,
        2,
        "#2b211d",
      );


      r(
        29,
        19,
        2,
        2,
        "#2b211d",
      );


      if (
        kind ===
        "bandit"
      ) {

        r(
          16,
          8,
          20,
          8,
          "#292526",
        );


        r(
          39,
          30,
          3,
          26,
          "#c5c8c8",
        );
      }
    },
  );
}



export function premiumPlayerTexture(
  id,
) {

  return textureCanvas(
    (
      ctx,
    ) => {

      let hash =
        0;


      for (
        const char
        of String(
          id,
        )
      ) {

        hash =
          (
            hash *
            31
            +
            char.charCodeAt(
              0,
            )
          )
          %
          360;
      }


      const main =
        `hsl(${
          hash
        },52%,43%)`;


      const light =
        `hsl(${
          hash
        },56%,57%)`;


      const dark =
        `hsl(${
          hash
        },44%,26%)`;


      const r =
        (
          x,
          y,
          w,
          h,
          color,
        ) => {

          ctx.fillStyle =
            color;


          ctx.fillRect(
            x,
            y,
            w,
            h,
          );
        };


      r(
        16,
        10,
        20,
        20,
        "#32231c",
      );


      r(
        18,
        12,
        16,
        17,
        "#d8a079",
      );


      r(
        17,
        7,
        18,
        8,
        "#4a3023",
      );


      r(
        17,
        11,
        4,
        9,
        "#4a3023",
      );


      r(
        31,
        11,
        4,
        7,
        "#4a3023",
      );


      r(
        21,
        19,
        2,
        2,
        "#29201b",
      );


      r(
        30,
        19,
        2,
        2,
        "#29201b",
      );


      r(
        11,
        29,
        31,
        27,
        "#292625",
      );


      r(
        14,
        30,
        25,
        25,
        main,
      );


      r(
        16,
        32,
        5,
        13,
        light,
      );


      r(
        34,
        33,
        4,
        16,
        dark,
      );


      r(
        9,
        31,
        7,
        8,
        dark,
      );


      r(
        39,
        31,
        7,
        8,
        dark,
      );


      r(
        10,
        38,
        6,
        16,
        "#ca916d",
      );


      r(
        39,
        38,
        6,
        16,
        "#ca916d",
      );


      r(
        13,
        45,
        27,
        5,
        "#4b3425",
      );


      r(
        24,
        45,
        5,
        5,
        "#d4a94c",
      );


      r(
        15,
        54,
        9,
        9,
        "#282525",
      );


      r(
        30,
        54,
        9,
        9,
        "#282525",
      );


      r(
        14,
        61,
        11,
        3,
        "#171616",
      );


      r(
        29,
        61,
        11,
        3,
        "#171616",
      );


      r(
        40,
        18,
        3,
        30,
        "#bfc5c7",
      );


      r(
        37,
        24,
        9,
        3,
        "#7b5931",
      );
    },
  );
}



function plane(
  width,
  depth,
  color,
  opacity =
    1,
) {

  const mesh =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        width,
        depth,
      ),

      new THREE.MeshBasicMaterial(
        {
          color,

          transparent:
            opacity <
            1,

          opacity,

          depthWrite:
            opacity >=
            1,
        },
      ),
    );


  mesh.rotation.x =
    -Math.PI /
    2;


  return mesh;
}


function box(
  w,
  h,
  d,
  color,
) {

  return new THREE.Mesh(

    new THREE.BoxGeometry(
      w,
      h,
      d,
    ),

    new THREE.MeshBasicMaterial(
      {
        color,
      },
    ),
  );
}


function glowTexture() {

  const canvas =
    document.createElement(
      "canvas",
    );


  canvas.width =
    64;


  canvas.height =
    64;


  const ctx =
    canvas.getContext(
      "2d",
    );


  const gradient =
    ctx.createRadialGradient(
      32,
      32,
      2,
      32,
      32,
      30,
    );


  gradient.addColorStop(
    0,
    "rgba(255,215,120,.95)",
  );


  gradient.addColorStop(
    .35,
    "rgba(255,177,70,.42)",
  );


  gradient.addColorStop(
    1,
    "rgba(255,140,40,0)",
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    64,
    64,
  );


  const texture =
    new THREE.CanvasTexture(
      canvas,
    );


  texture.colorSpace =
    THREE.SRGBColorSpace;


  return texture;
}


const GLOW =
  glowTexture();


function addHouse(
  root,
  x,
  z,
  bodyColor,
  roofColor,
) {

  const group =
    new THREE.Group();


  group.userData.stage16House =
    true;


  const foundation =
    box(
      4,
      .25,
      3.5,
      0x625646,
    );


  foundation.position.y =
    .125;


  group.add(
    foundation,
  );


  const body =
    box(
      3.7,
      2.5,
      3.1,
      bodyColor,
    );


  body.position.y =
    1.38;


  group.add(
    body,
  );


  const roof =
    new THREE.Mesh(

      new THREE.ConeGeometry(
        2.8,
        1.7,
        4,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            roofColor,
        },
      ),
    );


  roof.rotation.y =
    Math.PI /
    4;


  roof.position.y =
    3.35;


  group.add(
    roof,
  );


  const door =
    box(
      .8,
      1.4,
      .12,
      0x493426,
    );


  door.position.set(
    0,
    .75,
    1.61,
  );


  group.add(
    door,
  );


  for (
    const wx
    of [
      -1.15,
      1.15,
    ]
  ) {

    const material =
      new THREE.MeshBasicMaterial(
        {
          color:
            0xe4b35a,

          transparent:
            true,

          opacity:
            .5,
        },
      );


    const window =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          .58,
          .58,
          .13,
        ),

        material,
      );


    window.position.set(
      wx,
      1.5,
      1.63,
    );


    group.add(
      window,
    );


    windowMaterials.push(
      material,
    );
  }


  group.position.set(
    x,
    0,
    z,
  );


  root.add(
    group,
  );
}


function addLamp(
  root,
  x,
  z,
) {

  const group =
    new THREE.Group();


  const pole =
    box(
      .16,
      2.5,
      .16,
      0x45362a,
    );


  pole.position.y =
    1.25;


  group.add(
    pole,
  );


  const lamp =
    box(
      .42,
      .55,
      .42,
      0xd7a24b,
    );


  lamp.position.set(
    .45,
    2.05,
    0,
  );


  group.add(
    lamp,
  );


  const material =
    new THREE.SpriteMaterial(
      {
        map:
          GLOW,

        transparent:
          true,

        depthWrite:
          false,

        opacity:
          .12,

        blending:
          THREE.AdditiveBlending,
      },
    );


  const glow =
    new THREE.Sprite(
      material,
    );


  glow.position.set(
    .45,
    2.05,
    0,
  );


  glow.scale.set(
    3,
    3,
    1,
  );


  group.add(
    glow,
  );


  glowMaterials.push(
    material,
  );


  group.position.set(
    x,
    0,
    z,
  );


  root.add(
    group,
  );
}


function addFence(
  root,
  x,
  z,
  length,
  horizontal =
    true,
) {

  const group =
    new THREE.Group();


  for (
    const y
    of [
      .55,
      1.05,
    ]
  ) {

    const rail =
      box(
        horizontal
          ? length
          : .13,

        .13,

        horizontal
          ? .13
          : length,

        0x785434,
      );


    rail.position.y =
      y;


    group.add(
      rail,
    );
  }


  const posts =
    Math.ceil(
      length /
      2,
    );


  for (
    let i = 0;
    i <= posts;
    i++
  ) {

    const post =
      box(
        .18,
        1.3,
        .18,
        0x5f422c,
      );


    post.position.y =
      .65;


    const p =
      (
        i /
        posts
        -
        .5
      )
      *
      length;


    if (
      horizontal
    ) {

      post.position.x =
        p;
    }

    else {

      post.position.z =
        p;
    }


    group.add(
      post,
    );
  }


  group.position.set(
    x,
    0,
    z,
  );


  root.add(
    group,
  );
}


function addWell(
  root,
  x,
  z,
) {

  const group =
    new THREE.Group();


  const stone =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        1.1,
        1.2,
        .7,
        12,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0x81786b,
        },
      ),
    );


  stone.position.y =
    .35;


  group.add(
    stone,
  );


  const water =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        .8,
        16,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0x477d8c,
        },
      ),
    );


  water.rotation.x =
    -Math.PI /
    2;


  water.position.y =
    .72;


  group.add(
    water,
  );


  for (
    const px
    of [
      -.9,
      .9,
    ]
  ) {

    const post =
      box(
        .16,
        2.2,
        .16,
        0x5a402b,
      );


    post.position.set(
      px,
      1.35,
      0,
    );


    group.add(
      post,
    );
  }


  const roof =
    new THREE.Mesh(

      new THREE.ConeGeometry(
        1.5,
        .7,
        4,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0x69402f,
        },
      ),
    );


  roof.rotation.y =
    Math.PI /
    4;


  roof.position.y =
    2.6;


  group.add(
    roof,
  );


  group.position.set(
    x,
    0,
    z,
  );


  root.add(
    group,
  );
}


function addFlowers(
  root,
  x,
  z,
  color,
  seed,
) {

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const ox =
      (
        noise(
          seed +
          i *
          13,
        )
        -
        .5
      )
      *
      1.8;


    const oz =
      (
        noise(
          seed +
          i *
          19,
        )
        -
        .5
      )
      *
      1.8;


    const stem =
      box(
        .05,
        .3,
        .05,
        0x3b7440,
      );


    stem.position.set(
      x + ox,
      .15,
      z + oz,
    );


    root.add(
      stem,
    );


    const flower =
      box(
        .16,
        .12,
        .16,
        color,
      );


    flower.position.set(
      x + ox,
      .35,
      z + oz,
    );


    root.add(
      flower,
    );
  }
}


function addRockCluster(
  root,
  x,
  z,
  color,
  seed,
) {

  for (
    let i = 0;
    i < 4;
    i++
  ) {

    const size =
      .35
      +
      noise(
        seed +
        i *
        7,
      )
      *
      .55;


    const rock =
      new THREE.Mesh(

        new THREE.DodecahedronGeometry(
          size,
          0,
        ),

        new THREE.MeshBasicMaterial(
          {
            color,
          },
        ),
      );


    rock.scale.y =
      .55;


    rock.position.set(
      x
      +
      (
        noise(
          seed +
          i *
          11,
        )
        -
        .5
      )
      *
      2.3,

      size *
      .35,

      z
      +
      (
        noise(
          seed +
          i *
          17,
        )
        -
        .5
      )
      *
      2.3,
    );


    root.add(
      rock,
    );
  }
}


function buildWater(
  root,
) {

  waterMaterial =
    new THREE.ShaderMaterial(
      {
        transparent:
          true,

        depthWrite:
          false,

        uniforms: {

          uTime: {
            value:
              0,
          },

          uDaylight: {
            value:
              1,
          },
        },

        vertexShader:
          `
          uniform float uTime;

          varying vec2 vUv;

          void main() {

            vUv = uv;

            vec3 p =
              position;

            p.z +=
              sin(
                position.x * 2.0
                +
                position.y * 1.4
                +
                uTime * 1.6
              )
              *
              0.025;

            gl_Position =
              projectionMatrix
              *
              modelViewMatrix
              *
              vec4(
                p,
                1.0
              );
          }
          `,

        fragmentShader:
          `
          uniform float uTime;
          uniform float uDaylight;

          varying vec2 vUv;

          void main() {

            float a =
              sin(
                vUv.x * 32.0
                +
                uTime * 1.8
              )
              *
              0.5
              +
              0.5;

            float b =
              sin(
                vUv.y * 27.0
                -
                uTime * 1.2
              )
              *
              0.5
              +
              0.5;

            float ripple =
              a *
              b;

            vec3 night =
              vec3(
                0.06,
                0.18,
                0.28
              );

            vec3 day =
              vec3(
                0.16,
                0.52,
                0.64
              );

            vec3 color =
              mix(
                night,
                day,
                uDaylight
              );

            color +=
              ripple *
              0.07;

            gl_FragColor =
              vec4(
                color,
                0.94
              );
          }
          `,
      },
    );


  const water =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        5.15,
        48,
      ),

      waterMaterial,
    );


  water.scale.set(
    1.25,
    .8,
    1,
  );


  water.rotation.x =
    -Math.PI /
    2;


  water.position.set(
    14,
    .06,
    14,
  );


  root.add(
    water,
  );
}


function buildGrass(
  root,
) {

  let created =
    0;


  for (
    let i = 0;
    i < 120
    &&
    created <
    48;
    i++
  ) {

    const x =
      -16
      +
      noise(
        i *
        7 +
        4,
      )
      *
      32;


    const z =
      -16
      +
      noise(
        i *
        11 +
        9,
      )
      *
      32;


    if (
      Math.abs(
        x,
      )
      <
      2.7
      ||
      (
        Math.abs(
          z -
          3,
        )
        <
        2.4
        &&
        Math.abs(
          x,
        )
        <
        15
      )
      ||
      Math.hypot(
        x -
        14,
        z -
        14,
      )
      <
      7
      ||
      Math.hypot(
        x,
        z -
        1,
      )
      <
      6
    ) {

      continue;
    }


    const grass =
      new THREE.Mesh(

        new THREE.PlaneGeometry(
          .45,
          .85,
        ),

        new THREE.MeshBasicMaterial(
          {
            color:
              0x3d7442,

            transparent:
              true,

            opacity:
              .86,

            side:
              THREE.DoubleSide,
          },
        ),
      );


    grass.position.set(
      x,
      .43,
      z,
    );


    grass.rotation.y =
      noise(
        i *
        17,
      )
      *
      Math.PI;


    root.add(
      grass,
    );


    swayObjects.push(
      {
        mesh:
          grass,

        base:
          grass.rotation.z,

        phase:
          i *
          .63,
      },
    );


    created++;
  }
}


function buildFireflies(
  root,
) {

  const count =
    52;


  const positions =
    new Float32Array(
      count *
      3,
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    positions[
      i *
      3
    ] =
      -16
      +
      noise(
        i *
        7,
      )
      *
      32;


    positions[
      i *
      3
      +
      1
    ] =
      .7
      +
      noise(
        i *
        13,
      )
      *
      2.7;


    positions[
      i *
      3
      +
      2
    ] =
      -16
      +
      noise(
        i *
        19,
      )
      *
      32;
  }


  const geometry =
    new THREE.BufferGeometry();


  geometry.setAttribute(
    "position",

    new THREE.BufferAttribute(
      positions,
      3,
    ),
  );


  fireflyMaterial =
    new THREE.PointsMaterial(
      {
        color:
          0xffd56c,

        size:
          .12,

        transparent:
          true,

        opacity:
          0,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending,
      },
    );


  root.add(
    new THREE.Points(
      geometry,
      fireflyMaterial,
    ),
  );
}


function buildVillage(
  scene,
) {

  const root =
    new THREE.Group();


  root.name =
    "etapa16-village";


  /*
   * Chão novo.
   */

  const base =
    plane(
      35.5,
      35.5,
      0x64894d,
    );


  base.position.set(
    0,
    .007,
    0,
  );


  base.userData.stage16VillageBase =
    true;


  root.add(
    base,
  );


  /*
   * Praça.
   */

  const plaza =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        6,
        28,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0x97876a,
        },
      ),
    );


  plaza.rotation.x =
    -Math.PI /
    2;


  plaza.scale.z =
    .8;


  plaza.position.set(
    0,
    .038,
    1,
  );


  root.add(
    plaza,
  );


  /*
   * Estradas.
   */

  const vertical =
    plane(
      4.2,
      35,
      0xa28b61,
    );


  vertical.position.set(
    0,
    .032,
    0,
  );


  root.add(
    vertical,
  );


  const horizontal =
    plane(
      31,
      4,
      0xa28b61,
    );


  horizontal.position.set(
    0,
    .033,
    3,
  );


  root.add(
    horizontal,
  );


  /*
   * Casas afastadas dos NPCs principais.
   */

  addHouse(
    root,
    -13,
    -12,
    0xb49a6c,
    0x744a35,
  );


  addHouse(
    root,
    13,
    -11,
    0xaa8f66,
    0x684432,
  );


  addHouse(
    root,
    -14,
    13,
    0xb8a575,
    0x76503a,
  );


  addHouse(
    root,
    14,
    9,
    0xaa906b,
    0x654133,
  );


  /*
   * Poço.
   */

  addWell(
    root,
    -4,
    7,
  );


  /*
   * Cercas.
   */

  /*
   * ETAPA 17
   * Cerca acompanhando a borda da fazenda.
   */

  addFence(
    root,
    -16.4,
    7,
    9,
    false,
  );


  addFence(
    root,
    -13.5,
    2.5,
    6,
    true,
  );


  /*
   * Lanternas.
   */

  for (
    const [
      x,
      z,
    ]
    of [
      [-4,3],
      [4,3],
      [-2,-5],
      [2,-5],
      [-2,10],
      [2,10],
    ]
  ) {

    addLamp(
      root,
      x,
      z,
    );
  }


  /*
   * Flores.
   */

  addFlowers(
    root,
    -7,
    11,
    0xe9c85d,
    10,
  );


  addFlowers(
    root,
    8,
    -13,
    0xdc6f7c,
    20,
  );


  addFlowers(
    root,
    11,
    5,
    0xd7d2e8,
    30,
  );


  addFlowers(
    root,
    -8,
    -11,
    0x78b8eb,
    40,
  );


  /*
   * Pedras.
   */

  addRockCluster(
    root,
    -15,
    -15,
    0x77766d,
    50,
  );


  addRockCluster(
    root,
    15,
    -9,
    0x77766d,
    60,
  );


  buildGrass(
    root,
  );


  buildFireflies(
    root,
  );


  buildWater(
    root,
  );


  scene.add(
    root,
  );
}


function buildBiomeDetails(
  scene,
) {

  const root =
    new THREE.Group();


  /*
   * Prado.
   */

  addFlowers(
    root,
    -11,
    -29,
    0xe1c75d,
    100,
  );


  addFlowers(
    root,
    10,
    -36,
    0xe3a75a,
    110,
  );


  addFlowers(
    root,
    -7,
    -45,
    0xded479,
    120,
  );


  /*
   * Bosque.
   */

  addRockCluster(
    root,
    -35,
    -12,
    0x465349,
    200,
  );


  addRockCluster(
    root,
    -44,
    -29,
    0x465349,
    210,
  );


  /*
   * Colinas.
   */

  addRockCluster(
    root,
    35,
    19,
    0x8b6549,
    300,
  );


  addRockCluster(
    root,
    44,
    34,
    0x8b6549,
    310,
  );


  /*
   * Fronteira Prateada.
   */

  addRockCluster(
    root,
    34,
    -21,
    0x87949e,
    400,
  );


  addRockCluster(
    root,
    44,
    -39,
    0x87949e,
    410,
  );


  /*
   * Névoa do Pântano.
   */

  for (
    const [
      x,
      z,
    ]
    of [
      [-31,29],
      [-41,39],
      [-15,43],
      [-28,49],
    ]
  ) {

    const fog =
      plane(
        8,
        4,
        0xb0c3b7,
        .07,
      );


    fog.position.set(
      x,
      .12,
      z,
    );


    root.add(
      fog,
    );


    fogPatches.push(
      fog,
    );
  }


  scene.add(
    root,
  );
}


export function buildVisualOverhaul(
  scene,
  renderer,
) {

  if (
    initialized
  ) {

    return;
  }


  initialized =
    true;


  renderer.domElement.style.imageRendering =
    "pixelated";


  scene.fog =
    new THREE.FogExp2(
      0x93bca3,
      .011,
    );


  buildVillage(
    scene,
  );


  buildBiomeDetails(
    scene,
  );


  console.log(
    "🎨 Etapa 16 V2 carregada",
  );
}


function daylight(
  hour,
) {

  if (
    hour >=
    8
    &&
    hour <
    18
  ) {

    return 1;
  }


  if (
    hour >=
    5
    &&
    hour <
    8
  ) {

    return (
      hour -
      5
    )
    /
    3;
  }


  if (
    hour >=
    18
    &&
    hour <
    21
  ) {

    return 1 -
      (
        hour -
        18
      )
      /
      3;
  }


  return .12;
}


export function updatePremiumPlayerSprite(
  sprite,
  options,
) {

  const moving =
    Boolean(
      options?.moving,
    );


  const direction =
    Number(
      options?.direction,
    )
    ||
    0;


  const elapsed =
    Number(
      options?.elapsed,
    )
    ||
    0;


  const baseY =
    Number(
      options?.baseY,
    )
    ||
    1.6;


  if (
    moving
  ) {

    sprite.position.y =
      baseY
      +
      Math.abs(
        Math.sin(
          elapsed *
          10,
        ),
      )
      *
      .08;


    sprite.material.rotation =
      Math.sin(
        elapsed *
        10,
      )
      *
      .018;
  }

  else {

    sprite.position.y =
      baseY
      +
      Math.sin(
        elapsed *
        2,
      )
      *
      .025;


    sprite.material.rotation =
      0;
  }


  const left =
    direction ===
    1
    ||
    direction ===
    2
    ||
    direction ===
    3;


  sprite.scale.x =
    left
      ? -2.1
      : 2.1;
}


export function updateVisualOverhaul(
  options,
) {

  if (
    !initialized
  ) {

    return;
  }


  const scene =
    options.scene;


  const renderer =
    options.renderer;


  const elapsed =
    options.elapsed;


  const nowMs =
    options.nowMs;


  const currentCave =
    options.currentCave;


  const clock =
    worldClockAt(
      nowMs,
    );


  const hour =
    clock.hour
    +
    clock.minute /
    60;


  let day =
    daylight(
      hour,
    );


  const night =
    1 -
    day;


  if (
    currentCave
  ) {

    day =
      .05;


    scene.background.copy(
      CAVE,
    );


    scene.fog.color.copy(
      CAVE,
    );


    scene.fog.density =
      .007;


    renderer.domElement.style.filter =
      currentCave ===
      "silver_grotto"
        ? "brightness(.82) saturate(.82) contrast(1.10)"
        : "brightness(.76) saturate(.78) contrast(1.10)";
  }

  else {

    let target =
      NIGHT;


    if (
      day >
      .72
    ) {

      target =
        DAY;
    }

    else if (
      clock.phase ===
      "dawn"
      ||
      clock.phase ===
      "evening"
    ) {

      target =
        DAWN;
    }


    const background =
      NIGHT
        .clone()
        .lerp(
          target,
          Math.max(
            .18,
            day,
          ),
        );


    scene.background.copy(
      background,
    );


    scene.fog.color.copy(
      background,
    );


    scene.fog.density =
      .0015
      +
      night *
      .0015;


    renderer.domElement.style.filter =
      `brightness(${
        (
          .72
          +
          day *
          .3
        ).toFixed(
          3,
        )
      }) saturate(${
        (
          .84
          +
          day *
          .2
        ).toFixed(
          3,
        )
      }) contrast(1.05)`;
  }


  if (
    waterMaterial
  ) {

    waterMaterial.uniforms
      .uTime
      .value =
      elapsed;


    waterMaterial.uniforms
      .uDaylight
      .value =
      day;
  }


  for (
    const entry
    of swayObjects
  ) {

    entry.mesh.rotation.z =
      entry.base
      +
      Math.sin(
        elapsed *
        1.7
        +
        entry.phase,
      )
      *
      .055;
  }


  for (
    const material
    of glowMaterials
  ) {

    material.opacity =
      currentCave
        ? .05
        : .08
          +
          night *
          .75;
  }


  for (
    const material
    of windowMaterials
  ) {

    material.opacity =
      .3
      +
      night *
      .65;
  }


  if (
    fireflyMaterial
  ) {

    fireflyMaterial.opacity =
      currentCave
        ? 0
        : Math.max(
            0,
            night -
            .18,
          );
  }


  for (
    let i = 0;
    i < fogPatches.length;
    i++
  ) {

    fogPatches[
      i
    ].material.opacity =
      .045
      +
      (
        Math.sin(
          elapsed *
          .45
          +
          i
        )
        *
        .5
        +
        .5
      )
      *
      .06;
  }
}
