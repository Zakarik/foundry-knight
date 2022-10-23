/*
Applique les modifications par la mise à jour au Monde.
*/
 export class MigrationKnight {
    static NEEDED_VERSION = "1.3.4";

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

                console.log(item);

                if(item.type === 'armure') {
                    const listeEvolutions = item.system?.evolutions.liste;
    
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
                    const alBarbarian = item.system.capacites?.barbarian || false;
                    const alGoliath = item.system.capacites.selected?.goliath || false;
    
                    if(alGoliath !== false && alBarbarian !== false) {
                        update[`system.capacites.selected.selected.goliath`] = alBarbarian.selected;
                        update[`system.capacites.-=barbarian`] = null;
                    }
                }

                item.update(updateItem);
            }

            actor.update(update);
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
    }
 }