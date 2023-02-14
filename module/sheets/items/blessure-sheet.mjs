/**
 * @extends {ItemSheet}
 */
export class BlessureSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "blessure"],
      template: "systems/knight/templates/items/blessure-sheet.html",
      width: 700,
      height: 645,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    for (let [key, aspect] of Object.entries(context.data.system.aspects)){
      aspect.label = game.i18n.localize(CONFIG.KNIGHT.blessures[key]);

      for (let [keyCar, carac] of Object.entries(aspect.caracteristiques)){
        carac.label = game.i18n.localize(CONFIG.KNIGHT.blessures[keyCar]);
      }
    }

    context.systemData = context.data.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.button').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const actuel = this.getData().data.data.soigne[type] || false;

      let result = false;

      if(!actuel) { result = true; }

      const update = {
        data: {
          soigne: {
            [type]:result
          }
        }
      };

      this.item.update(update);
    });
  }
}
