import {
  convertJsonEffects,
} from "../../../helpers/common.mjs";

import PatchBuilder from "../../../utils/patchBuilder.mjs";
import { BaseArmeDataModel } from "../base/base-arme-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class ArmeDataModel extends BaseArmeDataModel {
  // Pour Héritage
  // Extension : on ajoute/modifie
  static get baseDefinition() {
    const base = super.baseDefinition;
    const specific = {
      whoActivate: ["str", { initial: "", nullable:true}],
      chassis:["str", { initial: "", nullable:false}],
      equipped:["bool", { initial: false}],
      rack:["bool", { initial: false}],
      rarete: ["str", { initial: "standard", nullable:false}],
      type: ["str", { initial: "contact", nullable:false}],
      portee: ["str", { initial: "contact", nullable:false}],
      prix: ["num", {initial:0, nullable:false, integer:true}],
      energie: ["num", {initial:0, nullable:false, integer:true}],
      listes: ["schema", {}],
      gratuit: ["bool", { initial: false}],
      options2mains: ["schema", {
        has: ["bool", { initial: false}],
        actuel: ["str", { initial: "1main", nullable:false}],
        '1main': ["schema", {
          degats: ["schema", {
            dice: ["num", {initial:0, nullable:false, integer:true}],
            fixe: ["num", {initial:0, nullable:false, integer:true}],
          }],
          violence: ["schema", {
            dice: ["num", {initial:0, nullable:false, integer:true}],
            fixe: ["num", {initial:0, nullable:false, integer:true}],
          }]
        }],
        '2main': ["schema", {
          has: ["bool", { initial: false}],
          actuel: ["str", { initial: "1main", nullable:false}],
          '1main': ["schema", {
            degats: ["schema", {
              dice: ["num", {initial:0, nullable:false, integer:true}],
              fixe: ["num", {initial:0, nullable:false, integer:true}],
            }],
            violence: ["schema", {
              dice: ["num", {initial:0, nullable:false, integer:true}],
              fixe: ["num", {initial:0, nullable:false, integer:true}],
            }]
          }],
        }],
      }],
      optionsmunitions: ["schema", {
        has: ["bool", { initial: false}],
        actuel: ["str", { initial: "0", nullable:false}],
        value: ["num", {initial:1, nullable:false, integer:true}],
        liste: ["obj", {}]
      }],
      tourelle: ["schema", {
        has: ["bool", { initial: false}],
        attaque: ["schema", {
          dice: ["num", {initial:0, nullable:false, integer:true}],
          fixe: ["num", {initial:0, nullable:false, integer:true}],
        }],
      }],
      degats: ["schema", {
        addchair: ["bool", { initial: true}],
        dice: ["num", {initial:0, nullable:false, integer:true}],
        fixe: ["num", {initial:0, nullable:false, integer:true}],
        variable: ["schema", {
          has: ["bool", { initial: false}],
          min: ["schema", {
            dice: ["num", {initial:0, nullable:false, integer:true}],
            fixe: ["num", {initial:0, nullable:false, integer:true}],
          }],
          max: ["schema", {
            dice: ["num", {initial:0, nullable:false, integer:true}],
            fixe: ["num", {initial:0, nullable:false, integer:true}],
          }],
          cout: ["num", {initial:0, nullable:false, integer:true}],
        }]
      }],
      violence: ["schema", {
        dice: ["num", {initial:0, nullable:false, integer:true}],
        fixe: ["num", {initial:0, nullable:false, integer:true}],
        variable: ["schema", {
          has: ["bool", { initial: false}],
          min: ["schema", {
            dice: ["num", {initial:0, nullable:false, integer:true}],
            fixe: ["num", {initial:0, nullable:false, integer:true}],
          }],
          max: ["schema", {
            dice: ["num", {initial:0, nullable:false, integer:true}],
            fixe: ["num", {initial:0, nullable:false, integer:true}],
          }],
          cout: ["num", {initial:0, nullable:false, integer:true}],
        }]
      }],
      effets: ["schema", {
        liste: ["arr", ["str", { initial: "", nullable:false}],],
        raw: ["arr", ["str", { initial: "", nullable:false}],],
        custom: ["arr", ["obj", {}],],
        chargeur: ["num", {initial:null, nullable:true, integer:true}],
        activable:["arr", ["obj", {}],],
      }],
      effets2mains: ["schema", {
        liste: ["arr", ["str", { initial: "", nullable:false}],],
        raw: ["arr", ["str", { initial: "", nullable:false}],],
        custom: ["arr", ["obj", {}],],
        chargeur: ["num", {initial:null, nullable:true, integer:true}],
        activable:["arr", ["obj", {}],],
      }],
      distance: ["schema", {
        liste: ["arr", ["str", { initial: "", nullable:false}],],
        raw: ["arr", ["str", { initial: "", nullable:false}],],
        custom: ["arr", ["obj", {}],],
      }],
      ornementales: ["schema", {
        liste: ["arr", ["str", { initial: "", nullable:false}],],
        raw: ["arr", ["str", { initial: "", nullable:false}],],
        custom: ["arr", ["obj", {}],],
      }],
      structurelles: ["schema", {
        liste: ["arr", ["str", { initial: "", nullable:false}],],
        raw: ["arr", ["str", { initial: "", nullable:false}],],
        custom: ["arr", ["obj", {}],],
      }],
    };

    return combine(base, specific);
  }
  /*static defineSchema() {
    const {SchemaField, StringField, NumberField, BooleanField, ArrayField, ObjectField} = foundry.data.fields;

    const base = super.defineSchema();
    const specific = {
      whoActivate: new StringField({}),
      chassis:new StringField({}),
      equipped:new BooleanField({initial:false}),
      rack:new BooleanField({initial:false}),
      rarete: new StringField({initial: 'standard'}),
      type: new StringField({initial: 'contact'}),
      portee: new StringField({initial: 'contact'}),
      prix: new NumberField({initial: 0}),
      energie: new NumberField({initial: 0}),
      listes: new SchemaField({}),
      gratuit: new BooleanField({initial:false}),
      options2mains: new SchemaField({
        has: new BooleanField({initial: false}),
        actuel: new StringField({initial: '1main'}),
        '1main': new SchemaField({
          degats: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          violence: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          })
        }),
        '2main': new SchemaField({
          degats: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          violence: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          })
        })
      }),
      optionsmunitions: new SchemaField({
        has: new BooleanField({initial: false}),
        actuel: new StringField({initial: '0'}),
        value: new NumberField({initial: 1}),
        liste: new ObjectField({})
      }),
      tourelle: new SchemaField({
        has: new BooleanField({initial: false}),
        attaque: new SchemaField({
          dice: new NumberField({initial: 0}),
          fixe: new NumberField({initial: 0})
        })
      }),
      degats: new SchemaField({
        addchair: new BooleanField({initial: true}),
        dice: new NumberField({initial: 0}),
        fixe: new NumberField({initial: 0}),
        variable: new SchemaField({
          has: new BooleanField({initial: false}),
          min: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          max: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          cout: new NumberField({initial: 0})
        })
      }),
      violence: new SchemaField({
        dice: new NumberField({initial: 0}),
        fixe: new NumberField({initial: 0}),
        variable: new SchemaField({
          has: new BooleanField({initial: false}),
          min: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          max: new SchemaField({
            dice: new NumberField({initial: 0}),
            fixe: new NumberField({initial: 0})
          }),
          cout: new NumberField({initial: 0})
        })
      }),
      effets: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
        chargeur: new NumberField({initial: null}),
        activable:new ArrayField(new ObjectField()),
      }),
      effets2mains: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
        chargeur: new NumberField({initial: null}),
        activable:new ArrayField(new ObjectField()),
      }),
      distance: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
      }),
      ornementales: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
      }),
      structurelles: new SchemaField({
        liste: new ArrayField(new StringField()),
        raw: new ArrayField(new StringField()),
        custom: new ArrayField(new ObjectField()),
      }),
    };

    return foundry.utils.mergeObject(base, specific);
  }*/

  prepareBaseData() {

  }

  prepareDerivedData() {

  }

  async importWpn(json, remplace=true) {
    const pb = await PatchBuilder.for(this.item)

    if(remplace) {
      pb.sys('options2mains.has', false);
      pb.sys('optionsmunitions.has', false);
      pb.sys('degats.variable.has', false);
      pb.sys('violence.variable.has', false);

      pb.sys('effets.raw', []);
      pb.sys('effets.custom', []);
      pb.sys('effets2mains.raw', []);
      pb.sys('effets2mains.custom', []);
      pb.sys('distance.raw', []);
      pb.sys('distance.custom', []);
      pb.sys('ornementales.raw', []);
      pb.sys('ornementales.custom', []);
      pb.sys('structurelles.raw', []);
      pb.sys('structurelles.custom', []);
    }

    pb.set('name',  json?.weapon_name ?? this.item.name);

    pb.sys('description', json?.weapon_description ?? this.description);

    pb.sys('chassis', json?.chassis ?? this.chassis);

    pb.sys('degats.dice', json?.damage_dice ?? 0);
    pb.sys('degats.fixe', json?.damage_flat ?? 0);

    pb.sys('violence.dice', json?.violence_dice ?? 0);
    pb.sys('violence.fixe', json?.violence_flat ?? 0);

    pb.sys('portee', json?.reach?.toLowerCase() ?? 'contact');

    pb.sys('prix', json?.gp ?? 0);

    const effects = [];

    for(let e of json?.effects ?? []) {
      const convert = convertJsonEffects(e);
      if(convert) effects.push(convert);
    }

    pb.sys('effets.raw', effects);

    pb.apply();
  }
}