
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
        }
    }

    /* -------------------------------------------- */

    static async #onBtnToggle(event, target) {
        const tgt = target.dataset;
        const path = tgt.path;
        const getData = foundry.utils.getProperty(this.item, `system.${path}`);
        const value = getData ? false : true;
        const update = {};
        update[`system.${path}`] = value;

        await this._toggleBtn(update, target, value);

        this.item.update(update);
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

        return context;
    }

    _postContext(context) {}
}