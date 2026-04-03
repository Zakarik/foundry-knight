import {
    getAllEffects,
    listEffects,
} from "../../helpers/common.mjs";

const SIMPLE_PROCESSOR = {
  avantage:prepareAvantageInconvenient,
  inconvenient:prepareAvantageInconvenient,
  contact:justAdd,
  cyberware:prepareCyberware,
  motivationMineure:prepareSimpleArray,
  capaciteheroique:prepareSimpleArray,
  carteheroique:prepareSimpleArray,
  langue:prepareSimpleArray,
  blessure:prepareSimpleArray,
  trauma:prepareSimpleArray,
  distinction:prepareSimpleArray,
  art:prepareSimpleItem,
};

export default function prepareSimple(item, ctx, collections) {
    const handler = SIMPLE_PROCESSOR[item.type];

    if(handler) {
        handler(item, ctx, collections);
        return true;
    }

    return false;
}

function prepareAvantageInconvenient(item, ctx, collections) {
    const i = item.toObject();
    let { avantages, avantagesIA, inconvenient, inconvenientIA } = collections;

    if(item.type === 'avantage') {
        if(item.system.type === 'ia') avantagesIA.push(i);
        else avantages.push(i);
    } else if(item.type === 'inconvenient') {
        if(item.system.type === 'ia') inconvenientIA.push(i);
        else inconvenient.push(i);
    }
}

function prepareCyberware(item, ctx, collections) {
    let {
        armesContactEquipee,
        armesDistanceEquipee,
        cyberware,
    } = collections;
    const { armorSpecial } = ctx;

    const armorSpecialRaw = armorSpecial?.raw || [];
    const armorSpecialCustom = armorSpecial?.custom || [];
    const itemWpnCyberware = item.system.prepareForWpn(armorSpecialRaw, armorSpecialCustom);

    cyberware.push(item)

    if(itemWpnCyberware.type === 'contact') armesContactEquipee.push(itemWpnCyberware.wpn);
    else if(itemWpnCyberware.type === 'distance') armesDistanceEquipee.push(itemWpnCyberware.wpn);
}

function prepareSimpleArray(item, ctx, collections) {
    const type = collections?.[translateType(item.type)];

    if(type) type.push(item);
}

function prepareSimpleItem(item, ctx, collections) {
    const type = collections?.[translateType(item.type)];

    if(type) foundry.utils.mergeObject(type, item);
}

function justAdd(item, ctx, collections) {
    collections[item.type].push(item);
}

function translateType(type) {
    let result = type;

    switch(type) {
        case 'capaciteheroique':
            result = 'capaciteHeroique';
        break;
        case 'carteheroique':
            result = 'carteHeroique';
        break;
    }

    return result;
}