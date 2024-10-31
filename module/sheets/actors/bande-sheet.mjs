import {
  confirmationDialog,
  diceHover,
  options,
  commonPNJ,
  hideShowLimited,
  dragMacro,
  actualiseRoll
} from "../../helpers/common.mjs";

import toggler from '../../helpers/toggler.js';

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
      height: 780,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);
    this._prepareAE(context);

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

      item.delete();
      header.slideUp(200, () => this.render(false));
    });

    html.find('.capacites div.bCapacite .activation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget)?.data("name") || '';
      const tenebricide = $(ev.currentTarget)?.data("tenebricide") || false;
      const obliteration = $(ev.currentTarget)?.data("obliteration") || false;

      if(type === 'degats') this._doDgts(name, capacite, obliteration, tenebricide);
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
      const id = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(id, {
        label:label,
        base:aspect,
        succesbonus:reussites,
        height:400,
      });

      dialog.open();
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
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;
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

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    const typesValides = [
      'arme', 'module', 'armure',
      'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma', 'langue',
      'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (typesValides.includes(itemBaseType)) return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const system = sheetData.data.system;

    const capacites = [];

    for (let i of sheetData.items) {
      const data = i.system;

      // CAPACITES
      if (i.type === 'capacite') {
        capacites.push(i);

        const isPhase2 = data.isPhase2;
        const attaque = data.attaque;

        if(!isPhase2) {
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
    }

    actorData.capacites = capacites;
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

  async _doDebordement(label, dgtsDice) {
    const actor = this.actor;
    const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Debordement')}`,
    }, false);
    const weapon = roll.prepareWpnContact({
      name:`${label}`,
      system:{
        degats:{dice:0, fixe:dgtsDice},
        effets:{},
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

    let data = {
      total:0,
      targets: game.user.targets.size > 0 ? game.user.targets : [],
      attaque:[],
      flags:addFlags,
      content:{
        otherBtn:[{
          classes:'debordement full',
          title:game.i18n.localize('KNIGHT.JETS.AugmenterDebordement'),
          label:game.i18n.localize('KNIGHT.JETS.AugmenterDebordement'),
        }]
      }
    };

    roll.setWeapon(weapon);
    await roll.doRollDamage(data, addFlags);
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
