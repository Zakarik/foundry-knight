// Import document classes.
import { KnightActor } from "./documents/actor.mjs";
import { KnightItem } from "./documents/item.mjs";

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
import { KnightCompendiumDialog } from "./dialog/compendium-dialog.mjs";
import { MigrationKnight } from "./migration.mjs";
import toggler from './helpers/toggler.js';

// GM Helper
import { GmTool } from "./gm/gmTool.mjs";
import { GmInitiative } from "./gm/gmInitiative.mjs";
import { GmMonitor } from "./gm/gmMonitor.mjs";
import HooksKnight from "./hooks.mjs";

// MODELS
import { KnightDataModel } from "./documents/models/actors/knight-data-model.mjs";
import { IADataModel } from "./documents/models/actors/ia-data-model.mjs";
import { PNJDataModel } from "./documents/models/actors/pnj-data-model.mjs";
import { CreatureDataModel } from "./documents/models/actors/creature-data-model.mjs";
import { BandeDataModel } from "./documents/models/actors/bande-data-model.mjs";
import { VehiculeDataModel } from "./documents/models/actors/vehicule-data-model.mjs";
import { MechaArmureDataModel } from "./documents/models/actors/mecha-armure-data-model.mjs";
import { CapaciteUltimeDataModel } from "./documents/models/items/capacite-ultime-data-model.mjs";
import { DistinctionDataModel } from "./documents/models/items/distinction-data-model.mjs";
import { ArtDataModel } from "./documents/models/items/art-data-model.mjs";
import { SimpleDataModel } from "./documents/models/items/simple-data-model.mjs";
import { EffetDataModel } from "./documents/models/items/effet-data-model.mjs";
import { ModuleDataModel } from "./documents/models/items/module-data-model.mjs";
import { TraumaDataModel } from "./documents/models/items/trauma-data-model.mjs";
import { BlessureDataModel } from "./documents/models/items/blessure-data-model.mjs";
import { AvantageDataModel } from "./documents/models/items/avantage-data-model.mjs";
import { InconvenientDataModel } from "./documents/models/items/inconvenient-data-model.mjs";
import { CapaciteDataModel } from "./documents/models/items/capacite-data-model.mjs";
import { ArmureLegendeDataModel } from "./documents/models/items/armure-legende-data-model.mjs";
import { ArmeDataModel } from "./documents/models/items/arme-data-model.mjs";
import { ArmureDataModel } from "./documents/models/items/armure-data-model.mjs";

import {
  listLogo,
  SortByLabel,
  generateNavigator,
  importActor,
} from "./helpers/common.mjs";

import {
  dialogRollWId,
  directRoll,
  doViolence,
} from "./helpers/dialogRoll.mjs";

import {RollKnight} from "./documents/roll.mjs";

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
      KnightCompanionsDialog,
      KnightCompendiumDialog,
    },
    documents:{
      KnightActor,
      KnightItem,
      GmTool,
      GmInitiative,
      GmMonitor
    },
    dialogRollWId,
    directRoll,
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
  //CONFIG.Dice.rolls.unshift(RollKnight);

  // Define custom Document classes
  CONFIG.Actor.documentClass = KnightActor;
  CONFIG.Item.documentClass = KnightItem;

  CONFIG.Actor.dataModels = {
    knight:KnightDataModel,
    ia:IADataModel,
    pnj:PNJDataModel,
    creature:CreatureDataModel,
    bande:BandeDataModel,
    vehicule:VehiculeDataModel,
    mechaarmure:MechaArmureDataModel,
  };

  CONFIG.Item.dataModels = {
    arme:ArmeDataModel,
    armure:ArmureDataModel,
    avantage:AvantageDataModel,
    inconvenient:InconvenientDataModel,
    motivationMineure:SimpleDataModel,
    langue:SimpleDataModel,
    capaciteultime:CapaciteUltimeDataModel,
    distinction:DistinctionDataModel,
    art:ArtDataModel,
    capaciteheroique:SimpleDataModel,
    carteheroique:SimpleDataModel,
    contact:SimpleDataModel,
    effet:EffetDataModel,
    module:ModuleDataModel,
    trauma:TraumaDataModel,
    blessure:BlessureDataModel,
    capacite:CapaciteDataModel,
    armurelegende:ArmureLegendeDataModel,
  };

  let statusEffects = [
    {
      id:'dead',
      name:'EFFECT.StatusDead',
      label:'EFFECT.StatusDead',
      icon:'icons/svg/skull.svg',
      img:'icons/svg/skull.svg'
    },
    {
      id:'lumiere',
      name:"KNIGHT.EFFETS.LUMIERE.Label",
      label:"KNIGHT.EFFETS.LUMIERE.Label",
      img:'systems/knight/assets/icons/effects/lumiere.svg',
      icon:'systems/knight/assets/icons/effects/lumiere.svg',
      changes:[{
        key: `system.defense.malus.lumiere`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      },
      {
        key: `system.reaction.malus.lumiere`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      }]
    },
    {
      id:'barrage',
      label:"KNIGHT.EFFETS.BARRAGE.Label",
      name:"KNIGHT.EFFETS.BARRAGE.Label",
      img:'systems/knight/assets/icons/effects/barrage.svg',
      icon:'systems/knight/assets/icons/effects/barrage.svg',
      changes:[{
        key: `system.defense.malus.barrage`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      },
      {
        key: `system.reaction.malus.barrage`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 1
      }]
    },
    {
      id:'designation',
      label:"KNIGHT.EFFETS.DESIGNATION.Label",
      name:"KNIGHT.EFFETS.DESIGNATION.Label",
      img:'systems/knight/assets/icons/effects/designation.svg',
      icon:'systems/knight/assets/icons/effects/designation.svg'
    },
    {
      id:'choc',
      label:"KNIGHT.EFFETS.CHOC.Label",
      name:"KNIGHT.EFFETS.CHOC.Label",
      img:'systems/knight/assets/icons/effects/choc.svg',
      icon:'systems/knight/assets/icons/effects/choc.svg'
    },
    {
      id:'parasitage',
      label:"KNIGHT.EFFETS.PARASITAGE.Label",
      name:"KNIGHT.EFFETS.PARASITAGE.Label",
      img:'systems/knight/assets/icons/effects/parasitage.svg',
      icon:'systems/knight/assets/icons/effects/parasitage.svg'
    },
    {
      id:'degatscontinus',
      label:"KNIGHT.EFFETS.DEGATSCONTINUS.Label",
      name:"KNIGHT.EFFETS.DEGATSCONTINUS.Label",
      img:'systems/knight/assets/icons/effects/degatscontinus.svg',
      icon:'systems/knight/assets/icons/effects/degatscontinus.svg'
    },
    {
      id:'soumission',
      label:"KNIGHT.EFFETS.SOUMISSION.Label",
      name:"KNIGHT.EFFETS.SOUMISSION.Label",
      img:'systems/knight/assets/icons/effects/soumission.svg',
      icon:'systems/knight/assets/icons/effects/soumission.svg'
    },
    {
      id:'fumigene',
      label:"KNIGHT.EFFETS.FUMIGENE.Label",
      name:"KNIGHT.EFFETS.FUMIGENE.Label",
      img:'systems/knight/assets/icons/effects/fumigene.svg',
      icon:'systems/knight/assets/icons/effects/fumigene.svg',
      changes:[{
        key: `system.defense.bonus.fumigene`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 2
      },
      {
        key: `system.reaction.bonus.fumigene`,
        mode: 2,
        priority: 4,
        icon:'',
        value: 2
      }]
    }
  ];

  statusEffects.sort(SortByLabel)

  CONFIG.statusEffects = statusEffects;

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
      name:"KNIGHT.EFFETS.IMMOBILISATION.Label",
      icon:'systems/knight/assets/icons/effects/immobilisation.svg',
      img:'systems/knight/assets/icons/effects/immobilisation.svg'
    });
  }
});

/* -------------------------------------------- */
/*  Other Init Hook                             */
/* -------------------------------------------- */
Hooks.once('init', HooksKnight.init);

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */
Hooks.once("ready", HooksKnight.ready);

Hooks.on('deleteItem', doc => toggler.clearForId(doc.id));
Hooks.on('deleteActor', doc => toggler.clearForId(doc.id));

Hooks.on("createActiveEffect", function(effect, data) {
  const status = effect.statuses;
  let effectCounter = 1;

  if (effectCounter && (status.has("barrage") || status.has("lumiere")) && effect.parent.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
    let update = []
    for(let e of effect.changes) {
      update.push({
        key:e.key,
        mode:e.mode,
        priority:e.priority,
        value:`${effectCounter}`
      });
    }

    effect.parent.updateEmbeddedDocuments('ActiveEffect', [{
      "_id":effect._id,
      changes:update,
    }])
  }
});

Hooks.on("updateActiveEffect", function(effect, effectData, diffData, options, userId) {
  const status = effect.statuses;
  let effectCounter = foundry.utils.getProperty(effectData, "flags.statuscounter.counter") || foundry.utils.getProperty(effectData, "flags.statuscounter.config") || foundry.utils.getProperty(effectData, "flags.statuscounter.value");

  if (effectCounter && (status.has("barrage") || status.has("lumiere")) && effect.parent.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
    let update = []
    for(let e of effect.changes) {
      update.push({
        key:e.key,
        mode:e.mode,
        priority:e.priority,
        value:`${effectCounter}`
      });
    }

    effect.parent.updateEmbeddedDocuments('ActiveEffect', [{
      "_id":effect._id,
      changes:update,
    }])
  }
});

Hooks.on('renderItemDirectory', async function () {
  if (game.modules.get("babele")?.active && game.i18n.lang !== "fr") {
    Hooks.once("babele.ready", async function () {
      await generateNavigator();

      $("section#items footer.action-buttons button.compendium").remove();
      $("section#items footer.action-buttons").append(`<button class='compendium'>${game.i18n.localize('KNIGHT.COMPENDIUM.Label')}</button>`);

      $("section#items footer.action-buttons button.compendium").on( "click", async function() {
        const dial = new game.knight.applications.KnightCompendiumDialog();
        dial.render(true);
      });
    });
  } else {
    await generateNavigator();

    $("section#items footer.action-buttons button.compendium").remove();
    $("section#items footer.action-buttons").append(`<button class='compendium'>${game.i18n.localize('KNIGHT.COMPENDIUM.Label')}</button>`);

    $("section#items footer.action-buttons button.compendium").on( "click", async function() {
      const dial = new game.knight.applications.KnightCompendiumDialog();
      dial.render(true);
    });
  }


});

Hooks.on('renderActorDirectory', async function () {
  if(!game.user.isGM) return;

  $("section#actors footer.action-buttons button.import-all").remove();
  $("section#actors footer.action-buttons").append(`<button class='import-all'>${game.i18n.localize('KNIGHT.IMPORT.Label')}</button>`);

  $("section#actors footer.action-buttons button.import-all").on( "click", async function() {
    const html = `
      <select class="typeImport">
        <option value="creature">${game.i18n.localize('TYPES.Actor.creature')}</option>
        <option value="bande">${game.i18n.localize('TYPES.Actor.bande')}</option>
        <option value="pnj">${game.i18n.localize('TYPES.Actor.pnj')}</option>
      </select>
      <textarea class="toImport"></textarea>
    `;

    const dOptions = {
      classes: ["knight-import-all"],
      height:200
    };

    let d = new Dialog({
      title: game.i18n.localize('KNIGHT.IMPORT.Label'),
      content:html,
      buttons: {
        one: {
         label: game.i18n.localize('KNIGHT.IMPORT.Importer'),
         callback: async (html) => {
            const target = html.find('.toImport').val();
            let type = html.find('.typeImport').val();

            if(type === '') type = 'creature';

            try{
              const json = JSON.parse(target);
              const isArray = Array.isArray(json);

              if(isArray) {
                for(let a of json) {
                  importActor(a, type);
                }
              } else {
                importActor(json, type);
              }
            } catch {
              ui.notifications.error(game.i18n.localize('KNIGHT.IMPORT.Error'));
            }
          }
        }
      }
    },
    dOptions);
    d.render(true);
  });
});

Hooks.on('preUpdateActor', async function (actor, update, id)  {
  if(actor.type !== 'knight') return;
  const whatWear = actor.system.whatWear;
  const flatUpdate = foundry.utils.flattenObject(update);
  const firstEntryKey = Object.keys(flatUpdate)[0]; // Récupère la première clé
  const firstEntryValue = flatUpdate[firstEntryKey]; // Récupère la valeur associée à la première clé
  if(firstEntryKey !== 'system.armure.value' && firstEntryKey !== 'system.energie.value') return;
  if(whatWear === 'tenueCivile') return;

  actor.update({[firstEntryKey.replace('armure', `equipements.${whatWear}.armure`).replace('energie', `equipements.${whatWear}.energie`)]:firstEntryValue});
});

/*Hooks.on("renderPause", function () {
  $("#pause.paused figcaption").text('');
});*/