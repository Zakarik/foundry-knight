/*import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import ArmeMixinSheet from "../bases/items/mixin-arme-sheet.mjs";
import EffectsMixin from "../bases/items/mixin-item-effects.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";
import concatHtml from "../../utils/generateHTML.mjs";*/

import PatchBuilder from "../../utils/patchBuilder.mjs";
import { SortByLabel, listEffects, getAllEffects } from "../../helpers/common.mjs";

import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";
import EffectsMixin from "../bases/items/mixin-item-effects.mjs";

/**
 * @extends {ItemSheet}
 */
export class ModuleSheet extends SpecialEffectsMixin(EffectsMixin(BaseItemSheet)) {
  constructor(options = {}) {
    super(options);

    // État local de l'onglet "niveau" actif
    this._activeMTab = null;
    this._activeBodyTab = null;
    this.#dragDrop = this.#createDragDropHandlers();
  }

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["module"],
    position: { width: 1050, height: 715 },
    scrollY: [".attributes"],
    actions: {
      changeLvl: this.#onChangeLvl,
      mTab: this.#onMTab,
      bodyTab: this.#onBodyTab,
      create: this.#onCreate,
      delete: this.#onDelete,
    },
    dragDrop: [{ dragSelector: null, dropSelector: null }],
  };

  static PARTS = {
    img: {
      template: "systems/knight/templates/items/parts/module/img.hbs",
    },
    header: {
      template: "systems/knight/templates/items/parts/module/header.hbs",
    },
    slots: {
      template: "systems/knight/templates/items/parts/module/slots.hbs",
    },
    tab: {
      template: "systems/knight/templates/items/parts/module/tabs.hbs",
    },
    body: {
      template: "systems/knight/templates/items/parts/module/body.hbs",
    },
  };

  #dragDrop;

  #createDragDropHandlers() {
    const DragDrop = foundry.applications.ux.DragDrop.implementation; // v13
    // En v12 : const DragDrop = globalThis.DragDrop;

    return this.options.dragDrop.map((d) => {
      d.permissions = {
        dragstart: () => false,
        drop: () => this.isEditable,
      };
      d.callbacks = {
        drop: this._onDrop.bind(this),
      };
      return new DragDrop(d);
    });
  }

  get specialEffectsPath() {
    return `system.niveau.details.${this.item.system.getNiveau}.effects`;
  }

  get effectsPath() {
    const wpn = this.item.system.wpnNpc;
    const array = [];

    for (const l in wpn) {
      array.push(`wpnNpc.liste.${l}.effets`);
    }

    return array;
  }

  _postContext(context) {
    super._postContext(context);

    context.activeMainTab = this._activeMTab;
    context.activeBodyTab = this._activeBodyTab;
    context.paths = {
      npc: "npc.liste",
      npcWpn: "wpnNpc.liste",
      npcJSpe: "jSpeNpc.liste",
    };
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "header":
        context.enrichedDescription =
          await foundry.applications.ux.TextEditor.implementation.enrichHTML(
            context.document.system.description,
            { async: true },
          );
        break;
    }

    return await super._preparePartContext(partId, context, options);
  }

  static #onChangeLvl(event, target) {
    const lvl = this.item?.system?.niveau?.max ?? 1;
    const niv = this.item.system.niveau.details;
    const length = Object.values(niv).length;
    const max = Math.max(lvl, length);
    const str = `system.niveau.details`;
    const field = CONFIG.Item.dataModels[this.item.type].schema.getField("niveau.details.element");
    const blank = field.getInitialValue();
    let array = [];
    let update = {};
    let nV = 0;

    for (let n = 1; n <= max; n++) {
      if (n > lvl) update[`system.niveau.details.-=n${n}`] = null;
      else if (!niv?.[`n${n}`]) update[`system.niveau.details.n${n}`] = blank;
    }

    if (!foundry.utils.isEmpty(update)) this.item.update(update);
  }

  static #onMTab(event, target) {
    const niveau = target.dataset.tab;

    // Voisin ayant la class active
    const previous = Array.from(target.parentElement.children).find(
      (el) => el !== target && el.tagName === "A" && el.classList.contains("active"),
    );
    previous?.classList.remove("active");

    target.classList.add("active");
    this._activeMTab = niveau;

    // Le bloc de contenu : on remonte au conteneur commun le plus proche
    const activeTab = this._activeMTab;
    const allDivTab = this.element.querySelectorAll(`div.tab`);

    allDivTab.forEach(function (tab) {
      if (!tab.classList.contains(`${activeTab}`)) tab.style.display = "none";
      else tab.style.display = "";
    });
  }

  static #onBodyTab(event, target) {
    const niveau = target.dataset.tab;

    // Voisin ayant la class active
    const previous = Array.from(target.parentElement.children).find(
      (el) => el !== target && el.tagName === "A" && el.classList.contains("active"),
    );
    previous?.classList.remove("active");

    target.classList.add("active");
    this._activeBodyTab = niveau;

    // Le bloc de contenu : on remonte au conteneur commun le plus proche
    const activeTab = this._activeBodyTab;
    const allDivTab = this.element.querySelectorAll(`div.bodyTab`);

    allDivTab.forEach(function (tab) {
      if (tab.dataset.tab !== activeTab) tab.style.display = "none";
      else tab.style.display = "";
    });
  }

  static #onCreate(event, target) {
    const tgt = target.dataset;
    const type = tgt.type;
    const id = tgt.id;

    this.item.system.add(type, id);
  }

  static #onDelete(event, target) {
    const tgt = target.dataset;
    const type = tgt.type;
    const npc = tgt.npc;
    const id = tgt.id;

    this.item.system.delete(type, id, npc);
  }

  _onRender(context, options) {
    this.#mTabRender();
    this.#mBodyTabRender();
    this.#dragDrop.forEach((d) => d.bind(this.element));
  }

  /** Clés de niveaux existantes, triées numériquement : ["n1","n2","n3"…] */
  get #niveauKeys() {
    const details = this.item.system.niveau.details ?? {};
    return Object.keys(details)
      .filter((k) => /^n\d+$/.test(k))
      .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  }

  #mTabRender() {
    const keys = this.#niveauKeys;
    if (!keys.length) return;

    // Onglet actif : celui mémorisé s'il existe encore, sinon le dernier
    let activeKey = this._activeMTab;
    if (!activeKey || !keys.includes(activeKey)) activeKey = keys.at(-1);
    this._activeMTab = activeKey;

    // Liens de navigation
    for (const a of this.element.querySelectorAll("nav.tabs a")) {
      a.classList.toggle("active", a.classList.contains(activeKey));
    }

    // Contenus
    for (const tab of this.element.querySelectorAll("div.tab")) {
      tab.style.display = tab.classList.contains(activeKey) ? "" : "none";
    }
  }

  #mBodyTabRender() {
    let active = this._activeBodyTab ?? "";

    const allActive = this.element.querySelectorAll(`nav.bodyTab a.active`);
    const toActivate = this.element.querySelectorAll(`nav.bodyTab a[data-tab="${active}"]`);
    const data = this.item.system.niveau.details[this._activeMTab];

    if (allActive) {
      allActive.forEach(function (tab) {
        tab.classList.remove("active");
      });
    }

    if (toActivate && data?.[active]?.has) {
      toActivate.forEach(function (tab) {
        tab.classList.add("active");
      });
    } else {
      const order = ["effects", "mods", "arme", "ersatz", "pnj", "effets"];
      let toActivateDefaultFind = null;

      for (const b of order) {
        if (data?.[b]?.has) {
          toActivateDefaultFind = b;
          break;
        }
      }

      if (toActivateDefaultFind === null) {
        this._activeBodyTab = "";
        active = "";
      } else if (toActivateDefaultFind !== null) {
        const toActivateDefault = this.element.querySelectorAll(
          `nav.bodyTab a[data-tab=${toActivateDefaultFind}]`,
        );
        if (toActivateDefault) {
          toActivateDefault.forEach(function (tab) {
            tab.classList.add("active");
          });

          this._activeBodyTab = toActivateDefaultFind;
          active = toActivateDefaultFind;
        }
      }
    }

    const allDivTab = this.element.querySelectorAll(`div.bodyTab`);

    allDivTab.forEach(function (tab) {
      if (tab.dataset.tab !== active) tab.style.display = "none";
      else tab.style.display = "";
    });
  }

  /** Réagir au drop */
  async _onDrop(event) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (!data) return;
    const item = await foundry.utils.fromUuid(data.uuid);
    if (!item) return;

    if (item.type !== "arme") return;
    const path = `niveau.details.${this.item.system.getNiveau}`;

    let pb = new PatchBuilder();
    pb.sys(`${path}.arme.has`, true);
    pb.sys(`${path}.arme.type`, item.system.type);
    pb.sys(`${path}.arme.portee`, item.system.portee);
    pb.sys(`${path}.arme.optionsmunitions`, item.system.optionsmunitions);
    pb.sys(`${path}.arme.degats`, item.system.degats);
    pb.sys(`${path}.arme.violence`, item.system.violence);
    pb.sys(`${path}.arme.effets`, item.system.effets);
    pb.applyTo(this.item);
  }
}
