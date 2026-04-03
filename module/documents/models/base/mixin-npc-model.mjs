import { AspectsNPCDataModel } from '../parts/aspects-npc-data-model.mjs';
import { Phase2DataModel } from '../parts/phase2-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { combine } from '../../../utils/field-builder.mjs';
import {
  getFlatEffectBonus,
} from "../../../helpers/common.mjs";

const NPCMixinModel = (superclass) => class extends superclass {
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
            origin:["str", { initial: "anatheme"}],
            type:["str", { initial: ""}],
            histoire:["html", { initial: ""}],
            tactique:["html", { initial: ""}],
            pointsFaibles:["html", { initial: ""}],
            aspects:["embedded", AspectsNPCDataModel],
            limited:["schema", {
                showPointsFaibles:["bool", { initial: false}],
            }],
            bouclier:["embedded", DefensesDataModel],
            phase2:["embedded", Phase2DataModel],
            phase2Activate:["bool", { initial: false}],
            colosse:["bool", { initial: false}],
            patron:["bool", { initial: false}],
            options:["schema", {
                bouclier:["bool", { initial: true, nullable:false }],
                phase2:["bool", { initial: false, nullable:false }],
                notFirstMenu:["bool", { initial: false, nullable:false }],
                noSecondMenu:["bool", { initial: false, nullable:false }],
                armure:["bool", { initial: true, nullable:false }],
                energie:["bool", { initial: true, nullable:false }],
                sante:["bool", { initial: true, nullable:false }],
                resilience:["bool", { initial: true, nullable:false }],
            }],
            resilience:["schema", {
                value:["num", {initial:0, nullable:false, integer:true}],
                max:["num", {initial:50, nullable:false, integer:true}],
            }],
        }

        return combine(base, specific);
    }

    /*static defineSchema() {
        const {SchemaField, StringField, EmbeddedDataField, NumberField, BooleanField, HTMLField, ObjectField} = foundry.data.fields;

        const base = super.defineSchema();
        const specific = {
            origin:new StringField({initial:'anatheme'}),
            type:new StringField({initial:''}),
            histoire:new HTMLField({initial:""}),
            tactique:new HTMLField({initial:""}),
            pointsFaibles:new HTMLField({initial:""}),
            aspects:new EmbeddedDataField(AspectsNPCDataModel),
            limited:new SchemaField({
                showPointsFaibles:new BooleanField({initial:false}),
            }),
            bouclier:new EmbeddedDataField(DefensesDataModel),
            phase2:new EmbeddedDataField(Phase2DataModel),
            phase2Activate:new BooleanField({initial:false}),
            colosse:new BooleanField({initial:false}),
            patron:new BooleanField({initial:false}),
            options:new SchemaField({
                bouclier:new BooleanField({initial:true, nullable:false}),
                phase2:new BooleanField({initial:false, nullable:false}),
                notFirstMenu:new BooleanField({initial:false, nullable:false}),
                noSecondMenu:new BooleanField({initial:false, nullable:false}),
                armure:new BooleanField({initial:true, nullable:false}),
                energie:new BooleanField({initial:true, nullable:false}),
                sante:new BooleanField({initial:true, nullable:false}),
                resilience:new BooleanField({initial:true, nullable:false}),
            }),
            resilience:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:50, nullable:false, integer:true}),
            }),
        };

        return foundry.utils.mergeObject(base, specific);
    }*/

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

    get capacitesNonLie() {
        return this.items.filter(items => items.type === 'capacite');
    }

    get capacitesBonusLie() {
        return this.items.filter(items => items.type === 'capacite' && (items.system?.bonus?.aspectsLieSupplementaire?.has ?? false));
    }


    togglePhase2() {
        const aspects = this.aspects;
        const phase2 = this.phase2;

        let update = {};

        if(this.phase2Activate) {
            update['system.phase2Activate'] = false;

            for(let a in phase2.aspects) {
            update[`system.aspects.${a}.value`] = aspects[a].value - phase2.aspects[a].value;
            update[`system.aspects.${a}.ae.mineur.value`] = aspects[a].ae.mineur.value - phase2.aspects[a].ae.mineur;
            update[`system.aspects.${a}.ae.majeur.value`] = aspects[a].ae.majeur.value - phase2.aspects[a].ae.majeur;
            }
        } else {
            update['system.phase2Activate'] = true;

            for(let a in phase2.aspects) {
            update[`system.aspects.${a}.value`] = aspects[a].value + phase2.aspects[a].value;
            update[`system.aspects.${a}.ae.mineur.value`] = aspects[a].ae.mineur.value + phase2.aspects[a].ae.mineur;
            update[`system.aspects.${a}.ae.majeur.value`] = aspects[a].ae.majeur.value + phase2.aspects[a].ae.majeur;
            }
        }

        this.actor.update(update);
    }

    async doCapacityDgt(id, args={}) {
        const {
            obliteration = false,
            tenebricide = false,
        } = args;
        const actor = this.actor;
        const capacite = actor.items.get(id);
        const label = capacite?.name ?? "";
        const listtargets = game.user.targets;
        const allTargets = [];
        const roll = new game.knight.RollKnight(actor, {
            name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
        }, false);
        const weapon = roll.prepareWpnContact({
            name:capacite.name,
            system:{
            degats:{dice:capacite.system.degats.system.dice, fixe:capacite.system.degats.system.fixe},
            effets:capacite.system.degats.system.effets,
            }
        });
        const options = weapon.options;

        if(listtargets && listtargets.size > 0) {
            for(let t of listtargets) {
            const actor = t.actor;

            allTargets.push({
                id:t.id,
                name:actor.name,
                aspects:actor.system.aspects,
                type:actor.type,
                effets:[],
            });
            }
        }

        for(let o of options) {
            if(obliteration && o.classes.includes('obliteration')) o.active = true;
            if(tenebricide && o.classes.includes('tenebricide')) o.active = true;
        }

        roll.setWeapon(weapon);
        let flags = roll.getRollData(weapon, {targets:allTargets});
        flags.notDebordement = true;

        await roll.doRollDamage(flags);
    }


    _startPrepareData() {
        super._startPrepareData();

        this.#armes();
        this.#capacites();
        this.#phase2();
    }

    _startPrepareDerivedData() {
        super._startPrepareDerivedData();
    }

    _endPrepareDerivedData() {
        super._endPrepareDerivedData();

        this.#defenses();
    }

    #armes() {
        const armes = this.armes;
        let defenseBonus = 0;
        let defenseMalus = 0;
        let reactionBonus = 0;
        let reactionMalus = 0;
        let champDeForce = 0;

        for(let a of armes) {
            const effets = getFlatEffectBonus(a);

            defenseBonus += effets.defense.bonus;
            defenseMalus += effets.defense.malus;
            reactionBonus += effets.reaction.bonus;
            reactionMalus += effets.reaction.malus;
            champDeForce += effets.cdf.bonus;
        }

        if(defenseBonus > 0) {
            Object.defineProperty(this.defense.bonus, 'armes', {
                value: defenseBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(defenseMalus > 0) {
            Object.defineProperty(this.defense.malus, 'armes', {
                value: defenseMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(reactionBonus > 0) {
            Object.defineProperty(this.reaction.bonus, 'armes', {
                value: reactionBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(reactionMalus > 0) {
            Object.defineProperty(this.reaction.malus, 'armes', {
                value: reactionMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(champDeForce > 0) {
            Object.defineProperty(this.champDeForce.bonus, 'armes', {
                value: champDeForce,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #capacites() {
        const capaciteLie = this.capacitesBonusLie;
        const capacitesNonLie = this.capacitesNonLie;
        let sante = 0;
        let armure = 0;
        let aspectsMax = [];
        let aspectsLieBonus = [];

        for(let c of capaciteLie) {
            aspectsLieBonus.push(c.system.bonus.aspectsLieSupplementaire.value);
        }

        for(let c of capacitesNonLie) {
            const system = c.system;

            if(!system.isPhase2 || (system.isPhase2 && this.phase2Activate)) {
                if(system.bonus.sante.has) {
                if(system.bonus.sante.aspect.lie) {
                    let base = this.aspects[system.bonus.sante.aspect.value].value;

                    if(aspectsLieBonus.length > 0) {
                    for(let a of aspectsLieBonus) {
                        base += this.aspects[a].value;
                    }
                    }

                    sante += (base*system.bonus.sante.aspect.multiplie);
                }
                else sante += system.bonus.sante.value;
                }

                if(system.bonus.armure.has) {
                if(system.bonus.armure.aspect.lie) {
                    let base = this.aspects[system.bonus.armure.aspect.value].value;

                    if(aspectsLieBonus.length > 0) {
                    for(let a of aspectsLieBonus) {
                        base += this.aspects[a].value;
                    }
                    }

                    armure += (base*system.bonus.armure.aspect.multiplie);
                }
                else armure += system.bonus.armure.value;
                }

                if(system.bonus.aspectMax.has) {
                aspectsMax.push({
                    key:system.bonus.aspectMax.aspect,
                    aspect:system.bonus.aspectMax.maximum.aspect,
                    ae:system.bonus.aspectMax.maximum.ae,
                });
                }
            }
        }

        Object.defineProperty(this.sante.bonus, 'capacites', {
            value: sante,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.armure.bonus, 'capacites', {
            value: armure,
            writable:true,
            enumerable:true,
            configurable:true
        });

        for(let a of aspectsMax) {
        Object.defineProperty(this.aspects[a.key], 'max', {
            value: a.aspect,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.aspects[a.key].ae.mineur, 'max', {
            value: a.ae,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.aspects[a.key].ae.majeur, 'max', {
            value: a.ae,
            writable:true,
            enumerable:true,
            configurable:true
        });
        }
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

    #phase2() {
        const phase2 = this.phase2;

        if(!this.phase2Activate) return;

        Object.defineProperty(this.sante.bonus, 'phase2', {
        value: phase2.sante,
        writable:true,
        enumerable:true,
        configurable:true
        });

        Object.defineProperty(this.armure.bonus, 'phase2', {
        value: phase2.armure,
        writable:true,
        enumerable:true,
        configurable:true
        });

        Object.defineProperty(this.energie.bonus, 'phase2', {
        value: phase2.energie,
        writable:true,
        enumerable:true,
        configurable:true
        });
    }

    _applyTranslation() {
        super._applyTranslation();
        const ae = this.translationAE();

        Object.defineProperty(this.actor, 'translations', {
            value: foundry.utils.mergeObject(this.actor.translations, ae),
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    translationAE() {
        const actor = this.actor;

        if(!actor) return;
        const result = {};

        for(let a in this.aspects) {
            const data = this.aspects[a];
            const mineur = data?.ae?.mineur?.value ?? 0;
            const majeur = data?.ae?.majeur?.value ?? 0;

            if(mineur > 0 || majeur > 0) result[a] = {}

            if(mineur > 0 && majeur === 0) {
            result[a].mineur = game.i18n.localize(`KNIGHT.ASPECTS.${a.toUpperCase()}.AE.Mineur`);
            } else if(majeur > 0) {
            result[a].mineur = game.i18n.localize(`KNIGHT.ASPECTS.${a.toUpperCase()}.AE.Mineur`);
            result[a].majeur = game.i18n.localize(`KNIGHT.ASPECTS.${a.toUpperCase()}.AE.Majeur`);
            }
        }

        return {
            aspectexceptionnel:result,
        };
    }

    useAI(type, name, num) {
        const label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
        const wpn = type === 'distance' ? `${name}${num}d` : `${name}${num}c`;
        const whatRoll = [];
        let modificateur = 0;
        let base = '';

        whatRoll.push('force');

        base = 'chair';

        const actor = this.actorId;

        const dialog = new game.knight.applications.KnightRollDialog(actor, {
          label,
          wpn,
          base,
          whatRoll,
          modificateur
        });

        dialog.open();

        return dialog;
    }
}

export default NPCMixinModel;