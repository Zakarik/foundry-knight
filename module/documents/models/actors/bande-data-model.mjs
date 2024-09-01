import { AspectsNPCDataModel } from '../parts/aspects-npc-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { Phase2DataModel } from '../parts/phase2-data-model.mjs';

export class BandeDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

        return {
            histoire:new HTMLField({initial:""}),
            description:new HTMLField({initial:""}),
            descriptionLimitee:new HTMLField({initial:""}),
            pointsFaibles:new HTMLField({initial:""}),
            aspects:new EmbeddedDataField(AspectsNPCDataModel),
            combat:new SchemaField({
                data:new SchemaField({
                    degatsbonus:new SchemaField({
                        dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                        fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    violencebonus:new SchemaField({
                        dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                        fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    modificateur:new NumberField({ initial: 0, integer: true, nullable: false }),
                    sacrifice:new NumberField({ initial: 0, integer: true, nullable: false }),
                    succesbonus:new NumberField({ initial: 0, integer: true, nullable: false }),
                    tourspasses:new NumberField({ initial: 1, integer: true, nullable: false }),
                    type:new StringField({ initial: "degats"}),
                }),
            }),
            bouclier:new EmbeddedDataField(DefensesDataModel),
            defense:new EmbeddedDataField(DefensesDataModel),
            reaction:new EmbeddedDataField(DefensesDataModel),
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
            phase2:new EmbeddedDataField(Phase2DataModel),
            phase2Activate:new BooleanField({initial:false}),
            initiative:new EmbeddedDataField(InitiativeDataModel),
            options:new SchemaField({
                bouclier:new BooleanField({initial:true, nullable:false}),
                phase2:new BooleanField({initial:false, nullable:false}),
            }),
        }
    }

    get aspect() {
        let data = {}

        for(let a of CONFIG.KNIGHT.LIST.aspects) {
            data[a] = {
                value:this.aspects[a].value,
                mineur:this.aspects[a].ae.mineur.value,
                majeur:this.aspects[a].ae.majeur.value,
            }
        }

        return data;
    }

    prepareBaseData() {

	}

	prepareDerivedData() {
        this.#defenses();
        this.#derived();
    }

    #defenses() {
        const defenses = ['defense', 'reaction'];

        for(let d of defenses) {
            const aspect = this.aspect[CONFIG.KNIGHT.LIST.derived[d]];

            const base = this[d].base;
            const bonus = this[d]?.bonus?.user ?? 0;
            const malus = this[d]?.malus?.user ?? 0;

            Object.defineProperty(this[d], 'mod', {
                value: bonus-malus+aspect.value+aspect.mineur+aspect.majeur,
            });

            Object.defineProperty(this[d], 'value', {
                value: Math.max(base+this[d].mod, 0),
            });
        }
    }

    #derived() {
        const list = CONFIG.KNIGHT.LIST.bandes

        for(let d of list) {
            const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';
            const base = this[d].base;
            const bonus = this[d]?.bonus?.user ?? 0;
            const malus = this[d]?.malus?.user ?? 0;


            Object.defineProperty(this[d], 'mod', {
                value: bonus-malus,
            });

            Object.defineProperty(this[d], update, {
                value: Math.max(base+bonus-malus, 0),
            });
        }

        Object.defineProperty(this.initiative, 'dice', {
            value: 0,
        });

        Object.defineProperty(this.initiative, 'base', {
            value: 0,
        });

        Object.defineProperty(this.initiative, 'value', {
            value: 1,
        });
    }
}