import { BaseNPCDataModel } from "../base/base-npc-data-model.mjs";

export class BandeDataModel extends BaseNPCDataModel {
	static defineSchema() {
		const {SchemaField, NumberField, ObjectField} = foundry.data.fields;

        const base = super.defineSchema();
        const specific = {
            debordement:new SchemaField({
              value:new NumberField({ initial: 0, integer: true, nullable: false }),
              tour:new NumberField({ initial: 1, integer: true, nullable: false }),
            }),
            sante:new SchemaField({
                base:new NumberField({initial:0, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
                malusValue:new NumberField({initial:0, nullable:false, integer:true}),
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
            energie:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:16, nullable:false, integer:true}),
            }),
        }

        return foundry.utils.mergeObject(base, specific);
    }

    static migrateData(source) {
        if(source.version < 1) {
            const mods = ['sante', 'bouclier', 'reaction', 'defense', 'initiative'];

            for(let m of mods) {
              if(!source[m]) continue;

                for(let b in source[m].bonus) {
                    source[m].bonus[b] = 0;
                }

                for(let b in source[m].malus) {
                    source[m].malus[b] = 0;
                }
            }

            for(let i in source.initiative.diceBonus) {
                source.initiative.diceBonus[i] = 0;
            }

            for(let i in source.initiative.diceMalus) {
                source.initiative.diceMalus[i] = 0;
            }

            for(let i in source.initiative.embuscade.diceBonus) {
                source.initiative.embuscade.diceBonus[i] = 0;
            }

            for(let i in source.initiative.embuscade.diceMalus) {
                source.initiative.embuscade.diceMalus[i] = 0;
            }

            for(let i in source.initiative.embuscade.bonus) {
                source.initiative.embuscade.bonus[i] = 0;
            }

            for(let i in source.initiative.embuscade.malus) {
                source.initiative.embuscade.malus[i] = 0;
            }

            source.version = 1;
        }

        return super.migrateData(source);
    }

    prepareBaseData() {
        super.prepareBaseData();

        this.#phase2();
        this.aspects.prepareData();
	}

	prepareDerivedData() {
        this.#defenses();
        this.#derived();
    }

    #phase2() {
      const phase2 = this.phase2;

      if(!this.phase2Activate) return;

      Object.defineProperty(this.sante.bonus, 'phase2', {
        value: phase2.sante,
        writable:true,
        enumerable:true,
        configurable:true
      });
    }

    #defenses() {
        const defenses = ['defense', 'reaction'];
        const machineAE = this.aspect.machine.mineur+this.aspect.machine.majeur;
        const masqueAE = this.aspect.masque.mineur+this.aspect.masque.majeur;

        Object.defineProperty(this.reaction.bonus, 'machine', {
          value: machineAE,
          writable:true,
          enumerable:true,
          configurable:true
        });

        Object.defineProperty(this.defense.bonus, 'masque', {
          value: masqueAE,
          writable:true,
          enumerable:true,
          configurable:true
        });

        for(let d of defenses) {
            const aspect = this.aspect[CONFIG.KNIGHT.LIST.derived[d]];

            const base = this[d].base;
            const bonus = Object.values(this[d]?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const malus = Object.values(this[d]?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

            Object.defineProperty(this[d], 'mod', {
                value: bonus-malus,
            });

            Object.defineProperty(this[d], 'value', {
                value: Math.max(base+this[d].mod, 0),
            });

            Object.defineProperty(this[d], 'valueWOMod', {
                value: base+bonus,
            });

            Object.defineProperty(this[d], 'malustotal', {
                value: malus,
            });
        }
    }

    #derived() {
        const list = CONFIG.KNIGHT.LIST.bandes

        for(let d of list) {
            const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';
            const base = this[d].base;
            const bonus = Object.values(this[d]?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const malus = Object.values(this[d]?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

            Object.defineProperty(this[d], 'mod', {
                value: bonus-malus,
            });

            Object.defineProperty(this[d], update, {
                value: Math.max(base+this[d].mod, 0),
            });
        }

        this.initiative.prepareBandeData();
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