import { AspectsPCDataModel } from '../parts/aspects-pc-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';

export class KnightDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

        return {
            wear:new StringField({initial:"tenueCivile"}),
			age:new StringField({ initial: ""}),
			archetype:new StringField({ initial: ""}),
			blason:new StringField({ initial: ""}),
            surnom:new StringField({initial:""}),
            section:new StringField({initial:""}),
            hautfait:new StringField({initial:""}),
            histoire:new HTMLField({initial:""}),
            description:new HTMLField({initial:""}),
            descriptionLimitee:new HTMLField({initial:""}),
			armure: new SchemaField({
                max:new NumberField({ initial: 0, integer: true, nullable: false }),
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
                bonus:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
			champDeForce: new SchemaField({
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
                base:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
			art: new SchemaField({
                oeuvres:new ObjectField(),
            }),
            aspects:new EmbeddedDataField(AspectsPCDataModel),
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
                value:new NumberField({ initial: 1, min:1, integer: true, nullable: false }),
                mod:new NumberField({ initial: 0, integer: true, nullable: false }),
            }),
            defense:new EmbeddedDataField(DefensesDataModel),
            reaction:new EmbeddedDataField(DefensesDataModel),
            egide:new EmbeddedDataField(DefensesDataModel),
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
                bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
                malusValue:new NumberField({initial:0, nullable:false, integer:true}),
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:50, nullable:false, integer:true}),
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
            }),
            energie:new SchemaField({
                base:new NumberField({ initial: 0, integer: true, nullable: false }),
                bonus:new NumberField({ initial: 0, integer: true, nullable: false }),
                malus:new NumberField({ initial: 0, integer: true, nullable: false }),
                max:new NumberField({ initial: 0, integer: true, nullable: false }),
                value:new NumberField({ initial: 0, integer: true, nullable: false }),
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
                    energie:new SchemaField({
                        base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
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
                            }
                        }),
                        malus:new ObjectField({
                            initial:{
                              user:0,
                            }
                        }),
                    }),
                    energie:new SchemaField({
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
            flux:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            heroisme:new SchemaField({
                value:new NumberField({initial:0, nullable:false, integer:true}),
                max:new NumberField({initial:0, nullable:false, integer:true}),
            }),
            initiative:new EmbeddedDataField(InitiativeDataModel),
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
            restrictions:new ObjectField(),
            bonusSiEmbuscade:new SchemaField({
              bonusInitiative:new SchemaField({
                dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
              }),
            }),
        }
    }

    get items() {
        return this.parent.items;
    }

    get armureWear() {
        return this.items.find(items => items.type === 'armure');
    }

    get capaciteUltime() {
        return this.items.find(items => items.type === 'capaciteultime');
    }

    get armureLegende() {
        return this.items.find(items => items.type === 'armurelegende');
    }

    get wearArmor() {
        return this.wear === 'armure' || this.wear === 'ascension' ? true : false;
    }

    prepareBaseData() {
        this.#checkArmor();
        this.#setJauges();
        this.#experience();
	}

	prepareDerivedData() {
        this.aspects.prepareData();
    }

    #checkArmor() {
        const item = this.armureWear;

        if(!item && this.wearArmor) {
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
        const wear = this.wear;
        let armure = this.jauges.armure;
        let champDeForce = this.jauges.champDeForce;
        let egide = this.jauges.egide;
        let energie = this.jauges.energie;
        let espoir = this.jauges.espoir;
        let heroisme = this.jauges.heroisme;
        let sante = this.jauges.sante;
        let flux = this.jauges.flux;
        let jauges;

        switch(wear) {
            case 'armure':
            case 'ascension':
                jauges = this.armure.system.jauges;

                armure = jauges.armure;
                champDeForce = jauges.champDeForce;
                egide = jauges.egide;
                energie = jauges.energie;
                espoir = jauges.espoir;
                heroisme = jauges.heroisme;
                sante = jauges.sante;
                flux = jauges.flux;

                if(this.armureLegende) {
                    if(this.armureLegende.system?.special?.selected?.recolteflux ?? false) flux = true;
                }
                break;

            case 'tenueCivile':
            case 'guardian':
                jauges = this.equipements[wear].jauges;

                armure = jauges.armure;
                champDeForce = jauges.champDeForce;
                egide = jauges.egide;
                energie = jauges.energie;
                espoir = jauges.espoir;
                heroisme = jauges.heroisme;
                sante = jauges.sante;
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
        }

        for(let b in bonus) {
            const path = this._getAspectPath(b);

            if(!path) continue;

            Object.defineProperty(path, 'bonus', {
                value: bonus[b],
            });
        }
    }

    #derived() {
        for (const aspect in this.aspects) {
            let maxCarac = 0;

            for (const carac in this[aspect].caracteristiques) {
                if (this[aspect].caracteristiques[carac].value > maxCarac) {
                    if(this.armureWear) maxCarac = this[aspect].caracteristiques[carac].value+this[aspect].caracteristiques[carac].overdrive.value;
                    else maxCarac = this[aspect].caracteristiques[carac].value;
                }
            }

            let bonus;
            let malus;
            let base;
            let mod;

            switch(aspect) {
                case 'chair':
                    bonus = this.sante.bonus?.user ?? 0;
                    malus = this.sante.malus?.user ?? 0;
                    base = 0;
                    mod = 0;

                    if(this.options.kraken) base = 8;
                    else base = 6;

                    Object.defineProperty(this.sante, 'base', {
                        value: (base*maxCarac)+10,
                    });

                    mod += bonus-malus;

                    if(this.wearArmor && this.aspects.chair.caracteristiques.endurance.overdrive.value >= 3) mod += 6;

                    if(this.capaciteUltime && this.wearArmor) {
                        if(this.capaciteUltime.type === 'passive' && this.capaciteUltime.passive.sante) mod += Math.floor((this.sante.base+mod)/2);
                    }

                    Object.defineProperty(this.sante, 'mod', {
                        value: mod,
                    });

                    Object.defineProperty(this.sante, 'max', {
                        value: this.sante.base+this.sante.mod,
                    });
                    break;

                case 'masque':
                    bonus = this.initiative.bonus?.user ?? 0;
                    malus = this.initiative.malus?.user ?? 0;
                    base = 0;
                    mod = 0;

                    Object.defineProperty(this.initiative, 'base', {
                        value: maxCarac,
                    });

                    mod += bonus-malus;

                    if(this.wearArmor && this.aspects.bete.caracteristiques.instinct.overdrive.value >= 3) mod += this.aspects.bete.caracteristiques.instinct.overdrive.value*3;

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

    /*_archive() {
        // Make modifications to data here.
        const currentVersion = game.settings.get("knight", "systemVersion");
        const data = actorData.system;
        const isKraken = data.options.kraken;

        const armorWear = armor?.system || false;
        const capaciteultime = actorData.items.find(items => items.type === 'capaciteultime');
        let passiveUltime = undefined;

        if(capaciteultime !== undefined) {
            const dataCapaciteUltime = capaciteultime.system;

            if(dataCapaciteUltime.type == 'passive') passiveUltime = dataCapaciteUltime.passives;
        }

        const dataWear = (armorWear === false && data.wear === 'armure') ? 'tenueCivile' : data.wear;
        const aspects = data.aspects;

        const chairMax = Math.max(data.aspects.chair.caracteristiques.deplacement.value, data.aspects.chair.caracteristiques.force.value, data.aspects.chair.caracteristiques.endurance.value);
        const beteMax = Math.max(data.aspects.bete.caracteristiques.hargne.value, data.aspects.bete.caracteristiques.combat.value, data.aspects.bete.caracteristiques.instinct.value);
        const machineMax = Math.max(data.aspects.machine.caracteristiques.tir.value, data.aspects.machine.caracteristiques.savoir.value, data.aspects.machine.caracteristiques.technique.value);
        const dameMax = Math.max(data.aspects.dame.caracteristiques.aura.value, data.aspects.dame.caracteristiques.parole.value, data.aspects.dame.caracteristiques.sangFroid.value);
        const masqueMax = Math.max(data.aspects.masque.caracteristiques.discretion.value, data.aspects.masque.caracteristiques.dexterite.value, data.aspects.masque.caracteristiques.perception.value);

        const beteWODMax = Math.max(data.aspects.bete.caracteristiques.hargne.value+data.aspects.bete.caracteristiques.hargne.overdrive.value,
        data.aspects.bete.caracteristiques.combat.value+data.aspects.bete.caracteristiques.combat.overdrive.value,
        data.aspects.bete.caracteristiques.instinct.value+data.aspects.bete.caracteristiques.instinct.overdrive.value);
        const machineWODMax = Math.max(data.aspects.machine.caracteristiques.tir.value+data.aspects.machine.caracteristiques.tir.overdrive.value,
        data.aspects.machine.caracteristiques.savoir.value+data.aspects.machine.caracteristiques.savoir.overdrive.value,
        data.aspects.machine.caracteristiques.technique.value+data.aspects.machine.caracteristiques.technique.overdrive.value);
        const masqueWODMax = Math.max(data.aspects.masque.caracteristiques.discretion.value+data.aspects.masque.caracteristiques.discretion.overdrive.value,
        data.aspects.masque.caracteristiques.dexterite.value+data.aspects.masque.caracteristiques.dexterite.overdrive.value,
        data.aspects.masque.caracteristiques.perception.value+data.aspects.masque.caracteristiques.perception.overdrive.value);

        // ARMURE
        if(dataJauges.armure) {
        const armureDataBonus = data.armure.bonus ?? 0;
        const armureDataMalus = data.armure.malus ?? 0;

        const armureBonus = data.equipements[dataWear].armure.bonus.user ?? 0;
        const armureMalus = data.equipements[dataWear].armure.malus.user ?? 0;

        data.armure.max = armureDataBonus+armureBonus-armureDataMalus-armureMalus;
        }

        // ENERGIE
        if(dataJauges.energie) {
        const userEBase = equipement.energie?.base ?? 0;
        const energieBonus = data.equipements[dataWear].energie.bonus?.user ?? 0;
        const energieMalus = data.equipements[dataWear].energie.malus?.user ?? 0;

        data.energie.base = userEBase;

        if(!data.energie.bonus || !Number.isInteger(data.energie.bonus)) data.energie.bonus = Number(energieBonus);
        else data.energie.bonus += Number(energieBonus);

        if(!data.energie.malus || !Number.isInteger(data.energie.malus)) data.energie.malus = Number(energieMalus);
        else data.energie.malus += Number(energieMalus);

        equipement.energie.mod = data.energie.bonus-data.energie.malus;
        equipement.energie.max = Math.max(userEBase+equipement.energie.mod, 0);
        equipement.energie.value = data.energie.value;

        data.energie.max = equipement.energie.max;
        }

        // CHAMP DE FORCE
        if(dataJauges.champDeForce) {
        const userCDFBase = data.champDeForce?.base ?? 0;
        const CDFDataBonus = data.equipements[dataWear].champDeForce.bonus?.user ?? 0;
        const CDFDataMalus = data.equipements[dataWear].champDeForce.malus?.user ?? 0;

        if(!data.champDeForce.bonus) data.champDeForce.bonus = CDFDataBonus;
        else data.champDeForce.bonus += CDFDataBonus;

        if(!data.champDeForce.malus) data.champDeForce.malus = CDFDataMalus;
        else data.champDeForce.malus += CDFDataMalus;

        data.champDeForce.value = userCDFBase+data.champDeForce.bonus-data.champDeForce.malus;
        }

        // ESPOIR
        if(dataJauges.espoir) {
        const hasPlusEspoir = armorWear !== false && armorWear?.special?.selected?.plusespoir != undefined ? armorWear?.special?.selected?.plusespoir.espoir.base : 50;
        const userEBase = hasPlusEspoir;
        const espoirDataBonus = data.espoir.bonus?.user ?? 0;
        const espoirDataMalus = data.espoir.malus?.user ?? 0;

        if(!data.espoir.bonusValue) data.espoir.bonusValue = espoirDataBonus;
        else data.espoir.bonusValue += espoirDataBonus;

        if(!data.espoir.malusValue) data.espoir.malusValue = espoirDataMalus;
        else data.espoir.malusValue += espoirDataMalus;

        data.espoir.max = Math.max(userEBase+data.espoir.bonusValue-data.espoir.malusValue, 0);
        }

        //EGIDE
        const hasEgide = game.settings.get("knight", "acces-egide");

        if(hasEgide) {
        const userSBase = data.egide?.base ?? 0;
        const egideDataBonus = data.egide.bonus?.user ?? 0;
        const egideDataMalus = data.egide.malus?.user ?? 0;

        if(!data.egide.bonusValue) data.egide.bonusValue = egideDataBonus;
        else data.egide.bonusValue += egideDataBonus;

        if(!data.egide.malusValue) data.egide.malusValue = egideDataMalus;
        else data.egide.malusValue += egideDataMalus;

        data.egide.value = Math.max(userSBase+data.egide.bonusValue-data.egide.malusValue, 0);
        }

        // INITIATIVE
        const hasEmbuscadeSubis = data.options?.embuscadeSubis || false;
        const hasEmbuscadePris = data.options?.embuscadePris || false;
        const userIBase = dataWear === 'armure' || dataWear === 'ascension' ? masqueWODMax : masqueMax;
        const initiativeDataDiceBase = Number(data.initiative.diceBase);
        let initiativeDataDiceMod = Number(data.initiative?.diceMod) || 0;
        let initiativeDataMod = Number(data.initiative?.mod) || 0;

        let initiativeBonus = Number(data.initiative.bonus.user);
        let initiativeMalus = Number(data.initiative.malus.user);

        if(dataWear === "armure" || dataWear === "ascension") {
        const ODInstinct =  Number(aspects?.bete?.caracteristiques?.instinct?.overdrive?.value) || 0;

        if(ODInstinct >= 3) initiativeDataMod += ODInstinct*3;
        }

        if(hasEmbuscadeSubis) {
        const bonusDice = +data?.bonusSiEmbuscade?.bonusInitiative?.dice || 0;
        const bonusFixe = +data?.bonusSiEmbuscade?.bonusInitiative?.fixe || 0;

        initiativeDataDiceMod += bonusDice;
        initiativeDataMod += bonusFixe;
        }

        if(hasEmbuscadePris) {
        initiativeDataMod += 10;
        }

        data.initiative.dice = Math.max(initiativeDataDiceBase+initiativeDataDiceMod, 1);
        data.initiative.base = userIBase;
        data.initiative.value = Math.max(userIBase+initiativeDataMod+initiativeBonus-initiativeMalus, 0);
        data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;

        // REACTION
        const isWatchtower = armor?.system?.capacites?.selected?.watchtower?.active ?? false
        const userRBase = dataWear === 'armure' || dataWear === 'ascension' ? machineWODMax : machineMax;
        const reactionDataBonus = data.reaction.bonus?.user ?? 0;
        const reactionDataMalus = data.reaction.malus?.user ?? 0;

        let reactionBonus = isKraken ? 1 : 0;
        let reactionMalus = data?.reaction?.malusValue ?? 0;
        let reactionTotal = 0;

        if(!data.reaction.bonusValue) data.reaction.bonusValue = reactionDataBonus;
        else data.reaction.bonusValue += reactionDataBonus;

        if(!data.reaction.malusValue) reactionMalus = reactionDataMalus;
        else reactionMalus += reactionDataMalus;

        data.reaction.malusValue = reactionMalus
        data.reaction.base = userRBase;

        reactionTotal = Math.max(userRBase+data.reaction.bonusValue+reactionBonus-data.reaction.malusValue, 0);
        data.reaction.value = isWatchtower ? Math.floor(reactionTotal/2) : reactionTotal;

        // DEFENSE
        const userDBase = dataWear === 'armure' || dataWear === 'ascension' ? beteWODMax : beteMax;
        const defenseDataBonus = data.defense.bonus.user;
        const defenseDataMalus = data.defense.malus.user;

        let defenseBonus = isKraken ? 1 : 0;

        if(dataWear === "armure" || dataWear === "ascension") {
        const ODAura =  aspects?.dame?.caracteristiques?.aura?.overdrive?.value || 0;

        if(ODAura >= 5) defenseBonus += aspects.dame.caracteristiques.aura.value;
        }

        if(!data.defense.bonusValue) data.defense.bonusValue = defenseDataBonus;
        else data.defense.bonusValue += defenseDataBonus;

        if(!data.defense.malusValue) data.defense.malusValue = defenseDataMalus;
        else data.defense.malusValue += defenseDataMalus;

        data.defense.base = userDBase;
        data.defense.value = Math.max(userDBase+data.defense.bonusValue+defenseBonus-data.defense.malusValue, 0);

        // LANGUES
        const userLBase = Math.max(data.aspects.machine.caracteristiques.savoir.value-1, 1);
        const userLBonus = data.langues.mod;

        data.langues.value = userLBase+userLBonus;

        // CONTACTS
        const userCBase = dameMax;
        const userCBonus = data.contacts.mod;

        let bonusCCU = 0;

        if(dataWear === "armure" && passiveUltime !== undefined) {
        if(passiveUltime.contact.actif) bonusCCU = passiveUltime.contact.value;
        }

        data.contacts.value = userCBase+userCBonus+bonusCCU;

        // STYLES
        data.combat.styleInfo = game.i18n.localize(CONFIG.KNIGHT.styles[data.combat.style]);

        // PG
        const dataProgression = data.progression;

        const dataPG = dataProgression.gloire;
        const PGActuel = Number(dataPG.actuel);
        const PGDepenseListe = dataPG.depense.liste;

        let PGTotalDepense = 0;

        if(PGDepenseListe.length !== 0) {
        if(!PGDepenseListe[0].isEmpty) {
            for(const PG in PGDepenseListe) {
            if(!PGDepenseListe[PG].isArmure) PGTotalDepense += Number(PGDepenseListe[PG].value);
            }
        }
        }

        if(foundry.utils.isNewerVersion(currentVersion, '3.7.9')) data.progression.gloire.actuel = Number(dataPG.total)-PGTotalDepense;
        data.progression.gloire.depense.total = PGTotalDepense;

        // XP
        const dataPX = dataProgression.experience;
        const PXActuel = dataPX.actuel;
        const PXDepenseListe = dataPX.depense.liste;
        const isArray = PXDepenseListe.length === undefined ? false : true;

        let PXTotalDepense = 0;

        if(isArray) {
        for(let i = 0;i < PXDepenseListe.length;i++) {
            PXTotalDepense += +PXDepenseListe[i].cout;
        }
        } else {
        for(let [key, depense] of Object.entries(PXDepenseListe)) {
            PXTotalDepense += +depense.cout;
        }
        }

        if(foundry.utils.isNewerVersion(currentVersion, '3.7.9')) data.progression.experience.actuel = Number(dataPX.total)-PXTotalDepense;
        data.progression.experience.depense.total = PXTotalDepense;

        //data.progression.experience.total = PXTotalDepense+PXActuel;

        //NETTOYE LES ARMES A DISTANCE S'IL NE PEUT PORTER DES ARMES A DISTANCE
        const cannotUseDistance = armor?.system?.special?.selected?.contrecoups?.armedistance?.value ?? undefined;
        if(cannotUseDistance === false) {
            const itmWpn = actorData.items.find(wpn => wpn.type === 'arme' && wpn.system.type === 'distance');
            if(itmWpn !== undefined) itmWpn.delete();
        }
    }*/
}