import BaseActorSheet from "../bases/actors/base-actor-sheet.mjs";
import HumanMixinSheet from "../bases/actors/mixin-human-sheet.mjs";
import NPCMixinSheet from "../bases/actors/mixin-npc-sheet.mjs";

/**
 * @extends {BaseActorSheet}
 */
export class PNJSheet extends HumanMixinSheet(NPCMixinSheet(BaseActorSheet)) {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["pnj"],
    position: { width: 1020, height: 780 },
  }

  static PARTS = {
    upperheader: { template: "systems/knight/templates/actors/parts/common/sections/upperheader.hbs" },
    header: { template: "systems/knight/templates/actors/parts/npc/sections/header.hbs" },
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
    art: {
      template: "systems/knight/templates/actors/parts/human/tabs/art.hbs",
      classes:['tab', 'art'],
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

  static TABS = {
    primary:{
      tabs:[
        { id:'personnage', label:'KNIGHT.PERSONNAGE.Label' },
        { id:'aspects', label:'KNIGHT.ASPECTS.Aspect' },
        { id:'art', label:'KNIGHT.ART.Label' },
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
      'module', 'armure','langue', 'capacite',
      'armurelegende', 'capaciteultime',
      'cyberware'];
  }

  _autre_recuperation() {
    return [
      {
        key:'chargeur',
        label:`KNIGHT.EFFETS.CHARGEUR.Restaurer`
    }]
  }

  _menu_entries() {
    const base = super._menu_entries();
    const menu = [{
      key:'doubleInput',
      name:'resilience',
      label:'KNIGHT.LATERAL.Resilience',
      path:'resilience',
    },{
      key:'onlySpan',
      name:'bouclier',
      label:'KNIGHT.LATERAL.Bouclier',
      path:'bouclier',
    },{
      key:'simpleInput',
      name:'ReductionPEs',
      label:'KNIGHT.LATERAL.ReductionPEs',
      path:'espoir.reduction',
    }];

    const entries = {
      ...base,
      ...this._generate_menu(menu),
    }

    return entries;
  }

  /* -------------------------------------------- */
  _prepareTabs(group) {
    const tabs = super._prepareTabs(group);

    if (group === "primary") {
      const data = this.actor.system;

      // L'onglet art n'est affiché que si l'option correspondante est active.
      if(!data.options.art) delete tabs.art;
    }

    return tabs;
  }

  /* -------------------------------------------- */
  async _preparePartContext(partId, context, options) {
    const system = this.actor.system;
    const enrich = foundry.applications.ux.TextEditor.implementation;

    context = await super._preparePartContext(partId, context, options);
    context.tab = context.tabs[partId];

    switch(partId) {
      case 'menu':
        const opt = system.options;
        const baseSubMenu = ['base', 'bonus', 'malus'];
        const listMenu = [];
        const listSubMenu = {};

        if(opt.resilience) listMenu.push('resilience');

        if(opt.sante) {
          listMenu.push('sante');
          listSubMenu['sante'] = baseSubMenu;
        }

        if(opt.espoir) listMenu.push('espoir');

        if(listMenu.length !== 0) listMenu.push('separateur');

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

        if(opt.champDeForce) {
          listMenu.push('champDeForce');
          listSubMenu['champDeForce'] = baseSubMenu;
        }

        if(listMenu.length !== 0) listMenu.push('separateur');

        listMenu.push('reaction', 'defense', 'initiative');
        listSubMenu['reaction'] = baseSubMenu;
        listSubMenu['defense'] = baseSubMenu;
        listSubMenu['initiative'] = ['dice', 'bonus', 'malus'];

        if(opt.espoir) listMenu.push('separateur', 'ReductionPEs');

        context.menu = this._build_menu(listMenu, listSubMenu);
        break;

      case 'personnage':
        context.enrichedTactique = await enrich.enrichHTML(system.tactique, { async: true });
        context.enrichedPointsFaibles = await enrich.enrichHTML(system.pointsFaibles, { async: true });
        context.enrichedDescription = await enrich.enrichHTML(system.description, { async: true });
        context.enrichedDescriptionLimitee = await enrich.enrichHTML(system.descriptionLimitee, { async: true });
        break;

      case 'historique':
        context.enrichedHistoire = await enrich.enrichHTML(system.histoire, { async: true });
        break;
    }

    return context;
  }
}
