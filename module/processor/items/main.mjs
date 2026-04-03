import {
  getSpecial,
} from "../../helpers/common.mjs";

import prepareArmor from "./processArmor.mjs";
import prepareArmorLegend from "./processArmorLegend.mjs";
import prepareModule from "./processModule.mjs";
import prepareWpn from "./processWpn.mjs";
import prepareCapacite from "./processCapacite.mjs";
import prepareSimple from "./processSimple.mjs";
import postProcess from "./postProcess.mjs";

const ITEM_PROCESSOR = {
  armure:prepareArmor,
  arme:prepareWpn,
  module:prepareModule,
  armurelegende:prepareArmorLegend,
  capacite:prepareCapacite,
};

export default function prepareCharacterItems(actor) {
  const collections = prepareEmptyCollections();
  const ctx = createItemContext(actor);
  const lion = prepareLionData();
  //const lionLegend = prepareLionData();

  const { items } = ctx;

  for(let i of items) {
    const simpleProcessor = prepareSimple(i, ctx, collections);

    if(simpleProcessor) continue;

    const itemProcessor = ITEM_PROCESSOR[i.type];

    if(itemProcessor) itemProcessor(i, ctx, collections, lion);
  }

  postProcess(actor, ctx, collections, lion);

  assignToActor(actor, ctx, collections);
}

function createItemContext(actor) {
  const isPj = actor.type === 'knight' ? true : false;
  const items = actor.items;
  const system = actor.system;
  const wear = system?.wear ?? "civil";
  const onArmor = wear === 'armure' || wear === 'ascension' || !isPj  ? true : false;

  return {
    actor,
    isPj,
    system,
    wear,
    onArmor,
    items:items,
    capaciteultime:items.find(item => item.type === 'capaciteultime'),
    armorSpecial:getSpecial(actor),
  }
}

function prepareEmptyCollections() {
    return {
      avantages:[],
      inconvenient:[],
      avantagesIA:[],
      inconvenientIA:[],
      motivationMineure:[],
      langue:[],
      contact:[],
      blessure:[],
      trauma:[],
      overdrives:[],
      modules:[],
      moduleErsatz:{},
      moduleBonusDgts:{ contact:[], distance:[] },
      moduleBonusDgtsVariable:{ contact:[], distance:[] },
      moduleBonusViolence:{ contact:[], distance:[] },
      moduleBonusViolenceVariable:{ contact:[], distance:[] },
      armesDistanceModules:[],
      armesContactEquipee:[],
      armesDistanceEquipee:[],
      armesContactRack:[],
      armesDistanceRack:[],
      armesContactArmoury:[],
      armesDistanceArmoury:[],
      armesTourelles:[],
      wpnWithRestrictions:[],
      evolutionsAchetables:[],
      evolutionsCompanions:[],
      evolutionsAAcheter:[],
      cyberware:[],
      carteHeroique:[],
      capaciteHeroique:[],
      distinctions:[],
      armureData:{},
      armureLegendeData:{},
      longbow:{},
      art:{},
      capaciteultime:{},
      capacites:[],
      aspectLieSupp:[],
    }
}

function prepareLionData() {
  return {
      armure:{
      bonus:[0],
      malus:[0]
    },
    champDeForce:{
      bonus:[0],
      malus:[0]
    },
    defense:{
      bonus:[0],
      malus:[0]
    },
    reaction:{
      bonus:[0],
      malus:[0]
    },
    energie:{
      bonus:[0],
      malus:[0]
    },
    initiative:{
      bonus:[0],
      malus:[0]
    },
    armes:{
      contact:[],
      distance:[]
    },
    modules:[],
    bonusDgtsVariable:{ contact:[], distance:[] },
    bonusViolenceVariable:{ contact:[], distance:[] },
    bonusDgts:{ contact:[], distance:[] },
    bonusViolence:{ contact:[],distance:[] },
    slots:{
      tete:{
        used:0,
        value:0
      },
      torse:{
        used:0,
        value:0
      },
      brasGauche:{
        used:0,
        value:0
      },
      brasDroit:{
        used:0,
        value:0
      },
      jambeGauche:{
        used:0,
        value:0
      },
      jambeDroite:{
        used:0,
        value:0
      }
    }
  }
}

const STD_ASSIGN = [
    "carteHeroique",
    "capaciteHeroique",
    "evolutionsCompanions",
    "evolutionsAchetables",
    "evolutionsAAcheter",
    "armureData",
    "armureLegendeData",
    "modules",
    "moduleErsatz",
    "avantages",
    "inconvenient",
    "avantagesIA",
    "inconvenientIA",
    "motivationMineure",
    "langue",
    "contact",
    "blessure",
    "trauma",
    "longbow",
    "armesContactEquipee",
    "armesContactRack",
    "armesContactArmoury" ,
    "armesTourelles",
    "art",
    "distinctions",
    "capaciteultime",
    "cyberware",
    "capacites",
    "aspectLieSupp",
]

function assignToActor(actor, ctx, collections) {
  const {
    capaciteultime
  } = ctx;
  let {
    armureData,
    armureLegendeData,
    wpnWithRestrictions,
    armesDistanceEquipee,
    armesDistanceRack,
    armesDistanceArmoury,
    overdrives,
  } = collections;
  const hasContrecoups = armureData?.system?.special?.selected?.contrecoups;
  const hasWpnRestrictions = hasContrecoups !== undefined && hasContrecoups.armedistance.value === false ? true : false;

  for(let std of STD_ASSIGN) {
    actor[std] = collections[std];
  }

  actor.moduleOD = overdrives;
  actor.capaciteultime = capaciteultime;
  actor.cannotUseDistance = hasWpnRestrictions ? true : false;
  actor.armesDistanceEquipee = hasWpnRestrictions ? wpnWithRestrictions : armesDistanceEquipee;
  actor.armesDistanceRack = hasWpnRestrictions ? [] :armesDistanceRack;
  actor.armesDistanceArmoury = hasWpnRestrictions ? [] :armesDistanceArmoury;
  actor.armureLegendeData = armureLegendeData;
}