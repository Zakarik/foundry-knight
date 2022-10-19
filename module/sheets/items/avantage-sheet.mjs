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
      const actuel = this.getData().data.system.bonus.initiative.ifEmbuscade.has || false;
      
      let result = false;

      if(!actuel)  {
        result = true;
      }

      const update = {
        data: {
          bonus: {
            initiative: {
              ifEmbuscade: {
                has:result
              }
            }
          }
        }
      };

      this.item.update(update);
    });

    html.find('div.diminutionCout button').click(ev => {
      ev.preventDefault();
      const actuel = this.getData().data.system.bonus.coutsReduits.has || false;
      
      let result = false;

      if(!actuel)  {
        result = true;
      }

      const update = {
        data: {
          bonus: {
            coutsReduits: {
                has:result
            }
          }
        }
      };

      this.item.update(update);
    });
  }
}
