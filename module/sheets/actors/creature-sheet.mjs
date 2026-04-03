import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import NPCMixinSheet from "../bases/mixin-npc-sheet.mjs";
/**
 * @extends {BaseActorSheet}
 */
export class CreatureSheet extends NPCMixinSheet(BaseActorSheet) {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["creature", "sheet", "actor"],
      template: "systems/knight/templates/actors/creature-sheet.html",
      width: 920,
      height: 790,
    });
  }

  get itemTypesValides() {
    return [...super.itemTypesValides,
      'capacite', 'langue'];
  }
}
