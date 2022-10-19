/**
 * Knight Boîte à outil
 * @extends {FormApplication}
 */
 export class GmInitiative extends FormApplication {
    static get defaultOptions() {
        const x = $(window).width();
        const y = $(window).height();
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["knight", "gmInitiative"],
            template: "systems/knight/templates/gm/gmInitiative.html",
            title: game.i18n.localize("KNIGHT.GM.TOOL.INITIATIVE.Label"),
            left: x - ((x / 2) + 400),
            top: y - ((y / 2) + 100),
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
        const pnj = {};
        const hasScene = game?.scenes?.viewed?.tokens || false;

        if(hasScene !== false) {
            for (const actor of game.scenes.viewed.tokens) {
                const actorData = game.actors.get(actor.actorId);
                const hasEmbuscadeSubi = actorData.system.options?.embuscadeSubis || false;
                const hasEmbuscadePris = actorData.system.options?.embuscadePris || false;
                let selectedSubi = '';
                let selectedPris = '';

                if(hasEmbuscadeSubi) selectedSubi = 'selected';
                if(hasEmbuscadePris) selectedPris = 'selected';

                if(actorData.type === 'knight') {
                    pj[actor.actorId] = {
                        name:actorData.name,
                        selectedSubi:selectedSubi,
                        selectedPris:selectedPris
                    };
                }

                if(actorData.type === 'pnj' || actorData.type === 'creature') {
                    pnj[actor.actorId] = {
                        name:actorData.name,
                        selectedSubi:selectedSubi,
                        selectedPris:selectedPris
                    };
                }
            }
        }
        this.object.pj = pj;
        this.object.pnj = pnj;

        return super.render(force, options);
    }

    /**
     * Remove the close button
     * @override
     */
     _getHeaderButtons() {
        let buttons = super._getHeaderButtons();

        buttons.unshift({
            label: game.i18n.localize("KNIGHT.GM.TOOL.Reset"),
            class: "reset-sheet",
            onclick: ev => this._resetList(ev)
        });

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

        html.find('.embuscadeSubi span').click(async ev => {
            const target = $(ev.currentTarget);
            const id = target.data("id");
            const actor = game.actors.get(id);
            const hasEmbuscade = actor.system.options?.embuscadeSubis || false;
            let result = false;

            if(hasEmbuscade === false) result = true;

            await actor.update({['system.options.embuscadeSubis']:result});

            this._updateList();
        });

        html.find('.embuscadePris span').click(async ev => {
            const target = $(ev.currentTarget);
            const id = target.data("id");
            const actor = game.actors.get(id);
            const hasEmbuscade = actor.system.options?.embuscadePris || false;
            let result = false;

            if(hasEmbuscade === false) result = true;

            await actor.update({['system.options.embuscadePris']:result});

            this._updateList();
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

    async _resetList(event) {
        for (const actor of game.actors) {

            if(actor.type === 'knight' || actor.type === 'pnj' || actor.type === 'creature') {
                await actor.update({['system.options']:{
                    "embuscadeSubis":false,
                    "embuscadePris":false
                }});
            }
        }

        this.render(true);
    }
 }