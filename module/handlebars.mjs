/**
 * Custom Handlebars for KNIGHT
 */
 export const RegisterHandlebars = function () {

    Handlebars.registerHelper('civil', function (value) {
        return value === "tenueCivile";
    });

    Handlebars.registerHelper('guardian', function (value) {
        return value === "guardian";
    });

    Handlebars.registerHelper('armure', function (value) {
        return value === "armure";
    });

    Handlebars.registerHelper('ascension', function (value) {
        return value === "ascension";
    });

    Handlebars.registerHelper('armorTranslation', function (key) {
        return game.i18n.localize(CONFIG.KNIGHT.armures[key]);
    });

    Handlebars.registerHelper('capacite', function (capacite) {
        return `systems/knight/templates/items/armures/capacites/${capacite.key}.html`;
    });

    Handlebars.registerHelper('capaciteLegende', function (capacite) {
        return `systems/knight/templates/items/armuresLegende/capacites/${capacite.key}.html`;
    });

    Handlebars.registerHelper('special', function (special) {
        return `systems/knight/templates/items/armures/special/${special.data.key}.html`;
    });
    Handlebars.registerHelper('specialLegende', function (special) {
        return `systems/knight/templates/items/armuresLegende/special/${special.data.key}.html`;
    });

    Handlebars.registerHelper('mechaarmure', function (mecha) {

        if(mecha.hash.config) {
            mecha.data.root.systemData.configurations.liste[mecha.hash.type].modules[mecha.hash.key].config = true;
        }

        return `systems/knight/templates/actors/mechaarmure/${mecha.data.key}.html`;
    });

    Handlebars.registerHelper('affichageCapacite', function (capacite) {
        return `systems/knight/templates/actors/capacites/${capacite.key}.html`;
    });


    Handlebars.registerHelper('affichageCapaciteLegende', function (capacite) {
        return `systems/knight/templates/actors/capacitesLegende/${capacite.key}.html`;
    });

    Handlebars.registerHelper('affichageSpecial', function (special) {
        return `systems/knight/templates/actors/special/${special.key}.html`;
    });

    Handlebars.registerHelper('affichageSpecialLegende', function (special) {
        return `systems/knight/templates/actors/specialLegende/${special.key}.html`;
    });

    Handlebars.registerHelper('evolutions', function (evolution) {
        return `systems/knight/templates/items/armures/evolutions/${evolution.data.key}.html`;
    });

    Handlebars.registerHelper('whatTargetE', function (evolution) {
        return `system.evolutions.liste.${evolution.data.key}.description`;
    });

    Handlebars.registerHelper('whatTargetES', function (evolution) {
        return `system.evolutions.special.${evolution.data.key}.description`;
    });

    Handlebars.registerHelper('whatTargetFalcon', function (falcon) {
        return `system.evolutions.liste.${falcon.hash.key}.capacites.${falcon.data.key}.informations`;
    });

    Handlebars.registerHelper('capaciteDescription', function (value) {
        const description = value
        .replaceAll(/(?:\r\n|\r|\n)/g, "<br/>");

        return description;
    });

    Handlebars.registerHelper('getEffetsDescription', function (description) {
        const result = description.includes('<p>') ? description : "<p>"+description
        .replaceAll("\n**", "\n<b>")
        .replaceAll(" **", " <b>")
        .replaceAll("**", "</b>")
        .replaceAll("\r\n", "</p><p>")
        .replaceAll(" _", " <em>")
        .replaceAll("_", "</em>")+"</p>";

        return result;
    });

    Handlebars.registerHelper('rollSelectType', function (value) {
        const root = value.data.root;
        const key = value.data.key;

        let result = '';

        if(key === root.base) { result = 'base' }
        if(root.autre.includes(key)) { result = 'selected' }
        return result;
    });

    Handlebars.registerHelper('hasRollStyleSelected', function (list, carac) {
        let result = '';

        if(list === carac) result = 'selected';

        return result;
    });

    Handlebars.registerHelper('hasStyle', function (actuel, style) {
        let result = false;

        if(actuel === style) result = true;
        return result;
    });

    Handlebars.registerHelper('canUseStyle', function (style, typeWpn, idActor=-1, idWpn=-1) {
        let result = false;

        if(idActor === -1 || (idWpn === -1 && typeWpn !== 'longbow') || typeWpn === '') return result;

        const actor = game.actors.get(idActor);
        const wpn = typeWpn === 'longbow' ? actor.longbow : actor.items.get(idWpn).system;

        let effets = [];
        if(typeWpn === 'longbow') {
            effets = effets.concat(wpn.effets.base.raw, wpn.effets.liste1.raw, wpn.effets.liste2.raw);

            if(wpn.effets.liste3.acces) effets = effets.concat(wpn.effets.liste3.raw);

        } else {
            effets = wpn.effets.raw;
        }

        const structurelle = typeWpn === 'longbow' ? [] : wpn.structurelles.raw;
        const distance = typeWpn === 'longbow' ? [] : wpn.distance.raw;

        const hasDeuxmains = effets.includes('deuxmains');
        const hasLourd = effets.includes('lourd');

        const hasAllegee = structurelle.includes('allegee');

        const hasHypervelocite = distance.includes('munitionshypervelocite');
        const hasRefroidissement = distance.includes('systemerefroidissement');

        switch(style) {
            case 'precis':
                if(typeWpn === 'contact') {
                    if((hasDeuxmains && !hasLourd && !hasAllegee) || hasLourd) result = true;
                }
            break;

            case 'pilonnage':
                if(typeWpn === 'distance' || typeWpn === 'longbow') {
                    if(hasDeuxmains || hasLourd || hasHypervelocite || hasRefroidissement) result = true;
                }
            break;

            case 'puissant':
                if(typeWpn === 'contact') {
                    if(hasLourd && !hasAllegee) result = true;
                }
            break;

            case 'suppression':
                if(typeWpn === 'distance' || typeWpn === 'longbow') {
                    if(hasLourd || (hasDeuxmains && hasHypervelocite) || (hasDeuxmains && hasRefroidissement) || (hasHypervelocite && hasRefroidissement)) result = true;
                }
            break;
        }

        return result;
    });

    Handlebars.registerHelper('rollSelectWpn', function (idWpn, nameWpn, typeWpn, idSelected, nameSelected, typeSelected) {
        const result = idWpn === idSelected && nameWpn === nameSelected && typeWpn === typeSelected ? true : false;

        return result;
    });

    Handlebars.registerHelper('rollSelectWpnImprovisees', function (idWpn, nameWpn, typeWpn, numWpn, idSelected, nameSelected, typeSelected, numSelected) {
        const result = idWpn === idSelected && nameWpn === nameSelected && typeWpn === typeSelected && +numWpn === +numSelected ? true : false;

        return result;
    });

    Handlebars.registerHelper('rollSelectOther', function (nameWpn, typeWpn, nameSelected, typeSelected) {
        const result = nameWpn === nameSelected && typeWpn === typeSelected ? true : false;

        return result;
    });

    Handlebars.registerHelper('hasWpnSelected', function (idWpn, nameWpn, typeWpn) {
        const result = idWpn === '' && nameWpn === '' && typeWpn === '' ? false : true;

        return result;
    });

    Handlebars.registerHelper('getCarac', function (value) {
        return game.i18n.localize(CONFIG.KNIGHT.caracteristiques[value]);
    });

    Handlebars.registerHelper('getAI', function (ai, detail) {
        return game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[ai][detail]);
    });

    Handlebars.registerHelper('getAspect', function (value) {
        return game.i18n.localize(CONFIG.KNIGHT.aspects[value]);
    });

    Handlebars.registerHelper('getType', function (value) {
        return game.i18n.localize(CONFIG.KNIGHT.type[value]);
    });

    Handlebars.registerHelper('getNods', function (value) {
        return game.i18n.localize(CONFIG.KNIGHT.nods[value]);
    });

    Handlebars.registerHelper('hasType', function (choix, type) {
        const has = choix[type] || false;
        return has;
    });

    Handlebars.registerHelper('isBande', function (value) {
        const result = value === 'bande' ? true : false;
        return result;
    });

    Handlebars.registerHelper('getGrenadeName', function (value) {
        return game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${value.charAt(0).toUpperCase()+value.substr(1)}`);
    });

    Handlebars.registerHelper('getPortee', function (value) {
        return game.i18n.localize(`KNIGHT.PORTEE.${value.charAt(0).toUpperCase()+value.substr(1)}`);
    });

    Handlebars.registerHelper('getActivation', function (value) {
        return game.i18n.localize(`KNIGHT.ACTIVATION.${value.charAt(0).toUpperCase()+value.substr(1)}`);
    });

    Handlebars.registerHelper('getEnergie', function (value) {
        return game.i18n.localize(`KNIGHT.ENERGIE.${value.charAt(0).toUpperCase()+value.substr(1)}`);
    });

    Handlebars.registerHelper('getDuree', function (value) {
        return game.i18n.localize(`KNIGHT.DUREE.${value.charAt(0).toUpperCase()+value.substr(1)}`);
    });

    Handlebars.registerHelper('getRarete', function (value) {
        return game.i18n.localize(`KNIGHT.ITEMS.MODULE.RARETE.${value.charAt(0).toUpperCase()+value.substr(1)}`);
    });

    Handlebars.registerHelper('getCategorie', function (value) {
        const c = value === '' ? '' : game.i18n.localize(`KNIGHT.ITEMS.MODULE.CATEGORIE.${value.charAt(0).toUpperCase()+value.substr(1)}`);

        return c;
    });

    Handlebars.registerHelper('getWpnType', function (value) {
        const result = value === '' ? '' : game.i18n.localize(`KNIGHT.COMBAT.ARMES.${value.toUpperCase()}.Label`);

        return result;
    });

    Handlebars.registerHelper('isWpnDistance', function (value) {
        if(value === 'distance') return true;
        else return false;
    });

    Handlebars.registerHelper('isWpnContact', function (value) {
        if(value === 'contact') return true;
        else return false;
    });

    Handlebars.registerHelper('hasEffet', function (name, type, root, min) {
        const isCapacite = root?.capacite || false;
        const data = root?.system || root;

        let result = false;

        if((isCapacite && type !== 'effets')) return result;

        const list = data[type]?.raw || [];
        const search = list.find((string) => string.startsWith(name));

        if(min === -1) {
            if(search !== undefined) result = true;
        } else {
            const value = +search.split(" ")[1];

            if(search !== undefined && isNaN(value)) result = true;
            else if(search !== undefined && !isNaN(value)) {
                if(value >= min) result = true;
            }
        }

        return result;
    });

    Handlebars.registerHelper('isNegative', function (v1, v2) {
        const result = (v1-v2) < 0 ? true : false;

        return result;
    });

    Handlebars.registerHelper('getPnjType', function (value) {
        const result = value === '' ? '' : game.i18n.localize(`KNIGHT.TYPE.${value.charAt(0).toUpperCase()+value.substr(1)}`);

        return result;
    });

    Handlebars.registerHelper('getMAModule', function (value) {
        return game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${value.toUpperCase()}.Label`);
    });

    Handlebars.registerHelper('getMAModuleDescription', function (value) {
        return game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${value.toUpperCase()}.Description`);
    });

    Handlebars.registerHelper('hasPE', function (pe, isEspoir, energieA, espoirA) {
        const peA = isEspoir === false ? energieA : espoirA;
        let result = false;

        if(pe <= peA) { result = true; }

        return result;
    });

    Handlebars.registerHelper('hasSpecial', function (value, special) {
        const spe = special?.[value] || false;
        let result = true;

        if(spe === false) { result = false; }

        return result;
    });

    Handlebars.registerHelper('isLowerThan', function (value, compare) {
        let result = false;

        if(value < compare) result = true;

        return result;
    });

    Handlebars.registerHelper('isHigherThan', function (value, compare) {
        let result = false;

        if(value > compare) result = true;

        return result;
    });

    Handlebars.registerHelper('whileBetweenNumber', function (min, max) {
        const result = [];

        for(let i = min;i <= max;i++) {
            result.push(i);
        }

        return result;
    });

    Handlebars.registerHelper('whileBetweenRange', function (min, max) {
        const numberToRange = {
            0:'contact',
            1:'courte',
            2:'moyenne',
            3:'longue',
            4:'lointaine'
        };

        const rangeToNumber = {
            'contact':0,
            'courte':1,
            'moyenne':2,
            'longue':3,
            'lointaine':4,
        };

        let rMin = rangeToNumber[min];
        let rMax = rangeToNumber[max];

        const result = [];

        for(rMin;rMin <= rMax;rMin++) {
            result.push(numberToRange[rMin]);
        }

        return result;
    });

    Handlebars.registerHelper('isEmpty', function (array, isObject=true) {
        let result = true;

        if(array !== undefined) {
            if(isObject) {
                if(Object.keys(array).length !== 0) result = false;
            } else {
                if(array.length !== 0) result = false;
            }
        }

        return result;
    });

    Handlebars.registerHelper('hasTrueValue', function (value1=false, value2=false, value3=false, value4=false) {
        const array = [value1, value2, value3, value4];
        const length = array.length;

        let result = false;

        for(let i = 0;i < length;i++) {
            if(array[i] === true) {
                result = true;
            }
        }

        return result;
    });

    Handlebars.registerHelper('isValue', function (value1, value2) {
        let result = false;

        if(value1 === value2) result = true;

        return result;
    });

    Handlebars.registerHelper('moduleCanBeActivate', function (data) {
        let result = false;
        const system = data.system;
        const isPermanent = system.permanent;
        const hasPNJ = system.pnj.has;
        const hasBonus = system.bonus.has;
        const energieTour = system.energie.tour.value;
        const energieMinute = system.energie.minute.value;
        const hasBard = system.ersatz.bard.has;
        const hasRogue = system.ersatz.rogue.has;
        const hasOD = system.overdrives.has;
        const hasArme = system.arme.has;

        if(energieMinute === 0 && energieTour === 0 && !hasPNJ && !isPermanent) result = true;

        if((energieMinute > 0 && !isPermanent) || (energieTour > 0  && !isPermanent)) {
            if(hasBard || hasRogue || hasOD || hasBonus || hasArme) result = true;
        };

        return result;
    });

    Handlebars.registerHelper('canRoll', function (type, roll) {
        let result = true;

        if(type === 'pj') {
            if(roll === 'chair' || roll === 'bete' || roll === 'machine' || roll === 'dame' || roll === 'masque') result = false;
        } else if(type === 'pnj') {
            if(roll === 'force' || roll === 'deplacement' || roll === 'endurance' ||
            roll === 'combat' || roll === 'hargne' || roll === 'instinct' ||
            roll === 'tir' || roll === 'savoir' || roll === 'technique' ||
            roll === 'aura' || roll === 'parole' || roll === 'sangFroid' ||
            roll === 'discretion' || roll === 'dexterite' || roll === 'perception') result = false;
        }

        return result;
    });
 };