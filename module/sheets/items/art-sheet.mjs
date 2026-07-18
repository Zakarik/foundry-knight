import BaseItemSheet from "../bases/items/base-item-sheet.mjs";

/**
 * @extends {ItemSheet}
 */
export class ArtSheet extends BaseItemSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["art"],
    position: { width: 700, height: 400 },
    scrollY: [".attributes"],
    actions:{}
  }

  static PARTS = {
    img: {
        template: "systems/knight/templates/items/parts/common/sections/img.hbs"
    },
    header: {
        template: "systems/knight/templates/items/parts/art/header.hbs"
    },
    body: {
        template: "systems/knight/templates/items/parts/art/body.hbs"
    },
  };

  /* -------------------------------------------- */


  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    console.error(context);
    return context;
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    console.error(context);

    switch(partId) {
      case 'header':
        console.error(context.document.system.description)
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(context.document.system.description, { async: true, });
        break;
    }

    return await super._preparePartContext(partId, context, options);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.sheet-header button').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const value = target.data("value");

      const result = value ? false : true;
      const update = {
        system:{
          [type]:{
            has:result
          }
        }
      };

      this.item.update(update);
    });

    html.find('.item-create').click(ev => {
      const data = this.getData().data.system;
      const entries = Object.entries(data.oeuvre.liste);
      const length = entries.length;
      const save = {};

      for(let i = 0; i < length;i++) {
        save[`o${i}`] = {
          name:entries[i].name,
          description:entries[i].description,
          textarea:entries[i].textarea
        }
      };

      save[`o${length}`] = {
        name:"",
        description:"",
        textarea:50
      };

      this.item.update({[`system.oeuvre.liste`]:save});
    });

    html.find('.item-delete').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");

      this.item.update({[`system.oeuvre.liste.-=${key}`]:null});
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const type = textarea.data("type");
      const key = textarea.data("key");
      const min = textarea.data("min");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));

      if(type === 'oeuvreliste') {
        this.item.update({[`system.oeuvre.liste.${key}.textarea`]:Math.max(height, min)});
      } else {
        this.item.update({[`system.textarea.${type}`]:Math.max(height, min)});
      }
    });
  }
}
