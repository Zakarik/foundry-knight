/**
 * @extends {ItemSheet}
 */
export class EffetSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "effet"],
      template: "systems/knight/templates/items/effet-sheet.html",
      width: 700,
      height: 400,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    
    const toUpdate = ['attaque', 'degats', 'violence'];

    const aspects = CONFIG.KNIGHT.listCaracteristiques;
    context.data.system.aspects = aspects;

    for(let i = 0; i < toUpdate.length;i++) {
      const system = context.data.system[toUpdate[i]];
      const caracODFixe = system.carac.odInclusFixe;
      const caracODJet = system.carac.odInclusJet;
      const aeODFixe = system.aspect.aeInclusFixe;
      const aeODJet = system.aspect.aeInclusJet;
      const conditionnel = system.conditionnel.has;
      
      if(caracODFixe) context.data.system[toUpdate[i]].carac.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.OdInclusFixe");
      else context.data.system[toUpdate[i]].carac.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusFixe");

      if(caracODJet) context.data.system[toUpdate[i]].carac.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.OdInclusJet");
      else context.data.system[toUpdate[i]].carac.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoOdInclusJet");
      
      if(aeODFixe) context.data.system[toUpdate[i]].aspect.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.AeInclusFixe");
      else context.data.system[toUpdate[i]].aspect.labelFixe = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusFixe");

      if(aeODJet) context.data.system[toUpdate[i]].aspect.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.AeInclusJet");
      else context.data.system[toUpdate[i]].aspect.labelJet = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.NoAeInclusJet");

      if(conditionnel) context.data.system[toUpdate[i]].conditionnel.label = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Condition");
      else context.data.system[toUpdate[i]].conditionnel.label = game.i18n.localize("KNIGHT.EFFETS.CUSTOM.Nocondition");
    }

    context.systemData = context.data.system;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.effetCustom button.unselected').click(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const getData = this.getData();
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const data = getData.data.system[type];

      const update = {};

      if(subtype === 'conditionnel') {
        update[`system.${type}.${subtype}.has`] = true;
      } else if(subtype === 'odInclusJet' && data.carac.jet !== '') {
        update[`system.${type}.carac.${subtype}`] = true;
      } else if(subtype === 'odInclusFixe' && data.carac.fixe !== '') {
        update[`system.${type}.carac.${subtype}`] = true;
      } else if(subtype === 'aeInclusJet' && data.aspect.jet !== '') {
        update[`system.${type}.carac.${subtype}`] = true;
      } else if(subtype === 'aeInclusFixe' && data.aspect.fixe !== '') {
        update[`system.${type}.carac.${subtype}`] = true;
      }

      this.item.update(update);
    });

    html.find('.effetCustom button.selected').click(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const getData = this.getData();
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const data = getData.data.system[type];

      const update = {};

      if(subtype === 'conditionnel') {
        update[`system.${type}.${subtype}.has`] = false;
      } else if(subtype === 'odInclusJet' && data.carac.jet !== '') {
        update[`system.${type}.carac.${subtype}`] = false;
      } else if(subtype === 'odInclusFixe' && data.carac.fixe !== '') {
        update[`system.${type}.carac.${subtype}`] = false;
      } else if(subtype === 'aeInclusJet' && data.aspect.jet !== '') {
        update[`system.${type}.carac.${subtype}`] = false;
      } else if(subtype === 'aeInclusFixe' && data.aspect.fixe !== '') {
        update[`system.${type}.carac.${subtype}`] = false;
      }

      this.item.update(update);
    });
  }
}
