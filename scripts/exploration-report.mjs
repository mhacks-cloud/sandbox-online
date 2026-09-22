import {
  existsSync,
  readFileSync,
} from "node:fs";

import {
  join,
} from "node:path";


const file =
  join(
    process.cwd(),
    "data",
    "players.json",
  );


const landmarks = {

  village_waystone:
    "Pedra do Caminho",

  sunmeadow_outpost:
    "Posto do Prado",

  sunmeadow_ruins:
    "Ruínas do Prado",

  forest_outpost:
    "Refúgio do Lenhador",

  forest_watchtower:
    "Torre do Bosque",

  marsh_outpost:
    "Abrigo da Névoa",

  marsh_shrine:
    "Santuário Afundado",

  copper_outpost:
    "Posto das Colinas",

  copper_mine:
    "Mina Abandonada",

  silver_outpost:
    "Posto da Fronteira",

  silver_shrine:
    "Santuário Prateado",

};


console.log("");
console.log("==================================================");
console.log(" SANDBOX ONLINE — EXPLORAÇÃO");
console.log("==================================================");
console.log("");


if (
  !existsSync(
    file,
  )
) {

  console.log(
    "players.json ainda não existe.",
  );

  process.exit(
    0,
  );
}


let players;


try {

  players =
    JSON.parse(
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
    "Erro lendo players.json:",
    error.message,
  );

  process.exit(
    1,
  );
}


for (
  const [
    profile,
    save,
  ]
  of Object.entries(
    players,
  )
) {

  const known =
    Array.from(
      new Set(
        [
          "village_waystone",

          ...(
            Array.isArray(
              save.landmarks,
            )
              ? save.landmarks
              : []
          ),
        ],
      ),
    );


  console.log(
    `👤 ${
      save.name
      ||
      profile
    }`,
  );


  console.log(
    `   📍 ${
      known.filter(
        id =>
          landmarks[
            id
          ],
      ).length
    } / ${
      Object.keys(
        landmarks,
      ).length
    } descobertos`,
  );


  for (
    const [
      id,
      label,
    ]
    of Object.entries(
      landmarks,
    )
  ) {

    console.log(
      `      ${
        known.includes(
          id,
        )
          ? "✅"
          : "⬜"
      } ${label}`,
    );
  }


  console.log("");
}
