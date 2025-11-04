/**
 * @extends {ItemSheet}
 */
export class AvantageSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "avantage"],
      template: "systems/knight/templates/items/avantage-sheet.html",
      width: 700,
      height: 450,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    const type = this?.actor?.type || false;

    if(type !== false && type === 'ia') context.data.system.onlyIA = true;

    context.systemData = context.data.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
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
  }
}
