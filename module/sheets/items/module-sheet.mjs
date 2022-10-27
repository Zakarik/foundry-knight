import { SortByLabel } from "../../helpers/common.mjs";
import { listEffects } from "../../helpers/common.mjs";
/**
 * @extends {ItemSheet}
 */
export class ModuleSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "module"],
      template: "systems/knight/templates/items/module-sheet.html",
      width: 700,
      height: 450,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._listeCategorie(context);
    this._listeRarete(context);
    this._translate(context);
    this._prepareEffetsListe(context);
    this._prepareEnergieTranslate(context);

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

    html.find('.button').click(ev => {
      const value = $(ev.currentTarget).data("value");
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype") || false;
      const name = $(ev.currentTarget).data("name") === 'array' ? $(ev.currentTarget).data("num") : $(ev.currentTarget).data("name") || false;
      const subname = $(ev.currentTarget).data("subname") || false;
      const special = $(ev.currentTarget).data("special") || false;

      let result = true;

      if(value) { result = false; }

      let update = {};

      if(subtype === false) {
        update = {
          data:{
            [type]:result
          }
        };
      } else if(name === false) {
        update = {
          data:{
            [type]:{
              [subtype]:result
            }
          }
        };
      } else if(subname === false) {
        update = {
          data:{
            [type]:{
              [subtype]:{
                [name]:result
              }
            }
          }
        };
      } else if(special === false) {
        update = {
          data:{
            [type]:{
              [subtype]:{
                [name]:{
                  [subname]:result
                }
              }
            }
          }
        };
      } else {
        update = {
          data:{
            [type]:{
              [subtype]:{
                [name]:{
                  [subname]:{
                    [special]:result
                  }
                }
              }
            }
          }
        };
      }

      this.item.update(update);
    });

    html.find('div.effets a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      const type = $(ev.currentTarget).data("type");
      let data = this.getData().data;
      let path = data;

      stringPath.split(".").forEach(function(key){
        path = path[key];

      });

      let label = '';

      switch(type) {
        case 'distance':
          label = label = `${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Distance")}`
          break;

        case 'ornementales':
          label = `${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Ornementales")}`
          break;

        case 'structurelles':
          label = `${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Structurelles")}`
          break;

        default:
          label = `${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`
          break;
      }

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:data.system.overdrives, typeEffets:type, title:label}).render(true);
    });

    html.find('img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.baseW").width() / 2;
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

    html.find('a.create').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const id = $(ev.currentTarget).data("id");
      const data = this.getData().data.system;
      const pnj = data.pnj;
      const modele = pnj.modele;

      switch(type) {
        case 'pnj':
          const liste = pnj.liste;

          this.item.update({[`system.pnj.liste.${Object.keys(liste).length}`]:modele});
          break;

        case 'jetSpecifiques':
          const jModele = modele.jetSpecial.modele;
          const jListe = pnj.liste[id].jetSpecial.liste;

          this.item.update({[`system.pnj.liste.${id}.jetSpecial.liste.${Object.keys(jListe).length}`]:jModele});
          break;

        case 'armes':
          const aModele = modele.armes.modele;
          const aListe = pnj.liste[id].armes.liste;

          this.item.update({[`system.pnj.liste.${id}.armes.liste.${Object.keys(aListe).length}`]:aModele});
          break;
      };
    });

    html.find('a.delete').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const nPnj = $(ev.currentTarget).data("pnj");
      const id = $(ev.currentTarget).data("id");

      switch(type) {
        case 'pnj':
          this.item.update({[`data.pnj.liste.-=${id}`]:null});
          break;

        case 'jetSpecifiques':
          this.item.update({[`data.pnj.liste.${nPnj}.jetSpecial.liste.-=${id}`]:null});
          break;

        case 'armes':
          this.item.update({[`data.pnj.liste.${nPnj}.armes.liste.-=${id}`]:null});
          break;
      };
    });

    html.find('select.typePNJ').change(ev => {
      const id = $(ev.currentTarget).data("id");
      const value = $(ev.currentTarget).val();

      const dice = value === 'bande' ? 0 : 3;
      const fixe = value === 'bande' ? 1 : 0;
      const update = {data:{pnj:{liste:{[id]:{initiative:{dice:dice, fixe:fixe}}}}}}

      this.item.update(update);
    });

    html.find('input.dgtsF').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();

      if(target.hasClass("dgtsMax")) {
        html.find('input.dgtsMin').val(value);
        html.find('input.dgtsFBase').val(value);
      } else if(target.hasClass("dgtsMin")) {
        html.find('input.dgtsMax').val(value);
        html.find('input.dgtsFBase').val(value);
      } else if(target.hasClass("dgtsFBase")) {
        html.find('input.dgtsMin').val(value);
        html.find('input.dgtsMax').val(value);
      }
    });

    html.find('input.violenceF').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();

      if(target.hasClass("violenceMax")) {
        html.find('input.violenceMin').val(value);
        html.find('input.violenceFBase').val(value);
      } else if(target.hasClass("violenceMin")) {
        html.find('input.violenceMax').val(value);
        html.find('input.violenceFBase').val(value);
      } else if(target.hasClass("violenceFBase")) {
        html.find('input.violenceMin').val(value);
        html.find('input.violenceMax').val(value);
      }
    });

    html.find('input.dgtsD').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();

      html.find('input.dgtsDBase').val(value);
    });

    html.find('input.violenceD').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();

      html.find('input.violenceDBase').val(value);
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const type = textarea.data("type");
      const min = textarea.data("min");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));

      this.item.update({[`system.textarea.${type}`]:Math.max(height, min)});
    });
  }

  _listeCategorie(context) {
    const normal = CONFIG.KNIGHT.module.categorie.normal;
    const prestige = CONFIG.KNIGHT.module.categorie.prestige;
    const cat = [];
    const catObject = {};

    for (let [key, categorie] of Object.entries(normal)) {
      cat.push(
        {
          key:key,
          label:game.i18n.localize(categorie)
        }
      );
    }

    if(context.data.system.rarete === 'prestige') {
      for (let [key, categorie] of Object.entries(prestige)) {
        cat.push(
          {
            key:key,
            label:game.i18n.localize(categorie)
          }
        );
      }
    }

    cat.sort(SortByLabel);

    for (let i = 0;i < cat.length;i++) {
      catObject[cat[i].key] = {};
      catObject[cat[i].key] = cat[i].label;
    };

    context.data.system.listes.categorie = catObject;
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

  _translate(context) {
    const data = context.data.system;
    const duree = data.permanent;
    const bonus = data?.bonus?.has || false;
    const pnj = data.pnj;
    const armure = data?.bonus?.armure?.has || false;
    const champDeForce = data?.bonus?.champDeForce?.has || false;
    const energie = data?.bonus?.energie?.has || false;
    const degats = data?.bonus.degats;
    const violence = data?.bonus.violence;
    const arme = data.arme;
    const overdrives = data.overdrives;
    const bonusOverdrives = data.bonus.overdrives;
    const bonusGrenades = data.bonus.grenades;
    const ersatz = data.ersatz;
    const eRogue = ersatz.rogue;
    const eBard = ersatz.bard;

    const pHas = pnj?.has || false;
    const pLis = pnj?.liste?.length || 0;

    const dHas = degats?.has || false;
    const dVar = degats?.variable?.has ||false;

    const vHas = violence?.has || false;
    const vVar = violence?.variable?.has || false;

    const aHas = data?.arme?.has || false;
    const aDeg = arme?.degats?.variable?.has || false;
    const aVio = arme?.violence?.variable?.has || false;

    const oHas = overdrives?.has || false;

    const oBHas = bonusOverdrives?.has || false;

    const gBHas = bonusGrenades?.has || false;

    const eRHas = eRogue?.has || false;
    const eBHas = eBard?.has || false;

    if(duree) { data.labels.duree = game.i18n.localize("KNIGHT.ITEMS.MODULE.DUREE.Permanent"); }
    else { data.labels.duree = game.i18n.localize("KNIGHT.ITEMS.MODULE.DUREE.NotPermanent"); }

    if(bonus) { data.labels.bonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.BONUS.Has"); }
    else { data.labels.bonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.BONUS.Hasnt"); }

    if(pHas) { data.labels.pnj = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.Has"); }
    else { data.labels.pnj = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.Hasnt"); }

    if(pLis > 1) { data.labels.pnjTitle = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.LabelP"); }
    else { data.labels.pnjTitle = game.i18n.localize("KNIGHT.ITEMS.MODULE.PNJ.LabelS"); }

    if(armure) { data.labels.armure = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARMURE.Bonus"); }
    else { data.labels.armure = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARMURE.NoBonus"); }

    if(champDeForce) { data.labels.champDeForce = game.i18n.localize("KNIGHT.ITEMS.MODULE.CDF.Bonus"); }
    else { data.labels.champDeForce = game.i18n.localize("KNIGHT.ITEMS.MODULE.CDF.NoBonus"); }

    if(energie) { data.labels.energie = game.i18n.localize("KNIGHT.ITEMS.MODULE.ENERGIE.Bonus"); }
    else { data.labels.energie = game.i18n.localize("KNIGHT.ITEMS.MODULE.ENERGIE.NoBonus"); }

    if(dHas) { data.labels.degatsBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.Bonus"); }
    else { data.labels.degatsBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.NoBonus"); }

    if(dVar) { data.labels.degatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.Variable"); }
    else { data.labels.degatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.DEGATS.NoVariable"); }

    if(vHas) { data.labels.violenceBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.Bonus"); }
    else { data.labels.violenceBonus = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.NoBonus"); }

    if(vVar) { data.labels.violenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.Variable"); }
    else { data.labels.violenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.VIOLENCE.NoVariable"); }

    if(aHas) { data.labels.arme = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.Has"); }
    else { data.labels.arme = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.Hasnt"); }

    if(aDeg) { data.labels.armeDegatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.DEGATS.Variable"); }
    else { data.labels.armeDegatsVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.DEGATS.NoVariable"); }

    if(aVio) { data.labels.armeViolenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.VIOLENCE.Variable"); }
    else { data.labels.armeViolenceVariable = game.i18n.localize("KNIGHT.ITEMS.MODULE.ARME.VIOLENCE.NoVariable"); }

    if(oHas) { data.labels.overdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Has"); }
    else { data.labels.overdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Hasnt"); }

    if(oBHas) { data.labels.bonusOverdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Hasbonus"); }
    else { data.labels.bonusOverdrives = game.i18n.localize("KNIGHT.ITEMS.MODULE.OVERDRIVES.Hasntbonus"); }

    if(gBHas) { data.labels.bonusGrenades = game.i18n.localize("KNIGHT.ITEMS.MODULE.GRENADES.Has"); }
    else { data.labels.bonusGrenades = game.i18n.localize("KNIGHT.ITEMS.MODULE.GRENADES.Hasnt"); }

    if(eRHas) { data.labels.ersatzRogue = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Has"); }
    else { data.labels.ersatzRogue = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Hasnt"); }

    if(eBHas) { data.labels.ersatzBard = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.BARD.Has"); }
    else { data.labels.ersatzBard = game.i18n.localize("KNIGHT.ITEMS.MODULE.ERSATZ.BARD.Hasnt"); }
  }

  _prepareEffetsListe(context) {
    const effets = context.data.system.arme.effets || false;
    const distance = context.data.system.arme.distance || false;
    const structurelles = context.data.system.arme.structurelles || false;
    const ornementales = context.data.system.arme.ornementales || false;
    const pnjListe = context.data.system.pnj.liste;

    if(effets !== false) {
      const raw = effets.raw;
      const custom = effets.custom;
      const labelsE = CONFIG.KNIGHT.effets;

      effets.liste = listEffects(raw, custom, labelsE);
    }

    if(distance !== false) {
      const raw = distance.raw;
      const custom = distance.custom;
      const labelsD = CONFIG.KNIGHT.AMELIORATIONS.distance;

      distance.liste = listEffects(raw, custom, labelsD);
    }

    if(structurelles !== false) {
      const raw = structurelles.raw;
      const custom = structurelles.custom;
      const labelsS = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

      structurelles.liste = listEffects(raw, custom, labelsS);
    }

    if(ornementales !== false) {
      const raw = ornementales.raw;
      const custom = ornementales.custom;
      const labelsO = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

      ornementales.liste = listEffects(raw, custom, labelsO);
    }

    for (let [key, pnj] of Object.entries(pnjListe)) {
      const pnjArmes = pnj.armes.liste;

      for (let [kArme, arme] of Object.entries(pnjArmes)) {
        const rArme = arme.effets.raw;
        const cArme = arme.effets.custom;
        const labelsA = CONFIG.KNIGHT.effets;

        arme.effets.liste = listEffects(rArme, cArme, labelsA);
      }
    }
  }

  _prepareEnergieTranslate(context) {
    const energie = context.data.system.energie;
    const update = {};

    if(energie.tour.label === "") update["system.energie.tour.label"] = `${game.i18n.localize("KNIGHT.AUTRE.Tour")}`;
    if(energie.minute.label === "") update["system.energie.minute.label"] = `${game.i18n.localize("KNIGHT.AUTRE.Minute")}`;

    if (!foundry.utils.isEmpty(update)) this.item.update(update);
  }
}
