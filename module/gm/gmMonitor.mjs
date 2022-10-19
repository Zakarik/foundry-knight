/**
 * Knight Boîte à outil
 * @extends {FormApplication}
 */
 export class GmMonitor extends FormApplication {
    static get defaultOptions() {
        const x = $(window).width();
        const y = $(window).height();
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["knight", "gmMonitor"],
            template: "systems/knight/templates/gm/gmMonitor.html",
            title: game.i18n.localize("KNIGHT.GM.TOOL.GMMONITOR.Label"),
            left: x - ((x / 2) + 400),
            top: y - ((y / 2) + 200),
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
        
        const pj = {};

        for (const actor of game.actors) {
            if(actor.type === 'knight') {
                pj[actor.id] = {
                    name:actor.system.surnom,
                    aspects:actor.system.aspects,
                    defense:actor.system.defense.value,
                    reaction:actor.system.reaction.value,
                    armure:{
                        value:actor.system.armure.value,
                        max:actor.system.armure?.max || 0
                    },
                    sante:{
                        value:actor.system.sante.value,
                        max:actor.system.sante?.max || 0
                    },
                    espoir:{
                        value:actor.system.espoir.value,
                        max:actor.system.espoir?.max || 0
                    },
                    energie:{
                        value:actor.system.energie.value,
                        max:actor.system.energie?.max || 0
                    },
                    cdf:actor.system.champDeForce.value,
                };
            }
        }
        this.object.pj = pj;

        return super.render(force, options);
    }

    /**
     * Remove the close button
     * @override
     */
     _getHeaderButtons() {
        let buttons = super._getHeaderButtons();

        buttons.unshift({
            label: game.i18n.localize("KNIGHT.GM.TOOL.Rafraichir"),
            class: "rafraichir-sheet",
            icon: "fa-solid fa-arrows-rotate",
            onclick: ev => this._updateList(ev)
        });
        return buttons;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (!game.user.isGM) {
            return;
        }

        html.find('.header .far').click(ev => {
            const target = $(ev.currentTarget);
            const type = target.data("type");
            const value = target.data("value") === true ? false : true;

            this.object[type] = value

            this.render(true);
        });
    }

    /**
     * This method is called upon form submission after form data is validated
     * @param event    The initial triggering submission event
     * @param formData The object of validated form data with which to update the object
     * @returns        A Promise which resolves once the update operation has completed
     * @override
     */
     async _updateObject(event, formData) {
        this.render(false);
    }

    _updateList(event) {
        this.render(true);
    }
 }