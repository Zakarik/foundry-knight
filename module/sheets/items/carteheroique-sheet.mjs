import BaseItemSheet from "../bases/items/base-item-sheet.mjs";

/**
 * @extends {BaseItemSheet}
 */
export class CarteHeroiqueSheet extends BaseItemSheet {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["carteHeroique"],
    position: { width: 700, height: 400 },
    scrollY: [".attributes"],
    actions:{}
  }

  static PARTS = {
    img: {
        template: "systems/knight/templates/items/parts/common/sections/img.hbs"
    },
    header: {
        template: "systems/knight/templates/items/parts/common/sections/header.hbs"
    },
  };

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
