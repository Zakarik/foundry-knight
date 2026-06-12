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
  constructor(options = {}) {
    super(options);
    // État des sous-onglets : { subGroup: subTab }
    this._subTabs = {};
  }

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
      noItemCreate: BaseActorSheet.#onNoItemCreate,
      itemEdit: BaseActorSheet.#onItemEdit,
      itemDelete: BaseActorSheet.#onItemDelete,
      noItemDelete: BaseActorSheet.#onNoItemDelete,
      effectsEdit: BaseActorSheet.#onEffectsEdit,
      effectsToggle: BaseActorSheet.#onEffectsToggle,
      sendMsg: BaseActorSheet.#onSendMsg,
      dialogRoll: BaseActorSheet.#onDialogRoll,
      roll: BaseActorSheet.#onRoll,
      rollSuccess: BaseActorSheet.#onRollSuccess,
      useWpn: BaseActorSheet.#onUseWpn,
      chargeurClick: BaseActorSheet.#onChargeurClick,
      optionsClick: BaseActorSheet.#onOptionsClick,
      recoverClick: BaseActorSheet.#onRecoverClick,
      btnToggle: BaseActorSheet.#onBtnToggle,
      lockTooltip: BaseActorSheet.#onLockTooltip,
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

    this._subTabs[subGroup] = subTab;

    // Toggle des classes active sur tous les éléments du sous-groupe
    this.#applySubTab(subGroup, subTab);
  }

  static async #onItemCreate(event, target) {
    // Get the type of item to create.
    const type = target.dataset.type;

    // Grab any data associated with this control.
    const data = foundry.utils.deepClone(target.dataset);

    // Initialize a default name.
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;

    console.error(data);

    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      img:getDefaultImg(type),
      system: data
    };

    await this._onItemCreate_on(target, itemData);

    const create = await Item.create(itemData, {parent: this.actor});

    await this._onItemCreate_post(create, itemData);

    // Finally, create the item!
    return create;
  }

  static async #onNoItemCreate(event, target) {
    const tgt = target.dataset;
    const type = tgt.type;
    const actor = this.actor;
    let list = actor.system.progression[type].depense.liste;
    let addOrder;
    let length = 0;
    let update = {};

    function formatNewData(type, data) {
      let result = {};

      switch(type) {
        case 'gloire':
          result = {
            order:`${data.addOrder+1}`,
            nom:'',
            cout:'0',
            gratuit:false
          }
          break;

        case 'experience':
          result = {
            addOrder:`${data.addOrder+1}`,
            caracteristique:'',
            bonus:0,
            cout:0
          };
          break;
      }

      return result;
    }

    switch(type) {
      case 'gloire':
        const listAutre = actor.system.progression[type].depense?.autre || {};
        const pgIsEmpty = list[0]?.isEmpty ?? false;
        addOrder =  foundry.utils.isEmpty(list)  || isEmpty ? 0 : this._getHighestOrder(list);

        if(addOrder === -1) addOrder = Object.keys(list).length;

        for(const gloire in listAutre) {
          const obj = listAutre[gloire];

          length = Number(gloire);

          update[gloire] = {
            order:obj.order,
            nom:obj.nom,
            cout:obj.cout,
            gratuit:obj.gratuit
          }
        }

        update[length+1] = formatNewData(type, {addOrder});

        await actor.update({[`system.progression.${type}.depense.autre`]:update});
        break;

      case 'experience':
        let i = 0;
        addOrder =  foundry.utils.isEmpty(list) ? 0 : this._getHighestOrder(list);

        for(const e in list) {
          length = Number(e);

          update[e] = data[e];
        }

        update[length+1] = formatNewData(type, {addOrder});

        await actor.update({[`system.progression.${type}.depense.liste`]:update});
        break;
    }
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

  static async #onNoItemDelete(event, target) {
    const path = target.dataset.path;
    const index = target.dataset.index;
    const isArray = target.dataset.array === 'true' ? true : false;

    console.error(path, index, isArray);

    if(isArray) {
      const list = foundry.utils.getProperty(this.document.system, path);

      if(!list) return;

      list.splice(index, 1);

      this.document.update({[`system.${path}`]:list});
    } else this.document.update({[`system.${path}.-=${index}`]:null});

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
    const updatesPath = data?.updatesPath ?? '';
    const updatesPathSplit = updatesPath.split('/');
    const updatesValue = data?.updatesValue ?? '';
    const updatesValueSplit = updatesValue.split('/');
    let updates = {}

    updatesPathSplit.forEach((path, index) => {
      updates[path] = updatesValueSplit?.[index] ?? '';
    });

    const roll = new game.knight.RollKnight(this.actor, {
      name:name,
      dices:`${value}`,
    }, false);

    await roll.doRoll(updates);
  }

  static async #onRollSuccess(event, target) {
    const data = target.dataset;
    const name = data?.name ?? '';
    const value = data?.value ?? 0;
    const updates = data?.updates ?? {};

    const roll = new game.knight.RollKnight(this.actor, {
      name:name,
      dices:`${value}`,
    });

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
    const itemId = data.itemId;
    const document = itemId ? this.actor.items.get(itemId) : this.actor;
    const value = foundry.utils.getProperty(document, path);
    const result = value ? false : true;

    console.error(itemId);
    console.error(path);
    console.error(document);
    console.error(value);
    console.error(result);

    document.update({[path]:result});
  }

  static #onLockTooltip(event, target) {
    const element = target;

    if (element._lockedTooltip) {
        game.tooltip.dismissLockedTooltip(element._lockedTooltip);
        element._lockedTooltip = null;
        return;
    }

    // Sinon, on active puis on verrouille
    game.tooltip.activate(element);
    element._lockedTooltip = game.tooltip.lockTooltip();
  }

  /* -------------------------------------------- */

  #generate_std_submenu(path) {
    return {
      base:{
        key:'input',
        label:'KNIGHT.AUTRE.Base',
        value:`${path}.base`
      },
      bonus:{
        key:'input',
        label:'KNIGHT.BONUS.Label',
        value:`${path}.bonus.user`
      },
      malus:{
        key:'input',
        label:'KNIGHT.MALUS.Label',
        value:`${path}.malus.user`
      },
    }
  }

  #generate_selectWithTooltip(args={}) {
    const { options={} } = args;

    let result = { options };

    return result;
  }

  #generate_inputWithSpanMax(args={}) {
    const {
      path,
      min=0,
      max,
      pathMax=undefined,
      subPath=undefined,
      submenu={},
    } = args;

    let result = {};

    if(path) {
      result.value = `${path}.value`;
    }
    if(path || subPath) {
      result.submenu = {
        ...this.#generate_std_submenu(subPath ? subPath : path),
      }
    }

    if(submenu) result.submenu = {...result?.submenu ?? {}, ...submenu}
    if(path || pathMax) result.max = `${pathMax ? pathMax : path}.max`;
    if(min) result.min = min;

    return result;
  }

  #generate_inputWithSpanMaxWithButtons(args={}) {
    const {
      path,
      min,
      btn,
      pathMax=undefined,
      subPath=undefined,
      submenu={},
    } = args;

    let result = {};

    if(path) {
      result.value = `${path}.value`;
    }
    if(path || subPath) {
      result.submenu = {
        ...this.#generate_std_submenu(subPath ? subPath : path),
      }
    }

    if(submenu) result.submenu = {...result?.submenu ?? {}, ...submenu}
    if(path || pathMax) result.max = `${pathMax ? pathMax : path}.max`;
    if(min) result.min = min;
    if(btn) result.btn = btn;

    return result;
  }

  #generate_onlySpan(args={}) {
    const {
      path,
      subPath=undefined,
      submenu={},
    } = args;

    let result = {};

    if(path) {
      result.value = `${path}.value`;
    }
    if(path || subPath) {
      result.submenu = {
        ...this.#generate_std_submenu(subPath ? subPath : path),
      }
    }
    if(submenu) result.submenu = {...result?.submenu ?? {}, ...submenu}

    return result;
  }

  #generate_onlySpanWithButtons(args={}) {
    const {
      path,
      btn,
      subPath=undefined,
      submenu={},
    } = args;

    let result = {};

    if(path) {
      result.value = `${path}.value`;
      result.submenu = {
        ...this.#generate_std_submenu(subPath ? subPath : path),
      }
    }
    if(btn) result.btn = btn;
    if(submenu) result.submenu = {...result?.submenu ?? {}, ...submenu}

    return result;
  }

  #generate_onlySpanWithDice(args={}) {
    const {
      path,
      subPath=undefined,
      submenu={},
    } = args;

    let result = {};

    if(path) {
      result.dice = `${path}.dice`;
      result.value = `${path}.value`;
      result.submenu = {
        dice:{
          key:'input',
          label:'KNIGHT.JETS.Des',
          value:`${path}.diceBase`
        },
        bonus:{
          key:'input',
          label:'KNIGHT.BONUS.Label',
          value:`${path}.bonus.user`
        },
        malus:{
          key:'input',
          label:'KNIGHT.MALUS.Label',
          value:`${path}.malus.user`
        },
      }
    }
    if(submenu) result.submenu = {...result?.submenu ?? {}, ...submenu}

    return result;
  }

  #generate_simpleInput(args={}) {
    const { } = args;

    let result = {};

    return result;
  }

  #generate_doubleInput(args={}) {
    const { } = args;

    let result = {};

    return result;
  }

  _generate_menu(menu=[]) {
    const entries = {};

    menu.forEach(m => {
      const {
        key,
        name,
        cls='',
        path,
        label,
        tooltip=name,
      } = m;

      let std = {
        key,
        name,
        class:`block ${key} ${cls}`,
      }

      if(label) std.label = label;
      if(path) std.path = path;
      if(tooltip) std.tooltip = tooltip;

      switch(key) {
        case 'selectWithTooltip':
          entries[name] = {
            ...std,
            ...this.#generate_selectWithTooltip(m),
          }
          break;

        case 'inputWithSpanMax':
          entries[name] = {
            ...std,
            ...this.#generate_inputWithSpanMax(m),
          }
          break;

        case 'inputWithSpanMaxWithButtons':
          entries[name] = {
            ...std,
            ...this.#generate_inputWithSpanMaxWithButtons(m),
          }
          break;

        case 'onlySpan':
          entries[name] = {
            ...std,
            ...this.#generate_onlySpan(m),
          }
          break;

        case 'onlySpanWithButtons':
          entries[name] = {
            ...std,
            ...this.#generate_onlySpanWithButtons(m),
          }
          break;

        case 'onlySpanWithDice':
          entries[name] = {
            ...std,
            ...this.#generate_onlySpanWithDice(m),
          }
          break;

        case 'simpleInput':
          entries[name] = {
            ...std,
            ...this.#generate_simpleInput(m),
          }
          break;

        case 'doubleInput':
          entries[name] = {
            ...std,
            ...this.#generate_doubleInput(m),
          }
          break;
      }
    })

    return entries;
  }

  _menu_entries() {
    const inputWithSpanMax = ['armure', 'energie'];
    const onlySpan = ['reaction', 'defense'];
    const onlySpanWithDice = ['initiative'];
    const menu = [];
    let entries = {};

    for(const key of inputWithSpanMax) {
      menu.push({
        key:'inputWithSpanMax',
        name:key,
        label:`KNIGHT.LATERAL.${capitalizeFirstLetter(key)}`,
        path:`${key}`,
        tooltip:`${key}`,
      });
    }

    for(const key of onlySpan) {
      menu.push({
        key:'onlySpan',
        name:key,
        label:`KNIGHT.LATERAL.${capitalizeFirstLetter(key)}`,
        path:`${key}`,
        tooltip:`${key}`,
      });
    }

    for(const key of onlySpanWithDice) {
      menu.push({
        key:'onlySpanWithDice',
        name:key,
        label:`KNIGHT.LATERAL.${capitalizeFirstLetter(key)}`,
        path:`${key}`,
        tooltip:`${key}`,
      })
    }

    entries.separateur = {
      key:'separateur',
    };

    entries = {
      ...entries,
      ...this._generate_menu(menu),
    }

    console.error(entries);

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

    console.error(context);

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
  #applySubTab(subGroup, subTab) {
    this.element.querySelectorAll(`[data-sub-group="${subGroup}"]`).forEach(node => {
        const isDiv = node.dataset.div;
        const active = node.dataset.subTab === subTab;
        if (isDiv) node.closest('div.summary').classList.toggle('active', active);
        else node.classList.toggle('active', active);
    });
  }

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);

    for (const [subGroup, subTab] of Object.entries(this._subTabs)) {
        this.#applySubTab(subGroup, subTab);
    }

    this._onRender_init(this.element);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    this.element.addEventListener('change', this._onChange.bind(this));
    this.element.querySelectorAll('[data-action="lockTooltip"]').forEach(el => {
      el.addEventListener('mouseenter', this._onMouseEnter.bind(this));
      el.addEventListener('mouseleave', this._onMouseLeave.bind(this));
    });
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

    this.element.querySelectorAll('.diceHover').forEach(el => {
      el.addEventListener('mouseenter', (event) => {
        const img = event.currentTarget.querySelector('img.dice');
        img.src = 'systems/knight/assets/icons/D6White.svg';
      });

      el.addEventListener('mouseleave', (event) => {
        const img = event.currentTarget.querySelector('img.dice');
        img.src = 'systems/knight/assets/icons/D6Black.svg';
      });
    });

    this.element.querySelectorAll('img.diceTarget').forEach(el => {
      el.addEventListener('mouseenter', (event) => {
        event.currentTarget.src = 'systems/knight/assets/icons/D6TargetWhite.svg';
      });

      el.addEventListener('mouseleave', (event) => {
        event.currentTarget.src = 'systems/knight/assets/icons/D6TargetBlack.svg';
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

  async _onMouseEnter(event) {
    const target = event.target;
    game.tooltip.activate(target);
  }

  async _onMouseLeave(event) {
    const target = event.target;
    game.tooltip.deactivate();
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

  async _onItemCreate_post(create, itemData) {}

  async _onItemEdit_on(item, header) {}

  async _onItemDelete_on(item) {};

  async _onDropItemCreate_on(itemData) {
    return true;
  }

  async _onDropItemCreate_post(dropCreateOn, itemCreate) {
    return true;
  }

  async _onDroppedActor(data) {}

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