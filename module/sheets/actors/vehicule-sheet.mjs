import {
  listEffects,
  confirmationDialog,
  getDefaultImg,
  diceHover,
  options,
  hideShowLimited,
  dragMacro,
  actualiseRoll,
  getAllEffects,
} from "../../helpers/common.mjs";

import toggler from '../../helpers/toggler.js';

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
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "vehicule"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);
    this._prepareTranslation(context.actor, context.data.system);

    context.systemData = context.data.system;
    context.systemData.wear = 'armure';

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

    hideShowLimited(this.actor, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    diceHover(html);
    options(html, this.actor);

    html.find('.modules .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const module = target.data("module");
      const name = target.data("name");
      const cout = eval(target.data("cout"));
      const value = target.data("value") ? false : true;

      const depense = await this._depensePE(name, cout, true, html);

      if(!depense) return;

      const dataModule = this.actor.items.get(module),
          data = dataModule.system,
          niveau = data.niveau.value,
          dataNiveau = data.niveau.details[`n${niveau}`];

      dataModule.update({[`system.active.base`]:value});

      if(dataNiveau.jetsimple.has && value) {
        const jSREffects = await getEffets(this.actor, 'contact', 'standard', {}, dataNiveau.jetsimple.effets, {raw:[], custom:[]}, {raw:[], custom:[]}, {raw:[], custom:[]}, false);
        const execJSR = new game.knight.RollKnight(dataNiveau.jetsimple.jet, this.actor.system);
        await execJSR.evaluate();

        let jSRoll = {
          flavor:dataNiveau.jetsimple.label,
          main:{
            total:execJSR._total,
            tooltip:await execJSR.getTooltip(),
            formula: execJSR._formula
          },
          other:jSREffects.other
        };

        const jSRMsgData = {
          user: game.user.id,
          speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          rolls:[execJSR].concat(jSREffects.rollDgts),
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', jSRoll),
          sound: CONFIG.sounds.dice
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgFData = ChatMessage.applyRollMode(jSRMsgData, rMode);

        await ChatMessage.create(msgFData, {
          rollMode:rMode
        });
      }
    });

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

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;
      const actorId = data.data.system.equipage.pilote.id;
      if(actorId === '') return;

      const dialog = new game.knight.applications.KnightRollDialog(actorId, {
        label:label,
        base:aspect,
        succesbonus:reussites,
      });

      dialog.open();
    });

    html.find('.passager-delete').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.actor.system;
      const oldPassager = data.equipage.passagers;
      oldPassager.splice(id,1);

      this.actor.update({[`system.equipage.passagers`]:oldPassager});
    });

    html.find('.pilote-delete').click(ev => {
      this.actor.update({[`system.equipage.pilote`]:{
        name:'',
        id:''
      }});

    });

    html.find('.passager-edit').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.actor.system;
      const pilote = data.equipage.pilote;
      const oldPassager = data.equipage.passagers;
      const passager = oldPassager[id];

      let update = {};

      update[`system.equipage.pilote`] = {
        id:passager.id,
        name:passager.name
      };

      if(pilote.id) {
        oldPassager.push({
          name:pilote.name,
          id:pilote.id
        });
      }

      update[`system.equipage.passagers`] = oldPassager.filter(itm => itm.id !== passager.id);

      this.actor.update(update);
    });

    html.find('.pilote-edit').click(ev => {
      const target = $(ev.currentTarget).parents(".value");
      const id = target.data("id");
      const data = this.actor.system;
      const oldPassager = data.equipage.passagers;
      oldPassager.push({
        name:data.equipage.pilote.name,
        id:data.equipage.pilote.id
      });

      let update = {};
      update[`system.equipage.passagers`] = oldPassager;
      update[`system.equipage.pilote`] = {
        id:'',
        name:''
      };

      this.actor.update(update);
    });

    html.find('.jetPilotage').click(ev => {
      const actorId = this.actor.system.equipage.pilote.id;
      const manoeuvrabilite = this.actor.system.manoeuvrabilite;
      const label = `${game.i18n.localize("KNIGHT.VEHICULE.Pilotage")} : ${this.actor.name}`

      if(actorId === '') return;
      const actor = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(actor, {
        whoActivate:actorId,
        label:label,
        succesbonus:manoeuvrabilite,
      });

      dialog.open();
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const actorId = target.data("who");
      let id = target.data("id");
      let modificateur = 0;

      if(actorId === '') return;
      const item = this.actor.items.get(id);

      if(item.type === 'module') id = `module_${id}`;

      const actor = this.actor.token ? this.actor.token.id : this.actor.id;
      const getActor = this.actor.token ? canvas.tokens.get(actor).actor : game.actors.get(actor);

      if(getActor) {
        if(actor.type === 'pnj' || actor.type === 'creature') {
          const beteAE = (getActor.system?.aspects?.bete?.ae?.majeur?.value ?? 0) > 0 || (getActor.system?.aspects?.bete?.ae?.mineur?.value ?? 0) > 0 ? true : false
          const machineAE = (getActor.system?.aspects?.machine?.ae?.majeur?.value ?? 0) > 0 || (getActor.system?.aspects?.machine?.ae?.mineur?.value ?? 0) > 0 ? true : false
          const masqueAE = (getActor.system?.aspects?.masque?.ae?.majeur?.value ?? 0) > 0 || (getActor.system?.aspects?.masque?.ae?.mineur?.value ?? 0) > 0 ? true : false
          const hasFumigene = this.actor.statuses.has('fumigene');
          const notFumigene = beteAE || machineAE || masqueAE ? true : false;

          if(hasFumigene && !notFumigene) modificateur -= 3;
        } else if(actor.type === 'knight') {
          const hasFumigene = this.actor.statuses.has('fumigene');
          if(hasFumigene) modificateur -= 3;
        }
      }

      const dialog = new game.knight.applications.KnightRollDialog(actor, {
        whoActivate:actorId,
        label:name,
        wpn:id,
        modificateur
      });

      dialog.open();
    });

    html.find('.whoActivate').change(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const niveau = target.data("niveau");
      const value = target.val();
      const item = this.actor.items.get(id);

      if(item.type === 'module') {
        item.update({[`system.niveau.details.n${niveau}.whoActivate`]:value});
      } else {
        item.update({['system.whoActivate']:value});
      }
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
        type:header.dataset.subtype
      };
      delete itemData.system["subtype"];
    }

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropActor(event, data) {
    if ( !this.actor.isOwner ) return false;

    const cls = getDocumentClass(data?.type);
    const document = await cls.fromDropData(data);
    const type = document.type;

    if(type === 'knight' || type === 'pnj') {
      const passagers = this.actor.system.equipage.passagers;

      if(passagers.find(itm => itm.id === document.id)) return;

      passagers.push({
        name:document.name,
        id:document.id
      });

      this.actor.update({['system.equipage.passagers']:passagers});
    }
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;
    const armeType = itemData[0].system.type;

    const typesValides = [
      'armure', 'capacite',
      'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma',
      'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (typesValides.includes(itemBaseType)) return;
    if (itemBaseType === 'arme' && armeType === 'contact') return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    const armesDistance = [];
    const module = [];
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
    const labels = Object.assign({}, getAllEffects());

    for (let i of sheetData.items) {
      const data = i.system;

      // ARME
      if (i.type === 'arme') {
        const raw = data.effets.raw;
        const custom = data.effets.custom;

        data.effets.liste = listEffects(raw, custom, labels);

        const rawDistance = data.distance.raw;
        const customDistance = data.distance.custom;
        const optionsMunitions = data?.optionsmunitions?.has || false;
        const munition = data?.options2mains?.actuel || "";
        const effetMunition = data?.optionsmunitions?.liste || {};

        data.distance.liste = listEffects(rawDistance, customDistance, labels);

        if(optionsMunitions === true) {
          data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
          data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

          data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
          data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;

          for (let [kM, munition] of Object.entries(effetMunition)) {
            const bRaw2 = munition.raw || [];
            const bCustom2 = munition.custom || [];

            munition.liste = listEffects(bRaw2, bCustom2, labels);
          }
        }

        armesDistance.push(i);
      }

      // MODULE
      if (i.type === 'module') {
        const niveau = data.niveau.value;
        const itemDataNiveau = data.niveau.details[`n${niveau}`];
        const itemBonus = itemDataNiveau?.bonus || {has:false};
        const itemArme = itemDataNiveau?.arme || {has:false};
        const itemOD = itemDataNiveau?.overdrives || {has:false};
        const itemActive = data?.active?.base || false;
        const itemErsatz = itemDataNiveau.ersatz;
        const itemWhoActivate = itemDataNiveau?.whoActivate || '';
        const dataMunitions = itemArme?.optionsmunitions || {has:false};

        if(dataMunitions.has) {
          for (const [key, value] of Object.entries(dataMunitions.liste)) {
            itemArme.optionsmunitions.liste[key].liste = listEffects(value.raw, value.custom, labels);
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
          }

          if(itemArme.has) {
            const moduleEffets = itemArme.effets;

            let degats = itemArme.degats;
            let violence = itemArme.violence;

            if(dataMunitions.has) {
              degats = dataMunitions.liste[dataMunitions.actuel]?.degats || {dice:0, fixe:0};
              violence = dataMunitions.liste[dataMunitions.actuel]?.violence || {dice:0, fixe:0};
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
                  custom:moduleEffets.custom
                },
                niveau:niveau,
                whoActivate:itemWhoActivate,
              }
            }

            if(itemArme.type === 'distance') {
              armesDistance.push(moduleWpn);
            }
          }
        }

        i.system.bonus = itemBonus;
        i.system.arme = itemArme;
        i.system.overdrives = itemOD;
        i.system.ersatz = itemErsatz;
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

        module.push(i);
      }
    }

    for(let i = 0;i < armesDistance.length;i++) {
      armesDistance[i].system.degats.module = {};
      armesDistance[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistance[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistance[i].system.violence.module = {};
      armesDistance[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistance[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    }

    actorData.armesDistance = armesDistance;
    actorData.modules = module;
  }

  async _depensePE(label, depense, autosubstract=true, html=false) {
    const data = this.getData();
    const actuel = +data.systemData.energie.value;
    const substract = actuel-depense;

    if(substract < 0) {
      const lNot = game.i18n.localize('KNIGHT.JETS.Notenergie');

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

      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(msgEnergieData, rMode);

      await ChatMessage.create(msgData, {
        rollMode:rMode
      });

      return false;
    } else {

      if(autosubstract) {
        let update = {
          system:{}
        };

        if(html !== false) {
          html.find(`div.energie input.value`).val(substract);
        } else {
          update.system.energie.value = substract;
        }

        this.actor.update(update);
      }

      return true;
    }
  }

  _prepareTranslation(actor, system) {
    const { modules,
      armesDistance } = actor;
    const labels = Object.assign({}, getAllEffects());
    const wpnModules = [
      {data:modules, key:'modules'},
      {data:armesDistance, key:'armes'},
    ];

    for(let i = 0;i < wpnModules.length;i++) {
      const base = wpnModules[i];
      const data = base.data;

      if(!data) continue;

      const listData = {
        modules:[{path:['system.effets', 'system.arme.effets', 'system.arme.distance', 'system.arme.structurelles', 'system.arme.ornementales', 'system.jetsimple.effets'], simple:true}],
        armes:[{path:['system.effets', 'system.effets2mains', 'system.distance', 'system.structurelles', 'system.ornementales'], simple:true}],
        grenades:[{path:['effets'], simple:true}]
      }[base.key];

      this._updateEffects(data, listData, labels, true);

      for(let n = 0;n < data.length;n++) {
        const optMun = data[n]?.system?.optionsmunitions?.has || false;

        if(base.key === 'armes' && optMun) {
          const dataMunitions = data[n].system.optionsmunitions;

          for (const [key, value] of Object.entries(dataMunitions.liste)) {
            value.liste = listEffects(value.raw, value.custom, labels);
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
      effets.liste = listEffects(effets.raw, effets.custom, labels);
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
