
import { BaseActorDataModel } from "../base/base-actor-data-model.mjs";

export class VehiculeDataModel extends BaseActorDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

    const base = super.defineSchema();
    const specific = {
      version:new NumberField({initial:0, nullable:false, integer:true}),
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
      energie:new SchemaField({
          base:new NumberField({initial:0, nullable:false, integer:true}),
          value:new NumberField({initial:0, nullable:false, integer:true}),
          max:new NumberField({initial:0, nullable:false, integer:true}),
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
      armure:new SchemaField({
          base:new NumberField({initial:0, nullable:false, integer:true}),
          value:new NumberField({initial:0, nullable:false, integer:true}),
          max:new NumberField({initial:16, nullable:false, integer:true}),
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
      initiative:new SchemaField({
          dice:new NumberField({initial:0, nullable:false, integer:true}),
          value:new NumberField({initial:0, nullable:false, integer:true}),
          embuscade:new SchemaField({
              dice:new NumberField({initial:0, nullable:false, integer:true}),
              value:new NumberField({initial:0, nullable:false, integer:true}),
          }),
      }),
      reaction:new SchemaField({
          value:new NumberField({initial:0, nullable:false, integer:true}),
          mod:new NumberField({initial:0, nullable:false, integer:true}),
          valueWOMod:new NumberField({initial:0, nullable:false, integer:true}),
          bonus:new ObjectField({
            initial:{
              user:0,
              system:0,
            }
          }),
          malus:new ObjectField({
            initial:{
              user:0,
              system:0,
            }
          }),
      }),
      defense:new SchemaField({
          value:new NumberField({initial:0, nullable:false, integer:true}),
          mod:new NumberField({initial:0, nullable:false, integer:true}),
          valueWOMod:new NumberField({initial:0, nullable:false, integer:true}),
          bonus:new ObjectField({
            initial:{
              user:0,
              system:0,
            }
          }),
          malus:new ObjectField({
            initial:{
              user:0,
              system:0,
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
  }

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

  prepareBaseData() {
    super.prepareBaseData();
	}

	prepareDerivedData() {
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

  async doDebordement() {
      const actor = this.actor;
      const label = actor.name;
      const dgtsDice = Number(this?.debordement?.tour)*Number(this?.debordement?.value);
      const roll = new game.knight.RollKnight(actor, {
      name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Debordement')}`,
      }, false);
      const weapon = roll.prepareWpnContact({
      name:`${label}`,
      system:{
          degats:{dice:0, fixe:dgtsDice},
          effets:{},
      }
      });
      const addFlags = {
      actor,
      attaque:[],
      dataMod:{degats:{dice:0, fixe:0}, violence:{dice:0, fixe:0}},
      dataStyle:{},
      flavor:label,
      maximize:{degats:false, violence:false},
      style:'standard',
      surprise:false,
      targets:[],
      total:0,
      weapon
      }

      let data = {
      total:0,
      targets: game.user.targets.size > 0 ? game.user.targets : [],
      attaque:[],
      flags:addFlags,
      content:{
          otherBtn:[{
          classes:'debordement full',
          title:game.i18n.localize('KNIGHT.JETS.AugmenterDebordement'),
          label:game.i18n.localize('KNIGHT.JETS.AugmenterDebordement'),
          }]
      }
      };

      roll.setWeapon(weapon);
      await roll.doRollDamage(data, addFlags);
  }
}