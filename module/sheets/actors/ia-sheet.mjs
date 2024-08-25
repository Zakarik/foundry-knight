import {
  confirmationDialog,
  getDefaultImg,
} from "../../helpers/common.mjs";

import toggler from '../../helpers/toggler.js';

/**
 * @extends {ActorSheet}
 */
export class IASheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ia", "sheet", "actor"],
      template: "systems/knight/templates/actors/ia-sheet.html",
      width: 900,
      height: 600,
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);

    context.systemData = context.data.system;

    console.warn(context);

    return context;
  }

  /**
     * Return a light sheet if in "limited" state
     * @override
     */
   get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/knight/templates/actors/limited-sheet.html";
    }
    return this.options.template;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-edit').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      item.sheet.render(true);
    });

    html.find('.item-delete').click(async ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      if(!await confirmationDialog()) return;

      item.delete();
      header.slideUp(200, () => this.render(false));
    });
  }

  /* -------------------------------------------- */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `${game.i18n.localize(`ITEM.Type${type.capitalize()}`)}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      img:getDefaultImg(type),
      system: data
    };

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];
    itemData.system.type = 'ia';

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    const ignoredTypes = [
      'arme', 'module',
      'armure', 'motivationMineure',
      'contact', 'blessure', 'trauma',
      'langue', 'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (ignoredTypes.includes(itemBaseType)) return;
    if ((itemBaseType === 'avantage' || itemBaseType === 'inconvenient') && itemData[0].system.type !== 'ia') return;


    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;7

    const avantageIA = [];
    const inconvenientIA = [];

    for (let i of sheetData.items) {
      // AVANTAGE.
      if (i.type === 'avantage') {
        avantageIA.push(i);
      }

      // INCONVENIENT.
      if (i.type === 'inconvenient') {
        inconvenientIA.push(i);
      }
    }

    actorData.avantages = avantageIA;
    actorData.inconvenient = inconvenientIA;
  }
}
