import { 
  getEffets,
  getAspectValue,
  getAEValue,
  listEffects,
  SortByName,
  sum
} from "../../helpers/common.mjs";

/**
 * @extends {ActorSheet}
 */
export class BandeSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["bande", "sheet", "actor"],
      template: "systems/knight/templates/actors/bande-sheet.html",
      width: 900,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    
    console.log(context);
    this._prepareCharacterItems(context);
    this._prepareAE(context);

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

    html.find('.extendButton').click(ev => {      
      $(ev.currentTarget).toggleClass("fa-plus-square fa-minus-square");

      if($(ev.currentTarget).hasClass("fa-minus-square")) {
        $(ev.currentTarget).parents(".summary").siblings().css("display", "block");
      } else {
        $(ev.currentTarget).parents(".summary").siblings().css("display", "none");
      }
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

    html.find('.item-delete').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      item.delete();
      header.slideUp(200, () => this.render(false));
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
        this._doDgts(name, dataDegats.degats.system, allEffets);
      }
    });

    html.find('.jetDebordement').click(async ev => {
      const name = $(ev.currentTarget)?.data("name") || '';
      const value = eval($(ev.currentTarget).data("value"));

      this._doDebordement(name, value);
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;

      this._rollDice(label, aspect, false, false, '', '', '', -1, reussites);
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

    html.find('div.options button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const option = target.data("option");
      const result = value === true ? false : true;

      this.actor.update({[`system.options.${option}`]:result});
    });
    
    html.find('.activatePhase2').click(ev => {
      const data = this.getData().data.system;
      const phase2 = data.phase2;

      let update = {
        system:{
          phase2Activate:true,
          aspects: {
            chair:{
              ae:{
                mineur:{},
                majeur:{}
              }
            },
            bete:{
              ae:{
                mineur:{},
                majeur:{}
              }
            },
            machine:{
              ae:{
                mineur:{},
                majeur:{}
              }
            },
            dame:{
              ae:{
                mineur:{},
                majeur:{}
              }
            },
            masque:{
              ae:{
                mineur:{},
                majeur:{}
              }
            }
          }
        }
      };

      const sante = data.sante;
      const tSante = +sante.base + +phase2.sante;

      update.system.sante = {};
      update.system.sante.base = tSante;
      update.system.sante.value = tSante + +sante.mod;

      const aspects = data.aspects;

      update.system.aspects.chair.value = +aspects.chair.value + +phase2.aspects.chair.value;
      update.system.aspects.chair.ae.mineur.value = +aspects.chair.ae.mineur.value + +phase2.aspects.chair.ae.mineur;
      update.system.aspects.chair.ae.majeur.value = +aspects.chair.ae.majeur.value + +phase2.aspects.chair.ae.majeur;

      update.system.aspects.bete.value = +aspects.bete.value + +phase2.aspects.bete.value;
      update.system.aspects.bete.ae.mineur.value = +aspects.bete.ae.mineur.value + +phase2.aspects.bete.ae.mineur;
      update.system.aspects.bete.ae.majeur.value = +aspects.bete.ae.majeur.value + +phase2.aspects.bete.ae.majeur;

      update.system.aspects.machine.value = +aspects.machine.value + +phase2.aspects.machine.value;
      update.system.aspects.machine.ae.mineur.value = +aspects.machine.ae.mineur.value + +phase2.aspects.machine.ae.mineur;
      update.system.aspects.machine.ae.majeur.value = +aspects.machine.ae.majeur.value + +phase2.aspects.machine.ae.majeur;

      update.system.aspects.dame.value = +aspects.dame.value + +phase2.aspects.dame.value;
      update.system.aspects.dame.ae.mineur.value = +aspects.dame.ae.mineur.value + +phase2.aspects.dame.ae.mineur;
      update.system.aspects.dame.ae.majeur.value = +aspects.dame.ae.majeur.value + +phase2.aspects.dame.ae.majeur;

      update.system.aspects.masque.value = +aspects.masque.value + +phase2.aspects.masque.value;
      update.system.aspects.masque.ae.mineur.value = +aspects.masque.ae.mineur.value + +phase2.aspects.masque.ae.mineur;
      update.system.aspects.masque.ae.majeur.value = +aspects.masque.ae.majeur.value + +phase2.aspects.masque.ae.majeur;

      this.actor.update(update);
    });

    html.find('button.destruction').click(async ev => {
      await this.actor.delete();
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

    /*switch(type) {
      case "equipement":
          itemData.img = "systems/awaken/assets/icons/equipement.svg";
          break;

      case "armement":
          itemData.img = "systems/awaken/assets/icons/armement.svg";
          break;

      case "armure":
          itemData.img = "systems/awaken/assets/icons/armure.svg";
          break;

      case "prodige":
          itemData.img = "systems/awaken/assets/icons/prodige.svg";
          break;

      case "specialisation":
          itemData.img = "systems/awaken/assets/icons/specialisation.svg";
          break;

      case "reputation":
          itemData.img = "systems/awaken/assets/icons/reputation.svg";
          break;
    }*/

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    if(itemBaseType === 'arme' || itemBaseType === 'module' || 
    itemBaseType === 'armure' || itemBaseType === 'avantage' || 
    itemBaseType === 'inconvenient' || itemBaseType === 'motivationMineure' || 
    itemBaseType === 'contact' || itemBaseType === 'blessure' || 
    itemBaseType === 'trauma' || itemBaseType === 'langue' || itemBaseType === 'armurelegende') return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const system = sheetData.data.system;
    
    const capacites = [];
    const aspects = {
      "chair":system.aspects.chair.value,
      "bete":system.aspects.bete.value,
      "machine":system.aspects.machine.value,
      "dame":system.aspects.dame.value,
      "masque":system.aspects.masque.value,
    };
    const aspectLieSupp = [];

    let aspectsMax = {
      chair:{
        max:20,
        ae:{
          mineur:{
            max:10
          },
          majeur:{
            max:10
          }
        }
      },
      bete:{
        max:20,
        ae:{
          mineur:{
            max:10
          },
          majeur:{
            max:10
          }
        }
      },
      machine:{
        max:20,
        ae:{
          mineur:{
            max:10
          },
          majeur:{
            max:10
          }
        }
      },
      dame:{
        max:20,
        ae:{
          mineur:{
            max:10
          },
          majeur:{
            max:10
          }
        }
      },
      masque:{
        max:20,
        ae:{
          mineur:{
            max:10
          },
          majeur:{
            max:10
          }
        }
      }
    };
    let armure = {
      bonus:{
        modules:[0],
        capacites:[0]
      }
    };
    let reaction = {
      bonus:{
        armes:0,
        capacites:0
      },
      malus:{
        armes:0,
        capacites:0
      }
    };
    let defense = {
      bonus:{
        armes:0,
        capacites:0
      },
      malus:{
        armes:0,
        capacites:0
      }
    };
    let sante = {
      bonus:0,
      malus:0
    };

    for (let i of sheetData.items) {
      const data = i.system;

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
              sante.bonus += aspects[cSante.aspect.value]*cSante.aspect.multiplie;
            } else {
              sante.bonus += cSante.value;
            }
          }

          if(cArmure.has) {
            if(cArmure.aspect.lie) {
              armure.bonus.capacites.push(aspects[cArmure.aspect.value]*cArmure.aspect.multiplie);
            } else {
              armure.bonus.capacites.push(cArmure.value);
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
              sante.bonus += aspects[cSante.aspect.value]*cSante.aspect.multiplie;
            } else {
              sante.bonus += cSante.value;
            }
          }

          if(cArmure.has) {
            if(armure.aspect.lie) {
              armure.bonus.capacites.push(aspects[cArmure.aspect.value]*cArmure.aspect.multiplie);
            } else {
              armure.bonus.capacites.push(cArmure.value);
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
    }

    capacites.sort(SortByName);

    for (let i of capacites) {
      const system = i.system;

      if((!i.isPhase2) || (i.isPhase2 && system.phase2Activate)) {
        for(let i = 0; i < aspectLieSupp.length; i++) {
          const bonus = system.bonus;
          const cSante = bonus.sante;
          const cArmure = bonus.armure;
          const aspectMax = bonus.aspectMax;

          if(cSante.has && cSante.aspect.lie && cSante.aspect.value !== aspectLieSupp[i]) {
            sante.bonus += aspects[aspectLieSupp[i]]*cSante.aspect.multiplie;
          }

          if(cArmure.has && cArmure.aspect.lie && cArmure.aspect.value !== aspectLieSupp[i]) {
            armure.bonus.capacites.push(aspects[aspectLieSupp[i]]*cArmure.aspect.multiplie);
          }

          if(aspectMax.has && aspectMax.aspect !== aspectLieSupp[i]) {
            aspectsMax[aspectLieSupp[i]].max = aspectMax.maximum.aspect;
            aspectsMax[aspectLieSupp[i]].ae.mineur.max = aspectMax.maximum.ae;
            aspectsMax[aspectLieSupp[i]].ae.majeur.max = aspectMax.maximum.ae;
          }
        }
      }
    }

    actorData.capacites = capacites;

    const update = {
      system:{
        aspects:{
          chair:{
            max:aspectsMax.chair.max,
            ae:{
              mineur:{
                max:aspectsMax.chair.ae.mineur.max
              },
              majeur:{
                max:aspectsMax.chair.ae.majeur.max
              }
            }
          },
          bete:{
            max:aspectsMax.bete.max,
            ae:{
              mineur:{
                max:aspectsMax.bete.ae.mineur.max
              },
              majeur:{
                max:aspectsMax.bete.ae.majeur.max
              }
            }
          },
          machine:{
            max:aspectsMax.machine.max,
            ae:{
              mineur:{
                max:aspectsMax.machine.ae.mineur.max
              },
              majeur:{
                max:aspectsMax.machine.ae.majeur.max
              }
            }
          },
          dame:{
            max:aspectsMax.dame.max,
            ae:{
              mineur:{
                max:aspectsMax.dame.ae.mineur.max
              },
              majeur:{
                max:aspectsMax.dame.ae.majeur.max
              }
            }
          },
          masque:{
            max:aspectsMax.masque.max,
            ae:{
              mineur:{
                max:aspectsMax.masque.ae.mineur.max
              },
              majeur:{
                max:aspectsMax.masque.ae.majeur.max
              }
            }
          }
        },
        armure:{
          bonus:{
            modules:armure.bonus.modules.reduce(sum),
            modules:armure.bonus.capacites.reduce(sum)
          }
        },
        reaction:{
          bonus:{
            armes:reaction.bonus.armes,
            capacites:reaction.bonus.capacites
          },
          malus:{
            capacites:reaction.malus.capacites,
            armes:reaction.malus.armes
          }
        },
        defense:{
          bonus:{
            armes:defense.bonus.armes,
            capacites:defense.bonus.capacites
          },
          malus:{
            capacites:defense.malus.capacites,
            armes:defense.malus.armes
          }
        },
        sante:{
          bonus:{
            capacites:sante.bonus
          },
          malus:{
            capacites:sante.malus
          }
        }
      }
    };

    this.actor.update(update);
  }

  _getKnightRoll() {
    const appId = this?.object?.system?.knightRoll?.id || false;
    const result = ui?.windows?.[appId] || false;

    let r;

    if(result !== false) {
      r = result.constructor.name === 'KnightRollDialog' ? result : false;
    } else r = false;
    
    return r;
  }

  async _rollDice(label, aspect = '', difficulte = false, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, reussitesBonus=0) {
    const data = this.getData();
    const rollApp = this._getKnightRoll();
    const select = aspect;
    const deployWpnImproviseesDistance = false;
    const deployWpnImproviseesContact = false;
    const deployWpnDistance = false;
    const deployWpnTourelle = false;
    const deployWpnContact = false;
    const hasBarrage = false;

    if(!rollApp) {
      const roll = new game.knight.applications.KnightRollDialog({
        title: this.actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
        actor:this.actor.id,
        label:label,
        aspects:data.data.system.aspects,
        base:select,
        pnj:true,
        autre:[],
        lock:[],
        difficulte:difficulte,
        listWpnContact:{},
        listWpnDistance:{},
        listWpnTourelle:{},
        listGrenades:{},
        listWpnImprovisees:{
          contact:{},
          distance:{}
        },
        num:num,
        isWpn:isWpn,
        idWpn:idWpn,
        nameWpn:nameWpn,
        typeWpn:typeWpn,
        barrage:hasBarrage,
        jumeleambidextrie:false,
        soeur:false,
        jumelageambidextrie:false,
        succesBonus:data.data.system.combat.data.succesbonus+reussitesBonus,
        modificateur:data.data.system.combat.data.modificateur,
        degatsBonus:{
          dice:data.data.system.combat.data.degatsbonus.dice,
          fixe:data.data.system.combat.data.degatsbonus.fixe
        },
        violenceBonus:{
          dice:data.data.system.combat.data.violencebonus.dice,
          fixe:data.data.system.combat.data.violencebonus.fixe
        },
        style:{},
        deploy:{
          wpnContact:deployWpnContact,
          wpnDistance:deployWpnDistance,
          wpnTourelle:deployWpnTourelle,
          wpnArmesImproviseesContact:deployWpnImproviseesContact,
          wpnArmesImproviseesDistance:deployWpnImproviseesDistance,
        },
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
      }).render(true);

      const kRoll = {
        id:roll.appId
      };

      this.actor.update({[`system.knightRoll`]:kRoll});
    } else {
      await rollApp.setData(label, select, [], [], difficulte,
        data.data.system.combat.data.modificateur, data.data.system.combat.data.succesbonus+reussitesBonus, 
        [], [], [], [], {contact:[], distance:[]}, [], 
        isWpn, idWpn, nameWpn, typeWpn, num,
        deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseesContact, deployWpnImproviseesDistance, false, false, false,
        true, false);
        
      rollApp.bringToTop();
      rollApp.render(true);
    }
  }

  _prepareAE(context) {
    const actor = context.actor?.aspectexceptionnel || false;
    const listAspects = context.data.system.aspects;
    //const aspects = context.actor?.aspectexceptionnel?.[aspect] || false;

    if(!actor) context.actor.aspectexceptionnel = {};

    let result = {};

    for (let [key, aspect] of Object.entries(listAspects)){
      console.log(aspect);
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

  async _doDebordement(label, dgtsDice) {
    const actor = this.actor;
   
    //DEGATS
    const labelDgt = `${label} : ${game.i18n.localize('KNIGHT.AUTRE.Debordement')}`;

    const totalDgt = `${dgtsDice}`;

    const execDgt = new game.knight.RollKnight(`${totalDgt}`, actor.system);
    execDgt._success = false;
    execDgt._hasMin = false;

    await execDgt.evaluate({async:true});

    const pDegats = {
      flavor:labelDgt,
      main:{
        total:execDgt._total,
        tooltip:await execDgt.getTooltip()
      }
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
    
    ChatMessage.create(dgtsMsgData);
  }

  async _doDgts(label, dataWpn, listAllEffets, regularite=0, addNum='') {
    const actor = this.actor;
   
    //DEGATS
    const tenebricide = true;
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
    
    ChatMessage.create(dgtsMsgData);
  }

  async _getAllEffets(dataWpn, tenebricide, obliteration) {
    const actor = this.actor;
    const data = {
      guidage:false,
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
}