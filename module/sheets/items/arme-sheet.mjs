import { listEffects } from "../../helpers/common.mjs";
/**
 * @extends {ItemSheet}
 */
export class ArmeSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "arme"],
      template: "systems/knight/templates/items/arme-sheet.html",
      width: 700,
      height: 450,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    const actor = this.actor;
    
    this._listeRarete(context);
    this._prepareEffets(context);
    this._prepareDistance(context);
    this._prepareOrnementales(context);
    this._prepareStructurelles(context);

    if(actor) {
      const contrecoups = actor?.armureData?.system?.special?.selected?.contrecoups || false;

      if(contrecoups !== false) {
        const hasMaxEffets = contrecoups.maxeffets.value;
        const hasArmeDistance = contrecoups.armedistance.value;
        context.data.system.restrictions = {};
        
        if(hasMaxEffets) {
          context.data.system.restrictions.contact = {};
          context.data.system.restrictions.contact.has = contrecoups.maxeffets.value;
          context.data.system.restrictions.contact.maxEffetsContact = contrecoups.maxeffets.max;
          context.data.system.effets.count = context.data.system.effets.raw.length;
        }

        context.data.system.restrictions.distance = !hasArmeDistance ? true : false;
      }
    }

    context.systemData = context.data.system;


    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    html.find('.header .far').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square");
      $(ev.currentTarget).toggleClass("fa-minus-square");
      $(ev.currentTarget).parents(".header").siblings().toggle();
    });

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('div.tourelle button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const result = value === true ? false : true;

      this.item.update({[`system.tourelle.has`]:result});
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

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:aspects, maxEffets:maxEffets, title:`${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
    });

    html.find('div.distance a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      const aspects = CONFIG.KNIGHT.listCaracteristiques;
      let path = this.getData().data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:aspects, typeEffets:'distance', title:`${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.Distance")}`}).render(true);
    });

    html.find('div.ornementales a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      const aspects = CONFIG.KNIGHT.listCaracteristiques;
      let path = this.getData().data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:aspects, typeEffets:'ornementales', title:`${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.Ornementales")}`}).render(true);
    });

    html.find('div.structurelles a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      const aspects = CONFIG.KNIGHT.listCaracteristiques;
      let path = this.getData().data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:aspects, typeEffets:'structurelles', title:`${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.Structurelles")}`}).render(true);
    });

    html.find('img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.blockEffets").width() / 2;
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
  }

  _prepareEffets(context) {
    const bEffets = context.data.system.effets;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    bEffets.liste = listEffects(bRaw, bCustom, labels);
  }

  _prepareDistance(context) {
    const bEffets = context.data.system.distance;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const labels = CONFIG.KNIGHT.AMELIORATIONS.distance;

    bEffets.liste = listEffects(bRaw, bCustom, labels);
  }

  _prepareStructurelles(context) {
    const bEffets = context.data.system.structurelles;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const labels = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

    bEffets.liste = listEffects(bRaw, bCustom, labels);
  }

  _prepareOrnementales(context) {
    const bEffets = context.data.system.ornementales;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const labels = CONFIG.KNIGHT.AMELIORATIONS.ornementales;

    bEffets.liste = listEffects(bRaw, bCustom, labels);
  }

  _listeRarete(context) {
    const rare = CONFIG.KNIGHT.module.rarete;
    const rar = [];
    const rarObject = {};

    for (let [key, rarete] of Object.entries(rare)) {
      rar.push(
        {
          key:key,
          label:game.i18n.localize(rarete)
        }
      );
    }

    for (let i = 0;i < rar.length;i++) {
      rarObject[rar[i].key] = {};
      rarObject[rar[i].key] = rar[i].label;
    };
    
    context.data.system.listes.rarete = rarObject;
  }
}
