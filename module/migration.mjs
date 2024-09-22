import {
    updateEffect,
  } from "../module/helpers/common.mjs";

/*
Applique les modifications par la mise à jour au Monde.
*/
 export class MigrationKnight {
    static NEEDED_VERSION = "3.30.0";

    static needUpdate(version) {
        const currentVersion = game.settings.get("knight", "systemVersion");
        return !currentVersion || foundry.utils.isNewerVersion(version, currentVersion);
    }

    static async migrateWorld(options = { force: false }) {
        if (!game.user.isFirstGM) {
            return;
        }

        // Warn the users
        ui.notifications.info(
            `Mise à jour du système Knight à la version ${game.system.version}.` +
                ` Patientez jusqu'à la fin de la mise à jour, ne redémarrez pas le serveur.`,
            { permanent: true }
        );

        // Migrate World Actors
        for (let actor of game.actors.contents) {
            try {
                const update = MigrationKnight._migrationActor(actor, options);
                if (!foundry.utils.isEmpty(update)) {
                    console.log(`KNIGHT : Migration de l'actor ${actor.name}[${actor._id}]`);
                    await actor.update(update);
                }
            } catch (err) {
                err.message = `KNIGHT : Echec de la migration du système pour ${actor.name}[${actor._id}]`;
                console.error(err);
            }
        }

        // Migrate World Items
        for (let item of game.items.contents) {
            try {
               const update = MigrationKnight._migrationItems(item, options);
                if (!foundry.utils.isEmpty(update)) {
                    console.log(`KNIGHT : Migration de l'item ${item.name}[${item._id}]`);
                    await item.update(update);
                }
            } catch (err) {
                err.message = `KNIGHT : Echec de la migration de l'item ${item.name}[${item._id}]`;
                console.error(err);
            }
        }

        // Migrate Workd Tokens
        for(let scn of game.scenes) {
            for(let tkn of scn.tokens) {
                try {
                    MigrationKnight._migrationTokens(tkn, options);
                } catch (err) {
                    err.message = `KNIGHT : Echec de la migration du token ${tkn.name}[${tkn._id}]`;
                    console.error(err);
                }
            }
        }

        //await game.settings.set("knight", "systemVersion", game.system.version);
        ui.notifications.info(`Migration du système de Knight à la version ${game.system.version} terminé!`, {
            permanent: true,
        });

        /*if(MigrationKnight.needUpdate("1.8.0")) {
            ui.notifications.info(`Suite à une modification du système, la Ranger voit son système d'évolution modifié !
            Si vous avez une Ranger dans votre équipe et qu'elle n'a pas encore eu d'évolution : Aucun problème.
            Si vous avez une Ranger qui a déjà évolué, il est possible qu'elle doive racheter ses évolutions, ou recréer son armure : Vérifiez bien.
            Désolé pour le dérangement`, {
                permanent: true,
            });
        }*/
    }

    static _migrationActor(actor, options = { force:false }) {
        let update = {};

        /*if (options?.force || MigrationKnight.needUpdate("1.2.0")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'module') {
                    const vEnergieT = system.energie.tour;
                    const vEnergieM = system.energie.minute;

                    if(!isNaN(vEnergieT)) {
                        updateItem["system.energie.tour"] = {
                            value:vEnergieT,
                            label:""
                        };
                    }

                    if(!isNaN(vEnergieM)) {
                        updateItem["system.energie.minute"] = {
                            value:vEnergieM,
                            label:""
                        };
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.4")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const listeEvolutions = item.system?.evolutions.liste;

                    for (let [key, evo] of Object.entries(listeEvolutions)) {
                        const eGoliath = evo.capacites?.goliath || false;
                        const eBarbarian = evo.capacites?.barbarian || false;

                        if(eGoliath !== false && eBarbarian !== false) {
                            updateItem[`system.evolutions.liste.${key}.capacites.goliath`] = eBarbarian.selected;
                            updateItem[`system.evolutions.liste.${key}.capacites.-=barbarian`] = null;
                        }
                    }
                }

                if(item.type === 'armurelegende') {
                    const alBarbarian = item.system.capacites?.barbarian || false;
                    const alGoliath = item.system.capacites.selected?.goliath || false;

                    if(alGoliath !== false && alBarbarian !== false) {
                        updateItem[`system.capacites.selected.selected.goliath`] = alBarbarian.selected;
                        updateItem[`system.capacites.-=barbarian`] = null;
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.5")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'module') {
                    const isPNJ = item.system.pnj.has;
                    const listePNJ = item.system.pnj.liste;

                    updateItem[`system.pnj.modele.armes.modele.attaque`] = {
                        dice:0,
                        fixe:0
                    };

                    if(isPNJ) {
                        for (let [key, pnj] of Object.entries(listePNJ)) {
                            const hasWPN = pnj.armes.has;
                            const listePNJWPN = pnj.armes.liste;

                            updateItem[`system.pnj.liste.${key}.armes.modele.attaque`] = {
                                dice:0,
                                fixe:0
                            };

                            if(hasWPN) {
                                for (let [kWPN, wpn] of Object.entries(listePNJWPN)) {

                                    updateItem[`system.pnj.liste.${key}.armes.liste.${kWPN}.attaque`] = {
                                        dice:0,
                                        fixe:0
                                    };
                                }
                            }
                        }
                    }
                }

                item.update(updateItem);
            }

            update[`system.MATabs`] = {
                'MAarmure':true,
                'MAmodule':false,
                'MAia':false,
            };
        }

        if (options?.force || MigrationKnight.needUpdate("1.4.8")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const listeEvolutions = item.system?.evolutions.liste;

                    for (let [key, evo] of Object.entries(listeEvolutions)) {
                        updateItem[`system.evolutions.liste.${key}.data`] = {
                            armure:0,
                            champDeForce:0,
                            energie:0
                        };
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.5.3")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            if(actor.type === 'vehicule') {
                update["system.armure.base"] = system.armure.max;
                update["system.armure.bonus"] = {};
                update["system.armure.malus"] = {};

                update["system.energie.base"] = system.energie.max;
                update["system.energie.bonus"] = {};
                update["system.energie.malus"] = {};

                update["system.champDeForce.base"] = system.champDeForce.value;
                update["system.champDeForce.bonus"] = {};
                update["system.champDeForce.malus"] = {};
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.3")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'arme') {
                    updateItem[`system.options2mains`] = {
                        has:false,
                        actuel:"1main"
                    };

                    updateItem[`system.effets2mains`] = {
                        raw:[],
                        custom:[],
                        liste:[]
                    };

                    updateItem[`system.optionsmunitions`] = {
                        has:false,
                        actuel:"0",
                        value:1,
                        liste:{}
                    };
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.4")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'arme') {
                    updateItem[`system.options2mains`] = {
                        "1main":{
                            degats:{
                                dice:0,
                                fixe:0
                            },
                            violence:{
                                dice:0,
                                fixe:0
                            }
                        },
                        "2main":{
                            degats:{
                                dice:0,
                                fixe:0
                            },
                            violence:{
                                dice:0,
                                fixe:0
                            }
                        }
                    };

                    const optionsmunitions = item.system.optionsmunitions.liste;
                    const length = Object.entries(optionsmunitions).length;

                    for(let i = 0;i < length;i++) {
                        updateItem[`system.optionsmunitions.liste.${i}`] = {
                            degats:{
                                dice:0,
                                fixe:0
                            },
                            violence:{
                                dice:0,
                                fixe:0
                            }
                        }
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.0")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const listeEvolutions = item.system.evolutions.liste;
                    const lengthEvolutions = Object.entries(listeEvolutions).length;

                    updateItem[`system.capacites.base.longbow`] = {
                        specialEvolutions:{
                            "1":{
                                value:50,
                                description:"",
                                effets:{
                                    liste1:{
                                    liste:[],
                                    raw:[
                                        "choc 1",
                                        "degatscontinus 3",
                                        "designation",
                                        "percearmure 40",
                                        "silencieux",
                                        "ultraviolence"
                                    ],
                                    custom:[]
                                    },
                                    liste2:{
                                    liste:[],
                                    raw:[
                                        "antivehicule",
                                        "artillerie",
                                        "dispersion 3",
                                        "lumiere 4",
                                        "penetrant 6",
                                        "percearmure 60"
                                    ],
                                    custom:[]
                                    },
                                    liste3:{
                                    label:"",
                                    acces:true,
                                    liste:[],
                                    raw:[
                                        "antianatheme",
                                        "demoralisant",
                                        "enchaine",
                                        "fureur",
                                        "ignorearmure",
                                        "penetrant 10"
                                    ],
                                    custom:[]
                                    }
                                }
                            },
                            "2":{
                                value:50,
                                description:"",
                                degats:{
                                    min:5,
                                    max:14
                                },
                                violence:{
                                    min:3,
                                    max:12
                                }
                            },
                            "3":{
                                value:50,
                                description:"",
                                effets:{
                                    base:{
                                        liste:[],
                                        raw:["assistanceattaque", "deuxmains"],
                                        custom:[]
                                    }
                                }
                            },
                            "4":{
                                value:100,
                                description:"",
                                effets:{
                                    liste1:{
                                        energie:1
                                    },
                                    liste2:{
                                        energie:1
                                    },
                                    liste3:{
                                        energie:4
                                    }
                                }
                            }
                        }
                    };
                    updateItem[`system.capacites.base.longbow.-=evolutions`] = null;

                    for(let i = 0;i < lengthEvolutions;i++) {
                        const hasLongbowEvo = listeEvolutions[i]?.capacites?.longbow || false;

                        if(hasLongbowEvo !== false) {
                            updateItem[`system.evolutions.liste.${i}.capacites.-=longbow`] = null;
                            updateItem[`system.evolutions.special.longbow.1`] = {
                                value:50,
                                description:"",
                                effets:{
                                    liste1:{
                                    liste:[],
                                    raw:[
                                        "choc 1",
                                        "degatscontinus 3",
                                        "designation",
                                        "percearmure 40",
                                        "silencieux",
                                        "ultraviolence"
                                    ],
                                    custom:[]
                                    },
                                    liste2:{
                                    liste:[],
                                    raw:[
                                        "antivehicule",
                                        "artillerie",
                                        "dispersion 3",
                                        "lumiere 4",
                                        "penetrant 6",
                                        "percearmure 60"
                                    ],
                                    custom:[]
                                    },
                                    liste3:{
                                    label:"",
                                    acces:true,
                                    liste:[],
                                    raw:[
                                        "antianatheme",
                                        "demoralisant",
                                        "enchaine",
                                        "fureur",
                                        "ignorearmure",
                                        "penetrant 10"
                                    ],
                                    custom:[]
                                    }
                                }
                            };
                            updateItem[`system.evolutions.special.longbow.2`] = {
                                value:50,
                                description:"",
                                degats:{
                                    min:5,
                                    max:14
                                },
                                violence:{
                                    min:3,
                                    max:12
                                }
                            };
                            updateItem[`system.evolutions.special.longbow.3`] = {
                                value:50,
                                description:"",
                                effets:{
                                    base:{
                                        liste:[],
                                        raw:["assistanceattaque", "deuxmains"],
                                        custom:[]
                                    }
                                }
                            };
                            updateItem[`system.evolutions.special.longbow.4`] = {
                                value:100,
                                description:"",
                                effets:{
                                    liste1:{
                                        energie:1
                                    },
                                    liste2:{
                                        energie:1
                                    },
                                    liste3:{
                                        energie:4
                                    }
                                }
                            };
                        }
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.2")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'module') {
                    updateItem[`system.jetsimple`] = {
                        has:false,
                        label:"",
                        jet:"0D0",
                        effets:{
                            raw:[],
                            custom:[]
                        }
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.3")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'module') {
                    updateItem[`system.arme.degats.variable.cout`] = 0;
                    updateItem[`system.arme.violence.variable.cout`] = 0;
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.5")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const hasLongbow = item.system.capacites.selected?.longbow || false;

                    updateItem[`system.capacites.base.longbow`] = {
                        distance:{
                            raw:[],
                            custom:[]
                        }
                    };

                    if(hasLongbow !== false) {
                        updateItem[`system.capacites.selected.longbow`] = {
                            distance:{
                                raw:[],
                                custom:[]
                            }
                        };
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.8")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const hasLongbow = item.system.capacites.selected?.longbow || false;

                    updateItem[`system.capacites.base.longbow`] = {
                        distance:{
                            raw:[],
                            custom:[]
                        }
                    };

                    if(hasLongbow !== false) {
                        updateItem[`system.capacites.selected.longbow`] = {
                            distance:{
                                raw:[],
                                custom:[]
                            }
                        };
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.9.1")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'arme') {
                    updateItem[`system.energie`] = 0;
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.9.8")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const hasIllumination = item.system.capacites.selected?.illumination || false;

                    updateItem[`system.capacites.atlasSpecial.illumination.evolutions.nbreCapacitesSelected`] = 3;
                    updateItem[`system.capacites.atlasSpecial.illumination.evolutions.nbreCapacitesTotale`] = 7;

                    if(hasIllumination !== false) {
                        updateItem[`system.capacites.selected.illumination.evolutions.nbreCapacitesSelected`] = 3;
                        updateItem[`system.capacites.selected.illumination.evolutions.nbreCapacitesTotale`] = 7;
                    }

                    const listeEvolutions = item.system?.evolutions.liste;

                    for (let [key, evo] of Object.entries(listeEvolutions)) {
                        const eIllumination = evo.capacites?.illumination || false;

                        updateItem[`system.evolutions.liste.${key}.data.espoir`] = 0;

                        if(eIllumination !== false) {
                            updateItem[`system.evolutions.liste.${key}.capacites.illumination.nbreCapacitesSelected`] = 3;
                            updateItem[`system.evolutions.liste.${key}.capacites.illumination.nbreCapacitesTotale`] = 7;
                        }
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.4")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const listeEvolutions = item.system?.evolutions.liste;

                    updateItem[`system.capacites.selected.-=data`] = null;

                    for (let [key, evo] of Object.entries(listeEvolutions)) {
                        updateItem[`system.evolutions.liste.${key}.capacites.-=data`] = null;
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.6")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const longbow = item.system?.capacites?.selected?.longbow || false;

                    if(longbow !== false) {
                        const distance = longbow?.distance || false;

                        if(!distance) {
                            updateItem[`system.capacites.selected.longbow.distance`] = {raw:[], custom:[]};
                        }
                    }
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.8")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'art') {
                    update[`system.aspects.dame`] = ['aura', 'parole', 'sangFroid'];
                }

                item.update(updateItem);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.3.3")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {


                if(item.type === 'module') {
                    update[`system.bonus.degats.variable.cout`] = 0;
                    update[`system.bonus.violence.variable.cout`] = 0;
                }

                if(item.type === 'armure') {
                    update[`system.capacites.codex.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                    update[`system.capacites.codex.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                    update[`system.capacites.codex.companions.crow.img`] = 'systems/knight/assets/crow.jpg';

                    const hasCompanions = item.system.capacites.selected?.companions || false;

                    if(hasCompanions !== false) {
                        update[`system.capacites.selected.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                        update[`system.capacites.selected.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                        update[`system.capacites.selected.companions.crow.img`] = 'systems/knight/assets/crow.jpg';
                    }
                }

                if(item.type === 'armurelegende') {
                    update[`system.capacites.all.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                    update[`system.capacites.all.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                    update[`system.capacites.all.companions.crow.img`] = 'systems/knight/assets/crow.jpg';

                    const hasCompanions = item.system.capacites.selected?.companions || false;

                    if(hasCompanions !== false) {
                        update[`system.capacites.selected.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                        update[`system.capacites.selected.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                        update[`system.capacites.selected.companions.crow.img`] = 'systems/knight/assets/crow.jpg';
                    }
                }

                item.update(update);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.0.0")) {

            const system = actor.system;

            if(!system) return update;

            update[`system.combat.nods.soin.recuperationBonus`] = 0;
            update[`system.combat.nods.armure.recuperationBonus`] = 0;
            update[`system.combat.nods.energie.recuperationBonus`] = 0;
            update[`system.energie.-=malus`] = null;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const itemUpdate = {};
                const itemSystem = item.system;

                if(item.type === 'module') {
                    itemUpdate[`system.niveau.value`] = 1;
                    itemUpdate[`system.niveau.max`] = 1;
                    itemUpdate[`system.niveau.liste`] = [1];
                    itemUpdate[`system.progression.n1`] = item.system.addOrder;
                    itemUpdate[`system.niveau.details`] = {
                        "n1":{
                            "permanent":itemSystem.permanent,
                            "rarete":itemSystem.rarete,
                            "prix":itemSystem.prix,
                            "energie":itemSystem.energie,
                            "activation":itemSystem.activation,
                            "duree":itemSystem.duree,
                            "portee":itemSystem.portee,
                            "listes":{},
                            "labels":{},
                            "aspects":{
                            "chair":{
                                "liste":{
                                "deplacement": {},
                                "force": {},
                                "endurance": {}
                                }
                            },
                            "bete":{
                                "liste":{
                                "hargne": {},
                                "combat": {},
                                "instinct": {}
                                }
                            },
                            "machine":{
                                "liste":{
                                "tir": {},
                                "savoir": {},
                                "technique": {}
                                }
                            },
                            "dame":{
                                "liste":{
                                "aura": {},
                                "parole": {},
                                "sangFroid": {}
                                }
                            },
                            "masque":{
                                "liste":{
                                "discretion": {},
                                "dexterite": {},
                                "perception": {}
                                }
                            }
                            },
                            "bonus":itemSystem.bonus,
                            "arme":itemSystem.arme,
                            "overdrives":itemSystem.overdrives,
                            "pnj":itemSystem.pnj,
                            "ersatz":itemSystem.ersatz,
                            "jetsimple":itemSystem.jetsimple,
                            "textarea":itemSystem.textarea
                        }
                    };

                    itemUpdate[`system.-=permanent`] = null;
                    itemUpdate[`system.-=rarete`] = null;
                    itemUpdate[`system.-=prix`] = null;
                    itemUpdate[`system.-=energie`] = null;
                    itemUpdate[`system.-=activation`] = null;
                    itemUpdate[`system.-=duree`] = null;
                    itemUpdate[`system.-=portee`] = null;
                    itemUpdate[`system.-=labels`] = null;
                    itemUpdate[`system.-=aspects`] = null;
                    itemUpdate[`system.-=bonus`] = null;
                    itemUpdate[`system.-=arme`] = null;
                    itemUpdate[`system.-=overdrives`] = null;
                    itemUpdate[`system.-=pnj`] = null;
                    itemUpdate[`system.-=ersatz`] = null;
                    itemUpdate[`system.-=jetsimple`] = null;
                    itemUpdate[`system.-=textarea`] = null;
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.1.1")) {
            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const itemUpdate = {};
                const itemSystem = item.system;

                if(item.type === 'module') {
                    const hasN1 = itemSystem?.niveau?.details?.n1?.gratuit || false;

                    if(itemSystem.gratuit && !hasN1) {
                        itemUpdate[`system.niveau.details.n1.gratuit`] = true;
                    }
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.1.2")) {

            const system = actor.system;

            if(!system) return update;

            update[`system.equipements.armure.slots.tete`] = 0;
            update[`system.equipements.armure.slots.torse`] = 0;
            update[`system.equipements.armure.slots.brasGauche`] = 0;
            update[`system.equipements.armure.slots.brasDroite`] = 0;
            update[`system.equipements.armure.slots.jambeDroite`] = 0;
            update[`system.equipements.armure.slots.jambeGauche`] = 0;
        }

        if (options?.force || MigrationKnight.needUpdate("3.1.4")) {

            const system = actor.system;

            if(!system) return update;

            update[`system.aspects.chair.bonus`] = 0;
            update[`system.aspects.bete.bonus`] = 0;
            update[`system.aspects.machine.bonus`] = 0;
            update[`system.aspects.dame.bonus`] = 0;
            update[`system.aspects.masque.bonus`] = 0;

            if(actor.type === 'knight') {
                update[`system.aspects.chair.caracteristiques.deplacement.bonus`] = 0;
                update[`system.aspects.chair.caracteristiques.endurance.bonus`] = 0;
                update[`system.aspects.chair.caracteristiques.force.bonus`] = 0;

                update[`system.aspects.bete.caracteristiques.combat.bonus`] = 0;
                update[`system.aspects.bete.caracteristiques.hargne.bonus`] = 0;
                update[`system.aspects.bete.caracteristiques.instinct.bonus`] = 0;

                update[`system.aspects.machine.caracteristiques.tir.bonus`] = 0;
                update[`system.aspects.machine.caracteristiques.technique.bonus`] = 0;
                update[`system.aspects.machine.caracteristiques.savoir.bonus`] = 0;

                update[`system.aspects.dame.caracteristiques.aura.bonus`] = 0;
                update[`system.aspects.dame.caracteristiques.parole.bonus`] = 0;
                update[`system.aspects.dame.caracteristiques.sangFroid.bonus`] = 0;

                update[`system.aspects.masque.caracteristiques.dexterite.bonus`] = 0;
                update[`system.aspects.masque.caracteristiques.discretion.bonus`] = 0;
                update[`system.aspects.masque.caracteristiques.perception.bonus`] = 0;
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.1.8")) {

            const system = actor.system;

            if(!system) return update;

            const listEffect = actor.getEmbeddedCollection('ActiveEffect');

            const toUpdate = [];

            for(let eff of listEffect) {
                toUpdate.push({
                    "_id":eff._id,
                    icon: ''
                });
            }

            updateEffect(actor, toUpdate);
        }

        if (options?.force || MigrationKnight.needUpdate("3.2.15")) {

            const system = actor.system;

            if(!system) return update;

            for (let item of actor.items) {
                const itemUpdate = {};

                if(item.type === 'module') {
                    const itemSystem = item.system;
                    const module = itemSystem.niveau.details;

                    for(let niv in module) {
                        itemUpdate[`system.niveau.details.${niv}.bonus.grenades.liste.-=[object Object]`] = null;
                    }
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.3.16")) {

            const system = actor.system;

            if(!system) return update;

            for (let item of actor.items) {
                const itemUpdate = {};

                if(item.type === 'module') {
                    const itemSystem = item.system;
                    const module = itemSystem.niveau.details;

                    for(let niv in module) {
                        itemUpdate[`system.niveau.details.${niv}.effets`] = {
                            has:false,
                            custom:[],
                            raw:[],
                            liste:[]
                        };
                    }
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.4.32")) {

            const system = actor.system;

            if(!system) return update;

            if(actor.type === 'pnj') {
                update[`system.metaarmure`] = "";
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.7.1")) {

            const system = actor.system;

            if(!system) return update;

            if(actor.type === 'knight') {
                update[`system.energie.malus`] = 0;
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.8.0")) {

            const system = actor.system;

            if(!system) return update;

            if(actor.type === 'knight') {
                update[`system.progression.gloire.versioning`] = '3.8.0';
                update[`system.progression.gloire.oldActuel`] = system.progression.gloire.actuel;
                update[`system.progression.gloire.total`] = Number(system.progression.gloire.actuel)+Number(system.progression.gloire.depense.total);

                update[`system.progression.experience.versioning`] = '3.8.0';
                update[`system.progression.experience.oldActuel`] = system.progression.experience.actuel;
                update[`system.progression.experience.total`] = Number(system.progression.experience.actuel)+Number(system.progression.experience.depense.total);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.9.2")) {

            const system = actor.system;

            if(!system) return update;

            if(actor.type === 'knight') {
                update[`system.progression.gloire.-=versioning`] = null;
                update[`system.progression.gloire.-=oldActuel`] = null;

                update[`system.progression.experience.-=versioning`] = null;
                update[`system.progression.experience.-=oldActuel`] = null;
            }

            for (let item of actor.items) {
                const itemUpdate = {};

                if(item.type === 'module') {
                    const itemSystem = item.system;
                    const module = itemSystem.niveau.details;

                    for(let niv in module) {
                        itemUpdate[`system.niveau.details.${niv}.arme.optionsmunitions`] = {
                            "has":false,
                            "actuel":"0",
                            "value":1,
                            "liste":{}
                        };
                    }
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.9.11")) {

            const system = actor.system;

            if(!system) return update;

            if(actor.type === 'knight') {
                actor.getEmbeddedCollection('ActiveEffect').delete();
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.9.12")) {

            const system = actor.system;

            if(!system) return update;

            if(actor.type === 'knight') {
                actor.deleteEmbeddedDocuments('ActiveEffect', actor.getEmbeddedCollection('ActiveEffect').toObject().map(eff => eff._id));
           }
        }

        if (options?.force || MigrationKnight.needUpdate("3.11.1")) {

            const system = actor.system;

            if(!system) return update;

            for (let item of actor.items) {
                const itemUpdate = {};

                if(item.type === 'armure') {
                    itemUpdate[`system.special.c2038Sorcerer.energiedeficiente`] = {
                        min:1,
                        max:3
                    };
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.11.5")) {

            const system = actor.system;

            if(!system) return update;

            for (let item of actor.items) {
                const itemUpdate = {};

                if(item.type === 'armure') {
                    const archives = item?.system?.archivage?.liste || {};

                    for(let n in archives) {
                        itemUpdate[`system.archivage.liste.${n}`] = JSON.stringify(archives[n]);
                    }
                }

                item.update(itemUpdate);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.11.7")) {

            const system = actor.system;

            if(!system) return update;

            for (let item of actor.items) {
                const itemUpdate = {};

                if(item.type === 'armure') {
                    const archives = item?.system?.archivage?.liste || {};

                    for(let n in archives) {
                        if(!typeof archives[n] === 'string') {
                            itemUpdate[`system.archivage.liste.${n}`] = JSON.stringify(archives[n]);
                        }
                    }

                    item.update(itemUpdate);
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.20.0")) {

            const system = actor.system;

            if(!system) return update;

            update['system.descriptionLimitee'] = "";
        }

        if (options?.force || MigrationKnight.needUpdate("3.21.0")) {

            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const updateItem = {};

                if(item.type === 'armure') {
                    const hasMorph = item.system.capacites.selected?.morph || false;

                    if(hasMorph !== false) {
                        updateItem[`system.capacites.selected.morph.phase`] = {
                            "energie":5,
                            "duree":"Spécial – 1 action pour 50 centimètres de matière"
                        };

                        updateItem[`system.capacites.selected.morph.phase.niveau2`] = {
                            "acces":false,
                            "activation":"aucune",
                            "energie":8,
                            "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                        };

                        updateItem[`system.capacites.selected.morph.textarea`] = {
                            "phaseDuree2":50
                        };
                    }

                    const listeEvolutions = item.system?.evolutions.liste;

                    for (let [key, evo] of Object.entries(listeEvolutions)) {
                        const eMorph = evo.capacites?.morph || false;

                        if(eMorph !== false) {
                            updateItem[`system.evolutions.liste.${key}.capacites.morph.phase`] = {
                                "energie":5,
                                "duree":"Spécial – 1 action pour 50 centimètres de matière"
                            };

                            updateItem[`system.evolutions.liste.${key}.capacites.morph.phase.niveau2`] = {
                                "acces":false,
                                "activation":"aucune",
                                "energie":8,
                                "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                            };

                            updateItem[`system.evolutions.liste.${key}.capacites.morph.textarea`] = {
                                "phaseDuree2":50
                            }
                        }
                    }

                    updateItem[`system.capacites.c2038Sorcerer.morph.phase`] = {
                        "energie":5,
                        "duree":"Spécial – 1 action pour 50 centimètres de matière"
                    };

                    updateItem[`system.capacites.c2038Sorcerer.morph.phase.niveau2`] = {
                        "acces":false,
                        "activation":"aucune",
                        "energie":8,
                        "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                    };

                    updateItem[`system.capacites.c2038Sorcerer.morph.textarea`] = {
                        "phaseDuree2":50
                    };

                    updateItem[`system.capacites.c2038Sorcerer.morph.evolutions`] = {
                        "phase":{
                            "energie":5,
                            "duree":"Spécial – 1 action pour 50 centimètres de matière",
                            "niveau2":{
                                "acces":false,
                                "activation":"aucune",
                                "energie":8,
                                "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                            }
                        },
                        "textarea":{
                            "phaseDuree2":50
                        }
                    };
                }

                if(item.type === 'module') {
                    updateItem[`system.secondmode`] = {
                        "has":false,
                        "activation":"aucune",
                    }
                }

                if(item.type === 'arme') {
                    updateItem[`system.degats`] = {
                        "variable":{
                            "has":false,
                            "min":{
                            "dice":0,
                            "fixe":0
                            },
                            "max":{
                            "dice":0,
                            "fixe":0
                            },
                            "cout":0
                        }
                    };

                    updateItem[`system.violence`] = {
                        "variable":{
                            "has":false,
                            "min":{
                            "dice":0,
                            "fixe":0
                            },
                            "max":{
                            "dice":0,
                            "fixe":0
                            },
                            "cout":0
                        }
                    };
                }

                item.update(updateItem);
            }

            update[`system.-=MATabs`] = null;
        }

        if (options?.force || MigrationKnight.needUpdate("3.21.12")) {

            const system = actor.system;

            if(!system) return update;

            let collection = actor.getEmbeddedCollection('ActiveEffect').filter(eff => eff.label === "style").map(eff => eff._id);

            collection.forEach(async eff => {
                await actor.deleteEmbeddedDocuments('ActiveEffect', [eff]);
            });
        }

        if (options?.force || MigrationKnight.needUpdate("3.29.3")) {

            for (let item of actor.items) {
                let update = {};

                if(item.type === 'module') {
                    const niv = item.system.niveau.details;

                    for(let n in niv) {
                        update[`system.niveau.details.${n}.pnj.modele.sante`] = 0;

                        for(let l in niv[n].pnj.liste) {
                            update[`system.niveau.details.${n}.pnj.liste.${l}.sante`] = 0;
                        }
                    }

                    item.update(update);
                }
            }
        }*/

        if(options?.force || MigrationKnight.needUpdate("3.30.0")) {
            let collection = actor.getEmbeddedCollection('ActiveEffect').map(eff => eff._id);

            collection.forEach(async eff => {
                if(eff) await actor.deleteEmbeddedDocuments('ActiveEffect', [eff]);
            });
        }

        return update;
    }

    static _migrationItems(item, options = { force:false }) {
        let update = {};

        /*if (options?.force || MigrationKnight.needUpdate("1.2.0")) {
            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                const vEnergieT = system.energie.tour;
                const vEnergieM = system.energie.minute;

                if(!isNaN(vEnergieT)) {
                    update["system.energie.tour"] = {
                        value:vEnergieT,
                        label:""
                    };
                }

                if(!isNaN(vEnergieM)) {
                    update["system.energie.minute"] = {
                        value:vEnergieM,
                        label:""
                    };
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.0")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'arme') {
                const rarete = system?.rarete || false;
                const liste = system?.listes || false;

                if(rarete === false) update['system.rarete'] = 'standard';
                if(liste === false) update['system.listes'] = {};
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.2")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const listeEvolutions = system?.evolutions.liste;

                for (let [key, evo] of Object.entries(listeEvolutions)) {
                    const eGoliath = evo.capacites?.goliath || false;
                    const eBarbarian = evo.capacites?.barbarian || false;

                    if(eGoliath !== false && eBarbarian !== false) {
                        update[`system.evolutions.liste.${key}.capacites.goliath`] = eBarbarian.selected;
                        update[`system.evolutions.liste.${key}.capacites.-=barbarian`] = null;
                    }
                }
            }

            if(item.type === 'armurelegende') {
                const alBarbarian = system.capacites?.barbarian || false;
                const alGoliath = system.capacites.selected?.goliath || false;

                if(alGoliath !== false && alBarbarian !== false) {
                    update[`system.capacites.selected.selected.goliath`] = alBarbarian.selected;
                    update[`system.capacites.-=barbarian`] = null;
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.5")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                const isPNJ = system.pnj.has;
                const listePNJ = system.pnj.liste;

                update[`system.pnj.modele.armes.modele.attaque`] = {
                    dice:0,
                    fixe:0
                };

                if(isPNJ) {
                    for (let [key, pnj] of Object.entries(listePNJ)) {
                        const hasWPN = pnj.armes.has;
                        const listePNJWPN = pnj.armes.liste;

                        update[`system.pnj.liste.${key}.armes.modele.attaque`] = {
                            dice:0,
                            fixe:0
                        };

                        if(hasWPN) {
                            for (let [kWPN, wpn] of Object.entries(listePNJWPN)) {

                                update[`system.pnj.liste.${key}.armes.liste.${kWPN}.attaque`] = {
                                    dice:0,
                                    fixe:0
                                };
                            }
                        }
                    }
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.4.8")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const listeEvolutions = system?.evolutions.liste;

                for (let [key, evo] of Object.entries(listeEvolutions)) {
                    update[`system.evolutions.liste.${key}.data`] = {
                        armure:0,
                        champDeForce:0,
                        energie:0
                    };
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.3")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'arme') {
                update[`system.options2mains`] = {
                    has:false,
                    actuel:"1main"
                };

                update[`system.effets2mains`] = {
                    raw:[],
                    custom:[],
                    liste:[]
                };

                update[`system.optionsmunitions`] = {
                    has:false,
                    actuel:"0",
                    value:1,
                    liste:{}
                };
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.4")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'arme') {
                update[`system.options2mains`] = {
                    "1main":{
                        degats:{
                            dice:0,
                            fixe:0
                        },
                        violence:{
                            dice:0,
                            fixe:0
                        }
                    },
                    "2main":{
                        degats:{
                            dice:0,
                            fixe:0
                        },
                        violence:{
                            dice:0,
                            fixe:0
                        }
                    }
                };

                const optionsmunitions = item.system.optionsmunitions.liste;
                const length = Object.entries(optionsmunitions).length;

                for(let i = 0;i < length;i++) {
                    update[`system.optionsmunitions.liste.${i}`] = {
                        degats:{
                            dice:0,
                            fixe:0
                        },
                        violence:{
                            dice:0,
                            fixe:0
                        }
                    }
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.0")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const listeEvolutions = item.system.evolutions.liste;
                const lengthEvolutions = Object.entries(listeEvolutions).length;

                update[`system.capacites.base.longbow`] = {
                    specialEvolutions:{
                        "1":{
                            value:50,
                            description:"",
                            effets:{
                                liste1:{
                                liste:[],
                                raw:[
                                    "choc 1",
                                    "degatscontinus 3",
                                    "designation",
                                    "percearmure 40",
                                    "silencieux",
                                    "ultraviolence"
                                ],
                                custom:[]
                                },
                                liste2:{
                                liste:[],
                                raw:[
                                    "antivehicule",
                                    "artillerie",
                                    "dispersion 3",
                                    "lumiere 4",
                                    "penetrant 6",
                                    "percearmure 60"
                                ],
                                custom:[]
                                },
                                liste3:{
                                label:"",
                                acces:true,
                                liste:[],
                                raw:[
                                    "antianatheme",
                                    "demoralisant",
                                    "enchaine",
                                    "fureur",
                                    "ignorearmure",
                                    "penetrant 10"
                                ],
                                custom:[]
                                }
                            }
                        },
                        "2":{
                            value:50,
                            description:"",
                            degats:{
                                min:5,
                                max:14
                            },
                            violence:{
                                min:3,
                                max:12
                            }
                        },
                        "3":{
                            value:50,
                            description:"",
                            effets:{
                                base:{
                                    liste:[],
                                    raw:["assistanceattaque", "deuxmains"],
                                    custom:[]
                                }
                            }
                        },
                        "4":{
                            value:100,
                            description:"",
                            effets:{
                                liste1:{
                                    energie:1
                                },
                                liste2:{
                                    energie:1
                                },
                                liste3:{
                                    energie:4
                                }
                            }
                        }
                    }
                };
                update[`system.capacites.base.longbow.-=evolutions`] = null;

                for(let i = 0;i < lengthEvolutions;i++) {
                    const hasLongbowEvo = listeEvolutions[i]?.capacites?.longbow || false;

                    if(hasLongbowEvo !== false) {
                        update[`system.evolutions.liste.${i}.capacites.-=longbow`] = null;
                        update[`system.evolutions.special.longbow.1`] = {
                            value:50,
                            description:"",
                            effets:{
                                liste1:{
                                liste:[],
                                raw:[
                                    "choc 1",
                                    "degatscontinus 3",
                                    "designation",
                                    "percearmure 40",
                                    "silencieux",
                                    "ultraviolence"
                                ],
                                custom:[]
                                },
                                liste2:{
                                liste:[],
                                raw:[
                                    "antivehicule",
                                    "artillerie",
                                    "dispersion 3",
                                    "lumiere 4",
                                    "penetrant 6",
                                    "percearmure 60"
                                ],
                                custom:[]
                                },
                                liste3:{
                                label:"",
                                acces:true,
                                liste:[],
                                raw:[
                                    "antianatheme",
                                    "demoralisant",
                                    "enchaine",
                                    "fureur",
                                    "ignorearmure",
                                    "penetrant 10"
                                ],
                                custom:[]
                                }
                            }
                        };
                        update[`system.evolutions.special.longbow.2`] = {
                            value:50,
                            description:"",
                            degats:{
                                min:5,
                                max:14
                            },
                            violence:{
                                min:3,
                                max:12
                            }
                        };
                        update[`system.evolutions.special.longbow.3`] = {
                            value:50,
                            description:"",
                            effets:{
                                base:{
                                    liste:[],
                                    raw:["assistanceattaque", "deuxmains"],
                                    custom:[]
                                }
                            }
                        };
                        update[`system.evolutions.special.longbow.4`] = {
                            value:100,
                            description:"",
                            effets:{
                                liste1:{
                                    energie:1
                                },
                                liste2:{
                                    energie:1
                                },
                                liste3:{
                                    energie:4
                                }
                            }
                        };
                    }
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.2")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                update[`system.jetsimple`] = {
                    has:false,
                    label:"",
                    jet:"0D0",
                    effets:{
                        raw:[],
                        custom:[]
                    }
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.3")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                update[`system.arme.degats.variable.cout`] = 0;
                update[`system.arme.violence.variable.cout`] = 0;
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.5")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const hasLongbow = system.capacites.selected?.longbow || false;

                update[`system.capacites.base.longbow`] = {
                    distance:{
                        raw:[],
                        custom:[]
                    }
                };

                if(hasLongbow !== false) {
                    update[`system.capacites.selected.longbow`] = {
                        distance:{
                            raw:[],
                            custom:[]
                        }
                    };
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.8")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const hasLongbow = system.capacites.selected?.longbow || false;

                update[`system.capacites.base.longbow`] = {
                    distance:{
                        raw:[],
                        custom:[]
                    }
                };

                if(hasLongbow !== false) {
                    update[`system.capacites.selected.longbow`] = {
                        distance:{
                            raw:[],
                            custom:[]
                        }
                    };
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.9.1")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'arme') {
                update[`system.energie`] = 0;
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.9.8")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const hasIllumination = item.system.capacites.selected?.illumination || false;

                update[`system.capacites.atlasSpecial.illumination.evolutions.nbreCapacitesSelected`] = 3;
                update[`system.capacites.atlasSpecial.illumination.evolutions.nbreCapacitesTotale`] = 7;

                if(hasIllumination !== false) {
                    update[`system.capacites.selected.illumination.evolutions.nbreCapacitesSelected`] = 3;
                    update[`system.capacites.selected.illumination.evolutions.nbreCapacitesTotale`] = 7;
                }

                const listeEvolutions = item.system?.evolutions.liste;

                for (let [key, evo] of Object.entries(listeEvolutions)) {
                    const eIllumination = evo.capacites?.illumination || false;

                    update[`system.evolutions.liste.${key}.data.espoir`] = 0;

                    if(eIllumination !== false) {
                        update[`system.evolutions.liste.${key}.capacites.illumination.nbreCapacitesSelected`] = 3;
                        update[`system.evolutions.liste.${key}.capacites.illumination.nbreCapacitesTotale`] = 7;
                    }
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.4")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const listeEvolutions = item.system?.evolutions.liste;

                update[`system.capacites.selected.capacites.-=data`] = null;

                for (let [key, evo] of Object.entries(listeEvolutions)) {
                    update[`system.evolutions.liste.${key}.capacites.-=data`] = null;
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.6")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const longbow = item.system?.capacites?.selected?.longbow || false;

                if(longbow !== false) {
                    const distance = longbow?.distance || false;

                    if(!distance) {
                        update[`system.capacites.selected.longbow.distance`] = {raw:[], custom:[]};
                    }
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.8")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'art') {
                update[`system.aspects.dame`] = ['aura', 'parole', 'sangFroid'];
            }
        }

        if (options?.force || MigrationKnight.needUpdate("2.3.3")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                update[`system.bonus.degats.variable.cout`] = 0;
                update[`system.bonus.violence.variable.cout`] = 0;
            }

            if(item.type === 'armure') {
                update[`system.capacites.codex.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                update[`system.capacites.codex.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                update[`system.capacites.codex.companions.crow.img`] = 'systems/knight/assets/crow.jpg';

                const hasCompanions = item.system.capacites.selected?.companions || false;

                if(hasCompanions !== false) {
                    update[`system.capacites.selected.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                    update[`system.capacites.selected.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                    update[`system.capacites.selected.companions.crow.img`] = 'systems/knight/assets/crow.jpg';
                }
            }

            if(item.type === 'armurelegende') {
                update[`system.capacites.all.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                update[`system.capacites.all.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                update[`system.capacites.all.companions.crow.img`] = 'systems/knight/assets/crow.jpg';

                const hasCompanions = item.system.capacites.selected?.companions || false;

                if(hasCompanions !== false) {
                    update[`system.capacites.selected.companions.lion.img`] = 'systems/knight/assets/lion.jpg';
                    update[`system.capacites.selected.companions.wolf.img`] = 'systems/knight/assets/wolf.jpg';
                    update[`system.capacites.selected.companions.crow.img`] = 'systems/knight/assets/crow.jpg';
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.0.0")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                update[`system.niveau.value`] = 1;
                update[`system.niveau.max`] = 1;
                update[`system.niveau.liste`] = [1];
                update[`system.niveau.details`] = {
                    "n1":{
                        "permanent":system.permanent,
                        "rarete":system.rarete,
                        "prix":system.prix,
                        "energie":system.energie,
                        "activation":system.activation,
                        "duree":system.duree,
                        "portee":system.portee,
                        "listes":{},
                        "labels":{},
                        "aspects":{
                        "chair":{
                            "liste":{
                            "deplacement": {},
                            "force": {},
                            "endurance": {}
                            }
                        },
                        "bete":{
                            "liste":{
                            "hargne": {},
                            "combat": {},
                            "instinct": {}
                            }
                        },
                        "machine":{
                            "liste":{
                            "tir": {},
                            "savoir": {},
                            "technique": {}
                            }
                        },
                        "dame":{
                            "liste":{
                            "aura": {},
                            "parole": {},
                            "sangFroid": {}
                            }
                        },
                        "masque":{
                            "liste":{
                            "discretion": {},
                            "dexterite": {},
                            "perception": {}
                            }
                        }
                        },
                        "bonus":system.bonus,
                        "arme":system.arme,
                        "overdrives":system.overdrives,
                        "pnj":system.pnj,
                        "ersatz":system.ersatz,
                        "jetsimple":system.jetsimple,
                        "textarea":system.textarea
                    }
                };
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.2.15")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                const module = system.niveau.details;

                for(let niv in module) {
                    update[`system.niveau.details.${niv}.bonus.grenades.liste.-=[object Object]`] = null;
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.3.16")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                const module = system.niveau.details;

                for(let niv in module) {
                    update[`system.niveau.details.${niv}.effets`] = {
                        has:false,
                        custom:[],
                        raw:[],
                        liste:[]
                    };
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.9.4")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                const itemSystem = item.system;
                const module = itemSystem.niveau.details;

                for(let niv in module) {
                    update[`system.niveau.details.${niv}.arme.optionsmunitions`] = {
                        "has":false,
                        "actuel":"0",
                        "value":1,
                        "liste":{}
                    };
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.11.1")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                update[`system.special.c2038Sorcerer.energiedeficiente`] = {
                    min:1,
                    max:3
                };
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.21.0")) {

            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const hasMorph = system.capacites.selected?.morph || false;

                if(hasMorph !== false) {
                    update[`system.capacites.selected.morph.phase`] = {
                        "energie":5,
                        "duree":"Spécial – 1 action pour 50 centimètres de matière"
                    };

                    update[`system.capacites.selected.morph.phase.niveau2`] = {
                        "acces":false,
                        "activation":"aucune",
                        "energie":8,
                        "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                    };

                    update[`system.capacites.selected.morph.textarea`] = {
                        "phaseDuree2":50
                    };
                }

                const listeEvolutions = item.system?.evolutions.liste;

                for (let [key, evo] of Object.entries(listeEvolutions)) {
                    const eMorph = evo.capacites?.morph || false;

                    if(eMorph !== false) {
                        update[`system.evolutions.liste.${key}.capacites.morph.phase`] = {
                            "energie":5,
                            "duree":"Spécial – 1 action pour 50 centimètres de matière"
                        };

                        update[`system.evolutions.liste.${key}.capacites.morph.phase.niveau2`] = {
                            "acces":false,
                            "activation":"aucune",
                            "energie":8,
                            "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                        };

                        update[`system.evolutions.liste.${key}.capacites.morph.textarea`] = {
                            "phaseDuree2":50
                        }
                    }
                }

                update[`system.capacites.c2038Sorcerer.morph.phase`] = {
                    "energie":5,
                    "duree":"Spécial – 1 action pour 50 centimètres de matière"
                };

                update[`system.capacites.c2038Sorcerer.morph.phase.niveau2`] = {
                    "acces":false,
                    "activation":"aucune",
                    "energie":8,
                    "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                };

                update[`system.capacites.c2038Sorcerer.morph.textarea`] = {
                    "phaseDuree2":50
                };

                update[`system.capacites.c2038Sorcerer.morph.evolutions`] = {
                    "phase":{
                        "energie":5,
                        "duree":"Spécial – 1 action pour 50 centimètres de matière",
                        "niveau2":{
                            "acces":false,
                            "activation":"aucune",
                            "energie":8,
                            "duree":game.i18n.localize("KNIGHT.DUREE.Instantanee")
                        }
                    },
                    "textarea":{
                        "phaseDuree2":50
                    }
                };
            }

            if(item.type === 'module') {
                update[`system.secondmode`] = {
                    "has":false,
                    "activation":"aucune",
                }
            }
        }

        if (options?.force || MigrationKnight.needUpdate("3.29.3")) {

            const system = item.system;

            if(!system) return update;

            let update = {};

            if(item.type === 'module') {
                const niv = item.system.niveau.details;

                for(let n in niv) {
                    update[`system.niveau.details.${n}.pnj.modele.sante`] = 0;

                    for(let l in niv[n].pnj.liste) {
                        update[`system.niveau.details.${n}.pnj.liste.${l}.sante`] = 0;
                    }
                }

                item.update(update);
            }
        }*/

        return update;
    }

    static _migrationTokens(token, options = { force:false }) {
        const actor = token.actor;

        /*if (options?.force || MigrationKnight.needUpdate("3.17.4")) {
            const goodStatus = ['dead', 'lumiere', 'barrage', 'designation', 'choc', 'degatscontinus', 'soumission'];

            if(actor === null) return;

            const collection = actor.getEmbeddedCollection('ActiveEffect').filter(eff => eff?.flags?.core?.statusId || '' !== '' && !goodStatus.includes(eff?.flags?.core?.statusId || '')).map(eff => eff._id);

            token.actor.deleteEmbeddedDocuments('ActiveEffect', collection);

            const correctedImg = actor.getEmbeddedCollection('ActiveEffect').filter(eff => eff.icon == "/icons/svg/mystery-man.svg");
            correctedImg.forEach(async eff => {
                await updateEffect(actor, [{
                    "_id":eff._id,
                    icon:''
                }]);
            });
        }

        if (options?.force || MigrationKnight.needUpdate("3.21.12")) {
            if(actor === null) return;

            let collection = actor.getEmbeddedCollection('ActiveEffect').filter(eff => eff.label === "style").map(eff => eff._id);

            collection.forEach(async eff => {
                await token.actor.deleteEmbeddedDocuments('ActiveEffect', [eff]);
            });
        }*/

        if(options?.force || MigrationKnight.needUpdate("3.30.0")) {
            /*if(actor === null || token.actorLink) return;

            let collection = actor.getEmbeddedCollection('ActiveEffect').map(eff => eff._id);

            collection.forEach(async eff => {
                if(eff) await actor.deleteEmbeddedDocuments('ActiveEffect', [eff]);
            });*/
        }
    }
 }