import {
    getAllEffects,
    listEffects,
} from "../../helpers/common.mjs";

export default function prepareModule(item, ctx, collections, lion) {
    const data = item.system;

    const isLion = data.isLion;
    const itemDataNiveau = data.niveau.actuel;
    const itemBonus = itemDataNiveau?.bonus ?? {has:false};
    const itemArme = itemDataNiveau?.arme ?? {has:false};
    const itemOD = itemDataNiveau?.overdrives ?? {has:false};

    if(itemBonus === false ?? itemArme === false ?? itemOD === false) return;

    if(isLion) processLion(item, lion, ctx, collections);
    else processModule(item, ctx, collections);
}

function processLion(item, lion, ctx) {
    const { armorSpecial } = ctx;

    const data = item.system;
    const armorSpecialRaw = armorSpecial?.raw ?? [];
    const armorSpecialCustom = armorSpecial?.custom ?? [];

    const itemDataNiveau = data.niveau.actuel;
    const itemBonus = itemDataNiveau?.bonus ?? {has:false};
    const itemArme = itemDataNiveau?.arme ?? {has:false};
    const itemActive = data?.active?.base ?? false;

    if(data.permanent ?? itemActive) {
        if(itemBonus.has) {
            const iBArmure = itemBonus.armure;
            const iBCDF = itemBonus.champDeForce;
            const iBEnergie = itemBonus.energie;
            const iBDgts = itemBonus.degats;
            const iBDgtsVariable = iBDgts.variable;
            const iBViolence = itemBonus.violence;
            const iBViolenceVariable = iBViolence.variable;

            if(iBArmure.has) { lion.armure.bonus.push(iBArmure.value); }
            if(iBCDF.has) { lion.champDeForce.bonus.push(iBCDF.value); }
            if(iBEnergie.has) { lion.energie.bonus.push(iBEnergie.value); }
            if(iBDgts.has) {
            if(iBDgtsVariable.has) {
                const dgtsDicePaliers = [0];
                const dgtsFixePaliers = [0];

                for(let i = iBDgtsVariable.min.dice;i <= iBDgtsVariable.max.dice;i++) {
                    dgtsDicePaliers.push(i);
                }

                for(let i = iBDgtsVariable.min.fixe;i <= iBDgtsVariable.max.fixe;i++) {
                    dgtsFixePaliers.push(i);
                }

                lion.bonusDgtsVariable[iBDgts.type].push({
                label:item.name,
                description:data.description,
                selected:{
                    dice:iBDgtsVariable?.selected?.dice ?? 0,
                    fixe:iBDgtsVariable?.selected?.fixe ?? 0,
                    energie:{
                    dice:iBDgtsVariable?.selected?.energie?.dice ?? 0,
                    fixe:iBDgtsVariable?.selected?.energie?.fixe ?? 0,
                    paliers:{
                        dice:dgtsDicePaliers,
                        fixe:dgtsFixePaliers
                    }
                    }
                },
                min:{
                    dice:iBDgtsVariable?.min?.dice ?? 0,
                    fixe:iBDgtsVariable?.min?.fixe ?? 0
                },
                max:{
                    dice:iBDgtsVariable?.max?.dice ?? 0,
                    fixe:iBDgtsVariable?.max?.fixe ?? 0
                }
                });
            } else {
                lion.bonusDgts[iBDgts.type].push({
                    label:item.name,
                    description:data.description,
                    dice:iBDgts.dice,
                    fixe:iBDgts.fixe
                });
            }
            }
            if(iBViolence.has) {
            if(iBViolenceVariable.has) {
                const violDicePaliers = [0];
                const violFixePaliers = [0];

                for(let i = iBViolenceVariable.min.dice;i <= iBViolenceVariable.max.dice;i++) {
                    violDicePaliers.push(i);
                }

                for(let i = iBViolenceVariable.min.fixe;i <= iBViolenceVariable.max.fixe;i++) {
                    violFixePaliers.push(i);
                }

                lion.bonusViolenceVariable[iBViolence.type].push({
                label:item.name,
                description:item.system.description,
                selected:{
                    dice:iBViolenceVariable?.selected?.dice ?? 0,
                    fixe:iBViolenceVariable?.selected?.fixe ?? 0,
                    energie:{
                        dice:iBViolenceVariable?.selected?.energie?.dice ?? 0,
                        fixe:iBViolenceVariable?.selected?.energie?.fixe ?? 0,
                        paliers:{
                            dice:violDicePaliers,
                            fixe:violFixePaliers
                        }
                    }
                },
                min:{
                    dice:iBViolenceVariable?.min?.dice ?? 0,
                    fixe:iBViolenceVariable?.min?.fixe ?? 0
                },
                max:{
                    dice:iBViolenceVariable?.max?.dice ?? 0,
                    fixe:iBViolenceVariable?.max?.fixe ?? 0
                }
                });
            } else {
                lion.bonusViolence[iBViolence.type].push({
                    label:item.name,
                    description:item.system.description,
                    dice:iBViolence.dice,
                    fixe:iBViolence.fixe
                });
            }
            }
        }

        if(itemArme.has) {
            const moduleEffets = itemArme.effets;
            const moduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
            const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) ?? [];
            const moduleEffetsFinal = {
            raw:[...new Set(moduleEffetsRaw)],
            custom:moduleEffetsCustom,
            liste:moduleEffets.liste
            };

            const moduleWpn = {
                _id:item._id,
                name:item.name,
                type:'module',
                system:{
                    noRack:true,
                    type:itemArme.type,
                    portee:itemArme.portee,
                    degats:itemArme.degats,
                    violence:itemArme.violence,
                    effets:{
                        raw:moduleEffetsRaw,
                        custom:moduleEffetsCustom,
                        activable:moduleEffets.activable,
                        liste:moduleEffets.liste
                    }
                }
            }

            const bDefense = moduleEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
            const bReaction = moduleEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; });

            if(bDefense !== undefined) lion.defense.bonus.push(+bDefense.split(' ')[1]);
            if(bReaction !== undefined) lion.reaction.bonus.push(+bReaction.split(' ')[1]);

            if(itemArme.type === 'contact') {
                const bMassive = itemArme.structurelles.raw.find(str => { if(str.includes('massive')) return true; });

                if(bMassive)  lion.defense.malus.push(1);

                lion.armes.contact.push(moduleWpn);
            }

            if(itemArme.type === 'distance') {
                lion.armes.distance.push(moduleWpn);
            }
        }
    }

    for (const slot of ['tete', 'brasGauche', 'brasDroit', 'torse', 'jambeDroite', 'jambeGauche']) {
        lion.slots[slot].used += item.system.slots[slot];
    }
}

function processModule(item, ctx, collections) {
    const { onArmor } = ctx;
    let { modules, overdrives } = collections;

    const data = item.system;
    const itemDataNiveau = data.niveau.actuel;
    const itemBonus = itemDataNiveau?.bonus ?? {has:false};
    const itemArme = itemDataNiveau?.arme ?? {has:false};
    const itemOD = itemDataNiveau?.overdrives ?? {has:false};
    const itemActive = data?.active?.base ?? false;
    const itemErsatz = itemDataNiveau.ersatz;
    const eRogue = itemErsatz?.rogue ?? false;
    const eBard = itemErsatz?.bard ?? false;

    processBaseTranslations(data);

    if(itemDataNiveau.permanent || itemActive) {
        if(itemBonus.has) processBonus(itemDataNiveau, itemBonus, ctx, collections)

        if(itemArme.has && onArmor) processArme(item, itemArme, data, ctx, collections);

        if(eRogue.has && onArmor) processErsatzRogue(item, collections);

        if(eBard.has && onArmor) processErsatzBard(item, collections);
    }

    if(itemOD.has) overdrives.push(item);
    else modules.push(item);
}

function processBaseTranslations(data) {
    const allEffects = getAllEffects();

    const itemArme = data?.arme ?? {has:false};

    if(itemArme.has) {
        itemArme.effets.liste = listEffects(itemArme.effets, allEffects, itemArme.effets?.chargeur);
        itemArme.structurelles.liste = listEffects(itemArme.structurelles, allEffects, itemArme.structurelles?.chargeur);
        itemArme.ornementales.liste = listEffects(itemArme.ornementales, allEffects, itemArme.ornementales?.chargeur);
        itemArme.distance.liste = listEffects(itemArme.distance, allEffects, itemArme.distance?.chargeur);
    }

}

function processBonus(item, itemBonus, ctx, collections) {
    const { onArmor } = ctx;
    let { moduleBonusDgts, moduleBonusDgtsVariable, moduleBonusViolence, moduleBonusViolenceVariable } = collections;

    const iBDgts = itemBonus.degats;
    const iBDgtsVariable = iBDgts.variable;
    const iBViolence = itemBonus.violence;
    const iBViolenceVariable = iBViolence.variable;

    if(iBDgts.has && onArmor) {
    if(iBDgtsVariable.has) {
        const dgtsDicePaliers = [0];
        const dgtsFixePaliers = [0];

        for(let n = iBDgtsVariable.min.dice;n <= iBDgtsVariable.max.dice;n++) {
            dgtsDicePaliers.push(n);
        }

        for(let n = iBDgtsVariable.min.fixe;n <= iBDgtsVariable.max.fixe;n++) {
            dgtsFixePaliers.push(n);
        }

        moduleBonusDgtsVariable[iBDgts.type].push({
            id:item._id,
            label:item.name,
            description:item?.system?.description ?? '',
            selected:{
                dice:iBDgtsVariable?.selected?.dice ?? 0,
                fixe:iBDgtsVariable?.selected?.fixe ?? 0,
                energie:{
                dice:iBDgtsVariable?.selected?.energie?.dice ?? 0,
                fixe:iBDgtsVariable?.selected?.energie?.fixe ?? 0,
                    paliers:{
                        dice:dgtsDicePaliers,
                        fixe:dgtsFixePaliers
                    }
                }
            },
            min:{
                dice:iBDgtsVariable.min.dice,
                fixe:iBDgtsVariable.min.fixe
            },
            max:{
                dice:iBDgtsVariable.max.dice,
                fixe:iBDgtsVariable.max.fixe
            },
            energie:iBDgtsVariable.cout
        });
    } else {
        moduleBonusDgts[iBDgts.type].push({
            id:item._id,
            label:item.name,
            description:item?.system?.description ?? '',
            dice:iBDgts.dice,
            fixe:iBDgts.fixe
        });
    }
    }
    if(iBViolence.has && onArmor) {
    if(iBViolenceVariable.has) {
        const violDicePaliers = [0];
        const violFixePaliers = [0];

        for(let n = iBViolenceVariable.min.dice;n <= iBViolenceVariable.max.dice;n++) {
            violDicePaliers.push(n);
        }

        for(let n = iBViolenceVariable.min.fixe;n <= iBViolenceVariable.max.fixe;n++) {
            violFixePaliers.push(n);
        }

        moduleBonusViolenceVariable[iBViolence.type].push({
            id:item._id,
            label:item.name,
            description:item?.system?.description ?? '',
            selected:{
                dice:iBViolenceVariable?.selected?.dice ?? 0,
                fixe:iBViolenceVariable?.selected?.fixe ?? 0,
                energie:{
                    dice:iBViolenceVariable?.selected?.energie?.dice ?? 0,
                    fixe:iBViolenceVariable?.selected?.energie?.fixe ?? 0,
                    paliers:{
                            dice:violDicePaliers,
                            fixe:violFixePaliers
                    }
                }
            },
            min:{
                dice:iBViolenceVariable.min.dice,
                fixe:iBViolenceVariable.min.fixe
            },
            max:{
                dice:iBViolenceVariable.max.dice,
                fixe:iBViolenceVariable.max.fixe
            },
            energie:iBViolenceVariable.cout
        });
    } else {
            moduleBonusViolence[iBViolence.type].push({
            id:item._id,
            label:item.name,
            description:item?.system?.description ?? '',
            dice:iBViolence.dice,
            fixe:iBViolence.fixe
        });
    }
    }
}

function processArme(item, itemArme, data, ctx, collections) {
        const allEffects = getAllEffects();
        let {
            armesDistanceModules,
            armesDistanceEquipee,
            armesContactEquipee,
        } = collections;
        const { armorSpecial } = ctx;

        const armorSpecialRaw = armorSpecial?.raw ?? [];
        const armorSpecialCustom = armorSpecial?.custom ?? [];

        const niveau = data.niveau.value;
        const moduleArmeType = itemArme.type;
        const moduleEffets = itemArme.effets;
        const moduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
        const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) ?? [];
        const moduleEffetsFinal = {
            raw:[...new Set(moduleEffetsRaw)],
            custom:moduleEffetsCustom,
            activable:moduleEffets.activable,
            chargeur:moduleEffets?.chargeur,
        };

        moduleEffetsFinal.liste = listEffects(moduleEffetsFinal, allEffects, moduleEffetsFinal?.chargeur);

        const dataMunitions = itemArme?.optionsmunitions ?? {has:false};

        let degats = itemArme.degats;
        let violence = itemArme.violence;

        if(dataMunitions.has) {
            let actuel = dataMunitions.actuel;

            if(actuel === undefined) {
                dataMunitions.actuel = "0";
                actuel = "1";
            }

            for (let i = 0; i <= actuel; i++) {

                const raw = dataMunitions.liste[i].raw.concat(armorSpecialRaw);
                const custom = dataMunitions.liste[i].custom.concat(armorSpecialCustom);

                itemArme.optionsmunitions.liste[i].raw = [...new Set(raw)];
                itemArme.optionsmunitions.liste[i].custom = custom;
                itemArme.optionsmunitions.liste[i].liste = listEffects(itemArme.optionsmunitions.liste[i], allEffects, itemArme.optionsmunitions.liste[i]?.chargeur);
            }

            degats = dataMunitions.liste[actuel].degats;
            violence = dataMunitions.liste[actuel].violence;
        }

        const moduleWpn = {
            _id:item._id,
            name:item.name,
            type:'module',
            system:{
                noRack:true,
                type:itemArme.type,
                portee:itemArme.portee,
                degats:degats,
                violence:violence,
                optionsmunitions:dataMunitions,
                effets:moduleEffetsFinal,
                niveau:niveau,
            }
        };

        if(moduleArmeType === 'contact') {
            moduleWpn.system.structurelles = itemArme.structurelles;
            moduleWpn.system.ornementales = itemArme.ornementales;
        } else {
            moduleWpn.system.distance = itemArme.distance;
        }

        if(moduleArmeType === 'contact') { armesContactEquipee.push(moduleWpn); }

        if(itemArme.type === 'distance') {
            armesDistanceModules.push(moduleWpn);
            armesDistanceEquipee.push(moduleWpn);
        }
}

function processErsatzRogue(item, collections) {
    const data = item.system;
    const itemDataNiveau = data.niveau.actuel;
    const itemErsatz = itemDataNiveau.ersatz;
    const eRogue = itemErsatz?.rogue ?? false;

    let { moduleErsatz } = collections;

    moduleErsatz.rogue = eRogue;
    moduleErsatz.rogue.permanent = data.permanent;
    moduleErsatz.rogue.label = item.name;
    moduleErsatz.rogue._id = item._id;
    moduleErsatz.rogue.id = item._id;
    moduleErsatz.rogue.description = data.description;
}

function processErsatzBard(item, collections) {
    const data = item.system;
    const itemDataNiveau = data.niveau.actuel;
    const itemErsatz = itemDataNiveau.ersatz;
    const eBard = itemErsatz?.bard ?? false;

    let { moduleErsatz } = collections;

    moduleErsatz.bard = eBard;
    moduleErsatz.bard.permanent = data.permanent;
    moduleErsatz.bard.label = item.name;
    moduleErsatz.bard._id = item._id;
    moduleErsatz.bard.id = item._id;
    moduleErsatz.bard.description = data.description;
}