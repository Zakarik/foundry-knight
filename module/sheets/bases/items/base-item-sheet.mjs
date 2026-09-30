const { ItemSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;
import JsTogglerMixin from "../mixin-js-toggler.mjs";

/**
 * @extends {ItemSheet}
 */
export default class BaseItemSheet extends JsTogglerMixin(HandlebarsApplicationMixin(ItemSheetV2)) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["knight", "sheet", "item"],
    window: { resizable: true },
    form: {
      submitOnChange: true,
    },
    actions: {
      btnToggle: BaseItemSheet.#onBtnToggle,
      btnToggleArray: BaseItemSheet.#onBtnToggleArray,
    },
  };

  /* -------------------------------------------- */

  static async #onBtnToggle(event, target) {
    const path = target.dataset.path;
    const fullPath = path.startsWith("system.") ? `${path}` : `system.${path}`;
    const value = !foundry.utils.getProperty(this.item, fullPath);
    const update = { [fullPath]: value };

    this._toggleBtn(update, target, value);
    await this.item.update(update);
  }

  static async #onBtnToggleArray(event, target) {
    const { path, index, key } = target.dataset;
    const arrayPath = `system.${path}`;

    const array = foundry.utils.deepClone(foundry.utils.getProperty(this.item, arrayPath) ?? []);

    const i = Number(index);
    const value = key ? !foundry.utils.getProperty(array[i], key) : !array[i];

    if (key) foundry.utils.setProperty(array[i], key, value);
    else array[i] = value;

    const update = { [arrayPath]: array };
    this._toggleBtn(update, target, value);
    await this.item.update(update);
  }

  /* -------------------------------------------- */

  _toggleBtn(update, target, value) {}

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const item = context.document;
    context.item = item;
    context.systemFields = this.document.system.schema.fields;
    context.systemData = item.system;

    this._postContext(context);

    console.error(context);

    return context;
  }

  _postContext(context) {}
}
