import {
  SortByName,
  searchTrueValue,
  getAspectValue,
  getAEValue,
  getCaracValue,
  getODValue,
  getCaracPiloteValue,
  getODPiloteValue,
  getEffets,
  getDistance,
  getStructurelle,
  getOrnementale,
  getCapacite,
  getModuleBonus,
  getModStyle,
  getArmor,
  getSpecial,
  caracToAspect,
  actorIsPj,
  actorIsMa,
} from "../helpers/common.mjs";

import {
  doAttack,
  doDgts,
  doViolence,
} from "../helpers/dialogRoll.mjs";

/**
 * Edit dialog
 * @extends {Dialog}
 */
export class KnightRollDialog extends Application {
  constructor(data, options) {
      super(options);
      this.data = data;
  }

  static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        template: "systems/knight/templates/dialog/roll-sheet.html",
      classes: ["dialog", "knight", "rollDialog"],
      width: 800,
      height:800,
      jQuery: true,
      resizable: true,
    });
  }

  /** @inheritdoc */
  getData(options) {
    this.options.title = this.data.title;
    let buttons = Object.keys(this.data.buttons).reduce((obj, key) => {
      let b = this.data.buttons[key];
      b.cssClass = [key, this.data.default === key ? "default" : ""].filterJoin(" ");
      if ( b.condition !== false ) obj[key] = b;
      return obj;
    }, {});

    const {
      actor = {},
      isToken = false,
      label = '',
      aspects = {},
      base = '',
      lock = [],
      interdits = [],
      autre = [],
      difficulte = false,
      modificateur = 0,
      succesBonus = 0,
      degatsBonus = { dice: 0, fixe: 0 },
      violenceBonus = { dice: 0, fixe: 0 },
      moduleErsatz = false,
      listWpnContact = [],
      listWpnDistance = [],
      listWpnTourelle = [],
      listGrenades = [],
      listWpnImprovisees = [],
      listWpnMA = [],
      listWpnSpecial = [],
      longbow = {},
      isWpn = false,
      idWpn = '',
      nameWpn = '',
      typeWpn = '',
      chambredouble = false,
      chromeligneslumineuses = false,
      cadence = false,
      barrage = false,
      systemerefroidissement = false,
      guidage = false,
      tenebricide = false,
      obliteration = false,
      cranerieur = false,
      tirenrafale = false,
      briserlaresilience = false,
      jumeleambidextrie = false,
      soeur = false,
      jumelageambidextrie = false,
      style = '',
      num = 0,
      pnj = false,
      ma = false,
      hasWraith = false,
      moduleWraith = false,
      ameliorations = {},
      deploy = {},
      noOd = false,
      avDv = false,
      bonusTemp = { has: false, modificateur: 0, succesbonus: 0 },
      vehicule = {},
      attackSurprise = false,
    } = this.data;

    const hasLongbow = longbow?.has || false;

    if(hasLongbow) {
      const degats = +longbow.degats.cout;
      const violence = +longbow.violence.cout;
      const portee = +longbow.portee.cout;
      const coutsL1 = +longbow.effets.liste1.cout;
      const coutsL2 = +longbow.effets.liste2.cout;
      const coutsL3 = +longbow.effets.liste3.cout;

      this.data.longbow.energie = degats+violence+portee+coutsL1+coutsL2+coutsL3;
    }

    return {
      actor,
      isToken,
      label,
      aspects,
      base,
      lock,
      interdits,
      autre,
      difficulte,
      modificateur,
      succesBonus,
      degatsBonus: degatsBonus,
      violenceBonus: violenceBonus,
      moduleErsatz,
      listWpnContact,
      listWpnDistance,
      listWpnTourelle,
      listGrenades,
      listWpnImprovisees,
      listWpnMA,
      listWpnSpecial,
      longbow,
      isWpn,
      idWpn,
      nameWpn,
      typeWpn,
      chambredouble,
      chromeligneslumineuses,
      cadence,
      barrage,
      systemerefroidissement,
      guidage,
      tenebricide,
      obliteration,
      cranerieur,
      tirenrafale,
      briserlaresilience,
      jumeleambidextrie,
      soeur,
      jumelageambidextrie,
      style,
      num,
      pnj,
      ma,
      hasWraith,
      moduleWraith,
      ameliorations,
      deploy: {
        wpnContact: deploy?.wpnContact || false,
        wpnDistance: deploy?.wpnDistance || false,
        wpnTourelle: deploy?.wpnTourelle || false,
        wpnArmesImproviseesContact: deploy?.wpnArmesImproviseesContact || false,
        wpnArmesImproviseesDistance: deploy?.wpnArmesImproviseesDistance || false,
        grenades: deploy?.grenades || false,
        longbow: deploy?.longbow || false,
        wpnMA: deploy?.wpnMA || false,
        wpnArmesImprovisees: deploy?.wpnArmesImprovisees || false,
      },
      noOd,
      avDv,
      bonusTemp: {
        has: bonusTemp?.has || false,
        modificateur: bonusTemp?.modificateur || 0,
        succesbonus: bonusTemp?.succesbonus || 0
      },
      vehicule,
      attackSurprise,
      buttons
    };
  }

  async setActor(actor, isToken) {
    this.data.actor = actor;
    this.data.isToken = isToken;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.actor,
          this.data.isToken,
        );
      }, 0);
    });
  }

  //ON MODIFIE LE LABEL
  setLabel(label) {
    this.data.label = label;

    return {
      label:this.data.label,
    };
  }

  //ON GERE L'ACTEUR
  setAct(act) {
    const isPJ = actorIsPj(act);
    const isMA = actorIsMa(act);
    const extractWpn = this.extractWpn(act);
    const data = act.system;
    const rawStyle = data?.combat?.style ?? '';
    const getStyle = getModStyle(rawStyle);
    const lAspectsInterdits = data?.combos?.interdits?.aspects ?? {};
    const lCaracsInterdits = data?.combos?.interdits?.caracteristiques ?? {};
    const sucBonus = data?.combat?.data?.succesbonus ?? 0;
    const mod = data?.combat?.data?.modificateur ?? 0;
    const degatsDice = data?.combat?.data?.degatsbonus?.dice ?? 0;
    const degatsFixe = data?.combat?.data?.degatsbonus?.fixe ?? 0;
    const violenceDice = data?.combat?.data?.violencebonus?.dice ?? 0;
    const violenceFixe = data?.combat?.data?.violencebonus?.fixe ?? 0;
    const wpnContact = extractWpn?.contact ?? [];
    const wpnDistance = extractWpn?.distance ?? [];
    const wpnTourelle = extractWpn?.tourelle ?? [];
    const wpnMa = extractWpn?.wpn ?? [];
    const armesimprovisees = extractWpn.armesimprovisees;
    let lgbow = extractWpn?.longbow;
    let wpnMunitionsList = [wpnDistance, wpnTourelle]
    let int = [];

    if(lgbow?.effets?.raw ?? undefined !== undefined) lgbow.effets.raw = [];



    for (let [key, interdit] of Object.entries(lAspectsInterdits)){
      int = int.concat(interdit);
    }

    if(isPJ) {
      for (let [key, interdit] of Object.entries(lCaracsInterdits)){
        int = int.concat(interdit);
      }
    }

    for (let [kAspect, aspect] of Object.entries(data.aspects)){
      if(int.includes(kAspect)) {
        delete data.aspects[kAspect];
      }

      if(isPJ) {
        for (let [kCaracs, carac] of Object.entries(aspect.caracteristiques)){
          if(int.includes(kCaracs)) {
            delete data.aspects[kAspect].caracteristiques[kCaracs];
          }
        }
      }
    }

    for(let i = 0; i < wpnMunitionsList.length;i++) {
      const wpnM = wpnMunitionsList[i];

      for(let wpn of wpnM) {
        const wpnData = wpn.system;
        const wpnMunitions = wpnData?.optionsmunitions || {has:false};
        const wpnMunitionActuel = wpnMunitions?.actuel || "0";
        const wpnMunitionsListe = wpnMunitions?.liste?.[wpnMunitionActuel] || {};

        if(wpnMunitions.has) {
          const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
          const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

          wpnData.effets = {
            raw:[...new Set(eRaw)],
            custom:[...new Set(eCustom)],
          }
        }
      }
    }

    //L'ACTEUR
    this.data.actor = act;
    this.data.isToken = act?.isToken ?? false;
    this.data.pnj = isPJ ? false : true;
    this.data.ma = act?.type === 'mechaarmure' ? true : false;
    //ASPECTS ET INTERDITS
    this.data.aspects = data.aspects;
    this.data.interdits = int;
    //DIFFERENTS BONUS
    this.data.modificateur = mod;
    this.data.succesBonus = sucBonus;
    this.data.degatsBonus = {dice:degatsDice, fixe:degatsFixe};
    this.data.violenceBonus = {dice:violenceDice, fixe:violenceFixe};
    //LISTE DES ARMES
    this.data.listWpnContact = !isMA ? wpnContact ?? [] : [];
    this.data.listWpnDistance = !isMA ? wpnDistance ?? [] : [];
    this.data.listWpnTourelle = !isMA ? wpnTourelle ?? [] : [];
    this.data.listGrenades = !isMA ? extractWpn?.grenade ?? [] : [];
    this.data.listWpnImprovisees = {
      bonuscontact:armesimprovisees.bonuscontact,
      contact:armesimprovisees.liste,
      distance:armesimprovisees.liste};
    this.data.longbow = !isMA ? lgbow : [];
    this.data.listWpnMA = isMA ? wpnMa : [];
    this.data.listWpnSpecial = extractWpn?.wpnSpecial ?? [];
    //DEPLOIEMENT DES ONGLETS
    this.data.deploy = {};
    //STYLE
    this.data.style = {
      fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${rawStyle.toUpperCase()}.FullLabel`),
      label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${rawStyle.toUpperCase()}.Label`),
      raw:rawStyle,
      info:data.combat.styleInfo,
      caracteristiques:getStyle.caracteristiques,
      tourspasses:data.combat.data.tourspasses,
      type:data.combat.data.type,
      sacrifice:data.combat.data.sacrifice,
      maximum:6
    };
    //AVANTAGES ET DESAVANTAGES DE l'IA
    this.data.avDv = {
      avantages:act.avantagesIA,
      inconvenient:act.inconvenientIA
    };

    return {
      actor:this.data.actor,
      isToken:this.data.isToken,
      pnj:this.data.pnj,
      aspects:this.data.aspects,
      interdits:this.data.interdits,
      modificateur:this.data.modificateur,
      succesBonus:this.data.succesBonus,
      degatsBonus:this.data.degatsBonus,
      violenceBonus:this.data.violenceBonus,
      listWpnContact:this.data.listWpnContact,
      listWpnDistance:this.data.listWpnDistance,
      listWpnTourelle:this.data.listWpnTourelle,
      listGrenades:this.data.listGrenades,
      listWpnImprovisee:this.data.listWpnImprovisee,
      listWpnSpecial:this.data.listWpnSpecial,
      longbow:this.data.longbow,
      listWpnMA:this.data.listWpnMA,
      deploy:this.data.deploy,
      style:this.data.style,
      avDv:this.data.avDv,
    };
  }

  //ON GERE LE JET
  setR(data) {
    const actor = this.data.actor;
    const isPJ = actorIsPj(actor);
    const isMA = actorIsMa(actor);
    const system = actor.system;
    const bonus = system?.combos?.bonus ?? {};
    const interdits = this.data.interdits;
    const typeWpn = data?.typeWpn ?? this?.data?.typeWpn ?? '';
    const idWpn = data?.idWpn ?? this?.data?.idWpn ?? '';
    const nameWpn = data?.nameWpn ?? this?.data?.nameWpn ?? '';
    const sucBonus = data?.succesbonus ?? this.data?.succesBonus ?? 0;
    const mod = data?.modificateur ?? this.data?.modificateur ?? 0;
    const degatsDice = data?.degatsDice ?? this.data?.degatsBonus?.dice ?? 0;
    const degatsFixe = data?.degatsFixe ?? this.data?.degatsBonus?.fixe ?? 0;
    const violenceDice = data?.violenceDice ?? this.data?.violenceBonus?.dice ?? 0;
    const violenceFixe = data?.violenceFixe ?? this.data?.violenceBonus?.fixe ?? 0;
    const modTemp = data?.modificateurTemp ?? 0;
    const sucTemp = data?.succesTemp ?? 0;
    const vehicule = data?.vehicule ?? undefined;

    let base = data?.base ?? this.data?.base ?? '';
    let autre = data?.autre ?? this.data?.autre ?? [];
    let deploy = this.data.deploy;

    if(isPJ) {
      const bCarac = bonus?.caracteristiques ?? {};
      const caracBonus = [...new Set(Object.values(bCarac).reduce((acc, val) => acc.concat(val), []))];

      if(interdits.includes(base) || interdits.includes(caracToAspect(base))) base = '';

      autre = [...new Set([...autre, ...caracBonus])]
      autre = autre.filter(x => !interdits.includes(x));
      autre = autre.filter(x => !interdits.includes(caracToAspect(x)));
    } else {
      if(interdits.includes(base)) base = '';
    }

    //JET
    this.data.base = base;
    this.data.autre = autre;
    this.data.lock = data?.lock ?? this.data?.lock ?? [];
    this.data.difficulte = data?.difficulte ?? this.data?.difficulte ?? false;
    //ARME SELECTIONNEE
    this.data.isWpn = data?.isWpn ?? false;
    this.data.idWpn = idWpn ?? -1;
    this.data.nameWpn = nameWpn;
    this.data.typeWpn = typeWpn;
    this.data.num = data?.num ?? this?.data?.num ?? -1;
    //EFFETS SPECIAUX ARME SELECTIONNEE
    if(typeWpn === 'grenades' && nameWpn !== '') {
      const hasEffect = this.data.listGrenades?.[nameWpn]?.effets ?? false;
      if(!hasEffect) {
        this.data.barrage = false;
        this.data.typeWpn = '';
        this.data.nameWpn = '';
      } else {
        this.data.barrage = this.data.listGrenades[nameWpn].effets.raw.find(str => { if(str.includes('barrage')) return true; });
      }
    }

    //PAS D'OD DANS LE JET
    this.data.noOd = data?.noOd ?? false;
    //MODIFICATEURS TEMPORAIRES
    this.data.bonusTemp = {
      has:modTemp > 0 || sucTemp > 0 ? true : false,
      modificateur:modTemp,
      succesbonus:sucTemp
    }
    //MODIFICATEURS NON-TEMPORAIRES
    this.data.modificateur = mod;
    this.data.succesBonus = sucBonus;
    this.data.degatsBonus = {dice:degatsDice, fixe:degatsFixe};
    this.data.violenceBonus = {dice:violenceDice, fixe:violenceFixe};

    //GESTION DES ONGLETS
    switch(typeWpn) {
      case 'contact':
        deploy.wpnContact = true
        break;

      case 'distance':
        deploy.wpnDistance = true
        break;

      case 'tourelle':
        deploy.wpnTourelle = true
        break;

      case 'armesimprovisees':
        if(idWpn == 'contact') {
          deploy.wpnArmesImproviseesContact = true
        } else if(idWpn == 'distance') {
          deploy.wpnArmesImproviseesDistance = true
        }
        break;

      case 'longbow':
        deploy.longbow = true;
        break;

      case 'grenades':
        deploy.grenades = true;
        break;
    }

    this.data.deploy = deploy;
    this.data.vehicule = vehicule;
    this.data.ameliorations = {};

    if(isMA) {
      const configuration = actor.system.configurations.actuel;
      this.data.hasWraith = actor?.system?.configurations?.liste?.[configuration]?.modules?.moduleWraith?.active ?? false;
    } else this.data.hasWraith = false;

    if(vehicule !== undefined) {
      let vehiculeWpn = vehicule.items.filter(wpn => wpn.type === 'arme' && wpn.system.whoActivate !== "");

      for (let i of vehicule.items.filter(mdl => mdl.type === 'module')) {
        const system = i.system;
        const niveau = system.niveau.value;
        const itemDataNiveau = system.niveau.details[`n${niveau}`];
        const itemArme = itemDataNiveau?.arme || {has:false};
        const itemActive = system?.active?.base || false;

        if(itemArme === false) continue;
        if(itemDataNiveau.whoActivate === "") continue;

        if(itemDataNiveau.permanent || itemActive) {
          if(itemArme.has) {
            const moduleArmeType = itemArme.type;
            const moduleEffets = itemArme.effets;
            const moiduleEffetsRaw = moduleEffets.raw;
            const moduleEffetsCustom = moduleEffets.custom || [];
            const moduleEffetsFinal = {
              raw:[...new Set(moiduleEffetsRaw)],
              custom:moduleEffetsCustom,
              liste:moduleEffets.liste
            };
            const dataMunitions = itemArme?.optionsmunitions || {has:false};

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
              }

              degats = dataMunitions.liste[actuel].degats;
              violence = dataMunitions.liste[actuel].violence;
            }

            const moduleWpn = {
              _id:i._id,
              name:i.name,
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

            if(moduleArmeType === 'distance') {
              moduleWpn.system.distance = itemArme.distance;
            }

            if(moduleArmeType === 'distance') { vehiculeWpn.push(moduleWpn); }
          }
        }
      }

      this.data.listWpnContact = {};
      this.data.listWpnDistance = vehiculeWpn;
      this.data.listWpnTourelle = {};
      this.data.listGrenades = {};
      this.data.listWpnImprovisee = {};
      this.data.longbow = {};
      this.data.listWpnMA = {};
    }

    this.data.attackSurprise = this.data?.attackSurprise ?? false;

    return {
      base: this.data.base,
      autre: this.data.autre,
      lock: this.data.lock,
      difficulte: this.data.difficulte,
      isWpn: this.data.isWpn,
      idWpn: this.data.idWpn,
      nameWpn: this.data.nameWpn,
      typeWpn: this.data.typeWpn,
      num: this.data.num,
      barrage:this.data.barrage,
      noOd:this.data.noOd,
      bonusTemp:this.data.bonusTemp,
      modificateur:this.data.modificateur,
      succesBonus:this.data.succesBonus,
      degatsBonus:this.data.degatsBonus,
      violenceBonus:this.data.violenceBonus,
      deploy:this.data.deploy,
      vehicule:this.data.vehicule,
      listWpnContact:this.data.listWpnContact,
      listWpnDistance:this.data.listWpnDistance,
      listWpnTourelle:this.data.listWpnTourelle,
      listGrenades:this.data.listGrenades,
      listWpnImprovisee:this.data.listWpnImprovisee,
      listWpnSpecial:this.data.listWpnSpecial,
      longbow:this.data.longbow,
      listWpnMA:this.data.listWpnMA,
      hasWraith:this.data.hasWraith,
      ameliorations:this.data.ameliorations,
      attackSurprise:this.data.attackSurprise,
    };
  }

  //ON ACTUALISE LES INFORMATIONS
  actualise(actor) {
    //ACTUALISATION DE L'ACTEUR
    const getActor = actor;

    this.setAct(getActor);

    //ON VERIFIE SI L'ARME SELECTIONNEE EXISTE TOUJOURS
    const data = this.data;
    const typeWpn = data?.typeWpn ?? ''
    const idWpn = data?.idWpn ?? '';
    const numWpn = data?.num ?? -1;

    if(idWpn !== '') {
      let wpn = {};

      switch(typeWpn) {
        case 'contact':
          wpn = this.data.listWpnContact?.[numWpn] ?? false;
          break;

        case 'distance':
          wpn = this.data.listWpnDistance?.[numWpn] ?? false;
          break;

        case 'tourelle':
          wpn = this.data.listWpnTourelle?.[numWpn] ?? false;
          break;

        case 'longbow':
          wpn = foundry.utils.isEmpty(this.data.longbow) ? false : {};
          break;

        case 'grenades':
          wpn = foundry.utils.isEmpty(this.data.listGrenades) ? false : {};
          break;
      }

      if(wpn === false) {
        this.setR({isWpn:false, typeWpn:'', idWpn:'', nameWpn:'', num:-1});
      } else this.setR();
    } else this.setR();

    this.render(true);
  }

  async setBonusTemp(has=false, modificateur=0, succesbonus) {
    this.data.bonusTemp = {
      has:has,
      modificateur:modificateur,
      succesbonus:succesbonus
    };

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.bonusTemp
        );
      }, 0);
    });
  }

  getActor() {
    return this.data.actor;
  }

  isToken() {
    return this.data.isToken;
  }

  async setIfOd(hasOd) {
    this.data.noOd = hasOd;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.noOd
        );
      }, 0);
    });
  }

  async setIfAtkSurprise(hasAtkSurprise) {
    this.data.attackSurprise = hasAtkSurprise;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.attackSurprise
        );
      }, 0);
    });
  }

  async setSuccesBonus(value) {
    const actor = this.data.actor;

    if(this.data.isToken) await actor.update({['system.combat.data.succesbonus']:value});
    else await game.actors.get(actor.id).update({['system.combat.data.succesbonus']:value});

    this.data.succesBonus = value;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.succesBonus
        );
      }, 0);
    });
  }

  async setModificateur(value) {
    const actor = this.data.actor;

    if(this.data.isToken) await actor.update({['system.combat.data.modificateur']:value});
    else await game.actors.get(actor.id).update({['system.combat.data.modificateur']:value});

    this.data.modificateur = value;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.modificateur
        );
      }, 0);
    });
  }

  hasBonusTemp() {
    return this.data.bonusTemp.has;
  }

  getModificateur() {
    return Number(this.data.modificateur);
  }

  getSuccesBonus() {
    return Number(this.data.succesBonus);
  }

  getModificateurTemp() {
    return Number(this.data.bonusTemp.modificateur);
  }

  getSuccesBonusTemp() {
    return Number(this.data.bonusTemp.succesbonus);
  }

  extractWpn(act) {
    const wear = act.system.wear;
    const isPj = actorIsPj(act);
    const isMA = actorIsMa(act);
    const onArmor = wear === 'armure' || wear === 'ascension' || !isPj ? true : false;
    const labelsEffects = Object.assign({},
      CONFIG.KNIGHT.effets,
      CONFIG.KNIGHT.AMELIORATIONS.distance,
      CONFIG.KNIGHT.AMELIORATIONS.structurelles,
      CONFIG.KNIGHT.AMELIORATIONS.ornementales
    );
    const nbreGrenade = act.system?.combat?.grenades?.quantity?.value ?? 0;
    let grenades = {};
    let longbow = {};
    let armesContactEquipee = [];
    let armesDistanceEquipee = [];
    let armesTourelles = [];
    let wpn = [];
    let wpnSpecial = [];
    let moduleBonusDgts = {
      "contact":[],
      "distance":[]
    };
    let moduleBonusDgtsVariable = {
      "contact":[],
      "distance":[]
    };
    let moduleBonusViolence = {
      "contact":[],
      "distance":[]
    };
    let moduleBonusViolenceVariable = {
      "contact":[],
      "distance":[]
    };

    if(nbreGrenade > 0) grenades = act.system?.combat?.grenades?.liste ?? {};

    if(!isMA) {
      const armorSpecial = getSpecial(act);
      const armorSpecialRaw = armorSpecial?.raw || [];
      const armorSpecialCustom = armorSpecial?.custom || [];
      const capaciteultime = act.items.find(items => items.type === 'capaciteultime');

      for (let i of act.items) {
        const system = i.system;
        // ARMURE.
        if (i.type === 'armure') {
          const armorCapacites = system.capacites.selected;

          let passiveUltime = undefined;

          if(capaciteultime !== undefined) {
            const dataCapaciteUltime = capaciteultime.system;

            if(dataCapaciteUltime.type == 'passive') passiveUltime = dataCapaciteUltime.passives;
          }

          for (let [key, capacite] of Object.entries(armorCapacites)) {
            switch(key) {
              case "longbow":
                if(wear === 'armure') {
                  const dataLongbow = capacite;

                  longbow = dataLongbow;
                  longbow['has'] = true;
                  longbow.energie = 0;

                  longbow.degats.cout = 0;
                  longbow.degats.dice = dataLongbow.degats.min;

                  longbow.violence.cout = 0;
                  longbow.violence.dice = dataLongbow.violence.min;

                  const rangeListe = ['contact', 'courte', 'moyenne', 'longue', 'lointaine'];
                  let rangeToNumber = {};
                  let peRange = longbow.portee.energie;
                  let minRange = longbow.portee.min;
                  let maxRange = longbow.portee.max;
                  let isInRange = false;
                  let multiplicateur = 0;

                  for(let n = 0; n < rangeListe.length;n++) {
                    if(rangeListe[n] === minRange) {
                      isInRange = true;
                      rangeToNumber[rangeListe[n]] = multiplicateur*peRange;
                      multiplicateur += 1;
                    } else if(rangeListe[n] === maxRange) {
                      isInRange = false;
                      rangeToNumber[rangeListe[n]] = multiplicateur*peRange;
                    } else if(isInRange) {
                      rangeToNumber[rangeListe[n]] = multiplicateur*peRange;
                      multiplicateur += 1;
                    }
                  }

                  longbow.portee.cout = 0;
                  longbow.portee.value = dataLongbow.portee.min;
                  longbow.portee.rangeToNumber = rangeToNumber;

                  let raw = longbow.effets.raw ? [].concat(longbow.effets.raw) : [];
                  let custom = longbow.effets.custom ? [].concat(longbow.effets.custom) : [];

                  longbow.effets.raw = [...new Set(raw.concat(armorSpecialRaw))];
                  longbow.effets.custom = [...new Set(custom.concat(armorSpecialCustom))];
                  longbow.effets.liste = [];
                  longbow.effets.liste1.cout = 0;
                  longbow.effets.liste1.selected = 0;
                  longbow.effets.liste2.cout = 0;
                  longbow.effets.liste2.selected = 0;
                  longbow.effets.liste3.cout = 0;
                  longbow.effets.liste3.selected = 0;

                  let effListe1 = [];
                  let effListe2 = [];
                  let effListe3 = [];

                  for(let eff of longbow.effets.liste1.raw) {
                    let split = eff.split(" ");
                    let splitV = split[1] ? ` ${split[1]}` : ""

                    effListe1.push({
                      name:`${game.i18n.localize(labelsEffects[split[0]].label)}${splitV}`,
                      description:`${game.i18n.localize(labelsEffects[split[0]].description)}`,
                      raw:eff
                    });
                  }

                  for(let eff of longbow.effets.liste2.raw) {
                    let split = eff.split(" ");
                    let splitV = split[1] ? ` ${split[1]}` : ""

                    effListe2.push({
                      name:`${game.i18n.localize(labelsEffects[split[0]].label)}${splitV}`,
                      description:`${game.i18n.localize(labelsEffects[split[0]].description)}`,
                      raw:eff
                    });
                  }

                  for(let eff of longbow.effets.liste3.raw) {
                    let split = eff.split(" ");
                    let splitV = split[1] ? ` ${split[1]}` : ""

                    effListe3.push({
                      name:`${game.i18n.localize(labelsEffects[split[0]].label)}${splitV}`,
                      description:`${game.i18n.localize(labelsEffects[split[0]].description)}`,
                      raw:eff
                    });
                  }

                  longbow.effets.liste1.liste = effListe1;
                  longbow.effets.liste2.liste = effListe2;
                  longbow.effets.liste3.liste = effListe3;
                }
                break;

              case "cea":
                if(passiveUltime !== undefined) {
                  if(passiveUltime.capacites.actif && passiveUltime.capacites.cea.actif) {
                    system.capacites.selected[key] = Object.assign(system.capacites.selected[key], {
                      vague:{
                        degats:{
                          dice:passiveUltime.capacites.cea.update.vague.degats.dice,
                          fixe:passiveUltime.capacites.cea.update.vague.degats.fixe,
                        },
                        violence:{
                          dice:passiveUltime.capacites.cea.update.vague.violence.dice,
                          fixe:passiveUltime.capacites.cea.update.vague.violence.fixe,
                        },
                        effets:{
                          raw:passiveUltime.capacites.cea.update.vague.effets.raw,
                          custom:passiveUltime.capacites.cea.update.vague.effets.custom,
                        }
                      },
                      rayon:{
                        degats:{
                          dice:passiveUltime.capacites.cea.update.rayon.degats.dice,
                          fixe:passiveUltime.capacites.cea.update.rayon.degats.fixe,
                        },
                        violence:{
                          dice:passiveUltime.capacites.cea.update.rayon.violence.dice,
                          fixe:passiveUltime.capacites.cea.update.rayon.violence.fixe,
                        },
                        effets:{
                          raw:passiveUltime.capacites.cea.update.rayon.effets.raw,
                          custom:passiveUltime.capacites.cea.update.rayon.effets.custom,
                        }
                      },
                      salve:{
                        degats:{
                          dice:passiveUltime.capacites.cea.update.salve.degats.dice,
                          fixe:passiveUltime.capacites.cea.update.salve.degats.fixe,
                        },
                        violence:{
                          dice:passiveUltime.capacites.cea.update.salve.violence.dice,
                          fixe:passiveUltime.capacites.cea.update.salve.violence.fixe,
                        },
                        effets:{
                          raw:passiveUltime.capacites.cea.update.salve.effets.raw,
                          custom:passiveUltime.capacites.cea.update.salve.effets.custom,
                        }
                      }
                    });
                  }
                }

                if(wear === 'armure') {
                  const vagueEffets = capacite.vague.effets;
                  const vagueEffetsRaw = vagueEffets.raw.concat(armorSpecialRaw);
                  const vagueEffetsCustom = vagueEffets.custom.concat(armorSpecialCustom) || [];
                  const vagueEffetsFinal = {
                    raw:[...new Set(vagueEffetsRaw)],
                    custom:vagueEffetsCustom,
                    liste:[]
                  };

                  const salveEffets = capacite.salve.effets;
                  const salveEffetsRaw = salveEffets.raw.concat(armorSpecialRaw);
                  const salveEffetsCustom = salveEffets.custom.concat(armorSpecialCustom) || [];
                  const salveEffetsFinal = {
                    raw:[...new Set(salveEffetsRaw)],
                    custom:salveEffetsCustom,
                    liste:[]
                  };

                  const rayonEffets = capacite.rayon.effets;
                  const rayonEffetsRaw = rayonEffets.raw.concat(armorSpecialRaw);
                  const rayonEffetsCustom = rayonEffets.custom.concat(armorSpecialCustom) || [];
                  const rayonEffetsFinal = {
                    raw:[...new Set(rayonEffetsRaw)],
                    custom:rayonEffetsCustom,
                    liste:[]
                  };

                  const vagueWpnC = {
                    _id:i._id,
                    name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                    system:{
                      capaciteName:'cea',
                      subCapaciteName:'vague',
                      noRack:true,
                      capacite:true,
                      portee:capacite.vague.portee,
                      energie:capacite.energie,
                      espoir:capacite.espoir,
                      degats:{
                        dice:capacite.vague.degats.dice,
                        fixe:0
                      },
                      violence:{
                        dice:capacite.vague.violence.dice,
                        fixe:0
                      },
                      type:'contact',
                      effets:vagueEffetsFinal
                    }
                  };

                  const salveWpnC = {
                    _id:i._id,
                    name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                    system:{
                      capaciteName:'cea',
                      subCapaciteName:'salve',
                      noRack:true,
                      capacite:true,
                      portee:capacite.salve.portee,
                      energie:capacite.energie,
                      espoir:capacite.espoir,
                      degats:{
                        dice:capacite.salve.degats.dice,
                        fixe:0
                      },
                      violence:{
                        dice:capacite.salve.violence.dice,
                        fixe:0
                      },
                      type:'contact',
                      effets:salveEffetsFinal
                    }
                  };

                  const rayonWpnC = {
                    _id:i._id,
                    name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                    system:{
                      capaciteName:'cea',
                      subCapaciteName:'rayon',
                      noRack:true,
                      capacite:true,
                      portee:capacite.rayon.portee,
                      energie:capacite.energie,
                      espoir:capacite.espoir,
                      degats:{
                        dice:capacite.rayon.degats.dice,
                        fixe:0
                      },
                      violence:{
                        dice:capacite.rayon.violence.dice,
                        fixe:0
                      },
                      type:'contact',
                      effets:rayonEffetsFinal
                    }
                  };

                  const vagueWpnD = {
                    _id:i._id,
                    name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.VAGUE.Label'),
                    system:{
                      capaciteName:'cea',
                      subCapaciteName:'vague',
                      noRack:true,
                      capacite:true,
                      portee:capacite.vague.portee,
                      energie:capacite.energie,
                      espoir:capacite.espoir,
                      degats:{
                        dice:capacite.vague.degats.dice,
                        fixe:0
                      },
                      violence:{
                        dice:capacite.vague.violence.dice,
                        fixe:0
                      },
                      type:'distance',
                      effets:vagueEffetsFinal
                    }
                  };

                  const salveWpnD = {
                    _id:i._id,
                    name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.SALVE.Label'),
                    system:{
                      capaciteName:'cea',
                      subCapaciteName:'salve',
                      noRack:true,
                      capacite:true,
                      portee:capacite.salve.portee,
                      energie:capacite.energie,
                      espoir:capacite.espoir,
                      degats:{
                        dice:capacite.salve.degats.dice,
                        fixe:0
                      },
                      violence:{
                        dice:capacite.salve.violence.dice,
                        fixe:0
                      },
                      type:'distance',
                      effets:salveEffetsFinal
                    }
                  };

                  const rayonWpnD = {
                    _id:i._id,
                    name:game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.CEA.RAYON.Label'),
                    system:{
                      capaciteName:'cea',
                      subCapaciteName:'rayon',
                      noRack:true,
                      capacite:true,
                      portee:capacite.rayon.portee,
                      energie:capacite.energie,
                      espoir:capacite.espoir,
                      degats:{
                        dice:capacite.rayon.degats.dice,
                        fixe:0
                      },
                      violence:{
                        dice:capacite.rayon.violence.dice,
                        fixe:0
                      },
                      type:'distance',
                      effets:rayonEffetsFinal
                    }
                  };

                  armesContactEquipee.push(vagueWpnC);
                  armesContactEquipee.push(salveWpnC);
                  armesContactEquipee.push(rayonWpnC);

                  armesDistanceEquipee.push(vagueWpnD);
                  armesDistanceEquipee.push(salveWpnD);
                  armesDistanceEquipee.push(rayonWpnD);
                }
              break;

              case "borealis":
              if(wear === 'armure') {
                const borealisEffets = capacite.offensif.effets;
                const borealisEffetsRaw = borealisEffets.raw.concat(armorSpecialRaw);
                const borealisEffetsCustom = borealisEffets.custom.concat(armorSpecialCustom) || [];
                const borealisEffetsFinal = {
                  raw:[...new Set(borealisEffetsRaw)],
                  custom:borealisEffetsCustom,
                  liste:borealisEffets.liste
                };

                const borealisWpnC = {
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                  system:{
                    capaciteName:'borealis',
                    subCapaciteName:'offensif',
                    noRack:true,
                    capacite:true,
                    portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.offensif.portee.charAt(0).toUpperCase()+capacite.offensif.portee.substr(1)}`),
                    energie:capacite.offensif.energie,
                    degats:{
                      dice:capacite.offensif.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.offensif.violence.dice,
                      fixe:0
                    },
                    type:'contact',
                    effets:borealisEffetsFinal
                  }
                };

                const borealisWpnD = {
                  _id:i._id,
                  name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.BOREALIS.OFFENSIF.Label')}`,
                  system:{
                    capaciteName:'borealis',
                    subCapaciteName:'offensif',
                    noRack:true,
                    capacite:true,
                    portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.offensif.portee.charAt(0).toUpperCase()+capacite.offensif.portee.substr(1)}`),
                    energie:capacite.offensif.energie,
                    degats:{
                      dice:capacite.offensif.degats.dice,
                      fixe:0
                    },
                    violence:{
                      dice:capacite.offensif.violence.dice,
                      fixe:0
                    },
                    type:'distance',
                    effets:borealisEffetsFinal
                  }
                };

                armesContactEquipee.push(borealisWpnC);

                armesDistanceEquipee.push(borealisWpnD);
              }
              break;

              case "morph":
                if(passiveUltime !== undefined) {
                  if(passiveUltime.capacites.actif && passiveUltime.capacites.morph.actif) {
                    system.capacites.selected[key] = Object.assign(system.capacites.selected[key], {
                      etirement:{
                        portee:passiveUltime.capacites.morph.update.etirement.portee,
                      },
                      fluide:{
                        bonus:{
                          reaction:passiveUltime.capacites.morph.update.fluide.bonus.reaction,
                          defense:passiveUltime.capacites.morph.update.fluide.bonus.defense
                        }
                      },
                      metal:{
                        bonus:{
                          champDeForce:passiveUltime.capacites.morph.update.metal.bonus.champDeForce,
                        }
                      },
                      polymorphie:{
                        canon:{
                          degats:{
                            dice:passiveUltime.capacites.morph.update.polymorphie.canon.degats.dice,
                            fixe:passiveUltime.capacites.morph.update.polymorphie.canon.degats.fixe,
                          },
                          violence:{
                            dice:passiveUltime.capacites.morph.update.polymorphie.canon.violence.dice,
                            fixe:passiveUltime.capacites.morph.update.polymorphie.canon.violence.fixe,
                          },
                          effets:{
                            raw:capacite.polymorphie.canon.effets.raw.concat(passiveUltime.capacites.morph.update.polymorphie.canon.effets.raw),
                            custom:capacite.polymorphie.canon.effets.custom.concat(passiveUltime.capacites.morph.update.polymorphie.canon.effets.custom),
                          }
                        },
                        griffe:{
                          degats:{
                            dice:passiveUltime.capacites.morph.update.polymorphie.griffe.degats.dice,
                            fixe:passiveUltime.capacites.morph.update.polymorphie.griffe.degats.fixe,
                          },
                          violence:{
                            dice:passiveUltime.capacites.morph.update.polymorphie.griffe.violence.dice,
                            fixe:passiveUltime.capacites.morph.update.polymorphie.griffe.violence.fixe,
                          },
                          effets:{
                            raw:capacite.polymorphie.griffe.effets.raw.concat(passiveUltime.capacites.morph.update.polymorphie.griffe.effets.raw),
                            custom:capacite.polymorphie.griffe.effets.custom.concat(passiveUltime.capacites.morph.update.polymorphie.griffe.effets.custom),
                          }
                        },
                        lame:{
                          degats:{
                            dice:passiveUltime.capacites.morph.update.polymorphie.lame.degats.dice,
                            fixe:passiveUltime.capacites.morph.update.polymorphie.lame.degats.fixe,
                          },
                          violence:{
                            dice:passiveUltime.capacites.morph.update.polymorphie.lame.violence.dice,
                            fixe:passiveUltime.capacites.morph.update.polymorphie.lame.violence.fixe,
                          },
                          effets:{
                            raw:capacite.polymorphie.lame.effets.raw.concat(passiveUltime.capacites.morph.update.polymorphie.lame.effets.raw),
                            custom:capacite.polymorphie.lame.effets.custom.concat(passiveUltime.capacites.morph.update.polymorphie.lame.effets.custom),
                          }
                        }
                      },
                      vol:{
                        description:passiveUltime.capacites.morph.update.vol.description,
                      }
                    });
                  }
                }

                const activeMorph = capacite?.active?.morph || false;

                if(wear === 'armure' && activeMorph) {
                  if(capacite.active.polymorphieLame) {
                    const lameEffets = capacite.polymorphie.lame.effets;
                    const lameEffetsRaw = lameEffets.raw.concat(armorSpecialRaw);
                    const lameEffetsCustom = lameEffets.custom.concat(armorSpecialCustom) || [];
                    const lameEffetsFinal = {
                      raw:[...new Set(lameEffetsRaw)],
                      custom:lameEffetsCustom,
                      liste:lameEffets.liste
                    };

                    const lame = {
                      _id:i._id,
                      name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Lame')}`,
                      system:{
                        capaciteName:'morph',
                        subCapaciteName:'polymorphie',
                        subSubCapaciteName:'lame',
                        noRack:true,
                        capacite:true,
                        portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.polymorphie.lame.portee.charAt(0).toUpperCase()+capacite.polymorphie.lame.portee.substr(1)}`),
                        degats:{
                          dice:capacite.polymorphie.lame.degats.dice,
                          fixe:capacite.polymorphie.lame.degats.fixe
                        },
                        violence:{
                          dice:capacite.polymorphie.lame.violence.dice,
                          fixe:capacite.polymorphie.lame.violence.fixe
                        },
                        type:'contact',
                        effets:lameEffetsFinal
                      }
                    };

                    const bDefense = lameEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                    const bReaction = lameEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; })

                    if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                    if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                    armesContactEquipee.push(lame);
                  }

                  if(capacite.active.polymorphieGriffe) {
                    const griffeEffets = capacite.polymorphie.griffe.effets;
                    const griffeEffetsRaw = griffeEffets.raw.concat(armorSpecialRaw);
                    const griffeEffetsCustom = griffeEffets.custom.concat(armorSpecialCustom) || [];
                    const griffeEffetsFinal = {
                      raw:[...new Set(griffeEffetsRaw)],
                      custom:griffeEffetsCustom,
                      liste:griffeEffets.liste
                    };

                    const griffe = {
                      _id:i._id,
                      name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Griffe')}`,
                      system:{
                        capaciteName:'morph',
                        subCapaciteName:'polymorphie',
                        subSubCapaciteName:'griffe',
                        noRack:true,
                        capacite:true,
                        portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.polymorphie.griffe.portee.charAt(0).toUpperCase()+capacite.polymorphie.griffe.portee.substr(1)}`),
                        degats:{
                          dice:capacite.polymorphie.griffe.degats.dice,
                          fixe:capacite.polymorphie.griffe.degats.fixe
                        },
                        violence:{
                          dice:capacite.polymorphie.griffe.violence.dice,
                          fixe:capacite.polymorphie.griffe.violence.fixe
                        },
                        type:'contact',
                        effets:griffeEffetsFinal
                      }
                    };

                    const bDefense = griffeEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                    const bReaction = griffeEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; })

                    if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                    if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                    armesContactEquipee.push(griffe);
                  };

                  if(capacite.active.polymorphieCanon) {
                    const canonEffets = capacite.polymorphie.canon.effets;
                    const canonEffetsRaw = canonEffets.raw.concat(armorSpecialRaw);
                    const canonEffetsCustom = canonEffets.custom.concat(armorSpecialCustom) || [];
                    const canonEffetsFinal = {
                      raw:[...new Set(canonEffetsRaw)],
                      custom:canonEffetsCustom,
                      liste:canonEffets.liste
                    };

                    const canon = {
                      _id:i._id,
                      name:`${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Label')} - ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.MORPH.CAPACITES.POLYMORPHIE.Canon')}`,
                      system:{
                        capaciteName:'morph',
                        subCapaciteName:'polymorphie',
                        subSubCapaciteName:'canon',
                        noRack:true,
                        capacite:true,
                        portee:game.i18n.localize(`KNIGHT.PORTEE.${capacite.polymorphie.canon.portee.charAt(0).toUpperCase()+capacite.polymorphie.canon.portee.substr(1)}`),
                        energie:capacite.polymorphie.canon.energie,
                        degats:{
                          dice:capacite.polymorphie.canon.degats.dice,
                          fixe:capacite.polymorphie.canon.degats.fixe
                        },
                        violence:{
                          dice:capacite.polymorphie.canon.violence.dice,
                          fixe:capacite.polymorphie.canon.violence.fixe
                        },
                        type:'distance',
                        effets:canonEffetsFinal
                      }
                    };

                    const bDefense = canonEffetsFinal.raw.find(str => { if(str.includes('defense')) return str; });
                    const bReaction = canonEffetsFinal.raw.find(str => { if(str.includes('reaction')) return str; })

                    if(bDefense !== undefined) defense.bonus += +bDefense.split(' ')[1];
                    if(bReaction !== undefined) reaction.bonus += +bReaction.split(' ')[1];

                    armesDistanceEquipee.push(canon);
                  }
                }
                break;
            }
          }
        }

        // MODULE
        if (i.type === 'module') {
          const niveau = system.niveau.value;
          const itemDataNiveau = system.niveau.details[`n${niveau}`];
          const itemArme = itemDataNiveau?.arme || {has:false};
          const itemBonus = itemDataNiveau?.bonus || {has:false};
          const itemActive = system?.active?.base || false;

          if(itemArme === false && itemBonus === false) continue;

          if(itemDataNiveau.permanent || itemActive) {
            if(itemArme.has && onArmor) {
              const moduleArmeType = itemArme.type;
              const moduleEffets = itemArme.effets;
              const moiduleEffetsRaw = moduleEffets.raw.concat(armorSpecialRaw);
              const moduleEffetsCustom = moduleEffets.custom.concat(armorSpecialCustom) || [];
              const moduleEffetsFinal = {
                raw:[...new Set(moiduleEffetsRaw)],
                custom:moduleEffetsCustom,
                liste:moduleEffets.liste
              };
              const dataMunitions = itemArme?.optionsmunitions || {has:false};

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
                }

                degats = dataMunitions.liste[actuel].degats;
                violence = dataMunitions.liste[actuel].violence;
              }

              const moduleWpn = {
                _id:i._id,
                name:i.name,
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
              else if(moduleArmeType === 'distance') { armesDistanceEquipee.push(moduleWpn); }
            }

            if(itemBonus.has && onArmor) {
              const iBDgts = itemBonus.degats;
              const iBDgtsVariable = iBDgts.variable;
              const iBViolence = itemBonus.violence;
              const iBViolenceVariable = iBViolence.variable;

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

                  moduleBonusDgtsVariable[iBDgts.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBDgtsVariable?.selected?.dice || 0,
                      fixe:iBDgtsVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBDgtsVariable?.selected?.energie.dice || 0,
                        fixe:iBDgtsVariable?.selected?.energie.fixe || 0,
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
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
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

                  moduleBonusViolenceVariable[iBViolence.type].push({
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    selected:{
                      dice:iBViolenceVariable?.selected?.dice || 0,
                      fixe:iBViolenceVariable?.selected?.fixe || 0,
                      energie:{
                        dice:iBViolenceVariable?.selected?.energie?.dice || 0,
                        fixe:iBViolenceVariable?.selected?.energie?.fixe || 0,
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
                    id:i._id,
                    label:i.name,
                    description:i.system.description,
                    dice:iBViolence.dice,
                    fixe:iBViolence.fixe
                  });
                }
              }
            }
          }
        }

        // ARMES
        if (i.type === 'arme') {
          const type = system.type;
          const tourelle = system.tourelle;

          const armeRaw = system.effets.raw.concat(armorSpecialRaw);
          const armeCustom = system.effets.custom.concat(armorSpecialCustom);

          const armeE2Raw = system.effets2mains.raw.concat(armorSpecialRaw);
          const armeE2Custom = system.effets2mains.custom.concat(armorSpecialCustom);

          system.effets.raw = [...new Set(armeRaw)];
          system.effets.custom = armeCustom;

          system.effets2mains.raw = [...new Set(armeE2Raw)];
          system.effets2mains.custom = armeE2Custom;

          const dataMunitions = system.optionsmunitions,
                hasDM = dataMunitions?.has || false,
                actuelDM = Number(dataMunitions?.actuel || 0);

          if(hasDM && actuelDM != 0) {
            for (let i = 0; i <= dataMunitions.actuel; i++) {

              const raw = dataMunitions.liste[i].raw.concat(armorSpecialRaw);
              const custom = dataMunitions.liste[i].custom.concat(armorSpecialCustom);

              system.optionsmunitions.liste[i].raw = [...new Set(raw)];
              system.optionsmunitions.liste[i].custom = custom;
            }
          }

          const optionsmunitions = system.optionsmunitions.has;
          const munition = system.optionsmunitions.actuel;

          if(type === 'distance' && optionsmunitions === true) {
            system.degats.dice = system.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
            system.degats.fixe = system.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

            system.violence.dice = system.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
            system.violence.fixe = system.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;
          }

          if(wear !== 'ascension' && !tourelle.has) {
            let equipped = system?.equipped ?? false;
            if(!isPj) equipped = true;

            const options2mains = system.options2mains.has;
            const main = system.options2mains.actuel;

            if(type === 'contact' && options2mains === true) {
              system.degats.dice = system?.options2mains?.[main]?.degats?.dice || 0;
              system.degats.fixe = system?.options2mains?.[main]?.degats?.fixe || 0;

              system.violence.dice = system?.options2mains?.[main]?.violence?.dice || 0;
              system.violence.fixe = system?.options2mains?.[main]?.violence?.fixe || 0;
            }

            if (type === 'contact' && equipped === true) { armesContactEquipee.push(i); }
            else if (type === 'distance' && equipped === true) { armesDistanceEquipee.push(i); }
          }

          if(tourelle.has && type === 'distance') {
            armesTourelles.push(i);
          }
        }

        // CAPACITES
        if (i.type === 'capacite') {

          if(!i.system.attaque.has) continue;
          const dataCAttaque = i.system.attaque;

          const capaciteWpn = {
            _id:i._id,
            name:i.name,
            type:'capacite',
            system:{
              type:dataCAttaque.type,
              portee:dataCAttaque.portee,
              degats:dataCAttaque.degats,
              violence:{
                dice:0,
                fixe:0,
              },
              effets:dataCAttaque.effets,
            }
          }

          if(dataCAttaque.type === 'contact') armesContactEquipee.push(capaciteWpn);
          else if(dataCAttaque.type === 'distance') armesDistanceEquipee.push(capaciteWpn);
        }
      }

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

      for (let [key, grenade] of Object.entries(grenades)){
        const effetsRaw = grenades[key].effets.raw.concat(armorSpecialRaw);
        const effetsCustom = grenades[key].effets.custom.concat(armorSpecialCustom);

        grenades[key].effets.raw = [...new Set(effetsRaw)];
        grenades[key].effets.custom = [...new Set(effetsCustom)];
      };
    } else {
      const modulesListe = Object.keys(act.system.modules.liste);
      const modulesBase = Object.keys(act.system.configurations.liste.base.modules);
      const modulesC1 = Object.keys(act.system.configurations.liste.c1.modules);
      const modulesC2 = Object.keys(act.system.configurations.liste.c2.modules);
      const listWpn = ['canonMetatron', 'canonMagma', 'mitrailleusesSurtur', 'souffleDemoniaque', 'poingsSoniques'];
      const listWpnSpecial = ['lamesCinetiquesGeantes'];

      for(let i = 0; i < modulesListe.length;i++) {
        const name = modulesListe[i];
        let type = '';

        if(modulesBase.includes(name)) type = 'base';
        if(modulesC1.includes(name)) type = 'c1';
        if(modulesC2.includes(name)) type = 'c2';

        if(type !== '') {
          const data = act.system.configurations.liste[type].modules[name];

          if(listWpn.includes(name)) {
            let noyaux = 0;

            switch(name) {
              case 'canonMagma':
                noyaux = +data.noyaux.simple;
                break;

              case 'souffleDemoniaque':
              case 'mitrailleusesSurtur':
              case 'canonMetatron':
              case 'poingsSoniques':
                noyaux = +data.noyaux;
                break;
            }

            wpn.push({
              type:type,
              _id:name,
              name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${name.toUpperCase()}.Label`),
              portee:data.portee,
              energie:noyaux,
              degats:data.degats,
              violence:data.violence,
              effets:data.effets
            });
          }

          if(listWpnSpecial.includes(name)) {
            let noyaux = 0;

            wpnSpecial.push({
              type:'special',
              subType:type,
              _id:name,
              name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${name.toUpperCase()}.Label`),
              portee:data.portee,
              energie:noyaux,
              degats:data.degats,
              violence:data.violence,
              effets:data.effets,
              eff1:data.eff1,
              eff2:data.eff2
            });
          }
        }
      }
    }

    return {
      longbow:longbow,
      contact:armesContactEquipee,
      distance:armesDistanceEquipee,
      tourelle:armesTourelles,
      wpn:wpn,
      wpnSpecial:wpnSpecial,
      grenade:grenades,
      armesimprovisees:foundry.utils.mergeObject(act.system.combat.armesimprovisees, {
        bonuscontact:{
          degatsfixe:moduleBonusDgts.contact, degatsvariable:moduleBonusDgtsVariable.contact,
          violencefixe:moduleBonusViolence.contact, violencevariable:moduleBonusViolenceVariable.contact,
        }
      }),
    }
  }

    /** @inheritdoc */
  activateListeners(html) {
    html.find(".aspect button").click(this._onSelectCaracteristique.bind(this));
    html.find(".wpn button").click(this._onSelectWpn.bind(this));
    html.find(".grenades button").click(this._onSelectGrenades.bind(this));
    html.find(".longbow button").click(this._onSelectLongbow.bind(this));
    html.find(".special button").click(this._onSelectWpn.bind(this));
    html.find(".longbow div.effets div span").click(this._onSelectEffetsLongbow.bind(this));
    html.find(".special div.effets div span").click(this._onSelectEffetsSpecial.bind(this));
    html.find(".bonus .buttons button").click(this._onSelectCaracStyle.bind(this));
    html.find(".button1").click(this._onClickButton.bind(this));
    html.find(".button2").click(this._onClickEButton.bind(this));
    html.find(".button3").click(this.close.bind(this));

    html.find('.header .far').click(ev => {
      const data = $(ev.currentTarget);
      const deploy = data.data("deploy");
      const value = data.data("value") ? false : true;

      this.data.deploy[deploy] = value;
      this.render(true);
    });

    html.find(".label").change(ev => {
      this.data.label = $(ev.currentTarget).val();
    });

    html.find(".difficulte").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.difficulte = value;
    });

    html.find(".succesBonus").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.succesBonus = value;
    });

    html.find(".modificateur").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.modificateur = value;
    });

    html.find(".degatsBonusDice").change(async ev => {
      const actor = this.data.actor;
      const value = +$(ev.currentTarget).val();

      this.data.degatsBonus.dice = value;
      if(this.data.isToken) await actor.update({[`system.combat.data.degatsbonus.dice`]:value});
      else await game.actors.get(actor.id).update({[`system.combat.data.degatsbonus.dice`]:value});
    });

    html.find(".degatsBonusFixe").change(async ev => {
      const actor = this.data.actor;
      const value = +$(ev.currentTarget).val();

      this.data.degatsBonus.fixe = value;
      if(this.data.isToken) await actor.update({[`system.combat.data.degatsbonus.fixe`]:value});
      else await game.actors.get(actor.id).update({[`system.combat.data.degatsbonus.fixe`]:value});
    });

    html.find(".violenceBonusDice").change(async ev => {
      const actor = this.data.actor;
      const value = +$(ev.currentTarget).val();

      this.data.violenceBonus.dice = value;
      if(this.data.isToken) await actor.update({[`system.combat.data.violencebonus.dice`]:value});
      else await game.actors.get(actor.id).update({[`system.combat.data.violencebonus.dice`]:value});
    });

    html.find(".violenceBonusFixe").change(async ev => {
      const actor = this.data.actor;
      const value = +$(ev.currentTarget).val();

      this.data.violenceBonus.fixe = value;
      if(this.data.isToken) await actor.update({[`system.combat.data.violencebonus.fixe`]:value});
      else await game.actors.get(actor.id).update({[`system.combat.data.violencebonus.fixe`]:value});
    });

    html.find("div.wpn span.selected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const special = type?.data("special") || false;
      const value = type.data("value");

      if(special !== false) {
        this.data[special][effet] = value;
      } else {
        this.data[effet] = value;
      }

      this.render(true)
    });

    html.find("div.wpn span.relanceDgts").click(ev => {
      const cTarget = $(ev.currentTarget);
      const id = cTarget.data("id");
      const type = cTarget.data("type");
      const name = cTarget.data("name");

      this._doRoll(ev, false, false, true, false, id, type, name);
    });

    html.find("div.longbow span.selected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const special = type?.data("special") || false;
      const value = type.data("value");

      if(special !== false) {
        this.data[special][effet] = value;
      } else {
        this.data[effet] = value;
      }

      this.render(true)
    });

    html.find("div.special span.selected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const value = type.data("value");
      this.data[effet] = value;

      this.render(true)
    });

    html.find("div.longbow span.relanceDgts").click(ev => {
      const cTarget = $(ev.currentTarget);
      const id = cTarget.data("id");
      const type = cTarget.data("type");
      const name = cTarget.data("name");

      this._doRoll(ev, false, false, true, false, id, type, name);
    });

    html.find("div.grenades span.selected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const value = type.data("value");
      this.data[effet] = value;

      this.render(true)
    });

    html.find("div.grenades span.relanceDgts").click(ev => {
      const cTarget = $(ev.currentTarget);
      const type = cTarget.data("type");
      const name = cTarget.data("name");

      this._doRoll(ev, false, false, true, false, '', type, name);
    });

    html.find('div.styleCombat > span.info').hover(ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "block");
    }, ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "none");
    });

    html.find('div.styleCombat > span.info').click(ev => {
      const actuel = this.data.style.deploy || false;

      let result = false;

      if(actuel) {
        result = false;
      } else {
        result = true;
      }

      this.data.style.deploy = result;
      this.render(true);
    });

    html.find('button.noOd').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");

      if(!value) {
        await this.setIfOd(true);
      } else {
        await this.setIfOd(false);
      }

      this.render(true);
    });

    html.find('button.attackSurprise').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");

      if(!value) {
        await this.setIfAtkSurprise(true);
      } else {
        await this.setIfAtkSurprise(false);
      }

      this.render(true);
    });

    html.find('div.bonus div.pilonnage input').change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.style.tourspasses = value;
    });

    html.find('div.bonus div.puissant input').change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.style.sacrifice = value;
    });

    html.find('div.bonus select').change(ev => {
      const actor = this.data.actor;
      const value = $(ev.currentTarget).val();

      if(this.data.isToken) actor.update({['system.combat.data.type']:value});
      else game.actors.get(actor.id).update({['system.combat.data.type']:value});

      this.data.style.type = value;

      switch(value) {
        case 'degats':
          this.data.style.maximum = 6;
          break;

        case 'violence':
          this.data.style.maximum = 8;
          break;
      }
    });

    html.find('select.degatsSelected').change(async ev => {
      const actor = this.data.actor;
      const target = $(ev.currentTarget);
      const value = +target.val();
      const type = target.data("type");
      const num = target.data("num");
      let trueWpn = {};
      let toupdate = "";
      let wpn = {};

      if(type === 'contact') wpn = this.data.listWpnContact[num];
      else if(type === 'distance') wpn = this.data.listWpnDistance[num];

      wpn.system.degats.dice = value;

      if(this.data.isToken) trueWpn = actor.items.get(wpn._id);
      else trueWpn = game.actors.get(actor.id).items.get(wpn._id);

      if(wpn.type === 'module') {
        const getNiveau = trueWpn.system.niveau.value;
        toupdate = `system.niveau.details.n${getNiveau}.arme.degats.dice`;
      }
      else if(wpn.type === 'arme') toupdate = 'system.degats.dice';

      if(toupdate !== "") {
        if(this.data.isToken) await trueWpn.update({[toupdate]:value});
        else await trueWpn.update({[toupdate]:value});
      }
    });

    html.find('select.violenceSelected').change(async ev => {
      const actor = this.data.actor;
      const target = $(ev.currentTarget);
      const value = target.val();
      const type = target.data("type");
      const num = target.data("num");
      let trueWpn = {};
      let toupdate = "";
      let wpn = {};

      if(type === 'contact') wpn = this.data.listWpnContact[num];
      else if(type === 'distance') wpn = this.data.listWpnDistance[num];

      if(type === 'contact') wpn.system.violence.dice = +value;
      else if(type === 'distance') wpn.system.violence.dice = +value;

      if(this.data.isToken) trueWpn = actor.items.get(wpn._id);
      else trueWpn = game.actors.get(actor.id).items.get(wpn._id);

      if(wpn.type === 'module') {
        const getNiveau = trueWpn.system.niveau.value;
        toupdate = `system.niveau.details.n${getNiveau}.arme.violence.dice`;
      }
      else if(wpn.type === 'arme') toupdate = 'system.violence.dice';

      if(toupdate !== "") {
        if(this.data.isToken) await trueWpn.update({[toupdate]:value});
        else await trueWpn.update({[toupdate]:value});
      }
    });

    html.find('select.bonusVariable').change(ev => {
      const target = $(ev.currentTarget);
      const value = +target.val();
      const type = target.data("type");
      const num = target.data("num");
      const typeBonus = target.data("typebonus");
      const fixeOrDice = target.data("fixeordice");
      const variable = target.data("variable");
      const energie = +target.data("energie");
      const actor = this.data.actor;
      const wpn = {'contact':'listWpnContact', 'distance':'listWpnDistance', 'improvisees':'listWpnImprovisees'}[type]
      const dataWpn = type === 'improvisees' ? this.data[wpn][`bonus${this.data.idWpn}`][`${typeBonus}variable`][variable] : this.data[wpn][num].system[typeBonus].module.variable[variable];
      const paliers = dataWpn.selected.energie.paliers[fixeOrDice].findIndex(element => element === value);
      const module = this.data.isToken ? actor.token.actor.items.get(dataWpn.id) : game.actors.get(actor.id).items.get(dataWpn.id);
      const depense = paliers*energie;
      const update = {
        [`system.niveau.details.n${module.system.niveau.value}.bonus.${typeBonus}.variable.selected.${fixeOrDice}`]:value,
        [`system.niveau.details.n${module.system.niveau.value}.bonus.${typeBonus}.variable.selected.energie.${fixeOrDice}`]:depense,
      };

      dataWpn.selected[fixeOrDice] = value;
      dataWpn.selected.energie[fixeOrDice] = depense;

      module.update(update);
    });

    html.find('select.choixmain').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const actor = this.data.actor;
      const num = target.data("num");
      const listWpnContact = this.data.listWpnContact[num];
      const id = listWpnContact._id;

      if(this.data.isToken) actor.token.actor.items.get(id).update({['system.options2mains.actuel']:value});
      else game.actors.get(actor.id).items.get(id).update({['system.options2mains.actuel']:value});
    });

    html.find('select.choixmunition').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const isVehicule = this.data?.vehicule || undefined;
      const actor = isVehicule !== undefined ? this.data.vehicule : this.data.actor;
      const num = target.data("num");
      const niveau = target.data("niveau");
      const isTourelle = target?.data("tourelle") ?? false;
      const listWpnDistance = isTourelle ? this.data.listWpnTourelle[num] : this.data.listWpnDistance[num];
      const id = listWpnDistance._id;
      let item = {};

      if(this.data.isToken) {
        item = actor.token.actor.items.get(id);

        if(item.type === 'module') {
          item.update({[`system.niveau.details.n${niveau}.arme.optionsmunitions.actuel`]:value});
        } else {
          item.update({['system.optionsmunitions.actuel']:value});
        }
      }
      else {
        item = game.actors.get(actor.id).items.get(id);

        if(item.type === 'module') {
          item.update({[`system.niveau.details.n${niveau}.arme.optionsmunitions.actuel`]:value});
        } else {
          item.update({['system.optionsmunitions.actuel']:value});
        }
      }
    });

    html.find('div.longbow div.data div.effets div img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.data").width() / 2;
      const hasListe3 = this.data.longbow.effets.liste3.acces;
      const isListe2 = $(ev.currentTarget).parents("div.effets").hasClass('liste2');
      const wListe2 = $(ev.currentTarget).parents("div.effets").width() / 2;
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(hasListe3) {
        if(isListe2) {
          if($(ev.currentTarget).parent("div").position().left > wListe2) {
            position = "right";
            borderRadius = "border-top-right-radius";
          } else {
            position = "left";
            borderRadius = "border-top-left-radius";
          }
        } else {
          if($(ev.currentTarget).parents("div.effets").position().left > width) {
            position = "right";
            borderRadius = "border-top-right-radius";
          } else {
            position = "left";
            borderRadius = "border-top-left-radius";
          }
        }
      } else {
        if($(ev.currentTarget).parents("div.effets").position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    html.find('div.special div.data div.effets div img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.data").width() / 2;

      let position = "";
      let borderRadius = "border-top-right-radius";

      if($(ev.currentTarget).parents("div.effets").position().left > width) {
        position = "right";
        borderRadius = "border-top-right-radius";
      } else {
        position = "left";
        borderRadius = "border-top-left-radius";
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    html.find('div.longbow div.data select').change(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const cost = target.data("cost");
      const value = target.val();

      const data = this.data.longbow[type];
      let min;
      let cout = 0;

      if(type === 'portee') {
        const rangeToNumber = data.rangeToNumber;

        cout = rangeToNumber[value];

        data.value = value;
      } else {
        min = data.min+1;

        for(let i = min;i <= value;i++) {
          cout += cost;
        }

        data.dice = value;
      }

      data.cout = cout;
      this.render(true);
    });

    html.find('div.styleCombat select.selectStyle').change(async ev => {
      const style = $(ev.currentTarget).val();
      const actor = this.data.actor;

      await actor.update({['system.combat']:{
        style:style,
        data:{
          tourspasses:1,
          type:"degats"
        }
      }});

      this.setAct(game.actors.get(actor._id));
      this.render(true);
    });
  }

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param {MouseEvent} event    The left-mouse click event
   * @private
   */
   _onClickButton(event) {
    const id = event.currentTarget.dataset.button;
    const button = this.data.buttons[id];

    this._doRoll(event);
  }

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param {MouseEvent} event    The left-mouse click event
   * @private
   */
   _onClickEButton(event) {
    const id = event.currentTarget.dataset.button;
    const button = this.data.buttons[id];

    this._doRoll(event, true);
  }

  async _doRoll(event, entraide=false, attackOnly=false, dgtsOnly=false, violenceOnly=false, wpnId='', wpnType='', wpnName='', bonusTemp=false) {

    const data = this.data;
    const isPNJ = data?.pnj || false;
    const noOd = data?.noOd || false;
    const actor = data.actor;

    const idWpn = wpnId === '' ? data?.idWpn ?? '' : wpnId;
    const nameWpn = wpnName === '' ? data.nameWpn : wpnId;
    const typeWpn = wpnType === '' ? data.typeWpn : wpnType;
    const numWpn = data.num;

    const getCarac = this._getCarac(entraide);
    const otherC = getCarac.otherC;
    const carac = getCarac.carac;
    const od = getCarac.od;

    let totalDice = 0;
    let totalBonus = 0;

    if((idWpn != '' && idWpn != -1 && !entraide) || (typeWpn === 'grenades' && !entraide) || (typeWpn === 'longbow' && !entraide)) {
      if(typeWpn !== 'tourelle') totalDice += carac || 0;
      if(typeWpn !== 'tourelle' && !noOd && !isPNJ) totalBonus += od || 0;
      else if(typeWpn !== 'tourelle' && isPNJ) totalBonus += od || 0;
      totalDice += data.modificateur || 0;
      totalBonus += data.succesBonus || 0;

      const barrage = data?.barrage ?? false;
      const systemerefroidissement = data?.systemerefroidissement ?? false;
      const getWpn = this._getWpn(data, typeWpn, idWpn, nameWpn, numWpn);
      const wpn = getWpn.wpn;

      const energieSpecial = +wpn?.energie || 0;
      const espoirSpecial = +wpn?.espoir || 0;
      const otherWpnAttEffet = [];
      const listAllE = await this._getAllEffets(actor, wpn, typeWpn, isPNJ);
      const totalDepenseEnergie = listAllE.depenseEnergie+energieSpecial;

      let nRoll = listAllE.nRoll;
      let onlyDgts = dgtsOnly == false ? listAllE.onlyDgts : dgtsOnly;
      let onlyViolence = violenceOnly == false ? listAllE.onlyViolence : violenceOnly;
      let onlyAttack = attackOnly === false ? listAllE.onlyAttack : attackOnly;
      let barrageValue = listAllE.barrageValue;

      totalDice += getWpn.dice;
      totalBonus += getWpn.fixe;

      if(typeWpn !== 'tourelle' && !isPNJ) totalDice += getCaracValue(data.style.selected, actor, true);

      if(totalDepenseEnergie > 0) {
        const depense = await this._depensePE(actor, totalDepenseEnergie);

        if(!depense.has) {
          const msgEnergie = {
            flavor:`${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}`,
            main:{
              total:`${game.i18n.localize(`KNIGHT.JETS.Not${depense.type}`)}`
            }
          };

          const msgEnergieData = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
            sound: CONFIG.sounds.dice
          };

          ChatMessage.create(msgEnergieData);

          return;
        }
        otherWpnAttEffet.push(
          {
            name:`${game.i18n.localize(`KNIGHT.JETS.Depense${depense.type}`)} (${totalDepenseEnergie})`,
            desc:''
          }
        );
      }

      if(espoirSpecial > 0) {
        const depenseEspoir = this._depenseEspoir(actor, espoirSpecial);

        if(!depenseEspoir.has) {
          const msgEspoir = {
            flavor:`${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}`,
            main:{
              total:`${game.i18n.localize(`KNIGHT.JETS.Notespoir`)}`
            }
          };

          const msgEspoirData = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEspoir),
            sound: CONFIG.sounds.dice
          };

          ChatMessage.create(msgEspoirData);

          return;
        }
        otherWpnAttEffet.push(
          {
            name:`${game.i18n.localize(`KNIGHT.JETS.Depenseespoir`)} (${espoirSpecial})`,
            desc:''
          }
        );
      }

      totalDice += listAllE.attack.totalDice;
      totalBonus += listAllE.attack.totalBonus;

      for(let i = 0; i < nRoll;i++) {
        const addNum = nRoll > 1 ? ` n°${i+1}` : ``;
        let regularite = 0;
        let bonusViolence = 0;

        if(nRoll > 1 && !onlyAttack && !onlyDgts && !onlyViolence) {
          const rollMsgData = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: `<span style="display:block;width:100%;font-weight:bold;text-align:center;">--- ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}${addNum} ---</span>`
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);

          await ChatMessage.create(msgData, {
            rollMode:rMode
          });
        }

        if(!onlyDgts || !onlyViolence) {
          if(totalDice <= 0) totalDice = 1;
          let tgt = game.user?.targets?.ids?.[0] ?? undefined;
          let contactOrDistance = undefined;

          switch(typeWpn) {
            case 'tourelle':
            case 'longbow':
            case 'grenades':
            case 'distance':
              contactOrDistance = 'distance';
              break;

            case 'contact':
              contactOrDistance = 'contact';
              break;

            case 'armesimprovisees':
              if(idWpn === 'distance') contactOrDistance = 'distance';
              else if(idWpn === 'contact') contactOrDistance = 'contact';
              break;
          }

          let dataToAdd = {
            localDataWpn:wpn,
            otherC:otherC,
            carac:carac,
            od:od,
            isCapacite:wpn?.capacite ?? false,
            totalDice:totalDice,
            totalBonus:totalBonus,
            listAllE:listAllE,
            addNum:addNum,
            isBarrage:barrage,
            barrageValue:barrageValue,
            isSystemeRefroidissement:systemerefroidissement,
            addOtherEffects:otherWpnAttEffet,
            target:tgt,
            contactOrDistance:contactOrDistance,
          };

          const oldRoll = game.settings.get("knight", "oldRoll");

          if(!onlyAttack && !oldRoll) {
            if(!onlyViolence) {
              dataToAdd['btnDgts'] = JSON.stringify({
                label:data.label,
                dataWpn:wpn,
                listAllE:listAllE,
                addNum:addNum,
                target:tgt,
                style:data.style,
                pnj:data?.pnj ?? false,
                degatsBonus:data.degatsBonus,
                tenebricide:data?.tenebricide ?? false,
                actor:{
                  type:actor.type,
                  id:actor?.id ?? null,
                  token:{id:actor?.token?.id ?? null},
                  name: actor?.name ?? null,
                }
              });
            }

            if(!onlyDgts) {
              dataToAdd['btnViolence'] = JSON.stringify({
                label:data.label,
                dataWpn:wpn,
                listAllE:listAllE,
                addNum:addNum,
                bViolence:bonusViolence,
                violenceBonus:data.violenceBonus,
                target:tgt,
                style:data.style,
                pnj:data?.pnj ?? false,
                tenebricide:data?.tenebricide ?? false,
                actor:{
                  type:actor.type,
                  id:actor?.id ?? null,
                  token:{id:actor?.token?.id ?? null},
                  name: actor?.name ?? null,
                }
              });
            }
          }

          let attack = await doAttack(foundry.utils.mergeObject(data, dataToAdd));

          regularite += attack.regularite;

          if(oldRoll) {
            if(!onlyViolence) {
              let dataToAddDgts = {
                dataWpn:wpn,
                listAllE:listAllE,
                regularite:regularite,
                addNum:addNum,
                target:tgt,
                actor:actor,
              };

              if(attack.assAtk !== undefined) dataToAddDgts.assAtk = attack.assAtk;
              await doDgts(foundry.utils.mergeObject(data, dataToAddDgts));
            }

            if(!onlyDgts) {
              let dataToAddViolence = {
                dataWpn:wpn,
                listAllE:listAllE,
                addNum:addNum,
                bViolence:bonusViolence,
                target:tgt,
                actor:actor,
              };

              if(attack.assAtk !== undefined) dataToAddViolence.assAtk = attack.assAtk;

              await doViolence(foundry.utils.mergeObject(data, dataToAddViolence));
            }
          }
        }
      }
    } else {
      totalDice += carac || 0;

      if(!noOd && !isPNJ) {
        totalBonus += od || 0;
      } else if(isPNJ) {
        totalBonus += od || 0;
      }

      totalDice += data.modificateur || 0;
      totalBonus += data.succesBonus || 0;

      const capacite = isPNJ ? {roll:{fixe:0, string:''}} : await getCapacite(actor, '', data.base, data.autre, {raw:[], custom:[], liste:[]}, {raw:[], custom:[], liste:[]}, {raw:[], custom:[], liste:[]}, {raw:[], custom:[], liste:[]});

      totalBonus += capacite.roll.fixe;

      let sDetails;

      if(isPNJ) {
        sDetails = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Aspects')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ASPECTS.Exceptionnels')}) + ${data.succesBonus} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`
      } else if(noOd) {
        sDetails = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${data.succesBonus} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`;
      } else {
        sDetails = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ITEMS.ARMURE.Overdrive')}) + ${data.succesBonus} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`;
      }

      if(capacite.roll.string !== '') sDetails += ` +${capacite.roll.string}`;

      const exec = new game.knight.RollKnight(`${totalDice}d6+${totalBonus}`, actor.system);
      if(entraide) {
        exec._canExploit = false;
        exec._canEFail = false;
      }
      exec._success = true;
      exec._flavor = this.data.label;
      exec._base = isPNJ ? game.i18n.localize(CONFIG.KNIGHT.aspects[data.base]) : game.i18n.localize(CONFIG.KNIGHT.caracteristiques[data.base]);
      exec._autre = otherC;
      exec._difficulte = this.data.difficulte;
      exec._details = sDetails;
      await exec.toMessage({
        speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
        }
      });

      const withTable = this.data.withTable;
      const rTableLabel = this.data.rTableLabel;

      if(withTable && this.data.difficulte != false && !exec._isRollSuccess) {
        const rTable = new game.knight.RollKnight('2d6', actor.system);
        rTable._flavor = rTableLabel;
        rTable._success = false;
        rTable._table = true;
        rTable._tableau = this.data.tableau;

        await rTable.toMessage({
          speaker: {
          actor: actor?.id || null,
          token: actor?.token?.id || null,
          alias: actor?.name || null,
          }
        });
      }
    }

    if(this.hasBonusTemp) {
      await this.setModificateur(this.getModificateur()-this.getModificateurTemp());
      await this.setSuccesBonus(this.getSuccesBonus()-this.getSuccesBonusTemp());
      await this.setBonusTemp(false, 0, 0);

      this.render(true);
    }
  }

  async _getAllEffets(actor, dataWpn, typeWpn, isPNJ = false) {
    const idWpn = this.data?.idWpn || -1;
    const data = this.data;
    const style = isPNJ ? {raw:''} : this.data.style;
    const getStyle = isPNJ ? {} : getModStyle(style.raw);
    const options2mains = dataWpn?.options2mains || false;

    let effetsWpn = typeWpn === 'longbow' ? {raw:dataWpn.effets.base.raw.concat(dataWpn.effets.raw), custom:dataWpn.effets.base.custom.concat(dataWpn.effets.custom)} : dataWpn?.effets ?? {raw:[], custom:[]};

    if(typeWpn === 'contact' && options2mains !== false) {
      if(options2mains.has && options2mains.actuel === '2main') {effetsWpn = dataWpn.effets2mains;}
    }

    const capaciteName = dataWpn?.capaciteName || "";
    const distanceWpn = dataWpn?.distance || {raw:[], custom:[]};
    const ornementalesWpn = dataWpn?.ornementales || {raw:[], custom:[]};
    const structurellesWpn = dataWpn?.structurelles || {raw:[], custom:[]};

    let energieDgts = 0;
    let energieViolence = 0;
    const hasVariableDgts = dataWpn?.degats?.variable?.has || false;
    const hasVariableViolence = dataWpn?.violence?.variable?.has || false;
    const hasAddChair = dataWpn?.degats?.addchair || false;

    if(hasVariableDgts !== false) {
      energieDgts = dataWpn.degats.dice > dataWpn.degats.variable.min.dice ? (dataWpn.degats.dice-dataWpn.degats.variable.min.dice)*dataWpn.degats.variable.cout : 0;
    }

    if(hasVariableViolence !== false) {
      energieViolence = dataWpn.violence.dice > dataWpn.violence.variable.min.dice ? (dataWpn.violence.dice-dataWpn.violence.variable.min.dice)*dataWpn.violence.variable.cout : 0;
    }

    const bonusModule = getModuleBonus(actor, typeWpn, dataWpn, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, isPNJ);

    //ENERGIE DES MODULES
    energieDgts += bonusModule?.degats?.energie || 0;
    energieViolence += bonusModule?.violence?.energie || 0;

    const listEffets = await getEffets(actor, typeWpn, style.raw, data, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, isPNJ, energieDgts+energieViolence);
    const listDistance = await getDistance(actor, typeWpn, data, effetsWpn, distanceWpn, isPNJ);
    const listStructurelles = await getStructurelle (actor, typeWpn, style.raw, data, effetsWpn, structurellesWpn, isPNJ);
    const listOrnementale = await getOrnementale (actor, typeWpn, data, effetsWpn, ornementalesWpn, isPNJ);
    const listCapacites = await getCapacite(actor, typeWpn, data.base, data.autre, effetsWpn, structurellesWpn, ornementalesWpn, distanceWpn, isPNJ, idWpn);

    const lEffetAttack = listEffets.attack;
    const lEffetDegats = listEffets.degats;
    const lEffetViolence = listEffets.violence;
    const lEffetOther = listEffets.other;

    const lDistanceAttack = listDistance.attack;
    const lDistanceDegats = listDistance.degats;
    const lDistanceViolence = listDistance.violence;
    const lDistanceOther = listDistance.other;

    const lOrnementaleAttack = listOrnementale.attack;
    const lOrnementaleDegats = listOrnementale.degats;
    const lOrnementaleViolence = listOrnementale.violence;
    const lOrnementaleOther = listOrnementale.other;

    const lStructurellesAttack = listStructurelles.attack;
    const lStructurellesDegats = listStructurelles.degats;
    const lStructurellesViolence = listStructurelles.violence;
    const lStructurellesOther = listStructurelles.other;

    const lCapaciteAttack = listCapacites.attack;
    const lCapaciteDegats = listCapacites.degats;
    const lCapaciteViolence = listCapacites.violence;

    const lAttOtherInclude = [];
    const lDgtsOtherInclude = [];
    const lDgtsOtherList = [];
    const lViolenceOtherInclude = [];

    const typeStyle = style.type;
    const sacrificeStyle = +style.sacrifice;

    let rollAtt = [].concat(listEffets.rollAtt, listDistance.rollAtt, listStructurelles.rollAtt, listOrnementale.rollAtt);
    let rollDgts = [].concat(listEffets.rollDgts, listDistance.rollDgts, listStructurelles.rollDgts, listOrnementale.rollDgts);
    let rollViol = [].concat(listEffets.rollViol, listDistance.rollViol, listStructurelles.rollViol, listOrnementale.rollViol);

    let getAttackOtherDiceMod = isPNJ || (capaciteName === 'cea' && style.raw === 'ambidextre') || typeWpn === 'tourelle' ? 0 : getStyle.bonus.attaque-getStyle.malus.attaque;
    let getAttackSpecialDiceMod = 0;
    let getDgtsOtherDiceMod = 0;
    let getDgtsOtherFixeMod = 0;
    let getViolenceDiceMod = 0;
    let maximizeDgts = false;

    const baseForce = getCaracValue('force', actor, true);
    const force = getODValue('force', actor, true);
    const tir = getODValue('tir', actor, true);
    const combat = getODValue('combat', actor, true);
    const discretion = getCaracValue('discretion', actor, true);
    const discretionOD = getODValue('discretion', actor, true);

    const chair = +getAspectValue('chair', actor, true);
    const bete = +getAspectValue('bete', actor, true);
    const beteAE = getAEValue('bete', actor, true);

    // Base de Force pour les armes de contact
    if((typeWpn === 'contact' && baseForce > 0 && !isPNJ && capaciteName !== "cea") || (typeWpn === 'armesimprovisees' && this.data.idWpn === 'contact' && baseForce > 0 && !isPNJ && capaciteName !== "cea")) {
      const bForce = baseForce;
      getDgtsOtherFixeMod += bForce;

      lDgtsOtherInclude.push({
        name:`+${bForce} ${game.i18n.localize('KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.FORCE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    }

    // Si on doit ajouter chair divisé par 2... On ajoute chair divisé par 2.
    if((typeWpn === 'contact' && isPNJ && hasAddChair && chair > 0) || (typeWpn === 'armesimprovisees' && this.data.idWpn === 'contact' && chair > 0 && isPNJ && hasAddChair)) {
      getDgtsOtherFixeMod += Math.floor(chair/2);

      lDgtsOtherInclude.push({
        name:`+${chair/2} ${game.i18n.localize('KNIGHT.ASPECTS.CHAIR.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    }

    // STYLES
    if(typeWpn !== 'tourelle' && typeWpn !== 'armesimprovisees' && !isPNJ) {
      // AKIMBO
      const eAkimbo = effetsWpn.raw.find(str => { if(str.includes('jumeleakimbo')) return true; }) !== undefined ? true : false;
      const jumelageakimbo = typeWpn === 'distance' ? distanceWpn.raw.find(str => { if(str.includes('jumelageakimbo')) return true; }) : false;
      const jumelle = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('jumelle')) return true; }) : false;
      const eJAkimbo = searchTrueValue([eAkimbo, jumelageakimbo, jumelle]);

      if(style.raw === 'akimbo') {
        if(eJAkimbo) getAttackOtherDiceMod += 2;
        else if(typeWpn === 'distance' && tir >= 3) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODTir3')}`,
            desc:''
          });
        }
        else if(typeWpn === 'contact' && combat >= 3) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODCombat3')}`,
            desc:''
          });
        }
      }

      // AMBIDEXTRIE
      const eAmbidextrie = effetsWpn.raw.find(str => { if(str.includes('jumeleambidextrie')) return true; });
      const jumelageambidextrie = typeWpn === 'distance' ? distanceWpn.raw.find(str => { if(str.includes('jumelageambidextrie')) return true; }) : false;
      const soeur = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('soeur')) return true; }) : false;

      if(style.raw === 'ambidextre' && capaciteName !== 'cea') {
        if((eAmbidextrie && data.jumeleambidextrie)) getAttackOtherDiceMod += 2;
        else if(jumelageambidextrie && data.jumelageambidextrie) getAttackOtherDiceMod += 2;
        else if(soeur && data.soeur) getAttackOtherDiceMod += 2;
        else if(typeWpn === 'distance' && tir >= 4) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODTir4')}`,
            desc:''
          });
        }
        else if(typeWpn === 'contact' && combat >= 4) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODCombat4')}`,
            desc:''
          });
        }
      }

      // DEFENSIF
      const protectrice = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('protectrice')) return true; }) : false;

      if(style.raw === 'defensif' && protectrice) getAttackOtherDiceMod += 2;

      // A COUVERT
      const eTirEnSecurite = effetsWpn.raw.find(str => { if(str.includes('tirensecurite')) return true; });
      const interfaceGuidage = typeWpn === 'distance' ? distanceWpn.raw.find(str => { if(str.includes('interfaceguidage')) return true; }) : false;
      const eTSecurite = searchTrueValue([eTirEnSecurite, interfaceGuidage]);

      if(style.raw === 'acouvert' && eTSecurite) getAttackOtherDiceMod += 3;

      // PILONNAGE
      if(style.raw === 'pilonnage') {
        const valuePilonnage = Math.min(6, +style.tourspasses-1);

        switch(typeStyle) {
          case 'degats':
            lDgtsOtherInclude.push({
              name:`+${valuePilonnage}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getDgtsOtherDiceMod += valuePilonnage;
            break;

          case 'violence':
            lViolenceOtherInclude.push({
              name:`+${valuePilonnage}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getViolenceDiceMod += valuePilonnage;
            break;
        }
      }

      // PUISSANT
      if(style.raw === 'puissant') {
        getAttackOtherDiceMod -= sacrificeStyle;

        switch(typeStyle) {
          case 'degats':
            lDgtsOtherInclude.push({
              name:`+${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getDgtsOtherDiceMod += sacrificeStyle;
            break;

          case 'violence':
            lViolenceOtherInclude.push({
              name:`+${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getViolenceDiceMod += sacrificeStyle;
            break;
        }
      }

      // SUPPRESSION
      if(style.raw === 'suppression') {
        switch(typeStyle) {
          case 'degats':
            lDgtsOtherInclude.push({
              name:`-${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.SUPPRESSION.Info-short-degats')}`
            });

            getDgtsOtherDiceMod -= sacrificeStyle;
            break;

          case 'violence':
            lViolenceOtherInclude.push({
              name:`-${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.SUPPRESSION.Info-short-violence')}`
            });

            getViolenceDiceMod -= sacrificeStyle;
            break;
        }
      }
    }

    // OD Force
    if(typeWpn === 'contact' && force > 0 && !isPNJ && capaciteName !== "cea") {
      const bVForce = force > 5 ? (5 * 3) + ((force - 5) * 1) : force * 3;
      getDgtsOtherFixeMod += bVForce;

      lDgtsOtherInclude.push({
        name:`+${bVForce} ${game.i18n.localize('KNIGHT.JETS.ODForce')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    } else if(typeWpn === 'armesimprovisees' && this.data.idWpn === 'contact' && !isPNJ && !this.data.ma) {
      const bVForce = force > 5 ? (5 * 3) + ((force - 5) * 1) : force * 3;
      getDgtsOtherFixeMod += bVForce;

      lDgtsOtherInclude.push({
        name:`+${bVForce} ${game.i18n.localize('KNIGHT.JETS.ODForce')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    }

    // OD Discrétion
    if(typeWpn !== 'tourelle' && !isPNJ) {
      if(discretionOD >= 2 && discretionOD < 5) {
        lDgtsOtherList.push({
          name:`+${game.i18n.localize('KNIGHT.JETS.ODDiscretion')}`,
          total:`${discretion}`,
          desc:`${game.i18n.localize('KNIGHT.JETS.AttaqueSurprise')}`
        });
      } else if(discretionOD >= 5) {
        lDgtsOtherList.push({
          name:`+${game.i18n.localize('KNIGHT.JETS.ODDiscretion')}`,
          total:`${discretion+discretionOD}`,
          desc:`${game.i18n.localize('KNIGHT.JETS.AttaqueSurprise')}`
        });
      }
    }

    // MECHAARMURE
    if((typeWpn === 'base' && this.data.ma) || (typeWpn === 'c1' && this.data.ma) || (typeWpn === 'c2' && this.data.ma) || (typeWpn === 'armesimprovisees' && this.data.ma)) {
      const actor = this.data.isToken ? this.data.actor : game.actors.get(this.data.actor.id);
      const puissance = +actor.system.puissance.value;
      getAttackSpecialDiceMod += puissance;

      lAttOtherInclude.push({
        name:`+${puissance}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize('KNIGHT.MECHAARMURE.Puissance')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });

      const modulesBase = actor.system.configurations.liste.base.modules;
      const modulesC1 = actor.system.configurations.liste.c1.modules;
      const modulesC2 = actor.system.configurations.liste.c2.modules;

      for (let [key, module] of Object.entries(modulesBase)) {
        switch(key) {
          case 'moduleWraith':
            if(module.active) {
              getAttackSpecialDiceMod += discretion+discretionOD;
              getDgtsOtherFixeMod += discretion;

              lAttOtherInclude.push({
                name:`+${discretion+discretionOD}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              lDgtsOtherInclude.push({
                name:`+${discretion}  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              if(this.data.moduleWraith) {
                maximizeDgts = true;
              }
            }
            break;
        }
      };

      for (let [key, module] of Object.entries(modulesC1)) {

        switch(key) {
          case 'moduleWraith':
            if(module.active) {
              getAttackSpecialDiceMod += discretion+discretionOD;
              getDgtsOtherFixeMod += discretion;

              lAttOtherInclude.push({
                name:`+${discretion+discretionOD}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              lDgtsOtherInclude.push({
                name:`+${discretion}  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              if(this.data.moduleWraith) {
                maximizeDgts = true;
              }
            }
            break;
        }
      };

      for (let [key, module] of Object.entries(modulesC2)) {
        switch(key) {
          case 'moduleWraith':
            if(module.active) {
              getAttackSpecialDiceMod += discretion+discretionOD;
              getDgtsOtherFixeMod += discretion;

              lAttOtherInclude.push({
                name:`+${discretion+discretionOD}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              lDgtsOtherInclude.push({
                name:`+${discretion}  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              if(this.data.moduleWraith) {
                maximizeDgts = true;
              }
            }
            break;
        }
      };
    }

    // Aspects Exceptionnels
    if(typeWpn !== 'tourelle' && isPNJ && typeWpn === 'contact') {
      const bAEMajeur = +beteAE.majeur;
      const bAEMineur = +beteAE.mineur;

      if(bAEMineur > 0 && bAEMajeur === 0) {
        lDgtsOtherInclude.push({
          name:`+${bAEMineur} ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:``
        });

        getDgtsOtherFixeMod += bAEMineur;
      } else if(bAEMajeur > 0) {
        lDgtsOtherInclude.push({
          name:`+${bAEMineur+bAEMajeur+bete} ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:``
        });

        getDgtsOtherFixeMod += bAEMineur+bAEMajeur+bete;
      }
    }

    // ATTAQUE
    const attackDice = lEffetAttack.totalDice+lDistanceAttack.totalDice+lStructurellesAttack.totalDice+lOrnementaleAttack.totalDice+lCapaciteAttack.dice+bonusModule.attack.dice+getAttackOtherDiceMod+getAttackSpecialDiceMod;
    const attackBonus = lEffetAttack.totalBonus+lDistanceAttack.totalBonus+lStructurellesAttack.totalBonus+lOrnementaleAttack.totalBonus+lCapaciteAttack.fixe+bonusModule.attack.fixe;
    const attackInclude = lEffetAttack.include.concat(lDistanceAttack.include, lStructurellesAttack.include, lOrnementaleAttack.include, lAttOtherInclude, lCapaciteAttack.include, bonusModule.attack.include);
    const attackList = lEffetAttack.list.concat(lDistanceAttack.list, lStructurellesAttack.list, lOrnementaleAttack.list, lCapaciteAttack.list);

    // DEGATS
    const degatsDice = lEffetDegats.totalDice+lDistanceDegats.totalDice+lStructurellesDegats.totalDice+lOrnementaleDegats.totalDice+lCapaciteDegats.dice+getDgtsOtherDiceMod;
    const degatsBonus = lEffetDegats.totalBonus+lDistanceDegats.totalBonus+lStructurellesDegats.totalBonus+lOrnementaleDegats.totalBonus+lCapaciteDegats.fixe+getDgtsOtherFixeMod;
    const degatsInclude = lEffetDegats.include.concat(lDistanceDegats.include, lStructurellesDegats.include, lOrnementaleDegats.include, lDgtsOtherInclude, lCapaciteDegats.include, bonusModule.degats.include);
    const degatsList = lEffetDegats.list.concat(lDistanceDegats.list, lStructurellesDegats.list, lOrnementaleDegats.list, lDgtsOtherList, lCapaciteDegats.list);
    const minMaxDgts = maximizeDgts ? {
      minimize:false,
      maximize:true,
      async:true} : lEffetDegats.minMax;

    // VIOLENCE
    const violenceDice = lEffetViolence.totalDice+lDistanceViolence.totalDice+lStructurellesViolence.totalDice+lOrnementaleViolence.totalDice+lCapaciteViolence.dice+getViolenceDiceMod;
    const violenceBonus = lEffetViolence.totalBonus+lDistanceViolence.totalBonus+lStructurellesViolence.totalBonus+lOrnementaleViolence.totalBonus+lCapaciteViolence.fixe;
    const violenceInclude = lEffetViolence.include.concat(lDistanceViolence.include, lStructurellesViolence.include, lOrnementaleViolence.include, lViolenceOtherInclude, lCapaciteViolence.include, bonusModule.violence.include);
    const violenceList = lEffetViolence.list.concat(lDistanceViolence.list, lStructurellesViolence.list, lOrnementaleViolence.list, lCapaciteViolence.list);
    const minMaxViolence = lEffetViolence.minMax;

    // AUTRE
    const other = lEffetOther.concat(lDistanceOther, lStructurellesOther, lOrnementaleOther);

    // STYLE
    if(getAttackOtherDiceMod > 0) {
      attackInclude.push({
        name:`+${getAttackOtherDiceMod}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:''
      });
    } else if(getAttackOtherDiceMod < 0) {
      attackInclude.push({
        name:`${getAttackOtherDiceMod}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:''
      });
    }

    attackInclude.sort(SortByName);
    attackList.sort(SortByName);
    degatsInclude.sort(SortByName);
    degatsList.sort(SortByName);
    violenceInclude.sort(SortByName);
    violenceList.sort(SortByName);
    other.sort(SortByName);

    const merge = {
      attack:{
        totalDice:attackDice,
        totalBonus:attackBonus,
        include:attackInclude,
        list:attackList
      },
      degats:{
        totalDice:degatsDice,
        totalBonus:degatsBonus,
        include:degatsInclude,
        list:degatsList,
        minMax:minMaxDgts,
      },
      violence:{
        totalDice:violenceDice,
        totalBonus:violenceBonus,
        include:violenceInclude,
        list:violenceList,
        minMax:minMaxViolence,
      },
      other:other
    };

    const nRoll = Math.max(listEffets.nRoll, listDistance.nRoll, listStructurelles.nRoll, listOrnementale.nRoll);

    const result = {
      guidage:listEffets.guidage,
      regularite:listEffets.regularite,
      bourreau:listEffets.bourreau,
      bourreauValue:listEffets.bourreauValue,
      devastation:listEffets.devastation,
      devastationValue:listEffets.devastationValue,
      barrageValue:listEffets.barrageValue,
      depenseEnergie:listEffets.depenseEnergie,
      onlyAttack:listEffets.onlyAttack,
      onlyDgts:listEffets.onlyDgts,
      onlyViolence:listEffets.onlyViolence,
      nRoll:nRoll,
      attack:merge.attack,
      degats:merge.degats,
      degatsModules:{
        dice:bonusModule.degats.dice,
        fixe:bonusModule.degats.fixe
      },
      violenceModules:{
        dice:bonusModule.violence.dice,
        fixe:bonusModule.violence.fixe
      },
      violence:merge.violence,
      other:merge.other,
      rollAtt:rollAtt,
      rollDgts:rollDgts,
      rollViol:rollViol,
    };

    return result;
  }

  _onSelectCaracteristique(event) {
    const target = $(event.currentTarget);
    const select = target.data("select");
    const isPNJ = this.data.pnj;

    if(isPNJ) {
      if(target.hasClass('base')) {
        this.data.base = '';
      } else {
        this.data.base = select;
      }
    } else {
      const lock = this.data.lock;
      const autre = Array.isArray(this.data.autre) ? this.data.autre : [];

      if(!target.hasClass('lock')) {
        if(target.hasClass('base')) {
          if(autre.length > 0) {
            const nAutre = [];
            let nBase = '';

            for(let i = 0;i < autre.length;i++) {
              if(lock.includes(autre[i])) {
                nAutre.push(autre[i]);
              } else if(nBase === '') {
                nBase = autre[i];
              } else {
                nAutre.push(autre[i]);
              }
            }

            this.data.base = nBase;
            this.data.autre = nAutre;
          } else {
            this.data.base = '';
          }
        } else if(target.hasClass('selected')) {
          this.data.autre = autre.filter(carac => carac != select);
        } else if(this.data.base === '' && !autre.includes(select)) {
          this.data.base = select;
        } else if(this.data.base !== '' && !autre.includes(select)) {
          autre.push(select);
          this.data.autre = autre;
        }
      }
    }

    this.render(true);
  }

  _onSelectCaracStyle(event) {
    const target = $(event.currentTarget);
    const select = target.data("select");

    if(target.hasClass('selected')) {
      this.data.style.selected = '';
    } else {
      this.data.style.selected = select;
    }

    this.render(true);
  }

  _onSelectWpn(event) {
    const target = $(event.currentTarget);
    const id = target.data("id");
    const type = target.data("type");
    const name = target.data("name");
    const num = target.data("num");
    const caracteristiques = target?.data("caracteristiques")?.split(',') || [];
    const aspect = target?.data("aspect") || '';

    const actId = this.data.idWpn;
    const actName = this.data.nameWpn;
    const actType = this.data.typeWpn;
    const actNum = this.data.num;
    const isPnj = this.data.pnj;

    if(type === 'armesimprovisees') {
      if(id === actId && type === actType && name === actName && num === actNum) {
        this.data.idWpn = '';
        this.data.nameWpn = '';
        this.data.typeWpn = '';
        this.data.num = -1;
      } else {
        this.data.label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
        this.data.idWpn = id;
        this.data.nameWpn = name;
        this.data.typeWpn = type;
        this.data.num = num;

        if(caracteristiques.length > 0 && !isPnj) {
          this.data.base = caracteristiques[0];
          this.data.autre = [caracteristiques[1]];
        }

        if(aspect !== '' && isPnj) {
          this.data.base = aspect;
        }
      }
    } else if(id === actId && type === actType && name === actName) {
      this.data.idWpn = '';
      this.data.nameWpn = '';
      this.data.typeWpn = '';
      this.data.num = -1;
    } else {
      this.data.label = name;
      this.data.idWpn = id;
      this.data.nameWpn = name;
      this.data.typeWpn = type;
      this.data.num = num;
    }

    this.data.cadence = false;
    this.data.chambredouble = false;
    this.data.chromeligneslumineuses = false;
    this.data.barrage = false;
    this.data.systemerefroidissement = false;
    this.data.guidage = false;
    this.data.tenebricide = false;
    this.data.obliteration = false;
    this.data.cranerieur = false;
    this.data.jumeleambidextrie = true;
    this.data.soeur = true;
    this.data.jumelageambidextrie = true;
    this.data.noOd = false;

    this.render(true);
  }

  _onSelectGrenades(event) {
    const target = $(event.currentTarget);
    const type = target.data("type");
    const name = target.data("name");

    const actName = this.data.nameWpn;
    const actType = this.data.typeWpn;
    const data = this.data?.listGrenades?.[name];

    const effetsRaw = data?.effets?.raw || [];
    const barrage = effetsRaw.find(str => { if(str.includes('barrage')) return true; });

     if(type === actType && name === actName) {
      this.data.idWpn = '';
      this.data.nameWpn = '';
      this.data.typeWpn = '';
      this.data.num = -1;
    } else {
      this.data.label = data.custom ? `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${data.label}` : `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;
      this.data.idWpn = '';
      this.data.nameWpn = name;
      this.data.typeWpn = type;
      this.data.num = '';
    }

    this.data.cadence = false;
    this.data.chambredouble = false;
    this.data.chromeligneslumineuses = false;
    this.data.barrage = barrage;
    this.data.systemerefroidissement = false;
    this.data.guidage = false;
    this.data.tenebricide = false;
    this.data.obliteration = false;
    this.data.cranerieur = false;
    this.data.jumeleambidextrie = true;
    this.data.soeur = true;
    this.data.jumelageambidextrie = true;
    this.data.noOd = false;

    this.render(true);
  }

  _onSelectLongbow(event) {
    const target = $(event.currentTarget);
    const type = target.data("type");
    const name = target.data("name");

    const actName = this.data.nameWpn;
    const actType = this.data.typeWpn;

    if(type === actType && name === actName) {
      this.data.idWpn = -1;
      this.data.nameWpn = '';
      this.data.typeWpn = '';
      this.data.num = -1;
      this.data.longbow.cout = 0;
      this.data.longbow.degats.dice = this.data.longbow.degats.min;
      this.data.longbow.violence.dice = this.data.longbow.violence.min;
      this.data.longbow.portee.value = this.data.longbow.portee.min;
      this.data.longbow.portee.raw = [];
    } else {
      this.data.label = `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label`)}`;
      this.data.idWpn = -1;
      this.data.nameWpn = name;
      this.data.typeWpn = type;
      this.data.num = '';
    }

    this.data.cadence = false;
    this.data.chambredouble = false;
    this.data.chromeligneslumineuses = false;
    this.data.barrage = false;
    this.data.systemerefroidissement = false;
    this.data.guidage = false;
    this.data.tenebricide = false;
    this.data.obliteration = false;
    this.data.cranerieur = false;
    this.data.jumeleambidextrie = true;
    this.data.soeur = true;
    this.data.jumelageambidextrie = true;
    this.data.noOd = false;

    this.render(true);
  }

  _onSelectEffetsLongbow(event) {
    const target = $(event.currentTarget);
    const raw = target.data("raw");
    const cout = +target.data("cost");
    const liste = target.data("liste");
    const nbre = +target.data("selectedonlist") || 0;

    const effetsRaw = this.data.longbow.effets.raw;
    const hasEffet = effetsRaw.find(str => { if(str.includes(raw)) return true; });

    const coutActuel = +this.data.longbow.effets[liste].cout;

    if(hasEffet) {
      for( let i = 0; i < effetsRaw.length; i++){

        if (effetsRaw[i] === raw) {

          effetsRaw.splice(i, 1);
        }
      }

      this.data.longbow.effets[liste].cout = coutActuel - cout;
      this.data.longbow.effets[liste].selected = nbre - 1;
    } else if(nbre < 3) {
      effetsRaw.push(raw);
      this.data.longbow.effets[liste].cout = coutActuel + cout;
      this.data.longbow.effets[liste].selected = nbre + 1;
    }

    this.data.noOd = false;

    this.render(true);
  }

  _onSelectEffetsSpecial(event) {
    const target = $(event.currentTarget);
    const num = target.data("num");
    const raw = target.data("raw");
    const cout = +target.data("cost");
    const liste = target.data("liste");

    const effetsRaw = this.data.listWpnSpecial[num].effets.raw;
    const hasEffet = effetsRaw.find(str => { if(str.includes(raw)) return true; });

    const coutActuel = +this.data.listWpnSpecial[num].energie;

    if(hasEffet) {
      for( let i = 0; i < effetsRaw.length; i++){

        if (effetsRaw[i] === raw) {

          effetsRaw.splice(i, 1);
        }
      }


      this.data.listWpnSpecial[num].energie = coutActuel - cout;
    } else {
      effetsRaw.push(raw);
      this.data.listWpnSpecial[num].energie = coutActuel + cout;
    }

    this.data.noOd = false;

    this.render(true);
  }

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param {Object} button     The configuration of the chosen button
   * @private
   */
   submit(button) {
    try {
      if (button.callback) button.callback(this.options.jQuery ? this.element : this.element[0]);
      this.close();
    } catch(err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }

  /** @inheritdoc */
  async close(options) {
    const isPNJ = this.data.pnj;
    const isMA = this.data.ma;
    const actor = this.data.actor;

    const succesBonus = this.data.succesBonus || 0;
    const modificateur = this.data.modificateur || 0;
    const degatsDice = this.data.degatsBonus?.dice || 0;
    const degatsFixe = this.data.degatsBonus?.fixe || 0;
    const violenceDice = this.data.violenceBonus?.dice || 0;
    const violenceFixe = this.data.violenceBonus?.fixe || 0;
    const sacrifice = this.data?.style?.sacrifice || 0;
    const tourspasses = this.data?.style?.tourspasses || 0;

    const update = isPNJ ? {
      system:{
        combat:{
          data:{
            succesbonus:succesBonus,
            modificateur:modificateur,
            degatsbonus:{
              dice:degatsDice,
              fixe:degatsFixe
            },
            violencebonus:{
              dice:violenceDice,
              fixe:violenceFixe
            }
          }
        },
        knightRoll:{
          id:false
        }
      }
    } : {
      system:{
        combat:{
          data:{
            succesbonus:succesBonus,
            modificateur:modificateur,
            sacrifice:sacrifice,
            tourspasses:tourspasses,
            degatsbonus:{
              dice:degatsDice,
              fixe:degatsFixe
            },
            violencebonus:{
              dice:violenceDice,
              fixe:violenceFixe
            }
          }
        },
        knightRoll:{
          id:false
        }
      }
    }

    if(this.data.isToken) await actor.update(update);
    else await game.actors.get(actor.id).update(update);

    if(!isMA) {
      const listWpnContact = this.data.listWpnContact || [];
      const listWpnDistance = this.data.listWpnDistance || [];

      for(let i = 0;i < listWpnContact.length;i++) {
        const data = listWpnContact[i];
        const type = data.type;
        const dgts = data.system.degats;
        const violence = data.system.violence;

        switch(type) {
          case 'module':
            const items = this.data.isToken ? actor.token.actor.items.get(data._id) : game.actors.get(actor.id).items.get(data._id);

            if(dgts.variable.has) {
              items.update({[`system.arme.degats.dice`]:dgts.dice});
            }

            if(violence.variable.has) {
              items.update({[`system.arme.violence.dice`]:violence.dice});
            }
            break;
        }
      }

      for(let i = 0;i < listWpnDistance.length;i++) {
        const data = listWpnDistance[i];
        const type = data.type;
        const dgts = data.system.degats;
        const violence = data.system.violence;

        switch(type) {
          case 'module':
            const items = this.data.isToken ? actor.token.actor.items.get(data._id) : game.actors.get(actor.id).items.get(data._id);

            if(dgts?.variable?.has || false) {
              items.update({[`system.arme.degats.dice`]:dgts.dice});
            }

            if(violence?.variable?.has || false) {
              items.update({[`system.arme.violence.dice`]:violence.dice});
            }
            break;
        }
      }
    }

    if ( this.data.close ) this.data.close(this.options.jQuery ? this.element : this.element[0]);
    $(document).off('keydown.chooseDefault');
    return super.close(options);
  }

  async _depensePE(actor, depense) {
    const isMA = this.data?.ma || false;
    const armure = await getArmor(actor);
    const getArmure = actor.type === "knight" ? armure.system : actor.system;
    const remplaceEnergie = isMA ? false : getArmure?.espoir?.remplaceEnergie ?? false;
    const type = remplaceEnergie ? 'espoir' : 'energie';
    const hasJauge = isMA || actor.type !== "knight" ? true : actor.system.jauges[type];

    if(!hasJauge) return {
      has:false,
      type:type
    };

    const coutCalcule = (remplaceEnergie && getArmure.espoir.cout > 0 && type === 'module') ? Math.floor(depense / getArmure.espoir.cout) : depense;
    const actuel = remplaceEnergie ? +actor.system.espoir.value : +actor.system.energie.value;
    const substract = actuel-coutCalcule;

    if(substract < 0) {
      return {
        has:false,
        type:type
      };
    } else {
      let update = {
        system:{
          [type]:{
            value:substract
          }
        }
      }

      if(type === 'espoir' && actor.system.espoir.perte.saufAgonie) {
        update.system.espoir.value = actuel;
      }

      actor.update(update);

      return {
        has:true,
        type:type
      };
    }
  }

  _depenseEspoir(actor, depense) {
    const type = 'espoir';
    const hasJauge = actor.system.jauges[type];

    if(!hasJauge) return {
      has:false,
      type:type
    };

    const actuel = +actor.system.espoir.value;
    const substract = actuel-depense;

    if(substract < 0) {
      return {
        has:false,
        type:type
      };
    } else {
      let update = {
        system:{
          [type]:{
            value:substract
          }
        }
      }

      if(type === 'espoir' && actor.system.espoir.perte.saufAgonie) {
        update.system.espoir.value = actuel;
      }

      actor.update(update);

      return {
        has:true,
        type:type
      };
    }
  }

  _getCarac(entraide) {
    const data = this.data;
    const actor = data.actor;
    const base = data.base;
    const autre = data.autre;
    const isPNJ = data?.pnj || false;
    const isMA = data?.ma || false;
    const noOd = data?.noOd || false;

    let carac = 0;
    let od = 0;
    let otherC = [];

    if(isPNJ) {
      const PNJAE = getAEValue(base, actor, true);
      carac = getAspectValue(base, actor, true);
      od = Number(PNJAE.mineur)+Number(PNJAE.majeur);
    }
    else if(isMA) {
      carac = getCaracPiloteValue(base, actor, true);
      od = !noOd ? getODPiloteValue(base, actor, true) : 0;
    }
    else {
      carac = getCaracValue(base, actor, true);
      od = !noOd ? getODValue(base, actor, true) : 0;
    }

    if(!entraide && !isPNJ) {
      for(let i = 0;i < autre.length;i++) {
        if(isMA) {
          carac += getCaracPiloteValue(autre[i], actor, true);
          od += !noOd ? getODPiloteValue(autre[i], actor, true) : 0;
        } else {
          carac += getCaracValue(autre[i], actor, true);
          od += !noOd ? getODValue(autre[i], actor, true) : 0;
        }

        otherC.push(game.i18n.localize(CONFIG.KNIGHT.caracteristiques[autre[i]]));
      }
    }

    return {od:od, carac:carac, otherC:otherC}
  }

  _getWpn(data, typeWpn, idWpn, nameWpn, numWpn) {
    const allWpn = {
      'base':data.listWpnMA,
      'special':data.listWpnSpecial,
      'contact':data.listWpnContact,
      'distance':data.listWpnDistance,
      'tourelle':data.listWpnTourelle,
      'grenades':data.listGrenades,
      'longbow':data.longbow,
      'armesimprovisees':data.listWpnImprovisees,
    };

    let nWpn = typeWpn === 'c1' || typeWpn === 'c2' ? 'base' : typeWpn;
    let wpn = allWpn[nWpn];
    let bonusDice = 0;
    let bonusFixe = 0;

    switch(nWpn) {
      case 'base':
      case 'special':
        wpn = wpn.find(itm => itm._id === idWpn);
        break;

      case 'contact':
      case 'distance':
        wpn = wpn.find(itm => itm._id === idWpn && itm.name.includes(nameWpn)).system;
        break;

      case 'tourelle':
        wpn = wpn.find(itm => itm._id === idWpn).system;
        bonusDice += Number(wpn.tourelle.attaque.dice);
        bonusFixe += Number(wpn.tourelle.attaque.fixe);
        break;

      case 'grenades':
        const nbreGrenade = data.actor.system.combat.grenades.quantity.value;

        if(data.isToken) data.actor.update({['system.combat.grenades.quantity.value']:Math.max(nbreGrenade-1, 0)});
        else game.actors.get(data.actor._id).update({['system.combat.grenades.quantity.value']:Math.max(nbreGrenade-1, 0)});

        wpn = data.listGrenades[nameWpn];
        break;

      case 'longbow':
        wpn = data.longbow;
        break;

      case 'armesimprovisees':
        if(idWpn === 'contact') wpn = foundry.utils.mergeObject(data.listWpnImprovisees[idWpn][nameWpn].liste[numWpn], {
          degats:{
            module:{
              fixe:data.listWpnImprovisees.bonuscontact.degatsfixe,
              variable:data.listWpnImprovisees.bonuscontact.degatsvariable,
            }
          },
          violence:{
            module:{
              fixe:data.listWpnImprovisees.bonuscontact.violencefixe,
              variable:data.listWpnImprovisees.bonuscontact.violencevariable,
            }
          }
        });
        else wpn = data.listWpnImprovisees[idWpn][nameWpn].liste[numWpn];
        break;
    }

    return {wpn:wpn, dice:bonusDice, fixe:bonusFixe};
  }
}
