import { listEffects, getAllEffects } from "../../helpers/common.mjs";
import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";
import ArmeMixinSheet from "../bases/items/mixin-arme-sheet.mjs";
import EffectsMixin from "../bases/items/mixin-item-effects.mjs";

/**
 * @extends {ItemSheet}
 */
export class CapaciteSheet extends SpecialEffectsMixin(
  ArmeMixinSheet(EffectsMixin(BaseItemSheet)),
) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["capacite"],
    position: { width: 700, height: 530 },
    scrollY: [".attributes"],
    actions: {},
  };

  static PARTS = {
    img: {
      template: "systems/knight/templates/items/parts/capacite/sections/img.hbs",
    },
    header: {
      template: "systems/knight/templates/items/parts/common/sections/header.hbs",
    },
    nav: { template: "templates/generic/tab-navigation.hbs" },
    effects: {
      template: "systems/knight/templates/items/parts/capacite/tab/modificateurs.hbs",
      classes: ["tab", "effects"],
    },
    other: {
      template: "systems/knight/templates/items/parts/capacite/tab/other.hbs",
      classes: ["tab", "other"],
    },
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "effects", label: "KNIGHT.LISTEFFECTS.Label" },
        { id: "other", label: "KNIGHT.AUTRE.Label" },
      ],
      initial: "effects",
    },
  };

  /** @inheritdoc */
  get specialEffectsPath() {
    return "system.effects";
  }

  get effectsPath() {
    return ["system.arme.effets"];
  }

  get effectsPath() {
    return ["system.attaque.effets", "system.degats.system.effets"];
  }
  /*static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "capacite"],
      template: "systems/knight/templates/items/capacite-sheet.html",
      width: 700,
      height: 530,
      scrollY: [".attributes"],
    });
  }*/

  /* -------------------------------------------- */

  /** @inheritdoc */
  /*getData() {
    const context = super.getData();

    context.systemData = context.data.system;

    return context;
  }*/

  /* -------------------------------------------- */

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

  _prepareEffets(context) {
    const dEffets = context.data.system.degats.effets;

    const labels = getAllEffects();

    dEffets.liste = listEffects(dEffets, labels);

    const aEffets = context.data.system.attaque.effets;

    aEffets.liste = listEffects(aEffets, labels);
  }
}
