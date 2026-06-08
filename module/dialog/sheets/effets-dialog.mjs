import {
    getAllEffects,
} from "../../helpers/common.mjs";

import JsTogglerMixin from "../../sheets/bases/mixin-js-toggler.mjs";
import KnightEffetsData from "../models/effets-model.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function _sortByName(x, y) {
  const xName = x.custom ? x.customData.label : x.name;
  const yName = y.custom ? y.customData.label : y.name;

  return xName.localeCompare(yName, 'fr', {
    sensitivity: 'base'
  });
}

export class KnightEffetsDialog extends JsTogglerMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(data={}, rawEffects, options={}) {
    super(options);
    this.document = {
      id:`${data.uuid}-0`,
    };

    this.system = new KnightEffetsData(data, rawEffects);
  }

  static DEFAULT_OPTIONS = {
    position: { width: 900, height: 500 },
    window: { resizable: true },
    classes: ["dialog", "knight", "effetsDialog"],
    tag: "form",
    form: {
        submitOnChange: true,
        handler: KnightEffetsDialog.#onSubmit,
    },
    actions: {
        add: this.#onAdd,
        addCustom: this.#onAddCustom,
        editCustom: this.#onEditCustom,
        remove: this.#onRemove,
        toggle: this.#onToggle,
        valider: this.#onValider,
        annuler: this.#onAnnuler,
    }
  };

  static PARTS = {
    left: {
        template: "systems/knight/templates/dialog/parts/effects/left.hbs"
    },
    right: {
        template: "systems/knight/templates/dialog/parts/effects/right.hbs"
    },
    activable: {
        template: "systems/knight/templates/dialog/parts/effects/activable.hbs"
    },
    custom: {
        template: "systems/knight/templates/dialog/parts/effects/custom.hbs"
    },
    btn: {
        template: "systems/knight/templates/dialog/parts/effects/btn.hbs"
    },
  };

  static async #onAdd(event, target) {
    const header = target.closest('.std');
    const tgt = target.dataset;
    const label = tgt.label;
    const double = tgt.double === 'true' ? true : false;
    const activable = header?.dataset?.activable === 'true' ? true : false;
    const possible = activable ? this.system.activables.find(itm => itm.key === label) : this.system.possibles.find(itm => itm.key === label);
    const list = this.system.effets;

    if(activable) {
      const cost = await this.#askCost(target);

      if(cost === false) return;
      possible.activable = true;
      possible.cost = cost;
    }

    const index = activable ? this.system.activables.findIndex(itm => itm.key === label) : this.system.possibles.findIndex(itm => itm.key === label);
    if (index !== -1) activable ? this.system.activables.splice(index, 1) : this.system.possibles.splice(index, 1);

    list.push(possible)

    this.system.effets = list.sort(_sortByName);

    this.render();
  }

  static async #onAddCustom(event, target) {
    const header = target.closest('.std');
    const tgt = target.dataset;
    const custom = this.system.custom;
    const list = this.system.effets;

    if(custom.edit) {
      list[custom.edit].customData = foundry.utils.deepClone(custom);
    } else {
      list.push({
        custom:true,
        customData:foundry.utils.deepClone(custom),
      });
    }

    this.system.effets = list.sort(_sortByName);

    this.render();

    this.#resetCustom();
  }

  static async #onEditCustom(event, target) {
    const tgt = target.dataset;
    const index = tgt.index;
    const custom = this.system.effets[index];

    this.system.custom = foundry.utils.deepClone(custom.customData);
    this.system.custom.edit = index;

    this.render();
  }

  static async #onRemove(event, target) {
    const tgt = target.dataset;
    const index = tgt.index;
    const type = tgt.type;
    const activable = type === 'activable' ? true : false;
    const eff = this.system.effets[index];

    if(activable) this.system.activables.push(eff);
    else this.system.possibles.push(eff);

    this.system.effets.splice(index, 1);

    if(activable) this.system.activables = this.system.activables.sort(_sortByName);
    else this.system.possibles = this.system.possibles.sort(_sortByName);

    this.render();
  }

  static #onToggle(event, target) {
    event.preventDefault();
    const tgt = target.dataset;
    const path = tgt.path;
    const hide = tgt.hide === 'true' ? true : false;
    const value = foundry.utils.getProperty(this.system, path);
    const i = target.querySelector('i');
    const iCL = i.classList;

    foundry.utils.setProperty(this.system, path, !value);

    target.classList.toggle('selected');
    iCL.toggle('fa-check');
    iCL.toggle('green');
    iCL.toggle('fa-xmark');
    iCL.toggle('red');

    if(hide) {
      target.nextElementSibling.classList.toggle('hide');
    }
  }

  static async #onValider(event, target) {
    const list = this.system.effets;
    const path = this.system.path;
    const raw = [];
    const activable = [];
    const custom = [];

    for(let e of list) {
      if(e.custom)  custom.push(e.customData);
      else {
        const isActivable = e.activable ? true : false;
        let str = isActivable ? {
          key:e.key,
          cost:0,
        } : e.key;

        if(isActivable) str.cost = e.cost;

        if(e.double && isActivable) str.key += ` ${e.value}`;
        else if(e.double) str += ` ${e.value}`;

        if(e.text && isActivable) str.key += `<space>${e.str}`;
        else if(e.text) str += `<space>${e.str}`;

        if(isActivable) activable.push(str);
        else raw.push(str);
      }
    }

    const item = await fromUuid(this.system.uuid);

    item.update({[`system.${path}`]:{
      raw,
      custom,
      activable
    }});

    this.close();
  }

  static #onAnnuler(event, target) {
    this.close();
  }

  #buildCustom() {
    const i18n = CONFIG.KNIGHT.LIST.aspectsCaracteristiques;
    const attaque = this.#buildAttaque(this.system, null, i18n);
    const degats = this.#buildDgts(this.system, null, i18n, 'Degats', 'degats');
    const violence = this.#buildDgts(this.system, null, i18n, 'Violence', 'violence');

    return {
      custom:[attaque, degats, violence]
    }
  }

  #buildAttaque(document, item, i18n) {
    const attaque = [];

    attaque.push({
      type:'h2',
      i18n:'KNIGHT.BONUS.Attaque',
    });

    attaque.push({
      type:'number',
      i18n:'KNIGHT.BONUS.Succes',
      name:'custom.attaque.reussite',
      value:document.custom.attaque.reussite,
      min:0,
    });

    attaque.push({
      type:'numberWithSpan',
      i18n:'KNIGHT.BONUS.Jet',
      span:'KNIGHT.JETS.Des-short',
      name:'custom.attaque.jet',
      value:document.custom.attaque.jet,
      min:0,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.CaracFixe',
      name:'custom.attaque.carac.fixe',
      value:document.custom.attaque.carac.fixe,
      choices:document.schema.getField('custom.attaque.carac.fixe').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.OdInclusFixe',
      name:'custom.attaque.carac.odInclusFixe',
      value:document.custom.attaque.carac.odInclusFixe,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.CaracJet',
      name:'custom.attaque.carac.jet',
      value:document.custom.attaque.carac.jet,
      choices:document.schema.getField('custom.attaque.carac.jet').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.OdInclusJet',
      name:'custom.attaque.carac.odInclusJet',
      value:document.custom.attaque.carac.odInclusJet,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.AspectFixe',
      name:'custom.attaque.aspect.fixe',
      value:document.custom.attaque.aspect.fixe,
      choices:document.schema.getField('custom.attaque.aspect.fixe').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.AeInclusFixe',
      name:'custom.attaque.aspect.aeInclusFixe',
      value:document.custom.attaque.aspect.aeInclusFixe,
    });

    attaque.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.AspectJet',
      name:'custom.attaque.aspect.jet',
      value:document.custom.attaque.aspect.jet,
      choices:document.schema.getField('custom.attaque.aspect.jet').choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.AeInclusJet',
      name:'custom.attaque.aspect.aeInclusJet',
      value:document.custom.attaque.aspect.aeInclusJet,
    });

    attaque.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.Condition',
      name:'custom.attaque.conditionnel.has',
      hasHide:true,
      value:document.custom.attaque.conditionnel.has,
    });

    attaque.push({
      type:'textarea',
      name:'custom.attaque.conditionnel.condition',
      hide:document.custom.attaque.conditionnel.has,
      value:document.custom.attaque.conditionnel.condition,
    });

    return attaque;
  }

  #buildDgts(document, item, i18n, mainLabel, mainPath) {
    const dgts = [];

    dgts.push({
      type:'h2',
      i18n:`KNIGHT.BONUS.${mainLabel}`,
    });

    dgts.push({
      type:'number',
      i18n:'KNIGHT.BONUS.Fixe',
      name:`custom.${mainPath}.fixe`,
      value:document.custom[mainPath].fixe,
      min:0,
    });

    dgts.push({
      type:'numberWithSpan',
      i18n:'KNIGHT.BONUS.Jet',
      span:'KNIGHT.JETS.Des-short',
      name:`custom.${mainPath}.jet`,
      value:document.custom[mainPath].jet,
      min:0,
    });

    dgts.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.CaracFixe',
      name:`custom.${mainPath}.carac.fixe`,
      value:document.custom[mainPath].carac.fixe,
      choices:document.schema.getField(`custom.${mainPath}.carac.fixe`).choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    dgts.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.OdInclusFixe',
      name:`custom.${mainPath}.carac.odInclusFixe`,
      value:document.custom[mainPath].carac.odInclusFixe,
    });

    dgts.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.CaracJet',
      name:`custom.${mainPath}.carac.jet`,
      value:document.custom[mainPath].carac.jet,
      choices:document.schema.getField(`custom.${mainPath}.carac.jet`).choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    dgts.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.OdInclusJet',
      name:`custom.${mainPath}.carac.odInclusJet`,
      value:document.custom[mainPath].carac.odInclusJet,
    });

    dgts.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.AspectFixe',
      name:`custom.${mainPath}.aspect.fixe`,
      value:document.custom[mainPath].aspect.fixe,
      choices:document.schema.getField(`custom.${mainPath}.aspect.fixe`).choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    dgts.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.AeInclusFixe',
      name:`custom.${mainPath}.aspect.aeInclusFixe`,
      value:document.custom[mainPath].aspect.aeInclusFixe,
    });

    dgts.push({
      type:'select',
      i18n:'KNIGHT.EFFETS.CUSTOM.AspectJet',
      name:`custom.${mainPath}.aspect.jet`,
      value:document.custom[mainPath].aspect.jet,
      choices:document.schema.getField(`custom.${mainPath}.aspect.jet`).choices.map(k => ({ key: k, label:i18n[k]  })),
    });

    dgts.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.AeInclusJet',
      name:`custom.${mainPath}.aspect.aeInclusJet`,
      value:document.custom[mainPath].aspect.aeInclusJet,
    });

    dgts.push({
      type:'button',
      i18n:'KNIGHT.EFFETS.CUSTOM.Condition',
      name:`custom.${mainPath}.conditionnel.has`,
      hasHide:true,
      value:document.custom[mainPath].conditionnel.has,
    });

    dgts.push({
      type:'textarea',
      name:`custom.${mainPath}.conditionnel.condition`,
      hide:document.custom[mainPath].conditionnel.has,
      value:document.custom[mainPath].conditionnel.condition,
    });

    return dgts;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const system = this.system;
    const fields = system.schema.fields;

    console.error(system);

    return {
      ...context,
      ...this.#buildCustom(),
      document:this.document,
      system,
      fields,
      enriched:{
        description:await foundry.applications.ux.TextEditor.implementation.enrichHTML(system.custom.description, { async: true, }),
      }
    };
  }

  async #askCost(target) {
    const header = target.closest('.effect');
    const tgt = target.dataset;
    const label = tgt.label;
    const double = header.classList.contains('double');
    const text = header.classList.contains('text');
    const split = label.split(" ");
    const secondSplit = split[0].split("<space>");
    const allEffects = getAllEffects();
    const name = game.i18n.localize(allEffects[secondSplit[0]].label);
    const other = Object.values(secondSplit);
    let eName = name;
    let result = false;

    const askContent = await renderTemplate("systems/knight/templates/dialog/ask-sheet.html", {
      list:[
        {
          key:'number',
          label:`${game.i18n.localize("KNIGHT.EFFETS.Cost")} : `,
          class:'cost',
          min:0,
          value:0,
        }
      ],
    });
    const dialog = await foundry.applications.api.DialogV2.wait({
      window:{ title:eName },
      classes: ["dialog", "knight", "askdialog"],
      content: askContent,
      buttons:[
        {
          action:'yes',
          label:game.i18n.localize('KNIGHT.AUTRE.Ajouter'),
          callback:(event, button, dialog) => {
            const input = dialog.element.querySelector("label.cost input");
            const value = Number(input.value);

            result = value;
          }
        },
        {
          action:'no',
          label:game.i18n.localize('KNIGHT.AUTRE.Annuler'),
        }
      ]
    });

    return result;
  }

  #resetCustom() {
    const update = {};
    update['custom.edit'] = null;
    update['custom.label'] = "";
    update['custom.description'] = "";
    update['custom.attaque.reussite'] = 0;
    update['custom.attaque.jet'] = 0;
    update['custom.attaque.aspect.fixe'] = '';
    update['custom.attaque.aspect.jet'] = '';
    update['custom.attaque.aspect.aeInclusFixe'] = false;
    update['custom.attaque.aspect.aeInclusJet'] = false;
    update['custom.attaque.carac.fixe'] = '';
    update['custom.attaque.carac.jet'] = '';
    update['custom.attaque.carac.odInclusFixe'] = false;
    update['custom.attaque.carac.odInclusFixe'] = false;
    update['custom.attaque.conditionnel.has'] = false;
    update['custom.attaque.conditionnel.condition'] = '';

    update['custom.degats.fixe'] = 0;
    update['custom.degats.jet'] = 0;
    update['custom.degats.aspect.fixe'] = '';
    update['custom.degats.aspect.jet'] = '';
    update['custom.degats.aspect.aeInclusFixe'] = false;
    update['custom.degats.aspect.aeInclusJet'] = false;
    update['custom.degats.carac.fixe'] = '';
    update['custom.degats.carac.jet'] = '';
    update['custom.degats.carac.odInclusFixe'] = false;
    update['custom.degats.carac.odInclusFixe'] = false;
    update['custom.degats.conditionnel.has'] = false;
    update['custom.degats.conditionnel.condition'] = '';

    update['custom.violence.fixe'] = 0;
    update['custom.violence.jet'] = 0;
    update['custom.violence.aspect.fixe'] = '';
    update['custom.violence.aspect.jet'] = '';
    update['custom.violence.aspect.aeInclusFixe'] = false;
    update['custom.violence.aspect.aeInclusJet'] = false;
    update['custom.violence.carac.fixe'] = '';
    update['custom.violence.carac.jet'] = '';
    update['custom.violence.carac.odInclusFixe'] = false;
    update['custom.violence.carac.odInclusFixe'] = false;
    update['custom.violence.conditionnel.has'] = false;
    update['custom.violence.conditionnel.condition'] = '';

    update['custom.other.cdf'] = 0;

    this.system.update(update);
  }

  static async #onSubmit(event, form, formData, options={}) {
    await this.system.update(formData.object);

    this.render({ parts: ['custom'] });
  }
}