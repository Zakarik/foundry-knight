import {
    getAllEffects,
    listEffects,
} from "../../helpers/common.mjs";

export default function prepareWpn(item, ctx, collections) {
    const allEffects = getAllEffects();

    let {
        armesContactArmoury,
        armesContactRack,
        armesContactEquipee,
        armesDistanceArmoury,
        armesDistanceRack,
        armesDistanceEquipee,
        armesTourelles,
    } = collections;
    const { armorSpecial, wear, isPj } = ctx;

    const armorSpecialRaw = armorSpecial?.raw ?? [];
    const armorSpecialCustom = armorSpecial?.custom ?? [];

    const data = item.system;
    const type = data.type;
    const tourelle = data.tourelle;

    const armeRaw = data.effets.raw.concat(armorSpecialRaw);
    const armeCustom = data.effets.custom.concat(armorSpecialCustom);

    const armeE2Raw = data.effets2mains.raw.concat(armorSpecialRaw);
    const armeE2Custom = data.effets2mains.custom.concat(armorSpecialCustom);

    data.effets.raw = [...new Set(armeRaw)];
    data.effets.custom = armeCustom;
    data.effets.liste = listEffects(data.effets, allEffects, data.effets?.chargeur);

    data.effets2mains.raw = [...new Set(armeE2Raw)];
    data.effets2mains.custom = armeE2Custom;
    data.effets2mains.liste = listEffects(data.effets2mains, allEffects, data.effets2mains?.chargeur);

    data.distance.liste = listEffects(data.distance, allEffects, data.distance?.chargeur);
    data.ornementales.liste = listEffects(data.ornementales, allEffects, data.ornementales?.chargeur);
    data.structurelles.liste = listEffects(data.structurelles, allEffects, data.structurelles?.chargeur);

    const dataMunitions = data.optionsmunitions,
            hasDM = dataMunitions?.has ?? false,
            actuelDM = Number(dataMunitions?.actuel ?? 0);

    if(hasDM && actuelDM != 0) {
        for (let n = 0; n <= actuelDM; n++) {

            const raw = dataMunitions.liste[n].raw.concat(armorSpecialRaw);
            const custom = dataMunitions.liste[n].custom.concat(armorSpecialCustom);

            data.optionsmunitions.liste[n].raw = [...new Set(raw)];
            data.optionsmunitions.liste[n].custom = custom;
            data.optionsmunitions.liste[n].liste = listEffects(data.optionsmunitions.liste[n], allEffects, data.optionsmunitions.liste[n]?.chargeur);
        }
    }

    const optionsmunitions = data.optionsmunitions.has;
    const munition = data.optionsmunitions.actuel;

    if(type === 'distance' && optionsmunitions === true) {
        data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice ?? 0;
        data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe ?? 0

        data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice ?? 0;
        data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe ?? 0;
    }

    if(wear !== 'ascension' && !tourelle.has) {
        const equipped = isPj ? data?.equipped ?? false : true;
        const rack = isPj ? data?.rack ?? false : false;

        const options2mains = data.options2mains.has;
        const main = data.options2mains.actuel;

        if(type === 'contact' && options2mains === true) {
            data.degats.dice = data?.options2mains?.[main]?.degats?.dice ?? 0;
            data.degats.fixe = data?.options2mains?.[main]?.degats?.fixe ?? 0;

            data.violence.dice = data?.options2mains?.[main]?.violence?.dice ?? 0;
            data.violence.fixe = data?.options2mains?.[main]?.violence?.fixe ?? 0;
        }


        if (type === 'contact' && equipped === false && rack === false) { armesContactArmoury.push(item); }
        else if (type === 'contact' && equipped === false && rack === true) { armesContactRack.push(item); }
        else if (type === 'contact' && equipped === true) { armesContactEquipee.push(item); }
        else if (type === 'distance' && equipped === false && rack === false) { armesDistanceArmoury.push(item); }
        else if (type === 'distance' && equipped === false && rack === true) { armesDistanceRack.push(item); }
        else if (type === 'distance' && equipped === true) { armesDistanceEquipee.push(item); }
    }

    if(tourelle.has && type === 'distance') armesTourelles.push(item);
}