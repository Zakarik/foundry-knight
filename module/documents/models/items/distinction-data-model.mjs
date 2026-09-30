import ItemSpecialEffectsPathMixinModel from "../base/mixin-item-specialEffects-path-model.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import BaseItemDataModel from "../base/base-item-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class DistinctionDataModel extends ItemSpecialEffectsPathMixinModel(ItemSpecialEffectsInternalMixinModel(BaseItemDataModel)) {
    static get baseDefinition() {
        const base = super.baseDefinition;

        const specific = {
            espoir:["num", { initial: 0, integer: true, nullable: false }],
            egide:["num", { initial: 0, integer: true, nullable: false }],
        }

        return combine(base, specific);
    }

    get listEffect() {
        return this.effects.list;
    }

    get hasEffects() {
        return true;
    }
}