import {
  getEffets,
  getAspectValue,
  getAEValue,
  listEffects,
  SortByName,
  confirmationDialog,
  getDefaultImg,
  diceHover,
  options,
  commonPNJ,
  hideShowLimited,
  dragMacro,
  createSheet,
  actualiseRoll,
  getAllEffects,
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
      width: 900,
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
      const toupdate = target.data("toupdate");
      const id = target.data("id");
      const special = target.data("special");
      const retrieve = target.data("depense");
      const name = target.data("name");
      const value = target.data("value") ? false : true;
      const hasFlux = target.data("flux") || false;
      const flux = hasFlux != false ? eval(hasFlux) : false;
      const cout = eval(target.data("cout"));
      const isAllie = target.data("isallie");
      const capacite = target.data("capacite");
      const variant = target.data("variant");
      const module = target.data("module");
      const dEspoir = target.data("despoir");
      const espoir = target.data("espoir");
      const caracteristiques = target.data("caracteristiques")?.split('.')?.filter((a) => a) || false;

      const getData = this.actor;
      const armure = this.actor.items.find(itm => itm.type === 'armure');
      const remplaceEnergie = armure.system.espoir.remplaceEnergie || false;
      const armorCapacites = getData.armureData.system.capacites.selected;

      if(value && type !== 'modulePnj') {
        const coutCalcule = remplaceEnergie && armure.system.espoir.cout > 0 && type === 'module' ? Math.max(Math.floor(cout / armure.system.espoir.cout), 1) : cout;
        const depense = await this._depensePE(name, coutCalcule, true, false, flux, true);

        if(!depense) return;
      }

      let depenseEspoir;
      let newActor;
      let update = {};
      let specialUpdate = {};

      if(type === 'capacites') {
        switch(capacite) {
          case "ascension":
            if(value) {
              const substract = this.actor.system.energie.max-cout;
              let clone = foundry.utils.deepClone(this.actor);
              newActor = await Actor.create(clone);

              for(let item of newActor.items.filter(items => items.system.rarete === 'prestige')) {
                item.delete();
              }

              let update = {};
              update['name'] = `${name} : ${this.title}`;
              update['img'] = armure.img;
              update['system.energie.value'] = cout;
              update['system.wear'] = "ascension";
              update['system.armure.bonus'] = 0;
              update['system.champDeForce.base'] = 0;

              newActor.update(update);
              newActor.items.find(item => item.type === 'armure').update({[`system.energie.base`]:cout});

              armure.update({[`system.${toupdate}`]:{
                active:true,
                depense:cout,
                ascensionId:newActor.id
              }});
            } else {
              const actor = game.actors.get(id);

              if(actor !== undefined) await actor.delete();

              armure.update({[`system.${toupdate}`]:{
                active:false,
                ascensionId:0,
                depense:0
              }});
            }
            break;
          case "borealis":
            armure.update({[`system.${toupdate}`]:value});
            break;
          case "changeling":
            const isExplosive = target.data('explosive');
            const dgtsExplDice = target.data('dgtsdice');
            const dgtsExplFixe = target.data('dgtsfixe');
            const violenceExplDice = target.data('violencedice');
            const ViolenceExplFixe = target.data('violencefixe');

            if(isExplosive) {
              const toUpdateSplit = toupdate.split('/');
              let armorupdate = {};

              for(let tu of toUpdateSplit) {
                armorupdate[`system.${tu}`] = false;
              }

              const roll = new game.knight.RollKnight(this.actor, {
                name:`${name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.CHANGELING.DesactivationExplosive")}`,
              }, false);

              const weapon = roll.prepareWpnDistance({
                name:name,
                system:{
                  degats:{dice:dgtsExplDice, fixe:dgtsExplFixe},
                  violence:{dice:violenceExplDice, fixe:ViolenceExplFixe},
                  effets:armorCapacites.changeling.desactivationexplosive.effets,
                }
              });
              const options = weapon.options;

              for(let o of options) {
                o.active = true;
              }

              const flags = roll.getRollData(weapon)
              roll.setWeapon(weapon);
              await roll.doRollDamage(flags);
              await roll.doRollViolence(flags);

              armure.update(armorupdate);
            } else {
              armure.update({[`system.${toupdate}`]:value});
            }
            break;
          case "companions":
            update[`system.${toupdate}.base`] = value;
            update[`system.${toupdate}.${special}`] = value;

            if(value) {
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

                  newActor = await createSheet(
                    this.actor,
                    "pnj",
                    `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label")}`,
                    {
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
                        "diceBase":dataLion.initiative.value
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
                    dataLion.modules,
                    dataLion.img,
                    dataLion.img,
                    1
                  );
                  await newActor.update({['system.initiative.bonus.user']:dataLion.initiative.fixe});

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
                      "diceBase":dataWolf.initiative.value
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

                  for(let i = 1;i < 4;i++) {
                    newActor = await createSheet(
                      this.actor,
                      "pnj",
                      `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} ${i}`,
                      dataActor,
                      {},
                      dataWolf.img,
                      dataWolf.img,
                      1
                    );
                    await newActor.update({['system.initiative.bonus.user']:dataWolf.initiative.fixe});
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

                    update[`system.capacites.selected.companions.wolf.id.id${i}`] = newActor.id;
                  }
                  break;

                case 'crow':
                  const dataCrow = armorCapacites.companions.crow;

                  const dataCChair = dataCrow.aspects.chair;
                  const dataCBete = dataCrow.aspects.bete;
                  const dataCMachine = dataCrow.aspects.machine;
                  const dataCDame = dataCrow.aspects.dame;
                  const dataCMasque = dataCrow.aspects.masque;

                  newActor = await createSheet(
                    this.actor,
                    "bande",
                    `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label")}`,
                    {
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
                        "diceBase":dataCrow.initiative.value
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
                    {},
                    dataCrow.img,
                    dataCrow.img,
                    1
                  );
                  await newActor.update({['system.initiative.bonus.user']:dataCrow.initiative.fixe});

                  update[`system.capacites.selected.companions.crow.id`] = newActor.id;
                  break;
              }
            } else {
              let recupValue = 0;

              switch(special) {
                case 'lion':
                  const idLion = armorCapacites.companions.lion.id;
                  const actorLion = game.actors?.get(idLion) || {};
                  recupValue = actorLion?.system?.energie?.value || 0;

                  this._gainPE(recupValue, true, false);

                  if(Object.keys(actorLion).length != 0) await actorLion.delete();
                  break;

                case 'wolf':
                  const id1Wolf = armorCapacites.companions.wolf.id.id1;
                  const id2Wolf = armorCapacites.companions.wolf.id.id2;
                  const id3Wolf = armorCapacites.companions.wolf.id.id3;
                  const actor1Wolf = game.actors?.get(id1Wolf) || {};
                  const actor2Wolf = game.actors?.get(id2Wolf) || {};
                  const actor3Wolf = game.actors?.get(id3Wolf) || {};

                  recupValue = actor1Wolf?.system?.energie?.value || 0;

                  this._gainPE(recupValue, true, false);

                  if(Object.keys(actor1Wolf).length != 0) await actor1Wolf.delete();
                  if(Object.keys(actor2Wolf).length != 0) await actor2Wolf.delete();
                  if(Object.keys(actor3Wolf).length != 0) await actor3Wolf.delete();
                  break;

                case 'crow':
                  const idCrow = armorCapacites.companions.crow.id;
                  const actorCrow = game.actors?.get(idCrow) || {};

                  recupValue = actorCrow?.system?.energie?.value || 0;

                  this._gainPE(recupValue, true, false);

                  if(Object.keys(actorCrow).length != 0) await actorCrow.delete();
                  break;
              }
            }

            armure.update(update);
            break;
          case "shrine":
            update[`system.${toupdate}.base`] = value;
            update[`system.${toupdate}.${special}`] = value;

            armure.update(update);
            break;
          case "ghost":
            armure.update({[`system.${toupdate}.${special}`]:value});
            break;
          case "goliath":
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
                if(value) {
                  depenseEspoir = await this._depensePE(`${name} : ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.${special.toUpperCase()}.Label`)}`, espoir, true, true, false, true);

                  if(!depenseEspoir) return;
                }

                armure.update({[`system.${toupdate}.${special}`]:value});
                break;

              case "candle":
                const roll = new game.knight.RollKnight(this.actor, {
                  name:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.SacrificeGainEspoir"),
                  dices:dEspoir,
                }, false);

                const total = await roll.doRoll();

                await this._depensePE(`${name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.Label")}`, total, true, true, false, true);
                break;
            }
            break;
          case "morph":
            if(value && special === 'morph') {
              depenseEspoir = await this._depensePE(`${name}`, espoir, true, true, false, true, html);

              if(!depenseEspoir) return;
            }
            if(special !== 'polymorphieReset') update[`system.${toupdate}.${special}`] = value;

            if(value) {
              if(special === "polymorphieLame" || special === "polymorphieGriffe" || special === "polymorphieCanon")
                update[`system.capacites.selected.morph.active.${special}`] = value;
              else if(special === 'polymorphieReset') {
                update[`system.capacites.selected.morph.active.polymorphieLame`] = false;
                update[`system.capacites.selected.morph.active.polymorphieGriffe`] = false;
                update[`system.capacites.selected.morph.active.polymorphieCanon`] = false;
              }
            } else {
              switch(special) {
                case "polymorphieLame":
                case "polymorphieGriffe":
                case "polymorphieCanon":
                  update[`system.capacites.selected.morph.active.${special}`] = value;
                  break;

                case 'morph':
                  update[`system.capacites.selected.morph.active.polymorphieLame`] = false;
                  update[`system.capacites.selected.morph.active.polymorphieGriffe`] = false;
                  update[`system.capacites.selected.morph.active.polymorphieCanon`] = false;
                  update[`system.capacites.selected.morph.choisi.vol`] = false;
                  update[`system.capacites.selected.morph.choisi.phase`] = false;
                  update[`system.capacites.selected.morph.choisi.etirement`] = false;
                  update[`system.capacites.selected.morph.choisi.metal`] = false;
                  update[`system.capacites.selected.morph.choisi.fluide`] = false;
                  update[`system.capacites.selected.morph.choisi.polymorphie`] = false;
                  update[`system.capacites.selected.morph.choisi.polymorphieLame`] = false;
                  update[`system.capacites.selected.morph.choisi.polymorphieGriffe`] = false;
                  update[`system.capacites.selected.morph.choisi.polymorphieCanon`] = false;
                  break;
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
            const rageInterdit = [];
            const rageBonus = [];

            switch(special){
              case "active":
                update[`system.${toupdate}.${special}`] = value;

                if(value) update[`system.${toupdate}.niveau.colere`] = true;
                else {
                  update[`system.${toupdate}.niveau.colere`] = false;
                  update[`system.${toupdate}.niveau.rage`] = false;
                  update[`system.${toupdate}.niveau.fureur`] = false;
                }

                if(armorCapacites.rage.colere.combosInterdits.has && value) {
                  for (let [key, combo] of Object.entries(armorCapacites.rage.colere.combosInterdits.liste)){
                    if(combo != "") {
                      rageInterdit.push(combo);
                    }
                  }
                }

                if(armorCapacites.rage.colere.combosBonus.has && value) {
                  for (let [key, combo] of Object.entries(armorCapacites.rage.colere.combosBonus.liste)){
                    if(combo != "") {
                      rageBonus.push(combo);
                    }
                  }
                }

                specialUpdate[`system.combos.interdits.caracteristiques.rage`] = value ? rageInterdit : [];
                specialUpdate[`system.combos.bonus.caracteristiques.rage`] = value ? rageBonus : [];

                this.actor.update(specialUpdate);
                armure.update(update);
                break;

              case "niveau":
                const typeNiveau = target.data("niveau") || false;
                const nActuel = armure.system.capacites.selected?.rage?.niveau || false;

                if(typeNiveau === "espoir") {
                  const roll = new game.knight.RollKnight(this.actor, {
                    name:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir"),
                    dices:'1D6',
                  }, false);

                  const total = await roll.doRoll();

                  const rSEspoirTotal = await this._depensePE(`${name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir")}`, total, true, true, false, true);

                  if(!rSEspoirTotal) return;
                }

                if(nActuel.colere) {
                  update[`system.${toupdate}.niveau.colere`] = false;
                  update[`system.${toupdate}.niveau.rage`] = true;

                  if(armorCapacites.rage.rage.combosInterdits.has) {
                    for (let [key, combo] of Object.entries(armorCapacites.rage.rage.combosInterdits.liste)){
                      if(combo != "") {
                        rageInterdit.push(combo);
                      }
                    }
                  }

                  if(armorCapacites.rage.rage.combosBonus.has) {
                    for (let [key, combo] of Object.entries(armorCapacites.rage.rage.combosBonus.liste)){
                      if(combo != "") {
                        rageBonus.push(combo);
                      }
                    }
                  }
                }
                if(nActuel.rage) {
                  update[`system.${toupdate}.niveau.colere`] = false;
                  update[`system.${toupdate}.niveau.rage`] = false;
                  update[`system.${toupdate}.niveau.fureur`] = true;

                  if(armorCapacites.rage.fureur.combosInterdits.has) {
                    for (let [key, combo] of Object.entries(armorCapacites.rage.fureur.combosInterdits.liste)){
                      if(combo != "") {
                        rageInterdit.push(combo);
                      }
                    }
                  }

                  if(armorCapacites.rage.fureur.combosBonus.has) {
                    for (let [key, combo] of Object.entries(armorCapacites.rage.fureur.combosBonus.liste)){
                      if(combo != "") {
                        rageBonus.push(combo);
                      }
                    }
                  }
                }

                specialUpdate[`system.combos.interdits.caracteristiques.rage`] = rageInterdit;
                specialUpdate[`system.combos.bonus.caracteristiques.rage`] = rageBonus;

                this.actor.update(specialUpdate);
                armure.update(update);
                break;

              case "degats":
                const degatsRage = target.data("dgts") || 0;
                const degatsLabel = target.data("label") || "";
                const sante = getData.system.sante.value;

                const rDegats = new game.knight.RollKnight(this.actor, {
                  name:`${name} : ${degatsLabel}`,
                  dices:degatsRage,
                }, false);

                await rDegats.doRoll({['system.sante.value']:`@{max, 0} ${sante}-@{rollTotal}`});
              break

              case "recuperation":
                const recuperationRage = target.data("recuperation") || 0;
                const labelRecuperationRage = target.data("labelrecuperation") || "";

                const rRecuperation = new game.knight.RollKnight(this.actor, {
                  name:game.i18n.localize("KNIGHT.GAINS.Espoir") + ` (${labelRecuperationRage})`,
                  dices:recuperationRage,
                }, false);

                this._gainPE(await rRecuperation.doRoll(), true, true);
                break;

              case "blaze":
                if(value) {
                  depenseEspoir = await this._depensePE(`${name} : ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.${special.toUpperCase()}.Label`)}`, espoir, true, true, false, true);

                  if(!depenseEspoir) return;
                }

                armure.update({[`system.${toupdate}.${special}`]:value});
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
            if(isAllie) update[`system.${toupdate}.${special}.allie`] = value;
            else update[`system.${toupdate}.${special}.porteur`] = value;

            armure.update(update);
            break;
          case "watchtower":
            armure.update({[`system.${toupdate}`]:value});
            break;
          case "zen":
            const autre = [].concat(caracteristiques);
            autre.shift();

            const actor = this.actor.token ? this.actor.token.id : this.actor.id;

            const dialog = new game.knight.applications.KnightRollDialog(actor, {
              label:name,
              base:caracteristiques[0],
              whatRoll:autre,
              difficulte:5,
            });

            dialog.open();
            break;
          case "nanoc":
            armure.update({[`system.${toupdate}.${special}`]:value});
            break;
          case "type":
            armure.update({[`system.${toupdate}.${special}.${variant}`]:value});
            break;
          case "mechanic":
            const mechanic = armorCapacites[capacite].reparation[special];
            const roll = new game.knight.RollKnight(this.actor, {
              name:`${name}`,
              dices:`${mechanic.dice}D6+${mechanic.fixe}`,
            }, false);

            await roll.doRoll();
            break;
        }
      }
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
      const name = $(ev.currentTarget)?.data("name") || '';
      const tenebricide = $(ev.currentTarget)?.data("tenebricide") || false;
      const obliteration = $(ev.currentTarget)?.data("obliteration") || false;

      if(type === 'degats') this._doDgts(name, capacite, obliteration, tenebricide);
    });

    html.find('.capacites div.modules .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const module = target.data("module");
      const value = target.data("value") ? false : true;
      const cout = eval(target.data("cout"));
      const depense = value ? this._depensePE(cout, true) : true;

      if(!depense) return;

      if(type === 'module') {
        const dataModule = this.actor.items.get(module),
              data = dataModule.system,
              dataNiveau = data.niveau.actuel;

        let moduleUpdate = {[`system.active.base`]:value};
        let abort = false;

        if(dataNiveau.jetsimple.has && value) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${dataNiveau.jetsimple.label}`,
            dices:`${dataNiveau.jetsimple.jet}`,
            item:dataModule,
            effectspath:'jetsimple.effets',
          }, false);

          if(data.hasOtherMunition('jetsimple')) {
            await roll.doRoll({}, dataNiveau.jetsimple.effets);
          } else {
            await roll.sendMessage({
                text:game.i18n.localize('KNIGHT.JETS.ChargeurVide'),
                classes:'important',
            });
          }
        }

        if(!data.hasOtherMunition('module') && value && dataNiveau.effets.has) {
          abort = true;
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${dataModule.name}`,
          }, false);

          await roll.sendMessage({
            text:game.i18n.localize('KNIGHT.JETS.ChargeurVide'),
            classes:'important',
          });
        } else if(dataNiveau.effets.raw.find(itm => itm.includes('chargeur')) && value) {
          const findModuleChargeur = dataNiveau.effets.raw.find(itm => itm.includes('chargeur'));
          const chargeur = dataNiveau.effets?.chargeur ?? null;

          if(chargeur === null) moduleUpdate[`system.niveau.details.n${data.getNiveau}.effets.chargeur`] = Math.max(parseInt(findModuleChargeur.split(' ')[1])-1, 0);
          else moduleUpdate[`system.niveau.details.n${data.getNiveau}.effets.chargeur`] = Math.max(parseInt(chargeur)-1, 0);
        }

        if(!abort) dataModule.update(moduleUpdate);
      }

      if(type === 'modulePnj') {
        const index = target.data("index");

        const dataModule = this.actor.items.get(module),
              data = dataModule.system,
              niveau = data.niveau.value,
              dataNiveau = data.niveau.details[`n${niveau}`],
              dataPnj = dataNiveau.pnj.liste[index];

        if(value) {
          const listeAspects = dataPnj.aspects.liste;

          const system = {
            aspects:dataPnj.aspects.has ? {
              'chair':{
                'value':listeAspects.chair.value,
                'ae':{
                  'mineur':{
                    'value':listeAspects.chair.ae.mineur
                  },
                  'majeur':{
                    'value':listeAspects.chair.ae.majeur
                  }
                }
              },
              'bete':{
                'value':listeAspects.bete.value,
                'ae':{
                  'mineur':{
                    'value':listeAspects.bete.ae.mineur
                  },
                  'majeur':{
                    'value':listeAspects.bete.ae.majeur
                  }
                }
              },
              'machine':{
                'value':listeAspects.machine.value,
                'ae':{
                  'mineur':{
                    'value':listeAspects.machine.ae.mineur
                  },
                  'majeur':{
                    'value':listeAspects.machine.ae.majeur
                  }
                }
              },
              'dame':{
                'value':listeAspects.dame.value,
                'ae':{
                  'mineur':{
                    'value':listeAspects.dame.ae.mineur
                  },
                  'majeur':{
                    'value':listeAspects.dame.ae.majeur
                  }
                }
              },
              'masque':{
                'value':listeAspects.masque.value,
                'ae':{
                  'mineur':{
                    'value':listeAspects.masque.ae.mineur
                  },
                  'majeur':{
                    'value':listeAspects.masque.ae.majeur
                  }
                }
              }
            } : {},
            initiative:{
              diceBase:dataPnj.initiative.dice,
              bonus:{user:dataPnj.initiative.fixe}
            },
            armure:{
              base:dataPnj.armure,
              value:dataPnj.armure
            },
            champDeForce:{
              base:dataPnj.champDeForce
            },
            reaction:{
              base:dataPnj.reaction
            },
            defense:{
              base:dataPnj.defense
            },
            options:{
              noAspects:dataPnj.aspects.has ? false : true,
              noArmesImprovisees:dataPnj.aspects.has ? false : true,
              noCapacites:true,
              noGrenades:true,
              noNods:true,
              espoir:false,
              bouclier:false,
              sante:false,
              energie:false,
              resilience:false
            }
          };

          if(dataPnj.jetSpecial.has) {
            const jetsSpeciaux = [];

            system.options.jetsSpeciaux = true;

            for (let [key, jet] of Object.entries(dataPnj.jetSpecial.liste)) {
              jetsSpeciaux.push({
                name:jet.nom,
                value:`${jet.dice}D6+${jet.overdrive}`
              });
            }

            system.jetsSpeciaux = jetsSpeciaux;
          }

          if(dataPnj.type === 'bande') {
            system.debordement = {};
            system.debordement.value = dataPnj.debordement;
          }

          let newActor = await Actor.create({
            name: `${this.title} : ${dataPnj.nom}`,
            type: dataPnj.type,
            img:dataModule.img,
            system:system,
            permission:this.actor.ownership
          });

          if(dataPnj.armes.has && dataPnj.type !== 'bande') {
            const items = [];

            for (let [key, arme] of Object.entries(dataPnj.armes.liste)) {
              const wpnType = arme.type === 'tourelle' ? 'distance' : arme.type;

              let wpn = {
                type:wpnType,
                portee:arme.portee,
                degats:{
                  dice:arme.degats.dice,
                  fixe:arme.degats.fixe
                },
                violence:{
                  dice:arme.violence.dice,
                  fixe:arme.violence.fixe
                },
                effets:{
                  raw:arme.effets.raw,
                  custom:arme.effets.custom
                }
              };

              if(arme.type === 'tourelle') {
                wpn['tourelle'] = {
                  has:true,
                  attaque:{
                    dice:arme.attaque.dice,
                    fixe:arme.attaque.fixe
                  }
                }
              }

              const nItem = {
                name:arme.nom,
                type:'arme',
                system:wpn,
                };

                items.push(nItem);
            }

            await newActor.createEmbeddedDocuments("Item", items);
          }

          this.actor.items.get(module).update({[`system`]:{
            'active':{
              'pnj':true,
              'pnjName':dataPnj.nom
            },
            'id':newActor.id
          }});

        } else if(!value) {
          const actor = game.actors.get(dataModule.system.id);

          await actor.delete();

          dataModule.update({[`system`]:{
            'active':{
              'pnj':false,
              'pnjName':''
            },
            'id':''
          }});
        }
      }

      if(type === 'module') {
        this.actor.items.get(module).update({[`system.active.base`]:value})
      }

      if(type === 'modulePnj') {
        this.actor.items.get(module).update({[`system.active.pnj`]:value})
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
      const data = this.actor;
      const target = $(ev.currentTarget);
      const nbre = +target.data("number");
      const nods = target.data("nods");
      const wear = data.system.wear;

      if(nbre > 0) {
        const recuperation = data.system.combat.nods[nods].recuperationBonus;
        let update = {}

        switch(nods) {
          case 'soin':
            update['system.sante.value'] = `@{rollTotal}+${data.system.sante.value}`;
            break;

          case 'energie':
            update[`system.energie.value`] = `@{rollTotal}+${data.system.energie.value}`;
            break;

          case 'armure':
            update[`system.armure.value`] = `@{rollTotal}+${data.system.armure.value}`;
            break;
        }
        update[`system.combat.nods.${nods}.value`] = nbre - 1;

        const rNods = new game.knight.RollKnight(this.actor, {
          name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
          dices:`3D6`,
          bonus:[recuperation]
        }, false);

        await rNods.doRoll(update);
      } else {
        const rNods = new game.knight.RollKnight(this.actor, {
          name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
        }, false);

        rNods.sendMessage({
          classes:'fail',
          text:`${game.i18n.localize(`KNIGHT.JETS.NotNods`)}`,
        })
      }
    });

    html.find('div.nods img.diceTarget').click(async ev => {
      const data = this.actor;
      const target = $(ev.currentTarget);
      const nbre = +target.data("number");
      const nods = target.data("nods");

      if(nbre > 0) {
        let update = {}
        update[`system.combat.nods.${nods}.value`] = nbre - 1;

        const rNods = new game.knight.RollKnight(this.actor, {
          name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
          dices:`3D6`,
        }, false);

        await rNods.doRoll(update);
      } else {
        const rNods = new game.knight.RollKnight(this.actor, {
          name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
        }, false);

        rNods.sendMessage({
          classes:'fail',
          text:`${game.i18n.localize(`KNIGHT.JETS.NotNods`)}`,
        })
      }
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
      const name = target.data("name");
      const isDistance = target.data("isdistance");
      const num = target.data("num");
      const aspect = target?.data("aspect") || [];
      const actor = this.actor.token ? this.actor.token.id : this.actor.id;
      const parent = target.parents('div.wpn');
      const other = parent.data("other");
      const what = parent.data("what");
      const beteAE = (this.actor.system?.aspects?.bete?.ae?.majeur?.value ?? 0) > 0 || (this.actor.system?.aspects?.bete?.ae?.mineur?.value ?? 0) > 0 ? true : false
      const machineAE = (this.actor.system?.aspects?.machine?.ae?.majeur?.value ?? 0) > 0 || (this.actor.system?.aspects?.machine?.ae?.mineur?.value ?? 0) > 0 ? true : false
      const masqueAE = (this.actor.system?.aspects?.masque?.ae?.majeur?.value ?? 0) > 0 || (this.actor.system?.aspects?.masque?.ae?.mineur?.value ?? 0) > 0 ? true : false
      const hasFumigene = this.actor.statuses.has('fumigene');
      const notFumigene = beteAE || machineAE || masqueAE ? true : false;
      let modificateur = 0;
      let id = target.data("id");
      let base = '';
      let whatRoll = [];

      let label;

      switch(isDistance) {
        case 'grenades':
          const dataGrenade = this.actor.system.combat.grenades.liste[name];
          id = `grenade_${name}`;
          label = dataGrenade.custom ? `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${dataGrenade.label}` : `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;

          if(hasFumigene && !notFumigene) modificateur -= 3;
          break;

        case 'armesimprovisees':
          label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
          id = id === 'distance' ? `${other}${what}d` : `${other}${what}c`;

          base = 'chair';

          if(id === 'distance' && hasFumigene && !notFumigene) modificateur -= 3;
          break;

        case 'longbow':
          label = game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label`);
          id = `capacite_${armure.id}_longbow`;
          if(hasFumigene && !notFumigene) modificateur -= 3;
          break;

        default:
          const item = this.actor.items.get(id);

          if(item) {
            if(item.type === 'module') id = `module_${id}`;
            if(item.type === 'armure') {
              switch(what) {
                case 'rayon':
                case 'salve':
                case 'vague':
                  id = isDistance === 'distance' ? `capacite_${id}_cea${what.charAt(0).toUpperCase() + what.substr(1)}D` : `capacite_${id}_cea${what.charAt(0).toUpperCase() + what.substr(1)}C`;
                  if(isDistance === 'distance' && hasFumigene && !notFumigene) modificateur -= 3;
                  break;

                case 'borealis':
                  id = isDistance === 'distance' ? `capacite_${id}_borealisD` : `capacite_${id}_borealisC`;
                  if(isDistance === 'distance' && hasFumigene && !notFumigene) modificateur -= 3;
                  break;

                case 'lame':
                case 'griffe':
                case 'canon':
                  id = `capacite_${id}_morph${what.charAt(0).toUpperCase() + what.substr(1)}`;
                  break;
              }
            }
            if(item.type === 'capacite') id = `pnjcapacite_${id}`;
            if(item.type === 'arme') {
              if(item.system.type === 'distance' && hasFumigene && !notFumigene) modificateur -= 3;
            }

            label = name;
          }
          break;
      }

      const dialog = new game.knight.applications.KnightRollDialog(actor, {
        label:label,
        wpn:id,
        base:base,
        whatRoll:whatRoll,
        modificateur
      });

      dialog.open();
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
      const aspects = this.actor.system.aspects;
      const phase2 = this.actor.system.phase2;
      let update = {};
      update['system.phase2Activate'] = true;

      for(let a in phase2.aspects) {
        update[`system.aspects.${a}.value`] = aspects[a].value + phase2.aspects[a].value;
        update[`system.aspects.${a}.ae.mineur.value`] = aspects[a].ae.mineur.value + phase2.aspects[a].ae.mineur;
        update[`system.aspects.${a}.ae.majeur.value`] = aspects[a].ae.majeur.value + phase2.aspects[a].ae.majeur;
      }

      this.actor.update(update);
    });

    html.find('.desactivatePhase2').click(ev => {
      const aspects = this.actor.system.aspects;
      const phase2 = this.actor.system.phase2;
      let update = {};
      update['system.phase2Activate'] = false;

      for(let a in phase2.aspects) {
        update[`system.aspects.${a}.value`] = aspects[a].value - phase2.aspects[a].value;
        update[`system.aspects.${a}.ae.mineur.value`] = aspects[a].ae.mineur.value - phase2.aspects[a].ae.mineur;
        update[`system.aspects.${a}.ae.majeur.value`] = aspects[a].ae.majeur.value - phase2.aspects[a].ae.majeur;
      }

      this.actor.update(update);
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
          const getLength = Object.keys(getGrenades).length;

          update[`system.combat.grenades.liste`] = {
            [`grenade_${getLength}`]: {
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

    html.find('div.effets a.edit').click(async ev => {
      const data = this.getData();
      const maxEffets = data.systemData.type === 'contact' ? data?.systemData?.restrictions?.contact?.maxEffetsContact || undefined : undefined;
      const stringPath = $(ev.currentTarget).data("path");
      const aspects = CONFIG.KNIGHT.listCaracteristiques;
      let path = data.data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor._id, item:null, isToken:this?.document?.isToken || false, token:this?.token || null, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:aspects, maxEffets:maxEffets, title:`${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
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
    const labels = Object.assign({}, getAllEffects());

    let art = {};
    let armureData = {};
    let longbow = {};

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
            itemArme.optionsmunitions.liste[key].liste = listEffects(value.raw, value.custom, labels, value?.chargeur);
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

  async _gainPE(gain, autoadd=true, forceEspoir=false) {
    const data = this.actor;
    const armor = data.items.find(itm => itm.type === 'armure');
    const remplaceEnergie = armor.system.espoir.remplaceEnergie || false;

    const type = remplaceEnergie === true || forceEspoir === true ? 'espoir' : 'energie';
    const actuel = remplaceEnergie === true || forceEspoir === true ? +data.system.espoir.value : +data.system.energie.value;
    const total = remplaceEnergie === true || forceEspoir === true ? +data.system.espoir.max : +data.system.energie.max;
    let add = actuel+gain;

    if(add > total) {
      add = total;
    }

    if(autoadd) {
      let update = {}
      if(type !== 'espoir') update[`system.equipements.${this.actor.system.wear}.${type}.value`] = add;
      else update[`system.${type}.value`] = add;

      this.actor.update(update);
    }

    return true;
  }

  async _doDgts(label, id, obliteration, tenebricide) {
    const actor = this.actor;
    const capacite = actor.items.get(id);
    const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
    }, false);
    const weapon = roll.prepareWpnContact({
      name:capacite.name,
      system:{
        degats:{dice:capacite.system.degats.system.dice, fixe:capacite.system.degats.system.fixe},
        effets:capacite.system.degats.system.effets,
      }
    });
    const options = weapon.options;
    const addFlags = {
      actor,
      attaque:[],
      dataMod:{degats:{dice:0, fixe:0}, violence:{dice:0, fixe:0}},
      dataStyle:{},
      flavor:label,
      maximize:{degats:obliteration, violence:false},
      style:'standard',
      surprise:false,
      targets:[],
      total:0,
      weapon
    }

    let data = {
      total:0,
      targets:[],
      attaque:[],
      flags:addFlags
    };

    if(weapon.effets.raw.includes('tirenrafale')) {
      data.content = {
        tirenrafale:true,
      }
    }

    for(let o of options) {
      if(obliteration && o.classes.includes('obliteration')) o.active = true;
      if(tenebricide && o.classes.includes('tenebricide')) o.active = true;
    }

    roll.setWeapon(weapon);
    await roll.doRollDamage(data, addFlags);
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
            value.liste = listEffects(value.raw, value.custom, labels, value?.chargeur);
          }
        }

        if(base.key === 'modules') {
          const dataPnj = data[n].system.niveau.actuel.pnj.liste;

          for(let pnj in dataPnj) {
            for(let wpnPnj in dataPnj[pnj].armes.liste) {
              const dataWpnPnj = dataPnj[pnj].armes.liste[wpnPnj];

              dataWpnPnj.effets.liste = listEffects(dataWpnPnj.effets.raw, dataWpnPnj.effets.custom, labels, dataWpnPnj.effets?.chargeur);
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
      effets.liste = listEffects(effets.raw, effets.custom, labels, effets?.chargeur);
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
