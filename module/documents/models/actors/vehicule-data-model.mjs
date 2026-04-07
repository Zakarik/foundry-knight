
import BaseActorDataModel from "../base/base-actor-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class VehiculeDataModel extends BaseActorDataModel {

  static get baseDefinition() {
    const base = super.baseDefinition;
    const specific = {
      manoeuvrabilite:["num", { initial: 0, nullable:false, integer:true}],
      vitesse:["num", { initial: 0, nullable:false, integer:true}],
      passagers:["num", { initial: 0, nullable:false, integer:true}],
      champDeForce: ["schema", {
          value:["num", { initial: 0, nullable:false, integer:true}],
          base:["num", { initial: 0, nullable:false, integer:true}],
          bonus:["obj", {
            initial:{
              user:0,
            }
          }],
          malus:["obj", {
            initial:{
              user:0,
            }
          }],
      }],
      equipage:["schema", {
          value:["num", { initial: 0, nullable:false, integer:true}],
          max:["num", { initial: 0, nullable:false, integer:true}],
          pilote:["schema", {
              name:["str", { initial: "" }],
              id:["str", { initial: "" }],
          }],
          passagers:["arr", ["obj", {}]],
      }],
      debordement:["schema", {
        value:["num", { initial: 0, nullable:false, integer:true}],
        tour:["num", { initial: 1, nullable:false, integer:true}],
      }],
      options:["schema", {
        blindage:["bool", { initial: false }],
        noPilote:["bool", { initial: false }],
        noPassager:["bool", { initial: false }],
        debordement:["bool", { initial: false }],
      }],
    }

    return combine(base, specific);
  }

  /*static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

    const base = super.defineSchema();
    const specific = {
      manoeuvrabilite:new NumberField({ initial: 0, integer: true, nullable: false }),
      vitesse:new NumberField({ initial: 0, integer: true, nullable: false }),
      passagers:new NumberField({ initial: 0, integer: true, nullable: false }),
      champDeForce: new SchemaField({
          value:new NumberField({ initial: 0, integer: true, nullable: false }),
          base:new NumberField({ initial: 0, integer: true, nullable: false }),
          bonus:new ObjectField({
            initial:{
              user:0,
            }
          }),
          malus:new ObjectField({
            initial:{
              user:0,
            }
          }),
      }),
      equipage:new SchemaField({
          value:new NumberField({initial:0, nullable:false, integer:true}),
          max:new NumberField({initial:0, nullable:false, integer:true}),
          pilote:new SchemaField({
              name:new StringField({ initial: "" }),
              id:new StringField({ initial: "" }),
          }),
          passagers:new ArrayField(new ObjectField()),
      }),
      debordement:new SchemaField({
        value:new NumberField({ initial: 0, integer: true, nullable: false }),
        tour:new NumberField({ initial: 1, integer: true, nullable: false }),
      }),
      options:new SchemaField({
        blindage:new BooleanField({initial:false}),
        noPilote:new BooleanField({initial:false}),
        noPassager:new BooleanField({initial:false}),
        debordement:new BooleanField({initial:false}),
      }),
    }

    return foundry.utils.mergeObject(base, specific);
  }*/

  get pilote() {
    if(!this.equipage.pilote.id) return undefined;
    if(!game.actors.get(this.equipage.pilote.id)) return undefined;

    return game.actors.get(this.equipage.pilote.id);
  }
  static migrateData(source) {
      if(source.version < 1) {
          const mods = ['armure', 'energie', 'champDeForce'];

          for(let m of mods) {
            if(!source[m]) continue;

              for(let b in source[m].bonus) {
                  source[m].bonus[b] = 0;
              }

              for(let b in source[m].malus) {
                  source[m].malus[b] = 0;
              }
          }

          source.version = 1;
      }

      return super.migrateData(source);
  }

  _EndPrepareDerivedData() {
    super._EndPrepareDerivedData();

    this.#setPilote();
    this.#setDefenses();
    this.#setDerived();
  }

  #setPilote() {
    const pilote = this.pilote;

    if(!pilote) return;

    if(!pilote) {
      Object.defineProperty(this.equipage.pilote, 'id', {
        value: '',
      });

      Object.defineProperty(this.equipage.pilote, 'name', {
        value: '',
      });
    } else {
      const malusDefense = Object.values(this.defense?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

      const malusReaction = Object.values(this.reaction?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const manoeuvrabilite = this.manoeuvrabilite;

      Object.defineProperty(this.reaction, 'mod', {
        value: manoeuvrabilite-malusReaction,
      });

      Object.defineProperty(this.defense, 'mod', {
        value: 0-malusDefense,
      });
    }
  }

  #setDefenses() {
    const pilote = this.pilote;

    if(!pilote) return;

    let bonusDefense = Object.values(this.defense?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    bonusDefense += pilote.system?.defense?.bonus?.user ?? 0;
    let bonusReaction = Object.values(this.reaction?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    bonusReaction += pilote.system?.reaction?.bonus?.user ?? 0;

    Object.defineProperty(this.reaction, 'value', {
      value: Math.max(pilote.system.reaction.value + this.reaction.mod + bonusReaction, 0),
    });

    Object.defineProperty(this.reaction, 'valueWOMod', {
        value: this.reaction.mod > 0 ? pilote.system.reaction.valueWOMod + this.reaction.mod + bonusReaction : pilote.system.reaction.base + bonusReaction,
    });

    Object.defineProperty(this.defense, 'value', {
      value: Math.max(pilote.system.defense.base+this.defense.mod + bonusDefense, 0),
    });

    Object.defineProperty(this.defense, 'valueWOMod', {
        value: this.defense.mod > 0 ? pilote.system.defense.base + this.defense.mod + bonusDefense : pilote.system.defense.base + bonusDefense,
    });

    Object.defineProperty(this.initiative, 'complet', {
      value: `${pilote.system.initiative.dice}D6+${pilote.system.initiative.value}`,
    });
  }

  #setDerived() {
    const list = CONFIG.KNIGHT.LIST.vehicules;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = system.bonus?.user ?? 0;
      const malus = system.malus?.user ?? 0;
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, update, {
        value: Math.max(base+bonus-malus, 0),
      });
    }
  }
}