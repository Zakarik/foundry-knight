import ItemSpecialEffectsPathMixinModel from "../base/mixin-item-specialEffects-path-model.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import BaseItemDataModel from "../base/base-item-data-model.mjs";
import { combine } from '../../../utils/field-builder.mjs';

export class InconvenientDataModel extends ItemSpecialEffectsPathMixinModel(ItemSpecialEffectsInternalMixinModel(BaseItemDataModel)) {

  static get baseDefinition() {
    const base = super.baseDefinition;

    const specific = {
      type:["str", { initial: "standard", nullable:false}],
      show:["bool", { initial: false, nullable:false}],
      bonus:["schema", {
        coutsAugmentes:["schema", {
          aspect:["schema", {
            divise:["num", { initial: 0, integer: true, nullable: false }],
            value:["num", { initial: 0, integer: true, nullable: false }],
          }],
          caracteristique:["schema", {
            divise:["num", { initial: 0, integer: true, nullable: false }],
            value:["num", { initial: 0, integer: true, nullable: false }],
          }],
        }],
      }],
    }

    return combine(base, specific);
  }

  static migrateData(source) {
    if(!source?.effects) {
      source.effects = {
        list:[],
      };
    }

    if(source?.malus?.sante) {
      source.effects.list.push({
        type:'decrease',
        path:'system.sante.withArmor',
        value:source.bonus.sante,
      });
    }

    if(source?.malus?.espoir) {
      source.effects.list.push({
        type:'decrease',
        path:'system.espoir',
        value:source.malus.espoir,
      });
    }

    if(source?.malus?.recuperation?.sante) {
      source.effects.list.push({
        type:'decrease',
        path:'system.malus.recuperation.sante',
        value:source.malus.recuperation.sante,
      });
    }

    if(source?.malus?.recuperation?.armure) {
      source.effects.list.push({
        type:'decrease',
        path:'system.malus.recuperation.armure',
        value:source.malus.recuperation.armure,
      });
    }

    if(source?.malus?.recuperation?.energie) {
      source.effects.list.push({
        type:'decrease',
        path:'system.malus.recuperation.energie',
        value:source.malus.recuperation.energie,
      });
    }

    if(source?.malus?.recuperation?.espoir) {
      source.effects.list.push({
        type:'decrease',
        path:'system.malus.recuperation.espoir',
        value:source.malus.recuperation.espoir,
      });
    }

    if(source?.malus?.initiative?.ifEmbuscade?.dice && source?.malus?.initiative?.ifEmbuscade?.has) {
      source.effects.list.push({
        type:'decrease',
        path:'system.initiative.embuscade.diceMod',
        value:source.malus.initiative.ifEmbuscade.diceMod,
      });
    }

    if(source?.malus?.initiative?.ifEmbuscade?.fixe && source?.malus?.initiative?.ifEmbuscade?.has) {
      source.effects.list.push({
        type:'decrease',
        path:'system.initiative.embuscade',
        value:source.malus.initiative.ifEmbuscade.fixe,
      });
    }

    if(source?.malus?.initiative?.dice) {
      source.effects.list.push({
        type:'decrease',
        path:'system.initiative.diceMod',
        value:source.malus.initiative.dice,
      });
    }

    if(source?.malus?.initiative?.fixe) {
      source.effects.list.push({
        type:'decrease',
        path:'system.initiative',
        value:source.malus.initiative.fixe,
      });
    }

    const limitationsAspects = source?.limitations?.aspects ?? [];

    for(const a in limitationsAspects) {
      if(limitationsAspects[a].has) {
        const str = a === 'all' ? `system.aspects.allmodified.max` : `system.aspects.${a}.max`;

        source.effects.list.push({
          type:'decrease',
          path:`${str}`,
          value:Math.max(9 - limitationsAspects[a].value, 1),
        });
      }
    }

    if(source?.limitations?.espoir?.aucunGain) {
      source.effects.list.push({
        type:'override',
        path:'system.espoir.recuperation.aucun',
        value:source.limitations.espoir.aucunGain,
      });
    }

    return super.migrateData(source);
  }

  get listEffect() {
      return this.effects.list;
  }

  get hasEffects() {
      return true;
  }
}