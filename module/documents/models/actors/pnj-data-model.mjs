import {
  getFlatEffectBonus,
} from "../../../helpers/common.mjs";

import { BaseNPCDataModel } from "../base/base-npc-data-model.mjs";
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';

export class PNJDataModel extends BaseNPCDataModel {
    static defineSchema() {
    const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField} = foundry.data.fields;

        const base = super.defineSchema();
        const specific = {
            age:new StringField({ initial: ""}),
            archetype:new StringField({ initial: ""}),
            metaarmure:new StringField({ initial: ""}),
            blason:new StringField({ initial: ""}),
            surnom:new StringField({initial:""}),
            section:new StringField({initial:""}),
            hautFait:new StringField({initial:""}),
            champDeForce:new EmbeddedDataField(DefensesDataModel),
            egide:new EmbeddedDataField(DefensesDataModel),
            configurationActive:new StringField({initial:""}),
            wolf:new ObjectField({}),
            jetsSpeciaux:new ArrayField(new ObjectField({})),
            colosse:new BooleanField({initial:false}),
            patron:new BooleanField({initial:false}),
            armure: new SchemaField({
                base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
                bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
                malusValue:new NumberField({initial:0, nullable:false, integer:true}),
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
            art: new SchemaField({
                oeuvres:new ObjectField(),
            }),
            combat:new SchemaField({
                armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
                grenades:new EmbeddedDataField(GrenadesDataModel),
                nods:new EmbeddedDataField(NodsDataModel),
            }),
            equipements:new SchemaField({
                armure:new SchemaField({
                    capacites:new SchemaField({
                        ascension:new SchemaField({
                            id:new StringField({initial:"0", nullable:true}),
                            energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        borealis:new SchemaField({
                            allie:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        changeling:new SchemaField({
                            fauxetres:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        companions:new SchemaField({
                            type:new StringField({initial:"", nullable:true}),
                            energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                            energieDisponible:new ArrayField(new NumberField()),
                        }),
                        forward:new NumberField({ initial: 1, integer: true, nullable: false }),
                        goliath:new SchemaField({
                            metre:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        morph:new SchemaField({
                            nbre:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        puppet:new SchemaField({
                            cible:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        rage:new SchemaField({
                            niveau:new ObjectField(),
                        }),
                        totem:new SchemaField({
                            nombre:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        vision:new SchemaField({
                            energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                        }),
                        warlord:new SchemaField({
                            energie:new SchemaField({
                                nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                            }),
                            esquive:new SchemaField({
                                nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                            }),
                            force:new SchemaField({
                                nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                            }),
                            guerre:new SchemaField({
                                nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                            }),
                        }),
                    }),
                    special:new SchemaField({
                        contrecoups:new NumberField({ initial: 0, integer: true, nullable: false }),
                        flux:new NumberField({ initial: 1, integer: true, nullable: false }),
                        impregnation:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                }),
            }),
            sante:new SchemaField({
                base:new NumberField({initial:0, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
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
            espoir:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:50, nullable:false, integer:true}),
                reduction:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            resilience:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:50, nullable:false, integer:true}),
            }),
            energie:new SchemaField({
                base:new NumberField({initial:0, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
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
            bonusSiEmbuscade:new SchemaField({
            bonusInitiative:new SchemaField({
                dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
            }),
            options:new SchemaField({
                art:new BooleanField({initial:false, nullable:false}),
                armure:new BooleanField({initial:true, nullable:false}),
                champDeForce:new BooleanField({initial:true, nullable:false}),
                energie:new BooleanField({initial:true, nullable:false}),
                espoir:new BooleanField({initial:true, nullable:false}),
                modules:new BooleanField({initial:false, nullable:false}),
                notFirstMenu:new BooleanField({initial:false, nullable:false}),
                noSecondMenu:new BooleanField({initial:false, nullable:false}),
                resilience:new BooleanField({initial:true, nullable:false}),
                sante:new BooleanField({initial:true, nullable:false}),
                embuscadeSubis:new BooleanField({initial:false, nullable:false}),
                embuscadePris:new BooleanField({initial:false, nullable:false}),
                wolfConfiguration:new BooleanField({initial:false, nullable:false}),
                jetsSpeciaux:new BooleanField({initial:false, nullable:false}),
            }),
        }

        return foundry.utils.mergeObject(base, specific);
    }

    get armes() {
        return this.items.filter(items => items.type === 'arme');
    }

    get modules() {
        return this.items.filter(items => items.type === 'module');
    }

    get capacitesNonLie() {
        return this.items.filter(items => items.type === 'capacite');
    }

    get capacitesBonusLie() {
        return this.items.filter(items => items.type === 'capacite' && (items.system?.bonus?.aspectsLieSupplementaire?.has ?? false));
    }

    get dataArmor() {
        return this.items.find(items => items.type === 'armure');
    }

    get armorISwear() {
        const wear = this.dataArmor ? true : false;

        return wear;
    }

    static migrateData(source) {
        if(source.version < 1) {
            const mods = ['armure', 'sante', 'energie', 'champDeForce', 'bouclier', 'reaction', 'defense', 'initiative', 'egide'];

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
        } else if(source.version < 2) {
            const grenades = source.combat.grenades;
            const flashbang = grenades.liste.flashbang;

            if(!flashbang.effets.raw.includes('lumiere 2')) flashbang.effets.raw.push('lumiere 2');

            source.version = 2;
        }

        return super.migrateData(source);
    }

    prepareBaseData() {
        super.prepareBaseData();

        this.#armes();
        this.#capacites();
        this.#phase2();
        this.aspects.prepareData();
    }

    prepareDerivedData() {
        this.#modules();
        this.#derived();
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

        const actuel = data.filter(itm => itm.system.active.base || (itm.system?.niveau?.actuel?.permanent ?? false));

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
        });

        Object.defineProperty(this.aspects[a.key].ae.mineur, 'max', {
            value: a.ae,
        });

        Object.defineProperty(this.aspects[a.key].ae.majeur, 'max', {
            value: a.ae,
        });
        }

        if(this.dataArmor) {
            const capacites = this.dataArmor.system.capacites.selected;
            const whatAffect = this.energie;

            //ON CHECK TOUTES LES CAPACITES POUR APPLIQUER LES EFFETS DES CAPACITES ACTIVES
            for(let c in capacites) {
                const data = capacites[c];

                switch(c) {
                    case 'ascension':
                        if(data.active) {
                            Object.defineProperty(whatAffect.malus, c, {
                                value: data.depense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'companions':
                        if(data?.active?.base ?? false) {
                            const lion = data?.lion?.id ?? undefined;
                            const wolf = data?.wolf?.id?.id1 ?? undefined;
                            const crow = data?.crow?.id ?? undefined;
                            let depense = 0;

                            if(lion) {
                                if(game.actors.get(lion)) depense = game.actors.get(lion).system.energie.base;
                            }

                            if(wolf) {
                                if(game.actors.get(wolf)) depense = game.actors.get(wolf).system.energie.base;
                            }

                            if(crow) {
                                if(game.actors.get(crow)) depense = game.actors.get(crow).system.energie.base;
                            }

                            Object.defineProperty(whatAffect.malus, c, {
                                value: depense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'shrine':
                        if(data.active && (data?.active?.personnel ?? false)) {
                            Object.defineProperty(this.champDeForce.bonus, c, {
                                value: data.champdeforce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'goliath':
                        if(data.active) {
                            Object.defineProperty(this.champDeForce.bonus, c, {
                                value: this.equipements.armure.capacites.goliath.metre*data.bonus.cdf.value,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.reaction.malus, c, {
                                value: this.equipements.armure.capacites.goliath.metre*data.malus.reaction.value,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.malus, c, {
                                value: this.equipements.armure.capacites.goliath.metre*data.malus.defense.value,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'morph':
                        if(data?.choisi?.metal ?? false) {
                            Object.defineProperty(this.champDeForce.bonus, c, {
                                value: data.metal.bonus.champDeForce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }

                        if(data?.choisi?.fluide ?? false) {
                            Object.defineProperty(this.reaction.bonus, c, {
                                value: data.fluide.bonus.reaction,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.bonus, c, {
                                value: data.fluide.bonus.defense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'rage':
                        if(data.active) {
                            if(data?.niveau?.colere ?? false) {
                                Object.defineProperty(this.egide.bonus, c, {
                                    value: data.colere.egide,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });

                                Object.defineProperty(this.reaction.malus, c, {
                                    value: data.colere.reaction,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });

                                Object.defineProperty(this.defense.malus, c, {
                                    value: data.colere.defense,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });
                            }

                            if(data?.niveau?.rage ?? false) {
                                Object.defineProperty(this.egide.bonus, c, {
                                    value: data.rage.egide,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });

                                Object.defineProperty(this.reaction.malus, c, {
                                    value: data.rage.reaction,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });

                                Object.defineProperty(this.defense.malus, c, {
                                    value: data.rage.defense,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });
                            }

                            if(data?.niveau?.fureur ?? false) {
                                Object.defineProperty(this.egide.bonus, c, {
                                    value: data.fureur.egide,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });

                                Object.defineProperty(this.reaction.malus, c, {
                                    value: data.fureur.reaction,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });

                                Object.defineProperty(this.defense.malus, c, {
                                    value: data.fureur.defense,
                                    writable:true,
                                    enumerable:true,
                                    configurable:true
                                });
                            }
                        }
                        break;
                    case 'warlord':
                        if(data?.active?.esquive?.porteur ?? false) {
                            Object.defineProperty(this.reaction.bonus, c, {
                                value: data.impulsions.esquive.bonus.reaction,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.bonus, c, {
                                value: data.impulsions.esquive.bonus.defense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }

                        if(data?.active?.force?.porteur ?? false) {
                            Object.defineProperty(this.champDeForce.bonus, c, {
                                value: data.impulsions.force.bonus.champDeForce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                }
            }
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

    #derived() {
        const list = CONFIG.KNIGHT.LIST.pnj;

        for(let d of list) {
            const system = this[d];
            const base = system.base;
            const bonus = Object.values(system.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const malus = Object.values(system.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

            Object.defineProperty(system, 'mod', {
                value: bonus-malus,
            });

            Object.defineProperty(system, update, {
                value: Math.max(base+this[d].mod, 0),
            });
        }

        // INITIATIVE
        if(this.aspect.masque.majeur > 0) {
            Object.defineProperty(this.initiative, 'base', {
                value: 0,
            });

            Object.defineProperty(this.initiative, 'dice', {
                value: 0,
            });

            Object.defineProperty(this.initiative, 'value', {
                value: 30,
            });
        } else {
            let initiativeDice = this.initiative.diceBase;
            let initiativeBonus = this?.initiative?.bonus?.user ?? 0;
            let initiativeMalus = this?.initiative?.malus?.user ?? 0;

            const hasEmbuscadeSubis = this.options.embuscadeSubis;
            const hasEmbuscadePris = this.options.embuscadePris;

            if(hasEmbuscadeSubis) {
            const bonusDice = this.bonusSiEmbuscade.bonusInitiative.dice;
            const bonusFixe = this.bonusSiEmbuscade.bonusInitiative.fixe;

            initiativeDice += bonusDice;
            initiativeBonus += bonusFixe;
            }

            if(hasEmbuscadePris) {
            initiativeBonus += 10;
            }

            Object.defineProperty(this.initiative, 'base', {
                value: this.initiative.diceBase,
            });

            Object.defineProperty(this.initiative, 'dice', {
                value: Math.max(initiativeDice, 1),
            });

            Object.defineProperty(this.initiative, 'value', {
                value: Math.max(initiativeBonus-initiativeMalus, 0),
            });
        }

        Object.defineProperty(this.initiative, 'complet', {
            value: `${this.initiative.dice}D6+${this.initiative.value}`,
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

    async useNods(type, heal=false) {
        const nod = this.combat.nods[type];

        const nbre = Number(nod.value);
        const dices = nod.dices;
        const wear = this.whatWear;

        if(nbre > 0) {
            const recuperation = this.combat.nods[type].recuperationBonus;
            let update = {}

            if(heal) {
                switch(type) {
                    case 'soin':
                    update['system.sante.value'] = `@{rollTotal}+${this.sante.value}`;
                    break;

                    case 'energie':
                    update[`system.equipements.${wear}.energie.value`] = `@{rollTotal}+${this.energie.value}`;
                    break;

                    case 'armure':
                    update[`system.equipements.${wear}.armure.value`] = `@{rollTotal}+${this.armure.value}`;
                    break;
                }
            }

            update[`system.combat.nods.${type}.value`] = nbre - 1;

            const rNods = new game.knight.RollKnight(this.actor, {
                name:game.i18n.localize(`KNIGHT.JETS.Nods${type}`),
                dices:dices,
                bonus:[recuperation]
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

    // Méthode à surcharger dans les enfants
    _getWeaponHandlers() {
        return {
          armesimprovisees: ({ type, name, num }) => this.useAI(type, name, num),
          grenades: ({ type }) => this.useGrenade(type),
          longbow: () => this.useLongbow(),
        };
    }
}