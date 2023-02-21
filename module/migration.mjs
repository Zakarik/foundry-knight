/*
Applique les modifications par la mise à jour au Monde.
*/
 export class MigrationKnight {
    static NEEDED_VERSION = "2.3.3";

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

        // Migrate World Compendium Packs
        for (let pack of game.packs) {
            if (pack.metadata.packageType !== "world" || !["Actor", "Item", "Scene"].includes(pack.metadata.type)) {
                continue;
            }
            await MigrationKnight._migrateCompendium(pack, options);
        }

        await game.settings.set("knight", "systemVersion", game.system.version);
        ui.notifications.info(`Migration du système de Knight à la version ${game.system.version} terminé!`, {
            permanent: true,
        });

        if(MigrationKnight.needUpdate("1.8.0")) {
            ui.notifications.info(`Suite à une modification du système, la Ranger voit son système d'évolution modifié !
            Si vous avez une Ranger dans votre équipe et qu'elle n'a pas encore eu d'évolution : Aucun problème.
            Si vous avez une Ranger qui a déjà évolué, il est possible qu'elle doive racheter ses évolutions, ou recréer son armure : Vérifiez bien.
            Désolé pour le dérangement`, {
                permanent: true,
            });
        }
    }

    static _migrationActor(actor, options = { force:false }) {
        if (options?.force || MigrationKnight.needUpdate("1.2.0")) {
            const update = {};
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

            actor.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.4")) {
            const update = {};
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

            actor.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.5")) {
            const update = {};
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

            actor.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.4.8")) {
            const update = {};
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
            const update = {};
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

                actor.update(update);
            }
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.3")) {
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
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
            const update = {};
            const system = actor.system;

            if(!system) return update;

            // MISE A JOUR DES ITEMS PORTES
            for (let item of actor.items) {
                const update = {};

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
    }

    static _migrationItems(item, options = { force:false }) {
        if (options?.force || MigrationKnight.needUpdate("1.2.0")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.0")) {
            const update = {};
            const system = item.system;

            if(!system) return update;

            if(item.type === 'arme') {
                const rarete = system?.rarete || false;
                const liste = system?.listes || false;

                if(rarete === false) update['system.rarete'] = 'standard';
                if(liste === false) update['system.listes'] = {};
            }

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.2")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.3.5")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.4.8")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.3")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.7.4")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.0")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.2")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.3")) {
            const update = {};
            const system = item.system;

            if(!system) return update;

            if(item.type === 'module') {
                update[`system.arme.degats.variable.cout`] = 0;
                update[`system.arme.violence.variable.cout`] = 0;
            }

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.5")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.8.8")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.9.1")) {
            const update = {};
            const system = item.system;

            if(!system) return update;

            if(item.type === 'arme') {
                update[`system.energie`] = 0;
            }

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("1.9.8")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.4")) {
            const update = {};
            const system = item.system;

            if(!system) return update;

            if(item.type === 'armure') {
                const listeEvolutions = item.system?.evolutions.liste;

                update[`system.capacites.selected.capacites.-=data`] = null;

                for (let [key, evo] of Object.entries(listeEvolutions)) {
                    update[`system.evolutions.liste.${key}.capacites.-=data`] = null;
                }
            }

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.6")) {
            const update = {};
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

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("2.0.8")) {
            const update = {};
            const system = item.system;

            if(!system) return update;

            if(item.type === 'art') {
                update[`system.aspects.dame`] = ['aura', 'parole', 'sangFroid'];
            }

            item.update(update);
        }

        if (options?.force || MigrationKnight.needUpdate("2.3.3")) {
            const update = {};
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

            item.update(update);
        }
    }
 }