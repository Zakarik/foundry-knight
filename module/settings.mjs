export const RegisterSettings = function () {
    /* ------------------------------------ */
    /* User settings                        */
    /* ------------------------------------ */
    game.settings.register("knight", "include-armorbase", {
        name: "",
        hint: "",
        scope: "world",
        config: false,
        default: true,
        type: Boolean,

    });
    game.settings.register("knight", "acces-egide", {
        name: "KNIGHT.SETTINGS.ARMURES.Egide",
        hint: "",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,

    });
    game.settings.register("knight", "include-capacite2038", {
        name: "KNIGHT.SETTINGS.ARMURES.2038",
        hint: "KNIGHT.SETTINGS.ARMURES.2038Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("knight", "include-capacite2038necromancer", {
        name: "KNIGHT.SETTINGS.ARMURES.2038necromancer",
        hint: "KNIGHT.SETTINGS.ARMURES.2038necromancerHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register("knight", "include-capacite2038sorcerer", {
        name: "KNIGHT.SETTINGS.ARMURES.2038sorcerer",
        hint: "KNIGHT.SETTINGS.ARMURES.2038sorcererHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register("knight", "include-capacitecodex", {
        name: "KNIGHT.SETTINGS.ARMURES.Codex",
        hint: "KNIGHT.SETTINGS.ARMURES.CodexHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("knight", "include-capaciteatlas", {
        name: "KNIGHT.SETTINGS.ARMURES.Atlas",
        hint: "KNIGHT.SETTINGS.ARMURES.AtlasHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("knight", "include-capaciteatlasspecial", {
        name: "KNIGHT.SETTINGS.ARMURES.AtlasSpecial",
        hint: "KNIGHT.SETTINGS.ARMURES.AtlasSpecialHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register("knight", "systemVersion", {
        name: "Version du Système",
        scope: "world",
        config: false,
        type: String,
        default: 0,
    });
};