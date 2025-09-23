import {
  getDefaultImg,
  getArmor,
  spawnTokenRightOfActor,
  spawnTokensRightOfActor,
  deleteTokens,
  createSheet,
  capitalizeFirstLetter,
  confirmationDialog,
} from "../helpers/common.mjs";

import PatchBuilder from "../utils/patchBuilder.mjs";
import ArmureAPI from "../utils/armureAPI.mjs";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class KnightActor extends Actor {

  /**
     * Create a new entity using provided input data
     * @override
     */
  static async create(data, context={}) {
    if (data.img === undefined) data.img = getDefaultImg(data.type);

    const createData = data instanceof Array ? data : [data];
    const created = await this.createDocuments(createData, context);
    return data instanceof Array ? created : created.shift();
  }

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();

    const version = game.version.split('.')[0];
    let effectStatus;
    let listEffect;

    /*if(window.EffectCounter !== undefined && this.permission === 3) {
      if(version < 11) {
        listEffect = this.getEmbeddedCollection('ActiveEffect').filter(e => e?.flags?.core?.statusId ?? undefined !== undefined);

        for(let eff of listEffect) {
          let statusId = eff.flags.core.statusId;
          let label = game.i18n.localize(CONFIG.statusEffects.find(se => se.id === statusId).label);
          let effect = existEffect(listEffect, label);
          let hasCounter = foundry.utils.getProperty(effect, "flags.statuscounter.counter");
          if(hasCounter !== undefined) {
            let effectCounter = hasCounter.value;
            let changes = [];

            switch(statusId) {
              case 'lumiere':
              case 'barrage':
                let keys = [`system.defense.malusValue`, `system.reaction.malusValue`]

                for(let k of keys) {
                  let v = effect.changes.find(v => v.key === k)?.value ?? undefined;

                  if(v !== undefined) {
                    if(Number(v) !== effectCounter) {
                      changes.push({
                        key: k,
                        mode: 2,
                        priority: 4,
                        value: effectCounter
                      });
                    }
                  }
                }
                break;
            }

            if(changes.length > 0) {
              updateEffect(this, [{
                "_id":effect._id,
                changes:changes
              }]);
            }
          }

        }
      }  else {
        effectStatus = foundry.utils.getProperty(this, "statuses");
        listEffect = this.getEmbeddedCollection('ActiveEffect');

        for(let eff of effectStatus) {
          let label = game.i18n.localize(CONFIG.statusEffects.find(se => se.id === eff).label);
          let effect = existEffect(listEffect, label);
          let hasCounter = foundry.utils.getProperty(effect, "flags.statuscounter.counter");
          if(hasCounter !== undefined) {
            let effectCounter = hasCounter.value;
            let changes = [];

            switch(eff) {
              case 'lumiere':
              case 'barrage':
                let keys = [`system.defense.malusValue`, `system.reaction.malusValue`]

                for(let k of keys) {
                  let v = effect.changes.find(v => v.key === k)?.value ?? undefined;

                  if(v !== undefined) {
                    if(Number(v) !== effectCounter) {
                      changes.push({
                        key: k,
                        mode: 2,
                        priority: 4,
                        value: effectCounter
                      });
                    }
                  }
                }
                break;
            }

            if(changes.length > 0) {
              updateEffect(this, [{
                "_id":effect._id,
                changes:changes
              }]);
            }
          }

        }
      }
    }*/
  }

  prepareDerivedData() {
    const actorData = this;

    //this._prepareKnightData(actorData);
  }

  async activateCapacity(args = {}) {
    // Déstructuration défensive + valeurs par défaut
    const {
      capacite = '',
      special = '',
      variant = '',
    } = args;

    // Gardes minimales (évite les plantages)
    if (!capacite) {
      console.warn('activateCapacity: capacite manquant');
      return;
    }

    if (!this) {
      console.error('activateCapacity: contexte actor introuvable');
      return;
    }

    // Récupération armure + capacités (sécurisée)
    const armure = await getArmor(this).catch(e => {
      console.error('activateCapacity: getArmor a échoué', e);
      return null;
    });
    if (!armure) return;

    // Helpers locaux réutilisables
    const deleteActorAndTokens = async (actorId) => {
      if (!actorId) return;
      const a = game.actors?.get(actorId);
      if (!a) return;
      try {
        await deleteTokens([a.id]);   // d’abord les tokens
      } catch (e) {
        console.warn('deleteTokens a échoué (continuation)', e);
      }
      try {
        await a.delete();             // puis l’acteur
      } catch (e) {
        console.warn('actor.delete a échoué (continuation)', e);
      }
    };

    const batchDeleteItemsBy = async (actorDoc, toDelete) => {
      if (!actorDoc) return;

      if (toDelete.length) {
        await actorDoc.deleteEmbeddedDocuments('Item', toDelete);
      }
    };

    const activateAll = (arr) => {
      if (!Array.isArray(arr)) return;
      for (const o of arr) o.active = true;
    };

    const splitAE = (ae) => {
      const v = Number(ae) || 0;
      return {
        mineur: {
          value:v > 4 ? 0 : v,
        },
        majeur: {
          value:v < 5 ? 0 : v,
        }
      };
    };

    const asInt = (v, d = 0) => Number.isFinite(v) ? Math.trunc(v) : d;

    const getArmure = new ArmureAPI(armure);
    const getCapacite = getArmure.getCapacite(capacite);
    const getName = getArmure.getCapaciteActiveName(capacite, special, variant);
    const getPath = getArmure.getCapaciteActivePath(capacite, special, variant);
    const value = getArmure.isCapaciteActive(capacite, special, variant) ? false : true;
    //Number.isFinite(getArmure.getCout(capacite, special, variant)) ? Number(energie) : 0;

    // Gestion du coût et de la dépense, seulement si value === true
    if (value) {
      let strDepense = capacite;
      if(special) strDepense += `/${special}`;
      if(variant) strDepense += `/${variant}`;

      // Tente la dépense
      const depense = await this._depensePE(getArmure, strDepense);

      if (!depense) return; // on s’arrête si la dépense est refusée
    }

    let pb;
    let newActor;
    let sendMsg = true;

    switch(capacite) {
      case 'ascension': {
        if (value) {
          // 1) Cloner proprement les données source via deepClone
          const clone = foundry.utils.deepClone(this);
          // 2) Créer l’acteur d’ascension
          const src = await Actor.create(clone);

          // 3) Editer nom et visuels
          const newName = `${getName} : ${this.name}`;
          const armorImg = getArmure.img ?? src.img;

          // 4) Préparer l’état ascension sur l’acteur cloné
          await PatchBuilder.for(src)
            .merge({
              name:newName,
              img:armorImg,
              'prototypeToken.texture.src':armorImg,
              'prototypeToken.name':newName,
              'system.energie.value':this?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0,
              'system.wear':'ascension',
              'system.equipements.ascension':this?.system?.equipements?.armure ?? {}
            })
            .apply();

          // 5) Nettoyer/adapter les items
          const filteredItems = [];
          for (const it of src.items ?? []) {
            // retirer les items de rareté prestige
            if (it?.system?.niveau?.actuel?.rarete === 'prestige') filteredItems.push(it.id);

            if (it.type === 'armure') {
              // couper les jauges sur les armures du clone
              await PatchBuilder.for(it)
                .sys('jauges', {
                  sante:false,
                  espoir:false,
                  heroisme:false,
                })
                .sys('energie.base', this?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0)
                .apply();
            }
          }

          await batchDeleteItemsBy(src, filteredItems);
          // 6) Marquer l’état côté armure d’origine (update unique agrégé)
          await PatchBuilder.for(armure)
            .sys(getPath, {
              active:true,
              depense:this?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0,
              ascensionId: src.id,
            })
            .apply();

          // 7) Spawner le token d’ascension
          await spawnTokenRightOfActor({ actor: src, refActor: this });
        } else {
          // Désactivation: suppression + reset de l’état
          const ascensionId =
            getCapacite?.ascensionId ??
            getCapacite?.id ??
            null;
          await deleteActorAndTokens(ascensionId);
          await PatchBuilder.for(armure)
            .sys(getPath, {
              active: false,
              ascensionId: 0,
              depense: 0,
            })
            .apply();
        }
        break;
      }

      case "borealis":
      case "goliath":
      case "puppet":
      case "record":
      case "totem":
      case "watchtower":
      case "ghost":
      case "discord":
      case "nanoc":
        await PatchBuilder.for(armure)
          .sys(getPath, value)
          .apply();
        break;
      case "illumination":
        if(special === 'lantern' && variant === 'dgts') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.LANTERN.Label")

          await this._degats(blaLabel, [], [], {dice:getCapacite.lantern.degats});
          sendMsg = false;
        } else if(special === 'blaze' && variant === 'dgts') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Label")

          await this._degats(blaLabel, [], [], {dice:getCapacite.blaze.degats});
          await this._violence(blaLabel, [], [], {dice:getCapacite.blaze.violence});
          sendMsg = false;
        } else if(special !== 'candle') {
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "oriflamme":
        const oriLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ORIFLAMME.Label")

        if(special.includes('degats')) this._degats(oriLabel, getCapacite.effets.raw, getCapacite.effets.custom, getCapacite.degats);
        if(special.includes('violence')) this._violence(oriLabel, getCapacite.effets.raw, getCapacite.effets.custom, getCapacite.violence);
        break;
      case 'changeling':
        // Cas "explosive": on désactive plusieurs flags et on applique des dégâts/violence
        if (special === 'explosive') {
          const pbC = new PatchBuilder();

          for (const p of getPath) {
            pbC.sys(p, false);
          }

          // Récupérer les effets depuis les capacités d'armure
          const effets = getCapacite?.desactivationexplosive?.effets ?? {};
          this._degats(getName, effets.raw, effets.custom, getCapacite?.degats ?? {dice:1, fixe:0});
          this._violence(getName, effets.raw, effets.custom, getCapacite?.violence ?? {dice:1, fixe:0});

          pbC.applyTo(armure);
        } else {
          // Cas simple: appliquer value sur le chemin fourni
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "companions":
        pb = new PatchBuilder();
        pb.sys(getPath, {
          [special]:value,
          base:value,
        });

        if(value) {
          switch(special) {
            case 'lion':
              const dataLion = getCapacite.lion;

              const dataLChair = dataLion.aspects.chair;
              const dataLBete = dataLion.aspects.bete;
              const dataLMachine = dataLion.aspects.machine;
              const dataLDame = dataLion.aspects.dame;
              const dataLMasque = dataLion.aspects.masque;
              const modules = this.items.filter(itm => itm.type === 'module' && (itm.system?.isLion ?? false));
              newActor = await createSheet(
                this,
                "pnj",
                `${this.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label")}`,
                {
                  "aspects": {
                    "chair":{
                      "value":dataLChair.value,
                      "ae":splitAE(dataLChair.ae),
                    },
                    "bete":{
                      "value":dataLBete.value,
                      "ae":splitAE(dataLBete.ae),
                    },
                    "machine":{
                      "value":dataLMachine.value,
                      "ae":splitAE(dataLMachine.ae),
                    },
                    "dame":{
                      "value":dataLDame.value,
                      "ae":splitAE(dataLDame.ae),
                    },
                    "masque":{
                      "value":dataLMasque.value,
                      "ae":splitAE(dataLMasque.ae),
                    }
                  },
                  "energie":{
                    "base":this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                    "value":this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  },
                  "champDeForce":{
                    "base":dataLion.champDeForce.base,
                  },
                  "armure":{
                    "value":dataLion.armure.base,
                    "base":dataLion.armure.base
                  },
                  "initiative":{
                    "diceBase":dataLion.initiative.value
                  },
                  "defense":{
                    "base":dataLion.defense.value
                  },
                  "reaction":{
                    "base":dataLion.reaction.value
                  },
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "noCapacites":true,
                    "modules":true,
                    "phase2":false
                  }
                },
                [],
                dataLion.img,
                dataLion?.token ?? dataLion.img,
                1
              );

              await PatchBuilder.for(newActor)
                .sys('initiative.bonus.user', dataLion.initiative.fixe)
                .apply();

              const nLItems = modules;

              const nLItem = {
                name:dataLion.armes.contact.coups.label,
                type:'arme',
                system:{
                  type:'contact',
                  portee:dataLion.armes.contact.coups.portee,
                  degats:{
                    dice:dataLion.armes.contact.coups.degats.dice,
                    fixe:dataLion.armes.contact.coups.degats.fixe
                  },
                  violence:{
                    dice:dataLion.armes.contact.coups.violence.dice,
                    fixe:dataLion.armes.contact.coups.violence.fixe
                  },
                  effets:{
                    raw:dataLion.armes.contact.coups.effets.raw,
                    custom:dataLion.armes.contact.coups.effets.custom
                  }
              }};

              nLItems.push(nLItem);

              await newActor.createEmbeddedDocuments("Item", nLItems);

              pb.sys('capacites.selected.companions.lion.id', newActor.id);

              await spawnTokenRightOfActor({actor:newActor, refActor:this});
              break;

            case 'wolf':
              const dataWolf = getCapacite.wolf;

              const dataWChair = dataWolf.aspects.chair;
              const dataWBete = dataWolf.aspects.bete;
              const dataWMachine = dataWolf.aspects.machine;
              const dataWDame = dataWolf.aspects.dame;
              const dataWMasque = dataWolf.aspects.masque;
              const createdActors = [];
              const dataActor = {
                "aspects": {
                  "chair":{
                    "value":dataWChair.value
                  },
                  "bete":{
                    "value":dataWBete.value
                  },
                  "machine":{
                    "value":dataWMachine.value
                  },
                  "dame":{
                    "value":dataWDame.value
                  },
                  "masque":{
                    "value":dataWMasque.value
                  }
                },
                "energie":{
                  "base":this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  "value":this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                },
                "champDeForce":{
                  "base":dataWolf.champDeForce.base,
                },
                "armure":{
                  "value":dataWolf.armure.base,
                  "base":dataWolf.armure.base
                },
                "initiative":{
                  "diceBase":dataWolf.initiative.value
                },
                "defense":{
                  "base":dataWolf.defense.base
                },
                "reaction":{
                  "base":dataWolf.reaction.base
                },
                "wolf":dataWolf.configurations,
                "configurationActive":'',
                "options":{
                  "resilience":false,
                  "sante":false,
                  "espoir":false,
                  "bouclier":false,
                  "modules":false,
                  "noCapacites":true,
                  "wolfConfiguration":true
                }
              };

              for(let i = 1;i < 4;i++) {
                newActor = await createSheet(
                  this,
                  "pnj",
                  `${this.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label")} ${i}`,
                  dataActor,
                  {},
                  dataWolf.img,
                  dataWolf?.token ?? dataWolf.img,
                  1
                );

                await PatchBuilder.for(newActor)
                  .sys('initiative.bonus.user', dataWolf.initiative.fixe)
                  .apply();
                const nWItems = [];
                const nWItem = {
                  name:dataWolf.armes.contact.coups.label,
                  type:'arme',
                  system:{
                    type:'contact',
                    portee:dataWolf.armes.contact.coups.portee,
                    degats:{
                      dice:dataWolf.armes.contact.coups.degats.dice,
                      fixe:dataWolf.armes.contact.coups.degats.fixe
                    },
                    violence:{
                      dice:dataWolf.armes.contact.coups.violence.dice,
                      fixe:dataWolf.armes.contact.coups.violence.fixe
                    },
                    effets:{
                      raw:dataWolf.armes.contact.coups.effets.raw,
                      custom:dataWolf.armes.contact.coups.effets.custom
                    }
                }};

                nWItems.push(nWItem);

                await newActor.createEmbeddedDocuments("Item", nWItems);

                pb.sys(`capacites.selected.companions.wolf.id.id${i}`, newActor.id);
                createdActors.push(newActor);
              }

              await spawnTokensRightOfActor(createdActors, this);
              break;

            case 'crow':
              const dataCrow = getCapacite.crow;

              const dataCChair = dataCrow.aspects.chair;
              const dataCBete = dataCrow.aspects.bete;
              const dataCMachine = dataCrow.aspects.machine;
              const dataCDame = dataCrow.aspects.dame;
              const dataCMasque = dataCrow.aspects.masque;

              newActor = await createSheet(
                this,
                "bande",
                `${this.name} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label")}`,
                {
                  "aspects": {
                    "chair":{
                      "value":dataCChair.value
                    },
                    "bete":{
                      "value":dataCBete.value
                    },
                    "machine":{
                      "value":dataCMachine.value
                    },
                    "dame":{
                      "value":dataCDame.value
                    },
                    "masque":{
                      "value":dataCMasque.value
                    }
                  },
                  "energie":{
                    "value":this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                    "max":this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0,
                  },
                  "champDeForce":{
                    "base":dataCrow.champDeForce.base,
                  },
                  "sante":{
                    "value":dataCrow.cohesion.base,
                    "base":dataCrow.cohesion.base
                  },
                  "initiative":{
                    "diceBase":dataCrow.initiative.value
                  },
                  "defense":{
                    "base":dataCrow.defense.value
                  },
                  "reaction":{
                    "base":dataCrow.reaction.value
                  },
                  "debordement":{
                    "value":dataCrow.debordement.base
                  },
                  "options":{
                    "resilience":false,
                    "sante":false,
                    "espoir":false,
                    "bouclier":false,
                    "noCapacites":true,
                    "energie":true,
                    "modules":false
                  }
                },
                {},
                dataCrow.img,
                dataCrow?.token ?? dataCrow.img,
                1
              );
              await PatchBuilder.for(newActor)
                .sys('initiative.bonus.user', dataCrow.initiative.fixe)
                .apply();

              pb.sys(`capacites.selected.companions.crow.id`, newActor.id);

              await spawnTokenRightOfActor({actor:newActor, refActor:this});
              break;
          }

          const msgCompanions = {
            flavor:`${getName}`,
            main:{
              total:`${game.i18n.format("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Invocation", {type:game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.${special.toUpperCase()}.Label`)})}`
            }
          };

          const msgActiveCompanions = {
            user: game.user.id,
            speaker: {
              actor: this?.id || null,
              token: this?.token?.id || null,
              alias: this?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
            sounds:CONFIG.sounds.notification,
          };

          await ChatMessage.create(msgActiveCompanions);
        } else {
          let recupValue = 0;

          switch(special) {
            case 'lion':
              const idLion = getCapacite.lion.id;
              const actorLion = game.actors?.get(idLion) || {};
              recupValue = actorLion?.system?.energie?.value || 0;

              this._gainPE(recupValue, getArmure);

              await deleteTokens([actorLion.id]);

              if(Object.keys(actorLion).length != 0) await actorLion.delete();
              break;

            case 'wolf':
              const id1Wolf = getCapacite.wolf.id.id1;
              const id2Wolf = getCapacite.wolf.id.id2;
              const id3Wolf = getCapacite.wolf.id.id3;
              const actor1Wolf = game.actors?.get(id1Wolf) || {};
              const actor2Wolf = game.actors?.get(id2Wolf) || {};
              const actor3Wolf = game.actors?.get(id3Wolf) || {};

              recupValue = actor1Wolf?.system?.energie?.value || 0;

              this._gainPE(recupValue, getArmure);

              await deleteTokens([actor1Wolf.id, actor2Wolf.id, actor3Wolf.id]);

              if(Object.keys(actor1Wolf).length != 0) await actor1Wolf.delete();
              if(Object.keys(actor2Wolf).length != 0) await actor2Wolf.delete();
              if(Object.keys(actor3Wolf).length != 0) await actor3Wolf.delete();
              break;

            case 'crow':
              const idCrow = getCapacite.crow.id;
              const actorCrow = game.actors?.get(idCrow) || {};

              recupValue = actorCrow?.system?.energie?.value || 0;

              this._gainPE(recupValue, getArmure);

              await deleteTokens([actorCrow.id]);

              if(Object.keys(actorCrow).length != 0) await actorCrow.delete();
              break;
          }

          const msgCompanions = {
            flavor:`${name}`,
            main:{
              total:`${game.i18n.format("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.Revocation", {type:game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.${special.toUpperCase()}.Label`)})}`
            }
          };

          const msgActiveCompanions = {
            user: game.user.id,
            speaker: {
              actor: this?.id || null,
              token: this?.token?.id || null,
              alias: this?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgCompanions),
            sounds:CONFIG.sounds.notification,
          };

          await ChatMessage.create(msgActiveCompanions);
        }

        await pb.applyTo(armure);
        break;
      case "shrine":
        await PatchBuilder.for(armure)
          .sys(getPath, {
            base:value,
            [special]:value,
          })
          .apply();
        break;
      case "morph":
        pb = new PatchBuilder();

        if(!special) {
          pb.sys(getPath.split('.').slice(0, -1).join('.'), {
              'morph':value,
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
          pb.sys(`${getPath.split('.').slice(0, -2).join('.')}.choisi`, {
              'vol':false,
              'phase':false,
              'etirement':false,
              'metal':false,
              'fluide':false,
              'polymorphie':false,
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
        }
        else if(special !== 'polymorphieReset' && (special !== 'phase' || special !== 'phaseN2')) pb.sys(getPath, value);
        else if(special === 'polymorphieReset') {
          sendMsg = false;

          pb.sys(getPath, {
              'polymorphieLame':false,
              'polymorphieGriffe':false,
              'polymorphieCanon':false,
            })
        }

        if(variant === 'choix') sendMsg = false;

        await pb.applyTo(armure);
        break;
      case "rage":
        const rageInterdit = [];
        const rageBonus = [];

        if(!special) {
          pb = new PatchBuilder();

          pb.sys(getPath[0], value);

          if(value) {
            pb.sys(getPath[1], {
              colere:true,
            });

            if(getCapacite.colere.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.colere.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.colere.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.colere.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          }
          else {
            pb.sys(getPath[1], {
              colere:false,
              rage:false,
              fureur:false,
            });
          }

          await pb.applyTo(armure);
          await PatchBuilder.for(this)
            .sys('combos.interdits.caracteristiques.rage', value ? rageInterdit : [])
            .sys('combos.bonus.caracteristiques.rage', value ? rageBonus : [])
            .apply();
        } else if(special === 'niveau') {
          sendMsg = false;
          pb = new PatchBuilder();
          const nActuel = getCapacite?.niveau || false;

          if(variant === 'ennemi') {
            new game.knight.RollKnight(this,
            {
              name:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Label")}`,
            }).sendMessage({
                text: game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Ennemi"),
                sounds:CONFIG.sounds.notification,
            });
          }

          if(nActuel.colere) {
            pb.sys(getPath, {
              colere:false,
              rage:true,
            });

            if(getCapacite.rage.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.rage.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.rage.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.rage.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          } else if(nActuel.rage) {
            pb.sys(getPath, {
              colere:false,
              rage:false,
              fureur:true,
            });

            if(getCapacite.fureur.combosInterdits.has) {
              for (let [key, combo] of Object.entries(getCapacite.fureur.combosInterdits.liste)){
                if(combo != "") {
                  rageInterdit.push(combo);
                }
              }
            }

            if(getCapacite.fureur.combosBonus.has) {
              for (let [key, combo] of Object.entries(getCapacite.fureur.combosBonus.liste)){
                if(combo != "") {
                  rageBonus.push(combo);
                }
              }
            }
          }

          await pb.applyTo(armure);
          await PatchBuilder.for(this)
            .sys('combos.interdits.caracteristiques.rage', rageInterdit)
            .sys('combos.bonus.caracteristiques.rage', rageBonus)
            .apply();

          const exec = new game.knight.RollKnight(this,
            {
            name:game.i18n.localize(`KNIGHT.ACTIVATION.Label`),
            }).sendMessage({
                text:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label")} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Label")}`,
                sounds:CONFIG.sounds.notification,
            });
        } else if(special === 'degats') {
          sendMsg = false;
          const niveauActuel = Object.keys(getCapacite?.niveau ?? {}).find(k => getCapacite.niveau[k] === true) ?? null;
          const degatsRage = getCapacite[niveauActuel].subis;
          const degatsLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.SubirDegats");
          const sante = this.system.sante.value;

          const rDegats = new game.knight.RollKnight(this, {
            name:`${getName} : ${degatsLabel}`,
            dices:`${degatsRage}D6`,
          }, false);

          await rDegats.doRoll({['system.sante.value']:`@{max, 0} ${sante}-@{rollTotal}`});
        } else if(special === 'recuperation') {
          sendMsg = false;
          const recuperationRage = variant.split('/');
          const labelRecuperationRage = recuperationRage[0] === 'proche' ? game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.TUE.Proche") : `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.TUE.${capitalizeFirstLetter(recuperationRage[0])}`)} : ${game.i18n.localize(`KNIGHT.TYPE.${capitalizeFirstLetter(recuperationRage[1])}`)}`;
          const getRecuperationRageDices = recuperationRage[0] === 'proche' ? {dice:0, face:6, fixe:1}: getCapacite.nourri[recuperationRage[0]][recuperationRage[1]];

          const rRecuperation = new game.knight.RollKnight(this, {
            name:game.i18n.localize("KNIGHT.GAINS.Espoir") + ` (${labelRecuperationRage})`,
            dices:`${getRecuperationRageDices.dice}D${getRecuperationRageDices.face}+${getRecuperationRageDices.fixe}`,
          }, false);

          this._gainPE(await rRecuperation.doRoll(), getArmure, true);
        } else if(special === 'blaze') {
          const blaLabel = game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.BLAZE.Label")

          await this._degats(blaLabel, [], [], {dice:getCapacite.blaze.degats});
          await this._violence(blaLabel, [], [], {dice:getCapacite.blaze.violence});
        }
        break;
      case "warlord":
        if(special !== 'energie') {
          await PatchBuilder.for(armure)
            .sys(getPath, value)
            .apply();
        }
        break;
      case "zen":
        function collectTrueNames(data) {
          const out = [];
          for (const [branche, bloc] of Object.entries(data)) {
            const caracs = bloc && bloc.caracteristiques;
            if (!caracs || typeof caracs !== "object") continue;

            for (const [nom, details] of Object.entries(caracs)) {
              if (details && details.value === true) {
                out.push(nom);
              }
            }
          }
          return out;
        }

        const listC = collectTrueNames(getCapacite.aspects)

        const autre = [].concat(listC);
        autre.shift();

        const dialog = new game.knight.applications.KnightRollDialog(this._id, {
          label:getName,
          base:listC[0],
          whatRoll:autre,
          difficulte:5,
        });

        dialog.open();
        break;
      case "type":
        await PatchBuilder.for(armure)
          .sys(getPath, value)
          .apply();
        break;
      case "mechanic":
        const mechanic = getCapacite.reparation[special];
        const roll = new game.knight.RollKnight(this, {
          name:`${getName}`,
          dices:`${mechanic.dice}D6+${mechanic.fixe}`,
        }, false);

        await roll.doRoll();
        break;
      default:
        console.warn(`activateCapacity: capacité inconnue "${capacite}"`);
        break;
    }

    if(sendMsg) {
      const exec = new game.knight.RollKnight(this,
        {
        name:value ? game.i18n.localize(`KNIGHT.ACTIVATION.Label`) : game.i18n.localize(`KNIGHT.ACTIVATION.Desactivation`),
        }).sendMessage({
            text:getName,
            sounds:CONFIG.sounds.notification,
        });
    }
  }

  async _depensePE(armure, capacite, forceEspoir = false) {
    const split = capacite.split('/');
    const mainLabel = game.i18n.localize(CONFIG.KNIGHT.capacites[split[0]]);
    const subLabel = split[1] ? ` ${game.i18n.localize(CONFIG.KNIGHT[split[1]])}` : '';
    const label = subLabel ? `${mainLabel} : ${subLabel}` : mainLabel;

    const remplaceEnergie = armure.espoirRemplaceEnergie;
    const getType = remplaceEnergie || forceEspoir ? 'espoir' : 'energie';
    const getCapacite = armure.getCapacite(split[0]);
    const hasFlux = armure.hasFlux;

    const flux = hasFlux ? this?.system?.flux?.value ?? 0 : 0;
    const value = this?.system?.[getType]?.value ?? 0;
    const espoir = this?.system?.espoir?.value ?? 0;

    const sendLackMsg = async (i18nKey) => {
      const payload = {
        flavor: `${label}`,
        main: { total: `${game.i18n.localize(`KNIGHT.JETS.${i18nKey}`)}` }
      };
      const data = {
        user: game.user.id,
        speaker: {
          actor: this?.id ?? null,
          token: this?.token?.id ?? null,
          alias: this?.name ?? null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', payload),
        sound: CONFIG.sounds.dice
      };
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(data, rMode);
      await ChatMessage.create(msgData, { rollMode: rMode });
    };

    let depenseEnergie = 0;
    let depenseFlux = 0;
    let depenseEspoir = 0;
    let substractEnergie = 0;
    let substractEspoir = 0;
    let substractFlux = 0;
    switch(split[0]) {
      case 'ascension':
        depenseEnergie = this?.system?.equipements?.armure?.capacites?.ascension?.energie ?? 0;
        break;

      case 'borealis':
        depenseEnergie = split[1] === 'support' ?
          getCapacite[split[1]].energie.base + (getCapacite[split[1]].energie.allie * this?.system?.equipements?.armure?.capacites?.borealis?.allie ?? 0) :
          getCapacite[split[1]].energie;
        break;

      case 'changeling':
        if(split[1] !== 'explosive') {
          depenseEnergie = split[1] === 'fauxEtre' ?
            getCapacite.energie[split[1]].value * this?.system?.equipements?.armure?.capacites?.changeling?.fauxetres ?? 0 :
            getCapacite.energie[split[1]];
        }
        break;

      case 'companions':
        depenseEnergie = getCapacite.energie.base + this?.system?.equipements?.armure?.capacites?.companions?.energie ?? 0;
        break;

      case 'discord':
        depenseEnergie = getCapacite[split[1]].energie;
        depenseFlux = getCapacite[split[1]].flux;
        break;

      case 'windtalker':
        depenseEnergie = getCapacite.energie;
        depenseFlux = getCapacite.flux;
        break;

      case 'falcon':
      case 'forward':
      case 'record':
      case 'rewind':
      case 'oriflamme':
      case 'watchtower':
        depenseEnergie = getCapacite.energie;
        break;

      case 'goliath':
        depenseEnergie = getCapacite.energie * this?.system?.equipements?.armure?.capacites?.goliath?.metre ?? 0;
        break;

      case 'nanoc':
      case 'mechanic':
        depenseEnergie = getCapacite.energie[split[1]];
        break;

      case 'shrine':
        if(split[1] === 'distance' || split[1] === 'personnel') depenseEnergie = getCapacite.energie[split[1]];
        else if(split[1] === 'distance6' || split[1] === 'personnel6') depenseEnergie = getCapacite.energie[`${split[1]}tours`];
        break;

      case 'ghost':
        depenseEnergie = getCapacite.energie[split[1] === 'conflit' ? 'tour' : 'minute'];
        break;

      case 'type':
        depenseEnergie = getCapacite.energie[split[2] === 'conflit' ? 'tour' : 'scene'];
        break;

      case 'totem':
        depenseEnergie = getCapacite.energie.base * this?.system?.equipements?.armure?.capacites?.totem?.nombre ?? 0;
        break;

      case 'puppet':
        depenseEnergie = getCapacite.energie.ordre + (this?.system?.equipements?.armure?.capacites?.puppet?.cible ?? 0 * getCapacite.energie.supplementaire);
        break;

      case 'illumination':
        if(split[1] === 'candle') {
          const roll = new game.knight.RollKnight(this.actor, {
            name:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.ILLUMINATION.CANDLE.SacrificeGainEspoir"),
            dices:`${getCapacite.candle.espoir.dice}D${getCapacite.candle.espoir.face}`,
          }, false);

          const total = await roll.doRoll();
          depenseEnergie = total;
        } else depenseEnergie = getCapacite[split[1]].espoir.base;
        break;

      case 'morph':
        if(split[1] === 'phase' && split[2] !== 'choix') depenseEnergie = getCapacite.phase.energie;
        else if(split[1] === 'phaseN2' && split[2] !== 'choix') depenseEnergie = getCapacite.phase.niveau2.energie;
        else if(split[1]) return true;
        else {
          depenseEnergie = getCapacite.energie;
          depenseEspoir = getCapacite.espoir;
        }
        break;

      case 'rage':
        if(split[1] === 'active') depenseEnergie = getCapacite.espoir;
        else if(split[1] === 'niveau' && split[2] === 'espoir') {
          const roll = new game.knight.RollKnight(this.actor, {
            name:`${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.Label")} : ${game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.RAGE.UP.Espoir")}`,
            dices:'1D6',
          }, false);

          const total = await roll.doRoll();

          depenseEspoir = total;
        }
        break;

      case 'vision':
        depenseEnergie = this?.system?.equipements?.armure?.capacites?.vision?.energie ?? 0;
        break;

      case 'warlord':
        if(split[2] === 'porteur') {
          depenseEnergie = getCapacite.impulsions[split[1]].energie[split[2]];
        } else {
          switch(split[1]) {
            case 'energie':
              depenseEnergie = this?.system?.equipements?.armure?.capacites?.warlord?.energie?.nbre ?? 0;
              break;

            case 'action':
              depenseEnergie = getCapacite.impulsions[split[1]].energie[split[2]];
              break;

            case 'esquive':
            case 'guerre':
            case 'force':
              depenseEnergie = this?.system?.equipements?.armure?.capacites?.warlord?.[split[1]]?.nbre ?? 0 * getCapacite.impulsions[split[1]].energie[split[2]];
              break;
          }
        }
        break;
    }

    if(remplaceEnergie) depenseEnergie += depenseEspoir;

    substractEnergie = value - depenseEnergie;
    substractEspoir = espoir - depenseEspoir;
    substractFlux = flux - depenseFlux;
    if(substractEnergie < 0) {
      await sendLackMsg(`${remplaceEnergie || forceEspoir ? 'Notespoir' : 'Notenergie'}`);

      return false;
    } else if(substractEspoir < 0 && !remplaceEnergie) {
      await sendLackMsg(`Notespoir`);

      return false;
    } else if(substractFlux < 0 && hasFlux) {
      await sendLackMsg(`Notflux`);

      return false;
    } else {
      let pbE = new PatchBuilder();

      if(!remplaceEnergie) pbE.sys(`equipements.${this.system.wear}.${getType}.value`, substractEnergie);
      else if(remplaceEnergie && !this.system.espoir.perte.saufAgonie) pbE.sys('espoir.value', substractEnergie);

      if(!remplaceEnergie && depenseEspoir) pbE.sys('espoir.value', substractEspoir);

      if(depenseFlux && hasFlux) pbE.sys('flux.value', substractFlux);

      await pbE.applyTo(this);

      return true;
    }
  }

  async _gainPE(gain, armure, forceEspoir=false) {
    const data = this;
    const remplaceEnergie = armure.espoirRemplaceEnergie;

    const type = remplaceEnergie === true || forceEspoir ? 'espoir' : 'energie';
    const actuel = remplaceEnergie === true || forceEspoir ? +data.system.espoir.value : +data.system.energie.value;
    const total = remplaceEnergie === true || forceEspoir ? +data.system.espoir.max : +data.system.energie.max;
    let add = actuel+gain;

    if(add > total) {
      add = total;
    }

    let pbE = new PatchBuilder();

    if(type === 'espoir') pbE.sys('espoir.value', add);
    else pbE.sys(`equipements.${data.system.wear}.${type}.value`, add);

    await pbE.applyTo(this);

    return true;
  }

  async _degats(label, raw=[], custom=[], dices={dice:0, fixe:0}) {
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

    const roll = new game.knight.RollKnight(this, {
      name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Degats")}`,
    }, false);
    const weapon = roll.prepareWpnDistance({
      name:`${label}`,
      system:{
        degats:{dice:dices.dice, fixe:dices.fixe},
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
  }

  async _violence(label, raw=[], custom=[], dices={dice:0, fixe:0}) {
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

    const roll = new game.knight.RollKnight(this, {
      name:`${label} : ${game.i18n.localize("KNIGHT.AUTRE.Violence")}`,
    }, false);
    const weapon = roll.prepareWpnDistance({
      name:`${label}`,
      system:{
        degats:{dice:0, fixe:0},
        violence:dices,
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
    await roll.doRollViolence(flags);
  }
}