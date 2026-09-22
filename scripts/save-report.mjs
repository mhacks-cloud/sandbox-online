import {
  existsSync,
  readFileSync,
} from "node:fs";

import {
  join,
} from "node:path";


const ROOT =
  process.cwd();


const PLAYER_FILE =
  join(
    ROOT,
    "data",
    "players.json",
  );


const WORLD_FILE =
  join(
    ROOT,
    "data",
    "world.json",
  );


function readJson(
  file,
) {

  if (
    !existsSync(
      file,
    )
  ) {

    return null;
  }


  try {

    return JSON.parse(
      readFileSync(
        file,
        "utf8",
      ),
    );
  }

  catch (
    error
  ) {

    console.error(
      `❌ Erro lendo ${file}:`,
      error.message,
    );


    return null;
  }
}


function duration(
  milliseconds,
) {

  milliseconds =
    Math.max(
      0,
      milliseconds,
    );


  const seconds =
    Math.ceil(
      milliseconds /
      1000,
    );


  if (
    seconds < 60
  ) {

    return `${seconds}s`;
  }


  const minutes =
    Math.floor(
      seconds /
      60,
    );


  const remainder =
    seconds %
    60;


  return `${minutes}m ${remainder}s`;
}


console.log("");
console.log("==============================================");
console.log(" SANDBOX ONLINE — RELATÓRIO DE SAVES");
console.log("==============================================");
console.log("");


const players =
  readJson(
    PLAYER_FILE,
  );


if (
  !players
) {

  console.log("👤 players.json: não encontrado.");
}

else {

  const entries =
    Object.entries(
      players,
    );


  console.log(
    `👤 Perfis salvos: ${entries.length}`,
  );


  for (
    const [
      profile,
      save,
    ]
    of entries
  ) {

    console.log(
      `   • ${profile}`
      +
      ` | ${save?.name ?? "sem nome"}`
      +
      ` | Nv.${save?.level ?? "?"}`
      +
      ` | ${save?.gold ?? 0} ouro`,
    );
  }
}


console.log("");


const world =
  readJson(
    WORLD_FILE,
  );


if (
  !world
) {

  console.log("🌍 world.json: ainda não existe.");
  console.log("   Ele será criado quando o servidor iniciar.");

  process.exit(
    0,
  );
}


const savedAt =
  Number(
    world.savedAt,
  )
  ||
  0;


console.log(
  "🌍 world.json:",
  savedAt
    ? new Date(
        savedAt,
      ).toLocaleString(
        "pt-BR",
      )
    : "sem data",
);


const plots =
  world.farmPlots
  &&
  typeof world.farmPlots ===
    "object"
    ? world.farmPlots
    : {};


const entries =
  Object.entries(
    plots,
  );


console.log(
  `🌱 Canteiros registrados: ${entries.length}`,
);


let planted =
  0;


const now =
  Date.now();


for (
  const [
    id,
    plot,
  ]
  of entries
) {

  const crop =
    String(
      plot?.crop
      ||
      "",
    );


  if (
    !crop
  ) {

    console.log(
      `   • ${id}: vazio`,
    );


    continue;
  }


  planted++;


  const plantedAt =
    Number(
      plot?.plantedAt,
    )
    ||
    0;


  const readyAt =
    Number(
      plot?.readyAt,
    )
    ||
    0;


  if (
    now >=
    readyAt
  ) {

    console.log(
      `   • ${id}: ${crop} ✅ PRONTO`,
    );


    continue;
  }


  const total =
    Math.max(
      1,
      readyAt -
      plantedAt,
    );


  const elapsed =
    Math.max(
      0,
      now -
      plantedAt,
    );


  const progress =
    Math.max(
      0,

      Math.min(
        100,

        Math.round(
          (
            elapsed /
            total
          )
          *
          100,
        ),
      ),
    );


  console.log(
    `   • ${id}: ${crop}`
    +
    ` · ${progress}%`
    +
    ` · faltam ${duration(
      readyAt -
      now,
    )}`,
  );
}


console.log("");
console.log(
  `🌾 Plantações ativas: ${planted}`,
);
console.log("");
