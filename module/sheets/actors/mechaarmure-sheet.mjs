import {
  getEffets,
  getAspectValue,
  getAEValue,
  listEffects,
  SortByName,
  getModStyle,
  sum,
  confirmationDialog
} from "../../helpers/common.mjs";

import { KnightRollDialog } from "../../dialog/roll-dialog.mjs";
import toggler from '../../helpers/toggler.js';

/**
 * @extends {ActorSheet}
 */
export class MechaArmureSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mechaarmure", "sheet", "actor"],
      template: "systems/knight/templates/actors/mechaarmure-sheet.html",
      width: 900,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "mechaarmure"}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);
    this._prepareEffetsModules(context);

    context.systemData = context.data.system;

    return context;
  }

  /**
     * Return a light sheet if in "limited" state
     * @override
     */
   get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/knight/templates/actors/limited-sheet.html";
    }
    return this.options.template;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

    html.find('img.dice').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/knight/assets/icons/D6Black.svg");
    });

    html.find('img.option').click(ev => {
      const option = $(ev.currentTarget).data("option");
      const actuel = this.getData().data.system[option]?.optionDeploy || false;

      let result = false;
      if(actuel) {
        result = false;
      } else {
        result = true;
      }

      const update = {
        system: {
          [option]: {
            optionDeploy:result
          }
        }
      };

      this.actor.update(update);
    });

    html.find('div.combat img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.modules").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.liste").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.liste").position().left > width) {
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

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-edit').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      item.sheet.render(true);
    });

    html.find('.item-delete').click(async ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      if(!await confirmationDialog()) return;

      item.delete();
      header.slideUp(200, () => this.render(false));
    });

    html.find('div.listeAspects div.line').hover(ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6Black.svg");
    });

    html.find('.pilote-delete').click(ev => {
      this.actor.update({[`system.pilote`]:0});
    });

    html.find('.ajouterModule').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const data = this.getData().data.system;
      const value = data.modules.actuel[type];
      const modules = data.modules.liste[value];

      modules['key'] = value;
      modules['type'] = type;

      this.actor.update({[`system.modules.actuel.${type}`]:''});
      this.actor.update({[`system.configurations.liste.${type}.modules.${value}`]:modules});
    });

    html.find('.supprimerModule').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const value = target.data("value");

      this.actor.update({[`system.configurations.liste.${type}.modules.-=${value}`]:null});
    });

    html.find('div.combat .podmiracle').click(async ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const data = this.getData().data.system.modules.liste.podMiracle;
      let msg;

      switch(type) {
        case 'recuperationps':
          const rPS = new game.knight.RollKnight(`${data.recuperation.sante}D6`, this.actor.system);
          rPS._success = false;
          await rPS.evaluate({async:true});

          msg = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.PODMIRACLE.RecuperationPS`)}`,
            main:{
              total:`${rPS._total} ${game.i18n.localize(`KNIGHT.AUTRE.PointSante-short`)}`,
              tooltip:await rPS.getTooltip(),
            }
          };
          break;

        case 'recuperationpa':
          const rPA = new game.knight.RollKnight(`${data.recuperation.armure}D6`, this.actor.system);
          rPA._success = false;
          await rPA.evaluate({async:true});

          msg = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.PODMIRACLE.RecuperationPA`)}`,
            main:{
              total:`${rPA._total} ${game.i18n.localize(`KNIGHT.AUTRE.PointArmure-short`)}`,
              tooltip:await rPA.getTooltip(),
            }
          };
          break;

        case 'recuperationblindage':
          const rBlindage = new game.knight.RollKnight(`${data.recuperation.blindage}D6`, this.actor.system);
          rBlindage._success = false;
          await rBlindage.evaluate({async:true});

          msg = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.PODMIRACLE.RecuperationBlindage`)}`,
            main:{
              total:`${rBlindage._total} ${game.i18n.localize(`KNIGHT.LATERAL.Blindage`)}`,
              tooltip:await rBlindage.getTooltip(),
            }
          };
          break;

        case 'recuperationresilience':
          const rResilience = new game.knight.RollKnight(`${data.recuperation.resilience}`, this.actor.system);
          rResilience._success = false;
          await rResilience.evaluate({async:true});

          msg = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.PODMIRACLE.RecuperationResilience`)}`,
            main:{
              total:`${rResilience._total} ${game.i18n.localize(`KNIGHT.LATERAL.Resilience`)}`,
              tooltip:await rResilience.getTooltip(),
            }
          };
          break;

        case 'destruction':
          this.actor.delete();
          break;
      }

      if(type !== 'destruction') {
        const msgData = {
          user: game.user.id,
          speaker: {
            actor: this.actor?.id || null,
            token: this.actor?.token?.id || null,
            alias: this.actor?.name || null,
          },
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          content: await renderTemplate('systems/knight/templates/dices/wpn.html', msg),
          sound: CONFIG.sounds.dice
        };

        const rMode = game.settings.get("core", "rollMode");
        const msgFData = ChatMessage.applyRollMode(msgData, rMode);

        await ChatMessage.create(msgFData, {
          rollMode:rMode
        });
      }
    });

    html.find('div.combat .attaque').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const type = target.data("type");
      const getData = this.getData();
      const num = type === 'special' ? getData.actor.wpnSpecial.findIndex(wpn => wpn._id === key) : getData.actor.wpn.findIndex(wpn => wpn._id === key);
      const label = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`);

      this._rollDice(label, true, key, label, type, num)
    });

    html.find('div.combat .activation').click(async ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const type = target.data("type");
      const simple = target.data("simple");
      const special = target.data("special");
      const special2 = target.data("special2");
      const getData = this.getData().data.system;
      const data = getData.configurations.liste[type].modules[key];
      let newEnergie;
      let newActor;

      if(!simple) this.actor.update({[`system.configurations.liste.${type}.modules.${key}.active`]:true});

      switch(key) {
        case 'vagueSoin':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return
          break;

        case 'canonNoe':
           if(special === 'resilience') {
            newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.LATERAL.Resilience`)}`);

            if(!newEnergie) return

            const rNoe = new game.knight.RollKnight(`${data.reparations.mechaarmure.resilience}D6`, this.actor.system);
            rNoe._success = false;
            await rNoe.evaluate({async:true});

            const msgNoe = {
              flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.LATERAL.Resilience`)}`,
              main:{
                total:rNoe._total,
                tooltip:await rNoe.getTooltip(),
                formula: rNoe._formula
              }
            };

            const msgNoeData = {
              user: game.user.id,
              speaker: {
                actor: this.actor?.id || null,
                token: this.actor?.token?.id || null,
                alias: this.actor?.name || null,
              },
              type: CONST.CHAT_MESSAGE_TYPES.OTHER,
              content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgNoe),
              sound: CONFIG.sounds.dice
            };

            const rMode = game.settings.get("core", "rollMode");
            const msgFData = ChatMessage.applyRollMode(msgNoeData, rMode);

            await ChatMessage.create(msgFData, {
              rollMode:rMode
            });
          } else {
            newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

            if(!newEnergie) return
          }
          break;

        case 'canonMagma':
          newEnergie = await this._depenseNE(+data.noyaux.bande, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return
          break;

        case 'chocSonique':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return

          const chocSoniqueE = [];

          for (let [key, effet] of Object.entries(data.effets.liste)){
            chocSoniqueE.push(effet.name);
          }

          const msgChocS = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
            main:{
              total:chocSoniqueE.join(' / ')
            }
          };

          const msgChocSData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgChocS),
            sound: CONFIG.sounds.dice
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgFData = ChatMessage.applyRollMode(msgChocSData, rMode);

          await ChatMessage.create(msgFData, {
            rollMode:rMode
          });
          break;

        case 'bouclierAmrita':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return

          this.actor.update({[`system.resilience.value`]:+getData.resilience.value + data.bonus.resilience});
          break;

        case 'offering':
          newEnergie = await this._depenseNE(+special, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return
          break;

        case 'curse':
          newEnergie = await this._depenseNE(+special, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return

          let msgCurse;

          switch(special2) {
            case "degats":
              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.DiminueDegatsViolence`)} : ${data.special.degats}${game.i18n.localize(`KNIGHT.JETS.Des-short`)}6`
                }
              };
              break;

            case "reussite":
              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.RetireReussite`)} : ${data.special.reussite}`
                }
              };
              break;

            case "baisserresilienceroll":
              const rBRCurse = new game.knight.RollKnight(`${data.special.baisserresilience.roll}D6`, this.actor.system);
              rBRCurse._success = false;
              await rBRCurse.evaluate({async:true});

              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.BaisseResilience`)} : ${rBRCurse._total}`
                }
              };
              break;

            case "baisserresiliencefixe":
              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.BaisseResilience`)} : ${data.special.baisserresilience.fixe}`
                }
              };
              break;

            case "champdeforce":
              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.AnnuleChampDeForce`)} : ${data.special.champdeforce} ${game.i18n.localize(`KNIGHT.AUTRE.Tour`)}`
                }
              };
              break;

            case "annulerresilience":
              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.AnnuleResilience`)} : ${data.special.annulerresilience} ${game.i18n.localize(`KNIGHT.AUTRE.Tour`)}`
                }
              };
              break;

            case "choc":
              const rCCurse = new game.knight.RollKnight(`${data.special.choc}`, this.actor.system);
              rCCurse._success = false;
              await rCCurse.evaluate({async:true});

              msgCurse = {
                flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
                main:{
                  total:`${game.i18n.localize(`KNIGHT.EFFETS.CHOC.Label`)} ${rCCurse._total}`,
                  tooltip:await rCCurse.getTooltip(),
                }
              };
              break;
          }

          const msgBRCurseData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCurse),
            sound: CONFIG.sounds.dice
          };

          const rModeBRC = game.settings.get("core", "rollMode");
          const msgFDataBRC = ChatMessage.applyRollMode(msgBRCurseData, rModeBRC);

          await ChatMessage.create(msgFDataBRC, {
            rollMode:rMode
          });
          break;

        case 'podMiracle':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return

          newActor = await Actor.create({
            name: `${this.title} : ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
            type: "mechaarmure",
            img:this.object.img,
            system:{
              "description":game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Description`),
              "blindage":{
                "value":data.blindage,
                "max":data.blindage
              },
              "resilience":{
                "value":data.resilience,
                "base":data.resilience
              },
              "champDeForce":{
                "base":data.champDeForce
              },
              "options":{
                "isPod":true,
                "noPilote":true,
                "noEnergie":true,
                "noInitiative":true,
                "noRD":true,
                "noCarac":true
              }
            },
            permission:this.actor.ownership
          });

          const rPod = new game.knight.RollKnight(`${data.duree}D6`, this.actor.system);
          rPod._success = false;
          await rPod.evaluate({async:true});

          const msgPod = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.DUREE.Label`)}`,
            main:{
              total:`${rPod._total} ${game.i18n.localize(`KNIGHT.AUTRE.Tours`)}`,
              tooltip:await rPod.getTooltip(),
              formula: rPod._formula
            }
          };

          const msgPodData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgPod),
            sound: CONFIG.sounds.dice
          };

          const rModePod = game.settings.get("core", "rollMode");
          const msgFDataPod = ChatMessage.applyRollMode(msgPodData, rModePod);

          await ChatMessage.create(msgFDataPod, {
            rollMode:rMode
          });
          break;

        case 'podInvulnerabilite':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return

          const rInv = new game.knight.RollKnight(`${data.duree}D6`, this.actor.system);
          rInv._success = false;
          await rInv.evaluate({async:true});

          const msgInv = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.DUREE.Label`)}`,
            main:{
              total:`${rInv._total} ${game.i18n.localize(`KNIGHT.AUTRE.Tours`)}`,
              tooltip:await rInv.getTooltip(),
              formula: rInv._formula
            }
          };

          const msgInvData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgInv),
            sound: CONFIG.sounds.dice
          };

          const rModeInv = game.settings.get("core", "rollMode");
          const msgFDataInv = ChatMessage.applyRollMode(msgInvData, rModeInv);

          await ChatMessage.create(msgFDataInv, {
            rollMode:rMode
          });
          break;

        case 'dronesEvacuation':
          newEnergie = await this._depenseNE(+data.noyaux.actuel, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;
          break;

        case 'dronesAirain':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;
          break;

        case 'moduleEmblem':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;
          break;

        case 'moduleWraith':
          newEnergie = await this._depenseNE(+data.noyaux.base, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;
          break;

        case 'stationDefenseAutomatise':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;

          newActor = await Actor.create({
            name: `${this.title} : ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`,
            type: "bande",
            img:this.object.img,
            system:{
              "description":game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Description`),
              "sante":{
                "value":data.blindage,
                "base":data.blindage
              },
              "resilience":{
                "value":data.resilience,
                "max":data.resilience
              },
              "bouclier":{
                "value":data.champDeForce
              },
              "debordement":{
                "value":data.debordement
              },
              "options":{
                "noCohesion":true,
                "noAspects":true,
                "noOptions":true,
                "noCapacites":true,
                "noHistorique":true,
                "hasBlindage":true,
                "bouclier":false,
                "champDeForce":true,
                "blindage":true,
                "energie":false,
                "noRDI":true,
                "destruction":true,
                "noType":true
              }
            },
            permission:this.actor.ownership
          });
          break;

        case 'modeSiegeTower':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;
          break;

        case 'nanoBrume':
          newEnergie = await this._depenseNE(+data.noyaux, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);

          if(!newEnergie) return;
          break;
      }

    });

    html.find('div.combat .desactivation').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const type = target.data("type");
      const getData = this.getData().data.system;
      const data = getData.configurations.liste[type].modules[key];
      const resilienceActuel = +getData.resilience.value;
      const resilienceMax = +getData.resilience.max;

      this.actor.update({[`system.configurations.liste.${type}.modules.${key}.active`]:false});

      if(key === 'bouclierAmrita') {
        const bonusResilience = +data.bonus.resilience;
        const modResilience = resilienceMax - bonusResilience;

        if(resilienceActuel > modResilience) this.actor.update({[`system.resilience.value`]:modResilience});
      }
    });

    html.find('div.combat .prolonger').click(async ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const type = target.data("type");
      const getData = this.getData().data.system;
      const data = getData.configurations.liste[type].modules[key];

      await this._depenseNE(+data.noyaux.prolonger, `${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)}`);
    });

    html.find('div.combat .special').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const type = target.data("type");
      const getData = this.getData().data.system;
      const data = getData.configurations.liste[type].modules[key];
      const resilience = getData.resilience.value;

      switch(key) {
        case 'sautMarkIV':
          let newResilience = +resilience - +data.resilience;

          if(newResilience < 0) newResilience = 0;

          this.actor.update({[`system`]:{
            resilience:{
              value:newResilience
            },
            configurations:{
              liste:{
                [type]:{
                  modules:{
                    [key]:{
                      active:false
                    }
                  }
                }
              }
            }
          }});
          break;


          break;
      }
    });

    html.find('div.combat .special').click(ev => {
      const target = $(ev.currentTarget);
      const key = target.data("key");
      const type = target.data("type");
      const getData = this.getData().data.system;
      const data = getData.configurations.liste[type].modules[key];
      const resilience = getData.resilience.value;

      switch(key) {
        case 'sautMarkIV':
          let newResilience = +resilience - +data.resilience;

          if(newResilience < 0) newResilience = 0;

          this.actor.update({[`system`]:{
            resilience:{
              value:newResilience
            },
            configurations:{
              liste:{
                [type]:{
                  modules:{
                    [key]:{
                      active:false
                    }
                  }
                }
              }
            }
          }});
          break;
      }
    });

    html.find('div.combat .degats').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const key = target.data("key");
      const type = target.data("type");
      const degatsD = target.data("degats");
      const degatsF = target?.data("degatsfixe") || 0;
      const cout = target?.data("cout") || false;
      const getData = this.getData();


      if(cout !== false) {
        const tCout = eval(cout);

        const depense = await this._depenseNE(tCout, label);

        if(!depense) return;
      }

      const degats = {
        dice:degatsD,
        fixe:degatsF
      };

      let dataWpn = {
        effets:{
          raw:[],
          custom:[]
        }
      }

      switch(key) {
        case 'tourellesLasersAutomatisees':
        case 'missilesJericho':
          dataWpn.effets.raw = getData.systemData.configurations.liste[type].modules[key].effets.raw;
          dataWpn.effets.custom = getData.systemData.configurations.liste[type].modules[key].effets.custom;
          break;

        case 'moduleInferno':
          const rInf = new game.knight.RollKnight(`${getData.systemData.configurations.liste[type].modules[key].cdf}`, this.actor.system);
          rInf._success = false;
          await rInf.evaluate({async:true});

          const rInfTour = +rInf._total > 1 ? game.i18n.localize(`KNIGHT.AUTRE.Tours`) : game.i18n.localize(`KNIGHT.AUTRE.Tour`);

          const msgInf = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Cdf`)}`,
            main:{
              total:`${rInf._total} ${rInfTour}`,
              tooltip:await rInf.getTooltip(),
              formula: rInf._formula
            }
          };

          const msgInfData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgInf),
            sound: CONFIG.sounds.dice
          };

          const rModeInf = game.settings.get("core", "rollMode");
          const msgFDataInf = ChatMessage.applyRollMode(msgInfData, rModeInf);

          await ChatMessage.create(msgFDataInf, {
            rollMode:rMode
          });
          break;
      }

      const allEffets = await this._getAllEffets(dataWpn, false, false);

      this._doDgts(label, degats, allEffets);
    });

    html.find('div.combat .violence').click(async ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label");
      const key = target.data("key");
      const type = target.data("type");
      const violenceD = target.data("violence");
      const violenceF = target?.data("violencefixe") || 0;
      const cout = target?.data("cout") || false;
      const getData = this.getData();

      if(cout !== false) {
        const tCout = eval(cout);
        const depense = await this._depenseNE(tCout, label);

        if(!depense) return;
      }

      const violence = {
        dice:violenceD,
        fixe:violenceF
      };

      let dataWpn = {
        effets:{
          raw:[],
          custom:[]
        }
      }

      switch(key) {
        case 'tourellesLasersAutomatisees':
          dataWpn.effets.raw = getData.systemData.configurations.liste[type].modules[key].effets.raw;
          dataWpn.effets.custom = getData.systemData.configurations.liste[type].modules[key].effets.custom;
          break;
        case 'moduleInferno':
          const rInf = new game.knight.RollKnight(`${getData.systemData.configurations.liste[type].modules[key].cdf}`, this.actor.system);
          rInf._success = false;
          await rInf.evaluate({async:true});

          const rInfTour = +rInf._total > 1 ? game.i18n.localize(`KNIGHT.AUTRE.Tours`) : game.i18n.localize(`KNIGHT.AUTRE.Tour`);

          const msgInf = {
            flavor:`${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Label`)} - ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${key.toUpperCase()}.Cdf`)}`,
            main:{
              total:`${rInf._total} ${rInfTour}`,
              tooltip:await rInf.getTooltip(),
              formula: rInf._formula
            }
          };

          const msgInfData = {
            user: game.user.id,
            speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgInf),
            sound: CONFIG.sounds.dice
          };

          const rModeInf = game.settings.get("core", "rollMode");
          const msgFDataInf = ChatMessage.applyRollMode(msgInfData, rModeInf);

          await ChatMessage.create(msgFDataInf, {
            rollMode:rMode
          });
          break;
      }

      const allEffets = await this._getAllEffets(dataWpn, false, false);

      this._doViolence(label, violence, allEffets);
    });

    html.find('div.combat button.configuration').click(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const data = this.getData().data.system.configurations.actuel;
      let result = type;

      if(data === type) result = "";

      this.actor.update({['system.configurations.actuel']:result});
    });

    html.find('div.styleCombat > span.info').hover(ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "block");
    }, ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "none");
    });

    html.find('div.styleCombat > span.info').click(ev => {
      const actuel = this.getData().data.system.combat?.styleDeploy || false;

      let result = false;

      if(actuel) {
        result = false;
      } else {
        result = true;
      }

      const update = {
        system: {
          combat: {
            styleDeploy:result
          }
        }
      };

      this.actor.update(update);
    });

    html.find('div.styleCombat > select').change(ev => {
      const style = $(ev.currentTarget).val();
      const mods = getModStyle(style);
      const knightRoll = this._getKnightRoll();

      const update = {
        system: {
          reaction: {
            bonus:{
              other:mods.bonus.reaction
            },
            malus:{
              other:mods.malus.reaction
            }
          },
          defense: {
            bonus:{
              other:mods.bonus.defense
            },
            malus:{
              other:mods.malus.defense
            }
          },
          combat:{
            data:{
              tourspasses:1,
              type:"degats"
            }
          }
        }
      };

      this.actor.update(update);

      if(knightRoll) {
        knightRoll.data.style.fulllabel = game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`);
        knightRoll.data.style.label = game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`);
        knightRoll.data.style.raw = style;
        knightRoll.data.style.selected = '';
        knightRoll.data.style.tourspasses = 1;
        knightRoll.data.style.sacrifice = 0;
        knightRoll.data.style.type = "degats";
        knightRoll.data.style.maximum = 6;
        knightRoll.data.style.caracteristiques = mods.caracteristiques;
        knightRoll.data.style.info = game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Info`);
        knightRoll.render(true);
      }
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const type = target.data("type");
      const caracteristique = target.data("caracteristique") || '';
      const getData = this.getData();

      let bonus = 0;

      switch(type) {
        case 'vitesse':
        case 'manoeuvrabilite':
        case 'puissance':
        case 'senseurs':
        case 'systemes':
          bonus += getData.data.system[type].value;
          break;
      }

      this._rollDice(label, false, '', '', '', -1, caracteristique, [], 0, bonus);
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const id = target.data("id");
      const isDistance = target.data("isdistance");
      const num = target.data("num");
      const caracs = target?.data("caracteristiques")?.split(",") || [];

      let label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);

      this._rollDice(label, true, id, name, isDistance, num, '', caracs, 0);
    });
  }

  /* -------------------------------------------- */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `${game.i18n.localize(`ITEM.Type${type.capitalize()}`)}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };

    switch(type) {
      case "arme":
          itemData.img = "systems/knight/assets/icons/arme.svg";
          break;

      case "armure":
          itemData.img = "systems/knight/assets/icons/armure.svg";
          break;

      case "avantage":
          itemData.img = "systems/knight/assets/icons/avantage.svg";
          break;

      case "inconvenient":
          itemData.img = "systems/knight/assets/icons/inconvenient.svg";
          break;

      case "motivationMineure":
          itemData.img = "systems/knight/assets/icons/motivationMineure.svg";
          break;

      case "langue":
          itemData.img = "systems/knight/assets/icons/langue.svg";
          break;

      case "contact":
          itemData.img = "systems/knight/assets/icons/contact.svg";
          break;

      case "blessure":
          itemData.img = "systems/knight/assets/icons/blessureGrave.svg";
          break;

      case "trauma":
          itemData.img = "systems/knight/assets/icons/trauma.svg";
          break;

      case "module":
          itemData.img = "systems/knight/assets/icons/module.svg";
          break;

      case "capacite":
          itemData.img = "systems/knight/assets/icons/capacite.svg";
          break;

      case "armurelegende":
          itemData.img = "systems/knight/assets/icons/armureLegende.svg";
          break;

      case "carteheroique":
          itemData.img = "systems/knight/assets/icons/carteheroique.svg";
          break;

      case "capaciteheroique":
          itemData.img = "systems/knight/assets/icons/capaciteheroique.svg";
          break;
    }

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    if (type === 'arme') {
      itemData.system = {
        type:header.dataset.subtype,
        tourelle:{
          has:header.dataset.tourelle
        }
      };
      delete itemData.system["subtype"];
    }

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropItemCreate(itemData) {
    const actorData = this.getData().data.system;

    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;
    const options = actorData.options;

    if((itemBaseType === 'module' && !options.modules) ||
    itemBaseType === 'armure' || itemBaseType === 'avantage' ||
    itemBaseType === 'inconvenient' || itemBaseType === 'motivationMineure' ||
    itemBaseType === 'contact' || itemBaseType === 'blessure' ||
    itemBaseType === 'trauma' || itemBaseType === 'armurelegende' || itemBaseType === 'arme' ||
    itemBaseType === 'effet') return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _onDropActor(event, data) {
    if ( !this.actor.isOwner ) return false;

    const cls = getDocumentClass(data?.type);
    const document = await cls.fromDropData(data);
    const type = document.type;

    if(type === 'knight') {

      const update = {
        system:{
          pilote:document.id
        }
      };

      this.actor.update(update);
    }
  }

  async _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const system = sheetData.data.system;
    const piloteId = system.pilote;
    const modulesListe = Object.keys(system.modules.liste);
    const modulesBase = Object.keys(system.configurations.liste.base.modules);
    const modulesC1 = Object.keys(system.configurations.liste.c1.modules);
    const modulesC2 = Object.keys(system.configurations.liste.c2.modules);
    const modules = [];
    const wpn = [];
    const wpnSpecial = [];
    let pilote = {};
    let bonus = {
      vitesse:0,
      manoeuvrabilite:0,
      puissance:0,
      senseurs:0,
      systemes:0,
      champDeForce:0,
      defense:0,
      reaction:0,
      resilience:0
    }
    let moduleWraith = false;

    if(piloteId !== 0) {
      const piloteData = game.actors?.get(piloteId) || false;

      if(piloteData !== false) {
        const piloteSystem = piloteData.system;

      pilote.name = piloteData.name;
      pilote.surnom = piloteSystem.surnom;
      pilote.aspects = piloteSystem.aspects;

      const dataRD = ['reaction', 'defense'];

      for(let i = 0;i < dataRD.length;i++) {
          const isKraken = piloteSystem.options.kraken;
          const dataBonus = piloteSystem[dataRD[i]].bonus;
          const dataMalus = piloteSystem[dataRD[i]].malus;
          const dataMABonus = system[dataRD[i]].bonus;
          const dataMAMalus = system[dataRD[i]].malus;
          const base = piloteSystem[dataRD[i]].base;

          let bonus = isKraken ? 1 : 0;
          let malus = 0;

          for(const bonusList in dataBonus) {
            if(bonusList === 'user') bonus += dataBonus[bonusList];
          }

          for(const malusList in dataMalus) {
            if(malusList === 'user') malus += dataMalus[malusList];
          }

          for(const bonusList in dataMABonus) {
            bonus += dataMABonus[bonusList];
          }

          for(const malusList in dataMAMalus) {
            malus += dataMAMalus[malusList];
          }

          if(dataRD[i] === 'defense') {
            const ODAura = +piloteSystem.aspects.aspectscts?.dame?.caracteristiques?.aura?.overdrive?.value || 0;

            if(ODAura >= 5) bonus += +piloteSystem.aspects.dame.caracteristiques.aura.value;
          }

          system[dataRD[i]].value = base+bonus-malus;
        }

        system.initiative.dice = piloteSystem.initiative.dice;
        system.initiative.value = piloteSystem.initiative.value;
      }


    }

    const listWpn = ['canonMetatron', 'canonMagma', 'mitrailleusesSurtur', 'souffleDemoniaque', 'poingsSoniques'];
    const listWpnSpecial = ['lamesCinetiquesGeantes'];

    for(let i = 0; i < modulesListe.length;i++) {
      const name = modulesListe[i];
      let type = '';

      if(!modulesBase.includes(name) && !modulesC1.includes(name) && !modulesC2.includes(name)) {
        modules.push(name);
      }

      if(modulesBase.includes(name)) type = 'base';
      if(modulesC1.includes(name)) type = 'c1';
      if(modulesC2.includes(name)) type = 'c2';

      if(type !== '') {
        const data = system.configurations.liste[type].modules[name];

        if(data.active) {
          switch(name) {
            case 'moduleWraith':
              moduleWraith = true;
              break;

            case 'volMarkIV':
              bonus.manoeuvrabilite += +data.bonus.manoeuvrabilite;
              break;

            case 'bouclierAmrita':
              bonus.champDeForce += +data.bonus.champDeForce;
              bonus.defense += +data.bonus.defense;
              bonus.reaction += +data.bonus.reaction;
              bonus.resilience += +data.bonus.resilience;
              break;

            case 'modeSiegeTower':
              bonus.resilience += +data.bonus.resilience;
              break;

            case 'nanoBrume':
              bonus.defense += +data.bonus.defense;
              bonus.reaction += +data.bonus.reaction;
              break;
          }
        }

        if(listWpn.includes(name)) {
          let noyaux = 0;

          switch(name) {
            case 'canonMagma':
              noyaux = +data.noyaux.simple;
              break;

            case 'souffleDemoniaque':
            case 'mitrailleusesSurtur':
            case 'canonMetatron':
            case 'poingsSoniques':
              noyaux = +data.noyaux;
              break;
          }

          wpn.push({
            type:type,
            _id:name,
            name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${name.toUpperCase()}.Label`),
            portee:data.portee,
            energie:noyaux,
            degats:data.degats,
            violence:data.violence,
            effets:data.effets
          });
        }

        if(listWpnSpecial.includes(name)) {
          let noyaux = 0;

          wpnSpecial.push({
            type:'special',
            subType:type,
            _id:name,
            name:game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${name.toUpperCase()}.Label`),
            portee:data.portee,
            energie:noyaux,
            degats:data.degats,
            violence:data.violence,
            effets:data.effets,
            eff1:data.eff1,
            eff2:data.eff2
          });
        }
      }
    }

    modules.sort();

    actorData.modules = modules;
    actorData.wpn = wpn;
    actorData.wpnSpecial = wpnSpecial;
    actorData.pilote = pilote;
    actorData.moduleWraith = moduleWraith;

    this.actor.update({['system']:{
      manoeuvrabilite:{
        bonus:{
          other:bonus.manoeuvrabilite
        }
      },
      vitesse:{
        bonus:{
          other:bonus.vitesse
        }
      },
      puissance:{
        bonus:{
          other:bonus.puissance
        }
      },
      senseurs:{
        bonus:{
          other:bonus.senseurs
        }
      },
      systemes:{
        bonus:{
          other:bonus.systemes
        }
      },
      champDeForce:{
        bonus:{
          other:bonus.champDeForce
        }
      },
      reaction:{
        bonus:{
          other:bonus.reaction
        }
      },
      defense:{
        bonus:{
          other:bonus.defense
        }
      },
      resilience:{
        bonus:{
          other:bonus.resilience
        }
      }
    }})

    // ON ACTUALISE ROLL UI S'IL EST OUVERT
    let rollUi = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? false;

    if(rollUi !== false) {
      await rollUi.setWpnMA(wpn);
      await rollUi.setWraith(moduleWraith);

      rollUi.render(true);
    }
  }

  _prepareEffetsModules(context) {
    const getData = context.data.system;
    const modules = ['canonMetatron', 'canonMagma', 'lamesCinetiquesGeantes', 'missilesJericho', 'souffleDemoniaque', 'poingsSoniques', 'chocSonique'];
    const effetsLabels = CONFIG.KNIGHT.effets;

    for(let i = 0; i < modules.length;i++) {
      const base = getData.configurations.liste.base.modules?.[modules[i]] || false;
      const c1 = getData.configurations.liste.c1.modules?.[modules[i]] || false;
      const c2 = getData.configurations.liste.c2.modules?.[modules[i]] || false;

      if(base !== false) {
        const baseE = base.effets;

        baseE.liste = listEffects(baseE.raw, baseE.custom, effetsLabels);

        if(modules[i] === 'lamesCinetiquesGeantes') {
          const baseE1 = base.eff1.effets;
          const baseE2 = base.eff2.effets;

          const effets1 = [];
          const effets2 = [];

          for(let n = 0;n < baseE1.raw.length;n++) {
            const split = baseE1.raw[n].split(" ");
            const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets1.push({
              raw:baseE1.raw[n],
              name:complet,
              description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
            });
          }

          for(let n = 0;n < baseE2.raw.length;n++) {
            const split = baseE2.raw[n].split(" ");
            const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets2.push({
              raw:baseE2.raw[n],
              name:complet,
              description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
            });
          }

          baseE1.liste = effets1;
          baseE2.liste = effets2;
        }
      }

      if(c1 !== false) {
        const c1E = c1.effets;

        c1E.liste = listEffects(c1E.raw, c1E.custom, effetsLabels);

        if(modules[i] === 'lamesCinetiquesGeantes') {
          const c1E1 = c1E.eff1.effets;
          const c1E2 = c1E.eff2.effets;

          const effets1 = [];
          const effets2 = [];

          for(let n = 0;n < baseE1.raw.length;n++) {
            const split = baseE1.raw[n].split(" ");
            const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets1.push({
              raw:baseE1.raw[n],
              name:complet,
              description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
            });
          }

          for(let n = 0;n < baseE2.raw.length;n++) {
            const split = baseE2.raw[n].split(" ");
            const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets2.push({
              raw:baseE2.raw[n],
              name:complet,
              description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
            });
          }

          c1E1.liste = effets1;
          c1E2.liste = effets2;
        }
      }

      if(c2 !== false) {
        const c2E = c2.effets;

        c2E.liste = listEffects(c2E.raw, c2E.custom, effetsLabels);

        if(modules[i] === 'lamesCinetiquesGeantes') {
          const c2E1 = c2E.eff1.effets;
          const c2E2 = c2E.eff2.effets;

          const effets1 = [];
          const effets2 = [];

          for(let n = 0;n < baseE1.raw.length;n++) {
            const split = baseE1.raw[n].split(" ");
            const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets1.push({
              raw:baseE1.raw[n],
              name:complet,
              description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
            });
          }

          for(let n = 0;n < baseE2.raw.length;n++) {
            const split = baseE2.raw[n].split(" ");
            const name = game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].label);
            const sub = split[1];
            let complet = name;

            if(sub != undefined) { complet += " "+sub; }

            effets2.push({
              raw:baseE2.raw[n],
              name:complet,
              description:game.i18n.localize(CONFIG.KNIGHT.effets[split[0]].description)
            });
          }

          c2E1.liste = effets1;
          c2E2.liste = effets2;
        }
      }
    }
  }

  _prepareTranslateDurationModules(context) {
    const getData = context.data.system;
    const modules = ['bouclierAmrita', "moduleEmblem", 'moduleWraith', 'modeSiegeTower'];

    for(let i = 0; i < modules.length;i++) {
      const base = getData.configurations.liste.base.modules?.[modules[i]] || false;
      const c1 = getData.configurations.liste.c1.modules?.[modules[i]] || false;
      const c2 = getData.configurations.liste.c2.modules?.[modules[i]] || false;

      if(base !== false) base.duree = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Duree`);

      if(c1 !== false) c1.duree = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Duree`);

      if(c2 !== false) c2.duree = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Duree`);
    }
  }

  _prepareTranslateRangeModules(context) {
    const getData = context.data.system;
    const modules = ['dronesEvacuation'];

    for(let i = 0; i < modules.length;i++) {
      const base = getData.configurations.liste.base.modules?.[modules[i]] || false;
      const c1 = getData.configurations.liste.c1.modules?.[modules[i]] || false;
      const c2 = getData.configurations.liste.c2.modules?.[modules[i]] || false;

      if(base !== false) base.portee = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Portee`);

      if(c1 !== false) c1.portee = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Portee`);

      if(c2 !== false) c2.portee = game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.${modules[i].toUpperCase()}.Portee`);
    }
  }

  _getKnightRoll() {
    const result = Object.values(ui.windows).find((app) => app instanceof KnightRollDialog) ?? new game.knight.applications.KnightRollDialog({
      title:this.actor.name+" : "+game.i18n.localize("KNIGHT.JETS.Label"),
      buttons: {
        button1: {
          label: game.i18n.localize("KNIGHT.JETS.JetNormal"),
          callback: async () => {},
          icon: `<i class="fas fa-dice"></i>`
        },
        button2: {
          label: game.i18n.localize("KNIGHT.JETS.JetEntraide"),
          callback: async () => {},
          icon: `<i class="fas fa-dice-d6"></i>`
        },
        button3: {
          label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    });

    return result;
  }

  async _rollDice(label, isWpn = false, idWpn = '', nameWpn = '', typeWpn = '', num=-1, caracs='', toAdd=[], reussitesBonus=0, resetModificateur=0) {
    const data = this.getData();
    const rollApp = this._getKnightRoll();
    const deployWpnImproviseesDistance = typeWpn === 'armesimprovisees' && idWpn === 'distance' ? true : false;
    const deployWpnImproviseesContact = typeWpn === 'armesimprovisees' && idWpn === 'contact' ? true : false;
    const deployWpnMA = typeWpn !== '' ? true : false;
    const style = data.systemData.combat.style;
    const getStyle = getModStyle(style);
    const bonus = toAdd.length === 0 ? [''] : toAdd;
    const base = caracs === '' ? bonus[0] : caracs;
    const modificateur = resetModificateur > 0 ? resetModificateur : data.data.system.combat.data.succesbonus+reussitesBonus;

    if(caracs === '') { bonus.shift(); }

    await rollApp.setData(label, base, bonus, [], false,
      modificateur, data.data.system.combat.data.succesbonus+reussitesBonus,
      {dice:data.data.system.combat.data.degatsbonus.dice, fixe:data.data.system.combat.data.degatsbonus.fixe},
      {dice:data.data.system.combat.data.violencebonus.dice, fixe:data.data.system.combat.data.violencebonus.fixe},
      [], [], [], [], {contact:data.systemData.combat.armesimprovisees.liste, distance:data.systemData.combat.armesimprovisees.liste}, data.actor.wpn, [],
      isWpn, idWpn, nameWpn, typeWpn, num,
      false, false, false, deployWpnImproviseesContact, deployWpnImproviseesDistance, false, false, deployWpnMA,
      false, true);
    await rollApp.setStyle({
      fulllabel:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.FullLabel`),
      label:game.i18n.localize(`KNIGHT.COMBAT.STYLES.${style.toUpperCase()}.Label`),
      raw:style,
      info:data.systemData.combat.styleInfo,
      caracteristiques:getStyle.caracteristiques,
      tourspasses:data.data.system.combat.data.tourspasses,
      type:data.data.system.combat.data.type,
      sacrifice:data.data.system.combat.data.sacrifice,
      maximum:6
    });
    await rollApp.setActor(this.actor.id);
    await rollApp.setAspects(aspects);
    await rollApp.setWraith(data.actor.moduleWraith);

    rollApp.render(true);
  }

  async _doDgts(label, dataWpn, listAllEffets, regularite=0, addNum='', tenebricide) {
    const actor = this.actor;

    //DEGATS
    const bourreau = listAllEffets.bourreau;
    const bourreauValue = listAllEffets.bourreauValue;

    const dgtsDice = dataWpn?.dice || 0;
    const dgtsFixe = dataWpn?.fixe || 0;

    let diceDgts = dgtsDice+listAllEffets.degats.totalDice;
    let bonusDgts = dgtsFixe+listAllEffets.degats.totalBonus;

    bonusDgts += regularite;

    const labelDgt = `${label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}${addNum}`;
    const totalDiceDgt = tenebricide === true ? Math.floor(diceDgts/2) : diceDgts;

    const totalDgt = `${Math.max(totalDiceDgt, 0)}d6+${bonusDgts}`;

    const execDgt = new game.knight.RollKnight(`${totalDgt}`, actor.system);
    execDgt._success = false;
    execDgt._hasMin = bourreau ? true : false;

    if(bourreau) {
      execDgt._seuil = bourreauValue;
      execDgt._min = 4;
    }

    await execDgt.evaluate(listAllEffets.degats.minMax);

    let effets = listAllEffets;

    if(effets.regularite) {
      const regulariteIndex = effets.degats.include.findIndex(str => { if(str.name.includes(game.i18n.localize(CONFIG.KNIGHT.effets['regularite'].label))) return true; });
      effets.degats.include[regulariteIndex].name = `+${regularite} ${effets.degats.include[regulariteIndex].name}`;

      effets.degats.include.sort(SortByName);
    }

    let sub = effets.degats.list;
    let include = effets.degats.include;

    if(sub.length > 0) { sub.sort(SortByName); }
    if(include.length > 0) { include.sort(SortByName); }

    const pDegats = {
      flavor:labelDgt,
      main:{
        total:execDgt._total,
        tooltip:await execDgt.getTooltip(),
        formula: execDgt._formula
      },
      sub:sub,
      include:include
    };

    const dgtsMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pDegats),
      sound: CONFIG.sounds.dice
    };

    const rMode = game.settings.get("core", "rollMode");
    const msgFData = ChatMessage.applyRollMode(dgtsMsgData, rMode);

    await ChatMessage.create(msgFData, {
      rollMode:rMode
    });
  }

  async _doViolence(label, dataWpn, listAllEffets, bViolence=0, addNum='') {
    const actor = this.actor;

    //VIOLENCE
    const tenebricide = false;
    const devastation = listAllEffets.devastation;
    const devastationValue = listAllEffets.devastationValue;

    const violenceDice = dataWpn?.dice || 0;
    const violenceFixe = dataWpn?.fixe || 0;

    let diceViolence = violenceDice+listAllEffets.violence.totalDice;
    let bonusViolence = violenceFixe+listAllEffets.violence.totalBonus;

    bonusViolence += bViolence;

    const labelViolence = `${label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}${addNum}`;
    const totalDiceViolence = tenebricide === true ? Math.floor(diceViolence/2) : diceViolence;

    const totalViolence = `${Math.max(totalDiceViolence, 0)}d6+${bonusViolence}`;

    const execViolence = new game.knight.RollKnight(`${totalViolence}`, actor.system);
    execViolence._success = false;
    execViolence._hasMin = devastation ? true : false;

    if(devastation) {
      execViolence._seuil = devastationValue;
      execViolence._min = 5;
    }

    await execViolence.evaluate(listAllEffets.violence.minMax);

    let sub = listAllEffets.violence.list;
    let include = listAllEffets.violence.include;

    if(sub.length > 0) { sub.sort(SortByName); }
    if(include.length > 0) { include.sort(SortByName); }

    const pViolence = {
      flavor:labelViolence,
      main:{
        total:execViolence._total,
        tooltip:await execViolence.getTooltip(),
        formula: execViolence._formula
      },
      sub:sub,
      include:include
    };

    const violenceMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pViolence),
      sound: CONFIG.sounds.dice
    };

    const rMode = game.settings.get("core", "rollMode");
    const msgFData = ChatMessage.applyRollMode(violenceMsgData, rMode);

    await ChatMessage.create(msgFData, {
      rollMode:rMode
    });
  }

  async _getAllEffets(dataWpn, tenebricide, obliteration) {
    const actor = this.actor;
    const data = {
      guidage:false,
      barrage:false,
      tenebricide:tenebricide,
      obliteration:obliteration
    };

    const effetsWpn = dataWpn.effets;
    const distanceWpn = {raw:[], custom:[]};
    const ornementalesWpn = {raw:[], custom:[]};
    const structurellesWpn = {raw:[], custom:[]};
    const lDgtsOtherInclude = [];

    const listEffets = await getEffets(actor, '', '', data, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, true);

    let getDgtsOtherFixeMod = 0;

    const lEffetAttack = listEffets.attack;
    const lEffetDegats = listEffets.degats;
    const lEffetViolence = listEffets.violence;
    const lEffetOther = listEffets.other;

    // ATTAQUE
    const attackDice = lEffetAttack.totalDice;
    const attackBonus = lEffetAttack.totalBonus;
    const attackInclude = lEffetAttack.include;
    const attackList = lEffetAttack.list;

    // DEGATS
    const degatsDice = lEffetDegats.totalDice;
    const degatsBonus = lEffetDegats.totalBonus+getDgtsOtherFixeMod;
    const degatsInclude = lEffetDegats.include.concat(lDgtsOtherInclude);
    const degatsList = lEffetDegats.list;
    const minMaxDgts = lEffetDegats.minMax;

    // VIOLENCE
    const violenceDice = lEffetViolence.totalDice;
    const violenceBonus = lEffetViolence.totalBonus;
    const violenceInclude = lEffetViolence.include;
    const violenceList = lEffetViolence.list;
    const minMaxViolence = lEffetViolence.minMax;

    // AUTRE
    const other = lEffetOther;

    attackInclude.sort(SortByName);
    attackList.sort(SortByName);
    degatsInclude.sort(SortByName);
    degatsList.sort(SortByName);
    violenceInclude.sort(SortByName);
    violenceList.sort(SortByName);
    other.sort(SortByName);

    const merge = {
      attack:{
        totalDice:attackDice,
        totalBonus:attackBonus,
        include:attackInclude,
        list:attackList
      },
      degats:{
        totalDice:degatsDice,
        totalBonus:degatsBonus,
        include:degatsInclude,
        list:degatsList,
        minMax:minMaxDgts,
      },
      violence:{
        totalDice:violenceDice,
        totalBonus:violenceBonus,
        include:violenceInclude,
        list:violenceList,
        minMax:minMaxViolence,
      },
      other:other
    };

    const nRoll = listEffets.nRoll;

    const result = {
      guidage:listEffets.guidage,
      regularite:listEffets.regularite,
      bourreau:listEffets.bourreau,
      bourreauValue:listEffets.bourreauValue,
      devastation:listEffets.devastation,
      devastationValue:listEffets.devastationValue,
      barrageValue:listEffets.barrageValue,
      depenseEnergie:listEffets.depenseEnergie,
      onlyAttack:listEffets.onlyAttack,
      onlyDgts:listEffets.onlyDgts,
      onlyViolence:listEffets.onlyViolence,
      nRoll:nRoll,
      attack:merge.attack,
      degats:merge.degats,
      violence:merge.violence,
      other:merge.other
    };

    return result;
  }

  async _depenseNE(noyaux, label) {
    const getData = this.getData().data.system;
    const noyauxActuel = +getData.energie.value;
    let newEnergie = noyauxActuel - noyaux;

    if(newEnergie < 0) {
      const msgEnergie = {
        flavor:`${label}`,
        main:{
          total:`${game.i18n.localize(`KNIGHT.JETS.Notenergie`)}`
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
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
        sound: CONFIG.sounds.dice
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgFData = ChatMessage.applyRollMode(msgEnergieData, rMode);

      await ChatMessage.create(msgFData, {
        rollMode:rMode
      });
      return false;
    }

    if(newEnergie < 0) newEnergie = 0;

    this.actor.update({[`system`]:{
      energie:{
        value:newEnergie
      }
    }});

    return true;
  }
}
