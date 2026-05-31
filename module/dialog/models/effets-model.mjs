import { fields } from '../../utils/field-builder.mjs';

export default class KnightEffetsData extends foundry.abstract.DataModel {
  static get baseDefinition() {
    const carac = ['bete', 'chair', 'dame', 'machine', 'masque'].flatMap(k => CONFIG.KNIGHT.LIST.caracteristiques[k]);
    const aspects = CONFIG.KNIGHT.LIST.aspects;

    const subdmg = {
      fixe:["str", { initial:"", }],
      odInclusFixe:["bool", { initial:false }],
      jet:["str", { initial:"", }],
      odInclusJet:["bool", { initial:false }],
    }
    const dmg = {
      fixe:["num", { initial:0, nullable:false, integer:true }],
      jet:["num", { initial:0, nullable:false, integer:true }],
      carac:["schema", foundry.utils.deepClone(subdmg)],
      aspect:["schema", foundry.utils.deepClone(subdmg)],
      conditionnel:["schema", {
        has:["bool", { initial:false }],
        condition:["str", { initial:"", }]
      }],
    };

    return {
      uuid:["str", { initial:"" }],
      effets:["arr", ["schema", {
        id:["str", {initial:""}],
        name:["str", {initial:""}],
        description:["str", {initial:""}],
        custom:["str", {initial:""}],
        activable:["bool", {initial:false}],
        cost:["num", {initial:0}],
      }]],
      custom:["schema", {
        nom:["str", { initial:"" }],
        description:["html", { initial:"" }],
        attaque:["schema", {
          reussite:["num", { initial:0, nullable:false, integer:true }],
          jet:["num", { initial:0, nullable:false, integer:true }],
          carac:["schema", {
            fixe:["str", { initial:"", choices:carac, blank:true }],
            odInclusFixe:["bool", { initial:false }],
            jet:["str", { initial:"", choices:carac, blank:true }],
            odInclusJet:["bool", { initial:false }]
          }],
          aspect:["schema", {
            fixe:["str", { initial:"", choices:aspects, blank:true }],
            aeInclusFixe:["bool", { initial:false }],
            jet:["str", { initial:"", choices:aspects, blank:true }],
            aeInclusJet:["bool", { initial:false }]
          }],
          conditionnel:["schema", {
            has:["bool", { initial:false }],
            condition:["str", { initial:"" }],
          }]
        }],
        degats:["schema", foundry.utils.deepClone(dmg)],
        violence:["schema", foundry.utils.deepClone(dmg)],
        other:["schema", {
          cdf:["num", { initial:0, nullable:false, integer:true }],
        }],
      }],
    };
  }

  static defineSchema() {
    return fields(this.baseDefinition);
  }

  get actor() {
    return this.item.actor;
  }
}