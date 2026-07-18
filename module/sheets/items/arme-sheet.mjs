import {
  listEffects,
  getAllEffects,
} from "../../helpers/common.mjs";

import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import ArmeMixinSheet from "../bases/items/mixin-arme-sheet.mjs";
import EffectsMixin from "../bases/items/mixin-item-effects.mjs";

/**
 * @extends {BaseItemSheet}
 */
export class ArmeSheet extends ArmeMixinSheet(EffectsMixin(BaseItemSheet)) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["arme"],
    position: { width: 800, height: 585 },
    scrollY: [".attributes"],
    dragDrop: [{dropSelector:'.arme'}],
    actions:{}
  }

  static PARTS = {
    img: {
        template: "systems/knight/templates/items/parts/arme/img.hbs"
    },
    header: {
        template: "systems/knight/templates/items/parts/arme/header.hbs"
    },
    effets: {
        template: "systems/knight/templates/items/parts/common/sections/wpnEffects.hbs"
    },
  };

  /* -------------------------------------------- */

  get effectsPath() {
      return ['effets'];
  }

  get distancePath() {
      return ['distance'];
  }

  get effects2mainsPath() {
      return ['effets2mains'];
  }

  get munitionsPath() {
      return [];
  }

  get structurellePath() {
      return ['structurelles'];
  }

  get ornementalePath() {
      return ['ornementales'];
  }

  /* -------------------------------------------- */

  _toggleBtn(update, target, value) {
    super._toggleBtn(update, target, value);
    const resetVariable = target.dataset?.reset ?? false;

    if(resetVariable && value) {
      update[`system.degats.variable.has`] = false;
      update[`system.violence.variable.has`] = false;
    } else if(!resetVariable && value) {
      update[`system.degats.dice`] = Number(this.item.system.degats.variable.min.dice);
      update[`system.degats.fixe`] = Number(this.item.system.degats.variable.min.fixe);
      update[`system.violence.dice`] = Number(this.item.system.violence.variable.min.fixe);
      update[`system.violence.fixe`] = Number(this.item.system.violence.variable.min.fixe);
    }
  }


  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    console.error(context);
    return context;
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch(partId) {
      case 'header':
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description, { async: true, });
        break;

      case 'effets':
        const type = context.item.system.type;
        const eff2mains = context.item.system?.options2mains?.['2main']?.has;

        if(type === 'contact') {
          context.ornementales = true;
          context.structurelles = true;

          if(eff2mains) context.effets2mains = true;
        } else if(type === 'distance') {
          context.distance = true;

          if(context.item.system?.optionsmunitions?.has) context.optionsmunitions = true;
        }

        context.wpnPath = ``;
        break;
    }

    return await super._preparePartContext(partId, context, options);
  }
}
