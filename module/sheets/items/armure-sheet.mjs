import { SortByLabel } from "../../helpers/common.mjs";
import { listEffects } from "../../helpers/common.mjs";
import toggler from '../../helpers/toggler.js';
/**
 * @extends {ItemSheet}
 */
export class ArmureSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "item", "armure"],
      template: "systems/knight/templates/items/armure-sheet.html",
      width: 700,
      height: 1000,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    //EGIDE
    const dataJauges = context.data.system.jauges;
    const hasEgide = game.settings.get("knight", "acces-egide");

    if(hasEgide) {
        dataJauges.egide = true;
    } else {
        dataJauges.egide = false;
    }

    const evolutions = context.data.system.evolutions.liste;

    const lAspect = context.data.system.overdrives;
    const sGhost = context.data.system.capacites.selected?.ghost?.bonus || false;
    const sRage = context.data.system.capacites.selected?.rage || false;
    const sImpregnation = context.data.system.special.selected?.impregnation || false;
    const sContrecoups = context.data.system.special.selected?.contrecoups || false;

    if(sGhost != false) { sGhost.aspects = lAspect; }
    if(sRage != false) { sRage.aspects = lAspect; }
    if(sImpregnation != false) { sImpregnation.aspects = lAspect; }
    if(sContrecoups != false) { sContrecoups.jet.aspects = lAspect; }

    for (let [key, evolution] of Object.entries(evolutions)) {
      const sGhost = evolution.capacites?.ghost || false;
      const sRage = evolution.capacites?.rage || false;
      const sImpregnation = evolution.special?.impregnation || false;
      const sContrecoups = evolution.special?.contrecoups || false;
      const bGhost = context.data.system.capacites.selected?.ghost?.bonus?.aspects || false;
      const bRage = context.data.system.capacites.selected?.rage?.aspects || false;
      const bImpregnation = context.data.system.special.selected?.impregnation?.aspects || false;
      const bContrecoups = context.data.system.special.selected?.contrecoups?.jet?.aspects || false;

      if(sGhost != false && bGhost != false) {
        sGhost.bonus.aspects = bGhost;
      }

      if(sRage != false && bRage != false) {
        sRage.aspects = bRage;
      }

      if(sImpregnation != false && bImpregnation != false) {
        sImpregnation.aspects = bImpregnation;
      }

      if(sContrecoups != false && bContrecoups != false) {
        sContrecoups.jet.aspects = bContrecoups;
      }
    }

    this._prepareEvolutionsTranslation(context);
    this._prepareCapacitesTranslation(context);
    this._prepareSpecialTranslation(context);

    this._createCapaciteList(context);
    this._createSpecialList(context);
    this._jaugeCheck(context);
    this._prepareAscensionSelectedTranslation(context);

    context.systemData = context.data.system;

    console.warn(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    toggler.init(this.id, html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    html.find('.buttonJauge').click(ev => {
      const value = $(ev.currentTarget).data("value");
      const type = $(ev.currentTarget).data("type");
      let update = {};
      let result = false;

      if(!value) { result = true; }

      update[`system.jauges.${type}`] = result;

      this.item.update(update);
    });

    html.find('.buttonEspoir').click(ev => {
      const value = $(ev.currentTarget).data("value");
      let update = {};
      let result = false;

      if(!value) { result = true; }

      update['system.espoir.bonus'] = result;

      this.item.update(update);
    });

    html.find('.buttonREnergie').click(ev => {
      const value = $(ev.currentTarget).data("value");

      let update = {};
      let result = false;
      let energie = true;

      if(!value) {
        result = true;
        energie = false;
      }

      update[`system.jauges.energie`] = energie;
      update[`system.espoir.remplaceEnergie`] = result;

      this.item.update(update);
    });

    html.find('.sheet-header div.armure input').change(ev => {
      const max = +$(ev.currentTarget).val();
      const actor = this?.actor || false;
      const value = actor !== false ? +actor.system.armure.value : 0;

      if(actor && value > max) {
        this.item.update({[`system.armure.value`]:max});
        actor.update({[`system.armure.value`]:max});
      }
    });

    html.find('.sarcophage input.paliers').change(ev => {
      const value = $(ev.currentTarget).val();
      const data = this.getData();
      let base = data.data.system.capacites.c2038Necromancer.sarcophage.bonus.liste;
      let liste = data.data.system.capacites.selected.sarcophage.bonus.liste;
      let textarea = data.data.system.capacites.selected.sarcophage.textarea;
      let update = {};

      for(let i = 0;i < value;i++) {
        if(liste[`b${i}`] === undefined) {
          if(base[`b${i}`] === undefined) {
            if(i != value-1) {
              if(liste[`b${i}`].pg.max === undefined) {
                liste[`b${i-1}`] = {
                  pg:{
                    min:liste[`b${i-1}`].pg.min,
                    max:liste[`b${i-1}`].pg.min+1
                  },
                  offert:liste[`b${i-1}`].offert
                };
              }

              liste[`b${i}`] = {
                pg:{
                  min:liste[`b${i-1}`].pg.max+1,
                  max:liste[`b${i-1}`].pg.max+2
                },
                offert:""
              };
            } else {
              if(liste[`b${i-1}`].pg.max === undefined) {
                liste[`b${i-1}`] = {
                  pg:{
                    min:liste[`b${i-1}`].pg.min,
                    max:liste[`b${i-1}`].pg.min+1
                  },
                  offert:liste[`b${i-1}`].offert
                };
              }

              liste[`b${i}`] = {
                pg:{
                  min:liste[`b${i-1}`].pg.max+1
                },
                offert:""
              };
            }
          } else {
            liste[`b${i}`] = {
              pg:{
                min:base[`b${i}`].pg.min,
                max:base[`b${i}`].pg.max
              },
              offert:base[`b${i}`].offert
            };
          }
        }

        if(textarea[`b${i}`] === undefined) {
          textarea[`b${i}`] = 50;
        }
      }

      update[`system.capacites.selected.sarcophage.bonus.liste`] = liste;
      update[`system.capacites.selected.sarcophage.textarea`] = textarea;

      this.item.update(update);

      for (let [key, palier] of Object.entries(liste)) {
        const num = +key.replace("b","");
        if(num > value-1) {
          if(key === `b${value-1}`) {
            this.item.update({[`system.capacites.selected.sarcophage.bonus.liste.${key}.pg.-=${max}`]:null});
          }

          this.item.update({[`system.capacites.selected.sarcophage.textarea.-=${key}`]:null});
        }
      }
    });

    html.find('.evolutions >div button').click(ev => {
      const carac = $(ev.currentTarget).data("caracteristique") || false;
      const aspect = $(ev.currentTarget).data("aspect");

      const key = $(ev.currentTarget).data("key");
      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const evospecial = $(ev.currentTarget).data("evolutionspecial") || false;
      const aSubtype = $(ev.currentTarget).data("anothersubtype") || false;
      const name = $(ev.currentTarget).data("name");
      const value = $(ev.currentTarget).data("value");
      const isSpecial = $(ev.currentTarget).data("special") || false;
      const isDelete = $(ev.currentTarget).data("delete") || false;
      const listEvo = this.item.system.evolutions.liste;

      let result = false;
      let capOrSpe = "capacites";

      if(isSpecial) {capOrSpe = "special"; }

      if(!value) { result = true; }

      let update = {};

      if(carac) {
        update = {
          system:{
            evolutions:{
              liste:{
                [key]:{
                  [capOrSpe]:{
                    [type]:{
                      aspects:{
                        [aspect]:{
                          caracteristiques:{
                            [name]:{
                              value:result
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else if(!aSubtype && !evospecial) {
        update = {
          system:{
            evolutions:{
              liste:{
                [key]:{
                  [capOrSpe]:{
                    [type]:{
                      [subtype]:{
                        [name]:result
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else if(!aSubtype) {
        update = {
          system:{
            evolutions:{
              special:{
                [key]:{
                  [evospecial]:{
                    [subtype]:{
                      [type]:{
                        [name]:result
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else {
        update = {
          system:{
            evolutions:{
              liste:{
                [key]:{
                  [capOrSpe]:{
                    [type]:{
                      [subtype]:{
                        [aSubtype]:{
                          [name]:result
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
      }

      if(isDelete) {
        for (let [kEvo, evolution] of Object.entries(listEvo)) {
          if(kEvo > key) {
            if(!aSubtype) {
              update.system.evolutions.liste[kEvo] = {};
              update.system.evolutions.liste[kEvo][capOrSpe] = {};
              update.system.evolutions.liste[kEvo][capOrSpe][type] = {};
              update.system.evolutions.liste[kEvo][capOrSpe][type][subtype] = {};
              update.system.evolutions.liste[kEvo][capOrSpe][type][subtype][name] = result;
            } else {
              update.system.evolutions.liste[kEvo] = {};
              update.system.evolutions.liste[kEvo][capOrSpe] = {};
              update.system.evolutions.liste[kEvo][capOrSpe][type] = {};
              update.system.evolutions.liste[kEvo][capOrSpe][type][subtype] = {};
              update.system.evolutions.liste[kEvo][capOrSpe][type][subtype][aSubtype] = {}
              update.system.evolutions.liste[kEvo][capOrSpe][type][subtype][aSubtype][name] = result;
            }
          }
        }
      }

      this.item.update(update);
    });

    html.find('.evolutions label.paliers button').click(ev => {
      const value = +$(ev.currentTarget).data('value');
      const getData = this.getData();
      const capacites = getData.data.system.capacites.selected;
      const special = getData.data.system.special.selected;
      const evolution = getData.data.system.evolutions.liste;
      const length = Object.entries(evolution).length;

      let update = {
        system:{
          evolutions:{
            liste:{}
          }
        }
      };

      if(length > value) {
        for (let [key, evo] of Object.entries(evolution)) {
          if(+key >= value) {
            update.system.evolutions.liste[`-=${key}`] = null;
          }
        }
      } else {
        for(let i = 0; i < value;i++) {
          const isExist = evolution?.[i] || false;

          if(isExist == false) {

            const previous = evolution?.[i-1]?.value+1 || false;
            const prevValue = previous === false ? update.system.evolutions.liste?.[i-1]?.value+1 || 1 : previous;

            update.system.evolutions.liste[i] = {};
            update.system.evolutions.liste[i].value = prevValue;
            update.system.evolutions.liste[i].description = "";
            update.system.evolutions.liste[i].data = {
              armure:0,
              champDeForce:0,
              energie:0,
              espoir:0
            };
            update.system.evolutions.liste[i].capacites = {};
            update.system.evolutions.liste[i].special = {};



            for (let [key, capacite] of Object.entries(capacites)) {
              if(key != "companions") {
                update.system.evolutions.liste[i].capacites[key] = capacite.evolutions;
              }
            }

            for (let [key, spec] of Object.entries(special)) {
              update.system.evolutions.liste[i].special[key] = spec.evolutions;
            }
          }
        }
      }

      this.item.update(update);
    });

    html.find('.evolutions input.palier').change(ev => {
      const getData = this.getData();
      const evolution = getData.data.system.evolutions.liste;
      const target = $(ev.currentTarget);
      const keyAct = +target.data('key');
      const value = +target.val();
      const oldValue = evolution[keyAct].value;

      const length = Object.entries(evolution).length;

      let update = {
        system:{
          evolutions:{
            liste:{}
          }
        }
      };

      let val = 0;

      if(value > oldValue) {
        for (let i = keyAct+1;i < length;i++) {
          if(i !== keyAct) {
            const newValue = Math.max(val, value);
            const actValue = +evolution[i].value;

            if(actValue <= newValue) val = newValue+1;

            if(actValue <= val) {
              update.system.evolutions.liste[i] = {};
              update.system.evolutions.liste[i].value = val;
            }
          }
        }
      }

      if(value < oldValue) {
        for (let i = keyAct-1;i > -1;i--) {
          if(i !== keyAct) {
            const newValue = val > 0 ? Math.min(val, value) : value;
            const actValue = +evolution[i].value;

            if(actValue >= newValue) val = newValue-1;

            if(actValue >= val) {
              update.system.evolutions.liste[i] = {};
              update.system.evolutions.liste[i].value = val;
            }
          }
        }
      }


      this.item.update(update);
    });

    html.find('div.capacites div button').click(ev => {
      const carac = $(ev.currentTarget).data("caracteristique") || false;
      const aspect = $(ev.currentTarget).data("aspect");

      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const asubtype = $(ev.currentTarget).data("anothersubtype");
      const name = $(ev.currentTarget).data("name");
      const value = $(ev.currentTarget).data("value");

      let result = true;

      if(value) { result = false; }

      let update = {};

      if(carac) {
        update = {
          system:{
            capacites:{
              selected:{
                [type]:{
                  aspects:{
                    [aspect]:{
                      caracteristiques:{
                        [name]:{
                          value:result
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else if(asubtype != undefined) {
        update = {
          system:{
            capacites:{
              selected:{
                [type]:{
                  [subtype]:{
                    [asubtype]:{
                      [name]:result
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        update = {
          system:{
            capacites:{
              selected:{
                [type]:{
                  [subtype]:{
                    [name]:result
                  }
                }
              }
            }
          }
        }
      }

      this.item.update(update);
    });

    html.find('div.capacites div.add a').click(async ev => {
      const value = $(ev.currentTarget).data("value");

      if(value === "") return;
      const data = this.getData();
      const type = data.data.system.capacites.liste[value].type;
      const capacites = data.data.system.capacites[type];
      const evolutions = data.data.system.evolutions.liste;
      const evolutionSpecial = data.data.system.evolutions.special;
      let result = capacites[value];
      let rSpecial = result?.special || false;
      const hasSpecial = result?.specialEvolutions || false;
      const alreadySpecial = evolutionSpecial?.[value] || false;

      result.key = value;
      result.softlock = true;

      let update = {
        system:{
          jauges:{},
          capacites:{
            actuel:"",
            selected:{
              [value]:result
            }
          },
          special:{
            selected:{}
          },
          evolutions:{
            liste:{},
            special:{}
          }
        }
      };

      if(hasSpecial != false && alreadySpecial == false && value !== 'longbow') {
        update.system.evolutions.special[value] = {};
        update.system.evolutions.special[value].value = 100;
        update.system.evolutions.special[value].description = "";
        update.system.evolutions.special[value].evolutions = {};
        update.system.evolutions.special[value].evolutions = hasSpecial;
      } else if(hasSpecial != false && alreadySpecial == false && value === 'longbow') {
        update.system.evolutions.special[value] = {};
        update.system.evolutions.special[value] = hasSpecial;
      }

      if(rSpecial !== false) {
        for (let [key, special] of Object.entries(rSpecial)) {
          const oldSpecial = this.getData().data.system.special.selected?.[special] || false;
          const newSpecial = this.getData().data.system.special[key][special];

          if(oldSpecial === false) {
            update.system.special.selected[special] = {};
            update.system.special.selected[special] = newSpecial;
            update.system.special.selected[special].key = special;
            update.system.special.selected[special].softlock = true;

            if(special === "recolteflux") {
              update.system.jauges.flux = true;
            }
          }
        }
      }

      for (let [key, evolution] of Object.entries(evolutions)) {
        if(value != "companions") {
          update.system.evolutions.liste[key] = {};
          update.system.evolutions.liste[key].capacites = {};
          update.system.evolutions.liste[key].special = {};
          update.system.evolutions.liste[key].capacites[value] = result.evolutions;
        }

        for (let [keyS, evolutionS] of Object.entries(update.system.special.selected)) {
          update.system.evolutions.liste[key].special[keyS] = evolutionS.evolutions;
        }
      }

      console.warn(update);

      console.warn(await this.item.update(update));
    });

    html.find('div.capacites a.verrouillage').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const value = $(ev.currentTarget).data("value");

      let result = true;

      if(value) { result = false; }

      const update = {
        system:{
          capacites:{
            selected:{
              [type]:{
                softlock:result
              }
            }
          }
        }
      };

      this.item.update(update);
    });

    html.find('div.capacites a.delete').click(async ev => {
      const type = $(ev.currentTarget).data("type");
      const evolutions = this.getData().data.system.evolutions.liste;

      this.item.update({[`system.capacites.selected.-=${type}`]:null});
      this.item.update({[`system.evolutions.special.-=${type}`]:null});

      for (let [key, evolution] of Object.entries(evolutions)) {
        this.item.update({[`system.evolutions.liste.${key}.capacites.-=${type}`]:null});
      }

      if(this.actor != null) {
        const update = {
          system:{
            equipements:{
              armure:{
                capacites:{
                  ascension:{},
                  warlord:{
                    modes:{},
                    action:{},
                    guerre:{},
                    force:{},
                    esquive:{}
                  }
                }
              }
            }
          }
        };

        switch(type) {
          case "warlord":
            update.system.equipements.armure.capacites.warlord.modes.action = false;
            update.system.equipements.armure.capacites.warlord.modes.esquive = false;
            update.system.equipements.armure.capacites.warlord.modes.force = false;
            update.system.equipements.armure.capacites.warlord.modes.guerre = false;
            update.system.equipements.armure.capacites.warlord.modes.energie = false;
            update.system.equipements.armure.capacites.warlord.choisi = false;
            update.system.equipements.armure.capacites.warlord.nbre = 0;

            this.actor.update(update);
            break;
          case "ascension":
            const remplaceEnergie = this.actor?.armureData?.system?.espoir?.remplaceEnergie || false;
            const id = this.actor.system.equipements.armure.capacites?.ascension?.id || false;
            const depense = +this.actor.system.equipements.armure.capacites?.ascension?.depense || 0;

            if(id && id != 0) {
              const actor = game.actors.get(id);

              await actor.delete();
            }

            update.system.equipements.armure.capacites.ascension.active = false;
            update.system.equipements.armure.capacites.ascension.id = 0;
            update.system.equipements.armure.capacites.ascension.depense = 0;

            if(remplaceEnergie) {
              update.system.espoir = {};
              update.system.espoir.malus = {armure:this.actor.system.espoir.malus.armure-depense};
            } else {
              this.item.update({[`system.energie.base`]:this.actor.system.energie.max+depense});
            }

            this.actor.update(update);
            break;
        }
      }

    });

    html.find('div.special div button').click(ev => {
      const carac = $(ev.currentTarget).data("caracteristique") || false;
      const aspect = $(ev.currentTarget).data("aspect");

      const type = $(ev.currentTarget).data("type");
      const subtype = $(ev.currentTarget).data("subtype");
      const asubtype = $(ev.currentTarget).data("anothersubtype");
      const name = $(ev.currentTarget).data("name");
      const value = $(ev.currentTarget).data("value");

      let result = true;

      if(value) { result = false; }

      let update = {};

      if(carac) {
        update = {
          system:{
            special:{
              selected:{
                [type]:{
                  aspects:{
                    [aspect]:{
                      caracteristiques:{
                        [name]:{
                          value:result
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else if(asubtype != undefined) {
        update = {
          system:{
            special:{
              selected:{
                [type]:{
                  [subtype]:{
                    [asubtype]:{
                      [name]:result
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        update = {
          system:{
            special:{
              selected:{
                [type]:{
                  [subtype]:{
                    [name]:result
                  }
                }
              }
            }
          }
        }
      }

      this.item.update(update);
    });

    html.find('div.special div.add a').click(ev => {
      const value = $(ev.currentTarget).data("value");

      if(value === "") return;

      const type = this.getData().data.system.special.liste[value].type;
      const special = this.getData().data.system.special[type];
      const evolutions = this.getData().data.system.evolutions.liste;
      let result = special[value];

      result.key = value;
      result.softlock = true;

      let update = {
        system:{
          jauges:{},
          special:{
            selected:{
              [value]:result
            }
          },
          evolutions:{
            liste:{}
          }
        }
      };

      if(value === "recolteflux") {
        update.system.jauges.flux = true;
      }

      for (let [key, evolution] of Object.entries(evolutions)) {
        if(value != "companions") {
          update.system.evolutions.liste[key] = {};
          update.system.evolutions.liste[key].special = {};
          update.system.evolutions.liste[key].special[value] = result.evolutions;
        }
      }

      this.item.update(update);
    });

    html.find('div.special a.verrouillage').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const value = $(ev.currentTarget).data("value");

      let result = true;

      if(value) { result = false; }

      const update = {
        system:{
          special:{
            selected:{
              [type]:{
                softlock:result
              }
            }
          }
        }
      };

      this.item.update(update);
    });

    html.find('div.special a.delete').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const evolutions = this.getData().data.system.evolutions.liste;

      this.item.update({[`system.special.selected.-=${type}`]:null});

      if(type === "recolteflux") {
        this.item.update({[`system.jauges.flux`]:false});
      }

      for (let [key, evolution] of Object.entries(evolutions)) {
        this.item.update({[`system.evolutions.liste.${key}.special.-=${type}`]:null});
      }
    });

    html.find('div.capacites img.info').click(ev => {
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

    html.find('div.special img.info').click(ev => {
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

    html.find('div.evolutions img.info').click(ev => {
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

    html.find('div.effets a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      let path = this.getData().data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, isToken:this.item?.parent?.isToken || false, token:this.item?.parent || null, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:this.getData().data.system.overdrives, title:`${this.object.name} : ${game.i18n.localize("KNIGHT.EFFETS.Edit")}`}).render(true);
    });

    html.find('div.distance a.edit').click(async ev => {
      const stringPath = $(ev.currentTarget).data("path");
      let path = this.getData().data;

      stringPath.split(".").forEach(function(key){
        path = path[key];
      });

      await new game.knight.applications.KnightEffetsDialog({actor:this.actor?._id || null, item:this.item._id, isToken:this.item?.parent?.isToken || false, token:this.item?.parent || null, raw:path.raw, custom:path.custom, toUpdate:stringPath, aspects:this.getData().data.system.overdrives, typeEffets:'distance', title:`${this.object.name} : ${game.i18n.localize("KNIGHT.AMELIORATIONS.LABEL.Distance")}`}).render(true);
    });

    html.find('div.evolutions h4 .far').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square");
      $(ev.currentTarget).toggleClass("fa-minus-square");
      $(ev.currentTarget).parents("h4").siblings().toggle();
    });

    html.find('textarea').blur(async ev => {
      const textarea = $(ev.currentTarget);
      const capacite = textarea.data("capacite");
      const special = textarea.data("special") || false;
      const type = textarea.data("type");
      const min = textarea.data("min");
      const evo = textarea.data("evolution") || false;
      const key = textarea.data("key");

      textarea.height(min);
      const height = ev.currentTarget.scrollHeight+1;

      textarea.height(Math.max(height, min));
      if(evo) {
        if(special === true) {
          this.item.update({[`system.evolutions.special.${capacite}.evolutions.textarea.${type}`]:Math.max(height, min)});
        } else {
          this.item.update({[`system.evolutions.liste.${key}.capacites.${capacite}.textarea.${type}`]:Math.max(height, min)});
        }

      } else {
        this.item.update({[`system.capacites.selected.${capacite}.textarea.${type}`]:Math.max(height, min)});
      }
    });
  }

  //GESTION DES JAUGES
  _jaugeCheck(context) {
    const capacites = context.data.system.capacites.selected;

    for (let [key, capacite] of Object.entries(capacites)) {
        const flux = capacite?.flux?.has || false;

        context.data.system.jauges.flux = flux;
    }
  }

  //GESTION DES LISTES
  _createCapaciteList(context) {
    const capacitesBase = context.data.system.capacites.base;
    const capacites2038 = context.data.system.capacites.c2038;
    const capacites2038Necromancer = context.data.system.capacites.c2038Necromancer;
    const capacites2038Sorcerer = context.data.system.capacites.c2038Sorcerer;
    const capacitesCodex = context.data.system.capacites.codex;
    const capacitesAtlas = context.data.system.capacites.atlas;
    const capacitesAtlasSpecial = context.data.system.capacites.atlasSpecial;
    const capacitesSelected = context.data.system.capacites.selected;
    const is2038 = game.settings.get("knight", "include-capacite2038");
    const is2038Necromancer = game.settings.get("knight", "include-capacite2038necromancer");
    const is2038Sorcerer = game.settings.get("knight", "include-capacite2038sorcerer");
    const isCodex = game.settings.get("knight", "include-capacitecodex");
    const isAtlas = game.settings.get("knight", "include-capaciteatlas");
    const isAtlasSpecial = game.settings.get("knight", "include-capaciteatlasspecial");

    let cArray = [];
    let cObject = {};

    for (let [key, capacite] of Object.entries(capacitesBase)) {
      if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

        cArray.push(
          {
            key:key,
            label:capacite.label,
            type:"base"
          }
        );
      }
    }

    if(is2038) {
      for (let [key, capacite] of Object.entries(capacites2038)) {
        if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:capacite.label,
              type:"c2038"
            }
          );
        }
      }
    }

    if(is2038Necromancer) {
      for (let [key, capacite] of Object.entries(capacites2038Necromancer)) {
        if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:capacite.label,
              type:"c2038Necromancer"
            }
          );
        }
      }
    }

    if(is2038Sorcerer) {
      for (let [key, capacite] of Object.entries(capacites2038Sorcerer)) {
        if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:capacite.label,
              type:"c2038Sorcerer"
            }
          );
        }
      }
    }

    if(isCodex) {
      for (let [key, capacite] of Object.entries(capacitesCodex)) {
        if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:capacite.label,
              type:"codex"
            }
          );
        }
      }
    }

    if(isAtlas) {
      for (let [key, capacite] of Object.entries(capacitesAtlas)) {
        if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:capacite.label,
              type:"atlas"
            }
          );
        }
      }
    }

    if(isAtlasSpecial) {
      for (let [key, capacite] of Object.entries(capacitesAtlasSpecial)) {
        if(Object.values(capacitesSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:capacite.label,
              type:"atlasSpecial"
            }
          );
        }
      }
    }

    cArray.sort(SortByLabel);

    if(Object.values(capacitesSelected).findIndex(element => element.key == "personnalise") == -1) {
      cArray.unshift({
        key:"personnalise",
        label:capacitesBase["personnalise"].label,
        type:"base"
      });
    }

    for (let i = 0;i < cArray.length;i++) {
      cObject[cArray[i].key] = {};
      cObject[cArray[i].key] = cArray[i];
    }

    context.data.system.capacites.liste = cObject;
  }

  _createSpecialList(context) {
    const specialBase = context.data.system.special.base;
    const special2038 = context.data.system.special.c2038;
    const special2038Sorcerer = context.data.system.special.c2038Sorcerer;
    const special2038Necromancer = context.data.system.special.c2038Necromancer;
    const specialAtlas = context.data.system.special.atlas;
    const specialAtlasSpecial = context.data.system.special.atlasSpecial;
    const is2038 = game.settings.get("knight", "include-capacite2038");
    const is2038Sorcerer = game.settings.get("knight", "include-capacite2038sorcerer");
    const is2038Necromancer = game.settings.get("knight", "include-capacite2038necromancer");
    const isAtlas = game.settings.get("knight", "include-capaciteatlas");
    const isAtlasSpecial = game.settings.get("knight", "include-capaciteatlasspecial");
    const specialSelected = context.data.system.special.selected;

    let cArray = [];
    let cObject = {};

    for (let [key, special] of Object.entries(specialBase)) {
      if(Object.values(specialSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

        cArray.push(
          {
            key:key,
            label:special.label,
            type:"base"
          }
        );
      }
    }

    if(is2038) {
      for (let [key, special] of Object.entries(special2038)) {
        if(Object.values(specialSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:special.label,
              type:"c2038"
            }
          );
        }
      }
    }

    if(is2038Sorcerer) {
      for (let [key, special] of Object.entries(special2038Sorcerer)) {
        if(Object.values(specialSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {
          cArray.push(
            {
              key:key,
              label:special.label,
              type:"c2038Sorcerer"
            }
          );
        }
      }
    }

    if(is2038Necromancer) {
      for (let [key, special] of Object.entries(special2038Necromancer)) {
        if(Object.values(specialSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:special.label,
              type:"c2038Necromancer"
            }
          );
        }
      }
    }

    if(isAtlas) {
      for (let [key, special] of Object.entries(specialAtlas)) {
        if(Object.values(specialSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:special.label,
              type:"atlas"
            }
          );
        }
      }
    }

    if(isAtlasSpecial) {
      for (let [key, special] of Object.entries(specialAtlasSpecial)) {
        if(Object.values(specialSelected).findIndex(element => element.key == key) == -1 && key != "personnalise") {

          cArray.push(
            {
              key:key,
              label:special.label,
              type:"atlasSpecial"
            }
          );
        }
      }
    }

    cArray.sort(SortByLabel);

    if(Object.values(specialSelected).findIndex(element => element.key == "personnalise") == -1) {
      cArray.unshift({
        key:"personnalise",
        label:specialBase["personnalise"].label,
        type:"base"
      });
    }

    for (let i = 0;i < cArray.length;i++) {
      cObject[cArray[i].key] = {};
      cObject[cArray[i].key] = cArray[i];
    }

    context.data.system.special.liste = cObject;
  }

  //GESTION DES TRADUCTIONS DES CAPACITES
  _prepareCapacitesTranslation(context) {
    this._prepareBaseDurationTranslation(context);
    this._prepare2038DurationTranslation(context);
    this._prepare2038SorcererDurationTranslation(context);
    this._prepareCodexDurationTranslation(context);
    this._prepareAtlasDurationTranslation(context);
    this._prepareAtlasSpecialDurationTranslation(context);
    this._prepareRangeTranslation(context);
    this._prepareEffetsListe(context);
    this._prepareShrineTranslation(context);
    this._prepareFalconTranslation(context);
    this._prepareGoliathSelectedTranslation(context);
    this._prepareGhostSelectedTranslation(context);
    this._prepareSelectedTypeTranslation(context);
    this._prepareBorealisTranslation(context);
    this._prepareWarlordTranslation(context);
    this._prepareCeaTranslation(context);
    this._prepareSarcophageTranslation(context);
    this._prepareDiscordTranslation(context);
    this._prepareMorphTranslation(context);
    this._prepareCompanionsTranslation(context);
    this._prepareIlluminationTranslation(context);
    this._prepareRageTranslation(context);
    this._prepareRageSelectedTranslation(context);
    this._prepareSelectedChangelingTranslation(context);
    this._prepareMechanicTranslation(context);

    const capacitesBase = context.data.system.capacites.base;
    const capacites2038 = context.data.system.capacites.c2038;
    const capacites2038Necromancer = context.data.system.capacites.c2038Necromancer;
    const capacites2038Sorcerer = context.data.system.capacites.c2038Sorcerer;
    const capacitesCodex = context.data.system.capacites.codex;
    const capacitesAtlasSpecial = context.data.system.capacites.atlasSpecial;
    const capacitesAtlas = context.data.system.capacites.atlas;

    for (let [key, capacite] of Object.entries(capacitesBase)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }

    for (let [key, capacite] of Object.entries(capacites2038)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }

    for (let [key, capacite] of Object.entries(capacites2038Necromancer)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }

    for (let [key, capacite] of Object.entries(capacites2038Sorcerer)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }

    for (let [key, capacite] of Object.entries(capacitesCodex)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }

    for (let [key, capacite] of Object.entries(capacitesAtlasSpecial)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }

    for (let [key, capacite] of Object.entries(capacitesAtlas)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      capacite.label = game.i18n.localize(CONFIG.KNIGHT.capacites[key]);
      capacite.description = description;
    }
  }

  _prepareBorealisTranslation(context) {
    const capacite = context.data.system.capacites.base.borealis;
    const support = capacite.support;
    const offensif = capacite.offensif;
    const utilitaire = capacite.utilitaire;

    const eSupport = capacite.evolutions.support;
    const eOffensif = capacite.evolutions.offensif;
    const eUtilitaire = capacite.evolutions.utilitaire;

    const traSupport = CONFIG.KNIGHT.borealis.support;
    const traOffensif = CONFIG.KNIGHT.borealis.offensif;
    const traUtilitaire = CONFIG.KNIGHT.borealis.utilitaire;

    support.description = game.i18n.localize(traSupport.description);
    support.duree = game.i18n.localize(traSupport.duree);

    eSupport.description = game.i18n.localize(traSupport.description);
    eSupport.duree = game.i18n.localize(traSupport.duree);

    offensif.description = game.i18n.localize(traOffensif.description);
    offensif.duree = game.i18n.localize(traOffensif.duree);

    eOffensif.description = game.i18n.localize(traOffensif.description);
    eOffensif.duree = game.i18n.localize(traOffensif.duree);

    utilitaire.description = game.i18n.localize(traUtilitaire.description);
    utilitaire.duree = game.i18n.localize(traUtilitaire.duree);

    eUtilitaire.description = game.i18n.localize(traUtilitaire.description);
    eUtilitaire.duree = game.i18n.localize(traUtilitaire.duree);
  }

  _prepareCeaTranslation(context) {
    const capacite = context.data.system.capacites.c2038.cea;
    const evolutions = context.data.system.capacites.c2038.cea.evolutions;
    const vague = capacite.vague;
    const salve = capacite.salve;
    const rayon = capacite.rayon;

    const eVague = evolutions.vague;
    const eSalve = evolutions.salve;
    const eRayon = evolutions.rayon;

    const traVague = CONFIG.KNIGHT.cea.vague;
    const traSalve = CONFIG.KNIGHT.cea.salve;
    const traRayon = CONFIG.KNIGHT.cea.rayon;

    eVague.description = game.i18n.localize(traVague.description);
    eVague.portee = game.i18n.localize("KNIGHT.PORTEE.Contact") + " / "+game.i18n.localize("KNIGHT.PORTEE.Courte");

    vague.description = game.i18n.localize(traVague.description);
    vague.portee = game.i18n.localize("KNIGHT.PORTEE.Contact") + " / "+game.i18n.localize("KNIGHT.PORTEE.Courte");

    salve.description = game.i18n.localize(traSalve.description);
    salve.portee = game.i18n.localize("KNIGHT.PORTEE.Moyenne");

    eSalve.description = game.i18n.localize(traSalve.description);
    eSalve.portee = game.i18n.localize("KNIGHT.PORTEE.Moyenne");

    rayon.description = game.i18n.localize(traRayon.description);
    rayon.portee = game.i18n.localize("KNIGHT.PORTEE.Moyenne");

    eRayon.description = game.i18n.localize(traRayon.description);
    eRayon.portee = game.i18n.localize("KNIGHT.PORTEE.Moyenne");
  }

  _prepareSarcophageTranslation(context) {
    const capacite = context.data.system.capacites.c2038Necromancer.sarcophage;
    const liste = capacite.bonus.liste;

    for (let [key, bonus] of Object.entries(liste)) {
      bonus.offert = game.i18n.localize(CONFIG.KNIGHT.sarcophage[key]);
    }
  }

  _prepareShrineTranslation(context) {
    const capacite = context.data.system.capacites.base.shrine;
    const evolution = capacite.evolutions;

    capacite.portee = `${game.i18n.localize(CONFIG.KNIGHT.shrine.portee.personnelle)} / ${game.i18n.localize(CONFIG.KNIGHT.shrine.portee.moyenne)}`;
    evolution.portee = `${game.i18n.localize(CONFIG.KNIGHT.shrine.portee.personnelle)} / ${game.i18n.localize(CONFIG.KNIGHT.shrine.portee.moyenne)}`;
  }

  _prepareAscensionSelectedTranslation(context) {
    const capacite = context.data.system.capacites.selected?.ascension || false;
    const energie = context.data.system.energie.base || 0;

    if(!capacite) return;

    if(energie < capacite.energie.min) { capacite.energie.min = energie }
    if(energie < capacite.energie.max) { capacite.energie.max = energie }

    capacite.energie.limite = energie;

    const labelSansArmure = game.i18n.localize(CONFIG.KNIGHT.ascension["sansArmure"]);
    const labelNoSansArmure = game.i18n.localize(CONFIG.KNIGHT.ascension["noSansArmure"]);

    if(capacite.sansarmure.acces === true) {
      capacite.sansarmure.label = labelSansArmure;
    } else {
      capacite.sansarmure.label = labelNoSansArmure;
    }

    const eEvo = context.data.system.evolutions.liste;

    for (let [key, evo] of Object.entries(eEvo)) {
      const evolution = evo.capacites?.ascension || false;

      if(!evolution) return;

      if(energie < evolution.energie.min) { evolution.energie.min = energie }
      if(energie < evolution.energie.max) { evolution.energie.max = energie }
      evolution.energie.limite = energie;

      const labelSansArmure = game.i18n.localize(CONFIG.KNIGHT.ascension["sansArmure"]);
      const labelNoSansArmure = game.i18n.localize(CONFIG.KNIGHT.ascension["noSansArmure"]);

      if(evolution.sansarmure.acces === true) {
        evolution.sansarmure.label = labelSansArmure;
      } else {
        evolution.sansarmure.label = labelNoSansArmure;
      }
    }
  }

  _prepareSelectedChangelingTranslation(context) {
    const capacite = context.data.system.capacites.selected?.changeling || false;

    if(!capacite) return;

    const labelDesactivation = game.i18n.localize(CONFIG.KNIGHT.changeling["desactivation"]);
    const labelNoDesactivation = game.i18n.localize(CONFIG.KNIGHT.changeling["noDesactivation"]);

    if(capacite.desactivationexplosive.acces === true) {
      capacite.desactivationexplosive.label = labelDesactivation;
    } else {
      capacite.desactivationexplosive.label = labelNoDesactivation;
    }
  }

  _prepareGoliathSelectedTranslation(context) {
    const capacite = context.data.system.capacites.selected?.goliath || false;

    if(!capacite) return;

    const labelRack = game.i18n.localize(CONFIG.KNIGHT.goliath["armesrack"])+" "+capacite.armesRack.value+" "+game.i18n.localize(CONFIG.KNIGHT.goliath["metrebonus"]).toLowerCase();
    const labelNoRack = game.i18n.localize(CONFIG.KNIGHT.goliath["armesnorack"]);

    if(capacite.armesRack.active === true) {
      capacite.armesRack.label = labelRack;
    } else {
      capacite.armesRack.label = labelNoRack;
    }
  }

  _prepareGhostSelectedTranslation(context) {
    const interruption = context.data.system.capacites.selected?.ghost?.interruption || false;

    if(!interruption) return;

    const labelTrue = game.i18n.localize(CONFIG.KNIGHT.ghost["interruption"]);
    const labelFalse = game.i18n.localize(CONFIG.KNIGHT.ghost["nointerruption"]);

    if(interruption.actif === true) {
      interruption.label = labelTrue;
    } else {
      interruption.label = labelFalse;
    }

    const degats = context.data.system.capacites.selected?.ghost?.bonus?.degats || false;

    if(!degats) return;

    const odInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odinclus"]);
    const odNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odnoinclus"]);

    const diceInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["diceinclus"]);
    const diceNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["dicenoinclus"]);

    const fixeInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixeinclus"]);
    const fixeNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixenoinclus"]);

    if(degats.od === true) {
      degats.inclus.od = odInclus;
    } else {
      degats.inclus.od = odNoInclus;
    }

    if(degats.dice === true) {
      degats.inclus.dice = diceInclus;
    } else {
      degats.inclus.dice = diceNoInclus;
    }

    if(degats.fixe === true) {
      degats.inclus.fixe = fixeInclus;
    } else {
      degats.inclus.fixe = fixeNoInclus;
    }
  }

  _prepareFalconTranslation(context) {
    const capacite = context.data.system.capacites.base.falcon;

    capacite.informations = "<p>"+game.i18n.localize(CONFIG.KNIGHT.falcon["informations"])
    .replaceAll("\n**", "\n<b>")
    .replaceAll("**", "</b>")
    .replaceAll("\r\n", "</p><p>")
    .replaceAll(" _", " <em>")
    .replaceAll("_", "</em>")
    .replaceAll(" **", " <b>")+"</p>";

    capacite.evolutions.informations = "<p>"+game.i18n.localize(CONFIG.KNIGHT.falcon["informations"])
    .replaceAll("\n**", "\n<b>")
    .replaceAll("**", "</b>")
    .replaceAll("\r\n", "</p><p>")
    .replaceAll(" _", " <em>")
    .replaceAll("_", "</em>")
    .replaceAll(" **", " <b>")+"</p>";
  }

  _prepareSelectedTypeTranslation(context) {
    const sType = context.data.system.capacites.selected?.type?.type || false;
    const eType = context.data.system.evolutions.liste;
    const labels = {};

    if(!sType) return;

    for (let [key, type] of Object.entries(sType)){
      type.label = game.i18n.localize(CONFIG.KNIGHT.type[key]);
      labels[key] = {};
      labels[key].label = game.i18n.localize(CONFIG.KNIGHT.type[key]);

      for (let [keyType, dType] of Object.entries(type.liste)){
        dType.label = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[keyType]);
        labels[key][keyType] = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[keyType]);
      }
    }

    for (let [key, evolution] of Object.entries(eType)) {
      const t = evolution.capacites?.type?.type || false;

      for (let [eKey, eType] of Object.entries(t)) {
        const l = eType?.liste || false;

        eType.label = labels[eKey].label;

        for (let [lKey, lType] of Object.entries(l)) {
          lType.label = labels[eKey][lKey];
        }
      }
    }
  }

  _prepareWarlordTranslation(context) {
    const capacite = context.data.system.capacites.base.warlord.impulsions;
    const evolutions = context.data.system.capacites.base.warlord.evolutions.impulsions;

    capacite.action.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.action["duree"]);
    capacite.esquive.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.esquive["duree"]);
    capacite.force.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.force["duree"]);
    capacite.guerre.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.guerre["duree"]);
    capacite.energie.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.energie["duree"]);

    capacite.action.bonus.description = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.action["bonus"]);
    capacite.energie.bonus.description = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.energie["bonus"]);

    evolutions.action.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.action["duree"]);
    evolutions.esquive.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.esquive["duree"]);
    evolutions.force.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.force["duree"]);
    evolutions.guerre.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.guerre["duree"]);
    evolutions.energie.duree = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.energie["duree"]);

    evolutions.action.bonus.description = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.action["bonus"]);
    evolutions.energie.bonus.description = game.i18n.localize(CONFIG.KNIGHT.warlord.impulsions.energie["bonus"]);
  }

  _prepareDiscordTranslation(context) {
    const capacite = context.data.system.capacites.c2038.discord;
    const evolutions = capacite.evolutions;

    capacite.tour.duree = game.i18n.localize(CONFIG.KNIGHT.discord.tour.duree);
    capacite.scene.duree = game.i18n.localize(CONFIG.KNIGHT.discord.scene.duree);

    evolutions.tour.duree = game.i18n.localize(CONFIG.KNIGHT.discord.tour.duree);
    evolutions.scene.duree = game.i18n.localize(CONFIG.KNIGHT.discord.scene.duree);
  }

  _prepareMechanicTranslation(context) {
    const capacite = context.data.system.capacites.base.mechanic;

    capacite.reparation.contact.duree = game.i18n.localize(CONFIG.KNIGHT.mechanic.duree);
    capacite.reparation.distance.duree = game.i18n.localize(CONFIG.KNIGHT.mechanic.duree);

    capacite.evolutions.reparation.contact.duree = game.i18n.localize(CONFIG.KNIGHT.mechanic.duree);
    capacite.evolutions.reparation.distance.duree = game.i18n.localize(CONFIG.KNIGHT.mechanic.duree);
  }

  _prepareMorphTranslation(context) {
    const capacite = context.data.system.capacites.c2038Sorcerer.morph;
    const evolutions = capacite.evolutions;

    capacite.vol.description = game.i18n.localize(CONFIG.KNIGHT.morph.vol.description);
    capacite.phase.description = game.i18n.localize(CONFIG.KNIGHT.morph.phase.description);
    capacite.phase.duree = game.i18n.localize(CONFIG.KNIGHT.morph.phase.duree);
    capacite.etirement.description = game.i18n.localize(CONFIG.KNIGHT.morph.etirement.description);
    capacite.etirement.portee = game.i18n.localize(CONFIG.KNIGHT.morph.etirement.portee);
    capacite.polymorphie.description = game.i18n.localize(CONFIG.KNIGHT.morph.polymorphie.description);

    evolutions.vol.description = game.i18n.localize(CONFIG.KNIGHT.morph.vol.description);
    evolutions.phase.description = game.i18n.localize(CONFIG.KNIGHT.morph.phase.description);
    evolutions.phase.duree = game.i18n.localize(CONFIG.KNIGHT.morph.phase.duree);
    evolutions.etirement.description = game.i18n.localize(CONFIG.KNIGHT.morph.etirement.description);
    evolutions.etirement.portee = game.i18n.localize(CONFIG.KNIGHT.morph.etirement.portee);
    evolutions.polymorphie.description = game.i18n.localize(CONFIG.KNIGHT.morph.polymorphie.description);
  }

  _prepareIlluminationTranslation(context) {
    const capacite = context.data.system.capacites.atlasSpecial.illumination;

    capacite.blaze.description = game.i18n.localize(CONFIG.KNIGHT.illumination.blaze.description);
    capacite.candle.description = game.i18n.localize(CONFIG.KNIGHT.illumination.candle.description);
    capacite.beacon.description = game.i18n.localize(CONFIG.KNIGHT.illumination.beacon.description);
    capacite.torch.description = game.i18n.localize(CONFIG.KNIGHT.illumination.torch.description);
    capacite.projector.description = game.i18n.localize(CONFIG.KNIGHT.illumination.projector.description);
    capacite.lighthouse.description = game.i18n.localize(CONFIG.KNIGHT.illumination.lighthouse.description);
    capacite.lantern.description = game.i18n.localize(CONFIG.KNIGHT.illumination.lantern.description);

    capacite.evolutions.blaze.description = game.i18n.localize(CONFIG.KNIGHT.illumination.blaze.description);
    capacite.evolutions.candle.description = game.i18n.localize(CONFIG.KNIGHT.illumination.candle.description);
    capacite.evolutions.beacon.description = game.i18n.localize(CONFIG.KNIGHT.illumination.beacon.description);
    capacite.evolutions.torch.description = game.i18n.localize(CONFIG.KNIGHT.illumination.torch.description);
    capacite.evolutions.projector.description = game.i18n.localize(CONFIG.KNIGHT.illumination.projector.description);
    capacite.evolutions.lighthouse.description = game.i18n.localize(CONFIG.KNIGHT.illumination.lighthouse.description);
    capacite.evolutions.lantern.description = game.i18n.localize(CONFIG.KNIGHT.illumination.lantern.description);
  }

  _prepareRageTranslation(context) {
    const capacite = context.data.system.capacites.atlasSpecial.rage;
    const evolutions = capacite.evolutions;

    capacite.nourri.description = game.i18n.localize(CONFIG.KNIGHT.rage.nourri.description);
    capacite.rage.description = game.i18n.localize(CONFIG.KNIGHT.rage.rage.description);
    capacite.fureur.description = game.i18n.localize(CONFIG.KNIGHT.rage.fureur.description);
    capacite.blaze.description = game.i18n.localize(CONFIG.KNIGHT.illumination.blaze.description);

    evolutions.nourri.description = game.i18n.localize(CONFIG.KNIGHT.rage.nourri.description);
    evolutions.rage.description = game.i18n.localize(CONFIG.KNIGHT.rage.rage.description);
    evolutions.fureur.description = game.i18n.localize(CONFIG.KNIGHT.rage.fureur.description);
    evolutions.blaze.description = game.i18n.localize(CONFIG.KNIGHT.illumination.blaze.description);
  }

  _prepareRageSelectedTranslation(context) {
    const capacite = context.data.system.capacites.selected?.rage || false;

    if(!capacite) return;

    const colereBonus = capacite.colere.combosBonus.has;
    const colereInterdits = capacite.colere.combosInterdits.has;

    const rageBonus = capacite.rage.combosBonus.has;
    const rageInterdits = capacite.rage.combosInterdits.has;

    const fureurBonus = capacite.fureur.combosBonus.has;
    const fureurInterdits = capacite.fureur.combosInterdits.has;

    if(colereBonus) {
      capacite.colere.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboBonus"]);
    } else {
      capacite.colere.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoBonus"]);
    }

    if(colereInterdits) {
      capacite.colere.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboInterdits"]);
    } else {
      capacite.colere.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoInterdits"]);
    }

    if(rageBonus) {
      capacite.rage.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboBonus"]);
    } else {
      capacite.rage.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoBonus"]);
    }

    if(rageInterdits) {
      capacite.rage.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboInterdits"]);
    } else {
      capacite.rage.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoInterdits"]);
    }

    if(fureurBonus) {
      capacite.fureur.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboBonus"]);
    } else {
      capacite.fureur.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoBonus"]);
    }

    if(fureurInterdits) {
      capacite.fureur.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboInterdits"]);
    } else {
      capacite.fureur.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoInterdits"]);
    }
  }

  _prepareCompanionsTranslation(context) {
    const companions = context.data.system.capacites.codex.companions;
    const evolutions = companions.special;

    companions.lion.armes.contact.coups.label = game.i18n.localize(CONFIG.KNIGHT.companions["coups"]);
    companions.wolf.armes.contact.coups.label = game.i18n.localize(CONFIG.KNIGHT.companions["coups"]);
    companions.wolf.configurations.labor.description = game.i18n.localize(CONFIG.KNIGHT.companions.labor["description"]);
    companions.wolf.configurations.medic.description = game.i18n.localize(CONFIG.KNIGHT.companions.medic["description"]);
    companions.wolf.configurations.tech.description = game.i18n.localize(CONFIG.KNIGHT.companions.tech["description"]);
    companions.wolf.configurations.fighter.description = game.i18n.localize(CONFIG.KNIGHT.companions.fighter["description"]);
    companions.wolf.configurations.recon.description = game.i18n.localize(CONFIG.KNIGHT.companions.recon["description"]);
    companions.crow.capacites = game.i18n.localize(CONFIG.KNIGHT.companions["vol"]);
  }

  //GESTION DES EFFETS DES CAPACITES
  _prepareEffetsListe(context) {
    this._prepareEffetsSelectedBorealis(context);
    this._prepareEffetsSelectedChangeling(context);
    this._prepareEffetsSelectedLongbow(context);
    this._prepareEffetsSelectedOriflamme(context);
    this._prepareEffetsSelectedCea(context);
    this._prepareEffetsSelectedCompanions(context);
    this._prepareEffetsSelectedPorteurLumiere(context);
    this._prepareEffetsSelectedIllumination(context);
    this._prepareEffetsSelectedMorph(context);
  }

  _prepareEffetsSelectedBorealis(context) {
    const bEffets = context.data.system.capacites.selected?.borealis?.offensif?.effets || false;
    if(!bEffets) return;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const bLabels = CONFIG.KNIGHT.effets;

    bEffets.liste = listEffects(bRaw, bCustom, bLabels);
  }

  _prepareEffetsSelectedChangeling(context) {
    const cEffets = context.data.system.capacites.selected?.changeling || false;
    if(!cEffets) return;

    const cLEffets = cEffets.desactivationexplosive.effets;
    const raw = cLEffets.raw;
    const custom = cLEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    cLEffets.liste = listEffects(raw, custom, labels);
  }

  _prepareEffetsSelectedMorph(context) {
    const capacite = context.data.system.capacites.selected?.morph || false;
    if(!capacite) return;

    const effetsG = capacite.polymorphie.griffe.effets;
    const rawG = effetsG.raw;
    const customG = effetsG.custom;
    const labels = CONFIG.KNIGHT.effets;

    const effetsL = capacite.polymorphie.lame.effets;
    const rawL = effetsL.raw;
    const customL = effetsL.custom;

    const effetsC = capacite.polymorphie.canon.effets;
    const rawC = effetsC.raw;
    const customC = effetsC.custom;

    effetsG.liste = listEffects(rawG, customG, labels);
    effetsL.liste = listEffects(rawL, customL, labels);
    effetsC.liste = listEffects(rawC, customC, labels);
  }

  _prepareEffetsSelectedLongbow(context) {
    const lEffets = context.data.system.capacites.selected?.longbow?.effets || false;
    const lAmelioration = context.data.system.capacites.selected?.longbow || false;
    if(!lEffets) return;

    const lEB = lEffets.base;
    const lRB = lEB.raw;
    const lCB = lEB.custom;

    const lE1 = lEffets.liste1;
    const lR1 = lE1.raw;
    const lC1 = lE1.custom;

    const lE2 = lEffets.liste2;
    const lR2 = lE2.raw;
    const lC2 = lE2.custom;

    const lE3 = lEffets.liste3;
    const lR3 = lE3.raw;
    const lC3 = lE3.custom;

    const lA = lAmelioration?.distance || {raw:[], custom:[]};
    const lRA = lA.raw;
    const lCA = lA.custom;

    const labels = CONFIG.KNIGHT.effets;
    const labelsA = CONFIG.KNIGHT.AMELIORATIONS.distance;

    const lEffets3 = lE3.acces;

    lEB.liste = listEffects(lRB, lCB, labels);
    lE1.liste = listEffects(lR1, lC1, labels);
    lE2.liste = listEffects(lR2, lC2, labels);
    lE3.liste = listEffects(lR3, lC3, labels);
    lA.liste = listEffects(lRA, lCA, labelsA);

    if(lEffets3) {
      lE3.label = game.i18n.localize(CONFIG.KNIGHT.longbow["effets3"]);
    } else {
      lE3.label = game.i18n.localize(CONFIG.KNIGHT.longbow["noeffets3"]);
    }
  }

  _prepareEffetsSelectedOriflamme(context) {
    const bEffets = context.data.system.capacites.selected?.oriflamme?.effets || false;
    if(!bEffets) return;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const bLabels = CONFIG.KNIGHT.effets;

    bEffets.liste = listEffects(bRaw, bCustom, bLabels);
  }

  _prepareEffetsSelectedCea(context) {
    const bVEffets = context.data.system.capacites.selected?.cea?.vague?.effets || false;
    const bSEffets = context.data.system.capacites.selected?.cea?.salve?.effets || false;
    const bREffets = context.data.system.capacites.selected?.cea?.rayon?.effets || false;

    if(!bVEffets) return;
    if(!bSEffets) return;
    if(!bREffets) return;

    function _sortByName(x, y){
      if (x.name.toLowerCase() < y.name.toLowerCase()) {return -1;}
      if (x.name.toLowerCase() > y.name.toLowerCase()) {return 1;}
      return 0;
    }

    const bVRaw = bVEffets.raw;
    const bVCustom = bVEffets.custom;
    const bSRaw = bSEffets.raw;
    const bSCustom = bSEffets.custom;
    const bRRaw = bREffets.raw;
    const bRCustom = bREffets.custom;

    const bLabels = CONFIG.KNIGHT.effets;

    bVEffets.liste = listEffects(bVRaw, bVCustom, bLabels);
    bSEffets.liste = listEffects(bSRaw, bSCustom, bLabels);
    bREffets.liste = listEffects(bRRaw, bRCustom, bLabels);
  }

  _prepareEffetsSelectedCompanions(context) {
    const companions = context.data.system.capacites.selected?.companions || false;
    const lEffets = companions?.lion?.armes || false;
    const wEffets = companions?.wolf?.armes || false;
    const bEffets = companions?.wolf?.configurations?.fighter?.bonus?.effets || false;

    const labels = CONFIG.KNIGHT.effets;

    if(!companions) return;

    if(lEffets != false) {
      const cLEffets = lEffets.contact.coups.effets;
      const cLRaw = cLEffets.raw;
      const cLCustom = cLEffets.custom;

      cLEffets.liste = listEffects(cLRaw, cLCustom, labels);
    }

    if(wEffets != false) {
      const cWEffets = wEffets.contact.coups.effets;
      const cWRaw = cWEffets.raw;
      const CWCustom = cWEffets.custom;

      cWEffets.liste = listEffects(cWRaw, CWCustom, labels);
    }

    if(bEffets != false) {
      const raw = bEffets.raw;
      const custom = bEffets.custom;

      bEffets.liste = listEffects(raw, custom, labels);
    }
  }

  _prepareEffetsSelectedPorteurLumiere(context) {
    const plEffets = context.data.system.special.selected?.porteurlumiere?.bonus?.effets || false;

    if(!plEffets) return;

    const raw = plEffets.raw;
    const custom = plEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    plEffets.liste = listEffects(raw, custom, labels);
  }

  _prepareEffetsSelectedIllumination(context) {
    const iEffets = context.data.system.capacites.selected?.illumination?.lantern?.effets || false;

    if(!iEffets) return;

    const raw = iEffets.raw;
    const custom = iEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    iEffets.liste = listEffects(raw, custom, labels);
  }

  //GESTION DES TRADUCTIONS DES SPECIAUX
  _prepareSpecialTranslation(context) {
    this._preparePlusEspoirTranslation(context);
    this._prepareContrecoupsSelectedTranslation(context);
    this._prepareContrecoupsTranslation(context);

    const specialBase = context.data.system.special.base;
    const specialC2038 = context.data.system.special.c2038;
    const specialC2038Necromancer = context.data.system.special.c2038Necromancer;
    const specialC2038Sorcerer = context.data.system.special.c2038Sorcerer;
    const specialAtlas = context.data.system.special.atlas;
    const specialAtlasSpecial = context.data.system.special.atlasSpecial;

    for (let [key, special] of Object.entries(specialBase)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
      special.description = description;
    }

    for (let [key, special] of Object.entries(specialC2038)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
      special.description = description;
    }

    for (let [key, special] of Object.entries(specialC2038Sorcerer)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
      special.description = description;
    }

    for (let [key, special] of Object.entries(specialC2038Necromancer)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
      special.description = description;
    }

    for (let [key, special] of Object.entries(specialAtlas)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
      special.description = description;
    }

    for (let [key, special] of Object.entries(specialAtlasSpecial)) {
      const description = `<p style="text-align:justify">${game.i18n.localize(CONFIG.KNIGHT[key].description)
        .replaceAll("\n**", "\n<b>").replaceAll("**", "</b>")
        .replaceAll(" _", " <i>").replaceAll("_", "</i>")
        .replaceAll(" [", " <u>").replaceAll("]", "</u>")
        .replaceAll("\r\n", "</p><p style=text-align:justify;>")}</p>`;

      special.label = game.i18n.localize(CONFIG.KNIGHT.special[key]);
      special.description = description;
    }
  }

  _preparePlusEspoirTranslation(context) {
    const special = context.data.system.special.selected?.plusespoir || false;

    if(!special) return;

    const recuperation = special.espoir.recuperation.value;
    const perte = special.espoir.perte.value;

    if(recuperation) {
      special.espoir.recuperation.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["recuperation"]);
    } else {
      special.espoir.recuperation.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["nonrecuperation"]);
    }

    if(perte) {
      special.espoir.perte.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["perte"]);
    } else {
      special.espoir.perte.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["nonperte"]);
    }
  }

  _prepareContrecoupsTranslation(context){
    const special = context.data.system.special.atlas.contrecoups;
    const evolution = context.data.system.special.atlas.contrecoups.evolutions;

    special.tableau.c1.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.dechirure);
    special.tableau.c1.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.disparition);
    special.tableau.c1.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.disparition);
    special.tableau.c1.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    special.tableau.c1.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    special.tableau.c1.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);

    special.tableau.c2.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.disparition);
    special.tableau.c2.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    special.tableau.c2.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    special.tableau.c2.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.fragmentation);
    special.tableau.c2.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    special.tableau.c2.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);

    special.tableau.c3.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    special.tableau.c3.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    special.tableau.c3.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.fragmentation);
    special.tableau.c3.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    special.tableau.c3.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    special.tableau.c3.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);

    special.tableau.c4.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    special.tableau.c4.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.fragmentation);
    special.tableau.c4.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    special.tableau.c4.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    special.tableau.c4.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);
    special.tableau.c4.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);

    special.tableau.c5.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    special.tableau.c5.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    special.tableau.c5.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    special.tableau.c5.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);
    special.tableau.c5.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desagregation);
    special.tableau.c5.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);

    special.tableau.c6.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    special.tableau.c6.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    special.tableau.c6.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);
    special.tableau.c6.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desagregation);
    special.tableau.c6.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);
    special.tableau.c6.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);

    evolution.tableau.c1.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.dechirure);
    evolution.tableau.c1.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.disparition);
    evolution.tableau.c1.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.disparition);
    evolution.tableau.c1.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    evolution.tableau.c1.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    evolution.tableau.c1.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);

    evolution.tableau.c2.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.disparition);
    evolution.tableau.c2.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    evolution.tableau.c2.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    evolution.tableau.c2.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.fragmentation);
    evolution.tableau.c2.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    evolution.tableau.c2.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);

    evolution.tableau.c3.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    evolution.tableau.c3.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    evolution.tableau.c3.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.fragmentation);
    evolution.tableau.c3.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    evolution.tableau.c3.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    evolution.tableau.c3.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);

    evolution.tableau.c4.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.incident);
    evolution.tableau.c4.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.fragmentation);
    evolution.tableau.c4.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    evolution.tableau.c4.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    evolution.tableau.c4.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);
    evolution.tableau.c4.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);

    evolution.tableau.c5.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    evolution.tableau.c5.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.siphon);
    evolution.tableau.c5.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    evolution.tableau.c5.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);
    evolution.tableau.c5.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desagregation);
    evolution.tableau.c5.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);

    evolution.tableau.c6.l1 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    evolution.tableau.c6.l2 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.sursaut);
    evolution.tableau.c6.l3 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desorientation);
    evolution.tableau.c6.l4 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.desagregation);
    evolution.tableau.c6.l5 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);
    evolution.tableau.c6.l6 = game.i18n.localize(CONFIG.KNIGHT.contrecoups.defaillance);
  }

  _prepareContrecoupsSelectedTranslation(context){
    const special = context.data.system.special.selected?.contrecoups || false;

    if(!special) return;

    const relance = special.relance.value;

    if(relance) {
      special.relance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["relance"]);
    } else {
      special.relance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["norelance"]);
    }

    const maxeffets = special.maxeffets.value;

    if(maxeffets) {
      special.maxeffets.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["maxeffets"]);
    } else {
      special.maxeffets.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["nomaxeffets"]);
    }

    const armedistance = special.armedistance.value;

    if(armedistance) {
      special.armedistance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["armedistance"]);
    } else {
      special.armedistance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["noarmedistance"]);
    }
  }

  //GESTION DES TRADUCTIONS DES EVOLUTIONS DES CAPACITES
  _prepareEvolutionsTranslation(context) {
    this._prepareEffetsListeEvolutions(context);

    const eEvo = context.data.system.evolutions.liste;

    for (let [key, evo] of Object.entries(eEvo)) {
      this._prepareEvolutionsSpecialTranslation(evo);
      this._prepareEvolutionsChangelingTranslation(evo);
      this._prepareEvolutionsGoliathTranslation(evo);
      this._prepareEvolutionsGhostTranslation(evo);
      this._prepareEvolutionsZenTranslation(evo);
      this._prepareEvolutionsRageTranslation(evo);

      this._prepareEvolutionsPlusEspoirTranslation(evo);
      this._prepareEvolutionsContrecoupsTranslation(evo);
    }
  }

  _prepareEvolutionsChangelingTranslation(context) {
    const capacite = context?.capacites?.changeling || false;

    if(!capacite) return;

    const labelDesactivation = game.i18n.localize(CONFIG.KNIGHT.changeling["desactivation"]);
    const labelNoDesactivation = game.i18n.localize(CONFIG.KNIGHT.changeling["noDesactivation"]);

    if(capacite.desactivationexplosive.acces === true) {
      capacite.desactivationexplosive.label = labelDesactivation;
    } else {
      capacite.desactivationexplosive.label = labelNoDesactivation;
    }
  }

  _prepareEvolutionsGoliathTranslation(context) {
    const capacite = context?.capacites?.goliath || false;

    if(!capacite) return;

    const labelRack = game.i18n.localize(CONFIG.KNIGHT.goliath["armesrack"])+" "+capacite.armesRack.value+" "+game.i18n.localize(CONFIG.KNIGHT.goliath["metrebonus"]).toLowerCase();
    const labelNoRack = game.i18n.localize(CONFIG.KNIGHT.goliath["armesnorack"]);

    if(capacite.armesRack.active === true) {
      capacite.armesRack.label = labelRack;
    } else {
      capacite.armesRack.label = labelNoRack;
    }
  }

  _prepareEvolutionsGhostTranslation(context) {
    const capacite = context?.capacites?.ghost || false;

    if(!capacite) return;

    const labelTrue = game.i18n.localize(CONFIG.KNIGHT.ghost["interruption"]);
    const labelFalse = game.i18n.localize(CONFIG.KNIGHT.ghost["nointerruption"]);

    if(capacite.interruption.actif === true) {
      capacite.interruption.label = labelTrue;
    } else {
      capacite.interruption.label = labelFalse;
    }

    const odInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odinclus"]);
    const odNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["odnoinclus"]);

    const diceInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["diceinclus"]);
    const diceNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["dicenoinclus"]);

    const fixeInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixeinclus"]);
    const fixeNoInclus = game.i18n.localize(CONFIG.KNIGHT.ghost["fixenoinclus"]);

    if(capacite.bonus.degats.od === true) {
      capacite.bonus.degats.inclus.od = odInclus;
    } else {
      capacite.bonus.degats.inclus.od = odNoInclus;
    }

    if(capacite.bonus.degats.dice === true) {
      capacite.bonus.degats.inclus.dice = diceInclus;
    } else {
      capacite.bonus.degats.inclus.dice = diceNoInclus;
    }

    if(capacite.bonus.degats.fixe === true) {
      capacite.bonus.degats.inclus.fixe = fixeInclus;
    } else {
      capacite.bonus.degats.inclus.fixe = fixeNoInclus;
    }
  }

  _prepareEvolutionsRageTranslation(context) {
    const capacite = context?.capacites?.rage || false;

    if(!capacite) return;

    const colereBonus = capacite.colere.combosBonus.has;
    const colereInterdits = capacite.colere.combosInterdits.has;

    const rageBonus = capacite.rage.combosBonus.has;
    const rageInterdits = capacite.rage.combosInterdits.has;

    const fureurBonus = capacite.fureur.combosBonus.has;
    const fureurInterdits = capacite.fureur.combosInterdits.has;

    if(colereBonus) {
      capacite.colere.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboBonus"]);
    } else {
      capacite.colere.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoBonus"]);
    }

    if(colereInterdits) {
      capacite.colere.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboInterdits"]);
    } else {
      capacite.colere.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoInterdits"]);
    }

    if(rageBonus) {
      capacite.rage.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboBonus"]);
    } else {
      capacite.rage.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoBonus"]);
    }

    if(rageInterdits) {
      capacite.rage.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboInterdits"]);
    } else {
      capacite.rage.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoInterdits"]);
    }

    if(fureurBonus) {
      capacite.fureur.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboBonus"]);
    } else {
      capacite.fureur.combosBonus.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoBonus"]);
    }

    if(fureurInterdits) {
      capacite.fureur.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboInterdits"]);
    } else {
      capacite.fureur.combosInterdits.label = game.i18n.localize(CONFIG.KNIGHT.rage["comboNoInterdits"]);
    }
  }

  _prepareEvolutionsZenTranslation(context) {
    const capacite = context?.capacites?.zen || false;

    if(!capacite) return;

    for (let [key, aspect] of Object.entries(capacite.aspects)){
      const traAspect = game.i18n.localize(CONFIG.KNIGHT.aspects[key]);

      aspect.label = traAspect;

      for (let [keyC, carac] of Object.entries(aspect.caracteristiques)){
        const traCarac = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[keyC]);

        carac.label = traCarac;
      }
    }
  }

  //GESTION DES TRADUCTIONS DES EVOLUTIONS DES SPECIAUX
  _prepareEvolutionsSpecialTranslation(context) {
    const special = context?.special || false;

    if(!special) return;

    for (let [key, spe] of Object.entries(special)) {
      const bDelete = spe?.delete?.value;

      if(bDelete != undefined) {
        if(bDelete === true) { spe.delete.label = game.i18n.localize(CONFIG.KNIGHT.evolutions.supprime);}
        else if(bDelete === false) { spe.delete.label = game.i18n.localize(CONFIG.KNIGHT.evolutions.noSupprime);}
      }

    }
  }

  _prepareEvolutionsPlusEspoirTranslation(context) {
    const special = context?.special?.plusespoir || false;

    if(!special) return;

    const recuperation = special.espoir.recuperation.value;
    const perte = special.espoir.perte.value;

    if(recuperation) {
      special.espoir.recuperation.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["recuperation"]);
    } else {
      special.espoir.recuperation.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["nonrecuperation"]);
    }

    if(perte) {
      special.espoir.perte.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["perte"]);
    } else {
      special.espoir.perte.label = game.i18n.localize(CONFIG.KNIGHT.plusespoir["nonperte"]);
    }
  }

  _prepareEvolutionsContrecoupsTranslation(context){
    const special = context?.special?.contrecoups || false;

    if(!special) return;

    const relance = special.relance.value;

    if(relance) {
      special.relance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["relance"]);
    } else {
      special.relance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["norelance"]);
    }

    const maxeffets = special.maxeffets.value;

    if(maxeffets) {
      special.maxeffets.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["maxeffets"]);
    } else {
      special.maxeffets.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["nomaxeffets"]);
    }

    const armedistance = special.armedistance.value;

    if(armedistance) {
      special.armedistance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["armedistance"]);
    } else {
      special.armedistance.label = game.i18n.localize(CONFIG.KNIGHT.contrecoups["noarmedistance"]);
    }
  }

  //GESTION DES EFFETS DES EVOLUTIONS DES CAPACITES
  _prepareEffetsListeEvolutions(context) {
    const eEvo = context.data.system.evolutions.liste;

    this._prepareEffetsEvolutionsLongbow(context);

    for (let [key, evo] of Object.entries(eEvo)) {
      this._prepareEffetsEvolutionsBorealis(key, context);
      this._prepareEffetsEvolutionsOriflamme(key, context);
      this._prepareEffetsEvolutionsChangeling(key, context);
      this._prepareEffetsEvolutionsIllumination(key, context);
      this._prepareEffetsEvolutionsCea(key, context);
      this._prepareEffetsEvolutionsPorteurLumiere(key, context);
      this._prepareEffetsEvolutionsMorph(key, context);
    }
  }

  _prepareEffetsEvolutionsPorteurLumiere(key, context) {
    const plEffets = context.data.system.evolutions.liste?.[key].special?.porteurlumiere?.bonus?.effets || false;

    if(!plEffets) return;

    const raw = plEffets.raw;
    const custom = plEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    plEffets.liste = listEffects(raw, custom, labels);
  }

  _prepareEffetsEvolutionsBorealis(key, context) {
    const bEffets = context.data.system.evolutions.liste?.[key].capacites?.borealis?.offensif?.effets || false;
    if(!bEffets) return;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const bLabels = CONFIG.KNIGHT.effets;

    bEffets.liste = listEffects(bRaw, bCustom, bLabels);
  }

  _prepareEffetsEvolutionsOriflamme(key, context) {
    const bEffets = context.data.system.evolutions.liste?.[key].capacites?.oriflamme?.effets || false;
    if(!bEffets) return;

    const bRaw = bEffets.raw;
    const bCustom = bEffets.custom;
    const bLabels = CONFIG.KNIGHT.effets;

    bEffets.liste = listEffects(bRaw, bCustom, bLabels);
  }

  _prepareEffetsEvolutionsChangeling(key, context) {
    const cEffets = context.data.system.evolutions.liste?.[key].capacites?.changeling || false;
    if(!cEffets) return;

    const cLEffets = cEffets.desactivationexplosive.effets;
    const raw = cLEffets.raw;
    const custom = cLEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    cLEffets.liste = listEffects(raw, custom, labels);
  }

  _prepareEffetsEvolutionsIllumination(key, context) {
    const iEffets = context.data.system.evolutions.liste?.[key].capacites?.illumination?.lantern?.effets || false;

    if(!iEffets) return;

    const raw = iEffets.raw;
    const custom = iEffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    iEffets.liste = listEffects(raw, custom, labels);
  }

  _prepareEffetsEvolutionsLongbow(context) {
    const lEffets = context.data.system.evolutions.special?.longbow || false;

    if(!lEffets) return;

    const lEB = lEffets['3'].effets.base;
    const lRB = lEB.raw;
    const lCB = lEB.custom;

    const lE1 = lEffets['1'].effets.liste1;
    const lR1 = lE1.raw;
    const lC1 = lE1.custom;

    const lE2 = lEffets['1'].effets.liste2;
    const lR2 = lE2.raw;
    const lC2 = lE2.custom;

    const lE3 = lEffets['1'].effets.liste3;
    const lR3 = lE3.raw;
    const lC3 = lE3.custom;

    const lEffets3 = lE3.acces;

    const labels = CONFIG.KNIGHT.effets;

    if(lEffets3) {
      lE3.label = game.i18n.localize(CONFIG.KNIGHT.longbow["effets3"]);
    } else {
      lE3.label = game.i18n.localize(CONFIG.KNIGHT.longbow["noeffets3"]);
    }

    lEB.liste = listEffects(lRB, lCB, labels);
    lE1.liste = listEffects(lR1, lC1, labels);
    lE2.liste = listEffects(lR2, lC2, labels);
    lE3.liste = listEffects(lR3, lC3, labels);
  }

  _prepareEffetsEvolutionsMorph(key, context) {
    const cEffets = context.data.system.evolutions.liste?.[key].capacites?.morph || false;
    if(!cEffets) return;

    const effetsG = cEffets.polymorphie.griffe.effets;
    const rawG = effetsG.raw;
    const customG = effetsG.custom;
    const labels = CONFIG.KNIGHT.effets;

    const effetsL = cEffets.polymorphie.lame.effets;
    const rawL = effetsL.raw;
    const customL = effetsL.custom;

    const effetsC = cEffets.polymorphie.canon.effets;
    const rawC = effetsC.raw;
    const customC = effetsC.custom;

    effetsG.liste = listEffects(rawG, customG, labels);
    effetsL.liste = listEffects(rawL, customL, labels);
    effetsC.liste = listEffects(rawC, customC, labels);
  }

  _prepareEffetsEvolutionsCea(key, context) {
    const bVEffets = context.data.system.evolutions.liste?.[key].capacites?.cea?.vague?.effets || false;
    const bSEffets = context.data.system.evolutions.liste?.[key].capacites?.cea?.salve?.effets || false;
    const bREffets = context.data.system.evolutions.liste?.[key].capacites?.cea?.rayon?.effets || false;

    if(!bVEffets) return;
    if(!bSEffets) return;
    if(!bREffets) return;

    const bVRaw = bVEffets.raw;
    const bVCustom = bVEffets.custom;
    const bSRaw = bSEffets.raw;
    const bSCustom = bSEffets.custom;
    const bRRaw = bREffets.raw;
    const bRCustom = bREffets.custom;
    const labels = CONFIG.KNIGHT.effets;

    bVEffets.liste = listEffects(bVRaw, bVCustom, labels);
    bSEffets.liste = listEffects(bSRaw, bSCustom, labels);
    bREffets.liste = listEffects(bRRaw, bRCustom, labels);
  }

  //GESTION DES DUREES DES CAPACITES
  _prepareBaseDurationTranslation(context) {
    const listCapacite = ["changeling", "falcon", "goliath", "ghost", "nanoc", "oriflamme", "shrine", "type", "vision", "watchtower"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.base[listCapacite[i]];
      let evolution = capacite?.evolutions || false;

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

      if(evolution != false) {
        evolution.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);
      }

    }
  }

  _prepare2038DurationTranslation(context) {
    const listCapacite = ["cea", "puppet", "windtalker"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.c2038[listCapacite[i]];
      let evolution = capacite?.evolutions || false;

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

      if(evolution != false) {
        evolution.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);
      }
    }
  }

  _prepare2038SorcererDurationTranslation(context) {
    const listCapacite = ["morph"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.c2038Sorcerer[listCapacite[i]];
      let evolution = capacite?.evolutions || false;

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

      if(evolution != false) {
        evolution.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);
      }
    }
  }

  _prepareCodexDurationTranslation(context) {
    const listCapacite = ["companions"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.codex[listCapacite[i]];
      let eSpecial = capacite?.specialEvolutions || false;

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

      if(eSpecial != false) {
        eSpecial.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);
      }
    }
  }

  _prepareAtlasDurationTranslation(context) {
    const listCapacite = ["ascension", "totem", "forward", "record", "rewind"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.atlas[listCapacite[i]];
      let evolution = capacite?.evolutions || false;

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

      if(evolution != false) {
        evolution.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);
      }
    }
  }

  //GESTION DES DUREES DES SPECIAUX
  _prepareAtlasSpecialDurationTranslation(context) {
    const listCapacite = ["illumination", "rage"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.atlasSpecial[listCapacite[i]];
      let evolution = capacite?.evolutions || false;

      capacite.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);

      if(evolution != false) {
        evolution.duree = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].duree);
      }
    }
  }

  //GESTION DES PORTEES DES CAPACITES
  _prepareRangeTranslation(context) {
    const listCapacite = ["changeling", "mechanic"];

    for(let i = 0;i < listCapacite.length;i++) {
      const capacite = context.data.system.capacites.base[listCapacite[i]];
      let evolution = capacite?.evolutions || false;

      capacite.portee = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].portee);

      if(evolution != false) {
        evolution.portee = game.i18n.localize(CONFIG.KNIGHT[listCapacite[i]].portee);
      }
    }
  }
}
