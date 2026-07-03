import { fields } from '../../utils/field-builder.mjs';
import {
    getAllEffects,
} from "../../helpers/common.mjs";

function _sortByName(x, y) {
  const xName = x.custom ? x.customData.label : x.name;
  const yName = y.custom ? y.customData.label : y.name;

  return xName.localeCompare(yName, 'fr', {
    sensitivity: 'base'
  });
}

export default class KnightRollData extends foundry.abstract.DataModel {
  static get baseDefinition() {

    /*return {
      uuid:'',
      whoActivate:data?.whoActivate ?? 'none',
      roll:{
          html:undefined,
          id:actor,
          label:data?.label ?? '',
          base:data?.base ?? '',
          whatRoll:data?.whatRoll ?? [],
          difficulte:data?.difficulte ?? 0,
          succesBonus:data?.succesbonus ?? 0,
          modificateur:data?.modificateur ?? 0,
          wpnSelected:data?.wpn ?? '',
          wpnSecond:'',
          typeWpn:{
              contact:[],
              distance:[],
              complexe:[],
              grenade:[],
              tourelle:[],
              aicontact:[],
              aidistance:[],
          },
          allWpn:[],
          allVariableWpn:[],
          btn:data?.btn ?? {},
          scoredice:data?.scoredice ?? {},
          style:{
              pilonnage:{
                  type:'degats',
                  value:0,
              },
              precis:{
                  type:'',
              },
              puissant:{
                  type:'degats',
                  value:0,
              },
              suppression:{
                  type:'degats',
                  value:0,
              }
          },
          totem:{},
          totemL:{},
      },
      buttons:{},
    };*/
    return {
      uuid:["str", { initial:"",}],
      whoActivate:["str", { initial:"none",}],
      roll:["schema", {
          html:["str", { initial:null, nullable:true}],
          label:["str", { initial:""}],
          base:["str", { initial:""}],
          whatRoll:["arr", ["str", {initial:""}]],
          difficulte:["num", { initial:0}],
          succesBonus:["num", { initial:0}],
          modificateur:["num", { initial:0}],
          wpnSelected:["str", { initial:""}],
          wpnSecond:["str", { initial:""}],
          typeWpn:["schema", {
              contact:["arr", ["obj", {initial:{}}]],
              distance:["arr", ["obj", {initial:{}}]],
              complexe:["arr", ["obj", {initial:{}}]],
              grenade:["arr", ["obj", {initial:{}}]],
              tourelle:["arr", ["obj", {initial:{}}]],
              aicontact:["arr", ["obj", {initial:{}}]],
              aidistance:["arr", ["obj", {initial:{}}]],
          }],
          allWpn:["arr", ["obj", {initial:{}}]],
          allVariableWpn:["arr", ["obj", {initial:{}}]],
          btn:["obj", {initial:{}}],
          scoredice:["obj", {initial:{}}],
          style:["schema", {
              pilonnage:["schema", {
                  type:["str", { initial:"degats"}],
                  value:["num", { initial:0}],
              }],
              precis:{
                  type:["str", { initial:""}],
              },
              puissant:{
                  type:["str", { initial:"degats"}],
                  value:["num", { initial:0}],
              },
              suppression:{
                  type:["str", { initial:"degats"}],
                  value:["num", { initial:0}],
              }
          }],
          totem:["obj", {initial:{}}],
          totemL:["obj", {initial:{}}],
      }],
    };
  }

  static defineSchema() {
    return fields(this.baseDefinition);
  }

  get actor() {
    return fromUuid(this.uuid);
  }

  _initialize(...args) {
    super._initialize(...args);
  }

  async update(formData) {
    for(let f in formData) {
      foundry.utils.setProperty(this, f, formData[f]);
    }
  }
}