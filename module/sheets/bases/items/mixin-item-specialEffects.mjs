const SpecialEffectsMixin = (superclass) =>
  class extends superclass {
    /** @inheritdoc */
    static DEFAULT_OPTIONS = {
      actions: {
        addSpecialEffects: this.#onAddSpecialEffects,
        deleteSpecialEffects: this.#onDeleteSpecialEffects,
      },
    };

    get specialEffectsPath() {
      return "";
    }

    get specialEffectsList() {
      return foundry.utils.getProperty(this.item, `${this.specialEffectsPath}.list`);
    }

    get specialEffectsLabel() {
      return "KNIGHT.LISTEFFECTS.Label";
    }

    static #onAddSpecialEffects(event, target) {
      const { header } = target.dataset;
      console.error(header);
      if (header) this.#onAddSpecialEffectsARRAY(event, target, header);
      else this.#onAddSpecialEffectsSTD(event, target);
    }

    static #onDeleteSpecialEffects(event, target) {
      const { header } = target.dataset;

      if (header) this.#onDeleteSpecialEffectsARRAY(event, target, header);
      else this.#onDeleteSpecialEffectsSTD(event, target);
    }

    #onAddSpecialEffectsSTD(event, target) {
      const path = this.specialEffectsPath;
      const item = this.document;
      const array = foundry.utils.getProperty(item, `${path}.list`);
      const arrayDefaultField = foundry.utils.getProperty(item, `${path}.defaultListValue`);

      array.push(arrayDefaultField);
      item.update({ [`${path}.list`]: array });
    }

    #onDeleteSpecialEffectsSTD(event, target) {
      const index = target.dataset?.index ?? false;
      const path = this.specialEffectsPath;
      const item = this.document;
      const list = foundry.utils.getProperty(item, `${path}.list`);
      list.splice(index, 1);

      item.update({ [`${path}.list`]: list });
    }

    #onAddSpecialEffectsARRAY(event, target, header) {
      const main = target.closest(`.${header}`);
      const { mainpath, mainindex } = main.dataset;
      const specialpath = this.specialEffectsPath;
      const item = this.document;
      const arrayPath = `system.${mainpath}`;

      const array = foundry.utils.deepClone(foundry.utils.getProperty(this.item, arrayPath) ?? []);

      const subArrayDefaultField = foundry.utils.getProperty(
        array[mainindex],
        `${specialpath}.defaultListValue`,
      );
      const subArray = foundry.utils.getProperty(array[mainindex], `${specialpath}.list`);
      subArray.push(subArrayDefaultField);

      const update = { [arrayPath]: array };

      this.item.update(update);
    }

    #onDeleteSpecialEffectsARRAY(event, target, header) {
      const main = target.closest(`.${header}`);
      const { index } = target.dataset;
      const { mainpath, mainindex } = main.dataset;
      const specialpath = this.specialEffectsPath;
      const item = this.document;
      const arrayPath = `system.${mainpath}`;

      const array = foundry.utils.deepClone(foundry.utils.getProperty(this.item, arrayPath) ?? []);

      const subArrayDefaultField = foundry.utils.getProperty(
        array[mainindex],
        `${specialpath}.defaultListValue`,
      );
      const subArray = foundry.utils.getProperty(array[mainindex], `${specialpath}.list`);
      subArray.splice(index, 1);

      const update = { [arrayPath]: array };

      this.item.update(update);
    }

    _onRender(context, options) {
      super._onRender(context, options);

      const specialPaths = CONFIG.KNIGHT.EFFECTS.NOTTYPE;
      const elem = this.element;
      const effects = elem.querySelectorAll("div.effects div.mod div.list select.path");

      for (const e of effects) {
        if (specialPaths.includes(e.value)) {
          const inputSearch = e.name.replace(".path", ".type");

          const itm = elem.querySelector(
            `div.effects div.mod div.list select.type[name="${CSS.escape(inputSearch)}"]`,
          );

          e.style.gridColumn = "1 / 3";
          itm.style.display = "none";
        }
      }
    }
  };

export default SpecialEffectsMixin;
