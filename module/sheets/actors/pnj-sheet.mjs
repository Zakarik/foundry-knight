import {
  getEffets,
  getAspectValue,
  getAEValue,
  listEffects,
  SortByName,
  sum,
  compareArrays,
  addOrUpdateEffect,
  addEffect,
  updateEffect,
  existEffect,
  confirmationDialog
} from "../../helpers/common.mjs";

import { KnightRollDialog } from "../../dialog/roll-dialog.mjs";
import toggler from '../../helpers/toggler.js';

const path = {
  espoir:{
    bonus:'system.espoir.bonusValue',
    malus:'system.espoir.malusValue',
  },
  sante:{
    bonus:'system.sante.bonusValue',
    malus:'system.sante.malusValue',
  },
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
    base:'system.champDeForce.base',
    bonus:'system.champDeForce.bonusValue',
    malus:'system.champDeForce.malusValue',
  },
};

const caracToAspect = {
  'deplacement':'chair',
  'force':'chair',
  'endurance':'chair',
  'hargne':'bete',
  'combat':'bete',
  'instinct':'bete',
  'tir':'machine',
  'savoir':'machine',
  'technique':'machine',
  'aura':'dame',
  'parole':'dame',
  'sangFroid':'dame',
  'discretion':'masque',
  'dexterite':'masque',
  'perception':'masque'
};

/**
 * @extends {ActorSheet}
 */
export class PNJSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["pnj", "sheet", "actor"],
      template: "systems/knight/templates/actors/pnj-sheet.html",
      width: 900,
      height: 780,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
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
    this._prepareModuleTranslation(context);
    context.data.system.wear = 'armure';

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

    html.find('img.diceTarget').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6TargetWhite.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6TargetBlack.svg");
    });

    html.find('img.option').click(ev => {
      const option = $(ev.currentTarget).data("option");
      const actuel = this.getData().data.system[option]?.optionDeploy || false;

      let result = actuel ? false : true;

      this.actor.update({[`system.${option}.optionDeploy`]:result});
    });

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

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

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

      if(item.type === 'armure') {
        const listEffect = this.actor.getEmbeddedCollection('ActiveEffect');
        const listCapacitesEffects = ['ascension', 'companions', 'shrine', 'goliath', 'rage', 'esquive', 'force', 'legendcompanions', 'legendshrine', 'legendgoliath', 'legendwarlord', 'capaciteUltime'];
        const toUpdate = [];

        for(const capacite of listCapacitesEffects) {
          const effectExist = existEffect(listEffect, capacite);

          if(effectExist !== undefined) {
            toUpdate.push({
              "_id":effectExist._id,
              disabled:true
            });
          }
        }

        if(toUpdate.length > 0) updateEffect(this.actor, toUpdate);
        this.actor.update({['system.equipements.armure.id']:0});
      }

      item.delete();
      header.slideUp(200, () => this.render(false));
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
      const value = target.val();

      this.actor.items.get(id).update({['system.optionsmunitions.actuel']:value});
    });

    html.find('div.combat button.addbasechair').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const value = target?.data("value") || false;
      let result = true;

      if(value) result = false;

      this.actor.items.get(id).update({['system.degats.addchair']:result});
    });

    html.find('.capacites div.armure .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const name = target.data('name');
      const cout = eval(target.data('cout'));
      const toupdate = target.data('toupdate');
      const value = target.data('value') ? false : true;
      const capacite = target.data('capacite');
      const variant = target.data("variant");
      const isAllie = target.data("isallie");
      const nbreC = target.data("nbrec") || 0;
      const special = target.data("special");
      const caracteristiques = target.data("caracteristiques")?.split('.')?.filter((a) => a) || false;

      const getData = this.getData();
      const system = getData.data.system;
      const options = system.options;

      const actor = this.actor;
      const listEffect = actor.getEmbeddedCollection('ActiveEffect');
      const equipcapacites = system.equipements.armure.capacites;
      const armorCapacites = actor.armureData.system.capacites.selected;
      const armure = actor.items.get(system.equipements.armure.id);
      const remplaceEnergie = armure.system.espoir.remplaceEnergie || false;

      const espoir = system.espoir;

      const effect = [];
      const update = {};
      const specialUpdate = {};
      let quelMalus = false;

      if(remplaceEnergie && options.espoir && value) {
        const espoirValue = espoir.value;
        const espoirNew = espoirValue-cout;

        quelMalus = 'espoir';

        if(espoirNew < 0) {
          const msgEspoir = {
            flavor:`${label}`,
            main:{
              total:`${game.i18n.localize('KNIGHT.JETS.Notespoir')}`
            }
          };

          const msgEspoirData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEspoir),
            sound: CONFIG.sounds.dice
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msgEspoirData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });

          return;
        }

        specialUpdate['system.espoir.value'] = espoirNew;
      } else if(options.energie && value) {

        const depense = this._depensePE(cout);

        quelMalus = 'energie';

        if(!depense) {
          const msgEnergie = {
            flavor:`${label}`,
            main:{
              total:`${game.i18n.localize('KNIGHT.JETS.Notenergie')}`
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
          const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });

          return;
        }
      }

      let effectExist = existEffect(listEffect, capacite);

      let depenseEspoir;
      let newActor;

      switch(capacite) {
        case "ascension":
            if(value) {
              let data = system;
              data.energie.value = cout;

              let newItems = getData.items.filter(items => items.system.rarete !== 'prestige');

              newActor = await Actor.create({
                name: `${name} : ${this.title}`,
                type: "pnj",
                img:armure.img,
                items:newItems,
                system:data,
                permission:this.actor.ownership,
                folder:this.actor.folder
              });

              armure.update({[`system.${toupdate}`]:{
                active:true,
                depense:cout,
                ascensionId:newActor.id
              }});

              if(quelMalus !== false) {
                effect.push({
                  key: path[quelMalus].malus,
                  mode: 2,
                  priority: null,
                  value: cout
                });

                addOrUpdateEffect(this.actor, capacite, effect);
              }

            } else {
              const actor = game.actors.get(id);

              if(actor !== undefined) await actor.delete();

              armure.update({[`system.${toupdate}`]:{
                active:false,
                ascensionId:0,
                depense:0
              }});

              updateEffect(this.actor, [{
                "_id":effectExist._id,
                disabled:true
              }]);
            }
            break;
        case "borealis":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "changeling":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "companions":
          update[`system.${toupdate}.base`] = value;
          update[`system.${toupdate}.${special}`] = value;

          if(value) {
            effect.push({
              key: path[quelMalus].malus,
              mode: 2,
              priority: null,
              value: retrieve
            });

            addOrUpdateEffect(this.actor, capacite, effect);

            switch(special) {
              case 'lion':
                const dataLion = armorCapacites.companions.lion;

                const dataLChair = dataLion.aspects.chair;
                const dataLBete = dataLion.aspects.bete;
                const dataLMachine = dataLion.aspects.machine;
                const dataLDame = dataLion.aspects.dame;
                const dataLMasque = dataLion.aspects.masque;

                const lionAEChairMin = dataLChair.ae > 4 ? 0 : dataLChair.ae;
                const lionAEChairMaj = dataLChair.ae < 5 ? 0 : dataLChair.ae;

                const lionAEBeteMin = dataLBete.ae > 4 ? 0 : dataLBete.ae;
                const lionAEBeteMaj = dataLBete.ae < 5 ? 0 : dataLBete.ae;

                const lionAEMachineMin = dataLMachine.ae > 4 ? 0 : dataLMachine.ae;
                const lionAEMachineMaj = dataLMachine.ae < 5 ? 0 : dataLMachine.ae;

                const lionAEDameMin = dataLDame.ae > 4 ? 0 : dataLDame.ae;
                const lionAEDameMaj = dataLDame.ae < 5 ? 0 : dataLDame.ae;

                const lionAEMasqueMin = dataLMasque.ae > 4 ? 0 : dataLMasque.ae;
                const lionAEMasqueMaj = dataLMasque.ae < 5 ? 0 : dataLMasque.ae;

                newActor = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label")}`,
                  type: "pnj",
                  img:dataLion.img,
                  system:{
                    "aspects": {
                      "chair":{
                        "value":dataLChair.value,
                        "ae":{
                          "mineur":{
                            "value":lionAEChairMin
                          },
                          "majeur":{
                            "value":lionAEChairMaj
                          }
                        }
                      },
                      "bete":{
                        "value":dataLBete.value,
                        "ae":{
                          "mineur":{
                            "value":lionAEBeteMin
                          },
                          "majeur":{
                            "value":lionAEBeteMaj
                          }
                        }
                      },
                      "machine":{
                        "value":dataLMachine.value,
                        "ae":{
                          "mineur":{
                            "value":lionAEMachineMin
                          },
                          "majeur":{
                            "value":lionAEMachineMaj
                          }
                        }
                      },
                      "dame":{
                        "value":dataLDame.value,
                        "ae":{
                          "mineur":{
                            "value":lionAEDameMin
                          },
                          "majeur":{
                            "value":lionAEDameMaj
                          }
                        }
                      },
                      "masque":{
                        "value":dataLMasque.value,
                        "ae":{
                          "mineur":{
                            "value":lionAEMasqueMin
                          },
                          "majeur":{
                            "value":lionAEMasqueMaj
                          }
                        }
                      }
                    },
                    "energie":{
                      "base":retrieve,
                      "value":retrieve,
                    },
                    "champDeForce":{
                      "base":dataLion.champDeForce.base,
                    },
                    "armure":{
                      "value":dataLion.armure.value,
                      "base":dataLion.armure.base
                    },
                    "initiative":{
                      "diceBase":dataLion.initiative.value,
                      "bonus":{
                        "user":dataLion.initiative.fixe,
                      }
                    },
                    "defense":{
                      "base":dataLion.defense.value
                    },
                    "reaction":{
                      "base":dataLion.reaction.value
                    },
                    "options":{
                      "resilience":false,
                      "sante":false,
                      "espoir":false,
                      "bouclier":false,
                      "noCapacites":true,
                      "modules":true,
                      "phase2":false
                    }
                  },
                  items:dataLion.modules,
                  folder:this.actor.folder,
                  permission:this.actor.ownership
                });

                const nLItems = [];

                const nLItem = {
                  name:dataLion.armes.contact.coups.label,
                  type:'arme',
                  system:{
                    type:'contact',
                    portee:dataLion.armes.contact.coups.portee,
                    degats:{
                      dice:dataLion.armes.contact.coups.degats.dice,
                      fixe:dataLion.armes.contact.coups.degats.fixe
                    },
                    violence:{
                      dice:dataLion.armes.contact.coups.violence.dice,
                      fixe:dataLion.armes.contact.coups.violence.fixe
                    },
                    effets:{
                      raw:dataLion.armes.contact.coups.effets.raw,
                      custom:dataLion.armes.contact.coups.effets.custom
                    }
                }};

                nLItems.push(nLItem);

                await newActor.createEmbeddedDocuments("Item", nLItems);

                update[`system.capacites.selected.companions.lion.id`] = newActor.id
                break;

              case 'wolf':
                let newActor2;
                let newActor3;

                const dataWolf = armorCapacites.companions.wolf;

                const dataWChair = dataWolf.aspects.chair;
                const dataWBete = dataWolf.aspects.bete;
                const dataWMachine = dataWolf.aspects.machine;
                const dataWDame = dataWolf.aspects.dame;
                const dataWMasque = dataWolf.aspects.masque;

                const dataActor = {
                  "aspects": {
                    "chair":{
                      "value":dataWChair.value
                    },
                    "bete":{
                      "value":dataWBete.value
                    },
                    "machine":{
                      "value":dataWMachine.value
                    },
                    "dame":{
                      "value":dataWDame.value
                    },
                    "masque":{
                      "value":dataWMasque.value
                    }
                  },
                  "energie":{
                    "base":retrieve,
                    "value":retrieve,
                  },
                  "champDeForce":{
                    "base":dataWolf.champDeForce.base,
                  },
                  "armure":{
                    "value":dataWolf.armure.base,
                    "base":dataWolf.armure.base
                  },
                  "initiative":{
                    "diceBase":dataWolf.initiative.value,
                    "bonus":{
                      "user":dataWolf.initiative.fixe,
                    }
                  },
                  "defense":{
                    "base":dataWolf.defense.base
                  },
                  "reaction":{
                    "base":dataWolf.reaction.base
                  },
                  "wolf":dataWolf.configurations,
                  "configurationActive":'',
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "modules":false,
                    "noCapacites":true,
                    "wolfConfiguration":true
                  }
                };

                newActor = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 1`,
                  type: "pnj",
                  img:dataWolf.img,
                  system:dataActor,
                  folder:this.actor.folder,
                  permission:this.actor.ownership
                });

                newActor2 = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 2`,
                  type: "pnj",
                  img:dataWolf.img,
                  system:dataActor,
                  folder:this.actor.folder,
                  permission:this.actor.ownership
                });

                newActor3 = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 3`,
                  type: "pnj",
                  img:dataWolf.img,
                  system:dataActor,
                  folder:this.actor.folder,
                  permission:this.actor.ownership
                });

                const nWItems = [];

                const nWItem = {
                  name:dataWolf.armes.contact.coups.label,
                  type:'arme',
                  system:{
                    type:'contact',
                    portee:dataWolf.armes.contact.coups.portee,
                    degats:{
                      dice:dataWolf.armes.contact.coups.degats.dice,
                      fixe:dataWolf.armes.contact.coups.degats.fixe
                    },
                    violence:{
                      dice:dataWolf.armes.contact.coups.violence.dice,
                      fixe:dataWolf.armes.contact.coups.violence.fixe
                    },
                    effets:{
                      raw:dataWolf.armes.contact.coups.effets.raw,
                      custom:dataWolf.armes.contact.coups.effets.custom
                    }
                }};

                nWItems.push(nWItem);

                await newActor.createEmbeddedDocuments("Item", nWItems);
                await newActor2.createEmbeddedDocuments("Item", nWItems);
                await newActor3.createEmbeddedDocuments("Item", nWItems);

                update[`system.capacites.selected.companions.wolf.id`] = {
                  id1:newActor.id,
                  id2:newActor2.id,
                  id3:newActor3.id
                };
                break;

              case 'crow':
                const dataCrow = armorCapacites.companions.crow;

                const dataCChair = dataCrow.aspects.chair;
                const dataCBete = dataCrow.aspects.bete;
                const dataCMachine = dataCrow.aspects.machine;
                const dataCDame = dataCrow.aspects.dame;
                const dataCMasque = dataCrow.aspects.masque;

                newActor = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label")}`,
                  type: "bande",
                  img:dataCrow.img,
                  system:{
                    "aspects": {
                      "chair":{
                        "value":dataCChair.value
                      },
                      "bete":{
                        "value":dataCBete.value
                      },
                      "machine":{
                        "value":dataCMachine.value
                      },
                      "dame":{
                        "value":dataCDame.value
                      },
                      "masque":{
                        "value":dataCMasque.value
                      }
                    },
                    "energie":{
                      "value":retrieve,
                      "max":retrieve,
                    },
                    "champDeForce":{
                      "base":dataCrow.champDeForce.base,
                    },
                    "sante":{
                      "value":dataCrow.cohesion.base,
                      "base":dataCrow.cohesion.base
                    },
                    "initiative":{
                      "diceBase":dataCrow.initiative.value,
                      "bonus":{
                        "user":dataCrow.initiative.fixe,
                      }
                    },
                    "defense":{
                      "base":dataCrow.defense.value
                    },
                    "reaction":{
                      "base":dataCrow.reaction.value
                    },
                    "debordement":{
                      "value":dataCrow.debordement.base
                    },
                    "options":{
                      "resilience":false,
                      "sante":false,
                      "espoir":false,
                      "bouclier":false,
                      "noCapacites":true,
                      "energie":true,
                      "modules":false
                    }
                  },
                  folder:this.actor.folder,
                  permission:this.actor.ownership
                });

                update[`system.capacites.selected.companions.crow.id`] = newActor.id;
                break;
            }
          } else {
            updateEffect(this.actor, [{
              "_id":effectExist._id,
              disabled:true
            }]);

            switch(special) {
              case 'lion':
                const idLion = armorCapacites.companions.lion.id;
                const actorLion = game.actors.get(idLion);

                this._gainPE(actorLion.system.energie.value, true);

                await actorLion.delete();
                break;

              case 'wolf':
                const id1Wolf = armorCapacites.companions.wolf.id.id1;
                const id2Wolf = armorCapacites.companions.wolf.id.id2;
                const id3Wolf = armorCapacites.companions.wolf.id.id3;
                const actor1Wolf = game.actors.get(id1Wolf);
                const actor2Wolf = game.actors.get(id2Wolf);
                const actor3Wolf = game.actors.get(id3Wolf);

                this._gainPE(actor1Wolf.system.energie.value, true);

                await actor1Wolf.delete();
                await actor2Wolf.delete();
                await actor3Wolf.delete();
                break;

              case 'crow':
                const idCrow = armorCapacites.companions.crow.id;
                const actorCrow = game.actors.get(idCrow);

                this._gainPE(actorCrow.system.energie.value, true);

                await actorCrow.delete();
                break;
            }
          }

          armure.update(update);
          break;
        case "shrine":
          if(special === 'personnel' && value) {
            effect.push({
              key: path.champDeForce.bonus,
              mode: 2,
              priority: null,
              value: armorCapacites.shrine.champdeforce
            });

            addOrUpdateEffect(this.actor, capacite, effect);
          }
          else if(special === 'personnel' && !value) updateEffect(this.actor, [{
            "_id":effectExist._id,
            disabled:true
          }]);

          update[`system.${toupdate}.base`] = value;
          update[`system.${toupdate}.${special}`] = value;

          armure.update(update);
          break;
        case "ghost":
          armure.update({[`system.${toupdate}.${special}`]:value});
          break;
        case "goliath":
          const eGoliath = equipcapacites.goliath;
          const aGoliath = armorCapacites.goliath;

          const goliathMetre = +eGoliath.metre;
          const bGCDF = aGoliath.bonus.cdf.value;
          const mGRea = aGoliath.malus.reaction.value;
          const mGDef = aGoliath.malus.defense.value;

          if(value) {
            effect.push({
              key: path.reaction.malus,
              mode: 2,
              priority: null,
              value: goliathMetre*mGRea
            },
            {
              key: path.defense.malus,
              mode: 2,
              priority: null,
              value: goliathMetre*mGDef
            },
            {
              key: path.champDeForce.bonus,
              mode: 2,
              priority: null,
              value: goliathMetre*bGCDF
            });

            addOrUpdateEffect(this.actor, capacite, effect);
          } else {
            updateEffect(this.actor, [{
              "_id":effectExist._id,
              disabled:true
            }]);
          }

          armure.update({[`system.${toupdate}`]:value});
          break;
        case "illumination":
          switch(special) {
            case "torch":
            case "lighthouse":
            case "lantern":
            case "blaze":
            case "beacon":
            case "projector":
              if(options.espoir && value) {
                const espoirValue = espoir.value;
                const espoirNew = espoirValue-espoir;

                if(espoirNew < 0) {
                  const msgEspoir = {
                    flavor:`${label}`,
                    main:{
                      total:`${game.i18n.localize('KNIGHT.JETS.Notespoir')}`
                    }
                  };

                  const msgEspoirData = {
                    user: game.user.id,
                    speaker: {
                      actor: this.actor?.id || null,
                      token: this.actor?.token?.id || null,
                      alias: this.actor?.name || null,
                    },
                    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                    content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEspoir),
                    sound: CONFIG.sounds.dice
                  };

                  const rMode = game.settings.get("core", "rollMode");
                  const msgFData = ChatMessage.applyRollMode(msgEspoirData, rMode);

                  await ChatMessage.create(msgFData, {
                    rollMode:rMode
                  });

                  return;
                }

                this.actor.update({['system.espoir.value']:espoirNew});
              }

              armure.update({[`system.${toupdate}.${special}`]:value});
              break;

            case "candle":
              const rCandle = new game.knight.RollKnight(dEspoir, this.actor.system);
              rCandle._success = false;
              rCandle._flavor = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.SacrificeGainEspoir");
              await rCandle.toMessage({
                speaker: {
                actor: this.actor?.id || null,
                token: this.actor?.token?.id || null,
                alias: this.actor?.name || null,
                }
              });

              const espoirValue = espoir.value;
              const espoirNew = espoirValue-rCandle.total;

              specialUpdate['system.espoir.value'] = Math.max(espoirNew, 0);
              break;
          }
          break;
        case "morph":

          const nbreP = equipcapacites.morph?.poly || 0;
          const nbreA = equipcapacites.morph.nbre;
          update[`system.${toupdate}.${special}`] = value;

          if(value) {
            let label = special;
            effectExist = existEffect(listEffect, special);
            const aMorph = armorCapacites.morph;

            if(special === "polymorphieLame" || special === "polymorphieGriffe" || special === "polymorphieCanon") {
              effect.push({
                key: `system.equipements.armure.capacites.morph.poly`,
                mode: 2,
                priority: null,
                value: nbreP+1
              });

              label = "polymorphieArme";

              if(nbreP+1 === 2) update[`system.capacites.selected.morph.poly.fait`] = true;
            } else if(special === "metal") {
              const bMCDF = aMorph.metal.bonus.champDeForce;

              effect.push({
                key: path.champDeForce.bonus,
                mode: 2,
                priority: null,
                value: bMCDF
              },
              {
                key: 'system.equipements.armure.capacites.morph.nbre',
                mode: 2,
                priority: null,
                value: 1
              });
            } else if(special === "fluide") {
              const bMFLUI = aMorph.fluide.bonus;

              effect.push({
                key: path.reaction.bonus,
                mode: 2,
                priority: null,
                value: bMFLUI.reaction
              },
              {
                key: path.defense.bonus,
                mode: 2,
                priority: null,
                value: bMFLUI.defense
              },
              {
                key: 'system.equipements.armure.capacites.morph.nbre',
                mode: 2,
                priority: null,
                value: 1
              });
            } else if(special === "vol" || special === "phase" || special === "etirement" || special === "polymorphie") {
              effect.push({
                key: 'system.equipements.armure.capacites.morph.nbre',
                mode: 2,
                priority: null,
                value: 1
              });
            }

            if(effect.length > 0) addOrUpdateEffect(this.actor, label, effect);
            if(nbreA+1 === nbreC) update[`system.capacites.selected.morph.choisi.fait`] = true;
          } else {
            if(special === 'morph') {
              specialUpdate[`system.equipements.armure.capacites.morph.poly`] = 0;

              update[`system.${toupdate}.morph`] = false;
              update[`system.${toupdate}.polymorphieLame`] = false;
              update[`system.${toupdate}.polymorphieGriffe`] = false;
              update[`system.${toupdate}.polymorphieCanon`] = false;
              update[`system.capacites.selected.morph.poly.fait`] = false;
              update[`system.capacites.selected.morph.choisi.fait`] = false;
              update[`system.capacites.selected.morph.choisi.vol`] = false;
              update[`system.capacites.selected.morph.choisi.phase`] = false;
              update[`system.capacites.selected.morph.choisi.etirement`] = false;
              update[`system.capacites.selected.morph.choisi.metal`] = false;
              update[`system.capacites.selected.morph.choisi.fluide`] = false;
              update[`system.capacites.selected.morph.choisi.polymorphie`] = false;
              update[`system.capacites.selected.morph.choisi.polymorphieLame`] = false;
              update[`system.capacites.selected.morph.choisi.polymorphieGriffe`] = false;
              update[`system.capacites.selected.morph.choisi.polymorphieCanon`] = false;

              const metal = existEffect(listEffect, 'metal');
              const fluide = existEffect(listEffect, 'fluide');
              const vol = existEffect(listEffect, 'vol');
              const phase = existEffect(listEffect, 'phase');
              const etirement = existEffect(listEffect, 'etirement');
              const polymorphie = existEffect(listEffect, 'polymorphie');
              const polymorphieArme = existEffect(listEffect, 'polymorphieArme');
              const toDesactivate = [];

              if(metal) toDesactivate.push({"_id":metal._id, disabled:true});
              if(fluide) toDesactivate.push({"_id":fluide._id, disabled:true});
              if(vol) toDesactivate.push({"_id":vol._id, disabled:true});
              if(phase) toDesactivate.push({"_id":phase._id, disabled:true});
              if(etirement) toDesactivate.push({"_id":etirement._id, disabled:true});
              if(polymorphie) toDesactivate.push({"_id":polymorphie._id, disabled:true});
              if(polymorphieArme) toDesactivate.push({"_id":polymorphieArme._id, disabled:true});

              updateEffect(this.actor, toDesactivate);
            } else {
              switch(special) {
                case "polymorphieLame":
                case "polymorphieGriffe":
                case "polymorphieCanon":
                  effectExist = existEffect(listEffect, 'polymorphieArme');

                  effect.push({
                    key: `system.equipements.armure.capacites.morph.poly`,
                    mode: 2,
                    priority: null,
                    value: nbreP-1
                  });

                  updateEffect(this.actor, [{
                    "_id":effectExist._id,
                    changes:effect,
                    disabled:false
                  }]);
                  break;

                case "vol":
                case "phase":
                case "etirement":
                case "polymorphie":
                case "metal":
                case "fluide":
                  effectExist = existEffect(listEffect, special);

                  updateEffect(this.actor, [{
                    "_id":effectExist._id,
                    disabled:true
                  }]);
                  break;
              }
            }
          }

          armure.update(update);
          break;
        case "puppet":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "discord":
          armure.update({[`system.${toupdate}.${special}`]:value});
          break;
        case "rage":
          switch(special){
            case "active":
              update[`system.${toupdate}.${special}`] = value;

              if(value) update[`system.${toupdate}.niveau.colere`] = true;
              else {
                update[`system.${toupdate}.niveau.colere`] = false;
                update[`system.${toupdate}.niveau.rage`] = false;
                update[`system.${toupdate}.niveau.fureur`] = false;
              }

              if(value) {
                effect.push(
                {
                  key: path.reaction.malus,
                  mode: 2,
                  priority: null,
                  value: armorCapacites.rage.colere.reaction
                },
                {
                  key: path.defense.malus,
                  mode: 2,
                  priority: null,
                  value: armorCapacites.rage.colere.defense
                });

                addOrUpdateEffect(this.actor, capacite, effect);
              } else {
                updateEffect(this.actor, [{
                  "_id":effectExist._id,
                  disabled:true
                }]);
              }

              armure.update(update);
              break;

            case "niveau":
              const typeNiveau = target.data("niveau") || false;
              const nActuel = armure.system.capacites.selected?.rage?.niveau || false;

              if(typeNiveau === "espoir") {
                const rSEspoir = new game.knight.RollKnight("1D6", this.actor.system);
                rSEspoir._success = false;
                rSEspoir._flavor = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir");
                await rSEspoir.toMessage({
                  speaker: {
                  actor: this.actor?.id || null,
                  token: this.actor?.token?.id || null,
                  alias: this.actor?.name || null,
                  }
                });

                const espoirValue = espoir.value;
                const espoirNew = espoirValue-rSEspoir.total;

                specialUpdate['system.espoir.value'] = Math.max(espoirNew, 0);
              }

              if(nActuel.colere) {
                update[`system.${toupdate}.niveau.colere`] = false;
                update[`system.${toupdate}.niveau.rage`] = true;

                if(value) {
                  effect.push(
                  {
                    key: path.reaction.malus,
                    mode: 2,
                    priority: null,
                    value: armorCapacites.rage.rage.reaction
                  },
                  {
                    key: path.defense.malus,
                    mode: 2,
                    priority: null,
                    value: armorCapacites.rage.rage.defense
                  });

                  addOrUpdateEffect(this.actor, capacite, effect);
                }

                specialUpdate[`system.egide.bonus.rage`] = armorCapacites.rage.rage.egide;
                specialUpdate[`system.reaction.malus.rage`] = armorCapacites.rage.rage.reaction;
                specialUpdate[`system.defense.malus.rage`] = armorCapacites.rage.rage.defense;
              }
              if(nActuel.rage) {
                update[`system.${toupdate}.niveau.colere`] = false;
                update[`system.${toupdate}.niveau.rage`] = false;
                update[`system.${toupdate}.niveau.fureur`] = true;

                if(value) {
                  effect.push(
                  {
                    key: path.reaction.malus,
                    mode: 2,
                    priority: null,
                    value: armorCapacites.rage.fureur.reaction
                  },
                  {
                    key: path.defense.malus,
                    mode: 2,
                    priority: null,
                    value: armorCapacites.rage.fureur.defense
                  });

                  addOrUpdateEffect(this.actor, capacite, effect);
                }
              }

              armure.update(update);
              break;

            case "degats":
              const degatsRage = target.data("dgts") || 0;
              const degatsLabel = target.data("label") || "";
              const sante = getData.data.system.sante.value;

              const rDgtsRage = new game.knight.RollKnight(degatsRage, this.actor.system);
              rDgtsRage._success = false;
              rDgtsRage._flavor = `${name} : ${degatsLabel}`;
              await rDgtsRage.toMessage({
                speaker: {
                actor: this.actor?.id || null,
                token: this.actor?.token?.id || null,
                alias: this.actor?.name || null,
                }
              });

              specialUpdate[`system.sante.value`] = Math.max(sante-rDgtsRage.total, 0)
            break

            case "recuperation":
              const recuperationRage = target.data("recuperation") || 0;
              const labelRecuperationRage = target.data("labelrecuperation") || "";

              const rGEspoir = new game.knight.RollKnight(recuperationRage, this.actor.system);
                rGEspoir._success = false;
                rGEspoir._flavor = game.i18n.localize("KNIGHT.GAINS.Espoir") + ` (${labelRecuperationRage})`;
                await rGEspoir.toMessage({
                  speaker: {
                  actor: this.actor?.id || null,
                  token: this.actor?.token?.id || null,
                  alias: this.actor?.name || null,
                  }
                });

              const espoirValue = espoir.value;
              const espoirMax = espoir.max;
              const espoirNew = espoirValue+rGEspoir.total;

              specialUpdate['system.espoir.value'] = Math.min(espoirNew, espoirMax);
              break;
          }
          break;
        case "record":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "totem":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "warlord":
          const aWarlord = armorCapacites.warlord.impulsions;

          if(isAllie) update[`system.${toupdate}.${special}.allie`] = value;
          else {
            update[`system.${toupdate}.${special}.porteur`] = value;
            effectExist = existEffect(listEffect, special);

              switch(special) {
                case "esquive":
                  if(value) {
                    effect.push({
                      key: path.reaction.bonus,
                      mode: 2,
                      priority: null,
                      value: aWarlord.esquive.bonus.reaction
                    },
                    {
                      key: path.defense.bonus,
                      mode: 2,
                      priority: null,
                      value: aWarlord.esquive.bonus.defense
                    });

                    addOrUpdateEffect(this.actor, special, effect);
                  } else {
                    updateEffect(this.actor, [{
                      "_id":effectExist._id,
                      disabled:true
                    }]);
                  }
                  break;

                case "force":
                  if(value) {
                    effect.push({
                      key: path.champDeForce.bonus,
                      mode: 2,
                      priority: null,
                      value: aWarlord.force.bonus.champDeForce
                    });

                    addOrUpdateEffect(this.actor, special, effect);
                  } else {
                    updateEffect(this.actor, [{
                      "_id":effectExist._id,
                      disabled:true
                    }]);
                  }
                  break;
              }
          }

          armure.update(update);
          break;
        case "watchtower":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "zen":
          this._rollDice(name, caracToAspect[caracteristiques[0]], 5);
          break;
        case "nanoc":
          armure.update({[`system.${toupdate}.${special}`]:value});
          break;
        case "type":
          armure.update({[`system.${toupdate}.${special}.${variant}`]:value});
          break;
        case "mechanic":
          const mechanic = armorCapacites[capacite].reparation[special];
          const rMechanic = new game.knight.RollKnight(`${mechanic.dice}D6+${mechanic.fixe}`, this.actor.system);
          rMechanic._success = false;
          rMechanic._flavor = `${name}`;
          await rMechanic.toMessage({
            speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
            }
          });
          break;
      }

      this.actor.update(specialUpdate);
    });

    html.find('.capacites div.armure .prolonger').click(async ev => {
      const capacite = $(ev.currentTarget).data("capacite");
      const special = $(ev.currentTarget).data("special");
      const cout = eval($(ev.currentTarget).data("cout"));
      const espoir = $(ev.currentTarget).data("espoir");

      const getData = this.getData();
      const system = getData.data.system;
      const options = system.options;

      this._depensePE(cout);

      switch(capacite) {
        case "illumination":
          switch(special) {
            case "torch":
            case "lighthouse":
            case "lantern":
            case "blaze":
            case "beacon":
            case "projector":
              if(options.espoir) {
                const espoirValue = espoir.value;
                const espoirNew = espoirValue-espoir;

                if(espoirNew < 0) {
                  const msgEspoir = {
                    flavor:`${label}`,
                    main:{
                      total:`${game.i18n.localize('KNIGHT.JETS.Notespoir')}`
                    }
                  };

                  const msgEspoirData = {
                    user: game.user.id,
                    speaker: {
                      actor: this.actor?.id || null,
                      token: this.actor?.token?.id || null,
                      alias: this.actor?.name || null,
                    },
                    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                    content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEspoir),
                    sound: CONFIG.sounds.dice
                  };

                  const rMode = game.settings.get("core", "rollMode");
                  const msgFData = ChatMessage.applyRollMode(msgEspoirData, rMode);

                  await ChatMessage.create(msgFData, {
                    rollMode:rMode
                  });

                  return;
                }

                this.actor.update({['system.espoir.value']:espoirNew});
              }
              break;
          }
          break;
      }
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
          const aGoliath = armorCapacites.goliath;

          const bGCDF = aGoliath.bonus.cdf.value;
          const mGRea = aGoliath.malus.reaction.value;
          const mGDef = aGoliath.malus.defense.value;

          effect.push({
            key: path.reaction.malus,
            mode: 2,
            priority: null,
            value: newV*mGRea
          },
          {
            key: path.defense.malus,
            mode: 2,
            priority: null,
            value: newV*mGDef
          },
          {
            key: path.champDeForce.bonus,
            mode: 2,
            priority: null,
            value: newV*bGCDF
          });

          addOrUpdateEffect(this.actor, capacite, effect);

          if(newV > oldV) { await this._depensePE(cout*(newV-oldV)); }
          break;
        case "puppet":
        case "totem":
        case "warlord":
          if(newV > oldV) { await this._depensePE(cout*(newV-oldV)); }
          break;
      }
    });

    html.find('.capacites div.wolf .wolfFighter').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data('label');
      const barrage = target?.data('barrage') || false;
      const data = this.getData().systemData.wolf.fighter;

      const degats = {
        dice:data.degats,
        fixe:0
      };

      const violence = {
        dice:data.violence,
        fixe:0
      };

      const allEffets = await this._getAllEffets(data.bonus, false, false);

      if(barrage) {
        const barrageLabel = `${game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label')} ${allEffets.barrageValue}`;
        const pAttack = {
          flavor:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}`,
          main:{
            total:barrageLabel
          }
        };

        const attackMsgData = {
          user: game.user.id,
          speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', pAttack),
          sound: CONFIG.sounds.dice
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgData = ChatMessage.applyRollMode(attackMsgData, rMode);

        await ChatMessage.create(msgData, {
          rollMode:rMode
        });
      } else {

        this._doDgts(label, degats, allEffets, false);
        this._doViolence(label, violence, allEffets);
      }
    });

    html.find('.capacites div.bCapacite .activation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget)?.data("name") || '';
      const tenebricide = $(ev.currentTarget)?.data("tenebricide") || false;
      const obliteration = $(ev.currentTarget)?.data("obliteration") || false;

      const data = this.actor.items.get(capacite);

      if(type === 'degats') {
        const dataDegats = data.system;

        const allEffets = await this._getAllEffets(dataDegats.degats.system, tenebricide, obliteration)
        this._doDgts(name, dataDegats.degats.system, allEffets, tenebricide);
      }
    });

    html.find('.capacites div.modules .activation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const module = $(ev.currentTarget).data("module");
      const cout = eval($(ev.currentTarget).data("cout"));
      const depense = this._depensePE(cout, true);

      if(!depense) return;

      if(type === 'module') {
        this.actor.items.get(module).update({[`system.active.base`]:true})
      }

      if(type === 'modulePnj') {
        this.actor.items.get(module).update({[`system.active.pnj`]:true})
      }
    });

    html.find('.capacites div.modules .desactivation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const module = $(ev.currentTarget).data("module");

      if(type === 'module') {
        this.actor.items.get(module).update({[`system.active.base`]:false})
      }

      if(type === 'modulePnj') {
        this.actor.items.get(module).update({[`system.active.pnj`]:false})
      }
    });

    html.find('.capacites div.modules .supplementaire').click(async ev => {
      const cout = eval($(ev.currentTarget).data("cout"));

      this._depensePE(cout, true);
    });

    html.find('div.nods img.dice').click(async ev => {
      const data = this.getData();
      const target = $(ev.currentTarget);
      const nbre = +target.data("number");
      const nods = target.data("nods");

      if(nbre > 0) {
        const recuperation = data.data.system.combat.nods[nods].recuperationBonus;
        const bonus = recuperation.length > 0 ? recuperation.join(' + ') : ` 0`;

        const rNods = new game.knight.RollKnight(`3D6+${bonus}`, this.actor.system);
        rNods._flavor = game.i18n.localize(`KNIGHT.JETS.Nods${nods}`);
        rNods._success = false;
        await rNods.toMessage({
          speaker: {
          actor: this.actor?.id || null,
          token: this.actor?.token?.id || null,
          alias: this.actor?.name || null,
          }
        });

        let base = 0;
        let max = 0;
        let type = '';

        switch(nods) {
          case 'soin':
            type = 'sante';
            base = data.data.system.sante.value;
            max = data.data.system.sante.max;

            break;

          case 'energie':
            type = 'energie';
            base = data.data.system.energie.value;
            max = data.data.system.energie.max;
            break;

          case 'armure':
            type = 'armure'
            base = data.data.system.armure.value;
            max = data.data.system.armure.max;
            break;
        }

        const total = rNods.total;
        const final = base+total > max ? max : base+total;

        const update = {
          'system':{
            'combat':{
              'nods':{
                [nods]:{
                  'value':nbre - 1
                }
              }
            },
            [type]:{
              'value':final
            }
          }
        };

        this.actor.update(update);
      }
    });

    html.find('div.nods img.diceTarget').click(async ev => {
      const data = this.getData();
      const target = $(ev.currentTarget);
      const nbre = +target.data("number");
      const nods = target.data("nods");

      if(nbre > 0) {
        const recuperation = data.data.system.combat.nods[nods].recuperationBonus;
        const bonus = recuperation.length > 0 ? recuperation.join(' + ') : ` 0`;

        const rNods = new game.knight.RollKnight(`3D6+${bonus}`, this.actor.system);
        rNods._flavor = game.i18n.localize(`KNIGHT.JETS.Nods${nods}`);
        rNods._success = false;
        await rNods.toMessage({
          speaker: {
          actor: this.actor?.id || null,
          token: this.actor?.token?.id || null,
          alias: this.actor?.name || null,
          }
        });

        const update = {
          'system':{
            'combat':{
              'nods':{
                [nods]:{
                  'value':nbre - 1
                }
              }
            }
          }
        };

        this.actor.update(update);
      }
    });

    html.find('img.rollSpecifique').click(async ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const roll = target.data("roll");

      const rSpec = new game.knight.RollKnight(`${roll}`, this.actor.system);
      rSpec._flavor = name;
      rSpec._success = true;

      await rSpec.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;

      this._rollDice(label, aspect, false, false, '', '', '', -1, reussites);
    });

    html.find('.rollRecuperationArt').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");

      const rEspoir = new game.knight.RollKnight(`${value}`, this.actor.system);
      rEspoir._flavor = game.i18n.localize("KNIGHT.ART.RecuperationEspoir");
      rEspoir._success = false;
      await rEspoir.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });
    });

    html.find('.art-say').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const name = game.i18n.localize(`KNIGHT.ART.PRATIQUE.${type.charAt(0).toUpperCase()+type.substr(1)}`);
      const data = this.getData().actor.art.system.pratique[type];

      const msg = {
        user: game.user.id,
        speaker: {
          actor: this.actor?.id || null,
          token: this.actor?.token?.id || null,
          alias: this.actor?.name || null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: `<span style="display:flex;width:100%;font-weight:bold;">${name}</span><span style="display:flex;width:100%;text-align:justify;justify-content:left;word-break:break-all;">${data}</span>`
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(msg, rMode);

      await ChatMessage.create(msgData, {
        rollMode:rMode
      });
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const id = target.data("id");
      const isDistance = target.data("isdistance");
      const num = target.data("num");
      const aspect = target?.data("aspect") || [];

      let label;

      switch(isDistance) {
        case 'grenades':
          label = `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;
          break;

        case 'armesimprovisees':
          label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
          break;

        default:
          label = name;
          break;
      }

      this._rollDice(label, aspect, false, true, id, name, isDistance, num, 0);
    });

    html.find('.setResilience').click(async ev => {
      const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
        what:`${game.i18n.localize("KNIGHT.RESILIENCE.TYPES.Label")} ?`,
        select:{
          has:true,
          liste:{
            colosseRecrue:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Recrue"),
            colosseInitie:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Initie"),
            colosseHeros:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Heros"),
            patronRecrue:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Recrue"),
            patronInitie:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Initie"),
            patronHeros:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Heros"),
          }
        }
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
      const data = this.getData().data.system;
      const options = data.options;
      const phase2 = data.phase2;

      const effects = [];

      if(options.sante) {
        effects.push({
          key: path.sante.bonus,
          mode: 2,
          priority: null,
          value: phase2.sante
        });
      }

      if(options.armure) {
        effects.push({
          key: path.armure.bonus,
          mode: 2,
          priority: null,
          value: phase2.armure
        });
      }

      if(options.energie) {
        effects.push({
          key: path.energie.bonus,
          mode: 2,
          priority: null,
          value: phase2.energie
        });
      }

      const listAspects = ['chair', 'bete', 'machine', 'dame', 'masque'];

      for(let i = 0;i < listAspects.length;i++) {
        const label = listAspects[i];

        effects.push({
          key: `system.aspects.${label}.value`,
          mode: 5,
          priority: null,
          value: phase2.aspects[label].value
        },
        {
          key: `system.aspects.${label}.ae.mineur.value`,
          mode: 5,
          priority: null,
          value: phase2.aspects[label].ae.mineur
        },
        {
          key: `system.aspects.${label}.ae.majeur.value`,
          mode: 5,
          priority: null,
          value: phase2.aspects[label].ae.majeur
        });
      }

      addOrUpdateEffect(this.actor, 'phase2', effects);
      this.actor.update({['system.phase2Activate']:true});
    });

    html.find('.desactivatePhase2').click(ev => {
      const listEffect = this.actor.getEmbeddedCollection('ActiveEffect');
      const effectExist = existEffect(listEffect, 'phase2');
      const toUpdate = [];

      toUpdate.push({
        "_id":effectExist._id,
        disabled:true
      });

      updateEffect(this.actor, toUpdate);
      this.actor.update({['system.phase2Activate']:false});
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

      case "art":
          itemData.img = "systems/knight/assets/icons/art.svg";
          break;
    }

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
      const update = {};
      const oldArmorId = actorData?.equipements?.armure?.id || 0;

      if (oldArmorId !== 0) {
        const oldArmor = this.actor.items.get(oldArmorId);

        oldArmor.delete();
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

    let art = {};
    let armureData = {};
    let longbow = {};
    const effects = {armure:[], modules:[], capacites:[], phase2:[], armes:[]};
    const aspectsMax = {
      chair:{max:[20], ae:{mineur:[10], majeur:[10]}},
      bete:{max:[20], ae:{mineur:[10], majeur:[10]}},
      machine:{max:[20], ae:{mineur:[10], majeur:[10]}},
      dame:{max:[20], ae:{mineur:[10], majeur:[10]}},
      masque:{max:[20], ae:{mineur:[10], majeur:[10]}},
    };

    for (let i of sheetData.items) {
      const data = i.system;

      // ARMURE.
      if (i.type === 'armure') {
        armureData = i;

        const capaLongbow = data.capacites.selected?.longbow ?? false;

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

          const labels = CONFIG.KNIGHT.effets;
          longbow.effets.liste1.base = listEffects(longbow.effets.base.raw, longbow.effets.base.custom, labels);
          longbow.effets.liste1.liste = listEffects(longbow.effets.liste1.raw, longbow.effets.liste1.custom, labels);
          longbow.effets.liste2.liste = listEffects(longbow.effets.liste2.raw, longbow.effets.liste2.custom, labels);
          longbow.effets.liste3.liste = listEffects(longbow.effets.liste3.raw, longbow.effets.liste3.custom, labels);
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
        const raw = data.effets.raw;
        const custom = data.effets.custom;
        const labels = CONFIG.KNIGHT.effets;

        data.effets.liste = listEffects(raw, custom, labels);

        const main = data.options2mains.actuel;
        const munition = data.optionsmunitions.actuel;
        const effetsRaw = data.effets.raw;
        const effets2Raw = data.effets2mains.raw;
        const bDefense = effetsRaw.find(str => { if(str.includes('defense')) return str; });
        const bReaction = effetsRaw.find(str => { if(str.includes('reaction')) return str; });

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

        if((bDefense !== undefined && main === '1main') || (bDefense !== undefined && options2mains === false)) {
          effects.armes.push({
            key: path.defense.bonus,
            mode: 2,
            priority: null,
            value: bDefense.split(' ')[1]
          });
        }

        if((bReaction !== undefined && main === '1main') || (bReaction !== undefined && options2mains === false)) {
          effects.armes.push({
            key: path.reaction.bonus,
            mode: 2,
            priority: null,
            value: bReaction.split(' ')[1]
          });
        }

        if(type === 'distance') {
          const rawDistance = data.distance.raw;
          const customDistance = data.distance.custom;
          const labelsDistance = CONFIG.KNIGHT.AMELIORATIONS.distance;
          const effetMunition = data?.optionsmunitions?.liste || {};

          data.distance.liste = listEffects(rawDistance, customDistance, labelsDistance);

          if(optionsMunitions !== false) {
            for (let [kM, munition] of Object.entries(effetMunition)) {
              const bRaw2 = munition.raw || [];
              const bCustom2 = munition.custom || [];

              munition.liste = listEffects(bRaw2, bCustom2, labels);
            }
          }
        } else if(type === 'contact') {
          const rawStructurelles = data.structurelles.raw;
          const customStructurelles = data.structurelles.custom;
          const labelsStructurelles = CONFIG.KNIGHT.AMELIORATIONS.structurelles;
          const bMassive = rawStructurelles.find(str => { if(str.includes('massive')) return true; });

          data.structurelles.liste = listEffects(rawStructurelles, customStructurelles, labelsStructurelles);

          if(bMassive) {
            effects.armes.push({
              key: path.defense.malus,
              mode: 2,
              priority: null,
              value: 1
            });
          }

          const rawOrnementales = data.ornementales.raw;
          const customOrnementales = data.ornementales.custom;
          const labelsOrnementales = CONFIG.KNIGHT.AMELIORATIONS.ornementales;

          data.ornementales.liste = listEffects(rawOrnementales, customOrnementales, labelsOrnementales);

          if(options2mains) {
            const raw2 = data.effets2mains.raw;
            const custom2 = data.effets2mains.custom;

            data.effets2mains.liste = listEffects(raw2, custom2, labels);

            const bDefense2 = effets2Raw.find(str => { if(str.includes('defense')) return str; });
            const bReaction2 = effets2Raw.find(str => { if(str.includes('reaction')) return str; });

            if(bDefense !== undefined && main === '2main' && options2mains === true) {
              effects.armes.push({
                key: path.defense.bonus,
                mode: 2,
                priority: null,
                value: bDefense2.split(' ')[1]
              });
            }
            if(bReaction !== undefined && main === '2main' && options2mains === true) {
              effects.armes.push({
                key: path.reaction.bonus,
                mode: 2,
                priority: null,
                value: bReaction2.split(' ')[1]
              });
            }
          }
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
        const itemBonus = itemDataNiveau.bonus;
        const itemArme = itemDataNiveau.arme;
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

            if(iBArmure.has) { effects.modules.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: iBArmure.value
              });
            }
            if(iBCDF.has) { effects.modules.push({
                key: path.champDeForce.bonus,
                mode: 2,
                priority: null,
                value: iBCDF.value
              });
            }
            if(iBEnergie.has) { effects.modules.push({
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

            const moduleWpn = {
              _id:i._id,
              name:i.name,
              type:'module',
              system:{
                noRack:true,
                type:itemArme.type,
                portee:itemArme.portee,
                degats:itemArme.degats,
                violence:itemArme.violence,
                effets:{
                  raw:moduleEffets.raw,
                  custom:moduleEffets.custom,
                }
              }
            }

            const bDefense = moduleEffets.raw.find(str => { if(str.includes('defense')) return str; });
            const bReaction = moduleEffets.raw.find(str => { if(str.includes('reaction')) return str; });

            if(bDefense !== undefined) { effects.modules.push({
                key: path.defense.bonus,
                mode: 2,
                priority: null,
                value: bDefense.split(' ')[1]
              });
            }
            if(bReaction !== undefined) { effects.modules.push({
                key: path.reaction.bonus,
                mode: 2,
                priority: null,
                value: bReaction.split(' ')[1]
              });
            }

            if(itemArme.type === 'contact') {
              const bMassive = itemArme.structurelles.raw.find(str => { if(str.includes('massive')) return true; });
              if(bMassive) {
                effects.modules.push({
                  key: path.defense.malus,
                  mode: 2,
                  priority: null,
                  value: 1
                });
              }

              armesContact.push(moduleWpn);
            }

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

        const labels = CONFIG.KNIGHT.effets;

        i.system.effets.liste = listEffects(i.system.effets.raw, i.system.effets.custom, labels);

        modules.push(i);
      }

      // CAPACITES
      if (i.type === 'capacite') {
        capacites.push(i);

        const isPhase2 = data.isPhase2;
        const bonus = data.bonus;
        const attaque = data.attaque;

        const aLieSupp = bonus.aspectsLieSupplementaire;
        const cSante = bonus.sante;
        const cArmure = bonus.armure;
        const aspectMax = bonus.aspectMax;

        if(!isPhase2) {
          if(aLieSupp.has) aspectLieSupp.push(aLieSupp.value);

          if(cSante.has) {
            if(cSante.aspect.lie) {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: aspects[cSante.aspect.value]*cSante.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: cSante.value
              });
            }
          }

          if(cArmure.has) {
            if(cArmure.aspect.lie) {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: aspects[cArmure.aspect.value]*cArmure.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: cArmure.value
              });
            }
          }

          if(aspectMax.has) {
            const aMax = aspectMax.aspect;
            aspectsMax[aMax].max.push(aspectMax.maximum.aspect);
            aspectsMax[aMax].ae.mineur.push(aspectMax.maximum.ae);
            aspectsMax[aMax].ae.majeur.push(aspectMax.maximum.ae);
          }

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

          if(cSante.has) {
            if(cSante.aspect.lie) {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: aspects[cSante.aspect.value]*cSante.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: cSante.value
              });
            }
          }

          if(cArmure.has) {
            if(cArmure.aspect.lie) {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: aspects[cArmure.aspect.value]*cArmure.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: cArmure.value
              });
            }
          }

          if(aspectMax.has) {
            const aMax = aspectMax.aspect;
            aspectsMax[aMax].max = aspectMax.maximum.aspect;
            aspectsMax[aMax].ae.mineur.max = aspectMax.maximum.ae;
            aspectsMax[aMax].ae.majeur.max = aspectMax.maximum.ae;
          }

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

        if(data.degats.has) {
          const labels = CONFIG.KNIGHT.effets;

          data.degats.system.effets.liste = listEffects(data.degats.system.effets.raw, data.degats.system.effets.custom, labels);
        }
      }

      // ART
      if (i.type === 'art') {
        art = i;
      }
    }

    for (let [key, grenades] of Object.entries(system.combat.grenades.liste)){
      const raw = grenades.effets.raw;
      const custom = grenades.effets.custom;
      const labels = CONFIG.KNIGHT.effets;

      grenades.liste = listEffects(raw, custom, labels);
    }

    for (let i of capacites) {
      const system = i.system;

      if((!i.isPhase2) || (i.isPhase2 && system.phase2Activate)) {

        for(let i = 0; i < aspectLieSupp.length; i++) {
          const bonus = system.bonus;
          const cSante = bonus.sante;
          const cArmure = bonus.armure;
          const aspectMax = bonus.aspectMax;

          if(cSante.has && cSante.aspect.lie && cSante.aspect.value !== aspectLieSupp[i]) {
            effects.capacites.push({
              key: path.sante.bonus,
              mode: 2,
              priority: null,
              value: aspects[aspectLieSupp[i]]*cSante.aspect.multiplie
            });
          }

          if(cArmure.has && cArmure.aspect.lie && cArmure.aspect.value !== aspectLieSupp[i]) {
            effects.capacites.push({
              key: path.armure.bonus,
              mode: 2,
              priority: null,
              value: aspects[aspectLieSupp[i]]*cArmure.aspect.multiplie
            });
          }

          if(aspectMax.has && aspectMax.aspect !== aspectLieSupp[i]) {
            aspectsMax[aspectLieSupp[i]].max.push(aspectMax.maximum.aspect);
            aspectsMax[aspectLieSupp[i]].ae.mineur.push(aspectMax.maximum.ae);
            aspectsMax[aspectLieSupp[i]].ae.majeur.push(aspectMax.maximum.ae);
          }
        }
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

    for(const aspect in aspectsMax) {
      const max = aspectsMax[aspect].max;
      const aeMinMax = aspectsMax[aspect].ae.mineur;
      const aeMajMax = aspectsMax[aspect].ae.majeur;

      effects.capacites.push({
        key: `system.aspects.${aspect}.max`,
        mode: 5,
        priority: null,
        value: Math.max(max)
      },
      {
        key: `system.aspects.${aspect}.ae.mineur.max`,
        mode: 5,
        priority: null,
        value: Math.max(aeMinMax)
      },
      {
        key: `system.aspects.${aspect}.ae.majeur.max`,
        mode: 5,
        priority: null,
        value: Math.max(aeMajMax)
      });
    }

    const listEffect = this.actor.getEmbeddedCollection('ActiveEffect');
    const listWithEffect = [
      {label:'Modules', data:effects.modules},
      {label:'Capacites', data:effects.capacites},
      {label:'Armes', data:effects.armes},
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

    actorData.armesContact = armesContact;
    actorData.armesDistance = armesDistance;
    actorData.armesTourelles = armesTourelles;
    actorData.langue = langue;
    actorData.capacites = capacites;
    actorData.modules = modules;
    actorData.art = art;
    actorData.armureData = armureData;
    actorData.longbow = longbow;

    // ON ACTUALISE ROLL UI S'IL EST OUVERT
    let rollUi = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? false;

    if(rollUi !== false) {
      await rollUi.setWpnContact(armesContact);
      await rollUi.setWpnDistance(armesDistance);
      await rollUi.setWpnTourelle(armesTourelles);

      rollUi.render(true);
    }
  }

  _getKnightRoll() {
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

  async _rollDice(label, aspect = '', difficulte = false, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, reussitesBonus=0) {
    const data = this.getData();
    const rollApp = this._getKnightRoll();
    const select = aspect;
    const deployWpnImproviseesDistance = typeWpn === 'armesimprovisees' && idWpn === 'distance' ? true : false;
    const deployWpnImproviseesContact = typeWpn === 'armesimprovisees' && idWpn === 'contact' ? true : false;
    const deployWpnDistance = typeWpn === 'distance' ? true : false;
    const deployWpnTourelle = typeWpn === 'tourelle' ? true : false;
    const deployWpnContact = typeWpn === 'contact' ? true : false;
    const deployGrenades = typeWpn === 'grenades' ? true : false;
    const deployLongbow = typeWpn === 'longbow' ? true : false;
    const hasBarrage = typeWpn === 'grenades' ? data.data.system.combat.grenades.liste[nameWpn].effets.raw.find(str => { if(str.includes('barrage')) return true; }) : false;
    const nbreGrenades = data.systemData.combat.grenades.quantity.value;
    let typeWpnFinal = typeWpn;
    let armeDistance = data.actor.armesDistance;
    let armeTourelle = data.actor.armesTourelles;

    for(let i = 0;i < Object.entries(armeDistance).length;i++) {
      const wpnData = armeDistance[i].system;
      const wpnMunitions = wpnData?.optionsmunitions || {has:false};
      const wpnMunitionActuel = wpnMunitions?.actuel || "";
      const wpnMunitionsListe = wpnMunitions?.liste?.[wpnMunitionActuel] || {};

      if(wpnMunitions.has) {
        const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
        const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

        armeDistance[i].system.effets = {
          raw:[...new Set(eRaw)],
          custom:[...new Set(eCustom)],
        }
      }
    }

    for(let i = 0;i < Object.entries(armeTourelle).length;i++) {
      const wpnData = armeTourelle[i].system;
      const wpnMunitions = wpnData?.optionsmunitions || {has:false};
      const wpnMunitionActuel = wpnMunitions?.actuel || "";
      const wpnMunitionsListe = wpnMunitions?.liste?.[wpnMunitionActuel] || {};

      if(wpnMunitions.has) {
        const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
        const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

        armeTourelle[i].system.effets = {
          raw:[...new Set(eRaw)],
          custom:[...new Set(eCustom)],
        }
      }
    }

    let wpnGrenades = {};

    if(nbreGrenades > 0) wpnGrenades = data.systemData.combat.grenades.liste
    if(typeWpn === 'grenades'&& nbreGrenades === 0) typeWpnFinal = '';

    await rollApp.setLabel(label);
    await rollApp.setActor(this.actor.id);
    await rollApp.setRoll(select, [], [], difficulte);
    await rollApp.setBonus(data.data.system.combat.data.modificateur, data.data.system.combat.data.succesbonus+reussitesBonus,
      {dice:data.data.system.combat.data.degatsbonus.dice, fixe:data.data.system.combat.data.degatsbonus.fixe},
      {dice:data.data.system.combat.data.violencebonus.dice, fixe:data.data.system.combat.data.violencebonus.fixe});
    await rollApp.setWpn(data.actor.armesContact, armeDistance, armeTourelle, wpnGrenades, {contact:data.systemData.combat.armesimprovisees.liste, distance:data.systemData.combat.armesimprovisees.liste}, [], data.actor.longbow);
    await rollApp.setSelected(isWpn, idWpn, nameWpn, typeWpnFinal, num);
    await rollApp.setDeploy(deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseesContact, deployWpnImproviseesDistance, deployGrenades, deployLongbow, false);
    await rollApp.setWhatIs(true, false);
    await rollApp.setAspects(data.data.system.aspects);
    await rollApp.setEffets(hasBarrage, false, false, false);
    rollApp.render(true);
    rollApp.bringToTop();
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

  _depensePE(depense, autosubstract=true) {
    const getData = this.getData();

    const actuel = +getData.systemData.energie.value;
    const substract = actuel-depense;

    if(substract < 0) {
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

  async _doDgts(label, dataWpn, listAllEffets, regularite=0, addNum='', tenebricide) {
    const actor = this.actor;

    //DEGATS
    const bourreau = listAllEffets.bourreau;
    const bourreauValue = listAllEffets.bourreauValue;

    const dgtsDice = dataWpn?.dice || 0;
    const dgtsFixe = dataWpn?.fixe || 0;

    let diceDgts = dgtsDice+listAllEffets.degats.totalDice;
    let bonusDgts = dgtsFixe+listAllEffets.degats.totalBonus;

    bonusDgts += regularite;

    const labelDgt = `${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}${addNum}`;
    const totalDiceDgt = tenebricide === true ? Math.floor(diceDgts/2) : diceDgts;

    const totalDgt = `${Math.max(totalDiceDgt, 0)}d6+${bonusDgts}`;

    const execDgt = new game.knight.RollKnight(`${totalDgt}`, actor.system);
    execDgt._success = false;
    execDgt._hasMin = bourreau ? true : false;

    if(bourreau) {
      execDgt._seuil = bourreauValue;
      execDgt._min = 4;
    }

    await execDgt.evaluate(listAllEffets.degats.minMax);

    let effets = listAllEffets;

    if(effets.regularite) {
      const regulariteIndex = effets.degats.include.findIndex(str => { if(str.name.includes(game.i18n.localize(CONFIG.KNIGHT.effets['regularite'].label))) return true; });
      effets.degats.include[regulariteIndex].name = `+${regularite} ${effets.degats.include[regulariteIndex].name}`;

      effets.degats.include.sort(SortByName);
    }

    let sub = effets.degats.list;
    let include = effets.degats.include;

    if(sub.length > 0) { sub.sort(SortByName); }
    if(include.length > 0) { include.sort(SortByName); }

    const pDegats = {
      flavor:labelDgt,
      main:{
        total:execDgt._total,
        tooltip:await execDgt.getTooltip(),
        formula: execDgt._formula
      },
      sub:sub,
      include:include
    };

    const dgtsMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pDegats),
      sound: CONFIG.sounds.dice
    };

    const rMode = game.settings.get("core", "rollMode");
    const msgData = ChatMessage.applyRollMode(dgtsMsgData, rMode);

    await ChatMessage.create(msgData, {
      rollMode:rMode
    });
  }

  async _doViolence(label, dataWpn, listAllEffets, bViolence=0, addNum='') {
    const actor = this.actor;

    //VIOLENCE
    const tenebricide = false;
    const devastation = listAllEffets.devastation;
    const devastationValue = listAllEffets.devastationValue;

    const violenceDice = dataWpn?.dice || 0;
    const violenceFixe = dataWpn?.fixe || 0;

    let diceViolence = violenceDice+listAllEffets.violence.totalDice;
    let bonusViolence = violenceFixe+listAllEffets.violence.totalBonus;

    bonusViolence += bViolence;

    const labelViolence = `${label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}${addNum}`;
    const totalDiceViolence = tenebricide === true ? Math.floor(diceViolence/2) : diceViolence;

    const totalViolence = `${Math.max(totalDiceViolence, 0)}d6+${bonusViolence}`;

    const execViolence = new game.knight.RollKnight(`${totalViolence}`, actor.system);
    execViolence._success = false;
    execViolence._hasMin = devastation ? true : false;

    if(devastation) {
      execViolence._seuil = devastationValue;
      execViolence._min = 5;
    }

    await execViolence.evaluate(listAllEffets.violence.minMax);

    let sub = listAllEffets.violence.list;
    let include = listAllEffets.violence.include;

    if(sub.length > 0) { sub.sort(SortByName); }
    if(include.length > 0) { include.sort(SortByName); }

    const pViolence = {
      flavor:labelViolence,
      main:{
        total:execViolence._total,
        tooltip:await execViolence.getTooltip(),
        formula: execViolence._formula
      },
      sub:sub,
      include:include
    };

    const violenceMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pViolence),
      sound: CONFIG.sounds.dice
    };

    const rMode = game.settings.get("core", "rollMode");
    const msgData = ChatMessage.applyRollMode(violenceMsgData, rMode);

    await ChatMessage.create(msgData, {
      rollMode:rMode
    });
  }

  async _getAllEffets(dataWpn, tenebricide, obliteration) {
    const actor = this.actor;
    const data = {
      guidage:false,
      barrage:true,
      tenebricide:tenebricide,
      obliteration:obliteration
    };

    const effetsWpn = dataWpn.effets;
    const distanceWpn = {raw:[], custom:[]};
    const ornementalesWpn = {raw:[], custom:[]};
    const structurellesWpn = {raw:[], custom:[]};
    const lDgtsOtherInclude = [];

    const listEffets = await getEffets(actor, '', '', data, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, true);

    let getDgtsOtherFixeMod = 0;

    // Aspects Exceptionnels
    const bete = +getAspectValue('bete', this.actor._id);
    const beteAE = getAEValue('bete', this.actor._id);

    const bAEMajeur = +beteAE.majeur;
    const bAEMineur = +beteAE.majeur;

    if(bAEMineur > 0 && bAEMajeur === 0) {
      lDgtsOtherInclude.push({
        name:`+${bAEMineur} ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });

      getDgtsOtherFixeMod += bAEMineur;
    } else if(bAEMajeur > 0) {
      lDgtsOtherInclude.push({
        name:`+${bAEMineur+bAEMajeur+bete} ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });

      getDgtsOtherFixeMod += bAEMineur+bAEMajeur+bete;
    }

    const lEffetAttack = listEffets.attack;
    const lEffetDegats = listEffets.degats;
    const lEffetViolence = listEffets.violence;
    const lEffetOther = listEffets.other;

    // ATTAQUE
    const attackDice = lEffetAttack.totalDice;
    const attackBonus = lEffetAttack.totalBonus;
    const attackInclude = lEffetAttack.include;
    const attackList = lEffetAttack.list;

    // DEGATS
    const degatsDice = lEffetDegats.totalDice;
    const degatsBonus = lEffetDegats.totalBonus+getDgtsOtherFixeMod;
    const degatsInclude = lEffetDegats.include.concat(lDgtsOtherInclude);
    const degatsList = lEffetDegats.list;
    const minMaxDgts = lEffetDegats.minMax;

    // VIOLENCE
    const violenceDice = lEffetViolence.totalDice;
    const violenceBonus = lEffetViolence.totalBonus;
    const violenceInclude = lEffetViolence.include;
    const violenceList = lEffetViolence.list;
    const minMaxViolence = lEffetViolence.minMax;

    // AUTRE
    const other = lEffetOther;

    attackInclude.sort(SortByName);
    attackList.sort(SortByName);
    degatsInclude.sort(SortByName);
    degatsList.sort(SortByName);
    violenceInclude.sort(SortByName);
    violenceList.sort(SortByName);
    other.sort(SortByName);

    const merge = {
      attack:{
        totalDice:attackDice,
        totalBonus:attackBonus,
        include:attackInclude,
        list:attackList
      },
      degats:{
        totalDice:degatsDice,
        totalBonus:degatsBonus,
        include:degatsInclude,
        list:degatsList,
        minMax:minMaxDgts,
      },
      violence:{
        totalDice:violenceDice,
        totalBonus:violenceBonus,
        include:violenceInclude,
        list:violenceList,
        minMax:minMaxViolence,
      },
      other:other
    };

    const nRoll = listEffets.nRoll;

    const result = {
      guidage:listEffets.guidage,
      regularite:listEffets.regularite,
      bourreau:listEffets.bourreau,
      bourreauValue:listEffets.bourreauValue,
      devastation:listEffets.devastation,
      devastationValue:listEffets.devastationValue,
      barrageValue:listEffets.barrageValue,
      depenseEnergie:listEffets.depenseEnergie,
      onlyAttack:listEffets.onlyAttack,
      onlyDgts:listEffets.onlyDgts,
      onlyViolence:listEffets.onlyViolence,
      nRoll:nRoll,
      attack:merge.attack,
      degats:merge.degats,
      violence:merge.violence,
      other:merge.other
    };

    return result;
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
