function initializeSystemControl(controls) {
	/** @type SceneControlTool[] */
    if(game.user.isGM) {
        const version = game.version.split('.')[0];
        const isV13 = version > 12 ? true : false;

        if(!isV13) {
            controls[0].tools.push({
            active: game.settings.get("knight", "GmTool"),
            button: true,
            toggle: true,
            visible: true,
            icon: "fa-duotone fa-solid fa-thumbtack",
            name:'times2',
            title: "KNIGHT.GM.TOOL.ShowHide",
            onClick:(active) => {
                    game.settings.set("knight", "GmTool", active);

                    if(!active && game.user.isGM) Object.values(ui.windows).find((app) => app.options.baseApplication === 'GmTool').close();
                    else if (game.user.isGM && active) new game.knight.documents.GmTool().render(true);
                },
            })
        } else {
            controls.tokens.tools.times2 = {
                active: game.settings.get("knight", "GmTool"),
                button: true,
                toggle: true,
                visible: true,
                icon: "fa-duotone fa-solid fa-thumbtack",
                name:'times2',
                title: "KNIGHT.GM.TOOL.ShowHide",
                onChange:(event, active) => {
                    game.settings.set("knight", "GmTool", active);

                    if(!active && game.user.isGM) Object.values(ui.windows).find((app) => app.options.baseApplication === 'GmTool').close();
                    else if (game.user.isGM && active) new game.knight.documents.GmTool().render(true);
              },
            };
        }
    }
}

// Register the hook into Foundry
let initialized;
export const menuKnight = Object.freeze({
	init() {

		if (!initialized) {
			initialized = true;

            // Récupération dynamique de la classe
            const InteractionLayerClass = foundry?.canvas?.layers?.InteractionLayer ?? InteractionLayer;

            class SystemControlsLayer extends InteractionLayerClass {}

			CONFIG.Canvas.layers.knight = {
                layerClass: SystemControlsLayer,
                group: 'interface',
			};

			Hooks.on('getSceneControlButtons', initializeSystemControl);
		}
	},
});