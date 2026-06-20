
import { fields } from '../../utils/field-builder.mjs';

export default class KnightCompanionData extends foundry.abstract.DataModel {
  static get baseDefinition() {
    const aspects = CONFIG.KNIGHT.LIST.aspects;
    const listAspects = {};

    for(const a of aspects) {
        listAspects[a] = ["schema", {
            value:["num", { initial:0, nullable:false, integer:true }],
            ae:["num", { initial:0, nullable:false, integer:true }],
        }];
    }

    return {
        uuid:["str", {initial:"", nullable:false }],
        evolutions:["num", { initial:1, nullable:false, integer:true }],
        active:["str", {initial:"", blank:true, choices:{
            lion:"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label",
            wolf:"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label",
            crow:"KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label",
        }}],
        lion:["schema", {
            points:["schema", {
                aspects:["num", { initial:5, nullable:false, integer:true }],
                ae:["num", { initial:2, nullable:false, integer:true }],
            }],
            aspects:foundry.utils.deepClone(listAspects),
        }],
        wolf:["schema", {
            points:["schema", {
                aspects:["num", { initial:3, nullable:false, integer:true }],
                ae:["num", { initial:1, nullable:false, integer:true }],
                configuration:["num", { initial:2, nullable:false, integer:true }],
            }],
            aspects:foundry.utils.deepClone(listAspects),
            configurations:["schema", {
                labor:["num", { initial:0, nullable:false, integer:true }],
                tech:["num", { initial:0, nullable:false, integer:true }],
                recon:["num", { initial:0, nullable:false, integer:true }],
                medic:["num", { initial:0, nullable:false, integer:true }],
                fighter:["num", { initial:0, nullable:false, integer:true }],
            }]
        }],
        crow:["schema", {
            points:["schema", {
                aspects:["num", { initial:2, nullable:false, integer:true }],
                ae:["num", { initial:0, nullable:false, integer:true }],
            }],
            aspects:foundry.utils.deepClone(listAspects),
        }],
    }
  }

  static defineSchema() {
    return fields(this.baseDefinition);
  }

  get actor() {
    return fromUuid(this.uuid);
  }

  async update(formData) {
    for(let f in formData) {
      foundry.utils.setProperty(this, f, formData[f]);
    }
  }
}