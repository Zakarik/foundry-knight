import { AspectsNPCDataModel } from '../parts/aspects-npc-data-model.mjs';
import { ArmesImproviseesDataModel } from '../parts/armesimprovisees-data-model.mjs';
import { DefensesDataModel } from '../parts/defenses-data-model.mjs';
import { InitiativeDataModel } from '../parts/initiative-data-model.mjs';
import { Phase2DataModel } from '../parts/phase2-data-model.mjs';import {
  getFlatEffectBonus,
} from "../../../helpers/common.mjs";

export class CreatureDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {SchemaField, EmbeddedDataField, StringField, NumberField, BooleanField, ObjectField, ArrayField, HTMLField} = foundry.data.fields;

    return {
      version:new NumberField({initial:0, nullable:false, integer:true}),
        type:new StringField({initial:""}),
        histoire:new HTMLField({initial:""}),
        description:new HTMLField({initial:""}),
        descriptionLimitee:new HTMLField({initial:""}),
        tactique:new HTMLField({initial:""}),
        pointsFaibles:new HTMLField({initial:""}),
        colosse:new BooleanField({initial:false}),
        patron:new BooleanField({initial:false}),
        armure: new SchemaField({
            base:new NumberField({initial:0, min:0, nullable:false, integer:true}),
            mod:new NumberField({initial:0, nullable:false, integer:true}),
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
        aspects:new EmbeddedDataField(AspectsNPCDataModel),
        combat:new SchemaField({
            armesimprovisees:new EmbeddedDataField(ArmesImproviseesDataModel),
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
        bouclier:new EmbeddedDataField(DefensesDataModel),
        defense:new EmbeddedDataField(DefensesDataModel),
        reaction:new EmbeddedDataField(DefensesDataModel),
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
        phase2:new EmbeddedDataField(Phase2DataModel),
        phase2Activate:new BooleanField({initial:false}),
        initiative:new EmbeddedDataField(InitiativeDataModel),
        bonusSiEmbuscade:new SchemaField({
          bonusInitiative:new SchemaField({
            dice:new NumberField({ initial: 0, integer: true, nullable: false }),
            fixe:new NumberField({ initial: 0, integer: true, nullable: false }),
          }),
        }),
        options:new SchemaField({
            armure:new BooleanField({initial:true, nullable:false}),
            bouclier:new BooleanField({initial:true, nullable:false}),
            energie:new BooleanField({initial:true, nullable:false}),
            notFirstMenu:new BooleanField({initial:false, nullable:false}),
            noSecondMenu:new BooleanField({initial:false, nullable:false}),
            phase2:new BooleanField({initial:true, nullable:false}),
            resilience:new BooleanField({initial:true, nullable:false}),
            sante:new BooleanField({initial:true, nullable:false}),
            embuscadeSubis:new BooleanField({initial:false, nullable:false}),
            embuscadePris:new BooleanField({initial:false, nullable:false}),
        }),
    }
  }

  get items() {
      return this.parent.items;
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

  get armes() {
      return this.items.filter(items => items.type === 'arme');
  }

  get capacites() {
      return this.items.filter(items => items.type === 'capacite');
  }

  static migrateData(source) {
      if(source.version < 1) {
          const mods = ['armure', 'sante', 'energie', 'bouclier', 'reaction', 'defense', 'initiative'];

          for(let m of mods) {
            if(!source[m]) continue;

              for(let b in source[m].bonus) {
                  source[m].bonus[b] = 0;
              }

              for(let b in source[m].malus) {
                  source[m].malus[b] = 0;
              }
          }

          for(let i in source.initiative.diceBonus) {
              source.initiative.diceBonus[i] = 0;
          }

          for(let i in source.initiative.diceMalus) {
              source.initiative.diceMalus[i] = 0;
          }

          for(let i in source.initiative.embuscade.diceBonus) {
              source.initiative.embuscade.diceBonus[i] = 0;
          }

          for(let i in source.initiative.embuscade.diceMalus) {
              source.initiative.embuscade.diceMalus[i] = 0;
          }

          for(let i in source.initiative.embuscade.bonus) {
              source.initiative.embuscade.bonus[i] = 0;
          }

          for(let i in source.initiative.embuscade.malus) {
              source.initiative.embuscade.malus[i] = 0;
          }

          source.version = 1;
      }

      return super.migrateData(source);
  }

  prepareBaseData() {
    this.#armes();
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
  }

  #derived() {
    const list = CONFIG.KNIGHT.LIST.creatures;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = system?.bonus?.user ?? 0;
      const malus = system?.malus?.user ?? 0;
      const update = CONFIG.KNIGHT.LIST.hasMax[d] ? 'max' : 'value';

      Object.defineProperty(system, 'mod', {
        value: bonus-malus,
      });

      Object.defineProperty(system, update, {
        value: Math.max(base+bonus-malus, 0),
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
          value: this.initiative.diceBase,
      });

      Object.defineProperty(this.initiative, 'dice', {
          value: Math.max(initiativeDice, 1),
      });

      Object.defineProperty(this.initiative, 'value', {
          value: Math.max(initiativeBonus-initiativeMalus, 0),
      });
    }

    Object.defineProperty(this.initiative, 'complet', {
        value: `${this.initiative.dice}D6+${this.initiative.value}`,
    });
  }

  #defenses() {
      const defenses = ['defense', 'reaction'];
      const machineAE = this.aspect.machine.mineur+this.aspect.machine.majeur;
      const masqueAE = this.aspect.masque.mineur+this.aspect.masque.majeur;

      Object.defineProperty(this.reaction.bonus, 'machine', {
        value: machineAE,
        writable:true,
        enumerable:true,
        configurable:true
      });

      Object.defineProperty(this.defense.bonus, 'masque', {
        value: masqueAE,
        writable:true,
        enumerable:true,
        configurable:true
      });

      for(let d of defenses) {
          const base = this[d].base;
          const bonus = Object.values(this[d]?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
          const malus = Object.values(this[d]?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

          Object.defineProperty(this[d], 'mod', {
              value: bonus-malus,
          });

          Object.defineProperty(this[d], 'value', {
              value: Math.max(base+this[d].mod, 0),
          });
      }
  }
}