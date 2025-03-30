import {
    listLogo,
    generateNavigator,
    getODValue
  } from "./helpers/common.mjs";

export default class HooksKnight {
    static async ready() {
        // DEBUT MIGRATION
        if (game.user.isGM) {
            new game.knight.documents.GmTool().render(true);
        }

        Object.defineProperty(game.user, "isFirstGM", {
            get: function () {
                return game.user.isGM && game.user.id === game.users.find((u) => u.active && u.isGM)?.id;
            },
        });

        if (game.user.isFirstGM && game.knight.migrations.needUpdate(game.knight.migrations.NEEDED_VERSION)) {
           game.knight.migrations.migrateWorld({ force: false }).then();
        }

        //FIN MIGRATION
        //
        //
        //DEBUT GESTION STATUS
        let status = {};

        for(let i of CONFIG.statusEffects) {
          status[game.i18n.localize(i.label)] = i;
        };

        const sortStatus = Object.keys(status).sort(function (a, b) {
          return a.localeCompare(b);
        });

        let sortedStatus = [];

        for(let i of sortStatus) {
          sortedStatus.push(status[i]);
        }

        CONFIG.statusEffects = sortedStatus;
        //FIN GESTION STATUS
        //
        //
        //DEBUT GESTION INTERFACE
        const whatLogo = game.settings.get("knight", "logo");
        $("div#interface").removeClass(listLogo);
        $("div#interface").addClass(whatLogo);

        if (game.modules.get("babele")?.active && game.i18n.lang !== "fr") {
          Hooks.once("babele.ready", async function () {
            Hooks.on('updateCompendium', async function () {
              await generateNavigator();
            });
          });
        } else {
          Hooks.on('updateCompendium', async function () {
            await generateNavigator();
          });
        }
        //FIN GESTION INTERFACE
        //
        //
        //GESTION MACRO
        Hooks.on("hotbarDrop", (bar, data, slot) => createMacro(data, slot));

        async function createMacro(data, slot) {
            if(foundry.utils.isEmpty(data)) return;
            // Create the macro command
            const type = data.type;
            const what = data?.what ?? "";
            const other = data?.other ?? "";
            const name = data?.name ?? "";
            const actorId = data.actorId;
            const sceneId = data?.sceneId ?? null;
            const tokenId = data?.tokenId ?? null;
            const getActor = tokenId === null ? game.actors.get(actorId) : canvas.tokens.get(actorId)?.actor ?? undefined;
            const img = data?.img ?? "systems/knight/assets/icons/D6Black.svg";
            const idWpn = data?.idWpn ?? "";
            const mod = data?.mod ?? 0;
            let label = data.label;
            let command;
            let dataRoll = "";
            let bonusToAdd = "";
            let otherData = "";
            let directRoll = false;

            let idActor = actorId;
            let idScene = sceneId;
            let idToken = tokenId;

            if(type === "wpn" || type === 'module') {
            dataRoll = `idWpn:"${idWpn}"`;
            } else if(type === 'grenades') {
            dataRoll = `nameWpn:"${what}", num:"", typeWpn:"grenades"`
            } else if(type === 'longbow') {
            dataRoll = `nameWpn:"${what}", num:"", typeWpn:"${what}"`
            } else if(type === 'cea') {
            dataRoll = `idWpn:"${idWpn}", nameWpn:"${what}", typeWpn:"${other}"`;
            } else if((type === 'special' || type === 'c1' || type === 'c2' || type === 'base') && what === 'mechaarmure') {
            dataRoll = `idWpn:"${idWpn}"`;
            otherData = what;
            } else if(type === 'armesimprovisees') {
            dataRoll = `idWpn:"${idWpn}", num:"${what}", nameWpn:"${other}"`
            } else if(type === 'nods') {
            directRoll = true;
            dataRoll = `type:"${type}", target:"${other}", id:"${what}"`;
            } else {
            if(what !== "") dataRoll += `base:"${what}"`;
            if(other !== "" && bonusToAdd !== "") bonusToAdd += `, autre:"${other}"`;
            else if(other !== "") bonusToAdd += `autre:"${other}"`;
            if(mod !== 0 && bonusToAdd !== "") bonusToAdd += `, modificateur:"${mod}"`;
            else if(mod !== 0) bonusToAdd += `modificateur:"${mod}"`;
            }

            if(getActor.type === 'mechaarmure') {
            dataRoll += dataRoll === "" ? `whoActivate:"${getActor.system.pilote}"` : `, whoActivate:"${getActor.system.pilote}"`;
            }

            if(!directRoll) command = `game.knight.dialogRollWId("${idActor}", "${idScene}", "${idToken}", {${dataRoll}}, {${bonusToAdd}}, {type:"${type}", event:event, data:"${otherData}"})`;
            else command = `game.knight.directRoll("${idActor}", "${idScene}", "${idToken}", {${dataRoll}})`;

            let macro = await Macro.create({
            name: label,
            type: "script",
            img: img,
            command: command,
            flags: { "knight.attributMacro": true }
            });

            game.user.assignHotbarMacro(macro, slot);
            return false;
        }
        //FIN GESTION MACRO
    }

    static async init() {
        //DEBUT GESTION MESSAGES
        Hooks.on("renderChatMessage", (message, html, messageData) => {
            const version = game.version.split('.')[0];
            const isVersion12 = version >= 12 ? true : false;
            const tgtBtn = html.find('.knight-roll div.tgtBtn');
            const tgtBtnId = $(tgtBtn).data('id');

            if(!game.user.isGM) {
            html.find('.knight-roll div.listTargets,div.onlyGm').remove();
            }

            if(isVersion12) {
                if(game.user.id !== message.author.id && !game.user.isGM) {
                    html.find('.knight-roll div.btn').remove();
                }
            } else {
                if(game.user.id !== message.user.id && !game.user.isGM) {
                    html.find('.knight-roll div.btn').remove();
                }
            }

            if(tgtBtnId) {
                const token = canvas?.tokens?.get(tgtBtnId)?.actor ?? undefined;

                if(token) {
                    if(canvas.tokens.get(tgtBtnId).actor.getUserLevel(game.user.id) !== CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER && !game.user.isGM) {
                        tgtBtn.remove();
                    }
                }
            }

            html.find('.knight-roll div.dice-result').click(ev => {
            const tgt = $(ev.currentTarget);

            tgt.find('div.dice-tooltip').toggle({
                complete: () => {},
            });
            });

            html.find('.knight-roll div.details.withTooltip').click(ev => {
                const tgt = $(ev.currentTarget);

                tgt.find('div.dice-tooltip').toggle({
                    complete: () => {},
                });
            });

            html.find('.knight-roll button.degats').click(async ev => {
                const tgt = $(ev.currentTarget);
                const flags = message.flags;
                const weapon = flags.weapon;
                const raw = weapon.effets.raw.concat(weapon?.distance?.raw ?? [], weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? []);
                const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);

                const roll = new game.knight.RollKnight(actor, {
                    name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
                    weapon:weapon,
                    surprise:flags.surprise,
                }, false);

                let addFlags = {
                    flavor:flags.flavor,
                    total:flags.content[0].total,
                    targets:flags.content[0].targets,
                    attaque:message.rolls,
                    weapon:weapon,
                    actor:actor,
                    surprise:flags.surprise,
                    style:flags.style,
                    dataStyle:flags.dataStyle,
                    dataMod:flags.dataMod,
                    maximize:flags.maximize,
                    ghost:flags.ghost,
                    ersatzghost:flags.ersatzghost,
                };

                let data = {
                    total:flags.content[0].total,
                    targets:flags.content[0].targets.map(target => {
                        if(target?.btn) target.btn = target.btn.filter(itm => !itm.classes.includes('applyAttaqueEffects'))
                        return target;
                    }),
                    attaque:message.rolls,
                    flags:addFlags,
                };

                if(raw.includes('tirenrafale')) {
                    data.content = {
                        tirenrafale:true,
                    }
                }

                await roll.doRollDamage(data);
            });

            html.find('.knight-roll button.applyAttaqueEffects').click(async ev => {
                const tgt = $(ev.currentTarget);
                const flags = message.flags;
                const weapon = flags.weapon;
                const tokenId = tgt.data('id');
                const token = canvas?.tokens?.get(tokenId);
                let effects = {};

                if(!token) return;

                const actor = token.actor;
                weapon.effets.raw.forEach(effectName => {
                    const status = CONFIG.KNIGHT.LIST.EFFETS.attaque;
                    const conditionnel = CONFIG.KNIGHT.LIST.EFFETS.status.conditionnel;
                    const split = effectName.split(' ');
                    const name = split[0];
                    const value = split[1];
                    let skip = false;

                    if((weapon.options.find(itm => itm.value === 'barrage')?.active ?? false) && name !== 'barrage') {
                        skip = true;
                    }

                    if(status.includes(name) && !skip && ((weapon.options.find(itm => itm.value === name)?.active ?? false) || !weapon.options.find(itm => itm.value === name))) {
                        if(conditionnel.includes(name)) {
                            let isHit = false;

                            for (const content of flags.content) {
                                const target = content.targets.find(itm => itm.id === tokenId);

                                if (target && target.effets) {
                                    const effect = target.effets.find(itm => itm.simple === name && conditionnel.includes(itm.simple));

                                    if (effect) {
                                        isHit = effect.hit;
                                        break;
                                    }
                                }
                            }

                            if(isHit) effects[name] = value ? parseInt(value) : true;
                        } else effects[name] = value ? parseInt(value) : true;
                    }
                });

                // #####################
                // Set effects
                // #####################
                const effectList = actor.type === 'bande'
                    ? ['lumiere']
                    : CONFIG.KNIGHT.LIST.EFFETS.status.attaque;
                effectList.map(async iconName => {
                    const isBoolean = ['designation', 'soumission'].includes(iconName);
                    if (effects[iconName] && (typeof effects[iconName] === 'number' || isBoolean)) {
                        // Check if "Status Icon Counters" module is set
                        if (window.EffectCounter) {
                            // Set the icon path in the system
                            const iconPath = `systems/knight/assets/icons/effects/${iconName}.svg`;

                            // Get the effect
                            let effect = actor.appliedEffects.find(e => e.icon === iconPath);

                            if (!effect) {
                                if(isVersion12) {
                                    let counterNumber = isBoolean ? 1 : effects[iconName];
                                    // Create the counter
                                    if (counterNumber) {
                                        const newEffect = await ActiveEffect.fromStatusEffect(CONFIG.statusEffects.find(itm => itm.icon === iconPath).id);
                                        const counter = await actor.createEmbeddedDocuments('ActiveEffect', [newEffect]);
                                        counter[0].statusCounter.setValue(counterNumber);
                                    }
                                } else {
                                    let counterNumber = isBoolean ? 1 : effects[iconName];
                                    // Create the counter
                                    if (counterNumber) {
                                        const counter = new ActiveEffectCounter(counterNumber, iconPath, actor);
                                        counter.update();
                                    }
                                }
                            } else {
                                switch (iconName) {
                                    case 'barrage':
                                    case 'choc':
                                    case 'degatscontinus':
                                    case 'immobilisation':
                                    case 'lumiere':
                                    case 'parasitage':
                                        if(isVersion12) {
                                            if (effect.statusCounter.displayValue < effects[iconName]) {
                                                // Update the counter
                                                effect.statusCounter.setValue(effects[iconName]);
                                            }
                                        } else {
                                            if (effect.value < effects[iconName]) {
                                                // Update the counter
                                                effect.setValue(effects[iconName]);
                                            }
                                        }
                                        break;
                                }
                            }
                         } else {
                            // No "Status Icon Counters" module
                            if(isVersion12) {
                                actor.toggleStatusEffect(iconName, { active: true, overlay: false });
                            } else {
                                V11toggleStatusEffect(actor, iconName, { active: true, overlay: false });
                            }
                        }
                    }
                });
            });

            html.find('.knight-roll button.applyAllAttaqueEffects').click(async ev => {
                const tgt = $(ev.currentTarget);
                const flags = message.flags;
                const weapon = flags.weapon;

                for(const content of flags.content) {
                    for(const target of content.targets) {

                        const token = canvas?.tokens?.get(target.id);
                        let effects = {};

                        if(!token) return;

                        const actor = token.actor;

                        weapon.effets.raw.forEach(effectName => {
                            const status = CONFIG.KNIGHT.LIST.EFFETS.status.attaque;
                            const conditionnel = CONFIG.KNIGHT.LIST.EFFETS.status.conditionnel;
                            const split = effectName.split(' ');
                            const name = split[0];
                            const value = split[1];
                            let skip = false;

                            if((weapon.options.find(itm => itm.value === 'barrage')?.active ?? false) && name !== 'barrage') {
                                skip = true;
                            }

                            if(status.includes(name) && !skip && ((weapon.options.find(itm => itm.value === name)?.active ?? false) || !weapon.options.find(itm => itm.value === name))) {
                                if(conditionnel.includes(name)) {
                                    let isHit = false;

                                    if (target && target.effets) {
                                        const effect = target.effets.find(itm => itm.simple === name && conditionnel.includes(itm.simple));

                                        if (effect) {
                                            isHit = effect.hit;
                                        }
                                    }

                                    if(isHit) effects[name] = value ? parseInt(value) : true;
                                } else effects[name] = value ? parseInt(value) : true;
                            }
                        });

                        /**/

                        // #####################
                        // Set effects
                        // #####################
                        const effectList = actor.type === 'bande'
                        ? ['lumiere']
                        : CONFIG.KNIGHT.LIST.EFFETS.status.attaque;
                        effectList.map(async iconName => {
                            const isBoolean = ['designation', 'soumission'].includes(iconName);
                            if (effects[iconName] && (typeof effects[iconName] === 'number' || isBoolean)) {
                                // Check if "Status Icon Counters" module is set
                                if (window.EffectCounter) {
                                    // Set the icon path in the system
                                    const iconPath = `systems/knight/assets/icons/effects/${iconName}.svg`;

                                    // Get the effect
                                    let effect = actor.appliedEffects.find(e => e.icon === iconPath);

                                    if (!effect) {
                                        if(isVersion12) {
                                            let counterNumber = isBoolean ? 1 : effects[iconName];
                                            // Create the counter
                                            if (counterNumber) {
                                                const newEffect = await ActiveEffect.fromStatusEffect(CONFIG.statusEffects.find(itm => itm.icon === iconPath).id);
                                                const counter = await actor.createEmbeddedDocuments('ActiveEffect', [newEffect]);
                                                counter[0].statusCounter.setValue(counterNumber);
                                            }
                                        } else {
                                            let counterNumber = isBoolean ? 1 : effects[iconName];
                                            // Create the counter
                                            if (counterNumber) {
                                                const counter = new ActiveEffectCounter(counterNumber, iconPath, actor);
                                                counter.update();
                                            }
                                        }
                                    } else {
                                        switch (iconName) {
                                            case 'barrage':
                                            case 'choc':
                                            case 'degatscontinus':
                                            case 'immobilisation':
                                            case 'lumiere':
                                            case 'parasitage':
                                                if(isVersion12) {
                                                    if (effect.statusCounter.displayValue < effects[iconName]) {
                                                        // Update the counter
                                                        effect.statusCounter.setValue(effects[iconName]);
                                                    }
                                                } else {
                                                    if (effect.value < effects[iconName]) {
                                                        // Update the counter
                                                        effect.setValue(effects[iconName]);
                                                    }
                                                }
                                                break;
                                        }
                                    }
                                } else {
                                    // No "Status Icon Counters" module
                                    if(isVersion12) {
                                        actor.toggleStatusEffect(iconName, { active: true, overlay: false });
                                    } else {
                                        V11toggleStatusEffect(actor, iconName, { active: true, overlay: false });
                                    }
                                }
                            }
                        });
                    }

                }
            });

            tgtBtn.click(async ev => {
                const type = message.getFlag('knight', 'type');
                const target = message.getFlag('knight', 'target');

                if(type === 'nods') {
                    const targetTo = canvas.tokens.get(target)?.actor ?? undefined;
                    const nods = message.getFlag('knight', 'nod');

                    if(!targetTo) return;
                    const wear = targetTo.system?.wear ?? undefined;

                    let update = {};
                    let total = 0;

                    for(let r of message.rolls) {
                        total += r.total;
                    }

                    switch(nods) {
                        case 'soin':
                            update['system.sante.value'] = total+targetTo.system.sante.value;
                            break;

                        case 'energie':
                            if(targetTo.type === 'knight') update[`system.equipements.${wear}.energie.value`] = total+targetTo.system.energie.value;
                            else update[`system.energie.value`] = total+targetTo.system.energie.value;
                            break;

                        case 'armure':
                            if(targetTo.type === 'knight') update[`system.equipements.${wear}.armure.value`] = total+targetTo.system.armure.value;
                            else update[`system.armure.value`] = total+targetTo.system.armure.value;
                            break;
                    }

                    targetTo.update(update);

                    const rNods = new game.knight.RollKnight(targetTo, {
                        name:game.i18n.localize(`KNIGHT.JETS.Nods${nods}`),
                    }, false);

                    let txtBase = total > 1 ? `KNIGHT.JETS.PluralRecupere` : `KNIGHT.JETS.SingularRecupere`;

                    rNods.sendMessage({
                        classes:'',
                        text:`${game.i18n.format(`${txtBase}${nods.charAt(0).toUpperCase() + nods.slice(1)}`, {value:total})}`,
                    })
                }
            });

            // Display damages on PNJs
            async function displayDamageOnPNJ(data) {
                // Get params
                const {
                    token,
                    dmg,
                    dmgBonus = 0,
                    effects = [],
                    igncdf = false,
                    ignarm = false,
                    antiAnatheme = false,
                    antiVehicule = false,
                    pierceArmor = 0,
                    penetrating = 0,
                    esquive = false,
                    dmgZone = {
                        armure: true,
                        sante: true,
                        energie: false,
                        espoir: false,
                        resilience: false,
                        blindage: false
                    },
                } = data;

                // Get actor
                const actor = token.actor;

                // Chair exceptionnelle
                const hasChairMaj = !!actor.system.aspects?.chair?.ae?.majeur?.value
                const chairEx =
                    parseInt(actor.system.aspects?.chair?.ae?.mineur?.value || 0) +
                    parseInt(actor.system.aspects?.chair?.ae?.majeur?.value || 0);
                const findValue = (name) =>
                    ((actor?.system?.options && typeof actor?.system?.options[name] !== 'undefined'
                    ? actor?.system?.options[name]
                    : true)
                    && actor?.system[name]?.value)
                    ? actor?.system[name]?.value
                    : 0;

                // Bouclier
                const bouclier = findValue('bouclier');

                // Champ de Force
                const champDeForce = findValue('champDeForce');

                // Armor
                const armor = findValue('armure');
                let armorDmg = 0;

                // Sante
                const sante = findValue('sante');
                let santeDmg = 0;

                // Resilience
                const resilience = findValue('resilience');
                let resilienceDmg = 0;

                // isVehicule
                const isVehicule = actor.system.colosse
                    || actor.type === 'vehicule'
                    || false;

                // Other
                const assassin = effects.assassin || 0;
                let damageTotal = parseInt(dmg, 10) + parseInt(dmgBonus, 10) + assassin;
                let damagesLeft = damageTotal;
                let chatMessage = '';

                // Check if the target is still alive
                if (sante === 0 && armor === 0) {
                    if(isVersion12) actor.toggleStatusEffect('dead', { active: true, overlay: true });
                    else V11toggleStatusEffect(actor, 'dead', { active: true, overlay: true });

                    chatMessage += `<p><b>${game.i18n.localize('KNIGHT.JETS.DEGATSAUTO.TargetAlreadyDead')}.</b></p>`;
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: actor }),
                        content: chatMessage,
                        whisper: [game.user._id],
                    });
                    return;
                }

                // Reduce Chair Exceptionnel
                if (chairEx > 0 && !antiAnatheme) {
                    damagesLeft -= chairEx;
                }

                // Reduce the bouclier
                if (bouclier > 0 && !antiAnatheme) {
                    damagesLeft -= bouclier;
                }

                // Reduce the Champ de Force
                if (champDeForce > 0 && !igncdf) {
                    damagesLeft -=
                        champDeForce - penetrating > 0 ? champDeForce - penetrating : 0;
                }

                // If the damages are not anti véhicules, the damages are divide by 10
                let damagesLeftDivideBy10 = false;
                if (isVehicule && !antiVehicule) {
                    damagesLeft = Math.ceil(damagesLeft / 10);
                    damagesLeftDivideBy10 = true;
                }

                // Check if the esquive is used
                if (esquive) {
                    damagesLeft = Math.ceil(damagesLeft / 2);
                }

                // Check if the damages are enough to do at least 1 damage
                if (damagesLeft < 1) {
                    chatMessage += `<p><b>${game.i18n.localize('KNIGHT.JETS.DEGATSAUTO.NoDamageOnTarget')}.</b></p>`;
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: actor }),
                        content: chatMessage,
                        whisper: [game.user._id],
                    });
                    return;
                }

                // #####################
                // Set effects
                // #####################
                const effectList = actor.type === 'bande'
                    ? []
                    : CONFIG.KNIGHT.LIST.EFFETS.status.degats;

                effectList.map(async iconName => {
                    const isBoolean = ['designation', 'soumission'].includes(iconName);
                    if (effects[iconName] && (typeof effects[iconName] === 'number' || isBoolean)) {
                        // Check if "Status Icon Counters" module is set
                        if (window.EffectCounter) {
                            // Set the icon path in the system
                            const iconPath = `systems/knight/assets/icons/effects/${iconName}.svg`;

                            // Get the effect
                            let effect = actor.appliedEffects.find(e => e.icon === iconPath);

                            if (!effect) {
                                if(isVersion12) {
                                    let counterNumber = isBoolean ? 1 : effects[iconName];
                                    // Create the counter
                                    if (counterNumber) {
                                        const newEffect = await ActiveEffect.fromStatusEffect(CONFIG.statusEffects.find(itm => itm.icon === iconPath).id);
                                        const counter = await actor.createEmbeddedDocuments('ActiveEffect', [newEffect]);
                                        counter[0].statusCounter.setValue(counterNumber);
                                    }
                                } else {
                                    let counterNumber = isBoolean ? 1 : effects[iconName];
                                    // Create the counter
                                    if (counterNumber) {
                                        const counter = new ActiveEffectCounter(counterNumber, iconPath, actor);
                                        counter.update();
                                    }
                                }
                            } else {
                                switch (iconName) {
                                    case 'barrage':
                                    case 'choc':
                                    case 'degatscontinus':
                                    case 'immobilisation':
                                    case 'lumiere':
                                    case 'parasitage':
                                        if(isVersion12) {
                                            if (effect.statusCounter.displayValue < effects[iconName]) {
                                                // Update the counter
                                                effect.statusCounter.setValue(effects[iconName]);
                                            }
                                        } else {
                                            if (effect.value < effects[iconName]) {
                                                // Update the counter
                                                effect.setValue(effects[iconName]);
                                            }
                                        }
                                        break;
                                }
                            }
                         } else {
                            // No "Status Icon Counters" module
                            if(isVersion12) {
                                actor.toggleStatusEffect(iconName, { active: true, overlay: false });
                            } else {
                                V11toggleStatusEffect(actor, iconName, { active: true, overlay: false });
                            }
                        }
                    }
                });
                // #####################
                // Damages on resilience
                // #####################
                const briserResi = effects.briserlaresilience || 0;
                if (resilience > 0 && dmgZone.resilience && (damagesLeft > 0 || briserResi > 0) && !antiVehicule) {
                    // if damages are not already divided by 10
                    if (!damagesLeftDivideBy10) {
                        damagesLeft = Math.ceil(damagesLeft / 10);
                    }

                    // Do briser la resilience damages
                    let resilienceLessBriserResi = resilience;
                    if (briserResi > 0) {
                        if (resilience > briserResi) {
                            resilienceLessBriserResi -= briserResi;
                            resilienceDmg += briserResi;
                        } else {
                            resilienceLessBriserResi = 0
                            resilienceDmg += resilience;
                        }
                    }

                    // Check if the damages are upper than the resilience
                    if (damagesLeft > resilienceLessBriserResi) {
                        resilienceDmg += resilienceLessBriserResi;
                    } else {
                        resilienceDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= resilienceLessBriserResi;

                    // Update the actor and the chat message
                    const resilienceRest =
                        resilience - resilienceDmg < 0 ? 0 : resilience - resilienceDmg;
                    actor.update({
                        'system.resilience.value': resilienceRest,
                    });
                    chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: resilienceDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Resilience"), dmgRest: resilienceRest});
                }

                // ################
                // Damages on armor
                // ################
                if (
                    armor > 0 &&
                    damagesLeft > 0 &&
                    armor >= pierceArmor &&
                    dmgZone.armure &&
                    (!ignarm || sante === 0 || (!dmgZone.sante && ignarm))
                ) {
                    // Do destructeur damages
                    const destructeur = effects.destructeur || 0;
                    let armorLessDestructeur = armor;
                    if (destructeur > 0) {
                        if (armor > destructeur) {
                            armorLessDestructeur -= destructeur;
                            armorDmg += destructeur;
                        } else {
                            armorLessDestructeur = 0
                            armorDmg += armor;
                        }
                    }

                    // Check if the damages are upper than the armor
                    if (damagesLeft > armorLessDestructeur) {
                        armorDmg += armorLessDestructeur;
                    } else {
                        armorDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= armorLessDestructeur;

                    // Update the actor and the chat message
                    const armorRest = armor - armorDmg < 0 ? 0 : armor - armorDmg;
                    actor.update({
                        'system.armure.value': armorRest,
                    });
                    chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: armorDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Armure"), dmgRest: armorRest});
                }

                // ################
                // Damages on sante
                // ################
                if (sante > 0 && damagesLeft > 0 && dmgZone.sante) {
                    let santeLessBonuses = sante;

                    // Do meurtrier damages
                    const meurtrier = effects.meurtrier || 0;
                    if (meurtrier > 0 && !hasChairMaj) {
                    if (sante > meurtrier) {
                        santeLessBonuses -= meurtrier;
                        santeDmg += meurtrier;
                    } else {
                        santeLessBonuses = 0
                        santeDmg += sante;
                    }
                    }

                    // PNJ is a bande
                    if (actor.type === "bande") {
                        // Do fureur damages
                        const fureur = effects.fureur || 0;
                        if (fureur > 0 && actor?.system?.aspects?.chair?.value >= 10) {
                            if (sante > fureur) {
                                santeLessBonuses -= fureur;
                                santeDmg += fureur;
                            } else {
                                santeLessBonuses = 0
                                santeDmg += sante;
                            }
                        }

                        // Do ultraviolence damages
                        const ultraviolence = effects.ultraviolence || 0;
                        if (ultraviolence > 0 && actor?.system?.aspects?.chair?.value < 10) {
                            if (sante > ultraviolence) {
                                santeLessBonuses -= ultraviolence;
                                santeDmg += ultraviolence;
                            } else {
                                santeLessBonuses = 0
                                santeDmg += sante;
                            }
                        }

                        // Do intimidantana damages
                        const intimidantana = effects.intimidantana || 0;
                        if (intimidantana > 0) {
                            if (sante > intimidantana) {
                                santeLessBonuses -= intimidantana;
                                santeDmg += intimidantana;
                            } else {
                                santeLessBonuses = 0
                                santeDmg += sante;
                            }
                        }

                        // Do intimidanthum damages
                        const intimidanthum = effects.intimidanthum || 0;
                        if (intimidanthum > 0) {
                            if (sante > intimidanthum) {
                                santeLessBonuses -= intimidanthum;
                                santeDmg += intimidanthum;
                            } else {
                                santeLessBonuses = 0
                                santeDmg += sante;
                            }
                        }
                    }

                    // Check if the damages are upper than the armor
                    if (damagesLeft > santeLessBonuses) {
                        santeDmg += santeLessBonuses;
                    } else {
                        santeDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= santeLessBonuses;

                    // Update the actor and the chat message
                    const santeRest = sante - santeDmg < 0 ? 0 : sante - santeDmg;
                    actor.update({
                        'system.sante.value': santeRest,
                    });
                    chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: santeDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Sante"), dmgRest: santeRest});
                }

                // Set the creature dead
                if (damagesLeft >= 0) {
                    chatMessage += `<p><b>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.TargetDead")}.</b></p>`;
                    if(isVersion12) actor.toggleStatusEffect('dead', { active: true, overlay: true });
                    else V11toggleStatusEffect(actor, 'dead', { active: true, overlay: true });
                }

                ChatMessage.create({
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker({ actor: actor }),
                    content: chatMessage,
                    whisper: [game.user._id],
                });
            }

            // Display damages on PJs
            async function displayDamageOnPJ(data) {
                // Get params
                const {
                    token,
                    dmg,
                    dmgBonus = 0,
                    effects = [],
                    igncdf = false,
                    ignarm = false,
                    ignegi = false,
                    esquive = false,
                    antiVehicule = false,
                    pierceArmor = 0,
                    penetrating = 0,
                    dmgZone = {
                        armure: true,
                        sante: true,
                        energie: false,
                        espoir: false,
                        resilience: false,
                        blindage: false
                    },
                } = data;
                // Get actor
                const actor = token.actor;
                const actorIsKnight = actor.type === "knight";
                const actorIsMechaArmor = actor.type === "mechaarmure";

                const findValue = (name) => {
                    if (actorIsKnight) {
                        return (actor?.system?.jauges
                            && actor?.system?.jauges[name]
                            && actor?.system[name]?.value)
                            ? actor?.system[name]?.value
                            : 0;
                    } else if (actorIsMechaArmor) {
                        return (actor?.system[name]?.value)
                            ? actor?.system[name]?.value
                            : 0;
                    }
                    return 0;
                }

                // Champ de Force
                const champDeForce = findValue('champDeForce');

                // Egide
                const egide = findValue('egide');

                // Armor
                const armor = findValue('armure');
                const hasArmor = actorIsKnight ? actor.system?.jauges?.armure === true : false;
                let armorDmg = 0;
                let armorRest = armor;

                // Sante
                const sante = findValue('sante');
                const hasSante = actorIsKnight ? actor.system?.jauges?.sante === true : false;
                let santeDmg = 0;
                let santeRest = sante;
                let santeDamagesFromArmor = 0;

                // Resilience
                const resilience = findValue('resilience');
                const hasResilience = actorIsMechaArmor ? true : false;
                let resilienceDmg = 0;
                let resilienceRest = resilience;

                // Blindage
                const blindage = findValue('blindage');
                const hasBlindage = actorIsMechaArmor ? true : false;
                let blindageDmg = 0;
                let blindageRest = blindage;

                // Energie
                const energie = findValue('energie');
                const hasEnergie = true;
                let energieDmg = 0;
                let energieRest = energie;

                // Espoir
                const espoir = findValue('espoir');
                const hasEspoir = actorIsKnight ? true : false;
                let espoirDmg = 0;
                let espoirRest = espoir;

                // Other
                const assassin = effects.assassin || 0;
                let damageTotal = parseInt(dmg, 10) + parseInt(dmgBonus, 10) + assassin;
                let damagesLeft = damageTotal;
                let chatMessage = '';

                // Check if the target is still alive
                if ((actorIsKnight && ((hasSante && sante === 0) || (!hasSante && armor === 0))) || (actorIsMechaArmor && blindage === 0)) {
                    if(isVersion12) actor.toggleStatusEffect('dead', { active: true, overlay: true });
                    else V11toggleStatusEffect(actor, 'dead', { active: true, overlay: true });

                    chatMessage += `<p><b>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.TargetAlreadyDead")}.</b></p>`;
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: actor }),
                        content: chatMessage,
                        whisper: [game.user._id],
                    });
                    return;
                }

                // Reduce the egide
                if (actorIsKnight && egide > 0 && !ignegi) {
                    damagesLeft -= egide;
                }

                // Reduce the Champ de Force
                if (champDeForce > 0 && !igncdf) {
                    damagesLeft -=
                    champDeForce - penetrating > 0 ? champDeForce - penetrating : 0;
                }

                // Check if the esquive is used
                if (esquive) {
                    damagesLeft = Math.ceil(damagesLeft / 2);
                }

                // Check if the damages are enough to do at least 1 damage
                if (damagesLeft < 1) {
                    chatMessage += `<p><b>${game.i18n.localize('KNIGHT.JETS.DEGATSAUTO.NoDamageOnTarget')}.</b></p>`;
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: actor }),
                        content: chatMessage,
                        whisper: [game.user._id],
                    });
                    return;
                }

                // ################
                // Damages on armor
                // ################
                if (
                    hasArmor &&
                    armor > 0 &&
                    damagesLeft > 0 &&
                    armor >= pierceArmor &&
                    dmgZone.armure &&
                    (!ignarm || sante === 0 || (!dmgZone.sante && ignarm))
                ) {
                    // Do destructeur damages
                    const destructeur = effects.destructeur || 0;
                    let armorLessDestructeur = armor;
                    if (destructeur > 0) {
                    if (armor > destructeur) {
                        armorLessDestructeur -= destructeur;
                        armorDmg += destructeur;
                    } else {
                        armorLessDestructeur = 0
                        armorDmg += armor;
                    }
                    }

                    // Check if the damages are upper than the armor
                    if (damagesLeft > armorLessDestructeur) {
                    armorDmg += armorLessDestructeur;
                    } else {
                    armorDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= armorLessDestructeur;

                    // Update the actor and the chat message
                    armorRest = armor - armorDmg < 0 ? 0 : armor - armorDmg;
                    actor.update({
                        'system.armure.value': armorRest,
                    });

                    // Check if the actor got the 'Infatigable' advantage
                    if (
                        !actor.items.find(
                            (e) => e.system?.bonus?.noDmgSante && e.type === 'avantage'
                        ) &&
                        sante > 0 &&
                        dmgZone.sante
                    ) {
                        // Update the actor and the chat message
                        santeDamagesFromArmor = (armorDmg / 5) << 0;
                        santeRest =
                            sante - santeDamagesFromArmor < 0 ? 0 : sante - santeDamagesFromArmor;
                        actor.update({
                            'system.sante.value': santeRest,
                        });
                        santeDmg = santeDamagesFromArmor;
                    }
                }

                // ################
                // Damages on sante
                // ################
                if (hasSante && actorIsKnight && sante > 0 && damagesLeft > 0 && dmgZone.sante) {
                    // Do meurtrier damages
                    const meurtrier = effects.meurtrier || 0;
                    let santeLessBonuses = sante;
                    if (meurtrier > 0) {
                        if (sante > meurtrier) {
                            santeLessBonuses -= meurtrier;
                            santeDmg += meurtrier;
                        } else {
                            santeLessBonuses = 0
                            santeDmg += sante;
                        }
                    }

                    // Check if the damages are upper than the armor
                    if (damagesLeft > santeLessBonuses) {
                        santeDmg += santeLessBonuses;
                    } else {
                        santeDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= santeLessBonuses;

                    // Update the actor and the chat message
                    santeRest = sante - santeDmg < 0 ? 0 : sante - santeDmg;
                    actor.update({
                        'system.sante.value': santeRest,
                    });
                }


                // #####################
                // Set effects
                // #####################
                const effectList = actor.type === 'bande'
                    ? []
                    : CONFIG.KNIGHT.LIST.EFFETS.status.degats;
                effectList.map(async iconName => {
                    const isBoolean = ['designation', 'soumission'].includes(iconName);
                    if (effects[iconName] && (typeof effects[iconName] === 'number' || isBoolean)) {
                        // Check if "Status Icon Counters" module is set
                        if (window.EffectCounter) {
                            // Set the icon path in the system
                            const iconPath = `systems/knight/assets/icons/effects/${iconName}.svg`;

                            // Get the effect
                            let effect = actor.appliedEffects.find(e => e.icon === iconPath);

                            if (!effect) {
                                if(isVersion12) {
                                    let counterNumber = isBoolean ? 1 : effects[iconName];
                                    // Create the counter
                                    if (counterNumber) {
                                        const newEffect = await ActiveEffect.fromStatusEffect(CONFIG.statusEffects.find(itm => itm.icon === iconPath).id);
                                        const counter = await actor.createEmbeddedDocuments('ActiveEffect', [newEffect]);
                                        counter[0].statusCounter.setValue(counterNumber);
                                    }
                                } else {
                                    let counterNumber = isBoolean ? 1 : effects[iconName];
                                    // Create the counter
                                    if (counterNumber) {
                                        const counter = new ActiveEffectCounter(counterNumber, iconPath, actor);
                                        counter.update();
                                    }
                                }
                            } else {
                                switch (iconName) {
                                    case 'barrage':
                                    case 'choc':
                                    case 'degatscontinus':
                                    case 'immobilisation':
                                    case 'lumiere':
                                    case 'parasitage':
                                        if(isVersion12) {
                                            if (effect.statusCounter.displayValue < effects[iconName]) {
                                                // Update the counter
                                                effect.statusCounter.setValue(effects[iconName]);
                                            }
                                        } else {
                                            if (effect.value < effects[iconName]) {
                                                // Update the counter
                                                effect.setValue(effects[iconName]);
                                            }
                                        }
                                        break;
                                }
                            }
                         } else {
                            // No "Status Icon Counters" module
                            if(isVersion12) {
                                actor.toggleStatusEffect(iconName, { active: true, overlay: false });
                            } else {
                                V11toggleStatusEffect(actor, iconName, { active: true, overlay: false });
                            }
                        }
                    }
                });

                // #####################
                // Damages on resilience
                // #####################
                const briserResi = effects.briserlaresilience || 0;
                if (hasResilience && resilience > 0 && dmgZone.resilience && (damagesLeft > 0 || briserResi > 0) && (!antiVehicule || actorIsMechaArmor)) {
                    // Divide damages by 10
                    damagesLeft = Math.ceil(damagesLeft / 10);

                    // Do briser la resilience damages
                    let resilienceLessBriserResi = resilience;
                    if (briserResi > 0) {
                        if (resilience > briserResi) {
                            resilienceLessBriserResi -= briserResi;
                            resilienceDmg += briserResi;
                        } else {
                            resilienceLessBriserResi = 0
                            resilienceDmg += resilience;
                        }
                    }

                    // Check if the damages are upper than the resilience
                    if (damagesLeft > resilienceLessBriserResi) {
                        resilienceDmg += resilienceLessBriserResi;
                    } else {
                        resilienceDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= resilienceLessBriserResi;

                    // Update the actor and the chat message
                    resilienceRest =
                        resilience - resilienceDmg < 0 ? 0 : resilience - resilienceDmg;
                    actor.update({
                        'system.resilience.value': resilienceRest,
                    });
                    chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: resilienceDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Resilience"), dmgRest: resilienceRest});
                }

                // ###################
                // Damages on blindage
                // ###################
                if (hasBlindage && blindage > 0 && damagesLeft > 0 && dmgZone.blindage) {
                    let blindageLessBonuses = blindage;

                    // Check if the damages are upper than the armor
                    if (damagesLeft > blindageLessBonuses) {
                        blindageDmg += blindageLessBonuses;
                    } else {
                        blindageDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= blindageLessBonuses;

                    // Update the actor and the chat message
                    blindageRest = blindage - blindageDmg < 0 ? 0 : blindage - blindageDmg;
                    actor.update({
                        'system.blindage.value': blindageRest,
                    });
                }

                // ##################
                // Damages on energie
                // ##################
                if (hasEnergie && energie > 0 && damagesLeft > 0 && dmgZone.energie) {
                    // Check if the damages are upper than the health
                    if (damagesLeft > energie) {
                    energieDmg += energie;
                    } else {
                    energieDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= energie;

                    // Update the actor and the chat message
                    energieRest = energie - energieDmg < 0 ? 0 : energie - energieDmg;
                    actor.update({
                        'system.energie.value': energieRest,
                    });
                }

                // #################
                // Damages on espoir
                // #################
                if (hasEspoir && espoir > 0 && damagesLeft > 0 && dmgZone.espoir) {

                    if(actor.system.armorISwear && actor.system.dataArmor) {
                        const reduction = actor?.system?.dataArmor?.system?.special?.selected?.apeiron?.espoir?.reduction?.value ?? 0;

                        damagesLeft -= reduction;
                    }

                    if(actor.system?.options?.kraken ?? false) damagesLeft -= 1;
                    if(actor.system?.espoir?.reduction ?? 0) damagesLeft -= actor.system?.espoir?.reduction;

                    // Check if the damages are upper than the health
                    if (damagesLeft > espoir) {
                    espoirDmg += espoir;
                    } else {
                    espoirDmg += damagesLeft > 0 ? damagesLeft : 0;
                    }

                    // Set the damages left
                    damagesLeft -= espoir;

                    // Update the actor and the chat message
                    espoirRest = espoir - espoirDmg < 0 ? 0 : espoir - espoirDmg;
                    actor.update({
                        'system.espoir.value': espoirRest,
                    });
                }

                const stringLiaison = (dmgZone, values) => {
                    let zones = Object.keys(dmgZone)
                    .filter((e) => !values.includes(e))
                    .filter((e) => dmgZone[e] === true).length;
                    const result = zones > 1 ? ', ' : zones === 1 ? ` ${game.i18n.localize("KNIGHT.AUTRE.And")} ` : '.';

                    return result;
                };

                // Set the message
                chatMessage = `
                    <h3>
                    ${
                        [armorDmg, santeDmg, energieDmg, espoirDmg].find((e) => e > 0)
                        ? game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.DamageReceived") + ' !'
                        : game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.DamageMixed") + ' !'
                    }
                    </h3>
                    <p>
                    ${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjDamageMessageStart", {damageTotal: damageTotal, actorName: actor.name})}
                    ${
                        dmgZone.armure
                        ? `<b>${armorDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointArmure-short")}</b>${stringLiaison(dmgZone, ['armure'])}`
                        : ''
                    }
                    ${
                        dmgZone.sante
                        ? `<b>${santeDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointSante-short")}</b>${
                            santeDamagesFromArmor > 0
                                ? ` (${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjDamageMessageArmorChocHealth", {dmg: santeDamagesFromArmor})})`
                                : ''
                            }${stringLiaison(dmgZone, ['armure', 'sante'])}`
                        : ''
                    }
                    ${
                        dmgZone.resilience
                        ? `<b>${resilienceDmg} ${game.i18n.localize("KNIGHT.LATERAL.Resilience")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.blindage
                        ? `<b>${blindageDmg} ${game.i18n.localize("KNIGHT.LATERAL.Blindage")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.energie
                        ? `<b>${energieDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointEnergie-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            'energie',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.espoir
                        ? `<b>${espoirDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointEspoir-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            'energie',
                            'espoir',
                            ])}`
                        : ''
                    }
                    </p>
                    <p>
                    ${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.HeHad")}
                    ${
                        dmgZone.armure
                        ? `<b>${armor} ${game.i18n.localize("KNIGHT.AUTRE.PointArmure-short")}</b>${stringLiaison(dmgZone, ['armure'])}`
                        : ''
                    }
                    ${
                        dmgZone.sante
                        ? `<b>${sante} ${game.i18n.localize("KNIGHT.AUTRE.PointSante-short")}</b>${stringLiaison(dmgZone, ['armure', 'sante'])}`
                        : ''
                    }
                    ${
                        dmgZone.resilience
                        ? `<b>${resilience} ${game.i18n.localize("KNIGHT.LATERAL.Resilience")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.blindage
                        ? `<b>${blindage} ${game.i18n.localize("KNIGHT.LATERAL.Blindage")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.energie
                        ? `<b>${energie} ${game.i18n.localize("KNIGHT.AUTRE.PointEnergie-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            'energie',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.espoir
                        ? `<b>${espoir} ${game.i18n.localize("KNIGHT.AUTRE.PointEspoir-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            'energie',
                            'espoir',
                            ])}`
                        : ''
                    }
                    </p>
                    <p>
                    ${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.HeHasLeft")}
                    ${
                        dmgZone.armure
                        ? `<b>${armorRest} ${game.i18n.localize("KNIGHT.AUTRE.PointArmure-short")}</b>${stringLiaison(dmgZone, ['armure'])}`
                        : ''
                    }
                    ${
                        dmgZone.sante
                        ? `<b>${santeRest} ${game.i18n.localize("KNIGHT.AUTRE.PointSante-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.resilience
                        ? `<b>${resilienceRest} ${game.i18n.localize("KNIGHT.LATERAL.Resilience")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.blindage
                        ? `<b>${blindageRest} ${game.i18n.localize("KNIGHT.LATERAL.Blindage")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'blindage',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.energie
                        ? `<b>${energieRest} ${game.i18n.localize("KNIGHT.AUTRE.PointEnergie-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'energie',
                            ])}`
                        : ''
                    }
                    ${
                        dmgZone.espoir
                        ? `<b>${espoirRest} ${game.i18n.localize("KNIGHT.AUTRE.PointEspoir-short")}</b>${stringLiaison(dmgZone, [
                            'armure',
                            'sante',
                            'resilience',
                            'energie',
                            'espoir',
                            ])}`
                        : ''
                    }
                    </p>
                    `;

                // Check if the armor need to fold
                if (armorRest <= 0 && hasSante) {
                    if (actor.system.wear === 'armure') {
                    chatMessage += `<p>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.ArmorFolds")}.</p>`;
                    // actor.update({ 'system.wear': 'guardian' }); //TODO Bug, it set the armor at 13 and the guardian armor value at 0
                    } else if(actor.system.wear === 'guardian') {
                    chatMessage += `<p>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.GuardianDontProtect")}</p>`;
                    }
                }

                // Check if the player is dead
                if ((actorIsKnight && ((hasSante && santeRest <= 0) || (!hasSante && armorRest <= 0))) || (actorIsMechaArmor && blindageRest <= 0)) {
                    chatMessage += `<p>${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjDead", {name: actor.name})}.</p>`;
                    if(isVersion12) actor.toggleStatusEffect('dead', { active: true, overlay: true });
                    else V11toggleStatusEffect(actor, 'dead', { active: true, overlay: true });
                }

                // Check if the player sinks into despair
                if (hasEspoir && espoirRest <= 0) {
                    chatMessage += `<p>${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjHopeless", {name: actor.name})}</p>`;
                    if(isVersion12) actor.toggleStatusEffect('dead', { active: true, overlay: true });
                    else V11toggleStatusEffect(actor, 'dead', { active: true, overlay: true });
                }

                // Send message
                ChatMessage.create({
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker({ actor: actor }),
                    content: chatMessage,
                });
                return;
            }

            async function V11toggleStatusEffect(actor, statusId, {active, overlay=false}={}) {
                const status = CONFIG.statusEffects.find(e => e.id === statusId);
                if ( !status ) throw new Error(`Invalid status ID "${statusId}" provided to Actor#toggleStatusEffect`);
                const existing = [];

                // Find the effect with the static _id of the status effect
                if ( status._id ) {
                  const effect = actor.effects.get(status._id);
                  if ( effect ) existing.push(effect.id);
                }
                // If no static _id, find all single-status effects that have this status
                else {
                  for ( const effect of actor.effects ) {
                    const statuses = effect.statuses;
                    if ( (statuses.size === 1) && statuses.has(status.id) ) existing.push(effect.id);
                  }
                }
                // Remove the existing effects unless the status effect is forced active
                if ( existing.length ) {
                  if ( active ) return true;
                  await actor.deleteEmbeddedDocuments("ActiveEffect", existing);
                  return false;
                }

                let cEffect = {
                    icon:status.icon,
                    id:status.id,
                    statuses:[statusId],
                    label:game.i18n.localize(status.label)
                }

                let nEffect = await actor.createEmbeddedDocuments('ActiveEffect', [cEffect]);

                nEffect[0].setFlag('core', 'overlay', overlay);
            }

            // Create dialog for damages
            const doDamages = async (data) => {
                // Get data
                const {tokenId, dmg, effects, dmgType} = data;
                // Get token
                const token = canvas?.tokens?.get(tokenId) ?? {isVisible:false};

                // Function to get sheet values
                const findValue = (name) =>
                    (((token?.actor?.system?.options
                        && typeof token?.actor?.system?.options[name] !== 'undefined')
                        ? token?.actor?.system?.options[name]
                        : true)
                        && token?.actor?.system[name]?.value)
                        ? token?.actor?.system[name]?.value
                        : 0;

                // Set damage zone for PJs
                const dmgZone = {
                    armure: !!findValue('armure'),
                    sante: !!findValue('sante'),
                    energie: false,
                    espoir: false,
                    resilience: false,
                    blindage: false
                };

                if (['pnj', 'creature', 'bande', 'vehicule'].includes(token.actor.type)) {
                    // Updates for PNJs
                    const actor = token.actor;
                    const options = actor.system.options;

                    if(options?.resilience) dmgZone.resilience = true;
                    if(options?.sante) dmgZone.sante = true;
                    if(options?.armure) dmgZone.armure = true;
                }
                else if (['mechaarmure'].includes(token.actor.type)) {
                    // Updates for Mecha Armors
                    dmgZone.armure = false;
                    dmgZone.sante = false;
                    dmgZone.energie = false;
                    dmgZone.espoir = false;
                    dmgZone.resilience = true;
                    dmgZone.blindage = true;
                } else if (['knight'].includes(token.actor.type)) {
                    // Updates for PJs

                    // If Anatheme effect
                    if (effects.anatheme) {
                        dmgZone.armure = false;
                        dmgZone.sante = false;
                        dmgZone.energie = false;
                        dmgZone.espoir = true;
                        dmgZone.resilience = false;
                        dmgZone.blindage = false;
                    }
                }
                else {
                    // The target is not accepted yet
                    ChatMessage.create({
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker({ actor: token.actor }),
                        content: `<p><b>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.TargetNotYetvalid")}.</b></p>`,
                        whisper: [game.user._id],
                    });
                    return;
                }

                // Get damages less bonuses like fureur and ultraviolence
                let damages = dmg;
                if (token.actor.type === "bande") {
                    if (effects.fureur && token.actor?.system?.aspects?.chair?.value >= 10) {
                        damages -= effects.fureur
                    }
                    if (effects.ultraviolence && token.actor?.system?.aspects?.chair?.value < 10) {
                        damages -= effects.ultraviolence
                    }
                }

                // Get the template
                const content = await renderTemplate('systems/knight/templates/dialog/damage-sheet.html', {
                    pj : ['knight'].includes(token.actor.type),
                    mechaarmor : ['mechaarmure'].includes(token.actor.type),
                    pnj : ['pnj', 'creature', 'bande', 'vehicule'].includes(token.actor.type),
                    bande : ['bande'].includes(token.actor.type),
                    token,
                    dmg: damages,
                    effects,
                    dmgZone
                });

                const dialogTitle = () => {
                    let result = game.i18n.localize("ACTOR.TypeKnight") + ' • ';

                    if (dmgType === "damage") {
                        result += game.i18n.localize("KNIGHT.AUTRE.Degats");
                    } else if (dmgType === "violence") {
                        result += game.i18n.localize("KNIGHT.AUTRE.Violence");
                    } else if (dmgType === "debordement") {
                        result += game.i18n.localize("KNIGHT.AUTRE.Debordement");
                    } else {
                        // Set an error
                    }
                    result += ' ';
                    if (['knight', 'mechaarmure'].includes(token.actor.type)) {
                        result += game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.ToPj");
                    } else {
                        result += game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.ToPnj");
                    }
                    result += ' : ' + token.actor.name

                    return result;
                }

                // Send the dialog
                return new Dialog(
                    {
                    title: dialogTitle(),
                    content: content,
                    buttons: {
                        Calculer: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.Calculate"),
                        callback: async (html) =>
                            {
                            // Updates the effects
                            ['meurtrier', 'destructeur', 'briserlaresilience', 'assassin', 'fureur', 'ultraviolence', 'intimidantana', 'intimidanthum'].forEach(effectName => {
                                if (html.find('#'+effectName)[0]?.value) {
                                effects[effectName] = parseInt(html.find('#'+effectName)[0].value, 10);
                                }
                            });

                            // Get the datas
                            const data = {
                                token: token,
                                dmg: html.find('#dmg')[0]?.value,
                                effects: effects,
                                dmgBonus: html.find('#dmgBonus')[0]?.value,
                                igncdf: html.find('#igncdf')[0]?.checked,
                                ignarm: html.find('#ignarm')[0]?.checked,
                                ignegi: html.find('#ignegi')[0]?.checked,
                                esquive: html.find('#esquive')[0]?.checked,
                                pierceArmor: html.find('#pierceArmor')[0]?.value,
                                penetrating: html.find('#penetrating')[0]?.value,
                                dmgZone: {
                                    armure: html.find('#armureDmg')[0]?.checked,
                                    sante: html.find('#santeDmg')[0]?.checked,
                                    energie: html.find('#energieDmg')[0]?.checked,
                                    espoir: html.find('#espoirDmg')[0]?.checked,
                                    resilience: html.find('#resilienceDmg')[0]?.checked,
                                    blindage: html.find('#blindageDmg')[0]?.checked,
                                },
                                antiAnatheme: html.find('#antiAnatheme')[0]?.checked,
                                antiVehicule: html.find('#antiVehicule')[0]?.checked,
                            }

                            // Select the good damages
                            if (['knight', 'mechaarmure'].includes(token.actor.type)) {
                                return displayDamageOnPJ(data);
                            } else {
                                return displayDamageOnPNJ(data);
                            }
                            },
                        },

                        Annuler: {
                        icon: '<i class="fas fa-close"></i>',
                        label: game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.Cancel"),
                        },
                    },
                    default: 'close',
                    close: () => {},
                    },
                    {
                    classes: ["dialog", "knight", "damageDialog"],
                    width: 650
                    }
                ).render(true);
            }

            html.find('.knight-roll button.setDegats').click(async ev => {
            const tgt = $(ev.currentTarget);
            const tokenId = tgt.data('id');
            const dmg = tgt.data('dmg');
            const dmgType = tgt.data('dmgtype');
            const effects = {};
            tgt
                .data('effects')
                ?.split(',')
                ?.map((e) => {
                effects[e.split(' ')[0]] =
                    e.split(' ')[e.split(' ').length - 1] &&
                    !Number.isNaN(parseInt(e.split(' ')[e.split(' ').length - 1]))
                    ? parseInt(e.split(' ')[e.split(' ').length - 1])
                    : true;
                });

            // Do damages
            await doDamages({tokenId, dmg, effects, dmgType});
            });

            html.find('.knight-roll button.setDegatsAllTargets').click(async ev => {
            const tgt = $(ev.currentTarget);
            const alltargets = tgt.data('alltargets');
            const dmgType = tgt.data('dmgtype');
            const effects = {};
            tgt
                .data('effects')
                ?.split(',')
                ?.map((e) => {
                effects[e.split(' ')[0]] =
                    e.split(' ')[e.split(' ').length - 1] &&
                    !Number.isNaN(parseInt(e.split(' ')[e.split(' ').length - 1]))
                    ? parseInt(e.split(' ')[e.split(' ').length - 1])
                    : true;
                });

            const targetsIdsDmgs = alltargets.split(',');

            for (let i = 0; i < targetsIdsDmgs.length; i++) {
                // Get token id
                const tokenId = targetsIdsDmgs[i].split('-')[0];

                // Get dmg
                const dmg = targetsIdsDmgs[i].split('-')[1];

                // Do damages
                await doDamages({tokenId, dmg, effects, dmgType});
            }
            });

            html.find('.knight-roll .btn.debordement button').click(async ev => {
            const tgt = $(ev.currentTarget);
            const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);
            const tour = parseInt(actor.system.debordement.tour);

            await actor.update({['system.debordement.tour']:tour+1});
            const roll = new game.knight.RollKnight(actor, {
                name:`${actor.name}`,
            }, false);

            roll.sendMessage({text:game.i18n.localize('KNIGHT.JETS.DebordementAugmente'), classes:'important'});
            });

            html.find('.knight-roll button.relancedegats').click(async ev => {
            const tgt = $(ev.currentTarget);
            const flags = message.flags;
            const weapon = flags.weapon;
            const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);

            const roll = new game.knight.RollKnight(actor, {
                name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.EFFETS.TIRENRAFALE.Label')}`,
                weapon:weapon,
                surprise:flags.surprise,
            }, false);

            let addFlags = {
                flavor:flags.flavor,
                total:flags.total,
                targets:flags.targets,
                attaque:message.rolls,
                weapon:weapon,
                actor:actor,
                surprise:flags.surprise,
                style:flags.style,
                dataStyle:flags.dataStyle,
                dataMod:flags.dataMod,
                maximize:flags.maximize,
            };

            let data = {
                total:flags.total,
                targets:flags.targets,
                attaque:flags.attaque,
                flags:addFlags,
            };

            await roll.doRollDamage(data);
            });

            html.find('.knight-roll button.violence').click(async ev => {
            const tgt = $(ev.currentTarget);
            const flags = message.flags;
            const weapon = flags.weapon;
            const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);

            let addFlags = {
                flavor:flags.flavor,
                total:flags.content[0].total,
                targets:flags.content[0].targets,
                attaque:message.rolls,
                weapon:weapon,
                actor:actor,
                surprise:flags.surprise,
                style:flags.style,
                dataStyle:flags.dataStyle,
                dataMod:flags.dataMod,
                maximize:flags.maximize,
            };

            const roll = new game.knight.RollKnight(actor, {
                name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
                weapon:flags.weapon,
                surprise:flags.surprise,
            }, false);

            await roll.doRollViolence({
                total:flags.content[0].total,
                targets:flags.content[0].targets,
                attaque:message.rolls,
                flags:addFlags,
            });
            });

            html.find('.knight-roll div.listTargets div.target').mouseenter(ev => {
            ev.preventDefault();
            if (!canvas.ready) return;
            const tgt = $(ev.currentTarget);
            const id = tgt.data('id');
            const token = canvas?.tokens?.get(id) ?? {isVisible:false};

            if(token && token.isVisible) {
                token._onHoverIn(ev, { hoverOutOthers: true });

                this._hoveredToken = token;
            }
            });

            html.find('.knight-roll div.listTargets div.target').mouseleave(ev => {
            ev.preventDefault();
            if (!canvas.ready) return;

            if (this._hoveredToken) {
                this._hoveredToken._onHoverOut(ev);
            }

            this._hoveredToken = null;
            });

            html.find('.knight-roll div.listTargets div.target.withTooltip').click(ev => {
                ev.preventDefault();
                const tgt = $(ev.currentTarget);

                html.find('.knight-roll div.listTargets div.dice-tooltip').toggle({
                    complete: () => {},
                });
            });
        });
        //FIN GESTION MESSAGE
    }
}
