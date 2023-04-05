import {
  getModStyle,
  listEffects,
  SortByName,
  compareArrays,
  sum,
  addOrUpdateEffect,
  addEffect,
  updateEffect,
  existEffect,
  confirmationDialog
} from "../../helpers/common.mjs";

import { KnightRollDialog } from "../../dialog/roll-dialog.mjs";
import toggler from '../../helpers/toggler.js';

const path = {
  reaction:{
    bonus:'system.reaction.bonusValue',
    malus:'system.reaction.malusValue',
  },
  defense:{
    bonus:'system.defense.bonusValue',
    malus:'system.defense.malusValue',
  },
  armure:{
    bonus:'system.armure.bonusValue',
    malus:'system.armure.malusValue',
  },
  energie:{
    bonus:'system.energie.bonusValue',
    malus:'system.energie.malusValue',
  },
  champDeForce:{
    bonus:'system.champDeForce.bonusValue',
    malus:'system.champDeForce.malusValue',
  },
};

/**
 * @extends {ActorSheet}
 */
export class VehiculeSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vehicule", "sheet", "actor"],
      template: "systems/knight/templates/actors/vehicule-sheet.html",
      width: 900,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "vehicule"}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);
    this._prepareModuleTranslation(context);

    context.systemData = context.data.system;

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

    html.find('img.dice').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6Black.svg");
    });

    html.find('img.option').click(ev => {
      const option = $(ev.currentTarget).data("option");
      const actuel = this.getData().data.system[option]?.optionDeploy || false;

      let result = false;
      if(actuel) {
        result = false;
      } else {
        result = true;
      }

      const update = {
        system: {
          [option]: {
            optionDeploy:result
          }
        }
      };

      this.actor.update(update);
    });

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.modules .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const module = target.data("module");
      const name = target.data("name");
      const cout = eval(target.data("cout"));

      const depense = await this._depensePE(name, cout);

      if(!depense) return;

      const dataModule = this.actor.items.get(module);
      dataModule.update({[`system.active.base`]:true})

      if(dataModule.system.jetsimple.has) {
        const jSREffects = await getEffets(this.actor, 'contact', 'standard', {}, dataModule.system.jetsimple.effets, {raw:[], custom:[]}, {raw:[], custom:[]}, {raw:[], custom:[]}, false);
        const execJSR = new game.knight.RollKnight(dataModule.system.jetsimple.jet, this.actor.system);
        await execJSR.evaluate();

        let jSRoll = {
          flavor:dataModule.system.jetsimple.label,
          main:{
            total:execJSR._total,
            tooltip:await execJSR.getTooltip(),
            formula: execJSR._formula
          },
          other:jSREffects.other
        };

        const jSRMsgData = {
          user: game.user.id,
          speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', jSRoll),
          sound: CONFIG.sounds.dice
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgData = ChatMessage.applyRollMode(jSRMsgData, rMode);

        await ChatMessage.create(msgData, {
          rollMode:rMode
        });
      }
    });

    html.find('.modules .desactivation').click(async ev => {
      const target = $(ev.currentTarget);
      const module = target.data("module");

      this.actor.items.get(module).update({[`system.active.base`]:false});
    });

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

      item.delete();
      header.slideUp(200, () => this.render(false));
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;

      this._rollDice(label, aspect, false, false, '', '', '', -1, reussites);
    });

    html.find('.passager-delete').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.getData().data.system;
      const oldPassager = data.equipage.passagers;
      oldPassager.splice(id,1);

      this.actor.update({[`system.equipage.passagers`]:oldPassager});
    });

    html.find('.pilote-delete').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.getData().data.system;

      this.actor.update({[`system.equipage.pilote`]:{
        name:'',
        id:''
      }});

    });

    html.find('.passager-edit').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.getData().data.system;
      const oldPassager = data.equipage.passagers;
      const newPassager = oldPassager.splice(id,1);

      this.actor.update({[`system.equipage.passagers`]:oldPassager});
      this.actor.update({[`system.equipage.pilote`]:{
        id:newPassager[0].id,
        name:newPassager[0].name
      }});

    });

    html.find('.pilote-edit').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.getData().data.system;
      const oldPassager = data.equipage.passagers;
      oldPassager.push({
        name:data.equipage.pilote.name,
        id:data.equipage.pilote.id
      });

      this.actor.update({[`system.equipage.passagers`]:oldPassager});
      this.actor.update({[`system.equipage.pilote`]:{
        id:'',
        name:''
      }});

    });

    html.find('.jetPilotage').click(ev => {
      const data = this.getData();
      const actorId = data.data.system.equipage.pilote.id;
      const manoeuvrabilite = data.data.system.manoeuvrabilite;
      const label = `${game.i18n.localize("KNIGHT.VEHICULE.Pilotage")} : ${this.actor.name}`

      if(actorId === '') return;

      const actor = game.actors.get(actorId);

      if(actor.type === 'pnj') {
        this._rollDicePNJ(label, actorId, '', false, false, '' , '', '', -1, manoeuvrabilite);
      } else if(actor.type === 'knight') {
        this._rollDicePJ(label, actorId, '', false, false, '', '', '', -1, manoeuvrabilite)
      }
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const id = target.data("id");
      const actorId = target.data("who");
      const isDistance = target.data("isdistance");
      const num = target.data("num");

      if(actorId === '') return;

      const actor = game.actors.get(actorId);

      if(actor.type === 'pnj') {
        this._rollDicePNJ(name, actorId, '', false, true, id, name, isDistance, num, 0);
      } else if(actor.type === 'knight') {
        this._rollDicePJ(name, actorId, '', false, true, id, name, isDistance, num, 0);
      }
    });

    html.find('.whoActivate').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const id = target.data("id");

      this.actor.items.get(id).update({[`system.whoActivate`]:value});
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
    const name = `${game.i18n.localize(`ITEM.Type${type.capitalize()}`)}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };

    switch(type) {
      case "arme":
          itemData.img = "systems/knight/assets/icons/arme.svg";
          break;

      case "armure":
          itemData.img = "systems/knight/assets/icons/armure.svg";
          break;

      case "avantage":
          itemData.img = "systems/knight/assets/icons/avantage.svg";
          break;

      case "inconvenient":
          itemData.img = "systems/knight/assets/icons/inconvenient.svg";
          break;

      case "motivationMineure":
          itemData.img = "systems/knight/assets/icons/motivationMineure.svg";
          break;

      case "langue":
          itemData.img = "systems/knight/assets/icons/langue.svg";
          break;

      case "contact":
          itemData.img = "systems/knight/assets/icons/contact.svg";
          break;

      case "blessure":
          itemData.img = "systems/knight/assets/icons/blessureGrave.svg";
          break;

      case "trauma":
          itemData.img = "systems/knight/assets/icons/trauma.svg";
          break;

      case "module":
          itemData.img = "systems/knight/assets/icons/module.svg";
          break;

      case "capacite":
          itemData.img = "systems/knight/assets/icons/capacite.svg";
          break;

      case "armurelegende":
          itemData.img = "systems/knight/assets/icons/armureLegende.svg";
          break;

      case "carteheroique":
          itemData.img = "systems/knight/assets/icons/carteheroique.svg";
          break;

      case "capaciteheroique":
          itemData.img = "systems/knight/assets/icons/capaciteheroique.svg";
          break;
    }

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    if (type === 'arme') {
      itemData.system = {
        type:header.dataset.subtype
      };
      delete itemData.system["subtype"];
    }

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropActor(event, data) {
    if ( !this.actor.isOwner ) return false;

    const cls = getDocumentClass(data?.type);
    const document = await cls.fromDropData(data);
    const type = document.type;

    if(type === 'knight' || type === 'pnj') {

      const update = {
        system:{
          equipage:{
            passagers:this.getData().data.system.equipage.passagers
          }
        }
      };

      update.system.equipage.passagers.push({
        name:document.name,
        id:document.id
      });

      this.actor.update(update);
    }
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;
    const armeType = itemData[0].system.type;

    const typesValides = [
      'armure', 'capacite',
      'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma',
      'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (typesValides.includes(itemBaseType)) return;
    if (itemBaseType === 'arme' && armeType === 'contact') return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    const armesDistance = [];
    const module = [];
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
    const effects = {armes:[], modules:[]};

    for (let i of sheetData.items) {
      const data = i.system;

      // ARME
      if (i.type === 'arme') {
        const raw = data.effets.raw;
        const custom = data.effets.custom;
        const labels = CONFIG.KNIGHT.effets;

        data.effets.liste = listEffects(raw, custom, labels);

        const effetsRaw = i.system.effets.raw;
        const bDefense = effetsRaw.find(str => { if(str.includes('defense')) return str; });
        const bReaction = effetsRaw.find(str => { if(str.includes('reaction')) return str; });

        if(bDefense !== undefined) {
          effects.armes.push({
            key: path.defense.bonus,
            mode: 2,
            priority: null,
            value: bDefense.split(' ')[1]
          });
        }
        if(bReaction !== undefined) {
          effects.armes.push({
            key: path.reaction.bonus,
            mode: 2,
            priority: null,
            value: bReaction.split(' ')[1]
          });
        }

        const rawDistance = data.distance.raw;
        const customDistance = data.distance.custom;
        const labelsDistance = CONFIG.KNIGHT.AMELIORATIONS.distance;
        const optionsMunitions = data?.optionsmunitions?.has || false;
        const munition = data?.options2mains?.actuel || "";
        const effetMunition = data?.optionsmunitions?.liste || {};

        data.distance.liste = listEffects(rawDistance, customDistance, labelsDistance);

        if(optionsMunitions === true) {
          data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
          data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

          data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
          data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;

          for (let [kM, munition] of Object.entries(effetMunition)) {
            const bRaw2 = munition.raw || [];
            const bCustom2 = munition.custom || [];

            munition.liste = listEffects(bRaw2, bCustom2, labels);
          }
        }

        armesDistance.push(i);
      }

      // MODULE
      if (i.type === 'module') {
        const itemBonus = data.bonus;
        const itemArme = data.arme;
        const itemActive = data?.active?.base || false;

        if(data.permanent || itemActive) {
          if(itemBonus.has) {
            const iBArmure = itemBonus.armure;
            const iBCDF = itemBonus.champDeForce;
            const iBEnergie = itemBonus.energie;
            const iBDgts = itemBonus.degats;
            const iBDgtsVariable = iBDgts.variable;
            const iBViolence = itemBonus.violence;
            const iBViolenceVariable = iBViolence.variable;

            if(iBArmure.has) {
              effects.modules.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: iBArmure.value
              });
            }
            if(iBCDF.has) {
              effects.modules.push({
                key: path.champDeForce.bonus,
                mode: 2,
                priority: null,
                value: iBCDF.value
              });
            }
            if(iBEnergie.has) {
              effects.modules.push({
                key: path.energie.bonus,
                mode: 2,
                priority: null,
                value: iBEnergie.value
              });
            }
            if(iBDgts.has) {
              if(iBDgtsVariable.has) {
                moduleBonusDgtsVariable[iBDgts.type].push({
                  label:i.name,
                  description:i.system.description,
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
                  description:i.system.description,
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
            const moiduleEffetsRaw = moduleEffets.raw;
            const moduleEffetsCustom = moduleEffets.custom;
            const moduleEffetsFinal = {
              raw:[...new Set(moiduleEffetsRaw)],
              custom:moduleEffetsCustom,
              liste:moduleEffets.liste
            };

            const moduleWpn = {
              _id:i._id,
              name:i.name,
              type:'module',
              system:{
                noRack:true,
                whoActivate:i.system.whoActivate || '',
                type:itemArme.type,
                portee:itemArme.portee,
                degats:itemArme.degats,
                violence:itemArme.violence,
                effets:moduleEffetsFinal
              }
            }

            const bDefense = moduleEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
            const bReaction = moduleEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; });

            if(bDefense !== undefined) {
              effects.modules.push({
                key: path.defense.bonus,
                mode: 2,
                priority: null,
                value: bDefense.split(' ')[1]
              });
            }
            if(bReaction !== undefined) {
              effects.modules.push({
                key: path.reaction.bonus,
                mode: 2,
                priority: null,
                value: bReaction.split(' ')[1]
              });
            }

            if(itemArme.type === 'distance') {
              armesDistance.push(moduleWpn);
            }
          }
        }

        module.push(i);
      }
    }

    for(let i = 0;i < armesDistance.length;i++) {
      armesDistance[i].system.degats.module = {};
      armesDistance[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistance[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistance[i].system.violence.module = {};
      armesDistance[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistance[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    }

    actorData.armesDistance = armesDistance;
    actorData.modules = module;

    const listEffect = this.actor.getEmbeddedCollection('ActiveEffect');
    const listWithEffect = [
      {label:'Armes', data:effects.armes},
      {label:'Modules', data:effects.modules},
    ];

    const toUpdate = [];
    const toAdd = [];

    for(let effect of listWithEffect) {
      const effectExist = existEffect(listEffect, effect.label);
      let toggle = false;

      if(effectExist) {
        if(!compareArrays(effectExist.changes, effect.data)) toUpdate.push({
          "_id":effectExist._id,
          changes:effect.data,
          disabled:toggle
        });
        else if(effectExist.disabled !== toggle) toUpdate.push({
          "_id":effectExist._id,
          disabled:toggle
        });
      } else toAdd.push({
          label: effect.label,
          icon: '/icons/svg/mystery-man.svg',
          changes:effect.data,
          disabled:toggle
      });
    }

    if(toUpdate.length > 0) updateEffect(this.actor, toUpdate);
    if(toAdd.length > 0) addEffect(this.actor, toAdd);

    // ON ACTUALISE ROLL UI S'IL EST OUVERT
    let rollUi = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? false;

    if(rollUi !== false) {
      rollUi.setWpnDistance(armesDistance);

      rollUi.render(true);
    }
  }

  _getKnightRollPJ() {
    const result = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? new game.knight.applications.KnightRollDialog({
      title:this.actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
      buttons: {
        button1: {
          label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
          callback: async () => {},
          icon: `<i class="fas fa-dice"></i>`
        },
        button2: {
          label: game.i18n.localize("KNIGHT.JETS.JetEntraide"),
          callback: async () => {},
          icon: `<i class="fas fa-dice-d6"></i>`
        },
        button3: {
          label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    });

    return result;
  }

  _getKnightRollPNJ() {
    const result = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? new game.knight.applications.KnightRollDialog({
      title:this.actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
      buttons: {
        button1: {
          label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
          callback: async () => {},
          icon: `<i class="fas fa-dice"></i>`
        },
        button3: {
          label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    });

    return result;
  }

  async _depensePE(label, depense, autosubstract=true) {
    const data = this.getData();
    const actuel = +data.systemData.energie.value;
    const substract = actuel-depense;

    if(substract < 0) {
      const lNot = game.i18n.localize('KNIGHT.JETS.Notenergie');

      const msgEnergie = {
        flavor:`${label}`,
        main:{
          total:`${lNot}`
        }
      };

      const msgEnergieData = {
        user: game.user.id,
        speaker: {
          actor: this.actor?.id || null,
          token: this.actor?.token?.id || null,
          alias: this.actor?.name || null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
        sound: CONFIG.sounds.dice
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(msgEnergieData, rMode);

      await ChatMessage.create(msgData, {
        rollMode:rMode
      });

      return false;
    } else {

      if(autosubstract) {
        let update = {
          system:{
            energie:{
              value:substract
            }
          }
        }

        this.actor.update(update);
      }

      return true;
    }
  }

  async _rollDicePNJ(label, actorId, aspect = '', difficulte = false, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, desBonus=0) {
    const data = this.getData();
    const rollApp = this._getKnightRollPNJ();
    const select = aspect;
    const deployWpnImproviseesDistance = false;
    const deployWpnImproviseesContact = false;
    const deployWpnDistance = false;
    const deployWpnTourelle = false;
    const deployWpnContact = false;
    const hasBarrage = false;
    const actor = game.actors.get(actorId);
    const armesDistance = isWpn ? this.actor.armesDistance : {};

    let armeDistanceFinal = armesDistance;

    for(let i = 0;i < Object.entries(armeDistanceFinal).length;i++) {
      const wpnData = armeDistanceFinal[i].system;
      const wpnMunitions = wpnData.optionsmunitions;
      const wpnMunitionActuel = wpnMunitions.actuel;
      const wpnMunitionsListe = wpnMunitions.liste[wpnMunitionActuel];

      if(wpnMunitions.has) {
        const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
        const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

        armeDistanceFinal[i].system.effets = {
          raw:[...new Set(eRaw)],
          custom:[...new Set(eCustom)],
        }
      }
    }

    await rollApp.setActor(this.actor.id);
    await rollApp.setAspects(actor.system.aspects);
    await rollApp.setEffets(hasBarrage, false, false, false);
    await rollApp.setData(label, select, [], [], difficulte,
      data.combat.data.modificateur, data.combat.data.succesbonus+desBonus,
      {dice:0, fixe:0},
      {dice:0, fixe:0},
      [], armeDistanceFinal, [], [], {contact:{}, distance:{}}, [], [],
      isWpn, idWpn, nameWpn, typeWpn, num,
      deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseesContact, deployWpnImproviseesDistance, false, false, false,
      true, false);

    rollApp.render(true);
  }

  async _rollDicePJ(label, actorId, caracteristique, difficulte = false, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, desBonus=0) {
    const actor = game.actors.get(actorId);
    const data = actor.system;
    const rollApp = this._getKnightRollPJ();
    const style = data.combat.style;
    const getStyle = getModStyle(style);
    const deployWpnImproviseesDistance = typeWpn === 'armesimprovisees' && idWpn === 'distance' ? true : false;
    const deployWpnImproviseesContact = typeWpn === 'armesimprovisees' && idWpn === 'contact' ? true : false;
    const deployWpnDistance = typeWpn === 'distance' ? true : false;
    const deployWpnTourelle = typeWpn === 'tourelle' ? true : false;
    const deployWpnContact = typeWpn === 'contact' ? true : false;
    const deployGrenades = typeWpn === 'grenades' ? true : false;
    const deployLongbow = typeWpn === 'longbow' ? true : false;
    const hasBarrage = false;
    const armesDistance = isWpn ? this.actor.armesDistance : {};

    let armeDistanceFinal = armesDistance;

    for(let i = 0;i < Object.entries(armeDistanceFinal).length;i++) {
      const wpnData = armeDistanceFinal[i].system;
      const wpnMunitions = wpnData?.optionsmunitions || {has:false};
      const wpnMunitionActuel = wpnMunitions?.actuel || "";
      const wpnMunitionsListe = wpnMunitions?.liste?.[wpnMunitionActuel] || {};

      if(wpnMunitions.has) {
        const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
        const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

        armeDistanceFinal[i].system.effets = {
          raw:[...new Set(eRaw)],
          custom:[...new Set(eCustom)],
        }
      }
    }

    await rollApp.setData(label, caracteristique, [], [], difficulte,
      data.combat.data.modificateur, data.combat.data.succesbonus+desBonus,
      {dice:0, fixe:0},
      {dice:0, fixe:0},
      {}, armeDistanceFinal, {}, {}, {contact:{}, distance:{}}, [], [],
      isWpn, idWpn, nameWpn, typeWpn, num,
      deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseesContact, deployWpnImproviseesDistance, deployGrenades, deployLongbow, false,
      false, false);
    await rollApp.setStyle({
      fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`),
      label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`),
      raw:style,
      info:data.combat.styleInfo,
      caracteristiques:getStyle.caracteristiques,
      tourspasses:data.combat.data.tourspasses,
      type:data.combat.data.type,
      sacrifice:data.combat.data.sacrifice,
      maximum:6
    });
    await rollApp.setActor(actorId);
    await rollApp.setAspects(data.aspects);
    await rollApp.setEffets(hasBarrage, true, true, true);
    rollApp.render(true);
  }

  _prepareModuleTranslation(context) {
    const modules = context.actor?.modules || false;

    if(modules === false) return;

    for (let [key, module] of Object.entries(modules)) {
      const raw = module.system.arme.effets.raw;
      const custom = module.system.arme.effets.custom;
      const labels = CONFIG.KNIGHT.effets;

      const rawD = module.system.arme.distance.raw;
      const customD = module.system.arme.distance.custom;
      const labelsD = CONFIG.KNIGHT.AMELIORATIONS.distance;

      const rawS = module.system.arme.structurelles.raw;
      const customS = module.system.arme.structurelles.custom;
      const labelsS = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

      const rawO = module.system.arme.ornementales.raw;
      const customO = module.system.arme.ornementales.custom;
      const labelsO = CONFIG.KNIGHT.AMELIORATIONS.ornementales;

      const rawM = module.system.jetsimple.effets.raw;
      const customM = module.system.jetsimple.effets.custom;

      module.system.jetsimple.effets.liste = listEffects(rawM, customM, labels);
      module.system.arme.effets.liste = listEffects(raw, custom, labels);
      module.system.arme.distance.liste = listEffects(rawD, customD, labelsD);
      module.system.arme.structurelles.liste = listEffects(rawS, customS, labelsS);
      module.system.arme.ornementales.liste = listEffects(rawO, customO, labelsO);

      const pnj = module.system.pnj.liste;

      for (let [kNpc, npc] of Object.entries(pnj)) {
        if(npc.armes.has) {
          const armes = npc.armes.liste;

          for (let [kArme, arme] of Object.entries(armes)) {
            const rArme = arme.effets.raw;
            const cArme = arme.effets.custom;

            arme.effets.liste = listEffects(rArme, cArme, labels);
          }
        }
      }
    }
  }
}
