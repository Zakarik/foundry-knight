import ItemSpecialEffectsPathMixinModel from "../base/mixin-item-specialEffects-path-model.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import BaseItemDataModel from "../base/base-item-data-model.mjs";
import { combine } from "../../../utils/field-builder.mjs";

export class AvantageDataModel extends ItemSpecialEffectsPathMixinModel(
  ItemSpecialEffectsInternalMixinModel(BaseItemDataModel),
) {
  static get baseDefinition() {
    const base = super.baseDefinition;

    const specific = {
      type: ["str", { initial: "standard", nullable: false }],
      show: ["bool", { initial: false, nullable: false }],
      bonus: [
        "schema",
        {
          coutsReduits: [
            "schema",
            {
              aspect: [
                "schema",
                {
                  divise: ["num", { initial: 0, integer: true, nullable: false }],
                  value: ["num", { initial: 0, integer: true, nullable: false }],
                },
              ],
              caracteristique: [
                "schema",
                {
                  divise: ["num", { initial: 0, integer: true, nullable: false }],
                  value: ["num", { initial: 0, integer: true, nullable: false }],
                },
              ],
            },
          ],
        },
      ],
    };

    return combine(base, specific);
  }

  static migrateData(source) {
    if (!source?.effects) {
      source.effects = {
        list: [],
      };
    }

    if (source?.bonus?.sante) {
      source.effects.list.push({
        type: "add",
        path: "system.sante.withArmor",
        value: source.bonus.sante,
      });
    }

    if (source?.bonus?.espoir) {
      source.effects.list.push({
        type: "add",
        path: "system.espoir",
        value: source.bonus.espoir,
      });
    }

    if (source?.bonus?.recuperation?.sante) {
      source.effects.list.push({
        type: "add",
        path: "system.bonus.recuperation.sante",
        value: source.bonus.recuperation.sante,
      });
    }

    if (source?.bonus?.recuperation?.armure) {
      source.effects.list.push({
        type: "add",
        path: "system.bonus.recuperation.armure",
        value: source.bonus.recuperation.armure,
      });
    }

    if (source?.bonus?.recuperation?.energie) {
      source.effects.list.push({
        type: "add",
        path: "system.bonus.recuperation.energie",
        value: source.bonus.recuperation.energie,
      });
    }

    if (source?.bonus?.recuperation?.espoir) {
      source.effects.list.push({
        type: "add",
        path: "system.bonus.recuperation.espoir",
        value: source.bonus.recuperation.espoir,
      });
    }

    if (source?.bonus?.noDmgSante) {
      source.effects.list.push({
        type: "override",
        path: "system.combat.noDmgSante",
        value: source.bonus.noDmgSante,
      });
    }

    if (source?.bonus?.bourreauTenebres) {
      source.effects.list.push({
        type: "override",
        path: "bourreauTenebres",
        value: source.bonus.bourreauTenebres,
      });
    }

    if (source?.bonus?.devasterAnatheme) {
      source.effects.list.push({
        type: "override",
        path: "devasterAnatheme",
        value: source.bonus.devasterAnatheme,
      });
    }

    if (source?.bonus?.equilibrerBalance) {
      source.effects.list.push({
        type: "override",
        path: "equilibrerBalance",
        value: source.bonus.equilibrerBalance,
      });
    }

    if (
      source?.bonus?.initiative?.ifEmbuscade?.dice &&
      source?.bonus?.initiative?.ifEmbuscade?.has
    ) {
      source.effects.list.push({
        type: "add",
        path: "system.initiative.embuscade.diceMod",
        value: source.bonus.initiative.ifEmbuscade.diceMod,
      });
    }

    if (
      source?.bonus?.initiative?.ifEmbuscade?.fixe &&
      source?.bonus?.initiative?.ifEmbuscade?.has
    ) {
      source.effects.list.push({
        type: "add",
        path: "system.initiative.embuscade",
        value: source.bonus.initiative.ifEmbuscade.fixe,
      });
    }

    if (source?.bonus?.initiative?.dice) {
      source.effects.list.push({
        type: "add",
        path: "system.initiative.diceMod",
        value: source.bonus.initiative.dice,
      });
    }

    if (source?.bonus?.initiative?.fixe) {
      source.effects.list.push({
        type: "add",
        path: "system.initiative",
        value: source.bonus.initiative.fixe,
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
