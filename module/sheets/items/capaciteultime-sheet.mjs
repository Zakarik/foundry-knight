import { listEffects } from "../../helpers/common.mjs";
/**
 * @extends {ItemSheet}
 */
export class CapaciteUltimeSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "capaciteUltime"],
      template: "systems/knight/templates/items/capaciteUltime-sheet.html",
      width: 900,
      height: 600,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareEffets(context);

    context.settings = {
      armorBase:game.settings.get("knight", "include-armorbase"),
      armor2038:game.settings.get("knight", "include-capacite2038"),
      armorSorcerer:game.settings.get("knight", "include-capacite2038sorcerer"),
      armorCodex:game.settings.get("knight", "include-capacitecodex"),
      armorAtlas:game.settings.get("knight", "include-capaciteatlas"),
      armorAtlasSpe:game.settings.get("knight", "include-capaciteatlasspecial"),
    };

    context.systemData = context.data.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('header.header button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const type = target.data("type");

      this.item.update({[`system.${type}`]:value});
    });

    html.find('div.passive button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value") === true ? false : true;
      const toupdate = target?.data("toupdate");

      const update = {[`system.${toupdate}`]:value};

      this.item.update(update);
    });

    html.find('div.active button.clickable').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value") === true ? false : true;
      const toupdate = target?.data("toupdate");

      const update = {[`system.${toupdate}`]:value};

      this.item.update(update);
    });

    html.find('div.effets a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      let path = this.getData().data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:this.getData().data.system.overdrives, title:`${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
    });

    html.find('img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.main").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.data").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.data").position().left > width) {
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

    html.find('.addCJet button.add').click(ev => {
      const target = $(ev.currentTarget);
      const list = target.data("list").length === 0 ? [] : target.data("list").split(',');
      const toadd = html.find('.addCJet select.list').val();
      list.push(toadd);

      this.item.update({[`system.actives.jet.variable.caracteristiques`]:list});
    });

    html.find('.addDmg button.add').click(ev => {
      const target = $(ev.currentTarget);
      const list = target.data("list").length === 0 ? [] : target.data("list").split(',');
      const toupdate = target.data("toupdate");
      const addClass = target.data("class");
      const toaddD = html.find(`.${addClass} input.dice`).val();
      const toaddF = html.find(`.${addClass} input.fixe`).val();

      list.push(`${toaddD}${game.i18n.localize("KNIGHT.JETS.Des-short")}6+${toaddF}`);
      list.sort((a, b) => {
        const aSplit1 = parseInt(a.split('D')[0]);
        const aSplit2 = parseInt(a.split('+')[1]);
        const bSplit1 = parseInt(b.split('D')[0]);
        const bSplit2 = parseInt(b.split('+')[1]);
        const dice = aSplit1 - bSplit1;
        const fixe = aSplit2 - bSplit2;

        if(dice > 0) return 1;
        else if(dice < 0) return -1;
        else if(dice === 0) {
          if(fixe > 0) return 1;
          if(fixe <= 0) return -1;
        }
      });

      this.item.update({[`system.${toupdate}`]:list});
    });

    html.find('.addCJet img.delete').click(ev => {
      const target = $(ev.currentTarget);
      const index = target.data("index");
      const list = target.data("list").split(',');

      list.splice(index, 1)

      this.item.update({[`system.actives.jet.variable.caracteristiques`]:list});
    });

    html.find('.addDmg img.delete').click(ev => {
      const target = $(ev.currentTarget);
      const index = target.data("index");
      const toupdate = target.data("toupdate");
      const list = target.data("list").split(',');

      list.splice(index, 1)

      this.item.update({[`system.${toupdate}`]:list});
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const min = textarea.data("min");
      const toupdate = textarea.data("toupdate");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));
      this.item.update({[`system.${toupdate}`]:Math.max(height, min)});
    });
  }

  _prepareEffets(context) {
    const labels = CONFIG.KNIGHT.effets;

    const oriflamme = context.data.system.passives.capacites.oriflamme.update.effets;

    const oRaw = oriflamme.raw;
    const oCustom = oriflamme.custom;

    oriflamme.liste = listEffects(oRaw, oCustom, labels);

    const vague = context.data.system.passives.capacites.cea.update.vague.effets;

    const vRaw = vague.raw;
    const vCustom = vague.custom;

    vague.liste = listEffects(vRaw, vCustom, labels);

    const salve = context.data.system.passives.capacites.cea.update.salve.effets;

    const sRaw = salve.raw;
    const sCustom = salve.custom;

    salve.liste = listEffects(sRaw, sCustom, labels);

    const rayon = context.data.system.passives.capacites.cea.update.rayon.effets;

    const rRaw = rayon.raw;
    const rCustom = rayon.custom;

    rayon.liste = listEffects(rRaw, rCustom, labels);

    const griffe = context.data.system.passives.capacites.morph.update.polymorphie.griffe.effets;

    const gRaw = griffe.raw;
    const gCustom = griffe.custom;

    griffe.liste = listEffects(gRaw, gCustom, labels);

    const lame = context.data.system.passives.capacites.morph.update.polymorphie.lame.effets;

    const lRaw = lame.raw;
    const lCustom = lame.custom;

    lame.liste = listEffects(lRaw, lCustom, labels);

    const canon = context.data.system.passives.capacites.morph.update.polymorphie.canon.effets;

    const cRaw = canon.raw;
    const cCustom = canon.custom;

    canon.liste = listEffects(cRaw, cCustom, labels);

    const degats = context.data.system.actives.degats.effets;

    const dRaw = degats.raw;
    const dCustom = degats.custom;

    degats.liste = listEffects(dRaw, dCustom, labels);

    const violence = context.data.system.actives.violence.effets;

    const viRaw = violence.raw;
    const viCustom = violence.custom;

    violence.liste = listEffects(viRaw, viCustom, labels);

    const effets = context.data.system.actives.effets;

    const eRaw = effets.raw;
    const eCustom = effets.custom;

    effets.liste = listEffects(eRaw, eCustom, labels);
  }
}
