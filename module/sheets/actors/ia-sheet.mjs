
import BaseActorSheet from "../bases/actors/base-actor-sheet.mjs";

/**
 * @extends {BaseActorSheet}
 */
export class IASheet extends BaseActorSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["ia"],
    position: { width: 920, height: 600 },
  }

  static PARTS = {
    header: { template: "systems/knight/templates/actors/parts/ia/sections/header.hbs" },
    main: {
      template: "systems/knight/templates/actors/parts/ia/sections/main.hbs",
    },
  }

  get itemTypesValides() {
    return ['avantage', 'inconvenient'];
  }

  /* -------------------------------------------- */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch(partId) {
      case 'header':
        context.enrichedCaractere = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.actor.system.caractere, { async: true, });
        break;
    }

    return context;
  }

  async _onItemCreate_post(create, itemData) {
    super._onItemCreate_post(create, itemData);
    console.error(create);
    await create.update({[`system.type`]:'ia'});
  }
}
