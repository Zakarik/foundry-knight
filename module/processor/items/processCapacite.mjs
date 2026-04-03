import {
    getAllEffects,
    listEffects,
} from "../../helpers/common.mjs";

export default function prepareCapacite(item, ctx, collections) {
    const data = item.system;

    collections.capacites.push(item);

    const isPhase2 = data.isPhase2;

    if(!isPhase2) processSTD(item, ctx, collections);
    else if(isPhase2) processPhase2(item, ctx, collections)
}

function processSTD(item, ctx, collections) {
    const allEffects = getAllEffects();
    const data = item.system;
    const bonus = data.bonus;
    const attaque = data.attaque;
    const aLieSupp = bonus.aspectsLieSupplementaire;

    if(aLieSupp.has) collections.aspectLieSupp.push(aLieSupp.value);

    if(attaque.has) {
        const capaciteWpn = formatWpn(item);

        if(attaque.type === 'contact') collections.armesContactEquipee.push(capaciteWpn);
        else if(attaque.type === 'distance') collections.armesDistanceEquipee.push(capaciteWpn);
    }
}

function processPhase2(item, ctx, collections) {
    const data = item.system;
    const { actor } = ctx;

    if(!actor?.system?.phase2Activate) return;

    const bonus = data.bonus;
    const attaque = data.attaque;
    const aLieSupp = bonus.aspectsLieSupplementaire;

    if(aLieSupp.has) collections.aspectLieSupp.push(aLieSupp.value);

    if(attaque.has) {
        const capaciteWpn = formatWpn(item);

        if(attaque.type === 'contact') collections.armesContactEquipee.push(capaciteWpn);
        else if(attaque.type === 'distance') collections.armesDistanceEquipee.push(capaciteWpn);
    }
}

function formatWpn(item) {
    const allEffects = getAllEffects();
    const data = item.system;
    const attaque = data.attaque;

    const wpn = {
        _id:item._id,
        name:item.name,
        type:'capacite',
        system:{
            noRack:true,
            type:attaque.type,
            portee:attaque.portee,
            degats:attaque.degats,
            violence:{
                dice:0,
                fixe:0,
            },
            effets:attaque.effets,
        }
    }

    wpn.system.effets.liste = listEffects(attaque.effets, allEffects, attaque.effets?.chargeur)

    return wpn;
}