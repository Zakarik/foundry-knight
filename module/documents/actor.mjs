import {
  getDefaultImg,
} from "../helpers/common.mjs";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class KnightActor extends Actor {

  /**
     * Create a new entity using provided input data
     * @override
     */
  static async create(data, context={}) {
    if (data.img === undefined) data.img = getDefaultImg(data.type);

    const createData = data instanceof Array ? data : [data];
    const created = await this.createDocuments(createData, context);
    return data instanceof Array ? created : created.shift();
  }

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  prepareDerivedData() {
    const actorData = this;

    this._prepareKnightData(actorData);
    this._preparePNJData(actorData);
    this._prepareCreatureData(actorData);
    this._prepareBandeData(actorData);
    this._prepareVehiculeData(actorData);
    this._prepareMechaArmureData(actorData);
  }

  async _prepareKnightData(actorData) {
    if (actorData.type !== 'knight') return;

    // Make modifications to data here.
    const currentVersion = game.settings.get("knight", "systemVersion");
    const data = actorData.system;
    const isKraken = data.options.kraken;
    const armor = actorData.items.find(items => items.type === 'armure');
    const armorWear = armor?.system || false;
    const armorLegendeWear = this.items.get(data.equipements.armure?.idLegende)?.system || false;
    const capaciteultime = actorData.items.find(items => items.type === 'capaciteultime');
    let passiveUltime = undefined;

    if(capaciteultime !== undefined) {
      const dataCapaciteUltime = capaciteultime.system;

      if(dataCapaciteUltime.type == 'passive') passiveUltime = dataCapaciteUltime.passives;
    }

    if(armorWear != false) {
      if(armorWear.generation >= 4) {
        data.wear = 'armure';
      }
    }

    const dataWear = (armorWear === false && data.wear === 'armure') ? 'tenueCivile' : data.wear;

    const equipement = (dataWear === "armure" && armorWear != false) || (dataWear === "ascension" && armorWear != false)  ? armorWear : data.equipements[dataWear];

    data.jauges = dataWear === "ascension" ? data.equipements[dataWear].jauges : equipement.jauges;

    const dataJauges = data.jauges;
    const aspects = data.aspects;

    if(armorLegendeWear !== false) {
      const hasRecolteFlux = armorLegendeWear?.special?.selected?.recolteflux || false;

      if(hasRecolteFlux !== false) {
        dataJauges.flux = true;
      }
    }

    // GESTION XP
    const experienceListe = data.progression.experience.depense.liste;
    const eListeIsArray = experienceListe.length === undefined ? false : true;

    if(eListeIsArray) {
      for(let i = 0;i < experienceListe.length;i++) {
        const carac = experienceListe[i].caracteristique;

        switch(carac) {
          case 'chair':
            aspects.chair.bonus += experienceListe[i].bonus;
            break;

          case 'bete':
            aspects.bete.bonus += experienceListe[i].bonus;
            break;

          case 'machine':
            aspects.machine.bonus += experienceListe[i].bonus;
            break;

          case 'dame':
            aspects.dame.bonus += experienceListe[i].bonus;
            break;

          case 'masque':
            aspects.masque.bonus += experienceListe[i].bonus;
            break;

          case 'deplacement':
          case 'force':
          case 'endurance':
            aspects.chair.caracteristiques[carac].bonus += experienceListe[i].bonus;
            break;

          case 'combat':
          case 'hargne':
          case 'instinct':
            aspects.bete.caracteristiques[carac].bonus += experienceListe[i].bonus;
            break;

          case 'tir':
          case 'savoir':
          case 'technique':
            aspects.machine.caracteristiques[carac].bonus += experienceListe[i].bonus;
            break;

          case 'parole':
          case 'aura':
          case 'sangFroid':
            aspects.dame.caracteristiques[carac].bonus += experienceListe[i].bonus;
            break;

          case 'discretion':
          case 'dexterite':
          case 'perception':
            aspects.masque.caracteristiques[carac].bonus += experienceListe[i].bonus;
            break;
        }
      }
    } else {
      for(let [key, depense] of Object.entries(experienceListe)) {
        const carac = depense.caracteristique;

        switch(carac) {
          case 'chair':
            aspects.chair.bonus += depense.bonus;
            break;

          case 'bete':
            aspects.bete.bonus += depense.bonus;
            break;

          case 'machine':
            aspects.machine.bonus += depense.bonus;
            break;

          case 'dame':
            aspects.dame.bonus += depense.bonus;
            break;

          case 'masque':
            aspects.masque.bonus += depense.bonus;
            break;

          case 'deplacement':
          case 'force':
          case 'endurance':
            aspects.chair.caracteristiques[carac].bonus += depense.bonus;
            break;

          case 'combat':
          case 'hargne':
          case 'instinct':
            aspects.bete.caracteristiques[carac].bonus += depense.bonus;
            break;

          case 'tir':
          case 'savoir':
          case 'technique':
            aspects.machine.caracteristiques[carac].bonus += depense.bonus;
            break;

          case 'parole':
          case 'aura':
          case 'sangFroid':
            aspects.dame.caracteristiques[carac].bonus += depense.bonus;
            break;

          case 'discretion':
          case 'dexterite':
          case 'perception':
            aspects.masque.caracteristiques[carac].bonus += depense.bonus;
            break;
        }
      }
    }

    // ASPECTS
    for (let [key, aspect] of Object.entries(aspects)){
      const base = aspect.base ?? 0;
      const bonus = aspect.bonus ?? 0;
      const malus = aspect.malus ?? 0;
      const total = base+bonus-malus;

      aspect.value = Math.min(Math.max(total, 0), 9);

      // CARACTERISTIQUES
      for (let [keyCar, carac] of Object.entries(aspect.caracteristiques)){
        const baseCarac = carac.base ?? 0;
        const bonusCarac = carac.bonus ?? 0;
        const malusCarac = carac.malus ?? 0;
        const totalCarac = baseCarac+bonusCarac-malusCarac;

        carac.value = Math.min(Math.max(totalCarac, 0), aspect.value);

        // OD
        const overdrive = carac.overdrive;
        const baseOD = overdrive.base ?? 0;
        const bonusOD = overdrive.bonus ?? 0;
        const malusOD = overdrive.malus ?? 0;
        const totalOD = baseOD+bonusOD-malusOD;

        carac.overdrive.value = Math.max(totalOD, 0);
      }
    }

    const chairMax = Math.max(data.aspects.chair.caracteristiques.deplacement.value, data.aspects.chair.caracteristiques.force.value, data.aspects.chair.caracteristiques.endurance.value);
    const beteMax = Math.max(data.aspects.bete.caracteristiques.hargne.value, data.aspects.bete.caracteristiques.combat.value, data.aspects.bete.caracteristiques.instinct.value);
    const machineMax = Math.max(data.aspects.machine.caracteristiques.tir.value, data.aspects.machine.caracteristiques.savoir.value, data.aspects.machine.caracteristiques.technique.value);
    const dameMax = Math.max(data.aspects.dame.caracteristiques.aura.value, data.aspects.dame.caracteristiques.parole.value, data.aspects.dame.caracteristiques.sangFroid.value);
    const masqueMax = Math.max(data.aspects.masque.caracteristiques.discretion.value, data.aspects.masque.caracteristiques.dexterite.value, data.aspects.masque.caracteristiques.perception.value);

    const beteWODMax = Math.max(data.aspects.bete.caracteristiques.hargne.value+data.aspects.bete.caracteristiques.hargne.overdrive.value,
      data.aspects.bete.caracteristiques.combat.value+data.aspects.bete.caracteristiques.combat.overdrive.value,
      data.aspects.bete.caracteristiques.instinct.value+data.aspects.bete.caracteristiques.instinct.overdrive.value);
    const machineWODMax = Math.max(data.aspects.machine.caracteristiques.tir.value+data.aspects.machine.caracteristiques.tir.overdrive.value,
      data.aspects.machine.caracteristiques.savoir.value+data.aspects.machine.caracteristiques.savoir.overdrive.value,
      data.aspects.machine.caracteristiques.technique.value+data.aspects.machine.caracteristiques.technique.overdrive.value);
    const masqueWODMax = Math.max(data.aspects.masque.caracteristiques.discretion.value+data.aspects.masque.caracteristiques.discretion.overdrive.value,
      data.aspects.masque.caracteristiques.dexterite.value+data.aspects.masque.caracteristiques.dexterite.overdrive.value,
      data.aspects.masque.caracteristiques.perception.value+data.aspects.masque.caracteristiques.perception.overdrive.value);

    // SANTE
    if(dataJauges.sante) {
      const valueBase = isKraken ? 8 : 6;
      const userSBase = (chairMax*valueBase)+10;
      let santeBonus = data.sante.bonus?.user ?? 0;
      let santeMalus = data.sante.malus?.user ?? 0;

      if(dataWear === "armure" || dataWear === "ascension") {
        const ODEndurance =  aspects?.chair?.caracteristiques?.endurance?.overdrive?.value || 0;

        if(ODEndurance >= 3) santeBonus += 6;
      }
      data.sante.base = userSBase;

      if(!data.sante.bonusValue) data.sante.bonusValue = santeBonus;
      else data.sante.bonusValue += santeBonus;

      if(!data.sante.malusValue) data.sante.malusValue = santeMalus;
      else data.sante.malusValue += santeMalus;

      const totalSante = userSBase+data.sante.bonusValue-data.sante.malusValue;
      let bonusSCU = 0;

      if(dataWear === "armure" && passiveUltime !== undefined) {
        if(passiveUltime.sante) bonusSCU = Math.floor(totalSante/2);
      }

      data.sante.max = Math.max(totalSante+bonusSCU, 0);
    }

    // ARMURE
    if(dataJauges.armure) {
      const armureDataBonus = data.armure.bonus ?? 0;
      const armureDataMalus = data.armure.malus ?? 0;

      const armureBonus = data.equipements[dataWear].armure.bonus.user ?? 0;
      const armureMalus = data.equipements[dataWear].armure.malus.user ?? 0;

      data.armure.max = armureDataBonus+armureBonus-armureDataMalus-armureMalus;
    }

    // ENERGIE
    if(dataJauges.energie) {
      const userEBase = equipement.energie?.base ?? 0;
      const energieBonus = data.equipements[dataWear].energie.bonus?.user ?? 0;
      const energieMalus = data.equipements[dataWear].energie.malus?.user ?? 0;

      data.energie.base = equipement.energie.base;

      if(!data.energie.bonus) data.energie.bonus = energieBonus;
      else data.energie.bonus += energieBonus;

      if(!data.energie.malus) data.energie.malus = energieMalus;
      else data.energie.malus += energieMalus;

      equipement.energie.mod = data.energie.bonus-data.energie.malus;
      equipement.energie.max = Math.max(userEBase+equipement.energie.mod, 0);
      equipement.energie.value = data.energie.value;

      data.energie.max = equipement.energie.max;
    }

    // CHAMP DE FORCE
    if(dataJauges.champDeForce) {
      const userCDFBase = data.champDeForce?.base ?? 0;
      const CDFDataBonus = data.equipements[dataWear].champDeForce.bonus?.user ?? 0;
      const CDFDataMalus = data.equipements[dataWear].champDeForce.malus?.user ?? 0;

      if(!data.champDeForce.bonus) data.champDeForce.bonus = CDFDataBonus;
      else data.champDeForce.bonus += CDFDataBonus;

      if(!data.champDeForce.malus) data.champDeForce.malus = CDFDataMalus;
      else data.champDeForce.malus += CDFDataMalus;

      data.champDeForce.value = userCDFBase+data.champDeForce.bonus-data.champDeForce.malus;
    }

    // ESPOIR
    if(dataJauges.espoir) {
      const hasPlusEspoir = armorWear !== false && armorWear?.special?.selected?.plusespoir != undefined ? armorWear?.special?.selected?.plusespoir.espoir.base : 50;
      const userEBase = hasPlusEspoir;
      const espoirDataBonus = data.espoir.bonus?.user ?? 0;
      const espoirDataMalus = data.espoir.malus?.user ?? 0;

      if(!data.espoir.bonusValue) data.espoir.bonusValue = espoirDataBonus;
      else data.espoir.bonusValue += espoirDataBonus;

      if(!data.espoir.malusValue) data.espoir.malusValue = espoirDataMalus;
      else data.espoir.malusValue += espoirDataMalus;

      data.espoir.max = Math.max(userEBase+data.espoir.bonusValue-data.espoir.malusValue, 0);
    }

    //EGIDE
    const hasEgide = game.settings.get("knight", "acces-egide");

    if(hasEgide) {
      const userSBase = data.egide?.base ?? 0;
      const egideDataBonus = data.egide.bonus?.user ?? 0;
      const egideDataMalus = data.egide.malus?.user ?? 0;

      if(!data.egide.bonusValue) data.egide.bonusValue = egideDataBonus;
      else data.egide.bonusValue += egideDataBonus;

      if(!data.egide.malusValue) data.egide.malusValue = egideDataMalus;
      else data.egide.malusValue += egideDataMalus;

      data.egide.value = Math.max(userSBase+data.egide.bonusValue-data.egide.malusValue, 0);
    }

    // INITIATIVE
    const hasEmbuscadeSubis = data.options?.embuscadeSubis || false;
    const hasEmbuscadePris = data.options?.embuscadePris || false;
    const userIBase = dataWear === 'armure' || dataWear === 'ascension' ? masqueWODMax : masqueMax;
    const initiativeDataDiceBase = data.initiative.diceBase;
    let initiativeDataDiceMod = data.initiative?.diceMod || 0;
    let initiativeDataMod = data.initiative?.mod || 0;

    let initiativeBonus = data.initiative.bonus.user;
    let initiativeMalus = data.initiative.malus.user;

    if(dataWear === "armure" || dataWear === "ascension") {
      const ODInstinct =  aspects?.bete?.caracteristiques?.instinct?.overdrive?.value || 0;

      if(ODInstinct >= 3) initiativeDataMod += ODInstinct*3;
    }

    if(hasEmbuscadeSubis) {
      const bonusDice = +data?.bonusSiEmbuscade?.bonusInitiative?.dice || 0;
      const bonusFixe = +data?.bonusSiEmbuscade?.bonusInitiative?.fixe || 0;

      initiativeDataDiceMod += bonusDice;
      initiativeDataMod += bonusFixe;
    }

    if(hasEmbuscadePris) {
      initiativeDataDiceMod += 10;
    }

    data.initiative.dice = Math.max(initiativeDataDiceBase+initiativeDataDiceMod, 1);
    data.initiative.base = userIBase;
    data.initiative.value = Math.max(userIBase+initiativeDataMod+initiativeBonus-initiativeMalus, 0);
    data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;

    // REACTION
    const userRBase = dataWear === 'armure' || dataWear === 'ascension' ? machineWODMax : machineMax;
    const reactionDataBonus = data.reaction.bonus?.user ?? 0;
    const reactionDataMalus = data.reaction.malus?.user ?? 0;

    let reactionBonus = isKraken ? 1 : 0;

    if(!data.reaction.bonusValue) data.reaction.bonusValue = reactionDataBonus;
    else data.reaction.bonusValue += reactionDataBonus;

    if(!data.reaction.malusValue) data.reaction.malusValue = reactionDataMalus;
    else data.reaction.malusValue += reactionDataMalus;

    data.reaction.base = userRBase;
    data.reaction.value = Math.max(userRBase+data.reaction.bonusValue+reactionBonus-data.reaction.malusValue, 0);

    // DEFENSE
    const userDBase = dataWear === 'armure' || dataWear === 'ascension' ? beteWODMax : beteMax;
    const defenseDataBonus = data.defense.bonus.user;
    const defenseDataMalus = data.defense.malus.user;

    let defenseBonus = isKraken ? 1 : 0;

    if(dataWear === "armure" || dataWear === "ascension") {
      const ODAura =  aspects?.dame?.caracteristiques?.aura?.overdrive?.value || 0;

      if(ODAura >= 5) defenseBonus += aspects.dame.caracteristiques.aura.value;
    }

    if(!data.defense.bonusValue) data.defense.bonusValue = defenseDataBonus;
    else data.defense.bonusValue += defenseDataBonus;

    if(!data.defense.malusValue) data.defense.malusValue = defenseDataMalus;
    else data.defense.malusValue += defenseDataMalus;

    data.defense.base = userDBase;
    data.defense.value = Math.max(userDBase+data.defense.bonusValue+defenseBonus-data.defense.malusValue, 0);

    // LANGUES
    const userLBase = Math.max(data.aspects.machine.caracteristiques.savoir.value-1, 1);
    const userLBonus = data.langues.mod;

    data.langues.value = userLBase+userLBonus;

    // CONTACTS
    const userCBase = dameMax;
    const userCBonus = data.contacts.mod;

    let bonusCCU = 0;

    if(dataWear === "armure" && passiveUltime !== undefined) {
      if(passiveUltime.contact.actif) bonusCCU = passiveUltime.contact.value;
    }

    data.contacts.value = userCBase+userCBonus+bonusCCU;

    // STYLES
    data.combat.styleInfo = game.i18n.localize(CONFIG.KNIGHT.styles[data.combat.style]);

    // PG
    const dataProgression = data.progression;

    const dataPG = dataProgression.gloire;
    const PGActuel = Number(dataPG.actuel);
    const PGDepenseListe = dataPG.depense.liste;

    let PGTotalDepense = 0;

    for(const PG in PGDepenseListe) {
      if(!PGDepenseListe[PG].isArmure) PGTotalDepense += Number(PGDepenseListe[PG].value);
    }

    if(foundry.utils.isNewerVersion(currentVersion, '3.7.9')) data.progression.gloire.actuel = Number(dataPG.total)-PGTotalDepense;
    data.progression.gloire.depense.total = PGTotalDepense;

    // XP
    const dataPX = dataProgression.experience;
    const PXActuel = dataPX.actuel;
    const PXDepenseListe = dataPX.depense.liste;
    const isArray = PXDepenseListe.length === undefined ? false : true;

    let PXTotalDepense = 0;

    if(isArray) {
      for(let i = 0;i < PXDepenseListe.length;i++) {
        PXTotalDepense += +PXDepenseListe[i].cout;
      }
    } else {
      for(let [key, depense] of Object.entries(PXDepenseListe)) {
        PXTotalDepense += +depense.cout;
      }
    }

    if(foundry.utils.isNewerVersion(currentVersion, '3.7.9')) data.progression.experience.actuel = Number(dataPX.total)-PXTotalDepense;
    data.progression.experience.depense.total = PXTotalDepense;

    //data.progression.experience.total = PXTotalDepense+PXActuel;

    //NETTOYE LES ARMES A DISTANCE S'IL NE PEUT PORTER DES ARMES A DISTANCE
    const cannotUseDistance = armor?.system?.special?.selected?.contrecoups?.armedistance?.value ?? undefined;
    if(cannotUseDistance === false) {
      const itmWpn = actorData.items.find(wpn => wpn.type === 'arme' && wpn.system.type === 'distance');
      if(itmWpn !== undefined) itmWpn.delete();
    }
  }

  _preparePNJData(actorData) {
    if (actorData.type !== 'pnj') return;

    // Make modifications to data here.
    const actor = actorData;
    const data = actor.system;
    const options = data.options;
    const aspectsMachine = data.aspects.machine;
    const aspectsMasque = data.aspects.masque;

    // SANTE - ARMURE - ENERGIE - CDF - BOUCLIER
    const list = ['sante', 'armure', 'energie', 'champDeForce', 'bouclier'];

    for(let i = 0;i < list.length;i++) {
      const label = list[i];

      if(options[label]) {
        const userBase = data[label]?.base ?? 0;
        const dataBonus = data[label]?.bonus?.user ?? 0;
        const dataMalus = data[label]?.malus?.user ?? 0;

        if(!data[label].bonusValue) data[label].bonusValue = dataBonus;
        else data[label].bonusValue += dataBonus;

        if(!data[label].malusValue) data[label].malusValue = dataMalus;
        else data[label].malusValue += dataMalus;

        if(label === 'champDeForce' || label === 'bouclier') data[label].value = Math.max(userBase+data[label].bonusValue-data[label].malusValue, 0);
        else data[label].max = Math.max(userBase+data[label].bonusValue-data[label].malusValue, 0);
      }
    }

    // INITIATIVE
    const initiativeDataDiceBase = data.initiative?.diceBase ?? 0;

    let initiativeDiceBonus = 0;
    let initiativeDiceMalus = 0;
    let initiativeBonus = data.initiative?.bonus?.user ?? 0;
    let initiativeMalus = data.initiative?.malus?.user ?? 0;

    const hasEmbuscadeSubis = data.options?.embuscadeSubis || false;
    const hasEmbuscadePris = data.options?.embuscadePris || false;

    if(hasEmbuscadeSubis) {
      const bonusDice = +data?.bonusSiEmbuscade?.bonusInitiative?.dice || 0;
      const bonusFixe = +data?.bonusSiEmbuscade?.bonusInitiative?.fixe || 0;

      initiativeDiceBonus += bonusDice;
      initiativeBonus += bonusFixe;
    }

    if(hasEmbuscadePris) {
      initiativeBonus += 10;
    }

    if(aspectsMasque.ae.majeur.value > 0) {
      data.initiative.dice = 0;
      data.initiative.base = 0;
      data.initiative.value = 30;
    } else {
      data.initiative.dice = Math.max(initiativeDataDiceBase+initiativeDiceBonus-initiativeDiceMalus, 1);
      data.initiative.base = initiativeDataDiceBase;
      data.initiative.value = Math.max(0+initiativeBonus-initiativeMalus, 0);
    }

    data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;

    // REACTION
    const reactionDataBase = data.reaction?.base ?? 0;
    const reactionDataBonus = data.reaction.bonus?.user ?? 0;
    const reactionDataMalus = data.reaction.malus?.user ?? 0;

    if(!data.reaction.bonusValue) data.reaction.bonusValue = reactionDataBonus;
    else data.reaction.bonusValue += reactionDataBonus;

    if(!data.reaction.malusValue) data.reaction.malusValue = reactionDataMalus;
    else data.reaction.malusValue += reactionDataMalus;

    if(aspectsMachine.ae.mineur.value > 0 || aspectsMachine.ae.majeur.value > 0) {
      data.reaction.bonusValue += +aspectsMachine.ae.mineur.value + +aspectsMachine.ae.majeur.value;
    }

    data.reaction.value = Math.max(reactionDataBase+data.reaction.bonusValue-data.reaction.malusValue, 0);

    // DEFENSE
    const defenseDataBase = data.defense?.base ?? 0;
    const defenseDataBonus = data.defense.bonus?.user ?? 0;
    const defenseDataMalus = data.defense.malus?.user ?? 0;

    if(!data.defense.bonusValue) data.defense.bonusValue = defenseDataBonus;
    else data.defense.bonusValue += defenseDataBonus;

    if(!data.defense.malusValue) data.defense.malusValue = defenseDataMalus;
    else data.defense.malusValue += defenseDataMalus;

    if(aspectsMasque.ae.mineur.value > 0 || aspectsMasque.ae.majeur.value > 0) {
      data.defense.bonusValue += +aspectsMasque.ae.mineur.value + +aspectsMasque.ae.majeur.value;
    }

    data.defense.value = Math.max(defenseDataBase+data.defense.bonusValue-data.defense.malusValue, 0);

    // VERFICIATION MAX ASPECTS
    for (let [key, aspect] of Object.entries(data.aspects)) {
      const aeMaj = +aspect.ae.majeur.value;
      const aeMin = +aspect.ae.mineur.value;

      if(aspect.value > aspect.max) {
        aspect.value = aspect.max;
      }

      if(aeMaj > aspect.ae.majeur.max) {
        aspect.ae.majeur.value = aspect.ae.majeur.max;
      }

      if(aeMin > aspect.ae.mineur.max) {
        aspect.ae.mineur.value = aspect.ae.mineur.max;
      }
    }
  }

  _prepareCreatureData(actorData) {
    if (actorData.type !== 'creature') return;

    // Make modifications to data here.
    const actor = actorData;
    const data = actor.system;
    const options = data.options;
    const aspectsMachine = data.aspects.machine;
    const aspectsMasque = data.aspects.masque;

    // SANTE - ARMURE - ENERGIE - BOUCLIER
    const list = ['sante', 'armure', 'energie', 'bouclier'];

    for(let i = 0;i < list.length;i++) {
      const label = list[i];

      if(options[label]) {
        const userBase = data[label]?.base ?? 0;
        const dataBonus = data[label]?.bonus?.user ?? 0;
        const dataMalus = data[label]?.malus?.user ?? 0;

        if(!data[label].bonusValue) data[label].bonusValue = dataBonus;
        else data[label].bonusValue += dataBonus;

        if(!data[label].malusValue) data[label].malusValue = dataMalus;
        else data[label].malusValue += dataMalus;

        if(label === 'bouclier') data[label].value = Math.max(userBase+data[label].bonusValue-data[label].malusValue, 0);
        else data[label].max = Math.max(userBase+data[label].bonusValue-data[label].malusValue, 0);
      }
    }

    // INITIATIVE
    const initiativeDataDiceBase = data.initiative?.diceBase ?? 0;

    let initiativeDiceBonus = 0;
    let initiativeDiceMalus = 0;
    let initiativeBonus = data?.initiative?.bonus?.user ?? 0;
    let initiativeMalus = data?.initiative?.malus?.user ?? 0;

    const hasEmbuscadeSubis = data.options?.embuscadeSubis || false;
    const hasEmbuscadePris = data.options?.embuscadePris || false;

    if(hasEmbuscadeSubis) {
      const bonusDice = +data?.bonusSiEmbuscade?.bonusInitiative?.dice || 0;
      const bonusFixe = +data?.bonusSiEmbuscade?.bonusInitiative?.fixe || 0;

      initiativeDiceBonus += bonusDice;
      initiativeBonus += bonusFixe;
    }

    if(hasEmbuscadePris) {
      initiativeBonus += 10;
    }

    if(aspectsMasque.ae.majeur.value > 0) {
      data.initiative.dice = 0;
      data.initiative.base = 0;
      data.initiative.value = 30;
    } else {
      data.initiative.dice = Math.max(initiativeDataDiceBase+initiativeDiceBonus-initiativeDiceMalus, 1);
      data.initiative.base = initiativeDataDiceBase;
      data.initiative.value = Math.max(0+initiativeBonus-initiativeMalus, 0);
    }

    data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;

    // REACTION
    const reactionDataBase = data.reaction?.base ?? 0;
    const reactionDataBonus = data.reaction?.bonus?.user ?? 0;
    const reactionDataMalus = data.reaction?.malus?.user ?? 0;

    if(!data.reaction.bonusValue) data.reaction.bonusValue = reactionDataBonus;
    else data.reaction.bonusValue += reactionDataBonus;

    if(!data.reaction.malusValue) data.reaction.malusValue = reactionDataMalus;
    else data.reaction.malusValue += reactionDataMalus;

    if(aspectsMachine.ae.mineur.value > 0 || aspectsMachine.ae.majeur.value > 0) {
      data.reaction.bonusValue += +aspectsMachine.ae.mineur.value + +aspectsMachine.ae.majeur.value;
    }

    data.reaction.value = Math.max(reactionDataBase+data.reaction.bonusValue-data.reaction.malusValue, 0);

    // DEFENSE
    const defenseDataBase = data.defense?.base ?? 0;
    const defenseDataBonus = data.defense.bonus?.user ?? 0;
    const defenseDataMalus = data.defense.malus?.user ?? 0;

    if(!data.defense.bonusValue) data.defense.bonusValue = defenseDataBonus;
    else data.defense.bonusValue += defenseDataBonus;

    if(!data.defense.malusValue) data.defense.malusValue = defenseDataMalus;
    else data.defense.malusValue += defenseDataMalus;

    if(aspectsMasque.ae.mineur.value > 0 || aspectsMasque.ae.majeur.value > 0) {
      data.defense.bonusValue += +aspectsMasque.ae.mineur.value + +aspectsMasque.ae.majeur.value;
    }

    data.defense.value = Math.max(defenseDataBase+data.defense.bonusValue-data.defense.malusValue, 0);

    // VERFICIATION MAX ASPECTS
    for (let [key, aspect] of Object.entries(data.aspects)) {
      const aeMaj = +aspect.ae.majeur.value;
      const aeMin = +aspect.ae.mineur.value;

      if(aspect.value > aspect.max) {
        aspect.value = aspect.max;
      }

      if(aeMaj > aspect.ae.majeur.max) {
        aspect.ae.majeur.value = aspect.ae.majeur.max;
      }

      if(aeMin > aspect.ae.mineur.max) {
        aspect.ae.mineur.value = aspect.ae.mineur.max;
      }
    }
  }

  _prepareBandeData(actorData) {
    if (actorData.type !== 'bande') return;

    // Make modifications to data here.
    const actor = actorData;
    const data = actor.system;
    const options = data.options;
    const aspectsMachine = data.aspects.machine;
    const aspectsMasque = data.aspects.masque;

    // SANTE - BOUCLIER
    const list = ['sante', 'bouclier'];
    const autorized = ['sante'];

    for(let i = 0;i < list.length;i++) {
      const label = list[i];

      if(options[label] || autorized.includes(label)) {
        const userBase = data[label]?.base ?? 0;
        const dataBonus = data[label]?.bonus?.user ?? 0;
        const dataMalus = data[label]?.malus?.user ?? 0;

        if(!data[label].bonusValue) data[label].bonusValue = dataBonus;
        else data[label].bonusValue += dataBonus;

        if(!data[label].malusValue) data[label].malusValue = dataMalus;
        else data[label].malusValue += dataMalus;

        data[label].max = Math.max(userBase+data[label].bonusValue-data[label].malusValue, 0);
      }
    }

    // INITIATIVE
    data.initiative.dice = 0;
    data.initiative.base = 0;
    data.initiative.value = 1;

    data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;

    // REACTION
    const reactionDataBase = data.reaction?.base ?? 0;
    const reactionDataBonus = data.reaction?.bonus?.user ?? 0;
    const reactionDataMalus = data.reaction?.malus?.user ?? 0;

    if(!data.reaction.bonusValue) data.reaction.bonusValue = reactionDataBonus;
    else data.reaction.bonusValue += reactionDataBonus;

    if(!data.reaction.malusValue) data.reaction.malusValue = reactionDataMalus;
    else data.reaction.malusValue += reactionDataMalus;

    if(aspectsMachine.ae.mineur.value > 0 || aspectsMachine.ae.majeur.value > 0) {
      data.reaction.bonusValue += +aspectsMachine.ae.mineur.value + +aspectsMachine.ae.majeur.value;
    }

    data.reaction.value = Math.max(reactionDataBase+data.reaction.bonusValue-data.reaction.malusValue, 0);

    // DEFENSE
    const defenseDataBase = data.defense?.base ?? 0;
    const defenseDataBonus = data.defense?.bonus?.user ?? 0;
    const defenseDataMalus = data.defense?.malus?.user ?? 0;

    if(!data.defense.bonusValue) data.defense.bonusValue = defenseDataBonus;
    else data.defense.bonusValue += defenseDataBonus;

    if(!data.defense.malusValue) data.defense.malusValue = defenseDataMalus;
    else data.defense.malusValue += defenseDataMalus;

    if(aspectsMasque.ae.mineur.value > 0 || aspectsMasque.ae.majeur.value > 0) {
      data.defense.bonusValue += +aspectsMasque.ae.mineur.value + +aspectsMasque.ae.majeur.value;
    }

    data.defense.value = Math.max(defenseDataBase+data.defense.bonusValue-data.defense.malusValue, 0);

    // VERFICIATION MAX ASPECTS
    for (let [key, aspect] of Object.entries(data.aspects)) {
      const aeMaj = +aspect.ae.majeur.value;
      const aeMin = +aspect.ae.mineur.value;

      if(aspect.value > aspect.max) {
        aspect.value = aspect.max;
      }

      if(aeMaj > aspect.ae.majeur.max) {
        aspect.ae.majeur.value = aspect.ae.majeur.max;
      }

      if(aeMin > aspect.ae.mineur.max) {
        aspect.ae.mineur.value = aspect.ae.mineur.max;
      }
    }
  }

  _prepareVehiculeData(actorData) {
    if (actorData.type !== 'vehicule') return;

    const actor = actorData;
    const data = actor.system;
    const pilote = data.equipage.pilote;
    const options = data.options;

    if(pilote.id !== '') {
      const id = pilote.id;
      const actor = game.actors.get(id);

      if(actor?.system !== undefined) {
        const defenseBonus = data.defense?.bonus.user || 0;
        const defenseMalus = data.defense?.malus.user || 0;
        const reactonBonus = data.reaction?.bonus.user || 0;
        const reactonMalus = data.reaction?.malus.user || 0;
        const manoeuvrabilite = data.manoeuvrabilite || 0;
        const initiative = actor.system.initiative;

        if(!data.defense.bonusValue) data.defense.bonusValue = defenseBonus;
        else data.defense.bonusValue += defenseBonus;

        if(!data.defense.malusValue) data.defense.malusValue = defenseMalus;
        else data.defense.malusValue += defenseMalus;

        if(!data.reaction.bonusValue) data.reaction.bonusValue = reactonBonus;
        else data.reaction.bonusValue += reactonBonus;

        if(!data.reaction.malusValue) data.reaction.malusValue = reactonMalus;
        else data.reaction.malusValue += reactonMalus;

        const reaction = actor.system.reaction.value+data.reaction.bonusValue+manoeuvrabilite-data.reaction.malusValue;
        const defense = actor.system.defense.value+data.defense.bonusValue-data.defense.malusValue;

        data.reaction.value = reaction;
        data.defense.value = defense;
        data.initiative.dice = initiative.dice;
        data.initiative.value = initiative.value;

        data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;
      }
    }

    const list = ['armure', 'energie', 'champDeForce'];

    for(let i = 0;i < list.length;i++) {
      const label = list[i];

      const userBase = data[label]?.base ?? 0;
      const dataBonus = data[label]?.bonus?.user ?? 0;
      const dataMalus = data[label]?.malus?.user ?? 0;

      if(!data[label].bonusValue) data[label].bonusValue = dataBonus;
      else data[label].bonusValue += dataBonus;

      if(!data[label].malusValue) data[label].malusValue = dataMalus;
      else data[label].malusValue += dataMalus;

      data[label].max = Math.max(userBase+data[label].bonusValue-data[label].malusValue, 0);
    }
  }

  _prepareMechaArmureData(actorData) {
    if (actorData.type !== 'mechaarmure') return;

    const actor = actorData;
    const data = actor.system;

    const listData = ['resilience', 'vitesse', 'manoeuvrabilite', 'puissance', 'systemes', 'senseurs', 'champDeForce'];

    for(let i = 0;i < listData.length;i++) {
      const dataBase = data[listData[i]]?.base ?? 0;
      const dataBonus = data[listData[i]]?.bonus?.user ?? 0;
      const dataMalus = data[listData[i]]?.malus?.user ?? 0;

      let bonus = 0;
      let malus = 0;

      bonus += dataBonus;
      malus += dataMalus;

      if(!data[listData[i]].mod) data[listData[i]].mod = bonus-malus;
      else data[listData[i]].mod += bonus-malus;

      if(listData[i] === 'resilience') data[listData[i]].max = Math.max(dataBase+data[listData[i]].mod, 0);
      else data[listData[i]].value = Math.max(dataBase+data[listData[i]].mod, 0);
    }

    data.initiative.complet = `${data.initiative.dice}D6+${data.initiative.value}`;
  }
}