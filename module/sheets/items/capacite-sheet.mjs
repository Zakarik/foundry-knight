import { listEffects, getAllEffects } from "../../helpers/common.mjs";
import BaseItemSheet from "../bases/items/base-item-sheet.mjs";

/**
 * @extends {ItemSheet}
 */
export class CapaciteSheet extends BaseItemSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["capacite"],
    position: { width: 700, height: 530 },
    scrollY: [".attributes"],
    actions: {},
  };

  static PARTS = {
    img: {
      template: "systems/knight/templates/items/parts/common/sections/img.hbs",
    },
    header: {
      template: "systems/knight/templates/items/parts/common/sections/header.hbs",
    },
    /*body: {
      template: "systems/knight/templates/items/parts/art/body.hbs",
    },*/
  };

  /** @inheritdoc */
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

  _prepareEffets(context) {
    const dEffets = context.data.system.degats.effets;

    const labels = getAllEffects();

    dEffets.liste = listEffects(dEffets, labels);

    const aEffets = context.data.system.attaque.effets;

    aEffets.liste = listEffects(aEffets, labels);
  }
}
