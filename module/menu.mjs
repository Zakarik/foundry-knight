function initializeSystemControl(controls) {
	/** @type SceneControlTool[] */
    if(game.user.isGM) {
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

// Register the hook into Foundry
let initialized;
class SystemControlsLayer extends foundry.canvas.layers.InteractionLayer {}
export const menuKnight = Object.freeze({
	init() {
		if (!initialized) {
			initialized = true;
			CONFIG.Canvas.layers.knight = {
                layerClass: SystemControlsLayer,
                group: 'interface',
			};

			Hooks.on('getSceneControlButtons', initializeSystemControl);
		}
	},
});