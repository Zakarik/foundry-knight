
import {
  getAllEffects,
  listEffects,
} from "../../../helpers/common.mjs";
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';
import { combine } from '../../../utils/field-builder.mjs';

const HumanMixinModel = (superclass) => class extends superclass {
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
                wear:["str", { initial: "tenueCivile"}],
                origin:["str", { initial: "humain"}],
                age:["str", { initial: ""}],
                archetype:["str", { initial: ""}],
                metaarmure:["str", { initial: ""}],
                blason:["str", { initial: ""}],
                surnom:["str", { initial: ""}],
                section:["str", { initial: ""}],
                hautFait:["str", { initial: ""}],
                egide:["embedded", DefensesDataModel],
                configurationActive:["str", { initial: ""}],
                wolf:["obj", {}],
                jetsSpeciaux:["arr", ["obj", {}]],
                colosse:["bool", { initial: false}],
                patron:["bool", { initial: false}],
                flux:["schema", {
                    value:["num", {initial:0, nullable:false, integer:true}],
                }],
                art: ["schema", {
                    oeuvres:["obj", {}]
                }],
                combat:["schema", {
                    grenades:["embedded", GrenadesDataModel],
                    nods:["embedded", NodsDataModel],
                }],
                equipements:["schema", {
                    armure:["schema", {
                        capacites:["schema", {
                            ascension:["schema", {
                                id:["str", { initial: "0", nullable:true}],
                                energie:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            borealis:["schema", {
                                allie:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            changeling:["schema", {
                                fauxetres:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            companions:["schema", {
                                type:["str", { initial: "", nullable:true }],
                                energie:["num", {initial:0, nullable:false, integer:true}],
                                energieDisponible:["arr", ["num", {}]],
                            }],
                            forward:["num", {initial:1, nullable:false, integer:true}],
                            goliath:["schema", {
                                metre:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            morph:["schema", {
                                nbre:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            puppet:["schema", {
                                cible:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            rage:["schema", {
                                niveau:["obj", {}],
                            }],
                            totem:["schema", {
                                nombre:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            vision:["schema", {
                                energie:["num", {initial:0, nullable:false, integer:true}],
                            }],
                            warlord:["schema", {
                                energie:["schema", {
                                    nbre:["num", {initial:1, nullable:false, integer:true}],
                                }],
                                esquive:["schema", {
                                    nbre:["num", {initial:1, nullable:false, integer:true}],
                                }],
                                force:["schema", {
                                    nbre:["num", {initial:1, nullable:false, integer:true}],
                                }],
                                guerre:["schema", {
                                    nbre:["num", {initial:1, nullable:false, integer:true}],
                                }],
                            }],
                        }],
                        special:["schema", {
                            contrecoups:["num", {initial:0, nullable:false, integer:true}],
                            flux:["num", {initial:1, nullable:false, integer:true}],
                            impregnation:["num", {initial:0, nullable:false, integer:true}],
                        }],
                    }],
                }],
                espoir:["schema", {
                    mod:["num", {initial:0, nullable:false, integer:true}],
                    base:["num", {initial:50, nullable:false, integer:true}],
                    value:["num", {initial:0, nullable:false, integer:true}],
                    max:["num", {initial:50, nullable:false, integer:true}],
                    perte:["schema", {
                        saufAgonie:["bool", { initial: false}],
                    }],
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
                    recuperation:["schema", {
                        aucun:["bool", { initial: false}],
                        bonus:["num", {initial:0, nullable:false, integer:true}],
                        malus:["num", {initial:0, nullable:false, integer:true}],
                    }],
                    reduction:["num", {initial:0, nullable:false, integer:true}],
                }],
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
                    art:["bool", { initial: false, nullable:false }],
                    champDeForce:["bool", { initial: true, nullable:false }],
                    espoir:["bool", { initial: true, nullable:false }],
                    modules:["bool", { initial: false, nullable:false }],
                    embuscadeSubis:["bool", { initial: false, nullable:false }],
                    embuscadePris:["bool", { initial: false, nullable:false }],
                    wolfConfiguration:["bool", { initial: false, nullable:false }],
                    jetsSpeciaux:["bool", { initial: false, nullable:false }],
                }],
        };

        return combine(base, specific);
    }

    get armorISwear() {
        const wear = this?.dataArmor ? this.wear : 'tenueCivile';

        return wear === 'armure' || wear === 'ascension' ? true : false;
    }

    get whatWear() {
        let wear = this.wear;

        if((wear === 'armure' || wear === 'ascension') && !this.dataArmor) wear = 'tenueCivile'

        return wear;
    }

    get modules() {
        return this.items.filter(items => items.type === 'module');
    }

    get cyberwares() {
        return this.items.filter(items => items.type === 'cyberware');
    }

    get eqpData() {
        return this;
    }

    get dataArmor() {
        return this.items.find(items => items.type === 'armure');
    }

    get dataArmorLegend() {
        return this.items.find(items => items.type === 'armurelegende');
    }

    get hasCyberware() {
        return true;
    }

    _startPrepareData() {
        super._startPrepareData();

        this.#cyberware();
    }

    _startPrepareDerivedData() {
        super._startPrepareDerivedData();

        this.#modules();
    }

    #cyberware() {
        const allCyberware = this.cyberwares;
        const cyberware = allCyberware.filter(items => items.system.categorie === 'utilitaire' || items.system.categorie === 'combat');

        if(cyberware.length) {
            Object.defineProperty(this.eqpData.energie.bonus, 'cyberware', {
                value: 20,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(allCyberware.length) {
            Object.defineProperty(this.espoir.malus, 'cyberware', {
                value: allCyberware.length*3,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #modules() {
        const data = this.modules;
        let santeBonus = 0;
        let armureBonus = 0;
        let champDeForceBonus = 0;
        let energieBonus = 0;
        let defenseBonus = 0;
        let reactionBonus = 0;

        let santeMalus = 0;
        let armureMalus = 0;
        let champDeForceMalus = 0;
        let energieMalus = 0;
        let defenseMalus = 0;
        let reactionMalus = 0;

        const actuel = data.filter(itm => (itm.system.active.base || (itm.system?.niveau?.actuel?.permanent ?? false)) && !itm.system.isLion);

        for(let m of actuel) {
            const system = m.system?.niveau?.actuel ?? {};
            const effets = system?.effets ?? {has:false};
            const bonus = system?.bonus || {has:false};
            const arme = system?.arme || {has:false};

            if(effets.has) {
                const bDefense = effets.raw.find(str => { if(str.includes('defense')) return str; });
                const bReaction = effets.raw.find(str => { if(str.includes('reaction')) return str; });

                if(bDefense) defenseBonus += parseInt(bDefense.split(' ')[1]);
                if(bReaction) reactionBonus += parseInt(bReaction.split(' ')[1]);
            }

            if(bonus.has) {
                const bSante = bonus?.sante?.has ?? false;
                const bArmure = bonus?.armure?.has ?? false;
                const bChampDeForce = bonus?.champDeForce?.has ?? false;
                const bEnergie = bonus?.energie?.has ?? false;

                if(bSante) santeBonus += bonus?.sante?.value ?? 0;
                if(bArmure) armureBonus += bonus?.armure?.value ?? 0;
                if(bChampDeForce) champDeForceBonus += bonus?.champDeForce?.value ?? 0;
                if(bEnergie) energieBonus += bonus?.energie?.value ?? 0;
            }

            if(arme.has) {
                const armeEffets = getFlatEffectBonus(arme, true);

                defenseBonus += armeEffets.defense.bonus;
                defenseMalus += armeEffets.defense.malus;

                reactionBonus += armeEffets.reaction.bonus;
                reactionMalus += armeEffets.reaction.malus;

                champDeForceBonus += armeEffets.cdf.bonus;
            }
        }

        if(santeBonus > 0) {
            Object.defineProperty(this.sante.bonus, 'module', {
                value: santeBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(santeMalus > 0) {
            Object.defineProperty(this.sante.malus, 'module', {
                value: santeMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(armureBonus > 0) {
            Object.defineProperty(this.armure.bonus, 'module', {
                value: armureBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(armureMalus > 0) {
            Object.defineProperty(this.armure.malus, 'module', {
                value: armureMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(champDeForceBonus > 0) {
            Object.defineProperty(this.champDeForce.bonus, 'module', {
                value: champDeForceBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(champDeForceMalus > 0) {
            Object.defineProperty(this.champDeForce.malus, 'module', {
                value: champDeForceMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(energieBonus > 0) {
            Object.defineProperty(this.energie.bonus, 'module', {
                value: energieBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(energieMalus > 0) {
            Object.defineProperty(this.energie.malus, 'module', {
                value: energieMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(defenseBonus > 0) {
            Object.defineProperty(this.defense.bonus, 'module', {
                value: defenseBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(defenseMalus > 0) {
            Object.defineProperty(this.defense.malus, 'module', {
                value: defenseMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(reactionBonus > 0) {
            Object.defineProperty(this.reaction.bonus, 'module', {
                value: reactionBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(reactionMalus > 0) {
            Object.defineProperty(this.reaction.malus, 'module', {
                value: reactionMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    _applyTranslation() {
        super._applyTranslation();
        this.#translationGrenades();
    }

    #translationGrenades() {
        const grenades = this?.combat?.grenades?.liste;

        if(!grenades) return;

        const allEffects = getAllEffects();

        for(let g in grenades) {
            const data = grenades?.[g];
            const effects = data?.effets;

            Object.defineProperty(effects, 'liste', {
                value: listEffects(effects, allEffects, effects?.chargeur ?? null),
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    _getWeaponHandlers() {
        return {
          armesimprovisees: ({ type, name, num }) => this.useAI(type, name, num),
          grenades: ({ num }) => this.useGrenade(num),
          longbow: () => this.useLongbow(),
        };
    }

    async useNods(type, heal=false) {
        const nod = this.combat.nods[type];
        const pj = ['knight'];
        const nbre = Number(nod.value);
        const dices = nod.dices;
        const wear = this.whatWear;
        let str = ``;

        if(pj.includes(this.actor.type)) str = `equipements.${wear}.`;

        if(nbre > 0) {
            let update = {}

            if(heal) {
                switch(type) {
                    case 'soin':
                    update['system.sante.value'] = `@{rollTotal}+${this.sante.value}`;
                    break;

                    case 'energie':
                    update[`system.${str}energie.value`] = `@{rollTotal}+${this.energie.value}`;
                    break;

                    case 'armure':
                    update[`system.${str}armure.value`] = `@{rollTotal}+${this.armure.value}`;
                    break;
                }
            }

            update[`system.combat.nods.${type}.value`] = nbre - 1;

            const rNods = new game.knight.RollKnight(this.actor, {
                name:game.i18n.localize(`KNIGHT.JETS.Nods${type}`),
                dices:dices,
            }, false);

            await rNods.doRoll(update);
        } else {
          const rNods = new game.knight.RollKnight(this.actor, {
            name:game.i18n.localize(`KNIGHT.JETS.Nods${type}`),
          }, false);

          rNods.sendMessage({
            classes:'fail',
            text:`${game.i18n.localize(`KNIGHT.JETS.NotNods`)}`,
          })
        }
    }

    useGrenade(type) {
        const nbreGrenade = this.combat?.grenades?.quantity?.value ?? 0;

        if(nbreGrenade === 0) {
            ui.notifications.warn(game.i18n.localize(`KNIGHT.AUTRE.NoGrenades`));
            return;
        }

        const dataGrenade = this.combat.grenades.liste[type];
        const wpn = `grenade_${type}`;
        const label = dataGrenade.custom ? `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${dataGrenade.label}` : `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${type.charAt(0).toUpperCase()+type.substr(1)}`)}`;
        const modificateur = this.rollWpnDistanceMod;
        const actor = this.actorId;

        const dialog = new game.knight.applications.KnightRollDialog(actor, {
            label,
            wpn,
            modificateur
        });

        dialog.open();

        return dialog;
    }

    useLongbow() {
        const label = game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label`);
        const wpn = `capacite_${this.dataArmor.id}_longbow`;
        const actor = this.actorId;
        const modificateur = this.rollWpnDistanceMod;

        const dialog = new game.knight.applications.KnightRollDialog(actor, {
          label,
          wpn,
          modificateur
        });

        dialog.open();

        return dialog;
    }
}

export default HumanMixinModel;