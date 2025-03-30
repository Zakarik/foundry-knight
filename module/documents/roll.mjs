import {
    getAllEffects,
} from "../helpers/common.mjs";

// DATA
// name : Nom du jet
// dices : Formula du jet (uniquement les dés)
// bonus : Array contenant la liste des bonus (uniquement des valeurs numériques)
// carac : Array contenant la liste des caractéristiques / aspects utilisés
// weapon : L'arme
// style : Style de combat)
export class RollKnight {
    static template = 'systems/knight/templates/dices/roll.html';
    static tooltip = 'systems/knight/templates/dices/tooltip.html';
    static EPICFAIL = 2;
    static EPICSUCCESS = 1;
    static NORMAL = 0;

    constructor(actor, data={}, isSuccess=true) {
        this.actor = actor;
        this.name = data?.name ?? '';
        this.formula = data?.dices ?? '0D6';
        this.bonus = data?.bonus ?? [];
        this.carac = data?.carac ?? [];
        this.weapon = data?.weapon ?? undefined;
        this.item = data?.item ?? undefined;
        this.effectspath = data?.effectspath ?? undefined;
        this.isSuccess = isSuccess;
        this.style = data?.style ?? 'standard';
        this.dataStyle = data?.dataStyle ?? {};
        this.dataMod = data?.dataMod ?? {degats:{dice:0, fixe:0}, violence:{dice:0, fixe:0}};
        this.maximize = data?.maximize ?? {degats:false, violence:false}
        this.tags = data?.tags ?? [];
        this.isSurprise = data?.surprise ?? false;
        this.exploit = data?.exploit ?? true;
        this.difficulte = data?.difficulte ?? undefined;
        this.addContent = data?.addContent ?? {};
        this.addFlags = data?.addFlags ?? {};
    }

    get isVersion12() {
        const version = game.version.split('.')[0];
        const isVersion12 = version >= 12 ? true : false;

        return isVersion12;
    }

    get isPJ() {
        const actor = this.attaquant.type;
        let result = false;

        if(actor === 'knight') result = true;

        return result;
    }

    get attaquant() {
        const attaquant = this.actor.type === 'vehicule' ? this.actor.pilot : this.actor;

        return attaquant;
    }

    get armorIsWear() {
        const wear = this.attaquant.system?.wear ?? '';
        let result = false;

        if((wear === 'armure' || wear === 'ascension') || !this.isPJ) result = true;

        return result;
    }

    async doRoll(updates={}, effets={}, addData={}) {
        let total = 0;

        if(!this.weapon) {
            const roll = new Roll(this.formula);
            await roll.evaluate();

            const process = await this.#processRoll(roll);
            total = await this.#sendRoll(process, effets, addData, updates);
        } else {
            const weapon = this.weapon;
            const allRaw = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? [], weapon?.distance?.raw ?? []);
            let text = '';
            let allContent = [];
            let allFlag = []
            let allRoll = [];
            let listTargets = [];
            let finalDataToAdd = {};

            if(this.#isEffetActive(allRaw, weapon.options, ['cadence', 'chromeligneslumineuses'])) {
                const targets = game.user.targets;
                let n = 0;

                if(targets && targets.size > 0) {
                    for(let t of targets) {
                        const roll = new Roll(this.formula);
                        await roll.evaluate();

                        const process = await this.#processRoll(roll);
                        const prepareWeapon = await this.#prepareRollWeapon(foundry.utils.mergeObject(process, {
                            target:t,
                            index:n,
                        }));

                        allContent.push(prepareWeapon.content);
                        allFlag.push(prepareWeapon.flags);
                        allRoll = allRoll.concat(process.rolls)

                        n++;
                    }
                } else {
                    const roll = new Roll(this.formula);
                    await roll.evaluate();

                    const process = await this.#processRoll(roll);
                    const prepareWeapon = await this.#prepareRollWeapon(process);

                    allContent.push(prepareWeapon.content);
                    allFlag.push(prepareWeapon.flags);
                    allRoll = allRoll.concat(process.rolls)
                }
            } else {
                if((this.#isEffetActive(allRaw, weapon.options, ['barrage']))) {
                    const prepareWeapon = await this.#prepareSendWeaponWithoutRoll({});

                    allContent.push(prepareWeapon.content);
                    allFlag.push(prepareWeapon.flags);

                } else {
                    const roll = new Roll(this.formula);
                    await roll.evaluate();

                    const process = await this.#processRoll(roll);
                    const prepareWeapon = await this.#prepareRollWeapon(process);

                    allContent.push(prepareWeapon.content);
                    allFlag.push(prepareWeapon.flags);
                    allRoll = allRoll.concat(process.rolls)
                }
            }

            this.#sendRollWeapon({
                rolls:allRoll,
                content:allContent,
                text,
                targets:listTargets,
                flags:allFlag,
                finalDataToAdd,
                updates,
            })
        }

        if(!foundry.utils.isEmpty(updates)) {
            let updateArmure = {};
            let updateItems = {};

            for (let [key, value] of Object.entries(updates)) {
                const keySplit = key.split('.');
                const first = keySplit[0];

                if(first === 'armure') {
                    let oldKey = key;
                    key = keySplit.slice(1).join('.');
                    updateArmure[key] = value;

                    delete updates[oldKey];
                }

                if(first === 'item') {
                    let oldKey = key;
                    key = keySplit.slice(2).join('.');
                    updateItems[keySplit[1]] = {};
                    updateItems[keySplit[1]][key] = value;

                    delete updates[oldKey];
                }

                if (typeof value === 'string' && value.includes('@{rollTotal}')) {
                    let updatedValue = value.replace(/@{rollTotal}/g, total);

                    if (updatedValue.includes('@{max,')) {
                        const maxMatch = updatedValue.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                        if (maxMatch) {
                            const maxValue = parseFloat(maxMatch[1]);
                            updatedValue = updatedValue.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                            updatedValue = `Math.max(${updatedValue}, ${maxValue})`;
                        }
                    }

                    if (updatedValue.includes('@{min,')) {
                        const minMatch = updatedValue.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                        if (minMatch) {
                            const minValue = parseFloat(minMatch[1]);
                            updatedValue = updatedValue.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                            updatedValue = `Math.min(${updatedValue}, ${minValue})`;
                        }
                    }

                    try {
                        updates[key] = eval(updatedValue);
                    } catch (e) {
                        // Garde la valeur remplacée si l'évaluation échoue
                        updates[key] = updatedValue;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        if (typeof subValue === 'string' && subValue.includes('@{rollTotal}')) {
                            let updatedSubValue = subValue.replace(/@{rollTotal}/g, total);

                            if (updatedSubValue.includes('@{max,')) {
                                const maxMatch = updatedSubValue.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                                if (maxMatch) {
                                    const maxValue = parseFloat(maxMatch[1]);
                                    updatedSubValue = updatedSubValue.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                                    updatedSubValue = `Math.max(${updatedSubValue}, ${maxValue})`;
                                }
                            }

                            if (updatedSubValue.includes('@{min,')) {
                                const minMatch = updatedSubValue.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                                if (minMatch) {
                                    const minValue = parseFloat(minMatch[1]);
                                    updatedSubValue = updatedSubValue.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                                    updatedSubValue = `Math.min(${updatedSubValue}, ${minValue})`;
                                }
                            }

                            try {
                                value[subKey] = eval(updatedSubValue);
                            } catch (e) {
                                // Garde la valeur remplacée si l'évaluation échoue
                                value[subKey] = updatedSubValue;
                            }
                        }
                    }
                }
            }


            for (let [key, value] of Object.entries(updateArmure)) {
                if (typeof value === 'string' && value.includes('@{rollTotal}')) {
                    let updatedValue = value.replace(/@{rollTotal}/g, total);

                    if (updatedValue.includes('@{max,')) {
                        const maxMatch = updatedValue.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                        if (maxMatch) {
                            const maxValue = parseFloat(maxMatch[1]);
                            updatedValue = updatedValue.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                            updatedValue = `Math.max(${updatedValue}, ${maxValue})`;
                        }
                    }

                    if (updatedValue.includes('@{min,')) {
                        const minMatch = updatedValue.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                        if (minMatch) {
                            const minValue = parseFloat(minMatch[1]);
                            updatedValue = updatedValue.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                            updatedValue = `Math.min(${updatedValue}, ${minValue})`;
                        }
                    }

                    try {
                        updates[key] = eval(updatedValue);
                    } catch (e) {
                        // Garde la valeur remplacée si l'évaluation échoue
                        updates[key] = updatedValue;
                    }
                } else if (typeof value === 'object' && value !== null) {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        if (typeof subValue === 'string' && subValue.includes('@{rollTotal}')) {
                            let updatedSubValue = subValue.replace(/@{rollTotal}/g, total);

                            if (updatedSubValue.includes('@{max,')) {
                                const maxMatch = updatedSubValue.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                                if (maxMatch) {
                                    const maxValue = parseFloat(maxMatch[1]);
                                    updatedSubValue = updatedSubValue.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                                    updatedSubValue = `Math.max(${updatedSubValue}, ${maxValue})`;
                                }
                            }

                            if (updatedSubValue.includes('@{min,')) {
                                const minMatch = updatedSubValue.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                                if (minMatch) {
                                    const minValue = parseFloat(minMatch[1]);
                                    updatedSubValue = updatedSubValue.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                                    updatedSubValue = `Math.min(${updatedSubValue}, ${minValue})`;
                                }
                            }

                            try {
                                value[subKey] = eval(updatedSubValue);
                            } catch (e) {
                                // Garde la valeur remplacée si l'évaluation échoue
                                value[subKey] = updatedSubValue;
                            }
                        }
                    }
                }
            }

            for(let i in updateItems) {
                for (let [key, value] of Object.entries(updateItems[i])) {
                    if (typeof value === 'string' && value.includes('@{rollTotal}')) {
                        let updatedValue = value.replace(/@{rollTotal}/g, total);

                        if (updatedValue.includes('@{max,')) {
                            const maxMatch = updatedValue.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                            if (maxMatch) {
                                const maxValue = parseFloat(maxMatch[1]);
                                updatedValue = updatedValue.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                                updatedValue = `Math.max(${updatedValue}, ${maxValue})`;
                            }
                        }

                        if (updatedValue.includes('@{min,')) {
                            const minMatch = updatedValue.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                            if (minMatch) {
                                const minValue = parseFloat(minMatch[1]);
                                updatedValue = updatedValue.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                                updatedValue = `Math.min(${updatedValue}, ${minValue})`;
                            }
                        }

                        try {
                            updates[key] = eval(updatedValue);
                        } catch (e) {
                            // Garde la valeur remplacée si l'évaluation échoue
                            updates[key] = updatedValue;
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        for (const [subKey, subValue] of Object.entries(value)) {
                            if (typeof subValue === 'string' && subValue.includes('@{rollTotal}')) {
                                let updatedSubValue = subValue.replace(/@{rollTotal}/g, total);

                                if (updatedSubValue.includes('@{max,')) {
                                    const maxMatch = updatedSubValue.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                                    if (maxMatch) {
                                        const maxValue = parseFloat(maxMatch[1]);
                                        updatedSubValue = updatedSubValue.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                                        updatedSubValue = `Math.max(${updatedSubValue}, ${maxValue})`;
                                    }
                                }

                                if (updatedSubValue.includes('@{min,')) {
                                    const minMatch = updatedSubValue.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                                    if (minMatch) {
                                        const minValue = parseFloat(minMatch[1]);
                                        updatedSubValue = updatedSubValue.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                                        updatedSubValue = `Math.min(${updatedSubValue}, ${minValue})`;
                                    }
                                }

                                try {
                                    value[subKey] = eval(updatedSubValue);
                                } catch (e) {
                                    // Garde la valeur remplacée si l'évaluation échoue
                                    value[subKey] = updatedSubValue;
                                }
                            }
                        }
                    }
                }
            }

            if(!foundry.utils.isEmpty(updateArmure) && this.actor.system.dataArmor && (this.actor.type === 'knight' || this.actor.type === 'pnj')) {
                await this.actor.system.dataArmor.update(updateArmure);
            }

            if(!foundry.utils.isEmpty(updateItems)) {
                for(let i in updateItems) {
                    this.actor.items.get(i).update(updateItems[i]);
                }
            }

            if(!foundry.utils.isEmpty(updates)) await this.actor.update(updates);
        }

        return total;
    }

    async doRollDamage(data={}) {
        const chatRollMode = game.settings.get("core", "rollMode");
        const rollAttaque = data?.attaque ?? [];
        const attaque = data?.total ?? 0;
        const targets = data?.targets ?? [];
        const weapon = this.weapon;
        const label = data?.label ?? game.i18n.localize('KNIGHT.AUTRE.Degats');
        const rolls = [];
        const bonus = [];
        const addContent = data?.content ?? undefined;
        let total = 0;
        let flags = data?.flags ?? {};
        let main = {
            flavor:`${this.name}`,
            content:[],
            tags:[],
        }

        let content = {
            isSuccess:this.isSuccess,
            label:label,
            damage: this.actor.type !== "bande" ? true : undefined,
            debordement: this.actor.type === "bande" ? true : undefined,
        };

        if(addContent) {
            foundry.utils.mergeObject(content, addContent);
        }

        if(flags.dataMod.degats.dice > 0 || flags.dataMod.degats.fixe > 0) {
            let degatsMod = ``;

            if(flags.dataMod.degats.dice > 0) degatsMod = `${flags.dataMod.degats.dice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
            if(flags.dataMod.degats.fixe > 0) degatsMod += `${flags.dataMod.degats.fixe}`;

            main.tags.push({
                key:'modificateurdegats',
                label:`${game.i18n.localize('KNIGHT.JETS.Modificateur')} : +${degatsMod}`,
            });
        }

        if(flags.maximize.degats) {
            main.tags.push({
                key:'maximize',
                label:`${game.i18n.localize('KNIGHT.JETS.MaximizeDegatsTag')}`,
            });
        }

        const handleDamage = await this.#handleDamageEffet(weapon, data, bonus, main, rolls);
        const roll = handleDamage.roll;
        let results = roll.dice.reduce((acc, dice) => {
            dice.results.forEach(result => {
                let r = result.result;

                if(handleDamage.min) {
                    total += parseInt(r) < handleDamage.min ? 4 : parseInt(r);

                    if(parseInt(r) < handleDamage.min) r = 4;
                }

                acc.push({
                    value:r,
                    class:`d${dice._faces}`,
                });
            });
            return acc;
        }, []);

        if(!handleDamage.min) total = roll.total;

        rolls.push(roll);
        content.total = total+Object.values(bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        content.tooltip = await renderTemplate(RollKnight.tooltip, {parts:[{
            base:`${handleDamage.dices}D6`,
            bonus:bonus,
            total:content.total,
            title:handleDamage.title,
            results:results,
        }]});
        if(handleDamage.targets) content.targets = handleDamage.targets;

        main.content.push(content);

        let chatData = {
            user:game.user.id,
            speaker: {
                actor: this.actor?.id ?? null,
                token: this.actor?.token ?? null,
                alias: this.actor?.name ?? null,
                scene: this.actor?.token?.parent?.id ?? null
            },
            content:await renderTemplate(RollKnight.template, main),
            sound: CONFIG.sounds.dice,
            rolls:rolls,
            flags: flags,
            rollMode:chatRollMode,
        };

        if(!this.isVersion12) chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;

        await ChatMessage.create(chatData);
    }

    async doRollViolence(data={}) {
        const chatRollMode = game.settings.get("core", "rollMode");
        const rollAttaque = data?.attaque ?? [];
        const attaque = data?.total ?? 0;
        const targets = data?.targets ?? [];
        const weapon = this.weapon;
        const rolls = [];
        const bonus = [];
        let total = 0;
        let flags = data?.flags ?? {};
        let main = {
            flavor:`${this.name}`,
            content:[],
            tags:[],
        }

        let content = {
            isSuccess:this.isSuccess,
            label:game.i18n.localize('KNIGHT.AUTRE.Violence'),
            violence: true
        };

        if(flags.dataMod.violence.dice > 0 || flags.dataMod.violence.fixe > 0) {
            let violenceMod = ``;

            if(flags.dataMod.violence.dice > 0) violenceMod = `${flags.dataMod.violence.dice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
            if(flags.dataMod.violence.fixe > 0) violenceMod += `+${flags.dataMod.violence.fixe}`;

            tags.push({
                key:'modificateurviolence',
                label:`${game.i18n.localize('KNIGHT.JETS.ModificateurViolence')} : ${violenceMod}`,
            });
        }

        if(flags.maximize.violence) {
            main.tags.push({
                key:'maximize',
                label:`${game.i18n.localize('KNIGHT.JETS.MaximizeViolenceTag')}`,
            });
        }

        const handleDamage = await this.#handleViolenceEffet(weapon, data, bonus, main, rolls);
        const roll = handleDamage.roll;
        let results = roll.dice.reduce((acc, dice) => {
            dice.results.forEach(result => {
                let r = result.result;

                if(handleDamage.min) {
                    total += parseInt(r) < handleDamage.min ? 5 : parseInt(r);

                    if(parseInt(r) < handleDamage.min) r = 5;
                }

                acc.push({
                    value:r,
                    class:`d${dice._faces}`,
                });
            });
            return acc;
        }, []);

        if(!handleDamage.min) total = roll.total;

        rolls.push(roll);
        content.total = total+Object.values(bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        content.tooltip = await renderTemplate(RollKnight.tooltip, {parts:[{
            base:`${handleDamage.dices}D6`,
            bonus:bonus,
            total:content.total,
            title:handleDamage.title,
            results:results,
        }]});
        if(handleDamage.targets) content.targets = handleDamage.targets;

        main.content.push(content);

        let chatData = {
            user:game.user.id,
            speaker: {
                actor: this.actor?.id ?? null,
                token: this.actor?.token ?? null,
                alias: this.actor?.name ?? null,
                scene: this.actor?.token?.parent?.id ?? null
            },
            content:await renderTemplate(RollKnight.template, main),
            sound: CONFIG.sounds.dice,
            rolls:rolls,
            flags: flags,
            rollMode:chatRollMode,
        };

        if(!this.isVersion12) chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;

        await ChatMessage.create(chatData);
    }

    async sendMessage(data={}) {
        const chatRollMode = game.settings.get("core", "rollMode");
        let main = {
            flavor:`${this.name}`,
            tags:data?.tags ?? [],
            text:data?.text ?? '',
            classes:data?.classes,
        }
        let flags = data?.flags ?? {};

        let chatData = {
            user:game.user.id,
            speaker: {
                actor: this.actor?.id ?? null,
                token: this.actor?.token ?? null,
                alias: this.actor?.name ?? null,
                scene: this.actor?.token?.parent?.id ?? null
            },
            content:await renderTemplate(RollKnight.template, main),
            sound: CONFIG.sounds.dice,
            flags: flags,
            rollMode:chatRollMode,
        };

        if(!this.isVersion12) chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;

        await ChatMessage.create(chatData)

    }

    async #processRoll(roll) {
        if(!roll) return;

        const dices = roll.dice;
        let rolls = [roll];
        let rollState = RollKnight.NORMAL;
        let numbers = 0;
        let success = 0;

        let results;

        if(this.isSuccess) {
            results = dices.reduce((acc, dice) => {
                numbers += dice.number;

                dice.results.forEach(result => {
                    success += result.result%2 === 0 ? 1 : 0;

                    acc.push({
                        value:result.result,
                        class:`d${dice._faces} ${result.result%2 === 0 ? 'success' : 'fail'}`,
                    });
                });
                return acc;
            }, []);
        } else {
            results = dices.reduce((acc, dice) => {
                numbers += dice.number;

                dice.results.forEach(result => {
                    acc.push({
                        value:result.result,
                        class:`d${dice._faces}`,
                    });
                });
                return acc;
            }, []);
            success = roll.total;
        }

        if(this.isSuccess) {
            if(numbers === success && this.exploit) {
                const rEpicSuccess = new Roll(this.formula);
                await rEpicSuccess.evaluate();

                let epicSuccess = rEpicSuccess.dice.reduce((acc, dice) => {
                    dice.results.forEach(result => {
                        success += result.result%2 === 0 ? 1 : 0;

                        acc.push({
                            value:result.result,
                            class:`d${dice._faces} ${result.result%2 === 0 ? 'success' : 'fail'}`,
                        });
                    });
                    return acc;
                }, []);

                results = results.concat(epicSuccess);
                rollState = RollKnight.EPICSUCCESS;
                rolls.push(rEpicSuccess);
            } else if(success === 0 && this.exploit) rollState = RollKnight.EPICFAIL;
        }

        return {
            rolls,
            results,
            success,
            rollState,
        }
    }

    async #sendRoll(data={}, effets={}, addData={}, updates={}) {
        const rolls = data.rolls;
        const results = data.results;
        const success = data.success;
        const rollState = data.rollState;
        const bonus = this.bonus.reduce((acc, bonus) => acc + bonus, 0);
        const total = success + this.bonus.reduce((acc, bonus) => acc + bonus, 0);
        const listEffets = [];

        const chatRollMode = game.settings.get("core", "rollMode");
        const formula = rollState === RollKnight.EPICSUCCESS ? `${this.formula} + ${this.formula}` : this.formula;
        let isWon = false;
        let main = {
            flavor:`${this.name}`,
            content:[],
            tags:this.tags,
        };

        foundry.utils.mergeObject(main, addData);

        if(main.text) {
            if (typeof main.text === 'string' && main.text.includes('@{rollTotal}')) {
                let updatedText = main.text.replace(/@{rollTotal}/g, total);

                if (updatedText.includes('@{max,')) {
                    const maxMatch = updatedText.match(/@{max,\s*(-?\d+(\.\d+)?)}/);
                    if (maxMatch) {
                        const maxValue = parseFloat(maxMatch[1]);
                        updatedText = updatedText.replace(/@{max,\s*(-?\d+(\.\d+)?)}/g, '');
                        updatedText = `Math.max(${updatedText}, ${maxValue})`;
                    }
                }

                if (updatedText.includes('@{min,')) {
                    const minMatch = updatedText.match(/@{min,\s*(-?\d+(\.\d+)?)}/);
                    if (minMatch) {
                        const minValue = parseFloat(minMatch[1]);
                        updatedText = updatedText.replace(/@{min,\s*(-?\d+(\.\d+)?)}/g, '');
                        updatedText = `Math.min(${updatedText}, ${minValue})`;
                    }
                }

                try {
                    main.text = eval(updatedText);
                } catch (e) {
                    // Garde la valeur remplacée si l'évaluation échoue
                    main.text = updatedText;
                }
            }
        }

        let content = {
            caracteristiques:`${this.carac.join(' / ')}`,
            isSuccess:this.isSuccess,
            total:total,
            base:formula,
            bonus:this.bonus,
            tooltip:await renderTemplate(RollKnight.tooltip, {parts:[{
                base:formula,
                bonus:this.bonus,
                totalBonus:bonus,
                total:success,
                results:results,
            }]}),
        };

        foundry.utils.mergeObject(content, this.addContent);

        if(!foundry.utils.isEmpty(effets)) {
            const localize = getAllEffects();
            let hasChargeur = false;

            for(let e of effets.raw) {
                const loc = localize[e.split(' ')[0]];
                const effet = this.#getEffet(effets.raw, e);

                if(e.includes('chargeur')) {
                    hasChargeur = true;

                    listEffets.push({
                        simple:e,
                        key:effet,
                        label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${this.item.system.getMunition[this.effectspath.split('.')[0]]-1} / ${effet.split(' ')[1]}` : `${this.item.system.getMunition[this.effectspath.split('.')[0]]-1} / ${game.i18n.localize(loc.label)}`,
                        description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                    });
                } else {
                    listEffets.push({
                        simple:e,
                        key:effet,
                        label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                        description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                    });
                }


            }

            if(hasChargeur && this.effectspath) updates[`item.${this.item.id}.system.niveau.details.n${this.item.system.getNiveau}.${this.effectspath}.chargeur`] = Math.max(this.item.system.getMunition[this.effectspath.split('.')[0]]-1, 0);

            for(let c of effets.custom) {
                listEffets.push({
                    simple:c.label,
                    key:c.label,
                    label:`${c.label}`,
                    description:this.#sanitizeTxt(c.description),
                });
            }

            // if(listEffets) main.effets = listEffets.map(effet => `<span title="${effet.description.replace(/<.*?>/g, '')}" data-key="${effet.key}">${effet.label}</span>`).join(' / ');
            if(listEffets) main.effets = listEffets.map(effet => { return { description : effet.description.replace(/<.*?>/g, ''), key: effet.key, label: effet.label } });
        }

        if(!this.isSuccess) {
            content.label = `${formula}`;
            if(bonus > 0) content.label += ` + ${bonus}`;
        }

        if(this.difficulte && this.isSuccess) {
            if(content.total > this.difficulte && rollState !== RollKnight.EPICFAIL) isWon = true;

            if(isWon) {
                main.text = game.i18n.localize('KNIGHT.JETS.JetReussi');
                main.classes = 'success';
            } else {
                main.text = game.i18n.localize('KNIGHT.JETS.JetEchoue');
                main.classes = 'fail';
            }
        }

        if(rollState === RollKnight.EPICSUCCESS) content.rollState = {
            label:game.i18n.localize('KNIGHT.JETS.Exploit'),
            class:'explode',
        }
        else if(rollState === RollKnight.EPICFAIL) content.rollState = {
            label:game.i18n.localize('KNIGHT.JETS.EchecCritique'),
            class:'epicFail',
        }

        main.content.push(content);

        let chatData = {
            user:game.user.id,
            speaker: {
                actor: this.actor?.id ?? null,
                token: this.actor?.token ?? null,
                alias: this.actor?.name ?? null,
                scene: this.actor?.token?.parent?.id ?? null
            },
            content:await renderTemplate(RollKnight.template, main),
            sound: CONFIG.sounds.dice,
            rolls:rolls,
            rollMode:chatRollMode,
        };

        if(!this.isVersion12) chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;

        const msg = await ChatMessage.create(chatData);

        for(let f in this.addFlags) {
            msg.setFlag('knight', f, this.addFlags[f]);
        }

        return total;
    }

    async #prepareRollWeapon(data={}) {
        const results = data.results;
        const success = data.success;
        const rollState = data.rollState;
        const tgt = data?.target ?? undefined;
        const index = data?.index ?? 0;

        const isSurprise = this.isSurprise;
        const weapon = this.weapon;
        const allRaw = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? [], weapon?.distance?.raw ?? []);
        const targets = game.user.targets;
        const formula = rollState === RollKnight.EPICSUCCESS ? `${this.formula} + ${this.formula}` : this.formula;
        let flags = {};

        let content = {
            index:index,
            caracteristiques:`${this.carac.join(' / ')}`,
            isSuccess:this.isSuccess,
            total:success + this.bonus.reduce((acc, bonus) => acc + bonus, 0),
            base:formula,
            bonus:this.bonus,
            targets:[],
            weapon:this.weapon,
            tooltip:await renderTemplate(RollKnight.tooltip, {parts:[{
                base:formula,
                bonus:this.bonus,
                totalBonus:this.bonus.reduce((acc, bonus) => acc + bonus, 0),
                total:success,
                results:results,
            }]}),
        };

        if(rollState === RollKnight.EPICSUCCESS) content.rollState = {
            label:game.i18n.localize('KNIGHT.JETS.Exploit'),
            class:'explode',
        }
        else if(rollState === RollKnight.EPICFAIL) content.rollState = {
            label:game.i18n.localize('KNIGHT.JETS.EchecCritique'),
            class:'epicFail',
        }

        if(!this.#isEffetActive(allRaw, weapon.options, ['cadence', 'chromeligneslumineuses'])) {
            for(let t of targets) {
                const actor = t.actor;
                const getODDexterite = this.getOD('masque', 'dexterite', actor);
                const armorIsWear = this.armorIsWear;
                const pointsFaibles = actor.system?.pointsFaibles ?? '';

                let difficulty = 0;
                let target = {
                    id:t.id,
                    name:actor.name,
                    aspects:actor.system.aspects,
                    type:actor.type,
                    effets:[],
                };
                let ptsFaible = false;
                let resultDefense = ``;

                if(!isSurprise) {
                    let defValue = actor.system.defense.value;
                    let reaValue = actor.system.reaction.value;

                    if (this.carac.some(carac => pointsFaibles.includes(carac))) {
                        defValue = Math.ceil(defValue / 2);
                        reaValue = Math.ceil(reaValue / 2);
                        ptsFaible = true;
                    }

                    if(weapon.type === 'distance' && armorIsWear && getODDexterite >= 5) {
                        difficulty = Math.max(actor.system.defense.value, actor.system.reaction.value);

                        if(defValue > reaValue) resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense')} (${defValue})`;
                        else resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction')} (${reaValue})`;
                    }
                    else if(weapon.type === 'distance') {
                        difficulty = reaValue;
                        resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction')} (${reaValue})`;
                    }
                    else if(weapon.type === 'contact') {
                        difficulty = defValue;
                        resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense')} (${defValue})`;
                    }
                } else {
                    if(weapon.type === 'distance') resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction')} (0)`;
                    else if(weapon.type === 'contact') resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense')} (0)`;
                }

                target.ptsFaible = ptsFaible;
                target.difficulty = difficulty;

                if(content.total > difficulty) {
                    target.marge = content.total-difficulty;
                    target.hit = true;
                }

                target.defense = resultDefense;

                content.targets.push(target);
            }
        } else if(this.#isEffetActive(allRaw, weapon.options, ['cadence', 'chromeligneslumineuses']) && tgt) {
            const actor = tgt.actor;
            const getODDexterite = this.getOD('masque', 'dexterite', actor);
            const armorIsWear = this.armorIsWear;
            const pointsFaibles = actor.system?.pointsFaibles ?? '';
            let difficulty = 0;
            let target = {
                id:tgt.id,
                name:actor.name,
                aspects:actor.system.aspects,
                type:actor.type,
                effets:[],
            };
            let ptsFaible = false;
            let resultDefense = ``;


            if(!isSurprise) {
                const defValue = actor.system.defense.value;
                const reaValue = actor.system.reaction.value;

                if(weapon.type === 'distance' && armorIsWear && getODDexterite >= 5) {

                    difficulty = Math.max(defValue, reaValue);

                    if(defValue > reaValue) resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense')} (${defValue})`;
                    else resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction')} (${reaValue})`;
                }
                else if(weapon.type === 'distance') {
                    difficulty = actor.system.reaction.value;
                    resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction')} (${reaValue})`;
                }
                else if(weapon.type === 'contact') {
                    difficulty = actor.system.defense.value;
                    resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense')} (${defValue})`;
                }

                if (this.carac.some(carac => pointsFaibles.includes(carac))) {
                    difficulty = Math.ceil(difficulty / 2);
                    ptsFaible = true;
                }
            } else {
                if(weapon.type === 'distance') resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsReaction')} (0)`;
                else if(weapon.type === 'contact') resultDefense = `${game.i18n.localize('KNIGHT.JETS.RESULTATS.VsDefense')} (0)`;
            }

            target.difficulty = difficulty;

            if(content.total > difficulty) {
                target.marge = content.total-difficulty;
                target.hit = true;
                target.ptsFaible = ptsFaible;
            }
            target.defense = resultDefense;

            content.actorName = actor.name;
        }

        flags = {
            targets:content.targets,
            total:content.total,
        };

        return {
            content,
            flags,
        }
    }

    async #prepareSendWeaponWithoutRoll(data={}) {
        const index = data?.index ?? 0;
        const targets = game.user.targets;
        let flags = {};

        let content = {
            index:index,
            caracteristiques:`${this.carac.join(' / ')}`,
            bonus:this.bonus,
            targets:[],
            weapon:this.weapon,
            noAtk:true,
        };

        for(let t of targets) {
            const actor = t.actor;

            let target = {
                id:t.id,
                name:actor.name,
                aspects:actor.system.aspects,
                type:actor.type,
                effets:[],
                isEmpty:true,
            };

            content.targets.push(target);
        }

        flags = {
            targets:content.targets,
            total:content.total,
        };

        return {
            content,
            flags,
        }
    }

    async #sendRollWeapon(data={}) {
        const rolls = data?.rolls ?? [];
        const content = data?.content ?? [];
        const text = data?.text ?? '';
        const weapon = this.weapon;
        const flag = data?.flags ?? [];
        const tags = this.tags;
        const targets = data?.targets ?? [];
        const finalDataToAdd = data?.finalDataToAdd ?? {};


        if(this.weapon.portee) {
            const traPortee = game.i18n.localize(`KNIGHT.PORTEE.${this.weapon.portee.charAt(0).toUpperCase() + this.weapon.portee.slice(1)}`);

            tags.unshift({
                key:this.weapon.portee,
                label:traPortee.includes('KNIGHT.PORTEE') ? `${this.weapon.portee}` : `${traPortee}`
            },{
                key:this.style,
                label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${this.style.toUpperCase()}.FullLabel`)
            });
        } else if(this.isPJ) {
            tags.unshift({
                key:this.style,
                label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${this.style.toUpperCase()}.FullLabel`)
            });
        }

        const chatRollMode = game.settings.get("core", "rollMode");
        let main = {
            flavor:`${this.name}`,
            tags:tags,
            content:content,
            text:text,
            targets
        }

        let flags = {
            actor:this.actor,
            flavor:main.flavor,
            weapon:weapon,
            content:flag,
            surprise:this.isSurprise,
            style:this.style,
            dataStyle:this.dataStyle,
            dataMod:this.dataMod,
            maximize:this.maximize,
        };

        await this.#handleAttaqueEffet(weapon, main, rolls, data?.updates ?? {});
        foundry.utils.mergeObject(main, finalDataToAdd);
        flags = foundry.utils.mergeObject(this.addFlags, flags)
        let chatData = {
            user:game.user.id,
            speaker: {
                actor: this.actor?.id ?? null,
                token: this.actor?.token ?? null,
                alias: this.actor?.name ?? null,
                scene: this.actor?.token?.parent?.id ?? null
            },
            content:await renderTemplate(RollKnight.template, main),
            sound: CONFIG.sounds.dice,
            rolls:rolls,
            flags: flags,
            rollMode:chatRollMode,
        };

        if(!this.isVersion12) chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;

        await ChatMessage.create(chatData)
    }

    #isEffetActive(effets, options, data=[]) {
        let result = false;

        for(let d of data) {
            if(d === 'cadence' && this.#hasEffet(effets, 'chromeligneslumineuses')) continue;
            if(d === 'silencieux' && this.#hasEffet(effets, 'assassine')) continue;
            if(d === 'silencieux' && this.#hasEffet(effets, 'munitionssubsoniques')) continue;
            if(d === 'choc' && this.#hasEffet(effets, 'electrifiee')) continue;
            if(d === 'jumeleakimbo' && this.#hasEffet(effets, 'jumelle')) continue;
            if(d === 'jumeleakimbo' && this.#hasEffet(effets, 'jumelageakimbo')) continue;
            if(d === 'jumeleambidextrie' && this.#hasEffet(effets, 'soeur')) continue;
            if(d === 'jumeleambidextrie' && this.#hasEffet(effets, 'jumelageambidextrie')) continue;
            if(d === 'assistanceattaque' && this.#hasEffet(effets, 'connectee')) continue;
            if(d === 'assistanceattaque' && this.#hasEffet(effets, 'munitionshypervelocite')) continue;
            if(d === 'tirenrafale' && this.#hasEffet(effets, 'systemerefroidissement')) continue;
            if(d === 'tirensecurite' && this.#hasEffet(effets, 'interfaceguidage')) continue;
            if(d === 'antianatheme' && this.#hasEffet(effets, 'fauconplumesluminescentes')) continue;
            if(d === 'meurtrier' && this.#hasEffet(effets, 'barbelee')) continue;
            if(d === 'leste' && this.#hasEffet(effets, 'massive')) continue;
            if(d === 'orfevrerie' && this.#hasEffet(effets, 'sournoise')) continue;
            if(d === 'assassin' && this.#hasEffet(effets, 'revetementomega')) continue;

            if(this.#hasEffet(effets, d) && !this.#searchOptions(options, d)) result = true;
            else if(this.#hasEffet(effets, d) && this.#searchOptions(options, d).active) result = true;
        }


        return result;
    }

    #hasEffet(list, searched) {
        let result = false;
        let split = searched.split(' ')[0];
        const found = list.find(effet => effet.split(' ')[0] === split);
        if(found) result = true;

        return result;
    }

    #getEffet(list, searched) {
        const split = searched.split(' ')[0];
        return list.find(effet => effet.split(' ')[0] === split);
    }

    #searchOptions(list, searched) {
        let result = list.find(itm => itm.value === searched);

        return result;
    }

    async #handleAttaqueEffet(weapon, content, rolls, updates={}) {
        const armorIsWear = this.armorIsWear;
        const localize = getAllEffects();
        const raw = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? [], weapon?.distance?.raw ?? []);
        const options = weapon.options;
        const list = CONFIG.KNIGHT.LIST.EFFETS.attaque;
        const custom = weapon.effets.custom.concat(weapon?.distance?.custom ?? [], weapon?.ornementales?.custom ?? [], weapon?.structurelles?.custom ?? []);
        let detailledEffets = [];
        let effets = [];
        let noDmg = false;
        let noViolence = false;

        for(let l of list) {
            const loc = localize[l.split(' ')[0]];
            const effet = this.#getEffet(raw, l);

            if(this.#isEffetActive(raw, options, [l])) {
                if(this.#isEffetActive(raw, options, ['barrage'])) {
                    if(l === 'barrage') {
                        detailledEffets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                        });

                        noDmg = true;
                        noViolence = true;
                    } else {
                        if(effet) effets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                        });
                    }
                } else {
                    switch(l) {
                        case 'aucundegatsviolence':
                            if(effet) {
                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}`)),
                                });

                                noDmg = true;
                                noViolence = true;
                            }
                            break;

                        case 'chargeur':
                            if(effet) {
                                const isComposed = /module_|capacite_/.test(weapon.id) ? true : false;
                                const wpnId = isComposed ? weapon.id.split('_')[1] : weapon.id;
                                const wpn = this.actor.items.get(wpnId);
                                let qty = 0;

                                if(wpn) {
                                    if(isComposed) {
                                        wpn.system.useMunition(weapon.id.split('_')[2], weapon, updates);
                                        qty = wpn.system.qtyMunition(weapon.id.split('_')[2], weapon)-1;
                                    }
                                    else {
                                        wpn.system.useMunition(updates);
                                        qty = wpn.system.qtyMunition-1;
                                    }
                                }
                                let label = loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${qty} / ${effet.split(' ')[1]}` : `${qty} / ${game.i18n.localize(loc.label)}`;
                                if(weapon.id.includes('longbow')) label = loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`;

                                effets.push({
                                    simple:l,
                                    key:effet,
                                    label:label,
                                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                                });
                            }
                            break;

                        case 'choc':
                        case 'electrifiee':
                        case 'artillerie':
                        case 'demoralisant':
                        case 'esperance':
                        case 'lunetteintelligente':
                        case 'cadence':
                        case 'chromeligneslumineuses':
                            if(effet) detailledEffets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                            break;

                        case 'lumiere':
                            if(effet && !this.#isEffetActive(raw, options, 'lumineuse')) {
                                let value = parseInt(effet.split(' ')[1]);
                                if(this.#isEffetActive(raw, options, 'arabesqueiridescentes')) value += 1;

                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    label:`${game.i18n.localize(loc.label)} ${value}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                });
                            } else if(effet && !this.#isEffetActive(raw, options, 'arabesqueiridescentes')) {
                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                                });
                            }
                            break;

                        case 'arabesqueiridescentes':
                            if(effet && !this.#isEffetActive(raw, options, 'lumiere')) {
                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    label:`${game.i18n.localize(loc.label)} 1`,
                                    description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                });
                            } else if(effet && this.#isEffetActive(raw, options, 'lumineuse')) {
                                let value = parseInt(this.#getEffet(raw, 'lumiere').split(' ')[1])+1;

                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    label:`${game.i18n.localize(localize['lumiere'].label)} ${value}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(`${localize['lumiere'].description}-short`)),
                                });

                                effets.push({
                                    simple:l,
                                    key:effet,
                                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                                });
                            } else {
                                if(effet) effets.push({
                                    simple:l,
                                    key:effet,
                                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                                });
                            }
                            break;

                        case 'lumineuse':
                            if(effet && !this.#isEffetActive(raw, options, 'arabesqueiridescentes')) {
                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    label:`${game.i18n.localize(localize['lumiere'].label)} 2`,
                                    description:this.#sanitizeTxt(game.i18n.localize(`${localize['lumiere'].description}-short`)),
                                });
                            }

                            effets.push({
                                simple:l,
                                key:effet,
                                label:`${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                            break;

                        case 'jumelle':
                        case 'jumelageakimbo':
                        case 'jumeleakimbo':
                            if(effet && this.style === 'akimbo') detailledEffets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                            else if(effet) effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                            break;

                        case 'jumeleambidextrie':
                        case 'jumelageambidextrie':
                        case 'soeur':
                            if(effet && this.style === 'ambidextre') detailledEffets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                            else if(effet) effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                            break;

                        default:
                            if(effet) effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                            break;
                    }
                }

            } else {
                if(effet) effets.push({
                    simple:l,
                    key:effet,
                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                });
            }
        }

        console.warn(this);

        for(let c of custom) {
            const attaque = c.attaque;

            if(!attaque.conditionnel.has) {
                effets.push({
                    simple:c.label,
                    key:c.label,
                    label:`${c.label}`,
                    description:this.#sanitizeTxt(c.description),
                });
            } else {
                let dices = 0;
                let fixe = 0;

                if(attaque.jet) dices += attaque.jet;

                if(attaque.reussite) fixe += attaque.reussite;

                if(attaque.carac.jet) {
                    dices += this.getAspectOrCaracteristique(attaque.carac.jet);

                    if(attaque.carac.odInclusJet && armorIsWear) dices += this.getAEAspectOrODCaracteristique(attaque.carac.jet);
                }

                if(attaque.carac.fixe) {
                    fixe += this.getAspectOrCaracteristique(attaque.carac.fixe);

                    if(attaque.carac.odInclusFixe && armorIsWear) fixe += this.getAEAspectOrODCaracteristique(attaque.carac.fixe);
                }

                if(attaque.aspect.jet) {
                    dices += this.getAspectOrCaracteristique(attaque.aspect.jet);

                    if(attaque.aspect.odInclusJet && armorIsWear) dices += this.getAEAspectOrODCaracteristique(attaque.aspect.jet);
                }

                if(attaque.aspect.fixe) {
                    bonus.push(this.getAspectOrCaracteristique(attaque.aspect.fixe));

                    if(attaque.aspect.odInclusFixe && armorIsWear) fixe += this.getAEAspectOrODCaracteristique(attaque.aspect.fixe);
                }

                if(dices) {
                    const subroll = fixe ? await this.doSimpleRoll(`${dices}D6+${fixe}`, dices, [fixe]) : await this.doSimpleRoll(`${dices}D6`, dices, []);

                    rolls.push(subroll.roll);

                    detailledEffets.push({
                        simple:c.label,
                        key:c.label,
                        value:`+${subroll.roll.total}`,
                        label:`${c.label}`,
                        description:this.#sanitizeTxt(c.description),
                        tooltip:subroll.tooltip
                    });
                } else {
                    detailledEffets.push({
                        simple:c.label,
                        key:c.label,
                        value:`+${fixe}`,
                        label:`${c.label}`,
                        description:this.#sanitizeTxt(attaque.conditionnel.condition),
                    });
                }
            }
        }

        detailledEffets.sort((a, b) => a.label.localeCompare(b.label));
        effets.sort((a, b) => a.label.localeCompare(b.label));

        for(let c of content.content) {
            const total = c.total;

            let hasBtnApply = false;

            for(let t of c.targets) {
                const actor = canvas.tokens.get(t.id).actor;

                if(actor) {
                    const type = actor.type;
                    const target = type === 'vehicule' ? actor.system.pilote : actor;
                    const chair = target?.system?.aspects?.chair?.value ?? 0;

                    if(actor.statuses.has('designation') && weapon.type === 'distance' && total) {
                        const newTotal = total + 1;

                        if(t.hit) {
                            t.marge += 1;
                        } else if(newTotal > t.difficulty) {
                            t.hit = true;
                            t.marge = newTotal - t.difficulty;
                        }

                        t.effets.push({
                            value:`+1 ${game.i18n.localize('KNIGHT.JETS.Succes')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                            key:'tgtWithDesignation',
                            label:game.i18n.localize('KNIGHT.EFFETS.DESIGNATION.Label'),
                            subtitle:`${newTotal} ${game.i18n.localize('KNIGHT.JETS.Succes')} / ${game.i18n.localize('KNIGHT.EFFETS.DESIGNATION.IgnoreEpicFail')}`,
                        })
                    }
                    for(let d of detailledEffets) {
                        if(!target) continue;

                        const comparaison = target.type === 'knight' ? chair : Math.ceil(chair/2);
                        const chairAE = target.system?.aspects?.chair?.ae?.majeur?.value ?? 0;

                        switch(d.simple) {
                            case 'choc':
                            case 'electrifiee':

                                t.effets.push({
                                    simple:d.simple,
                                    key:d.key,
                                    label:d.label,
                                    hit:total > comparaison && t.hit && chairAE === 0  ? true : false,
                                    subtitle:chairAE === 0 ? undefined : game.i18n.format('KNIGHT.JETS.RESULTATS.ProtegePar', {aspect:game.i18n.localize('KNIGHT.JETS.CHAIR.Majeur')})
                                })
                                break;

                            case 'barrage':
                                t.effets.push({
                                    simple:d.simple,
                                    key:d.key,
                                    label:d.label,
                                    hit:true,
                                    subtitle:chairAE === 0 ? undefined : game.i18n.format('KNIGHT.JETS.RESULTATS.ProtegePar', {aspect:game.i18n.localize('KNIGHT.JETS.CHAIR.Majeur')})
                                })
                                break;
                        }
                    }


                    if(this.#isEffetActive(raw, options, CONFIG.KNIGHT.LIST.EFFETS.status.attaque)) {
                        hasBtnApply = true;
                        t.btn = [{
                            label:game.i18n.localize('KNIGHT.JETS.AppliquerEffets'),
                            classes:'btn full applyAttaqueEffects',
                            id:t.id
                        }]
                    }
                }
            }

            if(c.targets.length > 1 && hasBtnApply) {
                c.allTgtBtn = [{
                    mainClasses:'btn gmOnly full',
                    classes:'applyAllAttaqueEffects',
                    label:game.i18n.localize('KNIGHT.JETS.AppliquerEffetsAll'),
                }]
            }

            c.noDmg = noDmg;
            c.noViolence = noViolence;
        }

        content.detailledEffets = detailledEffets;
        // content.effets = effets.map(effet => `<span title="${effet.description.replace(/<.*?>/g, '')}" data-key="${effet.key}">${effet.label}</span>`).join(' / ');
        content.effets = effets.map(effet => { return { description : effet.description.replace(/<.*?>/g, ''), key: effet.key, label: effet.label } });
    }

    async #handleDamageEffet(weapon, data={}, bonus=[], content={}, rolls=[]) {
        const type = this.attaquant.type;
        const armure = this.attaquant.items.find(itm => itm.type === 'armure');
        const capacites = armure?.system?.capacites?.selected ?? {};
        const getGhost = capacites?.ghost ?? undefined;
        const getGoliathMeter = this.attaquant.system?.equipements?.armure?.capacites?.goliath?.metre ?? 0;
        const getGoliath = capacites?.goliath ?? undefined;
        const getChangeling = capacites?.changeling ?? undefined;
        const raw = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? [], weapon?.distance?.raw ?? []);
        const custom = weapon.effets.custom.concat(weapon?.distance?.custom ?? [], weapon?.ornementales?.custom ?? [], weapon?.structurelles?.custom ?? []);
        const options = weapon?.options ?? [];
        const localize = getAllEffects();
        const hasObliteration = this.#isEffetActive(raw, options, ['obliteration']);
        const hasTenebricide = this.#isEffetActive(raw, options, ['tenebricide']);
        const hasBourreau = this.#isEffetActive(raw, options, ['bourreau']);
        const style = data?.flags?.style ?? 'standard';
        const dataStyle = data?.flags?.dataStyle ?? {
            type:'',
            value:0
        };
        const rollAttaque = data?.attaque ?? [];
        const attaque = data?.total ?? 0;
        const targets = data?.targets ?? [];
        const list = CONFIG.KNIGHT.LIST.EFFETS.degats;
        const modulesDice = weapon?.bonus?.degats?.dice ?? 0;
        const modulesFixe = weapon?.bonus?.degats?.fixe ?? 0;
        const modulesDegatsVariable = weapon?.options?.filter(itm => itm.classes.includes('dgtsbonusvariable')) ?? [];
        const armorIsWear = this.armorIsWear;
        let detailledEffets = [];
        let effets = [];
        let rollOptions = {
            maximize:hasObliteration || (data?.flags?.maximize?.degats ?? false) ? true : false,
        };
        let baseDice = weapon.degats.dice;
        let wpnDice = weapon.degats.dice;
        let wpnBonusDice = 0;
        let min = false;
        let titleDice = '';
        let title = '';
        let isGhostActive = false;
        let idErsatzGhost = undefined;
        let isErsatzGhostActive = false;
        let isChangelingActive = false;
        let isGoliathActive = false;

        if(getGhost && armorIsWear && ((weapon.type === 'contact' && !this.#isEffetActive(raw, options, ['lumiere']) || (weapon.type === 'distance' && (this.#isEffetActive(raw, weapon.options, ['silencieux']) || this.#isEffetActive(raw, weapon.options, ['munitionssubsoniques']) || this.#isEffetActive(raw, weapon.options, ['assassine'])))))) {
            isGhostActive = data?.flags?.ghost;
        }

        if(armorIsWear && data?.flags?.ersatzghost?.value && data?.flags?.ersatzghost?.id  && ((weapon.type === 'contact' && !this.#isEffetActive(raw, options, ['lumiere']) || (weapon.type === 'distance' && (this.#isEffetActive(effets, weapon.options, ['silencieux']) || this.#isEffetActive(effets, weapon.options, ['munitionssubsoniques']) || this.#isEffetActive(effets, weapon.options, ['assassine'])))))) {
            isErsatzGhostActive = data?.flags?.ersatzghost?.value;
            idErsatzGhost = data?.flags?.ersatzghost?.id;
        }

        if(getChangeling && armorIsWear) {
            isChangelingActive = (getChangeling?.active?.personnelle ?? false) ? true : false;
        }

        if(weapon.degats.fixe > 0) bonus.push(weapon.degats.fixe);
        if(hasBourreau) min = parseInt(this.#getEffet(raw, 'bourreau').split(' ')[1]);

        if(weapon.type === 'contact') {
            let force = 0;
            let traForce = '';

            if(type === 'creature') {
                const beteMineur = this.attaquant.system.aspects.bete.ae.mineur.value;
                const beteMajeur = this.attaquant.system.aspects.bete.ae.majeur.value;

                if(weapon.degats.addchair) {
                    force = Math.ceil(this.getAspect('chair')/2);
                    traForce = game.i18n.localize(CONFIG.KNIGHT.aspects.chair);

                    bonus.push(force);
                    title += ` + ${traForce}`;
                }

                if(beteMajeur > 0) {
                    bonus.push(this.getAspect('bete'));
                    bonus.push(beteMajeur);
                    bonus.push(beteMineur);

                    title += ` + ${game.i18n.localize(CONFIG.KNIGHT.aspects.bete)} + ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} + ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')}`;
                } else if(beteMineur > 0) {
                    bonus.push(beteMajeur);
                    bonus.push(beteMineur);

                    title += ` + ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} + ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')}`;
                }
            } else if(type === 'knight') {
                force = this.getCaracteristique('chair', 'force');
                traForce = game.i18n.localize(CONFIG.KNIGHT.caracteristiques.force);

                bonus.push(force);
                title += ` + ${traForce}`;
            } else if(type === 'bande') {
                // Bande debordement doesn't add bonuses
            } else if(type === 'pnj') {
                const beteMineur = this.attaquant.system.aspects.bete.ae.mineur.value;
                const beteMajeur = this.attaquant.system.aspects.bete.ae.majeur.value;

                if(weapon.degats.addchair) {
                    force = Math.ceil(this.getAspect('chair')/2);
                    traForce = game.i18n.localize(CONFIG.KNIGHT.aspects.chair);

                    bonus.push(force);
                    title += ` + ${traForce}`;
                }

                if(beteMajeur > 0) {
                    bonus.push(this.getAspect('bete'));
                    bonus.push(beteMajeur);
                    bonus.push(beteMineur);

                    title += ` + ${game.i18n.localize(CONFIG.KNIGHT.aspects.bete)} + ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} + ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')}`;
                } else if(beteMineur > 0) {
                    bonus.push(beteMajeur);
                    bonus.push(beteMineur);

                    title += ` + ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} + ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')}`;
                }
            }

            if(getGoliath && armorIsWear) {
                isGoliathActive = getGoliath?.active ?? false;

                if(isGoliathActive) {
                    const bGoliath = parseInt(getGoliath?.bonus?.degats?.dice ?? 0);

                    wpnDice += (getGoliathMeter*bGoliath);

                    titleDice += ` + ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.Label')}`;
                }
            }
        }

        if(armorIsWear && this.attaquant.type === 'knight') {
            const discretion = this.getCaracteristique('masque', 'discretion');
            const odDiscretion = this.getOD('masque', 'discretion');

            if(weapon.type === 'contact') {
                const odForce = this.getOD('chair', 'force');
                const bonusODFOrce = odForce > 5 ? (5*3)+(odForce-5) : odForce*3;

                if(odForce > 0) {
                    bonus.push(bonusODFOrce);
                    title += ` + ${game.i18n.localize('KNIGHT.JETS.ODForce')}`;
                }
            }

            if(odDiscretion >= 2) {
                if(this.isSurprise) {
                    bonus.push(discretion);
                    title += ` + ${game.i18n.localize('KNIGHT.JETS.ODDiscretion')} 2`
                } else {
                    detailledEffets.push({
                        simple:'oddiscretion',
                        key:'oddiscretion',
                        value:`+${discretion}`,
                        label:`${game.i18n.localize('KNIGHT.JETS.ODDiscretion')} 2`,
                        description:this.#sanitizeTxt(game.i18n.localize(`KNIGHT.JETS.AttaqueSurprise`)),
                    });
                }
            }

            if(odDiscretion >= 5) {
                if(this.isSurprise) {
                    bonus.push(discretion+odDiscretion);
                    title += ` + ${game.i18n.localize('KNIGHT.JETS.ODDiscretion')} 5`
                } else {
                    detailledEffets.push({
                        simple:'oddiscretion',
                        key:'oddiscretion',
                        value:`+${discretion+odDiscretion}`,
                        label:`${game.i18n.localize('KNIGHT.JETS.ODDiscretion')} 5`,
                        description:this.#sanitizeTxt(game.i18n.localize(`KNIGHT.JETS.AttaqueSurprise`)),
                    });
                }
            }
        }

        if(armorIsWear && isGhostActive) {
            const discretion = this.isPJ ? this.getCaracteristique('masque', 'discretion') : Math.ceil(this.getAspect('masque')/2);
            const odDiscretion = this.isPJ ? this.getOD('masque', 'discretion') : this.getAE('masque');

            bonus.push(discretion + odDiscretion);
            title += ` + ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GHOST.Label')}`;
        }

        if(armorIsWear && isErsatzGhostActive) {
            const ersatzghost = this.attaquant.items.find(itm => itm._id === idErsatzGhost).system.niveau.actuel.ersatz.rogue;
            let ersatzbonus = 0;

            if(this.isPJ) {
                ersatzbonus = this.getAspectOrCaracteristique(ersatzghost.degats.caracteristique);

                if(ersatzghost.degats.od) {
                    ersatzbonus += this.getAEAspectOrODCaracteristique(ersatzghost.degats.caracteristique);
                }
            } else {
                switch(ersatzghost.degats.caracteristique) {
                    case 'deplacement':
                    case 'force':
                    case 'endurance':
                        ersatzbonus = Math.ceil(this.getAspect('chair')/2);

                        if(ersatzghost.degats.od) {
                            ersatzbonus += this.getAE('chair');
                        }
                        break;

                    case 'combat':
                    case 'hargne':
                    case 'instinct':
                        ersatzbonus = Math.ceil(this.getAspect('bete')/2);

                        if(ersatzghost.degats.od) {
                            ersatzbonus += this.getAE('bete');
                        }
                        break;

                    case 'tir':
                    case 'savoir':
                    case 'technique':
                        ersatzbonus = Math.ceil(this.getAspect('machine')/2);

                        if(ersatzghost.degats.od) {
                            ersatzbonus += this.getAE('machine');
                        }
                        break;

                    case 'parole':
                    case 'aura':
                    case 'sangFroid':
                        ersatzbonus = Math.ceil(this.getAspect('dame')/2);

                        if(ersatzghost.degats.od) {
                            ersatzbonus += this.getAE('dame');
                        }
                        break;

                    case 'discretion':
                    case 'dexterite':
                    case 'perception':
                        ersatzbonus = Math.ceil(this.getAspect('masque')/2);

                        if(ersatzghost.degats.od) {
                            ersatzbonus += this.getAE('masque');
                        }
                        break;

                    default:
                        ersatzbonus = Math.ceil(this.getAspect(ersatzghost.degats.caracteristique)/2);

                        if(ersatzghost.degats.od) {
                            ersatzbonus += this.getAE(ersatzghost.degats.caracteristique);
                        }
                        break;
                }
            }

            if(ersatzbonus > 0) {
                bonus.push(ersatzbonus);
                title += ` + ${game.i18n.localize('KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Label')}`;

                if(ersatzghost.degats.dice) {
                    wpnDice += ersatzbonus;
                    titleDice += ` + ${game.i18n.localize('KNIGHT.ITEMS.MODULE.ERSATZ.ROGUE.Label')}`;
                }
            }

        }

        if(style === 'pilonnage') {
            if(dataStyle.type) {
                if(dataStyle.type === 'degats') {
                    wpnDice += Math.min(dataStyle.value, 6);
                    titleDice += ` + ${game.i18n.localize(CONFIG.KNIGHT.LIST.style.pilonnage)}`;
                }
            }
        } else if(style === 'puissant') {
            if(dataStyle.type) {
                if(dataStyle.type === 'degats') {
                    wpnDice += Math.min(dataStyle.value, 6);
                    titleDice += ` + ${game.i18n.localize(CONFIG.KNIGHT.LIST.style.puissant)}`;
                }
            }
        } else if(style === 'suppression') {
            if(dataStyle.type) {
                if(dataStyle.type === 'degats') {
                    wpnDice -= Math.floor(Math.min(dataStyle.value, 6) / 2);
                    titleDice += ` - ${game.i18n.localize(CONFIG.KNIGHT.LIST.style.suppression)}`;
                }
            }
        }

        if(data.flags.dataMod.degats.dice > 0) {
            wpnDice += data.flags.dataMod.degats.dice;
            titleDice += ` + ${game.i18n.localize('KNIGHT.JETS.Modificateur')}`;
        }

        if(data.flags.dataMod.degats.fixe > 0) {
            bonus.push(data.flags.dataMod.degats.fixe);
            title += ` + ${game.i18n.localize('KNIGHT.JETS.Modificateur')}`;
        }

        if(modulesDice > 0) {
            wpnBonusDice += weapon.bonus.degats.dice;
            titleDice += ` + ${weapon.bonus.degats.titleDice.join(' + ')}`
        }

        if(modulesFixe > 0) {
            bonus.push(weapon.bonus.degats.fixe);
            title += ` + ${weapon.bonus.degats.titleFixe.join(' + ')}`
        }

        for(let m of modulesDegatsVariable) {
            if(m.selected > 0) {
                wpnBonusDice += m.selected;
                titleDice += ` + ${m.name}`;
            }

            if(m.selectvalue > 0) {
                bonus.push(m.selectvalue);
                title += ` + ${m.name}`;
            }
        }

        for(let l of list) {
            const loc = localize[l.split(' ')[0]];
            const effet = this.#getEffet(raw, l);

            if(this.#isEffetActive(raw, options, [l])) {
                switch(l) {
                    case 'anatheme':
                    case 'affecteanatheme':
                    case 'antianatheme':
                    case 'munitionshypervelocite':
                    case 'assistanceattaque':
                    case 'connectee':
                    case 'dispersion':
                    case 'enchaine':
                    case 'penetrant':
                    case 'tirenrafale':
                    case 'excellence':
                    case 'percearmure':
                    case 'bourreau':
                    case 'fauconplumesluminescentes':
                        if(effet) detailledEffets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                        });
                        break;

                    case 'boostdegats':
                        if(effet) {
                            const boostDegatsDice = options.find(itm => itm.classes.includes('boostdegats') && itm.key === 'select');
                            wpnBonusDice += boostDegatsDice.selected;
                            titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'munitionsiem':
                        if(effet) {
                            wpnDice -= 1;
                            titleDice += loc?.double ?? false ? ` - ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` - ${game.i18n.localize(loc.label)}`;

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                        }
                        break;

                    case 'precision':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('machine', 'tir') : Math.ceil(this.getAspect('machine')/2);
                            let totalOD = 0;

                            if(this.attaquant.type === 'knight') {
                                totalOD = armorIsWear ? this.getOD('machine', 'tir') : 0;
                            }

                            bonus.push(total+totalOD);
                            title += `${loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`}`
                        }
                        break;

                    case 'regularite':
                        if(effet) {
                            let regularite = 0;

                            for(let r of rollAttaque) {
                                r.dice.forEach(dice => {
                                    dice.results.forEach(result => {
                                        if(parseInt(result.result) === 6) regularite += 3;
                                    });
                                }, []);
                            }

                            title += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            bonus.push(regularite);

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'briserlaresilience':
                        if(effet) {
                            const subdice = 1;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'armeazurine':
                    case 'armerougesang':
                    case 'griffuresgravees':
                    case 'masquebrisesculpte':
                    case 'rouagescassesgraves':
                        if(effet) {
                            const subdice = 1;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'chenesculpte':
                        if(effet) {
                            const subdice = 2;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'chargeurmunitionsexplosives':
                        if(effet) {
                            wpnDice += 1;
                            titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'chargeurballesgrappes':
                        if(effet) {
                            wpnDice -= 1;
                            titleDice += loc?.double ?? false ? ` - ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` - ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'agressive':
                        if(effet) {
                            if(style === 'agressif') {
                                wpnDice += 1;

                                titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;
                            }

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'sillonslignesfleches':
                        if(effet) {
                            bonus.push(3);

                            title += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'surmesure':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('bete', 'combat') : this.getAspect('bete');
                            let totalOD = 0;

                            if(this.attaquant.type === 'knight') {
                                totalOD = armorIsWear ? this.getOD('bete', 'combat') : 0;
                            } else totalOD = this.getAE('bete');

                            bonus.push(total+totalOD);

                            title += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'faucheusegravee':
                        if(effet) {
                            wpnDice += 1;

                            titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'cranerieurgrave':
                    case 'obliteration':
                        if(effet) detailledEffets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                        });
                        break;

                    case 'tenebricide':
                        if(effet) detailledEffets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                        });
                        break;

                    case 'assassine':
                    case 'munitionssubsoniques':
                    case 'silencieux':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('masque', 'discretion') : Math.ceil(this.getAspect('masque')/2);
                            let totalOD = 0;

                            if(this.attaquant.type === 'knight') {
                                totalOD = armorIsWear ? this.getOD('masque', 'discretion') : 0;
                            } else totalOD = this.getAE('masque');

                            if(this.isSurprise || isChangelingActive || isGhostActive) {
                                bonus.push(total+totalOD);
                                title += `${loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`}`
                            } else {
                                detailledEffets.push({
                                    simple:l,
                                    key:effet,
                                    value:`+${total+totalOD}`,
                                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                    description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                });
                            }
                        }
                        break;

                    case 'sournoise':
                    case 'orfevrerie':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('masque', 'dexterite') : Math.ceil(this.getAspect('masque')/2);
                            let totalOD = 0;

                            if(this.attaquant.type === 'knight') {
                                totalOD = armorIsWear ? this.getOD('masque', 'dexterite') : 0;
                            } else totalOD = this.getAE('masque');

                            bonus.push(total+totalOD);

                            title += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'massive':
                    case 'leste':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('chair', 'force') : Math.ceil(this.getAspect('chair')/2);

                            bonus.push(total);

                            title += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'assassin':
                        if(effet) {
                            const subdice = hasTenebricide ? Math.floor(effet.split(' ')[1]/2) : effet.split(' ')[1];
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'revetementomega':
                        if(effet) {
                            const subdice = hasTenebricide ? Math.floor(2/2) : 2;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'barbelee':
                    case 'destructeur':
                        if(effet) {
                            const subdice = hasTenebricide ? 1 : 2;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'meurtrier':
                        if(effet) {
                            const subdice = hasTenebricide ? 1 : 2;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'degatscontinus':
                        if(effet) {
                            const subroll = await this.doSimpleRoll(`1D6`, 1);
                            const tourLoc = subroll.roll.total > 1 ? 'KNIGHT.AUTRE.Tours' : 'KNIGHT.AUTRE.Tour';

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]} (${subroll.roll.total} ${game.i18n.localize(tourLoc)})` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip,
                            });
                        }
                        break;

                    default:
                        if(effet) effets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                        });
                        break;
                }
            } else {
                if(effet) effets.push({
                    simple:l,
                    key:effet,
                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                });
            }
        }

        for(let c of custom) {
            const degats = c.degats;
            let dices = 0;
            let fixe = 0;

            if(degats.jet) dices += degats.jet;

            if(degats.fixe) fixe += degats.fixe;

            if(degats.carac.jet) {
                dices += this.getAspectOrCaracteristique(degats.carac.jet);

                if(degats.carac.odInclusJet && armorIsWear) dices += this.getAEAspectOrODCaracteristique(degats.carac.jet);
            }

            if(degats.carac.fixe) {
                fixe += this.getAspectOrCaracteristique(degats.carac.fixe);

                if(degats.carac.odInclusFixe && armorIsWear) fixe += this.getAEAspectOrODCaracteristique(degats.carac.fixe);
            }

            if(degats.aspect.jet) {
                dices += this.getAspectOrCaracteristique(degats.aspect.jet);

                if(degats.aspect.odInclusJet && armorIsWear) dices += this.getAEAspectOrODCaracteristique(degats.aspect.jet);
            }

            if(degats.aspect.fixe) {
                bonus.push(this.getAspectOrCaracteristique(degats.aspect.fixe));

                if(degats.aspect.odInclusFixe && armorIsWear) fixe += this.getAEAspectOrODCaracteristique(degats.aspect.fixe);
            }

            if(!degats.conditionnel.has) {
                if(dices) {
                    wpnDice += dices;

                    titleDice += ` + ${c.label}`;
                }

                if(fixe) {
                    bonus.push(fixe);

                    title += ` + ${c.label}`;
                }

                effets.push({
                    simple:c.label,
                    key:c.label,
                    label:`${c.label}`,
                    description:this.#sanitizeTxt(c.description),
                });
            } else {
                if(dices) {
                    const subroll = fixe ? await this.doSimpleRoll(`${dices}D6+${fixe}`, dices, [fixe]) : await this.doSimpleRoll(`${dices}D6`, dices, []);

                    rolls.push(subroll.roll);

                    detailledEffets.push({
                        simple:c.label,
                        key:c.label,
                        value:`+${subroll.roll.total}`,
                        label:`${c.label}`,
                        description:this.#sanitizeTxt(c.degats.conditionnel.condition),
                        tooltip:subroll.tooltip
                    });
                } else {
                    detailledEffets.push({
                        simple:c.label,
                        key:c.label,
                        value:`+${fixe}`,
                        label:`${c.label}`,
                        description:this.#sanitizeTxt(degats.conditionnel.condition),
                    });
                }
            }
        }

        wpnDice = style === 'akimbo' ? wpnDice+baseDice : wpnDice;
        wpnDice += wpnBonusDice;
        const dice = hasTenebricide ? Math.floor(wpnDice/2) : wpnDice;
        let formula = `${dice}D6`;
        title = weapon.degats.fixe > 0 ? `(${game.i18n.localize("KNIGHT.AUTRE.Base")}${titleDice})D6 + ${game.i18n.localize("KNIGHT.AUTRE.Base")}${title}` :
        `(${game.i18n.localize("KNIGHT.AUTRE.Base")}${titleDice})D6${title}`;

        detailledEffets.sort((a, b) => {
            if (a.value && !b.value) return -1;
            if (!a.value && b.value) return 1;
            if (a.tooltip && !b.tooltip) return -1;
            if (!a.tooltip && b.tooltip) return 1;
            return a.label.localeCompare(b.label);
        });

        effets.sort((a, b) => a.label.localeCompare(b.label));
        const roll = new Roll(formula);
        await roll.evaluate(rollOptions);

        for(let t of targets) {
            t.effets = [];
            let total = roll.total+Object.values(bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const actor = canvas.tokens.get(t.id).actor;
            const type = actor.type;
            const target = type === 'vehicule' ? actor.system.pilote : actor;

            for(let d of detailledEffets) {
                switch(d.simple) {
                    case 'connectee':
                    case 'munitionshypervelocite':
                    case 'assistanceattaque':
                        if(t.marge) {
                            total += t.marge,

                            t.effets.push({
                                simple:d.simple,
                                key:d.key,
                                label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.DegatsAvec", {avec:`${game.i18n.localize(localize[d.simple].label)}`})}`,
                                empty:true,
                            });
                        }
                        break;

                    case 'excellence':
                        if(t.marge) {
                            total += t.marge*2,

                            t.effets.push({
                                simple:d.simple,
                                key:d.key,
                                label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.DegatsAvec", {avec:`${game.i18n.localize(localize[d.simple].label)}`})}`,
                                empty:true,
                            });
                        }
                        break;

                    case 'meurtrier':
                        const chairAE = target.system?.aspects?.chair?.ae?.majeur?.value ?? 0;

                        if(chairAE > 0) {

                            t.effets.push({
                                simple:d.simple,
                                key:d.key,
                                label:d.label,
                                hit:false,
                                subtitle:game.i18n.format('KNIGHT.JETS.RESULTATS.ProtegePar', {aspect:game.i18n.localize('KNIGHT.JETS.CHAIR.Majeur')})
                            })
                        }
                        break;
                }
            }

            if(this.#isEffetActive(raw, options, ['modeheroique'])) {
                if(t.marge) {
                    const subroll = await this.doSimpleRoll(`${t.marge}D6`, t.marge, [], rollOptions, {bourreau:hasBourreau, min:min});
                    total += subroll.roll.total;
                    rolls.push(subroll.roll);

                    t.effets.push({
                        simple:true,
                        key:'modeheroique',
                        label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.DegatsAvec", {avec:`${game.i18n.localize('KNIGHT.JETS.ModeHeroique')}`})}`,
                        empty:true,
                        tooltip:subroll.tooltip
                    });
                }
            }

            t.isValue = true;
            t.value = total;
        }

        let results = {};
        results.dices = wpnDice;
        results.roll = roll;
        results.min = min;
        results.title = title;
        results.targets = targets;

        content.detailledEffets = detailledEffets;
        content.effets = effets.map(effet => { return { description : effet.description.replace(/<.*?>/g, ''), key: effet.key, label: effet.label } });

        return results;
    }

    async #handleViolenceEffet(weapon, data={}, bonus=[], content={}, rolls=[]) {
        const armure = this.attaquant.items.find(itm => itm.type === 'armure');
        const capacites = armure?.system?.capacites?.selected ?? {};
        const getGoliathMeter = this.attaquant.system?.equipements?.armure?.capacites?.goliath?.metre ?? 0;
        const getGoliath = capacites?.goliath ?? undefined;
        const raw = weapon.effets.raw.concat(weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? [], weapon?.distance?.raw ?? []);
        const custom = weapon.effets.custom.concat(weapon?.distance?.custom ?? [], weapon?.ornementales?.custom ?? [], weapon?.structurelles?.custom ?? []);
        const options = weapon.options;
        const localize = getAllEffects();
        const hasObliteration = this.#isEffetActive(raw, options, ['obliteration']);
        const hasTenebricide = this.#isEffetActive(raw, options, ['tenebricide']);
        const hasDevastation = this.#isEffetActive(raw, options, ['devastation']);
        const style = data?.flags?.style ?? 'standard';
        const dataStyle = data?.flags?.dataStyle ?? {
            type:'',
            value:0
        };
        const rollAttaque = data?.attaque ?? [];
        const attaque = data?.total ?? 0;
        const targets = data?.targets ?? [];
        const list = CONFIG.KNIGHT.LIST.EFFETS.violence;
        const modulesDice = weapon?.bonus?.violence?.dice ?? 0;
        const modulesFixe = weapon?.bonus?.violence?.fixe ?? 0;
        const modulesViolenceVariable = weapon.options.filter(itm => itm.classes.includes('violencebonusvariable'));
        const armorIsWear = this.armorIsWear;
        let detailledEffets = [];
        let effets = [];
        let rollOptions = {
            maximize:hasObliteration || (data?.flags?.maximize?.violence ?? false) ? true : false,
        };
        let isGoliathActive = false;
        let baseDice = weapon.violence.dice
        let wpnDice = weapon.violence.dice;
        let wpnBonusDice = 0;
        let min = false;
        let titleDice = '';
        let title = '';

        if(weapon.violence.fixe > 0) bonus.push(weapon.violence.fixe);
        if(hasDevastation) min = parseInt(this.#getEffet(raw, 'devastation').split(' ')[1]);

        if(weapon.type === 'contact') {
            if(getGoliath && armorIsWear) {
                isGoliathActive = getGoliath?.active ?? false;

                if(isGoliathActive) {
                    const bGoliath = parseInt(getGoliath?.bonus?.violence?.dice ?? 0);

                    wpnDice += (getGoliathMeter*bGoliath);

                    titleDice += ` + ${game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.GOLIATH.Label')}`;
                }
            }

        }

        let fureur = 0;
        let ultraviolence = 0;

        if(style === 'pilonnage') {
            if(dataStyle.type) {
                if(dataStyle.type === 'violence') {
                    wpnDice += Math.min(dataStyle.value, 6);
                    titleDice += ` + ${game.i18n.localize(CONFIG.KNIGHT.LIST.style.pilonnage)}`;
                }
            }
        } else if(style === 'puissant') {
            if(dataStyle.type) {
                if(dataStyle.type === 'violence') {
                    wpnDice += Math.min(dataStyle.value, 6);
                    titleDice += ` + ${game.i18n.localize(CONFIG.KNIGHT.LIST.style.puissant)}`;
                }
            }
        } else if(style === 'suppression') {
            if(dataStyle.type) {
                if(dataStyle.type === 'violence') {
                    wpnDice -= Math.floor(Math.min(dataStyle.value, 8) / 2);
                    titleDice += ` - ${game.i18n.localize(CONFIG.KNIGHT.LIST.style.suppression)}`;
                }
            }
        }

        if(data.flags.dataMod.violence.dice > 0) {
            wpnDice += data.flags.dataMod.violence.dice;
            titleDice += ` + ${game.i18n.localize('KNIGHT.JETS.Modificateur')}`;
        }

        if(data.flags.dataMod.violence.fixe > 0) {
            bonus.push(data.flags.dataMod.violence.fixe);
            title += ` + ${game.i18n.localize('KNIGHT.JETS.Modificateur')}`;
        }

        if(modulesDice > 0) {
            wpnDice += weapon.bonus.violence.dice;
            titleDice += ` + ${weapon.bonus.violence.titleDice.join(' + ')}`
        }

        if(modulesFixe > 0) {
            bonus.push(weapon.bonus.violence.fixe);
            title += ` + ${weapon.bonus.violence.titleFixe.join(' + ')}`
        }

        for(let m of modulesViolenceVariable) {
            if(m.selected > 0) {
                wpnBonusDice += m.selected;
                titleDice += ` + ${m.name}`;
            }

            if(m.selectvalue > 0) {
                bonus.push(m.selectvalue);
                title += ` + ${m.name}`;
            }
        }

        for(let l of list) {
            const loc = localize[l.split(' ')[0]];
            const effet = this.#getEffet(raw, l);

            if(this.#isEffetActive(raw, options, [l])) {
                switch(l) {
                    case 'affecteanatheme':
                    case 'assistanceattaque':
                    case 'antianatheme':
                    case 'percearmure':
                    case 'tenebricide':
                    case 'devastation':
                    case 'munitionsnonletales':
                    case 'connectee':
                    case 'fauconplumesluminescentes':
                        if(effet) detailledEffets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                        });
                        break;

                    case 'flammesstylisees':
                        if(effet) {
                            wpnDice += 1;
                            titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'boostviolence':
                        if(effet) {
                            const boostViolenceDice = options.find(itm => itm.classes.includes('boostviolence') && itm.key === 'select');
                            wpnBonusDice += boostViolenceDice.selected;
                            titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;


                    case 'intimidanthum':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('dame', 'aura') : Math.ceil(this.getAspect('dame')/2);
                            let totalOD = 0;

                            if(this.actor.type === 'knight') {
                                totalOD = armorIsWear ? this.getOD('dame', 'aura') : 0;
                            } else totalOD = this.getAE('dame');

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${total+totalOD}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                        }
                        break;

                    case 'intimidantana':
                        if(effet) {
                            const total = this.attaquant.type === 'knight' ? this.getCaracteristique('dame', 'aura') : this.getAspect('dame')/2;
                            let totalOD = 0;

                            if(this.attaquant.type === 'knight') {
                                totalOD = armorIsWear ? this.getOD('dame', 'aura') : 0;
                            } else totalOD = this.getAE('dame');

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${total+totalOD}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                        }
                        break;

                    case 'ultraviolence':
                        if(effet) {
                            const subdice = 2;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {devastation:hasDevastation, min:min});

                            rolls.push(subroll.roll);
                            ultraviolence = subroll.roll.total;

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]} (${subroll.roll.total} ${game.i18n.localize(tourLoc)})` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip,
                            });
                        }
                        break;


                    case 'chargeurmunitionsexplosives':
                        if(effet) {
                            wpnDice -= 1;
                            titleDice += loc?.double ?? false ? ` - ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` - ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;

                    case 'chargeurballesgrappes':
                        if(effet) {
                            wpnDice += 1;
                            titleDice += loc?.double ?? false ? ` + ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` + ${game.i18n.localize(loc.label)}`;

                            effets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                            });
                        }
                        break;


                    case 'armeazurine':
                    case 'armerougesang':
                    case 'griffuresgravees':
                    case 'masquebrisesculpte':
                    case 'rouagescassesgraves':
                        if(effet) {
                            const subdice = 1;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {bourreau:hasBourreau});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;

                    case 'fureur':
                        if(effet) {
                            const subdice = 4;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {devastation:hasDevastation, min:min});

                            rolls.push(subroll.roll);

                            fureur = subroll.roll.total;

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]} (${subroll.roll.total} ${game.i18n.localize(tourLoc)})` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip,
                            });
                        }
                        break;

                    case 'munitionsiem':
                        if(effet) {
                            wpnDice -= 1;
                            titleDice += loc?.double ?? false ? ` - ${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : ` - ${game.i18n.localize(loc.label)}`;

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                            });
                        }
                        break;

                    case 'briserlaresilience':
                        if(effet) {
                            const subdice = 1;
                            const subroll = await this.doSimpleRoll(`${subdice}D6`, subdice, [], rollOptions, {devastation:hasDevastation, min:min});

                            rolls.push(subroll.roll);

                            detailledEffets.push({
                                simple:l,
                                key:effet,
                                value:`+${subroll.roll.total}`,
                                label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                                description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                                tooltip:subroll.tooltip
                            });
                        }
                        break;


                    case 'tenebricide':
                        if(effet) detailledEffets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(`${loc.description}-short`)),
                        });
                        break;

                    default:
                        if(effet) effets.push({
                            simple:l,
                            key:effet,
                            label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                            description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                        });
                        break;
                }
            } else {
                if(effet) effets.push({
                    simple:l,
                    key:effet,
                    label:loc?.double ?? false ? `${game.i18n.localize(loc.label)} ${effet.split(' ')[1]}` : `${game.i18n.localize(loc.label)}`,
                    description:this.#sanitizeTxt(game.i18n.localize(loc.description)),
                });
            }
        }

        for(let c of custom) {
            const violence = c.violence;
            let dices = 0;
            let fixe = 0;

            if(violence.jet) dices += violence.jet;

            if(violence.fixe) fixe += violence.fixe;

            if(violence.carac.jet) {
                dices += this.getAspectOrCaracteristique(violence.carac.jet);

                if(violence.carac.odInclusJet && this.armorIsWear) dices += this.getAEAspectOrODCaracteristique(violence.carac.jet);
            }

            if(violence.carac.fixe) {
                fixe += this.getAspectOrCaracteristique(violence.carac.fixe);

                if(violence.carac.odInclusFixe && this.armorIsWear) fixe += this.getAEAspectOrODCaracteristique(violence.carac.fixe);
            }

            if(violence.aspect.jet) {
                dices += this.getAspectOrCaracteristique(violence.aspect.jet);

                if(violence.aspect.odInclusJet && this.armorIsWear) dices += this.getAEAspectOrODCaracteristique(violence.aspect.jet);
            }

            if(violence.aspect.fixe) {
                bonus.push(this.getAspectOrCaracteristique(violence.aspect.fixe));

                if(violence.aspect.odInclusFixe && this.armorIsWear) fixe += this.getAEAspectOrODCaracteristique(degviolenceats.aspect.fixe);
            }

            if(!violence.conditionnel.has) {
                if(dices) {
                    wpnDice += dices;

                    titleDice += ` + ${c.label}`;
                }

                if(fixe) {
                    bonus.push(fixe);

                    title += ` + ${c.label}`;
                }

                effets.push({
                    simple:c.label,
                    key:c.label,
                    label:`${c.label}`,
                    description:this.#sanitizeTxt(c.description),
                });
            } else {
                if(dices) {
                    const subroll = fixe ? await this.doSimpleRoll(`${dices}D6+${fixe}`, dices, [fixe]) : await this.doSimpleRoll(`${dices}D6`, dices, []);

                    rolls.push(subroll.roll);

                    detailledEffets.push({
                        simple:c.label,
                        key:c.label,
                        value:`+${subroll.roll.total}`,
                        label:`${c.label}`,
                        description:this.#sanitizeTxt(c.violence.conditionnel.condition),
                        tooltip:subroll.tooltip
                    });
                } else {
                    detailledEffets.push({
                        simple:c.label,
                        key:c.label,
                        value:`+${fixe}`,
                        label:`${c.label}`,
                        description:this.#sanitizeTxt(violence.conditionnel.condition),
                    });
                }
            }
        }

        wpnDice = style === 'akimbo' ? wpnDice+Math.ceil(baseDice/2) : wpnDice;
        wpnDice += wpnBonusDice;
        const dice = hasTenebricide ? Math.floor(wpnDice/2) : wpnDice;
        let formula = `${dice}D6`;
        title = weapon.degats.fixe > 0 ? `(${game.i18n.localize("KNIGHT.AUTRE.Base")}${titleDice})D6 + ${game.i18n.localize("KNIGHT.AUTRE.Base")}${title}` :
        `(${game.i18n.localize("KNIGHT.AUTRE.Base")}${titleDice})D6${title}`;

        detailledEffets.sort((a, b) => {
            if (a.value && !b.value) return -1;
            if (!a.value && b.value) return 1;
            if (a.tooltip && !b.tooltip) return -1;
            if (!a.tooltip && b.tooltip) return 1;
            return a.label.localeCompare(b.label);
        });
        effets.sort((a, b) => a.label.localeCompare(b.label));

        const roll = new Roll(formula);
        await roll.evaluate(rollOptions);

        for(let t of targets) {
            const actor = canvas.tokens.get(t.id).actor;
            const type = actor.type;
            const target = type === 'vehicule' ? actor.system.pilote : actor;
            t.effets = [];
            let total = roll.total+Object.values(bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

            for(let d of detailledEffets) {
                switch(d.simple) {
                    case 'connectee':
                    case 'munitionshypervelocite':
                    case 'assistanceattaque':
                        if(t.marge) {
                            total += t.marge,

                            t.effets.push({
                                simple:d.simple,
                                key:d.key,
                                label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.ViolenceAvec", {avec:`${game.i18n.localize(localize[d.simple].label)}`})}`,
                                empty:true,
                            });
                        }
                        break;

                    case 'fureur':
                        if(target.type === 'bande' && fureur > 0) {
                            if((target.system?.aspects?.chair?.value ?? 0) > 10) {
                                total += fureur;

                                t.effets.push({
                                    simple:d.simple,
                                    key:d.key,
                                    label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.ViolenceAvec", {avec:`${game.i18n.localize(localize[d.simple].label)}`})}`,
                                    empty:true,
                                });
                            }
                        }
                        break;

                    case 'ultraviolence':
                        if(target.type === 'bande' && ultraviolence > 0) {
                            if((target.system?.aspects?.chair?.value ?? 0) < 10) {
                                total += ultraviolence;

                                t.effets.push({
                                    simple:d.simple,
                                    key:d.key,
                                    label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.ViolenceAvec", {avec:`${game.i18n.localize(localize[d.simple].label)}`})}`,
                                    empty:true,
                                });
                            }
                        }
                        break;
                }
            }

            if(this.#isEffetActive(raw, options, ['modeheroique'])) {
                if(t.marge) {
                    const subroll = await this.doSimpleRoll(`${t.marge}D6`, t.marge, [], rollOptions, {devastation:hasDevastation, min:min});
                    total += subroll.roll.total;
                    rolls.push(subroll.roll);

                    t.effets.push({
                        simple:true,
                        key:'modeheroique',
                        label:`${game.i18n.format("KNIGHT.JETS.RESULTATS.ViolenceAvec", {avec:`${game.i18n.localize('KNIGHT.JETS.ModeHeroique')}`})}`,
                        empty:true,
                        tooltip:subroll.tooltip
                    });
                }
            }

            t.isValue = true;
            t.value = total;
        }

        let results = {};
        results.dices = wpnDice;
        results.roll = roll;
        results.min = min;
        results.title = title;
        results.targets = targets;

        content.detailledEffets = detailledEffets;
        content.effets = effets.map(effet => { return { description : effet.description.replace(/<.*?>/g, ''), key: effet.key, label: effet.label } });

        return results;
    }

    setWeapon(wpn) {
        this.weapon = wpn;
    }

    setName(name) {
        this.name = name;
    }

    setDices(dices) {
        this.formula = dices;
    }

    prepareWpnContact(wpn, modules=[], addSpecial=true) {
        const armure = this.attaquant.items.find(itm => itm.type === 'armure');
        const system = wpn.system;
        let raw = [];
        let specialRaw = [];
        let specialCustom = [];
        let data = {
            label:wpn.name,
            portee:system.portee,
            classes:'btnWpn',
            options:[],
            type:'contact',
            cout:system?.cout ?? 0,
            espoir:system?.espoir ?? 0,
            bonus:{
                degats:{
                    dice:modules?.degats?.dice ?? 0,
                    fixe:modules?.degats?.fixe ?? 0,
                    titleDice:modules?.degats?.titleDice ?? '',
                    titleFixe:modules?.degats?.titleFixe ?? '',
                },
                violence:{
                    dice:modules?.violence?.dice ?? 0,
                    fixe:modules?.violence?.fixe ?? 0,
                    titleDice:modules?.violence?.titleDice ?? '',
                    titleFixe:modules?.violence?.titleFixe ?? '',
                }
            }
        };

        data.id = wpn.id;

        if(armure && addSpecial) {
            if(armure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(armure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(armure.system.special.selected.porteurlumiere.bonus.effets.custom)
            }
        }

        if(!system?.options2mains?.has ?? false) {
            data.effets = {
                raw:system?.effets?.raw ?? [],
                custom:system?.effets?.custom ?? [],
            };
            data.structurelles = {
                raw:system?.structurelles?.raw ?? [],
                custom:system?.structurelles?.custom ?? [],
            };
            data.ornementales = {
                raw:system?.ornementales?.raw ?? [],
                custom:system?.ornementales?.custom ?? [],
            };

            data.effets.raw = data.effets.raw.concat(specialRaw);
            data.effets.custom = data.effets.custom.concat(specialCustom);

            raw = data.effets.raw.concat(system?.structurelles?.raw ?? [], system?.ornementales?.raw ?? []);

            if(!system?.degats?.variable?.has ?? false) data.degats = {dice:system?.degats?.dice ?? 0, fixe:system?.degats?.fixe ?? 0};
            else {
                const list = {};
                const min = system?.degats?.variable?.min?.dice ?? 0;
                const max = system?.degats?.variable?.max?.dice ?? min;
                let classes = [];

                for (let i = min; i <= max; i++) {
                    list[i] = system?.degats?.variable?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'dgtsvariable');

                if(!system?.violence?.variable?.has ?? false) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Degats'),
                    list:list,
                    selected:min,
                    value:system?.degats?.variable?.cout ?? 0,
                    selectvalue:system?.degats?.variable?.min?.fixe ?? 0,
                });

                data.degats = {dice:min, fixe:system?.degats?.variable?.min?.fixe ?? 0};
            }

            if(!system?.violence?.variable?.has ?? false) data.violence = {dice:system?.violence?.dice ?? 0, fixe:system?.violence?.fixe ?? 0};
            else {
                const list = {};
                const min = system?.violence?.variable?.min?.dice ?? 0;
                const max = system?.violence?.variable?.max?.dice ?? min;
                let classes = [];

                for (let i = min; i <= max; i++) {
                    list[i] = system?.violence?.variable?.min?.fixe ?? 0 ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'violencevariable');

                if(!system?.degats?.variable?.has ?? false) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Violence'),
                    list:list,
                    selected:min,
                    value:system?.violence?.variable?.cout ?? 0,
                    selectvalue:system?.violence?.variable?.min?.fixe ?? 0,
                });

                data.violence = {dice:min, fixe:system?.violence?.variable?.min?.fixe ?? 0};
            }

        } else {
            const list = {};

            list['1main'] = game.i18n.localize('KNIGHT.ITEMS.ARME.DEUXMAINS.Unemain');
            list['2main'] = game.i18n.localize('KNIGHT.ITEMS.ARME.DEUXMAINS.Deuxmains');

            data.actuel = system.options2mains.actuel;

            if(system.options2mains.actuel === '1main') {
                data.degats = {dice:system?.options2mains?.['1main']?.degats?.dice ?? 0, fixe:system?.options2mains?.['1main']?.degats.fixe ?? 0};
                data.violence = {dice:system?.options2mains?.['1main']?.violence?.dice ?? 0, fixe:system?.options2mains?.['1main']?.violence?.fixe ?? 0};

                data.effets = {
                    raw:system?.effets?.raw ?? [],
                    custom:system?.effets?.custom ?? [],
                };
                data.structurelles = {
                    raw:system?.structurelles?.raw ?? [],
                    custom:system?.structurelles?.custom ?? [],
                };
                data.ornementales = {
                    raw:system?.ornementales?.raw ?? [],
                    custom:system?.ornementales?.custom ?? [],
                };

                data.effets.raw = data.effets.raw.concat(specialRaw);
                data.effets.custom = data.effets.custom.concat(specialCustom);

                raw = data.effets.raw.concat(system?.structurelles?.raw, system?.ornementales?.raw);
            }
            else {
                data.degats = {dice:system?.options2mains?.['2main']?.degats?.dice ?? 0, fixe:system?.options2mains?.['2main']?.degats.fixe ?? 0};
                data.violence = {dice:system?.options2mains?.['2main']?.violence?.dice ?? 0, fixe:system?.options2mains?.['2main']?.violence?.fixe ?? 0};

                data.effets = {
                    raw:system?.effets2mains?.raw ?? [],
                    custom:system?.effets2mains?.custom ?? [],
                };
                data.structurelles = {
                    raw:system?.structurelles?.raw ?? [],
                    custom:system?.structurelles?.custom ?? [],
                };
                data.ornementales = {
                    raw:system?.ornementales?.raw ?? [],
                    custom:system?.ornementales?.custom ?? [],
                };

                data.effets.raw = data.effets.raw.concat(specialRaw);
                data.effets.custom = data.effets.custom.concat(specialCustom);

                raw = data.effets.raw.concat(system.structurelles.raw, system.ornementales.raw);
            }

            let classes = [];
            classes.push('selectSimple mains full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                list:list,
                selected:data.actuel,
            });
        }

        data.degats.addchair = system?.degats?.addchair ?? true;
        data.options = modules.options ? modules.options.concat(data.options) : data.options;

        if(this.#hasEffet(raw, 'soeur')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.SOEUR.Label'),
                value:'soeur',
                active:true,
            });
        } else if(this.#hasEffet(raw, 'jumelageambidextrie')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Label'),
                value:'jumelageambidextrie',
                active:true,
            });
        }

        if(this.#hasEffet(raw, 'barrage')) {
            let classes = ['barrage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label'),
                value:'barrage',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'chromeligneslumineuses')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Label'),
                value:'chromeligneslumineuses',
                active:false,
            });
        } else if(this.#hasEffet(raw, 'cadence')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.CADENCE.Label'),
                value:'cadence',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'guidage')) {
            let classes = ['guidage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.GUIDAGE.Label'),
                value:'guidage',
                active:true,
            });
        }

        if(this.#hasEffet(raw, 'cranerieurgrave')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Label'),
                value:'cranerieurgrave',
                active:false,
            });
        } else if(this.#hasEffet(raw, 'obliteration')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.OBLITERATION.Label'),
                value:'obliteration',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'tenebricide')) {
            let classes = ['tenebricide', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.TENEBRICIDE.Label'),
                value:'tenebricide',
                active:false,
            });
        }

        data.options.sort((a, b) => {
            if (a.key === 'select') return -1;
            if (b.key === 'select') return 1;
            if (a.classes.includes('roll')) return -1;
            if (b.classes.includes('roll')) return 1;
            if (a.key === 'btn' && b.key !== 'btn') return 1;
            if (a.key !== 'btn' && b.key === 'btn') return -1;
            return a.label.localeCompare(b.label);
        });

        return data;
    }

    prepareWpnDistance(wpn, modules=[], addSpecial=true) {
        const armure = this.attaquant.items.find(itm => itm.type === 'armure');
        const system = wpn.system;
        let raw = [];
        let specialRaw = [];
        let specialCustom = [];

        let data = {
            id:wpn?.id ?? '',
            label:wpn.name,
            classes:'btnWpn',
            options:[],
            type:'distance',
            cout:system?.cout ?? 0,
            espoir:system?.espoir ?? 0,
            bonus:{
                degats:{
                    dice:modules?.degats?.dice ?? 0,
                    fixe:modules?.degats?.fixe ?? 0,
                    titleDice:modules?.degats?.titleDice ?? '',
                    titleFixe:modules?.degats?.titleFixe ?? '',
                },
                violence:{
                    dice:modules?.violence?.dice ?? 0,
                    fixe:modules?.violence?.fixe ?? 0,
                    titleDice:modules?.violence?.titleDice ?? '',
                    titleFixe:modules?.violence?.titleFixe ?? '',
                }
            }
        };

        if(system.portee) data.portee = system.portee;
        data.id = wpn.id;

        if(armure && addSpecial) {
            if(armure.system.special.selected?.porteurlumiere ?? undefined) {
                specialRaw = specialRaw.concat(armure.system.special.selected.porteurlumiere.bonus.effets.raw)
                specialCustom = specialCustom.concat(armure.system.special.selected.porteurlumiere.bonus.effets.custom)
            }
        }

        if(!system?.optionsmunitions?.has ?? false) {
            data.effets = {
                raw:system?.effets?.raw ?? [],
                custom:system?.effets?.custom ?? [],
            };
            data.distance = {
                raw:system?.distance?.raw ?? [],
                custom:system?.distance?.custom ?? [],
            };

            data.effets.raw = data.effets.raw.concat(specialRaw);
            data.effets.custom = data.effets.custom.concat(specialCustom);

            raw = system.effets.raw.concat(system?.distance?.raw ?? []);

            if(!system?.degats?.variable?.has ?? false) data.degats = {dice:system?.degats?.dice ?? 0, fixe:system?.degats?.fixe ?? 0};
            else {
                const list = {};
                const min = system.degats.variable.min;
                const max = system.degats.variable.max;
                let classes = [];

                for (let i = min.dice; i <= max.dice; i++) {
                    list[i] = min.fixe ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'dgtsvariable');

                if(!system.violence.variable.has) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Degats'),
                    list:list,
                    selected:min.dice,
                    value:system.degats.variable.cout,
                    selectvalue:min.fixe,
                });

                data.degats = {dice:min.dice, fixe:min.fixe};
            }

            if(!system?.violence?.variable?.has ?? false) data.violence = {dice:system?.violence?.dice ?? 0, fixe:system?.violence?.fixe ?? 0};
            else {
                const list = {};
                const min = system.violence.variable.min;
                const max = system.violence.variable.max;
                let classes = [];

                for (let i = min.dice; i <= max.dice; i++) {
                    list[i] = min.fixe ? `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6+${min.fixe}` : `${i}${game.i18n.localize('KNIGHT.JETS.Des-short')}6`;
                }

                classes.push('selectDouble', 'violencevariable');

                if(!system.degats.variable.has) classes.push('full');

                data.options.push({
                    key:'select',
                    classes:classes.join(' '),
                    label:game.i18n.localize('KNIGHT.AUTRE.Violence'),
                    list:list,
                    selected:min.dice,
                    value:system.violence.variable.cout,
                    selectvalue:min.fixe,
                });

                data.violence = {dice:min.dice, fixe:min.fixe};
            }

        } else {
            const listMunitions = system.optionsmunitions.liste;
            const list = {};

            data.munitions = {};

            for(let m in listMunitions) {
                list[m] = `${game.i18n.localize('KNIGHT.ITEMS.ARME.MUNITIONS.Label')} : ${listMunitions[m].nom}`;
                data.munitions[m] = listMunitions[m];
            }

            data.actuel = system.optionsmunitions.actuel;

            data.degats = data.munitions[data.actuel].degats;
            data.violence = data.munitions[data.actuel].violence;

            raw = system.effets.raw.concat(data.munitions[data.actuel].raw)

            data.effets = {
                raw:raw,
                custom:system.effets.custom.concat(data.munitions[data.actuel].custom),
            };

            data.distance = {
                raw:system.distance.raw,
                custom:system.distance.custom,
            };

            data.effets.raw = data.effets.raw.concat(specialRaw);
            data.effets.custom = data.effets.custom.concat(specialCustom);

            let classes = [];
            classes.push('selectSimple munitions full');

            data.options.push({
                key:'select',
                classes:classes.join(' '),
                list:list,
                selected:data.actuel,
            });
        }

        if(system?.tourelle?.has ?? false) {
            data.tourelle = {
                dice:system.tourelle.attaque.dice,
                fixe:system.tourelle.attaque.fixe,
            }
        }

        data.options = modules.options ? modules.options.concat(data.options) : data.options;

        if(this.#hasEffet(raw, 'tirenrafale')) {
            let classes = ['tirenrafale', 'center', 'roll', 'full'];

            data.options.push({
                key:'btn',
                special:'roll',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.TIRENRAFALE.Label'),
                title:game.i18n.localize('KNIGHT.EFFETS.TIRENRAFALE.Relance'),
            });
        }

        if(this.#hasEffet(raw, 'soeur')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.SOEUR.Label'),
                value:'soeur',
                active:true,
            });
        } else if(this.#hasEffet(raw, 'jumelageambidextrie')) {
            let classes = ['jumelageambidextrie', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.JUMELAGEAMBIDEXTRIE.Label'),
                value:'jumelageambidextrie',
                active:true,
            });
        }

        if(this.#hasEffet(raw, 'barrage') && !this.#hasEffet(raw, 'aucundegatsviolence')) {
            let classes = ['barrage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label'),
                value:'barrage',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'chromeligneslumineuses')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CHROMELIGNESLUMINEUSES.Label'),
                value:'chromeligneslumineuses',
                active:false,
            });
        } else if(this.#hasEffet(raw, 'cadence')) {
            let classes = ['cadence', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.CADENCE.Label'),
                value:'cadence',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'guidage')) {
            let classes = ['guidage', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.GUIDAGE.Label'),
                value:'guidage',
                active:true,
            });
        }

        if(this.#hasEffet(raw, 'cranerieurgrave')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.AMELIORATIONS.CRANERIEURGRAVE.Label'),
                value:'cranerieurgrave',
                active:false,
            });
        } else if(this.#hasEffet(raw, 'obliteration')) {
            let classes = ['obliteration', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.OBLITERATION.Label'),
                value:'obliteration',
                active:false,
            });
        }

        if(this.#hasEffet(raw, 'tenebricide')) {
            let classes = ['tenebricide', 'active', 'full'];

            data.options.push({
                key:'btn',
                classes:classes.join(' '),
                label:game.i18n.localize('KNIGHT.EFFETS.TENEBRICIDE.Label'),
                value:'tenebricide',
                active:false,
            });
        }

        data.options.sort((a, b) => {
            if (a.key === 'select') return -1;
            if (b.key === 'select') return 1;
            if (a.classes.includes('roll')) return -1;
            if (b.classes.includes('roll')) return 1;
            if (a.key === 'btn' && b.key !== 'btn') return 1;
            if (a.key !== 'btn' && b.key === 'btn') return -1;
            return a.label.localeCompare(b.label);
        });

        return data;
    }

    getRollData(weapon, flags={}) {
      let addFlags = {
        flavor:flags?.flavor ?? '',
        total:flags?.total ?? 0,
        targets:flags?.targets ?? [],
        attaque:flags?.rolls ?? [],
        weapon:weapon,
        actor:this.actor,
        surprise:flags?.surprise ?? false,
        style:flags?.style ?? 'standard',
        dataStyle:flags?.dataStyle ?? {},
        dataMod:flags?.dataMod ?? {degats:{dice:0, fixe:0}, violence:{dice:0, fixe:0}},
        maximize:flags?.maximize ?? false,
      };

      let data = {
        total:flags?.total ?? 0,
        targets:flags?.targets ?? [],
        attaque:flags?.rolls ?? [],
        flags:addFlags
      };

      return data;
    }

    getCaracteristique(aspect, name) {
        const data = this.attaquant.system.aspects[aspect].caracteristiques[name];
        let result = 0;

        result += data?.base ?? 0;
        result += Object.values(data?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        result -= Object.values(data?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

        return result;
    }

    getOD(aspect, name, actor=this.attaquant) {
        const data = actor.system?.aspects?.[aspect]?.caracteristiques?.[name]?.overdrive ?? {bonus:[], malus:[]};
        const bonus = Object.values(data.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const malus = Object.values(data.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        let result = 0;

        result += data?.base ?? 0;
        result += bonus;
        result += malus;

        return result;
    }

    getAspect(name) {
        const data = this.attaquant.system.aspects[name];
        const bonus = Object.values(data?.bonus ?? []).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const malus = Object.values(data?.malus ?? []).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        const isPJ = this.isPJ;
        let result = 0;

        result += isPJ ? data?.base ?? 0 : data?.value;
        result += bonus;
        result += malus;

        return result;
    }

    getAspectOrCaracteristique(name) {
        let result = 0;

        switch(name) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = this.getAspect(name);
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = this.getCaracteristique('chair', name);
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = this.getCaracteristique('bete', name);
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = this.getCaracteristique('machine', name);
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = this.getCaracteristique('dame', name);
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = this.getCaracteristique('masque', name);
                break;
        }

        return result;
    }

    getAEAspectOrODCaracteristique(name) {
        let result = 0;

        switch(name) {
            case 'chair':
            case 'bete':
            case 'machine':
            case 'dame':
            case 'masque':
                result = this.getAE(name);
                break;

            case 'deplacement':
            case 'force':
            case 'endurance':
                result = this.getOD('chair', name);
                break;

            case 'combat':
            case 'hargne':
            case 'instinct':
                result = this.getOD('bete', name);
                break;

            case 'tir':
            case 'savoir':
            case 'technique':
                result = this.getOD('machine', name);
                break;

            case 'parole':
            case 'aura':
            case 'sangFroid':
                result = this.getOD('dame', name);
                break;

            case 'discretion':
            case 'dexterite':
            case 'perception':
                result = this.getOD('masque', name);
                break;
        }

        return result;
    }

    getAE(name) {
        const data = this.attaquant.system.aspects[name].ae;
        let result = 0;

        result += data.mineur.value;
        result += data.majeur.value;

        return result;
    }

    #sanitizeTxt(txt) {
        const result = txt.replaceAll('_', '');

        return result;
    }

    async doSimpleRoll(formula, dices, bonus=[], evaluateOptions={}, data={}) {
        const hasBourreau = data?.bourreau ?? false;
        const hasDevastation = data?.devastation ?? false;
        const min = data?.min ?? 0;
        const roll = new Roll(formula);
        await roll.evaluate(evaluateOptions);
        let total = 0;
        let results = roll.dice.reduce((acc, dice) => {
            dice.results.forEach(result => {
                let r = result.result;

                if(hasBourreau) {
                    total += r < min ? 4 : r;

                    if(r < min) r = 4;
                }

                if(hasDevastation) {
                    total += r < min ? 5 : r;

                    if(r < min) r = 5;
                }

                acc.push({
                    value:r,
                    class:`d${dice._faces}`,
                });
            });
            return acc;
        }, []);

        if(!hasBourreau && !hasDevastation) total = roll.total;

        let tooltip = await renderTemplate(RollKnight.tooltip, {parts:[{
            base:`${dices}D6`,
            bonus:bonus,
            total:total,
            results:results,
        }]});

        return {
            roll:roll,
            tooltip:tooltip,
        }
    }
}