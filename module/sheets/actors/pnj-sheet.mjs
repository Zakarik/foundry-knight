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
export class PNJSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["pnj", "sheet", "actor"],
      template: "systems/knight/templates/actors/pnj-sheet.html",
      width: 900,
      height: 600,
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

    html.find('img.diceTarget').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6TargetWhite.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6TargetBlack.svg");
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
    
        ChatMessage.create(attackMsgData);
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

    html.find('.armure .activation').click(async ev => {
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

    html.find('.armure .desactivation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const module = $(ev.currentTarget).data("module");

      if(type === 'module') {
        this.actor.items.get(module).update({[`system.active.base`]:false})
      }

      if(type === 'modulePnj') {
        this.actor.items.get(module).update({[`system.active.pnj`]:false})
      }
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

    html.find('.activatePhase2').click(ev => {
      const data = this.getData().data.system;
      const options = data.options;
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

      if(options.sante) {
        const sante = data.sante;
        const tSante = +sante.base + +phase2.sante;

        update.system.sante = {};
        update.system.sante.base = tSante;
        update.system.sante.value = tSante + +sante.mod;
      }

      if(options.armure) {
        const armure = data.armure;
        const tArmure = +armure.base + +phase2.armure;

        update.system.armure = {};
        update.system.armure.base = tArmure;
        update.system.armure.value = tArmure + +armure.mod;
      }

      if(options.energie) {
        const energie = data.energie;
        const tEnergie = +energie.base + +phase2.energie;

        update.system.energie = {};
        update.system.energie.base = tEnergie;
        update.system.energie.value = tEnergie + +energie.mod;
      }

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

    if((itemBaseType === 'module' && !options.modules) || 
    itemBaseType === 'armure' || itemBaseType === 'avantage' || 
    itemBaseType === 'inconvenient' || itemBaseType === 'motivationMineure' || 
    itemBaseType === 'contact' || itemBaseType === 'blessure' || 
    itemBaseType === 'trauma' || itemBaseType === 'armurelegende') return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

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

      // ARME
      if (i.type === 'arme') {
        const type = data.type;
        const tourelle = data.tourelle;

        data.noRack = true;
        data.pnj = true;

        const raw = data.effets.raw;
        const custom = data.effets.custom;
        const labels = CONFIG.KNIGHT.effets;

        data.effets.liste = listEffects(raw, custom, labels);

        const effetsRaw = i.system.effets.raw;
        const bDefense = effetsRaw.find(str => { if(str.includes('defense')) return str; });
        const bReaction = effetsRaw.find(str => { if(str.includes('reaction')) return str; });

        if(bDefense !== undefined) defense.bonus.armes += +bDefense.split(' ')[1];
        if(bReaction !== undefined) reaction.bonus.armes += +bReaction.split(' ')[1];

        if(type === 'distance') {
          const rawDistance = data.distance.raw;
          const customDistance = data.distance.custom;
          const labelsDistance = CONFIG.KNIGHT.AMELIORATIONS.distance;

          data.distance.liste = listEffects(rawDistance, customDistance, labelsDistance);

        } else if(type === 'contact') {
          const rawStructurelles = data.structurelles.raw;
          const customStructurelles = data.structurelles.custom;
          const labelsStructurelles = CONFIG.KNIGHT.AMELIORATIONS.structurelles;
          const bMassive = rawStructurelles.find(str => { if(str.includes('massive')) return true; });

          data.structurelles.liste = listEffects(rawStructurelles, customStructurelles, labelsStructurelles);

          if(bMassive) defense.malus.armes += 1;

          const rawOrnementales = data.ornementales.raw;
          const customOrnementales = data.ornementales.custom;
          const labelsOrnementales = CONFIG.KNIGHT.AMELIORATIONS.ornementales;

          data.ornementales.liste = listEffects(rawOrnementales, customOrnementales, labelsOrnementales);
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

            if(iBArmure.has) { armure.bonus.modules.push(iBArmure.value); }
            if(iBCDF.has) { champDeForce.bonus.modules.push(iBCDF.value); }
            if(iBEnergie.has) { energie.bonus.modules.push(iBEnergie.value); }
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

            if(bDefense !== undefined) defense.bonus.armes += +bDefense.split(' ')[1];
            if(bReaction !== undefined) reaction.bonus.armes += +bReaction.split(' ')[1];

            if(itemArme.type === 'contact') {
              const bMassive = itemArme.structurelles.raw.find(str => { if(str.includes('massive')) return true; });
              if(bMassive) defense.malus.armes += 1;

              armesContact.push(moduleWpn);
            }

            if(itemArme.type === 'distance') {
              armesDistance.push(moduleWpn);
            }
          }
        }

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

    armesContact.sort(SortByName);
    armesDistance.sort(SortByName);
    armesTourelles.sort(SortByName);
    capacites.sort(SortByName);
    langue.sort(SortByName);
    modules.sort(SortByName);

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
    const hasBarrage = typeWpn === 'grenades' ? data.data.system.combat.grenades.liste[nameWpn].effets.raw.find(str => { if(str.includes('barrage')) return true; }) : false;

    await rollApp.setData(label, select, [], [], difficulte,
      data.data.system.combat.data.modificateur, data.data.system.combat.data.succesbonus+reussitesBonus, 
      {dice:data.data.system.combat.data.degatsbonus.dice, fixe:data.data.system.combat.data.degatsbonus.fixe},
      {dice:data.data.system.combat.data.violencebonus.dice, fixe:data.data.system.combat.data.violencebonus.fixe},
      data.actor.armesContact, data.actor.armesDistance, data.actor.armesTourelles, data.systemData.combat.grenades.liste, {contact:data.systemData.combat.armesimprovisees.liste, distance:data.systemData.combat.armesimprovisees.liste}, [], [],
      isWpn, idWpn, nameWpn, typeWpn, num,
      deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseesContact, deployWpnImproviseesDistance, deployGrenades, false, false,
      true, false);
    await rollApp.setActor(this.actor.id);
    await rollApp.setAspects(data.data.system.aspects);
    await rollApp.setEffets(hasBarrage, false, false, false);
    rollApp.render(true);
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
    
    ChatMessage.create(dgtsMsgData);
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

    ChatMessage.create(violenceMsgData);
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
}