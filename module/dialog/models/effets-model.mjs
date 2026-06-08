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

export default class KnightEffetsData extends foundry.abstract.DataModel {
  static get baseDefinition() {
    const carac = ['bete', 'chair', 'dame', 'machine', 'masque'].flatMap(k => CONFIG.KNIGHT.LIST.caracteristiques[k]);
    const aspects = CONFIG.KNIGHT.LIST.aspects;

    const subdmgcarac = {
      fixe:["str", { initial:"", choices:carac, blank:true  }],
      odInclusFixe:["bool", { initial:false }],
      jet:["str", { initial:"", choices:carac, blank:true  }],
      odInclusJet:["bool", { initial:false }],
    }

    const subdmgaspect = {
      fixe:["str", { initial:"", choices:aspects, blank:true  }],
      odInclusFixe:["bool", { initial:false }],
      jet:["str", { initial:"", choices:aspects, blank:true  }],
      odInclusJet:["bool", { initial:false }],
    }

    const dmg = {
      fixe:["num", { initial:0, nullable:false, integer:true }],
      jet:["num", { initial:0, nullable:false, integer:true }],
      carac:["schema", foundry.utils.deepClone(subdmgcarac)],
      aspect:["schema", foundry.utils.deepClone(subdmgaspect)],
      conditionnel:["schema", {
        has:["bool", { initial:false }],
        condition:["str", { initial:"", }]
      }],
    };

    return {
      uuid:["str", { initial:"" }],
      path:["str", { initial:"" }],
      effets:["arr", ["schema", {
        key:["str", {initial:"", nullable:true}],
        name:["str", {initial:""}],
        description:["str", {initial:""}],
        custom:["bool", {initial:""}],
        activable:["bool", {initial:false}],
        double:["bool", { initial:false }],
        value:["num", { initial:0 }],
        text:["bool", { initial:false }],
        str:['str', {initial:''}],
        cost:["num", {initial:0}],
        customData:["obj", {initial:{}}],
      }]],
      possibles:["schema", {
        key:["str", { initial:"" }],
        double:["bool", { initial:false }],
        value:["num", { initial:0 }],
        text:["bool", { initial:false }],
        str:['str', {initial:''}],
        name:["str", { initial:"" }],
        description:["str", { initial:"" }],
        max:["num", { initial:null, nullable:true }],
      }],
      activables:["schema", {
        key:["str", { initial:"" }],
        double:["bool", { initial:false }],
        value:["num", { initial:0 }],
        text:["bool", { initial:false }],
        str:['str', {initial:''}],
        name:["str", { initial:"" }],
        description:["str", { initial:"" }],
        max:["num", { initial:null, nullable:true }],
      }],
      custom:["schema", {
        edit:["num", {initial:null, nullable:true}],
        label:["str", { initial:"" }],
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

  get item() {
    return fromUuid(this.uuid);
  }

  _initialize(...args) {
    super._initialize(...args);
    this.initEffects(...args);
    this.prepareBaseData();
  }

  initEffects(effects) {
    const raw = effects?.raw ?? [];
    const custom = effects?.custom ?? [];
    const activable = effects?.activable ?? [];
    const label = getAllEffects();
    const allEffects = [];

    for(let e of raw) {
      const split = e.split(' ');
      const s0 = split[0];
      const s1 = split[1];
      const splitText = s0.split('<space>');
      const sT0 = splitText[0];
      const sT1 = splitText[1];
      let eff = {};

      eff.key = sT0;
      eff.name = game.i18n.localize(label[sT0].label);
      eff.description = game.i18n.localize(label[sT0].description);

      if(sT1) {
        eff.text = true;
        eff.str = sT1;
        eff.placeholder = label[sT0]?.placeholder ?? '';
      }

      if(s1) {
        eff.double = true;
        eff.value = s1;
      }

      allEffects.push(eff);
    }

    for(let e of custom) {
      let eff = {};
      eff.custom = true;
      eff.customData = e;
      console.error(e);
      allEffects.push(eff);
    }

    for(let e of activable) {
      const split = e.key.split(' ');
      const s0 = split[0];
      const s1 = split[1];

      let eff = {};
      eff.activable = true;
      eff.key = s0;
      eff.name = game.i18n.localize(label[s0].label);
      eff.cost = e.cost;
      eff.description = game.i18n.localize(label[s0].description);

      if(s1) {
        eff.double = true;
        eff.value = s1;
      }
      allEffects.push(eff);
    }

    allEffects.sort(_sortByName);

    foundry.utils.setProperty(this, 'effets', allEffects);
  }

  async prepareBaseData() {
    const item = await this.item;
    const path = this.path;
    let pe;

    if(path.includes('distance')) {
      const distance = CONFIG.KNIGHT.AMELIORATIONS.distance;
      pe = distance;
    }
    else if(path.includes('structurelles')) {
      const structurelles = CONFIG.KNIGHT.AMELIORATIONS.structurelles;
      pe = structurelles;
    }
    else if(path.includes('ornementales')) {
      const ornements = CONFIG.KNIGHT.AMELIORATIONS.ornementales;
      pe = ornements;
    }
    else {
      const effets = CONFIG.KNIGHT.effets;
      const effetsfm4 = CONFIG.KNIGHT.effetsfm4;
      const effetsadl = CONFIG.KNIGHT.effetsadl;
      pe = foundry.utils.mergeObject({}, effets);
      pe = foundry.utils.mergeObject(pe, effetsadl);
      pe = foundry.utils.mergeObject(pe, effetsfm4);
    }

    this.applyEffects(item, pe);
  }

  applyEffects(item, effects) {
    const possibles = getAllEffects();
    const list = [];
    const activable = [];
    const exist = this.effets;
    let pe = effects;

    for (let [key, effet] of Object.entries(pe)){
      if(exist.find(itm => itm.key === key)) continue;

      list.push({
        key:key,
        double:effet.double,
        text:effet.text,
        placeholder:game.i18n.localize(effet.placeholder),
        name:game.i18n.localize(effet.label),
        description:game.i18n.localize(possibles[key].description),
        max:effet.max,
        value:0,
      });

      if(effet.activable) {
        activable.push({
          key:key,
          double:effet.double,
          text:effet.text,
          placeholder:game.i18n.localize(effet.placeholder),
          name:game.i18n.localize(effet.label),
          description:game.i18n.localize(possibles[key].description),
          max:effet.max,
          value:0,
        })
      }
    }

    function _sortByName(x, y) {
      return x.name.localeCompare(y.name, 'fr', {
        sensitivity: 'base'
      });
    }

    Object.defineProperty(this, 'possibles', {
      value: list.sort(_sortByName),
      writable:true,
      enumerable:true,
      configurable:true
    });

    Object.defineProperty(this, 'activables', {
      value: activable.sort(_sortByName),
      writable:true,
      enumerable:true,
      configurable:true
    });
  }

  async update(formData) {
    for(let f in formData) {
      foundry.utils.setProperty(this, f, formData[f]);
    }
  }
}