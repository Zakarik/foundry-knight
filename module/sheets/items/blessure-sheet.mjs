import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";

/**
 * @extends {BaseItemSheet}
 */
export class BlessureSheet extends SpecialEffectsMixin(BaseItemSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["blessure"],
    position: { width: 800, height: 650 },
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
    reduction: {
        template: "systems/knight/templates/items/parts/blessure/guerison.hbs"
    },
    body: {
        template: "systems/knight/templates/items/parts/common/sections/specialEffects.hbs"
    },
  };

  /* -------------------------------------------- */

  /** @inheritdoc */
  get specialEffectsPath() {
      return 'system.effects';
  }

  _toggleBtn(update, target, value) {
    const tgt = target.dataset;
    const path = tgt.path;
    const implant = path.includes('implant');
    const getData = foundry.utils.getProperty(this.item, `system.${path}`);

    if(implant && getData) {
        this.item.system.removeCyberware();
        update['name'] = this.item.name.replace(` (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`, "");
    }
    else if(getData) update['name'] = this.item.name.replace(` (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`, "");
    else if(!getData) update['name'] = `${this.item.name} (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`;

    this.item.update(update);
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
