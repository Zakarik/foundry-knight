
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';

export function defineCombatField(PJ=false) {
    const { EmbeddedDataField, StringField } = foundry.data.fields;
    let base = {
        grenades:new EmbeddedDataField(GrenadesDataModel),
        nods:new EmbeddedDataField(NodsDataModel),
    }

    let specific = {}

    if(PJ) {
        foundry.utils.mergeObject(specific, {
            style:new StringField({initial:"standard", nullable:false}),
            styleInfo:new StringField({initial:""}),
        })
    }

    const result = {
        ...base,
        ...specific,
    }

    return result;
}