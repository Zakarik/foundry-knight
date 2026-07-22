
const SpecialEffectsMixin = (superclass) => class extends superclass {
    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
        actions: {
            addSpecialEffects: this.#onAddSpecialEffects,
            deleteSpecialEffects: this.#onDeleteSpecialEffects,
        }
    }

    get specialEffectsPath() {
        return '';
    }

    static #onAddSpecialEffects(event, target) {
      const path = this.specialEffectsPath;
      const item = this.document;
      const array = foundry.utils.getProperty(item, `${path}.list`);
      const arrayDefaultField = foundry.utils.getProperty(item, `${path}.defaultListValue`);

      array.push(arrayDefaultField);
      item.update({[`${path}.list`]:array});
    }

    static #onDeleteSpecialEffects(event, target) {

    }
}


export default SpecialEffectsMixin;