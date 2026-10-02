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
      bonus: [
        "schema",
        {
          aspectsLieSupplementaire: [
            "schema",
            {
              has: ["bool", { initial: false }],
              value: ["str", { initial: "chair" }],
            },
          ],
          sante: [
            "schema",
            {
              has: ["bool", { initial: false }],
              aspect: [
                "schema",
                {
                  lie: ["bool", { initial: false }],
                  value: ["str", { initial: "chair" }],
                  multiplie: ["num", { initial: 5, nullable: false, integer: true }],
                },
              ],
              value: ["num", { initial: 0, nullable: false, integer: true }],
            },
          ],
          armure: [
            "schema",
            {
              has: ["bool", { initial: false }],
              aspect: [
                "schema",
                {
                  lie: ["bool", { initial: false }],
                  value: ["str", { initial: "chair" }],
                  multiplie: ["num", { initial: 5, nullable: false, integer: true }],
                },
              ],
              value: ["num", { initial: 0, nullable: false, integer: true }],
            },
          ],
          aspectMax: [
            "schema",
            {
              has: ["bool", { initial: false }],
              aspect: ["str", { initial: "chair" }],
              maximum: [
                "schema",
                {
                  aspect: ["num", { initial: 40, nullable: false, integer: true }],
                  ae: ["num", { initial: 20, nullable: false, integer: true }],
                },
              ],
            },
          ],
        },
      ],
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

  prepareBaseData() {}

  prepareDerivedData() {
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
