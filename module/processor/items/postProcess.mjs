import {
  sum,
} from "../../helpers/common.mjs";

export default function postProcess(actor, ctx, collections, lion) {
    postProcessWpn(actor, ctx, collections);
    postProcessArmor(ctx, collections, lion);
}

function postProcessWpn(actor, ctx, collections) {
    const { armorSpecial } = ctx;

    const armorSpecialRaw = armorSpecial?.raw || [];
    const armorSpecialCustom = armorSpecial?.custom || [];

    let system = actor.system;
    let {
        armesContactEquipee,
        armesDistanceEquipee,
        moduleBonusDgts,
        moduleBonusDgtsVariable,
        moduleBonusViolence,
        moduleBonusViolenceVariable
    } = collections;

    for(let i = 0;i < armesContactEquipee.length;i++) {
      armesContactEquipee[i].system.degats.module = {};
      armesContactEquipee[i].system.degats.module.fixe = moduleBonusDgts.contact;
      armesContactEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.contact;

      armesContactEquipee[i].system.violence.module = {};
      armesContactEquipee[i].system.violence.module.fixe = moduleBonusViolence.contact;
      armesContactEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.contact;
    };

    for(let i = 0;i < armesDistanceEquipee.length;i++) {
      armesDistanceEquipee[i].system.degats.module = {};
      armesDistanceEquipee[i].system.degats.module.fixe = moduleBonusDgts.distance;
      armesDistanceEquipee[i].system.degats.module.variable = moduleBonusDgtsVariable.distance;

      armesDistanceEquipee[i].system.violence.module = {};
      armesDistanceEquipee[i].system.violence.module.fixe = moduleBonusViolence.distance;
      armesDistanceEquipee[i].system.violence.module.variable = moduleBonusViolenceVariable.distance;
    };

    if(system?.combat?.grenades?.liste) {
        for (let [key, grenade] of Object.entries(system.combat.grenades.liste)){
        const effetsRaw = grenade.effets.raw.concat(armorSpecialRaw);
        const effetsCustom = grenade.effets.custom.concat(armorSpecialCustom);

        system.combat.grenades.liste[key].effets.raw = [...new Set(effetsRaw)];
        system.combat.grenades.liste[key].effets.custom = [...new Set(effetsCustom)];
        };
    }

    if(system?.combat?.armesimprovisees?.liste) {
        for (let [kAI, armesimprovisees] of Object.entries(system.combat.armesimprovisees.liste)) {
        for (let [key, arme] of Object.entries(armesimprovisees.liste)) {
            arme.effets.raw = armorSpecialRaw;
            arme.effets.custom = armorSpecialCustom;
        }
        };
    }
}

function postProcessArmor(ctx, collections, lion) {
    const { capaciteultime } = ctx;
    let {
        armureData,
        armureLegendeData,
        armesDistanceModules,
    } = collections;

    const hasCompanions = armureData?.system?.capacites?.selected?.companions || false;

    if(hasCompanions) {
        const lionData = armureData.system.capacites.selected.companions.lion;
        const lionCDF = +lionData.champDeForce.base;
        const lionArmure = +lionData.armure.base;
        const lionDefense = +lionData.defense.base;
        const lionReaction = +lionData.reaction.base;
        const lionEnergie = +lionData.energie.base;
        const lionInitiativeB = +lionData.initiative.value;
        const lionSlots = lionData.slots;

        lionData.champDeForce.value = lionCDF+lion.champDeForce.bonus.reduce(sum)-lion.champDeForce.malus.reduce(sum);
        lionData.champDeForce.bonus = lion.champDeForce.bonus;
        lionData.champDeForce.malus = lion.champDeForce.malus;

        lionData.armure.value = lionArmure+lion.armure.bonus.reduce(sum)-lion.armure.malus.reduce(sum);
        lionData.armure.bonus = lion.armure.bonus;
        lionData.armure.malus = lion.armure.malus;

        lionData.defense.value = lionDefense+lion.defense.bonus.reduce(sum)-lion.defense.malus.reduce(sum);
        lionData.defense.bonus = lion.defense.bonus;
        lionData.defense.malus = lion.defense.malus;

        lionData.reaction.value = lionReaction+lion.reaction.bonus.reduce(sum)-lion.reaction.malus.reduce(sum);
        lionData.reaction.bonus = lion.reaction.bonus;
        lionData.reaction.malus = lion.reaction.malus;

        lionData.energie.value = lionEnergie+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
        lionData.energie.bonus = lion.energie.bonus;
        lionData.energie.malus = lion.energie.malus;

        lionData.initiative.total = lionInitiativeB+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
        lionData.initiative.bonus = lion.initiative.bonus;
        lionData.initiative.malus = lion.initiative.malus;

        lionData.bonusDgtsVariable = lion.bonusDgtsVariable;
        lionData.bonusDgts = lion.bonusDgts;

        lionData.bonusViolenceVariable = lion.bonusViolenceVariable;
        lionData.bonusViolence = lion.bonusViolence;

        lionData.modules = [];
        lionData.modules = lion.modules;

        if(!lionSlots) {
            lionData.slots = {};
            lionData.slots.tete = {
                used:0,
                value:8,
            };
            lionData.slots.torse = {
                used:0,
                value:10,
            };
            lionData.slots.brasGauche = {
                used:0,
                value:8,
            };
            lionData.slots.brasDroit = {
                used:0,
                value:8,
            };
            lionData.slots.jambeGauche = {
                used:0,
                value:8,
            };
            lionData.slots.jambeDroite = {
                used:0,
                value:8,
            };
        }



        for (const slot of ['tete','torse','brasGauche','brasDroit','jambeGauche','jambeDroite']) {
            lionData.slots[slot].used = lion.slots[slot].used;
        }
    };

    const hasCompanionsLegend = armureLegendeData?.system?.capacites?.selected?.companions || false;

    if(hasCompanionsLegend) {
        const lionData = armureLegendeData.system.capacites.selected.companions.lion;
        const lionCDF = +lionData.champDeForce.base;
        const lionArmure = +lionData.armure.base;
        const lionDefense = +lionData.defense.base;
        const lionReaction = +lionData.reaction.base;
        const lionEnergie = +lionData.energie.base;
        const lionInitiativeB = +lionData.initiative.value;
        const lionSlots = lionData.slots;

        lionData.champDeForce.value = lionCDF+lion.champDeForce.bonus.reduce(sum)-lion.champDeForce.malus.reduce(sum);
        lionData.champDeForce.bonus = lion.champDeForce.bonus;
        lionData.champDeForce.malus = lion.champDeForce.malus;

        lionData.armure.value = lionArmure+lion.armure.bonus.reduce(sum)-lion.armure.malus.reduce(sum);
        lionData.armure.bonus = lion.armure.bonus;
        lionData.armure.malus = lion.armure.malus;

        lionData.defense.value = lionDefense+lion.defense.bonus.reduce(sum)-lion.defense.malus.reduce(sum);
        lionData.defense.bonus = lion.defense.bonus;
        lionData.defense.malus = lion.defense.malus;

        lionData.reaction.value = lionReaction+lion.reaction.bonus.reduce(sum)-lion.reaction.malus.reduce(sum);
        lionData.reaction.bonus = lion.reaction.bonus;
        lionData.reaction.malus = lion.reaction.malus;

        lionData.energie.value = lionEnergie+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
        lionData.energie.bonus = lion.energie.bonus;
        lionData.energie.malus = lion.energie.malus;

        lionData.initiative.total = lionInitiativeB+lion.energie.bonus.reduce(sum)-lion.energie.malus.reduce(sum);
        lionData.initiative.bonus = lion.initiative.bonus;
        lionData.initiative.malus = lion.initiative.malus;

        lionData.bonusDgtsVariable = lion.bonusDgtsVariable;
        lionData.bonusDgts = lion.bonusDgts;

        lionData.bonusViolenceVariable = lion.bonusViolenceVariable;
        lionData.bonusViolence = lion.bonusViolence;

        lionData.modules = [];
        lionData.modules = lion.modules;

        if(!lionSlots) {
        lionData.slots = {};
        lionData.slots.tete = {
            used:0,
            value:8,
        };
        lionData.slots.torse = {
            used:0,
            value:10,
        };
        lionData.slots.brasGauche = {
            used:0,
            value:8,
        };
        lionData.slots.brasDroit = {
            used:0,
            value:8,
        };
        lionData.slots.jambeGauche = {
            used:0,
            value:8,
        };
        lionData.slots.jambeDroite = {
            used:0,
            value:8,
        };
        }

        lionData.slots.tete.used = lion.slots.tete.used;
        lionData.slots.torse.used = lion.slots.torse.used;
        lionData.slots.brasGauche.used = lion.slots.brasGauche.used;
        lionData.slots.brasDroit.used = lion.slots.brasDroit.used;
        lionData.slots.jambeDroite.used = lion.slots.jambeDroite.used;
        lionData.slots.jambeGauche.used = lion.slots.jambeGauche.used;
    };

    if(capaciteultime) {
      const CUData = capaciteultime.system;

      if(CUData.type === 'active') {
        const CUAData = CUData.actives;

        if(CUAData.reaction > 0 || CUAData.defense > 0 ||
          CUAData.recuperation.PA || CUAData.recuperation.PS ||
          CUAData.recuperation.PE || (CUAData.jet.actif && CUAData.jet.isfixe) ||
          (CUAData.degats.actif && CUAData.degats.isfixe) ||
          (CUAData.violence.actif && CUAData.violence.isfixe) ||
          CUAData.effets.actif) CUData.actives.isActivable = true;
        else CUData.actives.isActivable = false;
      }
    }

    const hasContrecoups = armureData?.system?.special?.selected?.contrecoups;
    const hasWpnRestrictions = hasContrecoups !== undefined && hasContrecoups.armedistance.value === false ? true : false;
    collections.wpnWithRestrictions = hasWpnRestrictions ? armesDistanceModules : [];
}