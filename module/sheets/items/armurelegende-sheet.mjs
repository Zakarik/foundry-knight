import { SortByLabel } from "../../helpers/common.mjs";
import { listEffects } from "../../helpers/common.mjs";
import toggler from '../../helpers/toggler.js';
/**
 * @extends {ItemSheet}
 */
export class ArmureLegendeSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "armurelegende"],
      template: "systems/knight/templates/items/armurelegende-sheet.html",
      width: 700,
      height: 400,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCapacitesTranslation(context);
    this._prepareSpecialTranslation(context);
    this._prepareDurationTranslation(context);
    this._prepareRangeTranslation(context);
    this._createCapaciteList(context);

    context.systemData = context.data.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('div.capacites div.add a').click(ev => {
      const value = $(ev.currentTarget).data("value");

      if(value === "") return;
      const data = this.getData();
      const capacites = data.data.system.capacites.all[value];
      const hasSpecial = capacites?.special || false;
      const alreadySpecial = data.data.system.special.selected?.[value] || false;

      let result = capacites;
      result.softlock = true;
      result.key = value;

      let update = {
        system:{
          jauges:{},
          capacites:{
            actuel:"",
            selected:{
              [value]:result
            }
          },
          special:{
            selected:{}
          }
        }
      };

      if(hasSpecial != false && alreadySpecial == false) {
        const special = data.data.system.special.all[hasSpecial];
        let rSpecial = special;
        rSpecial.softlock = true;
        rSpecial.key = hasSpecial;

        update.system.special.selected[hasSpecial] = rSpecial;
      }

      this.item.update(update);
    });

    html.find('div.capacites a.verrouillage').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const value = $(ev.currentTarget).data("value");

      let result = true;

      if(value) { result = false; }

      const update = {
        system:{
          capacites:{
            selected:{
              [type]:{
                softlock:result
              }
            }
          }
        }
      };

      this.item.update(update);
    });

    html.find('div.capacites a.delete').click(async ev => {
      const type = $(ev.currentTarget).data("type");

      this.item.update({[`system.capacites.selected.-=${type}`]:null});
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const capacite = textarea.data("capacite");
      const special = textarea.data("special") || false;
      const type = textarea.data("type");
      const min = textarea.data("min");
      const evo = textarea.data("evolution") || false;
      const key = textarea.data("key");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));
      if(evo) {
        if(special === true) {
          this.item.update({[`system.evolutions.special.${capacite}.evolutions.textarea.${type}`]:Math.max(height, min)});
        } else {
          this.item.update({[`system.evolutions.liste.${key}.capacites.${capacite}.textarea.${type}`]:Math.max(height, min)});
        }

      } else {
        this.item.update({[`system.capacites.selected.${capacite}.textarea.${type}`]:Math.max(height, min)});
      }
    });

    html.find('div.special a.verrouillage').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const value = $(ev.currentTarget).data("value");

      let result = true;

      if(value) { result = false; }

      const update = {
        system:{
          special:{
            selected:{
              [type]:{
                softlock:result
              }
            }
          }
        }
      };

      this.item.update(update);
    });

    html.find('div.special a.delete').click(async ev => {
      const type = $(ev.currentTarget).data("type");

      this.item.update({[`system.special.selected.-=${type}`]:null});
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const capacite = textarea.data("capacite");
      const special = textarea.data("special") || false;
      const type = textarea.data("type");
      const min = textarea.data("min");
      const evo = textarea.data("evolution") || false;
      const key = textarea.data("key");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));
      if(evo) {
        if(special === true) {
          this.item.update({[`system.evolutions.special.${capacite}.evolutions.textarea.${type}`]:Math.max(height, min)});
        } else {
          this.item.update({[`system.evolutions.liste.${key}.capacites.${capacite}.textarea.${type}`]:Math.max(height, min)});
        }

      } else {
        this.item.update({[`system.capacites.selected.${capacite}.textarea.${type}`]:Math.max(height, min)});
      }
    });
  }

  _createCapaciteList(context) {
    const capacites = context.data.system.capacites.all;
    const capacitesSelected = context.data.system.capacites.selected;
    let cArray = [];
    let cObject = {};

    for (let [key, capacite] of Object.entries(capacites)) {
      if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {
        cArray.push(
          {
            key:key,
            label:capacite.label
          }
        );
      }
    }

    cArray.sort(SortByLabel);

    if(Object.values(capacitesSelected).findIndex(element => element.key == "personnalise") == -1) {
      cArray.unshift({
        key:"personnalise",
        label:capacites["personnalise"].label
      });
    }

    for (let i = 0;i < cArray.length;i++) {
      cObject[cArray[i].key] = {};
      cObject[cArray[i].key] = cArray[i];
    }

    context.data.system.capacites.liste = cObject;
  }

  _prepareCapacitesTranslation(context) {
    this._prepareGoliathSelectedTranslation(context);
    this._prepareGhostSelectedTranslation(context);
    this._prepareFalconTranslation(context);
    this._prepareSelectedTypeTranslation(context);
    this._prepareDiscordTranslation(context);
    this._prepareMechanicTranslation(context);
    this._prepareCompanionsTranslation(context);
    this._prepareShrineTranslation(context);
    this._prepareEffetsSelectedOriflamme(context);
    this._prepareEffetsSelectedCompanions(context);
    this._prepareDurationTranslation(context);
    this._prepareRangeTranslation(context);

    const capacites = context.data.system.capacites.all;

    for (let [key, capacite] of Object.entries(capacites)) {
      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
    }
  }

  _prepareSpecialTranslation(context) {
    const specialList = context.data.system.special.all;

    for (let [key, special] of Object.entries(specialList)) {
      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
    }
  }

  _prepareShrineTranslation(context) {
    const capacite = context.data.system.capacites.all.shrine;

    capacite.portee = `${game.i18n.localize(CONFIG.KNIGHT.shrine.portee.personnelle)} / ${game.i18n.localize(CONFIG.KNIGHT.shrine.portee.moyenne)}`;
  }

  _prepareGoliathSelectedTranslation(context) {
    const capacite = context.data.system.capacites.selected?.goliath || false;

    if(!capacite) return;

    const labelRack = game.i18n.localize(CONFIG.KNIGHT.goliath["armesrack"])+" "+capacite.armesRack.value+" "+game.i18n.localize(CONFIG.KNIGHT.goliath["metrebonus"]).toLowerCase();
    const labelNoRack = game.i18n.localize(CONFIG.KNIGHT.goliath["armesnorack"]);

    if(capacite.armesRack.active === true) {
      capacite.armesRack.label = labelRack;
    } else {
      capacite.armesRack.label = labelNoRack;
    }
  }

  _prepareGhostSelectedTranslation(context) {
    const degats = context.data.system.capacites.selected?.ghost?.bonus?.degats || false;

    if(!degats) return;

    const odInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odinclus"]);
    const odNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odnoinclus"]);

    const diceInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["diceinclus"]);
    const diceNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["dicenoinclus"]);

    const fixeInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixeinclus"]);
    const fixeNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixenoinclus"]);

    if(degats.od === true) {
      degats.inclus.od = odInclus;
    } else {
      degats.inclus.od = odNoInclus;
    }

    if(degats.dice === true) {
      degats.inclus.dice = diceInclus;
    } else {
      degats.inclus.dice = diceNoInclus;
    }

    if(degats.fixe === true) {
      degats.inclus.fixe = fixeInclus;
    } else {
      degats.inclus.fixe = fixeNoInclus;
    }
  }

  _prepareFalconTranslation(context) {
    const capacite = context.data.system.capacites.all.falcon;

    capacite.informations = "<p>"+game.i18n.localize(CONFIG.KNIGHT.falcon["informations"])
    .replaceAll("\n**", "\n<b>")
    .replaceAll("**", "</b>")
    .replaceAll("\r\n", "</p><p>")
    .replaceAll(" _", " <em>")
    .replaceAll("_", "</em>")
    .replaceAll(" **", " <b>")+"</p>";
  }

  _prepareSelectedTypeTranslation(context) {
    const sType = context.data.system.capacites.selected?.type?.type || false;
    const labels = {};

    if(!sType) return;

    for (let [key, type] of Object.entries(sType)){
      type.label = game.i18n.localize(CONFIG.KNIGHT.type[key]);
      labels[key] = {};
      labels[key].label = game.i18n.localize(CONFIG.KNIGHT.type[key]);

      for (let [keyType, dType] of Object.entries(type.liste)){
        dType.label = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[keyType]);
        labels[key][keyType] = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[keyType]);
      }
    }
  }

  _prepareWarlordTranslation(context) {
    const capacite = context.data.system.capacites.all.warlord.impulsions;

    capacite.action.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.action["duree"]);
    capacite.esquive.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.esquive["duree"]);
    capacite.force.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.force["duree"]);
    capacite.guerre.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.guerre["duree"]);
    capacite.energie.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.energie["duree"]);

    capacite.action.bonus.description = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.action["bonus"]);
    capacite.energie.bonus.description = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.energie["bonus"]);
  }

  _prepareDiscordTranslation(context) {
    const capacite = context.data.system.capacites.all.discord;

    capacite.tour.duree = game.i18n.localize(CONFIG.KNIGHT.discord.tour.duree);
    capacite.scene.duree = game.i18n.localize(CONFIG.KNIGHT.discord.scene.duree);
  }

  _prepareMechanicTranslation(context) {
    const capacite = context.data.system.capacites.all.mechanic;

    capacite.reparation.contact.duree = game.i18n.localize(CONFIG.KNIGHT.mechanic.duree);
    capacite.reparation.distance.duree = game.i18n.localize(CONFIG.KNIGHT.mechanic.duree);
  }

  _prepareCompanionsTranslation(context) {
    const companions = context.data.system.capacites.all.companions;

    companions.lion.armes.contact.coups.label = game.i18n.localize(CONFIG.KNIGHT.companions["coups"]);
    companions.wolf.armes.contact.coups.label = game.i18n.localize(CONFIG.KNIGHT.companions["coups"]);
    companions.wolf.configurations.labor.description = game.i18n.localize(CONFIG.KNIGHT.companions.labor["description"]);
    companions.wolf.configurations.medic.description = game.i18n.localize(CONFIG.KNIGHT.companions.medic["description"]);
    companions.wolf.configurations.tech.description = game.i18n.localize(CONFIG.KNIGHT.companions.tech["description"]);
    companions.wolf.configurations.fighter.description = game.i18n.localize(CONFIG.KNIGHT.companions.fighter["description"]);
    companions.wolf.configurations.recon.description = game.i18n.localize(CONFIG.KNIGHT.companions.recon["description"]);
    companions.crow.capacites = game.i18n.localize(CONFIG.KNIGHT.companions["vol"]);
  }

  _prepareEffetsSelectedOriflamme(context) {
    const bEffets = context.data.system.capacites.selected?.oriflamme?.effets || false;
    if(!bEffets) return;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const bLabels = CONFIG.KNIGHT.effets;

    bEffets.liste = listEffects(bRaw, bCustom, bLabels);
  }

  _prepareEffetsSelectedCompanions(context) {
    const companions = context.data.system.capacites.selected?.companions || false;
    const lEffets = companions?.lion?.armes || false;
    const wEffets = companions?.wolf?.armes || false;
    const bEffets = companions?.wolf?.configurations?.fighter?.bonus?.effets || false;

    const labels = CONFIG.KNIGHT.effets;

    if(!companions) return;

    if(lEffets != false) {
      const cLEffets = lEffets.contact.coups.effets;
      const cLRaw = cLEffets.raw;
      const cLCustom = cLEffets.custom;

      cLEffets.liste = listEffects(cLRaw, cLCustom, labels);
    }

    if(wEffets != false) {
      const cWEffets = wEffets.contact.coups.effets;
      const cWRaw = cWEffets.raw;
      const CWCustom = cWEffets.custom;

      cWEffets.liste = listEffects(cWRaw, CWCustom, labels);
    }

    if(bEffets != false) {
      const raw = bEffets.raw;
      const custom = bEffets.custom;

      bEffets.liste = listEffects(raw, custom, labels);
    }
  }

  _prepareDurationTranslation(context) {
    const listCapacite = ["changeling", "falcon", "goliath", "ghost", "nanoc", "oriflamme", "shrine", "type", "vision", "puppet", "windtalker", "companions", "totem", "record", "rewind"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.all[listCapacite[i]];

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

    }
  }

  _prepareRangeTranslation(context) {
    const listCapacite = ["changeling", "mechanic"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.all[listCapacite[i]];

      capacite.portee = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].portee);
    }
  }
}
