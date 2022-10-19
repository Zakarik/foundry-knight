/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class KnightActor extends Actor {

  /**
     * Create a new entity using provided input data
     * @override
     */
  static async create(data, options = {}) {
    // Replace default image
    if (data.img === undefined) {
      switch(data.type) {
        case "knight":
          data.img = "systems/knight/assets/icons/knight.svg";
          break;

        case "pnj":
          data.img = "icons/svg/mystery-man-black.svg";
          break;

        case "creature":
          data.img = "systems/knight/assets/icons/creature.svg";
          break;

        case "bande":
          data.img = "systems/knight/assets/icons/bande.svg";
          break;

        case "vehicule":
          data.img = "systems/knight/assets/icons/vehicule.svg";
          break;

        case "mechaarmure":
          data.img = "systems/knight/assets/icons/mechaarmure.svg";
          break;
      }
    }
    await super.create(data, options);
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

  _prepareKnightData(actorData) {
    if (actorData.type !== 'knight') return;
  
    // Make modifications to data here.
    const data = actorData.system;
    const isKraken = data.options.kraken;
    const armorWear = this.items.get(data.equipements.armure?.id)?.system || false;
    const armorLegendeWear = this.items.get(data.equipements.armure?.idLegende)?.system || false;

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
      let base = aspect?.base || 0;
      let bonus = aspect?.bonus || 0;
      let malus = aspect?.malus || 0;

      aspect.value = Math.max(base+bonus-malus, 0);

      // CARACTERISTIQUES
      for (let [keyCar, carac] of Object.entries(aspect.caracteristiques)){
        let baseCarac = carac?.base || 0;
        let bonusCarac = carac?.bonus || 0;
        let malusCarac = carac?.malus || 0;
        let total = 0;

        carac.max = aspect.value;

        total = baseCarac+bonusCarac-malusCarac;

        if(total > aspect.value) { total = aspect.value; }

        carac.value = Math.max(total, 0);

        // OD
        const overdrive = carac.overdrive;
        const baseOD = overdrive?.base || 0;
        const bonusOD = overdrive?.bonus || 0;
        const malusOD = overdrive?.malus || 0;

        carac.overdrive.value = Math.max(baseOD+bonusOD-malusOD, 0);
      }
    }

    const chairMax = Math.max(data.aspects.chair.caracteristiques.deplacement.value, data.aspects.chair.caracteristiques.force.value, data.aspects.chair.caracteristiques.endurance.value);
    const beteMax = Math.max(data.aspects.bete.caracteristiques.hargne.value, data.aspects.bete.caracteristiques.combat.value, data.aspects.bete.caracteristiques.instinct.value);
    const machineMax = Math.max(data.aspects.machine.caracteristiques.tir.value, data.aspects.machine.caracteristiques.savoir.value, data.aspects.machine.caracteristiques.technique.value);
    const dameMax = Math.max(data.aspects.dame.caracteristiques.aura.value, data.aspects.dame.caracteristiques.parole.value, data.aspects.dame.caracteristiques.sangFroid.value);
    const masqueMax = Math.max(data.aspects.masque.caracteristiques.discretion.value, data.aspects.masque.caracteristiques.dexterite.value, data.aspects.masque.caracteristiques.perception.value);

    // SANTE
    if(dataJauges.sante) {
      
      const valueBase = isKraken ? 8 : 6;
      const userSBase = (chairMax*valueBase)+10;
      const santeDataBonus = data.sante.bonus;
      const santeDataMalus = data.sante.malus;

      let santeBonus = 0;
      let santeMalus = 0;

      for(const bonusList in santeDataBonus) {
        santeBonus += santeDataBonus[bonusList];
      }

      for(const malusList in santeDataMalus) {
        santeMalus += santeDataMalus[malusList];
      }

      if(dataWear === "armure" || dataWear === "ascension") {
        const ODEndurance =  aspects?.chair?.caracteristiques?.endurance?.overdrive?.value || 0;

        if(ODEndurance >= 3) santeBonus += 6;
      }

      data.sante.base = userSBase;
      data.sante.bonusValue = santeBonus;
      data.sante.malusValue = santeMalus;
      data.sante.max = Math.max(userSBase+santeBonus-santeMalus, 0);
    }    

    // ARMURE
    if(dataJauges.armure) {
      const userABase = equipement.armure.base;
      const armureDataBonus = equipement.armure.bonus;
      const armureDataMalus = equipement.armure.malus;

      let armureBonus = 0;
      let armureMalus = 0;

      for(const bonusList in armureDataBonus) {
        armureBonus += armureDataBonus[bonusList];
      }
  
      for(const malusList in armureDataMalus) {
        armureMalus += armureDataMalus[malusList];
      }

      if(dataWear === "armure" || dataWear === "ascension") {
        const armureUserBonus = data.equipements[dataWear].armure.bonus;
        const armureUserMalus = data.equipements[dataWear].armure.malus;

        for(const bonusList in armureUserBonus) {
          armureBonus += armureUserBonus[bonusList];
        }
    
        for(const malusList in armureUserMalus) {
          armureMalus += armureUserMalus[malusList];
        }
      }

      equipement.armure.mod = armureBonus-armureMalus;
      equipement.armure.max = Math.max(userABase+equipement.armure.mod, 0);

      data.armure.base = equipement.armure.base;
      data.armure.bonus = armureBonus;
      data.armure.malus = armureMalus;
      data.armure.max = equipement.armure.max;
    }

    if(dataJauges.energie) {
      const userEBase = equipement.energie.base;
      const energieDataBonus = equipement.energie.bonus;
      const energieDataMalus = equipement.energie.malus;

      let energieBonus = 0;
      let energieMalus = 0;

      for(const bonusList in energieDataBonus) {
        energieBonus += energieDataBonus[bonusList];
      }
  
      for(const malusList in energieDataMalus) {
        energieMalus += energieDataMalus[malusList];
      }

      if(dataWear === "armure" || dataWear === "ascension") {
        const energieUserBonus = data.equipements[dataWear].energie.bonus;
        const energieUserMalus = data.equipements[dataWear].energie.malus;

        for(const bonusList in energieUserBonus) {
          energieBonus += energieUserBonus[bonusList];
        }
    
        for(const malusList in energieUserMalus) {
          energieMalus += energieUserMalus[malusList];
        }
      }

      equipement.energie.mod = energieBonus-energieMalus;
      equipement.energie.max = Math.max(userEBase+equipement.energie.mod, 0);
      equipement.energie.value = data.energie.value;

      data.energie.base = equipement.energie.base;
      data.energie.bonus = energieBonus;
      data.energie.malus = energieMalus;
      data.energie.max = equipement.energie.max;
    }

    if(dataJauges.champDeForce) {
      const userCDFBase = equipement.champDeForce.base;
      const CDFDataBonus = equipement.champDeForce.bonus;
      const CDFDataMalus = equipement.champDeForce.malus;

      let CDFBonus = 0;
      let CDFMalus = 0;

      for(const bonusList in CDFDataBonus) {
        CDFBonus += CDFDataBonus[bonusList];
      }
  
      for(const malusList in CDFDataMalus) {
        CDFMalus += CDFDataMalus[malusList];
      }

      if(dataWear === "armure" || dataWear === "ascension") {
        const CDFUserBonus = data.equipements[dataWear].champDeForce.bonus;
        const CDFUserMalus = data.equipements[dataWear].champDeForce.malus;

        for(const bonusList in CDFUserBonus) {
          CDFBonus += CDFUserBonus[bonusList];
        }
    
        for(const malusList in CDFUserMalus) {
          CDFMalus += CDFUserMalus[malusList];
        }
      }

      equipement.champDeForce.mod = CDFBonus-CDFMalus;
      equipement.champDeForce.value = Math.max(userCDFBase+equipement.champDeForce.mod, 0);

      data.champDeForce.base = equipement.champDeForce.base;
      data.champDeForce.bonus = CDFBonus;
      data.champDeForce.malus = CDFMalus;
      data.champDeForce.value = equipement.champDeForce.value;
    }

    // ESPOIR
    if(dataJauges.espoir) {
      const hasPlusEspoir = armorWear !== false && armorWear?.special?.selected?.plusespoir != undefined ? armorWear?.special?.selected?.plusespoir.espoir.base : 50;
      const userEBase = hasPlusEspoir;
      const espoirDataBonus = data.espoir.bonus;
      const espoirDataMalus = data.espoir.malus;

      let espoirBonus = 0;
      let espoirMalus = 0;

      for(const bonusList in espoirDataBonus) {
        espoirBonus += espoirDataBonus[bonusList];
      }

      for(const malusList in espoirDataMalus) {
        espoirMalus += espoirDataMalus[malusList];
      }

      data.espoir.bonusValue = espoirBonus;
      data.espoir.malusValue = espoirMalus;

      data.espoir.max = Math.max(userEBase+espoirBonus-espoirMalus, 0);
    }

    //EGIDE
    const hasEgide = game.settings.get("knight", "acces-egide");

    if(hasEgide) {
      const userSBase = data.egide.base;
      const egideDataBonus = data.egide.bonus;
      const egideDataMalus = data.egide.malus;

      let egideBonus = 0;
      let egideMalus = 0;

      for(const bonusList in egideDataBonus) {
        egideBonus += egideDataBonus[bonusList];
      }

      for(const malusList in egideDataMalus) {
        egideMalus += egideDataMalus[malusList];
      }

      data.egide.bonusValue = egideBonus;
      data.egide.malusValue = egideMalus;
      data.egide.value = Math.max(userSBase+egideBonus-egideMalus, 0);
    }

    // INITIATIVE
    const hasEmbuscadeSubis = data.options?.embuscadeSubis || false;
    const hasEmbuscadePris = data.options?.embuscadePris || false;
    const userIBase = masqueMax;
    const initiativeDataDiceBase = data.initiative.diceBase;
    const initiativeDataDiceBonus = data.initiative.diceBonus;
    const initiativeDataDiceMalus = data.initiative.diceMalus;
    const initiativeDataBonus = data.initiative.bonus;
    const initiativeDataMalus = data.initiative.malus;

    let initiativeDiceBonus = 0;
    let initiativeDiceMalus = 0;
    let initiativeBonus = 0;
    let initiativeMalus = 0;

    for(const bonusList in initiativeDataBonus) {
      initiativeBonus += initiativeDataBonus[bonusList];
    }

    for(const bonusList in initiativeDataDiceBonus) {
      initiativeDiceBonus += initiativeDataDiceBonus[bonusList];
    }

    for(const malusList in initiativeDataMalus) {
      initiativeMalus += initiativeDataMalus[malusList];
    }

    for(const bonusList in initiativeDataDiceMalus) {
      initiativeDiceMalus += initiativeDataDiceMalus[bonusList];
    }

    if(dataWear === "armure" || dataWear === "ascension") {
      const ODInstinct =  aspects?.bete?.caracteristiques?.instinct?.overdrive?.value || 0;

      if(ODInstinct >= 3) initiativeBonus += ODInstinct*3;
    }

    if(hasEmbuscadeSubis) {
      const bonusDice = +data?.bonusSiEmbuscade?.bonusInitiative?.dice || 0;
      const bonusFixe = +data?.bonusSiEmbuscade?.bonusInitiative?.fixe || 0;

      initiativeDiceBonus += bonusDice;
      initiativeBonus += bonusFixe;
    }

    if(hasEmbuscadePris) {
      initiativeBonus += 10;
    }

    data.initiative.dice = Math.max(initiativeDataDiceBase+initiativeDiceBonus-initiativeDiceMalus, 1);
    data.initiative.base = userIBase;
    data.initiative.value = Math.max(userIBase+initiativeBonus-initiativeMalus, 0);

    // REACTION
    const userRBase = machineMax;
    const reactionDataBonus = data.reaction.bonus;
    const reactionDataMalus = data.reaction.malus;

    let reactionBonus = isKraken ? 1 : 0;
    let reactionMalus = 0;

    for(const bonusList in reactionDataBonus) {
      reactionBonus += reactionDataBonus[bonusList];
    }

    for(const malusList in reactionDataMalus) {
      reactionMalus += reactionDataMalus[malusList];
    }

    data.reaction.bonusValue = reactionBonus;
    data.reaction.malusValue = reactionMalus;

    data.reaction.base = userRBase;
    data.reaction.value = Math.max(userRBase+reactionBonus-reactionMalus, 0);

    // DEFENSE
    const userDBase = beteMax;
    const defenseDataBonus = data.defense.bonus;
    const defenseDataMalus = data.defense.malus;

    let defenseBonus = isKraken ? 1 : 0;
    let defenseMalus = 0;

    for(const bonusList in defenseDataBonus) {
      defenseBonus += defenseDataBonus[bonusList];
    }

    for(const malusList in defenseDataMalus) {
      defenseMalus += defenseDataMalus[malusList];
    }

    if(dataWear === "armure" || dataWear === "ascension") {
      const ODAura =  aspects?.dame?.caracteristiques?.aura?.overdrive?.value || 0;

      if(ODAura >= 5) defenseBonus += aspects.dame.caracteristiques.aura.value;
    }

    data.defense.bonusValue = defenseBonus;
    data.defense.malusValue = defenseMalus;

    data.defense.base = userDBase;
    data.defense.value = Math.max(userDBase+defenseBonus-defenseMalus, 0);

    // LANGUES
    const userLBase = Math.max(data.aspects.machine.caracteristiques.savoir.value-2, 1);
    const userLBonus = data.langues.mod;

    data.langues.value = userLBase+userLBonus;

    // CONTACTS
    const userCBase = dameMax;
    const userCBonus = data.contacts.mod;

    data.contacts.value = userCBase+userCBonus;

    // STYLES
    data.combat.styleInfo = game.i18n.localize(CONFIG.KNIGHT.styles[data.combat.style]);

    // PG
    const dataProgression = data.progression;

    const dataPG = dataProgression.gloire;
    const PGActuel = dataPG.actuel;
    const PGDepenseListe = dataPG.depense.liste;

    let PGTotalDepense = 0;

    for(let i = 0;i < PGDepenseListe.length;i++) {
      if(!PGDepenseListe[i].isArmure) PGTotalDepense += PGDepenseListe[i].value;
    }

    data.progression.gloire.depense.total = PGTotalDepense;
    data.progression.gloire.total = PGTotalDepense+PGActuel;

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

    data.progression.experience.depense.total = PXTotalDepense;
    data.progression.experience.total = PXTotalDepense+PXActuel;
  }

  _preparePNJData(actorData) {
    if (actorData.type !== 'pnj') return;

    // Make modifications to data here.
    const actor = actorData;
    const data = actor.system;
    const options = data.options;
    const aspectsMachine = data.aspects.machine;
    const aspectsMasque = data.aspects.masque;

    // SANTE
    if(options.sante) {
      const userSBase = data.sante.base;
      const santeDataBonus = data.sante.bonus;
      const santeDataMalus = data.sante.malus;

      let santeBonus = 0;
      let santeMalus = 0;

      for(const bonusList in santeDataBonus) {
        santeBonus += santeDataBonus[bonusList];
      }

      for(const malusList in santeDataMalus) {
        santeMalus += santeDataMalus[malusList];
      }

      data.sante.mod = santeBonus-santeMalus;
      data.sante.max = Math.max(userSBase+santeBonus-santeMalus, 0);
    }

    // ARMURE
    if(options.armure) {
      const userABase = data.armure.base;
      const armureDataBonus = data.armure.bonus;
      const armureDataMalus = data.armure.malus;

      let armureBonus = 0;
      let armureMalus = 0;

      for(const bonusList in armureDataBonus) {
        armureBonus += armureDataBonus[bonusList];
      }

      for(const malusList in armureDataMalus) {
        armureMalus += armureDataMalus[malusList];
      }

      data.armure.mod = armureBonus-armureMalus;
      data.armure.max = Math.max(userABase+data.armure.mod, 0);
    }    

    // ENERGIE
    if(options.energie) {
      const userEBase = data.energie.base;
      const energieDataBonus = data.energie.bonus;
      const energieDataMalus = data.energie.malus;

      let energieBonus = 0;
      let energieMalus = 0;

      for(const bonusList in energieDataBonus) {
        energieBonus += energieDataBonus[bonusList];
      }
  
      for(const malusList in energieDataMalus) {
        energieMalus += energieDataMalus[malusList];
      }

      data.energie.mod = energieBonus-energieMalus;
      data.energie.max = Math.max(userEBase+data.energie.mod, 0);
    }

    // CHAMP DE FORCE
    if(options.champDeForce) {
      const userCDFBase = data.champDeForce.base;
      const CDFDataBonus = data.champDeForce.bonus;
      const CDFDataMalus = data.champDeForce.malus;

      let CDFBonus = 0;
      let CDFMalus = 0;

      for(const bonusList in CDFDataBonus) {
        CDFBonus += CDFDataBonus[bonusList];
      }
  
      for(const malusList in CDFDataMalus) {
        CDFMalus += CDFDataMalus[malusList];
      }

      data.champDeForce.mod = CDFBonus-CDFMalus;
      data.champDeForce.value = Math.max(userCDFBase+data.champDeForce.mod, 0);
    }

    // Bouclier
    if(options.bouclier) {
      const userBouclierBase = data.bouclier.base;
      const BouclierDataBonus = data.bouclier.bonus;
      const BouclierDataMalus = data.bouclier.malus;

      let BouclierBonus = 0;
      let BouclierMalus = 0;

      for(const bonusList in BouclierDataBonus) {
        BouclierBonus += BouclierDataBonus[bonusList];
      }
  
      for(const malusList in BouclierDataBonus) {
        BouclierMalus += BouclierDataMalus[malusList];
      }

      data.bouclier.mod = BouclierBonus-BouclierMalus;
      data.bouclier.value = Math.max(userBouclierBase+data.bouclier.mod, 0);
    }

    // INITIATIVE
    const initiativeDataDiceBase = data.initiative.diceBase;
    const initiativeDataDiceBonus = data.initiative.diceBonus;
    const initiativeDataDiceMalus = data.initiative.diceMalus;
    const initiativeDataBonus = data.initiative.bonus;
    const initiativeDataMalus = data.initiative.malus;

    let initiativeDiceBonus = 0;
    let initiativeDiceMalus = 0;
    let initiativeBonus = 0;
    let initiativeMalus = 0;

    for(const bonusList in initiativeDataBonus) {
      initiativeBonus += initiativeDataBonus[bonusList];
    }

    for(const bonusList in initiativeDataDiceBonus) {
      initiativeDiceBonus += initiativeDataDiceBonus[bonusList];
    }

    for(const malusList in initiativeDataMalus) {
      initiativeMalus += initiativeDataMalus[malusList];
    }

    for(const bonusList in initiativeDataDiceMalus) {
      initiativeDiceMalus += initiativeDataDiceMalus[bonusList];
    }

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

    // REACTION
    const reactionDataBase = data.reaction.base;
    const reactionDataBonus = data.reaction.bonus;
    const reactionDataMalus = data.reaction.malus;

    let reactionBonus = 0;
    let reactionMalus = 0;

    for(const bonusList in reactionDataBonus) {
      reactionBonus += reactionDataBonus[bonusList];
    }

    for(const malusList in reactionDataMalus) {
      reactionMalus += reactionDataMalus[malusList];
    }

    if(aspectsMachine.ae.mineur.value > 0 || aspectsMachine.ae.majeur.value > 0) {
      reactionBonus += +aspectsMachine.ae.mineur.value + +aspectsMachine.ae.majeur.value;
    }

    data.reaction.bonusValue = reactionBonus;
    data.reaction.malusValue = reactionMalus;

    data.reaction.value = Math.max(reactionDataBase+reactionBonus-reactionMalus, 0);

    // DEFENSE
    const defenseDataBase = data.defense.base;
    const defenseDataBonus = data.defense.bonus;
    const defenseDataMalus = data.defense.malus;

    let defenseBonus = 0;
    let defenseMalus = 0;

    for(const bonusList in defenseDataBonus) {
      defenseBonus += defenseDataBonus[bonusList];
    }

    for(const malusList in defenseDataMalus) {
      defenseMalus += defenseDataMalus[malusList];
    }

    if(aspectsMasque.ae.mineur.value > 0 || aspectsMasque.ae.majeur.value > 0) {
      defenseBonus += +aspectsMasque.ae.mineur.value + +aspectsMasque.ae.majeur.value;
    }

    data.defense.bonusValue = defenseBonus;
    data.defense.malusValue = defenseMalus;

    data.defense.base = defenseDataBase;
    data.defense.value = Math.max(defenseDataBase+defenseBonus-defenseMalus, 0);

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

    // SANTE
    if(options.sante) {
      const userSBase = data.sante.base;
      const santeDataBonus = data.sante.bonus;
      const santeDataMalus = data.sante.malus;

      let santeBonus = 0;
      let santeMalus = 0;

      for(const bonusList in santeDataBonus) {
        santeBonus += santeDataBonus[bonusList];
      }

      for(const malusList in santeDataMalus) {
        santeMalus += santeDataMalus[malusList];
      }

      data.sante.mod = santeBonus-santeMalus;
      data.sante.max = Math.max(userSBase+santeBonus-santeMalus, 0);
    }

    // ARMURE
    if(options.armure) {
      const userABase = data.armure.base;
      const armureDataBonus = data.armure.bonus;
      const armureDataMalus = data.armure.malus;

      let armureBonus = 0;
      let armureMalus = 0;

      for(const bonusList in armureDataBonus) {
        armureBonus += armureDataBonus[bonusList];
      }

      for(const malusList in armureDataMalus) {
        armureMalus += armureDataMalus[malusList];
      }

      data.armure.mod = armureBonus-armureMalus;
      data.armure.max = Math.max(userABase+data.armure.mod, 0);
    }    

    // ENERGIE
    if(options.energie) {
      const userEBase = data.energie.base;
      const energieDataBonus = data.energie.bonus;
      const energieDataMalus = data.energie.malus;

      let energieBonus = 0;
      let energieMalus = 0;

      for(const bonusList in energieDataBonus) {
        energieBonus += energieDataBonus[bonusList];
      }
  
      for(const malusList in energieDataMalus) {
        energieMalus += energieDataMalus[malusList];
      }

      data.energie.mod = energieBonus-energieMalus;
      data.energie.max = Math.max(userEBase+data.energie.mod, 0);
    }

    // BOUCLIER
    if(options.bouclier) {
      const userBouclierBase = data.bouclier.base;
      const BouclierDataBonus = data.bouclier.bonus;
      const BouclierDataMalus = data.bouclier.malus;

      let BouclierBonus = 0;
      let BouclierMalus = 0;

      for(const bonusList in BouclierDataBonus) {
        BouclierBonus += BouclierDataBonus[bonusList];
      }
  
      for(const malusList in BouclierDataBonus) {
        BouclierMalus += BouclierDataMalus[malusList];
      }

      data.bouclier.mod = BouclierBonus-BouclierMalus;
      data.bouclier.value = Math.max(userBouclierBase+data.bouclier.mod, 0);
    }

    // INITIATIVE
    const initiativeDataDiceBase = data.initiative.diceBase;
    const initiativeDataDiceBonus = data.initiative.diceBonus;
    const initiativeDataDiceMalus = data.initiative.diceMalus;
    const initiativeDataBonus = data.initiative.bonus;
    const initiativeDataMalus = data.initiative.malus;

    let initiativeDiceBonus = 0;
    let initiativeDiceMalus = 0;
    let initiativeBonus = 0;
    let initiativeMalus = 0;

    for(const bonusList in initiativeDataBonus) {
      initiativeBonus += initiativeDataBonus[bonusList];
    }

    for(const bonusList in initiativeDataDiceBonus) {
      initiativeDiceBonus += initiativeDataDiceBonus[bonusList];
    }

    for(const malusList in initiativeDataMalus) {
      initiativeMalus += initiativeDataMalus[malusList];
    }

    for(const bonusList in initiativeDataDiceMalus) {
      initiativeDiceMalus += initiativeDataDiceMalus[bonusList];
    }

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

    // REACTION
    const reactionDataBase = data.reaction.base;
    const reactionDataBonus = data.reaction.bonus;
    const reactionDataMalus = data.reaction.malus;

    let reactionBonus = 0;
    let reactionMalus = 0;

    for(const bonusList in reactionDataBonus) {
      reactionBonus += reactionDataBonus[bonusList];
    }

    for(const malusList in reactionDataMalus) {
      reactionMalus += reactionDataMalus[malusList];
    }

    if(aspectsMachine.ae.mineur.value > 0 || aspectsMachine.ae.majeur.value > 0) {
      reactionBonus += +aspectsMachine.ae.mineur.value + +aspectsMachine.ae.majeur.value;
    }

    data.reaction.bonusValue = reactionBonus;
    data.reaction.malusValue = reactionMalus;

    data.reaction.value = Math.max(reactionDataBase+reactionBonus-reactionMalus, 0);

    // DEFENSE
    const defenseDataBase = data.defense.base;
    const defenseDataBonus = data.defense.bonus;
    const defenseDataMalus = data.defense.malus;

    let defenseBonus = 0;
    let defenseMalus = 0;

    for(const bonusList in defenseDataBonus) {
      defenseBonus += defenseDataBonus[bonusList];
    }

    for(const malusList in defenseDataMalus) {
      defenseMalus += defenseDataMalus[malusList];
    }

    if(aspectsMasque.ae.mineur.value > 0 || aspectsMasque.ae.majeur.value > 0) {
      defenseBonus += +aspectsMasque.ae.mineur.value + +aspectsMasque.ae.majeur.value;
    }

    data.defense.bonusValue = defenseBonus;
    data.defense.malusValue = defenseMalus;

    data.defense.base = defenseDataBase;
    data.defense.value = Math.max(defenseDataBase+defenseBonus-defenseMalus, 0);

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

    // SANTE
    const userSBase = data.sante.base;
    const santeDataBonus = data.sante.bonus;
    const santeDataMalus = data.sante.malus;

    let santeBonus = 0;
    let santeMalus = 0;

    for(const bonusList in santeDataBonus) {
      santeBonus += santeDataBonus[bonusList];
    }

    for(const malusList in santeDataMalus) {
      santeMalus += santeDataMalus[malusList];
    }

    data.sante.mod = santeBonus-santeMalus;
    data.sante.max = Math.max(userSBase+santeBonus-santeMalus, 0);

    // BOUCLIER
    if(options.bouclier) {
      const userBouclierBase = data.bouclier.base;
      const BouclierDataBonus = data.bouclier.bonus;
      const BouclierDataMalus = data.bouclier.malus;

      let BouclierBonus = 0;
      let BouclierMalus = 0;

      for(const bonusList in BouclierDataBonus) {
        BouclierBonus += BouclierDataBonus[bonusList];
      }
  
      for(const malusList in BouclierDataBonus) {
        BouclierMalus += BouclierDataMalus[malusList];
      }

      data.bouclier.mod = BouclierBonus-BouclierMalus;
      data.bouclier.value = Math.max(userBouclierBase+data.bouclier.mod, 0);
    }

    // INITIATIVE
    data.initiative.dice = 0;
    data.initiative.base = 0;
    data.initiative.value = 1;

    // REACTION
    const reactionDataBase = data.reaction.base;
    const reactionDataBonus = data.reaction.bonus;
    const reactionDataMalus = data.reaction.malus;

    let reactionBonus = 0;
    let reactionMalus = 0;

    for(const bonusList in reactionDataBonus) {
      reactionBonus += reactionDataBonus[bonusList];
    }

    for(const malusList in reactionDataMalus) {
      reactionMalus += reactionDataMalus[malusList];
    }

    if(aspectsMachine.ae.mineur.value > 0 || aspectsMachine.ae.majeur.value > 0) {
      reactionBonus += +aspectsMachine.ae.mineur.value + +aspectsMachine.ae.majeur.value;
    }

    data.reaction.bonusValue = reactionBonus;
    data.reaction.malusValue = reactionMalus;

    data.reaction.value = Math.max(reactionDataBase+reactionBonus-reactionMalus, 0);

    // DEFENSE
    const defenseDataBase = data.defense.base;
    const defenseDataBonus = data.defense.bonus;
    const defenseDataMalus = data.defense.malus;

    let defenseBonus = 0;
    let defenseMalus = 0;

    for(const bonusList in defenseDataBonus) {
      defenseBonus += defenseDataBonus[bonusList];
    }

    for(const malusList in defenseDataMalus) {
      defenseMalus += defenseDataMalus[malusList];
    }

    if(aspectsMasque.ae.mineur.value > 0 || aspectsMasque.ae.majeur.value > 0) {
      defenseBonus += +aspectsMasque.ae.mineur.value + +aspectsMasque.ae.majeur.value;
    }

    data.defense.bonusValue = defenseBonus;
    data.defense.malusValue = defenseMalus;

    data.defense.base = defenseDataBase;
    data.defense.value = Math.max(defenseDataBase+defenseBonus-defenseMalus, 0);

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

    if(pilote.id !== '') {
      const id = pilote.id;
      const actor = game.actors.get(id);

      const reaction = actor.system.reaction.value+data.reaction.bonus+data.manoeuvrabilite;
      const defense = actor.system.defense.value+data.defense.bonus;
      const initiative = actor.system.initiative;
      
      data.reaction.value = reaction;
      data.defense.value = defense;
      data.initiative.dice = initiative.dice;
      data.initiative.value = initiative.value;
    }
  }

  _prepareMechaArmureData(actorData) {
    if (actorData.type !== 'mechaarmure') return;

    const actor = actorData;
    const data = actor.system;

    const listData = ['resilience', 'vitesse', 'manoeuvrabilite', 'puissance', 'systemes', 'senseurs', 'champDeForce'];

    for(let i = 0;i < listData.length;i++) {
      const dataBase = data[listData[i]]?.base || 0;
      const dataBonus = data[listData[i]]?.bonus || {};
      const dataMalus = data[listData[i]]?.malus || {};

      let bonus = 0;
      let malus = 0;

      for(const bonusList in dataBonus) {
        bonus += dataBonus[bonusList];
      }

      for(const malusList in dataMalus) {
        malus += dataMalus[malusList];
      }

      data[listData[i]].mod = bonus-malus;

      if(listData[i] === 'resilience') data[listData[i]].max = Math.max(dataBase+bonus-malus, 0);
      else data[listData[i]].value = Math.max(dataBase+bonus-malus, 0);
    }
  }
}