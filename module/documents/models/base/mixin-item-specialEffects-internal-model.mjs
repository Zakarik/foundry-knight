import { combine } from "../../../utils/field-builder.mjs";

const ItemSpecialEffectsInternalMixinModel = (superclass) =>
  class extends superclass {
    get listEffect() {
      return undefined;
    }

    get hasEffects() {
      return false;
    }

    get hasOptimisation() {
      return false;
    }

    get getAllEffects() {
      if (!this.listEffect || !this.hasEffects) return [];
      let result = [];

      if (this.hasOptimisation) {
        result = this.listEffect.map((e) => ({
          ...e,
          path:
            e.path &&
            e.path.includes("aspects") &&
            !e.path.includes("overdrive") &&
            !e.type.includes("override")
              ? `${e.path}.optimisation`
              : e.path,
        }));
      } else {
        result = this.listEffect;
      }

      return result;
    }

    #prepareItmEffects() {
      const effects = this.effects.list;
      const dataToFind = ["devasterAnatheme", "bourreauTenebres", "equilibrerBalance"];

      for (let f of dataToFind) {
        const data = effects.find(
          (e) => e.path === f && e.type === "override" && e.value === "true",
        );

        if (data) foundry.utils.setProperty(this, `other.${f}`, true);
      }
    }

    prepareBaseData() {
      this.#prepareItmEffects();
    }
  };

export default ItemSpecialEffectsInternalMixinModel;
