import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import HumanMixinSheet from "../bases/mixin-human-sheet.mjs";
import NPCMixinSheet from "../bases/mixin-npc-sheet.mjs";

/**
 * @extends {BaseActorSheet}
 */
export class PNJSheet extends HumanMixinSheet(NPCMixinSheet(BaseActorSheet)) {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["pnj", "sheet", "actor"],
      template: "systems/knight/templates/actors/pnj-sheet.html",
      width: 920,
      height: 780,
    });
  }

  get itemTypesValides() {
    return [...super.itemTypesValides,
      'module', 'armure','langue', 'capacite',
      'armurelegende', 'capaciteultime',
      'cyberware'];
  }
}
