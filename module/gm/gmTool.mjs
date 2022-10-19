import { GmInitiative } from "./gmInitiative.mjs";
import { GmMonitor } from "./gmMonitor.mjs";

/**
 * L5R GM Toolbox dialog
 * @extends {FormApplication}
 */
 export class GmTool extends FormApplication {
    static get defaultOptions() {
        const x = $(window).width();
        const y = $(window).height();
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["knight", "gmTool"],
            template: "systems/knight/templates/gm/gmTool.html",
            title: game.i18n.localize("KNIGHT.GM.TOOL.Label"),
            left: x - 630,
            top: y - 210,
            closeOnSubmit: false,
            submitOnClose: false,
            submitOnChange: true,
            minimizable: false
        });
    }

    /**
     * Constructor
     * @param {ApplicationOptions} options
     */
     constructor(options = {}) {
        super(options);
    }

    async render(force = false, options = {}) {
        if (!game.user.isGM) {
            return false;
        }
        this.position.width = "auto";
        this.position.height = "auto";

        return super.render(force, options);
    }

    /**
     * Remove the close button
     * @override
     */
     _getHeaderButtons() {
        return [];
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (!game.user.isGM) {
            return;
        }

        html.find('button.gestionIniatiative').click(ev => {
            ev.preventDefault();
            ev.stopPropagation();

            const app = Object.values(ui.windows).find((app) => app instanceof GmInitiative) ?? new game.knight.documents.GmInitiative()
            app.render(true);
        });

        html.find('button.monitor').click(ev => {
            ev.preventDefault();
            ev.stopPropagation();

            const app = Object.values(ui.windows).find((app) => app instanceof GmMonitor) ?? new game.knight.documents.GmMonitor()
            app.render(true);
        });
    }

    /**
     * This method is called upon form submission after form data is validated
     * @param event    The initial triggering submission event
     * @param formData The object of validated form data with which to update the object
     * @returns        A Promise which resolves once the update operation has completed
     * @override
     */
 }