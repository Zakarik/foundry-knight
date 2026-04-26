import {
    getModStyle,
    SortByAddOrder,
    getFlatEffectBonus,
    confirmationDialog,
    capitalizeFirstLetter,
  } from "../../../helpers/common.mjs";
import { AspectsPCDataModel } from '../parts/aspects-pc-data-model.mjs';
import { combine } from '../../../utils/field-builder.mjs';
import BaseActorDataModel from "../base/base-actor-data-model.mjs";
import HumanMixinModel from "../base/mixin-human-model.mjs";

export class KnightDataModel extends HumanMixinModel(BaseActorDataModel) {
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
            version:["num", {initial:2, nullable:false, integer:true}],
            histoire:["html", { initial: ""}],
            aspects:["embedded", AspectsPCDataModel],
            GM:["schema", {
                dontshow:["bool", { initial: false}],
            }],
            equipements:["schema", {
                modules:["obj", {}],
                ia:["schema", {
                    code:["str", { initial: "", nullable:false}],
                    surnom:["str", { initial: "", nullable:false}],
                    caractere:["str", { initial: "", nullable:false}],
                }],
                armure:["schema", {
                    hasArmor:["bool", { initial: false}],
                    hasArmorLegende:["bool", { initial: false}],
                    id:["str", { initial: "0", nullable:true}],
                    idLegende:["str", { initial: "0", nullable:true}],
                    label:["str", { initial: "", nullable:true}],
                    armure:["schema", {
                        value:["num", {initial:0, nullable:false, integer:true}],
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
                    champDeForce:["schema", {
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
                    energie:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
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
                    slots:["schema", {
                        brasDroit:["num", {initial:0, nullable:false, integer:true}],
                        brasGauche:["num", {initial:0, nullable:false, integer:true}],
                        jambeDroite:["num", {initial:0, nullable:false, integer:true}],
                        jambeGauche:["num", {initial:0, nullable:false, integer:true}],
                        tete:["num", {initial:0, nullable:false, integer:true}],
                        torse:["num", {initial:0, nullable:false, integer:true}],
                    }],
                }],
                ascension:["schema", {
                    armure:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
                        base:["num", {initial:0, min:0, nullable:false, integer:true}],
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
                    champDeForce:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
                        base:["num", {initial:0, min:0, nullable:false, integer:true}],
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
                    energie:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
                        base:["num", {initial:0, min:0, nullable:false, integer:true}],
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
                }],
                guardian:["schema", {
                    armure:["schema", {
                        value:["num", {initial:5, min:0, nullable:false, integer:true}],
                        base:["num", {initial:5, min:0, nullable:false, integer:true}],
                        bonus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                        malus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                    }],
                    champDeForce:["schema", {
                        value:["num", {initial:5, min:0, nullable:false, integer:true}],
                        base:["num", {initial:5, min:0, nullable:false, integer:true}],
                        bonus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                        malus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                    }],
                    jauges:["schema", {
                        armure:["bool", { initial: true, nullable:false}],
                        champDeForce:["bool", { initial: true, nullable:false}],
                        egide:["bool", { initial: false, nullable:false}],
                        energie:["bool", { initial: false, nullable:false}],
                        espoir:["bool", { initial: true, nullable:false}],
                        heroisme:["bool", { initial: true, nullable:false}],
                        sante:["bool", { initial: true, nullable:false}],
                    }],
                    energie:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
                        base:["num", {initial:0, min:0, nullable:false, integer:true}],
                        bonus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                        malus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                    }],
                }],
                tenueCivile:["schema", {
                    jauges:["schema", {
                        armure:["bool", { initial: false, nullable:false}],
                        champDeForce:["bool", { initial: false, nullable:false}],
                        egide:["bool", { initial: false, nullable:false}],
                        energie:["bool", { initial: false, nullable:false}],
                        espoir:["bool", { initial: true, nullable:false}],
                        heroisme:["bool", { initial: true, nullable:false}],
                        sante:["bool", { initial: true, nullable:false}],
                    }],
                    energie:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
                        base:["num", {initial:0, min:0, nullable:false, integer:true}],
                        bonus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                        malus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                    }],
                    champDeForce:["schema", {
                        value:["num", {initial:0, min:0, nullable:false, integer:true}],
                        base:["num", {initial:0, min:0, nullable:false, integer:true}],
                        bonus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                        malus:["obj", {
                            initial:{
                                user:0,
                                system:0,
                            }
                        }],
                    }],
                }],
            }],
            combat:["schema", {
                style:["str", { initial: "standard", nullable:false}],
                styleInfo:["str", { initial: "" }],
                noMalusStyle:["bool", { initial: false}],
            }],
            combos:["schema", {
                bonus:["schema", {
                    aspects:["obj", {}],
                    caracteristiques:["obj", {}],
                }],
                interdits:["schema", {
                    aspects:["obj", {}],
                    caracteristiques:["obj", {}],
                }],
            }],
            contacts:["schema", {
                actuel:["num", {initial:1, min:0, nullable:false, integer:true}],
                value:["num", {initial:1, min:0, nullable:false, integer:true}],
                mod:["num", {initial:0, nullable:false, integer:true}],
                bonus:["obj", {
                    initial:{
                        user:0,
                        system:0,
                    }
                }],
            }],
            heroisme:["schema", {
                value:["num", {initial:0, nullable:false, integer:true}],
                max:["num", {initial:0, nullable:false, integer:true}],
            }],
            jauges:["schema", {
                armure:["bool", { initial: false, nullable:false}],
                champDeForce:["bool", { initial: false, nullable:false}],
                egide:["bool", { initial: false, nullable:false}],
                energie:["bool", { initial: false, nullable:false}],
                espoir:["bool", { initial: true, nullable:false}],
                heroisme:["bool", { initial: true, nullable:false}],
                sante:["bool", { initial: true, nullable:false}],
                flux:["bool", { initial: true, nullable:false}],
            }],
            motivations:["schema", {
                majeure:["str", { initial: "", nullable:false }],
            }],
            options:["schema", {
                kraken:["bool", { initial: false, nullable:false}],
            }],
            progression:["schema", {
                experience:["schema", {
                    actuel:["num", {initial:0, nullable:false, integer:true}],
                    total:["num", {initial:0, nullable:false, integer:true}],
                    depense:["schema", {
                        liste:["obj", {}],
                        total:["num", {initial:0, nullable:false, integer:true}],
                    }],
                }],
                gloire:["schema", {
                    actuel:["num", {initial:0, nullable:false, integer:true}],
                    total:["num", {initial:0, nullable:false, integer:true}],
                    depense:["schema", {
                        autre:["obj", {}],
                        liste:["obj", {}],
                        total:["num", {initial:0, nullable:false, integer:true}],
                    }],
                }],
            }],
            restrictions:["obj", {}],
        }

        return combine(base, specific);
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

    get capaciteUltime() {
        return this.items.find(items => items.type === 'capaciteultime');
    }

    get eqpData() {
        const wear = this.whatWear;

        return this?.equipements?.[wear] ?? this;
    }

    get isRemplaceEnergie() {
        let result = false;

        if(this.dataArmor) {
            if(this.dataArmor.system.espoir.remplaceEnergie) result = true;
        }

        return result;
    }

    get energyValue() {
        const wear = this.whatWear;

        return this.isRemplaceEnergie ?
            this?.espoir?.value ?? 0 :
            this?.equipements?.[wear]?.energie?.value ?? 0;
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

    _startPrepareData() {
        super._startPrepareData();

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
        this.#gloire();
    }

    _startPrepareDerivedData() {
        super._startPrepareDerivedData();

        this.#avantages();
        this.#inconvenients();
    }

    _EndPrepareDerivedData() {
        super._EndPrepareDerivedData();

        this.#style();
        this.#derived();
        this.initiative.prepareData();
        this.#sanitizeValue();
        this.#setJauges();
        this.#sanitizeCyberware();
    }

    _applyTranslation() {
        super._applyTranslation();
        const od = this.translationOD();

        Object.defineProperty(this.actor, 'translations', {
            value: foundry.utils.mergeObject(this.actor.translations, od),
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    translationOD() {
        const aspects = this.aspects;
        const result = {};

        for (const [aspect, { caracteristiques }] of Object.entries(aspects)) {
            for (const [caracteristique, caraData] of Object.entries(caracteristiques)) {
                const value = caraData.overdrive.value;
                const prefix = `KNIGHT.ASPECTS.${aspect.toUpperCase()}.CARACTERISTIQUES.${caracteristique.toUpperCase()}`;
                const liste = {};

                for (let i = 1; i <= value; i++) {
                    const key = `${prefix}.OD${i}`;
                    const translation = game.i18n.localize(key);

                    if (translation === key) continue;

                    liste[`OD${i}`] = {
                        value: i,
                        description: translation,
                    };
                }

                if (Object.keys(liste).length > 0) {
                    result[aspect] ??= {};
                    result[aspect][caracteristique] = {
                        titre: game.i18n.localize(`${prefix}.OD`),
                        liste,
                    };
                }
            }
        }

        return { overdrives: result };
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
        const cyberware = this.items.filter(items => items.type === 'cyberware' && (items.system.categorie === 'utilitaire' || items.system.categorie === 'combat'));
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

        if(cyberware.length > 0) energie = true;
        if(this.champDeForce.value > 0) champDeForce = true;
        if(this.energie.max > 0) energie = true;
        if(this.armure.max > 0) armure = true;

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
        const cyberwares = this.cyberwares;
        const autres = Object.entries(this.progression.gloire.depense.autre);
        const all = [].concat(armure, armes, modules, cyberwares, autres);
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
            } else if(g.type === 'cyberware') {
                const dataProgression = g.system;
                const gratuit = dataProgression?.gratuit || false;

                list.push({
                    order:g.system.addOrder,
                    id:g._id,
                    name:g.name,
                    gratuit:gratuit || false,
                    value:gratuit ? 0 : dataProgression?.prix ?? 0,
                })
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
        const setValue = (name, withMax=true) => {
            const wear = this.whatWear;
            const property = withMax ? 'max' : 'value';

            const override = Object.values(this[name]?.override ?? {}).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

            const baseBonus = Object.values(this[name]?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const baseMalus = Object.values(this[name]?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

            const bonus = Object.values(this.equipements[wear]?.[name]?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const malus = Object.values(this.equipements[wear]?.[name]?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

            if(!override) {
                Object.defineProperty(this[name], 'mod', {
                    value: (baseBonus + bonus) - (baseMalus + malus),
                });

                Object.defineProperty(this[name], property, {
                    value: this[name].base+this[name].mod,
                });
            } else {
                Object.defineProperty(this[name], property, {
                    value: override,
                });
            }

            if(withMax) {
                Object.defineProperty(this[name], 'value', {
                    value: Math.min(this.equipements[this.wear]?.[name]?.value ?? 0, this[name].max),
                });
            }
        }

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
            let override;

            switch(aspect) {
                case 'chair':
                    override = Object.values(this.sante?.override ?? {}).reduce((max, curr) => Math.max(max, Number(curr) || 0), 0);

                    if(!override) {
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
                    } else {
                        Object.defineProperty(this.sante, 'max', {
                            value: override,
                        });
                    }

                    break;

                case 'bete':
                    // DEFENSE
                    const defenseOverride = Object.values(this.defense.override).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

                    if(!defenseOverride) {
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
                    } else {
                        Object.defineProperty(this.defense, 'value', {
                            value: defenseOverride,
                        });

                        Object.defineProperty(this.defense, 'valueWOMod', {
                            value: defenseOverride,
                        });
                    }
                    break;

                case 'machine':
                    // REACTION
                    const reactionOverride = Object.values(this.reaction.override).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

                    if(!reactionOverride) {
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
                    } else {

                        Object.defineProperty(this.reaction, 'value', {
                            value: reactionOverride,
                        });

                        Object.defineProperty(this.reaction, 'valueWOMod', {
                            value: reactionOverride,
                        });
                    }
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
        setValue('armure');

        // ENERGIE
        setValue('energie');

        // CHAMP DE FORCE
        setValue('champDeForce', false);

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
        const noMalus = this.combat.noMalusStyle;
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

        if(!noMalus) {
            Object.defineProperty(this.reaction.malus, 'style', {
                value: data.malus.reaction,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }

        Object.defineProperty(this.defense.bonus, 'style', {
            value: data.bonus.defense,
            writable:true,
            enumerable:true,
            configurable:true
        });

        if(!noMalus) {
            Object.defineProperty(this.defense.malus, 'style', {
                value: data.malus.defense,
                writable:true,
                enumerable:true,
                configurable:true
            });
        }
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
        const list = ['energie', 'armure', 'sante', 'espoir'];

        for(let l of list) {
            if(!this.jauges) continue;

            const eqp = this?.equipements?.[wear]?.[l] ?? this?.[l];

            if(!eqp) continue;

            const value = eqp?.value ?? eqp?.value;
            const max = this[l].max;

            if(value > max) {
                Object.defineProperty(eqp, 'value', {
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

    async #sanitizeCyberware() {
        if(this.whatWear !== 'armure') return;

        const cyberware = this.cyberware.filter(itm =>
            (itm.system.activation.has && itm.system.active && !itm.system.activation.permanent) &&
            !itm.system.activation.withMetaArmure);

        if(cyberware.length > 0) {
            for(let c of cyberware) {
                await c.system.activate();
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
            const items = this.actor.items.filter(itm => itm.type === 'arme' || itm.type === 'module' || itm.type === 'armure' || itm.type === 'cyberware');

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