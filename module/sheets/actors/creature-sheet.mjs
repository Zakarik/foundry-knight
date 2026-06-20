import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import NPCMixinSheet from "../bases/mixin-npc-sheet.mjs";
/**
 * @extends {BaseActorSheet}
 */
export class CreatureSheet extends NPCMixinSheet(BaseActorSheet) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["creature"],
    position: { width: 1020, height: 790 },
  }

  /** @inheritdoc */
  static PARTS = {
    upperheader: { template: "systems/knight/templates/actors/parts/common/sections/upperheader.hbs" },
    header: { template: "systems/knight/templates/actors/parts/creature/sections/header.hbs" },
    menu: { template: "systems/knight/templates/actors/parts/common/sections/menu.hbs" },
    nav: { template: "templates/generic/tab-navigation.hbs" },
    personnage: {
      template: "systems/knight/templates/actors/parts/npc/tabs/personnage.hbs",
      classes:['tab', 'personnage'],
    },
    aspects: {
      template: "systems/knight/templates/actors/parts/npc/tabs/aspects.hbs",
      classes:['tab', 'aspects'],
    },
    capacites: {
      template: "systems/knight/templates/actors/parts/npc/tabs/capacites.hbs",
      classes:['tab', 'capacites'],
    },
    combat: {
      template: "systems/knight/templates/actors/parts/creature/tabs/combat.hbs",
      classes:['tab', 'combat'],
    },
    historique: {
      template: "systems/knight/templates/actors/parts/npc/tabs/historique.hbs",
      classes:['tab', 'historique'],
    },
    autre: {
      template: "systems/knight/templates/actors/parts/npc/tabs/autre.hbs",
      classes:['tab', 'autre'],
    },
  }

  /** @inheritdoc */
  static TABS = {
    primary:{
      tabs:[
        { id:'personnage', label:'KNIGHT.PERSONNAGE.Label' },
        { id:'aspects', label:'KNIGHT.ASPECTS.Aspects' },
        { id:'capacites', label:'KNIGHT.CAPACITES.Label' },
        { id:'combat', label:'KNIGHT.COMBAT.Label' },
        { id:'historique', label:'KNIGHT.HISTORIQUE.Label' },
        { id:'autre', label:'KNIGHT.AUTRE.Label' },
      ],
      initial:'personnage',
    },
  }

  get itemTypesValides() {
    return [...super.itemTypesValides,
      'capacite', 'langue'];
  }

  /* -------------------------------------------- */

  _menu_entries() {
    const base = super._menu_entries();

    const menu = [
      {
        key: 'inputWithSpanMax',
        name: 'sante',
        label: 'KNIGHT.LATERAL.Sante',
        path: 'sante',
      },
      {
        key: 'doubleInput',
        name: 'resilience',
        label: 'KNIGHT.LATERAL.Resilience',
        path: 'resilience',
        btn:{
          action:'setResilience',
          label:'KNIGHT.RESILIENCE.CalculResilience',
        }
      },
      {
        key: 'onlySpan',
        name: 'bouclier',
        label: 'KNIGHT.LATERAL.Bouclier',
        path: 'bouclier',
      },
    ];

    const entries = {
      ...base,
      ...this._generate_menu(menu),
    }

    return entries;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    const system = this.actor.system;

    context = await super._preparePartContext(partId, context, options);
    context.tab = context.tabs[partId];

    switch(partId) {
      case 'menu': {
        const baseSubMenu = ['base', 'bonus', 'malus'];
        const opt = system.options;
        const listMenu = [];
        const listSubMenu = {};

        if(opt.sante) {
          listMenu.push('sante');
          listSubMenu['sante'] = baseSubMenu;
        }

        if(opt.resilience) listMenu.push('resilience');

        if(opt.sante || opt.resilience) listMenu.push('separateur');

        if(opt.armure) {
          listMenu.push('armure');
          listSubMenu['armure'] = baseSubMenu;
        }

        if(opt.energie) {
          listMenu.push('energie');
          listSubMenu['energie'] = baseSubMenu;
        }

        if(opt.bouclier) {
          listMenu.push('bouclier');
          listSubMenu['bouclier'] = baseSubMenu;
        }

        if(opt.armure || opt.energie || opt.bouclier) listMenu.push('separateur');

        listMenu.push('reaction', 'defense', 'initiative');
        listSubMenu['reaction'] = baseSubMenu;
        listSubMenu['defense'] = baseSubMenu;
        listSubMenu['initiative'] = ['dice', 'bonus', 'malus'];

        context.menu = this._build_menu(listMenu, listSubMenu);
        break;
      }

      case 'personnage':
        context.enrichedTactique = await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.tactique, { async: true, });
        context.enrichedPointsFaibles = await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.pointsFaibles, { async: true, });
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.description, { async: true, });
        context.enrichedDescriptionLimitee = await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.descriptionLimitee, { async: true, });
        break;

      case 'historique':
        context.enrichedHistoire = await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.histoire, { async: true, });
        break;
    }

    return context;
  }
}
