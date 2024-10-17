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

    // Display damages on PNJs
    async function displayDamageOnPNJ(data) {
      // Get params
      const {
        token,
        dmg,
        igncdf = false,
        ignarm = false,
        antiAnatheme = false,
        antiVehicule = false,
        pierceArmor = 0,
        penetrating = 0,
        esquive = false
      } = data;
      // console.log('token', token);
      // console.log('dmg', dmg);
      // console.log('igncdf', igncdf);
      // console.log('ignarm', ignarm);
      // console.log('antiAnatheme', antiAnatheme);
      // console.log('antiVehicule', antiVehicule);
      // console.log('pierceArmor', pierceArmor);
      // console.log('penetrating', penetrating);
      // console.log('esquive', esquive);

      // Get actor
      const actor = token.actor;

      // Chair exceptionnelle
      const chairEx =
        parseInt(actor.system.aspects?.chair?.ae?.mineur?.value || 0) +
        parseInt(actor.system.aspects?.chair?.ae?.majeur?.value || 0);

      // Bouclier
      const bouclier = actor.system.bouclier?.value || 0;

      // Champ de Force
      const champDeForce = actor.system.champDeForce?.value || 0;

      // Armor
      const armor = actor.system.armure?.value || 0;
      let armorDmg = 0;

      // Sante
      const sante = actor.system.sante?.value || 0;
      let santeDmg = 0;

      // Resilience
      const resilience = actor.system.resilience?.value || 0;
      let resilienceDmg = 0;

      // isVehicule
      const isVehicule =
        actor.system.colosse ||
        actor.type === 'vehicule' ||
        (actor.system.archetype &&
          actor.system.archetype.toLowerCase().includes('colosse')) ||
        (actor.system.type &&
          actor.system.type.toLowerCase().includes('colosse')) ||
        false;

      // Other
      let damagesLeft = dmg;
      let chatMessage = '';

      // console.log('--------------');
      // console.log('--------------');
      // console.log('name', actor.name);
      // console.log('dmg', dmg);
      // console.log('igncdf', igncdf);
      // console.log('ignarm', ignarm);
      // console.log('antiAnatheme', antiAnatheme);
      // console.log('antiVehicule', antiVehicule);
      // console.log('isVehicule', isVehicule);
      // console.log('armor', armor)
      // console.log('sante', sante)

      // Check if the target is still alive
      if (sante === 0 && armor === 0) {
        // console.log('actor.statuses', actor.statuses);
        if (!actor.statuses.find((e) => e === 'dead')) {
          chatMessage += `<p><b>La cible est déjà morte.</b></p>`;
          actor.toggleStatusEffect('dead', { active: true, overlay: true });

          ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: chatMessage,
            whisper: [game.user._id],
          });
        }
        return;
      }

      // Reduce Chair Exceptionnel
      if (chairEx > 0 && !antiAnatheme) {
        damagesLeft -= chairEx;
      }

      // Reduce the bouclier
      if (bouclier > 0 && !antiAnatheme) {
        damagesLeft -= bouclier;
      }

      // Reduce the Champ de Force
      if (champDeForce > 0 && !igncdf) {
        damagesLeft -=
          champDeForce - penetrating > 0 ? champDeForce - penetrating : 0;
      }

      // If the damages are not anti véhicules, the damages are divide by 10
      if ((isVehicule || resilience > 0) && !antiVehicule) {
        damagesLeft = (damagesLeft / 10) << 0;
      }

      // Check if the esquive is used
      if (esquive) {
        damagesLeft = (damagesLeft / 2) << 0;
      }

      // #####################
      // Damages on resilience
      // #####################
      if (resilience > 0 && damagesLeft > 0) {
        // Check if the damages are upper than the resilience
        if (damagesLeft > resilience) {
          resilienceDmg = resilience;
        } else {
          resilienceDmg = damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= resilience;

        // Update the actor and the chat message
        const resilienceRest =
          resilience - resilienceDmg < 0 ? 0 : resilience - resilienceDmg;
        actor.update({
          'system.resilience.value': resilienceRest,
        });
        chatMessage += `<p>La cible subit <b>${resilienceDmg}</b> dégâts sur la <u>Resilience</u> et il reste <b>${resilienceRest}</b>.</p>`;
      }

      // ################
      // Damages on armor
      // ################
      if (
        armor > 0 &&
        armor !== 999 &&
        damagesLeft > 0 &&
        (!ignarm || sante === 0) &&
        armor >= pierceArmor
      ) {
        // Check if the damages are upper than the armor
        if (damagesLeft > armor) {
          armorDmg = armor;
        } else {
          armorDmg = damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= armor;

        // Update the actor and the chat message
        const armorRest = armor - armorDmg < 0 ? 0 : armor - armorDmg;
        actor.update({
          'system.armure.value': armorRest,
        });
        chatMessage += `<p>La cible subit <b>${armorDmg}</b> dégâts sur la <u>Armure</u> et il reste <b>${armorRest}</b>.</p>`;
      }

      // ################
      // Damages on sante
      // ################
      if (sante > 0 && damagesLeft > 0) {
        // Check if the damages are upper than the health
        if (damagesLeft > sante) {
          santeDmg = sante;
        } else {
          santeDmg = damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= sante;

        // Update the actor and the chat message
        const santeRest = sante - santeDmg < 0 ? 0 : sante - santeDmg;
        actor.update({
          'system.sante.value': santeRest,
        });
        chatMessage += `<p>La cible subit <b>${santeDmg}</b> dégâts sur la <u>Santé</u> et il reste <b>${santeRest}</b>.</p>`;
      }

      // Set the creature dead
      if (damagesLeft >= 0) {
        chatMessage += `<p><b>La cible est morte.</b></p>`;
        actor.toggleStatusEffect('dead', { active: true, overlay: true });
      }

      // console.log('bouclier', bouclier);
      // console.log('champDeForce', champDeForce);
      // console.log('armor', armor);
      // console.log('armorDmg', armorDmg);
      // console.log('sante', sante);
      // console.log('santeDmg', santeDmg);
      // console.log('resilience', resilience);
      // console.log('resilienceDmg', resilienceDmg);
      // console.log('damagesLeft', damagesLeft);

      ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: chatMessage,
        whisper: [game.user._id],
      });
    }

    // Display damages on PJs
    async function displayDamageOnPJ(data) {
      // Get params
      const {
        token,
        dmg,
        igncdf = false,
        ignarm = false,
        ignegi = false,
        esquive = false,
        pierceArmor = 0,
        penetrating = 0,
        dmgZone = {
          armure: true,
          sante: true,
          energie: false,
          espoir: false,
        },
      } = data;
      // Get actor
      const actor = token.actor;

      // Champ de Force
      const champDeForce = actor.system.champDeForce?.value || 0;

      // Egide
      const egide = actor.system.egide?.value || 0;

      // Armor
      const armor = actor.system.armure?.value || 0;
      let armorDmg = 0;
      let armorRest = armor;

      // Sante
      const sante = actor.system.sante?.value || 0;
      const hasSante =
        actor.system.sante?.max === 0 ||
        actor.items.find((e) => e.type === 'armure').system.generation === 4
          ? false
          : true;
      let santeDmg = 0;
      let santeRest = sante;
      let santeDamagesFromArmor = 0;

      // Energie
      const energie = actor.system.energie?.value || 0;
      let energieDmg = 0;
      let energieRest = energie;

      // Espoir
      const espoir = actor.system.espoir?.value || 0;
      let espoirDmg = 0;
      let espoirRest = espoir;

      // Other
      let damagesLeft = dmg;
      let chatMessage = '';

      // console.log('--------------');
      // console.log('--------------');
      // console.log('actor.name', actor.name);
      // console.log('dmg', dmg);
      // console.log('igncdf', igncdf);
      // console.log('ignarm', ignarm);
      // console.log('ignegi', ignegi);
      // console.log('esquive', esquive);
      // console.log('pierceArmor', pierceArmor);
      // console.log('penetrating', penetrating);
      // console.log('dmgZone', dmgZone);

      // Check if the target is still alive
      if (sante === 0 && armor === 0) {
        // console.log('actor.statuses', actor.statuses);
        if (!actor.statuses.find((e) => e === 'dead')) {
          chatMessage += `<p><b>La cible est déjà morte.</b></p>`;
          actor.toggleStatusEffect('dead', { active: true, overlay: true });

          ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: chatMessage,
            whisper: [game.user._id],
          });
        }
        return;
      }

      // Reduce the egide
      if (egide > 0 && !ignegi) {
        damagesLeft -= egide;
      }

      // Reduce the Champ de Force
      if (champDeForce > 0 && !igncdf) {
        damagesLeft -=
          champDeForce - penetrating > 0 ? champDeForce - penetrating : 0;
      }

      // Check if the esquive is used
      if (esquive) {
        damagesLeft = (damagesLeft / 2) << 0;
      }

      // ################
      // Damages on armor
      // ################
      if (
        armor > 0 &&
        damagesLeft > 0 &&
        (!ignarm || sante === 0) &&
        armor >= pierceArmor &&
        dmgZone.armure
      ) {
        // Check if the damages are upper than the armor
        if (damagesLeft > armor) {
          armorDmg = armor;
        } else {
          armorDmg = damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= armor;

        // Update the actor and the chat message
        armorRest = armor - armorDmg < 0 ? 0 : armor - armorDmg;
        actor.update({
          'system.armure.value': armorRest,
        });

        // Check if the actor got the 'Infatigable' advantage
        if (
          !actor.items.find(
            (e) => e.name === 'Infatigable' && e.type === 'avantage'
          ) &&
          sante > 0 &&
          dmgZone.sante
        ) {
          // Update the actor and the chat message
          santeDamagesFromArmor = (armorDmg / 5) << 0;
          santeRest =
            sante - santeDamagesFromArmor < 0 ? 0 : sante - santeDamagesFromArmor;
          actor.update({
            'system.sante.value': santeRest,
          });
          santeDmg = santeDamagesFromArmor;
        }
      }

      // ################
      // Damages on sante
      // ################
      if (sante > 0 && damagesLeft > 0 && dmgZone.sante) {
        // Check if the damages are upper than the health
        if (damagesLeft > sante) {
          santeDmg += sante;
        } else {
          santeDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= sante;

        // Update the actor and the chat message
        santeRest = sante - santeDmg < 0 ? 0 : sante - santeDmg;
        actor.update({
          'system.sante.value': santeRest,
        });
      }

      // ##################
      // Damages on energie
      // ##################
      if (energie > 0 && damagesLeft > 0 && dmgZone.energie) {
        // Check if the damages are upper than the health
        if (damagesLeft > energie) {
          energieDmg += energie;
        } else {
          energieDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= energie;

        // Update the actor and the chat message
        energieRest = energie - energieDmg < 0 ? 0 : energie - energieDmg;
        actor.update({
          'system.energie.value': energieRest,
        });
      }

      // #################
      // Damages on espoir
      // #################
      if (espoir > 0 && damagesLeft > 0 && dmgZone.espoir) {
        // Check if the damages are upper than the health
        if (damagesLeft > espoir) {
          espoirDmg += espoir;
        } else {
          espoirDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= espoir;

        // Update the actor and the chat message
        espoirRest = espoir - espoirDmg < 0 ? 0 : espoir - espoirDmg;
        actor.update({
          'system.espoir.value': espoirRest,
        });
      }

      const stringLiaison = (dmgZone, values) => {
        let zones = Object.keys(dmgZone)
          .filter((e) => !values.includes(e))
          .filter((e) => dmgZone[e] === true).length;
        const result = zones > 1 ? ', ' : zones === 1 ? ' et ' : '.';

        return result;
      };

      // Set the message
      chatMessage = `
        <h3>
          ${
            [armorDmg, santeDmg, energieDmg, espoirDmg].find((e) => e > 0)
              ? 'Dégâts reçus !'
              : 'Dégâts mitigés !'
          }
        </h3>
        <p>
          Sur <b>${dmg}</b> dégâts, <u>${actor.name}</u> perd
          ${
            dmgZone.armure
              ? `<b>${armorDmg} PA</b>${stringLiaison(dmgZone, ['armure'])}`
              : ''
          }
          ${
            dmgZone.sante
              ? `<b>${santeDmg} PS</b>${
                  santeDamagesFromArmor > 0
                    ? ` (dont ${santeDamagesFromArmor} lié au choc de l'armure)`
                    : ''
                }${stringLiaison(dmgZone, ['armure', 'sante'])}`
              : ''
          }
          ${
            dmgZone.energie
              ? `<b>${energieDmg} PE</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                ])}`
              : ''
          }
          ${
            dmgZone.espoir
              ? `<b>${espoirDmg} PEs</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                  'espoir',
                ])}`
              : ''
          }
        </p>
        <p>
          Il avait
          ${
            dmgZone.armure
              ? `<b>${armor} PA</b>${stringLiaison(dmgZone, ['armure'])}`
              : ''
          }
          ${
            dmgZone.sante
              ? `<b>${sante} PS</b>${stringLiaison(dmgZone, ['armure', 'sante'])}`
              : ''
          }
          ${
            dmgZone.energie
              ? `<b>${energie} PE</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                ])}`
              : ''
          }
          ${
            dmgZone.espoir
              ? `<b>${espoir} PEs</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                  'espoir',
                ])}`
              : ''
          }
        </p>
        <p>
          Il lui reste
          ${
            dmgZone.armure
              ? `<b>${armorRest} PA</b>${stringLiaison(dmgZone, ['armure'])}`
              : ''
          }
          ${
            dmgZone.sante
              ? `<b>${santeRest} PS</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                ])}`
              : ''
          }
          ${
            dmgZone.energie
              ? `<b>${energieRest} PE</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                ])}`
              : ''
          }
          ${
            dmgZone.espoir
              ? `<b>${espoirRest} PEs</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                  'espoir',
                ])}`
              : ''
          }
        </p>
        `;

      // Check if the armor need to fold
      if (armorRest <= 0 && hasSante) {
        if (actor.system.wear !== 'guardian') {
          chatMessage += `<p>L'armure se fold.</p>`;
          // actor.update({ 'system.wear': 'guardian' }); //TODO Bug, it set the armor at 13 and the guardian armor value at 0
        } else {
          chatMessage += `<p>La tenue guardian ne le protège plus</p>`;
        }
      }

      // Check if the player is dead
      if ((hasSante && santeRest <= 0) || (!hasSante && armorRest <= 0)) {
        chatMessage += `<p><u>${actor.name}</u> est <b>grièvement blessé et tombe à terre</b>.</p>`;
        token.toggleEffect('icons/svg/skull.svg');
      }

      // Check if the player sinks into despair
      if (espoirRest <= 0) {
        chatMessage += `<p><u>${actor.name}</u> <b>succombe au DÉSESPOIR !</b></p>`;
        token.toggleEffect('icons/svg/skull.svg');
      }

      // Send message
      ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: chatMessage,
      });
      return;
    }

    // Windows parameters
    const dialogOptions = {
      default: {
        height: 100,
        width: 554,
      },
      player: {
        height: 200,
        width: 554,
      },
      other: {
        height: 174,
        width: 554,
      },
    };

    // Dialog options for players damages
    const playerDialog = (data) => {
      // Get params
      const {
        token,
        dmg,
        igncdf = false,
        ignarm = false,
        ignegi = false,
        esquive = false,
        pierceArmor = 0,
        penetrating = 0,
        dmgZone = {
          armure: true,
          sante: true,
          energie: false,
          espoir: false,
        },
      } = data;

      return new Dialog(
        {
          title: 'Knight • Damage Joueurs',
          content: `
          <div style="display: flex; flex-direction: column; padding-bottom: 8px;">
            <div style="display: flex; padding-bottom: 4px;">
              <div style="display: flex; flex-direction: row; align-items: center; width: 40%;">
                <label for="dmg">
                  Dégâts bruts reçus :
                </label>
                <input type="number" name="damage" id="dmg" min="0" step="1" style="max-width: 60px; margin-left: 8px;" value="${dmg}"/>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; width: 60%;">
                <div>
                  Dégâts sur :
                </div>
                <div>
                  <div style="display: flex; align-items: center; width: 50%;">
                    <input type="checkbox" name="armureDmg" id="armureDmg" ${dmgZone.armure ? "checked" : ""}/>
                    <label for="armureDmg">
                      Armure
                    </label>
                  </div>
                  <div style="display: flex; align-items: center; width: 50%;">
                    <input type="checkbox" name="santeDmg" id="santeDmg" ${dmgZone.sante ? "checked" : ""}/>
                    <label for="santeDmg">
                      Santé
                    </label>
                  </div>
                </div>
                <div>
                  <div style="display: flex; align-items: center; width: 50%;">
                    <input type="checkbox" name="energieDmg" id="energieDmg" ${dmgZone.energie ? "checked" : ""}/>
                    <label for="energieDmg">
                      Énergie
                    </label>
                  </div>
                  <div style="display: flex; align-items: center; width: 50%;">
                    <input type="checkbox" name="espoirDmg" id="espoirDmg" ${dmgZone.espoir ? "checked" : ""}/>
                    <label for="espoirDmg">
                      Espoir
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div style="display: flex; padding-bottom: 4px;">
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="igncdf" id="igncdf" ${igncdf ? "checked" : ""}/>
                <label for="igncdf">
                  Ignore champ de force
                </label>
              </div>
            <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="ignegi" id="ignegi" ${ignegi ? "checked" : ""}/>
                <label for="ignegi">
                  Ignore l'égide
                </label>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; width: 33%;">
                <label for="penetrating">Pénétrant :</label>
                <input type="number" name="penetrating" id="penetrating" min="0" value="${penetrating}" style="max-width: 50px; margin-left: 8px;"/>
              </div>
            </div>
            <div style="display: flex;">
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="ignarm" id="ignarm" ${ignarm ? "checked" : ""}/>
                <label for="ignarm">
                  Ignore l'armure
                </label>
              </div>
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="esquive" id="esquive" ${esquive ? "checked" : ""}/>
                <label for="esquive">
                  Dégâts / 2
                </label>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; width: 33%;">
                <label for="pierceArmor">Perce armure :</label>
                <input type="number" name="pierceArmor" id="pierceArmor" min="0" value="${pierceArmor}" style="max-width: 50px; margin-left: 8px;"/>
              </div>
            </div>
          </div>`,

          buttons: {
            Calculer: {
              icon: '<i class="fas fa-check"></i>',
              label: 'Calculer',
              callback: async (html) =>
                displayDamageOnPJ({
                  token: token,
                  dmg: html.find('#dmg')[0].value,
                  igncdf: html.find('#igncdf')[0].checked,
                  ignarm: html.find('#ignarm')[0].checked,
                  ignegi: html.find('#ignegi')[0].checked,
                  esquive: html.find('#esquive')[0].checked,
                  pierceArmor: html.find('#pierceArmor')[0].value,
                  penetrating: html.find('#penetrating')[0].value,
                  dmgZone: {
                    armure: html.find('#armureDmg')[0].checked,
                    sante: html.find('#santeDmg')[0].checked,
                    energie: html.find('#energieDmg')[0].checked,
                    espoir: html.find('#espoirDmg')[0].checked,
                  },
                }),
            },

            Annuler: {
              icon: '<i class="fas fa-close"></i>',
              label: 'Cancel',
            },
          },
          default: 'close',
          close: () => {},
        },
        dialogOptions.player
      ).render(true);
    }

    // Dialog options for other damages
    const otherDialog = (data) => {
      // Get params
      const {
        token,
        dmg,
        igncdf = false,
        ignarm = false,
        antiAnatheme = false,
        antiVehicule = false,
        pierceArmor = 0,
        penetrating = 0,
        esquive = false
      } = data;

      return new Dialog(
        {
          title: 'Knight • Damage Non-Joueurs',
          content: `
          <div style="display: flex; flex-direction: column; padding-bottom: 8px;">
            <div style="display: flex; padding-bottom: 4px;">
              <div style="display: flex; flex-direction: row; align-items: center; width: 40%;">
                <label for="dmg">
                  Dégâts bruts reçus :
                </label>
                <input type="number" name="damage" id="dmg" min="0" step="1" style="max-width: 60px; margin-left: 8px;" value="${dmg}"/>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; width: 60%;">
                <div style="display: flex; align-items: center; width: 100%;">
                  <input type="checkbox" name="antiVehicule" id="antiVehicule" ${antiVehicule ? "checked" : ""} />
                  <label for="antiVehicule">
                    Anti-Véhicule
                  </label>
                </div>
              </div>
            </div>
            <div style="display: flex; padding-bottom: 4px;">
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="igncdf" id="igncdf" ${igncdf ? "checked" : ""} />
                <label for="igncdf">
                  Ignore champ de force
                </label>
              </div>
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="antiAnatheme" id="antiAnatheme" ${antiAnatheme ? "checked" : ""} />
                <label for="antiAnatheme">
                  Anti-Anathème
                </label>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; width: 33%;">
                <label for="penetrating">Pénétrant :</label>
                <input type="number" name="penetrating" id="penetrating" min="0" value="${penetrating}" style="max-width: 50px; margin-left: 8px;"/>
              </div>
            </div>
            <div style="display: flex;">
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="ignarm" id="ignarm" ${ignarm ? "checked" : ""} />
                <label for="ignarm">
                  Ignore l'armure
                </label>
              </div>
              <div style="display: flex; align-items: center; width: 33%;">
                <input type="checkbox" name="esquive" id="esquive" ${esquive ? "checked" : ""} />
                <label for="esquive">
                  Dégâts / 2
                </label>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; width: 33%;">
                <label for="pierceArmor">Perce armure :</label>
                <input type="number" name="pierceArmor" id="pierceArmor" min="0" value="${pierceArmor}" style="max-width: 50px; margin-left: 8px;"/>
              </div>
            </div>
          </div>`,

          buttons: {
            Calculer: {
              icon: '<i class="fas fa-check"></i>',
              label: 'Calculer',
              callback: async (html) =>
                displayDamageOnPNJ({
                  token: token,
                  dmg: html.find('#dmg')[0].value,
                  igncdf: html.find('#igncdf')[0].checked,
                  antiAnatheme: html.find('#antiAnatheme')[0].checked,
                  ignarm: html.find('#ignarm')[0].checked,
                  antiVehicule: html.find('#antiVehicule')[0].checked,
                  pierceArmor: html.find('#pierceArmor')[0].value,
                  penetrating: html.find('#penetrating')[0].value,
                  esquive: html.find('#esquive')[0].checked,
                }),
            },

            Annuler: {
              icon: '<i class="fas fa-close"></i>',
              label: 'Cancel',
            },
          },
          default: 'close',
          close: () => {},
        },
        dialogOptions.other
      ).render(true);
    }

    html.find('.knight-roll button.setDegats').click(async ev => {
      const tgt = $(ev.currentTarget);
      const tokenId = tgt.data('id');
      // console.log('tokenId', tokenId);
      const dmg = tgt.data('dmg');
      // console.log('dmg', dmg);

      const token = canvas?.tokens?.get(tokenId) ?? {isVisible:false};
      // console.log('token', token);

      const type = token.actor.type;
      // console.log('type', type);

      if (['pnj', 'creature', 'bande', 'vehicule'].includes(type)) {
        await otherDialog({token: token, dmg: dmg});
      }
      else if (['knight'].includes(type)) {
        await playerDialog({token: token, dmg: dmg});
      }
      else {
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({ actor: token.actor }),
          content: `<p><b>Ce type de cible n'est pas encore pris en compte.</b></p>`,
          whisper: [game.user._id],
        });
      }

      return;
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