import BaseItemSheet from "../bases/items/base-item-sheet.mjs";
import SpecialEffectsMixin from "../bases/items/mixin-item-specialEffects.mjs";

/**
 * @extends {ItemSheet}
 */
export class AvantageSheet extends SpecialEffectsMixin(BaseItemSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["avantage"],
    position: { width: 700, height: 450 },
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
  /*getData() {
    const context = super.getData();
    const type = this?.actor?.type || false;

    if(type !== false && type === 'ia') context.data.system.onlyIA = true;

    context.systemData = context.data.system;

    console.error(context);

    return context;
  }*/

  /* -------------------------------------------- */

  /** @inheritdoc */
	/*activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('div.initiative button').click(ev => {
      ev.preventDefault();
      const actuel = this.item.system.bonus.initiative.ifEmbuscade.has || false;

      let result = false;

      if(!actuel)  {
        result = true;
      }

      this.item.update({[`system.bonus.initiative.ifEmbuscade.has`]:result});
    });

    html.find('div.diminutionCout button').click(ev => {
      ev.preventDefault();
      const actuel = this.item.system.bonus.coutsReduits.has || false;

      let result = false;

      if(!actuel)  {
        result = true;
      }

      this.item.update({[`system.bonus.coutsReduits.has`]:result});
    });

    html.find('button.avantage').click(ev => {
      ev.preventDefault();
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const actuel = this.item.system.bonus[type] || false;

      let result = false;

      if(!actuel)  {
        result = true;
      }

      this.item.update({[`system.bonus.${type}`]:result});
    });
  }*/
}
