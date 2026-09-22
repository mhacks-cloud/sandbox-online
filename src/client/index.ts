// @ts-nocheck

import * as THREE
from "three";

import {
  Client,
  Callbacks,
}
from "@colyseus/sdk";

import {
  INVENTORY_SIZE,
  CHEST_SIZE,
  HOTBAR_SIZE,
  PROFESSION_IDS,
  PROFESSION_NAMES,
  PROFESSION_UNLOCKS,
  WORLD_BOUNDS,
  REGION_ORDER,
  REGIONS,
  getRegionAt,
  LANDMARK_ORDER,
  LANDMARKS,
  LOCATIONS,
  RARITIES,
  TOOL_TIERS,
  RESOURCE_TYPES,
  FISHING_SPOTS,
  CROPS,
  ITEM_CATALOG,
  WORKBENCH_RECIPES,
  FURNACE_RECIPES,
  MILL_RECIPES,
  KITCHEN_RECIPES,
  ENEMY_TYPES,
  QUESTS,
  NPC_NAMES,
} from "../shared/gameData";

import {
  REGIONAL_NPCS,
  regionalNpcPositionAt,
  regionalMarketForSource,
} from "../shared/regionalWorld";

import {
  REGION_BOARD_NPC,
  REGIONAL_CONTRACT_BY_ID,
  reputationTier,
  regionalPrice,
  regionalEventAt,
} from "../shared/regionalProgression";


const EQUIPMENT_LABELS = {

  weapon: "Arma",
  offhand: "Mão secundária",
  helmet: "Cabeça",
  body: "Corpo",
  boots: "Botas",

};



/*
 * ETAPA 11.3D SERVICES
 */

const OUTPOST_SERVICES = {

  sunmeadow_outpost: {
    type: "shop",
    label: "Comércio do Prado",
  },

  forest_outpost: {
    type: "chest",
    label: "Baú do Refúgio",
  },

  marsh_outpost: {
    type: "chest",
    label: "Baú do Abrigo",
  },

  copper_outpost: {
    type: "workbench",
    label: "Bancada das Colinas",
  },

  silver_outpost: {
    type: "furnace",
    label: "Forno da Fronteira",
  },

};



document.body.insertAdjacentHTML(
  "beforeend",

  `
  <div id="login-screen">
    <div class="panel login-panel">
      <div class="eyebrow">SANDBOX ONLINE</div>
      <h1>Entrar no mundo</h1>
      <p>RPG multiplayer pixel-art 2.5D</p>
      <input id="player-name" maxlength="18" autocomplete="off">
      <button id="play-button">ENTRAR</button>
      <div id="login-status"></div>
    </div>
  </div>

  <div id="hud">

    <div class="panel player-panel">
      <div class="portrait">⚔</div>

      <div class="player-data">
        <strong id="hud-name">---</strong>

        <div class="hp-bar">
          <div id="hp-fill"></div>
        </div>

        <div class="status-line">
          <span id="hp-text">100/100</span>
          <span id="level-text">Nv.1</span>
        </div>

        <div class="xp-bar">
          <div id="xp-fill"></div>
        </div>

        <div class="combat-stats">
          ⚔ <span id="attack-text">2</span>
          &nbsp;
          🛡 <span id="defense-text">0</span>
        </div>
      </div>
    </div>

    <div class="panel online-panel">
      <span class="online-dot"></span>
      <span id="online-count">0</span>
      online
    </div>

    <div class="panel gold-panel">
      🪙 <strong id="gold-count">0</strong>
    </div>

    <div
      id="region-badge"
      class="panel region-badge"
    >
      🧭
      <strong>Vila do Vale</strong>
      <small>Recomendado Nv.1</small>
    </div>

    <div class="panel quest-tracker">
      <div class="eyebrow">MISSÕES · Q</div>
      <div id="quest-tracker-list">Nenhuma missão ativa.</div>
    </div>

    <div
      id="inventory-panel"
      class="panel inventory-panel interactive"
    >
      <div class="window-title">
        <div>
          <div class="eyebrow">INVENTÁRIO</div>
          <small>selecione dois slots para mover</small>
        </div>

        <button id="inventory-close" class="close-button">×</button>
      </div>

      <div class="inventory-layout">
        <div>
          <div
            id="inventory-grid"
            class="slot-grid inventory-grid"
          ></div>

          <div id="selected-info">
            Selecione um item.
          </div>
        </div>

        <div class="equipment-area">
          <div class="eyebrow">EQUIPAMENTO</div>
          <div id="equipment-grid"></div>

          <div class="equipment-stats">
            ⚔ Ataque:
            <strong id="inventory-attack">2</strong>
            <br>
            🛡 Defesa:
            <strong id="inventory-defense">0</strong>
            <br>
            ♥ Vida:
            <strong id="inventory-hp">100</strong>
          </div>
        </div>
      </div>
    </div>

    <div id="hotbar"></div>

    <div id="interaction">
      [ E ] Interagir
    </div>

    <div class="controls">
      WASD/Setas mover · 1–5 hotbar · E interagir ·
      ESPAÇO atacar · F usar · I inventário ·
      Q missões · P profissões · M regiões · T teste · Y viajar
    </div>

  </div>


  <div id="shop-panel" class="panel modal interactive">
    <button class="modal-close" data-close-modal>×</button>

    <div class="eyebrow">OTTO · COMERCIANTE</div>

    <h2>
      Mercado da Vila
    </h2>

    <div class="modal-section">

      <strong>
        Comprar
      </strong>

      <div id="shop-buy-list"></div>

    </div>

    <div class="modal-section">

      <strong>
        Vender
      </strong>

      <div id="shop-sell-list"></div>

    </div>
  </div>


  <div id="craft-panel" class="panel modal interactive">
    <button class="modal-close" data-close-modal>×</button>

    <div class="eyebrow" id="craft-station-title">
      BANCADA
    </div>

    <h2>Produção</h2>

    <div id="craft-buttons"></div>
  </div>


  <div id="chest-panel" class="panel modal interactive">
    <button class="modal-close" data-close-modal>×</button>

    <div class="eyebrow">BAÚ PESSOAL</div>
    <h2>Armazenamento</h2>

    <div
      id="chest-grid"
      class="slot-grid chest-grid"
    ></div>
  </div>


  <div
    id="regional-dialog-panel"
    class="panel modal interactive"
  >
    <button
      class="modal-close"
      data-close-modal
    >
      ×
    </button>

    <div
      id="regional-dialog-role"
      class="eyebrow"
    >
      VIAJANTE
    </div>

    <h2 id="regional-dialog-name">
      Morador
    </h2>

    <div class="modal-section">

      <p id="regional-dialog-text">
        ...
      </p>

      <div
        id="regional-dialog-tip"
        class="profession-info"
      >
      </div>

      <button
        id="regional-dialog-market"
        class="quest-action"
        type="button"
        style="margin-top:12px"
      >
        🪙 NEGOCIAR
      </button>

      <button
        id="regional-dialog-contracts"
        class="quest-action"
        type="button"
        style="margin-top:8px"
      >
        📜 CONTRATOS REGIONAIS
      </button>

    </div>
  </div>


  <div
    id="regional-contract-panel"
    class="panel modal interactive"
  >
    <button
      class="modal-close"
      data-close-modal
    >
      ×
    </button>

    <div
      id="regional-contract-region"
      class="eyebrow"
    >
      CONTRATOS REGIONAIS
    </div>

    <h2>
      Quadro de Contratos
    </h2>

    <div
      id="regional-reputation-summary"
      class="profession-info"
    >
    </div>

    <div
      id="regional-event-box"
      class="quest-card"
      style="margin-top:12px"
    >
    </div>

    <div
      id="regional-contract-list"
      style="margin-top:12px"
    >
    </div>
  </div>


  <div id="quest-panel" class="panel modal interactive">
    <button class="modal-close" data-close-modal>×</button>

    <div class="eyebrow">MISSÕES</div>
    <h2 id="quest-panel-title">Diário de Missões</h2>

    <div id="quest-list"></div>
  </div>


  <div id="profession-panel" class="panel modal interactive">
    <button class="modal-close" data-close-modal>×</button>

    <div class="eyebrow">PROFISSÕES</div>
    <h2>Habilidades de Vida</h2>

    <div id="profession-list"></div>
  </div>


  <div
    id="region-map-panel"
    class="panel modal interactive"
  >
    <button
      class="modal-close"
      data-close-modal
    >
      ×
    </button>

    <div class="eyebrow">
      MUNDO · M
    </div>

    <h2>
      Regiões Conhecidas
    </h2>

    <div id="region-map-summary"></div>

    <div class="travel-map-hint">
      🌀 Viagem rápida:
      Vila do Vale ↔ Posto do Prado
    </div>

    <div id="region-map-list"></div>
  </div>


  <div id="toast"></div>
`,
);


const style =
  document.createElement(
    "style",
  );


style.textContent = `

* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  background: #101512;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

button,
input {
  font-family: inherit;
}

button {
  cursor: pointer;
}

#app canvas {
  display: block;
  width: 100vw !important;
  height: 100vh !important;
  image-rendering: pixelated;
}

.panel {
  background: rgba(15,27,23,.95);
  border: 3px solid #31483d;
  color: #f1ead7;
  box-shadow: 5px 5px 0 rgba(0,0,0,.25);
}

.interactive {
  pointer-events: auto;
}

.eyebrow {
  color: #d9b864;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

#login-screen {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7,13,12,.96);
}

.login-panel {
  width: min(420px, calc(100vw - 30px));
  padding: 30px;
  border-color: #806a3d;
}

#player-name {
  width: 100%;
  height: 47px;
  padding: 0 11px;
  border: 3px solid #3d4a42;
  background: #0c1411;
  color: white;
  outline: none;
}

#play-button {
  width: 100%;
  height: 49px;
  margin-top: 10px;
  border: 0;
  border-bottom: 4px solid #80642f;
  background: #d7ae51;
  font-weight: 900;
}

#login-status {
  min-height: 18px;
  margin-top: 8px;
  color: #e58a78;
  font-size: 10px;
}

#hud {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.player-panel {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 290px;
  padding: 10px;
  display: flex;
  gap: 10px;
}

.portrait {
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  border: 3px solid #806a3d;
  background: #403729;
  font-size: 22px;
}

.player-data {
  flex: 1;
}

#hud-name {
  display: block;
  margin-bottom: 5px;
}

.hp-bar,
.xp-bar {
  background: #211a1b;
  border: 2px solid #13100f;
}

.hp-bar {
  height: 10px;
}

.xp-bar {
  height: 6px;
  margin-top: 4px;
}

#hp-fill {
  height: 100%;
  background: #c64c47;
}

#xp-fill {
  height: 100%;
  background: #6597c7;
}

.status-line {
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
  color: #a9b7ad;
  font-size: 8px;
}

.combat-stats {
  margin-top: 5px;
  font-size: 9px;
}

.online-panel {
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 8px 11px;
  font-size: 10px;
}

.online-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 5px;
  background: #62bd69;
}

.gold-panel {
  position: absolute;
  right: 16px;
  top: 60px;
  min-width: 100px;
  padding: 8px;
  text-align: center;
}

.quest-tracker {
  position: absolute;
  left: 16px;
  top: 122px;
  width: 245px;
  padding: 9px;
}

#quest-tracker-list {
  margin-top: 6px;
  color: #bec9c0;
  font-size: 8px;
  line-height: 1.55;
}

.tracker-quest {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid #33473e;
}

.tracker-quest strong {
  display: block;
  color: #dbc176;
}

.inventory-panel {
  display: none;
  position: absolute;
  right: 16px;
  top: 105px;
  width: 520px;
  max-height: calc(100vh - 160px);
  overflow: auto;
  padding: 12px;
}

.window-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button,
.modal-close {
  border: 0;
  background: transparent;
  color: white;
  font-size: 22px;
}

.inventory-layout {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 12px;
  margin-top: 10px;
}

.slot-grid {
  display: grid;
  gap: 5px;
}

.inventory-grid,
.chest-grid {
  grid-template-columns: repeat(6,1fr);
}

.item-slot {
  position: relative;
  aspect-ratio: 1/1;
  min-width: 0;
  padding: 3px;
  border: 2px solid #3b5046;
  background: #202d28;
  color: #eee5d0;
}

.item-slot.selected {
  border-color: #e0b95e;
}

.item-slot.rarity-uncommon {
  border-color: #4aa96c;
}

.item-slot.rarity-rare {
  border-color: #4b83d4;
}

.item-slot.rarity-epic {
  border-color: #a45ac7;
}

.item-slot.rarity-legendary {
  border-color: #e4a743;
}

.slot-icon {
  display: block;
  font-size: 22px;
}

.slot-name {
  display: block;
  overflow: hidden;
  font-size: 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slot-qty {
  position: absolute;
  right: 3px;
  bottom: 2px;
  padding: 1px 3px;
  background: rgba(0,0,0,.7);
  font-size: 9px;
}

#selected-info {
  min-height: 45px;
  margin-top: 8px;
  padding: 7px;
  border: 1px solid #32463c;
  background: #111b17;
  font-size: 9px;
}

.selected-action {
  margin-left: 8px;
  padding: 4px 7px;
  border: 0;
  background: #d1a94e;
  font-size: 8px;
  font-weight: 900;
}

.equipment-area {
  padding-left: 10px;
  border-left: 1px solid #34493e;
}

#equipment-grid {
  display: grid;
  gap: 5px;
  margin-top: 8px;
}

.equipment-slot {
  width: 100%;
  min-height: 50px;
  padding: 5px;
  border: 2px solid #3b5046;
  background: #202d28;
  color: white;
  text-align: left;
}

.equipment-slot.rarity-uncommon {
  border-color: #4aa96c;
}

.equipment-slot.rarity-rare {
  border-color: #4b83d4;
}

.equipment-slot.rarity-epic {
  border-color: #a45ac7;
}

.equipment-slot.rarity-legendary {
  border-color: #e4a743;
}

.equipment-slot small {
  display: block;
  color: #83958a;
  font-size: 7px;
}

.equipment-slot strong {
  font-size: 9px;
}

.equipment-stats {
  margin-top: 10px;
  padding: 7px;
  background: #111b17;
  font-size: 9px;
  line-height: 1.8;
}

.rarity-text-common {
  color: #c6cec8;
}

.rarity-text-uncommon {
  color: #65c882;
}

.rarity-text-rare {
  color: #6ca5f2;
}

.rarity-text-epic {
  color: #c278e2;
}

.rarity-text-legendary {
  color: #efb853;
}

#hotbar {
  position: absolute;
  left: 50%;
  bottom: 58px;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  pointer-events: auto;
}

.hotbar-slot {
  position: relative;
  width: 70px;
  height: 62px;
  border: 3px solid #334a3f;
  background: rgba(20,31,27,.96);
  color: white;
}

.hotbar-slot.active {
  transform: translateY(-5px);
  border-color: #d5af56;
}

.hotbar-key {
  position: absolute;
  left: 4px;
  top: 2px;
  font-size: 9px;
}

.hotbar-icon {
  display: block;
  font-size: 25px;
}

.hotbar-name {
  display: block;
  font-size: 7px;
}

#interaction {
  display: none;
  position: absolute;
  left: 50%;
  bottom: 136px;
  transform: translateX(-50%);
  padding: 8px 13px;
  border: 3px solid #c19b50;
  background: #18251f;
  color: #f3ddb0;
  font-size: 10px;
}

.controls {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  padding: 8px 11px;
  border: 3px solid #31483d;
  background: rgba(15,27,23,.92);
  color: #dfd3ba;
  font-size: 9px;
  white-space: nowrap;
}

.world-label {
  position: fixed;
  z-index: 20;
  transform: translate(-50%,-100%);
  padding: 3px 7px;
  border: 2px solid #63766a;
  background: rgba(13,18,16,.87);
  color: #f5edd7;
  font: 700 10px monospace;
  white-space: nowrap;
  pointer-events: none;
}

.world-label.mine {
  color: #ffe39a;
  border-color: #b9954e;
}

.world-label.npc {
  color: #d9c379;
  border-color: #807044;
  font-size: 8px;
}

.enemy-label {
  min-width: 100px;
  border-color: #784d43;
  text-align: center;
}

.enemy-hp-back {
  width: 80px;
  height: 6px;
  margin: 3px auto 0;
  background: #281719;
  border: 1px solid #0d0909;
}

.enemy-hp-fill {
  display: block;
  height: 100%;
  background: #b63f3f;
}

.modal {
  display: none;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: min(480px,calc(100vw - 30px));
  max-height: 85vh;
  overflow: auto;
  padding: 22px;
  pointer-events: auto;
}

.modal-close {
  position: absolute;
  right: 7px;
  top: 4px;
}

.modal-section {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #34483e;
}

.modal button[data-buy],
.modal button[data-sell],
.craft-button,
.quest-action {
  width: 100%;
  min-height: 40px;
  margin-top: 6px;
  padding: 7px;
  border: 0;
  border-bottom: 4px solid #785e2c;
  background: #d0a94e;
  font: 800 10px monospace;
}

.quest-card,
.profession-card {
  margin-top: 10px;
  padding: 11px;
  border: 2px solid #354a40;
  background: #17221d;
}

.quest-card.ready {
  border-color: #b39349;
}

.quest-card.done {
  opacity: .6;
}

.quest-card h3,
.profession-card h3 {
  margin: 0 0 6px;
  color: #ead8aa;
  font-size: 12px;
}

.quest-card p {
  color: #aebbb1;
  font-size: 9px;
}

.quest-objective {
  margin: 3px 0;
  color: #b7c3ba;
  font-size: 9px;
}

.quest-reward {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid #33473e;
  color: #d6b868;
  font-size: 8px;
}

.profession-xp {
  height: 8px;
  margin-top: 7px;
  border: 1px solid #172019;
  background: #0d1411;
}

.profession-xp-fill {
  height: 100%;
  background: #6a9b65;
}

.profession-info {
  margin-top: 5px;
  color: #aab7ae;
  font-size: 9px;
}


.region-badge {
  position: absolute;
  right: 16px;
  top: 104px;
  min-width: 190px;
  padding: 8px 10px;
  text-align: right;
}

.region-badge strong {
  display: block;
  color: #dfc374;
  font-size: 10px;
}

.region-badge small {
  display: block;
  margin-top: 2px;
  color: #aebbb1;
  font-size: 8px;
}

#region-map-summary {
  margin: 8px 0 12px;
  color: #b6c2b8;
  font-size: 9px;
}

.region-map-card {
  margin-top: 8px;
  padding: 10px;
  border: 2px solid #344a40;
  background: #15201b;
}

.region-map-card.current {
  border-color: #d1aa52;
}

.region-map-card.locked {
  opacity: .45;
}

.region-map-card h3 {
  margin: 0 0 5px;
  color: #ead8aa;
  font-size: 12px;
}

.region-map-card p {
  margin: 4px 0;
  color: #aebbb1;
  font-size: 9px;
}

.region-map-activities {
  margin-top: 7px;
  color: #d0bd83;
  font-size: 8px;
  line-height: 1.5;
}


.landmark-map-section {
  margin-top: 9px;
  padding-top: 7px;
  border-top: 1px solid #31443a;
}

.landmark-map-title {
  margin-bottom: 5px;
  color: #d0bd83;
  font-size: 8px;
}

.landmark-map-item {
  margin: 3px 0;
  color: #b7c6bb;
  font-size: 8px;
  line-height: 1.4;
}

.landmark-map-item.unknown {
  opacity: .42;
}


.travel-map-hint {
  margin: 8px 0 10px;
  padding: 7px 8px;
  border: 1px solid #34483e;
  background: #111a16;
  color: #9eada2;
  font-size: 8px;
  line-height: 1.5;
}

.travel-map-button {
  display: block;
  width: 100%;
  min-height: 32px;
  margin-top: 9px;
  padding: 7px 8px;

  border:
    1px solid #80692e;

  border-bottom:
    3px solid #654f21;

  background:
    #c6a34d;

  color:
    #172019;

  font:
    900 9px monospace;

  cursor:
    pointer;
}

.travel-map-button:hover {
  filter:
    brightness(1.08);
}

.travel-map-button:disabled {
  cursor:
    default;

  opacity:
    .5;

  filter:
    none;
}

.travel-map-lock {
  margin-top: 8px;
  padding: 6px 7px;
  border: 1px solid #403f35;
  background: #171914;
  color: #827f6d;
  font-size: 8px;
}

/*
 * ETAPA 11.3C MAP TRAVEL
 */




#toast {
  position: fixed;
  z-index: 300;
  left: 50%;
  top: 21%;
  transform: translateX(-50%);
  padding: 8px 13px;
  opacity: 0;
  border: 2px solid #b9954e;
  background: rgba(20,29,25,.96);
  color: #f2dfae;
  font: 700 10px monospace;
  pointer-events: none;
}

`;


document.head.appendChild(
  style,
);


const $ =
  (
    query,
  ) =>
    document.querySelector(
      query,
    );


const loginScreen =
  $("#login-screen");

const playerNameInput =
  $("#player-name");

const playButton =
  $("#play-button");

const loginStatus =
  $("#login-status");

const hud =
  $("#hud");

const hudName =
  $("#hud-name");

const hpFill =
  $("#hp-fill");

const xpFill =
  $("#xp-fill");

const hpText =
  $("#hp-text");

const levelText =
  $("#level-text");

const attackText =
  $("#attack-text");

const defenseText =
  $("#defense-text");

const onlineCount =
  $("#online-count");

const goldCount =
  $("#gold-count");

const regionBadge =
  $("#region-badge");

const questTrackerList =
  $("#quest-tracker-list");

const inventoryPanel =
  $("#inventory-panel");

const inventoryGrid =
  $("#inventory-grid");

const equipmentGrid =
  $("#equipment-grid");

const selectedInfo =
  $("#selected-info");

const hotbarElement =
  $("#hotbar");

const interaction =
  $("#interaction");

const shopPanel =
  $("#shop-panel");


const shopEyebrow =
  shopPanel
    ?.querySelector(
      ".eyebrow",
    );


const shopHeading =
  shopPanel
    ?.querySelector(
      "h2",
    );


const shopBuyList =
  $("#shop-buy-list");

const shopSellList =
  $("#shop-sell-list");


const craftPanel =
  $("#craft-panel");

const craftButtons =
  $("#craft-buttons");

const craftStationTitle =
  $("#craft-station-title");

const chestPanel =
  $("#chest-panel");


const chestEyebrow =
  chestPanel
    ?.querySelector(
      ".eyebrow",
    );


const chestHeading =
  chestPanel
    ?.querySelector(
      "h2",
    );


const chestGrid =
  $("#chest-grid");


const regionalDialogPanel =
  $("#regional-dialog-panel");

const regionalDialogRole =
  $("#regional-dialog-role");

const regionalDialogName =
  $("#regional-dialog-name");

const regionalDialogText =
  $("#regional-dialog-text");

const regionalDialogTip =
  $("#regional-dialog-tip");

const regionalDialogMarketButton =
  $("#regional-dialog-market");

const regionalDialogContractsButton =
  $("#regional-dialog-contracts");


const regionalContractPanel =
  $("#regional-contract-panel");

const regionalContractRegion =
  $("#regional-contract-region");

const regionalReputationSummary =
  $("#regional-reputation-summary");

const regionalEventBox =
  $("#regional-event-box");

const regionalContractList =
  $("#regional-contract-list");


const questPanel =
  $("#quest-panel");

const questPanelTitle =
  $("#quest-panel-title");

const questList =
  $("#quest-list");

const professionPanel =
  $("#profession-panel");

const professionList =
  $("#profession-list");

const regionMapPanel =
  $("#region-map-panel");

const regionMapSummary =
  $("#region-map-summary");

const regionMapList =
  $("#region-map-list");

const toast =
  $("#toast");


playerNameInput.value =
  localStorage.getItem(
    "sandbox-name",
  )
  ||
  "Aventureiro";


function parseArray(
  json,
  size,
) {

  try {

    const value =
      JSON.parse(
        json
        ||
        "[]",
      );


    if (
      Array.isArray(
        value,
      )
    ) {

      return Array.from(
        {
          length:
            size,
        },

        (
          _,
          index,
        ) =>
          value[
            index
          ]
          ||
          null,
      );
    }
  }

  catch {
  }


  return Array.from(
    {
      length:
        size,
    },
    () => null,
  );
}


function parseObject(
  json,
) {

  try {

    const value =
      JSON.parse(
        json
        ||
        "{}",
      );


    return (
      value
      &&
      typeof value ===
        "object"
      &&
      !Array.isArray(
        value,
      )
    )
      ? value
      : {};
  }

  catch {

    return {};
  }
}



function parseStringList(
  json,
) {

  try {

    const value =
      JSON.parse(
        json
        ||
        "[]",
      );


    if (
      Array.isArray(
        value,
      )
    ) {

      return value
        .map(
          (
            item,
          ) =>
            String(
              item,
            ),
        )
        .filter(
          (
            item,
            index,
            list,
          ) =>
            REGIONS[
              item
            ]
            &&
            list.indexOf(
              item,
            )
            ===
            index,
        );
    }
  }

  catch {
  }


  return [];
}


function discoveredRegions() {

  if (
    !localPlayer
  ) {

    return [];
  }


  return parseStringList(
    localPlayer.discoveriesJson,
  );
}



function nearestOutpostService(
  x,
  z,
  radius =
    3.25,
) {

  let result =
    null;


  for (
    const [
      id,
      service,
    ]
    of Object.entries(
      OUTPOST_SERVICES,
    )
  ) {

    const landmark =
      LANDMARKS[
        id
      ];


    if (
      !landmark
    ) {

      continue;
    }


    const distance =
      Math.hypot(
        landmark.x -
        x,

        landmark.z -
        z,
      );


    if (
      distance <=
      radius
      &&
      (
        !result
        ||
        distance <
        result.distance
      )
    ) {

      result = {
        id,
        service,
        landmark,
        distance,
      };
    }
  }


  return result;
}



function nearestRegionalNpc(
  x,
  z,
  radius =
    2.6,
) {

  let result =
    null;


  const now =
    Date.now();


  for (
    const [
      id,
      npc,
    ]
    of Object.entries(
      REGIONAL_NPCS,
    )
  ) {

    const position =
      regionalNpcPositionAt(
        id,
        now,
      );


    if (
      !position
    ) {

      continue;
    }


    const distance =
      Math.hypot(
        position.x -
        x,

        position.z -
        z,
      );


    if (
      distance <=
      radius
      &&
      (
        !result
        ||
        distance <
        result.distance
      )
    ) {

      result = {

        id,

        npc,

        x:
          position.x,

        z:
          position.z,

        distance,
      };
    }
  }


  return result;
}


function profileForName(
  name,
) {

  const key =
    `sandbox-profile:${
      name.toLocaleLowerCase()
    }`;


  let id =
    localStorage.getItem(
      key,
    );


  if (
    !id
  ) {

    id =
      crypto.randomUUID();


    localStorage.setItem(
      key,
      id,
    );
  }


  return id;
}


function xpNeeded(
  level,
) {

  return (
    40
    +
    (
      level -
      1
    )
    *
    25
  );
}


function professionXpNeeded(
  level,
) {

  return (
    35
    +
    (
      level -
      1
    )
    *
    30
  );
}



function clientProfessionLevel(
  profession,
) {

  return Math.max(
    1,

    Number(
      professions()?.[
        profession
      ]?.level,
    )
    ||
    1,
  );
}


function clientToolTier(
  itemId,
  kind,
) {

  const tool =
    TOOL_TIERS[
      itemId
    ];


  if (
    !tool
    ||
    tool.kind !==
    kind
  ) {

    return 0;
  }


  return Number(
    tool.tier,
  )
  ||
  0;
}


function nearestFishingSpot(
  x,
  z,
  radius =
    4.5,
) {

  let result =
    null;


  for (
    const [
      id,
      spot,
    ]
    of Object.entries(
      FISHING_SPOTS,
    )
  ) {

    const distance =
      Math.hypot(
        spot.x -
        x,

        spot.z -
        z,
      );


    if (
      distance <=
      radius
      &&
      (
        !result
        ||
        distance <
        result.distance
      )
    ) {

      result = {
        id,
        spot,
        distance,
      };
    }
  }


  return result;
}


/*
 * PIXEL HELPERS
 */

function canvasTexture(
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


function makeSprite(
  texture,
  width,
  height,
) {

  const result =
    new THREE.Sprite(

      new THREE.SpriteMaterial(
        {
          map: texture,
          transparent: true,
          alphaTest: .05,
        },
      ),
    );


  result.scale.set(
    width,
    height,
    1,
  );


  result.position.y =
    height /
    2;


  return result;
}


function shadow(
  radius,
) {

  const mesh =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        radius,
        18,
      ),

      new THREE.MeshBasicMaterial(
        {
          color: 0,
          transparent: true,
          opacity: .18,
        },
      ),
    );


  mesh.rotation.x =
    -Math.PI /
    2;


  mesh.position.y =
    .02;


  return mesh;
}



function simpleTexture(
  kind,
) {

  return canvasTexture(
    (
      ctx,
      w,
      h,
    ) => {

      if (
        kind ===
        "tree"
        ||
        kind ===
        "hard_tree"
      ) {

        ctx.fillStyle =
          kind ===
          "hard_tree"
            ? "#523526"
            : "#654029";

        ctx.fillRect(21,35,7,27);


        ctx.fillStyle =
          kind ===
          "hard_tree"
            ? "#214b35"
            : "#285d3d";

        ctx.fillRect(9,15,30,30);


        ctx.fillStyle =
          kind ===
          "hard_tree"
            ? "#2b6340"
            : "#36784a";

        ctx.fillRect(14,8,20,19);
      }


      else if (
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

        ctx.fillStyle = "#515c5c";
        ctx.fillRect(8,34,32,16);
        ctx.fillRect(13,27,24,23);


        let vein =
          "#7a8585";


        if (
          kind ===
          "ore"
        ) vein =
          "#9e7b58";


        if (
          kind ===
          "copper_ore"
        ) vein =
          "#c46e36";


        if (
          kind ===
          "silver_ore"
        ) vein =
          "#d5dde0";


        ctx.fillStyle =
          vein;

        ctx.fillRect(18,30,11,7);
        ctx.fillRect(29,40,6,5);
      }


      else if (
        kind ===
        "bush"
        ||
        kind ===
        "herb_bush"
      ) {

        ctx.fillStyle =
          kind ===
          "herb_bush"
            ? "#376f43"
            : "#306444";

        ctx.fillRect(7,32,34,20);
        ctx.fillRect(12,25,25,27);


        ctx.fillStyle =
          kind ===
          "herb_bush"
            ? "#ddd06b"
            : "#795299";

        ctx.fillRect(18,37,3,3);
        ctx.fillRect(30,40,3,3);
      }


      else if (
        kind ===
        "slime"
      ) {

        ctx.fillStyle = "#326545";
        ctx.fillRect(9,28,30,13);
        ctx.fillRect(14,20,21,20);

        ctx.fillStyle = "#1a291e";
        ctx.fillRect(19,28,3,3);
        ctx.fillRect(28,28,3,3);
      }


      else if (
        kind ===
        "wolf"
      ) {

        ctx.fillStyle = "#4c4845";
        ctx.fillRect(10,27,30,15);
        ctx.fillRect(17,18,18,19);

        ctx.fillStyle = "#252220";
        ctx.fillRect(21,26,3,3);
        ctx.fillRect(29,26,3,3);
      }


      else if (
        kind ===
        "goblin"
      ) {

        ctx.fillStyle = "#557849";
        ctx.fillRect(16,14,17,17);

        ctx.fillStyle = "#70466a";
        ctx.fillRect(12,31,25,20);
      }


      else if (
        kind ===
        "boar"
      ) {

        ctx.fillStyle = "#644634";
        ctx.fillRect(8,29,33,17);
        ctx.fillRect(28,23,14,15);

        ctx.fillStyle = "#d7c3a2";
        ctx.fillRect(39,34,5,3);

        ctx.fillStyle = "#2a201b";
        ctx.fillRect(33,28,3,3);
      }


      else if (
        kind ===
        "swamp_spider"
      ) {

        ctx.fillStyle = "#2d4635";
        ctx.fillRect(17,25,17,17);
        ctx.fillRect(20,18,12,12);

        ctx.fillRect(6,28,12,3);
        ctx.fillRect(31,28,12,3);

        ctx.fillRect(7,38,12,3);
        ctx.fillRect(31,38,12,3);

        ctx.fillStyle = "#d7c55e";
        ctx.fillRect(21,27,3,3);
        ctx.fillRect(28,27,3,3);
      }


      else if (
        kind ===
        "bandit"
      ) {

        ctx.fillStyle = "#d1a078";
        ctx.fillRect(18,13,15,14);

        ctx.fillStyle = "#5d3030";
        ctx.fillRect(14,27,24,28);

        ctx.fillStyle = "#2c2827";
        ctx.fillRect(16,8,20,8);

        ctx.fillStyle = "#c2c2c2";
        ctx.fillRect(38,31,3,22);
      }


      else if (
        kind ===
        "wraith"
      ) {

        ctx.fillStyle =
          "rgba(194,214,221,.85)";

        ctx.fillRect(17,12,17,16);
        ctx.fillRect(13,27,25,23);

        ctx.fillStyle = "#627684";

        ctx.fillRect(10,46,8,8);
        ctx.fillRect(22,47,8,9);
        ctx.fillRect(33,45,7,10);

        ctx.fillStyle = "#24313a";

        ctx.fillRect(21,19,3,3);
        ctx.fillRect(29,19,3,3);
      }


      else {

        ctx.fillStyle = "#d7a17a";
        ctx.fillRect(19,12,16,15);


        const colors = {
          merchant: "#684b8e",
          lina: "#3d7890",
          hunter: "#425d35",
          blacksmith: "#555d63",
          fisherman: "#3c6d86",
          farmer: "#738548",
          cook: "#a46751",
        };


        ctx.fillStyle =
          colors[
            kind
          ]
          ||
          "#6f6f6f";


        ctx.fillRect(14,28,27,27);

        ctx.fillStyle = "#583727";
        ctx.fillRect(19,7,16,7);
      }
    },
  );
}

function stationTexture(
  kind,
) {

  return canvasTexture(
    (
      ctx,
    ) => {

      if (
        kind ===
        "chest"
      ) {

        ctx.fillStyle = "#825231";
        ctx.fillRect(8,28,40,26);

        ctx.fillStyle = "#d5a84d";
        ctx.fillRect(26,35,7,12);
      }


      else if (
        kind ===
        "workbench"
      ) {

        ctx.fillStyle = "#8d5d38";
        ctx.fillRect(5,27,45,10);
        ctx.fillRect(10,37,7,20);
        ctx.fillRect(39,37,7,20);
      }


      else if (
        kind ===
        "furnace"
      ) {

        ctx.fillStyle = "#565a57";
        ctx.fillRect(10,17,37,40);

        ctx.fillStyle = "#db7338";
        ctx.fillRect(19,37,19,14);
      }


      else if (
        kind ===
        "mill"
      ) {

        ctx.fillStyle = "#b39663";
        ctx.fillRect(11,20,34,37);

        ctx.fillStyle = "#734a2e";
        ctx.fillRect(25,26,6,28);
        ctx.fillRect(12,37,32,6);
      }


      else if (
        kind ===
        "kitchen"
      ) {

        ctx.fillStyle = "#6e4a35";
        ctx.fillRect(7,31,43,22);

        ctx.fillStyle = "#b8733f";
        ctx.fillRect(17,22,24,17);

        ctx.fillStyle = "#f2b54b";
        ctx.fillRect(24,29,10,10);
      }

    },
  );
}


function playerTexture(
  id,
) {

  return canvasTexture(
    (
      ctx,
    ) => {

      let hash = 0;

      for (
        const char
        of id
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


      ctx.fillStyle =
        `hsl(${hash},55%,48%)`;

      ctx.fillRect(16,27,17,22);

      ctx.fillStyle = "#dca57d";
      ctx.fillRect(18,13,14,14);

      ctx.fillStyle = "#4b3024";
      ctx.fillRect(18,8,14,7);

      ctx.fillStyle = "#2c2522";
      ctx.fillRect(17,49,6,11);
      ctx.fillRect(27,49,6,11);
    },
  );
}


/*
 * THREE
 */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x8eb7a3,
  );


const renderer =
  new THREE.WebGLRenderer(
    {
      antialias: false,
    },
  );


renderer.setPixelRatio(
  1,
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


$("#app")
  .appendChild(
    renderer.domElement,
  );


const VIEW_HEIGHT =
  16;


const camera =
  new THREE.OrthographicCamera(
    -10,
    10,
    8,
    -8,
    .1,
    200,
  );


function resize() {

  const aspect =
    innerWidth /
    innerHeight;


  camera.left =
    -VIEW_HEIGHT *
    aspect /
    2;


  camera.right =
    VIEW_HEIGHT *
    aspect /
    2;


  camera.top =
    VIEW_HEIGHT /
    2;


  camera.bottom =
    -VIEW_HEIGHT /
    2;


  camera.updateProjectionMatrix();


  const h =
    360;


  renderer.setSize(
    Math.round(
      h *
      aspect,
    ),
    h,
    false,
  );


  renderer.domElement.style.width =
    "100vw";


  renderer.domElement.style.height =
    "100vh";
}


resize();


addEventListener(
  "resize",
  resize,
);


camera.position.set(
  10,
  12,
  10,
);


camera.lookAt(
  0,
  0,
  0,
);


const staticLabels = [];


function addLabel(
  text,
  x,
  z,
  y =
    2.8,
) {

  const element =
    document.createElement(
      "div",
    );


  element.className =
    "world-label npc";


  element.textContent =
    text;


  document.body.appendChild(
    element,
  );


  staticLabels.push(
    {
      element,

      position:
        new THREE.Vector3(
          x,
          y,
          z,
        ),
    },
  );
}


function addSpriteObject(
  kind,
  label,
  x,
  z,
  width =
    2.2,
  height =
    3,
  station =
    false,
) {

  const group =
    new THREE.Group();


  group.add(
    shadow(
      width *
      .25,
    ),
  );


  group.add(
    makeSprite(
      station
        ? stationTexture(
            kind,
          )
        : simpleTexture(
            kind,
          ),

      width,
      height,
    ),
  );


  group.position.set(
    x,
    0,
    z,
  );


  scene.add(
    group,
  );


  if (
    label
  ) {

    addLabel(
      label,
      x,
      z,
      height +
      .35,
    );
  }
}



function addFishingLakeVisual(
  spot,
  color,
) {

  const shore =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        4.7,
        24,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0xb8a36f,
        },
      ),
    );


  shore.scale.set(
    1.2,
    .8,
    1,
  );


  shore.rotation.x =
    -Math.PI /
    2;


  shore.position.set(
    spot.x,
    .02,
    spot.z,
  );


  scene.add(
    shore,
  );


  const water =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        4.2,
        24,
      ),

      new THREE.MeshBasicMaterial(
        {
          color,
        },
      ),
    );


  water.scale.set(
    1.2,
    .8,
    1,
  );


  water.rotation.x =
    -Math.PI /
    2;


  water.position.set(
    spot.x,
    .03,
    spot.z,
  );


  scene.add(
    water,
  );


  addLabel(
    `${spot.label} · Pescador Nv.${spot.reqLevel}`,
    spot.x,
    spot.z,
    .6,
  );
}


function addAdvancedFishingSpots() {

  addFishingLakeVisual(
    FISHING_SPOTS.deep_lake,
    0x3f839b,
  );


  addFishingLakeVisual(
    FISHING_SPOTS.silver_lake,
    0x648ca5,
  );
}



function buildRegionVisuals() {

  for (
    const id
    of REGION_ORDER
  ) {

    const region =
      REGIONS[
        id
      ];


    const width =
      region.bounds.maxX -
      region.bounds.minX;


    const depth =
      region.bounds.maxZ -
      region.bounds.minZ;


    const centerX =
      (
        region.bounds.minX
        +
        region.bounds.maxX
      )
      /
      2;


    const centerZ =
      (
        region.bounds.minZ
        +
        region.bounds.maxZ
      )
      /
      2;


    const plane =
      new THREE.Mesh(

        new THREE.PlaneGeometry(
          width,
          depth,
        ),

        new THREE.MeshBasicMaterial(
          {
            color:
              region.color,

            transparent:
              true,

            opacity:
              id ===
              "village"
                ? .06
                : .17,

            depthWrite:
              false,
          },
        ),
      );


    plane.rotation.x =
      -Math.PI /
      2;


    plane.position.set(
      centerX,
      .006,
      centerZ,
    );


    scene.add(
      plane,
    );
  }
}



function buildLandmarkVisuals() {

  const colors = {

    waystone:
      0x9fbec4,

    outpost:
      0x9b7044,

    ruins:
      0x73766d,

    tower:
      0x656b68,

    shrine:
      0x8294a4,

    mine:
      0x634934,
  };


  for (
    const id
    of LANDMARK_ORDER
  ) {

    const landmark =
      LANDMARKS[
        id
      ];


    if (
      !landmark
    ) {

      continue;
    }


    const group =
      new THREE.Group();


    const base =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.9,
          .3,
          1.9,
        ),

        new THREE.MeshBasicMaterial(
          {
            color:
              colors[
                landmark.type
              ]
              ||
              0x777777,
          },
        ),
      );


    base.position.y =
      .15;


    group.add(
      base,
    );


    if (
      landmark.type ===
      "outpost"
    ) {

      const building =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            1.35,
            1.15,
            1.35,
          ),

          new THREE.MeshBasicMaterial(
            {
              color:
                0x74523c,
            },
          ),
        );


      building.position.y =
        .85;


      group.add(
        building,
      );


      const roof =
        new THREE.Mesh(

          new THREE.ConeGeometry(
            1.05,
            .75,
            4,
          ),

          new THREE.MeshBasicMaterial(
            {
              color:
                0x473a31,
            },
          ),
        );


      roof.rotation.y =
        Math.PI /
        4;


      roof.position.y =
        1.8;


      group.add(
        roof,
      );
    }


    else if (
      landmark.type ===
      "tower"
    ) {

      const tower =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            .9,
            2.9,
            .9,
          ),

          new THREE.MeshBasicMaterial(
            {
              color:
                0x686e69,
            },
          ),
        );


      tower.position.y =
        1.6;


      group.add(
        tower,
      );
    }


    else if (
      landmark.type ===
      "mine"
    ) {

      const mine =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            2,
            1.5,
            .7,
          ),

          new THREE.MeshBasicMaterial(
            {
              color:
                0x332a25,
            },
          ),
        );


      mine.position.y =
        .9;


      group.add(
        mine,
      );
    }


    else if (
      landmark.type ===
      "ruins"
    ) {

      for (
        const offset
        of [
          [-.55, .7],
          [.55, .45],
        ]
      ) {

        const ruin =
          new THREE.Mesh(

            new THREE.BoxGeometry(
              .45,
              offset[
                1
              ],
              .45,
            ),

            new THREE.MeshBasicMaterial(
              {
                color:
                  0x73766d,
              },
            ),
          );


        ruin.position.set(
          offset[
            0
          ],

          offset[
            1
          ] /
          2,

          0,
        );


        group.add(
          ruin,
        );
      }
    }


    else {

      const pillar =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            .65,
            1.8,
            .65,
          ),

          new THREE.MeshBasicMaterial(
            {
              color:
                colors[
                  landmark.type
                ]
                ||
                0x777777,
            },
          ),
        );


      pillar.position.y =
        1;


      group.add(
        pillar,
      );
    }


    group.position.set(
      landmark.x,
      0,
      landmark.z,
    );


    scene.add(
      group,
    );
  }
}



/*
 * ============================================================
 * ETAPA 12 — NPCs REGIONAIS VIVOS
 * ============================================================
 *
 * Esta Map precisa existir antes de buildWorld() ser executado.
 */

const regionalNpcVisuals =
  new Map();


function buildRegionalNpcVisuals() {

  for (
    const [
      id,
      npc,
    ]
    of Object.entries(
      REGIONAL_NPCS,
    )
  ) {

    const group =
      new THREE.Group();


    group.add(
      shadow(
        .55,
      ),
    );


    group.add(
      makeSprite(
        simpleTexture(
          npc.visualKind,
        ),

        2.2,

        3,
      ),
    );


    group.position.set(
      npc.x,
      0,
      npc.z,
    );


    scene.add(
      group,
    );


    const label =
      document.createElement(
        "div",
      );


    label.className =
      "world-label npc";


    label.textContent =
      `${
        npc.name
      } · ${
        npc.role
      }`;


    document.body.appendChild(
      label,
    );


    regionalNpcVisuals.set(
      id,

      {
        id,

        npc,

        group,

        label,
      },
    );
  }
}


function buildWorld() {

  const grass =
    canvasTexture(
      (
        ctx,
        w,
        h,
      ) => {

        ctx.fillStyle = "#628d4d";
        ctx.fillRect(0,0,w,h);

        ctx.fillStyle = "#739b58";

        ctx.fillRect(5,6,2,2);
        ctx.fillRect(19,13,2,2);
        ctx.fillRect(27,24,2,2);
      },
      32,
      32,
    );


  grass.wrapS =
    THREE.RepeatWrapping;


  grass.wrapT =
    THREE.RepeatWrapping;


  grass.repeat.set(
    55,
    55,
  );


  const ground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        110,
        110,
      ),

      new THREE.MeshBasicMaterial(
        {
          map: grass,
        },
      ),
    );


  ground.rotation.x =
    -Math.PI /
    2;


  scene.add(
    ground,
  );


  const roadMaterial =
    new THREE.MeshBasicMaterial(
      {
        color:
          0xb99a61,
      },
    );


  const roadA =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        6,
        50,
      ),
      roadMaterial,
    );


  roadA.rotation.x =
    -Math.PI /
    2;


  roadA.position.set(
    0,
    .01,
    1,
  );


  scene.add(
    roadA,
  );


  const roadB =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        38,
        5,
      ),
      roadMaterial,
    );


  roadB.rotation.x =
    -Math.PI /
    2;


  roadB.position.set(
    2,
    .015,
    3,
  );


  scene.add(
    roadB,
  );


  /*
   * LAGO
   */

  const shore =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        5.7,
        24,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0xb8a36f,
        },
      ),
    );


  shore.scale.set(
    1.25,
    .8,
    1,
  );


  shore.rotation.x =
    -Math.PI /
    2;


  shore.position.set(
    14,
    .02,
    14,
  );


  scene.add(
    shore,
  );


  const water =
    new THREE.Mesh(

      new THREE.CircleGeometry(
        5.2,
        24,
      ),

      new THREE.MeshBasicMaterial(
        {
          color:
            0x4fa8b6,
        },
      ),
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
    .03,
    14,
  );


  scene.add(
    water,
  );


  addLabel(
    "Lago da Vila · Pesca",
    14,
    14,
    .6,
  );


  addSpriteObject(
    "chest",
    "Baú",
    LOCATIONS.chest.x,
    LOCATIONS.chest.z,
    2,
    1.6,
    true,
  );


  addSpriteObject(
    "workbench",
    "Bancada",
    LOCATIONS.workbench.x,
    LOCATIONS.workbench.z,
    2.5,
    2,
    true,
  );


  addSpriteObject(
    "furnace",
    "Forno",
    LOCATIONS.furnace.x,
    LOCATIONS.furnace.z,
    2.3,
    2.4,
    true,
  );


  addSpriteObject(
    "mill",
    "Moinho",
    LOCATIONS.mill.x,
    LOCATIONS.mill.z,
    2.6,
    2.8,
    true,
  );


  addSpriteObject(
    "kitchen",
    "Cozinha",
    LOCATIONS.kitchen.x,
    LOCATIONS.kitchen.z,
    2.6,
    2.4,
    true,
  );


  addSpriteObject(
    "merchant",
    "Otto · Comerciante",
    LOCATIONS.merchant.x,
    LOCATIONS.merchant.z,
  );


  for (
    const id
    of [
      "lina",
      "hunter",
      "blacksmith",
      "fisherman",
      "farmer",
      "cook",
    ]
  ) {

    addSpriteObject(
      id,
      NPC_NAMES[
        id
      ],
      LOCATIONS[
        id
      ].x,
      LOCATIONS[
        id
      ].z,
    );
  }


  addLabel(
    "Prado do Sul · Nv.1+",
    0,
    -34,
    .7,
  );


  addLabel(
    "Bosque Antigo · Nv.4+",
    -35,
    -12,
    .7,
  );


  addLabel(
    "Pântano da Névoa · Nv.5+",
    -18,
    34,
    .7,
  );


  addLabel(
    "Colinas de Cobre · Nv.6+",
    35,
    25,
    .7,
  );


  addLabel(
    "Fronteira Prateada · Nv.9+",
    35,
    -32,
    .7,
  );
}


buildWorld();

buildRegionVisuals();

buildLandmarkVisuals();

buildRegionalNpcVisuals();

addAdvancedFishingSpots();


class PlayerVisual {

  constructor(
    id,
    player,
    mine,
  ) {

    this.target =
      new THREE.Vector3(
        player.x,
        0,
        player.z,
      );


    this.group =
      new THREE.Group();


    this.group.add(
      shadow(
        .55,
      ),
    );


    this.sprite =
      makeSprite(
        playerTexture(
          id,
        ),
        2.1,
        3.2,
      );


    this.group.add(
      this.sprite,
    );


    if (
      mine
    ) {

      const ring =
        new THREE.Mesh(

          new THREE.RingGeometry(
            .65,
            .76,
            24,
          ),

          new THREE.MeshBasicMaterial(
            {
              color:
                0xf4d262,

              side:
                THREE.DoubleSide,
            },
          ),
        );


      ring.rotation.x =
        -Math.PI /
        2;


      ring.position.y =
        .04;


      this.group.add(
        ring,
      );
    }


    this.group.position.copy(
      this.target,
    );
  }


  sync(
    player,
  ) {

    this.target.set(
      player.x,
      0,
      player.z,
    );
  }


  update() {

    this.group.position.lerp(
      this.target,
      .25,
    );
  }
}



class ResourceVisual {

  constructor(
    node,
  ) {

    this.group =
      new THREE.Group();


    const treeLike =
      node.kind ===
      "tree"
      ||
      node.kind ===
      "hard_tree";


    const size =
      treeLike
        ? [
            node.kind ===
            "hard_tree"
              ? 3.8
              : 3.4,

            node.kind ===
            "hard_tree"
              ? 5.2
              : 4.8,
          ]
        : [
            2,
            1.7,
          ];


    this.group.add(
      shadow(
        size[
          0
        ]
        *
        .25,
      ),
    );


    this.sprite =
      makeSprite(
        simpleTexture(
          node.kind,
        ),
        size[
          0
        ],
        size[
          1
        ],
      );


    this.group.add(
      this.sprite,
    );


    this.group.position.set(
      node.x,
      0,
      node.z,
    );


    this.sync(
      node,
    );
  }


  sync(
    node,
  ) {

    this.group.visible =
      !!node.active;
  }


  hit() {

    this.sprite.position.x =
      .12;


    setTimeout(
      () => {

        this.sprite.position.x =
          0;
      },

      100,
    );
  }
}

class EnemyVisual {

  constructor(
    enemy,
  ) {

    this.enemy =
      enemy;


    this.target =
      new THREE.Vector3(
        enemy.x,
        0,
        enemy.z,
      );


    this.group =
      new THREE.Group();


    this.group.add(
      shadow(
        .5,
      ),
    );


    this.sprite =
      makeSprite(
        simpleTexture(
          enemy.kind,
        ),
        enemy.kind ===
        "goblin"
          ? 2
          : 2.1,
        enemy.kind ===
        "goblin"
          ? 2.7
          : 1.8,
      );


    this.group.add(
      this.sprite,
    );


    this.group.position.copy(
      this.target,
    );


    this.sync(
      enemy,
    );
  }


  sync(
    enemy,
  ) {

    this.enemy =
      enemy;


    this.target.set(
      enemy.x,
      0,
      enemy.z,
    );


    this.group.visible =
      !!enemy.alive;
  }


  update() {

    this.group.position.lerp(
      this.target,
      .2,
    );
  }


  hit() {

    this.sprite.position.x =
      .12;


    setTimeout(
      () => {

        this.sprite.position.x =
          0;
      },
      100,
    );
  }
}


class DropVisual {

  constructor(
    drop,
  ) {

    this.drop =
      drop;


    this.group =
      new THREE.Group();


    const info =
      ITEM_CATALOG[
        drop.kind
      ];


    const texture =
      canvasTexture(
        (
          ctx,
        ) => {

          ctx.fillStyle = "#504437";
          ctx.fillRect(6,18,35,25);

          ctx.fillStyle = "#d0ad59";
          ctx.font = "22px sans-serif";
          ctx.fillText(
            info?.icon
            ||
            "?",
            11,
            39,
          );
        },
        48,
        48,
      );


    this.group.add(
      makeSprite(
        texture,
        1.3,
        1.3,
      ),
    );


    this.group.position.set(
      drop.x,
      0,
      drop.z,
    );
  }


  update(
    time,
  ) {

    this.group.position.y =
      Math.sin(
        time *
        3
        +
        this.drop.x,
      )
      *
      .08;
  }
}



class FarmVisual {

  constructor(
    plot,
  ) {

    this.group =
      new THREE.Group();


    this.soil =
      new THREE.Mesh(

        new THREE.PlaneGeometry(
          1.6,
          1.6,
        ),

        new THREE.MeshBasicMaterial(
          {
            color:
              0x765334,
          },
        ),
      );


    this.soil.rotation.x =
      -Math.PI /
      2;


    this.soil.position.y =
      .025;


    this.group.add(
      this.soil,
    );


    this.crop =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          .5,
          .7,
          .5,
        ),

        new THREE.MeshBasicMaterial(
          {
            color:
              0x6d943d,
          },
        ),
      );


    this.crop.position.y =
      .36;


    this.group.add(
      this.crop,
    );


    this.group.position.set(
      plot.x,
      0,
      plot.z,
    );


    this.sync(
      plot,
    );
  }


  sync(
    plot,
  ) {

    this.crop.visible =
      plot.stage >
      0;


    if (
      plot.stage ===
      1
    ) {

      this.crop.scale.set(
        .45,
        .35,
        .45,
      );
    }


    if (
      plot.stage ===
      2
    ) {

      this.crop.scale.set(
        .7,
        .7,
        .7,
      );
    }


    if (
      plot.stage ===
      3
    ) {

      this.crop.scale.set(
        1,
        1,
        1,
      );
    }


    const colors = {
      wheat: 0xc0a342,
      carrot: 0x4c8a42,
      tomato: 0xb63d38,
      pumpkin: 0xd78332,
    };


    this.crop.material.color.set(
      colors[
        plot.crop
      ]
      ||
      0x6d943d,
    );
  }
}

let room;

let localSessionId =
  "";

let localPlayer;

let selectedHotbar =
  0;

let selectedItem =
  null;

let inventoryVisible =
  false;

let activeModal =
  null;

let activeCraftStation =
  "workbench";

let activeQuestNpc =
  "journal";

let activeRegionalNpc =
  "";

let activeShopSource =
  "";

let regionalProgressState = {

  reputation:
    {},

  contracts:
    {},

  completedDays:
    {},

  event:
    {},
};

let regionalActiveEvent =
  regionalEventAt(
    Date.now(),
  );

let regionalBoardState =
  null;

let toastTimer;


const players =
  new Map();

const playerLabels =
  new Map();

const resources =
  new Map();

const resourceStates =
  new Map();

const enemies =
  new Map();

const enemyStates =
  new Map();

const enemyLabels =
  new Map();

const drops =
  new Map();

const dropStates =
  new Map();

const farmPlots =
  new Map();

const farmStates =
  new Map();


/*
 * Pontos de Interesse conhecidos.
 *
 * Não fazem parte do Schema do Player.
 */

const knownLandmarks =
  new Set(
    [
      "village_waystone",
    ],
  );


const client =
  new Client(
    location.origin,
  );


function inventory() {

  return localPlayer
    ? parseArray(
        localPlayer.inventoryJson,
        INVENTORY_SIZE,
      )
    : [];
}


function chest() {

  return localPlayer
    ? parseArray(
        localPlayer.chestJson,
        CHEST_SIZE,
      )
    : [];
}


function hotbar() {

  return localPlayer
    ? parseArray(
        localPlayer.hotbarJson,
        HOTBAR_SIZE,
      )
    : [];
}


function equipment() {

  return localPlayer
    ? parseObject(
        localPlayer.equipmentJson,
      )
    : {};
}


function questState() {

  return localPlayer
    ? parseObject(
        localPlayer.questsJson,
      )
    : {};
}


function professions() {

  return localPlayer
    ? parseObject(
        localPlayer.professionsJson,
      )
    : {};
}


function renderSlot(
  stack,
  index,
  location,
) {

  const button =
    document.createElement(
      "button",
    );


  button.className =
    "item-slot";


  if (
    stack
  ) {

    button.classList.add(
      `rarity-${
        stack.rarity
        ||
        "common"
      }`,
    );
  }


  if (
    selectedItem?.location ===
    location
    &&
    selectedItem?.index ===
    index
  ) {

    button.classList.add(
      "selected",
    );
  }


  if (
    stack
  ) {

    const item =
      ITEM_CATALOG[
        stack.id
      ];


    button.innerHTML =
      `
      <span class="slot-icon">
        ${item?.icon || "?"}
      </span>

      <span class="slot-name">
        ${item?.label || stack.id}
      </span>

      ${
        stack.qty >
        1
          ? `<span class="slot-qty">${stack.qty}</span>`
          : ""
      }
      `;
  }


  button.onclick =
    () =>
      clickSlot(
        location,
        index,
      );


  return button;
}


function renderInventory() {

  inventoryGrid.innerHTML =
    "";


  const slots =
    inventory();


  for (
    let i = 0;
    i < INVENTORY_SIZE;
    i++
  ) {

    inventoryGrid.appendChild(
      renderSlot(
        slots[
          i
        ],
        i,
        "inventory",
      ),
    );
  }


  renderEquipment();

  renderSelected();
}


function renderChest() {

  chestGrid.innerHTML =
    "";


  const slots =
    chest();


  for (
    let i = 0;
    i < CHEST_SIZE;
    i++
  ) {

    chestGrid.appendChild(
      renderSlot(
        slots[
          i
        ],
        i,
        "chest",
      ),
    );
  }
}


function renderSelected() {

  if (
    !selectedItem
  ) {

    selectedInfo.textContent =
      "Selecione um item.";


    return;
  }


  const slots =
    selectedItem.location ===
    "inventory"
      ? inventory()
      : chest();


  const stack =
    slots[
      selectedItem.index
    ];


  if (
    !stack
  ) {

    selectedItem =
      null;


    selectedInfo.textContent =
      "Selecione um item.";


    return;
  }


  const info =
    ITEM_CATALOG[
      stack.id
    ];


  const rarity =
    stack.rarity
    ||
    "common";


  selectedInfo.innerHTML =
    `
    ${info?.icon || "?"}
    <strong>${info?.label || stack.id}</strong>
    ×${stack.qty}
    <br>
    <span class="rarity-text-${rarity}">
      ${RARITIES[rarity]?.label || "Comum"}
    </span>
    `;


  if (
    selectedItem.location ===
    "inventory"
    &&
    info?.equipSlot
  ) {

    const equip =
      document.createElement(
        "button",
      );


    equip.className =
      "selected-action";


    equip.textContent =
      "EQUIPAR";


    equip.onclick =
      () => {

        room?.send(
          "equip-item",
          {
            index:
              selectedItem.index,
          },
        );


        selectedItem =
          null;
      };


    selectedInfo.appendChild(
      equip,
    );
  }
}


function renderEquipment() {

  const current =
    equipment();


  equipmentGrid.innerHTML =
    "";


  for (
    const slot
    of [
      "weapon",
      "offhand",
      "helmet",
      "body",
      "boots",
    ]
  ) {

    const equipped =
      current[
        slot
      ];


    const id =
      typeof equipped ===
      "string"
        ? equipped
        : equipped?.id;


    const rarity =
      typeof equipped ===
      "object"
        ? equipped?.rarity
        : "common";


    const info =
      ITEM_CATALOG[
        id
      ];


    const button =
      document.createElement(
        "button",
      );


    button.className =
      `equipment-slot rarity-${
        rarity
        ||
        "common"
      }`;


    button.innerHTML =
      `
      <small>${EQUIPMENT_LABELS[slot]}</small>
      <strong>
        ${
          info
            ? `${
                info.icon
              } ${
                info.label
              }`
            : "— vazio —"
        }
      </strong>
      `;


    if (
      id
    ) {

      button.onclick =
        () =>
          room?.send(
            "unequip-item",
            {
              slot,
            },
          );
    }


    equipmentGrid.appendChild(
      button,
    );
  }


  if (
    localPlayer
  ) {

    $("#inventory-attack")
      .textContent =
        localPlayer.attack;


    $("#inventory-defense")
      .textContent =
        localPlayer.defense;


    $("#inventory-hp")
      .textContent =
        localPlayer.maxHp;
  }
}


function clickSlot(
  location,
  index,
) {

  const slots =
    location ===
    "inventory"
      ? inventory()
      : chest();


  if (
    !selectedItem
  ) {

    if (
      !slots[
        index
      ]
    ) return;


    selectedItem = {
      location,
      index,
    };


    renderInventory();

    renderChest();

    return;
  }


  if (
    selectedItem.location ===
    location
  ) {

    room?.send(
      location ===
      "inventory"
        ? "inventory-move"
        : "chest-move",

      {
        from:
          selectedItem.index,

        to:
          index,
      },
    );
  }


  else if (
    selectedItem.location ===
    "inventory"
  ) {

    room?.send(
      "inventory-to-chest",

      {
        from:
          selectedItem.index,

        to:
          index,
      },
    );
  }


  else {

    room?.send(
      "chest-to-inventory",

      {
        from:
          selectedItem.index,

        to:
          index,
      },
    );
  }


  selectedItem =
    null;
}


function renderHotbar() {

  hotbarElement.innerHTML =
    "";


  const values =
    hotbar();


  for (
    let i = 0;
    i < HOTBAR_SIZE;
    i++
  ) {

    const id =
      values[
        i
      ];


    const item =
      ITEM_CATALOG[
        id
      ];


    const button =
      document.createElement(
        "button",
      );


    button.className =
      "hotbar-slot";


    if (
      i ===
      selectedHotbar
    ) {

      button.classList.add(
        "active",
      );
    }


    button.innerHTML =
      `
      <span class="hotbar-key">${i + 1}</span>
      <span class="hotbar-icon">${item?.icon || "·"}</span>
      <span class="hotbar-name">${item?.label || "vazio"}</span>
      `;


    button.onclick =
      () => {

        if (
          selectedItem?.location ===
          "inventory"
        ) {

          room?.send(
            "hotbar-assign",

            {
              inventoryIndex:
                selectedItem.index,

              hotbarIndex:
                i,
            },
          );


          selectedItem =
            null;
        }

        else {

          selectedHotbar =
            i;


          renderHotbar();
        }
      };


    hotbarElement.appendChild(
      button,
    );
  }
}


function renderQuestTracker() {

  const states =
    questState();


  const active =
    Object.entries(
      states,
    )
      .filter(
        (
          [
            _,
            state,
          ],
        ) =>
          state?.status ===
          "active"
          ||
          state?.status ===
          "ready",
      )
      .slice(
        0,
        3,
      );


  if (
    !active.length
  ) {

    questTrackerList.textContent =
      "Nenhuma missão ativa.";


    return;
  }


  questTrackerList.innerHTML =
    "";


  for (
    const [
      id,
      state,
    ]
    of active
  ) {

    const quest =
      QUESTS[
        id
      ];


    if (
      !quest
    ) continue;


    const box =
      document.createElement(
        "div",
      );


    box.className =
      "tracker-quest";


    box.innerHTML =
      `<strong>${
        state.status ===
        "ready"
          ? "✓ "
          : ""
      }${quest.title}</strong>`;


    quest.objectives.forEach(
      (
        objective,
        index,
      ) => {

        const line =
          document.createElement(
            "div",
          );


        line.textContent =
          `${
            objective.label
          }: ${
            Math.min(
              objective.amount,

              state.progress?.[
                index
              ]
              ||
              0,
            )
          }/${
            objective.amount
          }`;


        box.appendChild(
          line,
        );
      },
    );


    questTrackerList.appendChild(
      box,
    );
  }
}


function questUnlocked(
  states,
  quest,
) {

  return (
    quest.requires
    ||
    []
  )
    .every(
      (
        requirement,
      ) =>
        states[
          requirement
        ]?.status ===
        "done",
    );
}


function renderQuestPanel(
  npc =
    "journal",
) {

  activeQuestNpc =
    npc;


  const states =
    questState();


  questList.innerHTML =
    "";


  questPanelTitle.textContent =
    npc ===
    "journal"
      ? "Diário de Missões"
      : NPC_NAMES[
          npc
        ];


  for (
    const [
      id,
      quest,
    ]
    of Object.entries(
      QUESTS,
    )
  ) {

    if (
      npc !==
      "journal"
      &&
      quest.npc !==
      npc
    ) continue;


    const state =
      states[
        id
      ];


    const unlocked =
      questUnlocked(
        states,
        quest,
      );


    if (
      npc ===
      "journal"
      &&
      !state
      &&
      !unlocked
    ) continue;


    const card =
      document.createElement(
        "div",
      );


    card.className =
      "quest-card";


    if (
      state?.status ===
      "ready"
    ) {

      card.classList.add(
        "ready",
      );
    }


    if (
      state?.status ===
      "done"
    ) {

      card.classList.add(
        "done",
      );
    }


    card.innerHTML =
      `
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      `;


    quest.objectives.forEach(
      (
        objective,
        index,
      ) => {

        const line =
          document.createElement(
            "div",
          );


        line.className =
          "quest-objective";


        line.textContent =
          `${
            objective.label
          }: ${
            state?.progress?.[
              index
            ]
            ||
            0
          }/${
            objective.amount
          }`;


        card.appendChild(
          line,
        );
      },
    );


    const reward =
      document.createElement(
        "div",
      );


    reward.className =
      "quest-reward";


    reward.textContent =
      `Recompensa: ${
        quest.rewardText
      }`;


    card.appendChild(
      reward,
    );


    if (
      !state
      &&
      unlocked
      &&
      npc ===
      quest.npc
    ) {

      const button =
        document.createElement(
          "button",
        );


      button.className =
        "quest-action";


      button.textContent =
        "ACEITAR MISSÃO";


      button.onclick =
        () =>
          room?.send(
            "quest-action",

            {
              action: "accept",
              questId: id,
            },
          );


      card.appendChild(
        button,
      );
    }


    if (
      state?.status ===
      "ready"
      &&
      npc ===
      quest.npc
    ) {

      const button =
        document.createElement(
          "button",
        );


      button.className =
        "quest-action";


      button.textContent =
        "RECEBER RECOMPENSA";


      button.onclick =
        () =>
          room?.send(
            "quest-action",

            {
              action: "claim",
              questId: id,
            },
          );


      card.appendChild(
        button,
      );
    }


    questList.appendChild(
      card,
    );
  }


  if (
    !questList.children.length
  ) {

    questList.innerHTML =
      "<p>Nenhuma missão disponível.</p>";
  }
}



function renderProfessions() {

  professionList.innerHTML =
    "";


  const data =
    professions();


  for (
    const id
    of PROFESSION_IDS
  ) {

    const profession =
      data[
        id
      ]
      ||
      {
        level: 1,
        xp: 0,
      };


    const needed =
      professionXpNeeded(
        profession.level,
      );


    const percent =
      Math.min(
        100,

        profession.xp /
        needed *
        100,
      );


    const card =
      document.createElement(
        "div",
      );


    card.className =
      "profession-card";


    const unlocks =
      PROFESSION_UNLOCKS[
        id
      ]
      ||
      [];


    const unlockHtml =
      unlocks
        .map(
          (
            unlock,
          ) => {

            const unlocked =
              profession.level >=
              unlock.level;


            return `
              <div class="profession-info">
                ${
                  unlocked
                    ? "✅"
                    : "🔒"
                }
                Nv.${unlock.level}
                · ${unlock.text}
              </div>
            `;
          },
        )
        .join(
          "",
        );


    card.innerHTML =
      `
      <h3>
        ${
          PROFESSION_NAMES[
            id
          ]
        } · Nv.${
          profession.level
        }
      </h3>

      <div class="profession-xp">
        <div
          class="profession-xp-fill"
          style="width:${percent}%"
        ></div>
      </div>

      <div class="profession-info">
        ${
          profession.xp
        } / ${
          needed
        } XP
      </div>

      <div style="margin-top:8px">
        ${unlockHtml}
      </div>
      `;


    professionList.appendChild(
      card,
    );
  }
}


let lastRegionHud =
  "";


function updateRegionHud() {

  if (
    !localPlayer
    ||
    !regionBadge
  ) {

    return;
  }


  const id =
    getRegionAt(
      localPlayer.x,
      localPlayer.z,
    );


  if (
    id ===
    lastRegionHud
  ) {

    return;
  }


  lastRegionHud =
    id;


  const region =
    REGIONS[
      id
    ];


  if (
    !region
  ) {

    return;
  }


  regionBadge.innerHTML =
    `
      🧭

      <strong>
        ${region.label}
      </strong>

      <small>
        Recomendado Nv.${region.recommendedLevel}
      </small>
    `;
}



function renderRegionMap() {

  if (
    !regionMapList
  ) {

    return;
  }


  const knownRegions =
    new Set(
      discoveredRegions(),
    );


  const current =
    localPlayer
      ? getRegionAt(
          localPlayer.x,
          localPlayer.z,
        )
      : "village";


  regionMapSummary.textContent =
    `${
      knownRegions.size
    } / ${
      REGION_ORDER.length
    } regiões · ${
      knownLandmarks.size
    } / ${
      LANDMARK_ORDER.length
    } pontos de interesse`;


  regionMapList.innerHTML =
    "";


  for (
    const regionId
    of REGION_ORDER
  ) {

    const region =
      REGIONS[
        regionId
      ];


    const discovered =
      knownRegions.has(
        regionId,
      );


    const card =
      document.createElement(
        "div",
      );


    card.className =
      "region-map-card";


    if (
      current ===
      regionId
    ) {

      card.classList.add(
        "current",
      );
    }


    if (
      !discovered
    ) {

      card.classList.add(
        "locked",
      );


      card.innerHTML =
        `
          <h3>
            🔒 Região desconhecida
          </h3>

          <p>
            Explore o mundo para revelar esta área.
          </p>
        `;


      regionMapList.appendChild(
        card,
      );


      continue;
    }


    card.innerHTML =
      `
        <h3>
          ${
            current ===
            regionId
              ? "📍"
              : "✅"
          }

          ${region.label}
        </h3>

        <p>
          ${region.subtitle}
        </p>

        <p>
          Recomendado:
          Nv.${region.recommendedLevel}
        </p>

        <div class="region-map-activities">
          ${
            region.activities.join(
              " · ",
            )
          }
        </div>
      `;


    /*
     * ETAPA 13
     * Reputação + evento regional.
     */

    if (
      REGION_BOARD_NPC[
        regionId
      ]
    ) {

      const reputation =
        currentRegionalReputation(
          regionId,
        );


      const tier =
        reputationTier(
          reputation,
        );


      const reputationLine =
        document.createElement(
          "div",
        );


      reputationLine.className =
        "profession-info";


      reputationLine.textContent =
        `⭐ Reputação: ${
          reputation
        } · ${
          tier.label
        }`;


      card.appendChild(
        reputationLine,
      );
    }


    const event =
      regionalActiveEvent
      ||
      regionalEventAt(
        Date.now(),
      );


    if (
      event?.region ===
      regionId
    ) {

      const eventLine =
        document.createElement(
          "div",
        );


      eventLine.className =
        "profession-info";


      const eventProgress =
        regionalProgressState
          ?.event?.key ===
        event.key
          ? regionalProgressState
              .event
              .progress
            ||
            0
          : 0;


      eventLine.textContent =
        `⚠️ EVENTO: ${
          event.title
        } · ${
          eventProgress
        }/${
          event.amount
        }`;


      card.appendChild(
        eventLine,
      );
    }


    const ids =
      LANDMARK_ORDER.filter(
        (
          id,
        ) =>
          LANDMARKS[
            id
          ]?.region ===
          regionId,
      );


    if (
      ids.length >
      0
    ) {

      const section =
        document.createElement(
          "div",
        );


      section.className =
        "landmark-map-section";


      const amount =
        ids.filter(
          (
            id,
          ) =>
            knownLandmarks.has(
              id,
            ),
        )
        .length;


      const title =
        document.createElement(
          "div",
        );


      title.className =
        "landmark-map-title";


      title.textContent =
        `Pontos de Interesse: ${
          amount
        } / ${
          ids.length
        }`;


      section.appendChild(
        title,
      );


      for (
        const id
        of ids
      ) {

        const landmark =
          LANDMARKS[
            id
          ];


        const row =
          document.createElement(
            "div",
          );


        row.className =
          "landmark-map-item";


        if (
          knownLandmarks.has(
            id,
          )
        ) {

          row.textContent =
            `✅ ${
              landmark.label
            } · ${
              landmark.description
            }`;
        }

        else {

          row.classList.add(
            "unknown",
          );


          row.textContent =
            "⬜ Local ainda não descoberto";
        }


        section.appendChild(
          row,
        );
      }


      card.appendChild(
        section,
      );
    }


    /*
     * ETAPA 11.3C
     *
     * Apenas conecta o mapa ao travel-jump
     * que já foi validado pela tecla Y.
     *
     * Nenhuma lógica nova de teleporte existe aqui.
     */


    if (
      regionId ===
      "village"
    ) {

      const button =
        document.createElement(
          "button",
        );


      button.className =
        "travel-map-button";


      button.textContent =
        "🌀 Viajar para Vila do Vale";


      button.onclick =
        () => {

          button.disabled =
            true;


          button.textContent =
            "🌀 Viajando...";


          room?.send(
            "travel-jump",

            {
              target:
                "village_waystone",
            },
          );
        };


      card.appendChild(
        button,
      );
    }


    if (
      regionId ===
      "sunmeadow"
    ) {

      if (
        knownLandmarks.has(
          "sunmeadow_outpost",
        )
      ) {

        const button =
          document.createElement(
            "button",
          );


        button.className =
          "travel-map-button";


        button.textContent =
          "🌀 Viajar para Posto do Prado";


        button.onclick =
          () => {

            button.disabled =
              true;


            button.textContent =
              "🌀 Viajando...";


            room?.send(
              "travel-jump",

              {
                target:
                  "sunmeadow_outpost",
              },
            );
          };


        card.appendChild(
          button,
        );
      }

      else {

        const locked =
          document.createElement(
            "div",
          );


        locked.className =
          "travel-map-lock";


        locked.textContent =
          "🔒 Descubra o Posto do Prado para liberar a viagem rápida.";


        card.appendChild(
          locked,
        );
      }
    }


    regionMapList.appendChild(
      card,
    );
  }
}


function updateHud() {

  if (
    !localPlayer
  ) return;


  hudName.textContent =
    localPlayer.name;


  hpText.textContent =
    `${
      localPlayer.hp
    }/${
      localPlayer.maxHp
    }`;


  hpFill.style.width =
    `${
      localPlayer.hp /
      localPlayer.maxHp *
      100
    }%`;


  levelText.textContent =
    `Nv. ${
      localPlayer.level
    }`;


  xpFill.style.width =
    `${
      Math.min(
        100,

        localPlayer.xp /
        xpNeeded(
          localPlayer.level,
        )
        *
        100,
      )
    }%`;


  attackText.textContent =
    localPlayer.attack;


  defenseText.textContent =
    localPlayer.defense;


  goldCount.textContent =
    localPlayer.gold;


  renderEquipment();
}


function closeModals() {

  activeModal =
    null;


  shopPanel.style.display =
    "none";


  craftPanel.style.display =
    "none";


  chestPanel.style.display =
    "none";


  regionalDialogPanel.style.display =
    "none";


  regionalContractPanel.style.display =
    "none";


  questPanel.style.display =
    "none";


  professionPanel.style.display =
    "none";


  regionMapPanel.style.display =
    "none";
}


function openModal(
  type,
) {

  closeModals();


  activeModal =
    type;


  const panels = {
    shop: shopPanel,
    craft: craftPanel,
    chest: chestPanel,
    regional: regionalDialogPanel,
    contracts: regionalContractPanel,
    quests: questPanel,
    professions: professionPanel,
    regions: regionMapPanel,
  };


  if (
    panels[
      type
    ]
  ) {

    panels[
      type
    ].style.display =
      "block";
  }


  if (
    type ===
    "chest"
  ) {

    inventoryVisible =
      true;


    inventoryPanel.style.display =
      "block";


    renderInventory();

    renderChest();
  }
}




/*
 * ETAPA 11.3E SERVICE IDENTITY
 *
 * Apenas muda textos dos painéis.
 * Nenhuma lógica de serviço é alterada.
 */

function serviceIdentity(
  source,
) {

  const id =
    String(
      source
      ||
      "",
    );


  const service =
    OUTPOST_SERVICES[
      id
    ];


  const landmark =
    LANDMARKS[
      id
    ];


  if (
    !service
    ||
    !landmark
  ) {

    return null;
  }


  return {

    id,

    serviceLabel:
      service.label,

    landmarkLabel:
      landmark.label,
  };
}


function renderCrafting(
  station,
) {

  activeCraftStation =
    station;


  const recipeMap = {
    workbench: WORKBENCH_RECIPES,
    furnace: FURNACE_RECIPES,
    mill: MILL_RECIPES,
    kitchen: KITCHEN_RECIPES,
  };


  const titles = {
    workbench: "BANCADA",
    furnace: "FORNO",
    mill: "MOINHO",
    kitchen: "COZINHA",
  };


  craftStationTitle.textContent =
    titles[
      station
    ]
    ||
    station;


  craftButtons.innerHTML =
    "";


  for (
    const [
      id,
      recipe,
    ]
    of Object.entries(
      recipeMap[
        station
      ]
      ||
      {},
    )
  ) {

    const costs =
      Object.entries(
        recipe.costs,
      )
        .map(
          (
            [
              item,
              qty,
            ],
          ) =>
            `${
              qty
            } ${
              ITEM_CATALOG[
                item
              ]?.label
              ||
              item
            }`,
        )
        .join(
          " + ",
        );


    const reqProfession =
      recipe.reqProfession
      ||
      (
        station ===
        "kitchen"
          ? "cooking"
          : "production"
      );


    const reqLevel =
      recipe.reqLevel
      ||
      1;


    const currentLevel =
      clientProfessionLevel(
        reqProfession,
      );


    const locked =
      currentLevel <
      reqLevel;


    const button =
      document.createElement(
        "button",
      );


    button.className =
      "craft-button";


    button.disabled =
      locked;


    button.innerHTML =
      `
      ${
        locked
          ? "🔒 "
          : ""
      }
      ${recipe.label}
      <br>
      <small>${costs}</small>
      ${
        locked
          ? `<br><small>Requer ${
              PROFESSION_NAMES[
                reqProfession
              ]
              ||
              reqProfession
            } Nv.${reqLevel}</small>`
          : ""
      }
      `;


    button.onclick =
      () =>
        room?.send(
          "craft",
          {
            station,
            recipe: id,
          },
        );


    craftButtons.appendChild(
      button,
    );
  }
}

document
  .querySelectorAll(
    "[data-close-modal]",
  )
  .forEach(
    (
      button,
    ) => {

      button.onclick =
        closeModals;
    },
  );


$("#inventory-close")
  .onclick =
    () => {

      inventoryVisible =
        false;


      inventoryPanel.style.display =
        "none";
    };


function currentRegionalReputation(
  region,
) {

  return Math.max(
    0,

    Number(
      regionalProgressState
        ?.reputation?.[
          region
        ],
    )
    ||
    0,
  );
}


function renderRegionalBoard(
  message,
) {

  regionalBoardState =
    message;


  const region =
    String(
      message?.region
      ||
      "",
    );


  const npcId =
    String(
      message?.npc
      ||
      "",
    );


  const npc =
    REGIONAL_NPCS[
      npcId
    ];


  regionalProgressState =
    message?.progress
    ||
    regionalProgressState;


  regionalActiveEvent =
    message?.event
    ||
    regionalEventAt(
      Date.now(),
    );


  const reputation =
    currentRegionalReputation(
      region,
    );


  const tier =
    reputationTier(
      reputation,
    );


  regionalContractRegion.textContent =
    `${
      REGIONS[
        region
      ]?.label
      ||
      region
    } · ${
      npc?.name
      ||
      "REGIÃO"
    }`
      .toUpperCase();


  regionalReputationSummary.innerHTML =
    `
      ⭐ Reputação:
      <strong>${reputation}</strong>
      · ${tier.label}
      <br>
      🪙 Compra:
      -${Math.round(
        tier.buyDiscount *
        100
      )}%
      · Venda:
      +${Math.round(
        tier.sellBonus *
        100
      )}%
    `;


  const event =
    regionalActiveEvent;


  if (
    event?.region ===
    region
  ) {

    const state =
      regionalProgressState.event
      ||
      {};


    const matching =
      state.key ===
      event.key;


    const eventProgress =
      matching
        ? Number(
            state.progress,
          )
          ||
          0
        : 0;


    const claimed =
      matching
      &&
      Boolean(
        state.claimed,
      );


    const minutes =
      Math.max(
        0,

        Math.ceil(
          (
            event.endsAt
            -
            Date.now()
          )
          /
          60000,
        ),
      );


    regionalEventBox.innerHTML =
      `
        <h3>
          ⚠️ EVENTO · ${event.title}
        </h3>

        <p>
          ${event.description}
        </p>

        <div class="quest-objective">
          Progresso:
          ${eventProgress}/${event.amount}
        </div>

        <div class="quest-reward">
          ${event.reward.gold} ouro ·
          ${event.reward.xp} XP ·
          ${event.reward.reputation} reputação
        </div>

        <div class="profession-info">
          ⏱ aproximadamente ${minutes} min restantes
        </div>
      `;


    const button =
      document.createElement(
        "button",
      );


    button.className =
      "quest-action";


    if (
      claimed
    ) {

      button.disabled =
        true;


      button.textContent =
        "✅ RECOMPENSA RECEBIDA";
    }

    else if (
      eventProgress >=
      event.amount
    ) {

      button.textContent =
        "🏆 RECEBER RECOMPENSA";


      button.onclick =
        () =>
          room?.send(
            "regional-event-claim",

            {
              npc:
                npcId,
            },
          );
    }

    else {

      button.disabled =
        true;


      button.textContent =
        "⚔ EVENTO EM ANDAMENTO";
    }


    regionalEventBox.appendChild(
      button,
    );
  }

  else {

    regionalEventBox.innerHTML =
      `
        <h3>
          🌎 Evento Mundial
        </h3>

        <p>
          Evento atual:
          <strong>
            ${
              event?.title
              ||
              "Nenhum"
            }
          </strong>
        </p>

        <div class="profession-info">
          Região:
          ${
            REGIONS[
              event?.region
            ]?.label
            ||
            "desconhecida"
          }
        </div>
      `;
  }


  regionalContractList.innerHTML =
    "";


  const ids =
    Array.isArray(
      message?.contractIds,
    )
      ? message.contractIds
      : [];


  for (
    const id
    of ids
  ) {

    const contract =
      REGIONAL_CONTRACT_BY_ID[
        id
      ];


    if (
      !contract
    ) {

      continue;
    }


    const state =
      regionalProgressState
        .contracts?.[
          id
        ];


    const completed =
      regionalProgressState
        .completedDays?.[
          id
        ]
      ===
      message.dayKey;


    const progress =
      Math.min(
        contract.amount,

        Number(
          state?.progress,
        )
        ||
        0,
      );


    const card =
      document.createElement(
        "div",
      );


    card.className =
      "quest-card";


    if (
      state?.status ===
      "ready"
    ) {

      card.classList.add(
        "ready",
      );
    }


    if (
      completed
    ) {

      card.classList.add(
        "done",
      );
    }


    card.innerHTML =
      `
        <h3>
          📜 ${contract.title}
        </h3>

        <p>
          ${contract.description}
        </p>

        <div class="quest-objective">
          Progresso:
          ${progress}/${contract.amount}
        </div>

        <div class="quest-reward">
          Recompensa:
          ${contract.reward.gold} ouro ·
          ${contract.reward.xp} XP ·
          ${contract.reward.reputation} reputação
        </div>
      `;


    const button =
      document.createElement(
        "button",
      );


    button.className =
      "quest-action";


    if (
      completed
    ) {

      button.disabled =
        true;


      button.textContent =
        "✅ CONCLUÍDO HOJE";
    }

    else if (
      state?.status ===
      "ready"
    ) {

      button.textContent =
        "🏆 RECEBER RECOMPENSA";


      button.onclick =
        () =>
          room?.send(
            "regional-contract-action",

            {
              action:
                "claim",

              contractId:
                id,
            },
          );
    }

    else if (
      state?.status ===
      "active"
    ) {

      button.disabled =
        true;


      button.textContent =
        "📌 EM ANDAMENTO";
    }

    else {

      button.textContent =
        "ACEITAR CONTRATO";


      button.onclick =
        () =>
          room?.send(
            "regional-contract-action",

            {
              action:
                "accept",

              contractId:
                id,
            },
          );
    }


    card.appendChild(
      button,
    );


    regionalContractList.appendChild(
      card,
    );
  }


  if (
    !regionalContractList.children.length
  ) {

    regionalContractList.textContent =
      "Nenhum contrato disponível.";
  }
}


function villageShopData() {

  const buy =
    {};


  const sell =
    {};


  for (
    const [
      id,
      item,
    ]
    of Object.entries(
      ITEM_CATALOG,
    )
  ) {

    if (
      item.buy
    ) {

      buy[
        id
      ] =
        item.buy;
    }


    if (
      item.sell
    ) {

      sell[
        id
      ] =
        item.sell;
    }
  }


  return {

    buy,

    sell,
  };
}


function renderShopMarket(
  source =
    "",
) {

  activeShopSource =
    String(
      source
      ||
      "",
    );


  const regional =
    regionalMarketForSource(
      activeShopSource,
    );


  const identity =
    serviceIdentity(
      activeShopSource,
    );


  let data;

  let reputation =
    0;

  let tier =
    reputationTier(
      0,
    );


  if (
    regional
  ) {

    data =
      regional;


    const marketRegion =
      REGIONAL_NPCS[
        regional.id
      ]?.region
      ||
      "";


    reputation =
      currentRegionalReputation(
        marketRegion,
      );


    tier =
      reputationTier(
        reputation,
      );


    if (
      identity
    ) {

      shopEyebrow.textContent =
        `${
          identity.landmarkLabel
        } · ${
          tier.label
        }`
          .toUpperCase();


      shopHeading.textContent =
        identity.serviceLabel;
    }

    else {

      shopEyebrow.textContent =
        `${
          regional.eyebrow
        } · ${
          tier.label
        }`
          .toUpperCase();


      shopHeading.textContent =
        regional.label;
    }
  }

  else {

    data =
      villageShopData();


    shopEyebrow.textContent =
      "OTTO · COMERCIANTE";


    shopHeading.textContent =
      "Mercado da Vila";
  }


  shopBuyList.innerHTML =
    "";


  shopSellList.innerHTML =
    "";


  for (
    const [
      id,
      basePrice,
    ]
    of Object.entries(
      data.buy
      ||
      {},
    )
  ) {

    const item =
      ITEM_CATALOG[
        id
      ];


    if (
      !item
    ) {

      continue;
    }


    const price =
      regional
        ? regionalPrice(
            basePrice,
            reputation,
            "buy",
          )
        : basePrice;


    const button =
      document.createElement(
        "button",
      );


    button.className =
      "quest-action";


    let reqText =
      "";


    if (
      item.buyReq
    ) {

      const current =
        clientProfessionLevel(
          item
            .buyReq
            .profession,
        );


      if (
        current <
        item
          .buyReq
          .level
      ) {

        button.disabled =
          true;


        reqText =
          ` · requer ${
            PROFESSION_NAMES[
              item
                .buyReq
                .profession
            ]
            ||
            item
              .buyReq
              .profession
          } Nv.${
            item
              .buyReq
              .level
          }`;
      }
    }


    button.textContent =
      `${
        item.icon
        ||
        "📦"
      } ${
        item.label
      } · ${
        price
      } ouro${
        reqText
      }`;


    button.onclick =
      () =>
        room?.send(
          "buy",

          {
            kind:
              id,

            source:
              activeShopSource,
          },
        );


    shopBuyList.appendChild(
      button,
    );
  }


  if (
    !shopBuyList.children.length
  ) {

    shopBuyList.textContent =
      "Nenhum item disponível.";
  }


  for (
    const [
      id,
      basePrice,
    ]
    of Object.entries(
      data.sell
      ||
      {},
    )
  ) {

    const item =
      ITEM_CATALOG[
        id
      ];


    if (
      !item
    ) {

      continue;
    }


    const price =
      regional
        ? regionalPrice(
            basePrice,
            reputation,
            "sell",
          )
        : basePrice;


    const button =
      document.createElement(
        "button",
      );


    button.className =
      "quest-action";


    button.textContent =
      `${
        item.icon
        ||
        "📦"
      } ${
        item.label
      } · ${
        price
      } ouro cada`;


    button.onclick =
      () =>
        room?.send(
          "sell",

          {
            kind:
              id,

            source:
              activeShopSource,
          },
        );


    shopSellList.appendChild(
      button,
    );
  }


  const sellAll =
    document.createElement(
      "button",
    );


  sellAll.className =
    "quest-action";


  sellAll.textContent =
    "🪙 Vender tudo aceito aqui";


  sellAll.onclick =
    () =>
      room?.send(
        "sell",

        {
          kind:
            "all",

          source:
            activeShopSource,
        },
      );


  shopSellList.appendChild(
    sellAll,
  );
}


regionalDialogMarketButton.onclick =
  () => {

    if (
      !activeRegionalNpc
    ) {

      return;
    }


    room?.send(
      "regional-shop",

      {
        npc:
          activeRegionalNpc,
      },
    );
  };


regionalDialogContractsButton.onclick =
  () => {

    if (
      !activeRegionalNpc
    ) {

      return;
    }


    room?.send(
      "regional-board",

      {
        npc:
          activeRegionalNpc,
      },
    );
  };


function showToast(
  text,
) {

  toast.textContent =
    text;


  toast.style.opacity =
    "1";


  clearTimeout(
    toastTimer,
  );


  toastTimer =
    setTimeout(
      () => {

        toast.style.opacity =
          "0";
      },
      1500,
    );
}


async function connect() {

  if (
    room
  ) return;


  const name =
    playerNameInput.value
      .trim()
      .slice(
        0,
        18,
      )
    ||
    "Aventureiro";


  localStorage.setItem(
    "sandbox-name",
    name,
  );


  playButton.disabled =
    true;


  loginStatus.textContent =
    "Conectando...";


  try {

    console.log(
      "[CLIENT/JOIN] 1/5 - tentando conectar",
      {
        origin:
          location.origin,

        name,
      },
    );


    room =
      await client.joinOrCreate(
        "my_room",

        {
          name,

          profileId:
            profileForName(
              name,
            ),
        },
      );


    console.log(
      "[CLIENT/JOIN] 2/5 - sala recebida",
      {
        roomId:
          room.roomId,

        sessionId:
          room.sessionId,
      },
    );


    localSessionId =
      room.sessionId;


    const callbacks =
      Callbacks.get(
        room,
      );


    console.log(
      "[CLIENT/JOIN] 3/5 - callbacks criados",
    );


    callbacks.onAdd(
      "players",

      (
        player,
        sessionId,
      ) => {

        const mine =
          sessionId ===
          localSessionId;


        const visual =
          new PlayerVisual(
            sessionId,
            player,
            mine,
          );


        players.set(
          sessionId,
          visual,
        );


        scene.add(
          visual.group,
        );


        const label =
          document.createElement(
            "div",
          );


        label.className =
          mine
            ? "world-label mine"
            : "world-label";


        label.textContent =
          player.name;


        document.body.appendChild(
          label,
        );


        playerLabels.set(
          sessionId,
          label,
        );


        const sync =
          () =>
            visual.sync(
              player,
            );


        callbacks.listen(
          player,
          "x",
          sync,
        );

        callbacks.listen(
          player,
          "z",
          sync,
        );


        if (
          mine
        ) {

          localPlayer =
            player;


          for (
            const field
            of [
              "hp",
              "maxHp",
              "attack",
              "defense",
              "level",
              "xp",
              "gold",
            ]
          ) {

            callbacks.listen(
              player,
              field,
              updateHud,
            );
          }


          for (
            const field
            of [
              "inventoryJson",
              "chestJson",
              "hotbarJson",
              "equipmentJson",
              "questsJson",
              "professionsJson",
              "discoveriesJson",
            ]
          ) {

            callbacks.listen(
              player,
              field,

              () => {

                renderInventory();

                renderHotbar();

                renderQuestTracker();

                renderProfessions();

                renderRegionMap();

                updateHud();


                if (
                  activeModal ===
                  "quests"
                ) {

                  renderQuestPanel(
                    activeQuestNpc,
                  );
                }


                if (
                  activeModal ===
                  "chest"
                ) {

                  renderChest();
                }
              },
            );
          }


          updateHud();

          renderInventory();

          renderHotbar();

          renderQuestTracker();

          renderProfessions();

          renderRegionMap();

          updateRegionHud();
        }


        onlineCount.textContent =
          players.size;
      },
    );


    callbacks.onRemove(
      "players",

      (
        _player,
        id,
      ) => {

        const visual =
          players.get(
            id,
          );


        if (
          visual
        ) {

          scene.remove(
            visual.group,
          );
        }


        players.delete(
          id,
        );


        playerLabels
          .get(
            id,
          )
          ?.remove();


        playerLabels.delete(
          id,
        );


        onlineCount.textContent =
          players.size;
      },
    );


    callbacks.onAdd(
      "nodes",

      (
        node,
        id,
      ) => {

        const visual =
          new ResourceVisual(
            node,
          );


        resources.set(
          id,
          visual,
        );


        resourceStates.set(
          id,
          node,
        );


        scene.add(
          visual.group,
        );


        const sync =
          () =>
            visual.sync(
              node,
            );


        callbacks.listen(
          node,
          "active",
          sync,
        );

        callbacks.listen(
          node,
          "hp",
          sync,
        );
      },
    );


    callbacks.onAdd(
      "enemies",

      (
        enemy,
        id,
      ) => {

        const visual =
          new EnemyVisual(
            enemy,
          );


        enemies.set(
          id,
          visual,
        );


        enemyStates.set(
          id,
          enemy,
        );


        scene.add(
          visual.group,
        );


        const label =
          document.createElement(
            "div",
          );


        label.className =
          "world-label enemy-label";


        label.innerHTML =
          `
          ${
            ENEMY_TYPES[
              enemy.kind
            ]?.label
            ||
            enemy.kind
          } · Nv.${enemy.level}

          <div class="enemy-hp-back">
            <span class="enemy-hp-fill"></span>
          </div>
          `;


        document.body.appendChild(
          label,
        );


        enemyLabels.set(
          id,
          label,
        );


        const sync =
          () => {

            visual.sync(
              enemy,
            );


            const fill =
              label.querySelector(
                ".enemy-hp-fill",
              );


            if (
              fill
            ) {

              fill.style.width =
                `${
                  enemy.hp /
                  enemy.maxHp *
                  100
                }%`;
            }
          };


        for (
          const field
          of [
            "x",
            "z",
            "hp",
            "alive",
          ]
        ) {

          callbacks.listen(
            enemy,
            field,
            sync,
          );
        }


        sync();
      },
    );


    callbacks.onAdd(
      "drops",

      (
        drop,
        id,
      ) => {

        const visual =
          new DropVisual(
            drop,
          );


        drops.set(
          id,
          visual,
        );


        dropStates.set(
          id,
          drop,
        );


        scene.add(
          visual.group,
        );
      },
    );


    callbacks.onRemove(
      "drops",

      (
        _drop,
        id,
      ) => {

        const visual =
          drops.get(
            id,
          );


        if (
          visual
        ) {

          scene.remove(
            visual.group,
          );
        }


        drops.delete(
          id,
        );


        dropStates.delete(
          id,
        );
      },
    );


    callbacks.onAdd(
      "farmPlots",

      (
        plot,
        id,
      ) => {

        const visual =
          new FarmVisual(
            plot,
          );


        farmPlots.set(
          id,
          visual,
        );


        farmStates.set(
          id,
          plot,
        );


        scene.add(
          visual.group,
        );


        const sync =
          () =>
            visual.sync(
              plot,
            );


        callbacks.listen(
          plot,
          "crop",
          sync,
        );

        callbacks.listen(
          plot,
          "stage",
          sync,
        );
      },
    );


    room.onMessage(
      "toast",

      (
        message,
      ) =>
        showToast(
          message?.text
          ||
          "",
        ),
    );






    room.onMessage(
      "travel-jump-result",

      (
        message,
      ) => {

        console.log(
          "[CLIENT/TRAVEL-JUMP]",
          message,
        );


        if (
          !message?.ok
        ) {

          if (
            message?.reason ===
            "locked"
          ) {

            showToast(
              "🔒 Descubra primeiro o Posto do Prado.",
            );
          }

          else {

            showToast(
              "❌ Viagem não concluída.",
            );
          }


          return;
        }


        lastRegionHud =
          "";


        closeModals();


        showToast(
          `🌀 Chegamos: ${
            message.label
          }`,
        );


        renderRegionMap();

        updateRegionHud();
      },
    );


    room.onMessage(
      "travel-probe-ok",

      (
        message,
      ) => {

        console.log(
          "[CLIENT/TRAVEL-PROBE]",
          message,
        );


        if (
          !message?.ok
        ) {

          showToast(
            "❌ Teste de viagem falhou.",
          );


          return;
        }


        showToast(
          `🧪 Canal de viagem OK · ${
            message.region
          } · X ${
            message.x
          } / Z ${
            message.z
          }`,
        );
      },
    );


    room.onMessage(
      "exploration-state",

      (
        message,
      ) => {

        knownLandmarks.clear();


        for (
          const raw
          of (
            Array.isArray(
              message?.landmarks,
            )
              ? message.landmarks
              : []
          )
        ) {

          const id =
            String(
              raw
              ||
              "",
            );


          if (
            LANDMARKS[
              id
            ]
          ) {

            knownLandmarks.add(
              id,
            );
          }
        }


        knownLandmarks.add(
          "village_waystone",
        );


        renderRegionMap();
      },
    );


    room.onMessage(
      "landmark-discovered",

      (
        message,
      ) => {

        const id =
          String(
            message?.id
            ||
            "",
          );


        if (
          LANDMARKS[
            id
          ]
        ) {

          knownLandmarks.add(
            id,
          );
        }


        showToast(
          `📍 Descoberto: ${
            message?.label
            ||
            "local"
          } · +${
            message?.xp
            ||
            0
          } XP · +${
            message?.gold
            ||
            0
          } ouro`,
        );


        renderRegionMap();
      },
    );


    room.onMessage(
      "region-discovered",

      (
        message,
      ) => {

        showToast(
          `🧭 Nova região: ${
            message?.label
            ||
            "desconhecida"
          } · +${
            message?.xp
            ||
            0
          } XP · +${
            message?.gold
            ||
            0
          } ouro`,
        );


        renderRegionMap();
      },
    );


    room.onMessage(
      "resource-hit",

      (
        message,
      ) =>
        resources
          .get(
            message?.id,
          )
          ?.hit(),
    );


    room.onMessage(
      "enemy-hit",

      (
        message,
      ) =>
        enemies
          .get(
            message?.id,
          )
          ?.hit(),
    );


    room.onMessage(
      "player-hit",

      (
        message,
      ) =>
        showToast(
          `-${
            message?.damage
          } HP · ${
            message?.enemy
          }`,
        ),
    );


    room.onMessage(
      "player-death",

      (
        message,
      ) =>
        showToast(
          `Você caiu! Perdeu ${
            message?.lostGold
            ||
            0
          } ouro.`,
        ),
    );


    room.onMessage(
      "open-shop",

      (
        message,
      ) => {

        renderShopMarket(
          message?.source
          ||
          "",
        );


        openModal(
          "shop",
        );
      },
    );


    room.onMessage(
      "open-chest",

      (
        message,
      ) => {

        const identity =
          serviceIdentity(
            message?.source,
          );


        if (
          identity
        ) {

          if (
            chestEyebrow
          ) {

            chestEyebrow.textContent =
              identity
                .landmarkLabel
                .toUpperCase();
          }


          if (
            chestHeading
          ) {

            chestHeading.textContent =
              identity
                .serviceLabel;
          }
        }

        else {

          if (
            chestEyebrow
          ) {

            chestEyebrow.textContent =
              "BAÚ PESSOAL";
          }


          if (
            chestHeading
          ) {

            chestHeading.textContent =
              "Armazenamento";
          }
        }


        openModal(
          "chest",
        );
      },
    );


    room.onMessage(
      "open-crafting",

      (
        message,
      ) => {

        renderCrafting(
          message?.station,
        );


        const identity =
          serviceIdentity(
            message?.source,
          );


        if (
          identity
        ) {

          craftStationTitle.textContent =
            identity
              .serviceLabel
              .toUpperCase();
        }


        openModal(
          "craft",
        );
      },
    );



    room.onMessage(
      "open-regional-dialog",

      (
        message,
      ) => {

        activeRegionalNpc =
          String(
            message?.id
            ||
            "",
          );


        const region =
          REGIONS[
            message?.region
          ];


        regionalDialogRole.textContent =
          `${
            message?.role
            ||
            "Morador"
          } · ${
            region?.label
            ||
            "Região"
          }`
          .toUpperCase();


        regionalDialogName.textContent =
          message?.name
          ||
          "Morador";


        regionalDialogText.textContent =
          message?.text
          ||
          "...";


        regionalDialogTip.textContent =
          message?.tip
            ? `💡 ${
                message.tip
              }`
            : "";


        const market =
          regionalMarketForSource(
            activeRegionalNpc,
          );


        regionalDialogMarketButton.style.display =
          market
            ? "block"
            : "none";


        regionalDialogContractsButton.style.display =
          REGION_BOARD_NPC[
            message?.region
          ] ===
          activeRegionalNpc
            ? "block"
            : "none";


        if (
          market
        ) {

          regionalDialogMarketButton.textContent =
            `🪙 NEGOCIAR COM ${
              message?.name
              ||
              "MORADOR"
            }`;
        }


        openModal(
          "regional",
        );
      },
    );


    room.onMessage(
      "regional-progress-state",

      (
        message,
      ) => {

        regionalProgressState =
          message?.progress
          ||
          regionalProgressState;


        regionalActiveEvent =
          message?.event
          ||
          regionalEventAt(
            Date.now(),
          );


        renderRegionMap();


        if (
          activeModal ===
          "contracts"
          &&
          regionalBoardState
        ) {

          renderRegionalBoard(
            {

              ...regionalBoardState,

              progress:
                regionalProgressState,

              event:
                regionalActiveEvent,
            },
          );
        }


        if (
          activeModal ===
          "shop"
          &&
          activeShopSource
        ) {

          renderShopMarket(
            activeShopSource,
          );
        }
      },
    );


    room.onMessage(
      "regional-board-state",

      (
        message,
      ) => {

        regionalProgressState =
          message?.progress
          ||
          regionalProgressState;


        regionalActiveEvent =
          message?.event
          ||
          regionalEventAt(
            Date.now(),
          );


        renderRegionalBoard(
          message,
        );


        openModal(
          "contracts",
        );


        renderRegionMap();
      },
    );


    room.onMessage(
      "open-quests",

      (
        message,
      ) => {

        renderQuestPanel(
          message?.npc,
        );


        openModal(
          "quests",
        );
      },
    );


    console.log(
      "[CLIENT/JOIN] 4/5 - listeners prontos",
    );


    room.send(
      "request-exploration-state",
      {},
    );


    room.send(
      "request-regional-progress",
      {},
    );


    loginScreen.style.display =
      "none";


    hud.style.display =
      "block";


    console.log(
      "[CLIENT/JOIN] 5/5 - HUD liberado",
    );
  }

  catch (
    error
  ) {

    console.error(
      "[CLIENT/JOIN] ERRO",
      error,
    );


    loginStatus.textContent =
      "Erro ao conectar · veja F12 > Console.";


    playButton.disabled =
      false;
  }
}


playButton.onclick =
  connect;


playerNameInput.onkeydown =
  (
    event,
  ) => {

    if (
      event.key ===
      "Enter"
    ) {

      connect();
    }
  };


const pressed =
  new Set();


const movementCodes =
  new Set(
    [
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
    ],
  );


addEventListener(
  "keydown",

  (
    event,
  ) => {

    if (
      movementCodes.has(
        event.code,
      )
    ) {

      if (
        !activeModal
      ) {

        pressed.add(
          event.code,
        );
      }


      event.preventDefault();

      return;
    }


    if (
      /^Digit[1-5]$/
        .test(
          event.code,
        )
    ) {

      selectedHotbar =
        Number(
          event.code.slice(
            -1,
          ),
        )
        -
        1;


      renderHotbar();

      return;
    }


    if (
      event.code ===
      "Space"
      &&
      !event.repeat
      &&
      !activeModal
    ) {

      room?.send(
        "attack",
        {},
      );


      event.preventDefault();

      return;
    }


    if (
      event.code ===
      "KeyE"
      &&
      !event.repeat
      &&
      !activeModal
    ) {

      room?.send(
        "interact",

        {
          tool:
            hotbar()[
              selectedHotbar
            ]
            ||
            null,
        },
      );


      event.preventDefault();

      return;
    }


    if (
      event.code ===
      "KeyF"
      &&
      !event.repeat
      &&
      !activeModal
    ) {

      room?.send(
        "use-hotbar",

        {
          slot:
            selectedHotbar,
        },
      );


      event.preventDefault();

      return;
    }


    if (
      event.code ===
      "KeyI"
      &&
      !event.repeat
    ) {

      inventoryVisible =
        !inventoryVisible;


      inventoryPanel.style.display =
        inventoryVisible
          ? "block"
          : "none";


      renderInventory();

      return;
    }


    if (
      event.code ===
      "KeyQ"
      &&
      !event.repeat
    ) {

      renderQuestPanel(
        "journal",
      );


      openModal(
        "quests",
      );


      return;
    }


    if (
      event.code ===
      "KeyP"
      &&
      !event.repeat
    ) {

      renderProfessions();


      openModal(
        "professions",
      );


      return;
    }




    if (
      event.code ===
      "KeyY"
      &&
      !event.repeat
      &&
      !activeModal
    ) {

      if (
        !localPlayer
      ) {

        return;
      }


      const currentRegion =
        getRegionAt(
          localPlayer.x,
          localPlayer.z,
        );


      /*
       * Se estivermos na Vila:
       *   Y → Posto do Prado.
       *
       * Em qualquer outra região:
       *   Y → Vila.
       */

      const target =
        currentRegion ===
        "village"
          ? "sunmeadow_outpost"
          : "village_waystone";


      console.log(
        "[CLIENT/TRAVEL-JUMP] enviando",
        {
          currentRegion,
          target,
        },
      );


      room?.send(
        "travel-jump",

        {
          target,
        },
      );


      showToast(
        "🌀 Preparando viagem...",
      );


      event.preventDefault();


      return;
    }


    if (
      event.code ===
      "KeyT"
      &&
      !event.repeat
      &&
      !activeModal
    ) {

      console.log(
        "[CLIENT/TRAVEL-PROBE] enviando...",
      );


      room?.send(
        "travel-probe",

        {
          source:
            "keyboard-T",
        },
      );


      showToast(
        "🧪 Testando canal de viagem...",
      );


      event.preventDefault();


      return;
    }


    if (
      event.code ===
      "KeyM"
      &&
      !event.repeat
    ) {

      renderRegionMap();


      openModal(
        "regions",
      );


      return;
    }


    if (
      event.code ===
      "Escape"
    ) {

      closeModals();
    }
  },
);


addEventListener(
  "keyup",

  (
    event,
  ) => {

    pressed.delete(
      event.code,
    );
  },
);


addEventListener(
  "blur",

  () => {

    pressed.clear();
  },
);


const forward =
  new THREE.Vector3();

const right =
  new THREE.Vector3();

const movement =
  new THREE.Vector3();

const worldUp =
  new THREE.Vector3(
    0,
    1,
    0,
  );


function sendMovement() {

  if (
    !room
  ) return;


  let sx = 0;
  let sy = 0;


  if (
    !activeModal
  ) {

    if (
      pressed.has(
        "KeyA",
      )
      ||
      pressed.has(
        "ArrowLeft",
      )
    ) sx--;


    if (
      pressed.has(
        "KeyD",
      )
      ||
      pressed.has(
        "ArrowRight",
      )
    ) sx++;


    if (
      pressed.has(
        "KeyW",
      )
      ||
      pressed.has(
        "ArrowUp",
      )
    ) sy--;


    if (
      pressed.has(
        "KeyS",
      )
      ||
      pressed.has(
        "ArrowDown",
      )
    ) sy++;
  }


  if (
    !sx
    &&
    !sy
  ) {

    room.send(
      "input",

      {
        moveX: 0,
        moveZ: 0,
        screenX: 0,
        screenY: 0,
      },
    );


    return;
  }


  const length =
    Math.hypot(
      sx,
      sy,
    );


  camera.getWorldDirection(
    forward,
  );


  forward.y =
    0;


  forward.normalize();


  right.crossVectors(
    forward,
    worldUp,
  )
    .normalize();


  movement
    .set(
      0,
      0,
      0,
    )
    .addScaledVector(
      right,
      sx /
      length,
    )
    .addScaledVector(
      forward,
      -sy /
      length,
    );


  room.send(
    "input",

    {
      moveX:
        movement.x,

      moveZ:
        movement.z,

      screenX:
        sx,

      screenY:
        sy,
    },
  );
}


setInterval(
  sendMovement,
  33,
);


function distanceTo(
  player,
  point,
) {

  return Math.hypot(
    player.x -
    point.x,

    player.z -
    point.z,
  );
}


function nearest(
  map,
  x,
  z,
  radius,
  predicate =
    () => true,
) {

  let result =
    null;


  for (
    const [
      id,
      state,
    ]
    of map
  ) {

    if (
      !predicate(
        state,
      )
    ) continue;


    const distance =
      Math.hypot(
        state.x -
        x,

        state.z -
        z,
      );


    if (
      distance <=
      radius
      &&
      (
        !result
        ||
        distance <
        result.distance
      )
    ) {

      result = {
        id,
        state,
        distance,
      };
    }
  }


  return result;
}



function updateInteraction() {

  interaction.style.display =
    "none";


  if (
    !localPlayer
    ||
    activeModal
  ) return;


  const drop =
    nearest(
      dropStates,
      localPlayer.x,
      localPlayer.z,
      1.8,
    );


  if (
    drop
  ) {

    interaction.textContent =
      `[ E ] Pegar ${
        ITEM_CATALOG[
          drop.state.kind
        ]?.label
        ||
        drop.state.kind
      }`;


    interaction.style.display =
      "block";

    return;
  }


  const plot =
    nearest(
      farmStates,
      localPlayer.x,
      localPlayer.z,
      1.8,
    );


  if (
    plot
  ) {

    if (
      plot.state.stage ===
      3
    ) {

      interaction.textContent =
        `[ E ] Colher ${
          ITEM_CATALOG[
            plot.state.crop
          ]?.label
          ||
          "plantação"
        }`;
    }

    else if (
      !plot.state.crop
    ) {

      const selected =
        hotbar()[
          selectedHotbar
        ];


      const crop =
        CROPS[
          selected
        ];


      if (
        crop
        &&
        clientProfessionLevel(
          "farming",
        )
        <
        crop.reqLevel
      ) {

        interaction.textContent =
          `Agricultor Nv.${
            crop.reqLevel
          } necessário`;
      }

      else {

        interaction.textContent =
          "[ E ] Plantar semente selecionada";
      }
    }

    else {

      interaction.textContent =
        "[ E ] Plantação crescendo";
    }


    interaction.style.display =
      "block";

    return;
  }


  const fishing =
    nearestFishingSpot(
      localPlayer.x,
      localPlayer.z,
    );


  if (
    fishing
  ) {

    const selected =
      hotbar()[
        selectedHotbar
      ];


    const level =
      clientProfessionLevel(
        "fishing",
      );


    const rodTier =
      clientToolTier(
        selected,
        "rod",
      );


    if (
      level <
      fishing.spot.reqLevel
    ) {

      interaction.textContent =
        `Pescador Nv.${
          fishing.spot.reqLevel
        } necessário`;
    }

    else if (
      rodTier <
      fishing.spot.minRodTier
    ) {

      interaction.textContent =
        `Vara T${
          fishing.spot.minRodTier
        } necessária`;
    }

    else {

      interaction.textContent =
        `[ E ] 🎣 Pescar · ${
          fishing.spot.label
        }`;
    }


    interaction.style.display =
      "block";

    return;
  }



  const outpostService =
    nearestOutpostService(
      localPlayer.x,
      localPlayer.z,
      3.25,
    );


  if (
    outpostService
  ) {

    interaction.textContent =
      `[ E ] 🔧 ${
        outpostService
          .service
          .label
      }`;


    interaction.style.display =
      "block";


    return;
  }



  const regionalNpc =
    nearestRegionalNpc(
      localPlayer.x,
      localPlayer.z,
      2.4,
    );


  if (
    regionalNpc
  ) {

    interaction.textContent =
      `[ E ] Falar com ${
        regionalNpc
          .npc
          .name
      }`;


    interaction.style.display =
      "block";


    return;
  }


  for (
    const id
    of [
      "lina",
      "hunter",
      "blacksmith",
      "fisherman",
      "farmer",
      "cook",
    ]
  ) {

    if (
      distanceTo(
        localPlayer,
        LOCATIONS[
          id
        ],
      )
      <=
      2.5
    ) {

      interaction.textContent =
        `[ E ] Falar com ${
          NPC_NAMES[
            id
          ]
        }`;


      interaction.style.display =
        "block";

      return;
    }
  }


  if (
    distanceTo(
      localPlayer,
      LOCATIONS.merchant,
    )
    <=
    2.6
  ) {

    interaction.textContent =
      "[ E ] Abrir loja";


    interaction.style.display =
      "block";

    return;
  }


  if (
    distanceTo(
      localPlayer,
      LOCATIONS.chest,
    )
    <=
    2.5
  ) {

    interaction.textContent =
      "[ E ] Abrir baú";


    interaction.style.display =
      "block";

    return;
  }


  for (
    const [
      id,
      text,
    ]
    of [
      ["workbench", "Usar bancada"],
      ["furnace", "Usar forno"],
      ["mill", "Usar moinho"],
      ["kitchen", "Cozinhar"],
    ]
  ) {

    if (
      distanceTo(
        localPlayer,
        LOCATIONS[
          id
        ],
      )
      <=
      2.5
    ) {

      interaction.textContent =
        `[ E ] ${text}`;


      interaction.style.display =
        "block";

      return;
    }
  }


  const enemy =
    nearest(
      enemyStates,
      localPlayer.x,
      localPlayer.z,
      2.6,

      (
        state,
      ) =>
        !!state.alive,
    );


  if (
    enemy
  ) {

    interaction.textContent =
      `[ ESPAÇO ] Atacar ${
        ENEMY_TYPES[
          enemy.state.kind
        ]?.label
      } (${
        enemy.state.hp
      }/${
        enemy.state.maxHp
      })`;


    interaction.style.display =
      "block";

    return;
  }


  const node =
    nearest(
      resourceStates,
      localPlayer.x,
      localPlayer.z,
      2.5,

      (
        state,
      ) =>
        !!state.active,
    );


  if (
    !node
  ) return;


  const config =
    RESOURCE_TYPES[
      node.state.kind
    ];


  if (
    !config
  ) return;


  const level =
    clientProfessionLevel(
      config.profession,
    );


  if (
    level <
    config.reqLevel
  ) {

    interaction.textContent =
      `${
        PROFESSION_NAMES[
          config.profession
        ]
        ||
        config.profession
      } Nv.${
        config.reqLevel
      } necessário`;


    interaction.style.display =
      "block";

    return;
  }


  if (
    config.tool
  ) {

    const selected =
      hotbar()[
        selectedHotbar
      ];


    const tier =
      clientToolTier(
        selected,
        config.tool,
      );


    if (
      tier <
      config.minTier
    ) {

      interaction.textContent =
        `${
          config.label
        } · ferramenta T${
          config.minTier
        } necessária`;
    }

    else {

      interaction.textContent =
        `[ E ] ${
          config.label
        }`;
    }
  }

  else {

    interaction.textContent =
      `[ E ] Coletar ${
        config.label
      }`;
  }


  interaction.style.display =
    "block";
}

const projection =
  new THREE.Vector3();


function projectLabel(
  element,
  position,
) {

  projection.copy(
    position,
  )
    .project(
      camera,
    );


  element.style.left =
    `${
      (
        projection.x *
        .5 +
        .5
      )
      *
      innerWidth
    }px`;


  element.style.top =
    `${
      (
        -projection.y *
        .5 +
        .5
      )
      *
      innerHeight
    }px`;
}


function updateRegionalNpcVisuals() {

  const now =
    Date.now();


  for (
    const [
      id,
      visual,
    ]
    of regionalNpcVisuals
  ) {

    const position =
      regionalNpcPositionAt(
        id,
        now,
      );


    if (
      !position
    ) {

      continue;
    }


    visual.group.position.set(
      position.x,
      0,
      position.z,
    );
  }
}


function updateLabels() {

  for (
    const [
      id,
      visual,
    ]
    of players
  ) {

    const label =
      playerLabels.get(
        id,
      );


    if (
      !label
    ) continue;


    const position =
      visual.group.position
        .clone();


    position.y +=
      3.4;


    projectLabel(
      label,
      position,
    );
  }


  for (
    const [
      id,
      visual,
    ]
    of enemies
  ) {

    const label =
      enemyLabels.get(
        id,
      );


    const state =
      enemyStates.get(
        id,
      );


    if (
      !label
      ||
      !state?.alive
    ) {

      if (
        label
      ) label.style.display =
        "none";


      continue;
    }


    label.style.display =
      "block";


    const position =
      visual.group.position
        .clone();


    position.y +=
      2.6;


    projectLabel(
      label,
      position,
    );
  }


  for (
    const visual
    of regionalNpcVisuals.values()
  ) {

    const position =
      visual.group.position
        .clone();


    position.y +=
      3.25;


    projectLabel(
      visual.label,
      position,
    );
  }


  for (
    const marker
    of staticLabels
  ) {

    projectLabel(
      marker.element,
      marker.position,
    );
  }
}


const clock =
  new THREE.Clock();


const cameraFocus =
  new THREE.Vector3();


const desiredCamera =
  new THREE.Vector3();


function animate() {

  requestAnimationFrame(
    animate,
  );


  const elapsed =
    clock.getElapsedTime();


  updateRegionalNpcVisuals();


  for (
    const visual
    of players.values()
  ) {

    visual.update();
  }


  for (
    const visual
    of enemies.values()
  ) {

    visual.update();
  }


  for (
    const visual
    of drops.values()
  ) {

    visual.update(
      elapsed,
    );
  }


  const local =
    players.get(
      localSessionId,
    );


  if (
    local
  ) {

    cameraFocus.lerp(
      local.group.position,
      .1,
    );


    desiredCamera.set(
      cameraFocus.x +
      10,
      12,
      cameraFocus.z +
      10,
    );


    camera.position.lerp(
      desiredCamera,
      .1,
    );


    camera.lookAt(
      cameraFocus.x,
      0,
      cameraFocus.z,
    );
  }


  updateRegionHud();

  updateInteraction();

  updateLabels();


  renderer.render(
    scene,
    camera,
  );
}


animate();
