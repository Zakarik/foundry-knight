import {
  getEffets,
  getAspectValue,
  getAEValue,
  listEffects,
  SortByName,
  confirmationDialog,
  effectsGestion,
  diceHover,
  options,
  commonPNJ,
  hideShowLimited,
  dragMacro,
} from "../../helpers/common.mjs";

import {
  dialogRoll,
  actualiseRoll,
} from "../../helpers/dialogRoll.mjs";

import toggler from '../../helpers/toggler.js';

const path = {
  espoir:{
    bonus:'system.espoir.bonusValue',
    malus:'system.espoir.malusValue',
  },
  sante:{
    bonus:'system.sante.bonusValue',
    malus:'system.sante.malusValue',
  },
  egide:{
    bonus:'system.egide.bonusValue',
    malus:'system.egide.malusValue',
  },
  reaction:{
    bonus:'system.reaction.bonusValue',
    malus:'system.reaction.malusValue',
  },
  defense:{
    bonus:'system.defense.bonusValue',
    malus:'system.defense.malusValue',
  },
  armure:{
    bonus:'system.armure.bonusValue',
    malus:'system.armure.malusValue',
  },
  energie:{
    bonus:'system.energie.bonusValue',
    malus:'system.energie.malusValue',
  },
  champDeForce:{
    base:'system.champDeForce.base',
    bonus:'system.champDeForce.bonusValue',
    malus:'system.champDeForce.malusValue',
  },
};

/**
 * @extends {ActorSheet}
 */
export class BandeSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["bande", "sheet", "actor"],
      template: "systems/knight/templates/actors/bande-sheet.html",
      width: 900,
      height: 780,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    this._prepareCharacterItems(context);
    this._prepareAE(context);

    context.systemData = context.data.system;

    actualiseRoll(this.actor);

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

    html.find('div.bCapacite img.info').click(ev => {
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

    hideShowLimited(this.actor, html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    diceHover(html);
    options(html, this.actor);
    commonPNJ(html, this.actor);

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

    html.find('.capacites div.bCapacite .activation').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const capacite = $(ev.currentTarget).data("capacite");
      const name = $(ev.currentTarget)?.data("name") || '';
      const tenebricide = $(ev.currentTarget)?.data("tenebricide") || false;
      const obliteration = $(ev.currentTarget)?.data("obliteration") || false;

      const data = this.actor.items.get(capacite);

      if(type === 'degats') {
        const dataDegats = data.system;

        const allEffets = await this._getAllEffets(dataDegats.degats.system, tenebricide, obliteration)
        this._doDgts(name, dataDegats.degats.system, allEffets);
      }
    });

    html.find('.jetDebordement').click(async ev => {
      const name = $(ev.currentTarget)?.data("name") || '';
      const value = eval($(ev.currentTarget).data("value"));

      this._doDebordement(name, value);
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;

      dialogRoll(label, this.actor, {base:aspect, succesBonus:reussites});
    });

    html.find('img.rollSpecifique').click(async ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const roll = target.data("roll");

      const rSpec = new game.knight.RollKnight(`${roll}`, this.actor.system);
      rSpec._flavor = name;
      rSpec._success = true;

      await rSpec.toMessage({
        speaker: {
        actor: this.actor?.id || null,
        token: this.actor?.token?.id || null,
        alias: this.actor?.name || null,
        }
      });
    });

    html.find('div.options button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const option = target.data("option");
      const result = value === true ? false : true;

      this.actor.update({[`system.options.${option}`]:result});
    });

    html.find('.activatePhase2').click(ev => {
      const data = this.getData().data.system;
      const options = data.options;
      const phase2 = data.phase2;

      const effects = [];

      if(options.sante) {
        effects.push({
          key: path.sante.bonus,
          mode: 2,
          priority: null,
          value: phase2.sante
        });
      }

      if(options.armure) {
        effects.push({
          key: path.armure.bonus,
          mode: 2,
          priority: null,
          value: phase2.armure
        });
      }

      if(options.energie) {
        effects.push({
          key: path.energie.bonus,
          mode: 2,
          priority: null,
          value: phase2.energie
        });
      }

      const listAspects = ['chair', 'bete', 'machine', 'dame', 'masque'];

      for(let i = 0;i < listAspects.length;i++) {
        const label = listAspects[i];

        effects.push({
          key: `system.aspects.${label}.value`,
          mode: 5,
          priority: null,
          value: Number(data.aspects[label].value)+Number(phase2.aspects[label].value)
        },
        {
          key: `system.aspects.${label}.ae.mineur.value`,
          mode: 5,
          priority: null,
          value: Number(data.aspects[label].ae.mineur.value)+Number(phase2.aspects[label].ae.mineur)
        },
        {
          key: `system.aspects.${label}.ae.majeur.value`,
          mode: 5,
          priority: null,
          value: Number(data.aspects[label].ae.majeur.value)+Number(phase2.aspects[label].ae.majeur)
        });
      }

      addOrUpdateEffect(this.actor, 'phase2', effects);
      this.actor.update({['system.phase2Activate']:true});
    });

    html.find('.desactivatePhase2').click(ev => {
      const listEffect = this.actor.getEmbeddedCollection('ActiveEffect');
      const effectExist = existEffect(listEffect, 'phase2');
      const toUpdate = [];

      toUpdate.push({
        "_id":effectExist._id,
        disabled:true
      });

      updateEffect(this.actor, toUpdate);
      this.actor.update({['system.phase2Activate']:false});
    });

    html.find('button.destruction').click(async ev => {
      await this.actor.delete();
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
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;
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

    const create = await Item.create(itemData, {parent: this.actor});

    // Finally, create the item!
    return create;
  }

  async _onDropItemCreate(itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    const itemBaseType = itemData[0].type;

    const typesValides = [
      'arme', 'module', 'armure',
      'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma', 'langue',
      'armurelegende', 'effet', 'distinction',
      'capaciteultime'];
    if (typesValides.includes(itemBaseType)) return;

    const itemCreate = await this.actor.createEmbeddedDocuments("Item", itemData);

    return itemCreate;
  }

  async _prepareCharacterItems(sheetData) {
    const version = game.version.split('.');
    const actorData = sheetData.actor;
    const system = sheetData.data.system;

    const capacites = [];
    const aspects = {
      "chair":system.aspects.chair.value,
      "bete":system.aspects.bete.value,
      "machine":system.aspects.machine.value,
      "dame":system.aspects.dame.value,
      "masque":system.aspects.masque.value,
    };
    const aspectLieSupp = [];
    const aspectsMax = {
      chair:{max:[20], ae:{mineur:[10], majeur:[10]}},
      bete:{max:[20], ae:{mineur:[10], majeur:[10]}},
      machine:{max:[20], ae:{mineur:[10], majeur:[10]}},
      dame:{max:[20], ae:{mineur:[10], majeur:[10]}},
      masque:{max:[20], ae:{mineur:[10], majeur:[10]}},
    };

    let armure = {
      bonus:{
        modules:[0],
        capacites:[0]
      }
    };
    let reaction = {
      bonus:{
        armes:0,
        capacites:0
      },
      malus:{
        armes:0,
        capacites:0
      }
    };
    let defense = {
      bonus:{
        armes:0,
        capacites:0
      },
      malus:{
        armes:0,
        capacites:0
      }
    };
    let sante = {
      bonus:0,
      malus:0
    };
    const effects = {capacites:[]}

    for (let i of sheetData.items) {
      const data = i.system;

      // CAPACITES
      if (i.type === 'capacite') {
        capacites.push(i);

        const isPhase2 = data.isPhase2;
        const bonus = data.bonus;
        const attaque = data.attaque;

        const aLieSupp = bonus.aspectsLieSupplementaire;
        const cSante = bonus.sante;
        const cArmure = bonus.armure;
        const aspectMax = bonus.aspectMax;

        if(!isPhase2) {
          if(aLieSupp.has) aspectLieSupp.push(aLieSupp.value);

          if(cSante.has) {
            if(cSante.aspect.lie) {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: aspects[cSante.aspect.value]*cSante.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: cSante.value
              });
            }
          }

          if(cArmure.has) {
            if(cArmure.aspect.lie) {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: aspects[cArmure.aspect.value]*cArmure.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: cArmure.value
              });
            }
          }

          if(aspectMax.has) {
            const aMax = aspectMax.aspect;
            aspectsMax[aMax].max.push(aspectMax.maximum.aspect);
            aspectsMax[aMax].ae.mineur.push(aspectMax.maximum.ae);
            aspectsMax[aMax].ae.majeur.push(aspectMax.maximum.ae);
          }

          if(attaque.has) {
            const capaciteWpn = {
              _id:i._id,
              name:i.name,
              type:'capacite',
              system:{
                noRack:true,
                type:attaque.type,
                portee:attaque.portee,
                degats:attaque.degats,
                violence:{
                  dice:0,
                  fixe:0,
                },
                effets:{
                  raw:attaque.effets.raw,
                  custom:attaque.effets.custom,
                }
              }
            }

            if(attaque.type === 'contact') {
              armesContact.push(capaciteWpn);
            } else if(attaque.type === 'distance') {
              armesDistance.push(capaciteWpn);
            }
          }
        } else if(isPhase2 && system.phase2Activate) {
          if(aLieSupp.has) aspectLieSupp.push(aLieSupp.value);

          if(cSante.has) {
            if(cSante.aspect.lie) {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: aspects[cSante.aspect.value]*cSante.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.sante.bonus,
                mode: 2,
                priority: null,
                value: cSante.value
              });
            }
          }

          if(cArmure.has) {
            if(cArmure.aspect.lie) {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: aspects[cArmure.aspect.value]*cArmure.aspect.multiplie
              });
            } else {
              effects.capacites.push({
                key: path.armure.bonus,
                mode: 2,
                priority: null,
                value: cArmure.value
              });
            }
          }

          if(aspectMax.has) {
            const aMax = aspectMax.aspect;
            aspectsMax[aMax].max.push(aspectMax.maximum.aspect);
            aspectsMax[aMax].ae.mineur.push(aspectMax.maximum.ae);
            aspectsMax[aMax].ae.majeur.push(aspectMax.maximum.ae);
          }

          if(attaque.has) {
            const capaciteWpn = {
              _id:i._id,
              name:i.name,
              type:'capacite',
              system:{
                noRack:true,
                type:attaque.type,
                portee:attaque.portee,
                degats:attaque.degats,
                effets:{
                  raw:attaque.effets.raw,
                  custom:attaque.effets.custom,
                }
              }
            }

            if(attaque.type === 'contact') {
              armesContact.push(capaciteWpn);
            } else if(attaque.type === 'distance') {
              armesDistance.push(capaciteWpn);
            }
          }
        }

        if(data.degats.has) {
          const labels = CONFIG.KNIGHT.effets;

          data.degats.system.effets.liste = listEffects(data.degats.system.effets.raw, data.degats.system.effets.custom, labels);
        }
      }
    }

    for (let i of capacites) {
      const system = i.system;

      if((!i.isPhase2) || (i.isPhase2 && system.phase2Activate)) {
        for(let i = 0; i < aspectLieSupp.length; i++) {
          const bonus = system.bonus;
          const cSante = bonus.sante;
          const cArmure = bonus.armure;
          const aspectMax = bonus.aspectMax;

          if(cSante.has && cSante.aspect.lie && cSante.aspect.value !== aspectLieSupp[i]) {
            effects.capacites.push({
              key: path.sante.bonus,
              mode: 2,
              priority: null,
              value: aspects[aspectLieSupp[i]]*cSante.aspect.multiplie
            });
          }

          if(cArmure.has && cArmure.aspect.lie && cArmure.aspect.value !== aspectLieSupp[i]) {
            effects.capacites.push({
              key: path.armure.bonus,
              mode: 2,
              priority: null,
              value: aspects[aspectLieSupp[i]]*cArmure.aspect.multiplie
            });
          }

          if(aspectMax.has && aspectMax.aspect !== aspectLieSupp[i]) {
            aspectsMax[aspectLieSupp[i]].max.push(aspectMax.maximum.aspect);
            aspectsMax[aspectLieSupp[i]].ae.mineur.push(aspectMax.maximum.ae);
            aspectsMax[aspectLieSupp[i]].ae.majeur.push(aspectMax.maximum.ae);
          }
        }
      }
    }

    actorData.capacites = capacites;

    for (let [key, value] of Object.entries(aspectsMax)) {
      effects.capacites.push({
        key: `system.aspects.${key}.max`,
        mode: 5,
        priority: null,
        value: `${Math.max(...value.max)}`
      },
      {
        key: `system.aspects.${key}.ae.majeur.max`,
        mode: 5,
        priority: null,
        value: `${Math.max(...value.ae.majeur)}`
      },
      {
        key: `system.aspects.${key}.ae.mineur.max`,
        mode: 5,
        priority: null,
        value: `${Math.max(...value.ae.mineur)}`
      }
      );
    }

    const listWithEffect = [
      {label:'Capacites', data:effects.capacites},
    ];

    if(sheetData.editable) effectsGestion(this.actor, listWithEffect);
  }

  _prepareAE(context) {
    const actor = context.actor?.aspectexceptionnel || false;
    const listAspects = context.data.system.aspects;
    //const aspects = context.actor?.aspectexceptionnel?.[aspect] || false;

    if(!actor) context.actor.aspectexceptionnel = {};

    let result = {};

    for (let [key, aspect] of Object.entries(listAspects)){
      const aeMineur = +aspect.ae.mineur.value;
      const aeMajeur = +aspect.ae.majeur.value;
      const lMineur = `KNIGHT.ASPECTS.${key.toUpperCase()}.AE.Mineur`;
      const lMajeur = `KNIGHT.ASPECTS.${key.toUpperCase()}.AE.Majeur`;

      if(aeMineur > 0 || aeMajeur > 0) result[key] = {}

      if(aeMineur > 0) {
        result[key].mineur = game.i18n.localize(lMineur);
      }

      if(aeMajeur > 0) {
        result[key].mineur = game.i18n.localize(lMineur);
        result[key].majeur = game.i18n.localize(lMajeur);
      }
    }

    context.actor.aspectexceptionnel = result;
  }

  async _doDebordement(label, dgtsDice) {
    const actor = this.actor;

    //DEGATS
    const labelDgt = `${label} : ${game.i18n.localize('KNIGHT.AUTRE.Debordement')}`;

    const totalDgt = `${dgtsDice}`;

    const execDgt = new game.knight.RollKnight(`${totalDgt}`, actor.system);
    execDgt._success = false;
    execDgt._hasMin = false;

    await execDgt.evaluate();

    const pDegats = {
      flavor:labelDgt,
      main:{
        total:execDgt._total,
        tooltip:await execDgt.getTooltip()
      }
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

  async _doDgts(label, dataWpn, listAllEffets, regularite=0, addNum='') {
    const actor = this.actor;

    //DEGATS
    const tenebricide = false;
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

  async _getAllEffets(dataWpn, tenebricide, obliteration) {
    const actor = this.actor;
    const data = {
      guidage:false,
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

    // Aspects Exceptionnels
    const bete = +getAspectValue('bete', this.actor._id);
    const beteAE = getAEValue('bete', this.actor._id);

    const bAEMajeur = +beteAE.majeur;
    const bAEMineur = +beteAE.majeur;

    if(bAEMineur > 0 && bAEMajeur === 0) {
      lDgtsOtherInclude.push({
        name:`+${bAEMineur} ${game.i18n.localize('KNIGHT.JETS.BETE.Mineur')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });

      getDgtsOtherFixeMod += bAEMineur;
    } else if(bAEMajeur > 0) {
      lDgtsOtherInclude.push({
        name:`+${bAEMineur+bAEMajeur+bete} ${game.i18n.localize('KNIGHT.JETS.BETE.Majeur')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });

      getDgtsOtherFixeMod += bAEMineur+bAEMajeur+bete;
    }

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

  /** @inheritdoc */
  _onDragStart(event) {
    const li = event.currentTarget;
    if ( event.target.classList.contains("content-link") ) return;

    // Create drag data
    let dragData;

    // Owned Items
    if ( li.dataset.itemId ) {
      const item = this.actor.items.get(li.dataset.itemId);
      dragData = item.toDragData();
    }

    // Active Effect
    if ( li.dataset.effectId ) {
      const effect = this.actor.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    }

    dragData = dragMacro(dragData, li, this.actor);

    if ( !dragData ) return;

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }
}
