import { BaseItemDataModel } from "../base/base-item-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class BlessureDataModel extends BaseItemDataModel {
  // Pour Héritage
  // Extension : on ajoute/modifie
  static get baseDefinition() {
    const base = super.baseDefinition;
    let data = {};

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
      let caracteristiques = {};

      for(let c of CONFIG.KNIGHT.LIST.caracteristiques[a]) {
        caracteristiques[c] = ["schema", {
          value:["num", {initial:0, nullable:false, integer:true}],
        }];
      }

      data[a] = ["schema", {
        value:["num", {initial:0, nullable:false, integer:true}],
        caracteristiques:["schema", caracteristiques],
      }];
    }

    const specific = {
      cyberware:["str", { initial: "", nullable:true}],
      soigne:["schema", {
          implant:["bool", { initial: false}],
          reconstruction:["bool", { initial: false}],
      }],
      aspects:["schema", data],
    }

    return combine(base, specific);
  }

	/*static defineSchema() {
		const {NumberField, SchemaField, StringField, BooleanField} = foundry.data.fields;
    const base = super.defineSchema();

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

    const specific = {
      cyberware:new StringField({initial:""}),
      soigne:new SchemaField({
          implant:new BooleanField({initial:false}),
          reconstruction:new BooleanField({initial:false}),
      }),
      aspects:new SchemaField(data),
    }

    return foundry.utils.mergeObject(base, specific);
  }*/

  prepareBaseData() {}

	prepareDerivedData() {}

  async removeCyberware() {
    const item = this.item;

    if(this.cyberware) {
      const cyberware = this.actor.items.get(this.cyberware);

      cyberware.update({['system.soin.blessuresSoignees']:''});
      item.update({['system.cyberware']:''});
    }
  }
}