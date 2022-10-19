import { 
  getModStyle,
  listEffects,
  SortByName
} from "../../helpers/common.mjs";

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
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    
    this._prepareCharacterItems(context);

    context.systemData = context.data.system;

    console.log(context);
    
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
        type:header.dataset.subtype
      };
      delete itemData.system["subtype"];
    }

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    const cls = getDocumentClass(data?.type);
    if ( !cls || !(cls.collectionName in Adventure.contentFields) ) return;
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

      console.log(update);

      this.actor.update(update);
    }    
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;
    const armeType = itemData[0].system.type;

    console.log(itemData);

    if((itemBaseType === 'arme' && armeType === 'contact') || itemBaseType === 'module' || itemBaseType === 'capacite' ||
    itemBaseType === 'armure' || itemBaseType === 'avantage' || 
    itemBaseType === 'inconvenient' || itemBaseType === 'motivationMineure' || 
    itemBaseType === 'contact' || itemBaseType === 'blessure' || 
    itemBaseType === 'trauma' || itemBaseType === 'armurelegende') return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    const armesDistance = [];
    let reaction = {
      bonus:{
        armes:0
      },
      malus:{
        armes:0
      }
    };
    let defense = {
      bonus:{
        armes:0
      },
      malus:{
        armes:0
      }
    };

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

        if(bDefense !== undefined) defense.bonus.armes += +bDefense.split(' ')[1];
        if(bReaction !== undefined) reaction.bonus.armes += +bReaction.split(' ')[1];

        const rawDistance = data.distance.raw;
        const customDistance = data.distance.custom;
        const labelsDistance = CONFIG.KNIGHT.AMELIORATIONS.distance;

        data.distance.liste = listEffects(rawDistance, customDistance, labelsDistance);

        armesDistance.push(i);
      }
    }

    armesDistance.sort(SortByName);

    actorData.armesDistance = armesDistance;

    const update = {
      system:{
        reaction:{
          bonus:reaction.bonus.armes,
          malus:reaction.malus.armes
        },
        defense:{
          bonus:defense.bonus.armes,
          malus:defense.malus.armes
        }
      }
    };

    this.actor.update(update);

    // ON ACTUALISE ROLL UI S'IL EST OUVERT
    let rollUi = this._getKnightRoll();

    if(rollUi !== false) {
      rollUi.data.listWpnDistance = armesDistance;

      rollUi.render(true);
    }
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

  async _rollDicePNJ(label, actorId, aspect = '', difficulte = false, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, desBonus=0) {
    const data = this.getData();
    const rollApp = this._getKnightRoll();
    const select = aspect;
    const deployWpnImproviseesDistance = false;
    const deployWpnImproviseesContact = false;
    const deployWpnDistance = false;
    const deployWpnTourelle = false;
    const deployWpnContact = false;
    const hasBarrage = false;
    const actor = game.actors.get(actorId);
    const armesDistance = isWpn ? this.actor.armesDistance : {};

    if(!rollApp) {
      const roll = new game.knight.applications.KnightRollDialog({
        title: this.actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
        actor:actorId,
        label:label,
        aspects:actor.system.aspects,
        base:select,
        pnj:true,
        autre:[],
        lock:[],
        difficulte:difficulte,
        listWpnContact:{},
        listWpnDistance:armesDistance,
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
        succesBonus:0,
        modificateur:desBonus,
        degatsBonus:{
          dice:0,
          fixe:0
        },
        violenceBonus:{
          dice:0,
          fixe:0
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
      rollApp.data.label = label;
      rollApp.data.base = select;
      rollApp.data.difficulte = difficulte;

      rollApp.data.listWpnContact = {};
      rollApp.data.listWpnDistance = armesDistance;
      rollApp.data.listWpnTourelle = {};
      rollApp.data.listWpnImprovisees = {
        contact:{},
        distance:{}
      };
      rollApp.data.isWpn = isWpn;
      rollApp.data.idWpn = idWpn;
      rollApp.data.nameWpn = nameWpn;
      rollApp.data.typeWpn = typeWpn;

      rollApp.data.deploy.wpnContact = deployWpnContact;
      rollApp.data.deploy.wpnDistance = deployWpnDistance;

      rollApp.bringToTop();
      rollApp.render(true);
    }
  }

  async _rollDicePJ(label, actorId, caracteristique, difficulte = false, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, desBonus=0) {
    const actor = game.actors.get(actorId);
    const data = actor.system;
    const rollApp = this._getKnightRoll();
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

    if(!rollApp) {
      const roll = new game.knight.applications.KnightRollDialog({
        title: this.actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
        actor:actorId,
        label:label,
        aspects:data.aspects,
        base:caracteristique,
        autre:[],
        lock:[],
        difficulte:difficulte,
        listWpnContact:{},
        listWpnDistance:armesDistance,
        listWpnTourelle:{},
        listGrenades:{},
        listWpnImprovisees:{
          contact:{},
          distance:{}
        },
        longbow:{},
        num:num,
        isWpn:isWpn,
        idWpn:idWpn,
        nameWpn:nameWpn,
        typeWpn:typeWpn,
        barrage:hasBarrage,
        jumeleambidextrie:true,
        soeur:true,
        jumelageambidextrie:true,
        succesBonus:0,
        modificateur:desBonus,
        degatsBonus:{
          dice:0,
          fixe:0
        },
        violenceBonus:{
          dice:0,
          fixe:0
        },
        style:{
          fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`),
          label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`),
          raw:style,
          info:data.combat.styleInfo,
          caracteristiques:getStyle.caracteristiques,
          tourspasses:data.combat.data.tourspasses,
          type:data.combat.data.type,
          sacrifice:data.combat.data.sacrifice,
          maximum:6
        },
        deploy:{
          wpnContact:deployWpnContact,
          wpnDistance:deployWpnDistance,
          wpnTourelle:deployWpnTourelle,
          wpnArmesImproviseesContact:deployWpnImproviseesContact,
          wpnArmesImproviseesDistance:deployWpnImproviseesDistance,
          grenades:deployGrenades,
          longbow:deployLongbow
        },
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
      }).render(true);

      const kRoll = {
        id:roll.appId
      };

      this.actor.update({[`system.knightRoll`]:kRoll});
    } else {
      rollApp.data.actor = actorId;
      rollApp.data.label = label;
      rollApp.data.base = caracteristique;
      rollApp.data.autre = [];
      rollApp.data.lock = [];
      rollApp.data.difficulte = difficulte;

      rollApp.data.listWpnContact = {};
      rollApp.data.listWpnDistance = armesDistance;
      rollApp.data.listWpnTourelle = {};
      rollApp.data.listGrenades = {};
      rollApp.data.listWpnImprovisees = {
        contact:{},
        distance:{}
      };
      rollApp.data.longbow = {};
      rollApp.data.isWpn = isWpn;
      rollApp.data.idWpn = idWpn;
      rollApp.data.nameWpn = nameWpn;
      rollApp.data.typeWpn = typeWpn;

      rollApp.data.style.fulllabel = game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`);
      rollApp.data.style.label = game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`);
      rollApp.data.style.raw = style;
      rollApp.data.style.info = data.combat.styleInfo;
      rollApp.data.style.caracteristiques = getStyle.caracteristiques;

      rollApp.data.deploy.wpnContact = deployWpnContact;
      rollApp.data.deploy.wpnDistance = deployWpnDistance;
      rollApp.data.deploy.grenades = deployGrenades;
      rollApp.data.deploy.longbow = deployLongbow;

      rollApp.bringToTop();
      rollApp.render(true);
    }
  }
}