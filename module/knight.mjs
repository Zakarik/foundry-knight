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
      label:'EFFECT.StatusDead',
      icon:'icons/svg/skull.svg'
    },
    {
      id:'lumiere',
      label:"KNIGHT.EFFETS.LUMIERE.Label",
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
      icon:'systems/knight/assets/icons/effects/designation.svg'
    },
    {
      id:'choc',
      label:"KNIGHT.EFFETS.CHOC.Label",
      icon:'systems/knight/assets/icons/effects/choc.svg'
    },
    {
      id:'parasitage',
      label:"KNIGHT.EFFETS.PARASITAGE.Label",
      icon:'systems/knight/assets/icons/effects/parasitage.svg'
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
    },
    {
      id:'fumigene',
      label:"KNIGHT.EFFETS.FUMIGENE.Label",
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
      icon:'systems/knight/assets/icons/effects/immobilisation.svg'
    });
  }

  Hooks.on("renderChatMessage", (message, html, messageData) => {
    const version = game.version.split('.')[0];
    const isVersion12 = version >= 12 ? true : false;

    if(!game.user.isGM) {
      html.find('.knight-roll div.listTargets').remove();
    }

    if(isVersion12) {
      if(game.user.id !== message.author.id && !game.user.isGM) {
        html.find('.knight-roll div.btn').remove();
      }
    } else {
      if(game.user.id !== message.user.id && !game.user.isGM) {
        html.find('.knight-roll div.btn').remove();
      }
    }

    html.find('.knight-roll div.dice-result').click(ev => {
      const tgt = $(ev.currentTarget);

      tgt.find('div.dice-tooltip').toggle({
        complete: () => {},
      });
    });

    html.find('.knight-roll div.details.withTooltip').click(ev => {
      const tgt = $(ev.currentTarget);

      tgt.find('div.dice-tooltip').toggle({
        complete: () => {},
      });
    });

    html.find('.knight-roll button.degats').click(async ev => {
      const tgt = $(ev.currentTarget);
      const flags = message.flags;
      const weapon = flags.weapon;
      const raw = weapon.effets.raw.concat(weapon?.distance?.raw ?? [], weapon?.structurelles?.raw ?? [], weapon?.ornementales?.raw ?? []);
      const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);

      const roll = new game.knight.RollKnight(actor, {
        name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
        weapon:weapon,
        surprise:flags.surprise,
      }, false);

      let addFlags = {
        flavor:flags.flavor,
        total:flags.content[0].total,
        targets:flags.content[0].targets,
        attaque:message.rolls,
        weapon:weapon,
        actor:actor,
        surprise:flags.surprise,
        style:flags.style,
        dataStyle:flags.dataStyle,
        dataMod:flags.dataMod,
        maximize:flags.maximize,
      };

      let data = {
        total:flags.content[0].total,
        targets:flags.content[0].targets,
        attaque:message.rolls,
        flags:addFlags,
      };

      if(raw.includes('tirenrafale')) {
        data.content = {
          tirenrafale:true,
        }
      }

      await roll.doRollDamage(data);
    });

    html.find('.knight-roll .btn.debordement button').click(async ev => {
      const tgt = $(ev.currentTarget);
      const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);
      const tour = parseInt(actor.system.debordement.tour);

      await actor.update({['system.debordement.tour']:tour+1});
      const roll = new game.knight.RollKnight(actor, {
        name:`${actor.name}`,
      }, false);

      roll.sendMessage({text:'Le débordement augmente...', classes:'important'});
    });

    html.find('.knight-roll button.relancedegats').click(async ev => {
      const tgt = $(ev.currentTarget);
      const flags = message.flags;
      const weapon = flags.weapon;
      const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);

      const roll = new game.knight.RollKnight(actor, {
        name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.EFFETS.TIRENRAFALE.Label')}`,
        weapon:weapon,
        surprise:flags.surprise,
      }, false);

      let addFlags = {
        flavor:flags.flavor,
        total:flags.total,
        targets:flags.targets,
        attaque:message.rolls,
        weapon:weapon,
        actor:actor,
        surprise:flags.surprise,
        style:flags.style,
        dataStyle:flags.dataStyle,
        dataMod:flags.dataMod,
        maximize:flags.maximize,
      };

      let data = {
        total:flags.total,
        targets:flags.targets,
        attaque:flags.attaque,
        flags:addFlags,
      };

      await roll.doRollDamage(data);
    });

    html.find('.knight-roll button.violence').click(async ev => {
      const tgt = $(ev.currentTarget);
      const flags = message.flags;
      const weapon = flags.weapon;
      const actor = message.speaker.token ? canvas.tokens.get(message.speaker.token).actor : game.actors.get(message.speaker.actor);

      let addFlags = {
        flavor:flags.flavor,
        total:flags.content[0].total,
        targets:flags.content[0].targets,
        attaque:message.rolls,
        weapon:weapon,
        actor:actor,
        surprise:flags.surprise,
        style:flags.style,
        dataStyle:flags.dataStyle,
        dataMod:flags.dataMod,
        maximize:flags.maximize,
      };

      const roll = new game.knight.RollKnight(actor, {
        name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
        weapon:flags.weapon,
        surprise:flags.surprise,
      }, false);

      await roll.doRollViolence({
        total:flags.content[0].total,
        targets:flags.content[0].targets,
        attaque:message.rolls,
        flags:addFlags,
      });
    });

    html.find('.knight-roll div.listTargets div.target').mouseenter(ev => {
      ev.preventDefault();
      if (!canvas.ready) return;
      const tgt = $(ev.currentTarget);
      const id = tgt.data('id');
      const token = canvas?.tokens?.get(id) ?? {isVisible:false};

      if(token && token.isVisible) {
        token._onHoverIn(ev, { hoverOutOthers: true });

        this._hoveredToken = token;
      }
    });

    html.find('.knight-roll div.listTargets div.target').mouseleave(ev => {
      ev.preventDefault();
      if (!canvas.ready) return;

      if (this._hoveredToken) {
        this._hoveredToken._onHoverOut(ev);
      }

      this._hoveredToken = null;
    });
  });
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

  Hooks.on("hotbarDrop", (bar, data, slot) => createMacro(data, slot));
});

Hooks.once("setup", async function() {
});

Hooks.once("ready", HooksKnight.ready);
Hooks.on('deleteItem', doc => toggler.clearForId(doc.id));
Hooks.on('deleteActor', doc => toggler.clearForId(doc.id));

Hooks.on("updateActiveEffect", function(effect, effectData, diffData, options, userId) {
  const status = effect.statuses;
  let effectCounter = foundry.utils.getProperty(effectData, "flags.statuscounter.counter");

  if (effectCounter && (status.has("barrage") || status.has("lumiere"))) {
    let update = []
    for(let e of effect.changes) {
      update.push({
        key:e.key,
        mode:e.mode,
        priority:e.priority,
        value:`${effectCounter.value}`
      });
    }

    effect.parent.updateEmbeddedDocuments('ActiveEffect', [{
      "_id":effect._id,
      changes:update,
    }])
  }
});

async function createMacro(data, slot) {
  if(foundry.utils.isEmpty(data)) return;
  // Create the macro command
  const type = data.type;
  const what = data?.what ?? "";
  const other = data?.other ?? "";
  const name = data?.name ?? "";
  const actorId = data.actorId;
  const sceneId = data?.sceneId ?? null;
  const tokenId = data?.tokenId ?? null;
  const getActor = tokenId === null ? game.actors.get(actorId) : canvas.tokens.get(actorId)?.actor ?? undefined;
  const img = data?.img ?? "systems/knight/assets/icons/D6Black.svg";
  const idWpn = data?.idWpn ?? "";
  const mod = data?.mod ?? 0;
  let label = data.label;
  let command;
  let dataRoll = "";
  let bonusToAdd = "";
  let otherData = "";
  let directRoll = false;

  let idActor = actorId;
  let idScene = sceneId;
  let idToken = tokenId;

  if(type === "wpn" || type === 'module') {
    dataRoll = `idWpn:"${idWpn}"`;
  } else if(type === 'grenades') {
    dataRoll = `nameWpn:"${what}", num:"", typeWpn:"grenades"`
  } else if(type === 'longbow') {
    dataRoll = `nameWpn:"${what}", num:"", typeWpn:"${what}"`
  } else if(type === 'cea') {
    dataRoll = `idWpn:"${idWpn}", nameWpn:"${what}", typeWpn:"${other}"`;
  } else if((type === 'special' || type === 'c1' || type === 'c2' || type === 'base') && what === 'mechaarmure') {
    dataRoll = `idWpn:"${idWpn}"`;
    otherData = what;
  } else if(type === 'armesimprovisees') {
    dataRoll = `idWpn:"${idWpn}", num:"${what}", nameWpn:"${other}"`
  } else if(type === 'nods') {
    directRoll = true;
    dataRoll = `type:"${type}", target:"${other}", id:"${what}"`;
  } else {
    if(what !== "") dataRoll += `base:"${what}"`;
    if(other !== "" && bonusToAdd !== "") bonusToAdd += `, autre:"${other}"`;
    else if(other !== "") bonusToAdd += `autre:"${other}"`;
    if(mod !== 0 && bonusToAdd !== "") bonusToAdd += `, modificateur:"${mod}"`;
    else if(mod !== 0) bonusToAdd += `modificateur:"${mod}"`;
  }

  if(getActor.type === 'mechaarmure') {
    dataRoll += dataRoll === "" ? `whoActivate:"${getActor.system.pilote}"` : `, whoActivate:"${getActor.system.pilote}"`;
  }

  if(!directRoll) command = `game.knight.dialogRollWId("${idActor}", "${idScene}", "${idToken}", {${dataRoll}}, {${bonusToAdd}}, {type:"${type}", event:event, data:"${otherData}"})`;
  else command = `game.knight.directRoll("${idActor}", "${idScene}", "${idToken}", {${dataRoll}})`;

  let macro = await Macro.create({
    name: label,
    type: "script",
    img: img,
    command: command,
    flags: { "knight.attributMacro": true }
  });

  game.user.assignHotbarMacro(macro, slot);
  return false;
}

Hooks.on('renderItemDirectory', async function () {
  await generateNavigator();

  $("section#items footer.action-buttons button.compendium").remove();
  $("section#items footer.action-buttons").append(`<button class='compendium'>${game.i18n.localize('KNIGHT.COMPENDIUM.Label')}</button>`);

  $("section#items footer.action-buttons button.compendium").on( "click", async function() {
    const dial = new game.knight.applications.KnightCompendiumDialog();
    dial.render(true);
  });
});

Hooks.on('updateCompendium', async function () {
  await generateNavigator();
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

/*Hooks.on("renderPause", function () {
  $("#pause.paused figcaption").text('');
});*/