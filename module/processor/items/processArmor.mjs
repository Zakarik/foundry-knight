import {
  listEffects,
  getAllEffects,
} from "../../helpers/common.mjs";

export default function prepareArmor(item, ctx, collections) {
    const { capaciteultime, onArmor } = ctx;
    const data = item.system;

    processTranslations(item);

    let passiveUltime = processCapaciteUltime(capaciteultime);
    processEvolutions(data, ctx, collections);
    processPassiveSpecial(data, passiveUltime);

    if(onArmor) {
        processSpecial(data, ctx, passiveUltime);
        processCapacite(item, collections);
    }

    foundry.utils.mergeObject(collections.armureData, item);
    collections.armureData.label = item.name;
    collections.armureData.id = item.id;
    collections.armureData._id = item.id;
}

function processTranslations(item) {
    const data = item.system;
    const capacites = data?.capacites?.selected;
    const allEffects = getAllEffects();
    const listCapacityWithEffects = ['borealis', 'changeling', 'companions', 'cea', 'illumination', 'longbow', 'morph', 'oriflamme', 'porteurlumiere'];
    const capacityEffectsPath = {
        borealis:['offensif.effets'],
        changeling:['desactivationexplosive.effets'],
        companions:['lion.contact.coups.effets', 'wolf.contact.coups.effets', 'wolf.configurations.fighter.bonus.effets'],
        cea:['salve.effets', 'vague.effets', 'rayon.effets'],
        illumination:['lantern.effets'],
        longbow:['effets.base', 'effets.liste1', 'effets.liste2', 'effets.liste3', 'distance'],
        morph:['polymorphie.griffe.effets', 'polymorphie.lame.effets', 'polymorphie.canon.effets'],
        oriflamme:['effets'],
        porteurlumiere:['bonus.effets'],
    }

    for(let c of listCapacityWithEffects) {
        if(!capacites[c]) continue;

        for(let p of capacityEffectsPath[c]) {
            const effets = foundry.utils.getProperty(capacites[c], p);
            foundry.utils.setProperty(capacites[c], `${p}.liste`,
                listEffects(effets, allEffects, effets?.chargeur)
            )
        }
    }
}

function processCapacite(item, collections) {
    const data = item.system;
    const capacites = data?.capacites?.selected;
    let {
        armesDistanceEquipee,
        armesContactEquipee,
    } = collections;

    for (let c in capacites) {
        const dCapacite = capacites[c];

        switch(c) {
            case 'longbow':
            collections.longbow = dCapacite;
            collections.longbow.has = true;
            break;

            case 'borealis':
            armesDistanceEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                type:'armure',
                raw:'borealis',
                system:{
                    subCapaciteName:'borealis',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.offensif.portee,
                    degats:dCapacite.offensif.degats,
                    violence:dCapacite.offensif.violence,
                    effets:dCapacite.offensif.effets
                }
            });

            armesContactEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                type:'armure',
                raw:'borealis',
                system:{
                    subCapaciteName:'borealis',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.offensif.portee,
                    degats:dCapacite.offensif.degats,
                    violence:dCapacite.offensif.violence,
                    effets:dCapacite.offensif.effets
                }
            });
            break;

            case 'cea':
            armesDistanceEquipee.push({
                _id:item._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                type:'armure',
                raw:'cea_vague',
                system:{
                    subCapaciteName:'vague',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.vague.portee,
                    degats:dCapacite.vague.degats,
                    violence:dCapacite.vague.violence,
                    effets:dCapacite.vague.effets,
                }
            },
            {
                _id:item._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                type:'armure',
                raw:'cea_salve',
                system:{
                    subCapaciteName:'salve',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.salve.portee,
                    degats:dCapacite.salve.degats,
                    violence:dCapacite.salve.violence,
                    effets:dCapacite.salve.effets
                }
            },
            {
                _id:item._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                type:'armure',
                raw:'cea_rayon',
                system:{
                    subCapaciteName:'rayon',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.rayon.portee,
                    degats:dCapacite.rayon.degats,
                    violence:dCapacite.rayon.violence,
                    effets:dCapacite.rayon.effets
                }
            });

            armesContactEquipee.push({
                _id:item._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                type:'armure',
                raw:'cea_vague',
                system:{
                    subCapaciteName:'vague',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.vague.portee,
                    degats:dCapacite.vague.degats,
                    violence:dCapacite.vague.violence,
                    effets:dCapacite.vague.effets
                }
            },
            {
                _id:item._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                type:'armure',
                raw:'cea_salve',
                system:{
                    subCapaciteName:'salve',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.salve.portee,
                    degats:dCapacite.salve.degats,
                    violence:dCapacite.salve.violence,
                    effets:dCapacite.salve.effets
                }
            },
            {
                _id:item._id,
                name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                type:'armure',
                raw:'cea_rayon',
                system:{
                    subCapaciteName:'rayon',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.rayon.portee,
                    degats:dCapacite.rayon.degats,
                    violence:dCapacite.rayon.violence,
                    effets:dCapacite.rayon.effets
                }
            });
            break;

            case 'morph':
            if(dCapacite?.active?.polymorphieLame ?? false) {
                armesContactEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')}`,
                type:'armure',
                raw:'morph_lame',
                system:{
                    subCapaciteName:'lame',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.polymorphie.lame.portee,
                    degats:dCapacite.polymorphie.lame.degats,
                    violence:dCapacite.polymorphie.lame.violence,
                    effets:dCapacite.polymorphie.lame.effets
                }
                });
            }

            if(dCapacite?.active?.polymorphieLame2 ?? false) {
                armesContactEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')} 2`,
                type:'armure',
                raw:'morph_lame2',
                system:{
                    subCapaciteName:'lame2',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.polymorphie.lame.portee,
                    degats:dCapacite.polymorphie.lame.degats,
                    violence:dCapacite.polymorphie.lame.violence,
                    effets:dCapacite.polymorphie.lame.effets
                }
                });
            }

            if(dCapacite?.active?.polymorphieGriffe ?? false) {
                armesContactEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')}`,
                type:'armure',
                raw:'morph_griffe',
                system:{
                    subCapaciteName:'griffe',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.polymorphie.griffe.portee,
                    degats:dCapacite.polymorphie.griffe.degats,
                    violence:dCapacite.polymorphie.griffe.violence,
                    effets:dCapacite.polymorphie.griffe.effets
                }
                });
            }

            if(dCapacite?.active?.polymorphieGriffe2 ?? false) {
                armesContactEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')} 2`,
                type:'armure',
                raw:'morph_griffe2',
                system:{
                    subCapaciteName:'griffe2',
                    capacite:true,
                    noRack:true,
                    type:'contact',
                    portee:dCapacite.polymorphie.griffe.portee,
                    degats:dCapacite.polymorphie.griffe.degats,
                    violence:dCapacite.polymorphie.griffe.violence,
                    effets:dCapacite.polymorphie.griffe.effets
                }
                });
            }

            if(dCapacite?.active?.polymorphieCanon ?? false) {
                armesDistanceEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')}`,
                type:'armure',
                raw:'morph_canon',
                system:{
                    subCapaciteName:'canon',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.polymorphie.canon.portee,
                    degats:dCapacite.polymorphie.canon.degats,
                    violence:dCapacite.polymorphie.canon.violence,
                    effets:dCapacite.polymorphie.canon.effets
                }
                });
            }

            if(dCapacite?.active?.polymorphieCanon2 ?? false) {
                armesDistanceEquipee.push({
                _id:item._id,
                name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')} 2`,
                type:'armure',
                raw:'morph_canon2',
                system:{
                    subCapaciteName:'canon2',
                    capacite:true,
                    noRack:true,
                    type:'distance',
                    portee:dCapacite.polymorphie.canon.portee,
                    degats:dCapacite.polymorphie.canon.degats,
                    violence:dCapacite.polymorphie.canon.violence,
                    effets:dCapacite.polymorphie.canon.effets
                }
                });
            }
            break;
        }
    }

}

function processSpecial(data, ctx, passiveUltime) {
    const { system } = ctx;
    const specials = data.special.selected;

    for (let [key, special] of Object.entries(specials)) {
        switch(key) {
            case 'contrecoups':
            system.restrictions.noArmeDistance = !special.armedistance.value ? true : false;
            system.restrictions.maxEffetsArmeContact = {
                has:special.maxeffets.value,
                value:special.maxeffets.max,
            };
            break;

            case 'recolteflux':
            if(passiveUltime !== undefined) {
                if(passiveUltime.capacites.actif && passiveUltime.special.recolteflux.actif) {
                    data.special.selected[key] = {
                        conflit:{
                            base:passiveUltime.special.recolteflux.update.conflit.base,
                            tour:passiveUltime.special.recolteflux.update.conflit.tour,
                        },
                        horsconflit:{
                            base:passiveUltime.special.recolteflux.update.horsconflit.base
                        }
                    }
                }
            }
            break;
        }
    }
}

function processPassiveSpecial(data, passiveUltime) {
    const specials = data.special.selected;

    for (let [key, special] of Object.entries(specials)) {
        switch(key) {
        case 'contrecoups':
            if(passiveUltime !== undefined) {
                if(passiveUltime.capacites.actif && passiveUltime.special.contrecoups.actif) {
                    data.special.selected[key].unactif = true;
                }
            }
            break;
        }
    }
}

function processCapaciteUltime(capaciteultime) {
    let passiveUltime;

    if(capaciteultime !== undefined) {
        const dataCapaciteUltime = capaciteultime.system;

        if(dataCapaciteUltime.type == 'passive') passiveUltime = dataCapaciteUltime.passives;
    }

    return passiveUltime;
}

function processEvolutions(data, ctx, collections) {
    const { system, isPj } = ctx;
    const armorEvolutions = data.evolutions;

    let { evolutionsAchetables, evolutionsAAcheter, evolutionsCompanions } = collections;
    const totalPG = Number(system?.progression?.gloire?.total ?? 0);

    if(isPj) {
        for (let [key, evolution] of Object.entries(armorEvolutions.liste)) {
            const PGEvo = +evolution.value;
            const AlreadyEvo = evolution.applied;

            if(!AlreadyEvo && PGEvo <= totalPG) {
                evolutionsAchetables.push({
                value:PGEvo,
                id:key
                });
            }
        }
    }

    const companionsEvolutions = armorEvolutions?.special?.companions || false;

    if(companionsEvolutions) {
        const valueEvo = +companionsEvolutions.value;
        const nbreEvo = Math.floor(totalPG/+companionsEvolutions.value);
        const nbreEvoApplied = companionsEvolutions?.applied?.value || 0;

        if(nbreEvo > nbreEvoApplied) {
            for(let n = nbreEvoApplied+1; n <= nbreEvo;n++) {
                evolutionsCompanions.push({
                id:n,
                value:valueEvo*n
                });
            }
        }
    }

    const longbowEvolutions = armorEvolutions?.special?.longbow || false;

    if(longbowEvolutions) {
        for (const id of ['1','2','3','4']) {
            const evo = longbowEvolutions[id];

            if (!evo.applied) {
                evolutionsAAcheter.push({
                    id: +id,
                    description: evo.description?.replaceAll('<p>','').replaceAll('</p>','') ?? '',
                    value: +evo.value
                });
            }
        }
    }
}