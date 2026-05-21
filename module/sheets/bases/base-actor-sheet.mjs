import {
  confirmationDialog,
  getDefaultImg,
  dragMacro,
  actualiseRoll,
  getArmor,
  capitalizeFirstLetter,
} from "../../helpers/common.mjs";

import prepareCharacterItems from "../../processor/items/main.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;
import JsTogglerMixin from "./mixin-js-toggler.mjs";

/**
 * @extends {ActorSheet}
 */
export default class BaseActorSheet extends JsTogglerMixin(HandlebarsApplicationMixin(ActorSheetV2)) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["sheet", "actor"],
    window: { resizable: true },
    dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    form: {
      submitOnChange: true,
    },
    actions: {
      switchSubTab: BaseActorSheet.#onSwitchSubTab,
      itemCreate: BaseActorSheet.#onItemCreate,
      itemEdit: BaseActorSheet.#onItemEdit,
      itemDelete: BaseActorSheet.#onItemDelete,
      effectsEdit: BaseActorSheet.#onEffectsEdit,
      effectsToggle: BaseActorSheet.#onEffectsToggle,
      sendMsg: BaseActorSheet.#onSendMsg,
      dialogRoll: BaseActorSheet.#onDialogRoll,
      roll: BaseActorSheet.#onRoll,
      useWpn: BaseActorSheet.#onUseWpn,
      chargeurClick: BaseActorSheet.#onChargeurClick,
      optionsClick: BaseActorSheet.#onOptionsClick,
      recoverClick: BaseActorSheet.#onRecoverClick,
      btnToggle: BaseActorSheet.#onBtnToggle,
    }
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


  // GESTION DES ACTIONS

  static #onSwitchSubTab(event, target) {
    const subGroup = target.dataset.subGroup;
    const subTab = target.dataset.subTab;

    // Toggle des classes active sur tous les éléments du sous-groupe
    this.element.querySelectorAll(`[data-sub-group="${subGroup}"]`).forEach(node => {
      const isDiv = node.dataset.div;

      if(isDiv) node.closest('div.summary').classList.toggle('active', node.dataset.subTab === subTab);
      else node.classList.toggle('active', node.dataset.subTab === subTab);
    });
  }

  static async #onItemCreate(event, target) {
    // Get the type of item to create.
    const type = target.dataset.type;

    // Grab any data associated with this control.
    const data = foundry.utils.deepClone(target.dataset);

    // Initialize a default name.
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;

    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      img:getDefaultImg(type),
      system: data
    };

    await this._onItemCreate_on(target, itemData);

    const create = await Item.create(itemData, {parent: this.actor});

    await this._onItemCreate_post(create);

    // Finally, create the item!
    return create;
  }

  static async #onItemEdit(event, target) {
    const header = target.closest(".summary");
    const actor = this.actor;
    const item = actor.items.get(header.dataset.itemId);

    await this._onItemEdit_on(item, header);

    item.sheet.render({ force: true });
  }

  static async #onItemDelete(event, target) {
    const header = target.closest(".summary");
    const actor = this.actor;
    const item = actor.items.get(header.dataset.itemId);

    if(!await confirmationDialog()) return;

    await this._onItemDelete_on(item);

    await item.delete();
  }

  static async #onEffectsEdit(event, target) {
    const actor = this.actor;
    const maxEffets = undefined;
    const stringPath = target.dataset.path;
    const name = target.dataset.name;
    const aspects = CONFIG.KNIGHT.listCaracteristiques;
    let path = actor;

    stringPath.split(".").forEach(function(key){
      path = path[key];
    });

    await new game.knight.applications.KnightEffetsDialog({actor:actor._id, item:null, isToken:this?.document?.isToken || false, token:this?.token || null, raw:path.raw, custom:path.custom, activable:path.activable, toUpdate:stringPath, aspects:aspects, maxEffets:maxEffets, title:`${name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
  }

  static async #onEffectsToggle(event, target) {
    const header = target.closest(".item") ?? target.closest(".headerData");

    const raw = header?.dataset.raw;
    const itemId = header?.dataset.itemId;
    const type = raw ?? target.dataset.type;
    const munition = target.dataset.munition;
    const pnj = target.dataset.pnj;
    const wpn = target.dataset.wpn;
    const id = target.dataset.id;

    const item = this.actor.items.get(itemId);

    if(!item) return;

    item.system.toggleEffect(id, type, munition, pnj, wpn);
  }

  static async #onSendMsg(event, target) {
    const name = target.dataset.name;
    const msg = target.dataset.msg;
    const cls = target.dataset.classes ?? 'normal';

    const exec = new game.knight.RollKnight(this.actor,
    {
      name:name,
    }).sendMessage({
      text:msg,
      classes:cls,
    });
  }

  static #onDialogRoll(event, target) {
    const actor = this.actor;
    const data = target.dataset;
    const label = data?.label || '';
    const noOd = data?.nood || false;
    const aspect  = data?.aspect || '';
    const caracteristique = data?.caracteristique || '';
    const caracAdd = data?.caracadd === undefined ? [] : data?.caracadd.split(',')
    const caracLock = data?.caraclock === undefined ? [] : data?.caraclock.split(',');
    const reussites = Number(data?.reussitebonus) || 0;
    const succesTemp = Number(data?.succestemp) || 0;
    const modTemp = Number(data?.modtemp) || 0;
    const id = actor.token ? actor.token.id : actor.id;

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
  }

  static async #onRoll(event, target) {
    const data = target.dataset;
    const name = data?.name ?? '';
    const value = data?.value ?? 0;
    const updates = data?.updates ?? {};

    const roll = new game.knight.RollKnight(this.actor, {
      name:name,
      dices:`${value}`,
    }, false);

    await roll.doRoll(updates);
  }

  static #onUseWpn(event, target) {
    const data = target.dataset;
    const isDistance = data?.isdistance ?? false;
    const parent = target.closest("div.wpn");
    const other = data.other;
    const what = data.what;
    let id = data.id;

    this.actor.system.useWpn(isDistance, {
      id,
      type:isDistance,
      name:other,
      num:what
    });
  }

  static #onChargeurClick(event, target) {
    const data = target.dataset;
    const typeBtn = data.typeBtn;

    const header = target.closest(".item");
    const id = header.dataset.itemId;

    const btn = target.closest(".btnChargeur");
    const dataBtn = btn.dataset;
    const index = dataBtn.index;
    const type = dataBtn.type;
    const munition = dataBtn.munition;
    const pnj = dataBtn.pnj;
    const wpn = dataBtn.wpn;

    const item = this.actor.items.get(id);

    if(!item) return;

    switch(typeBtn) {
      case 'plus':
        item.system.addMunition(index, type, munition, pnj, wpn);
        break;

      case 'minus':
        item.system.removeMunition(index, type, munition, pnj, wpn);
        break;
    }
  }

  static async #onOptionsClick(event, target) {
    const data = target.dataset;
    const value = data.value;
    const option = data.option;
    const armor = await getArmor(this.actor);
    let update = {};

    switch(option) {
      case 'resettype':
        if(!armor) return;

        update[`system.capacites.selected.type.type.herald.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.hunter.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.scholar.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.scout.-=selectionne`] = null;
        update[`system.capacites.selected.type.type.soldier.-=selectionne`] = null;
        update[`system.capacites.selected.type.selectionne`] = 0;

        armor.update(update);
        break;

      case 'resetwarlord':
        if(!armor) return;

        update[`system.capacites.selected.warlord.impulsions.action.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.energie.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.esquive.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.force.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.guerre.choisi`] = false;
        update[`system.capacites.selected.warlord.impulsions.selectionne`] = 0;

        armor.update(update);
        break;

      default:
        const result = value !== "true";

        this.actor.update({[`system.options.${option}`]:result});
        break;
    }
  }

  static #onRecoverClick(event, target) {
    const data = target.dataset;
    const type = data.type;

    this.actor.system.askToRestore(type);
  }

  static #onBtnToggle(event, target) {
    const data = target.dataset;
    const path = data.path;
    const value = foundry.utils.getProperty(this.actor, path);
    const result = value ? false : true;

    this.actor.update({[path]:result});
  }

  /* -------------------------------------------- */

  _generate_inputWithSpanMax(key) {
    const entries = {};
    entries[key] = {
      key:'inputWithSpanMax',
      label:`KNIGHT.LATERAL.${capitalizeFirstLetter(key)}`,
      value:`${key}.value`,
      min:0,
      max:`${key}.max`,
      tooltip:key,
      submenu:{
        base:{
          key:'input',
          label:'KNIGHT.AUTRE.Base',
          value:`${key}.base`
        },
        bonus:{
          key:'input',
          label:'KNIGHT.BONUS.Label',
          value:`${key}.bonus.user`
        },
        malus:{
          key:'input',
          label:'KNIGHT.MALUS.Label',
          value:`${key}.malus.user`
        }
      },
    }

    return entries
  }

  _generate_onlySpan(key) {
    const entries = {};
    entries[key] = {
      key:'onlySpan',
      label:`KNIGHT.LATERAL.${capitalizeFirstLetter(key)}`,
      value:`${key}.value`,
      tooltip:key,
      submenu:{
        base:{
          key:'input',
          label:'KNIGHT.AUTRE.Base',
          value:`${key}.base`
        },
        bonus:{
          key:'input',
          label:'KNIGHT.BONUS.Label',
          value:`${key}.bonus.user`
        },
        malus:{
          key:'input',
          label:'KNIGHT.MALUS.Label',
          value:`${key}.malus.user`
        }
      },
    }

    return entries;
  }

  _menu_entries() {
    const inputWithSpanMax = ['armure', 'energie'];
    const onlySpan = ['reaction', 'defense', 'initiative'];
    let entries = {};

    for(const key of inputWithSpanMax) {
      entries = {
        ...entries,
        ...this._generate_inputWithSpanMax(key),
      };
    }

    for(const key of onlySpan) {
      entries = {
        ...entries,
        ...this._generate_onlySpan(key),
      };
    }

    entries.separateur = {
      key:'separateur',
    };

    return entries;
  }

  _build_menu(list=[], sublist={}) {
    function buildMenuArray(entries, order=[], suborder={}) {
      return order
          .map(key => {
              const entry = entries[key];
              if (!entry) return null;

              const result = { ...entry };

              // Si submenu présent, on le transforme récursivement
              if (entry.submenu) {
                  const subOrder = suborder?.[key] ?? []; // ordre naturel de l'objet
                  result.submenu = buildMenuArray(entry.submenu, subOrder);
              }

              return result;
          })
          .filter(Boolean);
    }

    const entries = this._menu_entries();

    let menu = buildMenuArray(entries, list, sublist);

    return menu;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = context.document;

    this._prepareActor(actor);

    context.actor = actor;
    context.systemFields = this.document.system.schema.fields;
    context.systemData = actor.system;

    actualiseRoll(actor);

    return context;
  }

  _prepareActor(actor) {
    prepareCharacterItems(actor);
  }

  /**
  * Return a light sheet if in "limited" state
  * @override
  */
  /*_configureRenderParts(options) {
    const parts = super._configureRenderParts(options);

    if (!game.user.isGM && this.actor.limited) {
      return {
        limited: { template: "systems/knight/templates/actors/limited-sheet.html" }
      };
    }

    return parts;
  }*/

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);

    this._onRender_init(this.element);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    this.element.addEventListener('change', this._onChange.bind(this));
    this._onDiceHover(this.element);
  }

  /* -------------------------------------------- */
  _onRender_init(element) {
    const actor = this.actor;
    const system = actor.system;
    const isLimited = actor.limited;

    this.element.querySelectorAll('div.personnage div.hideShowLimited').forEach(el => {
      const hType = el.dataset.toverify;
      const defaut = el.dataset.default;
      const onlygm = el.dataset.onlygm;
      const show = system?.limited?.[hType] ?? defaut;

      if(!show) {
        if(isLimited) el.style.setProperty('display', 'none');
        if(!game.user.isGM && onlygm) el.style.setProperty('display', 'none');

        el.querySelector('i.showLimited')?.style.setProperty('display', 'none');
      } else {
        el.querySelector('i.hideLimited')?.style.setProperty('display', 'none');
      }

      if(onlygm && !isLimited && !game.user.isGM) el.style.setProperty('display', 'none');
      if(!game.user.isGM) el.querySelector('h2.header i')?.style.setProperty('display', 'none');
    });
  }

  _onDiceHover(element) {
    this.element.querySelectorAll('img.dice').forEach(el => {
      el.addEventListener('mouseenter', (event) => {
        event.currentTarget.src = 'systems/knight/assets/icons/D6White.svg';
      });

      el.addEventListener('mouseleave', (event) => {
        event.currentTarget.src = 'systems/knight/assets/icons/D6Black.svg';
      });
    });

    this.element.querySelectorAll('img.diceTarget').forEach(el => {
      el.addEventListener('mouseenter', (event) => {
        event.currentTarget.src = 'systems/knight/assets/icons/D6TargetBlack.svg';
      });

      el.addEventListener('mouseleave', (event) => {
        event.currentTarget.src = 'systems/knight/assets/icons/D6TargetWhite.svg';
      });
    });
  }

  async _onChange(event) {
    const target = event.target;

    if (target.matches('div.combat div.armesContact select.wpnMainChange')) {
      const tgt = event.currentTarget;
      const id = tgt.dataset.id;
      const value = tgt.value;

      this.actor.items.get(id).update({['system.options2mains.actuel']:value});
    }

    if (target.matches('div.combat div.armesDistance select.wpnMunitionChange')) {
      const tgt = event.currentTarget;
      const id = tgt.dataset.id;
      const niveau = target.dataset.niveau;
      const value = tgt.value;
      const item = this.actor.items.get(id);

      if(item.type === 'module') item.update({[`system.niveau.details.n${niveau}.arme.optionsmunitions.actuel`]:value});
      else item.update({['system.optionsmunitions.actuel']:value});
    }
  }

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

  async _onItemCreate_post(create) {}

  async _onItemEdit_on(item, header) {}

  async _onItemDelete_on(item) {};

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