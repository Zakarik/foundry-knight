import toggler from '../../helpers/toggler.js';

/**
 * @extends {ItemSheet}
 */
export class ArtSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "art"],
      template: "systems/knight/templates/items/art-sheet.html",
      width: 700,
      height: 400,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    const pratique = context.data.system.pratique;
    const oeuvre = context.data.system.oeuvre;

    if(pratique.has) pratique.label = game.i18n.localize("KNIGHT.ART.PRATIQUE.Has");
    else  pratique.label = game.i18n.localize("KNIGHT.ART.PRATIQUE.Hasnt");

    if(oeuvre.has) oeuvre.label = game.i18n.localize("KNIGHT.ART.OEUVRE.Has");
    else  oeuvre.label = game.i18n.localize("KNIGHT.ART.OEUVRE.Hasnt");

    context.systemData = context.data.system;

    console.log(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

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
