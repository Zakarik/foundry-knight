import {
    getModStyle,
    SortByAddOrder,
    getFlatEffectBonus,
  } from "../../../helpers/common.mjs";
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
            aspects:new EmbeddedDataField(AspectsPCDataModel),
            defense:new EmbeddedDataField(DefensesDataModel),
            reaction:new EmbeddedDataField(DefensesDataModel),
            egide:new EmbeddedDataField(DefensesDataModel),
            initiative:new EmbeddedDataField(InitiativeDataModel),
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
                value:new NumberField({ initial: 1, min:1, integer: true, nullable: false }),
                mod:new NumberField({ initial: 0, integer: true, nullable: false }),
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
    }

    get items() {
        return this.parent.items;
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
        return this.wear === 'armure' || this.wear === 'ascension' ? true : false;
    }

    get isRemplaceEnergie() {
        let result = false;

        if(this.dataArmor) {
            if(this.dataArmor.system.espoir.remplaceEnergie) result = true;
        }

        return result;
    }

    prepareBaseData() {
        this.#checkArmor();
        this.#setJauges();
        this.#experience();
        this.#base();
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
        this.#modules();
        this.#avantages();
        this.#inconvenients();
        this.aspects.prepareData();
        this.#derived();
        this.initiative.prepareData();
        this.#sanitizeValue();
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
        const wear = this.wear;
        let armure = this.jauges.armure || false;
        let champDeForce = this.jauges.champDeForce || false;
        let egide = this.jauges.egide || false;
        let energie = this.jauges.energie || false;
        let espoir = this.jauges.espoir || false;
        let heroisme = this.jauges.heroisme || false;
        let sante = this.jauges.sante || false;
        let flux = this.jauges.flux || false;
        let jauges;

        switch(wear) {
            case 'armure':
            case 'ascension':
                if(!this.dataArmor) return;

                jauges = this.dataArmor.system.jauges;

                armure = jauges?.armure ?? false;
                champDeForce = jauges?.champDeForce ?? false;
                egide = jauges?.egide ?? false;
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
                egide = jauges?.egide ?? false;
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
                list.push({
                    order:g.system.addOrder,
                    id:g._id,
                    name:g.name,
                    gratuit:g.system.gratuit,
                    value:g.system.gratuit ? 0 : g.system.prix
                })
            } else if(g.type === 'module') {
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
                            value:gratuit ? 0 : dataProgression.prix,
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
                    value:g[1].cout,
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

            Object.defineProperty(path, 'bonus', {
                value: bonus[b],
            });
        }
    }

    #base() {
        let armure = 0;
        let cdf = 0;
        let energie = 0;
        let espoir = 0;
        let egide = 0;

        switch(this.wear) {
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

        Object.defineProperty(this.armure, 'base', {
            value: armure,
        });

        Object.defineProperty(this.energie, 'base', {
            value: energie,
        });

        Object.defineProperty(this.champDeForce, 'base', {
            value: cdf,
        });

        if(espoir > 0) {
            Object.defineProperty(this.espoir.bonus, 'armure', {
                value: espoir,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        if(egide > 0) {
            Object.defineProperty(this.egide.bonus, 'armure', {
                value: egide,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
    }

    #derived() {
        for (const aspect in this.aspects) {
            let maxCarac = 0;

            for (const carac in this.aspects[aspect].caracteristiques) {
                if (this.aspects[aspect].caracteristiques[carac].value > maxCarac) {
                    if(this.armorISwear) maxCarac = this[aspect].caracteristiques[carac].value+this.aspects[aspect].caracteristiques[carac].overdrive.value;
                    else maxCarac = this.aspects[aspect].caracteristiques[carac].value;
                }
            }

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
                        value: (base*maxCarac)+10,
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
                    break;

                case 'machine':
                    // REACTION
                    let isWatchtower = false;

                    if(this.dataArmor) this.dataArmor?.system?.capacites?.selected?.watchtower?.active ?? false;

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
                    break;

                case 'dame':
                    // CONTACTS
                    base = maxCarac;
                    bonus = this.contacts.mod;

                    if(this.wear === 'armure' && this.capaciteUltime) {
                        if(this.capaciteUltime.system.passives.contact.actif && this.capaciteUltime.system.type === 'passive') bonus += this.capaciteUltime.contact.value;
                    }


                    Object.defineProperty(this.contacts, 'value', {
                        value: base+bonus,
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
        Object.defineProperty(this.langues, 'value', {
            value: Math.max(this.aspects.machine.caracteristiques.savoir.value-1, 1)+this.langues.mod,
        });

        // ARMURE
        const armureBonus = Object.values(this.equipements[this.wear]?.armure?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const armureMalus = Object.values(this.equipements[this.wear]?.armure?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

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
        const energieBonus = Object.values(this.equipements[this.wear]?.energie?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const energieMalus = Object.values(this.equipements[this.wear]?.energie?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

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
        const CDFBonus = Object.values(this.equipements[this.wear]?.champDeForce?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const CDFMalus = Object.values(this.equipements[this.wear]?.champDeForce?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

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
            if(this.dataArmor?.special?.selected?.plusespoir?.espoir?.base ?? undefined) espoirBase = this.dataArmor.special.selected.plusespoir.espoir.base;
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
            Object.defineProperty(this.espoir, 'value', {
                value: this.espoir.max,
            });
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
    }

    #modules() {
        const data = this.modules;
        const tete = data.reduce((acc, curr) => acc + (Number(curr.system.slots.tete) || 0), 0);
        const torse = data.reduce((acc, curr) => acc + (Number(curr.system.slots.torse) || 0), 0);
        const brasDroit = data.reduce((acc, curr) => acc + (Number(curr.system.slots.brasDroit) || 0), 0);
        const brasGauche = data.reduce((acc, curr) => acc + (Number(curr.system.slots.brasGauche) || 0), 0);
        const jambeDroite = data.reduce((acc, curr) => acc + (Number(curr.system.slots.jambeDroite) || 0), 0);
        const jambeGauche = data.reduce((acc, curr) => acc + (Number(curr.system.slots.jambeGauche) || 0), 0);

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
            const actuel = data.filter(itm => itm.system.active.base || (itm.system?.niveau?.actuel?.permanent ?? false));
            let specialRaw = [];
            let specialCustom = [];

            if(dataArmure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(dataArmure.system.special.selected?.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(dataArmure.system.special.selected?.porteurlumiere.bonus.effets.custom)
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
                    tempArme.effets.raw = arme.effets.raw.concat(specialRaw);
                    tempArme.effets.custom = arme.effets.raw.concat(specialCustom);
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
                            baseOverdrives[o][c] += overdrives.aspects[o][c];
                        }
                    }
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
                Object.defineProperty(this.equipements[this.wear].armure.bonus, 'module', {
                    value: armureBonus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(armureMalus > 0) {
                Object.defineProperty(this.equipements[this.wear].armure.malus, 'module', {
                    value: armureMalus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(champDeForceBonus > 0) {
                Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, 'module', {
                    value: champDeForceBonus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(champDeForceMalus > 0) {
                Object.defineProperty(this.equipements[this.wear].champDeForce.malus, 'module', {
                    value: champDeForceMalus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(energieBonus > 0) {
                Object.defineProperty(this.equipements[this.wear].energie.bonus, 'module', {
                    value: energieBonus,
                    writable:true,
                    enumerable:true,
                    configurable:true
                });
            }

            if(energieMalus > 0) {
                Object.defineProperty(this.equipements[this.wear].energie.malus, 'module', {
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

            for(let o in baseOverdrives) {
                for(let c in baseOverdrives[o]) {
                    if(baseOverdrives[o][c] > 0) {
                        Object.defineProperty(this.aspects[o].caracteristiques[c].overdrive, 'base', {
                            value: baseOverdrives[o][c],
                        });
                    }
                }
            }

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
            if(bonus.recuperation.sante > 0) recuperationSante += bonus.recuperation.sante;
            if(bonus.recuperation.espoir > 0) recuperationEspoir += bonus.recuperation.espoir;
            if(bonus.recuperation.armure > 0) recuperationArmure += bonus.recuperation.armure;
            if(bonus.recuperation.energie > 0) recuperationEnergie += bonus.recuperation.energie;
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
                value: recuperationEspoir,
            });
        }

        if(recuperationSante > 0) {
            Object.defineProperty(this.combat.nods.soin, 'recuperationBonus', {
                value: recuperationSante,
            });
        }

        if(recuperationArmure > 0) {
            Object.defineProperty(this.combat.nods.armure, 'recuperationBonus', {
                value: recuperationArmure,
            });
        }

        if(recuperationEnergie > 0) {
            Object.defineProperty(this.combat.nods.energie, 'recuperationBonus', {
                value: recuperationEnergie,
            });
        }

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
            Object.defineProperty(this.aspects[a.key].malus, 'blessures', {
                value: a.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        for(let c of caracteristiques) {
            Object.defineProperty(this._getAspectPath(c).malus, 'blessures', {
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
            Object.defineProperty(this._getAspectPath(c).malus, 'traumas', {
                value: c.value,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
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
            Object.defineProperty(this.equipements[this.wear].champDeForce.bonus, 'armes', {
                value: champDeForce,
                writable:true,
                enumerable:true,
                configurable:true
            });
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
        const listArmor = ['energie', 'armure'];
        const listSTD = ['espoir'];

        for(let l of listArmor) {
            if(!this.equipements[this.wear][l]) continue;

            const value = this.equipements[this.wear][l].value;
            const max = this[l].max;

            if(value > max) {
                Object.defineProperty(this.equipements[this.wear][l], 'value', {
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
}