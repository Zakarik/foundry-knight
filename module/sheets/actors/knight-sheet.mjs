import {
  getArmor,
  getCaracValue,
  getODValue,
  getDefaultImg,
} from "../../helpers/common.mjs";

import BaseActorSheet from "../bases/base-actor-sheet.mjs";
import HumanMixinSheet from "../bases/mixin-human-sheet.mjs";

/**
 * @extends {BaseActorSheet}
 */
export class KnightSheet extends HumanMixinSheet(BaseActorSheet) {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["knight", "sheet", "actor"],
      template: "systems/knight/templates/actors/knight-sheet.html",
      width: 940,
      height: 720,
      tabs: [
        {navSelector: ".sheet-tabs", contentSelector: ".body", initial: "personnage"},
        {navSelector: ".tabArmure", contentSelector: ".armure", initial: "capacites"},
      ],
      dragDrop: [{dragSelector: [".draggable", ".item-list .item"], dropSelector: null}],
    });
  }

  get canDropActor() {
    return true;
  }

  get actorTypesValides() {
    return ['ia'];
  }

  get itemTypesValides() {
    return [...super.itemTypesValides,
      'module', 'armure',
      'avantage', 'inconvenient',
      'motivationMineure', 'contact',
      'blessure', 'trauma', 'langue',
      'armurelegende', 'distinction',
      'capaciteultime', 'cyberware'];
  }

  get hasGloire() {
    return true;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('div.progression div.evolutionsAAcheter button').hover(ev => {
      const span = html.find('div.progression div.evolutionsAAcheter span.hideInfo');
      const target = $(ev.currentTarget);
      const width = html.find('div.progression div.evolutionsAAcheter').width() / 2;

      if(target.position().left > width) {
        span.toggleClass("right");
      } else {
        span.toggleClass("left");
      }
    });

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('div.listeAspects div.line').hover(ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).children('img').attr("src", "systems/knight/assets/icons/D6Black.svg");
    });

    html.find('div.styleCombat > span.info').hover(ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "block");
    }, ev => {
      html.find('div.styleCombat > span.hideInfo').css("display", "none");
    });

    html.find('div.styleCombat > span.info').click(ev => {
      const actuel = this.actor.system.combat?.styleDeploy || false;

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

    html.find('div.styleCombat > select').change(async ev => {
      this.actor.update({['system.combat.data']:{
        tourspasses:1,
        type:"degats"
      }});
    });

    html.find('.jetEspoir').click(async ev => {
      const hasShift = ev.shiftKey;
      const label = game.i18n.localize('KNIGHT.JETS.JetEspoir');

      if(hasShift) {
        const wear = this.object.system.wear;

        let carac = getCaracValue('hargne', this.actor, true);
        carac += getCaracValue('sangFroid', this.actor, true);

        let od = wear === 'armure' || wear === 'ascension' ? getODValue('hargne', this.actor, true) : 0;
        od += wear === 'armure' || wear === 'ascension' ? getODValue('sangFroid', this.actor, true) : 0;
        let caracs = [];

        const exec = new game.knight.RollKnight(this.actor,
          {
          name:label,
          dices:`${carac}D6`,
          carac:[game.i18n.localize(CONFIG.KNIGHT.caracteristiques['hargne']), game.i18n.localize(CONFIG.KNIGHT.caracteristiques['sangFroid'])],
          bonus:[od],
          }).doRoll();

      } else {
        const id = this.actor.token ? this.actor.token.id : this.actor.id;

        const dialog = new game.knight.applications.KnightRollDialog(id, {
          label:label,
          base:'hargne',
          whatRoll:['sangFroid']
        });

        dialog.open();
      }
    });

    html.find('.jetEgide').click(async ev => {
      const value = $(ev.currentTarget).data("value");

      const rEgide = new game.knight.RollKnight(this.actor, {
        name:game.i18n.localize("KNIGHT.JETS.JetEgide"),
        dices:`${value}`
      });

      await rEgide.doRoll();
    });

    html.find('.motivationAccomplie').click(async ev => {
      const espoir = this.actor.system.espoir;
      const mods = espoir.recuperation.bonus-espoir.recuperation.malus;
      const actuel = this.actor.system.espoir.value;
      let update = {}
      update[`system.espoir.value`] = `${actuel}+@{rollTotal}`;

      const rEspoir = new game.knight.RollKnight(this.actor, {
        name:game.i18n.localize("KNIGHT.PERSONNAGE.MotivationAccomplie"),
        dices:`1D6`,
        bonus:[mods]
      }, false);

      await rEspoir.doRoll(update);
    });

    html.find('img.edit').click(ev => {
      const aspect = $(ev.currentTarget).data("aspect");
      const label = game.i18n.localize(CONFIG.KNIGHT.aspects[aspect]);

      const dataAspect = this.actor.system.aspects[aspect];

      let editCarac = ``;
      let listCarac = [];

      for (let [key, carac] of Object.entries(dataAspect.caracteristiques)){
        editCarac += `
        <label class="line">
            <span class="label">${game.i18n.localize(CONFIG.KNIGHT.caracteristiques[key])}</span>
            <input type="number" class="${key}" data-type="caracteristique" value="${carac.base}" min="0" max="9" />
        </label>
        `;
        listCarac.push(key);
      }

      const editDialog = `
      <input type="number" class="aspect" data-type="aspect" value="${dataAspect.base}" min="0" max="9" />
      <div class="main">${editCarac}</div>
      `;

      const edit = new game.knight.applications.KnightEditDialog({
        title: this.actor.name+" : "+label,
        actor:this.actor.id,
        content: editDialog,
        buttons: {
          button1: {
            label: game.i18n.localize("KNIGHT.AUTRE.Valider"),
            callback: async (html) => {
              const baseAspect = +html.find('.aspect').val();

              let caracteristiques = {};

              for(let i = 0;i < listCarac.length;i++) {
                const baseCarac = +html.find(`.${listCarac[i]}`).val();

                caracteristiques[listCarac[i]] = {};
                caracteristiques[listCarac[i]].base = baseCarac;
              }

              let update = {
                system:{
                  aspects:{
                    [aspect]:{
                      base:baseAspect,
                      caracteristiques
                    }
                  }
                }
              };

              this.actor.update(update);
            },
            icon: `<i class="fas fa-check"></i>`
          },
          button2: {
            label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
            icon: `<i class="fas fa-times"></i>`
          }
        }
      }).render(true);
    });

    html.find('button.gainEspoirItem').click(ev => {
      const id = $(ev.currentTarget).data("id");
      const item = this.actor.items.get(id);
      const value = item.system.gainEspoir.value;
      const actuel = this.actor.system.espoir.value;
      const max = this.actor.system.espoir.max;
      let total = actuel+value;

      const updateItem = {
        system:{
          gainEspoir:{
            applique:true
          }
        }
      };

      if(total > max) { total = max; }

      const updateActor = {
        system:{
          espoir:{
            value:total
          }
        }
      };

      item.update(updateItem);
      this.actor.update(updateActor);
    });

    html.find('div.buttonSelectArmure button.armure').click(async ev => {
      ev.preventDefault();
      const type = $(ev.currentTarget).data("type");
      const data = this.actor.system;
      const wear = data.wear;
      let itemUpdate = '';

      if(type === data.wear) return;

      const update = {};

      update[`system.wear`] = type;

      switch(wear) {
        case 'armure':
          itemUpdate = `system.armure.value`;
          break;

        case 'ascension':
        case 'guardian':
          update[`system.equipements.${wear}.armure.value`] = data.armure.value
          break;
      }

      switch(type) {
        case 'armure':
          const armor = await getArmor(this.actor);

          update[`system.armure.value`] = armor.system.armure.value;
          update['system.jauges'] = armor.system.jauges;
          break;

        case 'ascension':
        case 'guardian':
          update[`system.armure.value`] = data.equipements[type].armure.value;
          update['system.jauges'] = data.equipements[type].jauges;
          break;

        case 'tenueCivile':
          update['system.jauges'] = data.equipements[type].jauges;
          break;
      }

      if(type != 'armure') this._resetArmure(this.actor);

      this.actor.update(update);

      if(itemUpdate !== '') {
        const armor = await getArmor(this.actor);

        armor.update({[itemUpdate]:data.armure.value});
      }
    });

    html.find('div.combat div.wpn a.item-equip').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:true,
          rack:false
        }
      }

      item.update(update);
    });

    html.find('div.combat div.wpn a.item-unequip').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:false,
          rack:true
        }
      }

      item.update(update);
    });

    html.find('div.combat div.wpn a.item-rack').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:false,
          rack:true
        }
      }

      item.update(update);
    });

    html.find('div.combat div.wpn a.item-unrack').click(ev => {
      const header = $(ev.currentTarget).parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system:{
          equipped:false,
          rack:false
        }
      }

      item.update(update);
    });

    html.find('div.progression .tableauPG button').click(ev => {
      const target = $(ev.currentTarget);
      const value = target.data("value");
      const id = target.data("id");
      const evo = target.data("evo");
      const isLongbow = target?.data("longbow") || false;
      const isModule = target?.data("ismodule") || false;
      const niveau = Number(target?.data("niveau")) || 1;
      const result = value ? false : true;

      if(isLongbow) {
        this.actor.items.get(id).update({[`system.evolutions.special.longbow.${evo}.gratuit`]:result});
      } else if(isModule) {
        this.actor.items.get(id).update({[`system.niveau.details.n${niveau}.gratuit`]:result});
      } else {
        this.actor.items.get(id).update({['system.gratuit']:result});
      }
    });

    html.find('div.progression .tableauPG .gloire-create').click(async ev => {
      const dataGloire = this.actor.system.progression.gloire;
      const gloireListe = dataGloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      let addOrder =  foundry.utils.isEmpty(gloireListe)  || isEmpty ? 0 : this._getHighestOrder(gloireListe);
      const gloireAutre = dataGloire.depense?.autre || {};

      if(addOrder === -1) {
        addOrder = Object.keys(gloireListe).length;
      }

      const newData = {
        order:`${addOrder+1}`,
        nom:'',
        cout:'0',
        gratuit:false
      }

      let update = {};
      let length = 0;

      for(let gloire in gloireAutre) {
        const obj = gloireAutre[gloire];

        length = parseInt(gloire);

        update[gloire] = {
          order:obj.order,
          nom:obj.nom,
          cout:obj.cout,
          gratuit:obj.gratuit
        }
      }

      update[length+1] = newData;

      await this.actor.update({[`system.progression.gloire.depense.autre`]:update});
    });

    html.find('div.progression .tableauPG .gloire-delete').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");

      this.actor.update({[`system.progression.gloire.depense.autre.-=${id}`]:null});
    });

    html.find('div.progression .tableauPX .experience-create').click(ev => {
      const getData = this.actor;
      const data = getData.system.progression.experience.depense.liste;
      let i = 0;
      let addOrder =  foundry.utils.isEmpty(data) ? 0 : this._getHighestOrder(data);

      const newData = {};

      for(let e in data) {
        i = parseInt(e);

        newData[e] = data[e];
      }

      newData[i+1] = {
        addOrder:addOrder+1,
        caracteristique:'',
        bonus:0,
        cout:0
      };

      this.actor.update({[`system.progression.experience.depense.liste`]:newData});
    });

    html.find('div.progression .tableauPX .experience-delete').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("id");

      this.actor.update({[`system.progression.experience.depense.liste.-=${id}`]:null});
    });

    html.find('.appliquer-evolution-armure').click(async ev => {
      const target = $(ev.currentTarget);
      const id = target.data("num");
      const dataArmor = await getArmor(this.actor);
      const listEvolutions = dataArmor.system.evolutions.liste;
      const dataEArmor = listEvolutions[id]?.data ?? {};
      const capacites = listEvolutions[id]?.capacites ?? {};
      let special = listEvolutions[id]?.special ?? {};
      const gloireListe = this.actor.system.progression.gloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
      const filter = [];

      const update = {};

      const LZString = globalThis.LZString;
      const { archivage, ...dataToSave } = dataArmor.system;
      update[`system.archivage.liste.${listEvolutions[id].value}`] = LZString.compressToUTF16(JSON.stringify(dataToSave));

      for (let [key, spec] of Object.entries(special)) {
        const hasDelete = spec?.delete || false;

        if(hasDelete !== false) {
          if(hasDelete.value === true) {

            update[`system.special.selected.-=${key}`] = null;
            filter.push(key);
            delete special[key];
          }
        }
      }

      update[`system.espoir.value`] = dataEArmor.espoir;
      update[`system.armure.base`] = dataArmor.system.armure.base+dataEArmor.armure;
      update[`system.champDeForce.base`] = dataArmor.system.champDeForce.base+dataEArmor.champDeForce;
      update[`system.energie.base`] = dataArmor.system.energie.base+dataEArmor.energie;
      update[`system.energie.value`] = dataArmor.system.espoir.value+dataEArmor.espoir;
      update[`system.capacites.selected`] = capacites;
      update[`system.special.selected`] = special;
      update[`system.evolutions.liste.${id}`] = {
        applied:true,
        addOrder:addOrder+1
      };

      for (let [key, evolutions] of Object.entries(listEvolutions)) {
        const num = +key;

        if(num > id) {
          for(let i = 0;i < filter.length;i++) {
            const hasSpecial = evolutions.special?.[filter[i]] || false;

            if(hasSpecial !== false) {
              update[`system.evolutions.liste.${num}.special.-=${filter[i]}`] = null;
            }
          }
        }
      }

      dataArmor.update(update);
    });

    html.find('.appliquer-evolution-companions').click(ev => {
      const target = $(ev.currentTarget);
      const id = target.data("num");
      const dataCompanions = this.actor.armureData.system.capacites.selected.companions;
      const dataWolfConfig = dataCompanions.wolf.configurations;
      let data = this.actor.armureData.system.evolutions.special.companions.evolutions;
      data['aspects'] = {
        "lion":{
          "chair":{
            "value":0,
            "ae":0
          },
          "bete":{
            "value":0,
            "ae":0
          },
          "machine":{
            "value":0,
            "ae":0
          },
          "dame":{
            "value":0,
            "ae":0
          },
          "masque":{
            "value":0,
            "ae":0
          }
        },
        "wolf":{
          "chair":{
            "value":0,
            "ae":0
          },
          "bete":{
            "value":0,
            "ae":0
          },
          "machine":{
            "value":0,
            "ae":0
          },
          "dame":{
            "value":0,
            "ae":0
          },
          "masque":{
            "value":0,
            "ae":0
          }
        },
        "crow":{
          "chair":{
            "value":0,
            "ae":0
          },
          "bete":{
            "value":0,
            "ae":0
          },
          "machine":{
            "value":0,
            "ae":0
          },
          "dame":{
            "value":0,
            "ae":0
          },
          "masque":{
            "value":0,
            "ae":0
          }
        }
      };

      data['configurations'] = {
        'labor':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.LABOR.Label"),
          value:0
        },
        'medic':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.MEDIC.Label"),
          value:0
        },
        'tech':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.TECH.Label"),
          value:0
        },
        'fighter':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.FIGHTER.Label"),
          value:0
        },
        'recon':{
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.RECON.Label"),
          value:0
        },
      };

      if(dataWolfConfig.labor.niveau < 3) {
        data['configurations']['labor'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.LABOR.Label"),
          value:0
        }
      }

      if(dataWolfConfig.medic.niveau < 3) {
        data['configurations']['medic'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.MEDIC.Label"),
          value:0
        }
      }

      if(dataWolfConfig.tech.niveau < 3) {
        data['configurations']['tech'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.TECH.Label"),
          value:0
        }
      }

      if(dataWolfConfig.fighter.niveau < 3) {
        data['configurations']['fighter'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.FIGHTER.Label"),
          value:0
        }
      }

      if(dataWolfConfig.recon.niveau < 3) {
        data['configurations']['recon'] = {
          label:game.i18n.localize("KNIGHT.ITEMS.ARMURE.CAPACITES.COMPANIONS.WOLF.CONFIGURATIONS.RECON.Label"),
          value:0
        }
      }

      data['lion']['aspects'].restant = data.lion.aspects.value;
      data['lion'].restant = data.lion.ae;

      data['wolf']['aspects'].restant = data.wolf.aspects.value;
      data['wolf'].restant = data.wolf.ae;
      data['wolf'].bonusRestant = data.wolf.bonus;

      data['crow']['aspects'].restant = data.crow.aspects.value;
      data['evo'] = id;

      const companions = new game.knight.applications.KnightCompanionsDialog({
        title: this.actor.name+" : "+game.i18n.localize("KNIGHT.ITEMS.ARMURE.EVOLUTIONS.EvolutionCompanion"),
        actor:this.actor.id,
        content:{
          data,
          selected:{
            lion:false,
            wolf:false,
            crow:false
          }
        },
        buttons: {
          button1: {
            label: game.i18n.localize("KNIGHT.AUTRE.Valider"),
            icon: `<i class="fas fa-check"></i>`,
            validate:true
          },
          button2: {
            label: game.i18n.localize("KNIGHT.AUTRE.Annuler"),
            icon: `<i class="fas fa-times"></i>`,
            validate:false
          }
        }
      }).render(true);
    });

    html.find('.acheter-evolution-longbow').click(async ev => {
      const target = $(ev.currentTarget);
      const id = +target.data("id");
      const value = +target.data("value");
      const dataArmor = await getArmor(this.actor);
      const listEvolutions = dataArmor.system.evolutions.special.longbow;
      const capacites = listEvolutions[id];
      const dataGloire = this.actor.system.progression.gloire;
      const gloireActuel = +dataGloire.actuel;
      const gloireListe = dataGloire.depense.liste;
      const isEmpty = gloireListe[0]?.isEmpty ?? false;
      const addOrder =  Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);

      if(gloireActuel >= value) {
        let array = {
          description:capacites.description,
          value:value,
          data:dataArmor.system.capacites.selected.longbow,
          addOrder:addOrder+1};

        const update = {};

        update[`system.archivage.longbow.${id}`] = array;
        update[`system.capacites.selected.longbow`] = capacites;
        update[`system.evolutions.special.longbow.${id}`] = {
          applied:true,
          addOrder:addOrder+1
        };

        delete capacites.description;

        dataArmor.update(update);

        this.actor.update({['system.progression.gloire.actuel']:gloireActuel-value});
      }
    });

    html.find('div.rollback a.retour').click(async ev => {
      const target = $(ev.currentTarget);
      const index = target.data("value");
      const type = target.data("type");
      const getDataArmor = await getArmor(this.actor);
      const dataArchives = type === 'liste' ? Object.entries(getDataArmor.system.archivage[type]) : getDataArmor.system.archivage[type];
      const getArchives = dataArchives[index];

      let update = {};
      let erase = {};

      if(type === 'liste') {
        const LZString = globalThis.LZString;
        const parse = JSON.parse(LZString.decompressFromUTF16(getArchives[1]));
        const listEvolutions = parse.evolutions.liste;

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(num >= index) {
            listEvolutions[key].applied = false;
          }
        }

        for (let [key, capacites] of Object.entries(getDataArmor.system.capacites.selected)) {
          erase[`system.capacites.selected.-=${key}`] = null;
        }

        update['system'] = parse;

        for (let [key, archive] of Object.entries(dataArchives)) {
          const num = +key;

          if(num >= index) {
            update[`system.archivage.${type}.-=${archive[0]}`] = null;
          }
        }
        await getDataArmor.update(erase)
        getDataArmor.update(update);
      } else if(type === 'longbow') {
        const listEvolutions = getDataArmor.system.evolutions.special.longbow;
        const getPG = +this.actor.system.progression.gloire.actuel;
        let gloire = 0;

        for (let [key, evolutions] of Object.entries(listEvolutions)) {
          const num = +key;

          if(evolutions.addOrder >= getArchives.addOrder && evolutions.addOrder !== undefined) {
            update[`system.evolutions.special.longbow.${num}.applied`] = false;
            update[`system.archivage.${type}.-=${num}`] = null;
            gloire += evolutions.value;
          }
        }

        update['system.capacites.selected.longbow'] = getArchives.data;
        getDataArmor.update(update);
        this.actor.update({["system.progression.gloire.actuel"]:gloire+getPG});
      }
    });

    html.find('a.avdvshow').click(ev => {
      const target = $(ev.currentTarget);
      const header = target.parents(".summary");
      const item = this.actor.items.get(header.data("item-id"));
      const value = target.data('value') ? false : true;

      item.update({['system.show']:value});
    });

    html.find('a.adl-import').click(async ev => {
      const tgt = $(ev.currentTarget);
      const type = tgt.data('type');
      const itm = this.actor.items.filter(itm => itm.type === 'arme' && itm.system.type === type);
      let html = ``;

      if(itm) {
        html += `<h1>Choisir l'arme à écraser</h1>`
        html += `<div class='select'>`
        html += `<select class="typeToImport">`
        html += `<option value='null'>Importer une nouvelle arme</option>`
        for(let i of itm) {
          html += `<option value='${i.id}'>${i.name}</option>`
        }
        html += `</select>`;
        html += `<span>Sera ignoré en cas d'import du Longbow, car les paramètres du Longbow seront remplacés.</span>`;
        html += `</div>`
      }

      html += `<textarea class="toImport"></textarea>`;

      const dOptions = {
        classes: ["knight-import-adl"],
        height:250
      };
      let d = new Dialog({
        title: game.i18n.localize('KNIGHT.IMPORT.LabelKJDRS'),
        content:html,
        buttons: {
          one: {
          label: game.i18n.localize('KNIGHT.IMPORT.ImporterArme'),
          callback: async (html) => {
              try{
                const target = html.find('.typeToImport').val();
                const data = html.find('.toImport').val();
                const json = JSON.parse(data);

                if(json.chassis === game.i18n.localize('KNIGHT.IMPORT.Longbow')) {
                  this.actor.system.dataArmor.system.importLongbow(json);
                } else if(target === 'null') {
                  const name = `${game.i18n.localize(`TYPES.Item.${type}`)}`;
                  const itemData = {
                    name: name,
                    type: 'arme',
                    img: getDefaultImg('arme'),
                    system:{
                      type:type,
                    }
                  };
                  const create = await Item.create(itemData, {parent: this.actor});
                  create.system.importWpn(json)
                } else {
                  const wpn = await this.actor.items.get(target);
                  wpn.system.importWpn(json)
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

    html.find('section.menu div.energie div.js-simpletoggler input.value')
      .focus(async ev => {
        const tgt = $(ev.currentTarget);
        tgt.data('old', Number(tgt.val()));
      })
      .change(async ev => {
        const tgt = $(ev.currentTarget);
        const oldValue = Number(tgt.data('old'));
        const value = Number(tgt.val());
        const actor = this.actor;
        const wear = actor.system.whatWear;
        const cyberware = actor.items.filter(items => items.type === 'cyberware' && (items.system.categorie === 'utilitaire' || items.system.categorie === 'combat'));

        if(cyberware.length === 0) return;

        const newValue = value < 20 ? value : 20;
        const armureEnergie = actor?.system?.equipements?.armure?.energie?.value ?? 0;
        let update = {};

        switch(wear) {
          case 'armure':
            update['system.equipements.guardian.energie.value'] = newValue;
            update['system.equipements.tenueCivile.energie.value'] = newValue;
            break;
          case 'guardian':
            if(armureEnergie < 20) update['system.equipements.armure.energie.value'] = newValue;
            else if(oldValue > newValue) update['system.equipements.armure.energie.value'] = armureEnergie-(oldValue-newValue);
            else if(oldValue < newValue) update['system.equipements.armure.energie.value'] = armureEnergie+(newValue-oldValue);

            update['system.equipements.tenueCivile.energie.value'] = newValue;
            break;
          case 'tenueCivile':
            if(armureEnergie < 20) update['system.equipements.armure.energie.value'] = newValue;
            else if(oldValue > newValue) update['system.equipements.armure.energie.value'] = armureEnergie-(oldValue-newValue);
            else if(oldValue < newValue) update['system.equipements.armure.energie.value'] = armureEnergie+(newValue-oldValue);

            update['system.equipements.guardian.energie.value'] = newValue;
            break;
        }

        await actor.update(update, { render: false });
      });
  }

  /* -------------------------------------------- */
  async _onDroppedActor(data) {
    const type = data.type;

    if(type === 'ia') {
      const update = {};

      update['system.equipements.ia.code'] = data.system.code;
      update['system.equipements.ia.surnom'] = data.name;
      update['system.equipements.ia.caractere'] = data.system.caractere;

      const itemsActuels = this.actor.items;
      for (let i of itemsActuels) {
        if(i.type === 'avantage' || i.type === 'inconvenient') {
          if(i.system.type === 'ia') {
            await i.delete();
          }
        }
      };

      const items = data.items;

      for (let i of items) {
        await i.update({['system.type']:'ia'}, { render: false });
        await this._onDropItemCreate(i);
      };

      this.actor.update(update);
    }
  }
}
