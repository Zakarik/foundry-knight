
import BaseActorSheet from "../bases/base-actor-sheet.mjs";

/**
 * @extends {BaseActorSheet}
 */
export class IASheet extends BaseActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ia", "sheet", "actor"],
      template: "systems/knight/templates/actors/ia-sheet.html",
      width: 920,
      height: 600,
    });
  }

  get itemTypesValides() {
    return [
      'avantage', 'inconvenient'];
  }
}
