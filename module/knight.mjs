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
      html.find('.knight-roll div.listTargets,div.onlyGm').remove();
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
        dmgBonus = 0,
        effects = [],
        igncdf = false,
        ignarm = false,
        antiAnatheme = false,
        antiVehicule = false,
        pierceArmor = 0,
        penetrating = 0,
        esquive = false
      } = data;

      // Get actor
      const actor = token.actor;

      // Chair exceptionnelle
      const hasChairMaj = !!actor.system.aspects?.chair?.ae?.majeur
      const chairEx =
        parseInt(actor.system.aspects?.chair?.ae?.mineur?.value || 0) +
        parseInt(actor.system.aspects?.chair?.ae?.majeur?.value || 0);

      const findValue = (name) =>
        ((typeof actor.system.options[name] !== 'undefined'
          ? actor.system.options[name]
          : true)
          && actor.system[name]?.value)
          ? actor.system[name]?.value
          : 0;

      // Bouclier
      const bouclier = findValue('bouclier');

      // Champ de Force
      const champDeForce = findValue('champDeForce');

      // Armor
      const armor = findValue('armure');
      let armorDmg = 0;

      // Sante
      const sante = findValue('sante');
      let santeDmg = 0;

      // Resilience
      const resilience = findValue('resilience');
      let resilienceDmg = 0;

      // isVehicule
      const isVehicule = actor.system.colosse
        || actor.type === 'vehicule'
        || false;

      // Other
      const assassin = effects.assassin || 0;
      let damageTotal = parseInt(dmg, 10) + parseInt(dmgBonus, 10) + assassin;
      let damagesLeft = damageTotal;
      let chatMessage = '';

      // Check if the target is still alive
      if (sante === 0 && armor === 0) {
        actor.toggleStatusEffect('dead', { active: true, overlay: true });
        chatMessage += `<p><b>${game.i18n.localize('KNIGHT.JETS.DEGATSAUTO.TargetAlreadyDead')}.</b></p>`;
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: chatMessage,
          whisper: [game.user._id],
        });
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
        damagesLeft = Math.ceil(damagesLeft / 10);
      }

      // Check if the esquive is used
      if (esquive) {
        damagesLeft = Math.ceil(damagesLeft / 2);
      }


      // #####################
      // Damages on resilience
      // #####################
      const briserResi = effects.briserlaresilience || 0;
      if (resilience > 0 && (damagesLeft > 0 || briserResi > 0)) {
        // Do briser la resilience damages
        let resilienceLessBriserResi = resilience;
        if (briserResi > 0) {
          if (resilience > briserResi) {
            resilienceLessBriserResi -= briserResi;
            resilienceDmg += briserResi;
          } else {
            resilienceLessBriserResi = 0
            resilienceDmg += resilience;
          }
        }

        // Check if the damages are upper than the resilience
        if (damagesLeft > resilienceLessBriserResi) {
          resilienceDmg += resilienceLessBriserResi;
        } else {
          resilienceDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= resilienceLessBriserResi;

        // Update the actor and the chat message
        const resilienceRest =
          resilience - resilienceDmg < 0 ? 0 : resilience - resilienceDmg;
        actor.update({
          'system.resilience.value': resilienceRest,
        });
        chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: resilienceDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Resilience"), dmgRest: resilienceRest});
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
        // Do destructeur damages
        const destructeur = effects.destructeur || 0;
        let armorLessDestructeur = armor;
        if (destructeur > 0) {
          if (armor > destructeur) {
            armorLessDestructeur -= destructeur;
            armorDmg += destructeur;
          } else {
            armorLessDestructeur = 0
            armorDmg += armor;
          }
        }

        // Check if the damages are upper than the armor
        if (damagesLeft > armorLessDestructeur) {
          armorDmg += armorLessDestructeur;
        } else {
          armorDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= armorLessDestructeur;

        // Update the actor and the chat message
        const armorRest = armor - armorDmg < 0 ? 0 : armor - armorDmg;
        actor.update({
          'system.armure.value': armorRest,
        });
        chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: armorDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Armure"), dmgRest: armorRest});
      }

      // ################
      // Damages on sante
      // ################
      if (sante > 0 && damagesLeft > 0) {
        let santeLessMeurtrier = sante;

        // Do meurtrier damages
        const meurtrier = effects.meurtrier || 0;
        if (meurtrier > 0 && !hasChairMaj) {
          if (sante > meurtrier) {
            santeLessMeurtrier -= meurtrier;
            santeDmg += meurtrier;
          } else {
            santeLessMeurtrier = 0
            santeDmg += sante;
          }
        }

        // PNJ is a bande
        if (actor.type === "bande") {
          // Do fureur damages
          const fureur = effects.fureur || 0;
          if (fureur > 0 && actor?.system?.aspects?.chair?.value >= 10) {
            if (sante > fureur) {
              santeLessMeurtrier -= fureur;
              santeDmg += fureur;
            } else {
              santeLessMeurtrier = 0
              santeDmg += sante;
            }
          }

          // Do ultraviolence damages
          const ultraviolence = effects.ultraviolence || 0;
          if (ultraviolence > 0 && actor?.system?.aspects?.chair?.value < 10) {
            if (sante > ultraviolence) {
              santeLessMeurtrier -= ultraviolence;
              santeDmg += ultraviolence;
            } else {
              santeLessMeurtrier = 0
              santeDmg += sante;
            }
          }

          // Do intimidantana damages
          const intimidantana = effects.intimidantana || 0;
          if (intimidantana > 0) {
            if (sante > intimidantana) {
              santeLessMeurtrier -= intimidantana;
              santeDmg += intimidantana;
            } else {
              santeLessMeurtrier = 0
              santeDmg += sante;
            }
          }

          // Do intimidanthum damages
          const intimidanthum = effects.intimidanthum || 0;
          if (intimidanthum > 0) {
            if (sante > intimidanthum) {
              santeLessMeurtrier -= intimidanthum;
              santeDmg += intimidanthum;
            } else {
              santeLessMeurtrier = 0
              santeDmg += sante;
            }
          }
        }

        // Check if the damages are upper than the armor
        if (damagesLeft > santeLessMeurtrier) {
          santeDmg += santeLessMeurtrier;
        } else {
          santeDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= santeLessMeurtrier;

        // Update the actor and the chat message
        const santeRest = sante - santeDmg < 0 ? 0 : sante - santeDmg;
        actor.update({
          'system.sante.value': santeRest,
        });
        chatMessage += game.i18n.format("KNIGHT.JETS.DEGATSAUTO.DamageOnAndRest", {dmg: santeDmg, valueName: game.i18n.format("KNIGHT.LATERAL.Sante"), dmgRest: santeRest});
      }

      // Set the creature dead
      if (damagesLeft >= 0) {
        chatMessage += `<p><b>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.TargetDead")}.</b></p>`;
        actor.toggleStatusEffect('dead', { active: true, overlay: true });
      }

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
        dmgBonus = 0,
        effects = [],
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

      const findValue = (name) =>
        (actor.system.jauges[name] && actor.system[name]?.value)
          ? actor.system[name]?.value
          : 0;

      // Champ de Force
      const champDeForce = findValue('champDeForce');

      // Egide
      const egide = findValue('egide');

      // Armor
      const armor = findValue('armure');
      let armorDmg = 0;
      let armorRest = armor;

      // Sante
      const sante = findValue('sante');
      const hasSante = actor.system.jauges.sante === true;
      let santeDmg = 0;
      let santeRest = sante;
      let santeDamagesFromArmor = 0;

      // Energie
      const energie = findValue('energie');
      let energieDmg = 0;
      let energieRest = energie;

      // Espoir
      const espoir = findValue('espoir');
      let espoirDmg = 0;
      let espoirRest = espoir;

      // Other
      const assassin = effects.assassin || 0;
      let damageTotal = parseInt(dmg, 10) + parseInt(dmgBonus, 10) + assassin;
      let damagesLeft = damageTotal;
      let chatMessage = '';

      // Check if the target is still alive
      if ((hasSante && sante === 0) && armor === 0) {
        actor.toggleStatusEffect('dead', { active: true, overlay: true });
        chatMessage += `<p><b>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.TargetAlreadyDead")}.</b></p>`;
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: chatMessage,
          whisper: [game.user._id],
        });
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
        damagesLeft = Math.ceil(damagesLeft / 2);
      }

      // ################
      // Damages on armor
      // ################
      if (
        armor > 0 &&
        damagesLeft > 0 &&
        armor >= pierceArmor &&
        dmgZone.armure &&
        (!ignarm || sante === 0 || (!dmgZone.sante && ignarm))
      ) {
        // Do destructeur damages
        const destructeur = effects.destructeur || 0;
        let armorLessDestructeur = armor;
        if (destructeur > 0) {
          if (armor > destructeur) {
            armorLessDestructeur -= destructeur;
            armorDmg += destructeur;
          } else {
            armorLessDestructeur = 0
            armorDmg += armor;
          }
        }

        // Check if the damages are upper than the armor
        if (damagesLeft > armorLessDestructeur) {
          armorDmg += armorLessDestructeur;
        } else {
          armorDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= armorLessDestructeur;

        // Update the actor and the chat message
        armorRest = armor - armorDmg < 0 ? 0 : armor - armorDmg;
        actor.update({
          'system.armure.value': armorRest,
        });

        // Check if the actor got the 'Infatigable' advantage
        if (
          !actor.items.find(
            (e) => e.system?.bonus?.noDmgSante && e.type === 'avantage'
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
        // Do meurtrier damages
        const meurtrier = effects.meurtrier || 0;
        let santeLessMeurtrier = sante;
        if (meurtrier > 0) {
          if (sante > meurtrier) {
            santeLessMeurtrier -= meurtrier;
            santeDmg += meurtrier;
          } else {
            santeLessMeurtrier = 0
            santeDmg += sante;
          }
        }

        // Check if the damages are upper than the armor
        if (damagesLeft > santeLessMeurtrier) {
          santeDmg += santeLessMeurtrier;
        } else {
          santeDmg += damagesLeft > 0 ? damagesLeft : 0;
        }

        // Set the damages left
        damagesLeft -= santeLessMeurtrier;

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
        const result = zones > 1 ? ', ' : zones === 1 ? ` ${game.i18n.localize("KNIGHT.AUTRE.And")} ` : '.';

        return result;
      };

      // Set the message
      chatMessage = `
        <h3>
          ${
            [armorDmg, santeDmg, energieDmg, espoirDmg].find((e) => e > 0)
              ? game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.DamageReceived") + ' !'
              : game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.DamageMixed") + ' !'
          }
        </h3>
        <p>
          ${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjDamageMessageStart", {damageTotal: damageTotal, actorName: actor.name})}
          ${
            dmgZone.armure
              ? `<b>${armorDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointArmure-short")}</b>${stringLiaison(dmgZone, ['armure'])}`
              : ''
          }
          ${
            dmgZone.sante
              ? `<b>${santeDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointSante-short")}</b>${
                  santeDamagesFromArmor > 0
                    ? ` (${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjDamageMessageArmorChocHealth", {dmg: santeDamagesFromArmor})})`
                    : ''
                }${stringLiaison(dmgZone, ['armure', 'sante'])}`
              : ''
          }
          ${
            dmgZone.energie
              ? `<b>${energieDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointEnergie-short")}</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                ])}`
              : ''
          }
          ${
            dmgZone.espoir
              ? `<b>${espoirDmg} ${game.i18n.localize("KNIGHT.AUTRE.PointEspoir-short")}</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                  'espoir',
                ])}`
              : ''
          }
        </p>
        <p>
          ${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.HeHad")}
          ${
            dmgZone.armure
              ? `<b>${armor} ${game.i18n.localize("KNIGHT.AUTRE.PointArmure-short")}</b>${stringLiaison(dmgZone, ['armure'])}`
              : ''
          }
          ${
            dmgZone.sante
              ? `<b>${sante} ${game.i18n.localize("KNIGHT.AUTRE.PointSante-short")}</b>${stringLiaison(dmgZone, ['armure', 'sante'])}`
              : ''
          }
          ${
            dmgZone.energie
              ? `<b>${energie} ${game.i18n.localize("KNIGHT.AUTRE.PointEnergie-short")}</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                ])}`
              : ''
          }
          ${
            dmgZone.espoir
              ? `<b>${espoir} ${game.i18n.localize("KNIGHT.AUTRE.PointEspoir-short")}</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                  'espoir',
                ])}`
              : ''
          }
        </p>
        <p>
          ${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.HeHasLeft")}
          ${
            dmgZone.armure
              ? `<b>${armorRest} ${game.i18n.localize("KNIGHT.AUTRE.PointArmure-short")}</b>${stringLiaison(dmgZone, ['armure'])}`
              : ''
          }
          ${
            dmgZone.sante
              ? `<b>${santeRest} ${game.i18n.localize("KNIGHT.AUTRE.PointSante-short")}</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                ])}`
              : ''
          }
          ${
            dmgZone.energie
              ? `<b>${energieRest} ${game.i18n.localize("KNIGHT.AUTRE.PointEnergie-short")}</b>${stringLiaison(dmgZone, [
                  'armure',
                  'sante',
                  'energie',
                ])}`
              : ''
          }
          ${
            dmgZone.espoir
              ? `<b>${espoirRest} ${game.i18n.localize("KNIGHT.AUTRE.PointEspoir-short")}</b>${stringLiaison(dmgZone, [
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
          chatMessage += `<p>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.ArmorFolds")}.</p>`;
          // actor.update({ 'system.wear': 'guardian' }); //TODO Bug, it set the armor at 13 and the guardian armor value at 0
        } else {
          chatMessage += `<p>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.GuardianDontProtect")}</p>`;
        }
      }

      // Check if the player is dead
      if ((hasSante && santeRest <= 0) || (!hasSante && armorRest <= 0)) {
        chatMessage += `<p>${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjDead", {name: actor.name})}.</p>`;
        actor.toggleStatusEffect('dead', { active: true, overlay: true });
      }

      // Check if the player sinks into despair
      if (espoirRest <= 0) {
        chatMessage += `<p>${game.i18n.format("KNIGHT.JETS.DEGATSAUTO.PjHopeless", {name: actor.name})}</p>`;
        actor.toggleStatusEffect('dead', { active: true, overlay: true });
      }

      // Send message
      ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: chatMessage,
      });
      return;
    }

    // Create dialog for damages
    const doDamages = async (data) => {
      // Get data
      const {tokenId, dmg, effects, dmgType} = data;

      // Get token
      const token = canvas?.tokens?.get(tokenId) ?? {isVisible:false};

      // Set damage zone for PJs
      const dmgZone = {
        armure: true,
        sante: true,
        energie: false,
        espoir: false,
      };

      if (['pnj', 'creature', 'bande', 'vehicule'].includes(token.actor.type)) {
        // Updates for PNJs
      }
      else if (['knight'].includes(token.actor.type)) {
        // Updates for PJs

        // If Anatheme effect
        if (effects.anatheme) {
          dmgZone.armure = false;
          dmgZone.sante = false;
          dmgZone.energie = false;
          dmgZone.espoir = true;
        }
      }
      else {
        // The target is not accepted yet
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({ actor: token.actor }),
          content: `<p><b>${game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.TargetNotYetvalid")}.</b></p>`,
          whisper: [game.user._id],
        });
        return;
      }

      // Get damages less bonuses like fureur and ultraviolence
      let damages = dmg;
      if (token.actor.type === "bande") {
        if (effects.fureur && token.actor?.system?.aspects?.chair?.value >= 10) {
          damages -= effects.fureur
        }
        if (effects.ultraviolence && token.actor?.system?.aspects?.chair?.value < 10) {
          damages -= effects.ultraviolence
        }
      }

      // Get the template
      const content = await renderTemplate('systems/knight/templates/dialog/damage-sheet.html', {
        pj : ['knight'].includes(token.actor.type),
        pnj : ['pnj', 'creature', 'bande', 'vehicule'].includes(token.actor.type),
        bande : ['bande'].includes(token.actor.type),
        token,
        dmg: damages,
        effects,
        dmgZone
      });

      const dialogTitle = () => {
        let result = game.i18n.localize("ACTOR.TypeKnight") + ' • ';

        if (dmgType === "damage") {
          result += game.i18n.localize("KNIGHT.AUTRE.Degats");
        } else if (dmgType === "violence") {
          result += game.i18n.localize("KNIGHT.AUTRE.Violence");
        } else if (dmgType === "debordement") {
          result += game.i18n.localize("KNIGHT.AUTRE.Debordement");
        } else {
          // Set an error
        }
        result += ' ';
        if (['knight'].includes(token.actor.type)) {
          result += game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.ToPj");
        } else {
          result += game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.ToPnj");
        }
        result += ' : ' + token.actor.name

        return result;
      }

      // Send the dialog
      return new Dialog(
        {
          title: dialogTitle(),
          content: content,
          buttons: {
            Calculer: {
              icon: '<i class="fas fa-check"></i>',
              label: game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.Calculate"),
              callback: async (html) =>
                {
                  // Updates the effects
                  ['meurtrier', 'destructeur', 'briserlaresilience', 'assassin', 'fureur', 'ultraviolence', 'intimidantana', 'intimidanthum'].forEach(effectName => {
                    if (html.find('#'+effectName)[0]?.value) {
                      effects[effectName] = parseInt(html.find('#'+effectName)[0].value, 10);
                    }
                  });

                  // Get the datas
                  const data = {
                    token: token,
                    dmg: html.find('#dmg')[0]?.value,
                    effects: effects,
                    dmgBonus: html.find('#dmgBonus')[0]?.value,
                    igncdf: html.find('#igncdf')[0]?.checked,
                    ignarm: html.find('#ignarm')[0]?.checked,
                    ignegi: html.find('#ignegi')[0]?.checked,
                    esquive: html.find('#esquive')[0]?.checked,
                    pierceArmor: html.find('#pierceArmor')[0]?.value,
                    penetrating: html.find('#penetrating')[0]?.value,
                    dmgZone: {
                      armure: html.find('#armureDmg')[0]?.checked,
                      sante: html.find('#santeDmg')[0]?.checked,
                      energie: html.find('#energieDmg')[0]?.checked,
                      espoir: html.find('#espoirDmg')[0]?.checked,
                    },
                    antiAnatheme: html.find('#antiAnatheme')[0]?.checked,
                    antiVehicule: html.find('#antiVehicule')[0]?.checked,
                  }

                  // Select the good damages
                  if (['knight'].includes(token.actor.type)) {
                    return displayDamageOnPJ(data);
                  } else {
                    return displayDamageOnPNJ(data);
                  }
                },
            },

            Annuler: {
              icon: '<i class="fas fa-close"></i>',
              label: game.i18n.localize("KNIGHT.JETS.DEGATSAUTO.Cancel"),
            },
          },
          default: 'close',
          close: () => {},
        },
        {
          classes: ["dialog", "knight", "damageDialog"],
          width: 650
        }
      ).render(true);
    }

    html.find('.knight-roll button.setDegats').click(async ev => {
      const tgt = $(ev.currentTarget);
      const tokenId = tgt.data('id');
      const dmg = tgt.data('dmg');
      const dmgType = tgt.data('dmgtype');
      const effects = {};
      tgt
        .data('effects')
        ?.split(',')
        ?.map((e) => {
          effects[e.split(' ')[0]] =
            e.split(' ')[e.split(' ').length - 1] &&
            !Number.isNaN(parseInt(e.split(' ')[e.split(' ').length - 1]))
              ? parseInt(e.split(' ')[e.split(' ').length - 1])
              : true;
        });

      // Do damages
      await doDamages({tokenId, dmg, effects, dmgType});
    });

    html.find('.knight-roll button.setDegatsAllTargets').click(async ev => {
      const tgt = $(ev.currentTarget);
      const alltargets = tgt.data('alltargets');
      const dmgType = tgt.data('dmgtype');
      const effects = {};
      tgt
        .data('effects')
        ?.split(',')
        ?.map((e) => {
          effects[e.split(' ')[0]] =
            e.split(' ')[e.split(' ').length - 1] &&
            !Number.isNaN(parseInt(e.split(' ')[e.split(' ').length - 1]))
              ? parseInt(e.split(' ')[e.split(' ').length - 1])
              : true;
        });

      const targetsIdsDmgs = alltargets.split(',');

      for (let i = 0; i < targetsIdsDmgs.length; i++) {
        // Get token id
        const tokenId = targetsIdsDmgs[i].split('-')[0];

        // Get dmg
        const dmg = targetsIdsDmgs[i].split('-')[1];

        // Do damages
        await doDamages({tokenId, dmg, effects, dmgType});
      }
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
        name:`${flags.flavor} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
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