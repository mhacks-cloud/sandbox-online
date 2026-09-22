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


console.log("");
console.log("==================================================");
console.log(" SANDBOX ONLINE — PROGRESSÃO");
console.log("==================================================");
console.log("");


if (
  !existsSync(
    file,
  )
) {

  console.log("players.json não encontrado.");
  process.exit(0);
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

  process.exit(1);
}


const names = {
  woodcutting: "Lenhador",
  mining: "Minerador",
  gathering: "Coletor",
  fishing: "Pescador",
  farming: "Agricultor",
  cooking: "Cozinheiro",
  production: "Artesão",
};


for (
  const [
    id,
    save,
  ]
  of Object.entries(
    players,
  )
) {

  console.log(
    `👤 ${
      save.name
      ||
      id
    } · Nv.${
      save.level
      ||
      1
    }`,
  );


  const professions =
    save.professions
    ||
    {};


  for (
    const [
      key,
      label,
    ]
    of Object.entries(
      names,
    )
  ) {

    const data =
      professions[
        key
      ]
      ||
      {
        level: 1,
        xp: 0,
      };


    const marker =
      data.level >=
      10
        ? "🏆"
        : data.level >=
          5
          ? "⭐"
          : "•";


    console.log(
      `   ${marker} ${
        label.padEnd(
          12,
        )
      } Nv.${
        String(
          data.level
          ||
          1,
        ).padStart(
          2,
          " ",
        )
      } · ${
        data.xp
        ||
        0
      } XP`,
    );
  }


  console.log("");
}
