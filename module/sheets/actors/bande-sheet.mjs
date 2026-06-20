
import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import NPCMixinSheet from "../bases/mixin-npc-sheet.mjs";
import BandeMixinSheet from "../bases/mixin-bande-sheet.mjs";

/**
 * Fiche de Bande — AppV2.
 * @extends {BaseActorSheet}
 */
export class BandeSheet extends BandeMixinSheet(NPCMixinSheet(BaseActorSheet)) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["bande"],
    position: { width: 920, height: 780 },
  }

  static PARTS = {
    upperheader: { template: "systems/knight/templates/actors/parts/common/sections/upperheader.hbs" },
    header: { template: "systems/knight/templates/actors/parts/band/sections/header.hbs" },
    menu: { template: "systems/knight/templates/actors/parts/common/sections/menu.hbs" },
    nav: { template: "templates/generic/tab-navigation.hbs" },
    personnage: {
      template: "systems/knight/templates/actors/parts/npc/tabs/personnage.hbs",
      classes: ['tab', 'personnage'],
    },
    aspects: {
      template: "systems/knight/templates/actors/parts/npc/tabs/aspects.hbs",
      classes: ['tab', 'aspects'],
    },
    capacites: {
      template: "systems/knight/templates/actors/parts/npc/tabs/capacites.hbs",
      classes: ['tab', 'capacites'],
    },
    historique: {
      template: "systems/knight/templates/actors/parts/npc/tabs/historique.hbs",
      classes: ['tab', 'historique'],
    },
    autre: {
      template: "systems/knight/templates/actors/parts/band/tabs/autre.hbs",
      classes: ['tab', 'autre'],
    },
  }

  static TABS = {
    primary: {
      tabs: [
        { id: 'personnage', label: 'KNIGHT.PERSONNAGE.Label' },
        { id: 'aspects', label: 'KNIGHT.ASPECTS.Aspect' },
        { id: 'capacites', label: 'KNIGHT.CAPACITES.Label' },
        { id: 'historique', label: 'KNIGHT.HISTORIQUE.Label' },
        { id: 'autre', label: 'KNIGHT.AUTRE.Label' },
      ],
      initial: 'personnage',
    },
  }

  get itemTypesValides() {
    return ['langue', 'capacite'];
  }

  /* -------------------------------------------- */
  _std_options() {
    return ['energie', 'bouclier', 'champDeForce', 'resilience', 'espoir', 'modules', 'phase2'];
  }

  _menu_entries() {
    const base = super._menu_entries();

    const menu = [
      {
        key: 'inputWithSpanMax',
        name: 'sante',
        label: 'KNIGHT.LATERAL.Cohesion',
        path: 'sante',
      },
      {
        key: 'doubleInput',
        name: 'resilience',
        label: 'KNIGHT.LATERAL.Resilience',
        path: 'resilience',
      },
      {
        key: 'onlyInput',
        name: 'debordement',
        label: 'KNIGHT.AUTRE.Debordement',
        path: 'debordement.value',
      },
      {
        key: 'onlyInputWithButtons',
        name: 'tour',
        label: 'KNIGHT.AUTRE.Tour',
        path: 'debordement.tour',
        btn: {
          action: 'debordement',
          label: 'KNIGHT.AUTRE.Debordement',
        },
      },
      {
        key: 'onlySpan',
        name: 'bouclier',
        label: 'KNIGHT.LATERAL.Bouclier',
        path: 'bouclier',
      },
      {
        key: 'onlySpan',
        name: 'champDeForce',
        label: 'KNIGHT.LATERAL.ChampDeForce-short',
        path: 'champDeForce',
      },
    ];

    let entries = foundry.utils.mergeObject(base, this._generate_menu(menu));

    return entries;
  }

  /* -------------------------------------------- */
  async _preparePartContext(partId, context, options) {
    const system = this.actor.system;

    context = await super._preparePartContext(partId, context, options);
    context.tab = context.tabs[partId];

    switch(partId) {
      case 'menu':
        const baseSubMenu = ['base', 'bonus', 'malus'];
        const opt = system.options;
        const listMenu = [];
        const listSubMenu = {};

        if(opt.sante) {
          listMenu.push('sante');
          listSubMenu['sante'] = baseSubMenu;
        }

        if(opt.resilience) listMenu.push('resilience');

        listMenu.push('debordement');
        listMenu.push('tour');

        if(opt.bouclier) {
          listMenu.push('bouclier');
          listSubMenu['bouclier'] = baseSubMenu;
        }

        if(opt.champDeForce) {
          listMenu.push('champDeForce');
          listSubMenu['champDeForce'] = baseSubMenu;
        }

        if(opt.energie) listMenu.push('energie');

        listMenu.push('separateur', 'reaction', 'defense', 'initiative');
        listSubMenu['reaction'] = baseSubMenu;
        listSubMenu['defense'] = baseSubMenu;
        listSubMenu['initiative'] = ['dice', 'bonus', 'malus'];

        console.error(listMenu);

        context.menu = this._build_menu(listMenu, listSubMenu);
        break;

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
