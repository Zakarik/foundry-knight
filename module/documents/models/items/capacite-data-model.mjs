import BaseItemDataModel from "../base/base-item-data-model.mjs";
import ItemSpecialEffectsPathMixinModel from "../base/mixin-item-specialEffects-path-model.mjs";
import ItemSpecialEffectsInternalMixinModel from "../base/mixin-item-specialEffects-internal-model.mjs";
import ArmeInternalMixinModel from "../base/mixin-arme-internal-model.mjs";
import { listEffects, getAllEffects } from "../../../helpers/common.mjs";
import { combine } from "../../../utils/field-builder.mjs";

export class CapaciteDataModel extends ItemSpecialEffectsPathMixinModel(
  ItemSpecialEffectsInternalMixinModel(ArmeInternalMixinModel(BaseItemDataModel)),
) {
  static get baseDefinition() {
    const base = super.baseDefinition;

    const specific = {
      isPhase2: ["bool", { initial: false }],
      degats: [
        "schema",
        {
          has: ["bool", { initial: false }],
          system: [
            "schema",
            {
              dice: ["num", { initial: 0 }],
              fixe: ["num", { initial: 0 }],
              effets: [
                "schema",
                {
                  raw: ["arr", ["str", {}]],
                  custom: ["arr", ["obj", {}]],
                  liste: ["arr", ["str", {}]],
                },
              ],
            },
          ],
        },
      ],
      attaque: [
        "schema",
        {
          has: ["bool", { initial: false }],
          type: ["str", { initial: "contact" }],
          portee: ["str", { initial: "contact" }],
          degats: [
            "schema",
            {
              dice: ["num", { initial: 0 }],
              fixe: ["num", { initial: 0 }],
            },
          ],
          effets: [
            "schema",
            {
              raw: ["arr", ["str", {}]],
              custom: ["arr", ["obj", {}]],
              liste: ["arr", ["str", {}]],
            },
          ],
        },
      ],
    };

    return combine(base, specific);
  }

  static migrateData(source) {
    if (source?.bonus) {
      const data = source.bonus;
      const result = [];

      if (data?.aspectsLieSupplementaire?.has)
        result.push({
          path: "item.system.aspectsLieSupplementaire",
          type: "add",
          value: data.aspectsLieSupplementaire.value,
        });

      const list = ["sante", "armure"];

      for (const d of list) {
        if (data?.[d]?.has) {
          const getListData = data[d];

          if (getListData.value != 0)
            result.push({
              path: `system.${d}`,
              type: getListData.value > 0 ? "add" : "decrease",
              value: getListData.value,
            });

          if (getListData?.aspect?.lie) {
            let listAspectLie = "";

            if (getListData.aspect.value)
              listAspectLie = `system.${d}.aspectMultiplier.${getListData.aspect.value}`;

            if (listAspectLie !== "")
              result.push({
                path: listAspectLie,
                type: "add",
                value: getListData.aspect.multiplie,
              });
          }
        }
      }

      if (data?.aspectMax?.has) {
        result.push({
          path: `system.aspects.${data.aspectMax.aspect}.max`,
          type: "override",
          value: data.aspectMax.maximum.aspect,
        });

        result.push({
          path: `system.aspects.${data.aspectMax.aspect}.ae.mineur.max`,
          type: "override",
          value: data.aspectMax.maximum.ae,
        });

        result.push({
          path: `system.aspects.${data.aspectMax.aspect}.ae.majeur.max`,
          type: "override",
          value: data.aspectMax.maximum.ae,
        });
      }

      source.effects = {
        list: result,
      };
    }
  }

  get listEffect() {
    return this.effects.list;
  }

  get hasEffects() {
    return true;
  }

  get wpnPath() {
    return `system.attaque.`;
  }

  /*static defineSchema() {
    const {
      HTMLField,
      SchemaField,
      StringField,
      NumberField,
      BooleanField,
      ArrayField,
      ObjectField,
    } = foundry.data.fields;

    return {
      aspects: new SchemaField({
        chair: new SchemaField({}),
        bete: new SchemaField({}),
        machine: new SchemaField({}),
        dame: new SchemaField({}),
        masque: new SchemaField({}),
      }),
      isPhase2: new BooleanField({ initial: false }),
      bonus: new SchemaField({
        aspectsLieSupplementaire: new SchemaField({
          has: new BooleanField({ initial: false }),
          value: new StringField({ initial: "chair" }),
        }),
        sante: new SchemaField({
          has: new BooleanField({ initial: false }),
          aspect: new SchemaField({
            lie: new BooleanField({ initial: false }),
            value: new StringField({ initial: "chair" }),
            multiplie: new NumberField({ initial: 5 }),
          }),
          value: new NumberField({ initial: 0 }),
        }),
        armure: new SchemaField({
          has: new BooleanField({ initial: false }),
          aspect: new SchemaField({
            lie: new BooleanField({ initial: false }),
            value: new StringField({ initial: "chair" }),
            multiplie: new NumberField({ initial: 5 }),
          }),
          value: new NumberField({ initial: 0 }),
        }),
        aspectMax: new SchemaField({
          has: new BooleanField({ initial: false }),
          aspect: new StringField({ initial: "chair" }),
          maximum: new SchemaField({
            aspect: new NumberField({ initial: 40 }),
            ae: new NumberField({ initial: 20 }),
          }),
        }),
      }),
      degats: new SchemaField({
        has: new BooleanField({ initial: false }),
        system: new SchemaField({
          dice: new NumberField({ initial: 0 }),
          fixe: new NumberField({ initial: 0 }),
          effets: new SchemaField({
            raw: new ArrayField(new StringField()),
            custom: new ArrayField(new ObjectField()),
            liste: new ArrayField(new StringField()),
          }),
        }),
      }),
      attaque: new SchemaField({
        has: new BooleanField({ initial: false }),
        type: new StringField({ initial: "contact" }),
        portee: new StringField({ initial: "contact" }),
        degats: new SchemaField({
          dice: new NumberField({ initial: 0 }),
          fixe: new NumberField({ initial: 0 }),
        }),
        effets: new SchemaField({
          raw: new ArrayField(new StringField()),
          custom: new ArrayField(new ObjectField()),
          liste: new ArrayField(new StringField()),
        }),
      }),
      phase2: new SchemaField({
        aspects: new SchemaField({
          has: new BooleanField({ initial: false }),
          liste: new SchemaField({
            chair: new SchemaField({
              value: new NumberField({ initial: 0 }),
            }),
            bete: new SchemaField({
              value: new NumberField({ initial: 0 }),
            }),
            machine: new SchemaField({
              value: new NumberField({ initial: 0 }),
            }),
            dame: new SchemaField({
              value: new NumberField({ initial: 0 }),
            }),
            masque: new SchemaField({
              value: new NumberField({ initial: 0 }),
            }),
          }),
        }),
        sante: new SchemaField({
          has: new BooleanField({ initial: false }),
          value: new NumberField({ initial: 0 }),
        }),
        armure: new SchemaField({
          has: new BooleanField({ initial: false }),
          value: new NumberField({ initial: 0 }),
        }),
        tactique: new SchemaField({
          has: new BooleanField({ initial: false }),
          value: new StringField({ initial: "" }),
        }),
      }),
    };
  }*/

  prepareDerivedData() {
    super.prepareDerivedData();

    this._prepareEffets();
  }

  _prepareEffets() {
    const aEffets = this.attaque.effets;
    const dEffets = this.degats.system.effets;

    const labels = getAllEffects();

    Object.defineProperty(this.attaque.effets, "liste", {
      value: listEffects(aEffets, labels, aEffets?.chargeur),
    });

    Object.defineProperty(this.degats.system.effets, "liste", {
      value: listEffects(dEffets, labels, dEffets?.chargeur),
    });
  }
}
