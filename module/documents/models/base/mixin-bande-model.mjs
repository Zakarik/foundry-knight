import { combine } from '../../../utils/field-builder.mjs';

const BandeMixinModel = (superclass) => class extends superclass {
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
            debordement:["schema", {
              value:["num", {initial:0, nullable:false, integer:true}],
              tour:["num", {initial:1, nullable:false, integer:true}],
            }],
        }

        return combine(base, specific);
    }
	/*static defineSchema() {
		const {SchemaField, NumberField, ObjectField, BooleanField} = foundry.data.fields;

        const base = super.defineSchema();
        const specific = {
            debordement:new SchemaField({
              value:new NumberField({ initial: 0, integer: true, nullable: false }),
              tour:new NumberField({ initial: 1, integer: true, nullable: false }),
            }),
        }

        return foundry.utils.mergeObject(base, specific);
    }*/

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
            dataMod:{degats:{dice:0, fixe:0}, violence:{dice:0, fixe:dgtsDice}},
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

export default BandeMixinModel;