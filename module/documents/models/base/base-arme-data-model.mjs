import { BaseItemDataModel } from "./base-item-data-model.mjs";
import PatchBuilder from "../../../utils/patchBuilder.mjs";
import {
  getAllEffects,
} from "../../../helpers/common.mjs";
/**
 * Modèle de données de base pour tous les items du système Knight.
 * Cette classe abstraite définit le schéma commun et les méthodes partagées
 * @extends {BaseItemDataModel}
 */
export class BaseArmeDataModel extends BaseItemDataModel {

    /**
     * Définit le schéma de données commun à tous les items.
     * @returns {Object} Le schéma de données avec les champs suivants :
     * - description : Description HTML complète de l'item
     */
    static defineSchema() {
        const base = super.defineSchema();
        const specific = {};
        return foundry.utils.mergeObject(base, specific);
    }

    get wpnPath() {
        return `system.`;
    }

    get hasMunition() {
        const wpnPath = this.wpnPath;
        const type = foundry.utils.getProperty(this.item, `${wpnPath}type`);
        let result = true;

        if(type === 'contact') {
            const options2mains = foundry.utils.getProperty(this.item, `${wpnPath}options2mains`);

            if(options2mains?.has) {
                const actuel = options2mains?.actuel ?? '1main';
                const effets = actuel === '1main' ? foundry.utils.getProperty(this.item, `${wpnPath}effets`) : foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);
                const findChargeur = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;

                if(!findChargeur) return;

                const chargeurMax = parseInt(findChargeur.split(' ')[1]);

                let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                if(chargeur === 0) result = false;

            } else {
                const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
                const findChargeur = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;

                if(!findChargeur) return;

                const chargeurMax = parseInt(findChargeur.split(' ')[1]);

                let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                if(chargeur === 0) result = false;
            }
        }
        else if(type === 'distance') {
            const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
            const findChargeurBase = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;

            if(findChargeurBase) {
                const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
                const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                if(chargeurActuel !== 0 && result) result = true;
                else result = false;
            };
            const optionsmunitions = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions`);

            if(optionsmunitions?.has) {
                const actuel = optionsmunitions.actuel;
                const munition = optionsmunitions?.liste?.[actuel];

                if(munition) {
                    const effetsMunition = munition;
                    const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

                    if(findChargeurMunition) {
                        const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

                        let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

                        if(chargeurMunition !== 0 && result) result = true;
                        else result = false;
                    }
                }
            }
        }

        return result;
    }

    get qtyMunition() {
        const wpnPath = this.wpnPath;
        const type = foundry.utils.getProperty(this.item, `${wpnPath}type`);
        let result = 0;

        if(type === 'contact') {
            const options2mains = foundry.utils.getProperty(this.item, `${wpnPath}options2mains`);

            if(options2mains?.has) {
                const actuel = options2mains?.actuel ?? '1main';
                const effets = actuel === '1main' ? foundry.utils.getProperty(this.item, `${wpnPath}effets`) : foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);
                const findChargeur = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;

                if(!findChargeur) return;

                const chargeurMax = parseInt(findChargeur.split(' ')[1]);

                let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                result = chargeur;

            } else {
                const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
                const findChargeur = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;

                if(!findChargeur) return;

                const chargeurMax = parseInt(findChargeur.split(' ')[1]);

                let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                result = chargeur;
            }
        }
        else if(type === 'distance') {
            const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
            const findChargeurBase = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;

            if(findChargeurBase) {
                const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
                const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                result = chargeurActuel;
            };
            const optionsmunitions = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions`);

            if(optionsmunitions?.has) {
                const actuel = optionsmunitions.actuel;
                const munition = optionsmunitions?.liste?.[actuel];

                if(munition) {
                    const effetsMunition = munition;
                    const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

                    if(findChargeurMunition) {
                        const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

                        let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

                        result = chargeurMunition;
                    }
                }
            }
        }

        return result;
    }

    get allEffects() {
        const wpnPath = this.wpnPath;
        const type = foundry.utils.getProperty(this.item, `${wpnPath}type`);
        const options2mains = foundry.utils.getProperty(this.item, `${wpnPath}options2mains`);
        const optionsmunitions = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions`);
        const effects = [];

        if(options2mains?.has && options2mains?.actuel === '2main') {
            effects.push(...foundry.utils.getProperty(this.item, `${wpnPath}effets2mains.raw`) ?? []);
        }

        if((options2mains?.has && options2mains?.actuel === '1main') || !options2mains?.has) {
            effects.push(...foundry.utils.getProperty(this.item, `${wpnPath}effets.raw`) ?? []);
        }

        if(type === 'distance') {
            effects.push(...foundry.utils.getProperty(this.item, `${wpnPath}distance.raw`) ?? []);

            if(optionsmunitions?.has) {
                const actuel = optionsmunitions.actuel;
                effects.push(...foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions.liste.${actuel}.raw`) ?? [])
            }
        } else if(type === 'contact') effects.push(...foundry.utils.getProperty(this.item, `${wpnPath}ornementales.raw`) ?? [], ...foundry.utils.getProperty(this.item, `${wpnPath}structurelles.raw`) ?? []);

        return effects;
    }

    get actorArmor() {
        return this.actor.system.dataArmor;
    }

    async toggleEffect(index, type, munition) {
        const wpnPath = this.wpnPath;
        let data = undefined;
        let activable = undefined;
        let actuel = undefined;
        let path = wpnPath;
        let update = {};

        switch(type) {
            case 'base':
            data = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
            path += `effets.activable`;
            break;

            case '2mains':
            data = foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);
            path += `effets2mains.activable`;
            break;

            case 'munition':
            data = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions.liste.${munition}`);
            path += `optionsmunitions.liste.${munition}.activable`;
            break;
        }

        if(!data) return;

        activable = data?.activable ?? undefined;
        actuel = activable?.[index]?.active ?? false;

        const armure = actorArmor;

        if(!actuel) {
            const depense = await this.usePEActivateEffets(armure, this.item.name, activable[index]);

            if(!depense) return;
        }

        activable[index].active = !actuel;

        foundry.utils.setProperty(update, path, activable);
        this.item.update(update);

        const allLabels = getAllEffects();

        const splitEffect = activable[index].key.split(" ");
        const secondSplitEffect = splitEffect[0].split("<space>");
        const nameEffect = game.i18n.localize(allLabels[secondSplitEffect[0]].label);
        const otherEffect = Object.values(secondSplitEffect);
        const subEffect = splitEffect[1];
        let complet = nameEffect;

        if(otherEffect.length > 1) {
            otherEffect.splice(0, 1);
            complet += ` ${otherEffect.join(" ").replace("<space>", " ")}`;
        }

        if(subEffect != undefined) { complet += " "+subEffect; }

        const exec = new game.knight.RollKnight(this.actor,
        {
            name:this.item.name,
        }).sendMessage({
            text:!actuel ? `${complet} : ${game.i18n.localize('KNIGHT.AUTRE.Activer')}` : `${complet} : ${game.i18n.localize('KNIGHT.AUTRE.Desactiver')}`,
            classes:'important',
        });
    }

    addMunition(index, type, munition) {
        const wpnPath = this.wpnPath;
        let data = undefined;
        let chargeur = undefined;
        let actuel = undefined;
        let path = wpnPath;
        let update = {};

        switch(type) {
            case 'base':
            data = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
            path += 'effets.chargeur';
            break;

            case '2mains':
            data = foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);
            path += 'effets2mains.chargeur';
            break;

            case 'munition':
            data = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions.liste.${munition}`);
            path += `optionsmunitions.liste.${munition}.chargeur`;
            break;
        }

        chargeur = data?.raw?.[index] ?? undefined;

        if(!data || !chargeur) return;
        if(!chargeur.includes('chargeur')) return;

        const max = parseInt(chargeur.split(' ')[1]);
        actuel = data?.chargeur ?? max;

        foundry.utils.setProperty(update, path, Math.min(actuel+1, max));

        this.item.update(update);

        const exec = new game.knight.RollKnight(this.actor,
        {
            name:this.item.name,
        }).sendMessage({
            text:game.i18n.localize('KNIGHT.JETS.Remet1Charge'),
            classes:'important',
        });
    }

    removeMunition(index, type, munition) {
        const wpnPath = this.wpnPath;
        let data = undefined;
        let chargeur = undefined;
        let actuel = undefined;
        let path = wpnPath;
        let update = {};

        switch(type) {
            case 'base':
            data = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
            path += 'effets.chargeur';
            break;

            case '2mains':
            data = foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);
            path += 'effets2mains.chargeur';
            break;

            case 'munition':
            data = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions.liste.${munition}`);
            path += `optionsmunitions.liste.${munition}.chargeur`;
            break;
        }

        if(!data) return;

        chargeur = data?.raw?.[index] ?? undefined;

        if(!chargeur.includes('chargeur')) return;

        actuel = data?.chargeur === null || data?.chargeur === undefined ? parseInt(chargeur.split(' ')[1]) : data.chargeur;

        foundry.utils.setProperty(update, path, Math.max(actuel-1, 0));

        this.item.update(update);

        const exec = new game.knight.RollKnight(this.actor,
        {
            name:this.item.name,
        }).sendMessage({
            text:game.i18n.localize('KNIGHT.JETS.Retire1Charge'),
            classes:'important',
        });
    }

    useMunition(updates={}) {
        const wpnPath = this.wpnPath;
        const type = this.type;
        let path = `item.${this.item._id}.`;
        path += wpnPath;

        if(type === 'contact') {
            const options2mains = foundry.utils.getProperty(this.item, `${wpnPath}options2mains`);

            if(options2mains?.has) {
                const actuel = options2mains?.actuel ?? '1main';
                const effets = actuel === '1main' ? foundry.utils.getProperty(this.item, `${wpnPath}effets`) : foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);
                const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

                if(!findChargeur) return;

                const chargeurMax = parseInt(findChargeur.split(' ')[1]);

                let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                if(actuel === '1main') path += `effets.chargeur`;
                else path += `effets2mains.chargeur`;

                updates[path] = Math.max(chargeur-1, 0);
            } else {
                const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
                const findChargeur = effets.raw.find(itm => itm.includes('chargeur'));

                if(!findChargeur) return;

                const chargeurMax = parseInt(findChargeur.split(' ')[1]);

                let chargeur = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                path += `effets.chargeur`;
                updates[path] = Math.max(chargeur-1, 0);
            }
        }
        else if(type === 'distance') {
            const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
            const findChargeurBase = effets.raw.find(itm => itm.includes('chargeur'));

            if(findChargeurBase) {
                const chargeurMax = parseInt(findChargeurBase.split(' ')[1]);
                const chargeurActuel = effets?.chargeur !== null && effets?.chargeur !== undefined ? parseInt(effets.chargeur) : chargeurMax;

                path += `effets.chargeur`;
                updates[path] = Math.max(chargeurActuel-1, 0);
            };

            const optionsmunitions = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions`);

            if(optionsmunitions.has) {
                const actuel = optionsmunitions.actuel;
                const munition = optionsmunitions?.liste?.[actuel];

                if(munition) {
                    const effetsMunition = munition;
                    const findChargeurMunition = munition.raw.find(itm => itm.includes('chargeur'));

                    if(findChargeurMunition) {
                        const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

                        let chargeurMunition = effetsMunition?.chargeur !== null && effetsMunition?.chargeur !== undefined ? parseInt(effetsMunition.chargeur) : chargeurMunitionMax;

                        foundry.utils.setProperty(updates, `item.${this.item._id}.${wpnPath}optionsmunitions.liste.${actuel}.chargeur`, Math.max(chargeurMunition-1, 0));
                    }
                }
            }
        }
    }

    resetMunition() {
        const wpnPath = this.wpnPath;
        let updates = {};
        const effets = foundry.utils.getProperty(this.item, `${wpnPath}effets`);
        const effets2mains = foundry.utils.getProperty(this.item, `${wpnPath}effets2mains`);

        const findChargeurBase = effets ? effets.raw.find(itm => itm.includes('chargeur')) : undefined;
        const findChargeur2Mains = effets2mains ? effets2mains.raw.find(itm => itm.includes('chargeur')) : undefined;

        if(findChargeurBase) {
            const chargeurMaxBase = parseInt(findChargeurBase.split(' ')[1]);

            foundry.utils.setProperty(updates, `${wpnPath}effets.chargeur`, chargeurMaxBase);
        }

        if(findChargeur2Mains) {
            const chargeurMax2Mains = parseInt(findChargeur2Mains.split(' ')[1]);

            foundry.utils.setProperty(updates, `${wpnPath}effets2mains.chargeur`, chargeurMax2Mains);
        }

        const optionsmunitions = foundry.utils.getProperty(this.item, `${wpnPath}optionsmunitions`);
        const munition = optionsmunitions?.liste ?? {};

        for (const effet in munition) {
            const findChargeurMunition = munition[effet].raw.find(itm => itm.includes('chargeur'));

            if(!findChargeurMunition) continue;

            const chargeurMunitionMax = parseInt(findChargeurMunition.split(' ')[1]);

            foundry.utils.setProperty(updates, `${wpnPath}optionsmunitions.liste.${effet}.chargeur`, chargeurMunitionMax);
        }

        this.item.update(updates);
    }

    async usePEActivateEffets(armure, label, effet, forceEspoir = false) {
        const actor = this.actor;

        if(actor.type === 'knight') return await this.PCusePEActivateEffets(actor, armure, label, effet, forceEspoir);
        else return await this.OtherusePEActivateEffets(actor, armure, label, effet, forceEspoir);
    }

    async PCusePEActivateEffets(actor, armure, label, effet, forceEspoir = false) {
        if(!actor) return;

        const remplaceEnergie = armure?.espoirRemplaceEnergie ?? false;
        const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';

        const value = actor?.system?.[getType]?.value ?? 0;
        const espoir = actor?.system?.espoir?.value ?? 0;

        const sendLackMsg = async (i18nKey) => {
          const payload = {
            flavor: `${label}`,
            main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
          };
          const data = {
            user: game.user.id,
            speaker: {
              actor: actor?.id ?? null,
              token: actor?.token?.id ?? null,
              alias: actor?.name ?? null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
            sound: CONFIG.sounds.dice
          };
          const rMode = game.settings.get("core", "rollMode");
          const msgData = ChatMessage.applyRollMode(data, rMode);
          await ChatMessage.create(msgData, { rollMode: rMode });
        };

        let depenseEnergie = Number(effet.cost);
        let depenseEspoir = 0;
        let substractEnergie = 0;
        let substractEspoir = 0;

        if(remplaceEnergie) depenseEnergie += depenseEspoir;

        substractEnergie = value - depenseEnergie;
        substractEspoir = espoir - depenseEspoir;
        if(substractEnergie < 0) {
          await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

          return false;
        } else if(substractEspoir < 0 && !remplaceEnergie) {
          await sendLackMsg(`Notespoir`);

          return false;
        } else {
          let pbE = new PatchBuilder();
          const pathEnergie = actor.type === 'knight' ? `equipements.${actor.system.wear}.${getType}.value` : `${getType}.value`;

          if(!remplaceEnergie) pbE.sys(pathEnergie, substractEnergie);
          else if(remplaceEnergie && !actor.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

          if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

          await pbE.applyTo(actor);

          return true;
        }
    }

    async OtherusePEActivateEffets(actor, armure, label, effet, forceEspoir = false) {
        const remplaceEnergie = false;
        const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';

        const value = actor?.system?.[getType]?.value ?? 0;
        const espoir = actor?.system?.espoir?.value ?? 0;

        const sendLackMsg = async (i18nKey) => {
          const payload = {
            flavor: `${label}`,
            main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
          };
          const data = {
            user: game.user.id,
            speaker: {
              actor: actor?.id ?? null,
              token: actor?.token?.id ?? null,
              alias: actor?.name ?? null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
            sound: CONFIG.sounds.dice
          };
          const rMode = game.settings.get("core", "rollMode");
          const msgData = ChatMessage.applyRollMode(data, rMode);
          await ChatMessage.create(msgData, { rollMode: rMode });
        };

        let depenseEnergie = Number(effet.cost);
        let depenseEspoir = 0;
        let substractEnergie = 0;
        let substractEspoir = 0;

        if(remplaceEnergie) depenseEnergie += depenseEspoir;

        substractEnergie = value - depenseEnergie;
        substractEspoir = espoir - depenseEspoir;
        if(substractEnergie < 0) {
          await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

          return false;
        } else if(substractEspoir < 0 && !remplaceEnergie) {
          await sendLackMsg(`Notespoir`);

          return false;
        } else {
          let pbE = new PatchBuilder();
          const pathEnergie = actor.type === 'knight' ? `equipements.${actor.system.wear}.${getType}.value` : `${getType}.value`;

          if(!remplaceEnergie) pbE.sys(pathEnergie, substractEnergie);
          else if(remplaceEnergie && !actor.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

          if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

          await pbE.applyTo(actor);

          return true;
        }
    }
}