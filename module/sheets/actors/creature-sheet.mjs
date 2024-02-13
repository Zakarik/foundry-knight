import {
  getEffets,
  getAspectValue,
  getAEValue,
  listEffects,
  SortByName,
  addOrUpdateEffect,
  updateEffect,
  existEffect,
  confirmationDialog,
  effectsGestion,
  getDefaultImg,
  diceHover,
  options,
  getFlatEffectBonus,
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
export class CreatureSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["creature", "sheet", "actor"],
      template: "systems/knight/templates/actors/creature-sheet.html",
      width: 900,
      height: 790,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".body", initial: "description"}],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    const options = context.data.system.options;
    const noFirstMenu = !options.resilience && !options.sante ? true : false;
    const noSecondMenu = !options.armure && !options.energie && !options.bouclier ? true : false;

    options.noFirstMenu = noFirstMenu;
    options.noSecondMenu = noSecondMenu;

    this._prepareCharacterItems(context);
    this._prepareAE(context);

    context.systemData = context.data.system;

    actualiseRoll(this.actor);

    console.warn(context);

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
    hideShowLimited(this.actor, html);

    html.find('div.combat div.armesContact img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.main").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.wpn").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.wpn").position().left > width) {
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

    html.find('div.combat div.armesDistance img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.main").width() / 2;
      const isW50 = $(ev.currentTarget).parents("div.wpn").width();
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(isW50 <= width) {
        if($(ev.currentTarget).parents("div.wpn").position().left > width) {
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

    html.find('div.combat div.armesContact select.wpnMainChange').change(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const value = target.val();

      this.actor.items.get(id).update({['system.options2mains.actuel']:value});
    });

    html.find('div.combat button.addbasechair').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const value = target?.data("value") || false;
      let result = true;

      if(value) result = false;

      this.actor.items.get(id).update({['system.degats.addchair']:result});
    });

    html.find('div.combat div.armesDistance select.wpnMunitionChange').change(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");
      const value = target.val();

      this.actor.items.get(id).update({['system.optionsmunitions.actuel']:value});
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

    html.find('div.nods img.dice').click(async ev => {
      const data = this.getData();
      const target = $(ev.currentTarget);
      const nbre = +target.data("number");
      const nods = target.data("nods");

      if(nbre > 0) {
        const recuperation = data.data.system.combat.nods[nods].recuperationBonus;
        const bonus = recuperation.length > 0 ? recuperation.join(' + ') : ` 0`;

        const rNods = new game.knight.RollKnight(`3D6+${bonus}`, this.actor.system);
        rNods._flavor = game.i18n.localize(`KNIGHT.JETS.Nods${nods}`);
        rNods._success = false;
        await rNods.toMessage({
          speaker: {
          actor: this.actor?.id || null,
          token: this.actor?.token?.id || null,
          alias: this.actor?.name || null,
          }
        });

        let base = 0;
        let max = 0;
        let type = '';

        switch(nods) {
          case 'soin':
            type = 'sante';
            base = data.data.system.sante.value;
            max = data.data.system.sante.max;

            break;

          case 'energie':
            type = 'energie';
            base = data.data.system.energie.value;
            max = data.data.system.energie.max;
            break;

          case 'armure':
            type = 'armure'
            base = data.data.system.armure.value;
            max = data.data.system.armure.max;
            break;
        }

        const total = rNods.total;
        const final = base+total > max ? max : base+total;

        const update = {
          'system':{
            'combat':{
              'nods':{
                [nods]:{
                  'value':nbre - 1
                }
              }
            },
            [type]:{
              'value':final
            }
          }
        };

        this.actor.update(update);
      }
    });

    html.find('.roll').click(ev => {
      const target = $(ev.currentTarget);
      const label = target.data("label") || '';
      const aspect = target.data("aspect") || '';
      const reussites = +target.data("reussitebonus") || 0;

      dialogRoll(label, this.actor, {base:aspect, succesBonus:reussites});
    });

    html.find('.jetWpn').click(ev => {
      const target = $(ev.currentTarget);
      const name = target.data("name");
      const id = target.data("id");
      const isDistance = target.data("isdistance");
      const num = target.data("num");
      const aspect = target?.data("aspect") || [];

      let label;

      switch(isDistance) {
        case 'grenades':
          label = `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;
          break;

        case 'armesimprovisees':
          label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
          break;

        default:
          label = name;
          break;
      }

      dialogRoll(label, this.actor, {base:aspect, isWpn:true, idWpn:id, nameWpn:name, typeWpn:isDistance, num:num});
    });

    html.find('.setResilience').click(async ev => {
      const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
        what:`${game.i18n.localize("KNIGHT.RESILIENCE.TYPES.Label")} ?`,
        select:{
          has:true,
          liste:{
            colosseRecrue:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Recrue"),
            colosseInitie:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Initie"),
            colosseHeros:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.COLOSSE.Heros"),
            patronRecrue:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Recrue"),
            patronInitie:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Initie"),
            patronHeros:game.i18n.localize("KNIGHT.RESILIENCE.TYPES.PATRON.Heros"),
          }
        }
      });
      const askDialogOptions = {classes: ["dialog", "knight", "askdialog"]};

      await new Dialog({
        title: game.i18n.localize('KNIGHT.RESILIENCE.CalculResilience'),
        content: askContent,
        buttons: {
          button1: {
            label: game.i18n.localize('KNIGHT.RESILIENCE.Calcul'),
            callback: async (data) => {
              const getData = this.getData().data.system;
              const dataSante = +getData.sante.max;
              const dataArmure = +getData.armure.max;
              const hasSante = getData.options.sante;
              const hasArmure = getData.options.armure;

              const selected = data.find('.whatSelect').val();

              const update = {
                system:{
                  resilience:{
                    max:0,
                    value:0
                  }
                }
              };

              let calcul = 0;

              switch(selected) {
                case 'colosseRecrue':
                  if(hasSante) calcul = Math.floor(dataSante/10);
                  else if(hasArmure) calcul = Math.floor(dataArmure/10);
                  break

                case 'colosseInitie':
                  if(hasSante) calcul = Math.floor(dataSante/10)*2;
                  else if(hasArmure) calcul = Math.floor(dataArmure/10)*2;
                  break

                case 'colosseHeros':
                  if(hasSante) calcul = Math.floor(dataSante/10)*3;
                  else if(hasArmure) calcul = Math.floor(dataArmure/10)*3;
                  break

                case 'patronRecrue':
                  if(hasSante) calcul = Math.floor(dataSante/30);
                  else if(hasArmure) calcul = Math.floor(dataArmure/30);
                  break

                case 'patronInitie':
                  if(hasSante) calcul = Math.floor(dataSante/20);
                  else if(hasArmure) calcul = Math.floor(dataArmure/20);
                  break

                case 'patronHeros':
                  if(hasSante) calcul = Math.floor(dataSante/10);
                  else if(hasArmure) calcul = Math.floor(dataArmure/10);
                  break
              }

              update.system.resilience.max = calcul;
              update.system.resilience.value = calcul;

              this.actor.update(update);

            },
            icon: `<i class="fas fa-check"></i>`
          }
        }
      }, askDialogOptions).render(true);
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

    html.find('div.options button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const option = target.data("option");
      const result = value === true ? false : true;

      this.actor.update({[`system.options.${option}`]:result});
    });
  }

  /* -------------------------------------------- */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    const subtype = header.dataset?.subtype || false;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      img:getDefaultImg(type),
      system: data
    };

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    if(subtype && subtype === 'phase2') itemData.system.isPhase2 = true;

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

    const typesValides = [
      'module', 'armure',
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
    const phase2Activate = system.phase2Activate;

    const armesContact = [];
    const armesDistance = [];
    const armesTourelles = [];
    const langue = [];
    const capacites = [];
    const capacitesPhase2 = [];
    const aspects = {
      "chair":system.aspects.chair.value,
      "bete":system.aspects.bete.value,
      "machine":system.aspects.machine.value,
      "dame":system.aspects.dame.value,
      "masque":system.aspects.masque.value,
    };
    const aspectLieSupp = [];
    const effects = {armes:[], capacites:[]};
    const aspectsMax = {
      chair:{max:[20], ae:{mineur:[10], majeur:[10]}},
      bete:{max:[20], ae:{mineur:[10], majeur:[10]}},
      machine:{max:[20], ae:{mineur:[10], majeur:[10]}},
      dame:{max:[20], ae:{mineur:[10], majeur:[10]}},
      masque:{max:[20], ae:{mineur:[10], majeur:[10]}}
    };


    for (let i of sheetData.items) {
      const data = i.system;

      // ARME
      if (i.type === 'arme') {
        const type = data.type;
        const tourelle = data.tourelle;

        data.noRack = true;
        data.pnj = true;

        const optionsMunitions = data?.optionsmunitions?.has || false;
        const options2mains = data?.options2mains?.has || false;
        const raw = data.effets.raw;
        const custom = data.effets.custom;
        const labels = CONFIG.KNIGHT.effets;

        data.effets.liste = listEffects(raw, custom, labels);

        const main = data?.options2mains?.actuel || "";
        const munition = data?.options2mains?.actuel || "";

        if(type === 'contact' && options2mains === true) {
          data.degats.dice = data?.options2mains?.[main]?.degats?.dice || 0;
          data.degats.fixe = data?.options2mains?.[main]?.degats?.fixe || 0;

          data.violence.dice = data?.options2mains?.[main]?.violence?.dice || 0;
          data.violence.fixe = data?.options2mains?.[main]?.violence?.fixe || 0;
        }

        if(type === 'distance' && optionsMunitions === true) {
          data.degats.dice = data.optionsmunitions?.liste?.[munition]?.degats?.dice || 0;
          data.degats.fixe = data.optionsmunitions?.liste?.[munition]?.degats?.fixe || 0

          data.violence.dice = data.optionsmunitions?.liste?.[munition]?.violence?.dice || 0;
          data.violence.fixe = data.optionsmunitions?.liste?.[munition]?.violence?.fixe || 0;
        }

        if(type === 'distance') {
          const rawDistance = data.distance.raw;
          const customDistance = data.distance.custom;
          const labelsDistance = CONFIG.KNIGHT.AMELIORATIONS.distance;
          const effetMunition = data?.optionsmunitions?.liste || {};

          data.distance.liste = listEffects(rawDistance, customDistance, labelsDistance);

          if(optionsMunitions !== false) {
            for (let [kM, munition] of Object.entries(effetMunition)) {
              const bRaw2 = munition.raw || [];
              const bCustom2 = munition.custom || [];

              munition.liste = listEffects(bRaw2, bCustom2, labels);
            }
          }

        } else if(type === 'contact') {
          const rawStructurelles = data.structurelles.raw;
          const customStructurelles = data.structurelles.custom;
          const labelsStructurelles = CONFIG.KNIGHT.AMELIORATIONS.structurelles;

          data.structurelles.liste = listEffects(rawStructurelles, customStructurelles, labelsStructurelles);

          const rawOrnementales = data.ornementales.raw;
          const customOrnementales = data.ornementales.custom;
          const labelsOrnementales = CONFIG.KNIGHT.AMELIORATIONS.ornementales;

          data.ornementales.liste = listEffects(rawOrnementales, customOrnementales, labelsOrnementales);

          if(options2mains) {
            const raw2 = data.effets2mains.raw;
            const custom2 = data.effets2mains.custom;

            data.effets2mains.liste = listEffects(raw2, custom2, labels);
          }
        }

        if(tourelle.has && type === 'distance') {
          armesTourelles.push(i);
        } else {
          if (type === 'contact') { armesContact.push(i); }
          else if (type === 'distance') { armesDistance.push(i); }
        }

        const bonusEffects = getFlatEffectBonus(i);

        effects.armes.push({
          key: path.defense.bonus,
          mode: 2,
          priority: 3,
          value: bonusEffects.defense.bonus
        });

        effects.armes.push({
          key: path.defense.malus,
          mode: 2,
          priority: 3,
          value: bonusEffects.defense.malus
        });

        effects.armes.push({
          key: path.reaction.bonus,
          mode: 2,
          priority: 3,
          value: bonusEffects.reaction.bonus
        });

        effects.armes.push({
          key: path.reaction.malus,
          mode: 2,
          priority: 3,
          value: bonusEffects.reaction.malus
        });
      }

      // CAPACITES
      if (i.type === 'capacite') {
        const isPhase2 = data.isPhase2;

        if(isPhase2) capacitesPhase2.push(i);
        else capacites.push(i);

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
        } else if(isPhase2 && phase2Activate) {
          if(aLieSupp.has) aspectLieSupp.push(aLieSupp.value);

          if(cSante.has) {
            if(cSante.aspect?.lie || false) {
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
            if(cArmure.aspect?.lie || false) {
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

    actorData.armesContact = armesContact;
    actorData.armesDistance = armesDistance;
    actorData.armesTourelles = armesTourelles;
    actorData.langue = langue;
    actorData.capacites = capacites;
    actorData.capacitesPhase2 = capacitesPhase2;

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
      {label:'Armes', data:effects.armes},
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

  _depensePE(depense, autosubstract=true) {
    const getData = this.getData();

    const actuel = +getData.systemData.energie.value;
    const substract = actuel-depense;

    if(substract < 0) {
      return false;
    } else {

      if(autosubstract) {
        let update = {
          system:{
            energie:{
              value:substract
            }
          }
        }

        this.actor.update(update);
      }

      return true;
    }
  }

  async _doDgts(label, dataWpn, listAllEffets, regularite=0, addNum='') {
    const actor = this.actor;

    //DEGATS
    const tenebricide = true;
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
