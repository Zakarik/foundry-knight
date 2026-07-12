import {
  getArmor,
  getCaracValue,
  getODValue,
  getDefaultImg,
  capitalizeFirstLetter,
} from "../../helpers/common.mjs";

import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import HumanMixinSheet from "../bases/mixin-human-sheet.mjs";

/**
 * @extends {BaseActorSheet}
 */
export class KnightSheet extends HumanMixinSheet(BaseActorSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["knight"],
    position: { width: 1020, height: 720 },
    actions:{
      editDialog:KnightSheet.#onEditDialog,
      wpnEquip:KnightSheet.#onWpnEquip,
      changeEquip:KnightSheet.#onChangeEquip,
      adlImport:KnightSheet.#onAdlImport,
      evolution:KnightSheet.#onEvolution,
    }
  }

  static PARTS = {
    upperheader: { template: "systems/knight/templates/actors/parts/common/sections/upperheader.hbs" },
    header: { template: "systems/knight/templates/actors/parts/human/sections/header.hbs" },
    menu: { template: "systems/knight/templates/actors/parts/common/sections/menu.hbs", },
    nav: { template: "templates/generic/tab-navigation.hbs" },
    personnage: {
      template: "systems/knight/templates/actors/parts/human/tabs/personnage.hbs",
      classes:['tab', 'personnage'],
    },
    aspectsCaracteristiques: {
      template: "systems/knight/templates/actors/parts/pc/tabs/caracteristiques.hbs",
      classes:['tab', 'aspectsCaracteristiques'],
    },
    art: {
      template: "systems/knight/templates/actors/parts/human/tabs/art.hbs",
      classes:['tab', 'art'],
    },
    armure: {
      template: "systems/knight/templates/actors/parts/pc/tabs/armure.hbs",
      classes:['tab', 'armure'],
    },
    combat: {
      template: "systems/knight/templates/actors/parts/common/tabs/combat.hbs",
      classes:['tab', 'combat'],
     },
    historique: {
      template: "systems/knight/templates/actors/parts/human/tabs/historique.hbs",
      classes:['tab', 'historique'],
    },
    progression: {
      template: "systems/knight/templates/actors/parts/pc/tabs/progression.hbs",
      classes:['tab', 'progression'],
    },
    autre: {
      template: "systems/knight/templates/actors/parts/human/tabs/autre.hbs",
      classes:['tab', 'autre'],
    },
  }

  static TABS = {
    primary:{
      tabs:[
        { id:'personnage', label:'KNIGHT.PERSONNAGE.Label' },
        { id:'aspectsCaracteristiques', label:'KNIGHT.ASPECTS.Label' },
        { id:'art', label:'KNIGHT.ART.Label' },
        { id:'armure', label:'' },
        { id:'combat', label:'KNIGHT.COMBAT.Label' },
        { id:'historique', label:'KNIGHT.HISTORIQUE.Label' },
        { id:'progression', label:'KNIGHT.PROGRESSION.Label' },
        { id:'autre', label:'KNIGHT.AUTRE.Label' },
      ],
      initial:'personnage',
    },
  }

  get canDropActor() {
    return true;
  }

  get actorTypesValides() {
    return ['ia'];
  }

  get itemTypesValides() {
    return [...super.itemTypesValides,
      'module', 'armure',
      'avantage', 'inconvenient',
      'carteheroique', 'capaciteheroique',
      'motivationMineure', 'contact',
      'blessure', 'trauma', 'langue',
      'armurelegende', 'distinction',
      'capaciteultime', 'cyberware'];
  }

  get hasGloire() {
    return true;
  }
  /* -------------------------------------------- */

  static async #onEditDialog(event, target) {
    const tgt = target.dataset;
    const aspect = tgt.aspect;
    const label = game.i18n.localize(CONFIG.KNIGHT.aspects[aspect]);
    const dataAspect = this.actor.system.aspects[aspect];
    const actor = this.actor;

    let editCarac = ``;
    let listCarac = [];

    for (let [key, carac] of Object.entries(dataAspect.caracteristiques)){
      editCarac += `
      <label class="line">
          <span class="label">${game.i18n.localize(CONFIG.KNIGHT.caracteristiques[key])}</span>
          <input type="number"  data-dtype="Number"class="${key}" name="system.aspects.${aspect}.caracteristiques.${key}.base" data-type="caracteristique" value="${carac.base}" min="0" max="9" />
      </label>
      `;
      listCarac.push(key);
    }

    const editDialog = `
    <input type="number"  data-dtype="Number"class="aspect"  name="system.aspects.${aspect}.base" data-type="aspect" value="${dataAspect.base}" min="0" max="9" />
    <div class="main">${editCarac}</div>
    `;

    const edit = await game.knight.applications.KnightEditDialog({
      title: actor.name+" : "+label,
      actor:actor.id,
      content: editDialog,
    });

    if(edit !== 'cancel') {
      let update = {};

      for(let key in edit) {
        update[key] = edit[key];
      }

      actor.update(update);
    }
  }

  static #onWpnEquip(event, target) {
      const header = target.closest('.summary');
      const data = header.dataset;
      const item = this.actor.items.get(data.itemId);
      const type = target.dataset.type;

      item.system.equip(type);
  }

  static async #onChangeEquip(event, target) {
    const tgt = target.dataset;
    const type = tgt.type;
    const data = this.actor.system;
    const wear = data.wear;
    let itemUpdate = '';

    if(type === data.wear) return;

    const update = {};

    update[`system.wear`] = type;

    switch(wear) {
      case 'armure':
        itemUpdate = `system.armure.value`;
        break;

      case 'ascension':
      case 'guardian':
        update[`system.equipements.${wear}.armure.value`] = data.armure.value
        break;
    }

    switch(type) {
      case 'armure':
        const armor = await getArmor(this.actor);

        update[`system.armure.value`] = armor.system.armure.value;
        update['system.jauges'] = armor.system.jauges;
        break;

      case 'ascension':
      case 'guardian':
        update[`system.armure.value`] = data.equipements[type].armure.value;
        update['system.jauges'] = data.equipements[type].jauges;
        break;

      case 'tenueCivile':
        update['system.jauges'] = data.equipements[type].jauges;
        break;
    }

    if(type != 'armure') this._resetArmure(this.actor);

    this.actor.update(update);

    if(itemUpdate !== '') {
      const armor = await getArmor(this.actor);

      armor.update({[itemUpdate]:data.armure.value});
    }
  }

  static async #onAdlImport(event, target) {
    const tgt = target.dataset;
    const type = tgt.type;
    const actor = this.actor;
    const itm = actor.items.filter(itm => itm.type === 'arme' && itm.system.type === type);
    let html = ``;

    if (itm.length) {
        html += `<h1>Choisir l'arme à écraser</h1>`;
        html += `<div class='select'>`;
        html += `<select class="typeToImport" name="typeToImport">`;
        html += `<option value='null'>Importer une nouvelle arme</option>`;
        for (let i of itm) {
            html += `<option value='${i.id}'>${i.name}</option>`;
        }
        html += `</select>`;
        html += `<span>Sera ignoré en cas d'import du Longbow, car les paramètres du Longbow seront remplacés.</span>`;
        html += `</div>`;
    }

    html += `<textarea class="toImport" name="toImport"></textarea>`;

    await foundry.applications.api.DialogV2.wait({
        window: {
            title: game.i18n.localize('KNIGHT.IMPORT.LabelKJDRS'),
        },
        classes: ["knight-import-adl"],
        position: {
            height: 270,
        },
        content: html,
        buttons: [
            {
                action: "one",
                label: game.i18n.localize('KNIGHT.IMPORT.ImporterArme'),
                default: true,
                callback: async (event, button, dialog) => {
                    try {
                        const target = button.form.elements.typeToImport?.value ?? 'null';
                        const data = button.form.elements.toImport.value;
                        const json = JSON.parse(data);

                        if (json.chassis === game.i18n.localize('KNIGHT.IMPORT.Longbow')) {
                            this.actor.system.dataArmor.system.importLongbow(json);
                        } else if (target === 'null') {
                            const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;
                            const itemData = {
                                name: name,
                                type: 'arme',
                                img: getDefaultImg('arme'),
                                system: {
                                    type: type,
                                }
                            };
                            const create = await Item.create(itemData, { parent: this.actor });
                            create.system.importWpn(json);
                        } else {
                            const wpn = await this.actor.items.get(target);
                            wpn.system.importWpn(json);
                        }
                    } catch {
                        ui.notifications.error(game.i18n.localize('KNIGHT.IMPORT.Error'));
                    }
                }
            }
        ],
    });
  }

  static async #onEvolution(event, target) {
    const tgt = target.dataset;
    const type = tgt.type;
    const dataArmor = await getArmor(this.actor);

    if(!dataArmor) {
      ui.notifications.error(game.i18n.localize("KNIGHT.ERROR.NoArmor"));
      return;
    }

    switch(type) {
      case 'armor':
        this._armorEvolutions(target, dataArmor);
        break;

      case 'companion':
        this._companionEvolutions(target, dataArmor);
        break;
    }
  }

  /* -------------------------------------------- */

  async _armorEvolutions(target, armor) {
    const tgt = target.dataset;
    const id = tgt.num;
    const listEvolutions = armor.system.evolutions.liste;
    const dataEArmor = listEvolutions[id]?.data ?? {};
    const capacites = listEvolutions[id]?.capacites ?? {};
    const gloireListe = this.actor.system.progression.gloire.depense.liste;
    const isEmpty = gloireListe[0]?.isEmpty ?? false;
    const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
    const filter = [];
    const update = {};
    const LZString = globalThis.LZString;
    const { archivage, ...dataToSave } = armor.system;
    let special = listEvolutions[id]?.special ?? {};

    update[`system.archivage.liste.${listEvolutions?.[id]?.value}`] = LZString.compressToUTF16(JSON.stringify(dataToSave));

    for (let [key, spec] of Object.entries(special)) {
      if(spec?.delete?.value === true) {
        update[`system.special.selected.-=${key}`] = null;
        filter.push(key);
        delete special[key];
      }
    }

    update[`system.espoir.value`] = dataEArmor.espoir;
    update[`system.armure.base`] = armor.system.armure.base+dataEArmor.armure;
    update[`system.champDeForce.base`] = armor.system.champDeForce.base+dataEArmor.champDeForce;
    update[`system.energie.base`] = armor.system.energie.base+dataEArmor.energie;
    update[`system.energie.value`] = armor.system.energie.value+dataEArmor.energie;
    update[`system.capacites.selected`] = capacites;
    update[`system.special.selected`] = special;
    update[`system.evolutions.liste.${id}`] = {
      applied:true,
      addOrder:addOrder+1
    };

    for (let [key, evolutions] of Object.entries(listEvolutions)) {
      const num = +key;

      if(num > id) {
        for(let i = 0;i < filter.length;i++) {
          const hasSpecial = evolutions.special?.[filter[i]] || false;

          if(hasSpecial !== false) {
            update[`system.evolutions.liste.${num}.special.-=${filter[i]}`] = null;
          }
        }
      }
    }

    await armor.update(update);
  }

  async _companionEvolutions(target, armor) {
    const actor = this.actor;
    const tgt = target.dataset;
    const id = tgt.num;
    const dataCompanions = armor.system.capacites.selected.companions;
    const dataWolfConfig = dataCompanions.wolf.configurations;
    let data = armor.system.evolutions.special.companions.evolutions;
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
    data['evo'] = id;

    const companions = new game.knight.applications.KnightCompanionDialog({
      uuid:armor.uuid,
    }).render(true);
  }

  _std_options() {
    return [];
  }

  _autre_recuperation() {
    return [
      {
        key:'contacts',
        label:`KNIGHT.RECUPERER.Contacts`
      },
      {
        key:'chargeur',
        label:`KNIGHT.EFFETS.CHARGEUR.Restaurer`
    }]
  }

  _menu_entries() {
    const base = super._menu_entries();
    const menu = [
    {
      key:'selectWithTooltip',
      name:'style',
      path:'combat.style',
      label:'KNIGHT.COMBAT.STYLES.Label',
      tooltip:this.actor.system.combat.styleInfo,
      options:CONFIG?.KNIGHT?.LIST?.style ?? {},
    },{
      key:'inputWithSpanMax',
      name:'heroisme',
      label:`KNIGHT.LATERAL.Heroisme`,
      path:'heroisme',
    },{
      key:'onlySpanWithButtons',
      path:'egide',
      name:'egide',
      label:`KNIGHT.LATERAL.Egide`,
      btn:{
        action:'rollSuccess',
        name:game.i18n.localize("KNIGHT.JETS.JetEgide"),
        label:game.i18n.localize("KNIGHT.JETS.JetEgide"),
        value:`${this.actor.system.egide.value}D6`,
      }
    },{
      key:'inputWithSpanMaxWithButtons',
      name:'espoir',
      label:`KNIGHT.LATERAL.Espoir`,
      path:'espoir',
      btn:{
        action:'dialogRoll',
        label:game.i18n.localize("KNIGHT.JETS.JetEspoir"),
        name:game.i18n.localize("KNIGHT.JETS.JetEspoir"),
        caracteristique:'hargne',
        caracAdd:'sangFroid',
      }
    }];

    const toRevised = ['armure', 'energie'];

    toRevised.forEach(r => {
      menu.push({
        key:`${r === 'champDeForce' ? 'onlySpan' : 'inputWithSpanMax'}`,
        name:r,
        path:`equipements.${this.actor?.system?.wear ?? 'armure'}.${r}`,
        pathMax:`${r}`,
      });
    });

    menu.push({
      key:`onlySpan`,
      name:'champDeForce',
      subPath:`equipements.${this.actor?.system?.wear ?? 'armure'}.champDeForce`,
    })

    let entries = foundry.utils.mergeObject(base, this._generate_menu(menu));

    return entries;
  }

  /* -------------------------------------------- */
  _prepareTabs(group) {
    const tabs = super._prepareTabs(group);

    if (group === "primary") {
      const data = this.actor.system;
      // cacher "art" si options décochée
      if(!data.options.art) delete tabs.art;

      if(!data.dataArmor) delete tabs.armure;
      else tabs.armure.label = data.dataArmor.name;
    }

    return tabs;
  }

  async _preparePartContext(partId, context, options) {
    const system = this.actor.system;

    context = await super._preparePartContext(partId, context, options);
    context.tab = context.tabs[partId];

    switch(partId) {
      case 'menu':
        const baseSubMenu = ['bonus', 'malus'];
        const jauges = system.jauges;
        const listMenu = [
          'style', 'separateur'
        ];
        const listSubMenu = {};

        if(jauges.sante) {
          listMenu.push('sante');
          listSubMenu['sante'] = baseSubMenu;
        }

        if(jauges.egide) {
          listMenu.push('egide');
          listSubMenu['egide'] = ['base', ...baseSubMenu];
        }

        if(jauges.espoir) {
          listMenu.push('espoir');
          listSubMenu['espoir'] = baseSubMenu;
        }

        listMenu.push('heroisme');
        if(jauges.armure || jauges.energie || jauges.champDeForce) listMenu.push('separateur');

        if(jauges.armure) {
          listMenu.push('armure');
          listSubMenu['armure'] = baseSubMenu;
        }

        if(jauges.energie) {
          listMenu.push('energie');
          listSubMenu['energie'] = baseSubMenu;
        }

        if(jauges.champDeForce) {
          listMenu.push('champDeForce');
          listSubMenu['champDeForce'] = baseSubMenu;
        }

        listMenu.push('separateur', 'defense', 'reaction', 'initiative', 'separateur', 'ReductionPEs');
        listSubMenu['defense'] = baseSubMenu;
        listSubMenu['reaction'] = baseSubMenu;
        listSubMenu['initiative'] = ['dice',...baseSubMenu];

        context.menu = this._build_menu(listMenu, listSubMenu);
        break;

      case 'armure':
        context.subTab = this._subTab;
        context.enrichedIaCaractere = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.actor.system.equipements.ia.caractere, { async: true, });
        break;

      case 'personnage':
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.actor.system.description, { async: true, });
        context.enrichedDescriptionLimitee = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.actor.system.descriptionLimitee, { async: true, });
        break;

      case 'historique':
        context.enrichedHistoire = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.actor.system.histoire, { async: true, });
        break;
    }

    return await super._preparePartContext(partId, context, options);
  }

  /* -------------------------------------------- */

  _onRender(context, options) {
    super._onRender(context, options);
    const html = $(this.element)

    html.find('div.progression div.evolutionsAAcheter button').hover(ev => {
      const span = html.find('div.progression div.evolutionsAAcheter span.hideInfo');
      const target = $(ev.currentTarget);
      const width = html.find('div.progression div.evolutionsAAcheter').width() / 2;

      if(target.position().left > width) {
        span.toggleClass("right");
      } else {
        span.toggleClass("left");
      }
    });

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    /*html.find('.appliquer-evolution-armure').click(async ev => {
      const target = $(ev.currentTarget);
      const id = target.data("num");
      const dataArmor = await getArmor(this.actor);
      const listEvolutions = dataArmor.system.evolutions.liste;
      const dataEArmor = listEvolutions[id]?.data ?? {};
      const capacites = listEvolutions[id]?.capacites ?? {};
      let special = listEvolutions[id]?.special ?? {};
      const gloireListe = this.actor.system.progression.gloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
      const filter = [];

      const update = {};

      const LZString = globalThis.LZString;
      const { archivage, ...dataToSave } = dataArmor.system;
      update[`system.archivage.liste.${listEvolutions[id].value}`] = LZString.compressToUTF16(JSON.stringify(dataToSave));

      for (let [key, spec] of Object.entries(special)) {
        const hasDelete = spec?.delete || false;

        if(hasDelete !== false) {
          if(hasDelete.value === true) {

            update[`system.special.selected.-=${key}`] = null;
            filter.push(key);
            delete special[key];
          }
        }
      }

      update[`system.espoir.value`] = dataEArmor.espoir;
      update[`system.armure.base`] = dataArmor.system.armure.base+dataEArmor.armure;
      update[`system.champDeForce.base`] = dataArmor.system.champDeForce.base+dataEArmor.champDeForce;
      update[`system.energie.base`] = dataArmor.system.energie.base+dataEArmor.energie;
      update[`system.energie.value`] = dataArmor.system.espoir.value+dataEArmor.espoir;
      update[`system.capacites.selected`] = capacites;
      update[`system.special.selected`] = special;
      update[`system.evolutions.liste.${id}`] = {
        applied:true,
        addOrder:addOrder+1
      };

      for (let [key, evolutions] of Object.entries(listEvolutions)) {
        const num = +key;

        if(num > id) {
          for(let i = 0;i < filter.length;i++) {
            const hasSpecial = evolutions.special?.[filter[i]] || false;

            if(hasSpecial !== false) {
              update[`system.evolutions.liste.${num}.special.-=${filter[i]}`] = null;
            }
          }
        }
      }

      dataArmor.update(update);
    });*/

    html.find('.appliquer-evolution-companions').click(ev => {
    });

    html.find('.acheter-evolution-longbow').click(async ev => {
      const target = $(ev.currentTarget);
      const id = +target.data("id");
      const value = +target.data("value");
      const dataArmor = await getArmor(this.actor);
      const listEvolutions = dataArmor.system.evolutions.special.longbow;
      const capacites = listEvolutions[id];
      const dataGloire = this.actor.system.progression.gloire;
      const gloireActuel = +dataGloire.actuel;
      const gloireListe = dataGloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);

      if(gloireActuel >= value) {
        let array = {
          description:capacites.description,
          value:value,
          data:dataArmor.system.capacites.selected.longbow,
          addOrder:addOrder+1};

        const update = {};

        update[`system.archivage.longbow.${id}`] = array;
        update[`system.capacites.selected.longbow`] = capacites;
        update[`system.evolutions.special.longbow.${id}`] = {
          applied:true,
          addOrder:addOrder+1
        };

        delete capacites.description;

        dataArmor.update(update);

        this.actor.update({['system.progression.gloire.actuel']:gloireActuel-value});
      }
    });

    html.find('div.rollback a.retour').click(async ev => {
      const target = $(ev.currentTarget);
      const index = target.data("value");
      const type = target.data("type");
      const getDataArmor = await getArmor(this.actor);
      const dataArchives = type === 'liste' ? Object.entries(getDataArmor.system.archivage[type]) : getDataArmor.system.archivage[type];
      const getArchives = dataArchives[index];

      let update = {};
      let erase = {};

      if(type === 'liste') {
        const LZString = globalThis.LZString;
        const parse = JSON.parse(LZString.decompressFromUTF16(getArchives[1]));
        const listEvolutions = parse.evolutions.liste;

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(num >= index) {
            listEvolutions[key].applied = false;
          }
        }

        for (let [key, capacites] of Object.entries(getDataArmor.system.capacites.selected)) {
          erase[`system.capacites.selected.-=${key}`] = null;
        }

        update['system'] = parse;

        for (let [key, archive] of Object.entries(dataArchives)) {
          const num = +key;

          if(num >= index) {
            update[`system.archivage.${type}.-=${archive[0]}`] = null;
          }
        }
        await getDataArmor.update(erase)
        getDataArmor.update(update);
      } else if(type === 'longbow') {
        const listEvolutions = getDataArmor.system.evolutions.special.longbow;
        const getPG = +this.actor.system.progression.gloire.actuel;
        let gloire = 0;

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(evolutions.addOrder >= getArchives.addOrder && evolutions.addOrder !== undefined) {
            update[`system.evolutions.special.longbow.${num}.applied`] = false;
            update[`system.archivage.${type}.-=${num}`] = null;
            gloire += evolutions.value;
          }
        }

        update['system.capacites.selected.longbow'] = getArchives.data;
        getDataArmor.update(update);
        this.actor.update({["system.progression.gloire.actuel"]:gloire+getPG});
      }
    });
  }

  async _onChange(event) {
    super._onChange(event);
    const target = event.target;

    if (target.matches('div.style > select')) {
      this.actor.update({['system.combat.data']:{
        tourspasses:1,
        type:"degats"
      }});
    }
  }

  async _onItemCreate_post(create, itemData) {
    super._onItemCreate_post(create, itemData);

    if((itemData.type === 'inconvenient' || itemData.type === 'avantage') && itemData.system.type === 'ia') {
      create.update({['system.type']:'ia'});
    }
  }

  /* -------------------------------------------- */
  async _onDroppedActor(data) {
    const type = data.type;

    if(type === 'ia') {
      const update = {};

      update['system.equipements.ia.code'] = data.system.code;
      update['system.equipements.ia.surnom'] = data.name;
      update['system.equipements.ia.caractere'] = data.system.caractere;

      const itemsActuels = this.actor.items;
      for (let i of itemsActuels) {
        if(i.type === 'avantage' || i.type === 'inconvenient') {
          if(i.system.type === 'ia') {
            await i.delete();
          }
        }
      };

      const items = data.items;

      for (let i of items) {
        await i.update({['system.type']:'ia'}, { render: false });
        await this._onDropItemCreate(i);
      };

      this.actor.update(update);
    }
  }
}
