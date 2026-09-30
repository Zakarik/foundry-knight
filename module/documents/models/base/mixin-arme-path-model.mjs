import { combine } from '../../../utils/field-builder.mjs';
import PatchBuilder from "../../../utils/patchBuilder.mjs";
import {
  getAllEffects,
} from "../../../helpers/common.mjs";

const ArmePathMixinModel = (superclass) => class extends superclass {
    // Pour Héritage
    // Extension : on ajoute/modifie
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
            addOrder:["num", {initial:0, nullable:false, integer:true}],
            gratuit:["bool", { initial: false}],
        };

        return combine(base, specific);
    }
}

export default ArmePathMixinModel;