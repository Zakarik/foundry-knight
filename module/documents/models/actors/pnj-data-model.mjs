import {
  getFlatEffectBonus,
} from "../../../helpers/common.mjs";
import { AspectsNPCDataModel } from '../parts/aspects-npc-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { GrenadesDataModel } from '../parts/grenades-data-model.mjs';
import { NodsDataModel } from '../parts/nods-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { Phase2DataModel } from '../parts/phase2-data-model.mjs';

export class PNJDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
  const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

      return {
        age:new StringField({ initial: ""}),
        archetype:new StringField({ initial: ""}),
        metaarmure:new StringField({ initial: ""}),
        blason:new StringField({ initial: ""}),
        surnom:new StringField({initial:""}),
        section:new StringField({initial:""}),
        hautfait:new StringField({initial:""}),
        type:new StringField({initial:""}),
        histoire:new HTMLField({initial:""}),
        description:new HTMLField({initial:""}),
        descriptionLimitee:new HTMLField({initial:""}),
        tactique:new HTMLField({initial:""}),
        pointsFaibles:new HTMLField({initial:""}),
        aspects:new EmbeddedDataField(AspectsNPCDataModel),
        bouclier:new EmbeddedDataField(DefensesDataModel),
        champDeForce:new EmbeddedDataField(DefensesDataModel),
        defense:new EmbeddedDataField(DefensesDataModel),
        reaction:new EmbeddedDataField(DefensesDataModel),
        egide:new EmbeddedDataField(DefensesDataModel),
        phase2:new EmbeddedDataField(Phase2DataModel),
        phase2Activate:new BooleanField({initial:false}),
        initiative:new EmbeddedDataField(InitiativeDataModel),
        configurationActive:new StringField({initial:""}),
        wolf:new ObjectField({}),
        jetsSpeciaux:new ArrayField(new ObjectField({})),
        colosse:new BooleanField({initial:false}),
        patron:new BooleanField({initial:false}),
        armure: new SchemaField({
            base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
            bonusValue:new NumberField({initial:0, nullable:false, integer:true}),
            malusValue:new NumberField({initial:0, nullable:false, integer:true}),
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:0, nullable:false, integer:true}),
            bonus:new ObjectField({
              initial:{
                user:0,
              }
            }),
            malus:new ObjectField({
              initial:{
                user:0,
              }
            }),
        }),
        art: new SchemaField({
            oeuvres:new ObjectField(),
        }),
        combat:new SchemaField({
            armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
            grenades:new EmbeddedDataField(GrenadesDataModel),
            nods:new EmbeddedDataField(NodsDataModel),
            data:new SchemaField({
                degatsbonus:new SchemaField({
                    dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                    fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
                violencebonus:new SchemaField({
                    dice:new NumberField({ initial: 0, integer: true, nullable: false }),
                    fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
                modificateur:new NumberField({ initial: 0, integer: true, nullable: false }),
                sacrifice:new NumberField({ initial: 0, integer: true, nullable: false }),
                succesbonus:new NumberField({ initial: 0, integer: true, nullable: false }),
                tourspasses:new NumberField({ initial: 1, integer: true, nullable: false }),
                type:new StringField({ initial: "degats"}),
            }),
        }),
        equipements:new SchemaField({
            armure:new SchemaField({
                capacites:new SchemaField({
                    ascension:new SchemaField({
                        id:new StringField({initial:"0", nullable:true}),
                        energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    borealis:new SchemaField({
                        allie:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    changeling:new SchemaField({
                        fauxetres:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    companions:new SchemaField({
                        type:new StringField({initial:"", nullable:true}),
                        energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                        energieDisponible:new ArrayField(new NumberField()),
                    }),
                    forward:new NumberField({ initial: 1, integer: true, nullable: false }),
                    goliath:new SchemaField({
                        metre:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    morph:new SchemaField({
                        nbre:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    puppet:new SchemaField({
                        cible:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    rage:new SchemaField({
                        niveau:new ObjectField(),
                    }),
                    totem:new SchemaField({
                        nombre:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    vision:new SchemaField({
                        energie:new NumberField({ initial: 0, integer: true, nullable: false }),
                    }),
                    warlord:new SchemaField({
                        energie:new SchemaField({
                            nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                        }),
                        esquive:new SchemaField({
                            nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                        }),
                        force:new SchemaField({
                            nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                        }),
                        guerre:new SchemaField({
                            nbre:new NumberField({ initial: 1, integer: true, nullable: false }),
                        }),
                    }),
                }),
                special:new SchemaField({
                    contrecoups:new NumberField({ initial: 0, integer: true, nullable: false }),
                    flux:new NumberField({ initial: 1, integer: true, nullable: false }),
                    impregnation:new NumberField({ initial: 0, integer: true, nullable: false }),
                }),
            }),
        }),
        sante:new SchemaField({
            base:new NumberField({initial:0, nullable:false, integer:true}),
            mod:new NumberField({initial:0, nullable:false, integer:true}),
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:16, nullable:false, integer:true}),
            bonus:new ObjectField({
                initial:{
                  user:0,
                }
            }),
              malus:new ObjectField({
                initial:{
                  user:0,
                }
            }),
        }),
        espoir:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:50, nullable:false, integer:true}),
        }),
        resilience:new SchemaField({
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:50, nullable:false, integer:true}),
        }),
        energie:new SchemaField({
            base:new NumberField({initial:0, nullable:false, integer:true}),
            mod:new NumberField({initial:0, nullable:false, integer:true}),
            value:new NumberField({initial:0, nullable:false, integer:true}),
            max:new NumberField({initial:16, nullable:false, integer:true}),
            bonus:new ObjectField({
                initial:{
                  user:0,
                }
            }),
              malus:new ObjectField({
                initial:{
                  user:0,
                }
            }),
        }),
        bonusSiEmbuscade:new SchemaField({
          bonusInitiative:new SchemaField({
            dice:new NumberField({ initial: 0, integer: true, nullable: false }),
            fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
          }),
        }),
        options:new SchemaField({
            armure:new BooleanField({initial:true, nullable:false}),
            bouclier:new BooleanField({initial:true, nullable:false}),
            champDeForce:new BooleanField({initial:true, nullable:false}),
            energie:new BooleanField({initial:true, nullable:false}),
            espoir:new BooleanField({initial:true, nullable:false}),
            modules:new BooleanField({initial:false, nullable:false}),
            notFirstMenu:new BooleanField({initial:false, nullable:false}),
            noSecondMenu:new BooleanField({initial:false, nullable:false}),
            phase2:new BooleanField({initial:true, nullable:false}),
            resilience:new BooleanField({initial:true, nullable:false}),
            sante:new BooleanField({initial:true, nullable:false}),
            embuscadeSubis:new BooleanField({initial:false, nullable:false}),
            embuscadePris:new BooleanField({initial:false, nullable:false}),
            wolfConfiguration:new BooleanField({initial:false, nullable:false}),
            jetsSpeciaux:new BooleanField({initial:false, nullable:false}),
        }),
      }
  }

  get aspect() {
    let data = {}

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
        data[a] = {
            value:this.aspects[a].value,
            mineur:this.aspects[a].ae.mineur.value,
            majeur:this.aspects[a].ae.majeur.value,
        }
    }

    return data;
  }

  get items() {
      return this.parent.items;
  }

  get armes() {
      return this.items.filter(items => items.type === 'arme');
  }

  get modules() {
      return this.items.filter(items => items.type === 'module');
  }

  get capacites() {
      return this.items.filter(items => items.type === 'capacite');
  }

  get dataArmor() {
      return this.items.find(items => items.type === 'armure');
  }

  prepareBaseData() {
    this.#armes();
    this.#modules();
    this.#capacites();
	}

	prepareDerivedData() {
    this.#derived();
    this.#defenses();
  }

  #armes() {
    const armes = this.armes;
    let defenseBonus = 0;
    let defenseMalus = 0;
    let reactionBonus = 0;
    let reactionMalus = 0;
    let champDeForce = 0;

    for(let a of armes) {
        const effets = getFlatEffectBonus(a);

        defenseBonus += effets.defense.bonus;
        defenseMalus += effets.defense.malus;
        reactionBonus += effets.reaction.bonus;
        reactionMalus += effets.reaction.malus;
        champDeForce += effets.cdf.bonus;
    }

    if(defenseBonus > 0) {
        Object.defineProperty(this.defense.bonus, 'armes', {
            value: defenseBonus,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    if(defenseMalus > 0) {
        Object.defineProperty(this.defense.malus, 'armes', {
            value: defenseMalus,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    if(reactionBonus > 0) {
        Object.defineProperty(this.reaction.bonus, 'armes', {
            value: reactionBonus,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    if(reactionMalus > 0) {
        Object.defineProperty(this.reaction.malus, 'armes', {
            value: reactionMalus,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    if(champDeForce > 0) {
        Object.defineProperty(this.champDeForce.bonus, 'armes', {
            value: champDeForce,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }
  }

  #modules() {
      const data = this.modules;
      let santeBonus = 0;
      let armureBonus = 0;
      let champDeForceBonus = 0;
      let energieBonus = 0;
      let defenseBonus = 0;
      let reactionBonus = 0;

      let santeMalus = 0;
      let armureMalus = 0;
      let champDeForceMalus = 0;
      let energieMalus = 0;
      let defenseMalus = 0;
      let reactionMalus = 0;

      const actuel = data.filter(itm => itm.system.active.base || (itm.system?.niveau?.actuel?.permanent ?? false));

      for(let m of actuel) {
          const system = m.system?.niveau?.actuel ?? {};
          const effets = system?.effets ?? {has:false};
          const bonus = system?.bonus || {has:false};
          const arme = system?.arme || {has:false};

          if(effets.has) {
              const bDefense = effets.raw.find(str => { if(str.includes('defense')) return str; });
              const bReaction = effets.raw.find(str => { if(str.includes('reaction')) return str; });

              if(bDefense) defenseBonus += parseInt(bDefense.split(' ')[1]);
              if(bReaction) reactionBonus += parseInt(bReaction.split(' ')[1]);
          }

          if(bonus.has) {
              const bSante = bonus?.sante?.has ?? false;
              const bArmure = bonus?.armure?.has ?? false;
              const bChampDeForce = bonus?.champDeForce?.has ?? false;
              const bEnergie = bonus?.energie?.has ?? false;

              if(bSante) santeBonus += bonus?.sante?.value ?? 0;
              if(bArmure) armureBonus += bonus?.armure?.value ?? 0;
              if(bChampDeForce) champDeForceBonus += bonus?.champDeForce?.value ?? 0;
              if(bEnergie) energieBonus += bonus?.energie?.value ?? 0;
          }

          if(arme.has) {
              const armeEffets = getFlatEffectBonus(arme, true);

              defenseBonus += armeEffets.defense.bonus;
              defenseMalus += armeEffets.defense.malus;

              reactionBonus += armeEffets.reaction.bonus;
              reactionMalus += armeEffets.reaction.malus;

              champDeForceBonus += armeEffets.cdf.bonus;
          }
      }

      if(santeBonus > 0) {
          Object.defineProperty(this.sante.bonus, 'module', {
              value: santeBonus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(santeMalus > 0) {
          Object.defineProperty(this.sante.malus, 'module', {
              value: santeMalus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(armureBonus > 0) {
          Object.defineProperty(this.armure.bonus, 'module', {
              value: armureBonus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(armureMalus > 0) {
          Object.defineProperty(this.armure.malus, 'module', {
              value: armureMalus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(champDeForceBonus > 0) {
          Object.defineProperty(this.champDeForce.bonus, 'module', {
              value: champDeForceBonus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(champDeForceMalus > 0) {
          Object.defineProperty(this.champDeForce.malus, 'module', {
              value: champDeForceMalus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(energieBonus > 0) {
          Object.defineProperty(this.energie.bonus, 'module', {
              value: energieBonus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(energieMalus > 0) {
          Object.defineProperty(this.energie.malus, 'module', {
              value: energieMalus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(defenseBonus > 0) {
          Object.defineProperty(this.defense.bonus, 'module', {
              value: defenseBonus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(defenseMalus > 0) {
          Object.defineProperty(this.defense.malus, 'module', {
              value: defenseMalus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(reactionBonus > 0) {
          Object.defineProperty(this.reaction.bonus, 'module', {
              value: reactionBonus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }

      if(reactionMalus > 0) {
          Object.defineProperty(this.reaction.malus, 'module', {
              value: reactionMalus,
              writable:true,
              enumerable:true,
              configurable:true
          });
      }
  }

  #capacites() {
    const capacites = this.capacites;
    let sante = 0;
    let armure = 0;
    let aspectsMax = [];

    for(let c of capacites) {
      const system = c.system;

      if(!system.isPhase2 || (system.isPhase2 && this.phase2Activate)) {
        if(system.bonus.sante.has) {
          if(system.bonus.sante.aspect.lie) sante += (this.aspects[system.bonus.sante.aspect.value].value*system.bonus.sante.aspect.multiplie);
          else sante += system.bonus.sante.value;
        }

        if(system.bonus.armure.has) {
          if(system.bonus.armure.aspect.lie) armure += (this.aspects[system.bonus.armure.aspect.value].value*system.bonus.armure.aspect.multiplie);
          else armure += system.bonus.armure.value;
        }

        if(system.bonus.aspectMax.has) {
          aspectsMax.push({
            key:system.bonus.aspectMax.aspect,
            aspect:system.bonus.aspectMax.maximum.aspect,
            ae:system.bonus.aspectMax.maximum.ae,
          });
        }
      }
    }

    Object.defineProperty(this.sante.bonus, 'capacites', {
        value: sante,
        writable:true,
        enumerable:true,
        configurable:true
    });

    Object.defineProperty(this.armure.bonus, 'capacites', {
        value: armure,
        writable:true,
        enumerable:true,
        configurable:true
    });

    for(let a of aspectsMax) {
      Object.defineProperty(this.aspects[a.key], 'max', {
        value: a.aspect,
      });

      Object.defineProperty(this.aspects[a.key].ae.mineur, 'max', {
        value: a.ae,
      });

      Object.defineProperty(this.aspects[a.key].ae.majeur, 'max', {
        value: a.ae,
      });
    }

    if(this.dataArmor) {
        const capacites = this.dataArmor.system.capacites.selected;
        const whatAffect = this.energie;

        //ON CHECK TOUTES LES CAPACITES POUR APPLIQUER LES EFFETS DES CAPACITES ACTIVES
        for(let c in capacites) {
            const data = capacites[c];

            switch(c) {
                case 'ascension':
                    if(data.active) {
                        Object.defineProperty(whatAffect.malus, c, {
                            value: data.depense,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                    break;
                case 'companions':
                    if(data?.active?.base ?? false) {
                        const lion = data?.lion?.id ?? undefined;
                        const wolf = data?.wolf?.id?.id1 ?? undefined;
                        const crow = data?.crow?.id ?? undefined;
                        let depense = 0;

                        if(lion) {
                            if(game.actors.get(lion)) depense = game.actors.get(lion).system.energie.base;
                        }

                        if(wolf) {
                            if(game.actors.get(wolf)) depense = game.actors.get(wolf).system.energie.base;
                        }

                        if(crow) {
                            if(game.actors.get(crow)) depense = game.actors.get(crow).system.energie.base;
                        }

                        Object.defineProperty(whatAffect.malus, c, {
                            value: depense,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                    break;
                case 'shrine':
                    if(data.active && (data?.active?.personnel ?? false)) {
                        Object.defineProperty(this.champDeForce.bonus, c, {
                            value: data.champdeforce,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                    break;
                case 'goliath':
                    if(data.active) {
                        Object.defineProperty(this.champDeForce.bonus, c, {
                            value: this.equipements.armure.capacites.goliath.metre*data.bonus.cdf.value,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });

                        Object.defineProperty(this.reaction.malus, c, {
                            value: this.equipements.armure.capacites.goliath.metre*data.malus.reaction.value,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });

                        Object.defineProperty(this.defense.malus, c, {
                            value: this.equipements.armure.capacites.goliath.metre*data.malus.defense.value,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                    break;
                case 'morph':
                    if(data?.choisi?.metal ?? false) {
                        Object.defineProperty(this.champDeForce.bonus, c, {
                            value: data.metal.bonus.champDeForce,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }

                    if(data?.choisi?.fluide ?? false) {
                        Object.defineProperty(this.reaction.bonus, c, {
                            value: data.fluide.bonus.reaction,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });

                        Object.defineProperty(this.defense.bonus, c, {
                            value: data.fluide.bonus.defense,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                    break;
                case 'rage':
                    if(data.active) {
                        if(data?.niveau?.colere ?? false) {
                            Object.defineProperty(this.egide.bonus, c, {
                                value: data.colere.egide,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.reaction.malus, c, {
                                value: data.colere.reaction,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.malus, c, {
                                value: data.colere.defense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }

                        if(data?.niveau?.rage ?? false) {
                            Object.defineProperty(this.egide.bonus, c, {
                                value: data.rage.egide,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.reaction.malus, c, {
                                value: data.rage.reaction,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.malus, c, {
                                value: data.rage.defense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }

                        if(data?.niveau?.fureur ?? false) {
                            Object.defineProperty(this.egide.bonus, c, {
                                value: data.fureur.egide,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.reaction.malus, c, {
                                value: data.fureur.reaction,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });

                            Object.defineProperty(this.defense.malus, c, {
                                value: data.fureur.defense,
                                writable:true,
                                enumerable:true,
                                configurable:true
                            });
                        }
                    }
                    break;
                case 'warlord':
                    if(data?.active?.esquive?.porteur ?? false) {
                        Object.defineProperty(this.reaction.bonus, c, {
                            value: data.impulsions.esquive.bonus.reaction,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });

                        Object.defineProperty(this.defense.bonus, c, {
                            value: data.impulsions.esquive.bonus.defense,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }

                    if(data?.active?.force?.porteur ?? false) {
                        Object.defineProperty(this.champDeForce.bonus, c, {
                            value: data.impulsions.force.bonus.champDeForce,
                            writable:true,
                            enumerable:true,
                            configurable:true
                        });
                    }
                    break;
            }
        }
    }
  }

  #derived() {
    const list = CONFIG.KNIGHT.LIST.pnj;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = Object.values(system.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malus = Object.values(system.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, 'mod', {
        value: bonus-malus,
      });

      Object.defineProperty(system, update, {
        value: Math.max(base+this[d].mod, 0),
      });
    }

    // INITIATIVE
    if(this.aspect.masque.majeur > 0) {
      Object.defineProperty(this.initiative, 'base', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'dice', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'value', {
          value: 30,
      });
    } else {
      let initiativeDice = this.initiative.diceBase;
      let initiativeBonus = this?.initiative?.bonus?.user ?? 0;
      let initiativeMalus = this?.initiative?.malus?.user ?? 0;

      const hasEmbuscadeSubis = this.options.embuscadeSubis;
      const hasEmbuscadePris = this.options.embuscadePris;

      if(hasEmbuscadeSubis) {
        const bonusDice = this.bonusSiEmbuscade.bonusInitiative.dice;
        const bonusFixe = this.bonusSiEmbuscade.bonusInitiative.fixe;

        initiativeDice += bonusDice;
        initiativeBonus += bonusFixe;
      }

      if(hasEmbuscadePris) {
        initiativeBonus += 10;
      }

      Object.defineProperty(this.initiative, 'base', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'diceMod', {
          value: 0,
      });

      Object.defineProperty(this.initiative, 'mod', {
          value: initiativeBonus-initiativeMalus,
      });

      this.initiative.prepareData();
    }
  }

  #defenses() {
      const defenses = ['defense', 'reaction'];

      for(let d of defenses) {
          const aspect = this.aspect[CONFIG.KNIGHT.LIST.derived[d]];

          const base = this[d].base;
          const bonus = this[d]?.bonus?.user ?? 0;
          const malus = this[d]?.malus?.user ?? 0;

          Object.defineProperty(this[d], 'mod', {
              value: bonus-malus+aspect.value+aspect.mineur+aspect.majeur,
          });

          Object.defineProperty(this[d], 'value', {
              value: Math.max(base+this[d].mod, 0),
          });
      }
  }
}