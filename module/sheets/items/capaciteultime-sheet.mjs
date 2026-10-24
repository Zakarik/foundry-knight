import { listEffects, getAllEffects } from "../../helpers/common.mjs";
import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";
import EffectsMixin from "../bases/items/mixin-item-effects.mjs";

export class CapaciteUltimeSheet extends SpecialEffectsMixin(EffectsMixin(BaseItemSheet)) {
  static DEFAULT_OPTIONS = {
    classes: ["capaciteUltime"],
    position: { width: 900, height: 600 },
    scrollY: [".attributes"],
    dragDrop: [{ dragSelector: null, dropSelector: null }],
    actions: {
      addToList: CapaciteUltimeSheet.#onAddToList,
      deleteToList: CapaciteUltimeSheet.#onDeleteToList,
    },
  };

  static PARTS = {
    img: {
      template: "systems/knight/templates/items/parts/capaciteUltime/sections/img.hbs",
    },
    header: {
      template: "systems/knight/templates/items/parts/capaciteUltime/sections/header.hbs",
    },
    nav: { template: "templates/generic/tab-navigation.hbs" },
    effects: {
      template: "systems/knight/templates/items/parts/capaciteUltime/tabs/effects.hbs",
      classes: ["tab", "effects"],
    },
    passive: {
      template: "systems/knight/templates/items/parts/capaciteUltime/tabs/passive.hbs",
      classes: ["tab", "passive"],
    },
    active: {
      template: "systems/knight/templates/items/parts/capaciteUltime/tabs/active.hbs",
      classes: ["tab", "actives"],
    },
    /*body: {
      template: "systems/knight/templates/items/capaciteUltime-sheet.html",
    },*/
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "active", label: "KNIGHT.CAPACITEULTIME.ACTIVE.Label" },
        { id: "effects", label: "KNIGHT.LISTEFFECTS.Label" },
        { id: "passive", label: "KNIGHT.CAPACITEULTIME.PASSIVE.Label" },
      ],
      initial: "active",
    },
  };

  get specialEffectsPath() {
    return "system.effects";
  }

  get effectsPath() {
    return [
      "system.passives.capacites.cea.update.rayon.effets",
      "system.passives.capacites.cea.update.salve.effets",
      "system.passives.capacites.cea.update.vague.effets",
      "system.passives.capacites.morph.update.polymorphie.lame.effets",
      "system.passives.capacites.morph.update.polymorphie.canon.effets",
      "system.passives.capacites.morph.update.polymorphie.griffe.effets",
      "system.passives.capacites.oriflamme.update.effets",
    ];
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
        context.enrichedCondition =
          await foundry.applications.ux.TextEditor.implementation.enrichHTML(
            context.document.system.condition,
            { async: true },
          );
        break;
    }

    return context;
  }

  _prepareTabs(group) {
    const tabs = super._prepareTabs(group);

    if (group === "primary") {
      const data = this.item.system;

      if (data.type === "active") delete tabs.passive;
      else if (data.type === "passive") delete tabs.active;

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

  static async #onAddToList(event, target) {
    const data = target.dataset;
    const path = data.list;
    const list = foundry.utils.getProperty(this.item, path);
    const selected = data.toadd;

    if (!list.includes(selected)) {
      list.push(selected);
      const update = {};
      update[path] = list;

      await this.item.update(update);
    }
  }

  static async #onDeleteToList(event, target) {
    const data = target.dataset;
    const path = data.path;
    const list = foundry.utils.getProperty(this.item, path);

    list.splice(Number(data.index), 1);
    const update = {};
    update[path] = list;

    await this.item.update(update);
  }

  /*_onRender(context, options) {
    super._onRender(context, options);

    this._clickController?.abort();
    this._clickController = new AbortController();
    this.element.addEventListener(
      "click",
      async (event) => {
        const target = event.target.closest("button, a, img");
        if (!target) return;

        if (target.matches("button[type='action']")) event.preventDefault();

        if (target.matches(".blockLeft button[data-type]")) {
          await this.item.update({ "system.type": target.dataset.value });
          return;
        }

        if (
          target.matches(".passive button:not([data-action='btnToggle']), .active button.clickable")
        ) {
          const path = target.dataset.toupdate;
          if (!path) return;
          const value = !foundry.utils.getProperty(this.item.system, path);
          await this.item.update({ [`system.${path}`]: value });
          return;
        }

        if (target.matches(".addCJet button.add")) {
          const list = target.dataset.list ? target.dataset.list.split(",") : [];
          const value = target.closest(".addCJet").querySelector("select.list").value;
          if (value) list.push(value);
          await this.item.update({ "system.actives.jet.variable.caracteristiques": list });
          return;
        }

        if (target.matches(".addDmg button.add")) {
          const list = target.dataset.list ? target.dataset.list.split(",") : [];
          const group = target.closest(".addDmg");
          const dice = group.querySelector("input.dice").value;
          const fixe = group.querySelector("input.fixe").value;
          list.push(`${dice}${game.i18n.localize("KNIGHT.JETS.Des-short")}6+${fixe}`);
          list.sort((a, b) => {
            const [aDice, aFixe] = a.split(/[D+]/).map(Number);
            const [bDice, bFixe] = b.split(/[D+]/).map(Number);
            return aDice - bDice || aFixe - bFixe;
          });
          await this.item.update({ [`system.${target.dataset.toupdate}`]: list });
          return;
        }

        if (target.matches(".addCJet img.delete")) {
          const list = target.dataset.list ? target.dataset.list.split(",") : [];
          list.splice(Number(target.dataset.index), 1);
          await this.item.update({ "system.actives.jet.variable.caracteristiques": list });
          return;
        }

        if (target.matches(".addDmg img.delete")) {
          const list = target.dataset.list ? target.dataset.list.split(",") : [];
          list.splice(Number(target.dataset.index), 1);
          await this.item.update({ [`system.${target.dataset.toupdate}`]: list });
          return;
        }

        if (target.matches(".effets a.edit")) {
          const path = target.dataset.path.replace(/^system\./, "");
          const data = foundry.utils.getProperty(this.item.system, path);
          if (!data) return;
          await new game.knight.applications.KnightEffetsDialog(
            {
              uuid: this.item.uuid,
              path,
            },
            data,
          ).render(true);
          return;
        }

        if (target.matches("img.info")) {
          const info = target.nextElementSibling;
          if (info?.classList.contains("hideInfo")) info.hidden = !info.hidden;
        }
      },
      { signal: this._clickController.signal },
    );
  }*/

  /*_prepareEffets(context) {
    const labels = getAllEffects();
    const systemData = context.document.system;
    const effectPaths = [
      "passives.capacites.oriflamme.update.effets",
      "passives.capacites.cea.update.vague.effets",
      "passives.capacites.cea.update.salve.effets",
      "passives.capacites.cea.update.rayon.effets",
      "passives.capacites.morph.update.polymorphie.griffe.effets",
      "passives.capacites.morph.update.polymorphie.lame.effets",
      "passives.capacites.morph.update.polymorphie.canon.effets",
      "actives.degats.effets",
      "actives.violence.effets",
      "actives.effets",
    ];

    for (const path of effectPaths) {
      const effects = foundry.utils.getProperty(systemData, path);
      if (effects) effects.liste = listEffects(effects, labels);
    }
  }*/
}
