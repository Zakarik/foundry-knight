import BaseArmeSheet from "../bases/base-arme-sheet.mjs";
import concatHtml from "../../utils/generateHTML.mjs";
import PatchBuilder from "../../utils/patchBuilder.mjs";

/**
 * @extends {ItemSheet}
 */
export class CyberwareSheet extends BaseArmeSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "cyberware"],
      template: "systems/knight/templates/items/cyberware-sheet.html",
      width: 900,
      height: 800,
      scrollY: [".attributes"],
      tabs: [
        {navSelector: ".sheet-tabs", contentSelector: ".body", initial: ""},
      ],
      dragDrop: [{ dragSelector: ".item-list", dropSelector: null }],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    context.systemData = context.data.system;
    const actor = context.item.system.actor;
    context.degats = {
      base:concatHtml('degats', {
        systemPath:'system.arme',
        arme:context.systemData.arme
      }),
    }

    context.violence = {
      base:concatHtml('violence', {
        systemPath:'system.arme',
        arme:context.systemData.arme
      }),
    }

    context.blessures = {
      '':'',
    }

    if(actor) {
      const filterItm = actor.items.filter(itm =>
        itm.type === 'blessure' &&
        ((!itm.system.soigne.implant && !itm.system.soigne.reconstruction) ||
        itm.id === context.data.system.soin.blessuresSoignees));
      for(let b of filterItm) {
          context.blessures[b._id] = b.name.replace(` (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`, "");
      }
    }

    console.error(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('button.toggle').click(ev => {
      const tgt = $(ev.currentTarget);
      const path = tgt.data("path");
      const item = this.item;
      const value = !foundry.utils.getProperty(item, path);

      item.update({[path]:value});
    });

    html.find('button.add').click(ev => {
      const tgt = $(ev.currentTarget);
      const path = tgt.data("path");
      const defaultValuePath = path.split(".")
                              .slice(0, -1)
                              .join(".");
      const item = this.item;
      const array = foundry.utils.getProperty(item, path);
      const arrayDefaultField = foundry.utils.getProperty(item, `${defaultValuePath}.defaultListValue`);

      array.push(arrayDefaultField);
      item.update({[path]:array});
    });

    html.find('div.menuLeft button.menuV').click(ev => {
      const tgt = $(ev.currentTarget);
      const type = tgt.data("type");
      const item = this.item;
      const value = item.system[type]?.has ?? false;

      item.update({[`system.${type}.has`]:!value});
    });

    html.find('div.effects div.list .delete').click(ev => {
      const tgt = $(ev.currentTarget);
      const index = tgt.data("index");
      const list = this.item.system.effects.list;
      list.splice(index, 1);

      this.item.update({[`system.effects.list`]:list});
    });
  }

  /** Réagir au drop */
  async _onDrop(event) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (!data) return;
    const item = await foundry.utils.fromUuid(data.uuid);
    if(!item) return;

    if(item.type !== 'arme') return;

    let pb = new PatchBuilder();
    pb.sys('arme.has', true);
    pb.sys('arme.type', item.system.type);
    pb.sys('arme.portee', item.system.portee);
    pb.sys('arme.optionsmunitions', item.system.optionsmunitions);
    pb.sys('arme.degats', item.system.degats);
    pb.sys('arme.violence', item.system.violence);
    pb.sys('arme.effets', item.system.effets);
    pb.applyTo(this.item);
  }
}
