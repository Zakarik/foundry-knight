/*
Applique les modifications par la mise à jour au Monde.
*/
 export class MigrationKnight {
    static NEEDED_VERSION = "1.5.3";

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

        await game.settings.set("knight", "systemVersion", game.system.version);
        ui.notifications.info(`Migration du système de Knight à la version ${game.system.version} terminé!`, {
            permanent: true,
        });
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
    }
 }