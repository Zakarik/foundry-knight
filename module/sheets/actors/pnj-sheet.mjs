import {
  listEffects,
  confirmationDialog,
  getDefaultImg,
  diceHover,
  options,
  commonPNJ,
  hideShowLimited,
  dragMacro,
  actualiseRoll,
  getAllEffects,
  getAllArmor,
  getArmor,
  getArmorLegend,
} from "../../helpers/common.mjs";

import toggler from '../../helpers/toggler.js';

/**
 * @extends {ActorSheet}
 */
export class PNJSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["pnj", "sheet", "actor"],
      template: "systems/knight/templates/actors/pnj-sheet.html",
      width: 920,
      height: 780,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    const options = context.data.system.options;
    const noFirstMenu = !options.resilience && !options.sante && !options.espoir ? true : false;
    const noSecondMenu = !options.armure && !options.energie && !options.bouclier && !options.champDeForce ? true : false;

    options.noFirstMenu = noFirstMenu;
    options.noSecondMenu = noSecondMenu;

    this._prepareCharacterItems(context);
    this._prepareAE(context);
    this._prepareTranslation(context.actor, context.data.system);
    this._prepareCapacitesParameters(context.actor, context.data.system);
    context.data.system.wear = 'armure';

    context.systemData = context.data.system;

    actualiseRoll(this.actor);

    return context;
  }

  /**
     * Return a light sheet if in "limited" state
     * @override
     */
   get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/knight/templates/actors/limited-sheet.html";
    }
    return this.options.template;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

    html.find('div.grenades img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      span.width($(html).width()/2).toggle("display");
      $(ev.currentTarget).toggleClass("clicked")
    });

    html.find('div.combat div.armesContact img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.main").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.wpn").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.wpn").position().left > width) {
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

    html.find('div.combat div.armesDistance img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.main").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.wpn").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.wpn").position().left > width) {
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

    html.find('div.bCapacite img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.mainBlock").width() / 2;
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

    hideShowLimited(this.actor, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    diceHover(html);
    options(html, this.actor);
    commonPNJ(html, this.actor);

    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-edit').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      item.sheet.render(true);
    });

    html.find('.item-delete').click(async ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      if(!await confirmationDialog()) return;

      if(item.type === 'armure') this.actor.update({['system.equipements.armure.id']:0});

      item.delete();
      header.slideUp(200, () => this.render(false));
    });

    html.find('button.setbtn').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const value = this.actor.system?.[type] ?? false;
      const result = value ? false : true;

      this.actor.update({[`system.${type}`]:result})
    });

    html.find('div.combat div.armesContact select.wpnMainChange').change(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const value = target.val();

      this.actor.items.get(id).update({['system.options2mains.actuel']:value});
    });

    html.find('div.combat div.armesDistance select.wpnMunitionChange').change(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const niveau = target.data("niveau");
      const value = target.val();
      const item = this.actor.items.get(id);

      if(item.type === 'module') {
        item.update({[`system.niveau.details.n${niveau}.arme.optionsmunitions.actuel`]:value});
      } else {
        item.update({['system.optionsmunitions.actuel']:value});
      }
    });

    html.find('div.combat button.addbasechair').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const value = target?.data("value") || false;
      let result = true;

      if(value) result = false;

      this.actor.items.get(id).update({['system.degats.addchair']:result});
    });

    html.find('.armure .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const special = target.data("special");
      const capacite = target.data("capacite");
      const variant = target.data("variant");
      const armure = await getArmor(this.actor);

      if(type === 'capacites') armure.system.activateCapacity({
        capacite,
        special,
        variant})
    });

    html.find('.armure .aChoisir').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const special = $(ev.currentTarget).data("special");
      const value = $(ev.currentTarget).data("value");

      const armure = this.actor.items.find(itm => itm.type === 'armure');
      const armureLegende = this.actor.items.find(itm => itm.type === 'armurelegende');

      let result = true;
      if(value === true) { result = false; }

      let update = {
        system:{
          equipements:{
            armure:{
              [type]:{
                [capacite]:{
                  choix:{
                    [special]:result
                  }
                }
              }
            }
          }
        }
      };

      let itemUpdate;

      if(capacite === 'warlordLegende') {
        itemUpdate =  {
          system:{
            capacites:{
              selected:{
                ['warlord']:{}
              }
            }
          }
        };
      } else if(capacite === 'typeLegende') {
        itemUpdate = {
          system:{
            capacites:{
              selected:{
                ['type']:{}
              }
            }
          }
        };
      } else {
        itemUpdate = {
          system:{
            capacites:{
              selected:{
                [capacite]:{}
              }
            }
          }
        };
      }


      let calcul;

      switch(capacite) {
        case "illumination":
          const illumination = armure.system.capacites.selected[capacite];
          const illuminationSelectionne = illumination.selectionne || 0;
          calcul = illuminationSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected[capacite].selectionne = calcul;
          itemUpdate.system.capacites.selected[capacite][special] = {};
          itemUpdate.system.capacites.selected[capacite][special].selectionne = result;

          armure.update(itemUpdate);
          break;
        case "type":
          const type = armure.system.capacites.selected[capacite];
          const typeSelectionne = type.selectionne || 0;
          calcul = typeSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected[capacite].selectionne = calcul;
          itemUpdate.system.capacites.selected[capacite].type = {};
          itemUpdate.system.capacites.selected[capacite].type[special] = {};
          itemUpdate.system.capacites.selected[capacite].type[special].selectionne = result;

          armure.update(itemUpdate);
          break;
        case "typeLegende":
          const typeLegende = armureLegende.system.capacites.selected['type'];
          const typeLegendeSelectionne = typeLegende.selectionne || 0;
          calcul = typeLegendeSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected['type'].selectionne = calcul;
          itemUpdate.system.capacites.selected['type'].type = {};
          itemUpdate.system.capacites.selected['type'].type[special] = {};
          itemUpdate.system.capacites.selected['type'].type[special].selectionne = result;

          armureLegende.update(itemUpdate);
          break;
        case "warlord":
          const warlord = armure.system.capacites.selected[capacite];
          const warlordSelectionne = warlord.impulsions.selectionne || 0;
          calcul = warlordSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected[capacite].impulsions = {};
          itemUpdate.system.capacites.selected[capacite].impulsions.selectionne = calcul;

          itemUpdate.system.capacites.selected[capacite].impulsions[special] = {};
          itemUpdate.system.capacites.selected[capacite].impulsions[special].choisi = result;

          armure.update(itemUpdate);
          break;
        case "warlordLegende":
          const warlordLegende = armureLegende.system.capacites.selected['warlord'];
          const warlordLegendeSelectionne = warlordLegende.impulsions.selectionne || 0;
          calcul = warlordLegendeSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected['warlord'] = {};
          itemUpdate.system.capacites.selected['warlord'].impulsions = {};
          itemUpdate.system.capacites.selected['warlord'].impulsions.selectionne = calcul;

          itemUpdate.system.capacites.selected['warlord'].impulsions[special] = {};
          itemUpdate.system.capacites.selected['warlord'].impulsions[special].choisi = result;

          armureLegende.update(itemUpdate);
          break;
        case "companions":
            const companions = armureLegende.system.capacites.selected[capacite];
            const nbreChoix = companions.nbreChoix;
            const isLionSelected = companions.lion.choisi;
            const isWolfSelected = companions.wolf.choisi;
            const isCrowSelected = companions.crow.choisi;
            let choixActuel = 0;

            if(isLionSelected || (special === 'lion' && result === true)) choixActuel += 1;
            if(isWolfSelected || (special === 'wolf' && result === true)) choixActuel += 1;
            if(isCrowSelected || (special === 'crow' && result === true)) choixActuel += 1;

            if(nbreChoix === choixActuel) itemUpdate.system.capacites.selected[capacite].choixFaits = true;

            itemUpdate.system.capacites.selected[capacite][special] = {};
            itemUpdate.system.capacites.selected[capacite][special].choisi = result;

            armureLegende.update(itemUpdate);
          break;
      }
    });

    html.find('.capacites div.armure .prolonger').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const special = $(ev.currentTarget).data("special");
      const variant = $(ev.currentTarget).data("variant");
      const armor = type === 'legende' ? await getArmorLegend(this.actor) : await getArmor(this.actor);

      await armor.system.prolongateCapacity({capacite, special, variant});
    });

    html.find('.capacites div.armure input.update').change(async ev => {
      const capacite = $(ev.currentTarget).data("capacite");
      const newV = $(ev.currentTarget).val();
      const oldV = $(ev.currentTarget).data("old");
      const cout = $(ev.currentTarget).data("cout");
      const flux = $(ev.currentTarget).data("flux") || false;

      const effect = [];

      switch(capacite) {
        case "goliath":
          if(newV > oldV) { await this._depensePE(cout*(newV-oldV)); }
          break;
        case "puppet":
        case "totem":
        case "warlord":
          if(newV > oldV) { await this._depensePE(cout*(newV-oldV)); }
          break;
      }
    });

    html.find('.armure .configurationWolf').click(async ev => {
      const target = $(ev.currentTarget);
      const configuration = target.data("configuration");
      const armure = this.actor.items.find(itm => itm.type === 'armure');
      const armorCapacites = armure.system.capacites.selected.companions;
      const detailsConfigurations = armorCapacites.wolf.configurations;
      const idWolf = armorCapacites.wolf.id;

      const actor1Wolf = game.actors.get(idWolf.id1);
      const actor2Wolf = game.actors.get(idWolf.id2);
      const actor3Wolf = game.actors.get(idWolf.id3);

      const wolf1Energie = +actor1Wolf.system.energie.value;
      const wolf2Energie = +actor2Wolf.system.energie.value;
      const wolf3Energie = +actor3Wolf.system.energie.value;
      const depenseEnergie = +detailsConfigurations[configuration].energie;

      if(wolf1Energie-depenseEnergie >= 0) {
        actor1Wolf.update({[`system`]:{
          'energie':{
            'value':wolf1Energie-depenseEnergie
          },
          'configurationActive':configuration
        }});
      }

      if(wolf2Energie-depenseEnergie >= 0) {
        actor2Wolf.update({[`system`]:{
          'energie':{
            'value':wolf2Energie-depenseEnergie
          },
          'configurationActive':configuration
        }});
      }

      if(wolf3Energie-depenseEnergie >= 0) {
        actor3Wolf.update({[`system`]:{
          'energie':{
            'value':wolf3Energie-depenseEnergie
          },
          'configurationActive':configuration
        }});
      }
    });

    html.find('.capacites div.wolf .wolfFighter').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data('label');
      const barrage = target?.data('barrage') || false;
      const actor = this.actor;
      const data = actor.system.wolf.fighter;

      if(barrage) {
        const roll = new game.knight.RollKnight(actor, {
          name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}`,
        }, false);
        const weapon = roll.prepareWpnDistance({
          name:label,
          system:{
            degats:{dice:0, fixe:0},
            effets:data.bonus.effets,
          }
        });
        const options = weapon.options;

        for(let o of options) {
          if(o.classes.includes('barrage')) o.active = true;
        }

        roll.setWeapon(weapon);
        await roll.doRoll();
      } else {
        const roll = new game.knight.RollKnight(actor, {
          name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
        }, false);
        const weapon = roll.prepareWpnContact({
          name:label,
          system:{
            degats:{dice:data.degats, fixe:0},
            violence:{dice:data.violence, fixe:0},
            effets:{raw:[], custom:[]},
          }
        });
        const addFlags = {
          actor,
          attaque:[],
          dataMod:{degats:{dice:0, fixe:0}, violence:{dice:0, fixe:0}},
          dataStyle:{},
          flavor:label,
          maximize:{degats:false, violence:false},
          style:'standard',
          surprise:false,
          targets:[],
          total:0,
          weapon
        }

        let dataRoll = {
          total:0,
          targets:[],
          attaque:[],
          flags:addFlags
        };

        roll.setWeapon(weapon);
        await roll.doRollDamage(dataRoll, addFlags);

        roll.setName(`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,)
        await roll.doRollViolence(dataRoll, addFlags);
      }
    });

    html.find('.capacites div.bCapacite .activation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const tenebricide = $(ev.currentTarget)?.data("tenebricide") || false;
      const obliteration = $(ev.currentTarget)?.data("obliteration") || false;

      if(type === 'degats') this.actor.system.doCapacityDgt(capacite, {tenebricide, obliteration});
    });

    html.find('.capacites div.modules .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const module = target.data("module");
      const value = target.data("value") ? false : true;
      const subtype = target.data("subtype");
      const index = target.data("index");

      if(type === 'module') {
        this.actor.items.get(module).system.activate(value, subtype)
      }

      if(type === 'modulePnj') {
        this.actor.items.get(module).system.activateNPC(value, subtype, index);
      }
    });

    html.find('.capacites div.modules .supplementaire').click(async ev => {
      const cout = eval($(ev.currentTarget).data("cout"));

      this._depensePE(cout, true);
    });

    html.find('div.nods img.dice').click(async ev => {
      const target = $(ev.currentTarget);
      const nods = target.data("nods");

      this.actor.system.useNods(nods, true);
    });

    html.find('div.nods img.diceTarget').click(async ev => {
      const target = $(ev.currentTarget);
      const nods = target.data("nods");

      this.actor.system.useNods(nods);
    });

    html.find('img.rollSpecifique').click(async ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const dices = target.data("roll");

      const roll = new game.knight.RollKnight(this.actor, {
        name:name,
        dices:dices,
      }, true);

      await roll.doRoll();
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;
      const id = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(id, {
        label:label,
        base:aspect,
        succesbonus:reussites,
      });

      dialog.open();
    });

    html.find('.rollRecuperationArt').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");

      const rEspoir = new game.knight.RollKnight(this.actor, {
        name:game.i18n.localize("KNIGHT.ART.RecuperationEspoir"),
        dices:`${value}`,
      }, false);

      await rEspoir.doRoll();
    });

    html.find('.art-say').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const name = game.i18n.localize(`KNIGHT.ART.PRATIQUE.${type.charAt(0).toUpperCase()+type.substr(1)}`);
      const data = this.getData().actor.art.system.pratique[type];

      const exec = new game.knight.RollKnight(this.actor,
      {
      name:name,
      }).sendMessage({
          text:data,
          classes:'normal',
      });
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const isDistance = target.data("isdistance");
      const parent = target.parents('div.wpn');
      const other = parent.data("other");
      const what = parent.data("what");
      let id = target.data("id");

      this.actor.system.useWpn(isDistance, {
        id,
        type:id,
        name:other,
        num:what
      });
    });

    html.find('.setResilience').click(async ev => {
      const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
        what:`${game.i18n.localize("KNIGHT.RESILIENCE.TYPES.Label")} ?`,
        list:[{
          key:'select',
          class:'whatSelect',
          liste:{
            colosseRecrue:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Recrue"),
            colosseInitie:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Initie"),
            colosseHeros:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Heros"),
            patronRecrue:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Recrue"),
            patronInitie:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Initie"),
            patronHeros:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Heros"),
          }
        }]
      });
      const askDialogOptions = {classes: ["dialog", "knight", "askdialog"]};

      await new Dialog({
        title: game.i18n.localize('KNIGHT.RESILIENCE.CalculResilience'),
        content: askContent,
        buttons: {
          button1: {
            label: game.i18n.localize('KNIGHT.RESILIENCE.Calcul'),
            callback: async (data) => {
              const getData = this.getData().data.system;
              const dataSante = +getData.sante.max;
              const dataArmure = +getData.armure.max;
              const hasSante = getData.options.sante;
              const hasArmure = getData.options.armure;

              const selected = data.find('.whatSelect').val();

              const update = {
                system:{
                  resilience:{
                    max:0,
                    value:0
                  }
                }
              };

              let calcul = 0;

              switch(selected) {
                case 'colosseRecrue':
                  if(hasSante) calcul = Math.floor(dataSante/10);
                  else if(hasArmure) calcul = Math.floor(dataArmure/10);
                  break

                case 'colosseInitie':
                  if(hasSante) calcul = Math.floor(dataSante/10)*2;
                  else if(hasArmure) calcul = Math.floor(dataArmure/10)*2;
                  break

                case 'colosseHeros':
                  if(hasSante) calcul = Math.floor(dataSante/10)*3;
                  else if(hasArmure) calcul = Math.floor(dataArmure/10)*3;
                  break

                case 'patronRecrue':
                  if(hasSante) calcul = Math.floor(dataSante/30);
                  else if(hasArmure) calcul = Math.floor(dataArmure/30);
                  break

                case 'patronInitie':
                  if(hasSante) calcul = Math.floor(dataSante/20);
                  else if(hasArmure) calcul = Math.floor(dataArmure/20);
                  break

                case 'patronHeros':
                  if(hasSante) calcul = Math.floor(dataSante/10);
                  else if(hasArmure) calcul = Math.floor(dataArmure/10);
                  break
              }

              update.system.resilience.max = calcul;
              update.system.resilience.value = calcul;

              this.actor.update(update);

            },
            icon: `<i class="fas fa-check"></i>`
          }
        }
      }, askDialogOptions).render(true);
    });

    html.find('div.options button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const option = target.data("option");
      const result = value === true ? false : true;

      this.actor.update({[`system.options.${option}`]:result});
    });

    html.find('.armure .supplementaire').click(async ev => {
      const cout = eval($(ev.currentTarget).data("cout"));

      this._depensePE(cout, true);
    });

    html.find('.capacites div.wolf .activationConfiguration').click(ev => {
      const configuration = eval($(ev.currentTarget).data("configuration"));
      const data = this.getData().data.system;
      const configurationData = data.wolf[configuration]

      this.actor.update({[`system`]:{
        'configurationActive':configuration
      }});

      this._depensePE(configurationData.energie);
    });

    html.find('div.armure div.wolf img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.mainData").width() / 2;
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

    html.find('div.capacites div.modules img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.mainBlock").width() / 2;
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

    html.find('.activatePhase2').click(ev => {
      this.actor.system.togglePhase2();
    });

    html.find('.desactivatePhase2').click(ev => {
      this.actor.system.togglePhase2();
    });

    html.find('i.moduleArrowUp').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const niveau = Number(target.data("niveau"))+1;
      const item = this.actor.items.get(key);

      const data = {
        "niveau":{
          "value":niveau
        }
      }

      item.update({[`system`]:data});
    });

    html.find('i.moduleArrowDown').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const niveau = Number(target.data("niveau"))-1;
      const item = this.actor.items.get(key);

      const data = {
        "niveau":{
          "value":niveau
        }
      }

      item.update({[`system`]:data});
    });

    html.find('button.recover').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const max = target.data("max");
      const list = target?.data("list")?.split("/") || '';

      switch(type) {
        case 'espoir':
        case 'sante':
        case 'armure':
        case 'energie':
        case 'grenades':
          html.find(`div.${type} input.value`).val(max);
          break;

        case 'nods':
          let update = {};

          for (let i of list) {
            const split = i.split('-');
            const name = split[0];
            const max = split[1];

            html.find(`div.${type} input.${name}Value`).val(max);
          }
          break;

        case 'chargeur':
          const items = this.actor.items.filter(itm => itm.type === 'arme' || itm.type === 'module' || itm.type === 'armure');

          items.forEach(itm => {
            itm.system.resetMunition();
          })

          const exec = new game.knight.RollKnight(this.actor,
          {
          name:this.actor.name,
          }).sendMessage({
              text:game.i18n.localize('KNIGHT.JETS.RemplirChargeur'),
              classes:'important',
          });
          break;
      }
    });

    html.find('a.add').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");

      let update = {};

      switch(type) {
        case 'grenade':
          const getGrenades = this.actor.system.combat.grenades.liste;
          let maxGrenadeNumber = 5; // commence à 5 car on veut au moins 6

          Object.keys(getGrenades).forEach(key => {
            const match = key.match(/^grenade_(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxGrenadeNumber) {
                maxGrenadeNumber = num;
              }
            }
          });

          update[`system.combat.grenades.liste`] = {
            [`grenade_${maxGrenadeNumber + 1}`]: {
              "custom":true,
              "label":"",
              "degats": {
                "dice": getGrenades.antiblindage.degats.dice
              },
              "violence": {
                "dice": getGrenades.antiblindage.violence.dice
              },
              "effets":{
                "liste":[],
                "raw":[],
                "custom":[]
              }
            }
          }
          break;
      }

      this.actor.update(update);
    });

    html.find('a.delete').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const id = target.data("id");

      let update = {};

      switch(type) {
        case 'grenade':
          update[`system.combat.grenades.liste.-=${id}`] = null;
          break;
      }

      this.actor.update(update);
    });

    html.find('div.grenades a.unlocked').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const grenades = this.actor.system.combat.grenades.liste[id];
      const unlocked = grenades?.unlocked ?? false;

      let update = {};
      update[`system.combat.grenades.liste.${id}.unlocked`] = !unlocked;

      this.actor.update(update);
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

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor._id, item:null, isToken:this?.document?.isToken || false, token:this?.token || null, raw:path.raw, custom:path.custom, activable:path.activable, toUpdate:stringPath, aspects:aspects, maxEffets:maxEffets, title:`${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
    });

    html.find('a.btnChargeurPlus').click(async ev => {
      const tgt = $(ev.currentTarget);
      const header = tgt.parents(".item");
      const index = tgt.parents(".btnChargeur").data('index');
      const type = tgt.parents(".btnChargeur").data('type');
      const munition = tgt.parents(".btnChargeur").data('munition');
      const pnj = tgt.parents(".btnChargeur").data('pnj');
      const wpn = tgt.parents(".btnChargeur").data('wpn');
      const item = this.actor.items.get(header.data("item-id"));

      item.system.addMunition(index, type, munition, pnj, wpn);
    });

    html.find('a.btnChargeurMoins').click(async ev => {
      const tgt = $(ev.currentTarget);
      const header = tgt.parents(".item");
      const index = tgt.parents(".btnChargeur").data('index');
      const type = tgt.parents(".btnChargeur").data('type');
      const munition = tgt.parents(".btnChargeur").data('munition');
      const pnj = tgt.parents(".btnChargeur").data('pnj');
      const wpn = tgt.parents(".btnChargeur").data('wpn');
      const item = this.actor.items.get(header.data("item-id"));

      item.system.removeMunition(index, type, munition, pnj, wpn);
    });

    html.find('i.effects.activable').click(async ev => {
      const tgt = $(ev.currentTarget);
      const header = tgt.parents(".item").length > 0 ? tgt.parents(".item") : tgt.parents(".headerData");
      const raw = header.data('raw');
      const type = raw ? raw : tgt.data('type');
      const munition = tgt.data('munition');
      const pnj = tgt.data('pnj');
      const wpn = tgt.data('wpn');
      const item = this.actor.items.get(header.data("item-id"));
      const id = tgt.data('id');

      item.system.toggleEffect(id, type, munition, pnj, wpn);
    });
  }

  /* -------------------------------------------- */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      img:getDefaultImg(type),
      system: data
    };

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    if (type === 'arme') {
      itemData.system = {
        type:header.dataset.subtype,
        tourelle:{
          has:header.dataset.tourelle
        }
      };
      delete itemData.system["subtype"];
    }

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropItemCreate(itemData) {
    const actorData = this.getData().data.system;

    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;
    const options = actorData.options;

    const typesValides = [
      'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma',
      'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (typesValides.includes(itemBaseType)) return;
    if (itemBaseType === 'module' && !options.modules) return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
    const itemId = itemCreate[0]._id;
    const oldArtId = actorData?.art || 0;

    if (itemBaseType === 'art') {
      const update = {
        system:{
          art:itemId
        }
      };

      if(oldArtId !== 0) {
        const oldArt = this.actor.items?.get(oldArtId) || false;
        if(oldArt !== false) oldArt.delete();
      }

      this.actor.update(update);
    }

    if (itemBaseType === 'armure') {
      const actor = this.actor;
      const update = {};

      const armors = await getAllArmor(actor);

      for(let a of armors) {
        if(a.id !== itemId) await a.delete();
      }

      update['system.equipements.armure'] = {
        id:itemId, hasArmor:true,
        capacites:{
          ascension:{
            id:0,
            energie:0
          },
          borealis:{
            allie:0
          },
          changeling:{
            fauxetres:0
          },
          companions:{
            type:"",
            energie:0,
            energieDisponible:[]
          },
          forward:1,
          goliath:{
            metre:0
          },
          morph:{
            nbre:0
          },
          puppet:{
            cible:0
          },
          rage:{
            niveau:{}
          },
          totem:{
            nombre:0
          },
          warlord:{
            energie:{
              nbre:1
            },
            force:{
              nbre:1
            },
            esquive:{
              nbre:1
            },
            guerre:{
              nbre:1
            }
          },
          vision:{
            energie:0
          }
        }
      };
      this.actor.update(update);
    }

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const system = sheetData.data.system;

    const armesContact = [];
    const armesDistance = [];
    const armesTourelles = [];
    const langue = [];
    const modules = [];
    const capacites = [];
    const moduleBonusDgts = {
      "contact":[],
      "distance":[]
    };
    const moduleBonusDgtsVariable = {
      "contact":[],
      "distance":[]
    };
    const moduleBonusViolence = {
      "contact":[],
      "distance":[]
    };
    const moduleBonusViolenceVariable = {
      "contact":[],
      "distance":[]
    };
    const aspects = {
      "chair":system.aspects.chair.value,
      "bete":system.aspects.bete.value,
      "machine":system.aspects.machine.value,
      "dame":system.aspects.dame.value,
      "masque":system.aspects.masque.value,
    };
    const aspectLieSupp = [];
    const labels = Object.assign({}, getAllEffects());

    let art = {};
    let armureData = {};
    let longbow = {};

    for (let i of sheetData.items) {
      const data = i.system;

      // ARMURE.
      if (i.type === 'armure') {
        armureData = i;
        const capacites = data.capacites.selected;

        /*const capaLongbow = data.capacites.selected?.longbow ?? false;

        if(capaLongbow !== false) {
          longbow = capaLongbow;
          longbow['has'] = true;
          longbow.energie = 0;

          longbow.degats.cout = 0;
          longbow.degats.dice = capaLongbow.degats.min;

          longbow.violence.cout = 0;
          longbow.violence.dice = capaLongbow.violence.min;

          const rangeListe = ['contact', 'courte', 'moyenne', 'longue', 'lointaine'];
          let rangeToNumber = {};
          let peRange = longbow.portee.energie;
          let minRange = longbow.portee.min;
          let maxRange = longbow.portee.max;
          let isInRange = false;
          let multiplicateur = 0;

          for(let n = 0; n < rangeListe.length;n++) {
            if(rangeListe[n] === minRange) {
              isInRange = true;
              rangeToNumber[rangeListe[n]] = multiplicateur*peRange;
              multiplicateur += 1;
            } else if(rangeListe[n] === maxRange) {
              isInRange = false;
              rangeToNumber[rangeListe[n]] = multiplicateur*peRange;
            } else if(isInRange) {
              rangeToNumber[rangeListe[n]] = multiplicateur*peRange;
              multiplicateur += 1;
            }
          }

          longbow.portee.cout = 0;
          longbow.portee.value = capaLongbow.portee.min;
          longbow.portee.rangeToNumber = rangeToNumber;

          longbow.effets.raw = [];
          longbow.effets.custom = [];
          longbow.effets.liste = [];
          longbow.effets.liste1.cout = 0;
          longbow.effets.liste1.selected = 0;
          longbow.effets.liste2.cout = 0;
          longbow.effets.liste2.selected = 0;
          longbow.effets.liste3.cout = 0;
          longbow.effets.liste3.selected = 0;
        }*/

        for (let c in capacites) {
          const dCapacite = capacites[c];

          switch(c) {
            case 'longbow':
              longbow = dCapacite;
              longbow.has = true;
              break;

            case 'borealis':
              armesDistance.push({
                _id:i._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                type:'armure',
                raw:'borealis',
                system:{
                  subCapaciteName:'borealis',
                  capacite:true,
                  noRack:true,
                  type:'distance',
                  portee:dCapacite.offensif.portee,
                  degats:dCapacite.offensif.degats,
                  violence:dCapacite.offensif.violence,
                  effets:{
                    raw:dCapacite.offensif.effets.raw,
                    custom:dCapacite.offensif.effets.custom,
                    liste:dCapacite.offensif.effets.liste,
                    chargeur:dCapacite.offensif.effets?.chargeur ?? null
                  }
                }
              });

              armesContact.push({
                _id:i._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                type:'armure',
                raw:'borealis',
                system:{
                  subCapaciteName:'borealis',
                  capacite:true,
                  noRack:true,
                  type:'contact',
                  portee:dCapacite.offensif.portee,
                  degats:dCapacite.offensif.degats,
                  violence:dCapacite.offensif.violence,
                  effets:{
                    raw:dCapacite.offensif.effets.raw,
                    custom:dCapacite.offensif.effets.custom,
                    liste:dCapacite.offensif.effets.liste,
                    chargeur:dCapacite.offensif.effets?.chargeur ?? null
                  }
                }
              });
              break;

            case 'cea':
              armesDistance.push({
                _id:i._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                type:'armure',
                raw:'cea_vague',
                system:{
                  subCapaciteName:'vague',
                  capacite:true,
                  noRack:true,
                  type:'distance',
                  portee:dCapacite.vague.portee,
                  degats:dCapacite.vague.degats,
                  violence:dCapacite.vague.violence,
                  effets:{
                    raw:dCapacite.vague.effets.raw,
                    custom:dCapacite.vague.effets.custom,
                    liste:dCapacite.vague.effets.liste,
                    chargeur:dCapacite.vague.effets?.chargeur ?? null
                  }
                }
              },
              {
                _id:i._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                type:'armure',
                raw:'cea_salve',
                system:{
                  subCapaciteName:'salve',
                  capacite:true,
                  noRack:true,
                  type:'distance',
                  portee:dCapacite.salve.portee,
                  degats:dCapacite.salve.degats,
                  violence:dCapacite.salve.violence,
                  effets:{
                    raw:dCapacite.salve.effets.raw,
                    custom:dCapacite.salve.effets.custom,
                    liste:dCapacite.salve.effets.liste,
                    chargeur:dCapacite.salve.effets?.chargeur ?? null
                  }
                }
              },
              {
                _id:i._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                type:'armure',
                raw:'cea_rayon',
                system:{
                  subCapaciteName:'rayon',
                  capacite:true,
                  noRack:true,
                  type:'distance',
                  portee:dCapacite.rayon.portee,
                  degats:dCapacite.rayon.degats,
                  violence:dCapacite.rayon.violence,
                  effets:{
                    raw:dCapacite.rayon.effets.raw,
                    custom:dCapacite.rayon.effets.custom,
                    liste:dCapacite.rayon.effets.liste,
                    chargeur:dCapacite.rayon.effets?.chargeur ?? null
                  }
                }
              });

              armesContact.push({
                _id:i._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                type:'armure',
                raw:'cea_vague',
                system:{
                  subCapaciteName:'vague',
                  capacite:true,
                  noRack:true,
                  type:'contact',
                  portee:dCapacite.vague.portee,
                  degats:dCapacite.vague.degats,
                  violence:dCapacite.vague.violence,
                  effets:{
                    raw:dCapacite.vague.effets.raw,
                    custom:dCapacite.vague.effets.custom,
                    liste:dCapacite.vague.effets.liste,
                    chargeur:dCapacite.vague.effets?.chargeur ?? null
                  }
                }
              },
              {
                _id:i._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                type:'armure',
                raw:'cea_salve',
                system:{
                  subCapaciteName:'salve',
                  capacite:true,
                  noRack:true,
                  type:'contact',
                  portee:dCapacite.salve.portee,
                  degats:dCapacite.salve.degats,
                  violence:dCapacite.salve.violence,
                  effets:{
                    raw:dCapacite.salve.effets.raw,
                    custom:dCapacite.salve.effets.custom,
                    liste:dCapacite.salve.effets.liste,
                    chargeur:dCapacite.salve.effets?.chargeur ?? null
                  }
                }
              },
              {
                _id:i._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                type:'armure',
                raw:'cea_rayon',
                system:{
                  subCapaciteName:'rayon',
                  capacite:true,
                  noRack:true,
                  type:'contact',
                  portee:dCapacite.rayon.portee,
                  degats:dCapacite.rayon.degats,
                  violence:dCapacite.rayon.violence,
                  effets:{
                    raw:dCapacite.rayon.effets.raw,
                    custom:dCapacite.rayon.effets.custom,
                    liste:dCapacite.rayon.effets.liste,
                    chargeur:dCapacite.rayon.effets?.chargeur ?? null
                  }
                }
              });
              break;

            case 'morph':
              if(dCapacite?.active?.polymorphieLame ?? false) {
                armesContact.push({
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')}`,
                  type:'armure',
                  raw:'morph_lame',
                  system:{
                    subCapaciteName:'lame',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.polymorphie.lame.portee,
                    degats:dCapacite.polymorphie.lame.degats,
                    violence:dCapacite.polymorphie.lame.violence,
                    effets:{
                      raw:dCapacite.polymorphie.lame.effets.raw,
                      custom:dCapacite.polymorphie.lame.effets.custom,
                      liste:dCapacite.polymorphie.lame.effets.liste,
                      chargeur:dCapacite.polymorphie.lame.effets?.chargeur ?? null
                    }
                  }
                });
              }

              if(dCapacite?.active?.polymorphieGriffe ?? false) {
                armesContact.push({
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')}`,
                  type:'armure',
                  raw:'morph_griffe',
                  system:{
                    subCapaciteName:'griffe',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.polymorphie.griffe.portee,
                    degats:dCapacite.polymorphie.griffe.degats,
                    violence:dCapacite.polymorphie.griffe.violence,
                    effets:{
                      raw:dCapacite.polymorphie.griffe.effets.raw,
                      custom:dCapacite.polymorphie.griffe.effets.custom,
                      liste:dCapacite.polymorphie.griffe.effets.liste,
                      chargeur:dCapacite.polymorphie.griffe.effets?.chargeur ?? null
                    }
                  }
                });
              }

              if(dCapacite?.active?.polymorphieCanon ?? false) {
                armesDistance.push({
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')}`,
                  type:'armure',
                  raw:'morph_canon',
                  system:{
                    subCapaciteName:'canon',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.polymorphie.canon.portee,
                    degats:dCapacite.polymorphie.canon.degats,
                    violence:dCapacite.polymorphie.canon.violence,
                    effets:{
                      raw:dCapacite.polymorphie.canon.effets.raw,
                      custom:dCapacite.polymorphie.canon.effets.custom,
                      liste:dCapacite.polymorphie.canon.effets.liste,
                      chargeur:dCapacite.polymorphie.canon.effets?.chargeur ?? null
                    }
                  }
                });
              }
              break;
          }
        }
      }

      // ARME
      if (i.type === 'arme') {
        const type = data.type;
        const tourelle = data.tourelle;

        data.noRack = true;
        data.pnj = true;

        const optionsMunitions = data?.optionsmunitions?.has || false;
        const options2mains = data?.options2mains?.has || false;

        const main = data.options2mains.actuel;
        const munition = data.optionsmunitions.actuel;

        if(type === 'contact' && options2mains === true) {
          data.degats.dice = data?.options2mains?.[main]?.degats?.dice || 0;
          data.degats.fixe = data?.options2mains?.[main]?.degats?.fixe || 0;

          data.violence.dice = data?.options2mains?.[main]?.violence?.dice || 0;
          data.violence.fixe = data?.options2mains?.[main]?.violence?.fixe || 0;
        }

        if(type === 'distance' && optionsMunitions === true) {
          data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
          data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

          data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
          data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;
        }

        if(tourelle.has && type === 'distance') {
          armesTourelles.push(i);
        } else {
          if (type === 'contact') { armesContact.push(i); }
          else if (type === 'distance') { armesDistance.push(i); }
        }
      }

      // LANGUE
      if (i.type === 'langue') {
        langue.push(i);
      }

      // MODULES
      if (i.type === 'module') {
        const niveau = data.niveau.value;
        const itemDataNiveau = data.niveau.details[`n${niveau}`];
        const itemBonus = itemDataNiveau?.bonus || {has:false};
        const itemArme = itemDataNiveau?.arme || {has:false};
        const itemActive = data?.active?.base || false;
        const dataMunitions = itemArme?.optionsmunitions || {has:false};

        if(dataMunitions.has) {
          for (const [key, value] of Object.entries(dataMunitions.liste)) {
            itemArme.optionsmunitions.liste[key].liste = listEffects(value, labels, value?.chargeur);
          }
        }

        if(itemDataNiveau.permanent || itemActive) {
          if(itemBonus.has) {
            const iBDgts = itemBonus.degats;
            const iBDgtsVariable = iBDgts.variable;
            const iBViolence = itemBonus.violence;
            const iBViolenceVariable = iBViolence.variable;

            if(iBDgts.has) {
              if(iBDgtsVariable.has) {
                moduleBonusDgtsVariable[iBDgts.type].push({
                  label:i.name,
                  description:data.description,
                  selected:{
                    dice:0,
                    fixe:0
                  },
                  min:{
                    dice:iBDgtsVariable.min.dice,
                    fixe:iBDgtsVariable.min.fixe
                  },
                  max:{
                    dice:iBDgtsVariable.max.dice,
                    fixe:iBDgtsVariable.max.fixe
                  }
                });
              } else {
                moduleBonusDgts[iBDgts.type].push({
                  label:i.name,
                  description:data.description,
                  dice:iBDgts.dice,
                  fixe:iBDgts.fixe
                });
              }
            }
            if(iBViolence.has) {
              if(iBViolenceVariable.has) {
                moduleBonusViolenceVariable[iBViolence.type].push({
                  label:i.name,
                  description:i.system.description,
                  selected:{
                    dice:0,
                    fixe:0
                  },
                  min:{
                    dice:iBViolenceVariable.min.dice,
                    fixe:iBViolenceVariable.min.fixe
                  },
                  max:{
                    dice:iBViolenceVariable.max.dice,
                    fixe:iBViolenceVariable.max.fixe
                  }
                });
              } else {
                moduleBonusViolence[iBViolence.type].push({
                  label:i.name,
                  description:i.system.description,
                  dice:iBViolence.dice,
                  fixe:iBViolence.fixe
                });
              }
            }
          }

          if(itemArme.has) {
            const moduleEffets = itemArme.effets;

            let degats = itemArme.degats;
            let violence = itemArme.violence;

            if(dataMunitions.has) {
              let actuel = dataMunitions.actuel;

              if(actuel === undefined) {
                dataMunitions.actuel = "0";
                actuel = "1";
              }

              degats = dataMunitions.liste[actuel].degats;
              violence = dataMunitions.liste[actuel].violence;
            }

            const moduleWpn = {
              _id:i._id,
              name:i.name,
              type:'module',
              system:{
                noRack:true,
                type:itemArme.type,
                portee:itemArme.portee,
                degats:degats,
                violence:violence,
                optionsmunitions:dataMunitions,
                effets:{
                  raw:moduleEffets.raw,
                  custom:moduleEffets.custom,
                  chargeur:moduleEffets?.chargeur,
                },
                niveau:niveau,
              }
            }

            if(itemArme.type === 'contact') { armesContact.push(moduleWpn); }

            if(itemArme.type === 'distance') {
              armesDistance.push(moduleWpn);
            }
          }
        }

        i.system.bonus = itemBonus;
        i.system.arme = itemArme;
        i.system.permanent = itemDataNiveau.permanent;
        i.system.duree = itemDataNiveau.duree;
        i.system.energie = itemDataNiveau.energie;
        i.system.rarete = itemDataNiveau.rarete;
        i.system.activation = itemDataNiveau.activation;
        i.system.portee = itemDataNiveau.portee;
        i.system.labels = itemDataNiveau.labels;
        i.system.pnj = itemDataNiveau.pnj;
        i.system.jetsimple = itemDataNiveau.jetsimple;
        i.system.effets = itemDataNiveau.effets;

        modules.push(i);
      }

      // CAPACITES
      if (i.type === 'capacite') {
        capacites.push(i);

        const isPhase2 = data.isPhase2;
        const bonus = data.bonus;
        const attaque = data.attaque;

        const aLieSupp = bonus.aspectsLieSupplementaire;

        if(!isPhase2) {
          if(aLieSupp.has) aspectLieSupp.push(aLieSupp.value);

          if(attaque.has) {
            const capaciteWpn = {
              _id:i._id,
              name:i.name,
              type:'capacite',
              system:{
                noRack:true,
                type:attaque.type,
                portee:attaque.portee,
                degats:attaque.degats,
                violence:{
                  dice:0,
                  fixe:0,
                },
                effets:{
                  raw:attaque.effets.raw,
                  custom:attaque.effets.custom,
                }
              }
            }

            if(attaque.type === 'contact') {
              armesContact.push(capaciteWpn);
            } else if(attaque.type === 'distance') {
              armesDistance.push(capaciteWpn);
            }
          }
        } else if(isPhase2 && system.phase2Activate) {
          if(aLieSupp.has) aspectLieSupp.push(aLieSupp.value);

          if(attaque.has) {
            const capaciteWpn = {
              _id:i._id,
              name:i.name,
              type:'capacite',
              system:{
                noRack:true,
                type:attaque.type,
                portee:attaque.portee,
                degats:attaque.degats,
                effets:{
                  raw:attaque.effets.raw,
                  custom:attaque.effets.custom,
                }
              }
            }

            if(attaque.type === 'contact') {
              armesContact.push(capaciteWpn);
            } else if(attaque.type === 'distance') {
              armesDistance.push(capaciteWpn);
            }
          }
        }
      }

      // ART
      if (i.type === 'art') {
        art = i;
      }
    }

    for(let i = 0;i < armesContact.length;i++) {
      armesContact[i].system.degats.module = {};
      armesContact[i].system.degats.module.fixe = moduleBonusDgts.contact;
      armesContact[i].system.degats.module.variable = moduleBonusDgtsVariable.contact;

      armesContact[i].system.violence.module = {};
      armesContact[i].system.violence.module.fixe = moduleBonusViolence.contact;
      armesContact[i].system.violence.module.variable = moduleBonusViolenceVariable.contact;
    }

    for(let i = 0;i < armesDistance.length;i++) {
      armesDistance[i].system.degats.module = {};
      armesDistance[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistance[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistance[i].system.violence.module = {};
      armesDistance[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistance[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    }

    actorData.armesContact = armesContact;
    actorData.armesDistance = armesDistance;
    actorData.armesTourelles = armesTourelles;
    actorData.langue = langue;
    actorData.capacites = capacites;
    actorData.modules = modules;
    actorData.art = art;
    actorData.armureData = armureData;
    actorData.longbow = longbow;
  }

  _prepareAE(context) {
    const actor = context.actor?.aspectexceptionnel || false;
    const listAspects = context.data.system.aspects;
    //const aspects = context.actor?.aspectexceptionnel?.[aspect] || false;

    if(!actor) context.actor.aspectexceptionnel = {};

    let result = {};

    for (let [key, aspect] of Object.entries(listAspects)){
      const aeMineur = +aspect.ae.mineur.value;
      const aeMajeur = +aspect.ae.majeur.value;
      const lMineur = `KNIGHT.ASPECTS.${key.toUpperCase()}.AE.Mineur`;
      const lMajeur = `KNIGHT.ASPECTS.${key.toUpperCase()}.AE.Majeur`;

      if(aeMineur > 0 || aeMajeur > 0) result[key] = {}

      if(aeMineur > 0) {
        result[key].mineur = game.i18n.localize(lMineur);
      }

      if(aeMajeur > 0) {
        result[key].mineur = game.i18n.localize(lMineur);
        result[key].majeur = game.i18n.localize(lMajeur);
      }
    }

    context.actor.aspectexceptionnel = result;
  }

  async _depensePE(label, depense, autosubstract=true, forceEspoir=false, flux=false, capacite=true) {
    const data = this.actor;
    const armor = data.items.find(itm => itm.type === 'armure');
    const dataArmor = armor?.system ?? {};
    const remplaceEnergie = dataArmor?.espoir?.remplaceEnergie || false;

    const type = remplaceEnergie === true || forceEspoir === true ? 'espoir' : 'energie';
    const hasFlux = false;
    const fluxActuel = 0;
    const actuel = remplaceEnergie === true || forceEspoir === true ? Number(data.system.espoir.value) : Number(data.system.energie.value);
    const substract = actuel-depense;

    if(flux != false && hasFlux) {
      if(fluxActuel < flux) {
        const msgEnergie = {
          flavor:`${label}`,
          main:{
            total:`${game.i18n.localize('KNIGHT.JETS.Notflux')}`
          }
        };

        const msgEnergieData = {
          user: game.user.id,
          speaker: {
            actor: data?.id || null,
            token: data?.token?.id || null,
            alias: data?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
          sound: CONFIG.sounds.dice
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

        await ChatMessage.create(msgFData, {
          rollMode:rMode
        });

        return false;
      }
    }

    if(substract < 0) {
      const lNot = remplaceEnergie || forceEspoir ? game.i18n.localize('KNIGHT.JETS.Notespoir') : game.i18n.localize('KNIGHT.JETS.Notenergie');

      const msgEnergie = {
        flavor:`${label}`,
        main:{
          total:`${lNot}`
        }
      };

      const msgEnergieData = {
        user: game.user.id,
        speaker: {
          actor: data?.id || null,
          token: data?.token?.id || null,
          alias: data?.name || null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
        sound: CONFIG.sounds.dice
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

      await ChatMessage.create(msgFData, {
        rollMode:rMode
      });

      return false;
    } else {
      if(autosubstract) {
        let update = {};

        if(type !== 'espoir') update[`system.${type}.value`] = substract;

        if(flux != false) {
          update[`system.flux.value`] = fluxActuel-flux;
        }

        if(type === 'espoir' && !data.system.espoir.perte.saufAgonie && capacite === true) {
          update[`system.espoir.value`] = substract;
        }

        this.actor.update(update);
      }

      return true;
    }
  }

  async _prepareCapacitesParameters(actor, system) {
    const remplaceEnergie = actor.items.find(itm => itm.type === 'armure')?.system?.espoir?.remplaceEnergie ?? false;
    const eTotale = !remplaceEnergie ? system.energie.max : system.espoir.max ?? 0;
    const eActuel = !remplaceEnergie ? system.energie.value : system.espoir.value ?? 0;
    const capacites = system.equipements.armure.capacites;
    const warlord = actor?.armureData?.system?.capacites?.selected?.warlord || false;
    const warlordLegende = actor?.armureLegendeData?.system?.capacites?.selected?.warlord || false;
    const illumination = actor?.armureData?.system?.capacites?.selected?.illumination || false;
    const companions = actor?.armureData?.system?.capacites?.selected?.companions || false;
    const type = actor?.armureData?.system?.capacites?.selected?.type || false;
    const typeLegende = actor?.armureLegendeData?.system?.capacites?.selected?.type || false;
    const vision = actor?.armureData?.system?.capacites?.selected?.vision || false;

    const update = {
      system:{
        equipements:{
          armure:{
            capacites:{
              ascension:{},
              companions:{},
              warlord:{
                modes:{},
                action:{},
                guerre:{},
                force:{},
                esquive:{}
              }
            }
          }
        }
      }
    };

    if(warlord != false) {
      const cWarlord = warlord.impulsions;
      const cWarlordMax = cWarlord.selection;
      const cWarlordActuel = cWarlord?.selectionne || 0;

      if(cWarlordMax === cWarlordActuel) { cWarlord.choisi = true; }
      else { cWarlord.choisi = false; }
    }

    if(warlordLegende != false) {
      const cWarlordLegende = warlordLegende.impulsions;
      const cWarlordLegendeMax = cWarlordLegende.selection;
      const cWarlordLegendeActuel = cWarlordLegende?.selectionne || 0;

      if(cWarlordLegendeMax === cWarlordLegendeActuel) { cWarlordLegende.choisi = true; }
      else { cWarlordLegende.choisi = false; }
    }

    if(illumination != false) {
      if(illumination.selectionne === illumination.nbreCapacitesSelected) { illumination.choixFaits = true; }
      else { illumination.choixFaits = false; }
    }

    if(type != false) {
      if(type.selectionne === type.nbreType) { type.choixFaits = true; }
      else { type.choixFaits = false; }
    }

    if(typeLegende != false) {
      if(typeLegende.selectionne === typeLegende.nbreType) { typeLegende.choixFaits = true; }
      else { typeLegende.choixFaits = false; }
    }

    if(companions != false) {
      const cCompanions = capacites.companions;
      const energieDisponible = [];

      for(let i = 1;i <= eTotale/10;i++) {
        energieDisponible.push(i*10);
      }

      cCompanions.energieDisponible = energieDisponible;

      if(cCompanions.energie > eActuel) {
        update.system.equipements.armure.capacites.companions.energie = 0;

        this.actor.update(update);
      }
    }

    if(vision != false) {
      const aPE = capacites.vision.energie;
      const cPE = vision.energie.min;

      if(aPE < cPE) {
        capacites.vision.energie = cPE;
      }
    }
  }

  _prepareTranslation(actor, system) {
    const { modules,
      armesContact, armesDistance,
      armesTourelles } = actor;
    const grenades = system.combat.grenades.liste;
    const { armureData, armureLegendeData } = actor;
    const capacites = armureData?.system?.capacites?.selected ?? {};
    const special = armureData?.system?.special?.selected ?? {};
    const legend = armureLegendeData?.capacites?.selected ?? {};
    const listToVerify = {...capacites, ...special};
    const labels = Object.assign({}, getAllEffects());
    const wpnModules = [
      {data:modules, key:'modules'},
      {data:armesContact, key:'armes'},
      {data:armesDistance, key:'armes'},
      {data:armesTourelles, key:'armes'},
      {data:grenades, key:'grenades'},
    ];

    const list = [
      { name: 'borealis', path: ['offensif'] },
      { name: 'changeling', path: ['desactivationexplosive'] },
      { name: 'companions', path: ['lion.contact.coups', 'wolf.contact.coups', 'wolf.configurations.fighter.bonus'] },
      { name: 'cea', path: ['salve', 'vague', 'rayon'] },
      { name: 'illumination', path: ['lantern'] },
      { name: 'longbow', path: ['effets.base', 'effets.liste1', 'effets.liste2', 'effets.liste3', 'distance'], simple:true },
      { name: 'morph', path: ['polymorphie.griffe', 'polymorphie.lame', 'polymorphie.canon'] },
      { name: 'oriflamme', path: [''] },
      { name: 'porteurlumiere', path: ['bonus'] },
    ];

    this._updateEffects(listToVerify, list, labels);
    this._updateEffects(legend, list, labels);

    for(let i = 0;i < wpnModules.length;i++) {
      const base = wpnModules[i];
      const data = base.data;

      if(!data) continue;

      const listData = {
        modules:[{path:['system.niveau.actuel.effets', 'system.niveau.actuel.arme.effets', 'system.niveau.actuel.arme.distance', 'system.niveau.actuel.arme.structurelles', 'system.niveau.actuel.arme.ornementales', 'system.niveau.actuel.jetsimple.effets'], simple:true}],
        armes:[{path:['system.effets', 'system.effets2mains', 'system.distance', 'system.structurelles', 'system.ornementales'], simple:true}],
        grenades:[{path:['effets'], simple:true}]
      }[base.key];

      this._updateEffects(data, listData, labels, true);

      for(let n = 0;n < data.length;n++) {
        const optMun = data[n]?.system?.optionsmunitions?.has || false;

        if((base.key === 'armes' && optMun)) {
          const dataMunitions = data[n].system.optionsmunitions;

          for (const [key, value] of Object.entries(dataMunitions.liste)) {
            value.liste = listEffects(value, labels, value?.chargeur);
          }
        }

        if(base.key === 'modules') {
          const dataPnj = data[n].system.niveau.actuel.pnj.liste;

          for(let pnj in dataPnj) {
            for(let wpnPnj in dataPnj[pnj].armes.liste) {
              const dataWpnPnj = dataPnj[pnj].armes.liste[wpnPnj];

              dataWpnPnj.effets.liste = listEffects(dataWpnPnj.effets, labels, dataWpnPnj.effets?.chargeur);
            }
          }
        }
      }

    }
  }

  _updateEffects(listToVerify, list, labels, items = false) {
    const process = (capacite, path, simple) => {
      const data = path.split('.').reduce((obj, key) => obj?.[key], capacite);
      if (!data) return;
      const effets = simple ? data : data.effets;
      effets.liste = listEffects(effets, labels, effets?.chargeur);
    };

    if (!items) {
      for (const { name, path, simple } of list) {
        const capacite = listToVerify?.[name];
        if (!capacite) continue;
        path.forEach(p => process(capacite, p, simple));
      }
    } else {
      if (!listToVerify) return;
      for (const [key, module] of Object.entries(listToVerify)) {
        for (const { path, simple } of list) {
          path.forEach(p => process(module, p, simple));
        }
      }
    }
  }

  /** @inheritdoc */
  _onDragStart(event) {
    const li = event.currentTarget;
    if ( event.target.classList.contains("content-link") ) return;

    // Create drag data
    let dragData;

    // Owned Items
    if ( li.dataset.itemId ) {
      const item = this.actor.items.get(li.dataset.itemId);
      dragData = item.toDragData();
    }

    // Active Effect
    if ( li.dataset.effectId ) {
      const effect = this.actor.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    }

    dragData = dragMacro(dragData, li, this.actor);

    if ( !dragData ) return;

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }
}
