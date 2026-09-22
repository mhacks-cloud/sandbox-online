// @ts-nocheck

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";

import {
  join,
} from "node:path";


const DATA_DIR =
  join(
    process.cwd(),
    "data",
  );


export const WORLD_FILE =
  join(
    DATA_DIR,
    "world.json",
  );


const WORLD_TEMP_FILE =
  join(
    DATA_DIR,
    "world.tmp.json",
  );


function emptyWorldSave() {

  return {
    version: 1,
    savedAt: 0,
    farmPlots: {},
  };
}


function safeNumber(
  value,
) {

  const number =
    Number(
      value,
    );


  return Number.isFinite(
    number,
  )
    ? Math.max(
        0,
        number,
      )
    : 0;
}


function sanitizeFarmPlot(
  value,
) {

  if (
    !value
    ||
    typeof value !==
      "object"
  ) {

    return {
      crop: "",
      plantedAt: 0,
      readyAt: 0,
    };
  }


  const crop =
    typeof value.crop ===
    "string"
      ? value.crop
      : "";


  let plantedAt =
    safeNumber(
      value.plantedAt,
    );


  let readyAt =
    safeNumber(
      value.readyAt,
    );


  if (
    !crop
  ) {

    plantedAt =
      0;


    readyAt =
      0;
  }


  if (
    readyAt > 0
    &&
    plantedAt > readyAt
  ) {

    plantedAt =
      0;


    readyAt =
      0;
  }


  return {
    crop,
    plantedAt,
    readyAt,
  };
}


function sanitizeWorldSave(
  source,
) {

  const result =
    emptyWorldSave();


  if (
    !source
    ||
    typeof source !==
      "object"
  ) {

    return result;
  }


  result.version =
    Math.max(
      1,

      Math.floor(
        Number(
          source.version,
        )
        ||
        1,
      ),
    );


  result.savedAt =
    safeNumber(
      source.savedAt,
    );


  const farmPlots =
    source.farmPlots;


  if (
    farmPlots
    &&
    typeof farmPlots ===
      "object"
    &&
    !Array.isArray(
      farmPlots,
    )
  ) {

    for (
      const [
        id,
        value,
      ]
      of Object.entries(
        farmPlots,
      )
    ) {

      result.farmPlots[
        String(
          id,
        )
      ] =
        sanitizeFarmPlot(
          value,
        );
    }
  }


  return result;
}


export function loadWorldSave() {

  mkdirSync(
    DATA_DIR,
    {
      recursive: true,
    },
  );


  if (
    !existsSync(
      WORLD_FILE,
    )
  ) {

    console.log(
      "🌍 Nenhum world.json encontrado. Criando mundo novo.",
    );


    return emptyWorldSave();
  }


  try {

    const parsed =
      JSON.parse(
        readFileSync(
          WORLD_FILE,
          "utf8",
        ),
      );


    const world =
      sanitizeWorldSave(
        parsed,
      );


    console.log(
      `🌍 world.json carregado · ${
        Object.keys(
          world.farmPlots,
        ).length
      } canteiros registrados.`,
    );


    return world;
  }

  catch (
    error
  ) {

    console.error(
      "❌ world.json inválido:",
      error,
    );


    try {

      const brokenFile =
        join(
          DATA_DIR,

          `world.corrupt-${
            Date.now()
          }.json`,
        );


      renameSync(
        WORLD_FILE,
        brokenFile,
      );


      console.error(
        "🛟 Save corrompido preservado em:",
        brokenFile,
      );
    }

    catch (
      backupError
    ) {

      console.error(
        "Não foi possível preservar world.json corrompido:",
        backupError,
      );
    }


    return emptyWorldSave();
  }
}


export function snapshotFarmPlots(
  farmPlots,
) {

  const result = {};


  farmPlots.forEach(
    (
      plot,
      id,
    ) => {

      result[
        String(
          id,
        )
      ] = {

        crop:
          String(
            plot.crop
            ||
            "",
          ),

        plantedAt:
          safeNumber(
            plot.plantedAt,
          ),

        readyAt:
          safeNumber(
            plot.readyAt,
          ),
      };
    },
  );


  return result;
}


export function saveWorldSave(
  source,
) {

  mkdirSync(
    DATA_DIR,
    {
      recursive: true,
    },
  );


  const world =
    sanitizeWorldSave(
      source,
    );


  world.version =
    1;


  world.savedAt =
    Date.now();


  /*
   * SAVE ATÔMICO
   *
   * Primeiro escreve world.tmp.json.
   * Só depois troca pelo world.json oficial.
   *
   * Assim evitamos destruir o save caso
   * o processo seja interrompido durante
   * a escrita do arquivo.
   */

  writeFileSync(
    WORLD_TEMP_FILE,

    JSON.stringify(
      world,
      null,
      2,
    ),

    "utf8",
  );


  renameSync(
    WORLD_TEMP_FILE,
    WORLD_FILE,
  );


  return world;
}
