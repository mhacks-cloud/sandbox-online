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


const regions = {
  village:
    "Vila do Vale",

  sunmeadow:
    "Prado do Sul",

  ancient_forest:
    "Bosque Antigo",

  mist_marsh:
    "Pântano da Névoa",

  copper_highlands:
    "Colinas de Cobre",

  silver_frontier:
    "Fronteira Prateada",
};


console.log("");
console.log("==================================================");
console.log(" SANDBOX ONLINE — REGIÕES");
console.log("==================================================");
console.log("");


if (
  !existsSync(
    file,
  )
) {

  console.log(
    "players.json não encontrado.",
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

  const discoveries =
    Array.isArray(
      save.discoveries,
    )
      ? save.discoveries
      : [];


  console.log(
    `👤 ${
      save.name
      ||
      profile
    }`,
  );


  console.log(
    `   🧭 ${
      discoveries.length
    } / ${
      Object.keys(
        regions,
      ).length
    } regiões`,
  );


  for (
    const [
      id,
      label,
    ]
    of Object.entries(
      regions,
    )
  ) {

    console.log(
      `   ${
        discoveries.includes(
          id,
        )
          ? "✅"
          : "⬜"
      } ${label}`,
    );
  }


  console.log("");
}
