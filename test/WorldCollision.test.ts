import assert
from "assert";

import {
  isStaticBlocked,
  movementBoundsFor,
  resolvePlayerMovement,
}
from "../src/shared/worldCollision.js";


describe(
  "World Collision",
  () => {

    it(
      "mantém o spawn livre",
      () => {

        assert.strictEqual(
          isStaticBlocked(
            0,
            1,
          ),
          false,
        );
      },
    );


    it(
      "bloqueia uma casa",
      () => {

        assert.strictEqual(
          isStaticBlocked(
            -13,
            -12,
          ),
          true,
        );
      },
    );


    it(
      "bloqueia o centro do Lago da Vila",
      () => {

        assert.strictEqual(
          isStaticBlocked(
            14,
            14,
          ),
          true,
        );


        assert.strictEqual(
          isStaticBlocked(
            9,
            14,
          ),
          false,
        );
      },
    );


    it(
      "permite slide pelo eixo livre",
      () => {

        const result =
          resolvePlayerMovement(
            -15.6,
            -10.5,
            .8,
            .5,
          );


        assert.ok(
          Math.abs(
            result.x -
            -15.6,
          )
          <
          .001,
        );


        assert.ok(
          result.z >
          -10.5,
        );
      },
    );


    it(
      "respeita limite da caverna",
      () => {

        const bounds =
          movementBoundsFor(
            "copper_depths",
          );


        const result =
          resolvePlayerMovement(
            bounds.minX +
            .1,

            118,

            -2,

            0,

            {
              caveId:
                "copper_depths",
            },
          );


        assert.ok(
          result.x >=
          bounds.minX,
        );
      },
    );


    it(
      "aceita colisão dinâmica",
      () => {

        const result =
          resolvePlayerMovement(
            0,
            0,
            1,
            0,

            {
              dynamicBlocked:
                (
                  x: number,
                  _z: number,
                ) =>
                  x >
                  .5,
            },
          );


        assert.strictEqual(
          result.x,
          0,
        );
      },
    );

  },
);
