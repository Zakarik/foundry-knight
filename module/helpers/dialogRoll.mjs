import {
  SortByName,
  actorIsPj,
  getCaracValue,
  getODValue,
  getNestedPropertyValue,
  getArmor,
} from "./common.mjs";

function normalizeTxt(str) {
  const element = document.createElement("div");
  element.innerHTML = str;
  let decodedString = element.innerText;

  let lC = decodedString.toLowerCase();
  let wTiret = lC.replace("-", "");
  let NFD = wTiret.normalize('NFD');
  let wAcc = NFD.replace(/[\u0300-\u036f]/g, '');
  let ASCII = wAcc.replace(/[^\x00-\x7F]/g, '');

  return ASCII;
}

function containsWord(text, words) {
  for (let i = 0; i < words.length; i++) {
    if (text.includes(words[i])) {
      return true;
    }
  }
  return false;
}

export function getKnightRoll(actor, hasEntraide=true) {
  const nActor = actor?._id ?? 1;;
  const filterInstance = Object.values(ui.windows).filter((app) => app instanceof game.knight.applications.KnightRollDialog);
  let hasInstance = undefined;
  let isExist = false;

  for(let i of filterInstance) {
    const iActor = i?.data?.actor?._id ?? 0;

    if(iActor === nActor) {
      isExist = true;
      hasInstance = i;
    }
  }

  let result = {};

  if(hasEntraide) {
    result = hasInstance ?? new game.knight.applications.KnightRollDialog({
      title:actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
      buttons: {
        button1: {
          label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
          callback: async () => {},
          icon: `<i class="fas fa-dice"></i>`
        },
        button2: {
          label: game.i18n.localize("KNIGHT.JETS.JetEntraide"),
          callback: async () => {},
          icon: `<i class="fas fa-dice-d6"></i>`
        },
        button3: {
          label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    });
  } else {
    result = hasInstance ?? new game.knight.applications.KnightRollDialog({
      title:actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
      buttons: {
        button1: {
          label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
          callback: async () => {},
          icon: `<i class="fas fa-dice"></i>`
        },
        button3: {
          label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    });
  }

  return {instance:result, previous:isExist};
}

/*
DATA :
- (string) base : Base du jet
- (array) autre : Autres caractéristiques
- (array) lock : Caractéristiques verrouillées
- (int) difficulte : Difficulté du jet

- (booleen) isWpn : Est une arme
- (string) idWpn : ID de l'arme
- (string) nameWpn : Nom de l'arme
- (string) typeWpn : Type de l'arme (contact, distance, tourelle, armesimprovisees - l'idWpn sera soit 'contact', soit 'distance' dans ce cas, longbow, grenades)
- (int) num : Numéro de l'arme dans l'array

- (booleen) noOd : Si les OD doivent être désactivés ou non

- (int) modificateurTemp : S'il y a un modificateurs (en dés) temporaire au jet
- (int) succesTemp : S'il y a un modificateurs (en succès) temporaire au jet

- (int) modificateur : Modificateur non temporaire (en dés).
- (int) succesBonus : Modificateur non temporaire (en succès).
- (int) degatsDice : Modificateur non temporaire (en dés) aux dégâts.
- (int) degatsFixe : Modificateur non temporaire (fixe) aux dégâts.
- (int) violenceDice : Modificateur non temporaire (en dés) en violence.
- (int) violenceFixe : Modificateur non temporaire (fixe) en violence.
*/
export function actualiseRoll(actor) {
  const filterInstance = Object.values(ui.windows).filter((app) => app instanceof game.knight.applications.KnightRollDialog);
  const nActor = actor?._id ?? 1;
  let toActualise = undefined;

  for(let i of filterInstance) {
    const iActor = i?.data?.actor?._id ?? 0;

    if(iActor === nActor) {
      toActualise = i;
    }
  }

  if(toActualise !== undefined) toActualise.actualise(actor);
}

export function dialogRoll(label, actor, data={}) {
    const queryInstance = getKnightRoll(actor, actorIsPj(actor));
    const rollApp = queryInstance.instance;

    rollApp.setLabel(label);
    rollApp.setAct(actor);
    rollApp.setR(data);
    rollApp.render(true);

    if(queryInstance.previous) rollApp.bringToTop();
}

export async function dialogRollWId(actorId, sceneId, tokenId, data={}, bonusToAdd={}, special={}) {
    const isWpn = data?.isWpn ?? false;
    const typeWpn = data?.typeWpn ?? "";
    const actor = tokenId === "null" ? game.actors.get(actorId) : game.scenes.get(sceneId).tokens.find(token => token.id === tokenId).actor;
    const modificateur = bonusToAdd?.modificateur ?? "";
    const autre = bonusToAdd?.autre ?? "";
    const type = special?.type ?? "";
    const hasShift = special?.event?.shiftKey ?? false;
    const wear = actor.system.wear;
    const onlyArmor = ['longbow', 'cea', 'module'];
    let getWpn;
    let vehicule = false;
    let tireur = "";
    let label = "";
    let actProcessed = {};
    let listWpn = {};
    let keys = {};
    let filterWpn = {};
    let queryInstance;
    let rollApp;

    if(onlyArmor.includes(type) && (wear !== 'armure' || actor.type !== 'knight')) return;

    if((type === "espoir" && !hasShift) || type !== "espoir") {
      queryInstance = vehicule ? getKnightRoll(tireur, actorIsPj(tireur)) : getKnightRoll(actor, actorIsPj(actor));
      rollApp = queryInstance.instance;

      if(vehicule) actProcessed = rollApp.setAct(tireur);
      else actProcessed = rollApp.setAct(actor);
    }

    switch(type) {
      case 'caracteristique':
        label = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[data.base]);
      break;

      case 'aspect':
        label = game.i18n.localize(CONFIG.KNIGHT.aspects[data.base]);
      break;

      case 'espoir':
        label = game.i18n.localize("KNIGHT.JETS.JetEspoir");
      break;

      case 'wpn':
        label = actor.items.get(data.idWpn).name;
      break;

      case 'longbow':
        label = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label");
      break;

      case 'grenade':
        const grenades = actor.system.combat.grenades.liste[data.nameWpn];
        if(grenades.custom) label = grenades.label;
        else label = game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${data.nameWpn.toString().charAt(0).toUpperCase()+data.nameWpn.toString().substr(1)}`);
      break;

      case 'cea':
        if(data.typeWpn === 'distance') listWpn = actProcessed.listWpnDistance;
        else if(data.typeWpn === 'contact') listWpn = actProcessed.listWpnContact;
        keys = Object.keys(listWpn);
        filterWpn = keys.find(key => listWpn[key].system.subCapaciteName === data.nameWpn);

        label = listWpn[filterWpn].name;
        data['nameWpn'] = listWpn[filterWpn].name;
        data['num'] = filterWpn;
      break;

      case 'special':
        if(special.data === 'mechaarmure') {
          keys = actProcessed.listWpnSpecial.findIndex(wpn => wpn._id === data.idWpn);
          filterWpn = actProcessed.listWpnSpecial.find(wpn => wpn._id === data.idWpn);

          data['num'] = keys;
          data['nameWpn'] = filterWpn.name;
          data['typeWpn'] = filterWpn.type;
        }
      break;

      case 'base':
      case 'c1':
      case 'c2':
        if(special.data === 'mechaarmure') {
          keys = actProcessed.listWpnMA.findIndex(wpn => wpn._id === data.idWpn && wpn.type === type);
          filterWpn = actProcessed.listWpnMA.find(wpn => wpn._id === data.idWpn && wpn.type === type);

          data['num'] = keys;
          data['nameWpn'] = filterWpn.name;
          data['typeWpn'] = filterWpn.type;
        }
      break;

      case 'armesimprovisees':
        label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[data.nameWpn][data.num]);
        if(actorIsPj(actor)) {
          data['base'] = actor.system.combat.armesimprovisees[data.idWpn];
          data['autre'] = ['force'];
        }
        else data['base'] = actor.system.combat.armesimprovisees.aspect;
        break;
    }

    if(isWpn && special.data !== 'mechaarmure') {
      if(type !== 'grenade' && type !== 'longbow' && type !== 'cea' && type !== 'module' && type !== 'armesimprovisees') {
        getWpn = actor.items.get(data.idWpn);
        const isEquipped = actorIsPj(actor) ? getWpn.system?.equipped ?? false : true;
        const typeWpn = getWpn.system.tourelle.has ? 'tourelle' : getWpn.system.type;
        if(typeWpn === 'distance') listWpn = actProcessed.listWpnDistance;
        else if(typeWpn === 'contact') listWpn = actProcessed.listWpnContact;
        else if(typeWpn === 'tourelle') listWpn = actProcessed.listWpnTourelle;
        keys = Object.keys(listWpn);
        filterWpn = keys.find(key => listWpn[key]._id === getWpn._id);

        data['nameWpn'] = getWpn.name;
        data['typeWpn'] = typeWpn;
        data['num'] = filterWpn;

        if(!isEquipped && typeWpn !== 'tourelle') return;
        if(actor.type === 'vehicule') {
          vehicule = true;
          data['vehicule'] = actor;
          tireur = getWpn.system.whoActivate;
          if(tireur === "") return;
          else tireur = game.actors.get(tireur);
        }
      } else if(type === 'module') {

        getWpn = actor.items.get(data.idWpn);
        let isActive = false;

        for(let w in getWpn.system.active) {
          if(getWpn.system.active[w]) isActive = true;
        }

        if(!isActive) return;

        data['nameWpn'] = getWpn.name;
        data['typeWpn'] = getWpn.system.arme.type;

        if(data.typeWpn === 'distance') listWpn = actProcessed.listWpnDistance;
        else if(data.typeWpn === 'contact') listWpn = actProcessed.listWpnContact;

        keys = Object.keys(listWpn);
        filterWpn = keys.find(key => listWpn[key]._id === getWpn._id);
        data['num'] = filterWpn;
      }
    }

    if(modificateur !== "") data['modificateur'] = getNestedPropertyValue(actor, modificateur);
    if(autre !== "") data['autre'] = bonusToAdd.autre.split(",");

    if(type === "espoir" && hasShift) {
      const base = data?.base ?? "";

      let carac = base !== "" ? getCaracValue(data.base, actor, true) : 0;
      let od = wear === 'armure' && base !== "" ? getODValue(data.base, actor, true) : 0;
      let autre = [];

      for(let a of data.autre) {
        autre.push(game.i18n.localize(CONFIG.KNIGHT.caracteristiques[a]));
        carac += getCaracValue(a, actor, true);
        od += wear === 'armure' ? getODValue(a, actor, true) : 0;
      }

      const roll = wear === 'armure' ? `${carac}d6+${od}` : `${carac}d6`;
      const exec = new game.knight.RollKnight(roll, actor.system);

      exec._success = true;
      exec._flavor = label;
      exec._base = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[data.base]);
      exec._autre = autre;
      exec._details = wear === 'armure' ? `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')})d6 + ${od} (${game.i18n.localize('KNIGHT.ITEMS.ARMURE.Overdrive')})` : `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')})d6`;
      await exec.toMessage({
        speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
        }
      });
    } else {
      rollApp.setLabel(label);
      rollApp.setR(data);
      rollApp.render(true);

      if(queryInstance.previous) rollApp.bringToTop();
    }
}

export async function directRoll(actorId, sceneId, tokenId, data={}) {
  const actor = tokenId === "null" ? game.actors.get(actorId) : game.scenes.get(sceneId).tokens.find(token => token.id === tokenId).actor;
  const dataActor = actor.system;
  const type = data.type;
  const id = data.id;
  const wear = dataActor.wear;
  const isPj = actorIsPj(actor);
  let nbre = 0;
  let update = {};

  switch(type) {
    case 'nods':
      const dataNods = dataActor?.combat?.nods?.[id] ?? undefined;
      nbre = dataNods !== undefined ? dataNods?.value ?? 0 : 0;

      if(nbre <= 0 || dataNods === undefined) return;

      const recuperation = dataNods.recuperationBonus;
      const rNods = new game.knight.RollKnight(`3D6+${recuperation}`, dataActor);
      rNods._flavor = game.i18n.localize(`KNIGHT.JETS.Nods${id}`);
      rNods._success = false;
      await rNods.toMessage({
        speaker: {
        actor: actorId || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
        }
      });

      let base = 0;
      let max = 0;
      let type = '';

      switch(id) {
        case 'soin':
          type = 'sante';
          base = dataActor.sante.value;
          max = dataActor.sante.max;

          break;

        case 'energie':
          type = 'energie';
          base = dataActor.energie.value;
          max = dataActor.energie.max;
          break;

        case 'armure':
          type = 'armure'
          base = dataActor.armure.value;
          max = dataActor.armure.max;
          break;
      }

      const total = rNods.total;
      const final = base+total > max ? max : base+total;

      update[`system.combat.nods.${id}.value`] = Number(nbre)-1;

      if(data.target === 'self') {
        update[`system.${type}.value`] = final;

        if(type == 'armure' && isPj) {
          switch(wear) {
            case 'armure':
              const armor = await getArmor(actor);

              armor.update({[`system.armure.value`]:final});
              break;

            case 'ascension':
            case 'guardian':
              update[`system.equipements.${wear}.value`] = final;
              break;
          }
        }
      }

      break;
  }

  if(!foundry.utils.isEmpty(update)) actor.update(update);
}

/*
DATA :
  Requis :
  - (object) actor : L'Acteur
  - (string) typeWpn : Le type de l'arme
  - (object) style : le style de combat
  - (object) localDataWpn : Des données de l'arme utilisée, dépendant de l'arme en question. Peut-être omis selon les armes.
  - (string) base : Caractéristique de base utilisée. Peut-être ignoré pour les tourelles.
  - (object) listAllE = Liste de tous les effets de l'arme après traitement par la fonction dédiée.

  Optionnel :
  - (object) avDv : La liste des avantages / désavantages
  - (int) totalDice : Le total des dés d'attaque
  - (int) totalBonus : Le total du bonus d'attaque
  - (array) otherC : Liste des autres caractéristiques utilisées.
  - (int) carac : score de la caractéristique utilisée. Sert uniquement à l'affichage.
  - (int) od : od de la caractéristique utilisée. Sert uniquement à l'affichage.
  - (int) modificateur : Modificateur (en dés) utilisé. Sert uniquement à l'affichage.
  - (int) difficulte : Difficulté du jet.
  - (booleen) isCapacite : S'il s'agit d'une capacité.
  - (int) addNum : Numéro ajouté au nom de l'attaque.
  - (booleen) isBarrage : Si l'attaque est un barrage.
  - (int) barrageValue : Valeur de l'effet barrage, si concerné.
  - (booleen) isSystemeRefroidissement : Si l'attaque est avec l'effet Système de refroidissement.
  - (array) addOtherEffects : Liste des effets à ajouter.
*/
export async function doAttack(data) {
  const version = game.version.split('.')[0];

  const actor = data.actor;
  const listAllE = data.listAllE;
  const isPNJ = data?.pnj ?? false;
  const wpnType = data.typeWpn;
  const avDv = data?.avDv ?? {};
  const lAvantages = avDv?.avantages ?? [];
  const lInconvenient = avDv?.inconvenient ?? [];
  const totalDice = data?.totalDice ?? 0;
  const totalBonus = data?.totalBonus ?? 0;
  const localDataWpn = data.localDataWpn;
  const base = data?.base ?? "";
  const otherC = data?.otherC ?? [];
  const carac = data?.carac ?? 0;
  const od = data?.od ?? 0;
  const modificateur = data?.modificateur ?? 0;
  const difficulte = data?.difficulte ?? 0;
  const isCapacite = data?.isCapacite ?? false;
  const addNum = data?.addNum ?? '';
  const isBarrage = data?.isBarrage ?? false;
  const barrageValue = data?.barrageValue ?? 0;
  const isSystemeRefroidissement = data?.isSystemRefroidissement ?? false;
  const addOtherEffects = data?.addOtherEffects ?? [];
  const btnDgts = data?.btnDgts ?? false;
  const btnViolence = data?.btnViolence ?? false;
  const target = data?.target ?? undefined
  const findTarget = target !== undefined ? canvas.scene.tokens.find(token => token.id === target) : undefined;
  const targetToken = findTarget !== undefined ? findTarget.actor : undefined;
  const contactOrDistance = data?.contactOrDistance ?? undefined;

  const avantages = [];
  const inconvenient = [];

  let attaqueBonus = 0;
  let reactionMalus = 0;
  let defenseMalus = 0;
  let designation = 0;
  let lumiere = 0;
  let barrage = 0;

  let effLumiere = undefined;
  let effBarrage = undefined;

  if(version < 11 && targetToken !== undefined) {
    effLumiere = targetToken.effects.find(effects => foundry.utils.getProperty(effects, "flags.core.statusId") === 'lumiere');
    effBarrage = targetToken.effects.find(effects => foundry.utils.getProperty(effects, "flags.core.statusId") === 'barrage');
    designation = targetToken.effects.find(effects => foundry.utils.getProperty(effects, "flags.core.statusId") === 'designation') ? 1 : 0;

    if(effLumiere !== undefined) lumiere = 1*(foundry.utils.getProperty(effLumiere, "flags.statuscounter.counter")?.value ?? 1);
    if(effBarrage !== undefined) barrage = 1*(foundry.utils.getProperty(effBarrage, "flags.statuscounter.counter")?.value ?? 1);

  } else if(targetToken !== undefined) {
    designation = targetToken.statuses.has('designation') ? 1 : 0;
    effLumiere = targetToken.effects.find(effects => effects.statuses.has('lumiere'));
    effBarrage = targetToken.effects.find(effects => effects.statuses.has('barrage'));

    if(effLumiere !== undefined) lumiere = 1*(foundry.utils.getProperty(effLumiere, "flags.statuscounter.counter")?.value ?? 1);
    if(effBarrage !== undefined) barrage = 1*(foundry.utils.getProperty(effBarrage, "flags.statuscounter.counter")?.value ?? 1);
  }

  reactionMalus += designation;
  attaqueBonus = contactOrDistance === 'distance' ? attaqueBonus+designation : attaqueBonus;

  const execAtt = new game.knight.RollKnight(`${totalDice}d6+${totalBonus+attaqueBonus}`, actor.system);
  execAtt._success = true;
  if(wpnType !== 'tourelle' && !isPNJ) {
    execAtt._base = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[base]);
    execAtt._autre = otherC;
  } else if(isPNJ) {
    execAtt._base = game.i18n.localize(CONFIG.KNIGHT.aspects[base]);
  }

  let details = '';

  if(wpnType === 'tourelle') {
    details = `${totalDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 + ${totalBonus}`;
  } else if(isPNJ) {
    details = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Aspects')}) + ${modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ASPECTS.Exceptionnels')}) + ${totalBonus-od} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`
  } else {
    details = `${carac}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')}) + ${modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ITEMS.ARMURE.Overdrive')}) + ${totalBonus-od} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`;
  }

  execAtt._difficulte = difficulte;
  execAtt._pairOrImpair = listAllE.guidage ? 1 : 0;
  execAtt._details = details;
  await execAtt.evaluateSuccess();

  let caracs = [execAtt._base].concat(execAtt._autre)[0] === '' ? [] : [execAtt._base].concat(execAtt._autre);
  if(caracs[0] === undefined) { caracs = ''; }
  let pAttack = {};

  for(let i = 0;i < lAvantages.length;i++) {
    const data = avDv.avantages[i];

    if(data.system.show) {
      avantages.push({
        name:data.name,
        desc:data.system.description
      });
    }
  }

  for(let i = 0;i < lInconvenient.length;i++) {
    const data = avDv.inconvenient[i];

    if(data.system.show) {
      inconvenient.push({
        name:data.name,
        desc:data.system.description
      });
    }
  }

  let aIEffects = [];

  if(wpnType === 'armesimprovisees') {aIEffects.push({
    name:`${localDataWpn.utilisations} ${game.i18n.localize('KNIGHT.COMBAT.ARMESIMPROVISEES.Utilisations')}`
  })}

  const style = isPNJ ? {selected:''} : data.style;
  const eSub = listAllE.attack.list;
  const eInclude = listAllE.attack.include;
  const other = listAllE.other.concat(addOtherEffects, aIEffects).sort(SortByName);
  let portee;

  if(designation > 0 && contactOrDistance === 'distance') listAllE.attack.include.unshift({
    name:`+${designation} ${game.i18n.localize('KNIGHT.EFFETS.DESIGNATION.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
    desc:`${game.i18n.localize('KNIGHT.EFFETS.DESIGNATION.Description')}`
  });

  if(isCapacite) {
    portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${localDataWpn.portee}`;
  } else if((wpnType === 'grenades' && !isPNJ) || (wpnType === 'armesimprovisees' && !isPNJ)) {
    const force = getODValue('force', actor, true);

    switch(force) {
      case 0:
        portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Courte`)}`;
        break;

      case 1:
        portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Moyenne`)}`;
        break;

      case 2:
        portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Longue`)}`;
        break;

      default:
        portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Lointaine`)}`;
        break;
    }
  } else if(wpnType === 'longbow') {
    portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.${localDataWpn.portee.value.charAt(0).toUpperCase()+localDataWpn.portee.value.substr(1)}`)}`;
  } else if((wpnType === 'grenades' && isPNJ) || (wpnType === 'armesimprovisees' && isPNJ)) {
    portee = ``;
  } else {
    portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.${localDataWpn.portee.charAt(0).toUpperCase()+localDataWpn.portee.substr(1)}`)}`;
  }

  if(style.selected && wpnType !== 'tourelle' && !isPNJ) eInclude.unshift({
    name:`+${getCaracValue(style.selected, data.actor, true)}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize(CONFIG.KNIGHT.caracteristiques[style.selected])} ${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
    desc:style.info
  });

  const isSuccess = execAtt._success;
  const six = listAllE.regularite ? execAtt.getSix() : 0;
  const assAtk = listAllE.degats.list.find(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')}`);
  const connectee = listAllE.degats.list.find(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')}`);
  const hyperVelocite = listAllE.degats.list.find(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')}`);
  const hasAssAtk = assAtk !== undefined ? true : false;
  const hasConnectee = connectee !== undefined ? true : false;
  const hasHyperVelocite = hyperVelocite !== undefined ? true : false;

  let defense = 0;

  if(!isBarrage && !isSystemeRefroidissement) {
    pAttack = {
      flavor:`${data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}${addNum}`,
      main:{
        isSuccess:isSuccess,
        isExploit:execAtt._isExploit,
        total:execAtt._totalSuccess,
        tooltip:await execAtt.getTooltip(),
        isRollSuccess:execAtt._isRollSuccess,
        isRollFailed:execAtt._isRollFailed,
        isRollEFailed:execAtt._isEFail,
        details:execAtt._details,
        formula: execAtt._formula,
        caracs: wpnType !== 'tourelle' ? caracs : false,
        isAttack:true,
        portee:portee,
      },
      sub:eSub,
      include:eInclude,
      other:other,
      avantages:avantages,
      inconvenient:inconvenient,
      btnDgts:btnDgts,
      regularite:six*3,
      btnViolence:btnViolence,
    };

    if(target !== undefined && targetToken !== undefined && !execAtt._isEFail) {
      const attackSurprise = data?.attackSurprise ?? false;
      const targetSys = targetToken.system;
      const malus = contactOrDistance === 'contact' ? defenseMalus : reactionMalus;
      const typeDef = contactOrDistance === 'contact' ? game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense') : game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction');
      let defenseToShow = 0;
      defense = contactOrDistance === 'contact' ? Number(targetSys.defense.value) : Number(targetSys.reaction.value);

      defense += lumiere;
      defense += barrage;

      if(wpnType !== 'tourelle' && !isPNJ && !attackSurprise && !actorIsPj(targetToken)) {
        const pointsFaible = targetSys?.pointsFaibles ?? "";
        let normalizedPF = normalizeTxt(pointsFaible);
        let normalizedCaracs = caracs !== "" ? caracs.map(c => {return normalizeTxt(c)}) : [];

        if(containsWord(normalizedPF, normalizedCaracs)) {
          defense = Math.floor(defense/2);
          defense -= lumiere;
          defense -= barrage;
          defense -= malus;

          defenseToShow = defense+malus;
          pAttack.main.pfTarget = true;
        } else {
          defense -= lumiere;
          defense -= barrage;
          defense -= malus;

          defenseToShow = defense+malus;
        }
      } else if(attackSurprise) {
        defense = 0;
        defenseToShow = 0;
      } else {
        defense -= lumiere;
        defense -= barrage;
        defense -= malus;

        defenseToShow = defense+malus;
      }

      pAttack.main.atkVs = `${typeDef} (${defenseToShow})`;

      if(Number(execAtt._totalSuccess) > defense) {
        pAttack.main.atkTouche = true;
        if(hasAssAtk) pAttack.assAtk = Number(execAtt._totalSuccess) - defense;
        if(hasConnectee) pAttack.connectee = Number(execAtt._totalSuccess) - defense;
        if(hasHyperVelocite) pAttack.hyperVelocite = Number(execAtt._totalSuccess) - defense;
      } else if(Number(execAtt._totalSuccess) <= defense) pAttack.main.atkManque = true;
    }

    if(wpnType !== 'tourelle' && !isPNJ) pAttack.style = `${style.fulllabel}`;
  } else {
    const barrageLabel = isBarrage ? `${game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label')} ${barrageValue}` : `${game.i18n.localize('KNIGHT.AMELIORATIONS.SYSTEMEREFROIDISSEMENT.Label')} (${game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label')} ${barrageValue})`
    pAttack = {
      flavor:`${data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}${addNum}`,
      main:{
        total:barrageLabel
      }
    };
  }

  let rolls = execAtt;

  if(execAtt._pRolls.length !== 0) {
    const pRolls = execAtt._pRolls[0].map(function(objet) {
      return { ...objet, active: true };
    });

    rolls.dice[0].results = rolls.dice[0].results.concat(pRolls);
  }

  const attackMsgData = {
    user: game.user.id,
    speaker: {
      actor: actor?.id || null,
      token: actor?.token?.id || null,
      alias: actor?.name || null,
    },
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls:[rolls],
    content: await renderTemplate('systems/knight/templates/dices/wpn.html', pAttack),
    sound: CONFIG.sounds.dice
  };

  const rMode = game.settings.get("core", "rollMode");
  const msgData = ChatMessage.applyRollMode(attackMsgData, rMode);

  await ChatMessage.create(msgData, {
    rollMode:rMode
  });

  return {
    regularite:six*3,
    assAtk:pAttack.main.atkTouche ? Number(execAtt._totalSuccess) - defense : undefined,
    connectee:pAttack.main.atkTouche ? Number(execAtt._totalSuccess) - defense : undefined,
    hyperVelocite:pAttack.main.atkTouche ? Number(execAtt._totalSuccess) - defense : undefined,
  };
}

/*
DATA :
  requis :
  - (object) actor : L'acteur.
  - (object) style : les données de style, s'il ne s'agit pas d'un PNJ.
  - (object) dataWpn : Les données de l'arme.
  - (object) listAllE = Liste de tous les effets de l'arme après traitement par la fonction dédiée.

  optionnel :
  - (object) pnj : Les données du PNJ.
  - (booleen) tenebricide : s'il y a l'effet ténébricide activé.
  - (object) degatsBonus : S'il y a des dégâts bonus (dice / fixe).
  - (int) regularite : S'il y a l'effet regularité
  - (int) addNum : S'il y a un numéro à ajouter à la fin du nom.
*/
export async function doDgts(data) {
  const actor = data.actor;
  const dataWpn = data.dataWpn;
  const listAllEffets = data.listAllE;
  const regularite = data?.regularite ?? 0;
  const isPNJ = data?.pnj ?? false
  const style = isPNJ ? {raw:''} : data.style;
  const addNum = data?.addNum ?? '';
  const assAtk = data?.assAtk ?? undefined;
  const connectee = data?.connectee ?? undefined;
  const hyperVelocite = data?.hyperVelocite ?? undefined;

  //DEGATS
  const tenebricide = data?.tenebricide ?? false;
  const bourreau = listAllEffets.bourreau;
  const bourreauValue = listAllEffets.bourreauValue;

  const dgtsDice = dataWpn?.degats?.dice || 0;
  const dgtsFixe = dataWpn?.degats?.fixe || 0;

  let diceDgts = +dgtsDice;
  let bonusDgts = +dgtsFixe;
  let bonusTrueDgts = 0;
  let bonusAssDgts = 0;

  if(style.raw === 'akimbo') {
    diceDgts += diceDgts;
  }

  diceDgts += +listAllEffets.degats.totalDice;
  bonusDgts += +listAllEffets.degats.totalBonus;
  diceDgts += +data?.degatsBonus?.dice ?? 0;
  bonusDgts += +data?.degatsBonus?.fixe ?? 0;

  bonusDgts += regularite;
  diceDgts += listAllEffets.degatsModules.dice;
  bonusDgts += listAllEffets.degatsModules.fixe;

  bonusTrueDgts = bonusDgts;

  if(assAtk !== undefined) bonusAssDgts += Number(assAtk);
  if(connectee !== undefined) bonusAssDgts += Number(connectee);
  if(hyperVelocite !== undefined) bonusAssDgts += Number(hyperVelocite);

  bonusTrueDgts += bonusAssDgts;

  const labelDgt = `${data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}${addNum}`;
  const totalDiceDgt = tenebricide === true ? Math.floor(diceDgts/2) : diceDgts;

  const totalDgt = `${Math.max(totalDiceDgt, 0)}d6+${bonusTrueDgts}`;

  const execDgt = new game.knight.RollKnight(`${totalDgt}`);
  execDgt._success = false;
  execDgt._hasMin = bourreau ? true : false;

  if(bourreau) {
    execDgt._seuil = bourreauValue;
    execDgt._min = 4;
  }

  await execDgt.evaluate(listAllEffets.degats.minMax);

  let effets = listAllEffets;

  if(effets.regularite) {
    const regulariteIndex = effets.degats.include.findIndex(str => { if(str.name.includes(game.i18n.localize(CONFIG.KNIGHT.effets['regularite'].label))) return true; });
    effets.degats.include[regulariteIndex].name = `+${regularite} ${effets.degats.include[regulariteIndex].name}`;
  }

  let sub = effets.degats.list;
  let include = [].concat(effets.degats.include);
  let hideInclude = [].concat(effets.degats.include);
  let index;

  if(assAtk !== undefined) {
    index = sub.findIndex(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')}`);

    if (index !== -1) {
      sub.splice(index, 1);
    }

    hideInclude.push({
      name:`+${assAtk} ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:`${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Description')}`
    });

    include.push({
      name:`+ ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')}`,
      desc:`${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Description')}`
    });
  }

  if(connectee !== undefined) {
    index = sub.findIndex(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')}`);

    if (index !== -1) {
      sub.splice(index, 1);
    }

    hideInclude.push({
      name:`+${connectee} ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Description')}`
    });

    include.push({
      name:`+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Description')}`
    });
  }

  if(hyperVelocite !== undefined) {
    index = sub.findIndex(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')}`);

    if (index !== -1) {
      sub.splice(index, 1);
    }

    hideInclude.push({
      name:`+${hyperVelocite} ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Description')}`
    });

    include.push({
      name:`+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Description')}`
    });
  }


  if(sub.length > 0) { sub.sort(SortByName); }
  if(include.length > 0) { include.sort(SortByName); }
  if(hideInclude.length > 0) { hideInclude.sort(SortByName); }

  const rMode = game.settings.get("core", "rollMode");

  let tooltip = await execDgt.getTooltip();
  let falseTooltip = tooltip.replaceAll(` + ${bonusTrueDgts}</span>`, ` + ${bonusDgts}</span>`);

  let pDegats = {
    flavor:labelDgt,
    main:{
      total:execDgt._total-bonusAssDgts,
      tooltip:falseTooltip,
      formula: `${Math.max(totalDiceDgt, 0)}d6+${bonusDgts}`
    },
    sub:sub,
    include:include,
    hideInclude:hideInclude,
  };

  if(bonusAssDgts > 0) {
    pDegats.hide = {
      total:execDgt._total,
      tooltip:tooltip,
      formula: execDgt._formula,
    }
  }

  const dgtsMsgData = {
    user: game.user.id,
    speaker: {
      actor: actor?.id || null,
      token: actor?.token?.id || null,
      alias: actor?.name || null,
    },
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls:[execDgt].concat(listAllEffets.rollDgts),
    content: await renderTemplate('systems/knight/templates/dices/wpn.html', pDegats),
    sound: CONFIG.sounds.dice
  };

  const msgData = ChatMessage.applyRollMode(dgtsMsgData, rMode);

  await ChatMessage.create(msgData, {
    rollMode:rMode
  });
}

/*
DATA :
  requis :
  - (object) actor : L'acteur.
  - (object) style : les données de style, s'il ne s'agit pas d'un PNJ.
  - (object) dataWpn : Les données de l'arme.
  - (object) listAllE = Liste de tous les effets de l'arme après traitement par la fonction dédiée.

  optionnel :
  - (object) pnj : Les données du PNJ.
  - (booleen) tenebricide : s'il y a l'effet ténébricide activé.
  - (object) violenceBonus : S'il y a des dégâts bonus (dice / fixe).
  - (int) addNum : S'il y a un numéro à ajouter à la fin du nom.
  - (int) bViolence : S'il y a un bonus de violence.
*/
export async function doViolence(data) {
  const actor = data.actor;
  const dataWpn = data.dataWpn;
  const listAllEffets = data.listAllE;
  const isPNJ = data?.pnj ?? false
  const style = isPNJ ? {raw:''} : data.style;
  const addNum = data?.addNum ?? '';
  const bViolence = data?.bViolence ?? 0;
  const assAtk = data?.assAtk ?? undefined;
  const connectee = data?.connectee ?? undefined;
  const hyperVelocite = data?.hyperVelocite ?? undefined;

  //VIOLENCE
  const tenebricide = data?.tenebricide ?? false;
  const devastation = listAllEffets.devastation;
  const devastationValue = listAllEffets.devastationValue;

  const violenceDice = dataWpn?.violence?.dice ?? 0;
  const violenceFixe = dataWpn?.violence?.fixe ?? 0;

  let diceViolence = +violenceDice;
  let bonusViolence = +violenceFixe;
  let bonusTrueViolence = 0;
  let bonusAssViolence = 0;

  if((actor.type !== 'knight' && actor.type !== 'pnj' && actor.type !== 'mechaarmure' && actor.type !== 'vehicule' && diceViolence === 0 && bonusViolence === 0)) {}
  else {
    if(style.raw === 'akimbo') {
      diceViolence += Math.floor(diceViolence/2);
    }

    diceViolence += +listAllEffets.violence.totalDice;
    bonusViolence += +listAllEffets.violence.totalBonus;
    diceViolence += +data?.violenceBonus?.dice ?? 0;
    bonusViolence += +data?.violenceBonus?.fixe ?? 0;

    diceViolence += listAllEffets.violenceModules.dice;
    bonusViolence += listAllEffets.violenceModules.fixe;

    bonusTrueViolence = bonusViolence;

    if(assAtk !== undefined) bonusAssViolence += Number(assAtk);
    if(connectee !== undefined) bonusAssViolence += Number(connectee);
    if(hyperVelocite !== undefined) bonusAssViolence += Number(hyperVelocite);

    bonusViolence += bViolence;
    bonusTrueViolence += bViolence;
    bonusTrueViolence += bonusAssViolence;

    const labelViolence = `${data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}${addNum}`;
    const totalDiceViolence = tenebricide === true ? Math.floor(diceViolence/2) : diceViolence;

    const totalViolence = `${Math.max(totalDiceViolence, 0)}d6+${bonusTrueViolence}`;

    const execViolence = new game.knight.RollKnight(`${totalViolence}`);
    execViolence._success = false;
    execViolence._hasMin = devastation ? true : false;

    if(devastation) {
      execViolence._seuil = devastationValue;
      execViolence._min = 5;
    }

    await execViolence.evaluate(listAllEffets.violence.minMax);

    let sub = listAllEffets.violence.list;
    let include = [].concat(listAllEffets.violence.include);
    let hideInclude = [].concat(listAllEffets.violence.include);
    let index;

    if(assAtk !== undefined) {
      index = sub.findIndex(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')}`);

      if (index !== -1) {
        sub.splice(index, 1);
      }

      include.push({
        name:`+ ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:`${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Description')}`
      });

      hideInclude.push({
        name:`+${assAtk} ${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:`${game.i18n.localize('KNIGHT.EFFETS.ASSISTANCEATTAQUE.Description')}`
      });
    }

    if(connectee !== undefined) {
      index = sub.findIndex(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')}`);

      if (index !== -1) {
        sub.splice(index, 1);
      }

      include.push({
        name:`+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Description')}`
      });

      hideInclude.push({
        name:`+${connectee} ${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.CONNECTEE.Description')}`
      });
    }

    if(hyperVelocite !== undefined) {
      index = sub.findIndex(eff => eff.name === `+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')}`);

      if (index !== -1) {
        sub.splice(index, 1);
      }

      include.push({
        name:`+ ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Description')}`
      });

      hideInclude.push({
        name:`+${hyperVelocite} ${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:`${game.i18n.localize('KNIGHT.AMELIORATIONS.MUNITIONSHYPERVELOCITE.Description')}`
      });
    }

    if(sub.length > 0) { sub.sort(SortByName); }
    if(include.length > 0) { include.sort(SortByName); }
    if(hideInclude.length > 0) { hideInclude.sort(SortByName); }

    let tooltip = await execViolence.getTooltip();
    let falseTooltip = tooltip.replaceAll(` + ${bonusTrueViolence}</span>`, ` + ${bonusViolence}</span>`);

    let pViolence = {
      flavor:labelViolence,
      main:{
        total:execViolence._total-bonusAssViolence,
        tooltip:falseTooltip,
        formula:`${Math.max(totalDiceViolence, 0)}d6+${bonusViolence}`,
      },
      sub:sub,
      include:include,
      hideInclude:hideInclude,
    };

    if(bonusAssViolence > 0) {
      pViolence.hide = {
        total:execViolence._total,
        tooltip:tooltip,
        formula: execViolence._formula,
      }
    }

    const violenceMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls:[execViolence].concat(listAllEffets.rollViol),
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pViolence),
      sound: CONFIG.sounds.dice
    };

    const rMode = game.settings.get("core", "rollMode");
    const msgData = ChatMessage.applyRollMode(violenceMsgData, rMode);

    await ChatMessage.create(msgData, {
      rollMode:rMode
    });
  }
}