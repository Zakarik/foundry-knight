import {
  listEffects,
  confirmationDialog,
  getDefaultImg,
  diceHover,
  options,
  hideShowLimited,
  dragMacro,
  getAllEffects
} from "../../helpers/common.mjs";

import {
  dialogRoll,
  actualiseRoll,
} from "../../helpers/dialogRoll.mjs";

import toggler from '../../helpers/toggler.js';


/**
 * @extends {ActorSheet}
 */
export class MechaArmureSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mechaarmure", "sheet", "actor"],
      template: "systems/knight/templates/actors/mechaarmure-sheet.html",
      width: 920,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "mechaarmure"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);
    this._prepareTranslateDurationModules(context);
    this._prepareEffetsModules(context);

    context.systemData = context.data.system;

    actualiseRoll(this.actor);

    console.warn(context);

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

    html.find('div.combat img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.modules").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.liste").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.liste").position().left > width) {
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

    html.find('div.listeAspects div.line').hover(ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6Black.svg");
    });

    html.find('.pilote-delete').click(ev => {
      this.actor.update({[`system.pilote`]:0});
    });

    html.find('.ajouterModule').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const data = this.actor.system;
      const value = data.modules.actuel[type];
      const modules = data.modules.liste[value];

      modules['key'] = value;
      modules['type'] = type;

      this.actor.update({[`system.modules.actuel.${type}`]:''});
      this.actor.update({[`system.configurations.liste.${type}.modules.${value}`]:modules});
    });

    html.find('.supprimerModule').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const value = target.data("value");

      this.actor.update({[`system.configurations.liste.${type}.modules.-=${value}`]:null});
    });

    html.find('div.combat .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const main = target.data("main");
      const type = target.data("type");

      await this._handleActivation(main, key, type);
    });

    html.find('div.combat button.configuration').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const data = this.actor.system.configurations.actuel;
      let result = type;

      if(data === type) result = "";

      this.actor.system.changeConfiguration(result);
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

    html.find('div.styleCombat > select').change(ev => {
      const update = {
        system: {
          combat:{
            data:{
              tourspasses:1,
              type:"degats"
            }
          }
        }
      };

      this.actor.update(update);
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const type = target.data("type");
      const caracteristique = target.data("caracteristique") || '';
      const getData = this.actor;

      if(!getData.system.pilote || getData.system.pilote === '0') return;

      let bonus = 0;

      switch(type) {
        case 'vitesse':
        case 'manoeuvrabilite':
        case 'puissance':
        case 'senseurs':
        case 'systemes':
          bonus += getData.system[type].value;
          break;
      }

      const actor = this.actor.token ? this.actor.token.id : this.actor.id;

      const dialog = new game.knight.applications.KnightRollDialog(actor, {
        label:label,
        base:caracteristique,
        modificateur:bonus,
      });

      dialog.open();
    });

    html.find('a.btnChargeurPlus').click(async ev => {
      const tgt = $(ev.currentTarget);
      const index = tgt.parents(".btnChargeur").data('index');
      const type = tgt.parents(".btnChargeur").data('type');

      this.actor.system.addMunition(index, type);
    });

    html.find('a.btnChargeurMoins').click(async ev => {
      const tgt = $(ev.currentTarget);
      const index = tgt.parents(".btnChargeur").data('index');
      const type = tgt.parents(".btnChargeur").data('type');

      this.actor.system.removeMunition(index, type);
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

    const ignoredTypes = [
      'armure', 'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma', 'contact', 'arme',
      'langue', 'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (ignoredTypes.includes(itemBaseType)) return;
    if (itemBaseType === 'module' && !options.modules) return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _onDropActor(event, data) {
    if ( !this.actor.isOwner ) return false;

    const cls = getDocumentClass(data?.type);
    const document = await cls.fromDropData(data);
    const type = document.type;

    if(type === 'knight') {

      const update = {
        system:{
          pilote:document.id
        }
      };

      this.actor.update(update);
    }
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const system = sheetData.data.system;
    const piloteId = system.pilote;
    const configuration = system.configurations.actuel;
    const base = system.configurations.liste.base.modules;
    const c1 = system.configurations.liste.c1.modules;
    const c2 = system.configurations.liste.c2.modules;
    const wpn = [];
    const wpnSpecial = [];
    let modules = base;
    let pilote = {};
    let moduleWraith = false;

    const existingModules = new Set([...Object.keys(base), ...Object.keys(c1), ...Object.keys(c2)]);
    let list = Object.keys(system.modules.liste)
      .filter(m => !existingModules.has(m))
      .map(m => ({key: m, label: game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${m.toUpperCase()}.Label`)}));

    if(configuration === 'c1') modules = foundry.utils.mergeObject(foundry.utils.deepClone(base), c1);
    else if(configuration === 'c2') modules = foundry.utils.mergeObject(foundry.utils.deepClone(base), c2);


    if(piloteId !== 0) {
      const piloteData = game.actors?.get(piloteId) || false;

      if(piloteData !== false) {
        const piloteSystem = piloteData.system;

        pilote.name = piloteData.name;
        pilote.surnom = piloteSystem.surnom;
        pilote.aspects = piloteSystem.aspects;
      }
    }

    const listWpn = ['canonMetatron', 'canonMagma', 'mitrailleusesSurtur', 'souffleDemoniaque', 'poingsSoniques'];
    const listWpnSpecial = ['lamesCinetiquesGeantes'];

    for(let m in modules) {
      let type = '';

      if(Object.keys(base).includes(m)) type = 'base';
      else if(Object.keys(c1).includes(m)) type = 'c1';
      else if(Object.keys(c2).includes(m)) type = 'c2';

      const data = modules[m];

      if(listWpn.includes(m)) {
        let noyaux = 0;

        switch(m) {
          case 'canonMagma':
            noyaux = parseInt(data.noyaux.simple);
            break;

          case 'souffleDemoniaque':
          case 'mitrailleusesSurtur':
          case 'canonMetatron':
          case 'poingsSoniques':
            noyaux = parseInt(data.noyaux);
            break;
        }

        wpn.push({
          type:type,
          _id:m,
          name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${name.toUpperCase()}.Label`),
          portee:data.portee,
          energie:noyaux,
          degats:data.degats,
          violence:data.violence,
          effets:data.effets
        });
      }

      if(listWpnSpecial.includes(m)) {
        let noyaux = 0;

        wpnSpecial.push({
          type:'special',
          subType:type,
          _id:name,
          name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${name.toUpperCase()}.Label`),
          portee:data.portee,
          energie:noyaux,
          degats:data.degats,
          violence:data.violence,
          effets:data.effets,
          eff1:data.eff1,
          eff2:data.eff2
        });
      }
    }

    actorData.modules = list;
    actorData.wpn = wpn;
    actorData.wpnSpecial = wpnSpecial;
    actorData.pilote = pilote;
    actorData.moduleWraith = moduleWraith;
  }

  _prepareEffetsModules(context) {
    const getData = context.data.system;
    const modules = ['canonMetatron', 'canonMagma', 'lamesCinetiquesGeantes', 'missilesJericho', 'souffleDemoniaque', 'poingsSoniques', 'chocSonique'];
    const effetsLabels = getAllEffects();

    for(let i = 0; i < modules.length;i++) {
      const base = getData.configurations.liste.base.modules?.[modules[i]] || false;
      const c1 = getData.configurations.liste.c1.modules?.[modules[i]] || false;
      const c2 = getData.configurations.liste.c2.modules?.[modules[i]] || false;

      if(base !== false) {
        const baseE = base.effets;

        baseE.liste = listEffects(baseE, effetsLabels, baseE?.chargeur);

        if(modules[i] === 'lamesCinetiquesGeantes') {
          const baseE1 = base.eff1.effets;
          const baseE2 = base.eff2.effets;

          const effets1 = [];
          const effets2 = [];

          for(let n = 0;n < baseE1.raw.length;n++) {
            const split = baseE1.raw[n].split(" ");
            const name = game.i18n.localize(effetsLabels[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets1.push({
              raw:baseE1.raw[n],
              name:complet,
              description:game.i18n.localize(effetsLabels[split[0]].description)
            });
          }

          for(let n = 0;n < baseE2.raw.length;n++) {
            const split = baseE2.raw[n].split(" ");
            const name = game.i18n.localize(effetsLabels[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets2.push({
              raw:baseE2.raw[n],
              name:complet,
              description:game.i18n.localize(effetsLabels[split[0]].description)
            });
          }

          baseE1.liste = effets1;
          baseE2.liste = effets2;
        }
      }

      if(c1 !== false) {
        const c1E = c1.effets;
        c1E.liste = listEffects(c1E, effetsLabels, c1E?.chargeur);

        if(modules[i] === 'lamesCinetiquesGeantes') {
          const c1E1 = c1E.eff1.effets;
          const c1E2 = c1E.eff2.effets;

          const effets1 = [];
          const effets2 = [];

          for(let n = 0;n < baseE1.raw.length;n++) {
            const split = baseE1.raw[n].split(" ");
            const name = game.i18n.localize(effetsLabels[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets1.push({
              raw:baseE1.raw[n],
              name:complet,
              description:game.i18n.localize(effetsLabels[split[0]].description)
            });
          }

          for(let n = 0;n < baseE2.raw.length;n++) {
            const split = baseE2.raw[n].split(" ");
            const name = game.i18n.localize(effetsLabels[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets2.push({
              raw:baseE2.raw[n],
              name:complet,
              description:game.i18n.localize(effetsLabels[split[0]].description)
            });
          }

          c1E1.liste = effets1;
          c1E2.liste = effets2;
        }
      }

      if(c2 !== false) {
        const c2E = c2.effets;

        c2E.liste = listEffects(c2E, effetsLabels, c2E?.chargeur);

        if(modules[i] === 'lamesCinetiquesGeantes') {
          const c2E1 = c2E.eff1.effets;
          const c2E2 = c2E.eff2.effets;

          const effets1 = [];
          const effets2 = [];

          for(let n = 0;n < baseE1.raw.length;n++) {
            const split = baseE1.raw[n].split(" ");
            const name = game.i18n.localize(effetsLabels[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets1.push({
              raw:baseE1.raw[n],
              name:complet,
              description:game.i18n.localize(effetsLabels[split[0]].description)
            });
          }

          for(let n = 0;n < baseE2.raw.length;n++) {
            const split = baseE2.raw[n].split(" ");
            const name = game.i18n.localize(effetsLabels[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets2.push({
              raw:baseE2.raw[n],
              name:complet,
              description:game.i18n.localize(effetsLabels[split[0]].description)
            });
          }

          c2E1.liste = effets1;
          c2E2.liste = effets2;
        }
      }
    }
  }

  _prepareTranslateDurationModules(context) {
    const getData = context.data.system;
    const modules = ['bouclierAmrita', "moduleEmblem", 'moduleWraith', 'modeSiegeTower'];

    for(let i = 0; i < modules.length;i++) {
      const base = getData.configurations.liste.base.modules?.[modules[i]] || false;
      const c1 = getData.configurations.liste.c1.modules?.[modules[i]] || false;
      const c2 = getData.configurations.liste.c2.modules?.[modules[i]] || false;

      if(base !== false) base.duree = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Duree`);

      if(c1 !== false) c1.duree = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Duree`);

      if(c2 !== false) c2.duree = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Duree`);
    }
  }

  _prepareTranslateRangeModules(context) {
    const getData = context.data.system;
    const modules = ['dronesEvacuation'];

    for(let i = 0; i < modules.length;i++) {
      const base = getData.configurations.liste.base.modules?.[modules[i]] || false;
      const c1 = getData.configurations.liste.c1.modules?.[modules[i]] || false;
      const c2 = getData.configurations.liste.c2.modules?.[modules[i]] || false;

      if(base !== false) base.portee = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Portee`);

      if(c1 !== false) c1.portee = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Portee`);

      if(c2 !== false) c2.portee = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Portee`);
    }
  }

  async _depenseNE(noyaux, label) {
    const getData = this.getData().data.system;
    const noyauxActuel = +getData.energie.value;
    let newEnergie = noyauxActuel - noyaux;

    if(newEnergie < 0) {
      const msgEnergie = {
        flavor:`${label}`,
        main:{
          total:`${game.i18n.localize(`KNIGHT.JETS.Notenergie`)}`
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
      const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

      await ChatMessage.create(msgFData, {
        rollMode:rMode
      });
      return false;
    }

    if(newEnergie < 0) newEnergie = 0;

    this.actor.update({[`system`]:{
      energie:{
        value:newEnergie
      }
    }});

    return true;
  }

  async _handleActivation(main, key, maintype) {
    const splittype = maintype.split('/');
    const complexe = ['moduleWraith', 'offering', 'dronesEvacuation', 'canonMagma'];
    const type = splittype[0];
    let subkey = null;
    let breakExec = false;

    if(complexe.includes(key)) {
      if(key === 'moduleWraith' && type === 'activation') subkey = 'base';
      else if(key === 'moduleWraith' && type === 'special') subkey = 'prolonger';
      else if(type === 'multi' && splittype[1] === 'noyaux') {
        const ask = await promptNumber({
          title: game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
          label: game.i18n.localize("KNIGHT.BONUS.Noyaux"),
          name: "noyaux",
          value: this.data.noyaux.actuel,
          min: this.data.noyaux.min,
          max: this.data.noyaux.max
        });
        if (ask != null) {
          await this.actor.update({[`system.configurations.liste.${this.main}.modules.${key}.noyaux.actuel`]:ask})
        } else breakExec = true;
      }
      else if(key === 'dronesEvacuation' && type === 'activation') {
        const ask = await promptNumber({
          title: game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`),
          label: game.i18n.localize("KNIGHT.LATERAL.Noyaux"),
          name: "noyaux",
          value: this.data.noyaux.actuel,
          min: this.data.noyaux.min,
          max: this.data.noyaux.max
        });
        subkey = 'actuel';
        if (ask != null) {
          await this.actor.update({[`system.configurations.liste.${this.main}.modules.${key}.noyaux.actuel`]:ask})
        } else breakExec = true;
      }
      else if(key === 'canonMagma' && type === 'activation') subkey = 'simple';
      else if(key === 'canonMagma' && type === 'special') subkey = 'bande';
    }


    if(!breakExec) await this.actor.system.activateCapacity(main, key, type, subkey)
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
