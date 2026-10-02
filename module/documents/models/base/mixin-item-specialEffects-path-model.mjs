import { combine } from "../../../utils/field-builder.mjs";

const ItemSpecialEffectsPathMixinModel = (superclass) =>
  class extends superclass {
    static get baseDefinition() {
      const base = super.baseDefinition;

      const specific = {
        other: ["obj", {}],
        effects: [
          "schema",
          {
            list: [
              "arr",
              [
                "schema",
                {
                  type: ["str", { initial: "", nullable: false }],
                  path: ["str", { initial: "", nullable: false }],
                  value: ["str", { initial: "0", nullable: false }],
                },
              ],
            ],
            defaultListValue: [
              "arr",
              [
                "schema",
                {
                  type: ["str", { initial: "add", nullable: false }],
                  path: ["str", { initial: "", nullable: false }],
                  value: ["str", { initial: "0", nullable: false }],
                },
              ],
            ],
          },
        ],
      };

      return combine(base, specific);
    }
  };

export default ItemSpecialEffectsPathMixinModel;
