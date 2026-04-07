
import BaseActorDataModel from "../base/base-actor-data-model.mjs";
import NPCMixinModel from "../base/mixin-npc-model.mjs";

export class CreatureDataModel extends NPCMixinModel(BaseActorDataModel) {
  get armes() {
      return this.items.filter(items => items.type === 'arme');
  }

  get capacitesNonLie() {
      return this.items.filter(items => items.type === 'capacite');
  }

  get capacitesBonusLie() {
      return this.items.filter(items => items.type === 'capacite' && (items.system?.bonus?.aspectsLieSupplementaire?.has ?? false));
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

  _startPrepareData() {
    super._startPrepareData();
  }

  _EndPrepareDerivedData() {
    super._EndPrepareDerivedData();

    this.#derived();
  }

  #derived() {
    const list = CONFIG.KNIGHT.LIST.creatures;

    for(let d of list) {
      const system = this[d];
      const base = system.base;
      const bonus = Object.values(system.bonus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      const malus = Object.values(system.malus).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
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
      let initiativeBonus = Object.values(this?.initiative?.bonus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      let initiativeMalus = Object.values(this?.initiative?.malus ?? {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

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

  // Méthode à surcharger dans les enfants
  _getWeaponHandlers() {
      return {
        armesimprovisees: ({ type, name, num }) => this.useAI(type, name, num),
      };
  }

  givePE(energy, autoApply=true) {
    let path = `system.energie.value`;
    let value = this.energie.value;
    let update = {}

    update[path] = `${value+energy}`;

    if(autoApply) this.actor.update(energy);
    else return update;
  }
}