
import {
  confirmationDialog,
} from "../../helpers/common.mjs";

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
    actions:{
      subItemCreate:this.#onSubItemCreate,
      subItemDelete:this.#onSubItemDelete,
    }
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

  static #onSubItemCreate(event, target) {
    const data = this.document.system;
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

    this.document.update({[`system.oeuvre.liste`]:save});
  }

  static async #onSubItemDelete(event, target) {
    const key = target.dataset.key;

    if(!await confirmationDialog('delete', `Confirmation`)) return;

    this.item.update({[`system.oeuvre.liste.-=${key}`]:null});
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

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    this.element.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('blur', async ev => {
        const el = ev.currentTarget;
        const type = el.dataset.type;
        const key = el.dataset.key;
        const min = Number(el.dataset.min);

        el.style.height = `${min}px`;
        const height = el.scrollHeight + 1;

        el.style.height = `${Math.max(height, min)}px`;

        switch(type) {
          case 'oeuvreliste':
            this.item.update({ [`system.oeuvre.liste.${key}.textarea`]: Math.max(height, min) });
            break;

          case 'oeuvrebase':
            this.item.update({ [`system.oeuvre.textarea.base`]: Math.max(height, min) });
            break;

          default:
            this.item.update({ [`system.pratique.textarea.${type}`]: Math.max(height, min) });
            break;
        }
      });
    });
  }
}
