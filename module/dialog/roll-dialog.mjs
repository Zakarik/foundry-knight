import {
  SortByName,
  searchTrueValue,
  getAspectValue,
  getAEValue,
  getCaracValue,
  getODValue,
  getCaracPiloteValue,
  getODPiloteValue,
  getEffets,
  getDistance,
  getStructurelle,
  getOrnementale,
  getCapacite,
  getModuleBonus,
  getModStyle
} from "../helpers/common.mjs";

/**
 * Edit dialog
 * @extends {Dialog}
 */
export class KnightRollDialog extends Application {
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          template: "systems/knight/templates/dialog/roll-sheet.html",
        classes: ["dialog", "knight", "rollDialog"],
        width: 800,
        height:500,
        jQuery: true,
        resizable: true,
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

      const longbow = this.data?.longbow || {};
      const hasLongbow = longbow?.has || false;

      if(hasLongbow) {
        const degats = +longbow.degats.cout;
        const violence = +longbow.violence.cout;
        const portee = +longbow.portee.cout;
        const coutsL1 = +longbow.effets.liste1.cout;
        const coutsL2 = +longbow.effets.liste2.cout;
        const coutsL3 = +longbow.effets.liste3.cout;

        this.data.longbow.energie = degats+violence+portee+coutsL1+coutsL2+coutsL3;
      }

      return {
        idActor:this.data.actor,
        label:this.data.label,
        aspects: this.data.aspects,
        base: this.data.base,
        lock: this.data.lock,
        autre: this.data.autre,
        difficulte:this.data.difficulte,
        modificateur:this.data.modificateur,
        succesBonus:this.data.succesBonus,
        degatsBonus:{
          dice:this.data.degatsBonus?.dice || 0,
          fixe:this.data.degatsBonus?.fixe || 0
        },
        violenceBonus:{
          dice:this.data.violenceBonus?.dice || 0,
          fixe:this.data.violenceBonus?.fixe || 0
        },
        moduleErsatz:this.data.moduleErsatz,
        listWpnContact:this.data.listWpnContact,
        listWpnDistance:this.data.listWpnDistance,
        listWpnTourelle:this.data.listWpnTourelle,
        listGrenades:this.data.listGrenades,
        listWpnImprovisees:this.data.listWpnImprovisees,
        listWpnMA:this.data.listWpnMA,
        listWpnSpecial:this.data.listWpnSpecial,
        longbow:this.data.longbow,
        isWpn:this.data.isWpn,
        idWpn:this.data.idWpn,
        nameWpn:this.data.nameWpn,
        typeWpn:this.data.typeWpn,
        chambredouble:this.data.chambredouble,
        chromeligneslumineuses:this.data.chromeligneslumineuses,
        cadence:this.data.cadence,
        barrage:this.data.barrage,
        systemerefroidissement:this.data.systemerefroidissement,
        guidage:this.data.guidage,
        tenebricide:this.data.tenebricide,
        obliteration:this.data.obliteration,
        cranerieur:this.data.cranerieur,
        tirenrafale:this.data.tirenrafale,
        briserlaresilience:this.data.briserlaresilience,
        jumeleambidextrie:this.data.jumeleambidextrie,
        soeur:this.data.soeur,
        jumelageambidextrie:this.data.jumelageambidextrie,
        style:this.data.style,
        num:this.data.num,
        pnj:this.data.pnj,
        ma:this.data.ma,
        hasWraith:this.data.hasWraith,
        moduleWraith:this.data.moduleWraith,
        ameliorations:{
          subsoniques:this.data.ameliorations.subsoniques,
          nonletales:this.data.ameliorations.nonletales,
          iem:this.data.ameliorations.iem,
          hypervelocite:this.data.ameliorations.hypervelocite,
          drones:this.data.ameliorations.drones,
          explosives:this.data.ameliorations.explosives,
          grappes:this.data.ameliorations.grappes
        },
        deploy:{
          wpnContact:this.data.deploy?.wpnContact || false,
          wpnDistance:this.data.deploy?.wpnDistance || false,
          wpnTourelle:this.data.deploy?.wpnTourelle || false,
          wpnArmesImproviseesContact:this.data.deploy?.wpnArmesImproviseesContact || false,
          wpnArmesImproviseesDistance:this.data.deploy?.wpnArmesImproviseesDistance || false,
          grenades:this.data.deploy?.grenades || false,
          longbow:this.data.deploy?.longbow || false,
          wpnMA:this.data.deploy?.wpnMA || false,
          wpnArmesImprovisees:this.data.deploy?.wpnArmesImprovisees || false,
        },
        noOd:this.data.noOd,
        avDv:this.data.avDv,
        buttons: buttons
      }
    }

  async setLabel(label) {
    this.data.label = label;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.label,
        );
      }, 0);
    });
  }

  async setRoll(base, bonus, lock, difficulte) {
    this.data.base = base;
    this.data.autre = bonus;
    this.data.lock = lock;
    this.data.difficulte = difficulte;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.base,
          this.data.autre,
          this.data.lock,
          this.data.difficulte,
        );
      }, 0);
    });
  }

  async setBonus(modificateur, succesBonus, degatsBonus, violenceBonus) {
    this.data.modificateur = modificateur;
    this.data.succesBonus = succesBonus;
    this.data.degatsBonus = degatsBonus;
    this.data.violenceBonus = violenceBonus;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.modificateur,
          this.data.succesBonus,
          this.data.degatsBonus,
          this.data.violenceBonus,
        );
      }, 0);
    });
  }

  async setWpn(wpnContact, wpnDistance, wpnTourelles, wpnGrenade, wpnImprovisees, wpnMA, wpnLongbow) {
    let longbow = wpnLongbow;

    if(longbow?.effets?.raw || undefined !== undefined) longbow.effets.raw = this.data?.longbow?.effets?.raw || [];

    this.data.listWpnContact = wpnContact;
    this.data.listWpnDistance = wpnDistance;
    this.data.listWpnTourelle = wpnTourelles;
    this.data.listGrenades = wpnGrenade;
    this.data.listWpnImprovisees = wpnImprovisees;
    this.data.longbow = longbow;
    this.data.listWpnMA = wpnMA;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.listWpnContact,
          this.data.listWpnDistance,
          this.data.listWpnTourelle,
          this.data.listGrenades,
          this.data.listWpnImprovisees,
          this.data.longbow,
          this.data.listWpnMA,
        );
      }, 0);
    });
  }

  async setSelected(isWpn, idWpn, nameWpn, typeWpn, num) {
    this.data.isWpn = isWpn;
    this.data.idWpn = idWpn;
    this.data.nameWpn = nameWpn;
    this.data.typeWpn = typeWpn;
    this.data.num = num;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.isWpn,
          this.data.idWpn,
          this.data.nameWpn,
          this.data.typeWpn,
          this.data.num,
        );
      }, 0);
    });
  }

  async setDeploy(deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseeContact, deployWpnImproviseeDistance, deployGrenades, deployLongbow, deployWpnMA) {
    this.data.deploy = {
      wpnContact:deployWpnContact,
      wpnDistance:deployWpnDistance,
      wpnTourelle:deployWpnTourelle,
      wpnArmesImproviseesContact:deployWpnImproviseeContact,
      wpnArmesImproviseesDistance:deployWpnImproviseeDistance,
      grenades:deployGrenades,
      longbow:deployLongbow,
      wpnMA:deployWpnMA,
    };

    this.data.ameliorations = {
      subsoniques:true,
      nonletales:true,
      iem:true,
      hypervelocite:true,
      drones:true,
      explosives:true,
      grappes:true
    };

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.deploy.wpnContact,
          this.data.deploy.wpnDistance,
          this.data.deploy.wpnTourelle,
          this.data.deploy.wpnArmesImproviseesContact,
          this.data.deploy.wpnArmesImproviseesDistance,
          this.data.deploy.grenades,
          this.data.deploy.longbow,
          this.data.deploy.wpnMA,
        );
      }, 0);
    });
  }

  async setWhatIs(isPNJ=false, isMA=false) {
    this.data.pnj = isPNJ;
    this.data.ma = isMA;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.pnj,
          this.data.ma,
        );
      }, 0);
    });
  }

  async setData(label,
    base, bonus, lock, difficulte, modificateur, succesBonus, degatsBonus, violenceBonus,
    wpnContact, wpnDistance, wpnTourelles, wpnGrenade, wpnImprovisees, wpnMA, wpnLongbow,
    isWpn, idWpn, nameWpn, typeWpn, num,
    deployWpnContact, deployWpnDistance, deployWpnTourelle, deployWpnImproviseeContact, deployWpnImproviseeDistance, deployGrenades, deployLongbow, deployWpnMA,
    isPNJ=false, isMA=false) {

    this.data.label = label;

    this.data.base = base;
    this.data.autre = bonus;
    this.data.lock = lock;
    this.data.difficulte = difficulte;

    this.data.pnj = isPNJ;
    this.data.ma = isMA;

    this.data.listWpnContact = wpnContact;
    this.data.listWpnDistance = wpnDistance;
    this.data.listWpnTourelle = wpnTourelles;
    this.data.listGrenades = wpnGrenade;
    this.data.listWpnImprovisees = wpnImprovisees;
    this.data.longbow = wpnLongbow;
    this.data.listWpnMA = wpnMA;

    this.data.isWpn = isWpn;
    this.data.idWpn = idWpn;
    this.data.nameWpn = nameWpn;
    this.data.typeWpn = typeWpn;
    this.data.num = num;

    this.data.deploy = {
      wpnContact:deployWpnContact,
      wpnDistance:deployWpnDistance,
      wpnTourelle:deployWpnTourelle,
      wpnArmesImproviseesContact:deployWpnImproviseeContact,
      wpnArmesImproviseesDistance:deployWpnImproviseeDistance,
      grenades:deployGrenades,
      longbow:deployLongbow,
      wpnMA:deployWpnMA,
    };

    this.data.modificateur = modificateur;
    this.data.succesBonus = succesBonus;
    this.data.degatsBonus = degatsBonus;
    this.data.violenceBonus = violenceBonus;

    this.data.ameliorations = {
      subsoniques:true,
      nonletales:true,
      iem:true,
      hypervelocite:true,
      drones:true,
      explosives:true,
      grappes:true
    };

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.label,
          this.data.base,
          this.data.autre,
          this.data.lock,

          this.data.difficulte,

          this.data.pnj,
          this.data.ma,

          this.data.listWpnContact,
          this.data.listWpnDistance,
          this.data.listWpnTourelle,
          this.data.listGrenades,
          this.data.listWpnImprovisees,
          this.data.longbow,
          this.data.listWpnMA,

          this.data.isWpn,
          this.data.idWpn,
          this.data.nameWpn,
          this.data.typeWpn,
          this.data.num,

          this.data.deploy.wpnContact,
          this.data.deploy.wpnDistance,
          this.data.deploy.wpnTourelle,
          this.data.deploy.wpnArmesImproviseesContact,
          this.data.deploy.wpnArmesImproviseesDistance,
          this.data.deploy.grenades,
          this.data.deploy.longbow,
          this.data.deploy.wpnMA,

          this.data.modificateur,
          this.data.succesBonus,
          this.data.degatsBonus,
          this.data.violenceBonus,
          this.data.ameliorations,
        );
      }, 0);
    });
  }

  async setWpnMA(wpnMA) {
    this.data.listWpnMA = wpnMA;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.listWpnMA
        );
      }, 0);
    });
  }

  async setWpnContact(wpnContact) {
    this.data.listWpnContact = wpnContact;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.listWpnContact
        );
      }, 0);
    });
  }

  async setWpnDistance(wpnDistance) {
    let final = wpnDistance;

    for(let i = 0;i < Object.entries(final).length;i++) {
      const wpnData = final[i].system;
      const wpnMunitions = wpnData?.optionsmunitions || {has:false};
      const wpnMunitionActuel = wpnMunitions?.actuel || "";
      const wpnMunitionsListe = wpnMunitions?.liste?.[wpnMunitionActuel] || {};

      if(wpnMunitions.has) {
        const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
        const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

        final[i].system.effets = {
          raw:[...new Set(eRaw)],
          custom:[...new Set(eCustom)],
        }
      }
    }

    this.data.listWpnDistance = final;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.listWpnDistance
        );
      }, 0);
    });
  }

  async setWpnTourelle(wpnTourelle) {
    let final = wpnTourelle;

    for(let i = 0;i < Object.entries(final).length;i++) {
      const wpnData = final[i].system;
      const wpnMunitions = wpnData?.optionsmunitions || {has:false};
      const wpnMunitionActuel = wpnMunitions?.actuel || "";
      const wpnMunitionsListe = wpnMunitions?.liste?.[wpnMunitionActuel] || {};

      if(wpnMunitions.has) {
        const eRaw = wpnData.effets.raw.concat(wpnMunitionsListe.raw);
        const eCustom = wpnData.effets.custom.concat(wpnMunitionsListe.custom);

        final[i].system.effets = {
          raw:[...new Set(eRaw)],
          custom:[...new Set(eCustom)],
        }
      }
    }

    this.data.listWpnTourelle = final;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.listWpnTourelle
        );
      }, 0);
    });
  }

  async setWpnLongbow(wpnLongbow) {
    let longbow = wpnLongbow;

    longbow.effets.raw = this.data?.longbow?.effets?.raw || []

    this.data.longbow = longbow;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.longbow
        );
      }, 0);
    });
  }

  async setWraith(wraith) {
    this.data.hasWraith = wraith;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.hasWraith
        );
      }, 0);
    });
  }

  async setStyle(style) {
    this.data.style = style;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.style
        );
      }, 0);
    });
  }

  async setActor(actor) {
    this.data.actor = actor;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.actor
        );
      }, 0);
    });
  }

  async setAspects(aspects) {
    this.data.aspects = aspects;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.aspects
        );
      }, 0);
    });
  }

  async setEffets(barrage, jumelageambidextrie, jumeleambidextrie, soeur) {
    this.data.barrage = barrage;
    this.data.jumelageambidextrie = jumelageambidextrie;
    this.data.jumeleambidextrie = jumeleambidextrie;
    this.data.soeur = soeur;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.barrage,
          this.data.jumelageambidextrie,
          this.data.jumeleambidextrie,
          this.data.soeur
        );
      }, 0);
    });
  }

  async setIfOd(hasOd) {
    this.data.noOd = hasOd;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.noOd
        );
      }, 0);
    });
  }

  async addAvDv(AvDv) {
    this.data.avDv = AvDv;

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          this.data.avDv
        );
      }, 0);
    });
  }

    /** @inheritdoc */
  activateListeners(html) {
    html.find(".aspect button").click(this._onSelectCaracteristique.bind(this));
    html.find(".wpn button").click(this._onSelectWpn.bind(this));
    html.find(".grenades button").click(this._onSelectGrenades.bind(this));
    html.find(".longbow button").click(this._onSelectLongbow.bind(this));
    html.find(".special button").click(this._onSelectWpn.bind(this));
    html.find(".longbow div.effets div span").click(this._onSelectEffetsLongbow.bind(this));
    html.find(".special div.effets div span").click(this._onSelectEffetsSpecial.bind(this));
    html.find(".bonus .buttons button").click(this._onSelectCaracStyle.bind(this));
    html.find(".button1").click(this._onClickButton.bind(this));
    html.find(".button2").click(this._onClickEButton.bind(this));
    html.find(".button3").click(this.close.bind(this));

    html.find('.header .far').click(ev => {
      const data = $(ev.currentTarget);
      const deploy = data.data("deploy");
      const value = data.data("value") ? false : true;

      this.data.deploy[deploy] = value;
      this.render(true);
    });

    html.find(".label").change(ev => {
      this.data.label = $(ev.currentTarget).val();
    });

    html.find(".succesBonus").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.succesBonus = value;
    });

    html.find(".modificateur").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.modificateur = value;
    });

    html.find(".degatsBonusDice").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.degatsBonus.dice = value;
    });

    html.find(".degatsBonusFixe").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.degatsBonus.fixe = value;
    });

    html.find(".violenceBonusDice").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.violenceBonus.dice = value;
    });

    html.find(".violenceBonusFixe").change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.violenceBonus.fixe = value;
    });

    html.find("div.wpn span.unselected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const special = type?.data("special") || false;
      const value = type.data("value");

      if(special !== false) {
        this.data[special][effet] = value;
      } else {
        this.data[effet] = value;
      }

      this.render(true)
    });

    html.find("div.wpn span.relanceDgts").click(ev => {
      const cTarget = $(ev.currentTarget);
      const id = cTarget.data("id");
      const type = cTarget.data("type");
      const name = cTarget.data("name");

      this._doRoll(ev, false, false, true, false, id, type, name);
    });

    html.find("div.longbow span.unselected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const special = type?.data("special") || false;
      const value = type.data("value");

      if(special !== false) {
        this.data[special][effet] = value;
      } else {
        this.data[effet] = value;
      }

      this.render(true)
    });

    html.find("div.special span.unselected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const value = type.data("value");
      this.data[effet] = value;

      this.render(true)
    });

    html.find("div.longbow span.relanceDgts").click(ev => {
      const cTarget = $(ev.currentTarget);
      const id = cTarget.data("id");
      const type = cTarget.data("type");
      const name = cTarget.data("name");

      this._doRoll(ev, false, false, true, false, id, type, name);
    });

    html.find("div.grenades span.unselected").click(ev => {
      const type = $(ev.currentTarget);
      const effet = type.data("type");
      const value = type.data("value");
      this.data[effet] = value;

      this.render(true)
    });

    html.find("div.grenades span.relanceDgts").click(ev => {
      const cTarget = $(ev.currentTarget);
      const type = cTarget.data("type");
      const name = cTarget.data("name");

      this._doRoll(ev, false, false, true, false, '', type, name);
    });

    html.find('div.styleCombat > span.info').hover(ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "block");
    }, ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "none");
    });

    html.find('div.styleCombat > span.info').click(ev => {
      const actuel = this.data.style.deploy || false;

      let result = false;

      if(actuel) {
        result = false;
      } else {
        result = true;
      }

      this.data.style.deploy = result;
      this.render(true);
    });

    html.find('button.noOd').click(async ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");

      if(!value) {
        await this.setIfOd(true);
      } else {
        await this.setIfOd(false);
      }

      this.render(true);
    });

    html.find('div.bonus div.pilonnage input').change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.style.tourspasses = value;
    });

    html.find('div.bonus div.puissant input').change(ev => {
      const value = +$(ev.currentTarget).val();

      this.data.style.sacrifice = value;
    });

    html.find('div.bonus select').change(ev => {
      const id = this.data.actor;
      const actor = game.actors.get(id);
      const value = $(ev.currentTarget).val();

      this.data.style.type = value;
      actor.update({[`system.combat.data.type`]:value});

      switch(value) {
        case 'degats':
          this.data.style.maximum = 6;
          break;

        case 'violence':
          this.data.style.maximum = 8;
          break;
      }
    });

    html.find('select.degatsSelected').change(ev => {
      const target = $(ev.currentTarget);
      const value = +target.val();
      const type = target.data("type");
      const num = target.data("num");

      if(type === 'contact') this.data.listWpnContact[num].system.degats.dice = value;
      else if(type === 'distance') this.data.listWpnDistance[num].system.degats.dice = value;
    });

    html.find('select.violenceSelected').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const type = target.data("type");
      const num = target.data("num");

      if(type === 'contact') this.data.listWpnContact[num].system.violence.dice = +value;
      else if(type === 'distance') this.data.listWpnDistance[num].system.violence.dice = +value;
    });

    html.find('select.bonusVariable').change(ev => {
      const target = $(ev.currentTarget);
      const value = +target.val();
      const type = target.data("type");
      const num = target.data("num");
      const typeBonus = target.data("typebonus");
      const fixeOrDice = target.data("fixeordice");
      const variable = target.data("variable");
      const energie = +target.data("energie");
      const actor = game.actors.get(this.data.actor);
      const wpn = {'contact':'listWpnContact', 'distance':'listWpnDistance'}[type]
      const dataWpn = this.data[wpn][num].system[typeBonus].module.variable[variable];
      const paliers = dataWpn.selected.energie.paliers[fixeOrDice].findIndex(element => element === value);
      const module = actor.items.get(dataWpn.id);
      const depense = paliers*energie;
      const update = {
        [`system.bonus.${typeBonus}.variable.selected.${fixeOrDice}`]:value,
        [`system.bonus.${typeBonus}.variable.selected.energie.${fixeOrDice}`]:depense,
      };

      dataWpn.selected[fixeOrDice] = value;
      dataWpn.selected.energie[fixeOrDice] = depense;

      module.update(update);
    });

    html.find('select.choixmain').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const id = this.data.actor;
      const actor = game.actors.get(id);
      const num = target.data("num");
      const listWpnContact = this.data.listWpnContact[num];

      actor.items.get(listWpnContact._id).update({['system.options2mains.actuel']:value});
    });

    html.find('select.choixmunition').change(ev => {
      const target = $(ev.currentTarget);
      const value = target.val();
      const id = this.data.actor;
      const actor = game.actors.get(id);
      const num = target.data("num");
      const listWpnDistance = this.data.listWpnDistance[num];

      actor.items.get(listWpnDistance._id).update({['system.optionsmunitions.actuel']:value});
    });

    html.find('div.longbow div.data div.effets div img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.data").width() / 2;
      const hasListe3 = this.data.longbow.effets.liste3.acces;
      const isListe2 = $(ev.currentTarget).parents("div.effets").hasClass('liste2');
      const wListe2 = $(ev.currentTarget).parents("div.effets").width() / 2;
      let position = "";
      let borderRadius = "border-top-right-radius";

      if(hasListe3) {
        if(isListe2) {
          if($(ev.currentTarget).parent("div").position().left > wListe2) {
            position = "right";
            borderRadius = "border-top-right-radius";
          } else {
            position = "left";
            borderRadius = "border-top-left-radius";
          }
        } else {
          if($(ev.currentTarget).parents("div.effets").position().left > width) {
            position = "right";
            borderRadius = "border-top-right-radius";
          } else {
            position = "left";
            borderRadius = "border-top-left-radius";
          }
        }
      } else {
        if($(ev.currentTarget).parents("div.effets").position().left > width) {
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

    html.find('div.special div.data div.effets div img.info').click(ev => {
      const span = $(ev.currentTarget).siblings("span.hideInfo")
      const width = $(ev.currentTarget).parents("div.data").width() / 2;

      let position = "";
      let borderRadius = "border-top-right-radius";

      if($(ev.currentTarget).parents("div.effets").position().left > width) {
        position = "right";
        borderRadius = "border-top-right-radius";
      } else {
        position = "left";
        borderRadius = "border-top-left-radius";
      }

      span.width($(html).width()/2).css(position, "0px").css(borderRadius, "0px").toggle("display");
      $(ev.currentTarget).toggleClass("clicked");
    });

    html.find('div.longbow div.data select').change(ev => {
      const target = $(ev.currentTarget);
      const type = target.data("type");
      const cost = target.data("cost");
      const value = target.val();

      const data = this.data.longbow[type];
      let min;
      let cout = 0;

      if(type === 'portee') {
        const rangeToNumber = data.rangeToNumber;

        cout = rangeToNumber[value];

        data.value = value;
      } else {
        min = data.min+1;

        for(let i = min;i <= value;i++) {
          cout += cost;
        }

        data.dice = value;
      }

      data.cout = cout;
      this.render(true);
    });

    html.find('div.styleCombat select.selectStyle').change(ev => {
      const style = $(ev.currentTarget).val();
      const id = this.data.actor;
      const actor = game.actors.get(id);

      const update = {
        system: {
          combat:{
            style: style
          }
        }
      };

      actor.update(update);
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
    this._doRoll(event);
  }

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param {MouseEvent} event    The left-mouse click event
   * @private
   */
   _onClickEButton(event) {
    const id = event.currentTarget.dataset.button;
    const button = this.data.buttons[id];
    this._doRoll(event, true);
  }

  async _doRoll(event, entraide=false, attackOnly=false, dgtsOnly=false, violenceOnly=false, wpnId='', wpnType='', wpnName='') {
    const id = this.data.actor;
    const isPNJ = this.data?.pnj || false;
    const isMA = this.data?.ma || false;
    const noOd = this.data?.noOd || false;
    const actor = game.actors.get(id);
    const data = this.data;
    const otherC = [];
    const PNJAE = getAEValue(data.base, id);

    const idWpn = wpnId === '' ? this.data.idWpn : wpnId;
    const nameWpn = wpnName === '' ? this.data.nameWpn : wpnId;
    const typeWpn = wpnType === '' ? this.data.typeWpn : wpnType;
    const numWpn = this.data.num;

    let totalDice = 0;
    let totalBonus = 0;

    let carac = 0;
    let od = 0;

    if(isPNJ) {
      carac = getAspectValue(data.base, id);
      od = Number(PNJAE.mineur)+Number(PNJAE.majeur);
    }
    else if(isMA) {
      carac = getCaracPiloteValue(data.base, id);
      od = !noOd ? getODPiloteValue(data.base, id) : 0;
    }
    else {
      carac = getCaracValue(data.base, id);
      od = !noOd ? getODValue(data.base, id) : 0;
    }

    if(!entraide && !isPNJ) {
      for(let i = 0;i < data.autre.length;i++) {
        if(isMA) {
          carac += getCaracPiloteValue(data.autre[i], id);
          od += !noOd ? getODPiloteValue(data.autre[i], id) : 0;
        } else {
          carac += getCaracValue(data.autre[i], id);
          od += !noOd ? getODValue(data.autre[i], id) : 0;
        }
      }

      data.autre.forEach(function(c) {
        otherC.push(game.i18n.localize(CONFIG.KNIGHT.caracteristiques[c]));
      });
    }

    if((idWpn != '' && !entraide) || (typeWpn === 'grenades' && !entraide) || (typeWpn === 'longbow' && !entraide)) {
      if(typeWpn !== 'tourelle') totalDice += carac || 0;
      if(typeWpn !== 'tourelle' && !noOd && !isPNJ) totalBonus += od || 0;
      else if(typeWpn !== 'tourelle' && isPNJ) totalBonus += od || 0;
      totalDice += data.modificateur || 0;
      totalBonus += data.succesBonus || 0;

      const barrage = this.data.barrage;
      const systemerefroidissement = this.data.systemerefroidissement;

      let wpn;

      switch(typeWpn) {
        case 'base':
        case 'c1':
        case 'c2':
          wpn = this.data.listWpnMA[numWpn];
          break;

        case 'special':
          wpn = this.data.listWpnSpecial[numWpn];
          break;

        case 'contact':
          wpn = this.data.listWpnContact[numWpn].system;
          break;

        case 'distance':
          wpn = this.data.listWpnDistance[numWpn].system;
          break;

        case 'tourelle':
          wpn = this.data.listWpnTourelle[numWpn].system;
          break;

        case 'grenades':
          const nbreGrenade = actor.system.combat.grenades.quantity.value;

          actor.update({['system.combat.grenades.quantity.value']:nbreGrenade-1});

          wpn = this.data.listGrenades[nameWpn];
          break;

        case 'longbow':
          wpn = this.data.longbow;
          break;

        case 'armesimprovisees':
          wpn = this.data.listWpnImprovisees[this.data.idWpn][nameWpn].liste[numWpn];
          break;
      }

      const energieSpecial = +wpn?.energie || 0;
      const espoirSpecial = +wpn?.espoir || 0;
      const otherWpnAttEffet = [];
      const listAllE = await this._getAllEffets (actor, wpn, typeWpn, isPNJ);
      const totalDepenseEnergie = listAllE.depenseEnergie+energieSpecial;

      let nRoll = listAllE.nRoll;
      let onlyDgts = dgtsOnly == false ? listAllE.onlyDgts : dgtsOnly;
      let onlyViolence = violenceOnly == false ? listAllE.onlyViolence : violenceOnly;
      let onlyAttack = attackOnly === false ? listAllE.onlyAttack : attackOnly;
      let barrageValue = listAllE.barrageValue;

      if(typeWpn !== 'tourelle' && !isPNJ) totalDice += getCaracValue(data.style.selected, id);

      if(typeWpn === 'tourelle') {
        totalDice += +wpn.tourelle.attaque.dice;
        totalBonus += +wpn.tourelle.attaque.fixe;
      }

      if(totalDepenseEnergie > 0) {
        const depense = this._depensePE(actor, totalDepenseEnergie);

        if(!depense.has) {
          const msgEnergie = {
            flavor:`${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}`,
            main:{
              total:`${game.i18n.localize(`KNIGHT.JETS.Not${depense.type}`)}`
            }
          };

          const msgEnergieData = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEnergie),
            sound: CONFIG.sounds.dice
          };

          ChatMessage.create(msgEnergieData);

          return;
        }
        otherWpnAttEffet.push(
          {
            name:`${game.i18n.localize(`KNIGHT.JETS.Depense${depense.type}`)} (${totalDepenseEnergie})`,
            desc:''
          }
        );
      }

      if(espoirSpecial > 0) {
        const depenseEspoir = this._depenseEspoir(actor, espoirSpecial);

        if(!depenseEspoir.has) {
          const msgEspoir = {
            flavor:`${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}`,
            main:{
              total:`${game.i18n.localize(`KNIGHT.JETS.Notespoir`)}`
            }
          };

          const msgEspoirData = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: await renderTemplate('systems/knight/templates/dices/wpn.html', msgEspoir),
            sound: CONFIG.sounds.dice
          };

          ChatMessage.create(msgEspoirData);

          return;
        }
        otherWpnAttEffet.push(
          {
            name:`${game.i18n.localize(`KNIGHT.JETS.Depenseespoir`)} (${espoirSpecial})`,
            desc:''
          }
        );
      }

      for(let i = 0; i < nRoll;i++) {
        const addNum = nRoll > 1 ? ` n°${i+1}` : ``;
        let regularite = 0;
        let bonusViolence = 0;

        if(nRoll > 1 && !onlyAttack && !onlyDgts && !onlyViolence) {
          const rollMsgData = {
            user: game.user.id,
            speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
            },
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: `<span style="display:block;width:100%;font-weight:bold;text-align:center;">--- ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}${addNum} ---</span>`
          };

          const rMode = game.settings.get("core", "rollMode");
          const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);

          await ChatMessage.create(msgData, {
            rollMode:rMode
          });
        }

        if(!onlyDgts || !onlyViolence) {
          totalDice += listAllE.attack.totalDice;
          totalBonus += listAllE.attack.totalBonus;

          if(totalDice <= 0) totalDice = 1;

          const attack = await this._doAttack(actor, data, wpn, otherC, carac, od, wpn?.capacite || false, totalDice, totalBonus, listAllE, addNum, barrage, systemerefroidissement, barrageValue, otherWpnAttEffet);

          regularite += attack.regularite;
        }

        if(!onlyAttack) {
          if(!onlyViolence) { await this._doDgts(actor, wpn, typeWpn, listAllE, regularite, addNum); }

          if(!onlyDgts) { await this._doViolence(actor, wpn, typeWpn, listAllE, bonusViolence, addNum); }
        }
      }
    } else {
      totalDice += carac || 0;

      if(!noOd && !isPNJ) {
        totalBonus += od || 0;
      } else if(isPNJ) {
        totalBonus += od || 0;
      }

      totalDice += data.modificateur || 0;
      totalBonus += data.succesBonus || 0;

      const capacite = isPNJ ? {roll:{fixe:0, string:''}} : await getCapacite(actor, '', data.base, data.autre, id, {raw:[], custom:[], liste:[]}, {raw:[], custom:[], liste:[]}, {raw:[], custom:[], liste:[]}, {raw:[], custom:[], liste:[]});

      totalBonus += capacite.roll.fixe;

      let sDetails;

      if(isPNJ) {
        sDetails = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Aspects')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ASPECTS.Exceptionnels')}) + ${data.succesBonus} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`
      } else if(noOd) {
        sDetails = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${data.succesBonus} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`;
      } else {
        sDetails = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ITEMS.ARMURE.Overdrive')}) + ${data.succesBonus} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`;
      }

      if(capacite.roll.string !== '') sDetails += ` +${capacite.roll.string}`;

      const exec = new game.knight.RollKnight(`${totalDice}d6+${totalBonus}`, actor.system);
      exec._success = true;
      exec._flavor = this.data.label;
      exec._base = isPNJ ? game.i18n.localize(CONFIG.KNIGHT.aspects[data.base]) : game.i18n.localize(CONFIG.KNIGHT.caracteristiques[data.base]);
      exec._autre = otherC;
      exec._difficulte = this.data.difficulte;
      exec._details = sDetails;
      await exec.toMessage({
        speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
        }
      });

      const withTable = this.data.withTable;
      const rTableLabel = this.data.rTableLabel;

      if(withTable && this.data.difficulte != false && !exec._isRollSuccess) {
        const rTable = new game.knight.RollKnight('2d6', actor.system);
        rTable._flavor = rTableLabel;
        rTable._success = false;
        rTable._table = true;
        rTable._tableau = this.data.tableau;

        await rTable.toMessage({
          speaker: {
          actor: actor?.id || null,
          token: actor?.token?.id || null,
          alias: actor?.name || null,
          }
        });
      }
    }
  }

  async _doAttack(actor, data, localDataWpn, otherC, carac, od, isCapacite=false, totalDice=0, totalBonus=0, listAllE, addNum='', isBarrage, isSystemeRefroidissement, barrageValue=0, addOtherEffects=[]) {
    const isPNJ = this.data?.pnj || false
    const wpnType = this.data.typeWpn
    const avDv = this.data.avDv;
    const lAvantages = avDv?.avantages || []
    const lInconvenient = avDv?.inconvenient || []
    const avantages = [];
    const inconvenient = [];

    const execAtt = new game.knight.RollKnight(`${totalDice}d6+${totalBonus}`, actor.system);
    execAtt._success = true;
    if(wpnType !== 'tourelle' && !isPNJ) {
      execAtt._base = game.i18n.localize(CONFIG.KNIGHT.caracteristiques[data.base]);
      execAtt._autre = otherC;
    } else if(isPNJ) {
      execAtt._base = game.i18n.localize(CONFIG.KNIGHT.aspects[data.base]);
    }

    let details = '';

    if(wpnType === 'tourelle') {
      details = `${totalDice}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 + ${totalBonus}`;
    } else if(isPNJ) {
      details = `${carac}d6 (${game.i18n.localize('KNIGHT.ITEMS.Aspects')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ASPECTS.Exceptionnels')}) + ${totalBonus-od} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`
    } else {
      details = `${carac}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 (${game.i18n.localize('KNIGHT.ITEMS.Caracteristique')}) + ${data.modificateur}d6 (${game.i18n.localize('KNIGHT.JETS.Modificateur')}) + ${od} (${game.i18n.localize('KNIGHT.ITEMS.ARMURE.Overdrive')}) + ${totalBonus-od} (${game.i18n.localize('KNIGHT.BONUS.Succes')})`;
    }

    execAtt._difficulte = data.difficulte;
    execAtt._pairOrImpair = listAllE.guidage ? 1 : 0;
    execAtt._details = details;
    await execAtt.evaluateSuccess();

    let caracs = [execAtt._base].concat(execAtt._autre)[0] === '' ? [] : [execAtt._base].concat(execAtt._autre);
    if(caracs[0] === undefined) { caracs = ''; }
    let pAttack = {};

    for(let i = 0;i < lAvantages.length;i++) {
      const data = avDv.avantages[i];

      if(data.system.show) {
        avantages.push({
          name:data.name,
          desc:data.system.description
        });
      }
    }

    for(let i = 0;i < lInconvenient.length;i++) {
      const data = avDv.inconvenient[i];

      if(data.system.show) {
        inconvenient.push({
          name:data.name,
          desc:data.system.description
        });
      }
    }

    const style = isPNJ ? {selected:''} : data.style;
    const eSub = listAllE.attack.list;
    const eInclude = listAllE.attack.include;
    const other = listAllE.other.concat(addOtherEffects).sort(SortByName);
    let portee;

    if(isCapacite) {
      portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${localDataWpn.portee}`;
    } else if((wpnType === 'grenades' && !isPNJ) || (wpnType === 'armesimprovisees' && !isPNJ)) {
      const idActor = this.data.actor;
      const force = getODValue('force', idActor);

      switch(force) {
        case 0:
          portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Courte`)}`;
          break;

        case 1:
          portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Moyenne`)}`;
          break;

        case 2:
          portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Longue`)}`;
          break;

        default:
          portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.Lointaine`)}`;
          break;
      }
    } else if(wpnType === 'longbow') {
      portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.${localDataWpn.portee.value.charAt(0).toUpperCase()+localDataWpn.portee.value.substr(1)}`)}`;
    } else if((wpnType === 'grenades' && isPNJ) || (wpnType === 'armesimprovisees' && isPNJ)) {
      portee = ``;
    } else {
      portee = `${game.i18n.localize(`KNIGHT.PORTEE.Label`)} ${game.i18n.localize(`KNIGHT.PORTEE.${localDataWpn.portee.charAt(0).toUpperCase()+localDataWpn.portee.substr(1)}`)}`;
    }

    if(style.selected && wpnType !== 'tourelle' && !isPNJ) eInclude.unshift({
      name:`+${getCaracValue(style.selected, data.actor)}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize(CONFIG.KNIGHT.caracteristiques[style.selected])} ${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
      desc:style.info
    });

    const isSuccess = execAtt._success;

    if(!isBarrage && !isSystemeRefroidissement) {
      pAttack = {
        flavor:`${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}${addNum}`,
        main:{
          isSuccess:isSuccess,
          isExploit:execAtt._isExploit,
          total:execAtt._totalSuccess,
          tooltip:await execAtt.getTooltip(),
          isRollSuccess:execAtt._isRollSuccess,
          isRollFailed:execAtt._isRollFailed,
          isRollEFailed:execAtt._isEFail,
          details:execAtt._details,
          formula: execAtt._formula,
          caracs: wpnType !== 'tourelle' ? caracs : false,
          isAttack:true,
          portee:portee
        },
        sub:eSub,
        include:eInclude,
        other:other,
        avantages:avantages,
        inconvenient:inconvenient
      };

      if(wpnType !== 'tourelle' && !isPNJ) pAttack.style = `${style.fulllabel}`;
    } else {
      const barrageLabel = isBarrage ? `${game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label')} ${barrageValue}` : `${game.i18n.localize('KNIGHT.AMELIORATIONS.SYSTEMEREFROIDISSEMENT.Label')} (${game.i18n.localize('KNIGHT.EFFETS.BARRAGE.Label')} ${barrageValue})`
      pAttack = {
        flavor:`${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Attaque')}${addNum}`,
        main:{
          total:barrageLabel
        }
      };
    }

    let rolls = execAtt;

    if(execAtt._pRolls.length !== 0) {
      const pRolls = execAtt._pRolls[0].map(function(objet) {
        return { ...objet, active: true };
      });

      rolls.dice[0].results = rolls.dice[0].results.concat(pRolls);
    }

    const attackMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls:[rolls],
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pAttack),
      sound: CONFIG.sounds.dice
    };

    const rMode = game.settings.get("core", "rollMode");
    const msgData = ChatMessage.applyRollMode(attackMsgData, rMode);

    await ChatMessage.create(msgData, {
      rollMode:rMode
    });

    const six = listAllE.regularite ? execAtt.getSix() : 0;

    return {
      regularite:six*3
    };
  }

  async _doDgts(actor, dataWpn, wpnType, listAllEffets, regularite=0, addNum='') {
    const isPNJ = this.data?.pnj || false
    const style = isPNJ ? {raw:''} : this.data.style;

    //DEGATS
    const tenebricide = this.data.tenebricide;
    const bourreau = listAllEffets.bourreau;
    const bourreauValue = listAllEffets.bourreauValue;

    const dgtsDice = dataWpn?.degats?.dice || 0;
    const dgtsFixe = dataWpn?.degats?.fixe || 0;

    let diceDgts = +dgtsDice;
    let bonusDgts = +dgtsFixe;
    diceDgts += +listAllEffets.degats.totalDice;
    bonusDgts += +listAllEffets.degats.totalBonus;
    diceDgts += +this.data.degatsBonus.dice;
    bonusDgts += +this.data.degatsBonus.fixe;

    if(style.raw === 'akimbo') {
      diceDgts += diceDgts;
    }

    bonusDgts += regularite;

    const labelDgt = `${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Degats')}${addNum}`;
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

    const rMode = game.settings.get("core", "rollMode");

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
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls:[execDgt].concat(listAllEffets.rollDgts),
      content: await renderTemplate('systems/knight/templates/dices/wpn.html', pDegats),
      sound: CONFIG.sounds.dice
    };

    const msgData = ChatMessage.applyRollMode(dgtsMsgData, rMode);

    await ChatMessage.create(msgData, {
      rollMode:rMode
    });
  }

  async _doViolence(actor, dataWpn, wpnType, listAllEffets, bViolence=0, addNum='') {
    const isPNJ = this.data?.pnj || false
    const style = isPNJ ? {raw:''} : this.data.style;

    //VIOLENCE
    const tenebricide = this.data.tenebricide;
    const devastation = listAllEffets.devastation;
    const devastationValue = listAllEffets.devastationValue;

    const violenceDice = dataWpn?.violence?.dice || 0;
    const violenceFixe = dataWpn?.violence?.fixe || 0;

    let diceViolence = +violenceDice;
    let bonusViolence = +violenceFixe;
    diceViolence += +listAllEffets.violence.totalDice;
    bonusViolence += +listAllEffets.violence.totalBonus;
    diceViolence += +this.data.violenceBonus.dice;
    bonusViolence += +this.data.violenceBonus.fixe;

    if((actor.type !== 'knight' && actor.type !== 'pnj' && actor.type !== 'mechaarmure' && actor.type !== 'vehicule' && diceViolence === 0 && bonusViolence === 0)) {}
    else {
      if(style.raw === 'akimbo') {
        diceViolence += Math.ceil(diceViolence/2);
      }

      bonusViolence += bViolence;

      const labelViolence = `${this.data.label} : ${game.i18n.localize('KNIGHT.AUTRE.Violence')}${addNum}`;
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
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls:[execViolence].concat(listAllEffets.rollViol),
        content: await renderTemplate('systems/knight/templates/dices/wpn.html', pViolence),
        sound: CONFIG.sounds.dice
      };

      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(violenceMsgData, rMode);

      await ChatMessage.create(msgData, {
        rollMode:rMode
      });
    }
  }

  async _getAllEffets(actor, dataWpn, typeWpn, isPNJ = false) {
    const idActor = this.data.actor;
    const idWpn = this.data?.idWpn || -1;
    const data = this.data;
    const style = isPNJ ? {raw:''} : this.data.style;
    const getStyle = isPNJ ? {} : getModStyle(style.raw);
    const options2mains = dataWpn?.options2mains || false;

    let effetsWpn = typeWpn === 'longbow' ? {raw:dataWpn.effets.base.raw.concat(dataWpn.effets.raw), custom:dataWpn.effets.base.custom.concat(dataWpn.effets.custom)} : dataWpn.effets;

    if(typeWpn === 'contact' && options2mains !== false) {
      if(options2mains.has && options2mains.actuel === '2main') {effetsWpn = dataWpn.effets2mains;}
    }

    const capaciteName = dataWpn?.capaciteName || "";
    const distanceWpn = dataWpn?.distance || {raw:[], custom:[]};
    const ornementalesWpn = dataWpn?.ornementales || {raw:[], custom:[]};
    const structurellesWpn = dataWpn?.structurelles || {raw:[], custom:[]};

    let energieDgts = 0;
    let energieViolence = 0;
    const hasVariableDgts = dataWpn.degats?.variable?.has || false;
    const hasVariableViolence = dataWpn.violence?.variable?.has || false;
    const hasAddChair = dataWpn.degats?.addchair || false;

    if(hasVariableDgts !== false) {
      energieDgts = dataWpn.degats.dice > dataWpn.degats.variable.min.dice ? (dataWpn.degats.dice-dataWpn.degats.variable.min.dice)*dataWpn.degats.variable.cout : 0;
    }

    if(hasVariableViolence !== false) {
      energieViolence = dataWpn.violence.dice > dataWpn.violence.variable.min.dice ? (dataWpn.violence.dice-dataWpn.violence.variable.min.dice)*dataWpn.violence.variable.cout : 0;
    }

    const bonusModule = getModuleBonus(actor, idActor, typeWpn, dataWpn, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, isPNJ);

    //ENERGIE DES MODULES
    energieDgts += bonusModule?.degats?.energie || 0;
    energieViolence += bonusModule?.violence?.energie || 0;

    const listEffets = await getEffets(actor, typeWpn, style.raw, data, effetsWpn, distanceWpn, structurellesWpn, ornementalesWpn, isPNJ, energieDgts+energieViolence);
    const listDistance = await getDistance(actor, typeWpn, data, effetsWpn, distanceWpn, isPNJ);
    const listStructurelles = await getStructurelle (actor, typeWpn, style.raw, data, effetsWpn, structurellesWpn, isPNJ);
    const listOrnementale = await getOrnementale (actor, typeWpn, data, effetsWpn, ornementalesWpn, isPNJ);
    const listCapacites = await getCapacite(actor, typeWpn, data.base, data.autre, idActor, effetsWpn, structurellesWpn, ornementalesWpn, distanceWpn, isPNJ, idWpn);

    const lEffetAttack = listEffets.attack;
    const lEffetDegats = listEffets.degats;
    const lEffetViolence = listEffets.violence;
    const lEffetOther = listEffets.other;

    const lDistanceAttack = listDistance.attack;
    const lDistanceDegats = listDistance.degats;
    const lDistanceViolence = listDistance.violence;
    const lDistanceOther = listDistance.other;

    const lOrnementaleAttack = listOrnementale.attack;
    const lOrnementaleDegats = listOrnementale.degats;
    const lOrnementaleViolence = listOrnementale.violence;
    const lOrnementaleOther = listOrnementale.other;

    const lStructurellesAttack = listStructurelles.attack;
    const lStructurellesDegats = listStructurelles.degats;
    const lStructurellesViolence = listStructurelles.violence;
    const lStructurellesOther = listStructurelles.other;

    const lCapaciteAttack = listCapacites.attack;
    const lCapaciteDegats = listCapacites.degats;
    const lCapaciteViolence = listCapacites.violence;

    const lAttOtherInclude = [];
    const lDgtsOtherInclude = [];
    const lDgtsOtherList = [];
    const lViolenceOtherInclude = [];

    const typeStyle = style.type;
    const sacrificeStyle = +style.sacrifice;

    let rollAtt = [].concat(listEffets.rollAtt, listDistance.rollAtt, listStructurelles.rollAtt, listOrnementale.rollAtt);
    let rollDgts = [].concat(listEffets.rollDgts, listDistance.rollDgts, listStructurelles.rollDgts, listOrnementale.rollDgts);
    let rollViol = [].concat(listEffets.rollViol, listDistance.rollViol, listStructurelles.rollViol, listOrnementale.rollViol);

    let getAttackOtherDiceMod = isPNJ || (capaciteName === 'cea' && style.raw === 'ambidextre') || typeWpn === 'tourelle' ? 0 : getStyle.bonus.attaque-getStyle.malus.attaque;
    let getAttackSpecialDiceMod = 0;
    let getDgtsOtherDiceMod = 0;
    let getDgtsOtherFixeMod = 0;
    let getViolenceDiceMod = 0;
    let maximizeDgts = false;

    const baseForce = getCaracValue('force', idActor);
    const force = getODValue('force', idActor);
    const tir = getODValue('tir', idActor);
    const combat = getODValue('combat', idActor);
    const discretion = getCaracValue('discretion', idActor);
    const discretionOD = getODValue('discretion', idActor);

    const chair = +getAspectValue('chair', idActor);
    const bete = +getAspectValue('bete', idActor);
    const beteAE = getAEValue('bete', idActor);

    // Base de Force pour les armes de contact
    if((typeWpn === 'contact' && baseForce > 0 && !isPNJ && capaciteName !== "cea") || (typeWpn === 'armesimprovisees' && this.data.idWpn === 'contact' && baseForce > 0 && !isPNJ && capaciteName !== "cea")) {
      const bForce = baseForce;
      getDgtsOtherFixeMod += bForce;

      lDgtsOtherInclude.push({
        name:`+${bForce} ${game.i18n.localize('KNIGHT.ASPECTS.CHAIR.CARACTERISTIQUES.FORCE.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    }

    // Si on doit ajouter chair divisé par 2... On ajoute chair divisé par 2.
    if((typeWpn === 'contact' && isPNJ && hasAddChair && chair > 0) || (typeWpn === 'armesimprovisees' && this.data.idWpn === 'contact' && chair > 0 && isPNJ && hasAddChair)) {
      getDgtsOtherFixeMod += Math.floor(chair/2);

      lDgtsOtherInclude.push({
        name:`+${chair/2} ${game.i18n.localize('KNIGHT.ASPECTS.CHAIR.Label')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    }

    // STYLES
    if(typeWpn !== 'tourelle' && typeWpn !== 'armesimprovisees' && !isPNJ) {
      // AKIMBO
      const eAkimbo = effetsWpn.raw.find(str => { if(str.includes('jumeleakimbo')) return true; }) !== undefined ? true : false;
      const jumelageakimbo = typeWpn === 'distance' ? distanceWpn.raw.find(str => { if(str.includes('jumelageakimbo')) return true; }) : false;
      const jumelle = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('jumelle')) return true; }) : false;
      const eJAkimbo = searchTrueValue([eAkimbo, jumelageakimbo, jumelle]);

      if(style.raw === 'akimbo') {
        if(eJAkimbo) getAttackOtherDiceMod += 2;
        else if(typeWpn === 'distance' && tir >= 3) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODTir3')}`,
            desc:''
          });
        }
        else if(typeWpn === 'contact' && combat >= 3) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODCombat3')}`,
            desc:''
          });
        }
      }

      // AMBIDEXTRIE
      const eAmbidextrie = effetsWpn.raw.find(str => { if(str.includes('jumeleambidextrie')) return true; });
      const jumelageambidextrie = typeWpn === 'distance' ? distanceWpn.raw.find(str => { if(str.includes('jumelageambidextrie')) return true; }) : false;
      const soeur = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('soeur')) return true; }) : false;

      if(style.raw === 'ambidextre' && capaciteName !== 'cea') {
        if((eAmbidextrie && data.jumeleambidextrie)) getAttackOtherDiceMod += 2;
        else if(jumelageambidextrie && data.jumelageambidextrie) getAttackOtherDiceMod += 2;
        else if(soeur && data.soeur) getAttackOtherDiceMod += 2;
        else if(typeWpn === 'distance' && tir >= 4) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODTir4')}`,
            desc:''
          });
        }
        else if(typeWpn === 'contact' && combat >= 4) {
          getAttackOtherDiceMod += 2;
          lAttOtherInclude.push({
            name:`${game.i18n.localize('KNIGHT.JETS.ODCombat4')}`,
            desc:''
          });
        }
      }

      // DEFENSIF
      const protectrice = typeWpn === 'contact' ? structurellesWpn.raw.find(str => { if(str.includes('protectrice')) return true; }) : false;

      if(style.raw === 'defensif' && protectrice) getAttackOtherDiceMod += 2;

      // A COUVERT
      const eTirEnSecurite = effetsWpn.raw.find(str => { if(str.includes('tirensecurite')) return true; });
      const interfaceGuidage = typeWpn === 'distance' ? distanceWpn.raw.find(str => { if(str.includes('interfaceguidage')) return true; }) : false;
      const eTSecurite = searchTrueValue([eTirEnSecurite, interfaceGuidage]);

      if(style.raw === 'acouvert' && eTSecurite) getAttackOtherDiceMod += 3;

      // PILONNAGE
      if(style.raw === 'pilonnage') {
        const valuePilonnage = Math.min(6, +style.tourspasses-1);

        switch(typeStyle) {
          case 'degats':
            lDgtsOtherInclude.push({
              name:`+${valuePilonnage}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getDgtsOtherDiceMod += valuePilonnage;
            break;

          case 'violence':
            lViolenceOtherInclude.push({
              name:`+${valuePilonnage}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getViolenceDiceMod += valuePilonnage;
            break;
        }
      }

      // PUISSANT
      if(style.raw === 'puissant') {
        getAttackOtherDiceMod -= sacrificeStyle;

        switch(typeStyle) {
          case 'degats':
            lDgtsOtherInclude.push({
              name:`+${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getDgtsOtherDiceMod += sacrificeStyle;
            break;

          case 'violence':
            lViolenceOtherInclude.push({
              name:`+${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:''
            });

            getViolenceDiceMod += sacrificeStyle;
            break;
        }
      }

      // SUPPRESSION
      if(style.raw === 'suppression') {
        switch(typeStyle) {
          case 'degats':
            lDgtsOtherInclude.push({
              name:`-${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.SUPPRESSION.Info-short-degats')}`
            });

            getDgtsOtherDiceMod -= sacrificeStyle;
            break;

          case 'violence':
            lViolenceOtherInclude.push({
              name:`-${sacrificeStyle}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
              desc:`${game.i18n.localize('KNIGHT.COMBAT.STYLES.SUPPRESSION.Info-short-violence')}`
            });

            getViolenceDiceMod -= sacrificeStyle;
            break;
        }
      }
    }

    // OD Force
    if(typeWpn === 'contact' && force > 0 && !isPNJ && capaciteName !== "cea") {
      const bVForce = force*3;
      getDgtsOtherFixeMod += bVForce;

      lDgtsOtherInclude.push({
        name:`+${bVForce} ${game.i18n.localize('KNIGHT.JETS.ODForce')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    } else if(typeWpn === 'armesimprovisees' && this.data.idWpn === 'contact' && !isPNJ && !this.data.ma) {
      const bVForce = force*3;
      getDgtsOtherFixeMod += bVForce;

      lDgtsOtherInclude.push({
        name:`+${bVForce} ${game.i18n.localize('KNIGHT.JETS.ODForce')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });
    }

    // OD Discrétion
    if(typeWpn !== 'tourelle' && !isPNJ) {
      if(discretionOD >= 2 && discretionOD < 5) {
        lDgtsOtherList.push({
          name:`+${game.i18n.localize('KNIGHT.JETS.ODDiscretion')}`,
          total:`${discretion}`,
          desc:`${game.i18n.localize('KNIGHT.JETS.AttaqueSurprise')}`
        });
      } else if(discretionOD >= 5) {
        lDgtsOtherList.push({
          name:`+${game.i18n.localize('KNIGHT.JETS.ODDiscretion')}`,
          total:`${discretion+discretionOD}`,
          desc:`${game.i18n.localize('KNIGHT.JETS.AttaqueSurprise')}`
        });
      }
    }

    // MECHAARMURE
    if((typeWpn === 'base' && this.data.ma) || (typeWpn === 'c1' && this.data.ma) || (typeWpn === 'c2' && this.data.ma) || (typeWpn === 'armesimprovisees' && this.data.ma)) {
      const actor = game.actors.get(idActor);
      const puissance = +actor.system.puissance.value;
      getAttackSpecialDiceMod += puissance;

      lAttOtherInclude.push({
        name:`+${puissance}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize('KNIGHT.MECHAARMURE.Puissance')} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:``
      });

      const modulesBase = actor.system.configurations.liste.base.modules;
      const modulesC1 = actor.system.configurations.liste.c1.modules;
      const modulesC2 = actor.system.configurations.liste.c2.modules;

      for (let [key, module] of Object.entries(modulesBase)) {
        switch(key) {
          case 'moduleWraith':
            if(module.active) {
              getAttackSpecialDiceMod += discretion+discretionOD;
              getDgtsOtherFixeMod += discretion;

              lAttOtherInclude.push({
                name:`+${discretion+discretionOD}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              lDgtsOtherInclude.push({
                name:`+${discretion}  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              if(this.data.moduleWraith) {
                maximizeDgts = true;
              }
            }
            break;
        }
      };

      for (let [key, module] of Object.entries(modulesC1)) {

        switch(key) {
          case 'moduleWraith':
            if(module.active) {
              getAttackSpecialDiceMod += discretion+discretionOD;
              getDgtsOtherFixeMod += discretion;

              lAttOtherInclude.push({
                name:`+${discretion+discretionOD}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              lDgtsOtherInclude.push({
                name:`+${discretion}  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              if(this.data.moduleWraith) {
                maximizeDgts = true;
              }
            }
            break;
        }
      };

      for (let [key, module] of Object.entries(modulesC2)) {
        switch(key) {
          case 'moduleWraith':
            if(module.active) {
              getAttackSpecialDiceMod += discretion+discretionOD;
              getDgtsOtherFixeMod += discretion;

              lAttOtherInclude.push({
                name:`+${discretion+discretionOD}${game.i18n.localize('KNIGHT.JETS.Des-short')}6  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              lDgtsOtherInclude.push({
                name:`+${discretion}  ${game.i18n.localize(`KNIGHT.MECHAARMURE.MODULES.MODULEWRAITH.Label`)} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
                desc:``
              });

              if(this.data.moduleWraith) {
                maximizeDgts = true;
              }
            }
            break;
        }
      };
    }

    // Aspects Exceptionnels
    if(typeWpn !== 'tourelle' && isPNJ && typeWpn === 'contact') {
      const bAEMajeur = +beteAE.majeur;
      const bAEMineur = +beteAE.mineur;

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
    }

    // ATTAQUE
    const attackDice = lEffetAttack.totalDice+lDistanceAttack.totalDice+lStructurellesAttack.totalDice+lOrnementaleAttack.totalDice+lCapaciteAttack.dice+bonusModule.attack.dice+getAttackOtherDiceMod+getAttackSpecialDiceMod;
    const attackBonus = lEffetAttack.totalBonus+lDistanceAttack.totalBonus+lStructurellesAttack.totalBonus+lOrnementaleAttack.totalBonus+lCapaciteAttack.fixe+bonusModule.attack.fixe;
    const attackInclude = lEffetAttack.include.concat(lDistanceAttack.include, lStructurellesAttack.include, lOrnementaleAttack.include, lAttOtherInclude, lCapaciteAttack.include, bonusModule.attack.include);
    const attackList = lEffetAttack.list.concat(lDistanceAttack.list, lStructurellesAttack.list, lOrnementaleAttack.list, lCapaciteAttack.list);

    // DEGATS
    const degatsDice = lEffetDegats.totalDice+lDistanceDegats.totalDice+lStructurellesDegats.totalDice+lOrnementaleDegats.totalDice+lCapaciteDegats.dice+bonusModule.degats.dice+getDgtsOtherDiceMod;
    const degatsBonus = lEffetDegats.totalBonus+lDistanceDegats.totalBonus+lStructurellesDegats.totalBonus+lOrnementaleDegats.totalBonus+lCapaciteDegats.fixe+bonusModule.degats.fixe+getDgtsOtherFixeMod;
    const degatsInclude = lEffetDegats.include.concat(lDistanceDegats.include, lStructurellesDegats.include, lOrnementaleDegats.include, lDgtsOtherInclude, lCapaciteDegats.include, bonusModule.degats.include);
    const degatsList = lEffetDegats.list.concat(lDistanceDegats.list, lStructurellesDegats.list, lOrnementaleDegats.list, lDgtsOtherList, lCapaciteDegats.list);
    const minMaxDgts = maximizeDgts ? {
      minimize:false,
      maximize:true,
      async:true} : lEffetDegats.minMax;

    // VIOLENCE
    const violenceDice = lEffetViolence.totalDice+lDistanceViolence.totalDice+lStructurellesViolence.totalDice+lOrnementaleViolence.totalDice+lCapaciteViolence.dice+bonusModule.violence.dice+getViolenceDiceMod;
    const violenceBonus = lEffetViolence.totalBonus+lDistanceViolence.totalBonus+lStructurellesViolence.totalBonus+lOrnementaleViolence.totalBonus+lCapaciteViolence.fixe+bonusModule.violence.fixe;
    const violenceInclude = lEffetViolence.include.concat(lDistanceViolence.include, lStructurellesViolence.include, lOrnementaleViolence.include, lViolenceOtherInclude, lCapaciteViolence.include, bonusModule.violence.include);
    const violenceList = lEffetViolence.list.concat(lDistanceViolence.list, lStructurellesViolence.list, lOrnementaleViolence.list, lCapaciteViolence.list);
    const minMaxViolence = lEffetViolence.minMax;

    // AUTRE
    const other = lEffetOther.concat(lDistanceOther, lStructurellesOther, lOrnementaleOther);

    // STYLE
    if(getAttackOtherDiceMod > 0) {
      attackInclude.push({
        name:`+${getAttackOtherDiceMod}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:''
      });
    } else if(getAttackOtherDiceMod < 0) {
      attackInclude.push({
        name:`${getAttackOtherDiceMod}${game.i18n.localize('KNIGHT.JETS.Des-short')}6 ${style.fulllabel} (${game.i18n.localize('KNIGHT.AUTRE.Inclus')})`,
        desc:''
      });
    }

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

    const nRoll = Math.max(listEffets.nRoll, listDistance.nRoll, listStructurelles.nRoll, listOrnementale.nRoll);

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
      other:merge.other,
      rollAtt:rollAtt,
      rollDgts:rollDgts,
      rollViol:rollViol,
    };

    return result;
  }

  _onSelectCaracteristique(event) {
    const target = $(event.currentTarget);
    const select = target.data("select");
    const isPNJ = this.data.pnj;

    if(isPNJ) {
      if(target.hasClass('base')) {
        this.data.base = '';
      } else {
        this.data.base = select;
      }
    } else {
      const lock = this.data.lock;
      const autre = this.data.autre;

      if(!target.hasClass('lock')) {
        if(target.hasClass('base')) {
          if(autre.length > 0) {
            const nAutre = [];
            let nBase = '';

            for(let i = 0;i < autre.length;i++) {
              if(lock.includes(autre[i])) {
                nAutre.push(autre[i]);
              } else if(nBase === '') {
                nBase = autre[i];
              } else {
                nAutre.push(autre[i]);
              }
            }

            this.data.base = nBase;
            this.data.autre = nAutre;
          } else {
            this.data.base = '';
          }
        } else if(target.hasClass('selected')) {
          this.data.autre = autre.filter(carac => carac != select);
        } else if(this.data.base === '' && !autre.includes(select)) {
          this.data.base = select;
        } else if(this.data.base !== '' && !autre.includes(select)) {
          autre.push(select);
          this.data.autre = autre;
        }
      }
    }


    this.render(true);
  }

  _onSelectCaracStyle(event) {
    const target = $(event.currentTarget);
    const select = target.data("select");

    if(target.hasClass('selected')) {
      this.data.style.selected = '';
    } else {
      this.data.style.selected = select;
    }

    this.render(true);
  }

  _onSelectWpn(event) {
    const target = $(event.currentTarget);
    const id = target.data("id");
    const type = target.data("type");
    const name = target.data("name");
    const num = target.data("num");
    const caracteristiques = target?.data("caracteristiques")?.split(',') || [];
    const aspect = target?.data("aspect") || '';

    const actId = this.data.idWpn;
    const actName = this.data.nameWpn;
    const actType = this.data.typeWpn;
    const actNum = this.data.num;
    const isPnj = this.data.pnj;

    if(type === 'armesimprovisees') {
      if(id === actId && type === actType && name === actName && num === actNum) {
        this.data.idWpn = '';
        this.data.nameWpn = '';
        this.data.typeWpn = '';
        this.data.num = -1;
      } else {
        this.data.label = game.i18n.localize(CONFIG.KNIGHT.armesimprovisees[name][num]);
        this.data.idWpn = id;
        this.data.nameWpn = name;
        this.data.typeWpn = type;
        this.data.num = num;

        if(caracteristiques.length > 0 && !isPnj) {
          this.data.base = caracteristiques[0];
          this.data.autre = [caracteristiques[1]];
        }

        if(aspect !== '' && isPnj) {
          this.data.base = aspect;
        }
      }
    } else if(id === actId && type === actType && name === actName) {
      this.data.idWpn = '';
      this.data.nameWpn = '';
      this.data.typeWpn = '';
      this.data.num = -1;
    } else {
      this.data.label = name;
      this.data.idWpn = id;
      this.data.nameWpn = name;
      this.data.typeWpn = type;
      this.data.num = num;
    }

    this.data.cadence = false;
    this.data.chambredouble = false;
    this.data.chromeligneslumineuses = false;
    this.data.barrage = false;
    this.data.systemerefroidissement = false;
    this.data.guidage = false;
    this.data.tenebricide = false;
    this.data.obliteration = false;
    this.data.cranerieur = false;
    this.data.jumeleambidextrie = true;
    this.data.soeur = true;
    this.data.jumelageambidextrie = true;
    this.data.noOd = false;

    this.render(true);
  }

  _onSelectGrenades(event) {
    const target = $(event.currentTarget);
    const type = target.data("type");
    const name = target.data("name");

    const actName = this.data.nameWpn;
    const actType = this.data.typeWpn;

    const effetsRaw = this.data?.listGrenades?.[name]?.effets?.raw || [];
    const barrage = effetsRaw.find(str => { if(str.includes('barrage')) return true; });

     if(type === actType && name === actName) {
      this.data.idWpn = '';
      this.data.nameWpn = '';
      this.data.typeWpn = '';
      this.data.num = -1;
    } else {
      this.data.label = `${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.Singulier`)} ${game.i18n.localize(`KNIGHT.COMBAT.GRENADES.${name.charAt(0).toUpperCase()+name.substr(1)}`)}`;
      this.data.idWpn = '';
      this.data.nameWpn = name;
      this.data.typeWpn = type;
      this.data.num = '';
    }

    this.data.cadence = false;
    this.data.chambredouble = false;
    this.data.chromeligneslumineuses = false;
    this.data.barrage = barrage;
    this.data.systemerefroidissement = false;
    this.data.guidage = false;
    this.data.tenebricide = false;
    this.data.obliteration = false;
    this.data.cranerieur = false;
    this.data.jumeleambidextrie = true;
    this.data.soeur = true;
    this.data.jumelageambidextrie = true;
    this.data.noOd = false;

    this.render(true);
  }

  _onSelectLongbow(event) {
    const target = $(event.currentTarget);
    const type = target.data("type");
    const name = target.data("name");

    const actName = this.data.nameWpn;
    const actType = this.data.typeWpn;

    if(type === actType && name === actName) {
      this.data.idWpn = -1;
      this.data.nameWpn = '';
      this.data.typeWpn = '';
      this.data.num = -1;
      this.data.longbow.cout = 0;
      this.data.longbow.degats.dice = this.data.longbow.degats.min;
      this.data.longbow.violence.dice = this.data.longbow.violence.min;
      this.data.longbow.portee.value = this.data.longbow.portee.min;
      this.data.longbow.portee.raw = [];
    } else {
      this.data.label = `${game.i18n.localize(`KNIGHT.ITEMS.ARMURE.CAPACITES.LONGBOW.Label`)}`;
      this.data.idWpn = -1;
      this.data.nameWpn = name;
      this.data.typeWpn = type;
      this.data.num = '';
    }

    this.data.cadence = false;
    this.data.chambredouble = false;
    this.data.chromeligneslumineuses = false;
    this.data.barrage = false;
    this.data.systemerefroidissement = false;
    this.data.guidage = false;
    this.data.tenebricide = false;
    this.data.obliteration = false;
    this.data.cranerieur = false;
    this.data.jumeleambidextrie = true;
    this.data.soeur = true;
    this.data.jumelageambidextrie = true;
    this.data.noOd = false;

    this.render(true);
  }

  _onSelectEffetsLongbow(event) {
    const target = $(event.currentTarget);
    const raw = target.data("raw");
    const cout = +target.data("cost");
    const liste = target.data("liste");
    const nbre = +target.data("selectedonlist") || 0;

    const effetsRaw = this.data.longbow.effets.raw;
    const hasEffet = effetsRaw.find(str => { if(str.includes(raw)) return true; });

    const coutActuel = +this.data.longbow.effets[liste].cout;

    if(hasEffet) {
      for( let i = 0; i < effetsRaw.length; i++){

        if (effetsRaw[i] === raw) {

          effetsRaw.splice(i, 1);
        }
      }

      this.data.longbow.effets[liste].cout = coutActuel - cout;
      this.data.longbow.effets[liste].selected = nbre - 1;
    } else if(nbre < 3) {
      effetsRaw.push(raw);
      this.data.longbow.effets[liste].cout = coutActuel + cout;
      this.data.longbow.effets[liste].selected = nbre + 1;
    }

    this.data.noOd = false;

    this.render(true);
  }

  _onSelectEffetsSpecial(event) {
    const target = $(event.currentTarget);
    const num = target.data("num");
    const raw = target.data("raw");
    const cout = +target.data("cost");
    const liste = target.data("liste");

    const effetsRaw = this.data.listWpnSpecial[num].effets.raw;
    const hasEffet = effetsRaw.find(str => { if(str.includes(raw)) return true; });

    const coutActuel = +this.data.listWpnSpecial[num].energie;

    if(hasEffet) {
      for( let i = 0; i < effetsRaw.length; i++){

        if (effetsRaw[i] === raw) {

          effetsRaw.splice(i, 1);
        }
      }


      this.data.listWpnSpecial[num].energie = coutActuel - cout;
    } else {
      effetsRaw.push(raw);
      this.data.listWpnSpecial[num].energie = coutActuel + cout;
    }

    this.data.noOd = false;

    this.render(true);
  }

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param {Object} button     The configuration of the chosen button
   * @private
   */
   submit(button) {
    try {
      if (button.callback) button.callback(this.options.jQuery ? this.element : this.element[0]);
      this.close();
    } catch(err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }

  /** @inheritdoc */
  async close(options) {
    const id = this.data.actor;
    const isPNJ = this.data.pnj;
    const isMA = this.data.ma;
    const actor = game.actors.get(id);

    const succesBonus = this.data.succesBonus;
    const modificateur = this.data.modificateur;
    const degatsDice = this.data.degatsBonus.dice;
    const degatsFixe = this.data.degatsBonus.fixe;
    const violenceDice = this.data.violenceBonus.dice;
    const violenceFixe = this.data.violenceBonus.fixe;
    const sacrifice = this.data?.style?.sacrifice || undefined;
    const tourspasses = this.data?.style?.tourspasses || undefined;

    const update = isPNJ ? {
      system:{
        combat:{
          data:{
            succesbonus:succesBonus,
            modificateur:modificateur,
            degatsbonus:{
              dice:degatsDice,
              fixe:degatsFixe
            },
            violencebonus:{
              dice:violenceDice,
              fixe:violenceFixe
            }
          }
        },
        knightRoll:{
          id:false
        }
      }
    } : {
      system:{
        combat:{
          data:{
            succesbonus:succesBonus,
            modificateur:modificateur,
            sacrifice:sacrifice,
            tourspasses:tourspasses,
            degatsbonus:{
              dice:degatsDice,
              fixe:degatsFixe
            },
            violencebonus:{
              dice:violenceDice,
              fixe:violenceFixe
            }
          }
        },
        knightRoll:{
          id:false
        }
      }
    }

    actor.update(update);

    if(!isMA) {
      const listWpnContact = this.data.listWpnContact;
      const listWpnDistance = this.data.listWpnDistance;

      for(let i = 0;i < listWpnContact.length;i++) {
        const data = listWpnContact[i];
        const type = data.type;
        const dgts = data.system.degats;
        const violence = data.system.violence;

        switch(type) {
          case 'module':
            const items = actor.items.get(data._id);

            if(dgts.variable.has) {
              items.update({[`system.arme.degats.dice`]:dgts.dice});
            }

            if(violence.variable.has) {
              items.update({[`system.arme.violence.dice`]:violence.dice});
            }
            break;
        }
      }

      for(let i = 0;i < listWpnDistance.length;i++) {
        const data = listWpnDistance[i];
        const type = data.type;
        const dgts = data.system.degats;
        const violence = data.system.violence;

        switch(type) {
          case 'module':
            const items = actor.items.get(data._id);

            if(dgts.variable.has) {
              items.update({[`system.arme.degats.dice`]:dgts.dice});
            }

            if(violence.variable.has) {
              items.update({[`system.arme.violence.dice`]:violence.dice});
            }
            break;
        }
      }
    }


    if ( this.data.close ) this.data.close(this.options.jQuery ? this.element : this.element[0]);
    $(document).off('keydown.chooseDefault');
    return super.close(options);
  }

  _depensePE(actor, depense) {
    const isMA = this.data?.ma || false;
    const getArmure = actor.type === "knight" ? actor.items.get(actor.system.equipements.armure.id).system : actor.system;
    const remplaceEnergie = isMA ? false : getArmure.espoir.remplaceEnergie || false;
    const type = remplaceEnergie ? 'espoir' : 'energie';
    const hasJauge = isMA || actor.type !== "knight" ? true : actor.system.jauges[type];

    if(!hasJauge) return {
      has:false,
      type:type
    };

    const coutCalcule = (remplaceEnergie && getArmure.espoir.cout > 0 && type === 'module') ? Math.floor(depense / getArmure.espoir.cout) : depense;
    const actuel = remplaceEnergie ? +actor.system.espoir.value : +actor.system.energie.value;
    const substract = actuel-coutCalcule;

    if(substract < 0) {
      return {
        has:false,
        type:type
      };
    } else {
      let update = {
        system:{
          [type]:{
            value:substract
          }
        }
      }

      if(type === 'espoir' && actor.system.espoir.perte.saufAgonie) {
        update.system.espoir.value = actuel;
      }

      actor.update(update);

      return {
        has:true,
        type:type
      };
    }
  }

  _depenseEspoir(actor, depense) {
    const type = 'espoir';
    const hasJauge = actor.system.jauges[type];

    if(!hasJauge) return {
      has:false,
      type:type
    };

    const actuel = +actor.system.espoir.value;
    const substract = actuel-depense;

    if(substract < 0) {
      return {
        has:false,
        type:type
      };
    } else {
      let update = {
        system:{
          [type]:{
            value:substract
          }
        }
      }

      if(type === 'espoir' && actor.system.espoir.perte.saufAgonie) {
        update.system.espoir.value = actuel;
      }

      actor.update(update);

      return {
        has:true,
        type:type
      };
    }
  }
}
