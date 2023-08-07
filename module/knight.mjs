// Import document classes.
import { KnightActor } from "./documents/actor.mjs";
import { KnightItem } from "./documents/item.mjs";
import { RollKnight } from "./documents/roll.mjs";

// Import sheet classes.
import { KnightSheet } from "./sheets/actors/knight-sheet.mjs";
import { IASheet } from "./sheets/actors/ia-sheet.mjs";
import { PNJSheet } from "./sheets/actors/pnj-sheet.mjs";
import { CreatureSheet } from "./sheets/actors/creature-sheet.mjs";
import { BandeSheet } from "./sheets/actors/bande-sheet.mjs";
import { VehiculeSheet } from "./sheets/actors/vehicule-sheet.mjs";
import { MechaArmureSheet } from "./sheets/actors/mechaarmure-sheet.mjs";
import { AvantageSheet } from "./sheets/items/avantage-sheet.mjs";
import { InconvenientSheet } from "./sheets/items/inconvenient-sheet.mjs";
import { MotivationMineureSheet } from "./sheets/items/motivationMineure-sheet.mjs";
import { LangueSheet } from "./sheets/items/langue-sheet.mjs";
import { ContactSheet } from "./sheets/items/contact-sheet.mjs";
import { BlessureSheet } from "./sheets/items/blessure-sheet.mjs";
import { TraumaSheet } from "./sheets/items/trauma-sheet.mjs";
import { ArmureSheet } from "./sheets/items/armure-sheet.mjs";
import { ArmureLegendeSheet } from "./sheets/items/armurelegende-sheet.mjs";
import { ModuleSheet } from "./sheets/items/module-sheet.mjs";
import { ArmeSheet } from "./sheets/items/arme-sheet.mjs";
import { EffetSheet } from "./sheets/items/effet-sheet.mjs";
import { ArtSheet } from "./sheets/items/art-sheet.mjs";
import { CapaciteSheet } from "./sheets/items/capacite-sheet.mjs";
import { CarteHeroiqueSheet } from "./sheets/items/carteheroique-sheet.mjs";
import { CapaciteHeroiqueSheet } from "./sheets/items/capaciteheroique-sheet.mjs";
import { CapaciteUltimeSheet } from "./sheets/items/capaciteultime-sheet.mjs";
import { DistinctionSheet } from "./sheets/items/distinction-sheet.mjs";

// Import helper/utility classes and constants.
import { RegisterHandlebars } from "./handlebars.mjs";
import { RegisterSettings } from "./settings.mjs";
import { PreloadTemplates } from "./templates.mjs";
import { KNIGHT } from "./helpers/config.mjs";
import { KnightCompanionsDialog } from "./dialog/companions-dialog.mjs";
import { KnightRollDialog } from "./dialog/roll-dialog.mjs";
import { KnightEditDialog } from "./dialog/edit-dialog.mjs";
import { KnightEffetsDialog } from "./dialog/effets-dialog.mjs";
import { MigrationKnight } from "./migration.mjs";
import toggler from './helpers/toggler.js';

// GM Helper
import { GmTool } from "./gm/gmTool.mjs";
import { GmInitiative } from "./gm/gmInitiative.mjs";
import { GmMonitor } from "./gm/gmMonitor.mjs";
import HooksKnight from "./hooks.mjs";

import {
  updateEffect,
  listLogo,
} from "./helpers/common.mjs";

import {
  doDgts,
  doViolence,
} from "./helpers/dialogRoll.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.knight = {
    applications: {
      KnightSheet,
      IASheet,
      PNJSheet,
      CreatureSheet,
      BandeSheet,
      VehiculeSheet,
      MechaArmureSheet,
      KnightRollDialog,
      KnightEditDialog,
      KnightEffetsDialog,
      KnightCompanionsDialog
    },
    documents:{
      KnightActor,
      KnightItem,
      GmTool,
      GmInitiative,
      GmMonitor
    },
    RollKnight,
    migrations: MigrationKnight
  };

  // Add custom constants for configuration.
  CONFIG.KNIGHT = KNIGHT;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "@initiative.complet",
    decimals: 2
  };

  // Define custom Roll class
  CONFIG.Dice.rolls.unshift(RollKnight);

  // Define custom Document classes
  CONFIG.Actor.documentClass = KnightActor;
  CONFIG.Item.documentClass = KnightItem;
  CONFIG.statusEffects = [
    {
      id:'dead',
      label:'EFFECT.StatusDead',
      icon:'icons/svg/skull.svg'
    },
    {
      id:'lumiere',
      label:"KNIGHT.EFFETS.LUMIERE.Label",
      icon:'systems/knight/assets/icons/effects/lumiere.svg',
      changes:[{
        key: `system.defense.malusValue`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      },
      {
        key: `system.reaction.malusValue`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      }]
    },
    {
      id:'barrage',
      label:"KNIGHT.EFFETS.BARRAGE.Label",
      icon:'systems/knight/assets/icons/effects/barrage.svg',
      changes:[{
        key: `system.defense.malusValue`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      },
      {
        key: `system.reaction.malusValue`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      }]
    },
    {
      id:'designation',
      label:"KNIGHT.EFFETS.DESIGNATION.Label",
      icon:'systems/knight/assets/icons/effects/designation.svg'
    },
    {
      id:'choc',
      label:"KNIGHT.EFFETS.CHOC.Label",
      icon:'systems/knight/assets/icons/effects/choc.svg'
    },
    {
      id:'degatscontinus',
      label:"KNIGHT.EFFETS.DEGATSCONTINUS.Label",
      icon:'systems/knight/assets/icons/effects/degatscontinus.svg'
    },
    {
      id:'soumission',
      label:"KNIGHT.EFFETS.SOUMISSION.Label",
      icon:'systems/knight/assets/icons/effects/soumission.svg'
    }
  ];
  // HANDLEBARS
  RegisterHandlebars();

  // SETTINGS
  RegisterSettings();

  // TEMPLATES
  PreloadTemplates();

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  Actors.registerSheet("knight", KnightSheet, {
    types: ["knight"],
    makeDefault: true
  });

  Actors.registerSheet("ia", IASheet, {
    types: ["ia"],
    makeDefault: true
  });

  Actors.registerSheet("pnj", PNJSheet, {
    types: ["pnj"],
    makeDefault: true
  });

  Actors.registerSheet("creature", CreatureSheet, {
    types: ["creature"],
    makeDefault: true
  });

  Actors.registerSheet("bande", BandeSheet, {
    types: ["bande"],
    makeDefault: true
  });

  Actors.registerSheet("vehicule", VehiculeSheet, {
    types: ["vehicule"],
    makeDefault: true
  });

  Actors.registerSheet("mechaarmure", MechaArmureSheet, {
    types: ["mechaarmure"],
    makeDefault: true
  });

  Items.registerSheet("avantage", AvantageSheet, {
    types: ["avantage"],
    makeDefault: true
  });

  Items.registerSheet("inconvenient", InconvenientSheet, {
    types: ["inconvenient"],
    makeDefault: true
  });

  Items.registerSheet("motivationMineure", MotivationMineureSheet, {
    types: ["motivationMineure"],
    makeDefault: true
  });

  Items.registerSheet("langue", LangueSheet, {
    types: ["langue"],
    makeDefault: true
  });

  Items.registerSheet("contact", ContactSheet, {
    types: ["contact"],
    makeDefault: true
  });

  Items.registerSheet("blessure", BlessureSheet, {
    types: ["blessure"],
    makeDefault: true
  });

  Items.registerSheet("trauma", TraumaSheet, {
    types: ["trauma"],
    makeDefault: true
  });

  Items.registerSheet("armure", ArmureSheet, {
    types: ["armure"],
    makeDefault: true
  });

  Items.registerSheet("armurelegende", ArmureLegendeSheet, {
    types: ["armurelegende"],
    makeDefault: true
  });

  Items.registerSheet("module", ModuleSheet, {
    types: ["module"],
    makeDefault: true
  });

  Items.registerSheet("arme", ArmeSheet, {
    types: ["arme"],
    makeDefault: true
  });

  Items.registerSheet("capacite", CapaciteSheet, {
    types: ["capacite"],
    makeDefault: true
  });

  Items.registerSheet("carteheroique", CarteHeroiqueSheet, {
    types: ["carteheroique"],
    makeDefault: true
  });

  Items.registerSheet("capaciteheroique", CapaciteHeroiqueSheet, {
    types: ["capaciteheroique"],
    makeDefault: true
  });

  Items.registerSheet("effet", EffetSheet, {
    types: ["effet"],
    makeDefault: true
  });

  Items.registerSheet("art", ArtSheet, {
    types: ["art"],
    makeDefault: true
  });

  Items.registerSheet("distinction", DistinctionSheet, {
    types: ["distinction"],
    makeDefault: true
  });

  Items.registerSheet("capaciteultime", CapaciteUltimeSheet, {
    types: ["capaciteultime"],
    makeDefault: true
  });

  const hasCodexFM4 = game.settings.get("knight", "codexfm4");

  if(hasCodexFM4) {
    CONFIG.statusEffects.push({
      id:'immobilisation',
      label:"KNIGHT.EFFETS.IMMOBILISATION.Label",
      icon:'systems/knight/assets/icons/effects/immobilisation.svg'
    });
  }
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  let status = {};

  for(let i of CONFIG.statusEffects) {
    status[game.i18n.localize(i.label)] = i;
  };

  const sortStatus = Object.keys(status).sort(function (a, b) {
    return a.localeCompare(b);
  });

  let sortedStatus = [];

  for(let i of sortStatus) {
    sortedStatus.push(status[i]);
  }

  CONFIG.statusEffects = sortedStatus;

  const whatLogo = game.settings.get("knight", "logo");
  $("div#interface").removeClass(listLogo);
  $("div#interface").addClass(whatLogo);

  //Hooks.on("hotbarDrop", (bar, data, slot) => createMacro(data, slot));
});



Hooks.once("ready", HooksKnight.ready);
Hooks.on('deleteItem', doc => toggler.clearForId(doc.id));
Hooks.on('deleteActor', doc => toggler.clearForId(doc.id));

Hooks.on("updateActiveEffect", function(effect, effectData, diffData, options, userId) {
  let effectCounter = foundry.utils.getProperty(effectData, "flags.statuscounter.counter");
  if (effectCounter) {
    const version = game.version.split('.')[0];
    const changes = [];
    let effectStatus = "";

    if(version < 11) {
      effectStatus = foundry.utils.getProperty(effect, "flags.core.statusId");

      switch(effectStatus) {
        case 'lumiere':
        case 'barrage':
          changes.push({
            key: `system.defense.malusValue`,
            mode: 2,
            priority: 4,
            value: Number(effectCounter.value)
          },
          {
            key: `system.reaction.malusValue`,
            mode: 2,
            priority: 4,
            value: Number(effectCounter.value)
          });
          break;
      }
    } else {
      effectStatus = foundry.utils.getProperty(effect, "statuses");

      for(let eff of effectStatus) {
        switch(eff) {
          case 'lumiere':
          case 'barrage':
            changes.push({
              key: `system.defense.malusValue`,
              mode: 2,
              priority: 4,
              value: Number(effectCounter.value)
            },
            {
              key: `system.reaction.malusValue`,
              mode: 2,
              priority: 4,
              value: Number(effectCounter.value)
            });
            break;
        }
      }
    }

    updateEffect(effect.parent, [{
      "_id":effect._id,
      changes:changes
    }]);
  }
});

Hooks.on('renderChatMessage', (message, html, data) => {
  const user = data.user;
  const author = data.author;

  if(!user.isGM) {
    html.find('div.atkTouche').remove();
  }

  if(user._id !== author._id && !user.isGM) {
    html.find('button.btnDgts').remove();
    html.find('button.btnViolence').remove();
  } else {
    html.find('button.btnDgts').click(async ev => {
      ev.stopPropagation();
      const target = $(ev.currentTarget);
      const data = target.data('all');
      const regularite = Number(target.data('regularite'));
      const assAtk = target?.data('assatk') ?? undefined;

      let dataToAdd = {
        regularite:regularite
      };

      if(assAtk !== undefined) dataToAdd.assAtk = assAtk;

      const allData = foundry.utils.mergeObject(data, dataToAdd);

      doDgts(allData);
    });

    html.find('button.btnViolence').click(async ev => {
        ev.stopPropagation();
        const target = $(ev.currentTarget);
        const data = target.data('all');
        const assAtk = target?.data('assatk') ?? undefined;
        let dataToAdd = {};

        if(assAtk !== undefined) dataToAdd.assAtk = assAtk;

        const allData = foundry.utils.mergeObject(data, dataToAdd);

        doViolence(allData);
    });
  }

});


/*Hooks.on("renderPause", function () {
  $("#pause.paused figcaption").text('');
});*/