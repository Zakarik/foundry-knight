import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";

/**
 * @extends {BaseItemSheet}
 */
export class AvantageSheet extends SpecialEffectsMixin(BaseItemSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["avantage"],
    position: { width: 700, height: 550 },
    scrollY: [".attributes"],
    actions:{}
  }

  static PARTS = {
    img: {
        template: "systems/knight/templates/items/parts/avantage/img.hbs"
    },
    header: {
        template: "systems/knight/templates/items/parts/common/sections/header.hbs"
    },
    reduction: {
        template: "systems/knight/templates/items/parts/avantage/reduction.hbs"
    },
    body: {
        template: "systems/knight/templates/items/parts/avantage/body.hbs"
    },
  };

  /* -------------------------------------------- */

  /** @inheritdoc */
  get specialEffectsPath() {
      return 'system.effects';
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch(partId) {
      case 'header':
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.document.system.description, { async: true, });
        break;
    }

    return await super._preparePartContext(partId, context, options);
  }
}
