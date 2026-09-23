// @ts-nocheck

import * as THREE
from "three";


export const TOP_DOWN_CAMERA_HEIGHT =
  24;


const sortingPosition =
  new THREE.Vector3();



export function setupTopDownSprite(
  sprite,
) {

  if (
    !sprite
  ) {

    return sprite;
  }


  /*
   * O ponto do objeto fica nos pés.
   *
   * Isso é fundamental para jogos 2D top-down:
   * o personagem passa corretamente na frente ou atrás
   * de árvores, casas e NPCs.
   */

  sprite.center.set(
    .5,
    .08,
  );


  sprite.position.y =
    .12;


  if (
    sprite.material
  ) {

    sprite.material.depthTest =
      false;


    sprite.material.depthWrite =
      false;


    sprite.material.transparent =
      true;
  }


  return sprite;
}



export function configureTopDownCamera(
  camera,
) {

  /*
   * Câmera ortográfica totalmente superior.
   *
   * - X = horizontal da tela
   * - Z = vertical da tela
   */

  camera.up.set(
    0,
    0,
    -1,
  );


  camera.position.set(
    0,
    TOP_DOWN_CAMERA_HEIGHT,
    .001,
  );


  camera.lookAt(
    0,
    0,
    0,
  );


  camera.updateProjectionMatrix();
}



export function updateTopDownCamera(
  camera,
  focus,
  desired,
) {

  desired.set(
    focus.x,
    TOP_DOWN_CAMERA_HEIGHT,
    focus.z
    +
    .001,
  );


  camera.position.lerp(
    desired,
    .12,
  );


  camera.up.set(
    0,
    0,
    -1,
  );


  camera.lookAt(
    focus.x,
    0,
    focus.z,
  );
}



export function updateTopDownSorting(
  scene,
) {

  scene.updateMatrixWorld(
    true,
  );


  scene.traverse(
    (
      object,
    ) => {

      if (
        !object?.isSprite
      ) {

        return;
      }


      object.getWorldPosition(
        sortingPosition,
      );


      /*
       * Quanto maior Z, mais abaixo está na tela.
       * Logo deve desenhar por cima.
       */

      object.renderOrder =
        10000
        +
        Math.round(
          sortingPosition.z
          *
          100,
        );


      if (
        object.material
      ) {

        object.material.depthTest =
          false;


        object.material.depthWrite =
          false;
      }
    },
  );
}
