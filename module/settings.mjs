import toggler from './helpers/toggler.js';
import {
    listLogo,
  } from "./helpers/common.mjs";

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
        onChange: value => {
            foundry.utils.debouncedReload();
        }
    });

    game.settings.register("knight", "include-capacite2038", {
        name: "KNIGHT.SETTINGS.ARMURES.2038",
        hint: "KNIGHT.SETTINGS.ARMURES.2038Hint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => Hooks.call('knightSettingsChange', 'include-capacite2038')
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
        onChange: () => Hooks.call('knightSettingsChange', 'include-capacitecodex')
    });

    game.settings.register("knight", "include-capaciteatlas", {
        name: "KNIGHT.SETTINGS.ARMURES.Atlas",
        hint: "KNIGHT.SETTINGS.ARMURES.AtlasHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => Hooks.call('knightSettingsChange', 'include-capaciteatlas')
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

    game.settings.register("knight", "clearTogglers", {
        name: "KNIGHT.SETTINGS.TOGGLERS.Label",
        hint: "KNIGHT.SETTINGS.TOGGLERS.Hint",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            if (value) {
                toggler.clearAll();

                game.settings.set('knight', 'clearTogglers', false);
            }
        }
    });

    game.settings.register("knight", "adl", {
        name: "KNIGHT.SETTINGS.ADL.Label",
        hint: "KNIGHT.SETTINGS.ADL.Hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            foundry.utils.debouncedReload();
        }
    });

    game.settings.register("knight", "codexfm4", {
        name: "KNIGHT.SETTINGS.CODEXFM4.Label",
        hint: "KNIGHT.SETTINGS.CODEXFM4.Hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: value => {
            foundry.utils.debouncedReload();
        }
    });

    game.settings.register("knight", "oldRoll", {
        name: "KNIGHT.SETTINGS.OLDROLL.Label",
        hint: "KNIGHT.SETTINGS.OLDROLL.Hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register("knight", "canEditNods", {
        name: "KNIGHT.SETTINGS.CANEDITNODS.Label",
        hint: "KNIGHT.SETTINGS.CANEDITNODS.Hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register("knight", "canPJRestaure", {
        name: "KNIGHT.SETTINGS.CANPJRESTAURE.Label",
        hint: "KNIGHT.SETTINGS.CANPJRESTAURE.Hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("knight", "logo", {
        name: "KNIGHT.SETTINGS.LOGO.Label",
        hint: "KNIGHT.SETTINGS.LOGO.Hint",
        scope: "client",
        config: true,
        type: String,
        default: "version1",
        choices:{
            "default":"KNIGHT.SETTINGS.Default",
            "version1":"KNIGHT.SETTINGS.LOGO.Version1",
            "version2":"KNIGHT.SETTINGS.LOGO.Version2",
            "version3":"KNIGHT.SETTINGS.LOGO.Version3",
        },
        onChange: value => {
            $("div#interface").removeClass(listLogo);
            $("div#interface").addClass(value);
        }
    });

    game.settings.register("knight", "advcampaign", {
        name: "KNIGHT.SETTINGS.ADVCAMPAIGN.Label",
        hint: "KNIGHT.SETTINGS.ADVCAMPAIGN.Hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });

    game.settings.register("knight", "GmTool", {
        name: "",
        hint: "",
        scope: "client",
        config: false,
        type: Boolean,
        default: true,
    });
};
