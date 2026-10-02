import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import ArmeMixinSheet from "../bases/items/mixin-arme-sheet.mjs";
import EffectsMixin from "../bases/items/mixin-item-effects.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";
import concatHtml from "../../utils/generateHTML.mjs";
import PatchBuilder from "../../utils/patchBuilder.mjs";

/**
 * @extends {ItemSheet}
 */
export class CyberwareSheet extends SpecialEffectsMixin(
  ArmeMixinSheet(EffectsMixin(BaseItemSheet)),
) {
  constructor(options = {}) {
    super(options);

    // État local de l'onglet "niveau" actif
    this._activeMTab = null;
    this._activeBodyTab = null;
    this.#dragDrop = this.#createDragDropHandlers();
  }

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["cyberware"],
    position: { width: 900, height: 800 },
    scrollY: [".attributes"],
    actions: {},
    dragDrop: [{ dragSelector: null, dropSelector: null }],
  };

  static PARTS = {
    img: {
      template: "systems/knight/templates/items/parts/common/sections/img.hbs",
    },
    header: {
      template: "systems/knight/templates/items/parts/common/sections/header.hbs",
    },
    menuleft: {
      template: "systems/knight/templates/items/parts/cyberware/menuLeft.hbs",
    },
    nav: { template: "templates/generic/tab-navigation.hbs" },
    arme: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/arme.hbs",
      classes: ["tab", "arme"],
    },
    module: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/module.hbs",
      classes: ["tab", "module"],
    },
    degats: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/degats.hbs",
      classes: ["tab", "degats"],
    },
    violence: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/violence.hbs",
      classes: ["tab", "violence"],
    },
    soin: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/soin.hbs",
      classes: ["tab", "soin"],
    },
    recuperation: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/recuperation.hbs",
      classes: ["tab", "recuperation"],
    },
    effects: {
      template: "systems/knight/templates/items/parts/cyberware/tabs/effects.hbs",
      classes: ["tab", "effects"],
    },
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "arme", label: "KNIGHT.CYBERWARE.MENU.Arme" },
        { id: "module", label: "KNIGHT.CYBERWARE.MENU.Module" },
        { id: "degats", label: "KNIGHT.CYBERWARE.MENU.Degats" },
        { id: "violence", label: "KNIGHT.CYBERWARE.MENU.Violence" },
        { id: "soin", label: "KNIGHT.CYBERWARE.MENU.Soin" },
        { id: "recuperation", label: "KNIGHT.CYBERWARE.MENU.Recuperation" },
        { id: "effects", label: "KNIGHT.CYBERWARE.MENU.Effects" },
      ],
      initial: "arme",
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

  /** @inheritdoc */
  get specialEffectsPath() {
    return "system.effects";
  }

  get effectsPath() {
    return ["system.arme.effets"];
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    context.tab = context.tabs[partId];

    switch (partId) {
      case "header":
        context.enrichedDescription =
          await foundry.applications.ux.TextEditor.implementation.enrichHTML(
            context.document.system.description,
            { async: true },
          );
        break;

      case "effects":
        context.enrichedEffects =
          await foundry.applications.ux.TextEditor.implementation.enrichHTML(
            context.document.system.effects.other,
            { async: true },
          );
        break;
    }

    return await super._preparePartContext(partId, context, options);
  }

  _prepareTabs(group) {
    const tabs = super._prepareTabs(group);

    if (group === "primary") {
      const data = this.item.system;
      let initial = false;

      for (let t in tabs) {
        if (!data?.[t]?.has) delete tabs[t];
      }

      const availableIds = Object.keys(tabs);

      // Si l'onglet actif n'existe plus (ou n'a jamais été défini), on bascule sur le premier dispo
      if (!availableIds.includes(this.tabGroups.primary)) {
        this.tabGroups.primary = availableIds[0] ?? null;
      }

      for (const t of availableIds) {
        const isActive = t === this.tabGroups.primary;
        tabs[t].active = isActive;
        tabs[t].cssClass = isActive ? "active" : "";
      }
    }

    return tabs;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const tabs = this?.constructor?.TABS?.primary?.tabs ?? [];
    const count = tabs.filter((t) => this.item.system?.[t.id]?.has).length;

    if (count === 0)
      this.element.querySelectorAll("nav").forEach((el) => el.style.setProperty("display", "none"));

    const inputToQuery = ["degatsF", "violenceF"];

    for (let n of inputToQuery) {
      this.element.querySelectorAll(`.${n}`).forEach((input) => {
        console.error("test");
        input.addEventListener("change", (event) => {
          const valeur = event.target.value;
          this.element.querySelectorAll(`.${n}`).forEach((el) => {
            console.error(el, event.target);
            if (el !== event.target) el.value = valeur;
          });
        });
      });
    }
    this.#dragDrop.forEach((d) => d.bind(this.element));
  }

  /** Réagir au drop */
  async _onDrop(event) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (!data) return;
    const item = await foundry.utils.fromUuid(data.uuid);
    if (!item) return;

    if (item.type !== "arme") return;

    let pb = new PatchBuilder();
    pb.sys("arme.has", true);
    pb.sys("arme.type", item.system.type);
    pb.sys("arme.portee", item.system.portee);
    pb.sys("arme.optionsmunitions", item.system.optionsmunitions);
    pb.sys("arme.degats", item.system.degats);
    pb.sys("arme.violence", item.system.violence);
    pb.sys("arme.effets", item.system.effets);
    pb.applyTo(this.item);
  }
}
