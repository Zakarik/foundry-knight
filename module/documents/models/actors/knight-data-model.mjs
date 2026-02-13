import {
    getModStyle,
    SortByAddOrder,
    getFlatEffectBonus,
    confirmationDialog,
    capitalizeFirstLetter,
  } from "../../../helpers/common.mjs";
import { BaseActorDataModel } from "../base/base-actor-data-model.mjs";
import { AspectsPCDataModel } from '../parts/aspects-pc-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';

export class KnightDataModel extends BaseActorDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;
        const base = super.defineSchema();
        const specific = {
            wear:new StringField({initial:"tenueCivile"}),
			age:new StringField({ initial: ""}),
			archetype:new StringField({ initial: ""}),
			blason:new StringField({ initial: ""}),
            surnom:new StringField({initial:""}),
            section:new StringField({initial:""}),
            hautFait:new StringField({initial:""}),
            histoire:new HTMLField({initial:""}),
            aspects:new EmbeddedDataField(AspectsPCDataModel),
            defense:new EmbeddedDataField(DefensesDataModel),
            reaction:new EmbeddedDataField(DefensesDataModel),
            egide:new EmbeddedDataField(DefensesDataModel),
            initiative:new EmbeddedDataField(InitiativeDataModel),
            GM:new SchemaField({
                dontshow:new BooleanField({initial:false}),
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
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:50, nullable:false, integer:true}),
                perte:new SchemaField({
                    saufAgonie:new BooleanField({initial:false}),
                }),
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
                recuperation:new SchemaField({
                    aucun:new BooleanField({initial:false}),
                    bonus:new NumberField({initial:0, nullable:false, integer:true}),
                    malus:new NumberField({initial:0, nullable:false, integer:true}),
                }),
                reduction:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            energie:new SchemaField({
                base:new NumberField({ initial: 0, integer: true, nullable: false }),
                mod:new NumberField({ initial: 0, integer: true, nullable: false }),
                max:new NumberField({ initial: 0, integer: true, nullable: false }),
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
			armure: new SchemaField({
                max:new NumberField({ initial: 0, integer: true, nullable: false }),
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
                base:new NumberField({ initial: 0, integer: true, nullable: false }),
                mod:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
			champDeForce: new SchemaField({
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
                base:new NumberField({ initial: 0, integer: true, nullable: false }),
                mod:new NumberField({ initial: 0, integer: true, nullable: false }),
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
            flux:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            equipements:new SchemaField({
                modules:new ObjectField(),
                ia:new SchemaField({
                    code:new StringField({initial:"", nullable:false}),
                    surnom:new StringField({initial:"", nullable:false}),
                    caractere:new StringField({initial:"", nullable:false}),
                }),
                ascension:new SchemaField({
                    armure:new SchemaField({
                        value:new NumberField({initial:0, min:0, nullable:false, integer:true}),
                        base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
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
                    champDeForce:new SchemaField({
                        value:new NumberField({initial:0, min:0, nullable:false, integer:true}),
                        base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
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
                    energie:new SchemaField({
                        base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
                        value:new NumberField({initial:0, min:0, nullable:false, integer:true}),
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
                }),
                guardian:new SchemaField({
                    armure:new SchemaField({
                        value:new NumberField({initial:5, min:0, nullable:false, integer:true}),
                        base:new NumberField({initial:5, min:0, nullable:false, integer:true}),
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
                    champDeForce:new SchemaField({
                        value:new NumberField({initial:5, min:0, nullable:false, integer:true}),
                        base:new NumberField({initial:5, min:0, nullable:false, integer:true}),
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
                    jauges:new SchemaField({
                        armure:new BooleanField({initial:true, nullable:false}),
                        champDeForce:new BooleanField({initial:true, nullable:false}),
                        egide:new BooleanField({initial:false, nullable:false}),
                        energie:new BooleanField({initial:false, nullable:false}),
                        espoir:new BooleanField({initial:true, nullable:false}),
                        heroisme:new BooleanField({initial:true, nullable:false}),
                        sante:new BooleanField({initial:true, nullable:false}),
                    }),
                }),
                tenueCivile:new SchemaField({
                    jauges:new SchemaField({
                        armure:new BooleanField({initial:false, nullable:false}),
                        champDeForce:new BooleanField({initial:false, nullable:false}),
                        egide:new BooleanField({initial:false, nullable:false}),
                        energie:new BooleanField({initial:false, nullable:false}),
                        espoir:new BooleanField({initial:true, nullable:false}),
                        heroisme:new BooleanField({initial:true, nullable:false}),
                        sante:new BooleanField({initial:true, nullable:false}),
                    }),
                }),
                armure:new SchemaField({
                    hasArmor:new BooleanField({initial:false}),
                    hasArmorLegende:new BooleanField({initial:false}),
                    id:new StringField({initial:"0", nullable:true}),
                    idLegende:new StringField({initial:"0", nullable:true}),
                    label:new StringField({initial:"", nullable:true}),
                    armure:new SchemaField({
                        value:new NumberField({initial:0, min:0, nullable:false, integer:true}),
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
                    champDeForce:new SchemaField({
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
                    energie:new SchemaField({
                        value:new NumberField({initial:0, min:0, nullable:false, integer:true}),
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
                    slots:new SchemaField({
                        brasDroit:new NumberField({ initial: 0, integer: true, nullable: false }),
                        brasGauche:new NumberField({ initial: 0, integer: true, nullable: false }),
                        jambeDroite:new NumberField({ initial: 0, integer: true, nullable: false }),
                        jambeGauche:new NumberField({ initial: 0, integer: true, nullable: false }),
                        tete:new NumberField({ initial: 0, integer: true, nullable: false }),
                        torse:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
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
			art: new SchemaField({
                oeuvres:new ObjectField(),
            }),
            combat:new SchemaField({
                armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
                grenades:new EmbeddedDataField(GrenadesDataModel),
                nods:new EmbeddedDataField(NodsDataModel),
                style:new StringField({initial:"standard", nullable:false}),
                styleInfo:new StringField({initial:""}),
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
            combos:new SchemaField({
                bonus:new SchemaField({
                    aspects:new ObjectField(),
                    caracteristiques:new ObjectField(),
                }),
                interdits:new SchemaField({
                    aspects:new ObjectField(),
                    caracteristiques:new ObjectField(),
                }),
            }),
            contacts:new SchemaField({
                actuel:new NumberField({ initial: 1, min:0, integer: true, nullable: false }),
                value:new NumberField({ initial: 1, min:1, integer: true, nullable: false }),
                mod:new NumberField({ initial: 0, integer: true, nullable: false }),
                bonus:new ObjectField({
                    initial:{
                      user:0,
                      system:0,
                    }
                }),
            }),
            heroisme:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            jauges:new SchemaField({
                armure:new BooleanField({initial:false, nullable:false}),
                champDeForce:new BooleanField({initial:false, nullable:false}),
                egide:new BooleanField({initial:false, nullable:false}),
                energie:new BooleanField({initial:false, nullable:false}),
                espoir:new BooleanField({initial:true, nullable:false}),
                heroisme:new BooleanField({initial:true, nullable:false}),
                sante:new BooleanField({initial:true, nullable:false}),
                flux:new BooleanField({initial:true, nullable:false}),
            }),
            langues:new SchemaField({
                value:new NumberField({initial:1, nullable:false, integer:true}),
                mod:new NumberField({initial:0, nullable:false, integer:true}),
                bonus:new ObjectField({
                    initial:{
                      user:0,
                      system:0,
                    }
                }),
            }),
            motivations:new SchemaField({
                majeure:new StringField({initial:"", nullable:false}),
            }),
            options:new SchemaField({
                art:new BooleanField({initial:false, nullable:false}),
                kraken:new BooleanField({initial:false, nullable:false}),
                embuscadeSubis:new BooleanField({initial:false, nullable:false}),
                embuscadePris:new BooleanField({initial:false, nullable:false}),
            }),
            progression:new SchemaField({
                experience:new SchemaField({
                    actuel:new NumberField({initial:0, nullable:false, integer:true}),
                    total:new NumberField({initial:0, nullable:false, integer:true}),
                    depense:new SchemaField({
                        liste:new ObjectField(),
                        total:new NumberField({initial:0, nullable:false, integer:true}),
                    }),
                }),
                gloire:new SchemaField({
                    actuel:new NumberField({initial:0, nullable:false, integer:true}),
                    total:new NumberField({initial:0, nullable:false, integer:true}),
                    depense:new SchemaField({
                        autre:new ObjectField(),
                        liste:new ObjectField(),
                        total:new NumberField({initial:0, nullable:false, integer:true}),
                    }),
                }),
            }),
            bonusSiEmbuscade:new SchemaField({
              bonusInitiative:new SchemaField({
                dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
              }),
            }),
            restrictions:new ObjectField(),
        }

        return foundry.utils.mergeObject(base, specific);
    }

    get armes() {
        return this.items.filter(items => items.type === 'arme');
    }

    get blessures() {
        return this.items.filter(items => items.type === 'blessure');
    }

    get traumas() {
        return this.items.filter(items => items.type === 'trauma');
    }

    get distinctions() {
        return this.items.filter(items => items.type === 'distinction');
    }

    get avantages() {
        return this.items.filter(items => items.type === 'avantage');
    }

    get inconvenients() {
        return this.items.filter(items => items.type === 'inconvenient');
    }

    get modules() {
        return this.items.filter(items => items.type === 'module');
    }

    get dataArmor() {
        return this.items.find(items => items.type === 'armure');
    }

    get capaciteUltime() {
        return this.items.find(items => items.type === 'capaciteultime');
    }

    get dataArmorLegend() {
        return this.items.find(items => items.type === 'armurelegende');
    }

    get armorISwear() {
        const wear = this.dataArmor ? this.wear : 'tenueCivile';

        return wear === 'armure' || wear === 'ascension' ? true : false;
    }

    get whatWear() {
        let wear = this.wear;

        if((wear === 'armure' || wear === 'ascension') && !this.dataArmor) wear = 'tenueCivile'

        return wear;
    }

    get isRemplaceEnergie() {
        let result = false;

        if(this.dataArmor) {
            if(this.dataArmor.system.espoir.remplaceEnergie) result = true;
        }

        return result;
    }

    static migrateData(source) {
        if(source.version < 1) {
            const mods = ['sante', 'reaction', 'defense', 'espoir', 'initiative', 'egide'];
            const equipements = ['ascension', 'guardian', 'armure'];
            const eMods = ['armure', 'champDeForce', 'energie'];

            for(let m of mods) {
                if(!source[m]) continue;

                for(let b in source[m].bonus) {
                    if(b === 'user') continue;
                    source[m].bonus[b] = 0;
                }

                for(let b in source[m].malus) {
                    if(b === 'user') continue;
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

            for(let e of equipements) {
                for(let d of eMods) {
                    if((!source.equipements?.[e]?.bonus?.[d] ?? undefined) || d === 'user') continue;

                    for(let v in source.equipements[e].bonus[d]) {
                        source.equipements[e].bonus[d][v] = 0;
                    }

                    for(let v in source.equipements[e].malus[d]) {
                        source.equipements[e].malus[d][v] = 0;
                    }
                }
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

        this.#checkArmor();
        this.#experience();
        this.#base();
        this.#updateCapacites();
        this.#capacites();
        this.#speciaux();
        this.#blessures();
        this.#traumas();
        this.#armes();
        this.#distinctions();
        this.#style();
        this.#gloire();
	}

	prepareDerivedData() {
        this.#setJauges();
        this.#modules();
        this.#avantages();
        this.#inconvenients();
        this.aspects.prepareData();
        this.#derived();
        this.initiative.prepareData();
        this.#sanitizeValue();
        this._setStatusImmunity();
    }

    #checkArmor() {
        const item = this.dataArmor;

        if(!item && this.armorISwear) {
            Object.defineProperty(this, 'wear', {
                value: 'tenueCivile',
            });
        } else if(item) {
            if(item.system.generation >= 4) {
                Object.defineProperty(this, 'wear', {
                    value: 'armure',
                });
            }
        }
    }

    #setJauges() {
        const wear = this.whatWear;
        let armure = this.jauges.armure || false;
        let champDeForce = this.jauges.champDeForce || false;
        let egide = game.settings.get("knight", "acces-egide") || false;
        let energie = this.jauges.energie || false;
        let espoir = this.jauges.espoir || false;
        let heroisme = this.jauges.heroisme || false;
        let sante = this.jauges.sante || false;
        let flux = this.jauges.flux || false;
        let jauges;

        switch(wear) {
            case 'armure':
            case 'ascension':
                jauges = this.dataArmor.system.jauges;

                armure = jauges?.armure ?? false;
                champDeForce = jauges?.champDeForce ?? false;
                energie = jauges?.energie ?? false;
                espoir = jauges?.espoir ?? false;
                heroisme = jauges?.heroisme ?? false;
                sante = jauges?.sante ?? false;
                flux = jauges?.flux ?? false;

                if(this.dataArmorLegend) {
                    if(this.dataArmorLegend.system?.special?.selected?.recolteflux ?? false) flux = true;
                }
                break;

            case 'tenueCivile':
            case 'guardian':
                jauges = this.equipements[wear].jauges;

                armure = jauges?.armure ?? false;
                champDeForce = jauges?.champDeForce ?? false;
                energie = jauges?.energie ?? false;
                espoir = jauges?.espoir ?? false;
                heroisme = jauges?.heroisme ?? false;
                sante = jauges?.sante ?? false;
                flux = false;
                break;
        }

        Object.defineProperty(this.jauges, 'armure', {
            value: armure,
        });

        Object.defineProperty(this.jauges, 'champDeForce', {
            value: champDeForce,
        });

        Object.defineProperty(this.jauges, 'egide', {
            value: egide,
        });

        Object.defineProperty(this.jauges, 'energie', {
            value: energie,
        });

        Object.defineProperty(this.jauges, 'espoir', {
            value: espoir,
        });

        Object.defineProperty(this.jauges, 'heroisme', {
            value: heroisme,
        });

        Object.defineProperty(this.jauges, 'sante', {
            value: sante,
        });

        Object.defineProperty(this.jauges, 'flux', {
            value: flux,
        });
    }

    #gloire() {
        const armure = this.dataArmor ? this.dataArmor : [];
        const armes = this.armes;
        const modules = this.modules;
        const autres = Object.entries(this.progression.gloire.depense.autre);
        const all = [].concat(armure, armes, modules, autres);
        let list = [];

        for(let g of all) {
            if(g.type === 'armure') {
                const evolutions = armure.system.evolutions.liste;
                const companions = armure.system.evolutions.special?.companions ?? undefined;
                const longbow = armure.system.evolutions.special?.longbow ?? undefined;

                for(let a in evolutions) {
                    if(evolutions[a].applied) {
                        list.push({
                            order:evolutions[a].addOrder,
                            id:g.id,
                            gratuit:false,
                            isArmure:true,
                            value:evolutions[a].value
                        });
                    }
                }

                if(companions) {
                    const listeEvoApplied = companions?.applied?.liste ?? [];

                    for(let n = 0; n < listeEvoApplied.length;n++) {
                        list.push({
                            order:listeEvoApplied[n].addOrder,
                            isArmure:true,
                            value:listeEvoApplied[n].value
                        });
                    }
                }

                if(longbow) {
                    if(longbow['1'].applied) {
                        list.push({
                          id:armure.id,
                          order:longbow['1'].addOrder,
                          name:game.i18n.localize('KNIGHT.PROGRESSION.EvolutionArmure'),
                          isAcheter:true,
                          value:longbow['1']?.gratuit ?? false ? 0 : longbow['1'].value,
                          gratuit:longbow['1']?.gratuit ?? false,
                          evo:1
                        });
                    }

                    if(longbow['2'].applied) {
                        list.push({
                            id:armure.id,
                            order:longbow['2'].addOrder,
                            name:game.i18n.localize('KNIGHT.PROGRESSION.EvolutionArmure'),
                            isAcheter:true,
                            value:longbow['2']?.gratuit ?? false ? 0 : longbow['2'].value,
                            gratuit:longbow['2']?.gratuit ?? false,
                            evo:2
                        });
                    }

                    if(longbow['3'].applied) {
                        list.push({
                            id:armure.id,
                            order:longbow['3'].addOrder,
                            name:game.i18n.localize('KNIGHT.PROGRESSION.EvolutionArmure'),
                            isAcheter:true,
                            value:longbow['3']?.gratuit ?? false ? 0 : longbow['3'].value,
                            gratuit:longbow['3']?.gratuit ?? false,
                            evo:3
                        });
                    }

                    if(longbow['4'].applied) {
                        list.push({
                            id:armure.id,
                            order:longbow['4'].addOrder,
                            name:game.i18n.localize('KNIGHT.PROGRESSION.EvolutionArmure'),
                            isAcheter:true,
                            value:longbow['4']?.gratuit ?? false ? 0 : longbow['4'].value,
                            gratuit:longbow['4']?.gratuit ?? false,
                            evo:4
                        });
                    }
                }

            } else if(g.type === 'arme') {
                const dataProgression = g.system;
                const gratuit = dataProgression?.gratuit || false;

                list.push({
                    order:g.system.addOrder,
                    id:g._id,
                    name:g.name,
                    gratuit:gratuit || false,
                    value:gratuit ? 0 : dataProgression?.prix ?? 0,
                })
            } else if(g.type === 'module') {
                if(g.system.isLion) continue;

                for(let n = 1;n <= g.system.niveau.value;n++) {
                    const dataProgression = g.system.niveau.details[`n${n}`];

                    if(!dataProgression.ignore) {
                        const gratuit = dataProgression?.gratuit || false;
                        const name = g.system.niveau.value > 1 ? `${g.name} - ${game.i18n.localize('KNIGHT.ITEMS.MODULE.Niveau')} ${n}` : `${g.name}`;

                        list.push({
                            order:dataProgression.addOrder ? dataProgression.addOrder : g.system.addOrder,
                            name:name,
                            id:g._id,
                            gratuit:gratuit || false,
                            value:gratuit ? 0 : dataProgression?.prix ?? 0,
                            niveau:n,
                            isModule:true
                        });
                    }
                }
            } else {
                list.push({
                    order:Number(g[1].order),
                    name:g[1].nom,
                    id:g[0],
                    gratuit:g[1].gratuit,
                    value:g[1]?.cout ?? 0,
                    isAutre:true
                });
            }
        }

        list.sort(SortByAddOrder);

        Object.defineProperty(this.progression.gloire.depense, 'liste', {
            value: list,
        });
    }

    #experience() {
        const item = this.progression.experience.depense.liste;
        let bonus = {
            chair:0,
            bete:0,
            machine:0,
            dame:0,
            masque:0,
            deplacement:0,
            force:0,
            endurance:0,
            combat:0,
            hargne:0,
            instinct:0,
            tir:0,
            savoir:0,
            technique:0,
            parole:0,
            aura:0,
            sangFroid:0,
            discretion:0,
            dexterite:0,
            perception:0,
        };


        for(let p in item) {
            const carac = item[p].caracteristique;

            if(carac) bonus[carac] += parseInt(item[p].bonus);
            else if(item[p] !== 'autre' && item[p] !== '') bonus[item[p].nom] += parseInt(item[p].bonus);
        }

        for(let b in bonus) {
            const path = this._getAspectPath(b);
            if(!path) continue;

            Object.defineProperty(path.bonus, 'experience', {
                value: bonus[b],
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #base() {
        const wear = this.whatWear;
        let armure = 0;
        let cdf = 0;
        let energie = 0;
        let espoir = 0;
        let egide = 0;

        switch(wear) {
            case 'armure':
            case 'ascension':
                const data = this.dataArmor.system;
                const overdrive = data.overdrives;

                armure = data.armure.base;
                cdf = data.champDeForce.base;
                energie = data.energie.base;
                espoir = data.espoir.value;
                egide = data.egide.value;

                for(let o in overdrive) {
                    for(let c in overdrive[o].liste) {
                        Object.defineProperty(this.aspects[o].caracteristiques[c].overdrive, 'base', {
                            value: overdrive[o].liste[c].value,
                        });
                    }
                }
                break;

            case 'tenueCivile':
            case 'guardian':
                armure = this.equipements[this.wear]?.armure?.base ?? 0;
                energie = this.equipements[this.wear]?.energie?.base ?? 0;
                cdf = this.equipements[this.wear]?.champDeForce?.base ?? 0;
                break;
        }

        Object.defineProperty(this.heroisme, 'max', {
            value: 6,
        });

        Object.defineProperty(this.armure, 'base', {
            value: armure,
        });

        Object.defineProperty(this.energie, 'base', {
            value: energie,
        });

        Object.defineProperty(this.champDeForce, 'base', {
            value: cdf,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.espoir.bonus, 'armure', {
            value: espoir,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.egide.bonus, 'armure', {
            value: egide,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    #derived() {
        const wear = this.whatWear;

        for (const aspect in this.aspects) {
            let maxCarac = Object.values(this.aspects[aspect].caracteristiques).reduce((acc, curr) => {
                const valeurTotale = this.armorISwear ? curr.value + curr.overdrive.value : curr.value;
                return valeurTotale > acc ? valeurTotale : acc;
            }, 0);
            let maxCaracWOD = Object.values(this.aspects[aspect].caracteristiques).reduce((acc, curr) => {
                const valeurTotale = curr.value;
                return valeurTotale > acc ? valeurTotale : acc;
            }, 0);

            let bonus;
            let malus;
            let base;
            let mod;

            switch(aspect) {
                case 'chair':
                    bonus = Object.values(this.sante.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                    malus = Object.values(this.sante.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                    base = 0;
                    mod = 0;

                    if(this.options.kraken) base = 8;
                    else base = 6;

                    Object.defineProperty(this.sante, 'base', {
                        value: (base*maxCaracWOD)+10,
                    });

                    mod += bonus-malus;

                    if(this.armorISwear && this.aspects.chair.caracteristiques.endurance.overdrive.value >= 3) mod += 6;

                    if(this.capaciteUltime && this.armorISwear) {
                        if(this.capaciteUltime.type === 'passive' && this.capaciteUltime.passive.sante) mod += Math.floor((this.sante.base+mod)/2);
                    }

                    Object.defineProperty(this.sante, 'mod', {
                        value: mod,
                    });

                    Object.defineProperty(this.sante, 'max', {
                        value: this.sante.base+this.sante.mod,
                    });
                    break;

                case 'bete':
                    // DEFENSE
                    base = maxCarac;
                    base += this.options.kraken ? 1 : 0;
                    bonus = Object.values(this.defense.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                    malus = Object.values(this.defense.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

                    Object.defineProperty(this.defense, 'base', {
                        value: base,
                    });

                    if(this.armorISwear && this.aspects.dame.caracteristiques.aura.overdrive.value >= 5) bonus += this.aspects.dame.caracteristiques.aura.value;

                    Object.defineProperty(this.defense, 'mod', {
                        value: bonus-malus,
                    });

                    Object.defineProperty(this.defense, 'value', {
                        value: Math.max(this.defense.base+this.defense.mod, 0),
                    });

                    Object.defineProperty(this.defense, 'valueWOMod', {
                        value: this.defense.base + bonus,
                    });

                    Object.defineProperty(this.defense, 'malustotal', {
                        value: malus,
                    });

                    break;

                case 'machine':
                    // REACTION
                    let isWatchtower = false;
                    if(this.dataArmor) isWatchtower = this.dataArmor?.system?.capacites?.selected?.watchtower?.active ?? false;

                    base = maxCarac;
                    base += this.options.kraken ? 1 : 0;
                    bonus = Object.values(this.reaction.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                    malus = Object.values(this.reaction.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

                    Object.defineProperty(this.reaction, 'base', {
                        value: base,
                    });

                    Object.defineProperty(this.reaction, 'mod', {
                        value: bonus-malus,
                    });

                    Object.defineProperty(this.reaction, 'value', {
                        value: isWatchtower ? Math.floor((this.reaction.base+this.reaction.mod)/2) : Math.max(this.reaction.base+this.reaction.mod, 0),
                    });

                    Object.defineProperty(this.reaction, 'valueWOMod', {
                        value: this.reaction.base + bonus,
                    });

                    Object.defineProperty(this.reaction, 'malustotal', {
                        value: malus,
                    });

                    Object.defineProperty(this.reaction, 'iswatchtower', {
                        value: isWatchtower,
                    });
                    break;

                case 'dame':
                    // CONTACTS
                    const contactBonus = Object.values(this.contacts.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

                    base = maxCaracWOD;
                    bonus = this.contacts.mod;

                    if(this.wear === 'armure' && this.capaciteUltime) {
                        if(this.capaciteUltime.system.passives.contact.active && this.capaciteUltime.system.type === 'passive') bonus += this.capaciteUltime.contact.value;
                    }

                    Object.defineProperty(this.contacts, 'value', {
                        value: Math.max(base+bonus+contactBonus, 0),
                    });
                    break;

                case 'masque':
                    bonus = Object.values(this.initiative.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                    malus = Object.values(this.initiative.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
                    base = 0;
                    mod = 0;

                    Object.defineProperty(this.initiative, 'base', {
                        value: maxCarac,
                    });

                    mod += bonus-malus;

                    if(this.armorISwear && this.aspects.bete.caracteristiques.instinct.overdrive.value >= 3) mod += this.aspects.bete.caracteristiques.instinct.overdrive.value*3;

                    if(this.options.embuscadeSubis) {
                        Object.defineProperty(this.initiative, 'diceMod', {
                            value: this.bonusSiEmbuscade.bonusInitiative.dice,
                        });

                        mod += this.bonusSiEmbuscade.bonusInitiative.fixe;
                    }

                    if(this.options.embuscadePris) {
                        mod += 10;
                    }

                    Object.defineProperty(this.initiative, 'mod', {
                        value: mod,
                    });
                    break;
            }
        }

        // LANGUES
        const langueBonus = Object.values(this.langues.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        Object.defineProperty(this.langues, 'value', {
            value: Math.max(Math.max(this.aspects.machine.caracteristiques.savoir.value-1, 1)+this.langues.mod+langueBonus, 0),
        });

        // ARMURE
        const armureBonus = Object.values(this.equipements[wear]?.armure?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const armureMalus = Object.values(this.equipements[wear]?.armure?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        Object.defineProperty(this.armure, 'mod', {
            value: armureBonus-armureMalus,
        });

        Object.defineProperty(this.armure, 'max', {
            value: this.armure.base+this.armure.mod,
        });

        Object.defineProperty(this.armure, 'value', {
            value: Math.min(this.equipements[this.wear]?.armure?.value ?? 0, this.armure.max),
        });

        // ENERGIE
        const energieBonus = Object.values(this.equipements[wear]?.energie?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const energieMalus = Object.values(this.equipements[wear]?.energie?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        Object.defineProperty(this.energie, 'mod', {
            value: energieBonus-energieMalus,
        });

        Object.defineProperty(this.energie, 'max', {
            value: this.energie.base+this.energie.mod,
        });

        Object.defineProperty(this.energie, 'value', {
            value: Math.min(this.equipements[this.wear]?.energie?.value ?? 0, this.energie.max),
        });

        // CHAMP DE FORCE
        const CDFBonus = Object.values(this.equipements[wear]?.champDeForce?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const CDFMalus = Object.values(this.equipements[wear]?.champDeForce?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        Object.defineProperty(this.champDeForce, 'mod', {
            value: CDFBonus-CDFMalus,
        });

        Object.defineProperty(this.champDeForce, 'value', {
            value: Math.max(this.champDeForce.base+this.champDeForce.mod, 0),
        });

        // ESPOIR
        let espoirBase = 50;
        const espoirBonus = Object.values(this.espoir.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const espoirMalus = Object.values(this.espoir.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        if(this.armorISwear) {
            const dataArmor = this.dataArmor?.system;
            if(dataArmor?.special?.selected?.plusespoir?.espoir?.base ?? undefined) espoirBase = dataArmor.special.selected.plusespoir.espoir.base;
        }

        Object.defineProperty(this.espoir, 'base', {
            value: espoirBase,
        });

        Object.defineProperty(this.espoir, 'mod', {
            value: espoirBonus-espoirMalus,
        });

        Object.defineProperty(this.espoir, 'max', {
            value: Math.max(this.espoir.base+this.espoir.mod, 0),
        });

        if(this.espoir.value > this.espoir.max) {
            this.actor.update({['system.espoir.value']:this.espoir.max})
        }

        //EGIDE
        const egideBonus = Object.values(this.egide.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const egideMalus = Object.values(this.egide.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        Object.defineProperty(this.egide, 'mod', {
            value: egideBonus-egideMalus,
        });

        Object.defineProperty(this.egide, 'value', {
            value: Math.max(this.egide.base+this.egide.mod, 0),
        });

        // PG
        const PGProgression = this.progression.gloire;
        const PGDepense = PGProgression.depense.liste;

        let PGTotalDepense = 0;

        for(let PG in PGDepense) {
            if(!PGDepense[PG].isArmure) PGTotalDepense += parseInt(PGDepense[PG].value);
        }

        Object.defineProperty(this.progression.gloire.depense, 'total', {
            value: PGTotalDepense,
        });

        Object.defineProperty(this.progression.gloire, 'actuel', {
            value: this.progression.gloire.total-this.progression.gloire.depense.total,
        });

        // XP
        const XPProgression = this.progression.experience;
        const XPDepense = XPProgression.depense.liste;
        let PXTotalDepense = 0;

        for(let XP in XPDepense) {
            PXTotalDepense += XPDepense[XP].cout;
        }

        Object.defineProperty(this.progression.experience.depense, 'total', {
            value: PXTotalDepense,
        });

        Object.defineProperty(this.progression.experience, 'actuel', {
            value: this.progression.experience.total-this.progression.experience.depense.total,
        });

        // BONUS D'OD INSTINCT 3
        if(this.armorISwear && this.aspects.bete.caracteristiques.instinct.overdrive.value >= 3) {
            Object.defineProperty(this.initiative.bonus, 'od', {
                value: 3*this.aspects.bete.caracteristiques.instinct.overdrive.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #modules() {
        const armure = this.dataArmor;
        const data = this.modules;

        const tete = data.reduce((acc, curr) => curr.system.isLion ? acc : acc + (Number(curr.system.slots.tete) || 0), 0);
        const torse = data.reduce((acc, curr) => curr.system.isLion ? acc : acc + (Number(curr.system.slots.torse) || 0), 0);
        const brasDroit = data.reduce((acc, curr) => curr.system.isLion ? acc : acc + (Number(curr.system.slots.brasDroit) || 0), 0);
        const brasGauche = data.reduce((acc, curr) => curr.system.isLion ? acc : acc + (Number(curr.system.slots.brasGauche) || 0), 0);
        const jambeDroite = data.reduce((acc, curr) => curr.system.isLion ? acc : acc + (Number(curr.system.slots.jambeDroite) || 0), 0);
        const jambeGauche = data.reduce((acc, curr) => curr.system.isLion ? acc : acc + (Number(curr.system.slots.jambeGauche) || 0), 0);

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

        let baseOverdrives = {
            bete:{
                combat:[armure?.system?.overdrives?.bete?.liste?.combat?.value ?? 0],
                hargne:[armure?.system?.overdrives?.bete?.liste?.hargne?.value ?? 0],
                instinct:[armure?.system?.overdrives?.bete?.liste?.instinct?.value ?? 0],
            },
            chair:{
                deplacement:[armure?.system?.overdrives?.chair?.liste?.deplacement?.value ?? 0],
                force:[armure?.system?.overdrives?.chair?.liste?.force?.value ?? 0],
                endurance:[armure?.system?.overdrives?.chair?.liste?.endurance?.value ?? 0],
            },
            dame:{
                aura:[armure?.system?.overdrives?.dame?.liste?.aura?.value ?? 0],
                parole:[armure?.system?.overdrives?.dame?.liste?.parole?.value ?? 0],
                sangFroid:[armure?.system?.overdrives?.dame?.liste?.sangFroid?.value ?? 0],
            },
            machine:{
                tir:[armure?.system?.overdrives?.machine?.liste?.tir?.value ?? 0],
                savoir:[armure?.system?.overdrives?.machine?.liste?.savoir?.value ?? 0],
                technique:[armure?.system?.overdrives?.machine?.liste?.technique?.value ?? 0],
            },
            masque:{
                discretion:[armure?.system?.overdrives?.masque?.liste?.discretion?.value ?? 0],
                dexterite:[armure?.system?.overdrives?.masque?.liste?.dexterite?.value ?? 0],
                perception:[armure?.system?.overdrives?.masque?.liste?.perception?.value ?? 0],
            },
        }

        let bonusOverdrives = {
            bete:{
                combat:0,
                hargne:0,
                instinct:0,
            },
            chair:{
                deplacement:0,
                force:0,
                endurance:0,
            },
            dame:{
                aura:0,
                parole:0,
                sangFroid:0,
            },
            machine:{
                tir:0,
                savoir:0,
                technique:0,
            },
            masque:{
                discretion:0,
                dexterite:0,
                perception:0,
            },
        }

        Object.defineProperty(this.equipements.armure.slots, 'tete', {
            value: tete,
        });

        Object.defineProperty(this.equipements.armure.slots, 'torse', {
            value: torse,
        });

        Object.defineProperty(this.equipements.armure.slots, 'brasDroit', {
            value: brasDroit,
        });

        Object.defineProperty(this.equipements.armure.slots, 'brasGauche', {
            value: brasGauche,
        });

        Object.defineProperty(this.equipements.armure.slots, 'jambeDroite', {
            value: jambeDroite,
        });

        Object.defineProperty(this.equipements.armure.slots, 'jambeGauche', {
            value: jambeGauche,
        });

        if(this.armorISwear) {
            const dataArmure = this.dataArmor;
            const actuel = data.filter(itm => (itm.system.active.base && (!itm.system?.isLion ?? false)) || ((itm.system?.niveau?.actuel?.permanent ?? false) && (!itm.system?.isLion ?? false)));
            let specialRaw = [];
            let specialCustom = [];

            if(dataArmure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(dataArmure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(dataArmure.system.special.selected.porteurlumiere.bonus.effets.custom)
            }

            for(let m of actuel) {
                const system = m.system?.niveau?.actuel ?? {};
                const effets = system?.effets ?? {has:false};
                const bonus = system?.bonus || {has:false};
                const arme = system?.arme || {has:false};
                const overdrives = system?.overdrives || {has:false};

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
                    const bOverdrives = bonus?.overdrives?.has ?? false;

                    if(bSante) santeBonus += bonus?.sante?.value ?? 0;
                    if(bArmure) armureBonus += bonus?.armure?.value ?? 0;
                    if(bChampDeForce) champDeForceBonus += bonus?.champDeForce?.value ?? 0;
                    if(bEnergie) energieBonus += bonus?.energie?.value ?? 0;
                    if(bOverdrives) {
                        for(let o in bonus.overdrives.aspects) {
                            for(let c in bonus.overdrives.aspects[o]) {
                                bonusOverdrives[o][c] += bonus.overdrives.aspects[o][c];
                            }
                        }
                    }
                }

                if(arme.has) {
                    let tempArme = arme;
                    tempArme.system = {
                        type:arme.type,
                        effets:arme.effets,
                        distance:arme.distance,
                        structurelles:arme.structurelles,
                        ornementales:arme.ornementales,
                    };
                    tempArme.system.effets.raw = arme.effets.raw.concat(specialRaw);
                    tempArme.system.effets.custom = arme.effets.custom.concat(specialCustom);
                    const armeEffets = getFlatEffectBonus(tempArme, true);

                    defenseBonus += armeEffets.defense.bonus;
                    defenseMalus += armeEffets.defense.malus;

                    reactionBonus += armeEffets.reaction.bonus;
                    reactionMalus += armeEffets.reaction.malus;

                    champDeForceBonus += armeEffets.cdf.bonus;
                }

                if(overdrives.has) {
                    for(let o in overdrives.aspects) {
                        for(let c in overdrives.aspects[o]) {
                            baseOverdrives[o][c].push(overdrives.aspects[o][c]);
                        }
                    }
                }
            }

            Object.defineProperty(this.sante.bonus, 'modules', {
                value: santeBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.sante.malus, 'modules', {
                value: santeMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.equipements[this.wear].armure.bonus, 'modules', {
                value: armureBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.equipements[this.wear].armure.malus, 'modules', {
                value: armureMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, 'modules', {
                value: champDeForceBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.equipements[this.wear].champDeForce.malus, 'modules', {
                value: champDeForceMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.equipements[this.wear].energie.bonus, 'modules', {
                value: energieBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.equipements[this.wear].energie.malus, 'modules', {
                value: energieMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.defense.bonus, 'modules', {
                value: defenseBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.defense.malus, 'modules', {
                value: defenseMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.reaction.bonus, 'modules', {
                value: reactionBonus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            Object.defineProperty(this.reaction.malus, 'modules', {
                value: reactionMalus,
                writable:true,
                enumerable:true,
                configurable:true
            });

            for(let o in bonusOverdrives) {
                for(let c in bonusOverdrives[o]) {
                    if(bonusOverdrives[o][c] > 0) {
                        Object.defineProperty(this.aspects[o].caracteristiques[c].overdrive.bonus, 'module', {
                            value: bonusOverdrives[o][c],
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                }
            }
        }


        for(let o in baseOverdrives) {
            for(let c in baseOverdrives[o]) {
                Object.defineProperty(this.aspects[o].caracteristiques[c].overdrive, 'base', {
                    value: this.armorISwear ? Math.max(...baseOverdrives[o][c]) : 0,
                });
            }
        }
    }

    #avantages() {
        const avantages = this.avantages.filter(itm => itm.system.type === 'standard');
        let sante = 0;
        let espoir = 0;
        let recuperationEspoir = 0;
        let recuperationSante = 0;
        let recuperationArmure = 0;
        let recuperationEnergie = 0;
        let initiativeDice = 0;
        let initiativeFixe = 0;
        let initiativeEmbuscadeDice = 0;
        let initiativeEmbuscadeFixe = 0;


        for(let a of avantages) {
            const bonus = a.system.bonus;

            if(bonus.sante > 0) sante += bonus.sante;
            if(bonus.espoir > 0) espoir += bonus.espoir;
            if(bonus.recuperation.sante > 0) recuperationSante += parseInt(bonus.recuperation.sante);
            if(bonus.recuperation.espoir > 0) recuperationEspoir += parseInt(bonus.recuperation.espoir);
            if(bonus.recuperation.armure > 0) recuperationArmure += parseInt(bonus.recuperation.armure);
            if(bonus.recuperation.energie > 0) recuperationEnergie += parseInt(bonus.recuperation.energie);
            if(bonus.initiative.dice > 0) initiativeDice += bonus.initiative.dice;
            if(bonus.initiative.fixe > 0) initiativeFixe += bonus.initiative.fixe;
            if(bonus.initiative.ifEmbuscade.dice > 0 && bonus.initiative.ifEmbuscade.has) initiativeEmbuscadeDice += bonus.initiative.ifEmbuscade.dice;
            if(bonus.initiative.ifEmbuscade.fixe > 0 && bonus.initiative.ifEmbuscade.has) initiativeEmbuscadeFixe += bonus.initiative.ifEmbuscade.fixe;
        }

        if(sante > 0) {
            Object.defineProperty(this.sante.bonus, 'avantages', {
                value: sante,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(espoir > 0) {
            Object.defineProperty(this.espoir.bonus, 'avantages', {
                value: espoir,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(recuperationEspoir > 0) {
            Object.defineProperty(this.espoir.recuperation, 'bonus', {
                value: parseInt(recuperationEspoir),
            });
        }

        Object.defineProperty(this.combat.nods.soin, 'recuperationBonus', {
            value: parseInt(recuperationSante),
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.combat.nods.armure, 'recuperationBonus', {
            value: parseInt(recuperationArmure),
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.combat.nods.energie, 'recuperationBonus', {
            value: parseInt(recuperationEnergie),
            writable:true,
            enumerable:true,
            configurable:true
        });

        if(initiativeDice > 0) {
            Object.defineProperty(this.initiative.diceBonus, 'avantages', {
                value: initiativeDice,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(initiativeFixe > 0) {
            Object.defineProperty(this.initiative.bonus, 'avantages', {
                value: initiativeFixe,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(initiativeEmbuscadeDice > 0) {
            Object.defineProperty(this.initiative.embuscade.diceBonus, 'avantages', {
                value: initiativeEmbuscadeDice,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(initiativeEmbuscadeFixe > 0) {
            Object.defineProperty(this.initiative.embuscade.bonus, 'avantages', {
                value: initiativeEmbuscadeFixe,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #inconvenients() {
        const inconvenients = this.inconvenients.filter(itm => itm.system.type === 'standard');
        let sante = 0;
        let espoir = 0;
        let recuperationEspoir = 0;
        let initiativeDice = 0;
        let initiativeFixe = 0;
        let aucunGainEspoir = false;
        let aspects = []

        for(let i of inconvenients) {
            const malus = i.system.malus;

            if(malus.sante > 0) sante += malus.sante;
            if(malus.espoir > 0) espoir += malus.espoir;
            if(malus.recuperation.espoir > 0) recuperationEspoir += malus.recuperation.espoir;
            if(malus.initiative.dice > 0) initiativeDice += malus.initiative.dice;
            if(malus.initiative.fixe > 0) initiativeFixe += malus.initiative.fixe;
            if(i.system.limitations.espoir.aucunGain) aucunGainEspoir = i.system.limitations.espoir.aucunGain;

            for(let a in i.system.limitations.aspects) {
                if(i.system.limitations.aspects[a].has) aspects.push({
                    key:a,
                    value:i.system.limitations.aspects[a].value
                });
            }
        }

        if(sante > 0) {
            Object.defineProperty(this.sante.malus, 'inconvenients', {
                value: sante,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(espoir > 0) {
            Object.defineProperty(this.espoir.malus, 'inconvenients', {
                value: espoir,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(recuperationEspoir > 0) {
            Object.defineProperty(this.espoir.recuperation, 'malus', {
                value: recuperationEspoir,
            });
        }

        if(initiativeDice > 0) {
            Object.defineProperty(this.initiative.diceMalus, 'inconvenients', {
                value: initiativeDice,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(initiativeFixe > 0) {
            Object.defineProperty(this.initiative.malus, 'inconvenients', {
                value: initiativeFixe,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(aucunGainEspoir) {
            Object.defineProperty(this.espoir.recuperation, 'aucun', {
                value: aucunGainEspoir
            });
        }

        for(let a of aspects) {
            switch(a.key) {
                case 'all':
                    Object.defineProperty(this.aspects.chair, 'max', {
                        value: a.value,
                    });

                    Object.defineProperty(this.aspects.bete, 'max', {
                        value: a.value,
                    });

                    Object.defineProperty(this.aspects.machine, 'max', {
                        value: a.value,
                    });

                    Object.defineProperty(this.aspects.dame, 'max', {
                        value: a.value,
                    });

                    Object.defineProperty(this.aspects.masque, 'max', {
                        value: a.value,
                    });
                    break;

                default:
                    Object.defineProperty(this.aspects[a.key], 'max', {
                        value: a.value,
                    });
                    break;
            }
        }
    }

    #updateCapacites() {
        const armor = this.dataArmor;
        const capaciteUltime = this.capaciteUltime;

        if(!capaciteUltime) return;

        if(capaciteUltime.system.type !== 'passive') return;

        const dataCUCapacites = capaciteUltime.system.passives.capacites;
        const dataCUSpecial = capaciteUltime.system.passives.special;

        for(let c in dataCUCapacites) {
            if(c === 'actif') continue;

            let data = dataCUCapacites[c];
            let capaciteSelected = armor?.system?.capacites?.selected?.[c] ?? undefined;

            if(data.actif !== true || !capaciteSelected) continue;

            capaciteSelected = foundry.utils.mergeObject(capaciteSelected, data.update);
        }

        for(let s in dataCUSpecial) {
            let data = dataCUSpecial[s];
            let specialSelected = armor?.system?.special?.selected?.[s] ?? undefined;

            if(!specialSelected) continue;

            switch(s) {
                case 'contrecoups':
                    specialSelected.unactif = data.actif;
                    break;

                default:
                    specialSelected = foundry.utils.mergeObject(specialSelected, data.update);
                    break;
            }
        }
    }

    #capacites() {
        if(this.armorISwear && this.dataArmor) {
            const capacites = this.dataArmor.system.capacites.selected;
            const whatAffect = this.isRemplaceEnergie ? this.espoir : this.equipements[this.wear].energie;

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
                        } else {
                            Object.defineProperty(whatAffect.malus, c, {
                                value: 0,
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
                        } else {
                            Object.defineProperty(whatAffect.malus, c, {
                                value: 0,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'shrine':
                        if(data.active && (data?.active?.personnel ?? false)) {
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
                                value: data.champdeforce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'goliath':
                        if(data.active) {
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
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
                        } else {
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
                                value: 0,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.reaction.malus, c, {
                                value: 0,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.malus, c, {
                                value: 0,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'morph':
                        if(data?.choisi?.metal ?? false) {
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
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

                        if(data?.choisi?.polymorphie) {
                            if(data?.active?.polymorphieGriffe) {
                                const griffeFlatBonus = getFlatEffectBonus(
                                    data.polymorphie.griffe,
                                    true
                                );

                                this.applyFlatEffectBonus('griffe', griffeFlatBonus);
                            }

                            if(data?.active?.polymorphieGriffe2) {
                                const griffe2FlatBonus = getFlatEffectBonus(
                                    data.polymorphie.griffe,
                                    true,
                                    true
                                );

                                this.applyFlatEffectBonus('griffe2', griffe2FlatBonus);
                            }

                            if(data?.active?.polymorphieLame) {
                                const lameFlatBonus = getFlatEffectBonus(
                                    data.polymorphie.lame,
                                    true
                                );

                                this.applyFlatEffectBonus('lame', lameFlatBonus);
                            }

                            if(data?.active?.polymorphieLame2) {
                                const lame2FlatBonus = getFlatEffectBonus(
                                    data.polymorphie.lame,
                                    true,
                                    true
                                );

                                this.applyFlatEffectBonus('lame2', lame2FlatBonus);
                            }

                            if(data?.active?.polymorphieCanon) {
                                const canonFlatBonus = getFlatEffectBonus(
                                    data.polymorphie.canon,
                                    true
                                );

                                this.applyFlatEffectBonus('canon', canonFlatBonus);
                            }

                            if(data?.active?.polymorphieCanon2) {
                                const canon2FlatBonus = getFlatEffectBonus(
                                    data.polymorphie.canon,
                                    true,
                                    true
                                );

                                this.applyFlatEffectBonus('canon2', canon2FlatBonus);
                            }
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
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
                                value: data.impulsions.force.bonus.champDeForce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'type':
                        for(let c in data.type) {
                            if(data.type[c].conflit || data.type[c].horsconflit) {
                                for(let a in data.type[c].liste) {
                                    Object.defineProperty(this._getAspectPath(a).overdrive.bonus, 'capacites', {
                                        value: data.type[c].liste[a].value,
                                        writable:true,
                                        enumerable:true,
                                        configurable:true
                                    });
                                }
                            }
                        }
                        break;
                    case 'longbow':
                        const longbowFlatBonus = getFlatEffectBonus({
                            type:'distance',
                            effets:data.effets.base
                        }, true);

                        this.applyFlatEffectBonus('longbow', longbowFlatBonus);
                        break;

                    case 'borealis':
                        const borealisFlatBonus = getFlatEffectBonus({
                            type:'distance',
                            effets:data.offensif.effets
                        }, true);

                        this.applyFlatEffectBonus('borealis', borealisFlatBonus);
                        break;

                    case 'cea':
                        const ceaRayonFlatBonus = getFlatEffectBonus({
                            type:'distance',
                            effets:data.rayon.effets
                        }, true);
                        const ceaSalveFlatBonus = getFlatEffectBonus({
                            type:'distance',
                            effets:data.salve.effets
                        }, true);
                        const ceaVagueFlatBonus = getFlatEffectBonus({
                            type:'distance',
                            effets:data.vague.effets
                        }, true);

                        this.applyFlatEffectBonus('ceaRayon', ceaRayonFlatBonus);
                        this.applyFlatEffectBonus('ceaSalve', ceaSalveFlatBonus);
                        this.applyFlatEffectBonus('ceaVague', ceaVagueFlatBonus);
                        break;
                }
            }
        }

        if(this.armorISwear && this.dataArmorLegend) {
            const capacites = this.dataArmorLegend.system.capacites.selected;
            const whatAffect = this.isRemplaceEnergie ? this.espoir : this.equipements[this.wear].energie;

            //ON CHECK TOUTES LES CAPACITES POUR APPLIQUER LES EFFETS DES CAPACITES ACTIVES
            for(let c in capacites) {
                const data = capacites[c];

                switch(c) {
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
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
                                value: data.champdeforce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'goliath':
                        if(data.active) {
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
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
                            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, c, {
                                value: data.impulsions.force.bonus.champDeForce,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                        break;
                    case 'type':
                        for(let c in data.type) {
                            if(data.type[c].conflit || data.type[c].horsconflit) {
                                for(let a in data.type[c].liste) {
                                    Object.defineProperty(this._getAspectPath(a).overdrive.bonus, 'capacites', {
                                        value: data.type[c].liste[a].value,
                                        writable:true,
                                        enumerable:true,
                                        configurable:true
                                    });
                                }
                            }
                        }
                        break;
                }
            }
        }

        if(this.armorISwear && this.capaciteUltime) {
            const capacites = this.capaciteUltime;

            if(capacites.system.type === 'active' && !capacites.system.actives.instant && capacites.system.active) {
                Object.defineProperty(this.reaction.bonus, 'capaciteUltime', {
                    value: capacites.system.actives.reaction,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });

                Object.defineProperty(this.defense.bonus, 'capaciteUltime', {
                    value: capacites.system.actives.defense,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }
        }
    }

    #speciaux() {
        if(this.armorISwear) {
            const speciaux = this.dataArmor.system.special.selected;

            if(speciaux.apeiron) {
                Object.defineProperty(this.espoir.bonus, 'apeiron', {
                    value: speciaux.apeiron.espoir.bonus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(speciaux.plusespoir) {
                Object.defineProperty(this.espoir.perte, 'saufAgonie', {
                    value: !speciaux.plusespoir.espoir.perte.value ? true : false,
                });

                if(!speciaux.plusespoir.espoir.perte.value) {
                    Object.defineProperty(this.espoir.recuperation, 'aucun', {
                        value: true
                    });
                }
            }
        }
    }

    #style() {
        const style = this.combat.style;
        const data = getModStyle(style);

        Object.defineProperty(this.combat, 'styleInfo', {
            value: game.i18n.localize(CONFIG.KNIGHT.styles[style]),
        });

        Object.defineProperty(this.reaction.bonus, 'style', {
            value: data.bonus.reaction,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.reaction.malus, 'style', {
            value: data.malus.reaction,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.defense.bonus, 'style', {
            value: data.bonus.defense,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.defense.malus, 'style', {
            value: data.malus.defense,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    #blessures() {
        const blessures = this.blessures;
        let espoir = 0;
        let aspects = []
        let caracteristiques = [];

        for(let b of blessures) {
            const system = b.system;

            if(system.soigne.implant) {
                espoir += 3;
            }

            if(system.soigne.implant || system.soigne.reconstruction) continue;

            for(let a in system.aspects) {
                if(system.aspects[a].value > 0) {
                    aspects.push({
                        key:a,
                        value:system.aspects[a].value,
                    });
                }

                for(let c in system.aspects[a].caracteristiques) {
                    if(system.aspects[a].caracteristiques[c].value > 0) {
                        caracteristiques.push({
                            key:c,
                            value:system.aspects[a].caracteristiques[c].value,
                        });
                    }
                }
            }
        }

        Object.defineProperty(this.espoir.malus, 'blessures', {
            value: espoir,
            writable:true,
            enumerable:true,
            configurable:true
        });

        for(let a of aspects) {
            Object.defineProperty(this.aspects[a.key].malus, 'blessures', {
                value: a.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        for(let c of caracteristiques) {
            Object.defineProperty(this._getAspectPath(c.key).malus, 'blessures', {
                value: c.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #traumas() {
        const traumas = this.traumas;
        let aspects = []
        let caracteristiques = [];

        for(let t of traumas) {
            const system = t.system;

            for(let a in system.aspects) {
                if(system.aspects[a].value > 0) {
                    aspects.push({
                        key:a,
                        value:system.aspects[a].value,
                    });
                }

                for(let c in system.aspects[a].caracteristiques) {
                    if(system.aspects[a].caracteristiques[c].value > 0) {
                        caracteristiques.push({
                            key:c,
                            value:system.aspects[a].caracteristiques[c].value,
                        });
                    }
                }
            }
        }

        for(let a of aspects) {
            Object.defineProperty(this.aspects[a.key].malus, 'traumas', {
                value: a.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        for(let c of caracteristiques) {
            Object.defineProperty(this._getAspectPath(c.key).malus, 'traumas', {
                value: c.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #armes() {
        const wear = this.whatWear;
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

        if(champDeForce > 0 && (wear === 'guardian' || this.armorISwear)) {
            if(this.equipements[wear]?.champDeForce?.bonus) {
                Object.defineProperty(this.equipements[wear].champDeForce.bonus, 'armes', {
                    value: champDeForce,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }
        }
    }

    #distinctions() {
        const distinctions = this.distinctions;
        let egide = 0;
        let espoir = 0;

        for(let d of distinctions) {
            egide += d.system.egide;
            espoir += d.system.espoir;
        }

        if(egide > 0) {
            Object.defineProperty(this.egide.bonus, 'distinctions', {
                value: egide,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(espoir > 0) {
            Object.defineProperty(this.espoir.bonus, 'distinctions', {
                value: espoir,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #sanitizeValue() {
        const wear = this.whatWear;
        const listArmor = ['energie', 'armure'];
        const listSTD = ['espoir'];

        for(let l of listArmor) {
            if(!this.equipements[wear]?.[l]) continue;

            const value = this.equipements[wear][l].value;
            const max = this[l].max;

            if(value > max) {
                Object.defineProperty(this.equipements[wear][l], 'value', {
                    value: max,
                });
            }
        }

        for(let l of listSTD) {
            const value = this[l].value;
            const max = this[l].max;

            if(value > max) {
                Object.defineProperty(this[l], 'value', {
                    value: max,
                });
            }
        }

        if(this.contacts.actuel > this.contacts.value) {
            Object.defineProperty(this.contacts, 'actuel', {
                value: this.contacts.value,
            });
        }

        if((this.wear === 'armure' || this.wear === 'ascension') && !this.dataArmor) this.wear = 'tenueCivile';
    }

    _getAspectPath(data) {
        let result = undefined;

        switch(data) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = this.aspects[data];
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = this.aspects.chair.caracteristiques[data];
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = this.aspects.bete.caracteristiques[data];
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = this.aspects.machine.caracteristiques[data];
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = this.aspects.dame.caracteristiques[data];
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = this.aspects.masque.caracteristiques[data];
                break;
        }

        return result;
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

        if(type === 'distance') {
            modificateur = this.rollWpnDistanceMod;
            base = 'tir';
        }
        else base = 'combat';

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

    _getWeaponHandlers() {
        return {
          armesimprovisees: ({ type, name, num }) => this.useAI(type, name, num),
          grenades: ({ type }) => this.useGrenade(type),
          longbow: () => this.useLongbow(),
        };
    }

    async askToRestore(type) {
        let max = 0;

        switch(type) {
          case 'espoir':
          case 'sante':
          case 'armure':
          case 'energie':
            if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
            max = this[type].max;

            this.actor.update({[`system.${type}.value`]:max});
            break;

          case 'contacts':
            if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
            max = this[type].value;

            this.actor.update({[`system.${type}.actuel`]:max});
            break;

          case 'grenades':
            if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
            max = this.combat.grenades.quantity.max;

            this.actor.update({[`system.combat.${type}.quantity.value`]:max});
            break;

          case 'nods':
            if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
            const list = this.combat.nods;
            let update = {};

            for (let i in list) {
                const data = list[i];

              update[`system.combat.${type}.${i}.value`] = data.max;
            }

            this.actor.update(update);
            break;

          case 'chargeur':
            if(!await confirmationDialog('restoration', `Confirmation${type.charAt(0).toUpperCase() + type.slice(1)}`)) return;
            const items = this.actor.items.filter(itm => itm.type === 'arme' || itm.type === 'module' || itm.type === 'armure');

            items.forEach(itm => {
              itm.system.resetMunition();
            })

            const exec = new game.knight.RollKnight(this.actor,
            {
            name:this.actor.name,
            }).sendMessage({
                text:game.i18n.localize('KNIGHT.JETS.RemplirChargeur'),
                classes:'important',
                sounds:CONFIG.sounds.notification,
            });
            break;
        }

        if(type === 'chargeur') return;

        const exec = new game.knight.RollKnight(this.actor,
          {
          name:'',
          }).sendMessage({
              text:game.i18n.localize(`KNIGHT.RECUPERER.MSG.${capitalizeFirstLetter(type)}`),
              sounds:CONFIG.sounds.notification,
          });
    }

    givePE(energy, autoApply=true) {
        const wear = this.whatWear;
        let path = this.isRemplaceEnergie ? `system.espoir.value` : `system.equipements.${wear}.energie.value`;
        let value = this.isRemplaceEnergie ? this.energie.value : this.espoir.value;
        let update = {}

        update[path] = `${value+energy}`;

        if(autoApply) this.actor.update(energy);
        else return update;
    }

    applyFlatEffectBonus(name, flatEffect) {
        const wear = this.whatWear;
        const mod = {
            champDeForce:flatEffect.cdf,
            reaction:flatEffect.reaction,
            defense:flatEffect.defense,
        };
        const path = {
            champDeForce:this.equipements[wear].champDeForce,
            reaction:this.reaction,
            defense:this.defense,
        }

        const main = ['champDeForce', 'reaction', 'defense'];

        for(let m of main) {
            const bonus = Number(mod?.[m]?.bonus ?? 0);
            const malus = Number(mod?.[m]?.malus ?? 0);

            if(mod[m].bonus !== 0) {
                Object.defineProperty(path[m].bonus, name, {
                    value: bonus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(mod[m].malus !== 0) {
                Object.defineProperty(path[m].malus, name, {
                    value: malus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }
        }
    }
}