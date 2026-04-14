import { BaseArmeDataModel } from "../base/base-arme-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';
import { EFFECTSFIELD, DGTSVIOLENCEFIELD, OPTIONSMUNITIONS } from "../base/base-fields-models.mjs";
import {
  listEffects,
  getAllEffects,
  capitalizeFirstLetter,
} from "../../../helpers/common.mjs";
import PatchBuilder from "../../../utils/patchBuilder.mjs";

export class CyberwareDataModel extends BaseArmeDataModel {
    // Pour Héritage
    // Extension : on ajoute/modifie
    static get baseDefinition() {
        const base = super.baseDefinition;
        const specific = {
            active:["bool", { initial: false}],
            marque:["str", { initial: "", nullable:false}],
            categorie:["str", { initial: "medical", nullable:false}],
            dharmaTech:["bool", { initial: false}],
            espoir:["num", {initial:3, nullable:false, integer:true}],
            prix:["num", {initial:0, min:0, nullable:false, integer:true}],
            dharmatech:["schema", {
                has:["bool", { initial: false}],
            }],
            activation:["schema", {
                has:["bool", { initial: false}],
                type:["str", { initial: "", nullable:false}],
                energie:["num", {initial:0, min:0, nullable:false, integer:true}],
                duration:["str", { initial: "", nullable:false}],
                permanent:["bool", { initial: false}],
                withMetaArmure:["bool", { initial: false}],
            }],
            optimisation:["schema", {
                has:["bool", { initial: false}],
            }],
            soin:["schema", {
                has:["bool", { initial: false}],
                blessuresSoignees:["str", { initial: "", nullable:false}],
            }],
            recuperation:["schema", {
                has:["bool", { initial: false}],
                type:["str", { initial: "", nullable:false}],
                limite:["schema", {
                    value:["num", {initial:0, nullable:false, integer:true}],
                    max:["num", {initial:0, min:0, nullable:false, integer:true}],
                }],
                dice:["num", {initial:0, min:0, nullable:false, integer:true}],
                face:["num", {initial:6, min:0, nullable:false, integer:true}],
                bonus:["num", {initial:0, nullable:false, integer:true}],
                nods:["bool", { initial: false}],
            }],
            degats:["schema", {
                withMetaArmure:["bool", { initial: false}],
                has:["bool", { initial: false}],
                type:["str", { initial: "contact", nullable:false}],
                dice:["num", {initial:0, nullable:false, integer:true}],
                fixe:["num", {initial:0, nullable:false, integer:true}],
                variable:["schema", {
                    has:["bool", { initial: false}],
                    min:["schema", {
                        dice:["num", {initial:0, nullable:false, integer:true}],
                        fixe:["num", {initial:0, nullable:false, integer:true}],
                    }],
                    max:["schema", {
                        dice:["num", {initial:0, nullable:false, integer:true}],
                        fixe:["num", {initial:0, nullable:false, integer:true}],
                    }],
                    cout:["num", {initial:0, nullable:false, integer:true}],
                }],
            }],
            violence:["schema", {
                withMetaArmure:["bool", { initial: false}],
                has:["bool", { initial: false}],
                type:["str", { initial: "contact", nullable:false}],
                dice:["num", {initial:0, nullable:false, integer:true}],
                fixe:["num", {initial:0, nullable:false, integer:true}],
                variable:["schema", {
                    has:["bool", { initial: false}],
                    min:["schema", {
                        dice:["num", {initial:0, nullable:false, integer:true}],
                        fixe:["num", {initial:0, nullable:false, integer:true}],
                    }],
                    max:["schema", {
                        dice:["num", {initial:0, nullable:false, integer:true}],
                        fixe:["num", {initial:0, nullable:false, integer:true}],
                    }],
                    cout:["num", {initial:0, nullable:false, integer:true}],
                }],
            }],
            arme:["schema", {
                has:["bool", { initial: false}],
                type: ["str", { initial: "contact", nullable:false}],
                portee: ["str", { initial: "contact", nullable:false}],
                optionsmunitions:["schema", OPTIONSMUNITIONS],
                degats:["schema", DGTSVIOLENCEFIELD],
                violence:["schema", DGTSVIOLENCEFIELD],
                effets: ["schema", EFFECTSFIELD],
                withMetaArmure:["bool", { initial: false}],
            }],
            module:["schema", {
                has:["bool", { initial: false}],
                ersatz:["schema", {
                    rogue:["schema", {
                        has:["bool", { initial: false}],
                        interruption:["schema", {
                            actif:["bool", { initial: true}],
                        }],
                        reussites:["num", {initial:3, nullable:false, integer:true}],
                        attaque:["str", { initial: "discretion", nullable:false}],
                        degats:["schema", {
                            caracteristique:["str", { initial: "discretion", nullable:false}],
                            od:["bool", { initial: true}],
                            dice:["bool", { initial: false}],
                            fixe:["bool", { initial: true}],
                        }]
                    }],
                    bard:["schema", {
                        has:["bool", { initial: false}],
                    }],
                }],
                withMetaArmure:["bool", { initial: false}],
            }],
            effects:["schema", {
                has:["bool", { initial: false}],
                other:["html", { initial: ""}],
                list:["arr", ["schema", {
                    type:["str", { initial: "add", nullable:false}],
                    path:["str", { initial: "", nullable:false}],
                    value:["str", {initial:'0', nullable:false}],
                }]],
                defaultListValue:["arr", ["schema", {
                    type:["str", { initial: "add", nullable:false}],
                    path:["str", { initial: "", nullable:false}],
                    value:["str", {initial:'0', nullable:false}],
                }]],
            }]
        }

        return combine(base, specific);
    }

    get wpnPath() {
        return `system.arme.`;
    }

    get isActive() {
        let result = false;

        if(!this.activation.has) result = true;
        else if(this.activation.has && this.active) result = true;

        return result;
    }

    get getAllEffects() {
        const effects = this.effects;
        let result = [];

        if(effects.has) {
            if(this.optimisation.has) {
                result = this.effects.list.map(e => ({
                    ...e,
                    path: e.path && e.path.includes('aspects') && !e.path.includes('overdrive') && !e.type.includes('override') ? `${e.path}.optimisation` : e.path
                }))
            } else {
                result = this.effects.list;
            }
        }

        return result;
    }

    get wpn() {
        return this.arme;
    }

    get recuperationPath() {
        const actorType = this.actor.type
        let result = {};

        switch(actorType) {
            case 'knight':
                const wear = this.actor.system.wear;

                result['sante'] = 'system.sante.value';
                result['espoir'] = 'system.espoir.value';
                result['energie'] = `system.equipements.${wear}.energie.value`;
                result['armure'] = `system.equipements.${wear}.armure.value`;
                break;
        }

        return result;
    }

    get useNods() {
        const actor = this.actor;
        const data = this.recuperation;
        let result = false;

        if(data.nods && data.type !== 'espoir' && actor) result = true;

        return result;
    }

    prepareBaseData() {
        const recuperation = this.recuperation;
        const activation = this.activation;

        if(recuperation.limite.value > recuperation.limite.max) {
            Object.defineProperty(recuperation.limite, 'value', {
                value: recuperation.limite.max,
            });
        }

        if(activation.has && activation.permanent) {
            Object.defineProperty(this, 'active', {
                value: true,
            });
        }
	}

	prepareDerivedData() {
        this._prepareEffets();
        this._prepareHealWound();
    }

    prepareForWpn(armorSpecialRaw=undefined, armorSpecialCustom=undefined) {
        const actor = this.actor;
        const item = this.item;
        const arme = this.wpn;
        let execute = true;

        if(!actor) execute = false;
        else if(!arme.has || !this.isActive) execute = false;
        else if(actor.type !== 'knight') execute = true;
        else if(!arme.withMetaArmure && actor.system.armorISwear) execute = false;

        if(!execute) return {};

        const effetsFinal = {
            raw:[...new Set(armorSpecialRaw ? arme.effets.raw.concat(armorSpecialRaw) : arme.effets.raw)],
            custom:armorSpecialCustom ? arme.effets.custom.concat(armorSpecialCustom) : arme.effets.custom,
            activable:arme.effets.activable,
            liste:arme.effets.liste,
            chargeur:arme.effets?.chargeur,
        };

        const wpn = {
            _id:item._id,
            name:item.name,
            type:'cyberware',
            system:{
                noRack:true,
                type:arme.type,
                portee:arme.portee,
                degats:arme.degats,
                violence:arme.violence,
                effets:effetsFinal,
            }
        }

        return {
            type:arme.type,
            wpn,
        }
    }

    async activate() {
        const item = this.item;
        const name = item.name;
        const recuperation = this.recuperation;
        let canUseRecuperation = true;
        let abort = false;

        if(!this.activation.has) return;
        if(this.activation.permanent) return;

        if(recuperation.has && recuperation.limite.max > 0) {
            if(recuperation.limite.value === 0) canUseRecuperation = false;
        }

        if(!this.active && canUseRecuperation) abort = !await this.usePEActivateEffets(this.actorArmor, name, {cost:this.activation.energie});

        if(!abort) {
            if(recuperation.has && !this.active) {
                const recup = await this.useRecuperation(name);

                if(!recup) return;
            } else this.sendMsgActivation(name);

            let pb = new PatchBuilder();
            pb.sys(`active`, !this.active);

            if(this.recuperation.limite.max > 0 && this.recuperation.has && !this.active) pb.sys(`recuperation.limite.value`, this.recuperation.limite.value-1);

            await pb.applyTo(item);
        }
    }

    async recuperer() {
        const item = this.item;
        const name = item.name;
        const recuperation = this.recuperation;
        let abort = false;

        if(recuperation.has) {
            const recup = await this.useRecuperation(name, false);

            if(!recup) return;
        }

        if(recuperation.limite.max > 0 && recuperation.has) {
            let pbI = new PatchBuilder();

            pbI.sys(`recuperation.limite.value`, this.recuperation.limite.value-1);
            await pbI.applyTo(item);
        }

    }

    _prepareEffets() {
        const bEffets = this.arme.effets;

        const labels = getAllEffects();

        Object.defineProperty(this.arme.effets, 'liste', {
            value: listEffects(bEffets, labels, bEffets?.chargeur),
        });
    }

    _prepareHealWound() {
        if(this.isActive && this.actor && this.soin.has && this.soin.blessuresSoignees) {
            const idWound = this.soin.blessuresSoignees;

            this.healWound(idWound)
        } else if(!this.isActive && this.actor && this.soin.has && this.soin.blessuresSoignees) {
            const idWound = this.soin.blessuresSoignees;

            this.unHealWound(idWound);
        }
    }

    async healWound(id) {
        const actor = this.actor;
        const item = this.item;
        const wound = await actor.items.get(id);
        const retiredWound = actor.items.find(itm => itm.system.cyberware === this.item.id && itm.id !== id);

        if(retiredWound) {
            let retiredUpdate = {};
            retiredUpdate['system.soigne.implant'] = false;
            retiredUpdate['system.cyberware'] = "";
            retiredUpdate['name'] = retiredWound.name.replace(` (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`, "");
            await retiredWound.update(retiredUpdate);
        }

        if(wound) {
            if(wound.system.cyberware === item.id) return;

            let update = {};
            update['system.soigne.implant'] = true;
            update['system.cyberware'] = item.id;
            update['name'] = `${wound.name} (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`;
            await wound.update(update);
        }
    }

    async unHealWound(id) {
        const actor = this.actor;
        const item = this.item;
        const wound = await actor.items.get(id);

        if(wound) {
            if(wound.system.cyberware !== item.id) return;

            let update = {};
            update['system.soigne.implant'] = false;
            update['system.cyberware'] = "";
            update['name'] = `${wound.name.replace(` (${game.i18n.localize("KNIGHT.AUTRE.Soigne")})`, "")}`;
            await wound.update(update);
        }
    }

    async useRecuperation(name, activation=true) {
        const recuperation = this.recuperation;
        const type = recuperation.type;
        const actor = this.actor;
        const value = Number(recuperation.limite.value);
        const max = Number(recuperation.limite.max);
        const useNods = this.useNods;
        let result = false;
        let update = {};

        if(max === 0 || (max > 0 && value > 0)) {
            if(activation) this.sendMsgActivation(name);

            const actorValue = actor?.system?.[type]?.value ?? 0;
            const bonus = this?.actor?.system?.combat?.nods?.[type]?.recuperationBonus ?? 0;
            const path = this.recuperationPath;

            update[path[type]] = `@{rollTotal}+${actorValue}`;

            if(useNods) {
                const mapping = {
                    'armure':'armure',
                    'sante':'soin',
                }

                const rRecuperation = new game.knight.RollKnight(this.actor, {
                    name:game.i18n.format(`KNIGHT.CYBERWARE.Recuperation`, {type:game.i18n.localize(`KNIGHT.LATERAL.${capitalizeFirstLetter(type)}`), name}),
                    dices:this?.actor?.system?.combat?.nods?.[mapping[recuperation?.type]]?.dices ?? `0D0`,
                    bonus:[bonus]
                }, false);

                await rRecuperation.doRoll(update);
            } else {
                const rRecuperation = new game.knight.RollKnight(this.actor, {
                    name:game.i18n.format(`KNIGHT.CYBERWARE.Recuperation`, {type:game.i18n.localize(`KNIGHT.LATERAL.${capitalizeFirstLetter(type)}`), name}),
                    dices:`${recuperation.dice}D${recuperation.face}`,
                    bonus:[bonus+recuperation.bonus]
                }, false);

                await rRecuperation.doRoll(update);
            }

            result = true;
        } else {
          const rNods = new game.knight.RollKnight(this.actor, {
            name:game.i18n.localize(this.item.name),
          }, false);

          rNods.sendMessage({
            classes:'fail',
            text:`${game.i18n.localize(`KNIGHT.JETS.Notcharge`)}`,
          })

          result = false;
        }

        return result;
    }

    sendMsgActivation(name) {
        const exec = new game.knight.RollKnight(this.actor,
        {
            name:!this.active ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`) : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
        }).sendMessage({
            text:name,
            sounds:CONFIG.sounds.notification,
        });
    }
}