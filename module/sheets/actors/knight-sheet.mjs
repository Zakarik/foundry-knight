import {
  getModStyle,
  listEffects,
  getSpecial,
  SortByName,
  SortByAddOrder,
  sum
} from "../../helpers/common.mjs";

import { KnightRollDialog } from "../../dialog/roll-dialog.mjs";

/**
 * @extends {ActorSheet}
 */
export class KnightSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "actor"],
      template: "systems/knight/templates/actors/knight-sheet.html",
      width: 900,
      height: 600,
      tabs: [
        {navSelector: ".sheet-tabs", contentSelector: ".body", initial: "personnage"}
      ],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    //EGIDE
    const dataJauges = context.data.system.jauges;
    const hasEgide = game.settings.get("knight", "acces-egide");

    if(hasEgide) {
        dataJauges.egide = true;
    } else {
        dataJauges.egide = false;
    }

    this._prepareCharacterItems(context);

    context.actor.caracteristiques = {};

    for (let [key, aspect] of Object.entries(context.data.system.aspects)){
      const traAspect = game.i18n.localize(CONFIG.KNIGHT.aspects[key]);
      const sCompanions = context.actor.armureData?.system?.capacites?.selected?.companions || false;
      const sCompanionsLegende = context.actor.armureLegendeData?.system?.capacites?.selected?.companions || false;

      aspect.label = traAspect;

      if(sCompanions != false) {
        const sCAE = sCompanions.lion.aspects[key].ae;
        const sCWAE = sCompanions.wolf.aspects[key].ae;
        const mineur = game.i18n.localize('KNIGHT.AUTRE.Mineur');
        const majeur = game.i18n.localize('KNIGHT.AUTRE.Majeur');

        sCompanions.lion.aspects[key].label = traAspect;
        sCompanions.wolf.aspects[key].label = traAspect;
        sCompanions.crow.aspects[key].label = traAspect;

        if(sCAE > 5) {
          sCompanions.lion.aspects[key].labelAE = majeur;
        } else {
          sCompanions.lion.aspects[key].labelAE = mineur;
        }

        if(sCWAE > 5) {
          sCompanions.wolf.aspects[key].labelAE = majeur;
        } else {
          sCompanions.wolf.aspects[key].labelAE = mineur;
        }
      }

      if(sCompanionsLegende != false) {
        const sCAE = sCompanionsLegende.lion.aspects[key].ae;
        const sCWAE = sCompanionsLegende.wolf.aspects[key].ae;
        const mineur = game.i18n.localize('KNIGHT.AUTRE.Mineur');
        const majeur = game.i18n.localize('KNIGHT.AUTRE.Majeur');

        sCompanionsLegende.lion.aspects[key].label = traAspect;
        sCompanionsLegende.wolf.aspects[key].label = traAspect;
        sCompanionsLegende.crow.aspects[key].label = traAspect;

        if(sCAE > 5) {
          sCompanionsLegende.lion.aspects[key].labelAE = majeur;
        } else {
          sCompanionsLegende.lion.aspects[key].labelAE = mineur;
        }

        if(sCWAE > 5) {
          sCompanionsLegende.wolf.aspects[key].labelAE = majeur;
        } else {
          sCompanionsLegende.wolf.aspects[key].labelAE = mineur;
        }
      }

      for (let [keyCar, carac] of Object.entries(aspect.caracteristiques)){
        carac.label = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[keyCar]);

        context.actor.caracteristiques[keyCar] = {};
        context.actor.caracteristiques[keyCar].value = carac?.value || 0;
        context.actor.caracteristiques[keyCar].od = carac?.overdrive?.value || 0;

        this._prepareOverdrives(key, keyCar, carac, context);
      }
    }

    for (let [key, nods] of Object.entries(context.data.system.combat.nods)){
      nods.label = game.i18n.localize(CONFIG.KNIGHT.nods[key]);
    }

    for (let [key, grenades] of Object.entries(context.data.system.combat.grenades.liste)){
      const raw = grenades.effets.raw;
      const custom = grenades.effets.custom;
      const labels = CONFIG.KNIGHT.effets;

      grenades.liste = listEffects(raw, custom, labels);
    }

    this._prepareCapacitesTranslations(context);
    this._prepareSpecialTranslations(context);
    this._prepareModuleTranslation(context);
    this._prepareCapacitesParameters(context);
    this._prepareWpnEffets(context);
    this._maxValue(context);

    context.systemData = context.data.system;

    return context;
  }

  /**
     * Return a light sheet if in "limited" state
     * @override
     */
   get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/knight/templates/limited-sheet.html";
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

    html.find('.header .far').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square");
      $(ev.currentTarget).toggleClass("fa-minus-square");
      $(ev.currentTarget).parents(".header").siblings().toggle();
    });

    html.find('header .far').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square");
      $(ev.currentTarget).toggleClass("fa-minus-square");
      $(ev.currentTarget).parents(".summary").siblings().toggle();
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

    html.find('.extendButton').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square fa-minus-square");

      if($(ev.currentTarget).hasClass("fa-minus-square")) {
        $(ev.currentTarget).parents(".summary").siblings().css("display", "block");
      } else {
        $(ev.currentTarget).parents(".summary").siblings().css("display", "none");
      }
    });

    html.find('.extendDescriptionButton').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square fa-minus-square");

      if($(ev.currentTarget).hasClass("fa-minus-square")) {
        $(ev.currentTarget).parents(".summary").siblings(".description").css("display", "block");
      } else {
        $(ev.currentTarget).parents(".summary").siblings(".description").css("display", "none");
      }
    });

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

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

    html.find('.item-delete').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      if(item.type === 'armure') {
        const idLegende = this._getArmorLegendeId();

        if(idLegende !== 0) {
          const armorLegende = this.actor.items.get(idLegende);

          armorLegende.delete();
        }

        const update = {
          system:{
            equipements:{
              armure:{
                id:0,
                hasArmor:false,
                hasArmorLegende:false,
                idLegende:0
              }
            },
            wear:'tenueCivile'
          }
        };

        this.actor.update(update);
        this._resetArmure();
      }

      if(item.type === 'module') {
        this._resetArmureModules();
      }

      item.delete();
      header.slideUp(200, () => this.render(false));
    });

    html.find('div.armure section.buttonTabs a').click(ev => {
      const target = $(ev.currentTarget);
      const tab = target.data("tab");

      const update = {};

      switch(tab) {
        case 'MAarmure':
          update[`system.MATabs`] = {
            'MAarmure':true,
            'MAmodule':false,
            'MAia':false,
          };
          break;
        case 'MAmodule':
          update[`system.MATabs`] = {
            'MAarmure':false,
            'MAmodule':true,
            'MAia':false,
          };
          break;
        case 'MAia':
          update[`system.MATabs`] = {
            'MAarmure':false,
            'MAmodule':false,
            'MAia':true,
          };
          break;
      }

      this.actor.update(update);
    });

    html.find('section.menu div.armure input.value').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();

      this._updatePA(value);
    });

    html.find('.armure .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const module = target.data("module");
      const capacite = target.data("capacite");
      const name = target.data("name");
      const hasFlux = target.data("flux") || false;
      const cout = eval(target.data("cout"));
      const flux = hasFlux != false ? eval(hasFlux) : false;
      const special = target.data("special");
      const dEspoir = target.data("despoir");
      const espoir = target.data("espoir");
      const nbreC = target.data("nbrec") || 0;
      const variant = target.data("variant");
      const isAllie = target.data("isallie");
      const caracteristiques = target.data("caracteristiques")?.split('.')?.filter((a) => a) || false;
      const getData = this.getData();
      const armorId = getData.systemData.equipements.armure.id;
      const remplaceEnergie = this.actor.items.get(armorId).system.espoir.remplaceEnergie || false;
      const equipcapacites = getData.data.system.equipements.armure.capacites;
      const armorCapacites = getData.actor.armureData.system.capacites.selected;
      const armure = this.actor.items.get(this._getArmorId());

      const coutCalcule = (remplaceEnergie && armure.system.espoir.cout > 0 && type === 'module') ? Math.floor(cout / armure.system.espoir.cout) : cout;

      const depense = await this._depensePE(name, coutCalcule, true, false, flux);

      let depenseEspoir;
      let newActor;

      if(!depense) return;

      const update = {
        system:{
          equipements:{
            ascension:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              }
            },
            armure:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              },
              [type]:{
                [capacite]:{}
              }
            }
          },
          reaction:{
            bonus:{},
            malus:{}
          },
          defense:{
            bonus:{},
            malus:{}
          },
          egide:{
            bonus:{},
            malus:{},
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
          },
          aspects:{
            chair:{
              caracteristiques:{
                deplacement:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                force:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                endurance:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            bete:{
              caracteristiques:{
                hargne:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                combat:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                instinct:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            machine:{
              caracteristiques:{
                tir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                savoir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                technique:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            dame:{
              caracteristiques:{
                aura:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                parole:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                sangFroid:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            masque:{
              caracteristiques:{
                discretion:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                dexterite:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                perception:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            }
          }
        }
      };

      const itemUpdate = {
        system:{
          capacites:{
            selected:{
              [capacite]:{}
            }
          }
        }
      };

      if(type === 'capacites') {
        switch(capacite) {
          case "ascension":
            let data = getData.data.system;
            data.wear = "ascension";

            if(data.energie.value != cout) {
              data.energie.value = cout;
            }

            newActor = await Actor.create({
              name: `${this.title} : ${name}`,
              type: "knight",
              img:getData.data.img,
              items:getData.items,
              system:data,
              permission:this.actor.ownership
            });

            const aArmure = newActor.items.get(this._getArmorId());
            itemUpdate.system.energie = {};
            itemUpdate.system.energie.base = cout;

            aArmure.update(itemUpdate);

            const capacityUpdate = {
              system:{
                capacites:{
                  selected:{
                    ascension:{
                      active:true,
                      depense:cout,
                      ascensionId:newActor.id
                    }
                  }
                }
              }
            };

            armure.update(capacityUpdate);

            if(remplaceEnergie) {
              update.system.espoir = {};
              update.system.espoir.malus = {armure:cout+this.getData().data.system.espoir.malus?.armure||0};

              this.actor.update(update);
            } else {
              const selfArmure = this.actor.items.get(this._getArmorId());

              selfArmure.update({[`system.energie.base`]:this.getData().data.system.energie.max-cout});
            }
            break;
          case "borealis":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            armure.update(itemUpdate);
            break;
          case "changeling":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            armure.update(itemUpdate);
            break;
          case "companions":
            const donPe = +target.data('donpe');
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active.base = true;
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            if(!remplaceEnergie) {
              itemUpdate.system.energie = {};
              itemUpdate.system.energie.malus = {
                companions:donPe
              };
            } else {
              update.system.espoir = {};
              update.system.espoir.malus = {
                companions:donPe
              };

              this.actor.update(update);
            }

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
                  img:getData.data.img,
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
                      "base":donPe,
                      "value":donPe,
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
                      "modules":true
                    }
                  },
                  items:dataLion.modules,
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

                itemUpdate.system.capacites.selected[capacite].lion = {};
                itemUpdate.system.capacites.selected[capacite].lion.id = newActor.id;
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
                    "base":donPe,
                    "value":donPe,
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
                  img:getData.data.img,
                  system:dataActor,
                  permission:this.actor.ownership
                });

                newActor2 = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 2`,
                  type: "pnj",
                  img:getData.data.img,
                  system:dataActor,
                  permission:this.actor.ownership
                });

                newActor3 = await Actor.create({
                  name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 3`,
                  type: "pnj",
                  img:getData.data.img,
                  system:dataActor,
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

                itemUpdate.system.capacites.selected[capacite].wolf = {};
                itemUpdate.system.capacites.selected[capacite].wolf.id = {
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
                  img:getData.data.img,
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
                      "value":donPe,
                      "max":donPe,
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
                  permission:this.actor.ownership
                });

                itemUpdate.system.capacites.selected[capacite].crow = {};
                itemUpdate.system.capacites.selected[capacite].crow.id = newActor.id;
                break;
            }

            armure.update(itemUpdate);
            break;
          case "shrine":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active.base = true;
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            armure.update(itemUpdate);
            break;
          case "ghost":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            armure.update(itemUpdate);
            break;
          case "goliath":
            const eGoliath = equipcapacites.goliath;
            const aGoliath = armorCapacites.goliath;

            const goliathMetre = +eGoliath.metre;
            const bGCDF = +aGoliath.bonus.cdf.value;
            const mGRea = +aGoliath.malus.reaction.value;
            const mGDef = +aGoliath.malus.defense.value;

            update.system.reaction.malus.goliath = goliathMetre*mGRea;
            update.system.defense.malus.goliath = goliathMetre*mGDef;
            update.system.equipements.armure.champDeForce.bonus.goliath = goliathMetre*bGCDF;

            this.actor.update(update);

            itemUpdate.system.capacites.selected[capacite].active = true;

            armure.update(itemUpdate);
            break;
          case "illumination":
            switch(special) {
              case "torch":
              case "lighthouse":
              case "lantern":
              case "blaze":
              case "beacon":
              case "projector":
                depenseEspoir = await this._depensePE(`${name} : ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.${special.toUpperCase()}.Label`)}`, espoir, true, true);

                if(!depenseEspoir) return;

                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active[special] = true;

                armure.update(itemUpdate);
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

                await this._depensePE(`${name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.Label")}`, rCandle.total, true, true);
                break;
            }
            break;
          case "morph":
            const aMorph = armorCapacites.morph;
            const nbreA = this.getData().systemData.equipements.armure.capacites.morph.nbre;
            const nbreP = this.getData().systemData.equipements.armure.capacites.morph?.poly || 0;

            switch(special) {
              case "active":
                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active.morph = true;
                break;
              case "polymorphieLame":
                update.system.equipements.armure[type][capacite].poly = nbreP+1;
                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active.polymorphieLame = true;

                if(nbreP+1 === 2) {
                  itemUpdate.system.capacites.selected[capacite].poly = {};
                  itemUpdate.system.capacites.selected[capacite].poly.fait = true;
                }
                break;
              case "polymorphieGriffe":
                update.system.equipements.armure[type][capacite].poly = nbreP+1;
                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active.polymorphieGriffe = true;

                if(nbreP+1 === 2) {
                  itemUpdate.system.capacites.selected[capacite].poly = {};
                  itemUpdate.system.capacites.selected[capacite].poly.fait = true;
                }
                break;
              case "polymorphieCanon":
                update.system.equipements.armure[type][capacite].poly = nbreP+1;
                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active.polymorphieCanon = true;

                if(nbreP+1 === 2) {
                  itemUpdate.system.capacites.selected[capacite].poly = {};
                  itemUpdate.system.capacites.selected[capacite].poly.fait = true;
                }
                break;
              case "vol":
              case "phase":
              case "etirement":
              case "polymorphie":
                itemUpdate.system.capacites.selected[capacite].choisi = {};
                itemUpdate.system.capacites.selected[capacite].choisi[special] = true;
                update.system.equipements.armure[type][capacite].nbre = nbreA+1;

                if(nbreA+1 === nbreC) { itemUpdate.system.capacites.selected[capacite].choisi.fait = true; }
                break;
              case "metal":
                itemUpdate.system.capacites.selected[capacite].choisi = {};
                itemUpdate.system.capacites.selected[capacite].choisi[special] = true;

                const bMCDF = +aMorph.metal.bonus.champDeForce;

                update.system.equipements.armure[type][capacite].nbre = nbreA+1;
                update.system.equipements.armure.champDeForce.bonus.morph = +bMCDF;

                if(nbreA+1 === nbreC) { itemUpdate.system.capacites.selected[capacite].choisi.fait = true; }
                break;
              case "fluide":
                itemUpdate.system.capacites.selected[capacite].choisi = {};
                itemUpdate.system.capacites.selected[capacite].choisi[special] = true;

                const bMFLUI = aMorph.fluide.bonus;

                update.system.equipements.armure[type][capacite].nbre = nbreA+1;
                update.system.reaction.bonus.morph = +bMFLUI.reaction;
                update.system.defense.bonus.morph = +bMFLUI.defense;

                if(nbreA+1 === nbreC) { itemUpdate.system.capacites.selected[capacite].choisi.fait = true; }
                break;
            }

            this.actor.update(update);
            armure.update(itemUpdate);
            break;
          case "puppet":
            itemUpdate.system.capacites.selected[capacite].active = true;

            armure.update(itemUpdate);
            break;
          case "discord":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            armure.update(itemUpdate);
            break;
          case "rage":
            const rageInterdit = [];
            const rageBonus = [];

            switch(special){
              case "active":
                itemUpdate.system.capacites.selected[capacite].niveau = {};
                itemUpdate.system.capacites.selected[capacite].active = true;
                itemUpdate.system.capacites.selected[capacite].niveau.colere = true;

                update.system.egide.bonus.rage = armorCapacites.rage.colere.egide;
                update.system.reaction.malus.rage = armorCapacites.rage.colere.reaction;
                update.system.defense.malus.rage = armorCapacites.rage.colere.defense;

                if(armorCapacites.rage.colere.combosInterdits.has) {
                  for (let [key, combo] of Object.entries(armorCapacites.rage.colere.combosInterdits.liste)){
                    if(combo != "") {
                      rageInterdit.push(combo);
                    }
                  }
                }

                if(armorCapacites.rage.colere.combosBonus.has) {
                  for (let [key, combo] of Object.entries(armorCapacites.rage.colere.combosBonus.liste)){
                    if(combo != "") {
                      rageBonus.push(combo);
                    }
                  }
                }
                break;

              case "niveau":
                const typeNiveau = $(ev.currentTarget).data("niveau") || false;
                const nActuel = armure.data.data.capacites.selected[capacite].niveau;

                if(typeNiveau == "espoir") {
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

                  const rSEspoirTotal = await this._depensePE(`${name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir")}`, rSEspoir.total, true, true);

                  if(!rSEspoirTotal) return;
                }

                update.system.equipements.armure[type][capacite].niveau = {};

                if(nActuel.colere) {
                  itemUpdate.system.capacites.selected[capacite].niveau = {};
                  itemUpdate.system.capacites.selected[capacite].niveau.colere = false;
                  itemUpdate.system.capacites.selected[capacite].niveau.rage = true;

                  update.system.egide.bonus.rage = armorCapacites.rage.rage.egide;
                  update.system.reaction.malus.rage = armorCapacites.rage.rage.reaction;
                  update.system.defense.malus.rage = armorCapacites.rage.rage.defense;

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
                  itemUpdate.system.capacites.selected[capacite].niveau = {};
                  itemUpdate.system.capacites.selected[capacite].niveau.colere = false;
                  itemUpdate.system.capacites.selected[capacite].niveau.rage = false;
                  itemUpdate.system.capacites.selected[capacite].niveau.fureur = true;

                  update.system.egide.bonus.rage = armorCapacites.rage.fureur.egide;
                  update.system.reaction.malus.rage = armorCapacites.rage.fureur.reaction;
                  update.system.defense.malus.rage = armorCapacites.rage.fureur.defense;

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
                break;

              case "recuperation":
                const recuperationRage = $(ev.currentTarget).data("recuperation") || 0;
                const labelRecuperationRage = $(ev.currentTarget).data("labelrecuperation") || "";

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

                this._gainPE(rGEspoir.total, true, true);
                break;
            }

            update.system.combos.interdits.caracteristiques.rage = rageInterdit;
            update.system.combos.bonus.caracteristiques.rage = rageBonus;

            this.actor.update(update);
            armure.update(itemUpdate);
            break;
          case "record":
            itemUpdate.system.capacites.selected[capacite].active = true;

            armure.update(itemUpdate);
            break;
          case "totem":
            itemUpdate.system.capacites.selected[capacite].active = true;

            armure.update(itemUpdate);
            break;
          case "warlord":
            const aWarlord = armorCapacites.warlord.impulsions;

            itemUpdate.system.capacites.selected[capacite].active = {};

            if(isAllie) {
              itemUpdate.system.capacites.selected[capacite].active[special] = {};
              itemUpdate.system.capacites.selected[capacite].active[special].allie = true;
            } else {
              itemUpdate.system.capacites.selected[capacite].active[special] = {};
              itemUpdate.system.capacites.selected[capacite].active[special].porteur = true;

              switch(special) {
                case "esquive":
                  update.system.reaction.bonus.warlord = +aWarlord.esquive.bonus.reaction;
                  update.system.defense.bonus.warlord = +aWarlord.esquive.bonus.defense;

                  this.actor.update(update);
                  break;

                case "force":
                  update.system.equipements.armure.champDeForce.bonus.warlord = +aWarlord.force.bonus.champDeForce;

                  this.actor.update(update);
                  break;
              }
            }

            armure.update(itemUpdate);
            break;
          case "watchtower":
            itemUpdate.system.capacites.selected[capacite].active = true;

            armure.update(itemUpdate);
            break;
          case "zen":
            const autre = [].concat(caracteristiques);
            autre.shift();

            this._rollDice(name, caracteristiques[0], 5, autre, caracteristiques);
            break;
          case "nanoc":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = true;

            armure.update(itemUpdate);
            break;
          case "type":
            itemUpdate.system.capacites.selected[capacite].type = {};
            itemUpdate.system.capacites.selected[capacite].type[special] = {};
            itemUpdate.system.capacites.selected[capacite].type[special][variant] = true;

            armure.update(itemUpdate);
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
      }

      if(type === 'module') {
        this.actor.items.get(module).update({[`system.active.base`]:true})
      }

      if(type === 'modulePnj') {
        const index = $(ev.currentTarget).data("index");

        const dataModule = this.actor.items.get(module).system.pnj.liste[index];
        const listeAspects = dataModule.aspects.liste;

        const system = {
          aspects:dataModule.aspects.has ? {
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
            diceBase:dataModule.initiative.dice,
            bonus:{user:dataModule.initiative.fixe}
          },
          armure:{
            base:dataModule.armure,
            value:dataModule.armure
          },
          champDeForce:{
            base:dataModule.champDeForce
          },
          reaction:{
            base:dataModule.reaction
          },
          defense:{
            base:dataModule.defense
          },
          options:{
            noAspects:dataModule.aspects.has ? false : true,
            noArmesImprovisees:dataModule.aspects.has ? false : true,
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

        if(dataModule.jetSpecial.has) {
          const jetsSpeciaux = [];

          system.options.jetsSpeciaux = true;

          for (let [key, jet] of Object.entries(dataModule.jetSpecial.liste)) {
            jetsSpeciaux.push({
              name:jet.nom,
              value:`${jet.dice}D6+${jet.overdrive}`
            });
          }

          system.jetsSpeciaux = jetsSpeciaux;
        }

        if(dataModule.type === 'bande') {
          system.debordement = {};
          system.debordement.value = dataModule.debordement;
        }

        newActor = await Actor.create({
          name: `${this.title} : ${dataModule.nom}`,
          type: dataModule.type,
          img:getData.data.img,
          system:system,
          permission:this.actor.ownership
        });

        if(dataModule.armes.has && dataModule.type !== 'bande') {
          const items = [];

          for (let [key, arme] of Object.entries(dataModule.armes.liste)) {
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
            'pnjName':dataModule.nom
          },
          'id':newActor.id
        }})
      }
    });

    html.find('.armure .activationLegende').click(async ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const type = target.data("type");
      const capacite = target.data("capacite");
      const hasFlux = target.data("flux") || false;
      const cout = eval(target.data("cout"));
      const flux = hasFlux != false ? eval(hasFlux) : false;
      const special = target.data("special");
      const variant = target.data("variant");
      const isAllie = target.data("isallie");
      const depense = await this._depensePE(name, cout, true, false, flux);
      const getData = this.getData();
      const equipcapacites = getData.data.system.equipements.armure.capacites;
      const armorCapacites = getData.actor.armureLegendeData.system.capacites.selected;
      const armure = this.actor.items.get(this._getArmorLegendeId());

      let newActor;

      if(!depense) return;

      const update = {
        system:{
          equipements:{
            armure:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              },
              [type]:{
                [capacite]:{}
              }
            }
          },
          reaction:{
            bonus:{},
            malus:{}
          },
          defense:{
            bonus:{},
            malus:{}
          },
          egide:{
            bonus:{},
            malus:{},
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
          },
          aspects:{
            chair:{
              caracteristiques:{
                deplacement:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                force:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                endurance:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            bete:{
              caracteristiques:{
                hargne:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                combat:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                instinct:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            machine:{
              caracteristiques:{
                tir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                savoir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                technique:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            dame:{
              caracteristiques:{
                aura:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                parole:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                sangFroid:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            masque:{
              caracteristiques:{
                discretion:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                dexterite:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                perception:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            }
          }
        }
      };

      const itemUpdate = {
        system:{
          capacites:{
            selected:{
              [capacite]:{}
            }
          }
        }
      };

      switch(capacite) {
        case "changeling":
          itemUpdate.system.capacites.selected[capacite].active = {};
          itemUpdate.system.capacites.selected[capacite].active[special] = true;

          armure.update(itemUpdate);
          break;
        case "companions":
          const donPe = +target.data('donpe');
          itemUpdate.system.capacites.selected[capacite].active = {};
          itemUpdate.system.capacites.selected[capacite].active.base = true;
          itemUpdate.system.capacites.selected[capacite].active[special] = true;

          if(!remplaceEnergie) {
            itemUpdate.system.energie = {};
            itemUpdate.system.energie.malus = {
              companions:donPe
            };
          } else {
            update.system.espoir = {};
            update.system.espoir.malus = {
              companions:donPe
            };

            this.actor.update(update);
          }

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
                img:getData.data.img,
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
                    "base":donPe,
                    "value":donPe,
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
                    "modules":true
                  }
                },
                items:dataLion.modules,
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

              itemUpdate.system.capacites.selected[capacite].lion = {};
              itemUpdate.system.capacites.selected[capacite].lion.id = newActor.id;
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
                  "base":donPe,
                  "value":donPe,
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
                img:getData.data.img,
                system:dataActor,
                permission:this.actor.ownership
              });

              newActor2 = await Actor.create({
                name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 2`,
                type: "pnj",
                img:getData.data.img,
                system:dataActor,
                permission:this.actor.ownership
              });

              newActor3 = await Actor.create({
                name: `${this.title} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} 3`,
                type: "pnj",
                img:getData.data.img,
                system:dataActor,
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

              itemUpdate.system.capacites.selected[capacite].wolf = {};
              itemUpdate.system.capacites.selected[capacite].wolf.id = {
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
                img:getData.data.img,
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
                    "value":donPe,
                    "max":donPe,
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
                permission:this.actor.ownership
              });

              itemUpdate.system.capacites.selected[capacite].crow = {};
              itemUpdate.system.capacites.selected[capacite].crow.id = newActor.id;
              break;
          }

          armure.update(itemUpdate);
          break;
        case "shrine":
          itemUpdate.system.capacites.selected[capacite].active = {};
          itemUpdate.system.capacites.selected[capacite].active.base = true;
          itemUpdate.system.capacites.selected[capacite].active[special] = true;

          armure.update(itemUpdate);
          break;
        case "ghost":
          itemUpdate.system.capacites.selected[capacite].active = {};
          itemUpdate.system.capacites.selected[capacite].active[special] = true;

          armure.update(itemUpdate);
          break;
        case "goliath":
          const eGoliath = equipcapacites.goliath;
          const aGoliath = armorCapacites.goliath;

          const goliathMetre = +eGoliath.metre;
          const bGCDF = +aGoliath.bonus.cdf.value;
          const mGRea = +aGoliath.malus.reaction.value;
          const mGDef = +aGoliath.malus.defense.value;

          update.system.reaction.malus.goliath = goliathMetre*mGRea;
          update.system.defense.malus.goliath = goliathMetre*mGDef;
          update.system.equipements.armure.champDeForce.bonus.goliath = goliathMetre*bGCDF;

          this.actor.update(update);

          itemUpdate.system.capacites.selected[capacite].active = true;

          armure.update(itemUpdate);
          break;
        case "puppet":
          itemUpdate.system.capacites.selected[capacite].active = true;

          armure.update(itemUpdate);
          break;
        case "discord":
          itemUpdate.system.capacites.selected[capacite].active = {};
          itemUpdate.system.capacites.selected[capacite].active[special] = true;

          armure.update(itemUpdate);
          break;
        case "record":
          itemUpdate.system.capacites.selected[capacite].active = true;

          armure.update(itemUpdate);
          break;
        case "totem":
          itemUpdate.system.capacites.selected[capacite].active = true;

          armure.update(itemUpdate);
          break;
        case "warlord":
          const aWarlord = armorCapacites.warlord.impulsions;

          itemUpdate.system.capacites.selected[capacite].active = {};

          if(isAllie) {
            itemUpdate.system.capacites.selected[capacite].active[special] = {};
            itemUpdate.system.capacites.selected[capacite].active[special].allie = true;
          } else {
            itemUpdate.system.capacites.selected[capacite].active[special] = {};
            itemUpdate.system.capacites.selected[capacite].active[special].porteur = true;

            switch(special) {
              case "esquive":
                update.system.reaction.bonus.warlord = +aWarlord.esquive.bonus.reaction;
                update.system.defense.bonus.warlord = +aWarlord.esquive.bonus.defense;

                this.actor.update(update);
                break;

              case "force":
                update.system.equipements.armure.champDeForce.bonus.warlord = +aWarlord.force.bonus.champDeForce;

                this.actor.update(update);
                break;
            }
          }

          armure.update(itemUpdate);
          break;
        case "nanoc":
          itemUpdate.system.capacites.selected[capacite].active = {};
          itemUpdate.system.capacites.selected[capacite].active[special] = true;

          armure.update(itemUpdate);
          break;
        case "type":
          itemUpdate.system.capacites.selected[capacite].type = {};
          itemUpdate.system.capacites.selected[capacite].type[special] = {};
          itemUpdate.system.capacites.selected[capacite].type[special][variant] = true;

          armure.update(itemUpdate);
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
    });

    html.find('.armure .desactivation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const module = $(ev.currentTarget).data("module");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget).data("name");
      const special = $(ev.currentTarget).data("special");
      const id = $(ev.currentTarget).data("id");
      const variant = $(ev.currentTarget).data("variant");
      const isAllie = $(ev.currentTarget).data("isallie");
      const getData = this.getData();
      const armorId = getData.systemData.equipements.armure.id;
      const remplaceEnergie = this.actor.items.get(armorId).system.espoir.remplaceEnergie || false;

      const armure = this.actor.items.get(this._getArmorId());

      const update = {
        system:{
          equipements:{
            ascension:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              }
            },
            armure:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              },
              [type]:{
                [capacite]:{}
              }
            },
            modules:{}
          },
          reaction:{
            bonus:{},
            malus:{}
          },
          defense:{
            bonus:{},
            malus:{}
          },
          egide:{
            bonus:{},
            malus:{}
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
          },
          aspects:{
            chair:{
              caracteristiques:{
                deplacement:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                force:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                endurance:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            bete:{
              caracteristiques:{
                hargne:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                combat:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                instinct:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            machine:{
              caracteristiques:{
                tir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                savoir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                technique:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            dame:{
              caracteristiques:{
                aura:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                parole:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                sangFroid:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            masque:{
              caracteristiques:{
                discretion:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                dexterite:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                perception:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            }
          }
        }
      };

      const itemUpdate = {
        system:{
          capacites:{
            selected:{
              [capacite]:{}
            }
          }
        }
      };

      if(type === 'capacites') {
        switch(capacite) {
          case "ascension":
            const depense = +$(ev.currentTarget).data("depense");
            const actor = game.actors.get(id);

            await actor.delete();

            itemUpdate.system.capacites.selected.ascension.active = false;
            itemUpdate.system.capacites.selected.ascension.ascensionId = 0;
            itemUpdate.system.capacites.selected.ascension.depense = 0;

            armure.update(itemUpdate);

            if(remplaceEnergie) {
              update.system.espoir = {};
              update.system.espoir.malus = {armure:getData.data.system.espoir.malus.armure-depense};

              this.actor.update(update);
            } else {
              const selfArmure = this.actor.items.get(getData.data.system.equipements.armure.id);

              selfArmure.update({[`system.energie.base`]:getData.data.system.energie.max+depense});
            }
            break;
          case "borealis":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "changeling":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "companions":
            const armorCapacites = getData.actor.armureData.system.capacites.selected;

            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active.base = false;
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            if(!remplaceEnergie) {
              itemUpdate.system.energie = {};
              itemUpdate.system.energie.malus = {
                companions:0
              };
            } else {
              update.system.espoir = {};
              update.system.espoir.malus = {
                companions:0
              };

              this.actor.update(update);
            }

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

            armure.update(itemUpdate);
            break;
          case "shrine":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active.base = false;
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "ghost":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "goliath":
            update.system.equipements.armure.champDeForce.bonus.goliath = 0;
            update.system.reaction.malus.goliath = 0;
            update.system.defense.malus.goliath = 0;

            this.actor.update(update);

            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "illumination":
            switch(special) {
              case "torch":
              case "lighthouse":
              case "lantern":
              case "blaze":
              case "beacon":
              case "projector":
                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active[special] = false;

                armure.update(itemUpdate);
                break;
            }
            break;
          case "morph":
            if(special === 'active') {
              update.system.equipements.armure[type][capacite].nbre = 0;
              update.system.equipements.armure[type][capacite].poly = 0;
              update.system.equipements.armure.champDeForce.bonus.morph = 0;
              update.system.reaction.bonus.morph = 0;
              update.system.defense.bonus.morph = 0;

              itemUpdate.system.capacites.selected[capacite].choisi = {};
              itemUpdate.system.capacites.selected[capacite].active = {};
              itemUpdate.system.capacites.selected[capacite].active.morph = false;
              itemUpdate.system.capacites.selected[capacite].active.polymorphieLame = false;
              itemUpdate.system.capacites.selected[capacite].active.polymorphieGriffe = false;
              itemUpdate.system.capacites.selected[capacite].active.polymorphieCanon = false;
              itemUpdate.system.capacites.selected[capacite].poly = {};
              itemUpdate.system.capacites.selected[capacite].poly.fait = false;
              itemUpdate.system.capacites.selected[capacite].choisi.fait = false;
              itemUpdate.system.capacites.selected[capacite].choisi.vol = false;
              itemUpdate.system.capacites.selected[capacite].choisi.phase = false;
              itemUpdate.system.capacites.selected[capacite].choisi.etirement = false;
              itemUpdate.system.capacites.selected[capacite].choisi.metal = false;
              itemUpdate.system.capacites.selected[capacite].choisi.fluide = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphie = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphieLame = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphieGriffe = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphieCanon = false;
            } else {
              const nbreP = this.getData().systemData.equipements.armure.capacites.morph?.poly || 0;

              update.system.equipements.armure[type][capacite].poly = nbreP-1;
              itemUpdate.system.capacites.selected[capacite].active = {};
              itemUpdate.system.capacites.selected[capacite].active[special] = false;
            }

            this.actor.update(update);
            armure.update(itemUpdate);
            break;
          case "puppet":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "discord":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "rage":
            itemUpdate.system.capacites.selected[capacite].niveau = {};
            itemUpdate.system.capacites.selected[capacite].active = false;
            itemUpdate.system.capacites.selected[capacite].niveau.colere = false;
            itemUpdate.system.capacites.selected[capacite].niveau.fureur = false;
            itemUpdate.system.capacites.selected[capacite].niveau.rage = false;

            update.system.egide.bonus.rage = 0;
            update.system.reaction.malus.rage = 0;
            update.system.defense.malus.rage = 0;
            update.system.combos.interdits.caracteristiques.rage = [];
            update.system.combos.bonus.caracteristiques.rage = [];

            this.actor.update(update);
            armure.update(itemUpdate);
            break;
          case "record":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "totem":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "warlord":
            itemUpdate.system.capacites.selected[capacite].active = {};

            if(isAllie) {
              itemUpdate.system.capacites.selected[capacite].active[special] = {};
              itemUpdate.system.capacites.selected[capacite].active[special].allie = false;
            } else {
              itemUpdate.system.capacites.selected[capacite].active[special] = {};
              itemUpdate.system.capacites.selected[capacite].active[special].porteur = false;

              switch(special) {
                case "esquive":
                  update.system.reaction.bonus.warlord = 0;
                  update.system.defense.bonus.warlord = 0;

                  this.actor.update(update);
                  break;

                case "force":
                  update.system.equipements.armure.champDeForce.bonus.warlord = 0;

                  this.actor.update(update);
                  break;
              }
            }

            armure.update(itemUpdate);
            break;
          case "watchtower":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "nanoc":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "type":
            itemUpdate.system.capacites.selected[capacite].type = {};
            itemUpdate.system.capacites.selected[capacite].type[special] = {};
            itemUpdate.system.capacites.selected[capacite].type[special][variant] = false;

            update.system.aspects.chair.caracteristiques.deplacement.overdrive.bonus.type = 0;
            update.system.aspects.chair.caracteristiques.force.overdrive.bonus.type = 0;
            update.system.aspects.chair.caracteristiques.endurance.overdrive.bonus.type = 0;
            update.system.aspects.bete.caracteristiques.hargne.overdrive.bonus.type = 0;
            update.system.aspects.bete.caracteristiques.combat.overdrive.bonus.type = 0;
            update.system.aspects.bete.caracteristiques.instinct.overdrive.bonus.type = 0;
            update.system.aspects.machine.caracteristiques.tir.overdrive.bonus.type = 0;
            update.system.aspects.machine.caracteristiques.savoir.overdrive.bonus.type = 0;
            update.system.aspects.machine.caracteristiques.technique.overdrive.bonus.type = 0;
            update.system.aspects.dame.caracteristiques.aura.overdrive.bonus.type = 0;
            update.system.aspects.dame.caracteristiques.parole.overdrive.bonus.type = 0;
            update.system.aspects.dame.caracteristiques.sangFroid.overdrive.bonus.type = 0;
            update.system.aspects.masque.caracteristiques.discretion.overdrive.bonus.type = 0;
            update.system.aspects.masque.caracteristiques.dexterite.overdrive.bonus.type = 0;
            update.system.aspects.masque.caracteristiques.perception.overdrive.bonus.type = 0;

            armure.update(itemUpdate);
            this.actor.update(update);
            break;
        }
      }

      if(type === 'module') {
        const wear = this.getData().data.system.wear === 'ascension' ? 'ascension' : 'armure';

        update.system.equipements[wear].armure.bonus[module] = 0;
        update.system.equipements[wear].champDeForce.bonus[module] = 0;
        update.system.equipements[wear].energie.bonus[module] = 0;

        this.actor.update(update);
        this.actor.items.get(module).update({[`system.active.base`]:false})
      }

      if(type === 'modulePnj') {
        const dataModule = this.actor.items.get(module);
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
    });

    html.find('.armure .desactivationLegende').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const module = $(ev.currentTarget).data("module");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget).data("name");
      const special = $(ev.currentTarget).data("special");
      const id = $(ev.currentTarget).data("id");
      const variant = $(ev.currentTarget).data("variant");
      const isAllie = $(ev.currentTarget).data("isallie");
      const getData = this.getData();
      const armorId = getData.systemData.equipements.armure.id;
      const remplaceEnergie = this.actor.items.get(armorId).system.espoir.remplaceEnergie || false;

      const armure = this.actor.items.get(this._getArmorLegendeId());

      const update = {
        system:{
          equipements:{
            ascension:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              }
            },
            armure:{
              armure:{
                bonus:{}
              },
              champDeForce:{
                bonus:{}
              },
              energie:{
                bonus:{}
              },
              [type]:{
                [capacite]:{}
              }
            },
            modules:{}
          },
          reaction:{
            bonus:{},
            malus:{}
          },
          defense:{
            bonus:{},
            malus:{}
          },
          egide:{
            bonus:{},
            malus:{}
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
          },
          aspects:{
            chair:{
              caracteristiques:{
                deplacement:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                force:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                endurance:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            bete:{
              caracteristiques:{
                hargne:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                combat:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                instinct:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            machine:{
              caracteristiques:{
                tir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                savoir:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                technique:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            dame:{
              caracteristiques:{
                aura:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                parole:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                sangFroid:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            },
            masque:{
              caracteristiques:{
                discretion:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                dexterite:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                },
                perception:{
                  overdrive:{
                    bonus:{},
                    malus:{}
                  }
                }
              }
            }
          }
        }
      };

      const itemUpdate = {
        system:{
          capacites:{
            selected:{
              [capacite]:{}
            }
          }
        }
      };

      if(type === 'capacites') {
        switch(capacite) {
          case "ascension":
            const depense = +$(ev.currentTarget).data("depense");
            const actor = game.actors.get(id);

            await actor.delete();

            itemUpdate.system.capacites.selected.ascension.active = false;
            itemUpdate.system.capacites.selected.ascension.ascensionId = 0;
            itemUpdate.system.capacites.selected.ascension.depense = 0;

            armure.update(itemUpdate);

            if(remplaceEnergie) {
              update.system.espoir = {};
              update.system.espoir.malus = {armure:getData.data.system.espoir.malus.armure-depense};

              this.actor.update(update);
            } else {
              const selfArmure = this.actor.items.get(getData.data.system.equipements.armure.id);

              selfArmure.update({[`system.energie.base`]:getData.data.system.energie.max+depense});
            }
            break;
          case "borealis":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "changeling":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "companions":
            const armorCapacites = getData.actor.armureData.system.capacites.selected;

            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active.base = false;
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            if(!remplaceEnergie) {
              itemUpdate.system.energie = {};
              itemUpdate.system.energie.malus = {
                companions:0
              };
            } else {
              update.system.espoir = {};
              update.system.espoir.malus = {
                companions:0
              };

              this.actor.update(update);
            }

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

            armure.update(itemUpdate);
            break;
          case "shrine":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active.base = false;
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "ghost":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "goliath":
            update.system.equipements.armure.champDeForce.bonus.goliath = 0;
            update.system.reaction.malus.goliath = 0;
            update.system.defense.malus.goliath = 0;

            this.actor.update(update);

            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "illumination":
            switch(special) {
              case "torch":
              case "lighthouse":
              case "lantern":
              case "blaze":
              case "beacon":
              case "projector":
                itemUpdate.system.capacites.selected[capacite].active = {};
                itemUpdate.system.capacites.selected[capacite].active[special] = false;

                armure.update(itemUpdate);
                break;
            }
            break;
          case "morph":
            if(special === 'active') {
              update.system.equipements.armure[type][capacite].nbre = 0;
              update.system.equipements.armure[type][capacite].poly = 0;
              update.system.equipements.armure.champDeForce.bonus.morph = 0;
              update.system.reaction.bonus.morph = 0;
              update.system.defense.bonus.morph = 0;

              itemUpdate.system.capacites.selected[capacite].choisi = {};
              itemUpdate.system.capacites.selected[capacite].active = {};
              itemUpdate.system.capacites.selected[capacite].active.morph = false;
              itemUpdate.system.capacites.selected[capacite].active.polymorphieLame = false;
              itemUpdate.system.capacites.selected[capacite].active.polymorphieGriffe = false;
              itemUpdate.system.capacites.selected[capacite].active.polymorphieCanon = false;
              itemUpdate.system.capacites.selected[capacite].poly = {};
              itemUpdate.system.capacites.selected[capacite].poly.fait = false;
              itemUpdate.system.capacites.selected[capacite].choisi.fait = false;
              itemUpdate.system.capacites.selected[capacite].choisi.vol = false;
              itemUpdate.system.capacites.selected[capacite].choisi.phase = false;
              itemUpdate.system.capacites.selected[capacite].choisi.etirement = false;
              itemUpdate.system.capacites.selected[capacite].choisi.metal = false;
              itemUpdate.system.capacites.selected[capacite].choisi.fluide = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphie = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphieLame = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphieGriffe = false;
              itemUpdate.system.capacites.selected[capacite].choisi.polymorphieCanon = false;
            } else {
              const nbreP = this.getData().systemData.equipements.armure.capacites.morph?.poly || 0;

              update.system.equipements.armure[type][capacite].poly = nbreP-1;
              itemUpdate.system.capacites.selected[capacite].active = {};
              itemUpdate.system.capacites.selected[capacite].active[special] = false;
            }

            this.actor.update(update);
            armure.update(itemUpdate);
            break;
          case "puppet":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "discord":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "rage":
            itemUpdate.system.capacites.selected[capacite].niveau = {};
            itemUpdate.system.capacites.selected[capacite].active = false;
            itemUpdate.system.capacites.selected[capacite].niveau.colere = false;
            itemUpdate.system.capacites.selected[capacite].niveau.fureur = false;
            itemUpdate.system.capacites.selected[capacite].niveau.rage = false;

            update.system.egide.bonus.rage = 0;
            update.system.reaction.malus.rage = 0;
            update.system.defense.malus.rage = 0;
            update.system.combos.interdits.caracteristiques.rage = [];
            update.system.combos.bonus.caracteristiques.rage = [];

            this.actor.update(update);
            armure.update(itemUpdate);
            break;
          case "record":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "totem":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "warlord":
            itemUpdate.system.capacites.selected[capacite].active = {};

            if(isAllie) {
              itemUpdate.system.capacites.selected[capacite].active[special] = {};
              itemUpdate.system.capacites.selected[capacite].active[special].allie = false;
            } else {
              itemUpdate.system.capacites.selected[capacite].active[special] = {};
              itemUpdate.system.capacites.selected[capacite].active[special].porteur = false;

              switch(special) {
                case "esquive":
                  update.system.reaction.bonus.warlord = 0;
                  update.system.defense.bonus.warlord = 0;

                  this.actor.update(update);
                  break;

                case "force":
                  update.system.equipements.armure.champDeForce.bonus.warlord = 0;

                  this.actor.update(update);
                  break;
              }
            }

            armure.update(itemUpdate);
            break;
          case "watchtower":
            itemUpdate.system.capacites.selected[capacite].active = false;

            armure.update(itemUpdate);
            break;
          case "nanoc":
            itemUpdate.system.capacites.selected[capacite].active = {};
            itemUpdate.system.capacites.selected[capacite].active[special] = false;

            armure.update(itemUpdate);
            break;
          case "type":
            itemUpdate.system.capacites.selected[capacite].type = {};
            itemUpdate.system.capacites.selected[capacite].type[special] = {};
            itemUpdate.system.capacites.selected[capacite].type[special][variant] = false;

            update.system.aspects.chair.caracteristiques.deplacement.overdrive.bonus.type = 0;
            update.system.aspects.chair.caracteristiques.force.overdrive.bonus.type = 0;
            update.system.aspects.chair.caracteristiques.endurance.overdrive.bonus.type = 0;
            update.system.aspects.bete.caracteristiques.hargne.overdrive.bonus.type = 0;
            update.system.aspects.bete.caracteristiques.combat.overdrive.bonus.type = 0;
            update.system.aspects.bete.caracteristiques.instinct.overdrive.bonus.type = 0;
            update.system.aspects.machine.caracteristiques.tir.overdrive.bonus.type = 0;
            update.system.aspects.machine.caracteristiques.savoir.overdrive.bonus.type = 0;
            update.system.aspects.machine.caracteristiques.technique.overdrive.bonus.type = 0;
            update.system.aspects.dame.caracteristiques.aura.overdrive.bonus.type = 0;
            update.system.aspects.dame.caracteristiques.parole.overdrive.bonus.type = 0;
            update.system.aspects.dame.caracteristiques.sangFroid.overdrive.bonus.type = 0;
            update.system.aspects.masque.caracteristiques.discretion.overdrive.bonus.type = 0;
            update.system.aspects.masque.caracteristiques.dexterite.overdrive.bonus.type = 0;
            update.system.aspects.masque.caracteristiques.perception.overdrive.bonus.type = 0;

            armure.update(itemUpdate);
            this.actor.update(update);
            break;
        }
      }
    });

    html.find('.armure .special').click(async ev => {
      const target = $(ev.currentTarget);
      const special = target.data("special");
      const label = target.data("name");
      const value =  eval(target.data("value"));
      const note = target.data("note");
      const flux = +this.getData().data.system.flux.value;
      const armure = this.actor.items.get(this._getArmorId());

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

          ChatMessage.create(msg);
          break;
      }
    });

    html.find('.armure .specialLegende').click(async ev => {
      const target = $(ev.currentTarget);
      const special = target.data("special");
      const label = target.data("name");
      const value =  eval(target.data("value"));
      const note = target.data("note");
      const flux = +this.getData().data.system.flux.value;
      const armure = this.actor.items.get(this._getArmorLegendeId());

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

          ChatMessage.create(msg);
          break;
      }
    });

    html.find('.armure .supplementaire').click(async ev => {
      const cout = eval($(ev.currentTarget).data("cout"));

      await this._depensePE('', cout, true, false);
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

      await this._depensePE(name, cout, true, false, flux);

      switch(capacite) {
        case "illumination":
          switch(special) {
            case "torch":
            case "lighthouse":
            case "lantern":
            case "blaze":
            case "beacon":
            case "projector":
              await this._depensePE(`${name} : ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.${special.toUpperCase()}.Label`)}`, espoir, true, true);
              break;
          }
          break;
      }
    });

    html.find('.armure .configurationWolf').click(ev => {
      const target = $(ev.currentTarget);
      const configuration = target.data("configuration");
      const armure = this.actor.items.get(this._getArmorId());
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

      const update = {
        system:{
          equipements:{
            armure:{
              champDeForce:{
                bonus:{}
              }
            }
          },
          reaction:{
            malus:{}
          },
          defense:{
            malus:{}
          }
        }
      };

      switch(capacite) {
        case "goliath":
          const aGoliath = armorCapacites.goliath;

          const bGCDF = +aGoliath.bonus.cdf.value;
          const mGRea = +aGoliath.malus.reaction.value;
          const mGDef = +aGoliath.malus.defense.value;

          update.system.equipements.armure.champDeForce.bonus.goliath = newV*bGCDF;
          update.system.reaction.malus.goliath = newV*mGRea;
          update.system.defense.malus.goliath = newV*mGDef;

          this.actor.update(update);

          if(newV > oldV) { await this._depensePE('', cout*(newV-oldV), true, false, flux); }
          break;
        case "puppet":
        case "totem":
        case "warlord":
          if(newV > oldV) { await this._depensePE('', cout*(newV-oldV), true, false, flux); }
          break;
      }
    });

    html.find('.armure .aChoisir').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const special = $(ev.currentTarget).data("special");
      const value = $(ev.currentTarget).data("value");

      const idLegende = this._getArmorLegendeId();
      const armure = this.actor.items.get(this._getArmorId());
      const armureLegende = this.actor.items?.get(idLegende) || false;

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

    html.find('.armure .degats').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const degatsD = target.data("degats");
      const degatsF = target?.data("degatsfixe") || 0;
      const cout = target?.data("cout") || false;

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false);

        if(!depense) return;
      }

      const rDegats = new game.knight.RollKnight(`${degatsD}D6+${degatsF}`, this.actor.system);
      rDegats._flavor = `${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`;
      rDegats._success = false;
      await rDegats.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });
    });

    html.find('.armure .violence').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const violenceD = target.data("violence");
      const violenceF = target?.data("violencefixe") || 0;
      const cout = target?.data("cout") || false;

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false);

        if(!depense) return;
      }

      const rViolence = new game.knight.RollKnight(`${violenceD}D6+${violenceF}`, this.actor.system);
      rViolence._flavor = `${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`;
      rViolence._success = false;
      await rViolence.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });
    });

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
      const actuel = this.getData().data.system.combat?.styleDeploy || false;

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
      const style = $(ev.currentTarget).val();
      const mods = getModStyle(style);
      const data = this.getData();

      const update = {
        system: {
          reaction: {
            bonus:{
              other:mods.bonus.reaction
            },
            malus:{
              other:mods.malus.reaction
            }
          },
          defense: {
            bonus:{
              other:mods.bonus.defense
            },
            malus:{
              other:mods.malus.defense
            }
          },
          combat:{
            data:{
              tourspasses:1,
              type:"degats"
            }
          }
        }
      };

      this.actor.update(update);

      // ON ACTUALISE ROLL UI S'IL EST OUVERT
      let rollUi = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? false;

      if(rollUi !== false) {
        await rollUi.setStyle({
          fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`),
          label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`),
          raw:style,
          info:data.systemData.combat.styleInfo,
          caracteristiques:mods.caracteristiques,
          tourspasses:data.data.system.combat.data.tourspasses,
          type:data.data.system.combat.data.type,
          sacrifice:data.data.system.combat.data.sacrifice,
          maximum:6
        });
      }
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const caracteristique = target.data("caracteristique") || '';
      const caracAdd = target.data("caracadd") === undefined ? [] : target.data("caracadd").split(',')
      const caracLock = target.data("caraclock") === undefined ? [] : target.data("caraclock").split(',');
      const reussites = +target.data("reussitebonus") || 0;

      this._rollDice(label, caracteristique, false, caracAdd, caracLock, false, '', '', '', -1, reussites);
    });

    html.find('.jetEspoir').click(ev => {
      this._rollDice(game.i18n.localize('KNIGHT.JETS.JetEspoir'), 'hargne', false, ['sangFroid'], ['hargne', 'sangFroid']);
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const id = target.data("id");
      const isDistance = target.data("isdistance");
      const num = target.data("num");
      const caracs = target?.data("caracteristiques")?.split(",") || [];

      let label;

      switch(isDistance) {
        case 'grenades':
          label = `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;
          break;

        case 'longbow':
          label = game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label`);
          break;

        case 'armesimprovisees':
          label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
          break;

        default:
          label = name;
          break;
      }

      this._rollDice(label, '', false, caracs, [], true, id, name, isDistance, num, 0);
    });

    html.find('.jetEgide').click(async ev => {
      const value = $(ev.currentTarget).data("value");

      const rEgide = new game.knight.RollKnight(value, this.actor.system);
      rEgide._flavor = game.i18n.localize("KNIGHT.JETS.JetEgide");
      rEgide._success = true;
      await rEgide.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });
    });

    html.find('.motivationAccomplie').click(async ev => {
      const espoir = this.getData().data.system.espoir;
      const mods = espoir.recuperation.bonus-espoir.recuperation.malus;

      const rEspoir = new game.knight.RollKnight(`1D6+${mods}`, this.actor.system);
      rEspoir._flavor = game.i18n.localize("KNIGHT.PERSONNAGE.MotivationAccomplie");
      rEspoir._success = false;
      await rEspoir.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });

      const total = rEspoir.total < 0 ? 0 : rEspoir.total;

      this._gainPE(total, true, true);
    });

    html.find('img.edit').click(ev => {
      const aspect = $(ev.currentTarget).data("aspect");
      const label = game.i18n.localize(CONFIG.KNIGHT.aspects[aspect]);

      const dataAspect = this.getData().data.system.aspects[aspect];

      let editCarac = ``;
      let listCarac = [];

      for (let [key, carac] of Object.entries(dataAspect.caracteristiques)){
        editCarac += `
        <label class="line">
            <span class="label">${carac.label}</span>
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
      const value = item.data.data.gainEspoir.value;
      const actuel = this.getData().data.system.espoir.value;
      const max = this.getData().data.system.espoir.max;
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

    html.find('div.buttonSelectArmure button.armure').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const data = this.object.system;
      let armure = 0;

      switch(type) {
        case 'armure':
          armure = +this.actor.items.get(data.equipements.armure.id).system.armure.value;
          break;

        case 'ascension':
        case 'guardian':
          armure = +data.equipements[type].armure.value;
          break;
      }

      const update = {
        system:{
          wear:type,
          armure:{
            value:armure
          }
        }
      };

      if(type != 'armure') {
        this._resetArmureCapacites();
      }

      this.actor.update(update);
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

        if(type === 'armure') {
          this._updatePA(final);
        }

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

    html.find('div.options button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const option = target.data("option");
      const result = value === true ? false : true;

      this.actor.update({[`system.options.${option}`]:result});
    });

    html.find('div.progression .tableauPG button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const id = target.data("id");
      const result = value ? false : true;

      this.actor.items.get(id).update({['system.gratuit']:result});
    });

    html.find('div.progression .tableauPX .experience-create').click(ev => {
      const getData = this.getData();
      const data = getData.systemData.progression.experience.depense.liste
      const length = data.length === undefined ? Object.keys(data).length : data.length;

      const newData = [];

      for(let i = 0;i < length;i++) {
        newData.push(data[i]);
      }

      newData.push({
        addOrder:length+1,
        caracteristique:'',
        bonus:0,
        cout:0
      });

      this.actor.update({[`system.progression.experience.depense.liste`]:newData});
    });

    html.find('div.progression .tableauPX .experience-delete').click(ev => {
      const target = $(ev.currentTarget);
      const id = +target.data("id");
      const getData = this.getData();
      const data = getData.systemData.progression.experience.depense.liste
      const length = data.length === undefined ? Object.keys(data).length : data.length;

      const newData = [];

      for(let i = 0;i < length;i++) {
        if(i !== id) {
          newData.push(data[i]);
        }
      }

      this.actor.update({[`system.progression.experience.depense.liste`]:newData});
    });

    html.find('.appliquer-evolution-armure').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("num");
      const dataArmor = this.actor.items.get(this._getArmorId());
      const listEvolutions = dataArmor.system.evolutions.liste;
      const dataEArmor = listEvolutions[id].data;
      const capacites = listEvolutions[id].capacites;
      let special = listEvolutions[id].special;
      const gloireListe = this.getData().data.system.progression.gloire.depense.liste;
      const addOrder =  gloireListe.length === 0 ? 0 : Math.max(...gloireListe.map(o => o.order));
      const filter = [];

      for (let [key, spec] of Object.entries(special)) {
        const hasDelete = spec?.delete || false;

        if(hasDelete !== false) {
          if(hasDelete.value === true) {
            dataArmor.update({[`system.special.selected.-=${key}`]:null});
            filter.push(key);
            delete special[key];
          }
        }
      }

      dataArmor.update({['system']:{
        armure:{
          base:dataArmor.system.armure.base+dataEArmor.armure
        },
        champDeForce:{
          base:dataArmor.system.champDeForce.base+dataEArmor.champDeForce
        },
        energie:{
          base:dataArmor.system.energie.base+dataEArmor.energie
        },
        capacites:{
          selected:capacites
        },
        special:{
          selected:special
        },
        evolutions:{
          liste:{
            [id]:{
              applied:true,
              addOrder:addOrder+1
            }
          }
        }
      }});

      for (let [key, evolutions] of Object.entries(listEvolutions)) {
        const num = +key;

        if(num > id) {
          for(let i = 0;i < filter.length;i++) {
            const hasSpecial = evolutions.special?.[filter[i]] || false;

            if(hasSpecial !== false) {
              dataArmor.update({[`system.evolutions.liste.${num}.special.-=${filter[i]}`]:null});
            }
          }
        }
      }
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

    html.find('.acheter-evolution-armure').click(ev => {
      const target = $(ev.currentTarget);
      const id = +target.data("id");
      const value = +target.data("value");
      const dataArmor = this.actor.items.get(this._getArmorId());
      const listEvolutions = dataArmor.system.evolutions.liste;
      const dataEArmor = listEvolutions[id].data;
      const capacites = listEvolutions[id].capacites;
      let special = listEvolutions[id].special;
      const dataGloire = this.getData().data.system.progression.gloire;
      const gloireActuel = +dataGloire.actuel;
      const gloireListe = dataGloire.depense.liste;
      const addOrder =  gloireListe.length === 0 ? 0 : Math.max(...gloireListe.map(o => o.order));
      const filter = [];

      if(gloireActuel >= value) {
        for (let [key, spec] of Object.entries(special)) {
          const hasDelete = spec?.delete || false;

          if(hasDelete !== false) {
            if(hasDelete.value === true) {
              dataArmor.update({[`system.special.selected.-=${key}`]:null});
              filter.push(key);
              delete special[key];
            }
          }
        }

        dataArmor.update({['system']:{
          armure:{
            base:dataArmor.system.armure.base+dataEArmor.armure
          },
          champDeForce:{
            base:dataArmor.system.champDeForce.base+dataEArmor.champDeForce
          },
          energie:{
            base:dataArmor.system.energie.base+dataEArmor.energie
          },
          capacites:{
            selected:capacites
          },
          special:{
            selected:special
          },
          evolutions:{
            liste:{
              [id]:{
                applied:true,
                addOrder:addOrder+1
              }
            }
          }
        }});

        this.actor.update({['system.progression.gloire.actuel']:gloireActuel-value});

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(num > id) {
            for(let i = 0;i < filter.length;i++) {
              const hasSpecial = evolutions.special?.[filter[i]] || false;

              if(hasSpecial !== false) {
                dataArmor.update({[`system.evolutions.liste.${num}.special.-=${filter[i]}`]:null});
              }
            }
          }
        }
      }
    });
  }

  /* -------------------------------------------- */
  async _onItemCreate(event) {
    event.preventDefault();
    const gloireListe = this.getData().data.system.progression.gloire.depense.liste;
    const gloireMax = gloireListe.length === 0 ? 0 : Math.max(...gloireListe.map(o => o.order));
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
              itemData.system = {
                isLion:true
              };

              const create = await Item.create(itemData, {parent: this.actor});

              return create;
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: game.i18n.localize('KNIGHT.AUTRE.Non'),
            callback: async () => {
              itemData.system.addOrder = gloireMax+1;
              const create = await Item.create(itemData, {parent: this.actor});

              return create;
            },
            icon: `<i class="fas fa-times"></i>`
          }
        }
      }, askDialogOptions).render(true);
    } else {
      if(type === 'module') {
        itemData.system.addOrder = gloireMax+1;
      }

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

      return create;
    }
  }

  async _onDropItemCreate(itemData) {
    const data = this.getData()
    const actorData = data.data.system;
    const hasCapaciteCompanions = data.actor?.armureData?.system?.capacites?.selected?.companions || false;
    const gloireListe = actorData.progression.gloire.depense.liste;
    const gloireMax = gloireListe.length === 0 ? 0 : Math.max(...gloireListe.map(o => o.order));
    const hasArmor = actorData.equipements.armure?.hasArmor || false;

    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    if(itemBaseType === 'capacite' ||
    itemBaseType === 'effet') return;

    if(itemBaseType === 'module' && hasCapaciteCompanions) {
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
              itemData[0].system.isLion = true;

              const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

              return itemCreate;
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: game.i18n.localize('KNIGHT.AUTRE.Non'),
            callback: async () => {
              const itemSlots = itemData[0].system.slots;
              const armorSlots = this._getSlotsValue();

              const sTete = armorSlots.tete-itemSlots.tete;
              const sTorse = armorSlots.torse-itemSlots.torse;
              const sBrasGauche = armorSlots.brasGauche-itemSlots.brasGauche;
              const sBrasDroit = armorSlots.brasDroit-itemSlots.brasDroit;
              const sJambeGauche = armorSlots.jambeGauche-itemSlots.jambeGauche;
              const sJambeDroite = armorSlots.jambeDroite-itemSlots.jambeDroite;


              if(sTete < 0 || sTorse < 0 || sBrasGauche < 0 || sBrasDroit < 0 || sJambeGauche < 0 || sJambeDroite < 0) return;

              itemData[0].system.addOrder = gloireMax+1;

              const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

              return itemCreate;
            },
            icon: `<i class="fas fa-times"></i>`
          }
        }
      }, askDialogOptions).render(true);
    } else if(itemBaseType === 'module') {
      const itemSlots = itemData[0].system.slots;
      const armorSlots = this._getSlotsValue();

      const sTete = armorSlots.tete-itemSlots.tete;
      const sTorse = armorSlots.torse-itemSlots.torse;
      const sBrasGauche = armorSlots.brasGauche-itemSlots.brasGauche;
      const sBrasDroit = armorSlots.brasDroit-itemSlots.brasDroit;
      const sJambeGauche = armorSlots.jambeGauche-itemSlots.jambeGauche;
      const sJambeDroite = armorSlots.jambeDroite-itemSlots.jambeDroite;


      if(sTete < 0 || sTorse < 0 || sBrasGauche < 0 || sBrasDroit < 0 || sJambeGauche < 0 || sJambeDroite < 0) return;

      itemData[0].system.addOrder = gloireMax+1;

      const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

      return itemCreate;
    } else if(itemBaseType === 'arme') {
      const isRangedWpn = itemData[0].system.type;

      if(isRangedWpn === 'distance') {
        const cantHaveRangedWpn = actorData.restrictions.noArmeDistance;

        if(cantHaveRangedWpn) return;
      }

      itemData[0].system.addOrder = gloireMax+1;

      const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

      return itemCreate;

    } else {

      if(itemBaseType === 'armurelegende' && !hasArmor) return;

      const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

      const itemType = itemCreate[0].type;
      const itemId = itemCreate[0].id;

      if (itemType === 'armure') {
        this._resetArmure();

        const wear = actorData.wear;

        if(wear === 'armure') {
          this.actor.update({['system.wear']:'guardian'});
        }

        const oldArmorId = actorData.equipements.armure?.id || 0;
        if (oldArmorId !== 0) {
          const oldArmor = this.actor.items.get(oldArmorId);

          oldArmor.delete();
        }

        const update = {
          system:{
            equipements:{
              armure:{}
            }
          }
        };

        update.system.equipements.armure.id = itemId;
        update.system.equipements.armure.hasArmor = true;

        this.actor.update(update);
      }

      if (itemType === 'armurelegende') {
        const oldArmorLegendeId = this._getArmorLegendeId();

        if(oldArmorLegendeId !== 0) {
          const oldArmorLegende = this.actor.items.get(oldArmorLegendeId);

          oldArmorLegende.delete();
        }

        const update = {
          system:{
            equipements:{
              armure:{}
            }
          }
        };

        update.system.equipements.armure.idLegende = itemId;
        update.system.equipements.armure.hasArmorLegende = true;

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

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const system = sheetData.data.system;
    const eqpData = system.equipements;
    const armorData = eqpData.armure;
    const wear = system.wear;

    const armorSpecial = getSpecial(this.actor);
    const armorSpecialRaw = armorSpecial?.raw || [];
    const armorSpecialCustom = armorSpecial?.custom || [];
    const depenseXP = system.progression.experience.depense.liste;

    const avantage = [];
    const inconvenient = [];
    const avantageIA = [];
    const inconvenientIA = [];
    const motivationMineure = [];
    const langue = [];
    const contact = [];
    const blessures = [];
    const trauma = [];
    const module = [];
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
    const armesContactEquipee = [];
    const armesDistanceEquipee = [];
    const armesContactRack = [];
    const armesDistanceRack = [];
    const armesContactArmoury = [];
    const armesDistanceArmoury = [];
    const armesTourelles = [];
    const aspectsUpdate = {};
    const depensePG = [];
    const evolutionsAchetables = [];
    const evolutionsCompanions = [];
    const evolutionsAAcheter = [];

    const carteHeroique = [];
    const capaciteHeroique = [];

    let armureData = {};
    let armureLegendeData = {};
    let longbow = {};
    let aspects = {
      "chair":{
        "bonus":0,
        "malus":0,
        "caracteristiques":{
          "deplacement": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "force": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "endurance": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          }
        }
      },
      "bete":{
        "bonus":0,
        "malus":0,
        "caracteristiques":{
          "hargne": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "combat": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "instinct": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          }
        }
      },
      "machine":{
        "bonus":0,
        "malus":0,
        "caracteristiques":{
          "tir": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "savoir": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "technique": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          }
        }
      },
      "dame":{
        "bonus":0,
        "malus":0,
        "caracteristiques":{
          "aura": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "parole": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "sangFroid": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          }
        }
      },
      "masque":{
        "bonus":0,
        "malus":0,
        "caracteristiques":{
          "discretion": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "dexterite": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          },
          "perception": {
            "bonus":0,
            "malus":0,
            "overdrive": {
              "base":0,
              "bonus":0,
              "malus":0
            }
          }
        }
      }
    };
    let sante = {
      bonus:{
        avantages:[0]
      },
      malus:{
        desavantages:[0]
      },
    };
    let espoir = {
      aucun:false,
      perte:{
        saufAgonie:false,
        saufCapacite:false
      },
      bonus:{
        avantages:[0],
        armure:[0]
      },
      malus:{
        desavantages:[0],
        blessures:[0]
      },
      recuperationBonus:[0],
      recuperationMalus:[0],
      value:sheetData.data.system.espoir.value
    };
    let initiative = {
      bonus:{
        avantages:[0]
      },
      malus:{
        desavantages:[0]
      },
      diceBonus:{
        avantages:[0]
      },
      diceMalus:{
        desavantages:[0]
      }
    };
    let armure = {
      bonus:{
        modules:[0]
      }
    };
    let champDeForce = {
      bonus:{
        modules:[0]
      }
    };
    let energie = {
      bonus:{
        modules:[0]
      }
    };
    let slots = {
      tete:0,
      torse:0,
      brasGauche:0,
      brasDroit:0,
      jambeGauche:0,
      jambeDroite:0
    };
    let grenades = {
      "antiblindage": {
        "degats": {
          "dice": 3
        },
        "violence": {
          "dice": 3
        },
        "effets":{
          "liste":[],
          "raw":[
            "destructeur",
            "dispersion 6",
            "penetrant 6",
            "percearmure 20"
          ],
          "custom":[]
        }
      },
      "explosive": {
        "degats": {
          "dice": 3
        },
        "violence": {
          "dice": 3
        },
        "effets":{
          "liste":[],
          "raw":[
            "destructeur",
            "dispersion 6",
            "penetrant 6",
            "percearmure 20"
          ],
          "custom":[]
        }
      },
      "shrapnel": {
        "degats": {
          "dice":3
        },
        "violence": {
          "dice":3
        },
        "effets":{
          "liste":[],
          "raw":[
            "destructeur",
            "dispersion 6",
            "penetrant 6",
            "percearmure 20"
          ],
          "custom":[]
        }
      },
      "flashbang": {
        "effets":{
          "liste":[],
          "raw":[
            "aucundegatsviolence",
            "barrage 2",
            "choc 1",
            "dispersion 6"
          ],
          "custom":[]
        }
      },
      "iem": {
        "effets":{
          "liste":[],
          "raw":[
            "aucundegatsviolence",
            "dispersion 6",
            "parasitage 2"
          ],
          "custom":[]
        }
      },
    };
    let nods = {
      "soin":{
        "recuperationBonus":[]
      },
      "armure":{
        "recuperationBonus":[]
      },
      "energie":{
        "recuperationBonus":[]
      }
    };
    let reaction = {
      bonus:0,
      malus:0
    };
    let defense = {
      bonus:0,
      malus:0
    };
    let egide = {
      bonus:{
        armure:[0]
      },
      malus:{
        armure:[0]
      }
    }
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
    let bonusDiceEmbuscadeSubis = 0;
    let bonusFixeEmbuscadeSubis = 0;

    for (let i of sheetData.items) {
      const data = i.system;
      const bonus = data.bonus;
      const malus = data.malus;
      const limitations = data.limitations;

      // ARMURE.
      if (i.type === 'armure') {
        armorData.label = i.name;
        espoir.bonus.armure.push(i.system.espoir.value);
        egide.bonus.armure.push(i.system.egide.value);
        armureData = i;

        const armorCapacites = i.system.capacites.selected;
        const armorSpecial = i.system.special.selected;
        const armorEvolutions = i.system.evolutions;

        for (let [key, capacite] of Object.entries(armorCapacites)) {
          switch(key) {
            case "ascension":
              const ascEnergie = armorData.capacites.ascension.energie;

              if(ascEnergie < capacite.energie.min) {
                armorData.capacites.ascension.energie = capacite.energie.min;
              } else if(ascEnergie > capacite.energie.max) {
                armorData.capacites.ascension.energie = capacite.energie.max;
              }
            break;

            case "cea":
              if(wear === 'armure') {
                const vagueEffets = capacite.vague.effets;
                const vagueEffetsRaw = vagueEffets.raw.concat(armorSpecialRaw);
                const vagueEffetsCustom = vagueEffets.custom.concat(armorSpecialCustom) || [];
                const vagueEffetsFinal = {
                  raw:[...new Set(vagueEffetsRaw)],
                  custom:vagueEffetsCustom,
                  liste:[]
                };

                const salveEffets = capacite.salve.effets;
                const salveEffetsRaw = salveEffets.raw.concat(armorSpecialRaw);
                const salveEffetsCustom = salveEffets.custom.concat(armorSpecialCustom) || [];
                const salveEffetsFinal = {
                  raw:[...new Set(salveEffetsRaw)],
                  custom:salveEffetsCustom,
                  liste:[]
                };

                const rayonEffets = capacite.rayon.effets;
                const rayonEffetsRaw = rayonEffets.raw.concat(armorSpecialRaw);
                const rayonEffetsCustom = rayonEffets.custom.concat(armorSpecialCustom) || [];
                const rayonEffetsFinal = {
                  raw:[...new Set(rayonEffetsRaw)],
                  custom:rayonEffetsCustom,
                  liste:[]
                };

                const vagueWpnC = {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                  system:{
                    capaciteName:'cea',
                    subCapaciteName:'vague',
                    noRack:true,
                    capacite:true,
                    portee:capacite.vague.portee,
                    energie:capacite.energie,
                    espoir:capacite.espoir,
                    degats:{
                      dice:capacite.vague.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.vague.violence.dice,
                      fixe:0
                    },
                    type:'contact',
                    effets:vagueEffetsFinal
                  }
                };

                const salveWpnC = {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                  system:{
                    capaciteName:'cea',
                    subCapaciteName:'salve',
                    noRack:true,
                    capacite:true,
                    portee:capacite.salve.portee,
                    energie:capacite.energie,
                    espoir:capacite.espoir,
                    degats:{
                      dice:capacite.salve.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.salve.violence.dice,
                      fixe:0
                    },
                    type:'contact',
                    effets:salveEffetsFinal
                  }
                };

                const rayonWpnC = {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                  system:{
                    capaciteName:'cea',
                    subCapaciteName:'rayon',
                    noRack:true,
                    capacite:true,
                    portee:capacite.rayon.portee,
                    energie:capacite.energie,
                    espoir:capacite.espoir,
                    degats:{
                      dice:capacite.rayon.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.rayon.violence.dice,
                      fixe:0
                    },
                    type:'contact',
                    effets:rayonEffetsFinal
                  }
                };

                const vagueWpnD = {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                  system:{
                    capaciteName:'cea',
                    subCapaciteName:'vague',
                    noRack:true,
                    capacite:true,
                    portee:capacite.vague.portee,
                    energie:capacite.energie,
                    espoir:capacite.espoir,
                    degats:{
                      dice:capacite.vague.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.vague.violence.dice,
                      fixe:0
                    },
                    type:'distance',
                    effets:vagueEffetsFinal
                  }
                };

                const salveWpnD = {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                  system:{
                    capaciteName:'cea',
                    subCapaciteName:'salve',
                    noRack:true,
                    capacite:true,
                    portee:capacite.salve.portee,
                    energie:capacite.energie,
                    espoir:capacite.espoir,
                    degats:{
                      dice:capacite.salve.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.salve.violence.dice,
                      fixe:0
                    },
                    type:'distance',
                    effets:salveEffetsFinal
                  }
                };

                const rayonWpnD = {
                  _id:i._id,
                  name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                  system:{
                    capaciteName:'cea',
                    subCapaciteName:'rayon',
                    noRack:true,
                    capacite:true,
                    portee:capacite.rayon.portee,
                    energie:capacite.energie,
                    espoir:capacite.espoir,
                    degats:{
                      dice:capacite.rayon.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.rayon.violence.dice,
                      fixe:0
                    },
                    type:'distance',
                    effets:rayonEffetsFinal
                  }
                };

                armesContactEquipee.push(vagueWpnC);
                armesContactEquipee.push(salveWpnC);
                armesContactEquipee.push(rayonWpnC);

                armesDistanceEquipee.push(vagueWpnD);
                armesDistanceEquipee.push(salveWpnD);
                armesDistanceEquipee.push(rayonWpnD);
              }
              break;

            case "borealis":
              if(wear === 'armure') {
                const borealisEffets = capacite.offensif.effets;
                const borealisEffetsRaw = borealisEffets.raw.concat(armorSpecialRaw);
                const borealisEffetsCustom = borealisEffets.custom.concat(armorSpecialCustom) || [];
                const borealisEffetsFinal = {
                  raw:[...new Set(borealisEffetsRaw)],
                  custom:borealisEffetsCustom,
                  liste:borealisEffets.liste
                };

                const borealisWpnC = {
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                  system:{
                    capaciteName:'borealis',
                    subCapaciteName:'offensif',
                    noRack:true,
                    capacite:true,
                    portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.offensif.portee.charAt(0).toUpperCase()+capacite.offensif.portee.substr(1)}`),
                    energie:capacite.offensif.energie,
                    degats:{
                      dice:capacite.offensif.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.offensif.violence.dice,
                      fixe:0
                    },
                    type:'contact',
                    effets:borealisEffetsFinal
                  }
                };

                const borealisWpnD = {
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                  system:{
                    capaciteName:'borealis',
                    subCapaciteName:'offensif',
                    noRack:true,
                    capacite:true,
                    portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.offensif.portee.charAt(0).toUpperCase()+capacite.offensif.portee.substr(1)}`),
                    energie:capacite.offensif.energie,
                    degats:{
                      dice:capacite.offensif.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.offensif.violence.dice,
                      fixe:0
                    },
                    type:'distance',
                    effets:borealisEffetsFinal
                  }
                };

                armesContactEquipee.push(borealisWpnC);

                armesDistanceEquipee.push(borealisWpnD);
              }
              break;

            case "morph":
              const activeMorph = capacite?.active?.morph || false;
              if(wear === 'armure' && activeMorph) {
                if(capacite.active.polymorphieLame) {
                  const lameEffets = capacite.polymorphie.lame.effets;
                  const lameEffetsRaw = lameEffets.raw.concat(armorSpecialRaw);
                  const lameEffetsCustom = lameEffets.custom.concat(armorSpecialCustom) || [];
                  const lameEffetsFinal = {
                    raw:[...new Set(lameEffetsRaw)],
                    custom:lameEffetsCustom,
                    liste:lameEffets.liste
                  };

                  const lame = {
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')}`,
                    system:{
                      capaciteName:'morph',
                      subCapaciteName:'polymorphie',
                      subSubCapaciteName:'lame',
                      noRack:true,
                      capacite:true,
                      portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.polymorphie.lame.portee.charAt(0).toUpperCase()+capacite.polymorphie.lame.portee.substr(1)}`),
                      degats:{
                        dice:capacite.polymorphie.lame.degats.dice,
                        fixe:capacite.polymorphie.lame.degats.fixe
                      },
                      violence:{
                        dice:capacite.polymorphie.lame.violence.dice,
                        fixe:capacite.polymorphie.lame.violence.fixe
                      },
                      type:'contact',
                      effets:lameEffetsFinal
                    }
                  };

                  const bDefense = lameEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                  const bReaction = lameEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; })

                  if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                  if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                  armesContactEquipee.push(lame);
                }

                if(capacite.active.polymorphieGriffe) {
                  const griffeEffets = capacite.polymorphie.griffe.effets;
                  const griffeEffetsRaw = griffeEffets.raw.concat(armorSpecialRaw);
                  const griffeEffetsCustom = griffeEffets.custom.concat(armorSpecialCustom) || [];
                  const griffeEffetsFinal = {
                    raw:[...new Set(griffeEffetsRaw)],
                    custom:griffeEffetsCustom,
                    liste:griffeEffets.liste
                  };

                  const griffe = {
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')}`,
                    system:{
                      capaciteName:'morph',
                      subCapaciteName:'polymorphie',
                      subSubCapaciteName:'griffe',
                      noRack:true,
                      capacite:true,
                      portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.polymorphie.griffe.portee.charAt(0).toUpperCase()+capacite.polymorphie.griffe.portee.substr(1)}`),
                      degats:{
                        dice:capacite.polymorphie.griffe.degats.dice,
                        fixe:capacite.polymorphie.griffe.degats.fixe
                      },
                      violence:{
                        dice:capacite.polymorphie.griffe.violence.dice,
                        fixe:capacite.polymorphie.griffe.violence.fixe
                      },
                      type:'contact',
                      effets:griffeEffetsFinal
                    }
                  };

                  const bDefense = griffeEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                  const bReaction = griffeEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; })

                  if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                  if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                  armesContactEquipee.push(griffe);
                };

                if(capacite.active.polymorphieCanon) {
                  const canonEffets = capacite.polymorphie.canon.effets;
                  const canonEffetsRaw = canonEffets.raw.concat(armorSpecialRaw);
                  const canonEffetsCustom = canonEffets.custom.concat(armorSpecialCustom) || [];
                  const canonEffetsFinal = {
                    raw:[...new Set(canonEffetsRaw)],
                    custom:canonEffetsCustom,
                    liste:canonEffets.liste
                  };

                  const canon = {
                    _id:i._id,
                    name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')}`,
                    system:{
                      capaciteName:'morph',
                      subCapaciteName:'polymorphie',
                      subSubCapaciteName:'canon',
                      noRack:true,
                      capacite:true,
                      portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.polymorphie.canon.portee.charAt(0).toUpperCase()+capacite.polymorphie.canon.portee.substr(1)}`),
                      energie:capacite.polymorphie.canon.energie,
                      degats:{
                        dice:capacite.polymorphie.canon.degats.dice,
                        fixe:capacite.polymorphie.canon.degats.fixe
                      },
                      violence:{
                        dice:capacite.polymorphie.canon.violence.dice,
                        fixe:capacite.polymorphie.canon.violence.fixe
                      },
                      type:'distance',
                      effets:canonEffetsFinal
                    }
                  };

                  const bDefense = griffeEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                  const bReaction = griffeEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; })

                  if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                  if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                  armesDistanceEquipee.push(canon);
                }
              }
              break;

            case "longbow":
              if(wear === 'armure') {
                const dataLongbow = capacite;

                longbow = dataLongbow;
                longbow['has'] = true;
                longbow.energie = 0;

                longbow.degats.cout = 0;
                longbow.degats.dice = dataLongbow.degats.min;

                longbow.violence.cout = 0;
                longbow.violence.dice = dataLongbow.violence.min;

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
                longbow.portee.value = dataLongbow.portee.min;
                longbow.portee.rangeToNumber = rangeToNumber;

                longbow.effets.raw = armorSpecialRaw;
                longbow.effets.custom = armorSpecialCustom;
                longbow.effets.liste = [];
                longbow.effets.liste1.cout = 0;
                longbow.effets.liste1.selected = 0;
                longbow.effets.liste2.cout = 0;
                longbow.effets.liste2.selected = 0;
                longbow.effets.liste3.cout = 0;
                longbow.effets.liste3.selected = 0;
              }
              break;

            case "type":
              const arrayTypes = Object.entries(capacite.type)
              const filterTypes = arrayTypes.filter(([key, value]) => (value.selectionne === true && value.conflit === true) || (value.selectionne === true && value.horsconflit === true));
              const bonus = filterTypes?.[0]?.[1] || false;

              if(bonus !== false) {
                for (let [keyC, carac] of Object.entries(bonus.liste)){
                  aspects[bonus.aspect].caracteristiques[keyC].overdrive.bonus += carac.value;
                }
              }
              break;

            case "vision":
              if(armorData.capacites.vision.energie < capacite.energie.min) armorData.capacites.vision.energie = capacite.energie.min;
              break;
          }
        }

        const totalPG = +system.progression.gloire.total;

        if(!armorEvolutions.aAcheter.value) {
          for (let [key, evolution] of Object.entries(armorEvolutions.liste)) {
            const PGEvo = +evolution.value;
            const AlreadyEvo = evolution.applied;

            if(!AlreadyEvo && PGEvo <= totalPG) {
              evolutionsAchetables.push({
                id:key,
                value:PGEvo
              });
            } else if(AlreadyEvo) {
              depensePG.push({
                order:evolution.addOrder,
                isArmure:true,
                value:PGEvo
              });
            }
          }
        } else {
          for (let [key, evolution] of Object.entries(armorEvolutions.liste)) {
            const PGEvo = +evolution.value;
            const AlreadyEvo = evolution.applied;
            const description = evolution.description;

            if(!AlreadyEvo) {
              evolutionsAAcheter.push({
                id:key,
                description:description.replaceAll('<p>', '').replaceAll('</p>', ''),
                value:PGEvo
              });
            } else if(AlreadyEvo) {
              depensePG.push({
                order:evolution.addOrder,
                isAcheter:true,
                value:PGEvo
              });
            }
          }
        }

        const companionsEvolutions = armorEvolutions?.special?.companions || false;

        if(companionsEvolutions !== false) {
          const valueEvo = +companionsEvolutions.value;
          const nbreEvo = Math.floor(totalPG/+companionsEvolutions.value);
          const nbreEvoApplied = companionsEvolutions?.applied?.value || 0;
          const listeEvoApplied = companionsEvolutions?.applied?.liste || [];

          if(nbreEvo > nbreEvoApplied) {
            for(let n = nbreEvoApplied+1; n <= nbreEvo;n++) {
              evolutionsCompanions.push({
                value:valueEvo*n
              });
            }
          }

          for(let n = 0; n < listeEvoApplied.length;n++) {
            depensePG.push({
              order:listeEvoApplied[n].addOrder,
              isArmure:true,
              value:listeEvoApplied[n].value
            });
          }
        }

        if(wear === 'armure') {
          for (let [key, special] of Object.entries(armorSpecial)) {
            switch(key) {
              case 'apeiron':
                espoir.bonus.armure.push(special.espoir.bonus);
                break;

              case 'plusespoir':
                if(!espoir.aucun) {
                  const armureRecupEspoir = special.espoir.recuperation.value === false ? true : false;

                  espoir.aucun = armureRecupEspoir;
                }

                if(!espoir.perte.saufAgonie) {
                  const armurePerteSAgonie = special.espoir.perte.value === false ? true : false;

                  espoir.perte.saufAgonie = armurePerteSAgonie;
                }
                break;

              case 'contrecoups':
                sheetData.data.system.restrictions.noArmeDistance = !special.armedistance.value ? true : false;
                sheetData.data.system.restrictions.maxEffetsArmeContact = {};
                sheetData.data.system.restrictions.maxEffetsArmeContact.has = special.maxeffets.value;
                sheetData.data.system.restrictions.maxEffetsArmeContact.value = special.maxeffets.max;
                break;
            }
          }
        }

        for (let [keyA, aspect] of Object.entries(aspects)) {
          for (let [keyC, carac] of Object.entries(aspect.caracteristiques)) {
            const value = +armureData?.system?.overdrives?.[keyA]?.liste?.[keyC]?.value || 0;
            const aspectExist = aspectsUpdate?.[keyA] || false;
            const caracsListExist = aspectsUpdate?.[keyA]?.caracteristiques || false;
            const caracsExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC] || false;
            const odExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.overdrive || false;
            const odBaseExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.overdrive?.base || false;

            if(value > 0) {
              if(!aspectExist) aspectsUpdate[keyA] = {};
              if(!caracsListExist) aspectsUpdate[keyA].caracteristiques = {}
              if(!caracsExist) aspectsUpdate[keyA].caracteristiques[keyC] = {}
              if(!odExist) aspectsUpdate[keyA].caracteristiques[keyC].overdrive = {}
              if(!odBaseExist) aspectsUpdate[keyA].caracteristiques[keyC].overdrive.base = [];

              aspectsUpdate[keyA].caracteristiques[keyC].overdrive.base.push(value);
            }
          }
        }
      }

      // MODULE
      if (i.type === 'module') {
        const isLion = data.isLion;
        const itemSlots = data.slots;
        const itemBonus = data.bonus;
        const itemArme = data.arme;
        const itemOD = data.overdrives;
        const itemActive = data?.active?.base || false;
        const iBOD = itemBonus.overdrives;
        const itemErsatz = data.ersatz;
        const eRogue = itemErsatz.rogue;
        const eBard = itemErsatz.bard;

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
                  lion.bonusDgtsVariable[iBDgts.type].push({
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
                  lion.bonusViolenceVariable[iBViolence.type].push({
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
          slots.tete += itemSlots.tete;
          slots.torse += itemSlots.torse;
          slots.brasGauche += itemSlots.brasGauche;
          slots.brasDroit += itemSlots.brasDroit;
          slots.jambeGauche += itemSlots.jambeGauche;
          slots.jambeDroite += itemSlots.jambeDroite;

          if(data.permanent || itemActive) {
            if(wear === 'armure' || wear === 'ascension') {
              if(itemBonus.has) {
                const iBArmure = itemBonus.armure;
                const iBCDF = itemBonus.champDeForce;
                const iBEnergie = itemBonus.energie;
                const iBDgts = itemBonus.degats;
                const iBDgtsVariable = iBDgts.variable;
                const iBViolence = itemBonus.violence;
                const iBViolenceVariable = iBViolence.variable;
                const iBGrenades = itemBonus.grenades;

                if(iBArmure.has) { armure.bonus.modules.push(iBArmure.value); }
                if(iBCDF.has) { champDeForce.bonus.modules.push(iBCDF.value); }
                if(iBEnergie.has) { energie.bonus.modules.push(iBEnergie.value); }
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
                if(iBGrenades.has) {
                  for (let [key, grenade] of Object.entries(grenades)) {
                    const data = iBGrenades.liste[key];

                    grenade.degats.dice += data.degats.dice;
                    grenade.violence.dice += data.violence.dice;
                  };
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
                    effets:moduleEffetsFinal
                  }
                }

                const bDefense = moduleEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                const bReaction = moduleEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; });

                if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                if(itemArme.type === 'contact') {
                  const bMassive = itemArme.structurelles.raw.find(str => { if(str.includes('massive')) return true; });
                  if(bMassive) defense.malus += 1;

                  armesContactEquipee.push(moduleWpn);
                }

                if(itemArme.type === 'distance') {
                  armesDistanceEquipee.push(moduleWpn);
                }
              }

              if(itemOD.has || (itemBonus.has && iBOD.has)) {
                for (let [keyA, aspect] of Object.entries(aspects)) {
                  for (let [keyC, carac] of Object.entries(aspect.caracteristiques)) {
                    const base = +itemOD.aspects[keyA][keyC] || 0;
                    const bonus = +iBOD.aspects[keyA][keyC] || 0;

                    const aspectExist = aspectsUpdate?.[keyA] || false;
                    const caracsListExist = aspectsUpdate?.[keyA]?.caracteristiques || false;
                    const caracsExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC] || false;
                    const odExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.overdrive || false;
                    const odBaseExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.overdrive?.base || false;
                    const odBonusExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.overdrive?.bonus || false;

                    if((itemOD.has && base > 0) || (itemBonus.has && iBOD.has && bonus > 0)) {
                      if(!aspectExist) aspectsUpdate[keyA] = {};
                      if(!caracsListExist) aspectsUpdate[keyA].caracteristiques = {}
                      if(!caracsExist) aspectsUpdate[keyA].caracteristiques[keyC] = {}
                      if(!odExist) aspectsUpdate[keyA].caracteristiques[keyC].overdrive = {}
                    }

                    if(itemOD.has && base > 0) {
                      if(!odBaseExist) aspectsUpdate[keyA].caracteristiques[keyC].overdrive.base = [];

                      aspectsUpdate[keyA].caracteristiques[keyC].overdrive.base.push(base);
                    }

                    if(itemBonus.has && iBOD.has && bonus > 0) {
                      if(!odBonusExist) aspectsUpdate[keyA].caracteristiques[keyC].overdrive.bonus = [];

                      aspectsUpdate[keyA].caracteristiques[keyC].overdrive.bonus.push(bonus);
                    }
                  }
                }
              }

              if(eRogue.has) {
                moduleErsatz.rogue = eRogue;
                moduleErsatz.rogue.permanent = data.permanent;
                moduleErsatz.rogue.label = i.name;
                moduleErsatz.rogue._id = i._id;
                moduleErsatz.rogue.description = data.description;
              }
              if(eBard.has) {
                moduleErsatz.bard = eBard;
                moduleErsatz.bard.permanent = data.permanent;
                moduleErsatz.bard.label = i.name;
                moduleErsatz.bard._id = i._id;
                moduleErsatz.bard.description = data.description;
              }
            }
          }

          module.push(i);
          depensePG.push({
            order:data.addOrder,
            name:i.name,
            id:i._id,
            gratuit:data.gratuit,
            value:data.gratuit ? 0 : data.prix
          });
        }

      }

      // AVANTAGE.
      if (i.type === 'avantage') {
        if(data.type === 'standard') {
          avantage.push(i);

          sante.bonus.avantages.push(bonus.sante);
          espoir.bonus.avantages.push(bonus.espoir);
          espoir.recuperationBonus.push(bonus.recuperation.espoir);
          nods.soin.recuperationBonus.push(bonus.recuperation.sante);
          nods.armure.recuperationBonus.push(bonus.recuperation.armure);
          nods.energie.recuperationBonus.push(bonus.recuperation.energie);
          initiative.diceBonus.avantages.push(bonus.initiative.dice);
          initiative.bonus.avantages.push(bonus.initiative.fixe);

          if(bonus.initiative.ifEmbuscade.has) {
            bonusDiceEmbuscadeSubis += +bonus.initiative.ifEmbuscade.dice;
            bonusFixeEmbuscadeSubis += +bonus.initiative.ifEmbuscade.fixe;
          }
        } else if(data.type === 'ia') {
          avantageIA.push(i);
        }
      }

      // INCONVENIENT.
      if (i.type === 'inconvenient') {
        if(data.type === 'standard') {
          inconvenient.push(i);

          sante.malus.desavantages.push(malus.sante);
          espoir.malus.desavantages.push(malus.espoir);
          espoir.recuperationMalus.push(malus.recuperation.espoir);
          initiative.diceMalus.desavantages.push(malus.initiative.dice);
          initiative.malus.desavantages.push(malus.initiative.fixe);

          if(!espoir.aucun) {
            espoir.aucun = limitations.espoir.aucunGain;
          }
        } else if(data.type === 'ia') {
          inconvenientIA.push(i);
        }
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
        const dataBlessure = i.system.aspects;
        const soigne = game.i18n.localize("KNIGHT.AUTRE.Soigne");

        if(i.system.soigne.implant) {
          espoir.malus.blessures.push(3);
        }

        if(i.system.soigne.implant || i.system.soigne.reconstruction) { i.name += ` (${soigne})`; }

        for (let [keyA, aspect] of Object.entries(aspects)) {
          const vAspect = +dataBlessure?.[keyA]?.value || false;

          const aspectExist = aspectsUpdate?.[keyA] || false;
          const aspectMalusExist = aspectsUpdate?.[keyA]?.malus || false;

          if(vAspect !== false) {
            if(!aspectExist) aspectsUpdate[keyA] = {};
            if(!aspectMalusExist) aspectsUpdate[keyA].malus = [];

            aspectsUpdate[keyA].malus.push(vAspect);
          }

          for (let [keyC, carac] of Object.entries(aspect.caracteristiques)) {
            const vCaracs = +dataBlessure?.[keyA]?.caracteristiques?.[keyC].value || false;

            const caracsListExist = aspectsUpdate?.[keyA]?.caracteristiques || false;
            const caracsExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC] || false;
            const caracsMalusExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.malus || false;

            if(vCaracs > 0) {
              if(!aspectExist) aspectsUpdate[keyA] = {};
              if(!caracsListExist) aspectsUpdate[keyA].caracteristiques = {};
              if(!caracsExist) aspectsUpdate[keyA].caracteristiques[keyC] = {};
              if(!caracsMalusExist) aspectsUpdate[keyA].caracteristiques[keyC].malus = [];

              aspectsUpdate[keyA].caracteristiques[keyC].malus.push(vCaracs);
            }
          }
        }

        blessures.push(i);
      }

      // TRAUMA
      if (i.type === 'trauma') {
        const dataTrauma = i.system.aspects;

        for (let [keyA, aspect] of Object.entries(aspects)) {
          const vAspect = +dataTrauma?.[keyA]?.value || false;

          const aspectExist = aspectsUpdate?.[keyA] || false;
          const aspectMalusExist = aspectsUpdate?.[keyA]?.malus || false;

          if(vAspect !== false) {
            if(!aspectExist) aspectsUpdate[keyA] = {};
            if(!aspectMalusExist) aspectsUpdate[keyA].malus = [];

            aspectsUpdate[keyA].malus.push(vAspect);
          }

          for (let [keyC, carac] of Object.entries(aspect.caracteristiques)) {
            const vCaracs = +dataTrauma?.[keyA]?.caracteristiques?.[keyC].value || false;

            const caracsListExist = aspectsUpdate?.[keyA]?.caracteristiques || false;
            const caracsExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC] || false;
            const caracsMalusExist = aspectsUpdate?.[keyA]?.caracteristiques?.[keyC]?.malus || false;

            if(vCaracs > 0) {
              if(!aspectExist) aspectsUpdate[keyA] = {};
              if(!caracsListExist) aspectsUpdate[keyA].caracteristiques = {};
              if(!caracsExist) aspectsUpdate[keyA].caracteristiques[keyC] = {};
              if(!caracsMalusExist) aspectsUpdate[keyA].caracteristiques[keyC].malus = [];

              aspectsUpdate[keyA].caracteristiques[keyC].malus.push(vCaracs);
            }
          }
        }

        trauma.push(i);
      }

      // ARMES
      if (i.type === 'arme') {
        const type = data.type;
        const tourelle = data.tourelle;

        const armeRaw = i.system.effets.raw.concat(armorSpecialRaw);
        const armeCustom = i.system.effets.custom.concat(armorSpecialCustom);

        i.system.effets.raw = [...new Set(armeRaw)];
        i.system.effets.custom = armeCustom;

        depensePG.push({
          order:data.addOrder,
          id:i._id,
          name:i.name,
          gratuit:data.gratuit,
          value:data.gratuit ? 0 : data.prix
        });

        if(tourelle.has && type === 'distance') {
          armesTourelles.push(i);
        } else if(wear !== 'ascension') {

          const equipped = data?.equipped || false;
          const rack = data?.rack || false;

          const effetsRaw = i.system.effets.raw;
          const bDefense = effetsRaw.find(str => { if(str.includes('defense')) return str; });
          const bReaction = effetsRaw.find(str => { if(str.includes('reaction')) return str; });

          if (type === 'contact' && equipped === false && rack === false) { armesContactArmoury.push(i); }
          if (type === 'contact' && equipped === false && rack === true) { armesContactRack.push(i); }
          else if (type === 'contact' && equipped === true) {
            const bMassive = i.system.structurelles.raw.find(str => { if(str.includes('massive')) return true; });

            if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
            if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];
            if(bMassive) defense.malus += 1;

            armesContactEquipee.push(i);
          }
          else if (type === 'distance' && equipped === false && rack === false) { armesDistanceArmoury.push(i); }
          else if (type === 'distance' && equipped === false && rack === true) { armesDistanceRack.push(i); }
          else if (type === 'distance' && equipped === true) {
            if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
            if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

            armesDistanceEquipee.push(i);
          }
        }
      }

      if (i.type === 'armurelegende') {
        armureLegendeData = i;

        const armorCapacites = i.system.capacites.selected;

        for (let [key, capacite] of Object.entries(armorCapacites)) {
          switch(key) {
            case "type":
              const arrayTypes = Object.entries(capacite.type)
              const filterTypes = arrayTypes.filter(([key, value]) => (value.selectionne === true && value.conflit === true) || (value.selectionne === true && value.horsconflit === true));
              const bonus = filterTypes?.[0]?.[1] || false;

              if(bonus !== false) {
                for (let [keyC, carac] of Object.entries(bonus.liste)){
                  aspects[bonus.aspect].caracteristiques[keyC].overdrive.bonus += carac.value;
                }
              }
              break;

            case "vision":
              if(armorData.capacites.vision.energie < capacite.energie.min) armorData.capacites.vision.energie = capacite.energie.min;
              break;
          }
        }
      }
    }

    armesContactEquipee.sort(SortByName);
    armesContactRack.sort(SortByName);
    armesDistanceEquipee.sort(SortByName);
    armesDistanceRack.sort(SortByName);
    armesTourelles.sort(SortByName);
    avantage.sort(SortByName);
    inconvenient.sort(SortByName);
    avantageIA.sort(SortByName);
    inconvenientIA.sort(SortByName);
    langue.sort(SortByName);
    contact.sort(SortByName);
    depensePG.sort(SortByAddOrder)

    for (let [key, XP] of Object.entries(depenseXP)){

      if(XP.nom === undefined || XP.nom === 'autre' || XP.nom === 'capaciteheroique') return;

      let aspect = '';

      switch(XP.nom) {
        case 'chair':
        case 'deplacement':
        case 'force':
        case 'endurance':
          aspect = 'chair';
          break;

        case 'bete':
        case 'hargne':
        case 'combat':
        case 'instinct':
          aspect = 'bete';
          break;

        case 'machine':
        case 'tir':
        case 'savoir':
        case 'technique':
          aspect = 'machine';
          break;

        case 'dame':
        case 'aura':
        case 'parole':
        case 'sangFroid':
          aspect = 'dame';
          break;

        case 'masque':
        case 'discretion':
        case 'dexterite':
        case 'perception':
          aspect = 'masque';
          break;
      }

      const aspectExist = aspectsUpdate?.[aspect] || false;

      if(!aspectExist) aspectsUpdate[aspect] = {};

      if(XP.nom !== 'chair' && XP.nom !== 'dame' && XP.nom !== 'machine' && XP.nom !== 'bete' && XP.nom !== 'masque') {
        const CLExist = aspectsUpdate?.[aspect]?.caracteristiques || false;
        const CExist = aspectsUpdate?.[aspect]?.caracteristiques?.[XP.nom] || false;
        const CBExist = aspectsUpdate?.[aspect]?.caracteristiques?.[XP.nom]?.bonus || false;

        if(!CLExist) aspectsUpdate[aspect].caracteristiques = {};
        if(!CExist) aspectsUpdate[aspect].caracteristiques[XP.nom] = {};
        if(!CBExist) aspectsUpdate[aspect].caracteristiques[XP.nom].bonus = [];

        aspectsUpdate[aspect].caracteristiques[XP.nom].bonus.push(XP.bonus);
      } else if(XP.nom === 'chair' || XP.nom === 'dame' || XP.nom === 'machine' || XP.nom === 'bete' || XP.nom === 'masque') {
        const ABExist = aspectsUpdate?.[aspect]?.bonus || false;

        if(!ABExist) aspectsUpdate[aspect].bonus = [];

        aspectsUpdate[aspect].bonus.push(XP.bonus);
      }
    }

    for(let i = 0;i < armesContactEquipee.length;i++) {
      armesContactEquipee[i].system.degats.module = {};
      armesContactEquipee[i].system.degats.module.fixe = moduleBonusDgts.contact;
      armesContactEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.contact;

      armesContactEquipee[i].system.violence.module = {};
      armesContactEquipee[i].system.violence.module.fixe = moduleBonusViolence.contact;
      armesContactEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.contact;
    }

    for(let i = 0;i < armesDistanceEquipee.length;i++) {
      armesDistanceEquipee[i].system.degats.module = {};
      armesDistanceEquipee[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistanceEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistanceEquipee[i].system.violence.module = {};
      armesDistanceEquipee[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistanceEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    }

    for (let [key, grenade] of Object.entries(grenades)){
      const effetsRaw = grenade.effets.raw.concat(armorSpecialRaw);
      const effetsCustom = grenade.effets.custom.concat(armorSpecialCustom);

      grenades[key].effets.raw = [...new Set(effetsRaw)];
      grenades[key].effets.custom = [...new Set(effetsCustom)];
    };

    for (let [keyA, aspect] of Object.entries(aspectsUpdate)) {
      const caracteristiquesExist = aspect?.caracteristiques || false;
      const aspectsBonus = aspect?.bonus || false;
      const aspectsMalus = aspect?.malus || false;

      if(aspectsMalus !== false) aspects[keyA].malus = aspectsMalus.reduce(sum);
      if(aspectsBonus !== false) aspects[keyA].bonus = aspectsBonus.reduce(sum);

      if(caracteristiquesExist !== false) {
        for (let [keyC, carac] of Object.entries(aspect.caracteristiques)) {
          const cBonus = carac?.bonus || false;
          const cMalus = carac?.malus || false;
          const OD = carac?.overdrive || false;

          if(cBonus !== false) aspects[keyA].caracteristiques[keyC].bonus = cBonus.reduce(sum);
          if(cMalus !== false) aspects[keyA].caracteristiques[keyC].malus = cMalus.reduce(sum);

          if(OD !== false) {
            const oBase = OD?.base || false;
            const oBonus = OD?.bonus || false;
            const oMalus = OD?.malus || false;

            if(oBase !== false) aspects[keyA].caracteristiques[keyC].overdrive.base = Math.max(...oBase);
            if(oBonus !== false) aspects[keyA].caracteristiques[keyC].overdrive.bonus = oBonus.reduce(sum);
            if(oMalus !== false) aspects[keyA].caracteristiques[keyC].overdrive.malus = oMalus.reduce(sum);
          }
        }
      }

    }

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

    actorData.carteHeroique = carteHeroique;
    actorData.capaciteHeroique = capaciteHeroique;
    actorData.evolutionsCompanions = evolutionsCompanions;
    actorData.evolutionsAchetables = evolutionsAchetables;
    actorData.evolutionsAAcheter = evolutionsAAcheter;
    actorData.armureData = armureData;
    actorData.armureLegendeData = armureLegendeData;
    actorData.modules = module;
    actorData.moduleErsatz = moduleErsatz;
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
    actorData.armesDistanceEquipee = armesDistanceEquipee;
    actorData.armesDistanceRack = armesDistanceRack;
    actorData.armesDistanceArmoury = armesDistanceArmoury;
    actorData.armesTourelles = armesTourelles;

    const update = {
      system:{
        sante:{
          bonus:{
            avantages:sante.bonus.avantages.reduce(sum)
          },
          malus:{
            desavantages:sante.malus.desavantages.reduce(sum)
          }
        },
        egide:{
          bonus:{
            armure:egide.bonus.armure.reduce(sum)
          }
        },
        espoir:{
          value:espoir.value,
          bonus:{
            avantages:espoir.bonus.avantages.reduce(sum),
            armure:espoir.bonus.armure.reduce(sum)
          },
          malus:{
            desavantages:espoir.malus.desavantages.reduce(sum),
            blessures:espoir.malus.blessures.reduce(sum)
          },
          recuperation:{
            aucun:espoir.aucun,
            bonus:espoir.recuperationBonus.reduce(sum),
            malus:espoir.recuperationMalus.reduce(sum)
          },
          perte:{
            saufAgonie:espoir.perte.saufAgonie,
            saufCapacite:espoir.perte.saufCapacite
          }
        },
        initiative:{
          diceBonus:{
            avantages:initiative.diceBonus.avantages.reduce(sum)
          },
          bonus:{
            avantages:initiative.bonus.avantages.reduce(sum)
          },
          diceMalus:{
            desavantages:initiative.diceMalus.desavantages.reduce(sum)
          },
          malus:{
            desavantages:initiative.malus.desavantages.reduce(sum)
          }
        },
        aspects,
        equipements:{
          ascension:{
            armure:{
              bonus:{
                modules:armure.bonus.modules.reduce(sum)
              }
            },
            champDeForce:{
              bonus:{
                modules:champDeForce.bonus.modules.reduce(sum)
              }
            },
            energie:{
              bonus:{
                modules:energie.bonus.modules.reduce(sum)
              }
            }
          },
          armure:{
            armure:{
              bonus:{
                modules:armure.bonus.modules.reduce(sum)
              }
            },
            champDeForce:{
              bonus:{
                modules:champDeForce.bonus.modules.reduce(sum)
              }
            },
            energie:{
              bonus:{
                modules:energie.bonus.modules.reduce(sum)
              }
            },
            slots:{
              tete:slots.tete,
              torse:slots.torse,
              brasGauche:slots.brasGauche,
              brasDroit:slots.brasDroit,
              jambeGauche:slots.jambeGauche,
              jambeDroite:slots.jambeDroite
            }
          }
        },
        combat:{
          nods:nods,
          grenades:{
            liste:grenades
          }
        },
        reaction:{
          bonus:{
            armes:reaction.bonus
          },
          malus:{
            armes:reaction.malus
          }
        },
        defense:{
          bonus:{
            armes:defense.bonus
          },
          malus:{
            armes:defense.malus
          }
        },
        progression:{
          gloire:{
            depense:{
              liste:depensePG
            }
          }
        },
        bonusSiEmbuscade:{
          bonusInitiative:{
            dice:bonusDiceEmbuscadeSubis,
            fixe:bonusFixeEmbuscadeSubis,
          }
        }
      }
    }

    this.actor.update(update);

    // ON ACTUALISE ROLL UI S'IL EST OUVERT
    let rollUi = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? false;

    if(rollUi !== false) {
      const style = system.combat.style;
      const getStyle = getModStyle(style);

      await rollUi.setWpnContact(armesContactEquipee);
      await rollUi.setWpnDistance(armesDistanceEquipee);
      await rollUi.setWpnTourelle(armesTourelles);
      await rollUi.setStyle({
        fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`),
        label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`),
        raw:style,
        info:system.combat.styleInfo,
        caracteristiques:getStyle.caracteristiques,
        tourspasses:system.combat.data.tourspasses,
        type:system.combat.data.type,
        sacrifice:system.combat.data.sacrifice,
        maximum:6
      });

      rollUi.render(true);
    }
  }

  async _prepareCapacitesParameters(context) {
    const remplaceEnergie = context.actor?.armureData?.system?.espoir?.remplaceEnergie || false;
    const eTotale = remplaceEnergie === false ? context.data.system.energie.max : context.data.system.espoir.max;
    const eActuel = remplaceEnergie === false ? context.data.system.energie.value : context.data.system.espoir.value;

    const capacites = context.data.system.equipements.armure.capacites;
    const warlord = context.actor?.armureData?.system?.capacites?.selected?.warlord || false;
    const warlordLegende = context.actor?.armureLegendeData?.system?.capacites?.selected?.warlord || false;
    const illumination = context.actor?.armureData?.system?.capacites?.selected?.illumination || false;
    const companions = context.actor?.armureData?.system?.capacites?.selected?.companions || false;
    const type = context.actor?.armureData?.system?.capacites?.selected?.type || false;
    const typeLegende = context.actor?.armureLegendeData?.system?.capacites?.selected?.type || false;
    const vision = context.actor?.armureData?.system?.capacites?.selected?.vision || false;

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

  _prepareCapacitesTranslations(context) {
    this._prepareBorealisTranslation(context);
    this._prepareChangelingTranslation(context);
    this._prepareCompanionsTranslation(context);
    this._prepareCeaTranslation(context);
    this._prepareGhostTranslation(context);
    this._prepareGoliathTranslation(context);
    this._prepareIlluminationTranslation(context);
    this._prepareLongbowTranslation(context);
    this._prepareMorphTranslation(context);
    this._prepareOriflammeTranslation(context);

    this._prepareCompanionsLegendeTranslation(context);
    this._prepareGhostLegendeTranslation(context);
    this._prepareGoliathLegendeTranslation(context);
    this._prepareOriflammeLegendeTranslation(context);
  }

  _prepareBorealisTranslation(context) {
    const capacite = context.actor?.armureData?.system?.capacites?.selected?.borealis || false;
    if(capacite === false) return;

    const bRaw = capacite.offensif.effets.raw;
    const bCustom = capacite.offensif.effets.custom;
    const labels = CONFIG.KNIGHT.effets;

    capacite.offensif.effets.liste = listEffects(bRaw, bCustom, labels);
  }

  _prepareChangelingTranslation(context) {
    const capacite = context.actor?.armureData?.system?.capacites?.selected?.changeling || false;
    if(capacite === false) return;

    const bRaw = capacite.desactivationexplosive.effets.raw;
    const bCustom = capacite.desactivationexplosive.effets.custom;
    const labels = CONFIG.KNIGHT.effets;

    capacite.desactivationexplosive.effets.liste = listEffects(bRaw, bCustom, labels);
  }

  _prepareCompanionsTranslation(context) {
    const companions = context.actor?.armureData?.system?.capacites.selected?.companions;
    const lEffets = companions?.lion?.armes || false;
    const wEffets = companions?.wolf?.armes || false;
    const bEffets = companions?.wolf?.configurations?.fighter?.bonus?.effets || false;

    if(!companions) return;

    const labels = CONFIG.KNIGHT.effets;


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

  _prepareCompanionsLegendeTranslation(context) {
    const companions = context.actor?.armureLegendeData?.system?.capacites.selected?.companions;
    const lEffets = companions?.lion?.armes || false;
    const wEffets = companions?.wolf?.armes || false;
    const bEffets = companions?.wolf?.configurations?.fighter?.bonus?.effets || false;

    if(!companions) return;

    const labels = CONFIG.KNIGHT.effets;


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

  _prepareCeaTranslation(context) {
    const capacite = context.actor?.armureData?.system?.capacites?.selected?.cea || false;
    if(capacite === false) return;

    const bSRaw = capacite.salve.effets.raw;
    const bSCustom = capacite.salve.effets.custom;
    const bVRaw = capacite.vague.effets.raw;
    const bVCustom = capacite.vague.effets.custom;
    const bRRaw = capacite.rayon.effets.raw;
    const bRCustom = capacite.rayon.effets.custom;
    const labels = CONFIG.KNIGHT.effets;

    capacite.salve.effets.liste = listEffects(bSRaw, bSCustom, labels);
    capacite.vague.effets.liste = listEffects(bVRaw, bVCustom, labels);
    capacite.rayon.effets.liste = listEffects(bRRaw, bRCustom, labels);
  }

  _prepareGhostTranslation(context) {
    const capacite = context.actor?.armureData?.system?.capacites?.selected?.ghost || false;
    if(capacite === false) return;

    const bonus = capacite.bonus.degats;
    const inclus = bonus.inclus;

    const odInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odinclus"]);
    const odNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odnoinclus"]);

    const diceInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["diceinclus"]);
    const diceNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["dicenoinclus"]);

    const fixeInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixeinclus"]);
    const fixeNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixenoinclus"]);

    if(bonus.dice === true) { inclus.dice = diceInclus; }
    else { inclus.dice = diceNoInclus; }

    if(bonus.fixe === true) { inclus.fixe = fixeInclus; }
    else { inclus.fixe = fixeNoInclus; }

    if(bonus.od === true) { inclus.od = odInclus; }
    else { inclus.od = odNoInclus; }
  }

  _prepareGhostLegendeTranslation(context) {
    const capacite = context.actor?.armureLegendeData?.system?.capacites?.selected?.ghost || false;
    if(capacite === false) return;

    const bonus = capacite.bonus.degats;
    const inclus = bonus.inclus;

    const odInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odinclus"]);
    const odNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odnoinclus"]);

    const diceInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["diceinclus"]);
    const diceNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["dicenoinclus"]);

    const fixeInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixeinclus"]);
    const fixeNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixenoinclus"]);

    if(bonus.dice === true) { inclus.dice = diceInclus; }
    else { inclus.dice = diceNoInclus; }

    if(bonus.fixe === true) { inclus.fixe = fixeInclus; }
    else { inclus.fixe = fixeNoInclus; }

    if(bonus.od === true) { inclus.od = odInclus; }
    else { inclus.od = odNoInclus; }
  }

  _prepareGoliathTranslation(context) {
    const capacite = context.actor?.armureData?.system?.capacites?.selected?.goliath?.armesRack || false;
    if(capacite === false) return;

    if(capacite.active) {
      capacite.label = game.i18n.localize(CONFIG.KNIGHT.goliath["armesrack"])+" "+capacite.value+" "+game.i18n.localize(CONFIG.KNIGHT.goliath["metrebonus"]).toLowerCase();
    } else {
      capacite.label = game.i18n.localize(CONFIG.KNIGHT.goliath["armesnorack"]);
    }
  }

  _prepareGoliathLegendeTranslation(context) {
    const capacite = context.actor?.armureLegendeData?.system?.capacites?.selected?.goliath?.armesRack || false;
    if(capacite === false) return;

    if(capacite.active) {
      capacite.label = game.i18n.localize(CONFIG.KNIGHT.goliath["armesrack"])+" "+capacite.value+" "+game.i18n.localize(CONFIG.KNIGHT.goliath["metrebonus"]).toLowerCase();
    } else {
      capacite.label = game.i18n.localize(CONFIG.KNIGHT.goliath["armesnorack"]);
    }
  }

  _prepareIlluminationTranslation(context) {
    const capacite = context.actor?.armureData?.system?.capacites?.selected?.illumination || false;
    if(capacite === false) return;

    const beacon = capacite.beacon;
    const candle = capacite.candle;
    const torch = capacite.torch;
    const lighthouse = capacite.lighthouse;
    const lantern = capacite.lantern;
    const blaze = capacite.blaze;
    const projector = capacite.projector;

    beacon.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.beacon.portee.charAt(0).toUpperCase()+capacite.beacon.portee.substr(1)}`);
    candle.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.candle.portee.charAt(0).toUpperCase()+capacite.candle.portee.substr(1)}`);
    torch.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.torch.portee.charAt(0).toUpperCase()+capacite.torch.portee.substr(1)}`);
    lighthouse.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.lighthouse.portee.charAt(0).toUpperCase()+capacite.lighthouse.portee.substr(1)}`);
    lantern.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.lantern.portee.charAt(0).toUpperCase()+capacite.lantern.portee.substr(1)}`);
    blaze.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.blaze.portee.charAt(0).toUpperCase()+capacite.blaze.portee.substr(1)}`);
    projector.labelPortee = game.i18n.localize(`KNIGHT.AUTRE.PORTEE.${capacite.projector.portee.charAt(0).toUpperCase()+capacite.projector.portee.substr(1)}`);

    const raw = lantern.effets.raw;
    const custom = lantern.effets.custom;
    const labels = CONFIG.KNIGHT.effets;

    lantern.effets.liste = listEffects(raw, custom, labels);
  }

  _prepareLongbowTranslation(context) {
    const longbow = context.actor?.armureData?.system?.capacites?.selected?.longbow || false;

    if(longbow === false) return;

    const effets = longbow.effets;

    const lEB = effets.base;
    const lRB = lEB.raw;
    const lCB = lEB.custom;

    const lE1 = effets.liste1;
    const lR1 = lE1.raw;
    const lC1 = lE1.custom;

    const lE2 = effets.liste2;
    const lR2 = lE2.raw;
    const lC2 = lE2.custom;

    const lE3 = effets.liste3;
    const lR3 = lE3.raw;
    const lC3 = lE3.custom;

    const effetsb = [];
    const effets1 = [];
    const effets2 = [];
    const effets3 = [];

    const lEffets3 = lE3.acces;

    for(let n = 0;n < lRB.length;n++) {
      const split = lRB[n].split(" ");
      const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
      const sub = split[1];
      let complet = name;

      if(sub != undefined) { complet += " "+sub; }

      effetsb.push({
        name:complet,
        description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
      });
    }

    for(let n = 0;n < lCB.length;n++) {
      effetsb.push({
        name:lCB[n].label,
        description:lCB[n].description,
        custom:true
      });
    }

    for(let n = 0;n < lR1.length;n++) {
      const split = lR1[n].split(" ");
      const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
      const sub = split[1];
      let complet = name;

      if(sub != undefined) { complet += " "+sub; }

      effets1.push({
        raw:lR1[n],
        name:complet,
        description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
      });
    }

    for(let n = 0;n < lC1.length;n++) {
      effets1.push({
        name:lC1[n].label,
        description:lC1[n].description,
        custom:true
      });
    }

    for(let n = 0;n < lR2.length;n++) {
      const split = lR2[n].split(" ");
      const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
      const sub = split[1];
      let complet = name;

      if(sub != undefined) { complet += " "+sub; }

      effets2.push({
        raw:lR2[n],
        name:complet,
        description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
      });
    }

    for(let n = 0;n < lC2.length;n++) {
      effets2.push({
        name:lC2[n].label,
        description:lC2[n].description,
        custom:true
      });
    }

    for(let n = 0;n < lR3.length;n++) {
      const split = lR3[n].split(" ");
      const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
      const sub = split[1];
      let complet = name;

      if(sub != undefined) { complet += " "+sub; }

      effets3.push({
        raw:lR3[n],
        name:complet,
        description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
      });
    }

    for(let n = 0;n < lC3.length;n++) {
      effets3.push({
        name:lC3[n].label,
        description:lC3[n].description,
        custom:true
      });
    }

    function _sortByName(x, y){
      if (x.name.toLowerCase() < y.name.toLowerCase()) {return -1;}
      if (x.name.toLowerCase() > y.name.toLowerCase()) {return 1;}
      return 0;
    }

    effetsb.sort(_sortByName);
    effets1.sort(_sortByName);
    effets2.sort(_sortByName);
    effets3.sort(_sortByName);

    longbow.effets.base.liste = effetsb;
    longbow.effets.liste1.liste = effets1;
    longbow.effets.liste2.liste = effets2;
    longbow.effets.liste3.liste = effets3;

    if(lEffets3) {
      lE3.label = game.i18n.localize(CONFIG.KNIGHT.longbow["effets3"]);
    } else {
      lE3.label = game.i18n.localize(CONFIG.KNIGHT.longbow["noeffets3"]);
    }
  }

  _prepareMorphTranslation(context) {
    const morph = context.actor?.armureData?.system?.capacites?.selected?.morph || false;

    if(morph === false) return;

    const effetsG = morph.polymorphie.griffe.effets;
    const rawG = effetsG.raw;
    const customG = effetsG.custom;
    const labels = CONFIG.KNIGHT.effets;

    const effetsL = morph.polymorphie.lame.effets;
    const rawL = effetsL.raw;
    const customL = effetsL.custom;

    const effetsC = morph.polymorphie.canon.effets;
    const rawC = effetsC.raw;
    const customC = effetsC.custom;

    effetsG.liste = listEffects(rawG, customG, labels);
    effetsL.liste = listEffects(rawL, customL, labels);
    effetsC.liste = listEffects(rawC, customC, labels);
  }

  _prepareOriflammeTranslation(context) {
    const oriflamme = context.actor?.armureData?.system?.capacites?.selected?.oriflamme || false;

    if(oriflamme === false) return;

    const effets = oriflamme.effets;
    const raw = effets.raw;
    const custom = effets.custom;
    const labels = CONFIG.KNIGHT.effets;

    effets.liste = listEffects(raw, custom, labels);
  }

  _prepareOriflammeLegendeTranslation(context) {
    const oriflamme = context.actor?.armureLegendeData?.system?.capacites?.selected?.oriflamme || false;

    if(oriflamme === false) return;

    const effets = oriflamme.effets;
    const raw = effets.raw;
    const custom = effets.custom;
    const labels = CONFIG.KNIGHT.effets;

    effets.liste = listEffects(raw, custom, labels);
  }

  _prepareSpecialTranslations(context) {
    this._prepareContrecoupsTranslation(context);
    this._preparePorteurLumiereTranslation(context);
  }

  _prepareContrecoupsTranslation(context) {
    const contrecoups = context.actor?.armureData?.system?.special?.selected?.contrecoups || false;

    if(contrecoups === false) return;

    const relance = contrecoups.relance.value;

    if(relance) {
      contrecoups.relance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["relance"]);
    } else {
      contrecoups.relance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["norelance"]);
    }

    const maxeffets = contrecoups.maxeffets.value;

    if(maxeffets) {
      contrecoups.maxeffets.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["maxeffets"]);
    } else {
      contrecoups.maxeffets.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["nomaxeffets"]);
    }

    const armedistance = contrecoups.armedistance.value;

    if(armedistance) {
      contrecoups.armedistance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["armedistance"]);
    } else {
      contrecoups.armedistance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["noarmedistance"]);
    }
  }

  _preparePorteurLumiereTranslation(context) {
    const porteurlumiere = context.actor?.armureData?.system?.special?.selected?.porteurlumiere || false;

    if(porteurlumiere === false) return;

    const ePorteur = porteurlumiere.bonus.effets;
    const labelsE = CONFIG.KNIGHT.effets;

    ePorteur.liste = listEffects(ePorteur.raw, ePorteur.custom, labelsE);
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

  _prepareWpnEffets(context) {
    const aCEEffets = context.actor?.armesContactEquipee || false;
    const aDEEffets = context.actor?.armesDistanceEquipee || false;
    const aCEffets = context.actor?.armesContactRack || false;
    const aDEffets = context.actor?.armesDistanceRack || false;
    const aCAEffets = context.actor?.armesContactArmoury || false;
    const aDAEffets = context.actor?.armesDistanceArmoury || false;

    const labelsE = CONFIG.KNIGHT.effets;
    const labelsD = CONFIG.KNIGHT.AMELIORATIONS.distance;
    const labelsS = CONFIG.KNIGHT.AMELIORATIONS.structurelles;
    const labelsO = CONFIG.KNIGHT.AMELIORATIONS.ornementales;


    if(aCEffets !== false) {
      for (let [key, effets] of Object.entries(aCEffets)) {
        const bRaw = effets.system?.effets?.raw || [];
        const bCustom = effets.system?.effets?.custom || [];

        const bRDistance = effets.system?.distance?.raw || [];
        const bCDistance = effets.system?.distance?.custom || [];

        const bRStructurelles = effets.system?.structurelles?.raw || [];
        const bCStructurelles = effets.system?.structurelles?.custom || [];

        const bROrnementales = effets.system?.ornementales?.raw || [];
        const bCOrnementales = effets.system?.ornementales?.custom || [];

        effets.system.effets.liste = listEffects(bRaw, bCustom, labelsE);
        if(bRDistance.length !== 0) effets.system.distance.liste = listEffects(bRDistance, bCDistance, labelsD);
        if(bRStructurelles.length !== 0) effets.system.structurelles.liste = listEffects(bRStructurelles, bCStructurelles, labelsS);
        if(bROrnementales.length !== 0) effets.system.ornementales.liste = listEffects(bROrnementales, bCOrnementales, labelsO);
      };
    }

    if(aDEffets !== false) {
      for (let [key, effets] of Object.entries(aDEffets)) {
        const bRaw = effets.system?.effets?.raw || [];
        const bCustom = effets.system?.effets?.custom || [];

        const bRDistance = effets.system?.distance?.raw || [];
        const bCDistance = effets.system?.distance?.custom || [];

        const bRStructurelles = effets.system?.structurelles?.raw || [];
        const bCStructurelles = effets.system?.structurelles?.custom || [];

        const bROrnementales = effets.system?.ornementales?.raw || [];
        const bCOrnementales = effets.system?.ornementales?.custom || [];

        effets.system.effets.liste = listEffects(bRaw, bCustom, labelsE);
        if(bRDistance.length !== 0) effets.system.distance.liste = listEffects(bRDistance, bCDistance, labelsD);
        if(bRStructurelles.length !== 0) effets.system.structurelles.liste = listEffects(bRStructurelles, bCStructurelles, labelsS);
        if(bROrnementales.length !== 0) effets.system.ornementales.liste = listEffects(bROrnementales, bCOrnementales, labelsO);
      };

    }

    if(aCEEffets !== false) {
      for (let [key, effets] of Object.entries(aCEEffets)) {
        const bRaw = effets.system?.effets?.raw || [];
        const bCustom = effets.system?.effets?.custom || [];

        const bRDistance = effets.system?.distance?.raw || [];
        const bCDistance = effets.system?.distance?.custom || [];

        const bRStructurelles = effets.system?.structurelles?.raw || [];
        const bCStructurelles = effets.system?.structurelles?.custom || [];

        const bROrnementales = effets.system?.ornementales?.raw || [];
        const bCOrnementales = effets.system?.ornementales?.custom || [];

        effets.system.effets.liste = listEffects(bRaw, bCustom, labelsE);

        if(bRDistance.length !== 0) effets.system.distance.liste = listEffects(bRDistance, bCDistance, labelsD);
        if(bRStructurelles.length !== 0) effets.system.structurelles.liste = listEffects(bRStructurelles, bCStructurelles, labelsS);
        if(bROrnementales.length !== 0) effets.system.ornementales.liste = listEffects(bROrnementales, bCOrnementales, labelsO);
      };
    }

    if(aDEEffets !== false) {
      for (let [key, effets] of Object.entries(aDEEffets)) {
        const bRaw = effets.system?.effets?.raw || [];
        const bCustom = effets.system?.effets?.custom || [];

        const bRDistance = effets.system?.distance?.raw || [];
        const bCDistance = effets.system?.distance?.custom || [];

        const bRStructurelles = effets.system?.structurelles?.raw || [];
        const bCStructurelles = effets.system?.structurelles?.custom || [];

        const bROrnementales = effets.system?.ornementales?.raw || [];
        const bCOrnementales = effets.system?.ornementales?.custom || [];

        effets.system.effets.liste = listEffects(bRaw, bCustom, labelsE);
        if(bRDistance.length !== 0) effets.system.distance.liste = listEffects(bRDistance, bCDistance, labelsD);
        if(bRStructurelles.length !== 0) effets.system.structurelles.liste = listEffects(bRStructurelles, bCStructurelles, labelsS);
        if(bROrnementales.length !== 0) effets.system.ornementales.liste = listEffects(bROrnementales, bCOrnementales, labelsO);
      };

    }

    if(aCAEffets !== false) {
      for (let [key, effets] of Object.entries(aCAEffets)) {
        const bRaw = effets.system?.effets?.raw || [];
        const bCustom = effets.system?.effets?.custom || [];

        const bRDistance = effets.system?.distance?.raw || [];
        const bCDistance = effets.system?.distance?.custom || [];

        const bRStructurelles = effets.system?.structurelles?.raw || [];
        const bCStructurelles = effets.system?.structurelles?.custom || [];

        const bROrnementales = effets.system?.ornementales?.raw || [];
        const bCOrnementales = effets.system?.ornementales?.custom || [];

        effets.system.effets.liste = listEffects(bRaw, bCustom, labelsE);
        if(bRDistance.length !== 0) effets.system.distance.liste = listEffects(bRDistance, bCDistance, labelsD);
        if(bRStructurelles.length !== 0) effets.system.structurelles.liste = listEffects(bRStructurelles, bCStructurelles, labelsS);
        if(bROrnementales.length !== 0) effets.system.ornementales.liste = listEffects(bROrnementales, bCOrnementales, labelsO);
      };
    }

    if(aDAEffets !== false) {
      for (let [key, effets] of Object.entries(aDAEffets)) {
        const bRaw = effets.system?.effets?.raw || [];
        const bCustom = effets.system?.effets?.custom || [];

        const bRDistance = effets.system?.distance?.raw || [];
        const bCDistance = effets.system?.distance?.custom || [];

        const bRStructurelles = effets.system?.structurelles?.raw || [];
        const bCStructurelles = effets.system?.structurelles?.custom || [];

        const bROrnementales = effets.system?.ornementales?.raw || [];
        const bCOrnementales = effets.system?.ornementales?.custom || [];

        effets.system.effets.liste = listEffects(bRaw, bCustom, labelsE);
        if(bRDistance.length !== 0) effets.system.distance.liste = listEffects(bRDistance, bCDistance, labelsD);
        if(bRStructurelles.length !== 0) effets.system.structurelles.liste = listEffects(bRStructurelles, bCStructurelles, labelsS);
        if(bROrnementales.length !== 0) effets.system.ornementales.liste = listEffects(bROrnementales, bCOrnementales, labelsO);
      };
    }
  }

  _prepareOverdrives(aspect, name, data, context) {
    const actor = context.actor?.overdrives || false;
    const aspects = context.actor?.overdrives?.[aspect] || false;
    const OD = data.overdrive.value;

    if(!actor) context.actor.overdrives = {};

    let result = {};

    for(let i = 1;i <= OD;i++) {
      const string = `KNIGHT.ASPECTS.${aspect.toUpperCase()}.CARACTERISTIQUES.${name.toUpperCase()}.OD${i}`;
      const translation = game.i18n.localize(string);
      const listExist = result?.liste || false;

      if(translation !== string) {
        if(!listExist) result.liste = {};
        result.liste[`OD${i}`] = {};
        result.liste[`OD${i}`].value = i;
        result.liste[`OD${i}`].description = translation;
      }
    }

    const length = Object.keys(result).length;

    if(length > 0) {
      result['OD'] = game.i18n.localize(`KNIGHT.ASPECTS.${aspect.toUpperCase()}.CARACTERISTIQUES.${name.toUpperCase()}.OD`);

      if(!aspects) context.actor.overdrives[aspect] = {};
      context.actor.overdrives[aspect][name] = result;
    }
  }

  _maxValue(sheetData) {
    const data = sheetData.data.system;
    const list = [`sante`, `espoir`];

    for(let i = 0;i < list.length;i++) {
      const dataBase = data[list[i]];

      if(dataBase.value > dataBase.max) { dataBase.value = dataBase.max; }
    }
  }

  async _depensePE(label, depense, autosubstract=true, forceEspoir=false, flux=false, capacite=true) {
    const data = this.getData();
    const armorId = data.systemData.equipements.armure.id;
    const getArmor = this.actor.items.get(armorId).system;
    const remplaceEnergie = getArmor.espoir.remplaceEnergie || false;

    const type = remplaceEnergie === true || forceEspoir === true ? 'espoir' : 'energie';
    const hasFlux = +data.systemData.jauges.flux;
    const fluxActuel = +data.systemData.flux.value;
    const actuel = remplaceEnergie === true || forceEspoir === true ? +data.systemData.espoir.value : +data.systemData.energie.value;
    const substract = actuel-depense;
    const hasJauge = data.systemData.jauges[type];

    if(!hasJauge) return false;

    if(flux != false && hasFlux) {
      if(fluxActuel < flux) { return false; }
    }

    if(substract < 0) {
      const lNot = remplaceEnergie ? game.i18n.localize('KNIGHT.JETS.Notespoir') : game.i18n.localize('KNIGHT.JETS.Notenergie');

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

      ChatMessage.create(msgEnergieData);

      return false;
    } else {

      if(autosubstract) {
        let update = {
          system:{
            [type]:{
              value:substract
            }
          }
        }

        if(flux != false) {
          update.system.flux = {};
          update.system.flux.value = fluxActuel-flux;
        }

        if(type === 'espoir' && this.getData().systemData.espoir.perte.saufAgonie && capacite === true) {
          update.system.espoir.value = actuel;
        }

        this.actor.update(update);
      }

      return true;
    }
  }

  _gainPE(gain, autoadd=true, forceEspoir=false) {
    const data = this.getData();
    const remplaceEnergie = this.actor.items.get(data.systemData.equipements.armure.id).system.espoir.remplaceEnergie || false;

    const type = remplaceEnergie === true || forceEspoir === true ? 'espoir' : 'energie';
    const actuel = remplaceEnergie === true || forceEspoir === true ? +data.systemData.espoir.value : +data.systemData.energie.value;
    const total = remplaceEnergie === true || forceEspoir === true ? +data.systemData.espoir.max : +data.systemData.energie.max;
    let add = actuel+gain;

    if(add > total) {
      add = total;
    }

    if(autoadd) {
      let update = {
        system:{
          [type]:{
            value:add
          }
        }
      }

      this.actor.update(update);
    }

    return true;
  }

  _updatePA(update) {
    const add = +update;
    const wear = this.object.system.wear;

    let itemUpdate = ``;
    let maj = {}

    switch(wear) {
      case 'armure':
        itemUpdate = `system.armure.value`;

        this.actor.items.get(this._getArmorId()).update({[itemUpdate]:add});
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

  _getCaracValue(c) {
    return +this.getData().actor.caracteristiques[c].value;
  }

  _getODValue(c) {
    const wear = this.getData().data.system.wear;
    let result = 0;

    if(wear === 'armure' || wear === 'ascension') { result = +this.getData().actor.caracteristiques[c].od; }

    return result;
  }

  _setCombos(aspects, toAdd = [], toLock = []) {
    const lAspectsInterdits = this.getData().data.system.combos.interdits.aspects;
    const lCaracsInterdits = this.getData().data.system.combos.interdits.caracteristiques;
    const lAspectsBonus = this.getData().data.system.combos.bonus.aspects;
    const lCaracsBonus = foundry.utils.mergeObject(this.getData().data.system.combos.bonus.caracteristiques, {add:toAdd});
    let interdits = [];
    let bonus = [];
    let lock = [];

    for (let [key, interdit] of Object.entries(lAspectsInterdits)){
      interdits = interdits.concat(interdit);
    }

    for (let [key, interdit] of Object.entries(lCaracsInterdits)){
      interdits = interdits.concat(interdit);
    }

    for (let [key, add] of Object.entries(lAspectsBonus)){
      for(let i = 0; i < add.length;i++) {
        if(!interdits.includes(add[i])) {
          bonus.push(add[i]);
        }
      }
    }

    for (let [key, add] of Object.entries(lCaracsBonus)){
      for(let i = 0; i < add.length;i++) {
        if(!interdits.includes(add[i])) {
          bonus.push(add[i]);
        }
      }
    }

    for (let [kAspect, aspect] of Object.entries(aspects)){
      if(interdits.includes(kAspect)) {
        delete aspects[kAspect];
      }

      for (let [kCaracs, carac] of Object.entries(aspect.caracteristiques)){
        if(bonus.includes(kCaracs)) {
          aspects[kAspect].caracteristiques[kCaracs].lock = false;
          bonus.push(kCaracs);
        }

        if(toLock.includes(kCaracs)) {
          aspects[kAspect].caracteristiques[kCaracs].lock = true;
          lock.push(kCaracs);
        }

        if(interdits.includes(kCaracs)) {
          delete aspects[kAspect].caracteristiques[kCaracs];
        }
      }
    }

    bonus = [...new Set(bonus)];
    lock = [...new Set(lock)];
    interdits = [...new Set(interdits)];

    const result = {
      aspects,
      bonus,
      interdits,
      lock
    };

    return result;
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

  async _rollDice(label, caracteristique, difficulte = false, toAdd = [], toLock = [], isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, reussitesBonus=0) {
    const data = this.getData();
    const rollApp = this._getKnightRoll();
    const mCombos = this._setCombos(data.data.system.aspects, toAdd, toLock);
    const select = mCombos.bonus.includes(caracteristique) || mCombos.interdits.includes(caracteristique) ? '' : caracteristique;
    const aspects = mCombos.aspects;
    const bonus = mCombos.bonus;
    const style = data.systemData.combat.style;
    const getStyle = getModStyle(style);
    const deployWpnImproviseesDistance = typeWpn === 'armesimprovisees' && idWpn === 'distance' ? true : false;
    const deployWpnImproviseesContact = typeWpn === 'armesimprovisees' && idWpn === 'contact' ? true : false;
    const deployWpnDistance = typeWpn === 'distance' ? true : false;
    const deployWpnTourelle = typeWpn === 'tourelle' ? true : false;
    const deployWpnContact = typeWpn === 'contact' ? true : false;
    const deployGrenades = typeWpn === 'grenades' ? true : false;
    const deployLongbow = typeWpn === 'longbow' ? true : false;
    const hasBarrage = typeWpn === 'grenades' ? data.data.system.combat.grenades.liste[nameWpn].effets.raw.find(str => { if(str.includes('barrage')) return true; }) : false;
    const rBonus = reussitesBonus === 0 ? data.data.system.combat.data.succesbonus : reussitesBonus;
    let base = select === '' ? bonus[0] : caracteristique;

    if(base === undefined) {base = '';}

    if(select === '') { bonus.shift(); }

    await rollApp.setActor(this.actor.id);
    await rollApp.setAspects(aspects);
    await rollApp.setEffets(hasBarrage, true, true, true);
    await rollApp.setStyle({
      fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`),
      label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`),
      raw:style,
      info:data.systemData.combat.styleInfo,
      caracteristiques:getStyle.caracteristiques,
      tourspasses:data.data.system.combat.data.tourspasses,
      type:data.data.system.combat.data.type,
      sacrifice:data.data.system.combat.data.sacrifice,
      maximum:6
    });
    await rollApp.setData(label, select, bonus, mCombos.lock, difficulte,
      data.data.system.combat.data.modificateur, rBonus,
      {dice:data.data.system.combat.data.degatsbonus.dice, fixe:data.data.system.combat.data.degatsbonus.fixe},
      {dice:data.data.system.combat.data.violencebonus.dice, fixe:data.data.system.combat.data.violencebonus.fixe},
      data.actor.armesContactEquipee, data.actor.armesDistanceEquipee, data.actor.armesTourelles, data.systemData.combat.grenades.liste, {contact:data.systemData.combat.armesimprovisees.liste, distance:data.systemData.combat.armesimprovisees.liste}, [], data.actor.longbow,
      isWpn, idWpn, nameWpn, typeWpn, num,
      deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseesContact, deployWpnImproviseesDistance, deployGrenades, deployLongbow, false,
      false, false);

    rollApp.render(true);
  }

  async _resetArmureCapacites() {
    const data = this.getData();
    const idArmure = data.systemData.equipements?.armure?.id || false;

    if(!idArmure) return;

    const armure = this.actor.items.get(this._getArmorId());
    const armorCapacites = armure.system.capacites.selected;
    const capaciteCompanions = armorCapacites?.companions || false;
    const capacites = {
      system:{
        equipements:{
          armure:{
            champDeForce:{
              bonus:{}
            },
            capacites:{
              ascension:{},
              borealis:{},
              changeling:{},
              companions:{},
              shrine:{},
              ghost:{},
              goliath:{},
              illumination:{},
              morph:{},
              rage:{
                niveau:{}
              },
              warlord:{
                action:{},
                guerre:{},
                force:{},
                esquive:{}
              },
              type:{
                soldier:{},
                hunter:{},
                scholar:{},
                herald:{},
                scout:{},
              }
            }
          }
        },
        reaction:{
          bonus:{},
          malus:{}
        },
        defense:{
          bonus:{},
          malus:{}
        },
        egide:{
          bonus:{},
          malus:{}
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
        },
        aspects:{
          chair:{
            caracteristiques:{
              deplacement:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              force:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              endurance:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              }
            }
          },
          bete:{
            caracteristiques:{
              hargne:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              combat:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              instinct:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              }
            }
          },
          machine:{
            caracteristiques:{
              tir:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              savoir:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              technique:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              }
            }
          },
          dame:{
            caracteristiques:{
              aura:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              parole:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              sangFroid:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              }
            }
          },
          masque:{
            caracteristiques:{
              discretion:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              dexterite:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              },
              perception:{
                overdrive:{
                  bonus:{},
                  malus:{}
                }
              }
            }
          }
        }
      }
    }

    if(capaciteCompanions !== false) {
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
    }

    capacites.system.equipements.armure.capacites.borealis.support = false;
    capacites.system.equipements.armure.capacites.borealis.offensif = false;
    capacites.system.equipements.armure.capacites.borealis.utilitaire = false;
    capacites.system.equipements.armure.capacites.borealis.allie = 0;

    capacites.system.equipements.armure.capacites.changeling.personnel = false;
    capacites.system.equipements.armure.capacites.changeling.etendue = false;

    capacites.system.equipements.armure.capacites.companions.active = false;
    capacites.system.equipements.armure.capacites.companions.lion = false;
    capacites.system.equipements.armure.capacites.companions.wolf = false;
    capacites.system.equipements.armure.capacites.companions.crow = false;

    capacites.system.equipements.armure.capacites.shrine.active = false;
    capacites.system.equipements.armure.capacites.shrine.activePersonnel = false;
    capacites.system.equipements.armure.capacites.shrine.activeDistance = false;
    capacites.system.equipements.armure.capacites.shrine.activePersonnel6 = false;
    capacites.system.equipements.armure.capacites.shrine.activeDistance6 = false;

    capacites.system.equipements.armure.capacites.ghost.conflit = false;
    capacites.system.equipements.armure.capacites.ghost.horsconflit = false;

    capacites.system.equipements.armure.capacites.goliath.active = false;
    capacites.system.equipements.armure.capacites.goliath.metre = 0;
    capacites.system.equipements.armure.champDeForce.bonus.goliath = 0;
    capacites.system.reaction.malus.goliath = 0;
    capacites.system.defense.malus.goliath = 0;

    capacites.system.equipements.armure.capacites.illumination.torch = false;
    capacites.system.equipements.armure.capacites.illumination.lighthouse = false;
    capacites.system.equipements.armure.capacites.illumination.lantern = false;
    capacites.system.equipements.armure.capacites.illumination.blaze = false;
    capacites.system.equipements.armure.capacites.illumination.beacon = false;
    capacites.system.equipements.armure.capacites.illumination.projector = false;

    capacites.system.equipements.armure.capacites.morph.active = false;
    capacites.system.equipements.armure.capacites.morph.nbre = 0;
    capacites.system.equipements.armure.capacites.morph.choisi = false;
    capacites.system.equipements.armure.capacites.morph.vol = false;
    capacites.system.equipements.armure.capacites.morph.phase = false;
    capacites.system.equipements.armure.capacites.morph.etirement = false;
    capacites.system.equipements.armure.capacites.morph.metal = false;
    capacites.system.equipements.armure.capacites.morph.fluide = false;
    capacites.system.equipements.armure.capacites.morph.polymorphie = false;
    capacites.system.equipements.armure.champDeForce.bonus.morph = 0;
    capacites.system.reaction.bonus.morph = 0;
    capacites.system.defense.bonus.morph = 0;

    capacites.system.equipements.armure.capacites.rage.active = false;
    capacites.system.equipements.armure.capacites.rage.niveau.colere = false;
    capacites.system.equipements.armure.capacites.rage.niveau.fureur = false;
    capacites.system.equipements.armure.capacites.rage.niveau.rage = false;
    capacites.system.egide.bonus.rage = 0;
    capacites.system.reaction.malus.rage = 0;
    capacites.system.defense.malus.rage = 0;
    capacites.system.combos.interdits.caracteristiques.rage = [];
    capacites.system.combos.bonus.caracteristiques.rage = [];

    capacites.system.equipements.armure.capacites.warlord.action.allie = false;
    capacites.system.equipements.armure.capacites.warlord.action.porteur = false;
    capacites.system.equipements.armure.capacites.warlord.esquive.allie = false;
    capacites.system.equipements.armure.capacites.warlord.esquive.porteur = false;
    capacites.system.equipements.armure.capacites.warlord.force.allie = false;
    capacites.system.equipements.armure.capacites.warlord.force.porteur = false;
    capacites.system.equipements.armure.capacites.warlord.guerre.allie = false;
    capacites.system.equipements.armure.capacites.warlord.guerre.porteur = false;
    capacites.system.reaction.bonus.warlord = 0;
    capacites.system.defense.bonus.warlord = 0;
    capacites.system.equipements.armure.champDeForce.bonus.warlord = 0;

    capacites.system.equipements.armure.capacites.watchtower = false;

    capacites.system.equipements.armure.capacites.type.soldier.conflit = false;
    capacites.system.equipements.armure.capacites.type.soldier.horsconflit = false;
    capacites.system.equipements.armure.capacites.type.hunter.conflit = false;
    capacites.system.equipements.armure.capacites.type.hunter.horsconflit = false;
    capacites.system.equipements.armure.capacites.type.scholar.conflit = false;
    capacites.system.equipements.armure.capacites.type.scholar.horsconflit = false;
    capacites.system.equipements.armure.capacites.type.herald.conflit = false;
    capacites.system.equipements.armure.capacites.type.herald.horsconflit = false;
    capacites.system.equipements.armure.capacites.type.scout.conflit = false;
    capacites.system.equipements.armure.capacites.type.scout.horsconflit = false;

    capacites.system.aspects.chair.caracteristiques.deplacement.overdrive.bonus.type = 0;
    capacites.system.aspects.chair.caracteristiques.force.overdrive.bonus.type = 0;
    capacites.system.aspects.chair.caracteristiques.endurance.overdrive.bonus.type = 0;
    capacites.system.aspects.bete.caracteristiques.hargne.overdrive.bonus.type = 0;
    capacites.system.aspects.bete.caracteristiques.combat.overdrive.bonus.type = 0;
    capacites.system.aspects.bete.caracteristiques.instinct.overdrive.bonus.type = 0;
    capacites.system.aspects.machine.caracteristiques.tir.overdrive.bonus.type = 0;
    capacites.system.aspects.machine.caracteristiques.savoir.overdrive.bonus.type = 0;
    capacites.system.aspects.machine.caracteristiques.technique.overdrive.bonus.type = 0;
    capacites.system.aspects.dame.caracteristiques.aura.overdrive.bonus.type = 0;
    capacites.system.aspects.dame.caracteristiques.parole.overdrive.bonus.type = 0;
    capacites.system.aspects.dame.caracteristiques.sangFroid.overdrive.bonus.type = 0;
    capacites.system.aspects.masque.caracteristiques.discretion.overdrive.bonus.type = 0;
    capacites.system.aspects.masque.caracteristiques.dexterite.overdrive.bonus.type = 0;
    capacites.system.aspects.masque.caracteristiques.perception.overdrive.bonus.type = 0;


    let rollUi = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? false;
    const longbow = this.actor?.longbow || false;

    if(rollUi !== false && longbow !== false) {
      await rollUi.setWpnLongbow(longbow);

      rollUi.render(true);
    }

    this.actor.update(capacites);
  }

  async _resetArmureModules() {
    const listModules = this.getData().actor.modules;

    const modules = {
      system:{
        equipements:{
          ascension:{
            armure:{
              bonus:{}
            },
            champDeForce:{
              bonus:{}
            },
            energie:{
              bonus:{}
            },
          },
          armure:{
            armure:{
              bonus:{}
            },
            champDeForce:{
              bonus:{}
            },
            energie:{
              bonus:{}
            },
          }
        }
      }
    }

    for (let i = 0;i < listModules.length;i++){
      const dataModules = listModules[i];
      const getData = this.actor.items.get(dataModules._id);

      modules.system.equipements.ascension.armure.bonus[dataModules._id] = 0;
      modules.system.equipements.armure.armure.bonus[dataModules._id] = 0;
      modules.system.equipements.ascension.champDeForce.bonus[dataModules._id] = 0;
      modules.system.equipements.armure.champDeForce.bonus[dataModules._id] = 0;
      modules.system.equipements.ascension.energie.bonus[dataModules._id] = 0;
      modules.system.equipements.armure.energie.bonus[dataModules._id] = 0;

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

    this.actor.update(modules);
  }

  async _resetArmure() {

    await this._resetArmureCapacites();
    await this._resetArmureModules();

    const data = this.getData();
    const idArmure = data.systemData.equipements?.armure?.id || false;
    const remplaceEnergie = this.actor.items.get(idArmure)?.system?.espoir?.remplaceEnergie || false;
    const ascension = data.systemData.equipements.armure.capacites?.ascension?.active || false;

    let capacites = {
      system:{
        equipements:{
          armure:{
            capacites:{
              ascension:{},
              borealis:{},
              changeling:{},
              companions:{},
              shrine:{},
              ghost:{},
              goliath:{},
              illumination:{
                choix:{}
              },
              morph:{},
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
    }

    if(ascension) {
      const id = this.getData().systemData.equipements.armure.capacites?.ascension?.id || false;
      const depense = +this.getData().data.system.equipements.armure.capacites?.ascension?.depense || 0;

      if(id) {
        const actor = game.actors.get(id);

        await actor.delete();
      }

      capacites.system.equipements.armure.capacites.ascension.active = false;
      capacites.system.equipements.armure.capacites.ascension.id = 0;
      capacites.system.equipements.armure.capacites.ascension.depense = 0;

      if(remplaceEnergie) {
        capacites.system.espoir = {};
        capacites.system.espoir.malus = {armure:this.getData().data.system.espoir.malus.armure-depense};
      } else {
        const selfArmure = this.actor.items.get(this.getData().data.system.equipements.armure.id);

        selfArmure.update({[`system.energie.base`]:this.getData().data.system.energie.max+depense});
      }
    }

    this.actor.update(capacites);
  }

  _getSlotsValue() {
    const sArmure = this.getData().actor.armureData.system.slots;
    const sUtilise = this.getData().data.system.equipements.armure.slots;

    const result = this.getData().data.system.equipements.armure.hasArmor === false ? undefined : {
      tete: sArmure.tete.value-sUtilise.tete,
      torse: sArmure.torse.value-sUtilise.torse,
      brasGauche: sArmure.brasGauche.value-sUtilise.brasGauche,
      brasDroit: sArmure.brasDroit.value-sUtilise.brasDroit,
      jambeGauche: sArmure.jambeGauche.value-sUtilise.jambeGauche,
      jambeDroite: sArmure.jambeDroite.value-sUtilise.jambeDroite
    };

    return result;
  }

  _getArmorId() {
    const data = this.getData();
    const id = data.data.system.equipements.armure.id;

    return id;
  }

  _getArmorLegendeId() {
    const data = this.getData();
    const id = data.data.system.equipements.armure?.idLegende || 0;

    return id;
  }

  _getTotalPG(data) {
    const PG = +data.progression.gloire.total;

    return PG;
  }
}
