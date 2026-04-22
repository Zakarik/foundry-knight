import {
  confirmationDialog,
  getDefaultImg,
  diceHover,
  options,
  hideShowLimited,
  dragMacro,
  actualiseRoll,
  getArmor,
} from "../../helpers/common.mjs";

import toggler from '../../helpers/toggler.js';

import prepareCharacterItems from "../../processor/items/main.mjs";

/**
 * @extends {ActorSheet}
 */
export default class BaseActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "actor"],
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  get canDropActor() {
    return false;
  }

  get actorTypesValides() {
    return [];
  }

  get itemTypesValides() {
    return ['arme'];
  }

  get hasGloire() {
    return false;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    const { actor } = context;

    this._prepareContext(context);

    context.systemData = context.data.system;

    actualiseRoll(actor);

    console.error(context);

    return context;
  }

  _prepareContext(context) {
    const { actor } = context

    prepareCharacterItems(actor);
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
    hideShowLimited(this.actor, html);

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

    html.find('div.grenades img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      span.width($(html).width()/2).toggle("display");
      $(ev.currentTarget).toggleClass("clicked")
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
    diceHover(html);
    options(html, this.actor);

    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));

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

    html.find('.rollRecuperationArt').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");

      const rEspoir = new game.knight.RollKnight(this.actor, {
        name:game.i18n.localize("KNIGHT.ART.RecuperationEspoir"),
        dices:`${value}`,
      }, false);

      await rEspoir.doRoll();
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target?.data("label") || '';
      const noOd = target?.data("nood") || false;
      const aspect  = target.data("aspect") || '';
      const caracteristique = target.data("caracteristique") || '';
      const caracAdd = target.data("caracadd") === undefined ? [] : target.data("caracadd").split(',')
      const caracLock = target.data("caraclock") === undefined ? [] : target.data("caraclock").split(',');
      const reussites = +target.data("reussitebonus") || 0;
      const succesTemp = +target.data("succestemp") || 0;
      const modTemp = +target.data("modtemp") || 0;
      const id = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(id, {
        label:label,
        base:caracteristique ? caracteristique : aspect,
        whatRoll:caracAdd,
        succesbonus:reussites+succesTemp,
        modificateur:modTemp,
        btn:{
          nood:noOd,
        }
      });

      dialog.open();
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
        type:isDistance,
        name:other,
        num:what
      });
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
  async _onItemCreate_on(header, itemData) {
    const type = header.dataset?.type || false;
    const subtype = header.dataset?.subtype || false;

    switch(type) {
      case 'arme':
        itemData.system = {
          type:header.dataset.subtype,
          tourelle:{
            has:header.dataset.tourelle
          }
        };
        break;
    }

    if(subtype) {
      switch(subtype) {
        case 'phase2':
          foundry.utils.setProperty(itemData, 'system.isPhase2', true);
          break;

        default:
          foundry.utils.setProperty(itemData, 'system.type', subtype);
          break;
      }
    }
  }

  async _onItemCreate_post(create) {
    return true;
  }

  async _onItemEdit_on(item, header) {
    return true;
  }

  async _onItemDelete_on(item) {
    return true;
  };

  async _onDropItemCreate_on(itemData) {
    return true;
  }

  async _onDropItemCreate_post(dropCreateOn, itemCreate) {
    return true;
  }

  async _onDroppedActor(data) {}

  /** @inheritdoc */
  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    if (!this.itemTypesValides.includes(itemBaseType)) return;

    const dropCreateOn = await this._onDropItemCreate_on(itemData);

    if(!dropCreateOn) return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    await this._onDropItemCreate_post(dropCreateOn, itemCreate);

    return itemCreate;
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;

    // Get the type of item to create.
    const type = header.dataset.type;

    // Grab any data associated with this control.
    const data = foundry.utils.duplicate(header.dataset);

    // Initialize a default name.
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;

    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      img:getDefaultImg(type),
      system: data
    };

    await this._onItemCreate_on(header, itemData);

    const create = await Item.create(itemData, {parent: this.actor});

    await this._onItemCreate_post(create);

    // Finally, create the item!
    return create;
  }

  async _onItemEdit(event) {
    event.preventDefault();
    const header = $(event.currentTarget).parents(".summary");
    const actor = this.actor;
    const item = actor.items.get(header.data("item-id"));

    await this._onItemEdit_on(item, header);

    item.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();
    const header = $(event.currentTarget).parents(".summary");
    const actor = this.actor;
    const item = actor.items.get(header.data("item-id"));

    if(!await confirmationDialog()) return;

    await this._onItemDelete_on(item);

    item.delete();
    header.slideUp(200, () => this.render(false));
  }

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

  async _onDropActor(event, data) {
    if (!this.actor.isOwner || !this.canDropActor) return false;
    const droppedActor = await Actor.implementation.fromDropData(data);
    const type = droppedActor.type;

    if(!this.actorTypesValides.includes(type)) return false;

    await this._onDroppedActor(droppedActor);
  }
}