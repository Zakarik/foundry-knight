/**
 * Edit dialog
 * @extends {Application}
 */
 export class KnightCompanionsDialog extends FormApplication {
    constructor(data, object, options) {
        super(options);
        this.data = data;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          template: `systems/knight/templates/dialog/companions-sheet.html`,
        classes: ["dialog", "knight", "companionsDialog"],
        width: 650,
        height:650,
        jQuery: true
      });
    }

    /** @inheritdoc */
    getData(options) {
      this.options.title = this.data.title;
      let buttons = Object.keys(this.data.buttons).reduce((obj, key) => {
        let b = this.data.buttons[key];
        b.cssClass = [key, this.data.default === key ? "default" : ""].filterJoin(" ");
        if ( b.condition !== false ) obj[key] = b;
        return obj;
      }, {});
      return {
        content: this.data.content,
        buttons: buttons
      }
    }

    /** @inheritdoc */
  activateListeners(html) {
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

    html.find("div.lion div.block input.aspect").change(ev => {
      const maxAspect = +this.data.content.data.lion.aspects.value;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const actInput = +dataTarget.val();
      let totalAspect = 0;

      for (let i of html.find("div.lion input.aspect")) {
        const target = +$(i).val();
        totalAspect += target;
      }

      if(totalAspect > maxAspect) {
        $(ev.currentTarget).val(actInput-1);
      } else {
        this.data.content.data.aspects.lion[type].value = actInput;
        $(html.find("div.lion input.aspectDistribuer")).val(maxAspect-totalAspect);
        this.data.content.data.lion.aspects.restant = maxAspect-totalAspect;
      }
    });

    html.find("div.lion div.block input.ae").change(ev => {
      const maxAspect = +this.data.content.data.lion.ae;
      const dataTarget = $(ev.currentTarget);
      const type = dataTarget.data("type");
      const actInput = +dataTarget.val();
      let totalAspect = 0;

      for (let i of html.find("div.lion input.ae")) {
        const target = +$(i).val();
        totalAspect += target;
      }

      if(totalAspect > maxAspect) {
        $(ev.currentTarget).val(actInput-1);
      } else {
        this.data.content.data.aspects.lion[type].ae = actInput;
        $(html.find("div.lion input.aeDistribuer")).val(maxAspect-totalAspect);
        this.data.content.data.lion.restant = maxAspect-totalAspect;
      }
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
  }

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param {MouseEvent} event    The left-mouse click event
   * @private
   */
   _onClickButton(event) {
    const id = event.currentTarget.dataset.button;
    const button = this.data.buttons[id];
    this.submit(button);
  }

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param {Object} button     The configuration of the chosen button
   * @private
   */
   submit(button) {
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
        const actor = game.actors.get(this.data.actor);
        const armor = actor.items.get(actor.system.equipements.armure.id);
        const companionsEvolutions = armor.system.evolutions.special.companions;
        const evolutionsValue = +companionsEvolutions.value;
        const evolutionsAppliedV = +companionsEvolutions?.applied?.value || 0;
        const evolutionsAppliedL = companionsEvolutions?.applied?.liste || [];
        const gloireListe = actor.system.progression.gloire.depense.liste;
        const gloireMax = gloireListe.length === 0 ? 0 : Math.max(...gloireListe.map(o => o.order));

        let update = {
          system:{
            capacites:{
              selected:{
                companions:{
                  energie:{},
                  lion:{
                    aspects:{}
                  },
                  wolf:{
                    aspects:{},
                    configurations:{
                      labor:{
                        bonus:{}
                      },
                      medic:{
                        bonus:{}
                      },
                      tech:{
                        bonus:{}
                      },
                      fighter:{
                        bonus:{}
                      },
                      recon:{
                        bonus:{}
                      }
                    }
                  },
                  crow:{
                    aspects:{},
                    cohesion:{},
                    debordement:{},
                    champDeForce:{}
                  }
                }
              }
            },
            evolutions:{
              special:{
                companions:{
                  applied:{}
                }
              }
            }
          }
        }

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

            update.system.capacites.selected.companions.lion.aspects[key] = {};

            if(dataDialogValue > 0) {
              update.system.capacites.selected.companions.lion.aspects[key].value = +aspect.value + dataDialogValue;
            }

            if(dataDialogAe > 0) {
              update.system.capacites.selected.companions.lion.aspects[key].ae = +aspect.ae + dataDialogAe;
            }
          }

          update.system.capacites.selected.companions.lion.PG = oldPGLion+evoPGLion;
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

            update.system.capacites.selected.companions.wolf.aspects[key] = {};

            if(dataDialogValue > 0) {
              update.system.capacites.selected.companions.wolf.aspects[key].value = +aspect.value + dataDialogValue;
            }

            if(dataDialogAe > 0) {
              update.system.capacites.selected.companions.wolf.aspects[key].ae = +aspect.ae + dataDialogAe;
            }
          }

          for (let [key, configuration] of Object.entries(dataWConfigurations)) {
            const dataDialogValue = +configuration.value;
            const dataArmorNiveau = +armorWConfigurations[key].niveau;
            const dataArmorValue = +armorWConfigurations[key].bonus.roll;
            
            if(dataDialogValue > 0) {
              update.system.capacites.selected.companions.wolf.configurations[key].niveau = dataArmorNiveau + dataDialogValue;
              update.system.capacites.selected.companions.wolf.configurations[key].bonus.roll = dataArmorValue + dataDialogValue;
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

            update.system.capacites.selected.companions.crow.aspects[key] = {};

            if(dataDialogValue > 0) {
              update.system.capacites.selected.companions.crow.aspects[key].value = +aspect.value + dataDialogValue;
            }
          }

          update.system.capacites.selected.companions.crow.cohesion.base = +armorCrow.cohesion.base + +evoCrow.cohesion;
          update.system.capacites.selected.companions.crow.debordement.base = +armorCrow.debordement.base + +evoCrow.debordement;
          update.system.capacites.selected.companions.crow.champDeForce.base = +armorCrow.champDeForce.base + +evoCrow.cdf;
        }

        update.system.capacites.selected.companions.activation = companionsEvolutions.evolutions.activation;
        update.system.capacites.selected.companions.duree = companionsEvolutions.evolutions.duree;
        update.system.capacites.selected.companions.energie.base = companionsEvolutions.evolutions.energie.base;
        update.system.capacites.selected.companions.energie.prolonger = companionsEvolutions.evolutions.energie.prolonger;

        evoListe.push({
          addOrder:gloireMax+1,
          isArmure:true,
          value:(evolutionsAppliedV+1)*evolutionsValue
        });

        update.system.evolutions.special.companions.applied.value = evolutionsAppliedV + 1;
        update.system.evolutions.special.companions.applied.liste = evolutionsAppliedL.concat(evoListe);

        armor.update(update);

        this.close();
      }      
    } catch(err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }

  /** @inheritdoc */
  async close(options) {
    if ( this.data.close ) this.data.close(this.options.jQuery ? this.element : this.element[0]);
    $(document).off('keydown.chooseDefault');
    return super.close(options);
  }

  async _updateObject(event, formData) {
    this.data = this.data;
  }
}