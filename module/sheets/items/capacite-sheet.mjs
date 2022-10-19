import { listEffects } from "../../helpers/common.mjs";

/**
 * @extends {ItemSheet}
 */
export class CapaciteSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "capacite"],
      template: "systems/knight/templates/items/capacite-sheet.html",
      width: 700,
      height: 400,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareEffets(context);

    context.systemData = context.data.system;

    console.log(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    html.find('img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.main").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.effets").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.effets").position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      } else {
        if($(ev.currentTarget).parent().position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('div.main button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const type = target.data("type");
      const subtype = target.data("subtype");
      const result = value === true ? false : true;

      switch(type) {
        case "isPhase2":
          this.item.update({[`system.${type}`]:result});
          break;

        case "attaque":
          this.item.update({[`system.${type}.has`]:result});
          break;

        case "degats":
          this.item.update({[`system.${type}.has`]:result});
          break;

        case "aspect":
          this.item.update({[`system.bonus.${subtype}.${type}.lie`]:result});
          break;

        default:
          this.item.update({[`system.bonus.${type}.has`]:result});
          break;
      }
    });

    html.find('div.effets a.edit').click(async ev => {
      const data = this.getData();
      const maxEffets = data.systemData.type === 'contact' ? data?.systemData?.restrictions?.contact?.maxEffetsContact || undefined : undefined;
      const stringPath = $(ev.currentTarget).data("path");
      const aspects = CONFIG.KNIGHT.listCaracteristiques;
      let path = data.data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:aspects, maxEffets:maxEffets}).render(true);
    });
  }

  _prepareEffets(context) {
    const dEffets = context.data.system.degats.system.effets;

    const bRaw = dEffets.raw;
    const bCustom = dEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    dEffets.liste = listEffects(bRaw, bCustom, labels);

    const aEffets = context.data.system.attaque.effets;

    const aRaw = aEffets.raw;
    const aCustom = aEffets.custom;

    aEffets.liste = listEffects(aRaw, aCustom, labels);
  }
}
