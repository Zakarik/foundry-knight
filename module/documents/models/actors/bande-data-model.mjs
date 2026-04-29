import BaseActorDataModel from "../base/base-actor-data-model.mjs";
import NPCMixinModel from "../base/mixin-npc-model.mjs";
import BandeMixinModel from "../base/mixin-bande-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class BandeDataModel extends BandeMixinModel(NPCMixinModel(BaseActorDataModel)) {
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
            champDeForce: ["schema", {
                value:["num", {initial:0, nullable:false, integer:true}],
                base:["num", {initial:0, nullable:false, integer:true}],
                mod:["num", {initial:0, nullable:false, integer:true}],
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
            options:["schema", {
                resilience:["bool", { initial: false, nullable:false }],
                champDeForce:["bool", { initial: false, nullable:false }],
            }],
        }

        return combine(base, specific);
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

	_EndPrepareDerivedData() {
        super._EndPrepareDerivedData();

        this.#derived();
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
}