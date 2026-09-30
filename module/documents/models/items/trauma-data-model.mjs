import ItemSpecialEffectsPathMixinModel from "../base/mixin-item-specialEffects-path-model.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import BaseItemDataModel from "../base/base-item-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class TraumaDataModel extends ItemSpecialEffectsPathMixinModel(ItemSpecialEffectsInternalMixinModel(BaseItemDataModel)) {
  static get baseDefinition() {
    const base = super.baseDefinition;
    let data = {};

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
      let caracteristiques = {};

      for(let c of CONFIG.KNIGHT.LIST.caracteristiques[a]) {
        caracteristiques[c] = ['schema', {
          value:['num', {initial: 0, integer: true, nullable: false}]
        }]
      }
      data[a] = ['schema', {
        value:['num', {initial: 0, integer: true, nullable: false}],
        caracteristiques:['schema', caracteristiques],
      }];
    }

    const specific = {
      gainEspoir:['schema', {
        value:['num', {initial:0, nullable:false, integer:true}],
        applique:['bool', {initial:false}],
      }],
      aspects:['schema', data],
    }

    return combine(base, specific);
  }

  get listEffect() {
    return this.effects.list;
  }

  get hasEffects() {
    return true;
  }
	/*static defineSchema() {
		const {HTMLField, NumberField, SchemaField, StringField, ArrayField, ObjectField, BooleanField} = foundry.data.fields;
        let data = {};

        for(let a of CONFIG.KNIGHT.LIST.aspects) {
            let caracteristiques = {};

            for(let c of CONFIG.KNIGHT.LIST.caracteristiques[a]) {
              caracteristiques[c] = new SchemaField({
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
              });
            }

            data[a] = new SchemaField({
              value:new NumberField({ initial: 0, integer: true, nullable: false }),
              caracteristiques:new SchemaField(caracteristiques),
            });
          }

        return {
            description:new HTMLField({initial:''}),
            gainEspoir:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                applique:new BooleanField({initial:false}),
            }),
            aspects:new SchemaField(data),
        }
    }

  prepareBaseData() {

	}

	prepareDerivedData() {

    }*/
}