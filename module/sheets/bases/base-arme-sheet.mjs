/**
 * @extends {ItemSheet}
 */
export default class BaseArmeSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
    activateListeners(html) {
      super.activateListeners(html);


      html.find('img.info').click(ev => {
        const span = $(ev.currentTarget).siblings("span.hideInfo")
        const width = $(ev.currentTarget).parents("form.flexcol").width() / 2;
        const isW50 = $(ev.currentTarget).parents("div.effets").width();
        let position = "";
        let borderRadius = "border-top-right-radius";

        if(isW50 <= width) {
          if($(ev.currentTarget).parents("div.effets").position().left < width) {
            position = "right";
            borderRadius = "border-top-right-radius";
          } else {
            position = "left";
            borderRadius = "border-top-left-radius";
          }
        } else {
          if($(ev.currentTarget).parent().position().left < width) {
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

      html.find('input.dgtsF').change(async ev => {
        const target = $(ev.currentTarget);
        const path = target.data("path");
        const value = Number(target.val());
        let update = {};

        update[path] = value;

        await this.item.update(update);
      });

      html.find('div.effets a.edit').click(async ev => {
        const data = this.item;
        const stringPath = $(ev.currentTarget).data("path");
        const aspects = CONFIG.KNIGHT.listCaracteristiques;
        let path = data;

        stringPath.split(".").forEach(function(key){
          path = path[key];
        });

        await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:data._id, isToken:data?.parent?.isToken || false, token:data?.parent || null, raw:path.raw, custom:path.custom, activable:path.activable, toUpdate:stringPath, aspects:aspects, title:`${data.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
      });

      html.find('a.btnChargeurPlus').click(async ev => {
        const tgt = $(ev.currentTarget);
        const index = tgt.parents(".btnChargeur").data('index');
        const type = tgt.parents(".btnChargeur").data('type');
        const munition = tgt.parents(".btnChargeur").data('munition');
        const pnj = tgt.parents(".btnChargeur").data('pnj');
        const wpn = tgt.parents(".btnChargeur").data('wpn');

        this.item.system.addMunition(index, type, munition, pnj, wpn);

        this.item.render();
      });

      html.find('a.btnChargeurMoins').click(async ev => {
        const tgt = $(ev.currentTarget);
        const index = tgt.parents(".btnChargeur").data('index');
        const type = tgt.parents(".btnChargeur").data('type');
        const munition = tgt.parents(".btnChargeur").data('munition');
        const pnj = tgt.parents(".btnChargeur").data('pnj');
        const wpn = tgt.parents(".btnChargeur").data('wpn');

        this.item.system.removeMunition(index, type, munition, pnj, wpn);
        this.item.render();
      });
  }
}
