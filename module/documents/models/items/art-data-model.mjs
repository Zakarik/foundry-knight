import BaseItemDataModel from "../base/base-item-data-model.mjs";
import { combine } from "../../../utils/field-builder.mjs";

export class ArtDataModel extends BaseItemDataModel {
  static get baseDefinition() {
    const base = super.baseDefinition;

    const specific = {
      aspects: [
        "schema",
        {
          chair: [
            "arr",
            ["str", { initial: "" }],
            { initial: ["deplacement", "force", "endurance"] },
          ],
          bete: ["arr", ["str", { initial: "" }], { initial: ["hargne", "combat", "instinct"] }],
          machine: ["arr", ["str", { initial: "" }], { initial: ["tir", "savoir", "technique"] }],
          dame: ["arr", ["str", { initial: "" }], { initial: ["aura", "parole", "sangFroid"] }],
          masque: [
            "arr",
            ["str", { initial: "" }],
            { initial: ["discretion", "dexterite", "perception"] },
          ],
        },
      ],
      jet: [
        "schema",
        {
          c1: ["str", { initial: "chair" }],
          c2: ["str", { initial: "chair" }],
        },
      ],
      pratique: [
        "schema",
        {
          has: ["bool", { initial: false }],
          base: ["str", { initial: "" }],
          apprenti: ["str", { initial: "" }],
          initie: ["str", { initial: "" }],
          maitre: ["str", { initial: "" }],
          textarea: [
            "schema",
            {
              base: ["num", { initial: 50, nullable: false, integer: true }],
              apprenti: ["num", { initial: 50, nullable: false, integer: true }],
              initie: ["num", { initial: 50, nullable: false, integer: true }],
              maitre: ["num", { initial: 50, nullable: false, integer: true }],
              oeuvrebase: ["num", { initial: 50, nullable: false, integer: true }],
            },
          ],
        },
      ],
      oeuvre: [
        "schema",
        {
          has: ["bool", { initial: false }],
          base: ["str", { initial: "" }],
          temps: [
            "schema",
            {
              court: ["str", { initial: "" }],
              moyen: ["str", { initial: "" }],
              long: ["str", { initial: "" }],
            },
          ],
          liste: ["obj"],
          textarea: [
            "schema",
            {
              base: ["num", { initial: 50, nullable: false, integer: true }],
            },
          ],
        },
      ],
    };

    return combine(base, specific);
  }

  /*static defineSchema() {
		const {HTMLField, NumberField, SchemaField, ArrayField, StringField, BooleanField, ObjectField} = foundry.data.fields;

        return {
            description:new HTMLField({initial:''}),
            aspects:new SchemaField({
                chair:new ArrayField(new StringField(), {initial:["deplacement", "force", "endurance"]}),
                bete:new ArrayField(new StringField(), {initial:["hargne", "combat", "instinct"]}),
                machine:new ArrayField(new StringField(), {initial:["tir", "savoir", "technique"]}),
                dame:new ArrayField(new StringField(), {initial:["aura", "parole", "sangFroid"]}),
                masque:new ArrayField(new StringField(), {initial:["discretion", "dexterite", "perception"]}),
            }),
            jet:new SchemaField({
                c1:new StringField({initial:'chair'}),
                c2:new StringField({initial:'chair'}),
            }),
            pratique:new SchemaField({
                has:new BooleanField({initial:false}),
                base:new StringField({initial:''}),
                apprenti:new StringField({initial:''}),
                initie:new StringField({initial:''}),
                maitre:new StringField({initial:''}),
                textarea:new SchemaField({
                    base:new NumberField({initial:50, nullable:false, integer:true}),
                    apprenti:new NumberField({initial:50, nullable:false, integer:true}),
                    initie:new NumberField({initial:50, nullable:false, integer:true}),
                    maitre:new NumberField({initial:50, nullable:false, integer:true}),
                    oeuvrebase:new NumberField({initial:50, nullable:false, integer:true}),
                })
            }),
            oeuvre:new SchemaField({
                has:new BooleanField({initial:false}),
                base:new StringField({initial:''}),
                temps:new SchemaField({
                    court:new StringField({initial:''}),
                    moyen:new StringField({initial:''}),
                    long:new StringField({initial:''}),
                }),
                liste:new ObjectField(),
                textarea:new SchemaField({
                    base:new NumberField({initial:50, nullable:false, integer:true}),
                })
            }),
        }
    }

    prepareBaseData() {

	}

	prepareDerivedData() {

    }*/
}
