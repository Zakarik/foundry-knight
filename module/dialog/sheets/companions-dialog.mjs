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
    actions: {
      valider: KnightCompanionDialog.#onValider,
      annuler: KnightCompanionDialog.#onAnnuler,
    }
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

  static async #onValider(event, target) {
    const evoPath = 'system.evolutions.special.companions';
    const LZString = globalThis.LZString;

    const type = this.system.active;
    const armor = await this.system.armor;
    const actor = armor.actor;
    const system = this.system[type]
    const evoList = foundry.utils.getProperty(armor, `${evoPath}.applied.liste`) ? foundry.utils.getProperty(armor, `${evoPath}.applied.liste`) : [];
    const evoValue = foundry.utils.getProperty(armor, `${evoPath}.applied.value`) ? foundry.utils.getProperty(armor, `${evoPath}.applied.value`) : 0;
    const gloireListe = actor.system.progression.gloire.depense.liste;
    const isEmpty = gloireListe[0]?.isEmpty ?? false;
    const gloireMax = Object.keys(gloireListe).length === 0 || isEmpty ? 0 : this._getHighestOrder(gloireListe);
    const { archivage, ...dataToSave } = armor.system;
    let basePath = 'system.capacites.selected.companions';
    let update = {};
    console.error(type);
    switch(type) {
      case 'lion':
        basePath += `.lion.aspects`;
        update[`${basePath}.bete.value`] = system.aspects.bete.value;
        update[`${basePath}.chair.value`] = system.aspects.chair.value;
        update[`${basePath}.dame.value`] = system.aspects.dame.value;
        update[`${basePath}.machine.value`] = system.aspects.machine.value;
        update[`${basePath}.masque.value`] = system.aspects.masque.value;

        update[`${basePath}.bete.ae`] = system.aspects.bete.ae;
        update[`${basePath}.chair.ae`] = system.aspects.chair.ae;
        update[`${basePath}.dame.ae`] = system.aspects.dame.ae;
        update[`${basePath}.machine.ae`] = system.aspects.machine.ae;
        update[`${basePath}.masque.ae`] = system.aspects.masque.ae;

        evoList.push({
          addOrder:gloireMax+1,
          isArmure:true,
          value:(evoValue+1)*foundry.utils.getProperty(armor, `${evoPath}.value`) ? foundry.utils.getProperty(armor, `${evoPath}.value`) : 1,
        });

        update[`${evoPath}.applied.liste`] = evoList;
        update[`${evoPath}.applied.value`] = evoList.length;
        update[`system.archivage.liste.${
          (evoValue+1)*foundry.utils.getProperty(armor, `${evoPath}.value`) ?
          foundry.utils.getProperty(armor, `${evoPath}.value`) : 1}`] = LZString.compressToUTF16(JSON.stringify(dataToSave));
          console.error(update);
        armor.update(update);
        break;

      case 'wolf':
        break;

      case 'crow':
        break;
    }

    this.close();
  }

  static async #onAnnuler(event, target) {
    this.close();
  }

  #prepareBtn() {
    const btn = [];

    btn.push({
      action:'valider',
      icon:'fas fa-check',
      label:'KNIGHT.AUTRE.Valider',
    },{
      action:'annuler',
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

  /** @inheritdoc */
  _onRender(context, options) {
  const companions = this.element.querySelectorAll('div.companions');

    this.element.addEventListener('change', ev => {
      const t = ev.target;

      // --- Switch d'affichage ---
      if(t.matches('select[name="system.active"]')) {
        const value = t.value;
        companions.forEach(cmp => {
          cmp.style.display = (cmp.dataset.type === value) ? 'grid' : '';
        });
        return;
      }

      if(!t.matches('input[type=number]')) return;
      if(!(t.classList.contains('aspect') || t.classList.contains('ae'))) return;

      const block = t.closest('div.companions');
      const isAspect = t.classList.contains('aspect');

      const poolMax = isAspect ? 5 : 2;   // points à répartir au total

      const min = Number(t.min) || 0;     // valeur de départ (plancher)
      const max = Number(t.max);          // déjà min + 2 dans le modèle
      let value = Number(t.value);
      if(Number.isNaN(value)) value = min;

      // 1) Jamais sous la valeur de départ
      if(value < min) value = min;

      // 2) Jamais au-dessus du max de l'input (min + 2)
      if(!Number.isNaN(max) && value > max && isAspect) value = max;

      // 3) Le total ajouté ne doit pas dépasser poolMax
      const selector = isAspect ? 'input.aspect' : 'input.ae';
      let othersAdded = 0;
      for(const i of block.querySelectorAll(selector)) {
        if(i === t) continue;
        const iMin = Number(i.min) || 0;
        othersAdded += Math.max(0, Number(i.value) - iMin);
      }
      const allowedHere = poolMax - othersAdded;
      if((value - min) > allowedHere) {
        value = min + Math.max(0, allowedHere);
      }

      // Applique la valeur clampée
      if(Number(t.value) !== value) t.value = value;
      this.system.update({ [t.name]: value });

      // --- Met à jour le compteur "à distribuer" ---
      this.#updateDistribuer(block, isAspect, poolMax);
    });
  }

  #updateDistribuer(block, isAspect, poolMax) {
    const selector = isAspect ? 'input.aspect' : 'input.ae';
    const distSel  = isAspect ? 'input.aspectDistribuer' : 'input.aeDistribuer';

    let totalAdded = 0;
    for(const i of block.querySelectorAll(selector)) {
      const iMin = Number(i.min) || 0;
      totalAdded += Math.max(0, Number(i.value) - iMin);
    }

    const restant = poolMax - totalAdded;
    for(const d of block.querySelectorAll(distSel)) {
      d.value = restant;
      if(d.name) this.system.update({ [d.name]: restant });
    }
  }


  #mainValueCalc(target) {
    const companions = target.closest('div.companions');
    const aspects = companions.querySelectorAll('input.aspect');
    const ae = companions.querySelectorAll('input.ae');
    let aspectValue = 0;
    let aeValue = 0;

    for(const a of aspects) {
      aspectValue += (Number(a.value) - Number(a.min));
    }

    for(const a of ae) {
      aeValue += (Number(a.value) - Number(a.min));
    }

    console.error(aeValue);

    return {
      aspectValue,
      aeValue,
    }
  }

  static async #onSubmit(event, form, formData, options={}) {
    await this.system.update(formData.object);
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
}