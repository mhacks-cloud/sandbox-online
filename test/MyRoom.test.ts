import assert from "assert";
import {
  ColyseusTestServer,
  boot,
} from "@colyseus/testing";

import appConfig
from "../src/app.config.js";

import {
  MyRoomState,
}
from "../src/rooms/schema/MyRoomState.js";


describe(
  "Sandbox Online",
  () => {

    let colyseus:
      ColyseusTestServer<
        typeof appConfig
      >;


    before(
      async () => {

        colyseus =
          await boot(
            appConfig,
          );
      },
    );


    after(
      async () => {

        await colyseus.shutdown();
      },
    );


    beforeEach(
      async () => {

        await colyseus.cleanup();
      },
    );


    it(
      "cria um jogador ao entrar na sala",
      async () => {

        const room =
          await colyseus
            .createRoom<
              MyRoomState
            >(
              "my_room",
              {},
            );


        const client =
          await colyseus
            .connectTo(
              room,
            );


        const player =
          room.state.players.get(
            client.sessionId,
          );


        assert.ok(
          player,
          "Player deve existir após o login.",
        );


        assert.strictEqual(
          typeof player.x,
          "number",
        );


        assert.strictEqual(
          typeof player.z,
          "number",
        );
      },
    );


    it(
      "mantém as coleções principais do mundo disponíveis",
      async () => {

        const room =
          await colyseus
            .createRoom<
              MyRoomState
            >(
              "my_room",
              {},
            );


        assert.ok(
          room.state.players,
        );


        assert.ok(
          room.state.nodes,
        );


        assert.ok(
          room.state.enemies,
        );


        assert.ok(
          room.state.farmPlots,
        );
      },
    );
  },
);
