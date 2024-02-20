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

    Handlebars.registerHelper('capaciteIsValid', function (actor, capacite, key) {
        let result;
        if(capacite.key === undefined) result = false;
        else result = true;

        if(!result && actor.data.type === 'knight') actor.actor.items.get(actor.actor.armureData._id).update({[`system.capacites.selected.-=${key}`]:null})

        return result;
    });

    Handlebars.registerHelper('specialIsValid', function (actor, special, key) {
        let result;
        if(special.key === undefined) result = false;
        else result = true;

        if(!result && actor.data.type === 'knight') actor.actor.items.get(actor.actor.armureData._id).update({[`system.special.selected.-=${key}`]:null})

        return result;
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

    Handlebars.registerHelper('whatTargetLongbow', function (evolution) {
        return `system.evolutions.special.${evolution.data.key}.${evolution.hash.num}.description`;
    });

    Handlebars.registerHelper('whatTargetFalcon', function (falcon) {
        return `system.evolutions.liste.${falcon.hash.key}.capacites.${falcon.data.key}.informations`;
    });

    Handlebars.registerHelper('capaciteDescription', function (value) {
        if(value === undefined) return '';

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

    Handlebars.registerHelper('getAvDvDescription', function (description) {
        const result = description
        .replaceAll("<b>", "")
        .replaceAll("</b>", "")
        .replaceAll("<p>", "")
        .replaceAll("</p>", "")
        .replaceAll("<em>", "")
        .replaceAll("</>", "</>");

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

        if(idActor === -1 || (idWpn === -1 && typeWpn !== 'longbow') || typeWpn === '' || typeWpn === 'grenades') return result;

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
                    if((hasDeuxmains && !hasAllegee) || hasLourd) result = true;
                }
            break;

            case 'pilonnage':
                if(typeWpn === 'distance' || typeWpn === 'longbow') {
                    if(hasDeuxmains || hasLourd || hasHypervelocite || hasRefroidissement) result = true;
                }
            break;

            case 'puissant':
                if(typeWpn === 'contact') {
                    if(hasLourd) result = true;
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
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${label}`);
    });

    Handlebars.registerHelper('getNodsName', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.COMBAT.NODS.${label}`);
    });

    Handlebars.registerHelper('getPortee', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.PORTEE.${label}`);
    });

    Handlebars.registerHelper('getActivation', function (value) {
        if(value === undefined) return '';

        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.ACTIVATION.${label}`);
    });

    Handlebars.registerHelper('getEnergie', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.ENERGIE.${label}`);
    });

    Handlebars.registerHelper('getDuree', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.DUREE.${label}`);
    });

    Handlebars.registerHelper('getRarete', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        return game.i18n.localize(`KNIGHT.ITEMS.MODULE.RARETE.${label}`);
    });

    Handlebars.registerHelper('getCategorie', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        const c = value === '' ? '' : game.i18n.localize(`KNIGHT.ITEMS.MODULE.CATEGORIE.${label}`);

        return c;
    });

    Handlebars.registerHelper('getCategorieName', function (value) {
        if(value === undefined) return '';
        let name = value;
        if(Array.isArray(name)) name = value[0];
        const listName = Object.assign({}, CONFIG.KNIGHT.module.categorie.normal, CONFIG.KNIGHT.module.categorie.prestige);

        const label = name.toString().charAt(0).toUpperCase()+name.toString().substr(1);
        const c = value === '' ? '' : game.i18n.localize(listName[value]);

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
        const listFilter = list.filter(item => item !== undefined);
        const search = listFilter.find((string) => string.startsWith(name));

        if(min === -1) {
            if(search !== undefined) result = true;
        } else {
            const value = +search?.split(" ")[1] || undefined;

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

    Handlebars.registerHelper('NiveauisHigherThan', function (value, compare) {
        const val = Number(value.substring(1));

        let result = false;

        if(val > compare) result = true;

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

    Handlebars.registerHelper('wpnHasMunitions', function (isDistance, hasMunitions) {
        let result = false;

        if(isDistance === true && hasMunitions === true) result = true;

        return result;
    });

    Handlebars.registerHelper('wpnHasDeuxMains', function (isDistance, hasDeuxMains) {
        let result = false;

        if(isDistance === false && hasDeuxMains === true) result = true;

        return result;
    });

    Handlebars.registerHelper('isValue', function (value1, value2) {
        let result = false;

        if(value1 === value2) result = true;

        return result;
    });

    Handlebars.registerHelper('moduleCanBeActivate', function (data, type) {
        if(data === undefined) return false;
        let result = false;
        const system = data.system;
        const isPermanent = system.permanent;
        const hasPNJ = system.pnj?.has ?? false;
        const energieTour = system.energie?.tour?.value ?? 0;
        const energieMinute = system.energie?.minute?.value ?? 0;
        const energieSupp = system.energie?.supplementaire ?? 0;

        if(energieMinute === 0 && energieTour === 0 && !hasPNJ && !isPermanent && type === 'other') result = true;
        if(energieMinute === 0 && energieTour === 0 && !isPermanent && type === 'pnj') result = true;
        if(energieMinute > 0 && !isPermanent && type === 'minute') result = true;
        if(energieTour > 0  && !isPermanent && type === 'tour') result = true;
        if(energieSupp > 0  && !isPermanent && type === 'supplementaire') result = true;

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

    Handlebars.registerHelper('getOtherListPG', function (id, type, data, dataType) {
        let result = 0;

        if(id !== undefined) {
            const exist = data.progression.gloire.depense.autre[id];
            if(exist !== undefined) result = data.progression.gloire.depense.autre[id][type] ?? '';
        }

        switch(dataType) {
            case 'number':
                if(result === '') result = 0;
                result = Number(result);
                break;

            case 'bool':
                if(result === 'true') result = true;
                else result = false;
                break;
        }

        return result;
    });

    Handlebars.registerHelper('listCarac', function () {
        return CONFIG.KNIGHT.listCaracteristiques;
    });

    Handlebars.registerHelper('isntInclude', function (array, key) {
        const result = array.includes(key) ? false : true;

        return result;
    });

    Handlebars.registerHelper('localizeactivate', function (isactivate) {
        const result = isactivate ? game.i18n.localize("KNIGHT.AUTRE.Desactiver") : game.i18n.localize("KNIGHT.AUTRE.Activer");

        return result;
    });

    Handlebars.registerHelper('localizechoix', function (ischoisi) {
        const result = ischoisi ? game.i18n.localize("KNIGHT.AUTRE.Choisi") : game.i18n.localize("KNIGHT.AUTRE.Choisir");

        return result;
    });

    Handlebars.registerHelper('companionsCanBeActivate', function (data, companion=null, legend=false) {
        const active = data?.active || {lion:false, wolf:false, crow:false};
        const deployable = legend ? 1 : data?.deployable || 1;
        const isActive = companion !== null ? active[companion] : true;

        let i = 0;

        if(active.lion) i++;
        if(active.wolf) i++;
        if(active.crow) i++;

        const result = i < deployable || isActive ? true : false;

        return result;
    });

    Handlebars.registerHelper('typeCanBeActivate', function (data, type, conflit, legende=false) {
        const isConflit = conflit === 'conflit' ? true : false;
        const soldier = data.type.soldier.conflit || data.type.soldier.horsconflit ? true : false;
        const scout = data.type.scout.conflit || data.type.scout.horsconflit ? true : false;
        const herald = data.type.herald.conflit || data.type.herald.horsconflit ? true : false;
        const scholar = data.type.scholar.conflit || data.type.scholar.horsconflit ? true : false;
        const hunter = data.type.hunter.conflit || data.type.hunter.horsconflit ? true : false;

        const limite = data.double && !legende ? 2 : 1;

        let result = true;
        let array = []

        switch(type) {
            case 'soldier':
                if(data.type.soldier.conflit && !isConflit) result = false;
                if(data.type.soldier.horsconflit && isConflit) result = false;

                array.push(scout, herald, scholar, hunter);
                break;

            case 'scout':
                if(data.type.scout.conflit && !isConflit) result = false;
                if(data.type.scout.horsconflit && isConflit) result = false;

                array.push(soldier, herald, scholar, hunter);
                break;

            case 'herald':
                if(data.type.herald.conflit && !isConflit) result = false;
                if(data.type.herald.horsconflit && isConflit) result = false;

                array.push(soldier, scout, scholar, hunter);
                break;

            case 'scholar':
                if(data.type.scholar.conflit && !isConflit) result = false;
                if(data.type.scholar.horsconflit && isConflit) result = false;

                array.push(soldier, scout, herald, hunter);
                break;

            case 'hunter':
                if(data.type.hunter.conflit && !isConflit) result = false;
                if(data.type.hunter.horsconflit && isConflit) result = false;

                array.push(soldier, scout, herald, scholar);
                break;
        }

        const count = array.reduce((acc, curr) => {
            return curr ? acc + 1 : acc;
        }, 0);

        if(count === limite) result = false;

        return result;
    });

    Handlebars.registerHelper('typeIsFree', function (data) {
        const soldier = data.type.soldier.conflit || data.type.soldier.horsconflit ? true : false;
        const scout = data.type.scout.conflit || data.type.scout.horsconflit ? true : false;
        const herald = data.type.herald.conflit || data.type.herald.horsconflit ? true : false;
        const scholar = data.type.scholar.conflit || data.type.scholar.horsconflit ? true : false;
        const hunter = data.type.hunter.conflit || data.type.hunter.horsconflit ? true : false;

        let result = false;
        let array = []

        array.push(soldier, scout, herald, scholar, hunter);

        const count = array.reduce((acc, curr) => {
            return curr ? acc + 1 : acc;
        }, 0);

        if(count === 1) result = true;

        return result;
    });

    Handlebars.registerHelper('hasCapacite', function (data, capacite) {
        let result = false;

        const capa = data?.actor?.armureData?.system?.capacites?.selected?.[capacite] || false

        if(capa) result = true;

        return result;
    });

    Handlebars.registerHelper('toLowerCase', function(str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper('hasNiveau', function(max) {
        const has = max > 1 ? true : false;

        return has;
    });

    Handlebars.registerHelper('canStepDownLvl', function(data) {
        const value = data.value;
        const prevIsIgnore = value > 1 ? data?.details?.[`n${value-1}`]?.ignore || false : false;
        const result = value > 1 && !prevIsIgnore ? true : false;

        return result;
    });

    Handlebars.registerHelper('compendiumFilter', function(data, search, name, key) {
        const gen = data?.[key] ?? false;
        const nameLower = name.toLowerCase();
        const searchLower = search.toLowerCase();
        const n = nameLower === '' ? false : !nameLower.includes(searchLower);
        let result = false;

        if(gen || n) result = true;

        return result;
    });

    Handlebars.registerHelper('compendiumColor', function(data, search, name, key) {
        const gen = data?.[key] ?? false;
        const nameLower = name.toLowerCase();
        const searchLower = search.toLowerCase();
        const n = nameLower === '' ? false : !nameLower.includes(searchLower);
        const previous = data?.previous ?? '';
        let result = false;
        let css = ''

        if(gen || n) result = true;

        if(!result && previous !== '') {
            css = previous === 'clair' ? 'fonce' : 'clair';
            data.previous = previous === 'clair' ? 'fonce' : 'clair';
        } else if(!result && previous === '') {
            css = 'fonce';
            data.previous = 'fonce';
        }

        return css;
    });

    Handlebars.registerHelper('getCompendiumAI', function (str) {
        const list = {
            'standard':'KNIGHT.AUTRE.Standard',
            'ia':'KNIGHT.IA.Label',
            'avantage':'TYPES.Item.avantage',
            'inconvenient':'TYPES.Item.inconvenient',
        };

        return game.i18n.localize(list?.[str] ?? str);
    });
 };