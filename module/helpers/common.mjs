export function SortByLabel(x, y){
    if (x.label.toLowerCase() < y.label.toLowerCase()) {return -1;}
    if (x.label.toLowerCase() > y.label.toLowerCase()) {return 1;}
    return 0;
}

export function SortInversedByLabel(x, y){
    if (x.label.toLowerCase() < y.label.toLowerCase()) {return 1;}
    if (x.label.toLowerCase() > y.label.toLowerCase()) {return -1;}
    return 0;
}

export function SortByName(x, y){
    if (x.name.toLowerCase() < y.name.toLowerCase()) {return -1;}
    if (x.name.toLowerCase() > y.name.toLowerCase()) {return 1;}
    return 0;
}

export function SortByAddOrder(x, y){
    if (x.order < y.order) {return -1;}
    if (x.order > y.order) {return 1;}
    return 0;
}

export function sum(total, num) {
  return total + num;
}

export function listEffects(raw, custom, labels) {
    const liste = [];

    if(raw === undefined) return;

    for(let n = 0;n < raw.length;n++) {
      const split = raw[n].split(" ");
      const secondSplit = split[0].split("<space>");
      const name = game.i18n.localize(labels[secondSplit[0]].label);
      const sub = split[1];
      const other = Object.values(secondSplit);
      let complet = name;

      if(other.length > 1) {
        other.splice(0, 1);
        complet += ` ${other.join(" ").replace("<space>", " ")}`;
      }

      if(sub != undefined) { complet += " "+sub; }

      liste.push({
        name:complet,
        description:game.i18n.localize(labels[secondSplit[0]].description),
        raw:raw[n]
      });
    }

    for(let n = 0;n < custom.length;n++) {
      liste.push({
        id:n,
        name:custom[n].label,
        description:custom[n].description,
        custom:true
      });
    }

    function _sortByName(x, y){
      if (x.name.toLowerCase() < y.name.toLowerCase()) {return -1;}
      if (x.name.toLowerCase() > y.name.toLowerCase()) {return 1;}
      return 0;
    }

    liste.sort(_sortByName);

    return liste;
}

export function searchTrueValue(array) {
    const length = array.length;

    let result = false;
    for(let i = 0;i < length;i++) {
      if(typeof array[i] === 'string' || array[i] === true) {
          result = true;
      }
    }

    return result;
}

export async function getEffets(actor, typeWpn, style, data, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, isPNJ = false, energie=0) {
    const ghostConflit = actor?.armureData?.system?.capacites?.selected?.ghost?.active?.conflit || false;
    const ghostHConflit = actor?.armureData?.system?.capacites?.selected?.ghost?.active?.horsconflit || false;
    const ersatzRogue = actor?.moduleErsatz?.rogue?.has || false;

    const changelingPersonnel = actor?.armureData?.system?.capacites?.selected?.changeling?.active?.personnel || false;
    const changelingEtendue = actor?.armureData?.system?.capacites?.selected?.changeling?.active?.etendue || false;
    const ersatzBard = actor?.moduleErsatz?.bard?.has || false;

    const hasGhost = searchTrueValue([ghostConflit, ghostHConflit, ersatzRogue]);
    const hasChangeling = searchTrueValue([changelingPersonnel, changelingEtendue, ersatzBard]);

    const guidage = data?.guidage || false;
    const tenebricide = data?.tenebricide || false;
    const obliteration = searchTrueValue([data?.obliteration || false, data?.cranerieur || false]);

    const bourreau = effetsWpn.raw.find(str => { if(str.includes('bourreau')) return true; });
    const bourreauValue = bourreau ? bourreau.split(' ')[1] : 0;
    const devastation = effetsWpn.raw.find(str => { if(str.includes('devastation')) return true; });
    const devastationValue = devastation ? devastation.split(' ')[1] : 0;
    const regularite = effetsWpn.raw.find(str => { if(str.includes('regularite')) return true; });

    const hypervelocite = typeWpn === 'distance' || typeWpn === 'tourelle' || typeWpn === 'longbow' ? distanceWpn.raw.find(str => { if(str.includes('munitionshypervelocite')) return true; }) : false;
    const revetementomega = typeWpn === 'distance' || typeWpn === 'tourelle' || typeWpn === 'longbow' ? distanceWpn.raw.find(str => { if(str.includes('revetementomega')) return true; }) : false;
    const jumelageakimbo = typeWpn === 'distance' || typeWpn === 'tourelle' || typeWpn === 'longbow' ? distanceWpn.raw.find(str => { if(str.includes('jumelageakimbo')) return true; }) : false;
    const jumelageambidextrie = typeWpn === 'distance' || typeWpn === 'tourelle' || typeWpn === 'longbow' ? distanceWpn.raw.find(str => { if(str.includes('jumelageambidextrie')) return true; }) : false;
    const subsoniques = typeWpn === 'distance' || typeWpn === 'tourelle' || typeWpn === 'longbow' ? distanceWpn.raw.find(str => { if(str.includes('munitionssubsoniques')) return true; }) : false;
    const interfaceguidage = typeWpn === 'distance' || typeWpn === 'tourelle' || typeWpn === 'longbow' ? distanceWpn.raw.find(str => { if(str.includes('interfaceguidage')) return true; }) : false;

    const assassine = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('assassine')) return true; }) : false;
    const barbelee = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('barbelee')) return true; }) : false;
    const connectee = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('connectee')) return true; }) : false;
    const electrifiee = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('electrifiee')) return true; }) : false;
    const jumelle = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('jumelle')) return true; }) : false;
    const soeur = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('soeur')) return true; }) : false;

    const arabesqueiridescentes = typeWpn === 'contact' ? ornementalesWpn.raw.find(str => { if(str.includes('arabesqueiridescentes')) return true; }) : false;
    const boucliergrave = typeWpn === 'contact' ? ornementalesWpn.raw.find(str => { if(str.includes('boucliergrave')) return true; }) : false;
    const cranerieur = typeWpn === 'contact' ? ornementalesWpn.raw.find(str => { if(str.includes('cranerieurgrave')) return true; }) : false;
    const fauconplumesluminescentes = typeWpn === 'contact' ? ornementalesWpn.raw.find(str => { if(str.includes('fauconplumesluminescentes')) return true; }) : false;

    const sIAttack = [];
    const sPAttack = [];
    const sSAttack = [];

    const sPDegats = [];
    const sIDegats = [];
    const sSDegats = [];

    const sPViolence = [];
    const sIViolence = [];
    const sSViolence = [];

    const sOther = [];

    let depenseEnergie = energie;

    const minMaxDgts = {
      minimize:false,
      maximize:false,
      async:true
    };

    const minMaxViolence = {
      minimize:false,
      maximize:false,
      async:true
    };

    let onlyDgts = false;
    let onlyAttack = false;
    let onlyViolence = false;
    let barrageValue = 0;
    let nRoll = 1;

    let attackDice = 0;
    let attackBonus = 0;

    let dgtsDice = 0;
    let dgtsBonus = 0;

    let violenceDice = 0;
    let violenceBonus = 0;

    if(obliteration) { minMaxDgts.maximize = true; }

    let rollAtt = [];
    let rollDgts = [];
    let rollViol = [];

    for(let i = 0;i < effetsWpn.raw.length;i++) {
      const string = effetsWpn.raw[i].split(' ');
      const name = string[0];
      const value = string[1] === undefined ? '' : +string[1];

      const sub = {};

      let priorAttack = false;
      let includeAttack = false;
      let seconAttack = false;
      let priorDegats = false;
      let includeDegats = false;
      let seconDegats = false;
      let priorViolence = false;
      let includeViolence = false;
      let seconViolence = false;
      let other = false;

      switch(name) {
        case 'affecteanatheme':
          priorDegats = true;
          priorViolence = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;
        case 'anatheme':
          priorDegats = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'briserlaresilience':
          priorViolence = true;

          const bSub = new game.knight.RollKnight(`1D6`, actor.system);
          bSub._success = false;
          bSub._hasMin = bourreau ? true : false;

          if(bourreau) {
            bSub._seuil = bourreauValue;
            bSub._min = 4;
          }
          await bSub.evaluate(minMaxDgts);

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = data.briserlaresilience ? game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-active`) : game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-unactive`);
          sub.tooltip = await bSub.getTooltip();
          sub.total = bSub._total;
          sub.formula = bSub._formula;

          rollViol = rollViol.concat(bSub);
          break;

        case 'assistanceattaque':
          if(hypervelocite || connectee) other = true;
          else {
            priorDegats = true;
            priorViolence = true;
          }

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'excellence':
          priorDegats = true;
          priorViolence = true;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'esperance':
          priorDegats = true;
          priorViolence = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'antianatheme':
          if(fauconplumesluminescentes) other = true;
          else {
            priorDegats = true;
            priorViolence = true;
          }

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'artillerie':
        case 'demoralisant':
          priorAttack = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'assassin':
          if(revetementomega && value < 2) {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            priorDegats = true;

            const aSDice = tenebricide === true ? Math.floor(value/2) : value;

            const aSub = new game.knight.RollKnight(`${aSDice}D6`, actor.system);
            aSub._success = false;
            aSub._hasMin = bourreau ? true : false;

            if(bourreau) {
              aSub._seuil = bourreauValue;
              aSub._min = 4;
            }
            await aSub.evaluate(minMaxDgts);

            sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
            sub.tooltip = await aSub.getTooltip();
            sub.total = aSub._total;
            sub.formula = aSub._formula;

            rollDgts = rollDgts.concat(aSub);
          }
          break;

        case 'antivehicule':
        case 'deuxmains':
        case 'designation':
        case 'enchaine':
        case 'ignorearmure':
        case 'ignorechampdeforce':
        case 'lourd':
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'tirensecurite':
          if(interfaceguidage || typeWpn === 'tourelle' || isPNJ) other = true;
          else if(style === 'acouvert') includeAttack = true;
          else other = true;

          if(other) {
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'jumeleakimbo':
          if(jumelageakimbo || jumelle || typeWpn === 'tourelle' || isPNJ) other = true;
          else if(style === 'akimbo') includeAttack = true;
          else other = true;

          if(other) {
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'jumeleambidextrie':
          if(jumelageambidextrie || soeur || !data.jumeleambidextrie || typeWpn === 'tourelle' || isPNJ) other = true;
          else if(style === 'ambidextre' && data.jumeleambidextrie) includeAttack = true;
          else other = true;

          if(other) {
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'barrage':
          if(!data.barrage) {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            barrageValue = value;
            onlyAttack = true;
          }
          break;

        case 'cadence':
          const cadence = data.cadence;

          if(cadence) {
            includeAttack = true;

            sub.name = `-3${game.i18n.localize('KNIGHT.JETS.Des-short')} ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
            attackDice -= 3;
            nRoll = value;
          } else {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'chargeur':
        case 'dispersion':
        case 'defense':
        case 'parasitage':
        case 'percearmure':
        case 'penetrant':
        case 'reaction':
        case 'soumission':
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'defense':
          other = true;

          if(boucliergrave) sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value+1}`;
          else sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;

          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'lumiere':
          other = true;

          const vLumiere = arabesqueiridescentes ? value+1 : value;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${vLumiere}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'choc':
          if(electrifiee && value > 1) priorAttack = true;
          else other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'degatscontinus':
          other = true;

          const dcSub = new game.knight.RollKnight(`1D6`, actor.system);
          dcSub._success = false;
          await dcSub.evaluate({async:true});

          const tour = dcSub._total > 1 ? game.i18n.localize('KNIGHT.AUTRE.Tours') : game.i18n.localize('KNIGHT.AUTRE.Tour');

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value} (${dcSub._total} ${tour})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);

          rollAtt = rollAtt.concat(dcSub);
          break;

        case 'destructeur':
          priorDegats = true;

          const adSDice = tenebricide === true ? Math.floor(2/2) : 2;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);

          const dSub = new game.knight.RollKnight(`${adSDice}D6`, actor.system);
          dSub._success = false;
          dSub._hasMin = bourreau ? true : false;

          if(bourreau) {
            dSub._seuil = bourreauValue;
            dSub._min = 4;
          }
          await dSub.evaluate(minMaxDgts);

          sub.tooltip = await dSub.getTooltip();
          sub.total = dSub._total;
          sub.formula = dSub._formula;

          rollDgts = rollDgts.concat(dSub);
          break;

        case 'meurtrier':
          if(!barbelee) {
            priorDegats = true;

            const amSDice = tenebricide === true ? Math.floor(2/2) : 2;

            sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);

            const mSub = new game.knight.RollKnight(`${amSDice}D6`, actor.system);
            mSub._success = false;
            mSub._hasMin = bourreau ? true : false;

            if(bourreau) {
              mSub._seuil = bourreauValue;
              mSub._min = 4;
            }
            await mSub.evaluate(minMaxDgts);

            sub.tooltip = await mSub.getTooltip();
            sub.total = mSub._total;
            sub.formula = mSub._formula;

            rollDgts = rollDgts.concat(mSub);
          } else {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'fureur':
          priorViolence = true;

          const fSDice = tenebricide === true ? Math.floor(4/2) : 4;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} ${value}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);

          const fSub = new game.knight.RollKnight(`${fSDice}D6`, actor.system);
          fSub._success = false;
          fSub._hasMin = devastation ? true : false;

          if(devastation) {
            fSub._seuil = devastationValue;
            fSub._min = 4;
          }
          await fSub.evaluate(minMaxViolence);

          sub.tooltip = await fSub.getTooltip();
          sub.total = devastation && fSub._total <= devastationValue ? 5 : fSub._total;
          sub.formula = fSub._formula;

          rollViol = rollViol.concat(fSub);
          break;

        case 'leste':
          if(typeWpn === 'tourelle') {
            other = true;
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            const force = isPNJ ? Math.floor(+actor.system.aspects.chair.value/2) : +actor.system.aspects.chair.caracteristiques.force.value;
            includeDegats = true;

            sub.name = `+${force} ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
            dgtsBonus += force;
          }
          break;

        case 'orfevrerie':
          if(typeWpn === 'tourelle') {
            other = true;
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            const dexterite = isPNJ ? Math.floor(+actor.system.aspects.masque.value/2) : +actor.system.aspects.masque.caracteristiques.dexterite.value;
            const dexteriteOD = isPNJ ? 0 : +actor.system.aspects.masque.caracteristiques.dexterite.overdrive.value;
            includeDegats = true;

            sub.name = `+${dexterite+dexteriteOD} ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
            dgtsBonus += dexterite+dexteriteOD;
          }
          break;

        case 'precision':
          if(typeWpn === 'tourelle') {
            other = true;
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            const tir = isPNJ ? Math.floor(+actor.system.aspects.machine.value/2) : +actor.system.aspects.machine.caracteristiques.tir.value;
            const tirOD = isPNJ ? 0 : +actor.system.aspects.machine.caracteristiques.tir.overdrive.value;
            includeDegats = true;

            sub.name = `+${tir+tirOD} ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
            dgtsBonus += tir+tirOD;
          }
          break;

        case 'silencieux':
          if(typeWpn === 'tourelle') {
            other = true;
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            const discretion = isPNJ ? Math.floor(+actor.system.aspects.masque.value/2) : +actor.system.aspects.masque.caracteristiques.discretion.value;
            const discretionOD = isPNJ ? +actor.system.aspects.masque.ae.mineur.value + +actor.system.aspects.masque.ae.majeur.value : +actor.system.aspects.masque.caracteristiques.discretion.overdrive.value;

            if(assassine || subsoniques) {
              other = true;

              sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
              sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
            } else {
              if((hasGhost && !isPNJ) || (hasChangeling && !isPNJ)) {
                includeDegats = true;

                sub.name = `+${discretion+discretionOD} ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
                sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);

                dgtsBonus += discretion+discretionOD;
              } else {
                priorDegats = true;

                sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
                sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
                sub.total = discretion+discretionOD;
              }
            }
          }
          break;

        case 'ultraviolence':
          priorViolence = true;

          const uvSDice = tenebricide === true ? Math.floor(2/2) : 2;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);

          const uvSub = new game.knight.RollKnight(`${uvSDice}D6`, actor.system);
          uvSub._success = false;
          uvSub._hasMin = devastation ? true : false;

          if(devastation) {
            uvSub._seuil = devastationValue;
            uvSub._min = 4;
          }
          await uvSub.evaluate(minMaxViolence);

          sub.tooltip = await uvSub.getTooltip();
          sub.total = devastation && uvSub._total <= devastationValue ? 5 : uvSub._total;
          sub.formula = uvSub._formula;

          rollViol = rollViol.concat(uvSub);
          break;

        case 'tenebricide':
          if(tenebricide) {
            includeDegats = true;
            includeViolence = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'obliteration':
          if(obliteration && !cranerieur) {
            includeDegats = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'tirenrafale':
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'bourreau':
          includeDegats = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'devastation':
          includeViolence = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'conviction':
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'guidage':
          if(guidage) {
            includeAttack = true;
            depenseEnergie += 5;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          } else {
            other = true;

            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          }
          break;

        case 'regularite':
          includeDegats = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;

        case 'aucundegatsviolence':
          other = true;
          onlyAttack = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.effets[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.effets[name].description}-short`);
          break;
      }

      if(includeAttack) { sIAttack.push(sub); } else
      if(priorAttack) { sPAttack.push(sub); } else
      if(seconAttack) { sSAttack.push(sub); }

      if(includeDegats) { sIDegats.push(sub); } else
      if(priorDegats) { sPDegats.push(sub); } else
      if(seconDegats) { sSDegats.push(sub); }

      if(includeViolence) { sIViolence.push(sub); } else
      if(priorViolence) { sPViolence.push(sub); } else
      if(seconViolence) { sSViolence.push(sub); }

      if(other) { sOther.push(sub); }
    }

    for(let i = 0;i < effetsWpn.custom.length;i++) {
      const data = effetsWpn.custom[i];
      const dataAttack = data.attaque;
      const dataDegats = data.degats;
      const dataViolence = data.violence;

      const name = data.label;
      const description = data.description;
      const subAttack = {
        name:"",
      };
      const subDegats = {
        name:"",
      };
      const subViolence = {
        name:"",
      };
      const subOther = {
        name:"",
      };

      let priorAttack = false;
      let includeAttack = false;
      let seconAttack = false;
      let priorDegats = false;
      let includeDegats = false;
      let seconDegats = false;
      let priorViolence = false;
      let includeViolence = false;
      let seconViolence = false;
      let other = false;

      const dgtsJet = dataDegats.jet === undefined ? 0 : dataDegats.jet;
      const dgtsFixe = dataDegats.fixe === undefined ? 0 : dataDegats.fixe;
      const violJet = dataViolence.jet === undefined ? 0 : dataViolence.jet;
      const violFixe = dataViolence.fixe === undefined ? 0 : dataViolence.fixe;

      if(dataAttack.conditionnel.has) {
        priorAttack = true;

        const cACDice = dataAttack.jet;
        const cACFixe = dataAttack.reussite;

        const cACDCar = dataAttack.carac.jet;
        const cACFCar = dataAttack.carac.fixe;
        const cACDAsp = dataAttack.aspect.jet;
        const cACFAsp = dataAttack.aspect.fixe;
        const cACDOD = dataAttack.carac.odInclusJet;
        const cACFOD = dataAttack.carac.odInclusFixe;
        const cACDAE = dataAttack.aspect.aeInclusJet;
        const cACFAE = dataAttack.aspect.aeInclusFixe;

        let CACDiceT = 0;
        let CACDiceB = 0;

        CACDiceT += cACDice;
        CACDiceB += cACFixe;

        if(cACDCar !== '' && !isPNJ) {
          CACDiceT += getCaracValue(cACDCar, this.data.actor);

          if(cACDOD) { CACDiceT += getODValue(cACDCar, this.data.actor); }
        }

        if(cACFCar !== '' && !isPNJ) {
          CACDiceB += getCaracValue(cACFCar, this.data.actor);

          if(cACFOD) { CACDiceB += getODValue(cACFCar, this.data.actor); }
        }

        if(cACDAsp !== '' && isPNJ) {
          CACDiceT += getAspectValue(cACDAsp, this.data.actor);

          if(cACDAE) { CACDiceT += getAEValue(cACDAsp, this.data.actor); }
        }

        if(cACFAsp !== '' && isPNJ) {
          CACDiceB += getAspectValue(cACFAsp, this.data.actor);

          if(cACFAE) { CACDiceB += getAEValue(cACFCar, this.data.actor); }
        }

        if(CACDiceT > 0) {
          const sJet = CACDiceB > 0 ? `${CACDiceT}D6+${CACDiceB}` : `${CACDiceT}D6`;
          const sDJet = CACDiceB > 0 ? `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 + ${CACDiceB}` : `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;

          const cACSub = new game.knight.RollKnight(sJet, actor.system);
          cACSub._success = true;
          cACSub._pairOrImpair = guidage ? 1 : 0;
          cACSub._details = sDJet;
          await cACSub.evaluateSuccess();

          subAttack.name = `+ ${name}`;
          subAttack.desc = dataAttack.conditionnel.condition;
          subAttack.tooltip = await cACSub.getTooltip();
          subAttack.total = cACSub._totalSuccess;
          subAttack.formula = cACSub._formula;

          rollAtt = rollAtt.concat(cACSub);
        } else if(CACDiceB > 0) {
          subAttack.name = `+ ${name}`;
          subAttack.desc = dataAttack.conditionnel.condition;
          subAttack.total = CACDiceB;
        }
      } else if(dataAttack.jet !== 0 || dataAttack.reussite !== 0 || dataAttack.carac.jet !== '' || dataAttack.carac.fixe !== ''|| dataAttack.aspect.jet !== '' || dataAttack.aspect.fixe !== '') {
        includeAttack = true;

        const cAIDice = dataAttack.jet;
        const cAIFixe = dataAttack.reussite;

        const cAIDCar = dataAttack.carac.jet;
        const cAIFCar = dataAttack.carac.fixe;
        const cAIFOD = dataAttack.carac.odInclusFixe;
        const cAIDOD = dataAttack.carac.odInclusJet;
        const cAIDAsp = dataAttack.aspect.jet;
        const cAIFAsp = dataAttack.aspect.fixe;
        const cAIFAE = dataAttack.aspect.odInclusFixe;
        const cAIDAE = dataAttack.aspect.odInclusJet;

        let CAIDiceT = 0;
        let CAIDiceB = 0;

        CAIDiceT += cAIDice;
        CAIDiceB += cAIFixe;

        if(cAIDCar !== '' && !isPNJ) {
          CAIDiceT += getCaracValue(cAIDCar, actor._id);

          if(cAIDOD) { CAIDiceT += getODValue(cAIDCar, actor._id); }
        }

        if(cAIFCar !== '' && !isPNJ) {
          CAIDiceB += getCaracValue(cAIFCar, actor._id);

          if(cAIFOD) { CAIDiceB += getODValue(cAIFCar, actor._id); }
        }

        if(cAIDCar !== '' && isPNJ) {
          CAIDiceT += getAspectValue(cAIDAsp, actor._id);

          if(cAIDAE) { CAIDiceT += getAEValue(cAIDAsp, actor._id); }
        }

        if(cAIFAsp !== '' && isPNJ) {
          CAIDiceB += getAspectValue(cAIFCar, actor._id);

          if(cAIFAE) { CAIDiceB += getAEValue(cAIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CAIDiceT > 0) { sJet += `${CAIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CAIDiceT > 0 && CAIDiceB > 0) { sJet += `+${CAIDiceB}`; }
        if(CAIDiceT === 0 && CAIDiceB > 0) { sJet += `${CAIDiceB}`; }

        if(sJet !== '') {
          subAttack.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subAttack.desc = description;

          attackDice += CAIDiceT;
          attackBonus += CAIDiceB;
        }
      }

      if(dataDegats.conditionnel.has) {
        priorDegats = true;

        const cDCDice = dataDegats.jet;
        const cDCFixe = dataDegats.fixe;

        const cDCDCar = dataDegats.carac.jet;
        const cDCFCar = dataDegats.carac.fixe;
        const cDCDOD = dataDegats.carac.odInclusJet;
        const cDCFOD = dataDegats.carac.odInclusFixe;
        const cDCDAsp = dataDegats.aspect.jet;
        const cDCFAsp = dataDegats.aspect.fixe;
        const cDCDAE = dataDegats.aspect.odInclusJet;
        const cDCFAE = dataDegats.aspect.odInclusFixe;

        let CDCDiceT = 0;
        let CDCDiceB = 0;

        CDCDiceT += cDCDice;
        CDCDiceB += cDCFixe;

        if(cDCDCar !== '' && !isPNJ) {
          CDCDiceT += getCaracValue(cDCDCar, actor._id);

          if(cDCDOD) { CDCDiceT += getODValue(cDCDCar, actor._id); }
        }

        if(cDCFCar !== '' && !isPNJ) {
          CDCDiceB += getCaracValue(cDCFCar, actor._id);

          if(cDCFOD) { CDCDiceB += getODValue(cDCFCar, actor._id); }
        }

        if(cDCDAsp !== '' && isPNJ) {
          CDCDiceT += getAspectValue(cDCDAsp, actor._id);

          if(cDCDAE) { CDCDiceT += getAEValue(cDCDAsp, actor._id); }
        }

        if(cDCFAsp !== '' && isPNJ) {
          CDCDiceB += getCaracValue(cDCFAsp, actor._id);

          if(cDCFAE) { CDCDiceB += getAEValue(cDCFAsp, actor._id); }
        }

        if(CDCDiceT > 0) {
          const sJet = CDCDiceB > 0 ? `${CDCDiceT}D6+${CDCDiceB}` : `${CDCDiceT}D6`;

          const cDCSub = new game.knight.RollKnight(sJet, actor.system);
          cDCSub._success = false;
          cDCSub._hasMin = bourreau ? true : false;

          if(bourreau) {
            cDCSub._seuil = bourreauValue;
            cDCSub._min = 4;
          }

          await cDCSub.evaluate(minMaxDgts);

          subDegats.name = `+ ${name}`;
          subDegats.desc = dataDegats.conditionnel.condition;
          subDegats.tooltip = await cDCSub.getTooltip();
          subDegats.total = cDCSub.total;
          subDegats.formula = cDCSub._formula;

          rollDgts = rollDgts.concat(cDCSub);
        } else if(CDCDiceB > 0) {
          subDegats.name = `+ ${name}`;
          subDegats.desc = dataDegats.conditionnel.condition;
          subDegats.total = CDCDiceB;
        }
      } else if(dgtsJet !== 0 || dgtsFixe !== 0 || dataDegats.carac.jet !== '' || dataDegats.carac.fixe !== '' || dataDegats.aspect.jet !== '' || dataDegats.aspect.fixe !== '') {
        includeDegats = true;

        const cDIDice = dataDegats.jet;
        const cDIFixe = dataDegats.fixe;

        const cDIDCar = dataDegats.carac.jet;
        const cDIFCar = dataDegats.carac.fixe;
        const cDIDOD = dataDegats.carac.odInclusJet;
        const cDIFOD = dataDegats.carac.odInclusFixe;
        const cDIDAsp = dataDegats.aspect.jet;
        const cDIFAsp = dataDegats.aspect.fixe;
        const cDIDAE = dataDegats.aspect.odInclusJet;
        const cDIFAE = dataDegats.aspect.odInclusFixe;

        let CDIDiceT = 0;
        let CDIDiceB = 0;

        CDIDiceT += cDIDice;
        CDIDiceB += cDIFixe;

        if(cDIDCar !== '' && !isPNJ) {
          CDIDiceT += getCaracValue(cDIDCar, actor._id);

          if(cDIDOD) { CDIDiceT += getODValue(cDIDCar, actor._id); }
        }

        if(cDIFCar !== '' && !isPNJ) {
          CDIDiceB += getCaracValue(cDIFCar, actor._id);

          if(cDIFOD) { CDIDiceB += getODValue(cDIFCar, actor._id); }
        }

        if(cDIDAsp !== '' && isPNJ) {
          CDIDiceT += getAspectValue(cDIDAsp, actor._id);

          if(cDIDAE) { CDIDiceT += getAEValue(cDIDAsp, actor._id); }
        }

        if(cDIFAsp !== '' && isPNJ) {
          CDIDiceB += getAspectValue(cDIFAsp, actor._id);

          if(cDIFAE) { CDIDiceB += getAEValue(cDIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CDIDiceT > 0) { sJet += `${CDIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CDIDiceT > 0 && CDIDiceB > 0) { sJet += `+${CDIDiceB}`; }
        if(CDIDiceT === 0 && CDIDiceB > 0) { sJet += `${CDIDiceB}`; }

        if(sJet !== '') {
          subDegats.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDegats.desc = description;

          dgtsDice += CDIDiceT;
          dgtsBonus += CDIDiceB;
        }
      }

      if(dataViolence.conditionnel.has) {
        priorViolence = true;

        const cVCDice = dataViolence.jet;
        const cVCFixe = dataViolence.fixe;

        const cVCDCar = dataViolence.carac.jet;
        const cVCFCar = dataViolence.carac.fixe;
        const cVCDOD = dataViolence.carac.odInclusJet;
        const cVCFOD = dataViolence.carac.odInclusFixe;
        const cVCDAsp = dataViolence.aspect.jet;
        const cVCFAsp = dataViolence.aspect.fixe;
        const cVCDAE = dataViolence.aspect.odInclusJet;
        const cVCFAE = dataViolence.aspect.odInclusFixe;

        let CVCDiceT = 0;
        let CVCDiceB = 0;

        CVCDiceT += cVCDice;
        CVCDiceB += cVCFixe;

        if(cVCDCar !== '' && !isPNJ) {
          CVCDiceT += getCaracValue(cVCDCar, actor._id);

          if(cVCDOD) { CVCDiceT += getODValue(cVCDCar, actor._id); }
        }

        if(cVCFCar !== '' && !isPNJ) {
          CVCDiceB += getCaracValue(cVCFCar, actor._id);

          if(cVCFOD) { CVCDiceB += getODValue(cVCFCar, actor._id); }
        }

        if(cVCDAsp !== '' && isPNJ) {
          CVCDiceT += getAspectValue(cVCDAsp, actor._id);

          if(cVCDAE) { CVCDiceT += getAEValue(cVCDAsp, actor._id); }
        }

        if(cVCFAsp !== '' && isPNJ) {
          CVCDiceB += getAspectValue(cVCFAsp, actor._id);

          if(cVCFAE) { CVCDiceB += getAEValue(cVCFAsp, actor._id); }
        }

        if(CVCDiceT > 0) {
          const sJet = CVCDiceB > 0 ? `${CVCDiceT}D6+${CVCDiceB}` : `${CVCDiceT}D6`;

          const cVCSub = new game.knight.RollKnight(sJet, actor.system);
          cVCSub._success = false;
          cVCSub._hasMin = devastation ? true : false;

          if(devastation) {
            cVCSub._seuil = devastationValue;
            cVCSub._min = 5;
          }

          await cVCSub.evaluate(minMaxViolence);

          subViolence.name = `+ ${name}`;
          subViolence.desc = dataViolence.conditionnel.condition;
          subViolence.tooltip = await cVCSub.getTooltip();
          subViolence.total = cVCSub.total;
          subViolence.formula = cVCSub._formula;

          rollViol = rollViol.concat(cVCSub);
        } else if(CVCDiceB > 0) {
          subViolence.name = `+ ${name}`;
          subViolence.desc = dataViolence.conditionnel.condition;
          subViolence.total = CVCDiceB;
        }
      } else if(violJet !== 0 || violFixe !== 0 || dataViolence.carac.jet !== '' || dataViolence.carac.fixe !== '' || dataViolence.aspect.jet !== '' || dataViolence.aspect.fixe !== '') {
        includeViolence = true;

        const cVIDice = dataViolence.jet;
        const cVIFixe = dataViolence.fixe;

        const cVIDCar = dataViolence.carac.jet;
        const cVIFCar = dataViolence.carac.fixe;
        const cVIDOD = dataViolence.carac.odInclusJet;
        const cVIFOD = dataViolence.carac.odInclusFixe;
        const cVIDAsp = dataViolence.aspect.jet;
        const cVIFAsp = dataViolence.aspect.fixe;
        const cVIDAE = dataViolence.aspect.odInclusJet;
        const cVIFAE = dataViolence.aspect.odInclusFixe;

        let CVIDiceT = 0;
        let CVIDiceB = 0;

        CVIDiceT += cVIDice;
        CVIDiceB += cVIFixe;

        if(cVIDCar !== '' && !isPNJ) {
          CVIDiceT += getCaracValue(cVIDCar, actor._id);

          if(cVIDOD) { CVIDiceT += getODValue(cVIDCar, actor._id); }
        }

        if(cVIFCar !== '' && !isPNJ) {
          CVIDiceB += getCaracValue(cVIFCar, actor._id);

          if(cVIFOD) { CVIDiceB += getODValue(cVIFCar, actor._id); }
        }

        if(cVIDAsp !== '' && isPNJ) {
          CVIDiceT += getAspectValue(cVIDAsp, actor._id);

          if(cVIDAE) { CVIDiceT += getAEValue(cVIDAsp, actor._id); }
        }

        if(cVIFAsp !== '' && isPNJ) {
          CVIDiceB += getAspectValue(cVIFAsp, actor._id);

          if(cVIFAE) { CVIDiceB += getAEValue(cVIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CVIDiceT > 0) { sJet += `${CVIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CVIDiceT > 0 && CVIDiceB > 0) { sJet += `+${CVIDiceB}`; }
        if(CVIDiceT === 0 && CVIDiceB > 0) { sJet += `${CVIDiceB}`; }

        if(sJet !== '') {
          subViolence.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = description;

          violenceDice += CVIDiceT;
          violenceBonus += CVIDiceB;
        }
      }

      if(priorAttack === false && priorDegats === false && priorViolence === false && includeAttack === false && includeDegats === false && includeViolence === false) {
        other = true;

        subOther.name = name;
        subOther.desc = description.replace(/(<([^>]+)>)/gi, "");
      }

      if(priorAttack && subAttack.name !== '') {
        sPAttack.push(subAttack);
      }

      if(includeAttack && subAttack.name !== '') {
        sIAttack.push(subAttack);
      }

      if(priorDegats && subDegats.name !== '') {
        sPDegats.push(subDegats);
      }

      if(includeDegats && subDegats.name !== '') {
        sIDegats.push(subDegats);
      }

      if(priorViolence && subViolence.name !== '') {
        sPViolence.push(subViolence);
      }

      if(includeViolence && subViolence.name !== '') {
        sIViolence.push(subViolence);
      }

      if(other) {
        sOther.push(subOther);
      }
    }

    sIAttack.sort(SortByName);
    sPAttack.sort(SortByName);
    sSAttack.sort(SortByName);
    sIDegats.sort(SortByName);
    sPDegats.sort(SortByName);
    sSDegats.sort(SortByName);
    sPViolence.sort(SortByName);
    sSViolence.sort(SortByName);
    sOther.sort(SortByName);

    const sAttack = sPAttack.concat(sSAttack);
    const sDegats = sPDegats.concat(sSDegats);
    const sViolence = sPViolence.concat(sSViolence);

    return {
      guidage:guidage ? true : false,
      regularite:regularite ? true : false,
      bourreau:bourreau ? true : false,
      bourreauValue:bourreauValue,
      devastation:devastation ? true : false,
      devastationValue:devastationValue,
      barrageValue:barrageValue,
      depenseEnergie:depenseEnergie,
      onlyAttack:onlyAttack,
      onlyDgts:onlyDgts,
      onlyViolence:onlyViolence,
      nRoll:nRoll,
      attack:{
        totalDice:attackDice,
        totalBonus:attackBonus,
        include:sIAttack,
        list:sAttack,
      },
      degats:{
        totalDice:dgtsDice,
        totalBonus:dgtsBonus,
        include:sIDegats,
        list:sDegats,
        minMax:minMaxDgts,
      },
      violence:{
        totalDice:violenceDice,
        totalBonus:violenceBonus,
        include:sIViolence,
        list:sViolence,
        minMax:minMaxViolence,
      },
      other:sOther,
      rollAtt:rollAtt,
      rollDgts:rollDgts,
      rollViol:rollViol
    }
}

export async function getDistance(actor, typeWpn, data, effetsWpn, distanceWpn, isPNJ = false) {
  const sIAttack = [];
  const sPAttack = [];
  const sSAttack = [];

  const sPDegats = [];
  const sIDegats = [];
  const sSDegats = [];

  const sPViolence = [];
  const sIViolence = [];
  const sSViolence = [];

  const sOther = [];

  const minMaxDgts = {
      minimize:false,
      maximize:false,
      async:true
  };

  const minMaxViolence = {
      minimize:false,
      maximize:false,
      async:true
  };

  let onlyAttack = false;
  let barrageValue = 0;
  let nRoll = 1;

  let attackDice = 0;
  let attackBonus = 0;

  let dgtsDice = 0;
  let dgtsBonus = 0;

  let violenceDice = 0;
  let violenceBonus = 0;

  if(typeWpn === 'contact' || typeWpn === 'grenades' || typeWpn === 'armesimprovisees'
  || typeWpn === 'base' || typeWpn === 'c1' || typeWpn === 'c2') return {
      onlyAttack:onlyAttack,
      nRoll:nRoll,
      attack:{
      totalDice:attackDice,
      totalBonus:attackBonus,
      include:sIAttack,
      list:sSAttack,
      },
      degats:{
      totalDice:dgtsDice,
      totalBonus:dgtsBonus,
      include:sIDegats,
      list:sSDegats,
      minMax:minMaxDgts,
      },
      violence:{
      totalDice:violenceDice,
      totalBonus:violenceBonus,
      include:sIViolence,
      list:sSViolence,
      minMax:minMaxViolence,
      },
      other:sOther,
      rollAtt:[],
      rollDgts:[],
      rollViol:[]
  };

  const ghostConflit = actor?.armureData?.system?.capacites?.selected?.ghost?.active?.conflit || false;
  const ghostHConflit = actor?.armureData?.system?.capacites?.selected?.ghost?.active?.horsconflit || false;
  const ersatzRogue = actor?.moduleErsatz?.rogue?.has || false;

  const changelingPersonnel = actor?.armureData?.system?.capacites?.selected?.changeling?.active?.personnel || false;
  const changelingEtendue = actor?.armureData?.system?.capacites?.selected?.changeling?.active?.etendue || false;
  const ersatzBard = actor?.moduleErsatz?.bard?.has || false;

  const hasGhost = searchTrueValue([ghostConflit, ghostHConflit, ersatzRogue]);
  const hasChangeling = searchTrueValue([changelingPersonnel, changelingEtendue, ersatzBard]);

  const guidage = data.guidage;
  const tenebricide = data.tenebricide;
  const obliteration = searchTrueValue([data.obliteration, data.cranerieur]);
  const assassin = effetsWpn.raw.find(str => { if(str.includes('assassin')) return true; });
  const silencieux = effetsWpn.raw.find(str => { if(str.includes('silencieux')) return true; });
  const bourreau = effetsWpn.raw.find(str => { if(str.includes('bourreau')) return true; });
  const bourreauValue = bourreau ? bourreau.split(' ')[1] : 0;
  const devastation = effetsWpn.raw.find(str => { if(str.includes('devastation')) return true; });
  const devastationValue = devastation ? devastation.split(' ')[1] : 0;
  const regularite = effetsWpn.raw.find(str => { if(str.includes('regularite')) return true; });

  if(obliteration) { minMaxDgts.maximize = true; }

  let rollAtt = [];
  let rollDgts = [];
  let rollViol = [];

  for(let i = 0;i < distanceWpn.raw.length;i++) {
      const string = distanceWpn.raw[i].split(' ');
      const name = string[0].split('<space>')[0];
      const details = [...string[0].split('<space>')].splice(1, 1).join(' ');
      const value = string[1] === undefined ? '' : string[1];

      const sub = {};
      const subDgts = {};
      const subViolence = {};

      let priorAttack = false;
      let includeAttack = false;
      let seconAttack = false;
      let priorDegats = false;
      let includeDegats = false;
      let seconDegats = false;
      let priorViolence = false;
      let includeViolence = false;
      let seconViolence = false;
      let other = false;

      switch(name) {
      case 'canonlong':
          priorAttack = true;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
      break;

      case 'canonraccourci':
          priorAttack = true;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
      break;

      case 'chambredouble':
          const chambredouble = data.chambredouble;

          if(chambredouble) {
          includeAttack = true;

          sub.name = `-3${game.i18n.localize('KNIGHT.JETS.Des-short')} ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          attackDice -= 3;
          nRoll = 2;
          } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          }
          break;

      case 'chargeurballesgrappes':
        const hasGrappe = data.ameliorations.grappes;

        if(hasGrappe !== false || hasGrappe === undefined) {
          includeDegats = true;
          includeViolence = true;

          subDgts.name = `-1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          subViolence.name = `+1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          dgtsDice -= 1;
          violenceDice += 1;
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
      break;

      case 'chargeurmunitionsexplosives':
        const hasExplosive = data.ameliorations.explosives;

        if(hasExplosive !== false || hasExplosive === undefined) {
          includeDegats = true;
          includeViolence = true;

          subDgts.name = `+1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          subViolence.name = `-1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          dgtsDice += 1;
          violenceDice -= 1;
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
      break;

      case 'interfaceguidage':
          includeAttack = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
      break;

      case 'jumelageakimbo':
          if(typeWpn === 'tourelle' || isPNJ) other = true;
          else includeAttack = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} ${details} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
      break;

      case 'jumelageambidextrie':
          if(!data.jumelageambidextrie || typeWpn === 'tourelle' || isPNJ) other = true;
          else if(data.jumelageambidextrie) includeAttack = true;
          else other = true;

          if(other) {
          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} ${details}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          } else {
          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} ${details} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          }
      break;

      case 'lunetteintelligente':
          priorAttack = true;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
      break;

      case 'munitionshypervelocite':
        const hasHVelocite = data.ameliorations.hypervelocite;

        if(hasHVelocite !== false || hasHVelocite === undefined) {
          priorAttack = true;

          sub.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
      break;

      case 'munitionsdrones':
        const hasHDrones = data.ameliorations.drones;

        if(hasHDrones !== false || hasHDrones === undefined) {
          includeAttack = true;

          sub.name = `+3 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          attackBonus += 3;
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
      break;

      case 'pointeurlaser':
          includeAttack = true;

          sub.name = `+1 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          attackBonus += 1;
      break;

      case 'munitionsiem':
        const hasIEM = data.ameliorations.iem;

        if(hasIEM !== false || hasIEM === undefined) {
          priorAttack = true;
          includeDegats = true;
          includeViolence = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          subDgts.name = `-1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          subViolence.name = `-1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          dgtsDice -= 1;
          violenceDice -= 1;
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
      break;

      case 'munitionsnonletales':
        const haNLetales = data.ameliorations.nonletales;

        if(haNLetales !== false || haNLetales === undefined) {
          seconDegats = true;
          seconViolence = true;

          subDgts.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

          subViolence.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
      break;

      case 'munitionssubsoniques':
        const haSubsoniques = data.ameliorations.subsoniques;

        if(haSubsoniques !== false || haSubsoniques === undefined) {
          if(typeWpn === 'tourelle') {
            other = true;
            sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
            sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          } else {
            if(!silencieux) {
              const discretion = isPNJ ? +actor.system.aspects.masque.value : +actor.system.aspects.masque.caracteristiques.discretion.value;
              const discretionOD = isPNJ ? +actor.system.aspects.masque.ae.mineur.value + +actor.system.aspects.masque.ae.majeur.value : +actor.system.aspects.masque.caracteristiques.discretion.overdrive.value;

              if((hasGhost && !isPNJ) || (hasChangeling && isPNJ)) {
                  includeDegats = true;

                  subDgts.name = `+${discretion+discretionOD} ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
                  subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);

                  dgtsBonus += discretion+discretionOD;
              } else {
                  priorDegats = true;

                  subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
                  subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
                  subDgts.total = discretion+discretionOD;
              }
            } else {
              other = true;

              sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
              sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
            }
          }
        } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
        }
          break;

      case 'protectionarme':
      case 'structurealpha':
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          break;

      case 'revetementomega':
          const vAssassin = +assassin?.split(' ')[1] || false;

          if(!assassin) {
          priorDegats = true;

          const aSDice = tenebricide === true ? Math.floor(value/2) : 2;

          const aSub = new game.knight.RollKnight(`${aSDice}D6`, actor.system);
          aSub._success = false;
          aSub._hasMin = bourreau ? true : false;

          if(bourreau) {
              aSub._seuil = bourreauValue;
              aSub._min = 4;
          }
          await aSub.evaluate(minMaxDgts);

          subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} ${value}`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          subDgts.tooltip = await aSub.getTooltip();
          subDgts.total = aSub._total;
          subDgts.formula = aSub._formula;

          rollDgts = rollDgts.concat(aSub);
          } else {
            if(vAssassin >= 2) {
                other = true;

                sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
                sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
            } else {
                priorDegats = true;

                const aSDice = tenebricide === true ? Math.floor(value/2) : value;

                const aSub = new game.knight.RollKnight(`${aSDice}D6`, actor.system);
                aSub._success = false;
                aSub._hasMin = bourreau ? true : false;

                if(bourreau) {
                aSub._seuil = bourreauValue;
                aSub._min = 4;
                }
                await aSub.evaluate(minMaxDgts);

                subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)} ${value}`;
                subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
                subDgts.tooltip = await aSub.getTooltip();
                subDgts.total = aSub._total;
                subDgts.formula = aSub._formula;

                rollDgts = rollDgts.concat(aSub);
            }
          }
          break;

      case 'systemerefroidissement':
          if(!data.systemerefroidissement) {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.distance[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.distance[name].description}-short`);
          } else {
          barrageValue = 1;
          onlyAttack = true;
          }
          break;
      }

      if(includeAttack) { sIAttack.push(sub); } else
      if(priorAttack) { sPAttack.push(sub); } else
      if(seconAttack) { sSAttack.push(sub); }

      if(includeDegats) { sIDegats.push(subDgts); } else
      if(priorDegats) { sPDegats.push(subDgts); } else
      if(seconDegats) { sSDegats.push(subDgts); }

      if(includeViolence) { sIViolence.push(subViolence); } else
      if(priorViolence) { sPViolence.push(subViolence); } else
      if(seconViolence) { sSViolence.push(subViolence); }

      if(other) { sOther.push(sub); }
  }

  for(let i = 0;i < distanceWpn.custom.length;i++) {
      const data = distanceWpn.custom[i];
      const dataAttack = data.attaque;
      const dataDegats = data.degats;
      const dataViolence = data.violence;

      const name = data.label;
      const description = data.description;
      const subAttack = {};
      const subDegats = {};
      const subViolence = {};
      const subOther = {};

      let priorAttack = false;
      let includeAttack = false;
      let seconAttack = false;
      let priorDegats = false;
      let includeDegats = false;
      let seconDegats = false;
      let priorViolence = false;
      let includeViolence = false;
      let seconViolence = false;
      let other = false;

      if(dataAttack.conditionnel.has) {
        priorAttack = true;

        const cACDice = dataAttack.jet;
        const cACFixe = dataAttack.reussite;

        const cACDCar = dataAttack.carac.jet;
        const cACFCar = dataAttack.carac.fixe;
        const cACDAsp = dataAttack.aspect.jet;
        const cACFAsp = dataAttack.aspect.fixe;
        const cACDOD = dataAttack.carac.odInclusJet;
        const cACFOD = dataAttack.carac.odInclusFixe;
        const cACDAE = dataAttack.aspect.aeInclusJet;
        const cACFAE = dataAttack.aspect.aeInclusFixe;

        let CACDiceT = 0;
        let CACDiceB = 0;

        CACDiceT += cACDice;
        CACDiceB += cACFixe;

        if(cACDCar !== '' && !isPNJ) {
          CACDiceT += getCaracValue(cACDCar, actor._id);

          if(cACDOD) { CACDiceT += getODValue(cACDCar, actor._id); }
        }

        if(cACFCar !== '' && !isPNJ) {
          CACDiceB += getCaracValue(cACFCar, actor._id);

          if(cACFOD) { CACDiceB += getODValue(cACFCar, actor._id); }
        }

        if(cACDAsp !== '' && isPNJ) {
          CACDiceT += getAspectValue(cACDAsp, actor._id);

          if(cACDAE) { CACDiceT += getAEValue(cACDAsp, actor._id); }
        }

        if(cACFAsp !== '' && isPNJ) {
          CACDiceB += getAspectValue(cACFAsp, actor._id);

          if(cACFAE) { CACDiceB += getAEValue(cACFCar, actor._id); }
        }

        if(CACDiceT > 0) {
          const sJet = CACDiceB > 0 ? `${CACDiceT}D6+${CACDiceB}` : `${CACDiceT}D6`;
          const sDJet = CACDiceB > 0 ? `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 + ${CACDiceB}` : `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;

          const cACSub = new game.knight.RollKnight(sJet, actor.system);
          cACSub._success = true;
          cACSub._pairOrImpair = guidage ? 1 : 0;
          cACSub._details = sDJet;
          await cACSub.evaluateSuccess();

          subAttack.name = `+ ${name}`;
          subAttack.desc = dataAttack.conditionnel.condition;
          subAttack.tooltip = await cACSub.getTooltip();
          subAttack.total = cACSub._totalSuccess;
          subAttack.formula = cACSub._formula;

          rollAtt = rollAtt.concat(cACSub);
        } else if(CACDiceB > 0) {
          subAttack.name = `+ ${name}`;
          subAttack.desc = dataAttack.conditionnel.condition;
          subAttack.total = CACDiceB;
        }
      } else if(dataAttack.jet !== 0 || dataAttack.reussite !== 0 || dataAttack.carac.jet !== '' || dataAttack.carac.fixe !== ''|| dataAttack.aspect.jet !== '' || dataAttack.aspect.fixe !== '') {
        includeAttack = true;

        const cAIDice = dataAttack.jet;
        const cAIFixe = dataAttack.reussite;

        const cAIDCar = dataAttack.carac.jet;
        const cAIFCar = dataAttack.carac.fixe;
        const cAIFOD = dataAttack.carac.odInclusFixe;
        const cAIDOD = dataAttack.carac.odInclusJet;
        const cAIDAsp = dataAttack.aspect.jet;
        const cAIFAsp = dataAttack.aspect.fixe;
        const cAIFAE = dataAttack.aspect.odInclusFixe;
        const cAIDAE = dataAttack.aspect.odInclusJet;

        let CAIDiceT = 0;
        let CAIDiceB = 0;

        CAIDiceT += cAIDice;
        CAIDiceB += cAIFixe;

        if(cAIDCar !== '' && !isPNJ) {
          CAIDiceT += getCaracValue(cAIDCar, actor._id);

          if(cAIDOD) { CAIDiceT += getODValue(cAIDCar, actor._id); }
        }

        if(cAIFCar !== '' && !isPNJ) {
          CAIDiceB += getCaracValue(cAIFCar, actor._id);

          if(cAIFOD) { CAIDiceB += getODValue(cAIFCar, actor._id); }
        }

        if(cAIDCar !== '' && isPNJ) {
          CAIDiceT += getAspectValue(cAIDAsp, actor._id);

          if(cAIDAE) { CAIDiceT += getAEValue(cAIDAsp, actor._id); }
        }

        if(cAIFAsp !== '' && isPNJ) {
          CAIDiceB += getAspectValue(cAIFCar, actor._id);

          if(cAIFAE) { CAIDiceB += getAEValue(cAIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CAIDiceT > 0) { sJet += `${CAIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CAIDiceT > 0 && CAIDiceB > 0) { sJet += `+${CAIDiceB}`; }
        if(CAIDiceT === 0 && CAIDiceB > 0) { sJet += `${CAIDiceB}`; }

        if(sJet !== '') {
          subAttack.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subAttack.desc = description;

          attackDice += CAIDiceT;
          attackBonus += CAIDiceB;
        }
      }

      if(dataDegats.conditionnel.has) {
        priorDegats = true;

        const cDCDice = dataDegats.jet;
        const cDCFixe = dataDegats.fixe;

        const cDCDCar = dataDegats.carac.jet;
        const cDCFCar = dataDegats.carac.fixe;
        const cDCDOD = dataDegats.carac.odInclusJet;
        const cDCFOD = dataDegats.carac.odInclusFixe;
        const cDCDAsp = dataDegats.aspect.jet;
        const cDCFAsp = dataDegats.aspect.fixe;
        const cDCDAE = dataDegats.aspect.odInclusJet;
        const cDCFAE = dataDegats.aspect.odInclusFixe;

        let CDCDiceT = 0;
        let CDCDiceB = 0;

        CDCDiceT += cDCDice;
        CDCDiceB += cDCFixe;

        if(cDCDCar !== '' && !isPNJ) {
          CDCDiceT += getCaracValue(cDCDCar, actor._id);

          if(cDCDOD) { CDCDiceT += getODValue(cDCDCar, actor._id); }
        }

        if(cDCFCar !== '' && !isPNJ) {
          CDCDiceB += getCaracValue(cDCFCar, actor._id);

          if(cDCFOD) { CDCDiceB += getODValue(cDCFCar, actor._id); }
        }

        if(cDCDAsp !== '' && isPNJ) {
          CDCDiceT += getAspectValue(cDCDAsp, actor._id);

          if(cDCDAE) { CDCDiceT += getAEValue(cDCDAsp, actor._id); }
        }

        if(cDCFAsp !== '' && isPNJ) {
          CDCDiceB += getCaracValue(cDCFAsp, actor._id);

          if(cDCFAE) { CDCDiceB += getAEValue(cDCFAsp, actor._id); }
        }

        if(CDCDiceT > 0) {
          const sJet = CDCDiceB > 0 ? `${CDCDiceT}D6+${CDCDiceB}` : `${CDCDiceT}D6`;

          const cDCSub = new game.knight.RollKnight(sJet, actor.system);
          cDCSub._success = false;
          cDCSub._hasMin = bourreau ? true : false;

          if(bourreau) {
            cDCSub._seuil = bourreauValue;
            cDCSub._min = 4;
          }

          await cDCSub.evaluate(minMaxDgts);

          subDegats.name = `+ ${name}`;
          subDegats.desc = dataDegats.conditionnel.condition;
          subDegats.tooltip = await cDCSub.getTooltip();
          subDegats.total = cDCSub.total;
          subDegats.formula = cDCSub._formula;

          rollDgts = rollDgts.concat(cDCSub);
        } else if(CDCDiceB > 0) {
          subDegats.name = `+ ${name}`;
          subDegats.desc = dataDegats.conditionnel.condition;
          subDegats.total = CDCDiceB;
        }
      } else if(dataDegats.jet !== 0 || dataDegats.fixe !== 0 || dataDegats.carac.jet !== '' || dataDegats.carac.fixe !== '' || dataDegats.aspect.jet !== '' || dataDegats.aspect.fixe !== '') {
        includeDegats = true;

        const cDIDice = dataDegats.jet;
        const cDIFixe = dataDegats.fixe;

        const cDIDCar = dataDegats.carac.jet;
        const cDIFCar = dataDegats.carac.fixe;
        const cDIDOD = dataDegats.carac.odInclusJet;
        const cDIFOD = dataDegats.carac.odInclusFixe;
        const cDIDAsp = dataDegats.aspect.jet;
        const cDIFAsp = dataDegats.aspect.fixe;
        const cDIDAE = dataDegats.aspect.odInclusJet;
        const cDIFAE = dataDegats.aspect.odInclusFixe;

        let CDIDiceT = 0;
        let CDIDiceB = 0;

        CDIDiceT += cDIDice;
        CDIDiceB += cDIFixe;

        if(cDIDCar !== '' && !isPNJ) {
          CDIDiceT += getCaracValue(cDIDCar, actor._id);

          if(cDIDOD) { CDIDiceT += getODValue(cDIDCar, actor._id); }
        }

        if(cDIFCar !== '' && !isPNJ) {
          CDIDiceB += getCaracValue(cDIFCar, actor._id);

          if(cDIFOD) { CDIDiceB += getODValue(cDIFCar, actor._id); }
        }

        if(cDIDAsp !== '' && isPNJ) {
          CDIDiceT += getAspectValue(cDIDAsp, actor._id);

          if(cDIDAE) { CDIDiceT += getAEValue(cDIDAsp, actor._id); }
        }

        if(cDIFAsp !== '' && isPNJ) {
          CDIDiceB += getAspectValue(cDIFAsp, actor._id);

          if(cDIFAE) { CDIDiceB += getAEValue(cDIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CDIDiceT > 0) { sJet += `${CDIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CDIDiceT > 0 && CDIDiceB > 0) { sJet += `+${CDIDiceB}`; }
        if(CDIDiceT === 0 && CDIDiceB > 0) { sJet += `${CDIDiceB}`; }

        if(sJet !== '') {
          subDegats.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDegats.desc = description;

          dgtsDice += CDIDiceT;
          dgtsBonus += CDIDiceB;
        }
      }

      if(dataViolence.conditionnel.has) {
        priorViolence = true;

        const cVCDice = dataViolence.jet;
        const cVCFixe = dataViolence.fixe;

        const cVCDCar = dataViolence.carac.jet;
        const cVCFCar = dataViolence.carac.fixe;
        const cVCDOD = dataViolence.carac.odInclusJet;
        const cVCFOD = dataViolence.carac.odInclusFixe;
        const cVCDAsp = dataViolence.aspect.jet;
        const cVCFAsp = dataViolence.aspect.fixe;
        const cVCDAE = dataViolence.aspect.odInclusJet;
        const cVCFAE = dataViolence.aspect.odInclusFixe;

        let CVCDiceT = 0;
        let CVCDiceB = 0;

        CVCDiceT += cVCDice;
        CVCDiceB += cVCFixe;

        if(cVCDCar !== '' && !isPNJ) {
          CVCDiceT += getCaracValue(cVCDCar, actor._id);

          if(cVCDOD) { CVCDiceT += getODValue(cVCDCar, actor._id); }
        }

        if(cVCFCar !== '' && !isPNJ) {
          CVCDiceB += getCaracValue(cVCFCar, actor._id);

          if(cVCFOD) { CVCDiceB += getODValue(cVCFCar, actor._id); }
        }

        if(cVCDAsp !== '' && isPNJ) {
          CVCDiceT += getAspectValue(cVCDAsp, actor._id);

          if(cVCDAE) { CVCDiceT += getAEValue(cVCDAsp, actor._id); }
        }

        if(cVCFAsp !== '' && isPNJ) {
          CVCDiceB += getAspectValue(cVCFAsp, actor._id);

          if(cVCFAE) { CVCDiceB += getAEValue(cVCFAsp, actor._id); }
        }

        if(CVCDiceT > 0) {
          const sJet = CVCDiceB > 0 ? `${CVCDiceT}D6+${CVCDiceB}` : `${CVCDiceT}D6`;

          const cVCSub = new game.knight.RollKnight(sJet, actor.system);
          cVCSub._success = false;
          cVCSub._hasMin = devastation ? true : false;

          if(devastation) {
            cVCSub._seuil = devastationValue;
            cVCSub._min = 5;
          }

          await cVCSub.evaluate(minMaxViolence);

          subViolence.name = `+ ${name}`;
          subViolence.desc = dataViolence.conditionnel.condition;
          subViolence.tooltip = await cVCSub.getTooltip();
          subViolence.total = cVCSub.total;
          subViolence.formula = cVCSub._formula;

          rollViol = rollViol.concat(cVCSub);
        } else if(CVCDiceB > 0) {
          subViolence.name = `+ ${name}`;
          subViolence.desc = dataViolence.conditionnel.condition;
          subViolence.total = CVCDiceB;
        }
      } else if(dataViolence.jet !== 0 || dataViolence.fixe !== 0 || dataViolence.carac.jet !== '' || dataViolence.carac.fixe !== '' || dataViolence.aspect.jet !== '' || dataViolence.aspect.fixe !== '') {
        includeViolence = true;

        const cVIDice = dataViolence.jet;
        const cVIFixe = dataViolence.fixe;

        const cVIDCar = dataViolence.carac.jet;
        const cVIFCar = dataViolence.carac.fixe;
        const cVIDOD = dataViolence.carac.odInclusJet;
        const cVIFOD = dataViolence.carac.odInclusFixe;
        const cVIDAsp = dataViolence.aspect.jet;
        const cVIFAsp = dataViolence.aspect.fixe;
        const cVIDAE = dataViolence.aspect.odInclusJet;
        const cVIFAE = dataViolence.aspect.odInclusFixe;

        let CVIDiceT = 0;
        let CVIDiceB = 0;

        CVIDiceT += cVIDice;
        CVIDiceB += cVIFixe;

        if(cVIDCar !== '' && !isPNJ) {
          CVIDiceT += getCaracValue(cVIDCar, actor._id);

          if(cVIDOD) { CVIDiceT += getODValue(cVIDCar, actor._id); }
        }

        if(cVIFCar !== '' && !isPNJ) {
          CVIDiceB += getCaracValue(cVIFCar, actor._id);

          if(cVIFOD) { CVIDiceB += getODValue(cVIFCar, actor._id); }
        }

        if(cVIDAsp !== '' && isPNJ) {
          CVIDiceT += getAspectValue(cVIDAsp, actor._id);

          if(cVIDAE) { CVIDiceT += getAEValue(cVIDAsp, actor._id); }
        }

        if(cVIFAsp !== '' && isPNJ) {
          CVIDiceB += getAspectValue(cVIFAsp, actor._id);

          if(cVIFAE) { CVIDiceB += getAEValue(cVIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CVIDiceT > 0) { sJet += `${CVIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CVIDiceT > 0 && CVIDiceB > 0) { sJet += `+${CVIDiceB}`; }
        if(CVIDiceT === 0 && CVIDiceB > 0) { sJet += `${CVIDiceB}`; }

        if(sJet !== '') {
          subViolence.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = description;

          violenceDice += CVIDiceT;
          violenceBonus += CVIDiceB;
        }
      }

      if(subAttack.name === undefined && subDegats.name === undefined && subViolence.name === undefined) {
      other = true;

      subOther.name = name;
      subOther.desc = description.replace(/(<([^>]+)>)/gi, "");
      }

      if(priorAttack && subAttack.name !== '') {
      sPAttack.push(subAttack);
      }

      if(includeAttack && subAttack.name !== '') {
      sIAttack.push(subAttack);
      }

      if(priorDegats && subDegats.name !== '') {
      sPDegats.push(subDegats);
      }

      if(includeDegats && subDegats.name !== '') {
      sIDegats.push(subDegats);
      }

      if(priorViolence && subViolence.name !== '') {
      sPViolence.push(subViolence);
      }

      if(includeViolence && subViolence.name !== '') {
      sIViolence.push(subViolence);
      }

      if(other) {
      sOther.push(subOther);
      }
  }

  sIAttack.sort(SortByName);
  sPAttack.sort(SortByName);
  sSAttack.sort(SortByName);
  sIDegats.sort(SortByName);
  sPDegats.sort(SortByName);
  sSDegats.sort(SortByName);
  sPViolence.sort(SortByName);
  sSViolence.sort(SortByName);
  sOther.sort(SortByName);

  const sAttack = sPAttack.concat(sSAttack);
  const sDegats = sPDegats.concat(sSDegats);
  const sViolence = sPViolence.concat(sSViolence);

  return {
      onlyAttack:onlyAttack,
      nRoll:nRoll,
      attack:{
      totalDice:attackDice,
      totalBonus:attackBonus,
      include:sIAttack,
      list:sAttack,
      },
      degats:{
      totalDice:dgtsDice,
      totalBonus:dgtsBonus,
      include:sIDegats,
      list:sDegats,
      minMax:minMaxDgts,
      },
      violence:{
      totalDice:violenceDice,
      totalBonus:violenceBonus,
      include:sIViolence,
      list:sViolence,
      minMax:minMaxViolence,
      },
      other:sOther,
      rollAtt:rollAtt,
      rollDgts:rollDgts,
      rollViol:rollViol
  }
}

export async function getStructurelle(actor, typeWpn, style, data, effetsWpn, structurellesWpn, isPNJ = false) {
const sIAttack = [];
const sPAttack = [];
const sSAttack = [];

const sPDegats = [];
const sIDegats = [];
const sSDegats = [];

const sPViolence = [];
const sIViolence = [];
const sSViolence = [];

const sOther = [];

const minMaxDgts = {
    minimize:false,
    maximize:false,
    async:true
};

const minMaxViolence = {
    minimize:false,
    maximize:false,
    async:true
};

let onlyAttack = false;
let nRoll = 1;

let attackDice = 0;
let attackBonus = 0;

let dgtsDice = 0;
let dgtsBonus = 0;

let violenceDice = 0;
let violenceBonus = 0;

let vDefense = 0;

if(typeWpn === 'distance' || typeWpn === 'grenades' || typeWpn === 'longbow' || typeWpn === 'tourelle' || typeWpn === 'armesimprovisees'
|| typeWpn === 'base' || typeWpn === 'c1' || typeWpn === 'c2') return {
    onlyAttack:onlyAttack,
    nRoll:nRoll,
    attack:{
    totalDice:attackDice,
    totalBonus:attackBonus,
    include:sIAttack,
    list:sSAttack,
    },
    degats:{
    totalDice:dgtsDice,
    totalBonus:dgtsBonus,
    include:sIDegats,
    list:sSDegats,
    minMax:minMaxDgts,
    },
    violence:{
    totalDice:violenceDice,
    totalBonus:violenceBonus,
    include:sIViolence,
    list:sSViolence,
    minMax:minMaxViolence,
    },
    defense:vDefense,
    other:sOther,
    rollAtt:[],
    rollDgts:[],
    rollViol:[]
};

const ghostConflit = actor?.armureData?.system?.capacites?.selected?.ghost?.active?.conflit || false;
const ghostHConflit = actor?.armureData?.system?.capacites?.selected?.ghost?.active?.horsconflit || false;
const ersatzRogue = actor?.moduleErsatz?.rogue?.has || false;

const changelingPersonnel = actor?.armureData?.system?.capacites?.selected?.changeling?.active?.personnel || false;
const changelingEtendue = actor?.armureData?.system?.capacites?.selected?.changeling?.active?.etendue || false;
const ersatzBard = actor?.moduleErsatz?.bard?.has || false;

const hasGhost = searchTrueValue([ghostConflit, ghostHConflit, ersatzRogue]);
const hasChangeling = searchTrueValue([changelingPersonnel, changelingEtendue, ersatzBard]);

const guidage = data.guidage;
const tenebricide = data.tenebricide;
const obliteration = searchTrueValue([data.obliteration, data.cranerieur]);
const bourreau = effetsWpn.raw.find(str => { if(str.includes('bourreau')) return true; });
const bourreauValue = bourreau ? bourreau.split(' ')[1] : 0;
const devastation = effetsWpn.raw.find(str => { if(str.includes('devastation')) return true; });
const devastationValue = devastation ? devastation.split(' ')[1] : 0;
const choc = effetsWpn.raw.find(str => { if(str.includes('choc')) return true; });

if(obliteration) { minMaxDgts.maximize = true; }

let rollAtt = [];
let rollDgts = [];
let rollViol = [];

for(let i = 0;i < structurellesWpn.raw.length;i++) {
    const string = structurellesWpn.raw[i].split(' ');
    const name = string[0].split('<space>')[0];
    const details = [...string[0].split('<space>')].splice(1, 1).join(' ');

    const sub = {};
    const subDgts = {};
    const subViolence = {};

    let priorAttack = false;
    let includeAttack = false;
    let seconAttack = false;
    let priorDegats = false;
    let includeDegats = false;
    let seconDegats = false;
    let priorViolence = false;
    let includeViolence = false;
    let seconViolence = false;
    let other = false;

    switch(name) {
    case 'agressive':
        if(style === 'agressif' && !isPNJ) includeDegats = true;
        else other = true;

        if(other) {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        } else {
        subDgts.name = `+1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);

        dgtsDice += 1;
        }
        break;

    case 'allegee':
        includeDegats = true;

        subDgts.name = `-1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);

        dgtsDice -= 1;
        break;

    case 'assassine':
        const discretion = isPNJ ? +actor.system.aspects.masque.value : +actor.system.aspects.masque.caracteristiques.discretion.value;
        const discretionOD = isPNJ ? +actor.system.aspects.masque.ae.mineur.value + +actor.system.aspects.masque.ae.majeur.value : +actor.system.aspects.masque.caracteristiques.discretion.overdrive.value;

        if((hasGhost && !isPNJ) || (hasChangeling && !isPNJ)) {
        includeDegats = true;

        subDgts.name = `+${discretion+discretionOD} ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);

        dgtsBonus += discretion+discretionOD;
        } else {
        priorDegats = true;

        subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        subDgts.total = discretion+discretionOD;
        }
        break;

    case 'barbelee':
        priorDegats = true;

        const abSDice = tenebricide === true ? Math.floor(2/2) : 2;

        subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);

        const bSub = new game.knight.RollKnight(`${abSDice}D6`, actor.system);
        bSub._success = false;
        bSub._hasMin = bourreau ? true : false;

        if(bourreau) {
        bSub._seuil = bourreauValue;
        bSub._min = 4;
        }
        await bSub.evaluate(minMaxDgts);

        subDgts.tooltip = await bSub.getTooltip();
        subDgts.total = bSub._total;
        subDgts.formula = bSub._formula;

        rollDgts = rollDgts.concat(bSub);
        break;

    case 'connectee':
        priorDegats = true;
        priorViolence = true;

        subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);

        subViolence.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        break;

    case 'electrifiee':
        if(choc) {
          const vChoc = +choc.split(' ')[1] || 0;

          if(vChoc > 1) other = true;
          else priorAttack = true;
        } else priorAttack = true;

        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        break;

    case 'indestructible':
        other = true;

        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        break;

    case 'protectrice':
        if(style === 'defensif' && !isPNJ) includeAttack = true;
        else other = true;

        if(other) {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        } else {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} ${details} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        }
        break;

    case 'soeur':
        if(data.soeur && style === 'ambidextre' && !isPNJ) includeAttack = true;
        else other = true;

        if(other) {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        } else {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        }
        break;

    case 'lumineuse':
        other = true;

        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize(CONFIG.KNIGHT.effets['lumiere'].label)} 2)`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        break;

    case 'jumelle':
        if(style === 'akimbo' && !isPNJ) includeAttack = true;
        else other = true;

        if(other) {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)}`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        } else {
        sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} ${details} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        }
        break;

    case 'massive':
        const force = isPNJ ? Math.floor(+actor.system.aspects.chair/2): +actor.system.aspects.chair.caracteristiques.force.value;
        includeDegats = true;

        subDgts.name = `+${force} ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        dgtsBonus += force;
        vDefense -= 1;
        break;

    case 'sournoise':
        const dexterite = isPNJ ? Math.floor(+actor.system.aspects.masque.value/2) : +actor.system.aspects.masque.caracteristiques.dexterite.value;
        const dexteriteOD = isPNJ ? 0 : +actor.system.aspects.masque.caracteristiques.dexterite.overdrive.value;
        includeDegats = true;

        subDgts.name = `+${dexterite+dexteriteOD} ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        dgtsBonus += dexterite+dexteriteOD;
        break;

    case 'surmesure':
        const combat = isPNJ ? Math.floor(+actor.system.aspects.bete.value/2) : +actor.system.aspects.bete.caracteristiques.combat.value;
        const combatOD = isPNJ ? 0 : +actor.system.aspects.bete.caracteristiques.combat.overdrive.value;
        includeDegats = true;

        subDgts.name = `+${combat+combatOD} ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.structurelles[name].description}-short`);
        dgtsBonus += combat+combatOD;
        break;
    }

    if(includeAttack) { sIAttack.push(sub); } else
    if(priorAttack) { sPAttack.push(sub); } else
    if(seconAttack) { sSAttack.push(sub); }

    if(includeDegats) { sIDegats.push(subDgts); } else
    if(priorDegats) { sPDegats.push(subDgts); } else
    if(seconDegats) { sSDegats.push(subDgts); }

    if(includeViolence) { sIViolence.push(subViolence); } else
    if(priorViolence) { sPViolence.push(subViolence); } else
    if(seconViolence) { sSViolence.push(subViolence); }

    if(other) { sOther.push(sub); }
}

for(let i = 0;i < structurellesWpn.custom.length;i++) {
    const data = structurellesWpn.custom[i];
    const dataAttack = data.attaque;
    const dataDegats = data.degats;
    const dataViolence = data.violence;

    const name = data.label;
    const description = data.description;
    const subAttack = {};
    const subDegats = {};
    const subViolence = {};
    const subOther = {};

    let priorAttack = false;
    let includeAttack = false;
    let seconAttack = false;
    let priorDegats = false;
    let includeDegats = false;
    let seconDegats = false;
    let priorViolence = false;
    let includeViolence = false;
    let seconViolence = false;
    let other = false;

    if(dataAttack.conditionnel.has) {
      priorAttack = true;

      const cACDice = dataAttack.jet;
      const cACFixe = dataAttack.reussite;

      const cACDCar = dataAttack.carac.jet;
      const cACFCar = dataAttack.carac.fixe;
      const cACDAsp = dataAttack.aspect.jet;
      const cACFAsp = dataAttack.aspect.fixe;
      const cACDOD = dataAttack.carac.odInclusJet;
      const cACFOD = dataAttack.carac.odInclusFixe;
      const cACDAE = dataAttack.aspect.aeInclusJet;
      const cACFAE = dataAttack.aspect.aeInclusFixe;

      let CACDiceT = 0;
      let CACDiceB = 0;

      CACDiceT += cACDice;
      CACDiceB += cACFixe;

      if(cACDCar !== '' && !isPNJ) {
        CACDiceT += getCaracValue(cACDCar, actor._id);

        if(cACDOD) { CACDiceT += getODValue(cACDCar, actor._id); }
      }

      if(cACFCar !== '' && !isPNJ) {
        CACDiceB += getCaracValue(cACFCar, actor._id);

        if(cACFOD) { CACDiceB += getODValue(cACFCar, actor._id); }
      }

      if(cACDAsp !== '' && isPNJ) {
        CACDiceT += getAspectValue(cACDAsp, actor._id);

        if(cACDAE) { CACDiceT += getAEValue(cACDAsp, actor._id); }
      }

      if(cACFAsp !== '' && isPNJ) {
        CACDiceB += getAspectValue(cACFAsp, actor._id);

        if(cACFAE) { CACDiceB += getAEValue(cACFCar, actor._id); }
      }

      if(CACDiceT > 0) {
        const sJet = CACDiceB > 0 ? `${CACDiceT}D6+${CACDiceB}` : `${CACDiceT}D6`;
        const sDJet = CACDiceB > 0 ? `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 + ${CACDiceB}` : `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;

        const cACSub = new game.knight.RollKnight(sJet, actor.system);
        cACSub._success = true;
        cACSub._pairOrImpair = guidage ? 1 : 0;
        cACSub._details = sDJet;
        await cACSub.evaluateSuccess();

        subAttack.name = `+ ${name}`;
        subAttack.desc = dataAttack.conditionnel.condition;
        subAttack.tooltip = await cACSub.getTooltip();
        subAttack.total = cACSub._totalSuccess;
        subAttack.formula = cACSub._formula;

        rollAtt = rollAtt.concat(cACSub);
      } else if(CACDiceB > 0) {
        subAttack.name = `+ ${name}`;
        subAttack.desc = dataAttack.conditionnel.condition;
        subAttack.total = CACDiceB;
      }
    } else if(dataAttack.jet !== 0 || dataAttack.reussite !== 0 || dataAttack.carac.jet !== '' || dataAttack.carac.fixe !== ''|| dataAttack.aspect.jet !== '' || dataAttack.aspect.fixe !== '') {
      includeAttack = true;

      const cAIDice = dataAttack.jet;
      const cAIFixe = dataAttack.reussite;

      const cAIDCar = dataAttack.carac.jet;
      const cAIFCar = dataAttack.carac.fixe;
      const cAIFOD = dataAttack.carac.odInclusFixe;
      const cAIDOD = dataAttack.carac.odInclusJet;
      const cAIDAsp = dataAttack.aspect.jet;
      const cAIFAsp = dataAttack.aspect.fixe;
      const cAIFAE = dataAttack.aspect.odInclusFixe;
      const cAIDAE = dataAttack.aspect.odInclusJet;

      let CAIDiceT = 0;
      let CAIDiceB = 0;

      CAIDiceT += cAIDice;
      CAIDiceB += cAIFixe;

      if(cAIDCar !== '' && !isPNJ) {
        CAIDiceT += getCaracValue(cAIDCar, actor._id);

        if(cAIDOD) { CAIDiceT += getODValue(cAIDCar, actor._id); }
      }

      if(cAIFCar !== '' && !isPNJ) {
        CAIDiceB += getCaracValue(cAIFCar, actor._id);

        if(cAIFOD) { CAIDiceB += getODValue(cAIFCar, actor._id); }
      }

      if(cAIDCar !== '' && isPNJ) {
        CAIDiceT += getAspectValue(cAIDAsp, actor._id);

        if(cAIDAE) { CAIDiceT += getAEValue(cAIDAsp, actor._id); }
      }

      if(cAIFAsp !== '' && isPNJ) {
        CAIDiceB += getAspectValue(cAIFCar, actor._id);

        if(cAIFAE) { CAIDiceB += getAEValue(cAIFAsp, actor._id); }
      }

      let sJet = ``;
      if(CAIDiceT > 0) { sJet += `${CAIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
      if(CAIDiceT > 0 && CAIDiceB > 0) { sJet += `+${CAIDiceB}`; }
      if(CAIDiceT === 0 && CAIDiceB > 0) { sJet += `${CAIDiceB}`; }

      if(sJet !== '') {
        subAttack.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subAttack.desc = description;

        attackDice += CAIDiceT;
        attackBonus += CAIDiceB;
      }
    }

    if(dataDegats.conditionnel.has) {
      priorDegats = true;

      const cDCDice = dataDegats.jet;
      const cDCFixe = dataDegats.fixe;

      const cDCDCar = dataDegats.carac.jet;
      const cDCFCar = dataDegats.carac.fixe;
      const cDCDOD = dataDegats.carac.odInclusJet;
      const cDCFOD = dataDegats.carac.odInclusFixe;
      const cDCDAsp = dataDegats.aspect.jet;
      const cDCFAsp = dataDegats.aspect.fixe;
      const cDCDAE = dataDegats.aspect.odInclusJet;
      const cDCFAE = dataDegats.aspect.odInclusFixe;

      let CDCDiceT = 0;
      let CDCDiceB = 0;

      CDCDiceT += cDCDice;
      CDCDiceB += cDCFixe;

      if(cDCDCar !== '' && !isPNJ) {
        CDCDiceT += getCaracValue(cDCDCar, actor._id);

        if(cDCDOD) { CDCDiceT += getODValue(cDCDCar, actor._id); }
      }

      if(cDCFCar !== '' && !isPNJ) {
        CDCDiceB += getCaracValue(cDCFCar, actor._id);

        if(cDCFOD) { CDCDiceB += getODValue(cDCFCar, actor._id); }
      }

      if(cDCDAsp !== '' && isPNJ) {
        CDCDiceT += getAspectValue(cDCDAsp, actor._id);

        if(cDCDAE) { CDCDiceT += getAEValue(cDCDAsp, actor._id); }
      }

      if(cDCFAsp !== '' && isPNJ) {
        CDCDiceB += getCaracValue(cDCFAsp, actor._id);

        if(cDCFAE) { CDCDiceB += getAEValue(cDCFAsp, actor._id); }
      }

      if(CDCDiceT > 0) {
        const sJet = CDCDiceB > 0 ? `${CDCDiceT}D6+${CDCDiceB}` : `${CDCDiceT}D6`;

        const cDCSub = new game.knight.RollKnight(sJet, actor.system);
        cDCSub._success = false;
        cDCSub._hasMin = bourreau ? true : false;

        if(bourreau) {
          cDCSub._seuil = bourreauValue;
          cDCSub._min = 4;
        }

        await cDCSub.evaluate(minMaxDgts);

        subDegats.name = `+ ${name}`;
        subDegats.desc = dataDegats.conditionnel.condition;
        subDegats.tooltip = await cDCSub.getTooltip();
        subDegats.total = cDCSub.total;
        subDegats.formula = cDCSub._formula;

        rollDgts = rollDgts.concat(cDCSub);
      } else if(CDCDiceB > 0) {
        subDegats.name = `+ ${name}`;
        subDegats.desc = dataDegats.conditionnel.condition;
        subDegats.total = CDCDiceB;
      }
    } else if(dataDegats.jet !== 0 || dataDegats.fixe !== 0 || dataDegats.carac.jet !== '' || dataDegats.carac.fixe !== '' || dataDegats.aspect.jet !== '' || dataDegats.aspect.fixe !== '') {
      includeDegats = true;

      const cDIDice = dataDegats.jet;
      const cDIFixe = dataDegats.fixe;

      const cDIDCar = dataDegats.carac.jet;
      const cDIFCar = dataDegats.carac.fixe;
      const cDIDOD = dataDegats.carac.odInclusJet;
      const cDIFOD = dataDegats.carac.odInclusFixe;
      const cDIDAsp = dataDegats.aspect.jet;
      const cDIFAsp = dataDegats.aspect.fixe;
      const cDIDAE = dataDegats.aspect.odInclusJet;
      const cDIFAE = dataDegats.aspect.odInclusFixe;

      let CDIDiceT = 0;
      let CDIDiceB = 0;

      CDIDiceT += cDIDice;
      CDIDiceB += cDIFixe;

      if(cDIDCar !== '' && !isPNJ) {
        CDIDiceT += getCaracValue(cDIDCar, actor._id);

        if(cDIDOD) { CDIDiceT += getODValue(cDIDCar, actor._id); }
      }

      if(cDIFCar !== '' && !isPNJ) {
        CDIDiceB += getCaracValue(cDIFCar, actor._id);

        if(cDIFOD) { CDIDiceB += getODValue(cDIFCar, actor._id); }
      }

      if(cDIDAsp !== '' && isPNJ) {
        CDIDiceT += getAspectValue(cDIDAsp, actor._id);

        if(cDIDAE) { CDIDiceT += getAEValue(cDIDAsp, actor._id); }
      }

      if(cDIFAsp !== '' && isPNJ) {
        CDIDiceB += getAspectValue(cDIFAsp, actor._id);

        if(cDIFAE) { CDIDiceB += getAEValue(cDIFAsp, actor._id); }
      }

      let sJet = ``;
      if(CDIDiceT > 0) { sJet += `${CDIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
      if(CDIDiceT > 0 && CDIDiceB > 0) { sJet += `+${CDIDiceB}`; }
      if(CDIDiceT === 0 && CDIDiceB > 0) { sJet += `${CDIDiceB}`; }

      if(sJet !== '') {
        subDegats.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subDegats.desc = description;

        dgtsDice += CDIDiceT;
        dgtsBonus += CDIDiceB;
      }
    }

    if(dataViolence.conditionnel.has) {
      priorViolence = true;

      const cVCDice = dataViolence.jet;
      const cVCFixe = dataViolence.fixe;

      const cVCDCar = dataViolence.carac.jet;
      const cVCFCar = dataViolence.carac.fixe;
      const cVCDOD = dataViolence.carac.odInclusJet;
      const cVCFOD = dataViolence.carac.odInclusFixe;
      const cVCDAsp = dataViolence.aspect.jet;
      const cVCFAsp = dataViolence.aspect.fixe;
      const cVCDAE = dataViolence.aspect.odInclusJet;
      const cVCFAE = dataViolence.aspect.odInclusFixe;

      let CVCDiceT = 0;
      let CVCDiceB = 0;

      CVCDiceT += cVCDice;
      CVCDiceB += cVCFixe;

      if(cVCDCar !== '' && !isPNJ) {
        CVCDiceT += getCaracValue(cVCDCar, actor._id);

        if(cVCDOD) { CVCDiceT += getODValue(cVCDCar, actor._id); }
      }

      if(cVCFCar !== '' && !isPNJ) {
        CVCDiceB += getCaracValue(cVCFCar, actor._id);

        if(cVCFOD) { CVCDiceB += getODValue(cVCFCar, actor._id); }
      }

      if(cVCDAsp !== '' && isPNJ) {
        CVCDiceT += getAspectValue(cVCDAsp, actor._id);

        if(cVCDAE) { CVCDiceT += getAEValue(cVCDAsp, actor._id); }
      }

      if(cVCFAsp !== '' && isPNJ) {
        CVCDiceB += getAspectValue(cVCFAsp, actor._id);

        if(cVCFAE) { CVCDiceB += getAEValue(cVCFAsp, actor._id); }
      }

      if(CVCDiceT > 0) {
        const sJet = CVCDiceB > 0 ? `${CVCDiceT}D6+${CVCDiceB}` : `${CVCDiceT}D6`;

        const cVCSub = new game.knight.RollKnight(sJet, actor.system);
        cVCSub._success = false;
        cVCSub._hasMin = devastation ? true : false;

        if(devastation) {
          cVCSub._seuil = devastationValue;
          cVCSub._min = 5;
        }

        await cVCSub.evaluate(minMaxViolence);

        subViolence.name = `+ ${name}`;
        subViolence.desc = dataViolence.conditionnel.condition;
        subViolence.tooltip = await cVCSub.getTooltip();
        subViolence.total = cVCSub.total;
        subViolence.formula = cVCSub._formula;

        rollViol = rollViol.concat(cVCSub);
      } else if(CVCDiceB > 0) {
        subViolence.name = `+ ${name}`;
        subViolence.desc = dataViolence.conditionnel.condition;
        subViolence.total = CVCDiceB;
      }
    } else if(dataViolence.jet !== 0 || dataViolence.fixe !== 0 || dataViolence.carac.jet !== '' || dataViolence.carac.fixe !== '' || dataViolence.aspect.jet !== '' || dataViolence.aspect.fixe !== '') {
      includeViolence = true;

      const cVIDice = dataViolence.jet;
      const cVIFixe = dataViolence.fixe;

      const cVIDCar = dataViolence.carac.jet;
      const cVIFCar = dataViolence.carac.fixe;
      const cVIDOD = dataViolence.carac.odInclusJet;
      const cVIFOD = dataViolence.carac.odInclusFixe;
      const cVIDAsp = dataViolence.aspect.jet;
      const cVIFAsp = dataViolence.aspect.fixe;
      const cVIDAE = dataViolence.aspect.odInclusJet;
      const cVIFAE = dataViolence.aspect.odInclusFixe;

      let CVIDiceT = 0;
      let CVIDiceB = 0;

      CVIDiceT += cVIDice;
      CVIDiceB += cVIFixe;

      if(cVIDCar !== '' && !isPNJ) {
        CVIDiceT += getCaracValue(cVIDCar, actor._id);

        if(cVIDOD) { CVIDiceT += getODValue(cVIDCar, actor._id); }
      }

      if(cVIFCar !== '' && !isPNJ) {
        CVIDiceB += getCaracValue(cVIFCar, actor._id);

        if(cVIFOD) { CVIDiceB += getODValue(cVIFCar, actor._id); }
      }

      if(cVIDAsp !== '' && isPNJ) {
        CVIDiceT += getAspectValue(cVIDAsp, actor._id);

        if(cVIDAE) { CVIDiceT += getAEValue(cVIDAsp, actor._id); }
      }

      if(cVIFAsp !== '' && isPNJ) {
        CVIDiceB += getAspectValue(cVIFAsp, actor._id);

        if(cVIFAE) { CVIDiceB += getAEValue(cVIFAsp, actor._id); }
      }

      let sJet = ``;
      if(CVIDiceT > 0) { sJet += `${CVIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
      if(CVIDiceT > 0 && CVIDiceB > 0) { sJet += `+${CVIDiceB}`; }
      if(CVIDiceT === 0 && CVIDiceB > 0) { sJet += `${CVIDiceB}`; }

      if(sJet !== '') {
        subViolence.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
        subViolence.desc = description;

        violenceDice += CVIDiceT;
        violenceBonus += CVIDiceB;
      }
    }

    if(subAttack.name === undefined && subDegats.name === undefined && subViolence.name === undefined) {
    other = true;

    subOther.name = name;
    subOther.desc = description.replace(/(<([^>]+)>)/gi, "");
    }

    if(priorAttack && subAttack.name !== '') {
    sPAttack.push(subAttack);
    }

    if(includeAttack && subAttack.name !== '') {
    sIAttack.push(subAttack);
    }

    if(priorDegats && subDegats.name !== '') {
    sPDegats.push(subDegats);
    }

    if(includeDegats && subDegats.name !== '') {
    sIDegats.push(subDegats);
    }

    if(priorViolence && subViolence.name !== '') {
    sPViolence.push(subViolence);
    }

    if(includeViolence && subViolence.name !== '') {
    sIViolence.push(subViolence);
    }

    if(other) {
    sOther.push(subOther);
    }
}

sIAttack.sort(SortByName);
sPAttack.sort(SortByName);
sSAttack.sort(SortByName);
sIDegats.sort(SortByName);
sPDegats.sort(SortByName);
sSDegats.sort(SortByName);
sPViolence.sort(SortByName);
sSViolence.sort(SortByName);
sOther.sort(SortByName);

const sAttack = sPAttack.concat(sSAttack);
const sDegats = sPDegats.concat(sSDegats);
const sViolence = sPViolence.concat(sSViolence);

return {
    onlyAttack:onlyAttack,
    nRoll:nRoll,
    attack:{
    totalDice:attackDice,
    totalBonus:attackBonus,
    include:sIAttack,
    list:sAttack,
    },
    degats:{
    totalDice:dgtsDice,
    totalBonus:dgtsBonus,
    include:sIDegats,
    list:sDegats,
    minMax:minMaxDgts,
    },
    violence:{
    totalDice:violenceDice,
    totalBonus:violenceBonus,
    include:sIViolence,
    list:sViolence,
    minMax:minMaxViolence,
    },
    defense:vDefense,
    other:sOther,
    rollAtt:rollAtt,
    rollDgts:rollDgts,
    rollViol:rollViol
}
}

export async function getOrnementale(actor, typeWpn, data, effetsWpn, ornementalesWpn, isPNJ = false) {
  const sIAttack = [];
  const sPAttack = [];
  const sSAttack = [];

  const sPDegats = [];
  const sIDegats = [];
  const sSDegats = [];

  const sPViolence = [];
  const sIViolence = [];
  const sSViolence = [];

  const sOther = [];

  const minMaxDgts = {
      minimize:false,
      maximize:false,
      async:true
  };

  const minMaxViolence = {
      minimize:false,
      maximize:false,
      async:true
  };

  let onlyAttack = false;
  let nRoll = 1;

  let attackDice = 0;
  let attackBonus = 0;

  let dgtsDice = 0;
  let dgtsBonus = 0;

  let violenceDice = 0;
  let violenceBonus = 0;

  if(typeWpn === 'distance' || typeWpn === 'grenades' || typeWpn === 'longbow' || typeWpn === 'tourelle' || typeWpn === 'armesimprovisees'
  || typeWpn === 'base' || typeWpn === 'c1' || typeWpn === 'c2') return {
      onlyAttack:onlyAttack,
      nRoll:nRoll,
      attack:{
      totalDice:attackDice,
      totalBonus:attackBonus,
      include:sIAttack,
      list:sSAttack,
      },
      degats:{
      totalDice:dgtsDice,
      totalBonus:dgtsBonus,
      include:sIDegats,
      list:sSDegats,
      minMax:minMaxDgts,
      },
      violence:{
      totalDice:violenceDice,
      totalBonus:violenceBonus,
      include:sIViolence,
      list:sSViolence,
      minMax:minMaxViolence,
      },
      other:sOther,
      rollAtt:[],
      rollDgts:[],
      rollViol:[]
  };

  const guidage = data.guidage;
  const tenebricide = data.tenebricide;
  const obliteration = searchTrueValue([data.obliteration, data.cranerieur]);

  const bourreau = effetsWpn.raw.find(str => { if(str.includes('bourreau')) return true; });
  const bourreauValue = bourreau ? bourreau.split(' ')[1] : 0;
  const devastation = effetsWpn.raw.find(str => { if(str.includes('devastation')) return true; });
  const devastationValue = devastation ? devastation.split(' ')[1] : 0;

  const defense = effetsWpn.raw.find(str => { if(str.includes('defense')) return true; });
  const lumiere = effetsWpn.raw.find(str => { if(str.includes('lumiere')) return true; });

  if(obliteration) { minMaxDgts.maximize = true; }

  let rollAtt = [];
  let rollDgts = [];
  let rollViol = [];

  for(let i = 0;i < ornementalesWpn.raw.length;i++) {
      const string = ornementalesWpn.raw[i].split(' ');
      const name = string[0].split('<space>')[0];

      const sub = {};
      const subDgts = {};
      const subViolence = {};

      let priorAttack = false;
      let includeAttack = false;
      let seconAttack = false;
      let priorDegats = false;
      let includeDegats = false;
      let seconDegats = false;
      let priorViolence = false;
      let includeViolence = false;
      let seconViolence = false;
      let other = false;

      switch(name) {
      case 'arabesqueiridescentes':
          other = true;
          const vLumiere = lumiere ? `+1 ${game.i18n.localize('KNIGHT.AUTRE.Inclus')}` : `1`;
          const vLLumiere = `(${game.i18n.localize(CONFIG.KNIGHT.effets['lumiere'].label)} ${vLumiere})`;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} ${vLLumiere}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
      break;

      case 'armeazurine':
      case 'armerougesang':
      case 'griffuresgravees':
      case 'masquebrisesculpte':
      case 'rouagescassesgraves':
          priorDegats = true;
          priorViolence = true;

          const aADSub = new game.knight.RollKnight(`1D6`, actor.system);
          aADSub._success = false;
          aADSub._hasMin = bourreau ? true : false;

          if(bourreau) {
          aADSub._seuil = bourreauValue;
          aADSub._min = 4;
          }
          await aADSub.evaluate(minMaxDgts);

          subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          subDgts.tooltip = await aADSub.getTooltip();
          subDgts.total = aADSub._total;
          subDgts.formula = aADSub._formula;

          const aAVSub = new game.knight.RollKnight(`1D6`, actor.system);
          aAVSub._success = false;
          aAVSub._hasMin = devastation ? true : false;

          if(devastation) {
          aAVSub._seuil = devastationValue;
          aAVSub._min = 5;
          }
          await aAVSub.evaluate(minMaxDgts);

          subViolence.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          subViolence.tooltip = await aAVSub.getTooltip();
          subViolence.total = aAVSub._total;
          subViolence.formula = aAVSub._formula;

          rollDgts = rollDgts.concat(aADSub);
          rollViol = rollViol.concat(aAVSub);
      break;

      case 'chenesculpte':
          priorDegats = true;

          const aCDice = tenebricide === true ? Math.floor(2/2) : 2;

          const aCSub = new game.knight.RollKnight(`${aCDice}D6`, actor.system);
          aCSub._success = false;
          aCSub._hasMin = bourreau ? true : false;

          if(bourreau) {
          aCSub._seuil = bourreauValue;
          aCSub._min = 4;
          }
          await aCSub.evaluate(minMaxDgts);

          subDgts.name = `+ ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          subDgts.tooltip = await aCSub.getTooltip();
          subDgts.total = aCSub._total;
          subDgts.formula = aCSub._formula;

          rollDgts = rollDgts.concat(aCSub);
      break;

      case 'armuregravee':
      case 'blasonchevalier':
      case 'codeknightgrave':
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
      break;

      case 'boucliergrave':
          other = true;
          const vDefense = defense ? `+1 ${game.i18n.localize('KNIGHT.AUTRE.Inclus')}` : `1`;
          const vLDefense = `(${game.i18n.localize(CONFIG.KNIGHT.effets['defense'].label)} ${vDefense})`;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} ${vLDefense}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
      break;

      case 'chromeligneslumineuses':
          const chromeligneslumineuses = data.chromeligneslumineuses;

          if(chromeligneslumineuses) {
          includeAttack = true;

          sub.name = `-3${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          attackDice -= 3;
          nRoll = 2;
          } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          }
          break;

      case 'cranerieurgrave':
          const cranerieur = data.cranerieur;

          if(cranerieur) {
          includeDegats = true;

          subDgts.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          } else {
          other = true;

          sub.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          sub.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
          }
      break;

      case 'faucheusegravee':
          includeDegats = true;

          subDgts.name = `+1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);

          dgtsDice += 1;
      break;

      case 'fauconplumesluminescentes':
          priorDegats = true;
          priorViolence = true;

          subDgts.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);

          subViolence.name = `${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)}`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);
      break;

      case 'flammesstylisees':
          includeViolence = true;

          subViolence.name = `+1${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);

          violenceDice += 1;
      break;

      case 'sillonslignesfleches':
          includeDegats = true;

          subDgts.name = `+3 ${game.i18n.localize(CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].label)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDgts.desc = game.i18n.localize(`${CONFIG.KNIGHT.AMELIORATIONS.ornementales[name].description}-short`);

          dgtsBonus += 3;
      break;
      }

      if(includeAttack) { sIAttack.push(sub); } else
      if(priorAttack) { sPAttack.push(sub); } else
      if(seconAttack) { sSAttack.push(sub); }

      if(includeDegats) { sIDegats.push(subDgts); } else
      if(priorDegats) { sPDegats.push(subDgts); } else
      if(seconDegats) { sSDegats.push(subDgts); }

      if(includeViolence) { sIViolence.push(subViolence); } else
      if(priorViolence) { sPViolence.push(subViolence); } else
      if(seconViolence) { sSViolence.push(subViolence); }

      if(other) { sOther.push(sub); }
  }

  for(let i = 0;i < ornementalesWpn.custom.length;i++) {
      const data = ornementalesWpn.custom[i];
      const dataAttack = data.attaque;
      const dataDegats = data.degats;
      const dataViolence = data.violence;

      const name = data.label;
      const description = data.description;
      const subAttack = {};
      const subDegats = {};
      const subViolence = {};
      const subOther = {};

      let priorAttack = false;
      let includeAttack = false;
      let seconAttack = false;
      let priorDegats = false;
      let includeDegats = false;
      let seconDegats = false;
      let priorViolence = false;
      let includeViolence = false;
      let seconViolence = false;
      let other = false;

      if(dataAttack.conditionnel.has) {
        priorAttack = true;

        const cACDice = dataAttack.jet;
        const cACFixe = dataAttack.reussite;

        const cACDCar = dataAttack.carac.jet;
        const cACFCar = dataAttack.carac.fixe;
        const cACDAsp = dataAttack.aspect.jet;
        const cACFAsp = dataAttack.aspect.fixe;
        const cACDOD = dataAttack.carac.odInclusJet;
        const cACFOD = dataAttack.carac.odInclusFixe;
        const cACDAE = dataAttack.aspect.aeInclusJet;
        const cACFAE = dataAttack.aspect.aeInclusFixe;

        let CACDiceT = 0;
        let CACDiceB = 0;

        CACDiceT += cACDice;
        CACDiceB += cACFixe;

        if(cACDCar !== '' && !isPNJ) {
          CACDiceT += getCaracValue(cACDCar, actor._id);

          if(cACDOD) { CACDiceT += getODValue(cACDCar, actor._id); }
        }

        if(cACFCar !== '' && !isPNJ) {
          CACDiceB += getCaracValue(cACFCar, actor._id);

          if(cACFOD) { CACDiceB += getODValue(cACFCar, actor._id); }
        }

        if(cACDAsp !== '' && isPNJ) {
          CACDiceT += getAspectValue(cACDAsp, actor._id);

          if(cACDAE) { CACDiceT += getAEValue(cACDAsp, actor._id); }
        }

        if(cACFAsp !== '' && isPNJ) {
          CACDiceB += getAspectValue(cACFAsp, actor._id);

          if(cACFAE) { CACDiceB += getAEValue(cACFCar, actor._id); }
        }

        if(CACDiceT > 0) {
          const sJet = CACDiceB > 0 ? `${CACDiceT}D6+${CACDiceB}` : `${CACDiceT}D6`;
          const sDJet = CACDiceB > 0 ? `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 + ${CACDiceB}` : `${CACDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;

          const cACSub = new game.knight.RollKnight(sJet, actor.system);
          cACSub._success = true;
          cACSub._pairOrImpair = guidage ? 1 : 0;
          cACSub._details = sDJet;
          await cACSub.evaluateSuccess();

          subAttack.name = `+ ${name}`;
          subAttack.desc = dataAttack.conditionnel.condition;
          subAttack.tooltip = await cACSub.getTooltip();
          subAttack.total = cACSub._totalSuccess;
          subAttack.formula = cACSub._formula;

          rollAtt = rollAtt.concat(cACSub);
        } else if(CACDiceB > 0) {
          subAttack.name = `+ ${name}`;
          subAttack.desc = dataAttack.conditionnel.condition;
          subAttack.total = CACDiceB;
        }
      } else if(dataAttack.jet !== 0 || dataAttack.reussite !== 0 || dataAttack.carac.jet !== '' || dataAttack.carac.fixe !== ''|| dataAttack.aspect.jet !== '' || dataAttack.aspect.fixe !== '') {
        includeAttack = true;

        const cAIDice = dataAttack.jet;
        const cAIFixe = dataAttack.reussite;

        const cAIDCar = dataAttack.carac.jet;
        const cAIFCar = dataAttack.carac.fixe;
        const cAIFOD = dataAttack.carac.odInclusFixe;
        const cAIDOD = dataAttack.carac.odInclusJet;
        const cAIDAsp = dataAttack.aspect.jet;
        const cAIFAsp = dataAttack.aspect.fixe;
        const cAIFAE = dataAttack.aspect.odInclusFixe;
        const cAIDAE = dataAttack.aspect.odInclusJet;

        let CAIDiceT = 0;
        let CAIDiceB = 0;

        CAIDiceT += cAIDice;
        CAIDiceB += cAIFixe;

        if(cAIDCar !== '' && !isPNJ) {
          CAIDiceT += getCaracValue(cAIDCar, actor._id);

          if(cAIDOD) { CAIDiceT += getODValue(cAIDCar, actor._id); }
        }

        if(cAIFCar !== '' && !isPNJ) {
          CAIDiceB += getCaracValue(cAIFCar, actor._id);

          if(cAIFOD) { CAIDiceB += getODValue(cAIFCar, actor._id); }
        }

        if(cAIDCar !== '' && isPNJ) {
          CAIDiceT += getAspectValue(cAIDAsp, actor._id);

          if(cAIDAE) { CAIDiceT += getAEValue(cAIDAsp, actor._id); }
        }

        if(cAIFAsp !== '' && isPNJ) {
          CAIDiceB += getAspectValue(cAIFCar, actor._id);

          if(cAIFAE) { CAIDiceB += getAEValue(cAIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CAIDiceT > 0) { sJet += `${CAIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CAIDiceT > 0 && CAIDiceB > 0) { sJet += `+${CAIDiceB}`; }
        if(CAIDiceT === 0 && CAIDiceB > 0) { sJet += `${CAIDiceB}`; }

        if(sJet !== '') {
          subAttack.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subAttack.desc = description;

          attackDice += CAIDiceT;
          attackBonus += CAIDiceB;
        }
      }

      if(dataDegats.conditionnel.has) {
        priorDegats = true;

        const cDCDice = dataDegats.jet;
        const cDCFixe = dataDegats.fixe;

        const cDCDCar = dataDegats.carac.jet;
        const cDCFCar = dataDegats.carac.fixe;
        const cDCDOD = dataDegats.carac.odInclusJet;
        const cDCFOD = dataDegats.carac.odInclusFixe;
        const cDCDAsp = dataDegats.aspect.jet;
        const cDCFAsp = dataDegats.aspect.fixe;
        const cDCDAE = dataDegats.aspect.odInclusJet;
        const cDCFAE = dataDegats.aspect.odInclusFixe;

        let CDCDiceT = 0;
        let CDCDiceB = 0;

        CDCDiceT += cDCDice;
        CDCDiceB += cDCFixe;

        if(cDCDCar !== '' && !isPNJ) {
          CDCDiceT += getCaracValue(cDCDCar, actor._id);

          if(cDCDOD) { CDCDiceT += getODValue(cDCDCar, actor._id); }
        }

        if(cDCFCar !== '' && !isPNJ) {
          CDCDiceB += getCaracValue(cDCFCar, actor._id);

          if(cDCFOD) { CDCDiceB += getODValue(cDCFCar, actor._id); }
        }

        if(cDCDAsp !== '' && isPNJ) {
          CDCDiceT += getAspectValue(cDCDAsp, actor._id);

          if(cDCDAE) { CDCDiceT += getAEValue(cDCDAsp, actor._id); }
        }

        if(cDCFAsp !== '' && isPNJ) {
          CDCDiceB += getCaracValue(cDCFAsp, actor._id);

          if(cDCFAE) { CDCDiceB += getAEValue(cDCFAsp, actor._id); }
        }

        if(CDCDiceT > 0) {
          const sJet = CDCDiceB > 0 ? `${CDCDiceT}D6+${CDCDiceB}` : `${CDCDiceT}D6`;

          const cDCSub = new game.knight.RollKnight(sJet, actor.system);
          cDCSub._success = false;
          cDCSub._hasMin = bourreau ? true : false;

          if(bourreau) {
            cDCSub._seuil = bourreauValue;
            cDCSub._min = 4;
          }

          await cDCSub.evaluate(minMaxDgts);

          subDegats.name = `+ ${name}`;
          subDegats.desc = dataDegats.conditionnel.condition;
          subDegats.tooltip = await cDCSub.getTooltip();
          subDegats.total = cDCSub.total;
          subDegats.formula = cDCSub._formula;

          rollDgts = rollDgts.concat(cDCSub);
        } else if(CDCDiceB > 0) {
          subDegats.name = `+ ${name}`;
          subDegats.desc = dataDegats.conditionnel.condition;
          subDegats.total = CDCDiceB;
        }
      } else if(dataDegats.jet !== 0 || dataDegats.fixe !== 0 || dataDegats.carac.jet !== '' || dataDegats.carac.fixe !== '' || dataDegats.aspect.jet !== '' || dataDegats.aspect.fixe !== '') {
        includeDegats = true;

        const cDIDice = dataDegats.jet;
        const cDIFixe = dataDegats.fixe;

        const cDIDCar = dataDegats.carac.jet;
        const cDIFCar = dataDegats.carac.fixe;
        const cDIDOD = dataDegats.carac.odInclusJet;
        const cDIFOD = dataDegats.carac.odInclusFixe;
        const cDIDAsp = dataDegats.aspect.jet;
        const cDIFAsp = dataDegats.aspect.fixe;
        const cDIDAE = dataDegats.aspect.odInclusJet;
        const cDIFAE = dataDegats.aspect.odInclusFixe;

        let CDIDiceT = 0;
        let CDIDiceB = 0;

        CDIDiceT += cDIDice;
        CDIDiceB += cDIFixe;

        if(cDIDCar !== '' && !isPNJ) {
          CDIDiceT += getCaracValue(cDIDCar, actor._id);

          if(cDIDOD) { CDIDiceT += getODValue(cDIDCar, actor._id); }
        }

        if(cDIFCar !== '' && !isPNJ) {
          CDIDiceB += getCaracValue(cDIFCar, actor._id);

          if(cDIFOD) { CDIDiceB += getODValue(cDIFCar, actor._id); }
        }

        if(cDIDAsp !== '' && isPNJ) {
          CDIDiceT += getAspectValue(cDIDAsp, actor._id);

          if(cDIDAE) { CDIDiceT += getAEValue(cDIDAsp, actor._id); }
        }

        if(cDIFAsp !== '' && isPNJ) {
          CDIDiceB += getAspectValue(cDIFAsp, actor._id);

          if(cDIFAE) { CDIDiceB += getAEValue(cDIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CDIDiceT > 0) { sJet += `${CDIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CDIDiceT > 0 && CDIDiceB > 0) { sJet += `+${CDIDiceB}`; }
        if(CDIDiceT === 0 && CDIDiceB > 0) { sJet += `${CDIDiceB}`; }

        if(sJet !== '') {
          subDegats.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subDegats.desc = description;

          dgtsDice += CDIDiceT;
          dgtsBonus += CDIDiceB;
        }
      }

      if(dataViolence.conditionnel.has) {
        priorViolence = true;

        const cVCDice = dataViolence.jet;
        const cVCFixe = dataViolence.fixe;

        const cVCDCar = dataViolence.carac.jet;
        const cVCFCar = dataViolence.carac.fixe;
        const cVCDOD = dataViolence.carac.odInclusJet;
        const cVCFOD = dataViolence.carac.odInclusFixe;
        const cVCDAsp = dataViolence.aspect.jet;
        const cVCFAsp = dataViolence.aspect.fixe;
        const cVCDAE = dataViolence.aspect.odInclusJet;
        const cVCFAE = dataViolence.aspect.odInclusFixe;

        let CVCDiceT = 0;
        let CVCDiceB = 0;

        CVCDiceT += cVCDice;
        CVCDiceB += cVCFixe;

        if(cVCDCar !== '' && !isPNJ) {
          CVCDiceT += getCaracValue(cVCDCar, actor._id);

          if(cVCDOD) { CVCDiceT += getODValue(cVCDCar, actor._id); }
        }

        if(cVCFCar !== '' && !isPNJ) {
          CVCDiceB += getCaracValue(cVCFCar, actor._id);

          if(cVCFOD) { CVCDiceB += getODValue(cVCFCar, actor._id); }
        }

        if(cVCDAsp !== '' && isPNJ) {
          CVCDiceT += getAspectValue(cVCDAsp, actor._id);

          if(cVCDAE) { CVCDiceT += getAEValue(cVCDAsp, actor._id); }
        }

        if(cVCFAsp !== '' && isPNJ) {
          CVCDiceB += getAspectValue(cVCFAsp, actor._id);

          if(cVCFAE) { CVCDiceB += getAEValue(cVCFAsp, actor._id); }
        }

        if(CVCDiceT > 0) {
          const sJet = CVCDiceB > 0 ? `${CVCDiceT}D6+${CVCDiceB}` : `${CVCDiceT}D6`;

          const cVCSub = new game.knight.RollKnight(sJet, actor.system);
          cVCSub._success = false;
          cVCSub._hasMin = devastation ? true : false;

          if(devastation) {
            cVCSub._seuil = devastationValue;
            cVCSub._min = 5;
          }

          await cVCSub.evaluate(minMaxViolence);

          subViolence.name = `+ ${name}`;
          subViolence.desc = dataViolence.conditionnel.condition;
          subViolence.tooltip = await cVCSub.getTooltip();
          subViolence.total = cVCSub.total;
          subViolence.formula = cVCSub._formula;

          rollViol = rollViol.concat(cVCSub);
        } else if(CVCDiceB > 0) {
          subViolence.name = `+ ${name}`;
          subViolence.desc = dataViolence.conditionnel.condition;
          subViolence.total = CVCDiceB;
        }
      } else if(dataViolence.jet !== 0 || dataViolence.fixe !== 0 || dataViolence.carac.jet !== '' || dataViolence.carac.fixe !== '' || dataViolence.aspect.jet !== '' || dataViolence.aspect.fixe !== '') {
        includeViolence = true;

        const cVIDice = dataViolence.jet;
        const cVIFixe = dataViolence.fixe;

        const cVIDCar = dataViolence.carac.jet;
        const cVIFCar = dataViolence.carac.fixe;
        const cVIDOD = dataViolence.carac.odInclusJet;
        const cVIFOD = dataViolence.carac.odInclusFixe;
        const cVIDAsp = dataViolence.aspect.jet;
        const cVIFAsp = dataViolence.aspect.fixe;
        const cVIDAE = dataViolence.aspect.odInclusJet;
        const cVIFAE = dataViolence.aspect.odInclusFixe;

        let CVIDiceT = 0;
        let CVIDiceB = 0;

        CVIDiceT += cVIDice;
        CVIDiceB += cVIFixe;

        if(cVIDCar !== '' && !isPNJ) {
          CVIDiceT += getCaracValue(cVIDCar, actor._id);

          if(cVIDOD) { CVIDiceT += getODValue(cVIDCar, actor._id); }
        }

        if(cVIFCar !== '' && !isPNJ) {
          CVIDiceB += getCaracValue(cVIFCar, actor._id);

          if(cVIFOD) { CVIDiceB += getODValue(cVIFCar, actor._id); }
        }

        if(cVIDAsp !== '' && isPNJ) {
          CVIDiceT += getAspectValue(cVIDAsp, actor._id);

          if(cVIDAE) { CVIDiceT += getAEValue(cVIDAsp, actor._id); }
        }

        if(cVIFAsp !== '' && isPNJ) {
          CVIDiceB += getAspectValue(cVIFAsp, actor._id);

          if(cVIFAE) { CVIDiceB += getAEValue(cVIFAsp, actor._id); }
        }

        let sJet = ``;
        if(CVIDiceT > 0) { sJet += `${CVIDiceT}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`; }
        if(CVIDiceT > 0 && CVIDiceB > 0) { sJet += `+${CVIDiceB}`; }
        if(CVIDiceT === 0 && CVIDiceB > 0) { sJet += `${CVIDiceB}`; }

        if(sJet !== '') {
          subViolence.name = `+${sJet} ${name} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`;
          subViolence.desc = description;

          violenceDice += CVIDiceT;
          violenceBonus += CVIDiceB;
        }
      }

      if(subAttack.name === undefined && subDegats.name === undefined && subViolence.name === undefined) {
      other = true;

      subOther.name = name;
      subOther.desc = description.replace(/(<([^>]+)>)/gi, "");
      }

      if(priorAttack && subAttack.name !== '') {
      sPAttack.push(subAttack);
      }

      if(includeAttack && subAttack.name !== '') {
      sIAttack.push(subAttack);
      }

      if(priorDegats && subDegats.name !== '') {
      sPDegats.push(subDegats);
      }

      if(includeDegats && subDegats.name !== '') {
      sIDegats.push(subDegats);
      }

      if(priorViolence && subViolence.name !== '') {
      sPViolence.push(subViolence);
      }

      if(includeViolence && subViolence.name !== '') {
      sIViolence.push(subViolence);
      }

      if(other) {
      sOther.push(subOther);
      }
  }

  sIAttack.sort(SortByName);
  sPAttack.sort(SortByName);
  sSAttack.sort(SortByName);
  sIDegats.sort(SortByName);
  sPDegats.sort(SortByName);
  sSDegats.sort(SortByName);
  sPViolence.sort(SortByName);
  sSViolence.sort(SortByName);
  sOther.sort(SortByName);

  const sAttack = sPAttack.concat(sSAttack);
  const sDegats = sPDegats.concat(sSDegats);
  const sViolence = sPViolence.concat(sSViolence);

  return {
      onlyAttack:onlyAttack,
      nRoll:nRoll,
      attack:{
      totalDice:attackDice,
      totalBonus:attackBonus,
      include:sIAttack,
      list:sAttack,
      },
      degats:{
      totalDice:dgtsDice,
      totalBonus:dgtsBonus,
      include:sIDegats,
      list:sDegats,
      minMax:minMaxDgts,
      },
      violence:{
      totalDice:violenceDice,
      totalBonus:violenceBonus,
      include:sIViolence,
      list:sViolence,
      minMax:minMaxViolence,
      },
      other:sOther,
      rollAtt:rollAtt,
      rollDgts:rollDgts,
      rollViol:rollViol
  }
}

export async function getCapacite(actor, typeWpn, baseC, otherC, effetsWpn, structurelleWpn, ornementaleWpn, distanceWpn, isPNJ=false, idWpn=-1) {
  const wear = actor.system.wear;
  const armor = await getArmor(actor);
  const getArmorData = armor !== undefined &&  wear === 'armure' ? armor?.system || false : false;

  let result = {
      roll:{
          fixe:0,
          string:''
      },
      attack:{
          dice:0,
          fixe:0,
          include:[],
          list:[]
      },
      degats:{
          dice:0,
          fixe:0,
          include:[],
          list:[]
      },
      violence:{
          dice:0,
          fixe:0,
          include:[],
          list:[]
      }
  }

  if(typeWpn === 'tourelle' && isPNJ) return result;

  const eLumiere = effetsWpn.raw.find(str => { if(str.includes('lumiere')) return true; });
  const aLumineuse = structurelleWpn.raw.find(str => { if(str.includes('lumineuse')) return true; });
  const aArabesque = ornementaleWpn.raw.find(str => { if(str.includes('arabesqueiridescentes')) return true; });
  const isLumiere = searchTrueValue([eLumiere, aLumineuse, aArabesque]);

  const eSilencieux = effetsWpn.raw.find(str => { if(str.includes('silencieux')) return true; });
  const aAssassine = structurelleWpn.raw.find(str => { if(str.includes('assassine')) return true; });
  const aSubsonique = distanceWpn.raw.find(str => { if(str.includes('munitionssubsoniques')) return true; });
  const isSilencieux = searchTrueValue([eSilencieux, aAssassine, aSubsonique]);

  let rollFixe = 0;
  let rollString = '';

  let attackDice = 0;
  let attackFixe = 0;
  const attackInclude = [];
  const attackList = [];

  let degatsDice = 0;
  let degatsFixe = 0;
  const degatsInclude = [];
  const degatsList = [];

  let violenceDice = 0;
  let violenceFixe = 0;
  const violenceInclude = [];
  const violenceList = [];

  if(getArmorData !== false) {
      const capaciteList = getArmorData.capacites.selected;

      for (let [key, capacite] of Object.entries(capaciteList)) {
      const isActive = capacite?.active || [false];

      let bonusRollFixe = 0;
      let bonusRollString = ''

      let bonusAttackDice = 0;
      let bonusAttackFixe = 0;

      let bonusDegatsDice = 0;
      let bonusDegatsFixe = 0;

      let bonusViolenceDice = 0;
      let bonusViolenceFixe = 0;

      let active = searchTrueValue([isActive]);

      switch(key) {
          case 'ghost':
              active = searchTrueValue([isActive.conflit, isActive.horsconflit]);

              if((active === true && typeWpn === 'contact' && !isLumiere)) {
                  const dataBonus = capacite.bonus;
                  const degatsBonus = dataBonus.degats;

                  bonusAttackDice += isPNJ ? Math.floor(getAspectValue(dataBonus.attaque, actor, true, true)/2) : getCaracValue(dataBonus.attaque, actor, true);
                  bonusAttackFixe += isPNJ ? getTotalAE(dataBonus.attaque, actor, true, true) : getODValue(dataBonus.attaque, actor, true);

                  if(degatsBonus.fixe) bonusDegatsFixe += isPNJ ? Math.floor(getAspectValue(degatsBonus.caracteristique, actor, true, true)/2) : getCaracValue(degatsBonus.caracteristique, actor, true);
                  if(degatsBonus.dice) bonusDegatsDice += isPNJ ? Math.floor(getAspectValue(degatsBonus.caracteristique, actor, true, true)/2) : getCaracValue(degatsBonus.caracteristique, actor, true);
                  if(degatsBonus.od && degatsBonus.dice) bonusDegatsDice += isPNJ ? getTotalAE(degatsBonus.caracteristique, actor, true, true) : getODValue(degatsBonus.caracteristique, actor, true);
                  if(degatsBonus.od && degatsBonus.fixe) bonusDegatsFixe += isPNJ ? getTotalAE(degatsBonus.caracteristique, actor, true, true) : getODValue(degatsBonus.caracteristique, actor, true);
              } else if((active === true && typeWpn === 'distance' && isSilencieux)) {
                const dataBonus = capacite.bonus;
                const degatsBonus = dataBonus.degats;

                bonusAttackDice += isPNJ ? Math.floor(getAspectValue(dataBonus.attaque, actor, true, true)/2) : getCaracValue(dataBonus.attaque, actor, true);
                bonusAttackFixe += isPNJ ? getTotalAE(dataBonus.attaque, actor, true, true) : getODValue(dataBonus.attaque, actor, true);

                if(degatsBonus.fixe) bonusDegatsFixe += isPNJ ? Math.floor(getAspectValue(degatsBonus.caracteristique, actor, true, true)/2) : getCaracValue(degatsBonus.caracteristique, actor, true);
                if(degatsBonus.dice) bonusDegatsDice += isPNJ ? Math.floor(getAspectValue(degatsBonus.caracteristique, actor, true, true)/2) : getCaracValue(degatsBonus.caracteristique, actor, true);
                if(degatsBonus.od && degatsBonus.dice) bonusDegatsDice += isPNJ ? getTotalAE(degatsBonus.caracteristique, actor, true, true) : getODValue(degatsBonus.caracteristique, actor, true);
                if(degatsBonus.od && degatsBonus.fixe) bonusDegatsFixe += isPNJ ? getTotalAE(degatsBonus.caracteristique, actor, true, true) : getODValue(degatsBonus.caracteristique, actor, true);
              }

              if(capacite.interruption.actif && idWpn !== -1) {
                armor.update({[`system.capacites.selected.ghost.active.horsconflit`]:false});
                armor.update({[`system.capacites.selected.ghost.active.conflit`]:false});
              }
              break;

          case 'goliath':
              if(active) {
                  const dataBonus = capacite.bonus;
                  const metres = +actor?.system?.equipements?.armure?.capacites?.goliath?.metre || 0;

                  if(baseC === 'force') {
                  bonusRollFixe += metres*dataBonus.force.value;
                  bonusAttackFixe += metres*dataBonus.force.value;
                  }
                  else if(baseC === 'endurance') {
                  bonusRollFixe += metres*dataBonus.endurance.value;
                  bonusAttackFixe += metres*dataBonus.endurance.value;
                  }

                  if(otherC.includes('force')) {
                  bonusRollFixe += metres*dataBonus.force.value;
                  bonusAttackFixe += metres*dataBonus.force.value;
                  }

                  if(otherC.includes('endurance')) {
                  bonusRollFixe += metres*dataBonus.endurance.value;
                  bonusAttackFixe += metres*dataBonus.endurance.value;
                  }

                  if(typeWpn === 'contact' || (typeWpn === 'armesimprovisees' && idWpn === "contact")) {
                  bonusDegatsDice += metres*dataBonus.degats.dice;
                  bonusViolenceDice += metres*dataBonus.violence.dice;
                  }

                  bonusRollString = `${bonusRollFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)}`;
              }
              break;

          case 'warlord':
            active = isActive?.guerre?.porteur || false;

            if(active) {
              const impGuerre = capacite.impulsions.guerre.bonus;

              bonusDegatsDice += +impGuerre.degats;
              bonusViolenceDice += +impGuerre.violence;
            }
            break;

          case 'rage':
            const rNiveau = capacite.niveau;
            const rNColere = rNiveau?.colere || false;
            const rNFureur = rNiveau?.fureur || false;
            const rNRage = rNiveau?.rage || false;

            if(isActive) {
              if(rNColere) {
                bonusDegatsFixe += getAspectValue(capacite.colere.degats, actor, true);
                bonusViolenceFixe += getAspectValue(capacite.colere.violence, actor, true);
              } else if(rNFureur) {
                bonusDegatsFixe += getAspectValue(capacite.fureur.degats, actor, true);
                bonusViolenceFixe += getAspectValue(capacite.fureur.violence, actor, true);
              } else if(rNRage) {
                bonusDegatsFixe += getAspectValue(capacite.rage.degats, actor, true);
                bonusViolenceFixe += getAspectValue(capacite.rage.violence, actor, true);
              }
            }

            break;
      };

      if(bonusAttackFixe > 0) attackInclude.push({
          name:`+${bonusAttackFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })
      else if(bonusAttackFixe < 0) attackInclude.push({
          name:`${bonusAttackFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })

      if(bonusAttackDice > 0) attackInclude.push({
          name:`+${bonusAttackDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })
      else if(bonusAttackDice < 0) attackInclude.push({
          name:`${bonusAttackDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })

      if(bonusDegatsDice > 0) degatsInclude.push({
          name:`+${bonusDegatsDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })
      else if(bonusDegatsDice < 0) degatsInclude.push({
          name:`${bonusDegatsDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })

      if(bonusDegatsFixe > 0) degatsInclude.push({
          name:`+${bonusDegatsFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })
      else if(bonusDegatsFixe < 0) degatsInclude.push({
          name:`${bonusDegatsFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })


      if(bonusViolenceDice > 0) violenceInclude.push({
          name:`+${bonusViolenceDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })
      else if(bonusViolenceDice < 0) violenceInclude.push({
          name:`${bonusViolenceDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })

      if(bonusViolenceFixe > 0) violenceInclude.push({
          name:`+${bonusViolenceFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })
      else if(bonusViolenceFixe < 0) violenceInclude.push({
          name:`${bonusViolenceFixe} ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
          desc:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.${key.toUpperCase()}.Description`)}`
      })

      rollFixe += bonusRollFixe;
      rollString += ` ${bonusRollString}`;
      attackDice += bonusAttackDice;
      attackFixe += bonusAttackFixe;
      degatsDice += bonusDegatsDice;
      degatsFixe += bonusDegatsFixe;
      violenceDice += bonusViolenceDice;
      violenceFixe += bonusViolenceFixe;
      };

      result = {
      roll:{
          fixe:rollFixe,
          string:rollString
      },
      attack:{
          dice:attackDice,
          fixe:attackFixe,
          include:attackInclude,
          list:attackList
      },
      degats:{
          dice:degatsDice,
          fixe:degatsFixe,
          include:degatsInclude,
          list:degatsList
      },
      violence:{
          dice:violenceDice,
          fixe:violenceFixe,
          include:violenceInclude,
          list:violenceList
      }
      }
  }

  return result;
}

export function getSpecial(actor) {
    const wear = actor.system.wear;
    const armor = actor?.armureData || undefined;
    const getArmorData = armor !== undefined &&  wear === 'armure' ? armor?.system || false : false;

    let result = {
      raw:[],
      custom:[]
    }

    if(getArmorData !== false && wear === 'armure') {
      const specialList = getArmorData.special.selected;

      let raw = [];
      let custom = [];

      for (let [key, special] of Object.entries(specialList)) {
        switch(key) {
            case 'porteurlumiere':
                const lEPorteur = special.bonus.effets;
                raw = lEPorteur.raw;
                custom = lEPorteur.custom;
              break;
        };
      };

      result = {
        raw:raw,
        custom:custom
      }
    }

  return result;
}

export function getModuleBonus(actor, typeWpn, dataWpn, effetsWpn, distanceWpn, structurelleWpn, ornementaleWpn, isPNJ=false) {
  let result = {
    attack:{
      list:[],
      include:[],
      dice:0,
      fixe:0
    },
    degats:{
      include:[],
      dice:0,
      fixe:0,
      energie:0
    },
    violence:{
      include:[],
      dice:0,
      fixe:0
    }
  };

  if(isPNJ) return result;

  const actorModuleErsatz = actor?.moduleErsatz || {};
  const dataDgts = dataWpn?.degats?.module || {fixe:{}, variable:{}};
  const dataViolence = dataWpn?.violence?.module || {fixe:{}, variable:{}};
  const eRogue = actorModuleErsatz?.rogue?.has || false;

  const eLumiere = effetsWpn.raw.find(str => { if(str.includes('lumiere')) return true; });
  const aLumineuse = structurelleWpn.raw.find(str => { if(str.includes('lumineuse')) return true; });
  const aArabesque = ornementaleWpn.raw.find(str => { if(str.includes('arabesqueiridescentes')) return true; });
  const isLumiere = searchTrueValue([eLumiere, aLumineuse, aArabesque]);

  const eSilencieux = effetsWpn.raw.find(str => { if(str.includes('silencieux')) return true; });
  const aAssassine = structurelleWpn.raw.find(str => { if(str.includes('assassine')) return true; });
  const aSubsonique = distanceWpn.raw.find(str => { if(str.includes('munitionssubsoniques')) return true; });
  const isSilencieux = searchTrueValue([eSilencieux, aAssassine, aSubsonique]);

  for(let i = 0; i < dataDgts.fixe.length;i++) {
    const data = dataDgts.fixe[i];
    const dice = data.dice;
    const fixe = data.fixe;

    let labelValue = '';

    if(dice > 0) labelValue += `+${dice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
    if(fixe > 0) labelValue += `+${fixe}`;

    if(dice > 0 || fixe > 0) {
      result.degats.include.push({
        name:`${labelValue} ${data.label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:data.description
      });
    }

    result.degats.dice += dice;
    result.degats.fixe += fixe;
  }

  for(let i = 0; i < dataDgts.variable.length;i++) {
    const data = dataDgts.variable[i].selected;
    const dice = data.dice;
    const fixe = data.fixe;
    const energie = data.energie;

    let labelValue = '';
    let energieDice = energie?.dice || 0;
    let energieFixe = energie?.fixe || 0;

    if(dice > 0) labelValue += `+${dice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
    if(fixe > 0) labelValue += `+${fixe}`;

    if(dice > 0 || fixe > 0) {
      result.degats.include.push({
        name:`${labelValue} ${dataDgts.variable[i].label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:dataDgts.variable[i].description
      });
    }

    result.degats.dice += dice;
    result.degats.fixe += fixe;
    result.degats.energie += energieDice+energieFixe;
  }

  for(let i = 0; i < dataViolence.fixe.length;i++) {
    const data = dataViolence.fixe[i];
    const dice = data.dice;
    const fixe = data.fixe;

    let labelValue = '';

    if(dice > 0) labelValue += `+${dice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
    if(fixe > 0) labelValue += `+${fixe}`;

    if(dice > 0 || fixe > 0) {
      result.violence.include.push({
        name:`${labelValue} ${data.label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:data.description
      });
    }

    result.violence.dice += dice;
    result.violence.fixe += fixe;
  }

  for(let i = 0; i < dataViolence.variable.length;i++) {
    const data = dataViolence.variable[i].selected;
    const dice = data.dice;
    const fixe = data.fixe;
    const energie = data.energie;

    let labelValue = '';
    let energieDice = energie?.dice || 0;
    let energieFixe = energie?.fixe || 0;

    if(dice > 0 && fixe > 0) labelValue += `+${dice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
    if(fixe > 0) labelValue += `+${fixe}`;

    if(dice > 0 || fixe > 0) {
      result.violence.include.push({
        name:`${labelValue} ${dataViolence.variable[i].label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:dataViolence.variable[i].description
      });
    }

    result.violence.dice += dice;
    result.violence.fixe += fixe;
    result.violence.energie += energieDice+energieFixe;
  }

  if((eRogue && typeWpn === 'contact' && !isLumiere) || (eRogue && typeWpn === 'distance' && isSilencieux)) {
    const data = actorModuleErsatz.rogue;
    let bonusAttack = getCaracValue(data.attaque, actor, true)+getODValue(data.attaque, actor, true);
    let bonusDgtsDice = 0;
    let bonusDgtsFixe = 0;

    if(data.degats.fixe) bonusDgtsFixe += getCaracValue(data.degats.caracteristique, actor, true);
    if(data.degats.dice) bonusDgtsDice += getCaracValue(data.degats.caracteristique, actor, true);
    if(data.degats.od && data.degats.dice) bonusDgtsDice += getODValue(data.degats.caracteristique, actor, true);
    if(data.degats.od && data.degats.fixe) bonusDgtsFixe += getODValue(data.degats.caracteristique, actor, true);

    result.attack.dice += bonusAttack;
    result.degats.dice += bonusDgtsDice;
    result.degats.fixe += bonusDgtsFixe;

    result.attack.include.push({
      name:`+${bonusAttack}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${data.label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:data.description
    });

    if(data.degats.dice && data.degats.fixe) {
      result.degats.include.push({
        name:`+${bonusDgtsDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${bonusDgtsFixe} ${data.label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:data.description
      });
    } else if(data.degats.dice) {
      result.degats.include.push({
        name:`+${bonusDgtsDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${data.label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:data.description
      });
    } else if(data.degats.fixe) {
      result.degats.include.push({
        name:`+${bonusDgtsFixe} ${data.label} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:data.description
      });
    }

    if(data.interruption.actif && !data.permanent) {
      actor.items.get(data._id).update({[`system.active.base`]:false});
    }
  }

  return result;
}

export function getAspectValue(a, d, isData = false, translateBefore = false) {
  const actor = isData ? d :  game.actors.get(d);
  const aspect = translateBefore ? caracToAspect(a) : a;
  const value = actor?.system?.aspects?.[aspect]?.value ?? 0;

  return Number(value);
}

export function getTotalAE(a, d, isData = false, translateBefore = false) {
  const actor = isData ? d : game.actors.get(d);
  const aspect = translateBefore ? caracToAspect(a) : a;
  const ae = getAEValue(aspect, d, true);

  return Number(ae.mineur+ae.majeur);
}

export function getAEValue(a, d, isData = false) {
  const actor = isData ? d : game.actors.get(d);
  const aspect = actor?.system?.aspects?.[a]?.ae;
  const mineur = aspect?.mineur?.value ?? 0;
  const majeur = aspect?.majeur?.value ?? 0;

  return {mineur, majeur};
}

export function getCaracValue(c, d, isData = false) {
  const actor = isData ? d : game.actors.get(d);
  let result = 0;

  if(c === '' || c === undefined) { return result; }

  const aspects = actor.system.aspects;
  for (let [key, aspect] of Object.entries(aspects)){
    const tCarac = aspect.caracteristiques?.[c]?.value || false;

    if(tCarac !== false) {
      return tCarac;
    }

  }

  return result;
}

const aspects = {
  'chair':true,
  'bete':true,
  'dame':true,
  'masque':true,
  'machine':true
}

const caracteristiques = {
  'deplacement':'chair',
  'force':'chair',
  'endurance':'chair',
  'hargne':'bete',
  'combat':'bete',
  'instinct':'bete',
  'tir':'machine',
  'savoir':'machine',
  'technique':'machine',
  'aura':'dame',
  'parole':'dame',
  'sangFroid':'dame',
  'discretion':'masque',
  'dexterite':'masque',
  'perception':'masque'
};

export function caracToAspect(c) {
  return caracteristiques[c] ?? null;
}

export function isAspect(a) {
  return aspects[a] ?? false;
}

export function getODValue(c, d, isData = false) {
  const actor = isData ? d : game.actors.get(d);
  const wear = actor.system.wear;
  let result = 0;

  if(c === '' || c === undefined) { return result; }

  const aspects = actor.system.aspects;

  for (let [key, aspect] of Object.entries(aspects)){
    const tCarac = aspect.caracteristiques?.[c] || false;

    if(tCarac !== false) {
      if(wear === 'armure' || wear === 'ascension') { return tCarac.overdrive.value; }
    }

  }

  return result;
}

export function getCaracPiloteValue(c, d, isData = false) {
  const actor = isData ? d : game.actors.get(d);
  let result = 0;

  if(c === '' || c === undefined) { return result; }

  const aspects = actor.pilote.aspects;
  for (let [key, aspect] of Object.entries(aspects)){
    const tCarac = aspect.caracteristiques?.[c]?.value || false;

    if(tCarac !== false) {
      return tCarac;
    }
  }

  return result;
}

export function getODPiloteValue(c, d, isData = false) {
  const actor = isData ? d : game.actors.get(d);
  let result = 0;

  if(c === '' || c === undefined) { return result; }

  const aspects = actor.pilote.aspects;

  for (let [key, aspect] of Object.entries(aspects)){
    const tCarac = aspect.caracteristiques?.[c] || false;

    if(tCarac !== false) {
      return tCarac.overdrive.value;
    }

  }

  return result;
}

export function getModStyle(style) {
  const result = {
      bonus:{
          attaque:0,
          reaction:0,
          defense:0
      },
      malus:{
          attaque:0,
          reaction:0,
          defense:0
      },
      caracteristiques:[]
  };

  switch(style) {
      case "acouvert":
          result.malus.attaque = 3;
          result.bonus.reaction = 2;
          break;

      case "agressif":
          result.bonus.attaque = 3;
          result.malus.reaction = 2;
          result.malus.defense = 2;
          break;

      case "akimbo":
          result.malus.attaque = 3;
          break;

      case "ambidextre":
          result.malus.attaque = 3;
          break;

      case "defensif":
          result.malus.attaque = 3;
          result.bonus.defense = 2;
          break;

      case "pilonnage":
          result.malus.attaque = 2;
          break;

      case "puissant":
          result.malus.reaction = 2;
          result.malus.defense = 2;
          break;

      case "precis":
          result.caracteristiques = ['dexterite', 'instinct', 'savoir', 'sangFroid'];
          break;
  }

  return result;
}

export async function confirmationDialog() {
  const confirmation = await Dialog.confirm({
    title:game.i18n.localize("KNIGHT.AUTRE.Confirmation"),
    content:game.i18n.localize("KNIGHT.AUTRE.ConfirmationSuppression")
  });

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        confirmation
      );
    }, 0);
  });
};

export async function getArmor(actor) {
  const getItems = await actor.getEmbeddedCollection("Item");

  return getItems.find(armure => armure.type === 'armure');
}

export async function getAllArmor(actor) {
  const getItems = await actor.getEmbeddedCollection("Item");

  return getItems.filter(armor => armor.type === 'armure');
}

function compareObjects(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length != obj2Keys.length) {
    return false;
  }

  for (let i = 0; i < obj1Keys.length; i++) {
    const key = obj1Keys[i];
    if (obj1[key] != obj2[key]) {
      return false;
    }
  }

  return true;
};

export function compareArrays(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!compareObjects(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
};

export function getKnightRoll(actor, hasEntraide=true) {
  const hasInstance = Object.values(ui.windows).find((app) => app instanceof game.knight.applications.KnightRollDialog);
  const isExist = !hasInstance ? false : true;

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

export function getFlatEffectBonus(wpn, forceEquipped=false) {
  const data = wpn.system;
  const type = data.type;
  const equipped = data?.equipped || false;
  const effets = data.effets.custom;

  let result = {
    cdf:0
  };

  if(!equipped && !forceEquipped) return result;

  let lEffets = [];

  switch(type) {
    case 'contact':
      const effets2Mains = data?.options2mains?.has || false ? data.effets2mains.custom : [];
      const ornementales = data?.ornementales?.custom || [];
      const structurelles = data?.structurelles?.custom || [];

      lEffets = effets.concat(effets2Mains, ornementales, structurelles);
      break;

    case 'distance':
      const distance = data?.distance?.custom || [];

      lEffets = effets.concat(distance);
      break;
  }

  for(let i = 0;i < lEffets.length;i++) {
    const other = lEffets[i].other;

    if(other.cdf !== undefined) result.cdf += other.cdf;
  }



  return result;
};

//GESTION DES EFFETS

export async function addEffect(origin, toAdd) {
  origin.createEmbeddedDocuments('ActiveEffect', toAdd);
};

export async function updateEffect(origin, toUpdate) {
  origin.updateEmbeddedDocuments('ActiveEffect', toUpdate);
}

export function addOrUpdateEffect(origin, label, effect) {
  const version = game.version.split('.')[0];

  const listEffect = origin.getEmbeddedCollection('ActiveEffect');
  const effectExist = existEffect(listEffect, label);

  if(!effectExist && version < 11) addEffect(origin, [{
      label: label,
      changes:effect,
      disabled:false
    }]);
  else if(!effectExist && version > 10) addEffect(origin, [{
    name: label,
    changes:effect,
    disabled:false
  }]);
  else updateEffect(origin, [{
      "_id":effectExist._id,
      changes:effect,
      disabled:false
    }]);
}

export function countEffect(list, label) {
  const version = game.version.split(".")[0];
  let result;

  if(version < 11) result = list.filter(effect => effect.label === label);
  else if(version > 10) result = list.filter(effect => effect.name === label);

  return result;
}

export function existEffect(list, label) {
  const version = game.version.split(".")[0];
  let result;

  if(version < 11) result = list.find(effect => effect.label === label);
  else if(version > 10) result = list.getName(label);

  if(result === undefined) result = false;

  return result;
}

export function effectsGestion(actor, listWithEffect, isPJ=false, onArmor=false) {
  const version = game.version.split('.')[0];
  const listEffect = actor.getEmbeddedCollection('ActiveEffect');

  const toUpdate = [];
  const toAdd = [];

  for(let effect of listWithEffect) {
    const effectExist = existEffect(listEffect, effect.label);
    const effectCount = countEffect(listEffect, effect.label);
    let toggle = false;

    if(isPJ) {
      if(!onArmor && !effect.withoutArmor) toggle = true;
      if(onArmor && !effect.withArmor) toggle = true;
    }

    let num = 0;

    if(effectCount.length > 1) {
      for(let eff of effectCount) {
        if(num !== 0) {
          actor.deleteEmbeddedDocuments('ActiveEffect', [eff.id]);
        }

        num++;
      }
    }

    if(effectExist) {
      if(!compareArrays(effectExist.changes, effect.data)) toUpdate.push({
        "_id":effectExist._id,
        changes:effect.data,
        disabled:toggle
      });
      else if(effectExist.disabled !== toggle) toUpdate.push({
        "_id":effectExist._id,
        disabled:toggle
      });
    } else if(version < 11) toAdd.push({
        label: effect.label,
        changes:effect.data,
        disabled:toggle
    });
    else if(version > 10) toAdd.push({
      name: effect.label,
      changes:effect.data,
      disabled:toggle
  });
  }

  if(toUpdate.length > 0) updateEffect(actor, toUpdate);
  if(toAdd.length > 0) addEffect(actor, toAdd);
}