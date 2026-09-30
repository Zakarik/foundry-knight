
function sanitizePath(root, data) {
    let sanitized = data.path;
    let type = data.type;
    let apply = true;
    let dice = false;
    let max = false;
    let base = false;

    if (sanitized.startsWith("system.")) {
        sanitized = sanitized.substring("system.".length);
    }

    if(root.actor.type === 'knight') {
        const conditionnal = ['sante', 'champDeForce', 'armure', 'energie', 'reaction', 'defense'];

        if (conditionnal.some(k => sanitized.includes(k))) {
            const wear = root?.wear ?? 'tenueCivile';

            if(!sanitized.includes('.withArmor') && wear === 'armure') apply = false;
        }
    }

    if(sanitized.includes('.diceMod')) dice = true;
    if(sanitized.includes('.max')) max = true;
    if(sanitized.includes('.base')) base = true;

    sanitized = sanitized.replaceAll('.withArmor', '');
    sanitized = sanitized.replaceAll('.diceMod', '');
    sanitized = sanitized.replaceAll('.max', '');
    sanitized = sanitized.replaceAll('.base', '');

    switch(type) {
        case 'decrease':
            if(dice) sanitized = `${sanitized}.diceMalus`;
            else if(base) sanitized = `${sanitized}.baseMalus`;
            else sanitized = `${sanitized}.malus`;
            break;

        case 'override':
            if(dice) sanitized = `${sanitized}.diceOverride`;
            else if(base) sanitized = `${sanitized}.baseOverride`;
            else sanitized = `${sanitized}.override`;
            break;

        case 'divide':
            if(dice) sanitized = `${sanitized}.diceDivide`;
            else if(base) sanitized = `${sanitized}.baseDivide`;
            else sanitized = `${sanitized}.divide`;
            break;

        default:
            if(dice) sanitized = `${sanitized}.diceBonus`;
            else if(base) sanitized = `${sanitized}.baseBonus`;
            else sanitized = `${sanitized}.bonus`;
            break;
    }

    if(max) sanitized = `${sanitized}Max`

    return {
        apply,
        path:sanitized,
    }
}

export async function processAEUpdate(actor, itemsEffects, str) {
    // ==========================================
    // Fonctions utilitaires internes
    // ==========================================
    const processSpecialUpdate = (cyberware, path, toUpdate) => {
        let finalPath = path;
        if (finalPath.startsWith("system.")) {
            finalPath = finalPath.substring("system.".length);
        }

        if(finalPath.includes('noMalusStyle') || finalPath.includes('noDmgSante') || finalPath.includes('.recuperation.aucun')) {
            toUpdate[finalPath] = cyberware.value === true || String(cyberware.value).toLowerCase() === "true";
        }
    }

    const processSTDUpdate = (toUpdate) => {
        for(let up in toUpdate) {
            let parts = up.split('.');
            let parent = parts.reduce((obj, key) => {
                if (!obj[key]) obj[key] = {};
                return obj[key];
            }, actor);

            if (parent) {
                Object.defineProperty(parent, str, {
                    value: toUpdate[up],
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
        }
    }

    const processSPEUpdate = (toUpdate) => {
        for(let up in toUpdate) {
            const parts = up.split('.');
            const lastKey = parts.pop();
            const parent = parts.reduce((obj, key) => {
                if (!obj[key]) obj[key] = {};
                return obj[key];
            }, actor);

            if (parent) {
                Object.defineProperty(parent, lastKey, {
                    value: toUpdate[up],
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
        }
    }
    // ==========================================
    // Fonctions de traitement de la boucle (Processors)
    // ==========================================

    // 1. Le traitement standard (votre code actuel extrait)
    const processStandardEffect = (actor, c, toUpdate, speUpdate) => {
        if(!c?.path) return;

        const processPath = sanitizePath(actor, c);
        if(!processPath.apply) return;

        let path = processPath.path;
        const SPECIALCFG = CONFIG?.KNIGHT?.EFFECTS?.INPUTTYPE?.[c.path];

        if(SPECIALCFG) {
            processSpecialUpdate(c, c.path, speUpdate);
        } else if(c.type === 'override') {
            if(toUpdate[path]) toUpdate[path] = Math.max(Number(c.value), toUpdate[path]);
            else toUpdate[path] = Number(c.value);
        } else if(c.type === 'divide') {
            if(toUpdate[path]) toUpdate[path] = Math.max(Math.max(Number(c.value), toUpdate[path]), 0);
            else toUpdate[path] = Number(c.value);
        } else {
            console.error(path)
            if(toUpdate[path]) toUpdate[path] += Number(c.value);
            else toUpdate[path] = Number(c.value);
        }
    };

    // 2. La variante alternative (à compléter selon vos besoins futurs)
    const processListEffect = (actor, c, toUpdate, speUpdate) => {
        if(!c?.path) return;

        if(c.path.includes('.aspects.') && c.path.includes('.max')) {

            for(const a of CONFIG.KNIGHT.LIST.aspects) {
                const str = `system.aspects.${a}.max`;

                processStandardEffect(actor, {
                    type:c.type,
                    path:str,
                    max:true,
                    value:c.value,
                }, toUpdate, speUpdate)
            }
        }

    };

    // ==========================================
    // Boucle principale
    // ==========================================
    const toUpdate = {};
    const speUpdate = {};

    for(let c of itemsEffects) {
        // Condition pour choisir quelle fonction utiliser
        let useListVariant = false;

        if(c.path.includes('.allmodified')) useListVariant = true;
        if (useListVariant) {
            processListEffect(actor, c, toUpdate, speUpdate);
        } else {
            processStandardEffect(actor, c, toUpdate, speUpdate);
        }
    }

    if(!foundry.utils.isEmpty(toUpdate)) processSTDUpdate(toUpdate);
    if(!foundry.utils.isEmpty(speUpdate)) processSPEUpdate(speUpdate);
}