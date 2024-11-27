import {
  listEffects,
  getSpecial,
  sum,
  confirmationDialog,
  getArmor,
  getAllArmor,
  getCaracValue,
  getODValue,
  getDefaultImg,
  diceHover,
  options,
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
export class KnightSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "actor"],
      template: "systems/knight/templates/actors/knight-sheet.html",
      width: 920,
      height: 720,
      tabs: [
        {navSelector: ".sheet-tabs", contentSelector: ".body", initial: "personnage"},
        {navSelector: ".tabArmure", contentSelector: ".armure", initial: "capacites"},
      ],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    const { actor, data, items } = context
    const system = data.system;
    this._prepareCharacterItems(actor, system, items);
    this._prepareTranslation(actor, system);
    this._prepareOverdrives(actor, system);
    this._prepareCapacitesParameters(actor, system);
    this._maxValue(system);

    context.systemData = system;

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

    html.find('div.progression div.evolutionsAAcheter button').hover(ev => {
      const span = html.find('div.progression div.evolutionsAAcheter span.hideInfo');
      const target = $(ev.currentTarget);
      const width = html.find('div.progression div.evolutionsAAcheter').width() / 2;

      if(target.position().left > width) {
        span.toggleClass("right");
      } else {
        span.toggleClass("left");
      }
    });

    toggler.init(this.id, html);

    hideShowLimited(this.actor, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    diceHover(html);
    options(html, this.actor);

    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-edit').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      if(item.type === 'armure') {
        this._resetArmureCapacites();
      }

      if(item.type === 'module') {
        this._resetArmureModules();
      }

      item.sheet.render(true);
    });

    html.find('.item-delete').click(async ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      if(!await confirmationDialog()) return;

      if(item.type === 'armure') {
        const legende = this._getArmorLegende();

        if(legende.length > 0) legende[0].delete();

        const update = {};
        update['system.equipements.armure.hasArmorLegende'] = false;

        this.actor.update(update);
        this._resetArmure();
      }

      if(item.type === 'module') {
        this._resetArmureModules();
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
      const niveau = target.data("niveau");
      const value = target.val();
      const item = this.actor.items.get(id);

      if(item.type === 'module') {
        item.update({[`system.niveau.details.n${niveau}.arme.optionsmunitions.actuel`]:value});
      } else {
        item.update({['system.optionsmunitions.actuel']:value});
      }
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
      const armure = await getArmor(this.actor);
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

              for(let item of newActor.items.filter(items => items.type === 'armure')) {
                let itmUpdate = {};
                itmUpdate['system.jauges.sante'] = false;
                itmUpdate['system.jauges.espoir'] = false;
                itmUpdate['system.jauges.heroisme'] = false;

                item.update(itmUpdate)
              }

              let update = {};
              update['name'] = `${name} : ${this.title}`;
              update['img'] = armure.img;
              update['system.energie.value'] = cout;
              update['system.wear'] = "ascension";
              update['system.equipements.ascension'] = this.actor.system.equipements.armure;

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
            sante:{
              base:dataPnj.sante,
              value:dataPnj.sante
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

          newActor = await Actor.create({
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
                name:arme?.nom ?? game.i18n.localize('TYPES.Item.arme'),
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

          if(actor !== undefined) await actor.delete();

          dataModule.update({[`system`]:{
            'active':{
              'pnj':false,
              'pnjName':''
            },
            'id':''
          }});
        }
      }
    });

    html.find('.armure .activationLegende').click(async ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const toupdate = target.data("toupdate");
      const capacite = target.data("capacite");
      const hasFlux = target.data("flux") || false;
      const cout = eval(target.data("cout"));
      const retrieve = +target.data('depense');
      const flux = hasFlux != false ? eval(hasFlux) : false;
      const special = target.data("special");
      const variant = target.data("variant");
      const isAllie = target.data("isallie");
      const getData = this.actor;
      const armorCapacites = getData.armureLegendeData.system.capacites.selected;
      const value = target.data("value") ? false : true;
      const armure = this._getArmorLegende();

      if(value) {
        const depense = await this._depensePE(name, cout, true, false, flux, true);

        if(!depense) return;
      }

      let newActor;
      let update = {}

      switch(capacite) {
        case "changeling":
          armure.update({[`system.${toupdate}.${special}`]:value});
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
                      "modules":true
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
          }  else {
            switch(special) {
              case 'lion':
                const idLion = armorCapacites.companions.lion.id;
                const actorLion = game.actors.get(idLion);

                this._gainPE(actorLion.system.energie.value, true, false);

                await actorLion.delete();
                break;

              case 'wolf':
                const id1Wolf = armorCapacites.companions.wolf.id.id1;
                const id2Wolf = armorCapacites.companions.wolf.id.id2;
                const id3Wolf = armorCapacites.companions.wolf.id.id3;
                const actor1Wolf = game.actors.get(id1Wolf);
                const actor2Wolf = game.actors.get(id2Wolf);
                const actor3Wolf = game.actors.get(id3Wolf);

                this._gainPE(actor1Wolf.system.energie.value, true, false);

                await actor1Wolf.delete();
                await actor2Wolf.delete();
                await actor3Wolf.delete();
                break;

              case 'crow':
                const idCrow = armorCapacites.companions.crow.id;
                const actorCrow = game.actors.get(idCrow);

                this._gainPE(actorCrow.system.energie.value, true, false);

                await actorCrow.delete();
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
        case "puppet":
          armure.update({[`system.${toupdate}`]:value});
          break;
        case "discord":
          armure.update({[`system.${toupdate}.${special}`]:value});
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
    });

    html.find('.armure .special').click(async ev => {
      const target = $(ev.currentTarget);
      const special = target.data("special");
      const label = target.data("name");
      const value =  eval(target.data("value"));
      const note = target.data("note");
      const base = target.data("base");
      const flux = +this.actor.system.flux.value;
      const armure = await getArmor(this.actor);

      switch(special) {
        case 'recolteflux':
          const limiteHC = +armure.system.special.selected.recolteflux.horsconflit.limite;

          let total = flux+value;

          if(note === 'horsConflit' && total > limiteHC) total = limiteHC;

          this.actor.update({[`system.flux.value`]:total});
          const dataMsg = {
            flavor:label,
            main:{
              total:value
            }
          };

          const msg = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', dataMsg)
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msg, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });
          break;
        case 'contrecoups':
          const id = this.actor.token ? this.actor.token.id : this.actor.id;

          const dialog = new game.knight.applications.KnightRollDialog(id, {
            label:label,
            base:base,
            btn:{
              nood:true,
            }
          });

          dialog.open();
          break;
        case 'energiedeficiente':
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label}`,
            dices:`${value}D6`,
          }, false);

          const rTotal = await roll.doRoll();

          await this._gainPE(rTotal);
          break;
      }
    });

    html.find('.armure .specialLegende').click(async ev => {
      const target = $(ev.currentTarget);
      const special = target.data("special");
      const label = target.data("name");
      const value =  eval(target.data("value"));
      const note = target.data("note");
      const flux = +this.actor.system.flux.value;
      const armure = this._getArmorLegende();

      switch(special) {
        case 'recolteflux':
          const limiteHC = +armure.system.special.selected.recolteflux.horsconflit.limite;

          let total = flux+value;

          if(note === 'horsConflit' && total > limiteHC) total = limiteHC;

          this.actor.update({[`system.flux.value`]:total});
          const dataMsg = {
            flavor:label,
            main:{
              total:value
            }
          };

          const msg = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', dataMsg)
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msg, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });
          break;
      }
    });

    html.find('.armure .capacitesultime .activateCU').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const id = target.data("id");
      const toupdate = target.data("toupdate");
      const value = target.data("value") ? false : true;
      const isinstant = target.data("isinstant");

      const actor = this.actor;
      const item = this.actor.items.get(id);
      const getData = this.actor.system;
      const getCUData = item.system.actives;

      const recuperation = getCUData.recuperation;
      const jet = getCUData.jet;
      const dgts = getCUData.degats;
      const viol = getCUData.violence;
      const effets = getCUData.effets;

      const update = {};

      const effect = [];

      if(value) {
        const energie = getCUData?.energie || 0;
        const heroisme = getCUData?.heroisme || 0;

        if(getData.heroisme.value-heroisme < 0) {
          const msgHeroisme = {
            flavor:`${label}`,
            main:{
              total:`${game.i18n.localize('KNIGHT.JETS.Notheroisme')}`
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
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgHeroisme),
            sound: CONFIG.sounds.dice
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });

          return;
        }

        if(!await this._depensePE(label, energie, true, false, false, true)) return;

        if(!isinstant) item.update({[`system.${toupdate}`]:value});

        update['system.heroisme.value'] = getData.heroisme.value-heroisme;

        if(recuperation.PA) update[`system.armure.value`] = getData.armure.max;
        if(recuperation.PS) update[`system.sante.value`] = getData.sante.max;
        if(recuperation.PE) update[`system.energie.value`] = getData.energie.max;

        if(jet.actif && jet.isfixe) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label}`,
            dices:`${jet.fixe.dice}D6+${jet.fixe.fixe}`,
          }, false);

          const rTotal = await roll.doRoll();
        }

        if(dgts.actif && dgts.isfixe) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
            dices:`${dgts.fixe.dice}D6+${dgts.fixe.fixe}`,
          }, false);
          const weapon = roll.prepareWpnDistance({
            name:label,
            system:{
              degats:{dice:dgts.fixe.dice, fixe:dgts.fixe.fixe},
              violence:{dice:0, fixe:0},
              effets:dgts.effets,
            }
          });
          const options = weapon.options;

          for(let o of options) {
            o.active = true;
          }
          const flags = roll.getRollData(weapon)
          roll.setWeapon(weapon);

          await roll.doRollDamage(flags);
        }

        if(viol.actif && viol.isfixe) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
            dices:`${dgts.fixe.dice}D6+${dgts.fixe.fixe}`,
          }, false);
          const weapon = roll.prepareWpnDistance({
            name:label,
            system:{
              degats:{dice:0, fixe:0},
              violence:{dice:viol.fixe.dice, fixe:viol.fixe.fixe},
              effets:dgts.effets,
            }
          });
          const options = weapon.options;

          for(let o of options) {
            o.active = true;
          }
          const flags = roll.getRollData(weapon)
          roll.setWeapon(weapon);

          await roll.doRollViolence(flags);
        }

        if(effets.actif) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label}`,
            dices:`0D6`,
          }, false);

          const rTotal = await roll.doRoll({}, effets);
        }

      } else if(!isinstant) item.update({[`system.${toupdate}`]:value});

      if(Object.keys(update).length > 0) actor.update(update);
    });

    html.find('.armure .capacitesultime .rollCU').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const id = target.data("id");
      const type = target.data("type");
      const nameList = target.data("rollcu");
      const paliers = target.data("paliers").split(',');
      const caracteristique = target.data("caracteristique");

      const actor = this.actor;
      const item = this.actor.items.get(id);
      const getData = this.actor.system;
      const getCUData = item.system.actives;

      const roll = getCUData[type];

      if(roll.actif && !roll.isfixe) {
        const selected = +html.find(`.armure .capacitesultime .${nameList}`).val();
        const energie = roll.variable.energie*(selected+1) || 0;
        const heroisme = getCUData?.heroisme || 0;

        if(getData.heroisme.value-heroisme < 0) {
          const msgHeroisme = {
            flavor:`${label}`,
            main:{
              total:`${game.i18n.localize('KNIGHT.JETS.Notheroisme')}`
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
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgHeroisme),
            sound: CONFIG.sounds.dice
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });

          return;
        }

        if(!await this._depensePE(label, energie, true, false, false, true)) return;

        let paliersRoll;
        let rollDice;
        let rollFixe;

        switch(type) {
          case 'jet':
            const id = this.actor.token ? this.actor.token.id : this.actor.id;

            const dialog = new game.knight.applications.KnightRollDialog(id, {
              label:label,
              base:caracteristique,
            });

            dialog.open();
            break;
          case 'degats':
            paliersRoll = paliers[selected];
            rollDice = +paliersRoll.split('D6+')[0];
            rollFixe = +paliersRoll.split('D6+')[1];

            const rDegats = new game.knight.RollKnight(this.actor, {
              name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
            }, false);
            const wDegats = rDegats.prepareWpnDistance({
              name:label,
              system:{
                degats:{dice:rollDice, fixe:rollFixe},
                violence:{dice:0, fixe:0},
                effets:roll.effets,
              }
            });
            const optionsDegats = wDegats.options;

            for(let o of optionsDegats) {
              o.active = true;
            }
            const flagsDegats = rDegats.getRollData(wDegats)
            rDegats.setWeapon(wDegats);

            await rDegats.doRollDamage(flagsDegats);
          break;

          case 'violence':
            paliersRoll = paliers[selected];
            rollDice = +paliersRoll.split('D6+')[0];
            rollFixe = +paliersRoll.split('D6+')[1];

            const rViolence = new game.knight.RollKnight(this.actor, {
              name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
            }, false);
            const wViolence = rViolence.prepareWpnDistance({
              name:label,
              system:{
                degats:{dice:0, fixe:0},
                violence:{dice:rollDice, fixe:rollFixe},
                effets:roll.effets,
              }
            });
            const options = wViolence.options;

            for(let o of options) {
              o.active = true;
            }
            const flagsViolence = rViolence.getRollData(wViolence)
            rViolence.setWeapon(wViolence);

            await rViolence.doRollViolence(flagsViolence);
          break;
        }
      }
    });

    html.find('.armure .capacitesultime .majAscension').click(async ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const permanent = target.data("permanent");
      const prestige = target.data("prestige");
      const context = this.actor;
      const name = game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.Label');

      const armure = context.items.find(items => items.type === 'armure');
      const exist = Array.from(game.actors).find(actors => actors.id === armure.system.capacites.selected.ascension.ascensionId);

      if(!exist && permanent) {
        let data = context.system;
        data.wear = "armure";
        data.isAscension = true;
        data.proprietaire = context._id;
        let clone = foundry.utils.deepClone(this.actor);
        let newActor = await Actor.create(clone);

        let update = {};
        update['name'] = `${name} : ${this.title}`;
        update['img'] = armure.img;
        update['system.wear'] = "ascension";
        update['system.equipements.ascension'] = this.actor.system.equipements.armure;

        if(!prestige) {
          for(let item of newActor.items) {
            const rareteWpn = item.system?.rarete ?? '';
            const rareteMdl = item.system?.niveau?.actuel?.rarete ?? '';

            if(((rareteWpn === 'prestige' || rareteMdl === 'prestige') && !prestige) || item.type === 'capaciteultime') item.delete();
          }
        }

        newActor.update(update);
        armure.update({[`system.capacites.selected.ascension`]:{
          ascensionId:newActor.id
        }});

      } else if(permanent) {
        let clone = foundry.utils.deepClone(this.actor);

        const update = {};
        update['name'] = `${name} : ${this.title}`;
        update['system'] = clone.system;
        update['img'] = armure.img;
        update['system.wear'] = "ascension";
        update['system.equipements.ascension'] = this.actor.system.equipements.armure;

        exist.update(update);

        let ascension = exist.items.find(items => items.type === 'armure');

        for(let item of exist.items) {
          await item.delete();
        }

        for(let item of this.actor.items) {
          const rareteWpn = item.system?.rarete ?? '';
          const rareteMdl = item.system?.niveau?.actuel?.rarete ?? '';
          if(((rareteWpn === 'prestige' || rareteMdl === 'prestige') && !prestige) || item.type === 'capaciteultime') continue;

          await Item.create(foundry.utils.deepClone(item), {parent: exist});
        }

        for(let item of exist.items.filter(items => items.type === 'armure')) {
          let itmUpdate = {};
          itmUpdate['system'] = ascension.system;
          itmUpdate['system.jauges.sante'] = false;
          itmUpdate['system.jauges.espoir'] = false;
          itmUpdate['system.jauges.heroisme'] = false;

          item.update(itmUpdate)
        }
      }
    });

    html.find('.armure .supplementaire').click(async ev => {
      const cout = eval($(ev.currentTarget).data("cout"));

      await this._depensePE('', cout, true, false, false, true);
    });

    html.find('.armure .prolonger').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget).data("name");
      const hasFlux = $(ev.currentTarget).data("flux") || false;
      const special = $(ev.currentTarget).data("special");
      const id = $(ev.currentTarget).data("id");
      const cout = eval($(ev.currentTarget).data("cout"));
      const flux = hasFlux != false ? eval(hasFlux) : false;
      const espoir = $(ev.currentTarget).data("espoir");

      await this._depensePE(name, cout, true, false, flux, true);

      switch(capacite) {
        case "illumination":
          switch(special) {
            case "torch":
            case "lighthouse":
            case "lantern":
            case "blaze":
            case "beacon":
            case "projector":
              await this._depensePE(`${name} : ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.${special.toUpperCase()}.Label`)}`, espoir, true, true, false, true);
              break;
          }
          break;
      }
    });

    html.find('.armure .configurationWolf').click(async ev => {
      const target = $(ev.currentTarget);
      const configuration = target.data("configuration");
      const armure = await getArmor(this.actor);
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

    html.find('.armure input.update').change(async ev => {
      const capacite = $(ev.currentTarget).data("capacite");
      const newV = $(ev.currentTarget).val();
      const oldV = $(ev.currentTarget).data("old");
      const cout = $(ev.currentTarget).data("cout");
      const flux = $(ev.currentTarget).data("flux") || false;

      const effect = [];

      switch(capacite) {
        case "goliath":
          if(newV > oldV) { await this._depensePE('', cout*(newV-oldV), true, false, flux, true); }
          break;
        case "puppet":
        case "totem":
        case "warlord":
          if(newV > oldV) { await this._depensePE('', cout*(newV-oldV), true, false, flux, true); }
          break;
      }
    });

    html.find('.armure .aChoisir').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const special = $(ev.currentTarget).data("special");
      const value = $(ev.currentTarget).data("value");

      const armure = await getArmor(this.actor);
      const armureLegende = this._getArmorLegende()[0];

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

    html.find('.armure .degatsViolence').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const eRaw = target?.data("raw") || false;
      const eCustom = target?.data("custom") || '';
      const degatsD = target.data("degats");
      const degatsF = target?.data("degatsfixe") || 0;
      const violenceD = target.data("violence");
      const violenceF = target?.data("violencefixe") || 0;
      const cout = target?.data("cout") || false;

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false, false, true);

        if(!depense) return;
      }

      let raw = [];
      let custom = [];

      if(eRaw !== false) {
        raw = eRaw.split(',');
        custom = eCustom === '' ? [] : eCustom.split(',');
      }

      const roll = new game.knight.RollKnight(this.actor, {
        name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
      }, false);
      const weapon = roll.prepareWpnContact({
        name:`${label}`,
        system:{
          degats:{dice:degatsD, fixe:degatsF},
          violence:{dice:violenceD, fixe:violenceF},
          effets:{raw:raw, custom:custom},
        }
      });
      const options = weapon.options;

      for(let o of options) {
        o.active = true;
      }

      const flags = roll.getRollData(weapon)
      roll.setWeapon(weapon);
      await roll.doRollDamage(flags);

      roll.setName(`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`);
      await roll.doRollViolence(flags);
    });

    html.find('.armure .degats').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const eRaw = target?.data("raw") || false;
      const eCustom = target?.data("custom") || '';
      const degatsD = target.data("degats");
      const degatsF = target?.data("degatsfixe") || 0;
      const cout = target?.data("cout") || false;

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false, false, true);

        if(!depense) return;
      }

      let raw = [];
      let custom = [];

      if(eRaw !== false) {
        raw = eRaw.split(',');
        custom = eCustom === '' ? [] : eCustom.split(',');
      }

      const roll = new game.knight.RollKnight(this.actor, {
        name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
      }, false);
      const weapon = roll.prepareWpnContact({
        name:`${label}`,
        system:{
          degats:{dice:degatsD, fixe:degatsF},
          violence:{dice:0, fixe:0},
          effets:{raw:raw, custom:custom},
        }
      });
      const options = weapon.options;

      for(let o of options) {
        o.active = true;
      }

      const flags = roll.getRollData(weapon)
      roll.setWeapon(weapon);
      await roll.doRollDamage(flags);
    });

    html.find('.armure .violence').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const eRaw = target?.data("raw") || false;
      const eCustom = target?.data("custom") || '';
      const violenceD = target.data("violence");
      const violenceF = target?.data("violencefixe") || 0;
      const cout = target?.data("cout") || false;

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false, false, true);

        if(!depense) return;
      }

      let raw = [];
      let custom = [];

      if(eRaw !== false) {
        raw = eRaw.split(',');
        custom = eCustom === '' ? [] : eCustom.split(',');
      }

      const roll = new game.knight.RollKnight(this.actor, {
        name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`,
      }, false);
      const weapon = roll.prepareWpnContact({
        name:`${label}`,
        system:{
          degats:{dice:0, fixe:0},
          violence:{dice:violenceD, fixe:violenceF},
          effets:{raw:raw, custom:custom},
        }
      });
      const options = weapon.options;

      for(let o of options) {
        o.active = true;
      }

      const flags = roll.getRollData(weapon)
      roll.setWeapon(weapon);
      await roll.doRollViolence(flags);
    });

    html.find('div.listeAspects div.line').hover(ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6Black.svg");
    });

    html.find('div.styleCombat > span.info').hover(ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "block");
    }, ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "none");
    });

    html.find('div.styleCombat > span.info').click(ev => {
      const actuel = this.actor.system.combat?.styleDeploy || false;

      let result = false;

      if(actuel) {
        result = false;
      } else {
        result = true;
      }

      const update = {
        system: {
          combat: {
            styleDeploy:result
          }
        }
      };

      this.actor.update(update);
    });

    html.find('div.styleCombat > select').change(async ev => {
      this.actor.update({['system.combat.data']:{
        tourspasses:1,
        type:"degats"
      }});
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target?.data("label") || '';
      const noOd = target?.data("nood") || false;
      const caracteristique = target.data("caracteristique") || '';
      const caracAdd = target.data("caracadd") === undefined ? [] : target.data("caracadd").split(',')
      const caracLock = target.data("caraclock") === undefined ? [] : target.data("caraclock").split(',');
      const reussites = +target.data("reussitebonus") || 0;
      const succesTemp = +target.data("succestemp") || 0;
      const modTemp = +target.data("modtemp") || 0;
      const id = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(id, {
        label:label,
        base:caracteristique,
        whatRoll:caracAdd,
        succesbonus:reussites+succesTemp,
        modificateur:modTemp,
        btn:{
          nood:noOd,
        }
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
      const data = this.actor.art.system.pratique[type];

      const exec = new game.knight.RollKnight(this.actor,
      {
      name:name,
      }).sendMessage({
          text:data,
          classes:'normal',
      });
    });

    html.find('.jetEspoir').click(async ev => {
      const hasShift = ev.shiftKey;
      const label = game.i18n.localize('KNIGHT.JETS.JetEspoir');

      if(hasShift) {
        const wear = this.object.system.wear;

        let carac = getCaracValue('hargne', this.actor, true);
        carac += getCaracValue('sangFroid', this.actor, true);

        let od = wear === 'armure' || wear === 'ascension' ? getODValue('hargne', this.actor, true) : 0;
        od += wear === 'armure' || wear === 'ascension' ? getODValue('sangFroid', this.actor, true) : 0;
        let caracs = [];

        const exec = new game.knight.RollKnight(this.actor,
          {
          name:label,
          dices:`${carac}D6`,
          carac:[game.i18n.localize(CONFIG.KNIGHT.caracteristiques['hargne']), game.i18n.localize(CONFIG.KNIGHT.caracteristiques['sangFroid'])],
          bonus:[od],
          }).doRoll();

      } else {
        const id = this.actor.token ? this.actor.token.id : this.actor.id;

        const dialog = new game.knight.applications.KnightRollDialog(id, {
          label:label,
          base:'hargne',
          whatRoll:['sangFroid']
        });

        dialog.open();
      }
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const isDistance = target.data("isdistance");
      const num = target.data("num");
      const caracs = target?.data("caracteristiques")?.split(",") || [];
      const autre = [].concat(caracs);
      const parent = target.parents('div.wpn');
      const other = parent.data("other");
      const what = parent.data("what");
      const armure = this.actor.items.find(itm => itm.type === 'armure');
      const hasFumigene = this.actor.statuses.has('fumigene');
      let modificateur = 0;
      let id = target.data("id");
      let base = '';
      let whatRoll = [];

      if(isDistance === 'grenades') {
        const nbreGrenade = this.actor.system?.combat?.grenades?.quantity?.value ?? 0;

        if(nbreGrenade === 0) {
          ui.notifications.warn(game.i18n.localize(`KNIGHT.AUTRE.NoGrenades`));
          return;
        }
      }

      if(caracs.length > 0) {
        base = caracs[0];
        autre.shift();
      }

      let label = '';

      switch(isDistance) {
        case 'grenades':
          const dataGrenade = this.actor.system.combat.grenades.liste[name];
          id = `grenade_${name}`;
          label = dataGrenade.custom ? `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${dataGrenade.label}` : `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;

          if(hasFumigene) modificateur -= 3;

          break;

        case 'longbow':
          label = game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label`);
          id = `capacite_${armure.id}_longbow`;

          if(hasFumigene) modificateur -= 3;
          break;

        case 'armesimprovisees':

          label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
          id = id === 'distance' ? `${other}${what}d` : `${other}${what}c`;

          whatRoll.push('force');

          if(id === 'distance') {
            base = 'tir';
            if(hasFumigene) modificateur -= 3;
          }
          else base = 'combat';
          break;

        default:
          label = name;
          const item = this.actor.items.get(id);

          if(item) {
            if(item.type === 'module') id = `module_${id}`;
            if(item.type === 'armure') {
              switch(what) {
                case 'rayon':
                case 'salve':
                case 'vague':
                  id = isDistance === 'distance' ? `capacite_${id}_cea${what.charAt(0).toUpperCase() + what.substr(1)}D` : `capacite_${id}_cea${what.charAt(0).toUpperCase() + what.substr(1)}C`;

                  if(isDistance === 'distance' && hasFumigene) modificateur -= 2;
                  break;

                case 'borealis':
                  id = isDistance === 'distance' ? `capacite_${id}_borealisD` : `capacite_${id}_borealisC`;

                  if(isDistance === 'distance' && hasFumigene) modificateur -= 2;
                  break;

                case 'lame':
                case 'griffe':
                case 'canon':
                  id = `capacite_${id}_morph${what.charAt(0).toUpperCase() + what.substr(1)}`;
                  break;
              }
            }
            if(item.type === 'arme') {
              if(item.system.type === 'distance' && hasFumigene) modificateur -= 3;
            }

          }
          break;
      }
      const actor = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(actor, {
        label:label,
        wpn:id,
        base:base,
        whatRoll:whatRoll,
        modificateur
      });

      dialog.open();
    });

    html.find('.jetEgide').click(async ev => {
      const value = $(ev.currentTarget).data("value");

      const rEgide = new game.knight.RollKnight(this.actor, {
        name:game.i18n.localize("KNIGHT.JETS.JetEgide"),
        dices:`${value}`
      });

      await rEgide.doRoll();
    });

    html.find('.motivationAccomplie').click(async ev => {
      const espoir = this.actor.system.espoir;
      const mods = espoir.recuperation.bonus-espoir.recuperation.malus;
      const actuel = this.actor.system.espoir.value;
      let update = {}
      update[`system.espoir.value`] = `${actuel}+@{rollTotal}`;

      const rEspoir = new game.knight.RollKnight(this.actor, {
        name:game.i18n.localize("KNIGHT.PERSONNAGE.MotivationAccomplie"),
        dices:`1D6`,
        bonus:[mods]
      }, false);

      await rEspoir.doRoll(update);
    });

    html.find('img.edit').click(ev => {
      const aspect = $(ev.currentTarget).data("aspect");
      const label = game.i18n.localize(CONFIG.KNIGHT.aspects[aspect]);

      const dataAspect = this.actor.system.aspects[aspect];

      let editCarac = ``;
      let listCarac = [];

      for (let [key, carac] of Object.entries(dataAspect.caracteristiques)){
        editCarac += `
        <label class="line">
            <span class="label">${game.i18n.localize(CONFIG.KNIGHT.caracteristiques[key])}</span>
            <input type="number" class="${key}" data-type="caracteristique" value="${carac.base}" min="0" max="9" />
        </label>
        `;
        listCarac.push(key);
      }

      const editDialog = `
      <input type="number" class="aspect" data-type="aspect" value="${dataAspect.base}" min="0" max="9" />
      <div class="main">${editCarac}</div>
      `;

      const edit = new game.knight.applications.KnightEditDialog({
        title: this.actor.name+" : "+label,
        actor:this.actor.id,
        content: editDialog,
        buttons: {
          button1: {
            label: game.i18n.localize("KNIGHT.AUTRE.Valider"),
            callback: async (html) => {
              const baseAspect = +html.find('.aspect').val();

              let caracteristiques = {};

              for(let i = 0;i < listCarac.length;i++) {
                const baseCarac = +html.find(`.${listCarac[i]}`).val();

                caracteristiques[listCarac[i]] = {};
                caracteristiques[listCarac[i]].base = baseCarac;
              }

              let update = {
                system:{
                  aspects:{
                    [aspect]:{
                      base:baseAspect,
                      caracteristiques
                    }
                  }
                }
              };

              this.actor.update(update);
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
            icon: `<i class="fas fa-times"></i>`
          }
        }
      }).render(true);
    });

    html.find('button.gainEspoirItem').click(ev => {
      const id = $(ev.currentTarget).data("id");
      const item = this.actor.items.get(id);
      const value = item.system.gainEspoir.value;
      const actuel = this.actor.system.espoir.value;
      const max = this.actor.system.espoir.max;
      let total = actuel+value;

      const updateItem = {
        system:{
          gainEspoir:{
            applique:true
          }
        }
      };

      if(total > max) { total = max; }

      const updateActor = {
        system:{
          espoir:{
            value:total
          }
        }
      };

      item.update(updateItem);
      this.actor.update(updateActor);
    });

    html.find('div.buttonSelectArmure button.armure').click(async ev => {
      ev.preventDefault();
      const type = $(ev.currentTarget).data("type");
      const data = this.actor.system;
      const wear = data.wear;
      let itemUpdate = '';

      if(type === data.wear) return;

      const update = {};

      update[`system.wear`] = type;

      switch(wear) {
        case 'armure':
          itemUpdate = `system.armure.value`;
          break;

        case 'ascension':
        case 'guardian':
          update[`system.equipements.${wear}.armure.value`] = data.armure.value
          break;
      }

      switch(type) {
        case 'armure':
          const armor = await getArmor(this.actor);

          update[`system.armure.value`] = armor.system.armure.value;
          update['system.jauges'] = armor.system.jauges;
          break;

        case 'ascension':
        case 'guardian':
          update[`system.armure.value`] = data.equipements[type].armure.value;
          update['system.jauges'] = data.equipements[type].jauges;
          break;

        case 'tenueCivile':
          update['system.jauges'] = data.equipements[type].jauges;
          break;
      }

      if(type != 'armure') {
        this._resetArmureCapacites();
      }

      this.actor.update(update);

      if(itemUpdate !== '') {
        const armor = await getArmor(this.actor);

        armor.update({[itemUpdate]:data.armure.value});
      }
    });

    html.find('div.nods img.dice').click(async ev => {
      const data = this.actor;
      const target = $(ev.currentTarget);
      const nbre = +target.data("number");
      const nods = target.data("nods");
      const dices = target.data("dices");
      const wear = data.system.wear;

      if(nbre > 0) {
        const recuperation = data.system.combat.nods[nods].recuperationBonus;
        let update = {}

        switch(nods) {
          case 'soin':
            update['system.sante.value'] = `@{rollTotal}+${data.system.sante.value}`;
            break;

          case 'energie':
            update[`system.equipements.${wear}.energie.value`] = `@{rollTotal}+${data.system.energie.value}`;
            break;

          case 'armure':
            update[`system.equipements.${wear}.armure.value`] = `@{rollTotal}+${data.system.armure.value}`;
            break;
        }
        update[`system.combat.nods.${nods}.value`] = nbre - 1;

        const rNods = new game.knight.RollKnight(this.actor, {
          name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
          dices:dices,
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
      const targetFrom = $(ev.currentTarget);
      const nbre = +targetFrom.data("number");
      const nods = targetFrom.data("nods");
      const dices = targetFrom.data("dices");
      const wear = data.system.wear;

      const targetTo = game.user?.targets?.values()?.next()?.value ?? undefined;
      if(nbre > 0) {
        const recuperation = targetTo ? targetTo.actor.system?.combat?.nods?.[nods]?.recuperationBonus ?? 0 : 0;

        let btn = {}

        /*switch(nods) {
          case 'soin':
            update['system.sante.value'] = `@{rollTotal}+${targetTo.actor.system.sante.value}`;
            break;

          case 'energie':
            update[`system.equipements.${wear}.energie.value`] = `@{rollTotal}+${targetTo.actor.system.energie.value}`;
            break;

          case 'armure':
            update[`system.equipements.${wear}.armure.value`] = `@{rollTotal}+${targetTo.actor.system.armure.value}`;
            break;
        }*/
        const updateNods = {};

        updateNods[`system.combat.nods.${nods}.value`] = nbre - 1;

        await this.actor.update(updateNods);

        if(targetTo) {
          btn = {
            otherBtn:[
              {
                classes:'applyNods full',
                label:game.i18n.localize('KNIGHT.JETS.AppliquerNods'),
                id:targetTo.id,
                tgt:true,
              }
            ]
          }
        }

        const rNods = new game.knight.RollKnight(targetTo.actor, {
          name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
          dices: dices,
          bonus:[recuperation],
          addContent:btn,
          addFlags:{
            type:'nods',
            target:targetTo.id,
            nod:nods,
          }
        }, false);

        await rNods.doRoll();
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

    html.find('div.combat div.wpn a.item-equip').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:true,
          rack:false
        }
      }

      item.update(update);
    });

    html.find('div.combat div.wpn a.item-unequip').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:false,
          rack:true
        }
      }

      item.update(update);
    });

    html.find('div.combat div.wpn a.item-rack').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:false,
          rack:true
        }
      }

      item.update(update);
    });

    html.find('div.combat div.wpn a.item-unrack').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:false,
          rack:false
        }
      }

      item.update(update);
    });

    html.find('div.armure div.capacites img.info').click(ev => {
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

    html.find('div.armure div.special img.info').click(ev => {
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

    html.find('div.armure div.bModule img.info').click(ev => {
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

    html.find('div.options button').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const option = target.data("option");
      const armor = await getArmor(this.actor);
      let update = {};

      if(option === 'resettype') {
        update[`system.capacites.selected.type.type.herald.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.hunter.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.scholar.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.scout.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.soldier.-=selectionne`] = null;
        update[`system.capacites.selected.type.selectionne`] = 0;



        armor.update(update);
      } else if(option === 'resetwarlord') {
        update[`system.capacites.selected.warlord.impulsions.action.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.energie.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.esquive.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.force.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.guerre.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.selectionne`] = 0;

        armor.update(update);
      } else {
        const result = value === true ? false : true;

        this.actor.update({[`system.options.${option}`]:result});
      }
    });

    html.find('div.progression .tableauPG button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const id = target.data("id");
      const evo = target.data("evo");
      const isLongbow = target?.data("longbow") || false;
      const isModule = target?.data("ismodule") || false;
      const niveau = Number(target?.data("niveau")) || 1;
      const result = value ? false : true;

      if(isLongbow) {
        this.actor.items.get(id).update({[`system.evolutions.special.longbow.${evo}.gratuit`]:result});
      } else if(isModule) {
        this.actor.items.get(id).update({[`system.niveau.details.n${niveau}.gratuit`]:result});
      } else {
        this.actor.items.get(id).update({['system.gratuit']:result});
      }
    });

    html.find('div.progression .tableauPG .gloire-create').click(async ev => {
      const dataGloire = this.actor.system.progression.gloire;
      const gloireListe = dataGloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      let addOrder =  foundry.utils.isEmpty(gloireListe)  || isEmpty ? 0 : this._getHighestOrder(gloireListe);
      const gloireAutre = dataGloire.depense?.autre || {};

      if(addOrder === -1) {
        addOrder = Object.keys(gloireListe).length;
      }

      const newData = {
        order:`${addOrder+1}`,
        nom:'',
        cout:'0',
        gratuit:false
      }

      let update = {};
      let length = 0;

      for(let gloire in gloireAutre) {
        const obj = gloireAutre[gloire];

        length = parseInt(gloire);

        update[gloire] = {
          order:obj.order,
          nom:obj.nom,
          cout:obj.cout,
          gratuit:obj.gratuit
        }
      }

      update[length+1] = newData;

      await this.actor.update({[`system.progression.gloire.depense.autre`]:update});
    });

    html.find('div.progression .tableauPG .gloire-delete').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");

      this.actor.update({[`system.progression.gloire.depense.autre.-=${id}`]:null});
    });

    html.find('div.progression .tableauPX .experience-create').click(ev => {
      const getData = this.actor;
      const data = getData.system.progression.experience.depense.liste;
      let i = 0;
      let addOrder =  foundry.utils.isEmpty(data) ? 0 : this._getHighestOrder(data);

      const newData = {};

      for(let e in data) {
        i = parseInt(e);

        newData[e] = data[e];
      }

      newData[i+1] = {
        addOrder:addOrder+1,
        caracteristique:'',
        bonus:0,
        cout:0
      };

      this.actor.update({[`system.progression.experience.depense.liste`]:newData});
    });

    html.find('div.progression .tableauPX .experience-delete').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");

      this.actor.update({[`system.progression.experience.depense.liste.-=${id}`]:null});
    });

    html.find('.appliquer-evolution-armure').click(async ev => {
      const target = $(ev.currentTarget);
      const id = target.data("num");
      const dataArmor = await getArmor(this.actor);
      const listEvolutions = dataArmor.system.evolutions.liste;
      const dataEArmor = listEvolutions[id].data;
      const capacites = listEvolutions[id].capacites;
      let special = listEvolutions[id].special;
      const gloireListe = this.actor.system.progression.gloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
      const filter = [];

      const update = {};

      update[`system.archivage.liste.${listEvolutions[id].value}`] = JSON.stringify(dataArmor.system);

      for (let [key, spec] of Object.entries(special)) {
        const hasDelete = spec?.delete || false;

        if(hasDelete !== false) {
          if(hasDelete.value === true) {

            update[`system.special.selected.-=${key}`] = null;
            filter.push(key);
            delete special[key];
          }
        }
      }

      update[`system.espoir.value`] = dataEArmor.espoir;
      update[`system.armure.base`] = dataArmor.system.armure.base+dataEArmor.armure;
      update[`system.champDeForce.base`] = dataArmor.system.champDeForce.base+dataEArmor.champDeForce;
      update[`system.energie.base`] = dataArmor.system.energie.base+dataEArmor.energie;
      update[`system.energie.value`] = dataArmor.system.espoir.value+dataEArmor.espoir;
      update[`system.capacites.selected`] = capacites;
      update[`system.special.selected`] = special;
      update[`system.evolutions.liste.${id}`] = {
        applied:true,
        addOrder:addOrder+1
      };

      for (let [key, evolutions] of Object.entries(listEvolutions)) {
        const num = +key;

        if(num > id) {
          for(let i = 0;i < filter.length;i++) {
            const hasSpecial = evolutions.special?.[filter[i]] || false;

            if(hasSpecial !== false) {
              update[`system.evolutions.liste.${num}.special.-=${filter[i]}`] = null;
            }
          }
        }
      }

      dataArmor.update(update);
    });

    html.find('.appliquer-evolution-companions').click(ev => {
      const dataCompanions = this.actor.armureData.system.capacites.selected.companions;
      const dataWolfConfig = dataCompanions.wolf.configurations;
      let data = this.actor.armureData.system.evolutions.special.companions.evolutions;
      data['aspects'] = {
        "lion":{
          "chair":{
            "value":0,
            "ae":0
          },
          "bete":{
            "value":0,
            "ae":0
          },
          "machine":{
            "value":0,
            "ae":0
          },
          "dame":{
            "value":0,
            "ae":0
          },
          "masque":{
            "value":0,
            "ae":0
          }
        },
        "wolf":{
          "chair":{
            "value":0,
            "ae":0
          },
          "bete":{
            "value":0,
            "ae":0
          },
          "machine":{
            "value":0,
            "ae":0
          },
          "dame":{
            "value":0,
            "ae":0
          },
          "masque":{
            "value":0,
            "ae":0
          }
        },
        "crow":{
          "chair":{
            "value":0,
            "ae":0
          },
          "bete":{
            "value":0,
            "ae":0
          },
          "machine":{
            "value":0,
            "ae":0
          },
          "dame":{
            "value":0,
            "ae":0
          },
          "masque":{
            "value":0,
            "ae":0
          }
        }
      };

      data['configurations'] = {
        'labor':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.LABOR.Label"),
          value:0
        },
        'medic':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.MEDIC.Label"),
          value:0
        },
        'tech':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.TECH.Label"),
          value:0
        },
        'fighter':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.FIGHTER.Label"),
          value:0
        },
        'recon':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.RECON.Label"),
          value:0
        },
      };

      if(dataWolfConfig.labor.niveau < 3) {
        data['configurations']['labor'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.LABOR.Label"),
          value:0
        }
      }

      if(dataWolfConfig.medic.niveau < 3) {
        data['configurations']['medic'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.MEDIC.Label"),
          value:0
        }
      }

      if(dataWolfConfig.tech.niveau < 3) {
        data['configurations']['tech'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.TECH.Label"),
          value:0
        }
      }

      if(dataWolfConfig.fighter.niveau < 3) {
        data['configurations']['fighter'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.FIGHTER.Label"),
          value:0
        }
      }

      if(dataWolfConfig.recon.niveau < 3) {
        data['configurations']['recon'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.RECON.Label"),
          value:0
        }
      }

      data['lion']['aspects'].restant = data.lion.aspects.value;
      data['lion'].restant = data.lion.ae;

      data['wolf']['aspects'].restant = data.wolf.aspects.value;
      data['wolf'].restant = data.wolf.ae;
      data['wolf'].bonusRestant = data.wolf.bonus;

      data['crow']['aspects'].restant = data.crow.aspects.value;

      const companions = new game.knight.applications.KnightCompanionsDialog({
        title: this.actor.name+" : "+game.i18n.localize("KNIGHT.ITEMS.ARMURE.EVOLUTIONS.EvolutionCompanion"),
        actor:this.actor.id,
        content:{
          data,
          selected:{
            lion:false,
            wolf:false,
            crow:false
          }
        },
        buttons: {
          button1: {
            label: game.i18n.localize("KNIGHT.AUTRE.Valider"),
            icon: `<i class="fas fa-check"></i>`,
            validate:true
          },
          button2: {
            label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
            icon: `<i class="fas fa-times"></i>`,
            validate:false
          }
        }
      }).render(true);
    });

    html.find('.acheter-evolution-longbow').click(async ev => {
      const target = $(ev.currentTarget);
      const id = +target.data("id");
      const value = +target.data("value");
      const dataArmor = await getArmor(this.actor);
      const listEvolutions = dataArmor.system.evolutions.special.longbow;
      const capacites = listEvolutions[id];
      const dataGloire = this.actor.system.progression.gloire;
      const gloireActuel = +dataGloire.actuel;
      const gloireListe = dataGloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);

      if(gloireActuel >= value) {
        let array = {
          description:capacites.description,
          value:value,
          data:dataArmor.system.capacites.selected.longbow,
          addOrder:addOrder+1};

        const update = {};

        update[`system.archivage.longbow.${id}`] = array;
        update[`system.capacites.selected.longbow`] = capacites;
        update[`system.evolutions.special.longbow.${id}`] = {
          applied:true,
          addOrder:addOrder+1
        };

        delete capacites.description;

        dataArmor.update(update);

        this.actor.update({['system.progression.gloire.actuel']:gloireActuel-value});
      }
    });

    html.find('div.rollback a.retour').click(async ev => {
      const target = $(ev.currentTarget);
      const index = target.data("value");
      const type = target.data("type");
      const getDataArmor = await getArmor(this.actor);
      const dataArchives = type === 'liste' ? Object.entries(getDataArmor.system.archivage[type]) : getDataArmor.system.archivage[type];
      const getArchives = dataArchives[index];

      let update = {};
      let erase = {};

      if(type === 'liste') {
        const parse = JSON.parse(getArchives[1]);
        const listEvolutions = parse.evolutions.liste;

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(num >= index) {
            listEvolutions[key].applied = false;
          }
        }

        for (let [key, capacites] of Object.entries(getDataArmor.system.capacites.selected)) {
          erase[`system.capacites.selected.-=${key}`] = null;
        }

        update['system'] = parse;

        for (let [key, archive] of Object.entries(dataArchives)) {
          const num = +key;

          if(num >= index) {
            update[`system.archivage.${type}.-=${archive[0]}`] = null;
          }
        }
        await getDataArmor.update(erase)
        getDataArmor.update(update);
      } else if(type === 'longbow') {
        const listEvolutions = getDataArmor.system.evolutions.special.longbow;
        const getPG = +this.actor.system.progression.gloire.actuel;
        let gloire = 0;

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(evolutions.addOrder >= getArchives.addOrder && evolutions.addOrder !== undefined) {
            update[`system.evolutions.special.longbow.${num}.applied`] = false;
            update[`system.archivage.${type}.-=${num}`] = null;
            gloire += evolutions.value;
          }
        }

        update['system.capacites.selected.longbow'] = getArchives.data;
        getDataArmor.update(update);
        this.actor.update({["system.progression.gloire.actuel"]:gloire+getPG});
      }
    });

    html.find('i.moduleArrowUp').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const niveau = Number(target.data("niveau"))+1;
      const item = this.actor.items.get(key);

      const gloireListe = this.actor.system.progression.gloire.depense.liste;
      const gloireMax = this._getHighestOrder(gloireListe);

      const data = {
        "niveau":{
          "value":niveau,
          "details":{
            [`n${niveau}`]:{
              "addOrder":gloireMax+1
            }
          }
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

    html.find('a.avdvshow').click(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));
      const value = target.data('value') ? false : true;

      item.update({['system.show']:value});
    });

    html.find('button.recover').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const max = target.data("max");
      const list = target?.data("list")?.split("/") || '';

      switch(type) {
        case 'espoir':
        case 'sante':
        case 'armure':
        case 'energie':
          if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
          html.find(`div.${type} input.value`).val(max);
          break;

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
          if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
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
      const header = tgt.parents(".item").length > 0 ? tgt.parents(".item") : tgt.parents(".headerData");
      const index = tgt.parents(".btnChargeur").data('index');
      const raw = header.data('raw');
      const type = raw ? raw : tgt.parents(".btnChargeur").data('type');
      const munition = tgt.parents(".btnChargeur").data('munition');
      const pnj = tgt.parents(".btnChargeur").data('pnj');
      const wpn = tgt.parents(".btnChargeur").data('wpn');
      const item = this.actor.items.get(header.data("item-id"));

      item.system.addMunition(index, type, munition, pnj, wpn);
    });

    html.find('a.btnChargeurMoins').click(async ev => {
      const tgt = $(ev.currentTarget);
      const header = tgt.parents(".item").length > 0 ? tgt.parents(".item") : tgt.parents(".headerData");
      const index = tgt.parents(".btnChargeur").data('index');
      const raw = header.data('raw');
      const type = raw ? raw : tgt.parents(".btnChargeur").data('type');
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
    const gloireListe = this.actor.system.progression.gloire.depense.liste;
    const isEmpty = gloireListe[0]?.isEmpty ?? false;
    const gloireMax = Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
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
      img: getDefaultImg(type),
      system: data
    };
    let update = {};

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];
    const hasCapaciteCompanions = data.actor?.armureData?.system?.capacites?.selected?.companions || false;

    if (type === 'arme') {
      itemData.system = {
        type:header.dataset.subtype,
        tourelle:{
          has:header.dataset.tourelle
        },
        addOrder:gloireMax+1
      };
      delete itemData.system["subtype"];
    }

    if (type === 'avantage' || type === 'inconvenient') {
      const subtype = header.dataset?.subtype || "standard";

      itemData.system = {
        type:subtype
      };
      delete itemData.system["subtype"];
    }

    if(type === 'module' && hasCapaciteCompanions) {
      const hasArmure = actorData.equipements.armure.hasArmor;

      if(!hasArmure) return;

      const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {what:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Ajoutermodule")});
      const askDialogOptions = {classes: ["dialog", "knight", "askdialog"]};

      await new Dialog({
        title: game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Modulelion'),
        content: askContent,
        buttons: {
          button1: {
            label: game.i18n.localize('KNIGHT.AUTRE.Oui'),
            callback: async () => {
              const create = await Item.create(itemData, {parent: this.actor});

              update[`system.isLion`] = true;
              create.update(update);

              return create;
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: game.i18n.localize('KNIGHT.AUTRE.Non'),
            callback: async () => {
              const niveau = itemData.system?.niveau?.value ?? 1;
              const create = await Item.create(itemData, {parent: this.actor});

              for(let i = 1;i <= niveau;i++) {
                update[`system.niveau.details.n${i}.addOrder`] = gloireMax+i;
              }
              create.update(update);

              return create;
            },
            icon: `<i class="fas fa-times"></i>`
          }
        }
      }, askDialogOptions).render(true);
    } else {

      const create = await Item.create(itemData, {parent: this.actor});
      const id = create._id;

      if (type === 'armure') {
        const update = {
          system:{
            equipements:{
              armure:{
                id:id,
                hasArmor:true
              }
            }
          }
        };

        this.actor.update(update);
      }

      if(type === 'module') {
        const niveau = itemData.system?.niveau?.value ?? 1;

        for(let i = 1;i <= niveau;i++) {
          update[`system.niveau.details.n${i}.addOrder`] = gloireMax+i;
        }

        create.update(update);
      }

      return create;
    }
  }

  async _onDropItem(event, data) {
    if ( !this.actor.isOwner ) return false;
    const item = await Item.implementation.fromDropData(data);
    let itemData = item.toObject();

    if($(event.target).parents('div.wpnTourelle').length > 0) {
      if(itemData.type === 'arme' && itemData.system.type === 'distance') itemData.system.tourelle.has = true;
    }

    // Handle item sorting within the same Actor
    if ( this.actor.uuid === item.parent?.uuid ) return this._onSortItem(event, itemData);

    // Create the owned item
    return this._onDropItemCreate(itemData);
  }

  async _onDropItemCreate(itemData) {
    const data = this.actor;
    const actorData = data.system;
    const hasCapaciteCompanions = data?.armureData?.system?.capacites?.selected?.companions || false;
    const gloireListe = actorData.progression.gloire.depense.liste;
    const isEmpty = gloireListe[0]?.isEmpty ?? false;
    const gloireMax = Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
    const hasArmor = await getArmor(this.actor);

    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    if(itemBaseType === 'capacite' ||
    itemBaseType === 'effet') return;

    if(itemBaseType === 'capaciteultime') {
      for (let i of data.items) {
        if(i.type === 'capaciteultime') this.actor.items.get(i._id).delete();
      }
    }

    if(itemBaseType === 'module' && hasCapaciteCompanions) {
      if(!hasArmor) return;

      const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {what:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Ajoutermodule")});
      const askDialogOptions = {classes: ["dialog", "knight", "askdialog"]};

      await new Dialog({
        title: game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Modulelion'),
        content: askContent,
        buttons: {
          button1: {
            label: game.i18n.localize('KNIGHT.AUTRE.Oui'),
            callback: async () => {
              itemData[0].system.isLion = true;

              const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

              return itemCreate;
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: game.i18n.localize('KNIGHT.AUTRE.Non'),
            callback: async () => {
              if(itemData[0].system.niveau.max > 1) {
                let niveauMax = {};

                for(let i = 1;i <= itemData[0].system.niveau.max;i++) {
                  niveauMax[i] = i;
                }

                const askNiveau = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
                  what:game.i18n.localize("KNIGHT.ITEMS.MODULE.QuelNiveau"),
                  select:{
                    has:true,
                    liste:niveauMax
                  }
                });
                const askNiveauDialogOptions = {classes: ["dialog", "knight", "askniveau"]};

                await new Dialog({
                  title: itemData[0].name,
                  content: askNiveau,
                  buttons: {
                    button1: {
                      label: game.i18n.localize('KNIGHT.AUTRE.Valider'),
                      callback: async (dataHtml) => {
                        const selected = dataHtml?.find('.whatSelect')?.val() || 1;
                        const itemSlots = itemData[0].system.slots;
                        const armorSlots = this._getSlotsValue();

                        const sTete = armorSlots.tete-itemSlots.tete;
                        const sTorse = armorSlots.torse-itemSlots.torse;
                        const sBrasGauche = armorSlots.brasGauche-itemSlots.brasGauche;
                        const sBrasDroit = armorSlots.brasDroit-itemSlots.brasDroit;
                        const sJambeGauche = armorSlots.jambeGauche-itemSlots.jambeGauche;
                        const sJambeDroite = armorSlots.jambeDroite-itemSlots.jambeDroite;

                        if(sTete < 0 || sTorse < 0 || sBrasGauche < 0 || sBrasDroit < 0 || sJambeGauche < 0 || sJambeDroite < 0) return;

                        const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
                        let update = {
                          [`system.niveau.value`]:selected,
                          [`system.niveau.details.n${selected}.addOrder`]:gloireMax+1
                        };

                        for(let i = 1;i < selected;i++) {
                          update[`system.niveau.details.n${i}.ignore`] = true;
                        }

                        itemCreate[0].update(update);

                        return itemCreate;
                      },
                      icon: `<i class="fas fa-check"></i>`
                    },
                    button2: {
                      label: game.i18n.localize('KNIGHT.AUTRE.Annuler'),
                      callback: async () => {},
                      icon: `<i class="fas fa-times"></i>`
                    }
                  }
                }, askNiveauDialogOptions).render(true);
              } else {
                const selected = 1;
                const itemSlots = itemData[0].system.slots;
                const armorSlots = this._getSlotsValue();

                const sTete = armorSlots.tete-itemSlots.tete;
                const sTorse = armorSlots.torse-itemSlots.torse;
                const sBrasGauche = armorSlots.brasGauche-itemSlots.brasGauche;
                const sBrasDroit = armorSlots.brasDroit-itemSlots.brasDroit;
                const sJambeGauche = armorSlots.jambeGauche-itemSlots.jambeGauche;
                const sJambeDroite = armorSlots.jambeDroite-itemSlots.jambeDroite;

                if(sTete < 0 || sTorse < 0 || sBrasGauche < 0 || sBrasDroit < 0 || sJambeGauche < 0 || sJambeDroite < 0) return;

                const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
                let update = {
                  [`system.niveau.details.n${selected}.addOrder`]:gloireMax+1
                };

                itemCreate[0].update(update);
              }
            },
            icon: `<i class="fas fa-times"></i>`
          }
        }
      }, askDialogOptions).render(true);
    } else if(itemBaseType === 'module') {

      if(itemData[0].system.niveau.max > 1) {
        let niveauMax = {};

        for(let i = 1;i <= itemData[0].system.niveau.max;i++) {
          niveauMax[i] = i;
        }

        const askNiveau = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
          what:game.i18n.localize("KNIGHT.ITEMS.MODULE.QuelNiveau"),
          select:{
            has:true,
            liste:niveauMax
          }
        });
        const askNiveauDialogOptions = {classes: ["dialog", "knight", "askniveau"]};

        await new Dialog({
          title: itemData[0].name,
          content: askNiveau,
          buttons: {
            button1: {
              label: game.i18n.localize('KNIGHT.AUTRE.Valider'),
              callback: async (dataHtml) => {
                const selected = dataHtml?.find('.whatSelect')?.val() || 1;

                const itemSlots = itemData[0].system.slots;
                const armorSlots = this._getSlotsValue();

                const sTete = armorSlots.tete-itemSlots.tete;
                const sTorse = armorSlots.torse-itemSlots.torse;
                const sBrasGauche = armorSlots.brasGauche-itemSlots.brasGauche;
                const sBrasDroit = armorSlots.brasDroit-itemSlots.brasDroit;
                const sJambeGauche = armorSlots.jambeGauche-itemSlots.jambeGauche;
                const sJambeDroite = armorSlots.jambeDroite-itemSlots.jambeDroite;

                if(sTete < 0 || sTorse < 0 || sBrasGauche < 0 || sBrasDroit < 0 || sJambeGauche < 0 || sJambeDroite < 0) return;

                const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
                let update = {
                  [`system.niveau.value`]:selected,
                  [`system.niveau.details.n${selected}.addOrder`]:gloireMax+1
                };

                for(let i = 1;i < selected;i++) {
                  update[`system.niveau.details.n${i}.ignore`] = true;
                }

                itemCreate[0].update(update);

                return itemCreate;
              },
              icon: `<i class="fas fa-check"></i>`
            },
            button2: {
              label: game.i18n.localize('KNIGHT.AUTRE.Annuler'),
              callback: async () => {},
              icon: `<i class="fas fa-times"></i>`
            }
          }
        }, askNiveauDialogOptions).render(true);
      } else {
        const selected = 1;
        const itemSlots = itemData[0].system.slots;
        const armorSlots = this._getSlotsValue();

        const sTete = armorSlots.tete-itemSlots.tete;
        const sTorse = armorSlots.torse-itemSlots.torse;
        const sBrasGauche = armorSlots.brasGauche-itemSlots.brasGauche;
        const sBrasDroit = armorSlots.brasDroit-itemSlots.brasDroit;
        const sJambeGauche = armorSlots.jambeGauche-itemSlots.jambeGauche;
        const sJambeDroite = armorSlots.jambeDroite-itemSlots.jambeDroite;

        if(sTete < 0 || sTorse < 0 || sBrasGauche < 0 || sBrasDroit < 0 || sJambeGauche < 0 || sJambeDroite < 0) return;

        const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
        let update = {
          [`system.niveau.details.n${selected}.addOrder`]:gloireMax+1
        };

        itemCreate[0].update(update);
      }

    } else if(itemBaseType === 'arme') {
      const isRangedWpn = itemData[0].system.type;

      if(isRangedWpn === 'distance') {
        const cantHaveRangedWpn = actorData.restrictions.noArmeDistance;

        if(cantHaveRangedWpn) return;
      }

      const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
      itemCreate[0].update({[`system.addOrder`]:gloireMax+1});

      return itemCreate;

    } else {

      if(itemBaseType === 'armurelegende' && !hasArmor) return;

      const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

      const itemType = itemCreate[0].type;
      const itemId = itemCreate[0].id;

      if (itemType === 'armure') {
        const actor = this.actor;
        this._resetArmure();

        const wear = actorData.wear;

        if(wear === 'armure') {
          actor.update({['system.wear']:'guardian'});
        }

        const armors = await getAllArmor(actor);

        for(let a of armors) {
          if(a.id !== itemId) await a.delete();
        }

        const generation = itemCreate[0].system.generation;

        if(generation >= 4) itemCreate[0].system.jauges.sante = false;
      }

      if (itemType === 'armurelegende') {
        const oldArmorLegende = this._getArmorLegende();

        if(oldArmorLegende.length > 1) oldArmorLegende[0].delete();

        const update = {};
        update['system.equipements.armure.hasArmorLegende'] = true;

        this.actor.update(update);
      }

      const oldArtId = actorData?.art || 0;

      if (itemType === 'art') {
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

      return itemCreate;
    }
  }

  async _onDropActor(event, data) {
    if ( !this.actor.isOwner ) return false;

    const cls = getDocumentClass(data?.type);
    const document = await cls.fromDropData(data);
    const type = document.type;

    if(type === 'ia') {
      const update = {};

      update['system.equipements.ia.code'] = document.system.code;
      update['system.equipements.ia.surnom'] = document.name;
      update['system.equipements.ia.caractere'] = document.system.caractere;

      const itemsActuels = this.actor.items;
      for (let i of itemsActuels) {
        if(i.type === 'avantage' || i.type === 'inconvenient') {
          if(i.system.type === 'ia') {
            i.delete();
          }
        }
      };

      const items = document.items;

      for (let i of items) {
        await this._onDropItemCreate(i);
      };

      this.actor.update(update);
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

  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    const actor = this.actor;

    /**
     * A hook event that fires when some useful data is dropped onto an ActorSheet.
     * @function dropActorSheetData
     * @memberof hookEvents
     * @param {Actor} actor      The Actor
     * @param {ActorSheet} sheet The ActorSheet application
     * @param {object} data      The data that has been dropped onto the sheet
     */
    const allowed = Hooks.call("dropActorSheetData", actor, this, data);
    if ( allowed === false ) return;

    // Handle different data types
    switch ( data.type ) {
      case "ActiveEffect":
        return this._onDropActiveEffect(event, data);
      case "Actor":
        return this._onDropActor(event, data);
      case "Item":
        return this._onDropItem(event, data);
      case "Folder":
        return this._onDropFolder(event, data);
    }
  }

  async _prepareCharacterItems(actorData, system, items) {
    const eqpData = system.equipements;
    const armorData = eqpData.armure;
    const wear = system.wear;
    const onArmor = wear === 'armure' || wear === 'ascension' ? true : false;

    const armorSpecial = getSpecial(this.actor);
    const armorSpecialRaw = armorSpecial?.raw || [];
    const armorSpecialCustom = armorSpecial?.custom || [];

    const avantage = [];
    const inconvenient = [];
    const avantageIA = [];
    const inconvenientIA = [];
    const motivationMineure = [];
    const langue = [];
    const contact = [];
    const blessures = [];
    const trauma = [];
    const overdrive = [];
    const module = [];
    const modulepassifs = [];
    const moduleErsatz = {};
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
    const armesDistanceModules = [];
    const armesContactEquipee = [];
    const armesDistanceEquipee = [];
    const armesContactRack = [];
    const armesDistanceRack = [];
    const armesContactArmoury = [];
    const armesDistanceArmoury = [];
    const armesTourelles = [];
    const depensePG = [];
    const evolutionsAchetables = [];
    const evolutionsCompanions = [];
    const evolutionsAAcheter = [];

    const carteHeroique = [];
    const capaciteHeroique = [];
    const distinctions = [];

    const capaciteultime = items.find(items => items.type === 'capaciteultime');

    let armureData = {};
    let armureLegendeData = {};
    let longbow = {};
    let art = {};
    let lion = {
      armure:{
        bonus:[0],
        malus:[0]
      },
      champDeForce:{
        bonus:[0],
        malus:[0]
      },
      defense:{
        bonus:[0],
        malus:[0]
      },
      reaction:{
        bonus:[0],
        malus:[0]
      },
      energie:{
        bonus:[0],
        malus:[0]
      },
      initiative:{
        bonus:[0],
        malus:[0]
      },
      armes:{
        contact:[],
        distance:[]
      },
      modules:[],
      bonusDgtsVariable:{
        "contact":[],
        "distance":[]
      },
      bonusViolenceVariable:{
        "contact":[],
        "distance":[]
      },
      bonusDgts:{
        "contact":[],
        "distance":[]
      },
      bonusViolence:{
        "contact":[],
        "distance":[]
      }
    };

    for (let i of items) {
      const data = i.system;

      // ARMURE.
      if (i.type === 'armure') {

        let passiveUltime = undefined;

        if(capaciteultime !== undefined) {
          const dataCapaciteUltime = capaciteultime.system;

          if(dataCapaciteUltime.type == 'passive') passiveUltime = dataCapaciteUltime.passives;
        }

        armureData.label = i.name;

        const armorEvolutions = data.evolutions;

        const totalPG = +system.progression.gloire.total;

        for (let [key, evolution] of Object.entries(armorEvolutions.liste)) {
          const PGEvo = +evolution.value;
          const AlreadyEvo = evolution.applied;

          if(!AlreadyEvo && PGEvo <= totalPG) {
            evolutionsAchetables.push({
              id:key,
              value:PGEvo
            });
          }
        }

        const companionsEvolutions = armorEvolutions?.special?.companions || false;

        if(companionsEvolutions) {
          const valueEvo = +companionsEvolutions.value;
          const nbreEvo = Math.floor(totalPG/+companionsEvolutions.value);
          const nbreEvoApplied = companionsEvolutions?.applied?.value || 0;

          if(nbreEvo > nbreEvoApplied) {
            for(let n = nbreEvoApplied+1; n <= nbreEvo;n++) {
              evolutionsCompanions.push({
                value:valueEvo*n
              });
            }
          }
        }

        const longbowEvolutions = armorEvolutions?.special?.longbow || false;

        if(longbowEvolutions) {
          const PGEvo1 = +longbowEvolutions['1'].value;
          const AlreadyEvo1 = longbowEvolutions['1'].applied;
          const description1 = longbowEvolutions['1'].description;

          if(!AlreadyEvo1) {
            evolutionsAAcheter.push({
              id:1,
              description:description1 ? description1.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo1
            });
          }

          const PGEvo2 = +longbowEvolutions['2'].value;
          const AlreadyEvo2 = longbowEvolutions['2'].applied;
          const description2 = longbowEvolutions['2'].description;

          if(!AlreadyEvo2) {
            evolutionsAAcheter.push({
              id:2,
              description:description2 ? description2.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo2
            });
          }

          const PGEvo3 = +longbowEvolutions['3'].value;
          const AlreadyEvo3 = longbowEvolutions['3'].applied;
          const description3 = longbowEvolutions['3'].description;

          if(!AlreadyEvo3) {
            evolutionsAAcheter.push({
              id:3,
              description:description3 ? description3.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo3
            });
          }

          const PGEvo4 = +longbowEvolutions['4'].value;
          const AlreadyEvo4 = longbowEvolutions['4'].applied;
          const description4 = longbowEvolutions['4'].description;

          if(!AlreadyEvo4) {
            evolutionsAAcheter.push({
              id:4,
              description:description4 ? description4.replaceAll('<p>', '').replaceAll('</p>', '') : '',
              value:PGEvo4
            });
          }
        }

        const capacites = data?.capacites?.selected;
        const specials = data.special.selected;

        for (let [key, special] of Object.entries(specials)) {
          switch(key) {
            case 'contrecoups':
              if(passiveUltime !== undefined) {
                if(passiveUltime.capacites.actif && passiveUltime.special.contrecoups.actif) {
                  data.special.selected[key].unactif = true;
                }
              }
              break;
          }
        }

        if(onArmor) {
          for (let [key, special] of Object.entries(specials)) {
            switch(key) {
              case 'contrecoups':
                system.restrictions.noArmeDistance = !special.armedistance.value ? true : false;
                system.restrictions.maxEffetsArmeContact = {
                  has:special.maxeffets.value,
                  value:special.maxeffets.max,
                };
                break;

              case 'recolteflux':
                if(passiveUltime !== undefined) {
                  if(passiveUltime.capacites.actif && passiveUltime.special.recolteflux.actif) {
                    data.special.selected[key] = {
                      conflit:{
                        base:passiveUltime.special.recolteflux.update.conflit.base,
                        tour:passiveUltime.special.recolteflux.update.conflit.tour,
                      },
                      horsconflit:{
                        base:passiveUltime.special.recolteflux.update.horsconflit.base
                      }
                    }
                  }
                }
                break;
            }
          }

          for (let c in capacites) {
            const dCapacite = capacites[c];

            switch(c) {
              case 'longbow':
                longbow = dCapacite;
                longbow.has = true;
                break;

              case 'borealis':
                armesDistanceEquipee.push({
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

                armesContactEquipee.push({
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
                armesDistanceEquipee.push({
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

                armesContactEquipee.push({
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
                  armesContactEquipee.push({
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
                  armesContactEquipee.push({
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
                  armesDistanceEquipee.push({
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

        armureData = i;
      }

      // MODULE
      if (i.type === 'module') {
        const niveau = data.niveau.value;
        const isLion = data.isLion;
        const itemDataNiveau = data.niveau.actuel;
        const itemBonus = itemDataNiveau?.bonus || {has:false};
        const itemArme = itemDataNiveau?.arme || {has:false};
        const itemOD = itemDataNiveau?.overdrives || {has:false};
        const itemActive = data?.active?.base || false;

        if(itemBonus === false || itemArme === false || itemOD === false) continue;

        const itemErsatz = itemDataNiveau.ersatz;
        const eRogue = itemErsatz?.rogue ?? false;
        const eBard = itemErsatz?.bard ?? false;

        if(isLion) {
          lion.modules.push(i);

          if(data.permanent || itemActive) {
            if(itemBonus.has) {
              const iBArmure = itemBonus.armure;
              const iBCDF = itemBonus.champDeForce;
              const iBEnergie = itemBonus.energie;
              const iBDgts = itemBonus.degats;
              const iBDgtsVariable = iBDgts.variable;
              const iBViolence = itemBonus.violence;
              const iBViolenceVariable = iBViolence.variable;

              if(iBArmure.has) { lion.armure.bonus.push(iBArmure.value); }
              if(iBCDF.has) { lion.champDeForce.bonus.push(iBCDF.value); }
              if(iBEnergie.has) { lion.energie.bonus.push(iBEnergie.value); }
              if(iBDgts.has) {
                if(iBDgtsVariable.has) {
                  const dgtsDicePaliers = [0];
                  const dgtsFixePaliers = [0];

                  for(let i = iBDgtsVariable.min.dice;i <= iBDgtsVariable.max.dice;i++) {
                    dgtsDicePaliers.push(i);
                  }

                  for(let i = iBDgtsVariable.min.fixe;i <= iBDgtsVariable.max.fixe;i++) {
                    dgtsFixePaliers.push(i);
                  }

                  lion.bonusDgtsVariable[iBDgts.type].push({
                    label:i.name,
                    description:data.description,
                    selected:{
                      dice:iBDgtsVariable?.selected?.dice || 0,
                      fixe:iBDgtsVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBDgtsVariable?.selected?.energie.dice || 0,
                        fixe:iBDgtsVariable?.selected?.energie.fixe || 0,
                        paliers:{
                          dice:dgtsDicePaliers,
                          fixe:dgtsFixePaliers
                        }
                      }
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
                  lion.bonusDgts[iBDgts.type].push({
                    label:i.name,
                    description:data.description,
                    dice:iBDgts.dice,
                    fixe:iBDgts.fixe
                  });
                }
              }
              if(iBViolence.has) {
                if(iBViolenceVariable.has) {
                  const violDicePaliers = [0];
                  const violFixePaliers = [0];

                  for(let i = iBViolenceVariable.min.dice;i <= iBViolenceVariable.max.dice;i++) {
                    violDicePaliers.push(i);
                  }

                  for(let i = iBViolenceVariable.min.fixe;i <= iBViolenceVariable.max.fixe;i++) {
                    violFixePaliers.push(i);
                  }

                  lion.bonusViolenceVariable[iBViolence.type].push({
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBViolenceVariable?.selected?.dice || 0,
                      fixe:iBViolenceVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBViolenceVariable?.selected?.energie.dice || 0,
                        fixe:iBViolenceVariable?.selected?.energie.fixe || 0,
                        paliers:{
                          dice:violDicePaliers,
                          fixe:violFixePaliers
                        }
                      }
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
                  lion.bonusViolence[iBViolence.type].push({
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
              const moiduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
              const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) || [];
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
                  type:itemArme.type,
                  portee:itemArme.portee,
                  degats:itemArme.degats,
                  violence:itemArme.violence,
                  effets:{
                    raw:moiduleEffetsRaw,
                    custom:moduleEffetsCustom,
                    liste:moduleEffets.liste
                  }
                }
              }

              const bDefense = moduleEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
              const bReaction = moduleEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; });

              if(bDefense !== undefined) lion.defense.bonus += +bDefense.split(' ')[1];
              if(bReaction !== undefined) lion.reaction.bonus += +bReaction.split(' ')[1];

              if(itemArme.type === 'contact') {
                const bMassive = itemArme.structurelles.raw.find(str => { if(str.includes('massive')) return true; });
                if(bMassive) lion.defense.malus += 1;

                lion.armes.contact.push(moduleWpn);
              }

              if(itemArme.type === 'distance') {
                lion.armes.distance.push(moduleWpn);
              }
            }
          }

        } else {
          if(itemDataNiveau.permanent || itemActive) {

            if(itemBonus.has) {
              const iBDgts = itemBonus.degats;
              const iBDgtsVariable = iBDgts.variable;
              const iBViolence = itemBonus.violence;
              const iBViolenceVariable = iBViolence.variable;

              if(iBDgts.has && onArmor) {
                if(iBDgtsVariable.has) {
                  const dgtsDicePaliers = [0];
                  const dgtsFixePaliers = [0];

                  for(let i = iBDgtsVariable.min.dice;i <= iBDgtsVariable.max.dice;i++) {
                    dgtsDicePaliers.push(i);
                  }

                  for(let i = iBDgtsVariable.min.fixe;i <= iBDgtsVariable.max.fixe;i++) {
                    dgtsFixePaliers.push(i);
                  }

                  moduleBonusDgtsVariable[iBDgts.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBDgtsVariable?.selected?.dice || 0,
                      fixe:iBDgtsVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBDgtsVariable?.selected?.energie.dice || 0,
                        fixe:iBDgtsVariable?.selected?.energie.fixe || 0,
                        paliers:{
                          dice:dgtsDicePaliers,
                          fixe:dgtsFixePaliers
                        }
                      }
                    },
                    min:{
                      dice:iBDgtsVariable.min.dice,
                      fixe:iBDgtsVariable.min.fixe
                    },
                    max:{
                      dice:iBDgtsVariable.max.dice,
                      fixe:iBDgtsVariable.max.fixe
                    },
                    energie:iBDgtsVariable.cout
                  });
                } else {
                  moduleBonusDgts[iBDgts.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    dice:iBDgts.dice,
                    fixe:iBDgts.fixe
                  });
                }
              }
              if(iBViolence.has && onArmor) {
                if(iBViolenceVariable.has) {
                  const violDicePaliers = [0];
                  const violFixePaliers = [0];

                  for(let i = iBViolenceVariable.min.dice;i <= iBViolenceVariable.max.dice;i++) {
                    violDicePaliers.push(i);
                  }

                  for(let i = iBViolenceVariable.min.fixe;i <= iBViolenceVariable.max.fixe;i++) {
                    violFixePaliers.push(i);
                  }

                  moduleBonusViolenceVariable[iBViolence.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBViolenceVariable?.selected?.dice || 0,
                      fixe:iBViolenceVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBViolenceVariable?.selected?.energie?.dice || 0,
                        fixe:iBViolenceVariable?.selected?.energie?.fixe || 0,
                        paliers:{
                          dice:violDicePaliers,
                          fixe:violFixePaliers
                        }
                      }
                    },
                    min:{
                      dice:iBViolenceVariable.min.dice,
                      fixe:iBViolenceVariable.min.fixe
                    },
                    max:{
                      dice:iBViolenceVariable.max.dice,
                      fixe:iBViolenceVariable.max.fixe
                    },
                    energie:iBViolenceVariable.cout
                  });
                } else {
                  moduleBonusViolence[iBViolence.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    dice:iBViolence.dice,
                    fixe:iBViolence.fixe
                  });
                }
              }
            }

            if(itemArme.has && onArmor) {
              const moduleArmeType = itemArme.type;
              const moduleEffets = itemArme.effets;
              const moiduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
              const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) || [];
              const moduleEffetsFinal = {
                raw:[...new Set(moiduleEffetsRaw)],
                custom:moduleEffetsCustom,
                liste:moduleEffets.liste,
                chargeur:moduleEffets?.chargeur,
              };

              const dataMunitions = itemArme?.optionsmunitions || {has:false};

              let degats = itemArme.degats;
              let violence = itemArme.violence;

              if(dataMunitions.has) {
                let actuel = dataMunitions.actuel;

                if(actuel === undefined) {
                  dataMunitions.actuel = "0";
                  actuel = "1";
                }

                for (let i = 0; i <= actuel; i++) {

                  const raw = dataMunitions.liste[i].raw.concat(armorSpecialRaw);
                  const custom = dataMunitions.liste[i].custom.concat(armorSpecialCustom);

                  data.niveau.actuel.arme.optionsmunitions.liste[i].raw = [...new Set(raw)];
                  data.niveau.actuel.arme.optionsmunitions.liste[i].custom = custom;
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
                  effets:moduleEffetsFinal,
                  niveau:niveau,
                }
              };

              if(moduleArmeType === 'contact') {
                moduleWpn.system.structurelles = itemArme.structurelles;
                moduleWpn.system.ornementales = itemArme.ornementales;
              } else {
                moduleWpn.system.distance = itemArme.distance;
              }

              if(moduleArmeType === 'contact') { armesContactEquipee.push(moduleWpn); }

              if(itemArme.type === 'distance') {
                armesDistanceModules.push(moduleWpn);
                armesDistanceEquipee.push(moduleWpn);
              }
            }

            if(eRogue.has && onArmor) {
              moduleErsatz.rogue = eRogue;
              moduleErsatz.rogue.permanent = data.permanent;
              moduleErsatz.rogue.label = i.name;
              moduleErsatz.rogue._id = i._id;
              moduleErsatz.rogue.description = data.description;
            }

            if(eBard.has && onArmor) {
              moduleErsatz.bard = eBard;
              moduleErsatz.bard.permanent = data.permanent;
              moduleErsatz.bard.label = i.name;
              moduleErsatz.bard._id = i._id;
              moduleErsatz.bard.description = data.description;
            }
          }

          if(itemOD.has) overdrive.push(i);
          else module.push(i);
        }
      }

      // AVANTAGE.
      if (i.type === 'avantage') {
        if(data.type === 'standard') avantage.push(i);
        else if(data.type === 'ia') avantageIA.push(i);
      }

      // INCONVENIENT.
      if (i.type === 'inconvenient') {
        if(data.type === 'standard') inconvenient.push(i);
        else if(data.type === 'ia') inconvenientIA.push(i);
      }

      // MOTIVATION MINEURE
      if (i.type === 'motivationMineure') {
        motivationMineure.push(i);
      }

      // CAPACITE HEROIQUE
      if (i.type === 'capaciteheroique') {
        capaciteHeroique.push(i);
      }

      // CARTE HEROIQUE
      if (i.type === 'carteheroique') {
        carteHeroique.push(i);
      }

      // LANGUE
      if (i.type === 'langue') {
        langue.push(i);
      }

      // CONTACT
      if (i.type === 'contact') {
        contact.push(i);
      }

      // BLESSURE
      if (i.type === 'blessure') {
        const isSoigne = [data.soigne.implant, data.soigne.reconstruction].includes(true);

        if(isSoigne) { i.name += ` (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`; }
        blessures.push(i);
      }

      // TRAUMA
      if (i.type === 'trauma') trauma.push(i);

      // ARMES
      if (i.type === 'arme') {
        const type = data.type;
        const tourelle = data.tourelle;

        const armeRaw = data.effets.raw.concat(armorSpecialRaw);
        const armeCustom = data.effets.custom.concat(armorSpecialCustom);

        const armeE2Raw = data.effets2mains.raw.concat(armorSpecialRaw);
        const armeE2Custom = data.effets2mains.custom.concat(armorSpecialCustom);

        data.effets.raw = [...new Set(armeRaw)];
        data.effets.custom = armeCustom;

        data.effets2mains.raw = [...new Set(armeE2Raw)];
        data.effets2mains.custom = armeE2Custom;

        const dataMunitions = data.optionsmunitions,
              hasDM = dataMunitions?.has || false,
              actuelDM = Number(dataMunitions?.actuel || 0);

        if(hasDM && actuelDM != 0) {
          for (let i = 0; i <= dataMunitions.actuel; i++) {

            const raw = dataMunitions.liste[i].raw.concat(armorSpecialRaw);
            const custom = dataMunitions.liste[i].custom.concat(armorSpecialCustom);

            data.optionsmunitions.liste[i].raw = [...new Set(raw)];
            data.optionsmunitions.liste[i].custom = custom;
          }
        }

        const optionsmunitions = data.optionsmunitions.has;
        const munition = data.optionsmunitions.actuel;

        if(type === 'distance' && optionsmunitions === true) {
          data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
          data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

          data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
          data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;
        }

        if(wear !== 'ascension' && !tourelle.has) {
          const equipped = data?.equipped || false;
          const rack = data?.rack || false;

          const options2mains = data.options2mains.has;
          const main = data.options2mains.actuel;

          if(type === 'contact' && options2mains === true) {
            data.degats.dice = data?.options2mains?.[main]?.degats?.dice || 0;
            data.degats.fixe = data?.options2mains?.[main]?.degats?.fixe || 0;

            data.violence.dice = data?.options2mains?.[main]?.violence?.dice || 0;
            data.violence.fixe = data?.options2mains?.[main]?.violence?.fixe || 0;
          }

          if (type === 'contact' && equipped === false && rack === false) { armesContactArmoury.push(i); }
          if (type === 'contact' && equipped === false && rack === true) { armesContactRack.push(i); }
          else if (type === 'contact' && equipped === true) { armesContactEquipee.push(i); }
          else if (type === 'distance' && equipped === false && rack === false) { armesDistanceArmoury.push(i); }
          else if (type === 'distance' && equipped === false && rack === true) { armesDistanceRack.push(i); }
          else if (type === 'distance' && equipped === true) { armesDistanceEquipee.push(i); }
        }

        if(tourelle.has && type === 'distance') {
          armesTourelles.push(i);
        }
      }

      // ARMURE DE LEGENDE
      if (i.type === 'armurelegende') {
        armureLegendeData = i;

        const armorCapacites = data.capacites.selected;

        for (let [key, capacite] of Object.entries(armorCapacites)) {
          switch(key) {
            case "vision":
              if(armorData.capacites.vision.energie < capacite.energie.min) armorData.capacites.vision.energie = capacite.energie.min;
              break;
          }
        }
      }

      // ART
      if (i.type === 'art') {
        art = i;
      }

      // DISTINCTIONS
      if(i.type === 'distinction') distinctions.push(i);
    }

    for(let i = 0;i < armesContactEquipee.length;i++) {
      armesContactEquipee[i].system.degats.module = {};
      armesContactEquipee[i].system.degats.module.fixe = moduleBonusDgts.contact;
      armesContactEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.contact;

      armesContactEquipee[i].system.violence.module = {};
      armesContactEquipee[i].system.violence.module.fixe = moduleBonusViolence.contact;
      armesContactEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.contact;
    };

    for(let i = 0;i < armesDistanceEquipee.length;i++) {
      armesDistanceEquipee[i].system.degats.module = {};
      armesDistanceEquipee[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistanceEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistanceEquipee[i].system.violence.module = {};
      armesDistanceEquipee[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistanceEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    };

    for (let [key, grenade] of Object.entries(system.combat.grenades.liste)){
      const effetsRaw = grenade.effets.raw.concat(armorSpecialRaw);
      const effetsCustom = grenade.effets.custom.concat(armorSpecialCustom);

      system.combat.grenades.liste[key].effets.raw = [...new Set(effetsRaw)];
      system.combat.grenades.liste[key].effets.custom = [...new Set(effetsCustom)];
    };

    for (let [kAI, armesimprovisees] of Object.entries(system.combat.armesimprovisees.liste)) {
      for (let [key, arme] of Object.entries(armesimprovisees.liste)) {
        arme.effets.raw = armorSpecialRaw;
        arme.effets.custom = armorSpecialCustom;
      }
    };

    const hasCompanions = armureData?.system?.capacites?.selected?.companions || false;

    if(hasCompanions) {
      const lionCDF = +armureData.system.capacites.selected.companions.lion.champDeForce.base;
      const lionArmure = +armureData.system.capacites.selected.companions.lion.armure.base;
      const lionDefense = +armureData.system.capacites.selected.companions.lion.defense.base;
      const lionReaction = +armureData.system.capacites.selected.companions.lion.reaction.base;
      const lionEnergie = +armureData.system.capacites.selected.companions.lion.energie.base;
      const lionInitiativeB = +armureData.system.capacites.selected.companions.lion.initiative.value;

      armureData.system.capacites.selected.companions.lion.champDeForce.value = lionCDF+lion.champDeForce.bonus.reduce(sum)-lion.champDeForce.malus.reduce(sum);
      armureData.system.capacites.selected.companions.lion.champDeForce.bonus = lion.champDeForce.bonus;
      armureData.system.capacites.selected.companions.lion.champDeForce.malus = lion.champDeForce.malus;

      armureData.system.capacites.selected.companions.lion.armure.value = lionArmure+lion.armure.bonus.reduce(sum)-lion.armure.malus.reduce(sum);
      armureData.system.capacites.selected.companions.lion.armure.bonus = lion.armure.bonus;
      armureData.system.capacites.selected.companions.lion.armure.malus = lion.armure.malus;

      armureData.system.capacites.selected.companions.lion.defense.value = lionDefense+lion.defense.bonus.reduce(sum)-lion.defense.malus.reduce(sum);
      armureData.system.capacites.selected.companions.lion.defense.bonus = lion.defense.bonus;
      armureData.system.capacites.selected.companions.lion.defense.malus = lion.defense.malus;

      armureData.system.capacites.selected.companions.lion.reaction.value = lionReaction+lion.reaction.bonus.reduce(sum)-lion.reaction.malus.reduce(sum);
      armureData.system.capacites.selected.companions.lion.reaction.bonus = lion.reaction.bonus;
      armureData.system.capacites.selected.companions.lion.reaction.malus = lion.reaction.malus;

      armureData.system.capacites.selected.companions.lion.energie.value = lionEnergie+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
      armureData.system.capacites.selected.companions.lion.energie.bonus = lion.energie.bonus;
      armureData.system.capacites.selected.companions.lion.energie.malus = lion.energie.malus;

      armureData.system.capacites.selected.companions.lion.initiative.total = lionInitiativeB+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
      armureData.system.capacites.selected.companions.lion.initiative.bonus = lion.initiative.bonus;
      armureData.system.capacites.selected.companions.lion.initiative.malus = lion.initiative.malus;

      armureData.system.capacites.selected.companions.lion.bonusDgtsVariable = lion.bonusDgtsVariable;
      armureData.system.capacites.selected.companions.lion.bonusDgts = lion.bonusDgts;

      armureData.system.capacites.selected.companions.lion.bonusViolenceVariable = lion.bonusViolenceVariable;
      armureData.system.capacites.selected.companions.lion.bonusViolence = lion.bonusViolence;

      armureData.system.capacites.selected.companions.lion.modules = [];
      armureData.system.capacites.selected.companions.lion.modules = lion.modules;
    };

    if(capaciteultime) {
      const CUData = capaciteultime.system;

      if(CUData.type === 'active') {
        const CUAData = CUData.actives;

        if(CUAData.reaction > 0 || CUAData.defense > 0 ||
          CUAData.recuperation.PA || CUAData.recuperation.PS ||
          CUAData.recuperation.PE || (CUAData.jet.actif && CUAData.jet.isfixe) ||
          (CUAData.degats.actif && CUAData.degats.isfixe) ||
          (CUAData.violence.actif && CUAData.violence.isfixe) ||
          CUAData.effets.actif) CUData.actives.isActivable = true;
        else CUData.actives.isActivable = false;
      }
    }

    const hasContrecoups = armureData?.system?.special?.selected?.contrecoups;
    const hasWpnRestrictions = hasContrecoups !== undefined && hasContrecoups.armedistance.value === false ? true : false;
    const wpnWithRestrictions = hasWpnRestrictions ? armesDistanceModules : [];

    actorData.carteHeroique = carteHeroique;
    actorData.capaciteHeroique = capaciteHeroique;
    actorData.evolutionsCompanions = evolutionsCompanions;
    actorData.evolutionsAchetables = evolutionsAchetables;
    actorData.evolutionsAAcheter = evolutionsAAcheter;
    actorData.armureData = armureData;
    actorData.armureLegendeData = armureLegendeData;
    actorData.modules = module;
    actorData.modulespassifs = modulepassifs;
    actorData.moduleErsatz = moduleErsatz;
    actorData.moduleOD = overdrive;
    actorData.avantages = avantage;
    actorData.inconvenient = inconvenient;
    actorData.avantagesIA = avantageIA;
    actorData.inconvenientIA = inconvenientIA;
    actorData.motivationMineure = motivationMineure;
    actorData.langue = langue;
    actorData.contact = contact;
    actorData.blessure = blessures;
    actorData.trauma = trauma;
    actorData.longbow = longbow;
    actorData.armesContactEquipee = armesContactEquipee;
    actorData.armesContactRack = armesContactRack;
    actorData.armesContactArmoury = armesContactArmoury;
    actorData.cannotUseDistance = hasWpnRestrictions ? true : false;
    actorData.armesDistanceEquipee = hasWpnRestrictions ? wpnWithRestrictions : armesDistanceEquipee;
    actorData.armesDistanceRack = hasWpnRestrictions ? [] :armesDistanceRack;
    actorData.armesDistanceArmoury = hasWpnRestrictions ? [] :armesDistanceArmoury;
    actorData.armesTourelles = armesTourelles;
    actorData.art = art;
    actorData.distinctions = distinctions;
    actorData.capaciteultime = capaciteultime;
  }

  async _prepareCapacitesParameters(actor, system) {
    const remplaceEnergie = actor?.armureData?.system?.espoir?.remplaceEnergie ?? false;
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
      armesContactEquipee, armesDistanceEquipee,
      armesContactRack, armesDistanceRack,
      armesContactArmoury, armesDistanceArmoury,
      armesTourelles } = actor;
    const grenades = system.combat.grenades.liste;
    const { armureData, armureLegendeData } = actor;
    const capacites = armureData?.system?.capacites?.selected ?? {};
    const special = armureData?.system?.special?.selected ?? {};
    const legend = armureLegendeData?.capacites?.selected ?? {};
    const listToVerify = {...capacites, ...special};
    const labels = getAllEffects();
    const wpnModules = [
      {data:modules, key:'modules'},
      {data:armesContactEquipee, key:'armes'},
      {data:armesDistanceEquipee, key:'armes'},
      {data:armesContactRack, key:'armes'},
      {data:armesDistanceRack, key:'armes'},
      {data:armesContactArmoury, key:'armes'},
      {data:armesDistanceArmoury, key:'armes'},
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
      { name: 'oriflamme', path: ['effets'], simple:true },
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

        if(base.key === 'armes' && optMun) {
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
      const root = path.split('.').reduce((obj, key) => obj?.[key], capacite)
      const data = root;
      if (!data) return;
      const effets = simple ? data : data.effets;

      if(effets !== undefined) effets.liste = listEffects(effets.raw, effets.custom, labels, effets?.chargeur);
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

  _prepareOverdrives(actor, system) {
    const aspects = system.aspects;
    let result = {};

    for (const aspect in aspects) {
        const caracteristiques = aspects[aspect].caracteristiques;

        for (const caracteristique in caracteristiques) {
            const value = caracteristiques[caracteristique].overdrive.value;
            let liste = {};

            for (let i = 1; i <= value; i++) {
                const string = `KNIGHT.ASPECTS.${aspect.toUpperCase()}.CARACTERISTIQUES.${caracteristique.toUpperCase()}.OD${i}`;
                const translation = game.i18n.localize(string);

                if (translation === string) continue;

                liste[`OD${i}`] = {
                    value: i,
                    description: translation,
                };
            }

            if (Object.keys(liste).length > 0) {
                result = {
                    ...result,
                    [aspect]: {
                        ...result[aspect],
                        [caracteristique]: {
                            titre: game.i18n.localize(`KNIGHT.ASPECTS.${aspect.toUpperCase()}.CARACTERISTIQUES.${caracteristique.toUpperCase()}.OD`),
                            liste,
                        },
                    },
                };
            }
        }
    }

    actor.overdrives = result;
  }

  _maxValue(system) {
    const list = [`sante`, `espoir`];

    for(let i = 0;i < list.length;i++) {
      const dataBase = system[list[i]];

      if(dataBase.value > dataBase.max) { dataBase.value = dataBase.max; }
    }
  }

  async _depensePE(label, depense, autosubstract=true, forceEspoir=false, flux=false, capacite=true) {
    const data = this.actor;
    const armor = await getArmor(data);
    const dataArmor = armor.system;
    const remplaceEnergie = dataArmor.espoir.remplaceEnergie || false;

    const type = remplaceEnergie === true || forceEspoir === true ? 'espoir' : 'energie';
    const hasFlux = Number(data.system.jauges.flux);
    const fluxActuel = Number(data.system.flux.value);
    const actuel = remplaceEnergie === true || forceEspoir === true ? Number(data.system.espoir.value) : Number(data.system.energie.value);
    const substract = actuel-depense;
    const hasJauge = data.system.jauges[type];

    if(!hasJauge) return false;

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

        if(type !== 'espoir') update[`system.equipements.${this.actor.system.wear}.${type}.value`] = substract;

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
    const armor = await getArmor(data);
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

  async _updatePA(update) {
    const add = +update;
    const wear = this.object.system.wear;

    let itemUpdate = ``;
    let maj = {}

    switch(wear) {
      case 'armure':
        const armor = await getArmor(this.actor);

        itemUpdate = `system.armure.value`;

        armor.update({[itemUpdate]:add});
        break;

      case 'ascension':
      case 'guardian':
        maj = {
          'system':{
            'equipements':{
              [wear]:{
                'value':add
              }
            }
          }
        };

        this.actor.update(maj);
        break;
    }
  }

  async _resetArmureCapacites() {
    const armure = await getArmor(this.actor);

    if(!armure) return;

    const armorCapacites = armure.system.capacites.selected;
    const capacites = {
      system:{
        equipements:{
          armure:{
            capacites:{
              ascension:{},
              borealis:{},
              goliath:{},
              morph:{},
            }
          }
        },
        combos:{
          interdits:{
            aspects:{},
            caracteristiques:{}
          },
          bonus:{
            aspects:{},
            caracteristiques:{}
          }
        }
      }
    }

    const capaciteToUpdate = {};

    for(const arCapacite in armorCapacites) {
      switch(arCapacite) {
        case "ascension":
          if(!armorCapacites.ascension.sansarmure.acces) {
            capaciteToUpdate[`system.capacites.selected.ascension.active`] = false;
            capaciteToUpdate[`system.capacites.selected.ascension.ascensionId`] = 0;
            capaciteToUpdate[`system.capacites.selected.ascension.depense`] = 0;

            const actor = game.actors.get(armorCapacites.ascension.ascensionId);

            if(actor !== undefined) await actor.delete();
          }
          break;
        case "borealis":
          capaciteToUpdate[`system.capacites.selected.borealis.active.support`] = false;
          capaciteToUpdate[`system.capacites.selected.borealis.active.utilitaire`] = false;
          break;
        case "changeling":
          capaciteToUpdate[`system.capacites.selected.changeling.active.personnel`] = false;
          capaciteToUpdate[`system.capacites.selected.changeling.active.etendue`] = false;
          break;
        case "companions":
          const idLion = armorCapacites.companions.lion?.id || false;
          const idWolf = armorCapacites.companions.wolf?.id || false;
          const idCrow = armorCapacites.companions.crow?.id || false;
          let id = 0;

          if(idLion !== false) id = idLion;
          if(idWolf !== false) id = {id1:idWolf.id1, id2:idWolf.id2, id3:idWolf.id3};
          if(idCrow !== false) id = idCrow;

          if(idLion !== false || idCrow !== false) {
            const actorCompanion = game?.actors?.get(id) || false;

            if(actorCompanion !== false) {
              this._gainPE(actorCompanion.system.energie.value, true);

              await actorCompanion.delete();
            }
          }

          if(idWolf !== false) {
            const actor1Companion = game?.actors?.get(id.id1) || false;
            const actor2Companion = game?.actors?.get(id.id2) || false;
            const actor3Companion = game?.actors?.get(id.id3) || false;

            if(actor1Companion !== false) {
              this._gainPE(actor1Companion.system.energie.value, true);

              await actor1Companion.delete();
            }

            if(actor2Companion !== false) {
              await actor2Companion.delete();
            }

            if(actor3Companion !== false) {
              await actor3Companion.delete();
            }
          }

          armure.update({[`system.capacites.selected.companions.active`]:{
            'base':false,
            'lion':false,
            'wolf':false,
            'crow':false
          }});
          break;
        case "shrine":
          capaciteToUpdate[`system.capacites.selected.shrine.active.base`] = false;
          capaciteToUpdate[`system.capacites.selected.shrine.active.personnel`] = false;
          capaciteToUpdate[`system.capacites.selected.shrine.active.distance`] = false;
          capaciteToUpdate[`system.capacites.selected.shrine.active.personnel6`] = false;
          capaciteToUpdate[`system.capacites.selected.shrine.active.distance6`] = false;
          break;
        case "ghost":
          capaciteToUpdate[`system.capacites.selected.ghost.active.conflit`] = false;
          capaciteToUpdate[`system.capacites.selected.ghost.active.horsconflit`] = false;
          break;
        case "goliath":
          capaciteToUpdate[`system.capacites.selected.goliath.active`] = false;
          break;
        case "illumination":
          capaciteToUpdate[`system.capacites.selected.illumination.active.beacon`] = false;
          capaciteToUpdate[`system.capacites.selected.illumination.active.blaze`] = false;
          capaciteToUpdate[`system.capacites.selected.illumination.active.lantern`] = false;
          capaciteToUpdate[`system.capacites.selected.illumination.active.lighthouse`] = false;
          capaciteToUpdate[`system.capacites.selected.illumination.active.projector`] = false;
          capaciteToUpdate[`system.capacites.selected.illumination.active.torch`] = false;
          break;
        case "morph":
          capaciteToUpdate[`system.capacites.selected.morph.active.morph`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.poly.fait`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.fait`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.vol`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.phase`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.etirement`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.polymorphie`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.polymorphieLame`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.polymorphieGriffe`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.choisi.polymorphieCanon`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.active.polymorphieCanon`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.active.polymorphieGriffe`] = false;
          capaciteToUpdate[`system.capacites.selected.morph.active.polymorphieLame`] = false;
          break;
        case "puppet":
          capaciteToUpdate[`system.capacites.selected.puppet.active`] = false;
          break;
        case "discord":
          capaciteToUpdate[`system.capacites.selected.discord.active.tour`] = false;
          capaciteToUpdate[`system.capacites.selected.discord.active.scene`] = false;
          break;
        case "rage":
          capaciteToUpdate[`system.capacites.selected.rage.active`] = false;
          capaciteToUpdate[`system.capacites.selected.rage.niveau.colere`] = false;
          capaciteToUpdate[`system.capacites.selected.rage.niveau.rage`] = false;
          capaciteToUpdate[`system.capacites.selected.rage.niveau.fureur`] = false;
          break;
        case "record":
          capaciteToUpdate[`system.capacites.selected.record.active`] = false;
          break;
        case "totem":
          capaciteToUpdate[`system.capacites.selected.totem.active`] = false;
          break;
        case "warlord":
          capaciteToUpdate[`system.capacites.selected.warlord.active.action.allie`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.action.porteur`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.force.allie`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.force.porteur`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.esquive.allie`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.esquive.porteur`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.guerre.allie`] = false;
          capaciteToUpdate[`system.capacites.selected.warlord.active.guerre.porteur`] = false;
          break;
        case "watchtower":
          capaciteToUpdate[`system.capacites.selected.watchtower.active`] = false;
          break;
        case "nanoc":
          capaciteToUpdate[`system.capacites.selected.nanoc.active.base`] = false;
          capaciteToUpdate[`system.capacites.selected.nanoc.active.detaille`] = false;
          capaciteToUpdate[`system.capacites.selected.nanoc.active.mecanique`] = false;
          break;
        case "type":
          capaciteToUpdate[`system.capacites.selected.type.type.soldier.conflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.soldier.horsconflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.hunter.conflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.hunter.horsconflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.scholar.conflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.scholar.horsconflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.herald.conflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.herald.horsconflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.scout.conflit`] = false;
          capaciteToUpdate[`system.capacites.selected.type.type.scout.horsconflit`] = false;
          break;
      }
    }

    armure.update(capaciteToUpdate);
    capacites.system.equipements.armure.capacites.ascension.energie = 0;
    capacites.system.equipements.armure.capacites.borealis.allie = 0;
    capacites.system.equipements.armure.capacites.borealis.allie = 0;
    capacites.system.equipements.armure.capacites.goliath.metre = 0;
    capacites.system.equipements.armure.capacites.morph.nbre = 0;
    capacites.system.combos.interdits.caracteristiques.rage = [];
    capacites.system.combos.bonus.caracteristiques.rage = [];

    this.actor.update(capacites);
  }

  async _resetArmureModules() {
    const listModules = this.actor.modules;

    for (let i = 0;i < listModules.length;i++){
      const dataModules = listModules[i];
      const getData = this.actor.items.get(dataModules._id);

      if(getData.system.id !== '') {
        const actor = game?.actors?.get(getData.system.id) || false;

        if(actor !== false) await actor.delete();
      }

      getData.update({[`system`]:{
        'active':{
          'pnj':false,
          'pnjName':'',
          'base':false
        },
        'id':''
      }});
    }
  }

  async _resetArmure() {
    await this._resetArmureCapacites();
    await this._resetArmureModules();
  }

  async _getSlotsValue() {
    const hasArmor = await getArmor(this.actor);
    const sArmure = hasArmor.system.slots;
    const sUtilise = this.actor.system.equipements.armure.slots;

    const result = !hasArmor ? undefined : {
      tete: sArmure.tete.value-sUtilise.tete,
      torse: sArmure.torse.value-sUtilise.torse,
      brasGauche: sArmure.brasGauche.value-sUtilise.brasGauche,
      brasDroit: sArmure.brasDroit.value-sUtilise.brasDroit,
      jambeGauche: sArmure.jambeGauche.value-sUtilise.jambeGauche,
      jambeDroite: sArmure.jambeDroite.value-sUtilise.jambeDroite
    };

    return result;
  }

  _getArmorLegende() {
    const data = this.actor;
    const armor = data.items.filter((a) => a.type === 'armurelegende');

    return armor;
  }

  _getHighestOrder(myObject) {
    let highestOrder = -1;

    for (const key in myObject) {
      if (myObject.hasOwnProperty(key) && myObject[key].order !== undefined) {
        if (myObject[key].order > highestOrder) {
          highestOrder = myObject[key].order;
        }
      }
    }

    return highestOrder;
  };
}
