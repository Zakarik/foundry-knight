import {
  getArmor,
} from "../../helpers/common.mjs";
import KnightCompanionData from "../models/companion-evolutions-model.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Edit dialog
 * @extends {ApplicationV2}
 */

export default class KnightCompanionDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(data={}, options={}) {
    super(options);
    console.error(data);
    this.document = {
      id:`${data.uuid}-0`,
    };

    this.system = new KnightCompanionData(data);
  }

  static DEFAULT_OPTIONS = {
    position: { width: 900, height: 500 },
    window: { resizable: true },
    classes: ["dialog", "knight", "companionsDialog"],
    tag: "form",
    width: 650,
    height:650,
    form: {
        submitOnChange: true,
        handler: KnightCompanionDialog.#onSubmit,
    },
    actions: {}
  };

  static PARTS = {
    header: {
        template: "systems/knight/templates/dialog/parts/companions/header.hbs"
    },
    lion: {
        template: "systems/knight/templates/dialog/parts/companions/lion.hbs"
    },
    wolf: {
        template: "systems/knight/templates/dialog/parts/companions/wolf.hbs"
    },
    crow: {
        template: "systems/knight/templates/dialog/parts/companions/crow.hbs"
    },
    btn: {
        template: "systems/knight/templates/dialog/parts/companions/btn.hbs"
    },
  };

  /*static async #onSwap(event, target) {
    event.preventDefault();
    const tgt = target.dataset;
    const type = tgt.type;

    this.render();
  }*/

  #prepareBtn() {
    const btn = [];

    btn.push({
      action:'submit',
      icon:'fas fa-check',
      label:'KNIGHT.AUTRE.Valider',
    },{
      action:'cancel',
      icon:'fas fa-times',
      label:'KNIGHT.AUTRE.Annuler',
    })

    return btn;
  }

  #prepareMenu() {
    const menu = [];

    menu.push({
      action:'swap',
      type:'lion',
      label:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.LION.Label',
      class:`${this.system.active === 'lion' ? 'selected' : 'unselected'}`,
    },{
      action:'swap',
      type:'wolf',
      label:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.Label',
      class:`${this.system.active === 'wolf' ? 'selected' : 'unselected'}`,
    },{
      action:'swap',
      type:'crow',
      label:'KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.CROW.Label',
      class:`${this.system.active === 'crow' ? 'selected' : 'unselected'}`,
    });

    return menu;
  }

  #addContext() {
    const btn = this.#prepareBtn();
    const menu = this.#prepareMenu();

    return {
      btn,
      menu,
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const addContext = this.#addContext();
    const system = this.system;
    const fields = system.schema.fields;

    return {
      ...context,
      ...addContext,
      document:this.document,
      system,
      fields,
    };
  }

  static async #onSubmit(event, form, formData, options={}) {
    await this.system.update(formData.object);

    //this.render({ parts: ['custom'] });
  }

    /** @inheritdoc */
  /*activateListeners(html) {
    html.find(".button1").click(this._onClickButton.bind(this));
    html.find(".button2").click(this.close.bind(this));
    html.find(".button").click(ev => {
      const target = $(ev.currentTarget);
      const companion = target.data("companion");
      const type = target.data("type");

      switch(type) {
        case 'selected':
          const howMany = +this.data.content.data.adistribuer;
          const numSelected = +this.data.content.selected?.alreadySelected || 0;
          const already = numSelected === howMany ? true : false;
          const oldData = this.data.content.selected[companion];
          const result = oldData === true ? false : true;

          if(already && result) return;
          else {
            this.data.content.selected[companion] = result;
            this.data.content.selected.alreadySelected = result === false ? numSelected-1 : numSelected+1;
          }
          break;
      }
      this.render(true);
    });

    html.find(".button1").hover(ev => {

    });

    html.find("div.lion div.block input.aspect").change(async ev => {
      const maxAspect = +this.data.content.data.lion.aspects.value;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const maxRepartitionAspectCompanions = parseInt(this.data.content.data.lion.aspects.max);
      let actInput = +dataTarget.val();
      let totalAspect = 0;

      if(actInput > maxRepartitionAspectCompanions) {
        $(ev.currentTarget).val(maxRepartitionAspectCompanions);
        actInput = maxRepartitionAspectCompanions;
      }

      for (let i of html.find("div.lion input.aspect")) {
        const target = +$(i).val();
        const tType = $(i).data("type");
        totalAspect += tType === type ? actInput : target;
      }

      if(totalAspect > maxAspect) {
        const adjustAspect = totalAspect - maxAspect;
        $(ev.currentTarget).val(adjustAspect);
        actInput = adjustAspect;
        totalAspect -= adjustAspect;
      }

      this.data.content.data.aspects.lion[type].value = actInput;
      $(html.find("div.lion input.aspectDistribuer")).val(maxAspect-totalAspect);
      this.data.content.data.lion.aspects.restant = maxAspect-totalAspect;
    });

    html.find("div.lion div.block input.ae").change(ev => {
      const maxAspect = +this.data.content.data.lion.ae;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      let actInput = +dataTarget.val();
      let totalAspect = 0;

      for (let i of html.find("div.lion input.ae")) {
        const target = +$(i).val();
        const tType = $(i).data("type");

        if(tType !== type) totalAspect += target;
      }

      // Si le nouveau total dépasserait maxAspect
      if((totalAspect + actInput) > maxAspect) {
        // Ajuster la valeur de l'input actuel
        const valeurAjustee = maxAspect - totalAspect;
        $(ev.currentTarget).val(valeurAjustee);
        totalAspect += valeurAjustee;
        actInput = valeurAjustee;
      } else totalAspect += actInput;

      this.data.content.data.aspects.lion[type].ae = actInput;
      $(html.find("div.lion input.aeDistribuer")).val(maxAspect-totalAspect);
      this.data.content.data.lion.restant = maxAspect-totalAspect;
    });

    html.find("div.wolf div.block input.aspect").change(ev => {
      const maxAspect = +this.data.content.data.wolf.aspects.value;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const actInput = +dataTarget.val();
      let totalAspect = 0;

      for (let i of html.find("div.wolf input.aspect")) {
        const target = +$(i).val();
        totalAspect += target;
      }

      if(totalAspect > maxAspect) {
        $(ev.currentTarget).val(actInput-1);
      } else {
        this.data.content.data.aspects.wolf[type].value = actInput;
        $(html.find("div.wolf input.aspectDistribuer")).val(maxAspect-totalAspect);
        this.data.content.data.wolf.aspects.restant = maxAspect-totalAspect;
      }
    });

    html.find("div.wolf div.block input.ae").change(ev => {
      const maxAspect = +this.data.content.data.wolf.ae;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const actInput = +dataTarget.val();
      let totalAspect = 0;

      for (let i of html.find("div.wolf input.ae")) {
        const target = +$(i).val();
        totalAspect += target;
      }

      if(totalAspect > maxAspect) {
        $(ev.currentTarget).val(actInput-1);
      } else {
        this.data.content.data.aspects.wolf[type].ae = actInput;
        $(html.find("div.wolf input.aeDistribuer")).val(maxAspect-totalAspect);
        this.data.content.data.wolf.restant = maxAspect-totalAspect;
      }
    });

    html.find("div.wolf input.bonusWolf").change(ev => {
      const maxBonus = +this.data.content.data.wolf.bonus;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const actInput = +dataTarget.val();
      let totalBonus = 0;

      for (let i of html.find("div.wolf input.bonusWolf")) {
        const target = +$(i).val();
        totalBonus += target;
      }

      if(totalBonus > maxBonus) {
        $(ev.currentTarget).val(actInput-1);
      } else {
        this.data.content.data.configurations[type].value = actInput;
        $(html.find("div.wolf input.bonusDistribuer")).val(maxBonus-totalBonus);
        this.data.content.data.wolf.bonusRestant = maxBonus-totalBonus;
      }
    });

    html.find("div.crow div.block input.aspect").change(ev => {
      const maxAspect = +this.data.content.data.crow.aspects.value;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const actInput = +dataTarget.val();
      let totalAspect = 0;

      for (let i of html.find("div.crow input.aspect")) {
        const target = +$(i).val();
        totalAspect += target;
      }

      if(totalAspect > maxAspect) {
        $(ev.currentTarget).val(actInput-1);
      } else {
        this.data.content.data.aspects.crow[type].value = actInput;
        $(html.find("div.crow input.aspectDistribuer")).val(maxAspect-totalAspect);
        this.data.content.data.crow.aspects.restant = maxAspect-totalAspect;
      }
    });
  }*/

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param {MouseEvent} event    The left-mouse click event
   * @private
   */
   /*_onClickButton(event) {
    event.preventDefault();
    const id = event.currentTarget.dataset.button;
    const button = this.data.buttons[id];
    this.submit(button);
  }*/

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param {Object} button     The configuration of the chosen button
   * @private
   */
  /*async submit(button) {
    try {

      if (button.callback) button.callback(this.options.jQuery ? this.element : this.element[0]);

      const isLion = this.data.content.selected.lion;
      const isWolf = this.data.content.selected.wolf;
      const isCrow = this.data.content.selected.crow;

      let resultL = true;
      let resultW = true;
      let resultC = true;

      if(isLion) {
        const aspectL = +this.data.content.data.lion.aspects.restant;
        const aeL = +this.data.content.data.lion.restant;

        if(aspectL === 0 && aeL === 0) resultL = true;
        else resultL = false;
      }

      if(isWolf) {
        const aspectW = +this.data.content.data.wolf.aspects.restant;
        const aeW = +this.data.content.data.wolf.restant;
        const bonusW = +this.data.content.data.wolf.bonusRestant;

        if(aspectW === 0 && aeW === 0 && bonusW === 0) resultW = true;
        else resultW = false;
      }

      if(isCrow) {
        const aspectC = +this.data.content.data.crow.aspects.restant;

        if(aspectC === 0) resultC = true;
        else resultC = false;
      }

      if(!resultL || !resultW || !resultC) {
        this.render(true);
      }
      else {
        const getHighestOrder = (myObject) => {
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

        const actor = game.actors.get(this.data.actor);
        const armor = await getArmor(actor);
        const companionsEvolutions = armor.system.evolutions.special.companions;
        const evolutionsValue = +companionsEvolutions.value;
        const evolutionsAppliedV = +companionsEvolutions?.applied?.value || 0;
        const evolutionsAppliedL = companionsEvolutions?.applied?.liste || [];
        const gloireListe = actor.system.progression.gloire.depense.liste;
        const isEmpty = gloireListe[0]?.isEmpty ?? false;
        const gloireMax = Object.keys(gloireListe).length === 0 || isEmpty ? 0 : getHighestOrder(gloireListe);

        const update = {};
        const evoListe = [];

        if(isLion) {
          const dataLAspects = this.data.content.data.aspects.lion;
          const evoLion = companionsEvolutions.evolutions.lion;
          const armorLion = armor.system.capacites.selected.companions.lion;
          const armorLAspects = armorLion.aspects;
          const oldPGLion = +armorLion.PG;
          const evoPGLion = +evoLion.pg;

          for (let [key, aspect] of Object.entries(armorLAspects)) {
            const dataDialogValue = +dataLAspects[key].value;
            const dataDialogAe = +dataLAspects[key].ae;

            if(dataDialogValue > 0) {
              update[`system.capacites.selected.companions.lion.aspects.${key}.value`] = Number(aspect.value)+dataDialogValue;
            }

            if(dataDialogAe > 0) {
              update[`system.capacites.selected.companions.lion.aspects.${key}.ae`] = Number(aspect.ae)+dataDialogAe;
            }
          }

          update[`system.capacites.selected.companions.lion.PG`] = oldPGLion+evoPGLion;
        }

        if(isWolf) {
          const dataWAspects = this.data.content.data.aspects.wolf;
          const dataWConfigurations = this.data.content.data.configurations;
          const armorWolf = armor.system.capacites.selected.companions.wolf;
          const armorWAspects = armorWolf.aspects;
          const armorWConfigurations = armorWolf.configurations;

          for (let [key, aspect] of Object.entries(armorWAspects)) {
            const dataDialogValue = +dataWAspects[key].value;
            const dataDialogAe = +dataWAspects[key].ae;

            if(dataDialogValue > 0) {
              update[`system.capacites.selected.companions.wolf.aspects.${key}.value`] = Number(aspect.value)+dataDialogValue;
            }

            if(dataDialogAe > 0) {
              update[`system.capacites.selected.companions.wolf.aspects.${key}.ae`] = Number(aspect.ae)+dataDialogAe;
            }
          }

          for (let [key, configuration] of Object.entries(dataWConfigurations)) {
            const dataDialogValue = +configuration.value;
            const dataArmorNiveau = +armorWConfigurations[key].niveau;
            const dataArmorValue = +armorWConfigurations[key].bonus.roll;

            if(dataDialogValue > 0) {
              update[`system.capacites.selected.companions.wolf.configurations.${key}.niveau`] = dataArmorNiveau + dataDialogValue;
              update[`system.capacites.selected.companions.wolf.configurations.${key}.bonus.roll`] = dataArmorValue + dataDialogValue;
            }
          }
        }

        if(isCrow) {
          const dataLAspects = this.data.content.data.aspects.crow;
          const evoCrow = companionsEvolutions.evolutions.crow;
          const armorCrow = armor.system.capacites.selected.companions.crow;
          const armorCAspects = armorCrow.aspects;

          for (let [key, aspect] of Object.entries(armorCAspects)) {
            const dataDialogValue = +dataLAspects[key].value;

            if(dataDialogValue > 0) {
              update[`system.capacites.selected.companions.crow.aspects.${key}.value`] = Number(aspect.value) + dataDialogValue;
            }
          }

          update[`system.capacites.selected.companions.crow.cohesion.base`] = Number(armorCrow.cohesion.base) + Number(evoCrow.cohesion);
          update[`system.capacites.selected.companions.crow.debordement.base`] = Number(armorCrow.debordement.base) + Number(evoCrow.debordement);
          update[`system.capacites.selected.companions.crow.champDeForce.base`] = Number(armorCrow.champDeForce.base) + Number(evoCrow.cdf);
        }

        update[`system.capacites.selected.companions.activation`] = companionsEvolutions.evolutions.activation;
        update[`system.capacites.selected.companions.duree`] = companionsEvolutions.evolutions.duree;
        update[`system.capacites.selected.companions.energie.base`] = companionsEvolutions.evolutions.energie.base;
        update[`system.capacites.selected.companions.energie.prolonger`] = companionsEvolutions.evolutions.energie.prolonger;

        evoListe.push({
          addOrder:gloireMax+1,
          isArmure:true,
          value:(evolutionsAppliedV+1)*evolutionsValue
        });

        update[`system.evolutions.special.companions.applied.value`] = evolutionsAppliedV + 1;
        update[`system.evolutions.special.companions.applied.liste`] = evolutionsAppliedL.concat(evoListe);
        const id = this.data.content.data.evo;
        const { archivage, ...dataToSave } = armor.system;
        const LZString = globalThis.LZString;
        update[`system.archivage.liste.${id}`] = LZString.compressToUTF16(JSON.stringify(dataToSave));

        armor.update(update);

        this.close();
      }
    } catch(err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }*/

  /** @inheritdoc */
  /*async close(options) {
    if ( this.data.close ) this.data.close(this.options.jQuery ? this.element : this.element[0]);
    $(document).off('keydown.chooseDefault');
    return super.close(options);
  }*/

  /*async _updateObject(event, formData) {
    this.data = this.data;
  }*/
}