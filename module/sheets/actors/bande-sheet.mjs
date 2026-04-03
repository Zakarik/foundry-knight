import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import NPCMixinSheet from "../bases/mixin-npc-sheet.mjs";
/**
 * @extends {BaseActorSheet}
 */
export class BandeSheet extends NPCMixinSheet(BaseActorSheet) {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["bande", "sheet", "actor"],
      template: "systems/knight/templates/actors/bande-sheet.html",
      width: 920,
      height: 780,
    });
  }

  get itemTypesValides() {
    return ['langue', 'capacite'];
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.jetDebordement').click(async ev => {
      this.actor.system.doDebordement();
    });
  }
}
