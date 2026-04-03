import {
  confirmationDialog,
  getArmor,
  getArmorLegend,
} from "../../helpers/common.mjs";

import ArmureAPI from "../../utils/armureAPI.mjs";
import ArmureLegendeAPI from "../../utils/armureLegendeAPI.mjs";

const HumanMixinSheet = (superclass) => class extends superclass {
  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    this.#cyberwareListeners(html);
    this.#itemsListeners(html);
    this.#armoredListeners(html);

    html.find('button.recover').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");

      this.actor.system.askToRestore(type);
    });

    html.find('i.moduleArrowUp').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const niveau = Number(target.data("niveau"))+1;
      const item = this.actor.items.get(key);

      const gloireListe = this.actor.system.progression.gloire.depense.liste;
      const gloireMax = this._getHighestOrder(gloireListe);

      const data = {
        "niveau":{
          "value":niveau,
          "details":{
            [`n${niveau}`]:{
              "addOrder":gloireMax+1
            }
          }
        }
      }

      item.update({[`system`]:data});
    });

    html.find('i.moduleArrowDown').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const niveau = Number(target.data("niveau"))-1;
      const item = this.actor.items.get(key);

      const data = {
        "niveau":{
          "value":niveau
        }
      }

      item.update({[`system`]:data});
    });
  }

  #cyberwareListeners(html) {
    html.find('.cyberware .activation').click(async ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      item.system.activate();
    });

    html.find('.cyberware button.recuperation').click(async ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      item.system.recuperer();
    });

    html.find('div.cyberware input.cyberwareRecuperation').change(async ev => {
      const tgt = $(ev.currentTarget);
      const header = tgt.parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));
      const value = tgt.val();

      item.update({['system.recuperation.limite.value']:value},
      { render: false });

      if(item.system.recuperation.limite.max < value) {
        tgt.val(item.system.recuperation.limite.max)
      }
    });
  }

  #itemsListeners(html) {
    html.find('a.add').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");

      let update = {};

      switch(type) {
        case 'grenade':
          const getGrenades = this.actor.system.combat.grenades.liste;
          let maxGrenadeNumber = 5; // commence à 5 car on veut au moins 6

          Object.keys(getGrenades).forEach(key => {
            const match = key.match(/^grenade_(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxGrenadeNumber) {
                maxGrenadeNumber = num;
              }
            }
          });

          update[`system.combat.grenades.liste`] = {
            [`grenade_${maxGrenadeNumber + 1}`]: {
              "custom":true,
              "label":"",
              "degats": {
                "dice": getGrenades.antiblindage.degats.dice
              },
              "violence": {
                "dice": getGrenades.antiblindage.violence.dice
              },
              "effets":{
                "liste":[],
                "raw":[],
                "custom":[]
              }
            }
          }
          break;
      }

      this.actor.update(update);
    });

    html.find('a.delete').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const id = target.data("id");

      let update = {};

      switch(type) {
        case 'grenade':
          update[`system.combat.grenades.liste.-=${id}`] = null;
          break;
      }

      this.actor.update(update);
    });

    html.find('div.grenades a.unlocked').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const grenades = this.actor.system.combat.grenades.liste[id];
      const unlocked = grenades?.unlocked ?? false;

      let update = {};
      update[`system.combat.grenades.liste.${id}.unlocked`] = !unlocked;

      this.actor.update(update);
    });
  }

  #armoredListeners(html) {
    html.find('.armure .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const subtype = target.data("subtype");
      const special = target.data("special");
      const value = target.data("value") ? false : true;
      const capacite = target.data("capacite");
      const variant = target.data("variant");
      const module = target.data("module");
      const index = target.data("index");
      const armure = await getArmor(this.actor);

      if(type === 'capacites') armure.system.activateCapacity({
        capacite,
        special,
        variant})

      if(type === 'module') {
        this.actor.items.get(module).system.activate(value, subtype)
      }

      if(type === 'modulePnj') {
        this.actor.items.get(module).system.activateNPC(value, subtype, index);
      }
    });

    html.find('.armure .activationLegende').click(async ev => {
      const target = $(ev.currentTarget);
      const capacite = target.data("capacite");
      const special = target.data("special");
      const variant = target.data("variant");
      const type = target.data("type");
      const armure = await getArmorLegend(this.actor);

      if(type === 'capacites') armure.system.activateCapacity({
        capacite,
        special,
        variant});
    });

    html.find('.armure .special').click(async ev => {
      const target = $(ev.currentTarget);
      const special = target.data("special");
      const label = target.data("name");
      const value =  eval(target.data("value"));
      const note = target.data("note");
      const base = target.data("base");
      const flux = +this.actor.system.flux.value;
      const armure = await getArmor(this.actor);

      switch(special) {
        case 'recolteflux':
          const limiteHC = +armure.system.special.selected.recolteflux.horsconflit.limite;

          let total = flux+value;

          if(note === 'horsConflit' && total > limiteHC) total = limiteHC;

          this.actor.update({[`system.flux.value`]:total});
          const dataMsg = {
            flavor:label,
            main:{
              total:value
            }
          };

          const msg = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', dataMsg)
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msg, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });
          break;
        case 'contrecoups':
          const id = this.actor.token ? this.actor.token.id : this.actor.id;

          const dialog = new game.knight.applications.KnightRollDialog(id, {
            label:label,
            base:base,
            btn:{
              nood:true,
            }
          });

          dialog.open();
          break;
        case 'energiedeficiente':
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label}`,
            dices:`${value}D6`,
          }, false);

          const rTotal = await roll.doRoll();

          await this._gainPE(rTotal);
          break;
      }
    });

    html.find('.armure .specialLegende').click(async ev => {
      const target = $(ev.currentTarget);
      const special = target.data("special");
      const label = target.data("name");
      const value =  eval(target.data("value"));
      const note = target.data("note");
      const flux = +this.actor.system.flux.value;
      const armure = this._getArmorLegende();

      switch(special) {
        case 'recolteflux':
          const limiteHC = +armure.system.special.selected.recolteflux.horsconflit.limite;

          let total = flux+value;

          if(note === 'horsConflit' && total > limiteHC) total = limiteHC;

          this.actor.update({[`system.flux.value`]:total});
          const dataMsg = {
            flavor:label,
            main:{
              total:value
            }
          };

          const msg = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', dataMsg)
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msg, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });
          break;
      }
    });

    html.find('.armure .capacitesultime .activateCU').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const id = target.data("id");
      const toupdate = target.data("toupdate");
      const value = target.data("value") ? false : true;
      const isinstant = target.data("isinstant");

      const actor = this.actor;
      const item = this.actor.items.get(id);
      const getData = this.actor.system;
      const getCUData = item.system.actives;

      const recuperation = getCUData.recuperation;
      const jet = getCUData.jet;
      const dgts = getCUData.degats;
      const viol = getCUData.violence;
      const effets = getCUData.effets;

      const update = {};

      const effect = [];

      if(value) {
        const energie = getCUData?.energie || 0;
        const heroisme = getCUData?.heroisme || 0;

        if(getData.heroisme.value-heroisme < 0) {
          const msgHeroisme = {
            flavor:`${label}`,
            main:{
              total:`${game.i18n.localize('KNIGHT.JETS.Notheroisme')}`
            }
          };

          const msgEnergieData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgHeroisme),
            sound: CONFIG.sounds.dice
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });

          return;
        }

        if(!await this._depensePE(label, energie, true, false, false, true)) return;

        if(!isinstant) item.update({[`system.${toupdate}`]:value});

        update['system.heroisme.value'] = getData.heroisme.value-heroisme;

        if(recuperation.PA) update[`system.armure.value`] = getData.armure.max;
        if(recuperation.PS) update[`system.sante.value`] = getData.sante.max;
        if(recuperation.PE) update[`system.energie.value`] = getData.energie.max;

        if(jet.actif && jet.isfixe) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label}`,
            dices:`${jet.fixe.dice}D6+${jet.fixe.fixe}`,
          }, false);

          const rTotal = await roll.doRoll();
        }

        if(dgts.actif && dgts.isfixe) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
            dices:`${dgts.fixe.dice}D6+${dgts.fixe.fixe}`,
          }, false);
          const weapon = roll.prepareWpnDistance({
            name:label,
            system:{
              degats:{dice:dgts.fixe.dice, fixe:dgts.fixe.fixe},
              violence:{dice:0, fixe:0},
              effets:dgts.effets,
            }
          });
          const options = weapon.options;

          for(let o of options) {
            o.active = true;
          }
          const flags = roll.getRollData(weapon)
          roll.setWeapon(weapon);

          await roll.doRollDamage(flags);
        }

        if(viol.actif && viol.isfixe) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}`,
            dices:`${dgts.fixe.dice}D6+${dgts.fixe.fixe}`,
          }, false);
          const weapon = roll.prepareWpnDistance({
            name:label,
            system:{
              degats:{dice:0, fixe:0},
              violence:{dice:viol.fixe.dice, fixe:viol.fixe.fixe},
              effets:dgts.effets,
            }
          });
          const options = weapon.options;

          for(let o of options) {
            o.active = true;
          }
          const flags = roll.getRollData(weapon)
          roll.setWeapon(weapon);

          await roll.doRollViolence(flags);
        }

        if(effets.actif) {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${label}`,
            dices:`0D6`,
          }, false);

          const rTotal = await roll.doRoll({}, effets);
        }

      } else if(!isinstant) item.update({[`system.${toupdate}`]:value});

      if(Object.keys(update).length > 0) actor.update(update);
    });

    html.find('.armure .capacitesultime .rollCU').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const id = target.data("id");
      const type = target.data("type");
      const nameList = target.data("rollcu");
      const paliers = target.data("paliers").split(',');
      const caracteristique = target.data("caracteristique");

      const actor = this.actor;
      const item = this.actor.items.get(id);
      const getData = this.actor.system;
      const getCUData = item.system.actives;

      const roll = getCUData[type];

      if(roll.actif && !roll.isfixe) {
        const selected = +html.find(`.armure .capacitesultime .${nameList}`).val();
        const energie = roll.variable.energie*(selected+1) || 0;
        const heroisme = getCUData?.heroisme || 0;

        if(getData.heroisme.value-heroisme < 0) {
          const msgHeroisme = {
            flavor:`${label}`,
            main:{
              total:`${game.i18n.localize('KNIGHT.JETS.Notheroisme')}`
            }
          };

          const msgEnergieData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgHeroisme),
            sound: CONFIG.sounds.dice
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });

          return;
        }

        if(!await this._depensePE(label, energie, true, false, false, true)) return;

        let paliersRoll;
        let rollDice;
        let rollFixe;

        switch(type) {
          case 'jet':
            const id = this.actor.token ? this.actor.token.id : this.actor.id;

            const dialog = new game.knight.applications.KnightRollDialog(id, {
              label:label,
              base:caracteristique,
            });

            dialog.open();
            break;
          case 'degats':
            paliersRoll = paliers[selected];
            rollDice = +paliersRoll.split('D6+')[0];
            rollFixe = +paliersRoll.split('D6+')[1];

            const rDegats = new game.knight.RollKnight(this.actor, {
              name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
            }, false);
            const wDegats = rDegats.prepareWpnDistance({
              name:label,
              system:{
                degats:{dice:rollDice, fixe:rollFixe},
                violence:{dice:0, fixe:0},
                effets:roll.effets,
              }
            });
            const optionsDegats = wDegats.options;

            for(let o of optionsDegats) {
              o.active = true;
            }
            const flagsDegats = rDegats.getRollData(wDegats)
            rDegats.setWeapon(wDegats);

            await rDegats.doRollDamage(flagsDegats);
          break;

          case 'violence':
            paliersRoll = paliers[selected];
            rollDice = +paliersRoll.split('D6+')[0];
            rollFixe = +paliersRoll.split('D6+')[1];

            const rViolence = new game.knight.RollKnight(this.actor, {
              name:`${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}`,
            }, false);
            const wViolence = rViolence.prepareWpnDistance({
              name:label,
              system:{
                degats:{dice:0, fixe:0},
                violence:{dice:rollDice, fixe:rollFixe},
                effets:roll.effets,
              }
            });
            const options = wViolence.options;

            for(let o of options) {
              o.active = true;
            }
            const flagsViolence = rViolence.getRollData(wViolence)
            rViolence.setWeapon(wViolence);

            await rViolence.doRollViolence(flagsViolence);
          break;
        }
      }
    });

    html.find('.armure .capacitesultime .majAscension').click(async ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const permanent = target.data("permanent");
      const prestige = target.data("prestige");
      const context = this.actor;
      const name = game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.ASCENSION.Label');

      const armure = context.items.find(items => items.type === 'armure');
      const exist = Array.from(game.actors).find(actors => actors.id === armure.system.capacites.selected.ascension.ascensionId);

      if(!exist && permanent) {
        let data = context.system;
        data.wear = "armure";
        data.isAscension = true;
        data.proprietaire = context._id;
        let clone = foundry.utils.deepClone(this.actor);
        let newActor = await Actor.create(clone);

        let update = {};
        update['name'] = `${name} : ${this.title}`;
        update['img'] = armure.img;
        update['system.wear'] = "ascension";
        update['system.equipements.ascension'] = this.actor.system.equipements.armure;

        if(!prestige) {
          for(let item of newActor.items) {
            const rareteWpn = item.system?.rarete ?? '';
            const rareteMdl = item.system?.niveau?.actuel?.rarete ?? '';

            if(((rareteWpn === 'prestige' || rareteMdl === 'prestige') && !prestige) || item.type === 'capaciteultime') item.delete();
          }
        }

        newActor.update(update);
        armure.update({[`system.capacites.selected.ascension`]:{
          ascensionId:newActor.id
        }});

      } else if(permanent) {
        let clone = foundry.utils.deepClone(this.actor);

        const update = {};
        update['name'] = `${name} : ${this.title}`;
        update['system'] = clone.system;
        update['img'] = armure.img;
        update['system.wear'] = "ascension";
        update['system.equipements.ascension'] = this.actor.system.equipements.armure;

        exist.update(update);

        let ascension = exist.items.find(items => items.type === 'armure');

        for(let item of exist.items) {
          await item.delete();
        }

        for(let item of this.actor.items) {
          const rareteWpn = item.system?.rarete ?? '';
          const rareteMdl = item.system?.niveau?.actuel?.rarete ?? '';
          if(((rareteWpn === 'prestige' || rareteMdl === 'prestige') && !prestige) || item.type === 'capaciteultime') continue;

          await Item.create(foundry.utils.deepClone(item), {parent: exist});
        }

        for(let item of exist.items.filter(items => items.type === 'armure')) {
          let itmUpdate = {};
          itmUpdate['system'] = ascension.system;
          itmUpdate['system.jauges.sante'] = false;
          itmUpdate['system.jauges.espoir'] = false;
          itmUpdate['system.jauges.heroisme'] = false;

          item.update(itmUpdate)
        }
      }
    });

    html.find('.armure .supplementaire').click(async ev => {
      const cout = eval($(ev.currentTarget).data("cout"));

      await this._depensePE('', cout, true, false, false, true);
    });

    html.find('.armure .prolonger').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget).data("name");
      const hasFlux = $(ev.currentTarget).data("flux") || false;
      const special = $(ev.currentTarget).data("special");
      const id = $(ev.currentTarget).data("id");
      const cout = eval($(ev.currentTarget).data("cout"));
      const flux = hasFlux != false ? eval(hasFlux) : false;
      const espoir = $(ev.currentTarget).data("espoir");

      await this._depensePE(name, cout, true, false, flux, true);

      switch(capacite) {
        case "illumination":
          switch(special) {
            case "torch":
            case "lighthouse":
            case "lantern":
            case "blaze":
            case "beacon":
            case "projector":
              await this._depensePE(`${name} : ${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.${special.toUpperCase()}.Label`)}`, espoir, true, true, false, true);
              break;
          }
          break;
      }
    });

    html.find('.armure .configurationWolf').click(async ev => {
      const target = $(ev.currentTarget);
      const configuration = target.data("configuration");
      const armure = await getArmor(this.actor);
      const armorCapacites = armure.system.capacites.selected.companions;
      const idWolf = armorCapacites.wolf.id;

      const actor1Wolf = game.actors.get(idWolf.id1);
      const actor2Wolf = game.actors.get(idWolf.id2);
      const actor3Wolf = game.actors.get(idWolf.id3);

      const wolf1Energie = +actor1Wolf.system.energie.value;
      const wolf2Energie = +actor2Wolf.system.energie.value;
      const wolf3Energie = +actor3Wolf.system.energie.value;
      let fonctionne = false;

      if(wolf1Energie-4 >= 0) {
        actor1Wolf.update({[`system`]:{
          'energie':{
            'value':wolf1Energie-4
          },
          'configurationActive':configuration
        }});
        fonctionne = true;
      }

      if(wolf2Energie-4 >= 0) {
        actor2Wolf.update({[`system`]:{
          'energie':{
            'value':wolf2Energie-4
          },
          'configurationActive':configuration
        }});
        fonctionne = true;
      }

      if(wolf3Energie-4 >= 0) {
        actor3Wolf.update({[`system`]:{
          'energie':{
            'value':wolf3Energie-4
          },
          'configurationActive':configuration
        }});
        fonctionne = true
      }

      if(fonctionne) {
        const msgCompanions = {
          flavor:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Change")}`,
          main:{
            total:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.${configuration.toUpperCase()}.Label`)}`
          }
        };

        const msgActiveCompanions = {
          user: game.user.id,
          speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
          sound: CONFIG.sounds.dice
        };

        await ChatMessage.create(msgActiveCompanions);
      }
    });

    html.find('.armure .useConfigurationWolf').click(async ev => {
      const target = $(ev.currentTarget);
      const configuration = target.data("configuration");
      const armure = await getArmor(this.actor);
      const armorCapacites = armure.system.capacites.selected.companions;
      const detailsConfigurations = armorCapacites.wolf.configurations;
      const idWolf = armorCapacites.wolf.id;

      const actor1Wolf = game.actors.get(idWolf.id1);
      const actor2Wolf = game.actors.get(idWolf.id2);
      const actor3Wolf = game.actors.get(idWolf.id3);

      const wolf1Energie = +actor1Wolf.system.energie.value;
      const wolf2Energie = +actor2Wolf.system.energie.value;
      const wolf3Energie = +actor3Wolf.system.energie.value;
      const depenseEnergie = +detailsConfigurations[configuration].energie;
      let fonctionne = false;

      if(wolf1Energie-depenseEnergie >= 0) {
        actor1Wolf.update({[`system`]:{
          'energie':{
            'value':wolf1Energie-depenseEnergie
          },
          'configurationActive':configuration
        }});
        fonctionne = true
      }

      if(wolf2Energie-depenseEnergie >= 0) {
        actor2Wolf.update({[`system`]:{
          'energie':{
            'value':wolf2Energie-depenseEnergie
          },
          'configurationActive':configuration
        }});
        fonctionne = true
      }

      if(wolf3Energie-depenseEnergie >= 0) {
        actor3Wolf.update({[`system`]:{
          'energie':{
            'value':wolf3Energie-depenseEnergie
          },
          'configurationActive':configuration
        }});
        fonctionne = true
      }
      if(fonctionne) {
        const msgCompanions = {
          flavor:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Use")}`,
          main:{
            total:`${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.${configuration.toUpperCase()}.Label`)}`
          }
        };

        const msgActiveCompanions = {
          user: game.user.id,
          speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
          sound: CONFIG.sounds.dice
        };

        await ChatMessage.create(msgActiveCompanions);
      }
    });

    html.find('.armure input.update').change(async ev => {
      const capacite = $(ev.currentTarget).data("capacite");
      const newV = $(ev.currentTarget).val();
      const oldV = $(ev.currentTarget).data("old");
      const cout = $(ev.currentTarget).data("cout");
      const flux = $(ev.currentTarget).data("flux") || false;

      const effect = [];

      switch(capacite) {
        case "goliath":
          if(newV > oldV) { await this._depensePE('', cout*(newV-oldV), true, false, flux, true); }
          break;
        case "puppet":
        case "totem":
        case "warlord":
          if(newV > oldV) { await this._depensePE('', cout*(newV-oldV), true, false, flux, true); }
          break;
      }
    });

    html.find('.armure .aChoisir').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const special = $(ev.currentTarget).data("special");
      const value = $(ev.currentTarget).data("value");

      const armure = await getArmor(this.actor);
      const armureLegende = await getArmorLegend(this.actor);

      let result = true;
      if(value === true) { result = false; }

      let update = {
        system:{
          equipements:{
            armure:{
              [type]:{
                [capacite]:{
                  choix:{
                    [special]:result
                  }
                }
              }
            }
          }
        }
      };

      let itemUpdate;

      if(capacite === 'warlordLegende') {
        itemUpdate =  {
          system:{
            capacites:{
              selected:{
                ['warlord']:{}
              }
            }
          }
        };
      } else if(capacite === 'typeLegende') {
        itemUpdate = {
          system:{
            capacites:{
              selected:{
                ['type']:{}
              }
            }
          }
        };
      } else {
        itemUpdate = {
          system:{
            capacites:{
              selected:{
                [capacite]:{}
              }
            }
          }
        };
      }


      let calcul;

      switch(capacite) {
        case "illumination":
          const illumination = armure.system.capacites.selected[capacite];
          const illuminationSelectionne = illumination.selectionne || 0;
          calcul = illuminationSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected[capacite].selectionne = calcul;
          itemUpdate.system.capacites.selected[capacite][special] = {};
          itemUpdate.system.capacites.selected[capacite][special].selectionne = result;

          armure.update(itemUpdate);
          break;
        case "type":
          const type = armure.system.capacites.selected[capacite];
          const typeSelectionne = type.selectionne || 0;
          calcul = typeSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected[capacite].selectionne = calcul;
          itemUpdate.system.capacites.selected[capacite].type = {};
          itemUpdate.system.capacites.selected[capacite].type[special] = {};
          itemUpdate.system.capacites.selected[capacite].type[special].selectionne = result;

          armure.update(itemUpdate);
          break;
        case "typeLegende":
          const typeLegende = armureLegende.system.capacites.selected['type'];
          const typeLegendeSelectionne = typeLegende.selectionne || 0;
          calcul = typeLegendeSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected['type'].selectionne = calcul;
          itemUpdate.system.capacites.selected['type'].type = {};
          itemUpdate.system.capacites.selected['type'].type[special] = {};
          itemUpdate.system.capacites.selected['type'].type[special].selectionne = result;

          armureLegende.update(itemUpdate);
          break;
        case "warlord":
          const warlord = armure.system.capacites.selected[capacite];
          const warlordSelectionne = warlord.impulsions.selectionne || 0;
          calcul = warlordSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected[capacite].impulsions = {};
          itemUpdate.system.capacites.selected[capacite].impulsions.selectionne = calcul;

          itemUpdate.system.capacites.selected[capacite].impulsions[special] = {};
          itemUpdate.system.capacites.selected[capacite].impulsions[special].choisi = result;

          armure.update(itemUpdate);
          break;
        case "warlordLegende":
          const warlordLegende = armureLegende.system.capacites.selected['warlord'];
          const warlordLegendeSelectionne = warlordLegende.impulsions.selectionne || 0;
          calcul = warlordLegendeSelectionne;

          if(result == true) {
            calcul += 1;
          } else {
            calcul -= 1;

            if(calcul < 0) { calcul = 0; }
          }

          itemUpdate.system.capacites.selected['warlord'] = {};
          itemUpdate.system.capacites.selected['warlord'].impulsions = {};
          itemUpdate.system.capacites.selected['warlord'].impulsions.selectionne = calcul;

          itemUpdate.system.capacites.selected['warlord'].impulsions[special] = {};
          itemUpdate.system.capacites.selected['warlord'].impulsions[special].choisi = result;

          armureLegende.update(itemUpdate);
          break;
        case "companions":
            const companions = armureLegende.system.capacites.selected[capacite];
            const nbreChoix = companions.nbreChoix;
            const isLionSelected = companions.lion.choisi;
            const isWolfSelected = companions.wolf.choisi;
            const isCrowSelected = companions.crow.choisi;
            let choixActuel = 0;

            if(isLionSelected || (special === 'lion' && result === true)) choixActuel += 1;
            if(isWolfSelected || (special === 'wolf' && result === true)) choixActuel += 1;
            if(isCrowSelected || (special === 'crow' && result === true)) choixActuel += 1;

            if(nbreChoix === choixActuel) itemUpdate.system.capacites.selected[capacite].choixFaits = true;

            itemUpdate.system.capacites.selected[capacite][special] = {};
            itemUpdate.system.capacites.selected[capacite][special].choisi = result;

            armureLegende.update(itemUpdate);
          break;
      }
    });

    html.find('.armure .degatsViolence').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const eRaw = target?.data("raw") || false;
      const eCustom = target?.data("custom") || '';
      const degatsD = target.data("degats");
      const degatsF = target?.data("degatsfixe") || 0;
      const violenceD = target.data("violence");
      const violenceF = target?.data("violencefixe") || 0;
      const cout = target?.data("cout") || false;
      const listtargets = game.user.targets;
      const allTargets = [];
      let activeTenebricide = true;

      if(listtargets && listtargets.size > 0) {
        for(let t of listtargets) {
          const actor = t.actor;

          allTargets.push({
              id:t.id,
              name:actor.name,
              aspects:actor.system.aspects,
              type:actor.type,
              effets:[],
          });
        }
      }

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false, false, true);

        if(!depense) return;
      }

      let raw = [];
      let custom = [];

      if(eRaw !== false) {
        raw = eRaw.split(',');
        custom = eCustom === '' ? [] : eCustom.split(',');
      }

      const roll = new game.knight.RollKnight(this.actor, {
        name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
      }, false);
      const weapon = roll.prepareWpnDistance({
        name:`${label}`,
        system:{
          degats:{dice:degatsD, fixe:degatsF},
          violence:{dice:violenceD, fixe:violenceF},
          effets:{raw:raw, custom:custom},
        }
      });
      if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
      const options = weapon.options;

      for(let o of options) {

        if(o.value === 'tenebricide') o.active = activeTenebricide;
        else o.active = true;
      }

      const flags = roll.getRollData(weapon, {targets:allTargets})
      roll.setWeapon(weapon);
      await roll.doRollDamage(flags);

      roll.setName(`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`);
      await roll.doRollViolence(flags);
    });

    html.find('.armure .degats').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const eRaw = target?.data("raw") || false;
      const eCustom = target?.data("custom") || '';
      const degatsD = target.data("degats");
      const degatsF = target?.data("degatsfixe") || 0;
      const cout = target?.data("cout") || false;
      const listtargets = game.user.targets;
      const allTargets = [];
      let activeTenebricide = true;

      if(listtargets && listtargets.size > 0) {
        for(let t of listtargets) {
          const actor = t.actor;

          allTargets.push({
              id:t.id,
              name:actor.name,
              aspects:actor.system.aspects,
              type:actor.type,
              effets:[],
          });
        }
      }

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false, false, true);

        if(!depense) return;
      }

      let raw = [];
      let custom = [];

      if(eRaw !== false) {
        raw = eRaw.split(',');
        custom = eCustom === '' ? [] : eCustom.split(',');
      }

      const roll = new game.knight.RollKnight(this.actor, {
        name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
      }, false);
      const weapon = roll.prepareWpnDistance({
        name:`${label}`,
        system:{
          degats:{dice:degatsD, fixe:degatsF},
          violence:{dice:0, fixe:0},
          effets:{raw:raw, custom:custom},
        }
      });

      if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
      const options = weapon.options;

      for(let o of options) {

        if(o.value === 'tenebricide') o.active = activeTenebricide;
        else o.active = true;
      }

      const flags = roll.getRollData(weapon, {targets:allTargets});
      roll.setWeapon(weapon);
      await roll.doRollDamage(flags);
    });

    html.find('.armure .violence').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const eRaw = target?.data("raw") || false;
      const eCustom = target?.data("custom") || '';
      const violenceD = target.data("violence");
      const violenceF = target?.data("violencefixe") || 0;
      const cout = target?.data("cout") || false;
      const listtargets = game.user.targets;
      const allTargets = [];
      let activeTenebricide = true;

      if(listtargets && listtargets.size > 0) {
        for(let t of listtargets) {
          const actor = t.actor;

          allTargets.push({
              id:t.id,
              name:actor.name,
              aspects:actor.system.aspects,
              type:actor.type,
              effets:[],
          });
        }
      }

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depensePE(label, tCout, true, false, false, true);

        if(!depense) return;
      }

      let raw = [];
      let custom = [];

      if(eRaw !== false) {
        raw = eRaw.split(',');
        custom = eCustom === '' ? [] : eCustom.split(',');
      }

      const roll = new game.knight.RollKnight(this.actor, {
        name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`,
      }, false);
      const weapon = roll.prepareWpnDistance({
        name:`${label}`,
        system:{
          degats:{dice:0, fixe:0},
          violence:{dice:violenceD, fixe:violenceF},
          effets:{raw:raw, custom:custom},
        }
      });

      if(weapon.effets.raw.includes('tenebricide') && !await confirmationDialog("active", "Activation", {effect:game.i18n.localize("KNIGHT.EFFETS.TENEBRICIDE.Label")})) activeTenebricide = false;
      const options = weapon.options;

      for(let o of options) {

        if(o.value === 'tenebricide') o.active = activeTenebricide;
        else o.active = true;
      }

      const flags = roll.getRollData(weapon, {targets:allTargets})
      roll.setWeapon(weapon);
      await roll.doRollViolence(flags);
    });

    html.find('div.armure div.capacites img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.mainData").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.data").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.data").position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      } else {
        if($(ev.currentTarget).parent().position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    html.find('div.armure div.special img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.mainData").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.data").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.data").position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      } else {
        if($(ev.currentTarget).parent().position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    html.find('div.armure div.bModule img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.mainBlock").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.data").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.data").position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      } else {
        if($(ev.currentTarget).parent().position().left > width) {
          position = "right";
          borderRadius = "border-top-right-radius";
        } else {
          position = "left";
          borderRadius = "border-top-left-radius";
        }
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });
  }

  async _onItemCreate_on(header, itemData) {
    await super._onItemCreate_on(header, itemData);
    const actor = this.actor;
    // Get the type of item to create.
    const type = header.dataset.type;
    const subtype = header.dataset?.subtype || false;
    const special = header.dataset?.special || false;
    //hasGloire
    const hasGloire = this.hasGloire;

    switch(type) {
      case 'avantage':
      case 'inconvenient':
        itemData.system.type = subtype ? subtype : 'standard';
        break;

      case 'module':
        const armor = await getArmor(actor);

        if(!armor) return;
        let hasCompanions = false;
        const armorLegende = await getArmorLegend(actor);

        const armorAPI = new ArmureAPI(armor);
        const companions = armorAPI.getCapacite('companions');

        if(companions) hasCompanions = true;

        if(armorLegende && !hasCompanions) {
          const armorLegendeAPI = new ArmureLegendeAPI(armorLegende);
          const companionsLegende = armorLegendeAPI.getCapacite('companions');

          if(companionsLegende) hasCompanions = true;
        }

        if(hasCompanions && special === 'lion') itemData.system.isLion = true;
        break;
    }

    if(hasGloire) {
      const typeToAddGloire = ['arme', 'module'];

      if(typeToAddGloire.includes(type)) {
        const gloireListe = actor.system?.progression?.gloire?.depense?.liste ?? {};
        const gloireMax = Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);

        if(type === 'module') {
          const niveau = itemData.system?.niveau?.value ?? 1;

          for(let i = 1;i <= niveau;i++) {
            itemData.system.details = {
              [`n${i}`]:{
                addOrder:gloireMax+i,
              }
            }
          }
        }
        else itemData.system.addOrder = gloireMax+1;
      }
    }
  }

  async _onItemCreate_post(create) {
    const type = create.type;
    let actorUpdate = {};

    if(type === 'armure') {
        const id = create._id;

        actorUpdate[`system.equipements.armure`] = {
          id:id,
          hasArmor:true,
        }
    }

    if(!foundry.utils.isEmpty(actorUpdate)) this.actor.update(actorUpdate);
  }

  async _onItemEdit_on(item, header) {
    const actor = this.actor;

    if(item.type === 'armure') this._resetArmure(actor);

    if(item.type === 'module') {
      const btnActivations = header.find('.activation');

      for(let b of btnActivations) {
        const target = $(b);
        const subtype = target.data("subtype");
        const index = target.data("index");

        if(!index) item.system.activate(false, subtype);
        if(index) item.system.activate(false, subtype, index);
      }
    }
  };

  async _onItemDelete_on(item) {
    const actor = this.actor;

    switch(item.type) {
      case 'armure':
        const legende = await getArmorLegend(actor);

        if(legende) await legende.delete();

        const update = {};
        update['system.equipements.armure.hasArmorLegende'] = false;

        await actor.update(update);
        await this._resetArmure(actor);
        break;

      case 'module':
        await this._resetModules(actor);
        break;
    }
  };

  async _onDropItemCreate_on(itemData) {
    const actor = this.actor;
    const items = actor.items;
    const actorData = actor.system;
    const hasArmor = await getArmor(actor);
    const hasArmorLegende = await getArmorLegend(actor);
    let level = 1;

    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;
    let itemUpdate = {};

    if (!this.itemTypesValides.includes(itemBaseType)) return;

    switch(itemBaseType) {
      case 'capaciteultime':
        for (let i of items.filter(i => i.type === 'capaciteultime')) {
          actor.items.get(i._id).delete();
        }
        break;

      case 'module':
        const armor = await getArmor(actor);

        if(!armor) return;
        let hasCompanions = false;
        const armorLegende = await getArmorLegend(actor);

        const armorAPI = new ArmureAPI(armor);
        const companions = armorAPI.getCapacite('companions');

        if(companions) hasCompanions = true;

        if(armorLegende && !hasCompanions) {
          const armorLegendeAPI = new ArmureLegendeAPI(armorLegende);
          const companionsLegende = armorLegendeAPI.getCapacite('companions');

          if(companionsLegende) hasCompanions = true;
        }

        if(hasCompanions) {
          const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {what:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Ajoutermodule")});
          const askDialogOptions = {classes: ["dialog", "knight", "askdialog"]};

          const isLion = await Dialog.wait({
            title: game.i18n.localize('KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Modulelion'),
            content: askContent,
            buttons: {
                button1: {
                    label: game.i18n.localize('KNIGHT.AUTRE.Oui'),
                    callback: () => true,
                    icon: `<i class="fas fa-check"></i>`
                },
                button2: {
                    label: game.i18n.localize('KNIGHT.AUTRE.Non'),
                    callback: () => false,
                    icon: `<i class="fas fa-times"></i>`
                }
            }
          }, askDialogOptions);

          if (isLion) itemData[0].system.isLion = true;
        }

        if(itemData[0].system.niveau.max > 1) {
          let niveauMax = {};

          for(let i = 1;i <= itemData[0].system.niveau.max;i++) {
            niveauMax[i] = i;
          }

          const askNiveau = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
            what:game.i18n.localize("KNIGHT.ITEMS.MODULE.QuelNiveau"),
            list:[{
              key:'select',
              liste:niveauMax,
              class:'whatSelect'
            }],
          });
          const askNiveauDialogOptions = {classes: ["dialog", "knight", "askniveau"]};

          level = await Dialog.wait({
            title: itemData[0].name,
            content: askNiveau,
            buttons: {
              button1: {
                label: game.i18n.localize('KNIGHT.AUTRE.Valider'),
                callback: async (dataHtml) => dataHtml?.find('.whatSelect')?.val() || 1,
                icon: `<i class="fas fa-check"></i>`
              },
              button2: {
                label: game.i18n.localize('KNIGHT.AUTRE.Annuler'),
                callback: async () => false,
                icon: `<i class="fas fa-times"></i>`
              }
            }
          }, askNiveauDialogOptions);

          if(level) itemUpdate[`system.niveau.value`] = Number(level);
        }
        break;

      case 'arme':
        const isRangedWpn = itemData[0].system.type;

        if(isRangedWpn === 'distance') {
          const cantHaveRangedWpn = actorData.restrictions.noArmeDistance;

          if(cantHaveRangedWpn) return;
        }
        break;

      case 'cyberware':
        const isHealWound = itemData[0].system.soin.has;

        if(isHealWound) {
          let content = '';
          content += '<select name="blessure">';
          content += `<option value=""></option>`;
          for(let w of this.actor.items.filter(itm => itm.type === 'blessure' && !itm.system.soigne.implant && !itm.system.soigne.reconstruction)) {
            content += `<option value="${w._id}">${w.name}</option>`;
          }
          content += '</select>';
          content += '</label>'

          await foundry.applications.api.DialogV2.prompt({
            window: {
              title: game.i18n.localize("KNIGHT.CYBERWARE.Label")
            },
            modal: true,
            content: content,
            ok: {
              label: game.i18n.localize("KNIGHT.AUTRE.Valider"),
              callback: async (event, button, dialog) => {
                const result = $(button.form.elements.blessure).val();

                const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);
                itemCreate[0].update({[`system.soin.blessuresSoignees`]:result});
                itemCreate[0].system.healWound(result);

                return itemCreate;
              }
            }
          });
        }
        break;

      case 'armurelegende':
        if(!hasArmor) return;

        if(hasArmorLegende) await hasArmorLegende.delete();

        const update = {};
        update['system.equipements.armure.hasArmorLegende'] = true;

        actor.update(update);
        break;

      case 'armure':
        if(hasArmor) {
          await this._resetArmure(actor);
          hasArmor.delete();
        }

        if(actorData.wear === 'armure') await actor.update({['system.wear']:'guardian'});
        break;

      case 'art':
        const art = this.actor.items.find(itm => itm.type === 'art');

        if(art) await art.delete();
        break;
    }

    return itemUpdate;
  }

  async _onDropItemCreate_post(dropCreateOn, itemCreate) {
    const actor = this.actor;
    const item = itemCreate[0];
    const itemBaseType = item.type;
    //hasGloire
    const hasGloire = this.hasGloire;
    let itemUpdate = dropCreateOn;

    if(hasGloire) {
      const typeToAddGloire = ['arme', 'module'];

      if(typeToAddGloire.includes(itemBaseType)) {
        const gloireListe = actor.system?.progression?.gloire?.depense?.liste ?? {};
        const gloireMax = Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);

        if(itemBaseType === 'module') {
          const level = item.system.niveau.value;

          itemUpdate[`system.niveau.details.n${level}.addOrder`] = gloireMax+1;

          for(let i = 1;i < level;i++) {
            itemUpdate[`system.niveau.details.n${i}.ignore`] = true;
          }
        }
        else itemUpdate[`system.addOrder`] = gloireMax+1;
      }
    }

    if(!foundry.utils.isEmpty(itemUpdate)) itemCreate[0].update(itemUpdate);
  }

  _getHighestOrder(myObject) {
    let highestOrder = -1;

    for (const key in myObject) {
      if (myObject.hasOwnProperty(key) && myObject[key].order !== undefined) {
        if (myObject[key].order > highestOrder) {
          highestOrder = myObject[key].order;
        }
      }
    }

    return highestOrder;
  };

  async _resetArmure(actor) {
      const armor = await getArmor(actor)
      const armorAPI = new ArmureAPI(armor);

      const btnActivations = actor.sheet.element.find('.armure .capacites .activation');

      for(let b of btnActivations) {
        const target = $(b);
        const special = target?.data("special") ?? '';
        const capacite = target?.data("capacite") ?? '';
        const variant = target?.data("variant") ?? '';

        if(armorAPI.isCapaciteActive(capacite, special, variant)) armor.system.activateCapacity({capacite, special, variant});
      }
  }

  async _resetModules(actor) {
      const btnActivations = actor.sheet.element.find('.armure .modules .activation');

      for(let b of btnActivations) {
        const target = $(b);
        const type = target.data("type");
        const module = target.data("module");
        const value = target.data("value") ? false : true;
        const subtype = target.data("subtype");
        const index = target.data("index");

        if(type === 'module' && !value) actor.items.get(module).system.activate(false, subtype);
        else if(type === 'modulePnj') actor.items.get(module).system.activateNPC(value, subtype, index);
      }
  }
}

export default HumanMixinSheet;