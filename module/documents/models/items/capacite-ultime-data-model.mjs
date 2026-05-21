import { capitalizeFirstLetter } from "../../../helpers/common.mjs";

export class CapaciteUltimeDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {StringField, HTMLField, SchemaField, BooleanField, NumberField, ArrayField, ObjectField} = foundry.data.fields;

        return {
            active:new BooleanField({initial:false}),
            description:new HTMLField({initial:''}),
            type:new StringField({initial:'passive'}),
            condition:new StringField({initial:''}),
            actives:new SchemaField({
                activation:new StringField({initial:''}),
                duree:new StringField({initial:''}),
                instant:new BooleanField({initial:true}),
                energie:new NumberField({initial:0, nullable:false, integer:true}),
                heroisme:new NumberField({initial:0, nullable:false, integer:true}),
                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                defense:new NumberField({initial:0, nullable:false, integer:true}),
                recuperation:new SchemaField({
                  PA:new BooleanField({initial:false}),
                  PS:new BooleanField({initial:false}),
                  PE:new BooleanField({initial:false}),
                }),
                jet:new SchemaField({
                  actif:new BooleanField({initial:false}),
                  isfixe:new BooleanField({initial:false}),
                  fixe:new SchemaField({
                    label:new StringField({initial:''}),
                    dice:new NumberField({initial:0, nullable:false, integer:true}),
                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                  }),
                  variable:new SchemaField({
                    caracteristiques:new ArrayField(new StringField()),
                  }),
                }),
                degats:new SchemaField({
                  actif:new BooleanField({initial:false}),
                  isfixe:new BooleanField({initial:true}),
                  fixe:new SchemaField({
                    dice:new NumberField({initial:0, nullable:false, integer:true}),
                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                  }),
                  variable:new SchemaField({
                    energie:new NumberField({initial:0, nullable:false, integer:true}),
                    paliers:new ArrayField(new StringField()),
                  }),
                  effets:new SchemaField({
                    raw:new ArrayField(new StringField()),
                    custom:new ArrayField(new ObjectField()),
                    liste:new ArrayField(new StringField()),
                  }),
                }),
                violence:new SchemaField({
                    actif:new BooleanField({initial:false}),
                    isfixe:new BooleanField({initial:true}),
                  fixe:new SchemaField({
                    dice:new NumberField({initial:0, nullable:false, integer:true}),
                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                  }),
                  variable:new SchemaField({
                    energie:new NumberField({initial:0, nullable:false, integer:true}),
                    paliers:new ArrayField(new StringField()),
                  }),
                  effets:new SchemaField({
                    raw:new ArrayField(new StringField()),
                    custom:new ArrayField(new ObjectField()),
                    liste:new ArrayField(new StringField()),
                  }),
                }),
                effets:new SchemaField({
                  actif:new BooleanField({initial:false}),
                  raw:new ArrayField(new StringField()),
                  custom:new ArrayField(new ObjectField()),
                  liste:new ArrayField(new StringField()),
                }),
                textarea:new SchemaField({
                  activation:new NumberField({initial:20, nullable:false, integer:true}),
                  duree:new NumberField({initial:20, nullable:false, integer:true}),
                }),
            }),
            passives:new SchemaField({
                sante:new BooleanField({initial:false}),
                contact:new SchemaField({
                    actif:new BooleanField({initial:false}),
                    value:new NumberField({initial:0, nullable:false, integer:true}),
                }),
                capacites:new SchemaField({
                    actif:new BooleanField({initial:false}),
                    ascension:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            permanent:new BooleanField({initial:false}),
                            prestige:new BooleanField({initial:false}),
                        }),
                    }),
                    cea:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            vague:new SchemaField({
                                degats:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                violence:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                effets:new SchemaField({
                                    liste:new ArrayField(new StringField()),
                                    raw:new ArrayField(new StringField(), {initial:['parasitage 6']}),
                                    custom:new ArrayField(new ObjectField()),
                                }),
                            }),
                            salve:new SchemaField({
                                degats:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                violence:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                effets:new SchemaField({
                                    liste:new ArrayField(new StringField()),
                                    raw:new ArrayField(new StringField(), {initial:['dispersion 12']}),
                                    custom:new ArrayField(new ObjectField()),
                                }),
                            }),
                            rayon:new SchemaField({
                                degats:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                violence:new SchemaField({
                                    dice:new NumberField({initial:5, nullable:false, integer:true}),
                                    fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                effets:new SchemaField({
                                    liste:new ArrayField(new StringField()),
                                    raw:new ArrayField(new StringField(), {initial:['ignorechampdeforce']}),
                                    custom:new ArrayField(new ObjectField()),
                                }),
                            }),
                        }),
                    }),
                    changeling:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            duree:new StringField({initial:''}),
                            energie:new SchemaField({
                                personnel:new NumberField({initial:0, nullable:false, integer:true}),
                            }),
                            odbonus:new NumberField({initial:1, nullable:false, integer:true}),
                            caracteristique:new NumberField({initial:2, nullable:false, integer:true}),
                            textarea:new NumberField({initial:20, nullable:false, integer:true}),
                        }),
                    }),
                    companions:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            deployables:new NumberField({initial:3, nullable:false, integer:true}),
                        })
                    }),
                    ghost:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            desactivation:new BooleanField({initial:false}),
                        }),
                    }),
                    goliath:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            taille:new SchemaField({
                                max:new NumberField({initial:10, nullable:false, integer:true}),
                            }),
                            malus:new SchemaField({
                                reaction:new SchemaField({
                                    value:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                                defense:new SchemaField({
                                    value:new NumberField({initial:0, nullable:false, integer:true}),
                                }),
                            }),
                        }),
                    }),
                    mechanic:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            bonus:new NumberField({initial:2, nullable:false, integer:true}),
                        }),
                    }),
                    morph:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            vol:new SchemaField({
                                description:new StringField({initial:''}),
                                textarea:new NumberField({initial:20, nullable:false, integer:true}),
                            }),
                            etirement:new SchemaField({
                                portee:new StringField({initial:''}),
                                textarea:new NumberField({initial:20, nullable:false, integer:true}),
                            }),
                            metal:new SchemaField({
                                bonus:new SchemaField({
                                    champDeForce:new NumberField({initial:8, nullable:false, integer:true}),
                                }),
                            }),
                            fluide:new SchemaField({
                                bonus:new SchemaField({
                                    reaction:new NumberField({initial:5, nullable:false, integer:true}),
                                    defense:new NumberField({initial:5, nullable:false, integer:true}),
                                }),
                            }),
                            polymorphie:new SchemaField({
                                description:new StringField({initial:''}),
                                griffe:new SchemaField({
                                    degats:new SchemaField({
                                        dice:new NumberField({initial:2, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    violence:new SchemaField({
                                        dice:new NumberField({initial:1, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    effets:new SchemaField({
                                        liste:new ArrayField(new StringField()),
                                        raw:new ArrayField(new StringField()),
                                        custom:new ArrayField(new ObjectField()),
                                    }),
                                }),
                                lame:new SchemaField({
                                    degats:new SchemaField({
                                        dice:new NumberField({initial:2, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    violence:new SchemaField({
                                        dice:new NumberField({initial:1, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:0, nullable:false, integer:true}),
                                    }),
                                    effets:new SchemaField({
                                        liste:new ArrayField(new StringField()),
                                        raw:new ArrayField(new StringField()),
                                        custom:new ArrayField(new ObjectField()),
                                    }),
                                }),
                                canon:new SchemaField({
                                    degats:new SchemaField({
                                        dice:new NumberField({initial:3, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:3, nullable:false, integer:true}),
                                    }),
                                    violence:new SchemaField({
                                        dice:new NumberField({initial:3, nullable:false, integer:true}),
                                        fixe:new NumberField({initial:3, nullable:false, integer:true}),
                                    }),
                                    effets:new SchemaField({
                                        liste:new ArrayField(new StringField()),
                                        raw:new ArrayField(new StringField()),
                                        custom:new ArrayField(new ObjectField()),
                                    }),
                                }),
                                textarea:new NumberField({initial:20, nullable:false, integer:true}),
                            }),
                        }),
                    }),
                    oriflamme:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            activation:new StringField({initial:'deplacement'}),
                            duree:new StringField({initial:''}),
                            portee:new StringField({initial:'longue'}),
                            energie:new NumberField({initial:6, nullable:false, integer:true}),
                            degats:new SchemaField({
                                dice:new NumberField({initial:8, nullable:false, integer:true}),
                                fixe:new NumberField({initial:12, nullable:false, integer:true}),
                            }),
                            violence:new SchemaField({
                                dice:new NumberField({initial:12, nullable:false, integer:true}),
                                fixe:new NumberField({initial:12, nullable:false, integer:true}),
                            }),
                            effets:new SchemaField({
                                liste:new ArrayField(new StringField()),
                                raw:new ArrayField(new StringField(), {initial:['antianatheme', 'lumiere 4']}),
                                custom:new ArrayField(new ObjectField()),
                            }),
                        })
                    }),
                    rage:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            colere:new SchemaField({
                                defense:new NumberField({initial:0, nullable:false, integer:true}),
                                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                                subis:new NumberField({initial:0, nullable:false, integer:true}),
                                combosInterdits:new SchemaField({
                                    has:new BooleanField({initial:false}),
                                }),
                            }),
                            rage:new SchemaField({
                                defense:new NumberField({initial:0, nullable:false, integer:true}),
                                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                                subis:new NumberField({initial:0, nullable:false, integer:true}),
                                combosInterdits:new SchemaField({
                                    has:new BooleanField({initial:false}),
                                }),
                            }),
                            fureur:new SchemaField({
                                defense:new NumberField({initial:0, nullable:false, integer:true}),
                                reaction:new NumberField({initial:0, nullable:false, integer:true}),
                                subis:new NumberField({initial:0, nullable:false, integer:true}),
                                combosInterdits:new SchemaField({
                                    has:new BooleanField({initial:false}),
                                }),
                            })
                        })
                    }),
                    type:new SchemaField({
                        actif:new BooleanField({initial:false}),
                    }),
                    vision:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            duree:new StringField({initial:''}),
                            energie:new SchemaField({
                                changer:new NumberField({initial:0, nullable:false, integer:true}),
                            }),
                            textarea:new NumberField({initial:20, nullable:false, integer:true}),
                        }),
                    }),
                    warlord:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            activer:new BooleanField({initial:false}),
                            prolonger:new BooleanField({initial:false}),
                        }),
                    }),
                }),
                special:new SchemaField({
                    recolteflux:new SchemaField({
                        actif:new BooleanField({initial:false}),
                        update:new SchemaField({
                            conflit:new SchemaField({
                                base:new NumberField({initial:10, nullable:false, integer:true}),
                                tour:new NumberField({initial:5, nullable:false, integer:true}),
                            }),
                            horsconflit:new SchemaField({
                                base:new NumberField({initial:10, nullable:false, integer:true}),
                            }),
                        })
                    }),
                    contrecoups:new SchemaField({
                        actif:new BooleanField({initial:false}),
                    }),
                }),
            }),
        }
    }

    get actor() {
        return this.item?.actor;
    }

    get item() {
        return this.parent;
    }

    prepareBaseData() {
        if(this.actives.instant) {
          Object.defineProperty(this, 'active', {
            value: false,
            writable:true,
            enumerable:true,
            configurable:true
          });
        }
	}

	prepareDerivedData() {

    }

    async activate() {
        const label = this.item.name;
        const isActive = this.active;
        const dataCU = this.actives;
        const isInstant = dataCU.instant;
        const energie = dataCU.energie;
        const heroisme = dataCU.heroisme;
        const dataActor = this.actor.system;
        const actorHeroisme = dataActor?.heroisme?.value ?? 0;
        let update = {};
        let updateActor = {};

        if(!isActive) {
            const useHeroisme = await this.useHeroismeActivate();

            if(!useHeroisme) return;

            const usePE = await this.usePEActivate();

            if(!usePE) return;
        }

        if(isActive && !isInstant) update[`system.active`] = false;
        else if(!isActive && !isInstant) update[`system.active`] = true;

        if(!isActive) {
            if(dataCU.recuperation.PA) updateActor[`system.armure.value`] = dataActor.armure.max;
            if(dataCU.recuperation.PS) updateActor[`system.sante.value`] = dataActor.sante.max;
            if(dataCU.recuperation.PE) updateActor[`system.energie.value`] = dataActor.energie.max;

            if(dataCU.jet.actif && dataCU.jet.isfixe) {
                const roll = new game.knight.RollKnight(this.actor, {
                    name:`${label}`,
                    dices:`${dataCU.jet.fixe.dice}D6+${dataCU.jet.fixe.fixe}`,
                }, false);

                const rTotal = await roll.doRoll();
            }

            if(dataCU.dgts.actif && dataCU.dgts.isfixe) {
                const roll = new game.knight.RollKnight(this.actor, {
                    name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
                    dices:`${dataCU.dgts.fixe.dice}D6+${dataCU.dgts.fixe.fixe}`,
                }, false);
                const weapon = roll.prepareWpnDistance({
                    name:label,
                    system:{
                    degats:{dice:dataCU.dgts.fixe.dice, fixe:dataCU.dgts.fixe.fixe},
                    violence:{dice:0, fixe:0},
                    effets:dataCU.dgts.effets,
                    }
                });
                const options = weapon.options;

                for(let o of options) {
                    o.active = true;
                }
                const flags = roll.getRollData(weapon)
                roll.setWeapon(weapon);

                await roll.doRollDamage(flags);
            }

            if(dataCU.viol.actif && dataCU.viol.isfixe) {
                const roll = new game.knight.RollKnight(this.actor, {
                    name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
                    dices:`${dataCU.viol.fixe.dice}D6+${dataCU.viol.fixe.fixe}`,
                }, false);
                const weapon = roll.prepareWpnDistance({
                    name:label,
                    system:{
                    degats:{dice:0, fixe:0},
                    violence:{dice:dataCU.viol.fixe.dice, fixe:dataCU.viol.fixe.fixe},
                    effets:dataCU.viol.effets,
                    }
                });
                const options = weapon.options;

                for(let o of options) {
                    o.active = true;
                }
                const flags = roll.getRollData(weapon)
                roll.setWeapon(weapon);

                await roll.doRollViolence(flags);
            }

            if(dataCU.effets.actif) {
                const roll = new game.knight.RollKnight(this.actor, {
                    name:`${label}`,
                    dices:`0D6`,
                }, false);

                const rTotal = await roll.doRoll({}, dataCU.effets);
            }
        }

        if(!foundry.utils.isEmpty(update)) this.item.update(update);
        if(!foundry.utils.isEmpty(updateActor)) this.actor.update(updateActor);
    }

    async roll(special, variant = '') {
        const actor = this.actor;
        const label = this.item.name;
        const dataCU = this.actives;
        const dataRoll = dataCU[special]
        let energieBonus = 0;

        if(!dataRoll.isfixe) {
            const useHeroisme = await this.useHeroismeActivate();

            if(!useHeroisme) return;

            if(special === 'degats' || special === 'violence') {
                energieBonus = dataRoll.variable.energie*(variant+1)
            }

            const usePE = await this.usePEActivate(energieBonus);

            if(!usePE) return;

            switch(special) {
                case 'jet':
                    const id = this.actor.token ? this.actor.token.id : this.actor.id;

                    const dialog = new game.knight.applications.KnightRollDialog(id, {
                        label:label,
                        base:dataRoll.variable.caracteristiques[variant],
                    });

                    dialog.open();
                    break;

                case 'degats':
                case 'violence':
                    const paliersRoll = dataRoll.variable.paliers[variant];
                    const split = paliersRoll.split('D6+')
                    const rollDice = Number(split[0]);
                    const rollFixe = Number(split[1]);
                    const rollApply = {dice:rollDice, fixe:rollFixe};
                    const rollSimple = {dice:0, fixe:0};

                    const rRoll = new game.knight.RollKnight(actor, {
                        name:`${label} : ${game.i18n.localize(`KNIGHT.AUTRE.${capitalizeFirstLetter(special)}`)}`,
                    }, false);
                    const wpn = rRoll.prepareWpnDistance({
                        name:label,
                        system:{
                            degats:special === 'degats' ? rollApply : rollSimple,
                            violence:special === 'violence' ? rollApply : rollSimple,
                            effets:dataRoll.effets,
                        }
                    });
                    const optionsWpn = wpn.options;

                    for(let o of optionsWpn) {
                        o.active = true;
                    }
                    const flagsWpn = rRoll.getRollData(wpn)
                    rRoll.setWeapon(wpn);

                    if(special === 'degats') await rRoll.doRollDamage(flagsWpn);
                    else await rRoll.doRollViolence(flagsWpn);
                    break;
            }
        }
    }

    async ascension() {
        const actor = this.actor;
        const armure = actor.system.dataArmor;
        const isPermanent = this.passives.capacites.ascension.update.permanent;
        const isPrestige = this.passives.capacites.ascension.update.prestige;
        const name = game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.Label');

        const exist = Array.from(game.actors).find(actors => actors.id === armure.system.capacites.selected.ascension.ascensionId);

        if(!exist && isPermanent) {
            let data = actor.system;
            data.wear = "armure";
            data.isAscension = true;
            data.proprietaire = context._id;
            let clone = foundry.utils.deepClone(actor);
            let newActor = await Actor.create(clone);

            let update = {};
            update['name'] = `${name} : ${actor.name}`;
            update['img'] = armure.img;
            update['system.wear'] = "ascension";
            update['system.equipements.ascension'] = actor.system.equipements.armure;

            if(!isPrestige) {
                for(let item of newActor.items) {
                    const rareteWpn = item.system?.rarete ?? '';
                    const rareteMdl = item.system?.niveau?.actuel?.rarete ?? '';

                    if(((rareteWpn === 'prestige' || rareteMdl === 'prestige') && !prestige) || item.type === 'capaciteultime') item.delete();
                }
            }

            newActor.update(update);
            armure.update({[`system.capacites.selected.ascension`]:{
                ascensionId:newActor.id
            }});

        } else if(isPermanent) {
            let clone = foundry.utils.deepClone(actor);

            const update = {};
            update['name'] = `${name} : ${actor.name}`;
            update['system'] = clone.system;
            update['img'] = armure.img;
            update['system.wear'] = "ascension";
            update['system.equipements.ascension'] = this.actor.system.equipements.armure;

            exist.update(update);

            let ascension = exist.items.find(items => items.type === 'armure');

            for(let item of exist.items) {
                await item.delete();
            }

            for(let item of actor.items) {
                const rareteWpn = item.system?.rarete ?? '';
                const rareteMdl = item.system?.niveau?.actuel?.rarete ?? '';
                if(((rareteWpn === 'prestige' || rareteMdl === 'prestige') && !prestige) || item.type === 'capaciteultime') continue;

                await Item.create(foundry.utils.deepClone(item), {parent: exist});
            }

            for(let item of exist.items.filter(items => items.type === 'armure')) {
                let itmUpdate = {};
                itmUpdate['system'] = ascension.system;
                itmUpdate['system.jauges.sante'] = false;
                itmUpdate['system.jauges.espoir'] = false;
                itmUpdate['system.jauges.heroisme'] = false;

                item.update(itmUpdate)
            }
        }
    }

    async usePEActivate(toAdd = 0, forceEspoir = false) {
        const actor = this.actor;
        const armure = actor.system.dataArmor;
        const label = this.item.name;

        const remplaceEnergie = armure?.espoirRemplaceEnergie ?? false;
        const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';

        const value = Number(actor?.system?.[getType]?.value ?? 0);
        const espoir = Number(actor?.system?.espoir?.value ?? 0);

        const sendLackMsg = async (i18nKey) => {
          const payload = {
            flavor: `${label}`,
            main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
          };
          const data = {
            user: game.user.id,
            speaker: {
              actor: actor?.id ?? null,
              token: actor?.token?.id ?? null,
              alias: actor?.name ?? null,
            },
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
            sound: CONFIG.sounds.dice
          };
          const rMode = game.settings.get("core", "rollMode");
          const msgData = ChatMessage.applyRollMode(data, rMode);
          await ChatMessage.create(msgData, { rollMode: rMode });
        };

        const isFinite = (number, defaut = 0) => {
          return Number.isFinite(number) ? number : defaut;
        }

        let depenseEnergie = this.actives.energie + toAdd;
        let depenseEspoir = 0;
        let substractEnergie = 0;
        let substractEspoir = 0;

        if(remplaceEnergie) depenseEnergie += depenseEspoir;

        substractEnergie = value - depenseEnergie;
        substractEspoir = espoir - depenseEspoir;
        if(substractEnergie < 0) {
          await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

          return false;
        } else if(substractEspoir < 0 && !remplaceEnergie) {
          await sendLackMsg(`Notespoir`);

          return false;
        } else {
          let pbE = new PatchBuilder();

          if(!remplaceEnergie) pbE.sys(`equipements.${actor.system.wear}.${getType}.value`, substractEnergie);
          else if(remplaceEnergie && !actor.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

          if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

          await pbE.applyTo(actor);

          return true;
        }
    }

    async useHeroismeActivate() {
        const actor = this.actor;
        const label = this.item.name;
        const dataCU = this.actives;
        const heroisme = dataCU?.heroisme ?? 0;
        const actorHeroisme = dataActor?.heroisme?.value ?? 0;
        const newValue = actorHeroisme - heroisme;

        if(newValue < 0) {
            const msgHeroisme = {
                flavor:`${label}`,
                main:{
                total:`${game.i18n.localize('KNIGHT.JETS.Notheroisme')}`
                }
            };

            const msgHeroismeData = {
                user: game.user.id,
                speaker: {
                actor: actor?.id || null,
                token: actor?.token?.id || null,
                alias: actor?.name || null,
                },
                style: CONST.CHAT_MESSAGE_STYLES.OTHER,
                content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgHeroisme),
                sound: CONFIG.sounds.dice
            };

            const rMode = game.settings.get("core", "rollMode");
            const msgFData = ChatMessage.applyRollMode(msgHeroismeData, rMode);

            await ChatMessage.create(msgFData, {
                rollMode:rMode
            });

            return false;
        } else {
            let pbE = new PatchBuilder();
            pbE.sys('heroisme.value', newValue);
            await pbE.applyTo(actor);

            return true;
        }
    }
}